import type { WidgetDict } from 'src/cards/App'
import type { STATE } from 'src/state/state'
import type { Printable } from '../core/Printable'

import * as path from 'pathe'
// import { Cyto } from '../graph/cyto' 🔴🔴
import { execSync } from 'child_process'
import fs, { writeFileSync } from 'fs'
import { assets } from 'src/utils/assets/assets'
import { braceExpansion } from 'src/utils/misc/expansion'
import { IDNaminScheemeInPromptSentToComfyUI } from '../back/IDNaminScheemeInPromptSentToComfyUI'
import { ComfyWorkflowBuilder } from '../back/NodeBuilder'
import { ImageAnswer } from '../controls/misc/InfoAnswer'
import { ComfyNodeOutput } from '../core/Slot'
import { auto } from '../core/autoValue'
import { ComfyPromptL } from '../models/ComfyPrompt'
import { ComfyWorkflowL } from '../models/ComfyWorkflow'
import { MediaImageL, checkIfComfyImageExists } from '../models/MediaImage'
import { StepL } from '../models/Step'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'

import child_process from 'child_process'
import { createRandomGenerator } from 'src/back/random'
import { _formatAsRelativeDateTime } from 'src/updater/_getRelativeTimeString'
import { Wildcards } from 'src/widgets/prompter/nodes/wildcards/wildcards'
import { RuntimeApps } from './RuntimeApps'
import { RuntimeCanvas } from './RuntimeCanvas'
import { RuntimeColors } from './RuntimeColors'
import { RuntimeComfyUI } from './RuntimeComfyUI'
import { RuntimeCushy } from './RuntimeCushy'
import { RuntimeHosts } from './RuntimeHosts'
import { RuntimeImages } from './RuntimeImages'
import { RuntimeKonva } from './RuntimeKonva'
import { RuntimeLLM } from './RuntimeLLM'
import { RuntimeStore } from './RuntimeStore'
import { RuntimeVideos } from './RuntimeVideo'
import { Widget_group } from 'src/controls/widgets/WidgetIGroupUI'

export type ImageAndMask = HasSingle_IMAGE & HasSingle_MASK

export type RuntimeExecutionResult =
    | {
          type: 'success'
      }
    | {
          type: 'error'
          error: any
      }

// 2 nest max
// run.store.getLocal
// run.store.getGlobal

/** script exeuction instance */
export class Runtime<FIELDS extends WidgetDict = any> {
    get Colors(): RuntimeColors {
        const it = new RuntimeColors(this)
        Object.defineProperty(this, 'Colors', { value: it })
        return it
    }

    get Store(): RuntimeStore {
        const it = new RuntimeStore(this)
        Object.defineProperty(this, 'Store', { value: it })
        return it
    }
    get ComfyUI(): RuntimeComfyUI {
        const it = new RuntimeComfyUI(this)
        Object.defineProperty(this, 'ComfyUI', { value: it })
        return it
    }

    get Images(): RuntimeImages {
        const it = new RuntimeImages(this)
        Object.defineProperty(this, 'Images', { value: it })
        return it
    }

    get Hosts(): RuntimeHosts {
        const it = new RuntimeHosts(this)
        Object.defineProperty(this, 'Hosts', { value: it })
        return it
    }

    get Cushy(): RuntimeCushy {
        const it = new RuntimeCushy(this)
        Object.defineProperty(this, 'Cushy', { value: it })
        return it
    }

    get LLM(): RuntimeLLM {
        const it = new RuntimeLLM(this)
        Object.defineProperty(this, 'LLM', { value: it })
        return it
    }

    get Apps(): RuntimeApps {
        const it = new RuntimeApps(this)
        Object.defineProperty(this, 'Apps', { value: it })
        return it
    }

    get Videos(): RuntimeVideos {
        const it = new RuntimeVideos(this)
        Object.defineProperty(this, 'Videos', { value: it })
        return it
    }

    /**
     * SDK to programmatically build images
     * using the KonvaJS library (layers, filters, effects, etc.)
     */
    get Konva(): RuntimeKonva {
        const it = new RuntimeKonva(this)
        Object.defineProperty(this, 'Konva', { value: it })
        return it
    }

    /**
     * SDK to programmatically build images
     * using the native web canvas api
     */
    get Canvas(): RuntimeCanvas {
        const it = new RuntimeCanvas(this)
        Object.defineProperty(this, 'Canvas', { value: it })
        return it
    }

    isCurrentDraftAutoStartEnabled = (): Maybe<boolean> => {
        return this.step.draft?.shouldAutoStart
    }

    isCurrentDraftDirty(): Maybe<boolean> {
        return this.step.draft?.isDirty
    }

    constructor(public step: StepL) {
        this.st = step.st
        this.folder = step.st.outputFolderPath

        // ⏸️ this.upload_FileAtAbsolutePath = this.st.uploader.upload_FileAtAbsolutePath.bind(this.st.uploader)
        // ⏸️ this.upload_ImageAtURL = this.st.uploader.upload_ImageAtURL.bind(this.st.uploader)
        // ⏸️ this.upload_dataURL = this.st.uploader.upload_dataURL.bind(this.st.uploader)
        // ⏸️ this.upload_Asset = this.st.uploader.upload_Asset.bind(this.st.uploader)
        // ⏸️ this.upload_Blob = this.st.uploader.upload_Blob.bind(this.st.uploader)
    }

    /**
     * the global CushyStudio app state
     * Apps should probably never touch this directly.
     * But also, do what you want. you're a grown up.
     * */
    st: STATE

    /**
     * filesystem library.
     * your app can do IO.
     * with great power comes great responsibility.
     */
    fs = fs

    /**
     * path manifulation library;
     * avoid concateing paths yourself if you want your app
     */
    path = path

    /**
     * sub-process creation and manipulation SDK;
     * usefull to run external commands or operate external tools
     * use with caution
     */
    child_process = child_process

    /**
     * get the configured trigger words for the given lora
     * (those are user defined; hover your lora in any rich text prompt to edit them)
     */
    getLoraAssociatedTriggerWords = (loraName: string): Maybe<string> => {
        return this.st.configFile.value?.loraPrompts?.[loraName]?.text
    }

    // ----------------------------
    /**
     * the current json form result
     * the main value sent to your app as context.
     * Most apps only need this value.
     */
    formResult!: { [k in keyof FIELDS]: FIELDS[k]['$Output'] }

    /**
     * the extended json form value including internal state
     * it includes all internal form ids, and other internal values
     * it could be usefull for some cases like if you need to
     *      - use the ids for dynamic references
     *      - do something based on if some fields are folded
     * */
    formSerial!: { [k in keyof FIELDS]: FIELDS[k]['$Serial'] }

    /**
     * the live form instance;
     * 🔶 it is NOT json: it's a complex object
     * 🔶 it is NOT frozen: this will change during runtime if you update the draft form
     * */
    formInstance!: Widget_group<FIELDS>
    // ----------------------------

    executeDraft = async (draftID: DraftID, args: any) => {
        throw new Error('🔴 not yet implemented')
    }

    /**
     * get your configured lora metada
     * (those are user defined; hover your lora in any rich text prompt to edit them)
     */
    getLoraAssociatedMetadata = (
        loraName: string,
    ): Maybe<{
        text?: string | undefined
        url?: string | undefined
    }> => {
        return this.st.configFile.value?.loraPrompts?.[loraName]
    }

    /** the default app's ComfyUI graph we're manipulating */
    get workflow(): ComfyWorkflowL {
        return this.step.outputWorkflow.item
    }

    /** graph buider */
    get nodes(): ComfyWorkflowBuilder {
        return this.workflow.builder
    }

    // ====================================================================
    // miscs subgraphs until there is a better place to place them

    /** a built-in prefab to quickly
     * add PreviewImage & JoinImageWithAlpha node to your ComfyUI graph */
    add_previewImageWithAlpha = (image: HasSingle_IMAGE & HasSingle_MASK) => {
        return this.nodes.PreviewImage({
            images: this.nodes.JoinImageWithAlpha({
                image: image,
                alpha: image,
            }),
        })
    }

    /** a built-in prefab to quickly
     * add a PreviewImage node to your ComfyUI graph */
    add_previewImage = (image: HasSingle_IMAGE) => {
        return this.nodes.PreviewImage({ images: image })
    }

    /** a built-in prefab to quickly
     * add a PreviewImage node to your ComfyUI graph */
    add_PreviewMask = (mask: _MASK) => {
        return this.nodes.PreviewImage({ images: this.nodes.MaskToImage({ mask: mask }) })
    }

    /** a built-in prefab to quickly
     * add a PreviewImage node to your ComfyUI graph */
    add_saveImage = (image: _IMAGE, prefix?: string) => {
        return this.nodes.SaveImage({ images: image, filename_prefix: prefix })
    }

    // ====================================================================

    /** helper to auto-find an output slot and link use it for this input */
    AUTO = auto

    /** helper to chose radomly any item from a list */
    chooseRandomly = <T>(key: string, seed: number, arr: T[]): T => {
        return createRandomGenerator(`${key}:${seed}`).randomItem(arr)
    }

    /**
     * @internal
     * execute the draft
     */
    _EXECUTE = async (p: { formInstance: Widget_group<any> }): Promise<RuntimeExecutionResult> => {
        const start = Date.now()
        const executable = this.step.executable
        const appFormInput = this.step.data.formResult
        const appFormSerial = this.step.data.formSerial.values_
        this.formResult = appFormInput
        this.formSerial = appFormSerial
        this.formInstance = p.formInstance

        // console.log(`🔴 before: size=${this.graph.nodes.length}`)
        // console.log(`FORM RESULT: data=${JSON.stringify(this.step.data.formResult, null, 3)}`)
        try {
            if (executable == null) {
                console.log(`❌ action not found`)
                return { type: 'error', error: 'action not found' }
            }
            await executable.run(this, appFormInput)
            console.log(`🔴 after: size=${this.workflow.nodes.length}`)
            console.log('[✅] RUN SUCCESS')
            const duration = Date.now() - start
            return { type: 'success' }
        } catch (error: any /* 🔴 */) {
            console.error(error)
            // console.error('🌠', (error as any as Error).name)
            // console.error('🌠', (error as any as Error).message)
            // console.error('🌠', 'RUN FAILURE')
            this.st.db.runtimeErrors.create({
                message: error.message ?? 'no-message',
                infos: error,
                graphID: this.workflow.id,
                stepID: this.step.id,
            })
            // return Status.Failure
            return { type: 'error', error: error }
        }
    }

    /**
     * helper function to quickly run some imagemagick convert command
     * on an existing MediaImage instance, regardless of it's provenance
     * 🔶 works but unfinished
     */
    exec_imagemagickConvert = (
        //
        img: MediaImageL,
        partialCmd: string,
        suffix: string,
    ): string => {
        const pathA = img.absPath
        // 🔴 wait
        const pathB = `${pathA}.${suffix}.png`
        const cmd = `convert "${pathA}" ${partialCmd} "${pathB}"`
        this.exec(cmd)
        return pathB
    }

    // graph engine instance for smooth and clever auto-layout algorithms
    // cyto: Cyto 🔴🔴

    /** list of all images produed over the whole script execution */
    // generatedImages: ImageL[] = []
    get lastImage(): Maybe<MediaImageL> {
        return this.generatedImages[this.generatedImages.length - 1]
    }

    // IMAGE HELPES ---------------------------------------------------------------------------------------

    // ⏸️ /**
    // ⏸️  * list of all images stores currently active in this run
    // ⏸️  * every image generated will be sent though those stores for
    // ⏸️  * potential caching
    // ⏸️  * */
    // ⏸️ get imageStores() {
    // ⏸️     return [...this.imageStoresIndex.values()]
    // ⏸️ }

    findLastImageByPrefix = (prefix: string): MediaImageL | undefined => {
        return this.generatedImages.find((i) => i.filename.startsWith(prefix))
    }

    doesComfyImageExist = async (imageInfo: { type: `input` | `ouput`; subfolder: string; filename: string }) => {
        return await checkIfComfyImageExists(this.st.getServerHostHTTP(), imageInfo)
    }

    get generatedImages(): MediaImageL[] {
        return this.step.generatedImages
    }

    // ⏸️ /**
    // ⏸️  * some magical utility that takes an _IMAGE
    // ⏸️  * (anything that will produce an image, and ensure its output will be present after the run)
    // ⏸️  * */
    // ⏸️ TODO: exercice: implement that using useImageStore

    // ---------------------------------------------------------------------------------------
    // get firstImage() { return this.generatedImages[0] } // prettier-ignore
    // get lastImage() { return this.generatedImages[this.generatedImages.length - 1] } // prettier-ignore

    folder: AbsolutePath

    /** list of all built-in assets, with completion for quick demos  */
    assets = assets

    /** quick helper to make your card sleep for a given number fo milisecond */
    sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    // High level API--------------------

    expandBraces = (string: string): string[] => {
        return braceExpansion(string)
    }

    // ------------------------------------------------------------------------------------

    /** outputs a gaussian splat asset, accessible at the given URL */
    output_GaussianSplat = (p: { url: string }) => {
        this.st.db.media_splats.create({
            url: p.url,
            stepID: this.step.id,
        })
    }

    /** output a 3d scene from an image and its displacement and depth maps */
    output_3dImage = (p: { image: string; depth: string; normal: string }) => {
        const image = this.generatedImages.find((i) => i.filename.startsWith(p.image))
        const depth = this.generatedImages.find((i) => i.filename.startsWith(p.depth))
        const normal = this.generatedImages.find((i) => i.filename.startsWith(p.normal))
        if (image == null) throw new Error(`image not found: ${p.image}`)
        if (depth == null) throw new Error(`image not found: ${p.image}`)
        if (normal == null) throw new Error(`image not found: ${p.image}`)
        this.st.db.media_3d_displacement.create({
            // type: 'displaced-image',
            width: image.data.width ?? 512,
            height: image.data.height ?? 512,
            image: image.url,
            depthMap: depth.url,
            normalMap: normal.url,
            stepID: this.step.id,
        })
    }

    /** 🔴 unfinished */
    output_File = async (path: RelativePath, content: string): Promise<void> => {
        const absPath = this.st.resolve(this.folder, path)
        writeFileSync(absPath, content, 'utf-8')
    }

    output_HTML = (p: { htmlContent: string; title: string }) => {
        this.st.db.media_texts.create({
            kind: 'html',
            title: p.title,
            content: p.htmlContent,
            stepID: this.step.id,
        })
    }

    output_Markdown = (p: string | { title: string; markdownContent: string }) => {
        const title = typeof p === 'string' ? '<no-title>' : p.title
        const content = typeof p === 'string' ? p : p.markdownContent
        return this.st.db.media_texts.create({ kind: 'markdown', title, content, stepID: this.step.id })
    }

    output_text = (p: { title: string; message: Printable } | string) => {
        const [title, message] = typeof p === 'string' ? ['<no-title>', p] : [p.title, p.message]
        let msg = this.extractString(message)
        console.info(msg)
        return this.step.db.media_texts.create({
            kind: 'text',
            title: title,
            content: msg,
            stepID: this.step.id,
        })
    }

    /**
     * @deprecated
     * use `output_text` instead;
     * */
    print = (message: Printable) => {
        this.output_text({ title: '<no-title>', message })
    }

    // ------------------------------------------------------------------------------------
    // output_image = (p: { url: string }) => {
    //     const img = this.st.db.images.create({
    //         downloaded: true,
    //         localFilePath: './foobbabbababa',
    //         comfyImageInfo: { filename: 'test' },
    //     })
    //     this.st.layout.FOCUS_OR_CREATE('DisplacedImage', {
    //         width: image.data.width ?? 512,
    //         height: image.data.height ?? 512,
    //         image: image.url,
    //         depthMap: depth.url,
    //         normalMap: normal.url,
    //     })
    // }

    // ===================================================================================================

    // private
    downloadURI = (uri: string, name: string) => {
        var link = document.createElement('a')
        link.download = name
        link.href = uri
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        // delete link
    }

    /**
     * Takes an embedding name and format it for ComfyUI usage
     * e.g.: "EasyNegative" => "embedding:EasyNegative"
     * */
    formatEmbeddingForComfyUI = (t: Embeddings) => `embedding:${t}`
    formatAsRelativeDateTime = (date: Date | number): string => _formatAsRelativeDateTime(date)

    // 🐉 /** ask the user a few informations */
    // 🐉 ask: InfoRequestFn = async <const Req extends { [key: string]: Widget }>(
    // 🐉     //
    // 🐉     requestFn: (q: FormBuilder) => Req,
    // 🐉     layout?: 0,
    // 🐉 ): Promise<{ [key in keyof Req]: InfoAnswer<Req[key]> }> => {
    // 🐉     const reqBuilder = new FormBuilder()
    // 🐉     const request = requestFn(reqBuilder)
    // 🐉     const ask = new ScriptStep_ask(request)
    // 🐉     // this.st.broadCastToAllClients({ type: 'ask', flowID: this.uid, form: request, result: {} })
    // 🐉     // this.steps.unshift(ask)
    // 🐉     return ask.finished
    // 🐉 }

    /**
     * execute a shell command
     * @beta
     */
    exec = (comand: string): string => {
        // promisify exec to run the command and collect the output
        this.output_text({ title: 'command', message: '🔥 exec: ' + comand })
        const cwd = this.st.rootPath
        console.log('cwd', cwd)
        const res = execSync(comand, { encoding: 'utf-8', cwd })
        return res
    }

    /** built-in wildcards */
    get wildcards(): Wildcards {
        return this.st.wildcards
    }

    /**
     * get a random int seed
     * between 0 and 99999999
     */
    randomSeed() {
        const seed = Math.floor(Math.random() * 99999999)
        // this.print('seed: ' + seed)
        return seed
    }

    loadImageAnswerAsEnum = (ia: ImageAnswer): Promise<Enum_LoadImage_image> => {
        const img = this.st.db.media_images.getOrThrow(ia.imageID)
        return img.uploadAndReturnEnumName()
    }

    loadImageAnswer2 = (ia: ImageAnswer): MediaImageL => {
        return this.st.db.media_images.getOrThrow(ia.imageID)
    }

    loadImageAnswer = async (ia: ImageAnswer): Promise<ImageAndMask> => {
        const img = this.st.db.media_images.getOrThrow(ia.imageID)
        return await img.uploadAndloadAsImage(this.workflow)
    }

    private extractString = (message: Printable): string => {
        if (typeof message === 'string') return message
        if (typeof message === 'number') return message.toString()
        if (typeof message === 'boolean') return message.toString()
        if (message instanceof ComfyNodeOutput) return message.toString() // 🔴
        if (typeof message === 'object')
            return `${message.$schema.nameInCushy}_${message.uid}(${JSON.stringify(message.json, null, 2)})`
        return `❌ (impossible to extract string from ${typeof message} / ${(message as any)?.constructor?.name})`
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

    // ⏸️ // UPLOAD ------------------------------------------------------------------------------------------
    // ⏸️ /** upload an image present on disk to ComfyUI */
    // ⏸️ upload_FileAtAbsolutePath: Uploader['upload_FileAtAbsolutePath']
    // ⏸️
    // ⏸️ /** upload an image that can be downloaded form a given URL to ComfyUI */
    // ⏸️ upload_ImageAtURL: Uploader['upload_ImageAtURL']
    // ⏸️
    // ⏸️ /** upload an image from dataURL */
    // ⏸️ upload_dataURL: Uploader['upload_dataURL']
    // ⏸️
    // ⏸️ /** upload a deck asset to ComfyUI */
    // ⏸️ upload_Asset: Uploader['upload_Asset']
    // ⏸️
    // ⏸️ /** upload a Blob */
    // ⏸️ upload_Blob: Uploader['upload_Blob']
    // ⏸️
    // ⏸️ // LOAD IMAGE --------------------------------------------------------------------------------------
    // ⏸️ /** load an image present on disk to ComfyUI */
    // ⏸️ load_FileAtAbsolutePath = async (absPath: AbsolutePath): Promise<ImageAndMask> => {
    // ⏸️     const res = await this.st.uploader.upload_FileAtAbsolutePath(absPath)
    // ⏸️     return this.loadImageAnswer({ type: 'ComfyImage', imageName: res.name })
    // ⏸️ }
    // ⏸️
    // ⏸️ /** load an image that can be downloaded form a given URL to ComfyUI */
    // ⏸️ load_ImageAtURL = async (url: string): Promise<ImageAndMask> => {
    // ⏸️     const res = await this.st.uploader.upload_ImageAtURL(url)
    // ⏸️     return this.loadImageAnswer({ type: 'ComfyImage', imageName: res.name })
    // ⏸️ }
    // ⏸️ /** load an image from dataURL */
    // ⏸️ load_dataURL = async (dataURL: string): Promise<ImageAndMask> => {
    // ⏸️     const res: ComfyUploadImageResult = await this.st.uploader.upload_dataURL(dataURL)
    // ⏸️     // this.st.db.images.create({ infos:  })
    // ⏸️     return this.loadImageAnswer({ type: 'ComfyImage', imageName: res.name })
    // ⏸️ }
    // ⏸️
    // ⏸️ /** load a deck asset to ComfyUI */
    // ⏸️ load_Asset = async (asset: RelativePath): Promise<ImageAndMask> => {
    // ⏸️     const res = await this.st.uploader.upload_Asset(asset)
    // ⏸️     return this.loadImageAnswer({ type: 'ComfyImage', imageName: res.name })
    // ⏸️ }
    // ⏸️ /** load a Blob */
    // ⏸️ load_Blob = async (blob: Blob): Promise<ImageAndMask> => {
    // ⏸️     const res = await this.st.uploader.upload_Blob(blob)
    // ⏸️     return this.loadImageAnswer({ type: 'ComfyImage', imageName: res.name })
    // ⏸️ }

    // INTERRACTIONS ------------------------------------------------------------------------------------------
    async PROMPT(p?: {
        /** defaults to numbers */
        ids?: IDNaminScheemeInPromptSentToComfyUI
    }): Promise<ComfyPromptL> {
        console.info('prompt requested')
        const prompt = await this.workflow.sendPrompt({ idMode: p?.ids })
        await prompt.finished
        return prompt
    }

    private _promptCounter = 0
}
