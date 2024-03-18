import uipreset from "./ui.preset";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-kb-theme="dark"]'],
  content: ["./src/**/*.{html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        discord: "#5865f2",
      },
    },
  },

  presets: [uipreset],
};
