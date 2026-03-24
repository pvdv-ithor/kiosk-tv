document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('vpnStatus');

  async function updateVPNStatus() {
    try {
      const res = await fetch('/vpn-status'); // IMPORTANT CHANGE
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      el.textContent = `${data.ip} — ${data.city}, ${data.country}`;
    } catch (e) {
      el.textContent = 'VPN: unavailable';
    }
  }

  updateVPNStatus();
  setInterval(updateVPNStatus, 5000);
});
