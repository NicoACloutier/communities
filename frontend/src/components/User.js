import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SERVER_PORT = 3000;
const URL = 'http://127.0.0.1';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function User() {
    const query = useQuery();
    const username = query.get('id');
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            try {
                const userRes = await fetch(`${URL}:${SERVER_PORT}/users/${username}`, {
                    credentials: 'include'
                });
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);
                } else {
                    setError('User not found.');
                }
            } catch (err) {
                setError('Failed to load user profile.');
            }
        }

        async function fetchUserPosts() {
            try {
                const res = await fetch(`${URL}:${SERVER_PORT}/posts?author=${username}`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (err) {
                console.error('Failed to load user posts.');
            }
        }

        if (username) {
            fetchUser();
            fetchUserPosts();
        }
    }, [username]);

    function goToPost(postId) {
        navigate(`/post?id=${postId}`);
    }

    if (error) {
        return (
            <div className="app-container center">
                <p className="muted">{error}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="app-container center">
                <p className="muted">Loading user profile...</p>
            </div>
        );
    }

    return (
        <div className="app-container">
            <h1>{user.username}</h1>
            {user.createdAt && (
                <p className="muted">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
            )}

            <h2>User's Posts</h2>
            {posts.length === 0 ? (
                <p className="muted">This user hasn't posted anything yet.</p>
            ) : (
                posts.map(post => (
                    <div className="card post" key={post.id} onClick={() => goToPost(post.id)} style={{ cursor: 'pointer' }}>
                        <div className="vote-buttons">
                            <button title="Upvote">⬆️</button>
                            <div className="vote-count">{post.votes}</div>
                            <button title="Downvote">⬇️</button>
                        </div>

                        <div className="post-content">
                            <h3>{post.title}</h3>
                            <div className="post-meta muted">
                                Posted on {new Date(post.createdAt).toLocaleString()}
                            </div>
                            <p>{post.body.length > 150 ? post.body.slice(0, 150) + '...' : post.body}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default User;
