// ===== SPRITE & GRAPHICS MANAGEMENT =====
// Handles sprite paths, loading, and state management

import { ENEMIES, PLAYER_SPRITE_BASE, state } from './game-data.js';

export function getStateFileName(spriteState) {
  const stateMap = {
    'idle': 'Idle',
    'attack': 'Attack',
    'hit': 'Hit_Damage',
    'death': 'Death'
  };
  return stateMap[spriteState] || 'Idle';
}

export function getScenePath(levelIndex) {
  const enemy = ENEMIES[levelIndex] || ENEMIES[0];
  return `../Graphics/Battle Scenes/${enemy.zone}.png`;
}

export function getPlayerSpritePath(spriteState) {
  const stateFileName = getStateFileName(spriteState);
  return `../Graphics/Character Assets/${PLAYER_SPRITE_BASE} ${stateFileName}.png`;
}

export function getEnemySpritePath(levelIndex, spriteState) {
  const enemy = ENEMIES[levelIndex] || ENEMIES[0];
  const spriteBase = enemy.spriteBase || 'Goblin Runt';
  const stateFileName = getStateFileName(spriteState);
  return `../Graphics/Character Assets/${spriteBase} ${stateFileName}.png`;
}

export function loadSpriteImage(imgId, fallbackId, path, fallbackEmoji) {
  const img = document.getElementById(imgId);
  const fallback = document.getElementById(fallbackId);

  img.classList.remove('ready');
  img.style.display = 'none';
  fallback.style.display = 'grid';

  if (fallbackEmoji) {
    const emojiEl = fallback.querySelector('.sprite-fallback-emoji');
    emojiEl.textContent = fallbackEmoji;
  }

  img.onload = function () {
    img.classList.add('ready');
    img.style.display = 'block';
    fallback.style.display = 'none';
  };

  img.onerror = function () {
    img.classList.remove('ready');
    img.style.display = 'none';
    fallback.style.display = 'grid';
  };

  img.src = path;
}

export function setBattleScene(levelIndex) {
  const scenePath = getScenePath(levelIndex);
  document.getElementById('battle-scene-bg').style.setProperty('--scene-bg-image', `url("${scenePath}")`);
}

export function getCurrentEnemy() {
  return ENEMIES[state.level] || ENEMIES[0];
}

export function setSpriteState(side, spriteState) {
  const isPlayer = side === 'player';
  const slotId = `${side}-sprite-slot`;
  const imgId = `${side}-sprite-img`;
  const fallbackId = `${side}-sprite-fallback`;
  const fallbackEmoji = isPlayer ? '' : getCurrentEnemy().sprite;
  const path = isPlayer ? getPlayerSpritePath(spriteState) : getEnemySpritePath(state.level, spriteState);

  state[`${side}SpriteState`] = spriteState;
  const slot = document.getElementById(slotId);
  slot.className = `sprite-slot state-${spriteState}`;
  loadSpriteImage(imgId, fallbackId, path, fallbackEmoji);
}

export function queueSpriteState(side, spriteState, delayMs) {
  if (delayMs === undefined) {
    delayMs = 420;
  }
  setSpriteState(side, spriteState);
  if (spriteState === 'death') {
    return;
  }
  setTimeout(function () {
    const playerAlive = side === 'player' && state.playerHP > 0;
    const enemyAlive = side === 'enemy' && state.enemyHP > 0;
    if (playerAlive || enemyAlive) {
      setSpriteState(side, 'idle');
    }
  }, delayMs);
}
