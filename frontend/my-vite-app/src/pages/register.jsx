import toast, { Toaster } from 'react-hot-toast';
import React, { useState } from "react";
import userService from "../services/userService";

const Register = () => {
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

    const register = async (e) => {
        e.preventDefault();

        if (formValidation()) {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);

            if (picture) {
                formData.append('picture', picture);
            }

            try {
                const response = await userService.register(formData);
                console.log("response ===>", response);
                toast.success("Utilisateur créé!");
                setUsername('');
                setEmail('');
                setPassword('');
                setPicture(null);
            } catch (err) {
                console.log(err);
                toast.error("Utilisateur non créé!");
            }
        } else {
            console.log("Form invalid");
        }
    };

    return (
        <div className="register">
            <Toaster />
            <div className="register-content">
                <div>
                    <h1>Social Working CLUB</h1>
                    <p>Social media application</p>
                </div>
                <div>
                    <form onSubmit={register}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                className="input"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && (
                                <p style={{textAlign:'left',color:'orangered'}}>{errors.username}</p>
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
                                <p style={{textAlign:'left',color:'orangered'}}>{errors.email}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                className="input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && (
                                <p style={{textAlign:'left',color:'orangered'}}>{errors.password}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Picture</label>
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

export default Register;
