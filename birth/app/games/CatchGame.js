"use client";

import { useContext, useEffect, useRef, useState } from "react";

import { GameShell, KissContext } from "../shared";

const FALLING = ["♥", "💗", "💋", "😘", "💕"];
const TARGET_SCORE = 8;
const SPAWN_MS = 750;

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
        glyph: FALLING[Math.floor(Math.random() * FALLING.length)]
      };
      itemsRef.current = [...itemsRef.current, next];
      setItems(itemsRef.current);
    }, SPAWN_MS);

    return () => window.clearInterval(spawnTimer);
  }, []);

  useEffect(() => {
    let last = performance.now();

    function tick(now) {
      const dt = now - last;
      last = now;

      const field = fieldRef.current;
      const basketNode = field ? field.querySelector(".catchBasket") : null;
      const basketRect = basketNode ? basketNode.getBoundingClientRect() : null;
      const fieldRect = field ? field.getBoundingClientRect() : null;

      const remaining = [];
      let caughtAny = false;

      for (const item of itemsRef.current) {
        const y = item.y + item.speed * (dt / 16);
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
            caughtAny = true;
            scoreRef.current += 1;
            spawnKiss(itemLeftPx, itemTopPx);
          }
        }

        if (!caught && y < 108) remaining.push({ ...item, y });
      }

      itemsRef.current = remaining;
      setItems(remaining);
      if (caughtAny) setScore(scoreRef.current);

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
      subtitle="Веди корзинку пальцем и лови всё, что летит сверху"
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
            className="catchItem"
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
          <p>Поймала всё! Умница 💗</p>
          <button type="button" className="stepperNext" onClick={onComplete}>
            Дальше →
          </button>
        </div>
      )}
    </GameShell>
  );
}
