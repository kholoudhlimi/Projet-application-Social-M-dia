const Coment = require('../models/coment.model'); // Importation du modèle Comment

module.exports = async (req, res, next) => {
  try {
    const comentId = req.params.id; // Récupération de l'ID du commentaire depuis les paramètres de la requête
    const userId = req.auth.userId; // ID de l'utilisateur authentifié
    const userRole = req.auth.role; // Récupération du rôle de l'utilisateur

    // Récupération du commentaire par ID
    const coment = await Coment.findById(comentId);

    if (!coment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    // Vérification des permissions
    if (userRole === 'admin' || coment.userId.toString() === userId.toString()) {
      // L'utilisateur est administrateur ou propriétaire du commentaire
      next(); // Passer au middleware suivant ou à la route
    } else {
      return res.status(403).json({ message: "Accès refusé : vous n'avez pas la permission de modifier ou supprimer ce commentaire" });
    }
  } catch (error) {
    console.error('Erreur dans le middleware de vérification des permissions sur le commentaire:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};
