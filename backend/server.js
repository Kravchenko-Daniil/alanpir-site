// Optional dotenv loading (won't crash if not installed)
try {
  const { default: dotenv } = await import('dotenv');
  dotenv.config();
} catch (e) {
  // Fallback: lightweight .env reader if dotenv not installed
  try {
    const fs = await import('fs');
    const pathMod = await import('path');
    const envPath = pathMod.default.join(__dirname, '.env');
    if (fs.default.existsSync(envPath)) {
      const lines = fs.default.readFileSync(envPath, 'utf8').split(/\r?\n/);
      for (const line of lines) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!m) continue;
        const key = m[1];
        let val = m[2];
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\'') && val.endsWith('\''))) {
          val = val.slice(1, -1);
        }
        if (!(key in process.env)) process.env[key] = val;
      }
    }
  } catch {}
}

import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data.sqlite');
const HASH_ALGO = 'sha256';
const DADATA_TOKEN = process.env.DADATA_TOKEN || '';
const DADATA_PUBLIC_TOKEN = process.env.DADATA_PUBLIC_TOKEN || process.env.DADATA_TOKEN || '';
// Email (admin notifications)
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_SECURE = /^true$/i.test(process.env.SMTP_SECURE || 'false');
const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER || '';
const MAIL_TO = process.env.MAIL_ORDER_TO || process.env.MAIL_TO || '';

// Ensure fetch is available (Node 18+ has global fetch)
let fetchFn = globalThis.fetch;
if (!fetchFn) {
  try {
    const { default: nodeFetch } = await import('node-fetch');
    fetchFn = nodeFetch;
  } catch (_) {
    // will handle later if called
  }
}

app.use(cors());
app.use(express.json());

// --- SQLite setup
sqlite3.verbose();
const db = new sqlite3.Database(DB_FILE);
db.serialize(() => {
  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA synchronous = NORMAL');
  db.run('PRAGMA busy_timeout = 5000');
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL,
    salt TEXT NOT NULL,
    hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT,
    name TEXT,
    address TEXT,
    payment_method TEXT,
    items_json TEXT NOT NULL,
    promo TEXT,
    subtotal INTEGER NOT NULL,
    discount INTEGER NOT NULL,
    delivery INTEGER NOT NULL,
    total INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);
});

// --- Email helper (lazy-loaded nodemailer) ---
let _mailer = null;
async function getMailer() {
  if (_mailer !== null) return _mailer;
  try {
    const mod = await import('nodemailer');
    const nodemailer = mod.default || mod;
    if (!SMTP_HOST || !MAIL_FROM || !MAIL_TO) { _mailer = null; return _mailer; }
    _mailer = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
    });
    return _mailer;
  } catch {
    _mailer = null; return _mailer;
  }
}
function escapeHtml(s='') { return String(s).replace(/[&<>\"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }
async function sendOrderEmail(orderRow, payload) {
  try {
    const mailer = await getMailer();
    if (!mailer) return;
    const items = Array.isArray(payload?.items) ? payload.items : [];
    const itemsHtml = items.map(i => `
      <tr>
        <td style="padding:6px 8px; border:1px solid #eee;">${escapeHtml(i.title || i.name || '')}</td>
        <td style="padding:6px 8px; border:1px solid #eee; text-align:center;">${i.qty}</td>
        <td style="padding:6px 8px; border:1px solid #eee; text-align:right;">${(i.price*i.qty).toLocaleString('ru-RU')} ₽</td>
      </tr>`).join('');
    const totalsHtml = `
      <tr><td colspan="2" style="padding:6px 8px; border:1px solid #eee; text-align:right;">Сумма</td><td style="padding:6px 8px; border:1px solid #eee; text-align:right;">${(payload?.subtotal||0).toLocaleString('ru-RU')} ₽</td></tr>
      <tr><td colspan="2" style="padding:6px 8px; border:1px solid #eee; text-align:right;">Скидка</td><td style="padding:6px 8px; border:1px solid #eee; text-align:right;">${(payload?.discount||0).toLocaleString('ru-RU')} ₽</td></tr>
      <tr><td colspan="2" style="padding:6px 8px; border:1px solid #eee; text-align:right;">Доставка</td><td style="padding:6px 8px; border:1px solid #eee; text-align:right;">${(payload?.delivery||0).toLocaleString('ru-RU')} ₽</td></tr>
      <tr><td colspan="2" style="padding:6px 8px; border:1px solid #eee; text-align:right;"><strong>Итого</strong></td><td style="padding:6px 8px; border:1px solid #eee; text-align:right;"><strong>${(payload?.total||0).toLocaleString('ru-RU')} ₽</strong></td></tr>`;
    const deliveryHtml = payload?.deliveryTime ? `<p><strong>Доставить:</strong> к ${escapeHtml(payload.deliveryTime)}</p>` : `<p><strong>Доставить:</strong> как можно скорее</p>`;
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;">
        <h2 style="margin:0 0 6px;">Новый заказ №${orderRow.id}</h2>
        <p style="margin:0 0 12px; color:#666;">${new Date(orderRow.created_at).toLocaleString('ru-RU')}</p>
        <p><strong>Имя:</strong> ${escapeHtml(payload?.name||'')}</p>
        <p><strong>Телефон:</strong> ${escapeHtml(payload?.phone||'')}</p>
        <p><strong>Адрес:</strong> ${escapeHtml(orderRow.address||payload?.address||'')}</p>
        ${deliveryHtml}
        <p><strong>Оплата:</strong> ${escapeHtml(orderRow.payment_method||payload?.paymentMethod||'')}</p>
        ${payload?.promo ? `<p><strong>Промокод:</strong> ${escapeHtml(payload.promo)}</p>` : ''}
        <table style="border-collapse:collapse; min-width:420px; margin:8px 0 12px;">
          <thead>
            <tr>
              <th style="padding:6px 8px; border:1px solid #eee; text-align:left;">Позиция</th>
              <th style="padding:6px 8px; border:1px solid #eee; text-align:center;">Кол-во</th>
              <th style="padding:6px 8px; border:1px solid #eee; text-align:right;">Сумма</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>${totalsHtml}</tfoot>
        </table>
        <p style="color:#666;">Письмо сгенерировано автоматически.</p>
      </div>`;
    const subject = `Новый заказ №${orderRow.id} — ${(payload?.total||0).toLocaleString('ru-RU')} ₽`;
    await mailer.sendMail({ from: MAIL_FROM, to: MAIL_TO, subject, html });
  } catch (e) {
    console.error('[mail] send failed:', e?.message || e);
  }
}

function normalizePhone(input) {
  const digits = String(input || '').replace(/\D+/g, '');
  if (!digits) return '';
  let num = digits;
  if (digits.length === 11 && (digits.startsWith('8') || digits.startsWith('7'))) {
    num = '7' + digits.slice(1);
  } else if (digits.length === 10) {
    num = '7' + digits;
  }
  return '+' + num;
}

function hashPassword(password, salt) {
  return crypto.createHmac(HASH_ALGO, salt).update(password).digest('hex');
}

app.post('/api/auth/register', (req, res) => {
  const { phone, password } = req.body || {};
  const norm = normalizePhone(phone);
  if (!/^\+7\d{10}$/.test(norm)) return res.status(400).json({ ok: false, error: 'INVALID_PHONE' });
  if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ ok: false, error: 'WEAK_PASSWORD' });

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(password, salt);
  const createdAt = new Date().toISOString();

  const stmt = db.prepare('INSERT INTO users (phone, salt, hash, created_at) VALUES (?, ?, ?, ?)');
  stmt.run(norm, salt, hash, createdAt, function (err) {
    if (err) {
      if (err.message && err.message.includes('UNIQUE')) return res.status(409).json({ ok: false, error: 'USER_EXISTS' });
      return res.status(500).json({ ok: false, error: 'DB_ERROR' });
    }
    res.json({ ok: true, phone: norm });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { phone, password } = req.body || {};
  const norm = normalizePhone(phone);
  if (!/^\+7\d{10}$/.test(norm)) return res.status(400).json({ ok: false, error: 'INVALID_PHONE' });

  db.get('SELECT salt, hash FROM users WHERE phone = ?', [norm], (err, row) => {
    if (err) return res.status(500).json({ ok: false, error: 'DB_ERROR' });
    if (!row) return res.status(401).json({ ok: false, error: 'NO_USER' });
    const calc = hashPassword(password || '', row.salt);
    if (calc !== row.hash) return res.status(401).json({ ok: false, error: 'BAD_CREDENTIALS' });
    res.json({ ok: true, phone: norm });
  });
});

app.post('/api/orders', (req, res) => {
  const {
    phone = null,
    name = null,
    address = null,
    addressData = null,
    paymentMethod = 'cash',
    items = [],
    promo = null,
    subtotal = 0,
    discount = 0,
    delivery = 0,
    total = 0
  } = req.body || {};

  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ ok: false, error: 'EMPTY_CART' });
  }

  // Basic + optional external validation for delivery address
  const hasBasic = !!(address && String(address).trim());
  const structured = addressData && typeof addressData === 'object' ? addressData : null;
  const street = structured?.street?.trim?.() || '';
  const house = structured?.house?.trim?.() || '';
  // If token present try to validate via DaData suggest (house-level)
  const validateWithDaData = async () => {
    if (!DADATA_TOKEN || !fetchFn) return { ok: false, reason: 'NO_DADATA' };
    try {
      const parts = [];
      // Moscow by default (adjust if you serve another city)
      parts.push('Москва');
      if (street) parts.push(street);
      if (house) parts.push(house);
      const q = parts.join(', ');
      const body = {
        query: q,
        count: 5,
        locations: [{ kladr_id: '7700000000000' }],
        from_bound: { value: 'house' },
        to_bound: { value: 'house' },
        restrict_value: true
      };
      const r = await fetchFn('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token ${DADATA_TOKEN}`
        },
        body: JSON.stringify(body)
      });
      const data = await r.json().catch(()=>({}));
      const best = (data?.suggestions || [])[0];
      if (!best) return { ok: false, reason: 'NO_MATCH' };
      const d = best.data || {};
      // Require at least street + house present in suggestion
      if (!d.street || !(d.house || d.house_fias_id || d.fias_id)) return { ok: false, reason: 'INCOMPLETE' };
      const addrStr = best.value || [d.city_with_type, d.street_with_type, d.house_type && d.house ? `${d.house_type} ${d.house}` : d.house].filter(Boolean).join(', ');
      return { ok: true, normalized: addrStr, data: d };
    } catch (_) {
      return { ok: false, reason: 'DADATA_ERROR' };
    }
  };

  const validateBasic = () => {
    // Minimal checks when there is no DaData token: require street+house if structured provided
    if (structured) {
      if (!street || !house) return { ok: false, reason: 'NEED_STREET_HOUSE' };
      // Simple heuristics: street contains letters; house has digits
      if (!/[A-Za-zА-Яа-яЁё]/.test(street)) return { ok: false, reason: 'BAD_STREET' };
      if (!/\d/.test(house)) return { ok: false, reason: 'BAD_HOUSE' };
      return { ok: true };
    }
    // If only freeform address string passed, ensure reasonable length and cyrillic letters
    if (!hasBasic) return { ok: false, reason: 'NO_ADDRESS' };
    const s = String(address).trim();
    if (s.length < 8) return { ok: false, reason: 'ADDRESS_TOO_SHORT' };
    if (!/[A-Za-zА-Яа-яЁё]/.test(s)) return { ok: false, reason: 'ADDRESS_NOT_TEXT' };
    return { ok: true };
  };

  const proceed = async () => {
    if (DADATA_TOKEN && structured) {
      const v = await validateWithDaData();
      if (!v.ok) return res.status(400).json({ ok: false, error: 'ADDRESS_INVALID', reason: v.reason });
      // Prefer normalized
      let normalized = v.normalized || address;
      // append additional details from structured address
      const extras = [];
      if (structured?.apt) extras.push(`кв. ${structured.apt}`);
      if (structured?.entrance) extras.push(`подъезд ${structured.entrance}`);
      if (structured?.floor) extras.push(`этаж ${structured.floor}`);
      if (structured?.code) extras.push(`домофон ${structured.code}`);
      if (extras.length) normalized = `${normalized}, ${extras.join(', ')}`;
      const createdAt = new Date().toISOString();
      const stmt = db.prepare(`INSERT INTO orders (phone, name, address, payment_method, items_json, promo, subtotal, discount, delivery, total, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      stmt.run(phone, name, normalized, paymentMethod, JSON.stringify(items), promo, subtotal, discount, delivery, total, 'new', createdAt, function (err) {
        if (err) return res.status(500).json({ ok: false, error: 'DB_ERROR' });
        const orderId = this.lastID;
        res.json({ ok: true, orderId });
        db.get('SELECT * FROM orders WHERE id = ?', [orderId], (e2, row) => { if (!e2 && row) sendOrderEmail(row, req.body).catch(()=>{}); });
      });
      return;
    }
    // Fallback basic validation
    const vb = validateBasic();
    if (!vb.ok) return res.status(400).json({ ok: false, error: 'ADDRESS_INVALID', reason: vb.reason });
    const createdAt = new Date().toISOString();
    const stmt = db.prepare(`INSERT INTO orders (phone, name, address, payment_method, items_json, promo, subtotal, discount, delivery, total, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    stmt.run(phone, name, address, paymentMethod, JSON.stringify(items), promo, subtotal, discount, delivery, total, 'new', createdAt, function (err) {
      if (err) return res.status(500).json({ ok: false, error: 'DB_ERROR' });
      const orderId = this.lastID;
      res.json({ ok: true, orderId });
      db.get('SELECT * FROM orders WHERE id = ?', [orderId], (e2, row) => { if (!e2 && row) sendOrderEmail(row, req.body).catch(()=>{}); });
    });
  };

  return void proceed();
});

app.get('/api/orders/:id', (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ ok: false, error: 'DB_ERROR' });
    if (!row) return res.status(404).json({ ok: false, error: 'NOT_FOUND' });
    res.json({ ok: true, order: row });
  });
});

// List orders by phone (simple profile history)
app.get('/api/orders', (req, res) => {
  const { phone = '', limit = '50' } = req.query || {};
  const norm = normalizePhone(phone);
  if (!/^\+7\d{10}$/.test(norm)) return res.status(400).json({ ok: false, error: 'INVALID_PHONE' });
  const lim = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 200);
  db.all('SELECT * FROM orders WHERE phone = ? ORDER BY datetime(created_at) DESC LIMIT ?', [norm, lim], (err, rows) => {
    if (err) return res.status(500).json({ ok: false, error: 'DB_ERROR' });
    res.json({ ok: true, orders: rows || [] });
  });
});

// Address suggestions via DaData (Moscow only)
app.get('/api/suggest/address', async (req, res) => {
  const q = (req.query.query || '').toString();
  const fromBound = (req.query.from || 'street').toString();
  const toBound = (req.query.to || 'house').toString();
  if (!q) return res.status(400).json({ ok: false, error: 'EMPTY_QUERY' });
  if (!DADATA_TOKEN) {
    // Нет токена — возвращаем пустые подсказки без ошибки, чтобы фронт работал тихо
    return res.json({ ok: true, suggestions: [] });
  }
  try {
    const body = {
      query: q,
      count: 10,
      // Ограничиваем Москвой по FIAS/ISO
      locations: [{
        country_iso_code: 'RU',
        region_fias_id: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
        region_iso_code: 'RU-MOW',
        city_fias_id: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5'
      }],
      from_bound: { value: fromBound },
      to_bound: { value: toBound },
      restrict_value: true
    };
    if (!fetchFn) return res.status(500).json({ ok: false, error: 'NO_FETCH_RUNTIME' });
    const r = await fetchFn('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ${DADATA_TOKEN}`
      },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    const list = (data?.suggestions || []).map((s) => {
      const d = s?.data || {};
      const parts = [];
      if (d.house) parts.push(d.house);
      if (d.block) parts.push(`к ${d.block}`);
      if (d.building) parts.push(`стр ${d.building}`);
      const houseLabel = parts.join(' ').trim();
      return {
        value: s?.value,
        street: d.street_with_type || d.street || '',
        house: houseLabel || d.house || '',
        house_type: d.house_type || '',
        fias_id: d.fias_id || null,
        data: d
      };
    });
    res.json({ ok: true, suggestions: list });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'SUGGEST_FAILED' });
  }
});

// Public config for frontend (exposes only safe values)
app.get('/api/config', (req, res) => {
  res.json({ ok: true, dadataPublicToken: DADATA_PUBLIC_TOKEN });
});

// Validate address endpoint (used by frontend when adding addresses)
app.post('/api/validate/address', async (req, res) => {
  const {
    street = '',
    house = '',
    apt = '',
  } = req.body || {};

  const s = String(street || '').trim();
  const h = String(house || '').trim();
  if (!s || !h) return res.status(400).json({ ok: false, error: 'NEED_STREET_HOUSE' });

  // Try DaData first if token present
  if (DADATA_TOKEN && fetchFn) {
    try {
      const q = ['Москва', s, h].filter(Boolean).join(', ');
      const body = {
        query: q,
        count: 5,
        locations: [{
          country_iso_code: 'RU',
          region_fias_id: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          region_iso_code: 'RU-MOW',
          city_fias_id: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5'
        }],
        from_bound: { value: 'house' },
        to_bound: { value: 'house' },
        restrict_value: true
      };
      const r = await fetchFn('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token ${DADATA_TOKEN}`
        },
        body: JSON.stringify(body)
      });
      const data = await r.json().catch(()=>({}));
      const best = (data?.suggestions || [])[0];
      if (!best) return res.status(400).json({ ok: false, error: 'NO_MATCH' });
      const d = best.data || {};
      if (!d.street || !(d.house || d.fias_id)) return res.status(400).json({ ok: false, error: 'INCOMPLETE' });
      const addrStr = best.value || [d.city_with_type, d.street_with_type, d.house_type && d.house ? `${d.house_type} ${d.house}` : d.house, apt && `кв. ${apt}`].filter(Boolean).join(', ');
      return res.json({ ok: true, address: addrStr, data: d });
    } catch (e) {
      // fallthrough to basic
    }
  }

  // Basic heuristics if no token: ensure Russian letters in street and digits in house
  if (!/[A-Za-zА-Яа-яЁё]/.test(s)) return res.status(400).json({ ok: false, error: 'BAD_STREET' });
  if (!/\d/.test(h)) return res.status(400).json({ ok: false, error: 'BAD_HOUSE' });
  return res.json({ ok: true, address: ['Москва', s, `д. ${h}`, apt && `кв. ${apt}`].filter(Boolean).join(', ') });
});

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});
