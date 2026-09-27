/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        void: '#000000',
        panel: '#0a0a0a',
        neon: '#00ff41',
        'neon-dim': '#00cc33',
        'neon-glow': '#00ff41',
      },
      animation: {
        kenburns: 'kenburns 12s ease-out forwards',
        fadeUp: 'fadeUp .7s ease both',
        progress: 'progress 2s ease-out forwards',
        'progress-infinite': 'progress-infinite 1.5s ease-in-out infinite',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'progress-infinite': {
          '0%': { width: '0%', left: '0%' },
          '50%': { width: '60%', left: '0%' },
          '100%': { width: '0%', left: '100%' },
        },
      },
    },
  },
  plugins: [],
}
