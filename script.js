const tileGrid      = document.querySelector("#tileGrid");
const solvedGroups  = document.querySelector("#solvedGroups");
const statusText    = document.querySelector("#status");
const hintBox       = document.querySelector("#hintBox");
const hintText      = document.querySelector("#hintText");
const groupsFound   = document.querySelector("#groupsFound");
const mistakesLeft  = document.querySelector("#mistakesLeft");
const resetButton   = document.querySelector("#resetButton");
const shuffleButton = document.querySelector("#shuffleButton");
const clearButton   = document.querySelector("#clearButton");
const submitButton  = document.querySelector("#submitButton");
const nextModal     = document.querySelector("#nextModal");
const nextPuzzleBtn = document.querySelector("#nextPuzzleBtn");
const modalSub      = document.querySelector("#modalSub");

const categoryPool = [
  { title: "Things forged",   words: ["BLADE", "CHAIN", "KEY", "COIN"],           hint: "Objects made by heat or pressure." },
  { title: "Web terms",       words: ["LINK", "NODE", "DOMAIN", "CACHE"],          hint: "These belong to the web or networks." },
  { title: "Puzzle actions",  words: ["SORT", "MATCH", "GROUP", "SOLVE"],          hint: "Things you do in this game." },
  { title: "Fast movement",   words: ["DASH", "SPRINT", "BOLT", "RUSH"],           hint: "All suggest moving quickly." },
  { title: "Kitchen tools",   words: ["WHISK", "LADLE", "TONGS", "GRATER"],        hint: "These live in a kitchen drawer." },
  { title: "Board games",     words: ["CHESS", "GO", "RISK", "CLUE"],              hint: "Tabletop classics." },
  { title: "Card suits",      words: ["HEART", "CLUB", "SPADE", "DIAMOND"],        hint: "Think of a standard deck." },
  { title: "Cloud types",     words: ["CIRRUS", "STRATUS", "CUMULUS", "NIMBUS"],   hint: "They float in the sky." },
  { title: "Music marks",     words: ["REST", "CLEF", "SHARP", "FLAT"],            hint: "Found on sheet music." },
  { title: "Ocean words",     words: ["TIDE", "REEF", "WAVE", "CURRENT"],          hint: "Linked to the sea." },
  { title: "Coding terms",    words: ["LOOP", "ARRAY", "CLASS", "STRING"],         hint: "A developer uses these." },
  { title: "Camera words",    words: ["LENS", "FLASH", "FOCUS", "SHUTTER"],        hint: "They help capture a photo." },
  { title: "Map features",    words: ["ROAD", "RIVER", "BORDER", "LEGEND"],        hint: "These appear on maps." },
  { title: "Gym moves",       words: ["SQUAT", "LUNGE", "PLANK", "PRESS"],         hint: "They belong in a workout." },
  { title: "Writing tools",   words: ["PENCIL", "MARKER", "ERASER", "PEN"],        hint: "They put ideas on paper." },
  { title: "Weather events",  words: ["RAIN", "HAIL", "SNOW", "FOG"],              hint: "Weather conditions." },
  { title: "Browser actions", words: ["OPEN", "CLOSE", "REFRESH", "BOOKMARK"],     hint: "You do these in a browser." },
  { title: "Finance words",   words: ["BOND", "STOCK", "YIELD", "FUND"],           hint: "These belong to markets." },
  { title: "Airport words",   words: ["GATE", "BAGGAGE", "BOARDING", "RUNWAY"],    hint: "Think travel day." },
  { title: "Coffee words",    words: ["LATTE", "MOCHA", "ESPRESSO", "AMERICANO"],  hint: "These are cafe orders." },
  { title: "Geometry",        words: ["ANGLE", "RADIUS", "VECTOR", "ARC"],         hint: "Math shape terms." },
  { title: "Messaging",       words: ["THREAD", "REPLY", "PIN", "MENTION"],        hint: "They belong in chat apps." },
  { title: "Security",        words: ["TOKEN", "VAULT", "CIPHER", "PATCH"],        hint: "They help keep systems safe." },
  { title: "Game terms",      words: ["LEVEL", "SCORE", "BOSS", "QUEST"],          hint: "Players know these well." },
  { title: "Building parts",  words: ["DOOR", "ROOF", "WALL", "WINDOW"],           hint: "Parts of a structure." },
  { title: "Time units",      words: ["HOUR", "WEEK", "MONTH", "YEAR"],            hint: "They measure time." },
  { title: "Phone actions",   words: ["CALL", "TEXT", "SWIPE", "TAP"],             hint: "They happen on a phone." },
  { title: "Database words",  words: ["TABLE", "QUERY", "SCHEMA", "RECORD"],       hint: "These belong in databases." },
];

const puzzleBank = buildPuzzleBank(100);

let puzzleGroups       = [];
let tiles              = [];
let selected           = new Set();
let solved             = new Set();
let mistakes           = 0;
let currentPuzzleIndex = -1;

// ── Puzzle bank ──────────────────────────────────────────────────────────────

function buildPuzzleBank(count) {
  const bank = [];
  for (let i = 0; i < count; i++) {
    const shuffled = seededShuffle(categoryPool, i + 73);
    bank.push(shuffled.slice(0, 4).map(g => ({ title: g.title, words: [...g.words], hint: g.hint })));
  }
  return bank;
}

function seededShuffle(items, seed) {
  const copy = [...items];
  let v = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    v = (v * 9301 + 49297) % 233280;
    const j = v % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ── Tiles ────────────────────────────────────────────────────────────────────

function createTiles() {
  tiles = puzzleGroups.flatMap((group, gi) => group.words.map(word => ({ word, gi })));
  randomShuffle(tiles);
}

function randomShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ── Render ───────────────────────────────────────────────────────────────────

function render() {
  // Solved group cards
  solvedGroups.innerHTML = "";
  puzzleGroups.forEach((group, i) => {
    if (!solved.has(i)) return;
    const card = document.createElement("div");
    card.className = "group-card group-" + i;
    card.innerHTML = "<strong>" + group.title + "</strong><span>" + group.words.join(", ") + "</span>";
    solvedGroups.append(card);
  });

  // Tiles
  tileGrid.innerHTML = "";
  tiles.forEach((tile, i) => {
    const btn = document.createElement("button");
    btn.className = "tile" + (selected.has(i) ? " selected" : "");
    btn.type = "button";
    btn.textContent = tile.word;
    btn.disabled = solved.has(tile.gi);
    btn.setAttribute("aria-pressed", selected.has(i) ? "true" : "false");
    btn.addEventListener("click", () => toggleTile(i));
    tileGrid.append(btn);
  });

  groupsFound.textContent  = solved.size + "/4";
  mistakesLeft.textContent = Math.max(0, 4 - mistakes);
  submitButton.disabled    = selected.size !== 4 || mistakes >= 4 || solved.size === 4;
}

// ── Game logic ───────────────────────────────────────────────────────────────

function toggleTile(i) {
  if (solved.has(tiles[i].gi)) return;
  if (selected.has(i)) {
    selected.delete(i);
  } else if (selected.size < 4) {
    selected.add(i);
  }
  statusText.textContent = selected.size === 4 ? "Submit your link." : "Select four connected tiles.";
  render();
}

function submitSelection() {
  if (selected.size !== 4) return;

  const picked = Array.from(selected).map(i => tiles[i]);
  const gi     = picked[0].gi;
  const isMatch = picked.every(t => t.gi === gi);

  if (isMatch) {
    solved.add(gi);
    selected.clear();
    showHint(false);

    if (solved.size === 4) {
      statusText.textContent = "All links forged!";
      render();
      showModal();
    } else {
      statusText.textContent = "Correct link forged.";
      render();
    }
  } else {
    // Capture hint BEFORE clearing, increment mistakes AFTER
    const hintMsg = buildHint(picked);
    mistakes++;
    selected.clear();

    statusText.textContent = mistakes >= 4
      ? "No mistakes left. Reset to try again."
      : "Not a link. Try another group.";

    showHint(true, hintMsg);
    render();
  }
}

function buildHint(picked) {
  // Count tiles per group
  const counts = new Map();
  picked.forEach(t => counts.set(t.gi, (counts.get(t.gi) || 0) + 1));
  const [topGi, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];

  const nextMistakes = mistakes + 1; // mistakes not incremented yet when called

  if (topCount === 3) {
    return "Hint " + nextMistakes + "/4: Three tiles belong to \"" + puzzleGroups[topGi].title + "\" — one doesn't fit.";
  }

  const unsolved = puzzleGroups
    .map((g, i) => ({ g, i }))
    .filter(({ i }) => !solved.has(i));

  const hintGroup = unsolved[mistakes % unsolved.length]?.g;
  return "Hint " + nextMistakes + "/4: " + (hintGroup ? hintGroup.hint : "Keep trying!");
}

function showHint(visible, msg) {
  if (visible && msg) {
    hintText.textContent = msg;
    hintBox.hidden = false;
  } else {
    hintBox.hidden = true;
    hintText.textContent = "";
  }
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
  showHint(false);
  hideModal();
  currentPuzzleIndex = pickNextIndex();
  puzzleGroups = puzzleBank[currentPuzzleIndex];
  createTiles();
  statusText.textContent = "Select four connected tiles.";
  render();
}

function pickNextIndex() {
  if (puzzleBank.length < 2) return 0;
  let next;
  do { next = Math.floor(Math.random() * puzzleBank.length); }
  while (next === currentPuzzleIndex);
  return next;
}

function shuffleActiveTiles() {
  const unsolved = tiles.filter(t => !solved.has(t.gi));
  const fixed    = tiles.map((t, i) => ({ t, i })).filter(({ t }) => solved.has(t.gi));
  randomShuffle(unsolved);
  let ai = 0;
  tiles = Array.from({ length: 16 }, (_, i) => {
    const f = fixed.find(x => x.i === i);
    return f ? f.t : unsolved[ai++];
  });
  clearSelection();
}

// ── Modal ────────────────────────────────────────────────────────────────────

function showModal() {
  modalSub.textContent = "All 4 links forged on puzzle " + (currentPuzzleIndex + 1) + ". Ready for the next one?";
  nextModal.hidden = false;
}

function hideModal() {
  nextModal.hidden = true;
}

// ── Event listeners ──────────────────────────────────────────────────────────

resetButton.addEventListener("click", resetPuzzle);
shuffleButton.addEventListener("click", shuffleActiveTiles);
clearButton.addEventListener("click", clearSelection);
submitButton.addEventListener("click", submitSelection);
nextPuzzleBtn.addEventListener("click", () => { hideModal(); resetPuzzle(); });

// Tap backdrop to dismiss
nextModal.addEventListener("click", e => { if (e.target === nextModal) { hideModal(); resetPuzzle(); } });

// ── Init ─────────────────────────────────────────────────────────────────────

resetPuzzle();
