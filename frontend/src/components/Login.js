import React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const SERVER_PORT = 3000;
const URL = 'http://127.0.0.1'

function Login({ setLoggedIn }) {
    const [email, setEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    async function login() {
        setMessage("");
        const response = await fetch(`${URL}:${SERVER_PORT}/auth/in`, {
            method: 'POST',
            credentials: 'include',
            withCredentials: true,
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ email, enteredPassword }),
        });
        if (response.status === 200) { setLoggedIn(true); }
        else if (response.status === 401) { setMessage("Incorrect username or password."); }
        else { setMessage("User not found."); }
    }
    
    function handleEmailChange(e) {
        setEmail(e.target.value);
    }
    
    function handleEnteredPasswordChange(e) {
        setEnteredPassword(e.target.value);
    }

    useEffect(() => {
        const fetchData = async () => {
            const authResponse = await fetch(`${URL}:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
            if (authResponse.status === 200) {
                setLoggedIn(true);
            }
        };
        fetchData();
    }, []);
    
    return (
        <div className="login">
            <label className="login-title">Login</label><p />
            <button className="login-button" onClick={x => navigate('/register', { replace: true })}>Register</button><p />
            <label id="notification">{message}</label><p />
            <input className="login-input" type="text" id="email" name="email" placeholder="email@example.com" onChange={handleEmailChange}></input><br />
            <input className="login-input" type="password" id="password" name="password" placeholder="Password" onChange={handleEnteredPasswordChange}></input><p />
            <button className="login-button" type="submit" onClick={login}>Submit</button>
        </div>
    );
}

export default Login;
