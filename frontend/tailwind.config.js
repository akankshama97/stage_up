/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF7F2',
          card: '#FFFFFF',
          muted: '#F3EFE8',
          border: '#E8E2D8',
          darker: '#DDD6C8'
        },
        paper: '#FAF7F2',
        ink: {
          DEFAULT: '#1A1A1A',
          secondary: '#4A4A4A',
          muted: '#717171',
          light: '#9E9E9E'
        },
        coral: {
          DEFAULT: '#FF4D2E',
          hover: '#E53E20',
          light: '#FFF0ED',
          border: '#FFD3CB'
        },
        forest: {
          DEFAULT: '#1E7A4C',
          light: '#EBF6F0',
          border: '#BFE3D0'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif']
      },
      borderRadius: {
        'human': '12px',
        'xl': '12px'
      },
      boxShadow: {
        'paper': '0 2px 8px -2px rgba(26, 26, 26, 0.06), 0 1px 3px -1px rgba(26, 26, 26, 0.04)',
        'paper-lg': '0 6px 18px -4px rgba(26, 26, 26, 0.08), 0 2px 6px -1px rgba(26, 26, 26, 0.05)',
        'reel-action': '0 4px 12px rgba(0, 0, 0, 0.25)'
      }
    },
  },
  plugins: [],
}
