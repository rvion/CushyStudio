/// <reference types="./cushy" />

import type { Slot } from './core-shared/Slot'
import type { ComfyNodeUID } from './core-types/NodeUID'
import type { ComfyNode } from './core-shared/Node'
import type { ComfyNodeSchemaJSON } from './core-types/ComfySchemaJSON'
import type { Graph } from './core-shared/Graph'
import type { Workflow } from './core-shared/Workflow'
import { FlowExecution } from './core-back/FlowExecution'

// TYPES -------------------------------
export type CLIP_VISION_OUTPUT = Slot<'CLIP_VISION_OUTPUT'>
export type UPSCALE_MODEL = Slot<'UPSCALE_MODEL'>
export type CONDITIONING = Slot<'CONDITIONING'>
export type CLIP_VISION = Slot<'CLIP_VISION'>
export type STYLE_MODEL = Slot<'STYLE_MODEL'>
export type CONTROL_NET = Slot<'CONTROL_NET'>
export type LATENT = Slot<'LATENT'>
export type MODEL = Slot<'MODEL'>
export type IMAGE = Slot<'IMAGE'>
export type ASCII = Slot<'ASCII'>
export type CLIP = Slot<'CLIP'>
export type MASK = Slot<'MASK'>
export type SEED = Slot<'SEED'>
export type VAE = Slot<'VAE'>
export type INT = number
export type FLOAT = number
export type STRING = string

// ENUMS -------------------------------
export type Enum_KSampler_sampler_name =
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
export type Enum_KSampler_scheduler = 'ddim_uniform' | 'karras' | 'normal' | 'simple'
export type Enum_CheckpointLoader_config_name =
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
export type Enum_CheckpointLoader_ckpt_name =
    | 'AOM3A1_orangemixs.safetensors'
    | 'AOM3A3_orangemixs.safetensors'
    | 'AbyssOrangeMix2_hard.safetensors'
    | 'anything-v3-fp16-pruned.safetensors'
    | 'deliberate_v2.safetensors'
    | 'v1-5-pruned-emaonly.ckpt'
    | 'v2-1_512-ema-pruned.safetensors'
    | 'v2-1_768-ema-pruned.safetensors'
    | 'wd-1-5-beta2-fp16.safetensors'
export type Enum_VAELoader_vae_name = 'kl-f8-anime2.ckpt' | 'orangemix.vae.pt' | 'vae-ft-mse-840000-ema-pruned.safetensors'
export type Enum_LatentUpscale_upscale_method = 'area' | 'bilinear' | 'nearest-exact'
export type Enum_LatentUpscale_crop = 'center' | 'disabled'
export type Enum_LoadImage_image =
    | '2023-03-19_22-20-04.png'
    | 'ComfyUI_00498_.png'
    | 'ComfyUI_01790_.png'
    | 'decihub-logo-126.png'
    | 'esrgan_example (1).png'
    | 'esrgan_example.png'
    | 'example.png'
    | 'upload.png'
export type Enum_LoadImageMask_channel = 'alpha' | 'blue' | 'green' | 'red'
export type Enum_KSamplerAdvanced_add_noise = 'disable' | 'enable'
export type Enum_LatentRotate_rotation = '180 degrees' | '270 degrees' | '90 degrees' | 'none'
export type Enum_LatentFlip_flip_method = 'x-axis: vertically' | 'y-axis: horizontally'
export type Enum_LoraLoader_lora_name =
    | 'theovercomer8sContrastFix_sd15.safetensors'
    | 'theovercomer8sContrastFix_sd21768.safetensors'
export type Enum_CLIPLoader_clip_name = never
export type Enum_ControlNetLoader_control_net_name =
    | 'control_depth-fp16.safetensors'
    | 'control_openpose-fp16.safetensors'
    | 'control_scribble-fp16.safetensors'
    | 't2iadapter_canny_sd14v1.pth'
    | 't2iadapter_color_sd14v1.pth'
    | 't2iadapter_depth_sd14v1.pth'
    | 't2iadapter_keypose_sd14v1.pth'
    | 't2iadapter_openpose_sd14v1.pth'
    | 't2iadapter_seg_sd14v1.pth'
    | 't2iadapter_sketch_sd14v1.pth'
export type Enum_StyleModelLoader_style_model_name = 't2iadapter_style_sd14v1.pth'
export type Enum_CLIPVisionLoader_clip_name = 'clip_vit14.bin'
export type Enum_WASImageStyleFilter_style =
    | '1977'
    | 'aden'
    | 'brannan'
    | 'brooklyn'
    | 'clarendon'
    | 'earlybird'
    | 'gingham'
    | 'hudson'
    | 'inkwell'
    | 'kelvin'
    | 'lark'
    | 'lofi'
    | 'maven'
    | 'mayfair'
    | 'moon'
    | 'nashville'
    | 'perpetua'
    | 'reyes'
    | 'rise'
    | 'slumber'
    | 'stinson'
    | 'toaster'
    | 'valencia'
    | 'walden'
    | 'willow'
    | 'xpro2'
export type Enum_WASImageBlendingMode_mode =
    | 'add'
    | 'color'
    | 'color_burn'
    | 'color_dodge'
    | 'darken'
    | 'difference'
    | 'exclusion'
    | 'hard_light'
    | 'hue'
    | 'lighten'
    | 'multiply'
    | 'overlay'
    | 'screen'
    | 'soft_light'
export type Enum_WASImageFlip_mode = 'horizontal' | 'vertical'
export type Enum_WASImageRotate_mode = 'internal' | 'transpose'
export type Enum_WASImageRotate_sampler = 'bicubic' | 'bilinear' | 'nearest'
export type Enum_WASImageCannyFilter_enable_threshold = 'false' | 'true'
export type Enum_WASImageEdgeDetectionFilter_mode = 'laplacian' | 'normal'
export type Enum_WASImageFDOFFilter_mode = 'box' | 'gaussian' | 'mock'
export type Enum_WASImageSave_extension = 'gif' | 'jpeg' | 'png' | 'tiff'
export type Enum_WASImageSelectChannel_channel = 'blue' | 'green' | 'red'
export type Enum_WASLatentUpscaleByFactorWAS_mode = 'bicubic' | 'bilinear'
export type Enum_WASMiDaSDepthApproximation_midas_model = 'DPT_Hybrid' | 'DPT_Large' | 'DPT_Small'
export type Enum_WASMiDaSMaskImage_remove = 'background' | 'foregroud'
export type Enum_UpscaleModelLoader_model_name = 'RealESRGAN_x2.pth' | 'RealESRGAN_x4.pth'

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
export interface HasSingle_SEED { _SEED: SEED } // prettier-ignore
export interface HasSingle_ASCII { _ASCII: ASCII } // prettier-ignore
export interface HasSingle_UPSCALE_MODEL { _UPSCALE_MODEL: UPSCALE_MODEL } // prettier-ignore
export interface HasSingle_Enum_KSampler_sampler_name { _Enum_KSampler_sampler_name: Enum_KSampler_sampler_name } // prettier-ignore
export interface HasSingle_Enum_KSampler_scheduler { _Enum_KSampler_scheduler: Enum_KSampler_scheduler } // prettier-ignore
export interface HasSingle_Enum_CheckpointLoader_config_name { _Enum_CheckpointLoader_config_name: Enum_CheckpointLoader_config_name } // prettier-ignore
export interface HasSingle_Enum_CheckpointLoader_ckpt_name { _Enum_CheckpointLoader_ckpt_name: Enum_CheckpointLoader_ckpt_name } // prettier-ignore
export interface HasSingle_Enum_VAELoader_vae_name { _Enum_VAELoader_vae_name: Enum_VAELoader_vae_name } // prettier-ignore
export interface HasSingle_Enum_LatentUpscale_upscale_method { _Enum_LatentUpscale_upscale_method: Enum_LatentUpscale_upscale_method } // prettier-ignore
export interface HasSingle_Enum_LatentUpscale_crop { _Enum_LatentUpscale_crop: Enum_LatentUpscale_crop } // prettier-ignore
export interface HasSingle_Enum_LoadImage_image { _Enum_LoadImage_image: Enum_LoadImage_image } // prettier-ignore
export interface HasSingle_Enum_LoadImageMask_channel { _Enum_LoadImageMask_channel: Enum_LoadImageMask_channel } // prettier-ignore
export interface HasSingle_Enum_KSamplerAdvanced_add_noise { _Enum_KSamplerAdvanced_add_noise: Enum_KSamplerAdvanced_add_noise } // prettier-ignore
export interface HasSingle_Enum_LatentRotate_rotation { _Enum_LatentRotate_rotation: Enum_LatentRotate_rotation } // prettier-ignore
export interface HasSingle_Enum_LatentFlip_flip_method { _Enum_LatentFlip_flip_method: Enum_LatentFlip_flip_method } // prettier-ignore
export interface HasSingle_Enum_LoraLoader_lora_name { _Enum_LoraLoader_lora_name: Enum_LoraLoader_lora_name } // prettier-ignore
export interface HasSingle_Enum_CLIPLoader_clip_name { _Enum_CLIPLoader_clip_name: Enum_CLIPLoader_clip_name } // prettier-ignore
export interface HasSingle_Enum_ControlNetLoader_control_net_name { _Enum_ControlNetLoader_control_net_name: Enum_ControlNetLoader_control_net_name } // prettier-ignore
export interface HasSingle_Enum_StyleModelLoader_style_model_name { _Enum_StyleModelLoader_style_model_name: Enum_StyleModelLoader_style_model_name } // prettier-ignore
export interface HasSingle_Enum_CLIPVisionLoader_clip_name { _Enum_CLIPVisionLoader_clip_name: Enum_CLIPVisionLoader_clip_name } // prettier-ignore
export interface HasSingle_Enum_WASImageStyleFilter_style { _Enum_WASImageStyleFilter_style: Enum_WASImageStyleFilter_style } // prettier-ignore
export interface HasSingle_Enum_WASImageBlendingMode_mode { _Enum_WASImageBlendingMode_mode: Enum_WASImageBlendingMode_mode } // prettier-ignore
export interface HasSingle_Enum_WASImageFlip_mode { _Enum_WASImageFlip_mode: Enum_WASImageFlip_mode } // prettier-ignore
export interface HasSingle_Enum_WASImageRotate_mode { _Enum_WASImageRotate_mode: Enum_WASImageRotate_mode } // prettier-ignore
export interface HasSingle_Enum_WASImageRotate_sampler { _Enum_WASImageRotate_sampler: Enum_WASImageRotate_sampler } // prettier-ignore
export interface HasSingle_Enum_WASImageCannyFilter_enable_threshold { _Enum_WASImageCannyFilter_enable_threshold: Enum_WASImageCannyFilter_enable_threshold } // prettier-ignore
export interface HasSingle_Enum_WASImageEdgeDetectionFilter_mode { _Enum_WASImageEdgeDetectionFilter_mode: Enum_WASImageEdgeDetectionFilter_mode } // prettier-ignore
export interface HasSingle_Enum_WASImageFDOFFilter_mode { _Enum_WASImageFDOFFilter_mode: Enum_WASImageFDOFFilter_mode } // prettier-ignore
export interface HasSingle_Enum_WASImageSave_extension { _Enum_WASImageSave_extension: Enum_WASImageSave_extension } // prettier-ignore
export interface HasSingle_Enum_WASImageSelectChannel_channel { _Enum_WASImageSelectChannel_channel: Enum_WASImageSelectChannel_channel } // prettier-ignore
export interface HasSingle_Enum_WASLatentUpscaleByFactorWAS_mode { _Enum_WASLatentUpscaleByFactorWAS_mode: Enum_WASLatentUpscaleByFactorWAS_mode } // prettier-ignore
export interface HasSingle_Enum_WASMiDaSDepthApproximation_midas_model { _Enum_WASMiDaSDepthApproximation_midas_model: Enum_WASMiDaSDepthApproximation_midas_model } // prettier-ignore
export interface HasSingle_Enum_WASMiDaSMaskImage_remove { _Enum_WASMiDaSMaskImage_remove: Enum_WASMiDaSMaskImage_remove } // prettier-ignore
export interface HasSingle_Enum_UpscaleModelLoader_model_name { _Enum_UpscaleModelLoader_model_name: Enum_UpscaleModelLoader_model_name } // prettier-ignore

// NODES -------------------------------
// |=============================================================================|
// | KSampler                                                                    |
// |=============================================================================|
export interface KSampler extends HasSingle_LATENT, ComfyNode<KSampler_input> {
    LATENT: Slot<'LATENT', 0>
}
export type KSampler_input = {
    model: MODEL | HasSingle_MODEL
    seed: INT
    steps: INT
    cfg: FLOAT
    sampler_name: Enum_KSampler_sampler_name | HasSingle_Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler | HasSingle_Enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    latent_image: LATENT | HasSingle_LATENT
    denoise: FLOAT
}

// |=============================================================================|
// | CheckpointLoader                                                            |
// |=============================================================================|
export interface CheckpointLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<CheckpointLoader_input> {
    MODEL: Slot<'MODEL', 0>
    CLIP: Slot<'CLIP', 1>
    VAE: Slot<'VAE', 2>
}
export type CheckpointLoader_input = {
    config_name: Enum_CheckpointLoader_config_name | HasSingle_Enum_CheckpointLoader_config_name
    ckpt_name: Enum_CheckpointLoader_ckpt_name | HasSingle_Enum_CheckpointLoader_ckpt_name
}

// |=============================================================================|
// | CheckpointLoaderSimple                                                      |
// |=============================================================================|
export interface CheckpointLoaderSimple
    extends HasSingle_MODEL,
        HasSingle_CLIP,
        HasSingle_VAE,
        ComfyNode<CheckpointLoaderSimple_input> {
    MODEL: Slot<'MODEL', 0>
    CLIP: Slot<'CLIP', 1>
    VAE: Slot<'VAE', 2>
}
export type CheckpointLoaderSimple_input = {
    ckpt_name: Enum_CheckpointLoader_ckpt_name | HasSingle_Enum_CheckpointLoader_ckpt_name
}

// |=============================================================================|
// | CLIPTextEncode                                                              |
// |=============================================================================|
export interface CLIPTextEncode extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncode_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type CLIPTextEncode_input = {
    text: STRING
    clip: CLIP | HasSingle_CLIP
}

// |=============================================================================|
// | CLIPSetLastLayer                                                            |
// |=============================================================================|
export interface CLIPSetLastLayer extends HasSingle_CLIP, ComfyNode<CLIPSetLastLayer_input> {
    CLIP: Slot<'CLIP', 0>
}
export type CLIPSetLastLayer_input = {
    clip: CLIP | HasSingle_CLIP
    stop_at_clip_layer: INT
}

// |=============================================================================|
// | VAEDecode                                                                   |
// |=============================================================================|
export interface VAEDecode extends HasSingle_IMAGE, ComfyNode<VAEDecode_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type VAEDecode_input = {
    samples: LATENT | HasSingle_LATENT
    vae: VAE | HasSingle_VAE
}

// |=============================================================================|
// | VAEEncode                                                                   |
// |=============================================================================|
export interface VAEEncode extends HasSingle_LATENT, ComfyNode<VAEEncode_input> {
    LATENT: Slot<'LATENT', 0>
}
export type VAEEncode_input = {
    pixels: IMAGE | HasSingle_IMAGE
    vae: VAE | HasSingle_VAE
}

// |=============================================================================|
// | VAEEncodeForInpaint                                                         |
// |=============================================================================|
export interface VAEEncodeForInpaint extends HasSingle_LATENT, ComfyNode<VAEEncodeForInpaint_input> {
    LATENT: Slot<'LATENT', 0>
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
    VAE: Slot<'VAE', 0>
}
export type VAELoader_input = {
    vae_name: Enum_VAELoader_vae_name | HasSingle_Enum_VAELoader_vae_name
}

// |=============================================================================|
// | EmptyLatentImage                                                            |
// |=============================================================================|
export interface EmptyLatentImage extends HasSingle_LATENT, ComfyNode<EmptyLatentImage_input> {
    LATENT: Slot<'LATENT', 0>
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
    LATENT: Slot<'LATENT', 0>
}
export type LatentUpscale_input = {
    samples: LATENT | HasSingle_LATENT
    upscale_method: Enum_LatentUpscale_upscale_method | HasSingle_Enum_LatentUpscale_upscale_method
    width: INT
    height: INT
    crop: Enum_LatentUpscale_crop | HasSingle_Enum_LatentUpscale_crop
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
// | PreviewImage                                                                |
// |=============================================================================|
export interface PreviewImage extends ComfyNode<PreviewImage_input> {}
export type PreviewImage_input = {
    images: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | LoadImage                                                                   |
// |=============================================================================|
export interface LoadImage extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<LoadImage_input> {
    IMAGE: Slot<'IMAGE', 0>
    MASK: Slot<'MASK', 1>
}
export type LoadImage_input = {
    image: Enum_LoadImage_image | HasSingle_Enum_LoadImage_image
}

// |=============================================================================|
// | LoadImageMask                                                               |
// |=============================================================================|
export interface LoadImageMask extends HasSingle_MASK, ComfyNode<LoadImageMask_input> {
    MASK: Slot<'MASK', 0>
}
export type LoadImageMask_input = {
    image: Enum_LoadImage_image | HasSingle_Enum_LoadImage_image
    channel: Enum_LoadImageMask_channel | HasSingle_Enum_LoadImageMask_channel
}

// |=============================================================================|
// | ImageScale                                                                  |
// |=============================================================================|
export interface ImageScale extends HasSingle_IMAGE, ComfyNode<ImageScale_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageScale_input = {
    image: IMAGE | HasSingle_IMAGE
    upscale_method: Enum_LatentUpscale_upscale_method | HasSingle_Enum_LatentUpscale_upscale_method
    width: INT
    height: INT
    crop: Enum_LatentUpscale_crop | HasSingle_Enum_LatentUpscale_crop
}

// |=============================================================================|
// | ImageInvert                                                                 |
// |=============================================================================|
export interface ImageInvert extends HasSingle_IMAGE, ComfyNode<ImageInvert_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageInvert_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | ImagePadForOutpaint                                                         |
// |=============================================================================|
export interface ImagePadForOutpaint extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImagePadForOutpaint_input> {
    IMAGE: Slot<'IMAGE', 0>
    MASK: Slot<'MASK', 1>
}
export type ImagePadForOutpaint_input = {
    image: IMAGE | HasSingle_IMAGE
    left: INT
    top: INT
    right: INT
    bottom: INT
    feathering: INT
}

// |=============================================================================|
// | ConditioningCombine                                                         |
// |=============================================================================|
export interface ConditioningCombine extends HasSingle_CONDITIONING, ComfyNode<ConditioningCombine_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type ConditioningCombine_input = {
    conditioning_1: CONDITIONING | HasSingle_CONDITIONING
    conditioning_2: CONDITIONING | HasSingle_CONDITIONING
}

// |=============================================================================|
// | ConditioningSetArea                                                         |
// |=============================================================================|
export interface ConditioningSetArea extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetArea_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
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
    LATENT: Slot<'LATENT', 0>
}
export type KSamplerAdvanced_input = {
    model: MODEL | HasSingle_MODEL
    add_noise: Enum_KSamplerAdvanced_add_noise | HasSingle_Enum_KSamplerAdvanced_add_noise
    noise_seed: INT
    steps: INT
    cfg: FLOAT
    sampler_name: Enum_KSampler_sampler_name | HasSingle_Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler | HasSingle_Enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    latent_image: LATENT | HasSingle_LATENT
    start_at_step: INT
    end_at_step: INT
    return_with_leftover_noise: Enum_KSamplerAdvanced_add_noise | HasSingle_Enum_KSamplerAdvanced_add_noise
}

// |=============================================================================|
// | SetLatentNoiseMask                                                          |
// |=============================================================================|
export interface SetLatentNoiseMask extends HasSingle_LATENT, ComfyNode<SetLatentNoiseMask_input> {
    LATENT: Slot<'LATENT', 0>
}
export type SetLatentNoiseMask_input = {
    samples: LATENT | HasSingle_LATENT
    mask: MASK | HasSingle_MASK
}

// |=============================================================================|
// | LatentComposite                                                             |
// |=============================================================================|
export interface LatentComposite extends HasSingle_LATENT, ComfyNode<LatentComposite_input> {
    LATENT: Slot<'LATENT', 0>
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
    LATENT: Slot<'LATENT', 0>
}
export type LatentRotate_input = {
    samples: LATENT | HasSingle_LATENT
    rotation: Enum_LatentRotate_rotation | HasSingle_Enum_LatentRotate_rotation
}

// |=============================================================================|
// | LatentFlip                                                                  |
// |=============================================================================|
export interface LatentFlip extends HasSingle_LATENT, ComfyNode<LatentFlip_input> {
    LATENT: Slot<'LATENT', 0>
}
export type LatentFlip_input = {
    samples: LATENT | HasSingle_LATENT
    flip_method: Enum_LatentFlip_flip_method | HasSingle_Enum_LatentFlip_flip_method
}

// |=============================================================================|
// | LatentCrop                                                                  |
// |=============================================================================|
export interface LatentCrop extends HasSingle_LATENT, ComfyNode<LatentCrop_input> {
    LATENT: Slot<'LATENT', 0>
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
    MODEL: Slot<'MODEL', 0>
    CLIP: Slot<'CLIP', 1>
}
export type LoraLoader_input = {
    model: MODEL | HasSingle_MODEL
    clip: CLIP | HasSingle_CLIP
    lora_name: Enum_LoraLoader_lora_name | HasSingle_Enum_LoraLoader_lora_name
    strength_model: FLOAT
    strength_clip: FLOAT
}

// |=============================================================================|
// | CLIPLoader                                                                  |
// |=============================================================================|
export interface CLIPLoader extends HasSingle_CLIP, ComfyNode<CLIPLoader_input> {
    CLIP: Slot<'CLIP', 0>
}
export type CLIPLoader_input = {
    clip_name: Enum_CLIPLoader_clip_name | HasSingle_Enum_CLIPLoader_clip_name
}

// |=============================================================================|
// | CLIPVisionEncode                                                            |
// |=============================================================================|
export interface CLIPVisionEncode extends HasSingle_CLIP_VISION_OUTPUT, ComfyNode<CLIPVisionEncode_input> {
    CLIP_VISION_OUTPUT: Slot<'CLIP_VISION_OUTPUT', 0>
}
export type CLIPVisionEncode_input = {
    clip_vision: CLIP_VISION | HasSingle_CLIP_VISION
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | StyleModelApply                                                             |
// |=============================================================================|
export interface StyleModelApply extends HasSingle_CONDITIONING, ComfyNode<StyleModelApply_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
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
    CONDITIONING: Slot<'CONDITIONING', 0>
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
    CONTROL_NET: Slot<'CONTROL_NET', 0>
}
export type ControlNetLoader_input = {
    control_net_name: Enum_ControlNetLoader_control_net_name | HasSingle_Enum_ControlNetLoader_control_net_name
}

// |=============================================================================|
// | DiffControlNetLoader                                                        |
// |=============================================================================|
export interface DiffControlNetLoader extends HasSingle_CONTROL_NET, ComfyNode<DiffControlNetLoader_input> {
    CONTROL_NET: Slot<'CONTROL_NET', 0>
}
export type DiffControlNetLoader_input = {
    model: MODEL | HasSingle_MODEL
    control_net_name: Enum_ControlNetLoader_control_net_name | HasSingle_Enum_ControlNetLoader_control_net_name
}

// |=============================================================================|
// | StyleModelLoader                                                            |
// |=============================================================================|
export interface StyleModelLoader extends HasSingle_STYLE_MODEL, ComfyNode<StyleModelLoader_input> {
    STYLE_MODEL: Slot<'STYLE_MODEL', 0>
}
export type StyleModelLoader_input = {
    style_model_name: Enum_StyleModelLoader_style_model_name | HasSingle_Enum_StyleModelLoader_style_model_name
}

// |=============================================================================|
// | CLIPVisionLoader                                                            |
// |=============================================================================|
export interface CLIPVisionLoader extends HasSingle_CLIP_VISION, ComfyNode<CLIPVisionLoader_input> {
    CLIP_VISION: Slot<'CLIP_VISION', 0>
}
export type CLIPVisionLoader_input = {
    clip_name: Enum_CLIPVisionLoader_clip_name | HasSingle_Enum_CLIPVisionLoader_clip_name
}

// |=============================================================================|
// | VAEDecodeTiled                                                              |
// |=============================================================================|
export interface VAEDecodeTiled extends HasSingle_IMAGE, ComfyNode<VAEDecodeTiled_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type VAEDecodeTiled_input = {
    samples: LATENT | HasSingle_LATENT
    vae: VAE | HasSingle_VAE
}

// |=============================================================================|
// | VAEEncodeTiled                                                              |
// |=============================================================================|
export interface VAEEncodeTiled extends HasSingle_LATENT, ComfyNode<VAEEncodeTiled_input> {
    LATENT: Slot<'LATENT', 0>
}
export type VAEEncodeTiled_input = {
    pixels: IMAGE | HasSingle_IMAGE
    vae: VAE | HasSingle_VAE
}

// |=============================================================================|
// | TomePatchModel                                                              |
// |=============================================================================|
export interface TomePatchModel extends HasSingle_MODEL, ComfyNode<TomePatchModel_input> {
    MODEL: Slot<'MODEL', 0>
}
export type TomePatchModel_input = {
    model: MODEL | HasSingle_MODEL
    ratio: FLOAT
}

// |=============================================================================|
// | WASImageFilterAdjustments                                                   |
// |=============================================================================|
export interface WASImageFilterAdjustments extends HasSingle_IMAGE, ComfyNode<WASImageFilterAdjustments_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageFilterAdjustments_input = {
    image: IMAGE | HasSingle_IMAGE
    brightness: FLOAT
    contrast: FLOAT
    saturation: FLOAT
    sharpness: FLOAT
    blur: INT
    gaussian_blur: FLOAT
    edge_enhance: FLOAT
}

// |=============================================================================|
// | WASImageStyleFilter                                                         |
// |=============================================================================|
export interface WASImageStyleFilter extends HasSingle_IMAGE, ComfyNode<WASImageStyleFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageStyleFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    style: Enum_WASImageStyleFilter_style | HasSingle_Enum_WASImageStyleFilter_style
}

// |=============================================================================|
// | WASImageBlendingMode                                                        |
// |=============================================================================|
export interface WASImageBlendingMode extends HasSingle_IMAGE, ComfyNode<WASImageBlendingMode_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageBlendingMode_input = {
    image_a: IMAGE | HasSingle_IMAGE
    image_b: IMAGE | HasSingle_IMAGE
    mode: Enum_WASImageBlendingMode_mode | HasSingle_Enum_WASImageBlendingMode_mode
}

// |=============================================================================|
// | WASImageBlend                                                               |
// |=============================================================================|
export interface WASImageBlend extends HasSingle_IMAGE, ComfyNode<WASImageBlend_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageBlend_input = {
    image_a: IMAGE | HasSingle_IMAGE
    image_b: IMAGE | HasSingle_IMAGE
    blend_percentage: FLOAT
}

// |=============================================================================|
// | WASImageBlendByMask                                                         |
// |=============================================================================|
export interface WASImageBlendByMask extends HasSingle_IMAGE, ComfyNode<WASImageBlendByMask_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageBlendByMask_input = {
    image_a: IMAGE | HasSingle_IMAGE
    image_b: IMAGE | HasSingle_IMAGE
    mask: IMAGE | HasSingle_IMAGE
    blend_percentage: FLOAT
}

// |=============================================================================|
// | WASImageRemoveColor                                                         |
// |=============================================================================|
export interface WASImageRemoveColor extends HasSingle_IMAGE, ComfyNode<WASImageRemoveColor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageRemoveColor_input = {
    image: IMAGE | HasSingle_IMAGE
    target_red: INT
    target_green: INT
    target_blue: INT
    replace_red: INT
    replace_green: INT
    replace_blue: INT
    clip_threshold: INT
}

// |=============================================================================|
// | WASImageThreshold                                                           |
// |=============================================================================|
export interface WASImageThreshold extends HasSingle_IMAGE, ComfyNode<WASImageThreshold_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageThreshold_input = {
    image: IMAGE | HasSingle_IMAGE
    threshold: FLOAT
}

// |=============================================================================|
// | WASImageChromaticAberration                                                 |
// |=============================================================================|
export interface WASImageChromaticAberration extends HasSingle_IMAGE, ComfyNode<WASImageChromaticAberration_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageChromaticAberration_input = {
    image: IMAGE | HasSingle_IMAGE
    red_offset: INT
    green_offset: INT
    blue_offset: INT
    intensity: FLOAT
}

// |=============================================================================|
// | WASImageBloomFilter                                                         |
// |=============================================================================|
export interface WASImageBloomFilter extends HasSingle_IMAGE, ComfyNode<WASImageBloomFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageBloomFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    radius: FLOAT
    intensity: FLOAT
}

// |=============================================================================|
// | WASImageBlank                                                               |
// |=============================================================================|
export interface WASImageBlank extends HasSingle_IMAGE, ComfyNode<WASImageBlank_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageBlank_input = {
    width: INT
    height: INT
    red: INT
    green: INT
    blue: INT
}

// |=============================================================================|
// | WASImageFilmGrain                                                           |
// |=============================================================================|
export interface WASImageFilmGrain extends HasSingle_IMAGE, ComfyNode<WASImageFilmGrain_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageFilmGrain_input = {
    image: IMAGE | HasSingle_IMAGE
    density: FLOAT
    intensity: FLOAT
    highlights: FLOAT
    supersample_factor: INT
}

// |=============================================================================|
// | WASImageFlip                                                                |
// |=============================================================================|
export interface WASImageFlip extends HasSingle_IMAGE, ComfyNode<WASImageFlip_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageFlip_input = {
    image: IMAGE | HasSingle_IMAGE
    mode: Enum_WASImageFlip_mode | HasSingle_Enum_WASImageFlip_mode
}

// |=============================================================================|
// | WASImageRotate                                                              |
// |=============================================================================|
export interface WASImageRotate extends HasSingle_IMAGE, ComfyNode<WASImageRotate_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageRotate_input = {
    image: IMAGE | HasSingle_IMAGE
    mode: Enum_WASImageRotate_mode | HasSingle_Enum_WASImageRotate_mode
    rotation: INT
    sampler: Enum_WASImageRotate_sampler | HasSingle_Enum_WASImageRotate_sampler
}

// |=============================================================================|
// | WASImageNovaFilter                                                          |
// |=============================================================================|
export interface WASImageNovaFilter extends HasSingle_IMAGE, ComfyNode<WASImageNovaFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageNovaFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    amplitude: FLOAT
    frequency: FLOAT
}

// |=============================================================================|
// | WASImageCannyFilter                                                         |
// |=============================================================================|
export interface WASImageCannyFilter extends HasSingle_IMAGE, ComfyNode<WASImageCannyFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageCannyFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    enable_threshold: Enum_WASImageCannyFilter_enable_threshold | HasSingle_Enum_WASImageCannyFilter_enable_threshold
    threshold_low: FLOAT
    threshold_high: FLOAT
}

// |=============================================================================|
// | WASImageEdgeDetectionFilter                                                 |
// |=============================================================================|
export interface WASImageEdgeDetectionFilter extends HasSingle_IMAGE, ComfyNode<WASImageEdgeDetectionFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageEdgeDetectionFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    mode: Enum_WASImageEdgeDetectionFilter_mode | HasSingle_Enum_WASImageEdgeDetectionFilter_mode
}

// |=============================================================================|
// | WASImageFDOFFilter                                                          |
// |=============================================================================|
export interface WASImageFDOFFilter extends HasSingle_IMAGE, ComfyNode<WASImageFDOFFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageFDOFFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    depth: IMAGE | HasSingle_IMAGE
    mode: Enum_WASImageFDOFFilter_mode | HasSingle_Enum_WASImageFDOFFilter_mode
    radius: INT
    samples: INT
}

// |=============================================================================|
// | WASImageMedianFilter                                                        |
// |=============================================================================|
export interface WASImageMedianFilter extends HasSingle_IMAGE, ComfyNode<WASImageMedianFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageMedianFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    diameter: INT
    sigma_color: FLOAT
    sigma_space: FLOAT
}

// |=============================================================================|
// | WASImageSave                                                                |
// |=============================================================================|
export interface WASImageSave extends ComfyNode<WASImageSave_input> {}
export type WASImageSave_input = {
    images: IMAGE | HasSingle_IMAGE
    output_path: STRING
    filename_prefix: STRING
    extension: Enum_WASImageSave_extension | HasSingle_Enum_WASImageSave_extension
    quality: INT
}

// |=============================================================================|
// | WASImageLoad                                                                |
// |=============================================================================|
export interface WASImageLoad extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<WASImageLoad_input> {
    IMAGE: Slot<'IMAGE', 0>
    MASK: Slot<'MASK', 1>
}
export type WASImageLoad_input = {
    image_path: STRING
}

// |=============================================================================|
// | WASImageLevelsAdjustment                                                    |
// |=============================================================================|
export interface WASImageLevelsAdjustment extends HasSingle_IMAGE, ComfyNode<WASImageLevelsAdjustment_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageLevelsAdjustment_input = {
    image: IMAGE | HasSingle_IMAGE
    black_level: FLOAT
    mid_level: FLOAT
    white_level: FLOAT
}

// |=============================================================================|
// | WASImageHighPassFilter                                                      |
// |=============================================================================|
export interface WASImageHighPassFilter extends HasSingle_IMAGE, ComfyNode<WASImageHighPassFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageHighPassFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    radius: INT
    strength: FLOAT
}

// |=============================================================================|
// | WASTensorBatchToImage                                                       |
// |=============================================================================|
export interface WASTensorBatchToImage extends HasSingle_IMAGE, ComfyNode<WASTensorBatchToImage_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASTensorBatchToImage_input = {
    images_batch: IMAGE | HasSingle_IMAGE
    batch_image_number: INT
}

// |=============================================================================|
// | WASImageSelectColor                                                         |
// |=============================================================================|
export interface WASImageSelectColor extends HasSingle_IMAGE, ComfyNode<WASImageSelectColor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageSelectColor_input = {
    image: IMAGE | HasSingle_IMAGE
    red: INT
    green: INT
    blue: INT
    variance: INT
}

// |=============================================================================|
// | WASImageSelectChannel                                                       |
// |=============================================================================|
export interface WASImageSelectChannel extends HasSingle_IMAGE, ComfyNode<WASImageSelectChannel_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageSelectChannel_input = {
    image: IMAGE | HasSingle_IMAGE
    channel: Enum_WASImageSelectChannel_channel | HasSingle_Enum_WASImageSelectChannel_channel
}

// |=============================================================================|
// | WASImageMixRGBChannels                                                      |
// |=============================================================================|
export interface WASImageMixRGBChannels extends HasSingle_IMAGE, ComfyNode<WASImageMixRGBChannels_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageMixRGBChannels_input = {
    red_channel: IMAGE | HasSingle_IMAGE
    green_channel: IMAGE | HasSingle_IMAGE
    blue_channel: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | WASLatentUpscaleByFactorWAS                                                 |
// |=============================================================================|
export interface WASLatentUpscaleByFactorWAS extends HasSingle_LATENT, ComfyNode<WASLatentUpscaleByFactorWAS_input> {
    LATENT: Slot<'LATENT', 0>
}
export type WASLatentUpscaleByFactorWAS_input = {
    samples: LATENT | HasSingle_LATENT
    mode: Enum_WASLatentUpscaleByFactorWAS_mode | HasSingle_Enum_WASLatentUpscaleByFactorWAS_mode
    factor: FLOAT
    align: Enum_WASImageCannyFilter_enable_threshold | HasSingle_Enum_WASImageCannyFilter_enable_threshold
}

// |=============================================================================|
// | WASLatentNoiseInjection                                                     |
// |=============================================================================|
export interface WASLatentNoiseInjection extends HasSingle_LATENT, ComfyNode<WASLatentNoiseInjection_input> {
    LATENT: Slot<'LATENT', 0>
}
export type WASLatentNoiseInjection_input = {
    samples: LATENT | HasSingle_LATENT
    noise_std: FLOAT
}

// |=============================================================================|
// | WASImageToLatentMask                                                        |
// |=============================================================================|
export interface WASImageToLatentMask extends HasSingle_MASK, ComfyNode<WASImageToLatentMask_input> {
    MASK: Slot<'MASK', 0>
}
export type WASImageToLatentMask_input = {
    image: IMAGE | HasSingle_IMAGE
    channel: Enum_LoadImageMask_channel | HasSingle_Enum_LoadImageMask_channel
}

// |=============================================================================|
// | WASMiDaSDepthApproximation                                                  |
// |=============================================================================|
export interface WASMiDaSDepthApproximation extends HasSingle_IMAGE, ComfyNode<WASMiDaSDepthApproximation_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASMiDaSDepthApproximation_input = {
    image: IMAGE | HasSingle_IMAGE
    use_cpu: Enum_WASImageCannyFilter_enable_threshold | HasSingle_Enum_WASImageCannyFilter_enable_threshold
    midas_model: Enum_WASMiDaSDepthApproximation_midas_model | HasSingle_Enum_WASMiDaSDepthApproximation_midas_model
    invert_depth: Enum_WASImageCannyFilter_enable_threshold | HasSingle_Enum_WASImageCannyFilter_enable_threshold
}

// |=============================================================================|
// | WASMiDaSMaskImage                                                           |
// |=============================================================================|
export interface WASMiDaSMaskImage extends ComfyNode<WASMiDaSMaskImage_input> {
    IMAGE: Slot<'IMAGE', 0>
    IMAGE_1: Slot<'IMAGE', 1>
}
export type WASMiDaSMaskImage_input = {
    image: IMAGE | HasSingle_IMAGE
    use_cpu: Enum_WASImageCannyFilter_enable_threshold | HasSingle_Enum_WASImageCannyFilter_enable_threshold
    midas_model: Enum_WASMiDaSDepthApproximation_midas_model | HasSingle_Enum_WASMiDaSDepthApproximation_midas_model
    remove: Enum_WASMiDaSMaskImage_remove | HasSingle_Enum_WASMiDaSMaskImage_remove
    threshold: Enum_WASImageCannyFilter_enable_threshold | HasSingle_Enum_WASImageCannyFilter_enable_threshold
    threshold_low: FLOAT
    threshold_mid: FLOAT
    threshold_high: FLOAT
    smoothing: FLOAT
    background_red: INT
    background_green: INT
    background_blue: INT
}

// |=============================================================================|
// | WASCLIPTextEncodeNSP                                                        |
// |=============================================================================|
export interface WASCLIPTextEncodeNSP extends HasSingle_CONDITIONING, ComfyNode<WASCLIPTextEncodeNSP_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type WASCLIPTextEncodeNSP_input = {
    noodle_key: STRING
    seed: INT
    text: STRING
    clip: CLIP | HasSingle_CLIP
}

// |=============================================================================|
// | WASKSamplerWAS                                                              |
// |=============================================================================|
export interface WASKSamplerWAS extends HasSingle_LATENT, ComfyNode<WASKSamplerWAS_input> {
    LATENT: Slot<'LATENT', 0>
}
export type WASKSamplerWAS_input = {
    model: MODEL | HasSingle_MODEL
    seed: SEED | HasSingle_SEED
    steps: INT
    cfg: FLOAT
    sampler_name: Enum_KSampler_sampler_name | HasSingle_Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler | HasSingle_Enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    latent_image: LATENT | HasSingle_LATENT
    denoise: FLOAT
}

// |=============================================================================|
// | WASSeed                                                                     |
// |=============================================================================|
export interface WASSeed extends HasSingle_SEED, ComfyNode<WASSeed_input> {
    SEED: Slot<'SEED', 0>
}
export type WASSeed_input = {
    seed: INT
}

// |=============================================================================|
// | WASTextMultiline                                                            |
// |=============================================================================|
export interface WASTextMultiline extends HasSingle_ASCII, ComfyNode<WASTextMultiline_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextMultiline_input = {
    text: STRING
}

// |=============================================================================|
// | WASTextString                                                               |
// |=============================================================================|
export interface WASTextString extends HasSingle_ASCII, ComfyNode<WASTextString_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextString_input = {
    text: STRING
}

// |=============================================================================|
// | WASTextRandomLine                                                           |
// |=============================================================================|
export interface WASTextRandomLine extends HasSingle_ASCII, ComfyNode<WASTextRandomLine_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextRandomLine_input = {
    text: ASCII | HasSingle_ASCII
    seed: INT
}

// |=============================================================================|
// | WASTextToConditioning                                                       |
// |=============================================================================|
export interface WASTextToConditioning extends HasSingle_CONDITIONING, ComfyNode<WASTextToConditioning_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type WASTextToConditioning_input = {
    clip: CLIP | HasSingle_CLIP
    text: ASCII | HasSingle_ASCII
}

// |=============================================================================|
// | WASTextConcatenate                                                          |
// |=============================================================================|
export interface WASTextConcatenate extends HasSingle_ASCII, ComfyNode<WASTextConcatenate_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextConcatenate_input = {
    text_a: ASCII | HasSingle_ASCII
    text_b: ASCII | HasSingle_ASCII
    linebreak_addition: Enum_WASImageCannyFilter_enable_threshold | HasSingle_Enum_WASImageCannyFilter_enable_threshold
}

// |=============================================================================|
// | WASTextFindAndReplace                                                       |
// |=============================================================================|
export interface WASTextFindAndReplace extends HasSingle_ASCII, ComfyNode<WASTextFindAndReplace_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextFindAndReplace_input = {
    text: ASCII | HasSingle_ASCII
    find: STRING
    replace: STRING
}

// |=============================================================================|
// | WASTextFindAndReplaceInput                                                  |
// |=============================================================================|
export interface WASTextFindAndReplaceInput extends HasSingle_ASCII, ComfyNode<WASTextFindAndReplaceInput_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextFindAndReplaceInput_input = {
    text: ASCII | HasSingle_ASCII
    find: ASCII | HasSingle_ASCII
    replace: ASCII | HasSingle_ASCII
}

// |=============================================================================|
// | WASTextParseNoodleSoupPrompts                                               |
// |=============================================================================|
export interface WASTextParseNoodleSoupPrompts extends HasSingle_ASCII, ComfyNode<WASTextParseNoodleSoupPrompts_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextParseNoodleSoupPrompts_input = {
    noodle_key: STRING
    seed: INT
    text: ASCII | HasSingle_ASCII
}

// |=============================================================================|
// | WASSaveTextFile                                                             |
// |=============================================================================|
export interface WASSaveTextFile extends ComfyNode<WASSaveTextFile_input> {}
export type WASSaveTextFile_input = {
    text: ASCII | HasSingle_ASCII
    path: STRING
    filename: STRING
}

// |=============================================================================|
// | WASLoadTextFile                                                             |
// |=============================================================================|
export interface WASLoadTextFile extends HasSingle_ASCII, ComfyNode<WASLoadTextFile_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASLoadTextFile_input = {
    file_path: STRING
}

// |=============================================================================|
// | WASTextToConsole                                                            |
// |=============================================================================|
export interface WASTextToConsole extends HasSingle_ASCII, ComfyNode<WASTextToConsole_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextToConsole_input = {
    text: ASCII | HasSingle_ASCII
    label: STRING
}

// |=============================================================================|
// | UpscaleModelLoader                                                          |
// |=============================================================================|
export interface UpscaleModelLoader extends HasSingle_UPSCALE_MODEL, ComfyNode<UpscaleModelLoader_input> {
    UPSCALE_MODEL: Slot<'UPSCALE_MODEL', 0>
}
export type UpscaleModelLoader_input = {
    model_name: Enum_UpscaleModelLoader_model_name | HasSingle_Enum_UpscaleModelLoader_model_name
}

// |=============================================================================|
// | ImageUpscaleWithModel                                                       |
// |=============================================================================|
export interface ImageUpscaleWithModel extends HasSingle_IMAGE, ComfyNode<ImageUpscaleWithModel_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageUpscaleWithModel_input = {
    upscale_model: UPSCALE_MODEL | HasSingle_UPSCALE_MODEL
    image: IMAGE | HasSingle_IMAGE
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
    PreviewImage: ComfyNodeSchemaJSON
    LoadImage: ComfyNodeSchemaJSON
    LoadImageMask: ComfyNodeSchemaJSON
    ImageScale: ComfyNodeSchemaJSON
    ImageInvert: ComfyNodeSchemaJSON
    ImagePadForOutpaint: ComfyNodeSchemaJSON
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
    StyleModelLoader: ComfyNodeSchemaJSON
    CLIPVisionLoader: ComfyNodeSchemaJSON
    VAEDecodeTiled: ComfyNodeSchemaJSON
    VAEEncodeTiled: ComfyNodeSchemaJSON
    TomePatchModel: ComfyNodeSchemaJSON
    WASImageFilterAdjustments: ComfyNodeSchemaJSON
    WASImageStyleFilter: ComfyNodeSchemaJSON
    WASImageBlendingMode: ComfyNodeSchemaJSON
    WASImageBlend: ComfyNodeSchemaJSON
    WASImageBlendByMask: ComfyNodeSchemaJSON
    WASImageRemoveColor: ComfyNodeSchemaJSON
    WASImageThreshold: ComfyNodeSchemaJSON
    WASImageChromaticAberration: ComfyNodeSchemaJSON
    WASImageBloomFilter: ComfyNodeSchemaJSON
    WASImageBlank: ComfyNodeSchemaJSON
    WASImageFilmGrain: ComfyNodeSchemaJSON
    WASImageFlip: ComfyNodeSchemaJSON
    WASImageRotate: ComfyNodeSchemaJSON
    WASImageNovaFilter: ComfyNodeSchemaJSON
    WASImageCannyFilter: ComfyNodeSchemaJSON
    WASImageEdgeDetectionFilter: ComfyNodeSchemaJSON
    WASImageFDOFFilter: ComfyNodeSchemaJSON
    WASImageMedianFilter: ComfyNodeSchemaJSON
    WASImageSave: ComfyNodeSchemaJSON
    WASImageLoad: ComfyNodeSchemaJSON
    WASImageLevelsAdjustment: ComfyNodeSchemaJSON
    WASImageHighPassFilter: ComfyNodeSchemaJSON
    WASTensorBatchToImage: ComfyNodeSchemaJSON
    WASImageSelectColor: ComfyNodeSchemaJSON
    WASImageSelectChannel: ComfyNodeSchemaJSON
    WASImageMixRGBChannels: ComfyNodeSchemaJSON
    WASLatentUpscaleByFactorWAS: ComfyNodeSchemaJSON
    WASLatentNoiseInjection: ComfyNodeSchemaJSON
    WASImageToLatentMask: ComfyNodeSchemaJSON
    WASMiDaSDepthApproximation: ComfyNodeSchemaJSON
    WASMiDaSMaskImage: ComfyNodeSchemaJSON
    WASCLIPTextEncodeNSP: ComfyNodeSchemaJSON
    WASKSamplerWAS: ComfyNodeSchemaJSON
    WASSeed: ComfyNodeSchemaJSON
    WASTextMultiline: ComfyNodeSchemaJSON
    WASTextString: ComfyNodeSchemaJSON
    WASTextRandomLine: ComfyNodeSchemaJSON
    WASTextToConditioning: ComfyNodeSchemaJSON
    WASTextConcatenate: ComfyNodeSchemaJSON
    WASTextFindAndReplace: ComfyNodeSchemaJSON
    WASTextFindAndReplaceInput: ComfyNodeSchemaJSON
    WASTextParseNoodleSoupPrompts: ComfyNodeSchemaJSON
    WASSaveTextFile: ComfyNodeSchemaJSON
    WASLoadTextFile: ComfyNodeSchemaJSON
    WASTextToConsole: ComfyNodeSchemaJSON
    UpscaleModelLoader: ComfyNodeSchemaJSON
    ImageUpscaleWithModel: ComfyNodeSchemaJSON
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
    PreviewImage(args: PreviewImage_input, uid?: ComfyNodeUID): PreviewImage
    LoadImage(args: LoadImage_input, uid?: ComfyNodeUID): LoadImage
    LoadImageMask(args: LoadImageMask_input, uid?: ComfyNodeUID): LoadImageMask
    ImageScale(args: ImageScale_input, uid?: ComfyNodeUID): ImageScale
    ImageInvert(args: ImageInvert_input, uid?: ComfyNodeUID): ImageInvert
    ImagePadForOutpaint(args: ImagePadForOutpaint_input, uid?: ComfyNodeUID): ImagePadForOutpaint
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
    StyleModelLoader(args: StyleModelLoader_input, uid?: ComfyNodeUID): StyleModelLoader
    CLIPVisionLoader(args: CLIPVisionLoader_input, uid?: ComfyNodeUID): CLIPVisionLoader
    VAEDecodeTiled(args: VAEDecodeTiled_input, uid?: ComfyNodeUID): VAEDecodeTiled
    VAEEncodeTiled(args: VAEEncodeTiled_input, uid?: ComfyNodeUID): VAEEncodeTiled
    TomePatchModel(args: TomePatchModel_input, uid?: ComfyNodeUID): TomePatchModel
    WASImageFilterAdjustments(args: WASImageFilterAdjustments_input, uid?: ComfyNodeUID): WASImageFilterAdjustments
    WASImageStyleFilter(args: WASImageStyleFilter_input, uid?: ComfyNodeUID): WASImageStyleFilter
    WASImageBlendingMode(args: WASImageBlendingMode_input, uid?: ComfyNodeUID): WASImageBlendingMode
    WASImageBlend(args: WASImageBlend_input, uid?: ComfyNodeUID): WASImageBlend
    WASImageBlendByMask(args: WASImageBlendByMask_input, uid?: ComfyNodeUID): WASImageBlendByMask
    WASImageRemoveColor(args: WASImageRemoveColor_input, uid?: ComfyNodeUID): WASImageRemoveColor
    WASImageThreshold(args: WASImageThreshold_input, uid?: ComfyNodeUID): WASImageThreshold
    WASImageChromaticAberration(args: WASImageChromaticAberration_input, uid?: ComfyNodeUID): WASImageChromaticAberration
    WASImageBloomFilter(args: WASImageBloomFilter_input, uid?: ComfyNodeUID): WASImageBloomFilter
    WASImageBlank(args: WASImageBlank_input, uid?: ComfyNodeUID): WASImageBlank
    WASImageFilmGrain(args: WASImageFilmGrain_input, uid?: ComfyNodeUID): WASImageFilmGrain
    WASImageFlip(args: WASImageFlip_input, uid?: ComfyNodeUID): WASImageFlip
    WASImageRotate(args: WASImageRotate_input, uid?: ComfyNodeUID): WASImageRotate
    WASImageNovaFilter(args: WASImageNovaFilter_input, uid?: ComfyNodeUID): WASImageNovaFilter
    WASImageCannyFilter(args: WASImageCannyFilter_input, uid?: ComfyNodeUID): WASImageCannyFilter
    WASImageEdgeDetectionFilter(args: WASImageEdgeDetectionFilter_input, uid?: ComfyNodeUID): WASImageEdgeDetectionFilter
    WASImageFDOFFilter(args: WASImageFDOFFilter_input, uid?: ComfyNodeUID): WASImageFDOFFilter
    WASImageMedianFilter(args: WASImageMedianFilter_input, uid?: ComfyNodeUID): WASImageMedianFilter
    WASImageSave(args: WASImageSave_input, uid?: ComfyNodeUID): WASImageSave
    WASImageLoad(args: WASImageLoad_input, uid?: ComfyNodeUID): WASImageLoad
    WASImageLevelsAdjustment(args: WASImageLevelsAdjustment_input, uid?: ComfyNodeUID): WASImageLevelsAdjustment
    WASImageHighPassFilter(args: WASImageHighPassFilter_input, uid?: ComfyNodeUID): WASImageHighPassFilter
    WASTensorBatchToImage(args: WASTensorBatchToImage_input, uid?: ComfyNodeUID): WASTensorBatchToImage
    WASImageSelectColor(args: WASImageSelectColor_input, uid?: ComfyNodeUID): WASImageSelectColor
    WASImageSelectChannel(args: WASImageSelectChannel_input, uid?: ComfyNodeUID): WASImageSelectChannel
    WASImageMixRGBChannels(args: WASImageMixRGBChannels_input, uid?: ComfyNodeUID): WASImageMixRGBChannels
    WASLatentUpscaleByFactorWAS(args: WASLatentUpscaleByFactorWAS_input, uid?: ComfyNodeUID): WASLatentUpscaleByFactorWAS
    WASLatentNoiseInjection(args: WASLatentNoiseInjection_input, uid?: ComfyNodeUID): WASLatentNoiseInjection
    WASImageToLatentMask(args: WASImageToLatentMask_input, uid?: ComfyNodeUID): WASImageToLatentMask
    WASMiDaSDepthApproximation(args: WASMiDaSDepthApproximation_input, uid?: ComfyNodeUID): WASMiDaSDepthApproximation
    WASMiDaSMaskImage(args: WASMiDaSMaskImage_input, uid?: ComfyNodeUID): WASMiDaSMaskImage
    WASCLIPTextEncodeNSP(args: WASCLIPTextEncodeNSP_input, uid?: ComfyNodeUID): WASCLIPTextEncodeNSP
    WASKSamplerWAS(args: WASKSamplerWAS_input, uid?: ComfyNodeUID): WASKSamplerWAS
    WASSeed(args: WASSeed_input, uid?: ComfyNodeUID): WASSeed
    WASTextMultiline(args: WASTextMultiline_input, uid?: ComfyNodeUID): WASTextMultiline
    WASTextString(args: WASTextString_input, uid?: ComfyNodeUID): WASTextString
    WASTextRandomLine(args: WASTextRandomLine_input, uid?: ComfyNodeUID): WASTextRandomLine
    WASTextToConditioning(args: WASTextToConditioning_input, uid?: ComfyNodeUID): WASTextToConditioning
    WASTextConcatenate(args: WASTextConcatenate_input, uid?: ComfyNodeUID): WASTextConcatenate
    WASTextFindAndReplace(args: WASTextFindAndReplace_input, uid?: ComfyNodeUID): WASTextFindAndReplace
    WASTextFindAndReplaceInput(args: WASTextFindAndReplaceInput_input, uid?: ComfyNodeUID): WASTextFindAndReplaceInput
    WASTextParseNoodleSoupPrompts(args: WASTextParseNoodleSoupPrompts_input, uid?: ComfyNodeUID): WASTextParseNoodleSoupPrompts
    WASSaveTextFile(args: WASSaveTextFile_input, uid?: ComfyNodeUID): WASSaveTextFile
    WASLoadTextFile(args: WASLoadTextFile_input, uid?: ComfyNodeUID): WASLoadTextFile
    WASTextToConsole(args: WASTextToConsole_input, uid?: ComfyNodeUID): WASTextToConsole
    UpscaleModelLoader(args: UpscaleModelLoader_input, uid?: ComfyNodeUID): UpscaleModelLoader
    ImageUpscaleWithModel(args: ImageUpscaleWithModel_input, uid?: ComfyNodeUID): ImageUpscaleWithModel
}
declare global {
    export const WORKFLOW: (
        //
        title: string,
        builder: (
            //
            graph: ComfySetup & Graph,
            flow: FlowExecution,
        ) => void,
    ) => Workflow
}
