#include "sort.h"

void insertion(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        while (j >= 0) {
            // key と arr[j] を比較している、という意味で i と j を残す
            log_compare(i, j);

            if (arr[j] > key) {
                // 右へシフト
                arr[j + 1] = arr[j];
                log_set(j + 1, arr);
                j--;
            } else {
                // これ以上動かさない
                log_noswap(i, j);
                break;
            }
        }

        // 挿入
        arr[j + 1] = key;
        log_set(j + 1, arr);
    }
}
