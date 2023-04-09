// import { makeAutoObservable } from 'mobx'
// import * as path from 'path'
// import * as vscode from 'vscode'
// import { ComfyImporter } from '../importers/ImportComfyImage'
// import { ComfyPromptJSON } from './ComfyPrompt'
// import { Run } from './Run'
// import { Workspace } from './Workspace'

// /** Script */
// export class Project {
//     static __demoProjectIx = 1
//     runCounter = 0

//     /** list of all project runs */
//     runs: Run[] = []

//     /** last project run */
//     get currentRun(): Run | null {
//         return this.runs[0] ?? null
//     }

//     // scriptBuffer: TypescriptFile
//     name: string
//     workspaceRelativeCacheFolder: vscode.Uri

//     constructor(public workspace: Workspace, public uri: vscode.Uri) {
//         this.name = path.basename(uri.path)
//         this.workspaceRelativeCacheFolder = this.workspace.resolve(path.join('.cache', this.uri.path))
//         makeAutoObservable(this)
//     }

//     /** convenient getter to retrive current client shcema */
//     get schema() { return this.workspace.schema } // prettier-ignore

//     static FROM_JSON = (workspace: Workspace, name: string, json: ComfyPromptJSON) => {
//         const code = new ComfyImporter(workspace).convertFlowToCode(json)
//         const fileName = name.endsWith('.ts') ? name : `${name}.ts`
//         const uri = workspace.resolve(fileName)
//         workspace.writeTextFile(uri, code, true)
//         const project = new Project(workspace, uri)
//         return project
//     }

//     /** converts a ComfyPromptJSON into it's canonical normal-form script */
//     static LoadFromComfyPromptJSON = (_json: ComfyPromptJSON) => {
//         throw new Error('🔴 not implemented yet')
//     }

//     // graphs: ComfyGraph[] = []

//     // 🔴 not the right abstraction anymore
//     // get currentGraph() { return this.graphs[this.focus] ?? this.MAIN } // prettier-ignore
//     // get currentOutputs() { return this.currentGraph.outputs } // prettier-ignore

//     /** * project running is not the same as graph running; TODO: explain */
//     isRunning = false

//     // runningMode: RunMode = 'fake'
//     // RUN = async (mode: RunMode = 'fake'): Promise<boolean> => {
//     //     this.workspace.focusedProject = this
//     //     // ensure we have some code to run

//     //     // this.scriptBuffer.codeJS
//     //     // get the content of the current editor
//     //     const codeTS = vscode.window.activeTextEditor?.document.getText() ?? ''

//     //     const codeJS = await transpileCode()
//     //     if (codeJS == null) {
//     //         console.log('❌', 'no code to run')
//     //         return false
//     //     }
//     //     // check if we're in "MOCK" mode
//     //     const opts = mode === 'fake' ? { mock: true } : undefined
//     //     const execution = new Run(this, opts)
//     //     await execution.save()
//     //     // write the code to a file
//     //     this.runs.unshift(execution)

//     //     // try {
//     //     const ProjectScriptFn = new Function('WORKFLOW', codeJS)
//     //     const graph = execution.graph

//     //     // graph.runningMode = mode
//     //     // this.MAIN = graph

//     //     const WORKFLOW = (fn: any) => fn(graph)

//     //     try {
//     //         await ProjectScriptFn(WORKFLOW)
//     //         console.log('[✅] RUN SUCCESS')
//     //         // this.isRunning = false
//     //         return true
//     //     } catch (error) {
//     //         console.log(error)
//     //         logger.error('🌠', 'RUN FAILURE')
//     //         return false
//     //     }
//     // }
// }
