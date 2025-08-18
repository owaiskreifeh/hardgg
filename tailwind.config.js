/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'inter': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        gaming: {
          bg: '#0A0A0F',
          'bg-secondary': '#1A1A2E',
          'bg-tertiary': '#16213E',
          card: '#1E1E2E',
          border: '#27272A',
          primary: '#00D4FF',
          'primary-dark': '#0099CC',
          secondary: '#7C3AED',
          accent: '#06B6D4',
        },
      },
      backgroundImage: {
        'gaming-gradient': 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #16213E 100%)',
        'primary-gradient': 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
        'logo-gradient': 'linear-gradient(135deg, #00D4FF, #7C3AED)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
