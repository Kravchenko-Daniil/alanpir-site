# CLAUDE.md

Контекст проекта для Claude Code.

## Что это

Сайт ресторана осетинских пирогов **АланПир** (`alanpir.ru`).
Статический фронтенд + Node.js API + SQLite. Деплой: REG.RU shared-хостинг (фронт) + внешний VPS/PaaS (API).

## Структура

```
pirogi/
├── frontend/       # статический сайт: HTML + script.js + styles.css + data/
├── backend/        # Node.js API (Express + SQLite + nodemailer + DaData)
├── scripts/        # prepare-deploy.mjs — собирает deploy/ из frontend/ и backend/
├── docs/           # tz.md, content.md, deploy.md, screenshots/
├── archive/        # parser/ (Python, парсер меню), exampl/ (демо DaData)
└── deploy/         # ГЕНЕРИРУЕТСЯ, в git не коммитить
```

## Как запускать

**Локально:**
- Фронт: открыть `frontend/index.html` в браузере (или поднять `python -m http.server` из `frontend/`)
- API: `cd backend && npm install && npm start`

**Деплой:**
1. `node scripts/prepare-deploy.mjs` — создаст `deploy/hosting/` и `deploy/api/`
2. `deploy/hosting/` → загрузить через ISPmanager в корень домена на REG.RU
3. `deploy/api/` → залить на VPS/PaaS, `npm install && npm start`, прописать `.env`

## Ключевые моменты

- Фронт ходит в API через `<meta name="api-base">` в каждом HTML. В продакшне на `checkout.html` и `order.html` уже стоит `https://api.alanpir.ru/api`, на остальных — относительный `/api` (работает только если API на том же домене).
- SQLite (`backend/data.sqlite`) — dev-данные, на прод пересоздаётся автоматически.
- DaData-токен и SMTP-пароли живут в `backend/.env` (не коммитить).
- REG.RU — shared-хостинг с ISPmanager, SSH нет. Только файл-менеджер.
- Node.js на REG.RU **не работает**, поэтому API обязательно на внешнем хостинге.

## Что НЕ делать

- Не коммитить `secrets-prod`, `.env`, `*.sqlite`, `node_modules/`, `deploy/`, `venv/`.
- Не менять пути в HTML (`data/menu.js`, `data/images/...`) — они относительные к `frontend/`.
- Не трогать `archive/` без запроса — это парковка.
