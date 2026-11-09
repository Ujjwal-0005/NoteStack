// frontend/src/pages/PublicNotePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
                console.error('Error fetching public note:', err);
                setError('Note not found or is no longer public.');
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto my-10 card p-8 space-y-4" aria-busy="true">
                <div className="skeleton h-8 w-2/3 rounded-lg" />
                <div className="skeleton h-4 w-40 rounded" />
                <div className="space-y-2 pt-4">
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-5/6 rounded" />
                    <div className="skeleton h-4 w-4/6 rounded" />
                </div>
            </div>
        );
    }

    if (error || !note) {
        return (
            <div className="max-w-md mx-auto my-16 text-center card p-8">
                <span className="text-3xl" role="img" aria-hidden="true">🔒</span>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-3">
                    {error || 'Note not found'}
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 mb-6">
                    This note may have been made private, deleted, or never existed.
                </p>
                <Link to="/feed" className="btn-primary">
                    ← Back to Public Feed
                </Link>
            </div>
        );
    }

    const authorName = note.user?.name || 'Anonymous';
    const formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <article className="max-w-3xl mx-auto my-8">
            <div className="card p-8 md:p-10 space-y-6">
                <div>
                    <Link
                        to="/feed"
                        className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-4"
                    >
                        ← Back to feed
                    </Link>
                    <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
                        {note.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                        <span>By <strong className="font-semibold text-neutral-800 dark:text-neutral-200">{authorName}</strong></span>
                        <span>•</span>
                        <time dateTime={note.createdAt}>Published on {formattedDate}</time>
                    </div>
                </div>

                {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                        {note.tags.map((tag, idx) => (
                            <span key={idx} className="tag-chip">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6">
                    <div className="md-prose max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                html: () => null,
                                a: ({ href, children }) => (
                                    <a href={href} target="_blank" rel="noopener noreferrer">
                                        {children}
                                    </a>
                                ),
                            }}
                        >
                            {note.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PublicNotePage;
