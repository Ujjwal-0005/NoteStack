// frontend/src/pages/ProfilePage.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (!user) {
        return <div className="text-center mt-10 text-xl">Loading profile data...</div>;
    }

    const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';

    return (
        <div className="max-w-xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-green-600 dark:text-green-400 border-b pb-3">
                <i className="fas fa-user-circle mr-2"></i> Your Profile
            </h2>

            <div className="space-y-5">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">Name:</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</p>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">Email:</p>
                    <p className="text-xl font-medium text-gray-900 dark:text-white">{user.email}</p>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">Member Since:</p>
                    <p className="text-xl font-medium text-gray-900 dark:text-white">{memberSince}</p>
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                You can manage your notes from the home page.
            </p>
        </div>
    );
};

export default ProfilePage;