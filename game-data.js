// ===== GAME DATA & CONSTANTS =====
// Contains all game data, constants, and structures

export const SLIDES = [
  {
    name: "ACT 1 — THE FALL",
    text: `<strong>Globin lived in the dungeon as the weakest goblin.</strong><br>He was bullied every day and treated like nothing.<br><br><strong>While others grew stronger,</strong><br>he survived on scraps… and silence.<br><br><strong>One day, the Goblin King's gold disappeared.</strong><br>A powerful treasure said to grant immense strength.<br><br><strong>Without hesitation,</strong><br>Globin was blamed.<br><br><strong>No one spoke for him.</strong><br>No one stood beside him.<br><br><strong>The king ordered his execution.</strong><br>His parents stepped forward to protect him…<br>but instead, they were executed in front of him.<br><br><strong>Globin watched everything.</strong><br>Before the guards could take him—<br>he ran.<br><br><strong>He escaped the dungeon…</strong><br>and was cast into a world that wanted him dead.`,
  },
  {
    name: "ACT 2 — THE ESCAPE",
    text: `<strong>Globin was now running for his life.</strong><br>The king's guards hunted him.<br>The dungeon was no longer safe.<br><br><strong>He wandered through dark paths,</strong><br>searching for a place to hide.<br><br><strong>Weak. Alone. Afraid.</strong><br><br><strong>Until he stumbled upon a hidden cave</strong><br>no one had ever seen before.<br><br><strong>Inside… something waited.</strong><br>A mysterious book and a quill,<br>left behind by a forgotten goblin shaman.<br><br><strong>When Globin touched it—</strong><br>he felt power.<br><br><strong>The book allowed him to write words…</strong><br>that became real attacks.<br><br><strong>Every word he writes</strong><br>can inflict damage.<br><br><strong>For the first time…</strong><br>Globin had power.`,
  },
  {
    name: "ACT 3 — RISE OF POWER",
    text: `<strong>Globin begins to learn the power of the book.</strong><br>At first, he struggles.<br>His words are slow… weak… unstable.<br><br><strong>But with every battle,</strong><br>he improves.<br><br><strong>The faster he writes,</strong><br>the stronger his attacks become.<br><br><strong>The more accurate he is,</strong><br>the more deadly he becomes.<br><br><strong>He travels across ruined lands—</strong><br>forests, villages, battlefields.<br><br><strong>Every enemy…</strong><br>makes him stronger.<br><br><strong>And along the way,</strong><br>he hears whispers.<br><br><strong>The gold… was never stolen.</strong><br>It was all planned.`,
  },
  {
    name: "ACT 4 — THE TRUTH",
    text: `<strong>Globin uncovers the truth.</strong><br>The Goblin King planned everything.<br><br><strong>The missing gold…</strong><br>was nothing but an excuse.<br><br><strong>A way to eliminate the weak.</strong><br>Globin…<br>was just a sacrifice.<br><br><strong>His parents died…</strong><br>for a lie.<br><br><strong>Everything he lost—</strong><br>was never an accident.<br><br><strong>Now, Globin understands.</strong><br>This is no longer about survival.<br><br><strong>This is revenge.</strong>`,
  },
  {
    name: "ACT 5 — RETURN",
    text: `<strong>Globin returns to the dungeon.</strong><br>No longer weak.<br>Now feared.<br><br><strong>Armed with the power of words,</strong><br>he fights through the goblin army.<br><br><strong>Each battle proves</strong><br>how far he has come.<br><br><strong>Step by step…</strong><br>he climbs back to the throne.<br><br><strong>Until finally—</strong><br>He reaches the throne room.<br>The king stands before him.<br><br><strong>The one who took everything.</strong><br>The one who started it all.<br><br><strong>And now…</strong><br>The final battle begins.`,
  },
];

export const SPRITE_STATES = ["idle", "attack", "hit", "death"];
export const SAMPLE_CHARACTER_IMAGE =
  "../Graphics/Character Assets/globin derp.png";
export const PLAYER_SPRITE_BASE = "Globin";
export const SETTINGS_KEY = "globins-revenge-settings-v1";

export const ENEMIES = [
  {
    name: "GOBLIN GRUNT",
    sprite: "👺",
    spriteBase: "Goblin Runt",
    hp: 80,
    atk: 15,
    def: 5,
    type: "Grunt",
    ability: "Bites harder per missed char",
    zone: "The Goblin Pit",
    x: 430,
    y: 515,
    slug: "goblin-grunt",
  },
  {
    name: "RAT KING",
    sprite: "🐀",
    spriteBase: "Rat King",
    hp: 95,
    atk: 18,
    def: 4,
    type: "Beast",
    ability: "Grows faster when hurt",
    zone: "Rat King's Den",
    x: 590,
    y: 515,
    slug: "rat-king",
  },
  {
    name: "GOBLIN SHAMAN",
    sprite: "👹",
    spriteBase: "Goblin Shaman",
    hp: 110,
    atk: 22,
    def: 8,
    type: "Mage",
    ability: "Curses accuracy on each error",
    zone: "Shaman's Forest",
    x: 400,
    y: 428,
    slug: "goblin-shaman",
  },
  {
    name: "BAT SWARM",
    sprite: "🦇",
    spriteBase: "Bat Swarm",
    hp: 100,
    atk: 25,
    def: 6,
    type: "Swarm",
    ability: "Triple damage if WPM < 20",
    zone: "Cave of Bats",
    x: 610,
    y: 444,
    slug: "bat-swarm",
  },
  {
    name: "SKELETON ARCHER",
    sprite: "💀",
    spriteBase: "Skeleton Archer",
    hp: 130,
    atk: 28,
    def: 10,
    type: "Ranged",
    ability: "+8 damage per typo made",
    zone: "Bone Corridor",
    x: 520,
    y: 371,
    slug: "skeleton-archer",
  },
  {
    name: "GOBLIN ZOMBIE",
    sprite: "🧟",
    spriteBase: "Goblin Zombie",
    hp: 160,
    atk: 30,
    def: 12,
    type: "Undead",
    ability: "Regenerates 8 HP per your attack",
    zone: "Zombie Vaults",
    x: 400,
    y: 338,
    slug: "goblin-zombie",
  },
  {
    name: "CAVE TROLL",
    sprite: "🧌",
    spriteBase: "Cave Troll",
    hp: 200,
    atk: 35,
    def: 20,
    type: "Brute",
    ability: "Double damage if WPM < 25",
    zone: "Troll Bridge",
    x: 520,
    y: 298,
    slug: "cave-troll",
  },
  {
    name: "FIRE GOBLIN",
    sprite: "🔥",
    spriteBase: "Fire Goblin",
    hp: 175,
    atk: 40,
    def: 15,
    type: "Elemental",
    ability: "+10 burn damage per error",
    zone: "Fire Cavern",
    x: 630,
    y: 292,
    slug: "fire-goblin",
  },
  {
    name: "VENOMFANG",
    sprite: "🐍",
    spriteBase: "Venomfang",
    hp: 190,
    atk: 38,
    def: 18,
    type: "Reptile",
    ability: "Poisons Globin: -5 HP each enemy turn",
    zone: "Venom Depths",
    x: 420,
    y: 247,
    slug: "venomfang",
  },
  {
    name: "GOBLIN KING",
    sprite: "👑",
    spriteBase: "Goblin King",
    hp: 220,
    atk: 45,
    def: 22,
    type: "BOSS",
    ability: "Demands tribute for every error",
    zone: "The Throne Chamber",
    x: 510,
    y: 219,
    slug: "goblin-king",
  },
];

export const ATK = [
  // Tier 0 — Goblin Grunt & Rat King (short, punchy)
  [
    "Globin grips the ancient quill and faces the dungeon's weakest bully for the very first time.",
    "Every word typed is a strike. Every letter is fury. Globin begins his long-awaited revenge.",
    "The Goblin Grunt laughs at the smallest goblin in the dungeon. He will not be laughing much longer.",
    "Globin's hands are steady. The quill glows ready. The grudge list starts here and now.",
    "Tiny steps forward. Enormous resolve inside. Globin fights back against every bully who ever mocked him.",
    "Write every word with purpose. This is where the revenge of the weakest goblin finally begins.",
  ],
  // Tier 1 — Goblin Shaman & Bat Swarm (medium)
  [
    "Globin was always called the weakest. Tonight that changes with every precise word he types into the darkness.",
    "The Rat King controls the sewers with teeth and claws. Globin controls the battlefield with words and fury.",
    "Speed and accuracy are the only weapons available here. Globin uses both without any hesitation at all.",
    "Every correct letter is a strike landed on the enemy. Every error is an opening for them to strike back.",
    "The dungeon whispers that Globin cannot possibly win this fight. The ancient quill disagrees very loudly indeed.",
  ],
  // Tier 2 — Skeleton Archer & Goblin Zombie (longer)
  [
    "They laughed when Globin first picked up the ancient quill. Nobody is laughing now as he charges through the dungeon corridors with fury.",
    "The shaman's dark curses fill the air but Globin's words cut through forbidden magic like a blade cutting through shadow and smoke.",
    "Each correct letter is a blow landed against those who used dark spells to curse Globin's name and destroy everything he loved.",
    "Globin remembers every insult, every cruel word, every time the dungeon bullies pushed him down. That anger makes him faster now.",
    "The corridor echoes with the sound of Globin's determined typing as he charges toward the next enemy on his long grudge list.",
  ],
  // Tier 3 — Cave Troll & Fire Goblin (long, intense)
  [
    "Globin has fought through fire, poison, bat swarms, and dark magic since beginning his long climb back to the dungeon throne room.",
    "The dungeon holds ten enemies who wronged Globin over the years, and he intends to repay every single one with interest.",
    "Speed matters in combat but accuracy determines the kill. A slow precise typist outlasts a fast careless one every single time.",
    "Globin's hands move across the ancient runes of the scribe's quill with practiced confidence, building toward a devastating finishing strike.",
    "They called him the runt goblin, the floor sweeper, the nothing. His quill disagrees with their cruel assessment loudly and completely.",
  ],
  // Tier 4 — Venomfang (very long)
  [
    "Globin thinks of every humiliation the dungeon threw at him over the years, channeling every memory of suffering into raw typing velocity and precision.",
    "The skeleton archers fired from the shadows but Globin typed through every volley. Each correct word became both a shield and a sword.",
    "Ancient scrolls speak of a technique where words become physical force if typed with perfect accuracy at high speed. Globin has mastered this through sheer determined spite.",
    "Dunmora's darkest passages are home to creatures that have never faced an opponent armed with language, fury, and the memory of lost parents taken for a lie.",
    "The venom in the air makes fingers slow and thoughts foggy, but Globin types through the poison because he made a promise to his parents.",
  ],
  // Tier 5 — Goblin King BOSS
  [
    "Globin stands at the iron doors of the Throne Chamber, his quill still crackling from nine battles won through speed, accuracy, and unstoppable fury.",
    "Every dungeon in Dunmora told stories of the Goblin King — the Unconquerable Tyrant of the Deep. They forgot to account for one small goblin with a very large grudge.",
    "The greatest weapon Globin carries into this final battle is not the quill or the power of words. It is the memory of his parents, taken for a lie. Type every letter for them.",
  ],
  // Tier 6 — unused fallback
  [
    "Globin stands at the iron doors of the Throne Chamber, his quill still crackling from every battle fought and won against all odds.",
    "Every dungeon in Dunmora told stories of the Goblin King — the Unconquerable Tyrant of the Deep. They forgot to account for a very small goblin with a very large grudge and an ancient magical quill.",
    "The greatest weapon Globin carries into the final battle is the memory of every single time he was told he was nothing. He types them out one by one until the king understands what it means to underestimate the runt.",
  ],
];

export const DEF = [
  // Tier 0 — Goblin Grunt & Rat King (very short)
  [
    "Block now.",
    "Shield raised.",
    "Hold the line.",
    "Brace yourself.",
    "Absorb the hit.",
  ],
  // Tier 1 — Goblin Shaman & Bat Swarm (short)
  [
    "Dodge and parry. Right now.",
    "Guard your vitals, Globin.",
    "Raise the quill ward quickly.",
    "The blow is coming. Type fast.",
    "Block the strike with your words.",
  ],
  // Tier 2 — Skeleton Archer & Goblin Zombie (medium)
  [
    "Globin digs his heels in and raises his magical ward just in time to absorb the worst of the incoming attack from the shadows.",
    "The ancient quill glows defensively as Globin types a protection phrase, hardening the air around him into an unbreakable magical barrier.",
    "Words of warding pour from the quill as Globin braces against the enemy's charge across the dark dungeon stone floor.",
    "Speed of thought becomes speed of defense right now. Type the warding runes and hold the line against this powerful dungeon enemy.",
    "Globin's defensive typing activates the scribe's barrier spell. Every correct letter thickens the shield. Every error cracks it wide open.",
  ],
  // Tier 3 — Cave Troll & Fire Goblin (longer)
  [
    "The enemy's attack crashes against the magical barrier Globin summons through rapid precise typing, each word reinforcing the solid wall of force.",
    "Dunmora's ancient defensive scrolls speak of a technique where typed words become solid shields. Globin is using it right now, desperate and fully focused.",
    "The hit is coming fast and hard. Globin's only chance is to complete the defensive phrase before impact. Type it now. Do not miss a single letter.",
    "Ancient warding magic requires both speed and precision in equal measure. Globin cannot afford to be sloppy here. Every single letter must land exactly right.",
    "Globin plants his feet firmly and lets the words flow from his quill in a defensive cascade, each phrase adding another solid layer to his barrier.",
  ],
  // Tier 4 — Venomfang & Goblin King (longest)
  [
    "The Venomfang strikes with blinding speed and Globin must channel every ounce of his practiced defensive typing into the barrier before those fangs find him.",
    "Despite the venom burning through his veins and the fire scorching the dungeon air around him, Globin refuses to let his fingers falter on the warding phrases.",
    "Globin has survived nine floors of this dungeon through sheer determination. He is not falling here. Type the defense. Type it clean. Hold the line for his parents.",
    "THE GOBLIN KING'S FIST DESCENDS LIKE A FALLING MOUNTAIN. Type the warding phrase immediately or Globin takes full devastating damage from the tyrant who took everything from him.",
    "THE GOBLIN KING ROARS AND SWINGS WITH DOUBLED FORCE. Globin needs every single ounce of his defensive typing skill right now. Faster. Cleaner. No mistakes allowed.",
  ],
  // Tier 5 — unused fallback
  [
    "THE GOBLIN KING'S FIST DESCENDS LIKE A FALLING MOUNTAIN. Type the warding phrase immediately. Complete it before impact or Globin takes full devastating unblocked damage.",
    "THE GOBLIN KING ROARS AND SWINGS — his enraged attack doubles in force at half health. Globin needs every ounce of his defensive typing skill right now. Faster. Cleaner. No mistakes. Hold the barrier.",
  ],
];

// Game state object
export const progress = new Set();

export let state = {
  level: 0,
  playerHP: 100,
  playerMaxHP: 100,
  enemyHP: 0,
  enemyMaxHP: 0,
  phase: "idle",
  charIndex: 0,
  errors: 0,
  isTyping: false,
  startTime: null,
  currentText: "",
  wpm: 0,
  accuracy: 100,
  totalDmgDealt: 0,
  totalErrors: 0,
  isBoss: false,
  bossEnraged: false,
  poisoned: false,
  playerSpriteState: "idle",
  enemySpriteState: "idle",
};

// Game settings
export let gameSettings = {
  mute: false,
  master: 100,
  music: 100,
};

// Shared game data object for mutable state across modules
export const gameData = {
  slideIdx: 0,
  currentMusicTrack: null,
};

// Also export at window level for cross-module access
if (typeof window !== "undefined") {
  window.gameData = gameData;
}
