const express = require('express');
const router = express.Router();
const comentController = require('../controllers/coment.controller');
const isAdmin = require('../middleware/admin');
const auth = require('../middleware/auth');

// Route pour créer un commentaire
router.post('/coment', auth, comentController.createComent);

// Route pour récupérer tous les commentaires
router.get('/coment', auth, isAdmin, comentController.getAllComents);

// Route pour récupérer les commentaires par ID de post
router.get('/coment/posts/:postId', auth, isAdmin, comentController.getComentsByPostId);

// Route pour mettre à jour un commentaire
router.put('/coment/:id', auth, isAdmin, comentController.updateComent);

// Route pour supprimer un commentaire
router.delete('/coment/:id', auth, isAdmin, comentController.deleteComent);

module.exports = router;
