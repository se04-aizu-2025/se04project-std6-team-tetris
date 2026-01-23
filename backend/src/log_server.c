#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include <winsock2.h>
#include <ws2tcpip.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stdlib.h>

#include "sort.h"
#include "log_output.h"

#pragma comment(lib, "Ws2_32.lib")

#define PORT 8081
#define REQ_BUF 65536
#define MAX_N 200

static void send_all(SOCKET s, const char *buf, int len) {
    int sent = 0;
    while (sent < len) {
        int n = send(s, buf + sent, len - sent, 0);
        if (n <= 0) return;
        sent += n;
    }
}

static void add_cors(char *h, int hs, int *n) {
    *n += snprintf(h + *n, hs - *n,
        "Access-Control-Allow-Origin: *\r\n"
        "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
        "Access-Control-Allow-Headers: Content-Type\r\n"
        "Cache-Control: no-store\r\n"
    );
}

static void send_text(SOCKET s, int code, const char *status, const char *body) {
    char h[1024];
    int bl = (int)strlen(body);
    int n = 0;

    n += snprintf(h + n, sizeof(h) - n,
        "HTTP/1.1 %d %s\r\n"
        "Content-Type: text/plain; charset=utf-8\r\n"
        "Content-Length: %d\r\n",
        code, status, bl
    );
    add_cors(h, (int)sizeof(h), &n);
    n += snprintf(h + n, sizeof(h) - n, "\r\n");

    send_all(s, h, n);
    send_all(s, body, bl);
}

static void send_json(SOCKET s, const char *json, int jl) {
    char h[1024];
    int n = 0;

    n += snprintf(h + n, sizeof(h) - n,
        "HTTP/1.1 200 OK\r\n"
        "Content-Type: application/json; charset=utf-8\r\n"
        "Content-Length: %d\r\n",
        jl
    );
    add_cors(h, (int)sizeof(h), &n);
    n += snprintf(h + n, sizeof(h) - n, "\r\n");

    send_all(s, h, n);
    send_all(s, json, jl);
}

static int content_length(const char *req) {
    const char *p = strstr(req, "Content-Length:");
    if (!p) return -1;
    p += (int)strlen("Content-Length:");
    while (*p == ' ') p++;
    return atoi(p);
}

static const char *header_end(const char *req) {
    const char *p = strstr(req, "\r\n\r\n");
    return p ? p + 4 : NULL;
}

// parse "method":"xxx"
static int parse_method(const char *json, char *out, int outsz) {
    const char *p = strstr(json, "\"method\"");
    if (!p) return 0;
    p = strchr(p, ':'); if (!p) return 0;
    p++;
    while (*p && isspace((unsigned char)*p)) p++;
    if (*p != '"') return 0;
    p++;
    const char *q = strchr(p, '"'); if (!q) return 0;

    int len = (int)(q - p);
    if (len <= 0 || len >= outsz) return 0;
    memcpy(out, p, len);
    out[len] = '\0';
    return 1;
}

// parse "array":[1,2,3]
static int parse_array(const char *json, int *arr, int maxn) {
    const char *p = strstr(json, "\"array\"");
    if (!p) return -1;
    p = strchr(p, '['); if (!p) return -1;
    p++;

    int n = 0;
    while (*p && n < maxn) {
        while (*p && (isspace((unsigned char)*p) || *p == ',')) p++;
        if (*p == ']') break;

        char *endp = NULL;
        long v = strtol(p, &endp, 10);
        if (endp == p) return -1;

        arr[n++] = (int)v;
        p = endp;
    }
    return n;
}

static int recv_full(SOCKET c, char *buf, int bufsz) {
    int total = 0;
    while (total < bufsz - 1) {
        int n = recv(c, buf + total, bufsz - 1 - total, 0);
        if (n <= 0) break;
        total += n;
        buf[total] = '\0';

        const char *b = header_end(buf);
        if (b) {
            int cl = content_length(buf);
            if (cl < 0) return total; // GETなど
            int hb = (int)(b - buf);
            int have = total - hb;
            if (have >= cl) return total;
        }
    }
    return total;
}

static void handle_sort(SOCKET c, const char *body) {
    char method[32];
    int arr[MAX_N];
    printf("BODY_LEN=%d\n", (int)strlen(body));
    printf("BODY=[%s]\n", body);
    fflush(stdout);


    if (!parse_method(body, method, (int)sizeof(method))) {
        send_text(c, 400, "Bad Request", "invalid method\n");
        return;
    }
    int n = parse_array(body, arr, MAX_N);
    if (n <= 0) {
        send_text(c, 400, "Bad Request", "invalid array\n");
        return;
    }

    start_log_mem(arr, n);

        if (strcmp(method, "selection") == 0) {
        selection_sort(arr, n);

    } else if (strcmp(method, "merge") == 0) {
        merge_sort(arr, 0, n - 1);

    } else if (strcmp(method, "gnome") == 0) {
        gnome_sort(arr, n);

    } else if (strcmp(method, "bubble") == 0) {
        bubble_sort(arr, n);

    } else if (strcmp(method, "insertion") == 0) {
        insertion_sort(arr, n);

    } else if (strcmp(method, "quick") == 0) {
        quick_sort(arr, 0, n - 1);

    } else {
        end_log();
        send_text(c, 400, "Bad Request", "unknown method\n");
        return;
    }


    end_log();

    size_t jl = 0;
    const char *json = get_log_json(&jl);
    if (!json) {
        send_text(c, 500, "Internal Server Error", "no json\n");
        return;
    }
    send_json(c, json, (int)jl);
    free_log_json();
}

static void handle_req(SOCKET c, const char *req) {
    char m[16] = {0}, p[256] = {0};
    if (sscanf(req, "%15s %255s", m, p) != 2) {
        send_text(c, 400, "Bad Request", "bad request\n");
        return;
    }

    if (strcmp(m, "OPTIONS") == 0) {
        char h[512];
        int n = 0;
        n += snprintf(h + n, sizeof(h) - n, "HTTP/1.1 204 No Content\r\n");
        add_cors(h, (int)sizeof(h), &n);
        n += snprintf(h + n, sizeof(h) - n, "\r\n");
        send_all(c, h, n);
        return;
    }

    if (strcmp(m, "GET") == 0 && strcmp(p, "/health") == 0) {
        send_text(c, 200, "OK", "OK\n");
        return;
    }

    if (strcmp(m, "POST") == 0 && strcmp(p, "/sort") == 0) {
        const char *b = header_end(req);
        if (!b) { send_text(c, 400, "Bad Request", "no body\n"); return; }
        handle_sort(c, b);
        return;
    }

    send_text(c, 404, "Not Found", "not found\n");
}

int main(void) {
    WSADATA wsa;
    WSAStartup(MAKEWORD(2,2), &wsa);

    SOCKET s = socket(AF_INET, SOCK_STREAM, 0);

    struct sockaddr_in a;
    memset(&a, 0, sizeof(a));
    a.sin_family = AF_INET;
    a.sin_port = htons(PORT);
    a.sin_addr.s_addr = INADDR_ANY;

    bind(s, (struct sockaddr*)&a, sizeof(a));
    listen(s, 16);

    printf("server: http://localhost:%d\n", PORT);

    while (1) {
        SOCKET c = accept(s, NULL, NULL);
        char req[REQ_BUF];
        int got = recv_full(c, req, (int)sizeof(req));
        if (got > 0) {
            req[got] = '\0';
            handle_req(c, req);
        }
        closesocket(c);
    }
}
