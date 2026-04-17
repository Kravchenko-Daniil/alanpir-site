# CLAUDE.md

Контекст проекта для Claude Code.

## Что это

Сайт ресторана осетинских пирогов **АланПир** (`alanpir.ru`).
Два фронтенда параллельно в репо: **старый статический** (`frontend/`) и **новый на Next.js** (`frontend-next/`). Идёт переход на новый.
Бэкенд — Node.js + SQLite (`backend/`), сейчас неактивен.

GitHub: https://github.com/Kravchenko-Daniil/site-alanpir

## Структура

```
pirogi/
├── frontend/          # старый статический сайт. Пока в проде на alanpir.ru.
├── frontend-next/     # НОВЫЙ: Next.js 15 + React 19 + Tailwind 4 + TypeScript
│   ├── app/           # /, /about/, /catalog/, /checkout/, /order/, /account/, /reviews/, /privacy/, /offer/
│   ├── components/    # Header, Footer, ProductCard, ProductModal, CartDrawer, AuthModal, Toast, Analytics, MobileTabBar, checkout/*
│   ├── hooks/         # useCart, useAuthModal, useProductModal, useToast
│   ├── lib/
│   │   ├── menu.ts    # 62 товара из frontend/data/nashpir_menu.json
│   │   ├── seo.ts     # SITE_URL, контакты, JSON-LD (Restaurant, Menu)
│   │   └── validation.ts  # formatPhone, isValidPhone, isValidEmail, …
│   └── public/        # favicon.svg, apple-touch-icon.svg
├── backend/           # Node.js API (Express + SQLite + nodemailer + DaData). Не задеплоен.
├── scripts/           # prepare-deploy.mjs — упаковка СТАРОГО frontend + backend
├── docs/              # tz.md, content.md, deploy.md, design-brief*.md, roadmap.md
├── archive/           # parser/ (Python), exampl/ (демо DaData)
└── deploy/            # ГЕНЕРИРУЕТСЯ, в git не коммитить
```

## Превью на VPS (dev-среда)

- **URL**: http://185.177.238.230/
- **SSH**: `ssh vps-4vps` (ключ в `~/.ssh/vps-4vps`, хост в `~/.ssh/config`)
- **VPS**: Ubuntu 24.04, Amnezia-VPN занимает 443, nginx на 80 отдаёт `/var/www/alanpir-next/`
- **Деплой**: `cd frontend-next && npm run build && ssh vps-4vps 'rm -rf /var/www/alanpir-next/*' && scp -r out/. vps-4vps:/var/www/alanpir-next/`
- VPS клиент удалит через ~10 дней — это временно, для показа. Прод-деплой будет в ISPmanager на REG.RU.

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
- Новый фронт полный: 9 страниц, все модалки, корзина, мобильный таб-бар
- **Дизайн от Gemini**: оранжевая палитра `#F25C05` + шрифты Manrope/Fraunces
- Контейнер `max-w-[1360px]` (пользователь подтвердил)
- **Единый источник меню** `lib/menu.ts`: 62 позиции, типизировано, хелперы `productById`, `productsByCategory`, `minPrice`
- **SEO**: metadata на каждой странице, sitemap.xml, robots.txt, JSON-LD Restaurant + Menu, OG/Twitter Cards
- **Favicon**: временный SVG (буква «А» в оранжевом круге)
- **Валидация форм**: AuthModal, checkout/ContactFields — маска телефона, проверки, ошибки под полями
- **Яндекс.Карта** на checkout-самовывозе (iframe, Трифоновская 4)
- **Аналитика**: заготовки YM + GA в `components/Analytics.tsx`, ID-шки в `lib/seo.ts` как `null` — активируются при подстановке
- **Правовые страницы**: `/privacy/` и `/offer/` с полными реквизитами

### ⚠️ Известные проблемы (починить в новом чате)
- **Checkout: адрес доставки не работает.** При оформлении заказа форма адреса не принимает ввод корректно. Нужно открыть `app/checkout/page.tsx` и `components/checkout/AddressForm.tsx`, проверить флоу: клик «+ Добавить новый адрес» → поле DaData → сохранение. Вероятно, тут и DaData-интеграция нужна.

### ⏸️ Блокеры от клиента
| Что | От кого | Для чего |
|---|---|---|
| Web3Forms Access Key | Рамиль (уже попросили) | Реальная отправка заказов на email |
| YM_ID + GA_ID | Клиент после регистрации на metrika.yandex.ru и analytics.google.com | Метрика |
| Финальный лого | Рамиль делает через GPT | Заменить временный в Header + Footer + favicon |
| Фото пирогов | Клиент, фотосессия | Заполнить `image` в `lib/menu.ts` |
| Тексты «О нас», «Доставка» | Клиент | Сейчас заглушки от Gemini |
| Доступ в ISPmanager REG.RU | Клиент | Финальный деплой на alanpir.ru |

### ⏸️ Заглушки в коде
- **Промокоды**: UI-поле есть, логика не реализована (нужны бизнес-правила)
- **Скидки**: реальный расчёт отключен, показывает статичные «−10% самовывоз»
- **Backend-fetch**: формы отправляют в toast, не на сервер (ждём Web3Forms или VPS+backend)
- **DaData**: модалка адреса — визуальный инпут без автодополнения (ждём API-ключ)
- **Account**: авторизация — `useState` на клиенте, данные не сохраняются

## Как запускать

```bash
cd frontend-next
npm install
npm run dev          # http://localhost:3000
npm run build        # статика в out/
```

## Деплой

**На превью-VPS (текущий):**
```bash
cd frontend-next && npm run build
ssh vps-4vps 'rm -rf /var/www/alanpir-next/*'
scp -r out/. vps-4vps:/var/www/alanpir-next/
```

**На прод REG.RU (когда будем готовы):** собрать `out/`, залить через ISPmanager в корень домена.

## Ключевые ограничения (НЕ нарушать)

- **REG.RU — shared-хостинг**, SSH нет, только файл-менеджер ISPmanager
- **Node.js на REG.RU не работает** — API только на внешнем VPS/PaaS
- В `frontend-next/next.config.ts` стоит **`output: 'export'`** и `images.unoptimized: true` — обязательно для REG.RU
- **Динамические роуты `[id]` несовместимы** со статическим экспортом — `/order` использует `?id=XXX`
- В `globals.css` **оставить legacy-alias `--color-terracotta`** = `--color-accent`, иначе чекаут/кабинет/модалки посыпятся
- **DaData-токен и SMTP-пароли** — только в `backend/.env`, никогда не коммитить

## Что НЕ делать

- Не коммитить `secrets-prod`, `.env`, `*.sqlite`, `node_modules/`, `.next/`, `out/`, `deploy/`, `venv/`, `*.zip`
- Не возвращать `output: 'standalone'` или SSR
- Не делать `[param]` без `generateStaticParams()`
- Не трогать `archive/` и старый `frontend/` без запроса
- Эмодзи только в `lib/menu.ts` как плейсхолдеры. В UI — только `lucide-react`
- **Не копировать дизайн с piroginomerodin.ru** (жёлтый, квадратное лого) — клиент одобрил оранжевую палитру в духе «свой бренд»
