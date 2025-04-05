// @ts-nocheck
// todo: add back @bun/types later when bun types do not conflict with node types
import * as babel from '@babel/core'
import { plugin } from 'bun'
import chalk from 'chalk'
import fs from 'fs'
import debounce from 'lodash/debounce'

// 0. minor setup
let totalTimeSpentTranspiling = 0
const RELOAD_HACK_FILENAME = 'bunPlugin.reload.ts'

const startSetup = Date.now()
const log = (str: string): void => console.log(chalk.dim(`[bun] ${str}`))
log(`evaluating plugin module`)

plugin({
   name: 'typescript-with-native-decorators',
   setup(build): void {
      // 1. watch files manually since --watch is broken when using bun plugin 🥲
      const folderToWatch = import.meta.dir + '/src/'
      log(`manually watching ${folderToWatch}`)
      const watchFileSet = new Set<string | null>()
      fs.watch(folderToWatch, { recursive: true }, (event, filename) => {
         const needestart = watchFileSet.has(filename)
         log(`file ${filename} changed (in set: ${watchFileSet.has(filename)})`) // ${[...watchFileSet.values()]}
         if (needestart) void Bun.file(`./${RELOAD_HACK_FILENAME}`).write(`// '${Math.random()})\n`)
      })

      // 2. change how .ts and .tsx files are loaded
      log(`setup took ${Date.now() - startSetup}ms`)
      const filter = /.*monoloco\/src.*\.(ts|tsx)$/
      build.onLoad({ filter }, async (args): Promise<{ loader: 'js'; contents: string }> => {
         try {
            watchFileSet.add(args.path.replace(folderToWatch, ''))
            const codeTs = await Bun.file(args.path).text()
            const startTranspiling = performance.now()
            let codeJS = await transpileFile(args.path, codeTs)

            // 3. inject a dependency on a file that do NOT go though the plugin
            if (!codeJS.startsWith(`import '${RELOAD_HACK_FILENAME}'`))
               codeJS = `import '${RELOAD_HACK_FILENAME}'\n${codeJS}`

            totalTimeSpentTranspiling += performance.now() - startTranspiling
            addToCache(codeTs, codeJS)
            return { loader: 'js', contents: codeJS }
         } catch (e) {
            console.log(`[🔴] `, e)
            return { contents: '', loader: 'js' }
         }
      })
   },
})

// 4. cache system
const oldCache: Map<string, string> = (await Bun.file('./bunPlugin.cache').exists())
   ? new Map(JSON.parse((await Bun.file('./bunPlugin.cache').text()) || '[]'))
   : new Map()

const cache = new Map<string, string>()
log(`restoring module with ${oldCache.size} entries`)

export const getFromCache = (content: string): string | undefined => {
   if (cache.has(content)) return cache.get(content)
   if (oldCache.has(content)) {
      const value = oldCache.get(content)
      if (value) cache.set(content, value)
      return value
   }
   return
}
const saveCacheImpl = debounce(() => {
   log(`saving cache with ${cache.size} entries (spent ${totalTimeSpentTranspiling.toFixed(2)}ms transpiling)`) // prettier-ignore
   void Bun.file('./bunPlugin.cache').write(JSON.stringify([...cache.entries()]))
}, 50)

export const addToCache = (codeTS: string, codeJS: string): void => {
   cache.set(codeTS, codeJS)
   saveCacheImpl()
}

const MODE: 'babel' | 'esbuild' | 'typescript' = 'babel'

async function transpileFile(name: string, codeTs: string): Promise<string> {
   // 1. try to return the cached version
   const cache = getFromCache(codeTs)
   if (cache) return cache

   // or transpile a new
   const codeJs = await transpileFileForReal(name, codeTs)
   addToCache(codeTs, codeJs)
   return codeJs
}

async function transpileFileForReal(name: string, codeTS: string): Promise<string> {
   if (MODE === 'babel') return transpileFileWithBabel(name, codeTS)
   if (MODE === 'esbuild') return transpileFileWithEsbuild(name, codeTS)
   if (MODE === 'typescript') return transpileFileWithTypescript(name, codeTS)
   throw new Error(`MODE ${MODE} is ont supported`)
}

// alt 1. babel  -------------------------------------------------------------------------
async function transpileFileWithBabel(name: string, codeTS: string): Promise<string> {
   const res = await babel.transformAsync(codeTS, {
      filename: name,
      plugins: [
         ['@babel/plugin-proposal-decorators', { version: '2023-05' }],
         '@babel/plugin-syntax-import-attributes',
      ],
      presets: [
         ['@babel/preset-typescript', { allowDeclareFields: true }],
         ['@babel/preset-react', { runtime: 'automatic' }],
      ],
   })
   const codeJS = res?.code ?? ''
   return name.endsWith('.test.ts') || name.endsWith('.test.tsx')
      ? autoConvertVitestToBunTest(codeJS)
      : codeJS
}

// alt 2. esbuild ------------------------------------------------------------------------
async function transpileFileWithEsbuild(name: string, file: string): Promise<string> {
   const esbuild = (await import('esbuild')).default
   const result = await esbuild.transform(file, {
      loader: 'ts',
      target: 'chrome110',
   })
   return result.code
}

// alt 3. esbuild ------------------------------------------------------------------------
async function transpileFileWithTypescript(name: string, file: string): Promise<string> {
   const typescript = (await import('typescript')).default
   const codeJS = typescript.transpileModule(file, {
      compilerOptions: {
         module: typescript.ModuleKind.ESNext,
         target: typescript.ScriptTarget.ESNext,
         jsx: typescript.JsxEmit.React,
         decorators: true,
         importAttributes: true,
      },
   })
   return codeJS.outputText
}

// bonus for those who use vitest --------------------------------------------------------
function autoConvertVitestToBunTest(finalCode_: string): string {
   return (
      finalCode_
         .replaceAll(`from 'vitest'`, `from 'bun:test'`)
         .replaceAll('vitest.spyOn', `require('bun:test').spyOn`)
         .replaceAll('vitest.mock', `require('bun:test').mock`)
         .replaceAll('vi.spyOn', `require('bun:test').spyOn`)
         .replaceAll('vi.mock', `require('bun:test').mock`)
         // https://bun.sh/docs/test/mocks#restore-all-function-mocks-to-their-original-values-with-mock-restore
         .replaceAll('vitest.restoreAllMocks()', `require('bun:test').mock.restore()`)
   )
}
