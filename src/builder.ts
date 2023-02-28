import * as rt from './runtime.ts'
// TYPES -------------------------------
type MODEL = rt.Signal<'MODEL'>
type INT = rt.Signal<'INT'>
type FLOAT = rt.Signal<'FLOAT'>
type CONDITIONING = rt.Signal<'CONDITIONING'>
type LATENT = rt.Signal<'LATENT'>
type STRING = rt.Signal<'STRING'>
type CLIP = rt.Signal<'CLIP'>
type VAE = rt.Signal<'VAE'>
type IMAGE = rt.Signal<'IMAGE'>
type MASK = rt.Signal<'MASK'>
type CONTROL_NET = rt.Signal<'CONTROL_NET'>

// ENUMS -------------------------------
type enum_KSampler_sampler_name =
    | 'sample_euler'
    | 'sample_euler_ancestral'
    | 'sample_heun'
    | 'sample_dpm_2'
    | 'sample_dpm_2_ancestral'
    | 'sample_lms'
    | 'sample_dpm_fast'
    | 'sample_dpm_adaptive'
    | 'sample_dpmpp_2s_ancestral'
    | 'sample_dpmpp_sde'
    | 'sample_dpmpp_2m'
    | 'ddim'
    | 'uni_pc'
    | 'uni_pc_bh2'
type enum_KSampler_scheduler = 'karras' | 'normal' | 'simple' | 'ddim_uniform'
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
type enum_LatentUpscale_upscale_method = 'nearest-exact' | 'bilinear' | 'area'
type enum_LatentUpscale_crop = 'disabled' | 'center'
type enum_LoadImage_image = '4PGjFvX.png' | 'Fp2S_heacAErVip.webp' | 'example.png' | 'testcnet.jfif' | 'workflow.json'
type enum_LoadImageMask_channel = 'alpha' | 'red' | 'green' | 'blue'
type enum_KSamplerAdvanced_add_noise = 'enable' | 'disable'
type enum_KSamplerAdvanced_return_with_leftover_noise = 'disable' | 'enable'
type enum_LatentRotate_rotation = 'none' | '90 degrees' | '180 degrees' | '270 degrees'
type enum_LatentFlip_flip_method = 'x-axis: vertically' | 'y-axis: horizontally'
type enum_LoraLoader_lora_name = 'charturnerbetaLora_charturnbetalora.safetensors'
type enum_CLIPLoader_clip_name = never
type enum_ControlNetLoader_control_net_name = 'controlnetPreTrained_openposeV10.safetensors'

// KSampler -------------------------------
export class KSampler {
    constructor(public p: KSampler_input) {}
    LATENT = new rt.Signal('LATENT')
}
export type KSampler_input = {
    model: MODEL
    seed: INT
    steps: INT
    cfg: FLOAT
    sampler_name: enum_KSampler_sampler_name
    scheduler: enum_KSampler_scheduler
    positive: CONDITIONING
    negative: CONDITIONING
    latent_image: LATENT
    denoise: FLOAT
}

// CheckpointLoader -------------------------------
export class CheckpointLoader {
    constructor(public p: CheckpointLoader_input) {}
    MODEL = new rt.Signal('MODEL')
    CLIP = new rt.Signal('CLIP')
    VAE = new rt.Signal('VAE')
}
export type CheckpointLoader_input = {
    config_name: enum_CheckpointLoader_config_name
    ckpt_name: enum_CheckpointLoader_ckpt_name
}

// CLIPTextEncode -------------------------------
export class CLIPTextEncode {
    constructor(public p: CLIPTextEncode_input) {}
    CONDITIONING = new rt.Signal('CONDITIONING')
}
export type CLIPTextEncode_input = {
    text: STRING
    clip: CLIP
}

// VAEDecode -------------------------------
export class VAEDecode {
    constructor(public p: VAEDecode_input) {}
    IMAGE = new rt.Signal('IMAGE')
}
export type VAEDecode_input = {
    samples: LATENT
    vae: VAE
}

// VAEEncode -------------------------------
export class VAEEncode {
    constructor(public p: VAEEncode_input) {}
    LATENT = new rt.Signal('LATENT')
}
export type VAEEncode_input = {
    pixels: IMAGE
    vae: VAE
}

// VAEEncodeForInpaint -------------------------------
export class VAEEncodeForInpaint {
    constructor(public p: VAEEncodeForInpaint_input) {}
    LATENT = new rt.Signal('LATENT')
}
export type VAEEncodeForInpaint_input = {
    pixels: IMAGE
    vae: VAE
    mask: MASK
}

// VAELoader -------------------------------
export class VAELoader {
    constructor(public p: VAELoader_input) {}
    VAE = new rt.Signal('VAE')
}
export type VAELoader_input = {
    vae_name: enum_VAELoader_vae_name
}

// EmptyLatentImage -------------------------------
export class EmptyLatentImage {
    constructor(public p: EmptyLatentImage_input) {}
    LATENT = new rt.Signal('LATENT')
}
export type EmptyLatentImage_input = {
    width: INT
    height: INT
    batch_size: INT
}

// LatentUpscale -------------------------------
export class LatentUpscale {
    constructor(public p: LatentUpscale_input) {}
    LATENT = new rt.Signal('LATENT')
}
export type LatentUpscale_input = {
    samples: LATENT
    upscale_method: enum_LatentUpscale_upscale_method
    width: INT
    height: INT
    crop: enum_LatentUpscale_crop
}

// SaveImage -------------------------------
export class SaveImage {
    constructor(public p: SaveImage_input) {}
}
export type SaveImage_input = {
    images: IMAGE
    filename_prefix: STRING
}

// LoadImage -------------------------------
export class LoadImage {
    constructor(public p: LoadImage_input) {}
    IMAGE = new rt.Signal('IMAGE')
}
export type LoadImage_input = {
    image: enum_LoadImage_image
}

// LoadImageMask -------------------------------
export class LoadImageMask {
    constructor(public p: LoadImageMask_input) {}
    MASK = new rt.Signal('MASK')
}
export type LoadImageMask_input = {
    image: enum_LoadImage_image
    channel: enum_LoadImageMask_channel
}

// ImageScale -------------------------------
export class ImageScale {
    constructor(public p: ImageScale_input) {}
    IMAGE = new rt.Signal('IMAGE')
}
export type ImageScale_input = {
    image: IMAGE
    upscale_method: enum_LatentUpscale_upscale_method
    width: INT
    height: INT
    crop: enum_LatentUpscale_crop
}

// ImageInvert -------------------------------
export class ImageInvert {
    constructor(public p: ImageInvert_input) {}
    IMAGE = new rt.Signal('IMAGE')
}
export type ImageInvert_input = {
    image: IMAGE
}

// ConditioningCombine -------------------------------
export class ConditioningCombine {
    constructor(public p: ConditioningCombine_input) {}
    CONDITIONING = new rt.Signal('CONDITIONING')
}
export type ConditioningCombine_input = {
    conditioning_1: CONDITIONING
    conditioning_2: CONDITIONING
}

// ConditioningSetArea -------------------------------
export class ConditioningSetArea {
    constructor(public p: ConditioningSetArea_input) {}
    CONDITIONING = new rt.Signal('CONDITIONING')
}
export type ConditioningSetArea_input = {
    conditioning: CONDITIONING
    width: INT
    height: INT
    x: INT
    y: INT
    strength: FLOAT
}

// KSamplerAdvanced -------------------------------
export class KSamplerAdvanced {
    constructor(public p: KSamplerAdvanced_input) {}
    LATENT = new rt.Signal('LATENT')
}
export type KSamplerAdvanced_input = {
    model: MODEL
    add_noise: enum_KSamplerAdvanced_add_noise
    noise_seed: INT
    steps: INT
    cfg: FLOAT
    sampler_name: enum_KSampler_sampler_name
    scheduler: enum_KSampler_scheduler
    positive: CONDITIONING
    negative: CONDITIONING
    latent_image: LATENT
    start_at_step: INT
    end_at_step: INT
    return_with_leftover_noise: enum_KSamplerAdvanced_return_with_leftover_noise
}

// SetLatentNoiseMask -------------------------------
export class SetLatentNoiseMask {
    constructor(public p: SetLatentNoiseMask_input) {}
    LATENT = new rt.Signal('LATENT')
}
export type SetLatentNoiseMask_input = {
    samples: LATENT
    mask: MASK
}

// LatentComposite -------------------------------
export class LatentComposite {
    constructor(public p: LatentComposite_input) {}
    LATENT = new rt.Signal('LATENT')
}
export type LatentComposite_input = {
    samples_to: LATENT
    samples_from: LATENT
    x: INT
    y: INT
    feather: INT
}

// LatentRotate -------------------------------
export class LatentRotate {
    constructor(public p: LatentRotate_input) {}
    LATENT = new rt.Signal('LATENT')
}
export type LatentRotate_input = {
    samples: LATENT
    rotation: enum_LatentRotate_rotation
}

// LatentFlip -------------------------------
export class LatentFlip {
    constructor(public p: LatentFlip_input) {}
    LATENT = new rt.Signal('LATENT')
}
export type LatentFlip_input = {
    samples: LATENT
    flip_method: enum_LatentFlip_flip_method
}

// LatentCrop -------------------------------
export class LatentCrop {
    constructor(public p: LatentCrop_input) {}
    LATENT = new rt.Signal('LATENT')
}
export type LatentCrop_input = {
    samples: LATENT
    width: INT
    height: INT
    x: INT
    y: INT
}

// LoraLoader -------------------------------
export class LoraLoader {
    constructor(public p: LoraLoader_input) {}
    MODEL = new rt.Signal('MODEL')
    CLIP = new rt.Signal('CLIP')
}
export type LoraLoader_input = {
    model: MODEL
    clip: CLIP
    lora_name: enum_LoraLoader_lora_name
    strength_model: FLOAT
    strength_clip: FLOAT
}

// CLIPLoader -------------------------------
export class CLIPLoader {
    constructor(public p: CLIPLoader_input) {}
    CLIP = new rt.Signal('CLIP')
}
export type CLIPLoader_input = {
    clip_name: enum_CLIPLoader_clip_name
    stop_at_clip_layer: INT
}

// ControlNetApply -------------------------------
export class ControlNetApply {
    constructor(public p: ControlNetApply_input) {}
    CONDITIONING = new rt.Signal('CONDITIONING')
}
export type ControlNetApply_input = {
    conditioning: CONDITIONING
    control_net: CONTROL_NET
    image: IMAGE
    strength: FLOAT
}

// ControlNetLoader -------------------------------
export class ControlNetLoader {
    constructor(public p: ControlNetLoader_input) {}
    CONTROL_NET = new rt.Signal('CONTROL_NET')
}
export type ControlNetLoader_input = {
    control_net_name: enum_ControlNetLoader_control_net_name
}

// DiffControlNetLoader -------------------------------
export class DiffControlNetLoader {
    constructor(public p: DiffControlNetLoader_input) {}
    CONTROL_NET = new rt.Signal('CONTROL_NET')
}
export type DiffControlNetLoader_input = {
    model: MODEL
    control_net_name: enum_ControlNetLoader_control_net_name
}

// T2IAdapterLoader -------------------------------
export class T2IAdapterLoader {
    constructor(public p: T2IAdapterLoader_input) {}
    CONTROL_NET = new rt.Signal('CONTROL_NET')
}
export type T2IAdapterLoader_input = {
    t2i_adapter_name: enum_CLIPLoader_clip_name
}

// VAEDecodeTiled -------------------------------
export class VAEDecodeTiled {
    constructor(public p: VAEDecodeTiled_input) {}
    IMAGE = new rt.Signal('IMAGE')
}
export type VAEDecodeTiled_input = {
    samples: LATENT
    vae: VAE
}
