// frontend/src/context/ThemeContext.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { ThemeContext } from './ThemeContextCore';

export { ThemeContext };

export const ThemeProvider = ({ children }) => {
    // Initialize theme based on local storage or default to 'light'
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );

    // Effect to apply the theme class to the HTML element and save to local storage
    useEffect(() => {
        const root = window.document.documentElement;

        // Remove existing theme class
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');

        // Add the new theme class
        root.classList.add(theme);

        // Persist the theme choice
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Function to toggle between light and dark
    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };

    // Memoize the context value
    const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};
