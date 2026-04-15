// ===== UI UPDATES & VISUAL FEEDBACK =====
// Handles HP bars, stats display, battle log, and visual effects

import { state } from './game-data.js';

export function updatePHP() {
  const p = (state.playerHP / state.playerMaxHP) * 100;
  document.getElementById('player-hp-fill').style.width = p + '%';
  document.getElementById('player-hp-text').textContent = `${state.playerHP} / ${state.playerMaxHP}`;
}

export function updateEHP() {
  const p = (state.enemyHP / state.enemyMaxHP) * 100;
  document.getElementById('enemy-hp-fill').style.width = p + '%';
  document.getElementById('enemy-hp-text').textContent = `${state.enemyHP} / ${state.enemyMaxHP}`;
}

export function resetStats() {
  document.getElementById('stat-wpm').textContent = '0';
  document.getElementById('stat-acc').textContent = '—';
  document.getElementById('stat-errors').textContent = '0';
  document.getElementById('acc-bar').style.width = '100%';
  document.getElementById('acc-bar').style.background = '#22aa44';
  document.getElementById('hidden-input').value = '';
}

export function updateStats() {
  const acc = state.accuracy;
  document.getElementById('stat-wpm').textContent = state.wpm;
  document.getElementById('stat-errors').textContent = state.errors;
  document.getElementById('stat-acc').textContent = acc + '%';
  document.getElementById('acc-bar').style.width = acc + '%';
  
  let accColor = '#aa2222';
  if (acc >= 90) {
    accColor = '#22aa44';
  } else if (acc >= 70) {
    accColor = '#aaaa22';
  }
  document.getElementById('acc-bar').style.background = accColor;
  document.getElementById('stat-acc').style.color = accColor;
}

export function addLog(msg, cls) {
  const log = document.getElementById('battle-log');
  const d = document.createElement('div');
  d.className = 'log-entry ' + cls;
  d.textContent = msg;
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
}

export function clearLog() {
  document.getElementById('battle-log').innerHTML = '';
}

export function flash(color) {
  const el = document.getElementById('screen-flash');
  el.className = 'screen-flash ' + color;
  el.style.opacity = '1';
  setTimeout(function () {
    el.style.opacity = '0';
  }, 150);
}

export function showDmgPopup(nearId, amount, type) {
  const rect = document.getElementById(nearId).getBoundingClientRect();
  const popup = document.createElement('div');
  popup.className = 'dmg-popup ' + type;
  if (type === 'block') {
    popup.textContent = '🛡 ' + amount;
  } else {
    popup.textContent = '-' + amount;
  }
  const jitterX = rect.left + rect.width / 2 - 20 + Math.random() * 30 - 15;
  const jitterY = rect.top + Math.random() * 10;
  popup.style.left = jitterX + 'px';
  popup.style.top = jitterY + 'px';
  document.body.appendChild(popup);
  setTimeout(function () {
    popup.remove();
  }, 1200);
}
