import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aqi: {
          good: '#10B981',         // 0-50 (Emerald)
          moderate: '#F59E0B',     // 51-100 (Amber)
          sensitive: '#F97316',    // 101-150 (Orange)
          unhealthy: '#EF4444',    // 151-200 (Red)
          veryUnhealthy: '#8B5CF6',// 201-300 (Purple)
          hazardous: '#881337',    // 301+ (Deep Maroon/Rose)
        },
      },
      fontFamily: {
        sans: [
          'var(--font-noto-sans-devanagari)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
