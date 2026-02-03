#include "sort.h"
#include "log_output.h"

void gnome_sort(int arr[], int n) {
    int i = 0;
    while (i < n) {
        if (i == 0) {
            i++;
            continue;
        }
        log_compare(i - 1, i);
        if (arr[i - 1] <= arr[i]) {
            i++;
        } else {
            int tmp = arr[i];
            arr[i] = arr[i - 1];
            arr[i - 1] = tmp;
            log_swap(i - 1, i, arr);
            i--;
        }
    }
}
