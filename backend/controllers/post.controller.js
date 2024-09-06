const Post = require('../models/post.model');  // Importation du modèle Post
const mongoose = require('mongoose');

exports.createPost = async (req, res) => {
  try {
    const { title, description, imageUrl, userId } = req.body;

    const post = new Post({
      title,
      description,
      imageUrl,
      userId
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du post', error });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'name email');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des posts', error });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'name email');
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du post', error });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du post', error });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    res.status(200).json({ message: 'Post supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du post', error });
  }
};