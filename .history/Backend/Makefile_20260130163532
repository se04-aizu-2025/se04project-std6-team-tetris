CC := gcc
CFLAGS := -I ./include -O2 -Wall -Wextra
SRC := $(wildcard src/*.c) $(wildcard src/sort/*.c)

UNAME_S := $(shell uname -s)

# default (Linux/mac)
OUT := server
LDFLAGS :=
LIBS :=

# macOS
ifeq ($(UNAME_S),Darwin)
  OUT := server
  LDFLAGS :=
  LIBS :=

# Windows (MSYS/MinGW/Git Bash)
else ifneq (,$(findstring MINGW,$(UNAME_S)))
  OUT := log_server.exe
  LDFLAGS := -mconsole
  LIBS := -lws2_32
else ifneq (,$(findstring MSYS,$(UNAME_S)))
  OUT := log_server.exe
  LDFLAGS := -mconsole
  LIBS := -lws2_32
else ifneq (,$(findstring CYGWIN,$(UNAME_S)))
  OUT := log_server.exe
  LDFLAGS := -mconsole
  LIBS := -lws2_32
endif

all: $(OUT)

$(OUT): $(SRC)
	$(CC) $(CFLAGS) $(SRC) -o $@ $(LDFLAGS) $(LIBS)

clean:
	@rm -f $(OUT) 2>/dev/null || del /q $(OUT) 2>nul || exit 0

.PHONY: all clean
