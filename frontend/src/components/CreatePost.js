import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SERVER_PORT = 3000;
const URL = 'http://127.0.0.1';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [community, setCommunity] = useState('');
    const [message, setMessage] = useState('');
    const [communities, setCommunities] = useState([]);
    const navigate = useNavigate();

    // Fetch communities to choose from
    useEffect(() => {
        const fetchCommunities = async () => {
            const response = await fetch(`${URL}:${SERVER_PORT}/communities`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setCommunities(data);
            } else {
                setMessage('Failed to load communities.');
            }
        };

        fetchCommunities();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !body || !community) {
            setMessage('Please fill in all fields.');
            return;
        }

        const response = await fetch(`${URL}:${SERVER_PORT}/posts`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                body,
                community
            }),
        });

        if (response.status === 200) {
            navigate('/home');
        } else {
            setMessage('Failed to create post. Try again.');
        }
    };

    return (
        <div className="card">
            <h2 className="center bold">Create New Post</h2>

            {message && <p className="muted center">{message}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post title"
                    />
                </div>

                <div>
                    <label htmlFor="body">Body</label>
                    <textarea
                        id="body"
                        rows="5"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Write your post here..."
                    />
                </div>

                <div>
                    <label htmlFor="community">Community</label>
                    <select
                        id="community"
                        value={community}
                        onChange={(e) => setCommunity(e.target.value)}
                    >
                        <option value="">Select a community</option>
                        {communities.map((c) => (
                            <option key={c.id} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="center">
                    <button type="submit">Submit</button>
                    &nbsp;
                    <button type="button" onClick={() => navigate('/home')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatePost;
