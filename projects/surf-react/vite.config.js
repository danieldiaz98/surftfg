import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // clave para que los recursos carguen en app nativa
  build: {
    outDir: 'dist',
  },
})
