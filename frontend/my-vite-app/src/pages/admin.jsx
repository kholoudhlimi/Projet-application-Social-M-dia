import toast, { Toaster } from 'react-hot-toast';
import React, { useState } from "react";
import userService from "../services/userService";

const Admin = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [picture, setPicture] = useState(null);
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
    });

    const formValidation = () => {
        let status = true;
        const localErrors = { username: '', email: '', password: '' };

        if (username === '') {
            localErrors.username = "Username required";
            status = false;
        }
        if (email === '') {
            localErrors.email = "Email required";
            status = false;
        }
        if (password === '' || password.length < 8) {
            localErrors.password = "Password required and min 8 characters";
            status = false;
        }

        setErrors(localErrors);
        return status;
    };

    const isAdmin = async (e) => {
        e.preventDefault();
    
        if (formValidation()) {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role', 'admin');
    
            if (picture) {
                formData.append('picture', picture);
            }
    
            try {
                const response = await userService.admin(formData);
                console.log("response ===>", response);
    
                // Vérifiez le code de statut de la réponse
                if (response.status === 201) {
                    toast.success("Administrateur créé avec succès !");
                    // Réinitialiser le formulaire
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setPicture(null);
                }
            } catch (err) {
                // Vérifiez si l'erreur est due à un administrateur existant
                if (err.response && err.response.status === 400 && err.response.data.message === 'Un administrateur existe déjà !') {
                    toast.error("Un administrateur existe déjà !");
                } else {
                    console.log('Error in isAdmin:', err);
                    toast.error("Erreur lors de la création de l'administrateur !");
                }
            }
        } else {
            console.log("Form invalid");
        }
    };
    
    

    return (
        <div className="register">
            <Toaster />
            <div className="register-cover"></div>
            <div className="register-content">
                <div>
                    <h1>Social Working CLUB</h1>
                   
                </div>
                <div>
                    <form onSubmit={isAdmin}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                className="input"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && (
                                <p style={{ textAlign: 'left', color: 'orangered' }}>{errors.username}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                className="input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && (
                                <p style={{ textAlign: 'left', color: 'orangered' }}>{errors.email}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>mot de passe</label>
                            <input
                                className="input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && (
                                <p style={{ textAlign: 'left', color: 'orangered' }}>{errors.password}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Photo de profile </label>
                            <input
                                className="input"
                                type="file"
                                onChange={(e) => setPicture(e.target.files[0])}
                            />
                        </div>

                        <button className="btn signup" type="submit">Sign up</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Admin;
