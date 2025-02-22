/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-custom":
          "linear-gradient(to right, rgba(72, 5, 125, 0.3) 0%, rgba(42, 221, 231, 0.4) 100%)",
      },
    },
  },
  plugins: [],
};
