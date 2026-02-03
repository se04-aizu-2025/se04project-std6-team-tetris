#include "../include/array.h"
#include <stdlib.h>
#include <string.h>

int* array_dup(const int *src, size_t n) {
  int *p = (int*)malloc(sizeof(int) * n);
  if (!p) return NULL;
  memcpy(p, src, sizeof(int) * n);
  return p;
}
