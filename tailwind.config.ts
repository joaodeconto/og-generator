import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './**/*.{ts,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
};

export default config;