import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

/* ---------- Layout ---------- */
const DINO_X = 40;
const DINO_WIDTH = 42;
const DINO_HEIGHT = 45;
const GROUND_INSET = 14;

/* ---------- Feel ---------- */
const GRAVITY = 1450;
const JUMP_FORCE = -410;
const FAST_FALL = 2.4; // gravity multiplier while holding Arrow Down in the air
const JUMP_BUFFER = 0.12; // seconds: a jump pressed just before landing still counts
const COYOTE_TIME = 0.08; // seconds: a jump just after leaving the ground still counts

/* ---------- Difficulty ---------- */
const START_SPEED = 230;
const MAX_SPEED = 440;
const SPEED_PER_POINT = 0.2;

const CACTUS_WIDTH = 18;
const CACTUS_SPACING = 20;

const HI_KEY = "portfolio-dino-hi";

/*
  Tint the sprites with the theme colors so they stay readable in light and
  dark mode. Works best when the sprites are single-color silhouettes with a
  transparent background. Set to false to draw the sprites as they are.
*/
const TINT_SPRITES = true;

const PALETTE = {
  light: {
    ground: "#C4C4CA",
    detail: "#D6D6DB",
    dino: "#3F3F46",
    cactus: "#6B6B73",
    text: "#8A8A91",
  },
  dark: {
    ground: "#3A3A41",
    detail: "#2C2C32",
    dino: "#C9C9D0",
    cactus: "#8F8F98",
    text: "#8E8E96",
  },
};

const GROUND_SPACING = 83;
const GROUND_JITTER = [0, 23, 9, 41, 17, 33, 5, 29];

const loadHighScore = () => {
  try {
    return Number(window.localStorage.getItem(HI_KEY)) || 0;
  } catch {
    return 0;
  }
};

const saveHighScore = (value) => {
  try {
    window.localStorage.setItem(HI_KEY, String(value));
  } catch {
    /* storage unavailable: ignore */
  }
};

const isEditable = (target) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/* Follows the portfolio's class-based dark mode */
function useIsDark() {
  const get = () =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const [isDark, setIsDark] = useState(get);

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(get()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

/* Recolors a sprite using its alpha channel */
function tintSprite(image, color) {
  const buffer = document.createElement("canvas");
  buffer.width = image.naturalWidth;
  buffer.height = image.naturalHeight;
  const bufferCtx = buffer.getContext("2d");
  bufferCtx.drawImage(image, 0, 0);
  bufferCtx.globalCompositeOperation = "source-in";
  bufferCtx.fillStyle = color;
  bufferCtx.fillRect(0, 0, buffer.width, buffer.height);
  return buffer;
}

const actionButton =
  "group inline-flex items-center gap-1.5 rounded-sm py-1 text-xs font-medium " +
  "text-muted transition-colors hover:text-ink " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current " +
  "dark:text-muted-dark dark:hover:text-ink-dark";

const metaText =
  "font-mono text-[10px] tracking-wide text-muted dark:text-muted-dark";

export default function DinoGame() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const playRef = useRef(null);
  const engineRef = useRef(null);
  const modeRef = useRef("idle");
  const hiRef = useRef(0);
  const hintSeenRef = useRef(false);
  const hintTimerRef = useRef(null);

  const isDark = useIsDark();
  const isDarkRef = useRef(isDark);

  const [mode, setMode] = useState("idle"); // idle | running | paused | over
  const [finalScore, setFinalScore] = useState(0);
  const [hiScore, setHiScore] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCoarse] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
  );

  const changeMode = useCallback((next) => {
    modeRef.current = next;
    setMode(next);
  }, []);

  /* Redraw when the theme changes */
  useEffect(() => {
    isDarkRef.current = isDark;
    engineRef.current?.invalidate();
  }, [isDark]);

  /* Load the saved best score */
  useEffect(() => {
    const saved = loadHighScore();
    hiRef.current = saved;
    setHiScore(saved);
  }, []);

  /* Keyboard users land on the button after a game ends */
  useEffect(() => {
    if (mode === "over") {
      playRef.current?.focus({ preventScroll: true });
    }
  }, [mode]);

  useEffect(
    () => () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    },
    [],
  );

  /* ---------- Game engine ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !wrapper || !ctx) return;

    const images = { dino: new Image(), cactus: new Image() };
    const tintCache = new Map();

    let width = 0;
    let height = 120;
    let animationId = null;
    let lastTime = 0;
    let drawQueued = false;

    const game = {
      dinoY: 0,
      velocity: 0,
      obstacles: [],
      score: 0,
      speed: START_SPEED,
      spawnDistance: 0,
      groundScroll: 0,
      time: 0,
      jumpBuffer: 0,
      coyote: 0,
      fastFall: false,
      milestone: 0,
      flashUntil: 0,
    };

    const groundY = () => height - GROUND_INSET;
    const floorY = () => groundY() - DINO_HEIGHT;

    const getSprite = (kind, color) => {
      const image = images[kind];
      if (!image.complete || !image.naturalWidth) return null;
      if (!TINT_SPRITES) return image;

      const key = `${kind}:${color}`;
      if (!tintCache.has(key)) tintCache.set(key, tintSprite(image, color));
      return tintCache.get(key);
    };

    /* ----- Drawing ----- */
    const draw = () => {
      const palette = isDarkRef.current ? PALETTE.dark : PALETTE.light;
      const mode = modeRef.current;
      const ground = groundY();

      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = false;

      // Ground line
      ctx.strokeStyle = palette.ground;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, ground + 0.5);
      ctx.lineTo(width, ground + 0.5);
      ctx.stroke();

      // Ground texture that scrolls with the world
      ctx.fillStyle = palette.detail;
      const first = Math.floor(game.groundScroll / GROUND_SPACING);
      for (let n = first; n * GROUND_SPACING - game.groundScroll < width; n++) {
        const x =
          n * GROUND_SPACING -
          game.groundScroll +
          GROUND_JITTER[((n % 8) + 8) % 8];
        ctx.fillRect(Math.round(x), ground + 5 + (((n % 3) + 3) % 3) * 2, 3, 1);
      }

      // Cacti
      const cactusSprite = getSprite("cactus", palette.cactus);
      game.obstacles.forEach((obstacle) => {
        for (let i = 0; i < obstacle.count; i++) {
          const x = Math.round(obstacle.x + i * CACTUS_SPACING);
          const y = ground - obstacle.height;
          if (cactusSprite) {
            ctx.drawImage(cactusSprite, x, y, CACTUS_WIDTH, obstacle.height);
          } else {
            ctx.fillStyle = palette.cactus;
            ctx.fillRect(x, y, CACTUS_WIDTH, obstacle.height);
          }
        }
      });

      // Dino: a tiny bob while running, dimmed after a crash
      const onGround = game.dinoY >= floorY() - 0.5;
      const bob =
        mode === "running" && onGround ? Math.floor(game.time * 12) % 2 : 0;
      const dinoSprite = getSprite("dino", palette.dino);

      ctx.globalAlpha = mode === "over" ? 0.5 : 1;
      if (dinoSprite) {
        ctx.drawImage(
          dinoSprite,
          DINO_X,
          Math.round(game.dinoY) + bob,
          DINO_WIDTH,
          DINO_HEIGHT,
        );
      } else {
        ctx.fillStyle = palette.dino;
        ctx.fillRect(DINO_X, Math.round(game.dinoY), DINO_WIDTH, DINO_HEIGHT);
      }
      ctx.globalAlpha = 1;

      // Score (best on the left, current on the right; blinks every 100)
      if (mode === "running" || mode === "paused") {
        const now = performance.now();
        const blink = now < game.flashUntil && Math.floor(now / 120) % 2 === 0;
        const pad = width < 640 ? 16 : 40;

        ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = "right";
        ctx.fillStyle = palette.text;

        if (!blink) {
          ctx.fillText(
            String(Math.floor(game.score)).padStart(5, "0"),
            width - pad,
            16,
          );
        }
        if (hiRef.current > 0) {
          ctx.fillText(
            `HI ${String(hiRef.current).padStart(5, "0")}`,
            width - pad - 46,
            16,
          );
        }
      }
    };

    /* While idle, paused or over, draw only when something changes */
    const invalidate = () => {
      if (animationId !== null || drawQueued) return;
      drawQueued = true;
      requestAnimationFrame(() => {
        drawQueued = false;
        draw();
      });
    };

    /* ----- Simulation ----- */
    const reset = () => {
      game.dinoY = floorY();
      game.velocity = 0;
      game.obstacles = [];
      game.score = 0;
      game.speed = START_SPEED;
      game.spawnDistance = 0;
      game.groundScroll = 0;
      game.time = 0;
      game.jumpBuffer = 0;
      game.coyote = 0;
      game.fastFall = false;
      game.milestone = 0;
      game.flashUntil = 0;
    };

    const spawnObstacle = () => {
      const maxCount = game.score < 100 ? 1 : game.score < 300 ? 2 : 3;
      const count = 1 + Math.floor(Math.random() * maxCount);
      const clusterWidth = CACTUS_WIDTH + (count - 1) * CACTUS_SPACING;

      game.obstacles.push({
        x: width + 12,
        count,
        width: clusterWidth,
        height: 30 + Math.random() * 8,
      });

      // Gaps are measured in time, so they stay fair as the game speeds up
      game.spawnDistance =
        clusterWidth + game.speed * (0.95 + Math.random() * 0.75);
    };

    const endGame = () => {
      const score = Math.floor(game.score);
      const best = score > hiRef.current;

      if (best) {
        hiRef.current = score;
        saveHighScore(score);
        setHiScore(score);
      }

      setFinalScore(score);
      setIsNewBest(best && score > 0);
      changeMode("over");
      syncLoop();
      invalidate();
    };

    const update = (delta) => {
      const dt = Math.min(delta, 0.025);
      const ground = groundY();
      const floor = floorY();

      game.time += dt;
      game.score += dt * 10;
      game.speed = Math.min(
        START_SPEED + game.score * SPEED_PER_POINT,
        MAX_SPEED,
      );
      game.groundScroll += game.speed * dt;

      const milestone = Math.floor(game.score / 100);
      if (milestone > game.milestone) {
        game.milestone = milestone;
        game.flashUntil = performance.now() + 700;
      }

      // Jump with buffering and coyote time
      const onGround = game.dinoY >= floor - 0.5;
      game.coyote = onGround ? COYOTE_TIME : Math.max(0, game.coyote - dt);
      game.jumpBuffer = Math.max(0, game.jumpBuffer - dt);

      if (game.jumpBuffer > 0 && game.coyote > 0) {
        game.velocity = JUMP_FORCE;
        game.jumpBuffer = 0;
        game.coyote = 0;
      }

      const gravity =
        game.fastFall && game.velocity > 0 ? GRAVITY * FAST_FALL : GRAVITY;
      game.velocity += gravity * dt;
      game.dinoY += game.velocity * dt;

      if (game.dinoY >= floor) {
        game.dinoY = floor;
        game.velocity = 0;
      }

      // Obstacles
      game.spawnDistance -= game.speed * dt;
      if (game.spawnDistance <= 0) spawnObstacle();

      game.obstacles.forEach((obstacle) => {
        obstacle.x -= game.speed * dt;
      });
      game.obstacles = game.obstacles.filter(
        (obstacle) => obstacle.x + obstacle.width > 0,
      );

      // Collisions (slightly forgiving hitboxes)
      const dino = {
        left: DINO_X + 5,
        right: DINO_X + DINO_WIDTH - 5,
        top: game.dinoY + 5,
        bottom: game.dinoY + DINO_HEIGHT,
      };

      for (const obstacle of game.obstacles) {
        const cactus = {
          left: obstacle.x + 2,
          right: obstacle.x + obstacle.width - 2,
          top: ground - obstacle.height + 3,
          bottom: ground,
        };

        if (
          dino.right > cactus.left &&
          dino.left < cactus.right &&
          dino.bottom > cactus.top &&
          dino.top < cactus.bottom
        ) {
          endGame();
          return;
        }
      }
    };

    /* ----- Loop: only runs while a game is actually in progress ----- */
    const loop = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      if (modeRef.current === "running") update(delta);
      draw();

      animationId =
        modeRef.current === "running" ? requestAnimationFrame(loop) : null;
    };

    function syncLoop() {
      const shouldRun = modeRef.current === "running" && !document.hidden;

      if (shouldRun && animationId === null) {
        lastTime = 0;
        animationId = requestAnimationFrame(loop);
      } else if (!shouldRun && animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    /* ----- Controls ----- */
    const start = () => {
      if (modeRef.current === "running") return;
      reset();
      game.jumpBuffer = JUMP_BUFFER; // first press also jumps
      changeMode("running");
      syncLoop();
    };

    const resume = () => {
      if (modeRef.current !== "paused") return;
      changeMode("running");
      syncLoop();
    };

    const pause = () => {
      if (modeRef.current !== "running") return;
      changeMode("paused");
      syncLoop();
      invalidate();
    };

    const press = () => {
      if (modeRef.current === "running") game.jumpBuffer = JUMP_BUFFER;
    };

    const handleKeyDown = (event) => {
      if (modeRef.current !== "running") return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isEditable(event.target)) return;

      if (event.key === " " || event.key === "ArrowUp") {
        event.preventDefault();
        if (!event.repeat) press();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        game.fastFall = true;
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "ArrowDown") game.fastFall = false;
    };

    engineRef.current = { start, resume, pause, press, invalidate };

    /* ----- Sizing ----- */
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (modeRef.current !== "running") game.dinoY = floorY();
      invalidate();
    };

    /* ----- Auto-pause when the game can't be seen ----- */
    const handleVisibility = () => {
      if (document.hidden) pause();
      syncLoop();
    };

    const intersection = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) pause();
      },
      { threshold: 0.3 },
    );

    const resizeObserver = new ResizeObserver(resize);

    images.dino.onload = invalidate;
    images.cactus.onload = invalidate;
    images.dino.src = "/images/dino-sprite.png";
    images.cactus.src = "/images/cactus-sprite.png";

    resizeObserver.observe(wrapper);
    intersection.observe(wrapper);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("visibilitychange", handleVisibility);

    resize();

    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("visibilitychange", handleVisibility);
      engineRef.current = null;
    };
  }, [changeMode]);

  /* ---------- UI handlers ---------- */
  const handleStart = () => {
    engineRef.current?.start();

    // Show the controls hint once per visit
    if (!hintSeenRef.current) {
      hintSeenRef.current = true;
      setShowHint(true);
      hintTimerRef.current = setTimeout(() => setShowHint(false), 3200);
    }
  };

  const handleResume = () => engineRef.current?.resume();

  const handlePointerDown = () => engineRef.current?.press();

  const buttonLabel =
    mode === "over" ? "Play again" : mode === "paused" ? "Resume" : "Play Dino";

  return (
    <div
      ref={wrapperRef}
      role="group"
      aria-label="Dino runner game"
      onPointerDown={handlePointerDown}
      className="relative h-[112px] w-full touch-manipulation select-none overflow-hidden sm:h-[120px]"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="block h-full w-full [image-rendering:pixelated]"
      />

      {/* Actions and results, shown whenever a game isn't running */}
      {mode !== "running" && (
        <div className="absolute z-10 flex items-center gap-4 right-4 top-3 sm:right-10">
          {mode === "paused" && <span className={metaText}>Paused</span>}

          {mode === "over" && (
            <span className={metaText}>
              {isNewBest
                ? `New best ${finalScore}`
                : `Score ${finalScore}${hiScore > 0 ? ` · Best ${hiScore}` : ""}`}
            </span>
          )}

          <button
            ref={playRef}
            type="button"
            onClick={mode === "paused" ? handleResume : handleStart}
            className={actionButton}
          >
            {mode === "over" ? (
              <RotateCcw
                size={13}
                strokeWidth={1.8}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:-rotate-90"
              />
            ) : (
              <Play
                size={12}
                strokeWidth={1.8}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            )}
            {buttonLabel}
          </button>
        </div>
      )}

      {/* Controls hint: fades out a few seconds into the first run */}
      {mode === "running" && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 transition-opacity duration-500 ${metaText} ${
            showHint ? "opacity-100" : "opacity-0"
          }`}
        >
          {isCoarse ? "Tap to jump" : "Space / ↑ to jump"}
        </span>
      )}

      <span className="sr-only" aria-live="polite">
        {mode === "idle"
          ? "Select Play Dino to start."
          : mode === "paused"
            ? "Game paused."
            : mode === "over"
              ? `Game over. Final score ${finalScore}.`
              : "Game running."}
      </span>
    </div>
  );
}
