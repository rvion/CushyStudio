import type { UserConfigExport } from 'vitest/config'

// import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

console.log('🟢 TEST ENGINE SETUP')

// types are broken, probably requires packages update (a second vite install is nested in vitest)
// const tsConfigPathPlugin: any = tsconfigPaths()

const config: UserConfigExport = {
   plugins: [],
   test: {
      // globals: true,
      reporters: ['verbose'],
      testTimeout: 30_000_000,
      hookTimeout: 30_000_000,
      //
      include: [
         //
         'src/**/*.test.ts',
         'src/**/*.test.tsx',
         // '!src/cushy-forms/**/*',
      ],
      globalSetup: ['./src/setup.vitest.ts'],

      // environmentMatchGlobs: [
      //    // Frontend tests
      //    ['**/*.{test,spec}.tsx', 'jsdom'],
      //    // Backend tests
      //    ['**/*.{test,spec}.ts', 'node'],
      // ],
      setupFiles: [
         './src/setup.vitest.ts',
         // './src/back/testing/setupTestsAfterEnv.ts',
         // './src/front/setupTestsAfterEnv_front.ts',
      ],
      // pool: 'forks', // Utilise des processus au lieu des threads
      // poolOptions: {
      //    forks: {
      //       singleFork: true,
      //    },
      // },
      // minThreads: 8,
      // maxThreads: 8,
      resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
      testTransformMode: {
         web: ['*.tsx'],
      },
   },
   esbuild: { jsxImportSource: 'JSOX' },
}

export default defineConfig(config)
