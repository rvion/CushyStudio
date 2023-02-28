// TYPES
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
// ENUMS
type enum_KSampler_sampler_name = 'sample_euler' | 'sample_euler_ancestral' | 'sample_heun' | 'sample_dpm_2' | 'sample_dpm_2_ancestral' | 'sample_lms' | 'sample_dpm_fast' | 'sample_dpm_adaptive' | 'sample_dpmpp_2s_ancestral' | 'sample_dpmpp_sde' | 'sample_dpmpp_2m' | 'ddim' | 'uni_pc' | 'uni_pc_bh2'
type enum_KSampler_scheduler = 'karras' | 'normal' | 'simple' | 'ddim_uniform'
type enum_CheckpointLoader_config_name = 'anything_v3.yaml' | 'v1-inference.yaml' | 'v1-inference_clip_skip_2.yaml' | 'v1-inference_clip_skip_2_fp16.yaml' | 'v1-inference_fp16.yaml' | 'v1-inpainting-inference.yaml' | 'v2-inference-v.yaml' | 'v2-inference-v_fp32.yaml' | 'v2-inference.yaml' | 'v2-inference_fp32.yaml' | 'v2-inpainting-inference.yaml'
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
// NODES
type KSampler_input = {
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
type KSampler_output = any
class KSampler {
    constructor(public p: KSampler_input){
    }
}
type CheckpointLoader_input = {
    config_name: enum_CheckpointLoader_config_name
    ckpt_name: enum_CheckpointLoader_ckpt_name
}
type CheckpointLoader_output = any
class CheckpointLoader {
    constructor(public p: CheckpointLoader_input){
    }
}
type CLIPTextEncode_input = {
    text: STRING
    clip: CLIP
}
type CLIPTextEncode_output = any
class CLIPTextEncode {
    constructor(public p: CLIPTextEncode_input){
    }
}
type VAEDecode_input = {
    samples: LATENT
    vae: VAE
}
type VAEDecode_output = any
class VAEDecode {
    constructor(public p: VAEDecode_input){
    }
}
type VAEEncode_input = {
    pixels: IMAGE
    vae: VAE
}
type VAEEncode_output = any
class VAEEncode {
    constructor(public p: VAEEncode_input){
    }
}
type VAEEncodeForInpaint_input = {
    pixels: IMAGE
    vae: VAE
    mask: MASK
}
type VAEEncodeForInpaint_output = any
class VAEEncodeForInpaint {
    constructor(public p: VAEEncodeForInpaint_input){
    }
}
type VAELoader_input = {
    vae_name: enum_VAELoader_vae_name
}
type VAELoader_output = any
class VAELoader {
    constructor(public p: VAELoader_input){
    }
}
type EmptyLatentImage_input = {
    width: INT
    height: INT
    batch_size: INT
}
type EmptyLatentImage_output = any
class EmptyLatentImage {
    constructor(public p: EmptyLatentImage_input){
    }
}
type LatentUpscale_input = {
    samples: LATENT
    upscale_method: enum_LatentUpscale_upscale_method
    width: INT
    height: INT
    crop: enum_LatentUpscale_crop
}
type LatentUpscale_output = any
class LatentUpscale {
    constructor(public p: LatentUpscale_input){
    }
}
type SaveImage_input = {
    images: IMAGE
    filename_prefix: STRING
}
type SaveImage_output = any
class SaveImage {
    constructor(public p: SaveImage_input){
    }
}
type LoadImage_input = {
    image: enum_LoadImage_image
}
type LoadImage_output = any
class LoadImage {
    constructor(public p: LoadImage_input){
    }
}
type LoadImageMask_input = {
    image: enum_LoadImage_image
    channel: enum_LoadImageMask_channel
}
type LoadImageMask_output = any
class LoadImageMask {
    constructor(public p: LoadImageMask_input){
    }
}
type ImageScale_input = {
    image: IMAGE
    upscale_method: enum_LatentUpscale_upscale_method
    width: INT
    height: INT
    crop: enum_LatentUpscale_crop
}
type ImageScale_output = any
class ImageScale {
    constructor(public p: ImageScale_input){
    }
}
type ImageInvert_input = {
    image: IMAGE
}
type ImageInvert_output = any
class ImageInvert {
    constructor(public p: ImageInvert_input){
    }
}
type ConditioningCombine_input = {
    conditioning_1: CONDITIONING
    conditioning_2: CONDITIONING
}
type ConditioningCombine_output = any
class ConditioningCombine {
    constructor(public p: ConditioningCombine_input){
    }
}
type ConditioningSetArea_input = {
    conditioning: CONDITIONING
    width: INT
    height: INT
    x: INT
    y: INT
    strength: FLOAT
}
type ConditioningSetArea_output = any
class ConditioningSetArea {
    constructor(public p: ConditioningSetArea_input){
    }
}
type KSamplerAdvanced_input = {
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
type KSamplerAdvanced_output = any
class KSamplerAdvanced {
    constructor(public p: KSamplerAdvanced_input){
    }
}
type SetLatentNoiseMask_input = {
    samples: LATENT
    mask: MASK
}
type SetLatentNoiseMask_output = any
class SetLatentNoiseMask {
    constructor(public p: SetLatentNoiseMask_input){
    }
}
type LatentComposite_input = {
    samples_to: LATENT
    samples_from: LATENT
    x: INT
    y: INT
    feather: INT
}
type LatentComposite_output = any
class LatentComposite {
    constructor(public p: LatentComposite_input){
    }
}
type LatentRotate_input = {
    samples: LATENT
    rotation: enum_LatentRotate_rotation
}
type LatentRotate_output = any
class LatentRotate {
    constructor(public p: LatentRotate_input){
    }
}
type LatentFlip_input = {
    samples: LATENT
    flip_method: enum_LatentFlip_flip_method
}
type LatentFlip_output = any
class LatentFlip {
    constructor(public p: LatentFlip_input){
    }
}
type LatentCrop_input = {
    samples: LATENT
    width: INT
    height: INT
    x: INT
    y: INT
}
type LatentCrop_output = any
class LatentCrop {
    constructor(public p: LatentCrop_input){
    }
}
type LoraLoader_input = {
    model: MODEL
    clip: CLIP
    lora_name: enum_LoraLoader_lora_name
    strength_model: FLOAT
    strength_clip: FLOAT
}
type LoraLoader_output = any
class LoraLoader {
    constructor(public p: LoraLoader_input){
    }
}
type CLIPLoader_input = {
    clip_name: enum_CLIPLoader_clip_name
    stop_at_clip_layer: INT
}
type CLIPLoader_output = any
class CLIPLoader {
    constructor(public p: CLIPLoader_input){
    }
}
type ControlNetApply_input = {
    conditioning: CONDITIONING
    control_net: CONTROL_NET
    image: IMAGE
    strength: FLOAT
}
type ControlNetApply_output = any
class ControlNetApply {
    constructor(public p: ControlNetApply_input){
    }
}
type ControlNetLoader_input = {
    control_net_name: enum_ControlNetLoader_control_net_name
}
type ControlNetLoader_output = any
class ControlNetLoader {
    constructor(public p: ControlNetLoader_input){
    }
}
type DiffControlNetLoader_input = {
    model: MODEL
    control_net_name: enum_ControlNetLoader_control_net_name
}
type DiffControlNetLoader_output = any
class DiffControlNetLoader {
    constructor(public p: DiffControlNetLoader_input){
    }
}
type T2IAdapterLoader_input = {
    t2i_adapter_name: enum_CLIPLoader_clip_name
}
type T2IAdapterLoader_output = any
class T2IAdapterLoader {
    constructor(public p: T2IAdapterLoader_input){
    }
}
type VAEDecodeTiled_input = {
    samples: LATENT
    vae: VAE
}
type VAEDecodeTiled_output = any
class VAEDecodeTiled {
    constructor(public p: VAEDecodeTiled_input){
    }
}