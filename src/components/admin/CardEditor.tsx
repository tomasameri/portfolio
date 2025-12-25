'use client';

import { useState, useEffect } from 'react';
import { BentoCard, BentoCardSize, BentoCardType } from '@/types/bento';

interface CardEditorProps {
  card?: BentoCard;
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Omit<BentoCard, 'id'>) => Promise<void>;
}

const cardTypes: BentoCardType[] = ['social', 'youtube', 'custom', 'link', 'image', 'text'];
const cardSizes: BentoCardSize[] = ['small', 'medium', 'large', 'wide', 'tall'];
const socialPlatforms = ['github', 'linkedin', 'twitter', 'instagram', 'tiktok', 'youtube'];

export default function CardEditor({ card, isOpen, onClose, onSave }: CardEditorProps) {
  const [formData, setFormData] = useState<Omit<BentoCard, 'id'>>({
    type: 'social',
    size: 'small',
    title: '',
    description: '',
    url: '',
    socialPlatform: undefined,
    image: '',
    icon: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (card) {
      setFormData({
        type: card.type,
        size: card.size,
        title: card.title || '',
        description: card.description || '',
        url: card.url || '',
        socialPlatform: card.socialPlatform,
        image: card.image || '',
        icon: typeof card.icon === 'string' ? card.icon : '',
      });
    } else {
      setFormData({
        type: 'social',
        size: 'small',
        title: '',
        description: '',
        url: '',
        socialPlatform: undefined,
        image: '',
        icon: '',
      });
    }
  }, [card, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving card:', error);
      alert('Error al guardar la card');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-alice-blue dark:bg-pale-sky/10 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dust-grey/30 dark:border-pale-sky/20">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gunmetal dark:text-alice-blue">
              {card ? 'Editar Card' : 'Nueva Card'}
            </h2>
            <button
              onClick={onClose}
              className="text-gunmetal/70 dark:text-pale-sky/70 hover:text-gunmetal dark:hover:text-pale-sky"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-1">
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as BentoCardType })}
                  className="w-full px-4 py-2 rounded-md border border-dust-grey/40 dark:border-pale-sky/20 bg-white dark:bg-gunmetal text-gunmetal dark:text-pale-sky"
                >
                  {cardTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-1">
                  Tamaño
                </label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value as BentoCardSize })}
                  className="w-full px-4 py-2 rounded-md border border-dust-grey/40 dark:border-pale-sky/20 bg-white dark:bg-gunmetal text-gunmetal dark:text-pale-sky"
                >
                  {cardSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-dust-grey/40 dark:border-pale-sky/20 bg-white dark:bg-gunmetal text-gunmetal dark:text-pale-sky"
                placeholder="Título de la card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-dust-grey/40 dark:border-pale-sky/20 bg-white dark:bg-gunmetal text-gunmetal dark:text-pale-sky"
                rows={3}
                placeholder="Descripción de la card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-1">
                URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-dust-grey/40 dark:border-pale-sky/20 bg-white dark:bg-gunmetal text-gunmetal dark:text-pale-sky"
                placeholder="https://..."
              />
            </div>

            {formData.type === 'social' && (
              <div>
                <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-1">
                  Plataforma Social
                </label>
                <select
                  value={formData.socialPlatform || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialPlatform: e.target.value as BentoCard['socialPlatform'],
                    })
                  }
                  className="w-full px-4 py-2 rounded-md border border-dust-grey/40 dark:border-pale-sky/20 bg-white dark:bg-gunmetal text-gunmetal dark:text-pale-sky"
                >
                  <option value="">Seleccionar...</option>
                  {socialPlatforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gunmetal dark:text-pale-sky hover:bg-dust-grey/20 dark:hover:bg-pale-sky/10 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-cool-sky hover:bg-cool-sky/90 text-gunmetal font-medium rounded-md transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

