require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2/promise');
const serverless = require('serverless-http');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Supaya route tetap aman baik dipanggil via /api/* ataupun /.netlify/functions/api/*
app.use((req, _res, next) => {
  req.url = req.url.replace(/^\/\.netlify\/functions\/api/, '');
  next();
});

const DB_SSL = String(process.env.DB_SSL || 'false').toLowerCase() === 'true';
const DB_SSL_REJECT_UNAUTHORIZED = String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'false').toLowerCase() === 'true';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  charset: 'utf8mb4',
  ...(DB_SSL ? { ssl: { rejectUnauthorized: DB_SSL_REJECT_UNAUTHORIZED } } : {})
});

const defaultNotes = {
  intro: 'Hai cantik. Hari ini kamu tetap manis, tetap kuat, dan tetap orang yang aku pilih buat pulang.',
  calendar: 'Satu tanggal kecil bisa jadi memori besar kalau isinya kita.',
  day: 'Apa pun jadwalnya, validasinya tetap sama: kamu cantik hari ini dan aku bangga sama kamu.',
  music: 'Pilih lagu yang paling kamu suka. Biar rutinitas kita punya soundtrack sendiri.',
  notes: 'Reminder kecil: kamu cukup, kamu dicintai, dan kamu nggak harus sempurna buat disayang.'
};

const defaultTemplates = {
  1: [
    ['07:15', 'Pergi kantor bersama', 'Start weekday dengan ketemu Green dulu.', 'work'],
    ['18:15', 'Pulang kantor bersama', 'Kalau hari berat, pulangnya tetap bareng.', 'work'],
    ['19:30', 'Dinner kalau pulang cepat', 'Makan malam santai, no pressure.', 'date'],
    ['21:00', 'Quality time kecil', 'Ngobrol, validasi, lalu istirahat.', 'love']
  ],
  2: [
    ['07:15', 'Pergi kantor bersama', 'Rutinitas kecil yang bikin hari lebih ringan.', 'work'],
    ['18:15', 'Pulang kantor bersama', 'Cerita random di jalan pulang.', 'work'],
    ['19:30', 'Dinner kalau pulang cepat', 'Cari makan yang simple tapi happy.', 'date'],
    ['21:00', 'Slow night', 'Recharge bareng sebelum tidur.', 'love']
  ],
  3: [
    ['07:15', 'Pergi kantor bersama', 'Midweek tapi tetap ada kita.', 'work'],
    ['18:15', 'Pulang kantor bersama', 'Pegang ritme pelan-pelan.', 'work'],
    ['19:30', 'Makan malam / snack', 'Kalau capek, beli yang gampang aja.', 'date'],
    ['21:00', 'Check-in perasaan', 'Tanya: hari ini kamu baik-baik aja?', 'love']
  ],
  4: [
    ['07:15', 'Pergi kantor bersama', 'Kamis rasa hampir weekend.', 'work'],
    ['18:15', 'Pulang kantor bersama', 'Pulang sambil rencana Jumat.', 'work'],
    ['19:30', 'Dinner kalau pulang cepat', 'Makan dan ngobrol hal lucu.', 'date'],
    ['21:00', 'Quality time', 'Biar minggu kerja nggak terasa sendirian.', 'love']
  ],
  5: [
    ['18:30', 'Friday reward start', 'Pulang kantor, mode fun on.', 'date'],
    ['19:30', 'Nonton / karaoke / BXC', 'Bebas pilih mood hari ini.', 'fun'],
    ['22:00', 'Late snack + cerita', 'Tutup minggu kerja dengan happy.', 'love']
  ],
  6: [
    ['12:00', 'Date day mulai', 'Jalan dari siang sampai malam.', 'date'],
    ['14:00', 'Tempat viral / cafe hopping', 'Cari yang lucu buat difoto dan dikenang.', 'fun'],
    ['17:30', 'Dinner date', 'Makan enak tanpa buru-buru.', 'date'],
    ['20:00', 'Night walk', 'Jalan santai, foto, ngobrol.', 'love']
  ],
  0: [
    ['08:00', 'Laundry', 'Cuci baju biar minggu depan ringan.', 'home'],
    ['10:00', 'Bersih-bersih rumah', 'Rumah rapi, pikiran ikut rapi.', 'home'],
    ['12:00', 'Meal prep', 'Siapin bekal dan makanan simple.', 'home'],
    ['14:00', 'Kamar mandi + room reset', 'Reset kecil buat hidup yang lebih nyaman.', 'home'],
    ['19:00', 'Jalan ke Centraland', 'Slow night sebelum Senin datang.', 'date']
  ]
};

function normalizeEvents(events = []) {
  return events
    .filter((event) => event && event.time && event.title)
    .map((event, index) => ({
      time: String(event.time).slice(0, 5),
      title: String(event.title).trim().slice(0, 160),
      note: String(event.note || '').trim(),
      category: String(event.category || 'love').trim().slice(0, 40),
      sort_order: Number.isFinite(Number(event.sort_order)) ? Number(event.sort_order) : index
    }))
    .sort((a, b) => a.time.localeCompare(b.time) || a.sort_order - b.sort_order);
}

function weekdayFromDate(dateText) {
  const date = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.getDay();
}

async function columnExists(tableName, columnName) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );
  return Number(rows[0]?.total || 0) > 0;
}

async function ensureColumn(tableName, columnName, definitionSql) {
  if (!(await columnExists(tableName, columnName))) {
    await pool.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definitionSql}`);
  }
}

let seedPromise = null;
async function seedDefaults() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    const [noteRows] = await pool.query('SELECT COUNT(*) AS total FROM love_notes');
    if (noteRows[0].total === 0) {
      const values = Object.entries(defaultNotes).map(([key, body]) => [key, body]);
      await pool.query('INSERT INTO love_notes (page_key, body) VALUES ?', [values]);
    }

    const [eventRows] = await pool.query('SELECT COUNT(*) AS total FROM schedule_events WHERE event_date IS NULL');
    if (eventRows[0].total === 0) {
      const values = [];
      Object.entries(defaultTemplates).forEach(([weekday, items]) => {
        items.forEach(([time, title, note, category], index) => {
          values.push([Number(weekday), time, title, note, category, index]);
        });
      });
      await pool.query(
        'INSERT INTO schedule_events (weekday, time_value, title, note, category, sort_order) VALUES ?',
        [values]
      );
    }

    const defaultMusicUrl = '/assets/default-romantic.wav';
    try {
      await ensureColumn('music_tracks', 'mime_type', 'VARCHAR(120) NULL AFTER original_filename');
      await ensureColumn('music_tracks', 'audio_data', 'LONGBLOB NULL AFTER mime_type');
      await pool.query("ALTER TABLE music_tracks MODIFY source_type ENUM('default', 'upload') NOT NULL");
    } catch (error) {
      console.warn('Music table migration skipped:', error.message);
    }

    const [musicRows] = await pool.query('SELECT COUNT(*) AS total FROM music_tracks WHERE source_type = ? AND url = ?', ['default', defaultMusicUrl]);
    if (musicRows[0].total === 0) {
      await pool.query('UPDATE music_tracks SET is_active = 0');
      await pool.query(
        `INSERT INTO music_tracks (title, source_type, url, original_filename, is_active)
         VALUES (?, ?, ?, ?, 1)`,
        ['Default Romantic Music', 'default', defaultMusicUrl, 'default-romantic.wav']
      );
    }

    const [activeRows] = await pool.query('SELECT COUNT(*) AS total FROM music_tracks WHERE is_active = 1');
    if (activeRows[0].total === 0) {
      await pool.query('UPDATE music_tracks SET is_active = 1 WHERE source_type = ? AND url = ? LIMIT 1', ['default', defaultMusicUrl]);
    }
  })();
  return seedPromise;
}

app.use(async (_req, _res, next) => {
  try {
    await seedDefaults();
    next();
  } catch (error) {
    next(error);
  }
});

async function getEventsByDate(dateText) {
  const weekday = weekdayFromDate(dateText);
  if (weekday === null) {
    const error = new Error('Tanggal tidak valid. Pakai format YYYY-MM-DD.');
    error.status = 400;
    throw error;
  }

  const [customRows] = await pool.query(
    `SELECT id, DATE_FORMAT(event_date, '%Y-%m-%d') AS event_date, weekday, time_value AS time, title, note, category, sort_order
     FROM schedule_events
     WHERE event_date = ?
     ORDER BY time_value ASC, sort_order ASC`,
    [dateText]
  );

  if (customRows.length > 0) return { source: 'custom', weekday, events: customRows };

  const [defaultRows] = await pool.query(
    `SELECT id, NULL AS event_date, weekday, time_value AS time, title, note, category, sort_order
     FROM schedule_events
     WHERE event_date IS NULL AND weekday = ?
     ORDER BY time_value ASC, sort_order ASC`,
    [weekday]
  );
  return { source: 'default', weekday, events: defaultRows };
}

app.get('/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, storage: 'MariaDB aktif via Netlify Function' });
  } catch (error) {
    next(error);
  }
});
app.get('/api/health', (req, res, next) => app._router.handle({ ...req, url: '/health' }, res, next));

app.get('/notes', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT page_key, body FROM love_notes ORDER BY page_key');
    res.json({ notes: rows });
  } catch (error) { next(error); }
});
app.get('/api/notes', (req, res, next) => app._router.handle({ ...req, url: '/notes' }, res, next));

app.put('/notes/:key', async (req, res, next) => {
  try {
    const key = String(req.params.key || '').slice(0, 60);
    const body = String(req.body.body || '').trim();
    if (!key || !body) return res.status(400).json({ message: 'Note wajib diisi.' });
    await pool.query(
      `INSERT INTO love_notes (page_key, body)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE body = VALUES(body), updated_at = CURRENT_TIMESTAMP`,
      [key, body]
    );
    res.json({ ok: true, note: { page_key: key, body } });
  } catch (error) { next(error); }
});
app.put('/api/notes/:key', (req, res, next) => { req.url = req.url.replace('/api/notes', '/notes'); app._router.handle(req, res, next); });

app.get('/schedule/:date', async (req, res, next) => {
  try { res.json(await getEventsByDate(req.params.date)); } catch (error) { next(error); }
});
app.get('/api/schedule/:date', (req, res, next) => { req.url = req.url.replace('/api/schedule', '/schedule'); app._router.handle(req, res, next); });

app.put('/schedule/:date', async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const dateText = req.params.date;
    const weekday = weekdayFromDate(dateText);
    if (weekday === null) return res.status(400).json({ message: 'Tanggal tidak valid.' });
    const events = normalizeEvents(req.body.events || []);
    await connection.beginTransaction();
    await connection.query('DELETE FROM schedule_events WHERE event_date = ?', [dateText]);
    if (events.length > 0) {
      const values = events.map((event, index) => [dateText, null, event.time, event.title, event.note, event.category, index]);
      await connection.query(
        `INSERT INTO schedule_events (event_date, weekday, time_value, title, note, category, sort_order) VALUES ?`,
        [values]
      );
    }
    await connection.commit();
    res.json({ ok: true, ...(await getEventsByDate(dateText)) });
  } catch (error) { await connection.rollback(); next(error); }
  finally { connection.release(); }
});
app.put('/api/schedule/:date', (req, res, next) => { req.url = req.url.replace('/api/schedule', '/schedule'); app._router.handle(req, res, next); });

app.delete('/schedule/:date', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM schedule_events WHERE event_date = ?', [req.params.date]);
    res.json({ ok: true, ...(await getEventsByDate(req.params.date)) });
  } catch (error) { next(error); }
});
app.delete('/api/schedule/:date', (req, res, next) => { req.url = req.url.replace('/api/schedule', '/schedule'); app._router.handle(req, res, next); });

app.get('/defaults/:weekday', async (req, res, next) => {
  try {
    const weekday = Number(req.params.weekday);
    if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) return res.status(400).json({ message: 'Weekday harus 0-6.' });
    const [rows] = await pool.query(
      `SELECT id, weekday, time_value AS time, title, note, category, sort_order
       FROM schedule_events WHERE event_date IS NULL AND weekday = ? ORDER BY time_value ASC, sort_order ASC`, [weekday]
    );
    res.json({ weekday, events: rows });
  } catch (error) { next(error); }
});
app.get('/api/defaults/:weekday', (req, res, next) => { req.url = req.url.replace('/api/defaults', '/defaults'); app._router.handle(req, res, next); });

app.put('/defaults/:weekday', async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const weekday = Number(req.params.weekday);
    if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) return res.status(400).json({ message: 'Weekday harus 0-6.' });
    const events = normalizeEvents(req.body.events || []);
    await connection.beginTransaction();
    await connection.query('DELETE FROM schedule_events WHERE event_date IS NULL AND weekday = ?', [weekday]);
    if (events.length > 0) {
      const values = events.map((event, index) => [weekday, event.time, event.title, event.note, event.category, index]);
      await connection.query(
        `INSERT INTO schedule_events (weekday, time_value, title, note, category, sort_order) VALUES ?`, [values]
      );
    }
    await connection.commit();
    const [rows] = await pool.query(
      `SELECT id, weekday, time_value AS time, title, note, category, sort_order
       FROM schedule_events WHERE event_date IS NULL AND weekday = ? ORDER BY time_value ASC, sort_order ASC`, [weekday]
    );
    res.json({ ok: true, weekday, events: rows });
  } catch (error) { await connection.rollback(); next(error); }
  finally { connection.release(); }
});
app.put('/api/defaults/:weekday', (req, res, next) => { req.url = req.url.replace('/api/defaults', '/defaults'); app._router.handle(req, res, next); });

app.get('/music', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, source_type, url, original_filename, is_active, created_at FROM music_tracks ORDER BY is_active DESC, created_at DESC`
    );
    res.json({ tracks: rows });
  } catch (error) { next(error); }
});
app.get('/api/music', (req, res, next) => app._router.handle({ ...req, url: '/music' }, res, next));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!String(file.mimetype || '').startsWith('audio/')) return callback(new Error('File harus audio.'));
    callback(null, true);
  }
});

app.post('/music/upload', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File audio belum dipilih.' });
    const title = String(req.body.title || req.file.originalname || 'Uploaded Song').trim().slice(0, 180);
    const [result] = await pool.query(
      `INSERT INTO music_tracks (title, source_type, url, original_filename, mime_type, audio_data) VALUES (?, ?, NULL, ?, ?, ?)`,
      [title, 'upload', req.file.originalname, req.file.mimetype, req.file.buffer]
    );
    const id = result.insertId;
    const url = `/api/music/${id}/audio`;
    await pool.query('UPDATE music_tracks SET url = ? WHERE id = ?', [url, id]);
    res.json({ ok: true, track: { id, title, source_type: 'upload', url, original_filename: req.file.originalname } });
  } catch (error) { next(error); }
});
app.post('/api/music/upload', (req, res, next) => { req.url = req.url.replace('/api/music', '/music'); app._router.handle(req, res, next); });

app.get('/music/:id/audio', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query('SELECT title, original_filename, mime_type, audio_data FROM music_tracks WHERE id = ? AND source_type = ?', [id, 'upload']);
    const track = rows[0];
    if (!track || !track.audio_data) return res.status(404).json({ message: 'Audio tidak ditemukan.' });
    res.setHeader('Content-Type', track.mime_type || 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(track.audio_data);
  } catch (error) { next(error); }
});
app.get('/api/music/:id/audio', (req, res, next) => { req.url = req.url.replace('/api/music', '/music'); app._router.handle(req, res, next); });

app.post('/music/:id/active', async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const id = Number(req.params.id);
    await connection.beginTransaction();
    await connection.query('UPDATE music_tracks SET is_active = 0');
    await connection.query('UPDATE music_tracks SET is_active = 1 WHERE id = ?', [id]);
    await connection.commit();
    const [rows] = await pool.query('SELECT id, title, source_type, url, original_filename, is_active, created_at FROM music_tracks WHERE id = ?', [id]);
    res.json({ ok: true, active: rows[0] || null });
  } catch (error) { await connection.rollback(); next(error); }
  finally { connection.release(); }
});
app.post('/api/music/:id/active', (req, res, next) => { req.url = req.url.replace('/api/music', '/music'); app._router.handle(req, res, next); });

app.delete('/music/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query('SELECT * FROM music_tracks WHERE id = ?', [id]);
    const track = rows[0];
    if (track && track.source_type === 'default') return res.status(400).json({ message: 'Default romantic music tidak bisa dihapus.' });
    await pool.query('DELETE FROM music_tracks WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch (error) { next(error); }
});
app.delete('/api/music/:id', (req, res, next) => { req.url = req.url.replace('/api/music', '/music'); app._router.handle(req, res, next); });

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || 'Server error.' });
});

exports.handler = serverless(app, {
  binary: ['audio/*', 'application/octet-stream']
});
