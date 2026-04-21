import { INVITE } from "../../invite-data";

export const runtime = "nodejs";

function mustEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req) {
  try {
    const botToken = mustEnv("TELEGRAM_BOT_TOKEN");
    const chatId = mustEnv("TELEGRAM_CHAT_ID");

    const body = await req.json().catch(() => ({}));
    const name = (body?.name || "").toString().trim();
    const attend = (body?.attend || "").toString().trim();
    const guests = (body?.guests || "").toString().trim();
    const drink = (body?.drink || "").toString().trim();
    const afterparty = (body?.afterparty || "").toString().trim();
    const note = (body?.note || "").toString().trim();

    if (name.length < 2) {
      return Response.json({ error: "Укажите имя" }, { status: 400 });
    }

    if (!attend) {
      return Response.json({ error: "Выберите вариант присутствия" }, { status: 400 });
    }

    const ts = new Date().toLocaleString("ru-RU", { timeZone: "Asia/Yekaterinburg" });
    const msg =
      `<b>RSVP — ${esc(INVITE.couple)}</b>\n` +
      `<b>Время:</b> ${esc(ts)}\n` +
      `<b>Имя:</b> ${esc(name)}\n` +
      `<b>Будет:</b> ${esc(attend)}\n` +
      `<b>Гостей:</b> ${esc(guests || "-")}\n` +
      `<b>Напитки:</b> ${esc(drink || "-")}\n` +
      `<b>Продолжение банкета:</b> ${esc(afterparty || "-")}\n` +
      `<b>Комментарий:</b> ${esc(note || "-")}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
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
  } catch (error) {
    return Response.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}
