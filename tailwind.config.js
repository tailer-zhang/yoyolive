// tailwind.config.js
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: (theme) => ({
      ...theme("colors"),
      primary: "#FF8462",
    }),
    extend: {},
  },
  variants: {
    extend: {
      divideColor: ["group-hover"],
    },
  },
  plugins: [],
};
