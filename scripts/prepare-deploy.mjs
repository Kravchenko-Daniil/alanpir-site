#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const FRONTEND_DIR = path.join(root, 'frontend');
const BACKEND_DIR = path.join(root, 'backend');
const DEPLOY_DIR = path.join(root, 'deploy');
const HOSTING_DIR = path.join(DEPLOY_DIR, 'hosting');
const API_DIR = path.join(DEPLOY_DIR, 'api');

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function copyFile(src, dst) {
  ensureDir(path.dirname(dst));
  fs.copyFileSync(src, dst);
  console.log('COPY', path.relative(root, src), '→', path.relative(root, dst));
}

function copyDir(srcDir, dstDir, { ignore = [] } = {}) {
  ensureDir(dstDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const src = path.join(srcDir, e.name);
    const dst = path.join(dstDir, e.name);
    const rel = path.relative(root, src).replace(/\\/g, '/');
    if (ignore.some((pat) => rel.match(pat))) continue;
    if (e.isDirectory()) copyDir(src, dst, { ignore }); else copyFile(src, dst);
  }
}

function main() {
  if (fs.existsSync(DEPLOY_DIR)) fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
  ensureDir(HOSTING_DIR);
  ensureDir(API_DIR);

  if (!fs.existsSync(FRONTEND_DIR)) {
    console.error('ERROR: frontend/ not found');
    process.exit(1);
  }
  copyDir(FRONTEND_DIR, HOSTING_DIR);

  if (fs.existsSync(BACKEND_DIR)) {
    copyDir(BACKEND_DIR, API_DIR, {
      ignore: [
        /(^|\/)node_modules(\/|$)/,
        /\.env(\..*)?$/,
        /data\.sqlite(-wal|-shm)?$/,
      ],
    });
    const envTemplate = `# === АланПир API — PROD .env ===
# Обязательно:
DADATA_TOKEN=
# (Опционально, если хотите давать фронту публичный токен)
DADATA_PUBLIC_TOKEN=

# Почта для уведомлений (опционально)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
MAIL_ORDER_TO=

# SQLite (необязательно — путь к файлу БД)
# DB_FILE=
`;
    fs.writeFileSync(path.join(API_DIR, '.env.example'), envTemplate, 'utf8');
    console.log('WRITE', path.relative(root, path.join(API_DIR, '.env.example')));
  } else {
    console.warn('WARN: backend/ not found, skipping API bundle');
  }

  console.log('\nDone.');
  console.log('  deploy/hosting/ → залить в корень домена на REG.RU через ISPmanager');
  console.log('  deploy/api/     → развернуть на VPS/PaaS (Node 18+)');
}

main();
