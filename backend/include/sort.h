#pragma once

void quick_sort(int arr[], int left, int right);
void merge_sort(int arr[], int left, int right);
void selection_sort(int arr[], int n);
void gnome_sort(int arr[], int n);
void bubble_sort(int arr[], int n);
void insertion_sort(int arr[], int n);

int run_sort_method(const char *method, int arr[], int n);

void quick_sort_impl(int arr[], int n);
void merge_sort_impl(int arr[], int left, int right, int n);