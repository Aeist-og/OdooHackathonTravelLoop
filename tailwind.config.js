/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.25)',
          lighter: 'rgba(255, 255, 255, 0.15)',
          dark: 'rgba(30, 41, 59, 0.5)',
          darker: 'rgba(15, 23, 42, 0.6)',
        },
        pastel: {
          peach: '#FFB8A3',
          mint: '#A8E6CF',
          blue: '#B4D7FF',
          lavender: '#C4B5FD',
          coral: '#FF9EBA',
          cream: '#FFF9E6',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '20px',
      },
      backgroundImage: {
        'gradient-pastel-warm': 'linear-gradient(135deg, #FFB8A3 0%, #FFE5B4 50%, #FFF9E6 100%)',
        'gradient-pastel-cool': 'linear-gradient(135deg, #A8E6CF 0%, #B4D7FF 50%, #C4B5FD 100%)',
        'gradient-night': 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1a1a2e 100%)',
        'gradient-neon': 'linear-gradient(135deg, #C4B5FD 0%, #60A5FA 50%, #34D399 100%)',
      },
    },
  },
  plugins: [],
}
