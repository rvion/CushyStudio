import type { ComfyWorkflowBuilder } from '../back/NodeBuilder'
import type { CustomViewRef, DraftExecutionContext } from '../cards/App'
import type { Printable } from '../core/Printable'
import type { Field } from '../csuite/model/Field'
import type { ComfyPromptL } from '../models/ComfyPrompt'
import type { ComfyWorkflowL, PromptSettings } from '../models/ComfyWorkflow'
import type { MediaImageL } from '../models/MediaImage'
import type { MediaTextL } from '../models/MediaText'
import type { StepL } from '../models/Step'
import type { CompiledPrompt } from '../prompt/FieldPrompt'
import type { STATE } from '../state/state'
import type { Wildcards } from '../widgets/prompter/nodes/wildcards/wildcards'
import type * as FS from 'fs'
import type * as Pathe from 'pathe'

import child_process, { execSync } from 'child_process'
import { createHash } from 'crypto'
import fs, { writeFileSync } from 'fs'
import * as path from 'pathe'

import { auto } from '../core/autoValue'
import { ComfyNodeOutput } from '../core/Slot'
import { toJSONError } from '../csuite/errors/toJSONError'
import { createRandomGenerator } from '../csuite/rnd/createRandomGenerator'
import { braceExpansion } from '../csuite/utils/expansion'
import { checkIfComfyImageExists } from '../models/ImageInfos_ComfyGenerated'
import { compilePrompt } from '../prompt/compiler/_compile'
import { _formatAsRelativeDateTime } from '../updater/_getRelativeTimeString'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { RuntimeApps } from './RuntimeApps'
import { RuntimeCanvas } from './RuntimeCanvas'
import { RuntimeColors } from './RuntimeColors'
import { RuntimeComfyUI } from './RuntimeComfyUI'
import { RuntimeExtra } from './RuntimeExtra'
import { RuntimeHosts } from './RuntimeHosts'
import { RuntimeImages } from './RuntimeImages'
import { RuntimeKonva } from './RuntimeKonva'
import { RuntimeLLM } from './RuntimeLLM'
import { RuntimeSharp } from './RuntimeSharp'
import { RuntimeStore } from './RuntimeStore'
import { RuntimeVideos } from './RuntimeVideo'

export type ImageStoreName = Tagged<string, 'ImageStoreName'>
export type ImageAndMask = HasSingle_IMAGE & HasSingle_MASK

// prettier-ignore
export type RuntimeExecutionResult =
    | { type: 'success' }
    | { type: 'error'; error: any }

// 2 nest max
// run.store.getLocal
// run.store.getGlobal

/** script exeuction instance */
export class Runtime<FIELD extends Field = any> {
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

   /** home for extra stuff */
   get Extra(): RuntimeExtra {
      const it = new RuntimeExtra(this)
      Object.defineProperty(this, 'Extra', { value: it })
      return it
   }

   /**
    * SDK to programmatically build images using a scene graph
    * using the KonvaJS library (layers, filters, effects, etc.)
    */
   get Konva(): RuntimeKonva {
      const it = new RuntimeKonva(this)
      Object.defineProperty(this, 'Konva', { value: it })
      return it
   }

   /**
    * fast and efficient image manipulation SDK
    * better than Konva for quick actions (bad, resize, etc.)
    * */
   get Sharp(): RuntimeSharp {
      const it = new RuntimeSharp(this)
      Object.defineProperty(this, 'Sharp', { value: it })
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

   /**
    * the global CushyStudio app state
    * Apps should probably never touch this directly.
    * But also, do what you want. you're a grown up.
    * */
   Cushy: STATE

   /**
    * filesystem library.
    * your app can do IO.
    * with great power comes great responsibility.
    */
   Filesystem: typeof FS = fs

   /**
    * path manifulation library;
    * avoid concateing paths yourself if you want your app
    */
   Path: typeof Pathe = path

   isCurrentDraftAutoStartEnabled = (): Maybe<boolean> => {
      return this.step.draft?.shouldAutoStart
   }

   /** fast md5 string hash using node built-in crypto api */
   hash = (s: string): string => {
      return createHash('md5').update(s).digest('hex')
   }

   isCurrentDraftDirty(): Maybe<boolean> {
      return this.step.draft?.isDirty
   }

   constructor(public step: StepL) {
      this.Cushy = step.st
      this.folder = step.st.outputFolderPath
   }

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
      return this.Cushy.getLoraAssociatedTriggerWords(loraName)
   }

   // ----------------------------
   /**
    * the current json form result
    * the main value sent to your app as context.
    * Most apps only need this value.
    */
   formResult!: FIELD['$Value']

   /**
    * the extended json form value including internal state
    * it includes all internal form ids, and other internal values
    * it could be usefull for some cases like if you need to
    *      - use the ids for dynamic references
    *      - do something based on if some fields are folded
    * */
   formSerial!: FIELD['$Serial']

   /**
    * the live form instance;
    * 🔶 it is NOT json: it's a complex object
    * 🔶 it is NOT frozen: this will change during runtime if you update the draft form
    * */
   form!: FIELD
   // ----------------------------

   executeDraft = async (draftID: DraftID, args: any): Promise<never> => {
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
      return this.Cushy.configFile.value?.loraPrompts?.[loraName]
   }

   /**
    * @deprecated
    * the default app's ComfyUI graph we're manipulating
    */
   get workflow(): ComfyWorkflowL {
      // this should also be deprecated
      //               VVVVVVVVVVVVVV
      return this.step.outputWorkflow.item
   }

   /**
    * @deprecated
    * graph buider
    */
   get nodes(): ComfyWorkflowBuilder {
      return this.workflow.builder
   }

   // ====================================================================
   // miscs subgraphs until there is a better place to place them

   /** a built-in prefab to quickly
    * add PreviewImage & JoinImageWithAlpha node to your ComfyUI graph */
   add_previewImageWithAlpha = (image: HasSingle_IMAGE & HasSingle_MASK): Comfy.Base.PreviewImage => {
      return this.nodes.PreviewImage({
         images: this.nodes.JoinImageWithAlpha({
            image: image,
            alpha: image,
         }),
      })
   }

   /** a built-in prefab to quickly
    * add a PreviewImage node to your ComfyUI graph */
   add_previewImage = (image: Comfy.Input.IMAGE): Comfy.Base.PreviewImage => {
      return this.nodes.PreviewImage({ images: image })
   }

   /** a built-in prefab to quickly
    * add a PreviewImage node to your ComfyUI graph */
   add_PreviewMask = (mask: _MASK): PreviewImage => {
      return this.nodes.PreviewImage({ images: this.nodes.MaskToImage({ mask: mask }) })
   }

   /** a built-in prefab to quickly
    * add a PreviewImage node to your ComfyUI graph */
   add_saveImage = (image: _IMAGE, prefix?: string): SaveImage => {
      return this.nodes.SaveImage({ images: image, filename_prefix: prefix })
   }

   // ====================================================================

   /** helper to auto-find an output slot and link use it for this input */
   AUTO = auto

   // ⏭️ /** @experimental */
   // ⏭️ findNode = <T extends keyof ComfySetup>(
   // ⏭️     //
   // ⏭️     nodeName: T,
   // ⏭️     p: Partial<Parameters<ComfySetup[T]>[0]>,
   // ⏭️ ): Maybe<ReturnType<ComfySetup[T]>> => {
   // ⏭️     const workflow = this.workflow
   // ⏭️     const node = workflow.nodes.find((n) => {
   // ⏭️         if (n.$schema.nameInCushy !== nodeName) return false
   // ⏭️         for (const key in p) {
   // ⏭️             if (JSON.stringify(n.json.inputs[key]) !== JSON.stringify(p[key])) return false
   // ⏭️         }
   // ⏭️         return true
   // ⏭️     })
   // ⏭️
   // ⏭️     return null
   // ⏭️ }

   /** helper to chose radomly any item from a list */
   chooseRandomly = <T>(key: string, seed: number, arr: T[]): T => {
      return createRandomGenerator(`${key}:${seed}`).randomItem(arr)!
   }

   // imageToStartFrom: Maybe<MediaImageL> = null
   /** execution context (image, canvas, mask, ...) */
   context: Maybe<DraftExecutionContext> = null

   /**
    * @internal
    * execute the draft
    */
   _EXECUTE = async (p: {
      //
      formInstance: FIELD
      context: DraftExecutionContext
      // imageToStartFrom?: Maybe<MediaImageL>
   }): Promise<RuntimeExecutionResult> => {
      const start = Date.now()
      const executable = this.step.executable
      const formResult = p.formInstance.value
      // const appFormInput = this.step.data.formResult
      const appFormSerial = this.step.data.formSerial.values_
      this.formResult = formResult as any
      this.formSerial = appFormSerial
      this.form = p.formInstance
      this.context = p.context

      // console.log(`🔴 before: size=${this.graph.nodes.length}`)
      // console.log(`FORM RESULT: data=${JSON.stringify(this.step.data.formResult, null, 3)}`)
      try {
         if (executable == null) {
            console.log(`❌ action not found`)
            return { type: 'error', error: 'action not found' }
         }
         await executable.run(this, formResult, this.context)
         // console.log(`🔴 after: size=${this.workflow.nodes.length}`)
         console.log('[✅] RUN SUCCESS')
         const duration = Date.now() - start
         return { type: 'success' }
      } catch (error: any /* 🔴 */) {
         console.error(error)
         // console.error('🌠', (error as any as Error).name)
         // console.error('🌠', (error as any as Error).message)
         // console.error('🌠', 'RUN FAILURE')
         this.Cushy.db.runtime_error.create({
            message: error.message ?? 'no-message',
            infos: toJSONError(error),
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

   doesComfyImageExist = async (imageInfo: {
      type: `input` | `ouput`
      subfolder: string
      filename: string
   }): Promise<boolean> => {
      return checkIfComfyImageExists(this.Cushy.getServerHostHTTP(), imageInfo)
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

   /** quick helper to make your card sleep for a given number fo milisecond */
   sleep = (ms: number): Promise<void> => new Promise<void>((r: () => void) => setTimeout(r, ms))

   // High level API--------------------

   expandBraces = (string: string): string[] => {
      return braceExpansion(string)
   }

   // ------------------------------------------------------------------------------------

   /** outputs a gaussian splat asset, accessible at the given URL */
   output_GaussianSplat = (p: { url: string }): void => {
      this.Cushy.db.media_splat.create({
         url: p.url,
         stepID: this.step.id,
      })
   }

   /** output a 3d scene from an image and its displacement and depth maps */
   output_3dImage = (p: {
      //
      image: ImageStoreName | MediaImageL
      depth: ImageStoreName | MediaImageL
      normal: ImageStoreName | MediaImageL
   }): void => {
      const getImg = (i: ImageStoreName | MediaImageL): MediaImageL => {
         if (typeof i === 'string') {
            const img = this.Store.getImageStore(i).image
            if (img == null) {
               console.log(
                  `[❌] all generated filenames:`,
                  this.generatedImages.map((gi) => gi.filename),
               )
               throw new Error(`no image found with prefix "${i}"`)
            }
            return img
         } else {
            return i
         }
      }
      const image = getImg(p.image)
      const depth = getImg(p.depth)
      const normal = getImg(p.normal)
      this.Cushy.db.media_3d_displacement.create({
         width: image.width,
         height: image.height,
         image: image.url,
         depthMap: depth.url,
         normalMap: normal.url,
         stepID: this.step.id,
      })
   }
   output_custom = <P extends Record<string, any>>(p: {
      //
      params: P
      view: CustomViewRef<P>
   }): void => {
      this.Cushy.db.media_custom.create({
         stepID: this.step.id,
         params: p.params,
         viewID: p.view.id,
      })
   }

   /** 🔴 unfinished */
   output_File = async (path: RelativePath, content: string): Promise<void> => {
      const absPath = this.Cushy.resolve(this.folder, path)
      writeFileSync(absPath, content, 'utf-8')
   }

   output_HTML = (p: { htmlContent: string; title: string }): void => {
      this.Cushy.db.media_text.create({
         kind: 'html',
         title: p.title,
         content: p.htmlContent,
         stepID: this.step.id,
      })
   }

   output_Markdown = (p: string | { title: string; markdownContent: string }): MediaTextL => {
      const title = typeof p === 'string' ? '<no-title>' : p.title
      const content = typeof p === 'string' ? p : p.markdownContent
      return this.Cushy.db.media_text.create({ kind: 'markdown', title, content, stepID: this.step.id })
   }

   output_text = (p: { title: string; message: Printable } | string): MediaTextL => {
      const [title, message] = typeof p === 'string' ? ['<no-title>', p] : [p.title, p.message]
      const msg = this.extractString(message)
      console.info(msg)
      return this.step.db.media_text.create({
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
   print = (message: Printable): void => {
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
   downloadURI = (uri: string, name: string): void => {
      const link = document.createElement('a')
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
   formatEmbeddingForComfyUI = (t: Embeddings): string => `embedding:${t}`
   formatAsRelativeDateTime = (date: Date | number): string => _formatAsRelativeDateTime(date)

   // 🐉 /** ask the user a few informations */
   // 🐉 ask: InfoRequestFn = async <const Req extends { [key: string]: Widget }>(
   // 🐉     //
   // 🐉     requestFn: (q: Builder) => Req,
   // 🐉     layout?: 0,
   // 🐉 ): Promise<{ [key in keyof Req]: InfoAnswer<Req[key]> }> => {
   // 🐉     const reqBuilder = new Builder()
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
      const cwd = this.Cushy.rootPath
      console.log('cwd', cwd)
      const res = execSync(comand, { encoding: 'utf-8', cwd })
      return res
   }

   /** built-in wildcards */
   get wildcards(): Wildcards {
      return this.Cushy.wildcards
   }

   /**
    * get a random int seed
    * between 0 and 99999999
    */
   randomSeed(): number {
      const seed = Math.floor(Math.random() * 99999999)
      // this.print('seed: ' + seed)
      return seed
   }

   loadImageAnswerAsEnum = (img: MediaImageL): Promise<Enum_LoadImage_image> => {
      return img.uploadAndReturnEnumName()
   }

   /** @deprecated */
   loadImageAnswer2 = (img: MediaImageL): MediaImageL => {
      return img
   }

   loadImage = (imageID: MediaImageID): MediaImageL => {
      return this.Cushy.db.media_image.getOrThrow(imageID)
   }

   loadImageAnswer = async (ia: MediaImageL): Promise<ImageAndMask> => {
      const img = this.Cushy.db.media_image.getOrThrow(ia.id)
      return img.loadInWorkflow(this.workflow)
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

   // INTERRACTIONS ------------------------------------------------------------------------------------------
   async PROMPT(p?: PromptSettings): Promise<ComfyPromptL> {
      // console.info('prompt requested')
      const prompt = await this.workflow.sendPrompt(p)
      await prompt.finished
      return prompt
   }

   private _promptCounter: number = 0
}
