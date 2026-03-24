function updateClock() {
  const now = new Date();

  const optionsTime = {
    timeZone: "Europe/Brussels",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  };

  const optionsDate = {
    timeZone: "Europe/Brussels",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  const timeString = now.toLocaleTimeString("nl-NL", optionsTime);
  const dateString = now.toLocaleDateString("nl-NL", optionsDate);

  document.getElementById("clock").innerHTML = `
    <strong>${timeString}</strong><br>
    <small>${dateString}</small>
  `;
}

setInterval(updateClock, 1000);
updateClock();
