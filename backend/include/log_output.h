#pragma once

// 初期配列と配列長をセット（ここで n を内部保持する）
void start_log_buffer(const int *arr, int n);
void end_log_buffer(void);

void log_compare(int i, int j);
void log_noswap(int i, int j);

// ★ n は渡さない（内部保持）
void log_swap(int i, int j, const int *arr);
void log_set(int i, const int *arr);

const char* get_log_json(void);
int get_log_json_len(void);
