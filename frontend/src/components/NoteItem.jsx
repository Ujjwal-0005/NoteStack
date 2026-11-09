// frontend/src/components/NoteItem.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const PinIcon = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L8.5 9H3l4.5 4.5L6 21l6-4 6 4-1.5-7.5L21 9h-5.5L12 2z" />
    </svg>
);

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const ArchiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
);

/* ─── Markdown renderer (no raw HTML) ───────────────────────────────────── */
const MdPreview = ({ content }) => (
    <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="md-prose line-clamp-4"
        components={{
            // Disable raw HTML tags — render nothing for them
            html: () => null,
            // Open links in new tab safely
            a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
            ),
        }}
    >
        {content}
    </ReactMarkdown>
);

/* ─── Main component ─────────────────────────────────────────────────────── */
const NoteItem = ({
    note,
    activeTab,
    onDelete,
    onRestore,
    onPermanentDelete,
    onUpdate,
    onEdit,
    onSelectTag,
}) => {
    const isTrash = activeTab === 'trash';
    const { isPublic, isPinned, isArchived } = note;

    const handleTogglePublic  = () => onUpdate(note._id, { isPublic: !isPublic });
    const handleTogglePin     = () => onUpdate(note._id, { isPinned: !isPinned });
    const handleToggleArchive = () => onUpdate(note._id, { isArchived: !isArchived });

    const formattedDate = new Date(note.updatedAt).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
    });

    return (
        <article
            className={`card flex flex-col p-5 gap-3 transition-shadow hover:shadow-md
                        ${isPinned && !isTrash ? 'ring-1 ring-amber-400/60 dark:ring-amber-500/40' : ''}`}
            aria-label={`Note: ${note.title}`}
        >
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                    {isPinned && !isTrash && (
                        <span className="shrink-0 text-amber-500" aria-label="Pinned">
                            <PinIcon filled />
                        </span>
                    )}
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate leading-snug">
                        {note.title}
                    </h3>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    {isArchived && !isTrash && (
                        <span className="badge bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 gap-1">
                            <ArchiveIcon /> Archived
                        </span>
                    )}
                    {isPublic && (
                        <span className="badge bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 gap-1">
                            <GlobeIcon /> Public
                        </span>
                    )}
                </div>
            </div>

            {/* ── Content preview ──────────────────────────────────────── */}
            <div className="flex-1">
                <MdPreview content={note.content} />
            </div>

            {/* ── Tags ─────────────────────────────────────────────────── */}
            {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1" aria-label="Tags">
                    {note.tags.map((t, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onSelectTag && onSelectTag(t)}
                            className="tag-chip hover:bg-indigo-100 dark:hover:bg-indigo-800/50
                                       transition-colors cursor-pointer text-xs"
                            aria-label={`Filter by tag: ${t}`}
                        >
                            #{t}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Footer: date + actions ───────────────────────────────── */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 flex flex-col gap-2">
                <time
                    dateTime={note.updatedAt}
                    className="text-xs text-neutral-400 dark:text-neutral-500"
                >
                    {isTrash && note.deletedAt
                        ? `Deleted ${new Date(note.deletedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
                        : `Updated ${formattedDate}`}
                </time>

                {isTrash ? (
                    /* Trash actions */
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => onRestore(note._id)}
                            className="flex-1 btn-ghost text-xs py-1.5 text-emerald-700 dark:text-emerald-400
                                       border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                            aria-label={`Restore note: ${note.title}`}
                        >
                            ↺ Restore
                        </button>
                        <button
                            type="button"
                            onClick={() => onPermanentDelete(note._id)}
                            className="flex-1 btn-danger text-xs py-1.5"
                            aria-label={`Permanently delete note: ${note.title}`}
                        >
                            Delete forever
                        </button>
                    </div>
                ) : (
                    /* Normal actions */
                    <div className="flex flex-col gap-1.5">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => onEdit(note)}
                                className="flex-1 btn-primary text-xs py-1.5"
                                aria-label={`Edit note: ${note.title}`}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(note._id)}
                                className="flex-1 btn-ghost text-xs py-1.5 text-red-600 dark:text-red-400
                                           border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/30"
                                aria-label={`Move note to trash: ${note.title}`}
                            >
                                Trash
                            </button>
                        </div>
                        <div className="flex gap-1.5">
                            <button
                                type="button"
                                onClick={handleTogglePin}
                                className={`flex-1 btn-ghost text-xs py-1 ${
                                    isPinned
                                        ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                        : ''
                                }`}
                                aria-label={isPinned ? 'Unpin note' : 'Pin note to top'}
                                aria-pressed={isPinned}
                            >
                                {isPinned ? 'Unpin' : 'Pin'}
                            </button>
                            <button
                                type="button"
                                onClick={handleToggleArchive}
                                className="flex-1 btn-ghost text-xs py-1"
                                aria-label={isArchived ? 'Unarchive note' : 'Archive note'}
                                aria-pressed={isArchived}
                            >
                                {isArchived ? 'Unarchive' : 'Archive'}
                            </button>
                            <button
                                type="button"
                                onClick={handleTogglePublic}
                                className={`flex-1 btn-ghost text-xs py-1 ${
                                    isPublic
                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                        : ''
                                }`}
                                aria-label={isPublic ? 'Make note private' : 'Make note public'}
                                aria-pressed={isPublic}
                            >
                                {isPublic ? 'Private' : 'Public'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
};

export default NoteItem;
