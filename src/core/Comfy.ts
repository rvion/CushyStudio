import type { ComfyNodeOutput } from './ComfyNodeOutput'
import type { ComfyNodeSchema } from './ComfyNodeSchema'
import type { ComfyNodeUID } from './ComfyNodeUID'
import type { ComfyNode } from './ComfyNode'

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
// prettier-ignore
export const KSampler_schema: ComfyNodeSchema = {
    type: 'KSampler',
    input: [{"name":"model","type":"MODEL"},{"name":"seed","type":"INT","opts":{"default":0,"min":0,"max":18446744073709552000}},{"name":"steps","type":"INT","opts":{"default":20,"min":1,"max":10000}},{"name":"cfg","type":"FLOAT","opts":{"default":8,"min":0,"max":100}},{"name":"sampler_name","type":"enum_KSampler_sampler_name"},{"name":"scheduler","type":"enum_KSampler_scheduler"},{"name":"positive","type":"CONDITIONING"},{"name":"negative","type":"CONDITIONING"},{"name":"latent_image","type":"LATENT"},{"name":"denoise","type":"FLOAT","opts":{"default":1,"min":0,"max":1,"step":0.01}}],
    outputs: [{"type":"LATENT","name":"LATENT"}],
    category: "sampling",
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
// prettier-ignore
export const CheckpointLoader_schema: ComfyNodeSchema = {
    type: 'CheckpointLoader',
    input: [{"name":"config_name","type":"enum_CheckpointLoader_config_name"},{"name":"ckpt_name","type":"enum_CheckpointLoader_ckpt_name"}],
    outputs: [{"type":"MODEL","name":"MODEL"},{"type":"CLIP","name":"CLIP"},{"type":"VAE","name":"VAE"}],
    category: "loaders",
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
// prettier-ignore
export const CheckpointLoaderSimple_schema: ComfyNodeSchema = {
    type: 'CheckpointLoaderSimple',
    input: [{"name":"ckpt_name","type":"enum_CheckpointLoader_ckpt_name"}],
    outputs: [{"type":"MODEL","name":"MODEL"},{"type":"CLIP","name":"CLIP"},{"type":"VAE","name":"VAE"}],
    category: "loaders",
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
// prettier-ignore
export const CLIPTextEncode_schema: ComfyNodeSchema = {
    type: 'CLIPTextEncode',
    input: [{"name":"text","type":"STRING","opts":{"multiline":true}},{"name":"clip","type":"CLIP"}],
    outputs: [{"type":"CONDITIONING","name":"CONDITIONING"}],
    category: "conditioning",
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
// prettier-ignore
export const CLIPSetLastLayer_schema: ComfyNodeSchema = {
    type: 'CLIPSetLastLayer',
    input: [{"name":"clip","type":"CLIP"},{"name":"stop_at_clip_layer","type":"INT","opts":{"default":-1,"min":-24,"max":-1,"step":1}}],
    outputs: [{"type":"CLIP","name":"CLIP"}],
    category: "conditioning",
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
// prettier-ignore
export const VAEDecode_schema: ComfyNodeSchema = {
    type: 'VAEDecode',
    input: [{"name":"samples","type":"LATENT"},{"name":"vae","type":"VAE"}],
    outputs: [{"type":"IMAGE","name":"IMAGE"}],
    category: "latent",
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
// prettier-ignore
export const VAEEncode_schema: ComfyNodeSchema = {
    type: 'VAEEncode',
    input: [{"name":"pixels","type":"IMAGE"},{"name":"vae","type":"VAE"}],
    outputs: [{"type":"LATENT","name":"LATENT"}],
    category: "latent",
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
// prettier-ignore
export const VAEEncodeForInpaint_schema: ComfyNodeSchema = {
    type: 'VAEEncodeForInpaint',
    input: [{"name":"pixels","type":"IMAGE"},{"name":"vae","type":"VAE"},{"name":"mask","type":"MASK"}],
    outputs: [{"type":"LATENT","name":"LATENT"}],
    category: "latent_inpaint",
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
// prettier-ignore
export const VAELoader_schema: ComfyNodeSchema = {
    type: 'VAELoader',
    input: [{"name":"vae_name","type":"enum_VAELoader_vae_name"}],
    outputs: [{"type":"VAE","name":"VAE"}],
    category: "loaders",
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
// prettier-ignore
export const EmptyLatentImage_schema: ComfyNodeSchema = {
    type: 'EmptyLatentImage',
    input: [{"name":"width","type":"INT","opts":{"default":512,"min":64,"max":4096,"step":64}},{"name":"height","type":"INT","opts":{"default":512,"min":64,"max":4096,"step":64}},{"name":"batch_size","type":"INT","opts":{"default":1,"min":1,"max":64}}],
    outputs: [{"type":"LATENT","name":"LATENT"}],
    category: "latent",
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
// prettier-ignore
export const LatentUpscale_schema: ComfyNodeSchema = {
    type: 'LatentUpscale',
    input: [{"name":"samples","type":"LATENT"},{"name":"upscale_method","type":"enum_LatentUpscale_upscale_method"},{"name":"width","type":"INT","opts":{"default":512,"min":64,"max":4096,"step":64}},{"name":"height","type":"INT","opts":{"default":512,"min":64,"max":4096,"step":64}},{"name":"crop","type":"enum_LatentUpscale_crop"}],
    outputs: [{"type":"LATENT","name":"LATENT"}],
    category: "latent",
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
// prettier-ignore
export const SaveImage_schema: ComfyNodeSchema = {
    type: 'SaveImage',
    input: [{"name":"images","type":"IMAGE"},{"name":"filename_prefix","type":"STRING","opts":{"default":"ComfyUI"}}],
    outputs: [],
    category: "image",
}
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
// prettier-ignore
export const LoadImage_schema: ComfyNodeSchema = {
    type: 'LoadImage',
    input: [{"name":"image","type":"enum_LoadImage_image"}],
    outputs: [{"type":"IMAGE","name":"IMAGE"}],
    category: "image",
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
// prettier-ignore
export const LoadImageMask_schema: ComfyNodeSchema = {
    type: 'LoadImageMask',
    input: [{"name":"image","type":"enum_LoadImage_image"},{"name":"channel","type":"enum_LoadImageMask_channel"}],
    outputs: [{"type":"MASK","name":"MASK"}],
    category: "image",
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
// prettier-ignore
export const ImageScale_schema: ComfyNodeSchema = {
    type: 'ImageScale',
    input: [{"name":"image","type":"IMAGE"},{"name":"upscale_method","type":"enum_LatentUpscale_upscale_method"},{"name":"width","type":"INT","opts":{"default":512,"min":1,"max":4096,"step":1}},{"name":"height","type":"INT","opts":{"default":512,"min":1,"max":4096,"step":1}},{"name":"crop","type":"enum_LatentUpscale_crop"}],
    outputs: [{"type":"IMAGE","name":"IMAGE"}],
    category: "image",
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
// prettier-ignore
export const ImageInvert_schema: ComfyNodeSchema = {
    type: 'ImageInvert',
    input: [{"name":"image","type":"IMAGE"}],
    outputs: [{"type":"IMAGE","name":"IMAGE"}],
    category: "image",
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
// prettier-ignore
export const ConditioningCombine_schema: ComfyNodeSchema = {
    type: 'ConditioningCombine',
    input: [{"name":"conditioning_1","type":"CONDITIONING"},{"name":"conditioning_2","type":"CONDITIONING"}],
    outputs: [{"type":"CONDITIONING","name":"CONDITIONING"}],
    category: "conditioning",
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
// prettier-ignore
export const ConditioningSetArea_schema: ComfyNodeSchema = {
    type: 'ConditioningSetArea',
    input: [{"name":"conditioning","type":"CONDITIONING"},{"name":"width","type":"INT","opts":{"default":64,"min":64,"max":4096,"step":64}},{"name":"height","type":"INT","opts":{"default":64,"min":64,"max":4096,"step":64}},{"name":"x","type":"INT","opts":{"default":0,"min":0,"max":4096,"step":64}},{"name":"y","type":"INT","opts":{"default":0,"min":0,"max":4096,"step":64}},{"name":"strength","type":"FLOAT","opts":{"default":1,"min":0,"max":10,"step":0.01}}],
    outputs: [{"type":"CONDITIONING","name":"CONDITIONING"}],
    category: "conditioning",
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
// prettier-ignore
export const KSamplerAdvanced_schema: ComfyNodeSchema = {
    type: 'KSamplerAdvanced',
    input: [{"name":"model","type":"MODEL"},{"name":"add_noise","type":"enum_KSamplerAdvanced_add_noise"},{"name":"noise_seed","type":"INT","opts":{"default":0,"min":0,"max":18446744073709552000}},{"name":"steps","type":"INT","opts":{"default":20,"min":1,"max":10000}},{"name":"cfg","type":"FLOAT","opts":{"default":8,"min":0,"max":100}},{"name":"sampler_name","type":"enum_KSampler_sampler_name"},{"name":"scheduler","type":"enum_KSampler_scheduler"},{"name":"positive","type":"CONDITIONING"},{"name":"negative","type":"CONDITIONING"},{"name":"latent_image","type":"LATENT"},{"name":"start_at_step","type":"INT","opts":{"default":0,"min":0,"max":10000}},{"name":"end_at_step","type":"INT","opts":{"default":10000,"min":0,"max":10000}},{"name":"return_with_leftover_noise","type":"enum_KSamplerAdvanced_add_noise"}],
    outputs: [{"type":"LATENT","name":"LATENT"}],
    category: "sampling",
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
// prettier-ignore
export const SetLatentNoiseMask_schema: ComfyNodeSchema = {
    type: 'SetLatentNoiseMask',
    input: [{"name":"samples","type":"LATENT"},{"name":"mask","type":"MASK"}],
    outputs: [{"type":"LATENT","name":"LATENT"}],
    category: "latent_inpaint",
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
// prettier-ignore
export const LatentComposite_schema: ComfyNodeSchema = {
    type: 'LatentComposite',
    input: [{"name":"samples_to","type":"LATENT"},{"name":"samples_from","type":"LATENT"},{"name":"x","type":"INT","opts":{"default":0,"min":0,"max":4096,"step":8}},{"name":"y","type":"INT","opts":{"default":0,"min":0,"max":4096,"step":8}},{"name":"feather","type":"INT","opts":{"default":0,"min":0,"max":4096,"step":8}}],
    outputs: [{"type":"LATENT","name":"LATENT"}],
    category: "latent",
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
// prettier-ignore
export const LatentRotate_schema: ComfyNodeSchema = {
    type: 'LatentRotate',
    input: [{"name":"samples","type":"LATENT"},{"name":"rotation","type":"enum_LatentRotate_rotation"}],
    outputs: [{"type":"LATENT","name":"LATENT"}],
    category: "latent_transform",
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
// prettier-ignore
export const LatentFlip_schema: ComfyNodeSchema = {
    type: 'LatentFlip',
    input: [{"name":"samples","type":"LATENT"},{"name":"flip_method","type":"enum_LatentFlip_flip_method"}],
    outputs: [{"type":"LATENT","name":"LATENT"}],
    category: "latent_transform",
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
// prettier-ignore
export const LatentCrop_schema: ComfyNodeSchema = {
    type: 'LatentCrop',
    input: [{"name":"samples","type":"LATENT"},{"name":"width","type":"INT","opts":{"default":512,"min":64,"max":4096,"step":64}},{"name":"height","type":"INT","opts":{"default":512,"min":64,"max":4096,"step":64}},{"name":"x","type":"INT","opts":{"default":0,"min":0,"max":4096,"step":8}},{"name":"y","type":"INT","opts":{"default":0,"min":0,"max":4096,"step":8}}],
    outputs: [{"type":"LATENT","name":"LATENT"}],
    category: "latent_transform",
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
// prettier-ignore
export const LoraLoader_schema: ComfyNodeSchema = {
    type: 'LoraLoader',
    input: [{"name":"model","type":"MODEL"},{"name":"clip","type":"CLIP"},{"name":"lora_name","type":"enum_LoraLoader_lora_name"},{"name":"strength_model","type":"FLOAT","opts":{"default":1,"min":0,"max":10,"step":0.01}},{"name":"strength_clip","type":"FLOAT","opts":{"default":1,"min":0,"max":10,"step":0.01}}],
    outputs: [{"type":"MODEL","name":"MODEL"},{"type":"CLIP","name":"CLIP"}],
    category: "loaders",
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
// prettier-ignore
export const CLIPLoader_schema: ComfyNodeSchema = {
    type: 'CLIPLoader',
    input: [{"name":"clip_name","type":"enum_LoraLoader_lora_name"}],
    outputs: [{"type":"CLIP","name":"CLIP"}],
    category: "loaders",
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
// prettier-ignore
export const CLIPVisionEncode_schema: ComfyNodeSchema = {
    type: 'CLIPVisionEncode',
    input: [{"name":"clip_vision","type":"CLIP_VISION"},{"name":"image","type":"IMAGE"}],
    outputs: [{"type":"CLIP_VISION_OUTPUT","name":"CLIP_VISION_OUTPUT"}],
    category: "conditioning_style_model",
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
// prettier-ignore
export const StyleModelApply_schema: ComfyNodeSchema = {
    type: 'StyleModelApply',
    input: [{"name":"conditioning","type":"CONDITIONING"},{"name":"style_model","type":"STYLE_MODEL"},{"name":"clip_vision_output","type":"CLIP_VISION_OUTPUT"}],
    outputs: [{"type":"CONDITIONING","name":"CONDITIONING"}],
    category: "conditioning_style_model",
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
// prettier-ignore
export const ControlNetApply_schema: ComfyNodeSchema = {
    type: 'ControlNetApply',
    input: [{"name":"conditioning","type":"CONDITIONING"},{"name":"control_net","type":"CONTROL_NET"},{"name":"image","type":"IMAGE"},{"name":"strength","type":"FLOAT","opts":{"default":1,"min":0,"max":10,"step":0.01}}],
    outputs: [{"type":"CONDITIONING","name":"CONDITIONING"}],
    category: "conditioning",
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
// prettier-ignore
export const ControlNetLoader_schema: ComfyNodeSchema = {
    type: 'ControlNetLoader',
    input: [{"name":"control_net_name","type":"enum_LoraLoader_lora_name"}],
    outputs: [{"type":"CONTROL_NET","name":"CONTROL_NET"}],
    category: "loaders",
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
// prettier-ignore
export const DiffControlNetLoader_schema: ComfyNodeSchema = {
    type: 'DiffControlNetLoader',
    input: [{"name":"model","type":"MODEL"},{"name":"control_net_name","type":"enum_LoraLoader_lora_name"}],
    outputs: [{"type":"CONTROL_NET","name":"CONTROL_NET"}],
    category: "loaders",
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
// prettier-ignore
export const T2IAdapterLoader_schema: ComfyNodeSchema = {
    type: 'T2IAdapterLoader',
    input: [{"name":"t2i_adapter_name","type":"enum_LoraLoader_lora_name"}],
    outputs: [{"type":"CONTROL_NET","name":"CONTROL_NET"}],
    category: "loaders",
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
// prettier-ignore
export const StyleModelLoader_schema: ComfyNodeSchema = {
    type: 'StyleModelLoader',
    input: [{"name":"style_model_name","type":"enum_LoraLoader_lora_name"}],
    outputs: [{"type":"STYLE_MODEL","name":"STYLE_MODEL"}],
    category: "loaders",
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
// prettier-ignore
export const CLIPVisionLoader_schema: ComfyNodeSchema = {
    type: 'CLIPVisionLoader',
    input: [{"name":"clip_name","type":"enum_LoraLoader_lora_name"}],
    outputs: [{"type":"CLIP_VISION","name":"CLIP_VISION"}],
    category: "loaders",
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
// prettier-ignore
export const VAEDecodeTiled_schema: ComfyNodeSchema = {
    type: 'VAEDecodeTiled',
    input: [{"name":"samples","type":"LATENT"},{"name":"vae","type":"VAE"}],
    outputs: [{"type":"IMAGE","name":"IMAGE"}],
    category: "_for_testing",
}
export type VAEDecodeTiled_input = {
    samples: LATENT | HasSingle_LATENT
    vae: VAE | HasSingle_VAE
}

// INDEX -------------------------------
export const schemas = {
    KSampler: KSampler_schema,
    CheckpointLoader: CheckpointLoader_schema,
    CheckpointLoaderSimple: CheckpointLoaderSimple_schema,
    CLIPTextEncode: CLIPTextEncode_schema,
    CLIPSetLastLayer: CLIPSetLastLayer_schema,
    VAEDecode: VAEDecode_schema,
    VAEEncode: VAEEncode_schema,
    VAEEncodeForInpaint: VAEEncodeForInpaint_schema,
    VAELoader: VAELoader_schema,
    EmptyLatentImage: EmptyLatentImage_schema,
    LatentUpscale: LatentUpscale_schema,
    SaveImage: SaveImage_schema,
    LoadImage: LoadImage_schema,
    LoadImageMask: LoadImageMask_schema,
    ImageScale: ImageScale_schema,
    ImageInvert: ImageInvert_schema,
    ConditioningCombine: ConditioningCombine_schema,
    ConditioningSetArea: ConditioningSetArea_schema,
    KSamplerAdvanced: KSamplerAdvanced_schema,
    SetLatentNoiseMask: SetLatentNoiseMask_schema,
    LatentComposite: LatentComposite_schema,
    LatentRotate: LatentRotate_schema,
    LatentFlip: LatentFlip_schema,
    LatentCrop: LatentCrop_schema,
    LoraLoader: LoraLoader_schema,
    CLIPLoader: CLIPLoader_schema,
    CLIPVisionEncode: CLIPVisionEncode_schema,
    StyleModelApply: StyleModelApply_schema,
    ControlNetApply: ControlNetApply_schema,
    ControlNetLoader: ControlNetLoader_schema,
    DiffControlNetLoader: DiffControlNetLoader_schema,
    T2IAdapterLoader: T2IAdapterLoader_schema,
    StyleModelLoader: StyleModelLoader_schema,
    CLIPVisionLoader: CLIPVisionLoader_schema,
    VAEDecodeTiled: VAEDecodeTiled_schema,
}
export type ComfyNodeType = keyof typeof schemas

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
