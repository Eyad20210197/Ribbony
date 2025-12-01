// tailwind.config.ts
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/app/**/*.{ts,tsx,js,jsx}", "./src/components/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'ribbony-paper': '#f3e6dd',
        'ribbony-orange': '#d58a17',
        'ribbony-dark': '#2b2220',
        'ribbony-green': '#2c8b49',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        monoRetro: ['"Press Start 2P"', 'monospace'],
      }
    }
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
