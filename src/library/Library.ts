import type { STATE } from 'src/front/state'
import type { AbsolutePath, RelativePath } from '../utils/fs/BrandedPaths'

import path, { join } from 'pathe'
import Watcher from 'watcher'

import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { ItemDataType } from 'rsuite/esm/@types/common'
import { CardPath, asCardPath } from 'src/library/CardPath'
import { Deck, DeckFolder } from 'src/library/Deck'
import { hasValidActionExtension } from '../back/ActionExtensions'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { CardFile } from './CardFile'

export class ActionLibrary {
    updatedAt = 0
    treeData: ItemDataType[] = []
    actionsByPath = new Map<CardPath, CardFile>()

    // --------------------------
    packs: Deck[] = []
    get packsSorted(): Deck[] {
        return [...this.packs].sort((a, b) => {
            return b.score - a.score
        })
    }
    packsByFolder = new Map<DeckFolder, Deck>()
    getCard = (path: CardPath): CardFile | undefined => this.actionsByPath.get(path)
    getDeck = (folder: DeckFolder): Deck => {
        const prev = this.packsByFolder.get(folder)
        if (prev) return prev
        const next = new Deck(this, folder)
        this.packsByFolder.set(folder, next)
        this.packs.push(next)
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

        this.rootActionFolder = st.actionsFolderPathAbs
        const included = st.typecheckingConfig.value.include
        const includedActions = included.filter(
            (x) =>
                x.startsWith('library/') && //
                x.endsWith('/**/*'),
        )
        const expanded = includedActions.map((x) => x.slice(8, -5))
        this.expanded = new Set(expanded)
        const cache = this.st.hotReloadPersistentCache
        if (cache.watcher) {
            ;(cache.watcher as Watcher).close()
        }

        this.addKnownPacks()
        this.discoverAllActions()

        // register watcher to properly reload all actions
        this.watcher = cache.watcher = new Watcher('library', {
            recursive: true,
            depth: 20,
            ignore: (t) => {
                const baseName = path.basename(t)
                if (baseName.startsWith('.')) return true
                if (baseName.startsWith('_')) return true
                if (baseName.startsWith('node_modules')) return true
                if (baseName.startsWith('dist')) return true
                return false
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
                    // TODO 🔴 need to reload all actions in tne pack, so `prefabs` properly "hot-reload"
                    const af = this.actionsByPath.get(asCardPath(relPath))
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

    private addKnownPacks = () => {
        this.getDeck('library/VinsiGit/Cushy_Action' as DeckFolder)
        this.getDeck('library/noellealarie/cushy-avatar-maker' as DeckFolder)
        this.getDeck('library/featherice/cushy-actions' as DeckFolder)
        this.getDeck('library/rvion/cushy-example-actions' as DeckFolder)
        this.getDeck('library/noellealarie/comfy2cushy-examples' as DeckFolder)
        this.getDeck('library/CushyStudio/default' as DeckFolder)
        this.getDeck('library/CushyStudio/cards' as DeckFolder)
        this.getDeck('library/CushyStudio/tutorial' as DeckFolder)
    }

    createDeck = async (folder: DeckFolder): Promise<Deck> => {
        if (existsSync(folder)) return Promise.reject(`deck already exists: ${folder}`)
        mkdirSync(folder, { recursive: true })
        writeFileSync(join(folder, 'readme.md'), `# ${folder}\n\nThis is a new deck, created by CushyStudio.`)
        writeFileSync(join(folder, 'cushy-deck.json'), `{}`)
        // writeFileSync(join(folder, 'cushy-deck.json'), `{}`)
        // writeFileSync(join(folder, 'cushy-deck.json'), `{}`)
        // copyFileSync(join(this.st.rootPath, 'assets', 'cushy-deck.png'), join(folder, 'cushy-deck.png'))
        // writeFileSync(join(folder, 'cushy-deck.png'), ``)
        const deck = this.getDeck(folder)
        await deck.updater._gitInit()
        return deck
    }

    get allActions() {
        return [...this.actionsByPath.values()]
    }

    get allFavorites(): CardFile[] {
        return this.st.favoriteActions //
            .map((ap) => this.getCard(ap)!)
            .filter(Boolean)
    }

    // get actionsByPack(): Map<ActionPackFolder, ActionFile[]> {
    //     const map = new Map<ActionPackFolder, ActionFile[]>()
    //     for (const af of this.allActions) {
    //         const pack = af.actionPackFolderRel
    //         const list = map.get(pack)
    //         if (list == null) map.set(pack, [af])
    //         else list.push(af)
    //     }
    //     return map
    // }

    // get actionsByPack(): {string, ActionFile[]> {
    //     const entries = [...this._actionsByPack.entries()]
    // }
    folderMap = new Set<RelativePath>()
    rootActionFolder: AbsolutePath

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

    discoverAllActions = (): boolean => {
        const dir = this.st.actionsFolderPathAbs
        this.treeData.splice(0, this.treeData.length) // reset
        this.actionsByPath.clear() // reset
        this.folderMap.clear() // reset

        console.log(`[💙] TOOL: starting discovery in ${dir}`)
        this.findActionsInFolder(dir, this.treeData)

        console.log(`[💙] TOOL: done walking, found ${this.actionsByPath.size} files`)
        this.updatedAt = Date.now()
        // await Promise.all([...this.filesMap.values()].map((f) => f.extractWorkflowsV2()))
        // console.log(`[💙] TOOL: all ${this.filesMap.size} files are ready`)
        return true
    }

    /** @internal */
    private findActionsInFolder = (
        //
        dir: string,
        parentStack: ItemDataType[],
    ) => {
        const files = readdirSync(dir)
        // console.log(files)
        for (const file of files) {
            if (file.startsWith('.')) continue
            if (file.startsWith('_')) continue

            const absPath = asAbsolutePath(join(dir, file))
            const stat = statSync(absPath)
            // const dirName = path.basename(filePath)
            if (stat.isDirectory()) {
                const relPath = asRelativePath(path.relative(this.st.actionsFolderPathAbs, absPath))
                // console.log('1', folderEntry)
                const ARRAY: ItemDataType[] = []
                this.folderMap.add(relPath)
                this.findActionsInFolder(absPath, ARRAY)
                const folderEntry: ItemDataType = {
                    value: relPath,
                    children: ARRAY,
                    label: file,
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
                    this.actionsByPath.set(actionPath, af)
                }
                const treeEntry = { value: actionPath, label: file }
                parentStack.push(treeEntry)
            }
        }
    }

    debug = (at: ItemDataType = { children: this.treeData, label: 'root' }, level = 0) => {
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
