import toast, { Toaster } from 'react-hot-toast';
import React, { useState } from "react";
import userService from "../services/userService"; // Ensure this path is correct
import { useNavigate, Link } from 'react-router-dom';

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
            localErrors.email = ''; // Reset error if email is valid
        }

        if (password === '' || password.length < 8) {
            localErrors.password = "Mot de passe requis et minimum 8 caractères";
            status = false;
        } else {
            localErrors.password = ''; // Reset error if password is valid
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
                const response = await userService.login(data);
                console.log("Réponse de l'API :", response.data);
                const token = response.data.token;
                const userId = response.data.user.id;
                const userPicture = response.data.user.picture;
                const username = response.data.user.username;
                const userRole = response.data.user.role;

                // Store user data in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user_data', JSON.stringify({ id: userId, picture: userPicture, username, userRole }));

                // Show success message and redirect
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
                <h1>Social Working CLUB</h1>
                
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

                <div className="register-link">
                    <p>Vous n'avez pas de compte ? <Link to="/register">S'inscrire</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
