#include "../include/json_logger.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

static char *g_buf = NULL;
static size_t g_len = 0;
static size_t g_cap = 0;

static void ensure(size_t add) {
  size_t need = g_len + add + 1;
  if (need <= g_cap) return;
  size_t nc = (g_cap == 0) ? 4096 : g_cap * 2;
  while (nc < need) nc *= 2;
  char *nb = (char*)realloc(g_buf, nc);
  if (!nb) return;
  g_buf = nb;
  g_cap = nc;
}

void jl_reset(void) {
  g_len = 0;
  if (!g_buf) {
    g_cap = 4096;
    g_buf = (char*)malloc(g_cap);
  }
  if (g_buf) g_buf[0] = '\0';
}

void jl_append_n(const char *s, size_t n) {
  if (!s || n == 0) return;
  ensure(n);
  if (!g_buf) return;
  memcpy(g_buf + g_len, s, n);
  g_len += n;
  g_buf[g_len] = '\0';
}

void jl_append(const char *s) {
  if (!s) return;
  jl_append_n(s, strlen(s));
}

void jl_append_int(int v) {
  char tmp[64];
  snprintf(tmp, sizeof(tmp), "%d", v);
  jl_append(tmp);
}

const char* jl_buf(void) { return g_buf ? g_buf : ""; }
size_t jl_len(void) { return g_len; }
