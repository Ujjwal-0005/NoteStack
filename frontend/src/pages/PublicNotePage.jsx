// frontend/src/pages/PublicNotePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${API_BASE}/notes/public`;

const PublicNotePage = () => {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await axios.get(`${API_URL}/${id}`);
                setNote(res.data);
            } catch (err) {
                console.error("Error fetching public note:", err);
                setError('Note not found or is private.');
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-20 text-xl">Loading Note...</div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-2xl text-red-500">{error}</div>;
    }

    if (!note) {
        return <div className="text-center mt-20 text-2xl text-gray-500">Note data could not be loaded.</div>;
    }

    const authorName = note.user?.name || 'Unknown User';

    return (
        <div className="max-w-3xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
            <h1 className="text-4xl font-extrabold mb-4 text-center text-blue-600 dark:text-blue-400">{note.title}</h1>

            <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed mb-6">
                {note.content}
            </p>

            <div className="border-t pt-4 mt-6 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <p>
                    **Author:** <span className="font-semibold text-gray-800 dark:text-white">{authorName}</span>
                </p>
                <p>
                    **Shared:** {new Date(note.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default PublicNotePage;