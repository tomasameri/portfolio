import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#a7cecb',
        'cool-steel': '#8ba6a9',
        'dusty-olive': '#75704e',
        'dry-sage': '#cacc90',
        'lemon-chiffon': '#f4ebbe',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-merriweather)'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
};

export default config;
