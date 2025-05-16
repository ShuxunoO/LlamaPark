/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        "4/3": "4 / 3",
      },
      colors: {
        "regal-blue": "rgb(104, 133, 151)",
        "regal-yellow": "rgb(237, 233, 230)",
        "regal-purple": "rgb(163, 167, 230)",
        "regal-purple1": "rgb(132, 99, 151)",
        "regal-black": "#151515",
      },
    },
  },
  plugins: [],
};
