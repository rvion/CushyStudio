import chokidar from 'chokidar'
import fs from 'fs'

export class TypeScriptFilesMap {
    filesMap: Map<string, string>

    constructor(public extensions: string = '.cushy.ts') {
        this.filesMap = new Map()
    }

    startWatching(dir: string) {
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
        if (filePath.endsWith(this.extensions)) {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) throw err
                this.filesMap.set(filePath, data)
            })
        }
    }

    private handleFileChange(filePath: string) {
        if (filePath.endsWith(this.extensions)) {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) throw err
                this.filesMap.set(filePath, data)
            })
        }
    }

    private handleFileRemoval(filePath: string) {
        if (this.filesMap.has(filePath)) {
            this.filesMap.delete(filePath)
        }
    }
}
