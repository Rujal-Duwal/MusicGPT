/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)']
      },
      colors: {
        ink: '#0B0C10',
        midnight: '#0A0C0D',
        graphite: '#12151A',
        slate: '#1C222B',
        frost: '#EEF1F6',
        mist: '#98A2B3',
        aurora: '#62F7D7',
        ember: '#FF7A5A',
        tide: '#4C6FFF'
      },
      boxShadow: {
        glow: '0 0 45px rgba(98, 247, 215, 0.22)',
        panel: '0 24px 60px rgba(0, 0, 0, 0.45)'
      },
      animation: {
        float: 'float 12s ease-in-out infinite',
        borderSpin: 'borderSpin 10s linear infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        pulseSoft: 'pulseSoft 2.2s ease-in-out infinite',
        rise: 'rise 600ms ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        borderSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 }
        },
        rise: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0px)' }
        }
      }
    }
  },
  plugins: []
};
