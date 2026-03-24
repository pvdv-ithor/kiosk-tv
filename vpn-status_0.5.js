function connectVPN(country) {
  setVPNTile("connecting");

  fetch(`http://localhost:8080/vpn-${country}`)
    .then(() => {
      // Give VPN time to switch routes
      setTimeout(updateVPNStatus, 3000);
    })
    .catch(() => {
      setVPNTile("error");
    });
}

async function updateVPNStatus() {
  try {
    const res = await fetch("http://localhost:8080/vpn-status");
    const data = await res.json();

    if (data.vpn === false) {
      setVPNTile("disconnected", data);
    } else {
      setVPNTile("connected", data);
    }
  } catch {
    setVPNTile("error");
  }
}

function setVPNTile(state, data = {}) {
  const tile = document.getElementById("vpnStatus");

  tile.className = "vpn"; // reset

  switch (state) {
    case "connecting":
      tile.textContent = "VPN: connecting… ⏳";
      tile.classList.add("vpn-connecting");
      break;

    case "connected":
      tile.textContent =
        `VPN: ${data.country} — ${data.city} (${data.ip})`;
      tile.classList.add("vpn-on");
      break;

    case "disconnected":
      tile.textContent = "VPN: disconnected";
      tile.classList.add("vpn-off");
      break;

    case "error":
      tile.textContent = "VPN: unavailable";
      tile.classList.add("vpn-error");
      break;
  }
}

setInterval(updateVPNStatus, 5000);
updateVPNStatus();
