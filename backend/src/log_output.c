#include "log_output.h"
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <stdarg.h>
#include <string.h>

static char *g_buf = NULL;
static size_t g_len = 0;
static size_t g_cap = 0;

static bool g_first_step = true;
static int g_n = 0;

static void die(const char *msg) {
    fprintf(stderr, "%s\n", msg);
    exit(1);
}

static void reserve(size_t add) {
    if (g_len + add + 1 <= g_cap) return;
    size_t nc = g_cap ? g_cap : 4096;
    while (nc < g_len + add + 1) nc *= 2;
    char *p = (char*)realloc(g_buf, nc);
    if (!p) die("realloc failed");
    g_buf = p;
    g_cap = nc;
}

static void out_write(const char *s, size_t n) {
    reserve(n);
    memcpy(g_buf + g_len, s, n);
    g_len += n;
    g_buf[g_len] = '\0';
}

static void out_printf(const char *fmt, ...) {
    char tmp[2048];
    va_list ap;
    va_start(ap, fmt);
    int n = vsnprintf(tmp, sizeof(tmp), fmt, ap);
    va_end(ap);

    if (n < 0) die("vsnprintf failed");
    if ((size_t)n < sizeof(tmp)) {
        out_write(tmp, (size_t)n);
        return;
    }

    char *buf = (char*)malloc((size_t)n + 1);
    if (!buf) die("malloc failed");

    va_start(ap, fmt);
    vsnprintf(buf, (size_t)n + 1, fmt, ap);
    va_end(ap);

    out_write(buf, (size_t)n);
    free(buf);
}

void start_log_mem(const int arr[], int n) {
    free(g_buf);
    g_buf = NULL;
    g_len = 0;
    g_cap = 0;

    g_n = n;
    g_first_step = true;

    out_printf("{\n  \"initialArray\": [");
    for (int i = 0; i < n; i++) {
        if (i > 0) out_printf(",");
        out_printf("%d", arr[i]);
    }
    out_printf("],\n  \"steps\": [\n");
}

static void step_prefix(void) {
    if (!g_first_step) out_printf(",\n");
    g_first_step = false;
}

void log_compare(int i, int j) {
    step_prefix();
    out_printf("    { \"type\": \"compare\", \"i\": %d, \"j\": %d }", i, j);
}

void log_noswap(int i, int j) {
    step_prefix();
    out_printf("    { \"type\": \"noswap\", \"i\": %d, \"j\": %d }", i, j);
}

void log_swap(int i, int j, const int arr[]) {
    step_prefix();
    out_printf("    { \"type\": \"swap\", \"i\": %d, \"j\": %d, \"array\": [", i, j);
    for (int k = 0; k < g_n; k++) {
        if (k > 0) out_printf(",");
        out_printf("%d", arr[k]);
    }
    out_printf("] }");
}

void log_set(int k, const int arr[]) {
    step_prefix();
    out_printf("    { \"type\": \"set\", \"i\": %d, \"array\": [", k);
    for (int t = 0; t < g_n; t++) {
        if (t > 0) out_printf(",");
        out_printf("%d", arr[t]);
    }
    out_printf("] }");
}

void end_log(void) {
    out_printf("\n  ]\n}\n");
}

const char *get_log_json(size_t *out_len) {
    if (!g_buf) return NULL;
    if (out_len) *out_len = g_len;
    return g_buf;
}

void free_log_json(void) {
    free(g_buf);
    g_buf = NULL;
    g_len = 0;
    g_cap = 0;
}
