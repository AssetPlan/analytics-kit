import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/analytics.js',
      name: 'AnalyticsKit',
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`
    },
    rollupOptions: {
      output: [
        { format: 'es' },
        { format: 'cjs', exports: 'named' }
      ]
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})