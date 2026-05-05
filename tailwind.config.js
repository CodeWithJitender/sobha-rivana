/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        'hf-navy': '#161F48',
        'hf-royal-blue': '#163548',
        'hf-gold': '#CCA14D',
        'hf-offwhite': '#EDEDED',
        'hf-gold-2': '#FFED7E',
        'sobha-rivana': '#00474E',
      }
    }
  },
  plugins: [],
}
