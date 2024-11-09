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
        'float-up': 'floatUp 10s linear infinite',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(100vh)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
