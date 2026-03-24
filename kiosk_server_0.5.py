#!/usr/bin/env python3
from flask import Flask, send_from_directory, jsonify, Response
import os
import subprocess
import json
import urllib.request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VPN_STATUS_FILE = os.path.join(BASE_DIR, "vpn_status.json")
SUSPEND_LOCK = "/tmp/kiosk_suspend.lock"

os.environ.setdefault("DISPLAY", ":0")
os.environ.setdefault("XAUTHORITY", os.path.expanduser("~/.Xauthority"))

app = Flask(__name__, static_folder=BASE_DIR)


# -----------------------
# Helpers
# -----------------------

def write_vpn_status():
    try:
        with urllib.request.urlopen("https://ipinfo.io/json", timeout=3) as r:
            raw = json.load(r)

        data = {
            "ip": raw.get("ip", "n/a"),
            "city": raw.get("city", "n/a"),
            "country": raw.get("country", "n/a"),
        }
    except Exception:
        data = {"ip": "n/a", "city": "n/a", "country": "n/a"}

    with open(VPN_STATUS_FILE, "w") as f:
        json.dump(data, f)

    return data


def run(cmd):
    subprocess.Popen(cmd, env=os.environ.copy(), start_new_session=True)


# -----------------------
# UI
# -----------------------

@app.route("/")
def dashboard():
    return send_from_directory(BASE_DIR, "tv_dashboard.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(BASE_DIR, path)


# -----------------------
# System actions
# -----------------------

@app.route("/kodi")
def kodi():
    run(["/bin/bash", f"{BASE_DIR}/launch_kodi.sh"])
    return "", 204


@app.route("/alien")
def alien():
    run(["/bin/bash", f"{BASE_DIR}/launch_alien-arena.sh"])
    return "", 204


@app.route("/desktop")
@app.route("/reset")
def desktop():
    run(["/usr/bin/pkill", "chromium"])
    return "", 204


@app.route("/exit")
def exit_kiosk():
    run(["systemctl", "--user", "stop", "chromium-kiosk"])
    return "", 204


@app.route("/shutdown")
def shutdown():
    run(["/usr/bin/systemctl", "poweroff"])
    return "", 204


@app.route("/reboot")
def reboot():
    run(["/usr/bin/systemctl", "reboot"])
    return "", 204


@app.route("/suspend")
def suspend():
    if not os.path.exists(SUSPEND_LOCK):
        open(SUSPEND_LOCK, "w").close()
        run(["/usr/bin/systemctl", "suspend"])
    return "", 204


@app.route("/radio")
def radio():
    run(["/usr/bin/python3", f"{BASE_DIR}/tui-radio/tui-radio-0.1.py"])
    return "", 204

@app.route("/terminal")
def terminal():
    subprocess.Popen(
        [
            "/usr/bin/mate-terminal",
            "--load-config", f"{BASE_DIR}/tv_term"
        ],
        env=os.environ.copy(),
        start_new_session=True
    )
    return "", 204

# -----------------------
# VPN
# -----------------------

@app.route("/vpn/<country>")
def vpn_connect(country):
    run(["/usr/bin/protonvpn", "connect", "--country", country.upper()])
    write_vpn_status()
    return "", 204


@app.route("/vpn-off")
def vpn_off():
    run(["/usr/bin/protonvpn", "disconnect"])
    write_vpn_status()
    return "", 204


@app.route("/vpn-status")
def vpn_status():
    data = write_vpn_status()
    return jsonify(data)


# -----------------------
# Main
# -----------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
