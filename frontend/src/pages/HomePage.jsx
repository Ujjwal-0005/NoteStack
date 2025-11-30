// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import NoteItem from '../components/NoteItem';

const API_URL = 'http://localhost:5000/api/notes';

const HomePage = () => {
    const { token } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNoteId, setCurrentNoteId] = useState(null);

    const fetchNotes = async () => {
        try {
            const res = await axios.get(API_URL);
            setNotes(res.data);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchNotes();
        }
    }, [token]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const noteData = { title, content, isPublic };

        try {
            if (isEditing) {
                // UPDATE logic
                await axios.put(`${API_URL}/${currentNoteId}`, noteData);
            } else {
                // CREATE logic
                await axios.post(API_URL, noteData);
            }

            // Clear form and refresh list
            setTitle('');
            setContent('');
            setIsPublic(false);
            setIsEditing(false);
            setCurrentNoteId(null);
            fetchNotes();

        } catch (error) {
            console.error("Error saving note:", error);
            alert('Failed to save note.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchNotes();
            } catch (error) {
                console.error("Error deleting note:", error);
            }
        }
    };

    const handleEdit = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setIsPublic(note.isPublic);
        setIsEditing(true);
        setCurrentNoteId(note._id);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
    };

    // Used for the public toggle button in NoteItem
    const handleUpdate = async (id, updatedFields) => {
        try {
            await axios.put(`${API_URL}/${id}`, updatedFields);
            fetchNotes();
        } catch (error) {
            console.error("Error updating note status:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
                {isEditing ? 'Edit Your Note' : 'Create New Note'}
            </h2>

            {/* Note Creation/Editing Form */}
            <form onSubmit={handleSubmit} className="p-6 mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl space-y-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700"
                    required
                />
                <textarea
                    placeholder="Content"
                    rows="5"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700"
                    required
                />
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isPublic" className="text-sm font-medium">Make Public?</label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200 font-semibold"
                >
                    {isEditing ? 'Update Note' : 'Add Note'}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => { setIsEditing(false); setTitle(''); setContent(''); setIsPublic(false); setCurrentNoteId(null); }}
                        className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition duration-200 mt-2"
                    >
                        Cancel Edit
                    </button>
                )}
            </form>

            {/* Notes List */}
            <h3 className="text-2xl font-bold mb-4 border-b pb-2">Your Private Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.length > 0 ? (
                    notes.map(note => (
                        <NoteItem
                            key={note._id}
                            note={note}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            onUpdate={handleUpdate}
                        />
                    ))
                ) : (
                    <p className="col-span-3 text-center text-gray-500">No notes found. Create one above!</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;