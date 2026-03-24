from http.server import BaseHTTPRequestHandler, HTTPServer
import os
import subprocess

os.environ.setdefault("DISPLAY", ":0")
os.environ.setdefault("XAUTHORITY", os.path.expanduser("~/.Xauthority"))

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            if self.path == "/kodi":
                os.system("/bin/bash /home/Commodore/My_TV/launch_kodi.sh")

            elif self.path == "/alien":
                os.system("/bin/bash /home/Commodore/My_TV/launch_alien-arena.sh")

            elif self.path == "/desktop":
                os.system("/usr/bin/pkill chromium")

            elif self.path == "/reset":
                os.system("/usr/bin/pkill chromium")

            elif self.path == "/exit":
                os.system("systemctl --user stop chromium-kiosk")

            elif self.path == "/shutdown":
                os.system("/usr/bin/systemctl poweroff")

            elif self.path == "/reboot":
                os.system("/usr/bin/systemctl reboot")

            elif self.path == "/suspend":
                os.system("/usr/bin/systemctl suspend")

            elif self.path == "/radio":
                os.system("/usr/bin/python3 /home/Commodore/tui-radio/tui-radio-0.1.py")

            elif self.path == "/terminal":
                subprocess.Popen(
                    ["/usr/bin/mate-terminal"],
                    env=os.environ.copy(),
                    start_new_session=True
                )

            self.send_response(204)
            self.end_headers()

        except Exception as e:
            print("Handler error:", e)
            self.send_response(500)
            self.end_headers()

HTTPServer(("localhost", 8080), Handler).serve_forever()
