import type { LATER } from 'LATER'
import type { Printable } from '../core/Printable'

// import FormData from 'form-data'
// import fetch from 'node-fetch'
import * as path from 'path'
// import { Cyto } from '../graph/cyto' 🔴🔴
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { nanoid } from 'nanoid'
import { STATE } from 'src/front/state'
import { Requestable } from '../controls/Requestable'
import { ScriptStep_ask } from '../controls/ScriptStep_ask'
import { FormBuilder, ImageAnswer, InfoAnswer, InfoRequestFn } from '../controls/askv2'
import { auto } from '../core/autoValue'
import { globalToolFnCache } from '../core/globalActionFnCache'
import { createMP4FromImages } from '../ffmpeg/ffmpegScripts'
import { GraphL, asGraphID } from '../models/Graph'
import { ImageL } from '../models/Image'
import { PromptL } from '../models/Prompt'
import { StepL } from '../models/Step'
import { ApiPromptInput, ComfyUploadImageResult, PromptInfo, WsMsgExecuted } from '../types/ComfyWsApi'
import { deepCopyNaive, exhaust } from '../utils/ComfyUtils'
import { AbsolutePath, RelativePath } from '../utils/fs/BrandedPaths'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { wildcards } from '../wildcards/wildcards'
import { NodeBuilder } from './NodeBuilder'
import { ToolL } from 'src/models/Tool'
import { Status } from './Status'
import { marked } from 'marked'

/** script exeuction instance */
export class Runtime {
    st: STATE

    get graph(): GraphL {
        return this.step.outputGraph.item
    }

    constructor(public step: StepL) {
        this.st = step.st
        // console.log('🔴A', this.step.parentGraph.item.size, Object.keys(this.step.parentGraph.item.data.comfyPromptJSON).length)
        // this.graph = this.step.parentGraph.item.clone()
        // console.log('🔴B', this.graph.size)
        this.folder = step.st.outputFolderPath // output.resolve(relPath)
        this.nodes = new NodeBuilder(this)
        // this.graph = st.db //new GraphL(this.st.schema)
        // this.cyto = new Cyto(this.graph) // 🔴🔴
        // .makeAutoObservable(this)
    }

    /** list all actions ; codegen during dev-time */
    actions: any
    AUTO = auto

    run = async (): Promise<Status> => {
        // 1. ensure we have a tool
        const tool: ToolL = this.step.tool.item
        if (tool == null) return Status.Failure

        const action = globalToolFnCache.get(tool)
        const start = Date.now()
        const formResult = this.step.actionParams
        console.log(`🔴 before: size=${this.graph.nodes.length}`)

        try {
            if (action == null) {
                console.log(`❌ action not found`)
                return Status.Failure
            }
            await action.run(this, formResult)
            console.log(`🔴 after: size=${this.graph.nodes.length}`)
            console.log('[✅] RUN SUCCESS')
            const duration = Date.now() - start
            // broadcast({ type: 'action-end', flowID, actionID, executionID: stepID, status: 'success' })
            // if (numPromptBefore === this._promptCounter) {
            //     this.broadcastSchemaMermaid()
            // }
            return Status.Success
        } catch (error) {
            console.log(error)
            // broadcast({ type: 'action-end', flowID, actionID, executionID: stepID, status: 'failure' })
            console.error('🌠', (error as any as Error).name)
            console.error('🌠', (error as any as Error).message)
            console.error('🌠', 'RUN FAILURE')
            return Status.Failure
        }
    }

    /** run an imagemagick convert action */
    imagemagicConvert = (img: ImageL, partialCmd: string, suffix: string): string => {
        const pathA = img.localAbsolutePath
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
        this.step.append({ type: 'show-html', content: p.htmlContent, title: p.title })
        // this.st.broadCastToAllClients({ type: 'show-html', content: p.htmlContent, title: p.title })
    }

    showMarkdownContent = (p: { title: string; markdownContent: string }) => {
        const htmlContent = marked.parse(p.markdownContent)
        this.step.append({ type: 'show-html', content: htmlContent, title: p.title })
        // this.st.broadCastToAllClients({ type: 'show-html', content: htmlContent, title: p.title })
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
        // console.info(`target video path: ${targetVideoPath}`)
        // console.info(`target video uri: ${targetVideoURI}`)
        const images = source ?? this.generatedImages
        // this.workspace.writeTextFile(targetVideoURI, JSON.stringify(currentJSON, null, 4))
        if (images.length === 0) {
            console.error(`no images to create animation; did you forget to call prompt() first ?`)
            return
        }
        console.info(`🎥 awaiting all files to be ready locally...`)
        await Promise.all(images.map((i) => i.finished))
        console.info(`🎥 all files are ready locally`)
        const cwd = outputAbsPath
        console.info(`🎥 target video path: ${targetVideoAbsPath}`)
        console.info(`🎥 this.folder.path: ${this.folder}`)
        console.info(`🎥 cwd: ${cwd}`)

        await createMP4FromImages(
            images.map((i) => i.localAbsolutePath),
            targetVideoAbsPath,
            frameDuration,
            cwd,
        )
        // 🔴 unfinished
        // const fromPath = curr.webview.asWebviewUri(targetVideoURI).toString()
        // const videoURL = this.st.absPathToURL(targetVideoAbsPath)
        // console.info(`🎥 video url: ${videoURL}`)
        // const content = `<video controls autoplay loop><source src="${videoURL}" type="video/mp4"></video>`
        // this.st.broadCastToAllClients({ type: 'show-html', content, title: 'generated video' })
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

    loadImageAnswer = (ia: ImageAnswer): _IMAGE => {
        //
        // if (this.)
        if (ia.type === 'imagePath') return this.nodes.WASImageLoad({ image_path: ia.absPath })
        if (ia.type === 'imageID') {
            const img = this.st.db.images.getOrThrow(ia.imageID)
            return this.nodes.WASImageLoad({ image_path: img.localAbsolutePath })
        }
        if (ia.type === 'imageSignal') {
            const node = this.graph.nodesIndex.get(ia.nodeID)
            if (node == null) throw new Error('node is not in current graph')
            // 🔴 need runtime checking here
            const xx = (node as any)[ia.fieldName]
            console.log({ xx })
            return xx
        }
        if (ia.type === 'imageURL') return this.nodes.WASImageLoad({ image_path: ia.url })
        return exhaust(ia)
    }

    private extractString = (message: Printable): string => {
        if (typeof message === 'string') return message
        if (typeof message === 'number') return message.toString()
        if (typeof message === 'boolean') return message.toString()
        if (typeof message === 'object')
            return `${message.$schema.nameInCushy}_${message.uid}(${JSON.stringify(message.json, null, 2)})`
        return `❌ (impossible to extract string from ${typeof message} / ${(message as any)?.constructor?.name})`
    }

    /** display something in the console */
    print = (message: Printable) => {
        let msg = this.extractString(message)
        console.info(msg)
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
        throw new Error('not implemented')
        // const uploadURL = this.st.getServerHostHTTP() + '/upload/image'
        // const form = new FormData()
        // form.append('image', Buffer.from(bytes), { filename: 'upload.png' })
        // const resp = await fetch(uploadURL, {
        //     method: 'POST',
        //     headers: form.getHeaders(),
        //     body: form,
        // })
        // const result: ComfyUploadImageResult = (await resp.json()) as any
        // console.log({ 'resp.data': result })
        // // this.lastUpload = new CushyImage(this, { filename: result.name, subfolder: '', type: 'output' }).url
        // return result
    }

    // --------------------
    // INTERRACTIONS

    async PROMPT(): Promise<PromptL> {
        console.info('prompt requested')
        const step = await this.sendPromp()
        // this.run.cyto.animate()
        await step.finished
        return step
    }

    private _promptCounter = 0

    private sendPromp = async (): Promise<PromptL> => {
        const liveGraph = this.graph
        if (liveGraph == null) throw new Error('no graph')
        const currentJSON = deepCopyNaive(liveGraph.jsonForPrompt)
        // this.step.append({ type: 'prompt', graph: currentJSON })
        console.info('checkpoint:' + JSON.stringify(currentJSON))
        // const step = new PromptExecution(this, currentJSON)
        // this.steps.unshift(step)

        // if we're note really running prompts, just resolve the step and continue
        // if (this.opts?.mock) {
        //     console.info('MOCK => aborting')
        //     step._resolve!(step)
        //     return step
        // }

        // const graphID = asGraphID(nanoid())
        // const graph = this.st.db.graphs.create({ id: graphID, comfyPromptJSON: currentJSON })
        const stepID = this.step.id

        // 🔴 TODO: store the whole project in the prompt
        const out: ApiPromptInput = {
            client_id: this.st.comfySessionId,
            extra_data: { extra_pnginfo: { it: 'works' } },
            prompt: currentJSON,
        }

        // | const outputAbsPath = this.st.cacheFolderPath

        // save a copy of the prompt to the cache folder
        // | const promptJSONPath = asAbsolutePath(path.join(outputAbsPath, `prompt-${++this._promptCounter}.json`))
        // | this.st.writeTextFile(promptJSONPath, JSON.stringify(currentJSON, null, 4))

        // save a corresponding workflow file
        // | const cytoJSONPath = asAbsolutePath(path.join(outputAbsPath, `cyto-${this._promptCounter}.json`))
        // | const cytoJSON = await runAutolayout(this.graph)
        // | this.st.writeTextFile(cytoJSONPath, JSON.stringify(cytoJSON, null, 4))

        // save a corresponding workflow file
        // | const workflowJSONPath = asAbsolutePath(path.join(outputAbsPath, `workflow-${this._promptCounter}.json`))
        // | const liteGraphJSON = convertFlowToLiteGraphJSON(this.graph, cytoJSON)
        // | this.st.writeTextFile(workflowJSONPath, JSON.stringify(liteGraphJSON, null, 4))

        // 🔶 not waiting here, because output comes back from somewhere else
        // TODO: but we may want to catch error here to fail early
        // otherwise, we might get stuck
        const promptEndpoint = `${this.st.getServerHostHTTP()}/prompt`
        console.info('sending prompt to ' + promptEndpoint)
        const res = await fetch(promptEndpoint, {
            method: 'POST',
            body: JSON.stringify(out),
        })
        const prompmtInfo: PromptInfo = await res.json()
        console.log('prompt status', res.status, res.statusText, prompmtInfo)

        const graph = this.st.db.graphs.create({ comfyPromptJSON: currentJSON })
        const prompt = this.st.db.prompts.create({
            id: prompmtInfo.prompt_id,
            executed: false,
            graphID: graph.id,
            stepID,
        })
        this.step.append({ type: 'prompt', promptID: prompmtInfo.prompt_id })

        return prompt
        // await sleep(1000)
        // return step
    }

    /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
    outputs: WsMsgExecuted[] = []

    // ctx = {}
}
