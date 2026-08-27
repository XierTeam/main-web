import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// 主站部署在根路径 /，子站均为独立 SPA（/app/xxx），主站只做整页跳转
export default defineConfig({
  base: '/',
  plugins: [vue(), UnoCSS()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1500,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
