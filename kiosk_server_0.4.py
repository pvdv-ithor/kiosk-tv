from http.server import BaseHTTPRequestHandler, HTTPServer
import os
import subprocess
import json
import urllib.request
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VPN_STATUS_FILE = os.path.join(BASE_DIR, "vpn_status.json")
SUSPEND_LOCK = "/tmp/kiosk_suspend.lock"

os.environ.setdefault("DISPLAY", ":0")
os.environ.setdefault("XAUTHORITY", os.path.expanduser("~/.Xauthority"))

def write_vpn_status():
    try:
        with urllib.request.urlopen("https://ipinfo.io/json", timeout=3) as r:
            raw = json.load(r)

        filtered = {
            "ip": raw.get("ip", "n/a"),
            "city": raw.get("city", "n/a"),
            "country": raw.get("country", "n/a"),
        }
    except Exception:
        filtered = { "ip": "n/a", "city": "n/a", "country": "n/a" }

    with open(VPN_STATUS_FILE, "w") as f:
        json.dump(filtered, f)


class Handler(BaseHTTPRequestHandler):

    def _respond(self, code=204, body=None, content_type="text/plain"):
        self.send_response(code)
        if body:
            self.send_header("Content-Type", content_type)
        self.end_headers()
        if body:
            self.wfile.write(body)


    def do_GET(self):
        try:
            path = self.path

            if path == "/kodi":
                subprocess.Popen(["/bin/bash", f"{BASE_DIR}/launch_kodi.sh"])

            elif path == "/alien":
                subprocess.Popen(["/bin/bash", f"{BASE_DIR}/launch_alien-arena.sh"])

            elif path in ("/desktop", "/reset"):
                subprocess.Popen(["/usr/bin/pkill", "chromium"])

            elif path == "/exit":
                subprocess.Popen(["systemctl", "--user", "stop", "chromium-kiosk"])

            elif path == "/shutdown":
                subprocess.Popen(["/usr/bin/systemctl", "poweroff"])

            elif path == "/reboot":
                subprocess.Popen(["/usr/bin/systemctl", "reboot"])

            elif path == "/suspend":
                # Prevent suspend loop
                if not os.path.exists(SUSPEND_LOCK):
                    open(SUSPEND_LOCK, "w").close()
                    subprocess.Popen(["/usr/bin/systemctl", "suspend"])
                self._respond()
                return

            elif path == "/radio":
                subprocess.Popen(["/usr/bin/python3", f"{BASE_DIR}/tui-radio/tui-radio-0.1.py"])

            elif path == "/terminal":
                subprocess.Popen(
                    [
                        "/usr/bin/mate-terminal", 
                        "--load-config",
                        f"{BASE_DIR}/tv_term"
                    ],
                    env=os.environ.copy(),
                    start_new_session=True
                )

            elif path == "/vpn-us":
                subprocess.Popen(["/usr/bin/protonvpn", "connect", "--country", "US"])
                write_vpn_status()

            elif path == "/vpn-de":
                subprocess.Popen(["/usr/bin/protonvpn", "connect", "--country", "DE"])
                write_vpn_status()

            elif path == "/vpn-uk":
                subprocess.Popen(["/usr/bin/protonvpn", "connect", "--country", "UK"])
                write_vpn_status()

            elif path == "/vpn-za":
                subprocess.Popen(["/usr/bin/protonvpn", "connect", "--country", "ZA"])
                write_vpn_status()

            elif path == "/vpn-off":
                subprocess.Popen(["/usr/bin/protonvpn", "disconnect"])
                write_vpn_status()

            elif path == "/vpn-status":
                write_vpn_status()
                with open(VPN_STATUS_FILE) as f:
                    self._respond(200, f.read().encode(), "application/json")
                return

            self._respond()

        except Exception as e:
            print("Handler error:", e)
            self._respond(500)


HTTPServer(("localhost", 8080), Handler).serve_forever()
