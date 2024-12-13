import React, { useState } from "react";
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import postService from '../../../../services/postService'; 
import { toast } from 'react-toastify';

const NewPost = () => {
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

  // Récupérez les données utilisateur depuis le localStorage
  const userData = JSON.parse(localStorage.getItem('user_data')); 
  const userId = userData ? userData.id : null; 
  const profilePicture = userData ? userData.picture : ''; 

  const handlePost = async () => {
    // Vérification de l'ID de l'utilisateur
    if (!userId) {
      toast.error("Erreur : Vous devez être connecté pour créer un post.");
      return; 
    }
  
    const formData = new FormData();
    formData.append('description', description);
    formData.append('userId', userId); 
    if (imageUrl) {
      formData.append('imageUrl', imageUrl); // Vérifiez que le champ correspond à ce que le backend attend
    }
  
    try {
      const response = await postService.createPost(formData);
      
      // Affichez la réponse ou effectuez des actions avec les données retournées
      console.log("Post créé :", response.data);
  
      toast.success("Post créé avec succès!");
      setDescription(''); 
      setImageUrl(null); 
  
      // Si nécessaire, appelez une fonction pour mettre à jour l'affichage des posts
      if (typeof onPostCreated === 'function') {
        onPostCreated(); // Vérifiez que la fonction est définie
      }
  
    } catch (error) {
      handlePostError(error);
    }
  };
  
  const handlePostError = (error) => {
    console.error("Erreur lors de la création du post :", error);
    
    if (error.response) {
      // Affiche le message d'erreur provenant du backend
      toast.error("Erreur : " + (error.response.data.message || "Erreur lors de la création du post."));
    } else if (error.request) {
      // Aucune réponse reçue du serveur
      toast.error("Aucune réponse du serveur.");
    } else {
      // Autre erreur
      toast.error("Erreur lors de la création du post : " + error.message);
    }
  };
  

  return (
    <div className="new_post">
      <div className="new_post_details">
        <div className="new_post_image">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" />
          ) : (
            <p>Aucune image de profil disponible.</p>
          )}
        </div>
        <div className="new_post_textbox">
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="partagez un post avec tes collégue "
          />
        </div>
      </div>
      <div className="postPhoto">
        <input
          className="input"
          type="file"
          accept="image/*"
          onChange={(e) => setImageUrl(e.target.files[0])} 
          placeholder="Ajouter une image"
        />
      </div>
      <div className="new_post_btn">
        <button onClick={handlePost}>
          <FontAwesomeIcon icon={faShare} /> Publier
        </button>
      </div>
    </div>
  );
};

export default NewPost;
