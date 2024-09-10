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
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Recherche de l'utilisateur dans la base de données via son email
        const user = await User.findOne({ email: email });

        // Si l'utilisateur n'est pas trouvé, retourner une erreur 401 (non autorisé)
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }

        // Comparaison du mot de passe envoyé avec celui stocké dans la base de données
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }

        // Création d'un token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.CLE,
            { expiresIn: '2122222h' }
        );

        // Envoi d'une réponse de succès avec le token et les informations de l'utilisateur
        return res.status(200).json({
            message: 'Connexion réussie !',
            token: token,
            user: user
        });
    } catch (error) {
        // Envoi d'une erreur en cas de problème
        return res.status(500).json({ error: 'Erreur serveur !' });
    }
};
