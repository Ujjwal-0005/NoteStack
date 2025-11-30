// frontend/src/pages/SignupPage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const validatePassword = (pwd) => {
        // Regex: at least 8 chars AND at least one special symbol (!@#$%^&*)
        const passwordRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;

        if (!passwordRegex.test(pwd)) {
            setPasswordError('Password must be at least 8 characters long and contain at least one special symbol (!@#$%^&*).');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword(password)) {
            return;
        }

        try {
            await signup(name, email, password);
            navigate('/');
        } catch (error) {
            console.error('Failed to sign up', error);
            const errorMessage = error.response?.data?.msg || 'Failed to sign up. Please try again.';
            alert(errorMessage);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => validatePassword(password)}
                        className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    {passwordError && (
                        <p className="mt-1 text-xs text-red-500">{passwordError}</p>
                    )}
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold">
                    Sign Up
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
            </p>
        </div>
    );
};

export default SignupPage;