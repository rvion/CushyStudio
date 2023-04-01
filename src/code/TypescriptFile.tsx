import type { Maybe } from '../core/ComfyUtils'
import type { Workspace } from '../core/Workspace'
import type { ITextModel } from '../ui/TypescriptOptions'

import * as fs from '@tauri-apps/api/fs'
import { makeObservable, observable } from 'mobx'
import { globalMonaco } from '../ui/Monaco'
import { MonacoPath, WorkspaceRelativePath } from '../utils/pathUtils'

type TypescriptFileOpts = {
    /** human readable title */
    title: string

    /** the relative path to the typescript file this should be kept in sync with */
    workspaceRelativeTSFilePath: WorkspaceRelativePath

    /** the relative path to the javascript file this should be transpiled to */
    workspaceRelativeJSFilePath?: Maybe<WorkspaceRelativePath>

    /** the language server internal file path */
    virtualPathTS: MonacoPath

    /** what we should initialize this file to if there is no file on disk */
    defaultCodeWhenNoFile?: Maybe<string>

    /** what we should overwrite the file to in any case */
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
        console.log('[📁] loading', opts.workspaceRelativeTSFilePath)
        this.codeTS = opts.codeOverwrite
            ? opts.codeOverwrite
            : (await fs.exists(opts.workspaceRelativeTSFilePath))
            ? await fs.readTextFile(opts.workspaceRelativeTSFilePath)
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
        if (opts.workspaceRelativeJSFilePath) {
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
        const diskPathTS: WorkspaceRelativePath = this.conf.workspaceRelativeTSFilePath
        console.log(this.conf.workspaceRelativeTSFilePath)
        await this.workspace.writeTextFile(diskPathTS, this.codeTS)
        const diskPathJS = this.conf.workspaceRelativeJSFilePath
        if (diskPathJS) await this.workspace.writeTextFile(diskPathJS, this.codeJS)
    }
}

// openPathInEditor = (): ITextModel | null => {
//     const monaco = globalMonaco
//     if (!monaco) throw new Error('monaco is null')
//     const libURI = monaco.Uri.parse(this.conf.virtualPathTS)
//     return monaco.editor.getModel(libURI)
// }
