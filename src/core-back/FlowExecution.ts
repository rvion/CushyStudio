import * as vscode from 'vscode'
import fetch from 'node-fetch'
// import type { Project } from './Project'

import * as path from 'path'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
// import { Cyto } from '../graph/cyto' 🔴🔴
import { asRelativePath, RelativePath } from '../fs/pathUtils'
import { getYYYYMMDDHHMMSS } from '../utils/timestamps'
import { ApiPromptInput, WsMsgExecuted } from '../core-shared/ComfyWsPayloads'
import { Graph } from '../core-shared/Graph'
import { deepCopyNaive, Maybe } from '../core/ComfyUtils'
import { GeneratedImage } from '../core/PromptOutputImage'
import { ScriptStep } from '../core/ScriptStep'
import { ScriptStep_askBoolean, ScriptStep_askString } from '../controls/ScriptStep_ask'
import { ScriptStep_Init } from '../controls/ScriptStep_Init'
import { PromptExecution } from '../controls/ScriptStep_prompt'
import { Workspace } from './Workspace'
import { loggerExt } from '../logger/LoggerExtension'
import { ProxyToWebview } from '../panels/ProxyToWebview'
import { wildcards } from '../wildcards/wildcards'

/** script exeuction instance */
export class FlowExecution {
    /** creation "timestamp" in YYYYMMDDHHMMSS format */
    createdAt = getYYYYMMDDHHMMSS()

    /** unique run id */
    uid = nanoid()

    /** human readable folder name */
    name: string

    /** the main graph that will be updated along the script execution */
    graph: Graph

    /** graph engine instance for smooth and clever auto-layout algorithms */
    // cyto: Cyto 🔴🔴

    /** list of all images produed over the whole script execution */
    generatedImages: GeneratedImage[] = []

    /** folder where CushyStudio will save run informations */
    get workspaceRelativeCacheFolderPath(): RelativePath {
        return asRelativePath(this.workspace.relativeCacheFolderPath + path.sep + this.name)
    }

    /** save current script */
    // save = async () => {
    //     // const contents = this.project.scriptBuffer.codeJS
    //     // const backupCodePath = 'script.' + getYYYYMMDDHHMMSS() + '.js'
    //     // const filePath = asRelativePath(this.workspaceRelativeCacheFolderPath + path.sep + backupCodePath)
    //     // await this.project.workspace.rootFolder.writeTextFile(filePath, contents)
    //     // console.log('[📁] script backup saved', filePath)
    //     console.log('❌ not implmeented')
    // }

    folder: vscode.Uri

    // High level API--------------------
    /** ask user to input a boolean (true/false) */
    askBoolean = (msg: string, def?: Maybe<boolean>): Promise<boolean> => {
        const ask = new ScriptStep_askBoolean(msg, def)
        ProxyToWebview.send({ type: 'ask-boolean', message: msg, default: def })
        this.steps.unshift(ask)
        return ask.finished
    }

    /** ask the user to input a string */
    askString = (msg: string, def?: Maybe<string>): Promise<string> => {
        const ask = new ScriptStep_askString(msg, def)
        ProxyToWebview.send({ type: 'ask-string', message: msg, default: def })
        this.steps.unshift(ask)
        return ask.finished
    }

    /** built-in wildcards */
    wildcards = wildcards

    /** pick a random seed */
    randomSeed() {
        const seed = Math.floor(Math.random() * 99999999)
        this.print('🔥 random seed: ' + seed)
        return seed
    }

    /** display something in the console */
    print = (msg: string) => loggerExt.info('🔥', msg)

    /** upload a file from disk to the ComfyUI backend */
    uploadImgFromDisk = async (path: string) => {
        return this.workspace.uploadImgFromDisk(path)
    }

    // --------------------
    // INTERRACTIONS

    async PROMPT(): Promise<PromptExecution> {
        loggerExt.info('🔥', 'prompt requested')
        const step = await this.sendPromp()
        // this.run.cyto.animate()
        await step.finished
        return step
    }

    private sendPromp = async (): Promise<PromptExecution> => {
        // console.log('XX1')
        // console.log('🔴', toJS(this.graph.json))
        // console.log('XX2')
        const currentJSON = deepCopyNaive(this.graph.json)
        loggerExt.info('🐰', 'checkpoint:' + JSON.stringify(currentJSON))
        const step = new PromptExecution(this, currentJSON)
        this.steps.unshift(step)

        // if we're note really running prompts, just resolve the step and continue
        if (this.opts?.mock) {
            loggerExt.info('🐰', 'MOCK => aborting')
            step._resolve!(step)
            return step
        }

        // 🔴 TODO: store the whole project in the prompt
        const out: ApiPromptInput = {
            client_id: this.workspace.comfySessionId,
            extra_data: { extra_pnginfo: { it: 'works' } },
            prompt: currentJSON,
        }

        // 🔶 not waiting here, because output comes back from somewhere else
        // TODO: but we may want to catch error here to fail early
        // otherwise, we might get stuck
        const promptEndpoint = `${this.workspace.serverHostHTTP}/prompt`
        loggerExt.info('🌠', 'sending prompt to ' + promptEndpoint)
        const res = await fetch(promptEndpoint, {
            method: 'POST',
            body: JSON.stringify(out),
        })

        console.log('🔴', res.status, res.statusText)
        // await sleep(1000)
        return step
    }

    constructor(
        //
        public workspace: Workspace,
        public uri: vscode.Uri,
        public opts?: { mock?: boolean },
    ) {
        const relPath = asRelativePath(path.join('.cache', this.uri.path))
        this.folder = this.workspace.resolve(relPath)
        this.name = `Run ${this.createdAt}` // 'Run ' + this.script.runCounter++
        this.graph = new Graph(this.workspace.schema)
        // this.cyto = new Cyto(this.graph) // 🔴🔴
        makeAutoObservable(this)
    }

    steps: ScriptStep[] = [new ScriptStep_Init()]

    /** current step */
    get step(): ScriptStep {
        return this.steps[0]
    }

    /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
    outputs: WsMsgExecuted[] = []

    // ctx = {}
}
