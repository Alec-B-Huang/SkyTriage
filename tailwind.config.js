/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#040914',
        slateNight: '#071120',
        panel: '#091627',
        line: '#1f3b5a',
        accent: '#46a0ff',
        glow: '#76b8ff',
        emergency: '#ff6d4d',
      },
      boxShadow: {
        panel: '0 18px 55px rgba(3, 10, 24, 0.45)',
      },
      backgroundImage: {
        'radial-grid':
          'radial-gradient(circle at top, rgba(70, 160, 255, 0.22), transparent 28%), linear-gradient(135deg, rgba(13, 28, 47, 0.88), rgba(4, 10, 20, 0.95))',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
