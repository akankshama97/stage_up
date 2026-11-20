/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          muted: 'var(--surface-muted)',
        },
        border: 'var(--border)',
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        success: 'var(--success)',

        // Map Tailwind slate to tokens so every component automatically conforms to the same palette
        slate: {
          50: 'var(--bg)',
          100: 'var(--surface-muted)',
          200: 'var(--border)',
          300: 'var(--border)',
          400: 'var(--text-muted)',
          500: 'var(--text-muted)',
          600: 'var(--text-muted)',
          700: 'var(--text)',
          800: 'var(--text)',
          900: 'var(--text)',
          950: 'var(--text)'
        },

        // Single-palette legacy aliases to preserve consistency across all screens
        cream: {
          DEFAULT: 'var(--bg)',
          card: 'var(--surface)',
          muted: 'var(--surface-muted)',
          border: 'var(--border)',
          darker: 'var(--border)'
        },
        paper: 'var(--bg)',
        ink: {
          DEFAULT: 'var(--text)',
          secondary: 'var(--text-muted)',
          muted: 'var(--text-muted)',
          light: 'var(--text-muted)'
        },
        coral: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          light: 'var(--surface-muted)',
          border: 'var(--border)'
        },
        forest: {
          DEFAULT: 'var(--success)',
          hover: 'var(--success)',
          light: 'var(--surface-muted)',
          border: 'var(--border)'
        },
        brand: {
          50: 'var(--surface-muted)',
          100: 'var(--surface-muted)',
          200: 'var(--border)',
          500: 'var(--accent)',
          600: 'var(--accent)',
          700: 'var(--accent-hover)'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif']
      },
      borderRadius: {
        btn: 'var(--radius-btn)',
        input: 'var(--radius-btn)',
        card: 'var(--radius-card)',
        tag: 'var(--radius-tag)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      maxWidth: {
        content: '1120px',
      }
    },
  },
  plugins: [],
}
