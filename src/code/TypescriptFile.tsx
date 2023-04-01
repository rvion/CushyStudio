import type { Maybe } from '../core/ComfyUtils'
import type { Workspace } from '../core/Workspace'
import type { ITextModel } from '../ui/TypescriptOptions'
import * as fs from '@tauri-apps/api/fs'
import { makeObservable, observable } from 'mobx'
import { globalMonaco } from '../ui/Monaco'
import { syncFile } from './syncFile'

type TypescriptFileOpts = {
    /** human readable */
    title: string
    diskPathTS: string
    diskPathJS?: Maybe<string>
    virtualPathTS: string
    defaultCodeWhenNoFile?: Maybe<string>
    codeOverwrite?: Maybe<string>
}

export class TypescriptFile {
    constructor(public workspace: Workspace, public conf: TypescriptFileOpts) {
        console.log({ opts: conf })
        if (!conf.virtualPathTS.endsWith('.ts')) throw new Error('❌ INVARIANT VIOLATION: typescript file does not end with .ts')
        makeObservable(this, { textModel: observable.ref })
        void this.init()
    }

    /** the monaco textmodel that should remains alive for typeschecking to work */
    textModel: Maybe<ITextModel> = null
    codeTS: string = ''
    codeJS: string = ''

    private resolvetextModelPromise!: (value: ITextModel) => void
    textModelPromise = new Promise<ITextModel>((resolve) => {
        this.resolvetextModelPromise = resolve
    })

    /** initialize the buffer
     *  - load the file from disk if it exists
     *  - or create a new file with the default content if default content provided
     *  - or do nothing if file does not exist and no default content provided
     */
    init = async () => {
        const opts = this.conf
        // 1. get code value
        console.log('[📁] loading', opts.diskPathTS)
        this.codeTS = opts.codeOverwrite
            ? opts.codeOverwrite
            : (await fs.exists(opts.diskPathTS))
            ? await fs.readTextFile(opts.diskPathTS)
            : opts.defaultCodeWhenNoFile != null
            ? opts.defaultCodeWhenNoFile
            : ''

        // 2. ensure model is created
        const monaco = await globalMonaco.promise
        const uri = monaco.Uri.parse(opts.virtualPathTS)
        let model = monaco.editor.getModel(uri)
        if (model) {
            console.log(`[📝] updating monaco model for ${opts.title}`)
            model.setValue(this.codeTS)
        } else {
            console.log(`[📝] creating monaco model for  ${opts.title}`)
            model = monaco.editor.createModel(this.codeTS, 'typescript', uri)
        }

        // 3. transpile if needed
        if (opts.diskPathJS) {
            this.codeJS = await globalMonaco.convertToJS(model)
        }
        this.textModel = model
        // model.onDidChangeContent(()) ❓
        this.resolvetextModelPromise(model)
        await this.syncWithDiskFile()
    }

    /** initialize a buffer that may or may not exist on disk */
    updateFromCodegen = async (value: Maybe<string>): Promise<boolean> => {
        if (value == null) return false
        const textModel = await this.textModelPromise
        textModel.setValue(value)
        this.codeTS = value
        this.codeJS = await globalMonaco.convertToJS(textModel)
        console.log(`[📝] updating ${this.conf.virtualPathTS} with ${value.length} chars`)
        // await this.ensureTextModel()
        await this.syncWithDiskFile()
        return true
    }

    udpateFromEditor = async (value: Maybe<string>) => {
        if (value == null) return console.log('❌ value is null; aborting')
        console.log(`[📝] updating ${this.conf.virtualPathTS} with ${value.length} chars`)
        if (this.textModel == null) throw new Error('❌ INVARIANT VIOLATION: textModel is null')
        this.codeTS = value
        this.codeJS = await globalMonaco.convertToJS(this.textModel!)
        await this.syncWithDiskFile()
    }

    syncWithDiskFile = async () => {
        // console.log('[📁] saving', this.diskPathTS)
        // ensure folder exists
        const diskPathTS = this.conf.diskPathTS
        await syncFile(diskPathTS, this.codeTS)
        if (this.conf.diskPathJS) await syncFile(diskPathTS, this.codeTS)
    }
}

// openPathInEditor = (): ITextModel | null => {
//     const monaco = globalMonaco
//     if (!monaco) throw new Error('monaco is null')
//     const libURI = monaco.Uri.parse(this.conf.virtualPathTS)
//     return monaco.editor.getModel(libURI)
// }
