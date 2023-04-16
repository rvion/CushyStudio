import * as vscode from 'vscode'
import fetch from 'node-fetch'
import FormData from 'form-data'
// import type { Project } from './Project'

import * as path from 'path'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
// import { Cyto } from '../graph/cyto' 🔴🔴
import { asAbsolutePath, asRelativePath } from '../fs/pathUtils'
import { AbsolutePath, RelativePath } from '../fs/BrandedPaths'
import { getYYYYMMDDHHMMSS } from '../utils/timestamps'
import { ApiPromptInput, ComfyUploadImageResult, WsMsgExecuted } from '../core-types/ComfyWsPayloads'
import { Graph } from '../core-shared/Graph'
import { deepCopyNaive, sleep } from '../utils/ComfyUtils'
import { Maybe } from '../utils/types'
import { GeneratedImage } from './GeneratedImage'
import { FlowExecutionStep } from '../core-types/FlowExecutionStep'
import { ScriptStep_askBoolean, ScriptStep_askPaint, ScriptStep_askString } from '../controls/ScriptStep_ask'
import { ScriptStep_Init } from '../controls/ScriptStep_Init'
import { PromptExecution } from '../controls/ScriptStep_prompt'
import { Workspace } from './Workspace'
import { loggerExt } from '../logger/LoggerBack'
import { FrontWebview } from './FrontWebview'
import { wildcards } from '../wildcards/wildcards'
import { getPayloadID } from '../core-shared/PayloadID'
import { RANDOM_IMAGE_URL } from './RANDOM_IMAGE_URL'
import { IFlowExecution } from '../sdk/IFlowExecution'
import { LATER } from './LATER'
import { execSync } from 'child_process'

/** script exeuction instance */
export class FlowRun implements IFlowExecution {
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
    get firstImage() { return this.generatedImages[0] } // prettier-ignore
    get lastImage() { return this.generatedImages[this.generatedImages.length - 1] } // prettier-ignore

    /** folder where CushyStudio will save run informations */
    get workspaceRelativeCacheFolderPath(): RelativePath {
        return asRelativePath(this.workspace.relativeCacheFolderPath + path.sep + this.name)
    }

    folder: vscode.Uri

    sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    // High level API--------------------
    /** ask user to input a boolean (true/false) */
    askBoolean = (msg: string, def?: Maybe<boolean>): Promise<boolean> => {
        const ask = new ScriptStep_askBoolean(msg, def)
        FrontWebview.sendMessage({ type: 'ask-boolean', message: msg, default: def, uid: getPayloadID() })
        this.steps.unshift(ask)
        return ask.finished
    }

    /** ask the user to input a string */
    askString = (msg: string, def?: Maybe<string>): Promise<string> => {
        const ask = new ScriptStep_askString(msg, def)
        FrontWebview.sendMessage({ type: 'ask-string', message: msg, default: def, uid: getPayloadID() })
        this.steps.unshift(ask)
        return ask.finished
    }

    /** ask the user to paint over an image */
    askPaint = (msg: string, uri: RelativePath): Promise<string> => {
        const ask = new ScriptStep_askPaint(msg)
        FrontWebview.sendMessage({ type: 'ask-paint', message: msg, uri, uid: getPayloadID() })
        this.steps.unshift(ask)
        return ask.finished
    }

    exec = (comand: string): string => {
        // promisify exec to run the command and collect the output
        this.print('🔥 exec: ' + comand)
        const cwd = this.workspace.wspUri.fsPath
        console.log('cwd', cwd)
        const res = execSync(comand, { encoding: 'utf-8', cwd })
        return res
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
    print = (message: string) => {
        loggerExt.info('🔥', message)
        FrontWebview.sendMessage({ type: 'print', message, uid: getPayloadID() })
    }

    /** upload a file from disk to the ComfyUI backend */
    // uploadImgFromDisk = async (path: string): Promise<ComfyUploadImageResult> => {
    //     return this.workspace.uploadImgFromDisk(asRelativePath(path))
    // }

    resolveRelative = (path: string): RelativePath => asRelativePath(path)

    resolveAbsolute = (path: string): AbsolutePath => asAbsolutePath(path)

    /** upload an image present on disk to ComfyServer */
    uploadAnyFile = async (path: AbsolutePath): Promise<ComfyUploadImageResult> => {
        const uri = vscode.Uri.parse(path)
        const ui8arr: Uint8Array = await vscode.workspace.fs.readFile(uri)
        return this.uploadUIntArrToComfy(ui8arr)
    }

    /** upload an image present on disk to ComfyServer */
    uploadWorkspaceFile = async (path: RelativePath): Promise<ComfyUploadImageResult> => {
        const uri = this.workspace.resolve(path)
        const ui8arr: Uint8Array = await vscode.workspace.fs.readFile(uri)
        return await this.uploadUIntArrToComfy(ui8arr)
    }

    uploadWorkspaceFileAndLoad = async (path: RelativePath): Promise<LATER<'LoadImage'>> => {
        const upload = await this.uploadWorkspaceFile(path)
        const img = (this.graph as any).LoadImage({ image: upload.name })
        return img
    }

    uploadURL = async (url: string = RANDOM_IMAGE_URL): Promise<ComfyUploadImageResult> => {
        const blob = await this.workspace.getUrlAsBlob(url)
        return this.uploadUIntArrToComfy(blob)
    }

    private uploadUIntArrToComfy = async (blob: Blob | Uint8Array): Promise<ComfyUploadImageResult> => {
        const uploadURL = this.workspace.serverHostHTTP + '/upload/image'
        const form = new FormData()
        form.append('image', blob, 'upload.png')
        const resp = await fetch(uploadURL, { method: 'POST', headers: form.getHeaders(), body: form })
        const result: ComfyUploadImageResult = (await resp.json()) as any
        console.log({ 'resp.data': result })
        // this.lastUpload = new CushyImage(this, { filename: result.name, subfolder: '', type: 'output' }).url
        return result
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
        // console.log('XX2')
        // await sleep(2000)
        const currentJSON = deepCopyNaive(this.graph.json)
        FrontWebview.sendMessage({ type: 'schema', schema: this.workspace.schema.spec, uid: getPayloadID() })
        FrontWebview.sendMessage({ type: 'prompt', graph: currentJSON, uid: getPayloadID() })

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

        console.log('prompt status', res.status, res.statusText)
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

    steps: FlowExecutionStep[] = [new ScriptStep_Init()]

    /** current step */
    get step(): FlowExecutionStep {
        return this.steps[0]
    }

    /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
    outputs: WsMsgExecuted[] = []

    // ctx = {}
}
