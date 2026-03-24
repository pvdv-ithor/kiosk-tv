async function updateVPNStatus() {
  try {
    const res = await fetch('vpn_status.json');
    const data = await res.json();

    document.getElementById('vpnStatus').textContent =
      `${data.ip}\n${data.city}\n${data.country}`;
  } catch {
    document.getElementById('vpnStatus').textContent = 'VPN: unavailable';
  }
}

setInterval(updateVPNStatus, 5000);
updateVPNStatus();
