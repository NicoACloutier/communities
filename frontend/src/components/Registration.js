import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SERVER_PORT = 3000;
const URL = 'http://127.0.0.1';

function Registration() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleNameChange = (e) => setName(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleRepeatedPasswordChange = (e) => setRepeatedPassword(e.target.value);

    async function createUser() {
        if (!email || !name || !password || !repeatedPassword) {
            setMessage('Please fill in all fields.');
            return;
        }
        if (password !== repeatedPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        const registerResponse = await fetch(`${URL}:${SERVER_PORT}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, enteredPassword: password }),
        });

        if (registerResponse.status !== 200) {
            setMessage('An error occurred on the server. Try again later.');
            return;
        }

        const response = await fetch(`${URL}:${SERVER_PORT}/auth/in`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, enteredPassword: password }),
        });

        if (response.status === 200) {
            navigate('/', { replace: true });
        } else {
            setMessage('Registration succeeded, but login failed.');
            navigate('/', { replace: true });
        }
    }

    return (
        <div className="card">
            <h2 className="center bold">Register</h2>

            {message && <p className="muted center">{message}</p>}

            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={handleEmailChange}
                />
            </div>

            <div>
                <label htmlFor="name">Username</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Username"
                    value={name}
                    onChange={handleNameChange}
                />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                />
            </div>

            <div>
                <label htmlFor="repeatedPassword">Repeat Password</label>
                <input
                    type="password"
                    id="repeatedPassword"
                    name="repeatedPassword"
                    placeholder="Repeat password"
                    value={repeatedPassword}
                    onChange={handleRepeatedPasswordChange}
                />
            </div>

            <div className="center">
                <button onClick={() => navigate('/', { replace: true })}>
                    Login
                </button>
                &nbsp;
                <button type="submit" onClick={createUser}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Registration;
