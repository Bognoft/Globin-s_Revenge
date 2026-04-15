// ===== SCREEN NAVIGATION & TRANSITIONS =====
// Handles screen swaps and music sync during transitions

import { playBackgroundMusic, playBattleMusic } from './audio.js';
import { renderMap } from './map.js';
import { buildDots, renderSlide } from './narrative.js';
import { gameData } from './game-data.js';

export function swap(screenIdToHide, screenIdToShow) {
  const allScreens = document.querySelectorAll('.screen');
  for (let s = 0; s < allScreens.length; s++) {
    allScreens[s].classList.add('hidden');
  }
  const screenToShow = document.getElementById(screenIdToShow);
  if (screenToShow) {
    screenToShow.classList.remove('hidden');
  }
  
  // Control music based on screen
  if (screenIdToShow === 'title-screen' || screenIdToShow === 'intro-screen' || 
      screenIdToShow === 'menu-screen' || screenIdToShow === 'map-screen') {
    playBackgroundMusic();
  } else if (screenIdToShow === 'battle-screen') {
    playBattleMusic();
  }
}

export function goToMapFromMenu() { 
  swap('menu-screen', 'map-screen'); 
  renderMap(); 
}

export function restartStoryFromMenu() {
  swap('menu-screen', 'intro-screen');
  gameData.slideIdx = 0;
  buildDots();
  renderSlide();
}

export function showMenuFromMap() { 
  swap('map-screen', 'menu-screen'); 
}

export function backToTitle() { 
  swap('menu-screen', 'title-screen'); 
}
