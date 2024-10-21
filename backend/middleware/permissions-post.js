const Post = require('../models/post.model');

module.exports = async (req, res, next) => {
  try {
    const postId = req.params.id; // Récupération de l'ID du post depuis les paramètres de la requête
    const userId = req.auth.userId; // ID de l'utilisateur authentifié
    const userRole = req.auth.role; // Récupération du rôle de l'utilisateur

    // Récupération du post par ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // Vérification des permissions
    if (userRole === 'admin' || post.userId.toString() === userId.toString()) {
      // L'utilisateur est administrateur ou propriétaire du post
      next(); // Passer au middleware suivant ou à la route
    } else {
      return res.status(403).json({ message: "Accès refusé : vous n'avez pas la permission de modifier ou supprimer ce post" });
    }
  } catch (error) {
    console.error('Erreur dans le middleware de vérification des permissions sur le post:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};
