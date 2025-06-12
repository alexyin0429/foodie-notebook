// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    configureServer(server) {
      // 所有请求到 .webmanifest 的都手动设置正确的 MIME
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.endsWith('.webmanifest')) {
          res.setHeader('Content-Type', 'application/manifest+json')
        }
        next()
      })
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  base: '/'
})
