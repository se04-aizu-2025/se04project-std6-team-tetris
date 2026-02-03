CC := gcc
CFLAGS := -I ./include -O2 -Wall -Wextra
LDFLAGS := -mconsole
LIBS := -lws2_32

SRC := $(wildcard src/*.c) $(wildcard src/sort/*.c)
OUT := log_server.exe

all: $(OUT)

$(OUT): $(SRC)
	$(CC) $(CFLAGS) $(SRC) -o $@ $(LDFLAGS) $(LIBS)

clean:
	del /q $(OUT) 2>nul || exit 0

.PHONY: all clean
