// frontend/src/components/EmptyState.jsx
import React from 'react';

const EmptyState = ({
    icon = '📝',
    title = 'No notes found',
    description = 'Get started by creating your first note.',
    action = null,
}) => (
    <div className="card p-12 text-center flex flex-col items-center justify-center gap-3">
        <span className="text-3xl" role="img" aria-hidden="true">
            {icon}
        </span>
        <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
        </h4>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
            {description}
        </p>
        {action && <div className="mt-2">{action}</div>}
    </div>
);

export default EmptyState;
