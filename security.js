const SYSTEM_PIN = "1234";

function openSystemProtected() {
  document.getElementById("pinOverlay").style.display = "flex";
  const input = document.getElementById("pinInput");
  input.value = "";
  setTimeout(() => input.focus(), 50);
}

function closePin() {
  document.getElementById("pinOverlay").style.display = "none";
}

function submitPin() {
  const pin = document.getElementById("pinInput").value;

  if (pin === SYSTEM_PIN) {
    window.location.href = "system.html";
  } else {
    alert("Wrong PIN");
  }

  closePin();
}
