#include "sort.h"
#include <stdlib.h>

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
