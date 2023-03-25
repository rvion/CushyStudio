import type { RunMode } from './ComfyGraph'
import * as path from '@tauri-apps/api/path'
import * as fs from '@tauri-apps/api/fs'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { Workspace } from './Workspace'
import { ComfyImporter } from './ComfyImporter'
import { ComfyPromptJSON } from './ComfyPrompt'
import { CSRun } from './CSRun'

/** Script */
export class CSScript {
    static __demoProjectIx = 1
    runCounter = 0

    /** unique project id */
    id: string = nanoid()

    /** folder where CushyStudio will save script informations */
    get folderPath(): string {
        return this.workspace.folder + path.sep + this.folderName
    }

    save = async () => {
        const code = this.code
        // ensure folder exists
        await fs.createDir(this.folderPath, { recursive: true })
        // safe script as script.cushy
        const filePath = this.folderPath + path.sep + 'script.cushy'
        await fs.writeFile({ path: filePath, contents: code })
        // return success
        console.log('[📁] saved', filePath)
    }

    /** project name */

    /** list of all project runs */
    runs: CSRun[] = []

    /** last project run */
    get currentRun(): CSRun | null {
        return this.runs[0] ?? null
    }

    constructor(
        //
        public workspace: Workspace,
        public folderName: string,
    ) {
        makeAutoObservable(this)
    }

    /** convenient getter to retrive current client shcema */
    get schema() { return this.workspace.schema } // prettier-ignore

    code: string = ''

    udpateCode = async (code: string) => {
        this.code = code
    }

    static FROM_JSON = (client: Workspace, json: ComfyPromptJSON) => {
        const folderName = nanoid()
        const project = new CSScript(client, folderName)
        const code = new ComfyImporter(client).convertFlowToCode(json)
        project.code = code
        return project
    }

    /** converts a ComfyPromptJSON into it's canonical normal-form script */
    static LoadFromComfyPromptJSON = (_json: ComfyPromptJSON) => {
        throw new Error('🔴 not implemented yet')
    }

    // graphs: ComfyGraph[] = []

    // 🔴 not the right abstraction anymore
    // get currentGraph() { return this.graphs[this.focus] ?? this.MAIN } // prettier-ignore
    // get currentOutputs() { return this.currentGraph.outputs } // prettier-ignore

    /** * project running is not the same as graph running; TODO: explain */
    isRunning = false

    // runningMode: RunMode = 'fake'
    RUN = async (mode: RunMode = 'fake'): Promise<boolean> => {
        // ensure we have some code to run
        if (this.code == null) {
            console.log('❌', 'no code to run')
            return false
        }
        // check if we're in "MOCK" mode
        const opts = mode === 'fake' ? { mock: true } : undefined
        const execution = new CSRun(this, opts)
        await execution.save()
        // write the code to a file
        this.runs.unshift(execution)

        // try {
        const finalCode = this.code.replace(`export {}`, '')
        const ProjectScriptFn = new Function('C', `return (async() => { ${finalCode} })()`)
        const graph = execution.graph

        // graph.runningMode = mode
        // this.MAIN = graph

        await ProjectScriptFn(graph)
        console.log('[✅] RUN SUCCESS')
        // this.isRunning = false
        return true
        // } catch (error) {
        //     console.log('❌', error)
        //     // this.isRunning = false
        //     return false
        // }
    }
}
