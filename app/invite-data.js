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
  registrationAddress: "Челябинск, адрес регистрации добавьте здесь",
  registrationMapLink: "https://yandex.ru/maps/",

  venue: "Банкет",
  address: "Челябинск, ул. Богдана Хмельницкого, 4",
  mapLink: "https://yandex.ru/maps/?text=%D0%A7%D0%B5%D0%BB%D1%8F%D0%B1%D0%B8%D0%BD%D1%81%D0%BA%2C%20%D1%83%D0%BB.%20%D0%91%D0%BE%D0%B3%D0%B4%D0%B0%D0%BD%D0%B0%20%D0%A5%D0%BC%D0%B5%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%BA%D0%BE%D0%B3%D0%BE%2C%204",

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
