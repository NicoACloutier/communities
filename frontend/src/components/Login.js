import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SERVER_PORT = 3000;
const URL = 'http://127.0.0.1';

function Login({ setLoggedIn }) {
    const [email, setEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    async function login() {
        setMessage('');
        const response = await fetch(`${URL}:${SERVER_PORT}/auth/in`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, enteredPassword }),
        });

        if (response.status === 200) {
            setLoggedIn(true);
        } else if (response.status === 401) {
            setMessage('Incorrect username or password.');
        } else {
            setMessage('User not found.');
        }
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handleEnteredPasswordChange(e) {
        setEnteredPassword(e.target.value);
    }

    useEffect(() => {
        const checkAuth = async () => {
            const authResponse = await fetch(`${URL}:${SERVER_PORT}/auth`, {
                method: 'GET',
                credentials: 'include',
            });
            if (authResponse.status === 200) {
                setLoggedIn(true);
            }
        };
        checkAuth();
    }, [setLoggedIn]);

    return (
        <div className="card">
            <h2 className="center bold">Login</h2>

            {message && <p className="muted center">{message}</p>}

            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={handleEmailChange}
                />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={enteredPassword}
                    onChange={handleEnteredPasswordChange}
                />
            </div>

            <div className="center">
                <button onClick={() => navigate('/register', { replace: true })}>
                    Register
                </button>
                &nbsp;
                <button type="submit" onClick={login}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Login;
