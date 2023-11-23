import type { STATE } from 'src/state/state'
import type { AbsolutePath, RelativePath } from '../utils/fs/BrandedPaths'
import type { ItemDataType } from 'src/rsuite/shims'

import path, { join } from 'pathe'
import Watcher from 'watcher'

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { AppPath, asAppPath } from 'src/cards/CardPath'
import { Package, PackageRelPath } from 'src/cards/Deck'
import { hasValidActionExtension } from '../back/ActionExtensions'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { CardFile } from './CardFile'
import { _FIX_INDENTATION } from 'src/utils/misc/_FIX_INDENTATION'
import { ActionTagMethodList } from './Card'

export class Library {
    /** timestamp of last discoverAllApps */
    updatedAt = 0
    fileTree: ItemDataType[] = []
    cardsByPath = new Map<AppPath, CardFile>()
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
    private get cards(): CardFile[] {
        return [...this.cardsByPath.values()]
    }

    // 👉 use cardsFilteredSorted
    private get cardsFiltered() {
        return this.cards.filter((c) => c.matchesSearch(this.query))
    }

    get cardsFilteredSorted(): CardFile[] {
        return this.cardsFiltered.slice().sort((a, b) => {
            return b.score - a.score
        })
    }

    /** flat list of all decks, sorted by importance */
    get decksSorted(): Package[] {
        return [...this.decks].sort((a, b) => {
            return b.score - a.score
        })
    }

    getCard = (cardPath: AppPath): CardFile | undefined => {
        return this.cardsByPath.get(cardPath)
    }

    /** returns the card or throws an error */
    getCardOrThrow = (cardPath: AppPath): CardFile => {
        const card = this.cardsByPath.get(cardPath)
        if (card == null) throw new Error(`card not found: ${cardPath}`)
        return card
    }

    private decksByFolder = new Map<PackageRelPath, Package>()

    getDeck = (deckFolder: PackageRelPath): Package => {
        const prev = this.decksByFolder.get(deckFolder)
        if (prev) return prev
        const next = new Package(this, deckFolder)
        this.decksByFolder.set(deckFolder, next)
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

        this.addKnownPacks()
        this.discoverAllApps()

        // register watcher to properly reload all cards
        this.watcher = cache.watcher = new Watcher('library', {
            recursive: true,
            depth: 20,
            ignore: (t) => {
                const baseName = path.basename(t)
                return this.shouldSkip_duringWatch(baseName)
            },
        })

        this.watcher.on('all', (event, targetPath, targetPathNext) => {
            // 🔶 TODO: handle rename and delete
            // console.log('🟢 1.', event) // => could be any target event: 'add', 'addDir', 'change', 'rename', 'renameDir', 'unlink' or 'unlinkDir'
            if (event === 'change') {
                const relPath = path.relative(this.st.rootPath, targetPath)
                console.log(relPath)
                const isInLibrary = relPath.startsWith('library/') || relPath.startsWith('library\\')
                if (isInLibrary && relPath.endsWith('.ts')) {
                    // TODO 🔴 need to reload all cards in tne deck, so `prefabs` properly "hot-reload"
                    const card = this.cardsByPath.get(asAppPath(relPath))
                    if (card == null) return console.log('file watcher update aborted: not an action')

                    // reload the card if it's already loaded
                    if (card.loaded.value) card.load({ force: true })
                }
            }
            // reutrn
            // console.log('🟢 2.', targetPath) // => the file system path where the event took place, this is always provided
            // console.log('🟢 3.', targetPathNext) // => the file system path "targetPath" got renamed to, this is only provided on 'rename'/'renameDir' events
        })

        makeAutoObservable(this)
        // this.filesMap = new Map()
    }

    private shouldSkip_duringWatch = (baseName: string): boolean => {
        if (baseName.startsWith('node_modules')) return true
        return false
    }

    /** return true if the file or folder */
    private shouldSkip = (baseName: string): boolean => {
        if (baseName === 'cushy-deck.json') return true
        if (baseName.startsWith('.')) return true
        if (baseName.startsWith('_')) return true
        if (baseName.startsWith('node_modules')) return true
        if (baseName.startsWith('dist')) return true
        return false
    }

    private addKnownPacks = () => {
        this.getDeck('library/VinsiGit/Cushy_Action' as PackageRelPath)
        this.getDeck('library/noellealarie/cushy-avatar-maker' as PackageRelPath)
        this.getDeck('library/featherice/cushy-actions' as PackageRelPath)
        this.getDeck('library/noellealarie/comfy2cushy-examples' as PackageRelPath)
        this.getDeck('library/CushyStudio/default' as PackageRelPath)
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
        const deck = this.getDeck(folder)
        // await deck.updater._gitInit()
        this.recursivelyFindCardsInFolder(this.st.actionsFolderPathAbs, this.fileTree)
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
    get allFavorites(): { appPath: AppPath; app: Maybe<CardFile> }[] {
        return this.st.favoriteActions.map((ap) => ({
            appPath: ap,
            app: this.getCard(ap),
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

    discoverAllApps = (): boolean => {
        // this.cardsByPath.clear() // reset
        this.fileTree.splice(0, this.fileTree.length) // reset
        this.folderMap.clear() // reset
        this.st.actionTags = [] // reset

        console.log(`[💙] TOOL: starting discovery in ${this.st.actionsFolderPathAbs}`)
        this.recursivelyFindCardsInFolder(this.st.actionsFolderPathAbs, this.fileTree)

        console.log(`[💙] TOOL: done walking, found ${this.cardsByPath.size} files`)
        this.updatedAt = Date.now()
        // await Promise.all([...this.filesMap.values()].map((f) => f.extractWorkflowsV2()))
        // console.log(`[💙] TOOL: all ${this.filesMap.size} files are ready`)
        return true
    }

    /** @internal */
    private recursivelyFindCardsInFolder = (
        //
        dir: string,
        parentStack: ItemDataType[],
    ) => {
        const files = readdirSync(dir)
        // console.log(files)
        for (const baseName of files) {
            if (baseName === '_actionTags.ts' || baseName === '_actionTags.js') {
                const name = dir.split('/').at(-1)
                const _this = this
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

            const shouldSkip = this.shouldSkip(baseName)
            if (shouldSkip) continue

            const absPath = asAbsolutePath(join(dir, baseName))
            const stat = statSync(absPath)
            // const dirName = path.basename(filePath)
            if (stat.isDirectory()) {
                const relPath = asRelativePath(path.relative(this.st.actionsFolderPathAbs, absPath))
                // console.log('1', folderEntry)
                const ARRAY: ItemDataType[] = []
                this.folderMap.add(relPath)
                this.recursivelyFindCardsInFolder(absPath, ARRAY)
                const folderEntry: ItemDataType = {
                    value: relPath,
                    children: ARRAY,
                    label: baseName,
                }
                // console.log('2', folderEntry)
                parentStack.push(folderEntry)
            } else {
                const relPath = path.relative(this.st.rootPath, absPath)
                if (!hasValidActionExtension(relPath)) {
                    // console.log(`skipping file ${relPath}`)
                    continue
                }
                const parts = relPath.split('/').slice(0, 3)
                if (parts.length < 3) {
                    console.log(`skipping file ${relPath} cause it's not in a valid action folder`)
                    continue
                }
                const apf = asRelativePath(path.join(...parts)) as PackageRelPath
                const deck = this.getDeck(apf)
                const cardPath = asAppPath(relPath)
                deck._registerApp(absPath, 'B')
                const treeEntry = { value: cardPath, label: baseName }
                parentStack.push(treeEntry)
            }
        }
    }

    // debug = (at: ItemDataType = { children: this.fileTree, label: 'root' }, level = 0) => {
    //     const indent = ' '.repeat(level * 2)
    //     console.log(`|| ${indent}${at.label}`)
    //     if (at.children) {
    //         for (const child of at?.children ?? []) {
    //             this.debug(child, level + 1)
    //         }
    //     }
    // }
}
