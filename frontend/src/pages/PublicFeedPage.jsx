// frontend/src/pages/PublicFeedPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FeedSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';

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
                params: { page: targetPage, limit: 12 },
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
            console.error('Error fetching public feed:', error);
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

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center py-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                    Community Notes
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-md mx-auto">
                    Public thoughts, ideas, and knowledge shared by users around the globe.
                </p>
            </div>

            {loading ? (
                <FeedSkeleton count={4} />
            ) : publicNotes.length > 0 ? (
                <div className="space-y-4">
                    {publicNotes.map(note => (
                        <article
                            key={note._id}
                            className="card p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
                            aria-label={`Public note: ${note.title}`}
                        >
                            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                                <span>
                                    By{' '}
                                    <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                                        {note.user?.name || 'Anonymous'}
                                    </strong>
                                </span>
                                <time dateTime={note.updatedAt}>
                                    {new Date(note.updatedAt).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </time>
                            </div>

                            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                                <Link
                                    to={`/view/${note._id}`}
                                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    {note.title}
                                </Link>
                            </h2>

                            <div className="md-prose line-clamp-3 text-sm">
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

                            {note.tags && note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {note.tags.map((t, idx) => (
                                        <span key={idx} className="tag-chip text-xs">
                                            #{t}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="pt-2 flex justify-end">
                                <Link
                                    to={`/view/${note._id}`}
                                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                >
                                    Read full note →
                                </Link>
                            </div>
                        </article>
                    ))}

                    {page < pages && (
                        <div className="text-center pt-6">
                            <button
                                type="button"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="btn-ghost text-sm px-6 py-2.5"
                            >
                                {loadingMore ? 'Loading more...' : `Load more notes (${page} of ${pages})`}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <EmptyState
                    icon="🌐"
                    title="No public notes shared yet"
                    description="Be the first to publish a note for the community to see!"
                />
            )}
        </div>
    );
};

export default PublicFeedPage;
