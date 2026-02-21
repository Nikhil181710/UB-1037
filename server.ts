import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = 'health-innovate-secret-key';

// Database setup
const db = new Database('health.db');
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    time TEXT,
    stock INTEGER DEFAULT 0,
    refillThreshold INTEGER DEFAULT 5,
    lastTaken DATETIME,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS health_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    type TEXT NOT NULL, -- 'bp' or 'sugar'
    systolic INTEGER,
    diastolic INTEGER,
    value REAL, -- for sugar
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    title TEXT NOT NULL,
    doctor TEXT,
    date DATETIME NOT NULL,
    attended BOOLEAN DEFAULT 0,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'pdf' or 'image'
    path TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS sos_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    latitude REAL,
    longitude REAL,
    audioPath TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

app.use(express.json());

// Multer setup for reports
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- API Routes ---

// Auth
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashedPassword);
    const token = jwt.sign({ id: result.lastInsertRowid, email, name }, JWT_SECRET);
    res.json({ token, user: { id: result.lastInsertRowid, name, email } });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Medications
app.get('/api/medications', authenticate, (req: any, res) => {
  const meds = db.prepare('SELECT * FROM medications WHERE userId = ?').all(req.user.id);
  res.json(meds);
});

app.post('/api/medications', authenticate, (req: any, res) => {
  const { name, dosage, frequency, time, stock, refillThreshold } = req.body;
  const result = db.prepare('INSERT INTO medications (userId, name, dosage, frequency, time, stock, refillThreshold) VALUES (?, ?, ?, ?, ?, ?, ?)').run(req.user.id, name, dosage, frequency, time, stock, refillThreshold);
  res.json({ id: result.lastInsertRowid });
});

app.post('/api/medications/:id/take', authenticate, (req: any, res) => {
  const med: any = db.prepare('SELECT * FROM medications WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
  if (med && med.stock > 0) {
    db.prepare('UPDATE medications SET stock = stock - 1, lastTaken = CURRENT_TIMESTAMP WHERE id = ?').run(req.params.id);
    res.json({ success: true, newStock: med.stock - 1 });
  } else {
    res.status(400).json({ error: 'Out of stock or not found' });
  }
});

app.delete('/api/medications/:id', authenticate, (req: any, res) => {
  db.prepare('DELETE FROM medications WHERE id = ? AND userId = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

// Health Metrics
app.get('/api/health-metrics', authenticate, (req: any, res) => {
  const metrics = db.prepare('SELECT * FROM health_metrics WHERE userId = ? ORDER BY timestamp DESC LIMIT 50').all(req.user.id);
  res.json(metrics);
});

app.post('/api/health-metrics', authenticate, (req: any, res) => {
  const { type, systolic, diastolic, value } = req.body;
  const result = db.prepare('INSERT INTO health_metrics (userId, type, systolic, diastolic, value) VALUES (?, ?, ?, ?, ?)').run(req.user.id, type, systolic, diastolic, value);
  res.json({ id: result.lastInsertRowid });
});

// Appointments
app.get('/api/appointments', authenticate, (req: any, res) => {
  const appointments = db.prepare('SELECT * FROM appointments WHERE userId = ? ORDER BY date ASC').all(req.user.id);
  res.json(appointments);
});

app.post('/api/appointments', authenticate, (req: any, res) => {
  const { title, doctor, date } = req.body;
  const result = db.prepare('INSERT INTO appointments (userId, title, doctor, date) VALUES (?, ?, ?, ?)').run(req.user.id, title, doctor, date);
  res.json({ id: result.lastInsertRowid });
});

app.post('/api/appointments/:id/attend', authenticate, (req: any, res) => {
  db.prepare('UPDATE appointments SET attended = 1 WHERE id = ? AND userId = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

app.delete('/api/appointments/:id', authenticate, (req: any, res) => {
  db.prepare('DELETE FROM appointments WHERE id = ? AND userId = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

// Reports
app.get('/api/reports', authenticate, (req: any, res) => {
  const reports = db.prepare('SELECT * FROM reports WHERE userId = ? ORDER BY timestamp DESC').all(req.user.id);
  res.json(reports);
});

app.post('/api/reports', authenticate, upload.single('report'), (req: any, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const { name, type } = req.body;
  const result = db.prepare('INSERT INTO reports (userId, name, type, path) VALUES (?, ?, ?, ?)').run(req.user.id, name, type, req.file.path);
  res.json({ id: result.lastInsertRowid, path: req.file.path });
});

app.delete('/api/reports/:id', authenticate, (req: any, res) => {
  const report: any = db.prepare('SELECT * FROM reports WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
  if (report) {
    if (fs.existsSync(report.path)) fs.unlinkSync(report.path);
    db.prepare('DELETE FROM reports WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Report not found' });
  }
});

app.get('/api/reports/:id/download', authenticate, (req: any, res) => {
  const report: any = db.prepare('SELECT * FROM reports WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
  if (report && fs.existsSync(report.path)) {
    res.download(report.path, report.name);
  } else {
    res.status(404).json({ error: 'Report not found' });
  }
});

// SOS
app.post('/api/sos', authenticate, upload.single('audio'), (req: any, res) => {
  const { latitude, longitude } = req.body;
  const audioPath = req.file ? req.file.path : null;
  const result = db.prepare('INSERT INTO sos_logs (userId, latitude, longitude, audioPath) VALUES (?, ?, ?, ?)').run(req.user.id, latitude, longitude, audioPath);
  res.json({ id: result.lastInsertRowid });
});

// Serve static files from uploads
app.use('/uploads', express.static('uploads'));

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
