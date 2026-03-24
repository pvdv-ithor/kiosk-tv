console.log("vpn-status.js loaded");

function connectVPN(country) {
  setVPNTile("connecting");

  fetch(`/vpn/${country}`)
    .then(() => {
      // give ProtonVPN time to switch routes
      setTimeout(updateVPNStatus, 8000);
    })
    .catch(() => {
      setVPNTile("error");
    });
}

async function updateVPNStatus() {
  try {
    const res = await fetch("/vpn-status");
    if (!res.ok) throw new Error();

    const data = await res.json();

    if (!data.ip || data.ip === "---") {
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

  tile.className = ""; // reset classes

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

    default:
      tile.textContent = "VPN: unavailable";
      tile.classList.add("vpn-error");
  }
}

/* Fix 3: periodic auto refresh */
setInterval(updateVPNStatus, 5000);

/* Initial load */
updateVPNStatus();
