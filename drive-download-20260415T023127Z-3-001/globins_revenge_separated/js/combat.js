// ===== COMBAT SYSTEM =====
// Battle phasing, damage calculation, and combat resolution

import { state, ENEMIES, progress } from "./game-data.js";

// ─── Phase Timer ─────────────────────────────────────────────────────────────
let _timerInterval = null;
let _timerSec = 0;
let _timerMax = 0;

function _startTimer(seconds) {
  _stopTimerInternal();
  _timerSec = seconds;
  _timerMax = seconds;
  _renderTimer();
  _timerInterval = setInterval(() => {
    _timerSec = Math.max(0, _timerSec - 1);
    _renderTimer();
    if (_timerSec <= 0) {
      _stopTimerInternal();
      if (state.phase === "player-attack" || state.phase === "enemy-attack") {
        const logClass =
          state.phase === "player-attack" ? "player-log" : "enemy-log";
        addLog("⏱ Time is up! Auto-submitting...", logClass);
        submitTurn();
      }
    }
  }, 1000);
}

function _stopTimerInternal() {
  if (_timerInterval !== null) {
    clearInterval(_timerInterval);
    _timerInterval = null;
  }
}

/** Exported so main.js can stop the timer when navigating away from battle */
export function stopBattleTimer() {
  _stopTimerInternal();
}

function _renderTimer() {
  const display = document.getElementById("timer-display");
  const fill = document.getElementById("timer-fill");
  if (!display || !fill) return;

  const m = Math.floor(_timerSec / 60);
  const s = _timerSec % 60;
  display.textContent = m + ":" + String(s).padStart(2, "0");

  const pct = _timerMax > 0 ? (_timerSec / _timerMax) * 100 : 0;
  fill.style.width = pct + "%";

  if (pct <= 25) {
    fill.style.background = "#cc2222";
    display.style.color = "#cc2222";
    display.classList.remove("timer-warning");
    display.classList.add("timer-danger");
  } else if (pct <= 50) {
    fill.style.background = "#c9a825";
    display.style.color = "#c9a825";
    display.classList.remove("timer-danger");
    display.classList.add("timer-warning");
  } else {
    fill.style.background = "#22aa44";
    display.style.color = "#22aa44";
    display.classList.remove("timer-danger", "timer-warning");
  }
}
// ─────────────────────────────────────────────────────────────────────────────
import { pickAtk, pickDef } from "./narrative.js";
import { setSpriteState, queueSpriteState, setBattleScene } from "./sprites.js";
import {
  updatePHP,
  updateEHP,
  resetStats,
  addLog,
  clearLog,
  flash,
  showDmgPopup,
} from "./ui.js";
import { swap } from "./screen-nav.js";
import { renderMap, updateMapSubtitleLine } from "./map.js";
import { renderTypingText, focusInput } from "./typing.js";

export function startLevel(lvl) {
  _stopTimerInternal();
  document.getElementById("map-tooltip") &&
    document.getElementById("map-tooltip").classList.remove("visible");
  state.level = lvl;
  state.isBoss = lvl === ENEMIES.length - 1;
  const e = ENEMIES[lvl];
  state.enemyHP = e.hp;
  state.enemyMaxHP = e.hp;
  state.bossEnraged = false;
  state.poisoned = false;
  state.charIndex = 0;
  state.errors = 0;
  state.isTyping = false;
  state.wpm = 0;
  state.accuracy = 100;
  state.totalDmgDealt = 0;
  state.totalErrors = 0;
  state.playerSpriteState = "idle";
  state.enemySpriteState = "idle";

  const card = document.getElementById("enemy-card");
  card.className =
    "fighter-card " + (state.isBoss ? "boss-card" : "enemy-card");
  document.getElementById("enemy-name").textContent = e.name;
  document.getElementById("enemy-atk").textContent = e.atk;
  document.getElementById("enemy-def").textContent = e.def;
  document.getElementById("enemy-level").textContent = lvl + 1;
  document.getElementById("enemy-type").textContent = e.type;
  document.getElementById("enemy-ability").textContent = "★ " + e.ability;
  document.getElementById("enemy-fallback-emoji").textContent = e.sprite;
  updateEHP();
  updatePHP();
  document.getElementById("level-badge").textContent =
    `LV${lvl + 1} — ${e.zone.toUpperCase()}`;

  setBattleScene(lvl);
  setSpriteState("player", "idle");
  setSpriteState("enemy", "idle");

  swap("map-screen", "battle-screen");
  clearLog();
  addLog(`Globin faces: ${e.name}!`, "system-log");
  addLog(`${e.ability}`, state.isBoss ? "boss-log" : "enemy-log");
  phaseAttack();
}

export function phaseAttack() {
  state.phase = "player-attack";
  state.charIndex = 0;
  state.errors = 0;
  state.isTyping = false;
  state.startTime = null;
  state.currentText = pickAtk(state.level);
  document.getElementById("typing-prompt").textContent =
    "🗡 GLOBIN ATTACKS — TYPE THE PARAGRAPH BELOW";
  document.getElementById("progress-bar").className = "progress-bar-fill";
  const ph = document.getElementById("combat-phase");
  ph.textContent = state.isBoss ? "BOSS FIGHT — ATTACK" : "GLOBIN'S TURN";
  ph.className = "combat-phase " + (state.isBoss ? "boss-phase" : "attack");
  document.getElementById("btn-submit").disabled = true;
  document.getElementById("submit-hint").textContent =
    "Finish typing the paragraph to strike";
  setSpriteState("player", "idle");
  if (state.enemyHP > 0) setSpriteState("enemy", "idle");
  renderTypingText();
  resetStats();
  focusInput();
  addLog("📖 Type to attack!", "player-log");
  _startTimer(60);
}

export function beginDefendTypingPhase() {
  document.getElementById("typing-prompt").textContent =
    "🛡 ENEMY ATTACKS — TYPE TO BLOCK DAMAGE!";
  document.getElementById("progress-bar").className =
    "progress-bar-fill defend";
  const phaseBanner = document.getElementById("combat-phase");
  if (state.isBoss) {
    phaseBanner.textContent = "GOBLIN KING STRIKES!";
    phaseBanner.className = "combat-phase boss-phase";
  } else {
    phaseBanner.textContent = "DEFEND!";
    phaseBanner.className = "combat-phase defend";
  }
  document.getElementById("btn-submit").disabled = true;
  document.getElementById("submit-hint").textContent =
    "Type fast to block more damage!";
  setSpriteState("enemy", "attack");
  renderTypingText();
  resetStats();
  focusInput();
  addLog("⚠️ Enemy attacks! Type to block!", "enemy-log");
  _startTimer(45);
}

export function phaseDefend() {
  state.phase = "enemy-attack";
  state.charIndex = 0;
  state.errors = 0;
  state.isTyping = false;
  state.startTime = null;
  state.currentText = pickDef(state.level);
  showEnemyMsg();
  setTimeout(beginDefendTypingPhase, 1600);
}

export function showEnemyMsg() {
  const enemy = ENEMIES[state.level];
  const msg = document.createElement("div");
  msg.className = "enemy-turn-msg";
  if (state.isBoss) {
    msg.textContent = "GOBLIN KING STRIKES!";
  } else {
    msg.textContent = enemy.sprite + " ENEMY ATTACKS!";
  }
  document.body.appendChild(msg);
  flash("red");
  setTimeout(function () {
    msg.remove();
  }, 1500);
}

export function calcDmg(wpm, acc, baseAttack) {
  let wpmFactor = wpm / 50;
  if (wpmFactor > 2.5) {
    wpmFactor = 2.5;
  }
  let damage = baseAttack * wpmFactor * (acc / 100);
  damage = Math.round(damage);
  if (acc >= 95) {
    damage = Math.round(damage * 1.35);
  }
  if (acc < 70) {
    damage = Math.round(damage * 0.5);
  }
  if (damage < 5) {
    damage = 5;
  }
  if (damage > 999) {
    damage = 999;
  }
  return damage;
}

export function calcBlock(wpm, acc, baseDefense) {
  let wpmFactor = wpm / 50;
  if (wpmFactor > 2.5) {
    wpmFactor = 2.5;
  }
  let block = baseDefense * wpmFactor * (acc / 100);
  block = Math.round(block);
  if (block < 0) {
    block = 0;
  }
  return block;
}

export function resolveAtk() {
  _stopTimerInternal();
  state.phase = "idle";
  const playerAttackStat = 30 + state.level * 8;
  document.getElementById("player-atk").textContent = playerAttackStat;

  let damage = calcDmg(state.wpm, state.accuracy, playerAttackStat);
  if (state.isBoss && damage < 20) {
    addLog("GOBLIN KING LAUGHS — too weak!", "boss-log");
    damage = 5;
  }

  state.totalDmgDealt += damage;
  state.totalErrors += state.errors;
  state.enemyHP = Math.max(0, state.enemyHP - damage);
  updateEHP();

  let popupStyle = "damage";
  if (state.accuracy >= 95) {
    popupStyle = "crit";
  }
  showDmgPopup("enemy-sprite-slot", damage, popupStyle);

  queueSpriteState("player", "attack", 380);
  queueSpriteState("enemy", "hit", 430);
  flash("green");

  let attackLog =
    "⚔ Globin deals " +
    damage +
    " dmg! (" +
    state.wpm +
    " WPM, " +
    state.accuracy +
    "% ACC)";
  if (state.accuracy >= 95) {
    attackLog += " 💥 CRIT!";
  }
  addLog(attackLog, "player-log");

  document.getElementById("player-wpm").textContent = state.wpm;
  document.getElementById("player-acc").textContent = state.accuracy + "%";
  document.getElementById("stat-dmg").textContent = damage;

  const halfEnemyHp = state.enemyMaxHP * 0.5;
  if (state.isBoss && !state.bossEnraged && state.enemyHP <= halfEnemyHp) {
    state.bossEnraged = true;
    addLog("GOBLIN KING ENRAGES! ATTACKS DOUBLED!", "boss-log");
    flash("purple");
  }
  if (state.enemyHP <= 0) {
    setSpriteState("enemy", "death");
    setTimeout(function () {
      showResult("victory");
    }, 600);
    return;
  }
  if (state.level === 8 && !state.poisoned) {
    state.poisoned = true;
    addLog("🐍 You are poisoned! -5 HP per enemy turn.", "enemy-log");
  }
  setTimeout(phaseDefend, 800);
}

export function addExtraDamageFromEnemyAbilities(enemyAttackAfterRage) {
  let extraDamage = 0;
  const lvl = state.level;

  if (lvl === 3 && state.wpm < 20) {
    extraDamage += 20;
    addLog("🦇 Too slow! Triple bat strike!", "enemy-log");
  }
  if (lvl === 4 && state.errors > 0) {
    extraDamage += state.errors * 8;
    addLog("💀 " + state.errors + " arrow(s) for your typos!", "enemy-log");
  }
  if (lvl === 5) {
    state.enemyHP = Math.min(state.enemyMaxHP, state.enemyHP + 8);
    addLog("🧟 Zombie regenerates 8 HP!", "enemy-log");
    updateEHP();
  }
  if (lvl === 6 && state.wpm < 25) {
    extraDamage += enemyAttackAfterRage;
    addLog("🧌 TROLL SMASH — too slow!", "enemy-log");
  }
  if (lvl === 7 && state.errors > 0) {
    extraDamage += 10;
    addLog("🔥 Burns for 10 — errors cost!", "enemy-log");
  }
  if (lvl === 8 && state.poisoned) {
    extraDamage += 5;
    addLog("🐍 Poison: -5 HP!", "enemy-log");
  }
  if (lvl === 9 && state.errors > 0) {
    extraDamage += Math.round(enemyAttackAfterRage * 0.2);
    addLog("⚔ Warlord reflects 20% for your errors!", "enemy-log");
  }
  if (state.isBoss && state.errors > 0) {
    const bossPunish = 30 * state.errors;
    extraDamage += bossPunish;
    addLog(
      "GOBLIN KING PUNISHES " +
        state.errors +
        " error(s)! +" +
        bossPunish +
        " dmg!",
      "boss-log",
    );
  }

  return extraDamage;
}

export function resolveDef() {
  _stopTimerInternal();
  state.phase = "idle";
  const enemy = ENEMIES[state.level];
  let enemyAttack = enemy.atk;
  if (state.bossEnraged) {
    enemyAttack = enemyAttack * 2;
  }
  const playerDefense = 10 + state.level * 4;
  document.getElementById("player-def").textContent = playerDefense;
  document.getElementById("enemy-atk").textContent = enemy.atk;
  document.getElementById("enemy-def").textContent = enemy.def;

  let block = calcBlock(state.wpm, state.accuracy, playerDefense);
  const extraDamage = addExtraDamageFromEnemyAbilities(enemyAttack);
  const dmgTaken = Math.max(0, enemyAttack + extraDamage - block);
  state.playerHP = Math.max(0, state.playerHP - dmgTaken);
  updatePHP();
  showDmgPopup("player-sprite-slot", dmgTaken, "damage");
  queueSpriteState("enemy", "attack", 380);
  queueSpriteState("player", "hit", 430);
  flash("red");
  addLog(
    `🛡 Enemy deals ${dmgTaken} dmg! Blocked: ${block}. (${state.wpm} WPM)`,
    "enemy-log",
  );
  document.getElementById("stat-block").textContent = block;
  state.totalErrors += state.errors;
  if (state.playerHP <= 0) {
    setSpriteState("player", "death");
    setTimeout(function () {
      showResult("defeat");
    }, 600);
    return;
  }
  setTimeout(phaseAttack, 500);
}

export function submitTurn() {
  if (state.phase === "player-attack") resolveAtk();
  else if (state.phase === "enemy-attack") resolveDef();
}

function showResult(result) {
  document.getElementById("res-wpm").textContent = state.wpm;
  document.getElementById("res-acc").textContent = state.accuracy + "%";
  document.getElementById("res-dmg").textContent = state.totalDmgDealt;
  document.getElementById("res-errors").textContent = state.totalErrors;

  const resultBtns = document.getElementById("result-btns");

  if (result === "victory") {
    progress.add(state.level);
    const allDefeated = [...progress].length === ENEMIES.length;

    if (allDefeated) {
      document.getElementById("result-icon").textContent = "👑";
      document.getElementById("result-title").textContent = "GAME COMPLETE!";
      document.getElementById("end-message").textContent =
        "★ GOBLIN KING DEFEATED ★";
      document.getElementById("end-message").style.color = "#ffcc00";
      document.getElementById("result-subtitle").textContent =
        "You typed through the entire dungeon!";

      resultBtns.innerHTML = `
        <button class="btn-result btn-result-primary" id="btn-result-map">🗺️ Return to Map</button>
      `;

      document
        .getElementById("btn-result-map")
        .addEventListener("click", goToMap);
    } else {
      document.getElementById("result-icon").textContent = "⚔";
      document.getElementById("result-title").textContent = "VICTORY!";
      document.getElementById("end-message").textContent = "✓ Enemy defeated!";
      document.getElementById("end-message").style.color = "#44cc66";
      document.getElementById("result-subtitle").textContent =
        `Continue your grudge! ${ENEMIES.length - [...progress].length} remaining.`;

      resultBtns.innerHTML = `
        <button class="btn-result btn-result-primary" id="btn-result-map">🗺️ Return to Map</button>
        <button class="btn-result btn-result-secondary" id="btn-result-next">➡ Next Battle</button>
      `;

      document
        .getElementById("btn-result-map")
        .addEventListener("click", goToMap);
      document
        .getElementById("btn-result-next")
        .addEventListener("click", nextBattle);
    }
  } else {
    document.getElementById("result-icon").textContent = "💀";
    document.getElementById("result-title").textContent = "DEFEAT";
    document.getElementById("end-message").textContent = "";
    document.getElementById("result-subtitle").textContent =
      "Globin fell in battle...";

    resultBtns.innerHTML = `
      <button class="btn-result btn-result-primary" id="btn-result-retry">⚔ Retry Battle</button>
      <button class="btn-result btn-result-secondary" id="btn-result-map">🗺️ Back to Map</button>
    `;

    document
      .getElementById("btn-result-retry")
      .addEventListener("click", retryBattle);
    document
      .getElementById("btn-result-map")
      .addEventListener("click", goToMap);
  }

  swap("battle-screen", "results-screen");
  setTimeout(() => {
    document.getElementById("result-overlay").classList.add("visible");
  }, 100);
}

function goToMap() {
  swap("results-screen", "map-screen");
  renderMap();
  updateMapSubtitleLine();
  document.getElementById("result-overlay").classList.remove("visible");
}

function retryBattle() {
  document.getElementById("result-overlay").classList.remove("visible");
  startLevel(state.level);
}

function nextBattle() {
  document.getElementById("result-overlay").classList.remove("visible");

  const nextLevel = state.level + 1;
  if (nextLevel < ENEMIES.length) {
    startLevel(nextLevel);
  } else {
    goToMap();
  }
}
