import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/when-i-have-time/dist/',
  plugins: [vue()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
