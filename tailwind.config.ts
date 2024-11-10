import type { Config } from "tailwindcss";

const config: Config = {
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
      animation: {
        squeeze: "squeeze 0.6s ease-in-out 5s",
      },
      keyframes: {
        squeeze: {
          "0%, 100%": {
            transform: "scale(1, 1)",
          },
          "50%": {
            transform: "scale(1.1, 0.9)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
