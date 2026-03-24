let lastMinute = null;

function updateClock() {
  const now = new Date();

  const timeOptions = {
    timeZone: "Europe/Brussels",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  };

  const dateOptions = {
    timeZone: "Europe/Brussels",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  const timeString = now.toLocaleTimeString("nl-NL", timeOptions);
  const dateString = now.toLocaleDateString("nl-NL", dateOptions);

  const currentMinute = now.getMinutes();

  const timeElement = document.getElementById("clock-time");
  const dateElement = document.getElementById("clock-date");

  // Always update time
  timeElement.textContent = timeString;

  // Only animate date when minute changes
  if (currentMinute !== lastMinute) {
    lastMinute = currentMinute;

    dateElement.classList.add("fade");

    setTimeout(() => {
      dateElement.textContent = dateString;
      dateElement.classList.remove("fade");
    }, 300);
  }
}

setInterval(updateClock, 1000);
updateClock();
