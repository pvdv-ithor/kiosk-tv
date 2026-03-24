kiosk-tv

Currently only tested on Chuwi Herobox with Commodore OS 3.0

See also [Project Notes](projectnotes.md)

chromium \
  --kiosk \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --no-first-run \
  --disable-features=TranslateUI \
  /path/to/dashboard.html


mkdir -p ~/.config/systemd/user
vim ~/.config/systemd/user/kiosk-server.service
systemctl --user daemon-reload
systemctl --user enable kiosk-server
systemctl --user start kiosk-server
systemctl --user status kiosk-server

cp -a chromium-kiosk.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable chromium-kiosk
systemctl --user start chromium-kiosk
systemctl --user -l status chromium-kiosk

ln -s tv_dashboard_0.6.html tv_dashboard.html

sudo vim /lib/systemd/system-sleep/kiosk-resume

#!/bin/sh
rm -f /tmp/kiosk_suspend.lock

sudo chmod +x /lib/systemd/system-sleep/kiosk-resume

