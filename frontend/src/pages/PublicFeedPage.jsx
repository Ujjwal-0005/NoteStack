// frontend/src/pages/PublicFeedPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${API_BASE}/notes/public/feed`;

const PublicFeedPage = () => {
    const [publicNotes, setPublicNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const fetchPublicFeed = async (targetPage = 1, append = false) => {
        try {
            if (append) setLoadingMore(true);
            else setLoading(true);

            const res = await axios.get(API_URL, {
                params: { page: targetPage, limit: 12 }
            });
            const data = res.data;

            if (append) {
                setPublicNotes(prev => [...prev, ...data.notes]);
            } else {
                setPublicNotes(data.notes || []);
            }
            setPage(data.page || 1);
            setPages(data.pages || 1);
        } catch (error) {
            console.error("Error fetching public feed:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchPublicFeed(1, false);
    }, []);

    const handleLoadMore = () => {
        if (page < pages && !loadingMore) {
            fetchPublicFeed(page + 1, true);
        }
    };

    if (loading) {
        return <div className="text-center mt-10 text-xl">Loading Public Feed...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h2 className="text-4xl font-extrabold mb-8 text-center text-purple-600 dark:text-purple-400">
                🌎 Global Notes Feed
            </h2>
            <div className="space-y-6">
                {publicNotes.length > 0 ? (
                    publicNotes.map(note => (
                        <div key={note._id} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-l-4 border-purple-500">

                            {/* Author Display (User data is populated by backend) */}
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                                Author:
                                <span className="font-semibold text-purple-600 dark:text-purple-400 ml-1">
                                    {note.user?.name || 'Unknown User'}
                                </span>
                            </p>

                            <h3 className="text-2xl font-bold mb-2">{note.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">{note.content}</p>

                            <Link to={`/view/${note._id}`} className="mt-3 inline-block text-lg font-medium text-blue-500 hover:text-blue-400 transition">
                                Read Full Note →
                            </Link>
                            <small className="block mt-2 text-gray-500 dark:text-gray-400 text-xs">
                                Shared: {new Date(note.updatedAt).toLocaleDateString()}
                            </small>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-xl text-gray-500 dark:text-gray-400 p-10 bg-white dark:bg-gray-800 rounded-lg">
                        No public notes have been shared yet. Be the first!
                    </p>
                )}
            </div>

            {page < pages && (
                <div className="text-center pt-6">
                    <button
                        type="button"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition disabled:opacity-50 cursor-pointer shadow-md"
                    >
                        {loadingMore ? 'Loading more...' : `Load More (Page ${page + 1} of ${pages})`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PublicFeedPage;