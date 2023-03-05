import * as rt from './ComfyNodeUID'
import * as ComfyNode from './ComfyNode'

import { ComfyBase } from './ComfyBase'
import { NodeOutput } from './NodeOutput'

// TYPES -------------------------------
type MODEL = NodeOutput<'MODEL'>
type INT = number
type FLOAT = number
type CONDITIONING = NodeOutput<'CONDITIONING'>
type LATENT = NodeOutput<'LATENT'>
type STRING = string
type CLIP = NodeOutput<'CLIP'>
type VAE = NodeOutput<'VAE'>
type IMAGE = NodeOutput<'IMAGE'>
type MASK = NodeOutput<'MASK'>
type CONTROL_NET = NodeOutput<'CONTROL_NET'>

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

// KSampler -------------------------------
export class KSampler extends ComfyNode.ComfyNode<KSampler_input> {
    static inputs = [
        { name: 'model', type: 'MODEL' },
        { name: 'seed', type: 'INT', opts: { default: 0, min: 0, max: 18446744073709552000 } },
        { name: 'steps', type: 'INT', opts: { default: 20, min: 1, max: 10000 } },
        { name: 'cfg', type: 'FLOAT', opts: { default: 8, min: 0, max: 100 } },
        { name: 'sampler_name', type: 'enum_KSampler_sampler_name' },
        { name: 'scheduler', type: 'enum_KSampler_scheduler' },
        { name: 'positive', type: 'CONDITIONING' },
        { name: 'negative', type: 'CONDITIONING' },
        { name: 'latent_image', type: 'LATENT' },
        { name: 'denoise', type: 'FLOAT', opts: { default: 1, min: 0, max: 1, step: 0.01 } },
    ]
    static outputs = [{ type: 'LATENT', name: 'LATENT' }]
    LATENT = new NodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
}
export type KSampler_input = {
    model: MODEL | HasSingle_MODEL
    seed: INT | HasSingle_INT
    steps: INT | HasSingle_INT
    cfg: FLOAT | HasSingle_FLOAT
    sampler_name: enum_KSampler_sampler_name | HasSingle_enum_KSampler_sampler_name
    scheduler: enum_KSampler_scheduler | HasSingle_enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    latent_image: LATENT | HasSingle_LATENT
    denoise: FLOAT | HasSingle_FLOAT
}

// CheckpointLoader -------------------------------
export class CheckpointLoader extends ComfyNode.ComfyNode<CheckpointLoader_input> {
    static inputs = [
        { name: 'config_name', type: 'enum_CheckpointLoader_config_name' },
        { name: 'ckpt_name', type: 'enum_CheckpointLoader_ckpt_name' },
    ]
    static outputs = [
        { type: 'MODEL', name: 'MODEL' },
        { type: 'CLIP', name: 'CLIP' },
        { type: 'VAE', name: 'VAE' },
    ]
    MODEL = new NodeOutput<'MODEL'>(this, 0, 'MODEL')
    CLIP = new NodeOutput<'CLIP'>(this, 1, 'CLIP')
    VAE = new NodeOutput<'VAE'>(this, 2, 'VAE')
    get _MODEL() { return this.MODEL } // prettier-ignore
    get _CLIP() { return this.CLIP } // prettier-ignore
    get _VAE() { return this.VAE } // prettier-ignore
}
export type CheckpointLoader_input = {
    config_name: enum_CheckpointLoader_config_name | HasSingle_enum_CheckpointLoader_config_name
    ckpt_name: enum_CheckpointLoader_ckpt_name | HasSingle_enum_CheckpointLoader_ckpt_name
}

// CheckpointLoaderSimple -------------------------------
export class CheckpointLoaderSimple extends ComfyNode.ComfyNode<CheckpointLoaderSimple_input> {
    static inputs = [{ name: 'ckpt_name', type: 'enum_CheckpointLoader_ckpt_name' }]
    static outputs = [
        { type: 'MODEL', name: 'MODEL' },
        { type: 'CLIP', name: 'CLIP' },
        { type: 'VAE', name: 'VAE' },
    ]
    MODEL = new NodeOutput<'MODEL'>(this, 0, 'MODEL')
    CLIP = new NodeOutput<'CLIP'>(this, 1, 'CLIP')
    VAE = new NodeOutput<'VAE'>(this, 2, 'VAE')
    get _MODEL() { return this.MODEL } // prettier-ignore
    get _CLIP() { return this.CLIP } // prettier-ignore
    get _VAE() { return this.VAE } // prettier-ignore
}
export type CheckpointLoaderSimple_input = {
    ckpt_name: enum_CheckpointLoader_ckpt_name | HasSingle_enum_CheckpointLoader_ckpt_name
}

// CLIPTextEncode -------------------------------
export class CLIPTextEncode extends ComfyNode.ComfyNode<CLIPTextEncode_input> {
    static inputs = [
        { name: 'text', type: 'STRING', opts: { multiline: true, dynamic_prompt: true } },
        { name: 'clip', type: 'CLIP' },
    ]
    static outputs = [{ type: 'CONDITIONING', name: 'CONDITIONING' }]
    CONDITIONING = new NodeOutput<'CONDITIONING'>(this, 0, 'CONDITIONING')
    get _CONDITIONING() { return this.CONDITIONING } // prettier-ignore
}
export type CLIPTextEncode_input = {
    text: STRING | HasSingle_STRING
    clip: CLIP | HasSingle_CLIP
}

// CLIPSetLastLayer -------------------------------
export class CLIPSetLastLayer extends ComfyNode.ComfyNode<CLIPSetLastLayer_input> {
    static inputs = [
        { name: 'clip', type: 'CLIP' },
        { name: 'stop_at_clip_layer', type: 'INT', opts: { default: -1, min: -24, max: -1, step: 1 } },
    ]
    static outputs = [{ type: 'CLIP', name: 'CLIP' }]
    CLIP = new NodeOutput<'CLIP'>(this, 0, 'CLIP')
    get _CLIP() { return this.CLIP } // prettier-ignore
}
export type CLIPSetLastLayer_input = {
    clip: CLIP | HasSingle_CLIP
    stop_at_clip_layer: INT | HasSingle_INT
}

// VAEDecode -------------------------------
export class VAEDecode extends ComfyNode.ComfyNode<VAEDecode_input> {
    static inputs = [
        { name: 'samples', type: 'LATENT' },
        { name: 'vae', type: 'VAE' },
    ]
    static outputs = [{ type: 'IMAGE', name: 'IMAGE' }]
    IMAGE = new NodeOutput<'IMAGE'>(this, 0, 'IMAGE')
    get _IMAGE() { return this.IMAGE } // prettier-ignore
}
export type VAEDecode_input = {
    samples: LATENT | HasSingle_LATENT
    vae: VAE | HasSingle_VAE
}

// VAEEncode -------------------------------
export class VAEEncode extends ComfyNode.ComfyNode<VAEEncode_input> {
    static inputs = [
        { name: 'pixels', type: 'IMAGE' },
        { name: 'vae', type: 'VAE' },
    ]
    static outputs = [{ type: 'LATENT', name: 'LATENT' }]
    LATENT = new NodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
}
export type VAEEncode_input = {
    pixels: IMAGE | HasSingle_IMAGE
    vae: VAE | HasSingle_VAE
}

// VAEEncodeForInpaint -------------------------------
export class VAEEncodeForInpaint extends ComfyNode.ComfyNode<VAEEncodeForInpaint_input> {
    static inputs = [
        { name: 'pixels', type: 'IMAGE' },
        { name: 'vae', type: 'VAE' },
        { name: 'mask', type: 'MASK' },
    ]
    static outputs = [{ type: 'LATENT', name: 'LATENT' }]
    LATENT = new NodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
}
export type VAEEncodeForInpaint_input = {
    pixels: IMAGE | HasSingle_IMAGE
    vae: VAE | HasSingle_VAE
    mask: MASK | HasSingle_MASK
}

// VAELoader -------------------------------
export class VAELoader extends ComfyNode.ComfyNode<VAELoader_input> {
    static inputs = [{ name: 'vae_name', type: 'enum_VAELoader_vae_name' }]
    static outputs = [{ type: 'VAE', name: 'VAE' }]
    VAE = new NodeOutput<'VAE'>(this, 0, 'VAE')
    get _VAE() { return this.VAE } // prettier-ignore
}
export type VAELoader_input = {
    vae_name: enum_VAELoader_vae_name | HasSingle_enum_VAELoader_vae_name
}

// EmptyLatentImage -------------------------------
export class EmptyLatentImage extends ComfyNode.ComfyNode<EmptyLatentImage_input> {
    static inputs = [
        { name: 'width', type: 'INT', opts: { default: 512, min: 64, max: 4096, step: 64 } },
        { name: 'height', type: 'INT', opts: { default: 512, min: 64, max: 4096, step: 64 } },
        { name: 'batch_size', type: 'INT', opts: { default: 1, min: 1, max: 64 } },
    ]
    static outputs = [{ type: 'LATENT', name: 'LATENT' }]
    LATENT = new NodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
}
export type EmptyLatentImage_input = {
    width: INT | HasSingle_INT
    height: INT | HasSingle_INT
    batch_size: INT | HasSingle_INT
}

// LatentUpscale -------------------------------
export class LatentUpscale extends ComfyNode.ComfyNode<LatentUpscale_input> {
    static inputs = [
        { name: 'samples', type: 'LATENT' },
        { name: 'upscale_method', type: 'enum_LatentUpscale_upscale_method' },
        { name: 'width', type: 'INT', opts: { default: 512, min: 64, max: 4096, step: 64 } },
        { name: 'height', type: 'INT', opts: { default: 512, min: 64, max: 4096, step: 64 } },
        { name: 'crop', type: 'enum_LatentUpscale_crop' },
    ]
    static outputs = [{ type: 'LATENT', name: 'LATENT' }]
    LATENT = new NodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
}
export type LatentUpscale_input = {
    samples: LATENT | HasSingle_LATENT
    upscale_method: enum_LatentUpscale_upscale_method | HasSingle_enum_LatentUpscale_upscale_method
    width: INT | HasSingle_INT
    height: INT | HasSingle_INT
    crop: enum_LatentUpscale_crop | HasSingle_enum_LatentUpscale_crop
}

// SaveImage -------------------------------
export class SaveImage extends ComfyNode.ComfyNode<SaveImage_input> {
    static inputs = [
        { name: 'images', type: 'IMAGE' },
        { name: 'filename_prefix', type: 'STRING', opts: { default: 'ComfyUI' } },
    ]
    static outputs = []
}
export type SaveImage_input = {
    images: IMAGE | HasSingle_IMAGE
    filename_prefix: STRING | HasSingle_STRING
}

// LoadImage -------------------------------
export class LoadImage extends ComfyNode.ComfyNode<LoadImage_input> {
    static inputs = [{ name: 'image', type: 'enum_LoadImage_image' }]
    static outputs = [{ type: 'IMAGE', name: 'IMAGE' }]
    IMAGE = new NodeOutput<'IMAGE'>(this, 0, 'IMAGE')
    get _IMAGE() { return this.IMAGE } // prettier-ignore
}
export type LoadImage_input = {
    image: enum_LoadImage_image | HasSingle_enum_LoadImage_image
}

// LoadImageMask -------------------------------
export class LoadImageMask extends ComfyNode.ComfyNode<LoadImageMask_input> {
    static inputs = [
        { name: 'image', type: 'enum_LoadImage_image' },
        { name: 'channel', type: 'enum_LoadImageMask_channel' },
    ]
    static outputs = [{ type: 'MASK', name: 'MASK' }]
    MASK = new NodeOutput<'MASK'>(this, 0, 'MASK')
    get _MASK() { return this.MASK } // prettier-ignore
}
export type LoadImageMask_input = {
    image: enum_LoadImage_image | HasSingle_enum_LoadImage_image
    channel: enum_LoadImageMask_channel | HasSingle_enum_LoadImageMask_channel
}

// ImageScale -------------------------------
export class ImageScale extends ComfyNode.ComfyNode<ImageScale_input> {
    static inputs = [
        { name: 'image', type: 'IMAGE' },
        { name: 'upscale_method', type: 'enum_LatentUpscale_upscale_method' },
        { name: 'width', type: 'INT', opts: { default: 512, min: 1, max: 4096, step: 1 } },
        { name: 'height', type: 'INT', opts: { default: 512, min: 1, max: 4096, step: 1 } },
        { name: 'crop', type: 'enum_LatentUpscale_crop' },
    ]
    static outputs = [{ type: 'IMAGE', name: 'IMAGE' }]
    IMAGE = new NodeOutput<'IMAGE'>(this, 0, 'IMAGE')
    get _IMAGE() { return this.IMAGE } // prettier-ignore
}
export type ImageScale_input = {
    image: IMAGE | HasSingle_IMAGE
    upscale_method: enum_LatentUpscale_upscale_method | HasSingle_enum_LatentUpscale_upscale_method
    width: INT | HasSingle_INT
    height: INT | HasSingle_INT
    crop: enum_LatentUpscale_crop | HasSingle_enum_LatentUpscale_crop
}

// ImageInvert -------------------------------
export class ImageInvert extends ComfyNode.ComfyNode<ImageInvert_input> {
    static inputs = [{ name: 'image', type: 'IMAGE' }]
    static outputs = [{ type: 'IMAGE', name: 'IMAGE' }]
    IMAGE = new NodeOutput<'IMAGE'>(this, 0, 'IMAGE')
    get _IMAGE() { return this.IMAGE } // prettier-ignore
}
export type ImageInvert_input = {
    image: IMAGE | HasSingle_IMAGE
}

// ConditioningCombine -------------------------------
export class ConditioningCombine extends ComfyNode.ComfyNode<ConditioningCombine_input> {
    static inputs = [
        { name: 'conditioning_1', type: 'CONDITIONING' },
        { name: 'conditioning_2', type: 'CONDITIONING' },
    ]
    static outputs = [{ type: 'CONDITIONING', name: 'CONDITIONING' }]
    CONDITIONING = new NodeOutput<'CONDITIONING'>(this, 0, 'CONDITIONING')
    get _CONDITIONING() { return this.CONDITIONING } // prettier-ignore
}
export type ConditioningCombine_input = {
    conditioning_1: CONDITIONING | HasSingle_CONDITIONING
    conditioning_2: CONDITIONING | HasSingle_CONDITIONING
}

// ConditioningSetArea -------------------------------
export class ConditioningSetArea extends ComfyNode.ComfyNode<ConditioningSetArea_input> {
    static inputs = [
        { name: 'conditioning', type: 'CONDITIONING' },
        { name: 'width', type: 'INT', opts: { default: 64, min: 64, max: 4096, step: 64 } },
        { name: 'height', type: 'INT', opts: { default: 64, min: 64, max: 4096, step: 64 } },
        { name: 'x', type: 'INT', opts: { default: 0, min: 0, max: 4096, step: 64 } },
        { name: 'y', type: 'INT', opts: { default: 0, min: 0, max: 4096, step: 64 } },
        { name: 'strength', type: 'FLOAT', opts: { default: 1, min: 0, max: 10, step: 0.01 } },
    ]
    static outputs = [{ type: 'CONDITIONING', name: 'CONDITIONING' }]
    CONDITIONING = new NodeOutput<'CONDITIONING'>(this, 0, 'CONDITIONING')
    get _CONDITIONING() { return this.CONDITIONING } // prettier-ignore
}
export type ConditioningSetArea_input = {
    conditioning: CONDITIONING | HasSingle_CONDITIONING
    width: INT | HasSingle_INT
    height: INT | HasSingle_INT
    x: INT | HasSingle_INT
    y: INT | HasSingle_INT
    strength: FLOAT | HasSingle_FLOAT
}

// KSamplerAdvanced -------------------------------
export class KSamplerAdvanced extends ComfyNode.ComfyNode<KSamplerAdvanced_input> {
    static inputs = [
        { name: 'model', type: 'MODEL' },
        { name: 'add_noise', type: 'enum_KSamplerAdvanced_add_noise' },
        { name: 'noise_seed', type: 'INT', opts: { default: 0, min: 0, max: 18446744073709552000 } },
        { name: 'steps', type: 'INT', opts: { default: 20, min: 1, max: 10000 } },
        { name: 'cfg', type: 'FLOAT', opts: { default: 8, min: 0, max: 100 } },
        { name: 'sampler_name', type: 'enum_KSampler_sampler_name' },
        { name: 'scheduler', type: 'enum_KSampler_scheduler' },
        { name: 'positive', type: 'CONDITIONING' },
        { name: 'negative', type: 'CONDITIONING' },
        { name: 'latent_image', type: 'LATENT' },
        { name: 'start_at_step', type: 'INT', opts: { default: 0, min: 0, max: 10000 } },
        { name: 'end_at_step', type: 'INT', opts: { default: 10000, min: 0, max: 10000 } },
        { name: 'return_with_leftover_noise', type: 'enum_KSamplerAdvanced_add_noise' },
    ]
    static outputs = [{ type: 'LATENT', name: 'LATENT' }]
    LATENT = new NodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
}
export type KSamplerAdvanced_input = {
    model: MODEL | HasSingle_MODEL
    add_noise: enum_KSamplerAdvanced_add_noise | HasSingle_enum_KSamplerAdvanced_add_noise
    noise_seed: INT | HasSingle_INT
    steps: INT | HasSingle_INT
    cfg: FLOAT | HasSingle_FLOAT
    sampler_name: enum_KSampler_sampler_name | HasSingle_enum_KSampler_sampler_name
    scheduler: enum_KSampler_scheduler | HasSingle_enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    latent_image: LATENT | HasSingle_LATENT
    start_at_step: INT | HasSingle_INT
    end_at_step: INT | HasSingle_INT
    return_with_leftover_noise: enum_KSamplerAdvanced_add_noise | HasSingle_enum_KSamplerAdvanced_add_noise
}

// SetLatentNoiseMask -------------------------------
export class SetLatentNoiseMask extends ComfyNode.ComfyNode<SetLatentNoiseMask_input> {
    static inputs = [
        { name: 'samples', type: 'LATENT' },
        { name: 'mask', type: 'MASK' },
    ]
    static outputs = [{ type: 'LATENT', name: 'LATENT' }]
    LATENT = new NodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
}
export type SetLatentNoiseMask_input = {
    samples: LATENT | HasSingle_LATENT
    mask: MASK | HasSingle_MASK
}

// LatentComposite -------------------------------
export class LatentComposite extends ComfyNode.ComfyNode<LatentComposite_input> {
    static inputs = [
        { name: 'samples_to', type: 'LATENT' },
        { name: 'samples_from', type: 'LATENT' },
        { name: 'x', type: 'INT', opts: { default: 0, min: 0, max: 4096, step: 8 } },
        { name: 'y', type: 'INT', opts: { default: 0, min: 0, max: 4096, step: 8 } },
        { name: 'feather', type: 'INT', opts: { default: 0, min: 0, max: 4096, step: 8 } },
    ]
    static outputs = [{ type: 'LATENT', name: 'LATENT' }]
    LATENT = new NodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
}
export type LatentComposite_input = {
    samples_to: LATENT | HasSingle_LATENT
    samples_from: LATENT | HasSingle_LATENT
    x: INT | HasSingle_INT
    y: INT | HasSingle_INT
    feather: INT | HasSingle_INT
}

// LatentRotate -------------------------------
export class LatentRotate extends ComfyNode.ComfyNode<LatentRotate_input> {
    static inputs = [
        { name: 'samples', type: 'LATENT' },
        { name: 'rotation', type: 'enum_LatentRotate_rotation' },
    ]
    static outputs = [{ type: 'LATENT', name: 'LATENT' }]
    LATENT = new NodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
}
export type LatentRotate_input = {
    samples: LATENT | HasSingle_LATENT
    rotation: enum_LatentRotate_rotation | HasSingle_enum_LatentRotate_rotation
}

// LatentFlip -------------------------------
export class LatentFlip extends ComfyNode.ComfyNode<LatentFlip_input> {
    static inputs = [
        { name: 'samples', type: 'LATENT' },
        { name: 'flip_method', type: 'enum_LatentFlip_flip_method' },
    ]
    static outputs = [{ type: 'LATENT', name: 'LATENT' }]
    LATENT = new NodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
}
export type LatentFlip_input = {
    samples: LATENT | HasSingle_LATENT
    flip_method: enum_LatentFlip_flip_method | HasSingle_enum_LatentFlip_flip_method
}

// LatentCrop -------------------------------
export class LatentCrop extends ComfyNode.ComfyNode<LatentCrop_input> {
    static inputs = [
        { name: 'samples', type: 'LATENT' },
        { name: 'width', type: 'INT', opts: { default: 512, min: 64, max: 4096, step: 64 } },
        { name: 'height', type: 'INT', opts: { default: 512, min: 64, max: 4096, step: 64 } },
        { name: 'x', type: 'INT', opts: { default: 0, min: 0, max: 4096, step: 8 } },
        { name: 'y', type: 'INT', opts: { default: 0, min: 0, max: 4096, step: 8 } },
    ]
    static outputs = [{ type: 'LATENT', name: 'LATENT' }]
    LATENT = new NodeOutput<'LATENT'>(this, 0, 'LATENT')
    get _LATENT() { return this.LATENT } // prettier-ignore
}
export type LatentCrop_input = {
    samples: LATENT | HasSingle_LATENT
    width: INT | HasSingle_INT
    height: INT | HasSingle_INT
    x: INT | HasSingle_INT
    y: INT | HasSingle_INT
}

// LoraLoader -------------------------------
export class LoraLoader extends ComfyNode.ComfyNode<LoraLoader_input> {
    static inputs = [
        { name: 'model', type: 'MODEL' },
        { name: 'clip', type: 'CLIP' },
        { name: 'lora_name', type: 'enum_LoraLoader_lora_name' },
        { name: 'strength_model', type: 'FLOAT', opts: { default: 1, min: 0, max: 10, step: 0.01 } },
        { name: 'strength_clip', type: 'FLOAT', opts: { default: 1, min: 0, max: 10, step: 0.01 } },
    ]
    static outputs = [
        { type: 'MODEL', name: 'MODEL' },
        { type: 'CLIP', name: 'CLIP' },
    ]
    MODEL = new NodeOutput<'MODEL'>(this, 0, 'MODEL')
    CLIP = new NodeOutput<'CLIP'>(this, 1, 'CLIP')
    get _MODEL() { return this.MODEL } // prettier-ignore
    get _CLIP() { return this.CLIP } // prettier-ignore
}
export type LoraLoader_input = {
    model: MODEL | HasSingle_MODEL
    clip: CLIP | HasSingle_CLIP
    lora_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name
    strength_model: FLOAT | HasSingle_FLOAT
    strength_clip: FLOAT | HasSingle_FLOAT
}

// CLIPLoader -------------------------------
export class CLIPLoader extends ComfyNode.ComfyNode<CLIPLoader_input> {
    static inputs = [{ name: 'clip_name', type: 'enum_LoraLoader_lora_name' }]
    static outputs = [{ type: 'CLIP', name: 'CLIP' }]
    CLIP = new NodeOutput<'CLIP'>(this, 0, 'CLIP')
    get _CLIP() { return this.CLIP } // prettier-ignore
}
export type CLIPLoader_input = {
    clip_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name
}

// ControlNetApply -------------------------------
export class ControlNetApply extends ComfyNode.ComfyNode<ControlNetApply_input> {
    static inputs = [
        { name: 'conditioning', type: 'CONDITIONING' },
        { name: 'control_net', type: 'CONTROL_NET' },
        { name: 'image', type: 'IMAGE' },
        { name: 'strength', type: 'FLOAT', opts: { default: 1, min: 0, max: 10, step: 0.01 } },
    ]
    static outputs = [{ type: 'CONDITIONING', name: 'CONDITIONING' }]
    CONDITIONING = new NodeOutput<'CONDITIONING'>(this, 0, 'CONDITIONING')
    get _CONDITIONING() { return this.CONDITIONING } // prettier-ignore
}
export type ControlNetApply_input = {
    conditioning: CONDITIONING | HasSingle_CONDITIONING
    control_net: CONTROL_NET | HasSingle_CONTROL_NET
    image: IMAGE | HasSingle_IMAGE
    strength: FLOAT | HasSingle_FLOAT
}

// ControlNetLoader -------------------------------
export class ControlNetLoader extends ComfyNode.ComfyNode<ControlNetLoader_input> {
    static inputs = [{ name: 'control_net_name', type: 'enum_LoraLoader_lora_name' }]
    static outputs = [{ type: 'CONTROL_NET', name: 'CONTROL_NET' }]
    CONTROL_NET = new NodeOutput<'CONTROL_NET'>(this, 0, 'CONTROL_NET')
    get _CONTROL_NET() { return this.CONTROL_NET } // prettier-ignore
}
export type ControlNetLoader_input = {
    control_net_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name
}

// DiffControlNetLoader -------------------------------
export class DiffControlNetLoader extends ComfyNode.ComfyNode<DiffControlNetLoader_input> {
    static inputs = [
        { name: 'model', type: 'MODEL' },
        { name: 'control_net_name', type: 'enum_LoraLoader_lora_name' },
    ]
    static outputs = [{ type: 'CONTROL_NET', name: 'CONTROL_NET' }]
    CONTROL_NET = new NodeOutput<'CONTROL_NET'>(this, 0, 'CONTROL_NET')
    get _CONTROL_NET() { return this.CONTROL_NET } // prettier-ignore
}
export type DiffControlNetLoader_input = {
    model: MODEL | HasSingle_MODEL
    control_net_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name
}

// T2IAdapterLoader -------------------------------
export class T2IAdapterLoader extends ComfyNode.ComfyNode<T2IAdapterLoader_input> {
    static inputs = [{ name: 't2i_adapter_name', type: 'enum_LoraLoader_lora_name' }]
    static outputs = [{ type: 'CONTROL_NET', name: 'CONTROL_NET' }]
    CONTROL_NET = new NodeOutput<'CONTROL_NET'>(this, 0, 'CONTROL_NET')
    get _CONTROL_NET() { return this.CONTROL_NET } // prettier-ignore
}
export type T2IAdapterLoader_input = {
    t2i_adapter_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name
}

// VAEDecodeTiled -------------------------------
export class VAEDecodeTiled extends ComfyNode.ComfyNode<VAEDecodeTiled_input> {
    static inputs = [
        { name: 'samples', type: 'LATENT' },
        { name: 'vae', type: 'VAE' },
    ]
    static outputs = [{ type: 'IMAGE', name: 'IMAGE' }]
    IMAGE = new NodeOutput<'IMAGE'>(this, 0, 'IMAGE')
    get _IMAGE() { return this.IMAGE } // prettier-ignore
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
    ControlNetApply,
    ControlNetLoader,
    DiffControlNetLoader,
    T2IAdapterLoader,
    VAEDecodeTiled,
}
export type NodeType = keyof typeof nodes

// Entrypoint --------------------------
export class Comfy extends ComfyBase {
    KSampler = (args: KSampler_input, uid?: rt.ComfyNodeUID) => new KSampler(this, uid, args)
    CheckpointLoader = (args: CheckpointLoader_input, uid?: rt.ComfyNodeUID) => new CheckpointLoader(this, uid, args)
    CheckpointLoaderSimple = (args: CheckpointLoaderSimple_input, uid?: rt.ComfyNodeUID) =>
        new CheckpointLoaderSimple(this, uid, args)
    CLIPTextEncode = (args: CLIPTextEncode_input, uid?: rt.ComfyNodeUID) => new CLIPTextEncode(this, uid, args)
    CLIPSetLastLayer = (args: CLIPSetLastLayer_input, uid?: rt.ComfyNodeUID) => new CLIPSetLastLayer(this, uid, args)
    VAEDecode = (args: VAEDecode_input, uid?: rt.ComfyNodeUID) => new VAEDecode(this, uid, args)
    VAEEncode = (args: VAEEncode_input, uid?: rt.ComfyNodeUID) => new VAEEncode(this, uid, args)
    VAEEncodeForInpaint = (args: VAEEncodeForInpaint_input, uid?: rt.ComfyNodeUID) => new VAEEncodeForInpaint(this, uid, args)
    VAELoader = (args: VAELoader_input, uid?: rt.ComfyNodeUID) => new VAELoader(this, uid, args)
    EmptyLatentImage = (args: EmptyLatentImage_input, uid?: rt.ComfyNodeUID) => new EmptyLatentImage(this, uid, args)
    LatentUpscale = (args: LatentUpscale_input, uid?: rt.ComfyNodeUID) => new LatentUpscale(this, uid, args)
    SaveImage = (args: SaveImage_input, uid?: rt.ComfyNodeUID) => new SaveImage(this, uid, args)
    LoadImage = (args: LoadImage_input, uid?: rt.ComfyNodeUID) => new LoadImage(this, uid, args)
    LoadImageMask = (args: LoadImageMask_input, uid?: rt.ComfyNodeUID) => new LoadImageMask(this, uid, args)
    ImageScale = (args: ImageScale_input, uid?: rt.ComfyNodeUID) => new ImageScale(this, uid, args)
    ImageInvert = (args: ImageInvert_input, uid?: rt.ComfyNodeUID) => new ImageInvert(this, uid, args)
    ConditioningCombine = (args: ConditioningCombine_input, uid?: rt.ComfyNodeUID) => new ConditioningCombine(this, uid, args)
    ConditioningSetArea = (args: ConditioningSetArea_input, uid?: rt.ComfyNodeUID) => new ConditioningSetArea(this, uid, args)
    KSamplerAdvanced = (args: KSamplerAdvanced_input, uid?: rt.ComfyNodeUID) => new KSamplerAdvanced(this, uid, args)
    SetLatentNoiseMask = (args: SetLatentNoiseMask_input, uid?: rt.ComfyNodeUID) => new SetLatentNoiseMask(this, uid, args)
    LatentComposite = (args: LatentComposite_input, uid?: rt.ComfyNodeUID) => new LatentComposite(this, uid, args)
    LatentRotate = (args: LatentRotate_input, uid?: rt.ComfyNodeUID) => new LatentRotate(this, uid, args)
    LatentFlip = (args: LatentFlip_input, uid?: rt.ComfyNodeUID) => new LatentFlip(this, uid, args)
    LatentCrop = (args: LatentCrop_input, uid?: rt.ComfyNodeUID) => new LatentCrop(this, uid, args)
    LoraLoader = (args: LoraLoader_input, uid?: rt.ComfyNodeUID) => new LoraLoader(this, uid, args)
    CLIPLoader = (args: CLIPLoader_input, uid?: rt.ComfyNodeUID) => new CLIPLoader(this, uid, args)
    ControlNetApply = (args: ControlNetApply_input, uid?: rt.ComfyNodeUID) => new ControlNetApply(this, uid, args)
    ControlNetLoader = (args: ControlNetLoader_input, uid?: rt.ComfyNodeUID) => new ControlNetLoader(this, uid, args)
    DiffControlNetLoader = (args: DiffControlNetLoader_input, uid?: rt.ComfyNodeUID) => new DiffControlNetLoader(this, uid, args)
    T2IAdapterLoader = (args: T2IAdapterLoader_input, uid?: rt.ComfyNodeUID) => new T2IAdapterLoader(this, uid, args)
    VAEDecodeTiled = (args: VAEDecodeTiled_input, uid?: rt.ComfyNodeUID) => new VAEDecodeTiled(this, uid, args)

    // misc
}
