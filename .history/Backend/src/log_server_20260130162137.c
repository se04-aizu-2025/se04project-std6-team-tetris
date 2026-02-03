#ifdef _WIN32
  #define _WINSOCK_DEPRECATED_NO_WARNINGS
  #include <winsock2.h>
  #include <ws2tcpip.h>
  typedef SOCKET socket_t;
  #define CLOSESOCK closesocket
#else
  #include <sys/types.h>
  #include <sys/socket.h>
  #include <netinet/in.h>
  #include <arpa/inet.h>
  #include <unistd.h>
  #include <errno.h>
  typedef int socket_t;
  #define INVALID_SOCKET (-1)
  #define CLOSESOCK close
#endif

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "../include/array.h"
#include "../include/sort.h"
#include "../include/log_output.h"

static int send_all(socket_t s, const char *buf, int len) {
  int sent = 0;
  while (sent < len) {
    int r = (int)send(s, buf + sent, (size_t)(len - sent), 0);
    if (r <= 0) return 1;
    sent += r;
  }
  return 0;
}

static void send_text(socket_t c, int code, const char *msg) {
  const char *status =
    (code == 200) ? "200 OK" :
    (code == 204) ? "204 No Content" :
    (code == 400) ? "400 Bad Request" :
    (code == 404) ? "404 Not Found" :
    "500 Internal Server Error";

  int len = msg ? (int)strlen(msg) : 0;
  char header[512];
  snprintf(header, sizeof(header),
    "HTTP/1.1 %s\r\n"
    "Content-Type: text/plain\r\n"
    "Access-Control-Allow-Origin: *\r\n"
    "Access-Control-Allow-Headers: Content-Type\r\n"
    "Access-Control-Allow-Methods: POST, OPTIONS\r\n"
    "Content-Length: %d\r\n\r\n",
    status, len
  );
  send_all(c, header, (int)strlen(header));
  if (len) send_all(c, msg, len);
}

static void send_json(socket_t c, const char *json, int json_len) {
  char header[512];
  snprintf(header, sizeof(header),
    "HTTP/1.1 200 OK\r\n"
    "Content-Type: application/json\r\n"
    "Access-Control-Allow-Origin: *\r\n"
    "Access-Control-Allow-Headers: Content-Type\r\n"
    "Access-Control-Allow-Methods: POST, OPTIONS\r\n"
    "Content-Length: %d\r\n\r\n",
    json_len
  );
  send_all(c, header, (int)strlen(header));
  send_all(c, json, json_len);
}

static void send_preflight(socket_t c) {
  const char *res =
    "HTTP/1.1 204 No Content\r\n"
    "Access-Control-Allow-Origin: *\r\n"
    "Access-Control-Allow-Headers: Content-Type\r\n"
    "Access-Control-Allow-Methods: POST, OPTIONS\r\n"
    "Content-Length: 0\r\n\r\n";
  send_all(c, res, (int)strlen(res));
}

static int starts_with(const char *s, const char *prefix) {
  return strncmp(s, prefix, (int)strlen(prefix)) == 0;
}

static int parse_content_length(const char *req) {
  const char *p = strstr(req, "Content-Length:");
  if (!p) return -1;
  p += (int)strlen("Content-Length:");
  while (*p == ' ') p++;
  return atoi(p);
}

static int has_chunked_encoding(const char *req) {
  const char *p = strstr(req, "Transfer-Encoding:");
  if (!p) return 0;
  return strstr(p, "chunked") != NULL;
}

static char* find_header_end(char *req) {
  char *p = strstr(req, "\r\n\r\n");
  return p ? (p + 4) : NULL;
}

static int ensure_cap(char **buf, int *cap, int need) {
  if (need <= *cap) return 0;
  int nc = (*cap == 0) ? 8192 : (*cap * 2);
  while (nc < need) nc *= 2;
  char *nb = (char*)realloc(*buf, (size_t)nc);
  if (!nb) return 1;
  *buf = nb;
  *cap = nc;
  return 0;
}

static int recv_more(socket_t c, char **buf, int *cap, int *len, int want) {
  if (ensure_cap(buf, cap, *len + want + 1) != 0) return 1;
  int r = (int)recv(c, *buf + *len, (size_t)want, 0);
  if (r <= 0) return 1;
  *len += r;
  (*buf)[*len] = '\0';
  return 0;
}

static int decode_chunked(const char *in, int in_len, char **out, int *out_len) {
  int pos = 0;
  int cap = 0;
  int len = 0;
  char *buf = NULL;

  while (pos < in_len) {
    int line_start = pos;
    int line_end = -1;
    for (int i = pos; i + 1 < in_len; i++) {
      if (in[i] == '\r' && in[i+1] == '\n') { line_end = i; break; }
    }
    if (line_end < 0) { free(buf); return 1; }

    char tmp[32];
    int line_len = line_end - line_start;
    if (line_len <= 0 || line_len >= (int)sizeof(tmp)) { free(buf); return 1; }
    memcpy(tmp, in + line_start, (size_t)line_len);
    tmp[line_len] = '\0';

    unsigned chunk_sz = 0;
    char *semi = strchr(tmp, ';');
    if (semi) *semi = '\0';
    if (sscanf(tmp, "%x", &chunk_sz) != 1) { free(buf); return 1; }

    pos = line_end + 2;

    if (chunk_sz == 0) {
      *out = buf ? buf : (char*)calloc(1,1);
      *out_len = len;
      return 0;
    }

    if (pos + (int)chunk_sz > in_len) { free(buf); return 1; }

    if (ensure_cap(&buf, &cap, len + (int)chunk_sz + 1) != 0) { free(buf); return 1; }
    memcpy(buf + len, in + pos, chunk_sz);
    len += (int)chunk_sz;
    buf[len] = '\0';

    pos += (int)chunk_sz;

    if (!(pos + 1 < in_len && in[pos] == '\r' && in[pos+1] == '\n')) { free(buf); return 1; }
    pos += 2;
  }

  free(buf);
  return 1;
}

static int recv_http_body(socket_t c, char **out_body, int *out_body_len, char **out_req_debug) {
  char *req = NULL;
  int cap = 0, len = 0;

  for (;;) {
    if (recv_more(c, &req, &cap, &len, 4096) != 0) { free(req); return 1; }
    if (strstr(req, "\r\n\r\n")) break;
    if (len > 200000) { free(req); return 1; }
  }

  char *body_ptr = find_header_end(req);
  if (!body_ptr) { free(req); return 1; }

  int header_len = (int)(body_ptr - req);
  int have = len - header_len;

  int content_len = parse_content_length(req);
  int chunked = has_chunked_encoding(req);

  if (content_len >= 0) {
    while (have < content_len) {
      if (recv_more(c, &req, &cap, &len, 4096) != 0) { free(req); return 1; }
      have = len - header_len;
    }
    char *body = (char*)malloc((size_t)content_len + 1);
    if (!body) { free(req); return 1; }
    memcpy(body, body_ptr, (size_t)content_len);
    body[content_len] = '\0';
    *out_body = body;
    *out_body_len = content_len;
  } else if (chunked) {
    for (;;) {
      const char *body_all = req + header_len;
      int body_all_len = len - header_len;
      if (body_all_len >= 5 && strstr(body_all, "\r\n0\r\n\r\n")) break;
      if (recv_more(c, &req, &cap, &len, 4096) != 0) { free(req); return 1; }
      if (len > 4000000) { free(req); return 1; }
    }

    const char *chunk_body = req + header_len;
    int chunk_body_len = len - header_len;

    char *decoded = NULL;
    int decoded_len = 0;
    if (decode_chunked(chunk_body, chunk_body_len, &decoded, &decoded_len) != 0) {
      free(req);
      return 1;
    }
    *out_body = decoded;
    *out_body_len = decoded_len;
  } else {
    if (have < 0) { free(req); return 1; }
    char *body = (char*)malloc((size_t)have + 1);
    if (!body) { free(req); return 1; }
    if (have > 0) memcpy(body, body_ptr, (size_t)have);
    body[have] = '\0';
    *out_body = body;
    *out_body_len = have;
  }

  if (out_req_debug) *out_req_debug = req;
  else free(req);
  return 0;
}

static int parse_method(const char *body, char *out, size_t outsz) {
  const char *p = strstr(body, "\"method\"");
  if (!p) return 1;
  p = strchr(p, ':'); if (!p) return 1;
  p++;
  while (*p && (*p==' '||*p=='\n'||*p=='\r'||*p=='\t')) p++;
  if (*p != '"') return 1;
  p++;
  const char *q = strchr(p, '"');
  if (!q) return 1;
  size_t l = (size_t)(q - p);
  if (l + 1 > outsz) l = outsz - 1;
  memcpy(out, p, l);
  out[l] = '\0';
  return 0;
}

static int parse_array(const char *body, int **out_arr, int *out_n) {
  const char *p = strstr(body, "\"array\"");
  if (!p) return 1;
  p = strchr(p, '['); if (!p) return 1;
  p++;

  int cap = 64, n = 0;
  int *arr = (int*)malloc(sizeof(int) * (size_t)cap);
  if (!arr) return 1;

  while (*p && *p != ']') {
    while (*p==' '||*p=='\n'||*p=='\r'||*p=='\t'||*p==',') p++;
    if (*p == ']') break;

    char *end = NULL;
    long v = strtol(p, &end, 10);
    if (end == p) { free(arr); return 1; }

    if (n >= cap) {
      cap *= 2;
      int *na = (int*)realloc(arr, sizeof(int) * (size_t)cap);
      if (!na) { free(arr); return 1; }
      arr = na;
    }
    arr[n++] = (int)v;
    p = end;
  }

  if (*p != ']') { free(arr); return 1; }
  *out_arr = arr;
  *out_n = n;
  return 0;
}

static int handle_client(socket_t c) {
  char *body = NULL;
  int body_len = 0;
  char *req_debug = NULL;

  if (recv_http_body(c, &body, &body_len, &req_debug) != 0) {
    send_text(c, 400, "Bad Request");
    free(req_debug);
    return 0;
  }

  if (req_debug && starts_with(req_debug, "OPTIONS ")) {
    send_preflight(c);
    free(body);
    free(req_debug);
    return 0;
  }

  if (!(req_debug && starts_with(req_debug, "POST /sort "))) {
    send_text(c, 404, "Not Found");
    free(body);
    free(req_debug);
    return 0;
  }

  char method[32];
  int *arr = NULL;
  int n = 0;

  if (parse_method(body, method, sizeof(method)) != 0 ||
      parse_array(body, &arr, &n) != 0 || n <= 0) {
    free(body);
    free(arr);
    free(req_debug);
    send_text(c, 400, "Invalid JSON");
    return 0;
  }
  free(body);
  free(req_debug);

  int *work = array_dup(arr, (size_t)n);
  if (!work) {
    free(arr);
    send_text(c, 500, "Error");
    return 0;
  }

  start_log_buffer(arr, n);

  int rc = run_sort_method(method, work, n);
  if (rc != 0) {
    free(arr);
    free(work);
    send_text(c, 400, "Unknown method");
    return 0;
  }

  end_log_buffer();

  const char *json = get_log_json();
  int json_len = get_log_json_len();
  send_json(c, json, json_len);

  free(arr);
  free(work);
  return 0;
}

int run_log_server_8081(void) {
#ifdef _WIN32
  WSADATA wsa;
  if (WSAStartup(MAKEWORD(2,2), &wsa) != 0) {
    fprintf(stderr, "WSAStartup failed\n");
    return 1;
  }
#endif

  socket_t s = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
  if (s == INVALID_SOCKET) {
    fprintf(stderr, "socket failed\n");
#ifdef _WIN32
    WSACleanup();
#endif
    return 1;
  }

  struct sockaddr_in addr;
  memset(&addr, 0, sizeof(addr));
  addr.sin_family = AF_INET;
  addr.sin_port = htons(8081);
  addr.sin_addr.s_addr = htonl(INADDR_ANY);

  int opt = 1;
  setsockopt(s, SOL_SOCKET, SO_REUSEADDR, (const char*)&opt, (socklen_t)sizeof(opt));

  if (bind(s, (struct sockaddr*)&addr, (socklen_t)sizeof(addr)) != 0) {
    fprintf(stderr, "bind failed\n");
    CLOSESOCK(s);
#ifdef _WIN32
    WSACleanup();
#endif
    return 1;
  }

  if (listen(s, 16) != 0) {
    fprintf(stderr, "listen failed\n");
    CLOSESOCK(s);
#ifdef _WIN32
    WSACleanup();
#endif
    return 1;
  }

  printf("backend listening on http://127.0.0.1:8081\n");

  for (;;) {
    socket_t c = accept(s, NULL, NULL);
    if (c == INVALID_SOCKET) continue;
    handle_client(c);
    CLOSESOCK(c);
  }

  CLOSESOCK(s);
#ifdef _WIN32
  WSACleanup();
#endif
  return 0;
}

