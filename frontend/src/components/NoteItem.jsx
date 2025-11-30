// frontend/src/components/NoteItem.jsx
import React from 'react';

const NoteItem = ({ note, onDelete, onUpdate, onEdit }) => {
    // Determine the visibility status and button style
    const isPublic = note.isPublic;
    const visibilityText = isPublic ? 'Public' : 'Private';
    const visibilityColor = isPublic ? 'bg-green-500' : 'bg-yellow-500';

    const handleTogglePublic = () => {
        // Calls the update function with the toggled state
        onUpdate(note._id, { isPublic: !isPublic });
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition duration-300">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{note.title}</h3>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full text-white ${visibilityColor}`}>
                    {visibilityText}
                </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{note.content}</p>

            <small className="block text-gray-500 dark:text-gray-400 mb-4">
                Last updated: {new Date(note.updatedAt).toLocaleDateString()}
            </small>

            <div className="flex space-x-2">
                <button
                    onClick={() => onEdit(note)}
                    className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(note._id)}
                    className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
                >
                    Delete
                </button>
                <button
                    onClick={handleTogglePublic}
                    className={`flex-1 ${isPublic ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white py-1 rounded transition`}
                >
                    {isPublic ? 'Make Private' : 'Make Public'}
                </button>
            </div>
        </div>
    );
};

export default NoteItem;