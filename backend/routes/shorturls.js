const express = require('express');
const { generateShortCode, getExpiryDate } = require('../helpers/utils');

const router = express.Router();

const urlStore = {};
const statsStore = {};

// Create Short URL
router.post('/', (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  const short = shortcode || generateShortCode();
  if (urlStore[short]) {
    return res.status(409).json({ error: 'Shortcode already exists' });
  }

  const expiry = getExpiryDate(validity);
  urlStore[short] = { originalUrl: url, createdAt: new Date().toISOString(), expiry };
  statsStore[short] = { clicks: 0, details: [] };

  res.status(201).json({
    shortLink: `${req.protocol}://${req.get('host')}/${short}`,
    expiry
  });
})``

// Redirect
router.get('/:short', (req, res) => {
  const { short } = req.params;
  const record = urlStore[short];
  if (!record) return res.sendStatus(404);
  if (new Date(record.expiry) < new Date()) return res.status(410).send('Link expired');

  statsStore[short].clicks++;
  statsStore[short].details.push({
    timestamp: new Date().toISOString(),
    referrer: req.get('Referer') || null,
    geo: 'IN'
  });

  res.redirect(record.originalUrl);
});

// Stats
router.get('/info/:short', (req, res) => {
  const { short } = req.params;
  const record = urlStore[short];
  if (!record) return res.sendStatus(404);

  res.json({
    short,
    originalUrl: record.originalUrl,
    createdAt: record.createdAt,
    expiry: record.expiry,
    totalClicks: statsStore[short].clicks,
    clickDetails: statsStore[short].details
  });
});

module.exports = router;
