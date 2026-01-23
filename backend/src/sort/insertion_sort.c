// 挿入ソート#include "sort.h"
#include "log_output.h"

// Insertion sort with step logging (uses set)
void insertion_sort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        // shift elements to the right
        while (j >= 0) {
            log_compare(j, i); // compare current element with the key position
            if (arr[j] > key) {
                arr[j + 1] = arr[j];
                log_set(j + 1, arr);
                j--;
            } else {
                break;
            }
        }
        arr[j + 1] = key;
        log_set(j + 1, arr);
    }
}
