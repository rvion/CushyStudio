import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import { STATE } from 'src/front/state'
import { asAbsolutePath } from '../utils/fs/pathUtils'
import { CushyFile } from './CushyFile'
import { AbsolutePath } from 'src/utils/fs/BrandedPaths'

export class CushyFileWatcher {
    filesMap = new Map<AbsolutePath, CushyFile>()

    constructor(
        //
        public st: STATE,
        public extensions: string = '.cushy.ts',
    ) {
        // this.filesMap = new Map()
    }

    walk = async (dir: string): Promise<boolean> => {
        console.log(`[💙] TOOL: starting discovery in ${dir}`)
        this._walk(dir)
        console.log(`[💙] TOOL: done walking, found ${this.filesMap.size} files`)
        await Promise.all([...this.filesMap.values()].map((f) => f.extractWorkflowsV2()))
        console.log(`[💙] TOOL: all ${this.filesMap.size} files are ready`)
        return true
    }

    private _walk = (dir: string) => {
        // console.log(`[💙] TOOL:  ...exploring ${dir}`)

        // 🔴
        // this.st.db.actions.clear()
        const files = readdirSync(dir)
        // console.log(files)
        for (const file of files) {
            if (file.startsWith('.')) continue
            // console.log('>>', file)
            const filePath = join(dir, file)
            const stat = statSync(filePath)
            if (stat.isDirectory()) {
                this._walk(filePath)
            } else if (filePath.endsWith(this.extensions)) {
                this.handleNewFile(filePath)
            }
        }
    }

    private handleNewFile = (filePath: string) => {
        if (!filePath.endsWith(this.extensions)) return
        // console.log(`found`)
        const absPath = asAbsolutePath(filePath)
        this.filesMap.set(asAbsolutePath(absPath), new CushyFile(this.st, absPath))
    }

    // private handleFileChange(filePath: string) {
    //     // console.log(`${filePath} changed`)
    //     const absPath = asAbsolutePath(filePath)
    //     if (!filePath.endsWith(this.extensions)) return
    //     this.st.knownFiles.set(absPath, new CushyFile(this.st, absPath))
    // }

    // private handleFileRemoval(filePath: string) {
    //     if (this.filesMap.has(filePath)) {
    //         this.filesMap.delete(filePath)
    //     }
    // }
}
