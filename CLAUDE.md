# CLAUDE.md

Контекст проекта для Claude Code.

## Что это

Сайт ресторана осетинских пирогов **АланПир** (`alanpir.ru`).
Два фронтенда параллельно в репо: **старый статический** (`frontend/`) и **новый на Next.js** (`frontend-next/`). Идёт переход на новый.
Backend — Node.js + Express + SQLite (`backend/`). **Задеплоен на vps-4vps** через pm2, слушает 3001, проксируется nginx на `/api/`.

GitHub: https://github.com/Kravchenko-Daniil/site-alanpir

## Структура

```
pirogi/
├── frontend/          # старый статический сайт. Пока в проде на alanpir.ru.
├── frontend-next/     # НОВЫЙ: Next.js 15 + React 19 + Tailwind 4 + TypeScript
│   ├── app/           # /, /about/, /catalog/, /checkout/, /order/, /account/, /reviews/, /privacy/, /offer/
│   ├── components/
│   │   ├── ...        # Header, Footer, ProductCard, ProductModal, CartDrawer, AuthModal, Toast, Analytics, MobileTabBar
│   │   └── checkout/  # StepCard, ContactFields, OrderSummary, AddressForm, AddressAutocomplete
│   ├── hooks/         # useCart, useAuthModal (+ localStorage), useSavedAddresses (+ localStorage), useProductModal, useToast
│   ├── lib/
│   │   ├── menu.ts       # 62 товара из frontend/data/nashpir_menu.json
│   │   ├── seo.ts        # SITE_URL, контакты, JSON-LD (Restaurant, Menu)
│   │   ├── address.ts    # тип SavedAddress + formatFullAddress
│   │   ├── api.ts        # fetch-обёртка с NEXT_PUBLIC_API_BASE + ApiError + describeApiError
│   │   └── validation.ts # isValidPhone/Email/Name/Password
│   └── public/        # favicon.svg, apple-touch-icon.svg
├── backend/           # Node.js API (Express + SQLite + nodemailer + DaData). Deployed → vps-4vps.
├── scripts/           # prepare-deploy.mjs — упаковка СТАРОГО frontend + backend (не используется для NEW)
├── docs/              # tz.md, content.md, deploy.md, design-brief*.md, roadmap.md
├── archive/           # parser/ (Python), exampl/ (демо DaData)
└── deploy/            # ГЕНЕРИРУЕТСЯ, в git не коммитить
```

## Backend API (vps-4vps)

- **Публичный URL**: `http://185.177.238.230/api/...` (nginx → 127.0.0.1:3001)
- **На VPS**: `/opt/alanpir-api/`, запущен через `pm2 start server.js --name alanpir-api`, autostart через systemd
- **БД**: SQLite в `/opt/alanpir-api/data.sqlite` (WAL)
- **Дикрет**: `/opt/alanpir-api/.env` — PORT=3001, DADATA_TOKEN, DADATA_PUBLIC_TOKEN, SMTP_* (если настроены)

### Готовые endpoints

| Метод | Путь | Что делает |
|---|---|---|
| POST | `/api/auth/register` | Создать пользователя (phone + password, SHA-256+salt) |
| POST | `/api/auth/login` | Проверить credentials, вернуть нормализованный телефон |
| POST | `/api/orders` | Создать заказ + валидация адреса через DaData-secret + email (если SMTP настроен) |
| GET | `/api/orders/:id` | Прочитать заказ по id |
| GET | `/api/orders?phone=…` | История заказов по телефону |
| GET | `/api/suggest/address?query=…` | Подсказки адреса (DaData-прокси, фильтр по Москве) |
| POST | `/api/validate/address` | Серверная валидация адреса (улица + дом + квартира) |
| GET | `/api/config` | Публичный конфиг (DaData public-токен — если нужен фронту напрямую) |

### Быстрые команды

```bash
ssh vps-4vps 'pm2 status'                                 # статус бэка
ssh vps-4vps 'pm2 logs alanpir-api --nostream --lines 30' # последние логи
ssh vps-4vps 'pm2 restart alanpir-api'                    # перезапуск (после правки .env)
ssh vps-4vps 'cat /etc/nginx/sites-enabled/alanpir-next'  # nginx-конфиг (проксирует /api/)
curl http://185.177.238.230/api/config                    # health-check
```

### Как перезалить бэк после правок

```bash
rsync -az --exclude node_modules --exclude '*.sqlite*' --exclude '.env*' backend/ vps-4vps:/opt/alanpir-api/
ssh vps-4vps 'cd /opt/alanpir-api && npm ci --omit=dev && pm2 restart alanpir-api'
# .env — только scp, если поменял локально:
# scp backend/.env vps-4vps:/opt/alanpir-api/.env && ssh vps-4vps 'pm2 restart alanpir-api'
```

## Превью на VPS (dev-среда)

- **URL**: http://185.177.238.230/
- **SSH**: `ssh vps-4vps` (ключ в `~/.ssh/vps-4vps`, хост в `~/.ssh/config`)
- **VPS**: Ubuntu 24.04, Node 20, nginx на :80 отдаёт `/var/www/alanpir-next/` + проксирует `/api/` → `127.0.0.1:3001`
- **Деплой фронта**: `cd frontend-next && npm run build && ssh vps-4vps 'rm -rf /var/www/alanpir-next/*' && scp -r out/. vps-4vps:/var/www/alanpir-next/`
- VPS клиент удалит через ~10 дней — это временно, для показа. Прод-деплой будет в ISPmanager на REG.RU (фронт) + отдельный долгий VPS (бэк).

## Данные бренда (актуальные)

- **ИП**: Ризванов Рамиль Русланович
- **ИНН**: 151312781405
- **ОГРН**: 320151300020414
- **Телефон**: +7 (926) 499-00-99
- **Email**: rizvanovibragim@yandex.ru
- **Адрес**: Москва, ул. Трифоновская, 4
- **Geo**: 55.7925, 37.6229
- **Часы**: будни 8:30–20:00, выходные 10:00–17:00
- **Доставка**: 40–120 минут по Москве, минимум 2000 ₽, бесплатно от 5000 ₽

Все реквизиты — в `frontend-next/lib/seo.ts`, подставляются во все страницы.

## Статус (2026-04-17)

### ✅ Готово
- Репозиторий, git, GitHub, `.gitignore` (покрывает секреты и артефакты)
- Новый фронт: 9 страниц, все модалки, корзина, мобильный таб-бар
- **Дизайн от Gemini**: оранжевая палитра `#F25C05` + шрифты Manrope/Fraunces
- Контейнер `max-w-[1360px]`
- **Единый источник меню** `lib/menu.ts`: 62 позиции, типизировано
- **SEO**: metadata, sitemap.xml, robots.txt, JSON-LD Restaurant + Menu, OG/Twitter
- **Favicon**: временный SVG
- **Валидация форм**: AuthModal, ContactFields — маска через `react-imask`, проверки под полями
- **Яндекс.Карта** на checkout-самовывозе (iframe, Трифоновская 4)
- **Аналитика**: заготовки YM + GA, ID-шки в `lib/seo.ts` как `null`
- **Правовые страницы**: `/privacy/` и `/offer/` с полными реквизитами
- **Backend развёрнут на vps-4vps**: Node 20 + pm2 + SQLite + nginx proxy
- **Настоящий auth** через `/api/auth/*` с persistence в localStorage (`useAuthModal`). Колонка `users.name` + runtime-миграция — имя хранится в БД и возвращается при login.
- **История заказов** на `/account/` — fetch `/api/orders?phone=` с loading/empty/error состояниями. Phone всегда нормализуется до `+7XXXXXXXXXX` (и на INSERT, и на GET), runtime-миграция поправила уже записанные заказы.
- **Отправка заказа** через `/api/orders` с редиректом на `/order?id=X` и показом реального заказа из `/api/orders/:id`
- **Адресное автодополнение** — свой `AddressAutocomplete` через серверный `/api/suggest/address` (DaData secret скрыт на бэке)
- **Общее хранилище сохранённых адресов** — `useSavedAddresses` + `localStorage` (`alanpir:addresses`). `/checkout/` и `/account/` читают/пишут один и тот же список.

### ⚠️ Известные проблемы
- *нет открытых багов на 2026-04-17*

### ⏸️ Блокеры от клиента
| Что | От кого | Для чего |
|---|---|---|
| SMTP-креды (SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_ORDER_TO) | Рамиль | Реальная отправка заказов на email. Без них заказы сохраняются в SQLite, но не уходят на почту. |
| YM_ID + GA_ID | Клиент после регистрации на metrika.yandex.ru и analytics.google.com | Метрика |
| Финальный лого | Рамиль делает через GPT | Заменить временный в Header + Footer + favicon |
| Фото пирогов | Клиент, фотосессия | Заполнить `image` в `lib/menu.ts` |
| Тексты «О нас», «Доставка» | Клиент | Сейчас заглушки от Gemini |
| Доступ в ISPmanager REG.RU | Клиент | Финальный деплой фронта на alanpir.ru |

### ⏸️ Заглушки в коде
- **Промокоды**: UI-поле применяет фиксированную 10%-скидку, без бизнес-правил от клиента
- **Корзина в checkout**: всё ещё использует `MOCK_CART`. Связать с `useCart` — отдельная задача.
- **Адреса привязаны к браузеру, не к пользователю**: `useSavedAddresses` хранит их в `localStorage`. Не переезжают между устройствами/сессиями. Настоящее решение — таблица `addresses` за `user_id` на бэке (пункт 3.2 roadmap).
- **Валидация зоны доставки (МКАД)**: сейчас фильтр DaData только по городу Москва. Серверная проверка beltway_hit + расчёт delivery по beltway_distance — пункт 3.3 roadmap
- **Выбор интервала доставки**: select-ы со «статическими» интервалами. Реальный расчёт времени — в будущем вместе с курьерской интеграцией
- **Email по заказу**: код написан, ждёт SMTP-креды в `backend/.env`
- **Тестовый юзер** `+7 (999) 777-11-99` лежит в БД на vps-4vps без имени (был создан моим curl'ом до миграции колонки `name`). Либо удалить, либо игнорировать.

## Как запускать

```bash
cd frontend-next
npm install
npm run dev          # http://localhost:3000 (обращается к http://185.177.238.230/api/*)
npm run build        # статика в out/
```

## Деплой

**Фронт на превью-VPS (текущий):**
```bash
cd frontend-next && npm run build
ssh vps-4vps 'rm -rf /var/www/alanpir-next/*'
scp -r out/. vps-4vps:/var/www/alanpir-next/
```

**Прод REG.RU (когда будем готовы):** собрать `out/`, залить через ISPmanager в корень домена. Бэк останется на отдельном VPS — нужен будет долгосрочный (не vps-4vps).

## Ключевые ограничения (НЕ нарушать)

- **REG.RU — shared-хостинг**, SSH нет, только файл-менеджер ISPmanager
- **Node.js на REG.RU не работает** — API только на внешнем VPS/PaaS
- В `frontend-next/next.config.ts` стоит **`output: 'export'`** и `images.unoptimized: true` — обязательно для REG.RU
- **Динамические роуты `[id]` несовместимы** со статическим экспортом — `/order` использует `?id=XXX`
- В `globals.css` **оставить legacy-alias `--color-terracotta`** = `--color-accent`, иначе чекаут/кабинет/модалки посыпятся
- **Секреты и токены**:
  - `backend/.env` — серверные: `DADATA_TOKEN` (secret), `DADATA_PUBLIC_TOKEN`, SMTP-пароли. Живёт на vps-4vps как `/opt/alanpir-api/.env`.
  - `frontend-next/.env.local` — клиентские: `NEXT_PUBLIC_API_BASE=http://185.177.238.230`. Раньше был `NEXT_PUBLIC_DADATA_TOKEN` (для прямого клиентского вызова DaData) — после перехода на серверный прокси больше не используется, можно удалить строку.
  - Только `NEXT_PUBLIC_*` попадают в бандл браузера.
  - `.env*` в `.gitignore` обеих папок.

## Что НЕ делать

- Не коммитить `secrets-prod`, `.env`, `*.sqlite`, `node_modules/`, `.next/`, `out/`, `deploy/`, `venv/`, `*.zip`
- Не возвращать `output: 'standalone'` или SSR
- Не делать `[param]` без `generateStaticParams()`
- Не трогать `archive/` и старый `frontend/` без запроса
- Эмодзи только в `lib/menu.ts` как плейсхолдеры. В UI — только `lucide-react`
- **Не копировать дизайн с piroginomerodin.ru** (жёлтый, квадратное лого) — клиент одобрил оранжевую палитру в духе «свой бренд»
- **Для auth НЕ считать `isAuth` надёжным флагом «пользователь зарегистрирован»**. Сейчас фронт при login/register получает только `{phone}` от бэка и кладёт в localStorage. Сессий/JWT пока нет — кто угодно может подправить localStorage. Для прод-уровня нужен серверный JWT/cookie-session.
