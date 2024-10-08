import React from "react";
import './style.css'; 

const Post = ({ post }) => {
    // Vérifiez si le post existe
    if (!post) {
        return <p>Post non disponible.</p>; 
    }

    // Vérifiez que post.userId est valide, sinon utilisez un objet vide
    const user = post.userId || {}; 

    return (
        <div className="post">
            <div className="post_users_details">
                <div className="user_image">
                    <img 
                        src={user.picture || "/path/to/default-image.jpg"} // Image par défaut
                        alt="User" 
                    />
                </div>
                <div className="user_name">
                    <h5>{user.username || "Inconnu"}</h5> 
                    <span>{new Date(post.createdAt).toLocaleString() || "Date inconnue"}</span> 
                </div>
            </div>
            <div className="post_content_details">
                <p>{post.description}</p>
            </div>
            {post.imageUrl && ( // Afficher l'image du post si elle existe
                <div className="post_image">
                    <img src={post.imageUrl} alt="Post" />
                </div>
            )}
        </div>
    );
};

export default Post;
