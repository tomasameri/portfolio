'use client';

import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { CardGroup } from '@/types/bento';
import BentoCard from './BentoCard';

interface CardGroupModalProps {
  group: CardGroup | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CardGroupModal({ group, isOpen, onClose }: CardGroupModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !group) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center space-x-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
              style={{ backgroundColor: `${group.color}15` }}
            >
              {group.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {group.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {group.cards.length} {group.cards.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
            aria-label="Close modal"
          >
            <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {group.cards.map((card) => (
              <div
                key={card.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (card.url && card.url !== '#') {
                    if (card.url.startsWith('http')) {
                      window.open(card.url, '_blank', 'noopener,noreferrer');
                    } else {
                      window.location.href = card.url;
                    }
                  }
                }}
                className="cursor-pointer"
              >
                <BentoCard card={{ ...card, size: 'small' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

