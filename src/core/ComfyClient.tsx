import * as WS from 'ws'

import { makeAutoObservable, observable } from 'mobx'
import { WsMsg } from './ComfyAPI'
import { ComfyProject } from './ComfyProject'
import { ComfySchema } from './ComfySchema'
import { ComfySchemaJSON } from './ComfySchemaJSON'
import { Monaco } from '@monaco-editor/react'
import { TypescriptOptions, IStandaloneCodeEditor, ITextModel } from '../ui/TypescriptOptions'

export type ComfyManagerOptions = {
    serverIP: string
    serverPort: number
    spec: ComfySchemaJSON
}

/**
 * global State
 *  - manages connection to the backend
 *  - manages list of known / open projects
 *  - dispatches messages to the right projects
 */
export class ComfyClient {
    serverIP: string
    serverPort: number
    schema: ComfySchema
    dts: string
    project: ComfyProject
    projects: ComfyProject[] = []
    // dtsModel?: ITextModel

    setupMonaco(monaco: Monaco) {
        if (this.monacoRef.current === monaco) return
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

    updateSchema = (monaco: Monaco) => {
        // monaco.languages.typescript.typescriptDefaults.addExtraLib(this.dts, 'global.d.ts')
        // monaco.languages.typescript.typescriptDefaults.addExtraLib(this.dts, 'global.d.ts')
        if (!this.editorRef.current) throw new Error('editorRef.current is null')

        const fakeDTSUri = monaco.Uri.parse(`file:///global.d.ts`)
        let fakeDTSmodel = monaco.editor.getModel(fakeDTSUri)
        if (fakeDTSmodel) {
            console.log('🟢 updating fake global.d.ts')
            fakeDTSmodel.setValue(this.dts)
        } else {
            console.log('🟢 creating fake global.d.ts')
            fakeDTSmodel = monaco.editor.createModel(this.dts, 'typescript', fakeDTSUri)
        }
        const knownURIs = monaco.editor.getModels().map((i) => i.uri)
        console.log('🟢', knownURIs)
        const globalDTSModel = monaco.editor.getModel(monaco.Uri.parse(`file:///global.d.ts`))
        this.editorRef.current.setModel(globalDTSModel)
        // this.dtsModel = model
    }

    openProject = () => {
        const monaco = this.monacoRef.current
        if (monaco == null) return console.log('🔴 monaco not ready')

        // // for (const file of Object.values(virtualFilesystem)) {
        // const uri = monaco.Uri.parse(`file:///${file.name}`)
        // const model = monaco.editor.createModel(file.value, 'typescript', uri)
        // // }
        // const aModel = monaco.editor.getModel(monaco.Uri.parse(`file:///a.ts`))
        // // st.file = aModel
        // client.project.udpateCode(virtualFilesystem['a.ts'].value)
    }

    editorRef = observable({ current: null as IStandaloneCodeEditor | null }, { current: observable.ref })
    monacoRef = observable({ current: null as Monaco | null }, { current: observable.ref })

    constructor(opts: ComfyManagerOptions) {
        this.serverIP = opts.serverIP
        this.serverPort = opts.serverPort
        this.schema = new ComfySchema(opts.spec)
        this.project = ComfyProject.INIT(this)
        this.projects.push(this.project)
        this.dts = this.schema.codegenDTS()
        this.startWSClient()
        makeAutoObservable(this)
    }

    get serverHost() {
        return `${this.serverIP}:${this.serverPort}`
    }

    fetchPrompHistory = async () => {
        const x = await fetch(`http://${this.serverHost}/history`, {}).then((x) => x.json())
        return x
    }

    /** retri e the comfy spec from the schema*/
    fetchObjectsSchema2 = async (): Promise<ComfySchemaJSON> => {
        const base = window.location.href
        const res = await fetch(`${base}/object_infos.json`, {})
        const schema$: ComfySchemaJSON = await res.json()
        // console.log('🟢 schema$:', schema$)
        this.schema.update(schema$)
        console.log('🟢 schema:', this.schema.nodes)
        return schema$
    }

    /** retri e the comfy spec from the schema*/
    fetchObjectsSchema = async (): Promise<ComfySchemaJSON> => {
        // 1. fetch schema$
        const timeoutController = new AbortController()
        const timeoutID = setTimeout(() => timeoutController.abort(), 2000)
        const url = `http://${this.serverHost}/object_info`
        const res = await fetch(url, { signal: timeoutController.signal })
        clearTimeout(timeoutID)
        const schema$: ComfySchemaJSON = await res.json()
        // 2. update schmea
        this.schema.update(schema$)
        // 3. update dts
        this.dts = this.schema.codegenDTS()
        // 4. update monaco
        this.updateSchema(this.monacoRef.current!)

        console.log('🟢 schema:', this.schema.nodes)
        return schema$
    }
    static Init = () => {}

    wsStatus = 'disconnected'
    get wsStatusEmoji() {
        if (this.wsStatus === 'connected') return '🟢'
        if (this.wsStatus === 'disconnected') return '🔴'
        return '❓'
    }

    get schemaStatusEmoji() {
        if (this.schema.nodes.length > 10) return '🟢'
        return '🔴'
    }

    startWSClient = () => {
        const ws =
            typeof window !== 'undefined'
                ? new WebSocket(`ws://${this.serverHost}/ws`)
                : new WS.WebSocket(`ws://${this.serverHost}/ws`)
        ws.binaryType = 'arraybuffer'
        ws.onopen = () => {
            console.log('connected')
            this.wsStatus = 'connected'
        }
        ws.onmessage = (e: WS.MessageEvent) => {
            const msg: WsMsg = JSON.parse(e.data as any)
            console.log('>>', JSON.stringify(msg))
            // 🔴 ROUTING must be done at the API level
            if (msg.type === 'status') return this.project.currentGraph.onStatus(msg)
            if (msg.type === 'progress') return this.project.currentGraph.onProgress(msg)
            if (msg.type === 'executing') return this.project.currentGraph.onExecuting(msg)
            if (msg.type === 'executed') return this.project.currentGraph.onExecuted(msg)
            throw new Error('Unknown message type: ' + msg)
        }
    }
}
