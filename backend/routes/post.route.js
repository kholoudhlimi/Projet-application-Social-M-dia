const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const multer = require('../middleware/multer-configpost');
const auth = require('../middleware/auth');
const permissions = require('../middleware/permissions-post')

// Créer un nouveau post (avec upload d'image)
router.post('/post', auth, multer, postController.createPost);


router.get('/post', auth, postController.getAllPosts);


router.get('/post/:id', auth, postController.getPostById);

// Mettre à jour un post (avec upload d'image)
router.put('/post/:id',auth, permissions, multer, postController.updatePost);

// Supprimer un post
router.delete('/post/:id', auth, permissions, postController.deletePost);

module.exports = router;