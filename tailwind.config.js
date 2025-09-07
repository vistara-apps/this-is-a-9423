/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(240, 80%, 50%)",
        accent: "hsl(180, 70%, 45%)",
        bg: "hsl(230, 25%, 95%)",
        surface: "hsl(0, 0%, 100%)",
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.08)',
        'modal': '0 10px 32px hsla(0, 0%, 0%, 0.12)',
      },
    },
  },
  plugins: [],
}