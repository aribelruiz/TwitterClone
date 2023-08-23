import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Login.scss';

function Login() {

    let navigate = useNavigate();

    const [username, SetUsername] = useState("");
    const [password, SetPassword] = useState("");

    const [errorMessage, SetErrorMessage] = useState("");

    const login = () => {
        const data = { username: username, password: password };

        axios.post("http://localhost:8080/auth/login", data).then((res) => {
            SetErrorMessage(res.data.error);

            if(!res.data.error) {
                sessionStorage.setItem("accessToken", res.data);
                navigate('/');
            }
        });
    };

    return (
        <div className='login'>
            <div className='post-form'>
                <label>Username</label>
                <input type="text" placeholder='(Ex. user123...)' onChange={(e) => {SetUsername(e.target.value)}}/>

                <label>Password</label>
                <input type="password" placeholder='(Your Password...)' onChange={(e) => {SetPassword(e.target.value)}}/>
                
                <span>{errorMessage}</span>
                <button onClick={login}>Log In</button>
            </div>
        </div>
    );
}

export default Login;