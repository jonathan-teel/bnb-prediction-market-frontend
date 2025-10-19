import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/landing/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "3xl": "2000px",
        "4xl": "2560px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--accent-primary)",
        "primary-soft": "var(--accent-secondary)",
        "surface-primary": "var(--surface-primary)",
        "surface-secondary": "var(--surface-secondary)",
        "surface-tertiary": "var(--surface-tertiary)",
        "surface-overlay": "var(--surface-overlay)",
        "border-soft": "var(--border-soft)",
        "border-strong": "var(--border-strong)",
        "text-muted": "var(--text-muted)",
        "text-soft": "var(--text-soft)",
      },
      backgroundImage: {
        "bnb-grid":
          "radial-gradient(circle at 20% 15%, rgba(252,213,53,0.12), transparent 55%), radial-gradient(circle at 80% 0%, rgba(240,185,11,0.1), transparent 60%)",
      },
      boxShadow: {
        "bnb-glow": "0 24px 48px -24px rgba(252, 213, 53, 0.45)",
        "bnb-card": "0 32px 68px -40px rgba(4, 8, 16, 0.85)",
      },
      fontFamily: {
        anton: ["anton"],
        satoshi: ["satoshi"],
        rubik:["rubik"],
        interSemi:["interSemi"],
      },
    },
  },
  plugins: [],
} satisfies Config;

