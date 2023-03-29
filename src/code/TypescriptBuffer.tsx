import type { Maybe } from '../core/ComfyUtils'
import type { Workspace } from '../core/Workspace'
import type { ITextModel } from '../ui/TypescriptOptions'
import * as path from '@tauri-apps/api/path'
import * as fs from '@tauri-apps/api/fs'
import { makeObservable, observable } from 'mobx'
import { globalMonaco } from '../ui/Monaco'

export class TypescriptBuffer {
    public name: string
    public path: string
    constructor(
        //
        public workspace: Workspace,
        opts: {
            name: string
            path: string
            def: Maybe<string>
        },
    ) {
        makeObservable(this, {
            ready: observable,
            textModel: observable.ref,
        })
        this.name = opts.name
        this.path = opts.path
        void this.init(opts.def)
    }

    /** the monaco textmodel that should remains alive for typeschecking to work */
    textModel: Maybe<ITextModel> = null

    /** set to true,
     *  - either when file is initially loaded from disk
     *  - or when file content is set programmatically for the first time
     * */
    ready: boolean = false

    /** initialize the buffer
     *  - load the file from disk if it exists
     *  - or create a new file with the default content if default content provided
     *  - or do nothing if file does not exist and no default content provided
     */
    init = async (def: Maybe<string>) => {
        console.log('[📁] loading', this.path)
        const exists = await fs.exists(this.path)
        if (exists) {
            const content = await fs.readTextFile(this.path)
            this.ready = true
            this.code = content
        } else if (def != null) {
            this.ready = true
            this.code = def
        }
        await this.ensureTextModel()
    }

    ensureTextModel = async () => {
        const monaco = await globalMonaco.promise
        if (!monaco) throw new Error('🔴 monaco is null')

        const uri = monaco.Uri.parse(this.monacoPath)
        let model = monaco.editor.getModel(uri)
        if (model) {
            console.log(`[📝] updating ${this.monacoPath}`)
            model.setValue(this.code)
        } else {
            console.log(`[📝] creating ${this.monacoPath}`)
            model = monaco.editor.createModel(this.code, 'typescript', uri)
        }
        this.textModel = model
    }

    code: string = ''

    /** internal path as needed for monaco engine */
    get monacoPath(): string {
        if (this.workspace.cushy.os === 'win32') return `file:///${this.path}`
        return `file://${this.path}`
    }

    // openPathInEditor = (): ITextModel | null => {
    //     const monaco = globalMonaco
    //     if (!monaco) throw new Error('monaco is null')
    //     const libURI = monaco.Uri.parse(this.monacoPath)
    //     return monaco.editor.getModel(libURI)
    // }

    /** initialize a buffer that may or may not exist on disk */
    initProgrammatically = async (value: Maybe<string>): Promise<boolean> => {
        if (value == null) return false
        console.log(`[📝] updating ${this.monacoPath} with ${value.length} chars`)
        this.code = value
        await this.ensureTextModel()
        await this.saveOnDisk()
        return true
    }

    udpateCodeFromEditor = (value: Maybe<string>) => {
        if (value == null) return console.log('❌ value is null; aborting')
        console.log(`[📝] updating ${this.monacoPath} with ${value.length} chars`)
        // if (this.textModel) this.textModel.setValue(value)
        this.code = value
        void this.saveOnDisk()
    }

    saveOnDisk = async () => {
        console.log('[📁] saving', this.path)
        const folder = await path.dirname(this.path)
        const folderExists = await fs.exists(folder)
        if (!folderExists) await fs.createDir(folder, { recursive: true })
        await fs.writeFile({ path: this.path, contents: this.code })
    }
}
