"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { BIRTHDAY } from "./birthday-data";
import {
  AutoReveal,
  Bouncy,
  KISS_REGULAR,
  KISS_SPECIAL,
  KissContext,
  Portal,
  Sticker,
  SparkleField,
  useHeartBurst,
  useKissLayer
} from "./shared";
import CatchGame from "./games/CatchGame";
import MemoryGame from "./games/MemoryGame";
import Match3Game from "./games/Match3Game";
import FlappyGame from "./games/FlappyGame";

function tiltFor(index) {
  return ((index * 37) % 14) - 7;
}

function getCountdown(targetDate) {
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

/**
 * Замок на входе: пока не наступит BIRTHDAY.gateUnlockDateIso, вместо конверта
 * показывается только обратный отсчёт — дальше пройти нельзя. Как только время
 * настанет, компонент сам сообщает об этом наверх через onUnlock.
 */
function LockGate({ onUnlock }) {
  const target = useMemo(() => new Date(BIRTHDAY.gateUnlockDateIso), []);
  // The page is prerendered at build time, so the countdown must not be
  // computed during render: build-time numbers would never match the
  // visitor's clock and hydration would fail. Filled in on the client only.
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    function tick() {
      setCountdown(getCountdown(target));
      if (target.getTime() <= Date.now()) {
        onUnlock();
        return true;
      }
      return false;
    }

    if (tick()) return undefined;
    const timer = window.setInterval(() => {
      if (tick()) window.clearInterval(timer);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [target, onUnlock]);

  const show = (value) => (countdown ? countdown[value] : "–");

  return (
    <div className="lockScreen">
      <div className="lockWrap">
        <div className="lockIcon" aria-hidden="true">🔒</div>
        <div className="lockTitle">{BIRTHDAY.gateTitle}</div>
        <p className="lockText">{BIRTHDAY.gateText}</p>
        <div className="countdown lockCountdown" aria-label="Обратный отсчёт до открытия">
          <span><strong>{show("days")}</strong> дней</span>
          <span><strong>{show("hours")}</strong> часов</span>
          <span><strong>{show("minutes")}</strong> минут</span>
          <span><strong>{show("seconds")}</strong> секунд</span>
        </div>
      </div>
    </div>
  );
}

function Envelope({ opened, onOpen }) {
  return (
    <div className={`envelopeScreen ${opened ? "isOpen" : ""}`}>
      <div className="envelopeWrap">
        <button type="button" className="envelopeButton" onClick={onOpen} aria-label="Открыть письмо">
          <div className="envelope">
            <div className="envelopeBody" />
            <div className="envelopeFlap" />
            <div className="envelopeHeart">♥</div>
          </div>
          <div className="envelopeLabel">{BIRTHDAY.envelopeLabel}</div>
        </button>
        <div className="envelopeHint">{BIRTHDAY.envelopeHint}</div>
      </div>
    </div>
  );
}

function Countdown() {
  const target = useMemo(() => (BIRTHDAY.birthdayDateIso ? new Date(BIRTHDAY.birthdayDateIso) : null), []);
  const [countdown, setCountdown] = useState(() => (target ? getCountdown(target) : null));

  useEffect(() => {
    if (!target) return undefined;
    const timer = window.setInterval(() => setCountdown(getCountdown(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  if (!target || !countdown) return null;

  return (
    <div className="countdown" aria-label="Обратный отсчёт до дня рождения">
      <span><strong>{countdown.days}</strong> дней</span>
      <span><strong>{countdown.hours}</strong> часов</span>
      <span><strong>{countdown.minutes}</strong> минут</span>
      <span><strong>{countdown.seconds}</strong> секунд</span>
    </div>
  );
}

function HeroChapter() {
  return (
    <section className="hero card chapterPanel">
      <Sticker src="/img/gif-01.gif" style={{ top: "0%", left: "2%" }} startX={-42} startY={-30} startRot={-24} rot={-10} />
      <Sticker src="/img/gif-05.gif" style={{ top: "2%", right: "2%" }} startX={42} startY={-30} startRot={24} rot={8} delay={100} />
      <Sticker src="/img/gif-08.gif" style={{ bottom: "8%", right: "0%" }} startX={42} startY={30} startRot={-20} rot={-6} delay={200} />
      <Sticker src="/img/gif-02.gif" style={{ bottom: "10%", left: "0%" }} startX={-42} startY={30} startRot={20} rot={9} delay={300} />

      <div className="panelScroll">
        <div className="heroTop">{BIRTHDAY.heroTitleTop}</div>
        <h1 className="heroName">{BIRTHDAY.name}</h1>
        <div className="heroUnderline" aria-hidden="true">
          <svg viewBox="0 0 200 14" preserveAspectRatio="none">
            <path d="M2 10 Q 50 -4 100 8 T 198 6" fill="none" stroke="var(--pink-2)" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <p className="heroSubtitle">{BIRTHDAY.heroSubtitle}</p>
        <Bouncy as="button" type="button" className="heroPetName" spawnHearts>
          {BIRTHDAY.petName}
        </Bouncy>

        <Countdown />
      </div>
    </section>
  );
}

function LetterChapter() {
  return (
    <section className="card chapterPanel">
      <Sticker src="/img/gif-03.gif" style={{ top: "-20px", left: "-20px" }} startX={-42} startY={-30} startRot={-28} rot={-9} />
      <Sticker src="/img/photo-01.png" style={{ top: "38%", right: "-24px" }} startX={44} startY={0} startRot={20} rot={-4} delay={280} />

      <div className="panelScroll">
        <Bouncy as="p" className="shortGreeting" spawnHearts>
          {BIRTHDAY.shortGreeting}
        </Bouncy>
        {BIRTHDAY.letterParagraphs.map((paragraph) => (
          <p className="bodyText" key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function CollageChapter() {
  const { title, subtitle, slots, photos } = BIRTHDAY.collage;
  const items = Array.from({ length: slots }, (_, index) => photos[index] || null);
  const spawnKiss = useContext(KissContext);
  const [zoomed, setZoomed] = useState(null);

  function handleSlotClick(event, item) {
    if (item) {
      setZoomed(item);
    } else {
      spawnKiss(event.clientX, event.clientY);
    }
  }

  return (
    <section className="card chapterPanel">
      <Sticker src="/img/gif-06.gif" style={{ top: "-20px", left: "-20px" }} startX={-42} startY={-30} startRot={-22} rot={-8} />
      <Sticker src="/img/gif-09.gif" style={{ bottom: "-16px", right: "-20px" }} startX={42} startY={30} startRot={24} rot={6} delay={140} />
      <Sticker src="/img/photo-04.png" style={{ top: "-20px", right: "-20px" }} startX={42} startY={-30} startRot={-20} rot={9} delay={260} />

      <div className="panelScroll">
        <Bouncy as="h2" className="sectionTitle" spawnHearts>
          {title}
        </Bouncy>
        <p className="sectionSubtitle">{subtitle}</p>

        <div className="collageGrid">
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              className="collageSlot"
              style={{ "--tilt": `${tiltFor(index + 4)}deg` }}
              onClick={(event) => handleSlotClick(event, item)}
            >
              {item ? (
                <img src={item.src} alt={item.caption || ""} loading="lazy" />
              ) : (
                <div className="collagePlaceholder">
                  <span className="collageIcon" aria-hidden="true">📷</span>
                  <span>фото скоро здесь</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {zoomed && (
        <Portal>
          <div className="collageZoomOverlay" onClick={() => setZoomed(null)}>
            <button type="button" className="collageZoomClose" onClick={() => setZoomed(null)} aria-label="Закрыть">
              ×
            </button>
            <div className="collageZoomBody" onClick={(event) => event.stopPropagation()}>
              <img src={zoomed.src} alt={zoomed.caption || ""} />
              {(zoomed.caption || zoomed.dateLabel) && (
                <div className="collageZoomCaption">
                  {zoomed.caption && <div className="collageZoomCaptionText">{zoomed.caption}</div>}
                  {zoomed.dateLabel && <div className="collageZoomCaptionDate">{zoomed.dateLabel}</div>}
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}
    </section>
  );
}

const KISS_GIF = "/img/gif-02.gif";

function pickReward(clickNumber) {
  if (clickNumber % 5 === 0) {
    return { kind: "gif", src: KISS_GIF };
  }
  const pool = [...KISS_SPECIAL, ...KISS_REGULAR];
  const glyph = pool[Math.floor(Math.random() * pool.length)];
  return { kind: "emoji", glyph };
}

const LOVE_MILESTONES = [
  { at: 1, text: "ещё разок?" },
  { at: 5, text: "мне уже щекотно от любви" },
  { at: 10, text: "ты точно не хочешь остановиться" },
  { at: 15, text: "моё сердце вот-вот не выдержит" },
  { at: 20, text: "именно столько я тебя люблю" }
];

function hintFor(count) {
  const reached = LOVE_MILESTONES.filter((m) => count >= m.at);
  return reached.length ? reached[reached.length - 1].text : "нажимай ещё — счётчик растёт";
}

function LoveChapter() {
  const [count, setCount] = useState(0);
  const [hearts, setHearts] = useState([]);
  const [celebrating, setCelebrating] = useState(false);
  const idRef = useRef(0);
  const celebratedRef = useRef(false);
  const { burst, layer: burstLayer } = useHeartBurst();

  function handleClick(event) {
    setCount((c) => {
      const next = c + 1;
      if (next >= 20 && !celebratedRef.current) {
        celebratedRef.current = true;
        burst(30);
        window.setTimeout(() => setCelebrating(true), 350);
      }
      return next;
    });

    const rect = event.currentTarget.getBoundingClientRect();
    const id = idRef.current++;
    const reward = pickReward(id);
    const heart = {
      id,
      ...reward,
      x: rect.left + rect.width / 2 + (Math.random() * 60 - 30),
      y: rect.top,
      dx: Math.random() * 90 - 45,
      spin: Math.random() * 40 - 20
    };

    setHearts((prev) => [...prev, heart]);
    window.setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1400);
  }

  const isInfinite = count >= 20;

  return (
    <>
      <section className="card chapterPanel loveSection">
        <Sticker src="/img/gif-04.gif" style={{ top: "-20px", right: "-20px" }} startX={42} startY={-30} startRot={22} rot={-7} />
        <Sticker src="/img/photo-02.png" style={{ bottom: "-16px", left: "-20px" }} startX={-42} startY={30} startRot={-24} rot={8} delay={140} />
        <Sticker src="/img/photo-03.png" style={{ top: "40%", left: "-24px" }} startX={-44} startY={0} startRot={-18} rot={5} delay={260} />

        <div className="panelScroll">
          <button type="button" className="loveButton" onClick={handleClick}>
            {BIRTHDAY.loveButtonLabel}
          </button>
          <div className="loveCount">{isInfinite ? BIRTHDAY.loveButtonMax : count}</div>
          <div className="loveHint">{hintFor(count)}</div>
        </div>
      </section>

      {hearts.map((heart) =>
        heart.kind === "gif" ? (
          <img
            key={heart.id}
            src={heart.src}
            alt=""
            aria-hidden="true"
            className="floatingHeart floatingHeartGif"
            style={{ left: heart.x, top: heart.y, "--dx": `${heart.dx}px`, "--spin": `${heart.spin}deg` }}
          />
        ) : (
          <span
            key={heart.id}
            className="floatingHeart"
            style={{ left: heart.x, top: heart.y, "--dx": `${heart.dx}px`, "--spin": `${heart.spin}deg` }}
            aria-hidden="true"
          >
            {heart.glyph}
          </span>
        )
      )}

      {burstLayer}

      {celebrating && (
        <Portal>
          <div className="modalOverlay" onClick={() => setCelebrating(false)}>
            <div className="modalCard climaxCard" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="modalClose" onClick={() => setCelebrating(false)} aria-label="Закрыть">
                ×
              </button>
              <div className="climaxFrame">
                <img src={KISS_GIF} alt="" aria-hidden="true" />
              </div>
              <h3 className="climaxTitle">{BIRTHDAY.loveClimaxTitle}</h3>
              <p className="climaxText">{BIRTHDAY.loveClimaxText}</p>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}

function DinnerChapter() {
  const dinner = BIRTHDAY.dinner;
  const spawnKiss = useContext(KissContext);

  return (
    <section className="card chapterPanel dinnerCard">
      <Sticker src="/img/photo-05.png" style={{ top: "-20px", left: "-20px" }} startX={-42} startY={-30} startRot={-24} rot={-8} />
      <Sticker src="/img/photo-06.png" style={{ bottom: "-16px", right: "-20px" }} startX={42} startY={30} startRot={22} rot={7} delay={120} />

      <div className="panelScroll">
        <Bouncy as="h2" className="sectionTitle" spawnHearts>
          {dinner.title}
        </Bouncy>
        <p className="sectionSubtitle">{dinner.teaserText}</p>

        <button
          type="button"
          className="ticket"
          onClick={(event) => spawnKiss(event.clientX, event.clientY)}
          aria-label={`${dinner.kicker}: ${dinner.admits}`}
        >
          <div className="ticketMain">
            <div className="ticketKicker">{dinner.kicker}</div>
            <div className="ticketIcon" aria-hidden="true">🍽️</div>
            <div className="ticketAdmits">{dinner.admits}</div>
            <div className="ticketRows">
              <div className="ticketRow">
                <span>место</span>
                <strong>{dinner.place}</strong>
              </div>
              <div className="ticketRow">
                <span>срок</span>
                <strong>{dinner.validity}</strong>
              </div>
            </div>
          </div>

          <div className="ticketStub">
            <div className="ticketStubRow">
              <span>для</span>
              <strong>{dinner.holder}</strong>
            </div>
            <div className="ticketStubRow">
              <span>от</span>
              <strong>{dinner.issuer}</strong>
            </div>
            <div className="ticketBarcode" aria-hidden="true" />
            <div className="ticketCode">{dinner.code}</div>
          </div>
        </button>

        <p className="ticketHint">{dinner.hint}</p>
      </div>
    </section>
  );
}

function SecretHeart() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="secretHeart" onClick={() => setOpen(true)} aria-label="секретик">
        ♡
      </button>

      {open && (
        <Portal>
          <div className="modalOverlay" onClick={() => setOpen(false)}>
            <div className="modalCard secretCard" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="modalClose" onClick={() => setOpen(false)} aria-label="Закрыть">
                ×
              </button>
              <div className="secretGlyph" aria-hidden="true">🤫</div>
              <p className="secretText">{BIRTHDAY.secretMessage}</p>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}

function FooterChapter({ onRestart }) {
  return (
    <section className="card chapterPanel footer">
      <div className="panelScroll">
        <div className="footerSignature">
          {BIRTHDAY.footerSignature}, {BIRTHDAY.fromName}
        </div>
        <div className="footerRow">
          <Bouncy as="img" src="/img/photo-08.png" alt="" className="footerCritter" spawnHearts />
          <Bouncy as="button" type="button" className="footerHeartBig" spawnHearts aria-label="сердечко">
            {BIRTHDAY.footerHeart}
          </Bouncy>
          <Bouncy as="img" src="/img/photo-09.png" alt="" className="footerCritter" spawnHearts />
        </div>
        <SecretHeart />
        <button type="button" className="restartLink" onClick={onRestart}>
          ↺ начать сначала
        </button>
      </div>
    </section>
  );
}

const CHAPTERS = [
  { kind: "content", label: "Начало" },
  { kind: "game", label: "Игра: поцелуйчики", Component: CatchGame },
  { kind: "content", label: "Письмо" },
  { kind: "game", label: "Игра: мемори", Component: MemoryGame },
  { kind: "content", label: "Коллаж" },
  { kind: "game", label: "Игра: 3 в ряд", Component: Match3Game },
  { kind: "content", label: "Любовь" },
  { kind: "game", label: "Игра: флэппи", Component: FlappyGame },
  { kind: "content", label: "Ужин" },
  { kind: "content", label: "Финал" }
];

export default function Page() {
  // Always starts locked (matches the server-rendered HTML) so there is no
  // hydration mismatch; the effect below flips it right away on the client
  // if the unlock date has, in fact, already passed.
  const [unlocked, setUnlocked] = useState(false);
  const [opened, setOpened] = useState(false);
  const [chapterIndex, setChapterIndex] = useState(0);
  const { burst: burstEnvelope, layer: envelopeBurstLayer } = useHeartBurst();
  const { spawnKiss, layer: kissLayer } = useKissLayer();

  useEffect(() => {
    // Local-only bypass for previewing the site during development: set
    // NEXT_PUBLIC_SKIP_GATE=1 in a .env.local file (gitignored, never
    // deployed) to always skip the countdown lock on your own machine.
    const skipGate = process.env.NEXT_PUBLIC_SKIP_GATE === "1";
    if (skipGate || Date.now() >= new Date(BIRTHDAY.gateUnlockDateIso).getTime()) {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = unlocked && opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [unlocked, opened]);

  function handleOpen() {
    setOpened(true);
    window.setTimeout(() => burstEnvelope(26), 250);
  }

  function goNext() {
    setChapterIndex((i) => Math.min(i + 1, CHAPTERS.length - 1));
  }

  function goBack() {
    setChapterIndex((i) => Math.max(i - 1, 0));
  }

  function restart() {
    setChapterIndex(0);
  }

  const chapter = CHAPTERS[chapterIndex];
  const isLast = chapterIndex === CHAPTERS.length - 1;
  const progress = ((chapterIndex + 1) / CHAPTERS.length) * 100;

  if (!unlocked) {
    return (
      <main className="page">
        <SparkleField />
        <LockGate onUnlock={() => setUnlocked(true)} />
      </main>
    );
  }

  return (
    <main className="page">
      <SparkleField />
      <Envelope opened={opened} onOpen={handleOpen} />
      {envelopeBurstLayer}

      <KissContext.Provider value={spawnKiss}>
        <div className="frameShell">
          <div className="stepperHead">
            <div className="stepperTrack">
              <div className="stepperFill" style={{ width: `${progress}%` }} />
            </div>
            <div className="stepperLabel">
              Глава {chapterIndex + 1} из {CHAPTERS.length} · {chapter.label}
            </div>
          </div>

          <div className="chapterStage" key={chapterIndex}>
            <AutoReveal>
              {chapter.kind === "content" && chapterIndex === 0 && <HeroChapter />}
              {chapter.kind === "content" && chapterIndex === 2 && <LetterChapter />}
              {chapter.kind === "content" && chapterIndex === 4 && <CollageChapter />}
              {chapter.kind === "content" && chapterIndex === 6 && <LoveChapter />}
              {chapter.kind === "content" && chapterIndex === 8 && <DinnerChapter />}
              {chapter.kind === "content" && chapterIndex === 9 && <FooterChapter onRestart={restart} />}
              {chapter.kind === "game" && <chapter.Component onComplete={goNext} />}
            </AutoReveal>
          </div>

          {chapter.kind === "content" && (
            <div className="stepperNav">
              {chapterIndex > 0 ? (
                <button type="button" className="stepperBack" onClick={goBack}>
                  ← Назад
                </button>
              ) : (
                <span />
              )}
              {!isLast && (
                <button type="button" className="stepperNext" onClick={goNext}>
                  Дальше →
                </button>
              )}
            </div>
          )}
        </div>
      </KissContext.Provider>

      {kissLayer}
    </main>
  );
}
