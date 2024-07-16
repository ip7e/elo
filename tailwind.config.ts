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
        bg: "#ffffff",
        accent: "#E6A320",
      },
      fontFamily: {
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
