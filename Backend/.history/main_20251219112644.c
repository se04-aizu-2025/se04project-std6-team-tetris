#include <stdio.h>
#include <stdlib.h> // rand() と RAND_MAX を使うため
#include <time.h>   // time() を使うため
#include <stdbool.h>
#include "myfunctions.h"

// #include "myfunctions.h"

FILE *log_fp = NULL;
bool first_step = true;
int g_n = 0;  // 配列の長さを覚えておく

int main(void){

    int arr[] = {1,47,31,57,35,23,21,35,31,49,94};
    int n = sizeof(arr) / sizeof(arr[0]);

    start_log(arr, n);
    //marge_sort(arr, 0, n - 1);
    //gnome(arr, n);
    //selection(arr,n);


    end_log(); 
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }


}
