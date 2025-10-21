// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'
export default defineConfig({
  plugins: [react()],
  css:{ postcss:{ plugins:[tailwindcss(), autoprefixer()] } }
})