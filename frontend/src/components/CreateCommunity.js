import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SERVER_PORT = 3000;
const URL = 'http://127.0.0.1';

function CreateCommunity() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description) {
            setMessage('Please fill in all fields.');
            return;
        }

        const response = await fetch(`${URL}:${SERVER_PORT}/communities`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                description,
            }),
        });

        if (response.ok) {
            navigate('/community');
        } else {
            setMessage('Failed to create community. Try again.');
        }
    };

    return (
        <div className="card">
            <h2 className="center bold">Create a New Community</h2>

            {message && <p className="muted center">{message}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Community Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter community name"
                    />
                </div>

                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the purpose of the community"
                    />
                </div>

                <div className="center">
                    <button type="submit">Submit</button>
                    &nbsp;
                    <button type="button" onClick={() => navigate('/community')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateCommunity;
