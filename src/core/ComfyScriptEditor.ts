import type { IStandaloneCodeEditor, ITextModel } from '../ui/TypescriptOptions'

import { autorun, makeAutoObservable, observable, reaction } from 'mobx'
import { globalMonaco } from '../ui/Monaco'
import { c__ } from '../ui/samples/c'
import { ComfyClient } from './ComfyClient'

export class ComfyScriptEditor {
    constructor(public client: ComfyClient) {
        makeAutoObservable(this)
        autorun(() => {
            if (this.editorRef.current && this.curr) {
                console.log('autorun updating')
                this.editorRef.current.setModel(this.curr)
            }
        })
    }

    editorRef = observable({ current: null as IStandaloneCodeEditor | null }, { current: observable.ref })
    // monacoRef = observable({ current: null as Monaco | null }, { current: observable.ref })
    // monaco.languages.typescript.typescriptDefaults.addExtraLib(c__, 'base.d.ts')
    // monaco.languages.typescript.typescriptDefaults.addExtraLib(this.dts, 'global.d.ts')

    private sdk_path = `file:///core/sdk.d.ts`
    private lib_path = `file:///core/global.d.ts`
    private CODE_path = `file:///TEMP.ts`

    updateSDKDTS = () => this.updateFile(this.sdk_path, c__)
    updateLibDTS = () => this.updateFile(this.lib_path, this.client.dts)
    updateCODE = (code: string) => this.updateFile(this.CODE_path, code)

    updateFile = (path: string, content: string) => {
        const monaco = globalMonaco
        if (!monaco) throw new Error('🔴 monaco is null')

        const uri = monaco.Uri.parse(path)
        let model = monaco.editor.getModel(uri)
        if (model) {
            console.log(`[🔵] updating ${path}`)
            model.setValue(content)
        } else {
            console.log(`[🔵] creating ${path}`)
            model = monaco.editor.createModel(content, 'typescript', uri)
        }

        // if (!this.editorRef.current) throw new Error('editorRef.current is null')
        // this.editorRef.current.setModel(libModel)
        // const knownURIs = monaco.editor.getModels().map((i) => i.uri)
        // console.log('🟢', knownURIs)
        // const globalDTSModel = monaco.editor.getModel(monaco.Uri.parse(`file:///global.d.ts`))
        // this.dtsModel = model
    }

    openLib = () => this.openPathInEditor(this.lib_path)
    openSDK = () => this.openPathInEditor(this.sdk_path)
    openCODE = () => this.openPathInEditor(this.CODE_path)

    curr: ITextModel | null = null
    openPathInEditor = (path: string) => {
        const monaco = globalMonaco
        if (!monaco) throw new Error('monaco is null')
        const libURI = monaco.Uri.parse(path)
        const libModel = monaco.editor.getModel(libURI)
        this.curr = libModel

        // const editor = this.editorRef.current
        // if (editor) editor.setModel(libModel)
    }

    hasLib = () => this.hasModel(this.lib_path)
    hasSDK = () => this.hasModel(this.sdk_path)
    hasCODE = () => this.hasModel(this.CODE_path)
    hasModel = (path: string) => {
        const monaco = globalMonaco
        if (!monaco) return null
        // if (!monaco) throw new Error('monaco is null')
        const libURI = monaco.Uri.parse(path)
        const libModel = monaco.editor.getModel(libURI)
        if (libModel == null) return false
        return true
    }
}
