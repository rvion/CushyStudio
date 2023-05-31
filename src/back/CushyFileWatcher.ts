import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import { STATE } from 'src/front/state'
import { asAbsolutePath } from '../utils/fs/pathUtils'
import { CushyFile } from './CushyFile'

export class CushyFileWatcher {
    filesMap: Map<string, CushyFile>
    constructor(
        //
        public st: STATE,
        public extensions: string = '.cushy.ts',
    ) {
        this.filesMap = new Map()
    }

    walk = (dir: string) => {
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
                this.walk(filePath)
            } else if (filePath.endsWith(this.extensions)) {
                this.handleNewFile(filePath)
            }
        }
    }

    private handleNewFile(filePath: string) {
        if (!filePath.endsWith(this.extensions)) return
        // console.log('>>> found', filePath)
        const absPath = asAbsolutePath(filePath)
        this.st.knownFiles.set(absPath, new CushyFile(this.st, absPath))
    }

    private handleFileChange(filePath: string) {
        // console.log(`${filePath} changed`)
        const absPath = asAbsolutePath(filePath)
        if (!filePath.endsWith(this.extensions)) return
        this.st.knownFiles.set(absPath, new CushyFile(this.st, absPath))
    }

    private handleFileRemoval(filePath: string) {
        if (this.filesMap.has(filePath)) {
            this.filesMap.delete(filePath)
        }
    }
}
