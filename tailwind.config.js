/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Scanne tous les fichiers dans src
    ], // Indique où analyser les classes CSS
  theme: {
    extend: {},
  },
  plugins: [],
};
