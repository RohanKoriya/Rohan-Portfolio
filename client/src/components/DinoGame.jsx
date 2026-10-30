import { useCallback, useEffect, useRef, useState } from "react";

const GAME_HEIGHT = 120;
const GAME_PADDING = 40;
const DINO_X = GAME_PADDING;
const DINO_WIDTH = 42;
const DINO_HEIGHT = 45;

const GRAVITY = 1450;
const JUMP_FORCE = -410;

const COLORS = {
  ground: "#777777",
  detail: "#777777",
  text: "#929292",
};

export default function DinoGame() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const modeRef = useRef("idle");

  const [mode, setMode] = useState("idle");
  const [finalScore, setFinalScore] = useState(0);

  const changeMode = useCallback((next) => {
    modeRef.current = next;
    setMode(next);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !wrapper || !ctx) return;

    const dinoImage = new Image();
    const cactusImage = new Image();

    dinoImage.src = "/images/dino-sprite.png";
    cactusImage.src = "/images/cactus-sprite.png";

    ctx.imageSmoothingEnabled = false;

    let width = 0;
    let height = GAME_HEIGHT;
    let animationId = null;
    let lastTime = 0;

    const game = {
      dinoY: 0,
      velocity: 0,
      obstacles: [],
      clouds: [],
      score: 0,
      speed: 230,
      spawnDistance: 380,
      groundOffset: 0,
    };

    const groundY = () => height - 14;

    function drawCactus(ctx, obstacle, ground) {
      if (!cactusImage.complete || !cactusImage.naturalWidth) return;

      ctx.drawImage(
        cactusImage,
        Math.round(obstacle.x),
        ground - obstacle.height,
        obstacle.width,
        obstacle.height,
      );
    }

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      game.dinoY = groundY() - DINO_HEIGHT;

      render();
    };

    const reset = () => {
      game.dinoY = groundY() - DINO_HEIGHT;
      game.velocity = 0;
      game.obstacles = [];
      game.score = 0;
      game.speed = 230;
      game.spawnDistance = 380;
      game.groundOffset = 0;
    };

    const jump = () => {
      if (modeRef.current !== "running") return;

      const onGround = game.dinoY >= groundY() - DINO_HEIGHT - 1;

      if (onGround) {
        game.velocity = JUMP_FORCE;
      }
    };

    const start = () => {
      if (modeRef.current === "running") return;

      reset();
      changeMode("running");
      game.velocity = JUMP_FORCE;
      lastTime = 0;
    };

    engineRef.current = { start, jump };

    function render() {
      ctx.clearRect(0, 0, width, height);

      const ground = groundY();

      // Ground line.
      ctx.strokeStyle = COLORS.ground;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, ground + 0.5);
      ctx.lineTo(width, ground + 0.5);
      ctx.stroke();

      // Moving ground details.
      for (let i = 0; i < 35; i++) {
        const x = (i * 83 - game.groundOffset + width * 2) % Math.max(width, 1);

        ctx.fillStyle = COLORS.detail;
        ctx.fillRect(x, ground + 5 + (i % 2) * 3, 3, 1);
      }

      // Cacti.
      game.obstacles.forEach((obstacle) => {
        drawCactus(ctx, obstacle, ground);
      });

      if (dinoImage.complete && dinoImage.naturalWidth > 0) {
        ctx.drawImage(
          dinoImage,
          DINO_X,
          Math.round(game.dinoY),
          DINO_WIDTH,
          DINO_HEIGHT,
        );
      }

      // Score.
      if (modeRef.current === "running") {
        ctx.fillStyle = COLORS.text;
        ctx.font = "10px monospace";
        ctx.textAlign = "right";
        ctx.fillText(
          `SCORE ${String(Math.floor(game.score)).padStart(5, "0")}`,
          width - 40,
          13,
        );
      }
    }

    const endGame = () => {
      setFinalScore(Math.floor(game.score));
      changeMode("over");
    };

    const update = (delta) => {
      const dt = Math.min(delta, 0.025);
      const ground = groundY();

      // Jump physics.
      game.velocity += GRAVITY * dt;
      game.dinoY += game.velocity * dt;

      if (game.dinoY >= ground - DINO_HEIGHT) {
        game.dinoY = ground - DINO_HEIGHT;
        game.velocity = 0;
      }

      // Score and progressive difficulty.
      game.score += dt * 10;

      // Difficulty increases every 100 points.
      const level = Math.floor(game.score / 100);

      // Gradually increase speed, capped at 420.
      game.speed = Math.min(230 + level * 25, 420);

      // Ground movement.
      game.groundOffset = (game.groundOffset + game.speed * dt) % 83;

      // Obstacle spawning based on distance.
      game.spawnDistance -= game.speed * dt;

      if (game.spawnDistance <= 0) {
        const level = Math.floor(game.score / 100);

        game.obstacles.push({
          x: width + 12,
          width: 18,
          height: 30 + Math.random() * 8,
          passed: false,
        });

        // Shorter gaps as difficulty increases.
        const minGap = Math.max(245, 340 - level * 12);
        const maxGap = Math.max(320, 440 - level * 12);

        game.spawnDistance = minGap + Math.random() * (maxGap - minGap);
      }

      game.obstacles.forEach((obstacle) => {
        obstacle.x -= game.speed * dt;

        // Reward the player for successfully passing a cactus.
        if (!obstacle.passed && obstacle.x + obstacle.width < DINO_X) {
          obstacle.passed = true;
          game.score += 5;
        }
      });

      game.obstacles = game.obstacles.filter(
        (obstacle) => obstacle.x + obstacle.width > 0,
      );

      // Collision detection.
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

    const loop = (timestamp) => {
      if (!lastTime) lastTime = timestamp;

      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      if (modeRef.current === "running") {
        update(delta);
      }

      render();
      animationId = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const handleVisibility = () => {
      stopLoop();
      lastTime = 0;

      if (!document.hidden) {
        animationId = requestAnimationFrame(loop);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);

    resize();

    animationId = requestAnimationFrame(loop);

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      engineRef.current = null;
    };
  }, [changeMode]);

  const handleKeyDown = (event) => {
    // Let the actual button handle its own Enter/Space activation.
    if (event.target.tagName === "BUTTON") return;

    const key = event.key.toLowerCase();

    if (["enter", " ", "arrowup"].includes(key)) {
      event.preventDefault();

      if (modeRef.current !== "running") {
        engineRef.current?.start();
      } else {
        engineRef.current?.jump();
      }
    }
  };

  const handleStart = (event) => {
    event.stopPropagation();
    engineRef.current?.start();
    wrapperRef.current?.focus({ preventScroll: true });
  };

  const handlePointerDown = () => {
    // Tapping the actual game area only jumps during gameplay.
    if (modeRef.current === "running") {
      engineRef.current?.jump();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="dino-game"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Dino runner game"
    >
      <canvas
        ref={canvasRef}
        className="dino-game__canvas"
        aria-hidden="true"
        onPointerDown={handlePointerDown}
      />

      {mode !== "running" && (
        <div className="dino-game__action">
          <button
            type="button"
            onClick={handleStart}
            className="dino-game__play"
          >
            {mode === "idle" ? "Play Dino" : "Play again"}
            <span aria-hidden="true"> ↗</span>
          </button>

          {mode === "over" && (
            <span className="dino-game__result">Score {finalScore}</span>
          )}
        </div>
      )}

      {mode === "running" && (
        <span className="dino-game__hint">SPACE / ↑ TO JUMP</span>
      )}

      <span className="sr-only" aria-live="polite">
        {mode === "idle"
          ? "Select Play Dino to start."
          : mode === "over"
            ? `Game over. Final score ${finalScore}.`
            : "Game running."}
      </span>
    </div>
  );
}
