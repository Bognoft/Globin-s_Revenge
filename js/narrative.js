// ===== NARRATIVE & STORY SYSTEM =====
// Handles story slides and combat narrative

import { SLIDES, ATK, DEF, gameData, state } from "./game-data.js";

export function pickRandomFromArray(items) {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

export function pickAtk(levelIndex) {
  if (levelIndex === 10) {
    return pickRandomFromArray(ATK[6]);
  }
  let tier = Math.floor(levelIndex / 1.8);
  if (tier > 5) {
    tier = 5;
  }
  return pickRandomFromArray(ATK[tier]);
}

export function pickDef(levelIndex) {
  if (levelIndex === 10) {
    return pickRandomFromArray(DEF[5]);
  }
  let tier = Math.floor(levelIndex / 2);
  if (tier > 4) {
    tier = 4;
  }
  return pickRandomFromArray(DEF[tier]);
}

export function buildDots() {
  const container = document.getElementById("story-dots");
  container.innerHTML = "";
  for (let i = 0; i < SLIDES.length; i++) {
    const dot = document.createElement("div");
    if (i === 0) {
      dot.className = "story-dot active";
    } else {
      dot.className = "story-dot";
    }
    container.appendChild(dot);
  }
}

const ACT_IMAGES = [
  "../Graphics/Story Novel Visuals/ACT 1.png",
  "../Graphics/Story Novel Visuals/ACT 2.png",
  "../Graphics/Story Novel Visuals/ACT 3.png",
  "../Graphics/Story Novel Visuals/ACT 4.png",
  "../Graphics/Story Novel Visuals/ACT 5.png",
];

export function renderSlide() {
  const slide = SLIDES[gameData.slideIdx];
  const scene = document.getElementById("story-scene");
  const chapter = document.getElementById("story-chapter");

  // Update chapter title
  if (slide.name) {
    chapter.textContent = slide.name;
  }

  // Swap the visual novel illustration for the current act
  const storyImg = document.getElementById("story-visual-img");
  if (storyImg && ACT_IMAGES[gameData.slideIdx]) {
    storyImg.src = ACT_IMAGES[gameData.slideIdx];
    storyImg.alt = slide.name || "Act " + (gameData.slideIdx + 1);
  }

  // Update story content
  let html = '<div class="story-text">' + slide.text + "</div>";
  scene.innerHTML = html;

  scene.classList.remove("story-reveal");
  void scene.offsetWidth;
  scene.classList.add("story-reveal");

  const allDots = document.querySelectorAll(".story-dot");
  for (let i = 0; i < allDots.length; i++) {
    if (i === gameData.slideIdx) {
      allDots[i].classList.add("active");
    } else {
      allDots[i].classList.remove("active");
    }
  }

  const nextButton = document.getElementById("story-next-btn");
  const onLastSlide = gameData.slideIdx >= SLIDES.length - 1;
  if (onLastSlide) {
    nextButton.textContent = "Open Menu ☰";
  } else {
    nextButton.textContent = "Next ▶";
  }
}

export function nextStorySlide() {
  if (gameData.slideIdx >= SLIDES.length - 1) {
    return;
  }
  gameData.slideIdx++;
  renderSlide();
}
