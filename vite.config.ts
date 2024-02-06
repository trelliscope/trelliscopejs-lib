import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import fs from 'fs'
import * as pkg from './package.json';


process.env = {...process.env, ...loadEnv('dev', process.cwd())};

let EXAMPLE = process.env.VITE_DEV_APP_EXAMPLE;

if (process.env.CI) {
  console.log(`Running in CI environment. Forcing to use 'gapminder_testing' example.`)
  EXAMPLE = 'gapminder_testing';
} else if (EXAMPLE === undefined) {
  console.log(`\x1b[31mWARNING:\x1b[0m No example display specified. Defaulting to 'gapminder_testing' example. You can specify a different example by setting the VITE_DEV_APP_EXAMPLE variable in '.env' to a folder name in '_examples'.`)
  EXAMPLE = 'gapminder_testing';
}

if (!fs.existsSync(`./_examples/${EXAMPLE}`)) {
  console.log(`\x1b[31mWARNING:\x1b[0m Example display '${EXAMPLE}' does not exist in the '_examples' directory. Please check the name and then set the EXAMPLE variable appropriately in 'vite.config.ts'.`)
  console.log(`Defaulting to 'gapminder_testing' example which is checked in with this repo.`)
  EXAMPLE = 'gapminder_testing';
}
const datatype = fs.existsSync(`./_examples/${EXAMPLE}/config.json`) ? 'json' : 'jsonp'
const id = fs.readFileSync(`./_examples/${EXAMPLE}/id`, 'utf8')

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(pkg.version),
    __DEV_EXAMPLE__: { name: EXAMPLE, id, datatype },
  },
  // depending on your application, base can also be "/"
  base: '',
  plugins: [react(), viteTsconfigPaths()],
  build: {
    // sourcemap: 'hidden',
    chunkSizeWarningLimit: 1600,
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
