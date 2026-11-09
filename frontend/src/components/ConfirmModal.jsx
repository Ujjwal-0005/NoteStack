// frontend/src/components/ConfirmModal.jsx
import React, { useEffect, useRef } from 'react';

const ConfirmModal = ({
    isOpen,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = false,
    onConfirm,
    onCancel,
}) => {
    const modalRef = useRef(null);
    const confirmButtonRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        // Focus the confirm or cancel button when modal opens
        confirmButtonRef.current?.focus();

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onCancel();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            onClick={onCancel}
        >
            <div
                ref={modalRef}
                className="w-full max-w-md card p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h3
                    id="modal-title"
                    className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2"
                >
                    {title}
                </h3>
                <p
                    id="modal-description"
                    className="text-sm text-neutral-600 dark:text-neutral-400 mb-6"
                >
                    {message}
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-ghost text-sm px-4 py-2"
                    >
                        {cancelText}
                    </button>
                    <button
                        ref={confirmButtonRef}
                        type="button"
                        onClick={onConfirm}
                        className={`text-sm px-4 py-2 ${
                            isDanger ? 'btn-danger' : 'btn-primary'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
