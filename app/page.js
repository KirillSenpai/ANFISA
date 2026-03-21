"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { INVITE } from "./invite-data";

function formatDate(iso) {
  const d = new Date(iso);
  const dateNumeric = d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  const pretty = d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const time = d.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return { dateNumeric, pretty, time, d };
}

function monthCalendar(dateObj) {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const firstDow = (first.getDay() + 6) % 7;
  const cells = [];

  for (let i = 0; i < firstDow; i += 1) cells.push({ kind: "empty", v: "" });
  for (let date = 1; date <= last.getDate(); date += 1) {
    cells.push({ kind: "day", v: date, active: date === day });
  }
  while (cells.length % 7 !== 0) cells.push({ kind: "empty", v: "" });

  return { month, year, cells };
}

function monthNameRu(monthIndex) {
  return [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь"
  ][monthIndex] || "";
}

function HeartMarker() {
  return <span className="timelineHeart" aria-hidden="true">♥</span>;
}

export default function Page() {
  const { dateNumeric, pretty, time, d } = useMemo(() => formatDate(INVITE.dateIso), []);
  const calendar = useMemo(() => monthCalendar(d), [d]);
  const [status, setStatus] = useState({ kind: "idle", msg: "" });
  const rsvpRef = useRef(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const reset = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    reset();
    requestAnimationFrame(reset);
    setTimeout(reset, 120);
  }, []);

  function scrollToRsvp(event) {
    event.preventDefault();
    rsvpRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onRsvpSubmit(event) {
    event.preventDefault();
    setStatus({ kind: "loading", msg: "Отправляем ответ..." });

    const form = event.currentTarget;
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
      setStatus({ kind: "ok", msg: "Спасибо, ответ получен." });
    } catch (error) {
      setStatus({
        kind: "error",
        msg: `Не удалось отправить: ${error?.message || "попробуйте позже"}`
      });
    }
  }

  return (
    <main className="page">
      <div className="backdrop" aria-hidden="true" />

      <div className="frameShell">
        <section className="editorialGrid">
          <article className="paperColumn primaryColumn">
            <div className="photoCard">
              <div className="heroPhoto">
                <Image
                  src={INVITE.photoMain}
                  alt={INVITE.photoAlt}
                  width={798}
                  height={880}
                  sizes="(max-width: 900px) 100vw, 560px"
                  className="heroImage heroImageNatural"
                  priority
                />
              </div>
              <div className="heroNames">{INVITE.couple}</div>
              <div className="heroDate">{pretty}</div>
              <div className="heroMiniHeart">♥</div>
            </div>

            <section className="paperSection introSection">
              <h1 className="sectionTitle">{INVITE.posterHeadline}</h1>
              <p className="leadText">{INVITE.posterText}</p>
            </section>

            <section className="paperSection calendarSection">
              <div className="dateLarge">{dateNumeric}</div>
              <div className="calendarHead">{monthNameRu(calendar.month)}</div>
              <div className="calendarGrid">
                {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map((label) => (
                  <div key={label} className="calendarDow">{label}</div>
                ))}
                {calendar.cells.map((cell, index) => (
                  <div
                    key={index}
                    className={
                      cell.kind === "empty"
                        ? "calendarCell empty"
                        : cell.active
                          ? "calendarCell active"
                          : "calendarCell"
                    }
                  >
                    {cell.active && <span className="calendarHeart" aria-hidden="true">♥</span>}
                    <span className="calendarNumber">{cell.v}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="paperSection extraSection">
              <h2 className="sectionTitle small">{INVITE.extraTitle}</h2>
              <p className="bodyText">{INVITE.extraText}</p>
              <div className="contactCard">
                <div>
                  <div className="contactName">{INVITE.organizerName}</div>
                  <div className="contactPhone">{INVITE.organizerPhoneText}</div>
                </div>
                <a className="contactButton" href={`tel:${INVITE.organizerPhoneTel}`}>
                  Позвонить
                </a>
              </div>
            </section>
          </article>

          <aside className="paperColumn secondaryColumn">
            <section className="paperSection timingSection">
              <h2 className="sectionTitle small">{INVITE.scheduleTitle}</h2>
              <div className="timeline">
                {INVITE.schedule.map((item) => (
                  <article className="timelineItem" key={item.time + item.title}>
                    <div className="timelineRail">
                      <span className="timelineLine" aria-hidden="true" />
                      <HeartMarker />
                    </div>
                    <div className="timelineContent">
                      <div className="timelineTime">{item.time}</div>
                      <div className="timelineTitle">{item.title}</div>
                      <p className="timelineText">{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="paperSection locationSection">
              <h2 className="sectionTitle small">{INVITE.registrationTitle}</h2>
              <div className="locationCaption">{INVITE.registrationVenue}</div>
              <div className="locationAddress">{INVITE.registrationAddress}</div>
              <a className="mapButton" href={INVITE.registrationMapLink} target="_blank" rel="noreferrer">
                Открыть место регистрации
              </a>
            </section>

            <section className="paperSection locationSection">
              <h2 className="sectionTitle small">{INVITE.locationTitle}</h2>
              <div className="locationGallery">
                <div className="locationShot locationShotPrimary">
                  <Image
                    src={INVITE.locationPhoto}
                    alt={INVITE.locationPhotoAlt}
                    fill
                    sizes="(max-width: 900px) 100vw, 420px"
                    className="heroImage"
                  />
                </div>
                <div className="locationShot locationShotSecondary">
                  <Image
                    src={INVITE.locationInsidePhoto}
                    alt={INVITE.locationInsidePhotoAlt}
                    fill
                    sizes="(max-width: 900px) 100vw, 420px"
                    className="heroImage"
                  />
                </div>
              </div>
              <div className="locationCaption">{INVITE.venue}</div>
              <div className="locationAddress">{INVITE.address}</div>
              <a className="mapButton" href={INVITE.mapLink} target="_blank" rel="noreferrer">
                Посмотреть на карте
              </a>
            </section>

            <section className="paperSection dressSection">
              <h2 className="sectionTitle small">{INVITE.dressTitle}</h2>
              <p className="bodyText">{INVITE.dressText}</p>
              <div className="swatches">
                {INVITE.dressColors.map((color) => (
                  <span key={color} className="swatch" style={{ backgroundColor: color }} />
                ))}
              </div>
            </section>

            <section className="paperSection extraSection">
              <h2 className="sectionTitle small">{INVITE.extraTitle}</h2>
              <p className="bodyText">{INVITE.extraText}</p>
              <div className="contactCard">
                <div>
                  <div className="contactName">{INVITE.organizerName}</div>
                  <div className="contactPhone">{INVITE.organizerPhoneText}</div>
                </div>
                <a className="contactButton" href={`tel:${INVITE.organizerPhoneTel}`}>
                  Позвонить
                </a>
              </div>
            </section>

            <section id="rsvp" ref={rsvpRef} className="paperSection formSection">
              <h2 className="sectionTitle small">{INVITE.rsvpTitle}</h2>
              <p className="bodyText">{INVITE.rsvpText}</p>

              <form className="form" onSubmit={onRsvpSubmit}>
                <label className="field">
                  Имя и фамилия
                  <input className="input" name="name" placeholder={INVITE.form.namePlaceholder} required minLength={2} />
                </label>

                <label className="field">
                  Вы будете?
                  <select className="input" name="attend" defaultValue={INVITE.form.attendOptions[0]} required>
                    {INVITE.form.attendOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  Сколько гостей от вас?
                  <select className="input" name="guests" defaultValue={INVITE.form.guestsOptions[0]} required>
                    {INVITE.form.guestsOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  Комментарий
                  <textarea className="input textarea" name="note" rows={4} placeholder={INVITE.form.notePlaceholder} />
                </label>

                <button className="submitButton" type="submit" disabled={status.kind === "loading"}>
                  {status.kind === "loading" ? "Отправляем..." : "Подтвердить присутствие"}
                </button>

                {status.kind !== "idle" && <div className={`status ${status.kind}`}>{status.msg}</div>}
              </form>
            </section>

            <div className="farewell">{INVITE.footerFarewell}</div>
          </aside>
        </section>
      </div>
    </main>
  );
}
