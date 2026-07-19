/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./apps/mobile/App.{js,jsx,ts,tsx}",
    "./apps/mobile/src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
