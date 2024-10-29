import React, { useState } from 'react';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
const Comment = ({ comment, onDelete, onEdit, currentUserId, currentUserRole }) => {
    const { userId, coment, createdAt } = comment;
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(coment);
    
    const username = userId?.username || "Inconnu";
    const userPicture = userId?.picture || "/path/to/default-image.jpg";

    const handleEditSubmit = () => {
        if (editedComment.trim() !== coment) { // Vérifier si le commentaire a été modifié
            onEdit({ ...comment, coment: editedComment });
        }
        setIsEditing(false);
    };

    return (
        <div className="comment">
            <div className="comment_user_details">
                <img src={userPicture} alt={username} className="user-picture" />
                <div className="user_name">
                    <h5>{username}</h5>
                    <span>{new Date(createdAt).toLocaleString() || "Date inconnue"}</span>
                </div>
                {(userId?._id === currentUserId || currentUserRole === 'admin') && ( // Vérification pour les admins
                    <div className="comment_actions" style={{ display: 'block' }}>
                        {isEditing ? (
                            <>
                                <button onClick={handleEditSubmit}>Sauvegarder</button>
                                <button onClick={() => setIsEditing(false)}>Annuler</button>
                            </>
                        ) : (
                            <>
                                <span className="icon" onClick={() => setIsEditing(true)} title="Modifier">
                                    <FontAwesomeIcon icon={faEdit} />
                                </span>
                                <span className="icon" onClick={() => onDelete(comment._id)} title="Supprimer">
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="comment_content">
                {isEditing ? (
                    <textarea
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                    />
                ) : (
                    <p>{coment || "Texte du commentaire manquant"}</p>
                )}
            </div>
        </div>
    );
};

export default Comment;
