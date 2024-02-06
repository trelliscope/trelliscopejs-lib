import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import * as pkg from './package.json';

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(pkg.version),
  },
  // depending on your application, base can also be "/"
  base: '',
  plugins: [react(), viteTsconfigPaths(), cssInjectedByJsPlugin()],
  build: {
    // sourcemap: 'hidden',
    chunkSizeWarningLimit: 3500,
    lib: {
      entry: 'src/index.tsx',
      name: 'trelliscope-viewer',
      fileName: 'trelliscope-viewer',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      // external: Object.keys(pkg.dependencies || {}),
      output: {
        globals: {
          react: "React",
          'react-dom': "reactdom",
        },
      },
    },
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000  
    port: 3000,
  },
})
