
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Vérification de l'en-tête d'autorisation pour obtenir le token
    const token = req.headers.authorization.split(' ')[1];
    // Décodage du token
    const decodedToken = jwt.verify(token, process.env.CLE);
    // Ajout de l'ID utilisateur à la requête
    req.auth = { userId: decodedToken.id };
    next(); // Passe au middleware suivant
  } catch (error) {
    res.status(401).json({ error: 'Requête non authentifiée !' });
  }
};