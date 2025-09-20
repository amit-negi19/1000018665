const crypto = require('crypto');

function generateShortCode() {
  return crypto.randomBytes(3).toString('hex');
}

function getExpiryDate(validityMinutes) {
  return new Date(Date.now() + validityMinutes * 60000).toISOString();
}

module.exports = { generateShortCode, getExpiryDate };
