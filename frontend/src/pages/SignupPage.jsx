// frontend/src/pages/SignupPage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!name.trim() || name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters long';
        }
        if (!email.trim() || !email.includes('@')) {
            errors.email = 'Please provide a valid email address';
        }
        const passwordRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(password)) {
            errors.password = 'At least 8 characters with at least one special symbol (!@#$%^&*)';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const clientErrors = validateForm();
        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors);
            return;
        }

        try {
            setSubmitting(true);
            setFieldErrors({});
            await signup(name, email, password);
            toast.success('Account created successfully!');
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
            const msg = resData?.msg || 'Failed to sign up. Please try again.';
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
                        Create an account
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Start organizing your notes with NoteStack.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label htmlFor="signup-name" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Full name
                        </label>
                        <input
                            id="signup-name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: null }));
                            }}
                            className={`input ${fieldErrors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Ada Lovelace"
                            aria-invalid={!!fieldErrors.name}
                            aria-describedby={fieldErrors.name ? 'signup-name-error' : undefined}
                            required
                        />
                        {fieldErrors.name && (
                            <p id="signup-name-error" className="text-xs text-red-600 dark:text-red-400 mt-1">
                                {fieldErrors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="signup-email" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Email address
                        </label>
                        <input
                            id="signup-email"
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
                            aria-describedby={fieldErrors.email ? 'signup-email-error' : undefined}
                            required
                        />
                        {fieldErrors.email && (
                            <p id="signup-email-error" className="text-xs text-red-600 dark:text-red-400 mt-1">
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="signup-password" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Password
                        </label>
                        <input
                            id="signup-password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: null }));
                            }}
                            className={`input ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="••••••••"
                            aria-invalid={!!fieldErrors.password}
                            aria-describedby={fieldErrors.password ? 'signup-password-error' : undefined}
                            required
                        />
                        {fieldErrors.password ? (
                            <p id="signup-password-error" className="text-xs text-red-600 dark:text-red-400 mt-1">
                                {fieldErrors.password}
                            </p>
                        ) : (
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                                8+ chars, with at least one special symbol (!@#$%^&*)
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full py-2.5 mt-2"
                    >
                        {submitting ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
