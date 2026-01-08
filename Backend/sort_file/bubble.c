#include "sort.h"

void bubble(int arr[], int n) {
    for (int end = n - 1; end > 0; end--) {
        for (int j = 0; j < end; j++) {
            log_compare(j, j + 1);

            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;

                log_swap(j, j + 1, arr);
            } else {
                log_noswap(j, j + 1);
            }
        }
    }
}
