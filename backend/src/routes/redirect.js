const express = require('express');
const NodeCache = require('node-cache');
const pool = require('../db/pool');

const router = express.Router();

// In-process LRU cache — 5 min TTL, avoids Memorystore cost for low-traffic portfolio
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// GET /r/:code — resolve and redirect
router.get('/:code', async (req, res) => {
  const { code } = req.params;

  // Reject obviously invalid codes
  if (!/^[A-Za-z0-9_-]{7}$/.test(code)) {
    return res.status(404).json({ error: 'Not found' });
  }

  // Cache hit — fire-and-forget click increment, return immediately
  const cached = cache.get(code);
  if (cached) {
    pool
      .query('UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1', [code])
      .catch((err) => console.error('Click increment error (cache hit):', err));
    return res.redirect(302, cached);
  }

  try {
    const result = await pool.query(
      'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1 RETURNING original_url',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const { original_url } = result.rows[0];
    cache.set(code, original_url);
    res.redirect(302, original_url);
  } catch (err) {
    console.error('Error resolving short URL:', err);
    res.status(500).json({ error: 'Failed to resolve URL' });
  }
});

module.exports = router;
