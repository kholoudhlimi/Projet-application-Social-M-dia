import toast, { Toaster } from 'react-hot-toast';
import React, { useState } from "react";
import userService from "../services/userService"; // Assurez-vous que le chemin est correct
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const formValidation = () => {
        let status = true;
        const localErrors = { ...errors };

        if (email === '') {
            localErrors.email = "Email requis";
            status = false;
        } else {
            localErrors.email = ''; // Réinitialiser l'erreur si l'email est valide
        }

        if (password === '' || password.length < 8) {
            localErrors.password = "Mot de passe requis et minimum 8 caractères";
            status = false;
        } else {
            localErrors.password = ''; // Réinitialiser l'erreur si le mot de passe est valide
        }

        setErrors(localErrors);
        return status;
    };

    const login = async (e) => {
        e.preventDefault();
        console.log("Formulaire soumis");

        if (formValidation()) {
            const data = {
                email: email,
                password: password
            };

            try {
                const response = await userService.login(data); // Utilisez 'data' ici
                console.log("Réponse de l'API :", response.data); // Log de la réponse

                const token = response.data.token; // Assurez-vous que votre API retourne le token
                const userId = response.data.user.id; // Assurez-vous que votre API retourne l'ID de l'utilisateur
                const userPicture = response.data.user.picture; // Assurez-vous que votre API retourne l'image de profil
                const username = response.data.user.username; // Assurez-vous que votre API retourne le nom d'utilisateur

                // Stocker les données utilisateur dans localStorage
                localStorage.setItem('token', token); // Stockez le token
                localStorage.setItem('user_data', JSON.stringify({ id: userId, picture: userPicture, username })); // Stockez les données utilisateur

                // Afficher un message de succès et rediriger
                toast.success("Utilisateur connecté !");
                navigate('/home');
            } catch (error) {
                console.error("Erreur lors de la connexion :", error);
                toast.error("Échec de la connexion !");
            }
        } else {
            console.log("Formulaire invalide");
        }
    };

    return (
        <div className="login">
            <Toaster />
            <div className="login-cover"></div>

            <div className="login-content">
                <h1>CHAT SPACE</h1>
                <p>Application de médias sociaux</p>

                <form onSubmit={login}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            className="input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && (
                            <p style={{ textAlign: 'left', color: 'orangered' }}>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input
                            className="input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && (
                            <p style={{ textAlign: 'left', color: 'orangered' }}>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button className="btn signin" type="submit">
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
