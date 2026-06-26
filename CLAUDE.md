# CLAUDE.md

Контекст проекта для Claude Code.

## Что это

Сайт ресторана осетинских пирогов **АланПир** (`alanpir.ru`).
Два фронтенда параллельно в репо: **старый статический** (`frontend/`) и **новый на Next.js** (`frontend-next/`). Идёт переход на новый.
Backend — Node.js + Express + SQLite (`backend/`). **Задеплоен на боевой VPS Рамиля (Beget)** через pm2, слушает 3000, проксируется nginx на `/api/`. Прод запущен на `https://alanpir.ru` (фронт+бэк на одном VPS). Cloudflare — **только DNS (DNS-only, серое облако)**, трафик идёт напрямую браузер→VPS с Let's Encrypt-сертификатом (раньше был CF-прокси, но РКН блокирует Cloudflare в РФ — см. ниже).

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
├── backend/           # Node.js API (Express + SQLite + nodemailer + DaData). Deployed → Beget VPS 159.194.222.86.
├── scripts/           # prepare-deploy.mjs — упаковка СТАРОГО frontend + backend (не используется для NEW)
├── docs/              # tz.md, content.md, deploy.md, design-brief*.md, roadmap.md
├── archive/           # parser/ (Python), exampl/ (демо DaData)
└── deploy/            # ГЕНЕРИРУЕТСЯ, в git не коммитить
```

## Backend API (боевой VPS Рамиля — Beget «Glad Benedict»)

- **Прод-домен**: `https://alanpir.ru/api/...` (браузер → nginx :443 → 127.0.0.1:3000, **напрямую, Cloudflare НЕ в пути**). Фронт и бэк на ОДНОМ VPS, один домен — никакого cross-origin/mixed content.
- **VPS**: `159.194.222.86` (Beget, Ubuntu 24.04, 1 CPU / 1 GB). SSH: `ssh -i ~/.ssh/id_ed25519_daniil_wsl root@159.194.222.86` (мой ключ залит, пароль не нужен).
- **На VPS**: `/opt/alanpir-api/`, `pm2 start server.js --name alanpir-api`, autostart через `pm2-root` (enabled). Фронт-статика — `/var/www/alanpir/`.
- **БД**: SQLite в `/opt/alanpir-api/data.sqlite` — свежая, прод стартовал с чистой базой (тестовые данные со старых VPS не переносились).
- **Секреты**: `/opt/alanpir-api/.env` — PORT=3000, DADATA_TOKEN, DADATA_PUBLIC_TOKEN, SMTP_* (SMTP_USER/PASS пока пустые → заказы пишутся в БД, но email не уходит).
- **SSL**: **Let's Encrypt прямо на origin** (`/etc/letsencrypt/live/alanpir.ru/`, домены `alanpir.ru`+`www`). Браузер ходит на VPS напрямую и получает доверенный cert. Авто-продление — `certbot.timer` (HTTP-01 webroot через `/var/www/alanpir`, nginx отдаёт `/.well-known/acme-challenge/`). Старый self-signed `/etc/ssl/alanpir-origin.*` больше не используется (остался от CF-Full-эпохи). nginx server-80 делает `301 → https` (раньше это делал CF «Always Use HTTPS»).
- **DNS**: домен `alanpir.ru` управляется в Cloudflare (NS angela/kenneth.ns.cloudflare.com), но **прокси выключен — режим DNS-only (серое облако)**. `A alanpir.ru` и `A www` → `159.194.222.86` (origin виден в DNS — это норма). AAAA для сайта нет (на VPS нет IPv6). **Почему DNS-only, а не Proxied**: с 2025 РКН блокирует подсети Cloudflare у российских ISP (домашний/мобильный) — сайт за CF-прокси не открывался из РФ (из-за рубежа работал). Уход на DNS-only → трафик на российский Beget-IP, который не блокируется. Откат — вернуть оранжевое облако в CF (но тогда вернётся блокировка в РФ). Почта (`MX`/`mail`/`smtp`/`pop`/`ftp`/`TXT spf`) осталась на REG.RU (31.31.197.33), записи DNS-only — не трогать без решения Рамиля по ящикам `@alanpir.ru`. ⚠️ Почтовые поддомены `mail/smtp/pop/ftp` стоят Proxied — это потенциально ломает прямое подключение почтовых клиентов (CF не проксирует почтовые порты); входящая почта по MX (DNS-only) в порядке. Отдельная тема для Рамиля.

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
VPS="ssh -i ~/.ssh/id_ed25519_daniil_wsl root@159.194.222.86"
$VPS 'pm2 status'                                  # статус бэка
$VPS 'pm2 logs alanpir-api --nostream --lines 30'  # последние логи
$VPS 'pm2 restart alanpir-api'                      # перезапуск (после правки .env)
$VPS 'cat /etc/nginx/sites-enabled/alanpir'         # nginx-конфиг (80+443, проксирует /api/)
curl https://alanpir.ru/api/config                  # health-check (напрямую, без Cloudflare)
$VPS 'certbot certificates'                          # статус LE-сертификата
$VPS 'systemctl list-timers | grep certbot'          # таймер авто-продления LE
```

### Как перезалить бэк после правок

```bash
KEY=~/.ssh/id_ed25519_daniil_wsl; VPS=root@159.194.222.86
rsync -az -e "ssh -i $KEY" --exclude node_modules --exclude '*.sqlite*' --exclude '.env*' backend/ $VPS:/opt/alanpir-api/
ssh -i $KEY $VPS 'cd /opt/alanpir-api && npm ci --omit=dev && pm2 restart alanpir-api'
# .env — только scp, если поменял локально:
# scp -i $KEY backend/.env $VPS:/opt/alanpir-api/.env && ssh -i $KEY $VPS 'pm2 restart alanpir-api'
```

## Прод-деплой (боевой VPS)

Фронт и бэк живут на одном VPS `159.194.222.86`. Cloudflare — только DNS (DNS-only), трафик идёт напрямую на VPS. Старый временный my-hetzner снесён 2026-06-11 (`/opt/alanpir-cleanup.sh` отработал, остался только wado-vpn — чужой).

- **Деплой фронта**:
  ```bash
  KEY=~/.ssh/id_ed25519_daniil_wsl
  cd frontend-next && NEXT_PUBLIC_API_BASE= npm run build
  rsync -az --delete -e "ssh -i $KEY" out/ root@159.194.222.86:/var/www/alanpir/
  ```
  `NEXT_PUBLIC_API_BASE=` (пустая) обязательна — фронт делает relative `/api/`-запросы на тот же домен, ничего не зашивается в bundle.
- **nginx** (`/etc/nginx/sites-available/alanpir`): server 80 (`301 → https`, кроме `/.well-known/acme-challenge/` для LE) + server 443 ssl (**Let's Encrypt** `/etc/letsencrypt/live/alanpir.ru/`) → root `/var/www/alanpir` + `location /api/` proxy на `127.0.0.1:3000`. Бэкапы старых конфигов: `/etc/nginx/sites-available/alanpir.bak-*`.
- **Cloudflare**: **DNS-only (серое облако)** на `alanpir.ru`+`www` — НЕ Proxied. Прокси убран 2026-06-26 из-за блокировки CF в РФ (РКН режет подсети Cloudflare у российских ISP). SSL/TLS-режим CF и «Always Use HTTPS» больше не важны (CF не в пути трафика). Не возвращать оранжевое облако — вернётся блокировка из России.
- **REG.RU**: остаётся только как регистратор домена (NS уже на Cloudflare) и почта на shared Host-0. Хостинг Host-0 и платный DomainSSL для сайта не нужны (SSL даёт Let's Encrypt на VPS) — Рамиль может не продлевать, НО сначала решить судьбу почты `@alanpir.ru`.

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

## Статус (2026-06-26)

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
- **🚀 ПРОД ЗАПУЩЕН (2026-06-11)**: `https://alanpir.ru` на боевом VPS Рамиля (Beget 159.194.222.86). Фронт+бэк на одном VPS, Node 20 + pm2 + SQLite + nginx. Старый временный my-hetzner снесён.
- **🌐 УХОД ОТ CLOUDFLARE-ПРОКСИ (2026-06-26)**: сайт не открывался из РФ (РКН блокирует подсети Cloudflare у российских ISP), из-за рубежа работал. Решение: Cloudflare переведён в **DNS-only** (`alanpir.ru`+`www` — серое облако), на origin выпущен **Let's Encrypt** (`certbot --webroot`, авто-продление через `certbot.timer`), nginx переключён с self-signed на LE + редирект 80→443. Трафик идёт напрямую браузер→Beget-VPS (российский IP, РКН не режет). Проверено: РФ-узлы (Москва, СПб) открывают сайт за 0.12–0.16с, код 200, валидный cert. Детали — секции «Backend API» и «Прод-деплой».
- **Настоящий auth** через `/api/auth/*` с persistence в localStorage (`useAuthModal`). Колонка `users.name` + runtime-миграция — имя хранится в БД и возвращается при login.
- **История заказов** на `/account/` — fetch `/api/orders?phone=` с loading/empty/error состояниями. Phone всегда нормализуется до `+7XXXXXXXXXX` (и на INSERT, и на GET), runtime-миграция поправила уже записанные заказы.
- **Отправка заказа** через `/api/orders` с редиректом на `/order?id=X` и показом реального заказа из `/api/orders/:id`
- **Адресное автодополнение** — свой `AddressAutocomplete` через серверный `/api/suggest/address` (DaData secret скрыт на бэке)
- **Общее хранилище сохранённых адресов** — `useSavedAddresses` + `localStorage` (`alanpir:addresses`). `/checkout/` и `/account/` читают/пишут один и тот же список.
- **Бонусный пирог с капустой (2026-06-21)**: при `subtotal > 3000 ₽` автоматически добавляется бесплатный «Кабускаджын» 1 кг (`price:0`, «Бонус»). Виртуальный (производный) item в `useCart` через `useMemo` — `bonusItem`/`displayItems`, не пишется в state/localStorage. Виден в CartDrawer, OrderSummary, payload заказа и письме (` (бонус)`). Залит на прод (фронт + `server.js`). ТЗ: `docs/task-bonus-pirog.md`.

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
| Решение по почте `@alanpir.ru` | Рамиль | MX/mail-записи остались на REG.RU Host-0. Если не продлевать хостинг — решить, нужна ли почта на домене |

### ⏸️ Заглушки в коде
- **Промокоды**: UI-поле применяет фиксированную 10%-скидку, без бизнес-правил от клиента
- **Корзина в checkout**: всё ещё использует `MOCK_CART`. Связать с `useCart` — отдельная задача.
- **Адреса привязаны к браузеру, не к пользователю**: `useSavedAddresses` хранит их в `localStorage`. Не переезжают между устройствами/сессиями. Настоящее решение — таблица `addresses` за `user_id` на бэке (пункт 3.2 roadmap).
- **Валидация зоны доставки (МКАД)**: сейчас фильтр DaData только по городу Москва. Серверная проверка beltway_hit + расчёт delivery по beltway_distance — пункт 3.3 roadmap
- **Выбор интервала доставки**: select-ы со «статическими» интервалами. Реальный расчёт времени — в будущем вместе с курьерской интеграцией
- **Email по заказу**: код написан, ждёт SMTP-креды в `backend/.env` (на проде SMTP_USER/PASS пустые)

## Как запускать

```bash
cd frontend-next
npm install
npm run dev          # http://localhost:3000 (для локального API задать NEXT_PUBLIC_API_BASE в .env.local)
npm run build        # статика в out/
```

## Деплой

Боевой деплой фронта на VPS `159.194.222.86` (Cloudflare = DNS-only, трафик напрямую) — см. секцию **«Прод-деплой (боевой VPS)»** выше. Кратко:
```bash
KEY=~/.ssh/id_ed25519_daniil_wsl
cd frontend-next && NEXT_PUBLIC_API_BASE= npm run build
rsync -az --delete -e "ssh -i $KEY" out/ root@159.194.222.86:/var/www/alanpir/
```

## Ключевые ограничения (НЕ нарушать)

- **REG.RU — shared-хостинг**, SSH нет, только файл-менеджер ISPmanager
- **Node.js на REG.RU не работает** — API только на внешнем VPS/PaaS
- В `frontend-next/next.config.ts` стоит **`output: 'export'`** и `images.unoptimized: true` — обязательно для REG.RU
- **Динамические роуты `[id]` несовместимы** со статическим экспортом — `/order` использует `?id=XXX`
- В `globals.css` **оставить legacy-alias `--color-terracotta`** = `--color-accent`, иначе чекаут/кабинет/модалки посыпятся
- **Секреты и токены**:
  - `backend/.env` — серверные: `DADATA_TOKEN` (secret), `DADATA_PUBLIC_TOKEN`, SMTP-пароли. Живёт на боевом VPS как `/opt/alanpir-api/.env` (159.194.222.86).
  - `frontend-next/.env.local` — клиентские. На проде `NEXT_PUBLIC_API_BASE=` ПУСТАЯ (relative `/api/` на тот же домен). Раньше был `NEXT_PUBLIC_DADATA_TOKEN` (прямой клиентский вызов DaData) — после перехода на серверный прокси не используется, можно удалить строку.
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
