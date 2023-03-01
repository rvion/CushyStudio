import * as rt from './runtime.ts'
// TYPES -------------------------------
type MODEL = rt.Signal<'MODEL'>
type INT = number
type FLOAT = number
type CONDITIONING = rt.Signal<'CONDITIONING'>
type LATENT = rt.Signal<'LATENT'>
type STRING = string
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

// NODES -------------------------------

// KSampler -------------------------------
export class KSampler {
    static inputs = [
        { 'name': 'model', 'type': 'MODEL' },
        { 'name': 'seed', 'type': 'INT', 'opts': { 'default': 0, 'min': 0, 'max': 18446744073709552000 } },
        { 'name': 'steps', 'type': 'INT', 'opts': { 'default': 20, 'min': 1, 'max': 10000 } },
        { 'name': 'cfg', 'type': 'FLOAT', 'opts': { 'default': 8, 'min': 0, 'max': 100 } },
        { 'name': 'sampler_name', 'type': 'enum_KSampler_sampler_name' },
        { 'name': 'scheduler', 'type': 'enum_KSampler_scheduler' },
        { 'name': 'positive', 'type': 'CONDITIONING' },
        { 'name': 'negative', 'type': 'CONDITIONING' },
        { 'name': 'latent_image', 'type': 'LATENT' },
        { 'name': 'denoise', 'type': 'FLOAT', 'opts': { 'default': 1, 'min': 0, 'max': 1, 'step': 0.01 } },
    ]
    static outputs = [{ 'type': 'LATENT', 'name': 'LATENT' }]
    constructor(
        public p: {
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
        },
    ) {}
    LATENT = new rt.Signal<'LATENT'>('LATENT')
}

// CheckpointLoader -------------------------------
export class CheckpointLoader {
    static inputs = [{ 'name': 'config_name', 'type': 'enum_CheckpointLoader_config_name' }, {
        'name': 'ckpt_name',
        'type': 'enum_CheckpointLoader_ckpt_name',
    }]
    static outputs = [{ 'type': 'MODEL', 'name': 'MODEL' }, { 'type': 'CLIP', 'name': 'CLIP' }, {
        'type': 'VAE',
        'name': 'VAE',
    }]
    constructor(
        public p: {
            config_name: enum_CheckpointLoader_config_name
            ckpt_name: enum_CheckpointLoader_ckpt_name
        },
    ) {}
    MODEL = new rt.Signal<'MODEL'>('MODEL')
    CLIP = new rt.Signal<'CLIP'>('CLIP')
    VAE = new rt.Signal<'VAE'>('VAE')
}

// CLIPTextEncode -------------------------------
export class CLIPTextEncode {
    static inputs = [{ 'name': 'text', 'type': 'STRING', 'opts': { 'multiline': true, 'dynamic_prompt': true } }, {
        'name': 'clip',
        'type': 'CLIP',
    }]
    static outputs = [{ 'type': 'CONDITIONING', 'name': 'CONDITIONING' }]
    constructor(
        public p: {
            text: STRING
            clip: CLIP
        },
    ) {}
    CONDITIONING = new rt.Signal<'CONDITIONING'>('CONDITIONING')
}

// VAEDecode -------------------------------
export class VAEDecode {
    static inputs = [{ 'name': 'samples', 'type': 'LATENT' }, { 'name': 'vae', 'type': 'VAE' }]
    static outputs = [{ 'type': 'IMAGE', 'name': 'IMAGE' }]
    constructor(
        public p: {
            samples: LATENT
            vae: VAE
        },
    ) {}
    IMAGE = new rt.Signal<'IMAGE'>('IMAGE')
}

// VAEEncode -------------------------------
export class VAEEncode {
    static inputs = [{ 'name': 'pixels', 'type': 'IMAGE' }, { 'name': 'vae', 'type': 'VAE' }]
    static outputs = [{ 'type': 'LATENT', 'name': 'LATENT' }]
    constructor(
        public p: {
            pixels: IMAGE
            vae: VAE
        },
    ) {}
    LATENT = new rt.Signal<'LATENT'>('LATENT')
}

// VAEEncodeForInpaint -------------------------------
export class VAEEncodeForInpaint {
    static inputs = [{ 'name': 'pixels', 'type': 'IMAGE' }, { 'name': 'vae', 'type': 'VAE' }, {
        'name': 'mask',
        'type': 'MASK',
    }]
    static outputs = [{ 'type': 'LATENT', 'name': 'LATENT' }]
    constructor(
        public p: {
            pixels: IMAGE
            vae: VAE
            mask: MASK
        },
    ) {}
    LATENT = new rt.Signal<'LATENT'>('LATENT')
}

// VAELoader -------------------------------
export class VAELoader {
    static inputs = [{ 'name': 'vae_name', 'type': 'enum_VAELoader_vae_name' }]
    static outputs = [{ 'type': 'VAE', 'name': 'VAE' }]
    constructor(
        public p: {
            vae_name: enum_VAELoader_vae_name
        },
    ) {}
    VAE = new rt.Signal<'VAE'>('VAE')
}

// EmptyLatentImage -------------------------------
export class EmptyLatentImage {
    static inputs = [
        { 'name': 'width', 'type': 'INT', 'opts': { 'default': 512, 'min': 64, 'max': 4096, 'step': 64 } },
        { 'name': 'height', 'type': 'INT', 'opts': { 'default': 512, 'min': 64, 'max': 4096, 'step': 64 } },
        { 'name': 'batch_size', 'type': 'INT', 'opts': { 'default': 1, 'min': 1, 'max': 64 } },
    ]
    static outputs = [{ 'type': 'LATENT', 'name': 'LATENT' }]
    constructor(
        public p: {
            width: INT
            height: INT
            batch_size: INT
        },
    ) {}
    LATENT = new rt.Signal<'LATENT'>('LATENT')
}

// LatentUpscale -------------------------------
export class LatentUpscale {
    static inputs = [
        { 'name': 'samples', 'type': 'LATENT' },
        { 'name': 'upscale_method', 'type': 'enum_LatentUpscale_upscale_method' },
        { 'name': 'width', 'type': 'INT', 'opts': { 'default': 512, 'min': 64, 'max': 4096, 'step': 64 } },
        { 'name': 'height', 'type': 'INT', 'opts': { 'default': 512, 'min': 64, 'max': 4096, 'step': 64 } },
        { 'name': 'crop', 'type': 'enum_LatentUpscale_crop' },
    ]
    static outputs = [{ 'type': 'LATENT', 'name': 'LATENT' }]
    constructor(
        public p: {
            samples: LATENT
            upscale_method: enum_LatentUpscale_upscale_method
            width: INT
            height: INT
            crop: enum_LatentUpscale_crop
        },
    ) {}
    LATENT = new rt.Signal<'LATENT'>('LATENT')
}

// SaveImage -------------------------------
export class SaveImage {
    static inputs = [{ 'name': 'images', 'type': 'IMAGE' }, {
        'name': 'filename_prefix',
        'type': 'STRING',
        'opts': { 'default': 'ComfyUI' },
    }]
    static outputs = []
    constructor(
        public p: {
            images: IMAGE
            filename_prefix: STRING
        },
    ) {}
}

// LoadImage -------------------------------
export class LoadImage {
    static inputs = [{ 'name': 'image', 'type': 'enum_LoadImage_image' }]
    static outputs = [{ 'type': 'IMAGE', 'name': 'IMAGE' }]
    constructor(
        public p: {
            image: enum_LoadImage_image
        },
    ) {}
    IMAGE = new rt.Signal<'IMAGE'>('IMAGE')
}

// LoadImageMask -------------------------------
export class LoadImageMask {
    static inputs = [{ 'name': 'image', 'type': 'enum_LoadImage_image' }, {
        'name': 'channel',
        'type': 'enum_LoadImageMask_channel',
    }]
    static outputs = [{ 'type': 'MASK', 'name': 'MASK' }]
    constructor(
        public p: {
            image: enum_LoadImage_image
            channel: enum_LoadImageMask_channel
        },
    ) {}
    MASK = new rt.Signal<'MASK'>('MASK')
}

// ImageScale -------------------------------
export class ImageScale {
    static inputs = [
        { 'name': 'image', 'type': 'IMAGE' },
        { 'name': 'upscale_method', 'type': 'enum_LatentUpscale_upscale_method' },
        { 'name': 'width', 'type': 'INT', 'opts': { 'default': 512, 'min': 1, 'max': 4096, 'step': 1 } },
        { 'name': 'height', 'type': 'INT', 'opts': { 'default': 512, 'min': 1, 'max': 4096, 'step': 1 } },
        { 'name': 'crop', 'type': 'enum_LatentUpscale_crop' },
    ]
    static outputs = [{ 'type': 'IMAGE', 'name': 'IMAGE' }]
    constructor(
        public p: {
            image: IMAGE
            upscale_method: enum_LatentUpscale_upscale_method
            width: INT
            height: INT
            crop: enum_LatentUpscale_crop
        },
    ) {}
    IMAGE = new rt.Signal<'IMAGE'>('IMAGE')
}

// ImageInvert -------------------------------
export class ImageInvert {
    static inputs = [{ 'name': 'image', 'type': 'IMAGE' }]
    static outputs = [{ 'type': 'IMAGE', 'name': 'IMAGE' }]
    constructor(
        public p: {
            image: IMAGE
        },
    ) {}
    IMAGE = new rt.Signal<'IMAGE'>('IMAGE')
}

// ConditioningCombine -------------------------------
export class ConditioningCombine {
    static inputs = [{ 'name': 'conditioning_1', 'type': 'CONDITIONING' }, {
        'name': 'conditioning_2',
        'type': 'CONDITIONING',
    }]
    static outputs = [{ 'type': 'CONDITIONING', 'name': 'CONDITIONING' }]
    constructor(
        public p: {
            conditioning_1: CONDITIONING
            conditioning_2: CONDITIONING
        },
    ) {}
    CONDITIONING = new rt.Signal<'CONDITIONING'>('CONDITIONING')
}

// ConditioningSetArea -------------------------------
export class ConditioningSetArea {
    static inputs = [
        { 'name': 'conditioning', 'type': 'CONDITIONING' },
        { 'name': 'width', 'type': 'INT', 'opts': { 'default': 64, 'min': 64, 'max': 4096, 'step': 64 } },
        { 'name': 'height', 'type': 'INT', 'opts': { 'default': 64, 'min': 64, 'max': 4096, 'step': 64 } },
        { 'name': 'x', 'type': 'INT', 'opts': { 'default': 0, 'min': 0, 'max': 4096, 'step': 64 } },
        { 'name': 'y', 'type': 'INT', 'opts': { 'default': 0, 'min': 0, 'max': 4096, 'step': 64 } },
        { 'name': 'strength', 'type': 'FLOAT', 'opts': { 'default': 1, 'min': 0, 'max': 10, 'step': 0.01 } },
    ]
    static outputs = [{ 'type': 'CONDITIONING', 'name': 'CONDITIONING' }]
    constructor(
        public p: {
            conditioning: CONDITIONING
            width: INT
            height: INT
            x: INT
            y: INT
            strength: FLOAT
        },
    ) {}
    CONDITIONING = new rt.Signal<'CONDITIONING'>('CONDITIONING')
}

// KSamplerAdvanced -------------------------------
export class KSamplerAdvanced {
    static inputs = [
        { 'name': 'model', 'type': 'MODEL' },
        { 'name': 'add_noise', 'type': 'enum_KSamplerAdvanced_add_noise' },
        { 'name': 'noise_seed', 'type': 'INT', 'opts': { 'default': 0, 'min': 0, 'max': 18446744073709552000 } },
        { 'name': 'steps', 'type': 'INT', 'opts': { 'default': 20, 'min': 1, 'max': 10000 } },
        { 'name': 'cfg', 'type': 'FLOAT', 'opts': { 'default': 8, 'min': 0, 'max': 100 } },
        { 'name': 'sampler_name', 'type': 'enum_KSampler_sampler_name' },
        { 'name': 'scheduler', 'type': 'enum_KSampler_scheduler' },
        { 'name': 'positive', 'type': 'CONDITIONING' },
        { 'name': 'negative', 'type': 'CONDITIONING' },
        { 'name': 'latent_image', 'type': 'LATENT' },
        { 'name': 'start_at_step', 'type': 'INT', 'opts': { 'default': 0, 'min': 0, 'max': 10000 } },
        { 'name': 'end_at_step', 'type': 'INT', 'opts': { 'default': 10000, 'min': 0, 'max': 10000 } },
        { 'name': 'return_with_leftover_noise', 'type': 'enum_KSamplerAdvanced_return_with_leftover_noise' },
    ]
    static outputs = [{ 'type': 'LATENT', 'name': 'LATENT' }]
    constructor(
        public p: {
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
        },
    ) {}
    LATENT = new rt.Signal<'LATENT'>('LATENT')
}

// SetLatentNoiseMask -------------------------------
export class SetLatentNoiseMask {
    static inputs = [{ 'name': 'samples', 'type': 'LATENT' }, { 'name': 'mask', 'type': 'MASK' }]
    static outputs = [{ 'type': 'LATENT', 'name': 'LATENT' }]
    constructor(
        public p: {
            samples: LATENT
            mask: MASK
        },
    ) {}
    LATENT = new rt.Signal<'LATENT'>('LATENT')
}

// LatentComposite -------------------------------
export class LatentComposite {
    static inputs = [
        { 'name': 'samples_to', 'type': 'LATENT' },
        { 'name': 'samples_from', 'type': 'LATENT' },
        { 'name': 'x', 'type': 'INT', 'opts': { 'default': 0, 'min': 0, 'max': 4096, 'step': 8 } },
        { 'name': 'y', 'type': 'INT', 'opts': { 'default': 0, 'min': 0, 'max': 4096, 'step': 8 } },
        { 'name': 'feather', 'type': 'INT', 'opts': { 'default': 0, 'min': 0, 'max': 4096, 'step': 8 } },
    ]
    static outputs = [{ 'type': 'LATENT', 'name': 'LATENT' }]
    constructor(
        public p: {
            samples_to: LATENT
            samples_from: LATENT
            x: INT
            y: INT
            feather: INT
        },
    ) {}
    LATENT = new rt.Signal<'LATENT'>('LATENT')
}

// LatentRotate -------------------------------
export class LatentRotate {
    static inputs = [{ 'name': 'samples', 'type': 'LATENT' }, {
        'name': 'rotation',
        'type': 'enum_LatentRotate_rotation',
    }]
    static outputs = [{ 'type': 'LATENT', 'name': 'LATENT' }]
    constructor(
        public p: {
            samples: LATENT
            rotation: enum_LatentRotate_rotation
        },
    ) {}
    LATENT = new rt.Signal<'LATENT'>('LATENT')
}

// LatentFlip -------------------------------
export class LatentFlip {
    static inputs = [{ 'name': 'samples', 'type': 'LATENT' }, {
        'name': 'flip_method',
        'type': 'enum_LatentFlip_flip_method',
    }]
    static outputs = [{ 'type': 'LATENT', 'name': 'LATENT' }]
    constructor(
        public p: {
            samples: LATENT
            flip_method: enum_LatentFlip_flip_method
        },
    ) {}
    LATENT = new rt.Signal<'LATENT'>('LATENT')
}

// LatentCrop -------------------------------
export class LatentCrop {
    static inputs = [
        { 'name': 'samples', 'type': 'LATENT' },
        { 'name': 'width', 'type': 'INT', 'opts': { 'default': 512, 'min': 64, 'max': 4096, 'step': 64 } },
        { 'name': 'height', 'type': 'INT', 'opts': { 'default': 512, 'min': 64, 'max': 4096, 'step': 64 } },
        { 'name': 'x', 'type': 'INT', 'opts': { 'default': 0, 'min': 0, 'max': 4096, 'step': 8 } },
        { 'name': 'y', 'type': 'INT', 'opts': { 'default': 0, 'min': 0, 'max': 4096, 'step': 8 } },
    ]
    static outputs = [{ 'type': 'LATENT', 'name': 'LATENT' }]
    constructor(
        public p: {
            samples: LATENT
            width: INT
            height: INT
            x: INT
            y: INT
        },
    ) {}
    LATENT = new rt.Signal<'LATENT'>('LATENT')
}

// LoraLoader -------------------------------
export class LoraLoader {
    static inputs = [
        { 'name': 'model', 'type': 'MODEL' },
        { 'name': 'clip', 'type': 'CLIP' },
        { 'name': 'lora_name', 'type': 'enum_LoraLoader_lora_name' },
        { 'name': 'strength_model', 'type': 'FLOAT', 'opts': { 'default': 1, 'min': 0, 'max': 10, 'step': 0.01 } },
        { 'name': 'strength_clip', 'type': 'FLOAT', 'opts': { 'default': 1, 'min': 0, 'max': 10, 'step': 0.01 } },
    ]
    static outputs = [{ 'type': 'MODEL', 'name': 'MODEL' }, { 'type': 'CLIP', 'name': 'CLIP' }]
    constructor(
        public p: {
            model: MODEL
            clip: CLIP
            lora_name: enum_LoraLoader_lora_name
            strength_model: FLOAT
            strength_clip: FLOAT
        },
    ) {}
    MODEL = new rt.Signal<'MODEL'>('MODEL')
    CLIP = new rt.Signal<'CLIP'>('CLIP')
}

// CLIPLoader -------------------------------
export class CLIPLoader {
    static inputs = [{ 'name': 'clip_name', 'type': 'enum_CLIPLoader_clip_name' }, {
        'name': 'stop_at_clip_layer',
        'type': 'INT',
        'opts': { 'default': -1, 'min': -24, 'max': -1, 'step': 1 },
    }]
    static outputs = [{ 'type': 'CLIP', 'name': 'CLIP' }]
    constructor(
        public p: {
            clip_name: enum_CLIPLoader_clip_name
            stop_at_clip_layer: INT
        },
    ) {}
    CLIP = new rt.Signal<'CLIP'>('CLIP')
}

// ControlNetApply -------------------------------
export class ControlNetApply {
    static inputs = [
        { 'name': 'conditioning', 'type': 'CONDITIONING' },
        { 'name': 'control_net', 'type': 'CONTROL_NET' },
        { 'name': 'image', 'type': 'IMAGE' },
        { 'name': 'strength', 'type': 'FLOAT', 'opts': { 'default': 1, 'min': 0, 'max': 10, 'step': 0.01 } },
    ]
    static outputs = [{ 'type': 'CONDITIONING', 'name': 'CONDITIONING' }]
    constructor(
        public p: {
            conditioning: CONDITIONING
            control_net: CONTROL_NET
            image: IMAGE
            strength: FLOAT
        },
    ) {}
    CONDITIONING = new rt.Signal<'CONDITIONING'>('CONDITIONING')
}

// ControlNetLoader -------------------------------
export class ControlNetLoader {
    static inputs = [{ 'name': 'control_net_name', 'type': 'enum_ControlNetLoader_control_net_name' }]
    static outputs = [{ 'type': 'CONTROL_NET', 'name': 'CONTROL_NET' }]
    constructor(
        public p: {
            control_net_name: enum_ControlNetLoader_control_net_name
        },
    ) {}
    CONTROL_NET = new rt.Signal<'CONTROL_NET'>('CONTROL_NET')
}

// DiffControlNetLoader -------------------------------
export class DiffControlNetLoader {
    static inputs = [{ 'name': 'model', 'type': 'MODEL' }, {
        'name': 'control_net_name',
        'type': 'enum_ControlNetLoader_control_net_name',
    }]
    static outputs = [{ 'type': 'CONTROL_NET', 'name': 'CONTROL_NET' }]
    constructor(
        public p: {
            model: MODEL
            control_net_name: enum_ControlNetLoader_control_net_name
        },
    ) {}
    CONTROL_NET = new rt.Signal<'CONTROL_NET'>('CONTROL_NET')
}

// T2IAdapterLoader -------------------------------
export class T2IAdapterLoader {
    static inputs = [{ 'name': 't2i_adapter_name', 'type': 'enum_CLIPLoader_clip_name' }]
    static outputs = [{ 'type': 'CONTROL_NET', 'name': 'CONTROL_NET' }]
    constructor(
        public p: {
            t2i_adapter_name: enum_CLIPLoader_clip_name
        },
    ) {}
    CONTROL_NET = new rt.Signal<'CONTROL_NET'>('CONTROL_NET')
}

// VAEDecodeTiled -------------------------------
export class VAEDecodeTiled {
    static inputs = [{ 'name': 'samples', 'type': 'LATENT' }, { 'name': 'vae', 'type': 'VAE' }]
    static outputs = [{ 'type': 'IMAGE', 'name': 'IMAGE' }]
    constructor(
        public p: {
            samples: LATENT
            vae: VAE
        },
    ) {}
    IMAGE = new rt.Signal<'IMAGE'>('IMAGE')
}

// INDEX -------------------------------
export const nodes = {
    KSampler,
    CheckpointLoader,
    CLIPTextEncode,
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
