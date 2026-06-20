const tileGrid = document.querySelector("#tileGrid");
const solvedGroups = document.querySelector("#solvedGroups");
const statusText = document.querySelector("#status");
const hintText = document.querySelector("#hintText");
const groupsFound = document.querySelector("#groupsFound");
const mistakesLeft = document.querySelector("#mistakesLeft");
const resetButton = document.querySelector("#resetButton");
const shuffleButton = document.querySelector("#shuffleButton");
const clearButton = document.querySelector("#clearButton");
const submitButton = document.querySelector("#submitButton");

const VISITOR_COUNT_INTERVAL_MS = 6 * 60 * 60 * 1000;

const categoryPool = [
  { title: "Things forged", words: ["BLADE", "CHAIN", "KEY", "COIN"], hint: "Look for objects made by heat or pressure." },
  { title: "Web terms", words: ["LINK", "NODE", "DOMAIN", "CACHE"], hint: "These belong to the web or networks." },
  { title: "Puzzle actions", words: ["SORT", "MATCH", "GROUP", "SOLVE"], hint: "These are things you do in this game." },
  { title: "Fast movement", words: ["DASH", "SPRINT", "BOLT", "RUSH"], hint: "All suggest moving quickly." },
  { title: "Kitchen tools", words: ["WHISK", "LADLE", "TONGS", "GRATER"], hint: "These live in a kitchen drawer." },
  { title: "Board games", words: ["CHESS", "GO", "RISK", "CLUE"], hint: "They are tabletop classics." },
  { title: "Card suits", words: ["HEART", "CLUB", "SPADE", "DIAMOND"], hint: "Think of a standard deck." },
  { title: "Cloud types", words: ["CIRRUS", "STRATUS", "CUMULUS", "NIMBUS"], hint: "They float in the sky." },
  { title: "Music marks", words: ["REST", "CLEF", "SHARP", "FLAT"], hint: "You would find them on sheet music." },
  { title: "Ocean words", words: ["TIDE", "REEF", "WAVE", "CURRENT"], hint: "These are linked to the sea." },
  { title: "Coding terms", words: ["LOOP", "ARRAY", "CLASS", "STRING"], hint: "A developer uses these." },
  { title: "Camera words", words: ["LENS", "FLASH", "FOCUS", "SHUTTER"], hint: "They help capture a photo." },
  { title: "Map features", words: ["ROAD", "RIVER", "BORDER", "LEGEND"], hint: "These appear on maps." },
  { title: "Gym moves", words: ["SQUAT", "LUNGE", "PLANK", "PRESS"], hint: "They belong in a workout." },
  { title: "Writing tools", words: ["PENCIL", "MARKER", "ERASER", "PEN"], hint: "They help put ideas on paper." },
  { title: "Weather events", words: ["RAIN", "HAIL", "SNOW", "FOG"], hint: "These describe weather conditions." },
  { title: "Browser actions", words: ["OPEN", "CLOSE", "REFRESH", "BOOKMARK"], hint: "You do these in a browser." },
  { title: "Finance words", words: ["BOND", "STOCK", "YIELD", "FUND"], hint: "These belong to markets." },
  { title: "Airport words", words: ["GATE", "BAGGAGE", "BOARDING", "RUNWAY"], hint: "Think travel day." },
  { title: "Coffee words", words: ["LATTE", "MOCHA", "ESPRESSO", "AMERICANO"], hint: "These are cafe orders." },
  { title: "Geometry", words: ["ANGLE", "RADIUS", "VECTOR", "ARC"], hint: "These are math shape terms." },
  { title: "Messaging", words: ["THREAD", "REPLY", "PIN", "MENTION"], hint: "They belong in chat apps." },
  { title: "Security", words: ["TOKEN", "VAULT", "CIPHER", "PATCH"], hint: "They help keep systems safer." },
  { title: "Game terms", words: ["LEVEL", "SCORE", "BOSS", "QUEST"], hint: "Players know these well." },
  { title: "Building parts", words: ["DOOR", "ROOF", "WALL", "WINDOW"], hint: "They are parts of a structure." },
  { title: "Time units", words: ["HOUR", "WEEK", "MONTH", "YEAR"], hint: "They measure time." },
  { title: "Phone actions", words: ["CALL", "TEXT", "SWIPE", "TAP"], hint: "They happen on a phone." },
  { title: "Database words", words: ["TABLE", "QUERY", "SCHEMA", "RECORD"], hint: "These belong in databases." },
];

// Fixed duplicate words: Finance "INDEX" → "FUND", Database "INDEX" → "SCHEMA"

const puzzleBank = buildPuzzleBank(100);

let puzzleGroups = [];
let tiles = [];
let selected = new Set();
let solved = new Set();
let mistakes = 0;
let currentPuzzleIndex = -1;

// ── Puzzle bank builder ──────────────────────────────────────────────────────

function buildPuzzleBank(count) {
  const bank = [];
  for (let index = 0; index < count; index += 1) {
    const shuffled = seededShuffle(categoryPool, index + 73);
    bank.push(shuffled.slice(0, 4).map((group) => ({
      title: group.title,
      words: [...group.words],
      hint: group.hint,
    })));
  }
  return bank;
}

function seededShuffle(items, seed) {
  const copy = [...items];
  let value = seed;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    value = (value * 9301 + 49297) % 233280;
    const swapIndex = value % (index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

// ── Tile management ──────────────────────────────────────────────────────────

function createTiles() {
  tiles = puzzleGroups.flatMap((group, groupIndex) =>
    group.words.map((word) => ({ word, groupIndex }))
  );
  shuffleTiles();
}

function shuffleTiles() {
  for (let index = tiles.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [tiles[index], tiles[swapIndex]] = [tiles[swapIndex], tiles[index]];
  }
}

// ── Render ───────────────────────────────────────────────────────────────────

function render() {
  tileGrid.innerHTML = "";
  solvedGroups.innerHTML = "";

  puzzleGroups.forEach((group, index) => {
    if (!solved.has(index)) return;

    const card = document.createElement("div");
    card.className = `group-card group-${index}`;
    const title = document.createElement("strong");
    title.textContent = group.title;
    const words = document.createElement("span");
    words.textContent = group.words.join(", ");
    card.append(title, words);
    solvedGroups.append(card);
  });

  tiles.forEach((tile, index) => {
    const button = document.createElement("button");
    button.className = "tile";
    button.type = "button";
    button.textContent = tile.word;
    button.disabled = solved.has(tile.groupIndex);
    button.classList.toggle("selected", selected.has(index));
    button.setAttribute("aria-pressed", selected.has(index) ? "true" : "false");
    button.addEventListener("click", () => toggleTile(index));
    tileGrid.append(button);
  });

  groupsFound.textContent = `${solved.size}/4`;
  mistakesLeft.textContent = String(Math.max(0, 4 - mistakes));
  submitButton.disabled = selected.size !== 4 || mistakes >= 4 || solved.size === puzzleGroups.length;
}

// ── Game logic ───────────────────────────────────────────────────────────────

function toggleTile(index) {
  if (solved.has(tiles[index].groupIndex)) return;

  if (selected.has(index)) {
    selected.delete(index);
  } else if (selected.size < 4) {
    selected.add(index);
  }

  statusText.textContent = selected.size === 4
    ? "Submit your link."
    : "Select four connected tiles.";
  render();
}

function submitSelection() {
  if (selected.size !== 4) return;

  // Capture picked tiles BEFORE clearing selection
  const picked = Array.from(selected).map((index) => tiles[index]);
  const groupIndex = picked[0].groupIndex;
  const isMatch = picked.every((tile) => tile.groupIndex === groupIndex);

  if (isMatch) {
    solved.add(groupIndex);
    selected.clear();
    hintText.textContent = "";

    if (solved.size === puzzleGroups.length) {
      statusText.textContent = "All links forged!";
      render();
      showNextPuzzleOverlay();
    } else {
      statusText.textContent = "Correct link forged.";
      render();
    }
  } else {
    mistakes += 1;
    // Generate hint BEFORE clearing so we have tile group info
    const hint = createMistakeHint(picked);
    selected.clear();

    hintText.textContent = hint;
    statusText.textContent = mistakes >= 4
      ? "No mistakes left. Reset to try again."
      : "Not a link. Try another group.";

    render();
  }
}

function createMistakeHint(picked) {
  // Count how many picked tiles belong to each group
  const counts = new Map();
  picked.forEach((tile) => {
    counts.set(tile.groupIndex, (counts.get(tile.groupIndex) || 0) + 1);
  });

  // Find the group with most tiles selected
  const strongest = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];

  // "One away" hint
  if (strongest && strongest[1] === 3) {
    return `Hint ${mistakes}/4: Three of these belong to "${puzzleGroups[strongest[0]].title}" — one doesn't fit.`;
  }

  // Category hint — cycle through unsolved groups
  const unsolvedGroups = puzzleGroups
    .map((group, index) => ({ group, index }))
    .filter(({ index }) => !solved.has(index));

  const hintGroup = unsolvedGroups[(mistakes - 1) % unsolvedGroups.length]?.group;
  return hintGroup ? `Hint ${mistakes}/4: ${hintGroup.hint}` : "";
}

function clearSelection() {
  selected.clear();
  statusText.textContent = "Select four connected tiles.";
  render();
}

function resetPuzzle() {
  selected.clear();
  solved.clear();
  mistakes = 0;
  currentPuzzleIndex = pickNextPuzzleIndex();
  puzzleGroups = puzzleBank[currentPuzzleIndex];
  createTiles();
  statusText.textContent = "Select four connected tiles.";
  hintText.textContent = `Puzzle ${currentPuzzleIndex + 1} of ${puzzleBank.length}`;
  render();
}

function pickNextPuzzleIndex() {
  if (puzzleBank.length < 2) return 0;
  let next = Math.floor(Math.random() * puzzleBank.length);
  while (next === currentPuzzleIndex) {
    next = Math.floor(Math.random() * puzzleBank.length);
  }
  return next;
}

function shuffleActiveTiles() {
  const unsolved = tiles.filter((tile) => !solved.has(tile.groupIndex));
  const fixed = tiles.map((tile, index) => ({ tile, index })).filter(({ tile }) => solved.has(tile.groupIndex));

  for (let index = unsolved.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [unsolved[index], unsolved[swapIndex]] = [unsolved[swapIndex], unsolved[index]];
  }

  tiles = [];
  let activeIndex = 0;
  for (let index = 0; index < 16; index += 1) {
    const fixedTile = fixed.find((item) => item.index === index);
    tiles.push(fixedTile ? fixedTile.tile : unsolved[activeIndex]);
    if (!fixedTile) activeIndex += 1;
  }

  clearSelection();
}

// ── Next puzzle overlay ───────────────────────────────────────────────────────

function showNextPuzzleOverlay() {
  // Remove any existing overlay first
  document.querySelector(".next-puzzle-overlay")?.remove();

  const overlay = document.createElement("div");
  overlay.className = "next-puzzle-overlay";

  const card = document.createElement("div");
  card.className = "next-puzzle-card";

  const heading = document.createElement("h2");
  heading.textContent = "Puzzle complete!";

  const sub = document.createElement("p");
  sub.textContent = `All 4 links forged on puzzle ${currentPuzzleIndex + 1}. Ready for the next one?`;

  const btn = document.createElement("button");
  btn.className = "primary";
  btn.type = "button";
  btn.textContent = "Next Puzzle →";
  btn.addEventListener("click", () => {
    overlay.remove();
    resetPuzzle();
  });

  card.append(heading, sub, btn);
  overlay.append(card);

  // Also allow tap on backdrop to dismiss
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
      resetPuzzle();
    }
  });

  document.body.append(overlay);
}

// ── Event listeners ──────────────────────────────────────────────────────────

resetButton.addEventListener("click", resetPuzzle);
shuffleButton.addEventListener("click", shuffleActiveTiles);
clearButton.addEventListener("click", clearSelection);
submitButton.addEventListener("click", submitSelection);

// ── Init ─────────────────────────────────────────────────────────────────────

resetPuzzle();
