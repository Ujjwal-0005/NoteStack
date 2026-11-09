// frontend/src/components/Navbar.jsx
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

/* ─── Icons (inline SVG, no extra dep) ──────────────────────────────────── */
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const Navbar = () => {
    const { token, user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const menuRef = useRef(null);

    // Close mobile menu on route change
    useEffect(() => { setMobileOpen(false); }, [location]);

    // Close on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') setMobileOpen(false);
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    const displayName = user ? (user.name || user.email?.split('@')[0]) : '';
    const isLanding = !token && location.pathname === '/';

    const navLinkClass = (path) =>
        `text-sm font-medium transition-colors ${
            location.pathname === path
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
        }`;

    const ThemeBtn = () => (
        <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="rounded-lg p-2 text-neutral-500 dark:text-neutral-400
                       hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
        >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
    );

    return (
        <header className="sticky top-0 z-40 border-b border-neutral-200 dark:border-neutral-800
                           bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
            <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-6xl" ref={menuRef}>
                {/* Logo */}
                <div className="flex items-center gap-6">
                    <Link
                        to={token ? "/dashboard" : "/"}
                        className="text-lg font-bold tracking-tight text-indigo-600 dark:text-indigo-400 select-none"
                    >
                        NoteStack
                    </Link>

                    {/* Smooth scroll links on landing page */}
                    {isLanding && (
                        <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400" aria-label="Section links">
                            <a
                                href="#features"
                                className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                            >
                                How It Works
                            </a>
                        </nav>
                    )}
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
                    <Link to="/feed" className={navLinkClass('/feed')}>Feed</Link>
                    {token ? (
                        <>
                            <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                                My Notes
                            </Link>
                            <Link to="/profile" className={navLinkClass('/profile')}>
                                {displayName}
                            </Link>
                            <ThemeBtn />
                            <button
                                onClick={logout}
                                className="btn-ghost text-xs px-3 py-1.5"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={navLinkClass('/login')}>Log in</Link>
                            <Link to="/signup" className="btn-primary text-xs px-3 py-1.5">Sign up</Link>
                            <ThemeBtn />
                        </>
                    )}
                </nav>

                {/* Mobile: theme + hamburger */}
                <div className="flex md:hidden items-center gap-1">
                    <ThemeBtn />
                    <button
                        onClick={() => setMobileOpen(v => !v)}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-menu"
                        className="rounded-lg p-2 text-neutral-500 dark:text-neutral-400
                                   hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                        {mobileOpen ? <XIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <nav
                    id="mobile-menu"
                    aria-label="Mobile navigation"
                    className="md:hidden border-t border-neutral-200 dark:border-neutral-800
                               bg-white dark:bg-neutral-950 px-4 py-4 flex flex-col gap-3"
                >
                    {isLanding && (
                        <>
                            <a
                                href="#features"
                                onClick={() => setMobileOpen(false)}
                                className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                onClick={() => setMobileOpen(false)}
                                className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                            >
                                How It Works
                            </a>
                        </>
                    )}
                    <Link to="/feed" className={navLinkClass('/feed')}>Feed</Link>
                    {token ? (
                        <>
                            <Link to="/dashboard" className={navLinkClass('/dashboard')}>My Notes</Link>
                            <Link to="/profile" className={navLinkClass('/profile')}>
                                Profile · {displayName}
                            </Link>
                            <button
                                onClick={logout}
                                className="btn-ghost text-sm w-full justify-start"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={navLinkClass('/login')}>Log in</Link>
                            <Link to="/signup" className="btn-primary w-full">Sign up</Link>
                        </>
                    )}
                </nav>
            )}
        </header>
    );
};

export default Navbar;
