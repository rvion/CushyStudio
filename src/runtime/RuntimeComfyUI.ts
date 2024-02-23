import type { Runtime } from './Runtime'

import { makeAutoObservable } from 'mobx'

import { ComfyWorkflowL } from 'src/models/ComfyWorkflow'
import { MediaImageL } from 'src/models/MediaImage'

/** namespace for all ComfyUI-related utils */
export class RuntimeComfyUI {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }

    // ----------------------------------------------------------------------------------------------------
    /** create a new empty ComfyUI workflow */
    create_emptyWorkflow = (): ComfyWorkflowL => {
        return this.rt.Cushy.db.graphs.create({
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
            chekpointName?: Enum_CheckpointLoaderSimple_ckpt_name
            positivePrompt?: string
            /** min:0, max:1 */
            denoise?: number
        } = {},
    ): ComfyWorkflowL => {
        const graph = this.rt.Cushy.db.graphs.create({
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
                  pixels: builder.Base64ImageInput({ bas64_image: p.from.url.replace('data:image/png;base64,', '') }),
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
    get schema() {
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
    get allCheckpoints(): Enum_CheckpointLoaderSimple_ckpt_name[] {
        return this.schema.getCheckpoints()
    }

    /**
     * throw if no checkpoints are available
     * 🔴 UNFINISHED: need a new config entry for that
     * 2023-12-21 for now, it just returns a random checkpoint
     * */
    get favoriteCheckpiont(): Enum_CheckpointLoaderSimple_ckpt_name {
        if (this.allCheckpoints.length == 0) throw new Error(`❌ no ComfUI checkpoints available at all`)
        if (this.allCheckpoints.includes('revAnimated_v122.safetensors')) return 'revAnimated_v122.safetensors'
        if (this.allCheckpoints.includes('lyriel_v15.safetensors')) return 'lyriel_v15.safetensors'
        return this.allCheckpoints[0]
    }
}
