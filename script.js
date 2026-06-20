const tileGrid = document.querySelector("#tileGrid");
const solvedGroups = document.querySelector("#solvedGroups");
const statusText = document.querySelector("#status");
const groupsFound = document.querySelector("#groupsFound");
const mistakesLeft = document.querySelector("#mistakesLeft");
const resetButton = document.querySelector("#resetButton");
const shuffleButton = document.querySelector("#shuffleButton");
const clearButton = document.querySelector("#clearButton");
const submitButton = document.querySelector("#submitButton");
const visitorPanel = document.querySelector(".visitor-panel");
const visitorCount = document.querySelector("#visitorCount");
const visitorNote = document.querySelector("#visitorNote");

const VISITOR_COUNTER_URL = "https://api.counterapi.dev/v1/linkforge/visits";
const VISITOR_COUNT_INTERVAL_MS = 6 * 60 * 60 * 1000;

const puzzleGroups = [
  {
    title: "Things forged",
    words: ["BLADE", "CHAIN", "KEY", "COIN"],
  },
  {
    title: "Web terms",
    words: ["LINK", "NODE", "DOMAIN", "CACHE"],
  },
  {
    title: "Puzzle actions",
    words: ["SORT", "MATCH", "GROUP", "SOLVE"],
  },
  {
    title: "Fast movement",
    words: ["DASH", "SPRINT", "BOLT", "RUSH"],
  },
];

let tiles = [];
let selected = new Set();
let solved = new Set();
let mistakes = 0;

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
    card.innerHTML = `<strong>${group.title}</strong><span>${group.words.join(", ")}</span>`;
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
    statusText.textContent = solved.size === puzzleGroups.length
      ? "Puzzle complete. All links forged."
      : "Correct link forged.";
  } else {
    mistakes += 1;
    selected.clear();
    statusText.textContent = mistakes >= 4
      ? "No mistakes left. Reset to try again."
      : "Not a link. Try another group.";
  }

  render();
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
  createTiles();
  statusText.textContent = "Select four connected tiles.";
  render();
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
  if (!visitorPanel || !visitorCount || !visitorNote) {
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
    visitorNote.textContent = shouldIncrement ? "Counted this browser session" : "Count already recorded recently";

    if (shouldIncrement) {
      window.localStorage.setItem("linkforge:lastVisitCountedAt", String(now));
    }
  } catch (error) {
    visitorPanel.dataset.state = "error";
    visitorCount.textContent = "--";
    visitorNote.textContent = "Visitor count temporarily unavailable";
  }
}

resetButton.addEventListener("click", resetPuzzle);
shuffleButton.addEventListener("click", shuffleActiveTiles);
clearButton.addEventListener("click", clearSelection);
submitButton.addEventListener("click", submitSelection);

resetPuzzle();
syncVisitorCount();
