const express = require('express');
const app = express();
const postRoutes = require('./routes/post.route');
const comentRoutes = require('./routes/coment.route');
const userRoutes = require('./routes/user.route');
const adminRoutes = require('./routes/admin.route');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

// Configuration de la connexion à MongoDB
const MONGO_ACCESS = process.env.MONGO_LAB;
mongoose.connect(MONGO_ACCESS)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Connexion à MongoDB échouée !', error));

// Configuration des en-têtes CORS
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));
// Middleware pour le parsing JSON
app.use(express.json());

// Routes

app.use('/api/auth', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/post',postRoutes);
app.use('/api/coment',comentRoutes);
// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ressource non trouvée' });
});

// Exportation de l'application
module.exports = app;

