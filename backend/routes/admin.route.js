const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin'); // Middleware pour vérifier si l'utilisateur est admin

// Route pour obtenir tous les utilisateurs (accessible uniquement aux administrateurs)
router.get('/users', auth, isAdmin, adminController.getAllUsers);

// Route pour supprimer un utilisateur (accessible uniquement aux administrateurs)
router.delete('/users/:id', auth, isAdmin, adminController.deleteUser);

module.exports = router;
