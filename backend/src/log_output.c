#include "../include/log_output.h"
#include "../include/json_logger.h"
#include <stdbool.h>

static bool first_step = true;
static int g_n = 0;

static void step_prefix(void) {
  if (!first_step) jl_append(",\n");
  first_step = false;
}

void start_log_buffer(const int *arr, int n) {
  jl_reset();
  first_step = true;
  g_n = n;

  jl_append("{\n  \"initialArray\": [");
  for (int i = 0; i < n; i++) {
    if (i) jl_append(",");
    jl_append_int(arr[i]);
  }
  jl_append("],\n  \"steps\": [\n");
}

void end_log_buffer(void) {
  jl_append("\n  ]\n}\n");
}

void log_compare(int i, int j) {
  step_prefix();
  jl_append("    { \"type\": \"compare\", \"i\": ");
  jl_append_int(i);
  jl_append(", \"j\": ");
  jl_append_int(j);
  jl_append(" }");
}

void log_noswap(int i, int j) {
  step_prefix();
  jl_append("    { \"type\": \"noswap\", \"i\": ");
  jl_append_int(i);
  jl_append(", \"j\": ");
  jl_append_int(j);
  jl_append(" }");
}

void log_swap(int i, int j, const int *arr) {
  step_prefix();
  jl_append("    { \"type\": \"swap\", \"i\": ");
  jl_append_int(i);
  jl_append(", \"j\": ");
  jl_append_int(j);
  jl_append(", \"array\": [");
  for (int k = 0; k < g_n; k++) {
    if (k) jl_append(",");
    jl_append_int(arr[k]);
  }
  jl_append("] }");
}

void log_set(int i, const int *arr) {
  (void)i;
  step_prefix();
  jl_append("    { \"type\": \"set\", \"i\": ");
  jl_append_int(i);
  jl_append(", \"array\": [");
  for (int k = 0; k < g_n; k++) {
    if (k) jl_append(",");
    jl_append_int(arr[k]);
  }
  jl_append("] }");
}

const char* get_log_json(void) { return jl_buf(); }
int get_log_json_len(void) { return (int)jl_len(); }
