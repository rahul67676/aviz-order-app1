const { validateToken } = require('../utils/cryptoHelper');
const { logActivity } = require('../utils/logger');

async function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const payload = validateToken(token);
  if (!payload) return res.status(403).json({ error: 'Invalid token' });

  req.user = payload;
  logActivity('AUTH_CHECK', { userId: payload.userId });
  next();
}

async function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
