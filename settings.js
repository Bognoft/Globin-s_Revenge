// ===== SETTINGS & AUDIO MANAGEMENT =====
// Handles game settings, audio control, and localStorage persistence

import { gameSettings, SETTINGS_KEY } from './game-data.js';

export function clampSetting(num) {
  return Math.max(0, Math.min(100, Number(num) || 0));
}

export function safeLoadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    gameSettings.mute = !!parsed.mute;
    gameSettings.master = clampSetting(parsed.master ?? 100);
    gameSettings.music = clampSetting(parsed.music ?? 100);
  } catch (err) {
    gameSettings.mute = false;
    gameSettings.master = 100;
    gameSettings.music = 100;
  }
}

export function saveSettings() {
  try { 
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(gameSettings)); 
  } catch (err) {}
}

export function updateSettingLabels() {
  document.getElementById('setting-master-val').textContent = `${gameSettings.master}%`;
  document.getElementById('setting-music-val').textContent = `${gameSettings.music}%`;
}

export function syncSettingsUI() {
  document.getElementById('setting-mute').checked = gameSettings.mute;
  document.getElementById('setting-master').value = gameSettings.master;
  document.getElementById('setting-music').value = gameSettings.music;
  updateSettingLabels();
}

export function applyAudioSettings() {
  let globalVolume = gameSettings.master / 100;
  if (gameSettings.mute) {
    globalVolume = 0;
  }
  const allMedia = document.querySelectorAll('audio, video');
  for (let m = 0; m < allMedia.length; m++) {
    const mediaEl = allMedia[m];
    const isMusic = mediaEl.dataset.audioType === 'music';
    let channel = 1;
    if (isMusic) {
      channel = gameSettings.music / 100;
    }
    let finalVolume = globalVolume * channel;
    if (finalVolume < 0) finalVolume = 0;
    if (finalVolume > 1) finalVolume = 1;
    mediaEl.volume = finalVolume;
    mediaEl.muted = gameSettings.mute === true;
  }
}

export function closeSettingsIfClickOutside(clickEvent) {
  const panel = document.getElementById('settings-panel');
  const toggle = document.getElementById('settings-toggle');
  if (panel.classList.contains('hidden')) return;
  
  const clickedInsidePanel = panel.contains(clickEvent.target);
  const clickedToggle = clickEvent.target === toggle;
  if (!clickedInsidePanel && !clickedToggle) {
    panel.classList.add('hidden');
  }
}

export function readSettingsFromFormIntoGameSettings() {
  gameSettings.mute = document.getElementById('setting-mute').checked;
  gameSettings.master = clampSetting(document.getElementById('setting-master').value);
  gameSettings.music = clampSetting(document.getElementById('setting-music').value);
}

export function onSettingsFormChanged() {
  readSettingsFromFormIntoGameSettings();
  updateSettingLabels();
  applyAudioSettings();
  saveSettings();
}

export function initSimpleSettingsMenu() {
  safeLoadSettings();
  syncSettingsUI();
  applyAudioSettings();

  const panel = document.getElementById('settings-panel');
  const toggle = document.getElementById('settings-toggle');

  toggle.addEventListener('click', function () {
    panel.classList.toggle('hidden');
  });

  document.addEventListener('click', closeSettingsIfClickOutside);

  const settingIds = ['setting-mute', 'setting-master', 'setting-music'];
  for (let s = 0; s < settingIds.length; s++) {
    const element = document.getElementById(settingIds[s]);
    element.addEventListener('input', onSettingsFormChanged);
    element.addEventListener('change', onSettingsFormChanged);
  }
}
