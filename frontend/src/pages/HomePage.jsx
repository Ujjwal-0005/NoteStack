// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import NoteItem from '../components/NoteItem';
import ConfirmModal from '../components/ConfirmModal';
import MarkdownEditor from '../components/MarkdownEditor';
import { NoteListSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${API_BASE}/notes`;

/* ─── Plus icon ──────────────────────────────────────────────────────────── */
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-neutral-400">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const HomePage = () => {
    const { token } = useContext(AuthContext);

    // Notes & Pagination State
    const [notes, setNotes] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Filter, Search, Tab State
    const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'archived' | 'trash'
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNoteId, setCurrentNoteId] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        isDanger: false,
        onConfirm: () => {},
    });

    const formRef = useRef(null);
    const titleInputRef = useRef(null);

    // Debounce search input by 300ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Build query view param from active tab
    const viewParam = useMemo(() => {
        if (activeTab === 'trash') return 'trash';
        if (activeTab === 'archived') return 'archived';
        return '';
    }, [activeTab]);

    // Fetch notes for page 1 on filter/tab/search change
    const fetchNotes = useCallback(async (targetPage = 1, append = false) => {
        if (!token) return;

        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const params = {
                page: targetPage,
                limit: 12,
            };
            if (viewParam) params.view = viewParam;
            if (debouncedSearch) params.search = debouncedSearch;
            if (selectedTag) params.tag = selectedTag;

            const res = await axios.get(API_URL, { params });
            const data = res.data;

            if (append) {
                setNotes(prev => [...prev, ...data.notes]);
            } else {
                setNotes(data.notes || []);
            }
            setPage(data.page || 1);
            setPages(data.pages || 1);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Error fetching notes:', error);
            toast.error('Failed to load notes');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [token, viewParam, debouncedSearch, selectedTag]);

    // Re-fetch whenever filters change
    useEffect(() => {
        fetchNotes(1, false);
    }, [fetchNotes]);

    // Extract all unique tags present across current notes
    const allTags = useMemo(() => {
        const set = new Set();
        notes.forEach(n => {
            if (Array.isArray(n.tags)) {
                n.tags.forEach(t => set.add(t));
            }
        });
        return Array.from(set);
    }, [notes]);

    const handleLoadMore = () => {
        if (page < pages && !loadingMore) {
            fetchNotes(page + 1, true);
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setTagsInput('');
        setIsPublic(false);
        setIsPinned(false);
        setIsEditing(false);
        setCurrentNoteId(null);
        setFormErrors({});
        setIsFormOpen(false);
    };

    const openCreateForm = () => {
        resetForm();
        setIsFormOpen(true);
        setTimeout(() => {
            titleInputRef.current?.focus();
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});

        // Client validation
        const errors = {};
        if (!title.trim()) errors.title = 'Title is required';
        if (title.length > 120) errors.title = 'Title cannot exceed 120 characters';
        if (!content.trim()) errors.content = 'Content is required';
        if (content.length > 20000) errors.content = 'Content cannot exceed 20,000 characters';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const parsedTags = tagsInput
            .split(',')
            .map(t => t.trim().toLowerCase())
            .filter(t => t.length > 0)
            .slice(0, 5);

        const noteData = {
            title: title.trim(),
            content,
            isPublic,
            isPinned,
            tags: parsedTags,
        };

        try {
            setSaving(true);
            if (isEditing) {
                await axios.put(`${API_URL}/${currentNoteId}`, noteData);
                toast.success('Note updated successfully');
            } else {
                await axios.post(API_URL, noteData);
                toast.success('Note created successfully');
            }

            resetForm();
            fetchNotes(1, false);
        } catch (error) {
            const resData = error.response?.data;
            if (resData?.errors && Array.isArray(resData.errors)) {
                const map = {};
                resData.errors.forEach(err => {
                    if (err.field) map[err.field] = err.message;
                });
                setFormErrors(map);
            }
            const msg = resData?.msg || 'Failed to save note.';
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            toast.success('Note moved to trash');
            fetchNotes(1, false);
        } catch (error) {
            console.error('Error moving note to trash:', error);
            toast.error('Failed to move note to trash');
        }
    };

    const handleRestore = async (id) => {
        try {
            await axios.put(`${API_URL}/${id}/restore`);
            toast.success('Note restored');
            fetchNotes(1, false);
        } catch (error) {
            console.error('Error restoring note:', error);
            toast.error('Failed to restore note');
        }
    };

    const handlePermanentDelete = (id) => {
        setModalConfig({
            isOpen: true,
            title: 'Delete Permanently?',
            message: 'This note will be permanently removed from your account. This action cannot be undone.',
            confirmText: 'Delete forever',
            isDanger: true,
            onConfirm: async () => {
                try {
                    await axios.delete(`${API_URL}/${id}/permanent`);
                    toast.success('Note permanently deleted');
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                    fetchNotes(1, false);
                } catch (error) {
                    console.error('Error permanently deleting note:', error);
                    toast.error('Failed to delete note');
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                }
            },
        });
    };

    const handleEdit = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setTagsInput((note.tags || []).join(', '));
        setIsPublic(note.isPublic || false);
        setIsPinned(note.isPinned || false);
        setIsEditing(true);
        setCurrentNoteId(note._id);
        setIsFormOpen(true);
        setFormErrors({});
        setTimeout(() => {
            titleInputRef.current?.focus();
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    };

    const handleUpdate = async (id, updatedFields) => {
        try {
            await axios.put(`${API_URL}/${id}`, updatedFields);
            toast.success('Note updated');
            fetchNotes(page, false);
        } catch (error) {
            console.error('Error updating note:', error);
            toast.error('Failed to update note');
        }
    };

    return (
        <div className="space-y-6">
            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                isDanger={modalConfig.isDanger}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
            />

            {/* Top Toolbar: View switcher, Search, New Note button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex rounded-xl bg-neutral-200/60 dark:bg-neutral-800/80 p-1 self-start">
                    <button
                        type="button"
                        onClick={() => { setActiveTab('notes'); setSelectedTag(''); }}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            activeTab === 'notes'
                                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                        }`}
                        aria-pressed={activeTab === 'notes'}
                    >
                        Notes
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('archived'); setSelectedTag(''); }}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            activeTab === 'archived'
                                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                        }`}
                        aria-pressed={activeTab === 'archived'}
                    >
                        Archived
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('trash'); setSelectedTag(''); }}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            activeTab === 'trash'
                                ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-400 shadow-xs'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                        }`}
                        aria-pressed={activeTab === 'trash'}
                    >
                        Trash
                    </button>
                </div>

                {/* Right side: Search + Create Button */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:w-64">
                        <label htmlFor="search-notes" className="sr-only">Search notes</label>
                        <input
                            id="search-notes"
                            type="search"
                            placeholder="Search notes..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="input pl-9 pr-8 text-xs py-1.5"
                        />
                        <span className="absolute left-3 top-2 pointer-events-none" aria-hidden="true">
                            <SearchIcon />
                        </span>
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => setSearchInput('')}
                                className="absolute right-2.5 top-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {activeTab !== 'trash' && !isFormOpen && (
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="btn-primary text-xs py-2 whitespace-nowrap"
                        >
                            <PlusIcon /> New note
                        </button>
                    )}
                </div>
            </div>

            {/* Tag Filters */}
            {(allTags.length > 0 || selectedTag) && (
                <div className="flex flex-wrap items-center gap-1.5" aria-label="Tag filters">
                    <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mr-1">
                        Filter:
                    </span>
                    {selectedTag && (
                        <button
                            type="button"
                            onClick={() => setSelectedTag('')}
                            className="badge bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 text-xs cursor-pointer"
                        >
                            Clear: #{selectedTag} ✕
                        </button>
                    )}
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                            className={`badge text-xs cursor-pointer transition-colors ${
                                selectedTag === tag
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                            }`}
                            aria-pressed={selectedTag === tag}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            )}

            {/* Collapsible / Floating New Note Form */}
            {isFormOpen && activeTab !== 'trash' && (
                <section
                    ref={formRef}
                    aria-label={isEditing ? 'Edit note form' : 'Create note form'}
                    className="card p-6 border-indigo-200 dark:border-indigo-900/60 shadow-md animate-in fade-in duration-200"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                            {isEditing ? 'Edit note' : 'Create new note'}
                        </h2>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs cursor-pointer"
                            aria-label="Close note editor"
                        >
                            ✕ Cancel
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div>
                            <label htmlFor="note-title" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Title
                            </label>
                            <input
                                ref={titleInputRef}
                                id="note-title"
                                type="text"
                                placeholder="Note title"
                                value={title}
                                maxLength={120}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (formErrors.title) setFormErrors(prev => ({ ...prev, title: null }));
                                }}
                                className={`input ${formErrors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                                aria-invalid={!!formErrors.title}
                                aria-describedby={formErrors.title ? 'note-title-error' : undefined}
                                required
                            />
                            {formErrors.title && (
                                <p id="note-title-error" className="text-xs text-red-600 dark:text-red-400 mt-1">
                                    {formErrors.title}
                                </p>
                            )}
                        </div>

                        {/* Markdown Editor with Preview Toggle */}
                        <MarkdownEditor
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                if (formErrors.content) setFormErrors(prev => ({ ...prev, content: null }));
                            }}
                            error={formErrors.content}
                        />

                        {/* Tags Input */}
                        <div>
                            <label htmlFor="note-tags" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Tags <span className="text-neutral-400 font-normal">(optional, comma separated, max 5)</span>
                            </label>
                            <input
                                id="note-tags"
                                type="text"
                                placeholder="ideas, roadmap, meeting"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                className="input text-xs"
                            />
                        </div>

                        {/* Checkboxes: Pin & Public */}
                        <div className="flex flex-wrap items-center gap-6 pt-1">
                            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-neutral-700 dark:text-neutral-300">
                                <input
                                    type="checkbox"
                                    checked={isPinned}
                                    onChange={(e) => setIsPinned(e.target.checked)}
                                    className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <span>📌 Pin to top of list</span>
                            </label>

                            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-neutral-700 dark:text-neutral-300">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <span>🌐 Make publicly visible</span>
                            </label>
                        </div>

                        {/* Form Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn-ghost text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary text-xs"
                            >
                                {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Create note'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {/* Note Count Heading */}
            <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 px-1">
                <span>
                    {total} {total === 1 ? 'note' : 'notes'} {debouncedSearch && `matching "${debouncedSearch}"`}
                </span>
            </div>

            {/* Notes Grid */}
            {loading && notes.length === 0 ? (
                <NoteListSkeleton count={6} />
            ) : notes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map(note => (
                        <NoteItem
                            key={note._id}
                            note={note}
                            activeTab={activeTab}
                            onDelete={handleDelete}
                            onRestore={handleRestore}
                            onPermanentDelete={handlePermanentDelete}
                            onEdit={handleEdit}
                            onUpdate={handleUpdate}
                            onSelectTag={(tag) => setSelectedTag(tag)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={activeTab === 'trash' ? '🗑️' : activeTab === 'archived' ? '📦' : '📝'}
                    title={
                        activeTab === 'trash'
                            ? 'Trash is empty'
                            : activeTab === 'archived'
                            ? 'No archived notes'
                            : debouncedSearch
                            ? `No notes matching "${debouncedSearch}"`
                            : 'No notes yet'
                    }
                    description={
                        activeTab === 'trash'
                            ? 'Notes you delete will appear here before permanent removal.'
                            : activeTab === 'archived'
                            ? 'Notes you archive to keep your workspace tidy will appear here.'
                            : debouncedSearch
                            ? 'Try searching with different keywords or clearing your filters.'
                            : 'Start writing ideas, tasks, or meeting summaries.'
                    }
                    action={
                        activeTab === 'notes' && !debouncedSearch ? (
                            <button
                                type="button"
                                onClick={openCreateForm}
                                className="btn-primary text-xs mt-2"
                            >
                                <PlusIcon /> Create first note
                            </button>
                        ) : null
                    }
                />
            )}

            {/* Pagination / Load More */}
            {page < pages && (
                <div className="text-center pt-6">
                    <button
                        type="button"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="btn-ghost text-xs px-6 py-2.5"
                    >
                        {loadingMore ? 'Loading...' : `Load more notes (${page} of ${pages})`}
                    </button>
                </div>
            )}

            {/* Floating Action Button (Mobile & Desktop quick access) */}
            {activeTab !== 'trash' && !isFormOpen && (
                <button
                    type="button"
                    onClick={openCreateForm}
                    className="fixed bottom-6 right-6 z-30 flex items-center justify-center w-12 h-12 rounded-full
                               bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 active:bg-indigo-700
                               transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
                    aria-label="Create new note"
                    title="Create new note"
                >
                    <PlusIcon />
                </button>
            )}
        </div>
    );
};

export default HomePage;
