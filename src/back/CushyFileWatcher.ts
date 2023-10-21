import type { STATE } from 'src/front/state'
import type { AbsolutePath, RelativePath } from '../utils/fs/BrandedPaths'

import { readdirSync, statSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import path, { join } from 'path'
import { ItemDataType } from 'rsuite/esm/@types/common'
import { ActionPath, asActionPath } from 'src/back/ActionPath'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { ActionFile } from './ActionFile'

export class Toolbox {
    updatedAt = 0
    treeData: ItemDataType[] = []
    filesMap = new Map<ActionPath, ActionFile>()
    folderMap = new Set<RelativePath>()
    rootActionFolder: AbsolutePath
    get = (path: ActionPath): ActionFile | undefined => this.filesMap.get(path)

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

    discoverAllActions = (): boolean => {
        const dir = this.st.actionsFolderPath
        this.treeData.splice(0, this.treeData.length) // reset
        this.filesMap.clear() // reset
        this.folderMap.clear() // reset

        console.log(`[💙] TOOL: starting discovery in ${dir}`)
        this.findActionsInFolder(dir, this.treeData)

        console.log(`[💙] TOOL: done walking, found ${this.filesMap.size} files`)
        this.updatedAt = Date.now()
        // await Promise.all([...this.filesMap.values()].map((f) => f.extractWorkflowsV2()))
        // console.log(`[💙] TOOL: all ${this.filesMap.size} files are ready`)
        return true
    }

    /** @internal */
    private findActionsInFolder = (dir: string, parentStack: ItemDataType[]) => {
        const files = readdirSync(dir)
        // console.log(files)
        for (const file of files) {
            if (file.startsWith('.')) continue
            if (file.startsWith('_')) continue

            const absPath = asAbsolutePath(join(dir, file))
            const relPath = asRelativePath(path.relative(this.st.actionsFolderPath, absPath))
            const stat = statSync(absPath)
            // const dirName = path.basename(filePath)
            if (stat.isDirectory()) {
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
                if (!file.endsWith(this.extensions)) {
                    // console.log(`skipping file ${relPath}`)
                    continue
                }
                const actionPath = asActionPath(relPath)
                // console.log('[💙] TOOL: handling', relPath)
                const paf = new ActionFile(this.st, absPath, actionPath)
                this.filesMap.set(actionPath, paf)
                const treeEntry = {
                    value: actionPath,
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
