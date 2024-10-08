import React, { useEffect, useState } from "react";
import './style.css';
import Post from "./post";
import NewPost from "./newPost";
import userService from './../../../services/userService'; // Assurez-vous que le chemin est correct
const Posts = () => {
    const [posts, setPosts] = useState([]); // État pour stocker les posts

    // Récupérer tous les posts depuis l'API
    const fetchPosts = async () => {
        try {
            const response = await userService.getPosts(); // Appel à l'API pour récupérer les posts
            console.log("Réponse de l'API :", response.data); // Vérifiez les données
            setPosts(response.data); // Mettez à jour l'état avec les données récupérées
        } catch (error) {
            console.error("Erreur lors de la récupération des posts :", error.message);
            if (error.response) {
                console.error("Détails de la réponse :", error.response.data);
                console.error("Statut de la réponse :", error.response.status);
                toast.error("Erreur : " + (error.response.data.error || "Erreur lors de la récupération des posts.")); // Affichez une erreur conviviale
            }
        }
    };

    useEffect(() => {
        fetchPosts(); // Appeler la fonction pour récupérer les posts lors du montage du composant
    }, []); // Le tableau vide signifie que cela s'exécute une seule fois lors du premier rendu

    return (
        <div className="posts">
            <NewPost /> {/* Composant pour créer un nouveau post */}
            {posts.length > 0 ? (
                posts.map((post, index) => (
                    <Post key={index} post={post} /> // Afficher chaque post
                ))
            ) : (
                <p>Aucun post disponible.</p> // Message si aucun post n'est disponible
            )}
        </div>
    );
};

export default Posts;
