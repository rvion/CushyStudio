import type { ComfyNodeOutput } from './ComfyNodeOutput'
import type { ComfyNodeUID } from './ComfyNodeUID'
import type { ComfyNode } from './CSNode'
import type { ComfyNodeSchemaJSON } from './ComfySchemaJSON'
import type { ComfyGraph } from './ComfyGraph'

// TYPES -------------------------------
export type CLIP_VISION_OUTPUT = ComfyNodeOutput<'CLIP_VISION_OUTPUT'>
export type CONDITIONING = ComfyNodeOutput<'CONDITIONING'>
export type CLIP_VISION = ComfyNodeOutput<'CLIP_VISION'>
export type STYLE_MODEL = ComfyNodeOutput<'STYLE_MODEL'>
export type CONTROL_NET = ComfyNodeOutput<'CONTROL_NET'>
export type LATENT = ComfyNodeOutput<'LATENT'>
export type MODEL = ComfyNodeOutput<'MODEL'>
export type IMAGE = ComfyNodeOutput<'IMAGE'>
export type CLIP = ComfyNodeOutput<'CLIP'>
export type MASK = ComfyNodeOutput<'MASK'>
export type VAE = ComfyNodeOutput<'VAE'>
export type INT = number
export type FLOAT = number
export type STRING = string

// ENUMS -------------------------------
export type enum_KSampler_sampler_name =
    | 'ddim'
    | 'dpm_2'
    | 'dpm_2_ancestral'
    | 'dpm_adaptive'
    | 'dpm_fast'
    | 'dpmpp_2m'
    | 'dpmpp_2s_ancestral'
    | 'dpmpp_sde'
    | 'euler'
    | 'euler_ancestral'
    | 'heun'
    | 'lms'
    | 'uni_pc'
    | 'uni_pc_bh2'
export type enum_KSampler_scheduler = 'ddim_uniform' | 'karras' | 'normal' | 'simple'
export type enum_CheckpointLoader_config_name =
    | 'anything_v3.yaml'
    | 'v1-inference.yaml'
    | 'v1-inference_clip_skip_2.yaml'
    | 'v1-inference_clip_skip_2_fp16.yaml'
    | 'v1-inference_fp16.yaml'
    | 'v1-inpainting-inference.yaml'
    | 'v2-inference-v.yaml'
    | 'v2-inference-v_fp32.yaml'
    | 'v2-inference.yaml'
    | 'v2-inference_fp32.yaml'
    | 'v2-inpainting-inference.yaml'
export type enum_CheckpointLoader_ckpt_name = 'AbyssOrangeMix2_hard.safetensors' | 'v1-5-pruned-emaonly.ckpt'
export type enum_VAELoader_vae_name = 'vae-ft-mse-840000-ema-pruned.safetensors'
export type enum_LatentUpscale_upscale_method = 'area' | 'bilinear' | 'nearest-exact'
export type enum_LatentUpscale_crop = 'center' | 'disabled'
export type enum_LoadImage_image = 'example.png'
export type enum_LoadImageMask_channel = 'alpha' | 'blue' | 'green' | 'red'
export type enum_KSamplerAdvanced_add_noise = 'disable' | 'enable'
export type enum_LatentRotate_rotation = '180 degrees' | '270 degrees' | '90 degrees' | 'none'
export type enum_LatentFlip_flip_method = 'x-axis: vertically' | 'y-axis: horizontally'
export type enum_LoraLoader_lora_name = never

// INTERFACES --------------------------
export interface HasSingle_MODEL { _MODEL: MODEL } // prettier-ignore
export interface HasSingle_INT { _INT: INT } // prettier-ignore
export interface HasSingle_FLOAT { _FLOAT: FLOAT } // prettier-ignore
export interface HasSingle_CONDITIONING { _CONDITIONING: CONDITIONING } // prettier-ignore
export interface HasSingle_LATENT { _LATENT: LATENT } // prettier-ignore
export interface HasSingle_STRING { _STRING: STRING } // prettier-ignore
export interface HasSingle_CLIP { _CLIP: CLIP } // prettier-ignore
export interface HasSingle_VAE { _VAE: VAE } // prettier-ignore
export interface HasSingle_IMAGE { _IMAGE: IMAGE } // prettier-ignore
export interface HasSingle_MASK { _MASK: MASK } // prettier-ignore
export interface HasSingle_CLIP_VISION { _CLIP_VISION: CLIP_VISION } // prettier-ignore
export interface HasSingle_STYLE_MODEL { _STYLE_MODEL: STYLE_MODEL } // prettier-ignore
export interface HasSingle_CLIP_VISION_OUTPUT { _CLIP_VISION_OUTPUT: CLIP_VISION_OUTPUT } // prettier-ignore
export interface HasSingle_CONTROL_NET { _CONTROL_NET: CONTROL_NET } // prettier-ignore
export interface HasSingle_enum_KSampler_sampler_name { _enum_KSampler_sampler_name: enum_KSampler_sampler_name } // prettier-ignore
export interface HasSingle_enum_KSampler_scheduler { _enum_KSampler_scheduler: enum_KSampler_scheduler } // prettier-ignore
export interface HasSingle_enum_CheckpointLoader_config_name { _enum_CheckpointLoader_config_name: enum_CheckpointLoader_config_name } // prettier-ignore
export interface HasSingle_enum_CheckpointLoader_ckpt_name { _enum_CheckpointLoader_ckpt_name: enum_CheckpointLoader_ckpt_name } // prettier-ignore
export interface HasSingle_enum_VAELoader_vae_name { _enum_VAELoader_vae_name: enum_VAELoader_vae_name } // prettier-ignore
export interface HasSingle_enum_LatentUpscale_upscale_method { _enum_LatentUpscale_upscale_method: enum_LatentUpscale_upscale_method } // prettier-ignore
export interface HasSingle_enum_LatentUpscale_crop { _enum_LatentUpscale_crop: enum_LatentUpscale_crop } // prettier-ignore
export interface HasSingle_enum_LoadImage_image { _enum_LoadImage_image: enum_LoadImage_image } // prettier-ignore
export interface HasSingle_enum_LoadImageMask_channel { _enum_LoadImageMask_channel: enum_LoadImageMask_channel } // prettier-ignore
export interface HasSingle_enum_KSamplerAdvanced_add_noise { _enum_KSamplerAdvanced_add_noise: enum_KSamplerAdvanced_add_noise } // prettier-ignore
export interface HasSingle_enum_LatentRotate_rotation { _enum_LatentRotate_rotation: enum_LatentRotate_rotation } // prettier-ignore
export interface HasSingle_enum_LatentFlip_flip_method { _enum_LatentFlip_flip_method: enum_LatentFlip_flip_method } // prettier-ignore
export interface HasSingle_enum_LoraLoader_lora_name { _enum_LoraLoader_lora_name: enum_LoraLoader_lora_name } // prettier-ignore

// NODES -------------------------------
// |=============================================================================|
// | KSampler                                                                    |
// |=============================================================================|
export interface KSampler extends HasSingle_LATENT, ComfyNode<KSampler_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>
}

export type KSampler_input = {
    model: MODEL | HasSingle_MODEL
    seed: INT
    steps: INT
    cfg: FLOAT
    sampler_name: enum_KSampler_sampler_name | HasSingle_enum_KSampler_sampler_name
    scheduler: enum_KSampler_scheduler | HasSingle_enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    latent_image: LATENT | HasSingle_LATENT
    denoise: FLOAT
}

// |=============================================================================|
// | CheckpointLoader                                                            |
// |=============================================================================|
export interface CheckpointLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<CheckpointLoader_input> {
    MODEL: ComfyNodeOutput<'MODEL', 0>
    CLIP: ComfyNodeOutput<'CLIP', 1>
    VAE: ComfyNodeOutput<'VAE', 2>
}

export type CheckpointLoader_input = {
    config_name: enum_CheckpointLoader_config_name | HasSingle_enum_CheckpointLoader_config_name
    ckpt_name: enum_CheckpointLoader_ckpt_name | HasSingle_enum_CheckpointLoader_ckpt_name
}

// |=============================================================================|
// | CheckpointLoaderSimple                                                      |
// |=============================================================================|
export interface CheckpointLoaderSimple
    extends HasSingle_MODEL,
        HasSingle_CLIP,
        HasSingle_VAE,
        ComfyNode<CheckpointLoaderSimple_input> {
    MODEL: ComfyNodeOutput<'MODEL', 0>
    CLIP: ComfyNodeOutput<'CLIP', 1>
    VAE: ComfyNodeOutput<'VAE', 2>
}

export type CheckpointLoaderSimple_input = {
    ckpt_name: enum_CheckpointLoader_ckpt_name | HasSingle_enum_CheckpointLoader_ckpt_name
}

// |=============================================================================|
// | CLIPTextEncode                                                              |
// |=============================================================================|
export interface CLIPTextEncode extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncode_input> {
    CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>
}

export type CLIPTextEncode_input = {
    text: STRING
    clip: CLIP | HasSingle_CLIP
}

// |=============================================================================|
// | CLIPSetLastLayer                                                            |
// |=============================================================================|
export interface CLIPSetLastLayer extends HasSingle_CLIP, ComfyNode<CLIPSetLastLayer_input> {
    CLIP: ComfyNodeOutput<'CLIP', 0>
}

export type CLIPSetLastLayer_input = {
    clip: CLIP | HasSingle_CLIP
    stop_at_clip_layer: INT
}

// |=============================================================================|
// | VAEDecode                                                                   |
// |=============================================================================|
export interface VAEDecode extends HasSingle_IMAGE, ComfyNode<VAEDecode_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>
}

export type VAEDecode_input = {
    samples: LATENT | HasSingle_LATENT
    vae: VAE | HasSingle_VAE
}

// |=============================================================================|
// | VAEEncode                                                                   |
// |=============================================================================|
export interface VAEEncode extends HasSingle_LATENT, ComfyNode<VAEEncode_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>
}

export type VAEEncode_input = {
    pixels: IMAGE | HasSingle_IMAGE
    vae: VAE | HasSingle_VAE
}

// |=============================================================================|
// | VAEEncodeForInpaint                                                         |
// |=============================================================================|
export interface VAEEncodeForInpaint extends HasSingle_LATENT, ComfyNode<VAEEncodeForInpaint_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>
}

export type VAEEncodeForInpaint_input = {
    pixels: IMAGE | HasSingle_IMAGE
    vae: VAE | HasSingle_VAE
    mask: MASK | HasSingle_MASK
}

// |=============================================================================|
// | VAELoader                                                                   |
// |=============================================================================|
export interface VAELoader extends HasSingle_VAE, ComfyNode<VAELoader_input> {
    VAE: ComfyNodeOutput<'VAE', 0>
}

export type VAELoader_input = {
    vae_name: enum_VAELoader_vae_name | HasSingle_enum_VAELoader_vae_name
}

// |=============================================================================|
// | EmptyLatentImage                                                            |
// |=============================================================================|
export interface EmptyLatentImage extends HasSingle_LATENT, ComfyNode<EmptyLatentImage_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>
}

export type EmptyLatentImage_input = {
    width: INT
    height: INT
    batch_size: INT
}

// |=============================================================================|
// | LatentUpscale                                                               |
// |=============================================================================|
export interface LatentUpscale extends HasSingle_LATENT, ComfyNode<LatentUpscale_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>
}

export type LatentUpscale_input = {
    samples: LATENT | HasSingle_LATENT
    upscale_method: enum_LatentUpscale_upscale_method | HasSingle_enum_LatentUpscale_upscale_method
    width: INT
    height: INT
    crop: enum_LatentUpscale_crop | HasSingle_enum_LatentUpscale_crop
}

// |=============================================================================|
// | SaveImage                                                                   |
// |=============================================================================|
export interface SaveImage extends ComfyNode<SaveImage_input> {}

export type SaveImage_input = {
    images: IMAGE | HasSingle_IMAGE
    filename_prefix: STRING
}

// |=============================================================================|
// | LoadImage                                                                   |
// |=============================================================================|
export interface LoadImage extends HasSingle_IMAGE, ComfyNode<LoadImage_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>
}

export type LoadImage_input = {
    image: enum_LoadImage_image | HasSingle_enum_LoadImage_image
}

// |=============================================================================|
// | LoadImageMask                                                               |
// |=============================================================================|
export interface LoadImageMask extends HasSingle_MASK, ComfyNode<LoadImageMask_input> {
    MASK: ComfyNodeOutput<'MASK', 0>
}

export type LoadImageMask_input = {
    image: enum_LoadImage_image | HasSingle_enum_LoadImage_image
    channel: enum_LoadImageMask_channel | HasSingle_enum_LoadImageMask_channel
}

// |=============================================================================|
// | ImageScale                                                                  |
// |=============================================================================|
export interface ImageScale extends HasSingle_IMAGE, ComfyNode<ImageScale_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>
}

export type ImageScale_input = {
    image: IMAGE | HasSingle_IMAGE
    upscale_method: enum_LatentUpscale_upscale_method | HasSingle_enum_LatentUpscale_upscale_method
    width: INT
    height: INT
    crop: enum_LatentUpscale_crop | HasSingle_enum_LatentUpscale_crop
}

// |=============================================================================|
// | ImageInvert                                                                 |
// |=============================================================================|
export interface ImageInvert extends HasSingle_IMAGE, ComfyNode<ImageInvert_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>
}

export type ImageInvert_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | ConditioningCombine                                                         |
// |=============================================================================|
export interface ConditioningCombine extends HasSingle_CONDITIONING, ComfyNode<ConditioningCombine_input> {
    CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>
}

export type ConditioningCombine_input = {
    conditioning_1: CONDITIONING | HasSingle_CONDITIONING
    conditioning_2: CONDITIONING | HasSingle_CONDITIONING
}

// |=============================================================================|
// | ConditioningSetArea                                                         |
// |=============================================================================|
export interface ConditioningSetArea extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetArea_input> {
    CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>
}

export type ConditioningSetArea_input = {
    conditioning: CONDITIONING | HasSingle_CONDITIONING
    width: INT
    height: INT
    x: INT
    y: INT
    strength: FLOAT
}

// |=============================================================================|
// | KSamplerAdvanced                                                            |
// |=============================================================================|
export interface KSamplerAdvanced extends HasSingle_LATENT, ComfyNode<KSamplerAdvanced_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>
}

export type KSamplerAdvanced_input = {
    model: MODEL | HasSingle_MODEL
    add_noise: enum_KSamplerAdvanced_add_noise | HasSingle_enum_KSamplerAdvanced_add_noise
    noise_seed: INT
    steps: INT
    cfg: FLOAT
    sampler_name: enum_KSampler_sampler_name | HasSingle_enum_KSampler_sampler_name
    scheduler: enum_KSampler_scheduler | HasSingle_enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    latent_image: LATENT | HasSingle_LATENT
    start_at_step: INT
    end_at_step: INT
    return_with_leftover_noise: enum_KSamplerAdvanced_add_noise | HasSingle_enum_KSamplerAdvanced_add_noise
}

// |=============================================================================|
// | SetLatentNoiseMask                                                          |
// |=============================================================================|
export interface SetLatentNoiseMask extends HasSingle_LATENT, ComfyNode<SetLatentNoiseMask_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>
}

export type SetLatentNoiseMask_input = {
    samples: LATENT | HasSingle_LATENT
    mask: MASK | HasSingle_MASK
}

// |=============================================================================|
// | LatentComposite                                                             |
// |=============================================================================|
export interface LatentComposite extends HasSingle_LATENT, ComfyNode<LatentComposite_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>
}

export type LatentComposite_input = {
    samples_to: LATENT | HasSingle_LATENT
    samples_from: LATENT | HasSingle_LATENT
    x: INT
    y: INT
    feather: INT
}

// |=============================================================================|
// | LatentRotate                                                                |
// |=============================================================================|
export interface LatentRotate extends HasSingle_LATENT, ComfyNode<LatentRotate_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>
}

export type LatentRotate_input = {
    samples: LATENT | HasSingle_LATENT
    rotation: enum_LatentRotate_rotation | HasSingle_enum_LatentRotate_rotation
}

// |=============================================================================|
// | LatentFlip                                                                  |
// |=============================================================================|
export interface LatentFlip extends HasSingle_LATENT, ComfyNode<LatentFlip_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>
}

export type LatentFlip_input = {
    samples: LATENT | HasSingle_LATENT
    flip_method: enum_LatentFlip_flip_method | HasSingle_enum_LatentFlip_flip_method
}

// |=============================================================================|
// | LatentCrop                                                                  |
// |=============================================================================|
export interface LatentCrop extends HasSingle_LATENT, ComfyNode<LatentCrop_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>
}

export type LatentCrop_input = {
    samples: LATENT | HasSingle_LATENT
    width: INT
    height: INT
    x: INT
    y: INT
}

// |=============================================================================|
// | LoraLoader                                                                  |
// |=============================================================================|
export interface LoraLoader extends HasSingle_MODEL, HasSingle_CLIP, ComfyNode<LoraLoader_input> {
    MODEL: ComfyNodeOutput<'MODEL', 0>
    CLIP: ComfyNodeOutput<'CLIP', 1>
}

export type LoraLoader_input = {
    model: MODEL | HasSingle_MODEL
    clip: CLIP | HasSingle_CLIP
    lora_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name
    strength_model: FLOAT
    strength_clip: FLOAT
}

// |=============================================================================|
// | CLIPLoader                                                                  |
// |=============================================================================|
export interface CLIPLoader extends HasSingle_CLIP, ComfyNode<CLIPLoader_input> {
    CLIP: ComfyNodeOutput<'CLIP', 0>
}

export type CLIPLoader_input = {
    clip_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name
}

// |=============================================================================|
// | CLIPVisionEncode                                                            |
// |=============================================================================|
export interface CLIPVisionEncode extends HasSingle_CLIP_VISION_OUTPUT, ComfyNode<CLIPVisionEncode_input> {
    CLIP_VISION_OUTPUT: ComfyNodeOutput<'CLIP_VISION_OUTPUT', 0>
}

export type CLIPVisionEncode_input = {
    clip_vision: CLIP_VISION | HasSingle_CLIP_VISION
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | StyleModelApply                                                             |
// |=============================================================================|
export interface StyleModelApply extends HasSingle_CONDITIONING, ComfyNode<StyleModelApply_input> {
    CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>
}

export type StyleModelApply_input = {
    conditioning: CONDITIONING | HasSingle_CONDITIONING
    style_model: STYLE_MODEL | HasSingle_STYLE_MODEL
    clip_vision_output: CLIP_VISION_OUTPUT | HasSingle_CLIP_VISION_OUTPUT
}

// |=============================================================================|
// | ControlNetApply                                                             |
// |=============================================================================|
export interface ControlNetApply extends HasSingle_CONDITIONING, ComfyNode<ControlNetApply_input> {
    CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>
}

export type ControlNetApply_input = {
    conditioning: CONDITIONING | HasSingle_CONDITIONING
    control_net: CONTROL_NET | HasSingle_CONTROL_NET
    image: IMAGE | HasSingle_IMAGE
    strength: FLOAT
}

// |=============================================================================|
// | ControlNetLoader                                                            |
// |=============================================================================|
export interface ControlNetLoader extends HasSingle_CONTROL_NET, ComfyNode<ControlNetLoader_input> {
    CONTROL_NET: ComfyNodeOutput<'CONTROL_NET', 0>
}

export type ControlNetLoader_input = {
    control_net_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name
}

// |=============================================================================|
// | DiffControlNetLoader                                                        |
// |=============================================================================|
export interface DiffControlNetLoader extends HasSingle_CONTROL_NET, ComfyNode<DiffControlNetLoader_input> {
    CONTROL_NET: ComfyNodeOutput<'CONTROL_NET', 0>
}

export type DiffControlNetLoader_input = {
    model: MODEL | HasSingle_MODEL
    control_net_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name
}

// |=============================================================================|
// | T2IAdapterLoader                                                            |
// |=============================================================================|
export interface T2IAdapterLoader extends HasSingle_CONTROL_NET, ComfyNode<T2IAdapterLoader_input> {
    CONTROL_NET: ComfyNodeOutput<'CONTROL_NET', 0>
}

export type T2IAdapterLoader_input = {
    t2i_adapter_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name
}

// |=============================================================================|
// | StyleModelLoader                                                            |
// |=============================================================================|
export interface StyleModelLoader extends HasSingle_STYLE_MODEL, ComfyNode<StyleModelLoader_input> {
    STYLE_MODEL: ComfyNodeOutput<'STYLE_MODEL', 0>
}

export type StyleModelLoader_input = {
    style_model_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name
}

// |=============================================================================|
// | CLIPVisionLoader                                                            |
// |=============================================================================|
export interface CLIPVisionLoader extends HasSingle_CLIP_VISION, ComfyNode<CLIPVisionLoader_input> {
    CLIP_VISION: ComfyNodeOutput<'CLIP_VISION', 0>
}

export type CLIPVisionLoader_input = {
    clip_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name
}

// |=============================================================================|
// | VAEDecodeTiled                                                              |
// |=============================================================================|
export interface VAEDecodeTiled extends HasSingle_IMAGE, ComfyNode<VAEDecodeTiled_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>
}

export type VAEDecodeTiled_input = {
    samples: LATENT | HasSingle_LATENT
    vae: VAE | HasSingle_VAE
}

// INDEX -------------------------------
export type Schemas = {
    KSampler: ComfyNodeSchemaJSON
    CheckpointLoader: ComfyNodeSchemaJSON
    CheckpointLoaderSimple: ComfyNodeSchemaJSON
    CLIPTextEncode: ComfyNodeSchemaJSON
    CLIPSetLastLayer: ComfyNodeSchemaJSON
    VAEDecode: ComfyNodeSchemaJSON
    VAEEncode: ComfyNodeSchemaJSON
    VAEEncodeForInpaint: ComfyNodeSchemaJSON
    VAELoader: ComfyNodeSchemaJSON
    EmptyLatentImage: ComfyNodeSchemaJSON
    LatentUpscale: ComfyNodeSchemaJSON
    SaveImage: ComfyNodeSchemaJSON
    LoadImage: ComfyNodeSchemaJSON
    LoadImageMask: ComfyNodeSchemaJSON
    ImageScale: ComfyNodeSchemaJSON
    ImageInvert: ComfyNodeSchemaJSON
    ConditioningCombine: ComfyNodeSchemaJSON
    ConditioningSetArea: ComfyNodeSchemaJSON
    KSamplerAdvanced: ComfyNodeSchemaJSON
    SetLatentNoiseMask: ComfyNodeSchemaJSON
    LatentComposite: ComfyNodeSchemaJSON
    LatentRotate: ComfyNodeSchemaJSON
    LatentFlip: ComfyNodeSchemaJSON
    LatentCrop: ComfyNodeSchemaJSON
    LoraLoader: ComfyNodeSchemaJSON
    CLIPLoader: ComfyNodeSchemaJSON
    CLIPVisionEncode: ComfyNodeSchemaJSON
    StyleModelApply: ComfyNodeSchemaJSON
    ControlNetApply: ComfyNodeSchemaJSON
    ControlNetLoader: ComfyNodeSchemaJSON
    DiffControlNetLoader: ComfyNodeSchemaJSON
    T2IAdapterLoader: ComfyNodeSchemaJSON
    StyleModelLoader: ComfyNodeSchemaJSON
    CLIPVisionLoader: ComfyNodeSchemaJSON
    VAEDecodeTiled: ComfyNodeSchemaJSON
}
export type ComfyNodeType = keyof Schemas

// Entrypoint --------------------------
export interface ComfySetup {
    KSampler(args: KSampler_input, uid?: ComfyNodeUID): KSampler
    CheckpointLoader(args: CheckpointLoader_input, uid?: ComfyNodeUID): CheckpointLoader
    CheckpointLoaderSimple(args: CheckpointLoaderSimple_input, uid?: ComfyNodeUID): CheckpointLoaderSimple
    CLIPTextEncode(args: CLIPTextEncode_input, uid?: ComfyNodeUID): CLIPTextEncode
    CLIPSetLastLayer(args: CLIPSetLastLayer_input, uid?: ComfyNodeUID): CLIPSetLastLayer
    VAEDecode(args: VAEDecode_input, uid?: ComfyNodeUID): VAEDecode
    VAEEncode(args: VAEEncode_input, uid?: ComfyNodeUID): VAEEncode
    VAEEncodeForInpaint(args: VAEEncodeForInpaint_input, uid?: ComfyNodeUID): VAEEncodeForInpaint
    VAELoader(args: VAELoader_input, uid?: ComfyNodeUID): VAELoader
    EmptyLatentImage(args: EmptyLatentImage_input, uid?: ComfyNodeUID): EmptyLatentImage
    LatentUpscale(args: LatentUpscale_input, uid?: ComfyNodeUID): LatentUpscale
    SaveImage(args: SaveImage_input, uid?: ComfyNodeUID): SaveImage
    LoadImage(args: LoadImage_input, uid?: ComfyNodeUID): LoadImage
    LoadImageMask(args: LoadImageMask_input, uid?: ComfyNodeUID): LoadImageMask
    ImageScale(args: ImageScale_input, uid?: ComfyNodeUID): ImageScale
    ImageInvert(args: ImageInvert_input, uid?: ComfyNodeUID): ImageInvert
    ConditioningCombine(args: ConditioningCombine_input, uid?: ComfyNodeUID): ConditioningCombine
    ConditioningSetArea(args: ConditioningSetArea_input, uid?: ComfyNodeUID): ConditioningSetArea
    KSamplerAdvanced(args: KSamplerAdvanced_input, uid?: ComfyNodeUID): KSamplerAdvanced
    SetLatentNoiseMask(args: SetLatentNoiseMask_input, uid?: ComfyNodeUID): SetLatentNoiseMask
    LatentComposite(args: LatentComposite_input, uid?: ComfyNodeUID): LatentComposite
    LatentRotate(args: LatentRotate_input, uid?: ComfyNodeUID): LatentRotate
    LatentFlip(args: LatentFlip_input, uid?: ComfyNodeUID): LatentFlip
    LatentCrop(args: LatentCrop_input, uid?: ComfyNodeUID): LatentCrop
    LoraLoader(args: LoraLoader_input, uid?: ComfyNodeUID): LoraLoader
    CLIPLoader(args: CLIPLoader_input, uid?: ComfyNodeUID): CLIPLoader
    CLIPVisionEncode(args: CLIPVisionEncode_input, uid?: ComfyNodeUID): CLIPVisionEncode
    StyleModelApply(args: StyleModelApply_input, uid?: ComfyNodeUID): StyleModelApply
    ControlNetApply(args: ControlNetApply_input, uid?: ComfyNodeUID): ControlNetApply
    ControlNetLoader(args: ControlNetLoader_input, uid?: ComfyNodeUID): ControlNetLoader
    DiffControlNetLoader(args: DiffControlNetLoader_input, uid?: ComfyNodeUID): DiffControlNetLoader
    T2IAdapterLoader(args: T2IAdapterLoader_input, uid?: ComfyNodeUID): T2IAdapterLoader
    StyleModelLoader(args: StyleModelLoader_input, uid?: ComfyNodeUID): StyleModelLoader
    CLIPVisionLoader(args: CLIPVisionLoader_input, uid?: ComfyNodeUID): CLIPVisionLoader
    VAEDecodeTiled(args: VAEDecodeTiled_input, uid?: ComfyNodeUID): VAEDecodeTiled

    // misc
}

declare const C: ComfySetup & ComfyGraph
