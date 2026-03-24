#!/bin/bash
export DISPLAY=:0
export XDG_RUNTIME_DIR=/run/user/1000
/usr/bin/pkill chromium
/usr/bin/kodi
