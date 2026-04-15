# АланПир — сайт ресторана осетинских пирогов

Статический фронтенд + Node.js API. Прод: [alanpir.ru](https://alanpir.ru).

## Структура

- `frontend/` — статический сайт (HTML, CSS, JS, картинки, меню)
- `backend/` — Node.js API (Express + SQLite + DaData + nodemailer)
- `scripts/prepare-deploy.mjs` — сборщик артефактов деплоя
- `docs/` — ТЗ, контент, инструкция по деплою, скриншоты
- `archive/` — неиспользуемый код на сохранение

## Локально

```bash
# API
cd backend
npm install
npm start                # слушает http://localhost:3000

# Фронт — в другом терминале
cd frontend
python -m http.server 8000
# открыть http://localhost:8000
```

## Деплой

```bash
node scripts/prepare-deploy.mjs
```

Появятся:
- `deploy/hosting/` — заливать через **ISPmanager** в корень домена на REG.RU
- `deploy/api/` — разворачивать на VPS/PaaS (Node 18+)

Подробности: [docs/deploy.md](docs/deploy.md).
