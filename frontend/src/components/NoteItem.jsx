// frontend/src/components/NoteItem.jsx
import React from 'react';

const NoteItem = ({
    note,
    activeTab,
    onDelete,
    onRestore,
    onPermanentDelete,
    onUpdate,
    onEdit,
    onSelectTag
}) => {
    const isTrash = activeTab === 'trash';
    const isPublic = note.isPublic;
    const isPinned = note.isPinned;
    const isArchived = note.isArchived;

    const handleTogglePublic = () => {
        onUpdate(note._id, { isPublic: !isPublic });
    };

    const handleTogglePin = () => {
        onUpdate(note._id, { isPinned: !isPinned });
    };

    const handleToggleArchive = () => {
        onUpdate(note._id, { isArchived: !isArchived });
    };

    return (
        <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-t-4 ${
            isPinned ? 'border-amber-500 ring-2 ring-amber-400/40' : isArchived ? 'border-gray-500' : 'border-blue-500'
        } hover:shadow-xl transition duration-300 flex flex-col justify-between`}>
            <div>
                {/* Header row: Pin & Title & Badges */}
                <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {isPinned && !isTrash && (
                            <span title="Pinned Note" className="text-amber-500 text-sm">📌</span>
                        )}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                            {note.title}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        {isArchived && !isTrash && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-500 text-white">
                                Archived
                            </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full text-white ${
                            isPublic ? 'bg-green-500' : 'bg-yellow-500'
                        }`}>
                            {isPublic ? 'Public' : 'Private'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3 whitespace-pre-wrap">
                    {note.content}
                </p>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.map((t, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => onSelectTag && onSelectTag(t)}
                                className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded hover:underline cursor-pointer"
                            >
                                #{t}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <small className="block text-gray-500 dark:text-gray-400 mb-3 text-xs">
                    Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                    {note.deletedAt && ` · Deleted: ${new Date(note.deletedAt).toLocaleDateString()}`}
                </small>

                {/* Actions */}
                {isTrash ? (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => onRestore(note._id)}
                            className="flex-1 bg-emerald-600 text-white py-1.5 text-sm rounded hover:bg-emerald-700 transition font-medium"
                        >
                            ↺ Restore
                        </button>
                        <button
                            type="button"
                            onClick={() => onPermanentDelete(note._id)}
                            className="flex-1 bg-red-600 text-white py-1.5 text-sm rounded hover:bg-red-700 transition font-medium"
                        >
                            Delete Forever
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => onEdit(note)}
                                className="flex-1 bg-blue-500 text-white py-1 text-sm rounded hover:bg-blue-600 transition"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(note._id)}
                                className="flex-1 bg-red-500 text-white py-1 text-sm rounded hover:bg-red-600 transition"
                            >
                                Trash
                            </button>
                        </div>
                        <div className="flex gap-1.5">
                            <button
                                type="button"
                                onClick={handleTogglePin}
                                title={isPinned ? 'Unpin note' : 'Pin to top'}
                                className={`flex-1 py-1 text-xs rounded transition font-medium ${
                                    isPinned
                                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                {isPinned ? 'Unpin' : 'Pin'}
                            </button>
                            <button
                                type="button"
                                onClick={handleToggleArchive}
                                title={isArchived ? 'Unarchive note' : 'Archive note'}
                                className="flex-1 py-1 text-xs rounded transition font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                {isArchived ? 'Unarchive' : 'Archive'}
                            </button>
                            <button
                                type="button"
                                onClick={handleTogglePublic}
                                className={`flex-1 ${
                                    isPublic ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                                } text-white py-1 text-xs rounded transition font-medium`}
                            >
                                {isPublic ? 'Private' : 'Public'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteItem;
