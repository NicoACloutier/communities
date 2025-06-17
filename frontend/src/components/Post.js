import React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';

const SERVER_PORT = 3000;

async function getComments(post_id) {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/comments?post_id=${post_id}`, { method: 'GET' });
    return await response.json();
}

async function getSubComments(comment_id) {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/comments?comment_id=${comment_id}`, { method: 'GET' });
    return await response.json();
}

async function getPost(post_id) {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/posts?id=${pollId}`, { method: 'GET' });
    const data = await response.json();
    const comments = await getComments(post_id);
    data.comments = comments;
    return data;
}

async function getOriginator(user_id) {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/users?id=${user_id}`, { method: 'GET' });
    return await response.json();
}

function Post() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState({});
    const [originator, setOriginator] = useState({});
    const [postId, setPostId] = useState(undefined);
    const [ownPost, setOwnPost] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const authResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
            const authData = await authResponse.json();
            if (authResponse.status === 200) {
                setUser(authData);
            }
            const id = window.location.hash.match(/poll\?p=([^&/]+)/)[1];
            const data = await getPoll(id);
            const entered = await getEntry(authData.id, id);
            setOriginator(await getOriginator(data.user_id));
            setOwnPost(data.user_id === authData.id);
            setPostId(id);
            setContent(data.content);
            setTitle(data.title);
            setComments(data.comments);
        }
        fetchData();
    }, []);
    
    return (
        <div className="app-container">
            <p className="post-title">{title}</p>
            <p className="post-content">{content}</p>
            <div className="comments">
                <ul>{comments.map(x => <li key={x.content}>{x.content}</li>)}</ul>
            </div>
        </div>
    );
}

export default Post;
