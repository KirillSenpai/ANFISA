"use client";

import { useState } from "react";

import { GameShell } from "../shared";

const GRID_SIZE = 6;
const KINDS = ["🐹", "🐱", "🐰", "🐷", "💗"];
const TARGET_SCORE = 18;

function idx(r, c) {
  return r * GRID_SIZE + c;
}

function isAdjacent(a, b) {
  const ar = Math.floor(a / GRID_SIZE);
  const ac = a % GRID_SIZE;
  const br = Math.floor(b / GRID_SIZE);
  const bc = b % GRID_SIZE;
  return Math.abs(ar - br) + Math.abs(ac - bc) === 1;
}

function generateGrid() {
  const grid = new Array(GRID_SIZE * GRID_SIZE).fill(0);
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      let kind;
      do {
        kind = Math.floor(Math.random() * KINDS.length);
      } while (
        (c >= 2 && grid[idx(r, c - 1)] === kind && grid[idx(r, c - 2)] === kind) ||
        (r >= 2 && grid[idx(r - 1, c)] === kind && grid[idx(r - 2, c)] === kind)
      );
      grid[idx(r, c)] = kind;
    }
  }
  return grid;
}

function findMatches(grid) {
  const toClear = new Set();

  for (let r = 0; r < GRID_SIZE; r++) {
    let runStart = 0;
    for (let c = 1; c <= GRID_SIZE; c++) {
      const prevKind = grid[idx(r, c - 1)];
      const curKind = c < GRID_SIZE ? grid[idx(r, c)] : null;
      if (curKind !== prevKind) {
        if (c - runStart >= 3) {
          for (let k = runStart; k < c; k++) toClear.add(idx(r, k));
        }
        runStart = c;
      }
    }
  }

  for (let c = 0; c < GRID_SIZE; c++) {
    let runStart = 0;
    for (let r = 1; r <= GRID_SIZE; r++) {
      const prevKind = grid[idx(r - 1, c)];
      const curKind = r < GRID_SIZE ? grid[idx(r, c)] : null;
      if (curKind !== prevKind) {
        if (r - runStart >= 3) {
          for (let k = runStart; k < r; k++) toClear.add(idx(k, c));
        }
        runStart = r;
      }
    }
  }

  return toClear;
}

function collapseAndRefill(grid, cleared) {
  const next = [...grid];
  const freshIndices = new Set();

  for (let c = 0; c < GRID_SIZE; c++) {
    const colVals = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      if (!cleared.has(idx(r, c))) colVals.push(grid[idx(r, c)]);
    }
    const missing = GRID_SIZE - colVals.length;
    const freshVals = Array.from({ length: missing }, () => Math.floor(Math.random() * KINDS.length));
    const merged = [...freshVals, ...colVals];
    for (let r = 0; r < GRID_SIZE; r++) {
      next[idx(r, c)] = merged[r];
      if (r < missing) freshIndices.add(idx(r, c));
    }
  }

  return { grid: next, freshIndices };
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function Match3Game({ onComplete }) {
  const [grid, setGrid] = useState(generateGrid);
  const [selected, setSelected] = useState(null);
  const [reject, setReject] = useState([]);
  const [swapPair, setSwapPair] = useState([]);
  const [matchedCells, setMatchedCells] = useState(() => new Set());
  const [freshCells, setFreshCells] = useState(() => new Set());
  const [resolving, setResolving] = useState(false);
  const [score, setScore] = useState(0);

  async function resolveCascade(startGrid) {
    let current = startGrid;
    let clearedTotal = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const matches = findMatches(current);
      if (matches.size === 0) break;
      clearedTotal += matches.size;
      setMatchedCells(matches);
      await wait(280);

      const { grid: collapsed, freshIndices } = collapseAndRefill(current, matches);
      current = collapsed;
      setMatchedCells(new Set());
      setFreshCells(freshIndices);
      setGrid(current);
      await wait(300);
      setFreshCells(new Set());
    }

    setScore((s) => s + clearedTotal);
    setResolving(false);
  }

  function handleTapCell(i) {
    if (resolving) return;

    if (selected === null) {
      setSelected(i);
      return;
    }

    if (selected === i) {
      setSelected(null);
      return;
    }

    if (!isAdjacent(selected, i)) {
      setSelected(i);
      return;
    }

    const swapped = [...grid];
    [swapped[selected], swapped[i]] = [swapped[i], swapped[selected]];
    const matches = findMatches(swapped);
    const prevSelected = selected;
    setSelected(null);

    if (matches.size === 0) {
      setReject([prevSelected, i]);
      window.setTimeout(() => setReject([]), 320);
      return;
    }

    setSwapPair([prevSelected, i]);
    window.setTimeout(() => setSwapPair([]), 260);
    setGrid(swapped);
    setResolving(true);
    resolveCascade(swapped);
  }

  const won = score >= TARGET_SCORE;

  return (
    <GameShell title="3 в ряд" subtitle="Меняй соседние клетки местами, собери 3 одинаковых" onSkip={onComplete}>
      <div className="gameHud">
        <span>
          Очки: <strong>{score}</strong> / {TARGET_SCORE}
        </span>
      </div>

      <div className="match3Grid">
        {grid.map((kind, i) => (
          <button
            key={i}
            type="button"
            className={[
              "match3Cell",
              selected === i && "isSelected",
              reject.includes(i) && "isReject",
              swapPair.includes(i) && "isSwapping",
              matchedCells.has(i) && "isMatched",
              freshCells.has(i) && "isFresh"
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => handleTapCell(i)}
            disabled={resolving}
            aria-label="клетка"
          >
            {KINDS[kind]}
          </button>
        ))}
      </div>

      {won && (
        <div className="gameWinBanner">
          <p>Собрано! Отличная реакция 🐾</p>
          <button type="button" className="stepperNext" onClick={onComplete}>
            Дальше →
          </button>
        </div>
      )}
    </GameShell>
  );
}
