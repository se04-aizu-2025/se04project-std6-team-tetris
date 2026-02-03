#include "sort.h"
#include "log_output.h"

// Bubble sort with step logging
void bubble_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - 1 - i; j++) {
            log_compare(j, j + 1);
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
                log_swap(j, j + 1, arr);
                swapped = 1;
            } else {
                log_noswap(j, j + 1);
            }
        }
        if (!swapped) break;
    }
}
