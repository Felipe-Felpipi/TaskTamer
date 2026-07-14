import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base precisa bater com o nome do repositório para funcionar em
// https://felipe-felpipi.github.io/TaskTamer/ (GitHub Pages de projeto)
export default defineConfig({
  plugins: [react()],
  base: '/TaskTamer/',
})
