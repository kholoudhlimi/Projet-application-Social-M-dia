
import toast, { Toaster } from 'react-hot-toast';
import React, { useState } from "react";
import userService from "../services/userService";
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
        let status = true ;
        const localErrors = {...errors} //= en bas
        
            // email: '',
            // password: ''
        // };

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
    const login = async (e) => {
        e.preventDefault();
        console.log("form submitted");
      
        if (formValidation()) {
            const data = {

                email: email,
                password: password
            };

            try {
                const response = await userService.login(data);
                console.log("response ===>", response);
                //save user data localestorage 
                
                localStorage.setItem('user_data', JSON.stringify(response.data.user));

                localStorage.setItem('token',response.data.token)
                
                toast.success("Utilisateur login !");
                setEmail('');
                setPassword('');
//redirection
navigate('/home')


            } catch (err) {
                
                console.log(err);
                toast.error(err.response.data.error);
            }
        } else {
            console.log("form invalid");
        }
    };


    return(

<div className="login">
  <Toaster />
  <div className="login-cover"></div>

  <div className="login-content">
    <h1>CHAT SPACE</h1>
    <p>Social media application</p>

    <form onSubmit={login}>
      <div className="form-group">
        <label>Email</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && errors.email !== " " ? (
          <p style={{ textAlign: 'left', color: 'orangered' }}>
            {errors.email}
          </p>
        ) : null} 
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && errors.password !== " " ? (
          <p style={{ textAlign: 'left', color: 'orangered' }}>
            {errors.password}
          </p>
        ) : null}
      </div>

      <button className="btn signin" type="submit">
        Sign in
      </button>
    </form>
  </div>
</div>

    
 
    )

}
export default Login;