import axios from 'axios';

const postService = {};

// Function to retrieve the token from localStorage
const getToken = () => localStorage.getItem('token');

// Function to create a post
postService.createPost = async function(data) {
    const token = getToken();
    if (!token) {
        throw new Error("Token non trouvé");
    }
    try {
        return await axios.post('http://localhost:3000/api/posts/post', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("Erreur lors de la création du post :", error);
        throw error;
    }
};

// Function to retrieve all posts
postService.getPosts = async function() {
    const token = getToken();
    if (!token) {
        throw new Error("Token not found");
    }
    try {
        const response = await axios.get('http://localhost:3000/api/posts/post', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // Retourne les données des posts
    } catch (error) {
        console.error("Error retrieving posts:", error);
        if (error.response) {
            console.error("Détails de la réponse :", error.response.data);
            console.error("Statut de la réponse :", error.response.status);
        }
        throw new Error(error.response?.data?.message || "Failed to retrieve posts");
    }
};

// Function to retrieve a post by ID
postService.getPostById = async function(id) {
    const token = getToken();
    if (!token) {
        throw new Error("Token non trouvé");
    }
    try {
        const response = await axios.get(`http://localhost:3000/api/posts/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du post :", error);
        throw new Error(error.response?.data?.message || "Échec de la récupération du post");
    }
};

// Function to update a post
postService.updatePost = async function(id, data) {
    const token = getToken();
    if (!token) {
        throw new Error("Token non trouvé");
    }
    try {
        const response = await axios.put(`http://localhost:3000/api/posts/post/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du post :", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
        throw new Error(error.response?.data?.message || "Échec de la mise à jour du post");
    }
};

// Function to delete a post
postService.deletePost = async function(id) {
    const token = getToken();
    if (!token) {
        throw new Error("Token non trouvé");
    }
    try {
        const response = await axios.delete(`http://localhost:3000/api/posts/post/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du post :", error);
        throw new Error(error.response?.data?.message || "Échec de la suppression du post");
    }
};

export default postService;
