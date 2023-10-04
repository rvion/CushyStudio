import type { STATE } from 'src/front/state'
import type { AbsolutePath } from '../utils/fs/BrandedPaths'

import { readdirSync, statSync } from 'fs'
import path, { join } from 'path'
import { ItemDataType } from 'rsuite/esm/@types/common'
import { asAbsolutePath } from '../utils/fs/pathUtils'
import { PossibleActionFile } from './CushyFile'
import { makeAutoObservable } from 'mobx'

export class CushyFileWatcher {
    treeData: ItemDataType[] = []
    filesMap = new Map<AbsolutePath, PossibleActionFile>()

    // import failure debug
    failures: { filePath: string; fileName: string; error: string }[] = []
    recordFailure(filePath: string, reason: string) {
        const fileName = path.basename(filePath)
        this.failures.push({ filePath, fileName, error: reason })
        console.log(`[Importer] ❌ ${fileName} ${reason}`)
    }

    constructor(
        //
        public st: STATE,
        public extensions: string = '.ts',
    ) {
        makeAutoObservable(this)
        // this.filesMap = new Map()
    }

    walk = async (dir: string): Promise<boolean> => {
        console.log(`[💙] TOOL: starting discovery in ${dir}`)

        // reset the tree
        this.treeData.splice(0, this.treeData.length)
        this.filesMap.clear()

        this._walk(dir, this.treeData)

        console.log(`[💙] TOOL: done walking, found ${this.filesMap.size} files`)
        // await Promise.all([...this.filesMap.values()].map((f) => f.extractWorkflowsV2()))
        // console.log(`[💙] TOOL: all ${this.filesMap.size} files are ready`)
        return true
    }

    renderTree = (at: ItemDataType = { children: this.treeData, label: 'root' }, level = 0) => {
        const indent = ' '.repeat(level * 2)
        console.log(`|| ${indent}${at.label}`)
        if (at.children) {
            for (const child of at?.children ?? []) {
                this.renderTree(child, level + 1)
            }
        }
    }

    private _walk = (dir: string, parentStack: ItemDataType[]) => {
        const folder = path.basename(dir)
        // console.log(`[💙] TOOL:  ...exploring ${dir}`)

        // this.st.db.actions.clear()
        const files = readdirSync(dir)
        // console.log(files)
        for (const file of files) {
            const filePath = join(dir, file)
            const stat = statSync(filePath)
            // const dirName = path.basename(filePath)
            if (stat.isDirectory()) {
                console.log('----------')
                // console.log('1', folderEntry)
                const ARRAY: ItemDataType[] = []
                this._walk(filePath, ARRAY)
                const folderEntry: ItemDataType = { children: ARRAY, label: file, value: filePath }
                console.log('2', folderEntry)
                parentStack.push(folderEntry)
            } else {
                console.log('[💙] TOOL: handling', filePath)
                const absPath = asAbsolutePath(filePath)
                const paf = new PossibleActionFile(this.st, absPath)
                this.filesMap.set(asAbsolutePath(absPath), paf)
                const treeEntry = { label: file, value: filePath }
                parentStack.push(treeEntry)
            }
        }
    }
}
