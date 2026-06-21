# Roadmap — АланПир

Живой документ. Обновляется по ходу. Последнее обновление: **2026-04-17**.

## Легенда

- ✅ сделано
- 🟡 в работе
- 🔴 срочный баг
- ⏳ ждёт данные от клиента
- 📋 запланировано
- ⏸️ отложено

---

## 🔴 Баги к исправлению (приоритет)

*Открытых багов нет.*

---

## 0. Дизайн

✅ Принят **оранжевый от Gemini** (`#F25C05` + Manrope/Fraunces + контейнер 1360px). Правки — позже, по фидбеку Рамиля.

---

## 1. До первого прода (MVP)

### 1.1 ✅ SEO
- `lib/seo.ts` — константы сайта
- `metadata` на всех страницах
- `app/sitemap.ts` + `app/robots.ts` с `dynamic='force-static'`
- JSON-LD: `Restaurant` в `app/layout.tsx`, `Menu` на главной (62 позиции)
- OG + Twitter Cards

### 1.2 ✅ Правовые страницы
- `/privacy/` — Политика конфиденциальности
- `/offer/` — Публичная оферта
- Ссылки в футере

### 1.3 ✅ Валидация форм
- `lib/validation.ts` — утилиты
- Маска телефона через `react-imask` (старый ручной formatPhone снят из-за бага курсора)
- AuthModal, ContactFields — ошибки под полями

### 1.4 ✅ Favicon + метрика
- `public/favicon.svg` + `apple-touch-icon.svg`
- `components/Analytics.tsx` с YM + GA. ID-шки в `lib/seo.ts` как `null`

### 1.5 ✅ Яндекс.Карта
- iframe-виджет на checkout-самовывозе

### 1.6 ✅ Отправка заказов через свой бэкенд (вместо Web3Forms)
- Backend на my-4vps отвечает за `/api/orders` (SQLite + опциональный email через nodemailer)
- Web3Forms отменили — свой путь чище и гибче
- 📋 **Остаётся**: получить SMTP-креды от Рамиля и положить в `/opt/alanpir-api/.env`, чтобы письма фактически уходили. Сейчас заказы молча копятся в БД.

### 1.7 ✅ Адрес в checkout (бывший баг B1)
- Свой `AddressAutocomplete` → `/api/suggest/address` (серверный DaData-прокси, secret-токен скрыт)
- `lib/address.ts` — тип `SavedAddress`, хелпер `formatFullAddress`
- `components/checkout/AddressForm.tsx`: controlled state + DaData через прокси + валидация «адрес обязателен + дом обязателен» + передача структурированного адреса наверх
- `app/checkout/page.tsx` и `/account/`: список сохранённых адресов с radio и удалением
- **Общий список** через `hooks/useSavedAddresses` + `localStorage` (ключ `alanpir:addresses`) — адрес из checkout появляется в /account/ и наоборот. Привязка к user — вторая итерация (3.2).
- При создании заказа адрес уходит в `addressData` → серверная валидация через DaData на бэке

### 1.8 ✅ Настоящий auth через backend
- `POST /api/auth/register` и `/api/auth/login` на сервере (SHA-256 + salt, SQLite)
- **Колонка `users.name`** — добавлена runtime-миграцией; register сохраняет, login возвращает
- `useAuthModal` хранит `{phone, name}` в `localStorage` (`alanpir:auth`) + загружает при старте — больше не слетает на F5
- `AuthModal` шлёт fetch с обработкой кодов ошибок (`USER_EXISTS`, `BAD_CREDENTIALS` и т.д.)
- `/account/` показывает реальный телефон + историю заказов через `GET /api/orders?phone=`
- `POST /api/orders` нормализует `phone` перед INSERT + runtime-миграция поправила старые записи — история теперь всегда находится
- Моканы «Ибрагим Ризванов», «ул. Ленина, 10», заказы №1024/980 удалены

### 1.9 📋 Тексты «О нас», «Доставка»
Сейчас заглушки от Gemini. Клиент даёт свой текст → я верстаю.

### 1.10 📋 Деплой на alanpir.ru
Когда всё выше готово: собрать `out/`, через ISPmanager залить в корень домена. Бэк оставить на отдельном VPS (не my-4vps — он временный).

### 1.11 📋 Долгосрочный VPS под API
my-4vps удалят через ~10 дней. Нужен постоянный (Timeweb / Selectel / Beget, ~300 ₽/мес). Перенос — минимальный: Node 20 + pm2 + scp backend/ + тот же nginx-конфиг. См. быстрые команды в `CLAUDE.md`.

---

## 2. От клиента (я не могу сделать сам)

| | Что | Статус |
|---|---|---|
| | SMTP-креды (user/pass/from/to) | 🟡 Жду от Рамиля. Без них заказы идут в БД, но не на email. |
| | Финальный лого | 🟡 Рамиль делает через GPT |
| | Фото пирогов (фотосессия) | ⏳ |
| | YM_ID + GA_ID (регистрация на metrika/analytics) | ⏳ |
| | Тексты «О нас», «Доставка» | ⏳ |
| | Яндекс.Бизнес (регистрация карточки) | ⏳ |
| | DaData API-ключи | ✅ используются (public на клиенте раньше, теперь secret на бэке) |
| | Доступ в ISPmanager REG.RU | ⏳ |
| | Долгосрочный VPS для API (Timeweb/Selectel) | ⏳ |
| | Правила акций/промокодов (бизнес-документ) | ⏳ |

---

## 3. Вторая итерация (после первого прода)

### 3.1 Фото пирогов
- Клиент → JPG/WebP → `frontend-next/public/menu/`
- Заполнить `image: '/menu/...'` в `lib/menu.ts`

### 3.2 ✅→📋 Backend — надёжность и фичи
- ✅ Развёрнут на my-4vps (временный)
- 📋 Перенести на долгосрочный VPS (см. 1.11)
- 📋 Адреса пользователя **в БД** (таблица `addresses` с `user_id`) вместо текущего `localStorage` — чтобы переезжали между устройствами
- 📋 JWT/сессии вместо текущего «фронт верит localStorage-у» — сейчас кто угодно может подделать `alanpir:auth`
- 📋 Bcrypt/argon2 вместо SHA-256+salt для паролей
- 📋 Rate-limit на `/api/auth/*` и `/api/suggest/address`
- 📋 Webhook в Telegram при новом заказе (быстрее email)

### 3.3 DaData — серверная валидация зоны и стоимости
- ✅ Клиентские подсказки через прокси `/api/suggest/address`
- ✅ Серверная валидация адреса при создании заказа (`/api/validate/address` + внутренний вызов в `/api/orders`)
- 📋 Проверка зоны доставки: МКАД через поле `beltway_hit` из DaData-ответа
- 📋 Расчёт стоимости доставки по `beltway_distance` (20 ₽/км за МКАД)

### 3.4 Промокоды / скидки
- Бизнес-правила от клиента
- Реализация в бэкенде (таблица `promo_codes`, endpoint `/api/promo/check`)
- Убрать фиксированную «−10% самовывоз» в пользу настраиваемых правил

### 3.5 Связать корзину с checkout
Сейчас `checkout/page.tsx` использует `MOCK_CART`. Связать с `useCart` → настоящая корзина → заказ.

### 3.6 Эквайринг
- Провайдер: ЮKassa / Tinkoff / CloudPayments
- Договор с банком — клиент, 1-2 недели
- Интеграция

---

## 4. Третья итерация

- Онлайн-касса (54-ФЗ) — Атол/Эвотор, ОФД
- Курьерская интеграция (Яндекс.Доставка API или Telegram-бот курьерам)
- SMS/Email уведомления клиенту о статусах
- Программа лояльности

---

## 5. Логистика разработки

- **Dev-превью**: http://185.177.238.230/ (фронт) + http://185.177.238.230/api/* (бэк, через nginx-прокси)
- **Деплой фронта**: `cd frontend-next && npm run build && ssh my-4vps 'rm -rf /var/www/alanpir-next/*' && scp -r out/. my-4vps:/var/www/alanpir-next/`
- **Перезалить бэк**: `rsync -az --exclude node_modules --exclude '*.sqlite*' --exclude '.env*' backend/ my-4vps:/opt/alanpir-api/ && ssh my-4vps 'cd /opt/alanpir-api && npm ci --omit=dev && pm2 restart alanpir-api'`
- **Перезапуск pm2 после правок .env**: `scp backend/.env my-4vps:/opt/alanpir-api/.env && ssh my-4vps 'pm2 restart alanpir-api'`
- **Прод (будущее)**: REG.RU ISPmanager для фронта + долгосрочный VPS для бэка (см. 1.11)
- **Git**: main → не деплоится автоматически, руками

---

## 6. Следующий шаг

**Для показа демо клиенту — уже всё работает**. Полный флоу: регистрация → корзина → чекаут с DaData → заказ сохраняется в БД → история в кабинете.

**Что остаётся до заливки на alanpir.ru:**
1. SMTP-креды от Рамиля → email-нотификации заказов
2. Финальный лого от Рамиля → Header + Footer + favicon
3. Тексты «О нас» и «Доставка» от клиента
4. Выбор и покупка долгосрочного VPS под API (сейчас на временном my-4vps)
5. Доступ в ISPmanager REG.RU → заливка фронта
