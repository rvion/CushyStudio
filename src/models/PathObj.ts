import * as fs from 'fs'
import p from 'pathe'

export type FilepathExt = string | FPath

export class FPath {
    relPath: string
    absPath: string

    readAsString(): string {
        return fs.readFileSync(this.absPath, 'utf-8')
    }

    readAsBuffer(): Buffer {
        return fs.readFileSync(this.absPath)
    }

    get dirname(): string {
        return p.dirname(this.absPath)
    }

    ensureDir(): void {
        fs.mkdirSync(this.dirname, { recursive: true })
    }

    write(data: string | Buffer): void {
        if (typeof data === 'string') {
            fs.writeFileSync(this.absPath, data, 'utf-8')
        } else {
            fs.writeFileSync(this.absPath, data)
        }
    }

    existsSync(): boolean {
        return fs.existsSync(this.absPath)
    }

    get root(): string {
        return getRoot()
    }

    constructor(public path: string) {
        if (path.startsWith('data:')) {
            throw new Error(`[🚫] dataURL not supported`)
        }

        const absPath = p.resolve(path)
        const relPath = p.relative(this.root, absPath)

        this.absPath = absPath
        this.relPath = relPath
    }
}

export function normalizePath(path: string): FilepathExt {
    if (typeof path === 'string') return new FPath(path)
    return path
}

// ------------------------------------------------------
// quick check to make sure root is the proper folder

let _correctRoot: Maybe<string> = null

function getRoot(): string {
    // cache
    if (_correctRoot != null) return _correctRoot

    const cwd = process.cwd()
    const itemsInRoot = fs.readdirSync(cwd)
    const expectedFiles = ['package.json', 'node_modules', 'src', '_mac-linux-cleanup.sh']
    for (const file of expectedFiles) {
        if (!itemsInRoot.includes('package.json')) {
            throw new Error(`[🚫] root is not correct`)
        }
    }
    _correctRoot = cwd
    return cwd
}
