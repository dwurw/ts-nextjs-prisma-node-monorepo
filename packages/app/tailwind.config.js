/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './page-components/**/*.{js,ts,jsx,tsx}',
    './libs/flow/*.{js,ts,jsx,tsx}',
    './libs/flow/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: '0.5rem'
      },
      animation: {
        scale: 'scale 1s ease-in-out infinite',
      },
      keyframes: {
        scale: {
          '0%': {
            transform: 'scale(1.0)'
          },
          '100%': {
            transform: 'scale(1.2)'
          }
        },
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ]
};
