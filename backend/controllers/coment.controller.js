const Post = require('../models/post.model');  // Importation du modèle Post
const Coment = require('../models/coment.model');  // Importation du modèle Comment

// Fonction pour créer un commentaire
exports.createComent = async (req, res) => {
  const userId = req.auth.userId;

  if (!userId) {
    return res.status(400).json({ message: 'L\'ID utilisateur est requis.' });
  }

  try {
    const { postId, coment } = req.body;

    const post = await Post.findById(postId);
    if (!post) {

      return res.status(404).json({ message: 'Post non trouvé' });
    }

    const newComent = new Coment({ userId, postId, coment });
    const savedComent = await newComent.save();

    post.coments.push(savedComent._id);
    await post.save();

    res.status(201).json(savedComent);
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    res.status(500).json({ message: 'Erreur lors de la création du commentaire', error: error.message });
  }
};


// Fonction pour récupérer tous les commentaires
exports.getAllComents = async (req, res) => {
  try {
    const coments = await Coment.find().populate('userId', 'username picture')
      .exec();
    res.status(200).json(coments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires', error: error.message });
  }
};

// Fonction pour récupérer les commentaires par ID de post
exports.getComentsByPostId = async (req, res) => {
  try {
    const coments = await Coment.find({ postId: req.params.postId });
    res.status(200).json(coments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires', error: error.message });
  }
};
// Fonction pour mettre à jour un commentaire
exports.updateComent = async (req, res) => {
  try {
    const { coment } = req.body;
    const userId = req.auth.userId;
    const userRole = req.auth.role;

    const existingComent = await Coment.findById(req.params.id);
    if (!existingComent) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    // Vérification des permissions
    if (userRole === 'admin' || existingComent.userId.toString() === userId) {
      existingComent.coment = coment || existingComent.coment;
      const updatedComent = await existingComent.save();
      res.status(200).json(updatedComent);
    } else {
      return res.status(403).json({ message: 'Vous n\'avez pas la permission de modifier ce commentaire' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du commentaire:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du commentaire', error: error.message });
  }
};

// Fonction pour supprimer un commentaire
exports.deleteComent = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userRole = req.auth.role; // Récupération du rôle de l'utilisateur

    // Vérifie si le commentaire existe
    const existingComent = await Coment.findById(req.params.id);
    if (!existingComent) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    // Vérification des permissions
    if (userRole === 'admin' || existingComent.userId.toString() === userId) {
      await Coment.findByIdAndDelete(req.params.id); // Supprime le commentaire
      res.status(200).json({ message: 'Commentaire supprimé avec succès' });
    } else {
      return res.status(403).json({ message: 'Vous n\'avez pas la permission de supprimer ce commentaire' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du commentaire', error: error.message });
  }
};
