// ===== MAP SCREEN & NAVIGATION =====
// Handles map rendering, enemy nodes, tooltips, and level selection

import { ENEMIES, progress, state } from "./game-data.js";
import { startLevel } from "./combat.js";

const NS = "http://www.w3.org/2000/svg";

export function updateMapSubtitleLine() {
  const defeatedCount = progress.size;
  const subtitles = [
    "Globin tightens his grip on the quill. It begins here.",
    defeatedCount +
      " bully down. " +
      (10 - defeatedCount) +
      " to go. The grudge list is getting shorter.",
    "Halfway through the dungeon. The Goblin King's throne is calling.",
    "Almost there. One last climb to the Goblin King.",
    "The runt who was called nothing stands at the final door.",
  ];
  let index = Math.floor(defeatedCount / 2.5);
  if (index >= subtitles.length) {
    index = subtitles.length - 1;
  }
  document.getElementById("map-sub").textContent = subtitles[index];
}

export function createMapNodeGroup(i) {
  const enemy = ENEMIES[i];
  const done = progress.has(i);
  const prevDone = progress.has(i - 1);
  const available = i === 0 || prevDone;
  const locked = !available && !done;
  const isBoss = i === ENEMIES.length - 1; // fixed: was === 10
  const x = enemy.x;
  const y = enemy.y;

  const radius = isBoss ? 28 : 22;
  const badgeW = isBoss ? 52 : 42;
  const badgeH = 20;
  const labelText = isBoss ? "BOSS" : "LV" + (i + 1);

  // Colour scheme
  let fillColor, strokeColor, labelColor;
  if (done) {
    fillColor = "#1a4a1a";
    strokeColor = "#44cc66";
    labelColor = "#44cc66";
  } else if (locked) {
    fillColor = "#181818";
    strokeColor = "#444444";
    labelColor = "#555555";
  } else if (isBoss) {
    fillColor = "#280050";
    strokeColor = "#9933ff";
    labelColor = "#cc66ff";
  } else {
    fillColor = "#0a2208";
    strokeColor = "#6abf3e";
    labelColor = "#c9a825";
  }

  const node = document.createElementNS(NS, "g");
  node.style.cursor = locked ? "not-allowed" : "pointer";

  // ── Outer pulsing ring (available & undone only) ──────────────────────────
  if (!done && !locked) {
    const ring = document.createElementNS(NS, "circle");
    ring.setAttribute("cx", x);
    ring.setAttribute("cy", y);
    ring.setAttribute("r", radius + 4);
    ring.setAttribute("fill", "none");
    ring.setAttribute("stroke", isBoss ? "#7700dd" : "#6abf3e");
    ring.setAttribute("stroke-width", "1.5");
    ring.setAttribute("opacity", "0.45");
    ring.innerHTML =
      '<animate attributeName="r" values="' +
      (radius + 3) +
      ";" +
      (radius + 12) +
      ";" +
      (radius + 3) +
      '" dur="2s" repeatCount="indefinite"/>' +
      '<animate attributeName="opacity" values=".5;0;.5" dur="2s" repeatCount="indefinite"/>';
    node.appendChild(ring);
  }

  // ── Main circle ───────────────────────────────────────────────────────────
  const circle = document.createElementNS(NS, "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", radius);
  circle.setAttribute("fill", fillColor);
  circle.setAttribute("stroke", strokeColor);
  circle.setAttribute("stroke-width", isBoss ? "3" : "2");
  if (!locked) circle.setAttribute("filter", "url(#glow)");
  node.appendChild(circle);

  // ── Emoji / icon ──────────────────────────────────────────────────────────
  const icon = document.createElementNS(NS, "text");
  icon.setAttribute("x", x);
  icon.setAttribute("y", y + (isBoss ? 8 : 6));
  icon.setAttribute("text-anchor", "middle");
  icon.setAttribute("dominant-baseline", "middle");
  icon.setAttribute("font-size", isBoss ? "20" : "16");
  icon.setAttribute("pointer-events", "none");
  if (done) icon.textContent = "✓";
  else if (locked) icon.textContent = "🔒";
  else icon.textContent = enemy.sprite;
  node.appendChild(icon);

  // ── Level badge (background rect + bold text) ─────────────────────────────
  const badgeX = x - badgeW / 2;
  const badgeY = y + radius + 5;

  const badgeBg = document.createElementNS(NS, "rect");
  badgeBg.setAttribute("x", badgeX);
  badgeBg.setAttribute("y", badgeY);
  badgeBg.setAttribute("width", badgeW);
  badgeBg.setAttribute("height", badgeH);
  badgeBg.setAttribute("rx", "5");
  badgeBg.setAttribute("ry", "5");
  badgeBg.setAttribute("fill", "rgba(0,0,0,0.88)");
  badgeBg.setAttribute("stroke", strokeColor);
  badgeBg.setAttribute("stroke-width", "1.2");
  node.appendChild(badgeBg);

  const badgeText = document.createElementNS(NS, "text");
  badgeText.setAttribute("x", x);
  badgeText.setAttribute("y", badgeY + badgeH - 5);
  badgeText.setAttribute("text-anchor", "middle");
  badgeText.setAttribute("font-size", isBoss ? "12" : "13");
  badgeText.setAttribute("font-family", "Cinzel,serif");
  badgeText.setAttribute("font-weight", "900");
  badgeText.setAttribute("letter-spacing", "1");
  badgeText.setAttribute("fill", labelColor);
  // Paint-order gives a dark outline around the text for readability
  badgeText.setAttribute("paint-order", "stroke fill markers");
  badgeText.setAttribute("stroke", "#000000");
  badgeText.setAttribute("stroke-width", "2");
  badgeText.setAttribute("stroke-linejoin", "round");
  badgeText.setAttribute("pointer-events", "none");
  badgeText.textContent = labelText;
  node.appendChild(badgeText);

  // ── Interaction ───────────────────────────────────────────────────────────
  if (!locked) {
    node.addEventListener("click", function () {
      startLevel(i);
    });
  }
  node.addEventListener("mousemove", function (ev) {
    showMapTooltip(ev, i, done, locked, isBoss);
  });
  node.addEventListener("mouseleave", hideMapTooltip);

  return node;
}

export function renderMap() {
  const container = document.getElementById("map-nodes");
  container.innerHTML = "";

  // SVG viewBox matches the map image aspect ratio (16:9 = 1000×562).
  // preserveAspectRatio="none" stretches it to fill the container exactly,
  // so x/y coordinates map 1-to-1 with the visible image.
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "map-nodes-svg");
  svg.setAttribute("viewBox", "0 0 1000 562");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("xmlns", NS);

  // Glow filter for available nodes
  const defs = document.createElementNS(NS, "defs");
  const filter = document.createElementNS(NS, "filter");
  filter.setAttribute("id", "glow");
  filter.setAttribute("x", "-30%");
  filter.setAttribute("y", "-30%");
  filter.setAttribute("width", "160%");
  filter.setAttribute("height", "160%");
  const blur = document.createElementNS(NS, "feGaussianBlur");
  blur.setAttribute("stdDeviation", "3");
  blur.setAttribute("result", "b");
  filter.appendChild(blur);
  const merge = document.createElementNS(NS, "feMerge");
  const mNode1 = document.createElementNS(NS, "feMergeNode");
  mNode1.setAttribute("in", "b");
  const mNode2 = document.createElementNS(NS, "feMergeNode");
  mNode2.setAttribute("in", "SourceGraphic");
  merge.appendChild(mNode1);
  merge.appendChild(mNode2);
  filter.appendChild(merge);
  defs.appendChild(filter);
  svg.appendChild(defs);

  // Nodes — no connecting lines, just the circles
  const group = document.createElementNS(NS, "g");
  for (let i = 0; i < ENEMIES.length; i++) {
    group.appendChild(createMapNodeGroup(i));
  }
  svg.appendChild(group);
  container.appendChild(svg);

  updateMapSubtitleLine();
}

export function showMapTooltip(
  mouseEvent,
  enemyIndex,
  isDefeated,
  isLocked,
  isBoss,
) {
  const tooltip = document.getElementById("map-tooltip");
  const enemy = ENEMIES[enemyIndex];

  document.getElementById("tt-name").textContent = enemy.zone;
  document.getElementById("tt-enemy").textContent =
    enemy.sprite + " " + enemy.name + " — HP: " + enemy.hp;

  const statusEl = document.getElementById("tt-status");
  if (isDefeated) {
    statusEl.textContent = "✓ Defeated";
    statusEl.className = "tt-status tt-done";
  } else if (isBoss) {
    statusEl.textContent = "👑 Final Boss";
    statusEl.className = "tt-status tt-boss";
  } else if (isLocked) {
    statusEl.textContent = "🔒 Locked";
    statusEl.className = "tt-status tt-lock";
  } else {
    statusEl.textContent = "▶ Click to Fight";
    statusEl.className = "tt-status tt-avail";
  }

  tooltip.style.left = mouseEvent.clientX + 14 + "px";
  tooltip.style.top = mouseEvent.clientY - 10 + "px";
  tooltip.classList.add("visible");
}

export function hideMapTooltip() {
  document.getElementById("map-tooltip").classList.remove("visible");
}
