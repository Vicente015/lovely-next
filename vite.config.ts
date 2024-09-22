import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import unocss from 'unocss/vite'
import compression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    unocss(),
    preact({
      prerender: {
        enabled: false,
        renderTarget: '#app',
        additionalPrerenderRoutes: ['/404']
      }
    }),
    compression({ algorithm: 'brotliCompress', verbose: true })
  ]
})
