// Importation du modèle 'User' depuis le dossier 'models'
const User = require('../models/user.model');
// Importation du module bcrypt pour le hachage des mots de passe
const bcrypt = require('bcrypt');
// Importation du module jsonwebtoken pour la gestion des tokens JWT
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Hachage du mot de passe avec bcrypt
    const hash = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur
    const newUser = new User({
      username,
      email,
      password: hash,
      picture: req.file ? `${req.protocol}://${req.get('host')}/uploads/profile/${req.file.filename}` : null, // ou une image par défaut
      role: 'user'
    });

    // Sauvegarde de l'utilisateur dans la base de données
    await newUser.save();
    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Fonction pour la connexion d'un utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect !' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.CLE,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Connexion réussie !',
      token,
      user: { id: user._id, username: user.username, picture: user.picture, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour la création d'un administrateur
exports.createAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ message: 'Un administrateur existe déjà !' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel administrateur
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      picture: req.file ? `${req.protocol}://${req.get('host')}/uploads/profile/${req.file.filename}` : null, // ou une image par défaut
      role: 'admin'
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Administrateur créé avec succès !' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  

  res.status(200).json({ message: 'Déconnexion réussie !' });
};
