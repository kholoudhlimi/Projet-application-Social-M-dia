import React, { useState } from "react";
import './style.css'; 
import postService from '../../../../services/postService';
import Comments from '../../comments'; 

const Post = ({ post, onPostUpdated, onPostDeleted }) => {
    const currentUser = JSON.parse(localStorage.getItem('user_data'));
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedDescription, setUpdatedDescription] = useState(post.description);
    const [updatedImage, setUpdatedImage] = useState(null);

    // Vérification de la disponibilité du post
    if (!post) {
        return <p>Post non disponible.</p>; 
    }

    // Vérification de la disponibilité de l'utilisateur
    if (!currentUser) {
        return <p>Chargement des informations de l'utilisateur...</p>;
    }

    const postUserId = post.userId?._id || post.userId; 
    const isAdmin = currentUser.userRole === 'admin'; 
    const isOwner = String(postUserId) === String(currentUser.id); 

    const handleUpdate = async () => {
        if (!post._id) {
            console.error("Post ID is undefined");
            alert("ID du post non trouvé.");
            return;
        }
    
        setLoading(true);
        const formData = new FormData();
        formData.append('description', updatedDescription);
        if (updatedImage) {
            formData.append('imageUrl', updatedImage);
        }
    
        try {
            const updatedPost = await postService.updatePost(post._id, formData);
            alert("Post mis à jour avec succès !");
            onPostUpdated(updatedPost);
            setIsEditing(false);
            setUpdatedImage(null);
        } catch (error) {
            console.error('Error updating post:', error);
            alert(`Erreur : ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
            setLoading(true);
            try {
                await postService.deletePost(post._id);
                alert("Post supprimé avec succès !");
                onPostDeleted(post._id);
            } catch (error) {
                console.error('Error deleting post:', error);
                alert(`Erreur : ${error.response?.data?.message || error.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="post">
            <div className="post_users_details">
                <div className="user_image">
                    <img 
                        src={post.userId?.picture || "/path/to/default-image.jpg"} 
                        alt="User" 
                    />
                </div>
                <div className="user_name">
                    <h5>{post.userId?.username || "Inconnu"}</h5> 
                    <span>{new Date(post.createdAt).toLocaleString() || "Date inconnue"}</span> 
                </div>
            </div>
            <div className="post_content_details">
                {isEditing ? (
                    <>
                        <textarea 
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                        />
                        <input 
                            type="file" 
                            onChange={(e) => setUpdatedImage(e.target.files[0])} 
                        />
                    </>
                ) : (
                    <p>{post.description}</p>
                )}
            </div>
            {post.imageUrl && (
                <div className="post_image">
                    <img src={post.imageUrl} alt="Post" />
                </div>
            )}
            {(isOwner || isAdmin) && (
                <div className="post_actions">
                    {isEditing ? (
                        <>
                            <button onClick={handleUpdate} disabled={loading}>Sauvegarder</button>
                            <button onClick={() => setIsEditing(false)} disabled={loading}>Annuler</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(true)}>Modifier</button>
                            <button onClick={handleDelete} disabled={loading}>Supprimer</button>
                        </>
                    )}
                </div>
            )}
            <Comments postId={post._id} currentUserId={currentUser.id}  currentUserRole={currentUser.userRole} /> 
        </div>
    );
};

export default Post;
