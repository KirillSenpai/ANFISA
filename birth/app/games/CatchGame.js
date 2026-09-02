"use client";

import { useContext, useEffect, useRef, useState } from "react";

import { GameShell, KISS_REGULAR, KISS_SPECIAL, KissContext } from "../shared";

const TARGET_SCORE = 8;
const SPAWN_MS = 700;

function randomFalling() {
  const isKiss = Math.random() < 0.6;
  const pool = isKiss ? KISS_SPECIAL : KISS_REGULAR;
  return { good: isKiss, glyph: pool[Math.floor(Math.random() * pool.length)] };
}

export default function CatchGame({ onComplete }) {
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(50);
  const fieldRef = useRef(null);
  const itemsRef = useRef([]);
  const idRef = useRef(0);
  const rafRef = useRef(null);
  const scoreRef = useRef(0);
  const spawnKiss = useContext(KissContext);

  useEffect(() => {
    const spawnTimer = window.setInterval(() => {
      if (scoreRef.current >= TARGET_SCORE) return;
      const next = {
        id: idRef.current++,
        x: 8 + Math.random() * 84,
        y: -8,
        speed: 0.55 + Math.random() * 0.5,
        ...randomFalling()
      };
      itemsRef.current = [...itemsRef.current, next];
      setItems(itemsRef.current);
    }, SPAWN_MS);

    return () => window.clearInterval(spawnTimer);
  }, []);

  useEffect(() => {
    let last = performance.now();

    function tick(now) {
      const dt = Math.min(48, now - last || 16.67);
      last = now;
      const step = dt / 16.67;

      const field = fieldRef.current;
      const basketNode = field ? field.querySelector(".catchBasket") : null;
      const basketRect = basketNode ? basketNode.getBoundingClientRect() : null;
      const fieldRect = field ? field.getBoundingClientRect() : null;

      const remaining = [];
      let scoreDelta = 0;
      let lastCatchPos = null;

      for (const item of itemsRef.current) {
        const y = item.y + item.speed * step;
        let caught = false;

        if (basketRect && fieldRect) {
          const itemLeftPx = fieldRect.left + (item.x / 100) * fieldRect.width;
          const itemTopPx = fieldRect.top + (y / 100) * fieldRect.height;
          caught =
            itemTopPx > basketRect.top - 6 &&
            itemTopPx < basketRect.bottom &&
            itemLeftPx > basketRect.left - 4 &&
            itemLeftPx < basketRect.right + 4;

          if (caught) {
            scoreDelta += item.good ? 1 : -1;
            lastCatchPos = { x: itemLeftPx, y: itemTopPx };
          }
        }

        if (!caught && y < 108) remaining.push({ ...item, y });
      }

      itemsRef.current = remaining;
      setItems(remaining);

      if (scoreDelta !== 0) {
        scoreRef.current = Math.max(0, scoreRef.current + scoreDelta);
        setScore(scoreRef.current);
        if (lastCatchPos) spawnKiss(lastCatchPos.x, lastCatchPos.y);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spawnKiss]);

  function handlePointerMove(event) {
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(6, Math.min(94, pct)));
  }

  const won = score >= TARGET_SCORE;

  return (
    <GameShell
      title="Поймай поцелуйчики"
      subtitle="Лови только 💋 и 😘 — обычные сердечки роняют счёт"
      onSkip={onComplete}
    >
      <div className="gameHud">
        <span>
          Счёт: <strong>{score}</strong> / {TARGET_SCORE}
        </span>
      </div>

      <div
        ref={fieldRef}
        className="catchField"
        onPointerMove={handlePointerMove}
        onTouchMove={handlePointerMove}
      >
        {items.map((item) => (
          <span
            key={item.id}
            className={`catchItem ${item.good ? "isGood" : "isBad"}`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.glyph}
          </span>
        ))}

        <div className="catchBasket" style={{ left: `${basketX}%` }} aria-hidden="true">
          🧺
        </div>
      </div>

      {won && (
        <div className="gameWinBanner">
          <p>Поймала всё нужное! Умница 💗</p>
          <button type="button" className="stepperNext" onClick={onComplete}>
            Дальше →
          </button>
        </div>
      )}
    </GameShell>
  );
}
