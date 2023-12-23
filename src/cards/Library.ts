import type { STATE } from 'src/state/state'

import path from 'pathe'
import Watcher from 'watcher'

import { makeAutoObservable, action } from 'mobx'
import { LiveCollection } from 'src/db/LiveCollection'
import { CushyAppL } from 'src/models/CushyApp'
import { asAbsolutePath } from 'src/utils/fs/pathUtils'
import { LibraryFile } from './LibraryFile'
import { shouldSkip_duringWatch } from './shouldSkip'

export class Library {
    query = ''
    showDescription = true
    showDrafts = true
    showFavorites = true
    imageSize = '11rem'
    selectionCursor = 0

    private appsC = new LiveCollection<CushyAppL>({
        where: () => {
            return { id: { $like: `%${this.query}%` } }
        },
        table: () => this.st.db.cushy_apps,
        options: { limit: 100 },
    })

    get appsFiltered(): CushyAppL[] {
        return this.appsC.items
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

    get allFavorites(): CushyAppID[] {
        return this.st.favoriteApps
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

    constructor(
        //
        public st: STATE,
    ) {
        // Watching a single path
        const included = st.typecheckingConfig.value.include
        const includedCards = included.filter(
            (x) =>
                x.startsWith('library/') && //
                x.endsWith('/**/*'),
        )
        const expanded = includedCards.map((x) => x.slice(8, -5))
        this.expanded = new Set(expanded)
        const cache = this.st.hotReloadPersistentCache
        if (cache.watcher) {
            ;(cache.watcher as Watcher).close()
        }

        // register watcher to properly reload all cards
        this.watcher = cache.watcher = new Watcher('library', {
            recursive: true,
            depth: 20,
            ignore: (t) => {
                const baseName = path.basename(t)
                return shouldSkip_duringWatch(baseName)
            },
        })

        // 🔴 🔴
        this.watcher.on('all', (event, targetPath, targetPathNext) => {
            // 🔶 TODO: handle rename and delete
            // console.log('🟢 1.', event) // => could be any target event: 'add', 'addDir', 'change', 'rename', 'renameDir', 'unlink' or 'unlinkDir'
            if (event === 'change') {
                const relPath = path.relative(this.st.rootPath, targetPath)
                console.log(`[👁️] changed: ${relPath}`)
                const isInLibrary = relPath.startsWith('library/') || relPath.startsWith('library\\')
                if (!isInLibrary) return

                // const pieces = relPath.split('/')
                // if (pieces.length < 3) return
                // const deckFolder = pieces.slice(0, 3).join('/') as PackageRelPath

                // console.log(`[👁️] rebuilding: ${deckFolder}`)
                // const pkg = this.getOrCreatePackage(deckFolder)
                // pkg.rebuild()

                const currentDraft = st.currentDraft
                const currentFile = currentDraft?.file
                if (currentFile == null) return console.log(`[👁️] ❌ no current app`)

                // if (relPath.endsWith('.ts') || relPath.endsWith('.tsx')) {
                // TODO 🔴 need to reload all cards in tne deck, so `prefabs` properly "hot-reload"
                // const card = this.cardsByPath.get(asAppPath(relPath))
                // if (card == null) return console.log('file watcher update aborted: not an action')

                // reload the card if it's already loaded
                console.log(`[👁️] reloading: ${currentFile.relPath}`)
                const res = currentFile.load({ force: true }).then((x) => {
                    if (x.type === 'newScript') {
                        x.script.extractApps()
                    }
                })

                // }
            }
            // reutrn
            // console.log('🟢 2.', targetPath) // => the file system path where the event took place, this is always provided
            // console.log('🟢 3.', targetPathNext) // => the file system path "targetPath" got renamed to, this is only provided on 'rename'/'renameDir' events
        })

        makeAutoObservable(this, { getFile: action })
        // this.filesMap = new Map()
    }

    // expand mechanism -------------------------------------------------
    private expanded: Set<string>
    get expandedPaths(): string[] { return [...this.expanded] } // prettier-ignore

    isExpanded = (path: string): boolean => this.expanded.has(path)

    expand = (path: string): void => {
        this.expanded.add(path)
    }

    collapse = (path: string): void => {
        this.expanded.delete(path)
        const jsonF = this.st.typecheckingConfig
        const prevInclude = jsonF.value.include
        const nextInclude = prevInclude.filter((x) => !x.startsWith(`library/${path}`))
        jsonF.update({ include: nextInclude })
    }
}

// FAVORITE MANAGEMENT ------------------------------------------------
// removeFavoriteByPath = (path: RelativePath) => {
//     this.st.configFile.update((x) => {
//         const fav = x.favoriteApps
//         if (fav == null) return
//         const index = fav.findIndex((x) => x === path)
//         if (index === -1) return
//         fav.splice(index, 1)
//     })
// }

// moveFavorite = (oldIndex: number, newIndex: number) => {
//     this.st.configFile.update((x) => {
//         const favs = x.favoriteApps
//         if (favs == null) return
//         favs.splice(newIndex, 0, favs.splice(oldIndex, 1)[0])
//     })
// }

// get allFavorites(): { appPath: RelativePath; app: Maybe<LibraryFile> }[] {
//     return this.st.favoriteApps.map((ap) => ({
//         appPath: ap,
//         app: this.getFile(ap),
//     }))
// }
// isTypeChecked = (path: string): boolean => {
//     const deckP = path.split('/')[0]
//     console.log(deckP)
//     if (this.st.githubUsername === 'rvion' && deckP === 'CushyStudio') return true
//     if (this.st.githubUsername === deckP) return true
//     return false
// }

// // 👉 use cardsFilteredSorted
// private get files(): LibraryFile[] {
//     return [...this.fileIndex.values()]
// }

// // 👉 use cardsFilteredSorted
// private get filesFiltered() {
//     return this.files.filter((c) => c.matchesSearch(this.query))
// }

// get cardsFilteredSorted(): LibraryFile[] {
//     return this.filesFiltered.slice().sort((a, b) => {
//         return b.score - a.score
//     })
// }
