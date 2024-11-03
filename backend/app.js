const express = require('express');
const app = express();
const postRoutes = require('./routes/post.route');
const comentRoutes = require('./routes/coment.route');
const userRoutes = require('./routes/user.route');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

// Configuration de la connexion à MongoDB
const MONGO_ACCESS = process.env.MONGO_LAB;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGO_ACCESS)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.error('Connexion à MongoDB échouée !', error));
}

// Configuration des en-têtes CORS
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
const path = require('path');
app.use('/uploads/profile', express.static(path.join(__dirname, 'uploads/profile')));
app.use('/uploads/post', express.static(path.join(__dirname, 'uploads/post')));

app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/coments',comentRoutes);
// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ressource non trouvée' });
});

// Exportation de l'application
module.exports = app;

