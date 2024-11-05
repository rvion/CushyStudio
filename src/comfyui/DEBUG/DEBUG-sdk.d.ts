import type { ComfyNode } from '../../../src/core/ComfyNode'
import type { ComfyNodeMetadata } from '../../../src/types/ComfyNodeID'
import type { ComfyNodeOutput } from '../../../src/core/Slot'
import type { ComfyNodeSchemaJSON } from '../../../src/comfyui/ComfyUIObjectInfoTypes'

declare global {
   namespace Comfy {
      export type PythonModulesAvaialbles = 
          /**
           * SDK Namespace: Comfy.Base
           * Nodes: KSampler, CheckpointLoaderSimple, CLIPTextEncode, CLIPSetLastLayer, VAEDecode, VAEEncode, VAEEncodeForInpaint, VAELoader, EmptyLatentImage, LatentUpscale, LatentUpscaleBy, LatentFromBatch, RepeatLatentBatch, SaveImage, PreviewImage, LoadImage, LoadImageMask, ImageScale, ImageScaleBy, ImageInvert, ImageBatch, ImagePadForOutpaint, EmptyImage, ConditioningAverage, ConditioningCombine, ConditioningConcat, ConditioningSetArea, ConditioningSetAreaPercentage, ConditioningSetAreaStrength, ConditioningSetMask, KSamplerAdvanced, SetLatentNoiseMask, LatentComposite, LatentBlend, LatentRotate, LatentFlip, LatentCrop, LoraLoader, CLIPLoader, UNETLoader, DualCLIPLoader, CLIPVisionEncode, StyleModelApply, unCLIPConditioning, ControlNetApply, ControlNetApplyAdvanced, ControlNetLoader, DiffControlNetLoader, StyleModelLoader, CLIPVisionLoader, VAEDecodeTiled, VAEEncodeTiled, unCLIPCheckpointLoader, GLIGENLoader, GLIGENTextBoxApply, InpaintModelConditioning, CheckpointLoader, DiffusersLoader, LoadLatent, SaveLatent, ConditioningZeroOut, ConditioningSetTimestepRange, LoraLoaderModelOnly, UnknownNodeXX
           */
          | 'nodes'
          /**
           * SDK Namespace: Comfy.Extra.latent
           * Nodes: LatentAdd, LatentSubtract, LatentMultiply, LatentInterpolate, LatentBatch, LatentBatchSeedBehavior, LatentApplyOperation, LatentApplyOperationCFG, LatentOperationTonemapReinhard, LatentOperationSharpen
           */
          | 'comfy_extras.nodes_latent'
          /**
           * SDK Namespace: Comfy.Extra.hypernetwork
           * Nodes: HypernetworkLoader
           */
          | 'comfy_extras.nodes_hypernetwork'
          /**
           * SDK Namespace: Comfy.Extra.upscale_model
           * Nodes: UpscaleModelLoader, ImageUpscaleWithModel
           */
          | 'comfy_extras.nodes_upscale_model'
          /**
           * SDK Namespace: Comfy.Extra.post_processing
           * Nodes: ImageBlend, ImageBlur, ImageQuantize, ImageSharpen, ImageScaleToTotalPixels
           */
          | 'comfy_extras.nodes_post_processing'
          /**
           * SDK Namespace: Comfy.Extra.mask
           * Nodes: LatentCompositeMasked, ImageCompositeMasked, MaskToImage, ImageToMask, ImageColorToMask, SolidMask, InvertMask, CropMask, MaskComposite, FeatherMask, GrowMask, ThresholdMask
           */
          | 'comfy_extras.nodes_mask'
          /**
           * SDK Namespace: Comfy.Extra.compositing
           * Nodes: PorterDuffImageComposite, SplitImageWithAlpha, JoinImageWithAlpha
           */
          | 'comfy_extras.nodes_compositing'
          /**
           * SDK Namespace: Comfy.Extra.rebatch
           * Nodes: RebatchLatents, RebatchImages
           */
          | 'comfy_extras.nodes_rebatch'
          /**
           * SDK Namespace: Comfy.Extra.model_merging
           * Nodes: ModelMergeSimple, ModelMergeBlocks, ModelMergeSubtract, ModelMergeAdd, CheckpointSave, CLIPMergeSimple, CLIPMergeSubtract, CLIPMergeAdd, CLIPSave, VAESave, ModelSave
           */
          | 'comfy_extras.nodes_model_merging'
          /**
           * SDK Namespace: Comfy.Extra.tomesd
           * Nodes: TomePatchModel
           */
          | 'comfy_extras.nodes_tomesd'
          /**
           * SDK Namespace: Comfy.Extra.clip_sdxl
           * Nodes: CLIPTextEncodeSDXLRefiner, CLIPTextEncodeSDXL
           */
          | 'comfy_extras.nodes_clip_sdxl'
          /**
           * SDK Namespace: Comfy.Extra.canny
           * Nodes: Canny
           */
          | 'comfy_extras.nodes_canny'
          /**
           * SDK Namespace: Comfy.Extra.freelunch
           * Nodes: FreeU, FreeU_V2
           */
          | 'comfy_extras.nodes_freelunch'
          /**
           * SDK Namespace: Comfy.Extra.custom_sampler
           * Nodes: SamplerCustom, BasicScheduler, KarrasScheduler, ExponentialScheduler, PolyexponentialScheduler, LaplaceScheduler, VPScheduler, BetaSamplingScheduler, SDTurboScheduler, KSamplerSelect, SamplerEulerAncestral, SamplerEulerAncestralCFGPP, SamplerLMS, SamplerDPMPP_3M_SDE, SamplerDPMPP_2M_SDE, SamplerDPMPP_SDE, SamplerDPMPP_2S_Ancestral, SamplerDPMAdaptative, SplitSigmas, SplitSigmasDenoise, FlipSigmas, CFGGuider, DualCFGGuider, BasicGuider, RandomNoise, DisableNoise, AddNoise, SamplerCustomAdvanced
           */
          | 'comfy_extras.nodes_custom_sampler'
          /**
           * SDK Namespace: Comfy.Extra.hypertile
           * Nodes: HyperTile
           */
          | 'comfy_extras.nodes_hypertile'
          /**
           * SDK Namespace: Comfy.Extra.model_advanced
           * Nodes: ModelSamplingDiscrete, ModelSamplingContinuousEDM, ModelSamplingContinuousV, ModelSamplingStableCascade, ModelSamplingSD3, ModelSamplingAuraFlow, ModelSamplingFlux, RescaleCFG
           */
          | 'comfy_extras.nodes_model_advanced'
          /**
           * SDK Namespace: Comfy.Extra.model_downscale
           * Nodes: PatchModelAddDownscale
           */
          | 'comfy_extras.nodes_model_downscale'
          /**
           * SDK Namespace: Comfy.Extra.images
           * Nodes: ImageCrop, RepeatImageBatch, ImageFromBatch, SaveAnimatedWEBP, SaveAnimatedPNG
           */
          | 'comfy_extras.nodes_images'
          /**
           * SDK Namespace: Comfy.Extra.video_model
           * Nodes: ImageOnlyCheckpointLoader, SVD_img2vid_Conditioning, VideoLinearCFGGuidance, VideoTriangleCFGGuidance, ImageOnlyCheckpointSave
           */
          | 'comfy_extras.nodes_video_model'
          /**
           * SDK Namespace: Comfy.Extra.sag
           * Nodes: SelfAttentionGuidance
           */
          | 'comfy_extras.nodes_sag'
          /**
           * SDK Namespace: Comfy.Extra.perpneg
           * Nodes: PerpNeg, PerpNegGuider
           */
          | 'comfy_extras.nodes_perpneg'
          /**
           * SDK Namespace: Comfy.Extra.stable3d
           * Nodes: StableZero123_Conditioning, StableZero123_Conditioning_Batched, SV3D_Conditioning
           */
          | 'comfy_extras.nodes_stable3d'
          /**
           * SDK Namespace: Comfy.Extra.sdupscale
           * Nodes: SD_4XUpscale_Conditioning
           */
          | 'comfy_extras.nodes_sdupscale'
          /**
           * SDK Namespace: Comfy.Extra.photomaker
           * Nodes: PhotoMakerLoader, PhotoMakerEncode
           */
          | 'comfy_extras.nodes_photomaker'
          /**
           * SDK Namespace: Comfy.Extra.cond
           * Nodes: CLIPTextEncodeControlnet
           */
          | 'comfy_extras.nodes_cond'
          /**
           * SDK Namespace: Comfy.Extra.morphology
           * Nodes: Morphology
           */
          | 'comfy_extras.nodes_morphology'
          /**
           * SDK Namespace: Comfy.Extra.stable_cascade
           * Nodes: StableCascade_EmptyLatentImage, StableCascade_StageB_Conditioning, StableCascade_StageC_VAEEncode, StableCascade_SuperResolutionControlnet
           */
          | 'comfy_extras.nodes_stable_cascade'
          /**
           * SDK Namespace: Comfy.Extra.differential_diffusion
           * Nodes: DifferentialDiffusion
           */
          | 'comfy_extras.nodes_differential_diffusion'
          /**
           * SDK Namespace: Comfy.Extra.ip2p
           * Nodes: InstructPixToPixConditioning
           */
          | 'comfy_extras.nodes_ip2p'
          /**
           * SDK Namespace: Comfy.Extra.model_merging_model_specific
           * Nodes: ModelMergeSD1, ModelMergeSD2, ModelMergeSDXL, ModelMergeSD3_2B, ModelMergeFlux1, ModelMergeSD35_Large
           */
          | 'comfy_extras.nodes_model_merging_model_specific'
          /**
           * SDK Namespace: Comfy.Extra.pag
           * Nodes: PerturbedAttentionGuidance
           */
          | 'comfy_extras.nodes_pag'
          /**
           * SDK Namespace: Comfy.Extra.align_your_steps
           * Nodes: AlignYourStepsScheduler
           */
          | 'comfy_extras.nodes_align_your_steps'
          /**
           * SDK Namespace: Comfy.Extra.attention_multiply
           * Nodes: UNetSelfAttentionMultiply, UNetCrossAttentionMultiply, CLIPAttentionMultiply, UNetTemporalAttentionMultiply
           */
          | 'comfy_extras.nodes_attention_multiply'
          /**
           * SDK Namespace: Comfy.Extra.advanced_samplers
           * Nodes: SamplerLCMUpscale, SamplerEulerCFGpp
           */
          | 'comfy_extras.nodes_advanced_samplers'
          /**
           * SDK Namespace: Comfy.Extra.webcam
           * Nodes: WebcamCapture
           */
          | 'comfy_extras.nodes_webcam'
          /**
           * SDK Namespace: Comfy.Extra.audio
           * Nodes: EmptyLatentAudio, VAEEncodeAudio, VAEDecodeAudio, SaveAudio, LoadAudio, PreviewAudio
           */
          | 'comfy_extras.nodes_audio'
          /**
           * SDK Namespace: Comfy.Extra.sd3
           * Nodes: TripleCLIPLoader, EmptySD3LatentImage, CLIPTextEncodeSD3, ControlNetApplySD3, SkipLayerGuidanceSD3
           */
          | 'comfy_extras.nodes_sd3'
          /**
           * SDK Namespace: Comfy.Extra.gits
           * Nodes: GITSScheduler
           */
          | 'comfy_extras.nodes_gits'
          /**
           * SDK Namespace: Comfy.Extra.controlnet
           * Nodes: SetUnionControlNetType, ControlNetInpaintingAliMamaApply
           */
          | 'comfy_extras.nodes_controlnet'
          /**
           * SDK Namespace: Comfy.Extra.hunyuan
           * Nodes: CLIPTextEncodeHunyuanDiT
           */
          | 'comfy_extras.nodes_hunyuan'
          /**
           * SDK Namespace: Comfy.Extra.flux
           * Nodes: CLIPTextEncodeFlux, FluxGuidance
           */
          | 'comfy_extras.nodes_flux'
          /**
           * SDK Namespace: Comfy.Extra.lora_extract
           * Nodes: LoraSave
           */
          | 'comfy_extras.nodes_lora_extract'
          /**
           * SDK Namespace: Comfy.Extra.torch_compile
           * Nodes: TorchCompileModel
           */
          | 'comfy_extras.nodes_torch_compile'
          /**
           * SDK Namespace: Comfy.Extra.mochi
           * Nodes: EmptyMochiLatentVideo
           */
          | 'comfy_extras.nodes_mochi'
          /**
           * SDK Namespace: Comfy.Custom.websocket_image_save
           * Nodes: SaveImageWebsocket
           */
          | 'custom_nodes.websocket_image_save'
          /**
           * SDK Namespace: Comfy.Custom.Impact_Pack
           * Nodes: SAMLoader, CLIPSegDetectorProvider, ONNXDetectorProvider, BitwiseAndMaskForEach, SubtractMaskForEach, DetailerForEach, DetailerForEachDebug, DetailerForEachPipe, DetailerForEachDebugPipe, DetailerForEachPipeForAnimateDiff, SAMDetectorCombined, SAMDetectorSegmented, FaceDetailer, FaceDetailerPipe, MaskDetailerPipe, ToDetailerPipe, ToDetailerPipeSDXL, FromDetailerPipe, FromDetailerPipe_v2, FromDetailerPipeSDXL, AnyPipeToBasic, ToBasicPipe, FromBasicPipe, FromBasicPipe_v2, BasicPipeToDetailerPipe, BasicPipeToDetailerPipeSDXL, DetailerPipeToBasicPipe, EditBasicPipe, EditDetailerPipe, EditDetailerPipeSDXL, LatentPixelScale, PixelKSampleUpscalerProvider, PixelKSampleUpscalerProviderPipe, IterativeLatentUpscale, IterativeImageUpscale, PixelTiledKSampleUpscalerProvider, PixelTiledKSampleUpscalerProviderPipe, TwoSamplersForMaskUpscalerProvider, TwoSamplersForMaskUpscalerProviderPipe, PixelKSampleHookCombine, DenoiseScheduleHookProvider, StepsScheduleHookProvider, CfgScheduleHookProvider, NoiseInjectionHookProvider, UnsamplerHookProvider, CoreMLDetailerHookProvider, PreviewDetailerHookProvider, DetailerHookCombine, NoiseInjectionDetailerHookProvider, UnsamplerDetailerHookProvider, DenoiseSchedulerDetailerHookProvider, SEGSOrderedFilterDetailerHookProvider, SEGSRangeFilterDetailerHookProvider, SEGSLabelFilterDetailerHookProvider, VariationNoiseDetailerHookProvider, BitwiseAndMask, SubtractMask, AddMask, ImpactSegsAndMask, ImpactSegsAndMaskForEach, EmptySegs, ImpactFlattenMask, MediaPipeFaceMeshToSEGS, MaskToSEGS, MaskToSEGS_for_AnimateDiff, ToBinaryMask, MasksToMaskList, MaskListToMaskBatch, ImageListToImageBatch, SetDefaultImageForSEGS, RemoveImageFromSEGS, BboxDetectorSEGS, SegmDetectorSEGS, ONNXDetectorSEGS, ImpactSimpleDetectorSEGS_for_AD, ImpactSimpleDetectorSEGS, ImpactSimpleDetectorSEGSPipe, ImpactControlNetApplySEGS, ImpactControlNetApplyAdvancedSEGS, ImpactControlNetClearSEGS, ImpactIPAdapterApplySEGS, ImpactDecomposeSEGS, ImpactAssembleSEGS, ImpactFrom_SEG_ELT, ImpactEdit_SEG_ELT, ImpactDilate_Mask_SEG_ELT, ImpactDilateMask, ImpactGaussianBlurMask, ImpactDilateMaskInSEGS, ImpactGaussianBlurMaskInSEGS, ImpactScaleBy_BBOX_SEG_ELT, ImpactFrom_SEG_ELT_bbox, ImpactFrom_SEG_ELT_crop_region, ImpactCount_Elts_in_SEGS, BboxDetectorCombined_v2, SegmDetectorCombined_v2, SegsToCombinedMask, KSamplerProvider, TwoSamplersForMask, TiledKSamplerProvider, KSamplerAdvancedProvider, TwoAdvancedSamplersForMask, ImpactNegativeConditioningPlaceholder, PreviewBridge, PreviewBridgeLatent, ImageSender, ImageReceiver, LatentSender, LatentReceiver, ImageMaskSwitch, LatentSwitch, SEGSSwitch, ImpactSwitch, ImpactInversedSwitch, ImpactWildcardProcessor, ImpactWildcardEncode, SEGSUpscaler, SEGSUpscalerPipe, SEGSDetailer, SEGSPaste, SEGSPreview, SEGSPreviewCNet, SEGSToImageList, ImpactSEGSToMaskList, ImpactSEGSToMaskBatch, ImpactSEGSConcat, ImpactSEGSPicker, ImpactMakeTileSEGS, ImpactSEGSMerge, SEGSDetailerForAnimateDiff, ImpactKSamplerBasicPipe, ImpactKSamplerAdvancedBasicPipe, ReencodeLatent, ReencodeLatentPipe, ImpactImageBatchToImageList, ImpactMakeImageList, ImpactMakeImageBatch, ImpactMakeAnyList, ImpactMakeMaskList, ImpactMakeMaskBatch, RegionalSampler, RegionalSamplerAdvanced, CombineRegionalPrompts, RegionalPrompt, ImpactCombineConditionings, ImpactConcatConditionings, ImpactSEGSLabelAssign, ImpactSEGSLabelFilter, ImpactSEGSRangeFilter, ImpactSEGSOrderedFilter, ImpactCompare, ImpactConditionalBranch, ImpactConditionalBranchSelMode, ImpactIfNone, ImpactConvertDataType, ImpactLogicalOperators, ImpactInt, ImpactFloat, ImpactBoolean, ImpactValueSender, ImpactValueReceiver, ImpactImageInfo, ImpactLatentInfo, ImpactMinMax, ImpactNeg, ImpactConditionalStopIteration, ImpactStringSelector, StringListToString, WildcardPromptFromString, ImpactExecutionOrderController, RemoveNoiseMask, ImpactLogger, ImpactDummyInput, ImpactQueueTrigger, ImpactQueueTriggerCountdown, ImpactSetWidgetValue, ImpactNodeSetMuteState, ImpactControlBridge, ImpactIsNotEmptySEGS, ImpactSleep, ImpactRemoteBoolean, ImpactRemoteInt, ImpactHFTransformersClassifierProvider, ImpactSEGSClassify, ImpactSchedulerAdapter, GITSSchedulerFuncProvider, UltralyticsDetectorProvider
           */
          | 'custom_nodes.ComfyUI-Impact-Pack'
   }
   // XXX 46
   
   // nodes
   namespace Comfy.Base {
      interface Nodes {
         /**
          * Uses the provided model, positive and negative conditioning to denoise the latent image.
          * category="sampling" name="KSampler" output=[LATENT]
         **/
         KSampler(p: KSampler_input, meta?: ComfyNodeMetadata): KSampler
         /**
          * Loads a diffusion model checkpoint, diffusion models are used to denoise latents.
          * category="loaders" name="CheckpointLoaderSimple" output=[MODEL, CLIP, VAE]
         **/
         CheckpointLoaderSimple(p: CheckpointLoaderSimple_input, meta?: ComfyNodeMetadata): CheckpointLoaderSimple
         /**
          * Encodes a text prompt using a CLIP model into an embedding that can be used to guide the diffusion model towards generating specific images.
          * category="conditioning" name="CLIPTextEncode" output=[CONDITIONING]
         **/
         CLIPTextEncode(p: CLIPTextEncode_input, meta?: ComfyNodeMetadata): CLIPTextEncode
          /** category="conditioning" name="CLIPSetLastLayer" output=[CLIP] */
         CLIPSetLastLayer(p: CLIPSetLastLayer_input, meta?: ComfyNodeMetadata): CLIPSetLastLayer
         /**
          * Decodes latent images back into pixel space images.
          * category="latent" name="VAEDecode" output=[IMAGE]
         **/
         VAEDecode(p: VAEDecode_input, meta?: ComfyNodeMetadata): VAEDecode
          /** category="latent" name="VAEEncode" output=[LATENT] */
         VAEEncode(p: VAEEncode_input, meta?: ComfyNodeMetadata): VAEEncode
          /** category="latent_inpaint" name="VAEEncodeForInpaint" output=[LATENT] */
         VAEEncodeForInpaint(p: VAEEncodeForInpaint_input, meta?: ComfyNodeMetadata): VAEEncodeForInpaint
          /** category="loaders" name="VAELoader" output=[VAE] */
         VAELoader(p: VAELoader_input, meta?: ComfyNodeMetadata): VAELoader
         /**
          * Create a new batch of empty latent images to be denoised via sampling.
          * category="latent" name="EmptyLatentImage" output=[LATENT]
         **/
         EmptyLatentImage(p: EmptyLatentImage_input, meta?: ComfyNodeMetadata): EmptyLatentImage
          /** category="latent" name="LatentUpscale" output=[LATENT] */
         LatentUpscale(p: LatentUpscale_input, meta?: ComfyNodeMetadata): LatentUpscale
          /** category="latent" name="LatentUpscaleBy" output=[LATENT] */
         LatentUpscaleBy(p: LatentUpscaleBy_input, meta?: ComfyNodeMetadata): LatentUpscaleBy
          /** category="latent_batch" name="LatentFromBatch" output=[LATENT] */
         LatentFromBatch(p: LatentFromBatch_input, meta?: ComfyNodeMetadata): LatentFromBatch
          /** category="latent_batch" name="RepeatLatentBatch" output=[LATENT] */
         RepeatLatentBatch(p: RepeatLatentBatch_input, meta?: ComfyNodeMetadata): RepeatLatentBatch
         /**
          * Saves the input images to your ComfyUI output directory.
          * category="image" name="SaveImage" output=[]
         **/
         SaveImage(p: SaveImage_input, meta?: ComfyNodeMetadata): SaveImage
         /**
          * Saves the input images to your ComfyUI output directory.
          * category="image" name="PreviewImage" output=[]
         **/
         PreviewImage(p: PreviewImage_input, meta?: ComfyNodeMetadata): PreviewImage
          /** category="image" name="LoadImage" output=[IMAGE, MASK] */
         LoadImage(p: LoadImage_input, meta?: ComfyNodeMetadata): LoadImage
          /** category="mask" name="LoadImageMask" output=[MASK] */
         LoadImageMask(p: LoadImageMask_input, meta?: ComfyNodeMetadata): LoadImageMask
          /** category="image_upscaling" name="ImageScale" output=[IMAGE] */
         ImageScale(p: ImageScale_input, meta?: ComfyNodeMetadata): ImageScale
          /** category="image_upscaling" name="ImageScaleBy" output=[IMAGE] */
         ImageScaleBy(p: ImageScaleBy_input, meta?: ComfyNodeMetadata): ImageScaleBy
          /** category="image" name="ImageInvert" output=[IMAGE] */
         ImageInvert(p: ImageInvert_input, meta?: ComfyNodeMetadata): ImageInvert
          /** category="image" name="ImageBatch" output=[IMAGE] */
         ImageBatch(p: ImageBatch_input, meta?: ComfyNodeMetadata): ImageBatch
          /** category="image" name="ImagePadForOutpaint" output=[IMAGE, MASK] */
         ImagePadForOutpaint(p: ImagePadForOutpaint_input, meta?: ComfyNodeMetadata): ImagePadForOutpaint
          /** category="image" name="EmptyImage" output=[IMAGE] */
         EmptyImage(p: EmptyImage_input, meta?: ComfyNodeMetadata): EmptyImage
          /** category="conditioning" name="ConditioningAverage" output=[CONDITIONING] */
         ConditioningAverage(p: ConditioningAverage_input, meta?: ComfyNodeMetadata): ConditioningAverage
          /** category="conditioning" name="ConditioningCombine" output=[CONDITIONING] */
         ConditioningCombine(p: ConditioningCombine_input, meta?: ComfyNodeMetadata): ConditioningCombine
          /** category="conditioning" name="ConditioningConcat" output=[CONDITIONING] */
         ConditioningConcat(p: ConditioningConcat_input, meta?: ComfyNodeMetadata): ConditioningConcat
          /** category="conditioning" name="ConditioningSetArea" output=[CONDITIONING] */
         ConditioningSetArea(p: ConditioningSetArea_input, meta?: ComfyNodeMetadata): ConditioningSetArea
          /** category="conditioning" name="ConditioningSetAreaPercentage" output=[CONDITIONING] */
         ConditioningSetAreaPercentage(p: ConditioningSetAreaPercentage_input, meta?: ComfyNodeMetadata): ConditioningSetAreaPercentage
          /** category="conditioning" name="ConditioningSetAreaStrength" output=[CONDITIONING] */
         ConditioningSetAreaStrength(p: ConditioningSetAreaStrength_input, meta?: ComfyNodeMetadata): ConditioningSetAreaStrength
          /** category="conditioning" name="ConditioningSetMask" output=[CONDITIONING] */
         ConditioningSetMask(p: ConditioningSetMask_input, meta?: ComfyNodeMetadata): ConditioningSetMask
          /** category="sampling" name="KSamplerAdvanced" output=[LATENT] */
         KSamplerAdvanced(p: KSamplerAdvanced_input, meta?: ComfyNodeMetadata): KSamplerAdvanced
          /** category="latent_inpaint" name="SetLatentNoiseMask" output=[LATENT] */
         SetLatentNoiseMask(p: SetLatentNoiseMask_input, meta?: ComfyNodeMetadata): SetLatentNoiseMask
          /** category="latent" name="LatentComposite" output=[LATENT] */
         LatentComposite(p: LatentComposite_input, meta?: ComfyNodeMetadata): LatentComposite
          /** category="_for_testing" name="LatentBlend" output=[LATENT] */
         LatentBlend(p: LatentBlend_input, meta?: ComfyNodeMetadata): LatentBlend
          /** category="latent_transform" name="LatentRotate" output=[LATENT] */
         LatentRotate(p: LatentRotate_input, meta?: ComfyNodeMetadata): LatentRotate
          /** category="latent_transform" name="LatentFlip" output=[LATENT] */
         LatentFlip(p: LatentFlip_input, meta?: ComfyNodeMetadata): LatentFlip
          /** category="latent_transform" name="LatentCrop" output=[LATENT] */
         LatentCrop(p: LatentCrop_input, meta?: ComfyNodeMetadata): LatentCrop
         /**
          * LoRAs are used to modify diffusion and CLIP models, altering the way in which latents are denoised such as applying styles. Multiple LoRA nodes can be linked together.
          * category="loaders" name="LoraLoader" output=[MODEL, CLIP]
         **/
         LoraLoader(p: LoraLoader_input, meta?: ComfyNodeMetadata): LoraLoader
          /** category="advanced_loaders" name="CLIPLoader" output=[CLIP] */
         CLIPLoader(p: CLIPLoader_input, meta?: ComfyNodeMetadata): CLIPLoader
          /** category="advanced_loaders" name="UNETLoader" output=[MODEL] */
         UNETLoader(p: UNETLoader_input, meta?: ComfyNodeMetadata): UNETLoader
          /** category="advanced_loaders" name="DualCLIPLoader" output=[CLIP] */
         DualCLIPLoader(p: DualCLIPLoader_input, meta?: ComfyNodeMetadata): DualCLIPLoader
          /** category="conditioning" name="CLIPVisionEncode" output=[CLIP_VISION_OUTPUT] */
         CLIPVisionEncode(p: CLIPVisionEncode_input, meta?: ComfyNodeMetadata): CLIPVisionEncode
          /** category="conditioning_style_model" name="StyleModelApply" output=[CONDITIONING] */
         StyleModelApply(p: StyleModelApply_input, meta?: ComfyNodeMetadata): StyleModelApply
          /** category="conditioning" name="unCLIPConditioning" output=[CONDITIONING] */
         unCLIPConditioning(p: unCLIPConditioning_input, meta?: ComfyNodeMetadata): unCLIPConditioning
          /** category="conditioning_controlnet" name="ControlNetApply" output=[CONDITIONING] */
         ControlNetApply(p: ControlNetApply_input, meta?: ComfyNodeMetadata): ControlNetApply
          /** category="conditioning_controlnet" name="ControlNetApplyAdvanced" output=[positive, negative] */
         ControlNetApplyAdvanced(p: ControlNetApplyAdvanced_input, meta?: ComfyNodeMetadata): ControlNetApplyAdvanced
          /** category="loaders" name="ControlNetLoader" output=[CONTROL_NET] */
         ControlNetLoader(p: ControlNetLoader_input, meta?: ComfyNodeMetadata): ControlNetLoader
          /** category="loaders" name="DiffControlNetLoader" output=[CONTROL_NET] */
         DiffControlNetLoader(p: DiffControlNetLoader_input, meta?: ComfyNodeMetadata): DiffControlNetLoader
          /** category="loaders" name="StyleModelLoader" output=[STYLE_MODEL] */
         StyleModelLoader(p: StyleModelLoader_input, meta?: ComfyNodeMetadata): StyleModelLoader
          /** category="loaders" name="CLIPVisionLoader" output=[CLIP_VISION] */
         CLIPVisionLoader(p: CLIPVisionLoader_input, meta?: ComfyNodeMetadata): CLIPVisionLoader
          /** category="_for_testing" name="VAEDecodeTiled" output=[IMAGE] */
         VAEDecodeTiled(p: VAEDecodeTiled_input, meta?: ComfyNodeMetadata): VAEDecodeTiled
          /** category="_for_testing" name="VAEEncodeTiled" output=[LATENT] */
         VAEEncodeTiled(p: VAEEncodeTiled_input, meta?: ComfyNodeMetadata): VAEEncodeTiled
          /** category="loaders" name="unCLIPCheckpointLoader" output=[MODEL, CLIP, VAE, CLIP_VISION] */
         unCLIPCheckpointLoader(p: unCLIPCheckpointLoader_input, meta?: ComfyNodeMetadata): unCLIPCheckpointLoader
          /** category="loaders" name="GLIGENLoader" output=[GLIGEN] */
         GLIGENLoader(p: GLIGENLoader_input, meta?: ComfyNodeMetadata): GLIGENLoader
          /** category="conditioning_gligen" name="GLIGENTextBoxApply" output=[CONDITIONING] */
         GLIGENTextBoxApply(p: GLIGENTextBoxApply_input, meta?: ComfyNodeMetadata): GLIGENTextBoxApply
          /** category="conditioning_inpaint" name="InpaintModelConditioning" output=[positive, negative, latent] */
         InpaintModelConditioning(p: InpaintModelConditioning_input, meta?: ComfyNodeMetadata): InpaintModelConditioning
          /** category="advanced_loaders" name="CheckpointLoader" output=[MODEL, CLIP, VAE] */
         CheckpointLoader(p: CheckpointLoader_input, meta?: ComfyNodeMetadata): CheckpointLoader
          /** category="advanced_loaders_deprecated" name="DiffusersLoader" output=[MODEL, CLIP, VAE] */
         DiffusersLoader(p: DiffusersLoader_input, meta?: ComfyNodeMetadata): DiffusersLoader
          /** category="_for_testing" name="LoadLatent" output=[LATENT] */
         LoadLatent(p: LoadLatent_input, meta?: ComfyNodeMetadata): LoadLatent
          /** category="_for_testing" name="SaveLatent" output=[] */
         SaveLatent(p: SaveLatent_input, meta?: ComfyNodeMetadata): SaveLatent
          /** category="advanced_conditioning" name="ConditioningZeroOut" output=[CONDITIONING] */
         ConditioningZeroOut(p: ConditioningZeroOut_input, meta?: ComfyNodeMetadata): ConditioningZeroOut
          /** category="advanced_conditioning" name="ConditioningSetTimestepRange" output=[CONDITIONING] */
         ConditioningSetTimestepRange(p: ConditioningSetTimestepRange_input, meta?: ComfyNodeMetadata): ConditioningSetTimestepRange
         /**
          * LoRAs are used to modify diffusion and CLIP models, altering the way in which latents are denoised such as applying styles. Multiple LoRA nodes can be linked together.
          * category="loaders" name="LoraLoaderModelOnly" output=[MODEL]
         **/
         LoraLoaderModelOnly(p: LoraLoaderModelOnly_input, meta?: ComfyNodeMetadata): LoraLoaderModelOnly
         /**
          * This is a test node
          * category="test" name="UnknownNodeXX" output=[]
         **/
         UnknownNodeXX(p: UnknownNodeXX_input, meta?: ComfyNodeMetadata): UnknownNodeXX
      }
      interface KSampler extends HasSingle_LATENT, ComfyNode<KSampler_input, KSampler_output> {
          nameInComfy: "KSampler"
      }
      interface KSampler_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface KSampler_input {
          /** */
          model: Comfy.Input.MODEL
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 step=0.1 */
          cfg?: Comfy.Input.FLOAT
          /** */
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          /** */
          scheduler: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325
          /** */
          positive: Comfy.Input.CONDITIONING
          /** */
          negative: Comfy.Input.CONDITIONING
          /** */
          latent_image: Comfy.Input.LATENT
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
      }
      interface CheckpointLoaderSimple extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<CheckpointLoaderSimple_input, CheckpointLoaderSimple_output> {
          nameInComfy: "CheckpointLoaderSimple"
      }
      interface CheckpointLoaderSimple_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
          CLIP: ComfyNodeOutput<'CLIP', 1>,
          VAE: ComfyNodeOutput<'VAE', 2>,
      }
      interface CheckpointLoaderSimple_input {
          /** */
          ckpt_name: Comfy.Union.E_1f08f73a9a576ae570aa3d82ea94f2bcfc29a8fc
      }
      interface CLIPTextEncode extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncode_input, CLIPTextEncode_output> {
          nameInComfy: "CLIPTextEncode"
      }
      interface CLIPTextEncode_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface CLIPTextEncode_input {
          /** */
          text: Comfy.Input.STRING
          /** */
          clip: Comfy.Input.CLIP
      }
      interface CLIPSetLastLayer extends HasSingle_CLIP, ComfyNode<CLIPSetLastLayer_input, CLIPSetLastLayer_output> {
          nameInComfy: "CLIPSetLastLayer"
      }
      interface CLIPSetLastLayer_output {
          CLIP: ComfyNodeOutput<'CLIP', 0>,
      }
      interface CLIPSetLastLayer_input {
          clip: Comfy.Input.CLIP
          /** default=-1 min=-1 max=-1 step=1 */
          stop_at_clip_layer?: Comfy.Input.INT
      }
      interface VAEDecode extends HasSingle_IMAGE, ComfyNode<VAEDecode_input, VAEDecode_output> {
          nameInComfy: "VAEDecode"
      }
      interface VAEDecode_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface VAEDecode_input {
          /** */
          samples: Comfy.Input.LATENT
          /** */
          vae: Comfy.Input.VAE
      }
      interface VAEEncode extends HasSingle_LATENT, ComfyNode<VAEEncode_input, VAEEncode_output> {
          nameInComfy: "VAEEncode"
      }
      interface VAEEncode_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface VAEEncode_input {
          pixels: Comfy.Input.IMAGE
          vae: Comfy.Input.VAE
      }
      interface VAEEncodeForInpaint extends HasSingle_LATENT, ComfyNode<VAEEncodeForInpaint_input, VAEEncodeForInpaint_output> {
          nameInComfy: "VAEEncodeForInpaint"
      }
      interface VAEEncodeForInpaint_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface VAEEncodeForInpaint_input {
          pixels: Comfy.Input.IMAGE
          vae: Comfy.Input.VAE
          mask: Comfy.Input.MASK
          /** default=6 min=64 max=64 step=1 */
          grow_mask_by?: Comfy.Input.INT
      }
      interface VAELoader extends HasSingle_VAE, ComfyNode<VAELoader_input, VAELoader_output> {
          nameInComfy: "VAELoader"
      }
      interface VAELoader_output {
          VAE: ComfyNodeOutput<'VAE', 0>,
      }
      interface VAELoader_input {
          vae_name: Comfy.Union.E_621a1d2d13812defa70c4b6ec953d17713bd232a
      }
      interface EmptyLatentImage extends HasSingle_LATENT, ComfyNode<EmptyLatentImage_input, EmptyLatentImage_output> {
          nameInComfy: "EmptyLatentImage"
      }
      interface EmptyLatentImage_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface EmptyLatentImage_input {
          /** default=512 min=16384 max=16384 step=8 */
          width?: Comfy.Input.INT
          /** default=512 min=16384 max=16384 step=8 */
          height?: Comfy.Input.INT
          /** default=1 min=4096 max=4096 */
          batch_size?: Comfy.Input.INT
      }
      interface LatentUpscale extends HasSingle_LATENT, ComfyNode<LatentUpscale_input, LatentUpscale_output> {
          nameInComfy: "LatentUpscale"
      }
      interface LatentUpscale_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentUpscale_input {
          samples: Comfy.Input.LATENT
          upscale_method: Comfy.Union.E_6e6cbf6c48411ad480e010b0c9d2434b41af430d
          /** default=512 min=16384 max=16384 step=8 */
          width?: Comfy.Input.INT
          /** default=512 min=16384 max=16384 step=8 */
          height?: Comfy.Input.INT
          crop: Comfy.Union.E_e2779c2a162ed54d5841127cc2968e8d50f5e431
      }
      interface LatentUpscaleBy extends HasSingle_LATENT, ComfyNode<LatentUpscaleBy_input, LatentUpscaleBy_output> {
          nameInComfy: "LatentUpscaleBy"
      }
      interface LatentUpscaleBy_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentUpscaleBy_input {
          samples: Comfy.Input.LATENT
          upscale_method: Comfy.Union.E_6e6cbf6c48411ad480e010b0c9d2434b41af430d
          /** default=1.5 min=8 max=8 step=0.01 */
          scale_by?: Comfy.Input.FLOAT
      }
      interface LatentFromBatch extends HasSingle_LATENT, ComfyNode<LatentFromBatch_input, LatentFromBatch_output> {
          nameInComfy: "LatentFromBatch"
      }
      interface LatentFromBatch_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentFromBatch_input {
          samples: Comfy.Input.LATENT
          /** default=0 min=63 max=63 */
          batch_index?: Comfy.Input.INT
          /** default=1 min=64 max=64 */
          length?: Comfy.Input.INT
      }
      interface RepeatLatentBatch extends HasSingle_LATENT, ComfyNode<RepeatLatentBatch_input, RepeatLatentBatch_output> {
          nameInComfy: "RepeatLatentBatch"
      }
      interface RepeatLatentBatch_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface RepeatLatentBatch_input {
          samples: Comfy.Input.LATENT
          /** default=1 min=64 max=64 */
          amount?: Comfy.Input.INT
      }
      interface SaveImage extends ComfyNode<SaveImage_input, SaveImage_output> {
          nameInComfy: "SaveImage"
      }
      interface SaveImage_output {
      }
      interface SaveImage_input {
          /** */
          images: Comfy.Input.IMAGE
          /** default="ComfyUI" */
          filename_prefix?: Comfy.Input.STRING
      }
      interface PreviewImage extends ComfyNode<PreviewImage_input, PreviewImage_output> {
          nameInComfy: "PreviewImage"
      }
      interface PreviewImage_output {
      }
      interface PreviewImage_input {
          images: Comfy.Input.IMAGE
      }
      interface LoadImage extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<LoadImage_input, LoadImage_output> {
          nameInComfy: "LoadImage"
      }
      interface LoadImage_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
          MASK: ComfyNodeOutput<'MASK', 1>,
      }
      interface LoadImage_input {
          /** */
          image: Comfy.Union.E_26ea5ad8c44c9551fea858fff18017427386b591
      }
      interface LoadImageMask extends HasSingle_MASK, ComfyNode<LoadImageMask_input, LoadImageMask_output> {
          nameInComfy: "LoadImageMask"
      }
      interface LoadImageMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface LoadImageMask_input {
          /** */
          image: Comfy.Union.E_26ea5ad8c44c9551fea858fff18017427386b591
          channel: Comfy.Union.E_19d5be39f1fd20a88fdbcb009a06c7df2b0ef998
      }
      interface ImageScale extends HasSingle_IMAGE, ComfyNode<ImageScale_input, ImageScale_output> {
          nameInComfy: "ImageScale"
      }
      interface ImageScale_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageScale_input {
          image: Comfy.Input.IMAGE
          upscale_method: Comfy.Union.E_165b455eb22956fc9da6e1b76d49a4077f15d897
          /** default=512 min=16384 max=16384 step=1 */
          width?: Comfy.Input.INT
          /** default=512 min=16384 max=16384 step=1 */
          height?: Comfy.Input.INT
          crop: Comfy.Union.E_e2779c2a162ed54d5841127cc2968e8d50f5e431
      }
      interface ImageScaleBy extends HasSingle_IMAGE, ComfyNode<ImageScaleBy_input, ImageScaleBy_output> {
          nameInComfy: "ImageScaleBy"
      }
      interface ImageScaleBy_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageScaleBy_input {
          image: Comfy.Input.IMAGE
          upscale_method: Comfy.Union.E_165b455eb22956fc9da6e1b76d49a4077f15d897
          /** default=1 min=8 max=8 step=0.01 */
          scale_by?: Comfy.Input.FLOAT
      }
      interface ImageInvert extends HasSingle_IMAGE, ComfyNode<ImageInvert_input, ImageInvert_output> {
          nameInComfy: "ImageInvert"
      }
      interface ImageInvert_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageInvert_input {
          image: Comfy.Input.IMAGE
      }
      interface ImageBatch extends HasSingle_IMAGE, ComfyNode<ImageBatch_input, ImageBatch_output> {
          nameInComfy: "ImageBatch"
      }
      interface ImageBatch_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageBatch_input {
          image1: Comfy.Input.IMAGE
          image2: Comfy.Input.IMAGE
      }
      interface ImagePadForOutpaint extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImagePadForOutpaint_input, ImagePadForOutpaint_output> {
          nameInComfy: "ImagePadForOutpaint"
      }
      interface ImagePadForOutpaint_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
          MASK: ComfyNodeOutput<'MASK', 1>,
      }
      interface ImagePadForOutpaint_input {
          image: Comfy.Input.IMAGE
          /** default=0 min=16384 max=16384 step=8 */
          left?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=8 */
          top?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=8 */
          right?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=8 */
          bottom?: Comfy.Input.INT
          /** default=40 min=16384 max=16384 step=1 */
          feathering?: Comfy.Input.INT
      }
      interface EmptyImage extends HasSingle_IMAGE, ComfyNode<EmptyImage_input, EmptyImage_output> {
          nameInComfy: "EmptyImage"
      }
      interface EmptyImage_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface EmptyImage_input {
          /** default=512 min=16384 max=16384 step=1 */
          width?: Comfy.Input.INT
          /** default=512 min=16384 max=16384 step=1 */
          height?: Comfy.Input.INT
          /** default=1 min=4096 max=4096 */
          batch_size?: Comfy.Input.INT
          /** default=0 min=16777215 max=16777215 step=1 */
          color?: Comfy.Input.INT
      }
      interface ConditioningAverage extends HasSingle_CONDITIONING, ComfyNode<ConditioningAverage_input, ConditioningAverage_output> {
          nameInComfy: "ConditioningAverage"
      }
      interface ConditioningAverage_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface ConditioningAverage_input {
          conditioning_to: Comfy.Input.CONDITIONING
          conditioning_from: Comfy.Input.CONDITIONING
          /** default=1 min=1 max=1 step=0.01 */
          conditioning_to_strength?: Comfy.Input.FLOAT
      }
      interface ConditioningCombine extends HasSingle_CONDITIONING, ComfyNode<ConditioningCombine_input, ConditioningCombine_output> {
          nameInComfy: "ConditioningCombine"
      }
      interface ConditioningCombine_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface ConditioningCombine_input {
          conditioning_1: Comfy.Input.CONDITIONING
          conditioning_2: Comfy.Input.CONDITIONING
      }
      interface ConditioningConcat extends HasSingle_CONDITIONING, ComfyNode<ConditioningConcat_input, ConditioningConcat_output> {
          nameInComfy: "ConditioningConcat"
      }
      interface ConditioningConcat_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface ConditioningConcat_input {
          conditioning_to: Comfy.Input.CONDITIONING
          conditioning_from: Comfy.Input.CONDITIONING
      }
      interface ConditioningSetArea extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetArea_input, ConditioningSetArea_output> {
          nameInComfy: "ConditioningSetArea"
      }
      interface ConditioningSetArea_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface ConditioningSetArea_input {
          conditioning: Comfy.Input.CONDITIONING
          /** default=64 min=16384 max=16384 step=8 */
          width?: Comfy.Input.INT
          /** default=64 min=16384 max=16384 step=8 */
          height?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=8 */
          x?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=8 */
          y?: Comfy.Input.INT
          /** default=1 min=10 max=10 step=0.01 */
          strength?: Comfy.Input.FLOAT
      }
      interface ConditioningSetAreaPercentage extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetAreaPercentage_input, ConditioningSetAreaPercentage_output> {
          nameInComfy: "ConditioningSetAreaPercentage"
      }
      interface ConditioningSetAreaPercentage_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface ConditioningSetAreaPercentage_input {
          conditioning: Comfy.Input.CONDITIONING
          /** default=1 min=1 max=1 step=0.01 */
          width?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          height?: Comfy.Input.FLOAT
          /** default=0 min=1 max=1 step=0.01 */
          x?: Comfy.Input.FLOAT
          /** default=0 min=1 max=1 step=0.01 */
          y?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          strength?: Comfy.Input.FLOAT
      }
      interface ConditioningSetAreaStrength extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetAreaStrength_input, ConditioningSetAreaStrength_output> {
          nameInComfy: "ConditioningSetAreaStrength"
      }
      interface ConditioningSetAreaStrength_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface ConditioningSetAreaStrength_input {
          conditioning: Comfy.Input.CONDITIONING
          /** default=1 min=10 max=10 step=0.01 */
          strength?: Comfy.Input.FLOAT
      }
      interface ConditioningSetMask extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetMask_input, ConditioningSetMask_output> {
          nameInComfy: "ConditioningSetMask"
      }
      interface ConditioningSetMask_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface ConditioningSetMask_input {
          conditioning: Comfy.Input.CONDITIONING
          mask: Comfy.Input.MASK
          /** default=1 min=10 max=10 step=0.01 */
          strength?: Comfy.Input.FLOAT
          set_cond_area: Comfy.Union.E_046ed3ef4b2b9a9cfdb62e53a70fe767fb996451
      }
      interface KSamplerAdvanced extends HasSingle_LATENT, ComfyNode<KSamplerAdvanced_input, KSamplerAdvanced_output> {
          nameInComfy: "KSamplerAdvanced"
      }
      interface KSamplerAdvanced_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface KSamplerAdvanced_input {
          model: Comfy.Input.MODEL
          add_noise: Comfy.Union.E_449b4cae3566dd9b97c417c352bb08e25b89431b
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          noise_seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 step=0.1 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          latent_image: Comfy.Input.LATENT
          /** default=0 min=10000 max=10000 */
          start_at_step?: Comfy.Input.INT
          /** default=10000 min=10000 max=10000 */
          end_at_step?: Comfy.Input.INT
          return_with_leftover_noise: Comfy.Union.E_449b4cae3566dd9b97c417c352bb08e25b89431b
      }
      interface SetLatentNoiseMask extends HasSingle_LATENT, ComfyNode<SetLatentNoiseMask_input, SetLatentNoiseMask_output> {
          nameInComfy: "SetLatentNoiseMask"
      }
      interface SetLatentNoiseMask_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface SetLatentNoiseMask_input {
          samples: Comfy.Input.LATENT
          mask: Comfy.Input.MASK
      }
      interface LatentComposite extends HasSingle_LATENT, ComfyNode<LatentComposite_input, LatentComposite_output> {
          nameInComfy: "LatentComposite"
      }
      interface LatentComposite_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentComposite_input {
          samples_to: Comfy.Input.LATENT
          samples_from: Comfy.Input.LATENT
          /** default=0 min=16384 max=16384 step=8 */
          x?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=8 */
          y?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=8 */
          feather?: Comfy.Input.INT
      }
      interface LatentBlend extends HasSingle_LATENT, ComfyNode<LatentBlend_input, LatentBlend_output> {
          nameInComfy: "LatentBlend"
      }
      interface LatentBlend_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentBlend_input {
          samples1: Comfy.Input.LATENT
          samples2: Comfy.Input.LATENT
          /** default=0.5 min=1 max=1 step=0.01 */
          blend_factor?: Comfy.Input.FLOAT
      }
      interface LatentRotate extends HasSingle_LATENT, ComfyNode<LatentRotate_input, LatentRotate_output> {
          nameInComfy: "LatentRotate"
      }
      interface LatentRotate_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentRotate_input {
          samples: Comfy.Input.LATENT
          rotation: Comfy.Union.E_061551528c540e0171a9c88a94c7d5375aa31f8a
      }
      interface LatentFlip extends HasSingle_LATENT, ComfyNode<LatentFlip_input, LatentFlip_output> {
          nameInComfy: "LatentFlip"
      }
      interface LatentFlip_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentFlip_input {
          samples: Comfy.Input.LATENT
          flip_method: Comfy.Union.E_cdf7071acecb5016da941b6e718b82c97248a3e4
      }
      interface LatentCrop extends HasSingle_LATENT, ComfyNode<LatentCrop_input, LatentCrop_output> {
          nameInComfy: "LatentCrop"
      }
      interface LatentCrop_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentCrop_input {
          samples: Comfy.Input.LATENT
          /** default=512 min=16384 max=16384 step=8 */
          width?: Comfy.Input.INT
          /** default=512 min=16384 max=16384 step=8 */
          height?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=8 */
          x?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=8 */
          y?: Comfy.Input.INT
      }
      interface LoraLoader extends HasSingle_MODEL, HasSingle_CLIP, ComfyNode<LoraLoader_input, LoraLoader_output> {
          nameInComfy: "LoraLoader"
      }
      interface LoraLoader_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
          CLIP: ComfyNodeOutput<'CLIP', 1>,
      }
      interface LoraLoader_input {
          /** */
          model: Comfy.Input.MODEL
          /** */
          clip: Comfy.Input.CLIP
          /** */
          lora_name: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
          /** default=1 min=100 max=100 step=0.01 */
          strength_model?: Comfy.Input.FLOAT
          /** default=1 min=100 max=100 step=0.01 */
          strength_clip?: Comfy.Input.FLOAT
      }
      interface CLIPLoader extends HasSingle_CLIP, ComfyNode<CLIPLoader_input, CLIPLoader_output> {
          nameInComfy: "CLIPLoader"
      }
      interface CLIPLoader_output {
          CLIP: ComfyNodeOutput<'CLIP', 0>,
      }
      interface CLIPLoader_input {
          clip_name: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
          type: Comfy.Union.E_766fb79b4f3904a6716246cfb2a33b7b9e6a08c4
      }
      interface UNETLoader extends HasSingle_MODEL, ComfyNode<UNETLoader_input, UNETLoader_output> {
          nameInComfy: "UNETLoader"
      }
      interface UNETLoader_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface UNETLoader_input {
          unet_name: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
          weight_dtype: Comfy.Union.E_21ba65fbb0df707c108b25356a3507e13f21ea58
      }
      interface DualCLIPLoader extends HasSingle_CLIP, ComfyNode<DualCLIPLoader_input, DualCLIPLoader_output> {
          nameInComfy: "DualCLIPLoader"
      }
      interface DualCLIPLoader_output {
          CLIP: ComfyNodeOutput<'CLIP', 0>,
      }
      interface DualCLIPLoader_input {
          clip_name1: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
          clip_name2: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
          type: Comfy.Union.E_39292df8ce88fd66f0dacf6f9110cfa2594ca25c
      }
      interface CLIPVisionEncode extends HasSingle_CLIP_VISION_OUTPUT, ComfyNode<CLIPVisionEncode_input, CLIPVisionEncode_output> {
          nameInComfy: "CLIPVisionEncode"
      }
      interface CLIPVisionEncode_output {
          CLIP_VISION_OUTPUT: ComfyNodeOutput<'CLIP_VISION_OUTPUT', 0>,
      }
      interface CLIPVisionEncode_input {
          clip_vision: Comfy.Input.CLIP_VISION
          image: Comfy.Input.IMAGE
      }
      interface StyleModelApply extends HasSingle_CONDITIONING, ComfyNode<StyleModelApply_input, StyleModelApply_output> {
          nameInComfy: "StyleModelApply"
      }
      interface StyleModelApply_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface StyleModelApply_input {
          conditioning: Comfy.Input.CONDITIONING
          style_model: Comfy.Input.STYLE_MODEL
          clip_vision_output: Comfy.Input.CLIP_VISION_OUTPUT
      }
      interface unCLIPConditioning extends HasSingle_CONDITIONING, ComfyNode<unCLIPConditioning_input, unCLIPConditioning_output> {
          nameInComfy: "unCLIPConditioning"
      }
      interface unCLIPConditioning_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface unCLIPConditioning_input {
          conditioning: Comfy.Input.CONDITIONING
          clip_vision_output: Comfy.Input.CLIP_VISION_OUTPUT
          /** default=1 min=10 max=10 step=0.01 */
          strength?: Comfy.Input.FLOAT
          /** default=0 min=1 max=1 step=0.01 */
          noise_augmentation?: Comfy.Input.FLOAT
      }
      interface ControlNetApply extends HasSingle_CONDITIONING, ComfyNode<ControlNetApply_input, ControlNetApply_output> {
          nameInComfy: "ControlNetApply"
      }
      interface ControlNetApply_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface ControlNetApply_input {
          conditioning: Comfy.Input.CONDITIONING
          control_net: Comfy.Input.CONTROL_NET
          image: Comfy.Input.IMAGE
          /** default=1 min=10 max=10 step=0.01 */
          strength?: Comfy.Input.FLOAT
      }
      interface ControlNetApplyAdvanced extends ComfyNode<ControlNetApplyAdvanced_input, ControlNetApplyAdvanced_output> {
          nameInComfy: "ControlNetApplyAdvanced"
      }
      interface ControlNetApplyAdvanced_output {
          positive: ComfyNodeOutput<'CONDITIONING', 0>,
          negative: ComfyNodeOutput<'CONDITIONING', 1>,
      }
      interface ControlNetApplyAdvanced_input {
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          control_net: Comfy.Input.CONTROL_NET
          image: Comfy.Input.IMAGE
          /** default=1 min=10 max=10 step=0.01 */
          strength?: Comfy.Input.FLOAT
          /** default=0 min=1 max=1 step=0.001 */
          start_percent?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.001 */
          end_percent?: Comfy.Input.FLOAT
          vae?: Comfy.Input.VAE
      }
      interface ControlNetLoader extends HasSingle_CONTROL_NET, ComfyNode<ControlNetLoader_input, ControlNetLoader_output> {
          nameInComfy: "ControlNetLoader"
      }
      interface ControlNetLoader_output {
          CONTROL_NET: ComfyNodeOutput<'CONTROL_NET', 0>,
      }
      interface ControlNetLoader_input {
          control_net_name: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
      }
      interface DiffControlNetLoader extends HasSingle_CONTROL_NET, ComfyNode<DiffControlNetLoader_input, DiffControlNetLoader_output> {
          nameInComfy: "DiffControlNetLoader"
      }
      interface DiffControlNetLoader_output {
          CONTROL_NET: ComfyNodeOutput<'CONTROL_NET', 0>,
      }
      interface DiffControlNetLoader_input {
          model: Comfy.Input.MODEL
          control_net_name: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
      }
      interface StyleModelLoader extends HasSingle_STYLE_MODEL, ComfyNode<StyleModelLoader_input, StyleModelLoader_output> {
          nameInComfy: "StyleModelLoader"
      }
      interface StyleModelLoader_output {
          STYLE_MODEL: ComfyNodeOutput<'STYLE_MODEL', 0>,
      }
      interface StyleModelLoader_input {
          style_model_name: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
      }
      interface CLIPVisionLoader extends HasSingle_CLIP_VISION, ComfyNode<CLIPVisionLoader_input, CLIPVisionLoader_output> {
          nameInComfy: "CLIPVisionLoader"
      }
      interface CLIPVisionLoader_output {
          CLIP_VISION: ComfyNodeOutput<'CLIP_VISION', 0>,
      }
      interface CLIPVisionLoader_input {
          clip_name: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
      }
      interface VAEDecodeTiled extends HasSingle_IMAGE, ComfyNode<VAEDecodeTiled_input, VAEDecodeTiled_output> {
          nameInComfy: "VAEDecodeTiled"
      }
      interface VAEDecodeTiled_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface VAEDecodeTiled_input {
          samples: Comfy.Input.LATENT
          vae: Comfy.Input.VAE
          /** default=512 min=4096 max=4096 step=64 */
          tile_size?: Comfy.Input.INT
      }
      interface VAEEncodeTiled extends HasSingle_LATENT, ComfyNode<VAEEncodeTiled_input, VAEEncodeTiled_output> {
          nameInComfy: "VAEEncodeTiled"
      }
      interface VAEEncodeTiled_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface VAEEncodeTiled_input {
          pixels: Comfy.Input.IMAGE
          vae: Comfy.Input.VAE
          /** default=512 min=4096 max=4096 step=64 */
          tile_size?: Comfy.Input.INT
      }
      interface unCLIPCheckpointLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, HasSingle_CLIP_VISION, ComfyNode<unCLIPCheckpointLoader_input, unCLIPCheckpointLoader_output> {
          nameInComfy: "unCLIPCheckpointLoader"
      }
      interface unCLIPCheckpointLoader_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
          CLIP: ComfyNodeOutput<'CLIP', 1>,
          VAE: ComfyNodeOutput<'VAE', 2>,
          CLIP_VISION: ComfyNodeOutput<'CLIP_VISION', 3>,
      }
      interface unCLIPCheckpointLoader_input {
          ckpt_name: Comfy.Union.E_1f08f73a9a576ae570aa3d82ea94f2bcfc29a8fc
      }
      interface GLIGENLoader extends HasSingle_GLIGEN, ComfyNode<GLIGENLoader_input, GLIGENLoader_output> {
          nameInComfy: "GLIGENLoader"
      }
      interface GLIGENLoader_output {
          GLIGEN: ComfyNodeOutput<'GLIGEN', 0>,
      }
      interface GLIGENLoader_input {
          gligen_name: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
      }
      interface GLIGENTextBoxApply extends HasSingle_CONDITIONING, ComfyNode<GLIGENTextBoxApply_input, GLIGENTextBoxApply_output> {
          nameInComfy: "GLIGENTextBoxApply"
      }
      interface GLIGENTextBoxApply_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface GLIGENTextBoxApply_input {
          conditioning_to: Comfy.Input.CONDITIONING
          clip: Comfy.Input.CLIP
          gligen_textbox_model: Comfy.Input.GLIGEN
          /** */
          text: Comfy.Input.STRING
          /** default=64 min=16384 max=16384 step=8 */
          width?: Comfy.Input.INT
          /** default=64 min=16384 max=16384 step=8 */
          height?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=8 */
          x?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=8 */
          y?: Comfy.Input.INT
      }
      interface InpaintModelConditioning extends HasSingle_LATENT, ComfyNode<InpaintModelConditioning_input, InpaintModelConditioning_output> {
          nameInComfy: "InpaintModelConditioning"
      }
      interface InpaintModelConditioning_output {
          positive: ComfyNodeOutput<'CONDITIONING', 0>,
          negative: ComfyNodeOutput<'CONDITIONING', 1>,
          latent: ComfyNodeOutput<'LATENT', 2>,
      }
      interface InpaintModelConditioning_input {
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          vae: Comfy.Input.VAE
          pixels: Comfy.Input.IMAGE
          mask: Comfy.Input.MASK
      }
      interface CheckpointLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<CheckpointLoader_input, CheckpointLoader_output> {
          nameInComfy: "CheckpointLoader"
      }
      interface CheckpointLoader_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
          CLIP: ComfyNodeOutput<'CLIP', 1>,
          VAE: ComfyNodeOutput<'VAE', 2>,
      }
      interface CheckpointLoader_input {
          config_name: Comfy.Union.E_a1972c9480c542a0e8ccafa03c2572ba5fc62160
          ckpt_name: Comfy.Union.E_1f08f73a9a576ae570aa3d82ea94f2bcfc29a8fc
      }
      interface DiffusersLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<DiffusersLoader_input, DiffusersLoader_output> {
          nameInComfy: "DiffusersLoader"
      }
      interface DiffusersLoader_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
          CLIP: ComfyNodeOutput<'CLIP', 1>,
          VAE: ComfyNodeOutput<'VAE', 2>,
      }
      interface DiffusersLoader_input {
          model_path: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
      }
      interface LoadLatent extends HasSingle_LATENT, ComfyNode<LoadLatent_input, LoadLatent_output> {
          nameInComfy: "LoadLatent"
      }
      interface LoadLatent_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LoadLatent_input {
          latent: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
      }
      interface SaveLatent extends ComfyNode<SaveLatent_input, SaveLatent_output> {
          nameInComfy: "SaveLatent"
      }
      interface SaveLatent_output {
      }
      interface SaveLatent_input {
          samples: Comfy.Input.LATENT
          /** default="latents/ComfyUI" */
          filename_prefix?: Comfy.Input.STRING
      }
      interface ConditioningZeroOut extends HasSingle_CONDITIONING, ComfyNode<ConditioningZeroOut_input, ConditioningZeroOut_output> {
          nameInComfy: "ConditioningZeroOut"
      }
      interface ConditioningZeroOut_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface ConditioningZeroOut_input {
          conditioning: Comfy.Input.CONDITIONING
      }
      interface ConditioningSetTimestepRange extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetTimestepRange_input, ConditioningSetTimestepRange_output> {
          nameInComfy: "ConditioningSetTimestepRange"
      }
      interface ConditioningSetTimestepRange_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface ConditioningSetTimestepRange_input {
          conditioning: Comfy.Input.CONDITIONING
          /** default=0 min=1 max=1 step=0.001 */
          start?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.001 */
          end?: Comfy.Input.FLOAT
      }
      interface LoraLoaderModelOnly extends HasSingle_MODEL, ComfyNode<LoraLoaderModelOnly_input, LoraLoaderModelOnly_output> {
          nameInComfy: "LoraLoaderModelOnly"
      }
      interface LoraLoaderModelOnly_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface LoraLoaderModelOnly_input {
          model: Comfy.Input.MODEL
          lora_name: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
          /** default=1 min=100 max=100 step=0.01 */
          strength_model?: Comfy.Input.FLOAT
      }
      interface UnknownNodeXX extends ComfyNode<UnknownNodeXX_input, UnknownNodeXX_output> {
          nameInComfy: "UnknownNodeXX"
      }
      interface UnknownNodeXX_output {
      }
      interface UnknownNodeXX_input {
      }
   }
   
   // comfy_extras.nodes_latent
   namespace Comfy.Extra.latent {
      interface Nodes {
          /** category="latent_advanced" name="LatentAdd" output=[LATENT] */
         LatentAdd(p: LatentAdd_input, meta?: ComfyNodeMetadata): LatentAdd
          /** category="latent_advanced" name="LatentSubtract" output=[LATENT] */
         LatentSubtract(p: LatentSubtract_input, meta?: ComfyNodeMetadata): LatentSubtract
          /** category="latent_advanced" name="LatentMultiply" output=[LATENT] */
         LatentMultiply(p: LatentMultiply_input, meta?: ComfyNodeMetadata): LatentMultiply
          /** category="latent_advanced" name="LatentInterpolate" output=[LATENT] */
         LatentInterpolate(p: LatentInterpolate_input, meta?: ComfyNodeMetadata): LatentInterpolate
          /** category="latent_batch" name="LatentBatch" output=[LATENT] */
         LatentBatch(p: LatentBatch_input, meta?: ComfyNodeMetadata): LatentBatch
          /** category="latent_advanced" name="LatentBatchSeedBehavior" output=[LATENT] */
         LatentBatchSeedBehavior(p: LatentBatchSeedBehavior_input, meta?: ComfyNodeMetadata): LatentBatchSeedBehavior
          /** category="latent_advanced_operations" name="LatentApplyOperation" output=[LATENT] */
         LatentApplyOperation(p: LatentApplyOperation_input, meta?: ComfyNodeMetadata): LatentApplyOperation
          /** category="latent_advanced_operations" name="LatentApplyOperationCFG" output=[MODEL] */
         LatentApplyOperationCFG(p: LatentApplyOperationCFG_input, meta?: ComfyNodeMetadata): LatentApplyOperationCFG
          /** category="latent_advanced_operations" name="LatentOperationTonemapReinhard" output=[LATENT_OPERATION] */
         LatentOperationTonemapReinhard(p: LatentOperationTonemapReinhard_input, meta?: ComfyNodeMetadata): LatentOperationTonemapReinhard
          /** category="latent_advanced_operations" name="LatentOperationSharpen" output=[LATENT_OPERATION] */
         LatentOperationSharpen(p: LatentOperationSharpen_input, meta?: ComfyNodeMetadata): LatentOperationSharpen
      }
      interface LatentAdd extends HasSingle_LATENT, ComfyNode<LatentAdd_input, LatentAdd_output> {
          nameInComfy: "LatentAdd"
      }
      interface LatentAdd_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentAdd_input {
          samples1: Comfy.Input.LATENT
          samples2: Comfy.Input.LATENT
      }
      interface LatentSubtract extends HasSingle_LATENT, ComfyNode<LatentSubtract_input, LatentSubtract_output> {
          nameInComfy: "LatentSubtract"
      }
      interface LatentSubtract_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentSubtract_input {
          samples1: Comfy.Input.LATENT
          samples2: Comfy.Input.LATENT
      }
      interface LatentMultiply extends HasSingle_LATENT, ComfyNode<LatentMultiply_input, LatentMultiply_output> {
          nameInComfy: "LatentMultiply"
      }
      interface LatentMultiply_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentMultiply_input {
          samples: Comfy.Input.LATENT
          /** default=1 min=10 max=10 step=0.01 */
          multiplier?: Comfy.Input.FLOAT
      }
      interface LatentInterpolate extends HasSingle_LATENT, ComfyNode<LatentInterpolate_input, LatentInterpolate_output> {
          nameInComfy: "LatentInterpolate"
      }
      interface LatentInterpolate_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentInterpolate_input {
          samples1: Comfy.Input.LATENT
          samples2: Comfy.Input.LATENT
          /** default=1 min=1 max=1 step=0.01 */
          ratio?: Comfy.Input.FLOAT
      }
      interface LatentBatch extends HasSingle_LATENT, ComfyNode<LatentBatch_input, LatentBatch_output> {
          nameInComfy: "LatentBatch"
      }
      interface LatentBatch_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentBatch_input {
          samples1: Comfy.Input.LATENT
          samples2: Comfy.Input.LATENT
      }
      interface LatentBatchSeedBehavior extends HasSingle_LATENT, ComfyNode<LatentBatchSeedBehavior_input, LatentBatchSeedBehavior_output> {
          nameInComfy: "LatentBatchSeedBehavior"
      }
      interface LatentBatchSeedBehavior_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentBatchSeedBehavior_input {
          samples: Comfy.Input.LATENT
          /** default="fixed" */
          seed_behavior?: Comfy.Union.E_1d09df0c3ce1b4556d07af26e593d4033efc639b
      }
      interface LatentApplyOperation extends HasSingle_LATENT, ComfyNode<LatentApplyOperation_input, LatentApplyOperation_output> {
          nameInComfy: "LatentApplyOperation"
      }
      interface LatentApplyOperation_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentApplyOperation_input {
          samples: Comfy.Input.LATENT
          operation: Comfy.Input.LATENT_OPERATION
      }
      interface LatentApplyOperationCFG extends HasSingle_MODEL, ComfyNode<LatentApplyOperationCFG_input, LatentApplyOperationCFG_output> {
          nameInComfy: "LatentApplyOperationCFG"
      }
      interface LatentApplyOperationCFG_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface LatentApplyOperationCFG_input {
          model: Comfy.Input.MODEL
          operation: Comfy.Input.LATENT_OPERATION
      }
      interface LatentOperationTonemapReinhard extends HasSingle_LATENT_OPERATION, ComfyNode<LatentOperationTonemapReinhard_input, LatentOperationTonemapReinhard_output> {
          nameInComfy: "LatentOperationTonemapReinhard"
      }
      interface LatentOperationTonemapReinhard_output {
          LATENT_OPERATION: ComfyNodeOutput<'LATENT_OPERATION', 0>,
      }
      interface LatentOperationTonemapReinhard_input {
          /** default=1 min=100 max=100 step=0.01 */
          multiplier?: Comfy.Input.FLOAT
      }
      interface LatentOperationSharpen extends HasSingle_LATENT_OPERATION, ComfyNode<LatentOperationSharpen_input, LatentOperationSharpen_output> {
          nameInComfy: "LatentOperationSharpen"
      }
      interface LatentOperationSharpen_output {
          LATENT_OPERATION: ComfyNodeOutput<'LATENT_OPERATION', 0>,
      }
      interface LatentOperationSharpen_input {
          /** default=9 min=31 max=31 step=1 */
          sharpen_radius?: Comfy.Input.INT
          /** default=1 min=10 max=10 step=0.1 */
          sigma?: Comfy.Input.FLOAT
          /** default=0.1 min=5 max=5 step=0.01 */
          alpha?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_hypernetwork
   namespace Comfy.Extra.hypernetwork {
      interface Nodes {
          /** category="loaders" name="HypernetworkLoader" output=[MODEL] */
         HypernetworkLoader(p: HypernetworkLoader_input, meta?: ComfyNodeMetadata): HypernetworkLoader
      }
      interface HypernetworkLoader extends HasSingle_MODEL, ComfyNode<HypernetworkLoader_input, HypernetworkLoader_output> {
          nameInComfy: "HypernetworkLoader"
      }
      interface HypernetworkLoader_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface HypernetworkLoader_input {
          model: Comfy.Input.MODEL
          hypernetwork_name: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
          /** default=1 min=10 max=10 step=0.01 */
          strength?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_upscale_model
   namespace Comfy.Extra.upscale_model {
      interface Nodes {
          /** category="loaders" name="UpscaleModelLoader" output=[UPSCALE_MODEL] */
         UpscaleModelLoader(p: UpscaleModelLoader_input, meta?: ComfyNodeMetadata): UpscaleModelLoader
          /** category="image_upscaling" name="ImageUpscaleWithModel" output=[IMAGE] */
         ImageUpscaleWithModel(p: ImageUpscaleWithModel_input, meta?: ComfyNodeMetadata): ImageUpscaleWithModel
      }
      interface UpscaleModelLoader extends HasSingle_UPSCALE_MODEL, ComfyNode<UpscaleModelLoader_input, UpscaleModelLoader_output> {
          nameInComfy: "UpscaleModelLoader"
      }
      interface UpscaleModelLoader_output {
          UPSCALE_MODEL: ComfyNodeOutput<'UPSCALE_MODEL', 0>,
      }
      interface UpscaleModelLoader_input {
          model_name: Comfy.Union.E_2504d8563e078c3ed105667cbb6d0ff714d5798b
      }
      interface ImageUpscaleWithModel extends HasSingle_IMAGE, ComfyNode<ImageUpscaleWithModel_input, ImageUpscaleWithModel_output> {
          nameInComfy: "ImageUpscaleWithModel"
      }
      interface ImageUpscaleWithModel_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageUpscaleWithModel_input {
          upscale_model: Comfy.Input.UPSCALE_MODEL
          image: Comfy.Input.IMAGE
      }
   }
   
   // comfy_extras.nodes_post_processing
   namespace Comfy.Extra.post_processing {
      interface Nodes {
          /** category="image_postprocessing" name="ImageBlend" output=[IMAGE] */
         ImageBlend(p: ImageBlend_input, meta?: ComfyNodeMetadata): ImageBlend
          /** category="image_postprocessing" name="ImageBlur" output=[IMAGE] */
         ImageBlur(p: ImageBlur_input, meta?: ComfyNodeMetadata): ImageBlur
          /** category="image_postprocessing" name="ImageQuantize" output=[IMAGE] */
         ImageQuantize(p: ImageQuantize_input, meta?: ComfyNodeMetadata): ImageQuantize
          /** category="image_postprocessing" name="ImageSharpen" output=[IMAGE] */
         ImageSharpen(p: ImageSharpen_input, meta?: ComfyNodeMetadata): ImageSharpen
          /** category="image_upscaling" name="ImageScaleToTotalPixels" output=[IMAGE] */
         ImageScaleToTotalPixels(p: ImageScaleToTotalPixels_input, meta?: ComfyNodeMetadata): ImageScaleToTotalPixels
      }
      interface ImageBlend extends HasSingle_IMAGE, ComfyNode<ImageBlend_input, ImageBlend_output> {
          nameInComfy: "ImageBlend"
      }
      interface ImageBlend_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageBlend_input {
          image1: Comfy.Input.IMAGE
          image2: Comfy.Input.IMAGE
          /** default=0.5 min=1 max=1 step=0.01 */
          blend_factor?: Comfy.Input.FLOAT
          blend_mode: Comfy.Union.E_4ca09d2bc16d4174960bd60a103d4c0911361855
      }
      interface ImageBlur extends HasSingle_IMAGE, ComfyNode<ImageBlur_input, ImageBlur_output> {
          nameInComfy: "ImageBlur"
      }
      interface ImageBlur_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageBlur_input {
          image: Comfy.Input.IMAGE
          /** default=1 min=31 max=31 step=1 */
          blur_radius?: Comfy.Input.INT
          /** default=1 min=10 max=10 step=0.1 */
          sigma?: Comfy.Input.FLOAT
      }
      interface ImageQuantize extends HasSingle_IMAGE, ComfyNode<ImageQuantize_input, ImageQuantize_output> {
          nameInComfy: "ImageQuantize"
      }
      interface ImageQuantize_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageQuantize_input {
          image: Comfy.Input.IMAGE
          /** default=256 min=256 max=256 step=1 */
          colors?: Comfy.Input.INT
          dither: Comfy.Union.E_7c2feaebcf0bbbcda0fe9f3c8cba1cf87002bc0e
      }
      interface ImageSharpen extends HasSingle_IMAGE, ComfyNode<ImageSharpen_input, ImageSharpen_output> {
          nameInComfy: "ImageSharpen"
      }
      interface ImageSharpen_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageSharpen_input {
          image: Comfy.Input.IMAGE
          /** default=1 min=31 max=31 step=1 */
          sharpen_radius?: Comfy.Input.INT
          /** default=1 min=10 max=10 step=0.01 */
          sigma?: Comfy.Input.FLOAT
          /** default=1 min=5 max=5 step=0.01 */
          alpha?: Comfy.Input.FLOAT
      }
      interface ImageScaleToTotalPixels extends HasSingle_IMAGE, ComfyNode<ImageScaleToTotalPixels_input, ImageScaleToTotalPixels_output> {
          nameInComfy: "ImageScaleToTotalPixels"
      }
      interface ImageScaleToTotalPixels_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageScaleToTotalPixels_input {
          image: Comfy.Input.IMAGE
          upscale_method: Comfy.Union.E_165b455eb22956fc9da6e1b76d49a4077f15d897
          /** default=1 min=16 max=16 step=0.01 */
          megapixels?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_mask
   namespace Comfy.Extra.mask {
      interface Nodes {
          /** category="latent" name="LatentCompositeMasked" output=[LATENT] */
         LatentCompositeMasked(p: LatentCompositeMasked_input, meta?: ComfyNodeMetadata): LatentCompositeMasked
          /** category="image" name="ImageCompositeMasked" output=[IMAGE] */
         ImageCompositeMasked(p: ImageCompositeMasked_input, meta?: ComfyNodeMetadata): ImageCompositeMasked
          /** category="mask" name="MaskToImage" output=[IMAGE] */
         MaskToImage(p: MaskToImage_input, meta?: ComfyNodeMetadata): MaskToImage
          /** category="mask" name="ImageToMask" output=[MASK] */
         ImageToMask(p: ImageToMask_input, meta?: ComfyNodeMetadata): ImageToMask
          /** category="mask" name="ImageColorToMask" output=[MASK] */
         ImageColorToMask(p: ImageColorToMask_input, meta?: ComfyNodeMetadata): ImageColorToMask
          /** category="mask" name="SolidMask" output=[MASK] */
         SolidMask(p: SolidMask_input, meta?: ComfyNodeMetadata): SolidMask
          /** category="mask" name="InvertMask" output=[MASK] */
         InvertMask(p: InvertMask_input, meta?: ComfyNodeMetadata): InvertMask
          /** category="mask" name="CropMask" output=[MASK] */
         CropMask(p: CropMask_input, meta?: ComfyNodeMetadata): CropMask
          /** category="mask" name="MaskComposite" output=[MASK] */
         MaskComposite(p: MaskComposite_input, meta?: ComfyNodeMetadata): MaskComposite
          /** category="mask" name="FeatherMask" output=[MASK] */
         FeatherMask(p: FeatherMask_input, meta?: ComfyNodeMetadata): FeatherMask
          /** category="mask" name="GrowMask" output=[MASK] */
         GrowMask(p: GrowMask_input, meta?: ComfyNodeMetadata): GrowMask
          /** category="mask" name="ThresholdMask" output=[MASK] */
         ThresholdMask(p: ThresholdMask_input, meta?: ComfyNodeMetadata): ThresholdMask
      }
      interface LatentCompositeMasked extends HasSingle_LATENT, ComfyNode<LatentCompositeMasked_input, LatentCompositeMasked_output> {
          nameInComfy: "LatentCompositeMasked"
      }
      interface LatentCompositeMasked_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentCompositeMasked_input {
          destination: Comfy.Input.LATENT
          source: Comfy.Input.LATENT
          /** default=0 min=16384 max=16384 step=8 */
          x?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=8 */
          y?: Comfy.Input.INT
          /** default=false */
          resize_source?: Comfy.Input.BOOLEAN
          mask?: Comfy.Input.MASK
      }
      interface ImageCompositeMasked extends HasSingle_IMAGE, ComfyNode<ImageCompositeMasked_input, ImageCompositeMasked_output> {
          nameInComfy: "ImageCompositeMasked"
      }
      interface ImageCompositeMasked_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageCompositeMasked_input {
          destination: Comfy.Input.IMAGE
          source: Comfy.Input.IMAGE
          /** default=0 min=16384 max=16384 step=1 */
          x?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=1 */
          y?: Comfy.Input.INT
          /** default=false */
          resize_source?: Comfy.Input.BOOLEAN
          mask?: Comfy.Input.MASK
      }
      interface MaskToImage extends HasSingle_IMAGE, ComfyNode<MaskToImage_input, MaskToImage_output> {
          nameInComfy: "MaskToImage"
      }
      interface MaskToImage_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface MaskToImage_input {
          mask: Comfy.Input.MASK
      }
      interface ImageToMask extends HasSingle_MASK, ComfyNode<ImageToMask_input, ImageToMask_output> {
          nameInComfy: "ImageToMask"
      }
      interface ImageToMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface ImageToMask_input {
          image: Comfy.Input.IMAGE
          channel: Comfy.Union.E_19d5be39f1fd20a88fdbcb009a06c7df2b0ef998
      }
      interface ImageColorToMask extends HasSingle_MASK, ComfyNode<ImageColorToMask_input, ImageColorToMask_output> {
          nameInComfy: "ImageColorToMask"
      }
      interface ImageColorToMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface ImageColorToMask_input {
          image: Comfy.Input.IMAGE
          /** default=0 min=16777215 max=16777215 step=1 */
          color?: Comfy.Input.INT
      }
      interface SolidMask extends HasSingle_MASK, ComfyNode<SolidMask_input, SolidMask_output> {
          nameInComfy: "SolidMask"
      }
      interface SolidMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface SolidMask_input {
          /** default=1 min=1 max=1 step=0.01 */
          value?: Comfy.Input.FLOAT
          /** default=512 min=16384 max=16384 step=1 */
          width?: Comfy.Input.INT
          /** default=512 min=16384 max=16384 step=1 */
          height?: Comfy.Input.INT
      }
      interface InvertMask extends HasSingle_MASK, ComfyNode<InvertMask_input, InvertMask_output> {
          nameInComfy: "InvertMask"
      }
      interface InvertMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface InvertMask_input {
          mask: Comfy.Input.MASK
      }
      interface CropMask extends HasSingle_MASK, ComfyNode<CropMask_input, CropMask_output> {
          nameInComfy: "CropMask"
      }
      interface CropMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface CropMask_input {
          mask: Comfy.Input.MASK
          /** default=0 min=16384 max=16384 step=1 */
          x?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=1 */
          y?: Comfy.Input.INT
          /** default=512 min=16384 max=16384 step=1 */
          width?: Comfy.Input.INT
          /** default=512 min=16384 max=16384 step=1 */
          height?: Comfy.Input.INT
      }
      interface MaskComposite extends HasSingle_MASK, ComfyNode<MaskComposite_input, MaskComposite_output> {
          nameInComfy: "MaskComposite"
      }
      interface MaskComposite_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface MaskComposite_input {
          destination: Comfy.Input.MASK
          source: Comfy.Input.MASK
          /** default=0 min=16384 max=16384 step=1 */
          x?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=1 */
          y?: Comfy.Input.INT
          operation: Comfy.Union.E_88c0c90dbad3b41c3c4a4f8a89afad7b1c0db2e0
      }
      interface FeatherMask extends HasSingle_MASK, ComfyNode<FeatherMask_input, FeatherMask_output> {
          nameInComfy: "FeatherMask"
      }
      interface FeatherMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface FeatherMask_input {
          mask: Comfy.Input.MASK
          /** default=0 min=16384 max=16384 step=1 */
          left?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=1 */
          top?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=1 */
          right?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=1 */
          bottom?: Comfy.Input.INT
      }
      interface GrowMask extends HasSingle_MASK, ComfyNode<GrowMask_input, GrowMask_output> {
          nameInComfy: "GrowMask"
      }
      interface GrowMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface GrowMask_input {
          mask: Comfy.Input.MASK
          /** default=0 min=16384 max=16384 step=1 */
          expand?: Comfy.Input.INT
          /** default=true */
          tapered_corners?: Comfy.Input.BOOLEAN
      }
      interface ThresholdMask extends HasSingle_MASK, ComfyNode<ThresholdMask_input, ThresholdMask_output> {
          nameInComfy: "ThresholdMask"
      }
      interface ThresholdMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface ThresholdMask_input {
          mask: Comfy.Input.MASK
          /** default=0.5 min=1 max=1 step=0.01 */
          value?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_compositing
   namespace Comfy.Extra.compositing {
      interface Nodes {
          /** category="mask_compositing" name="PorterDuffImageComposite" output=[IMAGE, MASK] */
         PorterDuffImageComposite(p: PorterDuffImageComposite_input, meta?: ComfyNodeMetadata): PorterDuffImageComposite
          /** category="mask_compositing" name="SplitImageWithAlpha" output=[IMAGE, MASK] */
         SplitImageWithAlpha(p: SplitImageWithAlpha_input, meta?: ComfyNodeMetadata): SplitImageWithAlpha
          /** category="mask_compositing" name="JoinImageWithAlpha" output=[IMAGE] */
         JoinImageWithAlpha(p: JoinImageWithAlpha_input, meta?: ComfyNodeMetadata): JoinImageWithAlpha
      }
      interface PorterDuffImageComposite extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<PorterDuffImageComposite_input, PorterDuffImageComposite_output> {
          nameInComfy: "PorterDuffImageComposite"
      }
      interface PorterDuffImageComposite_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
          MASK: ComfyNodeOutput<'MASK', 1>,
      }
      interface PorterDuffImageComposite_input {
          source: Comfy.Input.IMAGE
          source_alpha: Comfy.Input.MASK
          destination: Comfy.Input.IMAGE
          destination_alpha: Comfy.Input.MASK
          /** default="DST" */
          mode?: Comfy.Union.E_d954b5ae44db00529f0fd0bfb816e25c12617df8
      }
      interface SplitImageWithAlpha extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<SplitImageWithAlpha_input, SplitImageWithAlpha_output> {
          nameInComfy: "SplitImageWithAlpha"
      }
      interface SplitImageWithAlpha_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
          MASK: ComfyNodeOutput<'MASK', 1>,
      }
      interface SplitImageWithAlpha_input {
          image: Comfy.Input.IMAGE
      }
      interface JoinImageWithAlpha extends HasSingle_IMAGE, ComfyNode<JoinImageWithAlpha_input, JoinImageWithAlpha_output> {
          nameInComfy: "JoinImageWithAlpha"
      }
      interface JoinImageWithAlpha_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface JoinImageWithAlpha_input {
          image: Comfy.Input.IMAGE
          alpha: Comfy.Input.MASK
      }
   }
   
   // comfy_extras.nodes_rebatch
   namespace Comfy.Extra.rebatch {
      interface Nodes {
          /** category="latent_batch" name="RebatchLatents" output=[LATENT] */
         RebatchLatents(p: RebatchLatents_input, meta?: ComfyNodeMetadata): RebatchLatents
          /** category="image_batch" name="RebatchImages" output=[IMAGE] */
         RebatchImages(p: RebatchImages_input, meta?: ComfyNodeMetadata): RebatchImages
      }
      interface RebatchLatents extends HasSingle_LATENT, ComfyNode<RebatchLatents_input, RebatchLatents_output> {
          nameInComfy: "RebatchLatents"
      }
      interface RebatchLatents_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface RebatchLatents_input {
          latents: Comfy.Input.LATENT
          /** default=1 min=4096 max=4096 */
          batch_size?: Comfy.Input.INT
      }
      interface RebatchImages extends HasSingle_IMAGE, ComfyNode<RebatchImages_input, RebatchImages_output> {
          nameInComfy: "RebatchImages"
      }
      interface RebatchImages_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface RebatchImages_input {
          images: Comfy.Input.IMAGE
          /** default=1 min=4096 max=4096 */
          batch_size?: Comfy.Input.INT
      }
   }
   
   // comfy_extras.nodes_model_merging
   namespace Comfy.Extra.model_merging {
      interface Nodes {
          /** category="advanced_model_merging" name="ModelMergeSimple" output=[MODEL] */
         ModelMergeSimple(p: ModelMergeSimple_input, meta?: ComfyNodeMetadata): ModelMergeSimple
          /** category="advanced_model_merging" name="ModelMergeBlocks" output=[MODEL] */
         ModelMergeBlocks(p: ModelMergeBlocks_input, meta?: ComfyNodeMetadata): ModelMergeBlocks
          /** category="advanced_model_merging" name="ModelMergeSubtract" output=[MODEL] */
         ModelMergeSubtract(p: ModelMergeSubtract_input, meta?: ComfyNodeMetadata): ModelMergeSubtract
          /** category="advanced_model_merging" name="ModelMergeAdd" output=[MODEL] */
         ModelMergeAdd(p: ModelMergeAdd_input, meta?: ComfyNodeMetadata): ModelMergeAdd
          /** category="advanced_model_merging" name="CheckpointSave" output=[] */
         CheckpointSave(p: CheckpointSave_input, meta?: ComfyNodeMetadata): CheckpointSave
          /** category="advanced_model_merging" name="CLIPMergeSimple" output=[CLIP] */
         CLIPMergeSimple(p: CLIPMergeSimple_input, meta?: ComfyNodeMetadata): CLIPMergeSimple
          /** category="advanced_model_merging" name="CLIPMergeSubtract" output=[CLIP] */
         CLIPMergeSubtract(p: CLIPMergeSubtract_input, meta?: ComfyNodeMetadata): CLIPMergeSubtract
          /** category="advanced_model_merging" name="CLIPMergeAdd" output=[CLIP] */
         CLIPMergeAdd(p: CLIPMergeAdd_input, meta?: ComfyNodeMetadata): CLIPMergeAdd
          /** category="advanced_model_merging" name="CLIPSave" output=[] */
         CLIPSave(p: CLIPSave_input, meta?: ComfyNodeMetadata): CLIPSave
          /** category="advanced_model_merging" name="VAESave" output=[] */
         VAESave(p: VAESave_input, meta?: ComfyNodeMetadata): VAESave
          /** category="advanced_model_merging" name="ModelSave" output=[] */
         ModelSave(p: ModelSave_input, meta?: ComfyNodeMetadata): ModelSave
      }
      interface ModelMergeSimple extends HasSingle_MODEL, ComfyNode<ModelMergeSimple_input, ModelMergeSimple_output> {
          nameInComfy: "ModelMergeSimple"
      }
      interface ModelMergeSimple_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelMergeSimple_input {
          model1: Comfy.Input.MODEL
          model2: Comfy.Input.MODEL
          /** default=1 min=1 max=1 step=0.01 */
          ratio?: Comfy.Input.FLOAT
      }
      interface ModelMergeBlocks extends HasSingle_MODEL, ComfyNode<ModelMergeBlocks_input, ModelMergeBlocks_output> {
          nameInComfy: "ModelMergeBlocks"
      }
      interface ModelMergeBlocks_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelMergeBlocks_input {
          model1: Comfy.Input.MODEL
          model2: Comfy.Input.MODEL
          /** default=1 min=1 max=1 step=0.01 */
          input?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          middle?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          out?: Comfy.Input.FLOAT
      }
      interface ModelMergeSubtract extends HasSingle_MODEL, ComfyNode<ModelMergeSubtract_input, ModelMergeSubtract_output> {
          nameInComfy: "ModelMergeSubtract"
      }
      interface ModelMergeSubtract_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelMergeSubtract_input {
          model1: Comfy.Input.MODEL
          model2: Comfy.Input.MODEL
          /** default=1 min=10 max=10 step=0.01 */
          multiplier?: Comfy.Input.FLOAT
      }
      interface ModelMergeAdd extends HasSingle_MODEL, ComfyNode<ModelMergeAdd_input, ModelMergeAdd_output> {
          nameInComfy: "ModelMergeAdd"
      }
      interface ModelMergeAdd_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelMergeAdd_input {
          model1: Comfy.Input.MODEL
          model2: Comfy.Input.MODEL
      }
      interface CheckpointSave extends ComfyNode<CheckpointSave_input, CheckpointSave_output> {
          nameInComfy: "CheckpointSave"
      }
      interface CheckpointSave_output {
      }
      interface CheckpointSave_input {
          model: Comfy.Input.MODEL
          clip: Comfy.Input.CLIP
          vae: Comfy.Input.VAE
          /** default="checkpoints/ComfyUI" */
          filename_prefix?: Comfy.Input.STRING
      }
      interface CLIPMergeSimple extends HasSingle_CLIP, ComfyNode<CLIPMergeSimple_input, CLIPMergeSimple_output> {
          nameInComfy: "CLIPMergeSimple"
      }
      interface CLIPMergeSimple_output {
          CLIP: ComfyNodeOutput<'CLIP', 0>,
      }
      interface CLIPMergeSimple_input {
          clip1: Comfy.Input.CLIP
          clip2: Comfy.Input.CLIP
          /** default=1 min=1 max=1 step=0.01 */
          ratio?: Comfy.Input.FLOAT
      }
      interface CLIPMergeSubtract extends HasSingle_CLIP, ComfyNode<CLIPMergeSubtract_input, CLIPMergeSubtract_output> {
          nameInComfy: "CLIPMergeSubtract"
      }
      interface CLIPMergeSubtract_output {
          CLIP: ComfyNodeOutput<'CLIP', 0>,
      }
      interface CLIPMergeSubtract_input {
          clip1: Comfy.Input.CLIP
          clip2: Comfy.Input.CLIP
          /** default=1 min=10 max=10 step=0.01 */
          multiplier?: Comfy.Input.FLOAT
      }
      interface CLIPMergeAdd extends HasSingle_CLIP, ComfyNode<CLIPMergeAdd_input, CLIPMergeAdd_output> {
          nameInComfy: "CLIPMergeAdd"
      }
      interface CLIPMergeAdd_output {
          CLIP: ComfyNodeOutput<'CLIP', 0>,
      }
      interface CLIPMergeAdd_input {
          clip1: Comfy.Input.CLIP
          clip2: Comfy.Input.CLIP
      }
      interface CLIPSave extends ComfyNode<CLIPSave_input, CLIPSave_output> {
          nameInComfy: "CLIPSave"
      }
      interface CLIPSave_output {
      }
      interface CLIPSave_input {
          clip: Comfy.Input.CLIP
          /** default="clip/ComfyUI" */
          filename_prefix?: Comfy.Input.STRING
      }
      interface VAESave extends ComfyNode<VAESave_input, VAESave_output> {
          nameInComfy: "VAESave"
      }
      interface VAESave_output {
      }
      interface VAESave_input {
          vae: Comfy.Input.VAE
          /** default="vae/ComfyUI_vae" */
          filename_prefix?: Comfy.Input.STRING
      }
      interface ModelSave extends ComfyNode<ModelSave_input, ModelSave_output> {
          nameInComfy: "ModelSave"
      }
      interface ModelSave_output {
      }
      interface ModelSave_input {
          model: Comfy.Input.MODEL
          /** default="diffusion_models/ComfyUI" */
          filename_prefix?: Comfy.Input.STRING
      }
   }
   
   // comfy_extras.nodes_tomesd
   namespace Comfy.Extra.tomesd {
      interface Nodes {
          /** category="model_patches_unet" name="TomePatchModel" output=[MODEL] */
         TomePatchModel(p: TomePatchModel_input, meta?: ComfyNodeMetadata): TomePatchModel
      }
      interface TomePatchModel extends HasSingle_MODEL, ComfyNode<TomePatchModel_input, TomePatchModel_output> {
          nameInComfy: "TomePatchModel"
      }
      interface TomePatchModel_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface TomePatchModel_input {
          model: Comfy.Input.MODEL
          /** default=0.3 min=1 max=1 step=0.01 */
          ratio?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_clip_sdxl
   namespace Comfy.Extra.clip_sdxl {
      interface Nodes {
          /** category="advanced_conditioning" name="CLIPTextEncodeSDXLRefiner" output=[CONDITIONING] */
         CLIPTextEncodeSDXLRefiner(p: CLIPTextEncodeSDXLRefiner_input, meta?: ComfyNodeMetadata): CLIPTextEncodeSDXLRefiner
          /** category="advanced_conditioning" name="CLIPTextEncodeSDXL" output=[CONDITIONING] */
         CLIPTextEncodeSDXL(p: CLIPTextEncodeSDXL_input, meta?: ComfyNodeMetadata): CLIPTextEncodeSDXL
      }
      interface CLIPTextEncodeSDXLRefiner extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncodeSDXLRefiner_input, CLIPTextEncodeSDXLRefiner_output> {
          nameInComfy: "CLIPTextEncodeSDXLRefiner"
      }
      interface CLIPTextEncodeSDXLRefiner_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface CLIPTextEncodeSDXLRefiner_input {
          /** default=6 min=1000 max=1000 step=0.01 */
          ascore?: Comfy.Input.FLOAT
          /** default=1024 min=16384 max=16384 */
          width?: Comfy.Input.INT
          /** default=1024 min=16384 max=16384 */
          height?: Comfy.Input.INT
          /** */
          text: Comfy.Input.STRING
          clip: Comfy.Input.CLIP
      }
      interface CLIPTextEncodeSDXL extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncodeSDXL_input, CLIPTextEncodeSDXL_output> {
          nameInComfy: "CLIPTextEncodeSDXL"
      }
      interface CLIPTextEncodeSDXL_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface CLIPTextEncodeSDXL_input {
          /** default=1024 min=16384 max=16384 */
          width?: Comfy.Input.INT
          /** default=1024 min=16384 max=16384 */
          height?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 */
          crop_w?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 */
          crop_h?: Comfy.Input.INT
          /** default=1024 min=16384 max=16384 */
          target_width?: Comfy.Input.INT
          /** default=1024 min=16384 max=16384 */
          target_height?: Comfy.Input.INT
          /** */
          text_g: Comfy.Input.STRING
          clip: Comfy.Input.CLIP
          /** */
          text_l: Comfy.Input.STRING
      }
   }
   
   // comfy_extras.nodes_canny
   namespace Comfy.Extra.canny {
      interface Nodes {
          /** category="image_preprocessors" name="Canny" output=[IMAGE] */
         Canny(p: Canny_input, meta?: ComfyNodeMetadata): Canny
      }
      interface Canny extends HasSingle_IMAGE, ComfyNode<Canny_input, Canny_output> {
          nameInComfy: "Canny"
      }
      interface Canny_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface Canny_input {
          image: Comfy.Input.IMAGE
          /** default=0.4 min=0.99 max=0.99 step=0.01 */
          low_threshold?: Comfy.Input.FLOAT
          /** default=0.8 min=0.99 max=0.99 step=0.01 */
          high_threshold?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_freelunch
   namespace Comfy.Extra.freelunch {
      interface Nodes {
          /** category="model_patches_unet" name="FreeU" output=[MODEL] */
         FreeU(p: FreeU_input, meta?: ComfyNodeMetadata): FreeU
          /** category="model_patches_unet" name="FreeU_V2" output=[MODEL] */
         FreeU$_V2(p: FreeU$_V2_input, meta?: ComfyNodeMetadata): FreeU$_V2
      }
      interface FreeU extends HasSingle_MODEL, ComfyNode<FreeU_input, FreeU_output> {
          nameInComfy: "FreeU"
      }
      interface FreeU_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface FreeU_input {
          model: Comfy.Input.MODEL
          /** default=1.1 min=10 max=10 step=0.01 */
          b1?: Comfy.Input.FLOAT
          /** default=1.2 min=10 max=10 step=0.01 */
          b2?: Comfy.Input.FLOAT
          /** default=0.9 min=10 max=10 step=0.01 */
          s1?: Comfy.Input.FLOAT
          /** default=0.2 min=10 max=10 step=0.01 */
          s2?: Comfy.Input.FLOAT
      }
      interface FreeU$_V2 extends HasSingle_MODEL, ComfyNode<FreeU$_V2_input, FreeU$_V2_output> {
          nameInComfy: "FreeU_V2"
      }
      interface FreeU$_V2_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface FreeU$_V2_input {
          model: Comfy.Input.MODEL
          /** default=1.3 min=10 max=10 step=0.01 */
          b1?: Comfy.Input.FLOAT
          /** default=1.4 min=10 max=10 step=0.01 */
          b2?: Comfy.Input.FLOAT
          /** default=0.9 min=10 max=10 step=0.01 */
          s1?: Comfy.Input.FLOAT
          /** default=0.2 min=10 max=10 step=0.01 */
          s2?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_custom_sampler
   namespace Comfy.Extra.custom_sampler {
      interface Nodes {
          /** category="sampling_custom_sampling" name="SamplerCustom" output=[output, denoised_output] */
         SamplerCustom(p: SamplerCustom_input, meta?: ComfyNodeMetadata): SamplerCustom
          /** category="sampling_custom_sampling_schedulers" name="BasicScheduler" output=[SIGMAS] */
         BasicScheduler(p: BasicScheduler_input, meta?: ComfyNodeMetadata): BasicScheduler
          /** category="sampling_custom_sampling_schedulers" name="KarrasScheduler" output=[SIGMAS] */
         KarrasScheduler(p: KarrasScheduler_input, meta?: ComfyNodeMetadata): KarrasScheduler
          /** category="sampling_custom_sampling_schedulers" name="ExponentialScheduler" output=[SIGMAS] */
         ExponentialScheduler(p: ExponentialScheduler_input, meta?: ComfyNodeMetadata): ExponentialScheduler
          /** category="sampling_custom_sampling_schedulers" name="PolyexponentialScheduler" output=[SIGMAS] */
         PolyexponentialScheduler(p: PolyexponentialScheduler_input, meta?: ComfyNodeMetadata): PolyexponentialScheduler
          /** category="sampling_custom_sampling_schedulers" name="LaplaceScheduler" output=[SIGMAS] */
         LaplaceScheduler(p: LaplaceScheduler_input, meta?: ComfyNodeMetadata): LaplaceScheduler
          /** category="sampling_custom_sampling_schedulers" name="VPScheduler" output=[SIGMAS] */
         VPScheduler(p: VPScheduler_input, meta?: ComfyNodeMetadata): VPScheduler
          /** category="sampling_custom_sampling_schedulers" name="BetaSamplingScheduler" output=[SIGMAS] */
         BetaSamplingScheduler(p: BetaSamplingScheduler_input, meta?: ComfyNodeMetadata): BetaSamplingScheduler
          /** category="sampling_custom_sampling_schedulers" name="SDTurboScheduler" output=[SIGMAS] */
         SDTurboScheduler(p: SDTurboScheduler_input, meta?: ComfyNodeMetadata): SDTurboScheduler
          /** category="sampling_custom_sampling_samplers" name="KSamplerSelect" output=[SAMPLER] */
         KSamplerSelect(p: KSamplerSelect_input, meta?: ComfyNodeMetadata): KSamplerSelect
          /** category="sampling_custom_sampling_samplers" name="SamplerEulerAncestral" output=[SAMPLER] */
         SamplerEulerAncestral(p: SamplerEulerAncestral_input, meta?: ComfyNodeMetadata): SamplerEulerAncestral
          /** category="sampling_custom_sampling_samplers" name="SamplerEulerAncestralCFGPP" output=[SAMPLER] */
         SamplerEulerAncestralCFGPP(p: SamplerEulerAncestralCFGPP_input, meta?: ComfyNodeMetadata): SamplerEulerAncestralCFGPP
          /** category="sampling_custom_sampling_samplers" name="SamplerLMS" output=[SAMPLER] */
         SamplerLMS(p: SamplerLMS_input, meta?: ComfyNodeMetadata): SamplerLMS
          /** category="sampling_custom_sampling_samplers" name="SamplerDPMPP_3M_SDE" output=[SAMPLER] */
         SamplerDPMPP$_3M$_SDE(p: SamplerDPMPP$_3M$_SDE_input, meta?: ComfyNodeMetadata): SamplerDPMPP$_3M$_SDE
          /** category="sampling_custom_sampling_samplers" name="SamplerDPMPP_2M_SDE" output=[SAMPLER] */
         SamplerDPMPP$_2M$_SDE(p: SamplerDPMPP$_2M$_SDE_input, meta?: ComfyNodeMetadata): SamplerDPMPP$_2M$_SDE
          /** category="sampling_custom_sampling_samplers" name="SamplerDPMPP_SDE" output=[SAMPLER] */
         SamplerDPMPP$_SDE(p: SamplerDPMPP$_SDE_input, meta?: ComfyNodeMetadata): SamplerDPMPP$_SDE
          /** category="sampling_custom_sampling_samplers" name="SamplerDPMPP_2S_Ancestral" output=[SAMPLER] */
         SamplerDPMPP$_2S$_Ancestral(p: SamplerDPMPP$_2S$_Ancestral_input, meta?: ComfyNodeMetadata): SamplerDPMPP$_2S$_Ancestral
          /** category="sampling_custom_sampling_samplers" name="SamplerDPMAdaptative" output=[SAMPLER] */
         SamplerDPMAdaptative(p: SamplerDPMAdaptative_input, meta?: ComfyNodeMetadata): SamplerDPMAdaptative
          /** category="sampling_custom_sampling_sigmas" name="SplitSigmas" output=[high_sigmas, low_sigmas] */
         SplitSigmas(p: SplitSigmas_input, meta?: ComfyNodeMetadata): SplitSigmas
          /** category="sampling_custom_sampling_sigmas" name="SplitSigmasDenoise" output=[high_sigmas, low_sigmas] */
         SplitSigmasDenoise(p: SplitSigmasDenoise_input, meta?: ComfyNodeMetadata): SplitSigmasDenoise
          /** category="sampling_custom_sampling_sigmas" name="FlipSigmas" output=[SIGMAS] */
         FlipSigmas(p: FlipSigmas_input, meta?: ComfyNodeMetadata): FlipSigmas
          /** category="sampling_custom_sampling_guiders" name="CFGGuider" output=[GUIDER] */
         CFGGuider(p: CFGGuider_input, meta?: ComfyNodeMetadata): CFGGuider
          /** category="sampling_custom_sampling_guiders" name="DualCFGGuider" output=[GUIDER] */
         DualCFGGuider(p: DualCFGGuider_input, meta?: ComfyNodeMetadata): DualCFGGuider
          /** category="sampling_custom_sampling_guiders" name="BasicGuider" output=[GUIDER] */
         BasicGuider(p: BasicGuider_input, meta?: ComfyNodeMetadata): BasicGuider
          /** category="sampling_custom_sampling_noise" name="RandomNoise" output=[NOISE] */
         RandomNoise(p: RandomNoise_input, meta?: ComfyNodeMetadata): RandomNoise
          /** category="sampling_custom_sampling_noise" name="DisableNoise" output=[NOISE] */
         DisableNoise(p: DisableNoise_input, meta?: ComfyNodeMetadata): DisableNoise
          /** category="_for_testing_custom_sampling_noise" name="AddNoise" output=[LATENT] */
         AddNoise(p: AddNoise_input, meta?: ComfyNodeMetadata): AddNoise
          /** category="sampling_custom_sampling" name="SamplerCustomAdvanced" output=[output, denoised_output] */
         SamplerCustomAdvanced(p: SamplerCustomAdvanced_input, meta?: ComfyNodeMetadata): SamplerCustomAdvanced
      }
      interface SamplerCustom extends ComfyNode<SamplerCustom_input, SamplerCustom_output> {
          nameInComfy: "SamplerCustom"
      }
      interface SamplerCustom_output {
          output: ComfyNodeOutput<'LATENT', 0>,
          denoised_output: ComfyNodeOutput<'LATENT', 1>,
      }
      interface SamplerCustom_input {
          model: Comfy.Input.MODEL
          /** default=true */
          add_noise?: Comfy.Input.BOOLEAN
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          noise_seed?: Comfy.Input.INT
          /** default=8 min=100 max=100 step=0.1 */
          cfg?: Comfy.Input.FLOAT
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          sampler: Comfy.Input.SAMPLER
          sigmas: Comfy.Input.SIGMAS
          latent_image: Comfy.Input.LATENT
      }
      interface BasicScheduler extends HasSingle_SIGMAS, ComfyNode<BasicScheduler_input, BasicScheduler_output> {
          nameInComfy: "BasicScheduler"
      }
      interface BasicScheduler_output {
          SIGMAS: ComfyNodeOutput<'SIGMAS', 0>,
      }
      interface BasicScheduler_input {
          model: Comfy.Input.MODEL
          scheduler: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
      }
      interface KarrasScheduler extends HasSingle_SIGMAS, ComfyNode<KarrasScheduler_input, KarrasScheduler_output> {
          nameInComfy: "KarrasScheduler"
      }
      interface KarrasScheduler_output {
          SIGMAS: ComfyNodeOutput<'SIGMAS', 0>,
      }
      interface KarrasScheduler_input {
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=14.614642 min=5000 max=5000 step=0.01 */
          sigma_max?: Comfy.Input.FLOAT
          /** default=0.0291675 min=5000 max=5000 step=0.01 */
          sigma_min?: Comfy.Input.FLOAT
          /** default=7 min=100 max=100 step=0.01 */
          rho?: Comfy.Input.FLOAT
      }
      interface ExponentialScheduler extends HasSingle_SIGMAS, ComfyNode<ExponentialScheduler_input, ExponentialScheduler_output> {
          nameInComfy: "ExponentialScheduler"
      }
      interface ExponentialScheduler_output {
          SIGMAS: ComfyNodeOutput<'SIGMAS', 0>,
      }
      interface ExponentialScheduler_input {
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=14.614642 min=5000 max=5000 step=0.01 */
          sigma_max?: Comfy.Input.FLOAT
          /** default=0.0291675 min=5000 max=5000 step=0.01 */
          sigma_min?: Comfy.Input.FLOAT
      }
      interface PolyexponentialScheduler extends HasSingle_SIGMAS, ComfyNode<PolyexponentialScheduler_input, PolyexponentialScheduler_output> {
          nameInComfy: "PolyexponentialScheduler"
      }
      interface PolyexponentialScheduler_output {
          SIGMAS: ComfyNodeOutput<'SIGMAS', 0>,
      }
      interface PolyexponentialScheduler_input {
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=14.614642 min=5000 max=5000 step=0.01 */
          sigma_max?: Comfy.Input.FLOAT
          /** default=0.0291675 min=5000 max=5000 step=0.01 */
          sigma_min?: Comfy.Input.FLOAT
          /** default=1 min=100 max=100 step=0.01 */
          rho?: Comfy.Input.FLOAT
      }
      interface LaplaceScheduler extends HasSingle_SIGMAS, ComfyNode<LaplaceScheduler_input, LaplaceScheduler_output> {
          nameInComfy: "LaplaceScheduler"
      }
      interface LaplaceScheduler_output {
          SIGMAS: ComfyNodeOutput<'SIGMAS', 0>,
      }
      interface LaplaceScheduler_input {
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=14.614642 min=5000 max=5000 step=0.01 */
          sigma_max?: Comfy.Input.FLOAT
          /** default=0.0291675 min=5000 max=5000 step=0.01 */
          sigma_min?: Comfy.Input.FLOAT
          /** default=0 min=10 max=10 step=0.1 */
          mu?: Comfy.Input.FLOAT
          /** default=0.5 min=10 max=10 step=0.1 */
          beta?: Comfy.Input.FLOAT
      }
      interface VPScheduler extends HasSingle_SIGMAS, ComfyNode<VPScheduler_input, VPScheduler_output> {
          nameInComfy: "VPScheduler"
      }
      interface VPScheduler_output {
          SIGMAS: ComfyNodeOutput<'SIGMAS', 0>,
      }
      interface VPScheduler_input {
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=19.9 min=5000 max=5000 step=0.01 */
          beta_d?: Comfy.Input.FLOAT
          /** default=0.1 min=5000 max=5000 step=0.01 */
          beta_min?: Comfy.Input.FLOAT
          /** default=0.001 min=1 max=1 step=0.0001 */
          eps_s?: Comfy.Input.FLOAT
      }
      interface BetaSamplingScheduler extends HasSingle_SIGMAS, ComfyNode<BetaSamplingScheduler_input, BetaSamplingScheduler_output> {
          nameInComfy: "BetaSamplingScheduler"
      }
      interface BetaSamplingScheduler_output {
          SIGMAS: ComfyNodeOutput<'SIGMAS', 0>,
      }
      interface BetaSamplingScheduler_input {
          model: Comfy.Input.MODEL
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=0.6 min=50 max=50 step=0.01 */
          alpha?: Comfy.Input.FLOAT
          /** default=0.6 min=50 max=50 step=0.01 */
          beta?: Comfy.Input.FLOAT
      }
      interface SDTurboScheduler extends HasSingle_SIGMAS, ComfyNode<SDTurboScheduler_input, SDTurboScheduler_output> {
          nameInComfy: "SDTurboScheduler"
      }
      interface SDTurboScheduler_output {
          SIGMAS: ComfyNodeOutput<'SIGMAS', 0>,
      }
      interface SDTurboScheduler_input {
          model: Comfy.Input.MODEL
          /** default=1 min=10 max=10 */
          steps?: Comfy.Input.INT
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
      }
      interface KSamplerSelect extends HasSingle_SAMPLER, ComfyNode<KSamplerSelect_input, KSamplerSelect_output> {
          nameInComfy: "KSamplerSelect"
      }
      interface KSamplerSelect_output {
          SAMPLER: ComfyNodeOutput<'SAMPLER', 0>,
      }
      interface KSamplerSelect_input {
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
      }
      interface SamplerEulerAncestral extends HasSingle_SAMPLER, ComfyNode<SamplerEulerAncestral_input, SamplerEulerAncestral_output> {
          nameInComfy: "SamplerEulerAncestral"
      }
      interface SamplerEulerAncestral_output {
          SAMPLER: ComfyNodeOutput<'SAMPLER', 0>,
      }
      interface SamplerEulerAncestral_input {
          /** default=1 min=100 max=100 step=0.01 */
          eta?: Comfy.Input.FLOAT
          /** default=1 min=100 max=100 step=0.01 */
          s_noise?: Comfy.Input.FLOAT
      }
      interface SamplerEulerAncestralCFGPP extends HasSingle_SAMPLER, ComfyNode<SamplerEulerAncestralCFGPP_input, SamplerEulerAncestralCFGPP_output> {
          nameInComfy: "SamplerEulerAncestralCFGPP"
      }
      interface SamplerEulerAncestralCFGPP_output {
          SAMPLER: ComfyNodeOutput<'SAMPLER', 0>,
      }
      interface SamplerEulerAncestralCFGPP_input {
          /** default=1 min=1 max=1 step=0.01 */
          eta?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          s_noise?: Comfy.Input.FLOAT
      }
      interface SamplerLMS extends HasSingle_SAMPLER, ComfyNode<SamplerLMS_input, SamplerLMS_output> {
          nameInComfy: "SamplerLMS"
      }
      interface SamplerLMS_output {
          SAMPLER: ComfyNodeOutput<'SAMPLER', 0>,
      }
      interface SamplerLMS_input {
          /** default=4 min=100 max=100 */
          order?: Comfy.Input.INT
      }
      interface SamplerDPMPP$_3M$_SDE extends HasSingle_SAMPLER, ComfyNode<SamplerDPMPP$_3M$_SDE_input, SamplerDPMPP$_3M$_SDE_output> {
          nameInComfy: "SamplerDPMPP_3M_SDE"
      }
      interface SamplerDPMPP$_3M$_SDE_output {
          SAMPLER: ComfyNodeOutput<'SAMPLER', 0>,
      }
      interface SamplerDPMPP$_3M$_SDE_input {
          /** default=1 min=100 max=100 step=0.01 */
          eta?: Comfy.Input.FLOAT
          /** default=1 min=100 max=100 step=0.01 */
          s_noise?: Comfy.Input.FLOAT
          noise_device: Comfy.Union.E_928b7403128cb25513cafc463a76a922ba5d4bd0
      }
      interface SamplerDPMPP$_2M$_SDE extends HasSingle_SAMPLER, ComfyNode<SamplerDPMPP$_2M$_SDE_input, SamplerDPMPP$_2M$_SDE_output> {
          nameInComfy: "SamplerDPMPP_2M_SDE"
      }
      interface SamplerDPMPP$_2M$_SDE_output {
          SAMPLER: ComfyNodeOutput<'SAMPLER', 0>,
      }
      interface SamplerDPMPP$_2M$_SDE_input {
          solver_type: Comfy.Union.E_148e0bc88719e23ec2f2c80871fe45ae759cd7e1
          /** default=1 min=100 max=100 step=0.01 */
          eta?: Comfy.Input.FLOAT
          /** default=1 min=100 max=100 step=0.01 */
          s_noise?: Comfy.Input.FLOAT
          noise_device: Comfy.Union.E_928b7403128cb25513cafc463a76a922ba5d4bd0
      }
      interface SamplerDPMPP$_SDE extends HasSingle_SAMPLER, ComfyNode<SamplerDPMPP$_SDE_input, SamplerDPMPP$_SDE_output> {
          nameInComfy: "SamplerDPMPP_SDE"
      }
      interface SamplerDPMPP$_SDE_output {
          SAMPLER: ComfyNodeOutput<'SAMPLER', 0>,
      }
      interface SamplerDPMPP$_SDE_input {
          /** default=1 min=100 max=100 step=0.01 */
          eta?: Comfy.Input.FLOAT
          /** default=1 min=100 max=100 step=0.01 */
          s_noise?: Comfy.Input.FLOAT
          /** default=0.5 min=100 max=100 step=0.01 */
          r?: Comfy.Input.FLOAT
          noise_device: Comfy.Union.E_928b7403128cb25513cafc463a76a922ba5d4bd0
      }
      interface SamplerDPMPP$_2S$_Ancestral extends HasSingle_SAMPLER, ComfyNode<SamplerDPMPP$_2S$_Ancestral_input, SamplerDPMPP$_2S$_Ancestral_output> {
          nameInComfy: "SamplerDPMPP_2S_Ancestral"
      }
      interface SamplerDPMPP$_2S$_Ancestral_output {
          SAMPLER: ComfyNodeOutput<'SAMPLER', 0>,
      }
      interface SamplerDPMPP$_2S$_Ancestral_input {
          /** default=1 min=100 max=100 step=0.01 */
          eta?: Comfy.Input.FLOAT
          /** default=1 min=100 max=100 step=0.01 */
          s_noise?: Comfy.Input.FLOAT
      }
      interface SamplerDPMAdaptative extends HasSingle_SAMPLER, ComfyNode<SamplerDPMAdaptative_input, SamplerDPMAdaptative_output> {
          nameInComfy: "SamplerDPMAdaptative"
      }
      interface SamplerDPMAdaptative_output {
          SAMPLER: ComfyNodeOutput<'SAMPLER', 0>,
      }
      interface SamplerDPMAdaptative_input {
          /** default=3 min=3 max=3 */
          order?: Comfy.Input.INT
          /** default=0.05 min=100 max=100 step=0.01 */
          rtol?: Comfy.Input.FLOAT
          /** default=0.0078 min=100 max=100 step=0.01 */
          atol?: Comfy.Input.FLOAT
          /** default=0.05 min=100 max=100 step=0.01 */
          h_init?: Comfy.Input.FLOAT
          /** default=0 min=100 max=100 step=0.01 */
          pcoeff?: Comfy.Input.FLOAT
          /** default=1 min=100 max=100 step=0.01 */
          icoeff?: Comfy.Input.FLOAT
          /** default=0 min=100 max=100 step=0.01 */
          dcoeff?: Comfy.Input.FLOAT
          /** default=0.81 min=100 max=100 step=0.01 */
          accept_safety?: Comfy.Input.FLOAT
          /** default=0 min=100 max=100 step=0.01 */
          eta?: Comfy.Input.FLOAT
          /** default=1 min=100 max=100 step=0.01 */
          s_noise?: Comfy.Input.FLOAT
      }
      interface SplitSigmas extends ComfyNode<SplitSigmas_input, SplitSigmas_output> {
          nameInComfy: "SplitSigmas"
      }
      interface SplitSigmas_output {
          high_sigmas: ComfyNodeOutput<'SIGMAS', 0>,
          low_sigmas: ComfyNodeOutput<'SIGMAS', 1>,
      }
      interface SplitSigmas_input {
          sigmas: Comfy.Input.SIGMAS
          /** default=0 min=10000 max=10000 */
          step?: Comfy.Input.INT
      }
      interface SplitSigmasDenoise extends ComfyNode<SplitSigmasDenoise_input, SplitSigmasDenoise_output> {
          nameInComfy: "SplitSigmasDenoise"
      }
      interface SplitSigmasDenoise_output {
          high_sigmas: ComfyNodeOutput<'SIGMAS', 0>,
          low_sigmas: ComfyNodeOutput<'SIGMAS', 1>,
      }
      interface SplitSigmasDenoise_input {
          sigmas: Comfy.Input.SIGMAS
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
      }
      interface FlipSigmas extends HasSingle_SIGMAS, ComfyNode<FlipSigmas_input, FlipSigmas_output> {
          nameInComfy: "FlipSigmas"
      }
      interface FlipSigmas_output {
          SIGMAS: ComfyNodeOutput<'SIGMAS', 0>,
      }
      interface FlipSigmas_input {
          sigmas: Comfy.Input.SIGMAS
      }
      interface CFGGuider extends HasSingle_GUIDER, ComfyNode<CFGGuider_input, CFGGuider_output> {
          nameInComfy: "CFGGuider"
      }
      interface CFGGuider_output {
          GUIDER: ComfyNodeOutput<'GUIDER', 0>,
      }
      interface CFGGuider_input {
          model: Comfy.Input.MODEL
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          /** default=8 min=100 max=100 step=0.1 */
          cfg?: Comfy.Input.FLOAT
      }
      interface DualCFGGuider extends HasSingle_GUIDER, ComfyNode<DualCFGGuider_input, DualCFGGuider_output> {
          nameInComfy: "DualCFGGuider"
      }
      interface DualCFGGuider_output {
          GUIDER: ComfyNodeOutput<'GUIDER', 0>,
      }
      interface DualCFGGuider_input {
          model: Comfy.Input.MODEL
          cond1: Comfy.Input.CONDITIONING
          cond2: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          /** default=8 min=100 max=100 step=0.1 */
          cfg_conds?: Comfy.Input.FLOAT
          /** default=8 min=100 max=100 step=0.1 */
          cfg_cond2_negative?: Comfy.Input.FLOAT
      }
      interface BasicGuider extends HasSingle_GUIDER, ComfyNode<BasicGuider_input, BasicGuider_output> {
          nameInComfy: "BasicGuider"
      }
      interface BasicGuider_output {
          GUIDER: ComfyNodeOutput<'GUIDER', 0>,
      }
      interface BasicGuider_input {
          model: Comfy.Input.MODEL
          conditioning: Comfy.Input.CONDITIONING
      }
      interface RandomNoise extends HasSingle_NOISE, ComfyNode<RandomNoise_input, RandomNoise_output> {
          nameInComfy: "RandomNoise"
      }
      interface RandomNoise_output {
          NOISE: ComfyNodeOutput<'NOISE', 0>,
      }
      interface RandomNoise_input {
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          noise_seed?: Comfy.Input.INT
      }
      interface DisableNoise extends HasSingle_NOISE, ComfyNode<DisableNoise_input, DisableNoise_output> {
          nameInComfy: "DisableNoise"
      }
      interface DisableNoise_output {
          NOISE: ComfyNodeOutput<'NOISE', 0>,
      }
      interface DisableNoise_input {
      }
      interface AddNoise extends HasSingle_LATENT, ComfyNode<AddNoise_input, AddNoise_output> {
          nameInComfy: "AddNoise"
      }
      interface AddNoise_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface AddNoise_input {
          model: Comfy.Input.MODEL
          noise: Comfy.Input.NOISE
          sigmas: Comfy.Input.SIGMAS
          latent_image: Comfy.Input.LATENT
      }
      interface SamplerCustomAdvanced extends ComfyNode<SamplerCustomAdvanced_input, SamplerCustomAdvanced_output> {
          nameInComfy: "SamplerCustomAdvanced"
      }
      interface SamplerCustomAdvanced_output {
          output: ComfyNodeOutput<'LATENT', 0>,
          denoised_output: ComfyNodeOutput<'LATENT', 1>,
      }
      interface SamplerCustomAdvanced_input {
          noise: Comfy.Input.NOISE
          guider: Comfy.Input.GUIDER
          sampler: Comfy.Input.SAMPLER
          sigmas: Comfy.Input.SIGMAS
          latent_image: Comfy.Input.LATENT
      }
   }
   
   // comfy_extras.nodes_hypertile
   namespace Comfy.Extra.hypertile {
      interface Nodes {
          /** category="model_patches_unet" name="HyperTile" output=[MODEL] */
         HyperTile(p: HyperTile_input, meta?: ComfyNodeMetadata): HyperTile
      }
      interface HyperTile extends HasSingle_MODEL, ComfyNode<HyperTile_input, HyperTile_output> {
          nameInComfy: "HyperTile"
      }
      interface HyperTile_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface HyperTile_input {
          model: Comfy.Input.MODEL
          /** default=256 min=2048 max=2048 */
          tile_size?: Comfy.Input.INT
          /** default=2 min=128 max=128 */
          swap_size?: Comfy.Input.INT
          /** default=0 min=10 max=10 */
          max_depth?: Comfy.Input.INT
          /** default=false */
          scale_depth?: Comfy.Input.BOOLEAN
      }
   }
   
   // comfy_extras.nodes_model_advanced
   namespace Comfy.Extra.model_advanced {
      interface Nodes {
          /** category="advanced_model" name="ModelSamplingDiscrete" output=[MODEL] */
         ModelSamplingDiscrete(p: ModelSamplingDiscrete_input, meta?: ComfyNodeMetadata): ModelSamplingDiscrete
          /** category="advanced_model" name="ModelSamplingContinuousEDM" output=[MODEL] */
         ModelSamplingContinuousEDM(p: ModelSamplingContinuousEDM_input, meta?: ComfyNodeMetadata): ModelSamplingContinuousEDM
          /** category="advanced_model" name="ModelSamplingContinuousV" output=[MODEL] */
         ModelSamplingContinuousV(p: ModelSamplingContinuousV_input, meta?: ComfyNodeMetadata): ModelSamplingContinuousV
          /** category="advanced_model" name="ModelSamplingStableCascade" output=[MODEL] */
         ModelSamplingStableCascade(p: ModelSamplingStableCascade_input, meta?: ComfyNodeMetadata): ModelSamplingStableCascade
          /** category="advanced_model" name="ModelSamplingSD3" output=[MODEL] */
         ModelSamplingSD3(p: ModelSamplingSD3_input, meta?: ComfyNodeMetadata): ModelSamplingSD3
          /** category="advanced_model" name="ModelSamplingAuraFlow" output=[MODEL] */
         ModelSamplingAuraFlow(p: ModelSamplingAuraFlow_input, meta?: ComfyNodeMetadata): ModelSamplingAuraFlow
          /** category="advanced_model" name="ModelSamplingFlux" output=[MODEL] */
         ModelSamplingFlux(p: ModelSamplingFlux_input, meta?: ComfyNodeMetadata): ModelSamplingFlux
          /** category="advanced_model" name="RescaleCFG" output=[MODEL] */
         RescaleCFG(p: RescaleCFG_input, meta?: ComfyNodeMetadata): RescaleCFG
      }
      interface ModelSamplingDiscrete extends HasSingle_MODEL, ComfyNode<ModelSamplingDiscrete_input, ModelSamplingDiscrete_output> {
          nameInComfy: "ModelSamplingDiscrete"
      }
      interface ModelSamplingDiscrete_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelSamplingDiscrete_input {
          model: Comfy.Input.MODEL
          sampling: Comfy.Union.E_e89ec78e24ca5e9c91264b9e9b5ed722d2b509dc
          /** default=false */
          zsnr?: Comfy.Input.BOOLEAN
      }
      interface ModelSamplingContinuousEDM extends HasSingle_MODEL, ComfyNode<ModelSamplingContinuousEDM_input, ModelSamplingContinuousEDM_output> {
          nameInComfy: "ModelSamplingContinuousEDM"
      }
      interface ModelSamplingContinuousEDM_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelSamplingContinuousEDM_input {
          model: Comfy.Input.MODEL
          sampling: Comfy.Union.E_bf8a83a3d55d70c688644bf18edaf23501f7c168
          /** default=120 min=1000 max=1000 step=0.001 */
          sigma_max?: Comfy.Input.FLOAT
          /** default=0.002 min=1000 max=1000 step=0.001 */
          sigma_min?: Comfy.Input.FLOAT
      }
      interface ModelSamplingContinuousV extends HasSingle_MODEL, ComfyNode<ModelSamplingContinuousV_input, ModelSamplingContinuousV_output> {
          nameInComfy: "ModelSamplingContinuousV"
      }
      interface ModelSamplingContinuousV_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelSamplingContinuousV_input {
          model: Comfy.Input.MODEL
          sampling: Comfy.Union.E_3c3164c6c468d61dfa20092960e3d7854495e50c
          /** default=500 min=1000 max=1000 step=0.001 */
          sigma_max?: Comfy.Input.FLOAT
          /** default=0.03 min=1000 max=1000 step=0.001 */
          sigma_min?: Comfy.Input.FLOAT
      }
      interface ModelSamplingStableCascade extends HasSingle_MODEL, ComfyNode<ModelSamplingStableCascade_input, ModelSamplingStableCascade_output> {
          nameInComfy: "ModelSamplingStableCascade"
      }
      interface ModelSamplingStableCascade_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelSamplingStableCascade_input {
          model: Comfy.Input.MODEL
          /** default=2 min=100 max=100 step=0.01 */
          shift?: Comfy.Input.FLOAT
      }
      interface ModelSamplingSD3 extends HasSingle_MODEL, ComfyNode<ModelSamplingSD3_input, ModelSamplingSD3_output> {
          nameInComfy: "ModelSamplingSD3"
      }
      interface ModelSamplingSD3_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelSamplingSD3_input {
          model: Comfy.Input.MODEL
          /** default=3 min=100 max=100 step=0.01 */
          shift?: Comfy.Input.FLOAT
      }
      interface ModelSamplingAuraFlow extends HasSingle_MODEL, ComfyNode<ModelSamplingAuraFlow_input, ModelSamplingAuraFlow_output> {
          nameInComfy: "ModelSamplingAuraFlow"
      }
      interface ModelSamplingAuraFlow_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelSamplingAuraFlow_input {
          model: Comfy.Input.MODEL
          /** default=1.73 min=100 max=100 step=0.01 */
          shift?: Comfy.Input.FLOAT
      }
      interface ModelSamplingFlux extends HasSingle_MODEL, ComfyNode<ModelSamplingFlux_input, ModelSamplingFlux_output> {
          nameInComfy: "ModelSamplingFlux"
      }
      interface ModelSamplingFlux_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelSamplingFlux_input {
          model: Comfy.Input.MODEL
          /** default=1.15 min=100 max=100 step=0.01 */
          max_shift?: Comfy.Input.FLOAT
          /** default=0.5 min=100 max=100 step=0.01 */
          base_shift?: Comfy.Input.FLOAT
          /** default=1024 min=16384 max=16384 step=8 */
          width?: Comfy.Input.INT
          /** default=1024 min=16384 max=16384 step=8 */
          height?: Comfy.Input.INT
      }
      interface RescaleCFG extends HasSingle_MODEL, ComfyNode<RescaleCFG_input, RescaleCFG_output> {
          nameInComfy: "RescaleCFG"
      }
      interface RescaleCFG_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface RescaleCFG_input {
          model: Comfy.Input.MODEL
          /** default=0.7 min=1 max=1 step=0.01 */
          multiplier?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_model_downscale
   namespace Comfy.Extra.model_downscale {
      interface Nodes {
          /** category="model_patches_unet" name="PatchModelAddDownscale" output=[MODEL] */
         PatchModelAddDownscale(p: PatchModelAddDownscale_input, meta?: ComfyNodeMetadata): PatchModelAddDownscale
      }
      interface PatchModelAddDownscale extends HasSingle_MODEL, ComfyNode<PatchModelAddDownscale_input, PatchModelAddDownscale_output> {
          nameInComfy: "PatchModelAddDownscale"
      }
      interface PatchModelAddDownscale_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface PatchModelAddDownscale_input {
          model: Comfy.Input.MODEL
          /** default=3 min=32 max=32 step=1 */
          block_number?: Comfy.Input.INT
          /** default=2 min=9 max=9 step=0.001 */
          downscale_factor?: Comfy.Input.FLOAT
          /** default=0 min=1 max=1 step=0.001 */
          start_percent?: Comfy.Input.FLOAT
          /** default=0.35 min=1 max=1 step=0.001 */
          end_percent?: Comfy.Input.FLOAT
          /** default=true */
          downscale_after_skip?: Comfy.Input.BOOLEAN
          downscale_method: Comfy.Union.E_6e6cbf6c48411ad480e010b0c9d2434b41af430d
          upscale_method: Comfy.Union.E_6e6cbf6c48411ad480e010b0c9d2434b41af430d
      }
   }
   
   // comfy_extras.nodes_images
   namespace Comfy.Extra.images {
      interface Nodes {
          /** category="image_transform" name="ImageCrop" output=[IMAGE] */
         ImageCrop(p: ImageCrop_input, meta?: ComfyNodeMetadata): ImageCrop
          /** category="image_batch" name="RepeatImageBatch" output=[IMAGE] */
         RepeatImageBatch(p: RepeatImageBatch_input, meta?: ComfyNodeMetadata): RepeatImageBatch
          /** category="image_batch" name="ImageFromBatch" output=[IMAGE] */
         ImageFromBatch(p: ImageFromBatch_input, meta?: ComfyNodeMetadata): ImageFromBatch
          /** category="image_animation" name="SaveAnimatedWEBP" output=[] */
         SaveAnimatedWEBP(p: SaveAnimatedWEBP_input, meta?: ComfyNodeMetadata): SaveAnimatedWEBP
          /** category="image_animation" name="SaveAnimatedPNG" output=[] */
         SaveAnimatedPNG(p: SaveAnimatedPNG_input, meta?: ComfyNodeMetadata): SaveAnimatedPNG
      }
      interface ImageCrop extends HasSingle_IMAGE, ComfyNode<ImageCrop_input, ImageCrop_output> {
          nameInComfy: "ImageCrop"
      }
      interface ImageCrop_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageCrop_input {
          image: Comfy.Input.IMAGE
          /** default=512 min=16384 max=16384 step=1 */
          width?: Comfy.Input.INT
          /** default=512 min=16384 max=16384 step=1 */
          height?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=1 */
          x?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=1 */
          y?: Comfy.Input.INT
      }
      interface RepeatImageBatch extends HasSingle_IMAGE, ComfyNode<RepeatImageBatch_input, RepeatImageBatch_output> {
          nameInComfy: "RepeatImageBatch"
      }
      interface RepeatImageBatch_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface RepeatImageBatch_input {
          image: Comfy.Input.IMAGE
          /** default=1 min=4096 max=4096 */
          amount?: Comfy.Input.INT
      }
      interface ImageFromBatch extends HasSingle_IMAGE, ComfyNode<ImageFromBatch_input, ImageFromBatch_output> {
          nameInComfy: "ImageFromBatch"
      }
      interface ImageFromBatch_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageFromBatch_input {
          image: Comfy.Input.IMAGE
          /** default=0 min=4095 max=4095 */
          batch_index?: Comfy.Input.INT
          /** default=1 min=4096 max=4096 */
          length?: Comfy.Input.INT
      }
      interface SaveAnimatedWEBP extends ComfyNode<SaveAnimatedWEBP_input, SaveAnimatedWEBP_output> {
          nameInComfy: "SaveAnimatedWEBP"
      }
      interface SaveAnimatedWEBP_output {
      }
      interface SaveAnimatedWEBP_input {
          images: Comfy.Input.IMAGE
          /** default="ComfyUI" */
          filename_prefix?: Comfy.Input.STRING
          /** default=6 min=1000 max=1000 step=0.01 */
          fps?: Comfy.Input.FLOAT
          /** default=true */
          lossless?: Comfy.Input.BOOLEAN
          /** default=80 min=100 max=100 */
          quality?: Comfy.Input.INT
          method: Comfy.Union.E_253b68425542d8144b2b8a7af90f057b41939f63
      }
      interface SaveAnimatedPNG extends ComfyNode<SaveAnimatedPNG_input, SaveAnimatedPNG_output> {
          nameInComfy: "SaveAnimatedPNG"
      }
      interface SaveAnimatedPNG_output {
      }
      interface SaveAnimatedPNG_input {
          images: Comfy.Input.IMAGE
          /** default="ComfyUI" */
          filename_prefix?: Comfy.Input.STRING
          /** default=6 min=1000 max=1000 step=0.01 */
          fps?: Comfy.Input.FLOAT
          /** default=4 min=9 max=9 */
          compress_level?: Comfy.Input.INT
      }
   }
   
   // comfy_extras.nodes_video_model
   namespace Comfy.Extra.video_model {
      interface Nodes {
          /** category="loaders_video_models" name="ImageOnlyCheckpointLoader" output=[MODEL, CLIP_VISION, VAE] */
         ImageOnlyCheckpointLoader(p: ImageOnlyCheckpointLoader_input, meta?: ComfyNodeMetadata): ImageOnlyCheckpointLoader
          /** category="conditioning_video_models" name="SVD_img2vid_Conditioning" output=[positive, negative, latent] */
         SVD$_img2vid$_Conditioning(p: SVD$_img2vid$_Conditioning_input, meta?: ComfyNodeMetadata): SVD$_img2vid$_Conditioning
          /** category="sampling_video_models" name="VideoLinearCFGGuidance" output=[MODEL] */
         VideoLinearCFGGuidance(p: VideoLinearCFGGuidance_input, meta?: ComfyNodeMetadata): VideoLinearCFGGuidance
          /** category="sampling_video_models" name="VideoTriangleCFGGuidance" output=[MODEL] */
         VideoTriangleCFGGuidance(p: VideoTriangleCFGGuidance_input, meta?: ComfyNodeMetadata): VideoTriangleCFGGuidance
          /** category="advanced_model_merging" name="ImageOnlyCheckpointSave" output=[] */
         ImageOnlyCheckpointSave(p: ImageOnlyCheckpointSave_input, meta?: ComfyNodeMetadata): ImageOnlyCheckpointSave
      }
      interface ImageOnlyCheckpointLoader extends HasSingle_MODEL, HasSingle_CLIP_VISION, HasSingle_VAE, ComfyNode<ImageOnlyCheckpointLoader_input, ImageOnlyCheckpointLoader_output> {
          nameInComfy: "ImageOnlyCheckpointLoader"
      }
      interface ImageOnlyCheckpointLoader_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
          CLIP_VISION: ComfyNodeOutput<'CLIP_VISION', 1>,
          VAE: ComfyNodeOutput<'VAE', 2>,
      }
      interface ImageOnlyCheckpointLoader_input {
          ckpt_name: Comfy.Union.E_1f08f73a9a576ae570aa3d82ea94f2bcfc29a8fc
      }
      interface SVD$_img2vid$_Conditioning extends HasSingle_LATENT, ComfyNode<SVD$_img2vid$_Conditioning_input, SVD$_img2vid$_Conditioning_output> {
          nameInComfy: "SVD_img2vid_Conditioning"
      }
      interface SVD$_img2vid$_Conditioning_output {
          positive: ComfyNodeOutput<'CONDITIONING', 0>,
          negative: ComfyNodeOutput<'CONDITIONING', 1>,
          latent: ComfyNodeOutput<'LATENT', 2>,
      }
      interface SVD$_img2vid$_Conditioning_input {
          clip_vision: Comfy.Input.CLIP_VISION
          init_image: Comfy.Input.IMAGE
          vae: Comfy.Input.VAE
          /** default=1024 min=16384 max=16384 step=8 */
          width?: Comfy.Input.INT
          /** default=576 min=16384 max=16384 step=8 */
          height?: Comfy.Input.INT
          /** default=14 min=4096 max=4096 */
          video_frames?: Comfy.Input.INT
          /** default=127 min=1023 max=1023 */
          motion_bucket_id?: Comfy.Input.INT
          /** default=6 min=1024 max=1024 */
          fps?: Comfy.Input.INT
          /** default=0 min=10 max=10 step=0.01 */
          augmentation_level?: Comfy.Input.FLOAT
      }
      interface VideoLinearCFGGuidance extends HasSingle_MODEL, ComfyNode<VideoLinearCFGGuidance_input, VideoLinearCFGGuidance_output> {
          nameInComfy: "VideoLinearCFGGuidance"
      }
      interface VideoLinearCFGGuidance_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface VideoLinearCFGGuidance_input {
          model: Comfy.Input.MODEL
          /** default=1 min=100 max=100 step=0.5 */
          min_cfg?: Comfy.Input.FLOAT
      }
      interface VideoTriangleCFGGuidance extends HasSingle_MODEL, ComfyNode<VideoTriangleCFGGuidance_input, VideoTriangleCFGGuidance_output> {
          nameInComfy: "VideoTriangleCFGGuidance"
      }
      interface VideoTriangleCFGGuidance_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface VideoTriangleCFGGuidance_input {
          model: Comfy.Input.MODEL
          /** default=1 min=100 max=100 step=0.5 */
          min_cfg?: Comfy.Input.FLOAT
      }
      interface ImageOnlyCheckpointSave extends ComfyNode<ImageOnlyCheckpointSave_input, ImageOnlyCheckpointSave_output> {
          nameInComfy: "ImageOnlyCheckpointSave"
      }
      interface ImageOnlyCheckpointSave_output {
      }
      interface ImageOnlyCheckpointSave_input {
          model: Comfy.Input.MODEL
          clip_vision: Comfy.Input.CLIP_VISION
          vae: Comfy.Input.VAE
          /** default="checkpoints/ComfyUI" */
          filename_prefix?: Comfy.Input.STRING
      }
   }
   
   // comfy_extras.nodes_sag
   namespace Comfy.Extra.sag {
      interface Nodes {
          /** category="_for_testing" name="SelfAttentionGuidance" output=[MODEL] */
         SelfAttentionGuidance(p: SelfAttentionGuidance_input, meta?: ComfyNodeMetadata): SelfAttentionGuidance
      }
      interface SelfAttentionGuidance extends HasSingle_MODEL, ComfyNode<SelfAttentionGuidance_input, SelfAttentionGuidance_output> {
          nameInComfy: "SelfAttentionGuidance"
      }
      interface SelfAttentionGuidance_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface SelfAttentionGuidance_input {
          model: Comfy.Input.MODEL
          /** default=0.5 min=5 max=5 step=0.01 */
          scale?: Comfy.Input.FLOAT
          /** default=2 min=10 max=10 step=0.1 */
          blur_sigma?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_perpneg
   namespace Comfy.Extra.perpneg {
      interface Nodes {
          /** category="_for_testing" name="PerpNeg" output=[MODEL] */
         PerpNeg(p: PerpNeg_input, meta?: ComfyNodeMetadata): PerpNeg
          /** category="_for_testing" name="PerpNegGuider" output=[GUIDER] */
         PerpNegGuider(p: PerpNegGuider_input, meta?: ComfyNodeMetadata): PerpNegGuider
      }
      interface PerpNeg extends HasSingle_MODEL, ComfyNode<PerpNeg_input, PerpNeg_output> {
          nameInComfy: "PerpNeg"
      }
      interface PerpNeg_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface PerpNeg_input {
          model: Comfy.Input.MODEL
          empty_conditioning: Comfy.Input.CONDITIONING
          /** default=1 min=100 max=100 step=0.01 */
          neg_scale?: Comfy.Input.FLOAT
      }
      interface PerpNegGuider extends HasSingle_GUIDER, ComfyNode<PerpNegGuider_input, PerpNegGuider_output> {
          nameInComfy: "PerpNegGuider"
      }
      interface PerpNegGuider_output {
          GUIDER: ComfyNodeOutput<'GUIDER', 0>,
      }
      interface PerpNegGuider_input {
          model: Comfy.Input.MODEL
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          empty_conditioning: Comfy.Input.CONDITIONING
          /** default=8 min=100 max=100 step=0.1 */
          cfg?: Comfy.Input.FLOAT
          /** default=1 min=100 max=100 step=0.01 */
          neg_scale?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_stable3d
   namespace Comfy.Extra.stable3d {
      interface Nodes {
          /** category="conditioning_3d_models" name="StableZero123_Conditioning" output=[positive, negative, latent] */
         StableZero123$_Conditioning(p: StableZero123$_Conditioning_input, meta?: ComfyNodeMetadata): StableZero123$_Conditioning
          /** category="conditioning_3d_models" name="StableZero123_Conditioning_Batched" output=[positive, negative, latent] */
         StableZero123$_Conditioning$_Batched(p: StableZero123$_Conditioning$_Batched_input, meta?: ComfyNodeMetadata): StableZero123$_Conditioning$_Batched
          /** category="conditioning_3d_models" name="SV3D_Conditioning" output=[positive, negative, latent] */
         SV3D$_Conditioning(p: SV3D$_Conditioning_input, meta?: ComfyNodeMetadata): SV3D$_Conditioning
      }
      interface StableZero123$_Conditioning extends HasSingle_LATENT, ComfyNode<StableZero123$_Conditioning_input, StableZero123$_Conditioning_output> {
          nameInComfy: "StableZero123_Conditioning"
      }
      interface StableZero123$_Conditioning_output {
          positive: ComfyNodeOutput<'CONDITIONING', 0>,
          negative: ComfyNodeOutput<'CONDITIONING', 1>,
          latent: ComfyNodeOutput<'LATENT', 2>,
      }
      interface StableZero123$_Conditioning_input {
          clip_vision: Comfy.Input.CLIP_VISION
          init_image: Comfy.Input.IMAGE
          vae: Comfy.Input.VAE
          /** default=256 min=16384 max=16384 step=8 */
          width?: Comfy.Input.INT
          /** default=256 min=16384 max=16384 step=8 */
          height?: Comfy.Input.INT
          /** default=1 min=4096 max=4096 */
          batch_size?: Comfy.Input.INT
          /** default=0 min=180 max=180 step=0.1 */
          elevation?: Comfy.Input.FLOAT
          /** default=0 min=180 max=180 step=0.1 */
          azimuth?: Comfy.Input.FLOAT
      }
      interface StableZero123$_Conditioning$_Batched extends HasSingle_LATENT, ComfyNode<StableZero123$_Conditioning$_Batched_input, StableZero123$_Conditioning$_Batched_output> {
          nameInComfy: "StableZero123_Conditioning_Batched"
      }
      interface StableZero123$_Conditioning$_Batched_output {
          positive: ComfyNodeOutput<'CONDITIONING', 0>,
          negative: ComfyNodeOutput<'CONDITIONING', 1>,
          latent: ComfyNodeOutput<'LATENT', 2>,
      }
      interface StableZero123$_Conditioning$_Batched_input {
          clip_vision: Comfy.Input.CLIP_VISION
          init_image: Comfy.Input.IMAGE
          vae: Comfy.Input.VAE
          /** default=256 min=16384 max=16384 step=8 */
          width?: Comfy.Input.INT
          /** default=256 min=16384 max=16384 step=8 */
          height?: Comfy.Input.INT
          /** default=1 min=4096 max=4096 */
          batch_size?: Comfy.Input.INT
          /** default=0 min=180 max=180 step=0.1 */
          elevation?: Comfy.Input.FLOAT
          /** default=0 min=180 max=180 step=0.1 */
          azimuth?: Comfy.Input.FLOAT
          /** default=0 min=180 max=180 step=0.1 */
          elevation_batch_increment?: Comfy.Input.FLOAT
          /** default=0 min=180 max=180 step=0.1 */
          azimuth_batch_increment?: Comfy.Input.FLOAT
      }
      interface SV3D$_Conditioning extends HasSingle_LATENT, ComfyNode<SV3D$_Conditioning_input, SV3D$_Conditioning_output> {
          nameInComfy: "SV3D_Conditioning"
      }
      interface SV3D$_Conditioning_output {
          positive: ComfyNodeOutput<'CONDITIONING', 0>,
          negative: ComfyNodeOutput<'CONDITIONING', 1>,
          latent: ComfyNodeOutput<'LATENT', 2>,
      }
      interface SV3D$_Conditioning_input {
          clip_vision: Comfy.Input.CLIP_VISION
          init_image: Comfy.Input.IMAGE
          vae: Comfy.Input.VAE
          /** default=576 min=16384 max=16384 step=8 */
          width?: Comfy.Input.INT
          /** default=576 min=16384 max=16384 step=8 */
          height?: Comfy.Input.INT
          /** default=21 min=4096 max=4096 */
          video_frames?: Comfy.Input.INT
          /** default=0 min=90 max=90 step=0.1 */
          elevation?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_sdupscale
   namespace Comfy.Extra.sdupscale {
      interface Nodes {
          /** category="conditioning_upscale_diffusion" name="SD_4XUpscale_Conditioning" output=[positive, negative, latent] */
         SD$_4XUpscale$_Conditioning(p: SD$_4XUpscale$_Conditioning_input, meta?: ComfyNodeMetadata): SD$_4XUpscale$_Conditioning
      }
      interface SD$_4XUpscale$_Conditioning extends HasSingle_LATENT, ComfyNode<SD$_4XUpscale$_Conditioning_input, SD$_4XUpscale$_Conditioning_output> {
          nameInComfy: "SD_4XUpscale_Conditioning"
      }
      interface SD$_4XUpscale$_Conditioning_output {
          positive: ComfyNodeOutput<'CONDITIONING', 0>,
          negative: ComfyNodeOutput<'CONDITIONING', 1>,
          latent: ComfyNodeOutput<'LATENT', 2>,
      }
      interface SD$_4XUpscale$_Conditioning_input {
          images: Comfy.Input.IMAGE
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          /** default=4 min=10 max=10 step=0.01 */
          scale_ratio?: Comfy.Input.FLOAT
          /** default=0 min=1 max=1 step=0.001 */
          noise_augmentation?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_photomaker
   namespace Comfy.Extra.photomaker {
      interface Nodes {
          /** category="_for_testing_photomaker" name="PhotoMakerLoader" output=[PHOTOMAKER] */
         PhotoMakerLoader(p: PhotoMakerLoader_input, meta?: ComfyNodeMetadata): PhotoMakerLoader
          /** category="_for_testing_photomaker" name="PhotoMakerEncode" output=[CONDITIONING] */
         PhotoMakerEncode(p: PhotoMakerEncode_input, meta?: ComfyNodeMetadata): PhotoMakerEncode
      }
      interface PhotoMakerLoader extends HasSingle_PHOTOMAKER, ComfyNode<PhotoMakerLoader_input, PhotoMakerLoader_output> {
          nameInComfy: "PhotoMakerLoader"
      }
      interface PhotoMakerLoader_output {
          PHOTOMAKER: ComfyNodeOutput<'PHOTOMAKER', 0>,
      }
      interface PhotoMakerLoader_input {
          photomaker_model_name: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
      }
      interface PhotoMakerEncode extends HasSingle_CONDITIONING, ComfyNode<PhotoMakerEncode_input, PhotoMakerEncode_output> {
          nameInComfy: "PhotoMakerEncode"
      }
      interface PhotoMakerEncode_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface PhotoMakerEncode_input {
          photomaker: Comfy.Input.PHOTOMAKER
          image: Comfy.Input.IMAGE
          clip: Comfy.Input.CLIP
          /** default="photograph of photomaker" */
          text?: Comfy.Input.STRING
      }
   }
   
   // comfy_extras.nodes_cond
   namespace Comfy.Extra.cond {
      interface Nodes {
          /** category="_for_testing_conditioning" name="CLIPTextEncodeControlnet" output=[CONDITIONING] */
         CLIPTextEncodeControlnet(p: CLIPTextEncodeControlnet_input, meta?: ComfyNodeMetadata): CLIPTextEncodeControlnet
      }
      interface CLIPTextEncodeControlnet extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncodeControlnet_input, CLIPTextEncodeControlnet_output> {
          nameInComfy: "CLIPTextEncodeControlnet"
      }
      interface CLIPTextEncodeControlnet_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface CLIPTextEncodeControlnet_input {
          clip: Comfy.Input.CLIP
          conditioning: Comfy.Input.CONDITIONING
          /** */
          text: Comfy.Input.STRING
      }
   }
   
   // comfy_extras.nodes_morphology
   namespace Comfy.Extra.morphology {
      interface Nodes {
          /** category="image_postprocessing" name="Morphology" output=[IMAGE] */
         Morphology(p: Morphology_input, meta?: ComfyNodeMetadata): Morphology
      }
      interface Morphology extends HasSingle_IMAGE, ComfyNode<Morphology_input, Morphology_output> {
          nameInComfy: "Morphology"
      }
      interface Morphology_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface Morphology_input {
          image: Comfy.Input.IMAGE
          operation: Comfy.Union.E_6ba03252ec9c8111f7381dfb573cd99c2b4d0e3b
          /** default=3 min=999 max=999 step=1 */
          kernel_size?: Comfy.Input.INT
      }
   }
   
   // comfy_extras.nodes_stable_cascade
   namespace Comfy.Extra.stable_cascade {
      interface Nodes {
          /** category="latent_stable_cascade" name="StableCascade_EmptyLatentImage" output=[stage_c, stage_b] */
         StableCascade$_EmptyLatentImage(p: StableCascade$_EmptyLatentImage_input, meta?: ComfyNodeMetadata): StableCascade$_EmptyLatentImage
          /** category="conditioning_stable_cascade" name="StableCascade_StageB_Conditioning" output=[CONDITIONING] */
         StableCascade$_StageB$_Conditioning(p: StableCascade$_StageB$_Conditioning_input, meta?: ComfyNodeMetadata): StableCascade$_StageB$_Conditioning
          /** category="latent_stable_cascade" name="StableCascade_StageC_VAEEncode" output=[stage_c, stage_b] */
         StableCascade$_StageC$_VAEEncode(p: StableCascade$_StageC$_VAEEncode_input, meta?: ComfyNodeMetadata): StableCascade$_StageC$_VAEEncode
          /** category="_for_testing_stable_cascade" name="StableCascade_SuperResolutionControlnet" output=[controlnet_input, stage_c, stage_b] */
         StableCascade$_SuperResolutionControlnet(p: StableCascade$_SuperResolutionControlnet_input, meta?: ComfyNodeMetadata): StableCascade$_SuperResolutionControlnet
      }
      interface StableCascade$_EmptyLatentImage extends ComfyNode<StableCascade$_EmptyLatentImage_input, StableCascade$_EmptyLatentImage_output> {
          nameInComfy: "StableCascade_EmptyLatentImage"
      }
      interface StableCascade$_EmptyLatentImage_output {
          stage_c: ComfyNodeOutput<'LATENT', 0>,
          stage_b: ComfyNodeOutput<'LATENT', 1>,
      }
      interface StableCascade$_EmptyLatentImage_input {
          /** default=1024 min=16384 max=16384 step=8 */
          width?: Comfy.Input.INT
          /** default=1024 min=16384 max=16384 step=8 */
          height?: Comfy.Input.INT
          /** default=42 min=128 max=128 step=1 */
          compression?: Comfy.Input.INT
          /** default=1 min=4096 max=4096 */
          batch_size?: Comfy.Input.INT
      }
      interface StableCascade$_StageB$_Conditioning extends HasSingle_CONDITIONING, ComfyNode<StableCascade$_StageB$_Conditioning_input, StableCascade$_StageB$_Conditioning_output> {
          nameInComfy: "StableCascade_StageB_Conditioning"
      }
      interface StableCascade$_StageB$_Conditioning_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface StableCascade$_StageB$_Conditioning_input {
          conditioning: Comfy.Input.CONDITIONING
          stage_c: Comfy.Input.LATENT
      }
      interface StableCascade$_StageC$_VAEEncode extends ComfyNode<StableCascade$_StageC$_VAEEncode_input, StableCascade$_StageC$_VAEEncode_output> {
          nameInComfy: "StableCascade_StageC_VAEEncode"
      }
      interface StableCascade$_StageC$_VAEEncode_output {
          stage_c: ComfyNodeOutput<'LATENT', 0>,
          stage_b: ComfyNodeOutput<'LATENT', 1>,
      }
      interface StableCascade$_StageC$_VAEEncode_input {
          image: Comfy.Input.IMAGE
          vae: Comfy.Input.VAE
          /** default=42 min=128 max=128 step=1 */
          compression?: Comfy.Input.INT
      }
      interface StableCascade$_SuperResolutionControlnet extends HasSingle_IMAGE, ComfyNode<StableCascade$_SuperResolutionControlnet_input, StableCascade$_SuperResolutionControlnet_output> {
          nameInComfy: "StableCascade_SuperResolutionControlnet"
      }
      interface StableCascade$_SuperResolutionControlnet_output {
          controlnet_input: ComfyNodeOutput<'IMAGE', 0>,
          stage_c: ComfyNodeOutput<'LATENT', 1>,
          stage_b: ComfyNodeOutput<'LATENT', 2>,
      }
      interface StableCascade$_SuperResolutionControlnet_input {
          image: Comfy.Input.IMAGE
          vae: Comfy.Input.VAE
      }
   }
   
   // comfy_extras.nodes_differential_diffusion
   namespace Comfy.Extra.differential_diffusion {
      interface Nodes {
          /** category="_for_testing" name="DifferentialDiffusion" output=[MODEL] */
         DifferentialDiffusion(p: DifferentialDiffusion_input, meta?: ComfyNodeMetadata): DifferentialDiffusion
      }
      interface DifferentialDiffusion extends HasSingle_MODEL, ComfyNode<DifferentialDiffusion_input, DifferentialDiffusion_output> {
          nameInComfy: "DifferentialDiffusion"
      }
      interface DifferentialDiffusion_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface DifferentialDiffusion_input {
          model: Comfy.Input.MODEL
      }
   }
   
   // comfy_extras.nodes_ip2p
   namespace Comfy.Extra.ip2p {
      interface Nodes {
          /** category="conditioning_instructpix2pix" name="InstructPixToPixConditioning" output=[positive, negative, latent] */
         InstructPixToPixConditioning(p: InstructPixToPixConditioning_input, meta?: ComfyNodeMetadata): InstructPixToPixConditioning
      }
      interface InstructPixToPixConditioning extends HasSingle_LATENT, ComfyNode<InstructPixToPixConditioning_input, InstructPixToPixConditioning_output> {
          nameInComfy: "InstructPixToPixConditioning"
      }
      interface InstructPixToPixConditioning_output {
          positive: ComfyNodeOutput<'CONDITIONING', 0>,
          negative: ComfyNodeOutput<'CONDITIONING', 1>,
          latent: ComfyNodeOutput<'LATENT', 2>,
      }
      interface InstructPixToPixConditioning_input {
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          vae: Comfy.Input.VAE
          pixels: Comfy.Input.IMAGE
      }
   }
   
   // comfy_extras.nodes_model_merging_model_specific
   namespace Comfy.Extra.model_merging_model_specific {
      interface Nodes {
          /** category="advanced_model_merging_model_specific" name="ModelMergeSD1" output=[MODEL] */
         ModelMergeSD1(p: ModelMergeSD1_input, meta?: ComfyNodeMetadata): ModelMergeSD1
          /** category="advanced_model_merging_model_specific" name="ModelMergeSD2" output=[MODEL] */
         ModelMergeSD2(p: ModelMergeSD2_input, meta?: ComfyNodeMetadata): ModelMergeSD2
          /** category="advanced_model_merging_model_specific" name="ModelMergeSDXL" output=[MODEL] */
         ModelMergeSDXL(p: ModelMergeSDXL_input, meta?: ComfyNodeMetadata): ModelMergeSDXL
          /** category="advanced_model_merging_model_specific" name="ModelMergeSD3_2B" output=[MODEL] */
         ModelMergeSD3$_2B(p: ModelMergeSD3$_2B_input, meta?: ComfyNodeMetadata): ModelMergeSD3$_2B
          /** category="advanced_model_merging_model_specific" name="ModelMergeFlux1" output=[MODEL] */
         ModelMergeFlux1(p: ModelMergeFlux1_input, meta?: ComfyNodeMetadata): ModelMergeFlux1
          /** category="advanced_model_merging_model_specific" name="ModelMergeSD35_Large" output=[MODEL] */
         ModelMergeSD35$_Large(p: ModelMergeSD35$_Large_input, meta?: ComfyNodeMetadata): ModelMergeSD35$_Large
      }
      interface ModelMergeSD1 extends HasSingle_MODEL, ComfyNode<ModelMergeSD1_input, ModelMergeSD1_output> {
          nameInComfy: "ModelMergeSD1"
      }
      interface ModelMergeSD1_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelMergeSD1_input {
          model1: Comfy.Input.MODEL
          model2: Comfy.Input.MODEL
          /** default=1 min=1 max=1 step=0.01 */
          "time_embed."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "label_emb."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.0."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.1."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.2."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.3."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.4."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.5."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.6."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.7."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.8."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.9."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.10."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.11."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "middle_block.0."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "middle_block.1."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "middle_block.2."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.0."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.1."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.2."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.3."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.4."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.5."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.6."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.7."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.8."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.9."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.10."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.11."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "out."?: Comfy.Input.FLOAT
      }
      interface ModelMergeSD2 extends HasSingle_MODEL, ComfyNode<ModelMergeSD2_input, ModelMergeSD2_output> {
          nameInComfy: "ModelMergeSD2"
      }
      interface ModelMergeSD2_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelMergeSD2_input {
          model1: Comfy.Input.MODEL
          model2: Comfy.Input.MODEL
          /** default=1 min=1 max=1 step=0.01 */
          "time_embed."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "label_emb."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.0."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.1."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.2."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.3."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.4."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.5."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.6."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.7."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.8."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.9."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.10."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.11."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "middle_block.0."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "middle_block.1."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "middle_block.2."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.0."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.1."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.2."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.3."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.4."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.5."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.6."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.7."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.8."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.9."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.10."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.11."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "out."?: Comfy.Input.FLOAT
      }
      interface ModelMergeSDXL extends HasSingle_MODEL, ComfyNode<ModelMergeSDXL_input, ModelMergeSDXL_output> {
          nameInComfy: "ModelMergeSDXL"
      }
      interface ModelMergeSDXL_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelMergeSDXL_input {
          model1: Comfy.Input.MODEL
          model2: Comfy.Input.MODEL
          /** default=1 min=1 max=1 step=0.01 */
          "time_embed."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "label_emb."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.0"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.1"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.2"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.3"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.4"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.5"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.6"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.7"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "input_blocks.8"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "middle_block.0"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "middle_block.1"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "middle_block.2"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.0"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.1"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.2"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.3"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.4"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.5"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.6"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.7"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "output_blocks.8"?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "out."?: Comfy.Input.FLOAT
      }
      interface ModelMergeSD3$_2B extends HasSingle_MODEL, ComfyNode<ModelMergeSD3$_2B_input, ModelMergeSD3$_2B_output> {
          nameInComfy: "ModelMergeSD3_2B"
      }
      interface ModelMergeSD3$_2B_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelMergeSD3$_2B_input {
          model1: Comfy.Input.MODEL
          model2: Comfy.Input.MODEL
          /** default=1 min=1 max=1 step=0.01 */
          "pos_embed."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "x_embedder."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "context_embedder."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "y_embedder."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "t_embedder."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.0."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.1."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.2."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.3."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.4."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.5."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.6."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.7."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.8."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.9."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.10."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.11."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.12."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.13."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.14."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.15."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.16."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.17."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.18."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.19."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.20."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.21."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.22."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.23."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "final_layer."?: Comfy.Input.FLOAT
      }
      interface ModelMergeFlux1 extends HasSingle_MODEL, ComfyNode<ModelMergeFlux1_input, ModelMergeFlux1_output> {
          nameInComfy: "ModelMergeFlux1"
      }
      interface ModelMergeFlux1_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelMergeFlux1_input {
          model1: Comfy.Input.MODEL
          model2: Comfy.Input.MODEL
          /** default=1 min=1 max=1 step=0.01 */
          "img_in."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "time_in."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          guidance_in?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "vector_in."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "txt_in."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.0."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.1."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.2."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.3."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.4."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.5."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.6."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.7."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.8."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.9."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.10."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.11."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.12."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.13."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.14."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.15."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.16."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.17."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "double_blocks.18."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.0."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.1."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.2."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.3."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.4."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.5."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.6."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.7."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.8."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.9."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.10."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.11."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.12."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.13."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.14."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.15."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.16."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.17."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.18."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.19."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.20."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.21."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.22."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.23."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.24."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.25."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.26."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.27."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.28."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.29."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.30."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.31."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.32."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.33."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.34."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.35."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.36."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "single_blocks.37."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "final_layer."?: Comfy.Input.FLOAT
      }
      interface ModelMergeSD35$_Large extends HasSingle_MODEL, ComfyNode<ModelMergeSD35$_Large_input, ModelMergeSD35$_Large_output> {
          nameInComfy: "ModelMergeSD35_Large"
      }
      interface ModelMergeSD35$_Large_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface ModelMergeSD35$_Large_input {
          model1: Comfy.Input.MODEL
          model2: Comfy.Input.MODEL
          /** default=1 min=1 max=1 step=0.01 */
          "pos_embed."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "x_embedder."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "context_embedder."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "y_embedder."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "t_embedder."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.0."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.1."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.2."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.3."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.4."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.5."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.6."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.7."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.8."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.9."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.10."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.11."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.12."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.13."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.14."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.15."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.16."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.17."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.18."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.19."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.20."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.21."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.22."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.23."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.24."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.25."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.26."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.27."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.28."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.29."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.30."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.31."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.32."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.33."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.34."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.35."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.36."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "joint_blocks.37."?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          "final_layer."?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_pag
   namespace Comfy.Extra.pag {
      interface Nodes {
          /** category="model_patches_unet" name="PerturbedAttentionGuidance" output=[MODEL] */
         PerturbedAttentionGuidance(p: PerturbedAttentionGuidance_input, meta?: ComfyNodeMetadata): PerturbedAttentionGuidance
      }
      interface PerturbedAttentionGuidance extends HasSingle_MODEL, ComfyNode<PerturbedAttentionGuidance_input, PerturbedAttentionGuidance_output> {
          nameInComfy: "PerturbedAttentionGuidance"
      }
      interface PerturbedAttentionGuidance_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface PerturbedAttentionGuidance_input {
          model: Comfy.Input.MODEL
          /** default=3 min=100 max=100 step=0.01 */
          scale?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_align_your_steps
   namespace Comfy.Extra.align_your_steps {
      interface Nodes {
          /** category="sampling_custom_sampling_schedulers" name="AlignYourStepsScheduler" output=[SIGMAS] */
         AlignYourStepsScheduler(p: AlignYourStepsScheduler_input, meta?: ComfyNodeMetadata): AlignYourStepsScheduler
      }
      interface AlignYourStepsScheduler extends HasSingle_SIGMAS, ComfyNode<AlignYourStepsScheduler_input, AlignYourStepsScheduler_output> {
          nameInComfy: "AlignYourStepsScheduler"
      }
      interface AlignYourStepsScheduler_output {
          SIGMAS: ComfyNodeOutput<'SIGMAS', 0>,
      }
      interface AlignYourStepsScheduler_input {
          model_type: Comfy.Union.E_ec317371192386ae10cedaee29b315e900386a18
          /** default=10 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_attention_multiply
   namespace Comfy.Extra.attention_multiply {
      interface Nodes {
          /** category="_for_testing_attention_experiments" name="UNetSelfAttentionMultiply" output=[MODEL] */
         UNetSelfAttentionMultiply(p: UNetSelfAttentionMultiply_input, meta?: ComfyNodeMetadata): UNetSelfAttentionMultiply
          /** category="_for_testing_attention_experiments" name="UNetCrossAttentionMultiply" output=[MODEL] */
         UNetCrossAttentionMultiply(p: UNetCrossAttentionMultiply_input, meta?: ComfyNodeMetadata): UNetCrossAttentionMultiply
          /** category="_for_testing_attention_experiments" name="CLIPAttentionMultiply" output=[CLIP] */
         CLIPAttentionMultiply(p: CLIPAttentionMultiply_input, meta?: ComfyNodeMetadata): CLIPAttentionMultiply
          /** category="_for_testing_attention_experiments" name="UNetTemporalAttentionMultiply" output=[MODEL] */
         UNetTemporalAttentionMultiply(p: UNetTemporalAttentionMultiply_input, meta?: ComfyNodeMetadata): UNetTemporalAttentionMultiply
      }
      interface UNetSelfAttentionMultiply extends HasSingle_MODEL, ComfyNode<UNetSelfAttentionMultiply_input, UNetSelfAttentionMultiply_output> {
          nameInComfy: "UNetSelfAttentionMultiply"
      }
      interface UNetSelfAttentionMultiply_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface UNetSelfAttentionMultiply_input {
          model: Comfy.Input.MODEL
          /** default=1 min=10 max=10 step=0.01 */
          q?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          k?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          v?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          out?: Comfy.Input.FLOAT
      }
      interface UNetCrossAttentionMultiply extends HasSingle_MODEL, ComfyNode<UNetCrossAttentionMultiply_input, UNetCrossAttentionMultiply_output> {
          nameInComfy: "UNetCrossAttentionMultiply"
      }
      interface UNetCrossAttentionMultiply_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface UNetCrossAttentionMultiply_input {
          model: Comfy.Input.MODEL
          /** default=1 min=10 max=10 step=0.01 */
          q?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          k?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          v?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          out?: Comfy.Input.FLOAT
      }
      interface CLIPAttentionMultiply extends HasSingle_CLIP, ComfyNode<CLIPAttentionMultiply_input, CLIPAttentionMultiply_output> {
          nameInComfy: "CLIPAttentionMultiply"
      }
      interface CLIPAttentionMultiply_output {
          CLIP: ComfyNodeOutput<'CLIP', 0>,
      }
      interface CLIPAttentionMultiply_input {
          clip: Comfy.Input.CLIP
          /** default=1 min=10 max=10 step=0.01 */
          q?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          k?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          v?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          out?: Comfy.Input.FLOAT
      }
      interface UNetTemporalAttentionMultiply extends HasSingle_MODEL, ComfyNode<UNetTemporalAttentionMultiply_input, UNetTemporalAttentionMultiply_output> {
          nameInComfy: "UNetTemporalAttentionMultiply"
      }
      interface UNetTemporalAttentionMultiply_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface UNetTemporalAttentionMultiply_input {
          model: Comfy.Input.MODEL
          /** default=1 min=10 max=10 step=0.01 */
          self_structural?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          self_temporal?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          cross_structural?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=0.01 */
          cross_temporal?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_advanced_samplers
   namespace Comfy.Extra.advanced_samplers {
      interface Nodes {
          /** category="sampling_custom_sampling_samplers" name="SamplerLCMUpscale" output=[SAMPLER] */
         SamplerLCMUpscale(p: SamplerLCMUpscale_input, meta?: ComfyNodeMetadata): SamplerLCMUpscale
          /** category="_for_testing" name="SamplerEulerCFGpp" output=[SAMPLER] */
         SamplerEulerCFGpp(p: SamplerEulerCFGpp_input, meta?: ComfyNodeMetadata): SamplerEulerCFGpp
      }
      interface SamplerLCMUpscale extends HasSingle_SAMPLER, ComfyNode<SamplerLCMUpscale_input, SamplerLCMUpscale_output> {
          nameInComfy: "SamplerLCMUpscale"
      }
      interface SamplerLCMUpscale_output {
          SAMPLER: ComfyNodeOutput<'SAMPLER', 0>,
      }
      interface SamplerLCMUpscale_input {
          /** default=1 min=20 max=20 step=0.01 */
          scale_ratio?: Comfy.Input.FLOAT
          /** default=-1 min=1000 max=1000 step=1 */
          scale_steps?: Comfy.Input.INT
          upscale_method: Comfy.Union.E_6e6cbf6c48411ad480e010b0c9d2434b41af430d
      }
      interface SamplerEulerCFGpp extends HasSingle_SAMPLER, ComfyNode<SamplerEulerCFGpp_input, SamplerEulerCFGpp_output> {
          nameInComfy: "SamplerEulerCFGpp"
      }
      interface SamplerEulerCFGpp_output {
          SAMPLER: ComfyNodeOutput<'SAMPLER', 0>,
      }
      interface SamplerEulerCFGpp_input {
          version: Comfy.Union.E_a8aa5eb2d828c2e279168c48955c7a0fe3ea011a
      }
   }
   
   // comfy_extras.nodes_webcam
   namespace Comfy.Extra.webcam {
      interface Nodes {
          /** category="image" name="WebcamCapture" output=[IMAGE] */
         WebcamCapture(p: WebcamCapture_input, meta?: ComfyNodeMetadata): WebcamCapture
      }
      interface WebcamCapture extends HasSingle_IMAGE, ComfyNode<WebcamCapture_input, WebcamCapture_output> {
          nameInComfy: "WebcamCapture"
      }
      interface WebcamCapture_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface WebcamCapture_input {
          /** */
          image: Comfy.Input.WEBCAM
          /** default=0 min=16384 max=16384 step=1 */
          width?: Comfy.Input.INT
          /** default=0 min=16384 max=16384 step=1 */
          height?: Comfy.Input.INT
          /** default=true */
          capture_on_queue?: Comfy.Input.BOOLEAN
      }
   }
   
   // comfy_extras.nodes_audio
   namespace Comfy.Extra.audio {
      interface Nodes {
          /** category="latent_audio" name="EmptyLatentAudio" output=[LATENT] */
         EmptyLatentAudio(p: EmptyLatentAudio_input, meta?: ComfyNodeMetadata): EmptyLatentAudio
          /** category="latent_audio" name="VAEEncodeAudio" output=[LATENT] */
         VAEEncodeAudio(p: VAEEncodeAudio_input, meta?: ComfyNodeMetadata): VAEEncodeAudio
          /** category="latent_audio" name="VAEDecodeAudio" output=[AUDIO] */
         VAEDecodeAudio(p: VAEDecodeAudio_input, meta?: ComfyNodeMetadata): VAEDecodeAudio
          /** category="audio" name="SaveAudio" output=[] */
         SaveAudio(p: SaveAudio_input, meta?: ComfyNodeMetadata): SaveAudio
          /** category="audio" name="LoadAudio" output=[AUDIO] */
         LoadAudio(p: LoadAudio_input, meta?: ComfyNodeMetadata): LoadAudio
          /** category="audio" name="PreviewAudio" output=[] */
         PreviewAudio(p: PreviewAudio_input, meta?: ComfyNodeMetadata): PreviewAudio
      }
      interface EmptyLatentAudio extends HasSingle_LATENT, ComfyNode<EmptyLatentAudio_input, EmptyLatentAudio_output> {
          nameInComfy: "EmptyLatentAudio"
      }
      interface EmptyLatentAudio_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface EmptyLatentAudio_input {
          /** default=47.6 min=1000 max=1000 step=0.1 */
          seconds?: Comfy.Input.FLOAT
          /** default=1 min=4096 max=4096 */
          batch_size?: Comfy.Input.INT
      }
      interface VAEEncodeAudio extends HasSingle_LATENT, ComfyNode<VAEEncodeAudio_input, VAEEncodeAudio_output> {
          nameInComfy: "VAEEncodeAudio"
      }
      interface VAEEncodeAudio_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface VAEEncodeAudio_input {
          audio: Comfy.Input.AUDIO
          vae: Comfy.Input.VAE
      }
      interface VAEDecodeAudio extends HasSingle_AUDIO, ComfyNode<VAEDecodeAudio_input, VAEDecodeAudio_output> {
          nameInComfy: "VAEDecodeAudio"
      }
      interface VAEDecodeAudio_output {
          AUDIO: ComfyNodeOutput<'AUDIO', 0>,
      }
      interface VAEDecodeAudio_input {
          samples: Comfy.Input.LATENT
          vae: Comfy.Input.VAE
      }
      interface SaveAudio extends ComfyNode<SaveAudio_input, SaveAudio_output> {
          nameInComfy: "SaveAudio"
      }
      interface SaveAudio_output {
      }
      interface SaveAudio_input {
          audio: Comfy.Input.AUDIO
          /** default="audio/ComfyUI" */
          filename_prefix?: Comfy.Input.STRING
      }
      interface LoadAudio extends HasSingle_AUDIO, ComfyNode<LoadAudio_input, LoadAudio_output> {
          nameInComfy: "LoadAudio"
      }
      interface LoadAudio_output {
          AUDIO: ComfyNodeOutput<'AUDIO', 0>,
      }
      interface LoadAudio_input {
          /** */
          audio: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
      }
      interface PreviewAudio extends ComfyNode<PreviewAudio_input, PreviewAudio_output> {
          nameInComfy: "PreviewAudio"
      }
      interface PreviewAudio_output {
      }
      interface PreviewAudio_input {
          audio: Comfy.Input.AUDIO
      }
   }
   
   // comfy_extras.nodes_sd3
   namespace Comfy.Extra.sd3 {
      interface Nodes {
          /** category="advanced_loaders" name="TripleCLIPLoader" output=[CLIP] */
         TripleCLIPLoader(p: TripleCLIPLoader_input, meta?: ComfyNodeMetadata): TripleCLIPLoader
          /** category="latent_sd3" name="EmptySD3LatentImage" output=[LATENT] */
         EmptySD3LatentImage(p: EmptySD3LatentImage_input, meta?: ComfyNodeMetadata): EmptySD3LatentImage
          /** category="advanced_conditioning" name="CLIPTextEncodeSD3" output=[CONDITIONING] */
         CLIPTextEncodeSD3(p: CLIPTextEncodeSD3_input, meta?: ComfyNodeMetadata): CLIPTextEncodeSD3
          /** category="conditioning_controlnet" name="ControlNetApplySD3" output=[positive, negative] */
         ControlNetApplySD3(p: ControlNetApplySD3_input, meta?: ComfyNodeMetadata): ControlNetApplySD3
          /** category="advanced_guidance" name="SkipLayerGuidanceSD3" output=[MODEL] */
         SkipLayerGuidanceSD3(p: SkipLayerGuidanceSD3_input, meta?: ComfyNodeMetadata): SkipLayerGuidanceSD3
      }
      interface TripleCLIPLoader extends HasSingle_CLIP, ComfyNode<TripleCLIPLoader_input, TripleCLIPLoader_output> {
          nameInComfy: "TripleCLIPLoader"
      }
      interface TripleCLIPLoader_output {
          CLIP: ComfyNodeOutput<'CLIP', 0>,
      }
      interface TripleCLIPLoader_input {
          clip_name1: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
          clip_name2: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
          clip_name3: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
      }
      interface EmptySD3LatentImage extends HasSingle_LATENT, ComfyNode<EmptySD3LatentImage_input, EmptySD3LatentImage_output> {
          nameInComfy: "EmptySD3LatentImage"
      }
      interface EmptySD3LatentImage_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface EmptySD3LatentImage_input {
          /** default=1024 min=16384 max=16384 step=16 */
          width?: Comfy.Input.INT
          /** default=1024 min=16384 max=16384 step=16 */
          height?: Comfy.Input.INT
          /** default=1 min=4096 max=4096 */
          batch_size?: Comfy.Input.INT
      }
      interface CLIPTextEncodeSD3 extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncodeSD3_input, CLIPTextEncodeSD3_output> {
          nameInComfy: "CLIPTextEncodeSD3"
      }
      interface CLIPTextEncodeSD3_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface CLIPTextEncodeSD3_input {
          clip: Comfy.Input.CLIP
          /** */
          clip_l: Comfy.Input.STRING
          /** */
          clip_g: Comfy.Input.STRING
          /** */
          t5xxl: Comfy.Input.STRING
          empty_padding: Comfy.Union.E_270e152a81c37daf152e6cc67675baaafe058bc4
      }
      interface ControlNetApplySD3 extends ComfyNode<ControlNetApplySD3_input, ControlNetApplySD3_output> {
          nameInComfy: "ControlNetApplySD3"
      }
      interface ControlNetApplySD3_output {
          positive: ComfyNodeOutput<'CONDITIONING', 0>,
          negative: ComfyNodeOutput<'CONDITIONING', 1>,
      }
      interface ControlNetApplySD3_input {
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          control_net: Comfy.Input.CONTROL_NET
          vae: Comfy.Input.VAE
          image: Comfy.Input.IMAGE
          /** default=1 min=10 max=10 step=0.01 */
          strength?: Comfy.Input.FLOAT
          /** default=0 min=1 max=1 step=0.001 */
          start_percent?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.001 */
          end_percent?: Comfy.Input.FLOAT
      }
      interface SkipLayerGuidanceSD3 extends HasSingle_MODEL, ComfyNode<SkipLayerGuidanceSD3_input, SkipLayerGuidanceSD3_output> {
          nameInComfy: "SkipLayerGuidanceSD3"
      }
      interface SkipLayerGuidanceSD3_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface SkipLayerGuidanceSD3_input {
          model: Comfy.Input.MODEL
          /** default="7, 8, 9" */
          layers?: Comfy.Input.STRING
          /** default=3 min=10 max=10 step=0.1 */
          scale?: Comfy.Input.FLOAT
          /** default=0.01 min=1 max=1 step=0.001 */
          start_percent?: Comfy.Input.FLOAT
          /** default=0.15 min=1 max=1 step=0.001 */
          end_percent?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_gits
   namespace Comfy.Extra.gits {
      interface Nodes {
          /** category="sampling_custom_sampling_schedulers" name="GITSScheduler" output=[SIGMAS] */
         GITSScheduler(p: GITSScheduler_input, meta?: ComfyNodeMetadata): GITSScheduler
      }
      interface GITSScheduler extends HasSingle_SIGMAS, ComfyNode<GITSScheduler_input, GITSScheduler_output> {
          nameInComfy: "GITSScheduler"
      }
      interface GITSScheduler_output {
          SIGMAS: ComfyNodeOutput<'SIGMAS', 0>,
      }
      interface GITSScheduler_input {
          /** default=1.2 min=1.5 max=1.5 step=0.05 */
          coeff?: Comfy.Input.FLOAT
          /** default=10 min=1000 max=1000 */
          steps?: Comfy.Input.INT
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_controlnet
   namespace Comfy.Extra.controlnet {
      interface Nodes {
          /** category="conditioning_controlnet" name="SetUnionControlNetType" output=[CONTROL_NET] */
         SetUnionControlNetType(p: SetUnionControlNetType_input, meta?: ComfyNodeMetadata): SetUnionControlNetType
          /** category="conditioning_controlnet" name="ControlNetInpaintingAliMamaApply" output=[positive, negative] */
         ControlNetInpaintingAliMamaApply(p: ControlNetInpaintingAliMamaApply_input, meta?: ComfyNodeMetadata): ControlNetInpaintingAliMamaApply
      }
      interface SetUnionControlNetType extends HasSingle_CONTROL_NET, ComfyNode<SetUnionControlNetType_input, SetUnionControlNetType_output> {
          nameInComfy: "SetUnionControlNetType"
      }
      interface SetUnionControlNetType_output {
          CONTROL_NET: ComfyNodeOutput<'CONTROL_NET', 0>,
      }
      interface SetUnionControlNetType_input {
          control_net: Comfy.Input.CONTROL_NET
          type: Comfy.Union.E_0e92c8b1b6fe90c3e343d8b54b531b9d887eee62
      }
      interface ControlNetInpaintingAliMamaApply extends ComfyNode<ControlNetInpaintingAliMamaApply_input, ControlNetInpaintingAliMamaApply_output> {
          nameInComfy: "ControlNetInpaintingAliMamaApply"
      }
      interface ControlNetInpaintingAliMamaApply_output {
          positive: ComfyNodeOutput<'CONDITIONING', 0>,
          negative: ComfyNodeOutput<'CONDITIONING', 1>,
      }
      interface ControlNetInpaintingAliMamaApply_input {
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          control_net: Comfy.Input.CONTROL_NET
          vae: Comfy.Input.VAE
          image: Comfy.Input.IMAGE
          mask: Comfy.Input.MASK
          /** default=1 min=10 max=10 step=0.01 */
          strength?: Comfy.Input.FLOAT
          /** default=0 min=1 max=1 step=0.001 */
          start_percent?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.001 */
          end_percent?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_hunyuan
   namespace Comfy.Extra.hunyuan {
      interface Nodes {
          /** category="advanced_conditioning" name="CLIPTextEncodeHunyuanDiT" output=[CONDITIONING] */
         CLIPTextEncodeHunyuanDiT(p: CLIPTextEncodeHunyuanDiT_input, meta?: ComfyNodeMetadata): CLIPTextEncodeHunyuanDiT
      }
      interface CLIPTextEncodeHunyuanDiT extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncodeHunyuanDiT_input, CLIPTextEncodeHunyuanDiT_output> {
          nameInComfy: "CLIPTextEncodeHunyuanDiT"
      }
      interface CLIPTextEncodeHunyuanDiT_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface CLIPTextEncodeHunyuanDiT_input {
          clip: Comfy.Input.CLIP
          /** */
          bert: Comfy.Input.STRING
          /** */
          mt5xl: Comfy.Input.STRING
      }
   }
   
   // comfy_extras.nodes_flux
   namespace Comfy.Extra.flux {
      interface Nodes {
          /** category="advanced_conditioning_flux" name="CLIPTextEncodeFlux" output=[CONDITIONING] */
         CLIPTextEncodeFlux(p: CLIPTextEncodeFlux_input, meta?: ComfyNodeMetadata): CLIPTextEncodeFlux
          /** category="advanced_conditioning_flux" name="FluxGuidance" output=[CONDITIONING] */
         FluxGuidance(p: FluxGuidance_input, meta?: ComfyNodeMetadata): FluxGuidance
      }
      interface CLIPTextEncodeFlux extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncodeFlux_input, CLIPTextEncodeFlux_output> {
          nameInComfy: "CLIPTextEncodeFlux"
      }
      interface CLIPTextEncodeFlux_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface CLIPTextEncodeFlux_input {
          clip: Comfy.Input.CLIP
          /** */
          clip_l: Comfy.Input.STRING
          /** */
          t5xxl: Comfy.Input.STRING
          /** default=3.5 min=100 max=100 step=0.1 */
          guidance?: Comfy.Input.FLOAT
      }
      interface FluxGuidance extends HasSingle_CONDITIONING, ComfyNode<FluxGuidance_input, FluxGuidance_output> {
          nameInComfy: "FluxGuidance"
      }
      interface FluxGuidance_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface FluxGuidance_input {
          conditioning: Comfy.Input.CONDITIONING
          /** default=3.5 min=100 max=100 step=0.1 */
          guidance?: Comfy.Input.FLOAT
      }
   }
   
   // comfy_extras.nodes_lora_extract
   namespace Comfy.Extra.lora_extract {
      interface Nodes {
          /** category="_for_testing" name="LoraSave" output=[] */
         LoraSave(p: LoraSave_input, meta?: ComfyNodeMetadata): LoraSave
      }
      interface LoraSave extends ComfyNode<LoraSave_input, LoraSave_output> {
          nameInComfy: "LoraSave"
      }
      interface LoraSave_output {
      }
      interface LoraSave_input {
          /** default="loras/ComfyUI_extracted_lora" */
          filename_prefix?: Comfy.Input.STRING
          /** default=8 min=4096 max=4096 step=1 */
          rank?: Comfy.Input.INT
          lora_type: Comfy.Union.E_b80b6129a942660e31e08221ee04a76f537556ce
          /** default=true */
          bias_diff?: Comfy.Input.BOOLEAN
          /** */
          model_diff?: Comfy.Input.MODEL
          /** */
          text_encoder_diff?: Comfy.Input.CLIP
      }
   }
   
   // comfy_extras.nodes_torch_compile
   namespace Comfy.Extra.torch_compile {
      interface Nodes {
          /** category="_for_testing" name="TorchCompileModel" output=[MODEL] */
         TorchCompileModel(p: TorchCompileModel_input, meta?: ComfyNodeMetadata): TorchCompileModel
      }
      interface TorchCompileModel extends HasSingle_MODEL, ComfyNode<TorchCompileModel_input, TorchCompileModel_output> {
          nameInComfy: "TorchCompileModel"
      }
      interface TorchCompileModel_output {
          MODEL: ComfyNodeOutput<'MODEL', 0>,
      }
      interface TorchCompileModel_input {
          model: Comfy.Input.MODEL
          backend: Comfy.Union.E_4bbca93e426c35d56c43252f1fb21877d5e7a1aa
      }
   }
   
   // comfy_extras.nodes_mochi
   namespace Comfy.Extra.mochi {
      interface Nodes {
          /** category="latent_mochi" name="EmptyMochiLatentVideo" output=[LATENT] */
         EmptyMochiLatentVideo(p: EmptyMochiLatentVideo_input, meta?: ComfyNodeMetadata): EmptyMochiLatentVideo
      }
      interface EmptyMochiLatentVideo extends HasSingle_LATENT, ComfyNode<EmptyMochiLatentVideo_input, EmptyMochiLatentVideo_output> {
          nameInComfy: "EmptyMochiLatentVideo"
      }
      interface EmptyMochiLatentVideo_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface EmptyMochiLatentVideo_input {
          /** default=848 min=16384 max=16384 step=16 */
          width?: Comfy.Input.INT
          /** default=480 min=16384 max=16384 step=16 */
          height?: Comfy.Input.INT
          /** default=25 min=16384 max=16384 step=6 */
          length?: Comfy.Input.INT
          /** default=1 min=4096 max=4096 */
          batch_size?: Comfy.Input.INT
      }
   }
   
   // custom_nodes.websocket_image_save
   namespace Comfy.Custom.websocket_image_save {
      interface Nodes {
          /** category="api_image" name="SaveImageWebsocket" output=[] */
         SaveImageWebsocket(p: SaveImageWebsocket_input, meta?: ComfyNodeMetadata): SaveImageWebsocket
      }
      interface SaveImageWebsocket extends ComfyNode<SaveImageWebsocket_input, SaveImageWebsocket_output> {
          nameInComfy: "SaveImageWebsocket"
      }
      interface SaveImageWebsocket_output {
      }
      interface SaveImageWebsocket_input {
          images: Comfy.Input.IMAGE
      }
   }
   
   // custom_nodes.ComfyUI-Impact-Pack
   namespace Comfy.Custom.Impact_Pack {
      interface Nodes {
         /**
          * Load the SAM (Segment Anything) model. This can be used in places that utilize SAM detection functionality, such as SAMDetector or SimpleDetector.
          * The SAM detection functionality in Impact Pack must use the SAM_MODEL loaded through this node.
          * category="ImpactPack" name="SAMLoader" output=[SAM_MODEL]
         **/
         SAMLoader(p: SAMLoader_input, meta?: ComfyNodeMetadata): SAMLoader
         /**
          * Provides a detection function using CLIPSeg, which generates masks based on text prompts.
          * To use this node, the CLIPSeg custom node must be installed.
          * category="ImpactPack_Util" name="CLIPSegDetectorProvider" output=[BBOX_DETECTOR]
         **/
         CLIPSegDetectorProvider(p: CLIPSegDetectorProvider_input, meta?: ComfyNodeMetadata): CLIPSegDetectorProvider
          /** category="ImpactPack" name="ONNXDetectorProvider" output=[BBOX_DETECTOR] */
         ONNXDetectorProvider(p: ONNXDetectorProvider_input, meta?: ComfyNodeMetadata): ONNXDetectorProvider
         /**
          * Retains only the overlapping areas between the masks included in base_segs and the mask regions of mask_segs. SEGS with no overlapping mask areas are filtered out.
          * category="ImpactPack_Operation" name="BitwiseAndMaskForEach" output=[SEGS]
         **/
         BitwiseAndMaskForEach(p: BitwiseAndMaskForEach_input, meta?: ComfyNodeMetadata): BitwiseAndMaskForEach
         /**
          * Removes only the overlapping areas between the masks included in base_segs and the mask regions of mask_segs. SEGS with no overlapping mask areas are filtered out.
          * category="ImpactPack_Operation" name="SubtractMaskForEach" output=[SEGS]
         **/
         SubtractMaskForEach(p: SubtractMaskForEach_input, meta?: ComfyNodeMetadata): SubtractMaskForEach
          /** category="ImpactPack_Detailer" name="DetailerForEach" output=[IMAGE] */
         DetailerForEach(p: DetailerForEach_input, meta?: ComfyNodeMetadata): DetailerForEach
          /** category="ImpactPack_Detailer" name="DetailerForEachDebug" output=[image, cropped, cropped_refined, cropped_refined_alpha, cnet_images] */
         DetailerForEachDebug(p: DetailerForEachDebug_input, meta?: ComfyNodeMetadata): DetailerForEachDebug
          /** category="ImpactPack_Detailer" name="DetailerForEachPipe" output=[image, segs, basic_pipe, cnet_images] */
         DetailerForEachPipe(p: DetailerForEachPipe_input, meta?: ComfyNodeMetadata): DetailerForEachPipe
          /** category="ImpactPack_Detailer" name="DetailerForEachDebugPipe" output=[image, segs, basic_pipe, cropped, cropped_refined, cropped_refined_alpha, cnet_images] */
         DetailerForEachDebugPipe(p: DetailerForEachDebugPipe_input, meta?: ComfyNodeMetadata): DetailerForEachDebugPipe
          /** category="ImpactPack_Detailer" name="DetailerForEachPipeForAnimateDiff" output=[image, segs, basic_pipe, cnet_images] */
         DetailerForEachPipeForAnimateDiff(p: DetailerForEachPipeForAnimateDiff_input, meta?: ComfyNodeMetadata): DetailerForEachPipeForAnimateDiff
          /** category="ImpactPack_Detector" name="SAMDetectorCombined" output=[MASK] */
         SAMDetectorCombined(p: SAMDetectorCombined_input, meta?: ComfyNodeMetadata): SAMDetectorCombined
          /** category="ImpactPack_Detector" name="SAMDetectorSegmented" output=[combined_mask, batch_masks] */
         SAMDetectorSegmented(p: SAMDetectorSegmented_input, meta?: ComfyNodeMetadata): SAMDetectorSegmented
          /** category="ImpactPack_Simple" name="FaceDetailer" output=[image, cropped_refined, cropped_enhanced_alpha, mask, detailer_pipe, cnet_images] */
         FaceDetailer(p: FaceDetailer_input, meta?: ComfyNodeMetadata): FaceDetailer
          /** category="ImpactPack_Simple" name="FaceDetailerPipe" output=[image, cropped_refined, cropped_enhanced_alpha, mask, detailer_pipe, cnet_images] */
         FaceDetailerPipe(p: FaceDetailerPipe_input, meta?: ComfyNodeMetadata): FaceDetailerPipe
          /** category="ImpactPack_Detailer" name="MaskDetailerPipe" output=[image, cropped_refined, cropped_enhanced_alpha, basic_pipe, refiner_basic_pipe_opt] */
         MaskDetailerPipe(p: MaskDetailerPipe_input, meta?: ComfyNodeMetadata): MaskDetailerPipe
          /** category="ImpactPack_Pipe" name="ToDetailerPipe" output=[detailer_pipe] */
         ToDetailerPipe(p: ToDetailerPipe_input, meta?: ComfyNodeMetadata): ToDetailerPipe
          /** category="ImpactPack_Pipe" name="ToDetailerPipeSDXL" output=[detailer_pipe] */
         ToDetailerPipeSDXL(p: ToDetailerPipeSDXL_input, meta?: ComfyNodeMetadata): ToDetailerPipeSDXL
          /** category="ImpactPack_Pipe" name="FromDetailerPipe" output=[model, clip, vae, positive, negative, bbox_detector, sam_model_opt, segm_detector_opt, detailer_hook] */
         FromDetailerPipe(p: FromDetailerPipe_input, meta?: ComfyNodeMetadata): FromDetailerPipe
          /** category="ImpactPack_Pipe" name="FromDetailerPipe_v2" output=[detailer_pipe, model, clip, vae, positive, negative, bbox_detector, sam_model_opt, segm_detector_opt, detailer_hook] */
         FromDetailerPipe$_v2(p: FromDetailerPipe$_v2_input, meta?: ComfyNodeMetadata): FromDetailerPipe$_v2
          /** category="ImpactPack_Pipe" name="FromDetailerPipeSDXL" output=[detailer_pipe, model, clip, vae, positive, negative, bbox_detector, sam_model_opt, segm_detector_opt, detailer_hook, refiner_model, refiner_clip, refiner_positive, refiner_negative] */
         FromDetailerPipeSDXL(p: FromDetailerPipeSDXL_input, meta?: ComfyNodeMetadata): FromDetailerPipeSDXL
          /** category="ImpactPack_Pipe" name="AnyPipeToBasic" output=[basic_pipe] */
         AnyPipeToBasic(p: AnyPipeToBasic_input, meta?: ComfyNodeMetadata): AnyPipeToBasic
          /** category="ImpactPack_Pipe" name="ToBasicPipe" output=[basic_pipe] */
         ToBasicPipe(p: ToBasicPipe_input, meta?: ComfyNodeMetadata): ToBasicPipe
          /** category="ImpactPack_Pipe" name="FromBasicPipe" output=[model, clip, vae, positive, negative] */
         FromBasicPipe(p: FromBasicPipe_input, meta?: ComfyNodeMetadata): FromBasicPipe
          /** category="ImpactPack_Pipe" name="FromBasicPipe_v2" output=[basic_pipe, model, clip, vae, positive, negative] */
         FromBasicPipe$_v2(p: FromBasicPipe$_v2_input, meta?: ComfyNodeMetadata): FromBasicPipe$_v2
          /** category="ImpactPack_Pipe" name="BasicPipeToDetailerPipe" output=[detailer_pipe] */
         BasicPipeToDetailerPipe(p: BasicPipeToDetailerPipe_input, meta?: ComfyNodeMetadata): BasicPipeToDetailerPipe
          /** category="ImpactPack_Pipe" name="BasicPipeToDetailerPipeSDXL" output=[detailer_pipe] */
         BasicPipeToDetailerPipeSDXL(p: BasicPipeToDetailerPipeSDXL_input, meta?: ComfyNodeMetadata): BasicPipeToDetailerPipeSDXL
          /** category="ImpactPack_Pipe" name="DetailerPipeToBasicPipe" output=[base_basic_pipe, refiner_basic_pipe] */
         DetailerPipeToBasicPipe(p: DetailerPipeToBasicPipe_input, meta?: ComfyNodeMetadata): DetailerPipeToBasicPipe
          /** category="ImpactPack_Pipe" name="EditBasicPipe" output=[basic_pipe] */
         EditBasicPipe(p: EditBasicPipe_input, meta?: ComfyNodeMetadata): EditBasicPipe
          /** category="ImpactPack_Pipe" name="EditDetailerPipe" output=[detailer_pipe] */
         EditDetailerPipe(p: EditDetailerPipe_input, meta?: ComfyNodeMetadata): EditDetailerPipe
          /** category="ImpactPack_Pipe" name="EditDetailerPipeSDXL" output=[detailer_pipe] */
         EditDetailerPipeSDXL(p: EditDetailerPipeSDXL_input, meta?: ComfyNodeMetadata): EditDetailerPipeSDXL
          /** category="ImpactPack_Upscale" name="LatentPixelScale" output=[LATENT, IMAGE] */
         LatentPixelScale(p: LatentPixelScale_input, meta?: ComfyNodeMetadata): LatentPixelScale
          /** category="ImpactPack_Upscale" name="PixelKSampleUpscalerProvider" output=[UPSCALER] */
         PixelKSampleUpscalerProvider(p: PixelKSampleUpscalerProvider_input, meta?: ComfyNodeMetadata): PixelKSampleUpscalerProvider
          /** category="ImpactPack_Upscale" name="PixelKSampleUpscalerProviderPipe" output=[UPSCALER] */
         PixelKSampleUpscalerProviderPipe(p: PixelKSampleUpscalerProviderPipe_input, meta?: ComfyNodeMetadata): PixelKSampleUpscalerProviderPipe
          /** category="ImpactPack_Upscale" name="IterativeLatentUpscale" output=[latent, vae] */
         IterativeLatentUpscale(p: IterativeLatentUpscale_input, meta?: ComfyNodeMetadata): IterativeLatentUpscale
          /** category="ImpactPack_Upscale" name="IterativeImageUpscale" output=[image] */
         IterativeImageUpscale(p: IterativeImageUpscale_input, meta?: ComfyNodeMetadata): IterativeImageUpscale
          /** category="ImpactPack_Upscale" name="PixelTiledKSampleUpscalerProvider" output=[UPSCALER] */
         PixelTiledKSampleUpscalerProvider(p: PixelTiledKSampleUpscalerProvider_input, meta?: ComfyNodeMetadata): PixelTiledKSampleUpscalerProvider
          /** category="ImpactPack_Upscale" name="PixelTiledKSampleUpscalerProviderPipe" output=[UPSCALER] */
         PixelTiledKSampleUpscalerProviderPipe(p: PixelTiledKSampleUpscalerProviderPipe_input, meta?: ComfyNodeMetadata): PixelTiledKSampleUpscalerProviderPipe
          /** category="ImpactPack_Upscale" name="TwoSamplersForMaskUpscalerProvider" output=[UPSCALER] */
         TwoSamplersForMaskUpscalerProvider(p: TwoSamplersForMaskUpscalerProvider_input, meta?: ComfyNodeMetadata): TwoSamplersForMaskUpscalerProvider
          /** category="ImpactPack_Upscale" name="TwoSamplersForMaskUpscalerProviderPipe" output=[UPSCALER] */
         TwoSamplersForMaskUpscalerProviderPipe(p: TwoSamplersForMaskUpscalerProviderPipe_input, meta?: ComfyNodeMetadata): TwoSamplersForMaskUpscalerProviderPipe
          /** category="ImpactPack_Upscale" name="PixelKSampleHookCombine" output=[PK_HOOK] */
         PixelKSampleHookCombine(p: PixelKSampleHookCombine_input, meta?: ComfyNodeMetadata): PixelKSampleHookCombine
          /** category="ImpactPack_Upscale" name="DenoiseScheduleHookProvider" output=[PK_HOOK] */
         DenoiseScheduleHookProvider(p: DenoiseScheduleHookProvider_input, meta?: ComfyNodeMetadata): DenoiseScheduleHookProvider
          /** category="ImpactPack_Upscale" name="StepsScheduleHookProvider" output=[PK_HOOK] */
         StepsScheduleHookProvider(p: StepsScheduleHookProvider_input, meta?: ComfyNodeMetadata): StepsScheduleHookProvider
          /** category="ImpactPack_Upscale" name="CfgScheduleHookProvider" output=[PK_HOOK] */
         CfgScheduleHookProvider(p: CfgScheduleHookProvider_input, meta?: ComfyNodeMetadata): CfgScheduleHookProvider
          /** category="ImpactPack_Upscale" name="NoiseInjectionHookProvider" output=[PK_HOOK] */
         NoiseInjectionHookProvider(p: NoiseInjectionHookProvider_input, meta?: ComfyNodeMetadata): NoiseInjectionHookProvider
          /** category="ImpactPack_Upscale" name="UnsamplerHookProvider" output=[PK_HOOK] */
         UnsamplerHookProvider(p: UnsamplerHookProvider_input, meta?: ComfyNodeMetadata): UnsamplerHookProvider
          /** category="ImpactPack_Detailer" name="CoreMLDetailerHookProvider" output=[DETAILER_HOOK] */
         CoreMLDetailerHookProvider(p: CoreMLDetailerHookProvider_input, meta?: ComfyNodeMetadata): CoreMLDetailerHookProvider
          /** category="ImpactPack_Util" name="PreviewDetailerHookProvider" output=[DETAILER_HOOK, UPSCALER_HOOK] */
         PreviewDetailerHookProvider(p: PreviewDetailerHookProvider_input, meta?: ComfyNodeMetadata): PreviewDetailerHookProvider
          /** category="ImpactPack_Upscale" name="DetailerHookCombine" output=[DETAILER_HOOK] */
         DetailerHookCombine(p: DetailerHookCombine_input, meta?: ComfyNodeMetadata): DetailerHookCombine
          /** category="ImpactPack_Detailer" name="NoiseInjectionDetailerHookProvider" output=[DETAILER_HOOK] */
         NoiseInjectionDetailerHookProvider(p: NoiseInjectionDetailerHookProvider_input, meta?: ComfyNodeMetadata): NoiseInjectionDetailerHookProvider
          /** category="ImpactPack_Detailer" name="UnsamplerDetailerHookProvider" output=[DETAILER_HOOK] */
         UnsamplerDetailerHookProvider(p: UnsamplerDetailerHookProvider_input, meta?: ComfyNodeMetadata): UnsamplerDetailerHookProvider
          /** category="ImpactPack_Detailer" name="DenoiseSchedulerDetailerHookProvider" output=[DETAILER_HOOK] */
         DenoiseSchedulerDetailerHookProvider(p: DenoiseSchedulerDetailerHookProvider_input, meta?: ComfyNodeMetadata): DenoiseSchedulerDetailerHookProvider
          /** category="ImpactPack_Util" name="SEGSOrderedFilterDetailerHookProvider" output=[DETAILER_HOOK] */
         SEGSOrderedFilterDetailerHookProvider(p: SEGSOrderedFilterDetailerHookProvider_input, meta?: ComfyNodeMetadata): SEGSOrderedFilterDetailerHookProvider
          /** category="ImpactPack_Util" name="SEGSRangeFilterDetailerHookProvider" output=[DETAILER_HOOK] */
         SEGSRangeFilterDetailerHookProvider(p: SEGSRangeFilterDetailerHookProvider_input, meta?: ComfyNodeMetadata): SEGSRangeFilterDetailerHookProvider
          /** category="ImpactPack_Util" name="SEGSLabelFilterDetailerHookProvider" output=[DETAILER_HOOK] */
         SEGSLabelFilterDetailerHookProvider(p: SEGSLabelFilterDetailerHookProvider_input, meta?: ComfyNodeMetadata): SEGSLabelFilterDetailerHookProvider
          /** category="ImpactPack_Detailer" name="VariationNoiseDetailerHookProvider" output=[DETAILER_HOOK] */
         VariationNoiseDetailerHookProvider(p: VariationNoiseDetailerHookProvider_input, meta?: ComfyNodeMetadata): VariationNoiseDetailerHookProvider
          /** category="ImpactPack_Operation" name="BitwiseAndMask" output=[MASK] */
         BitwiseAndMask(p: BitwiseAndMask_input, meta?: ComfyNodeMetadata): BitwiseAndMask
          /** category="ImpactPack_Operation" name="SubtractMask" output=[MASK] */
         SubtractMask(p: SubtractMask_input, meta?: ComfyNodeMetadata): SubtractMask
          /** category="ImpactPack_Operation" name="AddMask" output=[MASK] */
         AddMask(p: AddMask_input, meta?: ComfyNodeMetadata): AddMask
          /** category="ImpactPack_Operation" name="ImpactSegsAndMask" output=[SEGS] */
         ImpactSegsAndMask(p: ImpactSegsAndMask_input, meta?: ComfyNodeMetadata): ImpactSegsAndMask
          /** category="ImpactPack_Operation" name="ImpactSegsAndMaskForEach" output=[SEGS] */
         ImpactSegsAndMaskForEach(p: ImpactSegsAndMaskForEach_input, meta?: ComfyNodeMetadata): ImpactSegsAndMaskForEach
          /** category="ImpactPack_Util" name="EmptySegs" output=[SEGS] */
         EmptySegs(p: EmptySegs_input, meta?: ComfyNodeMetadata): EmptySegs
          /** category="ImpactPack_Operation" name="ImpactFlattenMask" output=[MASK] */
         ImpactFlattenMask(p: ImpactFlattenMask_input, meta?: ComfyNodeMetadata): ImpactFlattenMask
          /** category="ImpactPack_Operation" name="MediaPipeFaceMeshToSEGS" output=[SEGS] */
         MediaPipeFaceMeshToSEGS(p: MediaPipeFaceMeshToSEGS_input, meta?: ComfyNodeMetadata): MediaPipeFaceMeshToSEGS
          /** category="ImpactPack_Operation" name="MaskToSEGS" output=[SEGS] */
         MaskToSEGS(p: MaskToSEGS_input, meta?: ComfyNodeMetadata): MaskToSEGS
          /** category="ImpactPack_Operation" name="MaskToSEGS_for_AnimateDiff" output=[SEGS] */
         MaskToSEGS$_for$_AnimateDiff(p: MaskToSEGS$_for$_AnimateDiff_input, meta?: ComfyNodeMetadata): MaskToSEGS$_for$_AnimateDiff
          /** category="ImpactPack_Operation" name="ToBinaryMask" output=[MASK] */
         ToBinaryMask(p: ToBinaryMask_input, meta?: ComfyNodeMetadata): ToBinaryMask
          /** category="ImpactPack_Operation" name="MasksToMaskList" output=[MASK] */
         MasksToMaskList(p: MasksToMaskList_input, meta?: ComfyNodeMetadata): MasksToMaskList
          /** category="ImpactPack_Operation" name="MaskListToMaskBatch" output=[MASK] */
         MaskListToMaskBatch(p: MaskListToMaskBatch_input, meta?: ComfyNodeMetadata): MaskListToMaskBatch
          /** category="ImpactPack_Operation" name="ImageListToImageBatch" output=[IMAGE] */
         ImageListToImageBatch(p: ImageListToImageBatch_input, meta?: ComfyNodeMetadata): ImageListToImageBatch
          /** category="ImpactPack_Util" name="SetDefaultImageForSEGS" output=[SEGS] */
         SetDefaultImageForSEGS(p: SetDefaultImageForSEGS_input, meta?: ComfyNodeMetadata): SetDefaultImageForSEGS
          /** category="ImpactPack_Util" name="RemoveImageFromSEGS" output=[SEGS] */
         RemoveImageFromSEGS(p: RemoveImageFromSEGS_input, meta?: ComfyNodeMetadata): RemoveImageFromSEGS
          /** category="ImpactPack_Detector" name="BboxDetectorSEGS" output=[SEGS] */
         BboxDetectorSEGS(p: BboxDetectorSEGS_input, meta?: ComfyNodeMetadata): BboxDetectorSEGS
          /** category="ImpactPack_Detector" name="SegmDetectorSEGS" output=[SEGS] */
         SegmDetectorSEGS(p: SegmDetectorSEGS_input, meta?: ComfyNodeMetadata): SegmDetectorSEGS
          /** category="ImpactPack_Detector" name="ONNXDetectorSEGS" output=[SEGS] */
         ONNXDetectorSEGS(p: ONNXDetectorSEGS_input, meta?: ComfyNodeMetadata): ONNXDetectorSEGS
          /** category="ImpactPack_Detector" name="ImpactSimpleDetectorSEGS_for_AD" output=[SEGS] */
         ImpactSimpleDetectorSEGS$_for$_AD(p: ImpactSimpleDetectorSEGS$_for$_AD_input, meta?: ComfyNodeMetadata): ImpactSimpleDetectorSEGS$_for$_AD
          /** category="ImpactPack_Detector" name="ImpactSimpleDetectorSEGS" output=[SEGS] */
         ImpactSimpleDetectorSEGS(p: ImpactSimpleDetectorSEGS_input, meta?: ComfyNodeMetadata): ImpactSimpleDetectorSEGS
          /** category="ImpactPack_Detector" name="ImpactSimpleDetectorSEGSPipe" output=[SEGS] */
         ImpactSimpleDetectorSEGSPipe(p: ImpactSimpleDetectorSEGSPipe_input, meta?: ComfyNodeMetadata): ImpactSimpleDetectorSEGSPipe
          /** category="ImpactPack_Util" name="ImpactControlNetApplySEGS" output=[SEGS] */
         ImpactControlNetApplySEGS(p: ImpactControlNetApplySEGS_input, meta?: ComfyNodeMetadata): ImpactControlNetApplySEGS
          /** category="ImpactPack_Util" name="ImpactControlNetApplyAdvancedSEGS" output=[SEGS] */
         ImpactControlNetApplyAdvancedSEGS(p: ImpactControlNetApplyAdvancedSEGS_input, meta?: ComfyNodeMetadata): ImpactControlNetApplyAdvancedSEGS
          /** category="ImpactPack_Util" name="ImpactControlNetClearSEGS" output=[SEGS] */
         ImpactControlNetClearSEGS(p: ImpactControlNetClearSEGS_input, meta?: ComfyNodeMetadata): ImpactControlNetClearSEGS
          /** category="ImpactPack_Util" name="ImpactIPAdapterApplySEGS" output=[SEGS] */
         ImpactIPAdapterApplySEGS(p: ImpactIPAdapterApplySEGS_input, meta?: ComfyNodeMetadata): ImpactIPAdapterApplySEGS
          /** category="ImpactPack_Util" name="ImpactDecomposeSEGS" output=[SEGS_HEADER, SEG_ELT] */
         ImpactDecomposeSEGS(p: ImpactDecomposeSEGS_input, meta?: ComfyNodeMetadata): ImpactDecomposeSEGS
          /** category="ImpactPack_Util" name="ImpactAssembleSEGS" output=[SEGS] */
         ImpactAssembleSEGS(p: ImpactAssembleSEGS_input, meta?: ComfyNodeMetadata): ImpactAssembleSEGS
          /** category="ImpactPack_Util" name="ImpactFrom_SEG_ELT" output=[seg_elt, cropped_image, cropped_mask, crop_region, bbox, control_net_wrapper, confidence, label] */
         ImpactFrom$_SEG$_ELT(p: ImpactFrom$_SEG$_ELT_input, meta?: ComfyNodeMetadata): ImpactFrom$_SEG$_ELT
          /** category="ImpactPack_Util" name="ImpactEdit_SEG_ELT" output=[SEG_ELT] */
         ImpactEdit$_SEG$_ELT(p: ImpactEdit$_SEG$_ELT_input, meta?: ComfyNodeMetadata): ImpactEdit$_SEG$_ELT
          /** category="ImpactPack_Util" name="ImpactDilate_Mask_SEG_ELT" output=[SEG_ELT] */
         ImpactDilate$_Mask$_SEG$_ELT(p: ImpactDilate$_Mask$_SEG$_ELT_input, meta?: ComfyNodeMetadata): ImpactDilate$_Mask$_SEG$_ELT
          /** category="ImpactPack_Util" name="ImpactDilateMask" output=[MASK] */
         ImpactDilateMask(p: ImpactDilateMask_input, meta?: ComfyNodeMetadata): ImpactDilateMask
          /** category="ImpactPack_Util" name="ImpactGaussianBlurMask" output=[MASK] */
         ImpactGaussianBlurMask(p: ImpactGaussianBlurMask_input, meta?: ComfyNodeMetadata): ImpactGaussianBlurMask
          /** category="ImpactPack_Util" name="ImpactDilateMaskInSEGS" output=[SEGS] */
         ImpactDilateMaskInSEGS(p: ImpactDilateMaskInSEGS_input, meta?: ComfyNodeMetadata): ImpactDilateMaskInSEGS
          /** category="ImpactPack_Util" name="ImpactGaussianBlurMaskInSEGS" output=[SEGS] */
         ImpactGaussianBlurMaskInSEGS(p: ImpactGaussianBlurMaskInSEGS_input, meta?: ComfyNodeMetadata): ImpactGaussianBlurMaskInSEGS
          /** category="ImpactPack_Util" name="ImpactScaleBy_BBOX_SEG_ELT" output=[SEG_ELT] */
         ImpactScaleBy$_BBOX$_SEG$_ELT(p: ImpactScaleBy$_BBOX$_SEG$_ELT_input, meta?: ComfyNodeMetadata): ImpactScaleBy$_BBOX$_SEG$_ELT
          /** category="ImpactPack_Util" name="ImpactFrom_SEG_ELT_bbox" output=[left, top, right, bottom] */
         ImpactFrom$_SEG$_ELT$_bbox(p: ImpactFrom$_SEG$_ELT$_bbox_input, meta?: ComfyNodeMetadata): ImpactFrom$_SEG$_ELT$_bbox
          /** category="ImpactPack_Util" name="ImpactFrom_SEG_ELT_crop_region" output=[left, top, right, bottom] */
         ImpactFrom$_SEG$_ELT$_crop$_region(p: ImpactFrom$_SEG$_ELT$_crop$_region_input, meta?: ComfyNodeMetadata): ImpactFrom$_SEG$_ELT$_crop$_region
          /** category="ImpactPack_Util" name="ImpactCount_Elts_in_SEGS" output=[INT] */
         ImpactCount$_Elts$_in$_SEGS(p: ImpactCount$_Elts$_in$_SEGS_input, meta?: ComfyNodeMetadata): ImpactCount$_Elts$_in$_SEGS
          /** category="ImpactPack_Detector" name="BboxDetectorCombined_v2" output=[MASK] */
         BboxDetectorCombined$_v2(p: BboxDetectorCombined$_v2_input, meta?: ComfyNodeMetadata): BboxDetectorCombined$_v2
          /** category="ImpactPack_Detector" name="SegmDetectorCombined_v2" output=[MASK] */
         SegmDetectorCombined$_v2(p: SegmDetectorCombined$_v2_input, meta?: ComfyNodeMetadata): SegmDetectorCombined$_v2
          /** category="ImpactPack_Operation" name="SegsToCombinedMask" output=[MASK] */
         SegsToCombinedMask(p: SegsToCombinedMask_input, meta?: ComfyNodeMetadata): SegsToCombinedMask
          /** category="ImpactPack_Sampler" name="KSamplerProvider" output=[KSAMPLER] */
         KSamplerProvider(p: KSamplerProvider_input, meta?: ComfyNodeMetadata): KSamplerProvider
          /** category="ImpactPack_Sampler" name="TwoSamplersForMask" output=[LATENT] */
         TwoSamplersForMask(p: TwoSamplersForMask_input, meta?: ComfyNodeMetadata): TwoSamplersForMask
          /** category="ImpactPack_Sampler" name="TiledKSamplerProvider" output=[KSAMPLER] */
         TiledKSamplerProvider(p: TiledKSamplerProvider_input, meta?: ComfyNodeMetadata): TiledKSamplerProvider
          /** category="ImpactPack_Sampler" name="KSamplerAdvancedProvider" output=[KSAMPLER_ADVANCED] */
         KSamplerAdvancedProvider(p: KSamplerAdvancedProvider_input, meta?: ComfyNodeMetadata): KSamplerAdvancedProvider
          /** category="ImpactPack_Sampler" name="TwoAdvancedSamplersForMask" output=[LATENT] */
         TwoAdvancedSamplersForMask(p: TwoAdvancedSamplersForMask_input, meta?: ComfyNodeMetadata): TwoAdvancedSamplersForMask
          /** category="ImpactPack_sampling" name="ImpactNegativeConditioningPlaceholder" output=[CONDITIONING] */
         ImpactNegativeConditioningPlaceholder(p: ImpactNegativeConditioningPlaceholder_input, meta?: ComfyNodeMetadata): ImpactNegativeConditioningPlaceholder
         /**
          * This is a feature that allows you to edit and send a Mask over a image.
          * If the block is set to 'is_empty_mask', the execution is stopped when the mask is empty.
          * category="ImpactPack_Util" name="PreviewBridge" output=[IMAGE, MASK]
         **/
         PreviewBridge(p: PreviewBridge_input, meta?: ComfyNodeMetadata): PreviewBridge
         /**
          * This is a feature that allows you to edit and send a Mask over a latent image.
          * If the block is set to 'is_empty_mask', the execution is stopped when the mask is empty.
          * category="ImpactPack_Util" name="PreviewBridgeLatent" output=[LATENT, MASK]
         **/
         PreviewBridgeLatent(p: PreviewBridgeLatent_input, meta?: ComfyNodeMetadata): PreviewBridgeLatent
         /**
          * Saves the input images to your ComfyUI output directory.
          * category="ImpactPack_Util" name="ImageSender" output=[]
         **/
         ImageSender(p: ImageSender_input, meta?: ComfyNodeMetadata): ImageSender
          /** category="ImpactPack_Util" name="ImageReceiver" output=[IMAGE, MASK] */
         ImageReceiver(p: ImageReceiver_input, meta?: ComfyNodeMetadata): ImageReceiver
          /** category="ImpactPack_Util" name="LatentSender" output=[] */
         LatentSender(p: LatentSender_input, meta?: ComfyNodeMetadata): LatentSender
          /** category="ImpactPack_Util" name="LatentReceiver" output=[LATENT] */
         LatentReceiver(p: LatentReceiver_input, meta?: ComfyNodeMetadata): LatentReceiver
          /** category="ImpactPack_Util" name="ImageMaskSwitch" output=[IMAGE, MASK] */
         ImageMaskSwitch(p: ImageMaskSwitch_input, meta?: ComfyNodeMetadata): ImageMaskSwitch
          /** category="ImpactPack_Util" name="LatentSwitch" output=[selected_value, selected_label, selected_index] */
         LatentSwitch(p: LatentSwitch_input, meta?: ComfyNodeMetadata): LatentSwitch
          /** category="ImpactPack_Util" name="SEGSSwitch" output=[selected_value, selected_label, selected_index] */
         SEGSSwitch(p: SEGSSwitch_input, meta?: ComfyNodeMetadata): SEGSSwitch
          /** category="ImpactPack_Util" name="ImpactSwitch" output=[selected_value, selected_label, selected_index] */
         ImpactSwitch(p: ImpactSwitch_input, meta?: ComfyNodeMetadata): ImpactSwitch
          /** category="ImpactPack_Util" name="ImpactInversedSwitch" output=[$Star] */
         ImpactInversedSwitch(p: ImpactInversedSwitch_input, meta?: ComfyNodeMetadata): ImpactInversedSwitch
          /** category="ImpactPack_Prompt" name="ImpactWildcardProcessor" output=[STRING] */
         ImpactWildcardProcessor(p: ImpactWildcardProcessor_input, meta?: ComfyNodeMetadata): ImpactWildcardProcessor
          /** category="ImpactPack_Prompt" name="ImpactWildcardEncode" output=[model, clip, conditioning, populated_text] */
         ImpactWildcardEncode(p: ImpactWildcardEncode_input, meta?: ComfyNodeMetadata): ImpactWildcardEncode
          /** category="ImpactPack_Upscale" name="SEGSUpscaler" output=[IMAGE] */
         SEGSUpscaler(p: SEGSUpscaler_input, meta?: ComfyNodeMetadata): SEGSUpscaler
          /** category="ImpactPack_Upscale" name="SEGSUpscalerPipe" output=[IMAGE] */
         SEGSUpscalerPipe(p: SEGSUpscalerPipe_input, meta?: ComfyNodeMetadata): SEGSUpscalerPipe
          /** category="ImpactPack_Detailer" name="SEGSDetailer" output=[segs, cnet_images] */
         SEGSDetailer(p: SEGSDetailer_input, meta?: ComfyNodeMetadata): SEGSDetailer
          /** category="ImpactPack_Detailer" name="SEGSPaste" output=[IMAGE] */
         SEGSPaste(p: SEGSPaste_input, meta?: ComfyNodeMetadata): SEGSPaste
          /** category="ImpactPack_Util" name="SEGSPreview" output=[IMAGE] */
         SEGSPreview(p: SEGSPreview_input, meta?: ComfyNodeMetadata): SEGSPreview
          /** category="ImpactPack_Util" name="SEGSPreviewCNet" output=[IMAGE] */
         SEGSPreviewCNet(p: SEGSPreviewCNet_input, meta?: ComfyNodeMetadata): SEGSPreviewCNet
          /** category="ImpactPack_Util" name="SEGSToImageList" output=[IMAGE] */
         SEGSToImageList(p: SEGSToImageList_input, meta?: ComfyNodeMetadata): SEGSToImageList
          /** category="ImpactPack_Util" name="ImpactSEGSToMaskList" output=[MASK] */
         ImpactSEGSToMaskList(p: ImpactSEGSToMaskList_input, meta?: ComfyNodeMetadata): ImpactSEGSToMaskList
          /** category="ImpactPack_Util" name="ImpactSEGSToMaskBatch" output=[MASK] */
         ImpactSEGSToMaskBatch(p: ImpactSEGSToMaskBatch_input, meta?: ComfyNodeMetadata): ImpactSEGSToMaskBatch
          /** category="ImpactPack_Util" name="ImpactSEGSConcat" output=[SEGS] */
         ImpactSEGSConcat(p: ImpactSEGSConcat_input, meta?: ComfyNodeMetadata): ImpactSEGSConcat
          /** category="ImpactPack_Util" name="ImpactSEGSPicker" output=[SEGS] */
         ImpactSEGSPicker(p: ImpactSEGSPicker_input, meta?: ComfyNodeMetadata): ImpactSEGSPicker
          /** category="ImpactPack___for_testing" name="ImpactMakeTileSEGS" output=[SEGS] */
         ImpactMakeTileSEGS(p: ImpactMakeTileSEGS_input, meta?: ComfyNodeMetadata): ImpactMakeTileSEGS
         /**
          * SEGS contains multiple SEGs. SEGS Merge integrates several SEGs into a single merged SEG. The label is changed to `merged` and the confidence becomes the minimum confidence. The applied controlnet and cropped_image are removed.
          * category="ImpactPack_Util" name="ImpactSEGSMerge" output=[SEGS]
         **/
         ImpactSEGSMerge(p: ImpactSEGSMerge_input, meta?: ComfyNodeMetadata): ImpactSEGSMerge
          /** category="ImpactPack_Detailer" name="SEGSDetailerForAnimateDiff" output=[segs, cnet_images] */
         SEGSDetailerForAnimateDiff(p: SEGSDetailerForAnimateDiff_input, meta?: ComfyNodeMetadata): SEGSDetailerForAnimateDiff
          /** category="ImpactPack_sampling" name="ImpactKSamplerBasicPipe" output=[BASIC_PIPE, LATENT, VAE] */
         ImpactKSamplerBasicPipe(p: ImpactKSamplerBasicPipe_input, meta?: ComfyNodeMetadata): ImpactKSamplerBasicPipe
          /** category="ImpactPack_sampling" name="ImpactKSamplerAdvancedBasicPipe" output=[BASIC_PIPE, LATENT, VAE] */
         ImpactKSamplerAdvancedBasicPipe(p: ImpactKSamplerAdvancedBasicPipe_input, meta?: ComfyNodeMetadata): ImpactKSamplerAdvancedBasicPipe
          /** category="ImpactPack_Util" name="ReencodeLatent" output=[LATENT] */
         ReencodeLatent(p: ReencodeLatent_input, meta?: ComfyNodeMetadata): ReencodeLatent
          /** category="ImpactPack_Util" name="ReencodeLatentPipe" output=[LATENT] */
         ReencodeLatentPipe(p: ReencodeLatentPipe_input, meta?: ComfyNodeMetadata): ReencodeLatentPipe
          /** category="ImpactPack_Util" name="ImpactImageBatchToImageList" output=[IMAGE] */
         ImpactImageBatchToImageList(p: ImpactImageBatchToImageList_input, meta?: ComfyNodeMetadata): ImpactImageBatchToImageList
          /** category="ImpactPack_Util" name="ImpactMakeImageList" output=[IMAGE] */
         ImpactMakeImageList(p: ImpactMakeImageList_input, meta?: ComfyNodeMetadata): ImpactMakeImageList
          /** category="ImpactPack_Util" name="ImpactMakeImageBatch" output=[IMAGE] */
         ImpactMakeImageBatch(p: ImpactMakeImageBatch_input, meta?: ComfyNodeMetadata): ImpactMakeImageBatch
          /** category="ImpactPack_Util" name="ImpactMakeAnyList" output=[$Star] */
         ImpactMakeAnyList(p: ImpactMakeAnyList_input, meta?: ComfyNodeMetadata): ImpactMakeAnyList
          /** category="ImpactPack_Util" name="ImpactMakeMaskList" output=[MASK] */
         ImpactMakeMaskList(p: ImpactMakeMaskList_input, meta?: ComfyNodeMetadata): ImpactMakeMaskList
          /** category="ImpactPack_Util" name="ImpactMakeMaskBatch" output=[MASK] */
         ImpactMakeMaskBatch(p: ImpactMakeMaskBatch_input, meta?: ComfyNodeMetadata): ImpactMakeMaskBatch
          /** category="ImpactPack_Regional" name="RegionalSampler" output=[LATENT] */
         RegionalSampler(p: RegionalSampler_input, meta?: ComfyNodeMetadata): RegionalSampler
          /** category="ImpactPack_Regional" name="RegionalSamplerAdvanced" output=[LATENT] */
         RegionalSamplerAdvanced(p: RegionalSamplerAdvanced_input, meta?: ComfyNodeMetadata): RegionalSamplerAdvanced
          /** category="ImpactPack_Regional" name="CombineRegionalPrompts" output=[REGIONAL_PROMPTS] */
         CombineRegionalPrompts(p: CombineRegionalPrompts_input, meta?: ComfyNodeMetadata): CombineRegionalPrompts
          /** category="ImpactPack_Regional" name="RegionalPrompt" output=[REGIONAL_PROMPTS] */
         RegionalPrompt(p: RegionalPrompt_input, meta?: ComfyNodeMetadata): RegionalPrompt
          /** category="ImpactPack_Util" name="ImpactCombineConditionings" output=[CONDITIONING] */
         ImpactCombineConditionings(p: ImpactCombineConditionings_input, meta?: ComfyNodeMetadata): ImpactCombineConditionings
          /** category="ImpactPack_Util" name="ImpactConcatConditionings" output=[CONDITIONING] */
         ImpactConcatConditionings(p: ImpactConcatConditionings_input, meta?: ComfyNodeMetadata): ImpactConcatConditionings
          /** category="ImpactPack_Util" name="ImpactSEGSLabelAssign" output=[SEGS] */
         ImpactSEGSLabelAssign(p: ImpactSEGSLabelAssign_input, meta?: ComfyNodeMetadata): ImpactSEGSLabelAssign
          /** category="ImpactPack_Util" name="ImpactSEGSLabelFilter" output=[filtered_SEGS, remained_SEGS] */
         ImpactSEGSLabelFilter(p: ImpactSEGSLabelFilter_input, meta?: ComfyNodeMetadata): ImpactSEGSLabelFilter
          /** category="ImpactPack_Util" name="ImpactSEGSRangeFilter" output=[filtered_SEGS, remained_SEGS] */
         ImpactSEGSRangeFilter(p: ImpactSEGSRangeFilter_input, meta?: ComfyNodeMetadata): ImpactSEGSRangeFilter
          /** category="ImpactPack_Util" name="ImpactSEGSOrderedFilter" output=[filtered_SEGS, remained_SEGS] */
         ImpactSEGSOrderedFilter(p: ImpactSEGSOrderedFilter_input, meta?: ComfyNodeMetadata): ImpactSEGSOrderedFilter
          /** category="ImpactPack_Logic" name="ImpactCompare" output=[BOOLEAN] */
         ImpactCompare(p: ImpactCompare_input, meta?: ComfyNodeMetadata): ImpactCompare
          /** category="ImpactPack_Logic" name="ImpactConditionalBranch" output=[$Star] */
         ImpactConditionalBranch(p: ImpactConditionalBranch_input, meta?: ComfyNodeMetadata): ImpactConditionalBranch
          /** category="ImpactPack_Logic" name="ImpactConditionalBranchSelMode" output=[$Star] */
         ImpactConditionalBranchSelMode(p: ImpactConditionalBranchSelMode_input, meta?: ComfyNodeMetadata): ImpactConditionalBranchSelMode
          /** category="ImpactPack_Logic" name="ImpactIfNone" output=[signal_opt, bool] */
         ImpactIfNone(p: ImpactIfNone_input, meta?: ComfyNodeMetadata): ImpactIfNone
          /** category="ImpactPack_Logic" name="ImpactConvertDataType" output=[STRING, FLOAT, INT, BOOLEAN] */
         ImpactConvertDataType(p: ImpactConvertDataType_input, meta?: ComfyNodeMetadata): ImpactConvertDataType
          /** category="ImpactPack_Logic" name="ImpactLogicalOperators" output=[BOOLEAN] */
         ImpactLogicalOperators(p: ImpactLogicalOperators_input, meta?: ComfyNodeMetadata): ImpactLogicalOperators
          /** category="ImpactPack_Logic" name="ImpactInt" output=[INT] */
         ImpactInt(p: ImpactInt_input, meta?: ComfyNodeMetadata): ImpactInt
          /** category="ImpactPack_Logic" name="ImpactFloat" output=[FLOAT] */
         ImpactFloat(p: ImpactFloat_input, meta?: ComfyNodeMetadata): ImpactFloat
          /** category="ImpactPack_Logic" name="ImpactBoolean" output=[BOOLEAN] */
         ImpactBoolean(p: ImpactBoolean_input, meta?: ComfyNodeMetadata): ImpactBoolean
          /** category="ImpactPack_Logic" name="ImpactValueSender" output=[signal] */
         ImpactValueSender(p: ImpactValueSender_input, meta?: ComfyNodeMetadata): ImpactValueSender
          /** category="ImpactPack_Logic" name="ImpactValueReceiver" output=[$Star] */
         ImpactValueReceiver(p: ImpactValueReceiver_input, meta?: ComfyNodeMetadata): ImpactValueReceiver
          /** category="ImpactPack_Logic__for_test" name="ImpactImageInfo" output=[batch, height, width, channel] */
         ImpactImageInfo(p: ImpactImageInfo_input, meta?: ComfyNodeMetadata): ImpactImageInfo
          /** category="ImpactPack_Logic__for_test" name="ImpactLatentInfo" output=[batch, height, width, channel] */
         ImpactLatentInfo(p: ImpactLatentInfo_input, meta?: ComfyNodeMetadata): ImpactLatentInfo
          /** category="ImpactPack_Logic__for_test" name="ImpactMinMax" output=[INT] */
         ImpactMinMax(p: ImpactMinMax_input, meta?: ComfyNodeMetadata): ImpactMinMax
          /** category="ImpactPack_Logic" name="ImpactNeg" output=[BOOLEAN] */
         ImpactNeg(p: ImpactNeg_input, meta?: ComfyNodeMetadata): ImpactNeg
          /** category="ImpactPack_Logic" name="ImpactConditionalStopIteration" output=[] */
         ImpactConditionalStopIteration(p: ImpactConditionalStopIteration_input, meta?: ComfyNodeMetadata): ImpactConditionalStopIteration
          /** category="ImpactPack_Util" name="ImpactStringSelector" output=[STRING] */
         ImpactStringSelector(p: ImpactStringSelector_input, meta?: ComfyNodeMetadata): ImpactStringSelector
          /** category="ImpactPack_Util" name="StringListToString" output=[STRING] */
         StringListToString(p: StringListToString_input, meta?: ComfyNodeMetadata): StringListToString
          /** category="ImpactPack_Util" name="WildcardPromptFromString" output=[wildcard, segs_labels] */
         WildcardPromptFromString(p: WildcardPromptFromString_input, meta?: ComfyNodeMetadata): WildcardPromptFromString
          /** category="ImpactPack_Util" name="ImpactExecutionOrderController" output=[signal, value] */
         ImpactExecutionOrderController(p: ImpactExecutionOrderController_input, meta?: ComfyNodeMetadata): ImpactExecutionOrderController
          /** category="ImpactPack_Util" name="RemoveNoiseMask" output=[LATENT] */
         RemoveNoiseMask(p: RemoveNoiseMask_input, meta?: ComfyNodeMetadata): RemoveNoiseMask
          /** category="ImpactPack_Debug" name="ImpactLogger" output=[] */
         ImpactLogger(p: ImpactLogger_input, meta?: ComfyNodeMetadata): ImpactLogger
          /** category="ImpactPack_Debug" name="ImpactDummyInput" output=[$Star] */
         ImpactDummyInput(p: ImpactDummyInput_input, meta?: ComfyNodeMetadata): ImpactDummyInput
          /** category="ImpactPack_Logic__for_test" name="ImpactQueueTrigger" output=[signal_opt] */
         ImpactQueueTrigger(p: ImpactQueueTrigger_input, meta?: ComfyNodeMetadata): ImpactQueueTrigger
          /** category="ImpactPack_Logic__for_test" name="ImpactQueueTriggerCountdown" output=[signal_opt, count, total] */
         ImpactQueueTriggerCountdown(p: ImpactQueueTriggerCountdown_input, meta?: ComfyNodeMetadata): ImpactQueueTriggerCountdown
          /** category="ImpactPack_Logic__for_test" name="ImpactSetWidgetValue" output=[signal_opt] */
         ImpactSetWidgetValue(p: ImpactSetWidgetValue_input, meta?: ComfyNodeMetadata): ImpactSetWidgetValue
          /** category="ImpactPack_Logic__for_test" name="ImpactNodeSetMuteState" output=[signal_opt] */
         ImpactNodeSetMuteState(p: ImpactNodeSetMuteState_input, meta?: ComfyNodeMetadata): ImpactNodeSetMuteState
         /**
          * When behavior is Stop and mode is active, the input value is passed directly to the output.
          * When behavior is Mute/Bypass and mode is active, the node connected to the output is changed to active state.
          * When behavior is Stop and mode is Stop/Mute/Bypass, the workflow execution of the current node is halted.
          * When behavior is Mute/Bypass and mode is Stop/Mute/Bypass, the node connected to the output is changed to Mute/Bypass state.
          * category="ImpactPack_Logic" name="ImpactControlBridge" output=[value]
         **/
         ImpactControlBridge(p: ImpactControlBridge_input, meta?: ComfyNodeMetadata): ImpactControlBridge
          /** category="ImpactPack_Logic" name="ImpactIsNotEmptySEGS" output=[BOOLEAN] */
         ImpactIsNotEmptySEGS(p: ImpactIsNotEmptySEGS_input, meta?: ComfyNodeMetadata): ImpactIsNotEmptySEGS
          /** category="ImpactPack_Logic__for_test" name="ImpactSleep" output=[signal_opt] */
         ImpactSleep(p: ImpactSleep_input, meta?: ComfyNodeMetadata): ImpactSleep
          /** category="ImpactPack_Logic__for_test" name="ImpactRemoteBoolean" output=[] */
         ImpactRemoteBoolean(p: ImpactRemoteBoolean_input, meta?: ComfyNodeMetadata): ImpactRemoteBoolean
          /** category="ImpactPack_Logic__for_test" name="ImpactRemoteInt" output=[] */
         ImpactRemoteInt(p: ImpactRemoteInt_input, meta?: ComfyNodeMetadata): ImpactRemoteInt
          /** category="ImpactPack_HuggingFace" name="ImpactHFTransformersClassifierProvider" output=[TRANSFORMERS_CLASSIFIER] */
         ImpactHFTransformersClassifierProvider(p: ImpactHFTransformersClassifierProvider_input, meta?: ComfyNodeMetadata): ImpactHFTransformersClassifierProvider
          /** category="ImpactPack_HuggingFace" name="ImpactSEGSClassify" output=[filtered_SEGS, remained_SEGS, detected_labels] */
         ImpactSEGSClassify(p: ImpactSEGSClassify_input, meta?: ComfyNodeMetadata): ImpactSEGSClassify
          /** category="ImpactPack_Util" name="ImpactSchedulerAdapter" output=[scheduler] */
         ImpactSchedulerAdapter(p: ImpactSchedulerAdapter_input, meta?: ComfyNodeMetadata): ImpactSchedulerAdapter
          /** category="ImpactPack_sampling" name="GITSSchedulerFuncProvider" output=[SCHEDULER_FUNC] */
         GITSSchedulerFuncProvider(p: GITSSchedulerFuncProvider_input, meta?: ComfyNodeMetadata): GITSSchedulerFuncProvider
          /** category="ImpactPack" name="UltralyticsDetectorProvider" output=[BBOX_DETECTOR, SEGM_DETECTOR] */
         UltralyticsDetectorProvider(p: UltralyticsDetectorProvider_input, meta?: ComfyNodeMetadata): UltralyticsDetectorProvider
      }
      interface SAMLoader extends HasSingle_SAM_MODEL, ComfyNode<SAMLoader_input, SAMLoader_output> {
          nameInComfy: "SAMLoader"
      }
      interface SAMLoader_output {
          SAM_MODEL: ComfyNodeOutput<'SAM_MODEL', 0>,
      }
      interface SAMLoader_input {
          /** */
          model_name: Comfy.Union.E_40c777392f92d61852ab0f7a429a755abf59b71a
          /** */
          device_mode: Comfy.Union.E_2ad445b99254e9b51c963d9f1a75fabe3d01e569
      }
      interface CLIPSegDetectorProvider extends HasSingle_BBOX_DETECTOR, ComfyNode<CLIPSegDetectorProvider_input, CLIPSegDetectorProvider_output> {
          nameInComfy: "CLIPSegDetectorProvider"
      }
      interface CLIPSegDetectorProvider_output {
          BBOX_DETECTOR: ComfyNodeOutput<'BBOX_DETECTOR', 0>,
      }
      interface CLIPSegDetectorProvider_input {
          /** */
          text: Comfy.Input.STRING
          /** default=7 min=15 max=15 step=0.1 */
          blur?: Comfy.Input.FLOAT
          /** default=0.4 min=1 max=1 step=0.05 */
          threshold?: Comfy.Input.FLOAT
          /** default=4 min=10 max=10 step=1 */
          dilation_factor?: Comfy.Input.INT
      }
      interface ONNXDetectorProvider extends HasSingle_BBOX_DETECTOR, ComfyNode<ONNXDetectorProvider_input, ONNXDetectorProvider_output> {
          nameInComfy: "ONNXDetectorProvider"
      }
      interface ONNXDetectorProvider_output {
          BBOX_DETECTOR: ComfyNodeOutput<'BBOX_DETECTOR', 0>,
      }
      interface ONNXDetectorProvider_input {
          model_name: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
      }
      interface BitwiseAndMaskForEach extends HasSingle_SEGS, ComfyNode<BitwiseAndMaskForEach_input, BitwiseAndMaskForEach_output> {
          nameInComfy: "BitwiseAndMaskForEach"
      }
      interface BitwiseAndMaskForEach_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface BitwiseAndMaskForEach_input {
          base_segs: Comfy.Input.SEGS
          mask_segs: Comfy.Input.SEGS
      }
      interface SubtractMaskForEach extends HasSingle_SEGS, ComfyNode<SubtractMaskForEach_input, SubtractMaskForEach_output> {
          nameInComfy: "SubtractMaskForEach"
      }
      interface SubtractMaskForEach_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface SubtractMaskForEach_input {
          base_segs: Comfy.Input.SEGS
          mask_segs: Comfy.Input.SEGS
      }
      interface DetailerForEach extends HasSingle_IMAGE, ComfyNode<DetailerForEach_input, DetailerForEach_output> {
          nameInComfy: "DetailerForEach"
      }
      interface DetailerForEach_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface DetailerForEach_input {
          image: Comfy.Input.IMAGE
          segs: Comfy.Input.SEGS
          model: Comfy.Input.MODEL
          clip: Comfy.Input.CLIP
          vae: Comfy.Input.VAE
          /** default=512 min=16384 max=16384 step=8 */
          guide_size?: Comfy.Input.FLOAT
          /** default=true */
          guide_size_for?: Comfy.Input.BOOLEAN
          /** default=1024 min=16384 max=16384 step=8 */
          max_size?: Comfy.Input.FLOAT
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          /** default=0.5 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=5 min=100 max=100 step=1 */
          feather?: Comfy.Input.INT
          /** default=true */
          noise_mask?: Comfy.Input.BOOLEAN
          /** default=true */
          force_inpaint?: Comfy.Input.BOOLEAN
          /** */
          wildcard: Comfy.Input.STRING
          /** default=1 min=10 max=10 step=1 */
          cycle?: Comfy.Input.INT
          detailer_hook?: Comfy.Input.DETAILER_HOOK
          /** default=false */
          inpaint_model?: Comfy.Input.BOOLEAN
          /** default=20 min=100 max=100 step=1 */
          noise_mask_feather?: Comfy.Input.INT
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface DetailerForEachDebug extends ComfyNode<DetailerForEachDebug_input, DetailerForEachDebug_output> {
          nameInComfy: "DetailerForEachDebug"
      }
      interface DetailerForEachDebug_output {
          image: ComfyNodeOutput<'IMAGE', 0>,
          cropped: ComfyNodeOutput<'IMAGE', 1>,
          cropped_refined: ComfyNodeOutput<'IMAGE', 2>,
          cropped_refined_alpha: ComfyNodeOutput<'IMAGE', 3>,
          cnet_images: ComfyNodeOutput<'IMAGE', 4>,
      }
      interface DetailerForEachDebug_input {
          image: Comfy.Input.IMAGE
          segs: Comfy.Input.SEGS
          model: Comfy.Input.MODEL
          clip: Comfy.Input.CLIP
          vae: Comfy.Input.VAE
          /** default=512 min=16384 max=16384 step=8 */
          guide_size?: Comfy.Input.FLOAT
          /** default=true */
          guide_size_for?: Comfy.Input.BOOLEAN
          /** default=1024 min=16384 max=16384 step=8 */
          max_size?: Comfy.Input.FLOAT
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          /** default=0.5 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=5 min=100 max=100 step=1 */
          feather?: Comfy.Input.INT
          /** default=true */
          noise_mask?: Comfy.Input.BOOLEAN
          /** default=true */
          force_inpaint?: Comfy.Input.BOOLEAN
          /** */
          wildcard: Comfy.Input.STRING
          /** default=1 min=10 max=10 step=1 */
          cycle?: Comfy.Input.INT
          detailer_hook?: Comfy.Input.DETAILER_HOOK
          /** default=false */
          inpaint_model?: Comfy.Input.BOOLEAN
          /** default=20 min=100 max=100 step=1 */
          noise_mask_feather?: Comfy.Input.INT
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface DetailerForEachPipe extends HasSingle_SEGS, HasSingle_BASIC_PIPE, ComfyNode<DetailerForEachPipe_input, DetailerForEachPipe_output> {
          nameInComfy: "DetailerForEachPipe"
      }
      interface DetailerForEachPipe_output {
          image: ComfyNodeOutput<'IMAGE', 0>,
          segs: ComfyNodeOutput<'SEGS', 1>,
          basic_pipe: ComfyNodeOutput<'BASIC_PIPE', 2>,
          cnet_images: ComfyNodeOutput<'IMAGE', 3>,
      }
      interface DetailerForEachPipe_input {
          image: Comfy.Input.IMAGE
          segs: Comfy.Input.SEGS
          /** default=512 min=16384 max=16384 step=8 */
          guide_size?: Comfy.Input.FLOAT
          /** default=true */
          guide_size_for?: Comfy.Input.BOOLEAN
          /** default=1024 min=16384 max=16384 step=8 */
          max_size?: Comfy.Input.FLOAT
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          /** default=0.5 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=5 min=100 max=100 step=1 */
          feather?: Comfy.Input.INT
          /** default=true */
          noise_mask?: Comfy.Input.BOOLEAN
          /** default=true */
          force_inpaint?: Comfy.Input.BOOLEAN
          basic_pipe: Comfy.Input.BASIC_PIPE
          /** */
          wildcard: Comfy.Input.STRING
          /** default=0.2 min=1 max=1 */
          refiner_ratio?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=1 */
          cycle?: Comfy.Input.INT
          detailer_hook?: Comfy.Input.DETAILER_HOOK
          refiner_basic_pipe_opt?: Comfy.Input.BASIC_PIPE
          /** default=false */
          inpaint_model?: Comfy.Input.BOOLEAN
          /** default=20 min=100 max=100 step=1 */
          noise_mask_feather?: Comfy.Input.INT
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface DetailerForEachDebugPipe extends HasSingle_SEGS, HasSingle_BASIC_PIPE, ComfyNode<DetailerForEachDebugPipe_input, DetailerForEachDebugPipe_output> {
          nameInComfy: "DetailerForEachDebugPipe"
      }
      interface DetailerForEachDebugPipe_output {
          image: ComfyNodeOutput<'IMAGE', 0>,
          segs: ComfyNodeOutput<'SEGS', 1>,
          basic_pipe: ComfyNodeOutput<'BASIC_PIPE', 2>,
          cropped: ComfyNodeOutput<'IMAGE', 3>,
          cropped_refined: ComfyNodeOutput<'IMAGE', 4>,
          cropped_refined_alpha: ComfyNodeOutput<'IMAGE', 5>,
          cnet_images: ComfyNodeOutput<'IMAGE', 6>,
      }
      interface DetailerForEachDebugPipe_input {
          image: Comfy.Input.IMAGE
          segs: Comfy.Input.SEGS
          /** default=512 min=16384 max=16384 step=8 */
          guide_size?: Comfy.Input.FLOAT
          /** default=true */
          guide_size_for?: Comfy.Input.BOOLEAN
          /** default=1024 min=16384 max=16384 step=8 */
          max_size?: Comfy.Input.FLOAT
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          /** default=0.5 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=5 min=100 max=100 step=1 */
          feather?: Comfy.Input.INT
          /** default=true */
          noise_mask?: Comfy.Input.BOOLEAN
          /** default=true */
          force_inpaint?: Comfy.Input.BOOLEAN
          basic_pipe: Comfy.Input.BASIC_PIPE
          /** */
          wildcard: Comfy.Input.STRING
          /** default=0.2 min=1 max=1 */
          refiner_ratio?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=1 */
          cycle?: Comfy.Input.INT
          detailer_hook?: Comfy.Input.DETAILER_HOOK
          refiner_basic_pipe_opt?: Comfy.Input.BASIC_PIPE
          /** default=false */
          inpaint_model?: Comfy.Input.BOOLEAN
          /** default=20 min=100 max=100 step=1 */
          noise_mask_feather?: Comfy.Input.INT
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface DetailerForEachPipeForAnimateDiff extends HasSingle_SEGS, HasSingle_BASIC_PIPE, ComfyNode<DetailerForEachPipeForAnimateDiff_input, DetailerForEachPipeForAnimateDiff_output> {
          nameInComfy: "DetailerForEachPipeForAnimateDiff"
      }
      interface DetailerForEachPipeForAnimateDiff_output {
          image: ComfyNodeOutput<'IMAGE', 0>,
          segs: ComfyNodeOutput<'SEGS', 1>,
          basic_pipe: ComfyNodeOutput<'BASIC_PIPE', 2>,
          cnet_images: ComfyNodeOutput<'IMAGE', 3>,
      }
      interface DetailerForEachPipeForAnimateDiff_input {
          image_frames: Comfy.Input.IMAGE
          segs: Comfy.Input.SEGS
          /** default=512 min=16384 max=16384 step=8 */
          guide_size?: Comfy.Input.FLOAT
          /** default=true */
          guide_size_for?: Comfy.Input.BOOLEAN
          /** default=1024 min=16384 max=16384 step=8 */
          max_size?: Comfy.Input.FLOAT
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          /** default=0.5 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=5 min=100 max=100 step=1 */
          feather?: Comfy.Input.INT
          basic_pipe: Comfy.Input.BASIC_PIPE
          /** default=0.2 min=1 max=1 */
          refiner_ratio?: Comfy.Input.FLOAT
          detailer_hook?: Comfy.Input.DETAILER_HOOK
          refiner_basic_pipe_opt?: Comfy.Input.BASIC_PIPE
          /** default=20 min=100 max=100 step=1 */
          noise_mask_feather?: Comfy.Input.INT
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface SAMDetectorCombined extends HasSingle_MASK, ComfyNode<SAMDetectorCombined_input, SAMDetectorCombined_output> {
          nameInComfy: "SAMDetectorCombined"
      }
      interface SAMDetectorCombined_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface SAMDetectorCombined_input {
          /** */
          sam_model: Comfy.Input.SAM_MODEL
          /** */
          segs: Comfy.Input.SEGS
          /** */
          image: Comfy.Input.IMAGE
          /** */
          detection_hint: Comfy.Union.E_40275a874822a8699ee13794e127b63cdd6bfdae
          /** default=0 min=512 max=512 step=1 */
          dilation?: Comfy.Input.INT
          /** default=0.93 min=1 max=1 step=0.01 */
          threshold?: Comfy.Input.FLOAT
          /** default=0 min=1000 max=1000 step=1 */
          bbox_expansion?: Comfy.Input.INT
          /** default=0.7 min=1 max=1 step=0.01 */
          mask_hint_threshold?: Comfy.Input.FLOAT
          /** */
          mask_hint_use_negative: Comfy.Union.E_aa302307a82588b6e514aca43e4cddad342a73fc
      }
      interface SAMDetectorSegmented extends ComfyNode<SAMDetectorSegmented_input, SAMDetectorSegmented_output> {
          nameInComfy: "SAMDetectorSegmented"
      }
      interface SAMDetectorSegmented_output {
          combined_mask: ComfyNodeOutput<'MASK', 0>,
          batch_masks: ComfyNodeOutput<'MASK', 1>,
      }
      interface SAMDetectorSegmented_input {
          /** */
          sam_model: Comfy.Input.SAM_MODEL
          /** */
          segs: Comfy.Input.SEGS
          /** */
          image: Comfy.Input.IMAGE
          /** */
          detection_hint: Comfy.Union.E_40275a874822a8699ee13794e127b63cdd6bfdae
          /** default=0 min=512 max=512 step=1 */
          dilation?: Comfy.Input.INT
          /** default=0.93 min=1 max=1 step=0.01 */
          threshold?: Comfy.Input.FLOAT
          /** default=0 min=1000 max=1000 step=1 */
          bbox_expansion?: Comfy.Input.INT
          /** default=0.7 min=1 max=1 step=0.01 */
          mask_hint_threshold?: Comfy.Input.FLOAT
          /** */
          mask_hint_use_negative: Comfy.Union.E_aa302307a82588b6e514aca43e4cddad342a73fc
      }
      interface FaceDetailer extends HasSingle_MASK, HasSingle_DETAILER_PIPE, ComfyNode<FaceDetailer_input, FaceDetailer_output> {
          nameInComfy: "FaceDetailer"
      }
      interface FaceDetailer_output {
          image: ComfyNodeOutput<'IMAGE', 0>,
          cropped_refined: ComfyNodeOutput<'IMAGE', 1>,
          cropped_enhanced_alpha: ComfyNodeOutput<'IMAGE', 2>,
          mask: ComfyNodeOutput<'MASK', 3>,
          detailer_pipe: ComfyNodeOutput<'DETAILER_PIPE', 4>,
          cnet_images: ComfyNodeOutput<'IMAGE', 5>,
      }
      interface FaceDetailer_input {
          image: Comfy.Input.IMAGE
          model: Comfy.Input.MODEL
          clip: Comfy.Input.CLIP
          vae: Comfy.Input.VAE
          /** default=512 min=16384 max=16384 step=8 */
          guide_size?: Comfy.Input.FLOAT
          /** default=true */
          guide_size_for?: Comfy.Input.BOOLEAN
          /** default=1024 min=16384 max=16384 step=8 */
          max_size?: Comfy.Input.FLOAT
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          /** default=0.5 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=5 min=100 max=100 step=1 */
          feather?: Comfy.Input.INT
          /** default=true */
          noise_mask?: Comfy.Input.BOOLEAN
          /** default=true */
          force_inpaint?: Comfy.Input.BOOLEAN
          /** default=0.5 min=1 max=1 step=0.01 */
          bbox_threshold?: Comfy.Input.FLOAT
          /** default=10 min=512 max=512 step=1 */
          bbox_dilation?: Comfy.Input.INT
          /** default=3 min=10 max=10 step=0.1 */
          bbox_crop_factor?: Comfy.Input.FLOAT
          sam_detection_hint: Comfy.Union.E_40275a874822a8699ee13794e127b63cdd6bfdae
          /** default=0 min=512 max=512 step=1 */
          sam_dilation?: Comfy.Input.INT
          /** default=0.93 min=1 max=1 step=0.01 */
          sam_threshold?: Comfy.Input.FLOAT
          /** default=0 min=1000 max=1000 step=1 */
          sam_bbox_expansion?: Comfy.Input.INT
          /** default=0.7 min=1 max=1 step=0.01 */
          sam_mask_hint_threshold?: Comfy.Input.FLOAT
          sam_mask_hint_use_negative: Comfy.Union.E_aa302307a82588b6e514aca43e4cddad342a73fc
          /** default=10 min=16384 max=16384 step=1 */
          drop_size?: Comfy.Input.INT
          bbox_detector: Comfy.Input.BBOX_DETECTOR
          /** */
          wildcard: Comfy.Input.STRING
          /** default=1 min=10 max=10 step=1 */
          cycle?: Comfy.Input.INT
          sam_model_opt?: Comfy.Input.SAM_MODEL
          segm_detector_opt?: Comfy.Input.SEGM_DETECTOR
          detailer_hook?: Comfy.Input.DETAILER_HOOK
          /** default=false */
          inpaint_model?: Comfy.Input.BOOLEAN
          /** default=20 min=100 max=100 step=1 */
          noise_mask_feather?: Comfy.Input.INT
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface FaceDetailerPipe extends HasSingle_MASK, HasSingle_DETAILER_PIPE, ComfyNode<FaceDetailerPipe_input, FaceDetailerPipe_output> {
          nameInComfy: "FaceDetailerPipe"
      }
      interface FaceDetailerPipe_output {
          image: ComfyNodeOutput<'IMAGE', 0>,
          cropped_refined: ComfyNodeOutput<'IMAGE', 1>,
          cropped_enhanced_alpha: ComfyNodeOutput<'IMAGE', 2>,
          mask: ComfyNodeOutput<'MASK', 3>,
          detailer_pipe: ComfyNodeOutput<'DETAILER_PIPE', 4>,
          cnet_images: ComfyNodeOutput<'IMAGE', 5>,
      }
      interface FaceDetailerPipe_input {
          image: Comfy.Input.IMAGE
          detailer_pipe: Comfy.Input.DETAILER_PIPE
          /** default=512 min=16384 max=16384 step=8 */
          guide_size?: Comfy.Input.FLOAT
          /** default=true */
          guide_size_for?: Comfy.Input.BOOLEAN
          /** default=1024 min=16384 max=16384 step=8 */
          max_size?: Comfy.Input.FLOAT
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          /** default=0.5 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=5 min=100 max=100 step=1 */
          feather?: Comfy.Input.INT
          /** default=true */
          noise_mask?: Comfy.Input.BOOLEAN
          /** default=true */
          force_inpaint?: Comfy.Input.BOOLEAN
          /** default=0.5 min=1 max=1 step=0.01 */
          bbox_threshold?: Comfy.Input.FLOAT
          /** default=10 min=512 max=512 step=1 */
          bbox_dilation?: Comfy.Input.INT
          /** default=3 min=10 max=10 step=0.1 */
          bbox_crop_factor?: Comfy.Input.FLOAT
          sam_detection_hint: Comfy.Union.E_40275a874822a8699ee13794e127b63cdd6bfdae
          /** default=0 min=512 max=512 step=1 */
          sam_dilation?: Comfy.Input.INT
          /** default=0.93 min=1 max=1 step=0.01 */
          sam_threshold?: Comfy.Input.FLOAT
          /** default=0 min=1000 max=1000 step=1 */
          sam_bbox_expansion?: Comfy.Input.INT
          /** default=0.7 min=1 max=1 step=0.01 */
          sam_mask_hint_threshold?: Comfy.Input.FLOAT
          sam_mask_hint_use_negative: Comfy.Union.E_aa302307a82588b6e514aca43e4cddad342a73fc
          /** default=10 min=16384 max=16384 step=1 */
          drop_size?: Comfy.Input.INT
          /** default=0.2 min=1 max=1 */
          refiner_ratio?: Comfy.Input.FLOAT
          /** default=1 min=10 max=10 step=1 */
          cycle?: Comfy.Input.INT
          /** default=false */
          inpaint_model?: Comfy.Input.BOOLEAN
          /** default=20 min=100 max=100 step=1 */
          noise_mask_feather?: Comfy.Input.INT
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface MaskDetailerPipe extends ComfyNode<MaskDetailerPipe_input, MaskDetailerPipe_output> {
          nameInComfy: "MaskDetailerPipe"
      }
      interface MaskDetailerPipe_output {
          image: ComfyNodeOutput<'IMAGE', 0>,
          cropped_refined: ComfyNodeOutput<'IMAGE', 1>,
          cropped_enhanced_alpha: ComfyNodeOutput<'IMAGE', 2>,
          basic_pipe: ComfyNodeOutput<'BASIC_PIPE', 3>,
          refiner_basic_pipe_opt: ComfyNodeOutput<'BASIC_PIPE', 4>,
      }
      interface MaskDetailerPipe_input {
          image: Comfy.Input.IMAGE
          mask: Comfy.Input.MASK
          basic_pipe: Comfy.Input.BASIC_PIPE
          /** default=512 min=16384 max=16384 step=8 */
          guide_size?: Comfy.Input.FLOAT
          /** default=true */
          guide_size_for?: Comfy.Input.BOOLEAN
          /** default=1024 min=16384 max=16384 step=8 */
          max_size?: Comfy.Input.FLOAT
          /** default=true */
          mask_mode?: Comfy.Input.BOOLEAN
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          /** default=0.5 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=5 min=100 max=100 step=1 */
          feather?: Comfy.Input.INT
          /** default=3 min=10 max=10 step=0.1 */
          crop_factor?: Comfy.Input.FLOAT
          /** default=10 min=16384 max=16384 step=1 */
          drop_size?: Comfy.Input.INT
          /** default=0.2 min=1 max=1 */
          refiner_ratio?: Comfy.Input.FLOAT
          /** default=1 min=100 max=100 */
          batch_size?: Comfy.Input.INT
          /** default=1 min=10 max=10 step=1 */
          cycle?: Comfy.Input.INT
          refiner_basic_pipe_opt?: Comfy.Input.BASIC_PIPE
          detailer_hook?: Comfy.Input.DETAILER_HOOK
          /** default=false */
          inpaint_model?: Comfy.Input.BOOLEAN
          /** default=20 min=100 max=100 step=1 */
          noise_mask_feather?: Comfy.Input.INT
          /** default=false */
          bbox_fill?: Comfy.Input.BOOLEAN
          /** default=true */
          contour_fill?: Comfy.Input.BOOLEAN
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface ToDetailerPipe extends HasSingle_DETAILER_PIPE, ComfyNode<ToDetailerPipe_input, ToDetailerPipe_output> {
          nameInComfy: "ToDetailerPipe"
      }
      interface ToDetailerPipe_output {
          detailer_pipe: ComfyNodeOutput<'DETAILER_PIPE', 0>,
      }
      interface ToDetailerPipe_input {
          model: Comfy.Input.MODEL
          clip: Comfy.Input.CLIP
          vae: Comfy.Input.VAE
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          bbox_detector: Comfy.Input.BBOX_DETECTOR
          /** */
          wildcard: Comfy.Input.STRING
          "Select to add LoRA": Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df
          "Select to add Wildcard": Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26
          sam_model_opt?: Comfy.Input.SAM_MODEL
          segm_detector_opt?: Comfy.Input.SEGM_DETECTOR
          detailer_hook?: Comfy.Input.DETAILER_HOOK
      }
      interface ToDetailerPipeSDXL extends HasSingle_DETAILER_PIPE, ComfyNode<ToDetailerPipeSDXL_input, ToDetailerPipeSDXL_output> {
          nameInComfy: "ToDetailerPipeSDXL"
      }
      interface ToDetailerPipeSDXL_output {
          detailer_pipe: ComfyNodeOutput<'DETAILER_PIPE', 0>,
      }
      interface ToDetailerPipeSDXL_input {
          model: Comfy.Input.MODEL
          clip: Comfy.Input.CLIP
          vae: Comfy.Input.VAE
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          refiner_model: Comfy.Input.MODEL
          refiner_clip: Comfy.Input.CLIP
          refiner_positive: Comfy.Input.CONDITIONING
          refiner_negative: Comfy.Input.CONDITIONING
          bbox_detector: Comfy.Input.BBOX_DETECTOR
          /** */
          wildcard: Comfy.Input.STRING
          "Select to add LoRA": Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df
          "Select to add Wildcard": Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26
          sam_model_opt?: Comfy.Input.SAM_MODEL
          segm_detector_opt?: Comfy.Input.SEGM_DETECTOR
          detailer_hook?: Comfy.Input.DETAILER_HOOK
      }
      interface FromDetailerPipe extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, HasSingle_BBOX_DETECTOR, HasSingle_SAM_MODEL, HasSingle_SEGM_DETECTOR, HasSingle_DETAILER_HOOK, ComfyNode<FromDetailerPipe_input, FromDetailerPipe_output> {
          nameInComfy: "FromDetailerPipe"
      }
      interface FromDetailerPipe_output {
          model: ComfyNodeOutput<'MODEL', 0>,
          clip: ComfyNodeOutput<'CLIP', 1>,
          vae: ComfyNodeOutput<'VAE', 2>,
          positive: ComfyNodeOutput<'CONDITIONING', 3>,
          negative: ComfyNodeOutput<'CONDITIONING', 4>,
          bbox_detector: ComfyNodeOutput<'BBOX_DETECTOR', 5>,
          sam_model_opt: ComfyNodeOutput<'SAM_MODEL', 6>,
          segm_detector_opt: ComfyNodeOutput<'SEGM_DETECTOR', 7>,
          detailer_hook: ComfyNodeOutput<'DETAILER_HOOK', 8>,
      }
      interface FromDetailerPipe_input {
          detailer_pipe: Comfy.Input.DETAILER_PIPE
      }
      interface FromDetailerPipe$_v2 extends HasSingle_DETAILER_PIPE, HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, HasSingle_BBOX_DETECTOR, HasSingle_SAM_MODEL, HasSingle_SEGM_DETECTOR, HasSingle_DETAILER_HOOK, ComfyNode<FromDetailerPipe$_v2_input, FromDetailerPipe$_v2_output> {
          nameInComfy: "FromDetailerPipe_v2"
      }
      interface FromDetailerPipe$_v2_output {
          detailer_pipe: ComfyNodeOutput<'DETAILER_PIPE', 0>,
          model: ComfyNodeOutput<'MODEL', 1>,
          clip: ComfyNodeOutput<'CLIP', 2>,
          vae: ComfyNodeOutput<'VAE', 3>,
          positive: ComfyNodeOutput<'CONDITIONING', 4>,
          negative: ComfyNodeOutput<'CONDITIONING', 5>,
          bbox_detector: ComfyNodeOutput<'BBOX_DETECTOR', 6>,
          sam_model_opt: ComfyNodeOutput<'SAM_MODEL', 7>,
          segm_detector_opt: ComfyNodeOutput<'SEGM_DETECTOR', 8>,
          detailer_hook: ComfyNodeOutput<'DETAILER_HOOK', 9>,
      }
      interface FromDetailerPipe$_v2_input {
          detailer_pipe: Comfy.Input.DETAILER_PIPE
      }
      interface FromDetailerPipeSDXL extends HasSingle_DETAILER_PIPE, HasSingle_VAE, HasSingle_BBOX_DETECTOR, HasSingle_SAM_MODEL, HasSingle_SEGM_DETECTOR, HasSingle_DETAILER_HOOK, ComfyNode<FromDetailerPipeSDXL_input, FromDetailerPipeSDXL_output> {
          nameInComfy: "FromDetailerPipeSDXL"
      }
      interface FromDetailerPipeSDXL_output {
          detailer_pipe: ComfyNodeOutput<'DETAILER_PIPE', 0>,
          model: ComfyNodeOutput<'MODEL', 1>,
          clip: ComfyNodeOutput<'CLIP', 2>,
          vae: ComfyNodeOutput<'VAE', 3>,
          positive: ComfyNodeOutput<'CONDITIONING', 4>,
          negative: ComfyNodeOutput<'CONDITIONING', 5>,
          bbox_detector: ComfyNodeOutput<'BBOX_DETECTOR', 6>,
          sam_model_opt: ComfyNodeOutput<'SAM_MODEL', 7>,
          segm_detector_opt: ComfyNodeOutput<'SEGM_DETECTOR', 8>,
          detailer_hook: ComfyNodeOutput<'DETAILER_HOOK', 9>,
          refiner_model: ComfyNodeOutput<'MODEL', 10>,
          refiner_clip: ComfyNodeOutput<'CLIP', 11>,
          refiner_positive: ComfyNodeOutput<'CONDITIONING', 12>,
          refiner_negative: ComfyNodeOutput<'CONDITIONING', 13>,
      }
      interface FromDetailerPipeSDXL_input {
          detailer_pipe: Comfy.Input.DETAILER_PIPE
      }
      interface AnyPipeToBasic extends HasSingle_BASIC_PIPE, ComfyNode<AnyPipeToBasic_input, AnyPipeToBasic_output> {
          nameInComfy: "AnyPipeToBasic"
      }
      interface AnyPipeToBasic_output {
          basic_pipe: ComfyNodeOutput<'BASIC_PIPE', 0>,
      }
      interface AnyPipeToBasic_input {
          any_pipe: Comfy.Input.$Star
      }
      interface ToBasicPipe extends HasSingle_BASIC_PIPE, ComfyNode<ToBasicPipe_input, ToBasicPipe_output> {
          nameInComfy: "ToBasicPipe"
      }
      interface ToBasicPipe_output {
          basic_pipe: ComfyNodeOutput<'BASIC_PIPE', 0>,
      }
      interface ToBasicPipe_input {
          model: Comfy.Input.MODEL
          clip: Comfy.Input.CLIP
          vae: Comfy.Input.VAE
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
      }
      interface FromBasicPipe extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<FromBasicPipe_input, FromBasicPipe_output> {
          nameInComfy: "FromBasicPipe"
      }
      interface FromBasicPipe_output {
          model: ComfyNodeOutput<'MODEL', 0>,
          clip: ComfyNodeOutput<'CLIP', 1>,
          vae: ComfyNodeOutput<'VAE', 2>,
          positive: ComfyNodeOutput<'CONDITIONING', 3>,
          negative: ComfyNodeOutput<'CONDITIONING', 4>,
      }
      interface FromBasicPipe_input {
          basic_pipe: Comfy.Input.BASIC_PIPE
      }
      interface FromBasicPipe$_v2 extends HasSingle_BASIC_PIPE, HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<FromBasicPipe$_v2_input, FromBasicPipe$_v2_output> {
          nameInComfy: "FromBasicPipe_v2"
      }
      interface FromBasicPipe$_v2_output {
          basic_pipe: ComfyNodeOutput<'BASIC_PIPE', 0>,
          model: ComfyNodeOutput<'MODEL', 1>,
          clip: ComfyNodeOutput<'CLIP', 2>,
          vae: ComfyNodeOutput<'VAE', 3>,
          positive: ComfyNodeOutput<'CONDITIONING', 4>,
          negative: ComfyNodeOutput<'CONDITIONING', 5>,
      }
      interface FromBasicPipe$_v2_input {
          basic_pipe: Comfy.Input.BASIC_PIPE
      }
      interface BasicPipeToDetailerPipe extends HasSingle_DETAILER_PIPE, ComfyNode<BasicPipeToDetailerPipe_input, BasicPipeToDetailerPipe_output> {
          nameInComfy: "BasicPipeToDetailerPipe"
      }
      interface BasicPipeToDetailerPipe_output {
          detailer_pipe: ComfyNodeOutput<'DETAILER_PIPE', 0>,
      }
      interface BasicPipeToDetailerPipe_input {
          basic_pipe: Comfy.Input.BASIC_PIPE
          bbox_detector: Comfy.Input.BBOX_DETECTOR
          /** */
          wildcard: Comfy.Input.STRING
          "Select to add LoRA": Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df
          "Select to add Wildcard": Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26
          sam_model_opt?: Comfy.Input.SAM_MODEL
          segm_detector_opt?: Comfy.Input.SEGM_DETECTOR
          detailer_hook?: Comfy.Input.DETAILER_HOOK
      }
      interface BasicPipeToDetailerPipeSDXL extends HasSingle_DETAILER_PIPE, ComfyNode<BasicPipeToDetailerPipeSDXL_input, BasicPipeToDetailerPipeSDXL_output> {
          nameInComfy: "BasicPipeToDetailerPipeSDXL"
      }
      interface BasicPipeToDetailerPipeSDXL_output {
          detailer_pipe: ComfyNodeOutput<'DETAILER_PIPE', 0>,
      }
      interface BasicPipeToDetailerPipeSDXL_input {
          base_basic_pipe: Comfy.Input.BASIC_PIPE
          refiner_basic_pipe: Comfy.Input.BASIC_PIPE
          bbox_detector: Comfy.Input.BBOX_DETECTOR
          /** */
          wildcard: Comfy.Input.STRING
          "Select to add LoRA": Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df
          "Select to add Wildcard": Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26
          sam_model_opt?: Comfy.Input.SAM_MODEL
          segm_detector_opt?: Comfy.Input.SEGM_DETECTOR
          detailer_hook?: Comfy.Input.DETAILER_HOOK
      }
      interface DetailerPipeToBasicPipe extends ComfyNode<DetailerPipeToBasicPipe_input, DetailerPipeToBasicPipe_output> {
          nameInComfy: "DetailerPipeToBasicPipe"
      }
      interface DetailerPipeToBasicPipe_output {
          base_basic_pipe: ComfyNodeOutput<'BASIC_PIPE', 0>,
          refiner_basic_pipe: ComfyNodeOutput<'BASIC_PIPE', 1>,
      }
      interface DetailerPipeToBasicPipe_input {
          detailer_pipe: Comfy.Input.DETAILER_PIPE
      }
      interface EditBasicPipe extends HasSingle_BASIC_PIPE, ComfyNode<EditBasicPipe_input, EditBasicPipe_output> {
          nameInComfy: "EditBasicPipe"
      }
      interface EditBasicPipe_output {
          basic_pipe: ComfyNodeOutput<'BASIC_PIPE', 0>,
      }
      interface EditBasicPipe_input {
          basic_pipe: Comfy.Input.BASIC_PIPE
          model?: Comfy.Input.MODEL
          clip?: Comfy.Input.CLIP
          vae?: Comfy.Input.VAE
          positive?: Comfy.Input.CONDITIONING
          negative?: Comfy.Input.CONDITIONING
      }
      interface EditDetailerPipe extends HasSingle_DETAILER_PIPE, ComfyNode<EditDetailerPipe_input, EditDetailerPipe_output> {
          nameInComfy: "EditDetailerPipe"
      }
      interface EditDetailerPipe_output {
          detailer_pipe: ComfyNodeOutput<'DETAILER_PIPE', 0>,
      }
      interface EditDetailerPipe_input {
          detailer_pipe: Comfy.Input.DETAILER_PIPE
          /** */
          wildcard: Comfy.Input.STRING
          "Select to add LoRA": Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df
          "Select to add Wildcard": Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26
          model?: Comfy.Input.MODEL
          clip?: Comfy.Input.CLIP
          vae?: Comfy.Input.VAE
          positive?: Comfy.Input.CONDITIONING
          negative?: Comfy.Input.CONDITIONING
          bbox_detector?: Comfy.Input.BBOX_DETECTOR
          sam_model?: Comfy.Input.SAM_MODEL
          segm_detector?: Comfy.Input.SEGM_DETECTOR
          detailer_hook?: Comfy.Input.DETAILER_HOOK
      }
      interface EditDetailerPipeSDXL extends HasSingle_DETAILER_PIPE, ComfyNode<EditDetailerPipeSDXL_input, EditDetailerPipeSDXL_output> {
          nameInComfy: "EditDetailerPipeSDXL"
      }
      interface EditDetailerPipeSDXL_output {
          detailer_pipe: ComfyNodeOutput<'DETAILER_PIPE', 0>,
      }
      interface EditDetailerPipeSDXL_input {
          detailer_pipe: Comfy.Input.DETAILER_PIPE
          /** */
          wildcard: Comfy.Input.STRING
          "Select to add LoRA": Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df
          "Select to add Wildcard": Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26
          model?: Comfy.Input.MODEL
          clip?: Comfy.Input.CLIP
          vae?: Comfy.Input.VAE
          positive?: Comfy.Input.CONDITIONING
          negative?: Comfy.Input.CONDITIONING
          refiner_model?: Comfy.Input.MODEL
          refiner_clip?: Comfy.Input.CLIP
          refiner_positive?: Comfy.Input.CONDITIONING
          refiner_negative?: Comfy.Input.CONDITIONING
          bbox_detector?: Comfy.Input.BBOX_DETECTOR
          sam_model?: Comfy.Input.SAM_MODEL
          segm_detector?: Comfy.Input.SEGM_DETECTOR
          detailer_hook?: Comfy.Input.DETAILER_HOOK
      }
      interface LatentPixelScale extends HasSingle_LATENT, HasSingle_IMAGE, ComfyNode<LatentPixelScale_input, LatentPixelScale_output> {
          nameInComfy: "LatentPixelScale"
      }
      interface LatentPixelScale_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
          IMAGE: ComfyNodeOutput<'IMAGE', 1>,
      }
      interface LatentPixelScale_input {
          samples: Comfy.Input.LATENT
          scale_method: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d
          /** default=1.5 min=10000 max=10000 step=0.1 */
          scale_factor?: Comfy.Input.FLOAT
          vae: Comfy.Input.VAE
          /** default=false */
          use_tiled_vae?: Comfy.Input.BOOLEAN
          upscale_model_opt?: Comfy.Input.UPSCALE_MODEL
      }
      interface PixelKSampleUpscalerProvider extends HasSingle_UPSCALER, ComfyNode<PixelKSampleUpscalerProvider_input, PixelKSampleUpscalerProvider_output> {
          nameInComfy: "PixelKSampleUpscalerProvider"
      }
      interface PixelKSampleUpscalerProvider_output {
          UPSCALER: ComfyNodeOutput<'UPSCALER', 0>,
      }
      interface PixelKSampleUpscalerProvider_input {
          scale_method: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d
          model: Comfy.Input.MODEL
          vae: Comfy.Input.VAE
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=false */
          use_tiled_vae?: Comfy.Input.BOOLEAN
          /** default=512 min=4096 max=4096 step=64 */
          tile_size?: Comfy.Input.INT
          upscale_model_opt?: Comfy.Input.UPSCALE_MODEL
          pk_hook_opt?: Comfy.Input.PK_HOOK
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface PixelKSampleUpscalerProviderPipe extends HasSingle_UPSCALER, ComfyNode<PixelKSampleUpscalerProviderPipe_input, PixelKSampleUpscalerProviderPipe_output> {
          nameInComfy: "PixelKSampleUpscalerProviderPipe"
      }
      interface PixelKSampleUpscalerProviderPipe_output {
          UPSCALER: ComfyNodeOutput<'UPSCALER', 0>,
      }
      interface PixelKSampleUpscalerProviderPipe_input {
          scale_method: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=false */
          use_tiled_vae?: Comfy.Input.BOOLEAN
          basic_pipe: Comfy.Input.BASIC_PIPE
          /** default=512 min=4096 max=4096 step=64 */
          tile_size?: Comfy.Input.INT
          upscale_model_opt?: Comfy.Input.UPSCALE_MODEL
          pk_hook_opt?: Comfy.Input.PK_HOOK
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
          tile_cnet_opt?: Comfy.Input.CONTROL_NET
          /** default=1 min=1 max=1 step=0.01 */
          tile_cnet_strength?: Comfy.Input.FLOAT
      }
      interface IterativeLatentUpscale extends HasSingle_LATENT, HasSingle_VAE, ComfyNode<IterativeLatentUpscale_input, IterativeLatentUpscale_output> {
          nameInComfy: "IterativeLatentUpscale"
      }
      interface IterativeLatentUpscale_output {
          latent: ComfyNodeOutput<'LATENT', 0>,
          vae: ComfyNodeOutput<'VAE', 1>,
      }
      interface IterativeLatentUpscale_input {
          samples: Comfy.Input.LATENT
          /** default=1.5 min=10000 max=10000 step=0.1 */
          upscale_factor?: Comfy.Input.FLOAT
          /** default=3 min=10000 max=10000 step=1 */
          steps?: Comfy.Input.INT
          /** default="" */
          temp_prefix?: Comfy.Input.STRING
          upscaler: Comfy.Input.UPSCALER
          /** default="simple" */
          step_mode?: Comfy.Union.E_4724269c8f643d5efa98f97e1e55a7ddfe6aac6c
      }
      interface IterativeImageUpscale extends HasSingle_IMAGE, ComfyNode<IterativeImageUpscale_input, IterativeImageUpscale_output> {
          nameInComfy: "IterativeImageUpscale"
      }
      interface IterativeImageUpscale_output {
          image: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface IterativeImageUpscale_input {
          pixels: Comfy.Input.IMAGE
          /** default=1.5 min=10000 max=10000 step=0.1 */
          upscale_factor?: Comfy.Input.FLOAT
          /** default=3 min=10000 max=10000 step=1 */
          steps?: Comfy.Input.INT
          /** default="" */
          temp_prefix?: Comfy.Input.STRING
          upscaler: Comfy.Input.UPSCALER
          vae: Comfy.Input.VAE
          /** default="simple" */
          step_mode?: Comfy.Union.E_4724269c8f643d5efa98f97e1e55a7ddfe6aac6c
      }
      interface PixelTiledKSampleUpscalerProvider extends HasSingle_UPSCALER, ComfyNode<PixelTiledKSampleUpscalerProvider_input, PixelTiledKSampleUpscalerProvider_output> {
          nameInComfy: "PixelTiledKSampleUpscalerProvider"
      }
      interface PixelTiledKSampleUpscalerProvider_output {
          UPSCALER: ComfyNodeOutput<'UPSCALER', 0>,
      }
      interface PixelTiledKSampleUpscalerProvider_input {
          scale_method: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d
          model: Comfy.Input.MODEL
          vae: Comfy.Input.VAE
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=512 min=16384 max=16384 step=64 */
          tile_width?: Comfy.Input.INT
          /** default=512 min=16384 max=16384 step=64 */
          tile_height?: Comfy.Input.INT
          tiling_strategy: Comfy.Union.E_304f89a0de34643f12756237824e7261db28aaf5
          upscale_model_opt?: Comfy.Input.UPSCALE_MODEL
          pk_hook_opt?: Comfy.Input.PK_HOOK
          tile_cnet_opt?: Comfy.Input.CONTROL_NET
          /** default=1 min=1 max=1 step=0.01 */
          tile_cnet_strength?: Comfy.Input.FLOAT
      }
      interface PixelTiledKSampleUpscalerProviderPipe extends HasSingle_UPSCALER, ComfyNode<PixelTiledKSampleUpscalerProviderPipe_input, PixelTiledKSampleUpscalerProviderPipe_output> {
          nameInComfy: "PixelTiledKSampleUpscalerProviderPipe"
      }
      interface PixelTiledKSampleUpscalerProviderPipe_output {
          UPSCALER: ComfyNodeOutput<'UPSCALER', 0>,
      }
      interface PixelTiledKSampleUpscalerProviderPipe_input {
          scale_method: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=512 min=16384 max=16384 step=64 */
          tile_width?: Comfy.Input.INT
          /** default=512 min=16384 max=16384 step=64 */
          tile_height?: Comfy.Input.INT
          tiling_strategy: Comfy.Union.E_304f89a0de34643f12756237824e7261db28aaf5
          basic_pipe: Comfy.Input.BASIC_PIPE
          upscale_model_opt?: Comfy.Input.UPSCALE_MODEL
          pk_hook_opt?: Comfy.Input.PK_HOOK
          tile_cnet_opt?: Comfy.Input.CONTROL_NET
          /** default=1 min=1 max=1 step=0.01 */
          tile_cnet_strength?: Comfy.Input.FLOAT
      }
      interface TwoSamplersForMaskUpscalerProvider extends HasSingle_UPSCALER, ComfyNode<TwoSamplersForMaskUpscalerProvider_input, TwoSamplersForMaskUpscalerProvider_output> {
          nameInComfy: "TwoSamplersForMaskUpscalerProvider"
      }
      interface TwoSamplersForMaskUpscalerProvider_output {
          UPSCALER: ComfyNodeOutput<'UPSCALER', 0>,
      }
      interface TwoSamplersForMaskUpscalerProvider_input {
          scale_method: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d
          full_sample_schedule: Comfy.Union.E_de6a9887e0bfe301f572e929959509ed64574d1b
          /** default=false */
          use_tiled_vae?: Comfy.Input.BOOLEAN
          base_sampler: Comfy.Input.KSAMPLER
          mask_sampler: Comfy.Input.KSAMPLER
          mask: Comfy.Input.MASK
          vae: Comfy.Input.VAE
          /** default=512 min=4096 max=4096 step=64 */
          tile_size?: Comfy.Input.INT
          full_sampler_opt?: Comfy.Input.KSAMPLER
          upscale_model_opt?: Comfy.Input.UPSCALE_MODEL
          pk_hook_base_opt?: Comfy.Input.PK_HOOK
          pk_hook_mask_opt?: Comfy.Input.PK_HOOK
          pk_hook_full_opt?: Comfy.Input.PK_HOOK
      }
      interface TwoSamplersForMaskUpscalerProviderPipe extends HasSingle_UPSCALER, ComfyNode<TwoSamplersForMaskUpscalerProviderPipe_input, TwoSamplersForMaskUpscalerProviderPipe_output> {
          nameInComfy: "TwoSamplersForMaskUpscalerProviderPipe"
      }
      interface TwoSamplersForMaskUpscalerProviderPipe_output {
          UPSCALER: ComfyNodeOutput<'UPSCALER', 0>,
      }
      interface TwoSamplersForMaskUpscalerProviderPipe_input {
          scale_method: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d
          full_sample_schedule: Comfy.Union.E_de6a9887e0bfe301f572e929959509ed64574d1b
          /** default=false */
          use_tiled_vae?: Comfy.Input.BOOLEAN
          base_sampler: Comfy.Input.KSAMPLER
          mask_sampler: Comfy.Input.KSAMPLER
          mask: Comfy.Input.MASK
          basic_pipe: Comfy.Input.BASIC_PIPE
          /** default=512 min=4096 max=4096 step=64 */
          tile_size?: Comfy.Input.INT
          full_sampler_opt?: Comfy.Input.KSAMPLER
          upscale_model_opt?: Comfy.Input.UPSCALE_MODEL
          pk_hook_base_opt?: Comfy.Input.PK_HOOK
          pk_hook_mask_opt?: Comfy.Input.PK_HOOK
          pk_hook_full_opt?: Comfy.Input.PK_HOOK
      }
      interface PixelKSampleHookCombine extends HasSingle_PK_HOOK, ComfyNode<PixelKSampleHookCombine_input, PixelKSampleHookCombine_output> {
          nameInComfy: "PixelKSampleHookCombine"
      }
      interface PixelKSampleHookCombine_output {
          PK_HOOK: ComfyNodeOutput<'PK_HOOK', 0>,
      }
      interface PixelKSampleHookCombine_input {
          hook1: Comfy.Input.PK_HOOK
          hook2: Comfy.Input.PK_HOOK
      }
      interface DenoiseScheduleHookProvider extends HasSingle_PK_HOOK, ComfyNode<DenoiseScheduleHookProvider_input, DenoiseScheduleHookProvider_output> {
          nameInComfy: "DenoiseScheduleHookProvider"
      }
      interface DenoiseScheduleHookProvider_output {
          PK_HOOK: ComfyNodeOutput<'PK_HOOK', 0>,
      }
      interface DenoiseScheduleHookProvider_input {
          schedule_for_iteration: Comfy.Union.E_0f7d0d088b6ea936fb25b477722d734706fe8b40
          /** default=0.2 min=1 max=1 step=0.01 */
          target_denoise?: Comfy.Input.FLOAT
      }
      interface StepsScheduleHookProvider extends HasSingle_PK_HOOK, ComfyNode<StepsScheduleHookProvider_input, StepsScheduleHookProvider_output> {
          nameInComfy: "StepsScheduleHookProvider"
      }
      interface StepsScheduleHookProvider_output {
          PK_HOOK: ComfyNodeOutput<'PK_HOOK', 0>,
      }
      interface StepsScheduleHookProvider_input {
          schedule_for_iteration: Comfy.Union.E_0f7d0d088b6ea936fb25b477722d734706fe8b40
          /** default=20 min=10000 max=10000 */
          target_steps?: Comfy.Input.INT
      }
      interface CfgScheduleHookProvider extends HasSingle_PK_HOOK, ComfyNode<CfgScheduleHookProvider_input, CfgScheduleHookProvider_output> {
          nameInComfy: "CfgScheduleHookProvider"
      }
      interface CfgScheduleHookProvider_output {
          PK_HOOK: ComfyNodeOutput<'PK_HOOK', 0>,
      }
      interface CfgScheduleHookProvider_input {
          schedule_for_iteration: Comfy.Union.E_0f7d0d088b6ea936fb25b477722d734706fe8b40
          /** default=3 min=100 max=100 */
          target_cfg?: Comfy.Input.FLOAT
      }
      interface NoiseInjectionHookProvider extends HasSingle_PK_HOOK, ComfyNode<NoiseInjectionHookProvider_input, NoiseInjectionHookProvider_output> {
          nameInComfy: "NoiseInjectionHookProvider"
      }
      interface NoiseInjectionHookProvider_output {
          PK_HOOK: ComfyNodeOutput<'PK_HOOK', 0>,
      }
      interface NoiseInjectionHookProvider_input {
          schedule_for_iteration: Comfy.Union.E_0f7d0d088b6ea936fb25b477722d734706fe8b40
          source: Comfy.Union.E_3dfc15432d4b952e91053feecd5a5427720957fc
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=1 min=200 max=200 step=0.01 */
          start_strength?: Comfy.Input.FLOAT
          /** default=1 min=200 max=200 step=0.01 */
          end_strength?: Comfy.Input.FLOAT
      }
      interface UnsamplerHookProvider extends HasSingle_PK_HOOK, ComfyNode<UnsamplerHookProvider_input, UnsamplerHookProvider_output> {
          nameInComfy: "UnsamplerHookProvider"
      }
      interface UnsamplerHookProvider_output {
          PK_HOOK: ComfyNodeOutput<'PK_HOOK', 0>,
      }
      interface UnsamplerHookProvider_input {
          model: Comfy.Input.MODEL
          /** default=25 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=21 min=10000 max=10000 */
          start_end_at_step?: Comfy.Input.INT
          /** default=24 min=10000 max=10000 */
          end_end_at_step?: Comfy.Input.INT
          /** default=1 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325
          normalize: Comfy.Union.E_449b4cae3566dd9b97c417c352bb08e25b89431b
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          schedule_for_iteration: Comfy.Union.E_0f7d0d088b6ea936fb25b477722d734706fe8b40
      }
      interface CoreMLDetailerHookProvider extends HasSingle_DETAILER_HOOK, ComfyNode<CoreMLDetailerHookProvider_input, CoreMLDetailerHookProvider_output> {
          nameInComfy: "CoreMLDetailerHookProvider"
      }
      interface CoreMLDetailerHookProvider_output {
          DETAILER_HOOK: ComfyNodeOutput<'DETAILER_HOOK', 0>,
      }
      interface CoreMLDetailerHookProvider_input {
          mode: Comfy.Union.E_d4b6506ab5528aeab8952aa9d308dbc242d01e63
      }
      interface PreviewDetailerHookProvider extends HasSingle_DETAILER_HOOK, HasSingle_UPSCALER_HOOK, ComfyNode<PreviewDetailerHookProvider_input, PreviewDetailerHookProvider_output> {
          nameInComfy: "PreviewDetailerHookProvider"
      }
      interface PreviewDetailerHookProvider_output {
          DETAILER_HOOK: ComfyNodeOutput<'DETAILER_HOOK', 0>,
          UPSCALER_HOOK: ComfyNodeOutput<'UPSCALER_HOOK', 1>,
      }
      interface PreviewDetailerHookProvider_input {
          /** default=95 min=100 max=100 */
          quality?: Comfy.Input.INT
      }
      interface DetailerHookCombine extends HasSingle_DETAILER_HOOK, ComfyNode<DetailerHookCombine_input, DetailerHookCombine_output> {
          nameInComfy: "DetailerHookCombine"
      }
      interface DetailerHookCombine_output {
          DETAILER_HOOK: ComfyNodeOutput<'DETAILER_HOOK', 0>,
      }
      interface DetailerHookCombine_input {
          hook1: Comfy.Input.DETAILER_HOOK
          hook2: Comfy.Input.DETAILER_HOOK
      }
      interface NoiseInjectionDetailerHookProvider extends HasSingle_DETAILER_HOOK, ComfyNode<NoiseInjectionDetailerHookProvider_input, NoiseInjectionDetailerHookProvider_output> {
          nameInComfy: "NoiseInjectionDetailerHookProvider"
      }
      interface NoiseInjectionDetailerHookProvider_output {
          DETAILER_HOOK: ComfyNodeOutput<'DETAILER_HOOK', 0>,
      }
      interface NoiseInjectionDetailerHookProvider_input {
          schedule_for_cycle: Comfy.Union.E_afbc7832ad78555d4f5646f97ed21b561fe3d1f0
          source: Comfy.Union.E_3dfc15432d4b952e91053feecd5a5427720957fc
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=2 min=200 max=200 step=0.01 */
          start_strength?: Comfy.Input.FLOAT
          /** default=1 min=200 max=200 step=0.01 */
          end_strength?: Comfy.Input.FLOAT
      }
      interface UnsamplerDetailerHookProvider extends HasSingle_DETAILER_HOOK, ComfyNode<UnsamplerDetailerHookProvider_input, UnsamplerDetailerHookProvider_output> {
          nameInComfy: "UnsamplerDetailerHookProvider"
      }
      interface UnsamplerDetailerHookProvider_output {
          DETAILER_HOOK: ComfyNodeOutput<'DETAILER_HOOK', 0>,
      }
      interface UnsamplerDetailerHookProvider_input {
          model: Comfy.Input.MODEL
          /** default=25 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=21 min=10000 max=10000 */
          start_end_at_step?: Comfy.Input.INT
          /** default=24 min=10000 max=10000 */
          end_end_at_step?: Comfy.Input.INT
          /** default=1 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325
          normalize: Comfy.Union.E_449b4cae3566dd9b97c417c352bb08e25b89431b
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          schedule_for_cycle: Comfy.Union.E_afbc7832ad78555d4f5646f97ed21b561fe3d1f0
      }
      interface DenoiseSchedulerDetailerHookProvider extends HasSingle_DETAILER_HOOK, ComfyNode<DenoiseSchedulerDetailerHookProvider_input, DenoiseSchedulerDetailerHookProvider_output> {
          nameInComfy: "DenoiseSchedulerDetailerHookProvider"
      }
      interface DenoiseSchedulerDetailerHookProvider_output {
          DETAILER_HOOK: ComfyNodeOutput<'DETAILER_HOOK', 0>,
      }
      interface DenoiseSchedulerDetailerHookProvider_input {
          schedule_for_cycle: Comfy.Union.E_0f7d0d088b6ea936fb25b477722d734706fe8b40
          /** default=0.3 min=1 max=1 step=0.01 */
          target_denoise?: Comfy.Input.FLOAT
      }
      interface SEGSOrderedFilterDetailerHookProvider extends HasSingle_DETAILER_HOOK, ComfyNode<SEGSOrderedFilterDetailerHookProvider_input, SEGSOrderedFilterDetailerHookProvider_output> {
          nameInComfy: "SEGSOrderedFilterDetailerHookProvider"
      }
      interface SEGSOrderedFilterDetailerHookProvider_output {
          DETAILER_HOOK: ComfyNodeOutput<'DETAILER_HOOK', 0>,
      }
      interface SEGSOrderedFilterDetailerHookProvider_input {
          target: Comfy.Union.E_87bec9aa0dfe9b9678fd35387106d931d78358cd
          /** default=true */
          order?: Comfy.Input.BOOLEAN
          /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
          take_start?: Comfy.Input.INT
          /** default=1 min=9223372036854776000 max=9223372036854776000 step=1 */
          take_count?: Comfy.Input.INT
      }
      interface SEGSRangeFilterDetailerHookProvider extends HasSingle_DETAILER_HOOK, ComfyNode<SEGSRangeFilterDetailerHookProvider_input, SEGSRangeFilterDetailerHookProvider_output> {
          nameInComfy: "SEGSRangeFilterDetailerHookProvider"
      }
      interface SEGSRangeFilterDetailerHookProvider_output {
          DETAILER_HOOK: ComfyNodeOutput<'DETAILER_HOOK', 0>,
      }
      interface SEGSRangeFilterDetailerHookProvider_input {
          target: Comfy.Union.E_aceb55e7f03fcbc2a78383bd8ddff8676e42e536
          /** default=true */
          mode?: Comfy.Input.BOOLEAN
          /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
          min_value?: Comfy.Input.INT
          /** default=67108864 min=9223372036854776000 max=9223372036854776000 step=1 */
          max_value?: Comfy.Input.INT
      }
      interface SEGSLabelFilterDetailerHookProvider extends HasSingle_DETAILER_HOOK, ComfyNode<SEGSLabelFilterDetailerHookProvider_input, SEGSLabelFilterDetailerHookProvider_output> {
          nameInComfy: "SEGSLabelFilterDetailerHookProvider"
      }
      interface SEGSLabelFilterDetailerHookProvider_output {
          DETAILER_HOOK: ComfyNodeOutput<'DETAILER_HOOK', 0>,
      }
      interface SEGSLabelFilterDetailerHookProvider_input {
          segs: Comfy.Input.SEGS
          preset: Comfy.Union.E_cc1f262afc534d382e5c36082cecd4fc2a9c4ffb
          /** */
          labels: Comfy.Input.STRING
      }
      interface VariationNoiseDetailerHookProvider extends HasSingle_DETAILER_HOOK, ComfyNode<VariationNoiseDetailerHookProvider_input, VariationNoiseDetailerHookProvider_output> {
          nameInComfy: "VariationNoiseDetailerHookProvider"
      }
      interface VariationNoiseDetailerHookProvider_output {
          DETAILER_HOOK: ComfyNodeOutput<'DETAILER_HOOK', 0>,
      }
      interface VariationNoiseDetailerHookProvider_input {
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=0 min=1 max=1 step=0.01 */
          strength?: Comfy.Input.FLOAT
      }
      interface BitwiseAndMask extends HasSingle_MASK, ComfyNode<BitwiseAndMask_input, BitwiseAndMask_output> {
          nameInComfy: "BitwiseAndMask"
      }
      interface BitwiseAndMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface BitwiseAndMask_input {
          mask1: Comfy.Input.MASK
          mask2: Comfy.Input.MASK
      }
      interface SubtractMask extends HasSingle_MASK, ComfyNode<SubtractMask_input, SubtractMask_output> {
          nameInComfy: "SubtractMask"
      }
      interface SubtractMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface SubtractMask_input {
          mask1: Comfy.Input.MASK
          mask2: Comfy.Input.MASK
      }
      interface AddMask extends HasSingle_MASK, ComfyNode<AddMask_input, AddMask_output> {
          nameInComfy: "AddMask"
      }
      interface AddMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface AddMask_input {
          mask1: Comfy.Input.MASK
          mask2: Comfy.Input.MASK
      }
      interface ImpactSegsAndMask extends HasSingle_SEGS, ComfyNode<ImpactSegsAndMask_input, ImpactSegsAndMask_output> {
          nameInComfy: "ImpactSegsAndMask"
      }
      interface ImpactSegsAndMask_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactSegsAndMask_input {
          segs: Comfy.Input.SEGS
          mask: Comfy.Input.MASK
      }
      interface ImpactSegsAndMaskForEach extends HasSingle_SEGS, ComfyNode<ImpactSegsAndMaskForEach_input, ImpactSegsAndMaskForEach_output> {
          nameInComfy: "ImpactSegsAndMaskForEach"
      }
      interface ImpactSegsAndMaskForEach_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactSegsAndMaskForEach_input {
          segs: Comfy.Input.SEGS
          masks: Comfy.Input.MASK
      }
      interface EmptySegs extends HasSingle_SEGS, ComfyNode<EmptySegs_input, EmptySegs_output> {
          nameInComfy: "EmptySegs"
      }
      interface EmptySegs_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface EmptySegs_input {
      }
      interface ImpactFlattenMask extends HasSingle_MASK, ComfyNode<ImpactFlattenMask_input, ImpactFlattenMask_output> {
          nameInComfy: "ImpactFlattenMask"
      }
      interface ImpactFlattenMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface ImpactFlattenMask_input {
          masks: Comfy.Input.MASK
      }
      interface MediaPipeFaceMeshToSEGS extends HasSingle_SEGS, ComfyNode<MediaPipeFaceMeshToSEGS_input, MediaPipeFaceMeshToSEGS_output> {
          nameInComfy: "MediaPipeFaceMeshToSEGS"
      }
      interface MediaPipeFaceMeshToSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface MediaPipeFaceMeshToSEGS_input {
          image: Comfy.Input.IMAGE
          /** default=3 min=100 max=100 step=0.1 */
          crop_factor?: Comfy.Input.FLOAT
          /** default=false */
          bbox_fill?: Comfy.Input.BOOLEAN
          /** default=50 min=16384 max=16384 step=1 */
          crop_min_size?: Comfy.Input.INT
          /** default=1 min=16384 max=16384 step=1 */
          drop_size?: Comfy.Input.INT
          /** default=0 min=512 max=512 step=1 */
          dilation?: Comfy.Input.INT
          /** default=true */
          face?: Comfy.Input.BOOLEAN
          /** default=false */
          mouth?: Comfy.Input.BOOLEAN
          /** default=false */
          left_eyebrow?: Comfy.Input.BOOLEAN
          /** default=false */
          left_eye?: Comfy.Input.BOOLEAN
          /** default=false */
          left_pupil?: Comfy.Input.BOOLEAN
          /** default=false */
          right_eyebrow?: Comfy.Input.BOOLEAN
          /** default=false */
          right_eye?: Comfy.Input.BOOLEAN
          /** default=false */
          right_pupil?: Comfy.Input.BOOLEAN
      }
      interface MaskToSEGS extends HasSingle_SEGS, ComfyNode<MaskToSEGS_input, MaskToSEGS_output> {
          nameInComfy: "MaskToSEGS"
      }
      interface MaskToSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface MaskToSEGS_input {
          mask: Comfy.Input.MASK
          /** default=false */
          combined?: Comfy.Input.BOOLEAN
          /** default=3 min=100 max=100 step=0.1 */
          crop_factor?: Comfy.Input.FLOAT
          /** default=false */
          bbox_fill?: Comfy.Input.BOOLEAN
          /** default=10 min=16384 max=16384 step=1 */
          drop_size?: Comfy.Input.INT
          /** default=false */
          contour_fill?: Comfy.Input.BOOLEAN
      }
      interface MaskToSEGS$_for$_AnimateDiff extends HasSingle_SEGS, ComfyNode<MaskToSEGS$_for$_AnimateDiff_input, MaskToSEGS$_for$_AnimateDiff_output> {
          nameInComfy: "MaskToSEGS_for_AnimateDiff"
      }
      interface MaskToSEGS$_for$_AnimateDiff_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface MaskToSEGS$_for$_AnimateDiff_input {
          mask: Comfy.Input.MASK
          /** default=false */
          combined?: Comfy.Input.BOOLEAN
          /** default=3 min=100 max=100 step=0.1 */
          crop_factor?: Comfy.Input.FLOAT
          /** default=false */
          bbox_fill?: Comfy.Input.BOOLEAN
          /** default=10 min=16384 max=16384 step=1 */
          drop_size?: Comfy.Input.INT
          /** default=false */
          contour_fill?: Comfy.Input.BOOLEAN
      }
      interface ToBinaryMask extends HasSingle_MASK, ComfyNode<ToBinaryMask_input, ToBinaryMask_output> {
          nameInComfy: "ToBinaryMask"
      }
      interface ToBinaryMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface ToBinaryMask_input {
          mask: Comfy.Input.MASK
          /** default=20 min=255 max=255 */
          threshold?: Comfy.Input.INT
      }
      interface MasksToMaskList extends HasSingle_MASK, ComfyNode<MasksToMaskList_input, MasksToMaskList_output> {
          nameInComfy: "MasksToMaskList"
      }
      interface MasksToMaskList_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface MasksToMaskList_input {
          masks: Comfy.Input.MASK
      }
      interface MaskListToMaskBatch extends HasSingle_MASK, ComfyNode<MaskListToMaskBatch_input, MaskListToMaskBatch_output> {
          nameInComfy: "MaskListToMaskBatch"
      }
      interface MaskListToMaskBatch_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface MaskListToMaskBatch_input {
          mask: Comfy.Input.MASK
      }
      interface ImageListToImageBatch extends HasSingle_IMAGE, ComfyNode<ImageListToImageBatch_input, ImageListToImageBatch_output> {
          nameInComfy: "ImageListToImageBatch"
      }
      interface ImageListToImageBatch_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImageListToImageBatch_input {
          images: Comfy.Input.IMAGE
      }
      interface SetDefaultImageForSEGS extends HasSingle_SEGS, ComfyNode<SetDefaultImageForSEGS_input, SetDefaultImageForSEGS_output> {
          nameInComfy: "SetDefaultImageForSEGS"
      }
      interface SetDefaultImageForSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface SetDefaultImageForSEGS_input {
          segs: Comfy.Input.SEGS
          image: Comfy.Input.IMAGE
          /** default=true */
          override?: Comfy.Input.BOOLEAN
      }
      interface RemoveImageFromSEGS extends HasSingle_SEGS, ComfyNode<RemoveImageFromSEGS_input, RemoveImageFromSEGS_output> {
          nameInComfy: "RemoveImageFromSEGS"
      }
      interface RemoveImageFromSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface RemoveImageFromSEGS_input {
          segs: Comfy.Input.SEGS
      }
      interface BboxDetectorSEGS extends HasSingle_SEGS, ComfyNode<BboxDetectorSEGS_input, BboxDetectorSEGS_output> {
          nameInComfy: "BboxDetectorSEGS"
      }
      interface BboxDetectorSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface BboxDetectorSEGS_input {
          bbox_detector: Comfy.Input.BBOX_DETECTOR
          image: Comfy.Input.IMAGE
          /** default=0.5 min=1 max=1 step=0.01 */
          threshold?: Comfy.Input.FLOAT
          /** default=10 min=512 max=512 step=1 */
          dilation?: Comfy.Input.INT
          /** default=3 min=100 max=100 step=0.1 */
          crop_factor?: Comfy.Input.FLOAT
          /** default=10 min=16384 max=16384 step=1 */
          drop_size?: Comfy.Input.INT
          /** default="all" */
          labels?: Comfy.Input.STRING
          detailer_hook?: Comfy.Input.DETAILER_HOOK
      }
      interface SegmDetectorSEGS extends HasSingle_SEGS, ComfyNode<SegmDetectorSEGS_input, SegmDetectorSEGS_output> {
          nameInComfy: "SegmDetectorSEGS"
      }
      interface SegmDetectorSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface SegmDetectorSEGS_input {
          segm_detector: Comfy.Input.SEGM_DETECTOR
          image: Comfy.Input.IMAGE
          /** default=0.5 min=1 max=1 step=0.01 */
          threshold?: Comfy.Input.FLOAT
          /** default=10 min=512 max=512 step=1 */
          dilation?: Comfy.Input.INT
          /** default=3 min=100 max=100 step=0.1 */
          crop_factor?: Comfy.Input.FLOAT
          /** default=10 min=16384 max=16384 step=1 */
          drop_size?: Comfy.Input.INT
          /** default="all" */
          labels?: Comfy.Input.STRING
          detailer_hook?: Comfy.Input.DETAILER_HOOK
      }
      interface ONNXDetectorSEGS extends HasSingle_SEGS, ComfyNode<ONNXDetectorSEGS_input, ONNXDetectorSEGS_output> {
          nameInComfy: "ONNXDetectorSEGS"
      }
      interface ONNXDetectorSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ONNXDetectorSEGS_input {
          bbox_detector: Comfy.Input.BBOX_DETECTOR
          image: Comfy.Input.IMAGE
          /** default=0.5 min=1 max=1 step=0.01 */
          threshold?: Comfy.Input.FLOAT
          /** default=10 min=512 max=512 step=1 */
          dilation?: Comfy.Input.INT
          /** default=3 min=100 max=100 step=0.1 */
          crop_factor?: Comfy.Input.FLOAT
          /** default=10 min=16384 max=16384 step=1 */
          drop_size?: Comfy.Input.INT
          /** default="all" */
          labels?: Comfy.Input.STRING
          detailer_hook?: Comfy.Input.DETAILER_HOOK
      }
      interface ImpactSimpleDetectorSEGS$_for$_AD extends HasSingle_SEGS, ComfyNode<ImpactSimpleDetectorSEGS$_for$_AD_input, ImpactSimpleDetectorSEGS$_for$_AD_output> {
          nameInComfy: "ImpactSimpleDetectorSEGS_for_AD"
      }
      interface ImpactSimpleDetectorSEGS$_for$_AD_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactSimpleDetectorSEGS$_for$_AD_input {
          bbox_detector: Comfy.Input.BBOX_DETECTOR
          image_frames: Comfy.Input.IMAGE
          /** default=0.5 min=1 max=1 step=0.01 */
          bbox_threshold?: Comfy.Input.FLOAT
          /** default=0 min=255 max=255 step=1 */
          bbox_dilation?: Comfy.Input.INT
          /** default=3 min=100 max=100 step=0.1 */
          crop_factor?: Comfy.Input.FLOAT
          /** default=10 min=16384 max=16384 step=1 */
          drop_size?: Comfy.Input.INT
          /** default=0.5 min=1 max=1 step=0.01 */
          sub_threshold?: Comfy.Input.FLOAT
          /** default=0 min=255 max=255 step=1 */
          sub_dilation?: Comfy.Input.INT
          /** default=0 min=1000 max=1000 step=1 */
          sub_bbox_expansion?: Comfy.Input.INT
          /** default=0.7 min=1 max=1 step=0.01 */
          sam_mask_hint_threshold?: Comfy.Input.FLOAT
          masking_mode?: Comfy.Union.E_e5ef6b688dbafd88538e80bf002826bade4bb121
          segs_pivot?: Comfy.Union.E_651ea09f69db9a1eb817103d1ea8e3ac08b4a319
          /** */
          sam_model_opt?: Comfy.Input.SAM_MODEL
          segm_detector_opt?: Comfy.Input.SEGM_DETECTOR
      }
      interface ImpactSimpleDetectorSEGS extends HasSingle_SEGS, ComfyNode<ImpactSimpleDetectorSEGS_input, ImpactSimpleDetectorSEGS_output> {
          nameInComfy: "ImpactSimpleDetectorSEGS"
      }
      interface ImpactSimpleDetectorSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactSimpleDetectorSEGS_input {
          bbox_detector: Comfy.Input.BBOX_DETECTOR
          image: Comfy.Input.IMAGE
          /** default=0.5 min=1 max=1 step=0.01 */
          bbox_threshold?: Comfy.Input.FLOAT
          /** default=0 min=512 max=512 step=1 */
          bbox_dilation?: Comfy.Input.INT
          /** default=3 min=100 max=100 step=0.1 */
          crop_factor?: Comfy.Input.FLOAT
          /** default=10 min=16384 max=16384 step=1 */
          drop_size?: Comfy.Input.INT
          /** default=0.5 min=1 max=1 step=0.01 */
          sub_threshold?: Comfy.Input.FLOAT
          /** default=0 min=512 max=512 step=1 */
          sub_dilation?: Comfy.Input.INT
          /** default=0 min=1000 max=1000 step=1 */
          sub_bbox_expansion?: Comfy.Input.INT
          /** default=0.7 min=1 max=1 step=0.01 */
          sam_mask_hint_threshold?: Comfy.Input.FLOAT
          /** default=0 min=512 max=512 step=1 */
          post_dilation?: Comfy.Input.INT
          /** */
          sam_model_opt?: Comfy.Input.SAM_MODEL
          segm_detector_opt?: Comfy.Input.SEGM_DETECTOR
      }
      interface ImpactSimpleDetectorSEGSPipe extends HasSingle_SEGS, ComfyNode<ImpactSimpleDetectorSEGSPipe_input, ImpactSimpleDetectorSEGSPipe_output> {
          nameInComfy: "ImpactSimpleDetectorSEGSPipe"
      }
      interface ImpactSimpleDetectorSEGSPipe_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactSimpleDetectorSEGSPipe_input {
          detailer_pipe: Comfy.Input.DETAILER_PIPE
          image: Comfy.Input.IMAGE
          /** default=0.5 min=1 max=1 step=0.01 */
          bbox_threshold?: Comfy.Input.FLOAT
          /** default=0 min=512 max=512 step=1 */
          bbox_dilation?: Comfy.Input.INT
          /** default=3 min=100 max=100 step=0.1 */
          crop_factor?: Comfy.Input.FLOAT
          /** default=10 min=16384 max=16384 step=1 */
          drop_size?: Comfy.Input.INT
          /** default=0.5 min=1 max=1 step=0.01 */
          sub_threshold?: Comfy.Input.FLOAT
          /** default=0 min=512 max=512 step=1 */
          sub_dilation?: Comfy.Input.INT
          /** default=0 min=1000 max=1000 step=1 */
          sub_bbox_expansion?: Comfy.Input.INT
          /** default=0.7 min=1 max=1 step=0.01 */
          sam_mask_hint_threshold?: Comfy.Input.FLOAT
          /** default=0 min=512 max=512 step=1 */
          post_dilation?: Comfy.Input.INT
      }
      interface ImpactControlNetApplySEGS extends HasSingle_SEGS, ComfyNode<ImpactControlNetApplySEGS_input, ImpactControlNetApplySEGS_output> {
          nameInComfy: "ImpactControlNetApplySEGS"
      }
      interface ImpactControlNetApplySEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactControlNetApplySEGS_input {
          segs: Comfy.Input.SEGS
          control_net: Comfy.Input.CONTROL_NET
          /** default=1 min=10 max=10 step=0.01 */
          strength?: Comfy.Input.FLOAT
          segs_preprocessor?: Comfy.Input.SEGS_PREPROCESSOR
          control_image?: Comfy.Input.IMAGE
      }
      interface ImpactControlNetApplyAdvancedSEGS extends HasSingle_SEGS, ComfyNode<ImpactControlNetApplyAdvancedSEGS_input, ImpactControlNetApplyAdvancedSEGS_output> {
          nameInComfy: "ImpactControlNetApplyAdvancedSEGS"
      }
      interface ImpactControlNetApplyAdvancedSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactControlNetApplyAdvancedSEGS_input {
          segs: Comfy.Input.SEGS
          control_net: Comfy.Input.CONTROL_NET
          /** default=1 min=10 max=10 step=0.01 */
          strength?: Comfy.Input.FLOAT
          /** default=0 min=1 max=1 step=0.001 */
          start_percent?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.001 */
          end_percent?: Comfy.Input.FLOAT
          segs_preprocessor?: Comfy.Input.SEGS_PREPROCESSOR
          control_image?: Comfy.Input.IMAGE
          vae?: Comfy.Input.VAE
      }
      interface ImpactControlNetClearSEGS extends HasSingle_SEGS, ComfyNode<ImpactControlNetClearSEGS_input, ImpactControlNetClearSEGS_output> {
          nameInComfy: "ImpactControlNetClearSEGS"
      }
      interface ImpactControlNetClearSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactControlNetClearSEGS_input {
          segs: Comfy.Input.SEGS
      }
      interface ImpactIPAdapterApplySEGS extends HasSingle_SEGS, ComfyNode<ImpactIPAdapterApplySEGS_input, ImpactIPAdapterApplySEGS_output> {
          nameInComfy: "ImpactIPAdapterApplySEGS"
      }
      interface ImpactIPAdapterApplySEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactIPAdapterApplySEGS_input {
          segs: Comfy.Input.SEGS
          ipadapter_pipe: Comfy.Input.IPADAPTER_PIPE
          /** default=0.7 min=3 max=3 step=0.05 */
          weight?: Comfy.Input.FLOAT
          /** default=0.4 min=1 max=1 step=0.01 */
          noise?: Comfy.Input.FLOAT
          /** default="channel penalty" */
          weight_type?: Comfy.Union.E_05cddbad13b094c2641c6bb7d261e15c71efc903
          /** default=0 min=1 max=1 step=0.001 */
          start_at?: Comfy.Input.FLOAT
          /** default=0.9 min=1 max=1 step=0.001 */
          end_at?: Comfy.Input.FLOAT
          /** default=false */
          unfold_batch?: Comfy.Input.BOOLEAN
          /** default=false */
          faceid_v2?: Comfy.Input.BOOLEAN
          /** default=1 min=3 max=3 step=0.05 */
          weight_v2?: Comfy.Input.FLOAT
          /** default=1.2 min=100 max=100 step=0.1 */
          context_crop_factor?: Comfy.Input.FLOAT
          reference_image: Comfy.Input.IMAGE
          combine_embeds?: Comfy.Union.E_055d80a7c582bd5b57fd6775414e697be3f0f580
          neg_image?: Comfy.Input.IMAGE
      }
      interface ImpactDecomposeSEGS extends HasSingle_SEGS_HEADER, HasSingle_SEG_ELT, ComfyNode<ImpactDecomposeSEGS_input, ImpactDecomposeSEGS_output> {
          nameInComfy: "ImpactDecomposeSEGS"
      }
      interface ImpactDecomposeSEGS_output {
          SEGS_HEADER: ComfyNodeOutput<'SEGS_HEADER', 0>,
          SEG_ELT: ComfyNodeOutput<'SEG_ELT', 1>,
      }
      interface ImpactDecomposeSEGS_input {
          segs: Comfy.Input.SEGS
      }
      interface ImpactAssembleSEGS extends HasSingle_SEGS, ComfyNode<ImpactAssembleSEGS_input, ImpactAssembleSEGS_output> {
          nameInComfy: "ImpactAssembleSEGS"
      }
      interface ImpactAssembleSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactAssembleSEGS_input {
          seg_header: Comfy.Input.SEGS_HEADER
          seg_elt: Comfy.Input.SEG_ELT
      }
      interface ImpactFrom$_SEG$_ELT extends HasSingle_SEG_ELT, HasSingle_IMAGE, HasSingle_MASK, HasSingle_SEG_ELT_crop_region, HasSingle_SEG_ELT_bbox, HasSingle_SEG_ELT_control_net_wrapper, HasSingle_FLOAT, HasSingle_STRING, ComfyNode<ImpactFrom$_SEG$_ELT_input, ImpactFrom$_SEG$_ELT_output> {
          nameInComfy: "ImpactFrom_SEG_ELT"
      }
      interface ImpactFrom$_SEG$_ELT_output {
          seg_elt: ComfyNodeOutput<'SEG_ELT', 0>,
          cropped_image: ComfyNodeOutput<'IMAGE', 1>,
          cropped_mask: ComfyNodeOutput<'MASK', 2>,
          crop_region: ComfyNodeOutput<'SEG_ELT_crop_region', 3>,
          bbox: ComfyNodeOutput<'SEG_ELT_bbox', 4>,
          control_net_wrapper: ComfyNodeOutput<'SEG_ELT_control_net_wrapper', 5>,
          confidence: ComfyNodeOutput<'FLOAT', 6>,
          label: ComfyNodeOutput<'STRING', 7>,
      }
      interface ImpactFrom$_SEG$_ELT_input {
          seg_elt: Comfy.Input.SEG_ELT
      }
      interface ImpactEdit$_SEG$_ELT extends HasSingle_SEG_ELT, ComfyNode<ImpactEdit$_SEG$_ELT_input, ImpactEdit$_SEG$_ELT_output> {
          nameInComfy: "ImpactEdit_SEG_ELT"
      }
      interface ImpactEdit$_SEG$_ELT_output {
          SEG_ELT: ComfyNodeOutput<'SEG_ELT', 0>,
      }
      interface ImpactEdit$_SEG$_ELT_input {
          seg_elt: Comfy.Input.SEG_ELT
          cropped_image_opt?: Comfy.Input.IMAGE
          cropped_mask_opt?: Comfy.Input.MASK
          crop_region_opt?: Comfy.Input.SEG_ELT_crop_region
          bbox_opt?: Comfy.Input.SEG_ELT_bbox
          control_net_wrapper_opt?: Comfy.Input.SEG_ELT_control_net_wrapper
          /** min=1 max=1 step=0.1 */
          confidence_opt?: Comfy.Input.FLOAT
          /** */
          label_opt?: Comfy.Input.STRING
      }
      interface ImpactDilate$_Mask$_SEG$_ELT extends HasSingle_SEG_ELT, ComfyNode<ImpactDilate$_Mask$_SEG$_ELT_input, ImpactDilate$_Mask$_SEG$_ELT_output> {
          nameInComfy: "ImpactDilate_Mask_SEG_ELT"
      }
      interface ImpactDilate$_Mask$_SEG$_ELT_output {
          SEG_ELT: ComfyNodeOutput<'SEG_ELT', 0>,
      }
      interface ImpactDilate$_Mask$_SEG$_ELT_input {
          seg_elt: Comfy.Input.SEG_ELT
          /** default=10 min=512 max=512 step=1 */
          dilation?: Comfy.Input.INT
      }
      interface ImpactDilateMask extends HasSingle_MASK, ComfyNode<ImpactDilateMask_input, ImpactDilateMask_output> {
          nameInComfy: "ImpactDilateMask"
      }
      interface ImpactDilateMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface ImpactDilateMask_input {
          mask: Comfy.Input.MASK
          /** default=10 min=512 max=512 step=1 */
          dilation?: Comfy.Input.INT
      }
      interface ImpactGaussianBlurMask extends HasSingle_MASK, ComfyNode<ImpactGaussianBlurMask_input, ImpactGaussianBlurMask_output> {
          nameInComfy: "ImpactGaussianBlurMask"
      }
      interface ImpactGaussianBlurMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface ImpactGaussianBlurMask_input {
          mask: Comfy.Input.MASK
          /** default=10 min=100 max=100 step=1 */
          kernel_size?: Comfy.Input.INT
          /** default=10 min=100 max=100 step=0.1 */
          sigma?: Comfy.Input.FLOAT
      }
      interface ImpactDilateMaskInSEGS extends HasSingle_SEGS, ComfyNode<ImpactDilateMaskInSEGS_input, ImpactDilateMaskInSEGS_output> {
          nameInComfy: "ImpactDilateMaskInSEGS"
      }
      interface ImpactDilateMaskInSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactDilateMaskInSEGS_input {
          segs: Comfy.Input.SEGS
          /** default=10 min=512 max=512 step=1 */
          dilation?: Comfy.Input.INT
      }
      interface ImpactGaussianBlurMaskInSEGS extends HasSingle_SEGS, ComfyNode<ImpactGaussianBlurMaskInSEGS_input, ImpactGaussianBlurMaskInSEGS_output> {
          nameInComfy: "ImpactGaussianBlurMaskInSEGS"
      }
      interface ImpactGaussianBlurMaskInSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactGaussianBlurMaskInSEGS_input {
          segs: Comfy.Input.SEGS
          /** default=10 min=100 max=100 step=1 */
          kernel_size?: Comfy.Input.INT
          /** default=10 min=100 max=100 step=0.1 */
          sigma?: Comfy.Input.FLOAT
      }
      interface ImpactScaleBy$_BBOX$_SEG$_ELT extends HasSingle_SEG_ELT, ComfyNode<ImpactScaleBy$_BBOX$_SEG$_ELT_input, ImpactScaleBy$_BBOX$_SEG$_ELT_output> {
          nameInComfy: "ImpactScaleBy_BBOX_SEG_ELT"
      }
      interface ImpactScaleBy$_BBOX$_SEG$_ELT_output {
          SEG_ELT: ComfyNodeOutput<'SEG_ELT', 0>,
      }
      interface ImpactScaleBy$_BBOX$_SEG$_ELT_input {
          seg: Comfy.Input.SEG_ELT
          /** default=1 min=8 max=8 step=0.01 */
          scale_by?: Comfy.Input.FLOAT
      }
      interface ImpactFrom$_SEG$_ELT$_bbox extends ComfyNode<ImpactFrom$_SEG$_ELT$_bbox_input, ImpactFrom$_SEG$_ELT$_bbox_output> {
          nameInComfy: "ImpactFrom_SEG_ELT_bbox"
      }
      interface ImpactFrom$_SEG$_ELT$_bbox_output {
          left: ComfyNodeOutput<'INT', 0>,
          top: ComfyNodeOutput<'INT', 1>,
          right: ComfyNodeOutput<'INT', 2>,
          bottom: ComfyNodeOutput<'INT', 3>,
      }
      interface ImpactFrom$_SEG$_ELT$_bbox_input {
          bbox: Comfy.Input.SEG_ELT_bbox
      }
      interface ImpactFrom$_SEG$_ELT$_crop$_region extends ComfyNode<ImpactFrom$_SEG$_ELT$_crop$_region_input, ImpactFrom$_SEG$_ELT$_crop$_region_output> {
          nameInComfy: "ImpactFrom_SEG_ELT_crop_region"
      }
      interface ImpactFrom$_SEG$_ELT$_crop$_region_output {
          left: ComfyNodeOutput<'INT', 0>,
          top: ComfyNodeOutput<'INT', 1>,
          right: ComfyNodeOutput<'INT', 2>,
          bottom: ComfyNodeOutput<'INT', 3>,
      }
      interface ImpactFrom$_SEG$_ELT$_crop$_region_input {
          crop_region: Comfy.Input.SEG_ELT_crop_region
      }
      interface ImpactCount$_Elts$_in$_SEGS extends HasSingle_INT, ComfyNode<ImpactCount$_Elts$_in$_SEGS_input, ImpactCount$_Elts$_in$_SEGS_output> {
          nameInComfy: "ImpactCount_Elts_in_SEGS"
      }
      interface ImpactCount$_Elts$_in$_SEGS_output {
          INT: ComfyNodeOutput<'INT', 0>,
      }
      interface ImpactCount$_Elts$_in$_SEGS_input {
          segs: Comfy.Input.SEGS
      }
      interface BboxDetectorCombined$_v2 extends HasSingle_MASK, ComfyNode<BboxDetectorCombined$_v2_input, BboxDetectorCombined$_v2_output> {
          nameInComfy: "BboxDetectorCombined_v2"
      }
      interface BboxDetectorCombined$_v2_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface BboxDetectorCombined$_v2_input {
          bbox_detector: Comfy.Input.BBOX_DETECTOR
          image: Comfy.Input.IMAGE
          /** default=0.5 min=1 max=1 step=0.01 */
          threshold?: Comfy.Input.FLOAT
          /** default=4 min=512 max=512 step=1 */
          dilation?: Comfy.Input.INT
      }
      interface SegmDetectorCombined$_v2 extends HasSingle_MASK, ComfyNode<SegmDetectorCombined$_v2_input, SegmDetectorCombined$_v2_output> {
          nameInComfy: "SegmDetectorCombined_v2"
      }
      interface SegmDetectorCombined$_v2_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface SegmDetectorCombined$_v2_input {
          segm_detector: Comfy.Input.SEGM_DETECTOR
          image: Comfy.Input.IMAGE
          /** default=0.5 min=1 max=1 step=0.01 */
          threshold?: Comfy.Input.FLOAT
          /** default=0 min=512 max=512 step=1 */
          dilation?: Comfy.Input.INT
      }
      interface SegsToCombinedMask extends HasSingle_MASK, ComfyNode<SegsToCombinedMask_input, SegsToCombinedMask_output> {
          nameInComfy: "SegsToCombinedMask"
      }
      interface SegsToCombinedMask_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface SegsToCombinedMask_input {
          segs: Comfy.Input.SEGS
      }
      interface KSamplerProvider extends HasSingle_KSAMPLER, ComfyNode<KSamplerProvider_input, KSamplerProvider_output> {
          nameInComfy: "KSamplerProvider"
      }
      interface KSamplerProvider_output {
          KSAMPLER: ComfyNodeOutput<'KSAMPLER', 0>,
      }
      interface KSamplerProvider_input {
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          /** */
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          /** */
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** */
          basic_pipe: Comfy.Input.BASIC_PIPE
          /** */
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface TwoSamplersForMask extends HasSingle_LATENT, ComfyNode<TwoSamplersForMask_input, TwoSamplersForMask_output> {
          nameInComfy: "TwoSamplersForMask"
      }
      interface TwoSamplersForMask_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface TwoSamplersForMask_input {
          /** */
          latent_image: Comfy.Input.LATENT
          /** */
          base_sampler: Comfy.Input.KSAMPLER
          /** */
          mask_sampler: Comfy.Input.KSAMPLER
          /** */
          mask: Comfy.Input.MASK
      }
      interface TiledKSamplerProvider extends HasSingle_KSAMPLER, ComfyNode<TiledKSamplerProvider_input, TiledKSamplerProvider_output> {
          nameInComfy: "TiledKSamplerProvider"
      }
      interface TiledKSamplerProvider_output {
          KSAMPLER: ComfyNodeOutput<'KSAMPLER', 0>,
      }
      interface TiledKSamplerProvider_input {
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          /** */
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          /** */
          scheduler: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=512 min=16384 max=16384 step=64 */
          tile_width?: Comfy.Input.INT
          /** default=512 min=16384 max=16384 step=64 */
          tile_height?: Comfy.Input.INT
          /** */
          tiling_strategy: Comfy.Union.E_304f89a0de34643f12756237824e7261db28aaf5
          /** */
          basic_pipe: Comfy.Input.BASIC_PIPE
      }
      interface KSamplerAdvancedProvider extends HasSingle_KSAMPLER_ADVANCED, ComfyNode<KSamplerAdvancedProvider_input, KSamplerAdvancedProvider_output> {
          nameInComfy: "KSamplerAdvancedProvider"
      }
      interface KSamplerAdvancedProvider_output {
          KSAMPLER_ADVANCED: ComfyNodeOutput<'KSAMPLER_ADVANCED', 0>,
      }
      interface KSamplerAdvancedProvider_input {
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          /** */
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          /** */
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          /** default=1 min=10 max=10 step=0.01 */
          sigma_factor?: Comfy.Input.FLOAT
          /** */
          basic_pipe: Comfy.Input.BASIC_PIPE
          /** */
          sampler_opt?: Comfy.Input.SAMPLER
          /** */
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface TwoAdvancedSamplersForMask extends HasSingle_LATENT, ComfyNode<TwoAdvancedSamplersForMask_input, TwoAdvancedSamplersForMask_output> {
          nameInComfy: "TwoAdvancedSamplersForMask"
      }
      interface TwoAdvancedSamplersForMask_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface TwoAdvancedSamplersForMask_input {
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** */
          samples: Comfy.Input.LATENT
          /** */
          base_sampler: Comfy.Input.KSAMPLER_ADVANCED
          /** */
          mask_sampler: Comfy.Input.KSAMPLER_ADVANCED
          /** */
          mask: Comfy.Input.MASK
          /** default=10 min=10000 max=10000 */
          overlap_factor?: Comfy.Input.INT
      }
      interface ImpactNegativeConditioningPlaceholder extends HasSingle_CONDITIONING, ComfyNode<ImpactNegativeConditioningPlaceholder_input, ImpactNegativeConditioningPlaceholder_output> {
          nameInComfy: "ImpactNegativeConditioningPlaceholder"
      }
      interface ImpactNegativeConditioningPlaceholder_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface ImpactNegativeConditioningPlaceholder_input {
      }
      interface PreviewBridge extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<PreviewBridge_input, PreviewBridge_output> {
          nameInComfy: "PreviewBridge"
      }
      interface PreviewBridge_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
          MASK: ComfyNodeOutput<'MASK', 1>,
      }
      interface PreviewBridge_input {
          images: Comfy.Input.IMAGE
          /** default="" */
          image?: Comfy.Input.STRING
          /** default=false */
          block?: Comfy.Input.BOOLEAN
          /** */
          restore_mask?: Comfy.Union.E_f27fae3205ecf36e9f4a68f3867d38e025476963
      }
      interface PreviewBridgeLatent extends HasSingle_LATENT, HasSingle_MASK, ComfyNode<PreviewBridgeLatent_input, PreviewBridgeLatent_output> {
          nameInComfy: "PreviewBridgeLatent"
      }
      interface PreviewBridgeLatent_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
          MASK: ComfyNodeOutput<'MASK', 1>,
      }
      interface PreviewBridgeLatent_input {
          latent: Comfy.Input.LATENT
          /** default="" */
          image?: Comfy.Input.STRING
          preview_method: Comfy.Union.E_ea287ec9983f05378f2614091804a1b6b95d1c79
          vae_opt?: Comfy.Input.VAE
          /** default=false */
          block?: Comfy.Input.BOOLEAN
          /** */
          restore_mask?: Comfy.Union.E_f27fae3205ecf36e9f4a68f3867d38e025476963
      }
      interface ImageSender extends ComfyNode<ImageSender_input, ImageSender_output> {
          nameInComfy: "ImageSender"
      }
      interface ImageSender_output {
      }
      interface ImageSender_input {
          images: Comfy.Input.IMAGE
          /** default="ImgSender" */
          filename_prefix?: Comfy.Input.STRING
          /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
          link_id?: Comfy.Input.INT
      }
      interface ImageReceiver extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImageReceiver_input, ImageReceiver_output> {
          nameInComfy: "ImageReceiver"
      }
      interface ImageReceiver_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
          MASK: ComfyNodeOutput<'MASK', 1>,
      }
      interface ImageReceiver_input {
          image: Comfy.Union.E_26ea5ad8c44c9551fea858fff18017427386b591
          /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
          link_id?: Comfy.Input.INT
          /** default=false */
          save_to_workflow?: Comfy.Input.BOOLEAN
          /** */
          image_data: Comfy.Input.STRING
          /** default=false */
          trigger_always?: Comfy.Input.BOOLEAN
      }
      interface LatentSender extends ComfyNode<LatentSender_input, LatentSender_output> {
          nameInComfy: "LatentSender"
      }
      interface LatentSender_output {
      }
      interface LatentSender_input {
          samples: Comfy.Input.LATENT
          /** default="latents/LatentSender" */
          filename_prefix?: Comfy.Input.STRING
          /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
          link_id?: Comfy.Input.INT
          preview_method: Comfy.Union.E_fa4a13687b111fa33a8c8fa375d5321d09b46b27
      }
      interface LatentReceiver extends HasSingle_LATENT, ComfyNode<LatentReceiver_input, LatentReceiver_output> {
          nameInComfy: "LatentReceiver"
      }
      interface LatentReceiver_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface LatentReceiver_input {
          latent: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190
          /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
          link_id?: Comfy.Input.INT
          /** default=false */
          trigger_always?: Comfy.Input.BOOLEAN
      }
      interface ImageMaskSwitch extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImageMaskSwitch_input, ImageMaskSwitch_output> {
          nameInComfy: "ImageMaskSwitch"
      }
      interface ImageMaskSwitch_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
          MASK: ComfyNodeOutput<'MASK', 1>,
      }
      interface ImageMaskSwitch_input {
          /** default=1 min=4 max=4 step=1 */
          select?: Comfy.Input.INT
          images1: Comfy.Input.IMAGE
          mask1_opt?: Comfy.Input.MASK
          images2_opt?: Comfy.Input.IMAGE
          mask2_opt?: Comfy.Input.MASK
          images3_opt?: Comfy.Input.IMAGE
          mask3_opt?: Comfy.Input.MASK
          images4_opt?: Comfy.Input.IMAGE
          mask4_opt?: Comfy.Input.MASK
      }
      interface LatentSwitch extends HasSingle_$Star, HasSingle_STRING, HasSingle_INT, ComfyNode<LatentSwitch_input, LatentSwitch_output> {
          nameInComfy: "LatentSwitch"
      }
      interface LatentSwitch_output {
          selected_value: ComfyNodeOutput<'$Star', 0>,
          selected_label: ComfyNodeOutput<'STRING', 1>,
          selected_index: ComfyNodeOutput<'INT', 2>,
      }
      interface LatentSwitch_input {
          /** default=1 min=999999 max=999999 step=1 */
          select?: Comfy.Input.INT
          /** default=false */
          sel_mode?: Comfy.Input.BOOLEAN
          /** */
          input1?: Comfy.Input.$Star
      }
      interface SEGSSwitch extends HasSingle_$Star, HasSingle_STRING, HasSingle_INT, ComfyNode<SEGSSwitch_input, SEGSSwitch_output> {
          nameInComfy: "SEGSSwitch"
      }
      interface SEGSSwitch_output {
          selected_value: ComfyNodeOutput<'$Star', 0>,
          selected_label: ComfyNodeOutput<'STRING', 1>,
          selected_index: ComfyNodeOutput<'INT', 2>,
      }
      interface SEGSSwitch_input {
          /** default=1 min=999999 max=999999 step=1 */
          select?: Comfy.Input.INT
          /** default=false */
          sel_mode?: Comfy.Input.BOOLEAN
          /** */
          input1?: Comfy.Input.$Star
      }
      interface ImpactSwitch extends HasSingle_$Star, HasSingle_STRING, HasSingle_INT, ComfyNode<ImpactSwitch_input, ImpactSwitch_output> {
          nameInComfy: "ImpactSwitch"
      }
      interface ImpactSwitch_output {
          selected_value: ComfyNodeOutput<'$Star', 0>,
          selected_label: ComfyNodeOutput<'STRING', 1>,
          selected_index: ComfyNodeOutput<'INT', 2>,
      }
      interface ImpactSwitch_input {
          /** default=1 min=999999 max=999999 step=1 */
          select?: Comfy.Input.INT
          /** default=false */
          sel_mode?: Comfy.Input.BOOLEAN
          /** */
          input1?: Comfy.Input.$Star
      }
      interface ImpactInversedSwitch extends HasSingle_$Star, ComfyNode<ImpactInversedSwitch_input, ImpactInversedSwitch_output> {
          nameInComfy: "ImpactInversedSwitch"
      }
      interface ImpactInversedSwitch_output {
          "$Star": ComfyNodeOutput<'$Star', 0>,
      }
      interface ImpactInversedSwitch_input {
          /** default=1 min=999999 max=999999 step=1 */
          select?: Comfy.Input.INT
          /** */
          input: Comfy.Input.$Star
          /** default=false */
          sel_mode?: Comfy.Input.BOOLEAN
      }
      interface ImpactWildcardProcessor extends HasSingle_STRING, ComfyNode<ImpactWildcardProcessor_input, ImpactWildcardProcessor_output> {
          nameInComfy: "ImpactWildcardProcessor"
      }
      interface ImpactWildcardProcessor_output {
          STRING: ComfyNodeOutput<'STRING', 0>,
      }
      interface ImpactWildcardProcessor_input {
          /** */
          wildcard_text: Comfy.Input.STRING
          /** */
          populated_text: Comfy.Input.STRING
          /** default=true */
          mode?: Comfy.Input.BOOLEAN
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          "Select to add Wildcard": Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26
      }
      interface ImpactWildcardEncode extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_CONDITIONING, HasSingle_STRING, ComfyNode<ImpactWildcardEncode_input, ImpactWildcardEncode_output> {
          nameInComfy: "ImpactWildcardEncode"
      }
      interface ImpactWildcardEncode_output {
          model: ComfyNodeOutput<'MODEL', 0>,
          clip: ComfyNodeOutput<'CLIP', 1>,
          conditioning: ComfyNodeOutput<'CONDITIONING', 2>,
          populated_text: ComfyNodeOutput<'STRING', 3>,
      }
      interface ImpactWildcardEncode_input {
          model: Comfy.Input.MODEL
          clip: Comfy.Input.CLIP
          /** */
          wildcard_text: Comfy.Input.STRING
          /** */
          populated_text: Comfy.Input.STRING
          /** default=true */
          mode?: Comfy.Input.BOOLEAN
          "Select to add LoRA": Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df
          "Select to add Wildcard": Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
      }
      interface SEGSUpscaler extends HasSingle_IMAGE, ComfyNode<SEGSUpscaler_input, SEGSUpscaler_output> {
          nameInComfy: "SEGSUpscaler"
      }
      interface SEGSUpscaler_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface SEGSUpscaler_input {
          image: Comfy.Input.IMAGE
          segs: Comfy.Input.SEGS
          model: Comfy.Input.MODEL
          clip: Comfy.Input.CLIP
          vae: Comfy.Input.VAE
          /** default=2 min=100 max=100 step=0.01 */
          rescale_factor?: Comfy.Input.FLOAT
          resampling_method: Comfy.Union.E_bac912b55de8a59480c74aba068f4a3b5f9a0e38
          supersample: Comfy.Union.E_c1a74591678033a2ccc87aa0add77dab7f001da5
          /** default=8 min=1024 max=1024 step=8 */
          rounding_modulus?: Comfy.Input.INT
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          positive: Comfy.Input.CONDITIONING
          negative: Comfy.Input.CONDITIONING
          /** default=0.5 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=5 min=100 max=100 step=1 */
          feather?: Comfy.Input.INT
          /** default=false */
          inpaint_model?: Comfy.Input.BOOLEAN
          /** default=20 min=100 max=100 step=1 */
          noise_mask_feather?: Comfy.Input.INT
          upscale_model_opt?: Comfy.Input.UPSCALE_MODEL
          upscaler_hook_opt?: Comfy.Input.UPSCALER_HOOK
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface SEGSUpscalerPipe extends HasSingle_IMAGE, ComfyNode<SEGSUpscalerPipe_input, SEGSUpscalerPipe_output> {
          nameInComfy: "SEGSUpscalerPipe"
      }
      interface SEGSUpscalerPipe_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface SEGSUpscalerPipe_input {
          image: Comfy.Input.IMAGE
          segs: Comfy.Input.SEGS
          basic_pipe: Comfy.Input.BASIC_PIPE
          /** default=2 min=100 max=100 step=0.01 */
          rescale_factor?: Comfy.Input.FLOAT
          resampling_method: Comfy.Union.E_bac912b55de8a59480c74aba068f4a3b5f9a0e38
          supersample: Comfy.Union.E_c1a74591678033a2ccc87aa0add77dab7f001da5
          /** default=8 min=1024 max=1024 step=8 */
          rounding_modulus?: Comfy.Input.INT
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          /** default=0.5 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=5 min=100 max=100 step=1 */
          feather?: Comfy.Input.INT
          /** default=false */
          inpaint_model?: Comfy.Input.BOOLEAN
          /** default=20 min=100 max=100 step=1 */
          noise_mask_feather?: Comfy.Input.INT
          upscale_model_opt?: Comfy.Input.UPSCALE_MODEL
          upscaler_hook_opt?: Comfy.Input.UPSCALER_HOOK
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface SEGSDetailer extends HasSingle_SEGS, HasSingle_IMAGE, ComfyNode<SEGSDetailer_input, SEGSDetailer_output> {
          nameInComfy: "SEGSDetailer"
      }
      interface SEGSDetailer_output {
          segs: ComfyNodeOutput<'SEGS', 0>,
          cnet_images: ComfyNodeOutput<'IMAGE', 1>,
      }
      interface SEGSDetailer_input {
          image: Comfy.Input.IMAGE
          segs: Comfy.Input.SEGS
          /** default=512 min=16384 max=16384 step=8 */
          guide_size?: Comfy.Input.FLOAT
          /** default=true */
          guide_size_for?: Comfy.Input.BOOLEAN
          /** default=768 min=16384 max=16384 step=8 */
          max_size?: Comfy.Input.FLOAT
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          /** default=0.5 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** default=true */
          noise_mask?: Comfy.Input.BOOLEAN
          /** default=true */
          force_inpaint?: Comfy.Input.BOOLEAN
          basic_pipe: Comfy.Input.BASIC_PIPE
          /** default=0.2 min=1 max=1 */
          refiner_ratio?: Comfy.Input.FLOAT
          /** default=1 min=100 max=100 */
          batch_size?: Comfy.Input.INT
          /** default=1 min=10 max=10 step=1 */
          cycle?: Comfy.Input.INT
          refiner_basic_pipe_opt?: Comfy.Input.BASIC_PIPE
          /** default=false */
          inpaint_model?: Comfy.Input.BOOLEAN
          /** default=20 min=100 max=100 step=1 */
          noise_mask_feather?: Comfy.Input.INT
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface SEGSPaste extends HasSingle_IMAGE, ComfyNode<SEGSPaste_input, SEGSPaste_output> {
          nameInComfy: "SEGSPaste"
      }
      interface SEGSPaste_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface SEGSPaste_input {
          image: Comfy.Input.IMAGE
          segs: Comfy.Input.SEGS
          /** default=5 min=100 max=100 step=1 */
          feather?: Comfy.Input.INT
          /** default=255 min=255 max=255 step=1 */
          alpha?: Comfy.Input.INT
          ref_image_opt?: Comfy.Input.IMAGE
      }
      interface SEGSPreview extends HasSingle_IMAGE, ComfyNode<SEGSPreview_input, SEGSPreview_output> {
          nameInComfy: "SEGSPreview"
      }
      interface SEGSPreview_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface SEGSPreview_input {
          segs: Comfy.Input.SEGS
          /** default=true */
          alpha_mode?: Comfy.Input.BOOLEAN
          /** default=0.2 min=1 max=1 step=0.01 */
          min_alpha?: Comfy.Input.FLOAT
          fallback_image_opt?: Comfy.Input.IMAGE
      }
      interface SEGSPreviewCNet extends HasSingle_IMAGE, ComfyNode<SEGSPreviewCNet_input, SEGSPreviewCNet_output> {
          nameInComfy: "SEGSPreviewCNet"
      }
      interface SEGSPreviewCNet_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface SEGSPreviewCNet_input {
          segs: Comfy.Input.SEGS
      }
      interface SEGSToImageList extends HasSingle_IMAGE, ComfyNode<SEGSToImageList_input, SEGSToImageList_output> {
          nameInComfy: "SEGSToImageList"
      }
      interface SEGSToImageList_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface SEGSToImageList_input {
          segs: Comfy.Input.SEGS
          fallback_image_opt?: Comfy.Input.IMAGE
      }
      interface ImpactSEGSToMaskList extends HasSingle_MASK, ComfyNode<ImpactSEGSToMaskList_input, ImpactSEGSToMaskList_output> {
          nameInComfy: "ImpactSEGSToMaskList"
      }
      interface ImpactSEGSToMaskList_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface ImpactSEGSToMaskList_input {
          segs: Comfy.Input.SEGS
      }
      interface ImpactSEGSToMaskBatch extends HasSingle_MASK, ComfyNode<ImpactSEGSToMaskBatch_input, ImpactSEGSToMaskBatch_output> {
          nameInComfy: "ImpactSEGSToMaskBatch"
      }
      interface ImpactSEGSToMaskBatch_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface ImpactSEGSToMaskBatch_input {
          segs: Comfy.Input.SEGS
      }
      interface ImpactSEGSConcat extends HasSingle_SEGS, ComfyNode<ImpactSEGSConcat_input, ImpactSEGSConcat_output> {
          nameInComfy: "ImpactSEGSConcat"
      }
      interface ImpactSEGSConcat_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactSEGSConcat_input {
          segs1: Comfy.Input.SEGS
      }
      interface ImpactSEGSPicker extends HasSingle_SEGS, ComfyNode<ImpactSEGSPicker_input, ImpactSEGSPicker_output> {
          nameInComfy: "ImpactSEGSPicker"
      }
      interface ImpactSEGSPicker_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactSEGSPicker_input {
          /** */
          picks: Comfy.Input.STRING
          segs: Comfy.Input.SEGS
          fallback_image_opt?: Comfy.Input.IMAGE
      }
      interface ImpactMakeTileSEGS extends HasSingle_SEGS, ComfyNode<ImpactMakeTileSEGS_input, ImpactMakeTileSEGS_output> {
          nameInComfy: "ImpactMakeTileSEGS"
      }
      interface ImpactMakeTileSEGS_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactMakeTileSEGS_input {
          images: Comfy.Input.IMAGE
          /** default=512 min=4096 max=4096 step=8 */
          bbox_size?: Comfy.Input.INT
          /** default=3 min=10 max=10 step=0.01 */
          crop_factor?: Comfy.Input.FLOAT
          /** default=5 min=512 max=512 step=1 */
          min_overlap?: Comfy.Input.INT
          /** default=20 min=255 max=255 step=1 */
          filter_segs_dilation?: Comfy.Input.INT
          /** default=0 min=1 max=1 step=0.01 */
          mask_irregularity?: Comfy.Input.FLOAT
          irregular_mask_mode: Comfy.Union.E_5cc1495fe28eac05289d45b29269b31c6edca055
          filter_in_segs_opt?: Comfy.Input.SEGS
          filter_out_segs_opt?: Comfy.Input.SEGS
      }
      interface ImpactSEGSMerge extends HasSingle_SEGS, ComfyNode<ImpactSEGSMerge_input, ImpactSEGSMerge_output> {
          nameInComfy: "ImpactSEGSMerge"
      }
      interface ImpactSEGSMerge_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactSEGSMerge_input {
          segs: Comfy.Input.SEGS
      }
      interface SEGSDetailerForAnimateDiff extends HasSingle_SEGS, HasSingle_IMAGE, ComfyNode<SEGSDetailerForAnimateDiff_input, SEGSDetailerForAnimateDiff_output> {
          nameInComfy: "SEGSDetailerForAnimateDiff"
      }
      interface SEGSDetailerForAnimateDiff_output {
          segs: ComfyNodeOutput<'SEGS', 0>,
          cnet_images: ComfyNodeOutput<'IMAGE', 1>,
      }
      interface SEGSDetailerForAnimateDiff_input {
          image_frames: Comfy.Input.IMAGE
          segs: Comfy.Input.SEGS
          /** default=512 min=16384 max=16384 step=8 */
          guide_size?: Comfy.Input.FLOAT
          /** default=true */
          guide_size_for?: Comfy.Input.BOOLEAN
          /** default=768 min=16384 max=16384 step=8 */
          max_size?: Comfy.Input.FLOAT
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          /** default=0.5 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          basic_pipe: Comfy.Input.BASIC_PIPE
          /** default=0.2 min=1 max=1 */
          refiner_ratio?: Comfy.Input.FLOAT
          refiner_basic_pipe_opt?: Comfy.Input.BASIC_PIPE
          /** default=20 min=100 max=100 step=1 */
          noise_mask_feather?: Comfy.Input.INT
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface ImpactKSamplerBasicPipe extends HasSingle_BASIC_PIPE, HasSingle_LATENT, HasSingle_VAE, ComfyNode<ImpactKSamplerBasicPipe_input, ImpactKSamplerBasicPipe_output> {
          nameInComfy: "ImpactKSamplerBasicPipe"
      }
      interface ImpactKSamplerBasicPipe_output {
          BASIC_PIPE: ComfyNodeOutput<'BASIC_PIPE', 0>,
          LATENT: ComfyNodeOutput<'LATENT', 1>,
          VAE: ComfyNodeOutput<'VAE', 2>,
      }
      interface ImpactKSamplerBasicPipe_input {
          /** */
          basic_pipe: Comfy.Input.BASIC_PIPE
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          /** */
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          /** */
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          /** */
          latent_image: Comfy.Input.LATENT
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** */
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface ImpactKSamplerAdvancedBasicPipe extends HasSingle_BASIC_PIPE, HasSingle_LATENT, HasSingle_VAE, ComfyNode<ImpactKSamplerAdvancedBasicPipe_input, ImpactKSamplerAdvancedBasicPipe_output> {
          nameInComfy: "ImpactKSamplerAdvancedBasicPipe"
      }
      interface ImpactKSamplerAdvancedBasicPipe_output {
          BASIC_PIPE: ComfyNodeOutput<'BASIC_PIPE', 0>,
          LATENT: ComfyNodeOutput<'LATENT', 1>,
          VAE: ComfyNodeOutput<'VAE', 2>,
      }
      interface ImpactKSamplerAdvancedBasicPipe_input {
          /** */
          basic_pipe: Comfy.Input.BASIC_PIPE
          /** default=true */
          add_noise?: Comfy.Input.BOOLEAN
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          noise_seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=8 min=100 max=100 */
          cfg?: Comfy.Input.FLOAT
          /** */
          sampler_name: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453
          /** */
          scheduler: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d
          /** */
          latent_image: Comfy.Input.LATENT
          /** default=0 min=10000 max=10000 */
          start_at_step?: Comfy.Input.INT
          /** default=10000 min=10000 max=10000 */
          end_at_step?: Comfy.Input.INT
          /** default=false */
          return_with_leftover_noise?: Comfy.Input.BOOLEAN
          /** */
          scheduler_func_opt?: Comfy.Input.SCHEDULER_FUNC
      }
      interface ReencodeLatent extends HasSingle_LATENT, ComfyNode<ReencodeLatent_input, ReencodeLatent_output> {
          nameInComfy: "ReencodeLatent"
      }
      interface ReencodeLatent_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface ReencodeLatent_input {
          samples: Comfy.Input.LATENT
          tile_mode: Comfy.Union.E_d5776f669e41b2ec29cd020ce34a8b7cdf23693d
          input_vae: Comfy.Input.VAE
          output_vae: Comfy.Input.VAE
          /** default=512 min=4096 max=4096 step=64 */
          tile_size?: Comfy.Input.INT
      }
      interface ReencodeLatentPipe extends HasSingle_LATENT, ComfyNode<ReencodeLatentPipe_input, ReencodeLatentPipe_output> {
          nameInComfy: "ReencodeLatentPipe"
      }
      interface ReencodeLatentPipe_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface ReencodeLatentPipe_input {
          samples: Comfy.Input.LATENT
          tile_mode: Comfy.Union.E_d5776f669e41b2ec29cd020ce34a8b7cdf23693d
          input_basic_pipe: Comfy.Input.BASIC_PIPE
          output_basic_pipe: Comfy.Input.BASIC_PIPE
      }
      interface ImpactImageBatchToImageList extends HasSingle_IMAGE, ComfyNode<ImpactImageBatchToImageList_input, ImpactImageBatchToImageList_output> {
          nameInComfy: "ImpactImageBatchToImageList"
      }
      interface ImpactImageBatchToImageList_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImpactImageBatchToImageList_input {
          image: Comfy.Input.IMAGE
      }
      interface ImpactMakeImageList extends HasSingle_IMAGE, ComfyNode<ImpactMakeImageList_input, ImpactMakeImageList_output> {
          nameInComfy: "ImpactMakeImageList"
      }
      interface ImpactMakeImageList_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImpactMakeImageList_input {
          image1: Comfy.Input.IMAGE
      }
      interface ImpactMakeImageBatch extends HasSingle_IMAGE, ComfyNode<ImpactMakeImageBatch_input, ImpactMakeImageBatch_output> {
          nameInComfy: "ImpactMakeImageBatch"
      }
      interface ImpactMakeImageBatch_output {
          IMAGE: ComfyNodeOutput<'IMAGE', 0>,
      }
      interface ImpactMakeImageBatch_input {
          image1: Comfy.Input.IMAGE
      }
      interface ImpactMakeAnyList extends HasSingle_$Star, ComfyNode<ImpactMakeAnyList_input, ImpactMakeAnyList_output> {
          nameInComfy: "ImpactMakeAnyList"
      }
      interface ImpactMakeAnyList_output {
          "$Star": ComfyNodeOutput<'$Star', 0>,
      }
      interface ImpactMakeAnyList_input {
          value1?: Comfy.Input.$Star
      }
      interface ImpactMakeMaskList extends HasSingle_MASK, ComfyNode<ImpactMakeMaskList_input, ImpactMakeMaskList_output> {
          nameInComfy: "ImpactMakeMaskList"
      }
      interface ImpactMakeMaskList_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface ImpactMakeMaskList_input {
          mask1: Comfy.Input.MASK
      }
      interface ImpactMakeMaskBatch extends HasSingle_MASK, ComfyNode<ImpactMakeMaskBatch_input, ImpactMakeMaskBatch_output> {
          nameInComfy: "ImpactMakeMaskBatch"
      }
      interface ImpactMakeMaskBatch_output {
          MASK: ComfyNodeOutput<'MASK', 0>,
      }
      interface ImpactMakeMaskBatch_input {
          mask1: Comfy.Input.MASK
      }
      interface RegionalSampler extends HasSingle_LATENT, ComfyNode<RegionalSampler_input, RegionalSampler_output> {
          nameInComfy: "RegionalSampler"
      }
      interface RegionalSampler_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface RegionalSampler_input {
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed?: Comfy.Input.INT
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          seed_2nd?: Comfy.Input.INT
          /** */
          seed_2nd_mode: Comfy.Union.E_1e8364b55644fdbf6d28dd3e6197d9fe1777e361
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=2 min=10000 max=10000 */
          base_only_steps?: Comfy.Input.INT
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
          /** */
          samples: Comfy.Input.LATENT
          /** */
          base_sampler: Comfy.Input.KSAMPLER_ADVANCED
          /** */
          regional_prompts: Comfy.Input.REGIONAL_PROMPTS
          /** default=10 min=10000 max=10000 */
          overlap_factor?: Comfy.Input.INT
          /** default=true */
          restore_latent?: Comfy.Input.BOOLEAN
          /** default="ratio between" */
          additional_mode?: Comfy.Union.E_db19bd49ccd13456a936f2070c088f16070aa0b1
          /** */
          additional_sampler: Comfy.Union.E_3fd6d592305b0bc44ce9c69a23201f8d7a155884
          /** default=0.3 min=1 max=1 step=0.01 */
          additional_sigma_ratio?: Comfy.Input.FLOAT
      }
      interface RegionalSamplerAdvanced extends HasSingle_LATENT, ComfyNode<RegionalSamplerAdvanced_input, RegionalSamplerAdvanced_output> {
          nameInComfy: "RegionalSamplerAdvanced"
      }
      interface RegionalSamplerAdvanced_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface RegionalSamplerAdvanced_input {
          /** default=true */
          add_noise?: Comfy.Input.BOOLEAN
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          noise_seed?: Comfy.Input.INT
          /** default=20 min=10000 max=10000 */
          steps?: Comfy.Input.INT
          /** default=0 min=10000 max=10000 */
          start_at_step?: Comfy.Input.INT
          /** default=10000 min=10000 max=10000 */
          end_at_step?: Comfy.Input.INT
          /** default=10 min=10000 max=10000 */
          overlap_factor?: Comfy.Input.INT
          /** default=true */
          restore_latent?: Comfy.Input.BOOLEAN
          /** default=false */
          return_with_leftover_noise?: Comfy.Input.BOOLEAN
          /** */
          latent_image: Comfy.Input.LATENT
          /** */
          base_sampler: Comfy.Input.KSAMPLER_ADVANCED
          /** */
          regional_prompts: Comfy.Input.REGIONAL_PROMPTS
          /** default="ratio between" */
          additional_mode?: Comfy.Union.E_db19bd49ccd13456a936f2070c088f16070aa0b1
          /** */
          additional_sampler: Comfy.Union.E_3fd6d592305b0bc44ce9c69a23201f8d7a155884
          /** default=0.3 min=1 max=1 step=0.01 */
          additional_sigma_ratio?: Comfy.Input.FLOAT
      }
      interface CombineRegionalPrompts extends HasSingle_REGIONAL_PROMPTS, ComfyNode<CombineRegionalPrompts_input, CombineRegionalPrompts_output> {
          nameInComfy: "CombineRegionalPrompts"
      }
      interface CombineRegionalPrompts_output {
          REGIONAL_PROMPTS: ComfyNodeOutput<'REGIONAL_PROMPTS', 0>,
      }
      interface CombineRegionalPrompts_input {
          /** */
          regional_prompts1: Comfy.Input.REGIONAL_PROMPTS
      }
      interface RegionalPrompt extends HasSingle_REGIONAL_PROMPTS, ComfyNode<RegionalPrompt_input, RegionalPrompt_output> {
          nameInComfy: "RegionalPrompt"
      }
      interface RegionalPrompt_output {
          REGIONAL_PROMPTS: ComfyNodeOutput<'REGIONAL_PROMPTS', 0>,
      }
      interface RegionalPrompt_input {
          /** */
          mask: Comfy.Input.MASK
          /** */
          advanced_sampler: Comfy.Input.KSAMPLER_ADVANCED
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          variation_seed?: Comfy.Input.INT
          /** default=0 min=1 max=1 step=0.01 */
          variation_strength?: Comfy.Input.FLOAT
          /** */
          variation_method?: Comfy.Union.E_627d63e970919d713af795854ffd9dd2642f92d2
      }
      interface ImpactCombineConditionings extends HasSingle_CONDITIONING, ComfyNode<ImpactCombineConditionings_input, ImpactCombineConditionings_output> {
          nameInComfy: "ImpactCombineConditionings"
      }
      interface ImpactCombineConditionings_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface ImpactCombineConditionings_input {
          /** */
          conditioning1: Comfy.Input.CONDITIONING
      }
      interface ImpactConcatConditionings extends HasSingle_CONDITIONING, ComfyNode<ImpactConcatConditionings_input, ImpactConcatConditionings_output> {
          nameInComfy: "ImpactConcatConditionings"
      }
      interface ImpactConcatConditionings_output {
          CONDITIONING: ComfyNodeOutput<'CONDITIONING', 0>,
      }
      interface ImpactConcatConditionings_input {
          /** */
          conditioning1: Comfy.Input.CONDITIONING
      }
      interface ImpactSEGSLabelAssign extends HasSingle_SEGS, ComfyNode<ImpactSEGSLabelAssign_input, ImpactSEGSLabelAssign_output> {
          nameInComfy: "ImpactSEGSLabelAssign"
      }
      interface ImpactSEGSLabelAssign_output {
          SEGS: ComfyNodeOutput<'SEGS', 0>,
      }
      interface ImpactSEGSLabelAssign_input {
          segs: Comfy.Input.SEGS
          /** */
          labels: Comfy.Input.STRING
      }
      interface ImpactSEGSLabelFilter extends ComfyNode<ImpactSEGSLabelFilter_input, ImpactSEGSLabelFilter_output> {
          nameInComfy: "ImpactSEGSLabelFilter"
      }
      interface ImpactSEGSLabelFilter_output {
          filtered_SEGS: ComfyNodeOutput<'SEGS', 0>,
          remained_SEGS: ComfyNodeOutput<'SEGS', 1>,
      }
      interface ImpactSEGSLabelFilter_input {
          segs: Comfy.Input.SEGS
          preset: Comfy.Union.E_cc1f262afc534d382e5c36082cecd4fc2a9c4ffb
          /** */
          labels: Comfy.Input.STRING
      }
      interface ImpactSEGSRangeFilter extends ComfyNode<ImpactSEGSRangeFilter_input, ImpactSEGSRangeFilter_output> {
          nameInComfy: "ImpactSEGSRangeFilter"
      }
      interface ImpactSEGSRangeFilter_output {
          filtered_SEGS: ComfyNodeOutput<'SEGS', 0>,
          remained_SEGS: ComfyNodeOutput<'SEGS', 1>,
      }
      interface ImpactSEGSRangeFilter_input {
          segs: Comfy.Input.SEGS
          target: Comfy.Union.E_10c017f4a76414789a861361dc5cdbfef12e2d7d
          /** default=true */
          mode?: Comfy.Input.BOOLEAN
          /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
          min_value?: Comfy.Input.INT
          /** default=67108864 min=9223372036854776000 max=9223372036854776000 step=1 */
          max_value?: Comfy.Input.INT
      }
      interface ImpactSEGSOrderedFilter extends ComfyNode<ImpactSEGSOrderedFilter_input, ImpactSEGSOrderedFilter_output> {
          nameInComfy: "ImpactSEGSOrderedFilter"
      }
      interface ImpactSEGSOrderedFilter_output {
          filtered_SEGS: ComfyNodeOutput<'SEGS', 0>,
          remained_SEGS: ComfyNodeOutput<'SEGS', 1>,
      }
      interface ImpactSEGSOrderedFilter_input {
          segs: Comfy.Input.SEGS
          target: Comfy.Union.E_b1f554e93f550a374a1ff740ad7447a7b34b71be
          /** default=true */
          order?: Comfy.Input.BOOLEAN
          /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
          take_start?: Comfy.Input.INT
          /** default=1 min=9223372036854776000 max=9223372036854776000 step=1 */
          take_count?: Comfy.Input.INT
      }
      interface ImpactCompare extends HasSingle_BOOLEAN, ComfyNode<ImpactCompare_input, ImpactCompare_output> {
          nameInComfy: "ImpactCompare"
      }
      interface ImpactCompare_output {
          BOOLEAN: ComfyNodeOutput<'BOOLEAN', 0>,
      }
      interface ImpactCompare_input {
          cmp: Comfy.Union.E_87d3a21083ff67c538309f218241f70a793f619c
          a: Comfy.Input.$Star
          b: Comfy.Input.$Star
      }
      interface ImpactConditionalBranch extends HasSingle_$Star, ComfyNode<ImpactConditionalBranch_input, ImpactConditionalBranch_output> {
          nameInComfy: "ImpactConditionalBranch"
      }
      interface ImpactConditionalBranch_output {
          "$Star": ComfyNodeOutput<'$Star', 0>,
      }
      interface ImpactConditionalBranch_input {
          cond: Comfy.Input.BOOLEAN
          /** */
          tt_value: Comfy.Input.$Star
          /** */
          ff_value: Comfy.Input.$Star
      }
      interface ImpactConditionalBranchSelMode extends HasSingle_$Star, ComfyNode<ImpactConditionalBranchSelMode_input, ImpactConditionalBranchSelMode_output> {
          nameInComfy: "ImpactConditionalBranchSelMode"
      }
      interface ImpactConditionalBranchSelMode_output {
          "$Star": ComfyNodeOutput<'$Star', 0>,
      }
      interface ImpactConditionalBranchSelMode_input {
          cond: Comfy.Input.BOOLEAN
          tt_value?: Comfy.Input.$Star
          ff_value?: Comfy.Input.$Star
      }
      interface ImpactIfNone extends HasSingle_$Star, HasSingle_BOOLEAN, ComfyNode<ImpactIfNone_input, ImpactIfNone_output> {
          nameInComfy: "ImpactIfNone"
      }
      interface ImpactIfNone_output {
          signal_opt: ComfyNodeOutput<'$Star', 0>,
          bool: ComfyNodeOutput<'BOOLEAN', 1>,
      }
      interface ImpactIfNone_input {
          signal?: Comfy.Input.$Star
          any_input?: Comfy.Input.$Star
      }
      interface ImpactConvertDataType extends HasSingle_STRING, HasSingle_FLOAT, HasSingle_INT, HasSingle_BOOLEAN, ComfyNode<ImpactConvertDataType_input, ImpactConvertDataType_output> {
          nameInComfy: "ImpactConvertDataType"
      }
      interface ImpactConvertDataType_output {
          STRING: ComfyNodeOutput<'STRING', 0>,
          FLOAT: ComfyNodeOutput<'FLOAT', 1>,
          INT: ComfyNodeOutput<'INT', 2>,
          BOOLEAN: ComfyNodeOutput<'BOOLEAN', 3>,
      }
      interface ImpactConvertDataType_input {
          value: Comfy.Input.$Star
      }
      interface ImpactLogicalOperators extends HasSingle_BOOLEAN, ComfyNode<ImpactLogicalOperators_input, ImpactLogicalOperators_output> {
          nameInComfy: "ImpactLogicalOperators"
      }
      interface ImpactLogicalOperators_output {
          BOOLEAN: ComfyNodeOutput<'BOOLEAN', 0>,
      }
      interface ImpactLogicalOperators_input {
          operator: Comfy.Union.E_99d83eba8f2a90cc88da26295981d92d458e4e14
          /** */
          bool_a: Comfy.Input.BOOLEAN
          /** */
          bool_b: Comfy.Input.BOOLEAN
      }
      interface ImpactInt extends HasSingle_INT, ComfyNode<ImpactInt_input, ImpactInt_output> {
          nameInComfy: "ImpactInt"
      }
      interface ImpactInt_output {
          INT: ComfyNodeOutput<'INT', 0>,
      }
      interface ImpactInt_input {
          /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
          value?: Comfy.Input.INT
      }
      interface ImpactFloat extends HasSingle_FLOAT, ComfyNode<ImpactFloat_input, ImpactFloat_output> {
          nameInComfy: "ImpactFloat"
      }
      interface ImpactFloat_output {
          FLOAT: ComfyNodeOutput<'FLOAT', 0>,
      }
      interface ImpactFloat_input {
          /** default=1 min=3.402823466e+38 max=3.402823466e+38 */
          value?: Comfy.Input.FLOAT
      }
      interface ImpactBoolean extends HasSingle_BOOLEAN, ComfyNode<ImpactBoolean_input, ImpactBoolean_output> {
          nameInComfy: "ImpactBoolean"
      }
      interface ImpactBoolean_output {
          BOOLEAN: ComfyNodeOutput<'BOOLEAN', 0>,
      }
      interface ImpactBoolean_input {
          /** default=false */
          value?: Comfy.Input.BOOLEAN
      }
      interface ImpactValueSender extends HasSingle_$Star, ComfyNode<ImpactValueSender_input, ImpactValueSender_output> {
          nameInComfy: "ImpactValueSender"
      }
      interface ImpactValueSender_output {
          signal: ComfyNodeOutput<'$Star', 0>,
      }
      interface ImpactValueSender_input {
          value: Comfy.Input.$Star
          /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
          link_id?: Comfy.Input.INT
          signal_opt?: Comfy.Input.$Star
      }
      interface ImpactValueReceiver extends HasSingle_$Star, ComfyNode<ImpactValueReceiver_input, ImpactValueReceiver_output> {
          nameInComfy: "ImpactValueReceiver"
      }
      interface ImpactValueReceiver_output {
          "$Star": ComfyNodeOutput<'$Star', 0>,
      }
      interface ImpactValueReceiver_input {
          typ: Comfy.Union.E_6c86e4efdc8db8dae17215fbf80825ddaad06ffa
          /** default="" */
          value?: Comfy.Input.STRING
          /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
          link_id?: Comfy.Input.INT
      }
      interface ImpactImageInfo extends ComfyNode<ImpactImageInfo_input, ImpactImageInfo_output> {
          nameInComfy: "ImpactImageInfo"
      }
      interface ImpactImageInfo_output {
          batch: ComfyNodeOutput<'INT', 0>,
          height: ComfyNodeOutput<'INT', 1>,
          width: ComfyNodeOutput<'INT', 2>,
          channel: ComfyNodeOutput<'INT', 3>,
      }
      interface ImpactImageInfo_input {
          value: Comfy.Input.IMAGE
      }
      interface ImpactLatentInfo extends ComfyNode<ImpactLatentInfo_input, ImpactLatentInfo_output> {
          nameInComfy: "ImpactLatentInfo"
      }
      interface ImpactLatentInfo_output {
          batch: ComfyNodeOutput<'INT', 0>,
          height: ComfyNodeOutput<'INT', 1>,
          width: ComfyNodeOutput<'INT', 2>,
          channel: ComfyNodeOutput<'INT', 3>,
      }
      interface ImpactLatentInfo_input {
          value: Comfy.Input.LATENT
      }
      interface ImpactMinMax extends HasSingle_INT, ComfyNode<ImpactMinMax_input, ImpactMinMax_output> {
          nameInComfy: "ImpactMinMax"
      }
      interface ImpactMinMax_output {
          INT: ComfyNodeOutput<'INT', 0>,
      }
      interface ImpactMinMax_input {
          /** default=true */
          mode?: Comfy.Input.BOOLEAN
          a: Comfy.Input.$Star
          b: Comfy.Input.$Star
      }
      interface ImpactNeg extends HasSingle_BOOLEAN, ComfyNode<ImpactNeg_input, ImpactNeg_output> {
          nameInComfy: "ImpactNeg"
      }
      interface ImpactNeg_output {
          BOOLEAN: ComfyNodeOutput<'BOOLEAN', 0>,
      }
      interface ImpactNeg_input {
          /** */
          value: Comfy.Input.BOOLEAN
      }
      interface ImpactConditionalStopIteration extends ComfyNode<ImpactConditionalStopIteration_input, ImpactConditionalStopIteration_output> {
          nameInComfy: "ImpactConditionalStopIteration"
      }
      interface ImpactConditionalStopIteration_output {
      }
      interface ImpactConditionalStopIteration_input {
          /** */
          cond: Comfy.Input.BOOLEAN
      }
      interface ImpactStringSelector extends HasSingle_STRING, ComfyNode<ImpactStringSelector_input, ImpactStringSelector_output> {
          nameInComfy: "ImpactStringSelector"
      }
      interface ImpactStringSelector_output {
          STRING: ComfyNodeOutput<'STRING', 0>,
      }
      interface ImpactStringSelector_input {
          /** */
          strings: Comfy.Input.STRING
          /** default=false */
          multiline?: Comfy.Input.BOOLEAN
          /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
          select?: Comfy.Input.INT
      }
      interface StringListToString extends HasSingle_STRING, ComfyNode<StringListToString_input, StringListToString_output> {
          nameInComfy: "StringListToString"
      }
      interface StringListToString_output {
          STRING: ComfyNodeOutput<'STRING', 0>,
      }
      interface StringListToString_input {
          /** default="\\n" */
          join_with?: Comfy.Input.STRING
          /** */
          string_list: Comfy.Input.STRING
      }
      interface WildcardPromptFromString extends ComfyNode<WildcardPromptFromString_input, WildcardPromptFromString_output> {
          nameInComfy: "WildcardPromptFromString"
      }
      interface WildcardPromptFromString_output {
          wildcard: ComfyNodeOutput<'STRING', 0>,
          segs_labels: ComfyNodeOutput<'STRING', 1>,
      }
      interface WildcardPromptFromString_input {
          /** */
          string: Comfy.Input.STRING
          /** default="\\n" */
          delimiter?: Comfy.Input.STRING
          /** */
          prefix_all: Comfy.Input.STRING
          /** */
          postfix_all: Comfy.Input.STRING
          /** */
          restrict_to_tags: Comfy.Input.STRING
          /** */
          exclude_tags: Comfy.Input.STRING
      }
      interface ImpactExecutionOrderController extends ComfyNode<ImpactExecutionOrderController_input, ImpactExecutionOrderController_output> {
          nameInComfy: "ImpactExecutionOrderController"
      }
      interface ImpactExecutionOrderController_output {
          signal: ComfyNodeOutput<'$Star', 0>,
          value: ComfyNodeOutput<'$Star', 1>,
      }
      interface ImpactExecutionOrderController_input {
          signal: Comfy.Input.$Star
          value: Comfy.Input.$Star
      }
      interface RemoveNoiseMask extends HasSingle_LATENT, ComfyNode<RemoveNoiseMask_input, RemoveNoiseMask_output> {
          nameInComfy: "RemoveNoiseMask"
      }
      interface RemoveNoiseMask_output {
          LATENT: ComfyNodeOutput<'LATENT', 0>,
      }
      interface RemoveNoiseMask_input {
          samples: Comfy.Input.LATENT
      }
      interface ImpactLogger extends ComfyNode<ImpactLogger_input, ImpactLogger_output> {
          nameInComfy: "ImpactLogger"
      }
      interface ImpactLogger_output {
      }
      interface ImpactLogger_input {
          data: Comfy.Input.$Star
          /** */
          text: Comfy.Input.STRING
      }
      interface ImpactDummyInput extends HasSingle_$Star, ComfyNode<ImpactDummyInput_input, ImpactDummyInput_output> {
          nameInComfy: "ImpactDummyInput"
      }
      interface ImpactDummyInput_output {
          "$Star": ComfyNodeOutput<'$Star', 0>,
      }
      interface ImpactDummyInput_input {
      }
      interface ImpactQueueTrigger extends HasSingle_$Star, ComfyNode<ImpactQueueTrigger_input, ImpactQueueTrigger_output> {
          nameInComfy: "ImpactQueueTrigger"
      }
      interface ImpactQueueTrigger_output {
          signal_opt: ComfyNodeOutput<'$Star', 0>,
      }
      interface ImpactQueueTrigger_input {
          signal: Comfy.Input.$Star
          /** default=true */
          mode?: Comfy.Input.BOOLEAN
      }
      interface ImpactQueueTriggerCountdown extends HasSingle_$Star, ComfyNode<ImpactQueueTriggerCountdown_input, ImpactQueueTriggerCountdown_output> {
          nameInComfy: "ImpactQueueTriggerCountdown"
      }
      interface ImpactQueueTriggerCountdown_output {
          signal_opt: ComfyNodeOutput<'$Star', 0>,
          count: ComfyNodeOutput<'INT', 1>,
          total: ComfyNodeOutput<'INT', 2>,
      }
      interface ImpactQueueTriggerCountdown_input {
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          count?: Comfy.Input.INT
          /** default=10 min=18446744073709552000 max=18446744073709552000 */
          total?: Comfy.Input.INT
          /** default=true */
          mode?: Comfy.Input.BOOLEAN
          signal?: Comfy.Input.$Star
      }
      interface ImpactSetWidgetValue extends HasSingle_$Star, ComfyNode<ImpactSetWidgetValue_input, ImpactSetWidgetValue_output> {
          nameInComfy: "ImpactSetWidgetValue"
      }
      interface ImpactSetWidgetValue_output {
          signal_opt: ComfyNodeOutput<'$Star', 0>,
      }
      interface ImpactSetWidgetValue_input {
          signal: Comfy.Input.$Star
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          node_id?: Comfy.Input.INT
          /** */
          widget_name: Comfy.Input.STRING
          /** */
          boolean_value?: Comfy.Input.BOOLEAN
          /** */
          int_value?: Comfy.Input.INT
          /** */
          float_value?: Comfy.Input.FLOAT
          /** */
          string_value?: Comfy.Input.STRING
      }
      interface ImpactNodeSetMuteState extends HasSingle_$Star, ComfyNode<ImpactNodeSetMuteState_input, ImpactNodeSetMuteState_output> {
          nameInComfy: "ImpactNodeSetMuteState"
      }
      interface ImpactNodeSetMuteState_output {
          signal_opt: ComfyNodeOutput<'$Star', 0>,
      }
      interface ImpactNodeSetMuteState_input {
          signal: Comfy.Input.$Star
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          node_id?: Comfy.Input.INT
          /** default=true */
          set_state?: Comfy.Input.BOOLEAN
      }
      interface ImpactControlBridge extends HasSingle_$Star, ComfyNode<ImpactControlBridge_input, ImpactControlBridge_output> {
          nameInComfy: "ImpactControlBridge"
      }
      interface ImpactControlBridge_output {
          value: ComfyNodeOutput<'$Star', 0>,
      }
      interface ImpactControlBridge_input {
          value: Comfy.Input.$Star
          /** default=true */
          mode?: Comfy.Input.BOOLEAN
          behavior: Comfy.Union.E_383642e8f2544ff8678e350c4f1049624ad6589e
      }
      interface ImpactIsNotEmptySEGS extends HasSingle_BOOLEAN, ComfyNode<ImpactIsNotEmptySEGS_input, ImpactIsNotEmptySEGS_output> {
          nameInComfy: "ImpactIsNotEmptySEGS"
      }
      interface ImpactIsNotEmptySEGS_output {
          BOOLEAN: ComfyNodeOutput<'BOOLEAN', 0>,
      }
      interface ImpactIsNotEmptySEGS_input {
          segs: Comfy.Input.SEGS
      }
      interface ImpactSleep extends HasSingle_$Star, ComfyNode<ImpactSleep_input, ImpactSleep_output> {
          nameInComfy: "ImpactSleep"
      }
      interface ImpactSleep_output {
          signal_opt: ComfyNodeOutput<'$Star', 0>,
      }
      interface ImpactSleep_input {
          signal: Comfy.Input.$Star
          /** default=0.5 min=3600 max=3600 */
          seconds?: Comfy.Input.FLOAT
      }
      interface ImpactRemoteBoolean extends ComfyNode<ImpactRemoteBoolean_input, ImpactRemoteBoolean_output> {
          nameInComfy: "ImpactRemoteBoolean"
      }
      interface ImpactRemoteBoolean_output {
      }
      interface ImpactRemoteBoolean_input {
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          node_id?: Comfy.Input.INT
          /** */
          widget_name: Comfy.Input.STRING
          /** default=true */
          value?: Comfy.Input.BOOLEAN
      }
      interface ImpactRemoteInt extends ComfyNode<ImpactRemoteInt_input, ImpactRemoteInt_output> {
          nameInComfy: "ImpactRemoteInt"
      }
      interface ImpactRemoteInt_output {
      }
      interface ImpactRemoteInt_input {
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          node_id?: Comfy.Input.INT
          /** */
          widget_name: Comfy.Input.STRING
          /** default=0 min=18446744073709552000 max=18446744073709552000 */
          value?: Comfy.Input.INT
      }
      interface ImpactHFTransformersClassifierProvider extends HasSingle_TRANSFORMERS_CLASSIFIER, ComfyNode<ImpactHFTransformersClassifierProvider_input, ImpactHFTransformersClassifierProvider_output> {
          nameInComfy: "ImpactHFTransformersClassifierProvider"
      }
      interface ImpactHFTransformersClassifierProvider_output {
          TRANSFORMERS_CLASSIFIER: ComfyNodeOutput<'TRANSFORMERS_CLASSIFIER', 0>,
      }
      interface ImpactHFTransformersClassifierProvider_input {
          preset_repo_id: Comfy.Union.E_7fd75955db2b2e81b87d8452255b37c2d98fd105
          /** */
          manual_repo_id: Comfy.Input.STRING
          device_mode: Comfy.Union.E_2ad445b99254e9b51c963d9f1a75fabe3d01e569
      }
      interface ImpactSEGSClassify extends HasSingle_STRING, ComfyNode<ImpactSEGSClassify_input, ImpactSEGSClassify_output> {
          nameInComfy: "ImpactSEGSClassify"
      }
      interface ImpactSEGSClassify_output {
          filtered_SEGS: ComfyNodeOutput<'SEGS', 0>,
          remained_SEGS: ComfyNodeOutput<'SEGS', 1>,
          detected_labels: ComfyNodeOutput<'STRING', 2>,
      }
      interface ImpactSEGSClassify_input {
          classifier: Comfy.Input.TRANSFORMERS_CLASSIFIER
          segs: Comfy.Input.SEGS
          preset_expr: Comfy.Union.E_01400d675e59295302197d02289e89ead401098e
          /** */
          manual_expr: Comfy.Input.STRING
          ref_image_opt?: Comfy.Input.IMAGE
      }
      interface ImpactSchedulerAdapter extends HasSingle_E_720061fdb15e8c451b6aa7ed023644f064ddc57d, ComfyNode<ImpactSchedulerAdapter_input, ImpactSchedulerAdapter_output> {
          nameInComfy: "ImpactSchedulerAdapter"
      }
      interface ImpactSchedulerAdapter_output {
          scheduler: ComfyNodeOutput<'E_720061fdb15e8c451b6aa7ed023644f064ddc57d', 0>,
      }
      interface ImpactSchedulerAdapter_input {
          /** */
          scheduler: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325
          extra_scheduler: Comfy.Union.E_64bb9134d159ff7e3f573facb7cb2fcfbb2de483
      }
      interface GITSSchedulerFuncProvider extends HasSingle_SCHEDULER_FUNC, ComfyNode<GITSSchedulerFuncProvider_input, GITSSchedulerFuncProvider_output> {
          nameInComfy: "GITSSchedulerFuncProvider"
      }
      interface GITSSchedulerFuncProvider_output {
          SCHEDULER_FUNC: ComfyNodeOutput<'SCHEDULER_FUNC', 0>,
      }
      interface GITSSchedulerFuncProvider_input {
          /** default=1.2 min=1.5 max=1.5 step=0.05 */
          coeff?: Comfy.Input.FLOAT
          /** default=1 min=1 max=1 step=0.01 */
          denoise?: Comfy.Input.FLOAT
      }
      interface UltralyticsDetectorProvider extends HasSingle_BBOX_DETECTOR, HasSingle_SEGM_DETECTOR, ComfyNode<UltralyticsDetectorProvider_input, UltralyticsDetectorProvider_output> {
          nameInComfy: "UltralyticsDetectorProvider"
      }
      interface UltralyticsDetectorProvider_output {
          BBOX_DETECTOR: ComfyNodeOutput<'BBOX_DETECTOR', 0>,
          SEGM_DETECTOR: ComfyNodeOutput<'SEGM_DETECTOR', 1>,
      }
      interface UltralyticsDetectorProvider_input {
          model_name: Comfy.Union.E_cf11746957b2cb2b6379bbd08fe59610b2aae90a
      }
   }
   // #region 1. Enums
   namespace Comfy {
      export interface Enums {
          "Comfy.Base.KSampler.input.sampler_name": { $Name: "Comfy.Base.KSampler.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Base.KSamplerAdvanced.input.sampler_name": { $Name: "Comfy.Base.KSamplerAdvanced.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Extra.custom_sampler.KSamplerSelect.input.sampler_name": { $Name: "Comfy.Extra.custom_sampler.KSamplerSelect.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.DetailerForEach.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.DetailerForEach.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.DetailerForEachDebug.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.DetailerForEachDebug.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.DetailerForEachPipe.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.DetailerForEachPipe.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.DetailerForEachDebugPipe.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.DetailerForEachDebugPipe.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.DetailerForEachPipeForAnimateDiff.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.DetailerForEachPipeForAnimateDiff.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.FaceDetailer.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.FaceDetailer.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.FaceDetailerPipe.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.FaceDetailerPipe.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.MaskDetailerPipe.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.MaskDetailerPipe.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.PixelKSampleUpscalerProvider.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.PixelKSampleUpscalerProvider.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.PixelKSampleUpscalerProviderPipe.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.PixelKSampleUpscalerProviderPipe.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProvider.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProvider.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProviderPipe.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProviderPipe.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.UnsamplerHookProvider.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.UnsamplerHookProvider.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.UnsamplerDetailerHookProvider.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.UnsamplerDetailerHookProvider.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.KSamplerProvider.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.KSamplerProvider.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.TiledKSamplerProvider.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.TiledKSamplerProvider.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.KSamplerAdvancedProvider.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.KSamplerAdvancedProvider.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.SEGSUpscaler.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.SEGSUpscaler.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.SEGSUpscalerPipe.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.SEGSUpscalerPipe.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.SEGSDetailer.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.SEGSDetailer.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.SEGSDetailerForAnimateDiff.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.SEGSDetailerForAnimateDiff.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.ImpactKSamplerBasicPipe.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.ImpactKSamplerBasicPipe.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Custom.Impact_Pack.ImpactKSamplerAdvancedBasicPipe.input.sampler_name": { $Name: "Comfy.Custom.Impact_Pack.ImpactKSamplerAdvancedBasicPipe.input.sampler_name", $Value: Comfy.Union.E_26c34bf761d4be4554ab944105c5a3c017c99453 },
          "Comfy.Base.KSampler.input.scheduler": { $Name: "Comfy.Base.KSampler.input.scheduler", $Value: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325 },
          "Comfy.Base.KSamplerAdvanced.input.scheduler": { $Name: "Comfy.Base.KSamplerAdvanced.input.scheduler", $Value: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325 },
          "Comfy.Extra.custom_sampler.BasicScheduler.input.scheduler": { $Name: "Comfy.Extra.custom_sampler.BasicScheduler.input.scheduler", $Value: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325 },
          "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProvider.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProvider.input.scheduler", $Value: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325 },
          "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProviderPipe.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProviderPipe.input.scheduler", $Value: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325 },
          "Comfy.Custom.Impact_Pack.UnsamplerHookProvider.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.UnsamplerHookProvider.input.scheduler", $Value: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325 },
          "Comfy.Custom.Impact_Pack.UnsamplerDetailerHookProvider.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.UnsamplerDetailerHookProvider.input.scheduler", $Value: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325 },
          "Comfy.Custom.Impact_Pack.TiledKSamplerProvider.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.TiledKSamplerProvider.input.scheduler", $Value: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325 },
          "Comfy.Custom.Impact_Pack.ImpactSchedulerAdapter.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.ImpactSchedulerAdapter.input.scheduler", $Value: Comfy.Union.E_5f9267c2d2054f64bc3de0d20b47cf75f7038325 },
          "Comfy.Base.CheckpointLoaderSimple.input.ckpt_name": { $Name: "Comfy.Base.CheckpointLoaderSimple.input.ckpt_name", $Value: Comfy.Union.E_1f08f73a9a576ae570aa3d82ea94f2bcfc29a8fc },
          "Comfy.Base.unCLIPCheckpointLoader.input.ckpt_name": { $Name: "Comfy.Base.unCLIPCheckpointLoader.input.ckpt_name", $Value: Comfy.Union.E_1f08f73a9a576ae570aa3d82ea94f2bcfc29a8fc },
          "Comfy.Base.CheckpointLoader.input.ckpt_name": { $Name: "Comfy.Base.CheckpointLoader.input.ckpt_name", $Value: Comfy.Union.E_1f08f73a9a576ae570aa3d82ea94f2bcfc29a8fc },
          "Comfy.Extra.video_model.ImageOnlyCheckpointLoader.input.ckpt_name": { $Name: "Comfy.Extra.video_model.ImageOnlyCheckpointLoader.input.ckpt_name", $Value: Comfy.Union.E_1f08f73a9a576ae570aa3d82ea94f2bcfc29a8fc },
          "Comfy.Base.VAELoader.input.vae_name": { $Name: "Comfy.Base.VAELoader.input.vae_name", $Value: Comfy.Union.E_621a1d2d13812defa70c4b6ec953d17713bd232a },
          "Comfy.Base.LatentUpscale.input.upscale_method": { $Name: "Comfy.Base.LatentUpscale.input.upscale_method", $Value: Comfy.Union.E_6e6cbf6c48411ad480e010b0c9d2434b41af430d },
          "Comfy.Base.LatentUpscaleBy.input.upscale_method": { $Name: "Comfy.Base.LatentUpscaleBy.input.upscale_method", $Value: Comfy.Union.E_6e6cbf6c48411ad480e010b0c9d2434b41af430d },
          "Comfy.Extra.model_downscale.PatchModelAddDownscale.input.downscale_method": { $Name: "Comfy.Extra.model_downscale.PatchModelAddDownscale.input.downscale_method", $Value: Comfy.Union.E_6e6cbf6c48411ad480e010b0c9d2434b41af430d },
          "Comfy.Extra.model_downscale.PatchModelAddDownscale.input.upscale_method": { $Name: "Comfy.Extra.model_downscale.PatchModelAddDownscale.input.upscale_method", $Value: Comfy.Union.E_6e6cbf6c48411ad480e010b0c9d2434b41af430d },
          "Comfy.Extra.advanced_samplers.SamplerLCMUpscale.input.upscale_method": { $Name: "Comfy.Extra.advanced_samplers.SamplerLCMUpscale.input.upscale_method", $Value: Comfy.Union.E_6e6cbf6c48411ad480e010b0c9d2434b41af430d },
          "Comfy.Base.LatentUpscale.input.crop": { $Name: "Comfy.Base.LatentUpscale.input.crop", $Value: Comfy.Union.E_e2779c2a162ed54d5841127cc2968e8d50f5e431 },
          "Comfy.Base.ImageScale.input.crop": { $Name: "Comfy.Base.ImageScale.input.crop", $Value: Comfy.Union.E_e2779c2a162ed54d5841127cc2968e8d50f5e431 },
          "Comfy.Base.LoadImage.input.image": { $Name: "Comfy.Base.LoadImage.input.image", $Value: Comfy.Union.E_26ea5ad8c44c9551fea858fff18017427386b591 },
          "Comfy.Base.LoadImageMask.input.image": { $Name: "Comfy.Base.LoadImageMask.input.image", $Value: Comfy.Union.E_26ea5ad8c44c9551fea858fff18017427386b591 },
          "Comfy.Custom.Impact_Pack.ImageReceiver.input.image": { $Name: "Comfy.Custom.Impact_Pack.ImageReceiver.input.image", $Value: Comfy.Union.E_26ea5ad8c44c9551fea858fff18017427386b591 },
          "Comfy.Base.LoadImageMask.input.channel": { $Name: "Comfy.Base.LoadImageMask.input.channel", $Value: Comfy.Union.E_19d5be39f1fd20a88fdbcb009a06c7df2b0ef998 },
          "Comfy.Extra.mask.ImageToMask.input.channel": { $Name: "Comfy.Extra.mask.ImageToMask.input.channel", $Value: Comfy.Union.E_19d5be39f1fd20a88fdbcb009a06c7df2b0ef998 },
          "Comfy.Base.ImageScale.input.upscale_method": { $Name: "Comfy.Base.ImageScale.input.upscale_method", $Value: Comfy.Union.E_165b455eb22956fc9da6e1b76d49a4077f15d897 },
          "Comfy.Base.ImageScaleBy.input.upscale_method": { $Name: "Comfy.Base.ImageScaleBy.input.upscale_method", $Value: Comfy.Union.E_165b455eb22956fc9da6e1b76d49a4077f15d897 },
          "Comfy.Extra.post_processing.ImageScaleToTotalPixels.input.upscale_method": { $Name: "Comfy.Extra.post_processing.ImageScaleToTotalPixels.input.upscale_method", $Value: Comfy.Union.E_165b455eb22956fc9da6e1b76d49a4077f15d897 },
          "Comfy.Base.ConditioningSetMask.input.set_cond_area": { $Name: "Comfy.Base.ConditioningSetMask.input.set_cond_area", $Value: Comfy.Union.E_046ed3ef4b2b9a9cfdb62e53a70fe767fb996451 },
          "Comfy.Base.KSamplerAdvanced.input.add_noise": { $Name: "Comfy.Base.KSamplerAdvanced.input.add_noise", $Value: Comfy.Union.E_449b4cae3566dd9b97c417c352bb08e25b89431b },
          "Comfy.Base.KSamplerAdvanced.input.return_with_leftover_noise": { $Name: "Comfy.Base.KSamplerAdvanced.input.return_with_leftover_noise", $Value: Comfy.Union.E_449b4cae3566dd9b97c417c352bb08e25b89431b },
          "Comfy.Custom.Impact_Pack.UnsamplerHookProvider.input.normalize": { $Name: "Comfy.Custom.Impact_Pack.UnsamplerHookProvider.input.normalize", $Value: Comfy.Union.E_449b4cae3566dd9b97c417c352bb08e25b89431b },
          "Comfy.Custom.Impact_Pack.UnsamplerDetailerHookProvider.input.normalize": { $Name: "Comfy.Custom.Impact_Pack.UnsamplerDetailerHookProvider.input.normalize", $Value: Comfy.Union.E_449b4cae3566dd9b97c417c352bb08e25b89431b },
          "Comfy.Base.LatentRotate.input.rotation": { $Name: "Comfy.Base.LatentRotate.input.rotation", $Value: Comfy.Union.E_061551528c540e0171a9c88a94c7d5375aa31f8a },
          "Comfy.Base.LatentFlip.input.flip_method": { $Name: "Comfy.Base.LatentFlip.input.flip_method", $Value: Comfy.Union.E_cdf7071acecb5016da941b6e718b82c97248a3e4 },
          "Comfy.Base.LoraLoader.input.lora_name": { $Name: "Comfy.Base.LoraLoader.input.lora_name", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Base.CLIPLoader.input.clip_name": { $Name: "Comfy.Base.CLIPLoader.input.clip_name", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Base.UNETLoader.input.unet_name": { $Name: "Comfy.Base.UNETLoader.input.unet_name", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Base.DualCLIPLoader.input.clip_name1": { $Name: "Comfy.Base.DualCLIPLoader.input.clip_name1", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Base.DualCLIPLoader.input.clip_name2": { $Name: "Comfy.Base.DualCLIPLoader.input.clip_name2", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Base.ControlNetLoader.input.control_net_name": { $Name: "Comfy.Base.ControlNetLoader.input.control_net_name", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Base.DiffControlNetLoader.input.control_net_name": { $Name: "Comfy.Base.DiffControlNetLoader.input.control_net_name", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Base.StyleModelLoader.input.style_model_name": { $Name: "Comfy.Base.StyleModelLoader.input.style_model_name", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Base.CLIPVisionLoader.input.clip_name": { $Name: "Comfy.Base.CLIPVisionLoader.input.clip_name", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Base.GLIGENLoader.input.gligen_name": { $Name: "Comfy.Base.GLIGENLoader.input.gligen_name", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Base.DiffusersLoader.input.model_path": { $Name: "Comfy.Base.DiffusersLoader.input.model_path", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Base.LoadLatent.input.latent": { $Name: "Comfy.Base.LoadLatent.input.latent", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Base.LoraLoaderModelOnly.input.lora_name": { $Name: "Comfy.Base.LoraLoaderModelOnly.input.lora_name", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Extra.hypernetwork.HypernetworkLoader.input.hypernetwork_name": { $Name: "Comfy.Extra.hypernetwork.HypernetworkLoader.input.hypernetwork_name", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Extra.photomaker.PhotoMakerLoader.input.photomaker_model_name": { $Name: "Comfy.Extra.photomaker.PhotoMakerLoader.input.photomaker_model_name", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Extra.audio.LoadAudio.input.audio": { $Name: "Comfy.Extra.audio.LoadAudio.input.audio", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Extra.sd3.TripleCLIPLoader.input.clip_name1": { $Name: "Comfy.Extra.sd3.TripleCLIPLoader.input.clip_name1", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Extra.sd3.TripleCLIPLoader.input.clip_name2": { $Name: "Comfy.Extra.sd3.TripleCLIPLoader.input.clip_name2", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Extra.sd3.TripleCLIPLoader.input.clip_name3": { $Name: "Comfy.Extra.sd3.TripleCLIPLoader.input.clip_name3", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Custom.Impact_Pack.ONNXDetectorProvider.input.model_name": { $Name: "Comfy.Custom.Impact_Pack.ONNXDetectorProvider.input.model_name", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Custom.Impact_Pack.LatentReceiver.input.latent": { $Name: "Comfy.Custom.Impact_Pack.LatentReceiver.input.latent", $Value: Comfy.Union.E_779f30207c92fb9c40d7af879864067c0972d190 },
          "Comfy.Base.CLIPLoader.input.type": { $Name: "Comfy.Base.CLIPLoader.input.type", $Value: Comfy.Union.E_766fb79b4f3904a6716246cfb2a33b7b9e6a08c4 },
          "Comfy.Base.UNETLoader.input.weight_dtype": { $Name: "Comfy.Base.UNETLoader.input.weight_dtype", $Value: Comfy.Union.E_21ba65fbb0df707c108b25356a3507e13f21ea58 },
          "Comfy.Base.DualCLIPLoader.input.type": { $Name: "Comfy.Base.DualCLIPLoader.input.type", $Value: Comfy.Union.E_39292df8ce88fd66f0dacf6f9110cfa2594ca25c },
          "Comfy.Base.CheckpointLoader.input.config_name": { $Name: "Comfy.Base.CheckpointLoader.input.config_name", $Value: Comfy.Union.E_a1972c9480c542a0e8ccafa03c2572ba5fc62160 },
          "Comfy.Extra.latent.LatentBatchSeedBehavior.input.seed_behavior": { $Name: "Comfy.Extra.latent.LatentBatchSeedBehavior.input.seed_behavior", $Value: Comfy.Union.E_1d09df0c3ce1b4556d07af26e593d4033efc639b },
          "Comfy.Extra.upscale_model.UpscaleModelLoader.input.model_name": { $Name: "Comfy.Extra.upscale_model.UpscaleModelLoader.input.model_name", $Value: Comfy.Union.E_2504d8563e078c3ed105667cbb6d0ff714d5798b },
          "Comfy.Extra.post_processing.ImageBlend.input.blend_mode": { $Name: "Comfy.Extra.post_processing.ImageBlend.input.blend_mode", $Value: Comfy.Union.E_4ca09d2bc16d4174960bd60a103d4c0911361855 },
          "Comfy.Extra.post_processing.ImageQuantize.input.dither": { $Name: "Comfy.Extra.post_processing.ImageQuantize.input.dither", $Value: Comfy.Union.E_7c2feaebcf0bbbcda0fe9f3c8cba1cf87002bc0e },
          "Comfy.Extra.mask.MaskComposite.input.operation": { $Name: "Comfy.Extra.mask.MaskComposite.input.operation", $Value: Comfy.Union.E_88c0c90dbad3b41c3c4a4f8a89afad7b1c0db2e0 },
          "Comfy.Extra.compositing.PorterDuffImageComposite.input.mode": { $Name: "Comfy.Extra.compositing.PorterDuffImageComposite.input.mode", $Value: Comfy.Union.E_d954b5ae44db00529f0fd0bfb816e25c12617df8 },
          "Comfy.Extra.custom_sampler.SamplerDPMPP$_3M$_SDE.input.noise_device": { $Name: "Comfy.Extra.custom_sampler.SamplerDPMPP$_3M$_SDE.input.noise_device", $Value: Comfy.Union.E_928b7403128cb25513cafc463a76a922ba5d4bd0 },
          "Comfy.Extra.custom_sampler.SamplerDPMPP$_2M$_SDE.input.noise_device": { $Name: "Comfy.Extra.custom_sampler.SamplerDPMPP$_2M$_SDE.input.noise_device", $Value: Comfy.Union.E_928b7403128cb25513cafc463a76a922ba5d4bd0 },
          "Comfy.Extra.custom_sampler.SamplerDPMPP$_SDE.input.noise_device": { $Name: "Comfy.Extra.custom_sampler.SamplerDPMPP$_SDE.input.noise_device", $Value: Comfy.Union.E_928b7403128cb25513cafc463a76a922ba5d4bd0 },
          "Comfy.Extra.custom_sampler.SamplerDPMPP$_2M$_SDE.input.solver_type": { $Name: "Comfy.Extra.custom_sampler.SamplerDPMPP$_2M$_SDE.input.solver_type", $Value: Comfy.Union.E_148e0bc88719e23ec2f2c80871fe45ae759cd7e1 },
          "Comfy.Extra.model_advanced.ModelSamplingDiscrete.input.sampling": { $Name: "Comfy.Extra.model_advanced.ModelSamplingDiscrete.input.sampling", $Value: Comfy.Union.E_e89ec78e24ca5e9c91264b9e9b5ed722d2b509dc },
          "Comfy.Extra.model_advanced.ModelSamplingContinuousEDM.input.sampling": { $Name: "Comfy.Extra.model_advanced.ModelSamplingContinuousEDM.input.sampling", $Value: Comfy.Union.E_bf8a83a3d55d70c688644bf18edaf23501f7c168 },
          "Comfy.Extra.model_advanced.ModelSamplingContinuousV.input.sampling": { $Name: "Comfy.Extra.model_advanced.ModelSamplingContinuousV.input.sampling", $Value: Comfy.Union.E_3c3164c6c468d61dfa20092960e3d7854495e50c },
          "Comfy.Extra.images.SaveAnimatedWEBP.input.method": { $Name: "Comfy.Extra.images.SaveAnimatedWEBP.input.method", $Value: Comfy.Union.E_253b68425542d8144b2b8a7af90f057b41939f63 },
          "Comfy.Extra.morphology.Morphology.input.operation": { $Name: "Comfy.Extra.morphology.Morphology.input.operation", $Value: Comfy.Union.E_6ba03252ec9c8111f7381dfb573cd99c2b4d0e3b },
          "Comfy.Extra.align_your_steps.AlignYourStepsScheduler.input.model_type": { $Name: "Comfy.Extra.align_your_steps.AlignYourStepsScheduler.input.model_type", $Value: Comfy.Union.E_ec317371192386ae10cedaee29b315e900386a18 },
          "Comfy.Extra.advanced_samplers.SamplerEulerCFGpp.input.version": { $Name: "Comfy.Extra.advanced_samplers.SamplerEulerCFGpp.input.version", $Value: Comfy.Union.E_a8aa5eb2d828c2e279168c48955c7a0fe3ea011a },
          "Comfy.Extra.sd3.CLIPTextEncodeSD3.input.empty_padding": { $Name: "Comfy.Extra.sd3.CLIPTextEncodeSD3.input.empty_padding", $Value: Comfy.Union.E_270e152a81c37daf152e6cc67675baaafe058bc4 },
          "Comfy.Extra.controlnet.SetUnionControlNetType.input.type": { $Name: "Comfy.Extra.controlnet.SetUnionControlNetType.input.type", $Value: Comfy.Union.E_0e92c8b1b6fe90c3e343d8b54b531b9d887eee62 },
          "Comfy.Extra.lora_extract.LoraSave.input.lora_type": { $Name: "Comfy.Extra.lora_extract.LoraSave.input.lora_type", $Value: Comfy.Union.E_b80b6129a942660e31e08221ee04a76f537556ce },
          "Comfy.Extra.torch_compile.TorchCompileModel.input.backend": { $Name: "Comfy.Extra.torch_compile.TorchCompileModel.input.backend", $Value: Comfy.Union.E_4bbca93e426c35d56c43252f1fb21877d5e7a1aa },
          "Comfy.Custom.Impact_Pack.SAMLoader.input.model_name": { $Name: "Comfy.Custom.Impact_Pack.SAMLoader.input.model_name", $Value: Comfy.Union.E_40c777392f92d61852ab0f7a429a755abf59b71a },
          "Comfy.Custom.Impact_Pack.SAMLoader.input.device_mode": { $Name: "Comfy.Custom.Impact_Pack.SAMLoader.input.device_mode", $Value: Comfy.Union.E_2ad445b99254e9b51c963d9f1a75fabe3d01e569 },
          "Comfy.Custom.Impact_Pack.ImpactHFTransformersClassifierProvider.input.device_mode": { $Name: "Comfy.Custom.Impact_Pack.ImpactHFTransformersClassifierProvider.input.device_mode", $Value: Comfy.Union.E_2ad445b99254e9b51c963d9f1a75fabe3d01e569 },
          "Comfy.Custom.Impact_Pack.DetailerForEach.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.DetailerForEach.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.DetailerForEachDebug.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.DetailerForEachDebug.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.DetailerForEachPipe.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.DetailerForEachPipe.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.DetailerForEachDebugPipe.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.DetailerForEachDebugPipe.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.DetailerForEachPipeForAnimateDiff.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.DetailerForEachPipeForAnimateDiff.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.FaceDetailer.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.FaceDetailer.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.FaceDetailerPipe.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.FaceDetailerPipe.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.MaskDetailerPipe.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.MaskDetailerPipe.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.PixelKSampleUpscalerProvider.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.PixelKSampleUpscalerProvider.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.PixelKSampleUpscalerProviderPipe.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.PixelKSampleUpscalerProviderPipe.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.KSamplerProvider.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.KSamplerProvider.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.KSamplerAdvancedProvider.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.KSamplerAdvancedProvider.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.SEGSUpscaler.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.SEGSUpscaler.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.SEGSUpscalerPipe.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.SEGSUpscalerPipe.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.SEGSDetailer.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.SEGSDetailer.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.SEGSDetailerForAnimateDiff.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.SEGSDetailerForAnimateDiff.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.ImpactKSamplerBasicPipe.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.ImpactKSamplerBasicPipe.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.ImpactKSamplerAdvancedBasicPipe.input.scheduler": { $Name: "Comfy.Custom.Impact_Pack.ImpactKSamplerAdvancedBasicPipe.input.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.ImpactSchedulerAdapter.output.scheduler": { $Name: "Comfy.Custom.Impact_Pack.ImpactSchedulerAdapter.output.scheduler", $Value: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d },
          "Comfy.Custom.Impact_Pack.SAMDetectorCombined.input.detection_hint": { $Name: "Comfy.Custom.Impact_Pack.SAMDetectorCombined.input.detection_hint", $Value: Comfy.Union.E_40275a874822a8699ee13794e127b63cdd6bfdae },
          "Comfy.Custom.Impact_Pack.SAMDetectorSegmented.input.detection_hint": { $Name: "Comfy.Custom.Impact_Pack.SAMDetectorSegmented.input.detection_hint", $Value: Comfy.Union.E_40275a874822a8699ee13794e127b63cdd6bfdae },
          "Comfy.Custom.Impact_Pack.FaceDetailer.input.sam_detection_hint": { $Name: "Comfy.Custom.Impact_Pack.FaceDetailer.input.sam_detection_hint", $Value: Comfy.Union.E_40275a874822a8699ee13794e127b63cdd6bfdae },
          "Comfy.Custom.Impact_Pack.FaceDetailerPipe.input.sam_detection_hint": { $Name: "Comfy.Custom.Impact_Pack.FaceDetailerPipe.input.sam_detection_hint", $Value: Comfy.Union.E_40275a874822a8699ee13794e127b63cdd6bfdae },
          "Comfy.Custom.Impact_Pack.SAMDetectorCombined.input.mask_hint_use_negative": { $Name: "Comfy.Custom.Impact_Pack.SAMDetectorCombined.input.mask_hint_use_negative", $Value: Comfy.Union.E_aa302307a82588b6e514aca43e4cddad342a73fc },
          "Comfy.Custom.Impact_Pack.SAMDetectorSegmented.input.mask_hint_use_negative": { $Name: "Comfy.Custom.Impact_Pack.SAMDetectorSegmented.input.mask_hint_use_negative", $Value: Comfy.Union.E_aa302307a82588b6e514aca43e4cddad342a73fc },
          "Comfy.Custom.Impact_Pack.FaceDetailer.input.sam_mask_hint_use_negative": { $Name: "Comfy.Custom.Impact_Pack.FaceDetailer.input.sam_mask_hint_use_negative", $Value: Comfy.Union.E_aa302307a82588b6e514aca43e4cddad342a73fc },
          "Comfy.Custom.Impact_Pack.FaceDetailerPipe.input.sam_mask_hint_use_negative": { $Name: "Comfy.Custom.Impact_Pack.FaceDetailerPipe.input.sam_mask_hint_use_negative", $Value: Comfy.Union.E_aa302307a82588b6e514aca43e4cddad342a73fc },
          "Comfy.Custom.Impact_Pack.ToDetailerPipe.input.Select$_to$_add$_LoRA": { $Name: "Comfy.Custom.Impact_Pack.ToDetailerPipe.input.Select$_to$_add$_LoRA", $Value: Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df },
          "Comfy.Custom.Impact_Pack.ToDetailerPipeSDXL.input.Select$_to$_add$_LoRA": { $Name: "Comfy.Custom.Impact_Pack.ToDetailerPipeSDXL.input.Select$_to$_add$_LoRA", $Value: Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df },
          "Comfy.Custom.Impact_Pack.BasicPipeToDetailerPipe.input.Select$_to$_add$_LoRA": { $Name: "Comfy.Custom.Impact_Pack.BasicPipeToDetailerPipe.input.Select$_to$_add$_LoRA", $Value: Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df },
          "Comfy.Custom.Impact_Pack.BasicPipeToDetailerPipeSDXL.input.Select$_to$_add$_LoRA": { $Name: "Comfy.Custom.Impact_Pack.BasicPipeToDetailerPipeSDXL.input.Select$_to$_add$_LoRA", $Value: Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df },
          "Comfy.Custom.Impact_Pack.EditDetailerPipe.input.Select$_to$_add$_LoRA": { $Name: "Comfy.Custom.Impact_Pack.EditDetailerPipe.input.Select$_to$_add$_LoRA", $Value: Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df },
          "Comfy.Custom.Impact_Pack.EditDetailerPipeSDXL.input.Select$_to$_add$_LoRA": { $Name: "Comfy.Custom.Impact_Pack.EditDetailerPipeSDXL.input.Select$_to$_add$_LoRA", $Value: Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df },
          "Comfy.Custom.Impact_Pack.ImpactWildcardEncode.input.Select$_to$_add$_LoRA": { $Name: "Comfy.Custom.Impact_Pack.ImpactWildcardEncode.input.Select$_to$_add$_LoRA", $Value: Comfy.Union.E_35e403c7628f220c07d5485d6e81fc66b4fc12df },
          "Comfy.Custom.Impact_Pack.ToDetailerPipe.input.Select$_to$_add$_Wildcard": { $Name: "Comfy.Custom.Impact_Pack.ToDetailerPipe.input.Select$_to$_add$_Wildcard", $Value: Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26 },
          "Comfy.Custom.Impact_Pack.ToDetailerPipeSDXL.input.Select$_to$_add$_Wildcard": { $Name: "Comfy.Custom.Impact_Pack.ToDetailerPipeSDXL.input.Select$_to$_add$_Wildcard", $Value: Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26 },
          "Comfy.Custom.Impact_Pack.BasicPipeToDetailerPipe.input.Select$_to$_add$_Wildcard": { $Name: "Comfy.Custom.Impact_Pack.BasicPipeToDetailerPipe.input.Select$_to$_add$_Wildcard", $Value: Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26 },
          "Comfy.Custom.Impact_Pack.BasicPipeToDetailerPipeSDXL.input.Select$_to$_add$_Wildcard": { $Name: "Comfy.Custom.Impact_Pack.BasicPipeToDetailerPipeSDXL.input.Select$_to$_add$_Wildcard", $Value: Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26 },
          "Comfy.Custom.Impact_Pack.EditDetailerPipe.input.Select$_to$_add$_Wildcard": { $Name: "Comfy.Custom.Impact_Pack.EditDetailerPipe.input.Select$_to$_add$_Wildcard", $Value: Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26 },
          "Comfy.Custom.Impact_Pack.EditDetailerPipeSDXL.input.Select$_to$_add$_Wildcard": { $Name: "Comfy.Custom.Impact_Pack.EditDetailerPipeSDXL.input.Select$_to$_add$_Wildcard", $Value: Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26 },
          "Comfy.Custom.Impact_Pack.ImpactWildcardProcessor.input.Select$_to$_add$_Wildcard": { $Name: "Comfy.Custom.Impact_Pack.ImpactWildcardProcessor.input.Select$_to$_add$_Wildcard", $Value: Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26 },
          "Comfy.Custom.Impact_Pack.ImpactWildcardEncode.input.Select$_to$_add$_Wildcard": { $Name: "Comfy.Custom.Impact_Pack.ImpactWildcardEncode.input.Select$_to$_add$_Wildcard", $Value: Comfy.Union.E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26 },
          "Comfy.Custom.Impact_Pack.LatentPixelScale.input.scale_method": { $Name: "Comfy.Custom.Impact_Pack.LatentPixelScale.input.scale_method", $Value: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d },
          "Comfy.Custom.Impact_Pack.PixelKSampleUpscalerProvider.input.scale_method": { $Name: "Comfy.Custom.Impact_Pack.PixelKSampleUpscalerProvider.input.scale_method", $Value: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d },
          "Comfy.Custom.Impact_Pack.PixelKSampleUpscalerProviderPipe.input.scale_method": { $Name: "Comfy.Custom.Impact_Pack.PixelKSampleUpscalerProviderPipe.input.scale_method", $Value: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d },
          "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProvider.input.scale_method": { $Name: "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProvider.input.scale_method", $Value: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d },
          "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProviderPipe.input.scale_method": { $Name: "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProviderPipe.input.scale_method", $Value: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d },
          "Comfy.Custom.Impact_Pack.TwoSamplersForMaskUpscalerProvider.input.scale_method": { $Name: "Comfy.Custom.Impact_Pack.TwoSamplersForMaskUpscalerProvider.input.scale_method", $Value: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d },
          "Comfy.Custom.Impact_Pack.TwoSamplersForMaskUpscalerProviderPipe.input.scale_method": { $Name: "Comfy.Custom.Impact_Pack.TwoSamplersForMaskUpscalerProviderPipe.input.scale_method", $Value: Comfy.Union.E_f9c5efbc827613eb902695cd0a25738ee31c607d },
          "Comfy.Custom.Impact_Pack.IterativeLatentUpscale.input.step_mode": { $Name: "Comfy.Custom.Impact_Pack.IterativeLatentUpscale.input.step_mode", $Value: Comfy.Union.E_4724269c8f643d5efa98f97e1e55a7ddfe6aac6c },
          "Comfy.Custom.Impact_Pack.IterativeImageUpscale.input.step_mode": { $Name: "Comfy.Custom.Impact_Pack.IterativeImageUpscale.input.step_mode", $Value: Comfy.Union.E_4724269c8f643d5efa98f97e1e55a7ddfe6aac6c },
          "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProvider.input.tiling_strategy": { $Name: "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProvider.input.tiling_strategy", $Value: Comfy.Union.E_304f89a0de34643f12756237824e7261db28aaf5 },
          "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProviderPipe.input.tiling_strategy": { $Name: "Comfy.Custom.Impact_Pack.PixelTiledKSampleUpscalerProviderPipe.input.tiling_strategy", $Value: Comfy.Union.E_304f89a0de34643f12756237824e7261db28aaf5 },
          "Comfy.Custom.Impact_Pack.TiledKSamplerProvider.input.tiling_strategy": { $Name: "Comfy.Custom.Impact_Pack.TiledKSamplerProvider.input.tiling_strategy", $Value: Comfy.Union.E_304f89a0de34643f12756237824e7261db28aaf5 },
          "Comfy.Custom.Impact_Pack.TwoSamplersForMaskUpscalerProvider.input.full_sample_schedule": { $Name: "Comfy.Custom.Impact_Pack.TwoSamplersForMaskUpscalerProvider.input.full_sample_schedule", $Value: Comfy.Union.E_de6a9887e0bfe301f572e929959509ed64574d1b },
          "Comfy.Custom.Impact_Pack.TwoSamplersForMaskUpscalerProviderPipe.input.full_sample_schedule": { $Name: "Comfy.Custom.Impact_Pack.TwoSamplersForMaskUpscalerProviderPipe.input.full_sample_schedule", $Value: Comfy.Union.E_de6a9887e0bfe301f572e929959509ed64574d1b },
          "Comfy.Custom.Impact_Pack.DenoiseScheduleHookProvider.input.schedule_for_iteration": { $Name: "Comfy.Custom.Impact_Pack.DenoiseScheduleHookProvider.input.schedule_for_iteration", $Value: Comfy.Union.E_0f7d0d088b6ea936fb25b477722d734706fe8b40 },
          "Comfy.Custom.Impact_Pack.StepsScheduleHookProvider.input.schedule_for_iteration": { $Name: "Comfy.Custom.Impact_Pack.StepsScheduleHookProvider.input.schedule_for_iteration", $Value: Comfy.Union.E_0f7d0d088b6ea936fb25b477722d734706fe8b40 },
          "Comfy.Custom.Impact_Pack.CfgScheduleHookProvider.input.schedule_for_iteration": { $Name: "Comfy.Custom.Impact_Pack.CfgScheduleHookProvider.input.schedule_for_iteration", $Value: Comfy.Union.E_0f7d0d088b6ea936fb25b477722d734706fe8b40 },
          "Comfy.Custom.Impact_Pack.NoiseInjectionHookProvider.input.schedule_for_iteration": { $Name: "Comfy.Custom.Impact_Pack.NoiseInjectionHookProvider.input.schedule_for_iteration", $Value: Comfy.Union.E_0f7d0d088b6ea936fb25b477722d734706fe8b40 },
          "Comfy.Custom.Impact_Pack.UnsamplerHookProvider.input.schedule_for_iteration": { $Name: "Comfy.Custom.Impact_Pack.UnsamplerHookProvider.input.schedule_for_iteration", $Value: Comfy.Union.E_0f7d0d088b6ea936fb25b477722d734706fe8b40 },
          "Comfy.Custom.Impact_Pack.DenoiseSchedulerDetailerHookProvider.input.schedule_for_cycle": { $Name: "Comfy.Custom.Impact_Pack.DenoiseSchedulerDetailerHookProvider.input.schedule_for_cycle", $Value: Comfy.Union.E_0f7d0d088b6ea936fb25b477722d734706fe8b40 },
          "Comfy.Custom.Impact_Pack.NoiseInjectionHookProvider.input.source": { $Name: "Comfy.Custom.Impact_Pack.NoiseInjectionHookProvider.input.source", $Value: Comfy.Union.E_3dfc15432d4b952e91053feecd5a5427720957fc },
          "Comfy.Custom.Impact_Pack.NoiseInjectionDetailerHookProvider.input.source": { $Name: "Comfy.Custom.Impact_Pack.NoiseInjectionDetailerHookProvider.input.source", $Value: Comfy.Union.E_3dfc15432d4b952e91053feecd5a5427720957fc },
          "Comfy.Custom.Impact_Pack.CoreMLDetailerHookProvider.input.mode": { $Name: "Comfy.Custom.Impact_Pack.CoreMLDetailerHookProvider.input.mode", $Value: Comfy.Union.E_d4b6506ab5528aeab8952aa9d308dbc242d01e63 },
          "Comfy.Custom.Impact_Pack.NoiseInjectionDetailerHookProvider.input.schedule_for_cycle": { $Name: "Comfy.Custom.Impact_Pack.NoiseInjectionDetailerHookProvider.input.schedule_for_cycle", $Value: Comfy.Union.E_afbc7832ad78555d4f5646f97ed21b561fe3d1f0 },
          "Comfy.Custom.Impact_Pack.UnsamplerDetailerHookProvider.input.schedule_for_cycle": { $Name: "Comfy.Custom.Impact_Pack.UnsamplerDetailerHookProvider.input.schedule_for_cycle", $Value: Comfy.Union.E_afbc7832ad78555d4f5646f97ed21b561fe3d1f0 },
          "Comfy.Custom.Impact_Pack.SEGSOrderedFilterDetailerHookProvider.input.target": { $Name: "Comfy.Custom.Impact_Pack.SEGSOrderedFilterDetailerHookProvider.input.target", $Value: Comfy.Union.E_87bec9aa0dfe9b9678fd35387106d931d78358cd },
          "Comfy.Custom.Impact_Pack.SEGSRangeFilterDetailerHookProvider.input.target": { $Name: "Comfy.Custom.Impact_Pack.SEGSRangeFilterDetailerHookProvider.input.target", $Value: Comfy.Union.E_aceb55e7f03fcbc2a78383bd8ddff8676e42e536 },
          "Comfy.Custom.Impact_Pack.SEGSLabelFilterDetailerHookProvider.input.preset": { $Name: "Comfy.Custom.Impact_Pack.SEGSLabelFilterDetailerHookProvider.input.preset", $Value: Comfy.Union.E_cc1f262afc534d382e5c36082cecd4fc2a9c4ffb },
          "Comfy.Custom.Impact_Pack.ImpactSEGSLabelFilter.input.preset": { $Name: "Comfy.Custom.Impact_Pack.ImpactSEGSLabelFilter.input.preset", $Value: Comfy.Union.E_cc1f262afc534d382e5c36082cecd4fc2a9c4ffb },
          "Comfy.Custom.Impact_Pack.ImpactSimpleDetectorSEGS$_for$_AD.input.masking_mode": { $Name: "Comfy.Custom.Impact_Pack.ImpactSimpleDetectorSEGS$_for$_AD.input.masking_mode", $Value: Comfy.Union.E_e5ef6b688dbafd88538e80bf002826bade4bb121 },
          "Comfy.Custom.Impact_Pack.ImpactSimpleDetectorSEGS$_for$_AD.input.segs_pivot": { $Name: "Comfy.Custom.Impact_Pack.ImpactSimpleDetectorSEGS$_for$_AD.input.segs_pivot", $Value: Comfy.Union.E_651ea09f69db9a1eb817103d1ea8e3ac08b4a319 },
          "Comfy.Custom.Impact_Pack.ImpactIPAdapterApplySEGS.input.weight_type": { $Name: "Comfy.Custom.Impact_Pack.ImpactIPAdapterApplySEGS.input.weight_type", $Value: Comfy.Union.E_05cddbad13b094c2641c6bb7d261e15c71efc903 },
          "Comfy.Custom.Impact_Pack.ImpactIPAdapterApplySEGS.input.combine_embeds": { $Name: "Comfy.Custom.Impact_Pack.ImpactIPAdapterApplySEGS.input.combine_embeds", $Value: Comfy.Union.E_055d80a7c582bd5b57fd6775414e697be3f0f580 },
          "Comfy.Custom.Impact_Pack.PreviewBridge.input.restore_mask": { $Name: "Comfy.Custom.Impact_Pack.PreviewBridge.input.restore_mask", $Value: Comfy.Union.E_f27fae3205ecf36e9f4a68f3867d38e025476963 },
          "Comfy.Custom.Impact_Pack.PreviewBridgeLatent.input.restore_mask": { $Name: "Comfy.Custom.Impact_Pack.PreviewBridgeLatent.input.restore_mask", $Value: Comfy.Union.E_f27fae3205ecf36e9f4a68f3867d38e025476963 },
          "Comfy.Custom.Impact_Pack.PreviewBridgeLatent.input.preview_method": { $Name: "Comfy.Custom.Impact_Pack.PreviewBridgeLatent.input.preview_method", $Value: Comfy.Union.E_ea287ec9983f05378f2614091804a1b6b95d1c79 },
          "Comfy.Custom.Impact_Pack.LatentSender.input.preview_method": { $Name: "Comfy.Custom.Impact_Pack.LatentSender.input.preview_method", $Value: Comfy.Union.E_fa4a13687b111fa33a8c8fa375d5321d09b46b27 },
          "Comfy.Custom.Impact_Pack.SEGSUpscaler.input.resampling_method": { $Name: "Comfy.Custom.Impact_Pack.SEGSUpscaler.input.resampling_method", $Value: Comfy.Union.E_bac912b55de8a59480c74aba068f4a3b5f9a0e38 },
          "Comfy.Custom.Impact_Pack.SEGSUpscalerPipe.input.resampling_method": { $Name: "Comfy.Custom.Impact_Pack.SEGSUpscalerPipe.input.resampling_method", $Value: Comfy.Union.E_bac912b55de8a59480c74aba068f4a3b5f9a0e38 },
          "Comfy.Custom.Impact_Pack.SEGSUpscaler.input.supersample": { $Name: "Comfy.Custom.Impact_Pack.SEGSUpscaler.input.supersample", $Value: Comfy.Union.E_c1a74591678033a2ccc87aa0add77dab7f001da5 },
          "Comfy.Custom.Impact_Pack.SEGSUpscalerPipe.input.supersample": { $Name: "Comfy.Custom.Impact_Pack.SEGSUpscalerPipe.input.supersample", $Value: Comfy.Union.E_c1a74591678033a2ccc87aa0add77dab7f001da5 },
          "Comfy.Custom.Impact_Pack.ImpactMakeTileSEGS.input.irregular_mask_mode": { $Name: "Comfy.Custom.Impact_Pack.ImpactMakeTileSEGS.input.irregular_mask_mode", $Value: Comfy.Union.E_5cc1495fe28eac05289d45b29269b31c6edca055 },
          "Comfy.Custom.Impact_Pack.ReencodeLatent.input.tile_mode": { $Name: "Comfy.Custom.Impact_Pack.ReencodeLatent.input.tile_mode", $Value: Comfy.Union.E_d5776f669e41b2ec29cd020ce34a8b7cdf23693d },
          "Comfy.Custom.Impact_Pack.ReencodeLatentPipe.input.tile_mode": { $Name: "Comfy.Custom.Impact_Pack.ReencodeLatentPipe.input.tile_mode", $Value: Comfy.Union.E_d5776f669e41b2ec29cd020ce34a8b7cdf23693d },
          "Comfy.Custom.Impact_Pack.RegionalSampler.input.seed_2nd_mode": { $Name: "Comfy.Custom.Impact_Pack.RegionalSampler.input.seed_2nd_mode", $Value: Comfy.Union.E_1e8364b55644fdbf6d28dd3e6197d9fe1777e361 },
          "Comfy.Custom.Impact_Pack.RegionalSampler.input.additional_mode": { $Name: "Comfy.Custom.Impact_Pack.RegionalSampler.input.additional_mode", $Value: Comfy.Union.E_db19bd49ccd13456a936f2070c088f16070aa0b1 },
          "Comfy.Custom.Impact_Pack.RegionalSamplerAdvanced.input.additional_mode": { $Name: "Comfy.Custom.Impact_Pack.RegionalSamplerAdvanced.input.additional_mode", $Value: Comfy.Union.E_db19bd49ccd13456a936f2070c088f16070aa0b1 },
          "Comfy.Custom.Impact_Pack.RegionalSampler.input.additional_sampler": { $Name: "Comfy.Custom.Impact_Pack.RegionalSampler.input.additional_sampler", $Value: Comfy.Union.E_3fd6d592305b0bc44ce9c69a23201f8d7a155884 },
          "Comfy.Custom.Impact_Pack.RegionalSamplerAdvanced.input.additional_sampler": { $Name: "Comfy.Custom.Impact_Pack.RegionalSamplerAdvanced.input.additional_sampler", $Value: Comfy.Union.E_3fd6d592305b0bc44ce9c69a23201f8d7a155884 },
          "Comfy.Custom.Impact_Pack.RegionalPrompt.input.variation_method": { $Name: "Comfy.Custom.Impact_Pack.RegionalPrompt.input.variation_method", $Value: Comfy.Union.E_627d63e970919d713af795854ffd9dd2642f92d2 },
          "Comfy.Custom.Impact_Pack.ImpactSEGSRangeFilter.input.target": { $Name: "Comfy.Custom.Impact_Pack.ImpactSEGSRangeFilter.input.target", $Value: Comfy.Union.E_10c017f4a76414789a861361dc5cdbfef12e2d7d },
          "Comfy.Custom.Impact_Pack.ImpactSEGSOrderedFilter.input.target": { $Name: "Comfy.Custom.Impact_Pack.ImpactSEGSOrderedFilter.input.target", $Value: Comfy.Union.E_b1f554e93f550a374a1ff740ad7447a7b34b71be },
          "Comfy.Custom.Impact_Pack.ImpactCompare.input.cmp": { $Name: "Comfy.Custom.Impact_Pack.ImpactCompare.input.cmp", $Value: Comfy.Union.E_87d3a21083ff67c538309f218241f70a793f619c },
          "Comfy.Custom.Impact_Pack.ImpactLogicalOperators.input.operator": { $Name: "Comfy.Custom.Impact_Pack.ImpactLogicalOperators.input.operator", $Value: Comfy.Union.E_99d83eba8f2a90cc88da26295981d92d458e4e14 },
          "Comfy.Custom.Impact_Pack.ImpactValueReceiver.input.typ": { $Name: "Comfy.Custom.Impact_Pack.ImpactValueReceiver.input.typ", $Value: Comfy.Union.E_6c86e4efdc8db8dae17215fbf80825ddaad06ffa },
          "Comfy.Custom.Impact_Pack.ImpactControlBridge.input.behavior": { $Name: "Comfy.Custom.Impact_Pack.ImpactControlBridge.input.behavior", $Value: Comfy.Union.E_383642e8f2544ff8678e350c4f1049624ad6589e },
          "Comfy.Custom.Impact_Pack.ImpactHFTransformersClassifierProvider.input.preset_repo_id": { $Name: "Comfy.Custom.Impact_Pack.ImpactHFTransformersClassifierProvider.input.preset_repo_id", $Value: Comfy.Union.E_7fd75955db2b2e81b87d8452255b37c2d98fd105 },
          "Comfy.Custom.Impact_Pack.ImpactSEGSClassify.input.preset_expr": { $Name: "Comfy.Custom.Impact_Pack.ImpactSEGSClassify.input.preset_expr", $Value: Comfy.Union.E_01400d675e59295302197d02289e89ead401098e },
          "Comfy.Custom.Impact_Pack.ImpactSchedulerAdapter.input.extra_scheduler": { $Name: "Comfy.Custom.Impact_Pack.ImpactSchedulerAdapter.input.extra_scheduler", $Value: Comfy.Union.E_64bb9134d159ff7e3f573facb7cb2fcfbb2de483 },
          "Comfy.Custom.Impact_Pack.UltralyticsDetectorProvider.input.model_name": { $Name: "Comfy.Custom.Impact_Pack.UltralyticsDetectorProvider.input.model_name", $Value: Comfy.Union.E_cf11746957b2cb2b6379bbd08fe59610b2aae90a },
      }
   }
   // #endregion
   
   // 2. Embeddings -------------------------------
   export type Embeddings = 'EasyNegative' | 'bad-artist-anime' | 'bad-artist' | 'bad_prompt_version2' | 'badquality' | 'charturnerv2' | 'ng_deepnegative_v1_75t' | 'realisticvision-negative-embedding'
   
   // 3. Suggestions -------------------------------
   namespace Comfy.Producer {
      // 3.1. types produced
      export interface SEG_ELT_control_net_wrapper extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'ImpactFrom$_SEG$_ELT'>
      {}
      export interface TRANSFORMERS_CLASSIFIER extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'ImpactHFTransformersClassifierProvider'>
      {}
      export interface SEG_ELT_crop_region extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'ImpactFrom$_SEG$_ELT'>
      {}
      export interface CLIP_VISION_OUTPUT extends
         Pick<Comfy.Base.Nodes, 'CLIPVisionEncode'>
      {}
      export interface BOOLEAN extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'ImpactCompare' | 'ImpactIfNone' | 'ImpactConvertDataType' | 'ImpactLogicalOperators' | 'ImpactBoolean' | 'ImpactNeg' | 'ImpactIsNotEmptySEGS'>
      {}
      export interface SEGS_PREPROCESSOR {} // 🔶 no node can output this type.
      export interface KSAMPLER_ADVANCED extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'KSamplerAdvancedProvider'>
      {}
      export interface LATENT_OPERATION extends
         Pick<Comfy.Extra.latent.Nodes, 'LatentOperationTonemapReinhard' | 'LatentOperationSharpen'>
      {}
      export interface REGIONAL_PROMPTS extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'CombineRegionalPrompts' | 'RegionalPrompt'>
      {}
      export interface STRING extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'ImpactFrom$_SEG$_ELT' | 'LatentSwitch' | 'SEGSSwitch' | 'ImpactSwitch' | 'ImpactWildcardProcessor' | 'ImpactWildcardEncode' | 'ImpactConvertDataType' | 'ImpactStringSelector' | 'StringListToString' | 'WildcardPromptFromString' | 'WildcardPromptFromString' | 'ImpactSEGSClassify'>
      {}
      export interface FLOAT extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'ImpactFrom$_SEG$_ELT' | 'ImpactConvertDataType' | 'ImpactFloat'>
      {}
      export interface SCHEDULER_FUNC extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'GITSSchedulerFuncProvider'>
      {}
      export interface IPADAPTER_PIPE {} // 🔶 no node can output this type.
      export interface UPSCALE_MODEL extends
         Pick<Comfy.Extra.upscale_model.Nodes, 'UpscaleModelLoader'>
      {}
      export interface BBOX_DETECTOR extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'CLIPSegDetectorProvider' | 'ONNXDetectorProvider' | 'FromDetailerPipe' | 'FromDetailerPipe$_v2' | 'FromDetailerPipeSDXL' | 'UltralyticsDetectorProvider'>
      {}
      export interface DETAILER_HOOK extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'FromDetailerPipe' | 'FromDetailerPipe$_v2' | 'FromDetailerPipeSDXL' | 'CoreMLDetailerHookProvider' | 'PreviewDetailerHookProvider' | 'DetailerHookCombine' | 'NoiseInjectionDetailerHookProvider' | 'UnsamplerDetailerHookProvider' | 'DenoiseSchedulerDetailerHookProvider' | 'SEGSOrderedFilterDetailerHookProvider' | 'SEGSRangeFilterDetailerHookProvider' | 'SEGSLabelFilterDetailerHookProvider' | 'VariationNoiseDetailerHookProvider'>
      {}
      export interface DETAILER_PIPE extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'FaceDetailer' | 'FaceDetailerPipe' | 'ToDetailerPipe' | 'ToDetailerPipeSDXL' | 'FromDetailerPipe$_v2' | 'FromDetailerPipeSDXL' | 'BasicPipeToDetailerPipe' | 'BasicPipeToDetailerPipeSDXL' | 'EditDetailerPipe' | 'EditDetailerPipeSDXL'>
      {}
      export interface SEGM_DETECTOR extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'FromDetailerPipe' | 'FromDetailerPipe$_v2' | 'FromDetailerPipeSDXL' | 'UltralyticsDetectorProvider'>
      {}
      export interface UPSCALER_HOOK extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'PreviewDetailerHookProvider'>
      {}
      export interface INT extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'ImpactFrom$_SEG$_ELT$_bbox' | 'ImpactFrom$_SEG$_ELT$_bbox' | 'ImpactFrom$_SEG$_ELT$_bbox' | 'ImpactFrom$_SEG$_ELT$_bbox' | 'ImpactFrom$_SEG$_ELT$_crop$_region' | 'ImpactFrom$_SEG$_ELT$_crop$_region' | 'ImpactFrom$_SEG$_ELT$_crop$_region' | 'ImpactFrom$_SEG$_ELT$_crop$_region' | 'ImpactCount$_Elts$_in$_SEGS' | 'LatentSwitch' | 'SEGSSwitch' | 'ImpactSwitch' | 'ImpactConvertDataType' | 'ImpactInt' | 'ImpactImageInfo' | 'ImpactImageInfo' | 'ImpactImageInfo' | 'ImpactImageInfo' | 'ImpactLatentInfo' | 'ImpactLatentInfo' | 'ImpactLatentInfo' | 'ImpactLatentInfo' | 'ImpactMinMax' | 'ImpactQueueTriggerCountdown' | 'ImpactQueueTriggerCountdown'>
      {}
      export interface CONDITIONING extends
         Pick<Comfy.Base.Nodes, 'CLIPTextEncode' | 'ConditioningAverage' | 'ConditioningCombine' | 'ConditioningConcat' | 'ConditioningSetArea' | 'ConditioningSetAreaPercentage' | 'ConditioningSetAreaStrength' | 'ConditioningSetMask' | 'StyleModelApply' | 'unCLIPConditioning' | 'ControlNetApply' | 'ControlNetApplyAdvanced' | 'ControlNetApplyAdvanced' | 'GLIGENTextBoxApply' | 'InpaintModelConditioning' | 'InpaintModelConditioning' | 'ConditioningZeroOut' | 'ConditioningSetTimestepRange'>,
         Pick<Comfy.Extra.clip_sdxl.Nodes, 'CLIPTextEncodeSDXLRefiner' | 'CLIPTextEncodeSDXL'>,
         Pick<Comfy.Extra.video_model.Nodes, 'SVD$_img2vid$_Conditioning' | 'SVD$_img2vid$_Conditioning'>,
         Pick<Comfy.Extra.stable3d.Nodes, 'StableZero123$_Conditioning' | 'StableZero123$_Conditioning' | 'StableZero123$_Conditioning$_Batched' | 'StableZero123$_Conditioning$_Batched' | 'SV3D$_Conditioning' | 'SV3D$_Conditioning'>,
         Pick<Comfy.Extra.sdupscale.Nodes, 'SD$_4XUpscale$_Conditioning' | 'SD$_4XUpscale$_Conditioning'>,
         Pick<Comfy.Extra.photomaker.Nodes, 'PhotoMakerEncode'>,
         Pick<Comfy.Extra.cond.Nodes, 'CLIPTextEncodeControlnet'>,
         Pick<Comfy.Extra.stable_cascade.Nodes, 'StableCascade$_StageB$_Conditioning'>,
         Pick<Comfy.Extra.ip2p.Nodes, 'InstructPixToPixConditioning' | 'InstructPixToPixConditioning'>,
         Pick<Comfy.Extra.sd3.Nodes, 'CLIPTextEncodeSD3' | 'ControlNetApplySD3' | 'ControlNetApplySD3'>,
         Pick<Comfy.Extra.controlnet.Nodes, 'ControlNetInpaintingAliMamaApply' | 'ControlNetInpaintingAliMamaApply'>,
         Pick<Comfy.Extra.hunyuan.Nodes, 'CLIPTextEncodeHunyuanDiT'>,
         Pick<Comfy.Extra.flux.Nodes, 'CLIPTextEncodeFlux' | 'FluxGuidance'>,
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'FromDetailerPipe' | 'FromDetailerPipe' | 'FromDetailerPipe$_v2' | 'FromDetailerPipe$_v2' | 'FromDetailerPipeSDXL' | 'FromDetailerPipeSDXL' | 'FromDetailerPipeSDXL' | 'FromDetailerPipeSDXL' | 'FromBasicPipe' | 'FromBasicPipe' | 'FromBasicPipe$_v2' | 'FromBasicPipe$_v2' | 'ImpactNegativeConditioningPlaceholder' | 'ImpactWildcardEncode' | 'ImpactCombineConditionings' | 'ImpactConcatConditionings'>
      {}
      export interface SEG_ELT_bbox extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'ImpactFrom$_SEG$_ELT'>
      {}
      export interface CLIP_VISION extends
         Pick<Comfy.Base.Nodes, 'CLIPVisionLoader' | 'unCLIPCheckpointLoader'>,
         Pick<Comfy.Extra.video_model.Nodes, 'ImageOnlyCheckpointLoader'>
      {}
      export interface STYLE_MODEL extends
         Pick<Comfy.Base.Nodes, 'StyleModelLoader'>
      {}
      export interface CONTROL_NET extends
         Pick<Comfy.Base.Nodes, 'ControlNetLoader' | 'DiffControlNetLoader'>,
         Pick<Comfy.Extra.controlnet.Nodes, 'SetUnionControlNetType'>
      {}
      export interface SEGS_HEADER extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'ImpactDecomposeSEGS'>
      {}
      export interface PHOTOMAKER extends
         Pick<Comfy.Extra.photomaker.Nodes, 'PhotoMakerLoader'>
      {}
      export interface BASIC_PIPE extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'DetailerForEachPipe' | 'DetailerForEachDebugPipe' | 'DetailerForEachPipeForAnimateDiff' | 'MaskDetailerPipe' | 'MaskDetailerPipe' | 'AnyPipeToBasic' | 'ToBasicPipe' | 'FromBasicPipe$_v2' | 'DetailerPipeToBasicPipe' | 'DetailerPipeToBasicPipe' | 'EditBasicPipe' | 'ImpactKSamplerBasicPipe' | 'ImpactKSamplerAdvancedBasicPipe'>
      {}
      export interface SAM_MODEL extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'SAMLoader' | 'FromDetailerPipe' | 'FromDetailerPipe$_v2' | 'FromDetailerPipeSDXL'>
      {}
      export interface UPSCALER extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'PixelKSampleUpscalerProvider' | 'PixelKSampleUpscalerProviderPipe' | 'PixelTiledKSampleUpscalerProvider' | 'PixelTiledKSampleUpscalerProviderPipe' | 'TwoSamplersForMaskUpscalerProvider' | 'TwoSamplersForMaskUpscalerProviderPipe'>
      {}
      export interface KSAMPLER extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'KSamplerProvider' | 'TiledKSamplerProvider'>
      {}
      export interface SAMPLER extends
         Pick<Comfy.Extra.custom_sampler.Nodes, 'KSamplerSelect' | 'SamplerEulerAncestral' | 'SamplerEulerAncestralCFGPP' | 'SamplerLMS' | 'SamplerDPMPP$_3M$_SDE' | 'SamplerDPMPP$_2M$_SDE' | 'SamplerDPMPP$_SDE' | 'SamplerDPMPP$_2S$_Ancestral' | 'SamplerDPMAdaptative'>,
         Pick<Comfy.Extra.advanced_samplers.Nodes, 'SamplerLCMUpscale' | 'SamplerEulerCFGpp'>
      {}
      export interface PK_HOOK extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'PixelKSampleHookCombine' | 'DenoiseScheduleHookProvider' | 'StepsScheduleHookProvider' | 'CfgScheduleHookProvider' | 'NoiseInjectionHookProvider' | 'UnsamplerHookProvider'>
      {}
      export interface SEG_ELT extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'ImpactDecomposeSEGS' | 'ImpactFrom$_SEG$_ELT' | 'ImpactEdit$_SEG$_ELT' | 'ImpactDilate$_Mask$_SEG$_ELT' | 'ImpactScaleBy$_BBOX$_SEG$_ELT'>
      {}
      export interface LATENT extends
         Pick<Comfy.Base.Nodes, 'KSampler' | 'VAEEncode' | 'VAEEncodeForInpaint' | 'EmptyLatentImage' | 'LatentUpscale' | 'LatentUpscaleBy' | 'LatentFromBatch' | 'RepeatLatentBatch' | 'KSamplerAdvanced' | 'SetLatentNoiseMask' | 'LatentComposite' | 'LatentBlend' | 'LatentRotate' | 'LatentFlip' | 'LatentCrop' | 'VAEEncodeTiled' | 'InpaintModelConditioning' | 'LoadLatent'>,
         Pick<Comfy.Extra.latent.Nodes, 'LatentAdd' | 'LatentSubtract' | 'LatentMultiply' | 'LatentInterpolate' | 'LatentBatch' | 'LatentBatchSeedBehavior' | 'LatentApplyOperation'>,
         Pick<Comfy.Extra.mask.Nodes, 'LatentCompositeMasked'>,
         Pick<Comfy.Extra.rebatch.Nodes, 'RebatchLatents'>,
         Pick<Comfy.Extra.custom_sampler.Nodes, 'SamplerCustom' | 'SamplerCustom' | 'AddNoise' | 'SamplerCustomAdvanced' | 'SamplerCustomAdvanced'>,
         Pick<Comfy.Extra.video_model.Nodes, 'SVD$_img2vid$_Conditioning'>,
         Pick<Comfy.Extra.stable3d.Nodes, 'StableZero123$_Conditioning' | 'StableZero123$_Conditioning$_Batched' | 'SV3D$_Conditioning'>,
         Pick<Comfy.Extra.sdupscale.Nodes, 'SD$_4XUpscale$_Conditioning'>,
         Pick<Comfy.Extra.stable_cascade.Nodes, 'StableCascade$_EmptyLatentImage' | 'StableCascade$_EmptyLatentImage' | 'StableCascade$_StageC$_VAEEncode' | 'StableCascade$_StageC$_VAEEncode' | 'StableCascade$_SuperResolutionControlnet' | 'StableCascade$_SuperResolutionControlnet'>,
         Pick<Comfy.Extra.ip2p.Nodes, 'InstructPixToPixConditioning'>,
         Pick<Comfy.Extra.audio.Nodes, 'EmptyLatentAudio' | 'VAEEncodeAudio'>,
         Pick<Comfy.Extra.sd3.Nodes, 'EmptySD3LatentImage'>,
         Pick<Comfy.Extra.mochi.Nodes, 'EmptyMochiLatentVideo'>,
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'LatentPixelScale' | 'IterativeLatentUpscale' | 'TwoSamplersForMask' | 'TwoAdvancedSamplersForMask' | 'PreviewBridgeLatent' | 'LatentReceiver' | 'ImpactKSamplerBasicPipe' | 'ImpactKSamplerAdvancedBasicPipe' | 'ReencodeLatent' | 'ReencodeLatentPipe' | 'RegionalSampler' | 'RegionalSamplerAdvanced' | 'RemoveNoiseMask'>
      {}
      export interface GLIGEN extends
         Pick<Comfy.Base.Nodes, 'GLIGENLoader'>
      {}
      export interface SIGMAS extends
         Pick<Comfy.Extra.custom_sampler.Nodes, 'BasicScheduler' | 'KarrasScheduler' | 'ExponentialScheduler' | 'PolyexponentialScheduler' | 'LaplaceScheduler' | 'VPScheduler' | 'BetaSamplingScheduler' | 'SDTurboScheduler' | 'SplitSigmas' | 'SplitSigmas' | 'SplitSigmasDenoise' | 'SplitSigmasDenoise' | 'FlipSigmas'>,
         Pick<Comfy.Extra.align_your_steps.Nodes, 'AlignYourStepsScheduler'>,
         Pick<Comfy.Extra.gits.Nodes, 'GITSScheduler'>
      {}
      export interface GUIDER extends
         Pick<Comfy.Extra.custom_sampler.Nodes, 'CFGGuider' | 'DualCFGGuider' | 'BasicGuider'>,
         Pick<Comfy.Extra.perpneg.Nodes, 'PerpNegGuider'>
      {}
      export interface WEBCAM {} // 🔶 no node can output this type.
      export interface MODEL extends
         Pick<Comfy.Base.Nodes, 'CheckpointLoaderSimple' | 'LoraLoader' | 'UNETLoader' | 'unCLIPCheckpointLoader' | 'CheckpointLoader' | 'DiffusersLoader' | 'LoraLoaderModelOnly'>,
         Pick<Comfy.Extra.latent.Nodes, 'LatentApplyOperationCFG'>,
         Pick<Comfy.Extra.hypernetwork.Nodes, 'HypernetworkLoader'>,
         Pick<Comfy.Extra.model_merging.Nodes, 'ModelMergeSimple' | 'ModelMergeBlocks' | 'ModelMergeSubtract' | 'ModelMergeAdd'>,
         Pick<Comfy.Extra.tomesd.Nodes, 'TomePatchModel'>,
         Pick<Comfy.Extra.freelunch.Nodes, 'FreeU' | 'FreeU$_V2'>,
         Pick<Comfy.Extra.hypertile.Nodes, 'HyperTile'>,
         Pick<Comfy.Extra.model_advanced.Nodes, 'ModelSamplingDiscrete' | 'ModelSamplingContinuousEDM' | 'ModelSamplingContinuousV' | 'ModelSamplingStableCascade' | 'ModelSamplingSD3' | 'ModelSamplingAuraFlow' | 'ModelSamplingFlux' | 'RescaleCFG'>,
         Pick<Comfy.Extra.model_downscale.Nodes, 'PatchModelAddDownscale'>,
         Pick<Comfy.Extra.video_model.Nodes, 'ImageOnlyCheckpointLoader' | 'VideoLinearCFGGuidance' | 'VideoTriangleCFGGuidance'>,
         Pick<Comfy.Extra.sag.Nodes, 'SelfAttentionGuidance'>,
         Pick<Comfy.Extra.perpneg.Nodes, 'PerpNeg'>,
         Pick<Comfy.Extra.differential_diffusion.Nodes, 'DifferentialDiffusion'>,
         Pick<Comfy.Extra.model_merging_model_specific.Nodes, 'ModelMergeSD1' | 'ModelMergeSD2' | 'ModelMergeSDXL' | 'ModelMergeSD3$_2B' | 'ModelMergeFlux1' | 'ModelMergeSD35$_Large'>,
         Pick<Comfy.Extra.pag.Nodes, 'PerturbedAttentionGuidance'>,
         Pick<Comfy.Extra.attention_multiply.Nodes, 'UNetSelfAttentionMultiply' | 'UNetCrossAttentionMultiply' | 'UNetTemporalAttentionMultiply'>,
         Pick<Comfy.Extra.sd3.Nodes, 'SkipLayerGuidanceSD3'>,
         Pick<Comfy.Extra.torch_compile.Nodes, 'TorchCompileModel'>,
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'FromDetailerPipe' | 'FromDetailerPipe$_v2' | 'FromDetailerPipeSDXL' | 'FromDetailerPipeSDXL' | 'FromBasicPipe' | 'FromBasicPipe$_v2' | 'ImpactWildcardEncode'>
      {}
      export interface IMAGE extends
         Pick<Comfy.Base.Nodes, 'VAEDecode' | 'LoadImage' | 'ImageScale' | 'ImageScaleBy' | 'ImageInvert' | 'ImageBatch' | 'ImagePadForOutpaint' | 'EmptyImage' | 'VAEDecodeTiled'>,
         Pick<Comfy.Extra.upscale_model.Nodes, 'ImageUpscaleWithModel'>,
         Pick<Comfy.Extra.post_processing.Nodes, 'ImageBlend' | 'ImageBlur' | 'ImageQuantize' | 'ImageSharpen' | 'ImageScaleToTotalPixels'>,
         Pick<Comfy.Extra.mask.Nodes, 'ImageCompositeMasked' | 'MaskToImage'>,
         Pick<Comfy.Extra.compositing.Nodes, 'PorterDuffImageComposite' | 'SplitImageWithAlpha' | 'JoinImageWithAlpha'>,
         Pick<Comfy.Extra.rebatch.Nodes, 'RebatchImages'>,
         Pick<Comfy.Extra.canny.Nodes, 'Canny'>,
         Pick<Comfy.Extra.images.Nodes, 'ImageCrop' | 'RepeatImageBatch' | 'ImageFromBatch'>,
         Pick<Comfy.Extra.morphology.Nodes, 'Morphology'>,
         Pick<Comfy.Extra.stable_cascade.Nodes, 'StableCascade$_SuperResolutionControlnet'>,
         Pick<Comfy.Extra.webcam.Nodes, 'WebcamCapture'>,
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'DetailerForEach' | 'DetailerForEachDebug' | 'DetailerForEachDebug' | 'DetailerForEachDebug' | 'DetailerForEachDebug' | 'DetailerForEachDebug' | 'DetailerForEachPipe' | 'DetailerForEachPipe' | 'DetailerForEachDebugPipe' | 'DetailerForEachDebugPipe' | 'DetailerForEachDebugPipe' | 'DetailerForEachDebugPipe' | 'DetailerForEachDebugPipe' | 'DetailerForEachPipeForAnimateDiff' | 'DetailerForEachPipeForAnimateDiff' | 'FaceDetailer' | 'FaceDetailer' | 'FaceDetailer' | 'FaceDetailer' | 'FaceDetailerPipe' | 'FaceDetailerPipe' | 'FaceDetailerPipe' | 'FaceDetailerPipe' | 'MaskDetailerPipe' | 'MaskDetailerPipe' | 'MaskDetailerPipe' | 'LatentPixelScale' | 'IterativeImageUpscale' | 'ImageListToImageBatch' | 'ImpactFrom$_SEG$_ELT' | 'PreviewBridge' | 'ImageReceiver' | 'ImageMaskSwitch' | 'SEGSUpscaler' | 'SEGSUpscalerPipe' | 'SEGSDetailer' | 'SEGSPaste' | 'SEGSPreview' | 'SEGSPreviewCNet' | 'SEGSToImageList' | 'SEGSDetailerForAnimateDiff' | 'ImpactImageBatchToImageList' | 'ImpactMakeImageList' | 'ImpactMakeImageBatch'>
      {}
      export interface NOISE extends
         Pick<Comfy.Extra.custom_sampler.Nodes, 'RandomNoise' | 'DisableNoise'>
      {}
      export interface AUDIO extends
         Pick<Comfy.Extra.audio.Nodes, 'VAEDecodeAudio' | 'LoadAudio'>
      {}
      export interface $Star extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'LatentSwitch' | 'SEGSSwitch' | 'ImpactSwitch' | 'ImpactInversedSwitch' | 'ImpactMakeAnyList' | 'ImpactConditionalBranch' | 'ImpactConditionalBranchSelMode' | 'ImpactIfNone' | 'ImpactValueSender' | 'ImpactValueReceiver' | 'ImpactExecutionOrderController' | 'ImpactExecutionOrderController' | 'ImpactDummyInput' | 'ImpactQueueTrigger' | 'ImpactQueueTriggerCountdown' | 'ImpactSetWidgetValue' | 'ImpactNodeSetMuteState' | 'ImpactControlBridge' | 'ImpactSleep'>
      {}
      export interface CLIP extends
         Pick<Comfy.Base.Nodes, 'CheckpointLoaderSimple' | 'CLIPSetLastLayer' | 'LoraLoader' | 'CLIPLoader' | 'DualCLIPLoader' | 'unCLIPCheckpointLoader' | 'CheckpointLoader' | 'DiffusersLoader'>,
         Pick<Comfy.Extra.model_merging.Nodes, 'CLIPMergeSimple' | 'CLIPMergeSubtract' | 'CLIPMergeAdd'>,
         Pick<Comfy.Extra.attention_multiply.Nodes, 'CLIPAttentionMultiply'>,
         Pick<Comfy.Extra.sd3.Nodes, 'TripleCLIPLoader'>,
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'FromDetailerPipe' | 'FromDetailerPipe$_v2' | 'FromDetailerPipeSDXL' | 'FromDetailerPipeSDXL' | 'FromBasicPipe' | 'FromBasicPipe$_v2' | 'ImpactWildcardEncode'>
      {}
      export interface MASK extends
         Pick<Comfy.Base.Nodes, 'LoadImage' | 'LoadImageMask' | 'ImagePadForOutpaint'>,
         Pick<Comfy.Extra.mask.Nodes, 'ImageToMask' | 'ImageColorToMask' | 'SolidMask' | 'InvertMask' | 'CropMask' | 'MaskComposite' | 'FeatherMask' | 'GrowMask' | 'ThresholdMask'>,
         Pick<Comfy.Extra.compositing.Nodes, 'PorterDuffImageComposite' | 'SplitImageWithAlpha'>,
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'SAMDetectorCombined' | 'SAMDetectorSegmented' | 'SAMDetectorSegmented' | 'FaceDetailer' | 'FaceDetailerPipe' | 'BitwiseAndMask' | 'SubtractMask' | 'AddMask' | 'ImpactFlattenMask' | 'ToBinaryMask' | 'MasksToMaskList' | 'MaskListToMaskBatch' | 'ImpactFrom$_SEG$_ELT' | 'ImpactDilateMask' | 'ImpactGaussianBlurMask' | 'BboxDetectorCombined$_v2' | 'SegmDetectorCombined$_v2' | 'SegsToCombinedMask' | 'PreviewBridge' | 'PreviewBridgeLatent' | 'ImageReceiver' | 'ImageMaskSwitch' | 'ImpactSEGSToMaskList' | 'ImpactSEGSToMaskBatch' | 'ImpactMakeMaskList' | 'ImpactMakeMaskBatch'>
      {}
      export interface SEGS extends
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'BitwiseAndMaskForEach' | 'SubtractMaskForEach' | 'DetailerForEachPipe' | 'DetailerForEachDebugPipe' | 'DetailerForEachPipeForAnimateDiff' | 'ImpactSegsAndMask' | 'ImpactSegsAndMaskForEach' | 'EmptySegs' | 'MediaPipeFaceMeshToSEGS' | 'MaskToSEGS' | 'MaskToSEGS$_for$_AnimateDiff' | 'SetDefaultImageForSEGS' | 'RemoveImageFromSEGS' | 'BboxDetectorSEGS' | 'SegmDetectorSEGS' | 'ONNXDetectorSEGS' | 'ImpactSimpleDetectorSEGS$_for$_AD' | 'ImpactSimpleDetectorSEGS' | 'ImpactSimpleDetectorSEGSPipe' | 'ImpactControlNetApplySEGS' | 'ImpactControlNetApplyAdvancedSEGS' | 'ImpactControlNetClearSEGS' | 'ImpactIPAdapterApplySEGS' | 'ImpactAssembleSEGS' | 'ImpactDilateMaskInSEGS' | 'ImpactGaussianBlurMaskInSEGS' | 'SEGSDetailer' | 'ImpactSEGSConcat' | 'ImpactSEGSPicker' | 'ImpactMakeTileSEGS' | 'ImpactSEGSMerge' | 'SEGSDetailerForAnimateDiff' | 'ImpactSEGSLabelAssign' | 'ImpactSEGSLabelFilter' | 'ImpactSEGSLabelFilter' | 'ImpactSEGSRangeFilter' | 'ImpactSEGSRangeFilter' | 'ImpactSEGSOrderedFilter' | 'ImpactSEGSOrderedFilter' | 'ImpactSEGSClassify' | 'ImpactSEGSClassify'>
      {}
      export interface VAE extends
         Pick<Comfy.Base.Nodes, 'CheckpointLoaderSimple' | 'VAELoader' | 'unCLIPCheckpointLoader' | 'CheckpointLoader' | 'DiffusersLoader'>,
         Pick<Comfy.Extra.video_model.Nodes, 'ImageOnlyCheckpointLoader'>,
         Pick<Comfy.Custom.Impact_Pack.Nodes, 'FromDetailerPipe' | 'FromDetailerPipe$_v2' | 'FromDetailerPipeSDXL' | 'FromBasicPipe' | 'FromBasicPipe$_v2' | 'IterativeLatentUpscale' | 'ImpactKSamplerBasicPipe' | 'ImpactKSamplerAdvancedBasicPipe'>
      {}
   }
   
   // 5. ACCEPTABLE INPUTS -------------------------------
   namespace Comfy.Input {
      type INVALID_null = any
      type SEG_ELT_control_net_wrapper = ComfyNodeOutput<'SEG_ELT_control_net_wrapper'> | HasSingle_SEG_ELT_control_net_wrapper | ((x: Comfy.Producer.SEG_ELT_control_net_wrapper) => Comfy.Input.SEG_ELT_control_net_wrapper)
      type TRANSFORMERS_CLASSIFIER = ComfyNodeOutput<'TRANSFORMERS_CLASSIFIER'> | HasSingle_TRANSFORMERS_CLASSIFIER | ((x: Comfy.Producer.TRANSFORMERS_CLASSIFIER) => Comfy.Input.TRANSFORMERS_CLASSIFIER)
      type SEG_ELT_crop_region = ComfyNodeOutput<'SEG_ELT_crop_region'> | HasSingle_SEG_ELT_crop_region | ((x: Comfy.Producer.SEG_ELT_crop_region) => Comfy.Input.SEG_ELT_crop_region)
      type CLIP_VISION_OUTPUT = ComfyNodeOutput<'CLIP_VISION_OUTPUT'> | HasSingle_CLIP_VISION_OUTPUT | ((x: Comfy.Producer.CLIP_VISION_OUTPUT) => Comfy.Input.CLIP_VISION_OUTPUT)
      type BOOLEAN = boolean | ComfyNodeOutput<'BOOLEAN'> | HasSingle_BOOLEAN | ((x: Comfy.Producer.BOOLEAN) => Comfy.Input.BOOLEAN)
      type SEGS_PREPROCESSOR = ComfyNodeOutput<'SEGS_PREPROCESSOR'> | HasSingle_SEGS_PREPROCESSOR | ((x: Comfy.Producer.SEGS_PREPROCESSOR) => Comfy.Input.SEGS_PREPROCESSOR)
      type KSAMPLER_ADVANCED = ComfyNodeOutput<'KSAMPLER_ADVANCED'> | HasSingle_KSAMPLER_ADVANCED | ((x: Comfy.Producer.KSAMPLER_ADVANCED) => Comfy.Input.KSAMPLER_ADVANCED)
      type LATENT_OPERATION = ComfyNodeOutput<'LATENT_OPERATION'> | HasSingle_LATENT_OPERATION | ((x: Comfy.Producer.LATENT_OPERATION) => Comfy.Input.LATENT_OPERATION)
      type REGIONAL_PROMPTS = ComfyNodeOutput<'REGIONAL_PROMPTS'> | HasSingle_REGIONAL_PROMPTS | ((x: Comfy.Producer.REGIONAL_PROMPTS) => Comfy.Input.REGIONAL_PROMPTS)
      type STRING = string | ComfyNodeOutput<'STRING'> | HasSingle_STRING | ((x: Comfy.Producer.STRING) => Comfy.Input.STRING)
      type FLOAT = number | ComfyNodeOutput<'FLOAT'> | HasSingle_FLOAT | ((x: Comfy.Producer.FLOAT) => Comfy.Input.FLOAT)
      type SCHEDULER_FUNC = ComfyNodeOutput<'SCHEDULER_FUNC'> | HasSingle_SCHEDULER_FUNC | ((x: Comfy.Producer.SCHEDULER_FUNC) => Comfy.Input.SCHEDULER_FUNC)
      type IPADAPTER_PIPE = ComfyNodeOutput<'IPADAPTER_PIPE'> | HasSingle_IPADAPTER_PIPE | ((x: Comfy.Producer.IPADAPTER_PIPE) => Comfy.Input.IPADAPTER_PIPE)
      type UPSCALE_MODEL = ComfyNodeOutput<'UPSCALE_MODEL'> | HasSingle_UPSCALE_MODEL | ((x: Comfy.Producer.UPSCALE_MODEL) => Comfy.Input.UPSCALE_MODEL)
      type BBOX_DETECTOR = ComfyNodeOutput<'BBOX_DETECTOR'> | HasSingle_BBOX_DETECTOR | ((x: Comfy.Producer.BBOX_DETECTOR) => Comfy.Input.BBOX_DETECTOR)
      type DETAILER_HOOK = ComfyNodeOutput<'DETAILER_HOOK'> | HasSingle_DETAILER_HOOK | ((x: Comfy.Producer.DETAILER_HOOK) => Comfy.Input.DETAILER_HOOK)
      type DETAILER_PIPE = ComfyNodeOutput<'DETAILER_PIPE'> | HasSingle_DETAILER_PIPE | ((x: Comfy.Producer.DETAILER_PIPE) => Comfy.Input.DETAILER_PIPE)
      type SEGM_DETECTOR = ComfyNodeOutput<'SEGM_DETECTOR'> | HasSingle_SEGM_DETECTOR | ((x: Comfy.Producer.SEGM_DETECTOR) => Comfy.Input.SEGM_DETECTOR)
      type UPSCALER_HOOK = ComfyNodeOutput<'UPSCALER_HOOK'> | HasSingle_UPSCALER_HOOK | ((x: Comfy.Producer.UPSCALER_HOOK) => Comfy.Input.UPSCALER_HOOK)
      type INT = number | ComfyNodeOutput<'INT'> | HasSingle_INT | ((x: Comfy.Producer.INT) => Comfy.Input.INT)
      type CONDITIONING = ComfyNodeOutput<'CONDITIONING'> | HasSingle_CONDITIONING | ((x: Comfy.Producer.CONDITIONING) => Comfy.Input.CONDITIONING)
      type SEG_ELT_bbox = ComfyNodeOutput<'SEG_ELT_bbox'> | HasSingle_SEG_ELT_bbox | ((x: Comfy.Producer.SEG_ELT_bbox) => Comfy.Input.SEG_ELT_bbox)
      type CLIP_VISION = ComfyNodeOutput<'CLIP_VISION'> | HasSingle_CLIP_VISION | ((x: Comfy.Producer.CLIP_VISION) => Comfy.Input.CLIP_VISION)
      type STYLE_MODEL = ComfyNodeOutput<'STYLE_MODEL'> | HasSingle_STYLE_MODEL | ((x: Comfy.Producer.STYLE_MODEL) => Comfy.Input.STYLE_MODEL)
      type CONTROL_NET = ComfyNodeOutput<'CONTROL_NET'> | HasSingle_CONTROL_NET | ((x: Comfy.Producer.CONTROL_NET) => Comfy.Input.CONTROL_NET)
      type SEGS_HEADER = ComfyNodeOutput<'SEGS_HEADER'> | HasSingle_SEGS_HEADER | ((x: Comfy.Producer.SEGS_HEADER) => Comfy.Input.SEGS_HEADER)
      type PHOTOMAKER = ComfyNodeOutput<'PHOTOMAKER'> | HasSingle_PHOTOMAKER | ((x: Comfy.Producer.PHOTOMAKER) => Comfy.Input.PHOTOMAKER)
      type BASIC_PIPE = ComfyNodeOutput<'BASIC_PIPE'> | HasSingle_BASIC_PIPE | ((x: Comfy.Producer.BASIC_PIPE) => Comfy.Input.BASIC_PIPE)
      type SAM_MODEL = ComfyNodeOutput<'SAM_MODEL'> | HasSingle_SAM_MODEL | ((x: Comfy.Producer.SAM_MODEL) => Comfy.Input.SAM_MODEL)
      type UPSCALER = ComfyNodeOutput<'UPSCALER'> | HasSingle_UPSCALER | ((x: Comfy.Producer.UPSCALER) => Comfy.Input.UPSCALER)
      type KSAMPLER = ComfyNodeOutput<'KSAMPLER'> | HasSingle_KSAMPLER | ((x: Comfy.Producer.KSAMPLER) => Comfy.Input.KSAMPLER)
      type SAMPLER = ComfyNodeOutput<'SAMPLER'> | HasSingle_SAMPLER | ((x: Comfy.Producer.SAMPLER) => Comfy.Input.SAMPLER)
      type PK_HOOK = ComfyNodeOutput<'PK_HOOK'> | HasSingle_PK_HOOK | ((x: Comfy.Producer.PK_HOOK) => Comfy.Input.PK_HOOK)
      type SEG_ELT = ComfyNodeOutput<'SEG_ELT'> | HasSingle_SEG_ELT | ((x: Comfy.Producer.SEG_ELT) => Comfy.Input.SEG_ELT)
      type LATENT = ComfyNodeOutput<'LATENT'> | HasSingle_LATENT | ((x: Comfy.Producer.LATENT) => Comfy.Input.LATENT)
      type GLIGEN = ComfyNodeOutput<'GLIGEN'> | HasSingle_GLIGEN | ((x: Comfy.Producer.GLIGEN) => Comfy.Input.GLIGEN)
      type SIGMAS = ComfyNodeOutput<'SIGMAS'> | HasSingle_SIGMAS | ((x: Comfy.Producer.SIGMAS) => Comfy.Input.SIGMAS)
      type GUIDER = ComfyNodeOutput<'GUIDER'> | HasSingle_GUIDER | ((x: Comfy.Producer.GUIDER) => Comfy.Input.GUIDER)
      type WEBCAM = ComfyNodeOutput<'WEBCAM'> | HasSingle_WEBCAM | ((x: Comfy.Producer.WEBCAM) => Comfy.Input.WEBCAM)
      type MODEL = ComfyNodeOutput<'MODEL'> | HasSingle_MODEL | ((x: Comfy.Producer.MODEL) => Comfy.Input.MODEL)
      type IMAGE = ComfyNodeOutput<'IMAGE'> | HasSingle_IMAGE | ((x: Comfy.Producer.IMAGE) => Comfy.Input.IMAGE)
      type NOISE = ComfyNodeOutput<'NOISE'> | HasSingle_NOISE | ((x: Comfy.Producer.NOISE) => Comfy.Input.NOISE)
      type AUDIO = ComfyNodeOutput<'AUDIO'> | HasSingle_AUDIO | ((x: Comfy.Producer.AUDIO) => Comfy.Input.AUDIO)
      type $Star = ComfyNodeOutput<'$Star'> | HasSingle_$Star | ((x: Comfy.Producer.$Star) => Comfy.Input.$Star)
      type CLIP = ComfyNodeOutput<'CLIP'> | HasSingle_CLIP | ((x: Comfy.Producer.CLIP) => Comfy.Input.CLIP)
      type MASK = ComfyNodeOutput<'MASK'> | HasSingle_MASK | ((x: Comfy.Producer.MASK) => Comfy.Input.MASK)
      type SEGS = ComfyNodeOutput<'SEGS'> | HasSingle_SEGS | ((x: Comfy.Producer.SEGS) => Comfy.Input.SEGS)
      type VAE = ComfyNodeOutput<'VAE'> | HasSingle_VAE | ((x: Comfy.Producer.VAE) => Comfy.Input.VAE)
   }
   
   // 6. ENUMS -------------------------------
   namespace Comfy.Union {
      type E_26c34bf761d4be4554ab944105c5a3c017c99453 = "ddim" | "ddpm" | "deis" | "dpm_2" | "dpm_2_ancestral" | "dpm_adaptive" | "dpm_fast" | "dpmpp_2m" | "dpmpp_2m_cfg_pp" | "dpmpp_2m_sde" | "dpmpp_2m_sde_gpu" | "dpmpp_2s_ancestral" | "dpmpp_2s_ancestral_cfg_pp" | "dpmpp_3m_sde" | "dpmpp_3m_sde_gpu" | "dpmpp_sde" | "dpmpp_sde_gpu" | "euler" | "euler_ancestral" | "euler_ancestral_cfg_pp" | "euler_cfg_pp" | "heun" | "heunpp2" | "ipndm" | "ipndm_v" | "lcm" | "lms" | "uni_pc" | "uni_pc_bh2"
      type E_5f9267c2d2054f64bc3de0d20b47cf75f7038325 = "beta" | "ddim_uniform" | "exponential" | "karras" | "linear_quadratic" | "normal" | "sgm_uniform" | "simple"
      type E_1f08f73a9a576ae570aa3d82ea94f2bcfc29a8fc = "AOM3A3_orangemixs.safetensors" | "photon_v1.safetensors"
      type E_621a1d2d13812defa70c4b6ec953d17713bd232a = "vae-ft-mse-840000-ema-pruned.safetensors"
      type E_6e6cbf6c48411ad480e010b0c9d2434b41af430d = "area" | "bicubic" | "bilinear" | "bislerp" | "nearest-exact"
      type E_e2779c2a162ed54d5841127cc2968e8d50f5e431 = "center" | "disabled"
      type E_26ea5ad8c44c9551fea858fff18017427386b591 = "example.png"
      type E_19d5be39f1fd20a88fdbcb009a06c7df2b0ef998 = "alpha" | "blue" | "green" | "red"
      type E_165b455eb22956fc9da6e1b76d49a4077f15d897 = "area" | "bicubic" | "bilinear" | "lanczos" | "nearest-exact"
      type E_046ed3ef4b2b9a9cfdb62e53a70fe767fb996451 = "default" | "mask bounds"
      type E_449b4cae3566dd9b97c417c352bb08e25b89431b = "disable" | "enable"
      type E_061551528c540e0171a9c88a94c7d5375aa31f8a = "180 degrees" | "270 degrees" | "90 degrees" | "none"
      type E_cdf7071acecb5016da941b6e718b82c97248a3e4 = "x-axis: vertically" | "y-axis: horizontally"
      type E_779f30207c92fb9c40d7af879864067c0972d190 = '🔴' // never
      type E_766fb79b4f3904a6716246cfb2a33b7b9e6a08c4 = "mochi" | "sd3" | "stable_audio" | "stable_cascade" | "stable_diffusion"
      type E_21ba65fbb0df707c108b25356a3507e13f21ea58 = "default" | "fp8_e4m3fn" | "fp8_e4m3fn_fast" | "fp8_e5m2"
      type E_39292df8ce88fd66f0dacf6f9110cfa2594ca25c = "flux" | "sd3" | "sdxl"
      type E_a1972c9480c542a0e8ccafa03c2572ba5fc62160 = "anything_v3.yaml" | "v1-inference.yaml" | "v1-inference_clip_skip_2.yaml" | "v1-inference_clip_skip_2_fp16.yaml" | "v1-inference_fp16.yaml" | "v1-inpainting-inference.yaml" | "v2-inference-v.yaml" | "v2-inference-v_fp32.yaml" | "v2-inference.yaml" | "v2-inference_fp32.yaml" | "v2-inpainting-inference.yaml"
      type E_1d09df0c3ce1b4556d07af26e593d4033efc639b = "fixed" | "random"
      type E_2504d8563e078c3ed105667cbb6d0ff714d5798b = "RealESRGAN_x4plus.pth" | "RealESRGAN_x4plus_anime_6B.pth"
      type E_4ca09d2bc16d4174960bd60a103d4c0911361855 = "difference" | "multiply" | "normal" | "overlay" | "screen" | "soft_light"
      type E_7c2feaebcf0bbbcda0fe9f3c8cba1cf87002bc0e = "bayer-16" | "bayer-2" | "bayer-4" | "bayer-8" | "floyd-steinberg" | "none"
      type E_88c0c90dbad3b41c3c4a4f8a89afad7b1c0db2e0 = "add" | "and" | "multiply" | "or" | "subtract" | "xor"
      type E_d954b5ae44db00529f0fd0bfb816e25c12617df8 = "ADD" | "CLEAR" | "DARKEN" | "DST" | "DST_ATOP" | "DST_IN" | "DST_OUT" | "DST_OVER" | "LIGHTEN" | "MULTIPLY" | "OVERLAY" | "SCREEN" | "SRC" | "SRC_ATOP" | "SRC_IN" | "SRC_OUT" | "SRC_OVER" | "XOR"
      type E_928b7403128cb25513cafc463a76a922ba5d4bd0 = "cpu" | "gpu"
      type E_148e0bc88719e23ec2f2c80871fe45ae759cd7e1 = "heun" | "midpoint"
      type E_e89ec78e24ca5e9c91264b9e9b5ed722d2b509dc = "eps" | "lcm" | "v_prediction" | "x0"
      type E_bf8a83a3d55d70c688644bf18edaf23501f7c168 = "edm_playground_v2.5" | "eps" | "v_prediction"
      type E_3c3164c6c468d61dfa20092960e3d7854495e50c = "v_prediction"
      type E_253b68425542d8144b2b8a7af90f057b41939f63 = "default" | "fastest" | "slowest"
      type E_6ba03252ec9c8111f7381dfb573cd99c2b4d0e3b = "bottom_hat" | "close" | "dilate" | "erode" | "gradient" | "open" | "top_hat"
      type E_ec317371192386ae10cedaee29b315e900386a18 = "SD1" | "SDXL" | "SVD"
      type E_a8aa5eb2d828c2e279168c48955c7a0fe3ea011a = "alternative" | "regular"
      type E_270e152a81c37daf152e6cc67675baaafe058bc4 = "empty_prompt" | "none"
      type E_0e92c8b1b6fe90c3e343d8b54b531b9d887eee62 = "auto" | "canny/lineart/anime_lineart/mlsd" | "depth" | "hed/pidi/scribble/ted" | "normal" | "openpose" | "repaint" | "segment" | "tile"
      type E_b80b6129a942660e31e08221ee04a76f537556ce = "full_diff" | "standard"
      type E_4bbca93e426c35d56c43252f1fb21877d5e7a1aa = "cudagraphs" | "inductor"
      type E_40c777392f92d61852ab0f7a429a755abf59b71a = "ESAM" | "sam_vit_b_01ec64.pth"
      type E_2ad445b99254e9b51c963d9f1a75fabe3d01e569 = "AUTO" | "CPU" | "Prefer GPU"
      type E_720061fdb15e8c451b6aa7ed023644f064ddc57d = "AYS SD1" | "AYS SDXL" | "AYS SVD" | "GITS[coeff=1.2]" | "beta" | "ddim_uniform" | "exponential" | "karras" | "linear_quadratic" | "normal" | "sgm_uniform" | "simple"
      type E_40275a874822a8699ee13794e127b63cdd6bfdae = "center-1" | "diamond-4" | "horizontal-2" | "mask-area" | "mask-point-bbox" | "mask-points" | "none" | "rect-4" | "vertical-2"
      type E_aa302307a82588b6e514aca43e4cddad342a73fc = "False" | "Outter" | "Small"
      type E_35e403c7628f220c07d5485d6e81fc66b4fc12df = "Select the LoRA to add to the text"
      type E_6064bbaf780c2c055e640cd3feaaf15ad2f2bb26 = "Select the Wildcard to add to the text"
      type E_f9c5efbc827613eb902695cd0a25738ee31c607d = "area" | "bilinear" | "lanczos" | "nearest-exact"
      type E_4724269c8f643d5efa98f97e1e55a7ddfe6aac6c = "geometric" | "simple"
      type E_304f89a0de34643f12756237824e7261db28aaf5 = "padded" | "random" | "simple"
      type E_de6a9887e0bfe301f572e929959509ed64574d1b = "interleave1" | "interleave1+last1" | "interleave2" | "interleave2+last1" | "interleave3" | "interleave3+last1" | "last1" | "last2" | "none"
      type E_0f7d0d088b6ea936fb25b477722d734706fe8b40 = "simple"
      type E_3dfc15432d4b952e91053feecd5a5427720957fc = "CPU" | "GPU"
      type E_d4b6506ab5528aeab8952aa9d308dbc242d01e63 = "512x512" | "512x768" | "768x512" | "768x768"
      type E_afbc7832ad78555d4f5646f97ed21b561fe3d1f0 = "from_start" | "skip_start"
      type E_87bec9aa0dfe9b9678fd35387106d931d78358cd = "area(=w*h)" | "height" | "width" | "x1" | "x2" | "y1" | "y2"
      type E_aceb55e7f03fcbc2a78383bd8ddff8676e42e536 = "area(=w*h)" | "height" | "length_percent" | "width" | "x1" | "x2" | "y1" | "y2"
      type E_cc1f262afc534d382e5c36082cecd4fc2a9c4ffb = "airplane" | "all" | "apple" | "backpack" | "banana" | "baseball bat" | "baseball glove" | "bear" | "bed" | "bench" | "bicycle" | "bird" | "boat" | "book" | "bottle" | "bowl" | "broccoli" | "bus" | "cake" | "car" | "carrot" | "cat" | "cell phone" | "chair" | "clock" | "couch" | "cow" | "cup" | "dining table" | "dog" | "donut" | "elephant" | "eyebrows" | "eyes" | "face" | "fire hydrant" | "fork" | "frisbee" | "giraffe" | "hair drier" | "hand" | "handbag" | "horse" | "hot dog" | "keyboard" | "kite" | "knife" | "laptop" | "left_eye" | "left_eyebrow" | "left_pupil" | "long_sleeved_dress" | "long_sleeved_outwear" | "long_sleeved_shirt" | "microwave" | "motorcycle" | "mouse" | "mouth" | "orange" | "oven" | "parking meter" | "person" | "pizza" | "potted plant" | "pupils" | "refrigerator" | "remote" | "right_eye" | "right_eyebrow" | "right_pupil" | "sandwich" | "scissors" | "sheep" | "short_sleeved_dress" | "short_sleeved_outwear" | "short_sleeved_shirt" | "shorts" | "sink" | "skateboard" | "skirt" | "skis" | "sling" | "sling_dress" | "snowboard" | "spoon" | "sports ball" | "stop sign" | "suitcase" | "surfboard" | "teddy bear" | "tennis racket" | "tie" | "toaster" | "toilet" | "toothbrush" | "traffic light" | "train" | "trousers" | "truck" | "tv" | "umbrella" | "vase" | "vest" | "vest_dress" | "wine glass" | "zebra"
      type E_e5ef6b688dbafd88538e80bf002826bade4bb121 = "Combine neighboring frames" | "Don't combine" | "Pivot SEGS"
      type E_651ea09f69db9a1eb817103d1ea8e3ac08b4a319 = "1st frame mask" | "Combined mask"
      type E_05cddbad13b094c2641c6bb7d261e15c71efc903 = "channel penalty" | "linear" | "original"
      type E_055d80a7c582bd5b57fd6775414e697be3f0f580 = "add" | "average" | "concat" | "norm average" | "subtract"
      type E_f27fae3205ecf36e9f4a68f3867d38e025476963 = "always" | "if_same_size" | "never"
      type E_ea287ec9983f05378f2614091804a1b6b95d1c79 = "Latent2RGB-FLUX.1" | "Latent2RGB-Playground-2.5" | "Latent2RGB-SC-B" | "Latent2RGB-SC-Prior" | "Latent2RGB-SD-X4" | "Latent2RGB-SD15" | "Latent2RGB-SD3" | "Latent2RGB-SDXL" | "TAEF1" | "TAESD15" | "TAESD3" | "TAESDXL"
      type E_fa4a13687b111fa33a8c8fa375d5321d09b46b27 = "Latent2RGB-SD15" | "Latent2RGB-SDXL" | "TAESD15" | "TAESDXL"
      type E_bac912b55de8a59480c74aba068f4a3b5f9a0e38 = "bicubic" | "bilinear" | "lanczos" | "nearest"
      type E_c1a74591678033a2ccc87aa0add77dab7f001da5 = "false" | "true"
      type E_5cc1495fe28eac05289d45b29269b31c6edca055 = "All random fast" | "All random quality" | "Reuse fast" | "Reuse quality"
      type E_d5776f669e41b2ec29cd020ce34a8b7cdf23693d = "Both" | "Decode(input) only" | "Encode(output) only" | "None"
      type E_1e8364b55644fdbf6d28dd3e6197d9fe1777e361 = "decrement" | "fixed" | "ignore" | "increment" | "randomize" | "seed+seed_2nd" | "seed-seed_2nd"
      type E_db19bd49ccd13456a936f2070c088f16070aa0b1 = "DISABLE" | "ratio additional" | "ratio between"
      type E_3fd6d592305b0bc44ce9c69a23201f8d7a155884 = "AUTO" | "ddpm" | "dpm_2" | "dpm_fast" | "dpmpp_2m" | "euler" | "heun" | "heunpp2"
      type E_627d63e970919d713af795854ffd9dd2642f92d2 = "linear" | "slerp"
      type E_10c017f4a76414789a861361dc5cdbfef12e2d7d = "area(=w*h)" | "confidence(0-100)" | "height" | "length_percent" | "width" | "x1" | "x2" | "y1" | "y2"
      type E_b1f554e93f550a374a1ff740ad7447a7b34b71be = "area(=w*h)" | "confidence" | "height" | "width" | "x1" | "x2" | "y1" | "y2"
      type E_87d3a21083ff67c538309f218241f70a793f619c = "a < b" | "a <= b" | "a <> b" | "a = b" | "a > b" | "a >= b" | "ff" | "tt"
      type E_99d83eba8f2a90cc88da26295981d92d458e4e14 = "and" | "or" | "xor"
      type E_6c86e4efdc8db8dae17215fbf80825ddaad06ffa = "BOOLEAN" | "FLOAT" | "INT" | "STRING"
      type E_383642e8f2544ff8678e350c4f1049624ad6589e = "Bypass" | "Mute" | "Stop"
      type E_7fd75955db2b2e81b87d8452255b37c2d98fd105 = "Leilab/gender_class" | "Manual repo id" | "NTQAI/pedestrian_gender_recognition" | "ProjectPersonal/GenderClassifier" | "cledoux42/GenderNew_v002" | "crangana/trained-gender" | "ivensamdh/genderage2" | "rizvandwiki/gender-classification-2"
      type E_01400d675e59295302197d02289e89ead401098e = "#Female < #Male" | "#Female > #Male" | "Age16to25 > 0.1" | "Age50to69 > 0.1" | "Manual expr" | "female > 0.5" | "male > 0.5"
      type E_64bb9134d159ff7e3f573facb7cb2fcfbb2de483 = "AYS SD1" | "AYS SDXL" | "AYS SVD" | "GITS[coeff=1.2]" | "None"
      type E_cf11746957b2cb2b6379bbd08fe59610b2aae90a = "bbox/face_yolov8m.pt" | "bbox/hand_yolov8s.pt" | "segm/person_yolov8m-seg.pt"
   }
   
   // 7. INTERFACES --------------------------
   export interface HasSingle_SEG_ELT_control_net_wrapper { _SEG_ELT_control_net_wrapper: ComfyNodeOutput<'SEG_ELT_control_net_wrapper'> } // prettier-ignore
   export interface HasSingle_TRANSFORMERS_CLASSIFIER { _TRANSFORMERS_CLASSIFIER: ComfyNodeOutput<'TRANSFORMERS_CLASSIFIER'> } // prettier-ignore
   export interface HasSingle_SEG_ELT_crop_region { _SEG_ELT_crop_region: ComfyNodeOutput<'SEG_ELT_crop_region'> } // prettier-ignore
   export interface HasSingle_CLIP_VISION_OUTPUT { _CLIP_VISION_OUTPUT: ComfyNodeOutput<'CLIP_VISION_OUTPUT'> } // prettier-ignore
   export interface HasSingle_BOOLEAN { _BOOLEAN: boolean | ComfyNodeOutput<'BOOLEAN'> } // prettier-ignore
   export interface HasSingle_SEGS_PREPROCESSOR { _SEGS_PREPROCESSOR: ComfyNodeOutput<'SEGS_PREPROCESSOR'> } // prettier-ignore
   export interface HasSingle_KSAMPLER_ADVANCED { _KSAMPLER_ADVANCED: ComfyNodeOutput<'KSAMPLER_ADVANCED'> } // prettier-ignore
   export interface HasSingle_LATENT_OPERATION { _LATENT_OPERATION: ComfyNodeOutput<'LATENT_OPERATION'> } // prettier-ignore
   export interface HasSingle_REGIONAL_PROMPTS { _REGIONAL_PROMPTS: ComfyNodeOutput<'REGIONAL_PROMPTS'> } // prettier-ignore
   export interface HasSingle_STRING { _STRING: string | ComfyNodeOutput<'STRING'> } // prettier-ignore
   export interface HasSingle_FLOAT { _FLOAT: number | ComfyNodeOutput<'FLOAT'> } // prettier-ignore
   export interface HasSingle_SCHEDULER_FUNC { _SCHEDULER_FUNC: ComfyNodeOutput<'SCHEDULER_FUNC'> } // prettier-ignore
   export interface HasSingle_IPADAPTER_PIPE { _IPADAPTER_PIPE: ComfyNodeOutput<'IPADAPTER_PIPE'> } // prettier-ignore
   export interface HasSingle_UPSCALE_MODEL { _UPSCALE_MODEL: ComfyNodeOutput<'UPSCALE_MODEL'> } // prettier-ignore
   export interface HasSingle_BBOX_DETECTOR { _BBOX_DETECTOR: ComfyNodeOutput<'BBOX_DETECTOR'> } // prettier-ignore
   export interface HasSingle_DETAILER_HOOK { _DETAILER_HOOK: ComfyNodeOutput<'DETAILER_HOOK'> } // prettier-ignore
   export interface HasSingle_DETAILER_PIPE { _DETAILER_PIPE: ComfyNodeOutput<'DETAILER_PIPE'> } // prettier-ignore
   export interface HasSingle_SEGM_DETECTOR { _SEGM_DETECTOR: ComfyNodeOutput<'SEGM_DETECTOR'> } // prettier-ignore
   export interface HasSingle_UPSCALER_HOOK { _UPSCALER_HOOK: ComfyNodeOutput<'UPSCALER_HOOK'> } // prettier-ignore
   export interface HasSingle_INT { _INT: number | ComfyNodeOutput<'INT'> } // prettier-ignore
   export interface HasSingle_CONDITIONING { _CONDITIONING: ComfyNodeOutput<'CONDITIONING'> } // prettier-ignore
   export interface HasSingle_SEG_ELT_bbox { _SEG_ELT_bbox: ComfyNodeOutput<'SEG_ELT_bbox'> } // prettier-ignore
   export interface HasSingle_CLIP_VISION { _CLIP_VISION: ComfyNodeOutput<'CLIP_VISION'> } // prettier-ignore
   export interface HasSingle_STYLE_MODEL { _STYLE_MODEL: ComfyNodeOutput<'STYLE_MODEL'> } // prettier-ignore
   export interface HasSingle_CONTROL_NET { _CONTROL_NET: ComfyNodeOutput<'CONTROL_NET'> } // prettier-ignore
   export interface HasSingle_SEGS_HEADER { _SEGS_HEADER: ComfyNodeOutput<'SEGS_HEADER'> } // prettier-ignore
   export interface HasSingle_PHOTOMAKER { _PHOTOMAKER: ComfyNodeOutput<'PHOTOMAKER'> } // prettier-ignore
   export interface HasSingle_BASIC_PIPE { _BASIC_PIPE: ComfyNodeOutput<'BASIC_PIPE'> } // prettier-ignore
   export interface HasSingle_SAM_MODEL { _SAM_MODEL: ComfyNodeOutput<'SAM_MODEL'> } // prettier-ignore
   export interface HasSingle_UPSCALER { _UPSCALER: ComfyNodeOutput<'UPSCALER'> } // prettier-ignore
   export interface HasSingle_KSAMPLER { _KSAMPLER: ComfyNodeOutput<'KSAMPLER'> } // prettier-ignore
   export interface HasSingle_SAMPLER { _SAMPLER: ComfyNodeOutput<'SAMPLER'> } // prettier-ignore
   export interface HasSingle_PK_HOOK { _PK_HOOK: ComfyNodeOutput<'PK_HOOK'> } // prettier-ignore
   export interface HasSingle_SEG_ELT { _SEG_ELT: ComfyNodeOutput<'SEG_ELT'> } // prettier-ignore
   export interface HasSingle_LATENT { _LATENT: ComfyNodeOutput<'LATENT'> } // prettier-ignore
   export interface HasSingle_GLIGEN { _GLIGEN: ComfyNodeOutput<'GLIGEN'> } // prettier-ignore
   export interface HasSingle_SIGMAS { _SIGMAS: ComfyNodeOutput<'SIGMAS'> } // prettier-ignore
   export interface HasSingle_GUIDER { _GUIDER: ComfyNodeOutput<'GUIDER'> } // prettier-ignore
   export interface HasSingle_WEBCAM { _WEBCAM: ComfyNodeOutput<'WEBCAM'> } // prettier-ignore
   export interface HasSingle_MODEL { _MODEL: ComfyNodeOutput<'MODEL'> } // prettier-ignore
   export interface HasSingle_IMAGE { _IMAGE: ComfyNodeOutput<'IMAGE'> } // prettier-ignore
   export interface HasSingle_NOISE { _NOISE: ComfyNodeOutput<'NOISE'> } // prettier-ignore
   export interface HasSingle_AUDIO { _AUDIO: ComfyNodeOutput<'AUDIO'> } // prettier-ignore
   export interface HasSingle_$Star { _$Star: ComfyNodeOutput<'$Star'> } // prettier-ignore
   export interface HasSingle_CLIP { _CLIP: ComfyNodeOutput<'CLIP'> } // prettier-ignore
   export interface HasSingle_MASK { _MASK: ComfyNodeOutput<'MASK'> } // prettier-ignore
   export interface HasSingle_SEGS { _SEGS: ComfyNodeOutput<'SEGS'> } // prettier-ignore
   export interface HasSingle_VAE { _VAE: ComfyNodeOutput<'VAE'> } // prettier-ignore
   export interface HasSingle_E_720061fdb15e8c451b6aa7ed023644f064ddc57d { _E_720061fdb15e8c451b6aa7ed023644f064ddc57d: Comfy.Union.E_720061fdb15e8c451b6aa7ed023644f064ddc57d } // prettier-ignore
   
   // 8.2 NODE UI helpers --------------------
   export interface FormHelper {
    KSampler: {
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
    }
    CheckpointLoaderSimple: {
    }
    CLIPTextEncode: {
        text: { kind: 'string', type: string }
    }
    CLIPSetLastLayer: {
        stop_at_clip_layer: { kind: 'number', type: number }
    }
    VAEDecode: {
    }
    VAEEncode: {
    }
    VAEEncodeForInpaint: {
        grow_mask_by: { kind: 'number', type: number }
    }
    VAELoader: {
    }
    EmptyLatentImage: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        batch_size: { kind: 'number', type: number }
    }
    LatentUpscale: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
    }
    LatentUpscaleBy: {
        scale_by: { kind: 'number', type: number }
    }
    LatentFromBatch: {
        batch_index: { kind: 'number', type: number }
        length: { kind: 'number', type: number }
    }
    RepeatLatentBatch: {
        amount: { kind: 'number', type: number }
    }
    SaveImage: {
        filename_prefix: { kind: 'string', type: string }
    }
    PreviewImage: {
    }
    LoadImage: {
    }
    LoadImageMask: {
    }
    ImageScale: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
    }
    ImageScaleBy: {
        scale_by: { kind: 'number', type: number }
    }
    ImageInvert: {
    }
    ImageBatch: {
    }
    ImagePadForOutpaint: {
        left: { kind: 'number', type: number }
        top: { kind: 'number', type: number }
        right: { kind: 'number', type: number }
        bottom: { kind: 'number', type: number }
        feathering: { kind: 'number', type: number }
    }
    EmptyImage: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        batch_size: { kind: 'number', type: number }
        color: { kind: 'number', type: number }
    }
    ConditioningAverage: {
        conditioning_to_strength: { kind: 'number', type: number }
    }
    ConditioningCombine: {
    }
    ConditioningConcat: {
    }
    ConditioningSetArea: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        x: { kind: 'number', type: number }
        y: { kind: 'number', type: number }
        strength: { kind: 'number', type: number }
    }
    ConditioningSetAreaPercentage: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        x: { kind: 'number', type: number }
        y: { kind: 'number', type: number }
        strength: { kind: 'number', type: number }
    }
    ConditioningSetAreaStrength: {
        strength: { kind: 'number', type: number }
    }
    ConditioningSetMask: {
        strength: { kind: 'number', type: number }
    }
    KSamplerAdvanced: {
        noise_seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        start_at_step: { kind: 'number', type: number }
        end_at_step: { kind: 'number', type: number }
    }
    SetLatentNoiseMask: {
    }
    LatentComposite: {
        x: { kind: 'number', type: number }
        y: { kind: 'number', type: number }
        feather: { kind: 'number', type: number }
    }
    LatentBlend: {
        blend_factor: { kind: 'number', type: number }
    }
    LatentRotate: {
    }
    LatentFlip: {
    }
    LatentCrop: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        x: { kind: 'number', type: number }
        y: { kind: 'number', type: number }
    }
    LoraLoader: {
        strength_model: { kind: 'number', type: number }
        strength_clip: { kind: 'number', type: number }
    }
    CLIPLoader: {
    }
    UNETLoader: {
    }
    DualCLIPLoader: {
    }
    CLIPVisionEncode: {
    }
    StyleModelApply: {
    }
    unCLIPConditioning: {
        strength: { kind: 'number', type: number }
        noise_augmentation: { kind: 'number', type: number }
    }
    ControlNetApply: {
        strength: { kind: 'number', type: number }
    }
    ControlNetApplyAdvanced: {
        strength: { kind: 'number', type: number }
        start_percent: { kind: 'number', type: number }
        end_percent: { kind: 'number', type: number }
    }
    ControlNetLoader: {
    }
    DiffControlNetLoader: {
    }
    StyleModelLoader: {
    }
    CLIPVisionLoader: {
    }
    VAEDecodeTiled: {
        tile_size: { kind: 'number', type: number }
    }
    VAEEncodeTiled: {
        tile_size: { kind: 'number', type: number }
    }
    unCLIPCheckpointLoader: {
    }
    GLIGENLoader: {
    }
    GLIGENTextBoxApply: {
        text: { kind: 'string', type: string }
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        x: { kind: 'number', type: number }
        y: { kind: 'number', type: number }
    }
    InpaintModelConditioning: {
    }
    CheckpointLoader: {
    }
    DiffusersLoader: {
    }
    LoadLatent: {
    }
    SaveLatent: {
        filename_prefix: { kind: 'string', type: string }
    }
    ConditioningZeroOut: {
    }
    ConditioningSetTimestepRange: {
        start: { kind: 'number', type: number }
        end: { kind: 'number', type: number }
    }
    LoraLoaderModelOnly: {
        strength_model: { kind: 'number', type: number }
    }
    LatentAdd: {
    }
    LatentSubtract: {
    }
    LatentMultiply: {
        multiplier: { kind: 'number', type: number }
    }
    LatentInterpolate: {
        ratio: { kind: 'number', type: number }
    }
    LatentBatch: {
    }
    LatentBatchSeedBehavior: {
    }
    LatentApplyOperation: {
    }
    LatentApplyOperationCFG: {
    }
    LatentOperationTonemapReinhard: {
        multiplier: { kind: 'number', type: number }
    }
    LatentOperationSharpen: {
        sharpen_radius: { kind: 'number', type: number }
        sigma: { kind: 'number', type: number }
        alpha: { kind: 'number', type: number }
    }
    HypernetworkLoader: {
        strength: { kind: 'number', type: number }
    }
    UpscaleModelLoader: {
    }
    ImageUpscaleWithModel: {
    }
    ImageBlend: {
        blend_factor: { kind: 'number', type: number }
    }
    ImageBlur: {
        blur_radius: { kind: 'number', type: number }
        sigma: { kind: 'number', type: number }
    }
    ImageQuantize: {
        colors: { kind: 'number', type: number }
    }
    ImageSharpen: {
        sharpen_radius: { kind: 'number', type: number }
        sigma: { kind: 'number', type: number }
        alpha: { kind: 'number', type: number }
    }
    ImageScaleToTotalPixels: {
        megapixels: { kind: 'number', type: number }
    }
    LatentCompositeMasked: {
        x: { kind: 'number', type: number }
        y: { kind: 'number', type: number }
        resize_source: { kind: 'boolean', type: boolean }
    }
    ImageCompositeMasked: {
        x: { kind: 'number', type: number }
        y: { kind: 'number', type: number }
        resize_source: { kind: 'boolean', type: boolean }
    }
    MaskToImage: {
    }
    ImageToMask: {
    }
    ImageColorToMask: {
        color: { kind: 'number', type: number }
    }
    SolidMask: {
        value: { kind: 'number', type: number }
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
    }
    InvertMask: {
    }
    CropMask: {
        x: { kind: 'number', type: number }
        y: { kind: 'number', type: number }
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
    }
    MaskComposite: {
        x: { kind: 'number', type: number }
        y: { kind: 'number', type: number }
    }
    FeatherMask: {
        left: { kind: 'number', type: number }
        top: { kind: 'number', type: number }
        right: { kind: 'number', type: number }
        bottom: { kind: 'number', type: number }
    }
    GrowMask: {
        expand: { kind: 'number', type: number }
        tapered_corners: { kind: 'boolean', type: boolean }
    }
    ThresholdMask: {
        value: { kind: 'number', type: number }
    }
    PorterDuffImageComposite: {
    }
    SplitImageWithAlpha: {
    }
    JoinImageWithAlpha: {
    }
    RebatchLatents: {
        batch_size: { kind: 'number', type: number }
    }
    RebatchImages: {
        batch_size: { kind: 'number', type: number }
    }
    ModelMergeSimple: {
        ratio: { kind: 'number', type: number }
    }
    ModelMergeBlocks: {
        input: { kind: 'number', type: number }
        middle: { kind: 'number', type: number }
        out: { kind: 'number', type: number }
    }
    ModelMergeSubtract: {
        multiplier: { kind: 'number', type: number }
    }
    ModelMergeAdd: {
    }
    CheckpointSave: {
        filename_prefix: { kind: 'string', type: string }
    }
    CLIPMergeSimple: {
        ratio: { kind: 'number', type: number }
    }
    CLIPMergeSubtract: {
        multiplier: { kind: 'number', type: number }
    }
    CLIPMergeAdd: {
    }
    CLIPSave: {
        filename_prefix: { kind: 'string', type: string }
    }
    VAESave: {
        filename_prefix: { kind: 'string', type: string }
    }
    ModelSave: {
        filename_prefix: { kind: 'string', type: string }
    }
    TomePatchModel: {
        ratio: { kind: 'number', type: number }
    }
    CLIPTextEncodeSDXLRefiner: {
        ascore: { kind: 'number', type: number }
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        text: { kind: 'string', type: string }
    }
    CLIPTextEncodeSDXL: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        crop_w: { kind: 'number', type: number }
        crop_h: { kind: 'number', type: number }
        target_width: { kind: 'number', type: number }
        target_height: { kind: 'number', type: number }
        text_g: { kind: 'string', type: string }
        text_l: { kind: 'string', type: string }
    }
    Canny: {
        low_threshold: { kind: 'number', type: number }
        high_threshold: { kind: 'number', type: number }
    }
    FreeU: {
        b1: { kind: 'number', type: number }
        b2: { kind: 'number', type: number }
        s1: { kind: 'number', type: number }
        s2: { kind: 'number', type: number }
    }
    FreeU$_V2: {
        b1: { kind: 'number', type: number }
        b2: { kind: 'number', type: number }
        s1: { kind: 'number', type: number }
        s2: { kind: 'number', type: number }
    }
    SamplerCustom: {
        add_noise: { kind: 'boolean', type: boolean }
        noise_seed: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
    }
    BasicScheduler: {
        steps: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
    }
    KarrasScheduler: {
        steps: { kind: 'number', type: number }
        sigma_max: { kind: 'number', type: number }
        sigma_min: { kind: 'number', type: number }
        rho: { kind: 'number', type: number }
    }
    ExponentialScheduler: {
        steps: { kind: 'number', type: number }
        sigma_max: { kind: 'number', type: number }
        sigma_min: { kind: 'number', type: number }
    }
    PolyexponentialScheduler: {
        steps: { kind: 'number', type: number }
        sigma_max: { kind: 'number', type: number }
        sigma_min: { kind: 'number', type: number }
        rho: { kind: 'number', type: number }
    }
    LaplaceScheduler: {
        steps: { kind: 'number', type: number }
        sigma_max: { kind: 'number', type: number }
        sigma_min: { kind: 'number', type: number }
        mu: { kind: 'number', type: number }
        beta: { kind: 'number', type: number }
    }
    VPScheduler: {
        steps: { kind: 'number', type: number }
        beta_d: { kind: 'number', type: number }
        beta_min: { kind: 'number', type: number }
        eps_s: { kind: 'number', type: number }
    }
    BetaSamplingScheduler: {
        steps: { kind: 'number', type: number }
        alpha: { kind: 'number', type: number }
        beta: { kind: 'number', type: number }
    }
    SDTurboScheduler: {
        steps: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
    }
    KSamplerSelect: {
    }
    SamplerEulerAncestral: {
        eta: { kind: 'number', type: number }
        s_noise: { kind: 'number', type: number }
    }
    SamplerEulerAncestralCFGPP: {
        eta: { kind: 'number', type: number }
        s_noise: { kind: 'number', type: number }
    }
    SamplerLMS: {
        order: { kind: 'number', type: number }
    }
    SamplerDPMPP$_3M$_SDE: {
        eta: { kind: 'number', type: number }
        s_noise: { kind: 'number', type: number }
    }
    SamplerDPMPP$_2M$_SDE: {
        eta: { kind: 'number', type: number }
        s_noise: { kind: 'number', type: number }
    }
    SamplerDPMPP$_SDE: {
        eta: { kind: 'number', type: number }
        s_noise: { kind: 'number', type: number }
        r: { kind: 'number', type: number }
    }
    SamplerDPMPP$_2S$_Ancestral: {
        eta: { kind: 'number', type: number }
        s_noise: { kind: 'number', type: number }
    }
    SamplerDPMAdaptative: {
        order: { kind: 'number', type: number }
        rtol: { kind: 'number', type: number }
        atol: { kind: 'number', type: number }
        h_init: { kind: 'number', type: number }
        pcoeff: { kind: 'number', type: number }
        icoeff: { kind: 'number', type: number }
        dcoeff: { kind: 'number', type: number }
        accept_safety: { kind: 'number', type: number }
        eta: { kind: 'number', type: number }
        s_noise: { kind: 'number', type: number }
    }
    SplitSigmas: {
        step: { kind: 'number', type: number }
    }
    SplitSigmasDenoise: {
        denoise: { kind: 'number', type: number }
    }
    FlipSigmas: {
    }
    CFGGuider: {
        cfg: { kind: 'number', type: number }
    }
    DualCFGGuider: {
        cfg_conds: { kind: 'number', type: number }
        cfg_cond2_negative: { kind: 'number', type: number }
    }
    BasicGuider: {
    }
    RandomNoise: {
        noise_seed: { kind: 'number', type: number }
    }
    DisableNoise: {
    }
    AddNoise: {
    }
    SamplerCustomAdvanced: {
    }
    HyperTile: {
        tile_size: { kind: 'number', type: number }
        swap_size: { kind: 'number', type: number }
        max_depth: { kind: 'number', type: number }
        scale_depth: { kind: 'boolean', type: boolean }
    }
    ModelSamplingDiscrete: {
        zsnr: { kind: 'boolean', type: boolean }
    }
    ModelSamplingContinuousEDM: {
        sigma_max: { kind: 'number', type: number }
        sigma_min: { kind: 'number', type: number }
    }
    ModelSamplingContinuousV: {
        sigma_max: { kind: 'number', type: number }
        sigma_min: { kind: 'number', type: number }
    }
    ModelSamplingStableCascade: {
        shift: { kind: 'number', type: number }
    }
    ModelSamplingSD3: {
        shift: { kind: 'number', type: number }
    }
    ModelSamplingAuraFlow: {
        shift: { kind: 'number', type: number }
    }
    ModelSamplingFlux: {
        max_shift: { kind: 'number', type: number }
        base_shift: { kind: 'number', type: number }
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
    }
    RescaleCFG: {
        multiplier: { kind: 'number', type: number }
    }
    PatchModelAddDownscale: {
        block_number: { kind: 'number', type: number }
        downscale_factor: { kind: 'number', type: number }
        start_percent: { kind: 'number', type: number }
        end_percent: { kind: 'number', type: number }
        downscale_after_skip: { kind: 'boolean', type: boolean }
    }
    ImageCrop: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        x: { kind: 'number', type: number }
        y: { kind: 'number', type: number }
    }
    RepeatImageBatch: {
        amount: { kind: 'number', type: number }
    }
    ImageFromBatch: {
        batch_index: { kind: 'number', type: number }
        length: { kind: 'number', type: number }
    }
    SaveAnimatedWEBP: {
        filename_prefix: { kind: 'string', type: string }
        fps: { kind: 'number', type: number }
        lossless: { kind: 'boolean', type: boolean }
        quality: { kind: 'number', type: number }
    }
    SaveAnimatedPNG: {
        filename_prefix: { kind: 'string', type: string }
        fps: { kind: 'number', type: number }
        compress_level: { kind: 'number', type: number }
    }
    ImageOnlyCheckpointLoader: {
    }
    SVD$_img2vid$_Conditioning: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        video_frames: { kind: 'number', type: number }
        motion_bucket_id: { kind: 'number', type: number }
        fps: { kind: 'number', type: number }
        augmentation_level: { kind: 'number', type: number }
    }
    VideoLinearCFGGuidance: {
        min_cfg: { kind: 'number', type: number }
    }
    VideoTriangleCFGGuidance: {
        min_cfg: { kind: 'number', type: number }
    }
    ImageOnlyCheckpointSave: {
        filename_prefix: { kind: 'string', type: string }
    }
    SelfAttentionGuidance: {
        scale: { kind: 'number', type: number }
        blur_sigma: { kind: 'number', type: number }
    }
    PerpNeg: {
        neg_scale: { kind: 'number', type: number }
    }
    PerpNegGuider: {
        cfg: { kind: 'number', type: number }
        neg_scale: { kind: 'number', type: number }
    }
    StableZero123$_Conditioning: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        batch_size: { kind: 'number', type: number }
        elevation: { kind: 'number', type: number }
        azimuth: { kind: 'number', type: number }
    }
    StableZero123$_Conditioning$_Batched: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        batch_size: { kind: 'number', type: number }
        elevation: { kind: 'number', type: number }
        azimuth: { kind: 'number', type: number }
        elevation_batch_increment: { kind: 'number', type: number }
        azimuth_batch_increment: { kind: 'number', type: number }
    }
    SV3D$_Conditioning: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        video_frames: { kind: 'number', type: number }
        elevation: { kind: 'number', type: number }
    }
    SD$_4XUpscale$_Conditioning: {
        scale_ratio: { kind: 'number', type: number }
        noise_augmentation: { kind: 'number', type: number }
    }
    PhotoMakerLoader: {
    }
    PhotoMakerEncode: {
        text: { kind: 'string', type: string }
    }
    CLIPTextEncodeControlnet: {
        text: { kind: 'string', type: string }
    }
    Morphology: {
        kernel_size: { kind: 'number', type: number }
    }
    StableCascade$_EmptyLatentImage: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        compression: { kind: 'number', type: number }
        batch_size: { kind: 'number', type: number }
    }
    StableCascade$_StageB$_Conditioning: {
    }
    StableCascade$_StageC$_VAEEncode: {
        compression: { kind: 'number', type: number }
    }
    StableCascade$_SuperResolutionControlnet: {
    }
    DifferentialDiffusion: {
    }
    InstructPixToPixConditioning: {
    }
    ModelMergeSD1: {
        "time_embed.": { kind: 'number', type: number }
        "label_emb.": { kind: 'number', type: number }
        "input_blocks.0.": { kind: 'number', type: number }
        "input_blocks.1.": { kind: 'number', type: number }
        "input_blocks.2.": { kind: 'number', type: number }
        "input_blocks.3.": { kind: 'number', type: number }
        "input_blocks.4.": { kind: 'number', type: number }
        "input_blocks.5.": { kind: 'number', type: number }
        "input_blocks.6.": { kind: 'number', type: number }
        "input_blocks.7.": { kind: 'number', type: number }
        "input_blocks.8.": { kind: 'number', type: number }
        "input_blocks.9.": { kind: 'number', type: number }
        "input_blocks.10.": { kind: 'number', type: number }
        "input_blocks.11.": { kind: 'number', type: number }
        "middle_block.0.": { kind: 'number', type: number }
        "middle_block.1.": { kind: 'number', type: number }
        "middle_block.2.": { kind: 'number', type: number }
        "output_blocks.0.": { kind: 'number', type: number }
        "output_blocks.1.": { kind: 'number', type: number }
        "output_blocks.2.": { kind: 'number', type: number }
        "output_blocks.3.": { kind: 'number', type: number }
        "output_blocks.4.": { kind: 'number', type: number }
        "output_blocks.5.": { kind: 'number', type: number }
        "output_blocks.6.": { kind: 'number', type: number }
        "output_blocks.7.": { kind: 'number', type: number }
        "output_blocks.8.": { kind: 'number', type: number }
        "output_blocks.9.": { kind: 'number', type: number }
        "output_blocks.10.": { kind: 'number', type: number }
        "output_blocks.11.": { kind: 'number', type: number }
        "out.": { kind: 'number', type: number }
    }
    ModelMergeSD2: {
        "time_embed.": { kind: 'number', type: number }
        "label_emb.": { kind: 'number', type: number }
        "input_blocks.0.": { kind: 'number', type: number }
        "input_blocks.1.": { kind: 'number', type: number }
        "input_blocks.2.": { kind: 'number', type: number }
        "input_blocks.3.": { kind: 'number', type: number }
        "input_blocks.4.": { kind: 'number', type: number }
        "input_blocks.5.": { kind: 'number', type: number }
        "input_blocks.6.": { kind: 'number', type: number }
        "input_blocks.7.": { kind: 'number', type: number }
        "input_blocks.8.": { kind: 'number', type: number }
        "input_blocks.9.": { kind: 'number', type: number }
        "input_blocks.10.": { kind: 'number', type: number }
        "input_blocks.11.": { kind: 'number', type: number }
        "middle_block.0.": { kind: 'number', type: number }
        "middle_block.1.": { kind: 'number', type: number }
        "middle_block.2.": { kind: 'number', type: number }
        "output_blocks.0.": { kind: 'number', type: number }
        "output_blocks.1.": { kind: 'number', type: number }
        "output_blocks.2.": { kind: 'number', type: number }
        "output_blocks.3.": { kind: 'number', type: number }
        "output_blocks.4.": { kind: 'number', type: number }
        "output_blocks.5.": { kind: 'number', type: number }
        "output_blocks.6.": { kind: 'number', type: number }
        "output_blocks.7.": { kind: 'number', type: number }
        "output_blocks.8.": { kind: 'number', type: number }
        "output_blocks.9.": { kind: 'number', type: number }
        "output_blocks.10.": { kind: 'number', type: number }
        "output_blocks.11.": { kind: 'number', type: number }
        "out.": { kind: 'number', type: number }
    }
    ModelMergeSDXL: {
        "time_embed.": { kind: 'number', type: number }
        "label_emb.": { kind: 'number', type: number }
        "input_blocks.0": { kind: 'number', type: number }
        "input_blocks.1": { kind: 'number', type: number }
        "input_blocks.2": { kind: 'number', type: number }
        "input_blocks.3": { kind: 'number', type: number }
        "input_blocks.4": { kind: 'number', type: number }
        "input_blocks.5": { kind: 'number', type: number }
        "input_blocks.6": { kind: 'number', type: number }
        "input_blocks.7": { kind: 'number', type: number }
        "input_blocks.8": { kind: 'number', type: number }
        "middle_block.0": { kind: 'number', type: number }
        "middle_block.1": { kind: 'number', type: number }
        "middle_block.2": { kind: 'number', type: number }
        "output_blocks.0": { kind: 'number', type: number }
        "output_blocks.1": { kind: 'number', type: number }
        "output_blocks.2": { kind: 'number', type: number }
        "output_blocks.3": { kind: 'number', type: number }
        "output_blocks.4": { kind: 'number', type: number }
        "output_blocks.5": { kind: 'number', type: number }
        "output_blocks.6": { kind: 'number', type: number }
        "output_blocks.7": { kind: 'number', type: number }
        "output_blocks.8": { kind: 'number', type: number }
        "out.": { kind: 'number', type: number }
    }
    ModelMergeSD3$_2B: {
        "pos_embed.": { kind: 'number', type: number }
        "x_embedder.": { kind: 'number', type: number }
        "context_embedder.": { kind: 'number', type: number }
        "y_embedder.": { kind: 'number', type: number }
        "t_embedder.": { kind: 'number', type: number }
        "joint_blocks.0.": { kind: 'number', type: number }
        "joint_blocks.1.": { kind: 'number', type: number }
        "joint_blocks.2.": { kind: 'number', type: number }
        "joint_blocks.3.": { kind: 'number', type: number }
        "joint_blocks.4.": { kind: 'number', type: number }
        "joint_blocks.5.": { kind: 'number', type: number }
        "joint_blocks.6.": { kind: 'number', type: number }
        "joint_blocks.7.": { kind: 'number', type: number }
        "joint_blocks.8.": { kind: 'number', type: number }
        "joint_blocks.9.": { kind: 'number', type: number }
        "joint_blocks.10.": { kind: 'number', type: number }
        "joint_blocks.11.": { kind: 'number', type: number }
        "joint_blocks.12.": { kind: 'number', type: number }
        "joint_blocks.13.": { kind: 'number', type: number }
        "joint_blocks.14.": { kind: 'number', type: number }
        "joint_blocks.15.": { kind: 'number', type: number }
        "joint_blocks.16.": { kind: 'number', type: number }
        "joint_blocks.17.": { kind: 'number', type: number }
        "joint_blocks.18.": { kind: 'number', type: number }
        "joint_blocks.19.": { kind: 'number', type: number }
        "joint_blocks.20.": { kind: 'number', type: number }
        "joint_blocks.21.": { kind: 'number', type: number }
        "joint_blocks.22.": { kind: 'number', type: number }
        "joint_blocks.23.": { kind: 'number', type: number }
        "final_layer.": { kind: 'number', type: number }
    }
    ModelMergeFlux1: {
        "img_in.": { kind: 'number', type: number }
        "time_in.": { kind: 'number', type: number }
        guidance_in: { kind: 'number', type: number }
        "vector_in.": { kind: 'number', type: number }
        "txt_in.": { kind: 'number', type: number }
        "double_blocks.0.": { kind: 'number', type: number }
        "double_blocks.1.": { kind: 'number', type: number }
        "double_blocks.2.": { kind: 'number', type: number }
        "double_blocks.3.": { kind: 'number', type: number }
        "double_blocks.4.": { kind: 'number', type: number }
        "double_blocks.5.": { kind: 'number', type: number }
        "double_blocks.6.": { kind: 'number', type: number }
        "double_blocks.7.": { kind: 'number', type: number }
        "double_blocks.8.": { kind: 'number', type: number }
        "double_blocks.9.": { kind: 'number', type: number }
        "double_blocks.10.": { kind: 'number', type: number }
        "double_blocks.11.": { kind: 'number', type: number }
        "double_blocks.12.": { kind: 'number', type: number }
        "double_blocks.13.": { kind: 'number', type: number }
        "double_blocks.14.": { kind: 'number', type: number }
        "double_blocks.15.": { kind: 'number', type: number }
        "double_blocks.16.": { kind: 'number', type: number }
        "double_blocks.17.": { kind: 'number', type: number }
        "double_blocks.18.": { kind: 'number', type: number }
        "single_blocks.0.": { kind: 'number', type: number }
        "single_blocks.1.": { kind: 'number', type: number }
        "single_blocks.2.": { kind: 'number', type: number }
        "single_blocks.3.": { kind: 'number', type: number }
        "single_blocks.4.": { kind: 'number', type: number }
        "single_blocks.5.": { kind: 'number', type: number }
        "single_blocks.6.": { kind: 'number', type: number }
        "single_blocks.7.": { kind: 'number', type: number }
        "single_blocks.8.": { kind: 'number', type: number }
        "single_blocks.9.": { kind: 'number', type: number }
        "single_blocks.10.": { kind: 'number', type: number }
        "single_blocks.11.": { kind: 'number', type: number }
        "single_blocks.12.": { kind: 'number', type: number }
        "single_blocks.13.": { kind: 'number', type: number }
        "single_blocks.14.": { kind: 'number', type: number }
        "single_blocks.15.": { kind: 'number', type: number }
        "single_blocks.16.": { kind: 'number', type: number }
        "single_blocks.17.": { kind: 'number', type: number }
        "single_blocks.18.": { kind: 'number', type: number }
        "single_blocks.19.": { kind: 'number', type: number }
        "single_blocks.20.": { kind: 'number', type: number }
        "single_blocks.21.": { kind: 'number', type: number }
        "single_blocks.22.": { kind: 'number', type: number }
        "single_blocks.23.": { kind: 'number', type: number }
        "single_blocks.24.": { kind: 'number', type: number }
        "single_blocks.25.": { kind: 'number', type: number }
        "single_blocks.26.": { kind: 'number', type: number }
        "single_blocks.27.": { kind: 'number', type: number }
        "single_blocks.28.": { kind: 'number', type: number }
        "single_blocks.29.": { kind: 'number', type: number }
        "single_blocks.30.": { kind: 'number', type: number }
        "single_blocks.31.": { kind: 'number', type: number }
        "single_blocks.32.": { kind: 'number', type: number }
        "single_blocks.33.": { kind: 'number', type: number }
        "single_blocks.34.": { kind: 'number', type: number }
        "single_blocks.35.": { kind: 'number', type: number }
        "single_blocks.36.": { kind: 'number', type: number }
        "single_blocks.37.": { kind: 'number', type: number }
        "final_layer.": { kind: 'number', type: number }
    }
    ModelMergeSD35$_Large: {
        "pos_embed.": { kind: 'number', type: number }
        "x_embedder.": { kind: 'number', type: number }
        "context_embedder.": { kind: 'number', type: number }
        "y_embedder.": { kind: 'number', type: number }
        "t_embedder.": { kind: 'number', type: number }
        "joint_blocks.0.": { kind: 'number', type: number }
        "joint_blocks.1.": { kind: 'number', type: number }
        "joint_blocks.2.": { kind: 'number', type: number }
        "joint_blocks.3.": { kind: 'number', type: number }
        "joint_blocks.4.": { kind: 'number', type: number }
        "joint_blocks.5.": { kind: 'number', type: number }
        "joint_blocks.6.": { kind: 'number', type: number }
        "joint_blocks.7.": { kind: 'number', type: number }
        "joint_blocks.8.": { kind: 'number', type: number }
        "joint_blocks.9.": { kind: 'number', type: number }
        "joint_blocks.10.": { kind: 'number', type: number }
        "joint_blocks.11.": { kind: 'number', type: number }
        "joint_blocks.12.": { kind: 'number', type: number }
        "joint_blocks.13.": { kind: 'number', type: number }
        "joint_blocks.14.": { kind: 'number', type: number }
        "joint_blocks.15.": { kind: 'number', type: number }
        "joint_blocks.16.": { kind: 'number', type: number }
        "joint_blocks.17.": { kind: 'number', type: number }
        "joint_blocks.18.": { kind: 'number', type: number }
        "joint_blocks.19.": { kind: 'number', type: number }
        "joint_blocks.20.": { kind: 'number', type: number }
        "joint_blocks.21.": { kind: 'number', type: number }
        "joint_blocks.22.": { kind: 'number', type: number }
        "joint_blocks.23.": { kind: 'number', type: number }
        "joint_blocks.24.": { kind: 'number', type: number }
        "joint_blocks.25.": { kind: 'number', type: number }
        "joint_blocks.26.": { kind: 'number', type: number }
        "joint_blocks.27.": { kind: 'number', type: number }
        "joint_blocks.28.": { kind: 'number', type: number }
        "joint_blocks.29.": { kind: 'number', type: number }
        "joint_blocks.30.": { kind: 'number', type: number }
        "joint_blocks.31.": { kind: 'number', type: number }
        "joint_blocks.32.": { kind: 'number', type: number }
        "joint_blocks.33.": { kind: 'number', type: number }
        "joint_blocks.34.": { kind: 'number', type: number }
        "joint_blocks.35.": { kind: 'number', type: number }
        "joint_blocks.36.": { kind: 'number', type: number }
        "joint_blocks.37.": { kind: 'number', type: number }
        "final_layer.": { kind: 'number', type: number }
    }
    PerturbedAttentionGuidance: {
        scale: { kind: 'number', type: number }
    }
    AlignYourStepsScheduler: {
        steps: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
    }
    UNetSelfAttentionMultiply: {
        q: { kind: 'number', type: number }
        k: { kind: 'number', type: number }
        v: { kind: 'number', type: number }
        out: { kind: 'number', type: number }
    }
    UNetCrossAttentionMultiply: {
        q: { kind: 'number', type: number }
        k: { kind: 'number', type: number }
        v: { kind: 'number', type: number }
        out: { kind: 'number', type: number }
    }
    CLIPAttentionMultiply: {
        q: { kind: 'number', type: number }
        k: { kind: 'number', type: number }
        v: { kind: 'number', type: number }
        out: { kind: 'number', type: number }
    }
    UNetTemporalAttentionMultiply: {
        self_structural: { kind: 'number', type: number }
        self_temporal: { kind: 'number', type: number }
        cross_structural: { kind: 'number', type: number }
        cross_temporal: { kind: 'number', type: number }
    }
    SamplerLCMUpscale: {
        scale_ratio: { kind: 'number', type: number }
        scale_steps: { kind: 'number', type: number }
    }
    SamplerEulerCFGpp: {
    }
    WebcamCapture: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        capture_on_queue: { kind: 'boolean', type: boolean }
    }
    EmptyLatentAudio: {
        seconds: { kind: 'number', type: number }
        batch_size: { kind: 'number', type: number }
    }
    VAEEncodeAudio: {
    }
    VAEDecodeAudio: {
    }
    SaveAudio: {
        filename_prefix: { kind: 'string', type: string }
    }
    LoadAudio: {
    }
    PreviewAudio: {
    }
    TripleCLIPLoader: {
    }
    EmptySD3LatentImage: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        batch_size: { kind: 'number', type: number }
    }
    CLIPTextEncodeSD3: {
        clip_l: { kind: 'string', type: string }
        clip_g: { kind: 'string', type: string }
        t5xxl: { kind: 'string', type: string }
    }
    ControlNetApplySD3: {
        strength: { kind: 'number', type: number }
        start_percent: { kind: 'number', type: number }
        end_percent: { kind: 'number', type: number }
    }
    SkipLayerGuidanceSD3: {
        layers: { kind: 'string', type: string }
        scale: { kind: 'number', type: number }
        start_percent: { kind: 'number', type: number }
        end_percent: { kind: 'number', type: number }
    }
    GITSScheduler: {
        coeff: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
    }
    SetUnionControlNetType: {
    }
    ControlNetInpaintingAliMamaApply: {
        strength: { kind: 'number', type: number }
        start_percent: { kind: 'number', type: number }
        end_percent: { kind: 'number', type: number }
    }
    CLIPTextEncodeHunyuanDiT: {
        bert: { kind: 'string', type: string }
        mt5xl: { kind: 'string', type: string }
    }
    CLIPTextEncodeFlux: {
        clip_l: { kind: 'string', type: string }
        t5xxl: { kind: 'string', type: string }
        guidance: { kind: 'number', type: number }
    }
    FluxGuidance: {
        guidance: { kind: 'number', type: number }
    }
    LoraSave: {
        filename_prefix: { kind: 'string', type: string }
        rank: { kind: 'number', type: number }
        bias_diff: { kind: 'boolean', type: boolean }
    }
    TorchCompileModel: {
    }
    EmptyMochiLatentVideo: {
        width: { kind: 'number', type: number }
        height: { kind: 'number', type: number }
        length: { kind: 'number', type: number }
        batch_size: { kind: 'number', type: number }
    }
    SaveImageWebsocket: {
    }
    SAMLoader: {
    }
    CLIPSegDetectorProvider: {
        text: { kind: 'string', type: string }
        blur: { kind: 'number', type: number }
        threshold: { kind: 'number', type: number }
        dilation_factor: { kind: 'number', type: number }
    }
    ONNXDetectorProvider: {
    }
    BitwiseAndMaskForEach: {
    }
    SubtractMaskForEach: {
    }
    DetailerForEach: {
        guide_size: { kind: 'number', type: number }
        guide_size_for: { kind: 'boolean', type: boolean }
        max_size: { kind: 'number', type: number }
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        feather: { kind: 'number', type: number }
        noise_mask: { kind: 'boolean', type: boolean }
        force_inpaint: { kind: 'boolean', type: boolean }
        wildcard: { kind: 'string', type: string }
        cycle: { kind: 'number', type: number }
        inpaint_model: { kind: 'boolean', type: boolean }
        noise_mask_feather: { kind: 'number', type: number }
    }
    DetailerForEachDebug: {
        guide_size: { kind: 'number', type: number }
        guide_size_for: { kind: 'boolean', type: boolean }
        max_size: { kind: 'number', type: number }
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        feather: { kind: 'number', type: number }
        noise_mask: { kind: 'boolean', type: boolean }
        force_inpaint: { kind: 'boolean', type: boolean }
        wildcard: { kind: 'string', type: string }
        cycle: { kind: 'number', type: number }
        inpaint_model: { kind: 'boolean', type: boolean }
        noise_mask_feather: { kind: 'number', type: number }
    }
    DetailerForEachPipe: {
        guide_size: { kind: 'number', type: number }
        guide_size_for: { kind: 'boolean', type: boolean }
        max_size: { kind: 'number', type: number }
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        feather: { kind: 'number', type: number }
        noise_mask: { kind: 'boolean', type: boolean }
        force_inpaint: { kind: 'boolean', type: boolean }
        wildcard: { kind: 'string', type: string }
        refiner_ratio: { kind: 'number', type: number }
        cycle: { kind: 'number', type: number }
        inpaint_model: { kind: 'boolean', type: boolean }
        noise_mask_feather: { kind: 'number', type: number }
    }
    DetailerForEachDebugPipe: {
        guide_size: { kind: 'number', type: number }
        guide_size_for: { kind: 'boolean', type: boolean }
        max_size: { kind: 'number', type: number }
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        feather: { kind: 'number', type: number }
        noise_mask: { kind: 'boolean', type: boolean }
        force_inpaint: { kind: 'boolean', type: boolean }
        wildcard: { kind: 'string', type: string }
        refiner_ratio: { kind: 'number', type: number }
        cycle: { kind: 'number', type: number }
        inpaint_model: { kind: 'boolean', type: boolean }
        noise_mask_feather: { kind: 'number', type: number }
    }
    DetailerForEachPipeForAnimateDiff: {
        guide_size: { kind: 'number', type: number }
        guide_size_for: { kind: 'boolean', type: boolean }
        max_size: { kind: 'number', type: number }
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        feather: { kind: 'number', type: number }
        refiner_ratio: { kind: 'number', type: number }
        noise_mask_feather: { kind: 'number', type: number }
    }
    SAMDetectorCombined: {
        dilation: { kind: 'number', type: number }
        threshold: { kind: 'number', type: number }
        bbox_expansion: { kind: 'number', type: number }
        mask_hint_threshold: { kind: 'number', type: number }
    }
    SAMDetectorSegmented: {
        dilation: { kind: 'number', type: number }
        threshold: { kind: 'number', type: number }
        bbox_expansion: { kind: 'number', type: number }
        mask_hint_threshold: { kind: 'number', type: number }
    }
    FaceDetailer: {
        guide_size: { kind: 'number', type: number }
        guide_size_for: { kind: 'boolean', type: boolean }
        max_size: { kind: 'number', type: number }
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        feather: { kind: 'number', type: number }
        noise_mask: { kind: 'boolean', type: boolean }
        force_inpaint: { kind: 'boolean', type: boolean }
        bbox_threshold: { kind: 'number', type: number }
        bbox_dilation: { kind: 'number', type: number }
        bbox_crop_factor: { kind: 'number', type: number }
        sam_dilation: { kind: 'number', type: number }
        sam_threshold: { kind: 'number', type: number }
        sam_bbox_expansion: { kind: 'number', type: number }
        sam_mask_hint_threshold: { kind: 'number', type: number }
        drop_size: { kind: 'number', type: number }
        wildcard: { kind: 'string', type: string }
        cycle: { kind: 'number', type: number }
        inpaint_model: { kind: 'boolean', type: boolean }
        noise_mask_feather: { kind: 'number', type: number }
    }
    FaceDetailerPipe: {
        guide_size: { kind: 'number', type: number }
        guide_size_for: { kind: 'boolean', type: boolean }
        max_size: { kind: 'number', type: number }
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        feather: { kind: 'number', type: number }
        noise_mask: { kind: 'boolean', type: boolean }
        force_inpaint: { kind: 'boolean', type: boolean }
        bbox_threshold: { kind: 'number', type: number }
        bbox_dilation: { kind: 'number', type: number }
        bbox_crop_factor: { kind: 'number', type: number }
        sam_dilation: { kind: 'number', type: number }
        sam_threshold: { kind: 'number', type: number }
        sam_bbox_expansion: { kind: 'number', type: number }
        sam_mask_hint_threshold: { kind: 'number', type: number }
        drop_size: { kind: 'number', type: number }
        refiner_ratio: { kind: 'number', type: number }
        cycle: { kind: 'number', type: number }
        inpaint_model: { kind: 'boolean', type: boolean }
        noise_mask_feather: { kind: 'number', type: number }
    }
    MaskDetailerPipe: {
        guide_size: { kind: 'number', type: number }
        guide_size_for: { kind: 'boolean', type: boolean }
        max_size: { kind: 'number', type: number }
        mask_mode: { kind: 'boolean', type: boolean }
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        feather: { kind: 'number', type: number }
        crop_factor: { kind: 'number', type: number }
        drop_size: { kind: 'number', type: number }
        refiner_ratio: { kind: 'number', type: number }
        batch_size: { kind: 'number', type: number }
        cycle: { kind: 'number', type: number }
        inpaint_model: { kind: 'boolean', type: boolean }
        noise_mask_feather: { kind: 'number', type: number }
        bbox_fill: { kind: 'boolean', type: boolean }
        contour_fill: { kind: 'boolean', type: boolean }
    }
    ToDetailerPipe: {
        wildcard: { kind: 'string', type: string }
    }
    ToDetailerPipeSDXL: {
        wildcard: { kind: 'string', type: string }
    }
    FromDetailerPipe: {
    }
    FromDetailerPipe$_v2: {
    }
    FromDetailerPipeSDXL: {
    }
    AnyPipeToBasic: {
    }
    ToBasicPipe: {
    }
    FromBasicPipe: {
    }
    FromBasicPipe$_v2: {
    }
    BasicPipeToDetailerPipe: {
        wildcard: { kind: 'string', type: string }
    }
    BasicPipeToDetailerPipeSDXL: {
        wildcard: { kind: 'string', type: string }
    }
    DetailerPipeToBasicPipe: {
    }
    EditBasicPipe: {
    }
    EditDetailerPipe: {
        wildcard: { kind: 'string', type: string }
    }
    EditDetailerPipeSDXL: {
        wildcard: { kind: 'string', type: string }
    }
    LatentPixelScale: {
        scale_factor: { kind: 'number', type: number }
        use_tiled_vae: { kind: 'boolean', type: boolean }
    }
    PixelKSampleUpscalerProvider: {
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        use_tiled_vae: { kind: 'boolean', type: boolean }
        tile_size: { kind: 'number', type: number }
    }
    PixelKSampleUpscalerProviderPipe: {
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        use_tiled_vae: { kind: 'boolean', type: boolean }
        tile_size: { kind: 'number', type: number }
        tile_cnet_strength: { kind: 'number', type: number }
    }
    IterativeLatentUpscale: {
        upscale_factor: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        temp_prefix: { kind: 'string', type: string }
    }
    IterativeImageUpscale: {
        upscale_factor: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        temp_prefix: { kind: 'string', type: string }
    }
    PixelTiledKSampleUpscalerProvider: {
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        tile_width: { kind: 'number', type: number }
        tile_height: { kind: 'number', type: number }
        tile_cnet_strength: { kind: 'number', type: number }
    }
    PixelTiledKSampleUpscalerProviderPipe: {
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        tile_width: { kind: 'number', type: number }
        tile_height: { kind: 'number', type: number }
        tile_cnet_strength: { kind: 'number', type: number }
    }
    TwoSamplersForMaskUpscalerProvider: {
        use_tiled_vae: { kind: 'boolean', type: boolean }
        tile_size: { kind: 'number', type: number }
    }
    TwoSamplersForMaskUpscalerProviderPipe: {
        use_tiled_vae: { kind: 'boolean', type: boolean }
        tile_size: { kind: 'number', type: number }
    }
    PixelKSampleHookCombine: {
    }
    DenoiseScheduleHookProvider: {
        target_denoise: { kind: 'number', type: number }
    }
    StepsScheduleHookProvider: {
        target_steps: { kind: 'number', type: number }
    }
    CfgScheduleHookProvider: {
        target_cfg: { kind: 'number', type: number }
    }
    NoiseInjectionHookProvider: {
        seed: { kind: 'number', type: number }
        start_strength: { kind: 'number', type: number }
        end_strength: { kind: 'number', type: number }
    }
    UnsamplerHookProvider: {
        steps: { kind: 'number', type: number }
        start_end_at_step: { kind: 'number', type: number }
        end_end_at_step: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
    }
    CoreMLDetailerHookProvider: {
    }
    PreviewDetailerHookProvider: {
        quality: { kind: 'number', type: number }
    }
    DetailerHookCombine: {
    }
    NoiseInjectionDetailerHookProvider: {
        seed: { kind: 'number', type: number }
        start_strength: { kind: 'number', type: number }
        end_strength: { kind: 'number', type: number }
    }
    UnsamplerDetailerHookProvider: {
        steps: { kind: 'number', type: number }
        start_end_at_step: { kind: 'number', type: number }
        end_end_at_step: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
    }
    DenoiseSchedulerDetailerHookProvider: {
        target_denoise: { kind: 'number', type: number }
    }
    SEGSOrderedFilterDetailerHookProvider: {
        order: { kind: 'boolean', type: boolean }
        take_start: { kind: 'number', type: number }
        take_count: { kind: 'number', type: number }
    }
    SEGSRangeFilterDetailerHookProvider: {
        mode: { kind: 'boolean', type: boolean }
        min_value: { kind: 'number', type: number }
        max_value: { kind: 'number', type: number }
    }
    SEGSLabelFilterDetailerHookProvider: {
        labels: { kind: 'string', type: string }
    }
    VariationNoiseDetailerHookProvider: {
        seed: { kind: 'number', type: number }
        strength: { kind: 'number', type: number }
    }
    BitwiseAndMask: {
    }
    SubtractMask: {
    }
    AddMask: {
    }
    ImpactSegsAndMask: {
    }
    ImpactSegsAndMaskForEach: {
    }
    EmptySegs: {
    }
    ImpactFlattenMask: {
    }
    MediaPipeFaceMeshToSEGS: {
        crop_factor: { kind: 'number', type: number }
        bbox_fill: { kind: 'boolean', type: boolean }
        crop_min_size: { kind: 'number', type: number }
        drop_size: { kind: 'number', type: number }
        dilation: { kind: 'number', type: number }
        face: { kind: 'boolean', type: boolean }
        mouth: { kind: 'boolean', type: boolean }
        left_eyebrow: { kind: 'boolean', type: boolean }
        left_eye: { kind: 'boolean', type: boolean }
        left_pupil: { kind: 'boolean', type: boolean }
        right_eyebrow: { kind: 'boolean', type: boolean }
        right_eye: { kind: 'boolean', type: boolean }
        right_pupil: { kind: 'boolean', type: boolean }
    }
    MaskToSEGS: {
        combined: { kind: 'boolean', type: boolean }
        crop_factor: { kind: 'number', type: number }
        bbox_fill: { kind: 'boolean', type: boolean }
        drop_size: { kind: 'number', type: number }
        contour_fill: { kind: 'boolean', type: boolean }
    }
    MaskToSEGS$_for$_AnimateDiff: {
        combined: { kind: 'boolean', type: boolean }
        crop_factor: { kind: 'number', type: number }
        bbox_fill: { kind: 'boolean', type: boolean }
        drop_size: { kind: 'number', type: number }
        contour_fill: { kind: 'boolean', type: boolean }
    }
    ToBinaryMask: {
        threshold: { kind: 'number', type: number }
    }
    MasksToMaskList: {
    }
    MaskListToMaskBatch: {
    }
    ImageListToImageBatch: {
    }
    SetDefaultImageForSEGS: {
        override: { kind: 'boolean', type: boolean }
    }
    RemoveImageFromSEGS: {
    }
    BboxDetectorSEGS: {
        threshold: { kind: 'number', type: number }
        dilation: { kind: 'number', type: number }
        crop_factor: { kind: 'number', type: number }
        drop_size: { kind: 'number', type: number }
        labels: { kind: 'string', type: string }
    }
    SegmDetectorSEGS: {
        threshold: { kind: 'number', type: number }
        dilation: { kind: 'number', type: number }
        crop_factor: { kind: 'number', type: number }
        drop_size: { kind: 'number', type: number }
        labels: { kind: 'string', type: string }
    }
    ONNXDetectorSEGS: {
        threshold: { kind: 'number', type: number }
        dilation: { kind: 'number', type: number }
        crop_factor: { kind: 'number', type: number }
        drop_size: { kind: 'number', type: number }
        labels: { kind: 'string', type: string }
    }
    ImpactSimpleDetectorSEGS$_for$_AD: {
        bbox_threshold: { kind: 'number', type: number }
        bbox_dilation: { kind: 'number', type: number }
        crop_factor: { kind: 'number', type: number }
        drop_size: { kind: 'number', type: number }
        sub_threshold: { kind: 'number', type: number }
        sub_dilation: { kind: 'number', type: number }
        sub_bbox_expansion: { kind: 'number', type: number }
        sam_mask_hint_threshold: { kind: 'number', type: number }
    }
    ImpactSimpleDetectorSEGS: {
        bbox_threshold: { kind: 'number', type: number }
        bbox_dilation: { kind: 'number', type: number }
        crop_factor: { kind: 'number', type: number }
        drop_size: { kind: 'number', type: number }
        sub_threshold: { kind: 'number', type: number }
        sub_dilation: { kind: 'number', type: number }
        sub_bbox_expansion: { kind: 'number', type: number }
        sam_mask_hint_threshold: { kind: 'number', type: number }
        post_dilation: { kind: 'number', type: number }
    }
    ImpactSimpleDetectorSEGSPipe: {
        bbox_threshold: { kind: 'number', type: number }
        bbox_dilation: { kind: 'number', type: number }
        crop_factor: { kind: 'number', type: number }
        drop_size: { kind: 'number', type: number }
        sub_threshold: { kind: 'number', type: number }
        sub_dilation: { kind: 'number', type: number }
        sub_bbox_expansion: { kind: 'number', type: number }
        sam_mask_hint_threshold: { kind: 'number', type: number }
        post_dilation: { kind: 'number', type: number }
    }
    ImpactControlNetApplySEGS: {
        strength: { kind: 'number', type: number }
    }
    ImpactControlNetApplyAdvancedSEGS: {
        strength: { kind: 'number', type: number }
        start_percent: { kind: 'number', type: number }
        end_percent: { kind: 'number', type: number }
    }
    ImpactControlNetClearSEGS: {
    }
    ImpactIPAdapterApplySEGS: {
        weight: { kind: 'number', type: number }
        noise: { kind: 'number', type: number }
        start_at: { kind: 'number', type: number }
        end_at: { kind: 'number', type: number }
        unfold_batch: { kind: 'boolean', type: boolean }
        faceid_v2: { kind: 'boolean', type: boolean }
        weight_v2: { kind: 'number', type: number }
        context_crop_factor: { kind: 'number', type: number }
    }
    ImpactDecomposeSEGS: {
    }
    ImpactAssembleSEGS: {
    }
    ImpactFrom$_SEG$_ELT: {
    }
    ImpactEdit$_SEG$_ELT: {
        confidence_opt: { kind: 'number', type: number }
        label_opt: { kind: 'string', type: string }
    }
    ImpactDilate$_Mask$_SEG$_ELT: {
        dilation: { kind: 'number', type: number }
    }
    ImpactDilateMask: {
        dilation: { kind: 'number', type: number }
    }
    ImpactGaussianBlurMask: {
        kernel_size: { kind: 'number', type: number }
        sigma: { kind: 'number', type: number }
    }
    ImpactDilateMaskInSEGS: {
        dilation: { kind: 'number', type: number }
    }
    ImpactGaussianBlurMaskInSEGS: {
        kernel_size: { kind: 'number', type: number }
        sigma: { kind: 'number', type: number }
    }
    ImpactScaleBy$_BBOX$_SEG$_ELT: {
        scale_by: { kind: 'number', type: number }
    }
    ImpactFrom$_SEG$_ELT$_bbox: {
    }
    ImpactFrom$_SEG$_ELT$_crop$_region: {
    }
    ImpactCount$_Elts$_in$_SEGS: {
    }
    BboxDetectorCombined$_v2: {
        threshold: { kind: 'number', type: number }
        dilation: { kind: 'number', type: number }
    }
    SegmDetectorCombined$_v2: {
        threshold: { kind: 'number', type: number }
        dilation: { kind: 'number', type: number }
    }
    SegsToCombinedMask: {
    }
    KSamplerProvider: {
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
    }
    TwoSamplersForMask: {
    }
    TiledKSamplerProvider: {
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        tile_width: { kind: 'number', type: number }
        tile_height: { kind: 'number', type: number }
    }
    KSamplerAdvancedProvider: {
        cfg: { kind: 'number', type: number }
        sigma_factor: { kind: 'number', type: number }
    }
    TwoAdvancedSamplersForMask: {
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        overlap_factor: { kind: 'number', type: number }
    }
    ImpactNegativeConditioningPlaceholder: {
    }
    PreviewBridge: {
        image: { kind: 'string', type: string }
        block: { kind: 'boolean', type: boolean }
    }
    PreviewBridgeLatent: {
        image: { kind: 'string', type: string }
        block: { kind: 'boolean', type: boolean }
    }
    ImageSender: {
        filename_prefix: { kind: 'string', type: string }
        link_id: { kind: 'number', type: number }
    }
    ImageReceiver: {
        link_id: { kind: 'number', type: number }
        save_to_workflow: { kind: 'boolean', type: boolean }
        image_data: { kind: 'string', type: string }
        trigger_always: { kind: 'boolean', type: boolean }
    }
    LatentSender: {
        filename_prefix: { kind: 'string', type: string }
        link_id: { kind: 'number', type: number }
    }
    LatentReceiver: {
        link_id: { kind: 'number', type: number }
        trigger_always: { kind: 'boolean', type: boolean }
    }
    ImageMaskSwitch: {
        select: { kind: 'number', type: number }
    }
    LatentSwitch: {
        select: { kind: 'number', type: number }
        sel_mode: { kind: 'boolean', type: boolean }
    }
    SEGSSwitch: {
        select: { kind: 'number', type: number }
        sel_mode: { kind: 'boolean', type: boolean }
    }
    ImpactSwitch: {
        select: { kind: 'number', type: number }
        sel_mode: { kind: 'boolean', type: boolean }
    }
    ImpactInversedSwitch: {
        select: { kind: 'number', type: number }
        sel_mode: { kind: 'boolean', type: boolean }
    }
    ImpactWildcardProcessor: {
        wildcard_text: { kind: 'string', type: string }
        populated_text: { kind: 'string', type: string }
        mode: { kind: 'boolean', type: boolean }
        seed: { kind: 'number', type: number }
    }
    ImpactWildcardEncode: {
        wildcard_text: { kind: 'string', type: string }
        populated_text: { kind: 'string', type: string }
        mode: { kind: 'boolean', type: boolean }
        seed: { kind: 'number', type: number }
    }
    SEGSUpscaler: {
        rescale_factor: { kind: 'number', type: number }
        rounding_modulus: { kind: 'number', type: number }
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        feather: { kind: 'number', type: number }
        inpaint_model: { kind: 'boolean', type: boolean }
        noise_mask_feather: { kind: 'number', type: number }
    }
    SEGSUpscalerPipe: {
        rescale_factor: { kind: 'number', type: number }
        rounding_modulus: { kind: 'number', type: number }
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        feather: { kind: 'number', type: number }
        inpaint_model: { kind: 'boolean', type: boolean }
        noise_mask_feather: { kind: 'number', type: number }
    }
    SEGSDetailer: {
        guide_size: { kind: 'number', type: number }
        guide_size_for: { kind: 'boolean', type: boolean }
        max_size: { kind: 'number', type: number }
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        noise_mask: { kind: 'boolean', type: boolean }
        force_inpaint: { kind: 'boolean', type: boolean }
        refiner_ratio: { kind: 'number', type: number }
        batch_size: { kind: 'number', type: number }
        cycle: { kind: 'number', type: number }
        inpaint_model: { kind: 'boolean', type: boolean }
        noise_mask_feather: { kind: 'number', type: number }
    }
    SEGSPaste: {
        feather: { kind: 'number', type: number }
        alpha: { kind: 'number', type: number }
    }
    SEGSPreview: {
        alpha_mode: { kind: 'boolean', type: boolean }
        min_alpha: { kind: 'number', type: number }
    }
    SEGSPreviewCNet: {
    }
    SEGSToImageList: {
    }
    ImpactSEGSToMaskList: {
    }
    ImpactSEGSToMaskBatch: {
    }
    ImpactSEGSConcat: {
    }
    ImpactSEGSPicker: {
        picks: { kind: 'string', type: string }
    }
    ImpactMakeTileSEGS: {
        bbox_size: { kind: 'number', type: number }
        crop_factor: { kind: 'number', type: number }
        min_overlap: { kind: 'number', type: number }
        filter_segs_dilation: { kind: 'number', type: number }
        mask_irregularity: { kind: 'number', type: number }
    }
    ImpactSEGSMerge: {
    }
    SEGSDetailerForAnimateDiff: {
        guide_size: { kind: 'number', type: number }
        guide_size_for: { kind: 'boolean', type: boolean }
        max_size: { kind: 'number', type: number }
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        refiner_ratio: { kind: 'number', type: number }
        noise_mask_feather: { kind: 'number', type: number }
    }
    ImpactKSamplerBasicPipe: {
        seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
    }
    ImpactKSamplerAdvancedBasicPipe: {
        add_noise: { kind: 'boolean', type: boolean }
        noise_seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        cfg: { kind: 'number', type: number }
        start_at_step: { kind: 'number', type: number }
        end_at_step: { kind: 'number', type: number }
        return_with_leftover_noise: { kind: 'boolean', type: boolean }
    }
    ReencodeLatent: {
        tile_size: { kind: 'number', type: number }
    }
    ReencodeLatentPipe: {
    }
    ImpactImageBatchToImageList: {
    }
    ImpactMakeImageList: {
    }
    ImpactMakeImageBatch: {
    }
    ImpactMakeAnyList: {
    }
    ImpactMakeMaskList: {
    }
    ImpactMakeMaskBatch: {
    }
    RegionalSampler: {
        seed: { kind: 'number', type: number }
        seed_2nd: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        base_only_steps: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
        overlap_factor: { kind: 'number', type: number }
        restore_latent: { kind: 'boolean', type: boolean }
        additional_sigma_ratio: { kind: 'number', type: number }
    }
    RegionalSamplerAdvanced: {
        add_noise: { kind: 'boolean', type: boolean }
        noise_seed: { kind: 'number', type: number }
        steps: { kind: 'number', type: number }
        start_at_step: { kind: 'number', type: number }
        end_at_step: { kind: 'number', type: number }
        overlap_factor: { kind: 'number', type: number }
        restore_latent: { kind: 'boolean', type: boolean }
        return_with_leftover_noise: { kind: 'boolean', type: boolean }
        additional_sigma_ratio: { kind: 'number', type: number }
    }
    CombineRegionalPrompts: {
    }
    RegionalPrompt: {
        variation_seed: { kind: 'number', type: number }
        variation_strength: { kind: 'number', type: number }
    }
    ImpactCombineConditionings: {
    }
    ImpactConcatConditionings: {
    }
    ImpactSEGSLabelAssign: {
        labels: { kind: 'string', type: string }
    }
    ImpactSEGSLabelFilter: {
        labels: { kind: 'string', type: string }
    }
    ImpactSEGSRangeFilter: {
        mode: { kind: 'boolean', type: boolean }
        min_value: { kind: 'number', type: number }
        max_value: { kind: 'number', type: number }
    }
    ImpactSEGSOrderedFilter: {
        order: { kind: 'boolean', type: boolean }
        take_start: { kind: 'number', type: number }
        take_count: { kind: 'number', type: number }
    }
    ImpactCompare: {
    }
    ImpactConditionalBranch: {
        cond: { kind: 'boolean', type: boolean }
    }
    ImpactConditionalBranchSelMode: {
        cond: { kind: 'boolean', type: boolean }
    }
    ImpactIfNone: {
    }
    ImpactConvertDataType: {
    }
    ImpactLogicalOperators: {
        bool_a: { kind: 'boolean', type: boolean }
        bool_b: { kind: 'boolean', type: boolean }
    }
    ImpactInt: {
        value: { kind: 'number', type: number }
    }
    ImpactFloat: {
        value: { kind: 'number', type: number }
    }
    ImpactBoolean: {
        value: { kind: 'boolean', type: boolean }
    }
    ImpactValueSender: {
        link_id: { kind: 'number', type: number }
    }
    ImpactValueReceiver: {
        value: { kind: 'string', type: string }
        link_id: { kind: 'number', type: number }
    }
    ImpactImageInfo: {
    }
    ImpactLatentInfo: {
    }
    ImpactMinMax: {
        mode: { kind: 'boolean', type: boolean }
    }
    ImpactNeg: {
        value: { kind: 'boolean', type: boolean }
    }
    ImpactConditionalStopIteration: {
        cond: { kind: 'boolean', type: boolean }
    }
    ImpactStringSelector: {
        strings: { kind: 'string', type: string }
        multiline: { kind: 'boolean', type: boolean }
        select: { kind: 'number', type: number }
    }
    StringListToString: {
        join_with: { kind: 'string', type: string }
        string_list: { kind: 'string', type: string }
    }
    WildcardPromptFromString: {
        string: { kind: 'string', type: string }
        delimiter: { kind: 'string', type: string }
        prefix_all: { kind: 'string', type: string }
        postfix_all: { kind: 'string', type: string }
        restrict_to_tags: { kind: 'string', type: string }
        exclude_tags: { kind: 'string', type: string }
    }
    ImpactExecutionOrderController: {
    }
    RemoveNoiseMask: {
    }
    ImpactLogger: {
        text: { kind: 'string', type: string }
    }
    ImpactDummyInput: {
    }
    ImpactQueueTrigger: {
        mode: { kind: 'boolean', type: boolean }
    }
    ImpactQueueTriggerCountdown: {
        count: { kind: 'number', type: number }
        total: { kind: 'number', type: number }
        mode: { kind: 'boolean', type: boolean }
    }
    ImpactSetWidgetValue: {
        node_id: { kind: 'number', type: number }
        widget_name: { kind: 'string', type: string }
        boolean_value: { kind: 'boolean', type: boolean }
        int_value: { kind: 'number', type: number }
        float_value: { kind: 'number', type: number }
        string_value: { kind: 'string', type: string }
    }
    ImpactNodeSetMuteState: {
        node_id: { kind: 'number', type: number }
        set_state: { kind: 'boolean', type: boolean }
    }
    ImpactControlBridge: {
        mode: { kind: 'boolean', type: boolean }
    }
    ImpactIsNotEmptySEGS: {
    }
    ImpactSleep: {
        seconds: { kind: 'number', type: number }
    }
    ImpactRemoteBoolean: {
        node_id: { kind: 'number', type: number }
        widget_name: { kind: 'string', type: string }
        value: { kind: 'boolean', type: boolean }
    }
    ImpactRemoteInt: {
        node_id: { kind: 'number', type: number }
        widget_name: { kind: 'string', type: string }
        value: { kind: 'number', type: number }
    }
    ImpactHFTransformersClassifierProvider: {
        manual_repo_id: { kind: 'string', type: string }
    }
    ImpactSEGSClassify: {
        manual_expr: { kind: 'string', type: string }
    }
    ImpactSchedulerAdapter: {
    }
    GITSSchedulerFuncProvider: {
        coeff: { kind: 'number', type: number }
        denoise: { kind: 'number', type: number }
    }
    UltralyticsDetectorProvider: {
    }
    UnknownNodeXX: {
    }
   }
   
   // 9. INDEX -------------------------------
   // TODO rename to ObjecInfoContent
   export type Schemas = {[k in ComfyNodeType]: ComfyNodeSchemaJSON}
   export type ComfyNodeType = 'KSampler' | 'CheckpointLoaderSimple' | 'CLIPTextEncode' | 'CLIPSetLastLayer' | 'VAEDecode' | 'VAEEncode' | 'VAEEncodeForInpaint' | 'VAELoader' | 'EmptyLatentImage' | 'LatentUpscale' | 'LatentUpscaleBy' | 'LatentFromBatch' | 'RepeatLatentBatch' | 'SaveImage' | 'PreviewImage' | 'LoadImage' | 'LoadImageMask' | 'ImageScale' | 'ImageScaleBy' | 'ImageInvert' | 'ImageBatch' | 'ImagePadForOutpaint' | 'EmptyImage' | 'ConditioningAverage' | 'ConditioningCombine' | 'ConditioningConcat' | 'ConditioningSetArea' | 'ConditioningSetAreaPercentage' | 'ConditioningSetAreaStrength' | 'ConditioningSetMask' | 'KSamplerAdvanced' | 'SetLatentNoiseMask' | 'LatentComposite' | 'LatentBlend' | 'LatentRotate' | 'LatentFlip' | 'LatentCrop' | 'LoraLoader' | 'CLIPLoader' | 'UNETLoader' | 'DualCLIPLoader' | 'CLIPVisionEncode' | 'StyleModelApply' | 'unCLIPConditioning' | 'ControlNetApply' | 'ControlNetApplyAdvanced' | 'ControlNetLoader' | 'DiffControlNetLoader' | 'StyleModelLoader' | 'CLIPVisionLoader' | 'VAEDecodeTiled' | 'VAEEncodeTiled' | 'unCLIPCheckpointLoader' | 'GLIGENLoader' | 'GLIGENTextBoxApply' | 'InpaintModelConditioning' | 'CheckpointLoader' | 'DiffusersLoader' | 'LoadLatent' | 'SaveLatent' | 'ConditioningZeroOut' | 'ConditioningSetTimestepRange' | 'LoraLoaderModelOnly' | 'LatentAdd' | 'LatentSubtract' | 'LatentMultiply' | 'LatentInterpolate' | 'LatentBatch' | 'LatentBatchSeedBehavior' | 'LatentApplyOperation' | 'LatentApplyOperationCFG' | 'LatentOperationTonemapReinhard' | 'LatentOperationSharpen' | 'HypernetworkLoader' | 'UpscaleModelLoader' | 'ImageUpscaleWithModel' | 'ImageBlend' | 'ImageBlur' | 'ImageQuantize' | 'ImageSharpen' | 'ImageScaleToTotalPixels' | 'LatentCompositeMasked' | 'ImageCompositeMasked' | 'MaskToImage' | 'ImageToMask' | 'ImageColorToMask' | 'SolidMask' | 'InvertMask' | 'CropMask' | 'MaskComposite' | 'FeatherMask' | 'GrowMask' | 'ThresholdMask' | 'PorterDuffImageComposite' | 'SplitImageWithAlpha' | 'JoinImageWithAlpha' | 'RebatchLatents' | 'RebatchImages' | 'ModelMergeSimple' | 'ModelMergeBlocks' | 'ModelMergeSubtract' | 'ModelMergeAdd' | 'CheckpointSave' | 'CLIPMergeSimple' | 'CLIPMergeSubtract' | 'CLIPMergeAdd' | 'CLIPSave' | 'VAESave' | 'ModelSave' | 'TomePatchModel' | 'CLIPTextEncodeSDXLRefiner' | 'CLIPTextEncodeSDXL' | 'Canny' | 'FreeU' | 'FreeU$_V2' | 'SamplerCustom' | 'BasicScheduler' | 'KarrasScheduler' | 'ExponentialScheduler' | 'PolyexponentialScheduler' | 'LaplaceScheduler' | 'VPScheduler' | 'BetaSamplingScheduler' | 'SDTurboScheduler' | 'KSamplerSelect' | 'SamplerEulerAncestral' | 'SamplerEulerAncestralCFGPP' | 'SamplerLMS' | 'SamplerDPMPP$_3M$_SDE' | 'SamplerDPMPP$_2M$_SDE' | 'SamplerDPMPP$_SDE' | 'SamplerDPMPP$_2S$_Ancestral' | 'SamplerDPMAdaptative' | 'SplitSigmas' | 'SplitSigmasDenoise' | 'FlipSigmas' | 'CFGGuider' | 'DualCFGGuider' | 'BasicGuider' | 'RandomNoise' | 'DisableNoise' | 'AddNoise' | 'SamplerCustomAdvanced' | 'HyperTile' | 'ModelSamplingDiscrete' | 'ModelSamplingContinuousEDM' | 'ModelSamplingContinuousV' | 'ModelSamplingStableCascade' | 'ModelSamplingSD3' | 'ModelSamplingAuraFlow' | 'ModelSamplingFlux' | 'RescaleCFG' | 'PatchModelAddDownscale' | 'ImageCrop' | 'RepeatImageBatch' | 'ImageFromBatch' | 'SaveAnimatedWEBP' | 'SaveAnimatedPNG' | 'ImageOnlyCheckpointLoader' | 'SVD$_img2vid$_Conditioning' | 'VideoLinearCFGGuidance' | 'VideoTriangleCFGGuidance' | 'ImageOnlyCheckpointSave' | 'SelfAttentionGuidance' | 'PerpNeg' | 'PerpNegGuider' | 'StableZero123$_Conditioning' | 'StableZero123$_Conditioning$_Batched' | 'SV3D$_Conditioning' | 'SD$_4XUpscale$_Conditioning' | 'PhotoMakerLoader' | 'PhotoMakerEncode' | 'CLIPTextEncodeControlnet' | 'Morphology' | 'StableCascade$_EmptyLatentImage' | 'StableCascade$_StageB$_Conditioning' | 'StableCascade$_StageC$_VAEEncode' | 'StableCascade$_SuperResolutionControlnet' | 'DifferentialDiffusion' | 'InstructPixToPixConditioning' | 'ModelMergeSD1' | 'ModelMergeSD2' | 'ModelMergeSDXL' | 'ModelMergeSD3$_2B' | 'ModelMergeFlux1' | 'ModelMergeSD35$_Large' | 'PerturbedAttentionGuidance' | 'AlignYourStepsScheduler' | 'UNetSelfAttentionMultiply' | 'UNetCrossAttentionMultiply' | 'CLIPAttentionMultiply' | 'UNetTemporalAttentionMultiply' | 'SamplerLCMUpscale' | 'SamplerEulerCFGpp' | 'WebcamCapture' | 'EmptyLatentAudio' | 'VAEEncodeAudio' | 'VAEDecodeAudio' | 'SaveAudio' | 'LoadAudio' | 'PreviewAudio' | 'TripleCLIPLoader' | 'EmptySD3LatentImage' | 'CLIPTextEncodeSD3' | 'ControlNetApplySD3' | 'SkipLayerGuidanceSD3' | 'GITSScheduler' | 'SetUnionControlNetType' | 'ControlNetInpaintingAliMamaApply' | 'CLIPTextEncodeHunyuanDiT' | 'CLIPTextEncodeFlux' | 'FluxGuidance' | 'LoraSave' | 'TorchCompileModel' | 'EmptyMochiLatentVideo' | 'SaveImageWebsocket' | 'SAMLoader' | 'CLIPSegDetectorProvider' | 'ONNXDetectorProvider' | 'BitwiseAndMaskForEach' | 'SubtractMaskForEach' | 'DetailerForEach' | 'DetailerForEachDebug' | 'DetailerForEachPipe' | 'DetailerForEachDebugPipe' | 'DetailerForEachPipeForAnimateDiff' | 'SAMDetectorCombined' | 'SAMDetectorSegmented' | 'FaceDetailer' | 'FaceDetailerPipe' | 'MaskDetailerPipe' | 'ToDetailerPipe' | 'ToDetailerPipeSDXL' | 'FromDetailerPipe' | 'FromDetailerPipe$_v2' | 'FromDetailerPipeSDXL' | 'AnyPipeToBasic' | 'ToBasicPipe' | 'FromBasicPipe' | 'FromBasicPipe$_v2' | 'BasicPipeToDetailerPipe' | 'BasicPipeToDetailerPipeSDXL' | 'DetailerPipeToBasicPipe' | 'EditBasicPipe' | 'EditDetailerPipe' | 'EditDetailerPipeSDXL' | 'LatentPixelScale' | 'PixelKSampleUpscalerProvider' | 'PixelKSampleUpscalerProviderPipe' | 'IterativeLatentUpscale' | 'IterativeImageUpscale' | 'PixelTiledKSampleUpscalerProvider' | 'PixelTiledKSampleUpscalerProviderPipe' | 'TwoSamplersForMaskUpscalerProvider' | 'TwoSamplersForMaskUpscalerProviderPipe' | 'PixelKSampleHookCombine' | 'DenoiseScheduleHookProvider' | 'StepsScheduleHookProvider' | 'CfgScheduleHookProvider' | 'NoiseInjectionHookProvider' | 'UnsamplerHookProvider' | 'CoreMLDetailerHookProvider' | 'PreviewDetailerHookProvider' | 'DetailerHookCombine' | 'NoiseInjectionDetailerHookProvider' | 'UnsamplerDetailerHookProvider' | 'DenoiseSchedulerDetailerHookProvider' | 'SEGSOrderedFilterDetailerHookProvider' | 'SEGSRangeFilterDetailerHookProvider' | 'SEGSLabelFilterDetailerHookProvider' | 'VariationNoiseDetailerHookProvider' | 'BitwiseAndMask' | 'SubtractMask' | 'AddMask' | 'ImpactSegsAndMask' | 'ImpactSegsAndMaskForEach' | 'EmptySegs' | 'ImpactFlattenMask' | 'MediaPipeFaceMeshToSEGS' | 'MaskToSEGS' | 'MaskToSEGS$_for$_AnimateDiff' | 'ToBinaryMask' | 'MasksToMaskList' | 'MaskListToMaskBatch' | 'ImageListToImageBatch' | 'SetDefaultImageForSEGS' | 'RemoveImageFromSEGS' | 'BboxDetectorSEGS' | 'SegmDetectorSEGS' | 'ONNXDetectorSEGS' | 'ImpactSimpleDetectorSEGS$_for$_AD' | 'ImpactSimpleDetectorSEGS' | 'ImpactSimpleDetectorSEGSPipe' | 'ImpactControlNetApplySEGS' | 'ImpactControlNetApplyAdvancedSEGS' | 'ImpactControlNetClearSEGS' | 'ImpactIPAdapterApplySEGS' | 'ImpactDecomposeSEGS' | 'ImpactAssembleSEGS' | 'ImpactFrom$_SEG$_ELT' | 'ImpactEdit$_SEG$_ELT' | 'ImpactDilate$_Mask$_SEG$_ELT' | 'ImpactDilateMask' | 'ImpactGaussianBlurMask' | 'ImpactDilateMaskInSEGS' | 'ImpactGaussianBlurMaskInSEGS' | 'ImpactScaleBy$_BBOX$_SEG$_ELT' | 'ImpactFrom$_SEG$_ELT$_bbox' | 'ImpactFrom$_SEG$_ELT$_crop$_region' | 'ImpactCount$_Elts$_in$_SEGS' | 'BboxDetectorCombined$_v2' | 'SegmDetectorCombined$_v2' | 'SegsToCombinedMask' | 'KSamplerProvider' | 'TwoSamplersForMask' | 'TiledKSamplerProvider' | 'KSamplerAdvancedProvider' | 'TwoAdvancedSamplersForMask' | 'ImpactNegativeConditioningPlaceholder' | 'PreviewBridge' | 'PreviewBridgeLatent' | 'ImageSender' | 'ImageReceiver' | 'LatentSender' | 'LatentReceiver' | 'ImageMaskSwitch' | 'LatentSwitch' | 'SEGSSwitch' | 'ImpactSwitch' | 'ImpactInversedSwitch' | 'ImpactWildcardProcessor' | 'ImpactWildcardEncode' | 'SEGSUpscaler' | 'SEGSUpscalerPipe' | 'SEGSDetailer' | 'SEGSPaste' | 'SEGSPreview' | 'SEGSPreviewCNet' | 'SEGSToImageList' | 'ImpactSEGSToMaskList' | 'ImpactSEGSToMaskBatch' | 'ImpactSEGSConcat' | 'ImpactSEGSPicker' | 'ImpactMakeTileSEGS' | 'ImpactSEGSMerge' | 'SEGSDetailerForAnimateDiff' | 'ImpactKSamplerBasicPipe' | 'ImpactKSamplerAdvancedBasicPipe' | 'ReencodeLatent' | 'ReencodeLatentPipe' | 'ImpactImageBatchToImageList' | 'ImpactMakeImageList' | 'ImpactMakeImageBatch' | 'ImpactMakeAnyList' | 'ImpactMakeMaskList' | 'ImpactMakeMaskBatch' | 'RegionalSampler' | 'RegionalSamplerAdvanced' | 'CombineRegionalPrompts' | 'RegionalPrompt' | 'ImpactCombineConditionings' | 'ImpactConcatConditionings' | 'ImpactSEGSLabelAssign' | 'ImpactSEGSLabelFilter' | 'ImpactSEGSRangeFilter' | 'ImpactSEGSOrderedFilter' | 'ImpactCompare' | 'ImpactConditionalBranch' | 'ImpactConditionalBranchSelMode' | 'ImpactIfNone' | 'ImpactConvertDataType' | 'ImpactLogicalOperators' | 'ImpactInt' | 'ImpactFloat' | 'ImpactBoolean' | 'ImpactValueSender' | 'ImpactValueReceiver' | 'ImpactImageInfo' | 'ImpactLatentInfo' | 'ImpactMinMax' | 'ImpactNeg' | 'ImpactConditionalStopIteration' | 'ImpactStringSelector' | 'StringListToString' | 'WildcardPromptFromString' | 'ImpactExecutionOrderController' | 'RemoveNoiseMask' | 'ImpactLogger' | 'ImpactDummyInput' | 'ImpactQueueTrigger' | 'ImpactQueueTriggerCountdown' | 'ImpactSetWidgetValue' | 'ImpactNodeSetMuteState' | 'ImpactControlBridge' | 'ImpactIsNotEmptySEGS' | 'ImpactSleep' | 'ImpactRemoteBoolean' | 'ImpactRemoteInt' | 'ImpactHFTransformersClassifierProvider' | 'ImpactSEGSClassify' | 'ImpactSchedulerAdapter' | 'GITSSchedulerFuncProvider' | 'UltralyticsDetectorProvider' | 'UnknownNodeXX'
}
