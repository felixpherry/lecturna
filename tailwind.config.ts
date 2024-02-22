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
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        'primary-blue': '#103ee0',
        'primary-yellow': '#EDB230',
        'nav-border': '#EBEAEA',
        'light-white': '#FAFAFB',
        'light-white-100': '#F1F4F5',
        'light-white-200': '#d7d7d7',
        'light-white-300': '#F3F3F4',
        'light-white-400': '#E2E5F1',
        'light-white-500': '#E4E4E4',
        gray: '#4D4A4A',
        'gray-100': '#3d3d4e',
        'black-100': '#252525',
        'gray-50': '#D9D9D9',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontSize: {
        'heading1-bold': [
          '36px',
          {
            lineHeight: '140%',
            fontWeight: '700',
          },
        ],
        'heading1-semibold': [
          '36px',
          {
            lineHeight: '140%',
            fontWeight: '600',
          },
        ],
        'heading2-bold': [
          '30px',
          {
            lineHeight: '140%',
            fontWeight: '700',
          },
        ],
        'heading2-semibold': [
          '30px',
          {
            lineHeight: '140%',
            fontWeight: '600',
          },
        ],
        'heading3-bold': [
          '24px',
          {
            lineHeight: '140%',
            fontWeight: '700',
          },
        ],
        'heading4-medium': [
          '20px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'body-bold': [
          '18px',
          {
            lineHeight: '140%',
            fontWeight: '700',
          },
        ],
        'body-semibold': [
          '18px',
          {
            lineHeight: '140%',
            fontWeight: '600',
          },
        ],
        'body-medium': [
          '18px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'body-normal': [
          '18px',
          {
            lineHeight: '140%',
            fontWeight: '400',
          },
        ],
        'body1-bold': [
          '18px',
          {
            lineHeight: '140%',
            fontWeight: '700',
          },
        ],
        'base-regular': [
          '16px',
          {
            lineHeight: '140%',
            fontWeight: '400',
          },
        ],
        'base-medium': [
          '16px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'base-semibold': [
          '16px',
          {
            lineHeight: '140%',
            fontWeight: '600',
          },
        ],
        'base1-semibold': [
          '16px',
          {
            lineHeight: '140%',
            fontWeight: '600',
          },
        ],
        'small-regular': [
          '14px',
          {
            lineHeight: '140%',
            fontWeight: '400',
          },
        ],
        'small-medium': [
          '14px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'small-semibold': [
          '14px',
          {
            lineHeight: '140%',
            fontWeight: '600',
          },
        ],
        'subtle-medium': [
          '12px',
          {
            lineHeight: '16px',
            fontWeight: '500',
          },
        ],
        'subtle-semibold': [
          '12px',
          {
            lineHeight: '16px',
            fontWeight: '600',
          },
        ],
        'tiny-medium': [
          '10px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'x-small-semibold': [
          '7px',
          {
            lineHeight: '9.318px',
            fontWeight: '600',
          },
        ],
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        fabada: ['var(--font-fabada)'],
        poppins: ['var(--font-poppins'],
        josefin: ['var(--font-josefin)'],
      },
      boxShadow: {
        menu: '0px 159px 95px rgba(13,12,34,0.01), 0px 71px 71px rgba(13,12,34,0.02), 0px 18px 39px rgba(13,12,34,0.02), 0px 0px 0px rgba(13,12,34,0.02)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
        'navbar-down': {
          from: { height: 0, opacity: 0 },
          to: { height: '80px', opacity: 1 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'navbar-down': 'navbar-down 0.5s ease-out',
      },
      screens: {
        xs: '400px',
      },
      maxWidth: {
        '10xl': '1680px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
