import type { Maybe } from '../core/ComfyUtils'
import type { Workspace } from '../core/Workspace'
import type { ITextModel } from '../ui/TypescriptOptions'
import * as path from '@tauri-apps/api/path'
import * as fs from '@tauri-apps/api/fs'
import { makeObservable, observable } from 'mobx'
import { globalMonaco } from '../ui/Monaco'

export class TypescriptFile {
    public title: string

    public pathTS: string
    public pathJS: string

    constructor(
        //
        public workspace: Workspace,
        opts: {
            title: string
            path: string
            def: Maybe<string>
        },
    ) {
        if (!opts.path.endsWith('.ts')) throw new Error('❌ INVARIANT VIOLATION')

        this.title = opts.title
        this.pathTS = opts.path
        this.pathJS = opts.path.replace(/\.ts$/, '.js')
        makeObservable(this, {
            ready: observable,
            textModel: observable.ref,
        })
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
        console.log('[📁] loading', this.pathTS)
        const exists = await fs.exists(this.pathTS)
        if (exists) {
            const content = await fs.readTextFile(this.pathTS)
            this.ready = true
            this.codeTS = content
        } else if (def != null) {
            this.ready = true
            this.codeTS = def
        }
        const model = await this.ensureTextModel()
        this.codeJS = await globalMonaco.convertToJS(model)
        await this.saveOnDisk()
    }

    ensureTextModel = async () => {
        const monaco = await globalMonaco.promise
        const uri = monaco.Uri.parse(this.monacoPath)
        let model = monaco.editor.getModel(uri)
        if (model) {
            console.log(`[📝] updating ${this.monacoPath}`)
            model.setValue(this.codeTS)
        } else {
            console.log(`[📝] creating ${this.monacoPath}`)
            model = monaco.editor.createModel(this.codeTS, 'typescript', uri)
        }
        this.textModel = model
        return model
    }

    codeTS: string = ''
    codeJS: string = ''

    /** internal path as needed for monaco engine */
    get monacoPath(): string {
        if (this.workspace.cushy.os === 'win32') return `file:///${this.pathTS}`
        return `file://${this.pathTS}`
    }

    // openPathInEditor = (): ITextModel | null => {
    //     const monaco = globalMonaco
    //     if (!monaco) throw new Error('monaco is null')
    //     const libURI = monaco.Uri.parse(this.monacoPath)
    //     return monaco.editor.getModel(libURI)
    // }

    /** initialize a buffer that may or may not exist on disk */
    updateFromCodegen = async (value: Maybe<string>): Promise<boolean> => {
        if (value == null) return false
        console.log(`[📝] updating ${this.monacoPath} with ${value.length} chars`)
        this.codeTS = value
        await this.ensureTextModel()
        await this.saveOnDisk()
        return true
    }

    udpateFromEditor = async (value: Maybe<string>) => {
        if (value == null) return console.log('❌ value is null; aborting')
        console.log(`[📝] updating ${this.monacoPath} with ${value.length} chars`)
        // if (this.textModel) this.textModel.setValue(value)
        this.codeTS = value
        this.codeJS = await globalMonaco.convertToJS(this.textModel!)
        await this.saveOnDisk()
    }

    saveOnDisk = async () => {
        console.log('[📁] saving', this.pathTS)
        // ensure folder exists
        const folder = await path.dirname(this.pathTS)
        const folderExists = await fs.exists(folder)
        if (!folderExists) await fs.createDir(folder, { recursive: true })

        // check if content same
        const prev = await fs.readTextFile(this.pathTS)
        if (prev != this.codeTS) {
            await fs.writeFile({ path: this.pathTS, contents: this.codeTS })
            await fs.writeFile({ path: this.pathJS, contents: this.codeJS })
        }
    }
}
