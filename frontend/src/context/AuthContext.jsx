// frontend/src/context/AuthContext.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContextCore';

export { AuthContext };

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = API_BASE;

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setLoading(false); // Reset loading state on logout
    }, []);

    const fetchUserData = useCallback(async (authToken) => {
        if (!authToken) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(`${API_URL}/users/profile`, {
                headers: { 'x-auth-token': authToken }
            });

            setUser(res.data);
            setLoading(false); // Set loading to false on successful fetch
        } catch (err) {
            console.error('Failed to fetch user data, logging out:', err);
            // If the token is invalid or the API fails, log the user out
            logout();
        }
    }, [logout]);

    useEffect(() => {
        if (token) {
            // Set default header for all subsequent API calls
            axios.defaults.headers.common['x-auth-token'] = token;

            // Fetch user data when component mounts with a token, or token changes
            fetchUserData(token);
        } else {
            // If no token is found in localStorage
            delete axios.defaults.headers.common['x-auth-token'];
            setUser(null);

            // CRITICAL: Ensure loading is set to false so the App can render the login screen
            setLoading(false);
        }
    }, [token, fetchUserData]); // fetchUserData is included to satisfy useCallback dependencies

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/users/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
    };

    const signup = async (name, email, password) => {
        const res = await axios.post(`${API_URL}/users/register`, { name, email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
