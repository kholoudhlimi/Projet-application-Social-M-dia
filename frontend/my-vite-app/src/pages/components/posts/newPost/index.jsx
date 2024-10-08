// import React, { useState } from "react";
// import './style.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faShare } from '@fortawesome/free-solid-svg-icons';
// import userService from '../../../../services/userService'; // Assurez-vous que le chemin est correct.
// import { toast } from 'react-toastify';

// const NewPost = () => {
//     const [description, setDescription] = useState('');
//     const [imageUrl, setImageUrl] = useState(null);

//     // Récupérez les données utilisateur depuis le localStorage
//     const userData = JSON.parse(localStorage.getItem('user_data')); // Récupérez l'objet utilisateur
//     const userId = userData ? userData.id : null; // Obtenez l'ID de l'utilisateur
//     const profilePicture = userData ? userData.picture : ''; // Récupérez l'URL de l'image

//     console.log("ID utilisateur récupéré dans NewPost :", userId); // Log pour déboguer
//     console.log("Image de profil récupérée :", profilePicture); // Log pour déboguer

//     const handlePost = async () => {
//         if (!userId) {
//             console.error("Erreur: userId est null");
//             toast.error("Erreur: Vous devez être connecté pour créer un post.");
//             return; // Sortie précoce si userId est null
//         }

//         const formData = new FormData();
//         formData.append('description', description);
//         formData.append('userId', userId); // Utilisez l'ID de l'utilisateur récupéré
//         if (imageUrl) {
//             formData.append('image', imageUrl);
//         }

//         try {
//             const response = await userService.createPost(formData);
//             console.log("Post créé avec succès :", response);
//             toast.success("Post créé avec succès!");
//             setDescription('');
//             setImageUrl(null);
//         } catch (error) {
//             if (error.response) {
//                 console.error("Erreur lors de la création du post :", error.response.data);
//                 toast.error(`Erreur: ${error.response.data.message || "Erreur lors de la création du post."}`);
//             } else if (error.request) {
//                 console.error("Aucune réponse reçue :", error.request);
//                 toast.error("Aucune réponse du serveur.");
//             } else {
//                 console.error("Erreur :", error.message);
//                 toast.error("Erreur lors de la création du post.");
//             }
//         }
//     };

//     return (
//         <div className="new_post">
//             <div className="new_post_details">
//                 <div className="new_post_image">
//                     {profilePicture ? (
//                         <img 
//                             src={profilePicture} // Utilisez l'URL récupérée
//                             alt="Profile"
//                             onError={(e) => { e.target.onerror = null; e.target.src="fallback-image-url.jpg"; }} // Remplacez par une image de secours si l'image ne se charge pas
//                         />
//                     ) : (
//                         <p>Aucune image de profil disponible.</p>
//                     )}
//                 </div>
//                 <div className="new_post_textbox">
//                     <textarea 
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         placeholder="What's on your mind?"
//                     />
//                 </div>
//             </div>
//             <div className="postPhoto">
//                 <input
//                     className="input"
//                     type="file"
//                     onChange={(e) => setImageUrl(e.target.files[0])} // Capture l'image
//                     placeholder="Ajouter une image"
//                 />
//             </div>
//             <div className="new_post_btn">
//                 <button onClick={handlePost}>
//                     <FontAwesomeIcon icon={faShare} /> Post it
//                 </button>
//             </div>
//         </div>
//     );
// };


// // export default NewPost;
// import React, { useState } from "react";
// import './style.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faShare } from '@fortawesome/free-solid-svg-icons';
// import userService from '../../../../services/userService';// Assurez-vous que le chemin est correct.
// import { toast } from 'react-toastify';
// import Post from '../post'; // Assurez-vous d'importer le composant Post
import React, { useState } from "react";
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import userService from '../../../../services/userService'; // Assurez-vous que le chemin est correct.
import { toast } from 'react-toastify'; // Assurez-vous que react-toastify est installé et configuré



const NewPost = () => {
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

  // Récupérez les données utilisateur depuis le localStorage
  const userData = JSON.parse(localStorage.getItem('user_data')); 
  const userId = userData ? userData.id : null; 
  const profilePicture = userData ? userData.picture : ''; 

  const handlePost = async () => {
      if (!userId) {
          console.error("Erreur: userId est null");
          toast.error("Erreur: Vous devez être connecté pour créer un post.");
          return; 
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('userId', userId); 
      if (imageUrl) {
          formData.append('image', imageUrl); // Ajoutez l'image seulement si elle existe
      }

      try {
          const response = await userService.createPost(formData); 
          console.log("Post créé avec succès :", response);
          toast.success("Post créé avec succès!");
          setDescription(''); 
          setImageUrl(null); 
      } catch (error) {
          console.error("Erreur lors de la création du post :", error);
          if (error.response) {
              console.error("Détails de la réponse :", error.response.data); 
              toast.error("Erreur : " + (error.response.data.message || "Erreur lors de la création du post."));
          } else if (error.request) {
              console.error("Aucune réponse reçue :", error.request);
              toast.error("Aucune réponse du serveur.");
          } else {
              console.error("Erreur :", error.message);
              toast.error("Erreur lors de la création du post.");
          }
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
                      placeholder="What's on your mind?"
                  />
              </div>
          </div>
          <div className="postPhoto">
              <input
                  className="input"
                  type="file"
                  onChange={(e) => setImageUrl(e.target.files[0])} 
                  placeholder="Ajouter une image"
              />
          </div>
          <div className="new_post_btn">
              <button onClick={handlePost}>
                  <FontAwesomeIcon icon={faShare} /> Post it
              </button>
          </div>
      </div>
  );
};

export default NewPost;