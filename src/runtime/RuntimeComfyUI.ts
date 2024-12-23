import type { ComfySchemaL } from '../models/ComfySchema'
import type { ComfyWorkflowL } from '../models/ComfyWorkflow'
import type { MediaImageL } from '../models/MediaImage'
import type { CompiledPrompt } from '../prompt/FieldPrompt'
import type { Runtime } from './Runtime'

import { makeAutoObservable } from 'mobx'

import { compilePrompt } from '../prompt/compiler/_compile'

/** namespace for all ComfyUI-related utils */
export class RuntimeComfyUI {
   constructor(private rt: Runtime) {
      makeAutoObservable(this)
   }

   compilePrompt = (p: {
      text: string
      seed?: number /** for wildcard */
      onLora: (
         //
         lora: Comfy.Slots['LoraLoader.lora_name'],
         strength_clip: number,
         strength_model: number,
      ) => void
      /** @default true */
      printWildcards?: boolean
   }): CompiledPrompt =>
      compilePrompt({
         text: p.text,
         ctx: cushy,
         seed: p.seed,
         onLora: p.onLora,
         printWildcards: p.printWildcards ?? true,
      })

   // ----------------------------------------------------------------------------------------------------
   /** create a new empty ComfyUI workflow */
   create_emptyWorkflow = (): ComfyWorkflowL => {
      return this.rt.Cushy.db.comfy_workflow.create({
         stepID: this.rt.step.id,
         comfyPromptJSON: {},
         metadata: {},
      })
   }

   /** create a new very basic ComfyUI workflow */
   create_basicWorkflow = (
      p: {
         //
         from?: MediaImageL
         chekpointName?: Comfy.Slots['CheckpointLoaderSimple.ckpt_name']
         positivePrompt?: string
         /** min:0, max:1 */
         denoise?: number
      } = {},
   ): ComfyWorkflowL => {
      const graph = this.rt.Cushy.db.comfy_workflow.create({
         stepID: this.rt.step.id,
         comfyPromptJSON: {},
         metadata: {},
      })
      // below some example basic minimalist workflow just to get started
      const builder = graph.builder
      const model = builder.CheckpointLoaderSimple({
         ckpt_name: p.chekpointName ?? this.favoriteCheckpiont,
      })
      const latent = p.from //
         ? builder.VAEEncode({
              vae: model,
              pixels: builder['A8R8_ComfyUI_nodes.Base64ImageInput']({
                 // @ts-ignore 🔴 temporarilly ignored because it depends on some custom ComfyUI node that may not be present
                 bas64_image: p.from.url.replace('data:image/png;base64,', ''),
              }),
           })
         : builder.EmptyLatentImage({})
      builder.PreviewImage({
         images: builder.VAEDecode({
            vae: model,
            samples: builder.KSampler({
               denoise: p.denoise ?? 1,
               latent_image: latent,
               model: model,
               sampler_name: 'ddim',
               scheduler: 'ddim_uniform',
               positive: builder.CLIPTextEncode({
                  clip: model,
                  text: p.positivePrompt ?? 'masterpiece, sofa with a lamp',
               }),
               negative: builder.CLIPTextEncode({ clip: model, text: 'nsfw, nude' }),
            }),
         }),
      })
      return graph
   }

   // ----------------------------------------------------------------------------------------------------
   /** retrieve the global schema */
   get schema(): ComfySchemaL {
      return this.rt.Cushy.schema
   }

   /** check if the current connected ComfyUI backend has a given lora by name */
   hasLora = (loraName: string): boolean => {
      return this.schema.hasLora(loraName)
   }

   /** check if the current connected ComfyUI backend has a given checkpoint */
   hasCheckpoint = (loraName: string): boolean => {
      return this.schema.hasCheckpoint(loraName)
   }

   /** return the the list of every available checkpoints */
   get allCheckpoints(): Comfy.Slots['CheckpointLoaderSimple.ckpt_name'][] {
      return this.schema.getCheckpoints()
   }

   /**
    * throw if no checkpoints are available
    * 🔴 UNFINISHED: need a new config entry for that
    * 2023-12-21 for now, it just returns a random checkpoint
    * */
   get favoriteCheckpiont(): Comfy.Slots['CheckpointLoaderSimple.ckpt_name'] {
      if (this.allCheckpoints.length == 0) throw new Error(`❌ no ComfUI checkpoints available at all`)
      // @ts-ignore
      if (this.allCheckpoints.includes('revAnimated_v122.safetensors')) return 'revAnimated_v122.safetensors'
      // @ts-ignore 🔴 temporarilly ignored because it depends on some custom ComfyUI node that may not be present
      if (this.allCheckpoints.includes('lyriel_v15.safetensors')) return 'lyriel_v15.safetensors'
      return this.allCheckpoints[0]!
   }
}
