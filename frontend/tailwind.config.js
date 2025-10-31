/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk color palette
        cyber: {
          // Dark backgrounds
          dark: {
            100: '#1a1a2e',
            200: '#16213e',
            300: '#0a0e27',
            400: '#0f0f23',
          },
          // Neon pink
          pink: {
            DEFAULT: '#ff006e',
            light: '#ff0080',
            dark: '#d6006b',
          },
          // Neon cyan/blue
          cyan: {
            DEFAULT: '#00d9ff',
            light: '#00f0ff',
            dark: '#00b8d4',
          },
          // Neon purple
          purple: {
            DEFAULT: '#bd00ff',
            light: '#d24dff',
            dark: '#8b00ff',
          },
          // Neon yellow
          yellow: {
            DEFAULT: '#ffea00',
            light: '#fff44f',
            dark: '#ffd700',
          },
        },
      },
      // Neon glow shadows
      boxShadow: {
        'neon-pink': '0 0 10px #ff006e, 0 0 20px #ff006e, 0 0 30px #ff006e',
        'neon-cyan': '0 0 10px #00d9ff, 0 0 20px #00d9ff, 0 0 30px #00d9ff',
        'neon-purple': '0 0 10px #bd00ff, 0 0 20px #bd00ff, 0 0 30px #bd00ff',
        'neon-yellow': '0 0 10px #ffea00, 0 0 20px #ffea00, 0 0 30px #ffea00',
      },
      // Animations
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { 
            opacity: '1',
            filter: 'brightness(1)',
          },
          '50%': { 
            opacity: '0.8',
            filter: 'brightness(1.2)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          'from': {
            textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff006e, 0 0 20px #ff006e',
          },
          'to': {
            textShadow: '0 0 10px #fff, 0 0 20px #ff006e, 0 0 30px #ff006e, 0 0 40px #ff006e',
          }
        }
      },
    },
  },
  plugins: [],
}
