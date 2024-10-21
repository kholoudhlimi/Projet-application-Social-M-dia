const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  try {
    // Vérification que req.auth est défini
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    // Récupération de l'utilisateur
    const foundUser = await User.findById(req.auth.userId);
    
    // Vérification de l'existence de l'utilisateur et de son rôle
    if (!foundUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    if (foundUser.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé : vous n\'êtes pas administrateur' });
    }

    // Passer au middleware suivant
    next();
  } catch (error) {
    console.error('Erreur dans le middleware d\'administration:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};
