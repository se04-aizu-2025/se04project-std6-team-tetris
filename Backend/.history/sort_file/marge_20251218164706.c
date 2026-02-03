void marge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int *L = malloc(n1 * sizeof(int));
    int *R = malloc(n2 * sizeof(int));

    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;

    // マージ
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            log_set(k, arr);
            i++;
        } else {
            arr[k] = R[j];
            log_set(k, arr);
            j++;
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

void marge_sort(int arr[], int left, int right) {
    if (left < right) {
        int mid = (left + right) / 2;

        marge_sort(arr, left, mid);
        marge_sort(arr, mid + 1, right);

        marge(arr, left, mid, right);
    }
}
