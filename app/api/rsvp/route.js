export const runtime = "nodejs";

function mustEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function esc(s) {
  // Telegram HTML parse_mode
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req) {
  try {
    const BOT_TOKEN = mustEnv("TELEGRAM_BOT_TOKEN");
    const CHAT_ID = mustEnv("TELEGRAM_CHAT_ID");

    const body = await req.json().catch(() => ({}));
    const name = (body?.name || "").toString().trim();
    const attend = (body?.attend || "").toString().trim();
    const guests = (body?.guests || "").toString().trim();
    const note = (body?.note || "").toString().trim();

    if (name.length < 2) return Response.json({ error: "Укажите имя" }, { status: 400 });
    if (!attend) return Response.json({ error: "Выберите вариант присутствия" }, { status: 400 });

    const ts = new Date().toLocaleString("ru-RU", { timeZone: "Asia/Yekaterinburg" });

    const msg =
      `<b>RSVP — Анфиса & Егор</b>\n` +
      `<b>Время:</b> ${esc(ts)}\n` +
      `<b>Имя:</b> ${esc(name)}\n` +
      `<b>Будет:</b> ${esc(attend)}\n` +
      `<b>Гостей:</b> ${esc(guests || "-")}\n` +
      `<b>Комментарий:</b> ${esc(note || "-")}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: msg,
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data?.ok !== true) {
      return Response.json({ error: "Telegram send failed", detail: data }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}