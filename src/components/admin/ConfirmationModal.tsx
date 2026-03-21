'use client';

import { useEffect, useState } from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isDangerous = false,
}: ConfirmationModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gunmetal/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`
        relative bg-white dark:bg-gunmetal w-full max-w-md rounded-2xl shadow-2xl 
        border border-dust-grey/20 dark:border-pale-sky/10
        transform transition-all duration-300
        ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
      `}>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gunmetal dark:text-alice-blue mb-2">
                        {title}
                    </h3>
                    <p className="text-gunmetal/70 dark:text-pale-sky/80 leading-relaxed mb-6">
                        {message}
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-gunmetal dark:text-pale-sky hover:bg-dust-grey/10 dark:hover:bg-pale-sky/10 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onConfirm();
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium text-white shadow-lg transition-all transform active:scale-95 ${isDangerous
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                    : 'bg-cool-sky hover:bg-cool-sky/90 shadow-cool-sky/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
