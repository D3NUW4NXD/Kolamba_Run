(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const $ = (id) => document.getElementById(id);

  const ui = {
    score: $("score"),
    notes: $("notes"),
    healthHearts: $("healthHearts"),
    modeText: $("modeText"),
    distance: $("distance"),
    speed: $("speed"),
    missionText: $("missionText"),
    missionProgress: $("missionProgress"),
    powerBar: $("powerBar"),
    powerIcon: $("powerIcon"),
    powerName: $("powerName"),
    powerFill: $("powerFill"),
    comboBadge: $("comboBadge"),
    memePopup: $("memePopup"),
    enemyWarning: $("enemyWarning"),
    enemyPanel: $("enemyPanel"),
    enemyStateText: $("enemyStateText"),
    enemyAmmoText: $("enemyAmmoText"),
    dangerFill: $("dangerFill"),
    dodgeHint: $("dodgeHint"),
    roadEvent: $("roadEvent"),
    obstacleJumpWarning: $("obstacleJumpWarning"),
    creditsScreen: $("creditsScreen"),
    creditsBtn: $("creditsBtn"),
    closeCreditsBtn: $("closeCreditsBtn"),
    startScreen: $("startScreen"),
    pauseScreen: $("pauseScreen"),
    gameOverScreen: $("gameOverScreen"),
    rotateScreen: $("rotateScreen"),
    startBtn: $("startBtn"),
    pauseBtn: $("pauseBtn"),
    resumeBtn: $("resumeBtn"),
    restartFromPauseBtn: $("restartFromPauseBtn"),
    restartBtn: $("restartBtn"),
    homeBtn: $("homeBtn"),
    fullscreenBtn: $("fullscreenBtn"),
    musicBtn: $("musicBtn"),
    jumpBtn: $("jumpBtn"),
    slideBtn: $("slideBtn"),
    finalScore: $("finalScore"),
    finalNotes: $("finalNotes"),
    finalDistance: $("finalDistance"),
    bestScore: $("bestScore"),
    gameOverMeme: $("gameOverMeme"),
    difficultyScreen: $("difficultyScreen"),
    difficultyBtn: $("difficultyBtn"),
    backFromDifficultyBtn: $("backFromDifficultyBtn"),
    startSelectedModeBtn: $("startSelectedModeBtn"),
    difficultyQuickLabel: $("difficultyQuickLabel"),
    menuBestScore: $("menuBestScore"),
    healthDots: $("healthDots"),
    hudComboText: $("hudComboText"),
    powerTimeText: $("powerTimeText"),
    enemyAmmoSegments: $("enemyAmmoSegments"),
    tacticalWarningBar: $("tacticalWarningBar"),
    tacticalWarningText: $("tacticalWarningText"),
    pauseDistance: $("pauseDistance"),
    pauseScore: $("pauseScore"),
    pauseHomeBtn: $("pauseHomeBtn"),
    pauseMusicBtn: $("pauseMusicBtn"),
    pauseSfxBtn: $("pauseSfxBtn"),
    finalCombo: $("finalCombo"),
    newBestBadge: $("newBestBadge"),
    bgMusic: $("bgMusic"),
    busHornSfx: $("busHornSfx"),
    ct100Sfx: $("ct100Sfx"),
    tukTukSfx: $("tukTukSfx"),
    lorrySfx: $("lorrySfx"),
    enemyFireSfx: $("enemyFireSfx"),
    ammoYakoSfx: $("ammoYakoSfx"),
    ammoOutSfx: $("ammoOutSfx"),
    notePickupSfx: $("notePickupSfx"),
    warningSfx: $("warningSfx"),
    playerHitSfx: $("playerHitSfx"),
    nearMissSfx: $("nearMissSfx"),
    heartPickupSfx: $("heartPickupSfx"),
    powerPickupSfx: $("powerPickupSfx"),
    girl1Sfx: $("girl1Sfx"),
    girl2Sfx: $("girl2Sfx")
  };

  // Power-up pickup sound. If the HTML audio element does not exist,
  // create it automatically so this JS works by itself.
  if (!ui.powerPickupSfx) {
    ui.powerPickupSfx = new Audio("assets/picker.mp3");
    ui.powerPickupSfx.id = "powerPickupSfx";
    ui.powerPickupSfx.preload = "auto";
  }

  if (!ui.girl1Sfx) {
    ui.girl1Sfx = new Audio("assets/girl1.mp3");
    ui.girl1Sfx.id = "girl1Sfx";
    ui.girl1Sfx.preload = "auto";
  }

  if (!ui.girl2Sfx) {
    ui.girl2Sfx = new Audio("assets/girl2.mp3");
    ui.girl2Sfx.id = "girl2Sfx";
    ui.girl2Sfx.preload = "auto";
  }

  const DESIGN_W = 1600;
  const DESIGN_H = 900;
  const GROUND_Y = 725;

  const images = {};

  // Internet-hosted open-source SVG icons from Iconify.
  // The game automatically falls back to letters/symbols if an icon fails to load.
  const POWERUP_ICON_URLS = {
    shield: "https://api.iconify.design/mdi/shield-check.svg?color=%2339e3f1",
    magnet: "https://api.iconify.design/mdi/magnet.svg?color=%23ffd84a",
    slowmo: "https://api.iconify.design/mdi/timer-sand.svg?color=%23bb8cff",
    heart: "https://api.iconify.design/mdi/heart.svg?color=%23ff6674",
    boost: "https://api.iconify.design/mdi/lightning-bolt.svg?color=%234be7a5"
  };

  const imageFiles = {
    character: "assets/character.png",
    ct100: "assets/ct100_bike.png",
    bus: "assets/sri_lankan_bus.png",
    tuk: "assets/tuk_tuk.png",
    lorry: "assets/lorry.png",
    enemy: "assets/enemy_character.png",
    girl: "assets/female_character.png",
    note: "assets/sri_lankan_note.png",

    powerShield: POWERUP_ICON_URLS.shield,
    powerMagnet: POWERUP_ICON_URLS.magnet,
    powerSlowmo: POWERUP_ICON_URLS.slowmo,
    powerHeart: POWERUP_ICON_URLS.heart,
    powerBoost: POWERUP_ICON_URLS.boost
  };

  for (const [key, src] of Object.entries(imageFiles)) {
    const img = new Image();
    img.src = src;
    images[key] = img;
  }


  const DIFFICULTIES = {
    easy: {
      label: "EASY",
      startSpeed: 7,
      maxSpeed: 18,
      maxHealth: 4,
      missionTarget: 500,
      scoreMultiplier: 1,
      obstacleGapMin: 155,
      obstacleGapMax: 225,
      powerMin: 300,
      powerMax: 470,
      enemyInitial: 900,
      enemyReturnMin: 700,
      enemyReturnMax: 1050,
      enemyShotsBase: 3,
      enemyShotsBonus: 1,
      enemyAimBase: 88,
      enemyAimMin: 60,
      enemyShotSpeed: 16,
      jumpPower: -22,
      doubleJumpPower: -18.5,
      slowFactor: 0.58
    },
    medium: {
      label: "MEDIUM",
      startSpeed: 8,
      maxSpeed: 22,
      maxHealth: 3,
      missionTarget: 750,
      scoreMultiplier: 1.35,
      obstacleGapMin: 125,
      obstacleGapMax: 195,
      powerMin: 430,
      powerMax: 650,
      enemyInitial: 660,
      enemyReturnMin: 470,
      enemyReturnMax: 830,
      enemyShotsBase: 4,
      enemyShotsBonus: 2,
      enemyAimBase: 72,
      enemyAimMin: 45,
      enemyShotSpeed: 19,
      jumpPower: -21.5,
      doubleJumpPower: -18,
      slowFactor: 0.62
    },
    hard: {
      label: "HARD",
      startSpeed: 10,
      maxSpeed: 26,
      maxHealth: 2,
      missionTarget: 1000,
      scoreMultiplier: 2,
      obstacleGapMin: 105,
      obstacleGapMax: 165,
      powerMin: 560,
      powerMax: 820,
      enemyInitial: 500,
      enemyReturnMin: 340,
      enemyReturnMax: 620,
      enemyShotsBase: 5,
      enemyShotsBonus: 2,
      enemyAimBase: 60,
      enemyAimMin: 36,
      enemyShotSpeed: 22,
      jumpPower: -21,
      doubleJumpPower: -17.5,
      slowFactor: 0.68
    }
  };

  function difficultyConfig() {
    return DIFFICULTIES[state.difficultyMode] || DIFFICULTIES.medium;
  }

  const state = {
    running: false,
    paused: false,
    gameOver: false,
    frame: 0,
    score: 0,
    notes: 0,
    distance: 0,
    speed: 8,
    obstacleTimer: 90,
    noteTimer: 70,
    powerTimer: 650,
    shake: 0,
    flash: 0,
    best: Number(localStorage.getItem("lankaMemeRunBest") || 0),
    combo: 1,
    comboTimer: 0,
    musicOn: true,
    missionTarget: 500,
    enemyTimer: 620,
    enemyWarningTimer: 0,
    girlTimer: 780,
    health: 3,
    maxHealth: 3,
    invulnerable: 0,
    difficulty: 0,
    nearMisses: 0,
    weather: "clear",
    weatherTimer: 850,
    rainTimer: 0,
    roadEventTimer: 0,
    difficultyMode: localStorage.getItem("lankaMemeDifficulty") || "medium",
    obstacleWarningTimer: 0,
    bestCombo: 1,
    sfxOn: true
  };

  const player = {
    x: 205,
    y: GROUND_Y - 150,
    w: 96,
    h: 150,
    normalH: 150,
    slideH: 82,
    vy: 0,
    grounded: true,
    jumps: 0,
    sliding: false,
    slideTimer: 0,
    shield: 0,
    magnet: 0,
    slowmo: 0,
    scoreBoost: 0,
    runPhase: 0
  };

  const obstacles = [];
  const notes = [];
  const particles = [];
  const powerups = [];
  const enemies = [];
  const enemyShots = [];
  const girls = [];
  const clouds = [];
  const palms = [];
  const roadLines = [];

  const obstacleDefs = [
    { type: "ct100", w: 150, h: 86, y: GROUND_Y - 86, img: "ct100", inset: 18, sound: "ct100Sfx" },
    { type: "tuk", w: 170, h: 125, y: GROUND_Y - 125, img: "tuk", inset: 16, sound: "tukTukSfx" },
    { type: "bus", w: 285, h: 170, y: GROUND_Y - 170, img: "bus", inset: 24, sound: "busHornSfx", collisionH: 102, jumpWarning: true },
    { type: "lorry", w: 300, h: 175, y: GROUND_Y - 175, img: "lorry", inset: 22, sound: "lorrySfx", collisionH: 108, jumpWarning: true },
    { type: "pothole", w: 118, h: 30, y: GROUND_Y - 18, img: null, inset: 8 },
    { type: "sign", w: 95, h: 170, y: GROUND_Y - 255, img: null, inset: 10 }
  ];

  const memeLines = [
    "ADO ADO!",
    "AIYOOO!",
    "ELA KIRI!",
    "HARI HARI!",
    "MOKAKDA YAKO!",
    "PATTA!",
    "GAMAK!",
    "YAKOOO!"
  ];

  const gameOverLines = [
    "AIYOOO!",
    "ROAD EKA KAALA!",
    "AYETH DUWAMU!",
    "TUK TUK WIN!",
    "MOKAKDA YAKO!"
  ];

  function initWorld() {
    for (let i = 0; i < 10; i++) {
      clouds.push({
        x: Math.random() * DESIGN_W,
        y: 80 + Math.random() * 210,
        scale: 0.6 + Math.random() * 1.3,
        speed: 0.1 + Math.random() * 0.2
      });
    }

    for (let i = 0; i < 15; i++) {
      palms.push({
        x: Math.random() * DESIGN_W,
        scale: 0.6 + Math.random() * 0.8,
        near: Math.random() > 0.48
      });
    }

    for (let i = 0; i < 18; i++) {
      roadLines.push({ x: i * 125 });
    }
  }


  function showDifficultyScreen() {
    if (ui.startScreen) ui.startScreen.classList.add("hidden");
    if (ui.difficultyScreen) ui.difficultyScreen.classList.remove("hidden");
  }

  function closeDifficultyScreen() {
    if (ui.difficultyScreen) ui.difficultyScreen.classList.add("hidden");
    if (ui.startScreen) ui.startScreen.classList.remove("hidden");
  }

  function refreshDifficultyUI() {
    const cfg = difficultyConfig();

    if (ui.difficultyQuickLabel) {
      ui.difficultyQuickLabel.textContent = cfg.label;
    }

    if (ui.startSelectedModeBtn) {
      ui.startSelectedModeBtn.textContent = `START ${cfg.label}`;
    }

    document.querySelectorAll(".difficulty-card").forEach(card => {
      const active = card.dataset.difficulty === state.difficultyMode;
      card.classList.toggle("active", active);

      const stateLabel = card.querySelector(".difficulty-head span");
      if (stateLabel) stateLabel.textContent = active ? "ACTIVE" : "SELECT";
    });
  }

  function goHomeFromPause() {
    document.body.classList.remove("game-running");
    state.running = false;
    state.paused = false;
    state.gameOver = false;

    if (ui.pauseScreen) ui.pauseScreen.classList.add("hidden");
    if (ui.gameOverScreen) ui.gameOverScreen.classList.add("hidden");
    if (ui.difficultyScreen) ui.difficultyScreen.classList.add("hidden");
    if (ui.startScreen) ui.startScreen.classList.remove("hidden");

    if (ui.bgMusic) {
      ui.bgMusic.pause();
      ui.bgMusic.currentTime = 0;
    }

    stopAllSfx();
  }

  function toggleSfx() {
    state.sfxOn = !state.sfxOn;

    if (!state.sfxOn) {
      stopAllSoundsExceptPlayerHit();
    }

    if (ui.pauseSfxBtn) {
      ui.pauseSfxBtn.textContent = state.sfxOn ? "SFX ON" : "SFX OFF";
    }
  }

  function resetGame() {
    // Clear any leftover audio from the previous run.
    stopAllSfx();

    if (ui.bgMusic) {
      ui.bgMusic.pause();
      ui.bgMusic.currentTime = 0;
    }

    document.body.classList.add("game-running");
    state.running = true;
    state.paused = false;
    state.gameOver = false;
    state.frame = 0;
    state.score = 0;
    state.notes = 0;
    state.distance = 0;
    const cfg = difficultyConfig();

    state.speed = cfg.startSpeed;
    state.maxHealth = cfg.maxHealth;
    state.missionTarget = cfg.missionTarget;
    state.obstacleTimer = 100;
    state.noteTimer = 70;
    state.powerTimer = cfg.powerMin * 0.7;
    state.shake = 0;
    state.flash = 0;
    state.combo = 1;
    state.bestCombo = 1;
    state.comboTimer = 0;
    state.enemyTimer = cfg.enemyInitial;
    state.enemyWarningTimer = 0;
    state.girlTimer = 850 + Math.random() * 650;
    state.health = state.maxHealth;
    state.invulnerable = 0;
    state.difficulty = 0;
    state.nearMisses = 0;
    state.weather = "clear";
    state.weatherTimer = 850;
    state.rainTimer = 0;
    state.roadEventTimer = 0;
    state.obstacleWarningTimer = 0;

    obstacles.length = 0;
    notes.length = 0;
    particles.length = 0;
    powerups.length = 0;
    enemies.length = 0;
    enemyShots.length = 0;
    girls.length = 0;

    Object.assign(player, {
      x: 205,
      y: GROUND_Y - 150,
      w: 96,
      h: 150,
      vy: 0,
      grounded: true,
      jumps: 0,
      sliding: false,
      slideTimer: 0,
      shield: 0,
      magnet: 0,
      slowmo: 0,
      scoreBoost: 0,
      runPhase: 0
    });

    ui.startScreen.classList.add("hidden");
    ui.difficultyScreen.classList.add("hidden");
    ui.pauseScreen.classList.add("hidden");
    ui.gameOverScreen.classList.add("hidden");
    ui.creditsScreen.classList.add("hidden");
    updateHUD();

    if (state.musicOn) {
      ui.bgMusic.volume = 0.35;
      ui.bgMusic.play().catch(() => {});
    }
  }

  function goHome() {
    document.body.classList.remove("game-running");
    state.running = false;
    state.paused = false;
    state.gameOver = false;
    ui.gameOverScreen.classList.add("hidden");
    ui.pauseScreen.classList.add("hidden");
    ui.startScreen.classList.remove("hidden");

    if (ui.bgMusic) {
      ui.bgMusic.pause();
      ui.bgMusic.currentTime = 0;
    }

    stopAllSfx();
  }

  function endGame() {
    if (state.gameOver) return;

    document.body.classList.remove("game-running");

    // Keep player_hit playing, but stop BGM and every other SFX.
    stopAllSoundsExceptPlayerHit();

    state.running = false;
    state.gameOver = true;
    state.shake = 18;
    burst(player.x + player.w / 2, player.y + player.h / 2, 28, "#ff5a67");

    const previousBest = state.best;
    state.best = Math.max(state.best, Math.floor(state.score));
    localStorage.setItem("lankaMemeRunBest", String(state.best));

    ui.finalScore.textContent = Math.floor(state.score).toLocaleString();
    ui.finalNotes.textContent = state.notes.toLocaleString();
    ui.finalDistance.textContent = Math.floor(state.distance).toLocaleString();
    ui.bestScore.textContent = state.best.toLocaleString();
    ui.gameOverMeme.textContent = gameOverLines[Math.floor(Math.random() * gameOverLines.length)];
    if (ui.finalCombo) ui.finalCombo.textContent = String(Math.max(1, state.bestCombo));
    if (ui.newBestBadge) {
      ui.newBestBadge.classList.toggle(
        "hidden",
        Math.floor(state.score) <= previousBest
      );
    }

    ui.gameOverScreen.classList.remove("hidden");
  }

  // Track every cloned SFX currently playing.
  const activeSfx = new Set();

  function stopAllSfx() {
    activeSfx.forEach((sound) => {
      try {
        sound.pause();
        sound.currentTime = 0;
      } catch (_) {}

      activeSfx.delete(sound);
    });
  }

  function stopAllSoundsExceptPlayerHit() {
    // Stop background music immediately.
    if (ui.bgMusic) {
      ui.bgMusic.pause();
    }

    // Stop every currently playing SFX except player_hit.
    activeSfx.forEach((sound) => {
      if (sound.dataset.sourceId === "playerHitSfx") {
        return;
      }

      try {
        sound.pause();
        sound.currentTime = 0;
      } catch (_) {}

      activeSfx.delete(sound);
    });
  }

  function playSfx(audioEl, volume = 0.7) {
    if (!state.sfxOn || !audioEl) return;

    try {
      const clone = audioEl.cloneNode(true);

      clone.volume = volume;
      clone.dataset.sourceId = audioEl.id;

      activeSfx.add(clone);

      const cleanup = () => {
        activeSfx.delete(clone);
      };

      clone.addEventListener("ended", cleanup, { once: true });
      clone.addEventListener("error", cleanup, { once: true });

      clone.play().catch((error) => {
        activeSfx.delete(clone);
        console.warn("Could not play SFX:", audioEl.id, error);
      });
    } catch (error) {
      console.error("Audio error:", error);
    }
  }

  function togglePause() {
    if (!state.running && !state.paused) return;

    state.paused = !state.paused;

    document.body.classList.toggle(
      "game-running",
      state.running && !state.paused && !state.gameOver
    );

    ui.pauseScreen.classList.toggle("hidden", !state.paused);

    if (state.paused) {
      if (ui.pauseDistance) {
        ui.pauseDistance.textContent = `${Math.floor(state.distance)} m`;
      }

      if (ui.pauseScore) {
        ui.pauseScore.textContent = Math.floor(state.score)
          .toString()
          .padStart(6, "0");
      }

      if (ui.pauseMusicBtn) {
        ui.pauseMusicBtn.textContent = state.musicOn
          ? "MUSIC ON"
          : "MUSIC OFF";
      }

      if (ui.pauseSfxBtn) {
        ui.pauseSfxBtn.textContent = state.sfxOn
          ? "SFX ON"
          : "SFX OFF";
      }

      // Pause behavior:
      // Stop BGM and every SFX except player hit.
      stopAllSoundsExceptPlayerHit();
      return;
    }

    // Resume only the background music.
    // Old vehicle/enemy sounds do not resume.
    if (state.musicOn && ui.bgMusic) {
      ui.bgMusic.volume = 0.35;
      ui.bgMusic.play().catch(() => {});
    }
  }

  function showCredits() {
    ui.startScreen.classList.add("hidden");
    ui.creditsScreen.classList.remove("hidden");
  }

  function closeCredits() {
    ui.creditsScreen.classList.add("hidden");
    ui.startScreen.classList.remove("hidden");
  }



  function timeScale() {
    return player.slowmo > 0 ? difficultyConfig().slowFactor : 1;
  }

  function worldSpeed() {
    return state.speed * timeScale();
  }

  function scoreMultiplier() {
    return difficultyConfig().scoreMultiplier * (player.scoreBoost > 0 ? 2 : 1);
  }

  function selectDifficulty(mode) {
    if (!DIFFICULTIES[mode]) return;

    state.difficultyMode = mode;
    localStorage.setItem("lankaMemeDifficulty", mode);

    document.querySelectorAll(".difficulty-card").forEach(button => {
      button.classList.toggle("active", button.dataset.difficulty === mode);
    });

    refreshDifficultyUI();
    updateHUD();
  }

  function damagePlayer(message = "AIYOOO!", sourceX = player.x, sourceY = player.y) {
    if (state.invulnerable > 0 || state.gameOver) return false;

    if (player.shield > 0) {
      player.shield = 0;
      burst(sourceX, sourceY, 18, "#39e3f1");
      state.shake = 8;
      showMeme("SHIELD SAVED YOU!");
      return false;
    }

    state.health--;
    state.invulnerable = 95;
    state.combo = 1;
    state.comboTimer = 0;
    ui.comboBadge.classList.remove("show");

    state.shake = 16;
    state.flash = 18;
    burst(player.x + player.w / 2, player.y + player.h / 2, 24, "#ff5a67");
    playSfx(ui.playerHitSfx, 0.85);
    showMeme(message);

    document.body.classList.remove("damage-flash");
    void document.body.offsetWidth;
    document.body.classList.add("damage-flash");

    if (state.health <= 0) {
      endGame();
      return true;
    }

    return false;
  }

  function triggerRoadEvent(label) {
    ui.roadEvent.textContent = label;
    ui.roadEvent.classList.add("show");
    state.roadEventTimer = 145;
  }

  function awardNearMiss() {
    state.nearMisses++;
    state.score += 120 * state.combo;
    state.combo = Math.min(5, state.combo + 1);
    state.comboTimer = 150;
    ui.comboBadge.textContent = `NEAR MISS x${state.combo}`;
    ui.comboBadge.classList.add("show");
    showMeme("TOO CLOSE!");
    playSfx(ui.nearMissSfx, 0.55);
  }

  function jump() {
    if (!state.running || state.paused) return;

    if (player.sliding) stopSlide();

    if (player.grounded) {
      player.vy = difficultyConfig().jumpPower;
      player.grounded = false;
      player.jumps = 1;
      spawnDust(player.x + player.w / 2, GROUND_Y - 5, 10);
      return;
    }

    if (player.jumps < 2) {
      player.vy = difficultyConfig().doubleJumpPower;
      player.jumps = 2;
      burst(player.x + player.w / 2, player.y + player.h / 2, 8, "#39e3f1");
      showMeme("DOUBLE!");
    }
  }

  function startSlide() {
    if (!state.running || state.paused || !player.grounded) return;
    player.sliding = true;
    player.slideTimer = 38;
    player.h = player.slideH;
    player.y = GROUND_Y - player.h;
  }

  function stopSlide() {
    if (!player.sliding) return;
    player.sliding = false;
    player.slideTimer = 0;
    player.h = player.normalH;
    player.y = GROUND_Y - player.h;
  }

  function spawnObstacle() {
    let defs = obstacleDefs;
    const cfg = difficultyConfig();

    if (state.frame < 500) {
      defs = obstacleDefs.filter(o => !["bus", "lorry", "sign"].includes(o.type));
    } else if (state.frame < 1100) {
      defs = obstacleDefs.filter(o => o.type !== "sign");
    }

    if (state.difficultyMode === "easy") {
      defs = defs.filter(o => o.type !== "sign" || state.distance > 700);
    }

    const def = defs[Math.floor(Math.random() * defs.length)];

    obstacles.push({
      ...def,
      x: DESIGN_W + 100,
      passed: false,
      soundTriggered: false,
      warningTriggered: false
    });

    let minGap = cfg.obstacleGapMin;
    let maxGap = cfg.obstacleGapMax;

    if (["bus", "lorry"].includes(def.type)) {
      minGap += 45;
      maxGap += 65;
    }

    if (state.weather === "rain") {
      minGap += 20;
      maxGap += 25;
    }

    const progression = state.difficulty * 18;
    state.obstacleTimer = Math.floor(
      minGap - progression + Math.random() * Math.max(28, maxGap - minGap)
    );
  }

  function spawnNotePattern() {
    const pattern = ["line", "arc", "stairs"][Math.floor(Math.random() * 3)];
    const count = 5 + Math.floor(Math.random() * 4);
    const startX = DESIGN_W + 80;
    const baseY = GROUND_Y - 170 - Math.random() * 100;

    for (let i = 0; i < count; i++) {
      let y = baseY;

      if (pattern === "arc") {
        y -= Math.sin((i / Math.max(1, count - 1)) * Math.PI) * 125;
      } else if (pattern === "stairs") {
        y -= (i % 4) * 38;
      }

      notes.push({
        x: startX + i * 72,
        y,
        w: 58,
        h: 28,
        phase: Math.random() * Math.PI * 2
      });
    }

    state.noteTimer = 210 + Math.floor(Math.random() * 160);
  }

  function spawnPowerup() {
    const roll = Math.random();
    let type = "shield";

    if (roll < 0.28) type = "shield";
    else if (roll < 0.50) type = "magnet";
    else if (roll < 0.68) type = "slowmo";
    else if (roll < 0.84) type = "heart";
    else type = "boost";

    if (type === "heart" && state.health >= state.maxHealth) {
      type = Math.random() > 0.5 ? "shield" : "boost";
    }

    powerups.push({
      type,
      x: DESIGN_W + 100,
      y: GROUND_Y - 210 - Math.random() * 105,
      r: 29,
      phase: Math.random() * Math.PI * 2
    });

    const cfg = difficultyConfig();
    state.powerTimer = cfg.powerMin + Math.random() * (cfg.powerMax - cfg.powerMin);
  }

  function spawnGirl() {
    // Rare encounter: 2 out of 4 chance, exactly 50%.
    const rareChance = Math.random() < 0.8;

    // The girl never appears while another major gameplay element is active.
    const anotherEventIsActive =
      girls.length > 0 ||
      enemies.length > 0 ||
      enemyShots.length > 0 ||
      obstacles.length > 0 ||
      powerups.length > 0;

    if (!rareChance || anotherEventIsActive) {
      // Wait a while before trying again.
      state.girlTimer = 500 + Math.random() * 500;
      return;
    }

    girls.push({
      x: DESIGN_W + 140,
      y: GROUND_Y - 180,
      w: 118,
      h: 180,
      passed: false,
      showSoundPlayed: false,
      phase: Math.random() * Math.PI * 2
    });

    // Long cooldown after a successful appearance so she stays rare.
    state.girlTimer = 1400 + Math.random() * 1200;
  }

  function updateGirls(dt) {
    for (let i = girls.length - 1; i >= 0; i--) {
      const girl = girls[i];

      girl.x -= worldSpeed() * dt;
      girl.phase += 0.05 * dt;

      // Play girl1.mp3 once when she first becomes visible.
      if (
        !girl.showSoundPlayed &&
        girl.x < DESIGN_W - girl.w * 0.25
      ) {
        girl.showSoundPlayed = true;
        playSfx(ui.girl1Sfx, 0.88);
      }

      // Play girl2.mp3 once after the player fully passes her.
      if (
        !girl.passed &&
        girl.x + girl.w < player.x
      ) {
        girl.passed = true;
        playSfx(ui.girl2Sfx, 0.88);
      }

      if (girl.x < -girl.w - 120) {
        girls.splice(i, 1);
      }
    }
  }

  function update(dt) {
    if (!state.running || state.paused) return;

    state.frame += dt;

    state.difficulty = Math.min(1, state.distance / difficultyConfig().missionTarget * 1.8);

    if (state.invulnerable > 0) state.invulnerable -= dt;
    if (player.slowmo > 0) player.slowmo -= dt;
    if (player.scoreBoost > 0) player.scoreBoost -= dt;

    if (state.obstacleWarningTimer > 0) {
      state.obstacleWarningTimer -= dt;
      if (state.obstacleWarningTimer <= 0) {
        ui.obstacleJumpWarning.classList.remove("show");
      }
    }
    if (state.roadEventTimer > 0) {
      state.roadEventTimer -= dt;
      if (state.roadEventTimer <= 0) ui.roadEvent.classList.remove("show");
    }

    state.weatherTimer -= dt;
    if (state.weather === "clear" && state.weatherTimer <= 0) {
      state.weather = "rain";
      state.rainTimer = 420 + Math.random() * 260;
      triggerRoadEvent("MONSOON RAIN");
    } else if (state.weather === "rain") {
      state.rainTimer -= dt;
      if (state.rainTimer <= 0) {
        state.weather = "clear";
        state.weatherTimer = 780 + Math.random() * 620;
        triggerRoadEvent("ROAD DRYING");
      }
    }
    state.enemyTimer -= dt;
    state.girlTimer -= dt;

    if (state.enemyWarningTimer > 0) {
      state.enemyWarningTimer -= dt;
    }
    state.score += worldSpeed() * 0.11 * dt * state.combo * scoreMultiplier();
    state.distance += worldSpeed() * 0.032 * dt;

    const cfg = difficultyConfig();
    state.speed = Math.min(
      cfg.maxSpeed,
      state.speed + (0.00052 + state.difficulty * 0.00020) * dt
    );

    state.bestCombo = Math.max(state.bestCombo, state.combo);

    if (state.comboTimer > 0) {
      state.comboTimer -= dt;
      if (state.comboTimer <= 0) {
        state.combo = 1;
        ui.comboBadge.classList.remove("show");
      }
    }

    player.runPhase += worldSpeed() * 0.08 * dt;

    if (player.shield > 0) player.shield -= dt;
    if (player.magnet > 0) player.magnet -= dt;

    player.vy += 0.98 * dt;
    player.y += player.vy * dt;

    if (player.y + player.h >= GROUND_Y) {
      player.y = GROUND_Y - player.h;
      player.vy = 0;

      if (!player.grounded) {
        spawnDust(player.x + player.w / 2, GROUND_Y - 4, 8);
      }

      player.grounded = true;
      player.jumps = 0;
    } else {
      player.grounded = false;
    }

    if (player.sliding) {
      player.slideTimer -= dt;
      if (player.slideTimer <= 0) stopSlide();
    }

    state.obstacleTimer -= dt;
    state.noteTimer -= dt;
    state.powerTimer -= dt;

    if (state.obstacleTimer <= 0) {
      const enemyBusy = enemies.some(e => ["aim", "recover"].includes(e.state));
      const girlBusy = girls.length > 0;

      if (!enemyBusy && !girlBusy) {
        spawnObstacle();
      } else {
        state.obstacleTimer = 70;
      }
    }
    if (state.noteTimer <= 0) spawnNotePattern();

    if (state.powerTimer <= 0) {
      if (girls.length === 0) {
        spawnPowerup();
      } else {
        state.powerTimer = 90;
      }
    }

    if (
      state.enemyTimer <= 0 &&
      enemies.length === 0 &&
      girls.length === 0
    ) {
      spawnEnemyShooter();
    }

    if (state.girlTimer <= 0) {
      spawnGirl();
    }

    updateBackground(dt);
    updateObstacles(dt);
    updateNotes(dt);
    updatePowerups(dt);
    updateGirls(dt);
    updateEnemies(dt);
    updateEnemyShots(dt);
    updateParticles(dt);

    if (state.flash > 0) state.flash -= dt;
    if (state.shake > 0) state.shake *= 0.86;

    updateHUD();
  }

  function updateBackground(dt) {
    clouds.forEach(c => {
      c.x -= c.speed * worldSpeed() * dt;
      if (c.x < -220) c.x = DESIGN_W + 180;
    });

    palms.forEach(p => {
      p.x -= worldSpeed() * (p.near ? 0.6 : 0.3) * dt;
      if (p.x < -180) p.x = DESIGN_W + 220 + Math.random() * 250;
    });

    roadLines.forEach(line => {
      line.x -= worldSpeed() * 2.4 * dt;
      if (line.x < -120) {
        line.x = Math.max(...roadLines.map(r => r.x)) + 125;
      }
    });
  }

  function updateObstacles(dt) {
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.x -= worldSpeed() * dt;

      if (!o.soundTriggered && o.sound && o.x < DESIGN_W * 0.84) {
        o.soundTriggered = true;
        playSfx(ui[o.sound], o.type === "bus" ? 0.88 : 0.62);
      }

      if (
        o.jumpWarning &&
        !o.warningTriggered &&
        o.x < player.x + 760 &&
        o.x > player.x + 260
      ) {
        o.warningTriggered = true;
        state.obstacleWarningTimer = 72;
        ui.obstacleJumpWarning.textContent =
          state.difficultyMode === "hard" ? "JUMP NOW!" : "DOUBLE JUMP!";
        ui.obstacleJumpWarning.classList.add("show");
      }

      if (!o.passed && o.x + o.w < player.x) {
        o.passed = true;
        state.score += 65 * state.combo;
        state.combo = Math.min(5, state.combo + 1);
        state.comboTimer = 130;
        ui.comboBadge.textContent = `COMBO x${state.combo}`;
        ui.comboBadge.classList.add("show");

        if (Math.random() > 0.5) {
          showMeme(memeLines[Math.floor(Math.random() * memeLines.length)]);
        }
      }

      if (rectHit(playerHitbox(), obstacleHitbox(o))) {
        if (state.invulnerable <= 0) {
          const ended = damagePlayer(
            o.type === "pothole" ? "POTHOLE YAKO!" : "ROAD HIT!",
            o.x + o.w / 2,
            o.y + o.h / 2
          );

          obstacles.splice(i, 1);
          if (ended) return;
          continue;
        }
      }

      if (o.x < -o.w - 80) obstacles.splice(i, 1);
    }
  }

  function updateNotes(dt) {
    for (let i = notes.length - 1; i >= 0; i--) {
      const n = notes[i];
      n.x -= worldSpeed() * dt;
      n.phase += 0.08 * dt;

      if (player.magnet > 0) {
        const dx = player.x + player.w / 2 - n.x;
        const dy = player.y + player.h / 2 - n.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 310) {
          n.x += dx * 0.085 * dt;
          n.y += dy * 0.085 * dt;
        }
      }

      if (rectHit(playerHitbox(), { x: n.x - n.w/2, y: n.y - n.h/2, w: n.w, h: n.h })) {
        state.notes += 1;
        state.score += 30 * state.combo;
        burst(n.x, n.y, 8, "#ffd84a");
        playSfx(ui.notePickupSfx, 0.52);
        notes.splice(i, 1);

        if (state.notes % 25 === 0 && state.health < state.maxHealth) {
          state.health++;
          showMeme("HEART BACK!");
          playSfx(ui.heartPickupSfx, 0.75);
        } else if (state.notes % 10 === 0) {
          showMeme(`LKR x${state.notes}!`);
        }
        continue;
      }

      if (n.x < -100) notes.splice(i, 1);
    }
  }

  function updatePowerups(dt) {
    for (let i = powerups.length - 1; i >= 0; i--) {
      const p = powerups[i];
      p.x -= worldSpeed() * dt;
      p.phase += 0.05 * dt;
      const y = p.y + Math.sin(p.phase) * 11;

      if (circleRectHit(p.x, y, p.r + 8, playerHitbox())) {
        let color = "#39e3f1";

        // Play picker.mp3 for every collected power-up.
        playSfx(ui.powerPickupSfx, 0.82);

        if (p.type === "shield") {
          player.shield = 560;
          showMeme("SHIELD ON!");
          color = "#39e3f1";
        } else if (p.type === "magnet") {
          player.magnet = 620;
          showMeme("NOTE MAGNET!");
          color = "#ffd84a";
        } else if (p.type === "slowmo") {
          player.slowmo = 460;
          showMeme("SLOW TIME!");
          triggerRoadEvent("TIME WARP");
          color = "#bb8cff";
        } else if (p.type === "heart") {
          state.health = Math.min(state.maxHealth, state.health + 1);
          showMeme("EXTRA HEART!");
          playSfx(ui.heartPickupSfx, 0.75);
          color = "#ff6674";
        } else if (p.type === "boost") {
          player.scoreBoost = 500;
          showMeme("2× SCORE!");
          color = "#4be7a5";
        }

        burst(p.x, y, 20, color);
        powerups.splice(i, 1);
        continue;
      }

      if (p.x < -80) powerups.splice(i, 1);
    }
  }


  function buildEnemyPattern(shots) {
    const pattern = [];
    let previous = "";

    for (let i = 0; i < shots; i++) {
      let type = Math.random() > 0.5 ? "high" : "low";

      if (i > 1 && pattern[i - 1] === pattern[i - 2]) {
        type = pattern[i - 1] === "high" ? "low" : "high";
      }

      if (type === previous && Math.random() > 0.68) {
        type = type === "high" ? "low" : "high";
      }

      pattern.push(type);
      previous = type;
    }

    return pattern;
  }

  function spawnEnemyShooter() {
    const cfg = difficultyConfig();
    const shots = cfg.enemyShotsBase + Math.floor(state.difficulty * cfg.enemyShotsBonus);
    const pattern = buildEnemyPattern(shots);

    enemies.push({
      x: DESIGN_W + 190,
      y: GROUND_Y - 176,
      w: 112,
      h: 176,
      targetX: DESIGN_W - 355,
      state: "enter",
      shotsLeft: shots,
      maxShots: shots,
      pattern,
      shotIndex: 0,
      aimType: null,
      aimTimer: 0,
      aimTotal: 0,
      recoverTimer: 0,
      exitTimer: 0,
      bob: Math.random() * Math.PI * 2
    });

    state.enemyWarningTimer = 120;
    showMeme("ENEMY INCOMING!");
    playSfx(ui.warningSfx, 0.72);
  }

  function startEnemyAim(enemy) {
    if (enemy.shotsLeft <= 0) {
      enemy.state = "reload-out";
      enemy.exitTimer = 0;
      return;
    }

    enemy.state = "aim";
    enemy.aimType = enemy.pattern[enemy.shotIndex];
    const cfg = difficultyConfig();
    enemy.aimTotal = Math.max(
      cfg.enemyAimMin,
      cfg.enemyAimBase - state.difficulty * 18
    );
    enemy.aimTimer = enemy.aimTotal;

    ui.dodgeHint.textContent =
      enemy.aimType === "high"
        ? "HIGH SHOT: SLIDE"
        : "LOW SHOT: JUMP";

    showMeme(
      enemy.aimType === "high"
        ? "SLIDE YAKO!"
        : "JUMP YAKO!"
    );

  }

  function fireEnemyShot(enemy) {
    const type = enemy.aimType;
    const shotY = type === "high"
      ? GROUND_Y - 126
      : GROUND_Y - 45;

    enemyShots.push({
      x: enemy.x - 14,
      y: shotY,
      w: 42,
      h: 10,
      speed: difficultyConfig().enemyShotSpeed + state.difficulty * 4,
      type,
      life: 150,
      nearMissChecked: false
    });

    enemy.shotsLeft--;
    enemy.shotIndex++;
    state.shake = Math.max(state.shake, 4);
    burst(enemy.x, shotY, 8, "#ff8a45");
    playSfx(ui.enemyFireSfx, 0.82);

    if (enemy.shotsLeft === 1) {
      showMeme("AMMO YAKO!");
      playSfx(ui.ammoYakoSfx, 0.88);
    }

    if (enemy.shotsLeft === 0) {
      setTimeout(() => {
        if (state.running && !state.gameOver) {
          showMeme("OUT!");
          playSfx(ui.ammoOutSfx, 0.9);
        }
      }, 180);
    }

    enemy.state = "recover";
    enemy.recoverTimer = Math.max(36, 58 - state.difficulty * 14);
  }

  function updateEnemies(dt) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.bob += 0.05 * dt;

      if (e.state === "enter") {
        e.x -= (11 + state.difficulty * 2) * timeScale() * dt;

        if (e.x <= e.targetX) {
          e.x = e.targetX;
          startEnemyAim(e);
        }
      } else if (e.state === "aim") {
        e.aimTimer -= dt;

        if (e.aimTimer <= 0) {
          fireEnemyShot(e);
        }
      } else if (e.state === "recover") {
        e.recoverTimer -= dt;

        if (e.recoverTimer <= 0) {
          startEnemyAim(e);
        }
      } else if (e.state === "reload-out") {
        e.exitTimer += dt;

        if (e.exitTimer > 82) {
          e.state = "exit";
        }
      } else if (e.state === "exit") {
        e.x += 15 * timeScale() * dt;

        if (e.x > DESIGN_W + 230) {
          enemies.splice(i, 1);
          const cfg = difficultyConfig();
          state.enemyTimer = Math.max(
            cfg.enemyReturnMin,
            cfg.enemyReturnMax - state.difficulty * 180 +
              Math.random() * (cfg.enemyReturnMax - cfg.enemyReturnMin)
          );
        }
      }
    }
  }

  function verticalGap(a, b) {
    if (a.y + a.h < b.y) return b.y - (a.y + a.h);
    if (b.y + b.h < a.y) return a.y - (b.y + b.h);
    return 0;
  }

  function updateEnemyShots(dt) {
    for (let i = enemyShots.length - 1; i >= 0; i--) {
      const shot = enemyShots[i];
      shot.x -= shot.speed * timeScale() * dt;
      shot.life -= dt;

      const shotBox = { x: shot.x, y: shot.y, w: shot.w, h: shot.h };
      const hitbox = playerHitbox();

      if (rectHit(hitbox, shotBox)) {
        if (state.invulnerable <= 0) {
          enemyShots.splice(i, 1);
          const ended = damagePlayer(
            shot.type === "high" ? "SLIDE YAKO!" : "JUMP YAKO!",
            shot.x,
            shot.y
          );
          if (ended) return;
          continue;
        }
      }

      if (!shot.nearMissChecked && shot.x + shot.w < player.x) {
        shot.nearMissChecked = true;
        const gap = verticalGap(hitbox, shotBox);

        if (gap < 58) {
          awardNearMiss();
        } else {
          state.score += 45 * state.combo;
        }
      }

      if (shot.x < -90 || shot.life <= 0) {
        enemyShots.splice(i, 1);
      }
    }
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.16 * dt;
      p.life -= dt;

      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function playerHitbox() {
    return {
      x: player.x + 14,
      y: player.y + 8,
      w: player.w - 28,
      h: player.h - 12
    };
  }

  function obstacleHitbox(o) {
    if (o.type === "pothole") {
      return {
        x: o.x + 14,
        y: GROUND_Y - 16,
        w: o.w - 28,
        h: 18
      };
    }

    if (o.type === "bus" || o.type === "lorry") {
      const collisionH = o.collisionH || 105;

      return {
        x: o.x + 34,
        y: GROUND_Y - collisionH,
        w: o.w - 68,
        h: collisionH
      };
    }

    return {
      x: o.x + o.inset,
      y: o.y + Math.min(o.inset, 18),
      w: o.w - o.inset * 2,
      h: o.h - Math.min(o.inset, 18)
    };
  }

  function rectHit(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  function circleRectHit(cx, cy, r, rect) {
    const x = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
    const y = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
    const dx = cx - x;
    const dy = cy - y;
    return dx * dx + dy * dy < r * r;
  }

  function draw() {
    const ratio = getScale();
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.translate(ratio.offsetX, ratio.offsetY);
    ctx.scale(ratio.scale, ratio.scale);

    const sx = state.shake > 0 ? (Math.random() - 0.5) * state.shake : 0;
    const sy = state.shake > 0 ? (Math.random() - 0.5) * state.shake * 0.5 : 0;
    ctx.translate(sx, sy);

    drawSky();
    drawMountains();
    drawVillage();
    drawPalms();
    drawRoad();
    drawNotes();
    drawPowerups();
    drawEnemyShots();
    drawObstacles();
    drawGirls();
    drawEnemies();
    drawPlayer();
    drawParticles();
    drawWeather();
    drawVignette();

    if (state.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(0.2, state.flash / 20)})`;
      ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);
    }

    ctx.restore();
  }

  function getScale() {
    const scale = Math.max(canvas.width / DESIGN_W, canvas.height / DESIGN_H);
    const drawW = DESIGN_W * scale;
    const drawH = DESIGN_H * scale;
    return {
      scale,
      offsetX: (canvas.width - drawW) / 2,
      offsetY: (canvas.height - drawH) / 2
    };
  }

  function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    g.addColorStop(0, "#0b2a35");
    g.addColorStop(0.48, "#28799a");
    g.addColorStop(1, "#ffb16f");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);

    const sunX = 1250;
    const sunY = 190;
    const sg = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 105);
    sg.addColorStop(0, "rgba(255,244,193,0.96)");
    sg.addColorStop(0.3, "rgba(255,206,105,0.5)");
    sg.addColorStop(1, "rgba(255,180,70,0)");
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 110, 0, Math.PI * 2);
    ctx.fill();

    clouds.forEach(drawCloud);
  }

  function drawCloud(c) {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.scale(c.scale, c.scale);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc(0, 18, 28, 0, Math.PI * 2);
    ctx.arc(30, 0, 35, 0, Math.PI * 2);
    ctx.arc(68, 15, 29, 0, Math.PI * 2);
    ctx.fillRect(0, 10, 68, 34);
    ctx.fill();
    ctx.restore();
  }

  function drawMountains() {
    ctx.fillStyle = "rgba(24,83,80,0.5)";
    ctx.beginPath();
    ctx.moveTo(0, 470);
    ctx.lineTo(180, 290);
    ctx.lineTo(335, 455);
    ctx.lineTo(515, 270);
    ctx.lineTo(700, 458);
    ctx.lineTo(875, 300);
    ctx.lineTo(1070, 455);
    ctx.lineTo(1290, 275);
    ctx.lineTo(1600, 455);
    ctx.lineTo(1600, 590);
    ctx.lineTo(0, 590);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(9,55,56,0.7)";
    ctx.beginPath();
    ctx.moveTo(0, 545);
    ctx.lineTo(150, 395);
    ctx.lineTo(340, 545);
    ctx.lineTo(555, 355);
    ctx.lineTo(750, 545);
    ctx.lineTo(930, 395);
    ctx.lineTo(1180, 545);
    ctx.lineTo(1390, 365);
    ctx.lineTo(1600, 545);
    ctx.lineTo(1600, 625);
    ctx.lineTo(0, 625);
    ctx.closePath();
    ctx.fill();
  }

  function drawVillage() {
    const offset = -(state.distance * 5.2) % 350;

    for (let i = -1; i < 7; i++) {
      const x = offset + i * 350;
      const y = 565;

      ctx.fillStyle = i % 2 ? "#b56d3d" : "#9c5b34";
      ctx.fillRect(x, y, 175, 92);

      ctx.fillStyle = i % 2 ? "#5d2d20" : "#74381f";
      ctx.beginPath();
      ctx.moveTo(x - 12, y);
      ctx.lineTo(x + 88, y - 62);
      ctx.lineTo(x + 187, y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(255,216,74,0.42)";
      ctx.fillRect(x + 34, y + 30, 34, 32);
      ctx.fillRect(x + 105, y + 28, 34, 34);
    }

    ctx.fillStyle = "rgba(22,100,72,0.88)";
    ctx.fillRect(0, 640, DESIGN_W, 85);
  }

  function drawPalms() {
    palms
      .slice()
      .sort((a, b) => Number(a.near) - Number(b.near))
      .forEach(drawPalm);
  }

  function drawPalm(p) {
    const s = p.scale * (p.near ? 1 : 0.72);
    const baseY = p.near ? 705 : 650;

    ctx.save();
    ctx.translate(p.x, baseY);
    ctx.scale(s, s);

    ctx.strokeStyle = p.near ? "#4b2e1f" : "rgba(63,65,40,0.75)";
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-20, -90, 8, -185);
    ctx.stroke();

    ctx.translate(8, -185);
    ctx.strokeStyle = p.near ? "#155239" : "rgba(21,82,57,0.68)";
    ctx.lineWidth = 10;

    for (let i = 0; i < 7; i++) {
      const a = Math.PI * 2 * i / 7;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(Math.cos(a) * 52, Math.sin(a) * 20, Math.cos(a) * 104, Math.sin(a) * 66);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawRoad() {
    ctx.fillStyle = "#2d3437";
    ctx.fillRect(0, GROUND_Y, DESIGN_W, DESIGN_H - GROUND_Y);

    ctx.fillStyle = "#171c1e";
    ctx.fillRect(0, GROUND_Y + 95, DESIGN_W, DESIGN_H - GROUND_Y - 95);

    ctx.fillStyle = "#82898a";
    ctx.fillRect(0, GROUND_Y - 10, DESIGN_W, 10);

    ctx.fillStyle = "#f1d34a";
    roadLines.forEach(line => {
      ctx.fillRect(line.x, GROUND_Y + 58, 78, 9);
    });
  }

  function drawPlayer() {
    ctx.save();

    if (state.invulnerable > 0 && Math.floor(state.invulnerable / 6) % 2 === 0) {
      ctx.globalAlpha = 0.35;
    }

    if (player.shield > 0) {
      const alpha = 0.24 + Math.sin(state.frame * 0.16) * 0.08;
      ctx.fillStyle = `rgba(57,227,241,${alpha})`;
      ctx.beginPath();
      ctx.ellipse(
        player.x + player.w / 2,
        player.y + player.h / 2,
        player.w * 0.9,
        player.h * 0.72,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    const bob = player.grounded && !player.sliding ? Math.sin(player.runPhase) * 4 : 0;
    ctx.translate(player.x, player.y + bob);

    if (images.character.complete) {
      ctx.drawImage(images.character, 0, 0, player.w, player.h);
    }

    ctx.restore();
  }


  function drawEnemies() {
    enemies.forEach(e => {
      if (e.state === "aim") {
        const shotY = e.aimType === "high"
          ? GROUND_Y - 126
          : GROUND_Y - 45;

        const progress = 1 - Math.max(0, e.aimTimer / e.aimTotal);
        ctx.save();

        ctx.strokeStyle = `rgba(255, 65, 80, ${0.25 + progress * 0.55})`;
        ctx.lineWidth = 2 + progress * 3;
        ctx.setLineDash([14, 10]);
        ctx.beginPath();
        ctx.moveTo(e.x, shotY + 5);
        ctx.lineTo(player.x - 28, shotY + 5);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.fillStyle = `rgba(255, 65, 80, ${0.12 + progress * 0.18})`;
        ctx.fillRect(player.x - 20, shotY - 9, 150, 28);

        ctx.restore();
      }

      ctx.save();
      const bob = Math.sin(e.bob) * 3;
      ctx.translate(e.x, e.y + bob);

      if (images.enemy && images.enemy.complete) {
        ctx.drawImage(images.enemy, 0, 0, e.w, e.h);
      }

      if (e.state === "aim") {
        const pulse = 0.32 + Math.sin(state.frame * 0.24) * 0.14;
        ctx.fillStyle = `rgba(255,90,103,${pulse})`;
        ctx.beginPath();
        ctx.arc(e.w * 0.16, e.h * 0.47, 30, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  function drawEnemyShots() {
    enemyShots.forEach(shot => {
      ctx.save();

      const glow = ctx.createLinearGradient(
        shot.x,
        shot.y,
        shot.x + shot.w,
        shot.y
      );

      glow.addColorStop(0, "#fff2a3");
      glow.addColorStop(0.42, "#ff9b42");
      glow.addColorStop(1, "#ff4f43");

      ctx.fillStyle = glow;
      ctx.shadowColor = "#ff6f3a";
      ctx.shadowBlur = 18;
      ctx.fillRect(shot.x, shot.y, shot.w, shot.h);

      ctx.restore();
    });
  }

  function drawGirls() {
    girls.forEach(girl => {
      ctx.save();

      const bob = Math.sin(girl.phase) * 3;
      ctx.translate(girl.x, girl.y + bob);

      if (
        images.girl &&
        images.girl.complete &&
        images.girl.naturalWidth > 0
      ) {
        ctx.drawImage(images.girl, 0, 0, girl.w, girl.h);
      } else {
        // Fallback if female_character.png is missing.
        ctx.fillStyle = "#ff6db5";
        ctx.fillRect(
          girl.w * 0.28,
          girl.h * 0.25,
          girl.w * 0.44,
          girl.h * 0.55
        );

        ctx.fillStyle = "#f0b78f";
        ctx.beginPath();
        ctx.arc(
          girl.w * 0.5,
          girl.h * 0.17,
          girl.w * 0.17,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      ctx.restore();
    });
  }

  function drawObstacles() {
    obstacles.forEach(o => {
      if (o.type === "sign") {
        drawSign(o);
        return;
      }

      if (o.type === "pothole") {
        drawPothole(o);
        return;
      }

      const img = images[o.img];
      if (img && img.complete) {
        ctx.drawImage(img, o.x, o.y, o.w, o.h);
      }
    });
  }


  function drawPothole(o) {
    ctx.save();
    ctx.translate(o.x, o.y);

    const g = ctx.createRadialGradient(
      o.w * 0.5, o.h * 0.4, 3,
      o.w * 0.5, o.h * 0.4, o.w * 0.55
    );

    g.addColorStop(0, "#050708");
    g.addColorStop(0.58, "#171c1e");
    g.addColorStop(1, "rgba(40,45,47,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(o.w * 0.5, o.h * 0.5, o.w * 0.5, o.h * 0.46, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(135,140,140,0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(8, o.h * 0.52);
    ctx.quadraticCurveTo(o.w * 0.24, 2, o.w * 0.42, o.h * 0.42);
    ctx.quadraticCurveTo(o.w * 0.7, o.h * 0.86, o.w - 5, o.h * 0.4);
    ctx.stroke();

    ctx.restore();
  }

  function drawSign(o) {
    ctx.save();
    ctx.translate(o.x, o.y);

    ctx.fillStyle = "#5b6264";
    ctx.fillRect(o.w/2 - 6, 70, 12, 100);

    ctx.fillStyle = "#ffd84a";
    roundRect(ctx, 0, 0, o.w, 72, 10, true);

    ctx.fillStyle = "#17272c";
    ctx.font = "900 18px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("LOW", o.w/2, 29);
    ctx.fillText("BRIDGE", o.w/2, 53);

    ctx.restore();
  }

  function drawNotes() {
    notes.forEach(n => {
      ctx.save();
      ctx.translate(n.x, n.y);
      const scaleX = Math.max(0.28, Math.abs(Math.cos(n.phase)));
      ctx.scale(scaleX, 1);

      if (images.note.complete) {
        ctx.drawImage(images.note, -n.w/2, -n.h/2, n.w, n.h);
      }

      ctx.restore();
    });
  }

  function drawPowerups() {
    const styles = {
      shield: {
        color: "#39e3f1",
        glow: "rgba(57,227,241,0.28)",
        image: "powerShield",
        fallback: "S"
      },
      magnet: {
        color: "#ffd84a",
        glow: "rgba(255,216,74,0.28)",
        image: "powerMagnet",
        fallback: "M"
      },
      slowmo: {
        color: "#bb8cff",
        glow: "rgba(187,140,255,0.28)",
        image: "powerSlowmo",
        fallback: "T"
      },
      heart: {
        color: "#ff6674",
        glow: "rgba(255,102,116,0.28)",
        image: "powerHeart",
        fallback: "♥"
      },
      boost: {
        color: "#4be7a5",
        glow: "rgba(75,231,165,0.28)",
        image: "powerBoost",
        fallback: "2×"
      }
    };

    powerups.forEach(p => {
      const y = p.y + Math.sin(p.phase) * 11;
      const style = styles[p.type] || styles.shield;
      const icon = images[style.image];

      ctx.save();
      ctx.translate(p.x, y);

      // Soft outer glow.
      ctx.fillStyle = style.glow;
      ctx.beginPath();
      ctx.arc(0, 0, p.r + 18, 0, Math.PI * 2);
      ctx.fill();

      // Bright outer ring.
      ctx.fillStyle = style.color;
      ctx.shadowColor = style.color;
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.arc(0, 0, p.r + 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;

      // Dark center for better icon contrast.
      ctx.fillStyle = "rgba(5,15,20,0.88)";
      ctx.beginPath();
      ctx.arc(0, 0, p.r - 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw internet icon when loaded.
      if (icon && icon.complete && icon.naturalWidth > 0) {
        const iconSize = p.r * 1.42;
        ctx.drawImage(
          icon,
          -iconSize / 2,
          -iconSize / 2,
          iconSize,
          iconSize
        );
      } else {
        // Offline or failed request fallback.
        ctx.fillStyle = style.color;
        ctx.font = p.type === "boost"
          ? "900 18px system-ui"
          : "900 25px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(style.fallback, 0, 1);
      }

      // Animated dashed ring.
      ctx.save();
      ctx.rotate(state.frame * 0.015);
      ctx.strokeStyle = style.color;
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, p.r + 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  }


  function drawWeather() {
    if (state.weather !== "rain") return;

    ctx.save();

    const alpha = 0.28 + Math.sin(state.frame * 0.02) * 0.04;
    ctx.strokeStyle = `rgba(185, 235, 255, ${alpha})`;
    ctx.lineWidth = 2;

    for (let i = 0; i < 85; i++) {
      const x = (i * 79 + state.frame * 17) % (DESIGN_W + 180) - 90;
      const y = (i * 137 + state.frame * 28) % (DESIGN_H + 120) - 60;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 11, y + 34);
      ctx.stroke();
    }

    const roadGlow = ctx.createLinearGradient(0, GROUND_Y, 0, DESIGN_H);
    roadGlow.addColorStop(0, "rgba(100, 190, 220, 0.10)");
    roadGlow.addColorStop(1, "rgba(80, 150, 190, 0.03)");
    ctx.fillStyle = roadGlow;
    ctx.fillRect(0, GROUND_Y, DESIGN_W, DESIGN_H - GROUND_Y);

    ctx.restore();
  }

  function drawVignette() {
    const g = ctx.createRadialGradient(
      DESIGN_W/2, DESIGN_H/2, 220,
      DESIGN_W/2, DESIGN_H/2, 1050
    );

    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.44)");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);
  }

  function spawnDust(x, y, count) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 42,
        y,
        vx: -2 - Math.random() * 4,
        vy: -1 - Math.random() * 2.4,
        size: 4 + Math.random() * 7,
        color: "rgba(204,184,145,0.82)",
        life: 28 + Math.random() * 22,
        maxLife: 50
      });
    }
  }

  function burst(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 5,
        color,
        life: 26 + Math.random() * 32,
        maxLife: 58
      });
    }
  }

  let memeTimeout = null;

  function showMeme(text) {
    ui.memePopup.textContent = text;
    ui.memePopup.classList.add("show");

    clearTimeout(memeTimeout);
    memeTimeout = setTimeout(() => {
      ui.memePopup.classList.remove("show");
    }, 760);
  }

  function updateHUD() {
    ui.score.textContent = Math.floor(state.score).toString().padStart(6, "0");
    ui.notes.textContent = String(state.notes);
    ui.distance.textContent = String(Math.floor(state.distance));
    ui.speed.textContent = String(Math.round(worldSpeed() * 6.2));
    ui.modeText.textContent = difficultyConfig().label;

    const fullHearts = "♥ ".repeat(Math.max(0, state.health)).trim();
    const emptyHearts = "♡ ".repeat(Math.max(0, state.maxHealth - state.health)).trim();
    ui.healthHearts.textContent = [fullHearts, emptyHearts].filter(Boolean).join(" ");

    const missionProgress = Math.min(100, state.distance / state.missionTarget * 100);
    ui.missionProgress.style.width = `${missionProgress}%`;

    if (state.distance >= state.missionTarget) {
      ui.missionText.textContent = "Mission complete!";
    } else {
      ui.missionText.textContent = `Reach ${state.missionTarget} m`;
    }

    const activePower =
      player.shield > 0
        ? { name: "SHIELD", type: "shield", fallback: "S", value: player.shield, max: 560 }
        : player.slowmo > 0
        ? { name: "SLOW TIME", type: "slowmo", fallback: "T", value: player.slowmo, max: 460 }
        : player.magnet > 0
        ? { name: "NOTE MAGNET", type: "magnet", fallback: "M", value: player.magnet, max: 620 }
        : player.scoreBoost > 0
        ? { name: "2× SCORE", type: "boost", fallback: "2×", value: player.scoreBoost, max: 500 }
        : null;

    if (activePower) {
      ui.powerBar.classList.remove("hidden");
      ui.powerName.textContent = activePower.name;

      if (ui.powerIcon) {
        const iconUrl = POWERUP_ICON_URLS[activePower.type];

        if (ui.powerIcon.dataset.iconUrl !== iconUrl) {
          ui.powerIcon.textContent = "";
          ui.powerIcon.dataset.iconUrl = iconUrl;

          const iconImg = document.createElement("img");
          iconImg.src = iconUrl;
          iconImg.alt = activePower.name;
          iconImg.width = 24;
          iconImg.height = 24;
          iconImg.style.display = "block";
          iconImg.style.objectFit = "contain";

          iconImg.addEventListener("error", () => {
            ui.powerIcon.textContent = activePower.fallback;
          }, { once: true });

          ui.powerIcon.appendChild(iconImg);
        }
      }

      ui.powerFill.style.width = `${Math.max(0, activePower.value / activePower.max * 100)}%`;
    } else {
      ui.powerBar.classList.add("hidden");

      if (ui.powerIcon) {
        ui.powerIcon.textContent = "";
        delete ui.powerIcon.dataset.iconUrl;
      }
    }

    const enemy = enemies[0] || null;
    ui.enemyPanel.classList.toggle("hidden", !enemy);

    if (enemy) {
      const labels = {
        enter: "APPROACHING",
        aim: "AIMING",
        recover: "RECOVERING",
        "reload-out": "AMMO OUT",
        exit: "LEAVING"
      };

      ui.enemyStateText.textContent = labels[enemy.state] || "DANGER";
      ui.enemyAmmoText.textContent = `${enemy.shotsLeft} SHOT${enemy.shotsLeft === 1 ? "" : "S"}`;

      if (enemy.state === "aim") {
        const progress = 1 - Math.max(0, enemy.aimTimer / enemy.aimTotal);
        ui.dangerFill.style.width = `${progress * 100}%`;
        ui.dodgeHint.textContent =
          enemy.aimType === "high"
            ? "HIGH SHOT: SLIDE NOW"
            : "LOW SHOT: JUMP NOW";
      } else {
        ui.dangerFill.style.width = "0%";
        ui.dodgeHint.textContent = "WATCH THE AIM LINE";
      }
    }

    ui.enemyWarning.classList.toggle(
      "show",
      !!enemy && ["aim", "recover"].includes(enemy.state)
    );
    if (ui.hudComboText) {
      ui.hudComboText.textContent = `x${state.combo.toFixed(1)} COMBO`;
    }

    if (ui.menuBestScore) {
      ui.menuBestScore.textContent = state.best.toString().padStart(6, "0");
    }

    if (ui.healthDots) {
      const dots = [...ui.healthDots.querySelectorAll("i")];
      dots.forEach((dot, index) => {
        dot.classList.toggle("empty", index >= state.health);
      });
    }

    if (ui.powerTimeText) {
      let seconds = 0;

      if (player.shield > 0) seconds = player.shield / 60;
      else if (player.slowmo > 0) seconds = player.slowmo / 60;
      else if (player.magnet > 0) seconds = player.magnet / 60;
      else if (player.scoreBoost > 0) seconds = player.scoreBoost / 60;

      ui.powerTimeText.textContent = `${seconds.toFixed(1)}s`;
    }

    const activeEnemy = enemies[0] || null;

    if (ui.enemyAmmoSegments) {
      const segments = [...ui.enemyAmmoSegments.querySelectorAll("i")];
      const shotsLeft = activeEnemy ? activeEnemy.shotsLeft : 0;

      segments.forEach((segment, index) => {
        segment.classList.toggle("empty", index >= shotsLeft);
      });
    }
  }

  function roundRect(context, x, y, w, h, r, fill = false) {
    const radius = Math.min(r, w / 2, h / 2);
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + w, y, x + w, y + h, radius);
    context.arcTo(x + w, y + h, x, y + h, radius);
    context.arcTo(x, y + h, x, y, radius);
    context.arcTo(x, y, x + w, y, radius);
    context.closePath();
    if (fill) context.fill();
  }


  function isTouchMobile() {
    return (
      window.matchMedia("(pointer: coarse)").matches ||
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    );
  }

  function isPortraitMobile() {
    return isTouchMobile() && window.innerHeight > window.innerWidth;
  }

  function syncOrientationState() {
    const portrait = isPortraitMobile();

    if (ui.rotateScreen) {
      ui.rotateScreen.setAttribute("aria-hidden", portrait ? "false" : "true");
    }

    if (portrait && state.running && !state.paused) {
      togglePause();
    }

    document.body.classList.toggle(
      "mobile-landscape-game",
      isTouchMobile() && !portrait
    );
  }

  async function tryMobileFullscreen() {
    if (!isTouchMobile() || isPortraitMobile()) return;

    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (_) {
      // Browser may not support fullscreen. Gameplay still continues.
    }
  }

  async function startGameFromMenu() {
    await tryMobileFullscreen();
    resetGame();
  }

  function resizeCanvas() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (_) {}
  }

  function toggleMusic() {
    state.musicOn = !state.musicOn;
    ui.musicBtn.textContent = state.musicOn ? "🔊" : "🔇";

    if (state.musicOn && state.running && !state.paused) {
      ui.bgMusic.play().catch(() => {});
    } else {
      ui.bgMusic.pause();
    }
  }

  let lastTime = performance.now();

  function loop(now) {
    const dt = Math.min(1.8, (now - lastTime) / 16.6667);
    lastTime = now;

    update(dt);
    draw();

    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    syncOrientationState();
  });

  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      resizeCanvas();
      syncOrientationState();
    }, 180);
  });

  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if ([" ", "arrowup", "w"].includes(key)) {
      e.preventDefault();
      jump();
    }

    if (["arrowdown", "s"].includes(key)) {
      e.preventDefault();
      startSlide();
    }

    if (key === "p") togglePause();
    if (key === "m") toggleMusic();
  });

  window.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    if (["arrowdown", "s"].includes(key)) stopSlide();
  });

  canvas.addEventListener("pointerdown", (e) => {
    if (!state.running || state.paused) return;

    if (e.clientX < window.innerWidth * 0.55) {
      jump();
    } else {
      startSlide();
    }
  });

  canvas.addEventListener("pointerup", stopSlide);
  canvas.addEventListener("pointercancel", stopSlide);

  ui.jumpBtn.addEventListener("pointerdown", jump);
  ui.slideBtn.addEventListener("pointerdown", startSlide);
  ui.slideBtn.addEventListener("pointerup", stopSlide);
  ui.slideBtn.addEventListener("pointercancel", stopSlide);

  document.querySelectorAll(".difficulty-card").forEach(button => {
    button.addEventListener("click", () => selectDifficulty(button.dataset.difficulty));
  });

  selectDifficulty(state.difficultyMode);
  refreshDifficultyUI();


  if (ui.difficultyBtn) ui.difficultyBtn.addEventListener("click", showDifficultyScreen);
  if (ui.backFromDifficultyBtn) ui.backFromDifficultyBtn.addEventListener("click", closeDifficultyScreen);

  if (ui.startSelectedModeBtn) {
    ui.startSelectedModeBtn.addEventListener("click", async () => {
      if (typeof tryMobileFullscreen === "function") {
        await tryMobileFullscreen();
      }
      resetGame();
    });
  }

  const headphoneWarning = document.getElementById("headphoneWarning");
const headphoneOkBtn = document.getElementById("headphoneOkBtn");
const startScreen = document.getElementById("startScreen");

headphoneOkBtn.addEventListener("click", () => {

  headphoneWarning.classList.add("hidden");

  if (startScreen) {
    startScreen.classList.remove("hidden");
  }

});

  if (ui.pauseHomeBtn) ui.pauseHomeBtn.addEventListener("click", goHomeFromPause);
  if (ui.pauseMusicBtn) ui.pauseMusicBtn.addEventListener("click", toggleMusic);
  if (ui.pauseSfxBtn) ui.pauseSfxBtn.addEventListener("click", toggleSfx);

  ui.startBtn.addEventListener("click", startGameFromMenu);
  ui.creditsBtn.addEventListener("click", showCredits);
  ui.closeCreditsBtn.addEventListener("click", closeCredits);
  ui.restartBtn.addEventListener("click", resetGame);
  ui.restartFromPauseBtn.addEventListener("click", resetGame);
  ui.resumeBtn.addEventListener("click", togglePause);
  ui.pauseBtn.addEventListener("click", togglePause);
  ui.homeBtn.addEventListener("click", goHome);
  ui.fullscreenBtn.addEventListener("click", toggleFullscreen);
  ui.musicBtn.addEventListener("click", toggleMusic);

  window.addEventListener("blur", () => {
    if (state.running && !state.paused) togglePause();
  });

  resizeCanvas();
  syncOrientationState();
  initWorld();
  updateHUD();
  requestAnimationFrame(loop);
})();
