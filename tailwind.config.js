export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        breach: "#ff3366",
        secure: "#22d3ee",
        bg: "#0a0a14",
        panel: "#13131f",
        accent: "#a78bfa",
      },
      fontFamily: {
        display: ["'Orbitron'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

