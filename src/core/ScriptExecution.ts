import type { ComfyProject } from './ComfyProject'

import { ScriptStep_prompt } from './ScriptStep_prompt'
import { deepCopyNaive } from './ComfyUtils'
import { ComfyGraph } from './ComfyGraph'
import { ApiPromptInput, WsMsgExecuted } from './ComfyAPI'
import { ScriptStep_Init } from './ScriptStep_Init'
import { ScriptStep_askBoolean } from './ScriptStep_ask'
import { ScriptStep } from './ScriptStep'
import { makeAutoObservable } from 'mobx'

/** script runtime context */
export class ScriptExecution {
    /** the main graph that will be updated along the script execution */
    graph: ComfyGraph

    constructor(
        //
        public project: ComfyProject,
        public opts?: { mock?: boolean },
    ) {
        this.graph = new ComfyGraph(this.project, this)
        makeAutoObservable(this)
    }

    steps: ScriptStep[] = [new ScriptStep_Init()]

    /** current step */
    get step(): ScriptStep {
        return this.steps[this.steps.length - 1]
    }

    askBoolean = (msg: string) => {
        const ask = new ScriptStep_askBoolean(msg)
        this.steps.push(ask)
        return ask
    }

    /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
    outputs: WsMsgExecuted[] = []

    sendPromp = (): ScriptStep_prompt => {
        const currentJSON = deepCopyNaive(this.graph.json)
        console.log('[🪜] checkpoint', currentJSON)
        const step = new ScriptStep_prompt(this, currentJSON)
        this.steps.push(step)

        // if we're note really running prompts, just resolve the step and continue
        if (this.opts?.mock) {
            step._resolve!(step)
            return step
        }

        // 🔴 TODO: store the whole project in the prompt
        const out: ApiPromptInput = {
            client_id: this.project.client.sid,
            extra_data: { extra_pnginfo: { it: 'works' } },
            prompt: currentJSON,
        }

        // 🔶 not waiting here, because output comes back from somewhere else
        // TODO: but we may want to catch error here to fail early
        // otherwise, we might get stuck
        const res = void fetch(`http://${this.project.client.serverHost}/prompt`, {
            method: 'POST',
            body: JSON.stringify(out),
        })

        // await sleep(1000)
        return step
    }

    ctx = {}
}
