
import axios from 'axios';

const commentService = {};
commentService.createComent = async function(data) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("Token not found");
    }

    try {
        return await axios.post('http://localhost:3000/api/coments/coment', data, { 
            headers: {
                'Authorization': `Bearer ${token}`,
                
            }
        });
    } catch (error) {
        console.error("Erreur lors de la création du commentaire :", error);
        throw error; 
    }
};


commentService.getComentsByPostId = async function(postId) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("Token not found");
    }

    try {
        return await axios.get(`http://localhost:3000/api/coments/coment/posts/${postId}`, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires :", error);
        throw error; 
    }
};


commentService.getAllComents = async function() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("Token not found");
    }

    try {
        return await axios.get('http://localhost:3000/api/coments/coment', { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les commentaires :", error);
        throw error; 
    }
};


commentService.updateComent = async function(id, data) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("Token not found");
    }

    try {
        return await axios.put(`http://localhost:3000/api/coments/coment/${id}`, data, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du commentaire :", error);
        throw error; 
    }
};


commentService.deleteComent = async function(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("Token not found");
    }

    try {
        return await axios.delete(`http://localhost:3000/api/coments/coment/${id}`, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("Erreur lors de la suppression du commentaire :", error);
        throw error; 
    }
};
export default commentService;