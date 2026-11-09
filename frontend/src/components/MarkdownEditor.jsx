// frontend/src/components/MarkdownEditor.jsx
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownEditor = ({
    value,
    onChange,
    placeholder = 'Write your note in markdown...',
    rows = 6,
    id = 'note-content',
    error = null,
}) => {
    const [mode, setMode] = useState('edit'); // 'edit' | 'preview'

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label htmlFor={id} className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Content (Markdown supported)
                </label>
                <div className="flex items-center rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-100 dark:bg-neutral-800/60 text-xs">
                    <button
                        type="button"
                        onClick={() => setMode('edit')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                            mode === 'edit'
                                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                        }`}
                        aria-pressed={mode === 'edit'}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('preview')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                            mode === 'preview'
                                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                        }`}
                        aria-pressed={mode === 'preview'}
                    >
                        Preview
                    </button>
                </div>
            </div>

            {mode === 'edit' ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows}
                    className={`input font-mono text-sm resize-y min-h-[140px] ${
                        error ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    required
                />
            ) : (
                <div
                    tabIndex={0}
                    role="region"
                    aria-label="Markdown preview"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-4 min-h-[140px] max-h-[400px] overflow-y-auto"
                >
                    {value ? (
                        <div className="md-prose">
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
                                {value}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <p className="text-sm italic text-neutral-400 dark:text-neutral-600">
                            Nothing to preview yet.
                        </p>
                    )}
                </div>
            )}

            {error && (
                <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

export default MarkdownEditor;
