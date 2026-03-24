function openSystemProtected() {
  const pin = window.prompt("Enter system PIN:");

  if (pin === "1234") {
    window.location.href = "system.html";
  } else if (pin !== null) {
    alert("Wrong PIN");
  }
}
