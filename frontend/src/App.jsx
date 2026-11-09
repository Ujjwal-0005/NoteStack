// frontend/src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PublicFeedPage from './pages/PublicFeedPage';
import PublicNotePage from './pages/PublicNotePage';
import ProfilePage from './pages/ProfilePage';

function App() {
    const { token, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3500,
                    className: 'dark:!bg-neutral-900 dark:!text-neutral-100 dark:!border dark:!border-neutral-800 shadow-lg text-sm rounded-xl',
                }}
            />
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-1 max-w-6xl">
                <Routes>
                    {/* Protected */}
                    <Route path="/" element={token ? <HomePage /> : <Navigate to="/login" />} />
                    <Route path="/note/:id" element={token ? <HomePage /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />

                    {/* Public / Auth */}
                    <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/signup" element={!token ? <SignupPage /> : <Navigate to="/" />} />
                    <Route path="/feed" element={<PublicFeedPage />} />
                    <Route path="/view/:id" element={<PublicNotePage />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
