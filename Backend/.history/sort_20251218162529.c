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

#include <stdio.h>
#include <stdlib.h>

// 配列をマージする関数
void marge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int *L = malloc(n1 * sizeof(int));
    int *R = malloc(n2 * sizeof(int));

    // 左右にコピー
    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;

    // マージ
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }

    // 残りをコピー
    while (i < n1) {
        arr[k++] = L[i++];
    }
    while (j < n2) {
        arr[k++] = R[j++];
    }

    free(L);
    free(R);
}

// マージソート本体
void marge_sort(int arr[], int left, int right) {
    if (left < right) {
        int mid = (left + right) / 2;

        marge_sort(arr, left, mid);
        marge_sort(arr, mid + 1, right);

        marge(arr, left, mid, right);
    }
}

void gnome(int arr[], int n) {
    int i = 0;

    while (i < n) {
        if (i == 0) {
            i++;
        } else if (arr[i] >= arr[i - 1]) {
            i++;                // OKなら進む
        } else {
            // 逆なら交換して戻る
            int temp = arr[i];
            arr[i] = arr[i - 1];
            arr[i - 1] = temp;
            i--;
        }
    }
}


int main(void){

    int arr[] = {1,47,31,57,35,23,21,35,31,49,94};
    int n = 11;

    //marge_sort(arr, 0, n - 1);
    //gnome(arr, n);
    //selection(arr,n);

    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }


}
