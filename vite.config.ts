import path from "path"
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite' // <-- 1. Importa el plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- 2. Añade el plugin aquí
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
