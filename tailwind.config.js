/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        arnotify: {
          primary: "#EE16AD",
          secondary: "#bc00ff",
          accent: "#f817b5",
          neutral: "#2d1b69",
          "base-100": "#ffffff",
          success: "#B9F43E",
          error: "#ff0000",
          info: "#1A98FF"
        },
      },
    ],
  },
};

/*
Greens:
#8FEE9F
#B9F43E
*/