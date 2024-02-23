import { readdirSync, readFileSync, statSync } from 'fs'
import path, { join } from 'pathe'

import { ActionTagMethodList } from './App'
import { Library } from './Library'
import { LibraryFile } from './LibraryFile'
import { shouldSkip } from './shouldSkip'
import { hasValidActionExtension } from 'src/back/ActionExtensions'
import { asAbsolutePath, asRelativePath } from 'src/utils/fs/pathUtils'

export const recursivelyFindAppsInFolder = (
    //
    library: Library,
    root: AbsolutePath,
): LibraryFile[] => {
    const out: LibraryFile[] = []
    WALK(root)
    return out

    function WALK(dir: AbsolutePath) {
        const files = readdirSync(dir)
        for (const baseName of files) {
            // TAGS ------------------------------------------------------------
            if (
                baseName === '_actionTags.ts' || //
                baseName === '_actionTags.js'
            ) {
                const name = dir.split('/').at(-1)
                const _this = library
                function load(tags: ActionTagMethodList) {
                    try {
                        tags.forEach((tag) => {
                            tag.key = `${name ? name : ''}/${tag.key}`
                            _this.st.actionTags.push(tag)
                        })
                        console.log(`[🏷️] Loaded action tags for ${dir}`)
                    } catch (error) {
                        console.log(`[🔴] Failed to load action tags for ${dir}/_actionTags.ts\nGot: ${tags}`)
                    }
                }
                try {
                    const loader = new Function('actionTags', readFileSync(asAbsolutePath(join(dir, baseName))).toString())
                    loader(load)
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
            // console.log(`[👙] >>>>>>>>>>>>>>>>>>>>> SCRIPT:`, absPath)
            const file = library.getFile(relPath)
            out.push(file)
            // library._registerApp(absPath, 'autodiscover')
        }
    }
}
//
