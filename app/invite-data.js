export const INVITE = {
  couple: "Анфиса & Егор",
  dateIso: "2026-08-15T16:00:00+05:00",
  city: "Челябинск",

  siteLabel: "/сайт-приглашение",
  siteSubLabel: "электронное приглашение на свадьбу",

  posterTitleTop: "Свадебное приглашение",
  posterSubtitle: "день, который хочется разделить с близкими",
  posterHeadline: "Дорогие гости!",
  posterText:
    "Впереди наш самый важный день. Мы будем счастливы видеть вас рядом, чтобы вместе прожить этот тёплый и красивый праздник любви.",

  photoMain: "/image.jpg",
  photoSecondary: "/image.jpg",
  photoAlt: "Анфиса и Егор",

  venue: "Загородная площадка",
  address: "Челябинск, адрес площадки будет здесь",
  mapLink: "https://yandex.ru/maps/",

  scheduleTitle: "Тайминг",
  schedule: [
    {
      time: "16:00",
      title: "Сбор гостей",
      description: "Встречаемся, обнимаемся и начинаем этот день с лёгкого приветственного настроения.",
      icon: "heart"
    },
    {
      time: "16:40",
      title: "Церемония",
      description: "Самый трогательный момент, когда мы скажем друг другу самые важные слова.",
      icon: "heart"
    },
    {
      time: "17:30",
      title: "Праздничный ужин",
      description: "Разделим радость, тёплые разговоры, музыку и красивый вечер вместе.",
      icon: "heart"
    },
    {
      time: "23:00",
      title: "Завершение вечера",
      description: "Финал праздника, который мы очень хотим провести рядом с вами.",
      icon: "heart"
    }
  ],

  locationTitle: "Локация",
  locationCaption: "Площадка торжества",

  wishesTitle: "Пожелания",
  wishesText:
    "Если захотите порадовать нас подарком, мы будем благодарны за вклад в наш общий старт и мечты.",

  dressTitle: "Дресс-код",
  dressText:
    "Нам будет очень приятно, если в ваших образах появятся молочные, пудровые, песочные, серо-голубые и закатно-персиковые оттенки.",
  dressColors: ["#f5eee6", "#e8d3ca", "#d5b0a2", "#a89caf", "#6d7890"],

  extraTitle: "Дополнительно",
  extraText: "Если появятся вопросы, можно связаться с организатором:",
  organizerName: "Организатор (имя)",
  organizerPhoneText: "+7 (900) 000-00-00",
  organizerPhoneTel: "+79000000000",

  rsvpTitle: "Анкета",
  rsvpText:
    "Пожалуйста, заполните форму, чтобы нам было проще всё подготовить и позаботиться о вашем комфорте.",

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
