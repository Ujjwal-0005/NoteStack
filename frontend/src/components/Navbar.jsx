// frontend/src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
    const { token, user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    // Display name: uses 'name' if available, otherwise the part of email before '@'
    const displayName = user ? (user.name || user.email.split('@')[0]) : 'Profile';

    // Emojis for Theme Toggle
    const ThemeIcon = theme === 'dark' ? (
        <span role="img" aria-label="sun" className="text-xl">☀️</span>
    ) : (
        <span role="img" aria-label="moon" className="text-xl">🌙</span>
    );

    const themeButton = (
        <button
            onClick={toggleTheme}
            // 🔑 FIX: Use consistent padding 'p-1' and add 'leading-none' for better vertical centering
            className="p-1 rounded-full text-gray-300 hover:text-white transition bg-gray-700 hover:bg-gray-600 leading-none"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
            {ThemeIcon}
        </button>
    );

    const authLinks = (
        <div className="flex space-x-4 items-center">
            {themeButton} {/* Use the reusable component */}

            <Link to="/feed" className="hover:text-gray-300">Public Feed</Link>

            {/* User Profile Button */}
            <Link to="/profile" className="text-white hover:text-gray-300 font-semibold">
                {displayName}
            </Link>

            <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition duration-200"
            >
                Logout
            </button>
        </div>
    );

    const guestLinks = (
        // 🔑 FIX: Add 'items-center' to vertically align the theme button with the links
        <div className="flex space-x-4 items-center">
            {themeButton} {/* Use the reusable component */}
            <Link to="/feed" className="hover:text-gray-300">Public Feed</Link>
            <Link to="/login" className="hover:text-gray-300">Login</Link>
            <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
        </div>
    );

    return (
        <nav className="bg-gray-800 p-4 text-white shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold text-blue-400">NoteStack</Link>
                {token ? authLinks : guestLinks}
            </div>
        </nav>
    );
};

export default Navbar;