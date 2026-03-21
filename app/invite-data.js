export const INVITE = {
  couple: "Анфиса & Егор",
  dateIso: "2026-08-15T16:00:00+05:00",
  city: "Челябинск",

  posterTitleTop: "Свадебное приглашение",
  posterSubtitle: "день, который хочется разделить с близкими",
  posterHeadline: "Дорогие гости!",
  posterText:
    "Впереди наш самый важный день. Мы будем счастливы видеть вас рядом, чтобы вместе прожить этот тёплый и красивый праздник любви.",

  photoMain: "/image.jpg",
  photoAlt: "Анфиса и Егор",
  locationPhoto: "/place.webp",
  locationPhotoAlt: "Локация свадьбы",
  locationInsidePhoto: "/inside.jpg",
  locationInsidePhotoAlt: "Интерьер зала",

  registrationTitle: "Регистрация",
  registrationVenue: "Отдел ЗАГС",
  registrationAddress: "Челябинск, улица Румянцева, 33",
  registrationMapLink: "https://yandex.ru/maps/?text=%D0%A7%D0%B5%D0%BB%D1%8F%D0%B1%D0%B8%D0%BD%D1%81%D0%BA%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%A0%D1%83%D0%BC%D1%8F%D0%BD%D1%86%D0%B5%D0%B2%D0%B0%2C%2033",

  venue: "Место проведения — банкетный зал «Перламутр»",
  address: "Челябинск, ул. Богдана Хмельницкого, 4",
  mapLink: "https://yandex.ru/maps/?text=%D0%A7%D0%B5%D0%BB%D1%8F%D0%B1%D0%B8%D0%BD%D1%81%D0%BA%2C%20%D1%83%D0%BB.%20%D0%91%D0%BE%D0%B3%D0%B4%D0%B0%D0%BD%D0%B0%20%D0%A5%D0%BC%D0%B5%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%BA%D0%BE%D0%B3%D0%BE%2C%204",

  scheduleTitle: "Тайминг",
  schedule: [
    {
      time: "13:00",
      title: "Церемония",
      description: "По желанию можно присоединиться к регистрации и разделить с нами самый трогательный момент дня.",
      icon: "heart"
    },
    {
      time: "16:00",
      title: "Банкет",
      description: "Собираемся в банкетном зале, чтобы отметить этот день в тёплой и красивой атмосфере.",
      icon: "heart"
    },
    {
      time: "22:00",
      title: "Завершение вечера",
      description: "Финал нашего праздника и тёплое завершение свадебного вечера.",
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
    "Нам будет очень приятно, если в ваших образах появятся природные, молочные, нежно-розовые и приглушённо-зелёные оттенки из нашей палитры.",
  dressColors: ["#818263", "#c2c395", "#ddbaae", "#efd7cf", "#dcd4c1", "#f6ead4", "#fffaf2"],

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
