import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#00296B",
          50: "#E6F0FF",
          100: "#CCE1FF",
          200: "#99C3FF",
          300: "#66A5FF",
          400: "#3387FF",
          500: "#0069FF",
          600: "#003F88",
          700: "#00296B",
          800: "#001A4D",
          900: "#000B2E",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#00509D",
          50: "#E6F2FF",
          100: "#CCE5FF",
          200: "#99CBFF",
          300: "#66B1FF",
          400: "#3397FF",
          500: "#007DFF",
          600: "#00509D",
          700: "#003F88",
          800: "#002E73",
          900: "#001D5E",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#FDC500",
          50: "#FFFBEB",
          100: "#FFF7D6",
          200: "#FFEFAD",
          300: "#FFE784",
          400: "#FFDF5B",
          500: "#FFD500",
          600: "#FDC500",
          700: "#E6B200",
          800: "#CC9F00",
          900: "#B38C00",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
