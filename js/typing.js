// ===== TYPING INPUT HANDLING =====
// Handles text input, WPM/accuracy calculation, and progress display

import { state } from './game-data.js';
import { updateStats } from './ui.js';

export function escapeChar(ch) {
  if (ch === '&') return '&amp;';
  if (ch === '<') return '&lt;';
  if (ch === '>') return '&gt;';
  if (ch === '"') return '&quot;';
  return ch;
}

export function buildTypingHTML(typed) {
  let html = '';
  const text = state.currentText;

  for (let i = 0; i < text.length; i++) {
    const expected = text[i];
    const actual = typed[i];

    if (i < typed.length) {
      const cls = actual === expected ? 'correct' : 'wrong';
      html += `<span class="${cls}">${escapeChar(expected)}</span>`;
    } else if (i === typed.length) {
      html += `<span class="cursor-wrap"><span class="cursor-bar">|</span><span class="active">${escapeChar(expected)}</span></span>`;
    } else {
      html += `<span class="pending">${escapeChar(expected)}</span>`;
    }
  }

  if (typed.length >= text.length) html += `<span class="cursor-bar">|</span>`;
  return html;
}

export function renderTypingText() {
  const s = document.getElementById('typing-spans');
  s.innerHTML = buildTypingHTML('');
  document.getElementById('hidden-input').value = '';
}

export function focusInput() {
  document.getElementById('hidden-input').focus();
}

export function refocusHiddenTypingField() {
  const isBattleScreenHidden = document.getElementById('battle-screen').classList.contains('hidden');
  if (isBattleScreenHidden) {
    return;
  }
  if (state.phase !== 'player-attack' && state.phase !== 'enemy-attack') {
    return;
  }
  document.getElementById('hidden-input').focus();
}

export function onTyping(event) {
  if (state.phase !== 'player-attack' && state.phase !== 'enemy-attack') {
    return;
  }
  if (!state.isTyping) {
    state.isTyping = true;
    state.startTime = Date.now();
  }

  const typed = event.target.value;
  const text = state.currentText;
  state.charIndex = typed.length;
  state.errors = 0;

  for (let i = 0; i < typed.length && i < text.length; i++) {
    if (typed[i] !== text[i]) {
      state.errors++;
    }
  }

  document.getElementById('typing-spans').innerHTML = buildTypingHTML(typed);
  const progressPercent = (typed.length / text.length) * 100;
  document.getElementById('progress-bar').style.width = Math.min(progressPercent, 100) + '%';

  const minutesElapsed = (Date.now() - state.startTime) / 60000;
  if (minutesElapsed > 0) {
    state.wpm = Math.round((typed.length / 5) / minutesElapsed);
  } else {
    state.wpm = 0;
  }

  if (typed.length > 0) {
    const correctChars = typed.length - state.errors;
    state.accuracy = Math.round((correctChars / typed.length) * 100);
  } else {
    state.accuracy = 100;
  }

  const cursorEl = document.querySelector(
    '.typing-text-display .cursor-wrap, .typing-text-display .cursor-bar:last-child'
  );
  if (cursorEl) {
    cursorEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  updateStats();
  if (typed.length >= text.length) {
    document.getElementById('btn-submit').disabled = false;
    document.getElementById('submit-hint').textContent = '⚔ Press ENTER or click Strike!';
  }
}

export function onGlobalKeydown(event) {
  refocusHiddenTypingField();
}
