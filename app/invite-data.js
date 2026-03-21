export const INVITE = {
  couple: "Анфиса & Егор",
  dateIso: "2026-08-15T16:00:00+05:00",
  city: "Челябинск",

  posterHeadline: "У нас свадьба!",
  posterText:
    "Дорогие и любимые, мы приглашаем вас на праздник в честь нашей свадьбы. С нетерпением ждём встречи!",

  photoMain: "/couple.jpg",
  photoAlt: "Анфиса и Егор",

  venue: "Площадка (впиши название)",
  address: "Челябинск, (впиши адрес полностью)",
  mapLink: "https://yandex.ru/maps/",

  schedule: [
    { time: "16:00", title: "Сбор гостей", icon: "clock" },
    { time: "16:40", title: "Церемония", icon: "rings" },
    { time: "17:30", title: "Праздничный банкет", icon: "cake" },
    { time: "23:00", title: "Завершение", icon: "spark" }
  ],

  wishesTitle: "Пожелания",
  wishesText:
    "Не ломайте голову над подарком — ваши пожелания в конверте станут лучшим вкладом в нашу семейную мечту.",

  dressTitle: "Дресс-код",
  dressText:
    "Мы будем рады, если вы поддержите нашу палитру: спокойные голубые, серо-голубые и светлые оттенки. Но главное — комфорт.",
  dressColors: ["#d8ecfb", "#b8d8f0", "#90bddc", "#6ea7d8", "#4f759b"],

  extraTitle: "Дополнительно",
  extraText: "Если возникнут вопросы — можно написать или позвонить организатору:",
  organizerName: "Организатор (имя)",
  organizerPhoneText: "+7 (900) 000-00-00",
  organizerPhoneTel: "+79000000000",

  rsvpTitle: "Вы придёте?",
  rsvpText:
    "Пожалуйста, подтвердите своё присутствие — это очень поможет с организацией.",

  form: {
    namePlaceholder: "Иван Иванов",
    attendOptions: ["Да, буду", "Пока не уверен(а)", "К сожалению, не смогу"],
    guestsOptions: ["1", "2", "3", "4"],
    notePlaceholder: "Например: без орехов"
  },

  footerFarewell: "До встречи!"
};

export const SITE_METADATA = {
  title: `${INVITE.couple} — приглашение на свадьбу`,
  description: "15 августа, 16:00 — Челябинск",
  metadataBase: "https://example.com"
};
