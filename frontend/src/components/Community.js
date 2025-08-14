import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SERVER_PORT = 3000;
const URL = 'http://127.0.0.1';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Community() {
    const query = useQuery();
    const communityName = query.get('name');
    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCommunity() {
            try {
                const res = await fetch(`${URL}:${SERVER_PORT}/communities/${communityName}`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setCommunity(data);
                } else {
                    setError('Community not found.');
                }
            } catch (err) {
                setError('Failed to load community.');
            }
        }

        async function fetchCommunityPosts() {
            try {
                const res = await fetch(`${URL}:${SERVER_PORT}/posts?community=${communityName}`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (err) {
                console.error('Failed to load community posts.');
            }
        }

        if (communityName) {
            fetchCommunity();
            fetchCommunityPosts();
        }
    }, [communityName]);

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

    if (!community) {
        return (
            <div className="app-container center">
                <p className="muted">Loading community...</p>
            </div>
        );
    }

    return (
        <div className="app-container">
            <h1>{community.name}</h1>
            <p className="muted">{community.description}</p>

            <h2>Posts</h2>
            {posts.length === 0 ? (
                <p className="muted">No posts in this community yet.</p>
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

export default Community;
