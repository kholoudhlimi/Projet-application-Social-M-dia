const express = require('express');
const router = express.Router();
const comentController = require('../controllers/coment.controller');
const isAdmin = require('../middleware/admin');
const auth = require('../middleware/auth');

// Route pour créer un commentaire
router.post('/coment', auth, comentController.createComent);

// Route pour récupérer tous les commentaires
router.get('/coment', auth, comentController.getAllComents);

// Route pour récupérer les commentaires par ID de post
router.get('/coment/posts/:postId', auth, comentController.getComentsByPostId);

// Route pour mettre à jour un commentaire
router.put('/coment/:id', auth, comentController.updateComent);

// Route pour supprimer un commentaire
router.delete('/coment/:id', auth, comentController.deleteComent);

module.exports = router;
