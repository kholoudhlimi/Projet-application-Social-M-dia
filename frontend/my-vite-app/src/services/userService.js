
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
userService.login = async function(data) {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/login', data);
        
        // Vérifiez la structure de la réponse
        console.log("Réponse de l'API :", response.data); // Vérifiez ici

        // Mettez à jour la récupération de userId
        const { token, user } = response.data; 
        const userId = user.id; // Extraire l'ID utilisateur de l'objet user

        // Stocker le token et l'ID utilisateur dans le localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId); 

        return response;
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        throw error;
    }
};

userService.logout = async function() {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/logout', null, {
       
        });

        if (response.status !== 200) {
            throw new Error('Logout failed');
        }

        return response.data.message; 
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};
  

export default userService;
