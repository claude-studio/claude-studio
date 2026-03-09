#!/bin/bash
SOCKET="$HOME/.claude/studio.sock"
[ -S "$SOCKET" ] || exit 0
cat | nc -U "$SOCKET" -w 1 2>/dev/null || true
