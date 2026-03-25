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
        orange: {
          DEFAULT: '#FF6B00',
          2: '#FF8C38',
          pale: '#FFF3E8',
          dark: '#E05600',
        },
        green: {
          DEFAULT: '#34C759',
          pale: '#E8F8EE',
        },
        red: {
          DEFAULT: '#FF3B30',
          pale: '#FFF0EF',
        },
        blue: {
          DEFAULT: '#007AFF',
          pale: '#EBF4FF',
        },
        yellow: '#FF9500',
        gray: {
          0: '#FFFFFF',
          1: '#F2F2F7',
          2: '#E5E5EA',
          3: '#C7C7CC',
          4: '#8E8E93',
          5: '#636366',
          6: '#3A3A3C',
          7: '#1C1C1E',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'lg': '16px',
        'xl': '20px',
        '2xl': '28px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.07),0 1px 3px rgba(0,0,0,0.05)',
        'card-md': '0 6px 20px rgba(0,0,0,0.1),0 2px 6px rgba(0,0,0,0.06)',
        'card-lg': '0 12px 40px rgba(0,0,0,0.15),0 4px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
export default config;
