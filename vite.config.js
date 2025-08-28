import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "_redirects", dest: "" }
      ]
    })
  ],
  server: {
    open: true
  }
})
