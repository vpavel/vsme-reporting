/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Map your CSS variables to Tailwind colors
        primary: {
          DEFAULT: "var(--primary-color)",
          light: "var(--primary-color-light)",
        },
        "font-primary": {
          DEFAULT: "var(--font-primary-color)",
          light: "var(--font-primary-color-light)",
          lightest: "var(--font-primary-color-lightest)",
        },
        "font-button": "var(--font-color-button)",
      },
      spacing: {
        // Map your padding variables to fixed values (Tailwind v4 needs this)
        "custom-sm": "8px",
        "custom-md": "16px",
        "custom-lg": "45px",
      },
      borderRadius: {
        // Map your border radius variables to fixed values
        custom: "8px",
        "custom-lg": "24px",
      },
      boxShadow: {
        // Map your shadow variables
        custom: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
};
