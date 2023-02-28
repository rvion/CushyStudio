// TYPES -------------------------------
type MODEL = any
type INT = any
type FLOAT = any
type CONDITIONING = any
type LATENT = any
type STRING = any
type CLIP = any
type VAE = any
type IMAGE = any
type MASK = any
type CONTROL_NET = any

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
export type KSampler_output = {
    LATENT: LATENT
}

// CheckpointLoader -------------------------------
export class CheckpointLoader {
    constructor(public p: CheckpointLoader_input) {}
}
export type CheckpointLoader_input = {
    config_name: enum_CheckpointLoader_config_name
    ckpt_name: enum_CheckpointLoader_ckpt_name
}
export type CheckpointLoader_output = {
    MODEL: MODEL
    CLIP: CLIP
    VAE: VAE
}

// CLIPTextEncode -------------------------------
export class CLIPTextEncode {
    constructor(public p: CLIPTextEncode_input) {}
}
export type CLIPTextEncode_input = {
    text: STRING
    clip: CLIP
}
export type CLIPTextEncode_output = {
    CONDITIONING: CONDITIONING
}

// VAEDecode -------------------------------
export class VAEDecode {
    constructor(public p: VAEDecode_input) {}
}
export type VAEDecode_input = {
    samples: LATENT
    vae: VAE
}
export type VAEDecode_output = {
    IMAGE: IMAGE
}

// VAEEncode -------------------------------
export class VAEEncode {
    constructor(public p: VAEEncode_input) {}
}
export type VAEEncode_input = {
    pixels: IMAGE
    vae: VAE
}
export type VAEEncode_output = {
    LATENT: LATENT
}

// VAEEncodeForInpaint -------------------------------
export class VAEEncodeForInpaint {
    constructor(public p: VAEEncodeForInpaint_input) {}
}
export type VAEEncodeForInpaint_input = {
    pixels: IMAGE
    vae: VAE
    mask: MASK
}
export type VAEEncodeForInpaint_output = {
    LATENT: LATENT
}

// VAELoader -------------------------------
export class VAELoader {
    constructor(public p: VAELoader_input) {}
}
export type VAELoader_input = {
    vae_name: enum_VAELoader_vae_name
}
export type VAELoader_output = {
    VAE: VAE
}

// EmptyLatentImage -------------------------------
export class EmptyLatentImage {
    constructor(public p: EmptyLatentImage_input) {}
}
export type EmptyLatentImage_input = {
    width: INT
    height: INT
    batch_size: INT
}
export type EmptyLatentImage_output = {
    LATENT: LATENT
}

// LatentUpscale -------------------------------
export class LatentUpscale {
    constructor(public p: LatentUpscale_input) {}
}
export type LatentUpscale_input = {
    samples: LATENT
    upscale_method: enum_LatentUpscale_upscale_method
    width: INT
    height: INT
    crop: enum_LatentUpscale_crop
}
export type LatentUpscale_output = {
    LATENT: LATENT
}

// SaveImage -------------------------------
export class SaveImage {
    constructor(public p: SaveImage_input) {}
}
export type SaveImage_input = {
    images: IMAGE
    filename_prefix: STRING
}
export type SaveImage_output = {}

// LoadImage -------------------------------
export class LoadImage {
    constructor(public p: LoadImage_input) {}
}
export type LoadImage_input = {
    image: enum_LoadImage_image
}
export type LoadImage_output = {
    IMAGE: IMAGE
}

// LoadImageMask -------------------------------
export class LoadImageMask {
    constructor(public p: LoadImageMask_input) {}
}
export type LoadImageMask_input = {
    image: enum_LoadImage_image
    channel: enum_LoadImageMask_channel
}
export type LoadImageMask_output = {
    MASK: MASK
}

// ImageScale -------------------------------
export class ImageScale {
    constructor(public p: ImageScale_input) {}
}
export type ImageScale_input = {
    image: IMAGE
    upscale_method: enum_LatentUpscale_upscale_method
    width: INT
    height: INT
    crop: enum_LatentUpscale_crop
}
export type ImageScale_output = {
    IMAGE: IMAGE
}

// ImageInvert -------------------------------
export class ImageInvert {
    constructor(public p: ImageInvert_input) {}
}
export type ImageInvert_input = {
    image: IMAGE
}
export type ImageInvert_output = {
    IMAGE: IMAGE
}

// ConditioningCombine -------------------------------
export class ConditioningCombine {
    constructor(public p: ConditioningCombine_input) {}
}
export type ConditioningCombine_input = {
    conditioning_1: CONDITIONING
    conditioning_2: CONDITIONING
}
export type ConditioningCombine_output = {
    CONDITIONING: CONDITIONING
}

// ConditioningSetArea -------------------------------
export class ConditioningSetArea {
    constructor(public p: ConditioningSetArea_input) {}
}
export type ConditioningSetArea_input = {
    conditioning: CONDITIONING
    width: INT
    height: INT
    x: INT
    y: INT
    strength: FLOAT
}
export type ConditioningSetArea_output = {
    CONDITIONING: CONDITIONING
}

// KSamplerAdvanced -------------------------------
export class KSamplerAdvanced {
    constructor(public p: KSamplerAdvanced_input) {}
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
export type KSamplerAdvanced_output = {
    LATENT: LATENT
}

// SetLatentNoiseMask -------------------------------
export class SetLatentNoiseMask {
    constructor(public p: SetLatentNoiseMask_input) {}
}
export type SetLatentNoiseMask_input = {
    samples: LATENT
    mask: MASK
}
export type SetLatentNoiseMask_output = {
    LATENT: LATENT
}

// LatentComposite -------------------------------
export class LatentComposite {
    constructor(public p: LatentComposite_input) {}
}
export type LatentComposite_input = {
    samples_to: LATENT
    samples_from: LATENT
    x: INT
    y: INT
    feather: INT
}
export type LatentComposite_output = {
    LATENT: LATENT
}

// LatentRotate -------------------------------
export class LatentRotate {
    constructor(public p: LatentRotate_input) {}
}
export type LatentRotate_input = {
    samples: LATENT
    rotation: enum_LatentRotate_rotation
}
export type LatentRotate_output = {
    LATENT: LATENT
}

// LatentFlip -------------------------------
export class LatentFlip {
    constructor(public p: LatentFlip_input) {}
}
export type LatentFlip_input = {
    samples: LATENT
    flip_method: enum_LatentFlip_flip_method
}
export type LatentFlip_output = {
    LATENT: LATENT
}

// LatentCrop -------------------------------
export class LatentCrop {
    constructor(public p: LatentCrop_input) {}
}
export type LatentCrop_input = {
    samples: LATENT
    width: INT
    height: INT
    x: INT
    y: INT
}
export type LatentCrop_output = {
    LATENT: LATENT
}

// LoraLoader -------------------------------
export class LoraLoader {
    constructor(public p: LoraLoader_input) {}
}
export type LoraLoader_input = {
    model: MODEL
    clip: CLIP
    lora_name: enum_LoraLoader_lora_name
    strength_model: FLOAT
    strength_clip: FLOAT
}
export type LoraLoader_output = {
    MODEL: MODEL
    CLIP: CLIP
}

// CLIPLoader -------------------------------
export class CLIPLoader {
    constructor(public p: CLIPLoader_input) {}
}
export type CLIPLoader_input = {
    clip_name: enum_CLIPLoader_clip_name
    stop_at_clip_layer: INT
}
export type CLIPLoader_output = {
    CLIP: CLIP
}

// ControlNetApply -------------------------------
export class ControlNetApply {
    constructor(public p: ControlNetApply_input) {}
}
export type ControlNetApply_input = {
    conditioning: CONDITIONING
    control_net: CONTROL_NET
    image: IMAGE
    strength: FLOAT
}
export type ControlNetApply_output = {
    CONDITIONING: CONDITIONING
}

// ControlNetLoader -------------------------------
export class ControlNetLoader {
    constructor(public p: ControlNetLoader_input) {}
}
export type ControlNetLoader_input = {
    control_net_name: enum_ControlNetLoader_control_net_name
}
export type ControlNetLoader_output = {
    CONTROL_NET: CONTROL_NET
}

// DiffControlNetLoader -------------------------------
export class DiffControlNetLoader {
    constructor(public p: DiffControlNetLoader_input) {}
}
export type DiffControlNetLoader_input = {
    model: MODEL
    control_net_name: enum_ControlNetLoader_control_net_name
}
export type DiffControlNetLoader_output = {
    CONTROL_NET: CONTROL_NET
}

// T2IAdapterLoader -------------------------------
export class T2IAdapterLoader {
    constructor(public p: T2IAdapterLoader_input) {}
}
export type T2IAdapterLoader_input = {
    t2i_adapter_name: enum_CLIPLoader_clip_name
}
export type T2IAdapterLoader_output = {
    CONTROL_NET: CONTROL_NET
}

// VAEDecodeTiled -------------------------------
export class VAEDecodeTiled {
    constructor(public p: VAEDecodeTiled_input) {}
}
export type VAEDecodeTiled_input = {
    samples: LATENT
    vae: VAE
}
export type VAEDecodeTiled_output = {
    IMAGE: IMAGE
}
