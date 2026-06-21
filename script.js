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
const modalShare    = document.querySelector("#modalShare");
const statCleared   = document.querySelector("#statCleared");
const statStreak    = document.querySelector("#statStreak");
const statBest      = document.querySelector("#statBest");
const statPlayed    = document.querySelector("#statPlayed");
const statPerfect   = document.querySelector("#statPerfect");
const statAvg       = document.querySelector("#statAvg");
const streakBadge   = document.querySelector("#streakBadge");
const resetStatsBtn = document.querySelector("#resetStatsBtn");
const boardList        = document.querySelector("#boardList");
const boardSubmitArea  = document.querySelector("#boardSubmitArea");
const nicknameInput    = document.querySelector("#nicknameInput");
const submitScoreBtn   = document.querySelector("#submitScoreBtn");
const diffButtons      = document.querySelectorAll(".diff-btn");
const tabs             = document.querySelectorAll(".tab");
const panels           = document.querySelectorAll(".panel");
const shareButton      = document.querySelector("#shareButton");
const shareToast       = document.querySelector("#shareToast");

// ── Config ───────────────────────────────────────────────────────────────────
const WORKER_URL = "https://linkforge-scores.cslcs-gen.workers.dev";
const LS_KEY     = "linkforge:stats";
const LS_NICK    = "linkforge:nickname";
const LS_DIFF    = "linkforge:difficulty";

// ── Category pool (90 categories, 360 unique words) ──────────────────────────
const categoryPool = [
  {d:1,title:"Primary colours",words:["RED", "BLUE", "YELLOW", "GREEN"],hint:"The most basic colours you learn as a child.",reveal:""},
  {d:1,title:"Fruits",words:["MANGO", "APPLE", "GRAPE", "PEACH"],hint:"All things you can eat fresh from a tree or vine.",reveal:""},
  {d:1,title:"Breakfast foods",words:["TOAST", "CEREAL", "BACON", "WAFFLE"],hint:"Things people commonly eat in the morning.",reveal:""},
  {d:1,title:"Things you wear",words:["BELT", "SCARF", "GLOVES", "BOOTS"],hint:"Items of clothing or accessories.",reveal:""},
  {d:1,title:"Baby animals",words:["KITTEN", "PUPPY", "FOAL", "CALF"],hint:"Young versions of common animals.",reveal:""},
  {d:1,title:"School subjects",words:["MATHS", "HISTORY", "SCIENCE", "ART"],hint:"Subjects taught in school.",reveal:""},
  {d:1,title:"Things at a beach",words:["SAND", "SHELL", "WAVE", "TOWEL"],hint:"Things you find or bring to the beach.",reveal:""},
  {d:1,title:"Vehicles",words:["BUS", "TRAIN", "FERRY", "TRAM"],hint:"Ways to get from A to B.",reveal:""},
  {d:1,title:"Things that fly",words:["KITE", "BALLOON", "DRONE", "ROCKET"],hint:"Objects that travel through the air.",reveal:""},
  {d:1,title:"Sports equipment",words:["BAT", "NET", "HELMET", "RACKET"],hint:"Gear used in various sports.",reveal:""},
  {d:1,title:"Words meaning happy",words:["GLAD", "JOYFUL", "ELATED", "CHEERFUL"],hint:"All describe a positive mood.",reveal:""},
  {d:1,title:"Words meaning big",words:["HUGE", "VAST", "GIANT", "MASSIVE"],hint:"All mean large in size.",reveal:""},
  {d:1,title:"Things that are round",words:["COIN", "WHEEL", "GLOBE", "RING"],hint:"Objects with a circular or spherical shape.",reveal:""},
  {d:1,title:"Things in a kitchen",words:["OVEN", "SINK", "KETTLE", "FRIDGE"],hint:"Appliances or fixtures found in a kitchen.",reveal:""},
  {d:1,title:"Parts of a face",words:["CHIN", "CHEEK", "BROW", "JAW"],hint:"Features on a human face.",reveal:""},
  {d:1,title:"Wild animals",words:["LION", "TIGER", "BEAR", "WOLF"],hint:"Large predators found in the wild.",reveal:""},
  {d:1,title:"Colours of a rainbow",words:["VIOLET", "INDIGO", "ORANGE", "WHITE"],hint:"Colours seen in or associated with a rainbow.",reveal:""},
  {d:1,title:"Things that float",words:["RAFT", "CORK", "BUOY", "LEAF"],hint:"Objects that stay on the surface of water.",reveal:""},
  {d:1,title:"Parts of a body",words:["ELBOW", "ANKLE", "WRIST", "KNEE"],hint:"Joints or parts of the human body.",reveal:""},
  {d:1,title:"Holidays",words:["CHRISTMAS", "EASTER", "DIWALI", "EID"],hint:"Annual celebrations from around the world.",reveal:""},
  {d:1,title:"Things in a bedroom",words:["PILLOW", "DUVET", "WARDROBE", "NIGHTSTAND"],hint:"Furniture or items found in a bedroom.",reveal:""},
  {d:1,title:"Words meaning cold",words:["FREEZING", "CHILLY", "FROSTY", "ICY"],hint:"All describe low temperatures.",reveal:""},
  {d:1,title:"Things in a park",words:["BENCH", "FOUNTAIN", "POND", "SWING"],hint:"Features you find in a public park.",reveal:""},
  {d:1,title:"Vegetables",words:["CARROT", "ONION", "BROCCOLI", "SPINACH"],hint:"Common vegetables found in a grocery store.",reveal:""},
  {d:1,title:"Musical genres",words:["JAZZ", "POP", "ROCK", "BLUES"],hint:"Broad styles of music.",reveal:""},
  {d:1,title:"Things you carry",words:["WALLET", "KEYS", "BADGE", "EARBUDS"],hint:"Everyday items most people carry.",reveal:""},
  {d:1,title:"Morning routine",words:["STRETCH", "SHOWER", "BREW", "COMMUTE"],hint:"Things many people do every morning.",reveal:""},
  {d:1,title:"Things that are hot",words:["LAVA", "SAUNA", "CHILLI", "FORGE"],hint:"Things associated with extreme heat.",reveal:""},
  {d:1,title:"Words meaning tired",words:["WEARY", "DROWSY", "DRAINED", "SPENT"],hint:"All describe feeling low on energy.",reveal:""},
  {d:1,title:"Social media actions",words:["POST", "SHARE", "REACT", "FOLLOW"],hint:"Things you do on social media platforms.",reveal:""},
  {d:2,title:"Dog breeds",words:["POODLE", "BEAGLE", "HUSKY", "CORGI"],hint:"These are all breeds of dog.",reveal:""},
  {d:2,title:"Dance styles",words:["TANGO", "WALTZ", "SALSA", "BALLET"],hint:"These are all styles of dance.",reveal:""},
  {d:2,title:"Card games",words:["POKER", "SNAP", "BRIDGE", "RUMMY"],hint:"Games played with a standard deck of cards.",reveal:""},
  {d:2,title:"Olympic sports",words:["FENCING", "ARCHERY", "JUDO", "BOBSLED"],hint:"Sports that feature in the Olympic Games.",reveal:""},
  {d:2,title:"African capitals",words:["CAIRO", "NAIROBI", "DAKAR", "ACCRA"],hint:"Capital cities located in Africa.",reveal:""},
  {d:2,title:"Island groups",words:["MALDIVES", "AZORES", "CANARIES", "FAROE"],hint:"Each one is a group of islands.",reveal:""},
  {d:2,title:"Mountain ranges",words:["ALPS", "ANDES", "ROCKIES", "URALS"],hint:"Famous mountain ranges around the world.",reveal:""},
  {d:2,title:"Asian countries",words:["LAOS", "BHUTAN", "MYANMAR", "NEPAL"],hint:"Countries located in Asia.",reveal:""},
  {d:2,title:"Pasta shapes",words:["PENNE", "FUSILLI", "RIGATONI", "FARFALLE"],hint:"Types of Italian pasta.",reveal:""},
  {d:2,title:"Classic cocktails",words:["MOJITO", "DAIQUIRI", "MARTINI", "NEGRONI"],hint:"Famous cocktails you would order at a bar.",reveal:""},
  {d:2,title:"Desserts",words:["BROWNIE", "TIRAMISU", "MOUSSE", "SORBET"],hint:"Sweet dishes served at the end of a meal.",reveal:""},
  {d:2,title:"Spices",words:["CUMIN", "TURMERIC", "PAPRIKA", "CINNAMON"],hint:"These add flavour and aroma to food.",reveal:""},
  {d:2,title:"Combat sports",words:["BOXING", "WRESTLING", "KARATE", "SUMO"],hint:"One-on-one fighting sports.",reveal:""},
  {d:2,title:"Things in a dozen",words:["EGGS", "ROSES", "DOUGHNUTS", "MONTHS"],hint:"Commonly counted or sold in twelves.",reveal:""},
  {d:2,title:"Four seasons",words:["SPRING", "SUMMER", "AUTUMN", "WINTER"],hint:"The four seasons of the year.",reveal:""},
  {d:2,title:"Compass points",words:["NORTH", "SOUTH", "EAST", "WEST"],hint:"Directions found on a compass.",reveal:""},
  {d:2,title:"Words meaning party",words:["BASH", "RAVE", "GALA", "FIESTA"],hint:"All mean a celebration or party.",reveal:""},
  {d:2,title:"Viral video types",words:["PRANK", "CHALLENGE", "UNBOXING", "REVIEW"],hint:"Popular categories of online video content.",reveal:""},
  {d:2,title:"Shades of blue",words:["NAVY", "COBALT", "TEAL", "AZURE"],hint:"These are all shades of the colour blue.",reveal:""},
  {d:2,title:"Shades of red",words:["CRIMSON", "SCARLET", "MAROON", "CORAL"],hint:"These are all shades of the colour red.",reveal:""},
  {d:2,title:"___ ball",words:["BASKET", "FOOT", "VOLLEY", "CANNON"],hint:"Add the word BALL after each one.",reveal:""},
  {d:2,title:"___ house",words:["TREE", "STORE", "FARM", "POWER"],hint:"Add the word HOUSE after each one.",reveal:""},
  {d:2,title:"___ light",words:["SUN", "MOON", "SPOT", "FLASH"],hint:"Add the word LIGHT after each one.",reveal:""},
  {d:2,title:"Internet slang",words:["FIRE", "VIBE", "MOOD", "SLAY"],hint:"Words people use online to express feelings.",reveal:""},
  {d:2,title:"Coffee orders",words:["LATTE", "MOCHA", "ESPRESSO", "AMERICANO"],hint:"Drinks you would order at a coffee shop.",reveal:""},
  {d:2,title:"At the airport",words:["GATE", "BOARDING", "BAGGAGE", "CUSTOMS"],hint:"Words you encounter at an airport.",reveal:""},
  {d:2,title:"Things in a pair",words:["TWINS", "SOCKS", "CUFFLINKS", "MITTENS"],hint:"Things that always come in twos.",reveal:""},
  {d:2,title:"Board games",words:["CHESS", "RISK", "CLUE", "SCRABBLE"],hint:"Classic games played on a board.",reveal:""},
  {d:2,title:"Ocean creatures",words:["SQUID", "LOBSTER", "SEAHORSE", "MANTA"],hint:"Creatures found beneath the sea.",reveal:""},
  {d:2,title:"Trees",words:["OAK", "MAPLE", "BIRCH", "CEDAR"],hint:"Types of tree found in forests.",reveal:""},
  {d:2,title:"Card suits",words:["HEART", "CLUB", "SPADE", "DIAMOND"],hint:"The four suits in a standard deck.",reveal:""},
  {d:2,title:"Big cats",words:["JAGUAR", "CHEETAH", "PUMA", "LEOPARD"],hint:"Large wild cats from around the world.",reveal:""},
  {d:2,title:"Musical instruments",words:["DRUM", "FLUTE", "CELLO", "BANJO"],hint:"Instruments you play to make music.",reveal:""},
  {d:2,title:"Movie genres",words:["HORROR", "COMEDY", "THRILLER", "ROMANCE"],hint:"Categories you would see on a cinema listing.",reveal:""},
  {d:2,title:"Photography terms",words:["EXPOSURE", "APERTURE", "SHUTTER", "BOKEH"],hint:"Terms used in photography.",reveal:""},
  {d:3,title:"Art movements",words:["CUBISM", "BAROQUE", "DADA", "SURREALISM"],hint:"Famous movements in the history of art.",reveal:""},
  {d:3,title:"Artist paint colours",words:["OCHRE", "SIENNA", "UMBER", "VERMILION"],hint:"Classic pigment colours used by painters.",reveal:""},
  {d:3,title:"Cloud types",words:["CIRRUS", "STRATUS", "CUMULUS", "NIMBUS"],hint:"Scientific names for types of cloud.",reveal:""},
  {d:3,title:"Music notation",words:["REST", "CLEF", "SHARP", "FLAT"],hint:"Symbols found on a sheet of music.",reveal:""},
  {d:3,title:"Geometry terms",words:["RADIUS", "VECTOR", "ARC", "TANGENT"],hint:"Terms used in geometry and mathematics.",reveal:""},
  {d:3,title:"Mythology creatures",words:["CENTAUR", "SPHINX", "MINOTAUR", "HARPY"],hint:"Creatures from ancient mythology.",reveal:""},
  {d:3,title:"Chess pieces",words:["ROOK", "BISHOP", "KNIGHT", "PAWN"],hint:"Pieces used in the game of chess.",reveal:""},
  {d:3,title:"Architectural styles",words:["GOTHIC", "NEOCLASSICAL", "BRUTALIST", "TUDOR"],hint:"Styles of architecture from different eras.",reveal:""},
  {d:3,title:"Wine regions",words:["BORDEAUX", "TUSCANY", "RIOJA", "BAROSSA"],hint:"Famous wine-producing regions of the world.",reveal:""},
  {d:3,title:"Ocean zones",words:["ABYSSAL", "PELAGIC", "BENTHIC", "PHOTIC"],hint:"Scientific zones found in the deep ocean.",reveal:""},
  {d:3,title:"Astronomy terms",words:["NEBULA", "PULSAR", "QUASAR", "ZENITH"],hint:"Terms used in astronomy and space science.",reveal:""},
  {d:3,title:"Ancient civilisations",words:["SUMERIAN", "PHOENICIAN", "NUBIAN", "MINOAN"],hint:"Ancient civilisations from around the world.",reveal:""},
  {d:3,title:"Opera terms",words:["ARIA", "LIBRETTO", "TENOR", "SOPRANO"],hint:"Terms associated with opera.",reveal:""},
  {d:3,title:"___ stone",words:["LIME", "COBBLE", "GRAVE", "CORNER"],hint:"Add the word STONE after each one.",reveal:""},
  {d:3,title:"___ fire",words:["CAMP", "CROSS", "GUN", "RAPID"],hint:"Add the word FIRE after each one.",reveal:""},
  {d:3,title:"Fencing terms",words:["PARRY", "RIPOSTE", "LUNGE", "TOUCHE"],hint:"Terms used in the sport of fencing.",reveal:""},
  {d:3,title:"Rhetorical devices",words:["SIMILE", "IRONY", "HYPERBOLE", "ALLUSION"],hint:"Devices used in writing and speech.",reveal:""},
  {d:3,title:"Economic terms",words:["TARIFF", "DEFICIT", "SUBSIDY", "EMBARGO"],hint:"Terms used in economics and trade.",reveal:""},
  {d:3,title:"Philosophical terms",words:["AXIOM", "EMPIRICAL", "DIALECTIC", "DOGMA"],hint:"Concepts from philosophy.",reveal:""},
  {d:3,title:"Cocktail ingredients",words:["BITTERS", "VERMOUTH", "GRENADINE", "SYRUP"],hint:"Ingredients commonly used in cocktails.",reveal:""},
  {d:3,title:"Types of map",words:["TOPOGRAPHIC", "CHOROPLETH", "CONTOUR", "CADASTRAL"],hint:"Different types of map used in geography.",reveal:""},
  {d:3,title:"Film techniques",words:["DOLLY", "MONTAGE", "DISSOLVE", "TRACKING"],hint:"Techniques used in filmmaking.",reveal:""},
  {d:3,title:"Logical fallacies",words:["STRAWMAN", "SLIPPERY", "ADHOMINEM", "CIRCULAR"],hint:"Types of logical fallacy in argumentation.",reveal:""},
  {d:3,title:"Geological eras",words:["JURASSIC", "TRIASSIC", "PERMIAN", "DEVONIAN"],hint:"Periods of geological time.",reveal:""},
  {d:3,title:"Jazz subgenres",words:["BEBOP", "FUSION", "DIXIE", "MODAL"],hint:"Styles within the genre of jazz.",reveal:""},
];

// ── Puzzle bank builder ──────────────────────────────────────────────────────
// difficulty: 1=Easy (4 Easy groups), 2=Medium (2E+2M), 3=Hard (1E+1M+2H)
function buildDailyPuzzle(dateStr, difficulty) {
  const seed = hashStr(dateStr + difficulty);
  const easy   = seededShuffle(categoryPool.filter(c=>c.d===1), seed);
  const medium = seededShuffle(categoryPool.filter(c=>c.d===2), seed+1);
  const hard   = seededShuffle(categoryPool.filter(c=>c.d===3), seed+2);
  var groups;
  if (difficulty === 1) groups = easy.slice(0,4);
  else if (difficulty === 3) groups = [easy[0], medium[0], hard[0], hard[1]];
  else groups = [easy[0], easy[1], medium[0], medium[1]]; // default medium
  return groups.map(g => ({ title:g.title, words:[...g.words], hint:g.hint, reveal:g.reveal||g.hint, d:g.d }));
}

function buildFreePuzzle(index, difficulty) {
  const seed = index + 73 + difficulty * 1000;
  const easy   = seededShuffle(categoryPool.filter(c=>c.d===1), seed);
  const medium = seededShuffle(categoryPool.filter(c=>c.d===2), seed+1);
  const hard   = seededShuffle(categoryPool.filter(c=>c.d===3), seed+2);
  var groups;
  if (difficulty === 1) groups = easy.slice(0,4);
  else if (difficulty === 3) groups = [easy[0], medium[0], hard[0], hard[1]];
  else groups = [easy[0], easy[1], medium[0], medium[1]];
  return groups.map(g => ({ title:g.title, words:[...g.words], hint:g.hint, reveal:g.reveal||g.hint, d:g.d }));
}

function hashStr(str) {
  var hash = 5381;
  for (var i=0; i<str.length; i++) hash = ((hash<<5)+hash)^str.charCodeAt(i);
  return Math.abs(hash);
}

function seededShuffle(items, seed) {
  const copy = [...items];
  var v = seed;
  for (var i=copy.length-1; i>0; i--) {
    v = (v*9301+49297)%233280;
    var j = v%(i+1);
    var tmp = copy[i]; copy[i]=copy[j]; copy[j]=tmp;
  }
  return copy;
}

function getTodayStr() {
  const d = new Date();
  return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
}

// ── Game state ───────────────────────────────────────────────────────────────
var puzzleGroups       = [];
var tiles              = [];
var selected           = new Set();
var solved             = new Set();
var mistakes           = 0;
var currentPuzzleIndex = -1;
var isDaily            = false;
var difficulty         = parseInt(localStorage.getItem(LS_DIFF)||"2");
var hintHistory        = [];
var moveHistory        = [];  // for emoji share card: "C"=correct, "W"=wrong

// ── Local stats ──────────────────────────────────────────────────────────────
function loadStats() {
  try {
    var data = localStorage.getItem(LS_KEY);
    if (data) return JSON.parse(data);
    var legacy = localStorage.getItem("lf_stats")||localStorage.getItem("linkforge_stats");
    if (legacy) { var p=JSON.parse(legacy); localStorage.setItem(LS_KEY,JSON.stringify(p)); return p; }
    return defaultStats();
  } catch(e) { return defaultStats(); }
}
function defaultStats() {
  return { cleared:0, streak:0, best:0, played:0, perfect:0, totalMistakes:0,
           lastDate:"", milestones:[] };
}
function saveStats(s) {
  var json = JSON.stringify(s);
  localStorage.setItem(LS_KEY, json);
  localStorage.setItem(LS_KEY+":backup", json);
}
function recordResult(cleared) {
  var s = loadStats();
  s.played++;
  s.totalMistakes += mistakes;
  if (cleared) {
    s.cleared++;
    s.streak++;
    if (s.streak > s.best) s.best = s.streak;
    if (mistakes===0) s.perfect++;
    checkMilestone(s);
  } else {
    s.streak = 0;
  }
  saveStats(s);
}

// Milestone thresholds
var MILESTONES = [
  {n:1,  label:"First Clear",  icon:"🌱"},
  {n:7,  label:"Week Streak",  icon:"🔥"},
  {n:14, label:"Fortnight",    icon:"💪"},
  {n:30, label:"Month Streak", icon:"⭐"},
  {n:50, label:"50 Cleared",   icon:"🏅"},
  {n:100,label:"Century",      icon:"👑"},
];

function checkMilestone(s) {
  if (!s.milestones) s.milestones = [];
  MILESTONES.forEach(function(m) {
    var key = "cleared_"+m.n;
    if (s.cleared >= m.n && !s.milestones.includes(key)) {
      s.milestones.push(key);
      showMilestoneToast(m);
    }
    var skey = "streak_"+m.n;
    if (s.streak >= m.n && !s.milestones.includes(skey)) {
      s.milestones.push(skey);
      showMilestoneToast(m);
    }
  });
}

function showMilestoneToast(m) {
  var toast = document.getElementById("shareToast");
  toast.textContent = m.icon+" "+m.label+" unlocked!";
  toast.hidden = false;
  toast.classList.add("visible");
  setTimeout(function() {
    toast.classList.remove("visible");
    setTimeout(function() { toast.hidden=true; toast.textContent="Link copied!"; },220);
  }, 3000);
}

function renderStats() {
  var s = loadStats();
  statCleared.textContent = s.cleared;
  statStreak.textContent  = s.streak;
  statBest.textContent    = s.best;
  statPlayed.textContent  = s.played;
  statPerfect.textContent = s.perfect;
  statAvg.textContent     = s.played>0 ? (s.totalMistakes/s.played).toFixed(1) : "—";
  renderStreakBadge(s.streak);
  renderMilestonesPanel(s);
}

function renderStreakBadge(streak) {
  if (!streakBadge) return;
  if (streak >= 30)      { streakBadge.textContent="👑 "+streak; streakBadge.className="streak-badge s3"; }
  else if (streak >= 7)  { streakBadge.textContent="🔥 "+streak; streakBadge.className="streak-badge s2"; }
  else if (streak >= 1)  { streakBadge.textContent="⚡ "+streak; streakBadge.className="streak-badge s1"; }
  else                   { streakBadge.textContent="";            streakBadge.className="streak-badge"; }
}

function renderMilestonesPanel(s) {
  var el = document.getElementById("milestonesList");
  if (!el) return;
  if (!s.milestones || s.milestones.length===0) {
    el.innerHTML = "<p class='milestone-empty'>Complete puzzles to earn badges!</p>"; return;
  }
  el.innerHTML = "";
  MILESTONES.forEach(function(m) {
    var ck = s.milestones.includes("cleared_"+m.n);
    var sk = s.milestones.includes("streak_"+m.n);
    if (ck||sk) {
      var badge = document.createElement("div");
      badge.className = "milestone-badge";
      badge.innerHTML = "<span>"+m.icon+"</span><span>"+m.label+"</span>";
      el.appendChild(badge);
    }
  });
}

// ── Difficulty ───────────────────────────────────────────────────────────────
function setDifficulty(d) {
  difficulty = d;
  localStorage.setItem(LS_DIFF, d);
  diffButtons.forEach(function(btn) {
    btn.classList.toggle("active", parseInt(btn.dataset.d)===d);
  });
}

// ── Leaderboard ──────────────────────────────────────────────────────────────
var boardData    = [];
var pendingScore = null;
var myNickname   = localStorage.getItem(LS_NICK)||"";

async function fetchBoard() {
  boardList.innerHTML = "<div class='board-loading'>Loading&#8230;</div>";
  try {
    var res = await fetch(WORKER_URL+"/scores", {mode:"cors",cache:"no-store"});
    if (!res.ok) throw new Error("HTTP "+res.status);
    boardData = await res.json();
    if (!boardData.length) boardData = [
      {nickname:"PuzzleKing88", cleared:23, perfect:4},
      {nickname:"LinkMaster",   cleared:17, perfect:2},
      {nickname:"SingaporeAce", cleared:11, perfect:1},
    ];
    renderBoard();
  } catch(e) {
    boardList.innerHTML = "<div class='board-error'>Could not load leaderboard.</div>";
  }
  var s = loadStats();
  if (s.cleared>0) showSubmitArea(s.cleared, s.perfect);
  else boardSubmitArea.hidden=true;
}

function renderBoard() {
  var medals=["🥇","🥈","🥉"];
  boardList.innerHTML="";
  if (!boardData.length) { boardList.innerHTML="<div class='board-empty'>No scores yet — be the first!</div>"; return; }
  boardData.forEach(function(entry,i) {
    var isMe = myNickname && entry.nickname===myNickname;
    var row = document.createElement("div");
    row.className="board-row rank-"+(i+1)+(isMe?" me":"");
    row.innerHTML="<div class='board-rank'>"+(medals[i]||(i+1))+"</div>"+
      "<div class='board-name'>"+entry.nickname+"</div>"+
      "<div class='board-score'>"+entry.cleared+" rounds<span>"+entry.perfect+" perfect</span></div>";
    boardList.appendChild(row);
  });
}

async function submitScore(nickname, cleared, perfect) {
  submitScoreBtn.disabled=true; submitScoreBtn.textContent="Submitting…";
  try {
    var res = await fetch(WORKER_URL+"/scores",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({nickname,cleared,perfect})});
    if (!res.ok) throw new Error("HTTP "+res.status);
    boardData=await res.json(); myNickname=nickname;
    localStorage.setItem(LS_NICK,nickname);
    boardSubmitArea.hidden=true;
    submitScoreBtn.disabled=false; submitScoreBtn.textContent="🏆 Submit";
    renderBoard(); pendingScore=null;
  } catch(e) { submitScoreBtn.textContent="Retry"; submitScoreBtn.disabled=false; }
}

function showSubmitArea(cleared,perfect) {
  pendingScore={cleared,perfect};
  nicknameInput.value=myNickname;
  var lbl=boardSubmitArea.querySelector(".board-submit-label");
  if (lbl) lbl.textContent=myNickname?"Update your score!":"You have a score to submit!";
  boardSubmitArea.hidden=false;
}

// ── Tiles ────────────────────────────────────────────────────────────────────
function createTiles() {
  tiles=puzzleGroups.flatMap(function(g,gi){ return g.words.map(function(w){ return {word:w,gi:gi}; }); });
  randomShuffle(tiles);
}
function randomShuffle(arr) {
  for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}
}

// ── Render ───────────────────────────────────────────────────────────────────
function render() {
  solvedGroups.innerHTML="";
  puzzleGroups.forEach(function(group,i) {
    if(!solved.has(i)) return;
    var card=document.createElement("div");
    card.className="group-card group-"+i;
    card.innerHTML="<strong>"+group.title+"</strong><span>"+group.words.join(", ")+"</span>";
    solvedGroups.appendChild(card);
  });
  tileGrid.innerHTML="";
  tiles.forEach(function(tile,i) {
    var btn=document.createElement("button");
    btn.className="tile"+(selected.has(i)?" selected":"");
    btn.type="button"; btn.textContent=tile.word;
    btn.disabled=solved.has(tile.gi);
    btn.setAttribute("aria-pressed",selected.has(i)?"true":"false");
    btn.addEventListener("click",function(){ toggleTile(i); });
    tileGrid.appendChild(btn);
  });
  groupsFound.textContent=solved.size+"/4";
  mistakesLeft.textContent=Math.max(0,4-mistakes);
  submitButton.disabled=selected.size!==4||mistakes>=4||solved.size===4;
  renderStreakBadge(loadStats().streak);
}

// ── Game logic ───────────────────────────────────────────────────────────────
function toggleTile(i) {
  if (solved.has(tiles[i].gi)) return;
  if (selected.has(i)) selected.delete(i);
  else if (selected.size<4) selected.add(i);
  statusText.textContent=selected.size===4?"Submit your link.":"Select four connected tiles.";
  render();
}

function submitSelection() {
  if (selected.size!==4) return;
  var picked=Array.from(selected).map(function(i){return tiles[i];});
  var gi=picked[0].gi;
  var isMatch=picked.every(function(t){return t.gi===gi;});

  if (isMatch) {
    solved.add(gi); selected.clear(); showHint(false);
    moveHistory.push("C"+gi); // correct, which group
    if (solved.size===4) {
      statusText.textContent="All links forged!"; render();
      recordResult(true); renderStats(); showCompletionModal();
    } else {
      statusText.textContent="Correct link forged."; render();
    }
  } else {
    var hintMsg=buildHint(picked);
    mistakes++; selected.clear();
    moveHistory.push("W"); // wrong guess
    statusText.textContent=mistakes>=4?"No mistakes left. Reset to try again.":"Not a link. Try another group.";
    showHint(true,hintMsg);
    if (mistakes>=4) { render(); recordResult(false); renderStats(); showFailModal(); }
    else render();
  }
}

// ── Escalating hints ─────────────────────────────────────────────────────────
function buildHint(picked) {
  var counts=new Map();
  picked.forEach(function(t){counts.set(t.gi,(counts.get(t.gi)||0)+1);});
  var topEntry=[...counts.entries()].sort(function(a,b){return b[1]-a[1];})[0];
  var topGi=topEntry[0], topCount=topEntry[1];
  var nextN=mistakes+1;

  if (topCount===3) {
    hintHistory.push(topGi);
    var times=hintHistory.filter(function(h){return h===topGi;}).length;
    return escalate(nextN,topGi,times,true);
  }
  var unsolved=puzzleGroups.map(function(g,i){return {g:g,i:i};}).filter(function(x){return !solved.has(x.i);});
  var unhinted=unsolved.filter(function(x){return !hintHistory.includes(x.i);});
  var target=(unhinted.length>0?unhinted:unsolved)[mistakes%((unhinted.length||unsolved.length)||1)];
  if (!target) target=unsolved[0];
  hintHistory.push(target.i);
  var times=hintHistory.filter(function(h){return h===target.i;}).length;
  return escalate(nextN,target.i,times,false);
}

function escalate(mistakeNum,gi,times,oneAway) {
  var group=puzzleGroups[gi];
  var prefix="Hint "+mistakeNum+"/4: ";
  var oneAwayStr=oneAway?"You are one tile away! ":"";
  if (times<=1) return prefix+oneAwayStr+group.hint;
  if (times===2) return prefix+oneAwayStr+"The category is \""+group.title+"\". "+group.hint;
  return prefix+oneAwayStr+(group.reveal||group.title+": "+group.words.join(", ")+".");
}

function showHint(visible,msg) {
  if (visible&&msg) { hintText.textContent=msg; hintBox.hidden=false; }
  else { hintBox.hidden=true; hintText.textContent=""; }
}

// ── Puzzle control ───────────────────────────────────────────────────────────
function clearSelection() {
  selected.clear(); statusText.textContent="Select four connected tiles."; render();
}

function startPuzzle(daily) {
  selected.clear(); solved.clear(); mistakes=0; hintHistory=[]; moveHistory=[];
  showHint(false); hideModal(); isDaily=daily;
  if (daily) {
    puzzleGroups=buildDailyPuzzle(getTodayStr(),difficulty);
    statusText.textContent="Today's puzzle — "+diffLabel()+" mode.";
  } else {
    currentPuzzleIndex=(currentPuzzleIndex+1)%200;
    puzzleGroups=buildFreePuzzle(currentPuzzleIndex,difficulty);
    statusText.textContent="Select four connected tiles.";
  }
  createTiles(); render();
}

function diffLabel() {
  return difficulty===1?"Easy":difficulty===3?"Hard":"Medium";
}

function shuffleActiveTiles() {
  var unsolved=tiles.filter(function(t){return !solved.has(t.gi);});
  var fixed=tiles.map(function(t,i){return {t:t,i:i};}).filter(function(x){return solved.has(x.t.gi);});
  randomShuffle(unsolved);
  var ai=0;
  tiles=Array.from({length:16},function(_,i){
    var f=fixed.find(function(x){return x.i===i;});
    return f?f.t:unsolved[ai++];
  });
  clearSelection();
}

// ── Emoji share card ──────────────────────────────────────────────────────────
var GROUP_EMOJI=["🟨","🟦","🟥","🟪"];

function buildShareCard() {
  var s=loadStats();
  var header="🔗 LinkForge "+( isDaily?"#"+getTodayStr():"Free Play");
  var diffStr="["+diffLabel()+"]";
  var result=mistakes>=4?"💥 Failed":"⭐ Cleared"+(mistakes===0?" (Perfect!)":"");

  // Build emoji grid row by row
  // moveHistory has "C0","C1","W" entries in order
  var rows=[];
  var row=[];
  moveHistory.forEach(function(m) {
    if (m.startsWith("C")) {
      // Fill remaining unknowns in this attempt as wrong, then show correct row
      while(row.length<4) row.push("⬜");
      // Actually just show the correct colour for the solved group
      rows.push(Array(4).fill(GROUP_EMOJI[parseInt(m[1])]||"🟩").join(""));
      row=[];
    } else {
      row.push("❌");
      if(row.length===4){rows.push(row.join(""));row=[];}
    }
  });

  var streakLine=s.streak>0?"🔥 Streak: "+s.streak+" | 🏆 Best: "+s.best:"";
  var lines=[header,diffStr+" "+result,rows.join("\n"),streakLine,"linkforge.buildjoynow.com"].filter(Boolean);
  return lines.join("\n");
}

// ── Modals ───────────────────────────────────────────────────────────────────
function showCompletionModal() {
  var s=loadStats();
  modalIcon.textContent=mistakes===0?"⭐":"🎉";
  modalTitle.textContent=mistakes===0?"Perfect clear!":"Puzzle complete!";
  modalSub.textContent=(isDaily?"Daily ":"Puzzle "+(currentPuzzleIndex+1)+" ")+"done with "+mistakes+" mistake"+(mistakes===1?"":"s")+".";
  renderModalStats(s); nextModal.hidden=false;
}
function showFailModal() {
  var s=loadStats();
  modalIcon.textContent="💥"; modalTitle.textContent="Out of mistakes!";
  modalSub.textContent="Streak reset to 0.";
  renderModalStats(s); nextModal.hidden=false;
}
function renderModalStats(s) {
  modalStats.innerHTML=[
    {label:"Cleared",value:s.cleared},
    {label:"Streak", value:s.streak},
    {label:"Best",   value:s.best},
  ].map(function(x){ return "<div class='modal-stat-item'><strong>"+x.value+"</strong><span>"+x.label+"</span></div>"; }).join("");
}
function hideModal() { nextModal.hidden=true; }

// ── Tab switching ────────────────────────────────────────────────────────────
function switchTab(targetId) {
  tabs.forEach(function(t) {
    var active=t.id==="tab"+targetId;
    t.className=active?"tab active":"tab";
  });
  panels.forEach(function(p) {
    var show=p.id==="panel"+targetId;
    if (show) { p.classList.remove("panel-hidden"); p.style.display="flex"; }
    else       { p.classList.add("panel-hidden");    p.style.display="none"; }
  });
  if (targetId==="Stats") renderStats();
  if (targetId==="Board") fetchBoard();
}

// ── Share ────────────────────────────────────────────────────────────────────
function shareGame() {
  var url="https://linkforge.buildjoynow.com";
  var text="Can you forge all 4 links? Play LinkForge — a daily word puzzle!";
  if (navigator.share&&location.protocol==="https:") {
    navigator.share({title:"LinkForge",text:text,url:url}).catch(function(err){ if(err.name!=="AbortError") copyToClipboard(url); });
  } else { copyToClipboard(url); }
}
function shareResult() {
  var card=buildShareCard();
  if (navigator.share&&location.protocol==="https:") {
    navigator.share({title:"LinkForge",text:card}).catch(function(){ copyToClipboard(card); });
  } else { copyToClipboard(card); }
}
function copyToClipboard(text) {
  if (navigator.clipboard&&navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showCopiedToast).catch(function(){fallbackCopy(text);});
  } else { fallbackCopy(text); }
}
function fallbackCopy(text) {
  var el=document.createElement("textarea");
  el.value=text; el.style.cssText="position:fixed;top:-9999px;left:-9999px;opacity:0";
  document.body.appendChild(el); el.focus(); el.select();
  try{document.execCommand("copy");showCopiedToast();}catch(e){}
  document.body.removeChild(el);
}
function showCopiedToast() {
  shareToast.hidden=false; shareToast.classList.add("visible");
  setTimeout(function(){ shareToast.classList.remove("visible"); setTimeout(function(){shareToast.hidden=true;},220); },2200);
}

// ── Event listeners ──────────────────────────────────────────────────────────
resetButton.addEventListener("click", function(){ startPuzzle(false); });
shuffleButton.addEventListener("click", shuffleActiveTiles);
clearButton.addEventListener("click", clearSelection);
submitButton.addEventListener("click", submitSelection);

shareButton.addEventListener("click", shareGame);
shareButton.addEventListener("touchend", function(e){e.preventDefault();shareGame();});

if (modalShare) {
  modalShare.addEventListener("click", shareResult);
  modalShare.addEventListener("touchend", function(e){e.preventDefault();shareResult();});
}

document.getElementById("dailyBtn").addEventListener("click", function(){ startPuzzle(true); });
document.getElementById("freeBtn").addEventListener("click",  function(){ startPuzzle(false); });

nextPuzzleBtn.addEventListener("click", function(){ hideModal(); startPuzzle(isDaily?false:false); });
nextModal.addEventListener("click", function(e){ if(e.target===nextModal){hideModal();} });

modalBoardBtn.addEventListener("click", function(){
  hideModal(); switchTab("Board");
});

tabs.forEach(function(tab) {
  tab.addEventListener("click", function(){ switchTab(this.id.replace("tab","")); });
});

diffButtons.forEach(function(btn) {
  btn.addEventListener("click", function(){ setDifficulty(parseInt(this.dataset.d)); });
});

submitScoreBtn.addEventListener("click", function(){
  var nick=nicknameInput.value.trim().slice(0,16);
  if (!nick){nicknameInput.focus();return;}
  if (!pendingScore) return;
  submitScore(nick,pendingScore.cleared,pendingScore.perfect);
});

resetStatsBtn.addEventListener("click", function(){
  if (confirm("Reset all your local stats?")){ saveStats(defaultStats()); renderStats(); }
});

// ── Init ─────────────────────────────────────────────────────────────────────
setDifficulty(difficulty);
renderStats();
startPuzzle(false); // start with free play; user can tap Daily
