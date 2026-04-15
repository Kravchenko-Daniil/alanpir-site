# CLAUDE.md

Контекст проекта для Claude Code.

## Что это

Сайт ресторана осетинских пирогов **АланПир** (`alanpir.ru`).
Два фронтенда параллельно в репо: **старый статический** (`frontend/`) и **новый на Next.js** (`frontend-next/`). Идёт переход на новый.
Бэкенд — Node.js + SQLite (`backend/`), сейчас неактивен (клиентский VPS отсутствует).

GitHub: https://github.com/Kravchenko-Daniil/site-alanpir

## Структура

```
pirogi/
├── frontend/          # старый статический сайт (HTML + script.js + styles.css + data/). Пока в проде.
├── frontend-next/     # НОВЫЙ: Next.js 15 + React 19 + Tailwind 4 + TypeScript. Активная разработка.
├── backend/           # Node.js API (Express + SQLite + nodemailer + DaData). Сейчас не задеплоен.
├── scripts/           # prepare-deploy.mjs — упаковка старого frontend + backend
├── docs/              # tz.md, content.md, deploy.md, design-brief*.md (промпты для Gemini)
├── archive/           # parser/ (Python, парсер меню), exampl/ (демо DaData)
└── deploy/            # ГЕНЕРИРУЕТСЯ, в git не коммитить
```

## Статус проекта (2026-04-15)

### ✅ Готово
- Структура репозитория: чистая, все доки в `docs/`, мусор/легаси в `archive/`
- Git: инициализирован, запушен в GitHub
- `.gitignore`: покрывает секреты (`.env`, `secrets-prod`, `*.sqlite*`) и артефакты (`node_modules`, `.next/`, `out/`, `deploy/`, `venv/`)
- **Новый фронт `frontend-next/`** на Next.js 15 от Gemini (дизайн-код уже единый):
  - 7 страниц: `/`, `/about/`, `/catalog/`, `/checkout/`, `/order/`, `/account/`, `/reviews/`
  - Компоненты: `Header`, `Footer`, `ProductCard`, `ProductModal`, `CartDrawer`, `AuthModal`, `Toast`, `checkout/*`
  - Хуки-контексты: `useCart`, `useAuthModal`, `useProductModal`, `useToast`
  - Сборка: `output: 'export'` → статика 1.7 МБ в `out/` (заливается в ISPmanager на REG.RU)
  - Billed success: все 10 роутов собираются без ошибок
- **Единый источник меню** `frontend-next/lib/menu.ts` — 62 позиции из `frontend/data/nashpir_menu.json`, подключён к главной, каталогу, ProductCard, ProductModal
- Промпты для Gemini сохранены в `docs/design-brief*.md` (будут полезны для новых промптов)

### ⏸️ Заглушки (сделать позже)
- **Фото меню**: эмодзи-плейсхолдеры. Когда появятся фото — класть в `frontend-next/public/menu/`, заполнить поле `image` в `lib/menu.ts` (одна правка на позицию)
- **Промокоды и скидки**: логика отключена, в UI — статичные заглушки. Нужен бизнес-договор на правила скидок
- **Backend-интеграция**: все формы (auth, checkout, отзывы) отправляют в `show()` toast, реальных fetch нет. Подключим через `lib/api.ts` + `NEXT_PUBLIC_API_BASE`, когда поднимем VPS
- **Яндекс.Карта на самовывозе**: плейсхолдер. Подключить виджет Яндекс.Карт
- **DaData** в модалке адреса: только визуальная форма без автодополнения

### 📋 Дальше (в порядке приоритета)
1. Запустить `frontend-next` локально через `npm run dev`, пройтись по всем страницам в браузере — подтвердить, что всё работает визуально
2. SEO: метаданные на каждую страницу, `sitemap.ts`, `robots.ts`, JSON-LD Schema для Restaurant/Menu
3. Когда появится VPS — поднять `backend/`, добавить `lib/api.ts` во фронт, подключить формы
4. Когда появятся фото — заполнить `image` в `lib/menu.ts`, залить в `public/menu/`
5. Заменить старый `frontend/` на `frontend-next/` в проде (когда новый полностью готов)

## Как запускать

**Новый фронт (актуальный):**
```bash
cd frontend-next
npm install
npm run dev          # http://localhost:3000
npm run build        # собрать статику в out/
```

**Backend (пока неактивен):**
```bash
cd backend
npm install
npm start            # http://localhost:3000
```

**Старый фронт (фактический прод):**
```bash
cd frontend
python -m http.server 8000
```

## Деплой

**Новый фронт на REG.RU:**
1. `cd frontend-next && npm run build` → папка `out/`
2. Через ISPmanager залить содержимое `out/` в корень домена

**Старый фронт (текущий прод):** через `scripts/prepare-deploy.mjs`, см. `docs/deploy.md`.

## Ключевые моменты

- REG.RU — shared-хостинг с ISPmanager, SSH нет. Только файл-менеджер.
- Node.js на REG.RU **не работает**, поэтому API обязательно на внешнем хостинге.
- В `frontend-next/next.config.ts` стоит `output: 'export'` и `images.unoptimized: true` — это нужно для REG.RU. Не менять.
- Динамические роуты (`[id]`) **несовместимы** со статическим экспортом. Страница `/order` использует `?id=XXX` в query.
- DaData-токен и SMTP-пароли должны жить только в `backend/.env` (не коммитить).

## Что НЕ делать

- Не коммитить `secrets-prod`, `.env`, `*.sqlite`, `node_modules/`, `.next/`, `out/`, `deploy/`, `venv/`, `site-gemini.zip`.
- Не возвращать `output: 'standalone'` или SSR в `next.config.ts` — это сломает деплой на REG.RU.
- Не делать динамические роуты `[param]` без `generateStaticParams()` — билд упадёт.
- Не трогать `archive/` и `frontend/` (старый) без запроса.
- Эмодзи в коде использовать только в `lib/menu.ts` как плейсхолдеры. В UI-иконках — только `lucide-react`.
