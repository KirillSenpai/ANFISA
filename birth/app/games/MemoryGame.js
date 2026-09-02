"use client";

import { useState } from "react";

import { GameShell } from "../shared";

const PAIR_IMAGES = [
  "/img/photo-01.png",
  "/img/photo-03.png",
  "/img/photo-04.png",
  "/img/photo-06.png",
  "/img/photo-07.png",
  "/img/photo-09.png"
];

function shuffledDeck() {
  const deck = [...PAIR_IMAGES, ...PAIR_IMAGES].map((src) => ({ key: src }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.map((card, id) => ({ ...card, id }));
}

export default function MemoryGame({ onComplete }) {
  const [deck] = useState(shuffledDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(() => new Set());
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);

  function handleFlip(card) {
    if (locked || flipped.includes(card.id) || matched.has(card.id) || flipped.length === 2) return;

    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const first = deck.find((c) => c.id === nextFlipped[0]);
      const second = deck.find((c) => c.id === nextFlipped[1]);

      if (first.key === second.key) {
        window.setTimeout(() => {
          setMatched((prev) => {
            const next = new Set(prev);
            next.add(first.id);
            next.add(second.id);
            return next;
          });
          setFlipped([]);
          setLocked(false);
        }, 480);
      } else {
        window.setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 850);
      }
    }
  }

  const won = matched.size === deck.length;

  return (
    <GameShell title="Мемори" subtitle="Найди все пары одинаковых карточек" onSkip={onComplete}>
      <div className="gameHud">
        <span>Ходы: <strong>{moves}</strong></span>
        <span>Пары: <strong>{matched.size / 2}</strong> / {deck.length / 2}</span>
      </div>

      <div className="memoryGrid">
        {deck.map((card) => {
          const isFaceUp = flipped.includes(card.id) || matched.has(card.id);
          return (
            <button
              key={card.id}
              type="button"
              className={`memoryCard ${isFaceUp ? "isFaceUp" : ""} ${matched.has(card.id) ? "isMatched" : ""}`}
              onClick={() => handleFlip(card)}
              aria-label="карточка"
            >
              <div className="memoryCardInner">
                <div className="memoryCardBack">♡</div>
                <div className="memoryCardFront">
                  <img src={card.key} alt="" draggable={false} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {won && (
        <div className="gameWinBanner">
          <p>Все пары найдены! 🎉</p>
          <button type="button" className="stepperNext" onClick={onComplete}>
            Дальше →
          </button>
        </div>
      )}
    </GameShell>
  );
}
