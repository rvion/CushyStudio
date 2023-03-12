import type { IStandaloneCodeEditor, TypescriptOptions } from '../ui/TypescriptOptions'

import type { Monaco } from '@monaco-editor/react'
import { makeAutoObservable, observable } from 'mobx'
import { c__ } from '../ui/samples/c'
import { ComfyClient } from './ComfyClient'

export class ComfyScriptEditor {
    constructor(public client: ComfyClient) {
        makeAutoObservable(this)
    }

    editorRef = observable({ current: null as IStandaloneCodeEditor | null }, { current: observable.ref })
    monacoRef = observable({ current: null as Monaco | null }, { current: observable.ref })

    setupMonaco(monaco: Monaco) {
        if (this.monacoRef.current === monaco) return
        console.log('🟢 setup Monaco')
        this.monacoRef.current = monaco
        const compilerOptions: TypescriptOptions = {
            strict: true,
            module: monaco.languages.typescript.ModuleKind.ESNext,
            target: monaco.languages.typescript.ScriptTarget.ESNext,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        }
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions)
        console.log('using typescript:', monaco.languages.typescript.typescriptVersion)
    }

    // monaco.languages.typescript.typescriptDefaults.addExtraLib(c__, 'base.d.ts')
    // monaco.languages.typescript.typescriptDefaults.addExtraLib(this.dts, 'global.d.ts')

    private sdk_path = `file:///core/sdk.d.ts`
    private lib_path = `file:///core/global.d.ts`
    private CODE_path = `file:///TEMP.ts`

    updateSDKDTS = () => this.updateFile(this.sdk_path, c__)
    updateLibDTS = () => this.updateFile(this.lib_path, this.client.dts)
    updateCODE = (code: string) => this.updateFile(this.CODE_path, code)

    updateFile = (path: string, content: string) => {
        const monaco = this.monacoRef.current
        if (!monaco) throw new Error('🔴 monaco is null')

        const uri = monaco.Uri.parse(path)
        let model = monaco.editor.getModel(uri)
        if (model) {
            console.log(`🟢 updating ${path} global.d.ts`)
            model.setValue(content)
        } else {
            console.log('🟢 creating fake global.d.ts')
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

    openPathInEditor = (path: string) => {
        const monaco = this.monacoRef.current
        if (!monaco) throw new Error('monaco is null')
        const libURI = monaco.Uri.parse(path)
        const libModel = monaco.editor.getModel(libURI)

        const editor = this.editorRef.current
        if (!editor) throw new Error('editor is null')
        editor.setModel(libModel)
    }
}
