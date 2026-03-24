document.addEventListener('DOMContentLoaded', () => {
  console.log("vpn-status.js loaded");

  async function updateVPNStatus() {
    try {
      const res = await fetch('http://localhost:8080/vpn-status');
      if (!res.ok) throw new Error();
      const data = await res.json();

      document.getElementById('vpnStatus').textContent =
        `${data.ip} — ${data.city}, ${data.country}`;
    } catch {
      document.getElementById('vpnStatus').textContent = 'VPN: unavailable';
    }
  }

  setInterval(updateVPNStatus, 5000);
  updateVPNStatus();
});

