// ===== MAIN GAME INITIALIZATION =====
// Game initialization, event listeners, and startup sequence

import { state, gameData, gameSettings, SLIDES } from "./game-data.js";
import { initSimpleSettingsMenu, applyAudioSettings } from "./settings.js";
import { playBackgroundMusic } from "./audio.js";
import { getPlayerSpritePath, loadSpriteImage } from "./sprites.js";
import { renderMap } from "./map.js";
import {
  swap,
  goToMapFromMenu,
  restartStoryFromMenu,
  showMenuFromMap,
  backToTitle,
} from "./screen-nav.js";
import { renderSlide, nextStorySlide } from "./narrative.js";
import {
  focusInput,
  refocusHiddenTypingField,
  onTyping,
  onGlobalKeydown,
} from "./typing.js";
import { submitTurn, stopBattleTimer } from "./combat.js";

function showIntro() {
  swap("title-screen", "intro-screen");
  renderSlide();
  playBackgroundMusic();
}

function skipIntro() {
  goToMapFromMenu();
}

function goToMap() {
  stopBattleTimer();
  swap("battle-screen", "map-screen");
  renderMap();
}

export function initGame() {
  // Initialize settings from localStorage
  applyAudioSettings();

  // Start background music on page load
  playBackgroundMusic();

  // Load player sprite on startup (idle state)
  const playerSpritePath = getPlayerSpritePath("idle");
  loadSpriteImage(
    "player-sprite-img",
    "player-sprite-fallback",
    playerSpritePath,
    "🫛",
  );

  // Setup settings menu
  initSimpleSettingsMenu();

  // Initialize hidden input field
  const typingInput = document.getElementById("hidden-input");
  typingInput.addEventListener("input", onTyping);
  typingInput.addEventListener("focus", refocusHiddenTypingField);

  // Global keyboard handler for Enter key to submit turn
  document.addEventListener("keydown", (event) => {
    onGlobalKeydown(event);
    // Handle Enter key for submitting turn
    if (event.key === "Enter") {
      const strikeButton = document.getElementById("btn-submit");
      if (strikeButton && !strikeButton.disabled) {
        submitTurn();
      }
    }
  });

  // Title screen button
  const btnStart = document.getElementById("btn-start");
  if (btnStart) {
    btnStart.addEventListener("click", showIntro);
  }

  // Intro screen buttons
  const btnSkip = document.getElementById("btn-skip");
  if (btnSkip) {
    btnSkip.addEventListener("click", skipIntro);
  }

  const btnNextStory = document.getElementById("story-next-btn");
  if (btnNextStory) {
    btnNextStory.addEventListener("click", () => {
      // Check if on last slide
      if (gameData.slideIdx >= SLIDES.length - 1) {
        swap("intro-screen", "menu-screen");
      } else {
        nextStorySlide();
      }
    });
  }

  // Menu button handlers
  const btnAdventure = document.getElementById("btn-adventure");
  if (btnAdventure) {
    btnAdventure.addEventListener("click", goToMapFromMenu);
  }

  const btnReread = document.getElementById("btn-reread");
  if (btnReread) {
    btnReread.addEventListener("click", restartStoryFromMenu);
  }

  const btnToTitle = document.getElementById("btn-to-title");
  if (btnToTitle) {
    btnToTitle.addEventListener("click", backToTitle);
  }

  // Map screen button
  const btnMapBack = document.getElementById("btn-back");
  if (btnMapBack) {
    btnMapBack.addEventListener("click", showMenuFromMap);
  }

  // Battle screen button
  const btnBattleMap = document.getElementById("btn-map");
  if (btnBattleMap) {
    btnBattleMap.addEventListener("click", goToMap);
  }

  // Battle submit button handler
  const btnSubmit = document.getElementById("btn-submit");
  if (btnSubmit) {
    btnSubmit.addEventListener("click", submitTurn);
  }

  // Settings menu is initialized by initSimpleSettingsMenu() above

  // Show title screen initially
  swap("init", "title-screen");

  console.log("🎮 Game initialized and ready!");
}

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGame);
} else {
  initGame();
}
