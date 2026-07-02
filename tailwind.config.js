/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#7C3AED",
        accent: "#06B6D4",
        ink: "#0F172A",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(79, 70, 229, 0.22)",
      },
    },
  },
  plugins: [],
};
