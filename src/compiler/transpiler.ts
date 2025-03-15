/**
 * this module implement the core system to allow cushy scripts to include external modules
 * without really importing them
 */

import type { any_TsEfficient } from '../csuite/utils/objectAssignTsEfficient'
import type ESBUILD from 'esbuild'
import type { BuildContext } from 'esbuild'

// EXTERNAL MODULES we'll inject ------------------------------------------------
import * as drei from '@react-three/drei'
import * as fiber from '@react-three/fiber'
import * as fs from 'fs'
import * as mobx from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import * as path from 'pathe'
import __react, { Fragment } from 'react'
import * as three from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

import { jsx, jsxs } from '../csuite/custom-jsx/jsx-runtime'

// REWRITE LOGIC ------------------------------------------------------------------------
export const CUSHY_IMPORT = (mod: string): any_TsEfficient => {
   // initial externals allowed
   if (mod === 'react') return __react
   if (mod === 'mobx') return mobx
   if (mod === 'fs') return fs
   if (mod === 'mobx-react-lite') return { observer: observer, useLocalObservable }
   if (mod === 'react/jsx-runtime') return { jsx, jsxs, Fragment }
   //  added on 2024-03-25
   if (mod === '@react-three/drei') return drei
   if (mod === '@react-three/fiber') return fiber
   if (mod === 'three') return three
   if (mod === 'three/examples/jsm/loaders/MTLLoader.js') return { MTLLoader }
   if (mod === 'three/examples/jsm/loaders/OBJLoader.js') return { OBJLoader }
   if (mod === 'three/examples/jsm/loaders/MTLLoader') return { MTLLoader }
   if (mod === 'three/examples/jsm/loaders/OBJLoader') return { OBJLoader }
   //
   throw new Error('🔴 unsupported import: ' + mod)
}

export async function createEsbuildContextFor(p: {
   entrypoints: AbsolutePath[]
   root: AbsolutePath
}): Promise<BuildContext<any>> {
   const esbuild = window.require('esbuild') as typeof ESBUILD
   const distFolder = path.join(p.root, 'dist')

   // TODO: add extra externals
   return esbuild.context({
      entryPoints: p.entrypoints,
      outbase: p.root,
      bundle: true,
      // format: 'esm',
      banner: { js: '// 🛋️ CushyStudio\n' + p.entrypoints.map((e) => `//   - ${e}`) },
      jsx: 'transform',
      jsxSideEffects: false,
      target: ['deno1'],
      loader: {
         '.png': 'dataurl',
         '.jpg': 'dataurl',
         '.svg': 'dataurl',
      },
      outdir: distFolder,
      external: [
         // initial externals allowed
         'react',
         'mobx',
         'mobx-react-lite',
         'fs',
         //  2024-03-25
         'three',
         '@react-three/drei',
         '@react-three/fiber',
         'three',
         'three/examples/jsm/loaders/MTLLoader.js',
         'three/examples/jsm/loaders/OBJLoader.js',
         // Regex to exclude all imports that are not relative or absolute paths
         'stream',
      ],

      // ----------------------
      write: false,
      metafile: true,
      // ----------------------
      // loader: { '.png': 'dataurl' },
      // outfile: path.join(fileFolder, basenameWithoutExt + '.cushyapp.js'), // Output file path
      // write: false,
      // plugins: [restrictFolderPlugin],
   })
}
