import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SERVER_PORT = 3000;
const URL = 'http://127.0.0.1'

function PostCreate() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [community, setCommunity] = useState({});
    const navigate = useNavigate();
    
    function updateTitle(e) {
        setTitle(e.target.value);
    }

    function updateContent(e) {
        setContent(e.target.value);
    }

    async function updateCommunity(e) {
        const response = await fetch(`${URL}:${SERVER_PORT}/communities?name=${e.target.value}`, { method: 'GET', credentials: 'include' });
        setCommunity(await response.json());
    }
    
    async function createPost() {
        const authResponse = await fetch(`${URL}:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
        const authData = await authResponse.json();
        if (authResponse.status === 200) {
            const id = authData.id;
            const response = await fetch(`${URL}:${SERVER_PORT}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ id, title, content, community['community_id'] }),
            });
            navigate('/', { replace: true });
        }
    }
    
    return (
        <div className="App">
            <h3>Community: </h3><input className="form-input" type="text" name="community" placeholder="Community name" onChange={updateCommunity}></input>
            <h3>Title: </h3><input className="form-input" type="text" name="title" placeholder="Post title" onChange={updateTitle}></input>
            <h3>Content: </h3><input className="paragraph-input" type="text" name="content" placeholder="Post content" onChange={updateContent}></input>
            <button type="submit" className="form-button" onClick={createPost}>Submit</button>
        </div>
    );
}

export default PostCreate;
