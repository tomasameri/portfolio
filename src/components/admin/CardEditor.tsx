'use client';

import { useState, useEffect } from 'react';
import { BentoCard, BentoCardSize, BentoCardType } from '@/types/bento';
import { XMarkIcon, TagIcon, ArrowsPointingOutIcon, HashtagIcon, DocumentTextIcon, LinkIcon, ShareIcon } from '@heroicons/react/24/outline';

interface CardEditorProps {
  card?: BentoCard;
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Omit<BentoCard, 'id'>) => Promise<void>;
}

const cardTypes: BentoCardType[] = ['social', 'youtube', 'custom', 'link', 'image', 'text'];
const cardSizes: BentoCardSize[] = ['small', 'medium', 'large', 'wide', 'tall'];
const socialPlatforms = ['github', 'linkedin', 'twitter', 'instagram', 'tiktok', 'youtube'];

// Traducciones para tipos y tamaños
const typeLabels: Record<BentoCardType, string> = {
  social: 'Red Social',
  youtube: 'YouTube',
  custom: 'Personalizada',
  link: 'Enlace',
  image: 'Imagen',
  text: 'Texto',
};

const sizeLabels: Record<BentoCardSize, string> = {
  small: 'Pequeña',
  medium: 'Mediana',
  large: 'Grande',
  wide: 'Ancha',
  tall: 'Alta',
};

const platformLabels: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

export default function CardEditor({ card, isOpen, onClose, onSave }: CardEditorProps) {
  const [formData, setFormData] = useState<Omit<BentoCard, 'id'>>({
    type: 'social',
    size: 'small',
    title: '',
    description: '',
    url: '',
    socialPlatform: undefined,
    socialUsername: '',
    image: '',
    imageAsBackground: false,
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
        socialUsername: card.socialUsername || '',
        image: card.image || '',
        imageAsBackground: card.imageAsBackground || false,
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
        socialUsername: '',
        image: '',
        imageAsBackground: false,
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gunmetal/60 dark:bg-black/70" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-alice-blue/95 dark:bg-gunmetal/95 backdrop-blur-xl shadow-2xl border border-dust-grey/20 dark:border-pale-sky/10"
        style={{ animation: 'zoomIn 0.2s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-dust-grey/20 dark:border-pale-sky/10">
          <h2 className="text-3xl font-bold text-gunmetal dark:text-alice-blue tracking-tight">
            {card ? 'Editar Card' : 'Nueva Card'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gunmetal/60 dark:text-pale-sky/60 hover:text-gunmetal dark:hover:text-pale-sky hover:bg-dust-grey/10 dark:hover:bg-pale-sky/10 transition-all duration-200"
            aria-label="Cerrar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo y Tamaño */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gunmetal dark:text-pale-sky">
                  <TagIcon className="w-4 h-4" />
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as BentoCardType })}
                  className="w-full px-4 py-3 rounded-2xl border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky focus:outline-none focus:ring-2 focus:ring-cool-sky/50 focus:border-cool-sky/50 transition-all duration-200 appearance-none cursor-pointer hover:border-cool-sky/30 dark:hover:border-cool-sky/30"
                >
                  {cardTypes.map((type) => (
                    <option key={type} value={type}>
                      {typeLabels[type]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gunmetal dark:text-pale-sky">
                  <ArrowsPointingOutIcon className="w-4 h-4" />
                  Tamaño
                </label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value as BentoCardSize })}
                  className="w-full px-4 py-3 rounded-2xl border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky focus:outline-none focus:ring-2 focus:ring-cool-sky/50 focus:border-cool-sky/50 transition-all duration-200 appearance-none cursor-pointer hover:border-cool-sky/30 dark:hover:border-cool-sky/30"
                >
                  {cardSizes.map((size) => (
                    <option key={size} value={size}>
                      {sizeLabels[size]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gunmetal dark:text-pale-sky">
                <HashtagIcon className="w-4 h-4" />
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky placeholder:text-gunmetal/40 dark:placeholder:text-pale-sky/40 focus:outline-none focus:ring-2 focus:ring-cool-sky/50 focus:border-cool-sky/50 transition-all duration-200"
                placeholder="Ej: Mi GitHub"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gunmetal dark:text-pale-sky">
                <DocumentTextIcon className="w-4 h-4" />
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky placeholder:text-gunmetal/40 dark:placeholder:text-pale-sky/40 focus:outline-none focus:ring-2 focus:ring-cool-sky/50 focus:border-cool-sky/50 transition-all duration-200 resize-none"
                rows={4}
                placeholder="Una breve descripción de la card..."
              />
            </div>

            {/* URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gunmetal dark:text-pale-sky">
                <LinkIcon className="w-4 h-4" />
                URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky placeholder:text-gunmetal/40 dark:placeholder:text-pale-sky/40 focus:outline-none focus:ring-2 focus:ring-cool-sky/50 focus:border-cool-sky/50 transition-all duration-200"
                placeholder="https://ejemplo.com"
              />
            </div>

            {/* Plataforma Social (solo si tipo es social) */}
            {formData.type === 'social' && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gunmetal dark:text-pale-sky">
                  <ShareIcon className="w-4 h-4" />
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
                  className="w-full px-4 py-3 rounded-2xl border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky focus:outline-none focus:ring-2 focus:ring-cool-sky/50 focus:border-cool-sky/50 transition-all duration-200 appearance-none cursor-pointer hover:border-cool-sky/30 dark:hover:border-cool-sky/30"
                >
                  <option value="">Seleccionar plataforma...</option>
                  {socialPlatforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platformLabels[platform]}
                    </option>
                  ))}
                </select>
                
                {/* Username de la red social */}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.socialUsername || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialUsername: e.target.value,
                      })
                    }
                    placeholder="ej: tomiameri"
                    className="w-full px-4 py-3 rounded-2xl border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky focus:outline-none focus:ring-2 focus:ring-cool-sky/50 focus:border-cool-sky/50 transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Imagen (solo si tipo es image o custom) */}
            {(formData.type === 'image' || formData.type === 'custom') && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gunmetal dark:text-pale-sky">
                  <ArrowsPointingOutIcon className="w-4 h-4" />
                  URL de Imagen
                </label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky placeholder:text-gunmetal/40 dark:placeholder:text-pale-sky/40 focus:outline-none focus:ring-2 focus:ring-cool-sky/50 focus:border-cool-sky/50 transition-all duration-200"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {formData.image && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="imageAsBackground"
                      checked={formData.imageAsBackground || false}
                      onChange={(e) => setFormData({ ...formData, imageAsBackground: e.target.checked })}
                      className="w-4 h-4 rounded border-dust-grey/30 dark:border-pale-sky/20 text-cool-sky focus:ring-cool-sky/50"
                    />
                    <label htmlFor="imageAsBackground" className="text-sm text-gunmetal dark:text-pale-sky cursor-pointer">
                      Usar imagen como fondo (ocupa todo el card)
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-6 border-t border-dust-grey/20 dark:border-pale-sky/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-2xl text-sm font-medium text-gunmetal/70 dark:text-pale-sky/70 hover:text-gunmetal dark:hover:text-pale-sky hover:bg-dust-grey/10 dark:hover:bg-pale-sky/10 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-2xl text-sm font-semibold bg-cool-sky hover:bg-cool-sky/90 text-gunmetal shadow-lg shadow-cool-sky/20 hover:shadow-cool-sky/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cool-sky"
              >
                {saving ? 'Guardando...' : 'Guardar Card'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

