module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/modules/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        large: '768px',
      },
      // BlackEyesArtisan Design System Colors
      colors: {
        ink: '#18181B',
        paper: '#FEF8E7',
        acid: '#D63D42',
        stone: '#E8DCCA',
        sun: '#FCCA46',
        // RetroUI semantic color tokens (mapped to brand)
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        'primary-hover': 'var(--primary-hover)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        'secondary-hover': 'var(--secondary-hover)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        'popover': 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
      },
      // Custom max-width for site container
      maxWidth: {
        'site': '1366px',
      },
      // BlackEyesArtisan Design System Fonts (Hybrid: Pacifico + Archivo Black + Space Grotesk)
      fontFamily: {
        brand: ['Pacifico', 'cursive'],
        head: ['var(--font-head)', 'Archivo Black', 'sans-serif'],
        display: ['var(--font-head)', 'Archivo Black', 'sans-serif'],
        sans: ['var(--font-sans)', 'Space Grotesk', 'sans-serif'],
      },
      // BlackEyesArtisan Design System Shadows (Hard shadows, no blur)
      boxShadow: {
        'hard': '4px 4px 0px 0px #18181B',
        'hard-sm': '2px 2px 0px 0px #18181B',
        'hard-xl': '8px 8px 0px 0px #18181B',
        'hard-acid': '4px 4px 0px 0px #D63D42',
        'hard-sun': '4px 4px 0px 0px #FCCA46',
        // RetroUI shadow tokens (mapped to brand hard shadows)
        'md': '4px 4px 0px 0px var(--shadow-color, #18181B)',
        'xs': '2px 2px 0px 0px var(--shadow-color, #18181B)',
        'lg': '8px 8px 0px 0px var(--shadow-color, #18181B)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      transitionProperty: {
        width: 'width margin',
        height: 'height',
        bg: 'background-color',
        display: 'display opacity',
        visibility: 'visibility',
        padding: 'padding-top padding-right padding-bottom padding-left',
      },
      keyframes: {
        // BlackEyesArtisan animations
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ring: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-top': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out-top': {
          '0%': { height: '100%' },
          '99%': { height: '0' },
          '100%': { visibility: 'hidden' },
        },
        enter: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        leave: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0.9)', opacity: 0 },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        ring: 'ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        'fade-in-right': 'fade-in-right 0.3s cubic-bezier(0.5, 0, 0.5, 1) forwards',
        'fade-in-top': 'fade-in-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards',
        'fade-out-top': 'fade-out-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards',
        enter: 'enter 200ms ease-out',
        'slide-in': 'slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)',
        leave: 'leave 150ms ease-in forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
