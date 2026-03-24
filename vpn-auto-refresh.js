async function connectVPN(country) {
  setVPNTile("connecting");

  await fetch(`/vpn-${country}`);

  // Poll status every 2 seconds, max 15 seconds
  let attempts = 0;
  const interval = setInterval(async () => {
    attempts++;

    const res = await fetch("/vpn-status");
    const data = await res.json();

    if (isVPNConnected(data) || attempts > 7) {
      clearInterval(interval);
      updateVPNTile(data);
    }
  }, 2000);
}
