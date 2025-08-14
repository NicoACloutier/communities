import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SERVER_PORT = 3000;
const URL = 'http://127.0.0.1';

function Home({ setUserData }) {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch(`${URL}:${SERVER_PORT}/auth`, {
                credentials: 'include'
            });
            if (res.ok) {
                const user = await res.json();
                setUserData(user);
            }
        }

        fetchUser();
    }, [setUserData]);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch(`${URL}:${SERVER_PORT}/posts`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                } else {
                    setError('Failed to fetch posts.');
                }
            } catch (err) {
                setError('An error occurred while fetching posts.');
            }
        }

        fetchPosts();
    }, []);

    function goToPost(postId) {
        navigate(`/post?id=${postId}`);
    }

    return (
        <div className="app-container">
            <h1>Home Feed</h1>
            {error && <p className="muted center">{error}</p>}
            {posts.length === 0 && !error ? (
                <p className="muted center">No posts yet. Be the first to post!</p>
            ) : (
                posts.map(post => (
                    <div className="card post" key={post.id} onClick={() => goToPost(post.id)} style={{ cursor: 'pointer' }}>
                        <div className="vote-buttons">
                            <button title="Upvote">⬆️</button>
                            <div className="vote-count">{post.votes}</div>
                            <button title="Downvote">⬇️</button>
                        </div>

                        <div className="post-content">
                            <h2>{post.title}</h2>
                            <div className="post-meta muted">
                                Posted by {post.author} on {new Date(post.createdAt).toLocaleString()}
                            </div>
                            <p>{post.body.length > 150 ? post.body.slice(0, 150) + '...' : post.body}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;

