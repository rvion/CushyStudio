import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { Maybe } from './ComfyUtils'

import * as WS from 'ws'

import { makeAutoObservable } from 'mobx'
import { toast } from 'react-toastify'
import { a__ } from '../ui/samples/a'
import { AutoSaver } from './AutoSaver'
import { WsMsg } from './ComfyAPI'
import { ComfyProject } from './ComfyProject'
import { ComfySchema } from './ComfySchema'
import { ComfyScriptEditor } from './ComfyScriptEditor'
import { getPngMetadata } from './getPngMetadata'

export type ComfyClientOptions = {
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
    editor: ComfyScriptEditor

    assets = new Map<string, boolean>()

    storageServerKey = 'comfy-server'
    getStoredServerKey = () => {}

    getConfig = () => ({
        serverIP: this.serverIP,
        serverPort: this.serverPort,
        spec: this.schema.spec,
    })
    autosaver = new AutoSaver('client', this.getConfig)

    // get treeData(): INodeExt[] {
    //     // const data = [
    //     //     { type: 'script', name: '', children: [1, 4, 9, 10, 11], id: 0, parent: null },
    //     //     { type: 'script', name: 'src', children: [2, 3], id: 1, parent: 0 },
    //     //     { type: 'script', name: 'index.js', id: 2, parent: 1 },
    //     //     { type: 'script', name: 'styles.css', id: 3, parent: 1 },
    //     //     { type: 'script', name: 'node_modules', children: [5, 7], id: 4, parent: 0 },
    //     //     { type: 'script', name: 'react-accessible-treeview', children: [6], id: 5, parent: 4 },
    //     //     { type: 'script', name: 'bundle.js', id: 6, parent: 5 },
    //     //     { type: 'script', name: 'react', children: [888], id: 7, parent: 4 },
    //     //     { type: 'script', name: 'bundle.js', id: 888, parent: 7 },
    //     //     { type: 'script', name: '.npmignore', id: 9, parent: 0 },
    //     //     { type: 'script', name: 'package.json', id: 10, parent: 0 },
    //     //     { type: 'script', name: 'webpack.config.js', id: 11, parent: 0 },
    //     // ]
    //     // return data
    //     return flattenTreeExt({
    //         name: 'root',
    //         type: 'root',
    //         children: [
    //             {
    //                 name: 'projects',
    //                 type: 'folder',
    //                 autoOpen: true,
    //                 // action: (
    //                 //     <div>
    //                 //         <button>add</button>
    //                 //     </div>
    //                 // ),
    //                 children: this.projects.map((x) => x.treeData),
    //             },
    //             {
    //                 name: 'Configuration',
    //                 type: 'config',
    //                 children: [
    //                     {
    //                         name: 'IP',
    //                         type: 'config',
    //                         action: (
    //                             <input
    //                                 style={{ marginLeft: 'auto' }}
    //                                 onClick={(ev) => ev.stopPropagation()}
    //                                 onKeyUp={(ev) => ev.stopPropagation()}
    //                                 onKeyDown={(ev) => ev.stopPropagation()}
    //                                 type='text'
    //                                 value={this.serverIP}
    //                                 onChange={(ev) => (this.serverIP = ev.target.value)}
    //                             />
    //                         ),
    //                     },
    //                     {
    //                         name: 'Port',
    //                         type: 'config',
    //                         action: (
    //                             <input
    //                                 style={{ marginLeft: 'auto' }}
    //                                 type='number'
    //                                 onClick={(ev) => ev.stopPropagation()}
    //                                 onKeyUp={(ev) => ev.stopPropagation()}
    //                                 onKeyDown={(ev) => ev.stopPropagation()}
    //                                 value={this.serverPort}
    //                                 onChange={(ev) => (this.serverPort = parseInt(ev.target.value, 10))}
    //                             />
    //                         ),
    //                     },
    //                     {
    //                         name: 'websocket',
    //                         type: 'script',
    //                         action: (
    //                             <div style={{ marginLeft: 'auto' }}>
    //                                 {/* {this.wsStatus} */}
    //                                 <button onClick={this.startWSClient}>UPDATE</button>
    //                                 {this.wsStatusEmoji}
    //                             </div>
    //                         ),
    //                     },
    //                     {
    //                         name: 'schema',
    //                         type: 'config',
    //                         action: (
    //                             <div style={{ marginLeft: 'auto' }}>
    //                                 {this.schema.nodes.length} nodes;
    //                                 <button onClick={this.fetchObjectsSchema}>UPADTE</button>
    //                                 {this.schemaStatusEmoji}
    //                             </div>
    //                         ),
    //                     },
    //                     { name: 'sdk', type: 'script', onClick: this.editor.openSDK },
    //                     { name: 'lib', type: 'script', onClick: this.editor.openLib },
    //                 ],
    //             },

    //             {
    //                 name: 'GUI',
    //                 type: 'client',
    //                 children: [{ name: 'monaco', type: 'config', action: <button>open</button> }],
    //             },
    //         ],
    //     })
    // }

    constructor(opts: ComfyClientOptions) {
        const prev = this.autosaver.load()
        if (prev) Object.assign(opts, prev)
        this.autosaver.start()
        this.serverIP = opts.serverIP
        this.serverPort = opts.serverPort
        this.editor = new ComfyScriptEditor(this)
        this.schema = new ComfySchema(opts.spec)
        this.project = ComfyProject.INIT(this)
        this.projects.push(this.project)
        this.projects.push(ComfyProject.INIT(this))
        this.dts = this.schema.codegenDTS()
        this.startWSClient()
        makeAutoObservable(this)
        setTimeout(async () => {
            await this.fetchObjectsSchema()
            this.editor.openCODE()
            this.project.run()
        }, 500)
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
        // console.log('🟢 schema:', this.schema.nodes)
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
        this.editor.updateSDKDTS()
        this.editor.updateLibDTS()
        this.editor.updateCODE(a__)
        this.project.udpateCode(a__)
        // console.log('🟢 schema:', this.schema.nodes)
        return schema$
    }
    static Init = () => {}

    // TODO: finish this
    get wsStatusTxt() {
        if (this.ws == null) return 'not initialized'
        if (this.ws?.readyState === WebSocket.OPEN) return 'connected'
        if (this.ws?.readyState === WebSocket.CLOSED) return 'disconnected'
        return 'connecting'
    }
    wsStatus: 'on' | 'off' = 'off'
    get wsStatusEmoji() {
        if (this.wsStatus === 'on') return '🟢'
        if (this.wsStatus === 'off') return '🔴'
        return '❓'
    }

    get schemaStatusEmoji() {
        if (this.schema.nodes.length > 10) return '🟢'
        return '🔴'
    }

    get dtsStatusEmoji() {
        if (this.dts.length > 10_000) return '🟢'
        return '🔴'
    }

    sid: string = 'temporary'
    ws: Maybe<WS.WebSocket | WebSocket> = null
    startWSClient = () => {
        if (this.ws) {
            if (this.ws?.readyState === WebSocket.OPEN) this.ws.close()
            this.wsStatus = 'off'
        }
        const ws =
            typeof window !== 'undefined'
                ? new WebSocket(`ws://${this.serverHost}/ws`)
                : new WS.WebSocket(`ws://${this.serverHost}/ws`)
        ws.binaryType = 'arraybuffer'
        ws.onopen = () => {
            console.log('[👢] connected')
            this.wsStatus = 'on'
        }
        ws.onmessage = (e: WS.MessageEvent) => {
            const msg: WsMsg = JSON.parse(e.data as any)
            console.log(`[🐰] %c${msg.type} %c${JSON.stringify(msg.data)}`, 'color:#90bdff', 'color:gray')
            // 🔴 ROUTING must be done at the API level
            if (msg.type === 'status') {
                if (msg.data.sid) this.sid = msg.data.sid
                return this.project.currentGraph.onStatus(msg)
            }
            if (msg.type === 'progress') return this.project.currentGraph.onProgress(msg)
            if (msg.type === 'executing') return this.project.currentGraph.onExecuting(msg)
            if (msg.type === 'executed') return this.project.currentGraph.onExecuted(msg)
            throw new Error('Unknown message type: ' + msg)
        }
        this.ws = ws
    }

    notify = (msg: string) => toast(msg)

    /** Loads workflow data from the specified file */
    async handleFile(file: File) {
        if (file.type === 'image/png') {
            const pngInfo = await getPngMetadata(this, file)
            console.log(pngInfo)
            if (pngInfo && pngInfo.prompt) {
                const data = JSON.parse(pngInfo.prompt)
                console.log(data)
                const project = ComfyProject.FROM_JSON(this, data)
                this.projects.push(project)
                this.project = project
                this.editor.updateCODE(project.code)
                this.project.udpateCode(project.code)
            }
        }
        // else if (file.type === 'application/json' || file.name.endsWith('.json')) {
        //     const reader = new FileReader()
        //     reader.onload = () => {
        //         this.loadGraphData(JSON.parse(reader.result))
        //     }
        //     reader.readAsText(file)
        // } else {
        // }
    }
}
