const Post = require('../models/post.model');  // Importation du modèle Post
const Coment = require('../models/coment.model');  // Importation du modèle Coment

// Fonction pour créer un commentaire
exports.createComent = async (req, res) => {
  try {
    const { userId, postId, coment } = req.body;

    // Créer le commentaire
    const newComent = new Coment({
      userId,
      postId,
      coment
    });

    const savedComent = await newComent.save();

    // Ajouter le commentaire au post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    // Vérifie si le tableau comments existe avant d'utiliser push
    if (!post.coments) {
      post.coments = []; // Initialiser le tableau s'il est undefined
    }

    post.coments.push(savedComent._id); // Ajouter l'ID du commentaire au post
    await post.save();

    res.status(201).json(savedComent);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du commentaire', error });
  }
};


// Fonction pour récupérer tous les commentaires
exports.getAllComents = async (req, res) => {
  try {
    const coments = await Coment.find().populate('userId', 'name email');
    res.status(200).json(coments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires', error });
  }
};

// Fonction pour récupérer les commentaires par ID de post
exports.getComentsByPostId = async (req, res) => {
  try {
    const coments = await Coment.find({ postId: req.params.postId }).populate('userId', 'name email');
    res.status(200).json(coments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires', error });
  }
};

// Fonction pour mettre à jour un commentaire
exports.updateComent = async (req, res) => {
  try {
    const { coment } = req.body;

    const updatedComent = await Coment.findByIdAndUpdate(
      req.params.id,
      { coment },
      { new: true, runValidators: true }
    );

    if (!updatedComent) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    res.status(200).json(updatedComent);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du commentaire', error });
  }
};

// Fonction pour supprimer un commentaire
exports.deleteComent = async (req, res) => {
  try {
    const deletedComent = await Coment.findByIdAndDelete(req.params.id);

    if (!deletedComent) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    res.status(200).json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du commentaire', error });
  }
};
