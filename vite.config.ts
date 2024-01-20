import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import * as examples from './_examples/_examples.json';

// set this to one of the keys in examples/_examples.json
// for local dev example
const DEV_EXAMPLE = 'gapminder';

import * as pkg from './package.json';

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(pkg.version),
    __DEV_EXAMPLE__: { name: DEV_EXAMPLE, ...examples?.[DEV_EXAMPLE] },
  },
  // depending on your application, base can also be "/"
  base: '',
  plugins: [react(), viteTsconfigPaths()],
  build: {
    // sourcemap: 'hidden',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
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
