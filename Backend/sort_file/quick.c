#include "sort.h"

/* Lomuto partition */
static int partition(int arr[], int left, int right) {
    int pivot = arr[right];
    int i = left;  // pivot 未満(or以下)を詰める位置

    for (int j = left; j < right; j++) {
        /* arr[j] と pivot(arr[right]) を比較 */
        log_compare(j, right);

        if (arr[j] <= pivot) {
            if (i != j) {
                int tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
                log_swap(i, j, arr);
            } else {
                /* 位置が同じで実質交換なし */
                log_noswap(i, j);
            }
            i++;
        } else {
            /* pivot より大きいのでこの場では動かさない */
            log_noswap(j, right);
        }
    }

    /* pivot を確定位置 i に移動 */
    log_compare(i, right);
    if (i != right) {
        int tmp = arr[i];
        arr[i] = arr[right];
        arr[right] = tmp;
        log_swap(i, right, arr);
    } else {
        log_noswap(i, right);
    }

    return i;
}

void quick_sort(int arr[], int left, int right) {
    if (left >= right) return;

    int p = partition(arr, left, right);
    quick_sort(arr, left, p - 1);
    quick_sort(arr, p + 1, right);
}
