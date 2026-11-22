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
          primary: '#2563EB',      // Primary blue
          navy: '#172554',         // Deep navy
          secondary: '#3B82F6',    // Secondary blue
          light: '#EFF6FF',        // Light blue
          bg: '#F8FAFC',           // Background
          card: '#FFFFFF',         // White
          text: '#1E293B',         // Text
          muted: '#64748B',        // Secondary text
          border: '#E2E8F0',       // Borders
          teal: '#0F766E',         // Accent teal
          tealLight: '#F0FDFA',    // Light teal
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        hover: '0 10px 15px -3px rgba(37, 99, 235, 0.08), 0 4px 6px -4px rgba(37, 99, 235, 0.05)',
        elevated: '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
