#include "sort.h"
#include "log_output.h"

void selection_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min = i;
        for (int j = i + 1; j < n; j++) {
            log_compare(min, j);
            if (arr[j] < arr[min]) {
                min = j;
            }
        }
        if (min != i) {
            int tmp = arr[i];
            arr[i] = arr[min];
            arr[min] = tmp;
            log_swap(i, min, arr);
        } else {
            log_noswap(i, min);
        }
    }
}
