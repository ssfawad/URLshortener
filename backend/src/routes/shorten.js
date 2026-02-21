const express = require('express');
const { nanoid } = require('nanoid');
const pool = require('../db/pool');

const router = express.Router();

// POST /api/shorten — create a short URL
router.post('/shorten', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'url is required' });
  }

  if (url.length > 2048) {
    return res.status(400).json({ error: 'URL too long (max 2048 characters)' });
  }

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).json({ error: 'Invalid URL. Must start with http:// or https://' });
    }
  } catch {
    return res.status(400).json({ error: 'Invalid URL. Must start with http:// or https://' });
  }

  const code = nanoid(7);

  try {
    await pool.query(
      'INSERT INTO urls (short_code, original_url) VALUES ($1, $2)',
      [code, url]
    );

    res.status(201).json({ code, originalUrl: url });
  } catch (err) {
    console.error('Error creating short URL:', err);
    res.status(500).json({ error: 'Failed to create short URL' });
  }
});

// GET /api/stats/:code — fetch click count and metadata
router.get('/stats/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const result = await pool.query(
      'SELECT short_code, original_url, created_at, click_count FROM urls WHERE short_code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
