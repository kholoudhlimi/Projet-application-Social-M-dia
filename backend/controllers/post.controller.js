const Post = require('../models/post.model');
const fs = require('fs').promises; 


// Fonction pour créer un post
exports.createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.auth.userId;  // Récupération de l'ID utilisateur depuis l'authentification

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/post/${req.file.filename}`;
    }

    const post = new Post({
      description,
      imageUrl,
      userId,
      coments: [] // Initialisation avec un tableau vide de commentaires
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du post', error: error.message });
  }
};

// Fonction pour récupérer tous les posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('coments'); // Si vous avez un modèle de commentaires

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des posts', error: error.message });
  }
};
// Fonction pour récupérer un post par ID
exports.getPostById = async (req, res) => {
  try {
    console.log("ID du post demandé:", req.params.id); // Log de l'ID
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Erreur lors de la récupération du post:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du post', error: error.message });
  }
};

// Fonction pour mettre à jour un post
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.auth.userId; // Utilisateur authentifié

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // Vérification de l'authenticité de l'utilisateur
    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Vous n'avez pas la permission de mettre à jour ce post" });
    }

    post.description = req.body.description || post.description;
    post.imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/post/${req.file.filename}` : post.imageUrl;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    res.status(200).json({ message: "Post mis à jour avec succès", post: updatedPost });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du post:', error);
    res.status(500).json({ message: "Échec de la mise à jour du post", error: error.message });
  }
};

// Fonction pour supprimer un post
exports.deletePost = async (req, res) => {
  try {
    const postToDelete = await Post.findById(req.params.id);

    if (!postToDelete) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    // Vérification de l'authenticité de l'utilisateur
    const userId = req.auth.userId;
    if (postToDelete.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Vous n'avez pas la permission de supprimer ce post" });
    }

    // Suppression de l'image associée, s'il y en a une
    if (postToDelete.imageUrl) {
      const filePath = `uploads/post/${postToDelete.imageUrl.split('/').pop()}`;

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Erreur lors de la suppression du fichier:', err);
          return res.status(500).json({ message: 'Erreur lors de la suppression du fichier', error: err.message });
        }
      });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du post', error: error.message });
  }
};
