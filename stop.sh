#!/bin/bash

# Stops the Askerisk app: the Electron window and the Flask backend.
# (A future /quit-askerisk command should replace this.)

PROJECT_DIR="$HOME/Documents/Code/askerisk"

# Electron: the main process and its helpers (zygote, gpu, renderer, ...)
# all run from the project's node_modules, so one path matches every one of them.
pkill -f "$PROJECT_DIR/node_modules/electron/dist/electron"

# Flask backend: match only a bare `python3 api.py` command line (so editors
# with api.py open are left alone), and only if it was started from src-server.
for pid in $(pgrep -f "^[^ ]*python3 api\.py$"); do
    if [ "$(readlink /proc/$pid/cwd)" = "$PROJECT_DIR/src-server" ]; then
        kill "$pid"
    fi
done

sleep 1

# Report anything that survived.
if pgrep -f "$PROJECT_DIR/node_modules/electron/dist/electron" > /dev/null || ss -ltn | grep -q ":5000 "; then
    echo "Something is still running. Check: pgrep -af electron; ss -ltnp | grep 5000"
else
    echo "Askerisk stopped."
fi
