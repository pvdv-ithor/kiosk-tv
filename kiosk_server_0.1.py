from http.server import BaseHTTPRequestHandler, HTTPServer
import os

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
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

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")

HTTPServer(("localhost", 8080), Handler).serve_forever()
