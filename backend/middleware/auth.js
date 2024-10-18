const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token non fourni' });
    }
    
    const token = authHeader.split(' ')[1]; // Récupération du token (second élément après 'Bearer')
    const decodedToken = jwt.verify(token, process.env.CLE);

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'ID utilisateur non présent dans le token' });
    }

    req.auth = { userId: decodedToken.id }; // Utilisation du champ exact du token (vérifiez si c'est 'id' ou '_id')
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré !' });
  }
};
