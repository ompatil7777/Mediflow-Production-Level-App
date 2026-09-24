/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0C4A60",
          dark: "#003244",
          container: "#0C4A60",
          fixed: "#BFE9FF",
          light: "#E2E7FF",
        },
        surface: {
          ground: "#F8FAFC",
          card: "#FFFFFF",
          well: "#F1F5F9",
          border: "#CBD5E1",
          dim: "#D2D9F4",
        },
        content: {
          primary: "#0F172A",
          secondary: "#1E293B",
          muted: "#64748B",
        },
        status: {
          available: "#16A34A",
          "available-bg": "#F0FDF4",
          low: "#D97706",
          "low-bg": "#FFFBEB",
          critical: "#DC2626",
          "critical-bg": "#FEF2F2",
          restocking: "#2563EB",
          "restocking-bg": "#EFF6FF",
          inactive: "#64748B",
          "inactive-bg": "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Devanagari"', "sans-serif"],
        devanagari: ['"Noto Sans Devanagari"', '"Plus Jakarta Sans"', "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        full: "9999px",
      },
      maxWidth: {
        mobile: "430px",
      },
      boxShadow: {
        none: "none",
      },
    },
  },
  plugins: [],
};
