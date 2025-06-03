import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import Home from './components/Home.js';

const SERVER_PORT = 3000;

function App() {
    const [userData, setUserData] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    
    const router = createHashRouter([
        {
            path: '/',
            element: <Home />,
        },
    ]);

    return (
        <div className="app-container">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
