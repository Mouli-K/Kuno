/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#FAF7F2',
          surface: '#F8F5F0',
          border: '#E0D5C5',
          text: '#1C1C1C',
          muted: '#8B7355',
          accent: '#6B8F71', // Sage Green as primary accent
          'accent-soft': '#E8F0E9',
          green: '#6B8F71',
          rose: '#C17979',
          blue: '#6B85A0',
          amber: '#C17F4A',
        },
        dark: {
          bg: '#1C1A17',
          surface: '#252219',
          border: '#3A3527',
          text: '#F0EAE0',
          muted: '#9A8E78',
        },
        primary: {
          DEFAULT: '#6B8F71', // Sage Green
          container: '#E8F0E9',
        },
        secondary: {
          DEFAULT: '#C17979', // Dusty Rose
          container: '#F5E6E6',
        },
        tertiary: {
          DEFAULT: '#6B85A0', // Blue
          container: '#E6EBF0',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
