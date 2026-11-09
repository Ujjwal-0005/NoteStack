// frontend/src/components/Skeletons.jsx
import React from 'react';

export const NoteCardSkeleton = () => (
    <div className="card p-5 flex flex-col gap-3" aria-hidden="true">
        <div className="flex items-center justify-between gap-2">
            <div className="skeleton h-5 w-3/5 rounded-md" />
            <div className="skeleton h-4 w-16 rounded-full" />
        </div>
        <div className="space-y-2 py-2">
            <div className="skeleton h-3.5 w-full rounded" />
            <div className="skeleton h-3.5 w-4/5 rounded" />
            <div className="skeleton h-3.5 w-2/3 rounded" />
        </div>
        <div className="flex gap-1.5">
            <div className="skeleton h-4 w-12 rounded-full" />
            <div className="skeleton h-4 w-14 rounded-full" />
        </div>
        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 flex flex-col gap-2">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="flex gap-2">
                <div className="skeleton h-7 flex-1 rounded-lg" />
                <div className="skeleton h-7 flex-1 rounded-lg" />
            </div>
        </div>
    </div>
);

export const NoteListSkeleton = ({ count = 6 }) => (
    <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-busy="true"
        aria-label="Loading notes..."
    >
        {Array.from({ length: count }).map((_, i) => (
            <NoteCardSkeleton key={i} />
        ))}
    </div>
);

export const FeedSkeleton = ({ count = 4 }) => (
    <div className="space-y-4" aria-busy="true" aria-label="Loading feed...">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="card p-6 flex flex-col gap-3" aria-hidden="true">
                <div className="flex items-center justify-between">
                    <div className="skeleton h-4 w-28 rounded" />
                    <div className="skeleton h-3 w-20 rounded" />
                </div>
                <div className="skeleton h-6 w-3/4 rounded-md" />
                <div className="space-y-2">
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-5/6 rounded" />
                </div>
                <div className="skeleton h-4 w-24 rounded mt-1" />
            </div>
        ))}
    </div>
);
