// ===== AUDIO & MUSIC CONTROL =====
// Handles background and battle music playback

import { gameData } from "./game-data.js";

export function playBackgroundMusic() {
  const bgMusic = document.getElementById("bg-music");
  const battleMusic = document.getElementById("battle-music");

  // Only skip if background music is already actively playing
  if (gameData.currentMusicTrack === "background" && !bgMusic.paused) {
    return;
  }

  battleMusic.pause();
  bgMusic.src = "../Audio/MAIN%20BG%20Music.mp3";
  window.gameData.currentMusicTrack = "background";

  bgMusic.play().catch(() => {
    // Autoplay blocked by browser — music will start on the next
    // user-triggered call (e.g. clicking any button on the page).
  });
}

export function playBattleMusic() {
  const bgMusic = document.getElementById("bg-music");
  const battleMusic = document.getElementById("battle-music");

  // Only skip if battle music is already actively playing
  if (gameData.currentMusicTrack === "battle" && !battleMusic.paused) {
    return;
  }

  bgMusic.pause();
  battleMusic.src = "../Audio/Battle%20Music.mp3";
  window.gameData.currentMusicTrack = "battle";

  battleMusic.play().catch(() => {
    // Autoplay blocked by browser — music will start on the next
    // user-triggered call.
  });
}

export function stopAllMusic() {
  document.getElementById("bg-music").pause();
  document.getElementById("battle-music").pause();
  window.gameData.currentMusicTrack = null;
}
