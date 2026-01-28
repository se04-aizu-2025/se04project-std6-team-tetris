#include "../include/sort.h"
#include <string.h>

// quick / merge の実装側 wrapper（上の quick.c / merge.c にある）
void quick_sort_impl(int a[], int n);
void merge_sort_impl(int a[], int left, int right, int n);

int run_sort_method(const char *method, int arr[], int n) {
  if (!method) return 1;

  if (strcmp(method, "quick") == 0) { quick_sort_impl(arr, n); return 0; }
  if (strcmp(method, "merge") == 0) { merge_sort_impl(arr, 0, n - 1, n); return 0; }
  if (strcmp(method, "selection") == 0) { selection_sort(arr, n); return 0; }
  if (strcmp(method, "gnome") == 0) { gnome_sort(arr, n); return 0; }
  if (strcmp(method, "bubble") == 0) { bubble_sort(arr, n); return 0; }
  if (strcmp(method, "insertion") == 0) { insertion_sort(arr, n); return 0; }

  return 1;
}
