/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // CRITICAL: Tells Tailwind where to scan for class names
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // 🔑 CRUCIAL: This enables the 'dark:' prefix by checking for the 'dark' class on the <html> tag
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}