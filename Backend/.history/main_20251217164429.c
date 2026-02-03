#include <stdio.h>
#include <stdlib.h> // rand() と RAND_MAX を使うため
#include <time.h>   // time() を使うため
#include "myfunctions.h"

int main(void) {
    int arr[30];

    srand((unsigned)time(NULL));

    // 1から10までの乱数を10個生成
    printf("--- 0から10までの乱数 ---\n");
    for (int i = 0; i < 30; i++) {
        arr[i] = rand() % 100;
        printf("%d ", arr);
    }
    printf("\n");

    // selection(random_num);

}
