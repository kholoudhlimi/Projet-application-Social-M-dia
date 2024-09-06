const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

router.post('/posts',auth,multer, postController.createPost);
router.get('/posts',auth, postController.getAllPosts);
router.get('/posts/:id',auth, postController.getPostById);
router.put('/posts/:id',auth,multer, postController.updatePost);
router.delete('/posts/:id',auth, postController.deletePost);

module.exports = router;
