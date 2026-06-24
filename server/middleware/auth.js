const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // For this project, if there's no token, we can either reject or just let them use it as a guest
      // But since we want to save history, let's just set req.user to null if no token, 
      // or reject if the route requires auth. Let's make it optional for generating, but required for history.
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devboost_secret');
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

module.exports = { auth, requireAuth };
