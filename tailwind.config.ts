/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    screens: {
      xs: '450px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        xs: '450px',
        '2xl': '1400px',
      },
    },
    extend: {
      maxWidth: {
        '8xl': '90rem',
        '9xl': '110rem',
        '10xl': '150rem',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      colors: {
        border: 'oklch(var(--border) / var(--tw-border-opacity, 1))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring))',
        background: 'oklch(var(--background) / var(--tw-bg-opacity, 1))',
        foreground: 'oklch(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(var(--primary) / var(--tw-bg-opacity, 1))',
          foreground: 'oklch(var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / var(--tw-bg-opacity, 1))',
          foreground: 'oklch(var(--secondary-foreground))',
        },
        success: {
          DEFAULT: 'oklch(var(--success) / var(--tw-bg-opacity, 1))',
          foreground: 'oklch(var(--success-foreground))',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / var(--tw-bg-opacity, 1))',
          foreground: 'oklch(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / var(--tw-bg-opacity, 1))',
          foreground: 'oklch(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / var(--tw-bg-opacity, 1))',
          foreground: 'oklch(var(--accent-foreground))',
          hover: 'oklch(var(--accent-hover))',
          50: 'oklch(var(--accent-50) / var(--tw-bg-opacity, 1))',
          100: 'oklch(var(--accent-100) / var(--tw-bg-opacity, 1))',
          200: 'oklch(var(--accent-200) / var(--tw-bg-opacity, 1))',
          300: 'oklch(var(--accent-300) / var(--tw-bg-opacity, 1))',
          400: 'oklch(var(--accent-400) / var(--tw-bg-opacity, 1))',
          500: 'oklch(var(--accent-500) / var(--tw-bg-opacity, 1))',
          600: 'oklch(var(--accent-600) / var(--tw-bg-opacity, 1))',
          700: 'oklch(var(--accent-700) / var(--tw-bg-opacity, 1))',
          800: 'oklch(var(--accent-800) / var(--tw-bg-opacity, 1))',
          900: 'oklch(var(--accent-900) / var(--tw-bg-opacity, 1))',
          950: 'oklch(var(--accent-950) / var(--tw-bg-opacity, 1))',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover) / var(--tw-bg-opacity, 1))',
          foreground: 'oklch(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'oklch(var(--card) / var(--tw-bg-opacity, 1))',
          foreground: 'oklch(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        dropzone: 'inset 0 0 5px 3px rgba(0, 0, 0, 0.2)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'grow-and-shrink': {
          '0%, 100%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(180deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'grow-and-shrink': 'grow-and-shrink 2100ms ease-in-out forwards',
        spin: 'spin 2000ms linear forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
