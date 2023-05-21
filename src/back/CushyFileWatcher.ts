import chokidar from 'chokidar'
import { ServerState } from './ServerState'
import { CushyFile } from './CushyFile'
import { asAbsolutePath } from '../utils/fs/pathUtils'

export class CushyFileWatcher {
    filesMap: Map<string, CushyFile>

    constructor(
        //
        public serverState: ServerState,
        public extensions: string = '.cushy.ts',
    ) {
        this.filesMap = new Map()
    }

    startWatching(dir: string) {
        console.log(`👀 Watching ${dir} for ${this.extensions} files`)
        const watcher = chokidar.watch(dir, {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true,
        })

        watcher
            .on('add', (filePath) => this.handleNewFile(filePath))
            .on('change', (filePath) => this.handleFileChange(filePath))
            .on('unlink', (filePath) => this.handleFileRemoval(filePath))
    }

    private handleNewFile(filePath: string) {
        if (!filePath.endsWith(this.extensions)) return
        const absPath = asAbsolutePath(filePath)
        this.serverState.knownFiles.set(absPath, new CushyFile(this.serverState, absPath))

        // fs.readFile(filePath, 'utf8', (err, data) => {
        //     if (err) throw err
        //     this.filesMap.set(filePath, data)
        // })
    }

    private handleFileChange(filePath: string) {
        console.log(`${filePath} changed`)
        const absPath = asAbsolutePath(filePath)
        if (!filePath.endsWith(this.extensions)) return
        this.serverState.knownFiles.set(absPath, new CushyFile(this.serverState, absPath))
        // fs.readFile(filePath, 'utf8', (err, data) => {
        //     if (err) throw err
        //     this.filesMap.set(filePath, data)
        // })
    }

    private handleFileRemoval(filePath: string) {
        if (this.filesMap.has(filePath)) {
            this.filesMap.delete(filePath)
        }
    }
}
