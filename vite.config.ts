import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        // Optimize for production
        minify: 'terser',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    ui: ['@heroui/system', '@heroui/theme', '@heroui/button', '@heroui/card', '@heroui/input'],
                    animations: ['framer-motion', 'canvas-confetti', 'react-countup'],
                    forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
                    utils: ['axios', 'sonner', 'clsx', 'tailwind-merge']
                },
            },
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 1000,
    },
    // Environment-specific settings
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
    // Preview server configuration
    preview: {
        port: 4173,
        host: true
    }
})