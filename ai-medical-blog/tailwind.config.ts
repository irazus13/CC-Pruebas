import type { Config } from 'tailwindcss'

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
        primary: {
          DEFAULT: '#e07b39',
          hover: '#c96a2e',
        },
        navy: {
          DEFAULT: '#1e3a5f',
          light: '#2d4a6f',
        },
        background: {
          light: '#f7f7f7',
          dark: '#111827',
        },
        card: {
          light: '#ffffff',
          dark: '#1f2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'card': '16px',
        'image': '12px',
      },
    },
  },
  plugins: [],
}

export default config
