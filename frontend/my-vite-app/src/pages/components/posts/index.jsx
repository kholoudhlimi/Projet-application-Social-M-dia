import React, { useEffect, useState } from "react";
import './style.css';
import Post from "./post"; 
import NewPost from "./newPost"; 
import postService from './../../../services/postService';
import { toast } from 'react-toastify';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await postService.getPosts();
            setPosts(response);
        } catch (error) {
            toast.error("Erreur lors de la récupération des posts.");
        }
    };

    const handleDeletePost = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
            try {
                await postService.deletePost(id);
                setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
                toast.success("Post supprimé avec succès.");
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const handleEditPost = (updatedPost) => {
        setPosts(prevPosts => 
            prevPosts.map(post => (post._id === updatedPost._id ? updatedPost : post))
        );
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="posts">
            <NewPost onPostCreated={fetchPosts} />
            {posts.length > 0 ? (
                posts.slice().reverse().map((post) => (
                    <Post 
                        key={post._id} 
                        post={post} 
                        onPostDeleted={handleDeletePost} 
                        onPostUpdated={handleEditPost} 
                    />
                ))
            ) : (
                <p>Aucun post disponible.</p>
            )}
        </div>
    );
};

export default Posts;
