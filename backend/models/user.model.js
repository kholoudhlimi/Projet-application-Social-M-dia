const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  picture: {
    type: String, required: true 
  },
});

// Ajout du plugin de validation pour les champs uniques
userSchema.plugin(uniqueValidator);

// Méthode pour vérifier si l'utilisateur est un administrateur
userSchema.methods.isAdmin = function() {
  return this.role === 'admin'; // Supposant que vous stockez le rôle dans une propriété 'role'
};


// Exportation du modèle utilisateur
module.exports = mongoose.model('User', userSchema);
