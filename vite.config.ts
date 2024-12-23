import react from '@vitejs/plugin-react'
import { cwd } from 'process'
import { defineConfig } from 'vite'

const installDir = cwd()

console.log(`[VITE] loading vite config`)
// https://vitejs.dev/config/
export default defineConfig({
   clearScreen: false,
   optimizeDeps: { exclude: ['fsevents', 'esbuild'] },
   // https://github.com/vitejs/vite-plugin-react/commit/25fe88a02d3a718b81a3b1290ff4e46bfab427f9
   plugins: [react({ jsxImportSource: 'JSOX' })],
   build: { emptyOutDir: true, copyPublicDir: false },
   server: {
      port: 8788,
      watch: { ignored: ['**/src/shell/*.js', '**/tsconfig.json', '**/library/**'] },
   },
   resolve: {
      alias: {
         // -----------------------------------------------------------------------
         mobx: `${installDir}/src/syms/mobx.js`,
         nsfwjs: `${installDir}/src/syms/nsfwjs.js`,
         '@tensorflow/tfjs': `${installDir}/src/syms/tfjs.js`,
         'mime-types': `${installDir}/src/syms/mime-types.js`,

         // -----------------------------------------------------------------------
         // injected node modules
         // 🔶 modifications must be kept in sync between :
         //     | ./src/shell/build.js
         //     | ./vite.config.ts
         //     | ./src/shell/externals.cjs
         /* */ assert: `${installDir}/src/syms/assert.js`,
         'node:assert': `${installDir}/src/syms/assert.js`,
         /* */ url: `${installDir}/src/syms/url.js`,
         'node:url': `${installDir}/src/syms/url.js`,
         /* */ buffer: `${installDir}/src/syms/buffer.js`,
         'node:buffer': `${installDir}/src/syms/buffer.js`,
         /* */ child_process: `${installDir}/src/syms/child_process.js`,
         'node:child_process': `${installDir}/src/syms/child_process.js`,
         /* */ cluster: `${installDir}/src/syms/cluster.js`,
         'node:cluster': `${installDir}/src/syms/cluster.js`,
         /* */ fs: `${installDir}/src/syms/fs.js`,
         'node:fs': `${installDir}/src/syms/fs.js`,
         /* */ https: `${installDir}/src/syms/https.js`,
         'node:https': `${installDir}/src/syms/https.js`,
         /* */ os: `${installDir}/src/syms/os.js`,
         'node:os': `${installDir}/src/syms/os.js`,
         /* */ path: `${installDir}/src/syms/path.js`,
         'node:path': `${installDir}/src/syms/path.js`,
         /* */ process: `${installDir}/src/syms/process.js`,
         'node:process': `${installDir}/src/syms/process.js`,
         /* */ stream: `${installDir}/src/syms/stream.js`,
         'node:stream': `${installDir}/src/syms/stream.js`,
         /* */ util: `${installDir}/src/syms/util.js`,
         'node:util': `${installDir}/src/syms/util.js`,
         /* */ zlib: `${installDir}/src/syms/zlib.js`,
         'node:zlib': `${installDir}/src/syms/zlib.js`,
         /* */ events: `${installDir}/src/syms/events.js`,
         'node:events': `${installDir}/src/syms/events.js`,
         /* */ async_hooks: `${installDir}/src/syms/async_hooks.js`,
         'node:async_hooks': `${installDir}/src/syms/async_hooks.js`,
         /* */ crypto: `${installDir}/src/syms/crypto.js`,
         'node:crypto': `${installDir}/src/syms/crypto.js`,
      },
   },
})
