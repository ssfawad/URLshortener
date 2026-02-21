require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const pool = require('./db/pool');
const shortenRouter = require('./routes/shorten');
const redirectRouter = require('./routes/redirect');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Health check — used by Cloud Run startup/liveness probes
app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));

app.use('/api', shortenRouter);
app.use('/r', redirectRouter);

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS urls (
      id          SERIAL PRIMARY KEY,
      short_code  VARCHAR(10) UNIQUE NOT NULL,
      original_url TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      click_count INTEGER DEFAULT 0
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls (short_code)
  `);
}

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
