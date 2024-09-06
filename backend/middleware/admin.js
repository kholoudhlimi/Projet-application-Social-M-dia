const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};