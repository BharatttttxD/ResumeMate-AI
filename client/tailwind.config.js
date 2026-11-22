/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        canvas: '#FAFAFA',
        ink: '#09090B',
        secondary: '#52525B',
        muted: '#71717A',
        border: '#E4E4E7',
        action: '#18181B',
      },
    },
  },
  plugins: [],
};
