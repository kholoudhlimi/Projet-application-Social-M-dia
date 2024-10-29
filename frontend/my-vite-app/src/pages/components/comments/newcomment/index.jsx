import React, { useState } from 'react';
import commentService from '../../../../services/commentServices';
import './style.css';
const NewComment = ({ postId, onCommentAdded }) => {
    const [comment, setComment] = useState("");
    const userData = JSON.parse(localStorage.getItem('user_data'));
    const userId = userData ? userData.id : null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert("Veuillez vous connecter pour commenter.");
            return;
        }

        try {
            const data = {
                userId,
                postId,
                coment: comment,
            };
            
            await commentService.createComent(data);
            setComment("");
            onCommentAdded();
        } catch (error) {
            console.error("Erreur lors de l'ajout du commentaire :", error.message);
            alert("Une erreur s'est produite lors de l'ajout du commentaire. Veuillez réessayer.");
        }
    };

    return (
        <form className='new_comment' onSubmit={handleSubmit}>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Écrivez un commentaire..."
                required
            />
            <button type="submit">Commenter</button>
        </form>
    );
};

export default NewComment;
