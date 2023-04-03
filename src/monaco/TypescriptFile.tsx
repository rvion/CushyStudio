import type { Maybe } from '../core/ComfyUtils'
import type { ITextModel } from '../ui/TypescriptOptions'

import { makeObservable, observable } from 'mobx'
import { RootFolder } from '../fs/RootFolder'
import { globalMonaco } from './Monaco'
import { MonacoPath, RelativePath } from '../fs/pathUtils'
import { logger } from '../logger/Logger'

export type TypescriptFileConf = {
    /** human readable title */
    title: string

    /** the relative path to the typescript file this should be kept in sync with */
    relativeTSFilePath: RelativePath

    /** the relative path to the javascript file this should be transpiled to */
    relativeJSFilePath?: Maybe<RelativePath>

    /** the language server internal file path */
    virtualPathTS: MonacoPath

    /** what we should initialize this file to if there is no file on disk */
    defaultCodeWhenNoFile?: Maybe<string>

    /** what we should overwrite the file to in any case
     * if set, will trigger a filesystem sync on creation
     */
    codeOverwrite?: Maybe<string>

    /** if true, file won't be able to be saved */
    isReadonly?: boolean
}

export class TypescriptFile {
    constructor(
        //
        public rootFolder: RootFolder,
        public conf: TypescriptFileConf,
    ) {
        // console.log({ opts: conf })
        // 1. ensure file properly ends with .ts
        if (!conf.virtualPathTS.endsWith('.ts')) {
            throw new Error('❌ INVARIANT VIOLATION: typescript file does not end with .ts')
        }

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

    private init = async () => {
        const opts = this.conf
        // 1. get code value
        console.log('[📁] loading', opts.relativeTSFilePath)

        this.codeTS = opts.codeOverwrite
            ? opts.codeOverwrite
            : (await this.rootFolder.readTextFile(opts.relativeTSFilePath)) ?? //
              opts.defaultCodeWhenNoFile ??
              ''

        // 2. ensure model is created
        const monaco = await globalMonaco.promise
        const uri = monaco.Uri.parse(opts.virtualPathTS)
        let model = monaco.editor.getModel(uri)
        if (model) {
            // console.log(`[📝] updating monaco model for ${opts.title}`)
            model.setValue(this.codeTS)
        } else {
            // console.log(`[📝] creating monaco model for ${opts.title}`)
            model = monaco.editor.createModel(this.codeTS, 'typescript', uri)
        }

        // 3. transpile if needed
        if (opts.relativeJSFilePath) {
            this.codeJS = await globalMonaco.convertToJS(model)
        }
        this.textModel = model
        // model.onDidChangeContent(()) ❓
        this.resolvetextModelPromise(model)
        if (opts.codeOverwrite) await this.syncWithDiskFile()
    }

    /** initialize a buffer that may or may not exist on disk */
    updateFromCodegen = async (value: Maybe<string>): Promise<boolean> => {
        if (value == null) return false
        const textModel = await this.textModelPromise
        textModel.setValue(value)
        this.codeTS = value
        this.codeJS = await globalMonaco.convertToJS(textModel)
        // console.log(`[📝] updating ${this.conf.virtualPathTS} with ${value.length} chars`)
        // await this.ensureTextModel()
        // await this.syncWithDiskFile()
        return true
    }

    udpateFromEditor = async (value: Maybe<string>) => {
        if (value == null) return console.log('❌ value is null; aborting')
        // console.log(`[📝] updating ${this.conf.virtualPathTS} with ${value.length} chars`)
        if (this.textModel == null) throw new Error('❌ INVARIANT VIOLATION: textModel is null')

        this.codeTS = value
        this.codeJS = await globalMonaco.convertToJS(this.textModel!)
        // await this.syncWithDiskFile()
    }

    syncWithDiskFile = async () => {
        const diskPathTS: RelativePath = this.conf.relativeTSFilePath
        const status = await this.rootFolder.writeTextFile(diskPathTS, this.codeTS)
        // if (status !== 'same')
        logger.info('💿', `${status} ${diskPathTS}`)
        const diskPathJS = this.conf.relativeJSFilePath
        if (diskPathJS) await this.rootFolder.writeTextFile(diskPathJS, this.codeJS)
    }
}

// openPathInEditor = (): ITextModel | null => {
//     const monaco = globalMonaco
//     if (!monaco) throw new Error('monaco is null')
//     const libURI = monaco.Uri.parse(this.conf.virtualPathTS)
//     return monaco.editor.getModel(libURI)
// }
