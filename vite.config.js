import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Aseguramos explícitamente la carpeta de salida
    emptyOutDir: true,
  }
})
