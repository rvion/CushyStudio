import type { RunMode } from './ComfyGraph'
import type { Maybe } from './ComfyUtils'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { ComfyClient } from './ComfyClient'
import { ComfyGraph } from './ComfyGraph'
import { ComfyImporter } from './ComfyImporter'
import { ComfyPromptJSON } from './ComfyPrompt'
// import { ITreeNode } from './tree'

export class ComfyProject {
    static demoProjectIx = 1
    /** unique project id */
    id: string = nanoid()

    /** project name */
    name: string = 'Demo Project ' + ComfyProject.demoProjectIx++

    /** current  */
    focus: number = 0

    code: string = ''
    // script: ComfyScript = new ComfyScript(this)

    MAIN!: ComfyGraph

    static INIT = (client: ComfyClient) => {
        const project = new ComfyProject(client)
        project.MAIN = new ComfyGraph(project)
        // const graph = new ComfyGraph(project)
        // project.graphs.push(graph)
        return project
    }

    // get treeData(): ITreeNode {
    //     return {
    //         name: this.name,
    //         key: this.id,
    //         type: 'project',
    //         action: (
    //             <div style={{ marginLeft: 'auto' }}>
    //                 <button className='success' onClick={() => this.run()}>
    //                     Eval
    //                 </button>
    //                 <button className='success' onClick={() => this.run('real')}>
    //                     RUN
    //                 </button>
    //             </div>
    //         ),
    //         children: [
    //             //
    //             {
    //                 ...this.MAIN.treeData,
    //                 name: 'Name',
    //                 type: 'script',
    //                 action: (
    //                     <input
    //                         style={{ marginLeft: 'auto' }}
    //                         onClick={(ev) => ev.stopPropagation()}
    //                         onKeyUp={(ev) => ev.stopPropagation()}
    //                         onKeyDown={(ev) => ev.stopPropagation()}
    //                         type='text'
    //                         value={this.name}
    //                         onChange={(ev) => (this.name = ev.target.value)}
    //                     />
    //                 ),
    //             },
    //             { ...this.MAIN.treeData, name: 'Script', type: 'script', onClick: () => this.client.editor.openCODE() },
    //             ...this.graphs.map((x, i) => x.treeData(i)),
    //         ],
    //     }
    // }

    static FROM_JSON = (client: ComfyClient, json: ComfyPromptJSON) => {
        const project = new ComfyProject(client)
        project.MAIN = new ComfyGraph(project, json)
        const code = new ComfyImporter(client).convertFlowToCode(json)
        project.code = code
        return project
    }

    private constructor(public client: ComfyClient) {
        makeAutoObservable(this)
    }

    /** converts a ComfyPromptJSON into it's canonical normal-form script */
    static LoadFromComfyPromptJSON = (json: ComfyPromptJSON) => {
        throw new Error('🔴 not implemented yet')
    }

    graphs: ComfyGraph[] = []

    // 🔴 not the right abstraction anymore
    get currentGraph() { return this.graphs[this.focus] ?? this.MAIN } // prettier-ignore
    get currentOutputs() { return this.currentGraph.outputs } // prettier-ignore
    get schema() { return this.client.schema } // prettier-ignore

    /** * project running is not the same as graph running; TODO: explain */
    isRunning = false

    error: Maybe<string> = null
    // runningMode: RunMode = 'fake'
    run = async (mode: RunMode = 'fake'): Promise<boolean> => {
        this.graphs = []
        // if (this.isRunning) return false
        // this.runningMode = mode
        // if (mode === 'real') this.isRunning = true
        if (this.code == null) {
            console.log('❌', 'no code to run')
            // this.isRunning = false
            return false
        }
        // try {
        const finalCode = this.code.replace(`export {}`, '')
        const BUILD = new Function('C', `return (async() => { ${finalCode} })()`)
        const emptyGraph = new ComfyGraph(this)
        emptyGraph.runningMode = mode

        this.MAIN = emptyGraph
        await BUILD(emptyGraph)
        console.log('[✅] RUN SUCCESS')
        // this.isRunning = false
        return true
        // } catch (error) {
        //     console.log('❌', error)
        //     // this.isRunning = false
        //     return false
        // }
    }

    udpateCode = async (code: string) => {
        this.code = code
        // const script = new ComfyGraph(this)
        // const result = await script.EVAL(code, mode)
        // if (result) this.script = script
    }
}
