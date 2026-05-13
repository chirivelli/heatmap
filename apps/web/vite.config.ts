import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'

import { createWebEnv } from './env'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = createWebEnv({
    ...process.env,
    ...loadEnv(mode, process.cwd(), ''),
  })

  return {
    plugins: [TanStackRouterVite(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  }
})
