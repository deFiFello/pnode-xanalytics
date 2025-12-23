/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary dark theme
        'xand-bg': '#09090b',
        'xand-card': '#18181b',
        'xand-border': '#27272a',
        
        // Text hierarchy
        'xand-text': '#fafafa',
        'xand-text-dim': '#a1a1aa',
        'xand-text-muted': '#71717a',
        
        // Accent colors (subtle)
        'xand-violet': '#8b5cf6',
        'xand-cyan': '#22d3ee',
        'xand-emerald': '#10b981',
        'xand-amber': '#f59e0b',
        'xand-pink': '#ec4899',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
