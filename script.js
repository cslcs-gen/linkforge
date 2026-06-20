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
const visitorPanel = document.querySelector(".visitor-panel") || document.querySelector(".visit-count");
const visitorCount = document.querySelector("#visitorCount");
const visitorNote = document.querySelector("#visitorNote");

const VISITOR_COUNTER_URL = "https://api.counterapi.dev/v1/linkforge/visits";
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
  { title: "Finance words", words: ["BOND", "STOCK", "YIELD", "INDEX"], hint: "These belong to markets." },
  { title: "Airport words", words: ["GATE", "BAGGAGE", "BOARDING", "RUNWAY"], hint: "Think travel day." },
  { title: "Coffee words", words: ["LATTE", "MOCHA", "ESPRESSO", "AMERICANO"], hint: "These are cafe orders." },
  { title: "Geometry", words: ["ANGLE", "RADIUS", "VECTOR", "ARC"], hint: "These are math shape terms." },
  { title: "Messaging", words: ["THREAD", "REPLY", "PIN", "MENTION"], hint: "They belong in chat apps." },
  { title: "Security", words: ["TOKEN", "VAULT", "CIPHER", "PATCH"], hint: "They help keep systems safer." },
  { title: "Game terms", words: ["LEVEL", "SCORE", "BOSS", "QUEST"], hint: "Players know these well." },
  { title: "Building parts", words: ["DOOR", "ROOF", "WALL", "WINDOW"], hint: "They are parts of a structure." },
  { title: "Time units", words: ["HOUR", "WEEK", "MONTH", "YEAR"], hint: "They measure time." },
  { title: "Phone actions", words: ["CALL", "TEXT", "SWIPE", "TAP"], hint: "They happen on a phone." },
  { title: "Database words", words: ["TABLE", "QUERY", "INDEX", "RECORD"], hint: "These belong in databases." },
];

const puzzleBank = buildPuzzleBank(100);

let puzzleGroups = [];
let tiles = [];
let selected = new Set();
let solved = new Set();
let mistakes = 0;
let currentPuzzleIndex = -1;

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

function render() {
  tileGrid.innerHTML = "";
  solvedGroups.innerHTML = "";

  puzzleGroups.forEach((group, index) => {
    if (!solved.has(index)) {
      return;
    }

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

function toggleTile(index) {
  if (solved.has(tiles[index].groupIndex)) {
    return;
  }

  if (selected.has(index)) {
    selected.delete(index);
  } else if (selected.size < 4) {
    selected.add(index);
  }

  statusText.textContent = selected.size === 4 ? "Submit your link." : "Select four connected tiles.";
  render();
}

function submitSelection() {
  if (selected.size !== 4) {
    return;
  }

  const picked = Array.from(selected).map((index) => tiles[index]);
  const groupIndex = picked[0].groupIndex;
  const isMatch = picked.every((tile) => tile.groupIndex === groupIndex);

  if (isMatch) {
    solved.add(groupIndex);
    selected.clear();
    hintText.textContent = "";
    statusText.textContent = solved.size === puzzleGroups.length
      ? "Puzzle complete. All links forged."
      : "Correct link forged.";
  } else {
    mistakes += 1;
    hintText.textContent = createMistakeHint(picked);
    selected.clear();
    statusText.textContent = mistakes >= 4
      ? "No mistakes left. Reset to try again."
      : "Not a link. Try another group.";
  }

  render();
}

function createMistakeHint(picked) {
  const counts = new Map();
  picked.forEach((tile) => counts.set(tile.groupIndex, (counts.get(tile.groupIndex) || 0) + 1));
  const strongest = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const unsolvedGroups = puzzleGroups
    .map((group, index) => ({ group, index }))
    .filter(({ index }) => !solved.has(index));

  if (strongest && strongest[1] === 3) {
    return `Hint ${mistakes}/4: Three selected tiles are close. One does not belong with ${puzzleGroups[strongest[0]].title}.`;
  }

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
  if (puzzleBank.length < 2) {
    return 0;
  }

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
    if (!fixedTile) {
      activeIndex += 1;
    }
  }

  clearSelection();
}

async function syncVisitorCount() {
  if (!visitorPanel || !visitorCount) {
    return;
  }

  try {
    const now = Date.now();
    const lastCountedAt = Number(window.localStorage.getItem("linkforge:lastVisitCountedAt") || 0);
    const shouldIncrement = now - lastCountedAt > VISITOR_COUNT_INTERVAL_MS;
    const endpoint = shouldIncrement ? `${VISITOR_COUNTER_URL}/up` : VISITOR_COUNTER_URL;
    const response = await fetch(endpoint, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Counter returned ${response.status}`);
    }

    const data = await response.json();
    const count = Number(data.count || 0);
    visitorPanel.dataset.state = "ready";
    visitorCount.textContent = new Intl.NumberFormat().format(count);
    visitorCount.title = shouldIncrement ? "Counted this browser session" : "Count already recorded recently";
    if (visitorNote) {
      visitorNote.textContent = shouldIncrement ? "Counted this browser session" : "Count already recorded recently";
    }

    if (shouldIncrement) {
      window.localStorage.setItem("linkforge:lastVisitCountedAt", String(now));
    }
  } catch (error) {
    visitorPanel.dataset.state = "error";
    visitorCount.textContent = "--";
    visitorCount.title = "Visitor count temporarily unavailable";
    if (visitorNote) {
      visitorNote.textContent = "Visitor count temporarily unavailable";
    }
  }
}

resetButton.addEventListener("click", resetPuzzle);
shuffleButton.addEventListener("click", shuffleActiveTiles);
clearButton.addEventListener("click", clearSelection);
submitButton.addEventListener("click", submitSelection);

resetPuzzle();
syncVisitorCount();
