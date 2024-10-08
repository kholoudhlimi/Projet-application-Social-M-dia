
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.CLE);
    req.auth = { userId: decodedToken.id };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Requête non authentifiée !' });
  }
};
