import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f5f5f5",
        accent: "#E6A320",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      backgroundColor: {
        "debug-red": "rgba(255, 0, 0, 0.2)",
        "debug-yellow": "rgba(255, 255, 0, 0.2)",
        "debug-green": "rgba(0, 255, 0, 0.2)",
      },
    },
  },
  plugins: [],
}
export default config
