#ifndef LOG_OUTPUT_H
#define LOG_OUTPUT_H

#include <stddef.h>

void start_log_mem(const int arr[], int n);
void end_log(void);

void log_compare(int i, int j);
void log_noswap(int i, int j);
void log_swap(int i, int j, const int arr[]);
void log_set(int k, const int arr[]);

const char *get_log_json(size_t *out_len);
void free_log_json(void);

#endif
