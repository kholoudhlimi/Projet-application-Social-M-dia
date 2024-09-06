// Importation du modèle 'User' depuis le dossier 'models'
const User = require('../models/user.model');
// Importation du module bcrypt pour le hachage des mots de passe
const bcrypt = require('bcrypt');
// Importation du module jsonwebtoken pour la gestion des tokens JWT
const jwt = require('jsonwebtoken');

// Fonction pour l'inscription d'un utilisateur
exports.signup = (req, res, next) => {
    // Hachage du mot de passe avec bcrypt, 10 étant le nombre de tours de hachage
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Création d'un nouvel utilisateur avec les données fournies par la requête et le mot de passe haché
            const newUser = new User({
                pseudo: req.body.pseudo,  // Pseudo de l'utilisateur
                email: req.body.email,    // Email de l'utilisateur
                password: hash            // Mot de passe haché
            });
            // Sauvegarde de l'utilisateur dans la base de données
            newUser.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // Envoi d'une réponse de succès si la sauvegarde réussit
                .catch(error => res.status(400).json({ error })); // Envoi d'une erreur si la sauvegarde échoue
        })
        .catch(error => res.status(500).json({ error })); // Envoi d'une erreur si le hachage échoue
};

// Fonction pour la connexion d'un utilisateur
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur dans la base de données via son email
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'utilisateur n'est pas trouvé, retourner une erreur 401 (non autorisé)
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Comparaison du mot de passe envoyé avec celui stocké dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si le mot de passe est incorrect, retourner une erreur 401
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Si le mot de passe est correct, générer un token JWT avec l'ID utilisateur
                    res.status(200).json({
                        userId: user._id, // L'ID de l'utilisateur est inclus dans la réponse
                        token: jwt.sign(
                            { userId: user._id },  // Payload du token : ID utilisateur
                            'RANDOM_TOKEN_SECRET', // Clé secrète pour signer le token
                            { expiresIn: '24h' }   // Expiration du token après 24 heures
                        )
                    });
                })
                .catch(error => res.status(500).json({ error })); // Envoi d'une erreur si la comparaison échoue
        })
        .catch(error => res.status(500).json({ error })); // Envoi d'une erreur si la recherche de l'utilisateur échoue
};
