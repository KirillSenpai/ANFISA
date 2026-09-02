"use client";

import { useEffect, useRef, useState } from "react";

import { GameShell } from "../shared";

const WIDTH = 320;
const HEIGHT = 420;
const GRAVITY = 0.32;
const JUMP = -6.4;
const PIPE_GAP = 140;
const PIPE_WIDTH = 46;
const PIPE_SPEED = 2.1;
const PIPE_SPACING = 190;
const TARGET_SCORE = 5;
const BIRD_X = 70;
const BIRD_RADIUS = 18;

function drawRoundedRect(ctx, x, y, w, h, r) {
  if (h <= 0) return;
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, w, h);
  }
}

export default function FlappyGame({ onComplete }) {
  const canvasRef = useRef(null);
  const spriteRef = useRef(null);
  const stateRef = useRef(null);
  const statusRef = useRef("ready");
  const scoreRef = useRef(0);
  const rafRef = useRef(null);
  const [status, setStatus] = useState("ready");
  const [score, setScore] = useState(0);

  function setStatusSynced(next) {
    statusRef.current = next;
    setStatus(next);
  }

  function resetState() {
    stateRef.current = {
      birdY: HEIGHT / 2,
      birdVy: 0,
      pipes: [{ x: WIDTH + 60, gapY: 110, passed: false }]
    };
  }

  function flap() {
    if (statusRef.current === "ready" || statusRef.current === "over") {
      resetState();
      scoreRef.current = 0;
      setScore(0);
      setStatusSynced("playing");
      return;
    }
    if (statusRef.current !== "playing") return;
    stateRef.current.birdVy = JUMP;
  }

  useEffect(() => {
    const img = new Image();
    img.src = "/img/photo-01.png";
    spriteRef.current = img;
    resetState();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let lastTime = performance.now();

    function draw(now) {
      // Frame-rate independent physics: a 120Hz phone would otherwise apply
      // gravity/speed twice as often as a 60Hz one, making the game feel
      // faster (or the bird crash instantly) purely based on screen refresh rate.
      const dt = Math.min(48, now - lastTime || 16.67);
      lastTime = now;
      const step = dt / 16.67;

      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "rgba(255,240,247,0.4)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const s = stateRef.current;

      if (statusRef.current === "playing" && s) {
        s.birdVy += GRAVITY * step;
        s.birdY += s.birdVy * step;

        for (const pipe of s.pipes) pipe.x -= PIPE_SPEED * step;
        const last = s.pipes[s.pipes.length - 1];
        if (last.x < WIDTH - PIPE_SPACING) {
          s.pipes.push({
            x: WIDTH + 20,
            gapY: 50 + Math.random() * (HEIGHT - 100 - PIPE_GAP),
            passed: false
          });
        }
        s.pipes = s.pipes.filter((p) => p.x > -PIPE_WIDTH - 10);

        let collided = s.birdY - BIRD_RADIUS < 0 || s.birdY + BIRD_RADIUS > HEIGHT;

        for (const pipe of s.pipes) {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X - BIRD_RADIUS) {
            pipe.passed = true;
            scoreRef.current += 1;
          }
          const withinX = BIRD_X + BIRD_RADIUS > pipe.x && BIRD_X - BIRD_RADIUS < pipe.x + PIPE_WIDTH;
          if (withinX) {
            const withinGap =
              s.birdY - BIRD_RADIUS > pipe.gapY && s.birdY + BIRD_RADIUS < pipe.gapY + PIPE_GAP;
            if (!withinGap) collided = true;
          }
        }

        if (scoreRef.current !== score) setScore(scoreRef.current);

        if (collided) {
          setStatusSynced("over");
        } else if (scoreRef.current >= TARGET_SCORE) {
          setStatusSynced("won");
        }
      }

      if (s) {
        ctx.fillStyle = "#ff8fab";
        for (const pipe of s.pipes) {
          drawRoundedRect(ctx, pipe.x, 0, PIPE_WIDTH, pipe.gapY, 12);
          drawRoundedRect(ctx, pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, HEIGHT - (pipe.gapY + PIPE_GAP), 12);
        }

        const sprite = spriteRef.current;
        if (sprite && sprite.complete) {
          ctx.save();
          ctx.translate(BIRD_X, s.birdY);
          ctx.rotate(Math.max(-0.4, Math.min(0.6, s.birdVy * 0.06)));
          ctx.drawImage(sprite, -BIRD_RADIUS, -BIRD_RADIUS, BIRD_RADIUS * 2, BIRD_RADIUS * 2);
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GameShell title="Флэппи Аня" subtitle="Тапай, чтобы взлетать, и пролетай между сердечками" onSkip={onComplete}>
      <div className="gameHud">
        <span>
          Счёт: <strong>{score}</strong> / {TARGET_SCORE}
        </span>
      </div>

      <div className="flappyField" onClick={flap}>
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="flappyCanvas" />
        {status === "ready" && <div className="flappyOverlay">Тапни, чтобы начать</div>}
        {status === "over" && <div className="flappyOverlay">Ой! Тапни, чтобы попробовать снова</div>}
      </div>

      {status === "won" && (
        <div className="gameWinBanner">
          <p>Долетела! 🐹💗</p>
          <button type="button" className="stepperNext" onClick={onComplete}>
            Дальше →
          </button>
        </div>
      )}
    </GameShell>
  );
}
