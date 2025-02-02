/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        open_sans: ["Open Sans", "sans-serif"], // normal text
        playfair: ["Playfair Display", "serif"],
        lato: ["Lato", "sans-serif"], // secondary heading
        montserrat: ["Montserrat", "sans-serif"], // primary heading
        ubuntu: ["Ubuntu", "sans-serif"], // buttons
        logo_text: ["Macondo", "cursive"],
        gallient: ["Gallient", "sans-serif"],
        pangaia: ["Diphylleia", "sans-serif"],
        searchBars: ["Future Straw", "sans-serif"],
      },
    },
  },
  plugins: [],
};
