import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

const plugins: PluginOption[] = [
  vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => ['v-list-recognize-title'].includes(tag)
      }
    }
  }),
  vuetify({
    autoImport: true
  })
]

if (process.env.NODE_ENV !== 'production') {
  plugins.push(vueDevTools())
}

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: ['posta-cloud.onrender.com']
  },
  plugins,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  build: {
    chunkSizeWarningLimit: 1024 * 1024 // Set the limit to 1 MB
  },
  optimizeDeps: {
    exclude: ['vuetify'],
    entries: ['./src/**/*.vue']
  }
})
