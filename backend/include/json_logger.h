#pragma once
#include <stddef.h>

void jl_reset(void);
void jl_append(const char *s);
void jl_append_n(const char *s, size_t n);
void jl_append_int(int v);

const char* jl_buf(void);
size_t jl_len(void);
