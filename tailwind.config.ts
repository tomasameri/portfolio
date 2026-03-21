import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ─── Legacy (admin panel backward compatibility) ───
        'alice-blue': '#e8eef2',
        'dust-grey': '#d6c9c9',
        'pale-sky': '#c7d3dd',
        'cool-sky': '#77b6ea',
        'gunmetal': '#37393a',

        // ─── New tonal surface system ───
        'surface': {
          DEFAULT: 'var(--color-surface)',
          'container-low': 'var(--color-surface-container-low)',
          'container': 'var(--color-surface-container)',
          'container-high': 'var(--color-surface-container-high)',
          'container-highest': 'var(--color-surface-container-highest)',
        },
        'on-surface': {
          DEFAULT: 'var(--color-on-surface)',
          'variant': 'var(--color-on-surface-variant)',
          'muted': 'var(--color-on-surface-muted)',
        },
        'accent': {
          DEFAULT: 'var(--color-accent)',
          'container': 'var(--color-accent-container)',
          'muted': 'var(--color-accent-muted)',
        },
      },
      fontFamily: {
        display: ['var(--font-plus-jakarta-sans)', 'system-ui', 'sans-serif'],
        body: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        label: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        // Legacy
        sans: ['var(--font-anonymous-pro)', 'monospace'],
      },
      borderRadius: {
        'card': '1.25rem',
        'button': '0.75rem',
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-md': ['2.5rem', { lineHeight: '1.15', fontWeight: '700' }],
        'headline-lg': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-md': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-sm': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label-lg': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-md': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.3', fontWeight: '500' }],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
