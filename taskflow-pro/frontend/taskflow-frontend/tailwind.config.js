/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f1117',
        secondary: '#1a1d27',
        card: '#1e2235',
        accent: '#6366f1',
        'accent-hover': '#4f46e5',
        'accent-light': 'rgba(99,102,241,0.15)',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
        border: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
