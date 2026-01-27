#include "sort.h"
#include "log_output.h"

static int partition_q(int arr[], int left, int right) {
    int pivot = arr[right];
    int i = left - 1;

    for (int j = left; j < right; j++) {
        log_compare(j, right); // compare arr[j] with pivot (at right)
        if (arr[j] <= pivot) {
            i++;
            if (i != j) {
                int tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
                log_swap(i, j, arr);
            } else {
                log_noswap(i, j);
            }
        }
    }

    // place pivot
    if (i + 1 != right) {
        int tmp = arr[i + 1];
        arr[i + 1] = arr[right];
        arr[right] = tmp;
        log_swap(i + 1, right, arr);
    } else {
        log_noswap(i + 1, right);
    }

    return i + 1;
}

void quick_sort(int arr[], int left, int right) {
    if (left >= right) return;
    int p = partition_q(arr, left, right);
    quick_sort(arr, left, p - 1);
    quick_sort(arr, p + 1, right);
}
