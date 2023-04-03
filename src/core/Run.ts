import type { Project } from './Project'

import { Body, fetch } from '@tauri-apps/api/http'
import * as path from '@tauri-apps/api/path'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { Cyto } from '../graph/cyto'
import { asRelativePath, RelativePath } from '../fs/pathUtils'
import { getYYYYMMDDHHMMSS } from '../utils/timestamps'
import { ApiPromptInput, WsMsgExecuted } from './ComfyAPI'
import { Graph } from './Graph'
import { deepCopyNaive, Maybe } from './ComfyUtils'
import { PromptOutputImage } from './PromptOutputImage'
import { ScriptStep } from './ScriptStep'
import { ScriptStep_askBoolean, ScriptStep_askString } from './ScriptStep_ask'
import { ScriptStep_Init } from './ScriptStep_Init'
import { ScriptStep_prompt } from './ScriptStep_prompt'

/** script exeuction instance */
export class Run {
    /** creation "timestamp" in YYYYMMDDHHMMSS format */
    createdAt = getYYYYMMDDHHMMSS()

    /** unique run id */
    uid = nanoid()

    /** human readable folder name */
    name: string

    /** the main graph that will be updated along the script execution */
    graph: Graph

    /** graph engine instance for smooth and clever auto-layout algorithms */
    cyto: Cyto

    /** list of all images produed over the whole script execution */
    gallery: PromptOutputImage[] = []

    /** folder where CushyStudio will save run informations */
    get workspaceRelativeCacheFolderPath(): RelativePath {
        return asRelativePath(this.project.workspaceRelativeCacheFolder + path.sep + this.name)
    }

    /** save current script */
    save = async () => {
        const contents = this.project.scriptBuffer.codeJS
        const backupCodePath = 'script.' + getYYYYMMDDHHMMSS() + '.js'
        const filePath = asRelativePath(this.workspaceRelativeCacheFolderPath + path.sep + backupCodePath)
        await this.project.workspace.rootFolder.writeTextFile(filePath, contents)
        console.log('[📁] script backup saved', filePath)
    }

    constructor(
        //
        public project: Project,
        public opts?: { mock?: boolean },
    ) {
        this.name = `Run ${this.createdAt}` // 'Run ' + this.script.runCounter++
        this.graph = new Graph(this.project, this)
        this.cyto = new Cyto(this.graph)
        makeAutoObservable(this)
    }

    steps: ScriptStep[] = [new ScriptStep_Init()]

    /** current step */
    get step(): ScriptStep {
        return this.steps[0]
    }

    askBoolean = (msg: string, def?: Maybe<boolean>): Promise<boolean> => {
        const ask = new ScriptStep_askBoolean(msg, def)
        this.steps.unshift(ask)
        return ask.finished
    }

    askString = (msg: string, def?: Maybe<string>): Promise<string> => {
        const ask = new ScriptStep_askString(msg, def)
        this.steps.unshift(ask)
        return ask.finished
    }

    /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
    outputs: WsMsgExecuted[] = []

    sendPromp = (): ScriptStep_prompt => {
        // console.log('XX1')
        // console.log('🔴', toJS(this.graph.json))
        // console.log('XX2')
        const currentJSON = deepCopyNaive(this.graph.json)
        console.log('[🪜] checkpoint', currentJSON)
        const step = new ScriptStep_prompt(this, currentJSON)
        this.steps.unshift(step)

        // if we're note really running prompts, just resolve the step and continue
        if (this.opts?.mock) {
            step._resolve!(step)
            return step
        }

        // 🔴 TODO: store the whole project in the prompt
        const out: ApiPromptInput = {
            client_id: this.project.workspace.sid,
            extra_data: { extra_pnginfo: { it: 'works' } },
            prompt: currentJSON,
        }

        // 🔶 not waiting here, because output comes back from somewhere else
        // TODO: but we may want to catch error here to fail early
        // otherwise, we might get stuck
        void fetch(`${this.project.workspace.serverHostHTTP}/prompt`, {
            method: 'POST',
            body: Body.json(out),
        })

        // await sleep(1000)
        return step
    }

    ctx = {}
}
