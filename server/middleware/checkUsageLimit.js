const User = require('../models/User');

const checkUsageLimit = async (req, res, next) => {
  try {
    if (!req.user) {
      // Guest usage - could limit by IP in production, but for now allow or block
      return next(); 
    }

    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.plan === 'free' && user.generationsCount >= 10) {
      return res.status(403).json({ 
        error: 'You have reached your limit of 10 free generations. Please upgrade to Pro.',
        needsUpgrade: true 
      });
    }

    // Pass the user object to the request so controllers can increment it
    req.dbUser = user;
    next();
  } catch (err) {
    console.error('Error checking usage limit:', err);
    res.status(500).json({ error: 'Failed to verify usage limits' });
  }
};

module.exports = checkUsageLimit;
