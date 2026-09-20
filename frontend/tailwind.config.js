/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest:      '#1F5C3A',
        interactive: '#2D7A4E',
        deep:        '#17452C',
        lime:        '#D9F04A',
        warning:     '#F97316',
        ink:         '#0F172A',
        muted:       '#64748B',
        canvas:      '#F8F7F2',
        card:        '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        hind: ['"Hind"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-in-out',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16,1,0.3,1)',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(217,240,74,0.18)' },
          '50%':      { boxShadow: '0 0 36px 12px rgba(217,240,74,0.32)' },
        },
      },
      boxShadow: {
        'lime-glow':  '0 0 28px 8px rgba(217,240,74,0.22)',
        'card':       '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 8px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
