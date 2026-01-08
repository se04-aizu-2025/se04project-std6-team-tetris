
#ifndef SORT_H
#define SORT_H

#include "log_output.h"

void selection(int arr[], int n);
void marge(int arr[], int left, int mid, int right);
void marge_sort(int arr[], int left, int right);
void gnome(int arr[], int n);
void bubble(int arr[], int n);
void insertion(int arr[], int n);
void quick_sort(int arr[], int left, int right);

#endif 
