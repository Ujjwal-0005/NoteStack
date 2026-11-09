// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import NoteItem from '../components/NoteItem';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${API_BASE}/notes`;

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
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNoteId, setCurrentNoteId] = useState(null);

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
        return ''; // default: active notes
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
                limit: 12
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
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [token, viewParam, debouncedSearch, selectedTag]);

    // Re-fetch whenever filters change
    useEffect(() => {
        fetchNotes(1, false);
    }, [fetchNotes]);

    // Extract all unique tags present across current notes for tag filter chips
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Parse comma/space-separated tags
        const parsedTags = tagsInput
            .split(',')
            .map(t => t.trim().toLowerCase())
            .filter(t => t.length > 0)
            .slice(0, 5); // at most 5

        const noteData = {
            title,
            content,
            isPublic,
            isPinned,
            tags: parsedTags
        };

        try {
            if (isEditing) {
                await axios.put(`${API_URL}/${currentNoteId}`, noteData);
            } else {
                await axios.post(API_URL, noteData);
            }

            resetForm();
            fetchNotes(1, false);
        } catch (error) {
            console.error('Error saving note:', error);
            const msg = error.response?.data?.msg || 'Failed to save note.';
            alert(msg);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchNotes(1, false);
        } catch (error) {
            console.error('Error moving note to trash:', error);
        }
    };

    const handleRestore = async (id) => {
        try {
            await axios.put(`${API_URL}/${id}/restore`);
            fetchNotes(1, false);
        } catch (error) {
            console.error('Error restoring note:', error);
        }
    };

    const handlePermanentDelete = async (id) => {
        if (window.confirm('Delete this note permanently? This cannot be undone.')) {
            try {
                await axios.delete(`${API_URL}/${id}/permanent`);
                fetchNotes(1, false);
            } catch (error) {
                console.error('Error permanently deleting note:', error);
            }
        }
    };

    const handleEdit = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setTagsInput((note.tags || []).join(', '));
        setIsPublic(note.isPublic || false);
        setIsPinned(note.isPinned || false);
        setIsEditing(true);
        setCurrentNoteId(note._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpdate = async (id, updatedFields) => {
        try {
            await axios.put(`${API_URL}/${id}`, updatedFields);
            fetchNotes(page, false);
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Note Creation / Editing Form (hidden on trash view) */}
            {activeTab !== 'trash' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                        {isEditing ? 'Edit Your Note' : 'Create New Note'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Title (max 120 chars)"
                            value={title}
                            maxLength={120}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <textarea
                            placeholder="Write your note here..."
                            rows="4"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />

                        {/* Tags Input */}
                        <div>
                            <input
                                type="text"
                                placeholder="Tags (comma separated, max 5 tags, e.g. work, ideas, meeting)"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <p className="text-xs text-gray-400 mt-1">Lowercase, max 20 chars per tag.</p>
                        </div>

                        {/* Options checkboxes */}
                        <div className="flex flex-wrap items-center gap-6 pt-1">
                            <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPinned}
                                    onChange={(e) => setIsPinned(e.target.checked)}
                                    className="h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-400"
                                />
                                <span>📌 Pin to top?</span>
                            </label>

                            <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span>🌎 Make Public?</span>
                            </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 font-semibold cursor-pointer"
                            >
                                {isEditing ? 'Update Note' : 'Add Note'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition duration-200 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* Dashboard Controls: Tabs, Search, Tag Chips */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 space-y-4">
                {/* Tabs & Search Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* View Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => { setActiveTab('notes'); setSelectedTag(''); }}
                            className={`px-4 py-2 text-sm font-semibold border-b-2 transition cursor-pointer ${
                                activeTab === 'notes'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                        >
                            📝 Notes
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('archived'); setSelectedTag(''); }}
                            className={`px-4 py-2 text-sm font-semibold border-b-2 transition cursor-pointer ${
                                activeTab === 'archived'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                        >
                            📦 Archived
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('trash'); setSelectedTag(''); }}
                            className={`px-4 py-2 text-sm font-semibold border-b-2 transition cursor-pointer ${
                                activeTab === 'trash'
                                    ? 'border-red-500 text-red-600 dark:text-red-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                        >
                            🗑️ Trash
                        </button>
                    </div>

                    {/* Debounced Search Bar */}
                    <div className="relative md:w-80">
                        <input
                            type="text"
                            placeholder="Search title & content..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full px-3 py-2 pl-9 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => setSearchInput('')}
                                className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Tag Filter Chips */}
                {(allTags.length > 0 || selectedTag) && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-xs font-semibold text-gray-500 uppercase mr-1">Filter by tag:</span>
                        {selectedTag && (
                            <button
                                type="button"
                                onClick={() => setSelectedTag('')}
                                className="text-xs px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 font-medium cursor-pointer"
                            >
                                Clear filter (x)
                            </button>
                        )}
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                                className={`text-xs px-2.5 py-1 rounded-full transition font-medium cursor-pointer ${
                                    selectedTag === tag
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Notes Grid Header & Summary */}
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xl font-bold capitalize">
                    {activeTab === 'trash' ? 'Trash Bin' : activeTab === 'archived' ? 'Archived Notes' : 'Your Notes'}
                    <span className="text-sm font-normal text-gray-500 ml-2">({total} total)</span>
                </h3>
            </div>

            {/* Notes Grid */}
            {loading && notes.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-lg">Loading notes...</div>
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
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-gray-500">
                    {activeTab === 'trash'
                        ? 'Trash is empty.'
                        : activeTab === 'archived'
                        ? 'No archived notes.'
                        : 'No notes found. Create your first note above!'}
                </div>
            )}

            {/* Pagination / Load More Button */}
            {page < pages && (
                <div className="text-center pt-4">
                    <button
                        type="button"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer shadow-md"
                    >
                        {loadingMore ? 'Loading more...' : `Load More (Page ${page + 1} of ${pages})`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePage;
