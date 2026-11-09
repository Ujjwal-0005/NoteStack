// frontend/src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});

        // Client-side quick check
        const errors = {};
        if (!email.trim()) errors.email = 'Email is required';
        if (!password) errors.password = 'Password is required';
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            setSubmitting(true);
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            const resData = error.response?.data;
            if (resData?.errors && Array.isArray(resData.errors)) {
                const map = {};
                resData.errors.forEach(err => {
                    if (err.field) map[err.field] = err.message;
                });
                setFieldErrors(map);
            }
            const msg = resData?.msg || 'Login failed. Check your email and password.';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-12">
            <div className="card p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                        Log in to NoteStack
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Welcome back! Please enter your details.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label htmlFor="login-email" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Email address
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: null }));
                            }}
                            className={`input ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="you@example.com"
                            aria-invalid={!!fieldErrors.email}
                            aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                            required
                        />
                        {fieldErrors.email && (
                            <p id="login-email-error" className="text-xs text-red-600 dark:text-red-400 mt-1">
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="login-password" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Password
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: null }));
                            }}
                            className={`input ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="••••••••"
                            aria-invalid={!!fieldErrors.password}
                            aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                            required
                        />
                        {fieldErrors.password && (
                            <p id="login-password-error" className="text-xs text-red-600 dark:text-red-400 mt-1">
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full py-2.5 mt-2"
                    >
                        {submitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
                    Don&apos;t have an account?{' '}
                    <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
