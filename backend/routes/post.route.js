const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const multer = require('../middleware/multer-configpost');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

// Créer un nouveau post (avec upload d'image)
router.post('/post', auth,multer, postController.createPost);

// Récupérer tous les posts (accessible à l'admin)
router.get('/post', auth, postController.getAllPosts);

// Récupérer un post par ID (accessible à l'admin)
router.get('/post/:id', auth, postController.getPostById);

// Mettre à jour un post (avec upload d'image)
router.put('/post/:id', auth,multer, postController.updatePost);

// Supprimer un post
router.delete('/post/:id', auth, postController.deletePost);

module.exports = router;
