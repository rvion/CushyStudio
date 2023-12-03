import type { STATE } from 'src/state/state'
import type { ItemDataType } from 'src/rsuite/RsuiteTypes'

import path, { join } from 'pathe'
import Watcher from 'watcher'

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { asAppPath } from 'src/cards/CardPath'
import { Package, PackageRelPath } from 'src/cards/Pkg'
import { hasValidActionExtension } from '../back/ActionExtensions'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { LibraryFile } from './CardFile'
import { _FIX_INDENTATION } from 'src/utils/misc/_FIX_INDENTATION'
import { ActionTagMethodList } from './Card'
import { shouldSkip, shouldSkip_duringWatch } from './shouldSkip'

export class Library {
    /** timestamp of last discoverAllApps */
    updatedAt = 0
    fileTree: ItemDataType[] = []
    cardsByPath = new Map<AppPath, LibraryFile>()
    folderMap = new Set<RelativePath>()
    rootLibraryFolder: AbsolutePath

    // --------------------------

    query = ''
    showDescription = true
    showDrafts = true
    showFavorites = true
    imageSize = '11rem'
    selectionCursor = 0
    /** flat list of all decks */
    decks: Package[] = []

    // 👉 use cardsFilteredSorted
    private get files(): LibraryFile[] {
        return [...this.cardsByPath.values()]
    }

    // 👉 use cardsFilteredSorted
    private get filesFiltered() {
        return this.files.filter((c) => c.matchesSearch(this.query))
    }

    get cardsFilteredSorted(): LibraryFile[] {
        return this.filesFiltered.slice().sort((a, b) => {
            return b.score - a.score
        })
    }

    /** flat list of all decks, sorted by importance */
    get decksSorted(): Package[] {
        return [...this.decks].sort((a, b) => {
            return b.score - a.score
        })
    }

    getFile = (cardPath: AppPath): LibraryFile | undefined => {
        return this.cardsByPath.get(cardPath)
    }

    /** returns the card or throws an error */
    getFileOrThrow = (cardPath: AppPath): LibraryFile => {
        const card = this.cardsByPath.get(cardPath)
        if (card == null) throw new Error(`card not found: ${cardPath}`)
        return card
    }

    private packageByFolder = new Map<PackageRelPath, Package>()

    getOrCreatePackage = (deckFolder: PackageRelPath): Package => {
        const prev = this.packageByFolder.get(deckFolder)
        if (prev) return prev
        const next = new Package(this, deckFolder)
        this.packageByFolder.set(deckFolder, next)
        this.decks.push(next)
        return next
    }

    favoritesFolded = false

    watcher: Watcher

    constructor(
        //
        public st: STATE,
    ) {
        // Watching a single path

        this.rootLibraryFolder = st.actionsFolderPathAbs
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

        this.registerKnownPackages()
        this.discoverAllPackages()

        // register watcher to properly reload all cards
        this.watcher = cache.watcher = new Watcher('library', {
            recursive: true,
            depth: 20,
            ignore: (t) => {
                const baseName = path.basename(t)
                return shouldSkip_duringWatch(baseName)
            },
        })

        this.watcher.on('all', (event, targetPath, targetPathNext) => {
            // 🔶 TODO: handle rename and delete
            // console.log('🟢 1.', event) // => could be any target event: 'add', 'addDir', 'change', 'rename', 'renameDir', 'unlink' or 'unlinkDir'
            if (event === 'change') {
                const relPath = path.relative(this.st.rootPath, targetPath)
                console.log(`[👁️] changed: ${relPath}`)
                const isInLibrary = relPath.startsWith('library/') || relPath.startsWith('library\\')
                if (!isInLibrary) return

                const pieces = relPath.split('/')
                if (pieces.length < 3) return
                const deckFolder = pieces.slice(0, 3).join('/') as PackageRelPath

                console.log(`[👁️] rebuilding: ${deckFolder}`)
                const pkg = this.getOrCreatePackage(deckFolder)
                pkg.rebuild()

                const currentDraft = st.currentDraft
                const currentApp = currentDraft?.app
                if (currentApp == null) return console.log(`[👁️] ❌ no current app`)

                // if (relPath.endsWith('.ts') || relPath.endsWith('.tsx')) {
                // TODO 🔴 need to reload all cards in tne deck, so `prefabs` properly "hot-reload"
                // const card = this.cardsByPath.get(asAppPath(relPath))
                // if (card == null) return console.log('file watcher update aborted: not an action')

                // reload the card if it's already loaded
                console.log(`[👁️] reloading: ${currentApp.relPath}`)
                currentApp.load({ force: true })
                // }
            }
            // reutrn
            // console.log('🟢 2.', targetPath) // => the file system path where the event took place, this is always provided
            // console.log('🟢 3.', targetPathNext) // => the file system path "targetPath" got renamed to, this is only provided on 'rename'/'renameDir' events
        })

        makeAutoObservable(this)
        // this.filesMap = new Map()
    }

    private registerKnownPackages = () => {
        this.getOrCreatePackage('library/VinsiGit/Cushy_Action' as PackageRelPath)
        this.getOrCreatePackage('library/noellealarie/cushy-avatar-maker' as PackageRelPath)
        this.getOrCreatePackage('library/featherice/cushy-actions' as PackageRelPath)
        this.getOrCreatePackage('library/noellealarie/comfy2cushy-examples' as PackageRelPath)
        this.getOrCreatePackage('library/CushyStudio/default' as PackageRelPath)
        // this.getDeck('library/CushyStudio/tutorial' as DeckFolder)
        // this.getDeck('library/rvion/cushy-example-deck' as DeckFolder)
        // this.getDeck('library/CushyStudio/cards' as DeckFolder)
    }

    createDeck = async (folder: PackageRelPath): Promise<Package> => {
        if (existsSync(folder)) return Promise.reject(`deck already exists: ${folder}`)
        mkdirSync(folder, { recursive: true })
        writeFileSync(join(folder, 'readme.md'), `# ${folder}\n\nThis is a new deck, created by CushyStudio.`)
        writeFileSync(
            join(folder, 'cushy-deck.json'),
            _FIX_INDENTATION`
            {
                "$schema": "../../../src/cards/DeckManifest.schema.json"
            }
        `,
        )
        // prettier-ignore
        writeFileSync(join(folder, '_prefab.ts'), _FIX_INDENTATION`
            import type { FormBuilder } from "src/controls/FormBuilder"
            export const ui_vaeName = (form: FormBuilder) =>
                form.enumOpt({
                    label: 'VAE',
                    enumName: 'Enum_VAELoader_vae_name',
                })

            export const ui_modelName = (form: FormBuilder) =>
                form.enum({
                    label: 'Checkpoint',
                    enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
                })
        `)
        const baseActionCode = _FIX_INDENTATION`
            card({
                ui: (form) => ({ name: form.str({}) }),
                run: (runtime) => runtime.print('Hello World')
            })
        `
        writeFileSync(join(folder, 'sample-card-1.ts'), baseActionCode)
        writeFileSync(join(folder, 'sample-card-2.ts'), baseActionCode)

        // writeFileSync(join(folder, 'cushy-deck.json'), `{}`)
        // writeFileSync(join(folder, 'cushy-deck.json'), `{}`)
        // copyFileSync(join(this.st.rootPath, 'assets', 'cushy-deck.png'), join(folder, 'cushy-deck.png'))
        // writeFileSync(join(folder, 'cushy-deck.png'), ``)
        const deck = this.getOrCreatePackage(folder)
        // await deck.updater._gitInit()
        // 🔴 this.recursivelyFindCardsInFolder(this.st.actionsFolderPathAbs, this.fileTree)
        return deck
    }

    // FAVORITE MANAGEMENT ------------------------------------------------
    removeFavoriteByPath = (path: AppPath) => {
        this.st.configFile.update((x) => {
            const fav = x.favoriteCards
            if (fav == null) return
            const index = fav.findIndex((x) => x === path)
            if (index === -1) return
            fav.splice(index, 1)
        })
    }
    moveFavorite = (oldIndex: number, newIndex: number) => {
        this.st.configFile.update((x) => {
            const favs = x.favoriteCards
            if (favs == null) return
            favs.splice(newIndex, 0, favs.splice(oldIndex, 1)[0])
        })
    }
    get allFavorites(): { appPath: AppPath; app: Maybe<LibraryFile> }[] {
        return this.st.favoriteActions.map((ap) => ({
            appPath: ap,
            app: this.getFile(ap),
        }))
    }

    // expand mechanism -------------------------------------------------
    private expanded: Set<string>
    get expandedPaths(): string[] { return [...this.expanded] } // prettier-ignore

    isExpanded = (path: string): boolean => this.expanded.has(path)
    isTypeChecked = (path: string): boolean => {
        const deckP = path.split('/')[0]
        console.log(deckP)
        if (this.st.githubUsername === 'rvion' && deckP === 'CushyStudio') return true
        if (this.st.githubUsername === deckP) return true
        return false
    }

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
    // ---------------------------------------------------------

    discoverAllPackages = (): boolean => {
        // this.cardsByPath.clear() // reset
        this.fileTree.splice(0, this.fileTree.length) // reset
        this.folderMap.clear() // reset
        this.st.actionTags = [] // reset

        // first level: author folders
        // console.log(`[💙] LIBRARY: starting discovery in ${this.st.actionsFolderPathAbs}`)
        const foundPackages = new Set<AbsolutePath>()

        const authors = readdirSync(this.st.actionsFolderPathAbs)
        for (const author of authors) {
            const authorPath = join(this.st.actionsFolderPathAbs, author)
            const baseName1 = path.basename(authorPath)
            if (shouldSkip(baseName1)) continue
            if (!statSync(authorPath).isDirectory()) continue
            const packageFolders = readdirSync(authorPath)
            for (const packageFolder of packageFolders) {
                const packagePath = join(authorPath, packageFolder)
                const baseName2 = path.basename(packagePath)
                if (shouldSkip(baseName2)) continue
                if (!statSync(packagePath).isDirectory()) continue
                foundPackages.add(asAbsolutePath(packagePath))

                const pkgRelPath = path.relative(this.st.rootPath, packagePath) as PackageRelPath
                this.getOrCreatePackage(pkgRelPath)
            }
        }

        console.log(`[💙] LIBRARY: found ${foundPackages.size} packages`)
        this.updatedAt = Date.now()
        return true
    }
}
