/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/entities/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F4EF',
        surface: '#FFFFFF',
        'text-primary': '#1F2328',
        'text-secondary': '#5B6470',
        primary: '#1F6B4F',
        accent: '#E57A22',
        border: '#D9DCDD',
        success: '#2F8F5B',
        warning: '#C77A12',
        danger: '#B84A3A',
      },
    },
  },
  plugins: [],
};
