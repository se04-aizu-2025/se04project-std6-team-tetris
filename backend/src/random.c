#include "../include/random.h"
#include <stdlib.h>

int rand_int(int min, int max) {
  if (max <= min) return min;
  int r = rand();
  return min + (r % (max - min + 1));
}
