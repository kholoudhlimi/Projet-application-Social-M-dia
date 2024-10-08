const Post = require('../models/post.model');
const fs = require('fs'); // Importation du système de fichiers

exports.createPost = async (req, res) => {
  try {
    const { description, userId } = req.body;

    // Vérification si un fichier a été téléchargé
    let imageUrl = null; // Initialisez imageUrl
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/post/${req.file.filename}`;
    }

    const post = new Post({
      description,
      imageUrl, // Utilisez imageUrl qui peut être null
      userId,
      coments: [] // Assurez-vous que le nom est correct
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
      .populate('userId', 'username picture')// Remplacez 'userId' par le champ correct
      .populate('coments'); // Assurez-vous que le nom est correct
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des posts', error });
  }
};

// Fonction pour récupérer un post par ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'name email') // Remplacez 'userId' par le champ correct
      .populate('coments'); // Assurez-vous que le nom est correct
    
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du post', error });
  }
};

// Fonction pour mettre à jour un post
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id; // Assurez-vous que `req.user` est défini par un middleware d'authentification

    // Vérifier si l'utilisateur est le créateur du post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }
    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Vous n'avez pas la permission de mettre à jour ce post" });
    }

    // Mettre à jour le post avec les nouvelles données
    post.description = req.body.description || post.description; // Mettez à jour la description seulement si fournie
    post.imageUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/post/${req.file.filename}` : post.imageUrl;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    res.status(200).json({ message: "Post mis à jour avec succès", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Échec de la mise à jour du post", error });
  }
};

// Fonction pour supprimer un post
exports.deletePost = async (req, res) => {
  try {
    const postToDelete = await Post.findById(req.params.id);

    if (!postToDelete) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    // Supprimer le fichier d'image du système de fichiers
    const filePath = `uploads/${postToDelete.imageUrl.split('/').pop()}`; // Assurez-vous que le chemin d'accès est correct
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Erreur lors de la suppression du fichier:', err);
      }
    });

    // Supprimer le post de la base de données
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du post', error });
  }
};
