#include <stdio.h>
// #include "myfunctions.h"


void selection(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_index = i;

        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_index]) {
                min_index = j;
            }
        }

        // 最小値を先頭と交換
        if (min_index != i) {
            int temp = arr[i];
            arr[i] = arr[min_index];
            arr[min_index] = temp;
        }
    }
}

int marge(int size){
    int *arr = (int*)malloc(size * sizeof(int));
    return arr;
}

int gnome(int size){
    int *arr = (int*)malloc(size * sizeof(int));
    return arr;
}


int main(void){

    int arr[] = {1,47,31,57,35,23,21,35,31,49,94};
    int n = 11;
    selection(arr,n);

    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }


}
