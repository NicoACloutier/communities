import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import Community from './components/Community.js';
import CreateCommunity from './components/CreateCommunity.js';
import CreatePost from './components/CreatePost.js';
import Home from './components/Home.js';
import Login from './components/Login.js';
import NotFound from './components/NotFound.js';
import Post from './components/Post.js';
import Profile from './components/Profile.js';
import Registration from './components/Registration.js';
import Search from './components/Search.js';
import User from './components/User.js';

const SERVER_PORT = 3000;
const URL = 'http://127.0.0.1';

async function getUser() {
    const response = await fetch(`${URL}:${SERVER_PORT}/auth`,
        { method: 'GET', credentials: 'include', },
    );
    if (response == undefined || response.status != 200) { return undefined; }
    return await response.json();
}

function App() {
    const [userData, setUserData] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    
    const router = createHashRouter([
        {
            path: '/',
            element: <Home setUserData={x => setUserData(x)}/>
        },
        {
            path: '/community',
            element: <Community />
        },
        {
            path: '/community/create',
            element: <CreateCommunity />
        },
        {
            path: '/home',
            element: <Home setUserData={x => setUserData(x)} />
        },
        {
            path: '/post',
            element: <Post />
        },
        {
            path: '/post/create',
            element: <CreatePost />
        },
        {
            path: '/profile',
            element: <Profile />
        },
        {
            path: '/search',
            element: <Search />
        },
        {
            path: '/user',
            element: <User />
        },
        {
            path: '*',
            element: <NotFound />
        }
    ]);

    const loggedOutRouter = createHashRouter([
        {
            path: '/',
            element: <Login setLoggedIn={x => setLoggedIn(x)}/>,
        },
        {
            path: '/register',
            element: <Registration />,
        },
        {
            path: '*',
            element: <NotFound />,
        }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getUser();
            if (data === undefined) setLoggedIn(false);
            else { setLoggedIn(true); setUserData(data); }
        }
    }, []);

    function logout() {
        fetch(`${URL}:${SERVER_PORT}/auth/out`, { method: 'POST', credentials: 'include' });
        setLoggedIn(false);
    }

    if (loggedIn) {
        return (
            <div className="app-container">
                <RouterProvider router={router} />
            </div>
        );
    } else {
        return (
            <div className="app-container">
                <RouterProvider router={loggedOutRouter} />
            </div>
        )
    }
}

export default App;
