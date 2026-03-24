// controller.js

// ---------- AUDIO ----------
function playBeep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.value = 1000;
  gain.gain.value = 0.05;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}
function playClick() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';      // retro feel
  osc.frequency.value = 800; // pitch (Hz)

  gain.gain.value = 0.02;   // volume (very important!)

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.15); // 150 ms beep
}

// ---------- KIOSK NAV ----------
let tiles = [];
let index = 0;

function initTiles() {
  tiles = Array.from(document.querySelectorAll('.tile'));
  if (!tiles.length) return;
  index = 0;
  tiles[index].focus();
}

// ---------- KEYBOARD ----------
document.addEventListener('keydown', e => {
  if (!tiles.length) return;

  const cols = 4;

  switch (e.key) {
    case 'ArrowRight': index = (index + 1) % tiles.length; break;
    case 'ArrowLeft':  index = (index - 1 + tiles.length) % tiles.length; break;
    case 'ArrowDown':  index = Math.min(index + cols, tiles.length - 1); break;
    case 'ArrowUp':    index = Math.max(index - cols, 0); break;
    case 'Enter':      tiles[index].click(); playClick(); return;
    default: return;
  }

  tiles[index].focus();
  playBeep();
  e.preventDefault();
});

// ---------- GAMEPAD ----------
const DEADZONE = 0.4;
let last = {};
let enterPressedAt = null;
let systemMenuOpened = false;

function pollGamepad() {
  const gp = navigator.getGamepads()[0];
  if (!gp) return requestAnimationFrame(pollGamepad);

  const b = gp.buttons;
  const aX = gp.axes[0];
  const aY = gp.axes[1];

  const state = {
    up:    b[12]?.pressed || aY < -DEADZONE,
    down:  b[13]?.pressed || aY >  DEADZONE,
    left:  b[14]?.pressed || aX < -DEADZONE,
    right: b[15]?.pressed || aX >  DEADZONE,
    enter: b[0]?.pressed,
    back:  b[1]?.pressed
  };

  ['up','down','left','right'].forEach(dir => {
    if (state[dir] && !last[dir]) {
      simulateKey(dir);
      playBeep();
    }
  });

  if (state.enter && !last.enter) {
    enterPressedAt = performance.now();
    systemMenuOpened = false;
  }

  if (state.enter && enterPressedAt && !systemMenuOpened) {
    if (performance.now() - enterPressedAt > 800) {
      openSystemMenu();
      systemMenuOpened = true;
    }
  }

  if (!state.enter && last.enter) {
    if (!systemMenuOpened) simulateKey('enter');
    enterPressedAt = null;
  }

  if (state.back && !last.back) {
    goBack();
  }

  last = state;
  requestAnimationFrame(pollGamepad);
}

function simulateKey(action) {
  const map = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    enter: 'Enter'
  };

  document.dispatchEvent(new KeyboardEvent('keydown', { key: map[action] }));
}

window.addEventListener('gamepadconnected', pollGamepad);

// ---------- NAV ----------
function openSystemMenu() {
  window.location.href = 'tv_dashboard.html';
}

function goBack() {
  window.location.href = 'tv_dashboard.html';
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', initTiles);
