# Wedding Invite

Все основные тексты и настройки приглашения теперь собраны в одном месте: [app/invite-data.js](C:/Users/user/Desktop/projects/wedding-invite/app/invite-data.js).

## Что где менять

### 1. Имена пары, дата, город

Файл: [app/invite-data.js](C:/Users/user/Desktop/projects/wedding-invite/app/invite-data.js)

Поля:

- `couple` — имена пары
- `dateIso` — дата и время свадьбы
- `city` — город

Пример:

```js
couple: "Анна & Максим",
dateIso: "2026-09-05T15:30:00+05:00",
city: "Екатеринбург",
```

Формат `dateIso`: `ГГГГ-ММ-ДДTЧЧ:ММ:СС+часовой_пояс`

Пример:

```txt
2026-08-15T16:00:00+05:00
```

## 2. Главное фото

Файл с настройкой: [app/invite-data.js](C:/Users/user/Desktop/projects/wedding-invite/app/invite-data.js)

Поля:

- `photoMain` — путь к фото
- `photoAlt` — подпись для изображения

Куда класть файл:

- в папку [public](C:/Users/user/Desktop/projects/wedding-invite/public)

Самый простой вариант:

1. Положи фото в [public](C:/Users/user/Desktop/projects/wedding-invite/public)
2. Назови его `couple.jpg`
3. Оставь в `invite-data.js` строку `photoMain: "/couple.jpg"`

Если файл будет называться иначе, поменяй путь:

```js
photoMain: "/our-photo.png",
photoAlt: "Анна и Максим",
```

## 3. Все тексты на странице

Файл: [app/invite-data.js](C:/Users/user/Desktop/projects/wedding-invite/app/invite-data.js)

Основные поля:

- `posterTitleTop` — верхний заголовок
- `posterSubtitle` — подзаголовок
- `posterHeadline` — крупный заголовок на постере
- `posterText` — основной текст приглашения
- `wishesTitle`, `wishesText` — блок пожеланий
- `dressTitle`, `dressText` — блок дресс-кода
- `extraTitle`, `extraText` — дополнительная информация
- `rsvpTitle`, `rsvpText` — блок подтверждения присутствия
- `footerFarewell` — надпись внизу справа

## 4. Место проведения и карта

Файл: [app/invite-data.js](C:/Users/user/Desktop/projects/wedding-invite/app/invite-data.js)

Поля:

- `venue` — название площадки
- `address` — адрес
- `mapLink` — ссылка на карту

Сейчас `venue` и `address` сохранены в данных, но на самой странице используется в первую очередь кнопка `mapLink`. Если захочешь, я потом могу отдельно вывести название площадки и адрес прямо в интерфейс.

## 5. Тайминг дня

Файл: [app/invite-data.js](C:/Users/user/Desktop/projects/wedding-invite/app/invite-data.js)

Массив:

```js
schedule: [
  { time: "16:00", title: "Сбор гостей", icon: "clock" },
  { time: "16:40", title: "Церемония", icon: "rings" }
]
```

Что можно менять:

- `time` — время
- `title` — подпись
- `icon` — иконка

Доступные `icon`:

- `clock`
- `rings`
- `cake`
- `spark`

## 6. Цвета дресс-кода

Файл: [app/invite-data.js](C:/Users/user/Desktop/projects/wedding-invite/app/invite-data.js)

Поле:

```js
dressColors: ["#d8ecfb", "#b8d8f0", "#90bddc", "#6ea7d8", "#4f759b"]
```

Это маленькие цветные кружки в блоке дресс-кода. Можно поставить любые HEX-цвета.

## 7. Контакты организатора

Файл: [app/invite-data.js](C:/Users/user/Desktop/projects/wedding-invite/app/invite-data.js)

Поля:

- `organizerName`
- `organizerPhoneText`
- `organizerPhoneTel`

Важно:

- `organizerPhoneText` — красивое отображение для человека
- `organizerPhoneTel` — номер для кнопки звонка, лучше в формате `+79001234567`

## 8. Настройки формы RSVP

Файл: [app/invite-data.js](C:/Users/user/Desktop/projects/wedding-invite/app/invite-data.js)

Блок:

```js
form: {
  namePlaceholder: "Иван Иванов",
  attendOptions: ["Да, буду", "Пока не уверен(а)", "К сожалению, не смогу"],
  guestsOptions: ["1", "2", "3", "4"],
  notePlaceholder: "Например: без орехов"
}
```

Здесь можно менять:

- подсказку в поле имени
- варианты ответа
- варианты количества гостей
- подсказку в комментарии

## 9. SEO и заголовок вкладки

Файл: [app/invite-data.js](C:/Users/user/Desktop/projects/wedding-invite/app/invite-data.js)

Блок:

```js
export const SITE_METADATA = {
  title: `${INVITE.couple} — приглашение на свадьбу`,
  description: "15 августа, 16:00 — Челябинск",
  metadataBase: "https://example.com"
};
```

Что менять:

- `title` — заголовок вкладки и превью
- `description` — описание
- `metadataBase` — реальный домен сайта после публикации

Файл [app/layout.js](C:/Users/user/Desktop/projects/wedding-invite/app/layout.js) теперь берёт эти данные автоматически.

## 10. Цвета и общий стиль

Файл: [app/globals.css](C:/Users/user/Desktop/projects/wedding-invite/app/globals.css)

Если захочешь поменять стиль страницы, смотри в начало файла:

```css
:root{
  --bg:#99afc8;
  --paper:#eef5fb;
  --ink:#27445d;
  --muted:#55708a;
  --line:#91b7d8;
  --accent:#6ea7d8;
}
```

Это главные цвета темы.

## 11. Telegram для RSVP

Файл: [app/api/rsvp/route.js](C:/Users/user/Desktop/projects/wedding-invite/app/api/rsvp/route.js)

Обычно этот файл менять не нужно. Для работы формы надо создать `.env.local` в корне проекта:

```env
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_CHAT_ID=ваш_chat_id
```

## Быстрый сценарий редактирования

Если хочешь просто адаптировать сайт под себя, обычно достаточно:

1. Поменять данные в [app/invite-data.js](C:/Users/user/Desktop/projects/wedding-invite/app/invite-data.js)
2. Положить фото в [public](C:/Users/user/Desktop/projects/wedding-invite/public)
3. При желании подправить цвета в [app/globals.css](C:/Users/user/Desktop/projects/wedding-invite/app/globals.css)
4. Настроить `.env.local`, если нужна отправка RSVP в Telegram

## Что можно улучшить потом

Если захочешь, я могу следующим сообщением ещё упростить проект:

- вывести на страницу `venue` и `address`
- добавить второе фото
- сделать отдельный блок "как добраться"
- добавить музыку или анимацию
- сделать версию для гостей с персональным обращением
