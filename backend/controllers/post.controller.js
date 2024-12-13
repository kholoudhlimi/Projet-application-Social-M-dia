const Post = require('../models/post.model'); // Modèle de post
const fs = require('fs').promises; // Pour manipuler les fichiers

// Fonction pour créer un post
exports.createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.auth.userId; // ID de l'utilisateur authentifié

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

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username picture')
      .populate('coments') // Vérifiez si le champ "coments" est bien écrit dans le modèle
      .exec();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error); // Pour aider à identifier des problèmes
    res.status(500).json({ message: 'Erreur lors de la récupération des posts' });
  }
};

// Fonction pour récupérer un post par ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du post', error: error.message });
  }
};

// Fonction pour mettre à jour un post
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.auth.userId;
    const userRole = req.auth.role;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // Vérification des permissions
    if (userRole === 'admin' || post.userId.toString() === userId.toString()) {
      post.description = req.body.description || post.description;
      post.imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/post/${req.file.filename}` : post.imageUrl;
      post.updatedAt = Date.now();

      const updatedPost = await post.save();
      res.status(200).json({ message: "Post mis à jour avec succès", post: updatedPost });
    } else {
      return res.status(403).json({ message: "Vous n'avez pas la permission de modifier ce post" });
    }
  } catch (error) {
    res.status(500).json({ message: "Échec de la mise à jour du post", error: error.message });
  }
};

// Fonction pour supprimer un post
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.auth.userId;
    const userRole = req.auth.role;

    const postToDelete = await Post.findById(postId);

    if (!postToDelete) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    // Vérification des permissions
    if (userRole === 'admin' || postToDelete.userId.toString() === userId.toString()) {
      // Suppression de l'image associée
      if (postToDelete.imageUrl) {
        const filePath = `uploads/post/${postToDelete.imageUrl.split('/').pop()}`;
        await fs.unlink(filePath).catch(err => {
          console.error('Erreur lors de la suppression du fichier:', err);
          return res.status(500).json({ message: 'Erreur lors de la suppression du fichier', error: err.message });
        });
      }

      await Post.findByIdAndDelete(postId);
      res.status(200).json({ message: 'Post supprimé avec succès' });
    } else {
      return res.status(403).json({ message: "Vous n'avez pas la permission de supprimer ce post" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du post', error: error.message });
  }
};
