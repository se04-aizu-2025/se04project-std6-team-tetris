#include "sort.h"
#include "log_output.h"
#include <stdlib.h>

static void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int *L = (int*)malloc(sizeof(int) * n1);
    int *R = (int*)malloc(sizeof(int) * n2);
    if (!L || !R) {
        free(L); free(R);
        return;
    }

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
        log_compare(left + i, mid + 1 + j);
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        log_set(k, arr);
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        log_set(k, arr);
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        log_set(k, arr);
        k++;
    }

    free(L);
    free(R);
}

void merge_sort(int arr[], int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    merge_sort(arr, left, mid);
    merge_sort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}
