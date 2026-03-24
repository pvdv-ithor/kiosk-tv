# My_TV Kiosk Project – Notes & Roadmap

## ✅ DONE / WORKING
- Chromium kiosk auto-start via systemd (user service)
- Python-based local control server (now Flask)
- Gamepad navigation (D-pad + stick + buttons)
- Sound feedback (beep / click)
- Submenus with shared JS and CSS
- Kodi launcher
- Alien Arena launcher
- Terminal launcher (mate-terminal with custom profile)
- Reset TV (kills Chromium, systemd respawns it)
- Exit to Desktop
- Suspend with lockfile to prevent suspend loop
- ProtonVPN connect/disconnect via buttons
- VPN status endpoint (/vpn-status)
- BASE_DIR usage for portability

## ⚠️ WORKING BUT TEMP / IMPROVABLE
- VPN status polling triggered on request (not periodic)
- VPN UI indicator basic text only
- Error handling for ProtonVPN minimal
- Chromium DRM performance not fully solved
- No visual confirmation after VPN button press (yet)

## 🧠 DESIGN DECISIONS (IMPORTANT)
- Flask used instead of http.server for:
  - static file serving
  - JSON APIs
  - future extensibility
- Dashboard served as tv_dashboard.html
- All files loaded relative to BASE_DIR (no hardcoded paths)
- Kiosk is LOCAL-ONLY (127.0.0.1)

## 🔜 PLANNED / LATER
- Periodic VPN status updater (background thread)
- Visual VPN indicator (flag / color / country)
- WhatsMyIP-style confirmation tile
- Kodi as primary video path (DRM avoidance)
- Cleanup & refactor JS (controller vs UI logic)
- Settings page (System → Advanced)
- Optional logging to file
- Power menu polish

## 🎮 GAMEPAD NAVIGATION – EXTENSIONS (PLANNED)

### Input Mapping (Console-style)
- D-pad + Left stick: Navigate tiles
- A / Enter: Activate tile
- B: Back
- Long-press B: Exit to Desktop
- Start: Open System menu
- Long-press Start: Power menu
- X: Context action (future use)
- Y: Refresh / reset current page
- LB / RB: Page left / page right (submenu switching)
- Select: Toggle status overlay (VPN / debug)

### Navigation Intelligence
- Remember last selected tile per page
- Restore focus when returning from submenu
- Optional wrap-around navigation
- Skip disabled or hidden tiles
- Modal focus trapping for System / Power menus

### App-Aware Input Handling
- Pause gamepad polling when external apps open (Kodi, terminal)
- Resume polling when Chromium regains focus
- Prevent input bleed into external applications

### Debug / Power-User Mode (Hidden)
- Activate via Select + Start (3 seconds)
- Show focus outlines
- Log gamepad events
- Optional FPS / input latency overlay
- Auto-disable on reboot

## 🧪 EXPERIMENTS / PARKED IDEAS
- Chromium nice/ionice tuning (rolled back)
- VAAPI / DRM tweaks
- Direct DRM playback in Chromium
- Apple TV playback via browser

## ❓ OPEN QUESTIONS
- Best long-term DRM solution (Kodi inputstream?)
- Whether to keep Chromium at all for streaming

