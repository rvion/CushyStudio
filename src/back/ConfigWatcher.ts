import fs from 'fs'
import chokidar from 'chokidar'

export class ConfigFileWatcher {
    jsonContent: {
        'cushystudio.serverHostHTTP'?: string
        'cushystudio.serverWSEndoint'?: string
    } = {}

    constructor() {}

    startWatching(filePath: string) {
        const watcher = chokidar.watch(filePath, {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true,
        })

        watcher
            .on('add', (filePath) => this.handleFileChange(filePath))
            .on('change', (filePath) => this.handleFileChange(filePath))
            .on('unlink', (filePath) => this.handleFileRemoval(filePath))
    }

    private handleFileChange(filePath: string) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw err
            try {
                this.jsonContent = JSON.parse(data)
            } catch (e) {
                console.error('Failed to parse JSON file:', filePath, e)
            }
        })
    }

    private handleFileRemoval(filePath: string) {
        this.jsonContent = {}
    }
}
