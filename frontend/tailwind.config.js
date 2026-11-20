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
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
          muted: '#F1F5F9',
          border: '#E2E8F0',
          darker: '#CBD5E1'
        },
        paper: '#F8FAFC',
        ink: {
          DEFAULT: '#0F172A',
          secondary: '#334155',
          muted: '#64748B',
          light: '#94A3B8'
        },
        coral: {
          DEFAULT: '#FF385C',
          hover: '#E02447',
          light: '#FFF1F3',
          border: '#FECDD3'
        },
        forest: {
          DEFAULT: '#059669',
          hover: '#047857',
          light: '#ECFDF5',
          border: '#A7F3D0'
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif']
      },
      borderRadius: {
        'human': '16px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '28px'
      },
      boxShadow: {
        'paper': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'paper-lg': '0 12px 36px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'glow': '0 0 25px rgba(255, 56, 92, 0.3)',
        'glow-indigo': '0 0 25px rgba(99, 102, 241, 0.3)',
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'reel-action': '0 6px 18px rgba(0, 0, 0, 0.35)'
      }
    },
  },
  plugins: [],
}
