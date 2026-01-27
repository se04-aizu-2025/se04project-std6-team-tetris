CC := gcc
CFLAGS := -I ./include -O2 -Wall -Wextra
LDFLAGS := -mconsole
LIBS :=

SRC := $(wildcard src/*.c)
OUT := log_server.exe

all: $(OUT)

$(OUT): $(SRC)
	$(CC) $(CFLAGS) $(SRC) -o $@ $(LDFLAGS) $(LIBS)

clean:
	del /q $(OUT) 2>nul || exit 0

.PHONY: all clean
