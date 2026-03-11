const jwt = require('jsonwebtoken');

/**
 * Validates JWT tokens and attaches the decoded payload to req.user.
 * Use this on routes that require authentication.
 */
const protect = (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

/**
 * Optional role-based guard.
 * Example usage: router.get('/admin', protect, requireRole(['admin']), handler)
 */
const requireRole = (roles = []) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  }
  return next();
};

module.exports = {
  protect,
  requireRole
};

