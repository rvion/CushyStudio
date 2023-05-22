import type { LATER } from 'LATER'
import type { Printable } from '../core/Printable'

import FormData from 'form-data'
import { marked } from 'marked'
import fetch from 'node-fetch'
import * as path from 'path'
// import { Cyto } from '../graph/cyto' 🔴🔴
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { StepL } from '../models/Step'
import { Requestable } from '../controls/Requestable'
import { ScriptStep_ask } from '../controls/ScriptStep_ask'
import { PromptL, asPromptID } from '../models/Prompt'
import { FormBuilder, InfoAnswer, InfoRequestFn } from '../controls/askv2'
import { runAutolayout } from '../core/AutolayoutV2'
import { convertFlowToLiteGraphJSON } from '../core/LiteGraph'
import { auto } from '../core/autoValue'
import { globalActionFnCache } from '../core/globalActionFnCache'
import { createMP4FromImages } from '../ffmpeg/ffmpegScripts'
import { logger } from '../logger/logger'
import { ActionL } from '../models/Action'
import { ApiPromptInput, ComfyUploadImageResult, WsMsgExecuted } from '../types/ComfyWsApi'
import { deepCopyNaive } from '../utils/ComfyUtils'
import { AbsolutePath, RelativePath } from '../utils/fs/BrandedPaths'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { wildcards } from '../wildcards/wildcards'
import { NodeBuilder } from './NodeBuilder'
import { ServerState } from './ServerState'
import { GraphL, asGraphID } from '../models/Graph'
import { nanoid } from 'nanoid'
import { ImageL } from '../models/Image'

/** script exeuction instance */
export class Runtime {
    constructor(
        public st: ServerState /** unique run id, gener */, // public fileAbsPath: AbsolutePath, // public opts?: { mock?: boolean }, // public uid: FlowID,
        public step: StepL,
    ) {
        this.folder = this.st.outputFolderPath // output.resolve(relPath)
        this.nodes = new NodeBuilder(this)
        // this.graph = st.db //new GraphL(this.st.schema)
        // this.cyto = new Cyto(this.graph) // 🔴🔴
        // .makeAutoObservable(this)
    }

    /** list all actions ; codegen during dev-time */
    actions: any
    AUTO = auto
    run = async () => {
        const actionL: ActionL = this.step.action.itemOrCrash
        const action = globalActionFnCache.get(actionL)
        const start = Date.now()
        const formResult = this.step.data.value
        console.log(`🔴 before: size=${this.graph.nodes.length}`)

        try {
            if (action == null) return console.log(`❌ action not found`)
            await action.run(this, formResult)
            console.log(`🔴 after: size=${this.graph.nodes.length}`)
            console.log('[✅] RUN SUCCESS')
            const duration = Date.now() - start
            // broadcast({ type: 'action-end', flowID, actionID, executionID: stepID, status: 'success' })
            // if (numPromptBefore === this._promptCounter) {
            //     this.broadcastSchemaMermaid()
            // }
            return true
        } catch (error) {
            console.log(error)
            // broadcast({ type: 'action-end', flowID, actionID, executionID: stepID, status: 'failure' })
            logger().error('🌠', (error as any as Error).name)
            logger().error('🌠', (error as any as Error).message)
            logger().error('🌠', 'RUN FAILURE')
            return false
        }
    }

    /** run an imagemagick convert action */
    imagemagicConvert = (img: ImageL, partialCmd: string, suffix: string): string => {
        const pathA = img.data.localAbsolutePath
        // 🔴 wait
        const pathB = `${pathA}.${suffix}.png`
        const cmd = `convert "${pathA}" ${partialCmd} "${pathB}"`
        this.exec(cmd)
        return pathB
    }

    /** toolkit to build new graph nodes */
    nodes: NodeBuilder

    /** graph engine instance for smooth and clever auto-layout algorithms */
    // cyto: Cyto 🔴🔴

    /** list of all images produed over the whole script execution */
    generatedImages: ImageL[] = []
    get firstImage() { return this.generatedImages[0] } // prettier-ignore
    get lastImage() { return this.generatedImages[this.generatedImages.length - 1] } // prettier-ignore

    folder: AbsolutePath

    sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    // High level API--------------------

    saveTextFile = async (path: RelativePath, content: string): Promise<void> => {
        const absPath = this.st.resolve(this.folder, path)
        writeFileSync(absPath, content, 'utf-8')
    }

    showHTMLContent = (p: { htmlContent: string; title: string }) => {
        this.st.broadCastToAllClients({ type: 'show-html', content: p.htmlContent, title: p.title })
    }

    showMarkdownContent = (p: { title: string; markdownContent: string }) => {
        const htmlContent = marked.parse(p.markdownContent)
        this.st.broadCastToAllClients({ type: 'show-html', content: htmlContent, title: p.title })
    }

    static VideoCounter = 1
    createAnimation = async (
        /** image to incldue (defaults to all images generated in the fun) */
        source?: ImageL[],
        /** frame duration, in ms:
         * - default is 200 (= 5fps)
         * - use 16 for ~60 fps
         * */
        frameDuration = 200,
    ): Promise<void> => {
        const outputAbsPath = this.st.cacheFolderPath
        const targetVideoAbsPath = asAbsolutePath(path.join(outputAbsPath, `video-${Runtime.VideoCounter++}.mp4`))
        // logger().info(`target video path: ${targetVideoPath}`)
        // logger().info(`target video uri: ${targetVideoURI}`)
        const images = source ?? this.generatedImages
        // this.workspace.writeTextFile(targetVideoURI, JSON.stringify(currentJSON, null, 4))
        if (images.length === 0) {
            logger().error(`no images to create animation; did you forget to call prompt() first ?`)
            return
        }
        logger().info(`🎥 awaiting all files to be ready locally...`)
        await Promise.all(images.map((i) => i.finished))
        logger().info(`🎥 all files are ready locally`)
        const cwd = outputAbsPath
        logger().info(`🎥 target video path: ${targetVideoAbsPath}`)
        logger().info(`🎥 this.folder.path: ${this.folder}`)
        logger().info(`🎥 cwd: ${cwd}`)

        await createMP4FromImages(
            images.map((i) => i.data.localAbsolutePath!),
            targetVideoAbsPath,
            frameDuration,
            cwd,
        )
        // const fromPath = curr.webview.asWebviewUri(targetVideoURI).toString()
        const videoURL = this.st.server.absPathToURL(targetVideoAbsPath)
        logger().info(`🎥 video url: ${videoURL}`)
        const content = `<video controls autoplay loop><source src="${videoURL}" type="video/mp4"></video>`
        this.st.broadCastToAllClients({ type: 'show-html', content, title: 'generated video' })
        // turns a bunch of images into a gif with ffmpeg
    }

    /** ensure a model is present, and download it if needed */
    ensureModel = async (p: { name: string; url: string }): Promise<void> => {
        return
    }

    /** ensure a custom onde is properly setup, and download/clone it if needed */
    ensureCustomNodes = async (p: { path: string; url: string }): Promise<void> => {
        return
    }

    // writeFlowSummary = () => {
    //     const relPath = asRelativePath('flow-summary.md')
    //     this.saveTextFile(relPath, this.flowSummaryMd)
    // }

    embedding = (t: LATER<'Embeddings'>) => `embedding:${t}`

    /** ask the user a few informations */
    ask: InfoRequestFn = async <const Req extends { [key: string]: Requestable }>(
        //
        requestFn: (q: FormBuilder) => Req,
        layout?: 0,
    ): Promise<{ [key in keyof Req]: InfoAnswer<Req[key]> }> => {
        const reqBuilder = new FormBuilder()
        const request = requestFn(reqBuilder)
        const ask = new ScriptStep_ask(request)
        // this.st.broadCastToAllClients({ type: 'ask', flowID: this.uid, form: request, result: {} })
        // this.steps.unshift(ask)
        return ask.finished
    }

    exec = (comand: string): string => {
        // promisify exec to run the command and collect the output
        this.print('🔥 exec: ' + comand)
        const cwd = this.st.rootPath
        console.log('cwd', cwd)
        const res = execSync(comand, { encoding: 'utf-8', cwd })
        return res
    }

    /** built-in wildcards */
    wildcards = wildcards

    /** pick a random seed */
    randomSeed() {
        const seed = Math.floor(Math.random() * 99999999)
        this.print('🔥 seed: ' + seed)
        return seed
    }

    private extractString = (message: Printable): string => {
        if (typeof message === 'string') return message
        if (typeof message === 'number') return message.toString()
        if (typeof message === 'boolean') return message.toString()
        if (typeof message === 'object')
            return `${message.$schema.nameInCushy}_${message.uid}(${JSON.stringify(message.json, null, 2)})`
        return '❓'
    }
    /** display something in the console */
    print = (message: Printable) => {
        let msg = this.extractString(message)
        logger().info(msg)
        this.step.append({ type: 'print', message: msg })
    }

    /** upload a file from disk to the ComfyUI backend */
    // uploadImgFromDisk = async (path: string): Promise<ComfyUploadImageResult> => {
    //     return this.workspace.uploadImgFromDisk(asRelativePath(path))
    // }

    resolveRelative = (path: string): RelativePath => asRelativePath(path)

    resolveAbsolute = (path: string): AbsolutePath => asAbsolutePath(path)

    range = (start: number, end: number, increment: number = 1): number[] => {
        const res = []
        for (let i = start; i < end; i += increment) res.push(i)
        return res
    }

    /** upload an image present on disk to ComfyServer */
    uploadAnyFile = async (path: AbsolutePath): Promise<ComfyUploadImageResult> => {
        const ui8arr: Uint8Array = readFileSync(path)
        return await this.uploadUIntArrToComfy(ui8arr)
    }

    /** upload an image present on disk to ComfyServer */
    uploadWorkspaceFile = async (path: RelativePath): Promise<ComfyUploadImageResult> => {
        const absPath = this.st.resolveFromRoot(path)
        const ui8arr: Uint8Array = readFileSync(absPath)
        return await this.uploadUIntArrToComfy(ui8arr)
    }

    uploadWorkspaceFileAndLoad = async (path: RelativePath): Promise<LATER<'LoadImage'>> => {
        const upload = await this.uploadWorkspaceFile(path)
        const img = (this.graph as any).LoadImage({ image: upload.name })
        return img
    }

    uploadURL = async (url: string): Promise<ComfyUploadImageResult> => {
        const blob = await this.st.getUrlAsBlob(url)
        const bytes = new Uint8Array(await blob.arrayBuffer())
        return this.uploadUIntArrToComfy(bytes)
    }

    private uploadUIntArrToComfy = async (bytes: Uint8Array): Promise<ComfyUploadImageResult> => {
        const uploadURL = this.st.getServerHostHTTP() + '/upload/image'
        const form = new FormData()
        form.append('image', Buffer.from(bytes), { filename: 'upload.png' })
        const resp = await fetch(uploadURL, { method: 'POST', headers: form.getHeaders(), body: form })
        const result: ComfyUploadImageResult = (await resp.json()) as any
        console.log({ 'resp.data': result })
        // this.lastUpload = new CushyImage(this, { filename: result.name, subfolder: '', type: 'output' }).url
        return result
    }

    // --------------------
    // INTERRACTIONS

    async PROMPT(): Promise<PromptL> {
        logger().info('prompt requested')
        const step = await this.sendPromp()
        // this.run.cyto.animate()
        await step.finished
        return step
    }

    private _promptCounter = 0

    get graph(): GraphL {
        return this.step.graph.itemOrCrash
    }

    private sendPromp = async (): Promise<PromptL> => {
        const currentJSON = deepCopyNaive(this.graph.jsonForPrompt)
        this.step.append({ type: 'prompt', graph: currentJSON })

        logger().info('checkpoint:' + JSON.stringify(currentJSON))
        // const step = new PromptExecution(this, currentJSON)
        // this.steps.unshift(step)

        // if we're note really running prompts, just resolve the step and continue
        // if (this.opts?.mock) {
        //     logger().info('MOCK => aborting')
        //     step._resolve!(step)
        //     return step
        // }

        const graphID = asGraphID(nanoid())
        const graph = this.st.db.graphs.create({ id: graphID, comfyPromptJSON: currentJSON })
        const stepID = this.step.id
        const prompt = this.st.db.prompts.create({ id: asPromptID(nanoid()), executed: false, graphID, stepID })

        // 🔴 TODO: store the whole project in the prompt
        const out: ApiPromptInput = {
            client_id: this.st.comfySessionId,
            extra_data: { extra_pnginfo: { it: 'works' } },
            prompt: currentJSON,
        }

        const outputAbsPath = this.st.cacheFolderPath
        // save a copy of the prompt to the cache folder
        const promptJSONPath = asAbsolutePath(path.join(outputAbsPath, `prompt-${++this._promptCounter}.json`))
        this.st.writeTextFile(promptJSONPath, JSON.stringify(currentJSON, null, 4))

        // save a corresponding workflow file
        const cytoJSONPath = asAbsolutePath(path.join(outputAbsPath, `cyto-${this._promptCounter}.json`))
        const cytoJSON = await runAutolayout(this.graph)
        this.st.writeTextFile(cytoJSONPath, JSON.stringify(cytoJSON, null, 4))

        // save a corresponding workflow file
        const workflowJSONPath = asAbsolutePath(path.join(outputAbsPath, `workflow-${this._promptCounter}.json`))
        const liteGraphJSON = convertFlowToLiteGraphJSON(this.graph, cytoJSON)
        this.st.writeTextFile(workflowJSONPath, JSON.stringify(liteGraphJSON, null, 4))

        // 🔶 not waiting here, because output comes back from somewhere else
        // TODO: but we may want to catch error here to fail early
        // otherwise, we might get stuck
        const promptEndpoint = `${this.st.getServerHostHTTP()}/prompt`
        logger().info('sending prompt to ' + promptEndpoint)
        const res = await fetch(promptEndpoint, {
            method: 'POST',
            body: JSON.stringify(out),
        })

        console.log('prompt status', res.status, res.statusText)
        return prompt
        // await sleep(1000)
        // return step
    }

    /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
    outputs: WsMsgExecuted[] = []

    // ctx = {}
}
