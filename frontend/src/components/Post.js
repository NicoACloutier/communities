import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';

const SERVER_PORT = 3000;
const URL = 'http://127.0.0.1';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Post() {
    const query = useQuery();
    const postId = query.get('id');

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState('');

    // Fetch post and comments
    useEffect(() => {
        async function fetchData() {
            try {
                const postRes = await fetch(`${URL}:${SERVER_PORT}/posts/${postId}`, {
                    credentials: 'include',
                });
                if (postRes.ok) {
                    const postData = await postRes.json();
                    setPost(postData);
                }

                const commentsRes = await fetch(`${URL}:${SERVER_PORT}/comments?postId=${postId}`, {
                    credentials: 'include',
                });
                if (commentsRes.ok) {
                    const commentsData = await commentsRes.json();
                    setComments(commentsData);
                }
            } catch (err) {
                setError('Failed to load post or comments.');
            }
        }

        if (postId) {
            fetchData();
        }
    }, [postId]);

    async function handleCommentSubmit(e) {
        e.preventDefault();
        if (!commentText.trim()) return;

        const res = await fetch(`${URL}:${SERVER_PORT}/comments`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                postId,
                text: commentText
            }),
        });

        if (res.ok) {
            const newComment = await res.json();
            setComments([...comments, newComment]);
            setCommentText('');
        } else {
            setError('Failed to post comment.');
        }
    }

    if (!post) {
        return (
            <div className="app-container center">
                <p className="muted">Loading post...</p>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="card post">
                <div className="vote-buttons">
                    <button title="Like">⬆️</button>
                    <div className="vote-count">{post.votes}</div>
                    <button title="Dislike">⬇️</button>
                </div>

                <div className="post-content">
                    <h2>{post.title}</h2>
                    <div className="post-meta muted">
                        Posted by {post.author} on {new Date(post.createdAt).toLocaleString()}
                    </div>
                    <p>{post.body}</p>
                </div>
            </div>

            <div className="card">
                <h3 className="bold">Add a Comment</h3>
                {error && <p className="muted">{error}</p>}
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows="3"
                        placeholder="Write your comment..."
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>

            <div className="card">
                <h3 className="bold">Comments</h3>
                {comments.length === 0 ? (
                    <p className="muted">No comments yet.</p>
                ) : (
                    comments.map((comment, idx) => (
                        <div key={idx} className="comment">
                            <p className="bold">{comment.author}</p>
                            <p>{comment.text}</p>
                            <p className="muted" style={{ fontSize: '0.8rem' }}>
                                {new Date(comment.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Post;
