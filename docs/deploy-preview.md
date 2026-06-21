# Превью на my-hetzner — временный

Развёрнуто 2026-05-27 на замену умершему my-4vps. Это **временно** —
после получения постоянного VPS под бэк (см. roadmap 1.11) удаляем
полностью с этого хоста.

## URL

- **Сайт**: http://46.225.125.127:8080/
- **API**: http://46.225.125.127:8080/api/

(Порт 8080 — чтобы не конфликтовать с уже работающим nginx 80/443 на этом VPS, где крутится wado-vpn.)

## Что лежит на сервере

| Путь | Что |
|---|---|
| `/opt/alanpir-api/` | Backend Node + SQLite БД (`data.sqlite*`) |
| `/var/www/alanpir-next/` | Статика фронта (next export) |
| `/etc/nginx/sites-available/alanpir-preview` | nginx-конфиг порта 8080 |
| `/etc/nginx/sites-enabled/alanpir-preview` | симлинк |
| pm2 process `alanpir-api` | Node-сервер на 127.0.0.1:3000 |
| `/opt/alanpir-cleanup.sh` | Скрипт полного удаления |

Установлены системно (apt): **Node 20** (через NodeSource), **pm2** (через npm -g).
Они оставлены — могут пригодиться. Команды для их удаления — в конце `cleanup.sh`.

## Перезалив

### Фронт

```bash
cd frontend-next
NEXT_PUBLIC_API_BASE= npm run build
ssh my-hetzner 'rm -rf /var/www/alanpir-next/*'
scp -r out/. my-hetzner:/var/www/alanpir-next/
```

`NEXT_PUBLIC_API_BASE=` (пустая) важна — тогда фронт делает relative-запросы, не зашивает IP в bundle.

### Бэк

```bash
rsync -az --exclude node_modules --exclude '*.sqlite*' --exclude '.env*' backend/ my-hetzner:/opt/alanpir-api/
ssh my-hetzner 'cd /opt/alanpir-api && npm ci --omit=dev && pm2 restart alanpir-api'
```

Если меняли `.env`:
```bash
scp backend/.env my-hetzner:/opt/alanpir-api/.env
ssh my-hetzner 'pm2 restart alanpir-api'
```

## Удалить полностью

```bash
ssh my-hetzner '/opt/alanpir-cleanup.sh'
```

Скрипт сносит: pm2 процесс, nginx-конфиг, обе папки приложений, потом сам удаляется. Node/pm2 не трогает (см. опциональный блок в конце скрипта).
