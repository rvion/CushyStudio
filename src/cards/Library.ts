import type { STATE } from 'src/front/state'
import type { AbsolutePath, RelativePath } from '../utils/fs/BrandedPaths'

import path, { join } from 'pathe'
import Watcher from 'watcher'

import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { ItemDataType } from 'rsuite/esm/@types/common'
import { CardPath, asCardPath } from 'src/cards/CardPath'
import { Deck, DeckFolder } from 'src/cards/Deck'
import { hasValidActionExtension } from '../back/ActionExtensions'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { CardFile } from './CardFile'

export class Library {
    updatedAt = 0
    fileTree: ItemDataType[] = []
    cardsByPath = new Map<CardPath, CardFile>()
    folderMap = new Set<RelativePath>()
    rootLibraryFolder: AbsolutePath

    // --------------------------

    /** flat list of all decks */
    decks: Deck[] = []

    /** flat list of all decks, sorted by importance */
    get decksSorted(): Deck[] {
        return [...this.decks].sort((a, b) => {
            return b.score - a.score
        })
    }

    getCard = (cardPath: CardPath): CardFile | undefined => {
        return this.cardsByPath.get(cardPath)
    }

    private decksByFolder = new Map<DeckFolder, Deck>()

    getDeck = (deckFolder: DeckFolder): Deck => {
        const prev = this.decksByFolder.get(deckFolder)
        if (prev) return prev
        const next = new Deck(this, deckFolder)
        this.decksByFolder.set(deckFolder, next)
        this.decks.push(next)
        return next
    }

    favoritesFolded = false

    // // misc (later?)
    // installedFolded = false
    // marketplaceFolded = false
    // builtInFolded = false
    // unknownFolded = false

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
        this.discoverAllCards()

        // register watcher to properly reload all cards
        this.watcher = cache.watcher = new Watcher('library', {
            recursive: true,
            depth: 20,
            ignore: (t) => {
                const baseName = path.basename(t)
                return this.shouldSkip(baseName)
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
                    const af = this.cardsByPath.get(asCardPath(relPath))
                    if (af == null) return console.log('file watcher update aborted: not an action')
                    af.load({ force: true })
                }
            }
            // reutrn
            // console.log('🟢 2.', targetPath) // => the file system path where the event took place, this is always provided
            // console.log('🟢 3.', targetPathNext) // => the file system path "targetPath" got renamed to, this is only provided on 'rename'/'renameDir' events
        })

        makeAutoObservable(this)
        // this.filesMap = new Map()
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
        this.getDeck('library/VinsiGit/Cushy_Action' as DeckFolder)
        this.getDeck('library/noellealarie/cushy-avatar-maker' as DeckFolder)
        this.getDeck('library/featherice/cushy-actions' as DeckFolder)
        this.getDeck('library/noellealarie/comfy2cushy-examples' as DeckFolder)
        this.getDeck('library/CushyStudio/default' as DeckFolder)
        this.getDeck('library/CushyStudio/tutorial' as DeckFolder)
        // this.getDeck('library/rvion/cushy-example-deck' as DeckFolder)
        // this.getDeck('library/CushyStudio/cards' as DeckFolder)
    }

    createDeck = async (folder: DeckFolder): Promise<Deck> => {
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
                name: 'A simple card',
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
        await deck.updater._gitInit()
        this.recursivelyFindCardsInFolder(this.st.actionsFolderPathAbs, this.fileTree)
        return deck
    }

    get allActions() {
        return [...this.cardsByPath.values()]
    }

    get allFavorites(): CardFile[] {
        return this.st.favoriteActions //
            .map((ap) => this.getCard(ap)!)
            .filter(Boolean)
    }

    // expand mechanism ----------------------------------------
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

    discoverAllCards = (): boolean => {
        this.fileTree.splice(0, this.fileTree.length) // reset
        this.cardsByPath.clear() // reset
        this.folderMap.clear() // reset

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
                const apf = asRelativePath(path.join(...parts)) as DeckFolder
                const pack = this.getDeck(apf)
                const actionPath = asCardPath(relPath)
                const prev = this.getCard(actionPath)
                if (prev) {
                    prev.load({ force: true })
                } else {
                    const af = new CardFile(this, pack, absPath, actionPath)
                    pack.cards.push(af)
                    this.cardsByPath.set(actionPath, af)
                }
                const treeEntry = { value: actionPath, label: baseName }
                parentStack.push(treeEntry)
            }
        }
    }

    debug = (at: ItemDataType = { children: this.fileTree, label: 'root' }, level = 0) => {
        const indent = ' '.repeat(level * 2)
        console.log(`|| ${indent}${at.label}`)
        if (at.children) {
            for (const child of at?.children ?? []) {
                this.debug(child, level + 1)
            }
        }
    }

    // getTreeItem = (path: string): Maybe<ItemDataType> => {
    //     const parts = path.split('/')
    //     let current = this.treeData
    //     for (const part of parts) {
    //         const found = current.find((x) => x.label === part)
    //         if (found == null) return null
    //         current = found.children ?? []
    //     }
    //     return current[0]
    // }
}

const _FIX_INDENTATION = (str: TemplateStringsArray) => {
    // split string into lines
    let lines = str[0].split('\n').slice(1)
    const indent = (lines[0]! ?? '').match(/^\s*/)![0].length
    // trim whitespace at the start and end of each line
    lines = lines.map((line) => line.slice(indent))
    // join lines back together with preserved newlines
    return lines.join('\n')
}
