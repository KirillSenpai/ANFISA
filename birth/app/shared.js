"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Renders children straight into document.body. Safari has a long-standing bug
 * where a position:fixed element nested inside a -webkit-overflow-scrolling:touch
 * container (our .panelScroll) gets trapped relative to that container instead of
 * the viewport, shrinking to its size. Every modal/overlay must portal out of any
 * scrollable ancestor to render correctly full-screen on iOS.
 */
export function Portal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

/** Даёт летящие сердечки/поцелуйчики любому элементу на странице, где бы он ни был. */
export const KissContext = createContext(() => {});

/**
 * Сообщает вложенным стикерам и элементам, что их глава сейчас активна и можно
 * играть анимацию появления. Одна общая AutoReveal на главу — проще и надёжнее,
 * чем у каждого элемента свой наблюдатель за прокруткой (сайт теперь состоит
 * из глав, а не из одной длинной прокручиваемой страницы).
 */
export const RevealVisibleContext = createContext(false);

export function AutoReveal({ children, delay = 60 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return <RevealVisibleContext.Provider value={visible}>{children}</RevealVisibleContext.Provider>;
}

/**
 * Стикер (фото или гифка), спрятанный за краем панели: выезжает наружу, когда
 * глава становится активной, слегка покачивается, а по нажатию/тапу
 * подбрасывает сердечки и посылает поцелуй.
 */
export function Sticker({ src, size = 60, style, startX = -30, startY = -20, startRot = -20, rot = 0, delay = 0 }) {
  const visible = useContext(RevealVisibleContext);
  const [bump, setBump] = useState(false);
  const spawnKiss = useContext(KissContext);

  function handleTap(event) {
    event.stopPropagation();
    spawnKiss(event.clientX, event.clientY);
    setBump(true);
    window.setTimeout(() => setBump(false), 380);
  }

  return (
    <button
      type="button"
      className={`stickerPeek ${visible ? "isPeeking" : ""} ${bump ? "isBumped" : ""}`}
      style={{
        ...style,
        width: size,
        height: size,
        "--start-x": `${startX}px`,
        "--start-y": `${startY}px`,
        "--start-rot": `${startRot}deg`,
        "--rot": `${rot}deg`,
        "--peek-delay": `${delay}ms`
      }}
      onClick={handleTap}
      aria-label="нажми — прилетит поцелуй"
    >
      <img src={src} alt="" draggable={false} />
    </button>
  );
}

/** Небольшой "подпрыг" для значков, заголовков и иконок — тоже реагируют на нажатие. */
export function Bouncy({ as: Tag = "span", className = "", spawnHearts = false, children, ...rest }) {
  const [bump, setBump] = useState(false);
  const spawnKiss = useContext(KissContext);

  function handleClick(event) {
    setBump(true);
    window.setTimeout(() => setBump(false), 380);
    if (spawnHearts) spawnKiss(event.clientX, event.clientY);
  }

  return (
    <Tag className={`bouncy ${bump ? "isBumped" : ""} ${className}`} onClick={handleClick} {...rest}>
      {children}
    </Tag>
  );
}

const SPARKLES = ["♥", "✦", "♥", "✧", "♥"];

export function SparkleField() {
  const items = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: (i * 6.3) % 100,
        delay: (i * 1.7) % 12,
        duration: 10 + ((i * 3) % 8),
        size: 12 + ((i * 5) % 14),
        glyph: SPARKLES[i % SPARKLES.length]
      })),
    []
  );

  return (
    <div className="sparkles" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className="sparkle"
          style={{
            left: `${item.left}%`,
            bottom: "-5%",
            fontSize: item.size,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`
          }}
        >
          {item.glyph}
        </span>
      ))}
    </div>
  );
}

/** Общий "салют" из сердечек на весь экран — для открытия конверта и кульминаций. */
export function useHeartBurst() {
  const [hearts, setHearts] = useState([]);
  const idRef = useRef(0);

  function burst(count = 22) {
    const created = Array.from({ length: count }, () => ({
      id: idRef.current++,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2.4 + Math.random() * 1.6,
      size: 14 + Math.random() * 18,
      sway: Math.random() * 90 - 45,
      glyph: Math.random() > 0.35 ? "♥" : "✦"
    }));

    setHearts((prev) => [...prev, ...created]);
    window.setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !created.some((c) => c.id === h.id)));
    }, 4200);
  }

  const layer = (
    <div className="heartBurstLayer" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heartBurstItem"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            "--sway": `${h.sway}px`
          }}
        >
          {h.glyph}
        </span>
      ))}
    </div>
  );

  return { burst, layer };
}

export const KISS_SPECIAL = ["💋", "😘"];
export const KISS_REGULAR = ["♥", "💗", "💕"];

/** Каждое нажатие на стикер или значок присылает пару летящих сердечек/поцелуйчиков. */
export function useKissLayer() {
  const [items, setItems] = useState([]);
  const idRef = useRef(0);

  function spawnKiss(clientX, clientY) {
    const created = [0, 1].map((i) => {
      const id = idRef.current++;
      const glyph =
        i === 0
          ? KISS_SPECIAL[Math.floor(Math.random() * KISS_SPECIAL.length)]
          : KISS_REGULAR[Math.floor(Math.random() * KISS_REGULAR.length)];
      return {
        id,
        glyph,
        x: clientX + (Math.random() * 24 - 12),
        y: clientY,
        dx: (i === 0 ? -1 : 1) * (20 + Math.random() * 40),
        spin: Math.random() * 40 - 20,
        delay: i * 70
      };
    });

    setItems((prev) => [...prev, ...created]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((h) => !created.some((c) => c.id === h.id)));
    }, 1600);
  }

  const layer = (
    <div className="kissLayer" aria-hidden="true">
      {items.map((h) => (
        <span
          key={h.id}
          className="floatingHeart"
          style={{
            left: h.x,
            top: h.y,
            "--dx": `${h.dx}px`,
            "--spin": `${h.spin}deg`,
            animationDelay: `${h.delay}ms`
          }}
        >
          {h.glyph}
        </span>
      ))}
    </div>
  );

  return { spawnKiss, layer };
}

/** Общая рамка для мини-игр: заголовок, подсказка и ссылка "пропустить". */
export function GameShell({ title, subtitle, onSkip, children }) {
  return (
    <div className="card chapterPanel gamePanel">
      <div className="panelScroll">
        <h2 className="sectionTitle">{title}</h2>
        <p className="sectionSubtitle">{subtitle}</p>
        {children}
        <button type="button" className="gameSkip" onClick={onSkip}>
          Пропустить →
        </button>
      </div>
    </div>
  );
}
