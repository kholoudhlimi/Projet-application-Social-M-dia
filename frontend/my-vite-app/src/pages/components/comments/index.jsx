import React, { useEffect, useState } from "react";
import commentService from './../../../services/commentServices';
import NewComment from './newcomment'; 
import Comment from './comment'; 
import './style.css';

const Comments = ({ postId, currentUserId ,currentUserRole}) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchComments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await commentService.getAllComents();
            const commentsData = response.data || [];
            const filteredComments = commentsData.filter(comment => comment.postId === postId);

            filteredComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setComments(filteredComments);
        } catch (error) {
            console.error("Erreur lors de la récupération des commentaires :", error);
            setError("Impossible de récupérer les commentaires. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleCommentAdded = () => {
        fetchComments();
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await commentService.deleteComent(commentId);
            fetchComments();
        } catch (error) {
            console.error("Erreur lors de la suppression du commentaire :", error);
            setError("Impossible de supprimer le commentaire. Veuillez réessayer.");
        }
    };

    const handleEditComment = async (updatedComment) => {
        try {
            await commentService.updateComent(updatedComment._id, { coment: updatedComment.coment });
            fetchComments(); // Recharger les commentaires après mise à jour
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            setError("Impossible de mettre à jour le commentaire. Veuillez réessayer.");
        }
    };

    if (loading) {
        return <div className="loading">Chargement des commentaires...</div>;
    }

    return (
        <div className="comments">
            <NewComment postId={postId} onCommentAdded={handleCommentAdded} />
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <Comment 
                        key={comment._id} 
                        comment={comment} 
                        onDelete={handleDeleteComment}
                        onEdit={handleEditComment}
                        currentUserId={currentUserId}
                        currentUserRole={currentUserRole}
                    />
                ))
            ) : (
                <p>Aucun commentaire disponible.</p>
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Comments;
