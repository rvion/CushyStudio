import type { RunMode } from './ComfyGraph'
import * as path from '@tauri-apps/api/path'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { Workspace } from './Workspace'
import { ComfyPromptJSON } from './ComfyPrompt'
import { Run } from './Run'
import { TypescriptFile } from '../code/TypescriptFile'
import { ComfyImporter } from '../importers/ComfyImporter'
import { logger } from '../logger/Logger'

/** Script */
export class Project {
    static __demoProjectIx = 1
    runCounter = 0

    /** unique project id */
    id: string = nanoid()

    /** folder where CushyStudio will save script informations */

    // save = async () => {
    //     const code = this.code
    //     // ensure folder exists
    //     await fs.createDir(this.folderPath, { recursive: true })
    //     // safe script as script.ts
    //     // const filePath = this.folderPath + path.sep + 'script.ts'
    //     // await fs.writeFile({ path: filePath, contents: code })
    //     // return success
    //     console.log('[📁] saved', filePath)
    // }

    duplicate = async () => {
        this.workspace.createProject(
            //
            this.folderName + '_copy_' + Date.now(),
            this.scriptBuffer.codeTS,
        )
    }

    focus = () => {
        this.workspace.focusedFile = this.scriptBuffer
        this.workspace.focusedProject = this
        this.workspace.workspaceConfigFile
        // this.workspace.layout.openEditorTab(this.scriptBuffer)
    }
    /** project name */

    /** list of all project runs */
    runs: Run[] = []

    /** last project run */
    get currentRun(): Run | null {
        return this.runs[0] ?? null
    }

    scriptBuffer: TypescriptFile
    folderName: string
    folderPath: string
    constructor(
        //
        public workspace: Workspace,
        public filePath: string,
        public fileName: string,
        initialCode = '',
    ) {
        this.folderName = fileName.replace(/\.ts$/, '')
        this.folderPath = this.workspace.folder + path.sep + 'aaa' + path.sep + this.folderName
        console.log('🔴', {
            filePath: this.filePath,
            fileName: this.fileName,
            folderName: this.folderName,
            folderPath: this.folderPath,
        })
        this.scriptBuffer = new TypescriptFile(this.workspace, {
            title: this.folderName,
            diskPathTS: this.filePath,
            diskPathJS: this.folderPath + path.sep + 'script.js',
            virtualPathTS: `file:///${this.fileName}`,
            defaultCodeWhenNoFile: initialCode,
        })
        makeAutoObservable(this)
    }

    /** convenient getter to retrive current client shcema */
    get schema() { return this.workspace.schema } // prettier-ignore

    static FROM_JSON = (client: Workspace, json: ComfyPromptJSON) => {
        const folderName = nanoid()
        const code = new ComfyImporter(client).convertFlowToCode(json)
        const project = new Project(client, folderName, code)
        // console.log('🔴', code)
        // script.udpateCode(code)
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
        this.workspace.focusedProject = this
        // ensure we have some code to run
        const codeJS = this.scriptBuffer.codeJS
        if (codeJS == null) {
            console.log('❌', 'no code to run')
            return false
        }
        // check if we're in "MOCK" mode
        const opts = mode === 'fake' ? { mock: true } : undefined
        const execution = new Run(this, opts)
        await execution.save()
        // write the code to a file
        this.runs.unshift(execution)

        // try {
        const ProjectScriptFn = new Function('WORKFLOW', codeJS)
        const graph = execution.graph

        // graph.runningMode = mode
        // this.MAIN = graph

        const WORKFLOW = (fn: any) => fn(graph)
        try {
            await ProjectScriptFn(WORKFLOW)
            console.log('[✅] RUN SUCCESS')
            // this.isRunning = false
            return true
        } catch (error) {
            console.log(error)
            logger.error('🌠', 'RUN FAILURE')
            return false
        }
        // } catch (error) {
        //     console.log('❌', error)
        //     // this.isRunning = false
        //     return false
        // }
    }
}
