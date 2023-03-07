import { ComfyNodeOutput } from './ComfyNodeOutput'
import { ComfyNodeSchema } from './ComfyNodeSchema'
import { ComfyNodeUID } from './ComfyNodeUID'
import { ComfyNode } from './ComfyNode'
import { ComfyFlow } from './ComfyFlow'

// TYPES -------------------------------
type CLIP_VISION_OUTPUT = ComfyNodeOutput<'CLIP_VISION_OUTPUT'>
type CONDITIONING = ComfyNodeOutput<'CONDITIONING'>
type CLIP_VISION = ComfyNodeOutput<'CLIP_VISION'>
type STYLE_MODEL = ComfyNodeOutput<'STYLE_MODEL'>
type CONTROL_NET = ComfyNodeOutput<'CONTROL_NET'>
type LATENT = ComfyNodeOutput<'LATENT'>
type MODEL = ComfyNodeOutput<'MODEL'>
type IMAGE = ComfyNodeOutput<'IMAGE'>
type CLIP = ComfyNodeOutput<'CLIP'>
type MASK = ComfyNodeOutput<'MASK'>
type VAE = ComfyNodeOutput<'VAE'>
type INT = number
type FLOAT = number
type STRING = string

// ENUMS -------------------------------
type enum_KSampler_sampler_name =
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
type enum_KSampler_scheduler = 'ddim_uniform' | 'karras' | 'normal' | 'simple'
type enum_CheckpointLoader_config_name =
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
type enum_CheckpointLoader_ckpt_name = 'AbyssOrangeMix2_hard.safetensors' | 'v1-5-pruned-emaonly.ckpt'
type enum_VAELoader_vae_name = 'vae-ft-mse-840000-ema-pruned.safetensors'
type enum_LatentUpscale_upscale_method = 'area' | 'bilinear' | 'nearest-exact'
type enum_LatentUpscale_crop = 'center' | 'disabled'
type enum_LoadImage_image = 'example.png'
type enum_LoadImageMask_channel = 'alpha' | 'blue' | 'green' | 'red'
type enum_KSamplerAdvanced_add_noise = 'disable' | 'enable'
type enum_LatentRotate_rotation = '180 degrees' | '270 degrees' | '90 degrees' | 'none'
type enum_LatentFlip_flip_method = 'x-axis: vertically' | 'y-axis: horizontally'
type enum_LoraLoader_lora_name = never

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
export class KSampler extends ComfyNode<KSampler_input> {
    $schema = KSampler_schema
    LATENT = new ComfyNodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
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
export class CheckpointLoader extends ComfyNode<CheckpointLoader_input> {
    $schema = CheckpointLoader_schema
    MODEL = new ComfyNodeOutput<'MODEL'>(this, 0, 'MODEL')
    CLIP = new ComfyNodeOutput<'CLIP'>(this, 1, 'CLIP')
    VAE = new ComfyNodeOutput<'VAE'>(this, 2, 'VAE')
    get _MODEL() { return this.MODEL } // prettier-ignore
    get _CLIP() { return this.CLIP } // prettier-ignore
    get _VAE() { return this.VAE } // prettier-ignore
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
export class CheckpointLoaderSimple extends ComfyNode<CheckpointLoaderSimple_input> {
    $schema = CheckpointLoaderSimple_schema
    MODEL = new ComfyNodeOutput<'MODEL'>(this, 0, 'MODEL')
    CLIP = new ComfyNodeOutput<'CLIP'>(this, 1, 'CLIP')
    VAE = new ComfyNodeOutput<'VAE'>(this, 2, 'VAE')
    get _MODEL() { return this.MODEL } // prettier-ignore
    get _CLIP() { return this.CLIP } // prettier-ignore
    get _VAE() { return this.VAE } // prettier-ignore
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
export class CLIPTextEncode extends ComfyNode<CLIPTextEncode_input> {
    $schema = CLIPTextEncode_schema
    CONDITIONING = new ComfyNodeOutput<'CONDITIONING'>(this, 0, 'CONDITIONING')
    get _CONDITIONING() { return this.CONDITIONING } // prettier-ignore
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
export class CLIPSetLastLayer extends ComfyNode<CLIPSetLastLayer_input> {
    $schema = CLIPSetLastLayer_schema
    CLIP = new ComfyNodeOutput<'CLIP'>(this, 0, 'CLIP')
    get _CLIP() { return this.CLIP } // prettier-ignore
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
export class VAEDecode extends ComfyNode<VAEDecode_input> {
    $schema = VAEDecode_schema
    IMAGE = new ComfyNodeOutput<'IMAGE'>(this, 0, 'IMAGE')
    get _IMAGE() { return this.IMAGE } // prettier-ignore
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
export class VAEEncode extends ComfyNode<VAEEncode_input> {
    $schema = VAEEncode_schema
    LATENT = new ComfyNodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
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
export class VAEEncodeForInpaint extends ComfyNode<VAEEncodeForInpaint_input> {
    $schema = VAEEncodeForInpaint_schema
    LATENT = new ComfyNodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
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
export class VAELoader extends ComfyNode<VAELoader_input> {
    $schema = VAELoader_schema
    VAE = new ComfyNodeOutput<'VAE'>(this, 0, 'VAE')
    get _VAE() { return this.VAE } // prettier-ignore
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
export class EmptyLatentImage extends ComfyNode<EmptyLatentImage_input> {
    $schema = EmptyLatentImage_schema
    LATENT = new ComfyNodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
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
export class LatentUpscale extends ComfyNode<LatentUpscale_input> {
    $schema = LatentUpscale_schema
    LATENT = new ComfyNodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
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
export class SaveImage extends ComfyNode<SaveImage_input> {
    $schema = SaveImage_schema
}
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
export class LoadImage extends ComfyNode<LoadImage_input> {
    $schema = LoadImage_schema
    IMAGE = new ComfyNodeOutput<'IMAGE'>(this, 0, 'IMAGE')
    get _IMAGE() { return this.IMAGE } // prettier-ignore
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
export class LoadImageMask extends ComfyNode<LoadImageMask_input> {
    $schema = LoadImageMask_schema
    MASK = new ComfyNodeOutput<'MASK'>(this, 0, 'MASK')
    get _MASK() { return this.MASK } // prettier-ignore
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
export class ImageScale extends ComfyNode<ImageScale_input> {
    $schema = ImageScale_schema
    IMAGE = new ComfyNodeOutput<'IMAGE'>(this, 0, 'IMAGE')
    get _IMAGE() { return this.IMAGE } // prettier-ignore
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
export class ImageInvert extends ComfyNode<ImageInvert_input> {
    $schema = ImageInvert_schema
    IMAGE = new ComfyNodeOutput<'IMAGE'>(this, 0, 'IMAGE')
    get _IMAGE() { return this.IMAGE } // prettier-ignore
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
export class ConditioningCombine extends ComfyNode<ConditioningCombine_input> {
    $schema = ConditioningCombine_schema
    CONDITIONING = new ComfyNodeOutput<'CONDITIONING'>(this, 0, 'CONDITIONING')
    get _CONDITIONING() { return this.CONDITIONING } // prettier-ignore
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
export class ConditioningSetArea extends ComfyNode<ConditioningSetArea_input> {
    $schema = ConditioningSetArea_schema
    CONDITIONING = new ComfyNodeOutput<'CONDITIONING'>(this, 0, 'CONDITIONING')
    get _CONDITIONING() { return this.CONDITIONING } // prettier-ignore
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
export class KSamplerAdvanced extends ComfyNode<KSamplerAdvanced_input> {
    $schema = KSamplerAdvanced_schema
    LATENT = new ComfyNodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
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
export class SetLatentNoiseMask extends ComfyNode<SetLatentNoiseMask_input> {
    $schema = SetLatentNoiseMask_schema
    LATENT = new ComfyNodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
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
export class LatentComposite extends ComfyNode<LatentComposite_input> {
    $schema = LatentComposite_schema
    LATENT = new ComfyNodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
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
export class LatentRotate extends ComfyNode<LatentRotate_input> {
    $schema = LatentRotate_schema
    LATENT = new ComfyNodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
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
export class LatentFlip extends ComfyNode<LatentFlip_input> {
    $schema = LatentFlip_schema
    LATENT = new ComfyNodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
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
export class LatentCrop extends ComfyNode<LatentCrop_input> {
    $schema = LatentCrop_schema
    LATENT = new ComfyNodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
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
export class LoraLoader extends ComfyNode<LoraLoader_input> {
    $schema = LoraLoader_schema
    MODEL = new ComfyNodeOutput<'MODEL'>(this, 0, 'MODEL')
    CLIP = new ComfyNodeOutput<'CLIP'>(this, 1, 'CLIP')
    get _MODEL() { return this.MODEL } // prettier-ignore
    get _CLIP() { return this.CLIP } // prettier-ignore
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
export class CLIPLoader extends ComfyNode<CLIPLoader_input> {
    $schema = CLIPLoader_schema
    CLIP = new ComfyNodeOutput<'CLIP'>(this, 0, 'CLIP')
    get _CLIP() { return this.CLIP } // prettier-ignore
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
export class CLIPVisionEncode extends ComfyNode<CLIPVisionEncode_input> {
    $schema = CLIPVisionEncode_schema
    CLIP_VISION_OUTPUT = new ComfyNodeOutput<'CLIP_VISION_OUTPUT'>(this, 0, 'CLIP_VISION_OUTPUT')
    get _CLIP_VISION_OUTPUT() { return this.CLIP_VISION_OUTPUT } // prettier-ignore
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
export class StyleModelApply extends ComfyNode<StyleModelApply_input> {
    $schema = StyleModelApply_schema
    CONDITIONING = new ComfyNodeOutput<'CONDITIONING'>(this, 0, 'CONDITIONING')
    get _CONDITIONING() { return this.CONDITIONING } // prettier-ignore
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
export class ControlNetApply extends ComfyNode<ControlNetApply_input> {
    $schema = ControlNetApply_schema
    CONDITIONING = new ComfyNodeOutput<'CONDITIONING'>(this, 0, 'CONDITIONING')
    get _CONDITIONING() { return this.CONDITIONING } // prettier-ignore
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
export class ControlNetLoader extends ComfyNode<ControlNetLoader_input> {
    $schema = ControlNetLoader_schema
    CONTROL_NET = new ComfyNodeOutput<'CONTROL_NET'>(this, 0, 'CONTROL_NET')
    get _CONTROL_NET() { return this.CONTROL_NET } // prettier-ignore
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
export class DiffControlNetLoader extends ComfyNode<DiffControlNetLoader_input> {
    $schema = DiffControlNetLoader_schema
    CONTROL_NET = new ComfyNodeOutput<'CONTROL_NET'>(this, 0, 'CONTROL_NET')
    get _CONTROL_NET() { return this.CONTROL_NET } // prettier-ignore
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
export class T2IAdapterLoader extends ComfyNode<T2IAdapterLoader_input> {
    $schema = T2IAdapterLoader_schema
    CONTROL_NET = new ComfyNodeOutput<'CONTROL_NET'>(this, 0, 'CONTROL_NET')
    get _CONTROL_NET() { return this.CONTROL_NET } // prettier-ignore
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
export class StyleModelLoader extends ComfyNode<StyleModelLoader_input> {
    $schema = StyleModelLoader_schema
    STYLE_MODEL = new ComfyNodeOutput<'STYLE_MODEL'>(this, 0, 'STYLE_MODEL')
    get _STYLE_MODEL() { return this.STYLE_MODEL } // prettier-ignore
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
export class CLIPVisionLoader extends ComfyNode<CLIPVisionLoader_input> {
    $schema = CLIPVisionLoader_schema
    CLIP_VISION = new ComfyNodeOutput<'CLIP_VISION'>(this, 0, 'CLIP_VISION')
    get _CLIP_VISION() { return this.CLIP_VISION } // prettier-ignore
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
export class VAEDecodeTiled extends ComfyNode<VAEDecodeTiled_input> {
    $schema = VAEDecodeTiled_schema
    IMAGE = new ComfyNodeOutput<'IMAGE'>(this, 0, 'IMAGE')
    get _IMAGE() { return this.IMAGE } // prettier-ignore
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
export const nodes = {
    KSampler,
    CheckpointLoader,
    CheckpointLoaderSimple,
    CLIPTextEncode,
    CLIPSetLastLayer,
    VAEDecode,
    VAEEncode,
    VAEEncodeForInpaint,
    VAELoader,
    EmptyLatentImage,
    LatentUpscale,
    SaveImage,
    LoadImage,
    LoadImageMask,
    ImageScale,
    ImageInvert,
    ConditioningCombine,
    ConditioningSetArea,
    KSamplerAdvanced,
    SetLatentNoiseMask,
    LatentComposite,
    LatentRotate,
    LatentFlip,
    LatentCrop,
    LoraLoader,
    CLIPLoader,
    CLIPVisionEncode,
    StyleModelApply,
    ControlNetApply,
    ControlNetLoader,
    DiffControlNetLoader,
    T2IAdapterLoader,
    StyleModelLoader,
    CLIPVisionLoader,
    VAEDecodeTiled,
}
export type NodeType = keyof typeof nodes
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
export type ComfyNodeType = keyof typeof nodes

// Entrypoint --------------------------
export class Comfy extends ComfyFlow {
    KSampler = (args: KSampler_input, uid?: ComfyNodeUID) => new KSampler(this, uid, args)
    CheckpointLoader = (args: CheckpointLoader_input, uid?: ComfyNodeUID) => new CheckpointLoader(this, uid, args)
    CheckpointLoaderSimple = (args: CheckpointLoaderSimple_input, uid?: ComfyNodeUID) =>
        new CheckpointLoaderSimple(this, uid, args)
    CLIPTextEncode = (args: CLIPTextEncode_input, uid?: ComfyNodeUID) => new CLIPTextEncode(this, uid, args)
    CLIPSetLastLayer = (args: CLIPSetLastLayer_input, uid?: ComfyNodeUID) => new CLIPSetLastLayer(this, uid, args)
    VAEDecode = (args: VAEDecode_input, uid?: ComfyNodeUID) => new VAEDecode(this, uid, args)
    VAEEncode = (args: VAEEncode_input, uid?: ComfyNodeUID) => new VAEEncode(this, uid, args)
    VAEEncodeForInpaint = (args: VAEEncodeForInpaint_input, uid?: ComfyNodeUID) => new VAEEncodeForInpaint(this, uid, args)
    VAELoader = (args: VAELoader_input, uid?: ComfyNodeUID) => new VAELoader(this, uid, args)
    EmptyLatentImage = (args: EmptyLatentImage_input, uid?: ComfyNodeUID) => new EmptyLatentImage(this, uid, args)
    LatentUpscale = (args: LatentUpscale_input, uid?: ComfyNodeUID) => new LatentUpscale(this, uid, args)
    SaveImage = (args: SaveImage_input, uid?: ComfyNodeUID) => new SaveImage(this, uid, args)
    LoadImage = (args: LoadImage_input, uid?: ComfyNodeUID) => new LoadImage(this, uid, args)
    LoadImageMask = (args: LoadImageMask_input, uid?: ComfyNodeUID) => new LoadImageMask(this, uid, args)
    ImageScale = (args: ImageScale_input, uid?: ComfyNodeUID) => new ImageScale(this, uid, args)
    ImageInvert = (args: ImageInvert_input, uid?: ComfyNodeUID) => new ImageInvert(this, uid, args)
    ConditioningCombine = (args: ConditioningCombine_input, uid?: ComfyNodeUID) => new ConditioningCombine(this, uid, args)
    ConditioningSetArea = (args: ConditioningSetArea_input, uid?: ComfyNodeUID) => new ConditioningSetArea(this, uid, args)
    KSamplerAdvanced = (args: KSamplerAdvanced_input, uid?: ComfyNodeUID) => new KSamplerAdvanced(this, uid, args)
    SetLatentNoiseMask = (args: SetLatentNoiseMask_input, uid?: ComfyNodeUID) => new SetLatentNoiseMask(this, uid, args)
    LatentComposite = (args: LatentComposite_input, uid?: ComfyNodeUID) => new LatentComposite(this, uid, args)
    LatentRotate = (args: LatentRotate_input, uid?: ComfyNodeUID) => new LatentRotate(this, uid, args)
    LatentFlip = (args: LatentFlip_input, uid?: ComfyNodeUID) => new LatentFlip(this, uid, args)
    LatentCrop = (args: LatentCrop_input, uid?: ComfyNodeUID) => new LatentCrop(this, uid, args)
    LoraLoader = (args: LoraLoader_input, uid?: ComfyNodeUID) => new LoraLoader(this, uid, args)
    CLIPLoader = (args: CLIPLoader_input, uid?: ComfyNodeUID) => new CLIPLoader(this, uid, args)
    CLIPVisionEncode = (args: CLIPVisionEncode_input, uid?: ComfyNodeUID) => new CLIPVisionEncode(this, uid, args)
    StyleModelApply = (args: StyleModelApply_input, uid?: ComfyNodeUID) => new StyleModelApply(this, uid, args)
    ControlNetApply = (args: ControlNetApply_input, uid?: ComfyNodeUID) => new ControlNetApply(this, uid, args)
    ControlNetLoader = (args: ControlNetLoader_input, uid?: ComfyNodeUID) => new ControlNetLoader(this, uid, args)
    DiffControlNetLoader = (args: DiffControlNetLoader_input, uid?: ComfyNodeUID) => new DiffControlNetLoader(this, uid, args)
    T2IAdapterLoader = (args: T2IAdapterLoader_input, uid?: ComfyNodeUID) => new T2IAdapterLoader(this, uid, args)
    StyleModelLoader = (args: StyleModelLoader_input, uid?: ComfyNodeUID) => new StyleModelLoader(this, uid, args)
    CLIPVisionLoader = (args: CLIPVisionLoader_input, uid?: ComfyNodeUID) => new CLIPVisionLoader(this, uid, args)
    VAEDecodeTiled = (args: VAEDecodeTiled_input, uid?: ComfyNodeUID) => new VAEDecodeTiled(this, uid, args)

    // misc
}
