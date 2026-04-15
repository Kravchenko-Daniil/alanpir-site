# Деплой АланПир: hosting (статический) и API (VPS / PaaS)

В проект добавлены готовые папки и скрипт, чтобы разделить файлы для статического хостинга (REG.RU) и для бэкенда (Node.js API) на VPS/PAAS.

## Быстрое использование

1) Подготовьте папки для загрузки (создаст копии файлов):

```
node scripts/prepare_deploy.mjs
```

После выполнения появятся каталоги:

- `deploy/hosting/` — статический сайт: HTML, CSS, JS, `data/`, `photos/` и т.д.
- `deploy/api/` — Node.js API (копия `server/` без `node_modules` и секретов), плюс `.env.example`.

2) Загрузка на REG.RU (shared hosting без Node.js)

- В менеджере файлов загрузите СОДЕРЖИМОЕ `deploy/hosting/` в папку домена (например, `public_html/` или корень `alanpir.ru`).
- Укажите базовый URL API в файлах:
  - `checkout.html` и `order.html` — в теге `<meta name="api-base" ...>` поставьте ваш URL API (например, `https://api.alanpir.ru/api`).

3) Развёртывание API (VPS/PAAS)

- Загрузите `deploy/api/` на внешнюю платформу (Railway/Render/Fly/VPS с Node 18+).
- Установите зависимости и запустите:
  - `npm install`
  - `npm start`
- Заполните переменные окружения в `.env` (см. `deploy/api/.env.example`). Минимум: `DADATA_TOKEN`.

## Примечания

- `deploy/hosting/` содержит полные копии статических файлов, включая `data/` и `photos/`.
- `deploy/api/` копия `server/` без `node_modules` и без реального `.env` (секреты не коммитим).
- SQLite хранится в файле `server/data.sqlite` (создаётся автоматически). Для PaaS с эфемерным диском рекомендуется подключить volume/персистентное хранилище или перейти на внешнюю БД.

