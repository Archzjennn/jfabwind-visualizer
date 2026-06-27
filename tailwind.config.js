/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                background: {
                    light: '#f8fafc',
                    dark: '#0a0a0a',
                },
                panel: {
                    light: '#ffffff',
                    dark: '#1a1a1a',
                },
                accent: {
                    DEFAULT: 'rgb(var(--accent-600) / <alpha-value>)',
                    hover: 'rgb(var(--accent-700) / <alpha-value>)',
                },
                // INJEKSI WARNA DINAMIS: Akan membaca warna dari Settings Modal
                violet: {
                    50: 'rgb(var(--accent-50) / <alpha-value>)',
                    100: 'rgb(var(--accent-100) / <alpha-value>)',
                    200: 'rgb(var(--accent-200) / <alpha-value>)',
                    300: 'rgb(var(--accent-300) / <alpha-value>)',
                    400: 'rgb(var(--accent-400) / <alpha-value>)',
                    500: 'rgb(var(--accent-500) / <alpha-value>)',
                    600: 'rgb(var(--accent-600) / <alpha-value>)',
                    700: 'rgb(var(--accent-700) / <alpha-value>)',
                    800: 'rgb(var(--accent-800) / <alpha-value>)',
                    900: 'rgb(var(--accent-900) / <alpha-value>)',
                    950: 'rgb(var(--accent-950) / <alpha-value>)',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'shimmer': 'shimmer 1.5s infinite', 
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                shimmer: { 
                    '100%': { transform: 'translateX(100%)' },
                }
            }
        },
    },
    plugins: [],
}