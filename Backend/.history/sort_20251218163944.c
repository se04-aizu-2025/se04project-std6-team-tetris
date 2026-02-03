// #include "myfunctions.h"

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

FILE *log_fp = NULL;
bool first_step = true;
int g_n = 0;  // 配列の長さを覚えておく

void start_log(const int arr[], int n) {
    g_n = n;
    log_fp = fopen("sort_log.json", "w");
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

void selection(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_index = i;

        for (int j = i + 1; j < n; j++) {
            log_compare(j, min_index); 
            if (arr[j] < arr[min_index]) {
                min_index = j;
            }else {
                log_noswap(j, min_index);       // 交換なしログ
            }
        }

        // 最小値を先頭と交換
        if (min_index != i) {
            int temp = arr[i];
            arr[i] = arr[min_index];
            arr[min_index] = temp;

            log_swap(i, min_index, arr);
        }
    }
}

void marge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int *L = malloc(n1 * sizeof(int));
    int *R = malloc(n2 * sizeof(int));

    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;

    // マージ
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            log_set(k, arr);
            i++;
        } else {
            arr[k] = R[j];
            log_set(k, arr);
            j++;
        }
    }

    // 残りをコピー
    while (i < n1) {
        arr[k++] = L[i++];
    }
    while (j < n2) {
        arr[k++] = R[j++];
    }

    free(L);
    free(R);
}

void marge_sort(int arr[], int left, int right) {
    if (left < right) {
        int mid = (left + right) / 2;

        marge_sort(arr, left, mid);
        marge_sort(arr, mid + 1, right);

        marge(arr, left, mid, right);
    }
}

void gnome(int arr[], int n) {
    int i = 0;

    while (i < n) {
        if (i == 0) {
            i++;
        } else {
            log_compare(i - 1, i);  // 比較ログ

            if (arr[i] >= arr[i - 1]) {
                log_noswap(i - 1, i);          // 交換なし
                i++;                // OKなら進む
            } else {
                // 逆なら交換して戻る
                int temp = arr[i];
                arr[i] = arr[i - 1];
                arr[i - 1] = temp;

                log_swap(i - 1, i, arr);       // 交換ログ
                i--;
            }
        }
    }
}

int main(void){

    int arr[] = {1,47,31,57,35,23,21,35,31,49,94};
    int n = sizeof(arr) / sizeof(arr[0]);

    start_log(arr, n);
    //marge_sort(arr, 0, n - 1);
    //gnome(arr, n);
    //selection(arr,n);

    end_log(); 
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }


}
