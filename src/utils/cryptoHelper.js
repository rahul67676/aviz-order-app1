const crypto = require('crypto');

async function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'aviz_salt').digest('hex');
}

function validateToken(token) {
  if (!token || !token.startsWith('session_')) return null;
  const parts = token.split('_');
  if (parts.length < 3) return null;
  return { userId: parts[1], timestamp: parts[2] };
}

async function validateCard(cardNumber) {
  const digits = cardNumber.replace(/\s/g, '');
  return /^\d{16}$/.test(digits);
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = { hashPassword, validateToken, validateCard, generateOTP };
