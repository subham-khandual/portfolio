import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Keep the heavy WebGL stack and the runtime/animation libraries in their
        // own chunks: `three` is then only fetched once a 3D section is reached,
        // and everything else caches independently between deploys.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('three') || id.includes('@react-three')) return 'three-vendor';
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
            return 'motion-vendor';
          }
          if (id.includes('react-dom') || id.includes('scheduler') || id.includes('/react/')) {
            return 'react-vendor';
          }
          return 'vendor';
        },
      },
    },
  },
})
