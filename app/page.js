"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const INVITE = {
  couple: "Анфиса & Егор",
  dateIso: "2026-08-15T16:00:00+05:00", // 15 августа 16:00 Челябинск (UTC+5)
  city: "Челябинск",

  // Левый “постер”
  posterTitleTop: "ПРИГЛАШЕНИЕ",
  posterSubtitle: "электронное приглашение на свадьбу",
  posterHeadline: "У нас свадьба!",
  posterText:
    "Дорогие и любимые, мы приглашаем вас на праздник в честь нашей свадьбы. С нетерпением ждём встречи!",

  // Фото/картинки (положи в /public)
  photoMain: "/couple.jpg",        // основное фото на постере
  photoAlt: "Анфиса и Егор",
  // Если хочешь “детский коллаж” как в примере — можешь заменить photoMain на /couple-kids.png

  // Место
  venue: "Площадка (впиши название)",
  address: "Челябинск, (впиши адрес полностью)",
  mapLink: "https://yandex.ru/maps/",

  // Тайминг (правая колонка)
  schedule: [
    { time: "16:00", title: "Сбор гостей", icon: "clock" },
    { time: "16:40", title: "Церемония", icon: "rings" },
    { time: "17:30", title: "Праздничный банкет", icon: "cake" },
    { time: "23:00", title: "Завершение", icon: "spark" }
  ],

  // Пожелания
  wishesTitle: "Пожелания",
  wishesText:
    "Не ломайте голову над подарком — ваши пожелания в конверте станут лучшим вкладом в нашу семейную мечту.",

  // Дресс-код
  dressTitle: "Дресс-код",
  dressText:
    "Мы будем рады, если вы поддержите нашу палитру: спокойные пудровые и пастельные оттенки (но главное — комфорт).",
  dressColors: ["#E8B3C0", "#F2D1D8", "#D8A2B0", "#C8C8C8", "#6F8C7A"],

  // Дополнительно / контакты
  extraTitle: "Дополнительно",
  extraText:
    "Если возникнут вопросы — можно написать/позвонить организатору:",
  organizerName: "Организатор (имя)",
  organizerPhoneText: "+7 (900) 000-00-00",
  organizerPhoneTel: "+79000000000",

  // RSVP
  rsvpTitle: "Вы придёте?",
  rsvpText:
    "Пожалуйста, подтвердите своё присутствие — это очень поможет с организацией."
};

function formatDate(iso) {
  const d = new Date(iso);
  const dateStr = d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" });
  const pretty = d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  const time = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  return { dateStr, pretty, time, d };
}

function monthCalendar(dateObj) {
  // календарь месяца для “даты торжества”
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  // в РФ неделя начинается с понедельника; JS: 0=вс,1=пн...
  const firstDow = (first.getDay() + 6) % 7; // 0=пн ... 6=вс

  const daysInMonth = last.getDate();
  const cells = [];

  for (let i = 0; i < firstDow; i++) cells.push({ kind: "empty", v: "" });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ kind: "day", v: d, active: d === day });

  // добьём до кратности 7
  while (cells.length % 7 !== 0) cells.push({ kind: "empty", v: "" });

  return { year, month, day, cells };
}

function monthNameRu(monthIndex) {
  const names = [
    "январь","февраль","март","апрель","май","июнь",
    "июль","август","сентябрь","октябрь","ноябрь","декабрь"
  ];
  return names[monthIndex] || "";
}

function Icon({ name }) {
  // минималистичные линейные иконки в духе “рефа”
  const common = { className: "i", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "clock") {
    return (
      <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 8v5l3 2" /></svg>
    );
  }
  if (name === "rings") {
    return (
      <svg {...common}>
        <circle cx="9" cy="13" r="5" />
        <circle cx="15" cy="13" r="5" />
        <path d="M9 8l1-2" />
      </svg>
    );
  }
  if (name === "cake") {
    return (
      <svg {...common}>
        <path d="M7 10h10v10H7z" />
        <path d="M7 14c1.5 1 3 .5 4 0s2.5-1 4 0 2.5 1 2 0" />
        <path d="M12 6c1 1 1 2 0 3-1-1-1-2 0-3z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 2l1.2 3.6L17 7l-3.2 2.3L15 13l-3-2-3 2 1.2-3.7L7 7l3.8-1.4L12 2z" />
    </svg>
  );
}

export default function Page() {
  const { dateStr, pretty, time, d } = useMemo(() => formatDate(INVITE.dateIso), []);
  const cal = useMemo(() => monthCalendar(d), [d]);

  const [status, setStatus] = useState({ kind: "idle", msg: "" });

  async function onRsvpSubmit(e) {
    e.preventDefault();
    setStatus({ kind: "loading", msg: "Отправляю…" });

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          attend: data.attend,
          guests: data.guests,
          note: data.note
        })
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Ошибка отправки");

      form.reset();
      setStatus({ kind: "ok", msg: "Готово ✅ Ответ отправлен." });
    } catch (err) {
      setStatus({ kind: "error", msg: `Не отправилось ❌ ${err?.message || "Попробуйте позже"}` });
    }
  }

  return (
    <main className="wrap">
      <div className="ambient" aria-hidden="true" />

      <div className="shell">
        <header className="topbar">
          <div className="brand">taplink <span className="brandSub">(сайт) — электронное приглашение</span></div>
          <a className="topbtn" href="#rsvp">подтвердить присутствие</a>
        </header>

        <section className="grid">
          {/* LEFT: poster */}
          <article className="poster">
            <div className="posterHead">
              <div className="posterTop">{INVITE.posterTitleTop}</div>
              <div className="posterSub">{INVITE.posterSubtitle}</div>
            </div>

            <div className="frame">
              <div className="frameRibbon" aria-hidden="true" />
              <div className="frameDate">{dateStr}</div>
              <div className="frameNames">{INVITE.couple}</div>

              <div className="heart">
                <div className="heartInner">
                  <Image
                    src={INVITE.photoMain}
                    alt={INVITE.photoAlt}
                    fill
                    sizes="(max-width: 860px) 92vw, 560px"
                    className="photo"
                    priority
                  />
                </div>
              </div>

              <div className="posterH">{INVITE.posterHeadline}</div>
              <p className="posterP">{INVITE.posterText}</p>

              <div className="wing" aria-hidden="true" />
            </div>

            <div className="dateBlock">
              <div className="dateTitle">дата торжества</div>
              <div className="datePretty">{pretty} — {time}</div>

              <div className="calendar">
                <div className="calHead">{monthNameRu(cal.month)} / {cal.year}</div>
                <div className="calGrid">
                  {["пн","вт","ср","чт","пт","сб","вс"].map((w) => (
                    <div key={w} className="calDow">{w}</div>
                  ))}
                  {cal.cells.map((c, idx) => (
                    <div
                      key={idx}
                      className={
                        c.kind === "empty" ? "calCell empty" :
                        c.active ? "calCell active" : "calCell"
                      }
                    >
                      {c.v}
                    </div>
                  ))}
                </div>
              </div>

              <div className="posterLinks">
                <a className="btn" href={INVITE.mapLink} target="_blank" rel="noreferrer">карта</a>
                <a className="btn primary" href="#rsvp">RSVP</a>
              </div>
            </div>
          </article>

          {/* RIGHT: info column */}
          <aside className="side">
            <section className="panel">
              <h3 className="panelTitle">Тайминг дня</h3>
              <div className="timing">
                {INVITE.schedule.map((it) => (
                  <div className="tItem" key={it.time + it.title}>
                    <div className="tIcon"><Icon name={it.icon} /></div>
                    <div className="tMain">
                      <div className="tTime">{it.time}</div>
                      <div className="tText">{it.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel accent">
              <h3 className="panelTitle">{INVITE.wishesTitle}</h3>
              <p className="panelText">{INVITE.wishesText}</p>
              <div className="doves" aria-hidden="true" />
            </section>

            <section className="panel">
              <h3 className="panelTitle">{INVITE.dressTitle}</h3>
              <p className="panelText">{INVITE.dressText}</p>
              <div className="swatches">
                {INVITE.dressColors.map((c) => (
                  <span key={c} className="sw" style={{ background: c }} />
                ))}
              </div>
              <div className="carline" aria-hidden="true" />
            </section>

            <section className="panel">
              <h3 className="panelTitle">{INVITE.extraTitle}</h3>
              <p className="panelText">{INVITE.extraText}</p>
              <div className="contactRow">
                <div className="contactName">{INVITE.organizerName}</div>
                <a className="callBtn" href={`tel:${INVITE.organizerPhoneTel}`}>позвонить</a>
              </div>
              <div className="contactHint">{INVITE.organizerPhoneText}</div>
            </section>

            <section id="rsvp" className="panel accent">
              <h3 className="panelTitle">{INVITE.rsvpTitle}</h3>
              <p className="panelText">{INVITE.rsvpText}</p>

              <form className="form" onSubmit={onRsvpSubmit}>
                <label className="lbl">
                  Имя и фамилия
                  <input className="in" name="name" placeholder="Иван Иванов" required minLength={2} />
                </label>

                <label className="lbl">
                  Вы будете?
                  <select className="in" name="attend" required defaultValue="Да, буду">
                    <option>Да, буду</option>
                    <option>Пока не уверен(а)</option>
                    <option>К сожалению, не смогу</option>
                  </select>
                </label>

                <label className="lbl">
                  Сколько гостей от вас?
                  <select className="in" name="guests" required defaultValue="1">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </label>

                <label className="lbl">
                  Комментарий (аллергии, дети, +1 и т.д.)
                  <textarea className="in" name="note" rows={3} placeholder="Например: без орехов" />
                </label>

                <button className="btn primary full" type="submit" disabled={status.kind === "loading"}>
                  {status.kind === "loading" ? "Отправляю…" : "Подтвердить присутствие"}
                </button>

                {status.kind !== "idle" && (
                  <div className={`status ${status.kind}`}>{status.msg}</div>
                )}
              </form>
            </section>

            <div className="bye">До встречи!</div>
          </aside>
        </section>

        <footer className="foot">
          <div className="footLine" />
          <div className="footText">© {INVITE.couple}</div>
        </footer>
      </div>
    </main>
  );
}