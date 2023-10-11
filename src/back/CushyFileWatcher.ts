import type { STATE } from 'src/front/state'
import type { AbsolutePath } from '../utils/fs/BrandedPaths'

import { readdirSync, statSync } from 'fs'
import path, { join } from 'path'
import { ItemDataType } from 'rsuite/esm/@types/common'
import { asAbsolutePath } from '../utils/fs/pathUtils'
import { PossibleActionFile } from './PossibleActionFile'
import { makeAutoObservable } from 'mobx'

export class CushyFileWatcher {
    treeData: ItemDataType[] = []
    filesMap = new Map<AbsolutePath, PossibleActionFile>()
    updatedAt = 0
    rootActionFolder: AbsolutePath

    // expand mechanism ----------------------------------------
    private expanded: Set<string>
    get expandedPaths(): string[] { return [...this.expanded] } // prettier-ignore
    isExpanded = (path: string): boolean => this.expanded.has(path)
    expand = (path: string): void => {
        this.expanded.add(path)
        const jsonF = this.st.typecheckingConfig
        const prevInclude = jsonF.value.include
        const nextInclude = [...prevInclude, `actions/${path}/*`]
        jsonF.update({ include: nextInclude })
    }

    collapse = (path: string): void => {
        this.expanded.delete(path)
        const jsonF = this.st.typecheckingConfig
        const prevInclude = jsonF.value.include
        const nextInclude = prevInclude.filter((x) => !x.startsWith(`actions/${path}`))
        jsonF.update({ include: nextInclude })
    }
    // ---------------------------------------------------------

    constructor(
        //
        public st: STATE,
        public extensions: string = '.ts',
    ) {
        this.rootActionFolder = st.actionsFolderPath
        const included = st.typecheckingConfig.value.include
        const includedActions = included.filter(
            (x) =>
                x.startsWith('actions/') && //
                x.endsWith('/*'),
        )
        const expanded = includedActions.map((x) => x.slice(8, -2))
        this.expanded = new Set(expanded)

        makeAutoObservable(this)
        // this.filesMap = new Map()
    }

    findActions = (): boolean => {
        const dir = this.st.actionsFolderPath
        this.treeData.splice(0, this.treeData.length) // reset
        this.filesMap.clear() // reset

        console.log(`[💙] TOOL: starting discovery in ${dir}`)
        this.findActionsInFolder(dir, this.treeData)

        console.log(`[💙] TOOL: done walking, found ${this.filesMap.size} files`)
        this.updatedAt = Date.now()
        // await Promise.all([...this.filesMap.values()].map((f) => f.extractWorkflowsV2()))
        // console.log(`[💙] TOOL: all ${this.filesMap.size} files are ready`)
        return true
    }

    /** @internal */
    findActionsInFolder = (dir: string, parentStack: ItemDataType[]) => {
        const files = readdirSync(dir)
        // console.log(files)
        for (const file of files) {
            const filePath = asAbsolutePath(join(dir, file))
            const value = filePath.slice(this.rootActionFolder.length + 1)
            const stat = statSync(filePath)
            // const dirName = path.basename(filePath)
            if (stat.isDirectory()) {
                // console.log('1', folderEntry)
                const ARRAY: ItemDataType[] = []
                this.findActionsInFolder(filePath, ARRAY)
                const folderEntry: ItemDataType = {
                    value,
                    children: ARRAY,
                    label: file,
                }
                // console.log('2', folderEntry)
                parentStack.push(folderEntry)
            } else {
                if (file.startsWith('.')) continue
                const relPath = path.relative(this.st.actionsFolderPath, filePath)
                console.log('[💙] TOOL: handling', relPath)
                const absPath = asAbsolutePath(filePath)
                const paf = new PossibleActionFile(this.st, absPath)
                this.filesMap.set(asAbsolutePath(absPath), paf)
                const treeEntry = {
                    value,
                    label: file,
                }
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
