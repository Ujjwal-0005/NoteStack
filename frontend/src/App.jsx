// frontend/src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
    return <div className="text-center pt-20">Loading Application...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          {/* Protected Routes */}
          <Route path="/" element={token ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/note/:id" element={token ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />

          {/* Public/Auth Routes */}
          <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!token ? <SignupPage /> : <Navigate to="/" />} />
          <Route path="/feed" element={<PublicFeedPage />} />
          <Route path="/view/:id" element={<PublicNotePage />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;