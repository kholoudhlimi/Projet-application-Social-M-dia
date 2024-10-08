// import axios from 'axios';

// const userService = {};

// // Fonction pour créer un administrateur
// userService.admin = function(data) {
//     return axios.post('http://localhost:3000/api/auth/admin', data, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     });
// };

// // Fonction pour s'inscrire
// userService.register = function(data) {
//     return axios.post('http://localhost:3000/api/auth/signup', data, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     });
// };

// // Fonction pour se connecter
// userService.login = function(data) {
//     return axios.post('http://localhost:3000/api/auth/login', data);
// };

// // Fonction pour créer un post
// userService.createPost = async function(data) {
//     const token = localStorage.getItem('token');
//     console.log("Token récupéré :", token); // Log pour déboguer
//     if (!token) {
//         throw new Error("Token not found");
//     }

//     try {
//         return await axios.post('http://localhost:3000/api/posts/post', data, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//     } catch (error) {
//         console.error("Erreur lors de la création du post :", error);
//         throw error; // Relancer l'erreur pour la gérer dans le composant
//     }
// };

// // Fonction pour récupérer tous les posts
// userService.getPosts = async function() {
//     const token = localStorage.getItem('token'); // Récupérez le token
//     return await axios.get('http://localhost:3000/api/posts/post', {
//         headers: {
//             'Authorization': `Bearer ${token}` // Incluez le token dans les en-têtes
//         }
//     });
// };

// // Fonction pour récupérer un post par ID
// userService.getPostById = function(id) {
//     return axios.get(`http://localhost:3000/api/posts/post/${id}`);
// };

// // Fonction pour mettre à jour un post
// userService.updatePost = function(id, data) {
//     return axios.put(`http://localhost:3000/api/posts/post/${id}`, data);
// };

// // Fonction pour supprimer un post
// userService.deletePost = function(id) {
//     return axios.delete(`http://localhost:3000/api/posts/post/${id}`);
// };

// export default userService;
import axios from 'axios';

const userService = {};

// Fonction pour créer un administrateur
userService.admin = function(data) {
    return axios.post('http://localhost:3000/api/auth/admin', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Fonction pour s'inscrire
userService.register = function(data) {
    return axios.post('http://localhost:3000/api/auth/signup', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Fonction pour se connecter
userService.login = function(data) {
    return axios.post('http://localhost:3000/api/auth/login', data);
};

// Fonction pour créer un post
userService.createPost = async function(data) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("Token not found");
    }

    try {
        return await axios.post('http://localhost:3000/api/posts/post', data, { // Correction de l'URL pour la création de post
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("Erreur lors de la création du post :", error);
        throw error; // Relancer l'erreur pour la gérer dans le composant
    }
};

// Fonction pour récupérer tous les posts
userService.getPosts = async function() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("Token not found");
    }

    try {
        return await axios.get('http://localhost:3000/api/posts/post', { // Correction de l'URL pour récupérer tous les posts
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des posts :", error);
        throw error; // Relancer l'erreur pour la gérer dans le composant
    }
};

// Fonction pour récupérer un post par ID
userService.getPostById = function(id) {
    return axios.get(`http://localhost:3000/api/posts/${id}`); // Correction de l'URL
};

// Fonction pour mettre à jour un post
userService.updatePost = function(id, data) {
    return axios.put(`http://localhost:3000/api/posts/post/${id}`, data); // Correction de l'URL
};

// Fonction pour supprimer un post
userService.deletePost = function(id) {
    return axios.delete(`http://localhost:3000/api/posts/post/${id}`); // Correction de l'URL
};

export default userService;
