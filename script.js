// ── DOM refs ─────────────────────────────────────────────────────────────────
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
const modalBoardBtn = document.querySelector("#modalBoardBtn");
const modalSub      = document.querySelector("#modalSub");
const modalStats    = document.querySelector("#modalStats");
const modalIcon     = document.querySelector("#modalIcon");
const modalTitle    = document.querySelector("#modalTitle");

// Stats panel
const statCleared   = document.querySelector("#statCleared");
const statStreak    = document.querySelector("#statStreak");
const statBest      = document.querySelector("#statBest");
const statPlayed    = document.querySelector("#statPlayed");
const statPerfect   = document.querySelector("#statPerfect");
const statAvg       = document.querySelector("#statAvg");
const resetStatsBtn = document.querySelector("#resetStatsBtn");

// Board panel
const boardList        = document.querySelector("#boardList");
const boardSubmitArea  = document.querySelector("#boardSubmitArea");
const nicknameInput    = document.querySelector("#nicknameInput");
const submitScoreBtn   = document.querySelector("#submitScoreBtn");

// Tabs
const tabs   = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

// ── Config ───────────────────────────────────────────────────────────────────
// Replace this URL with your deployed Cloudflare Worker URL
const WORKER_URL = "https://linkforge-scores.cslcs-gen.workers.dev";
const LS_KEY     = "linkforge:stats";
const LS_NICK    = "linkforge:nickname";

// ── Category pool ────────────────────────────────────────────────────────────
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

// ── Game state ───────────────────────────────────────────────────────────────
let puzzleGroups       = [];
let tiles              = [];
let selected           = new Set();
let solved             = new Set();
let mistakes           = 0;
let currentPuzzleIndex = -1;

// ── Local stats ──────────────────────────────────────────────────────────────
function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || defaultStats();
  } catch { return defaultStats(); }
}

function defaultStats() {
  return { cleared: 0, streak: 0, best: 0, played: 0, perfect: 0, totalMistakes: 0 };
}

function saveStats(s) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

function renderStats() {
  const s = loadStats();
  statCleared.textContent = s.cleared;
  statStreak.textContent  = s.streak;
  statBest.textContent    = s.best;
  statPlayed.textContent  = s.played;
  statPerfect.textContent = s.perfect;
  statAvg.textContent     = s.played > 0 ? (s.totalMistakes / s.played).toFixed(1) : "—";
}

function recordResult(cleared) {
  const s = loadStats();
  s.played++;
  s.totalMistakes += mistakes;
  if (cleared) {
    s.cleared++;
    s.streak++;
    if (s.streak > s.best) s.best = s.streak;
    if (mistakes === 0) s.perfect++;
  } else {
    s.streak = 0;
  }
  saveStats(s);
}

// ── Leaderboard ──────────────────────────────────────────────────────────────
let boardData        = [];
let pendingScore     = null;
let myNickname       = localStorage.getItem(LS_NICK) || "";

async function fetchBoard() {
  boardList.innerHTML = "<div class='board-loading'>Loading leaderboard&#8230;</div>";
  try {
    const res = await fetch(WORKER_URL + "/scores");
    if (!res.ok) throw new Error("HTTP " + res.status);
    boardData = await res.json();
    renderBoard();
  } catch {
    boardList.innerHTML = "<div class='board-error'>Could not load leaderboard. Check back soon.</div>";
  }
}

function renderBoard() {
  const medals = ["🥇", "🥈", "🥉"];
  boardList.innerHTML = "";

  if (!boardData.length) {
    boardList.innerHTML = "<div class='board-empty'>No scores yet — be the first!</div>";
    return;
  }

  boardData.forEach((entry, i) => {
    const isMe = myNickname && entry.nickname === myNickname;
    const row  = document.createElement("div");
    row.className = "board-row rank-" + (i + 1) + (isMe ? " me" : "");

    const rankEl = document.createElement("div");
    rankEl.className = "board-rank";
    rankEl.textContent = medals[i] || (i + 1);

    const nameEl = document.createElement("div");
    nameEl.className = "board-name";
    nameEl.textContent = entry.nickname;

    const scoreEl = document.createElement("div");
    scoreEl.className = "board-score";
    scoreEl.innerHTML = entry.cleared + " rounds<span>" + entry.perfect + " perfect</span>";

    row.append(rankEl, nameEl, scoreEl);
    boardList.append(row);
  });
}

async function submitScore(nickname, cleared, perfect) {
  submitScoreBtn.disabled = true;
  submitScoreBtn.textContent = "Submitting…";
  try {
    const res = await fetch(WORKER_URL + "/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, cleared, perfect }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    boardData = await res.json();
    myNickname = nickname;
    localStorage.setItem(LS_NICK, nickname);
    boardSubmitArea.hidden = true;
    renderBoard();
    pendingScore = null;
  } catch {
    submitScoreBtn.textContent = "Retry";
    submitScoreBtn.disabled = false;
  }
}

function showSubmitArea(cleared, perfect) {
  pendingScore = { cleared, perfect };
  nicknameInput.value = myNickname;
  boardSubmitArea.hidden = false;
}

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
  tiles = puzzleGroups.flatMap((g, gi) => g.words.map(word => ({ word, gi })));
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
  solvedGroups.innerHTML = "";
  puzzleGroups.forEach((group, i) => {
    if (!solved.has(i)) return;
    const card = document.createElement("div");
    card.className = "group-card group-" + i;
    card.innerHTML = "<strong>" + group.title + "</strong><span>" + group.words.join(", ") + "</span>";
    solvedGroups.append(card);
  });

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
  if (selected.has(i)) { selected.delete(i); }
  else if (selected.size < 4) { selected.add(i); }
  statusText.textContent = selected.size === 4 ? "Submit your link." : "Select four connected tiles.";
  render();
}

function submitSelection() {
  if (selected.size !== 4) return;

  const picked  = Array.from(selected).map(i => tiles[i]);
  const gi      = picked[0].gi;
  const isMatch = picked.every(t => t.gi === gi);

  if (isMatch) {
    solved.add(gi);
    selected.clear();
    showHint(false);

    if (solved.size === 4) {
      statusText.textContent = "All links forged!";
      render();
      recordResult(true);
      renderStats();
      showCompletionModal();
    } else {
      statusText.textContent = "Correct link forged.";
      render();
    }
  } else {
    const hintMsg = buildHint(picked);
    mistakes++;
    selected.clear();

    statusText.textContent = mistakes >= 4
      ? "No mistakes left. Reset to try again."
      : "Not a link. Try another group.";

    showHint(true, hintMsg);

    if (mistakes >= 4) {
      render();
      recordResult(false);
      renderStats();
      showFailModal();
    } else {
      render();
    }
  }
}

function buildHint(picked) {
  const counts = new Map();
  picked.forEach(t => counts.set(t.gi, (counts.get(t.gi) || 0) + 1));
  const [topGi, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const nextMistakes = mistakes + 1;

  if (topCount === 3) {
    return "Hint " + nextMistakes + "/4: Three tiles belong to \"" + puzzleGroups[topGi].title + "\" — one doesn't fit.";
  }

  const unsolved   = puzzleGroups.map((g, i) => ({ g, i })).filter(({ i }) => !solved.has(i));
  const hintGroup  = unsolved[mistakes % unsolved.length]?.g;
  return "Hint " + nextMistakes + "/4: " + (hintGroup ? hintGroup.hint : "Keep going!");
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

// ── Modals ───────────────────────────────────────────────────────────────────
function showCompletionModal() {
  const s = loadStats();
  modalIcon.textContent  = mistakes === 0 ? "⭐" : "🎉";
  modalTitle.textContent = mistakes === 0 ? "Perfect clear!" : "Puzzle complete!";
  modalSub.textContent   = "Puzzle " + (currentPuzzleIndex + 1) + " done with " + mistakes + " mistake" + (mistakes === 1 ? "" : "s") + ".";

  modalStats.innerHTML = [
    { label: "Cleared", value: s.cleared },
    { label: "Streak",  value: s.streak  },
    { label: "Best",    value: s.best    },
  ].map(x => "<div class='modal-stat-item'><strong>" + x.value + "</strong><span>" + x.label + "</span></div>").join("");

  nextModal.hidden = false;
}

function showFailModal() {
  const s = loadStats();
  modalIcon.textContent  = "💥";
  modalTitle.textContent = "Out of mistakes!";
  modalSub.textContent   = "Streak reset. Puzzle " + (currentPuzzleIndex + 1) + " not cleared.";

  modalStats.innerHTML = [
    { label: "Cleared", value: s.cleared },
    { label: "Streak",  value: s.streak  },
    { label: "Best",    value: s.best    },
  ].map(x => "<div class='modal-stat-item'><strong>" + x.value + "</strong><span>" + x.label + "</span></div>").join("");

  nextModal.hidden = false;
}

function hideModal() { nextModal.hidden = true; }

// ── Tab switching ─────────────────────────────────────────────────────────────
function switchTab(targetId) {
  tabs.forEach(t => {
    const active = t.id === "tab" + targetId;
    t.classList.toggle("active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
  panels.forEach(p => {
    p.classList.toggle("hidden", p.id !== "panel" + targetId);
  });

  if (targetId === "Stats") renderStats();
  if (targetId === "Board") fetchBoard();
}

// ── Event listeners ──────────────────────────────────────────────────────────
resetButton.addEventListener("click", resetPuzzle);
shuffleButton.addEventListener("click", shuffleActiveTiles);
clearButton.addEventListener("click", clearSelection);
submitButton.addEventListener("click", submitSelection);
resetStatsBtn.addEventListener("click", () => {
  if (confirm("Reset all your local stats?")) {
    saveStats(defaultStats());
    renderStats();
  }
});

nextPuzzleBtn.addEventListener("click", () => { hideModal(); resetPuzzle(); });
nextModal.addEventListener("click", e => { if (e.target === nextModal) { hideModal(); resetPuzzle(); } });

modalBoardBtn.addEventListener("click", () => {
  hideModal();
  switchTab("Board");
  const s = loadStats();
  if (s.cleared > 0) showSubmitArea(s.cleared, s.perfect);
});

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const id = tab.id.replace("tab", "");
    switchTab(id);
  });
});

submitScoreBtn.addEventListener("click", () => {
  const nick = nicknameInput.value.trim().slice(0, 16);
  if (!nick) { nicknameInput.focus(); return; }
  if (!pendingScore) return;
  submitScore(nick, pendingScore.cleared, pendingScore.perfect);
});

// ── Init ─────────────────────────────────────────────────────────────────────
resetPuzzle();
