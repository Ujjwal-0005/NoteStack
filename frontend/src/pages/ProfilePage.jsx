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
        return (
            <div className="max-w-xl mx-auto my-12 card p-8 space-y-4" aria-busy="true">
                <div className="skeleton h-7 w-1/3 rounded" />
                <div className="skeleton h-14 w-full rounded-xl" />
                <div className="skeleton h-14 w-full rounded-xl" />
                <div className="skeleton h-14 w-full rounded-xl" />
            </div>
        );
    }

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
        : 'N/A';

    return (
        <div className="max-w-xl mx-auto my-12">
            <div className="card p-8">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        Account Profile
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Your personal NoteStack account details.
                    </p>
                </div>

                <dl className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
                    <div className="py-3 flex justify-between items-center">
                        <dt className="text-neutral-500 dark:text-neutral-400 font-medium">Full Name</dt>
                        <dd className="font-semibold text-neutral-900 dark:text-neutral-100">{user.name}</dd>
                    </div>

                    <div className="py-3 flex justify-between items-center">
                        <dt className="text-neutral-500 dark:text-neutral-400 font-medium">Email Address</dt>
                        <dd className="font-medium text-neutral-900 dark:text-neutral-100">{user.email}</dd>
                    </div>

                    <div className="py-3 flex justify-between items-center">
                        <dt className="text-neutral-500 dark:text-neutral-400 font-medium">Member Since</dt>
                        <dd className="text-neutral-600 dark:text-neutral-300">{memberSince}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};

export default ProfilePage;
