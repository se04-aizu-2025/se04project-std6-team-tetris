#include "log_output.h"
#include <stdio.h>
#include <stdlib.h>  
#include <stdbool.h>

static FILE *log_fp = NULL;
bool first_step = true;
int g_n = 0;  // 配列の長さを覚えておく

void start_log(const char *filename,const int arr[], int n) {
    g_n = n;
    log_fp = fopen(filename, "w");
    if (!log_fp) {
        perror("fopen");
        exit(1);
    }

    // initialArray
    fprintf(log_fp, "{\n  \"initialArray\": [");
    for (int i = 0; i < n; i++) {
        if (i > 0) fprintf(log_fp, ",");
        fprintf(log_fp, "%d", arr[i]);
    }
    fprintf(log_fp, "],\n  \"steps\": [\n");

    first_step = true;
}

void end_log(void) {
    fprintf(log_fp, "\n  ]\n}\n");
    fclose(log_fp);
}

// 共通：ステップを書き出すヘルパー
void write_step_prefix(void) {
    if (!first_step) {
        fprintf(log_fp, ",\n");
    }
    first_step = false;
}

// 比較
void log_compare(int i, int j) {
    write_step_prefix();
    fprintf(log_fp,
            "    { \"type\": \"compare\", \"i\": %d, \"j\": %d }",
            i, j);
}

// 交換なし
void log_noswap(int i, int j) {
    write_step_prefix();
    fprintf(log_fp,
            "    { \"type\": \"noswap\", \"i\": %d, \"j\": %d }",
            i, j);
}

// 交換（配列の状態も書く）
void log_swap(int i, int j, const int arr[]) {
    write_step_prefix();
    fprintf(log_fp,
            "    { \"type\": \"swap\", \"i\": %d, \"j\": %d, \"array\": [",
            i, j);

    for (int k = 0; k < g_n; k++) {
        if (k > 0) fprintf(log_fp, ",");
        fprintf(log_fp, "%d", arr[k]);
    }
    fprintf(log_fp, "] }");
}


void log_set(int k, const int arr[]) {
    write_step_prefix();
    fprintf(log_fp,
            "    { \"type\": \"set\", \"i\": %d, \"array\": [", k);
    for (int t = 0; t < g_n; t++) {
        if (t > 0) fprintf(log_fp, ",");
        fprintf(log_fp, "%d", arr[t]);
    }
    fprintf(log_fp, "] }");
}

