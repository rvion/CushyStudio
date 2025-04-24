import type { CushyAppL } from '../models/CushyApp'
import type { STATE } from '../state/state'

import { action, makeAutoObservable } from 'mobx'
import path from 'pathe'
import Watcher from 'watcher'

import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { LibraryFile } from './LibraryFile'
import { shouldSkip_duringWatch } from './shouldSkip'

export class Library {
   query: string = ''

   // todo: move those to  config
   showDescription: boolean = true
   showDrafts: boolean = true
   showFavorites: boolean = true
   imageSize: string = '11rem'
   selectionCursor: number = 0

   get appsFiltered(): CushyAppL[] {
      return this.st.db.cushy_app //
         .select((q) => q.where('id', 'like', `%${this.query}%`).limit(100), ['cushy_app'])
   }

   get appsFilteredBuiltIn(): CushyAppL[] {
      return this.appsFiltered.filter((x) => x.isBuiltIn)
   }

   get appsFilteredLocal(): CushyAppL[] {
      return this.appsFiltered.filter((x) => x.isLocal)
   }

   get appsFilteredExample(): CushyAppL[] {
      return this.appsFiltered.filter((x) => x.isExample)
   }

   private fileIndex = new Map<RelativePath, LibraryFile>()

   // get or create file wrapper
   getFile = (relPath: RelativePath): LibraryFile => {
      const prev = this.fileIndex.get(relPath)
      if (prev) return prev
      const absPath = asAbsolutePath(path.join(this.st.rootPath, relPath))
      const next = new LibraryFile(this, absPath, relPath)
      this.fileIndex.set(relPath, next)
      return next
   }

   /** returns the card or throws an error */
   getFileOrThrow = (cardPath: RelativePath): LibraryFile => {
      const card = this.fileIndex.get(cardPath)
      if (card == null) throw new Error(`card not found: ${cardPath}`)
      return card
   }

   watcher: Watcher

   constructor(public st: STATE) {
      // Watching a single path
      // ⏸️ const expanded = includedCards.map((x) => x.slice(8, -5))
      // ⏸️ this.expanded = new Set(expanded)
      const cache = this.st.hotReloadPersistentCache
      if (cache.watcher) {
         ;(cache.watcher as Watcher).close()
      }

      // register watcher to properly reload all cards
      this.watcher = cache.watcher = new Watcher('library', {
         recursive: true,
         depth: 20,
         ignore: (t): boolean => {
            const baseName = path.basename(t)
            return shouldSkip_duringWatch(baseName)
         },
      })

      // 🔴 🔴
      this.watcher.on('all', (event, targetPath, targetPathNext) => {
         // 🔶 TODO: handle rename and delete
         // console.log('🟢 1.', event) // => could be any target event: 'add', 'addDir', 'change', 'rename', 'renameDir', 'unlink' or 'unlinkDir'
         if (event === 'change') {
            const relPath = asRelativePath(path.relative(this.st.rootPath, targetPath))

            console.log(`[👁️] changed: ${relPath}`)

            // if file is outside of the library, we should not care about it.
            const isInLibrary = relPath.startsWith('library/') || relPath.startsWith('library\\')
            if (!isInLibrary) return

            // first thing first, lets' just reload the script in the file,
            // just in case. This should be enough to automatically discover new
            // scripts when they're added
            const xxfile = this.getFile(relPath)
            // 🔴🔴🔴 do we want to wait here ? 🔴🔴🔴
            void xxfile.extractScriptFromFile({ force: true })

            // RELOAD ALL APPS from opened drafts
            // logic is a bit complex, but it seems like a good trade-off
            const allAppsNeedingUpdate = new Set<CushyAppL>()
            const allDraftTabs = cushy.layout.findTabsFor('Draft')
            for (const d of allDraftTabs) {
               // retrieve the draft from the tab
               const draft = st.db.draft.get(d.props.draftID)
               if (draft == null) {
                  console.error(`[🧐] missing draft ${d.props.draftID}; SKIPPING...`)
                  continue
               }

               // check if the changed file is directly related to the draft
               const file = draft.file
               const relPath2 = file?.relPath
               console.log(`[👁️] - draft: ${d.props.draftID}: relPath ${relPath2}`)
               let shouldUpdate = relPath2 === relPath

               // check if the changed file is an indirect dependency of the draft
               const scriptL = file?.scriptInDB
               const metafileX = scriptL?.data.metafile
               if (!shouldUpdate && metafileX != null) {
                  const draftDeps = Object.keys(metafileX.inputs)
                  // console.log(`[👁️]   | ${draftDeps.join('\n       | ')} `)
                  const changedDep = draftDeps.find((x) => x === relPath)
                  if (changedDep != null) {
                     console.log(`[👁️]        | ${d.props.draftID}: one depdency (${changedDep}) changed`)
                     shouldUpdate = true
                  }
               } else {
                  console.log(`[👁️]        | no metafile`)
               }

               // abort if no update is necessary
               if (!shouldUpdate) continue

               // 🔴 if more than one draft relatedc to the same file, will make this update more than once
               // 🔴 TODO: debounce
               console.log(`[👁️]        | 🟢 updating draft ${draft.name}! `)

               allAppsNeedingUpdate.add(draft.app)
            }
            const apps = [...allAppsNeedingUpdate]
            console.log(`[👁️] ${apps.length} apps need an update`)
            for (const app of apps) {
               const res = app.file.extractScriptFromFile({ force: true }).then((x) => {
                  if (x.type === 'newScript') {
                     x.script.evaluateAndUpdateAppsAndViews()
                  }
               })
            }
            // const currentDraft = st.currentDraft
            // const currentFile = currentDraft?.file
            // if (currentFile == null) return console.log(`[👁️] ❌ no current app`)

            // if (relPath.endsWith('.ts') || relPath.endsWith('.tsx')) {
            // TODO 🔴 need to reload all cards in tne deck, so `prefabs` properly "hot-reload"
            // const card = this.cardsByPath.get(asAppPath(relPath))
            // if (card == null) return console.log('file watcher update aborted: not an action')

            // reload the card if it's already loaded
            // console.log(`[👁️] reloading: ${currentFile.relPath}`)
            // const res = currentFile.extractScriptFromFile({ force: true }).then((x) => {
            //     if (x.type === 'newScript') {
            //         x.script.extractApps()
            //     }
            // })

            // }
         }
         // reutrn
         // console.log('🟢 2.', targetPath) // => the file system path where the event took place, this is always provided
         // console.log('🟢 3.', targetPathNext) // => the file system path "targetPath" got renamed to, this is only provided on 'rename'/'renameDir' events
      })

      makeAutoObservable(this, { getFile: action })
   }
}
