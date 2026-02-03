#include "sort.h"

void selection(int arr[], int n){

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
