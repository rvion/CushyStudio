import type { ActionTagMethodList } from './App'
import type { Library } from './Library'
import type { LibraryFile } from './LibraryFile'

import { readdirSync, readFileSync, statSync } from 'fs'
import path, { join } from 'pathe'

import { hasValidActionExtension } from '../back/ActionExtensions'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { shouldSkip } from './shouldSkip'

// TODO: review that; fix it ; make it usable again
export const recursivelyFindAppsInFolder = (
   //
   library: Library,
   root: AbsolutePath,
): LibraryFile[] => {
   const out: LibraryFile[] = []
   WALK(root)
   return out

   function load(
      //
      tags: ActionTagMethodList,
      name: string,
      dir: string,
   ): void {
      try {
         tags.forEach((tag) => {
            tag.key = `${name ? name : ''}/${tag.key}`
            library.st.actionTags.push(tag)
         })
         console.log(`[🏷️] Loaded action tags for ${dir}`)
      } catch (error) {
         console.log(`[🔴] Failed to load action tags for ${dir}/_actionTags.ts\nGot: ${tags}`)
      }
   }

   function WALK(dir: AbsolutePath): void {
      const files = readdirSync(dir)
      for (const baseName of files) {
         // TAGS ------------------------------------------------------------
         if (
            baseName === '_actionTags.ts' || //
            baseName === '_actionTags.js'
         ) {
            const name = dir.split('/').at(-1)!

            try {
               const functionCode = readFileSync(asAbsolutePath(join(dir, baseName))).toString()
               const loader = new Function('actionTags', functionCode)
               loader((actionTags: ActionTagMethodList) => load(actionTags, name, dir))
            } catch (error) {
               console.log(`[🔴] Failed to load action tags for ${dir}/_actionTags.ts`)
            }
         }

         // SKIP ------------------------------------------------------------
         if (shouldSkip(baseName)) continue

         // FOLDERS ---------------------------------------------------------
         const absPath = asAbsolutePath(join(dir, baseName))
         const stat = statSync(absPath)
         if (stat.isDirectory()) {
            WALK(absPath)
            continue
         }

         // FILES ---------------------------------------------------------
         const relPath: RelativePath = asRelativePath(path.relative(library.st.rootPath, absPath))
         if (!hasValidActionExtension(relPath)) continue
         // const parts = relPath.split('/').slice(0, 3)
         // if (parts.length < 3) {
         //     console.log(`skipping file ${relPath} cause it's not in a valid action folder`)
         //     continue
         // }
         // console.log(`[🧐] >>>>>>>>>>>>>>>>>>>>> SCRIPT:`, absPath)
         const file = library.getFile(relPath)
         out.push(file)
         // library._registerApp(absPath, 'autodiscover')
      }
   }
}
//
