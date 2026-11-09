// frontend/src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${API_BASE}/notes/public/feed`;

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className="text-emerald-500 shrink-0" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const LandingPage = () => {
    const [publicNotes, setPublicNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchRecentPublicNotes = async () => {
            try {
                const res = await axios.get(API_URL, {
                    params: { page: 1, limit: 3 }
                });
                if (isMounted) {
                    setPublicNotes(res.data?.notes || []);
                }
            } catch (err) {
                console.error('Failed to load recent public notes for landing page:', err);
            } finally {
                if (isMounted) setLoadingNotes(false);
            }
        };
        fetchRecentPublicNotes();
        return () => { isMounted = false; };
    }, []);

    const features = [
        {
            title: 'Private by default, public on demand',
            desc: 'Every note starts strictly private to your account. Switch a single toggle whenever you want to share a piece of writing publicly.',
            icon: '🔒'
        },
        {
            title: 'Markdown editor with live preview',
            desc: 'Write with full GitHub-flavored markdown formatting — code blocks, tables, lists, quotes — and switch instantly between editor and preview.',
            icon: '📝'
        },
        {
            title: 'Instant search & tag filtering',
            desc: 'Fast debounced text search across titles and note bodies, plus lowercase tag filtering with up to 5 custom tags per note.',
            icon: '🔍'
        },
        {
            title: 'Pin, archive, and trash bin',
            desc: 'Pin urgent notes to the top of your list, archive inactive notes out of view, or soft-delete them to a trash bin you can restore from or purge.',
            icon: '📌'
        },
        {
            title: 'Global community feed',
            desc: 'Discover knowledge shared by other users on the public feed. Read notes in clean typography without author emails being exposed.',
            icon: '🌐'
        },
        {
            title: 'Polished light & dark modes',
            desc: 'Built-in high-contrast theme toggle with system memory so your eyes stay comfortable whether writing at noon or midnight.',
            icon: '🌓'
        }
    ];

    const steps = [
        {
            num: '01',
            title: 'Create your free account',
            desc: 'Sign up in seconds with just your name, email, and password. No credit card or tracking.'
        },
        {
            num: '02',
            title: 'Write with Markdown',
            desc: 'Draft your ideas, meeting notes, code snippets, or daily journal entries in a distraction-free editor.'
        },
        {
            num: '03',
            title: 'Keep private or share',
            desc: 'Keep notes secure in your private workspace, or toggle "Public" to share a direct link with anyone.'
        }
    ];

    return (
        <div className="space-y-24 md:space-y-32 py-6">
            {/* ── 1. Hero Section ────────────────────────────────────────── */}
            <section className="text-center max-w-4xl mx-auto space-y-8 pt-4 md:pt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/40 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    <span>✨ Clean, fast, and distraction-free</span>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
                        Write notes for yourself. <br className="hidden sm:inline" />
                        <span className="text-indigo-600 dark:text-indigo-400">Share them with the world.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        NoteStack is a minimal workspace for personal thoughts, documentation, and ideas. Write in Markdown, organize with tags, and publish whenever you choose.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                        to="/signup"
                        className="btn-primary text-sm px-6 py-3 font-semibold shadow-sm hover:shadow group"
                    >
                        Get started free <ArrowRightIcon />
                    </Link>
                    <Link
                        to="/feed"
                        className="btn-ghost text-sm px-6 py-3 font-semibold"
                    >
                        Browse public notes
                    </Link>
                </div>

                {/* ── Code-built Product Mockup ────────────────────────────── */}
                <div className="pt-6">
                    <div className="card p-4 md:p-6 text-left max-w-2xl mx-auto shadow-xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                        {/* Mock window top bar */}
                        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
                            <div className="flex items-center gap-1.5" aria-hidden="true">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                                <span className="text-xs text-neutral-400 ml-2 font-mono">notestack / dashboard</span>
                            </div>
                            <span className="badge bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs">
                                🌐 Public Note
                            </span>
                        </div>

                        {/* Mock note content */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-lg">
                                    🚀 Architecture Guidelines for Distributed Apps
                                </h3>
                                <span className="text-amber-500 text-xs font-medium">📌 Pinned</span>
                            </div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                                Always keep state synchronized across service boundaries using idempotency keys and structured events. Here is the recommended pattern:
                            </p>
                            <div className="rounded-lg bg-neutral-100 dark:bg-neutral-950 p-3 font-mono text-xs text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800">
                                <code>const dispatch = async (event) =&gt; await bus.publish(event.topic, event);</code>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                <span className="tag-chip text-xs">#architecture</span>
                                <span className="tag-chip text-xs">#system-design</span>
                                <span className="tag-chip text-xs">#backend</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. Features Grid ──────────────────────────────────────── */}
            <section id="features" className="space-y-10 scroll-mt-24">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        Everything you need to write and organize
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
                        Focused tools built directly into NoteStack to keep your thoughts structured and accessible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feat, idx) => (
                        <div
                            key={idx}
                            className="card p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
                        >
                            <span className="text-2xl" role="img" aria-hidden="true">
                                {feat.icon}
                            </span>
                            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                                {feat.title}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {feat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 3. How It Works ────────────────────────────────────────── */}
            <section id="how-it-works" className="space-y-10 scroll-mt-24">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        How it works
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                        From signing up to writing your first note in three straightforward steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((step, idx) => (
                        <div key={idx} className="card p-6 flex flex-col gap-3">
                            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                                STEP {step.num}
                            </span>
                            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                                {step.title}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 4. Latest Public Notes ─────────────────────────────────── */}
            <section className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Recent from the community
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Public notes recently published by NoteStack users.
                        </p>
                    </div>
                    <Link
                        to="/feed"
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 group"
                    >
                        View all public notes <ArrowRightIcon />
                    </Link>
                </div>

                {loadingNotes ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="card p-5 space-y-3">
                                <div className="skeleton h-4 w-24 rounded" />
                                <div className="skeleton h-6 w-3/4 rounded" />
                                <div className="skeleton h-12 w-full rounded" />
                            </div>
                        ))}
                    </div>
                ) : publicNotes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {publicNotes.map(note => (
                            <article
                                key={note._id}
                                className="card p-5 flex flex-col justify-between hover:shadow-md transition-shadow gap-3"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-neutral-400">
                                        <span>By {note.user?.name || 'Anonymous'}</span>
                                        <time dateTime={note.updatedAt}>
                                            {new Date(note.updatedAt).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </time>
                                    </div>
                                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-base line-clamp-1">
                                        <Link
                                            to={`/view/${note._id}`}
                                            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                        >
                                            {note.title}
                                        </Link>
                                    </h3>
                                    <div className="md-prose line-clamp-3 text-xs">
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

                                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1">
                                        {note.tags?.slice(0, 2).map((t, i) => (
                                            <span key={i} className="tag-chip text-[11px]">
                                                #{t}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        to={`/view/${note._id}`}
                                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                        Read →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="card p-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                        No public notes shared yet. Join NoteStack and publish the first one!
                    </div>
                )}
            </section>

            {/* ── 5. Final CTA & Footer ──────────────────────────────────── */}
            <section className="card p-8 md:p-12 text-center space-y-6 bg-gradient-to-b from-indigo-50/50 to-white dark:from-neutral-900/60 dark:to-neutral-900 border-indigo-100 dark:border-neutral-800">
                <div className="max-w-xl mx-auto space-y-2">
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        Start organizing your notes today
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Join NoteStack for free. Write in Markdown, organize with tags, and share when you want.
                    </p>
                </div>
                <div>
                    <Link
                        to="/signup"
                        className="btn-primary text-sm px-8 py-3 font-semibold shadow-md inline-flex items-center gap-2 group"
                    >
                        Create your account <ArrowRightIcon />
                    </Link>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-neutral-500 pt-2">
                    <span className="flex items-center gap-1.5"><CheckIcon /> 100% Free</span>
                    <span className="flex items-center gap-1.5"><CheckIcon /> Markdown Ready</span>
                    <span className="flex items-center gap-1.5"><CheckIcon /> Fast & Secure</span>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <footer className="border-t border-neutral-200 dark:border-neutral-800 pt-8 pb-12 text-xs text-neutral-500 dark:text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">NoteStack</span>
                    <span>— Minimal notes workspace</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/feed" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                        Public Feed
                    </Link>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    >
                        GitHub Repository
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
