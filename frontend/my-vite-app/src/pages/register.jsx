import toast, { Toaster } from 'react-hot-toast';
import React, { useState } from "react";
import userService from "../services/userService";

const Register = () => {
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        pseudo: '',
        email: '',
        password: ''
    });

    const formValidation = () => {
        let status = true ;
        const localErrors = {...errors} //= en bas
            // pseudo: '',
            // email: '',
            // password: ''
        // };

        if (pseudo === '') {
            localErrors.pseudo = "pseudo required";
            status = false;
        }
        if (email === '') {
            localErrors.email = "email required";
            status = false;
        }
        if (password === '' || password.length < 8) {
            localErrors.password = "password required and min 8 caracteres";
            status = false;
        }


        setErrors(localErrors);
        // console.log(localErrors);
        return status;
    };

    const register = async (e) => {
        e.preventDefault();
        console.log("form submitted");
        console.log("form data", pseudo, email, password);

        if (formValidation()) {
            const data = {
                pseudo: pseudo,
                email: email,
                password: password
            };

            try {
                const response = await userService.register(data);
                console.log("response ===>", response);
                toast.success("Utilisateur créé!");
                setPseudo('');
                setEmail('');
                setPassword('');
            } catch (err) {
                console.log(err);
                toast.error("Utilisateur non créé!");
            }
        } else {
            console.log("form invalid");
        }
    };

    return (
        <div className="register">
            <Toaster />
            <div className="register-cover">
                
            </div>
            <div className="register-content">
                <div>
                    <h1> CHAT SPACE </h1>
                    <p>social media application</p>
                </div>
                <div>
                    <form onSubmit={register}>
                        <div className="form-group">
                            <label>Pseudo</label>
                            <input
                                className="input"
                                type="text"
                                value={pseudo}
                                onChange={(e) => setPseudo(e.target.value)}
                            />
                            {errors.pseudo !== " " ?
                            <p style={{textAlign:'left',color:'orangered'}} >
                                {errors.pseudo}
                                </p> : ''}
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                className="input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                              {errors.email !== " " ?
                            <p style={{textAlign:'left',color:'orangered'}} >
                                {errors.email}
                                </p> : ''}
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                className="input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                             {errors.password !== " " ?
                            <p style={{textAlign:'left',color:'orangered'}} >
                                {errors.password}
                                </p> : ''}
                        </div>

                        <button className="btn signup" type="submit">Sign up</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
