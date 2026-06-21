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
const statCleared   = document.querySelector("#statCleared");
const statStreak    = document.querySelector("#statStreak");
const statBest      = document.querySelector("#statBest");
const statPlayed    = document.querySelector("#statPlayed");
const statPerfect   = document.querySelector("#statPerfect");
const statAvg       = document.querySelector("#statAvg");
const resetStatsBtn = document.querySelector("#resetStatsBtn");
const boardList        = document.querySelector("#boardList");
const boardSubmitArea  = document.querySelector("#boardSubmitArea");
const nicknameInput    = document.querySelector("#nicknameInput");
const submitScoreBtn   = document.querySelector("#submitScoreBtn");
const shareButton  = document.querySelector("#shareButton");
const shareToast   = document.querySelector("#shareToast");
const tabs   = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

// ── Config ───────────────────────────────────────────────────────────────────
const WORKER_URL = "https://linkforge-scores.cslcs-gen.workers.dev";
const LS_KEY     = "linkforge:stats";
const LS_NICK    = "linkforge:nickname";

// ── Category pool (40 categories, 10 themes) ─────────────────────────────────
const categoryPool = [
  // 🎬 Entertainment
  { title: "Movie genres",       words: ["HORROR", "COMEDY", "THRILLER", "ROMANCE"],         hint: "You would find these on a cinema listing.",         reveal: "These are all movie genres: HORROR, COMEDY, THRILLER, ROMANCE." },
  { title: "Music genres",       words: ["JAZZ", "BLUES", "REGGAE", "SOUL"],                 hint: "Each one is a style of music.",                     reveal: "These are music genres: JAZZ, BLUES, REGGAE, SOUL." },
  { title: "TV show types",      words: ["SITCOM", "DRAMA", "REALITY", "DOCUMENTARY"],       hint: "These describe kinds of TV shows.",                 reveal: "TV show types: SITCOM, DRAMA, REALITY, DOCUMENTARY." },
  { title: "Musical instruments",words: ["DRUM", "FLUTE", "CELLO", "BANJO"],                 hint: "You play each one to make music.",                  reveal: "Musical instruments: DRUM, FLUTE, CELLO, BANJO." },

  // 🍕 Food & Drink
  { title: "Pasta shapes",       words: ["PENNE", "FUSILLI", "RIGATONI", "FARFALLE"],        hint: "Each one is a type of pasta.",                     reveal: "Pasta shapes: PENNE, FUSILLI, RIGATONI, FARFALLE." },
  { title: "Classic cocktails",  words: ["MOJITO", "DAIQUIRI", "MARTINI", "NEGRONI"],        hint: "You would order these at a cocktail bar.",          reveal: "Classic cocktails: MOJITO, DAIQUIRI, MARTINI, NEGRONI." },
  { title: "Desserts",           words: ["BROWNIE", "TIRAMISU", "MOUSSE", "SORBET"],         hint: "Sweet dishes served at the end of a meal.",         reveal: "Desserts: BROWNIE, TIRAMISU, MOUSSE, SORBET." },
  { title: "Spices",             words: ["CUMIN", "TURMERIC", "PAPRIKA", "CINNAMON"],        hint: "These add flavour and colour to food.",             reveal: "Spices: CUMIN, TURMERIC, PAPRIKA, CINNAMON." },

  // 🌍 Geography
  { title: "Island groups",      words: ["MALDIVES", "AZORES", "CANARIES", "FAROE"],         hint: "Each one is a group of islands.",                  reveal: "Island groups: MALDIVES, AZORES, CANARIES, FAROE." },
  { title: "African capitals",   words: ["CAIRO", "NAIROBI", "DAKAR", "ACCRA"],              hint: "These are capital cities in Africa.",               reveal: "African capitals: CAIRO, NAIROBI, DAKAR, ACCRA." },
  { title: "Mountain ranges",    words: ["ALPS", "ANDES", "ROCKIES", "URALS"],               hint: "These are famous mountain ranges.",                 reveal: "Mountain ranges: ALPS, ANDES, ROCKIES, URALS." },
  { title: "Asian countries",    words: ["LAOS", "BHUTAN", "MYANMAR", "NEPAL"],              hint: "These are countries in Asia.",                     reveal: "Asian countries: LAOS, BHUTAN, MYANMAR, NEPAL." },

  // 🐾 Nature & Animals
  { title: "Big cats",           words: ["LION", "TIGER", "JAGUAR", "CHEETAH"],              hint: "These are large wild cats.",                       reveal: "Big cats: LION, TIGER, JAGUAR, CHEETAH." },
  { title: "Dog breeds",         words: ["POODLE", "BEAGLE", "HUSKY", "CORGI"],              hint: "These are all dog breeds.",                        reveal: "Dog breeds: POODLE, BEAGLE, HUSKY, CORGI." },
  { title: "Ocean creatures",    words: ["SQUID", "LOBSTER", "SEAHORSE", "MANTA"],           hint: "You would find these under the sea.",               reveal: "Ocean creatures: SQUID, LOBSTER, SEAHORSE, MANTA." },
  { title: "Trees",              words: ["OAK", "MAPLE", "BIRCH", "CEDAR"],                  hint: "These are all types of tree.",                     reveal: "Trees: OAK, MAPLE, BIRCH, CEDAR." },

  // 🏅 Sports & Games
  { title: "Olympic sports",     words: ["FENCING", "ARCHERY", "JUDO", "BOBSLED"],           hint: "These are all Olympic sports.",                    reveal: "Olympic sports: FENCING, ARCHERY, JUDO, BOBSLED." },
  { title: "___ ball",           words: ["BASKET", "FOOT", "VOLLEY", "CANNON"],              hint: "Add the word BALL after each one.",                reveal: "All precede BALL: BASKET, FOOT, VOLLEY, CANNON." },
  { title: "Card games",         words: ["POKER", "SNAP", "BRIDGE", "RUMMY"],                hint: "These are played with a deck of cards.",            reveal: "Card games: POKER, SNAP, BRIDGE, RUMMY." },
  { title: "Combat sports",      words: ["BOXING", "WRESTLING", "KARATE", "SUMO"],           hint: "These are one-on-one fighting sports.",             reveal: "Combat sports: BOXING, WRESTLING, KARATE, SUMO." },

  // 🧠 Logic & Wordplay
  { title: "___ light",          words: ["SUN", "MOON", "SPOT", "FLASH"],                    hint: "Each word can go before LIGHT.",                   reveal: "All precede LIGHT: SUNLIGHT, MOONLIGHT, SPOTLIGHT, FLASHLIGHT." },
  { title: "___ house",          words: ["TREE", "STORE", "FARM", "POWER"],                  hint: "Each word can go before HOUSE.",                   reveal: "All precede HOUSE: TREEHOUSE, STOREHOUSE, FARMHOUSE, POWERHOUSE." },
  { title: "Shades of blue",     words: ["NAVY", "COBALT", "TEAL", "INDIGO"],                hint: "These are all shades of blue.",                    reveal: "Shades of blue: NAVY, COBALT, TEAL, INDIGO." },
  { title: "Shades of red",      words: ["CRIMSON", "SCARLET", "MAROON", "CORAL"],           hint: "These are all shades of red.",                     reveal: "Shades of red: CRIMSON, SCARLET, MAROON, CORAL." },

  // 😂 Pop Culture
  { title: "Internet slang",     words: ["FIRE", "VIBE", "MOOD", "SLAY"],                    hint: "Words people use online to express feelings.",     reveal: "Internet slang: FIRE, VIBE, MOOD, SLAY." },
  { title: "Social media actions",words: ["POST", "SHARE", "REACT", "FOLLOW"],               hint: "Things you do on social media.",                   reveal: "Social media actions: POST, SHARE, REACT, FOLLOW." },
  { title: "Words meaning party", words: ["BASH", "RAVE", "GALA", "FIESTA"],                 hint: "These all mean a celebration.",                    reveal: "All mean party/celebration: BASH, RAVE, GALA, FIESTA." },
  { title: "Viral video types",  words: ["PRANK", "CHALLENGE", "UNBOXING", "REVIEW"],        hint: "Popular types of online videos.",                  reveal: "Viral video types: PRANK, CHALLENGE, UNBOXING, REVIEW." },

  // 🎭 Arts & Creativity
  { title: "Dance styles",       words: ["TANGO", "WALTZ", "SALSA", "BALLET"],               hint: "These are all styles of dance.",                   reveal: "Dance styles: TANGO, WALTZ, SALSA, BALLET." },
  { title: "Art movements",      words: ["CUBISM", "BAROQUE", "DADA", "SURREALISM"],         hint: "These are famous art movements.",                  reveal: "Art movements: CUBISM, BAROQUE, DADA, SURREALISM." },
  { title: "Artist paint colours",words: ["OCHRE", "SIENNA", "UMBER", "VERMILION"],          hint: "Classic colours used by painters.",                 reveal: "Artist paint colours: OCHRE, SIENNA, UMBER, VERMILION." },
  { title: "Photography terms",  words: ["EXPOSURE", "APERTURE", "SHUTTER", "BOKEH"],        hint: "Photographers use these words all the time.",      reveal: "Photography terms: EXPOSURE, APERTURE, SHUTTER, BOKEH." },

  // 🏠 Everyday Life
  { title: "Things in a bedroom",words: ["PILLOW", "DUVET", "WARDROBE", "NIGHTSTAND"],       hint: "You would find all of these in a bedroom.",        reveal: "Bedroom items: PILLOW, DUVET, WARDROBE, NIGHTSTAND." },
  { title: "Morning routine",    words: ["STRETCH", "SHOWER", "BREW", "COMMUTE"],            hint: "Things many people do every morning.",              reveal: "Morning routine: STRETCH, SHOWER, BREW, COMMUTE." },
  { title: "At the airport",     words: ["GATE", "BOARDING", "BAGGAGE", "CUSTOMS"],          hint: "You encounter these at an airport.",                reveal: "Airport words: GATE, BOARDING, BAGGAGE, CUSTOMS." },
  { title: "Things you carry",   words: ["WALLET", "KEYS", "BADGE", "EARBUDS"],              hint: "Everyday items most people carry.",                 reveal: "Things you carry: WALLET, KEYS, BADGE, EARBUDS." },

  // 🔢 Numbers & Patterns
  { title: "Things in a pair",   words: ["GLOVES", "TWINS", "SOCKS", "CUFFLINKS"],           hint: "These always come in twos.",                       reveal: "Always in pairs: GLOVES, TWINS, SOCKS, CUFFLINKS." },
  { title: "Things in a dozen",  words: ["EGGS", "ROSES", "DOUGHNUTS", "MONTHS"],            hint: "These are commonly counted in twelves.",            reveal: "Counted in dozens: EGGS, ROSES, DOUGHNUTS, MONTHS." },
  { title: "Four seasons",       words: ["SPRING", "SUMMER", "AUTUMN", "WINTER"],            hint: "These are the four seasons of the year.",           reveal: "The four seasons: SPRING, SUMMER, AUTUMN, WINTER." },
  { title: "Compass points",     words: ["NORTH", "SOUTH", "EAST", "WEST"],                  hint: "These are directions on a compass.",                reveal: "Compass directions: NORTH, SOUTH, EAST, WEST." },
];

const puzzleBank = buildPuzzleBank(100);

// ── Game state ───────────────────────────────────────────────────────────────
let puzzleGroups       = [];
let tiles              = [];
let selected           = new Set();
let solved             = new Set();
let mistakes           = 0;
let currentPuzzleIndex = -1;
// Track which category each hint position has already referenced this round
let hintHistory        = [];

// ── Local stats ──────────────────────────────────────────────────────────────
function loadStats() {
  try {
    // Try current key
    var data = localStorage.getItem(LS_KEY);
    if (data) return JSON.parse(data);
    // Try legacy key variants from older versions
    var legacy = localStorage.getItem("lf_stats") || localStorage.getItem("linkforge_stats");
    if (legacy) {
      var parsed = JSON.parse(legacy);
      localStorage.setItem(LS_KEY, JSON.stringify(parsed)); // migrate
      return parsed;
    }
    return defaultStats();
  } catch { return defaultStats(); }
}
function defaultStats() {
  return { cleared: 0, streak: 0, best: 0, played: 0, perfect: 0, totalMistakes: 0 };
}
function saveStats(s) {
  var json = JSON.stringify(s);
  localStorage.setItem(LS_KEY, json);
  // Backup under a secondary key so accidental resets can be recovered
  localStorage.setItem(LS_KEY + ":backup", json);
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
let boardData    = [];
let pendingScore = null;
let myNickname   = localStorage.getItem(LS_NICK) || "";

async function fetchBoard() {
  boardList.innerHTML = "<div class='board-loading'>Loading leaderboard&#8230;</div>";
  try {
    const res = await fetch(WORKER_URL + "/scores", { mode: "cors", cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    boardData = await res.json();
    // If board is truly empty (fresh deploy), show seeded placeholder data
    if (boardData.length === 0) {
      boardData = [
        { nickname: "PuzzleKing88", cleared: 23, perfect: 4 },
        { nickname: "LinkMaster",   cleared: 17, perfect: 2 },
        { nickname: "SingaporeAce", cleared: 11, perfect: 1 },
      ];
    }
    renderBoard();
  } catch {
    boardList.innerHTML = "<div class='board-error'>Could not load leaderboard. Check back soon.</div>";
  }
  // Always show submit area when opening Top 10 tab if player has a score
  const s = loadStats();
  if (s.cleared > 0) {
    showSubmitArea(s.cleared, s.perfect);
  } else {
    boardSubmitArea.hidden = true;
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
    row.innerHTML =
      "<div class='board-rank'>" + (medals[i] || (i + 1)) + "</div>" +
      "<div class='board-name'>" + entry.nickname + "</div>" +
      "<div class='board-score'>" + entry.cleared + " rounds<span>" + entry.perfect + " perfect</span></div>";
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
    boardData  = await res.json();
    myNickname = nickname;
    localStorage.setItem(LS_NICK, nickname);
    boardSubmitArea.hidden = true;
    submitScoreBtn.disabled = false;
    submitScoreBtn.textContent = "Submit";
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
  // Change label if they already have a nickname (returning player)
  const label = boardSubmitArea.querySelector(".board-submit-label");
  if (label) {
    label.textContent = myNickname
      ? "Update your score on the leaderboard!"
      : "You have a score worth submitting!";
  }
  boardSubmitArea.hidden = false;
}

// ── Puzzle bank ──────────────────────────────────────────────────────────────
function buildPuzzleBank(count) {
  const bank = [];
  for (let i = 0; i < count; i++) {
    const shuffled = seededShuffle(categoryPool, i + 73);
    bank.push(shuffled.slice(0, 4).map(g => ({
      title: g.title, words: [...g.words], hint: g.hint, reveal: g.reveal
    })));
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

// ── Hint logic (escalating) ──────────────────────────────────────────────────
//
// Escalation per category (tracked via hintHistory):
//   1st time hinting a category → subtle nudge (general hint text)
//   2nd time same category      → medium: name the category
//   3rd time same category      → obvious: reveal category + all 4 words
//
// If the wrong guess has 3 tiles from one group (one-away), always flag that first.

function buildHint(picked) {
  const nextMistakeNum = mistakes + 1;

  // ── One-away detection ───────────────────────────────────────────────────
  const counts = new Map();
  picked.forEach(t => counts.set(t.gi, (counts.get(t.gi) || 0) + 1));
  const [topGi, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];

  if (topCount === 3) {
    // Track this category in hint history
    recordHintFor(topGi);
    const timesHinted = hintHistory.filter(h => h === topGi).length;
    return buildEscalatedHint(nextMistakeNum, topGi, timesHinted, true);
  }

  // ── General wrong guess: pick an unsolved group to hint ─────────────────
  // Prefer a group the player has NOT been hinted about yet
  const unsolved = puzzleGroups
    .map((g, i) => ({ g, i }))
    .filter(({ i }) => !solved.has(i));

  const unhinted = unsolved.filter(({ i }) => !hintHistory.includes(i));
  const target   = unhinted.length > 0
    ? unhinted[mistakes % unhinted.length]
    : unsolved[mistakes % unsolved.length];

  const targetGi = target.i;
  recordHintFor(targetGi);
  const timesHinted = hintHistory.filter(h => h === targetGi).length;
  return buildEscalatedHint(nextMistakeNum, targetGi, timesHinted, false);
}

function recordHintFor(gi) {
  hintHistory.push(gi);
}

function buildEscalatedHint(mistakeNum, gi, timesHinted, isOneAway) {
  const group  = puzzleGroups[gi];
  const prefix = "Hint " + mistakeNum + "/4: ";
  const oneAwaySuffix = isOneAway ? "You are one away! " : "";

  if (timesHinted <= 1) {
    // Level 1 — subtle nudge
    return prefix + oneAwaySuffix + group.hint;
  } else if (timesHinted === 2) {
    // Level 2 — name the category
    return prefix + oneAwaySuffix + "The category is \"" + group.title + "\". " + group.hint;
  } else {
    // Level 3 — full reveal
    return prefix + oneAwaySuffix + group.reveal;
  }
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

// ── Puzzle control ───────────────────────────────────────────────────────────
function clearSelection() {
  selected.clear();
  statusText.textContent = "Select four connected tiles.";
  render();
}

function resetPuzzle() {
  selected.clear();
  solved.clear();
  mistakes    = 0;
  hintHistory = [];
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
  renderModalStats(s);
  nextModal.hidden = false;
}

function showFailModal() {
  const s = loadStats();
  modalIcon.textContent  = "💥";
  modalTitle.textContent = "Out of mistakes!";
  modalSub.textContent   = "Streak reset. Puzzle " + (currentPuzzleIndex + 1) + " not cleared.";
  renderModalStats(s);
  nextModal.hidden = false;
}

function renderModalStats(s) {
  modalStats.innerHTML = [
    { label: "Cleared", value: s.cleared },
    { label: "Streak",  value: s.streak  },
    { label: "Best",    value: s.best    },
  ].map(x =>
    "<div class='modal-stat-item'><strong>" + x.value + "</strong><span>" + x.label + "</span></div>"
  ).join("");
}

function hideModal() { nextModal.hidden = true; }

// ── Tab switching ─────────────────────────────────────────────────────────────
function switchTab(targetId) {
  tabs.forEach(function(t) {
    var isActive = t.id === "tab" + targetId;
    t.className = isActive ? "tab active" : "tab";
  });
  panels.forEach(function(p) {
    var show = p.id === "panel" + targetId;
    if (show) {
      p.classList.remove("panel-hidden");
      p.style.display = "flex";
    } else {
      p.classList.add("panel-hidden");
      p.style.display = "none";
    }
  });
  if (targetId === "Stats") renderStats();
  if (targetId === "Board") fetchBoard();
}


// ── Share ────────────────────────────────────────────────────────────────────
function shareGame() {
  const url  = "https://linkforge.buildjoynow.com";
  const text = "Can you forge all 4 links? Play LinkForge — a daily word puzzle!";

  // navigator.share needs a user gesture and HTTPS — works on Android/iOS Chrome/Safari
  if (navigator.share && location.protocol === "https:") {
    navigator.share({ title: "LinkForge", text, url })
      .then(() => {})
      .catch(err => {
        // User cancelled or share failed — fallback to clipboard
        if (err.name !== "AbortError") copyToClipboard(url);
      });
  } else {
    copyToClipboard(url);
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showToast).catch(fallbackCopy);
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const el = document.createElement("textarea");
  el.value = typeof text === "string" ? text : "https://linkforge.buildjoynow.com";
  el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
  document.body.appendChild(el);
  el.focus(); el.select();
  try { document.execCommand("copy"); showToast(); } catch {}
  document.body.removeChild(el);
}

function showToast() {
  shareToast.hidden = false;
  shareToast.classList.add("visible");
  setTimeout(() => {
    shareToast.classList.remove("visible");
    setTimeout(() => { shareToast.hidden = true; }, 220);
  }, 2200);
}

// ── Event listeners ──────────────────────────────────────────────────────────
shareButton.addEventListener("click", shareGame);
shareButton.addEventListener("touchend", function(e) { e.preventDefault(); shareGame(); });
resetButton.addEventListener("click", resetPuzzle);
shuffleButton.addEventListener("click", shuffleActiveTiles);
clearButton.addEventListener("click", clearSelection);
submitButton.addEventListener("click", submitSelection);

resetStatsBtn.addEventListener("click", function() {
  var backup = localStorage.getItem(LS_KEY + ":backup");
  var msg = backup
    ? "Reset stats? Your data is backed up and can be restored.\nOK = Reset | Cancel = Keep"
    : "Reset all your local stats? This cannot be undone.";
  if (confirm(msg)) { saveStats(defaultStats()); renderStats(); }
});

nextPuzzleBtn.addEventListener("click", () => { hideModal(); resetPuzzle(); });
nextModal.addEventListener("click", e => { if (e.target === nextModal) { hideModal(); resetPuzzle(); } });

modalBoardBtn.addEventListener("click", () => {
  hideModal();
  switchTab("Board");
  // fetchBoard() inside switchTab will handle showing submit area
});

tabs.forEach(function(tab) {
  tab.addEventListener("click", function() {
    switchTab(this.id.replace("tab", ""));
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
