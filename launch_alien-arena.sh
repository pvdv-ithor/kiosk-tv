#!/bin/bash
export DISPLAY=:0
export XDG_RUNTIME_DIR=/run/user/1000
/usr/bin/systemctl --user stop chromium-kiosk.service
/usr/bin/pkill chromium
/usr/games/alien-arena
