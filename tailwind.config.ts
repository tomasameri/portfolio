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
        'alice-blue': '#e8eef2',
        'dust-grey': '#d6c9c9',
        'pale-sky': '#c7d3dd',    // Light/Claro
        'cool-sky': '#77b6ea',
        'gunmetal': '#37393a',     // Dark/Oscuro
      },
      fontFamily: {
        sans: ['var(--font-anonymous-pro)', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
