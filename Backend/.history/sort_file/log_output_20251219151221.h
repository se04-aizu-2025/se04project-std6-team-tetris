#ifndef LOG_OUTPUT_H
#define LOG_OUTPUT_H

#include <stdio.h>

void start_log(const char *basename,const int arr[], int n);
void end_log(void);
void log_compare(int i, int j) ;
void log_noswap(int i, int j) ;
void log_swap(int i, int j, const int arr[]) ;
void log_set(int k, const int arr[]);

#endif
