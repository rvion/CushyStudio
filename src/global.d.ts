declare module 'x/y' {
    export class Z {
        a: 1
    }
}

declare const zzz: import('x/y').Z

import type { ComfyNodeOutput } from './core/ComfyNodeOutput'
import type { ComfyNodeUID } from './core/ComfyNodeUID'
import type { ComfyNode } from './core/CSNode'
import type { ComfyNodeSchemaJSON } from './core/ComfySchemaJSON'
import type { ComfyGraph } from './core/ComfyGraph'
import type { Workflow } from './core/Workflow'

// TYPES -------------------------------
export type CLIP_VISION_OUTPUT = ComfyNodeOutput<'CLIP_VISION_OUTPUT'>
export type UPSCALE_MODEL = ComfyNodeOutput<'UPSCALE_MODEL'>
export type CONDITIONING = ComfyNodeOutput<'CONDITIONING'>
export type CLIP_VISION = ComfyNodeOutput<'CLIP_VISION'>
export type STYLE_MODEL = ComfyNodeOutput<'STYLE_MODEL'>
export type CONTROL_NET = ComfyNodeOutput<'CONTROL_NET'>
export type LATENT = ComfyNodeOutput<'LATENT'>
export type MODEL = ComfyNodeOutput<'MODEL'>
export type IMAGE = ComfyNodeOutput<'IMAGE'>
export type ASCII = ComfyNodeOutput<'ASCII'>
export type CLIP = ComfyNodeOutput<'CLIP'>
export type MASK = ComfyNodeOutput<'MASK'>
export type SEED = ComfyNodeOutput<'SEED'>
export type VAE = ComfyNodeOutput<'VAE'>
export type INT = number
export type FLOAT = number
export type STRING = string

// ENUMS -------------------------------
export type Enum_KSampler_sampler_name = 'ddim' | 'dpm_2' | 'dpm_2_ancestral' | 'dpm_adaptive' | 'dpm_fast' | 'dpmpp_2m' | 'dpmpp_2s_ancestral' | 'dpmpp_sde' | 'euler' | 'euler_ancestral' | 'heun' | 'lms' | 'uni_pc' | 'uni_pc_bh2'
export type Enum_KSampler_scheduler = 'ddim_uniform' | 'karras' | 'normal' | 'simple'
export type Enum_CheckpointLoader_config_name = 'anything_v3.yaml' | 'v1-inference.yaml' | 'v1-inference_clip_skip_2.yaml' | 'v1-inference_clip_skip_2_fp16.yaml' | 'v1-inference_fp16.yaml' | 'v1-inpainting-inference.yaml' | 'v2-inference-v.yaml' | 'v2-inference-v_fp32.yaml' | 'v2-inference.yaml' | 'v2-inference_fp32.yaml' | 'v2-inpainting-inference.yaml'
export type Enum_CheckpointLoader_ckpt_name = 'AOM3A1_orangemixs.safetensors' | 'AOM3A3_orangemixs.safetensors' | 'AbyssOrangeMix2_hard.safetensors' | 'anything-v3-fp16-pruned.safetensors' | 'v1-5-pruned-emaonly.ckpt' | 'v2-1_512-ema-pruned.safetensors' | 'v2-1_768-ema-pruned.safetensors' | 'wd-1-5-beta2-fp16.safetensors'
export type Enum_VAELoader_vae_name = 'kl-f8-anime2.ckpt' | 'orangemix.vae.pt' | 'vae-ft-mse-840000-ema-pruned.safetensors'
export type Enum_LatentUpscale_upscale_method = 'area' | 'bilinear' | 'nearest-exact'
export type Enum_LatentUpscale_crop = 'center' | 'disabled'
export type Enum_LoadImage_image = '2023-03-19_22-20-04.png' | 'ComfyUI_00498_.png' | 'ComfyUI_01790_.png' | 'Screenshot 2022-01-27 at 18.08.02.png' | 'Screenshot 2022-02-22 at 10.25.32.png' | 'decihub-logo-126.png' | 'esrgan_example (1).png' | 'esrgan_example.png' | 'example.png' | 'image-2023-03-23.png' | 'image.jpg' | 'img2img (1) (1).png' | 'img2img (1).png' | 'maxresdefault.jpeg' | 'project123image-2023-03-23 (1).png' | 'project123image-2023-03-23.png' | 'upload (1).png' | 'upload (10).png' | 'upload (100).png' | 'upload (101).png' | 'upload (102).png' | 'upload (103).png' | 'upload (104).png' | 'upload (105).png' | 'upload (106).png' | 'upload (107).png' | 'upload (108).png' | 'upload (109).png' | 'upload (11).png' | 'upload (110).png' | 'upload (111).png' | 'upload (112).png' | 'upload (113).png' | 'upload (114).png' | 'upload (115).png' | 'upload (116).png' | 'upload (117).png' | 'upload (118).png' | 'upload (119).png' | 'upload (12).png' | 'upload (120).png' | 'upload (121).png' | 'upload (122).png' | 'upload (123).png' | 'upload (124).png' | 'upload (125).png' | 'upload (126).png' | 'upload (127).png' | 'upload (128).png' | 'upload (129).png' | 'upload (13).png' | 'upload (130).png' | 'upload (131).png' | 'upload (132).png' | 'upload (133).png' | 'upload (134).png' | 'upload (135).png' | 'upload (136).png' | 'upload (137).png' | 'upload (138).png' | 'upload (139).png' | 'upload (14).png' | 'upload (140).png' | 'upload (141).png' | 'upload (142).png' | 'upload (143).png' | 'upload (144).png' | 'upload (145).png' | 'upload (146).png' | 'upload (147).png' | 'upload (148).png' | 'upload (149).png' | 'upload (15).png' | 'upload (150).png' | 'upload (151).png' | 'upload (152).png' | 'upload (153).png' | 'upload (154).png' | 'upload (155).png' | 'upload (156).png' | 'upload (157).png' | 'upload (158).png' | 'upload (159).png' | 'upload (16).png' | 'upload (160).png' | 'upload (161).png' | 'upload (162).png' | 'upload (163).png' | 'upload (164).png' | 'upload (165).png' | 'upload (166).png' | 'upload (167).png' | 'upload (168).png' | 'upload (169).png' | 'upload (17).png' | 'upload (170).png' | 'upload (171).png' | 'upload (172).png' | 'upload (173).png' | 'upload (174).png' | 'upload (175).png' | 'upload (176).png' | 'upload (177).png' | 'upload (178).png' | 'upload (179).png' | 'upload (18).png' | 'upload (180).png' | 'upload (181).png' | 'upload (182).png' | 'upload (183).png' | 'upload (184).png' | 'upload (185).png' | 'upload (186).png' | 'upload (187).png' | 'upload (188).png' | 'upload (189).png' | 'upload (19).png' | 'upload (190).png' | 'upload (191).png' | 'upload (192).png' | 'upload (193).png' | 'upload (194).png' | 'upload (195).png' | 'upload (196).png' | 'upload (197).png' | 'upload (198).png' | 'upload (199).png' | 'upload (2).png' | 'upload (20).png' | 'upload (200).png' | 'upload (201).png' | 'upload (202).png' | 'upload (203).png' | 'upload (204).png' | 'upload (205).png' | 'upload (206).png' | 'upload (207).png' | 'upload (208).png' | 'upload (209).png' | 'upload (21).png' | 'upload (210).png' | 'upload (211).png' | 'upload (212).png' | 'upload (213).png' | 'upload (214).png' | 'upload (215).png' | 'upload (216).png' | 'upload (217).png' | 'upload (218).png' | 'upload (219).png' | 'upload (22).png' | 'upload (220).png' | 'upload (221).png' | 'upload (222).png' | 'upload (223).png' | 'upload (224).png' | 'upload (225).png' | 'upload (226).png' | 'upload (227).png' | 'upload (228).png' | 'upload (229).png' | 'upload (23).png' | 'upload (230).png' | 'upload (231).png' | 'upload (232).png' | 'upload (233).png' | 'upload (234).png' | 'upload (235).png' | 'upload (236).png' | 'upload (237).png' | 'upload (238).png' | 'upload (239).png' | 'upload (24).png' | 'upload (240).png' | 'upload (241).png' | 'upload (242).png' | 'upload (243).png' | 'upload (244).png' | 'upload (245).png' | 'upload (246).png' | 'upload (247).png' | 'upload (248).png' | 'upload (249).png' | 'upload (25).png' | 'upload (250).png' | 'upload (251).png' | 'upload (252).png' | 'upload (253).png' | 'upload (254).png' | 'upload (255).png' | 'upload (256).png' | 'upload (257).png' | 'upload (258).png' | 'upload (259).png' | 'upload (26).png' | 'upload (260).png' | 'upload (261).png' | 'upload (262).png' | 'upload (263).png' | 'upload (264).png' | 'upload (265).png' | 'upload (266).png' | 'upload (267).png' | 'upload (268).png' | 'upload (269).png' | 'upload (27).png' | 'upload (270).png' | 'upload (271).png' | 'upload (272).png' | 'upload (273).png' | 'upload (274).png' | 'upload (275).png' | 'upload (276).png' | 'upload (277).png' | 'upload (278).png' | 'upload (279).png' | 'upload (28).png' | 'upload (280).png' | 'upload (281).png' | 'upload (282).png' | 'upload (283).png' | 'upload (284).png' | 'upload (285).png' | 'upload (286).png' | 'upload (287).png' | 'upload (288).png' | 'upload (289).png' | 'upload (29).png' | 'upload (290).png' | 'upload (291).png' | 'upload (292).png' | 'upload (293).png' | 'upload (294).png' | 'upload (295).png' | 'upload (296).png' | 'upload (297).png' | 'upload (298).png' | 'upload (299).png' | 'upload (3).png' | 'upload (30).png' | 'upload (300).png' | 'upload (301).png' | 'upload (302).png' | 'upload (303).png' | 'upload (304).png' | 'upload (305).png' | 'upload (306).png' | 'upload (307).png' | 'upload (308).png' | 'upload (309).png' | 'upload (31).png' | 'upload (310).png' | 'upload (311).png' | 'upload (312).png' | 'upload (313).png' | 'upload (314).png' | 'upload (315).png' | 'upload (316).png' | 'upload (317).png' | 'upload (318).png' | 'upload (319).png' | 'upload (32).png' | 'upload (320).png' | 'upload (321).png' | 'upload (322).png' | 'upload (323).png' | 'upload (324).png' | 'upload (325).png' | 'upload (326).png' | 'upload (327).png' | 'upload (328).png' | 'upload (329).png' | 'upload (33).png' | 'upload (330).png' | 'upload (331).png' | 'upload (332).png' | 'upload (333).png' | 'upload (334).png' | 'upload (335).png' | 'upload (336).png' | 'upload (337).png' | 'upload (338).png' | 'upload (339).png' | 'upload (34).png' | 'upload (340).png' | 'upload (341).png' | 'upload (342).png' | 'upload (343).png' | 'upload (344).png' | 'upload (345).png' | 'upload (346).png' | 'upload (347).png' | 'upload (348).png' | 'upload (349).png' | 'upload (35).png' | 'upload (350).png' | 'upload (351).png' | 'upload (352).png' | 'upload (353).png' | 'upload (354).png' | 'upload (355).png' | 'upload (356).png' | 'upload (357).png' | 'upload (358).png' | 'upload (359).png' | 'upload (36).png' | 'upload (360).png' | 'upload (361).png' | 'upload (362).png' | 'upload (363).png' | 'upload (364).png' | 'upload (365).png' | 'upload (366).png' | 'upload (367).png' | 'upload (368).png' | 'upload (369).png' | 'upload (37).png' | 'upload (370).png' | 'upload (371).png' | 'upload (372).png' | 'upload (373).png' | 'upload (374).png' | 'upload (375).png' | 'upload (376).png' | 'upload (377).png' | 'upload (378).png' | 'upload (379).png' | 'upload (38).png' | 'upload (380).png' | 'upload (381).png' | 'upload (382).png' | 'upload (383).png' | 'upload (384).png' | 'upload (385).png' | 'upload (386).png' | 'upload (387).png' | 'upload (388).png' | 'upload (389).png' | 'upload (39).png' | 'upload (390).png' | 'upload (391).png' | 'upload (392).png' | 'upload (393).png' | 'upload (394).png' | 'upload (395).png' | 'upload (396).png' | 'upload (397).png' | 'upload (398).png' | 'upload (399).png' | 'upload (4).png' | 'upload (40).png' | 'upload (400).png' | 'upload (401).png' | 'upload (402).png' | 'upload (403).png' | 'upload (404).png' | 'upload (405).png' | 'upload (406).png' | 'upload (407).png' | 'upload (408).png' | 'upload (409).png' | 'upload (41).png' | 'upload (410).png' | 'upload (411).png' | 'upload (412).png' | 'upload (413).png' | 'upload (414).png' | 'upload (415).png' | 'upload (416).png' | 'upload (417).png' | 'upload (418).png' | 'upload (42).png' | 'upload (43).png' | 'upload (44).png' | 'upload (45).png' | 'upload (46).png' | 'upload (47).png' | 'upload (48).png' | 'upload (49).png' | 'upload (5).png' | 'upload (50).png' | 'upload (51).png' | 'upload (52).png' | 'upload (53).png' | 'upload (54).png' | 'upload (55).png' | 'upload (56).png' | 'upload (57).png' | 'upload (58).png' | 'upload (59).png' | 'upload (6).png' | 'upload (60).png' | 'upload (61).png' | 'upload (62).png' | 'upload (63).png' | 'upload (64).png' | 'upload (65).png' | 'upload (66).png' | 'upload (67).png' | 'upload (68).png' | 'upload (69).png' | 'upload (7).png' | 'upload (70).png' | 'upload (71).png' | 'upload (72).png' | 'upload (73).png' | 'upload (74).png' | 'upload (75).png' | 'upload (76).png' | 'upload (77).png' | 'upload (78).png' | 'upload (79).png' | 'upload (8).png' | 'upload (80).png' | 'upload (81).png' | 'upload (82).png' | 'upload (83).png' | 'upload (84).png' | 'upload (85).png' | 'upload (86).png' | 'upload (87).png' | 'upload (88).png' | 'upload (89).png' | 'upload (9).png' | 'upload (90).png' | 'upload (91).png' | 'upload (92).png' | 'upload (93).png' | 'upload (94).png' | 'upload (95).png' | 'upload (96).png' | 'upload (97).png' | 'upload (98).png' | 'upload (99).png' | 'upload.png'
export type Enum_LoadImageMask_channel = 'alpha' | 'blue' | 'green' | 'red'
export type Enum_KSamplerAdvanced_add_noise = 'disable' | 'enable'
export type Enum_LatentRotate_rotation = '180 degrees' | '270 degrees' | '90 degrees' | 'none'
export type Enum_LatentFlip_flip_method = 'x-axis: vertically' | 'y-axis: horizontally'
export type Enum_LoraLoader_lora_name = 'theovercomer8sContrastFix_sd15.safetensors' | 'theovercomer8sContrastFix_sd21768.safetensors'
export type Enum_CLIPLoader_clip_name = never
export type Enum_ControlNetLoader_control_net_name = 'control_depth-fp16.safetensors' | 'control_openpose-fp16.safetensors' | 'control_scribble-fp16.safetensors' | 't2iadapter_canny_sd14v1.pth' | 't2iadapter_color_sd14v1.pth' | 't2iadapter_depth_sd14v1.pth' | 't2iadapter_keypose_sd14v1.pth' | 't2iadapter_openpose_sd14v1.pth' | 't2iadapter_seg_sd14v1.pth' | 't2iadapter_sketch_sd14v1.pth'
export type Enum_StyleModelLoader_style_model_name = 't2iadapter_style_sd14v1.pth'
export type Enum_CLIPVisionLoader_clip_name = 'clip_vit14.bin'
export type Enum_ImageStyleFilter_style = '1977' | 'aden' | 'brannan' | 'brooklyn' | 'clarendon' | 'earlybird' | 'gingham' | 'hudson' | 'inkwell' | 'kelvin' | 'lark' | 'lofi' | 'maven' | 'mayfair' | 'moon' | 'nashville' | 'perpetua' | 'reyes' | 'rise' | 'slumber' | 'stinson' | 'toaster' | 'valencia' | 'walden' | 'willow' | 'xpro2'
export type Enum_ImageBlendingMode_mode = 'add' | 'color' | 'color_burn' | 'color_dodge' | 'darken' | 'difference' | 'exclusion' | 'hard_light' | 'hue' | 'lighten' | 'multiply' | 'overlay' | 'screen' | 'soft_light'
export type Enum_ImageFlip_mode = 'horizontal' | 'vertical'
export type Enum_ImageRotate_mode = 'internal' | 'transpose'
export type Enum_ImageRotate_sampler = 'bicubic' | 'bilinear' | 'nearest'
export type Enum_ImageCannyFilter_enable_threshold = 'false' | 'true'
export type Enum_ImageEdgeDetectionFilter_mode = 'laplacian' | 'normal'
export type Enum_ImageFDOFFilter_mode = 'box' | 'gaussian' | 'mock'
export type Enum_ImageSave_extension = 'gif' | 'jpeg' | 'png' | 'tiff'
export type Enum_ImageSelectChannel_channel = 'blue' | 'green' | 'red'
export type Enum_LatentUpscaleByFactorWAS_mode = 'bicubic' | 'bilinear'
export type Enum_MiDaSDepthApproximation_midas_model = 'DPT_Hybrid' | 'DPT_Large' | 'DPT_Small'
export type Enum_MiDaSMaskImage_remove = 'background' | 'foregroud'
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
export interface HasSingle_Enum_ImageStyleFilter_style { _Enum_ImageStyleFilter_style: Enum_ImageStyleFilter_style } // prettier-ignore
export interface HasSingle_Enum_ImageBlendingMode_mode { _Enum_ImageBlendingMode_mode: Enum_ImageBlendingMode_mode } // prettier-ignore
export interface HasSingle_Enum_ImageFlip_mode { _Enum_ImageFlip_mode: Enum_ImageFlip_mode } // prettier-ignore
export interface HasSingle_Enum_ImageRotate_mode { _Enum_ImageRotate_mode: Enum_ImageRotate_mode } // prettier-ignore
export interface HasSingle_Enum_ImageRotate_sampler { _Enum_ImageRotate_sampler: Enum_ImageRotate_sampler } // prettier-ignore
export interface HasSingle_Enum_ImageCannyFilter_enable_threshold { _Enum_ImageCannyFilter_enable_threshold: Enum_ImageCannyFilter_enable_threshold } // prettier-ignore
export interface HasSingle_Enum_ImageEdgeDetectionFilter_mode { _Enum_ImageEdgeDetectionFilter_mode: Enum_ImageEdgeDetectionFilter_mode } // prettier-ignore
export interface HasSingle_Enum_ImageFDOFFilter_mode { _Enum_ImageFDOFFilter_mode: Enum_ImageFDOFFilter_mode } // prettier-ignore
export interface HasSingle_Enum_ImageSave_extension { _Enum_ImageSave_extension: Enum_ImageSave_extension } // prettier-ignore
export interface HasSingle_Enum_ImageSelectChannel_channel { _Enum_ImageSelectChannel_channel: Enum_ImageSelectChannel_channel } // prettier-ignore
export interface HasSingle_Enum_LatentUpscaleByFactorWAS_mode { _Enum_LatentUpscaleByFactorWAS_mode: Enum_LatentUpscaleByFactorWAS_mode } // prettier-ignore
export interface HasSingle_Enum_MiDaSDepthApproximation_midas_model { _Enum_MiDaSDepthApproximation_midas_model: Enum_MiDaSDepthApproximation_midas_model } // prettier-ignore
export interface HasSingle_Enum_MiDaSMaskImage_remove { _Enum_MiDaSMaskImage_remove: Enum_MiDaSMaskImage_remove } // prettier-ignore
export interface HasSingle_Enum_UpscaleModelLoader_model_name { _Enum_UpscaleModelLoader_model_name: Enum_UpscaleModelLoader_model_name } // prettier-ignore

// NODES -------------------------------
// |=============================================================================|
// | KSampler                                                                    |
// |=============================================================================|
export interface KSampler extends HasSingle_LATENT, ComfyNode<KSampler_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>,
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
    MODEL: ComfyNodeOutput<'MODEL', 0>,
    CLIP: ComfyNodeOutput<'CLIP', 1>,
    VAE: ComfyNodeOutput<'VAE', 2>,
}
export type CheckpointLoader_input = {
    config_name: Enum_CheckpointLoader_config_name | HasSingle_Enum_CheckpointLoader_config_name
    ckpt_name: Enum_CheckpointLoader_ckpt_name | HasSingle_Enum_CheckpointLoader_ckpt_name
}

// |=============================================================================|
// | CheckpointLoaderSimple                                                      |
// |=============================================================================|
export interface CheckpointLoaderSimple extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<CheckpointLoaderSimple_input> {
    MODEL: ComfyNodeOutput<'MODEL', 0>,
    CLIP: ComfyNodeOutput<'CLIP', 1>,
    VAE: ComfyNodeOutput<'VAE', 2>,
}
export type CheckpointLoaderSimple_input = {
    ckpt_name: Enum_CheckpointLoader_ckpt_name | HasSingle_Enum_CheckpointLoader_ckpt_name
}

// |=============================================================================|
// | CLIPTextEncode                                                              |
// |=============================================================================|
export interface CLIPTextEncode extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncode_input> {
    CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
}
export type CLIPTextEncode_input = {
    text: STRING
    clip: CLIP | HasSingle_CLIP
}

// |=============================================================================|
// | CLIPSetLastLayer                                                            |
// |=============================================================================|
export interface CLIPSetLastLayer extends HasSingle_CLIP, ComfyNode<CLIPSetLastLayer_input> {
    CLIP: ComfyNodeOutput<'CLIP', 0>,
}
export type CLIPSetLastLayer_input = {
    clip: CLIP | HasSingle_CLIP
    stop_at_clip_layer: INT
}

// |=============================================================================|
// | VAEDecode                                                                   |
// |=============================================================================|
export interface VAEDecode extends HasSingle_IMAGE, ComfyNode<VAEDecode_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type VAEDecode_input = {
    samples: LATENT | HasSingle_LATENT
    vae: VAE | HasSingle_VAE
}

// |=============================================================================|
// | VAEEncode                                                                   |
// |=============================================================================|
export interface VAEEncode extends HasSingle_LATENT, ComfyNode<VAEEncode_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>,
}
export type VAEEncode_input = {
    pixels: IMAGE | HasSingle_IMAGE
    vae: VAE | HasSingle_VAE
}

// |=============================================================================|
// | VAEEncodeForInpaint                                                         |
// |=============================================================================|
export interface VAEEncodeForInpaint extends HasSingle_LATENT, ComfyNode<VAEEncodeForInpaint_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>,
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
    VAE: ComfyNodeOutput<'VAE', 0>,
}
export type VAELoader_input = {
    vae_name: Enum_VAELoader_vae_name | HasSingle_Enum_VAELoader_vae_name
}

// |=============================================================================|
// | EmptyLatentImage                                                            |
// |=============================================================================|
export interface EmptyLatentImage extends HasSingle_LATENT, ComfyNode<EmptyLatentImage_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>,
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
    LATENT: ComfyNodeOutput<'LATENT', 0>,
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
export interface SaveImage extends ComfyNode<SaveImage_input> {
}
export type SaveImage_input = {
    images: IMAGE | HasSingle_IMAGE
    filename_prefix: STRING
}

// |=============================================================================|
// | PreviewImage                                                                |
// |=============================================================================|
export interface PreviewImage extends ComfyNode<PreviewImage_input> {
}
export type PreviewImage_input = {
    images: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | LoadImage                                                                   |
// |=============================================================================|
export interface LoadImage extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<LoadImage_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
    MASK: ComfyNodeOutput<'MASK', 1>,
}
export type LoadImage_input = {
    image: Enum_LoadImage_image | HasSingle_Enum_LoadImage_image
}

// |=============================================================================|
// | LoadImageMask                                                               |
// |=============================================================================|
export interface LoadImageMask extends HasSingle_MASK, ComfyNode<LoadImageMask_input> {
    MASK: ComfyNodeOutput<'MASK', 0>,
}
export type LoadImageMask_input = {
    image: Enum_LoadImage_image | HasSingle_Enum_LoadImage_image
    channel: Enum_LoadImageMask_channel | HasSingle_Enum_LoadImageMask_channel
}

// |=============================================================================|
// | ImageScale                                                                  |
// |=============================================================================|
export interface ImageScale extends HasSingle_IMAGE, ComfyNode<ImageScale_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
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
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageInvert_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | ImagePadForOutpaint                                                         |
// |=============================================================================|
export interface ImagePadForOutpaint extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImagePadForOutpaint_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
    MASK: ComfyNodeOutput<'MASK', 1>,
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
    CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
}
export type ConditioningCombine_input = {
    conditioning_1: CONDITIONING | HasSingle_CONDITIONING
    conditioning_2: CONDITIONING | HasSingle_CONDITIONING
}

// |=============================================================================|
// | ConditioningSetArea                                                         |
// |=============================================================================|
export interface ConditioningSetArea extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetArea_input> {
    CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
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
    LATENT: ComfyNodeOutput<'LATENT', 0>,
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
    LATENT: ComfyNodeOutput<'LATENT', 0>,
}
export type SetLatentNoiseMask_input = {
    samples: LATENT | HasSingle_LATENT
    mask: MASK | HasSingle_MASK
}

// |=============================================================================|
// | LatentComposite                                                             |
// |=============================================================================|
export interface LatentComposite extends HasSingle_LATENT, ComfyNode<LatentComposite_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>,
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
    LATENT: ComfyNodeOutput<'LATENT', 0>,
}
export type LatentRotate_input = {
    samples: LATENT | HasSingle_LATENT
    rotation: Enum_LatentRotate_rotation | HasSingle_Enum_LatentRotate_rotation
}

// |=============================================================================|
// | LatentFlip                                                                  |
// |=============================================================================|
export interface LatentFlip extends HasSingle_LATENT, ComfyNode<LatentFlip_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>,
}
export type LatentFlip_input = {
    samples: LATENT | HasSingle_LATENT
    flip_method: Enum_LatentFlip_flip_method | HasSingle_Enum_LatentFlip_flip_method
}

// |=============================================================================|
// | LatentCrop                                                                  |
// |=============================================================================|
export interface LatentCrop extends HasSingle_LATENT, ComfyNode<LatentCrop_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>,
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
    MODEL: ComfyNodeOutput<'MODEL', 0>,
    CLIP: ComfyNodeOutput<'CLIP', 1>,
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
    CLIP: ComfyNodeOutput<'CLIP', 0>,
}
export type CLIPLoader_input = {
    clip_name: Enum_CLIPLoader_clip_name | HasSingle_Enum_CLIPLoader_clip_name
}

// |=============================================================================|
// | CLIPVisionEncode                                                            |
// |=============================================================================|
export interface CLIPVisionEncode extends HasSingle_CLIP_VISION_OUTPUT, ComfyNode<CLIPVisionEncode_input> {
    CLIP_VISION_OUTPUT: ComfyNodeOutput<'CLIP_VISION_OUTPUT', 0>,
}
export type CLIPVisionEncode_input = {
    clip_vision: CLIP_VISION | HasSingle_CLIP_VISION
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | StyleModelApply                                                             |
// |=============================================================================|
export interface StyleModelApply extends HasSingle_CONDITIONING, ComfyNode<StyleModelApply_input> {
    CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
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
    CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
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
    CONTROL_NET: ComfyNodeOutput<'CONTROL_NET', 0>,
}
export type ControlNetLoader_input = {
    control_net_name: Enum_ControlNetLoader_control_net_name | HasSingle_Enum_ControlNetLoader_control_net_name
}

// |=============================================================================|
// | DiffControlNetLoader                                                        |
// |=============================================================================|
export interface DiffControlNetLoader extends HasSingle_CONTROL_NET, ComfyNode<DiffControlNetLoader_input> {
    CONTROL_NET: ComfyNodeOutput<'CONTROL_NET', 0>,
}
export type DiffControlNetLoader_input = {
    model: MODEL | HasSingle_MODEL
    control_net_name: Enum_ControlNetLoader_control_net_name | HasSingle_Enum_ControlNetLoader_control_net_name
}

// |=============================================================================|
// | StyleModelLoader                                                            |
// |=============================================================================|
export interface StyleModelLoader extends HasSingle_STYLE_MODEL, ComfyNode<StyleModelLoader_input> {
    STYLE_MODEL: ComfyNodeOutput<'STYLE_MODEL', 0>,
}
export type StyleModelLoader_input = {
    style_model_name: Enum_StyleModelLoader_style_model_name | HasSingle_Enum_StyleModelLoader_style_model_name
}

// |=============================================================================|
// | CLIPVisionLoader                                                            |
// |=============================================================================|
export interface CLIPVisionLoader extends HasSingle_CLIP_VISION, ComfyNode<CLIPVisionLoader_input> {
    CLIP_VISION: ComfyNodeOutput<'CLIP_VISION', 0>,
}
export type CLIPVisionLoader_input = {
    clip_name: Enum_CLIPVisionLoader_clip_name | HasSingle_Enum_CLIPVisionLoader_clip_name
}

// |=============================================================================|
// | VAEDecodeTiled                                                              |
// |=============================================================================|
export interface VAEDecodeTiled extends HasSingle_IMAGE, ComfyNode<VAEDecodeTiled_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type VAEDecodeTiled_input = {
    samples: LATENT | HasSingle_LATENT
    vae: VAE | HasSingle_VAE
}

// |=============================================================================|
// | VAEEncodeTiled                                                              |
// |=============================================================================|
export interface VAEEncodeTiled extends HasSingle_LATENT, ComfyNode<VAEEncodeTiled_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>,
}
export type VAEEncodeTiled_input = {
    pixels: IMAGE | HasSingle_IMAGE
    vae: VAE | HasSingle_VAE
}

// |=============================================================================|
// | ImageFilterAdjustments                                                      |
// |=============================================================================|
export interface ImageFilterAdjustments extends HasSingle_IMAGE, ComfyNode<ImageFilterAdjustments_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageFilterAdjustments_input = {
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
// | ImageStyleFilter                                                            |
// |=============================================================================|
export interface ImageStyleFilter extends HasSingle_IMAGE, ComfyNode<ImageStyleFilter_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageStyleFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    style: Enum_ImageStyleFilter_style | HasSingle_Enum_ImageStyleFilter_style
}

// |=============================================================================|
// | ImageBlendingMode                                                           |
// |=============================================================================|
export interface ImageBlendingMode extends HasSingle_IMAGE, ComfyNode<ImageBlendingMode_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageBlendingMode_input = {
    image_a: IMAGE | HasSingle_IMAGE
    image_b: IMAGE | HasSingle_IMAGE
    mode: Enum_ImageBlendingMode_mode | HasSingle_Enum_ImageBlendingMode_mode
}

// |=============================================================================|
// | ImageBlend                                                                  |
// |=============================================================================|
export interface ImageBlend extends HasSingle_IMAGE, ComfyNode<ImageBlend_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageBlend_input = {
    image_a: IMAGE | HasSingle_IMAGE
    image_b: IMAGE | HasSingle_IMAGE
    blend_percentage: FLOAT
}

// |=============================================================================|
// | ImageBlendByMask                                                            |
// |=============================================================================|
export interface ImageBlendByMask extends HasSingle_IMAGE, ComfyNode<ImageBlendByMask_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageBlendByMask_input = {
    image_a: IMAGE | HasSingle_IMAGE
    image_b: IMAGE | HasSingle_IMAGE
    mask: IMAGE | HasSingle_IMAGE
    blend_percentage: FLOAT
}

// |=============================================================================|
// | ImageRemoveColor                                                            |
// |=============================================================================|
export interface ImageRemoveColor extends HasSingle_IMAGE, ComfyNode<ImageRemoveColor_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageRemoveColor_input = {
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
// | ImageThreshold                                                              |
// |=============================================================================|
export interface ImageThreshold extends HasSingle_IMAGE, ComfyNode<ImageThreshold_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageThreshold_input = {
    image: IMAGE | HasSingle_IMAGE
    threshold: FLOAT
}

// |=============================================================================|
// | ImageChromaticAberration                                                    |
// |=============================================================================|
export interface ImageChromaticAberration extends HasSingle_IMAGE, ComfyNode<ImageChromaticAberration_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageChromaticAberration_input = {
    image: IMAGE | HasSingle_IMAGE
    red_offset: INT
    green_offset: INT
    blue_offset: INT
    intensity: FLOAT
}

// |=============================================================================|
// | ImageBloomFilter                                                            |
// |=============================================================================|
export interface ImageBloomFilter extends HasSingle_IMAGE, ComfyNode<ImageBloomFilter_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageBloomFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    radius: FLOAT
    intensity: FLOAT
}

// |=============================================================================|
// | ImageBlank                                                                  |
// |=============================================================================|
export interface ImageBlank extends HasSingle_IMAGE, ComfyNode<ImageBlank_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageBlank_input = {
    width: INT
    height: INT
    red: INT
    green: INT
    blue: INT
}

// |=============================================================================|
// | ImageFilmGrain                                                              |
// |=============================================================================|
export interface ImageFilmGrain extends HasSingle_IMAGE, ComfyNode<ImageFilmGrain_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageFilmGrain_input = {
    image: IMAGE | HasSingle_IMAGE
    density: FLOAT
    intensity: FLOAT
    highlights: FLOAT
    supersample_factor: INT
}

// |=============================================================================|
// | ImageFlip                                                                   |
// |=============================================================================|
export interface ImageFlip extends HasSingle_IMAGE, ComfyNode<ImageFlip_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageFlip_input = {
    image: IMAGE | HasSingle_IMAGE
    mode: Enum_ImageFlip_mode | HasSingle_Enum_ImageFlip_mode
}

// |=============================================================================|
// | ImageRotate                                                                 |
// |=============================================================================|
export interface ImageRotate extends HasSingle_IMAGE, ComfyNode<ImageRotate_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageRotate_input = {
    image: IMAGE | HasSingle_IMAGE
    mode: Enum_ImageRotate_mode | HasSingle_Enum_ImageRotate_mode
    rotation: INT
    sampler: Enum_ImageRotate_sampler | HasSingle_Enum_ImageRotate_sampler
}

// |=============================================================================|
// | ImageNovaFilter                                                             |
// |=============================================================================|
export interface ImageNovaFilter extends HasSingle_IMAGE, ComfyNode<ImageNovaFilter_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageNovaFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    amplitude: FLOAT
    frequency: FLOAT
}

// |=============================================================================|
// | ImageCannyFilter                                                            |
// |=============================================================================|
export interface ImageCannyFilter extends HasSingle_IMAGE, ComfyNode<ImageCannyFilter_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageCannyFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    enable_threshold: Enum_ImageCannyFilter_enable_threshold | HasSingle_Enum_ImageCannyFilter_enable_threshold
    threshold_low: FLOAT
    threshold_high: FLOAT
}

// |=============================================================================|
// | ImageEdgeDetectionFilter                                                    |
// |=============================================================================|
export interface ImageEdgeDetectionFilter extends HasSingle_IMAGE, ComfyNode<ImageEdgeDetectionFilter_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageEdgeDetectionFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    mode: Enum_ImageEdgeDetectionFilter_mode | HasSingle_Enum_ImageEdgeDetectionFilter_mode
}

// |=============================================================================|
// | ImageFDOFFilter                                                             |
// |=============================================================================|
export interface ImageFDOFFilter extends HasSingle_IMAGE, ComfyNode<ImageFDOFFilter_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageFDOFFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    depth: IMAGE | HasSingle_IMAGE
    mode: Enum_ImageFDOFFilter_mode | HasSingle_Enum_ImageFDOFFilter_mode
    radius: INT
    samples: INT
}

// |=============================================================================|
// | ImageMedianFilter                                                           |
// |=============================================================================|
export interface ImageMedianFilter extends HasSingle_IMAGE, ComfyNode<ImageMedianFilter_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageMedianFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    diameter: INT
    sigma_color: FLOAT
    sigma_space: FLOAT
}

// |=============================================================================|
// | ImageSave                                                                   |
// |=============================================================================|
export interface ImageSave extends ComfyNode<ImageSave_input> {
}
export type ImageSave_input = {
    images: IMAGE | HasSingle_IMAGE
    output_path: STRING
    filename_prefix: STRING
    extension: Enum_ImageSave_extension | HasSingle_Enum_ImageSave_extension
    quality: INT
}

// |=============================================================================|
// | ImageLoad                                                                   |
// |=============================================================================|
export interface ImageLoad extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImageLoad_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
    MASK: ComfyNodeOutput<'MASK', 1>,
}
export type ImageLoad_input = {
    image_path: STRING
}

// |=============================================================================|
// | ImageLevelsAdjustment                                                       |
// |=============================================================================|
export interface ImageLevelsAdjustment extends HasSingle_IMAGE, ComfyNode<ImageLevelsAdjustment_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageLevelsAdjustment_input = {
    image: IMAGE | HasSingle_IMAGE
    black_level: FLOAT
    mid_level: FLOAT
    white_level: FLOAT
}

// |=============================================================================|
// | ImageHighPassFilter                                                         |
// |=============================================================================|
export interface ImageHighPassFilter extends HasSingle_IMAGE, ComfyNode<ImageHighPassFilter_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageHighPassFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    radius: INT
    strength: FLOAT
}

// |=============================================================================|
// | TensorBatchToImage                                                          |
// |=============================================================================|
export interface TensorBatchToImage extends HasSingle_IMAGE, ComfyNode<TensorBatchToImage_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type TensorBatchToImage_input = {
    images_batch: IMAGE | HasSingle_IMAGE
    batch_image_number: INT
}

// |=============================================================================|
// | ImageSelectColor                                                            |
// |=============================================================================|
export interface ImageSelectColor extends HasSingle_IMAGE, ComfyNode<ImageSelectColor_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageSelectColor_input = {
    image: IMAGE | HasSingle_IMAGE
    red: INT
    green: INT
    blue: INT
    variance: INT
}

// |=============================================================================|
// | ImageSelectChannel                                                          |
// |=============================================================================|
export interface ImageSelectChannel extends HasSingle_IMAGE, ComfyNode<ImageSelectChannel_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageSelectChannel_input = {
    image: IMAGE | HasSingle_IMAGE
    channel: Enum_ImageSelectChannel_channel | HasSingle_Enum_ImageSelectChannel_channel
}

// |=============================================================================|
// | ImageMixRGBChannels                                                         |
// |=============================================================================|
export interface ImageMixRGBChannels extends HasSingle_IMAGE, ComfyNode<ImageMixRGBChannels_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageMixRGBChannels_input = {
    red_channel: IMAGE | HasSingle_IMAGE
    green_channel: IMAGE | HasSingle_IMAGE
    blue_channel: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | LatentUpscaleByFactorWAS                                                    |
// |=============================================================================|
export interface LatentUpscaleByFactorWAS extends HasSingle_LATENT, ComfyNode<LatentUpscaleByFactorWAS_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>,
}
export type LatentUpscaleByFactorWAS_input = {
    samples: LATENT | HasSingle_LATENT
    mode: Enum_LatentUpscaleByFactorWAS_mode | HasSingle_Enum_LatentUpscaleByFactorWAS_mode
    factor: FLOAT
    align: Enum_ImageCannyFilter_enable_threshold | HasSingle_Enum_ImageCannyFilter_enable_threshold
}

// |=============================================================================|
// | LatentNoiseInjection                                                        |
// |=============================================================================|
export interface LatentNoiseInjection extends HasSingle_LATENT, ComfyNode<LatentNoiseInjection_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>,
}
export type LatentNoiseInjection_input = {
    samples: LATENT | HasSingle_LATENT
    noise_std: FLOAT
}

// |=============================================================================|
// | ImageToLatentMask                                                           |
// |=============================================================================|
export interface ImageToLatentMask extends HasSingle_MASK, ComfyNode<ImageToLatentMask_input> {
    MASK: ComfyNodeOutput<'MASK', 0>,
}
export type ImageToLatentMask_input = {
    image: IMAGE | HasSingle_IMAGE
    channel: Enum_LoadImageMask_channel | HasSingle_Enum_LoadImageMask_channel
}

// |=============================================================================|
// | MiDaSDepthApproximation                                                     |
// |=============================================================================|
export interface MiDaSDepthApproximation extends HasSingle_IMAGE, ComfyNode<MiDaSDepthApproximation_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type MiDaSDepthApproximation_input = {
    image: IMAGE | HasSingle_IMAGE
    use_cpu: Enum_ImageCannyFilter_enable_threshold | HasSingle_Enum_ImageCannyFilter_enable_threshold
    midas_model: Enum_MiDaSDepthApproximation_midas_model | HasSingle_Enum_MiDaSDepthApproximation_midas_model
    invert_depth: Enum_ImageCannyFilter_enable_threshold | HasSingle_Enum_ImageCannyFilter_enable_threshold
}

// |=============================================================================|
// | MiDaSMaskImage                                                              |
// |=============================================================================|
export interface MiDaSMaskImage extends ComfyNode<MiDaSMaskImage_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
    IMAGE_1: ComfyNodeOutput<'IMAGE', 1>,
}
export type MiDaSMaskImage_input = {
    image: IMAGE | HasSingle_IMAGE
    use_cpu: Enum_ImageCannyFilter_enable_threshold | HasSingle_Enum_ImageCannyFilter_enable_threshold
    midas_model: Enum_MiDaSDepthApproximation_midas_model | HasSingle_Enum_MiDaSDepthApproximation_midas_model
    remove: Enum_MiDaSMaskImage_remove | HasSingle_Enum_MiDaSMaskImage_remove
    threshold: Enum_ImageCannyFilter_enable_threshold | HasSingle_Enum_ImageCannyFilter_enable_threshold
    threshold_low: FLOAT
    threshold_mid: FLOAT
    threshold_high: FLOAT
    smoothing: FLOAT
    background_red: INT
    background_green: INT
    background_blue: INT
}

// |=============================================================================|
// | CLIPTextEncodeNSP                                                           |
// |=============================================================================|
export interface CLIPTextEncodeNSP extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncodeNSP_input> {
    CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
}
export type CLIPTextEncodeNSP_input = {
    noodle_key: STRING
    seed: INT
    text: STRING
    clip: CLIP | HasSingle_CLIP
}

// |=============================================================================|
// | KSamplerWAS                                                                 |
// |=============================================================================|
export interface KSamplerWAS extends HasSingle_LATENT, ComfyNode<KSamplerWAS_input> {
    LATENT: ComfyNodeOutput<'LATENT', 0>,
}
export type KSamplerWAS_input = {
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
// | Seed                                                                        |
// |=============================================================================|
export interface Seed extends HasSingle_SEED, ComfyNode<Seed_input> {
    SEED: ComfyNodeOutput<'SEED', 0>,
}
export type Seed_input = {
    seed: INT
}

// |=============================================================================|
// | TextMultiline                                                               |
// |=============================================================================|
export interface TextMultiline extends HasSingle_ASCII, ComfyNode<TextMultiline_input> {
    ASCII: ComfyNodeOutput<'ASCII', 0>,
}
export type TextMultiline_input = {
    text: STRING
}

// |=============================================================================|
// | TextString                                                                  |
// |=============================================================================|
export interface TextString extends HasSingle_ASCII, ComfyNode<TextString_input> {
    ASCII: ComfyNodeOutput<'ASCII', 0>,
}
export type TextString_input = {
    text: STRING
}

// |=============================================================================|
// | TextRandomLine                                                              |
// |=============================================================================|
export interface TextRandomLine extends HasSingle_ASCII, ComfyNode<TextRandomLine_input> {
    ASCII: ComfyNodeOutput<'ASCII', 0>,
}
export type TextRandomLine_input = {
    text: ASCII | HasSingle_ASCII
    seed: INT
}

// |=============================================================================|
// | TextToConditioning                                                          |
// |=============================================================================|
export interface TextToConditioning extends HasSingle_CONDITIONING, ComfyNode<TextToConditioning_input> {
    CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
}
export type TextToConditioning_input = {
    clip: CLIP | HasSingle_CLIP
    text: ASCII | HasSingle_ASCII
}

// |=============================================================================|
// | TextConcatenate                                                             |
// |=============================================================================|
export interface TextConcatenate extends HasSingle_ASCII, ComfyNode<TextConcatenate_input> {
    ASCII: ComfyNodeOutput<'ASCII', 0>,
}
export type TextConcatenate_input = {
    text_a: ASCII | HasSingle_ASCII
    text_b: ASCII | HasSingle_ASCII
    linebreak_addition: Enum_ImageCannyFilter_enable_threshold | HasSingle_Enum_ImageCannyFilter_enable_threshold
}

// |=============================================================================|
// | TextFindAndReplace                                                          |
// |=============================================================================|
export interface TextFindAndReplace extends HasSingle_ASCII, ComfyNode<TextFindAndReplace_input> {
    ASCII: ComfyNodeOutput<'ASCII', 0>,
}
export type TextFindAndReplace_input = {
    text: ASCII | HasSingle_ASCII
    find: STRING
    replace: STRING
}

// |=============================================================================|
// | TextFindAndReplaceInput                                                     |
// |=============================================================================|
export interface TextFindAndReplaceInput extends HasSingle_ASCII, ComfyNode<TextFindAndReplaceInput_input> {
    ASCII: ComfyNodeOutput<'ASCII', 0>,
}
export type TextFindAndReplaceInput_input = {
    text: ASCII | HasSingle_ASCII
    find: ASCII | HasSingle_ASCII
    replace: ASCII | HasSingle_ASCII
}

// |=============================================================================|
// | TextParseNoodleSoupPrompts                                                  |
// |=============================================================================|
export interface TextParseNoodleSoupPrompts extends HasSingle_ASCII, ComfyNode<TextParseNoodleSoupPrompts_input> {
    ASCII: ComfyNodeOutput<'ASCII', 0>,
}
export type TextParseNoodleSoupPrompts_input = {
    noodle_key: STRING
    seed: INT
    text: ASCII | HasSingle_ASCII
}

// |=============================================================================|
// | SaveTextFile                                                                |
// |=============================================================================|
export interface SaveTextFile extends ComfyNode<SaveTextFile_input> {
}
export type SaveTextFile_input = {
    text: ASCII | HasSingle_ASCII
    path: STRING
    filename: STRING
}

// |=============================================================================|
// | LoadTextFile                                                                |
// |=============================================================================|
export interface LoadTextFile extends HasSingle_ASCII, ComfyNode<LoadTextFile_input> {
    ASCII: ComfyNodeOutput<'ASCII', 0>,
}
export type LoadTextFile_input = {
    file_path: STRING
}

// |=============================================================================|
// | TextToConsole                                                               |
// |=============================================================================|
export interface TextToConsole extends HasSingle_ASCII, ComfyNode<TextToConsole_input> {
    ASCII: ComfyNodeOutput<'ASCII', 0>,
}
export type TextToConsole_input = {
    text: ASCII | HasSingle_ASCII
    label: STRING
}

// |=============================================================================|
// | UpscaleModelLoader                                                          |
// |=============================================================================|
export interface UpscaleModelLoader extends HasSingle_UPSCALE_MODEL, ComfyNode<UpscaleModelLoader_input> {
    UPSCALE_MODEL: ComfyNodeOutput<'UPSCALE_MODEL', 0>,
}
export type UpscaleModelLoader_input = {
    model_name: Enum_UpscaleModelLoader_model_name | HasSingle_Enum_UpscaleModelLoader_model_name
}

// |=============================================================================|
// | ImageUpscaleWithModel                                                       |
// |=============================================================================|
export interface ImageUpscaleWithModel extends HasSingle_IMAGE, ComfyNode<ImageUpscaleWithModel_input> {
    IMAGE: ComfyNodeOutput<'IMAGE', 0>,
}
export type ImageUpscaleWithModel_input = {
    upscale_model: UPSCALE_MODEL | HasSingle_UPSCALE_MODEL
    image: IMAGE | HasSingle_IMAGE
}


// INDEX -------------------------------
export type Schemas = {
    KSampler: ComfyNodeSchemaJSON,
    CheckpointLoader: ComfyNodeSchemaJSON,
    CheckpointLoaderSimple: ComfyNodeSchemaJSON,
    CLIPTextEncode: ComfyNodeSchemaJSON,
    CLIPSetLastLayer: ComfyNodeSchemaJSON,
    VAEDecode: ComfyNodeSchemaJSON,
    VAEEncode: ComfyNodeSchemaJSON,
    VAEEncodeForInpaint: ComfyNodeSchemaJSON,
    VAELoader: ComfyNodeSchemaJSON,
    EmptyLatentImage: ComfyNodeSchemaJSON,
    LatentUpscale: ComfyNodeSchemaJSON,
    SaveImage: ComfyNodeSchemaJSON,
    PreviewImage: ComfyNodeSchemaJSON,
    LoadImage: ComfyNodeSchemaJSON,
    LoadImageMask: ComfyNodeSchemaJSON,
    ImageScale: ComfyNodeSchemaJSON,
    ImageInvert: ComfyNodeSchemaJSON,
    ImagePadForOutpaint: ComfyNodeSchemaJSON,
    ConditioningCombine: ComfyNodeSchemaJSON,
    ConditioningSetArea: ComfyNodeSchemaJSON,
    KSamplerAdvanced: ComfyNodeSchemaJSON,
    SetLatentNoiseMask: ComfyNodeSchemaJSON,
    LatentComposite: ComfyNodeSchemaJSON,
    LatentRotate: ComfyNodeSchemaJSON,
    LatentFlip: ComfyNodeSchemaJSON,
    LatentCrop: ComfyNodeSchemaJSON,
    LoraLoader: ComfyNodeSchemaJSON,
    CLIPLoader: ComfyNodeSchemaJSON,
    CLIPVisionEncode: ComfyNodeSchemaJSON,
    StyleModelApply: ComfyNodeSchemaJSON,
    ControlNetApply: ComfyNodeSchemaJSON,
    ControlNetLoader: ComfyNodeSchemaJSON,
    DiffControlNetLoader: ComfyNodeSchemaJSON,
    StyleModelLoader: ComfyNodeSchemaJSON,
    CLIPVisionLoader: ComfyNodeSchemaJSON,
    VAEDecodeTiled: ComfyNodeSchemaJSON,
    VAEEncodeTiled: ComfyNodeSchemaJSON,
    ImageFilterAdjustments: ComfyNodeSchemaJSON,
    ImageStyleFilter: ComfyNodeSchemaJSON,
    ImageBlendingMode: ComfyNodeSchemaJSON,
    ImageBlend: ComfyNodeSchemaJSON,
    ImageBlendByMask: ComfyNodeSchemaJSON,
    ImageRemoveColor: ComfyNodeSchemaJSON,
    ImageThreshold: ComfyNodeSchemaJSON,
    ImageChromaticAberration: ComfyNodeSchemaJSON,
    ImageBloomFilter: ComfyNodeSchemaJSON,
    ImageBlank: ComfyNodeSchemaJSON,
    ImageFilmGrain: ComfyNodeSchemaJSON,
    ImageFlip: ComfyNodeSchemaJSON,
    ImageRotate: ComfyNodeSchemaJSON,
    ImageNovaFilter: ComfyNodeSchemaJSON,
    ImageCannyFilter: ComfyNodeSchemaJSON,
    ImageEdgeDetectionFilter: ComfyNodeSchemaJSON,
    ImageFDOFFilter: ComfyNodeSchemaJSON,
    ImageMedianFilter: ComfyNodeSchemaJSON,
    ImageSave: ComfyNodeSchemaJSON,
    ImageLoad: ComfyNodeSchemaJSON,
    ImageLevelsAdjustment: ComfyNodeSchemaJSON,
    ImageHighPassFilter: ComfyNodeSchemaJSON,
    TensorBatchToImage: ComfyNodeSchemaJSON,
    ImageSelectColor: ComfyNodeSchemaJSON,
    ImageSelectChannel: ComfyNodeSchemaJSON,
    ImageMixRGBChannels: ComfyNodeSchemaJSON,
    LatentUpscaleByFactorWAS: ComfyNodeSchemaJSON,
    LatentNoiseInjection: ComfyNodeSchemaJSON,
    ImageToLatentMask: ComfyNodeSchemaJSON,
    MiDaSDepthApproximation: ComfyNodeSchemaJSON,
    MiDaSMaskImage: ComfyNodeSchemaJSON,
    CLIPTextEncodeNSP: ComfyNodeSchemaJSON,
    KSamplerWAS: ComfyNodeSchemaJSON,
    Seed: ComfyNodeSchemaJSON,
    TextMultiline: ComfyNodeSchemaJSON,
    TextString: ComfyNodeSchemaJSON,
    TextRandomLine: ComfyNodeSchemaJSON,
    TextToConditioning: ComfyNodeSchemaJSON,
    TextConcatenate: ComfyNodeSchemaJSON,
    TextFindAndReplace: ComfyNodeSchemaJSON,
    TextFindAndReplaceInput: ComfyNodeSchemaJSON,
    TextParseNoodleSoupPrompts: ComfyNodeSchemaJSON,
    SaveTextFile: ComfyNodeSchemaJSON,
    LoadTextFile: ComfyNodeSchemaJSON,
    TextToConsole: ComfyNodeSchemaJSON,
    UpscaleModelLoader: ComfyNodeSchemaJSON,
    ImageUpscaleWithModel: ComfyNodeSchemaJSON,
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
    ImageFilterAdjustments(args: ImageFilterAdjustments_input, uid?: ComfyNodeUID): ImageFilterAdjustments
    ImageStyleFilter(args: ImageStyleFilter_input, uid?: ComfyNodeUID): ImageStyleFilter
    ImageBlendingMode(args: ImageBlendingMode_input, uid?: ComfyNodeUID): ImageBlendingMode
    ImageBlend(args: ImageBlend_input, uid?: ComfyNodeUID): ImageBlend
    ImageBlendByMask(args: ImageBlendByMask_input, uid?: ComfyNodeUID): ImageBlendByMask
    ImageRemoveColor(args: ImageRemoveColor_input, uid?: ComfyNodeUID): ImageRemoveColor
    ImageThreshold(args: ImageThreshold_input, uid?: ComfyNodeUID): ImageThreshold
    ImageChromaticAberration(args: ImageChromaticAberration_input, uid?: ComfyNodeUID): ImageChromaticAberration
    ImageBloomFilter(args: ImageBloomFilter_input, uid?: ComfyNodeUID): ImageBloomFilter
    ImageBlank(args: ImageBlank_input, uid?: ComfyNodeUID): ImageBlank
    ImageFilmGrain(args: ImageFilmGrain_input, uid?: ComfyNodeUID): ImageFilmGrain
    ImageFlip(args: ImageFlip_input, uid?: ComfyNodeUID): ImageFlip
    ImageRotate(args: ImageRotate_input, uid?: ComfyNodeUID): ImageRotate
    ImageNovaFilter(args: ImageNovaFilter_input, uid?: ComfyNodeUID): ImageNovaFilter
    ImageCannyFilter(args: ImageCannyFilter_input, uid?: ComfyNodeUID): ImageCannyFilter
    ImageEdgeDetectionFilter(args: ImageEdgeDetectionFilter_input, uid?: ComfyNodeUID): ImageEdgeDetectionFilter
    ImageFDOFFilter(args: ImageFDOFFilter_input, uid?: ComfyNodeUID): ImageFDOFFilter
    ImageMedianFilter(args: ImageMedianFilter_input, uid?: ComfyNodeUID): ImageMedianFilter
    ImageSave(args: ImageSave_input, uid?: ComfyNodeUID): ImageSave
    ImageLoad(args: ImageLoad_input, uid?: ComfyNodeUID): ImageLoad
    ImageLevelsAdjustment(args: ImageLevelsAdjustment_input, uid?: ComfyNodeUID): ImageLevelsAdjustment
    ImageHighPassFilter(args: ImageHighPassFilter_input, uid?: ComfyNodeUID): ImageHighPassFilter
    TensorBatchToImage(args: TensorBatchToImage_input, uid?: ComfyNodeUID): TensorBatchToImage
    ImageSelectColor(args: ImageSelectColor_input, uid?: ComfyNodeUID): ImageSelectColor
    ImageSelectChannel(args: ImageSelectChannel_input, uid?: ComfyNodeUID): ImageSelectChannel
    ImageMixRGBChannels(args: ImageMixRGBChannels_input, uid?: ComfyNodeUID): ImageMixRGBChannels
    LatentUpscaleByFactorWAS(args: LatentUpscaleByFactorWAS_input, uid?: ComfyNodeUID): LatentUpscaleByFactorWAS
    LatentNoiseInjection(args: LatentNoiseInjection_input, uid?: ComfyNodeUID): LatentNoiseInjection
    ImageToLatentMask(args: ImageToLatentMask_input, uid?: ComfyNodeUID): ImageToLatentMask
    MiDaSDepthApproximation(args: MiDaSDepthApproximation_input, uid?: ComfyNodeUID): MiDaSDepthApproximation
    MiDaSMaskImage(args: MiDaSMaskImage_input, uid?: ComfyNodeUID): MiDaSMaskImage
    CLIPTextEncodeNSP(args: CLIPTextEncodeNSP_input, uid?: ComfyNodeUID): CLIPTextEncodeNSP
    KSamplerWAS(args: KSamplerWAS_input, uid?: ComfyNodeUID): KSamplerWAS
    Seed(args: Seed_input, uid?: ComfyNodeUID): Seed
    TextMultiline(args: TextMultiline_input, uid?: ComfyNodeUID): TextMultiline
    TextString(args: TextString_input, uid?: ComfyNodeUID): TextString
    TextRandomLine(args: TextRandomLine_input, uid?: ComfyNodeUID): TextRandomLine
    TextToConditioning(args: TextToConditioning_input, uid?: ComfyNodeUID): TextToConditioning
    TextConcatenate(args: TextConcatenate_input, uid?: ComfyNodeUID): TextConcatenate
    TextFindAndReplace(args: TextFindAndReplace_input, uid?: ComfyNodeUID): TextFindAndReplace
    TextFindAndReplaceInput(args: TextFindAndReplaceInput_input, uid?: ComfyNodeUID): TextFindAndReplaceInput
    TextParseNoodleSoupPrompts(args: TextParseNoodleSoupPrompts_input, uid?: ComfyNodeUID): TextParseNoodleSoupPrompts
    SaveTextFile(args: SaveTextFile_input, uid?: ComfyNodeUID): SaveTextFile
    LoadTextFile(args: LoadTextFile_input, uid?: ComfyNodeUID): LoadTextFile
    TextToConsole(args: TextToConsole_input, uid?: ComfyNodeUID): TextToConsole
    UpscaleModelLoader(args: UpscaleModelLoader_input, uid?: ComfyNodeUID): UpscaleModelLoader
    ImageUpscaleWithModel(args: ImageUpscaleWithModel_input, uid?: ComfyNodeUID): ImageUpscaleWithModel
}
declare global {
    export const WORKFLOW: (builder: (graph: ComfySetup & ComfyGraph) => void) => void
}

export const WORKFLOW: (builder: (graph: ComfySetup & ComfyGraph) => void) => void
