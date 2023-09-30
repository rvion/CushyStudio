
import type { ComfyNode } from '../src/core/Node'
import type { Slot } from '../src/core/Slot'
import type { ComfyNodeSchemaJSON } from '../src/types/ComfySchemaJSON'
import type { ComfyNodeUID } from '../src/types/NodeUID'
import type { ActionType } from '../src/core/Requirement'

// CONTENT IN THIS FILE:
//
//  0. Entrypoint
//  1. Requirable
//  2. Embeddings
//  3. Suggestions
//  4. TYPES
//  5. ACCEPTABLE
//  6. ENUMS
//  7. INTERFACES
//  8. NODES
//  9. INDEX

declare global {
const action: ActionType


// 0. Entrypoint --------------------------
export interface ComfySetup {
    /* category:sampling, name:"KSampler", output:LATENT */
    KSampler(p: KSampler_input, id?: ComfyNodeUID): KSampler
    /* category:loaders, name:"CheckpointLoaderSimple", output:MODEL+CLIP+VAE */
    CheckpointLoaderSimple(p: CheckpointLoaderSimple_input, id?: ComfyNodeUID): CheckpointLoaderSimple
    /* category:conditioning, name:"CLIPTextEncode", output:CONDITIONING */
    CLIPTextEncode(p: CLIPTextEncode_input, id?: ComfyNodeUID): CLIPTextEncode
    /* category:conditioning, name:"CLIPSetLastLayer", output:CLIP */
    CLIPSetLastLayer(p: CLIPSetLastLayer_input, id?: ComfyNodeUID): CLIPSetLastLayer
    /* category:latent, name:"VAEDecode", output:IMAGE */
    VAEDecode(p: VAEDecode_input, id?: ComfyNodeUID): VAEDecode
    /* category:latent, name:"VAEEncode", output:LATENT */
    VAEEncode(p: VAEEncode_input, id?: ComfyNodeUID): VAEEncode
    /* category:latent_inpaint, name:"VAEEncodeForInpaint", output:LATENT */
    VAEEncodeForInpaint(p: VAEEncodeForInpaint_input, id?: ComfyNodeUID): VAEEncodeForInpaint
    /* category:loaders, name:"VAELoader", output:VAE */
    VAELoader(p: VAELoader_input, id?: ComfyNodeUID): VAELoader
    /* category:latent, name:"EmptyLatentImage", output:LATENT */
    EmptyLatentImage(p: EmptyLatentImage_input, id?: ComfyNodeUID): EmptyLatentImage
    /* category:latent, name:"LatentUpscale", output:LATENT */
    LatentUpscale(p: LatentUpscale_input, id?: ComfyNodeUID): LatentUpscale
    /* category:latent, name:"LatentUpscaleBy", output:LATENT */
    LatentUpscaleBy(p: LatentUpscaleBy_input, id?: ComfyNodeUID): LatentUpscaleBy
    /* category:latent_batch, name:"LatentFromBatch", output:LATENT */
    LatentFromBatch(p: LatentFromBatch_input, id?: ComfyNodeUID): LatentFromBatch
    /* category:latent_batch, name:"RepeatLatentBatch", output:LATENT */
    RepeatLatentBatch(p: RepeatLatentBatch_input, id?: ComfyNodeUID): RepeatLatentBatch
    /* category:image, name:"SaveImage", output: */
    SaveImage(p: SaveImage_input, id?: ComfyNodeUID): SaveImage
    /* category:image, name:"PreviewImage", output: */
    PreviewImage(p: PreviewImage_input, id?: ComfyNodeUID): PreviewImage
    /* category:image, name:"LoadImage", output:IMAGE+MASK */
    LoadImage(p: LoadImage_input, id?: ComfyNodeUID): LoadImage
    /* category:mask, name:"LoadImageMask", output:MASK */
    LoadImageMask(p: LoadImageMask_input, id?: ComfyNodeUID): LoadImageMask
    /* category:image_upscaling, name:"ImageScale", output:IMAGE */
    ImageScale(p: ImageScale_input, id?: ComfyNodeUID): ImageScale
    /* category:image_upscaling, name:"ImageScaleBy", output:IMAGE */
    ImageScaleBy(p: ImageScaleBy_input, id?: ComfyNodeUID): ImageScaleBy
    /* category:image, name:"ImageInvert", output:IMAGE */
    ImageInvert(p: ImageInvert_input, id?: ComfyNodeUID): ImageInvert
    /* category:image, name:"ImageBatch", output:IMAGE */
    ImageBatch(p: ImageBatch_input, id?: ComfyNodeUID): ImageBatch
    /* category:image, name:"ImagePadForOutpaint", output:IMAGE+MASK */
    ImagePadForOutpaint(p: ImagePadForOutpaint_input, id?: ComfyNodeUID): ImagePadForOutpaint
    /* category:image, name:"EmptyImage", output:IMAGE */
    EmptyImage(p: EmptyImage_input, id?: ComfyNodeUID): EmptyImage
    /* category:conditioning, name:"ConditioningAverage", output:CONDITIONING */
    ConditioningAverage(p: ConditioningAverage_input, id?: ComfyNodeUID): ConditioningAverage
    /* category:conditioning, name:"ConditioningCombine", output:CONDITIONING */
    ConditioningCombine(p: ConditioningCombine_input, id?: ComfyNodeUID): ConditioningCombine
    /* category:conditioning, name:"ConditioningConcat", output:CONDITIONING */
    ConditioningConcat(p: ConditioningConcat_input, id?: ComfyNodeUID): ConditioningConcat
    /* category:conditioning, name:"ConditioningSetArea", output:CONDITIONING */
    ConditioningSetArea(p: ConditioningSetArea_input, id?: ComfyNodeUID): ConditioningSetArea
    /* category:conditioning, name:"ConditioningSetAreaPercentage", output:CONDITIONING */
    ConditioningSetAreaPercentage(p: ConditioningSetAreaPercentage_input, id?: ComfyNodeUID): ConditioningSetAreaPercentage
    /* category:conditioning, name:"ConditioningSetMask", output:CONDITIONING */
    ConditioningSetMask(p: ConditioningSetMask_input, id?: ComfyNodeUID): ConditioningSetMask
    /* category:sampling, name:"KSamplerAdvanced", output:LATENT */
    KSamplerAdvanced(p: KSamplerAdvanced_input, id?: ComfyNodeUID): KSamplerAdvanced
    /* category:latent_inpaint, name:"SetLatentNoiseMask", output:LATENT */
    SetLatentNoiseMask(p: SetLatentNoiseMask_input, id?: ComfyNodeUID): SetLatentNoiseMask
    /* category:latent, name:"LatentComposite", output:LATENT */
    LatentComposite(p: LatentComposite_input, id?: ComfyNodeUID): LatentComposite
    /* category:_for_testing, name:"LatentBlend", output:LATENT */
    LatentBlend(p: LatentBlend_input, id?: ComfyNodeUID): LatentBlend
    /* category:latent_transform, name:"LatentRotate", output:LATENT */
    LatentRotate(p: LatentRotate_input, id?: ComfyNodeUID): LatentRotate
    /* category:latent_transform, name:"LatentFlip", output:LATENT */
    LatentFlip(p: LatentFlip_input, id?: ComfyNodeUID): LatentFlip
    /* category:latent_transform, name:"LatentCrop", output:LATENT */
    LatentCrop(p: LatentCrop_input, id?: ComfyNodeUID): LatentCrop
    /* category:loaders, name:"LoraLoader", output:MODEL+CLIP */
    LoraLoader(p: LoraLoader_input, id?: ComfyNodeUID): LoraLoader
    /* category:advanced_loaders, name:"CLIPLoader", output:CLIP */
    CLIPLoader(p: CLIPLoader_input, id?: ComfyNodeUID): CLIPLoader
    /* category:advanced_loaders, name:"UNETLoader", output:MODEL */
    UNETLoader(p: UNETLoader_input, id?: ComfyNodeUID): UNETLoader
    /* category:advanced_loaders, name:"DualCLIPLoader", output:CLIP */
    DualCLIPLoader(p: DualCLIPLoader_input, id?: ComfyNodeUID): DualCLIPLoader
    /* category:conditioning, name:"CLIPVisionEncode", output:CLIP_VISION_OUTPUT */
    CLIPVisionEncode(p: CLIPVisionEncode_input, id?: ComfyNodeUID): CLIPVisionEncode
    /* category:conditioning_style_model, name:"StyleModelApply", output:CONDITIONING */
    StyleModelApply(p: StyleModelApply_input, id?: ComfyNodeUID): StyleModelApply
    /* category:conditioning, name:"unCLIPConditioning", output:CONDITIONING */
    UnCLIPConditioning(p: UnCLIPConditioning_input, id?: ComfyNodeUID): UnCLIPConditioning
    /* category:conditioning, name:"ControlNetApply", output:CONDITIONING */
    ControlNetApply(p: ControlNetApply_input, id?: ComfyNodeUID): ControlNetApply
    /* category:conditioning, name:"ControlNetApplyAdvanced", output:CONDITIONING+CONDITIONING_1 */
    ControlNetApplyAdvanced(p: ControlNetApplyAdvanced_input, id?: ComfyNodeUID): ControlNetApplyAdvanced
    /* category:loaders, name:"ControlNetLoader", output:CONTROL_NET */
    ControlNetLoader(p: ControlNetLoader_input, id?: ComfyNodeUID): ControlNetLoader
    /* category:loaders, name:"DiffControlNetLoader", output:CONTROL_NET */
    DiffControlNetLoader(p: DiffControlNetLoader_input, id?: ComfyNodeUID): DiffControlNetLoader
    /* category:loaders, name:"StyleModelLoader", output:STYLE_MODEL */
    StyleModelLoader(p: StyleModelLoader_input, id?: ComfyNodeUID): StyleModelLoader
    /* category:loaders, name:"CLIPVisionLoader", output:CLIP_VISION */
    CLIPVisionLoader(p: CLIPVisionLoader_input, id?: ComfyNodeUID): CLIPVisionLoader
    /* category:_for_testing, name:"VAEDecodeTiled", output:IMAGE */
    VAEDecodeTiled(p: VAEDecodeTiled_input, id?: ComfyNodeUID): VAEDecodeTiled
    /* category:_for_testing, name:"VAEEncodeTiled", output:LATENT */
    VAEEncodeTiled(p: VAEEncodeTiled_input, id?: ComfyNodeUID): VAEEncodeTiled
    /* category:loaders, name:"unCLIPCheckpointLoader", output:MODEL+CLIP+VAE+CLIP_VISION */
    UnCLIPCheckpointLoader(p: UnCLIPCheckpointLoader_input, id?: ComfyNodeUID): UnCLIPCheckpointLoader
    /* category:loaders, name:"GLIGENLoader", output:GLIGEN */
    GLIGENLoader(p: GLIGENLoader_input, id?: ComfyNodeUID): GLIGENLoader
    /* category:conditioning_gligen, name:"GLIGENTextBoxApply", output:CONDITIONING */
    GLIGENTextBoxApply(p: GLIGENTextBoxApply_input, id?: ComfyNodeUID): GLIGENTextBoxApply
    /* category:advanced_loaders, name:"CheckpointLoader", output:MODEL+CLIP+VAE */
    CheckpointLoader(p: CheckpointLoader_input, id?: ComfyNodeUID): CheckpointLoader
    /* category:advanced_loaders_deprecated, name:"DiffusersLoader", output:MODEL+CLIP+VAE */
    DiffusersLoader(p: DiffusersLoader_input, id?: ComfyNodeUID): DiffusersLoader
    /* category:_for_testing, name:"LoadLatent", output:LATENT */
    LoadLatent(p: LoadLatent_input, id?: ComfyNodeUID): LoadLatent
    /* category:_for_testing, name:"SaveLatent", output: */
    SaveLatent(p: SaveLatent_input, id?: ComfyNodeUID): SaveLatent
    /* category:advanced_conditioning, name:"ConditioningZeroOut", output:CONDITIONING */
    ConditioningZeroOut(p: ConditioningZeroOut_input, id?: ComfyNodeUID): ConditioningZeroOut
    /* category:advanced_conditioning, name:"ConditioningSetTimestepRange", output:CONDITIONING */
    ConditioningSetTimestepRange(p: ConditioningSetTimestepRange_input, id?: ComfyNodeUID): ConditioningSetTimestepRange
    /* category:latent_advanced, name:"LatentAdd", output:LATENT */
    LatentAdd(p: LatentAdd_input, id?: ComfyNodeUID): LatentAdd
    /* category:latent_advanced, name:"LatentSubtract", output:LATENT */
    LatentSubtract(p: LatentSubtract_input, id?: ComfyNodeUID): LatentSubtract
    /* category:latent_advanced, name:"LatentMultiply", output:LATENT */
    LatentMultiply(p: LatentMultiply_input, id?: ComfyNodeUID): LatentMultiply
    /* category:loaders, name:"HypernetworkLoader", output:MODEL */
    HypernetworkLoader(p: HypernetworkLoader_input, id?: ComfyNodeUID): HypernetworkLoader
    /* category:loaders, name:"UpscaleModelLoader", output:UPSCALE_MODEL */
    UpscaleModelLoader(p: UpscaleModelLoader_input, id?: ComfyNodeUID): UpscaleModelLoader
    /* category:image_upscaling, name:"ImageUpscaleWithModel", output:IMAGE */
    ImageUpscaleWithModel(p: ImageUpscaleWithModel_input, id?: ComfyNodeUID): ImageUpscaleWithModel
    /* category:image_postprocessing, name:"ImageBlend", output:IMAGE */
    ImageBlend(p: ImageBlend_input, id?: ComfyNodeUID): ImageBlend
    /* category:image_postprocessing, name:"ImageBlur", output:IMAGE */
    ImageBlur(p: ImageBlur_input, id?: ComfyNodeUID): ImageBlur
    /* category:image_postprocessing, name:"ImageQuantize", output:IMAGE */
    ImageQuantize(p: ImageQuantize_input, id?: ComfyNodeUID): ImageQuantize
    /* category:image_postprocessing, name:"ImageSharpen", output:IMAGE */
    ImageSharpen(p: ImageSharpen_input, id?: ComfyNodeUID): ImageSharpen
    /* category:image_upscaling, name:"ImageScaleToTotalPixels", output:IMAGE */
    ImageScaleToTotalPixels(p: ImageScaleToTotalPixels_input, id?: ComfyNodeUID): ImageScaleToTotalPixels
    /* category:latent, name:"LatentCompositeMasked", output:LATENT */
    LatentCompositeMasked(p: LatentCompositeMasked_input, id?: ComfyNodeUID): LatentCompositeMasked
    /* category:image, name:"ImageCompositeMasked", output:IMAGE */
    ImageCompositeMasked(p: ImageCompositeMasked_input, id?: ComfyNodeUID): ImageCompositeMasked
    /* category:mask, name:"MaskToImage", output:IMAGE */
    MaskToImage(p: MaskToImage_input, id?: ComfyNodeUID): MaskToImage
    /* category:mask, name:"ImageToMask", output:MASK */
    ImageToMask(p: ImageToMask_input, id?: ComfyNodeUID): ImageToMask
    /* category:mask, name:"ImageColorToMask", output:MASK */
    ImageColorToMask(p: ImageColorToMask_input, id?: ComfyNodeUID): ImageColorToMask
    /* category:mask, name:"SolidMask", output:MASK */
    SolidMask(p: SolidMask_input, id?: ComfyNodeUID): SolidMask
    /* category:mask, name:"InvertMask", output:MASK */
    InvertMask(p: InvertMask_input, id?: ComfyNodeUID): InvertMask
    /* category:mask, name:"CropMask", output:MASK */
    CropMask(p: CropMask_input, id?: ComfyNodeUID): CropMask
    /* category:mask, name:"MaskComposite", output:MASK */
    MaskComposite(p: MaskComposite_input, id?: ComfyNodeUID): MaskComposite
    /* category:mask, name:"FeatherMask", output:MASK */
    FeatherMask(p: FeatherMask_input, id?: ComfyNodeUID): FeatherMask
    /* category:mask, name:"GrowMask", output:MASK */
    GrowMask(p: GrowMask_input, id?: ComfyNodeUID): GrowMask
    /* category:latent_batch, name:"RebatchLatents", output:LATENT */
    RebatchLatents(p: RebatchLatents_input, id?: ComfyNodeUID): RebatchLatents
    /* category:advanced_model_merging, name:"ModelMergeSimple", output:MODEL */
    ModelMergeSimple(p: ModelMergeSimple_input, id?: ComfyNodeUID): ModelMergeSimple
    /* category:advanced_model_merging, name:"ModelMergeBlocks", output:MODEL */
    ModelMergeBlocks(p: ModelMergeBlocks_input, id?: ComfyNodeUID): ModelMergeBlocks
    /* category:advanced_model_merging, name:"ModelMergeSubtract", output:MODEL */
    ModelMergeSubtract(p: ModelMergeSubtract_input, id?: ComfyNodeUID): ModelMergeSubtract
    /* category:advanced_model_merging, name:"ModelMergeAdd", output:MODEL */
    ModelMergeAdd(p: ModelMergeAdd_input, id?: ComfyNodeUID): ModelMergeAdd
    /* category:advanced_model_merging, name:"CheckpointSave", output: */
    CheckpointSave(p: CheckpointSave_input, id?: ComfyNodeUID): CheckpointSave
    /* category:advanced_model_merging, name:"CLIPMergeSimple", output:CLIP */
    CLIPMergeSimple(p: CLIPMergeSimple_input, id?: ComfyNodeUID): CLIPMergeSimple
    /* category:_for_testing, name:"TomePatchModel", output:MODEL */
    TomePatchModel(p: TomePatchModel_input, id?: ComfyNodeUID): TomePatchModel
    /* category:advanced_conditioning, name:"CLIPTextEncodeSDXLRefiner", output:CONDITIONING */
    CLIPTextEncodeSDXLRefiner(p: CLIPTextEncodeSDXLRefiner_input, id?: ComfyNodeUID): CLIPTextEncodeSDXLRefiner
    /* category:advanced_conditioning, name:"CLIPTextEncodeSDXL", output:CONDITIONING */
    CLIPTextEncodeSDXL(p: CLIPTextEncodeSDXL_input, id?: ComfyNodeUID): CLIPTextEncodeSDXL
    /* category:image_preprocessors, name:"Canny", output:IMAGE */
    Canny(p: Canny_input, id?: ComfyNodeUID): Canny
    /* category:_for_testing, name:"FreeU", output:MODEL */
    FreeU(p: FreeU_input, id?: ComfyNodeUID): FreeU
    /* category:image, name:"Remove Image Background (abg)", output:IMAGE */
    RemoveImageBackgroundAbg(p: RemoveImageBackgroundAbg_input, id?: ComfyNodeUID): RemoveImageBackgroundAbg
    /* category:CivitAI_Loaders, name:"CivitAI_Lora_Loader", output:MODEL+CLIP */
    CivitAI_Lora_Loader(p: CivitAI_Lora_Loader_input, id?: ComfyNodeUID): CivitAI_Lora_Loader
    /* category:CivitAI_Loaders, name:"CivitAI_Checkpoint_Loader", output:MODEL+CLIP+VAE */
    CivitAI_Checkpoint_Loader(p: CivitAI_Checkpoint_Loader_input, id?: ComfyNodeUID): CivitAI_Checkpoint_Loader
    /* category:ImpactPack, name:"SAMLoader", output:SAM_MODEL */
    ImpactSAMLoader(p: ImpactSAMLoader_input, id?: ComfyNodeUID): ImpactSAMLoader
    /* category:ImpactPack_Util, name:"CLIPSegDetectorProvider", output:BBOX_DETECTOR */
    ImpactCLIPSegDetectorProvider(p: ImpactCLIPSegDetectorProvider_input, id?: ComfyNodeUID): ImpactCLIPSegDetectorProvider
    /* category:ImpactPack, name:"ONNXDetectorProvider", output:ONNX_DETECTOR */
    ImpactONNXDetectorProvider(p: ImpactONNXDetectorProvider_input, id?: ComfyNodeUID): ImpactONNXDetectorProvider
    /* category:ImpactPack_Operation, name:"BitwiseAndMaskForEach", output:SEGS */
    ImpactBitwiseAndMaskForEach(p: ImpactBitwiseAndMaskForEach_input, id?: ComfyNodeUID): ImpactBitwiseAndMaskForEach
    /* category:ImpactPack_Operation, name:"SubtractMaskForEach", output:SEGS */
    ImpactSubtractMaskForEach(p: ImpactSubtractMaskForEach_input, id?: ComfyNodeUID): ImpactSubtractMaskForEach
    /* category:ImpactPack_Detailer, name:"DetailerForEach", output:IMAGE */
    ImpactDetailerForEach(p: ImpactDetailerForEach_input, id?: ComfyNodeUID): ImpactDetailerForEach
    /* category:ImpactPack_Detailer, name:"DetailerForEachDebug", output:IMAGE+IMAGE_1+IMAGE_2+IMAGE_3+IMAGE_4 */
    ImpactDetailerForEachDebug(p: ImpactDetailerForEachDebug_input, id?: ComfyNodeUID): ImpactDetailerForEachDebug
    /* category:ImpactPack_Detailer, name:"DetailerForEachPipe", output:IMAGE+SEGS+BASIC_PIPE+IMAGE_1 */
    ImpactDetailerForEachPipe(p: ImpactDetailerForEachPipe_input, id?: ComfyNodeUID): ImpactDetailerForEachPipe
    /* category:ImpactPack_Detailer, name:"DetailerForEachDebugPipe", output:IMAGE+SEGS+BASIC_PIPE+IMAGE_1+IMAGE_2+IMAGE_3+IMAGE_4 */
    ImpactDetailerForEachDebugPipe(p: ImpactDetailerForEachDebugPipe_input, id?: ComfyNodeUID): ImpactDetailerForEachDebugPipe
    /* category:ImpactPack_Detector, name:"SAMDetectorCombined", output:MASK */
    ImpactSAMDetectorCombined(p: ImpactSAMDetectorCombined_input, id?: ComfyNodeUID): ImpactSAMDetectorCombined
    /* category:ImpactPack_Detector, name:"SAMDetectorSegmented", output:MASK+MASKS */
    ImpactSAMDetectorSegmented(p: ImpactSAMDetectorSegmented_input, id?: ComfyNodeUID): ImpactSAMDetectorSegmented
    /* category:ImpactPack_Simple, name:"FaceDetailer", output:IMAGE+IMAGE_1+IMAGE_2+MASK+DETAILER_PIPE+IMAGE_3 */
    ImpactFaceDetailer(p: ImpactFaceDetailer_input, id?: ComfyNodeUID): ImpactFaceDetailer
    /* category:ImpactPack_Simple, name:"FaceDetailerPipe", output:IMAGE+IMAGE_1+IMAGE_2+MASK+DETAILER_PIPE+IMAGE_3 */
    ImpactFaceDetailerPipe(p: ImpactFaceDetailerPipe_input, id?: ComfyNodeUID): ImpactFaceDetailerPipe
    /* category:ImpactPack_Pipe, name:"ToDetailerPipe", output:DETAILER_PIPE */
    ImpactToDetailerPipe(p: ImpactToDetailerPipe_input, id?: ComfyNodeUID): ImpactToDetailerPipe
    /* category:ImpactPack_Pipe, name:"ToDetailerPipeSDXL", output:DETAILER_PIPE */
    ImpactToDetailerPipeSDXL(p: ImpactToDetailerPipeSDXL_input, id?: ComfyNodeUID): ImpactToDetailerPipeSDXL
    /* category:ImpactPack_Pipe, name:"FromDetailerPipe", output:MODEL+CLIP+VAE+CONDITIONING+CONDITIONING_1+BBOX_DETECTOR+SAM_MODEL+SEGM_DETECTOR+DETAILER_HOOK */
    ImpactFromDetailerPipe(p: ImpactFromDetailerPipe_input, id?: ComfyNodeUID): ImpactFromDetailerPipe
    /* category:ImpactPack_Pipe, name:"FromDetailerPipe_v2", output:DETAILER_PIPE+MODEL+CLIP+VAE+CONDITIONING+CONDITIONING_1+BBOX_DETECTOR+SAM_MODEL+SEGM_DETECTOR+DETAILER_HOOK */
    ImpactFromDetailerPipe_v2(p: ImpactFromDetailerPipe_v2_input, id?: ComfyNodeUID): ImpactFromDetailerPipe_v2
    /* category:ImpactPack_Pipe, name:"FromDetailerPipeSDXL", output:DETAILER_PIPE+MODEL+CLIP+VAE+CONDITIONING+CONDITIONING_1+BBOX_DETECTOR+SAM_MODEL+SEGM_DETECTOR+DETAILER_HOOK+MODEL_1+CLIP_1+CONDITIONING_2+CONDITIONING_3 */
    ImpactFromDetailerPipeSDXL(p: ImpactFromDetailerPipeSDXL_input, id?: ComfyNodeUID): ImpactFromDetailerPipeSDXL
    /* category:ImpactPack_Pipe, name:"ToBasicPipe", output:BASIC_PIPE */
    ImpactToBasicPipe(p: ImpactToBasicPipe_input, id?: ComfyNodeUID): ImpactToBasicPipe
    /* category:ImpactPack_Pipe, name:"FromBasicPipe", output:MODEL+CLIP+VAE+CONDITIONING+CONDITIONING_1 */
    ImpactFromBasicPipe(p: ImpactFromBasicPipe_input, id?: ComfyNodeUID): ImpactFromBasicPipe
    /* category:ImpactPack_Pipe, name:"FromBasicPipe_v2", output:BASIC_PIPE+MODEL+CLIP+VAE+CONDITIONING+CONDITIONING_1 */
    ImpactFromBasicPipe_v2(p: ImpactFromBasicPipe_v2_input, id?: ComfyNodeUID): ImpactFromBasicPipe_v2
    /* category:ImpactPack_Pipe, name:"BasicPipeToDetailerPipe", output:DETAILER_PIPE */
    ImpactBasicPipeToDetailerPipe(p: ImpactBasicPipeToDetailerPipe_input, id?: ComfyNodeUID): ImpactBasicPipeToDetailerPipe
    /* category:ImpactPack_Pipe, name:"BasicPipeToDetailerPipeSDXL", output:DETAILER_PIPE */
    ImpactBasicPipeToDetailerPipeSDXL(p: ImpactBasicPipeToDetailerPipeSDXL_input, id?: ComfyNodeUID): ImpactBasicPipeToDetailerPipeSDXL
    /* category:ImpactPack_Pipe, name:"DetailerPipeToBasicPipe", output:BASIC_PIPE+BASIC_PIPE_1 */
    ImpactDetailerPipeToBasicPipe(p: ImpactDetailerPipeToBasicPipe_input, id?: ComfyNodeUID): ImpactDetailerPipeToBasicPipe
    /* category:ImpactPack_Pipe, name:"EditBasicPipe", output:BASIC_PIPE */
    ImpactEditBasicPipe(p: ImpactEditBasicPipe_input, id?: ComfyNodeUID): ImpactEditBasicPipe
    /* category:ImpactPack_Pipe, name:"EditDetailerPipe", output:DETAILER_PIPE */
    ImpactEditDetailerPipe(p: ImpactEditDetailerPipe_input, id?: ComfyNodeUID): ImpactEditDetailerPipe
    /* category:ImpactPack_Pipe, name:"EditDetailerPipeSDXL", output:DETAILER_PIPE */
    ImpactEditDetailerPipeSDXL(p: ImpactEditDetailerPipeSDXL_input, id?: ComfyNodeUID): ImpactEditDetailerPipeSDXL
    /* category:ImpactPack_Upscale, name:"LatentPixelScale", output:LATENT */
    ImpactLatentPixelScale(p: ImpactLatentPixelScale_input, id?: ComfyNodeUID): ImpactLatentPixelScale
    /* category:ImpactPack_Upscale, name:"PixelKSampleUpscalerProvider", output:UPSCALER */
    ImpactPixelKSampleUpscalerProvider(p: ImpactPixelKSampleUpscalerProvider_input, id?: ComfyNodeUID): ImpactPixelKSampleUpscalerProvider
    /* category:ImpactPack_Upscale, name:"PixelKSampleUpscalerProviderPipe", output:UPSCALER */
    ImpactPixelKSampleUpscalerProviderPipe(p: ImpactPixelKSampleUpscalerProviderPipe_input, id?: ComfyNodeUID): ImpactPixelKSampleUpscalerProviderPipe
    /* category:ImpactPack_Upscale, name:"IterativeLatentUpscale", output:LATENT */
    ImpactIterativeLatentUpscale(p: ImpactIterativeLatentUpscale_input, id?: ComfyNodeUID): ImpactIterativeLatentUpscale
    /* category:ImpactPack_Upscale, name:"IterativeImageUpscale", output:IMAGE */
    ImpactIterativeImageUpscale(p: ImpactIterativeImageUpscale_input, id?: ComfyNodeUID): ImpactIterativeImageUpscale
    /* category:ImpactPack_Upscale, name:"PixelTiledKSampleUpscalerProvider", output:UPSCALER */
    ImpactPixelTiledKSampleUpscalerProvider(p: ImpactPixelTiledKSampleUpscalerProvider_input, id?: ComfyNodeUID): ImpactPixelTiledKSampleUpscalerProvider
    /* category:ImpactPack_Upscale, name:"PixelTiledKSampleUpscalerProviderPipe", output:UPSCALER */
    ImpactPixelTiledKSampleUpscalerProviderPipe(p: ImpactPixelTiledKSampleUpscalerProviderPipe_input, id?: ComfyNodeUID): ImpactPixelTiledKSampleUpscalerProviderPipe
    /* category:ImpactPack_Upscale, name:"TwoSamplersForMaskUpscalerProvider", output:UPSCALER */
    ImpactTwoSamplersForMaskUpscalerProvider(p: ImpactTwoSamplersForMaskUpscalerProvider_input, id?: ComfyNodeUID): ImpactTwoSamplersForMaskUpscalerProvider
    /* category:ImpactPack_Upscale, name:"TwoSamplersForMaskUpscalerProviderPipe", output:UPSCALER */
    ImpactTwoSamplersForMaskUpscalerProviderPipe(p: ImpactTwoSamplersForMaskUpscalerProviderPipe_input, id?: ComfyNodeUID): ImpactTwoSamplersForMaskUpscalerProviderPipe
    /* category:ImpactPack_Upscale, name:"PixelKSampleHookCombine", output:PK_HOOK */
    ImpactPixelKSampleHookCombine(p: ImpactPixelKSampleHookCombine_input, id?: ComfyNodeUID): ImpactPixelKSampleHookCombine
    /* category:ImpactPack_Upscale, name:"DenoiseScheduleHookProvider", output:PK_HOOK */
    ImpactDenoiseScheduleHookProvider(p: ImpactDenoiseScheduleHookProvider_input, id?: ComfyNodeUID): ImpactDenoiseScheduleHookProvider
    /* category:ImpactPack_Upscale, name:"CfgScheduleHookProvider", output:PK_HOOK */
    ImpactCfgScheduleHookProvider(p: ImpactCfgScheduleHookProvider_input, id?: ComfyNodeUID): ImpactCfgScheduleHookProvider
    /* category:ImpactPack_Upscale, name:"NoiseInjectionHookProvider", output:PK_HOOK */
    ImpactNoiseInjectionHookProvider(p: ImpactNoiseInjectionHookProvider_input, id?: ComfyNodeUID): ImpactNoiseInjectionHookProvider
    /* category:ImpactPack_Detailer, name:"NoiseInjectionDetailerHookProvider", output:DETAILER_HOOK */
    ImpactNoiseInjectionDetailerHookProvider(p: ImpactNoiseInjectionDetailerHookProvider_input, id?: ComfyNodeUID): ImpactNoiseInjectionDetailerHookProvider
    /* category:ImpactPack_Operation, name:"BitwiseAndMask", output:MASK */
    ImpactBitwiseAndMask(p: ImpactBitwiseAndMask_input, id?: ComfyNodeUID): ImpactBitwiseAndMask
    /* category:ImpactPack_Operation, name:"SubtractMask", output:MASK */
    ImpactSubtractMask(p: ImpactSubtractMask_input, id?: ComfyNodeUID): ImpactSubtractMask
    /* category:ImpactPack_Operation, name:"AddMask", output:MASK */
    ImpactAddMask(p: ImpactAddMask_input, id?: ComfyNodeUID): ImpactAddMask
    /* category:ImpactPack_Operation, name:"Segs & Mask", output:SEGS */
    ImpactSegsMask(p: ImpactSegsMask_input, id?: ComfyNodeUID): ImpactSegsMask
    /* category:ImpactPack_Operation, name:"Segs & Mask ForEach", output:SEGS */
    ImpactSegsMaskForEach(p: ImpactSegsMaskForEach_input, id?: ComfyNodeUID): ImpactSegsMaskForEach
    /* category:ImpactPack_Util, name:"EmptySegs", output:SEGS */
    ImpactEmptySegs(p: ImpactEmptySegs_input, id?: ComfyNodeUID): ImpactEmptySegs
    /* category:ImpactPack_Operation, name:"MediaPipeFaceMeshToSEGS", output:SEGS */
    ImpactMediaPipeFaceMeshToSEGS(p: ImpactMediaPipeFaceMeshToSEGS_input, id?: ComfyNodeUID): ImpactMediaPipeFaceMeshToSEGS
    /* category:ImpactPack_Operation, name:"MaskToSEGS", output:SEGS */
    ImpactMaskToSEGS(p: ImpactMaskToSEGS_input, id?: ComfyNodeUID): ImpactMaskToSEGS
    /* category:ImpactPack_Operation, name:"ToBinaryMask", output:MASK */
    ImpactToBinaryMask(p: ImpactToBinaryMask_input, id?: ComfyNodeUID): ImpactToBinaryMask
    /* category:ImpactPack_Operation, name:"MasksToMaskList", output:MASK */
    ImpactMasksToMaskList(p: ImpactMasksToMaskList_input, id?: ComfyNodeUID): ImpactMasksToMaskList
    /* category:ImpactPack_Operation, name:"MaskListToMaskBatch", output:MASKS */
    ImpactMaskListToMaskBatch(p: ImpactMaskListToMaskBatch_input, id?: ComfyNodeUID): ImpactMaskListToMaskBatch
    /* category:ImpactPack_Detector, name:"BboxDetectorSEGS", output:SEGS */
    ImpactBboxDetectorSEGS(p: ImpactBboxDetectorSEGS_input, id?: ComfyNodeUID): ImpactBboxDetectorSEGS
    /* category:ImpactPack_Detector, name:"SegmDetectorSEGS", output:SEGS */
    ImpactSegmDetectorSEGS(p: ImpactSegmDetectorSEGS_input, id?: ComfyNodeUID): ImpactSegmDetectorSEGS
    /* category:ImpactPack_Detector, name:"ONNXDetectorSEGS", output:SEGS */
    ImpactONNXDetectorSEGS(p: ImpactONNXDetectorSEGS_input, id?: ComfyNodeUID): ImpactONNXDetectorSEGS
    /* category:ImpactPack_Detector, name:"ImpactSimpleDetectorSEGS", output:SEGS */
    ImpactImpactSimpleDetectorSEGS(p: ImpactImpactSimpleDetectorSEGS_input, id?: ComfyNodeUID): ImpactImpactSimpleDetectorSEGS
    /* category:ImpactPack_Detector, name:"ImpactSimpleDetectorSEGSPipe", output:SEGS */
    ImpactImpactSimpleDetectorSEGSPipe(p: ImpactImpactSimpleDetectorSEGSPipe_input, id?: ComfyNodeUID): ImpactImpactSimpleDetectorSEGSPipe
    /* category:ImpactPack_Util, name:"ImpactControlNetApplySEGS", output:SEGS */
    ImpactImpactControlNetApplySEGS(p: ImpactImpactControlNetApplySEGS_input, id?: ComfyNodeUID): ImpactImpactControlNetApplySEGS
    /* category:ImpactPack_Util, name:"ImpactDecomposeSEGS", output:SEGS_HEADER+SEG_ELT */
    ImpactImpactDecomposeSEGS(p: ImpactImpactDecomposeSEGS_input, id?: ComfyNodeUID): ImpactImpactDecomposeSEGS
    /* category:ImpactPack_Util, name:"ImpactAssembleSEGS", output:SEGS */
    ImpactImpactAssembleSEGS(p: ImpactImpactAssembleSEGS_input, id?: ComfyNodeUID): ImpactImpactAssembleSEGS
    /* category:ImpactPack_Util, name:"ImpactFrom_SEG_ELT", output:SEG_ELT+IMAGE+MASK+SEG_ELT_crop_region+SEG_ELT_bbox+SEG_ELT_control_net_wrapper+FLOAT+STRING */
    ImpactImpactFrom_SEG_ELT(p: ImpactImpactFrom_SEG_ELT_input, id?: ComfyNodeUID): ImpactImpactFrom_SEG_ELT
    /* category:ImpactPack_Util, name:"ImpactEdit_SEG_ELT", output:SEG_ELT */
    ImpactImpactEdit_SEG_ELT(p: ImpactImpactEdit_SEG_ELT_input, id?: ComfyNodeUID): ImpactImpactEdit_SEG_ELT
    /* category:ImpactPack_Util, name:"ImpactDilate_Mask_SEG_ELT", output:SEG_ELT */
    ImpactImpactDilate_Mask_SEG_ELT(p: ImpactImpactDilate_Mask_SEG_ELT_input, id?: ComfyNodeUID): ImpactImpactDilate_Mask_SEG_ELT
    /* category:ImpactPack_Util, name:"ImpactDilateMask", output:MASK */
    ImpactImpactDilateMask(p: ImpactImpactDilateMask_input, id?: ComfyNodeUID): ImpactImpactDilateMask
    /* category:ImpactPack_Util, name:"ImpactScaleBy_BBOX_SEG_ELT", output:SEG_ELT */
    ImpactImpactScaleBy_BBOX_SEG_ELT(p: ImpactImpactScaleBy_BBOX_SEG_ELT_input, id?: ComfyNodeUID): ImpactImpactScaleBy_BBOX_SEG_ELT
    /* category:ImpactPack_Detector, name:"BboxDetectorCombined_v2", output:MASK */
    ImpactBboxDetectorCombined_v2(p: ImpactBboxDetectorCombined_v2_input, id?: ComfyNodeUID): ImpactBboxDetectorCombined_v2
    /* category:ImpactPack_Detector, name:"SegmDetectorCombined_v2", output:MASK */
    ImpactSegmDetectorCombined_v2(p: ImpactSegmDetectorCombined_v2_input, id?: ComfyNodeUID): ImpactSegmDetectorCombined_v2
    /* category:ImpactPack_Operation, name:"SegsToCombinedMask", output:MASK */
    ImpactSegsToCombinedMask(p: ImpactSegsToCombinedMask_input, id?: ComfyNodeUID): ImpactSegsToCombinedMask
    /* category:ImpactPack_Sampler, name:"KSamplerProvider", output:KSAMPLER */
    ImpactKSamplerProvider(p: ImpactKSamplerProvider_input, id?: ComfyNodeUID): ImpactKSamplerProvider
    /* category:ImpactPack_Sampler, name:"TwoSamplersForMask", output:LATENT */
    ImpactTwoSamplersForMask(p: ImpactTwoSamplersForMask_input, id?: ComfyNodeUID): ImpactTwoSamplersForMask
    /* category:ImpactPack_Sampler, name:"TiledKSamplerProvider", output:KSAMPLER */
    ImpactTiledKSamplerProvider(p: ImpactTiledKSamplerProvider_input, id?: ComfyNodeUID): ImpactTiledKSamplerProvider
    /* category:ImpactPack_Sampler, name:"KSamplerAdvancedProvider", output:KSAMPLER_ADVANCED */
    ImpactKSamplerAdvancedProvider(p: ImpactKSamplerAdvancedProvider_input, id?: ComfyNodeUID): ImpactKSamplerAdvancedProvider
    /* category:ImpactPack_Sampler, name:"TwoAdvancedSamplersForMask", output:LATENT */
    ImpactTwoAdvancedSamplersForMask(p: ImpactTwoAdvancedSamplersForMask_input, id?: ComfyNodeUID): ImpactTwoAdvancedSamplersForMask
    /* category:ImpactPack_Util, name:"PreviewBridge", output:IMAGE+MASK */
    ImpactPreviewBridge(p: ImpactPreviewBridge_input, id?: ComfyNodeUID): ImpactPreviewBridge
    /* category:ImpactPack_Util, name:"ImageSender", output: */
    ImpactImageSender(p: ImpactImageSender_input, id?: ComfyNodeUID): ImpactImageSender
    /* category:ImpactPack_Util, name:"ImageReceiver", output:IMAGE+MASK */
    ImpactImageReceiver(p: ImpactImageReceiver_input, id?: ComfyNodeUID): ImpactImageReceiver
    /* category:ImpactPack_Util, name:"LatentSender", output: */
    ImpactLatentSender(p: ImpactLatentSender_input, id?: ComfyNodeUID): ImpactLatentSender
    /* category:ImpactPack_Util, name:"LatentReceiver", output:LATENT */
    ImpactLatentReceiver(p: ImpactLatentReceiver_input, id?: ComfyNodeUID): ImpactLatentReceiver
    /* category:ImpactPack_Util, name:"ImageMaskSwitch", output:IMAGE+MASK */
    ImpactImageMaskSwitch(p: ImpactImageMaskSwitch_input, id?: ComfyNodeUID): ImpactImageMaskSwitch
    /* category:ImpactPack_Util, name:"LatentSwitch", output:*+STRING */
    ImpactLatentSwitch(p: ImpactLatentSwitch_input, id?: ComfyNodeUID): ImpactLatentSwitch
    /* category:ImpactPack_Util, name:"SEGSSwitch", output:*+STRING */
    ImpactSEGSSwitch(p: ImpactSEGSSwitch_input, id?: ComfyNodeUID): ImpactSEGSSwitch
    /* category:ImpactPack_Util, name:"ImpactSwitch", output:*+STRING */
    ImpactImpactSwitch(p: ImpactImpactSwitch_input, id?: ComfyNodeUID): ImpactImpactSwitch
    /* category:ImpactPack_Util, name:"ImpactInversedSwitch", output:*+*_1+*_2+*_3+*_4+*_5+*_6+*_7+*_8+*_9+*_10+*_11+*_12+*_13+*_14+*_15+*_16+*_17+*_18+*_19+*_20+*_21+*_22+*_23+*_24+*_25+*_26+*_27+*_28+*_29+*_30+*_31+*_32+*_33+*_34+*_35+*_36+*_37+*_38+*_39+*_40+*_41+*_42+*_43+*_44+*_45+*_46+*_47+*_48+*_49+*_50+*_51+*_52+*_53+*_54+*_55+*_56+*_57+*_58+*_59+*_60+*_61+*_62+*_63+*_64+*_65+*_66+*_67+*_68+*_69+*_70+*_71+*_72+*_73+*_74+*_75+*_76+*_77+*_78+*_79+*_80+*_81+*_82+*_83+*_84+*_85+*_86+*_87+*_88+*_89+*_90+*_91+*_92+*_93+*_94+*_95+*_96+*_97+*_98+*_99 */
    ImpactImpactInversedSwitch(p: ImpactImpactInversedSwitch_input, id?: ComfyNodeUID): ImpactImpactInversedSwitch
    /* category:ImpactPack_Prompt, name:"ImpactWildcardProcessor", output:STRING */
    ImpactImpactWildcardProcessor(p: ImpactImpactWildcardProcessor_input, id?: ComfyNodeUID): ImpactImpactWildcardProcessor
    /* category:ImpactPack_Prompt, name:"ImpactWildcardEncode", output:MODEL+CLIP+CONDITIONING+STRING */
    ImpactImpactWildcardEncode(p: ImpactImpactWildcardEncode_input, id?: ComfyNodeUID): ImpactImpactWildcardEncode
    /* category:ImpactPack_Detailer, name:"SEGSDetailer", output:SEGS+IMAGE */
    ImpactSEGSDetailer(p: ImpactSEGSDetailer_input, id?: ComfyNodeUID): ImpactSEGSDetailer
    /* category:ImpactPack_Detailer, name:"SEGSPaste", output:IMAGE */
    ImpactSEGSPaste(p: ImpactSEGSPaste_input, id?: ComfyNodeUID): ImpactSEGSPaste
    /* category:ImpactPack_Util, name:"SEGSPreview", output: */
    ImpactSEGSPreview(p: ImpactSEGSPreview_input, id?: ComfyNodeUID): ImpactSEGSPreview
    /* category:ImpactPack_Util, name:"SEGSToImageList", output:IMAGE */
    ImpactSEGSToImageList(p: ImpactSEGSToImageList_input, id?: ComfyNodeUID): ImpactSEGSToImageList
    /* category:ImpactPack_Util, name:"ImpactSEGSToMaskList", output:MASK */
    ImpactImpactSEGSToMaskList(p: ImpactImpactSEGSToMaskList_input, id?: ComfyNodeUID): ImpactImpactSEGSToMaskList
    /* category:ImpactPack_Util, name:"ImpactSEGSToMaskBatch", output:MASKS */
    ImpactImpactSEGSToMaskBatch(p: ImpactImpactSEGSToMaskBatch_input, id?: ComfyNodeUID): ImpactImpactSEGSToMaskBatch
    /* category:ImpactPack_Util, name:"ImpactSEGSConcat", output:SEGS */
    ImpactImpactSEGSConcat(p: ImpactImpactSEGSConcat_input, id?: ComfyNodeUID): ImpactImpactSEGSConcat
    /* category:sampling, name:"ImpactKSamplerBasicPipe", output:BASIC_PIPE+LATENT+VAE */
    ImpactKSamplerBasicPipe(p: ImpactKSamplerBasicPipe_input, id?: ComfyNodeUID): ImpactKSamplerBasicPipe
    /* category:sampling, name:"ImpactKSamplerAdvancedBasicPipe", output:BASIC_PIPE+LATENT+VAE */
    ImpactKSamplerAdvancedBasicPipe(p: ImpactKSamplerAdvancedBasicPipe_input, id?: ComfyNodeUID): ImpactKSamplerAdvancedBasicPipe
    /* category:ImpactPack_Util, name:"ReencodeLatent", output:LATENT */
    ImpactReencodeLatent(p: ImpactReencodeLatent_input, id?: ComfyNodeUID): ImpactReencodeLatent
    /* category:ImpactPack_Util, name:"ReencodeLatentPipe", output:LATENT */
    ImpactReencodeLatentPipe(p: ImpactReencodeLatentPipe_input, id?: ComfyNodeUID): ImpactReencodeLatentPipe
    /* category:ImpactPack_Util, name:"ImpactImageBatchToImageList", output:IMAGE */
    ImpactImpactImageBatchToImageList(p: ImpactImpactImageBatchToImageList_input, id?: ComfyNodeUID): ImpactImpactImageBatchToImageList
    /* category:ImpactPack_Util, name:"ImpactMakeImageList", output:IMAGE */
    ImpactImpactMakeImageList(p: ImpactImpactMakeImageList_input, id?: ComfyNodeUID): ImpactImpactMakeImageList
    /* category:ImpactPack_Regional, name:"RegionalSampler", output:LATENT */
    ImpactRegionalSampler(p: ImpactRegionalSampler_input, id?: ComfyNodeUID): ImpactRegionalSampler
    /* category:ImpactPack_Regional, name:"CombineRegionalPrompts", output:REGIONAL_PROMPTS */
    ImpactCombineRegionalPrompts(p: ImpactCombineRegionalPrompts_input, id?: ComfyNodeUID): ImpactCombineRegionalPrompts
    /* category:ImpactPack_Regional, name:"RegionalPrompt", output:REGIONAL_PROMPTS */
    ImpactRegionalPrompt(p: ImpactRegionalPrompt_input, id?: ComfyNodeUID): ImpactRegionalPrompt
    /* category:ImpactPack_Util, name:"ImpactSEGSLabelFilter", output:SEGS+SEGS_1 */
    ImpactImpactSEGSLabelFilter(p: ImpactImpactSEGSLabelFilter_input, id?: ComfyNodeUID): ImpactImpactSEGSLabelFilter
    /* category:ImpactPack_Util, name:"ImpactSEGSRangeFilter", output:SEGS+SEGS_1 */
    ImpactImpactSEGSRangeFilter(p: ImpactImpactSEGSRangeFilter_input, id?: ComfyNodeUID): ImpactImpactSEGSRangeFilter
    /* category:ImpactPack_Util, name:"ImpactSEGSOrderedFilter", output:SEGS+SEGS_1 */
    ImpactImpactSEGSOrderedFilter(p: ImpactImpactSEGSOrderedFilter_input, id?: ComfyNodeUID): ImpactImpactSEGSOrderedFilter
    /* category:ImpactPack_Logic, name:"ImpactCompare", output:BOOLEAN */
    ImpactImpactCompare(p: ImpactImpactCompare_input, id?: ComfyNodeUID): ImpactImpactCompare
    /* category:ImpactPack_Logic, name:"ImpactConditionalBranch", output:* */
    ImpactImpactConditionalBranch(p: ImpactImpactConditionalBranch_input, id?: ComfyNodeUID): ImpactImpactConditionalBranch
    /* category:ImpactPack_Logic, name:"ImpactInt", output:INT */
    ImpactImpactInt(p: ImpactImpactInt_input, id?: ComfyNodeUID): ImpactImpactInt
    /* category:ImpactPack_Logic, name:"ImpactValueSender", output: */
    ImpactImpactValueSender(p: ImpactImpactValueSender_input, id?: ComfyNodeUID): ImpactImpactValueSender
    /* category:ImpactPack_Logic, name:"ImpactValueReceiver", output:* */
    ImpactImpactValueReceiver(p: ImpactImpactValueReceiver_input, id?: ComfyNodeUID): ImpactImpactValueReceiver
    /* category:ImpactPack_Logic__for_test, name:"ImpactImageInfo", output:INT+INT_1+INT_2+INT_3 */
    ImpactImpactImageInfo(p: ImpactImpactImageInfo_input, id?: ComfyNodeUID): ImpactImpactImageInfo
    /* category:ImpactPack_Logic__for_test, name:"ImpactMinMax", output:INT */
    ImpactImpactMinMax(p: ImpactImpactMinMax_input, id?: ComfyNodeUID): ImpactImpactMinMax
    /* category:ImpactPack_Logic, name:"ImpactNeg", output:BOOLEAN */
    ImpactImpactNeg(p: ImpactImpactNeg_input, id?: ComfyNodeUID): ImpactImpactNeg
    /* category:ImpactPack_Logic, name:"ImpactConditionalStopIteration", output: */
    ImpactImpactConditionalStopIteration(p: ImpactImpactConditionalStopIteration_input, id?: ComfyNodeUID): ImpactImpactConditionalStopIteration
    /* category:ImpactPack_Util, name:"ImpactStringSelector", output:STRING */
    ImpactImpactStringSelector(p: ImpactImpactStringSelector_input, id?: ComfyNodeUID): ImpactImpactStringSelector
    /* category:ImpactPack_Util, name:"RemoveNoiseMask", output:LATENT */
    ImpactRemoveNoiseMask(p: ImpactRemoveNoiseMask_input, id?: ComfyNodeUID): ImpactRemoveNoiseMask
    /* category:ImpactPack_Debug, name:"ImpactLogger", output: */
    ImpactImpactLogger(p: ImpactImpactLogger_input, id?: ComfyNodeUID): ImpactImpactLogger
    /* category:ImpactPack_Debug, name:"ImpactDummyInput", output:* */
    ImpactImpactDummyInput(p: ImpactImpactDummyInput_input, id?: ComfyNodeUID): ImpactImpactDummyInput
    /* category:ImpactPack, name:"UltralyticsDetectorProvider", output:BBOX_DETECTOR+SEGM_DETECTOR */
    ImpactUltralyticsDetectorProvider(p: ImpactUltralyticsDetectorProvider_input, id?: ComfyNodeUID): ImpactUltralyticsDetectorProvider
    /* category:InspirePack_LoraBlockWeight, name:"XY Input: Lora Block Weight //Inspire", output:XY+XY_1 */
    XYInputLoraBlockWeightInspire(p: XYInputLoraBlockWeightInspire_input, id?: ComfyNodeUID): XYInputLoraBlockWeightInspire
    /* category:InspirePack_LoraBlockWeight, name:"LoraLoaderBlockWeight //Inspire", output:MODEL+CLIP+STRING */
    LoraLoaderBlockWeightInspire(p: LoraLoaderBlockWeightInspire_input, id?: ComfyNodeUID): LoraLoaderBlockWeightInspire
    /* category:InspirePack_LoraBlockWeight, name:"LoraBlockInfo //Inspire", output: */
    LoraBlockInfoInspire(p: LoraBlockInfoInspire_input, id?: ComfyNodeUID): LoraBlockInfoInspire
    /* category:InspirePack_SEGS_ControlNet, name:"OpenPose_Preprocessor_Provider_for_SEGS //Inspire", output:SEGS_PREPROCESSOR */
    OpenPose_Preprocessor_Provider_for_SEGSInspire(p: OpenPose_Preprocessor_Provider_for_SEGSInspire_input, id?: ComfyNodeUID): OpenPose_Preprocessor_Provider_for_SEGSInspire
    /* category:InspirePack_SEGS_ControlNet, name:"DWPreprocessor_Provider_for_SEGS //Inspire", output:SEGS_PREPROCESSOR */
    DWPreprocessor_Provider_for_SEGSInspire(p: DWPreprocessor_Provider_for_SEGSInspire_input, id?: ComfyNodeUID): DWPreprocessor_Provider_for_SEGSInspire
    /* category:InspirePack_SEGS_ControlNet, name:"MiDaS_DepthMap_Preprocessor_Provider_for_SEGS //Inspire", output:SEGS_PREPROCESSOR */
    MiDaS_DepthMap_Preprocessor_Provider_for_SEGSInspire(p: MiDaS_DepthMap_Preprocessor_Provider_for_SEGSInspire_input, id?: ComfyNodeUID): MiDaS_DepthMap_Preprocessor_Provider_for_SEGSInspire
    /* category:InspirePack_SEGS_ControlNet, name:"LeRes_DepthMap_Preprocessor_Provider_for_SEGS //Inspire", output:SEGS_PREPROCESSOR */
    LeRes_DepthMap_Preprocessor_Provider_for_SEGSInspire(p: LeRes_DepthMap_Preprocessor_Provider_for_SEGSInspire_input, id?: ComfyNodeUID): LeRes_DepthMap_Preprocessor_Provider_for_SEGSInspire
    /* category:InspirePack_SEGS_ControlNet, name:"Canny_Preprocessor_Provider_for_SEGS //Inspire", output:SEGS_PREPROCESSOR */
    Canny_Preprocessor_Provider_for_SEGSInspire(p: Canny_Preprocessor_Provider_for_SEGSInspire_input, id?: ComfyNodeUID): Canny_Preprocessor_Provider_for_SEGSInspire
    /* category:InspirePack_SEGS_ControlNet, name:"MediaPipe_FaceMesh_Preprocessor_Provider_for_SEGS //Inspire", output:SEGS_PREPROCESSOR */
    MediaPipe_FaceMesh_Preprocessor_Provider_for_SEGSInspire(p: MediaPipe_FaceMesh_Preprocessor_Provider_for_SEGSInspire_input, id?: ComfyNodeUID): MediaPipe_FaceMesh_Preprocessor_Provider_for_SEGSInspire
    /* category:InspirePack_Detector, name:"MediaPipeFaceMeshDetectorProvider //Inspire", output:BBOX_DETECTOR+SEGM_DETECTOR */
    MediaPipeFaceMeshDetectorProviderInspire(p: MediaPipeFaceMeshDetectorProviderInspire_input, id?: ComfyNodeUID): MediaPipeFaceMeshDetectorProviderInspire
    /* category:InspirePack_SEGS_ControlNet, name:"HEDPreprocessor_Provider_for_SEGS //Inspire", output:SEGS_PREPROCESSOR */
    HEDPreprocessor_Provider_for_SEGSInspire(p: HEDPreprocessor_Provider_for_SEGSInspire_input, id?: ComfyNodeUID): HEDPreprocessor_Provider_for_SEGSInspire
    /* category:InspirePack_SEGS_ControlNet, name:"FakeScribblePreprocessor_Provider_for_SEGS //Inspire", output:SEGS_PREPROCESSOR */
    FakeScribblePreprocessor_Provider_for_SEGSInspire(p: FakeScribblePreprocessor_Provider_for_SEGSInspire_input, id?: ComfyNodeUID): FakeScribblePreprocessor_Provider_for_SEGSInspire
    /* category:InspirePack_a1111_compat, name:"KSampler //Inspire", output:LATENT */
    KSamplerInspire(p: KSamplerInspire_input, id?: ComfyNodeUID): KSamplerInspire
    /* category:InspirePack_prompt, name:"LoadPromptsFromDir //Inspire", output:ZIPPED_PROMPT */
    LoadPromptsFromDirInspire(p: LoadPromptsFromDirInspire_input, id?: ComfyNodeUID): LoadPromptsFromDirInspire
    /* category:InspirePack_prompt, name:"UnzipPrompt //Inspire", output:STRING+STRING_1+STRING_2 */
    UnzipPromptInspire(p: UnzipPromptInspire_input, id?: ComfyNodeUID): UnzipPromptInspire
    /* category:InspirePack_prompt, name:"ZipPrompt //Inspire", output:ZIPPED_PROMPT */
    ZipPromptInspire(p: ZipPromptInspire_input, id?: ComfyNodeUID): ZipPromptInspire
    /* category:InspirePack_prompt, name:"PromptExtractor //Inspire", output:STRING+STRING_1 */
    PromptExtractorInspire(p: PromptExtractorInspire_input, id?: ComfyNodeUID): PromptExtractorInspire
    /* category:InspirePack, name:"GlobalSeed //Inspire", output: */
    GlobalSeedInspire(p: GlobalSeedInspire_input, id?: ComfyNodeUID): GlobalSeedInspire
    /* category:sampling, name:"BNK_TiledKSamplerAdvanced", output:LATENT */
    BNK_TiledKSamplerAdvanced(p: BNK_TiledKSamplerAdvanced_input, id?: ComfyNodeUID): BNK_TiledKSamplerAdvanced
    /* category:sampling, name:"BNK_TiledKSampler", output:LATENT */
    BNK_TiledKSampler(p: BNK_TiledKSampler_input, id?: ComfyNodeUID): BNK_TiledKSampler
    /* category:Efficiency Nodes_Sampling, name:"KSampler (Efficient)", output:MODEL+CONDITIONING+CONDITIONING_1+LATENT+VAE+IMAGE */
    KSamplerEfficient(p: KSamplerEfficient_input, id?: ComfyNodeUID): KSamplerEfficient
    /* category:Efficiency Nodes_Sampling, name:"KSampler Adv. (Efficient)", output:MODEL+CONDITIONING+CONDITIONING_1+LATENT+VAE+IMAGE */
    KSamplerAdvEfficient(p: KSamplerAdvEfficient_input, id?: ComfyNodeUID): KSamplerAdvEfficient
    /* category:Efficiency Nodes_Sampling, name:"KSampler SDXL (Eff.)", output:SDXL_TUPLE+LATENT+VAE+IMAGE */
    KSamplerSDXLEff(p: KSamplerSDXLEff_input, id?: ComfyNodeUID): KSamplerSDXLEff
    /* category:Efficiency Nodes_Loaders, name:"Efficient Loader", output:MODEL+CONDITIONING+CONDITIONING_1+LATENT+VAE+CLIP+DEPENDENCIES */
    EfficientLoader(p: EfficientLoader_input, id?: ComfyNodeUID): EfficientLoader
    /* category:Efficiency Nodes_Loaders, name:"Eff. Loader SDXL", output:SDXL_TUPLE+LATENT+VAE+DEPENDENCIES */
    EffLoaderSDXL(p: EffLoaderSDXL_input, id?: ComfyNodeUID): EffLoaderSDXL
    /* category:Efficiency Nodes_Stackers, name:"LoRA Stacker", output:LORA_STACK */
    LoRAStacker(p: LoRAStacker_input, id?: ComfyNodeUID): LoRAStacker
    /* category:Efficiency Nodes_Stackers, name:"Control Net Stacker", output:CONTROL_NET_STACK */
    ControlNetStacker(p: ControlNetStacker_input, id?: ComfyNodeUID): ControlNetStacker
    /* category:Efficiency Nodes_Stackers, name:"Apply ControlNet Stack", output:CONDITIONING+CONDITIONING_1 */
    ApplyControlNetStack(p: ApplyControlNetStack_input, id?: ComfyNodeUID): ApplyControlNetStack
    /* category:Efficiency Nodes_Misc, name:"Unpack SDXL Tuple", output:MODEL+CLIP+CONDITIONING+CONDITIONING_1+MODEL_1+CLIP_1+CONDITIONING_2+CONDITIONING_3 */
    UnpackSDXLTuple(p: UnpackSDXLTuple_input, id?: ComfyNodeUID): UnpackSDXLTuple
    /* category:Efficiency Nodes_Misc, name:"Pack SDXL Tuple", output:SDXL_TUPLE */
    PackSDXLTuple(p: PackSDXLTuple_input, id?: ComfyNodeUID): PackSDXLTuple
    /* category:Efficiency Nodes_Scripts, name:"XY Plot", output:SCRIPT */
    XYPlot(p: XYPlot_input, id?: ComfyNodeUID): XYPlot
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: Seeds++ Batch", output:XY */
    XYInputSeedsBatch(p: XYInputSeedsBatch_input, id?: ComfyNodeUID): XYInputSeedsBatch
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: Add/Return Noise", output:XY */
    XYInputAddReturnNoise(p: XYInputAddReturnNoise_input, id?: ComfyNodeUID): XYInputAddReturnNoise
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: Steps", output:XY */
    XYInputSteps(p: XYInputSteps_input, id?: ComfyNodeUID): XYInputSteps
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: CFG Scale", output:XY */
    XYInputCFGScale(p: XYInputCFGScale_input, id?: ComfyNodeUID): XYInputCFGScale
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: Sampler/Scheduler", output:XY */
    XYInputSamplerScheduler(p: XYInputSamplerScheduler_input, id?: ComfyNodeUID): XYInputSamplerScheduler
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: Denoise", output:XY */
    XYInputDenoise(p: XYInputDenoise_input, id?: ComfyNodeUID): XYInputDenoise
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: VAE", output:XY */
    XYInputVAE(p: XYInputVAE_input, id?: ComfyNodeUID): XYInputVAE
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: Prompt S/R", output:XY */
    XYInputPromptSR(p: XYInputPromptSR_input, id?: ComfyNodeUID): XYInputPromptSR
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: Aesthetic Score", output:XY */
    XYInputAestheticScore(p: XYInputAestheticScore_input, id?: ComfyNodeUID): XYInputAestheticScore
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: Refiner On/Off", output:XY */
    XYInputRefinerOnOff(p: XYInputRefinerOnOff_input, id?: ComfyNodeUID): XYInputRefinerOnOff
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: Checkpoint", output:XY */
    XYInputCheckpoint(p: XYInputCheckpoint_input, id?: ComfyNodeUID): XYInputCheckpoint
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: Clip Skip", output:XY */
    XYInputClipSkip(p: XYInputClipSkip_input, id?: ComfyNodeUID): XYInputClipSkip
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: LoRA", output:XY */
    XYInputLoRA(p: XYInputLoRA_input, id?: ComfyNodeUID): XYInputLoRA
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: LoRA Plot", output:XY+XY_1 */
    XYInputLoRAPlot(p: XYInputLoRAPlot_input, id?: ComfyNodeUID): XYInputLoRAPlot
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: LoRA Stacks", output:XY */
    XYInputLoRAStacks(p: XYInputLoRAStacks_input, id?: ComfyNodeUID): XYInputLoRAStacks
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: Control Net", output:XY */
    XYInputControlNet(p: XYInputControlNet_input, id?: ComfyNodeUID): XYInputControlNet
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: Control Net Plot", output:XY+XY_1 */
    XYInputControlNetPlot(p: XYInputControlNetPlot_input, id?: ComfyNodeUID): XYInputControlNetPlot
    /* category:Efficiency Nodes_XY Inputs, name:"XY Input: Manual XY Entry", output:XY */
    XYInputManualXYEntry(p: XYInputManualXYEntry_input, id?: ComfyNodeUID): XYInputManualXYEntry
    /* category:Efficiency Nodes_XY Inputs, name:"Manual XY Entry Info", output: */
    ManualXYEntryInfo(p: ManualXYEntryInfo_input, id?: ComfyNodeUID): ManualXYEntryInfo
    /* category:Efficiency Nodes_XY Inputs, name:"Join XY Inputs of Same Type", output:XY */
    JoinXYInputsOfSameType(p: JoinXYInputsOfSameType_input, id?: ComfyNodeUID): JoinXYInputsOfSameType
    /* category:Efficiency Nodes_Image, name:"Image Overlay", output:IMAGE */
    ImageOverlay(p: ImageOverlay_input, id?: ComfyNodeUID): ImageOverlay
    /* category:Efficiency Nodes_Scripts, name:"HighRes-Fix Script", output:SCRIPT */
    HighResFixScript(p: HighResFixScript_input, id?: ComfyNodeUID): HighResFixScript
    /* category:Efficiency Nodes_Simple Eval, name:"Evaluate Integers", output:INT+FLOAT+STRING */
    EvaluateIntegers(p: EvaluateIntegers_input, id?: ComfyNodeUID): EvaluateIntegers
    /* category:Efficiency Nodes_Simple Eval, name:"Evaluate Floats", output:INT+FLOAT+STRING */
    EvaluateFloats(p: EvaluateFloats_input, id?: ComfyNodeUID): EvaluateFloats
    /* category:Efficiency Nodes_Simple Eval, name:"Evaluate Strings", output:STRING */
    EvaluateStrings(p: EvaluateStrings_input, id?: ComfyNodeUID): EvaluateStrings
    /* category:Efficiency Nodes_Simple Eval, name:"Simple Eval Examples", output: */
    SimpleEvalExamples(p: SimpleEvalExamples_input, id?: ComfyNodeUID): SimpleEvalExamples
    /* category:JNode, name:"LatentByRatio", output:LATENT */
    LatentByRatio(p: LatentByRatio_input, id?: ComfyNodeUID): LatentByRatio
    /* category:Masquerade Nodes, name:"Mask By Text", output:IMAGE+IMAGE_1 */
    MasqueradeMaskByText(p: MasqueradeMaskByText_input, id?: ComfyNodeUID): MasqueradeMaskByText
    /* category:Masquerade Nodes, name:"Mask Morphology", output:IMAGE */
    MasqueradeMaskMorphology(p: MasqueradeMaskMorphology_input, id?: ComfyNodeUID): MasqueradeMaskMorphology
    /* category:Masquerade Nodes, name:"Combine Masks", output:IMAGE */
    MasqueradeCombineMasks(p: MasqueradeCombineMasks_input, id?: ComfyNodeUID): MasqueradeCombineMasks
    /* category:Masquerade Nodes, name:"Unary Mask Op", output:IMAGE */
    MasqueradeUnaryMaskOp(p: MasqueradeUnaryMaskOp_input, id?: ComfyNodeUID): MasqueradeUnaryMaskOp
    /* category:Masquerade Nodes, name:"Unary Image Op", output:IMAGE */
    MasqueradeUnaryImageOp(p: MasqueradeUnaryImageOp_input, id?: ComfyNodeUID): MasqueradeUnaryImageOp
    /* category:Masquerade Nodes, name:"Blur", output:IMAGE */
    MasqueradeBlur(p: MasqueradeBlur_input, id?: ComfyNodeUID): MasqueradeBlur
    /* category:Masquerade Nodes, name:"Image To Mask", output:MASK */
    MasqueradeImageToMask(p: MasqueradeImageToMask_input, id?: ComfyNodeUID): MasqueradeImageToMask
    /* category:Masquerade Nodes, name:"Mix Images By Mask", output:IMAGE */
    MasqueradeMixImagesByMask(p: MasqueradeMixImagesByMask_input, id?: ComfyNodeUID): MasqueradeMixImagesByMask
    /* category:Masquerade Nodes, name:"Mix Color By Mask", output:IMAGE */
    MasqueradeMixColorByMask(p: MasqueradeMixColorByMask_input, id?: ComfyNodeUID): MasqueradeMixColorByMask
    /* category:Masquerade Nodes, name:"Mask To Region", output:IMAGE */
    MasqueradeMaskToRegion(p: MasqueradeMaskToRegion_input, id?: ComfyNodeUID): MasqueradeMaskToRegion
    /* category:Masquerade Nodes, name:"Cut By Mask", output:IMAGE */
    MasqueradeCutByMask(p: MasqueradeCutByMask_input, id?: ComfyNodeUID): MasqueradeCutByMask
    /* category:Masquerade Nodes, name:"Paste By Mask", output:IMAGE */
    MasqueradePasteByMask(p: MasqueradePasteByMask_input, id?: ComfyNodeUID): MasqueradePasteByMask
    /* category:Masquerade Nodes, name:"Get Image Size", output:INT+INT_1 */
    MasqueradeGetImageSize(p: MasqueradeGetImageSize_input, id?: ComfyNodeUID): MasqueradeGetImageSize
    /* category:Masquerade Nodes, name:"Change Channel Count", output:IMAGE */
    MasqueradeChangeChannelCount(p: MasqueradeChangeChannelCount_input, id?: ComfyNodeUID): MasqueradeChangeChannelCount
    /* category:Masquerade Nodes, name:"Constant Mask", output:IMAGE */
    MasqueradeConstantMask(p: MasqueradeConstantMask_input, id?: ComfyNodeUID): MasqueradeConstantMask
    /* category:Masquerade Nodes, name:"Prune By Mask", output:IMAGE */
    MasqueradePruneByMask(p: MasqueradePruneByMask_input, id?: ComfyNodeUID): MasqueradePruneByMask
    /* category:Masquerade Nodes, name:"Separate Mask Components", output:IMAGE+MASK_MAPPING */
    MasqueradeSeparateMaskComponents(p: MasqueradeSeparateMaskComponents_input, id?: ComfyNodeUID): MasqueradeSeparateMaskComponents
    /* category:Masquerade Nodes, name:"Create Rect Mask", output:IMAGE */
    MasqueradeCreateRectMask(p: MasqueradeCreateRectMask_input, id?: ComfyNodeUID): MasqueradeCreateRectMask
    /* category:Masquerade Nodes, name:"Make Image Batch", output:IMAGE */
    MasqueradeMakeImageBatch(p: MasqueradeMakeImageBatch_input, id?: ComfyNodeUID): MasqueradeMakeImageBatch
    /* category:Masquerade Nodes, name:"Create QR Code", output:IMAGE */
    MasqueradeCreateQRCode(p: MasqueradeCreateQRCode_input, id?: ComfyNodeUID): MasqueradeCreateQRCode
    /* category:Masquerade Nodes, name:"Convert Color Space", output:IMAGE */
    MasqueradeConvertColorSpace(p: MasqueradeConvertColorSpace_input, id?: ComfyNodeUID): MasqueradeConvertColorSpace
    /* category:Masquerade Nodes, name:"MasqueradeIncrementer", output:INT */
    MasqueradeMasqueradeIncrementer(p: MasqueradeMasqueradeIncrementer_input, id?: ComfyNodeUID): MasqueradeMasqueradeIncrementer
    /* category:image, name:"Image Remove Background (rembg)", output:IMAGE */
    ImageRemoveBackgroundRembg(p: ImageRemoveBackgroundRembg_input, id?: ComfyNodeUID): ImageRemoveBackgroundRembg
    /* category:JNode, name:"SDXLMixSampler", output:LATENT */
    SDXLMixSampler(p: SDXLMixSampler_input, id?: ComfyNodeUID): SDXLMixSampler
    /* category:WAS Suite_Loaders, name:"BLIP Model Loader", output:BLIP_MODEL */
    WASBLIPModelLoader(p: WASBLIPModelLoader_input, id?: ComfyNodeUID): WASBLIPModelLoader
    /* category:WAS Suite_Latent, name:"Blend Latents", output:LATENT */
    WASBlendLatents(p: WASBlendLatents_input, id?: ComfyNodeUID): WASBlendLatents
    /* category:WAS Suite_IO, name:"Cache Node", output:STRING+STRING_1+STRING_2 */
    WASCacheNode(p: WASCacheNode_input, id?: ComfyNodeUID): WASCacheNode
    /* category:WAS Suite_Loaders_Advanced, name:"Checkpoint Loader", output:MODEL+CLIP+VAE+STRING */
    WASCheckpointLoader(p: WASCheckpointLoader_input, id?: ComfyNodeUID): WASCheckpointLoader
    /* category:WAS Suite_Loaders, name:"Checkpoint Loader (Simple)", output:MODEL+CLIP+VAE+STRING */
    WASCheckpointLoaderSimple(p: WASCheckpointLoaderSimple_input, id?: ComfyNodeUID): WASCheckpointLoaderSimple
    /* category:WAS Suite_Conditioning, name:"CLIPTextEncode (NSP)", output:CONDITIONING+STRING+STRING_1 */
    WASCLIPTextEncodeNSP(p: WASCLIPTextEncodeNSP_input, id?: ComfyNodeUID): WASCLIPTextEncodeNSP
    /* category:WAS Suite_Logic, name:"CLIP Input Switch", output:CLIP */
    WASCLIPInputSwitch(p: WASCLIPInputSwitch_input, id?: ComfyNodeUID): WASCLIPInputSwitch
    /* category:WAS Suite_Logic, name:"CLIP Vision Input Switch", output:CLIP_VISION */
    WASCLIPVisionInputSwitch(p: WASCLIPVisionInputSwitch_input, id?: ComfyNodeUID): WASCLIPVisionInputSwitch
    /* category:WAS Suite_Logic, name:"Conditioning Input Switch", output:CONDITIONING */
    WASConditioningInputSwitch(p: WASConditioningInputSwitch_input, id?: ComfyNodeUID): WASConditioningInputSwitch
    /* category:WAS Suite_Number, name:"Constant Number", output:NUMBER+FLOAT+INT */
    WASConstantNumber(p: WASConstantNumber_input, id?: ComfyNodeUID): WASConstantNumber
    /* category:WAS Suite_Image_Process, name:"Create Grid Image", output:IMAGE */
    WASCreateGridImage(p: WASCreateGridImage_input, id?: ComfyNodeUID): WASCreateGridImage
    /* category:WAS Suite_Animation, name:"Create Morph Image", output:IMAGE+IMAGE_1+STRING+STRING_1 */
    WASCreateMorphImage(p: WASCreateMorphImage_input, id?: ComfyNodeUID): WASCreateMorphImage
    /* category:WAS Suite_Animation, name:"Create Morph Image from Path", output:STRING+STRING_1 */
    WASCreateMorphImageFromPath(p: WASCreateMorphImageFromPath_input, id?: ComfyNodeUID): WASCreateMorphImageFromPath
    /* category:WAS Suite_Animation, name:"Create Video from Path", output:STRING+STRING_1 */
    WASCreateVideoFromPath(p: WASCreateVideoFromPath_input, id?: ComfyNodeUID): WASCreateVideoFromPath
    /* category:WAS Suite_Image_Masking, name:"CLIPSeg Masking", output:MASK+IMAGE */
    WASCLIPSegMasking(p: WASCLIPSegMasking_input, id?: ComfyNodeUID): WASCLIPSegMasking
    /* category:WAS Suite_Loaders, name:"CLIPSeg Model Loader", output:CLIPSEG_MODEL */
    WASCLIPSegModelLoader(p: WASCLIPSegModelLoader_input, id?: ComfyNodeUID): WASCLIPSegModelLoader
    /* category:WAS Suite_Image_Masking, name:"CLIPSeg Batch Masking", output:IMAGE+MASK+IMAGE_1 */
    WASCLIPSegBatchMasking(p: WASCLIPSegBatchMasking_input, id?: ComfyNodeUID): WASCLIPSegBatchMasking
    /* category:WAS Suite_Image_Masking, name:"Convert Masks to Images", output:IMAGE */
    WASConvertMasksToImages(p: WASConvertMasksToImages_input, id?: ComfyNodeUID): WASConvertMasksToImages
    /* category:WAS Suite_Logic, name:"Control Net Model Input Switch", output:CONTROL_NET */
    WASControlNetModelInputSwitch(p: WASControlNetModelInputSwitch_input, id?: ComfyNodeUID): WASControlNetModelInputSwitch
    /* category:WAS Suite_Debug, name:"Debug Number to Console", output:NUMBER */
    WASDebugNumberToConsole(p: WASDebugNumberToConsole_input, id?: ComfyNodeUID): WASDebugNumberToConsole
    /* category:WAS Suite_Debug, name:"Dictionary to Console", output:DICT */
    WASDictionaryToConsole(p: WASDictionaryToConsole_input, id?: ComfyNodeUID): WASDictionaryToConsole
    /* category:WAS Suite_Loaders_Advanced, name:"Diffusers Model Loader", output:MODEL+CLIP+VAE+STRING */
    WASDiffusersModelLoader(p: WASDiffusersModelLoader_input, id?: ComfyNodeUID): WASDiffusersModelLoader
    /* category:WAS Suite_Loaders_Advanced, name:"Diffusers Hub Model Down-Loader", output:MODEL+CLIP+VAE+STRING */
    WASDiffusersHubModelDownLoader(p: WASDiffusersHubModelDownLoader_input, id?: ComfyNodeUID): WASDiffusersHubModelDownLoader
    /* category:WAS Suite_Debug, name:"Export API", output: */
    WASExportAPI(p: WASExportAPI_input, id?: ComfyNodeUID): WASExportAPI
    /* category:WAS Suite_Logic, name:"Latent Input Switch", output:LATENT */
    WASLatentInputSwitch(p: WASLatentInputSwitch_input, id?: ComfyNodeUID): WASLatentInputSwitch
    /* category:WAS Suite_IO, name:"Load Cache", output:LATENT+IMAGE+CONDITIONING */
    WASLoadCache(p: WASLoadCache_input, id?: ComfyNodeUID): WASLoadCache
    /* category:WAS Suite_Logic, name:"Logic Boolean", output:NUMBER+INT */
    WASLogicBoolean(p: WASLogicBoolean_input, id?: ComfyNodeUID): WASLogicBoolean
    /* category:WAS Suite_Loaders, name:"Lora Loader", output:MODEL+CLIP+STRING */
    WASLoraLoader(p: WASLoraLoader_input, id?: ComfyNodeUID): WASLoraLoader
    /* category:WAS Suite_Image_Filter, name:"Image SSAO (Ambient Occlusion)", output:IMAGE+IMAGE_1+IMAGE_2 */
    WASImageSSAOAmbientOcclusion(p: WASImageSSAOAmbientOcclusion_input, id?: ComfyNodeUID): WASImageSSAOAmbientOcclusion
    /* category:WAS Suite_Image_Filter, name:"Image SSDO (Direct Occlusion)", output:IMAGE+IMAGE_1+IMAGE_2+IMAGE_3 */
    WASImageSSDODirectOcclusion(p: WASImageSSDODirectOcclusion_input, id?: ComfyNodeUID): WASImageSSDODirectOcclusion
    /* category:WAS Suite_Image_Analyze, name:"Image Analyze", output:IMAGE */
    WASImageAnalyze(p: WASImageAnalyze_input, id?: ComfyNodeUID): WASImageAnalyze
    /* category:WAS Suite_Logic, name:"Image Aspect Ratio", output:NUMBER+FLOAT+NUMBER_1+STRING+STRING_1 */
    WASImageAspectRatio(p: WASImageAspectRatio_input, id?: ComfyNodeUID): WASImageAspectRatio
    /* category:WAS Suite_Image, name:"Image Batch", output:IMAGE */
    WASImageBatch(p: WASImageBatch_input, id?: ComfyNodeUID): WASImageBatch
    /* category:WAS Suite_Image, name:"Image Blank", output:IMAGE */
    WASImageBlank(p: WASImageBlank_input, id?: ComfyNodeUID): WASImageBlank
    /* category:WAS Suite_Image, name:"Image Blend by Mask", output:IMAGE */
    WASImageBlendByMask(p: WASImageBlendByMask_input, id?: ComfyNodeUID): WASImageBlendByMask
    /* category:WAS Suite_Image, name:"Image Blend", output:IMAGE */
    WASImageBlend(p: WASImageBlend_input, id?: ComfyNodeUID): WASImageBlend
    /* category:WAS Suite_Image, name:"Image Blending Mode", output:IMAGE */
    WASImageBlendingMode(p: WASImageBlendingMode_input, id?: ComfyNodeUID): WASImageBlendingMode
    /* category:WAS Suite_Image_Filter, name:"Image Bloom Filter", output:IMAGE */
    WASImageBloomFilter(p: WASImageBloomFilter_input, id?: ComfyNodeUID): WASImageBloomFilter
    /* category:WAS Suite_Image_Filter, name:"Image Canny Filter", output:IMAGE */
    WASImageCannyFilter(p: WASImageCannyFilter_input, id?: ComfyNodeUID): WASImageCannyFilter
    /* category:WAS Suite_Image_Filter, name:"Image Chromatic Aberration", output:IMAGE */
    WASImageChromaticAberration(p: WASImageChromaticAberration_input, id?: ComfyNodeUID): WASImageChromaticAberration
    /* category:WAS Suite_Image_Analyze, name:"Image Color Palette", output:IMAGE+LIST */
    WASImageColorPalette(p: WASImageColorPalette_input, id?: ComfyNodeUID): WASImageColorPalette
    /* category:WAS Suite_Image_Process, name:"Image Crop Face", output:IMAGE+CROP_DATA */
    WASImageCropFace(p: WASImageCropFace_input, id?: ComfyNodeUID): WASImageCropFace
    /* category:WAS Suite_Image_Process, name:"Image Crop Location", output:IMAGE+CROP_DATA */
    WASImageCropLocation(p: WASImageCropLocation_input, id?: ComfyNodeUID): WASImageCropLocation
    /* category:WAS Suite_Image_Process, name:"Image Crop Square Location", output:IMAGE+CROP_DATA */
    WASImageCropSquareLocation(p: WASImageCropSquareLocation_input, id?: ComfyNodeUID): WASImageCropSquareLocation
    /* category:WAS Suite_Image_Transform, name:"Image Displacement Warp", output:IMAGE */
    WASImageDisplacementWarp(p: WASImageDisplacementWarp_input, id?: ComfyNodeUID): WASImageDisplacementWarp
    /* category:WAS Suite_Image_Filter, name:"Image Lucy Sharpen", output:IMAGE */
    WASImageLucySharpen(p: WASImageLucySharpen_input, id?: ComfyNodeUID): WASImageLucySharpen
    /* category:WAS Suite_Image_Process, name:"Image Paste Face", output:IMAGE+IMAGE_1 */
    WASImagePasteFace(p: WASImagePasteFace_input, id?: ComfyNodeUID): WASImagePasteFace
    /* category:WAS Suite_Image_Process, name:"Image Paste Crop", output:IMAGE+IMAGE_1 */
    WASImagePasteCrop(p: WASImagePasteCrop_input, id?: ComfyNodeUID): WASImagePasteCrop
    /* category:WAS Suite_Image_Process, name:"Image Paste Crop by Location", output:IMAGE+IMAGE_1 */
    WASImagePasteCropByLocation(p: WASImagePasteCropByLocation_input, id?: ComfyNodeUID): WASImagePasteCropByLocation
    /* category:WAS Suite_Image_Process, name:"Image Pixelate", output:IMAGE */
    WASImagePixelate(p: WASImagePixelate_input, id?: ComfyNodeUID): WASImagePixelate
    /* category:WAS Suite_Image_Generate_Noise, name:"Image Power Noise", output:IMAGE */
    WASImagePowerNoise(p: WASImagePowerNoise_input, id?: ComfyNodeUID): WASImagePowerNoise
    /* category:WAS Suite_Image_Filter, name:"Image Dragan Photography Filter", output:IMAGE */
    WASImageDraganPhotographyFilter(p: WASImageDraganPhotographyFilter_input, id?: ComfyNodeUID): WASImageDraganPhotographyFilter
    /* category:WAS Suite_Image_Filter, name:"Image Edge Detection Filter", output:IMAGE */
    WASImageEdgeDetectionFilter(p: WASImageEdgeDetectionFilter_input, id?: ComfyNodeUID): WASImageEdgeDetectionFilter
    /* category:WAS Suite_Image_Filter, name:"Image Film Grain", output:IMAGE */
    WASImageFilmGrain(p: WASImageFilmGrain_input, id?: ComfyNodeUID): WASImageFilmGrain
    /* category:WAS Suite_Image_Filter, name:"Image Filter Adjustments", output:IMAGE */
    WASImageFilterAdjustments(p: WASImageFilterAdjustments_input, id?: ComfyNodeUID): WASImageFilterAdjustments
    /* category:WAS Suite_Image_Transform, name:"Image Flip", output:IMAGE */
    WASImageFlip(p: WASImageFlip_input, id?: ComfyNodeUID): WASImageFlip
    /* category:WAS Suite_Image_Filter, name:"Image Gradient Map", output:IMAGE */
    WASImageGradientMap(p: WASImageGradientMap_input, id?: ComfyNodeUID): WASImageGradientMap
    /* category:WAS Suite_Image_Generate, name:"Image Generate Gradient", output:IMAGE */
    WASImageGenerateGradient(p: WASImageGenerateGradient_input, id?: ComfyNodeUID): WASImageGenerateGradient
    /* category:WAS Suite_Image_Filter, name:"Image High Pass Filter", output:IMAGE */
    WASImageHighPassFilter(p: WASImageHighPassFilter_input, id?: ComfyNodeUID): WASImageHighPassFilter
    /* category:WAS Suite_History, name:"Image History Loader", output:IMAGE+STRING */
    WASImageHistoryLoader(p: WASImageHistoryLoader_input, id?: ComfyNodeUID): WASImageHistoryLoader
    /* category:WAS Suite_Logic, name:"Image Input Switch", output:IMAGE */
    WASImageInputSwitch(p: WASImageInputSwitch_input, id?: ComfyNodeUID): WASImageInputSwitch
    /* category:WAS Suite_Image_Adjustment, name:"Image Levels Adjustment", output:IMAGE */
    WASImageLevelsAdjustment(p: WASImageLevelsAdjustment_input, id?: ComfyNodeUID): WASImageLevelsAdjustment
    /* category:WAS Suite_IO, name:"Image Load", output:IMAGE+MASK+STRING */
    WASImageLoad(p: WASImageLoad_input, id?: ComfyNodeUID): WASImageLoad
    /* category:WAS Suite_Image_Filter, name:"Image Median Filter", output:IMAGE */
    WASImageMedianFilter(p: WASImageMedianFilter_input, id?: ComfyNodeUID): WASImageMedianFilter
    /* category:WAS Suite_Image_Process, name:"Image Mix RGB Channels", output:IMAGE */
    WASImageMixRGBChannels(p: WASImageMixRGBChannels_input, id?: ComfyNodeUID): WASImageMixRGBChannels
    /* category:WAS Suite_Image_Filter, name:"Image Monitor Effects Filter", output:IMAGE */
    WASImageMonitorEffectsFilter(p: WASImageMonitorEffectsFilter_input, id?: ComfyNodeUID): WASImageMonitorEffectsFilter
    /* category:WAS Suite_Image_Filter, name:"Image Nova Filter", output:IMAGE */
    WASImageNovaFilter(p: WASImageNovaFilter_input, id?: ComfyNodeUID): WASImageNovaFilter
    /* category:WAS Suite_Image_Transform, name:"Image Padding", output:IMAGE+IMAGE_1 */
    WASImagePadding(p: WASImagePadding_input, id?: ComfyNodeUID): WASImagePadding
    /* category:WAS Suite_Image_Generate_Noise, name:"Image Perlin Noise", output:IMAGE */
    WASImagePerlinNoise(p: WASImagePerlinNoise_input, id?: ComfyNodeUID): WASImagePerlinNoise
    /* category:WAS Suite_Image_AI, name:"Image Rembg (Remove Background)", output:IMAGE */
    WASImageRembgRemoveBackground(p: WASImageRembgRemoveBackground_input, id?: ComfyNodeUID): WASImageRembgRemoveBackground
    /* category:WAS Suite_Image_Generate_Noise, name:"Image Perlin Power Fractal", output:IMAGE */
    WASImagePerlinPowerFractal(p: WASImagePerlinPowerFractal_input, id?: ComfyNodeUID): WASImagePerlinPowerFractal
    /* category:WAS Suite_Image_Process, name:"Image Remove Background (Alpha)", output:IMAGE */
    WASImageRemoveBackgroundAlpha(p: WASImageRemoveBackgroundAlpha_input, id?: ComfyNodeUID): WASImageRemoveBackgroundAlpha
    /* category:WAS Suite_Image_Process, name:"Image Remove Color", output:IMAGE */
    WASImageRemoveColor(p: WASImageRemoveColor_input, id?: ComfyNodeUID): WASImageRemoveColor
    /* category:WAS Suite_Image_Transform, name:"Image Resize", output:IMAGE */
    WASImageResize(p: WASImageResize_input, id?: ComfyNodeUID): WASImageResize
    /* category:WAS Suite_Image_Transform, name:"Image Rotate", output:IMAGE */
    WASImageRotate(p: WASImageRotate_input, id?: ComfyNodeUID): WASImageRotate
    /* category:WAS Suite_Image_Adjustment, name:"Image Rotate Hue", output:IMAGE */
    WASImageRotateHue(p: WASImageRotateHue_input, id?: ComfyNodeUID): WASImageRotateHue
    /* category:WAS Suite_IO, name:"Image Save", output: */
    WASImageSave(p: WASImageSave_input, id?: ComfyNodeUID): WASImageSave
    /* category:WAS Suite_Image_Process, name:"Image Seamless Texture", output:IMAGE */
    WASImageSeamlessTexture(p: WASImageSeamlessTexture_input, id?: ComfyNodeUID): WASImageSeamlessTexture
    /* category:WAS Suite_Image_Process, name:"Image Select Channel", output:IMAGE */
    WASImageSelectChannel(p: WASImageSelectChannel_input, id?: ComfyNodeUID): WASImageSelectChannel
    /* category:WAS Suite_Image_Process, name:"Image Select Color", output:IMAGE */
    WASImageSelectColor(p: WASImageSelectColor_input, id?: ComfyNodeUID): WASImageSelectColor
    /* category:WAS Suite_Image_Adjustment, name:"Image Shadows and Highlights", output:IMAGE+IMAGE_1+IMAGE_2 */
    WASImageShadowsAndHighlights(p: WASImageShadowsAndHighlights_input, id?: ComfyNodeUID): WASImageShadowsAndHighlights
    /* category:WAS Suite_Number_Operations, name:"Image Size to Number", output:NUMBER+NUMBER_1+FLOAT+FLOAT_1+INT+INT_1 */
    WASImageSizeToNumber(p: WASImageSizeToNumber_input, id?: ComfyNodeUID): WASImageSizeToNumber
    /* category:WAS Suite_Image_Transform, name:"Image Stitch", output:IMAGE */
    WASImageStitch(p: WASImageStitch_input, id?: ComfyNodeUID): WASImageStitch
    /* category:WAS Suite_Image_Filter, name:"Image Style Filter", output:IMAGE */
    WASImageStyleFilter(p: WASImageStyleFilter_input, id?: ComfyNodeUID): WASImageStyleFilter
    /* category:WAS Suite_Image_Process, name:"Image Threshold", output:IMAGE */
    WASImageThreshold(p: WASImageThreshold_input, id?: ComfyNodeUID): WASImageThreshold
    /* category:WAS Suite_Image_Process, name:"Image Tiled", output:IMAGE */
    WASImageTiled(p: WASImageTiled_input, id?: ComfyNodeUID): WASImageTiled
    /* category:WAS Suite_Image_Transform, name:"Image Transpose", output:IMAGE */
    WASImageTranspose(p: WASImageTranspose_input, id?: ComfyNodeUID): WASImageTranspose
    /* category:WAS Suite_Image_Filter, name:"Image fDOF Filter", output:IMAGE */
    WASImageFDOFFilter(p: WASImageFDOFFilter_input, id?: ComfyNodeUID): WASImageFDOFFilter
    /* category:WAS Suite_Image_Masking, name:"Image to Latent Mask", output:MASK */
    WASImageToLatentMask(p: WASImageToLatentMask_input, id?: ComfyNodeUID): WASImageToLatentMask
    /* category:WAS Suite_Image_Generate_Noise, name:"Image to Noise", output:IMAGE */
    WASImageToNoise(p: WASImageToNoise_input, id?: ComfyNodeUID): WASImageToNoise
    /* category:WAS Suite_Image_Analyze, name:"Image to Seed", output:INT */
    WASImageToSeed(p: WASImageToSeed_input, id?: ComfyNodeUID): WASImageToSeed
    /* category:WAS Suite_Image, name:"Images to RGB", output:IMAGE */
    WASImagesToRGB(p: WASImagesToRGB_input, id?: ComfyNodeUID): WASImagesToRGB
    /* category:WAS Suite_Image, name:"Images to Linear", output:IMAGE */
    WASImagesToLinear(p: WASImagesToLinear_input, id?: ComfyNodeUID): WASImagesToLinear
    /* category:WAS Suite_Integer, name:"Integer place counter", output:INT */
    WASIntegerPlaceCounter(p: WASIntegerPlaceCounter_input, id?: ComfyNodeUID): WASIntegerPlaceCounter
    /* category:WAS Suite_Image_Generate_Noise, name:"Image Voronoi Noise Filter", output:IMAGE */
    WASImageVoronoiNoiseFilter(p: WASImageVoronoiNoiseFilter_input, id?: ComfyNodeUID): WASImageVoronoiNoiseFilter
    /* category:WAS Suite_Sampling, name:"KSampler (WAS)", output:LATENT */
    WASKSamplerWAS(p: WASKSamplerWAS_input, id?: ComfyNodeUID): WASKSamplerWAS
    /* category:WAS Suite_Sampling, name:"KSampler Cycle", output:LATENT */
    WASKSamplerCycle(p: WASKSamplerCycle_input, id?: ComfyNodeUID): WASKSamplerCycle
    /* category:WAS Suite_Latent_Generate, name:"Latent Noise Injection", output:LATENT */
    WASLatentNoiseInjection(p: WASLatentNoiseInjection_input, id?: ComfyNodeUID): WASLatentNoiseInjection
    /* category:WAS Suite_Number_Operations, name:"Latent Size to Number", output:NUMBER+NUMBER_1+FLOAT+FLOAT_1+INT+INT_1 */
    WASLatentSizeToNumber(p: WASLatentSizeToNumber_input, id?: ComfyNodeUID): WASLatentSizeToNumber
    /* category:WAS Suite_Latent_Transform, name:"Latent Upscale by Factor (WAS)", output:LATENT */
    WASLatentUpscaleByFactorWAS(p: WASLatentUpscaleByFactorWAS_input, id?: ComfyNodeUID): WASLatentUpscaleByFactorWAS
    /* category:WAS Suite_IO, name:"Load Image Batch", output:IMAGE+STRING */
    WASLoadImageBatch(p: WASLoadImageBatch_input, id?: ComfyNodeUID): WASLoadImageBatch
    /* category:WAS Suite_IO, name:"Load Text File", output:STRING+DICT */
    WASLoadTextFile(p: WASLoadTextFile_input, id?: ComfyNodeUID): WASLoadTextFile
    /* category:WAS Suite_Loaders, name:"Load Lora", output:MODEL+CLIP+STRING */
    WASLoadLora(p: WASLoadLora_input, id?: ComfyNodeUID): WASLoadLora
    /* category:WAS Suite_Image_Masking, name:"Masks Add", output:MASK */
    WASMasksAdd(p: WASMasksAdd_input, id?: ComfyNodeUID): WASMasksAdd
    /* category:WAS Suite_Image_Masking, name:"Masks Subtract", output:MASK */
    WASMasksSubtract(p: WASMasksSubtract_input, id?: ComfyNodeUID): WASMasksSubtract
    /* category:WAS Suite_Image_Masking, name:"Mask Arbitrary Region", output:MASK */
    WASMaskArbitraryRegion(p: WASMaskArbitraryRegion_input, id?: ComfyNodeUID): WASMaskArbitraryRegion
    /* category:WAS Suite_Image_Masking, name:"Mask Batch to Mask", output:MASK */
    WASMaskBatchToMask(p: WASMaskBatchToMask_input, id?: ComfyNodeUID): WASMaskBatchToMask
    /* category:WAS Suite_Image_Masking, name:"Mask Batch", output:MASK */
    WASMaskBatch(p: WASMaskBatch_input, id?: ComfyNodeUID): WASMaskBatch
    /* category:WAS Suite_Image_Masking, name:"Mask Ceiling Region", output:MASK */
    WASMaskCeilingRegion(p: WASMaskCeilingRegion_input, id?: ComfyNodeUID): WASMaskCeilingRegion
    /* category:WAS Suite_Image_Masking, name:"Mask Crop Dominant Region", output:MASK */
    WASMaskCropDominantRegion(p: WASMaskCropDominantRegion_input, id?: ComfyNodeUID): WASMaskCropDominantRegion
    /* category:WAS Suite_Image_Masking, name:"Mask Crop Minority Region", output:MASK */
    WASMaskCropMinorityRegion(p: WASMaskCropMinorityRegion_input, id?: ComfyNodeUID): WASMaskCropMinorityRegion
    /* category:WAS Suite_Image_Masking, name:"Mask Crop Region", output:MASK+CROP_DATA+INT+INT_1+INT_2+INT_3+INT_4+INT_5 */
    WASMaskCropRegion(p: WASMaskCropRegion_input, id?: ComfyNodeUID): WASMaskCropRegion
    /* category:WAS Suite_Image_Masking, name:"Mask Paste Region", output:MASK+MASK_1 */
    WASMaskPasteRegion(p: WASMaskPasteRegion_input, id?: ComfyNodeUID): WASMaskPasteRegion
    /* category:WAS Suite_Image_Masking, name:"Mask Dilate Region", output:MASK */
    WASMaskDilateRegion(p: WASMaskDilateRegion_input, id?: ComfyNodeUID): WASMaskDilateRegion
    /* category:WAS Suite_Image_Masking, name:"Mask Dominant Region", output:MASK */
    WASMaskDominantRegion(p: WASMaskDominantRegion_input, id?: ComfyNodeUID): WASMaskDominantRegion
    /* category:WAS Suite_Image_Masking, name:"Mask Erode Region", output:MASK */
    WASMaskErodeRegion(p: WASMaskErodeRegion_input, id?: ComfyNodeUID): WASMaskErodeRegion
    /* category:WAS Suite_Image_Masking, name:"Mask Fill Holes", output:MASK */
    WASMaskFillHoles(p: WASMaskFillHoles_input, id?: ComfyNodeUID): WASMaskFillHoles
    /* category:WAS Suite_Image_Masking, name:"Mask Floor Region", output:MASK */
    WASMaskFloorRegion(p: WASMaskFloorRegion_input, id?: ComfyNodeUID): WASMaskFloorRegion
    /* category:WAS Suite_Image_Masking, name:"Mask Gaussian Region", output:MASK */
    WASMaskGaussianRegion(p: WASMaskGaussianRegion_input, id?: ComfyNodeUID): WASMaskGaussianRegion
    /* category:WAS Suite_Image_Masking, name:"Mask Invert", output:MASK */
    WASMaskInvert(p: WASMaskInvert_input, id?: ComfyNodeUID): WASMaskInvert
    /* category:WAS Suite_Image_Masking, name:"Mask Minority Region", output:MASK */
    WASMaskMinorityRegion(p: WASMaskMinorityRegion_input, id?: ComfyNodeUID): WASMaskMinorityRegion
    /* category:WAS Suite_Image_Masking, name:"Mask Smooth Region", output:MASK */
    WASMaskSmoothRegion(p: WASMaskSmoothRegion_input, id?: ComfyNodeUID): WASMaskSmoothRegion
    /* category:WAS Suite_Image_Masking, name:"Mask Threshold Region", output:MASK */
    WASMaskThresholdRegion(p: WASMaskThresholdRegion_input, id?: ComfyNodeUID): WASMaskThresholdRegion
    /* category:WAS Suite_Image_Masking, name:"Masks Combine Regions", output:MASK */
    WASMasksCombineRegions(p: WASMasksCombineRegions_input, id?: ComfyNodeUID): WASMasksCombineRegions
    /* category:WAS Suite_Image_Masking, name:"Masks Combine Batch", output:MASK */
    WASMasksCombineBatch(p: WASMasksCombineBatch_input, id?: ComfyNodeUID): WASMasksCombineBatch
    /* category:WAS Suite_Loaders, name:"MiDaS Model Loader", output:MIDAS_MODEL */
    WASMiDaSModelLoader(p: WASMiDaSModelLoader_input, id?: ComfyNodeUID): WASMiDaSModelLoader
    /* category:WAS Suite_Image_AI, name:"MiDaS Depth Approximation", output:IMAGE */
    WASMiDaSDepthApproximation(p: WASMiDaSDepthApproximation_input, id?: ComfyNodeUID): WASMiDaSDepthApproximation
    /* category:WAS Suite_Image_AI, name:"MiDaS Mask Image", output:IMAGE+IMAGE_1 */
    WASMiDaSMaskImage(p: WASMiDaSMaskImage_input, id?: ComfyNodeUID): WASMiDaSMaskImage
    /* category:WAS Suite_Logic, name:"Model Input Switch", output:MODEL */
    WASModelInputSwitch(p: WASModelInputSwitch_input, id?: ComfyNodeUID): WASModelInputSwitch
    /* category:WAS Suite_Number, name:"Number Counter", output:NUMBER+FLOAT+INT */
    WASNumberCounter(p: WASNumberCounter_input, id?: ComfyNodeUID): WASNumberCounter
    /* category:WAS Suite_Number_Operations, name:"Number Operation", output:NUMBER+FLOAT+INT */
    WASNumberOperation(p: WASNumberOperation_input, id?: ComfyNodeUID): WASNumberOperation
    /* category:WAS Suite_Number_Operations, name:"Number to Float", output:FLOAT */
    WASNumberToFloat(p: WASNumberToFloat_input, id?: ComfyNodeUID): WASNumberToFloat
    /* category:WAS Suite_Logic, name:"Number Input Switch", output:NUMBER+FLOAT+INT */
    WASNumberInputSwitch(p: WASNumberInputSwitch_input, id?: ComfyNodeUID): WASNumberInputSwitch
    /* category:WAS Suite_Logic, name:"Number Input Condition", output:NUMBER+FLOAT+INT */
    WASNumberInputCondition(p: WASNumberInputCondition_input, id?: ComfyNodeUID): WASNumberInputCondition
    /* category:WAS Suite_Number_Functions, name:"Number Multiple Of", output:NUMBER+FLOAT+INT */
    WASNumberMultipleOf(p: WASNumberMultipleOf_input, id?: ComfyNodeUID): WASNumberMultipleOf
    /* category:WAS Suite_Number, name:"Number PI", output:NUMBER+FLOAT */
    WASNumberPI(p: WASNumberPI_input, id?: ComfyNodeUID): WASNumberPI
    /* category:WAS Suite_Number_Operations, name:"Number to Int", output:INT */
    WASNumberToInt(p: WASNumberToInt_input, id?: ComfyNodeUID): WASNumberToInt
    /* category:WAS Suite_Number_Operations, name:"Number to Seed", output:SEED */
    WASNumberToSeed(p: WASNumberToSeed_input, id?: ComfyNodeUID): WASNumberToSeed
    /* category:WAS Suite_Number_Operations, name:"Number to String", output:STRING */
    WASNumberToString(p: WASNumberToString_input, id?: ComfyNodeUID): WASNumberToString
    /* category:WAS Suite_Number_Operations, name:"Number to Text", output:STRING */
    WASNumberToText(p: WASNumberToText_input, id?: ComfyNodeUID): WASNumberToText
    /* category:WAS Suite_Text, name:"Prompt Styles Selector", output:STRING+STRING_1 */
    WASPromptStylesSelector(p: WASPromptStylesSelector_input, id?: ComfyNodeUID): WASPromptStylesSelector
    /* category:WAS Suite_Text, name:"Prompt Multiple Styles Selector", output:STRING+STRING_1 */
    WASPromptMultipleStylesSelector(p: WASPromptMultipleStylesSelector_input, id?: ComfyNodeUID): WASPromptMultipleStylesSelector
    /* category:WAS Suite_Number, name:"Random Number", output:NUMBER+FLOAT+INT */
    WASRandomNumber(p: WASRandomNumber_input, id?: ComfyNodeUID): WASRandomNumber
    /* category:WAS Suite_IO, name:"Save Text File", output: */
    WASSaveTextFile(p: WASSaveTextFile_input, id?: ComfyNodeUID): WASSaveTextFile
    /* category:WAS Suite_Number, name:"Seed", output:SEED+NUMBER+FLOAT+INT */
    WASSeed(p: WASSeed_input, id?: ComfyNodeUID): WASSeed
    /* category:WAS Suite_Latent_Transform, name:"Tensor Batch to Image", output:IMAGE */
    WASTensorBatchToImage(p: WASTensorBatchToImage_input, id?: ComfyNodeUID): WASTensorBatchToImage
    /* category:WAS Suite_Text_AI, name:"BLIP Analyze Image", output:STRING */
    WASBLIPAnalyzeImage(p: WASBLIPAnalyzeImage_input, id?: ComfyNodeUID): WASBLIPAnalyzeImage
    /* category:WAS Suite_Image_Masking, name:"SAM Model Loader", output:SAM_MODEL */
    WASSAMModelLoader(p: WASSAMModelLoader_input, id?: ComfyNodeUID): WASSAMModelLoader
    /* category:WAS Suite_Image_Masking, name:"SAM Parameters", output:SAM_PARAMETERS */
    WASSAMParameters(p: WASSAMParameters_input, id?: ComfyNodeUID): WASSAMParameters
    /* category:WAS Suite_Image_Masking, name:"SAM Parameters Combine", output:SAM_PARAMETERS */
    WASSAMParametersCombine(p: WASSAMParametersCombine_input, id?: ComfyNodeUID): WASSAMParametersCombine
    /* category:WAS Suite_Image_Masking, name:"SAM Image Mask", output:IMAGE+MASK */
    WASSAMImageMask(p: WASSAMImageMask_input, id?: ComfyNodeUID): WASSAMImageMask
    /* category:WAS Suite_Debug, name:"Samples Passthrough (Stat System)", output:LATENT */
    WASSamplesPassthroughStatSystem(p: WASSamplesPassthroughStatSystem_input, id?: ComfyNodeUID): WASSamplesPassthroughStatSystem
    /* category:WAS Suite_Text_Operations, name:"String to Text", output:STRING */
    WASStringToText(p: WASStringToText_input, id?: ComfyNodeUID): WASStringToText
    /* category:WAS Suite_Image_Bound, name:"Image Bounds", output:IMAGE_BOUNDS */
    WASImageBounds(p: WASImageBounds_input, id?: ComfyNodeUID): WASImageBounds
    /* category:WAS Suite_Image_Bound, name:"Inset Image Bounds", output:IMAGE_BOUNDS */
    WASInsetImageBounds(p: WASInsetImageBounds_input, id?: ComfyNodeUID): WASInsetImageBounds
    /* category:WAS Suite_Image_Bound, name:"Bounded Image Blend", output:IMAGE */
    WASBoundedImageBlend(p: WASBoundedImageBlend_input, id?: ComfyNodeUID): WASBoundedImageBlend
    /* category:WAS Suite_Image_Bound, name:"Bounded Image Blend with Mask", output:IMAGE */
    WASBoundedImageBlendWithMask(p: WASBoundedImageBlendWithMask_input, id?: ComfyNodeUID): WASBoundedImageBlendWithMask
    /* category:WAS Suite_Image_Bound, name:"Bounded Image Crop", output:IMAGE */
    WASBoundedImageCrop(p: WASBoundedImageCrop_input, id?: ComfyNodeUID): WASBoundedImageCrop
    /* category:WAS Suite_Image_Bound, name:"Bounded Image Crop with Mask", output:IMAGE+IMAGE_BOUNDS */
    WASBoundedImageCropWithMask(p: WASBoundedImageCropWithMask_input, id?: ComfyNodeUID): WASBoundedImageCropWithMask
    /* category:WAS Suite_Text, name:"Text Dictionary Update", output:DICT */
    WASTextDictionaryUpdate(p: WASTextDictionaryUpdate_input, id?: ComfyNodeUID): WASTextDictionaryUpdate
    /* category:WAS Suite_Text_Tokens, name:"Text Add Tokens", output: */
    WASTextAddTokens(p: WASTextAddTokens_input, id?: ComfyNodeUID): WASTextAddTokens
    /* category:WAS Suite_Text_Tokens, name:"Text Add Token by Input", output: */
    WASTextAddTokenByInput(p: WASTextAddTokenByInput_input, id?: ComfyNodeUID): WASTextAddTokenByInput
    /* category:WAS Suite_Text_Search, name:"Text Compare", output:STRING+STRING_1+NUMBER+NUMBER_1+STRING_2 */
    WASTextCompare(p: WASTextCompare_input, id?: ComfyNodeUID): WASTextCompare
    /* category:WAS Suite_Text, name:"Text Concatenate", output:STRING */
    WASTextConcatenate(p: WASTextConcatenate_input, id?: ComfyNodeUID): WASTextConcatenate
    /* category:WAS Suite_History, name:"Text File History Loader", output:STRING+DICT */
    WASTextFileHistoryLoader(p: WASTextFileHistoryLoader_input, id?: ComfyNodeUID): WASTextFileHistoryLoader
    /* category:WAS Suite_Text_Search, name:"Text Find and Replace by Dictionary", output:STRING */
    WASTextFindAndReplaceByDictionary(p: WASTextFindAndReplaceByDictionary_input, id?: ComfyNodeUID): WASTextFindAndReplaceByDictionary
    /* category:WAS Suite_Text_Search, name:"Text Find and Replace Input", output:STRING */
    WASTextFindAndReplaceInput(p: WASTextFindAndReplaceInput_input, id?: ComfyNodeUID): WASTextFindAndReplaceInput
    /* category:WAS Suite_Text_Search, name:"Text Find and Replace", output:STRING */
    WASTextFindAndReplace(p: WASTextFindAndReplace_input, id?: ComfyNodeUID): WASTextFindAndReplace
    /* category:WAS Suite_Logic, name:"Text Input Switch", output:STRING */
    WASTextInputSwitch(p: WASTextInputSwitch_input, id?: ComfyNodeUID): WASTextInputSwitch
    /* category:WAS Suite_Text, name:"Text List", output:LIST */
    WASTextList(p: WASTextList_input, id?: ComfyNodeUID): WASTextList
    /* category:WAS Suite_Text, name:"Text List Concatenate", output:LIST */
    WASTextListConcatenate(p: WASTextListConcatenate_input, id?: ComfyNodeUID): WASTextListConcatenate
    /* category:WAS Suite_Text, name:"Text Load Line From File", output:STRING+DICT */
    WASTextLoadLineFromFile(p: WASTextLoadLineFromFile_input, id?: ComfyNodeUID): WASTextLoadLineFromFile
    /* category:WAS Suite_Text, name:"Text Multiline", output:STRING */
    WASTextMultiline(p: WASTextMultiline_input, id?: ComfyNodeUID): WASTextMultiline
    /* category:WAS Suite_Text_Parse, name:"Text Parse A1111 Embeddings", output:STRING */
    WASTextParseA1111Embeddings(p: WASTextParseA1111Embeddings_input, id?: ComfyNodeUID): WASTextParseA1111Embeddings
    /* category:WAS Suite_Text_Parse, name:"Text Parse Noodle Soup Prompts", output:STRING */
    WASTextParseNoodleSoupPrompts(p: WASTextParseNoodleSoupPrompts_input, id?: ComfyNodeUID): WASTextParseNoodleSoupPrompts
    /* category:WAS Suite_Text_Tokens, name:"Text Parse Tokens", output:STRING */
    WASTextParseTokens(p: WASTextParseTokens_input, id?: ComfyNodeUID): WASTextParseTokens
    /* category:WAS Suite_Text, name:"Text Random Line", output:STRING */
    WASTextRandomLine(p: WASTextRandomLine_input, id?: ComfyNodeUID): WASTextRandomLine
    /* category:WAS Suite_Text, name:"Text Random Prompt", output:STRING */
    WASTextRandomPrompt(p: WASTextRandomPrompt_input, id?: ComfyNodeUID): WASTextRandomPrompt
    /* category:WAS Suite_Text, name:"Text String", output:STRING+STRING_1+STRING_2+STRING_3 */
    WASTextString(p: WASTextString_input, id?: ComfyNodeUID): WASTextString
    /* category:WAS Suite_Text_Operations, name:"Text Shuffle", output:STRING */
    WASTextShuffle(p: WASTextShuffle_input, id?: ComfyNodeUID): WASTextShuffle
    /* category:WAS Suite_Text_Operations, name:"Text to Conditioning", output:CONDITIONING */
    WASTextToConditioning(p: WASTextToConditioning_input, id?: ComfyNodeUID): WASTextToConditioning
    /* category:WAS Suite_Debug, name:"Text to Console", output:STRING */
    WASTextToConsole(p: WASTextToConsole_input, id?: ComfyNodeUID): WASTextToConsole
    /* category:WAS Suite_Text_Operations, name:"Text to Number", output:NUMBER */
    WASTextToNumber(p: WASTextToNumber_input, id?: ComfyNodeUID): WASTextToNumber
    /* category:WAS Suite_Text_Operations, name:"Text to String", output:STRING */
    WASTextToString(p: WASTextToString_input, id?: ComfyNodeUID): WASTextToString
    /* category:WAS Suite_Text_Operations, name:"Text String Truncate", output:STRING+STRING_1+STRING_2+STRING_3 */
    WASTextStringTruncate(p: WASTextStringTruncate_input, id?: ComfyNodeUID): WASTextStringTruncate
    /* category:WAS Suite_Number, name:"True Random.org Number Generator", output:NUMBER+FLOAT+INT */
    WASTrueRandomOrgNumberGenerator(p: WASTrueRandomOrgNumberGenerator_input, id?: ComfyNodeUID): WASTrueRandomOrgNumberGenerator
    /* category:WAS Suite_Loaders, name:"unCLIP Checkpoint Loader", output:MODEL+CLIP+VAE+CLIP_VISION+STRING */
    WASUnCLIPCheckpointLoader(p: WASUnCLIPCheckpointLoader_input, id?: ComfyNodeUID): WASUnCLIPCheckpointLoader
    /* category:WAS Suite_Loaders, name:"Upscale Model Loader", output:UPSCALE_MODEL+STRING */
    WASUpscaleModelLoader(p: WASUpscaleModelLoader_input, id?: ComfyNodeUID): WASUpscaleModelLoader
    /* category:WAS Suite_Logic, name:"Upscale Model Switch", output:UPSCALE_MODEL */
    WASUpscaleModelSwitch(p: WASUpscaleModelSwitch_input, id?: ComfyNodeUID): WASUpscaleModelSwitch
    /* category:WAS Suite_Animation_Writer, name:"Write to GIF", output:IMAGE+STRING+STRING_1 */
    WASWriteToGIF(p: WASWriteToGIF_input, id?: ComfyNodeUID): WASWriteToGIF
    /* category:WAS Suite_Animation_Writer, name:"Write to Video", output:IMAGE+STRING+STRING_1 */
    WASWriteToVideo(p: WASWriteToVideo_input, id?: ComfyNodeUID): WASWriteToVideo
    /* category:WAS Suite_Logic, name:"VAE Input Switch", output:VAE */
    WASVAEInputSwitch(p: WASVAEInputSwitch_input, id?: ComfyNodeUID): WASVAEInputSwitch
    /* category:WAS Suite_Animation, name:"Video Dump Frames", output:STRING+NUMBER */
    WASVideoDumpFrames(p: WASVideoDumpFrames_input, id?: ComfyNodeUID): WASVideoDumpFrames
}

// 1. Requirable --------------------------
export interface Requirable {
    LATENT: LATENT,
    MODEL: MODEL,
    INT: INT,
    FLOAT: FLOAT,
    CONDITIONING: CONDITIONING,
    CLIP: CLIP,
    VAE: VAE,
    STRING: STRING,
    IMAGE: IMAGE,
    MASK: MASK,
    CLIP_VISION_OUTPUT: CLIP_VISION_OUTPUT,
    CLIP_VISION: CLIP_VISION,
    STYLE_MODEL: STYLE_MODEL,
    CONTROL_NET: CONTROL_NET,
    GLIGEN: GLIGEN,
    UPSCALE_MODEL: UPSCALE_MODEL,
    BOOLEAN: BOOLEAN,
    SAM_MODEL: SAM_MODEL,
    BBOX_DETECTOR: BBOX_DETECTOR,
    ONNX_DETECTOR: ONNX_DETECTOR,
    SEGS: SEGS,
    DETAILER_HOOK: DETAILER_HOOK,
    BASIC_PIPE: BASIC_PIPE,
    MASKS: MASKS,
    DETAILER_PIPE: DETAILER_PIPE,
    SEGM_DETECTOR: SEGM_DETECTOR,
    UPSCALER: UPSCALER,
    PK_HOOK: PK_HOOK,
    KSAMPLER: KSAMPLER,
    SEGS_PREPROCESSOR: SEGS_PREPROCESSOR,
    SEGS_HEADER: SEGS_HEADER,
    SEG_ELT: SEG_ELT,
    SEG_ELT_crop_region: SEG_ELT_crop_region,
    SEG_ELT_bbox: SEG_ELT_bbox,
    SEG_ELT_control_net_wrapper: SEG_ELT_control_net_wrapper,
    KSAMPLER_ADVANCED: KSAMPLER_ADVANCED,
    STAR: STAR,
    REGIONAL_PROMPTS: REGIONAL_PROMPTS,
    XY: XY,
    ZIPPED_PROMPT: ZIPPED_PROMPT,
    SCRIPT: SCRIPT,
    SDXL_TUPLE: SDXL_TUPLE,
    DEPENDENCIES: DEPENDENCIES,
    LORA_STACK: LORA_STACK,
    CONTROL_NET_STACK: CONTROL_NET_STACK,
    MASK_MAPPING: MASK_MAPPING,
    BLIP_MODEL: BLIP_MODEL,
    NUMBER: NUMBER,
    CLIPSEG_MODEL: CLIPSEG_MODEL,
    DICT: DICT,
    LIST: LIST,
    CROP_DATA: CROP_DATA,
    SEED: SEED,
    MIDAS_MODEL: MIDAS_MODEL,
    SAM_PARAMETERS: SAM_PARAMETERS,
    IMAGE_BOUNDS: IMAGE_BOUNDS,
    Enum_KSampler_Sampler_name: Enum_KSampler_Sampler_name,
    Enum_KSampler_Scheduler: Enum_KSampler_Scheduler,
    Enum_CheckpointLoaderSimple_Ckpt_name: Enum_CheckpointLoaderSimple_Ckpt_name,
    Enum_VAELoader_Vae_name: Enum_VAELoader_Vae_name,
    Enum_LatentUpscale_Upscale_method: Enum_LatentUpscale_Upscale_method,
    Enum_LatentUpscale_Crop: Enum_LatentUpscale_Crop,
    Enum_LatentUpscaleBy_Upscale_method: Enum_LatentUpscaleBy_Upscale_method,
    Enum_LoadImage_Image: Enum_LoadImage_Image,
    Enum_LoadImageMask_Image: Enum_LoadImageMask_Image,
    Enum_LoadImageMask_Channel: Enum_LoadImageMask_Channel,
    Enum_ImageScale_Upscale_method: Enum_ImageScale_Upscale_method,
    Enum_ImageScale_Crop: Enum_ImageScale_Crop,
    Enum_ImageScaleBy_Upscale_method: Enum_ImageScaleBy_Upscale_method,
    Enum_ConditioningSetMask_Set_cond_area: Enum_ConditioningSetMask_Set_cond_area,
    Enum_KSamplerAdvanced_Add_noise: Enum_KSamplerAdvanced_Add_noise,
    Enum_KSamplerAdvanced_Sampler_name: Enum_KSamplerAdvanced_Sampler_name,
    Enum_KSamplerAdvanced_Scheduler: Enum_KSamplerAdvanced_Scheduler,
    Enum_KSamplerAdvanced_Return_with_leftover_noise: Enum_KSamplerAdvanced_Return_with_leftover_noise,
    Enum_LatentRotate_Rotation: Enum_LatentRotate_Rotation,
    Enum_LatentFlip_Flip_method: Enum_LatentFlip_Flip_method,
    Enum_LoraLoader_Lora_name: Enum_LoraLoader_Lora_name,
    Enum_CLIPLoader_Clip_name: Enum_CLIPLoader_Clip_name,
    Enum_UNETLoader_Unet_name: Enum_UNETLoader_Unet_name,
    Enum_DualCLIPLoader_Clip_name1: Enum_DualCLIPLoader_Clip_name1,
    Enum_DualCLIPLoader_Clip_name2: Enum_DualCLIPLoader_Clip_name2,
    Enum_ControlNetLoader_Control_net_name: Enum_ControlNetLoader_Control_net_name,
    Enum_DiffControlNetLoader_Control_net_name: Enum_DiffControlNetLoader_Control_net_name,
    Enum_StyleModelLoader_Style_model_name: Enum_StyleModelLoader_Style_model_name,
    Enum_CLIPVisionLoader_Clip_name: Enum_CLIPVisionLoader_Clip_name,
    Enum_UnCLIPCheckpointLoader_Ckpt_name: Enum_UnCLIPCheckpointLoader_Ckpt_name,
    Enum_GLIGENLoader_Gligen_name: Enum_GLIGENLoader_Gligen_name,
    Enum_CheckpointLoader_Config_name: Enum_CheckpointLoader_Config_name,
    Enum_CheckpointLoader_Ckpt_name: Enum_CheckpointLoader_Ckpt_name,
    Enum_DiffusersLoader_Model_path: Enum_DiffusersLoader_Model_path,
    Enum_LoadLatent_Latent: Enum_LoadLatent_Latent,
    Enum_HypernetworkLoader_Hypernetwork_name: Enum_HypernetworkLoader_Hypernetwork_name,
    Enum_UpscaleModelLoader_Model_name: Enum_UpscaleModelLoader_Model_name,
    Enum_ImageBlend_Blend_mode: Enum_ImageBlend_Blend_mode,
    Enum_ImageQuantize_Dither: Enum_ImageQuantize_Dither,
    Enum_ImageScaleToTotalPixels_Upscale_method: Enum_ImageScaleToTotalPixels_Upscale_method,
    Enum_ImageToMask_Channel: Enum_ImageToMask_Channel,
    Enum_MaskComposite_Operation: Enum_MaskComposite_Operation,
    Enum_CivitAI_Lora_Loader_Lora_name: Enum_CivitAI_Lora_Loader_Lora_name,
    Enum_CivitAI_Lora_Loader_Download_path: Enum_CivitAI_Lora_Loader_Download_path,
    Enum_CivitAI_Checkpoint_Loader_Ckpt_name: Enum_CivitAI_Checkpoint_Loader_Ckpt_name,
    Enum_CivitAI_Checkpoint_Loader_Download_path: Enum_CivitAI_Checkpoint_Loader_Download_path,
    Enum_ImpactSAMLoader_Model_name: Enum_ImpactSAMLoader_Model_name,
    Enum_ImpactSAMLoader_Device_mode: Enum_ImpactSAMLoader_Device_mode,
    Enum_ImpactONNXDetectorProvider_Model_name: Enum_ImpactONNXDetectorProvider_Model_name,
    Enum_ImpactDetailerForEach_Sampler_name: Enum_ImpactDetailerForEach_Sampler_name,
    Enum_ImpactDetailerForEach_Scheduler: Enum_ImpactDetailerForEach_Scheduler,
    Enum_ImpactDetailerForEachDebug_Sampler_name: Enum_ImpactDetailerForEachDebug_Sampler_name,
    Enum_ImpactDetailerForEachDebug_Scheduler: Enum_ImpactDetailerForEachDebug_Scheduler,
    Enum_ImpactDetailerForEachPipe_Sampler_name: Enum_ImpactDetailerForEachPipe_Sampler_name,
    Enum_ImpactDetailerForEachPipe_Scheduler: Enum_ImpactDetailerForEachPipe_Scheduler,
    Enum_ImpactDetailerForEachDebugPipe_Sampler_name: Enum_ImpactDetailerForEachDebugPipe_Sampler_name,
    Enum_ImpactDetailerForEachDebugPipe_Scheduler: Enum_ImpactDetailerForEachDebugPipe_Scheduler,
    Enum_ImpactSAMDetectorCombined_Detection_hint: Enum_ImpactSAMDetectorCombined_Detection_hint,
    Enum_ImpactSAMDetectorCombined_Mask_hint_use_negative: Enum_ImpactSAMDetectorCombined_Mask_hint_use_negative,
    Enum_ImpactSAMDetectorSegmented_Detection_hint: Enum_ImpactSAMDetectorSegmented_Detection_hint,
    Enum_ImpactSAMDetectorSegmented_Mask_hint_use_negative: Enum_ImpactSAMDetectorSegmented_Mask_hint_use_negative,
    Enum_ImpactFaceDetailer_Sampler_name: Enum_ImpactFaceDetailer_Sampler_name,
    Enum_ImpactFaceDetailer_Scheduler: Enum_ImpactFaceDetailer_Scheduler,
    Enum_ImpactFaceDetailer_Sam_detection_hint: Enum_ImpactFaceDetailer_Sam_detection_hint,
    Enum_ImpactFaceDetailer_Sam_mask_hint_use_negative: Enum_ImpactFaceDetailer_Sam_mask_hint_use_negative,
    Enum_ImpactFaceDetailerPipe_Sampler_name: Enum_ImpactFaceDetailerPipe_Sampler_name,
    Enum_ImpactFaceDetailerPipe_Scheduler: Enum_ImpactFaceDetailerPipe_Scheduler,
    Enum_ImpactFaceDetailerPipe_Sam_detection_hint: Enum_ImpactFaceDetailerPipe_Sam_detection_hint,
    Enum_ImpactFaceDetailerPipe_Sam_mask_hint_use_negative: Enum_ImpactFaceDetailerPipe_Sam_mask_hint_use_negative,
    Enum_ImpactToDetailerPipe_SelectToAddLoRA: Enum_ImpactToDetailerPipe_SelectToAddLoRA,
    Enum_ImpactToDetailerPipeSDXL_SelectToAddLoRA: Enum_ImpactToDetailerPipeSDXL_SelectToAddLoRA,
    Enum_ImpactBasicPipeToDetailerPipe_SelectToAddLoRA: Enum_ImpactBasicPipeToDetailerPipe_SelectToAddLoRA,
    Enum_ImpactBasicPipeToDetailerPipeSDXL_SelectToAddLoRA: Enum_ImpactBasicPipeToDetailerPipeSDXL_SelectToAddLoRA,
    Enum_ImpactEditDetailerPipe_SelectToAddLoRA: Enum_ImpactEditDetailerPipe_SelectToAddLoRA,
    Enum_ImpactEditDetailerPipeSDXL_SelectToAddLoRA: Enum_ImpactEditDetailerPipeSDXL_SelectToAddLoRA,
    Enum_ImpactLatentPixelScale_Scale_method: Enum_ImpactLatentPixelScale_Scale_method,
    Enum_ImpactPixelKSampleUpscalerProvider_Scale_method: Enum_ImpactPixelKSampleUpscalerProvider_Scale_method,
    Enum_ImpactPixelKSampleUpscalerProvider_Sampler_name: Enum_ImpactPixelKSampleUpscalerProvider_Sampler_name,
    Enum_ImpactPixelKSampleUpscalerProvider_Scheduler: Enum_ImpactPixelKSampleUpscalerProvider_Scheduler,
    Enum_ImpactPixelKSampleUpscalerProviderPipe_Scale_method: Enum_ImpactPixelKSampleUpscalerProviderPipe_Scale_method,
    Enum_ImpactPixelKSampleUpscalerProviderPipe_Sampler_name: Enum_ImpactPixelKSampleUpscalerProviderPipe_Sampler_name,
    Enum_ImpactPixelKSampleUpscalerProviderPipe_Scheduler: Enum_ImpactPixelKSampleUpscalerProviderPipe_Scheduler,
    Enum_ImpactPixelTiledKSampleUpscalerProvider_Scale_method: Enum_ImpactPixelTiledKSampleUpscalerProvider_Scale_method,
    Enum_ImpactPixelTiledKSampleUpscalerProvider_Sampler_name: Enum_ImpactPixelTiledKSampleUpscalerProvider_Sampler_name,
    Enum_ImpactPixelTiledKSampleUpscalerProvider_Scheduler: Enum_ImpactPixelTiledKSampleUpscalerProvider_Scheduler,
    Enum_ImpactPixelTiledKSampleUpscalerProvider_Tiling_strategy: Enum_ImpactPixelTiledKSampleUpscalerProvider_Tiling_strategy,
    Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_Scale_method: Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_Scale_method,
    Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_Sampler_name: Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_Sampler_name,
    Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_Scheduler: Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_Scheduler,
    Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_Tiling_strategy: Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_Tiling_strategy,
    Enum_ImpactTwoSamplersForMaskUpscalerProvider_Scale_method: Enum_ImpactTwoSamplersForMaskUpscalerProvider_Scale_method,
    Enum_ImpactTwoSamplersForMaskUpscalerProvider_Full_sample_schedule: Enum_ImpactTwoSamplersForMaskUpscalerProvider_Full_sample_schedule,
    Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_Scale_method: Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_Scale_method,
    Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_Full_sample_schedule: Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_Full_sample_schedule,
    Enum_ImpactDenoiseScheduleHookProvider_Schedule_for_iteration: Enum_ImpactDenoiseScheduleHookProvider_Schedule_for_iteration,
    Enum_ImpactCfgScheduleHookProvider_Schedule_for_iteration: Enum_ImpactCfgScheduleHookProvider_Schedule_for_iteration,
    Enum_ImpactNoiseInjectionHookProvider_Schedule_for_iteration: Enum_ImpactNoiseInjectionHookProvider_Schedule_for_iteration,
    Enum_ImpactNoiseInjectionHookProvider_Source: Enum_ImpactNoiseInjectionHookProvider_Source,
    Enum_ImpactNoiseInjectionDetailerHookProvider_Source: Enum_ImpactNoiseInjectionDetailerHookProvider_Source,
    Enum_ImpactKSamplerProvider_Sampler_name: Enum_ImpactKSamplerProvider_Sampler_name,
    Enum_ImpactKSamplerProvider_Scheduler: Enum_ImpactKSamplerProvider_Scheduler,
    Enum_ImpactTiledKSamplerProvider_Sampler_name: Enum_ImpactTiledKSamplerProvider_Sampler_name,
    Enum_ImpactTiledKSamplerProvider_Scheduler: Enum_ImpactTiledKSamplerProvider_Scheduler,
    Enum_ImpactTiledKSamplerProvider_Tiling_strategy: Enum_ImpactTiledKSamplerProvider_Tiling_strategy,
    Enum_ImpactKSamplerAdvancedProvider_Sampler_name: Enum_ImpactKSamplerAdvancedProvider_Sampler_name,
    Enum_ImpactKSamplerAdvancedProvider_Scheduler: Enum_ImpactKSamplerAdvancedProvider_Scheduler,
    Enum_ImpactPreviewBridge_Image: Enum_ImpactPreviewBridge_Image,
    Enum_ImpactImageReceiver_Image: Enum_ImpactImageReceiver_Image,
    Enum_ImpactLatentSender_Preview_method: Enum_ImpactLatentSender_Preview_method,
    Enum_ImpactLatentReceiver_Latent: Enum_ImpactLatentReceiver_Latent,
    Enum_ImpactImpactWildcardEncode_SelectToAddLoRA: Enum_ImpactImpactWildcardEncode_SelectToAddLoRA,
    Enum_ImpactSEGSDetailer_Sampler_name: Enum_ImpactSEGSDetailer_Sampler_name,
    Enum_ImpactSEGSDetailer_Scheduler: Enum_ImpactSEGSDetailer_Scheduler,
    Enum_ImpactKSamplerBasicPipe_Sampler_name: Enum_ImpactKSamplerBasicPipe_Sampler_name,
    Enum_ImpactKSamplerBasicPipe_Scheduler: Enum_ImpactKSamplerBasicPipe_Scheduler,
    Enum_ImpactKSamplerAdvancedBasicPipe_Sampler_name: Enum_ImpactKSamplerAdvancedBasicPipe_Sampler_name,
    Enum_ImpactKSamplerAdvancedBasicPipe_Scheduler: Enum_ImpactKSamplerAdvancedBasicPipe_Scheduler,
    Enum_ImpactReencodeLatent_Tile_mode: Enum_ImpactReencodeLatent_Tile_mode,
    Enum_ImpactReencodeLatentPipe_Tile_mode: Enum_ImpactReencodeLatentPipe_Tile_mode,
    Enum_ImpactImpactSEGSLabelFilter_Preset: Enum_ImpactImpactSEGSLabelFilter_Preset,
    Enum_ImpactImpactSEGSRangeFilter_Target: Enum_ImpactImpactSEGSRangeFilter_Target,
    Enum_ImpactImpactSEGSOrderedFilter_Target: Enum_ImpactImpactSEGSOrderedFilter_Target,
    Enum_ImpactImpactCompare_Cmp: Enum_ImpactImpactCompare_Cmp,
    Enum_ImpactImpactValueReceiver_Typ: Enum_ImpactImpactValueReceiver_Typ,
    Enum_ImpactUltralyticsDetectorProvider_Model_name: Enum_ImpactUltralyticsDetectorProvider_Model_name,
    Enum_XYInputLoraBlockWeightInspire_Lora_name: Enum_XYInputLoraBlockWeightInspire_Lora_name,
    Enum_XYInputLoraBlockWeightInspire_Preset: Enum_XYInputLoraBlockWeightInspire_Preset,
    Enum_XYInputLoraBlockWeightInspire_Heatmap_palette: Enum_XYInputLoraBlockWeightInspire_Heatmap_palette,
    Enum_XYInputLoraBlockWeightInspire_Xyplot_mode: Enum_XYInputLoraBlockWeightInspire_Xyplot_mode,
    Enum_LoraLoaderBlockWeightInspire_Lora_name: Enum_LoraLoaderBlockWeightInspire_Lora_name,
    Enum_LoraLoaderBlockWeightInspire_Preset: Enum_LoraLoaderBlockWeightInspire_Preset,
    Enum_LoraBlockInfoInspire_Lora_name: Enum_LoraBlockInfoInspire_Lora_name,
    Enum_KSamplerInspire_Sampler_name: Enum_KSamplerInspire_Sampler_name,
    Enum_KSamplerInspire_Scheduler: Enum_KSamplerInspire_Scheduler,
    Enum_KSamplerInspire_Noise_mode: Enum_KSamplerInspire_Noise_mode,
    Enum_LoadPromptsFromDirInspire_Prompt_dir: Enum_LoadPromptsFromDirInspire_Prompt_dir,
    Enum_PromptExtractorInspire_Image: Enum_PromptExtractorInspire_Image,
    Enum_GlobalSeedInspire_Action: Enum_GlobalSeedInspire_Action,
    Enum_BNK_TiledKSamplerAdvanced_Add_noise: Enum_BNK_TiledKSamplerAdvanced_Add_noise,
    Enum_BNK_TiledKSamplerAdvanced_Tiling_strategy: Enum_BNK_TiledKSamplerAdvanced_Tiling_strategy,
    Enum_BNK_TiledKSamplerAdvanced_Sampler_name: Enum_BNK_TiledKSamplerAdvanced_Sampler_name,
    Enum_BNK_TiledKSamplerAdvanced_Scheduler: Enum_BNK_TiledKSamplerAdvanced_Scheduler,
    Enum_BNK_TiledKSamplerAdvanced_Return_with_leftover_noise: Enum_BNK_TiledKSamplerAdvanced_Return_with_leftover_noise,
    Enum_BNK_TiledKSamplerAdvanced_Preview: Enum_BNK_TiledKSamplerAdvanced_Preview,
    Enum_BNK_TiledKSampler_Tiling_strategy: Enum_BNK_TiledKSampler_Tiling_strategy,
    Enum_BNK_TiledKSampler_Sampler_name: Enum_BNK_TiledKSampler_Sampler_name,
    Enum_BNK_TiledKSampler_Scheduler: Enum_BNK_TiledKSampler_Scheduler,
    Enum_KSamplerEfficient_Sampler_state: Enum_KSamplerEfficient_Sampler_state,
    Enum_KSamplerEfficient_Sampler_name: Enum_KSamplerEfficient_Sampler_name,
    Enum_KSamplerEfficient_Scheduler: Enum_KSamplerEfficient_Scheduler,
    Enum_KSamplerEfficient_Preview_method: Enum_KSamplerEfficient_Preview_method,
    Enum_KSamplerEfficient_Vae_decode: Enum_KSamplerEfficient_Vae_decode,
    Enum_KSamplerAdvEfficient_Sampler_state: Enum_KSamplerAdvEfficient_Sampler_state,
    Enum_KSamplerAdvEfficient_Add_noise: Enum_KSamplerAdvEfficient_Add_noise,
    Enum_KSamplerAdvEfficient_Sampler_name: Enum_KSamplerAdvEfficient_Sampler_name,
    Enum_KSamplerAdvEfficient_Scheduler: Enum_KSamplerAdvEfficient_Scheduler,
    Enum_KSamplerAdvEfficient_Return_with_leftover_noise: Enum_KSamplerAdvEfficient_Return_with_leftover_noise,
    Enum_KSamplerAdvEfficient_Preview_method: Enum_KSamplerAdvEfficient_Preview_method,
    Enum_KSamplerAdvEfficient_Vae_decode: Enum_KSamplerAdvEfficient_Vae_decode,
    Enum_KSamplerSDXLEff_Sampler_state: Enum_KSamplerSDXLEff_Sampler_state,
    Enum_KSamplerSDXLEff_Sampler_name: Enum_KSamplerSDXLEff_Sampler_name,
    Enum_KSamplerSDXLEff_Scheduler: Enum_KSamplerSDXLEff_Scheduler,
    Enum_KSamplerSDXLEff_Preview_method: Enum_KSamplerSDXLEff_Preview_method,
    Enum_KSamplerSDXLEff_Vae_decode: Enum_KSamplerSDXLEff_Vae_decode,
    Enum_EfficientLoader_Ckpt_name: Enum_EfficientLoader_Ckpt_name,
    Enum_EfficientLoader_Vae_name: Enum_EfficientLoader_Vae_name,
    Enum_EfficientLoader_Lora_name: Enum_EfficientLoader_Lora_name,
    Enum_EffLoaderSDXL_Base_ckpt_name: Enum_EffLoaderSDXL_Base_ckpt_name,
    Enum_EffLoaderSDXL_Refiner_ckpt_name: Enum_EffLoaderSDXL_Refiner_ckpt_name,
    Enum_EffLoaderSDXL_Vae_name: Enum_EffLoaderSDXL_Vae_name,
    Enum_LoRAStacker_Input_mode: Enum_LoRAStacker_Input_mode,
    Enum_LoRAStacker_Lora_name_1: Enum_LoRAStacker_Lora_name_1,
    Enum_LoRAStacker_Lora_name_2: Enum_LoRAStacker_Lora_name_2,
    Enum_LoRAStacker_Lora_name_3: Enum_LoRAStacker_Lora_name_3,
    Enum_LoRAStacker_Lora_name_4: Enum_LoRAStacker_Lora_name_4,
    Enum_LoRAStacker_Lora_name_5: Enum_LoRAStacker_Lora_name_5,
    Enum_LoRAStacker_Lora_name_6: Enum_LoRAStacker_Lora_name_6,
    Enum_LoRAStacker_Lora_name_7: Enum_LoRAStacker_Lora_name_7,
    Enum_LoRAStacker_Lora_name_8: Enum_LoRAStacker_Lora_name_8,
    Enum_LoRAStacker_Lora_name_9: Enum_LoRAStacker_Lora_name_9,
    Enum_LoRAStacker_Lora_name_10: Enum_LoRAStacker_Lora_name_10,
    Enum_LoRAStacker_Lora_name_11: Enum_LoRAStacker_Lora_name_11,
    Enum_LoRAStacker_Lora_name_12: Enum_LoRAStacker_Lora_name_12,
    Enum_LoRAStacker_Lora_name_13: Enum_LoRAStacker_Lora_name_13,
    Enum_LoRAStacker_Lora_name_14: Enum_LoRAStacker_Lora_name_14,
    Enum_LoRAStacker_Lora_name_15: Enum_LoRAStacker_Lora_name_15,
    Enum_LoRAStacker_Lora_name_16: Enum_LoRAStacker_Lora_name_16,
    Enum_LoRAStacker_Lora_name_17: Enum_LoRAStacker_Lora_name_17,
    Enum_LoRAStacker_Lora_name_18: Enum_LoRAStacker_Lora_name_18,
    Enum_LoRAStacker_Lora_name_19: Enum_LoRAStacker_Lora_name_19,
    Enum_LoRAStacker_Lora_name_20: Enum_LoRAStacker_Lora_name_20,
    Enum_LoRAStacker_Lora_name_21: Enum_LoRAStacker_Lora_name_21,
    Enum_LoRAStacker_Lora_name_22: Enum_LoRAStacker_Lora_name_22,
    Enum_LoRAStacker_Lora_name_23: Enum_LoRAStacker_Lora_name_23,
    Enum_LoRAStacker_Lora_name_24: Enum_LoRAStacker_Lora_name_24,
    Enum_LoRAStacker_Lora_name_25: Enum_LoRAStacker_Lora_name_25,
    Enum_LoRAStacker_Lora_name_26: Enum_LoRAStacker_Lora_name_26,
    Enum_LoRAStacker_Lora_name_27: Enum_LoRAStacker_Lora_name_27,
    Enum_LoRAStacker_Lora_name_28: Enum_LoRAStacker_Lora_name_28,
    Enum_LoRAStacker_Lora_name_29: Enum_LoRAStacker_Lora_name_29,
    Enum_LoRAStacker_Lora_name_30: Enum_LoRAStacker_Lora_name_30,
    Enum_LoRAStacker_Lora_name_31: Enum_LoRAStacker_Lora_name_31,
    Enum_LoRAStacker_Lora_name_32: Enum_LoRAStacker_Lora_name_32,
    Enum_LoRAStacker_Lora_name_33: Enum_LoRAStacker_Lora_name_33,
    Enum_LoRAStacker_Lora_name_34: Enum_LoRAStacker_Lora_name_34,
    Enum_LoRAStacker_Lora_name_35: Enum_LoRAStacker_Lora_name_35,
    Enum_LoRAStacker_Lora_name_36: Enum_LoRAStacker_Lora_name_36,
    Enum_LoRAStacker_Lora_name_37: Enum_LoRAStacker_Lora_name_37,
    Enum_LoRAStacker_Lora_name_38: Enum_LoRAStacker_Lora_name_38,
    Enum_LoRAStacker_Lora_name_39: Enum_LoRAStacker_Lora_name_39,
    Enum_LoRAStacker_Lora_name_40: Enum_LoRAStacker_Lora_name_40,
    Enum_LoRAStacker_Lora_name_41: Enum_LoRAStacker_Lora_name_41,
    Enum_LoRAStacker_Lora_name_42: Enum_LoRAStacker_Lora_name_42,
    Enum_LoRAStacker_Lora_name_43: Enum_LoRAStacker_Lora_name_43,
    Enum_LoRAStacker_Lora_name_44: Enum_LoRAStacker_Lora_name_44,
    Enum_LoRAStacker_Lora_name_45: Enum_LoRAStacker_Lora_name_45,
    Enum_LoRAStacker_Lora_name_46: Enum_LoRAStacker_Lora_name_46,
    Enum_LoRAStacker_Lora_name_47: Enum_LoRAStacker_Lora_name_47,
    Enum_LoRAStacker_Lora_name_48: Enum_LoRAStacker_Lora_name_48,
    Enum_LoRAStacker_Lora_name_49: Enum_LoRAStacker_Lora_name_49,
    Enum_XYPlot_XY_flip: Enum_XYPlot_XY_flip,
    Enum_XYPlot_Y_label_orientation: Enum_XYPlot_Y_label_orientation,
    Enum_XYPlot_Cache_models: Enum_XYPlot_Cache_models,
    Enum_XYPlot_Ksampler_output_image: Enum_XYPlot_Ksampler_output_image,
    Enum_XYInputAddReturnNoise_XY_type: Enum_XYInputAddReturnNoise_XY_type,
    Enum_XYInputSteps_Target_parameter: Enum_XYInputSteps_Target_parameter,
    Enum_XYInputSamplerScheduler_Target_parameter: Enum_XYInputSamplerScheduler_Target_parameter,
    Enum_XYInputSamplerScheduler_Sampler_1: Enum_XYInputSamplerScheduler_Sampler_1,
    Enum_XYInputSamplerScheduler_Scheduler_1: Enum_XYInputSamplerScheduler_Scheduler_1,
    Enum_XYInputSamplerScheduler_Sampler_2: Enum_XYInputSamplerScheduler_Sampler_2,
    Enum_XYInputSamplerScheduler_Scheduler_2: Enum_XYInputSamplerScheduler_Scheduler_2,
    Enum_XYInputSamplerScheduler_Sampler_3: Enum_XYInputSamplerScheduler_Sampler_3,
    Enum_XYInputSamplerScheduler_Scheduler_3: Enum_XYInputSamplerScheduler_Scheduler_3,
    Enum_XYInputSamplerScheduler_Sampler_4: Enum_XYInputSamplerScheduler_Sampler_4,
    Enum_XYInputSamplerScheduler_Scheduler_4: Enum_XYInputSamplerScheduler_Scheduler_4,
    Enum_XYInputSamplerScheduler_Sampler_5: Enum_XYInputSamplerScheduler_Sampler_5,
    Enum_XYInputSamplerScheduler_Scheduler_5: Enum_XYInputSamplerScheduler_Scheduler_5,
    Enum_XYInputSamplerScheduler_Sampler_6: Enum_XYInputSamplerScheduler_Sampler_6,
    Enum_XYInputSamplerScheduler_Scheduler_6: Enum_XYInputSamplerScheduler_Scheduler_6,
    Enum_XYInputSamplerScheduler_Sampler_7: Enum_XYInputSamplerScheduler_Sampler_7,
    Enum_XYInputSamplerScheduler_Scheduler_7: Enum_XYInputSamplerScheduler_Scheduler_7,
    Enum_XYInputSamplerScheduler_Sampler_8: Enum_XYInputSamplerScheduler_Sampler_8,
    Enum_XYInputSamplerScheduler_Scheduler_8: Enum_XYInputSamplerScheduler_Scheduler_8,
    Enum_XYInputSamplerScheduler_Sampler_9: Enum_XYInputSamplerScheduler_Sampler_9,
    Enum_XYInputSamplerScheduler_Scheduler_9: Enum_XYInputSamplerScheduler_Scheduler_9,
    Enum_XYInputSamplerScheduler_Sampler_10: Enum_XYInputSamplerScheduler_Sampler_10,
    Enum_XYInputSamplerScheduler_Scheduler_10: Enum_XYInputSamplerScheduler_Scheduler_10,
    Enum_XYInputSamplerScheduler_Sampler_11: Enum_XYInputSamplerScheduler_Sampler_11,
    Enum_XYInputSamplerScheduler_Scheduler_11: Enum_XYInputSamplerScheduler_Scheduler_11,
    Enum_XYInputSamplerScheduler_Sampler_12: Enum_XYInputSamplerScheduler_Sampler_12,
    Enum_XYInputSamplerScheduler_Scheduler_12: Enum_XYInputSamplerScheduler_Scheduler_12,
    Enum_XYInputSamplerScheduler_Sampler_13: Enum_XYInputSamplerScheduler_Sampler_13,
    Enum_XYInputSamplerScheduler_Scheduler_13: Enum_XYInputSamplerScheduler_Scheduler_13,
    Enum_XYInputSamplerScheduler_Sampler_14: Enum_XYInputSamplerScheduler_Sampler_14,
    Enum_XYInputSamplerScheduler_Scheduler_14: Enum_XYInputSamplerScheduler_Scheduler_14,
    Enum_XYInputSamplerScheduler_Sampler_15: Enum_XYInputSamplerScheduler_Sampler_15,
    Enum_XYInputSamplerScheduler_Scheduler_15: Enum_XYInputSamplerScheduler_Scheduler_15,
    Enum_XYInputSamplerScheduler_Sampler_16: Enum_XYInputSamplerScheduler_Sampler_16,
    Enum_XYInputSamplerScheduler_Scheduler_16: Enum_XYInputSamplerScheduler_Scheduler_16,
    Enum_XYInputSamplerScheduler_Sampler_17: Enum_XYInputSamplerScheduler_Sampler_17,
    Enum_XYInputSamplerScheduler_Scheduler_17: Enum_XYInputSamplerScheduler_Scheduler_17,
    Enum_XYInputSamplerScheduler_Sampler_18: Enum_XYInputSamplerScheduler_Sampler_18,
    Enum_XYInputSamplerScheduler_Scheduler_18: Enum_XYInputSamplerScheduler_Scheduler_18,
    Enum_XYInputSamplerScheduler_Sampler_19: Enum_XYInputSamplerScheduler_Sampler_19,
    Enum_XYInputSamplerScheduler_Scheduler_19: Enum_XYInputSamplerScheduler_Scheduler_19,
    Enum_XYInputSamplerScheduler_Sampler_20: Enum_XYInputSamplerScheduler_Sampler_20,
    Enum_XYInputSamplerScheduler_Scheduler_20: Enum_XYInputSamplerScheduler_Scheduler_20,
    Enum_XYInputSamplerScheduler_Sampler_21: Enum_XYInputSamplerScheduler_Sampler_21,
    Enum_XYInputSamplerScheduler_Scheduler_21: Enum_XYInputSamplerScheduler_Scheduler_21,
    Enum_XYInputSamplerScheduler_Sampler_22: Enum_XYInputSamplerScheduler_Sampler_22,
    Enum_XYInputSamplerScheduler_Scheduler_22: Enum_XYInputSamplerScheduler_Scheduler_22,
    Enum_XYInputSamplerScheduler_Sampler_23: Enum_XYInputSamplerScheduler_Sampler_23,
    Enum_XYInputSamplerScheduler_Scheduler_23: Enum_XYInputSamplerScheduler_Scheduler_23,
    Enum_XYInputSamplerScheduler_Sampler_24: Enum_XYInputSamplerScheduler_Sampler_24,
    Enum_XYInputSamplerScheduler_Scheduler_24: Enum_XYInputSamplerScheduler_Scheduler_24,
    Enum_XYInputSamplerScheduler_Sampler_25: Enum_XYInputSamplerScheduler_Sampler_25,
    Enum_XYInputSamplerScheduler_Scheduler_25: Enum_XYInputSamplerScheduler_Scheduler_25,
    Enum_XYInputSamplerScheduler_Sampler_26: Enum_XYInputSamplerScheduler_Sampler_26,
    Enum_XYInputSamplerScheduler_Scheduler_26: Enum_XYInputSamplerScheduler_Scheduler_26,
    Enum_XYInputSamplerScheduler_Sampler_27: Enum_XYInputSamplerScheduler_Sampler_27,
    Enum_XYInputSamplerScheduler_Scheduler_27: Enum_XYInputSamplerScheduler_Scheduler_27,
    Enum_XYInputSamplerScheduler_Sampler_28: Enum_XYInputSamplerScheduler_Sampler_28,
    Enum_XYInputSamplerScheduler_Scheduler_28: Enum_XYInputSamplerScheduler_Scheduler_28,
    Enum_XYInputSamplerScheduler_Sampler_29: Enum_XYInputSamplerScheduler_Sampler_29,
    Enum_XYInputSamplerScheduler_Scheduler_29: Enum_XYInputSamplerScheduler_Scheduler_29,
    Enum_XYInputSamplerScheduler_Sampler_30: Enum_XYInputSamplerScheduler_Sampler_30,
    Enum_XYInputSamplerScheduler_Scheduler_30: Enum_XYInputSamplerScheduler_Scheduler_30,
    Enum_XYInputSamplerScheduler_Sampler_31: Enum_XYInputSamplerScheduler_Sampler_31,
    Enum_XYInputSamplerScheduler_Scheduler_31: Enum_XYInputSamplerScheduler_Scheduler_31,
    Enum_XYInputSamplerScheduler_Sampler_32: Enum_XYInputSamplerScheduler_Sampler_32,
    Enum_XYInputSamplerScheduler_Scheduler_32: Enum_XYInputSamplerScheduler_Scheduler_32,
    Enum_XYInputSamplerScheduler_Sampler_33: Enum_XYInputSamplerScheduler_Sampler_33,
    Enum_XYInputSamplerScheduler_Scheduler_33: Enum_XYInputSamplerScheduler_Scheduler_33,
    Enum_XYInputSamplerScheduler_Sampler_34: Enum_XYInputSamplerScheduler_Sampler_34,
    Enum_XYInputSamplerScheduler_Scheduler_34: Enum_XYInputSamplerScheduler_Scheduler_34,
    Enum_XYInputSamplerScheduler_Sampler_35: Enum_XYInputSamplerScheduler_Sampler_35,
    Enum_XYInputSamplerScheduler_Scheduler_35: Enum_XYInputSamplerScheduler_Scheduler_35,
    Enum_XYInputSamplerScheduler_Sampler_36: Enum_XYInputSamplerScheduler_Sampler_36,
    Enum_XYInputSamplerScheduler_Scheduler_36: Enum_XYInputSamplerScheduler_Scheduler_36,
    Enum_XYInputSamplerScheduler_Sampler_37: Enum_XYInputSamplerScheduler_Sampler_37,
    Enum_XYInputSamplerScheduler_Scheduler_37: Enum_XYInputSamplerScheduler_Scheduler_37,
    Enum_XYInputSamplerScheduler_Sampler_38: Enum_XYInputSamplerScheduler_Sampler_38,
    Enum_XYInputSamplerScheduler_Scheduler_38: Enum_XYInputSamplerScheduler_Scheduler_38,
    Enum_XYInputSamplerScheduler_Sampler_39: Enum_XYInputSamplerScheduler_Sampler_39,
    Enum_XYInputSamplerScheduler_Scheduler_39: Enum_XYInputSamplerScheduler_Scheduler_39,
    Enum_XYInputSamplerScheduler_Sampler_40: Enum_XYInputSamplerScheduler_Sampler_40,
    Enum_XYInputSamplerScheduler_Scheduler_40: Enum_XYInputSamplerScheduler_Scheduler_40,
    Enum_XYInputSamplerScheduler_Sampler_41: Enum_XYInputSamplerScheduler_Sampler_41,
    Enum_XYInputSamplerScheduler_Scheduler_41: Enum_XYInputSamplerScheduler_Scheduler_41,
    Enum_XYInputSamplerScheduler_Sampler_42: Enum_XYInputSamplerScheduler_Sampler_42,
    Enum_XYInputSamplerScheduler_Scheduler_42: Enum_XYInputSamplerScheduler_Scheduler_42,
    Enum_XYInputSamplerScheduler_Sampler_43: Enum_XYInputSamplerScheduler_Sampler_43,
    Enum_XYInputSamplerScheduler_Scheduler_43: Enum_XYInputSamplerScheduler_Scheduler_43,
    Enum_XYInputSamplerScheduler_Sampler_44: Enum_XYInputSamplerScheduler_Sampler_44,
    Enum_XYInputSamplerScheduler_Scheduler_44: Enum_XYInputSamplerScheduler_Scheduler_44,
    Enum_XYInputSamplerScheduler_Sampler_45: Enum_XYInputSamplerScheduler_Sampler_45,
    Enum_XYInputSamplerScheduler_Scheduler_45: Enum_XYInputSamplerScheduler_Scheduler_45,
    Enum_XYInputSamplerScheduler_Sampler_46: Enum_XYInputSamplerScheduler_Sampler_46,
    Enum_XYInputSamplerScheduler_Scheduler_46: Enum_XYInputSamplerScheduler_Scheduler_46,
    Enum_XYInputSamplerScheduler_Sampler_47: Enum_XYInputSamplerScheduler_Sampler_47,
    Enum_XYInputSamplerScheduler_Scheduler_47: Enum_XYInputSamplerScheduler_Scheduler_47,
    Enum_XYInputSamplerScheduler_Sampler_48: Enum_XYInputSamplerScheduler_Sampler_48,
    Enum_XYInputSamplerScheduler_Scheduler_48: Enum_XYInputSamplerScheduler_Scheduler_48,
    Enum_XYInputSamplerScheduler_Sampler_49: Enum_XYInputSamplerScheduler_Sampler_49,
    Enum_XYInputSamplerScheduler_Scheduler_49: Enum_XYInputSamplerScheduler_Scheduler_49,
    Enum_XYInputSamplerScheduler_Sampler_50: Enum_XYInputSamplerScheduler_Sampler_50,
    Enum_XYInputSamplerScheduler_Scheduler_50: Enum_XYInputSamplerScheduler_Scheduler_50,
    Enum_XYInputVAE_Input_mode: Enum_XYInputVAE_Input_mode,
    Enum_XYInputVAE_Batch_sort: Enum_XYInputVAE_Batch_sort,
    Enum_XYInputVAE_Vae_name_1: Enum_XYInputVAE_Vae_name_1,
    Enum_XYInputVAE_Vae_name_2: Enum_XYInputVAE_Vae_name_2,
    Enum_XYInputVAE_Vae_name_3: Enum_XYInputVAE_Vae_name_3,
    Enum_XYInputVAE_Vae_name_4: Enum_XYInputVAE_Vae_name_4,
    Enum_XYInputVAE_Vae_name_5: Enum_XYInputVAE_Vae_name_5,
    Enum_XYInputVAE_Vae_name_6: Enum_XYInputVAE_Vae_name_6,
    Enum_XYInputVAE_Vae_name_7: Enum_XYInputVAE_Vae_name_7,
    Enum_XYInputVAE_Vae_name_8: Enum_XYInputVAE_Vae_name_8,
    Enum_XYInputVAE_Vae_name_9: Enum_XYInputVAE_Vae_name_9,
    Enum_XYInputVAE_Vae_name_10: Enum_XYInputVAE_Vae_name_10,
    Enum_XYInputVAE_Vae_name_11: Enum_XYInputVAE_Vae_name_11,
    Enum_XYInputVAE_Vae_name_12: Enum_XYInputVAE_Vae_name_12,
    Enum_XYInputVAE_Vae_name_13: Enum_XYInputVAE_Vae_name_13,
    Enum_XYInputVAE_Vae_name_14: Enum_XYInputVAE_Vae_name_14,
    Enum_XYInputVAE_Vae_name_15: Enum_XYInputVAE_Vae_name_15,
    Enum_XYInputVAE_Vae_name_16: Enum_XYInputVAE_Vae_name_16,
    Enum_XYInputVAE_Vae_name_17: Enum_XYInputVAE_Vae_name_17,
    Enum_XYInputVAE_Vae_name_18: Enum_XYInputVAE_Vae_name_18,
    Enum_XYInputVAE_Vae_name_19: Enum_XYInputVAE_Vae_name_19,
    Enum_XYInputVAE_Vae_name_20: Enum_XYInputVAE_Vae_name_20,
    Enum_XYInputVAE_Vae_name_21: Enum_XYInputVAE_Vae_name_21,
    Enum_XYInputVAE_Vae_name_22: Enum_XYInputVAE_Vae_name_22,
    Enum_XYInputVAE_Vae_name_23: Enum_XYInputVAE_Vae_name_23,
    Enum_XYInputVAE_Vae_name_24: Enum_XYInputVAE_Vae_name_24,
    Enum_XYInputVAE_Vae_name_25: Enum_XYInputVAE_Vae_name_25,
    Enum_XYInputVAE_Vae_name_26: Enum_XYInputVAE_Vae_name_26,
    Enum_XYInputVAE_Vae_name_27: Enum_XYInputVAE_Vae_name_27,
    Enum_XYInputVAE_Vae_name_28: Enum_XYInputVAE_Vae_name_28,
    Enum_XYInputVAE_Vae_name_29: Enum_XYInputVAE_Vae_name_29,
    Enum_XYInputVAE_Vae_name_30: Enum_XYInputVAE_Vae_name_30,
    Enum_XYInputVAE_Vae_name_31: Enum_XYInputVAE_Vae_name_31,
    Enum_XYInputVAE_Vae_name_32: Enum_XYInputVAE_Vae_name_32,
    Enum_XYInputVAE_Vae_name_33: Enum_XYInputVAE_Vae_name_33,
    Enum_XYInputVAE_Vae_name_34: Enum_XYInputVAE_Vae_name_34,
    Enum_XYInputVAE_Vae_name_35: Enum_XYInputVAE_Vae_name_35,
    Enum_XYInputVAE_Vae_name_36: Enum_XYInputVAE_Vae_name_36,
    Enum_XYInputVAE_Vae_name_37: Enum_XYInputVAE_Vae_name_37,
    Enum_XYInputVAE_Vae_name_38: Enum_XYInputVAE_Vae_name_38,
    Enum_XYInputVAE_Vae_name_39: Enum_XYInputVAE_Vae_name_39,
    Enum_XYInputVAE_Vae_name_40: Enum_XYInputVAE_Vae_name_40,
    Enum_XYInputVAE_Vae_name_41: Enum_XYInputVAE_Vae_name_41,
    Enum_XYInputVAE_Vae_name_42: Enum_XYInputVAE_Vae_name_42,
    Enum_XYInputVAE_Vae_name_43: Enum_XYInputVAE_Vae_name_43,
    Enum_XYInputVAE_Vae_name_44: Enum_XYInputVAE_Vae_name_44,
    Enum_XYInputVAE_Vae_name_45: Enum_XYInputVAE_Vae_name_45,
    Enum_XYInputVAE_Vae_name_46: Enum_XYInputVAE_Vae_name_46,
    Enum_XYInputVAE_Vae_name_47: Enum_XYInputVAE_Vae_name_47,
    Enum_XYInputVAE_Vae_name_48: Enum_XYInputVAE_Vae_name_48,
    Enum_XYInputVAE_Vae_name_49: Enum_XYInputVAE_Vae_name_49,
    Enum_XYInputVAE_Vae_name_50: Enum_XYInputVAE_Vae_name_50,
    Enum_XYInputPromptSR_Target_prompt: Enum_XYInputPromptSR_Target_prompt,
    Enum_XYInputAestheticScore_Target_ascore: Enum_XYInputAestheticScore_Target_ascore,
    Enum_XYInputCheckpoint_Target_ckpt: Enum_XYInputCheckpoint_Target_ckpt,
    Enum_XYInputCheckpoint_Input_mode: Enum_XYInputCheckpoint_Input_mode,
    Enum_XYInputCheckpoint_Batch_sort: Enum_XYInputCheckpoint_Batch_sort,
    Enum_XYInputCheckpoint_Ckpt_name_1: Enum_XYInputCheckpoint_Ckpt_name_1,
    Enum_XYInputCheckpoint_Vae_name_1: Enum_XYInputCheckpoint_Vae_name_1,
    Enum_XYInputCheckpoint_Ckpt_name_2: Enum_XYInputCheckpoint_Ckpt_name_2,
    Enum_XYInputCheckpoint_Vae_name_2: Enum_XYInputCheckpoint_Vae_name_2,
    Enum_XYInputCheckpoint_Ckpt_name_3: Enum_XYInputCheckpoint_Ckpt_name_3,
    Enum_XYInputCheckpoint_Vae_name_3: Enum_XYInputCheckpoint_Vae_name_3,
    Enum_XYInputCheckpoint_Ckpt_name_4: Enum_XYInputCheckpoint_Ckpt_name_4,
    Enum_XYInputCheckpoint_Vae_name_4: Enum_XYInputCheckpoint_Vae_name_4,
    Enum_XYInputCheckpoint_Ckpt_name_5: Enum_XYInputCheckpoint_Ckpt_name_5,
    Enum_XYInputCheckpoint_Vae_name_5: Enum_XYInputCheckpoint_Vae_name_5,
    Enum_XYInputCheckpoint_Ckpt_name_6: Enum_XYInputCheckpoint_Ckpt_name_6,
    Enum_XYInputCheckpoint_Vae_name_6: Enum_XYInputCheckpoint_Vae_name_6,
    Enum_XYInputCheckpoint_Ckpt_name_7: Enum_XYInputCheckpoint_Ckpt_name_7,
    Enum_XYInputCheckpoint_Vae_name_7: Enum_XYInputCheckpoint_Vae_name_7,
    Enum_XYInputCheckpoint_Ckpt_name_8: Enum_XYInputCheckpoint_Ckpt_name_8,
    Enum_XYInputCheckpoint_Vae_name_8: Enum_XYInputCheckpoint_Vae_name_8,
    Enum_XYInputCheckpoint_Ckpt_name_9: Enum_XYInputCheckpoint_Ckpt_name_9,
    Enum_XYInputCheckpoint_Vae_name_9: Enum_XYInputCheckpoint_Vae_name_9,
    Enum_XYInputCheckpoint_Ckpt_name_10: Enum_XYInputCheckpoint_Ckpt_name_10,
    Enum_XYInputCheckpoint_Vae_name_10: Enum_XYInputCheckpoint_Vae_name_10,
    Enum_XYInputCheckpoint_Ckpt_name_11: Enum_XYInputCheckpoint_Ckpt_name_11,
    Enum_XYInputCheckpoint_Vae_name_11: Enum_XYInputCheckpoint_Vae_name_11,
    Enum_XYInputCheckpoint_Ckpt_name_12: Enum_XYInputCheckpoint_Ckpt_name_12,
    Enum_XYInputCheckpoint_Vae_name_12: Enum_XYInputCheckpoint_Vae_name_12,
    Enum_XYInputCheckpoint_Ckpt_name_13: Enum_XYInputCheckpoint_Ckpt_name_13,
    Enum_XYInputCheckpoint_Vae_name_13: Enum_XYInputCheckpoint_Vae_name_13,
    Enum_XYInputCheckpoint_Ckpt_name_14: Enum_XYInputCheckpoint_Ckpt_name_14,
    Enum_XYInputCheckpoint_Vae_name_14: Enum_XYInputCheckpoint_Vae_name_14,
    Enum_XYInputCheckpoint_Ckpt_name_15: Enum_XYInputCheckpoint_Ckpt_name_15,
    Enum_XYInputCheckpoint_Vae_name_15: Enum_XYInputCheckpoint_Vae_name_15,
    Enum_XYInputCheckpoint_Ckpt_name_16: Enum_XYInputCheckpoint_Ckpt_name_16,
    Enum_XYInputCheckpoint_Vae_name_16: Enum_XYInputCheckpoint_Vae_name_16,
    Enum_XYInputCheckpoint_Ckpt_name_17: Enum_XYInputCheckpoint_Ckpt_name_17,
    Enum_XYInputCheckpoint_Vae_name_17: Enum_XYInputCheckpoint_Vae_name_17,
    Enum_XYInputCheckpoint_Ckpt_name_18: Enum_XYInputCheckpoint_Ckpt_name_18,
    Enum_XYInputCheckpoint_Vae_name_18: Enum_XYInputCheckpoint_Vae_name_18,
    Enum_XYInputCheckpoint_Ckpt_name_19: Enum_XYInputCheckpoint_Ckpt_name_19,
    Enum_XYInputCheckpoint_Vae_name_19: Enum_XYInputCheckpoint_Vae_name_19,
    Enum_XYInputCheckpoint_Ckpt_name_20: Enum_XYInputCheckpoint_Ckpt_name_20,
    Enum_XYInputCheckpoint_Vae_name_20: Enum_XYInputCheckpoint_Vae_name_20,
    Enum_XYInputCheckpoint_Ckpt_name_21: Enum_XYInputCheckpoint_Ckpt_name_21,
    Enum_XYInputCheckpoint_Vae_name_21: Enum_XYInputCheckpoint_Vae_name_21,
    Enum_XYInputCheckpoint_Ckpt_name_22: Enum_XYInputCheckpoint_Ckpt_name_22,
    Enum_XYInputCheckpoint_Vae_name_22: Enum_XYInputCheckpoint_Vae_name_22,
    Enum_XYInputCheckpoint_Ckpt_name_23: Enum_XYInputCheckpoint_Ckpt_name_23,
    Enum_XYInputCheckpoint_Vae_name_23: Enum_XYInputCheckpoint_Vae_name_23,
    Enum_XYInputCheckpoint_Ckpt_name_24: Enum_XYInputCheckpoint_Ckpt_name_24,
    Enum_XYInputCheckpoint_Vae_name_24: Enum_XYInputCheckpoint_Vae_name_24,
    Enum_XYInputCheckpoint_Ckpt_name_25: Enum_XYInputCheckpoint_Ckpt_name_25,
    Enum_XYInputCheckpoint_Vae_name_25: Enum_XYInputCheckpoint_Vae_name_25,
    Enum_XYInputCheckpoint_Ckpt_name_26: Enum_XYInputCheckpoint_Ckpt_name_26,
    Enum_XYInputCheckpoint_Vae_name_26: Enum_XYInputCheckpoint_Vae_name_26,
    Enum_XYInputCheckpoint_Ckpt_name_27: Enum_XYInputCheckpoint_Ckpt_name_27,
    Enum_XYInputCheckpoint_Vae_name_27: Enum_XYInputCheckpoint_Vae_name_27,
    Enum_XYInputCheckpoint_Ckpt_name_28: Enum_XYInputCheckpoint_Ckpt_name_28,
    Enum_XYInputCheckpoint_Vae_name_28: Enum_XYInputCheckpoint_Vae_name_28,
    Enum_XYInputCheckpoint_Ckpt_name_29: Enum_XYInputCheckpoint_Ckpt_name_29,
    Enum_XYInputCheckpoint_Vae_name_29: Enum_XYInputCheckpoint_Vae_name_29,
    Enum_XYInputCheckpoint_Ckpt_name_30: Enum_XYInputCheckpoint_Ckpt_name_30,
    Enum_XYInputCheckpoint_Vae_name_30: Enum_XYInputCheckpoint_Vae_name_30,
    Enum_XYInputCheckpoint_Ckpt_name_31: Enum_XYInputCheckpoint_Ckpt_name_31,
    Enum_XYInputCheckpoint_Vae_name_31: Enum_XYInputCheckpoint_Vae_name_31,
    Enum_XYInputCheckpoint_Ckpt_name_32: Enum_XYInputCheckpoint_Ckpt_name_32,
    Enum_XYInputCheckpoint_Vae_name_32: Enum_XYInputCheckpoint_Vae_name_32,
    Enum_XYInputCheckpoint_Ckpt_name_33: Enum_XYInputCheckpoint_Ckpt_name_33,
    Enum_XYInputCheckpoint_Vae_name_33: Enum_XYInputCheckpoint_Vae_name_33,
    Enum_XYInputCheckpoint_Ckpt_name_34: Enum_XYInputCheckpoint_Ckpt_name_34,
    Enum_XYInputCheckpoint_Vae_name_34: Enum_XYInputCheckpoint_Vae_name_34,
    Enum_XYInputCheckpoint_Ckpt_name_35: Enum_XYInputCheckpoint_Ckpt_name_35,
    Enum_XYInputCheckpoint_Vae_name_35: Enum_XYInputCheckpoint_Vae_name_35,
    Enum_XYInputCheckpoint_Ckpt_name_36: Enum_XYInputCheckpoint_Ckpt_name_36,
    Enum_XYInputCheckpoint_Vae_name_36: Enum_XYInputCheckpoint_Vae_name_36,
    Enum_XYInputCheckpoint_Ckpt_name_37: Enum_XYInputCheckpoint_Ckpt_name_37,
    Enum_XYInputCheckpoint_Vae_name_37: Enum_XYInputCheckpoint_Vae_name_37,
    Enum_XYInputCheckpoint_Ckpt_name_38: Enum_XYInputCheckpoint_Ckpt_name_38,
    Enum_XYInputCheckpoint_Vae_name_38: Enum_XYInputCheckpoint_Vae_name_38,
    Enum_XYInputCheckpoint_Ckpt_name_39: Enum_XYInputCheckpoint_Ckpt_name_39,
    Enum_XYInputCheckpoint_Vae_name_39: Enum_XYInputCheckpoint_Vae_name_39,
    Enum_XYInputCheckpoint_Ckpt_name_40: Enum_XYInputCheckpoint_Ckpt_name_40,
    Enum_XYInputCheckpoint_Vae_name_40: Enum_XYInputCheckpoint_Vae_name_40,
    Enum_XYInputCheckpoint_Ckpt_name_41: Enum_XYInputCheckpoint_Ckpt_name_41,
    Enum_XYInputCheckpoint_Vae_name_41: Enum_XYInputCheckpoint_Vae_name_41,
    Enum_XYInputCheckpoint_Ckpt_name_42: Enum_XYInputCheckpoint_Ckpt_name_42,
    Enum_XYInputCheckpoint_Vae_name_42: Enum_XYInputCheckpoint_Vae_name_42,
    Enum_XYInputCheckpoint_Ckpt_name_43: Enum_XYInputCheckpoint_Ckpt_name_43,
    Enum_XYInputCheckpoint_Vae_name_43: Enum_XYInputCheckpoint_Vae_name_43,
    Enum_XYInputCheckpoint_Ckpt_name_44: Enum_XYInputCheckpoint_Ckpt_name_44,
    Enum_XYInputCheckpoint_Vae_name_44: Enum_XYInputCheckpoint_Vae_name_44,
    Enum_XYInputCheckpoint_Ckpt_name_45: Enum_XYInputCheckpoint_Ckpt_name_45,
    Enum_XYInputCheckpoint_Vae_name_45: Enum_XYInputCheckpoint_Vae_name_45,
    Enum_XYInputCheckpoint_Ckpt_name_46: Enum_XYInputCheckpoint_Ckpt_name_46,
    Enum_XYInputCheckpoint_Vae_name_46: Enum_XYInputCheckpoint_Vae_name_46,
    Enum_XYInputCheckpoint_Ckpt_name_47: Enum_XYInputCheckpoint_Ckpt_name_47,
    Enum_XYInputCheckpoint_Vae_name_47: Enum_XYInputCheckpoint_Vae_name_47,
    Enum_XYInputCheckpoint_Ckpt_name_48: Enum_XYInputCheckpoint_Ckpt_name_48,
    Enum_XYInputCheckpoint_Vae_name_48: Enum_XYInputCheckpoint_Vae_name_48,
    Enum_XYInputCheckpoint_Ckpt_name_49: Enum_XYInputCheckpoint_Ckpt_name_49,
    Enum_XYInputCheckpoint_Vae_name_49: Enum_XYInputCheckpoint_Vae_name_49,
    Enum_XYInputCheckpoint_Ckpt_name_50: Enum_XYInputCheckpoint_Ckpt_name_50,
    Enum_XYInputCheckpoint_Vae_name_50: Enum_XYInputCheckpoint_Vae_name_50,
    Enum_XYInputClipSkip_Target_ckpt: Enum_XYInputClipSkip_Target_ckpt,
    Enum_XYInputLoRA_Input_mode: Enum_XYInputLoRA_Input_mode,
    Enum_XYInputLoRA_Batch_sort: Enum_XYInputLoRA_Batch_sort,
    Enum_XYInputLoRA_Lora_name_1: Enum_XYInputLoRA_Lora_name_1,
    Enum_XYInputLoRA_Lora_name_2: Enum_XYInputLoRA_Lora_name_2,
    Enum_XYInputLoRA_Lora_name_3: Enum_XYInputLoRA_Lora_name_3,
    Enum_XYInputLoRA_Lora_name_4: Enum_XYInputLoRA_Lora_name_4,
    Enum_XYInputLoRA_Lora_name_5: Enum_XYInputLoRA_Lora_name_5,
    Enum_XYInputLoRA_Lora_name_6: Enum_XYInputLoRA_Lora_name_6,
    Enum_XYInputLoRA_Lora_name_7: Enum_XYInputLoRA_Lora_name_7,
    Enum_XYInputLoRA_Lora_name_8: Enum_XYInputLoRA_Lora_name_8,
    Enum_XYInputLoRA_Lora_name_9: Enum_XYInputLoRA_Lora_name_9,
    Enum_XYInputLoRA_Lora_name_10: Enum_XYInputLoRA_Lora_name_10,
    Enum_XYInputLoRA_Lora_name_11: Enum_XYInputLoRA_Lora_name_11,
    Enum_XYInputLoRA_Lora_name_12: Enum_XYInputLoRA_Lora_name_12,
    Enum_XYInputLoRA_Lora_name_13: Enum_XYInputLoRA_Lora_name_13,
    Enum_XYInputLoRA_Lora_name_14: Enum_XYInputLoRA_Lora_name_14,
    Enum_XYInputLoRA_Lora_name_15: Enum_XYInputLoRA_Lora_name_15,
    Enum_XYInputLoRA_Lora_name_16: Enum_XYInputLoRA_Lora_name_16,
    Enum_XYInputLoRA_Lora_name_17: Enum_XYInputLoRA_Lora_name_17,
    Enum_XYInputLoRA_Lora_name_18: Enum_XYInputLoRA_Lora_name_18,
    Enum_XYInputLoRA_Lora_name_19: Enum_XYInputLoRA_Lora_name_19,
    Enum_XYInputLoRA_Lora_name_20: Enum_XYInputLoRA_Lora_name_20,
    Enum_XYInputLoRA_Lora_name_21: Enum_XYInputLoRA_Lora_name_21,
    Enum_XYInputLoRA_Lora_name_22: Enum_XYInputLoRA_Lora_name_22,
    Enum_XYInputLoRA_Lora_name_23: Enum_XYInputLoRA_Lora_name_23,
    Enum_XYInputLoRA_Lora_name_24: Enum_XYInputLoRA_Lora_name_24,
    Enum_XYInputLoRA_Lora_name_25: Enum_XYInputLoRA_Lora_name_25,
    Enum_XYInputLoRA_Lora_name_26: Enum_XYInputLoRA_Lora_name_26,
    Enum_XYInputLoRA_Lora_name_27: Enum_XYInputLoRA_Lora_name_27,
    Enum_XYInputLoRA_Lora_name_28: Enum_XYInputLoRA_Lora_name_28,
    Enum_XYInputLoRA_Lora_name_29: Enum_XYInputLoRA_Lora_name_29,
    Enum_XYInputLoRA_Lora_name_30: Enum_XYInputLoRA_Lora_name_30,
    Enum_XYInputLoRA_Lora_name_31: Enum_XYInputLoRA_Lora_name_31,
    Enum_XYInputLoRA_Lora_name_32: Enum_XYInputLoRA_Lora_name_32,
    Enum_XYInputLoRA_Lora_name_33: Enum_XYInputLoRA_Lora_name_33,
    Enum_XYInputLoRA_Lora_name_34: Enum_XYInputLoRA_Lora_name_34,
    Enum_XYInputLoRA_Lora_name_35: Enum_XYInputLoRA_Lora_name_35,
    Enum_XYInputLoRA_Lora_name_36: Enum_XYInputLoRA_Lora_name_36,
    Enum_XYInputLoRA_Lora_name_37: Enum_XYInputLoRA_Lora_name_37,
    Enum_XYInputLoRA_Lora_name_38: Enum_XYInputLoRA_Lora_name_38,
    Enum_XYInputLoRA_Lora_name_39: Enum_XYInputLoRA_Lora_name_39,
    Enum_XYInputLoRA_Lora_name_40: Enum_XYInputLoRA_Lora_name_40,
    Enum_XYInputLoRA_Lora_name_41: Enum_XYInputLoRA_Lora_name_41,
    Enum_XYInputLoRA_Lora_name_42: Enum_XYInputLoRA_Lora_name_42,
    Enum_XYInputLoRA_Lora_name_43: Enum_XYInputLoRA_Lora_name_43,
    Enum_XYInputLoRA_Lora_name_44: Enum_XYInputLoRA_Lora_name_44,
    Enum_XYInputLoRA_Lora_name_45: Enum_XYInputLoRA_Lora_name_45,
    Enum_XYInputLoRA_Lora_name_46: Enum_XYInputLoRA_Lora_name_46,
    Enum_XYInputLoRA_Lora_name_47: Enum_XYInputLoRA_Lora_name_47,
    Enum_XYInputLoRA_Lora_name_48: Enum_XYInputLoRA_Lora_name_48,
    Enum_XYInputLoRA_Lora_name_49: Enum_XYInputLoRA_Lora_name_49,
    Enum_XYInputLoRA_Lora_name_50: Enum_XYInputLoRA_Lora_name_50,
    Enum_XYInputLoRAPlot_Input_mode: Enum_XYInputLoRAPlot_Input_mode,
    Enum_XYInputLoRAPlot_Lora_name: Enum_XYInputLoRAPlot_Lora_name,
    Enum_XYInputLoRAPlot_X_batch_sort: Enum_XYInputLoRAPlot_X_batch_sort,
    Enum_XYInputLoRAStacks_Node_state: Enum_XYInputLoRAStacks_Node_state,
    Enum_XYInputControlNet_Target_parameter: Enum_XYInputControlNet_Target_parameter,
    Enum_XYInputControlNetPlot_Plot_type: Enum_XYInputControlNetPlot_Plot_type,
    Enum_XYInputManualXYEntry_Plot_type: Enum_XYInputManualXYEntry_Plot_type,
    Enum_ImageOverlay_Overlay_resize: Enum_ImageOverlay_Overlay_resize,
    Enum_ImageOverlay_Resize_method: Enum_ImageOverlay_Resize_method,
    Enum_HighResFixScript_Latent_upscale_method: Enum_HighResFixScript_Latent_upscale_method,
    Enum_EvaluateIntegers_Print_to_console: Enum_EvaluateIntegers_Print_to_console,
    Enum_EvaluateFloats_Print_to_console: Enum_EvaluateFloats_Print_to_console,
    Enum_EvaluateStrings_Print_to_console: Enum_EvaluateStrings_Print_to_console,
    Enum_LatentByRatio_Model: Enum_LatentByRatio_Model,
    Enum_LatentByRatio_Ratio: Enum_LatentByRatio_Ratio,
    Enum_MasqueradeMaskByText_Normalize: Enum_MasqueradeMaskByText_Normalize,
    Enum_MasqueradeMaskMorphology_Op: Enum_MasqueradeMaskMorphology_Op,
    Enum_MasqueradeCombineMasks_Op: Enum_MasqueradeCombineMasks_Op,
    Enum_MasqueradeCombineMasks_Clamp_result: Enum_MasqueradeCombineMasks_Clamp_result,
    Enum_MasqueradeCombineMasks_Round_result: Enum_MasqueradeCombineMasks_Round_result,
    Enum_MasqueradeUnaryMaskOp_Op: Enum_MasqueradeUnaryMaskOp_Op,
    Enum_MasqueradeUnaryImageOp_Op: Enum_MasqueradeUnaryImageOp_Op,
    Enum_MasqueradeImageToMask_Method: Enum_MasqueradeImageToMask_Method,
    Enum_MasqueradeMaskToRegion_Constraints: Enum_MasqueradeMaskToRegion_Constraints,
    Enum_MasqueradeMaskToRegion_Batch_behavior: Enum_MasqueradeMaskToRegion_Batch_behavior,
    Enum_MasqueradePasteByMask_Resize_behavior: Enum_MasqueradePasteByMask_Resize_behavior,
    Enum_MasqueradeChangeChannelCount_Kind: Enum_MasqueradeChangeChannelCount_Kind,
    Enum_MasqueradeCreateRectMask_Mode: Enum_MasqueradeCreateRectMask_Mode,
    Enum_MasqueradeCreateRectMask_Origin: Enum_MasqueradeCreateRectMask_Origin,
    Enum_MasqueradeCreateQRCode_Error_correction: Enum_MasqueradeCreateQRCode_Error_correction,
    Enum_MasqueradeConvertColorSpace_In_space: Enum_MasqueradeConvertColorSpace_In_space,
    Enum_MasqueradeConvertColorSpace_Out_space: Enum_MasqueradeConvertColorSpace_Out_space,
    Enum_SDXLMixSampler_Sampler_name: Enum_SDXLMixSampler_Sampler_name,
    Enum_SDXLMixSampler_Scheduler: Enum_SDXLMixSampler_Scheduler,
    Enum_SDXLMixSampler_Final_only: Enum_SDXLMixSampler_Final_only,
    Enum_WASBLIPModelLoader_Blip_model: Enum_WASBLIPModelLoader_Blip_model,
    Enum_WASBlendLatents_Operation: Enum_WASBlendLatents_Operation,
    Enum_WASCheckpointLoader_Config_name: Enum_WASCheckpointLoader_Config_name,
    Enum_WASCheckpointLoader_Ckpt_name: Enum_WASCheckpointLoader_Ckpt_name,
    Enum_WASCheckpointLoaderSimple_Ckpt_name: Enum_WASCheckpointLoaderSimple_Ckpt_name,
    Enum_WASCLIPTextEncodeNSP_Mode: Enum_WASCLIPTextEncodeNSP_Mode,
    Enum_WASConstantNumber_Number_type: Enum_WASConstantNumber_Number_type,
    Enum_WASCreateGridImage_Include_subfolders: Enum_WASCreateGridImage_Include_subfolders,
    Enum_WASCreateMorphImage_Filetype: Enum_WASCreateMorphImage_Filetype,
    Enum_WASCreateMorphImageFromPath_Filetype: Enum_WASCreateMorphImageFromPath_Filetype,
    Enum_WASCreateVideoFromPath_Codec: Enum_WASCreateVideoFromPath_Codec,
    Enum_WASDiffusersModelLoader_Model_path: Enum_WASDiffusersModelLoader_Model_path,
    Enum_WASExportAPI_Save_prompt_api: Enum_WASExportAPI_Save_prompt_api,
    Enum_WASLoraLoader_Lora_name: Enum_WASLoraLoader_Lora_name,
    Enum_WASImageSSAOAmbientOcclusion_Enable_specular_masking: Enum_WASImageSSAOAmbientOcclusion_Enable_specular_masking,
    Enum_WASImageSSDODirectOcclusion_Colored_occlusion: Enum_WASImageSSDODirectOcclusion_Colored_occlusion,
    Enum_WASImageAnalyze_Mode: Enum_WASImageAnalyze_Mode,
    Enum_WASImageBlendingMode_Mode: Enum_WASImageBlendingMode_Mode,
    Enum_WASImageCannyFilter_Enable_threshold: Enum_WASImageCannyFilter_Enable_threshold,
    Enum_WASImageColorPalette_Mode: Enum_WASImageColorPalette_Mode,
    Enum_WASImageCropFace_Cascade_xml: Enum_WASImageCropFace_Cascade_xml,
    Enum_WASImagePixelate_Init_mode: Enum_WASImagePixelate_Init_mode,
    Enum_WASImagePixelate_Dither: Enum_WASImagePixelate_Dither,
    Enum_WASImagePixelate_Dither_mode: Enum_WASImagePixelate_Dither_mode,
    Enum_WASImagePixelate_Color_palette_mode: Enum_WASImagePixelate_Color_palette_mode,
    Enum_WASImagePixelate_Reverse_palette: Enum_WASImagePixelate_Reverse_palette,
    Enum_WASImagePowerNoise_Noise_type: Enum_WASImagePowerNoise_Noise_type,
    Enum_WASImageDraganPhotographyFilter_Colorize: Enum_WASImageDraganPhotographyFilter_Colorize,
    Enum_WASImageEdgeDetectionFilter_Mode: Enum_WASImageEdgeDetectionFilter_Mode,
    Enum_WASImageFilterAdjustments_Detail_enhance: Enum_WASImageFilterAdjustments_Detail_enhance,
    Enum_WASImageFlip_Mode: Enum_WASImageFlip_Mode,
    Enum_WASImageGradientMap_Flip_left_right: Enum_WASImageGradientMap_Flip_left_right,
    Enum_WASImageGenerateGradient_Direction: Enum_WASImageGenerateGradient_Direction,
    Enum_WASImageHighPassFilter_Color_output: Enum_WASImageHighPassFilter_Color_output,
    Enum_WASImageHighPassFilter_Neutral_background: Enum_WASImageHighPassFilter_Neutral_background,
    Enum_WASImageHistoryLoader_Image: Enum_WASImageHistoryLoader_Image,
    Enum_WASImageLoad_RGBA: Enum_WASImageLoad_RGBA,
    Enum_WASImageLoad_Filename_text_extension: Enum_WASImageLoad_Filename_text_extension,
    Enum_WASImageMonitorEffectsFilter_Mode: Enum_WASImageMonitorEffectsFilter_Mode,
    Enum_WASImagePadding_Feather_second_pass: Enum_WASImagePadding_Feather_second_pass,
    Enum_WASImageRembgRemoveBackground_Model: Enum_WASImageRembgRemoveBackground_Model,
    Enum_WASImageRembgRemoveBackground_Background_color: Enum_WASImageRembgRemoveBackground_Background_color,
    Enum_WASImageRemoveBackgroundAlpha_Mode: Enum_WASImageRemoveBackgroundAlpha_Mode,
    Enum_WASImageResize_Mode: Enum_WASImageResize_Mode,
    Enum_WASImageResize_Supersample: Enum_WASImageResize_Supersample,
    Enum_WASImageResize_Resampling: Enum_WASImageResize_Resampling,
    Enum_WASImageRotate_Mode: Enum_WASImageRotate_Mode,
    Enum_WASImageRotate_Sampler: Enum_WASImageRotate_Sampler,
    Enum_WASImageSave_Filename_number_start: Enum_WASImageSave_Filename_number_start,
    Enum_WASImageSave_Extension: Enum_WASImageSave_Extension,
    Enum_WASImageSave_Lossless_webp: Enum_WASImageSave_Lossless_webp,
    Enum_WASImageSave_Overwrite_mode: Enum_WASImageSave_Overwrite_mode,
    Enum_WASImageSave_Show_history: Enum_WASImageSave_Show_history,
    Enum_WASImageSave_Show_history_by_prefix: Enum_WASImageSave_Show_history_by_prefix,
    Enum_WASImageSave_Embed_workflow: Enum_WASImageSave_Embed_workflow,
    Enum_WASImageSave_Show_previews: Enum_WASImageSave_Show_previews,
    Enum_WASImageSeamlessTexture_Tiled: Enum_WASImageSeamlessTexture_Tiled,
    Enum_WASImageSelectChannel_Channel: Enum_WASImageSelectChannel_Channel,
    Enum_WASImageStitch_Stitch: Enum_WASImageStitch_Stitch,
    Enum_WASImageStyleFilter_Style: Enum_WASImageStyleFilter_Style,
    Enum_WASImageFDOFFilter_Mode: Enum_WASImageFDOFFilter_Mode,
    Enum_WASImageToLatentMask_Channel: Enum_WASImageToLatentMask_Channel,
    Enum_WASImageToNoise_Output_mode: Enum_WASImageToNoise_Output_mode,
    Enum_WASImageVoronoiNoiseFilter_Flat: Enum_WASImageVoronoiNoiseFilter_Flat,
    Enum_WASImageVoronoiNoiseFilter_RGB_output: Enum_WASImageVoronoiNoiseFilter_RGB_output,
    Enum_WASKSamplerWAS_Sampler_name: Enum_WASKSamplerWAS_Sampler_name,
    Enum_WASKSamplerWAS_Scheduler: Enum_WASKSamplerWAS_Scheduler,
    Enum_WASKSamplerCycle_Sampler_name: Enum_WASKSamplerCycle_Sampler_name,
    Enum_WASKSamplerCycle_Scheduler: Enum_WASKSamplerCycle_Scheduler,
    Enum_WASKSamplerCycle_Tiled_vae: Enum_WASKSamplerCycle_Tiled_vae,
    Enum_WASKSamplerCycle_Latent_upscale: Enum_WASKSamplerCycle_Latent_upscale,
    Enum_WASKSamplerCycle_Scale_denoise: Enum_WASKSamplerCycle_Scale_denoise,
    Enum_WASKSamplerCycle_Scale_sampling: Enum_WASKSamplerCycle_Scale_sampling,
    Enum_WASKSamplerCycle_Pos_add_mode: Enum_WASKSamplerCycle_Pos_add_mode,
    Enum_WASKSamplerCycle_Pos_add_strength_scaling: Enum_WASKSamplerCycle_Pos_add_strength_scaling,
    Enum_WASKSamplerCycle_Neg_add_mode: Enum_WASKSamplerCycle_Neg_add_mode,
    Enum_WASKSamplerCycle_Neg_add_strength_scaling: Enum_WASKSamplerCycle_Neg_add_strength_scaling,
    Enum_WASKSamplerCycle_Steps_scaling: Enum_WASKSamplerCycle_Steps_scaling,
    Enum_WASKSamplerCycle_Steps_control: Enum_WASKSamplerCycle_Steps_control,
    Enum_WASLatentUpscaleByFactorWAS_Mode: Enum_WASLatentUpscaleByFactorWAS_Mode,
    Enum_WASLatentUpscaleByFactorWAS_Align: Enum_WASLatentUpscaleByFactorWAS_Align,
    Enum_WASLoadImageBatch_Mode: Enum_WASLoadImageBatch_Mode,
    Enum_WASLoadImageBatch_Allow_RGBA_output: Enum_WASLoadImageBatch_Allow_RGBA_output,
    Enum_WASLoadImageBatch_Filename_text_extension: Enum_WASLoadImageBatch_Filename_text_extension,
    Enum_WASLoadLora_Lora_name: Enum_WASLoadLora_Lora_name,
    Enum_WASMaskCropRegion_Region_type: Enum_WASMaskCropRegion_Region_type,
    Enum_WASMiDaSModelLoader_Midas_model: Enum_WASMiDaSModelLoader_Midas_model,
    Enum_WASMiDaSDepthApproximation_Use_cpu: Enum_WASMiDaSDepthApproximation_Use_cpu,
    Enum_WASMiDaSDepthApproximation_Midas_type: Enum_WASMiDaSDepthApproximation_Midas_type,
    Enum_WASMiDaSDepthApproximation_Invert_depth: Enum_WASMiDaSDepthApproximation_Invert_depth,
    Enum_WASMiDaSMaskImage_Use_cpu: Enum_WASMiDaSMaskImage_Use_cpu,
    Enum_WASMiDaSMaskImage_Midas_model: Enum_WASMiDaSMaskImage_Midas_model,
    Enum_WASMiDaSMaskImage_Remove: Enum_WASMiDaSMaskImage_Remove,
    Enum_WASMiDaSMaskImage_Threshold: Enum_WASMiDaSMaskImage_Threshold,
    Enum_WASNumberCounter_Number_type: Enum_WASNumberCounter_Number_type,
    Enum_WASNumberCounter_Mode: Enum_WASNumberCounter_Mode,
    Enum_WASNumberOperation_Operation: Enum_WASNumberOperation_Operation,
    Enum_WASNumberInputCondition_Return_boolean: Enum_WASNumberInputCondition_Return_boolean,
    Enum_WASNumberInputCondition_Comparison: Enum_WASNumberInputCondition_Comparison,
    Enum_WASPromptStylesSelector_Style: Enum_WASPromptStylesSelector_Style,
    Enum_WASPromptMultipleStylesSelector_Style1: Enum_WASPromptMultipleStylesSelector_Style1,
    Enum_WASPromptMultipleStylesSelector_Style2: Enum_WASPromptMultipleStylesSelector_Style2,
    Enum_WASPromptMultipleStylesSelector_Style3: Enum_WASPromptMultipleStylesSelector_Style3,
    Enum_WASPromptMultipleStylesSelector_Style4: Enum_WASPromptMultipleStylesSelector_Style4,
    Enum_WASRandomNumber_Number_type: Enum_WASRandomNumber_Number_type,
    Enum_WASBLIPAnalyzeImage_Mode: Enum_WASBLIPAnalyzeImage_Mode,
    Enum_WASSAMModelLoader_Model_size: Enum_WASSAMModelLoader_Model_size,
    Enum_WASTextAddTokens_Print_current_tokens: Enum_WASTextAddTokens_Print_current_tokens,
    Enum_WASTextAddTokenByInput_Print_current_tokens: Enum_WASTextAddTokenByInput_Print_current_tokens,
    Enum_WASTextCompare_Mode: Enum_WASTextCompare_Mode,
    Enum_WASTextConcatenate_Linebreak_addition: Enum_WASTextConcatenate_Linebreak_addition,
    Enum_WASTextFileHistoryLoader_File: Enum_WASTextFileHistoryLoader_File,
    Enum_WASTextLoadLineFromFile_Mode: Enum_WASTextLoadLineFromFile_Mode,
    Enum_WASTextParseNoodleSoupPrompts_Mode: Enum_WASTextParseNoodleSoupPrompts_Mode,
    Enum_WASTextStringTruncate_Truncate_by: Enum_WASTextStringTruncate_Truncate_by,
    Enum_WASTextStringTruncate_Truncate_from: Enum_WASTextStringTruncate_Truncate_from,
    Enum_WASTrueRandomOrgNumberGenerator_Mode: Enum_WASTrueRandomOrgNumberGenerator_Mode,
    Enum_WASUnCLIPCheckpointLoader_Ckpt_name: Enum_WASUnCLIPCheckpointLoader_Ckpt_name,
    Enum_WASUpscaleModelLoader_Model_name: Enum_WASUpscaleModelLoader_Model_name,
    Enum_WASWriteToVideo_Codec: Enum_WASWriteToVideo_Codec,
    Enum_WASVideoDumpFrames_Extension: Enum_WASVideoDumpFrames_Extension,
    KSampler: KSampler,
    CheckpointLoaderSimple: CheckpointLoaderSimple,
    CLIPTextEncode: CLIPTextEncode,
    CLIPSetLastLayer: CLIPSetLastLayer,
    VAEDecode: VAEDecode,
    VAEEncode: VAEEncode,
    VAEEncodeForInpaint: VAEEncodeForInpaint,
    VAELoader: VAELoader,
    EmptyLatentImage: EmptyLatentImage,
    LatentUpscale: LatentUpscale,
    LatentUpscaleBy: LatentUpscaleBy,
    LatentFromBatch: LatentFromBatch,
    RepeatLatentBatch: RepeatLatentBatch,
    SaveImage: SaveImage,
    PreviewImage: PreviewImage,
    LoadImage: LoadImage,
    LoadImageMask: LoadImageMask,
    ImageScale: ImageScale,
    ImageScaleBy: ImageScaleBy,
    ImageInvert: ImageInvert,
    ImageBatch: ImageBatch,
    ImagePadForOutpaint: ImagePadForOutpaint,
    EmptyImage: EmptyImage,
    ConditioningAverage: ConditioningAverage,
    ConditioningCombine: ConditioningCombine,
    ConditioningConcat: ConditioningConcat,
    ConditioningSetArea: ConditioningSetArea,
    ConditioningSetAreaPercentage: ConditioningSetAreaPercentage,
    ConditioningSetMask: ConditioningSetMask,
    KSamplerAdvanced: KSamplerAdvanced,
    SetLatentNoiseMask: SetLatentNoiseMask,
    LatentComposite: LatentComposite,
    LatentBlend: LatentBlend,
    LatentRotate: LatentRotate,
    LatentFlip: LatentFlip,
    LatentCrop: LatentCrop,
    LoraLoader: LoraLoader,
    CLIPLoader: CLIPLoader,
    UNETLoader: UNETLoader,
    DualCLIPLoader: DualCLIPLoader,
    CLIPVisionEncode: CLIPVisionEncode,
    StyleModelApply: StyleModelApply,
    UnCLIPConditioning: UnCLIPConditioning,
    ControlNetApply: ControlNetApply,
    ControlNetApplyAdvanced: ControlNetApplyAdvanced,
    ControlNetLoader: ControlNetLoader,
    DiffControlNetLoader: DiffControlNetLoader,
    StyleModelLoader: StyleModelLoader,
    CLIPVisionLoader: CLIPVisionLoader,
    VAEDecodeTiled: VAEDecodeTiled,
    VAEEncodeTiled: VAEEncodeTiled,
    UnCLIPCheckpointLoader: UnCLIPCheckpointLoader,
    GLIGENLoader: GLIGENLoader,
    GLIGENTextBoxApply: GLIGENTextBoxApply,
    CheckpointLoader: CheckpointLoader,
    DiffusersLoader: DiffusersLoader,
    LoadLatent: LoadLatent,
    SaveLatent: SaveLatent,
    ConditioningZeroOut: ConditioningZeroOut,
    ConditioningSetTimestepRange: ConditioningSetTimestepRange,
    LatentAdd: LatentAdd,
    LatentSubtract: LatentSubtract,
    LatentMultiply: LatentMultiply,
    HypernetworkLoader: HypernetworkLoader,
    UpscaleModelLoader: UpscaleModelLoader,
    ImageUpscaleWithModel: ImageUpscaleWithModel,
    ImageBlend: ImageBlend,
    ImageBlur: ImageBlur,
    ImageQuantize: ImageQuantize,
    ImageSharpen: ImageSharpen,
    ImageScaleToTotalPixels: ImageScaleToTotalPixels,
    LatentCompositeMasked: LatentCompositeMasked,
    ImageCompositeMasked: ImageCompositeMasked,
    MaskToImage: MaskToImage,
    ImageToMask: ImageToMask,
    ImageColorToMask: ImageColorToMask,
    SolidMask: SolidMask,
    InvertMask: InvertMask,
    CropMask: CropMask,
    MaskComposite: MaskComposite,
    FeatherMask: FeatherMask,
    GrowMask: GrowMask,
    RebatchLatents: RebatchLatents,
    ModelMergeSimple: ModelMergeSimple,
    ModelMergeBlocks: ModelMergeBlocks,
    ModelMergeSubtract: ModelMergeSubtract,
    ModelMergeAdd: ModelMergeAdd,
    CheckpointSave: CheckpointSave,
    CLIPMergeSimple: CLIPMergeSimple,
    TomePatchModel: TomePatchModel,
    CLIPTextEncodeSDXLRefiner: CLIPTextEncodeSDXLRefiner,
    CLIPTextEncodeSDXL: CLIPTextEncodeSDXL,
    Canny: Canny,
    FreeU: FreeU,
    RemoveImageBackgroundAbg: RemoveImageBackgroundAbg,
    CivitAI_Lora_Loader: CivitAI_Lora_Loader,
    CivitAI_Checkpoint_Loader: CivitAI_Checkpoint_Loader,
    ImpactSAMLoader: ImpactSAMLoader,
    ImpactCLIPSegDetectorProvider: ImpactCLIPSegDetectorProvider,
    ImpactONNXDetectorProvider: ImpactONNXDetectorProvider,
    ImpactBitwiseAndMaskForEach: ImpactBitwiseAndMaskForEach,
    ImpactSubtractMaskForEach: ImpactSubtractMaskForEach,
    ImpactDetailerForEach: ImpactDetailerForEach,
    ImpactDetailerForEachDebug: ImpactDetailerForEachDebug,
    ImpactDetailerForEachPipe: ImpactDetailerForEachPipe,
    ImpactDetailerForEachDebugPipe: ImpactDetailerForEachDebugPipe,
    ImpactSAMDetectorCombined: ImpactSAMDetectorCombined,
    ImpactSAMDetectorSegmented: ImpactSAMDetectorSegmented,
    ImpactFaceDetailer: ImpactFaceDetailer,
    ImpactFaceDetailerPipe: ImpactFaceDetailerPipe,
    ImpactToDetailerPipe: ImpactToDetailerPipe,
    ImpactToDetailerPipeSDXL: ImpactToDetailerPipeSDXL,
    ImpactFromDetailerPipe: ImpactFromDetailerPipe,
    ImpactFromDetailerPipe_v2: ImpactFromDetailerPipe_v2,
    ImpactFromDetailerPipeSDXL: ImpactFromDetailerPipeSDXL,
    ImpactToBasicPipe: ImpactToBasicPipe,
    ImpactFromBasicPipe: ImpactFromBasicPipe,
    ImpactFromBasicPipe_v2: ImpactFromBasicPipe_v2,
    ImpactBasicPipeToDetailerPipe: ImpactBasicPipeToDetailerPipe,
    ImpactBasicPipeToDetailerPipeSDXL: ImpactBasicPipeToDetailerPipeSDXL,
    ImpactDetailerPipeToBasicPipe: ImpactDetailerPipeToBasicPipe,
    ImpactEditBasicPipe: ImpactEditBasicPipe,
    ImpactEditDetailerPipe: ImpactEditDetailerPipe,
    ImpactEditDetailerPipeSDXL: ImpactEditDetailerPipeSDXL,
    ImpactLatentPixelScale: ImpactLatentPixelScale,
    ImpactPixelKSampleUpscalerProvider: ImpactPixelKSampleUpscalerProvider,
    ImpactPixelKSampleUpscalerProviderPipe: ImpactPixelKSampleUpscalerProviderPipe,
    ImpactIterativeLatentUpscale: ImpactIterativeLatentUpscale,
    ImpactIterativeImageUpscale: ImpactIterativeImageUpscale,
    ImpactPixelTiledKSampleUpscalerProvider: ImpactPixelTiledKSampleUpscalerProvider,
    ImpactPixelTiledKSampleUpscalerProviderPipe: ImpactPixelTiledKSampleUpscalerProviderPipe,
    ImpactTwoSamplersForMaskUpscalerProvider: ImpactTwoSamplersForMaskUpscalerProvider,
    ImpactTwoSamplersForMaskUpscalerProviderPipe: ImpactTwoSamplersForMaskUpscalerProviderPipe,
    ImpactPixelKSampleHookCombine: ImpactPixelKSampleHookCombine,
    ImpactDenoiseScheduleHookProvider: ImpactDenoiseScheduleHookProvider,
    ImpactCfgScheduleHookProvider: ImpactCfgScheduleHookProvider,
    ImpactNoiseInjectionHookProvider: ImpactNoiseInjectionHookProvider,
    ImpactNoiseInjectionDetailerHookProvider: ImpactNoiseInjectionDetailerHookProvider,
    ImpactBitwiseAndMask: ImpactBitwiseAndMask,
    ImpactSubtractMask: ImpactSubtractMask,
    ImpactAddMask: ImpactAddMask,
    ImpactSegsMask: ImpactSegsMask,
    ImpactSegsMaskForEach: ImpactSegsMaskForEach,
    ImpactEmptySegs: ImpactEmptySegs,
    ImpactMediaPipeFaceMeshToSEGS: ImpactMediaPipeFaceMeshToSEGS,
    ImpactMaskToSEGS: ImpactMaskToSEGS,
    ImpactToBinaryMask: ImpactToBinaryMask,
    ImpactMasksToMaskList: ImpactMasksToMaskList,
    ImpactMaskListToMaskBatch: ImpactMaskListToMaskBatch,
    ImpactBboxDetectorSEGS: ImpactBboxDetectorSEGS,
    ImpactSegmDetectorSEGS: ImpactSegmDetectorSEGS,
    ImpactONNXDetectorSEGS: ImpactONNXDetectorSEGS,
    ImpactImpactSimpleDetectorSEGS: ImpactImpactSimpleDetectorSEGS,
    ImpactImpactSimpleDetectorSEGSPipe: ImpactImpactSimpleDetectorSEGSPipe,
    ImpactImpactControlNetApplySEGS: ImpactImpactControlNetApplySEGS,
    ImpactImpactDecomposeSEGS: ImpactImpactDecomposeSEGS,
    ImpactImpactAssembleSEGS: ImpactImpactAssembleSEGS,
    ImpactImpactFrom_SEG_ELT: ImpactImpactFrom_SEG_ELT,
    ImpactImpactEdit_SEG_ELT: ImpactImpactEdit_SEG_ELT,
    ImpactImpactDilate_Mask_SEG_ELT: ImpactImpactDilate_Mask_SEG_ELT,
    ImpactImpactDilateMask: ImpactImpactDilateMask,
    ImpactImpactScaleBy_BBOX_SEG_ELT: ImpactImpactScaleBy_BBOX_SEG_ELT,
    ImpactBboxDetectorCombined_v2: ImpactBboxDetectorCombined_v2,
    ImpactSegmDetectorCombined_v2: ImpactSegmDetectorCombined_v2,
    ImpactSegsToCombinedMask: ImpactSegsToCombinedMask,
    ImpactKSamplerProvider: ImpactKSamplerProvider,
    ImpactTwoSamplersForMask: ImpactTwoSamplersForMask,
    ImpactTiledKSamplerProvider: ImpactTiledKSamplerProvider,
    ImpactKSamplerAdvancedProvider: ImpactKSamplerAdvancedProvider,
    ImpactTwoAdvancedSamplersForMask: ImpactTwoAdvancedSamplersForMask,
    ImpactPreviewBridge: ImpactPreviewBridge,
    ImpactImageSender: ImpactImageSender,
    ImpactImageReceiver: ImpactImageReceiver,
    ImpactLatentSender: ImpactLatentSender,
    ImpactLatentReceiver: ImpactLatentReceiver,
    ImpactImageMaskSwitch: ImpactImageMaskSwitch,
    ImpactLatentSwitch: ImpactLatentSwitch,
    ImpactSEGSSwitch: ImpactSEGSSwitch,
    ImpactImpactSwitch: ImpactImpactSwitch,
    ImpactImpactInversedSwitch: ImpactImpactInversedSwitch,
    ImpactImpactWildcardProcessor: ImpactImpactWildcardProcessor,
    ImpactImpactWildcardEncode: ImpactImpactWildcardEncode,
    ImpactSEGSDetailer: ImpactSEGSDetailer,
    ImpactSEGSPaste: ImpactSEGSPaste,
    ImpactSEGSPreview: ImpactSEGSPreview,
    ImpactSEGSToImageList: ImpactSEGSToImageList,
    ImpactImpactSEGSToMaskList: ImpactImpactSEGSToMaskList,
    ImpactImpactSEGSToMaskBatch: ImpactImpactSEGSToMaskBatch,
    ImpactImpactSEGSConcat: ImpactImpactSEGSConcat,
    ImpactKSamplerBasicPipe: ImpactKSamplerBasicPipe,
    ImpactKSamplerAdvancedBasicPipe: ImpactKSamplerAdvancedBasicPipe,
    ImpactReencodeLatent: ImpactReencodeLatent,
    ImpactReencodeLatentPipe: ImpactReencodeLatentPipe,
    ImpactImpactImageBatchToImageList: ImpactImpactImageBatchToImageList,
    ImpactImpactMakeImageList: ImpactImpactMakeImageList,
    ImpactRegionalSampler: ImpactRegionalSampler,
    ImpactCombineRegionalPrompts: ImpactCombineRegionalPrompts,
    ImpactRegionalPrompt: ImpactRegionalPrompt,
    ImpactImpactSEGSLabelFilter: ImpactImpactSEGSLabelFilter,
    ImpactImpactSEGSRangeFilter: ImpactImpactSEGSRangeFilter,
    ImpactImpactSEGSOrderedFilter: ImpactImpactSEGSOrderedFilter,
    ImpactImpactCompare: ImpactImpactCompare,
    ImpactImpactConditionalBranch: ImpactImpactConditionalBranch,
    ImpactImpactInt: ImpactImpactInt,
    ImpactImpactValueSender: ImpactImpactValueSender,
    ImpactImpactValueReceiver: ImpactImpactValueReceiver,
    ImpactImpactImageInfo: ImpactImpactImageInfo,
    ImpactImpactMinMax: ImpactImpactMinMax,
    ImpactImpactNeg: ImpactImpactNeg,
    ImpactImpactConditionalStopIteration: ImpactImpactConditionalStopIteration,
    ImpactImpactStringSelector: ImpactImpactStringSelector,
    ImpactRemoveNoiseMask: ImpactRemoveNoiseMask,
    ImpactImpactLogger: ImpactImpactLogger,
    ImpactImpactDummyInput: ImpactImpactDummyInput,
    ImpactUltralyticsDetectorProvider: ImpactUltralyticsDetectorProvider,
    XYInputLoraBlockWeightInspire: XYInputLoraBlockWeightInspire,
    LoraLoaderBlockWeightInspire: LoraLoaderBlockWeightInspire,
    LoraBlockInfoInspire: LoraBlockInfoInspire,
    OpenPose_Preprocessor_Provider_for_SEGSInspire: OpenPose_Preprocessor_Provider_for_SEGSInspire,
    DWPreprocessor_Provider_for_SEGSInspire: DWPreprocessor_Provider_for_SEGSInspire,
    MiDaS_DepthMap_Preprocessor_Provider_for_SEGSInspire: MiDaS_DepthMap_Preprocessor_Provider_for_SEGSInspire,
    LeRes_DepthMap_Preprocessor_Provider_for_SEGSInspire: LeRes_DepthMap_Preprocessor_Provider_for_SEGSInspire,
    Canny_Preprocessor_Provider_for_SEGSInspire: Canny_Preprocessor_Provider_for_SEGSInspire,
    MediaPipe_FaceMesh_Preprocessor_Provider_for_SEGSInspire: MediaPipe_FaceMesh_Preprocessor_Provider_for_SEGSInspire,
    MediaPipeFaceMeshDetectorProviderInspire: MediaPipeFaceMeshDetectorProviderInspire,
    HEDPreprocessor_Provider_for_SEGSInspire: HEDPreprocessor_Provider_for_SEGSInspire,
    FakeScribblePreprocessor_Provider_for_SEGSInspire: FakeScribblePreprocessor_Provider_for_SEGSInspire,
    KSamplerInspire: KSamplerInspire,
    LoadPromptsFromDirInspire: LoadPromptsFromDirInspire,
    UnzipPromptInspire: UnzipPromptInspire,
    ZipPromptInspire: ZipPromptInspire,
    PromptExtractorInspire: PromptExtractorInspire,
    GlobalSeedInspire: GlobalSeedInspire,
    BNK_TiledKSamplerAdvanced: BNK_TiledKSamplerAdvanced,
    BNK_TiledKSampler: BNK_TiledKSampler,
    KSamplerEfficient: KSamplerEfficient,
    KSamplerAdvEfficient: KSamplerAdvEfficient,
    KSamplerSDXLEff: KSamplerSDXLEff,
    EfficientLoader: EfficientLoader,
    EffLoaderSDXL: EffLoaderSDXL,
    LoRAStacker: LoRAStacker,
    ControlNetStacker: ControlNetStacker,
    ApplyControlNetStack: ApplyControlNetStack,
    UnpackSDXLTuple: UnpackSDXLTuple,
    PackSDXLTuple: PackSDXLTuple,
    XYPlot: XYPlot,
    XYInputSeedsBatch: XYInputSeedsBatch,
    XYInputAddReturnNoise: XYInputAddReturnNoise,
    XYInputSteps: XYInputSteps,
    XYInputCFGScale: XYInputCFGScale,
    XYInputSamplerScheduler: XYInputSamplerScheduler,
    XYInputDenoise: XYInputDenoise,
    XYInputVAE: XYInputVAE,
    XYInputPromptSR: XYInputPromptSR,
    XYInputAestheticScore: XYInputAestheticScore,
    XYInputRefinerOnOff: XYInputRefinerOnOff,
    XYInputCheckpoint: XYInputCheckpoint,
    XYInputClipSkip: XYInputClipSkip,
    XYInputLoRA: XYInputLoRA,
    XYInputLoRAPlot: XYInputLoRAPlot,
    XYInputLoRAStacks: XYInputLoRAStacks,
    XYInputControlNet: XYInputControlNet,
    XYInputControlNetPlot: XYInputControlNetPlot,
    XYInputManualXYEntry: XYInputManualXYEntry,
    ManualXYEntryInfo: ManualXYEntryInfo,
    JoinXYInputsOfSameType: JoinXYInputsOfSameType,
    ImageOverlay: ImageOverlay,
    HighResFixScript: HighResFixScript,
    EvaluateIntegers: EvaluateIntegers,
    EvaluateFloats: EvaluateFloats,
    EvaluateStrings: EvaluateStrings,
    SimpleEvalExamples: SimpleEvalExamples,
    LatentByRatio: LatentByRatio,
    MasqueradeMaskByText: MasqueradeMaskByText,
    MasqueradeMaskMorphology: MasqueradeMaskMorphology,
    MasqueradeCombineMasks: MasqueradeCombineMasks,
    MasqueradeUnaryMaskOp: MasqueradeUnaryMaskOp,
    MasqueradeUnaryImageOp: MasqueradeUnaryImageOp,
    MasqueradeBlur: MasqueradeBlur,
    MasqueradeImageToMask: MasqueradeImageToMask,
    MasqueradeMixImagesByMask: MasqueradeMixImagesByMask,
    MasqueradeMixColorByMask: MasqueradeMixColorByMask,
    MasqueradeMaskToRegion: MasqueradeMaskToRegion,
    MasqueradeCutByMask: MasqueradeCutByMask,
    MasqueradePasteByMask: MasqueradePasteByMask,
    MasqueradeGetImageSize: MasqueradeGetImageSize,
    MasqueradeChangeChannelCount: MasqueradeChangeChannelCount,
    MasqueradeConstantMask: MasqueradeConstantMask,
    MasqueradePruneByMask: MasqueradePruneByMask,
    MasqueradeSeparateMaskComponents: MasqueradeSeparateMaskComponents,
    MasqueradeCreateRectMask: MasqueradeCreateRectMask,
    MasqueradeMakeImageBatch: MasqueradeMakeImageBatch,
    MasqueradeCreateQRCode: MasqueradeCreateQRCode,
    MasqueradeConvertColorSpace: MasqueradeConvertColorSpace,
    MasqueradeMasqueradeIncrementer: MasqueradeMasqueradeIncrementer,
    ImageRemoveBackgroundRembg: ImageRemoveBackgroundRembg,
    SDXLMixSampler: SDXLMixSampler,
    WASBLIPModelLoader: WASBLIPModelLoader,
    WASBlendLatents: WASBlendLatents,
    WASCacheNode: WASCacheNode,
    WASCheckpointLoader: WASCheckpointLoader,
    WASCheckpointLoaderSimple: WASCheckpointLoaderSimple,
    WASCLIPTextEncodeNSP: WASCLIPTextEncodeNSP,
    WASCLIPInputSwitch: WASCLIPInputSwitch,
    WASCLIPVisionInputSwitch: WASCLIPVisionInputSwitch,
    WASConditioningInputSwitch: WASConditioningInputSwitch,
    WASConstantNumber: WASConstantNumber,
    WASCreateGridImage: WASCreateGridImage,
    WASCreateMorphImage: WASCreateMorphImage,
    WASCreateMorphImageFromPath: WASCreateMorphImageFromPath,
    WASCreateVideoFromPath: WASCreateVideoFromPath,
    WASCLIPSegMasking: WASCLIPSegMasking,
    WASCLIPSegModelLoader: WASCLIPSegModelLoader,
    WASCLIPSegBatchMasking: WASCLIPSegBatchMasking,
    WASConvertMasksToImages: WASConvertMasksToImages,
    WASControlNetModelInputSwitch: WASControlNetModelInputSwitch,
    WASDebugNumberToConsole: WASDebugNumberToConsole,
    WASDictionaryToConsole: WASDictionaryToConsole,
    WASDiffusersModelLoader: WASDiffusersModelLoader,
    WASDiffusersHubModelDownLoader: WASDiffusersHubModelDownLoader,
    WASExportAPI: WASExportAPI,
    WASLatentInputSwitch: WASLatentInputSwitch,
    WASLoadCache: WASLoadCache,
    WASLogicBoolean: WASLogicBoolean,
    WASLoraLoader: WASLoraLoader,
    WASImageSSAOAmbientOcclusion: WASImageSSAOAmbientOcclusion,
    WASImageSSDODirectOcclusion: WASImageSSDODirectOcclusion,
    WASImageAnalyze: WASImageAnalyze,
    WASImageAspectRatio: WASImageAspectRatio,
    WASImageBatch: WASImageBatch,
    WASImageBlank: WASImageBlank,
    WASImageBlendByMask: WASImageBlendByMask,
    WASImageBlend: WASImageBlend,
    WASImageBlendingMode: WASImageBlendingMode,
    WASImageBloomFilter: WASImageBloomFilter,
    WASImageCannyFilter: WASImageCannyFilter,
    WASImageChromaticAberration: WASImageChromaticAberration,
    WASImageColorPalette: WASImageColorPalette,
    WASImageCropFace: WASImageCropFace,
    WASImageCropLocation: WASImageCropLocation,
    WASImageCropSquareLocation: WASImageCropSquareLocation,
    WASImageDisplacementWarp: WASImageDisplacementWarp,
    WASImageLucySharpen: WASImageLucySharpen,
    WASImagePasteFace: WASImagePasteFace,
    WASImagePasteCrop: WASImagePasteCrop,
    WASImagePasteCropByLocation: WASImagePasteCropByLocation,
    WASImagePixelate: WASImagePixelate,
    WASImagePowerNoise: WASImagePowerNoise,
    WASImageDraganPhotographyFilter: WASImageDraganPhotographyFilter,
    WASImageEdgeDetectionFilter: WASImageEdgeDetectionFilter,
    WASImageFilmGrain: WASImageFilmGrain,
    WASImageFilterAdjustments: WASImageFilterAdjustments,
    WASImageFlip: WASImageFlip,
    WASImageGradientMap: WASImageGradientMap,
    WASImageGenerateGradient: WASImageGenerateGradient,
    WASImageHighPassFilter: WASImageHighPassFilter,
    WASImageHistoryLoader: WASImageHistoryLoader,
    WASImageInputSwitch: WASImageInputSwitch,
    WASImageLevelsAdjustment: WASImageLevelsAdjustment,
    WASImageLoad: WASImageLoad,
    WASImageMedianFilter: WASImageMedianFilter,
    WASImageMixRGBChannels: WASImageMixRGBChannels,
    WASImageMonitorEffectsFilter: WASImageMonitorEffectsFilter,
    WASImageNovaFilter: WASImageNovaFilter,
    WASImagePadding: WASImagePadding,
    WASImagePerlinNoise: WASImagePerlinNoise,
    WASImageRembgRemoveBackground: WASImageRembgRemoveBackground,
    WASImagePerlinPowerFractal: WASImagePerlinPowerFractal,
    WASImageRemoveBackgroundAlpha: WASImageRemoveBackgroundAlpha,
    WASImageRemoveColor: WASImageRemoveColor,
    WASImageResize: WASImageResize,
    WASImageRotate: WASImageRotate,
    WASImageRotateHue: WASImageRotateHue,
    WASImageSave: WASImageSave,
    WASImageSeamlessTexture: WASImageSeamlessTexture,
    WASImageSelectChannel: WASImageSelectChannel,
    WASImageSelectColor: WASImageSelectColor,
    WASImageShadowsAndHighlights: WASImageShadowsAndHighlights,
    WASImageSizeToNumber: WASImageSizeToNumber,
    WASImageStitch: WASImageStitch,
    WASImageStyleFilter: WASImageStyleFilter,
    WASImageThreshold: WASImageThreshold,
    WASImageTiled: WASImageTiled,
    WASImageTranspose: WASImageTranspose,
    WASImageFDOFFilter: WASImageFDOFFilter,
    WASImageToLatentMask: WASImageToLatentMask,
    WASImageToNoise: WASImageToNoise,
    WASImageToSeed: WASImageToSeed,
    WASImagesToRGB: WASImagesToRGB,
    WASImagesToLinear: WASImagesToLinear,
    WASIntegerPlaceCounter: WASIntegerPlaceCounter,
    WASImageVoronoiNoiseFilter: WASImageVoronoiNoiseFilter,
    WASKSamplerWAS: WASKSamplerWAS,
    WASKSamplerCycle: WASKSamplerCycle,
    WASLatentNoiseInjection: WASLatentNoiseInjection,
    WASLatentSizeToNumber: WASLatentSizeToNumber,
    WASLatentUpscaleByFactorWAS: WASLatentUpscaleByFactorWAS,
    WASLoadImageBatch: WASLoadImageBatch,
    WASLoadTextFile: WASLoadTextFile,
    WASLoadLora: WASLoadLora,
    WASMasksAdd: WASMasksAdd,
    WASMasksSubtract: WASMasksSubtract,
    WASMaskArbitraryRegion: WASMaskArbitraryRegion,
    WASMaskBatchToMask: WASMaskBatchToMask,
    WASMaskBatch: WASMaskBatch,
    WASMaskCeilingRegion: WASMaskCeilingRegion,
    WASMaskCropDominantRegion: WASMaskCropDominantRegion,
    WASMaskCropMinorityRegion: WASMaskCropMinorityRegion,
    WASMaskCropRegion: WASMaskCropRegion,
    WASMaskPasteRegion: WASMaskPasteRegion,
    WASMaskDilateRegion: WASMaskDilateRegion,
    WASMaskDominantRegion: WASMaskDominantRegion,
    WASMaskErodeRegion: WASMaskErodeRegion,
    WASMaskFillHoles: WASMaskFillHoles,
    WASMaskFloorRegion: WASMaskFloorRegion,
    WASMaskGaussianRegion: WASMaskGaussianRegion,
    WASMaskInvert: WASMaskInvert,
    WASMaskMinorityRegion: WASMaskMinorityRegion,
    WASMaskSmoothRegion: WASMaskSmoothRegion,
    WASMaskThresholdRegion: WASMaskThresholdRegion,
    WASMasksCombineRegions: WASMasksCombineRegions,
    WASMasksCombineBatch: WASMasksCombineBatch,
    WASMiDaSModelLoader: WASMiDaSModelLoader,
    WASMiDaSDepthApproximation: WASMiDaSDepthApproximation,
    WASMiDaSMaskImage: WASMiDaSMaskImage,
    WASModelInputSwitch: WASModelInputSwitch,
    WASNumberCounter: WASNumberCounter,
    WASNumberOperation: WASNumberOperation,
    WASNumberToFloat: WASNumberToFloat,
    WASNumberInputSwitch: WASNumberInputSwitch,
    WASNumberInputCondition: WASNumberInputCondition,
    WASNumberMultipleOf: WASNumberMultipleOf,
    WASNumberPI: WASNumberPI,
    WASNumberToInt: WASNumberToInt,
    WASNumberToSeed: WASNumberToSeed,
    WASNumberToString: WASNumberToString,
    WASNumberToText: WASNumberToText,
    WASPromptStylesSelector: WASPromptStylesSelector,
    WASPromptMultipleStylesSelector: WASPromptMultipleStylesSelector,
    WASRandomNumber: WASRandomNumber,
    WASSaveTextFile: WASSaveTextFile,
    WASSeed: WASSeed,
    WASTensorBatchToImage: WASTensorBatchToImage,
    WASBLIPAnalyzeImage: WASBLIPAnalyzeImage,
    WASSAMModelLoader: WASSAMModelLoader,
    WASSAMParameters: WASSAMParameters,
    WASSAMParametersCombine: WASSAMParametersCombine,
    WASSAMImageMask: WASSAMImageMask,
    WASSamplesPassthroughStatSystem: WASSamplesPassthroughStatSystem,
    WASStringToText: WASStringToText,
    WASImageBounds: WASImageBounds,
    WASInsetImageBounds: WASInsetImageBounds,
    WASBoundedImageBlend: WASBoundedImageBlend,
    WASBoundedImageBlendWithMask: WASBoundedImageBlendWithMask,
    WASBoundedImageCrop: WASBoundedImageCrop,
    WASBoundedImageCropWithMask: WASBoundedImageCropWithMask,
    WASTextDictionaryUpdate: WASTextDictionaryUpdate,
    WASTextAddTokens: WASTextAddTokens,
    WASTextAddTokenByInput: WASTextAddTokenByInput,
    WASTextCompare: WASTextCompare,
    WASTextConcatenate: WASTextConcatenate,
    WASTextFileHistoryLoader: WASTextFileHistoryLoader,
    WASTextFindAndReplaceByDictionary: WASTextFindAndReplaceByDictionary,
    WASTextFindAndReplaceInput: WASTextFindAndReplaceInput,
    WASTextFindAndReplace: WASTextFindAndReplace,
    WASTextInputSwitch: WASTextInputSwitch,
    WASTextList: WASTextList,
    WASTextListConcatenate: WASTextListConcatenate,
    WASTextLoadLineFromFile: WASTextLoadLineFromFile,
    WASTextMultiline: WASTextMultiline,
    WASTextParseA1111Embeddings: WASTextParseA1111Embeddings,
    WASTextParseNoodleSoupPrompts: WASTextParseNoodleSoupPrompts,
    WASTextParseTokens: WASTextParseTokens,
    WASTextRandomLine: WASTextRandomLine,
    WASTextRandomPrompt: WASTextRandomPrompt,
    WASTextString: WASTextString,
    WASTextShuffle: WASTextShuffle,
    WASTextToConditioning: WASTextToConditioning,
    WASTextToConsole: WASTextToConsole,
    WASTextToNumber: WASTextToNumber,
    WASTextToString: WASTextToString,
    WASTextStringTruncate: WASTextStringTruncate,
    WASTrueRandomOrgNumberGenerator: WASTrueRandomOrgNumberGenerator,
    WASUnCLIPCheckpointLoader: WASUnCLIPCheckpointLoader,
    WASUpscaleModelLoader: WASUpscaleModelLoader,
    WASUpscaleModelSwitch: WASUpscaleModelSwitch,
    WASWriteToGIF: WASWriteToGIF,
    WASWriteToVideo: WASWriteToVideo,
    WASVAEInputSwitch: WASVAEInputSwitch,
    WASVideoDumpFrames: WASVideoDumpFrames,
}

// 2. Embeddings -------------------------------
export type Embeddings = 'EasyNegative' | 'bad-artist-anime' | 'bad-artist' | 'bad_prompt_version2' | 'badquality' | 'charturnerv2' | 'ng_deepnegative_v1_75t'

// 3. Suggestions -------------------------------
export interface CanProduce_number {}
export interface CanProduce_number {}
export interface CanProduce_number {}
export interface CanProduce_number {}
export interface CanProduce_string {}
export interface CanProduce_string {}
export interface CanProduce_string {}
export interface CanProduce_string {}
export interface CanProduce_LATENT extends Pick<ComfySetup, 'KSampler' | 'VAEEncode' | 'VAEEncodeForInpaint' | 'EmptyLatentImage' | 'LatentUpscale' | 'LatentUpscaleBy' | 'LatentFromBatch' | 'RepeatLatentBatch' | 'KSamplerAdvanced' | 'SetLatentNoiseMask' | 'LatentComposite' | 'LatentBlend' | 'LatentRotate' | 'LatentFlip' | 'LatentCrop' | 'VAEEncodeTiled' | 'LoadLatent' | 'LatentAdd' | 'LatentSubtract' | 'LatentMultiply' | 'LatentCompositeMasked' | 'RebatchLatents' | 'ImpactLatentPixelScale' | 'ImpactIterativeLatentUpscale' | 'ImpactTwoSamplersForMask' | 'ImpactTwoAdvancedSamplersForMask' | 'ImpactLatentReceiver' | 'ImpactKSamplerBasicPipe' | 'ImpactKSamplerAdvancedBasicPipe' | 'ImpactReencodeLatent' | 'ImpactReencodeLatentPipe' | 'ImpactRegionalSampler' | 'ImpactRemoveNoiseMask' | 'KSamplerInspire' | 'BNK_TiledKSamplerAdvanced' | 'BNK_TiledKSampler' | 'KSamplerEfficient' | 'KSamplerAdvEfficient' | 'KSamplerSDXLEff' | 'EfficientLoader' | 'EffLoaderSDXL' | 'LatentByRatio' | 'SDXLMixSampler' | 'WASBlendLatents' | 'WASLatentInputSwitch' | 'WASLoadCache' | 'WASKSamplerWAS' | 'WASKSamplerCycle' | 'WASLatentNoiseInjection' | 'WASLatentUpscaleByFactorWAS' | 'WASSamplesPassthroughStatSystem'> { }
export interface CanProduce_MODEL extends Pick<ComfySetup, 'CheckpointLoaderSimple' | 'LoraLoader' | 'UNETLoader' | 'UnCLIPCheckpointLoader' | 'CheckpointLoader' | 'DiffusersLoader' | 'HypernetworkLoader' | 'ModelMergeSimple' | 'ModelMergeBlocks' | 'ModelMergeSubtract' | 'ModelMergeAdd' | 'TomePatchModel' | 'FreeU' | 'CivitAI_Lora_Loader' | 'CivitAI_Checkpoint_Loader' | 'ImpactFromDetailerPipe' | 'ImpactFromDetailerPipe_v2' | 'ImpactFromDetailerPipeSDXL' | 'ImpactFromDetailerPipeSDXL' | 'ImpactFromBasicPipe' | 'ImpactFromBasicPipe_v2' | 'ImpactImpactWildcardEncode' | 'LoraLoaderBlockWeightInspire' | 'KSamplerEfficient' | 'KSamplerAdvEfficient' | 'EfficientLoader' | 'UnpackSDXLTuple' | 'UnpackSDXLTuple' | 'WASCheckpointLoader' | 'WASCheckpointLoaderSimple' | 'WASDiffusersModelLoader' | 'WASDiffusersHubModelDownLoader' | 'WASLoraLoader' | 'WASLoadLora' | 'WASModelInputSwitch' | 'WASUnCLIPCheckpointLoader'> { }
export interface CanProduce_CLIP extends Pick<ComfySetup, 'CheckpointLoaderSimple' | 'CLIPSetLastLayer' | 'LoraLoader' | 'CLIPLoader' | 'DualCLIPLoader' | 'UnCLIPCheckpointLoader' | 'CheckpointLoader' | 'DiffusersLoader' | 'CLIPMergeSimple' | 'CivitAI_Lora_Loader' | 'CivitAI_Checkpoint_Loader' | 'ImpactFromDetailerPipe' | 'ImpactFromDetailerPipe_v2' | 'ImpactFromDetailerPipeSDXL' | 'ImpactFromDetailerPipeSDXL' | 'ImpactFromBasicPipe' | 'ImpactFromBasicPipe_v2' | 'ImpactImpactWildcardEncode' | 'LoraLoaderBlockWeightInspire' | 'EfficientLoader' | 'UnpackSDXLTuple' | 'UnpackSDXLTuple' | 'WASCheckpointLoader' | 'WASCheckpointLoaderSimple' | 'WASCLIPInputSwitch' | 'WASDiffusersModelLoader' | 'WASDiffusersHubModelDownLoader' | 'WASLoraLoader' | 'WASLoadLora' | 'WASUnCLIPCheckpointLoader'> { }
export interface CanProduce_VAE extends Pick<ComfySetup, 'CheckpointLoaderSimple' | 'VAELoader' | 'UnCLIPCheckpointLoader' | 'CheckpointLoader' | 'DiffusersLoader' | 'CivitAI_Checkpoint_Loader' | 'ImpactFromDetailerPipe' | 'ImpactFromDetailerPipe_v2' | 'ImpactFromDetailerPipeSDXL' | 'ImpactFromBasicPipe' | 'ImpactFromBasicPipe_v2' | 'ImpactKSamplerBasicPipe' | 'ImpactKSamplerAdvancedBasicPipe' | 'KSamplerEfficient' | 'KSamplerAdvEfficient' | 'KSamplerSDXLEff' | 'EfficientLoader' | 'EffLoaderSDXL' | 'WASCheckpointLoader' | 'WASCheckpointLoaderSimple' | 'WASDiffusersModelLoader' | 'WASDiffusersHubModelDownLoader' | 'WASUnCLIPCheckpointLoader' | 'WASVAEInputSwitch'> { }
export interface CanProduce_CONDITIONING extends Pick<ComfySetup, 'CLIPTextEncode' | 'ConditioningAverage' | 'ConditioningCombine' | 'ConditioningConcat' | 'ConditioningSetArea' | 'ConditioningSetAreaPercentage' | 'ConditioningSetMask' | 'StyleModelApply' | 'UnCLIPConditioning' | 'ControlNetApply' | 'ControlNetApplyAdvanced' | 'ControlNetApplyAdvanced' | 'GLIGENTextBoxApply' | 'ConditioningZeroOut' | 'ConditioningSetTimestepRange' | 'CLIPTextEncodeSDXLRefiner' | 'CLIPTextEncodeSDXL' | 'ImpactFromDetailerPipe' | 'ImpactFromDetailerPipe' | 'ImpactFromDetailerPipe_v2' | 'ImpactFromDetailerPipe_v2' | 'ImpactFromDetailerPipeSDXL' | 'ImpactFromDetailerPipeSDXL' | 'ImpactFromDetailerPipeSDXL' | 'ImpactFromDetailerPipeSDXL' | 'ImpactFromBasicPipe' | 'ImpactFromBasicPipe' | 'ImpactFromBasicPipe_v2' | 'ImpactFromBasicPipe_v2' | 'ImpactImpactWildcardEncode' | 'KSamplerEfficient' | 'KSamplerEfficient' | 'KSamplerAdvEfficient' | 'KSamplerAdvEfficient' | 'EfficientLoader' | 'EfficientLoader' | 'ApplyControlNetStack' | 'ApplyControlNetStack' | 'UnpackSDXLTuple' | 'UnpackSDXLTuple' | 'UnpackSDXLTuple' | 'UnpackSDXLTuple' | 'WASCLIPTextEncodeNSP' | 'WASConditioningInputSwitch' | 'WASLoadCache' | 'WASTextToConditioning'> { }
export interface CanProduce_IMAGE extends Pick<ComfySetup, 'VAEDecode' | 'LoadImage' | 'ImageScale' | 'ImageScaleBy' | 'ImageInvert' | 'ImageBatch' | 'ImagePadForOutpaint' | 'EmptyImage' | 'VAEDecodeTiled' | 'ImageUpscaleWithModel' | 'ImageBlend' | 'ImageBlur' | 'ImageQuantize' | 'ImageSharpen' | 'ImageScaleToTotalPixels' | 'ImageCompositeMasked' | 'MaskToImage' | 'Canny' | 'RemoveImageBackgroundAbg' | 'ImpactDetailerForEach' | 'ImpactDetailerForEachDebug' | 'ImpactDetailerForEachDebug' | 'ImpactDetailerForEachDebug' | 'ImpactDetailerForEachDebug' | 'ImpactDetailerForEachDebug' | 'ImpactDetailerForEachPipe' | 'ImpactDetailerForEachPipe' | 'ImpactDetailerForEachDebugPipe' | 'ImpactDetailerForEachDebugPipe' | 'ImpactDetailerForEachDebugPipe' | 'ImpactDetailerForEachDebugPipe' | 'ImpactDetailerForEachDebugPipe' | 'ImpactFaceDetailer' | 'ImpactFaceDetailer' | 'ImpactFaceDetailer' | 'ImpactFaceDetailer' | 'ImpactFaceDetailerPipe' | 'ImpactFaceDetailerPipe' | 'ImpactFaceDetailerPipe' | 'ImpactFaceDetailerPipe' | 'ImpactIterativeImageUpscale' | 'ImpactImpactFrom_SEG_ELT' | 'ImpactPreviewBridge' | 'ImpactImageReceiver' | 'ImpactImageMaskSwitch' | 'ImpactSEGSDetailer' | 'ImpactSEGSPaste' | 'ImpactSEGSToImageList' | 'ImpactImpactImageBatchToImageList' | 'ImpactImpactMakeImageList' | 'KSamplerEfficient' | 'KSamplerAdvEfficient' | 'KSamplerSDXLEff' | 'ImageOverlay' | 'MasqueradeMaskByText' | 'MasqueradeMaskByText' | 'MasqueradeMaskMorphology' | 'MasqueradeCombineMasks' | 'MasqueradeUnaryMaskOp' | 'MasqueradeUnaryImageOp' | 'MasqueradeBlur' | 'MasqueradeMixImagesByMask' | 'MasqueradeMixColorByMask' | 'MasqueradeMaskToRegion' | 'MasqueradeCutByMask' | 'MasqueradePasteByMask' | 'MasqueradeChangeChannelCount' | 'MasqueradeConstantMask' | 'MasqueradePruneByMask' | 'MasqueradeSeparateMaskComponents' | 'MasqueradeCreateRectMask' | 'MasqueradeMakeImageBatch' | 'MasqueradeCreateQRCode' | 'MasqueradeConvertColorSpace' | 'ImageRemoveBackgroundRembg' | 'WASCreateGridImage' | 'WASCreateMorphImage' | 'WASCreateMorphImage' | 'WASCLIPSegMasking' | 'WASCLIPSegBatchMasking' | 'WASCLIPSegBatchMasking' | 'WASConvertMasksToImages' | 'WASLoadCache' | 'WASImageSSAOAmbientOcclusion' | 'WASImageSSAOAmbientOcclusion' | 'WASImageSSAOAmbientOcclusion' | 'WASImageSSDODirectOcclusion' | 'WASImageSSDODirectOcclusion' | 'WASImageSSDODirectOcclusion' | 'WASImageSSDODirectOcclusion' | 'WASImageAnalyze' | 'WASImageBatch' | 'WASImageBlank' | 'WASImageBlendByMask' | 'WASImageBlend' | 'WASImageBlendingMode' | 'WASImageBloomFilter' | 'WASImageCannyFilter' | 'WASImageChromaticAberration' | 'WASImageColorPalette' | 'WASImageCropFace' | 'WASImageCropLocation' | 'WASImageCropSquareLocation' | 'WASImageDisplacementWarp' | 'WASImageLucySharpen' | 'WASImagePasteFace' | 'WASImagePasteFace' | 'WASImagePasteCrop' | 'WASImagePasteCrop' | 'WASImagePasteCropByLocation' | 'WASImagePasteCropByLocation' | 'WASImagePixelate' | 'WASImagePowerNoise' | 'WASImageDraganPhotographyFilter' | 'WASImageEdgeDetectionFilter' | 'WASImageFilmGrain' | 'WASImageFilterAdjustments' | 'WASImageFlip' | 'WASImageGradientMap' | 'WASImageGenerateGradient' | 'WASImageHighPassFilter' | 'WASImageHistoryLoader' | 'WASImageInputSwitch' | 'WASImageLevelsAdjustment' | 'WASImageLoad' | 'WASImageMedianFilter' | 'WASImageMixRGBChannels' | 'WASImageMonitorEffectsFilter' | 'WASImageNovaFilter' | 'WASImagePadding' | 'WASImagePadding' | 'WASImagePerlinNoise' | 'WASImageRembgRemoveBackground' | 'WASImagePerlinPowerFractal' | 'WASImageRemoveBackgroundAlpha' | 'WASImageRemoveColor' | 'WASImageResize' | 'WASImageRotate' | 'WASImageRotateHue' | 'WASImageSeamlessTexture' | 'WASImageSelectChannel' | 'WASImageSelectColor' | 'WASImageShadowsAndHighlights' | 'WASImageShadowsAndHighlights' | 'WASImageShadowsAndHighlights' | 'WASImageStitch' | 'WASImageStyleFilter' | 'WASImageThreshold' | 'WASImageTiled' | 'WASImageTranspose' | 'WASImageFDOFFilter' | 'WASImageToNoise' | 'WASImagesToRGB' | 'WASImagesToLinear' | 'WASImageVoronoiNoiseFilter' | 'WASLoadImageBatch' | 'WASMiDaSDepthApproximation' | 'WASMiDaSMaskImage' | 'WASMiDaSMaskImage' | 'WASTensorBatchToImage' | 'WASSAMImageMask' | 'WASBoundedImageBlend' | 'WASBoundedImageBlendWithMask' | 'WASBoundedImageCrop' | 'WASBoundedImageCropWithMask' | 'WASWriteToGIF' | 'WASWriteToVideo'> { }
export interface CanProduce_MASK extends Pick<ComfySetup, 'LoadImage' | 'LoadImageMask' | 'ImagePadForOutpaint' | 'ImageToMask' | 'ImageColorToMask' | 'SolidMask' | 'InvertMask' | 'CropMask' | 'MaskComposite' | 'FeatherMask' | 'GrowMask' | 'ImpactSAMDetectorCombined' | 'ImpactSAMDetectorSegmented' | 'ImpactFaceDetailer' | 'ImpactFaceDetailerPipe' | 'ImpactBitwiseAndMask' | 'ImpactSubtractMask' | 'ImpactAddMask' | 'ImpactToBinaryMask' | 'ImpactMasksToMaskList' | 'ImpactImpactFrom_SEG_ELT' | 'ImpactImpactDilateMask' | 'ImpactBboxDetectorCombined_v2' | 'ImpactSegmDetectorCombined_v2' | 'ImpactSegsToCombinedMask' | 'ImpactPreviewBridge' | 'ImpactImageReceiver' | 'ImpactImageMaskSwitch' | 'ImpactImpactSEGSToMaskList' | 'MasqueradeImageToMask' | 'WASCLIPSegMasking' | 'WASCLIPSegBatchMasking' | 'WASImageLoad' | 'WASImageToLatentMask' | 'WASMasksAdd' | 'WASMasksSubtract' | 'WASMaskArbitraryRegion' | 'WASMaskBatchToMask' | 'WASMaskBatch' | 'WASMaskCeilingRegion' | 'WASMaskCropDominantRegion' | 'WASMaskCropMinorityRegion' | 'WASMaskCropRegion' | 'WASMaskPasteRegion' | 'WASMaskPasteRegion' | 'WASMaskDilateRegion' | 'WASMaskDominantRegion' | 'WASMaskErodeRegion' | 'WASMaskFillHoles' | 'WASMaskFloorRegion' | 'WASMaskGaussianRegion' | 'WASMaskInvert' | 'WASMaskMinorityRegion' | 'WASMaskSmoothRegion' | 'WASMaskThresholdRegion' | 'WASMasksCombineRegions' | 'WASMasksCombineBatch' | 'WASSAMImageMask'> { }
export interface CanProduce_CLIP_VISION_OUTPUT extends Pick<ComfySetup, 'CLIPVisionEncode'> { }
export interface CanProduce_CONTROL_NET extends Pick<ComfySetup, 'ControlNetLoader' | 'DiffControlNetLoader' | 'WASControlNetModelInputSwitch'> { }
export interface CanProduce_STYLE_MODEL extends Pick<ComfySetup, 'StyleModelLoader'> { }
export interface CanProduce_CLIP_VISION extends Pick<ComfySetup, 'CLIPVisionLoader' | 'UnCLIPCheckpointLoader' | 'WASCLIPVisionInputSwitch' | 'WASUnCLIPCheckpointLoader'> { }
export interface CanProduce_GLIGEN extends Pick<ComfySetup, 'GLIGENLoader'> { }
export interface CanProduce_UPSCALE_MODEL extends Pick<ComfySetup, 'UpscaleModelLoader' | 'WASUpscaleModelLoader' | 'WASUpscaleModelSwitch'> { }
export interface CanProduce_SAM_MODEL extends Pick<ComfySetup, 'ImpactSAMLoader' | 'ImpactFromDetailerPipe' | 'ImpactFromDetailerPipe_v2' | 'ImpactFromDetailerPipeSDXL' | 'WASSAMModelLoader'> { }
export interface CanProduce_BBOX_DETECTOR extends Pick<ComfySetup, 'ImpactCLIPSegDetectorProvider' | 'ImpactFromDetailerPipe' | 'ImpactFromDetailerPipe_v2' | 'ImpactFromDetailerPipeSDXL' | 'ImpactUltralyticsDetectorProvider' | 'MediaPipeFaceMeshDetectorProviderInspire'> { }
export interface CanProduce_ONNX_DETECTOR extends Pick<ComfySetup, 'ImpactONNXDetectorProvider'> { }
export interface CanProduce_SEGS extends Pick<ComfySetup, 'ImpactBitwiseAndMaskForEach' | 'ImpactSubtractMaskForEach' | 'ImpactDetailerForEachPipe' | 'ImpactDetailerForEachDebugPipe' | 'ImpactSegsMask' | 'ImpactSegsMaskForEach' | 'ImpactEmptySegs' | 'ImpactMediaPipeFaceMeshToSEGS' | 'ImpactMaskToSEGS' | 'ImpactBboxDetectorSEGS' | 'ImpactSegmDetectorSEGS' | 'ImpactONNXDetectorSEGS' | 'ImpactImpactSimpleDetectorSEGS' | 'ImpactImpactSimpleDetectorSEGSPipe' | 'ImpactImpactControlNetApplySEGS' | 'ImpactImpactAssembleSEGS' | 'ImpactSEGSDetailer' | 'ImpactImpactSEGSConcat' | 'ImpactImpactSEGSLabelFilter' | 'ImpactImpactSEGSLabelFilter' | 'ImpactImpactSEGSRangeFilter' | 'ImpactImpactSEGSRangeFilter' | 'ImpactImpactSEGSOrderedFilter' | 'ImpactImpactSEGSOrderedFilter'> { }
export interface CanProduce_BASIC_PIPE extends Pick<ComfySetup, 'ImpactDetailerForEachPipe' | 'ImpactDetailerForEachDebugPipe' | 'ImpactToBasicPipe' | 'ImpactFromBasicPipe_v2' | 'ImpactDetailerPipeToBasicPipe' | 'ImpactDetailerPipeToBasicPipe' | 'ImpactEditBasicPipe' | 'ImpactKSamplerBasicPipe' | 'ImpactKSamplerAdvancedBasicPipe'> { }
export interface CanProduce_MASKS extends Pick<ComfySetup, 'ImpactSAMDetectorSegmented' | 'ImpactMaskListToMaskBatch' | 'ImpactImpactSEGSToMaskBatch'> { }
export interface CanProduce_DETAILER_PIPE extends Pick<ComfySetup, 'ImpactFaceDetailer' | 'ImpactFaceDetailerPipe' | 'ImpactToDetailerPipe' | 'ImpactToDetailerPipeSDXL' | 'ImpactFromDetailerPipe_v2' | 'ImpactFromDetailerPipeSDXL' | 'ImpactBasicPipeToDetailerPipe' | 'ImpactBasicPipeToDetailerPipeSDXL' | 'ImpactEditDetailerPipe' | 'ImpactEditDetailerPipeSDXL'> { }
export interface CanProduce_SEGM_DETECTOR extends Pick<ComfySetup, 'ImpactFromDetailerPipe' | 'ImpactFromDetailerPipe_v2' | 'ImpactFromDetailerPipeSDXL' | 'ImpactUltralyticsDetectorProvider' | 'MediaPipeFaceMeshDetectorProviderInspire'> { }
export interface CanProduce_DETAILER_HOOK extends Pick<ComfySetup, 'ImpactFromDetailerPipe' | 'ImpactFromDetailerPipe_v2' | 'ImpactFromDetailerPipeSDXL' | 'ImpactNoiseInjectionDetailerHookProvider'> { }
export interface CanProduce_UPSCALER extends Pick<ComfySetup, 'ImpactPixelKSampleUpscalerProvider' | 'ImpactPixelKSampleUpscalerProviderPipe' | 'ImpactPixelTiledKSampleUpscalerProvider' | 'ImpactPixelTiledKSampleUpscalerProviderPipe' | 'ImpactTwoSamplersForMaskUpscalerProvider' | 'ImpactTwoSamplersForMaskUpscalerProviderPipe'> { }
export interface CanProduce_PK_HOOK extends Pick<ComfySetup, 'ImpactPixelKSampleHookCombine' | 'ImpactDenoiseScheduleHookProvider' | 'ImpactCfgScheduleHookProvider' | 'ImpactNoiseInjectionHookProvider'> { }
export interface CanProduce_SEGS_HEADER extends Pick<ComfySetup, 'ImpactImpactDecomposeSEGS'> { }
export interface CanProduce_SEG_ELT extends Pick<ComfySetup, 'ImpactImpactDecomposeSEGS' | 'ImpactImpactFrom_SEG_ELT' | 'ImpactImpactEdit_SEG_ELT' | 'ImpactImpactDilate_Mask_SEG_ELT' | 'ImpactImpactScaleBy_BBOX_SEG_ELT'> { }
export interface CanProduce_SEG_ELT_crop_region extends Pick<ComfySetup, 'ImpactImpactFrom_SEG_ELT'> { }
export interface CanProduce_SEG_ELT_bbox extends Pick<ComfySetup, 'ImpactImpactFrom_SEG_ELT'> { }
export interface CanProduce_SEG_ELT_control_net_wrapper extends Pick<ComfySetup, 'ImpactImpactFrom_SEG_ELT'> { }
export interface CanProduce_FLOAT extends Pick<ComfySetup, 'ImpactImpactFrom_SEG_ELT' | 'EvaluateIntegers' | 'EvaluateFloats' | 'WASConstantNumber' | 'WASImageAspectRatio' | 'WASImageSizeToNumber' | 'WASImageSizeToNumber' | 'WASLatentSizeToNumber' | 'WASLatentSizeToNumber' | 'WASNumberCounter' | 'WASNumberOperation' | 'WASNumberToFloat' | 'WASNumberInputSwitch' | 'WASNumberInputCondition' | 'WASNumberMultipleOf' | 'WASNumberPI' | 'WASRandomNumber' | 'WASSeed' | 'WASTrueRandomOrgNumberGenerator'> { }
export interface CanProduce_STRING extends Pick<ComfySetup, 'ImpactImpactFrom_SEG_ELT' | 'ImpactLatentSwitch' | 'ImpactSEGSSwitch' | 'ImpactImpactSwitch' | 'ImpactImpactWildcardProcessor' | 'ImpactImpactWildcardEncode' | 'ImpactImpactStringSelector' | 'LoraLoaderBlockWeightInspire' | 'UnzipPromptInspire' | 'UnzipPromptInspire' | 'UnzipPromptInspire' | 'PromptExtractorInspire' | 'PromptExtractorInspire' | 'EvaluateIntegers' | 'EvaluateFloats' | 'EvaluateStrings' | 'WASCacheNode' | 'WASCacheNode' | 'WASCacheNode' | 'WASCheckpointLoader' | 'WASCheckpointLoaderSimple' | 'WASCLIPTextEncodeNSP' | 'WASCLIPTextEncodeNSP' | 'WASCreateMorphImage' | 'WASCreateMorphImage' | 'WASCreateMorphImageFromPath' | 'WASCreateMorphImageFromPath' | 'WASCreateVideoFromPath' | 'WASCreateVideoFromPath' | 'WASDiffusersModelLoader' | 'WASDiffusersHubModelDownLoader' | 'WASLoraLoader' | 'WASImageAspectRatio' | 'WASImageAspectRatio' | 'WASImageHistoryLoader' | 'WASImageLoad' | 'WASLoadImageBatch' | 'WASLoadTextFile' | 'WASLoadLora' | 'WASNumberToString' | 'WASNumberToText' | 'WASPromptStylesSelector' | 'WASPromptStylesSelector' | 'WASPromptMultipleStylesSelector' | 'WASPromptMultipleStylesSelector' | 'WASBLIPAnalyzeImage' | 'WASStringToText' | 'WASTextCompare' | 'WASTextCompare' | 'WASTextCompare' | 'WASTextConcatenate' | 'WASTextFileHistoryLoader' | 'WASTextFindAndReplaceByDictionary' | 'WASTextFindAndReplaceInput' | 'WASTextFindAndReplace' | 'WASTextInputSwitch' | 'WASTextLoadLineFromFile' | 'WASTextMultiline' | 'WASTextParseA1111Embeddings' | 'WASTextParseNoodleSoupPrompts' | 'WASTextParseTokens' | 'WASTextRandomLine' | 'WASTextRandomPrompt' | 'WASTextString' | 'WASTextString' | 'WASTextString' | 'WASTextString' | 'WASTextShuffle' | 'WASTextToConsole' | 'WASTextToString' | 'WASTextStringTruncate' | 'WASTextStringTruncate' | 'WASTextStringTruncate' | 'WASTextStringTruncate' | 'WASUnCLIPCheckpointLoader' | 'WASUpscaleModelLoader' | 'WASWriteToGIF' | 'WASWriteToGIF' | 'WASWriteToVideo' | 'WASWriteToVideo' | 'WASVideoDumpFrames'> { }
export interface CanProduce_KSAMPLER extends Pick<ComfySetup, 'ImpactKSamplerProvider' | 'ImpactTiledKSamplerProvider'> { }
export interface CanProduce_KSAMPLER_ADVANCED extends Pick<ComfySetup, 'ImpactKSamplerAdvancedProvider'> { }
export interface CanProduce_STAR extends Pick<ComfySetup, 'ImpactLatentSwitch' | 'ImpactSEGSSwitch' | 'ImpactImpactSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactInversedSwitch' | 'ImpactImpactConditionalBranch' | 'ImpactImpactValueReceiver' | 'ImpactImpactDummyInput'> { }
export interface CanProduce_REGIONAL_PROMPTS extends Pick<ComfySetup, 'ImpactCombineRegionalPrompts' | 'ImpactRegionalPrompt'> { }
export interface CanProduce_BOOLEAN extends Pick<ComfySetup, 'ImpactImpactCompare' | 'ImpactImpactNeg'> { }
export interface CanProduce_INT extends Pick<ComfySetup, 'ImpactImpactInt' | 'ImpactImpactImageInfo' | 'ImpactImpactImageInfo' | 'ImpactImpactImageInfo' | 'ImpactImpactImageInfo' | 'ImpactImpactMinMax' | 'EvaluateIntegers' | 'EvaluateFloats' | 'MasqueradeGetImageSize' | 'MasqueradeGetImageSize' | 'MasqueradeMasqueradeIncrementer' | 'WASConstantNumber' | 'WASLogicBoolean' | 'WASImageSizeToNumber' | 'WASImageSizeToNumber' | 'WASImageToSeed' | 'WASIntegerPlaceCounter' | 'WASLatentSizeToNumber' | 'WASLatentSizeToNumber' | 'WASMaskCropRegion' | 'WASMaskCropRegion' | 'WASMaskCropRegion' | 'WASMaskCropRegion' | 'WASMaskCropRegion' | 'WASMaskCropRegion' | 'WASNumberCounter' | 'WASNumberOperation' | 'WASNumberInputSwitch' | 'WASNumberInputCondition' | 'WASNumberMultipleOf' | 'WASNumberToInt' | 'WASRandomNumber' | 'WASSeed' | 'WASTrueRandomOrgNumberGenerator'> { }
export interface CanProduce_XY extends Pick<ComfySetup, 'XYInputLoraBlockWeightInspire' | 'XYInputLoraBlockWeightInspire' | 'XYInputSeedsBatch' | 'XYInputAddReturnNoise' | 'XYInputSteps' | 'XYInputCFGScale' | 'XYInputSamplerScheduler' | 'XYInputDenoise' | 'XYInputVAE' | 'XYInputPromptSR' | 'XYInputAestheticScore' | 'XYInputRefinerOnOff' | 'XYInputCheckpoint' | 'XYInputClipSkip' | 'XYInputLoRA' | 'XYInputLoRAPlot' | 'XYInputLoRAPlot' | 'XYInputLoRAStacks' | 'XYInputControlNet' | 'XYInputControlNetPlot' | 'XYInputControlNetPlot' | 'XYInputManualXYEntry' | 'JoinXYInputsOfSameType'> { }
export interface CanProduce_SEGS_PREPROCESSOR extends Pick<ComfySetup, 'OpenPose_Preprocessor_Provider_for_SEGSInspire' | 'DWPreprocessor_Provider_for_SEGSInspire' | 'MiDaS_DepthMap_Preprocessor_Provider_for_SEGSInspire' | 'LeRes_DepthMap_Preprocessor_Provider_for_SEGSInspire' | 'Canny_Preprocessor_Provider_for_SEGSInspire' | 'MediaPipe_FaceMesh_Preprocessor_Provider_for_SEGSInspire' | 'HEDPreprocessor_Provider_for_SEGSInspire' | 'FakeScribblePreprocessor_Provider_for_SEGSInspire'> { }
export interface CanProduce_ZIPPED_PROMPT extends Pick<ComfySetup, 'LoadPromptsFromDirInspire' | 'ZipPromptInspire'> { }
export interface CanProduce_SDXL_TUPLE extends Pick<ComfySetup, 'KSamplerSDXLEff' | 'EffLoaderSDXL' | 'PackSDXLTuple'> { }
export interface CanProduce_DEPENDENCIES extends Pick<ComfySetup, 'EfficientLoader' | 'EffLoaderSDXL'> { }
export interface CanProduce_LORA_STACK extends Pick<ComfySetup, 'LoRAStacker'> { }
export interface CanProduce_CONTROL_NET_STACK extends Pick<ComfySetup, 'ControlNetStacker'> { }
export interface CanProduce_SCRIPT extends Pick<ComfySetup, 'XYPlot' | 'HighResFixScript'> { }
export interface CanProduce_MASK_MAPPING extends Pick<ComfySetup, 'MasqueradeSeparateMaskComponents'> { }
export interface CanProduce_BLIP_MODEL extends Pick<ComfySetup, 'WASBLIPModelLoader'> { }
export interface CanProduce_NUMBER extends Pick<ComfySetup, 'WASConstantNumber' | 'WASDebugNumberToConsole' | 'WASLogicBoolean' | 'WASImageAspectRatio' | 'WASImageAspectRatio' | 'WASImageSizeToNumber' | 'WASImageSizeToNumber' | 'WASLatentSizeToNumber' | 'WASLatentSizeToNumber' | 'WASNumberCounter' | 'WASNumberOperation' | 'WASNumberInputSwitch' | 'WASNumberInputCondition' | 'WASNumberMultipleOf' | 'WASNumberPI' | 'WASRandomNumber' | 'WASSeed' | 'WASTextCompare' | 'WASTextCompare' | 'WASTextToNumber' | 'WASTrueRandomOrgNumberGenerator' | 'WASVideoDumpFrames'> { }
export interface CanProduce_CLIPSEG_MODEL extends Pick<ComfySetup, 'WASCLIPSegModelLoader'> { }
export interface CanProduce_DICT extends Pick<ComfySetup, 'WASDictionaryToConsole' | 'WASLoadTextFile' | 'WASTextDictionaryUpdate' | 'WASTextFileHistoryLoader' | 'WASTextLoadLineFromFile'> { }
export interface CanProduce_LIST extends Pick<ComfySetup, 'WASImageColorPalette' | 'WASTextList' | 'WASTextListConcatenate'> { }
export interface CanProduce_CROP_DATA extends Pick<ComfySetup, 'WASImageCropFace' | 'WASImageCropLocation' | 'WASImageCropSquareLocation' | 'WASMaskCropRegion'> { }
export interface CanProduce_MIDAS_MODEL extends Pick<ComfySetup, 'WASMiDaSModelLoader'> { }
export interface CanProduce_SEED extends Pick<ComfySetup, 'WASNumberToSeed' | 'WASSeed'> { }
export interface CanProduce_SAM_PARAMETERS extends Pick<ComfySetup, 'WASSAMParameters' | 'WASSAMParametersCombine'> { }
export interface CanProduce_IMAGE_BOUNDS extends Pick<ComfySetup, 'WASImageBounds' | 'WASInsetImageBounds' | 'WASBoundedImageCropWithMask'> { }

// 4. TYPES -------------------------------
export type SEG_ELT_control_net_wrapper = Slot<'SEG_ELT_control_net_wrapper'>
export type SEG_ELT_crop_region = Slot<'SEG_ELT_crop_region'>
export type CLIP_VISION_OUTPUT = Slot<'CLIP_VISION_OUTPUT'>
export type SEGS_PREPROCESSOR = Slot<'SEGS_PREPROCESSOR'>
export type KSAMPLER_ADVANCED = Slot<'KSAMPLER_ADVANCED'>
export type CONTROL_NET_STACK = Slot<'CONTROL_NET_STACK'>
export type REGIONAL_PROMPTS = Slot<'REGIONAL_PROMPTS'>
export type STRING = string | Slot<'STRING'>
export type FLOAT = number | Slot<'FLOAT'>
export type SAM_PARAMETERS = Slot<'SAM_PARAMETERS'>
export type UPSCALE_MODEL = Slot<'UPSCALE_MODEL'>
export type BBOX_DETECTOR = Slot<'BBOX_DETECTOR'>
export type ONNX_DETECTOR = Slot<'ONNX_DETECTOR'>
export type DETAILER_HOOK = Slot<'DETAILER_HOOK'>
export type DETAILER_PIPE = Slot<'DETAILER_PIPE'>
export type SEGM_DETECTOR = Slot<'SEGM_DETECTOR'>
export type ZIPPED_PROMPT = Slot<'ZIPPED_PROMPT'>
export type CLIPSEG_MODEL = Slot<'CLIPSEG_MODEL'>
export type INT = number | Slot<'INT'>
export type CONDITIONING = Slot<'CONDITIONING'>
export type SEG_ELT_bbox = Slot<'SEG_ELT_bbox'>
export type DEPENDENCIES = Slot<'DEPENDENCIES'>
export type MASK_MAPPING = Slot<'MASK_MAPPING'>
export type IMAGE_BOUNDS = Slot<'IMAGE_BOUNDS'>
export type CLIP_VISION = Slot<'CLIP_VISION'>
export type STYLE_MODEL = Slot<'STYLE_MODEL'>
export type CONTROL_NET = Slot<'CONTROL_NET'>
export type SEGS_HEADER = Slot<'SEGS_HEADER'>
export type MIDAS_MODEL = Slot<'MIDAS_MODEL'>
export type BASIC_PIPE = Slot<'BASIC_PIPE'>
export type SDXL_TUPLE = Slot<'SDXL_TUPLE'>
export type LORA_STACK = Slot<'LORA_STACK'>
export type BLIP_MODEL = Slot<'BLIP_MODEL'>
export type SAM_MODEL = Slot<'SAM_MODEL'>
export type CROP_DATA = Slot<'CROP_DATA'>
export type UPSCALER = Slot<'UPSCALER'>
export type KSAMPLER = Slot<'KSAMPLER'>
export type BOOLEAN = Slot<'BOOLEAN'>
export type PK_HOOK = Slot<'PK_HOOK'>
export type SEG_ELT = Slot<'SEG_ELT'>
export type LATENT = Slot<'LATENT'>
export type GLIGEN = Slot<'GLIGEN'>
export type SCRIPT = Slot<'SCRIPT'>
export type NUMBER = Slot<'NUMBER'>
export type MODEL = Slot<'MODEL'>
export type IMAGE = Slot<'IMAGE'>
export type MASKS = Slot<'MASKS'>
export type CLIP = Slot<'CLIP'>
export type MASK = Slot<'MASK'>
export type SEGS = Slot<'SEGS'>
export type STAR = Slot<'STAR'>
export type DICT = Slot<'DICT'>
export type LIST = Slot<'LIST'>
export type SEED = Slot<'SEED'>
export type VAE = Slot<'VAE'>
export type XY = Slot<'XY'>

// 5. ACCEPTABLE INPUTS -------------------------------
export type _SEG_ELT_control_net_wrapper = Slot<'SEG_ELT_control_net_wrapper'> | HasSingle_SEG_ELT_control_net_wrapper | ((x: CanProduce_SEG_ELT_control_net_wrapper) => _SEG_ELT_control_net_wrapper)
export type _SEG_ELT_crop_region = Slot<'SEG_ELT_crop_region'> | HasSingle_SEG_ELT_crop_region | ((x: CanProduce_SEG_ELT_crop_region) => _SEG_ELT_crop_region)
export type _CLIP_VISION_OUTPUT = Slot<'CLIP_VISION_OUTPUT'> | HasSingle_CLIP_VISION_OUTPUT | ((x: CanProduce_CLIP_VISION_OUTPUT) => _CLIP_VISION_OUTPUT)
export type _SEGS_PREPROCESSOR = Slot<'SEGS_PREPROCESSOR'> | HasSingle_SEGS_PREPROCESSOR | ((x: CanProduce_SEGS_PREPROCESSOR) => _SEGS_PREPROCESSOR)
export type _KSAMPLER_ADVANCED = Slot<'KSAMPLER_ADVANCED'> | HasSingle_KSAMPLER_ADVANCED | ((x: CanProduce_KSAMPLER_ADVANCED) => _KSAMPLER_ADVANCED)
export type _CONTROL_NET_STACK = Slot<'CONTROL_NET_STACK'> | HasSingle_CONTROL_NET_STACK | ((x: CanProduce_CONTROL_NET_STACK) => _CONTROL_NET_STACK)
export type _REGIONAL_PROMPTS = Slot<'REGIONAL_PROMPTS'> | HasSingle_REGIONAL_PROMPTS | ((x: CanProduce_REGIONAL_PROMPTS) => _REGIONAL_PROMPTS)
export type _STRING = string | Slot<'STRING'> | HasSingle_STRING | ((x: CanProduce_STRING) => _STRING)
export type _FLOAT = number | Slot<'FLOAT'> | HasSingle_FLOAT | ((x: CanProduce_FLOAT) => _FLOAT)
export type _SAM_PARAMETERS = Slot<'SAM_PARAMETERS'> | HasSingle_SAM_PARAMETERS | ((x: CanProduce_SAM_PARAMETERS) => _SAM_PARAMETERS)
export type _UPSCALE_MODEL = Slot<'UPSCALE_MODEL'> | HasSingle_UPSCALE_MODEL | ((x: CanProduce_UPSCALE_MODEL) => _UPSCALE_MODEL)
export type _BBOX_DETECTOR = Slot<'BBOX_DETECTOR'> | HasSingle_BBOX_DETECTOR | ((x: CanProduce_BBOX_DETECTOR) => _BBOX_DETECTOR)
export type _ONNX_DETECTOR = Slot<'ONNX_DETECTOR'> | HasSingle_ONNX_DETECTOR | ((x: CanProduce_ONNX_DETECTOR) => _ONNX_DETECTOR)
export type _DETAILER_HOOK = Slot<'DETAILER_HOOK'> | HasSingle_DETAILER_HOOK | ((x: CanProduce_DETAILER_HOOK) => _DETAILER_HOOK)
export type _DETAILER_PIPE = Slot<'DETAILER_PIPE'> | HasSingle_DETAILER_PIPE | ((x: CanProduce_DETAILER_PIPE) => _DETAILER_PIPE)
export type _SEGM_DETECTOR = Slot<'SEGM_DETECTOR'> | HasSingle_SEGM_DETECTOR | ((x: CanProduce_SEGM_DETECTOR) => _SEGM_DETECTOR)
export type _ZIPPED_PROMPT = Slot<'ZIPPED_PROMPT'> | HasSingle_ZIPPED_PROMPT | ((x: CanProduce_ZIPPED_PROMPT) => _ZIPPED_PROMPT)
export type _CLIPSEG_MODEL = Slot<'CLIPSEG_MODEL'> | HasSingle_CLIPSEG_MODEL | ((x: CanProduce_CLIPSEG_MODEL) => _CLIPSEG_MODEL)
export type _INT = number | Slot<'INT'> | HasSingle_INT | ((x: CanProduce_INT) => _INT)
export type _CONDITIONING = Slot<'CONDITIONING'> | HasSingle_CONDITIONING | ((x: CanProduce_CONDITIONING) => _CONDITIONING)
export type _SEG_ELT_bbox = Slot<'SEG_ELT_bbox'> | HasSingle_SEG_ELT_bbox | ((x: CanProduce_SEG_ELT_bbox) => _SEG_ELT_bbox)
export type _DEPENDENCIES = Slot<'DEPENDENCIES'> | HasSingle_DEPENDENCIES | ((x: CanProduce_DEPENDENCIES) => _DEPENDENCIES)
export type _MASK_MAPPING = Slot<'MASK_MAPPING'> | HasSingle_MASK_MAPPING | ((x: CanProduce_MASK_MAPPING) => _MASK_MAPPING)
export type _IMAGE_BOUNDS = Slot<'IMAGE_BOUNDS'> | HasSingle_IMAGE_BOUNDS | ((x: CanProduce_IMAGE_BOUNDS) => _IMAGE_BOUNDS)
export type _CLIP_VISION = Slot<'CLIP_VISION'> | HasSingle_CLIP_VISION | ((x: CanProduce_CLIP_VISION) => _CLIP_VISION)
export type _STYLE_MODEL = Slot<'STYLE_MODEL'> | HasSingle_STYLE_MODEL | ((x: CanProduce_STYLE_MODEL) => _STYLE_MODEL)
export type _CONTROL_NET = Slot<'CONTROL_NET'> | HasSingle_CONTROL_NET | ((x: CanProduce_CONTROL_NET) => _CONTROL_NET)
export type _SEGS_HEADER = Slot<'SEGS_HEADER'> | HasSingle_SEGS_HEADER | ((x: CanProduce_SEGS_HEADER) => _SEGS_HEADER)
export type _MIDAS_MODEL = Slot<'MIDAS_MODEL'> | HasSingle_MIDAS_MODEL | ((x: CanProduce_MIDAS_MODEL) => _MIDAS_MODEL)
export type _BASIC_PIPE = Slot<'BASIC_PIPE'> | HasSingle_BASIC_PIPE | ((x: CanProduce_BASIC_PIPE) => _BASIC_PIPE)
export type _SDXL_TUPLE = Slot<'SDXL_TUPLE'> | HasSingle_SDXL_TUPLE | ((x: CanProduce_SDXL_TUPLE) => _SDXL_TUPLE)
export type _LORA_STACK = Slot<'LORA_STACK'> | HasSingle_LORA_STACK | ((x: CanProduce_LORA_STACK) => _LORA_STACK)
export type _BLIP_MODEL = Slot<'BLIP_MODEL'> | HasSingle_BLIP_MODEL | ((x: CanProduce_BLIP_MODEL) => _BLIP_MODEL)
export type _SAM_MODEL = Slot<'SAM_MODEL'> | HasSingle_SAM_MODEL | ((x: CanProduce_SAM_MODEL) => _SAM_MODEL)
export type _CROP_DATA = Slot<'CROP_DATA'> | HasSingle_CROP_DATA | ((x: CanProduce_CROP_DATA) => _CROP_DATA)
export type _UPSCALER = Slot<'UPSCALER'> | HasSingle_UPSCALER | ((x: CanProduce_UPSCALER) => _UPSCALER)
export type _KSAMPLER = Slot<'KSAMPLER'> | HasSingle_KSAMPLER | ((x: CanProduce_KSAMPLER) => _KSAMPLER)
export type _BOOLEAN = Slot<'BOOLEAN'> | HasSingle_BOOLEAN | ((x: CanProduce_BOOLEAN) => _BOOLEAN)
export type _PK_HOOK = Slot<'PK_HOOK'> | HasSingle_PK_HOOK | ((x: CanProduce_PK_HOOK) => _PK_HOOK)
export type _SEG_ELT = Slot<'SEG_ELT'> | HasSingle_SEG_ELT | ((x: CanProduce_SEG_ELT) => _SEG_ELT)
export type _LATENT = Slot<'LATENT'> | HasSingle_LATENT | ((x: CanProduce_LATENT) => _LATENT)
export type _GLIGEN = Slot<'GLIGEN'> | HasSingle_GLIGEN | ((x: CanProduce_GLIGEN) => _GLIGEN)
export type _SCRIPT = Slot<'SCRIPT'> | HasSingle_SCRIPT | ((x: CanProduce_SCRIPT) => _SCRIPT)
export type _NUMBER = Slot<'NUMBER'> | HasSingle_NUMBER | ((x: CanProduce_NUMBER) => _NUMBER)
export type _MODEL = Slot<'MODEL'> | HasSingle_MODEL | ((x: CanProduce_MODEL) => _MODEL)
export type _IMAGE = Slot<'IMAGE'> | HasSingle_IMAGE | ((x: CanProduce_IMAGE) => _IMAGE)
export type _MASKS = Slot<'MASKS'> | HasSingle_MASKS | ((x: CanProduce_MASKS) => _MASKS)
export type _CLIP = Slot<'CLIP'> | HasSingle_CLIP | ((x: CanProduce_CLIP) => _CLIP)
export type _MASK = Slot<'MASK'> | HasSingle_MASK | ((x: CanProduce_MASK) => _MASK)
export type _SEGS = Slot<'SEGS'> | HasSingle_SEGS | ((x: CanProduce_SEGS) => _SEGS)
export type _STAR = Slot<'STAR'> | HasSingle_STAR | ((x: CanProduce_STAR) => _STAR)
export type _DICT = Slot<'DICT'> | HasSingle_DICT | ((x: CanProduce_DICT) => _DICT)
export type _LIST = Slot<'LIST'> | HasSingle_LIST | ((x: CanProduce_LIST) => _LIST)
export type _SEED = Slot<'SEED'> | HasSingle_SEED | ((x: CanProduce_SEED) => _SEED)
export type _VAE = Slot<'VAE'> | HasSingle_VAE | ((x: CanProduce_VAE) => _VAE)
export type _XY = Slot<'XY'> | HasSingle_XY | ((x: CanProduce_XY) => _XY)

// 6. ENUMS -------------------------------
export type Enum_KSampler_Sampler_name = "ddim" | "ddpm" | "dpm_2" | "dpm_2_ancestral" | "dpm_adaptive" | "dpm_fast" | "dpmpp_2m" | "dpmpp_2m_sde" | "dpmpp_2m_sde_gpu" | "dpmpp_2s_ancestral" | "dpmpp_3m_sde" | "dpmpp_3m_sde_gpu" | "dpmpp_sde" | "dpmpp_sde_gpu" | "euler" | "euler_ancestral" | "heun" | "lms" | "uni_pc" | "uni_pc_bh2"
export type Enum_KSamplerAdvanced_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactDetailerForEach_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactDetailerForEachDebug_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactDetailerForEachPipe_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactDetailerForEachDebugPipe_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactFaceDetailer_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactFaceDetailerPipe_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactPixelKSampleUpscalerProvider_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactPixelKSampleUpscalerProviderPipe_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactPixelTiledKSampleUpscalerProvider_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactKSamplerProvider_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactTiledKSamplerProvider_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactKSamplerAdvancedProvider_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactSEGSDetailer_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactKSamplerBasicPipe_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_ImpactKSamplerAdvancedBasicPipe_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_KSamplerInspire_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_BNK_TiledKSamplerAdvanced_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_BNK_TiledKSampler_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_KSamplerEfficient_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_KSamplerAdvEfficient_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_KSamplerSDXLEff_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_SDXLMixSampler_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_WASKSamplerWAS_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_WASKSamplerCycle_Sampler_name = Enum_KSampler_Sampler_name
export type Enum_KSampler_Scheduler = "ddim_uniform" | "exponential" | "karras" | "normal" | "sgm_uniform" | "simple"
export type Enum_KSamplerAdvanced_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactDetailerForEach_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactDetailerForEachDebug_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactDetailerForEachPipe_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactDetailerForEachDebugPipe_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactFaceDetailer_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactFaceDetailerPipe_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactPixelKSampleUpscalerProvider_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactPixelKSampleUpscalerProviderPipe_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactPixelTiledKSampleUpscalerProvider_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactKSamplerProvider_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactTiledKSamplerProvider_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactKSamplerAdvancedProvider_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactSEGSDetailer_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactKSamplerBasicPipe_Scheduler = Enum_KSampler_Scheduler
export type Enum_ImpactKSamplerAdvancedBasicPipe_Scheduler = Enum_KSampler_Scheduler
export type Enum_KSamplerInspire_Scheduler = Enum_KSampler_Scheduler
export type Enum_BNK_TiledKSamplerAdvanced_Scheduler = Enum_KSampler_Scheduler
export type Enum_BNK_TiledKSampler_Scheduler = Enum_KSampler_Scheduler
export type Enum_KSamplerEfficient_Scheduler = Enum_KSampler_Scheduler
export type Enum_KSamplerAdvEfficient_Scheduler = Enum_KSampler_Scheduler
export type Enum_KSamplerSDXLEff_Scheduler = Enum_KSampler_Scheduler
export type Enum_SDXLMixSampler_Scheduler = Enum_KSampler_Scheduler
export type Enum_WASKSamplerWAS_Scheduler = Enum_KSampler_Scheduler
export type Enum_WASKSamplerCycle_Scheduler = Enum_KSampler_Scheduler
export type Enum_CheckpointLoaderSimple_Ckpt_name = "AOM3A1_orangemixs.safetensors" | "AOM3A3_orangemixs.safetensors" | "AbyssOrangeMix2_hard.safetensors" | "Deliberate-inpainting.safetensors" | "Sevenof9V3.safetensors" | "albedobaseXL_v02.safetensors" | "angel1_36224.safetensors" | "anything-v3-fp16-pruned.safetensors" | "deliberate_v2.safetensors" | "dreamshaperXL10_alpha2Xl10.safetensors" | "dynavisionXLAllInOneStylized_beta0411Bakedvae.safetensors" | "ghostmix_v12.safetensors" | "juggernautXL_version3.safetensors" | "lyriel_v15.safetensors" | "mistoonAnime_v10.safetensors" | "mistoonAnime_v10Inpainting.safetensors" | "realisticVisionV20_v20.safetensors" | "revAnimated_v121.safetensors" | "revAnimated_v121Inp-inpainting.safetensors" | "revAnimated_v122.safetensors" | "sd_xl_base_1.0.safetensors" | "sd_xl_refiner_1.0.safetensors" | "toonyou_beta1.safetensors" | "v1-5-pruned-emaonly.ckpt" | "v1-5-pruned-emaonly.safetensors" | "v2-1_512-ema-pruned.safetensors" | "v2-1_768-ema-pruned.safetensors" | "wd-1-5-beta2-aesthetic-unclip-h-fp16.safetensors" | "wd-1-5-beta2-fp16.safetensors"
export type Enum_UnCLIPCheckpointLoader_Ckpt_name = Enum_CheckpointLoaderSimple_Ckpt_name
export type Enum_CheckpointLoader_Ckpt_name = Enum_CheckpointLoaderSimple_Ckpt_name
export type Enum_EfficientLoader_Ckpt_name = Enum_CheckpointLoaderSimple_Ckpt_name
export type Enum_EffLoaderSDXL_Base_ckpt_name = Enum_CheckpointLoaderSimple_Ckpt_name
export type Enum_WASCheckpointLoader_Ckpt_name = Enum_CheckpointLoaderSimple_Ckpt_name
export type Enum_WASCheckpointLoaderSimple_Ckpt_name = Enum_CheckpointLoaderSimple_Ckpt_name
export type Enum_WASUnCLIPCheckpointLoader_Ckpt_name = Enum_CheckpointLoaderSimple_Ckpt_name
export type Enum_VAELoader_Vae_name = "blessed2.vae.pt" | "kl-f8-anime2.ckpt" | "orangemix.vae.pt" | "vae-ft-mse-840000-ema-pruned.safetensors"
export type Enum_LatentUpscale_Upscale_method = "area" | "bicubic" | "bilinear" | "bislerp" | "nearest-exact"
export type Enum_LatentUpscaleBy_Upscale_method = Enum_LatentUpscale_Upscale_method
export type Enum_HighResFixScript_Latent_upscale_method = Enum_LatentUpscale_Upscale_method
export type Enum_LatentUpscale_Crop = "center" | "disabled"
export type Enum_ImageScale_Crop = Enum_LatentUpscale_Crop
export type Enum_LoadImage_Image = "2023-07-24_10-58-29.png" | "ComfyUI_01264_.png" | "ComfyUI_01277_.png" | "ComfyUI_01292_.png" | "ComfyUI_01304_.png" | "ComfyUI_01316_.png" | "ComfyUI_01321_ (1).png" | "ComfyUI_01334_.png" | "ComfyUI_01341_ (1).png" | "ComfyUI_01341_ (2).png" | "ComfyUI_01341_.png" | "ComfyUI_01353_.png" | "ComfyUI_01380_.png" | "ComfyUI_01388_ (1).png" | "ComfyUI_01394_ (1).png" | "ComfyUI_01394_.png" | "ComfyUI_01407_.png" | "example.png" | "icon-1024.png" | "il_570xN.4895517340_bhko-removebg-preview.png" | "images.jpeg" | "init_image_sui_backend_1_1.png" | "test1-1695149536447ComfyUI_01534_.png" | "test1-1695149597290ComfyUI_01538_.png" | "upload (1).png" | "upload (10).png" | "upload (11).png" | "upload (12).png" | "upload (13).png" | "upload (14).png" | "upload (15).png" | "upload (16).png" | "upload (17).png" | "upload (18).png" | "upload (19).png" | "upload (2).png" | "upload (20).png" | "upload (21).png" | "upload (22).png" | "upload (23).png" | "upload (24).png" | "upload (25).png" | "upload (26).png" | "upload (27).png" | "upload (28).png" | "upload (29).png" | "upload (3).png" | "upload (30).png" | "upload (31).png" | "upload (32).png" | "upload (33).png" | "upload (34).png" | "upload (35).png" | "upload (36).png" | "upload (37).png" | "upload (38).png" | "upload (39).png" | "upload (4).png" | "upload (40).png" | "upload (41).png" | "upload (42).png" | "upload (43).png" | "upload (44).png" | "upload (45).png" | "upload (46).png" | "upload (47).png" | "upload (48).png" | "upload (49).png" | "upload (5).png" | "upload (50).png" | "upload (51).png" | "upload (52).png" | "upload (53).png" | "upload (54).png" | "upload (55).png" | "upload (56).png" | "upload (57).png" | "upload (58).png" | "upload (59).png" | "upload (6).png" | "upload (60).png" | "upload (61).png" | "upload (62).png" | "upload (63).png" | "upload (64).png" | "upload (65).png" | "upload (66).png" | "upload (7).png" | "upload (8).png" | "upload (9).png" | "upload.png"
export type Enum_LoadImageMask_Image = Enum_LoadImage_Image
export type Enum_ImpactImageReceiver_Image = Enum_LoadImage_Image
export type Enum_PromptExtractorInspire_Image = Enum_LoadImage_Image
export type Enum_LoadImageMask_Channel = "alpha" | "blue" | "green" | "red"
export type Enum_WASImageToLatentMask_Channel = Enum_LoadImageMask_Channel
export type Enum_ImageScale_Upscale_method = "area" | "bicubic" | "bilinear" | "lanczos" | "nearest-exact"
export type Enum_ImageScaleBy_Upscale_method = Enum_ImageScale_Upscale_method
export type Enum_ImageScaleToTotalPixels_Upscale_method = Enum_ImageScale_Upscale_method
export type Enum_ConditioningSetMask_Set_cond_area = "default" | "mask bounds"
export type Enum_KSamplerAdvanced_Add_noise = "disable" | "enable"
export type Enum_KSamplerAdvanced_Return_with_leftover_noise = Enum_KSamplerAdvanced_Add_noise
export type Enum_BNK_TiledKSamplerAdvanced_Add_noise = Enum_KSamplerAdvanced_Add_noise
export type Enum_BNK_TiledKSamplerAdvanced_Return_with_leftover_noise = Enum_KSamplerAdvanced_Add_noise
export type Enum_BNK_TiledKSamplerAdvanced_Preview = Enum_KSamplerAdvanced_Add_noise
export type Enum_KSamplerAdvEfficient_Add_noise = Enum_KSamplerAdvanced_Add_noise
export type Enum_KSamplerAdvEfficient_Return_with_leftover_noise = Enum_KSamplerAdvanced_Add_noise
export type Enum_WASKSamplerCycle_Tiled_vae = Enum_KSamplerAdvanced_Add_noise
export type Enum_WASKSamplerCycle_Scale_denoise = Enum_KSamplerAdvanced_Add_noise
export type Enum_WASKSamplerCycle_Pos_add_strength_scaling = Enum_KSamplerAdvanced_Add_noise
export type Enum_WASKSamplerCycle_Neg_add_strength_scaling = Enum_KSamplerAdvanced_Add_noise
export type Enum_WASKSamplerCycle_Steps_scaling = Enum_KSamplerAdvanced_Add_noise
export type Enum_LatentRotate_Rotation = "180 degrees" | "270 degrees" | "90 degrees" | "none"
export type Enum_LatentFlip_Flip_method = "x-axis: vertically" | "y-axis: horizontally"
export type Enum_LoraLoader_Lora_name = "Character Design.safetensors" | "Isometric Cutaway.safetensors" | "Stained Glass Portrait.safetensors" | "pxll.safetensors" | "sd15\\animemix_16.safetensors" | "sd15\\animemix_v3_offset.safetensors" | "sd15\\chars\\dark_magician_girl.safetensors" | "sd15\\chars\\yorha_noDOT_2_type_b.safetensors" | "sd15\\colors\\LowRa.safetensors" | "sd15\\colors\\theovercomer8sContrastFix_sd15.safetensors" | "sd15\\colors\\theovercomer8sContrastFix_sd21768.safetensors" | "sd15\\styles\\ConstructionyardAIV3.safetensors" | "sd15\\styles\\StonepunkAI-000011.safetensors" | "sd15\\styles\\ToonYou_Style.safetensors" | "sd15\\styles\\baroqueAI.safetensors" | "sd15\\styles\\pixel_f2.safetensors" | "sd15\\test\\Moxin_10.safetensors" | "sd15\\test\\animeLineartMangaLike_v30MangaLike.safetensors" | "sd15\\utils\\charTurnBetaLora.safetensors" | "sdxl-baton-v02-e93.safetensors"
export type Enum_XYInputLoraBlockWeightInspire_Lora_name = Enum_LoraLoader_Lora_name
export type Enum_LoraLoaderBlockWeightInspire_Lora_name = Enum_LoraLoader_Lora_name
export type Enum_LoraBlockInfoInspire_Lora_name = Enum_LoraLoader_Lora_name
export type Enum_CLIPLoader_Clip_name = '🔴' // never
export type Enum_UNETLoader_Unet_name = "xl-inpaint-0.1\\diffusion_pytorch_model.fp16.safetensors"
export type Enum_ControlNetLoader_Control_net_name = "control-lora-depth-rank256.safetensors" | "control_depth-fp16.safetensors" | "control_openpose-fp16.safetensors" | "control_scribble-fp16.safetensors" | "control_v11u_sd15_tile.pth"
export type Enum_DiffControlNetLoader_Control_net_name = Enum_ControlNetLoader_Control_net_name
export type Enum_CLIPVisionLoader_Clip_name = "SD1.5\\pytorch_model.bin" | "clip_vit14.bin"
export type Enum_CheckpointLoader_Config_name = "anything_v3.yaml" | "v1-inference.yaml" | "v1-inference_clip_skip_2.yaml" | "v1-inference_clip_skip_2_fp16.yaml" | "v1-inference_fp16.yaml" | "v1-inpainting-inference.yaml" | "v2-inference-v.yaml" | "v2-inference-v_fp32.yaml" | "v2-inference.yaml" | "v2-inference_fp32.yaml" | "v2-inpainting-inference.yaml"
export type Enum_WASCheckpointLoader_Config_name = Enum_CheckpointLoader_Config_name
export type Enum_ImageBlend_Blend_mode = "multiply" | "normal" | "overlay" | "screen" | "soft_light"
export type Enum_ImageQuantize_Dither = "floyd-steinberg" | "none"
export type Enum_ImageToMask_Channel = "blue" | "green" | "red"
export type Enum_WASImageSelectChannel_Channel = Enum_ImageToMask_Channel
export type Enum_MaskComposite_Operation = "add" | "and" | "multiply" | "or" | "subtract" | "xor"
export type Enum_CivitAI_Lora_Loader_Lora_name = "Character Design.safetensors" | "Isometric Cutaway.safetensors" | "Stained Glass Portrait.safetensors" | "none" | "pxll.safetensors" | "sd15\\animemix_16.safetensors" | "sd15\\animemix_v3_offset.safetensors" | "sd15\\chars\\dark_magician_girl.safetensors" | "sd15\\chars\\yorha_noDOT_2_type_b.safetensors" | "sd15\\colors\\LowRa.safetensors" | "sd15\\colors\\theovercomer8sContrastFix_sd15.safetensors" | "sd15\\colors\\theovercomer8sContrastFix_sd21768.safetensors" | "sd15\\styles\\ConstructionyardAIV3.safetensors" | "sd15\\styles\\StonepunkAI-000011.safetensors" | "sd15\\styles\\ToonYou_Style.safetensors" | "sd15\\styles\\baroqueAI.safetensors" | "sd15\\styles\\pixel_f2.safetensors" | "sd15\\test\\Moxin_10.safetensors" | "sd15\\test\\animeLineartMangaLike_v30MangaLike.safetensors" | "sd15\\utils\\charTurnBetaLora.safetensors" | "sdxl-baton-v02-e93.safetensors"
export type Enum_CivitAI_Lora_Loader_Download_path = "models\\loras"
export type Enum_CivitAI_Checkpoint_Loader_Ckpt_name = "AOM3A1_orangemixs.safetensors" | "AOM3A3_orangemixs.safetensors" | "AbyssOrangeMix2_hard.safetensors" | "Deliberate-inpainting.safetensors" | "Sevenof9V3.safetensors" | "albedobaseXL_v02.safetensors" | "angel1_36224.safetensors" | "anything-v3-fp16-pruned.safetensors" | "deliberate_v2.safetensors" | "dreamshaperXL10_alpha2Xl10.safetensors" | "dynavisionXLAllInOneStylized_beta0411Bakedvae.safetensors" | "ghostmix_v12.safetensors" | "juggernautXL_version3.safetensors" | "lyriel_v15.safetensors" | "mistoonAnime_v10.safetensors" | "mistoonAnime_v10Inpainting.safetensors" | "none" | "realisticVisionV20_v20.safetensors" | "revAnimated_v121.safetensors" | "revAnimated_v121Inp-inpainting.safetensors" | "revAnimated_v122.safetensors" | "sd_xl_base_1.0.safetensors" | "sd_xl_refiner_1.0.safetensors" | "toonyou_beta1.safetensors" | "v1-5-pruned-emaonly.ckpt" | "v1-5-pruned-emaonly.safetensors" | "v2-1_512-ema-pruned.safetensors" | "v2-1_768-ema-pruned.safetensors" | "wd-1-5-beta2-aesthetic-unclip-h-fp16.safetensors" | "wd-1-5-beta2-fp16.safetensors"
export type Enum_CivitAI_Checkpoint_Loader_Download_path = "models\\checkpoints"
export type Enum_ImpactSAMLoader_Model_name = "sam_vit_b_01ec64.pth"
export type Enum_ImpactSAMLoader_Device_mode = "AUTO" | "CPU" | "Prefer GPU"
export type Enum_ImpactSAMDetectorCombined_Detection_hint = "center-1" | "diamond-4" | "horizontal-2" | "mask-area" | "mask-point-bbox" | "mask-points" | "none" | "rect-4" | "vertical-2"
export type Enum_ImpactSAMDetectorSegmented_Detection_hint = Enum_ImpactSAMDetectorCombined_Detection_hint
export type Enum_ImpactFaceDetailer_Sam_detection_hint = Enum_ImpactSAMDetectorCombined_Detection_hint
export type Enum_ImpactFaceDetailerPipe_Sam_detection_hint = Enum_ImpactSAMDetectorCombined_Detection_hint
export type Enum_ImpactSAMDetectorCombined_Mask_hint_use_negative = "False" | "Outter" | "Small"
export type Enum_ImpactSAMDetectorSegmented_Mask_hint_use_negative = Enum_ImpactSAMDetectorCombined_Mask_hint_use_negative
export type Enum_ImpactFaceDetailer_Sam_mask_hint_use_negative = Enum_ImpactSAMDetectorCombined_Mask_hint_use_negative
export type Enum_ImpactFaceDetailerPipe_Sam_mask_hint_use_negative = Enum_ImpactSAMDetectorCombined_Mask_hint_use_negative
export type Enum_ImpactToDetailerPipe_SelectToAddLoRA = "Character Design.safetensors" | "Isometric Cutaway.safetensors" | "Select the LoRA to add to the text" | "Stained Glass Portrait.safetensors" | "pxll.safetensors" | "sd15\\animemix_16.safetensors" | "sd15\\animemix_v3_offset.safetensors" | "sd15\\chars\\dark_magician_girl.safetensors" | "sd15\\chars\\yorha_noDOT_2_type_b.safetensors" | "sd15\\colors\\LowRa.safetensors" | "sd15\\colors\\theovercomer8sContrastFix_sd15.safetensors" | "sd15\\colors\\theovercomer8sContrastFix_sd21768.safetensors" | "sd15\\styles\\ConstructionyardAIV3.safetensors" | "sd15\\styles\\StonepunkAI-000011.safetensors" | "sd15\\styles\\ToonYou_Style.safetensors" | "sd15\\styles\\baroqueAI.safetensors" | "sd15\\styles\\pixel_f2.safetensors" | "sd15\\test\\Moxin_10.safetensors" | "sd15\\test\\animeLineartMangaLike_v30MangaLike.safetensors" | "sd15\\utils\\charTurnBetaLora.safetensors" | "sdxl-baton-v02-e93.safetensors"
export type Enum_ImpactToDetailerPipeSDXL_SelectToAddLoRA = Enum_ImpactToDetailerPipe_SelectToAddLoRA
export type Enum_ImpactBasicPipeToDetailerPipe_SelectToAddLoRA = Enum_ImpactToDetailerPipe_SelectToAddLoRA
export type Enum_ImpactBasicPipeToDetailerPipeSDXL_SelectToAddLoRA = Enum_ImpactToDetailerPipe_SelectToAddLoRA
export type Enum_ImpactEditDetailerPipe_SelectToAddLoRA = Enum_ImpactToDetailerPipe_SelectToAddLoRA
export type Enum_ImpactEditDetailerPipeSDXL_SelectToAddLoRA = Enum_ImpactToDetailerPipe_SelectToAddLoRA
export type Enum_ImpactImpactWildcardEncode_SelectToAddLoRA = Enum_ImpactToDetailerPipe_SelectToAddLoRA
export type Enum_ImpactLatentPixelScale_Scale_method = "area" | "bilinear" | "nearest-exact"
export type Enum_ImpactPixelKSampleUpscalerProvider_Scale_method = Enum_ImpactLatentPixelScale_Scale_method
export type Enum_ImpactPixelKSampleUpscalerProviderPipe_Scale_method = Enum_ImpactLatentPixelScale_Scale_method
export type Enum_ImpactPixelTiledKSampleUpscalerProvider_Scale_method = Enum_ImpactLatentPixelScale_Scale_method
export type Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_Scale_method = Enum_ImpactLatentPixelScale_Scale_method
export type Enum_ImpactTwoSamplersForMaskUpscalerProvider_Scale_method = Enum_ImpactLatentPixelScale_Scale_method
export type Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_Scale_method = Enum_ImpactLatentPixelScale_Scale_method
export type Enum_ImageOverlay_Resize_method = Enum_ImpactLatentPixelScale_Scale_method
export type Enum_ImpactPixelTiledKSampleUpscalerProvider_Tiling_strategy = "padded" | "random" | "simple"
export type Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_Tiling_strategy = Enum_ImpactPixelTiledKSampleUpscalerProvider_Tiling_strategy
export type Enum_ImpactTiledKSamplerProvider_Tiling_strategy = Enum_ImpactPixelTiledKSampleUpscalerProvider_Tiling_strategy
export type Enum_ImpactTwoSamplersForMaskUpscalerProvider_Full_sample_schedule = "interleave1" | "interleave1+last1" | "interleave2" | "interleave2+last1" | "interleave3" | "interleave3+last1" | "last1" | "last2" | "none"
export type Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_Full_sample_schedule = Enum_ImpactTwoSamplersForMaskUpscalerProvider_Full_sample_schedule
export type Enum_ImpactDenoiseScheduleHookProvider_Schedule_for_iteration = "simple"
export type Enum_ImpactCfgScheduleHookProvider_Schedule_for_iteration = Enum_ImpactDenoiseScheduleHookProvider_Schedule_for_iteration
export type Enum_ImpactNoiseInjectionHookProvider_Schedule_for_iteration = Enum_ImpactDenoiseScheduleHookProvider_Schedule_for_iteration
export type Enum_ImpactNoiseInjectionHookProvider_Source = "CPU" | "GPU"
export type Enum_ImpactNoiseInjectionDetailerHookProvider_Source = Enum_ImpactNoiseInjectionHookProvider_Source
export type Enum_ImpactPreviewBridge_Image = "#placeholder"
export type Enum_ImpactLatentSender_Preview_method = "Latent2RGB-SD15" | "Latent2RGB-SDXL" | "TAESD15" | "TAESDXL"
export type Enum_ImpactReencodeLatent_Tile_mode = "Both" | "Decode(input) only" | "Encode(output) only" | "None"
export type Enum_ImpactReencodeLatentPipe_Tile_mode = Enum_ImpactReencodeLatent_Tile_mode
export type Enum_ImpactImpactSEGSLabelFilter_Preset = "all" | "eyebrows" | "eyes" | "face" | "hand" | "left_eye" | "left_eyebrow" | "left_pupil" | "long_sleeved_dress" | "long_sleeved_outwear" | "long_sleeved_shirt" | "mouth" | "pupils" | "right_eye" | "right_eyebrow" | "right_pupil" | "short_sleeved_dress" | "short_sleeved_outwear" | "short_sleeved_shirt" | "shorts" | "skirt" | "sling" | "sling_dress" | "trousers" | "vest" | "vest_dress"
export type Enum_ImpactImpactSEGSRangeFilter_Target = "area(=w*h)" | "height" | "length_percent" | "width" | "x1" | "x2" | "y1" | "y2"
export type Enum_ImpactImpactSEGSOrderedFilter_Target = "area(=w*h)" | "height" | "width" | "x1" | "x2" | "y1" | "y2"
export type Enum_ImpactImpactCompare_Cmp = "a < b" | "a <= b" | "a <> b" | "a = b" | "a > b" | "a >= b" | "ff" | "tt"
export type Enum_ImpactImpactValueReceiver_Typ = "BOOLEAN" | "FLOAT" | "INT" | "STRING"
export type Enum_ImpactUltralyticsDetectorProvider_Model_name = "bbox/face_yolov8m.pt" | "bbox/hand_yolov8s.pt" | "segm/person_yolov8m-seg.pt"
export type Enum_XYInputLoraBlockWeightInspire_Preset = "@SD-BLOCK1-TEST:17,12,1" | "@SD-BLOCK10-TEST:17,12,10" | "@SD-BLOCK11-TEST:17,12,11" | "@SD-BLOCK12-TEST:17,12,12" | "@SD-BLOCK13-TEST:17,12,13" | "@SD-BLOCK14-TEST:17,12,14" | "@SD-BLOCK15-TEST:17,12,15" | "@SD-BLOCK16-TEST:17,12,16" | "@SD-BLOCK17-TEST:17,12,17" | "@SD-BLOCK2-TEST:17,12,2" | "@SD-BLOCK3-TEST:17,12,3" | "@SD-BLOCK4-TEST:17,12,4" | "@SD-BLOCK5-TEST:17,12,5" | "@SD-BLOCK6-TEST:17,12,6" | "@SD-BLOCK7-TEST:17,12,7" | "@SD-BLOCK8-TEST:17,12,8" | "@SD-BLOCK9-TEST:17,12,9" | "@SD-FULL-TEST:17" | "@SD-LyC-FULL-TEST:27" | "@SDXL-FULL-TEST:20" | "Preset" | "SD-AB:A,B,B,B,B,B,B,B,B,B,B,B,A,A,A,A,A" | "SD-ALL0.5:0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5" | "SD-ALL:1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1" | "SD-AOUT:A,1,1,1,1,1,1,1,1,1,1,1,A,A,A,A,A" | "SD-INALL:1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0" | "SD-IND:1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0" | "SD-INS:1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0" | "SD-LyC-ALL:1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1" | "SD-LyC-INALL:1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0" | "SD-LyC-MIDALL:1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0" | "SD-LyC-NONE:0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0" | "SD-LyC-OUTALL:1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1" | "SD-MIDD0.2:1,0,0,0,0,0,0.2,0.4,0.4,0.2,0,0,0,0,0,0,0" | "SD-MIDD0.8:1,0,0,0,0,0.5,0.8,0.8,0.4,0,0,0,0,0,0,0,0" | "SD-MIDD:1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0" | "SD-MOUT:1,0,0,0,0,0,1,1,1,1,1,1,1,1,0.5,0,0" | "SD-NONE:0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0" | "SD-OUTALL:1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1" | "SD-OUTD:1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0" | "SD-OUTS:1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1" | "SD-ROUT:1,1,1,1,1,1,1,1,R,R,R,R,R,R,R,R,R" | "SDXL-ALL:1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1" | "SDXL-INALL:1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0" | "SDXL-MIDALL:1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0" | "SDXL-NONE:0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0" | "SDXL-OUTALL:1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1"
export type Enum_LoraLoaderBlockWeightInspire_Preset = Enum_XYInputLoraBlockWeightInspire_Preset
export type Enum_XYInputLoraBlockWeightInspire_Heatmap_palette = "cividis" | "inferno" | "magma" | "plasma" | "viridis"
export type Enum_XYInputLoraBlockWeightInspire_Xyplot_mode = "Diff" | "Diff+Heatmap" | "Simple"
export type Enum_KSamplerInspire_Noise_mode = "CPU" | "GPU(=A1111)"
export type Enum_LoadPromptsFromDirInspire_Prompt_dir = "example"
export type Enum_GlobalSeedInspire_Action = "decrement" | "decrement for each node" | "fixed" | "increment" | "increment for each node" | "randomize" | "randomize for each node"
export type Enum_BNK_TiledKSamplerAdvanced_Tiling_strategy = "padded" | "random" | "random strict" | "simple"
export type Enum_BNK_TiledKSampler_Tiling_strategy = Enum_BNK_TiledKSamplerAdvanced_Tiling_strategy
export type Enum_KSamplerEfficient_Sampler_state = "Hold" | "Sample" | "Script"
export type Enum_KSamplerAdvEfficient_Sampler_state = Enum_KSamplerEfficient_Sampler_state
export type Enum_KSamplerSDXLEff_Sampler_state = Enum_KSamplerEfficient_Sampler_state
export type Enum_KSamplerEfficient_Preview_method = "auto" | "latent2rgb" | "none" | "taesd"
export type Enum_KSamplerAdvEfficient_Preview_method = Enum_KSamplerEfficient_Preview_method
export type Enum_KSamplerSDXLEff_Preview_method = Enum_KSamplerEfficient_Preview_method
export type Enum_KSamplerEfficient_Vae_decode = "false" | "output only" | "output only (tiled)" | "true" | "true (tiled)"
export type Enum_KSamplerAdvEfficient_Vae_decode = Enum_KSamplerEfficient_Vae_decode
export type Enum_KSamplerSDXLEff_Vae_decode = Enum_KSamplerEfficient_Vae_decode
export type Enum_EfficientLoader_Vae_name = "Baked VAE" | "blessed2.vae.pt" | "kl-f8-anime2.ckpt" | "orangemix.vae.pt" | "vae-ft-mse-840000-ema-pruned.safetensors"
export type Enum_EffLoaderSDXL_Vae_name = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_1 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_2 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_3 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_4 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_5 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_6 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_7 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_8 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_9 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_10 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_11 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_12 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_13 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_14 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_15 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_16 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_17 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_18 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_19 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_20 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_21 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_22 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_23 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_24 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_25 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_26 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_27 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_28 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_29 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_30 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_31 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_32 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_33 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_34 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_35 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_36 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_37 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_38 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_39 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_40 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_41 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_42 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_43 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_44 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_45 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_46 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_47 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_48 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_49 = Enum_EfficientLoader_Vae_name
export type Enum_XYInputCheckpoint_Vae_name_50 = Enum_EfficientLoader_Vae_name
export type Enum_EfficientLoader_Lora_name = "Character Design.safetensors" | "Isometric Cutaway.safetensors" | "None" | "Stained Glass Portrait.safetensors" | "pxll.safetensors" | "sd15\\animemix_16.safetensors" | "sd15\\animemix_v3_offset.safetensors" | "sd15\\chars\\dark_magician_girl.safetensors" | "sd15\\chars\\yorha_noDOT_2_type_b.safetensors" | "sd15\\colors\\LowRa.safetensors" | "sd15\\colors\\theovercomer8sContrastFix_sd15.safetensors" | "sd15\\colors\\theovercomer8sContrastFix_sd21768.safetensors" | "sd15\\styles\\ConstructionyardAIV3.safetensors" | "sd15\\styles\\StonepunkAI-000011.safetensors" | "sd15\\styles\\ToonYou_Style.safetensors" | "sd15\\styles\\baroqueAI.safetensors" | "sd15\\styles\\pixel_f2.safetensors" | "sd15\\test\\Moxin_10.safetensors" | "sd15\\test\\animeLineartMangaLike_v30MangaLike.safetensors" | "sd15\\utils\\charTurnBetaLora.safetensors" | "sdxl-baton-v02-e93.safetensors"
export type Enum_LoRAStacker_Lora_name_1 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_2 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_3 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_4 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_5 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_6 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_7 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_8 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_9 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_10 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_11 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_12 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_13 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_14 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_15 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_16 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_17 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_18 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_19 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_20 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_21 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_22 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_23 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_24 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_25 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_26 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_27 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_28 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_29 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_30 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_31 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_32 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_33 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_34 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_35 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_36 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_37 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_38 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_39 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_40 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_41 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_42 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_43 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_44 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_45 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_46 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_47 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_48 = Enum_EfficientLoader_Lora_name
export type Enum_LoRAStacker_Lora_name_49 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_1 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_2 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_3 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_4 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_5 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_6 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_7 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_8 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_9 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_10 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_11 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_12 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_13 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_14 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_15 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_16 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_17 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_18 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_19 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_20 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_21 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_22 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_23 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_24 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_25 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_26 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_27 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_28 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_29 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_30 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_31 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_32 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_33 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_34 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_35 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_36 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_37 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_38 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_39 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_40 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_41 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_42 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_43 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_44 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_45 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_46 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_47 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_48 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_49 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRA_Lora_name_50 = Enum_EfficientLoader_Lora_name
export type Enum_XYInputLoRAPlot_Lora_name = Enum_EfficientLoader_Lora_name
export type Enum_WASLoraLoader_Lora_name = Enum_EfficientLoader_Lora_name
export type Enum_WASLoadLora_Lora_name = Enum_EfficientLoader_Lora_name
export type Enum_EffLoaderSDXL_Refiner_ckpt_name = "AOM3A1_orangemixs.safetensors" | "AOM3A3_orangemixs.safetensors" | "AbyssOrangeMix2_hard.safetensors" | "Deliberate-inpainting.safetensors" | "None" | "Sevenof9V3.safetensors" | "albedobaseXL_v02.safetensors" | "angel1_36224.safetensors" | "anything-v3-fp16-pruned.safetensors" | "deliberate_v2.safetensors" | "dreamshaperXL10_alpha2Xl10.safetensors" | "dynavisionXLAllInOneStylized_beta0411Bakedvae.safetensors" | "ghostmix_v12.safetensors" | "juggernautXL_version3.safetensors" | "lyriel_v15.safetensors" | "mistoonAnime_v10.safetensors" | "mistoonAnime_v10Inpainting.safetensors" | "realisticVisionV20_v20.safetensors" | "revAnimated_v121.safetensors" | "revAnimated_v121Inp-inpainting.safetensors" | "revAnimated_v122.safetensors" | "sd_xl_base_1.0.safetensors" | "sd_xl_refiner_1.0.safetensors" | "toonyou_beta1.safetensors" | "v1-5-pruned-emaonly.ckpt" | "v1-5-pruned-emaonly.safetensors" | "v2-1_512-ema-pruned.safetensors" | "v2-1_768-ema-pruned.safetensors" | "wd-1-5-beta2-aesthetic-unclip-h-fp16.safetensors" | "wd-1-5-beta2-fp16.safetensors"
export type Enum_XYInputCheckpoint_Ckpt_name_1 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_2 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_3 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_4 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_5 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_6 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_7 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_8 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_9 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_10 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_11 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_12 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_13 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_14 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_15 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_16 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_17 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_18 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_19 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_20 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_21 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_22 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_23 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_24 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_25 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_26 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_27 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_28 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_29 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_30 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_31 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_32 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_33 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_34 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_35 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_36 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_37 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_38 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_39 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_40 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_41 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_42 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_43 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_44 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_45 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_46 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_47 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_48 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_49 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_XYInputCheckpoint_Ckpt_name_50 = Enum_EffLoaderSDXL_Refiner_ckpt_name
export type Enum_LoRAStacker_Input_mode = "advanced" | "simple"
export type Enum_XYPlot_XY_flip = "False" | "True"
export type Enum_XYPlot_Cache_models = Enum_XYPlot_XY_flip
export type Enum_EvaluateIntegers_Print_to_console = Enum_XYPlot_XY_flip
export type Enum_EvaluateFloats_Print_to_console = Enum_XYPlot_XY_flip
export type Enum_EvaluateStrings_Print_to_console = Enum_XYPlot_XY_flip
export type Enum_WASImageSSAOAmbientOcclusion_Enable_specular_masking = Enum_XYPlot_XY_flip
export type Enum_WASImageSSDODirectOcclusion_Colored_occlusion = Enum_XYPlot_XY_flip
export type Enum_WASImagePixelate_Dither = Enum_XYPlot_XY_flip
export type Enum_WASImagePixelate_Reverse_palette = Enum_XYPlot_XY_flip
export type Enum_WASImageVoronoiNoiseFilter_Flat = Enum_XYPlot_XY_flip
export type Enum_WASImageVoronoiNoiseFilter_RGB_output = Enum_XYPlot_XY_flip
export type Enum_XYPlot_Y_label_orientation = "Horizontal" | "Vertical"
export type Enum_XYPlot_Ksampler_output_image = "Images" | "Plot"
export type Enum_XYInputAddReturnNoise_XY_type = "add_noise" | "return_with_leftover_noise"
export type Enum_XYInputSteps_Target_parameter = "end_at_step" | "refine_at_step" | "start_at_step" | "steps"
export type Enum_XYInputSamplerScheduler_Target_parameter = "sampler" | "sampler & scheduler" | "scheduler"
export type Enum_XYInputSamplerScheduler_Sampler_1 = "None" | "ddim" | "ddpm" | "dpm_2" | "dpm_2_ancestral" | "dpm_adaptive" | "dpm_fast" | "dpmpp_2m" | "dpmpp_2m_sde" | "dpmpp_2m_sde_gpu" | "dpmpp_2s_ancestral" | "dpmpp_3m_sde" | "dpmpp_3m_sde_gpu" | "dpmpp_sde" | "dpmpp_sde_gpu" | "euler" | "euler_ancestral" | "heun" | "lms" | "uni_pc" | "uni_pc_bh2"
export type Enum_XYInputSamplerScheduler_Sampler_2 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_3 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_4 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_5 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_6 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_7 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_8 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_9 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_10 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_11 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_12 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_13 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_14 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_15 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_16 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_17 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_18 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_19 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_20 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_21 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_22 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_23 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_24 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_25 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_26 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_27 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_28 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_29 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_30 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_31 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_32 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_33 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_34 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_35 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_36 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_37 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_38 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_39 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_40 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_41 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_42 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_43 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_44 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_45 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_46 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_47 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_48 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_49 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Sampler_50 = Enum_XYInputSamplerScheduler_Sampler_1
export type Enum_XYInputSamplerScheduler_Scheduler_1 = "None" | "ddim_uniform" | "exponential" | "karras" | "normal" | "sgm_uniform" | "simple"
export type Enum_XYInputSamplerScheduler_Scheduler_2 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_3 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_4 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_5 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_6 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_7 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_8 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_9 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_10 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_11 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_12 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_13 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_14 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_15 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_16 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_17 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_18 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_19 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_20 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_21 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_22 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_23 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_24 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_25 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_26 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_27 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_28 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_29 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_30 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_31 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_32 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_33 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_34 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_35 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_36 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_37 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_38 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_39 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_40 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_41 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_42 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_43 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_44 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_45 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_46 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_47 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_48 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_49 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputSamplerScheduler_Scheduler_50 = Enum_XYInputSamplerScheduler_Scheduler_1
export type Enum_XYInputVAE_Input_mode = "VAE Batch" | "VAE Names"
export type Enum_XYInputVAE_Batch_sort = "ascending" | "descending"
export type Enum_XYInputCheckpoint_Batch_sort = Enum_XYInputVAE_Batch_sort
export type Enum_XYInputLoRA_Batch_sort = Enum_XYInputVAE_Batch_sort
export type Enum_XYInputLoRAPlot_X_batch_sort = Enum_XYInputVAE_Batch_sort
export type Enum_XYInputVAE_Vae_name_1 = "Baked VAE" | "None" | "blessed2.vae.pt" | "kl-f8-anime2.ckpt" | "orangemix.vae.pt" | "vae-ft-mse-840000-ema-pruned.safetensors"
export type Enum_XYInputVAE_Vae_name_2 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_3 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_4 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_5 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_6 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_7 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_8 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_9 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_10 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_11 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_12 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_13 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_14 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_15 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_16 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_17 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_18 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_19 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_20 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_21 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_22 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_23 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_24 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_25 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_26 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_27 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_28 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_29 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_30 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_31 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_32 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_33 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_34 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_35 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_36 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_37 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_38 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_39 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_40 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_41 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_42 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_43 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_44 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_45 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_46 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_47 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_48 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_49 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputVAE_Vae_name_50 = Enum_XYInputVAE_Vae_name_1
export type Enum_XYInputPromptSR_Target_prompt = "negative" | "positive"
export type Enum_XYInputAestheticScore_Target_ascore = Enum_XYInputPromptSR_Target_prompt
export type Enum_XYInputCheckpoint_Target_ckpt = "Base" | "Refiner"
export type Enum_XYInputClipSkip_Target_ckpt = Enum_XYInputCheckpoint_Target_ckpt
export type Enum_XYInputCheckpoint_Input_mode = "Checkpoint Batch" | "Ckpt Names" | "Ckpt Names+ClipSkip" | "Ckpt Names+ClipSkip+VAE"
export type Enum_XYInputLoRA_Input_mode = "LoRA Batch" | "LoRA Names" | "LoRA Names+Weights"
export type Enum_XYInputLoRAPlot_Input_mode = "X: LoRA Batch, Y: Clip Strength" | "X: LoRA Batch, Y: LoRA Weight" | "X: LoRA Batch, Y: Model Strength" | "X: Model Strength, Y: Clip Strength"
export type Enum_XYInputLoRAStacks_Node_state = "Enabled"
export type Enum_XYInputControlNet_Target_parameter = "end_percent" | "start_percent" | "strength"
export type Enum_XYInputControlNetPlot_Plot_type = "X: End%, Y: Start%" | "X: End%, Y: Strength" | "X: Start%, Y: End%" | "X: Start%, Y: Strength" | "X: Strength, Y: End%" | "X: Strength, Y: Start%"
export type Enum_XYInputManualXYEntry_Plot_type = "CFG Scale" | "Checkpoint" | "Clip Skip" | "Denoise" | "EndStep" | "LoRA" | "Negative Prompt S/R" | "Nothing" | "Positive Prompt S/R" | "Sampler" | "Scheduler" | "Seeds++ Batch" | "StartStep" | "Steps" | "VAE"
export type Enum_ImageOverlay_Overlay_resize = "Fit" | "None" | "Resize by rescale_factor" | "Resize to width & heigth"
export type Enum_LatentByRatio_Model = "SD1.5 512" | "SD2.1 768" | "SDXL 1024"
export type Enum_LatentByRatio_Ratio = "16:9" | "1:1" | "1:2" | "1:4" | "21:9" | "2:1" | "2:3" | "3:2" | "3:4" | "4:1" | "4:3" | "9:16" | "9:21"
export type Enum_MasqueradeMaskByText_Normalize = "no" | "yes"
export type Enum_MasqueradeCombineMasks_Clamp_result = Enum_MasqueradeMaskByText_Normalize
export type Enum_MasqueradeCombineMasks_Round_result = Enum_MasqueradeMaskByText_Normalize
export type Enum_SDXLMixSampler_Final_only = Enum_MasqueradeMaskByText_Normalize
export type Enum_MasqueradeMaskMorphology_Op = "close" | "dilate" | "erode" | "open"
export type Enum_MasqueradeCombineMasks_Op = "add" | "difference" | "greater" | "greater_or_equal" | "intersection (min)" | "multiply" | "multiply_alpha" | "union (max)"
export type Enum_MasqueradeUnaryMaskOp_Op = "abs" | "average" | "clamp" | "invert" | "round"
export type Enum_MasqueradeUnaryImageOp_Op = Enum_MasqueradeUnaryMaskOp_Op
export type Enum_MasqueradeImageToMask_Method = "alpha" | "intensity"
export type Enum_MasqueradeMaskToRegion_Constraints = "ignore" | "keep_ratio" | "keep_ratio_divisible" | "multiple_of"
export type Enum_MasqueradeMaskToRegion_Batch_behavior = "match_ratio" | "match_size"
export type Enum_MasqueradePasteByMask_Resize_behavior = "keep_ratio_fill" | "keep_ratio_fit" | "resize" | "source_size" | "source_size_unmasked"
export type Enum_MasqueradeChangeChannelCount_Kind = "RGB" | "RGBA" | "mask"
export type Enum_MasqueradeCreateRectMask_Mode = "percent" | "pixels"
export type Enum_MasqueradeCreateRectMask_Origin = "bottomleft" | "bottomright" | "topleft" | "topright"
export type Enum_MasqueradeCreateQRCode_Error_correction = "H" | "L" | "M" | "Q"
export type Enum_MasqueradeConvertColorSpace_In_space = "HSL" | "HSV" | "RGB"
export type Enum_MasqueradeConvertColorSpace_Out_space = Enum_MasqueradeConvertColorSpace_In_space
export type Enum_WASBLIPModelLoader_Blip_model = "caption" | "interrogate"
export type Enum_WASBLIPAnalyzeImage_Mode = Enum_WASBLIPModelLoader_Blip_model
export type Enum_WASBlendLatents_Operation = "add" | "difference" | "divide" | "exclusion" | "hard_light" | "linear_dodge" | "multiply" | "overlay" | "random" | "screen" | "soft_light" | "subtract"
export type Enum_WASCLIPTextEncodeNSP_Mode = "Noodle Soup Prompts" | "Wildcards"
export type Enum_WASTextParseNoodleSoupPrompts_Mode = Enum_WASCLIPTextEncodeNSP_Mode
export type Enum_WASConstantNumber_Number_type = "bool" | "float" | "integer"
export type Enum_WASRandomNumber_Number_type = Enum_WASConstantNumber_Number_type
export type Enum_WASCreateGridImage_Include_subfolders = "false" | "true"
export type Enum_WASImageCannyFilter_Enable_threshold = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageDraganPhotographyFilter_Colorize = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageFilterAdjustments_Detail_enhance = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageGradientMap_Flip_left_right = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageHighPassFilter_Color_output = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageHighPassFilter_Neutral_background = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageLoad_RGBA = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageLoad_Filename_text_extension = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImagePadding_Feather_second_pass = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageResize_Supersample = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageSave_Filename_number_start = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageSave_Lossless_webp = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageSave_Show_history = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageSave_Show_history_by_prefix = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageSave_Embed_workflow = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageSave_Show_previews = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASImageSeamlessTexture_Tiled = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASLatentUpscaleByFactorWAS_Align = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASLoadImageBatch_Allow_RGBA_output = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASLoadImageBatch_Filename_text_extension = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASMiDaSDepthApproximation_Use_cpu = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASMiDaSDepthApproximation_Invert_depth = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASMiDaSMaskImage_Use_cpu = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASMiDaSMaskImage_Threshold = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASNumberInputCondition_Return_boolean = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASTextAddTokens_Print_current_tokens = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASTextAddTokenByInput_Print_current_tokens = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASTextConcatenate_Linebreak_addition = Enum_WASCreateGridImage_Include_subfolders
export type Enum_WASCreateMorphImage_Filetype = "APNG" | "GIF"
export type Enum_WASCreateMorphImageFromPath_Filetype = Enum_WASCreateMorphImage_Filetype
export type Enum_WASCreateVideoFromPath_Codec = "AVC1" | "FFV1" | "H264" | "MP4V"
export type Enum_WASWriteToVideo_Codec = Enum_WASCreateVideoFromPath_Codec
export type Enum_WASExportAPI_Save_prompt_api = "true" | "true"
export type Enum_WASImageAnalyze_Mode = "Black White Levels" | "RGB Levels"
export type Enum_WASImageBlendingMode_Mode = "add" | "color" | "color_burn" | "color_dodge" | "darken" | "difference" | "exclusion" | "hard_light" | "hue" | "lighten" | "multiply" | "overlay" | "screen" | "soft_light"
export type Enum_WASImageColorPalette_Mode = "Chart" | "back_to_back"
export type Enum_WASImageCropFace_Cascade_xml = "haarcascade_eye.xml" | "haarcascade_frontalface_alt.xml" | "haarcascade_frontalface_alt2.xml" | "haarcascade_frontalface_alt_tree.xml" | "haarcascade_frontalface_default.xml" | "haarcascade_profileface.xml" | "haarcascade_upperbody.xml" | "lbpcascade_animeface.xml"
export type Enum_WASImagePixelate_Init_mode = "k-means++" | "none" | "random"
export type Enum_WASImagePixelate_Dither_mode = "FloydSteinberg" | "Ordered"
export type Enum_WASImagePixelate_Color_palette_mode = "Brightness" | "BrightnessAndTonal" | "Linear" | "Tonal"
export type Enum_WASImagePowerNoise_Noise_type = "blue" | "green" | "grey" | "mix" | "pink" | "white"
export type Enum_WASImageEdgeDetectionFilter_Mode = "laplacian" | "normal"
export type Enum_WASImageFlip_Mode = "horizontal" | "vertical"
export type Enum_WASImageGenerateGradient_Direction = Enum_WASImageFlip_Mode
export type Enum_WASImageHistoryLoader_Image = "...\\100.120.213.133:8188\\view?filename=ComfyUI_03162_.png&subfolder=&type=output"
export type Enum_WASImageMonitorEffectsFilter_Mode = "Digital Distortion" | "Signal Distortion" | "TV Distortion"
export type Enum_WASImageRembgRemoveBackground_Model = "isnet-anime" | "isnet-general-use" | "silueta" | "u2net" | "u2net_human_seg" | "u2netp"
export type Enum_WASImageRembgRemoveBackground_Background_color = "black" | "chroma blue" | "chroma green" | "magenta" | "none" | "white"
export type Enum_WASImageRemoveBackgroundAlpha_Mode = "background" | "foreground"
export type Enum_WASImageResize_Mode = "rescale" | "resize"
export type Enum_WASImageResize_Resampling = "bicubic" | "bilinear" | "lanczos" | "nearest"
export type Enum_WASKSamplerCycle_Scale_sampling = Enum_WASImageResize_Resampling
export type Enum_WASImageRotate_Mode = "internal" | "transpose"
export type Enum_WASImageRotate_Sampler = "bicubic" | "bilinear" | "nearest"
export type Enum_WASImageSave_Extension = "bmp" | "gif" | "jpeg" | "jpg" | "png" | "tiff" | "webp"
export type Enum_WASImageSave_Overwrite_mode = "false" | "prefix_as_filename"
export type Enum_WASImageStitch_Stitch = "bottom" | "left" | "right" | "top"
export type Enum_WASImageStyleFilter_Style = "1977" | "aden" | "brannan" | "brooklyn" | "clarendon" | "earlybird" | "fairy tale" | "gingham" | "hudson" | "inkwell" | "kelvin" | "lark" | "lofi" | "maven" | "mayfair" | "moon" | "nashville" | "perpetua" | "reyes" | "rise" | "sci-fi" | "slumber" | "stinson" | "toaster" | "valencia" | "walden" | "willow" | "xpro2"
export type Enum_WASImageFDOFFilter_Mode = "box" | "gaussian" | "mock"
export type Enum_WASImageToNoise_Output_mode = "batch" | "list"
export type Enum_WASKSamplerCycle_Latent_upscale = "area" | "bicubic" | "bilinear" | "bislerp" | "disable" | "nearest-exact"
export type Enum_WASKSamplerCycle_Pos_add_mode = "decrement" | "increment"
export type Enum_WASKSamplerCycle_Neg_add_mode = Enum_WASKSamplerCycle_Pos_add_mode
export type Enum_WASKSamplerCycle_Steps_control = Enum_WASKSamplerCycle_Pos_add_mode
export type Enum_WASNumberCounter_Mode = Enum_WASKSamplerCycle_Pos_add_mode
export type Enum_WASLatentUpscaleByFactorWAS_Mode = "area" | "bicubic" | "bilinear" | "nearest"
export type Enum_WASLoadImageBatch_Mode = "incremental_image" | "single_image"
export type Enum_WASMaskCropRegion_Region_type = "dominant" | "minority"
export type Enum_WASMiDaSModelLoader_Midas_model = "DPT_Hybrid" | "DPT_Large"
export type Enum_WASMiDaSDepthApproximation_Midas_type = Enum_WASMiDaSModelLoader_Midas_model
export type Enum_WASMiDaSMaskImage_Midas_model = "DPT_Hybrid" | "DPT_Large" | "DPT_Small"
export type Enum_WASMiDaSMaskImage_Remove = "background" | "foregroud"
export type Enum_WASNumberCounter_Number_type = "float" | "integer"
export type Enum_WASNumberOperation_Operation = "addition" | "division" | "does not equal" | "equals" | "exponentiation" | "floor division" | "greater-than" | "greater-than or equals" | "less-than" | "less-than or equals" | "modulus" | "multiplication" | "subtraction"
export type Enum_WASNumberInputCondition_Comparison = "and" | "divisible by" | "does not equal" | "equals" | "factor of" | "greater-than" | "greater-than or equals" | "if A even" | "if A odd" | "if A prime" | "less-than" | "less-than or equals" | "or"
export type Enum_WASPromptStylesSelector_Style = "None"
export type Enum_WASPromptMultipleStylesSelector_Style1 = Enum_WASPromptStylesSelector_Style
export type Enum_WASPromptMultipleStylesSelector_Style2 = Enum_WASPromptStylesSelector_Style
export type Enum_WASPromptMultipleStylesSelector_Style3 = Enum_WASPromptStylesSelector_Style
export type Enum_WASPromptMultipleStylesSelector_Style4 = Enum_WASPromptStylesSelector_Style
export type Enum_WASSAMModelLoader_Model_size = "ViT-B" | "ViT-H" | "ViT-L"
export type Enum_WASTextCompare_Mode = "difference" | "similarity"
export type Enum_WASTextFileHistoryLoader_File = "No History"
export type Enum_WASTextLoadLineFromFile_Mode = "automatic" | "index"
export type Enum_WASTextStringTruncate_Truncate_by = "characters" | "words"
export type Enum_WASTextStringTruncate_Truncate_from = "beginning" | "end"
export type Enum_WASTrueRandomOrgNumberGenerator_Mode = "fixed" | "random"
export type Enum_WASVideoDumpFrames_Extension = "gif" | "jpg" | "png" | "tiff"

// 7. INTERFACES --------------------------
export interface HasSingle_LATENT { _LATENT: LATENT } // prettier-ignore
export interface HasSingle_MODEL { _MODEL: MODEL } // prettier-ignore
export interface HasSingle_INT { _INT: INT } // prettier-ignore
export interface HasSingle_FLOAT { _FLOAT: FLOAT } // prettier-ignore
export interface HasSingle_CONDITIONING { _CONDITIONING: CONDITIONING } // prettier-ignore
export interface HasSingle_CLIP { _CLIP: CLIP } // prettier-ignore
export interface HasSingle_VAE { _VAE: VAE } // prettier-ignore
export interface HasSingle_STRING { _STRING: STRING } // prettier-ignore
export interface HasSingle_IMAGE { _IMAGE: IMAGE } // prettier-ignore
export interface HasSingle_MASK { _MASK: MASK } // prettier-ignore
export interface HasSingle_CLIP_VISION_OUTPUT { _CLIP_VISION_OUTPUT: CLIP_VISION_OUTPUT } // prettier-ignore
export interface HasSingle_CLIP_VISION { _CLIP_VISION: CLIP_VISION } // prettier-ignore
export interface HasSingle_STYLE_MODEL { _STYLE_MODEL: STYLE_MODEL } // prettier-ignore
export interface HasSingle_CONTROL_NET { _CONTROL_NET: CONTROL_NET } // prettier-ignore
export interface HasSingle_GLIGEN { _GLIGEN: GLIGEN } // prettier-ignore
export interface HasSingle_UPSCALE_MODEL { _UPSCALE_MODEL: UPSCALE_MODEL } // prettier-ignore
export interface HasSingle_BOOLEAN { _BOOLEAN: BOOLEAN } // prettier-ignore
export interface HasSingle_SAM_MODEL { _SAM_MODEL: SAM_MODEL } // prettier-ignore
export interface HasSingle_BBOX_DETECTOR { _BBOX_DETECTOR: BBOX_DETECTOR } // prettier-ignore
export interface HasSingle_ONNX_DETECTOR { _ONNX_DETECTOR: ONNX_DETECTOR } // prettier-ignore
export interface HasSingle_SEGS { _SEGS: SEGS } // prettier-ignore
export interface HasSingle_DETAILER_HOOK { _DETAILER_HOOK: DETAILER_HOOK } // prettier-ignore
export interface HasSingle_BASIC_PIPE { _BASIC_PIPE: BASIC_PIPE } // prettier-ignore
export interface HasSingle_MASKS { _MASKS: MASKS } // prettier-ignore
export interface HasSingle_DETAILER_PIPE { _DETAILER_PIPE: DETAILER_PIPE } // prettier-ignore
export interface HasSingle_SEGM_DETECTOR { _SEGM_DETECTOR: SEGM_DETECTOR } // prettier-ignore
export interface HasSingle_UPSCALER { _UPSCALER: UPSCALER } // prettier-ignore
export interface HasSingle_PK_HOOK { _PK_HOOK: PK_HOOK } // prettier-ignore
export interface HasSingle_KSAMPLER { _KSAMPLER: KSAMPLER } // prettier-ignore
export interface HasSingle_SEGS_PREPROCESSOR { _SEGS_PREPROCESSOR: SEGS_PREPROCESSOR } // prettier-ignore
export interface HasSingle_SEGS_HEADER { _SEGS_HEADER: SEGS_HEADER } // prettier-ignore
export interface HasSingle_SEG_ELT { _SEG_ELT: SEG_ELT } // prettier-ignore
export interface HasSingle_SEG_ELT_crop_region { _SEG_ELT_crop_region: SEG_ELT_crop_region } // prettier-ignore
export interface HasSingle_SEG_ELT_bbox { _SEG_ELT_bbox: SEG_ELT_bbox } // prettier-ignore
export interface HasSingle_SEG_ELT_control_net_wrapper { _SEG_ELT_control_net_wrapper: SEG_ELT_control_net_wrapper } // prettier-ignore
export interface HasSingle_KSAMPLER_ADVANCED { _KSAMPLER_ADVANCED: KSAMPLER_ADVANCED } // prettier-ignore
export interface HasSingle_STAR { _STAR: STAR } // prettier-ignore
export interface HasSingle_REGIONAL_PROMPTS { _REGIONAL_PROMPTS: REGIONAL_PROMPTS } // prettier-ignore
export interface HasSingle_XY { _XY: XY } // prettier-ignore
export interface HasSingle_ZIPPED_PROMPT { _ZIPPED_PROMPT: ZIPPED_PROMPT } // prettier-ignore
export interface HasSingle_SCRIPT { _SCRIPT: SCRIPT } // prettier-ignore
export interface HasSingle_SDXL_TUPLE { _SDXL_TUPLE: SDXL_TUPLE } // prettier-ignore
export interface HasSingle_DEPENDENCIES { _DEPENDENCIES: DEPENDENCIES } // prettier-ignore
export interface HasSingle_LORA_STACK { _LORA_STACK: LORA_STACK } // prettier-ignore
export interface HasSingle_CONTROL_NET_STACK { _CONTROL_NET_STACK: CONTROL_NET_STACK } // prettier-ignore
export interface HasSingle_MASK_MAPPING { _MASK_MAPPING: MASK_MAPPING } // prettier-ignore
export interface HasSingle_BLIP_MODEL { _BLIP_MODEL: BLIP_MODEL } // prettier-ignore
export interface HasSingle_NUMBER { _NUMBER: NUMBER } // prettier-ignore
export interface HasSingle_CLIPSEG_MODEL { _CLIPSEG_MODEL: CLIPSEG_MODEL } // prettier-ignore
export interface HasSingle_DICT { _DICT: DICT } // prettier-ignore
export interface HasSingle_LIST { _LIST: LIST } // prettier-ignore
export interface HasSingle_CROP_DATA { _CROP_DATA: CROP_DATA } // prettier-ignore
export interface HasSingle_SEED { _SEED: SEED } // prettier-ignore
export interface HasSingle_MIDAS_MODEL { _MIDAS_MODEL: MIDAS_MODEL } // prettier-ignore
export interface HasSingle_SAM_PARAMETERS { _SAM_PARAMETERS: SAM_PARAMETERS } // prettier-ignore
export interface HasSingle_IMAGE_BOUNDS { _IMAGE_BOUNDS: IMAGE_BOUNDS } // prettier-ignore

// 8. NODES -------------------------------
// KSampler [sampling]
export interface KSampler extends HasSingle_LATENT, ComfyNode<KSampler_input> {
    nameInComfy: "KSampler"
    LATENT: Slot<'LATENT', 0>,
}
export interface KSampler_input {
    model: _MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 step=0.5 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
}

// CheckpointLoaderSimple [loaders]
export interface CheckpointLoaderSimple extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<CheckpointLoaderSimple_input> {
    nameInComfy: "CheckpointLoaderSimple"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    VAE: Slot<'VAE', 2>,
}
export interface CheckpointLoaderSimple_input {
    ckpt_name: Enum_CheckpointLoaderSimple_Ckpt_name
}

// CLIPTextEncode [conditioning]
export interface CLIPTextEncode extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncode_input> {
    nameInComfy: "CLIPTextEncode"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface CLIPTextEncode_input {
    /** */
    text: _STRING
    clip: _CLIP
}

// CLIPSetLastLayer [conditioning]
export interface CLIPSetLastLayer extends HasSingle_CLIP, ComfyNode<CLIPSetLastLayer_input> {
    nameInComfy: "CLIPSetLastLayer"
    CLIP: Slot<'CLIP', 0>,
}
export interface CLIPSetLastLayer_input {
    clip: _CLIP
    /** default=-1 min=-1 max=-1 step=1 */
    stop_at_clip_layer?: _INT
}

// VAEDecode [latent]
export interface VAEDecode extends HasSingle_IMAGE, ComfyNode<VAEDecode_input> {
    nameInComfy: "VAEDecode"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface VAEDecode_input {
    samples: _LATENT
    vae: _VAE
}

// VAEEncode [latent]
export interface VAEEncode extends HasSingle_LATENT, ComfyNode<VAEEncode_input> {
    nameInComfy: "VAEEncode"
    LATENT: Slot<'LATENT', 0>,
}
export interface VAEEncode_input {
    pixels: _IMAGE
    vae: _VAE
}

// VAEEncodeForInpaint [latent_inpaint]
export interface VAEEncodeForInpaint extends HasSingle_LATENT, ComfyNode<VAEEncodeForInpaint_input> {
    nameInComfy: "VAEEncodeForInpaint"
    LATENT: Slot<'LATENT', 0>,
}
export interface VAEEncodeForInpaint_input {
    pixels: _IMAGE
    vae: _VAE
    mask: _MASK
    /** default=6 min=64 max=64 step=1 */
    grow_mask_by?: _INT
}

// VAELoader [loaders]
export interface VAELoader extends HasSingle_VAE, ComfyNode<VAELoader_input> {
    nameInComfy: "VAELoader"
    VAE: Slot<'VAE', 0>,
}
export interface VAELoader_input {
    vae_name: Enum_VAELoader_Vae_name
}

// EmptyLatentImage [latent]
export interface EmptyLatentImage extends HasSingle_LATENT, ComfyNode<EmptyLatentImage_input> {
    nameInComfy: "EmptyLatentImage"
    LATENT: Slot<'LATENT', 0>,
}
export interface EmptyLatentImage_input {
    /** default=512 min=8192 max=8192 step=8 */
    width?: _INT
    /** default=512 min=8192 max=8192 step=8 */
    height?: _INT
    /** default=1 min=4096 max=4096 */
    batch_size?: _INT
}

// LatentUpscale [latent]
export interface LatentUpscale extends HasSingle_LATENT, ComfyNode<LatentUpscale_input> {
    nameInComfy: "LatentUpscale"
    LATENT: Slot<'LATENT', 0>,
}
export interface LatentUpscale_input {
    samples: _LATENT
    upscale_method: Enum_LatentUpscale_Upscale_method
    /** default=512 min=8192 max=8192 step=8 */
    width?: _INT
    /** default=512 min=8192 max=8192 step=8 */
    height?: _INT
    crop: Enum_LatentUpscale_Crop
}

// LatentUpscaleBy [latent]
export interface LatentUpscaleBy extends HasSingle_LATENT, ComfyNode<LatentUpscaleBy_input> {
    nameInComfy: "LatentUpscaleBy"
    LATENT: Slot<'LATENT', 0>,
}
export interface LatentUpscaleBy_input {
    samples: _LATENT
    upscale_method: Enum_LatentUpscale_Upscale_method
    /** default=1.5 min=8 max=8 step=0.01 */
    scale_by?: _FLOAT
}

// LatentFromBatch [latent_batch]
export interface LatentFromBatch extends HasSingle_LATENT, ComfyNode<LatentFromBatch_input> {
    nameInComfy: "LatentFromBatch"
    LATENT: Slot<'LATENT', 0>,
}
export interface LatentFromBatch_input {
    samples: _LATENT
    /** default=0 min=63 max=63 */
    batch_index?: _INT
    /** default=1 min=64 max=64 */
    length?: _INT
}

// RepeatLatentBatch [latent_batch]
export interface RepeatLatentBatch extends HasSingle_LATENT, ComfyNode<RepeatLatentBatch_input> {
    nameInComfy: "RepeatLatentBatch"
    LATENT: Slot<'LATENT', 0>,
}
export interface RepeatLatentBatch_input {
    samples: _LATENT
    /** default=1 min=64 max=64 */
    amount?: _INT
}

// SaveImage [image]
export interface SaveImage extends ComfyNode<SaveImage_input> {
    nameInComfy: "SaveImage"
}
export interface SaveImage_input {
    images: _IMAGE
    /** default="ComfyUI" */
    filename_prefix?: _STRING
}

// PreviewImage [image]
export interface PreviewImage extends ComfyNode<PreviewImage_input> {
    nameInComfy: "PreviewImage"
}
export interface PreviewImage_input {
    images: _IMAGE
}

// LoadImage [image]
export interface LoadImage extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<LoadImage_input> {
    nameInComfy: "LoadImage"
    IMAGE: Slot<'IMAGE', 0>,
    MASK: Slot<'MASK', 1>,
}
export interface LoadImage_input {
    /** */
    image: Enum_LoadImage_Image
}

// LoadImageMask [mask]
export interface LoadImageMask extends HasSingle_MASK, ComfyNode<LoadImageMask_input> {
    nameInComfy: "LoadImageMask"
    MASK: Slot<'MASK', 0>,
}
export interface LoadImageMask_input {
    /** */
    image: Enum_LoadImage_Image
    channel: Enum_LoadImageMask_Channel
}

// ImageScale [image_upscaling]
export interface ImageScale extends HasSingle_IMAGE, ComfyNode<ImageScale_input> {
    nameInComfy: "ImageScale"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImageScale_input {
    image: _IMAGE
    upscale_method: Enum_ImageScale_Upscale_method
    /** default=512 min=8192 max=8192 step=1 */
    width?: _INT
    /** default=512 min=8192 max=8192 step=1 */
    height?: _INT
    crop: Enum_LatentUpscale_Crop
}

// ImageScaleBy [image_upscaling]
export interface ImageScaleBy extends HasSingle_IMAGE, ComfyNode<ImageScaleBy_input> {
    nameInComfy: "ImageScaleBy"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImageScaleBy_input {
    image: _IMAGE
    upscale_method: Enum_ImageScale_Upscale_method
    /** default=1 min=8 max=8 step=0.01 */
    scale_by?: _FLOAT
}

// ImageInvert [image]
export interface ImageInvert extends HasSingle_IMAGE, ComfyNode<ImageInvert_input> {
    nameInComfy: "ImageInvert"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImageInvert_input {
    image: _IMAGE
}

// ImageBatch [image]
export interface ImageBatch extends HasSingle_IMAGE, ComfyNode<ImageBatch_input> {
    nameInComfy: "ImageBatch"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImageBatch_input {
    image1: _IMAGE
    image2: _IMAGE
}

// ImagePadForOutpaint [image]
export interface ImagePadForOutpaint extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImagePadForOutpaint_input> {
    nameInComfy: "ImagePadForOutpaint"
    IMAGE: Slot<'IMAGE', 0>,
    MASK: Slot<'MASK', 1>,
}
export interface ImagePadForOutpaint_input {
    image: _IMAGE
    /** default=0 min=8192 max=8192 step=8 */
    left?: _INT
    /** default=0 min=8192 max=8192 step=8 */
    top?: _INT
    /** default=0 min=8192 max=8192 step=8 */
    right?: _INT
    /** default=0 min=8192 max=8192 step=8 */
    bottom?: _INT
    /** default=40 min=8192 max=8192 step=1 */
    feathering?: _INT
}

// EmptyImage [image]
export interface EmptyImage extends HasSingle_IMAGE, ComfyNode<EmptyImage_input> {
    nameInComfy: "EmptyImage"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface EmptyImage_input {
    /** default=512 min=8192 max=8192 step=1 */
    width?: _INT
    /** default=512 min=8192 max=8192 step=1 */
    height?: _INT
    /** default=1 min=4096 max=4096 */
    batch_size?: _INT
    /** default=0 min=16777215 max=16777215 step=1 */
    color?: _INT
}

// ConditioningAverage [conditioning]
export interface ConditioningAverage extends HasSingle_CONDITIONING, ComfyNode<ConditioningAverage_input> {
    nameInComfy: "ConditioningAverage"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface ConditioningAverage_input {
    conditioning_to: _CONDITIONING
    conditioning_from: _CONDITIONING
    /** default=1 min=1 max=1 step=0.01 */
    conditioning_to_strength?: _FLOAT
}

// ConditioningCombine [conditioning]
export interface ConditioningCombine extends HasSingle_CONDITIONING, ComfyNode<ConditioningCombine_input> {
    nameInComfy: "ConditioningCombine"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface ConditioningCombine_input {
    conditioning_1: _CONDITIONING
    conditioning_2: _CONDITIONING
}

// ConditioningConcat [conditioning]
export interface ConditioningConcat extends HasSingle_CONDITIONING, ComfyNode<ConditioningConcat_input> {
    nameInComfy: "ConditioningConcat"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface ConditioningConcat_input {
    conditioning_to: _CONDITIONING
    conditioning_from: _CONDITIONING
}

// ConditioningSetArea [conditioning]
export interface ConditioningSetArea extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetArea_input> {
    nameInComfy: "ConditioningSetArea"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface ConditioningSetArea_input {
    conditioning: _CONDITIONING
    /** default=64 min=8192 max=8192 step=8 */
    width?: _INT
    /** default=64 min=8192 max=8192 step=8 */
    height?: _INT
    /** default=0 min=8192 max=8192 step=8 */
    x?: _INT
    /** default=0 min=8192 max=8192 step=8 */
    y?: _INT
    /** default=1 min=10 max=10 step=0.01 */
    strength?: _FLOAT
}

// ConditioningSetAreaPercentage [conditioning]
export interface ConditioningSetAreaPercentage extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetAreaPercentage_input> {
    nameInComfy: "ConditioningSetAreaPercentage"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface ConditioningSetAreaPercentage_input {
    conditioning: _CONDITIONING
    /** default=1 min=1 max=1 step=0.01 */
    width?: _FLOAT
    /** default=1 min=1 max=1 step=0.01 */
    height?: _FLOAT
    /** default=0 min=1 max=1 step=0.01 */
    x?: _FLOAT
    /** default=0 min=1 max=1 step=0.01 */
    y?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    strength?: _FLOAT
}

// ConditioningSetMask [conditioning]
export interface ConditioningSetMask extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetMask_input> {
    nameInComfy: "ConditioningSetMask"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface ConditioningSetMask_input {
    conditioning: _CONDITIONING
    mask: _MASK
    /** default=1 min=10 max=10 step=0.01 */
    strength?: _FLOAT
    set_cond_area: Enum_ConditioningSetMask_Set_cond_area
}

// KSamplerAdvanced [sampling]
export interface KSamplerAdvanced extends HasSingle_LATENT, ComfyNode<KSamplerAdvanced_input> {
    nameInComfy: "KSamplerAdvanced"
    LATENT: Slot<'LATENT', 0>,
}
export interface KSamplerAdvanced_input {
    model: _MODEL
    add_noise: Enum_KSamplerAdvanced_Add_noise
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    noise_seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 step=0.5 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
    /** default=0 min=10000 max=10000 */
    start_at_step?: _INT
    /** default=10000 min=10000 max=10000 */
    end_at_step?: _INT
    return_with_leftover_noise: Enum_KSamplerAdvanced_Add_noise
}

// SetLatentNoiseMask [latent_inpaint]
export interface SetLatentNoiseMask extends HasSingle_LATENT, ComfyNode<SetLatentNoiseMask_input> {
    nameInComfy: "SetLatentNoiseMask"
    LATENT: Slot<'LATENT', 0>,
}
export interface SetLatentNoiseMask_input {
    samples: _LATENT
    mask: _MASK
}

// LatentComposite [latent]
export interface LatentComposite extends HasSingle_LATENT, ComfyNode<LatentComposite_input> {
    nameInComfy: "LatentComposite"
    LATENT: Slot<'LATENT', 0>,
}
export interface LatentComposite_input {
    samples_to: _LATENT
    samples_from: _LATENT
    /** default=0 min=8192 max=8192 step=8 */
    x?: _INT
    /** default=0 min=8192 max=8192 step=8 */
    y?: _INT
    /** default=0 min=8192 max=8192 step=8 */
    feather?: _INT
}

// LatentBlend [_for_testing]
export interface LatentBlend extends HasSingle_LATENT, ComfyNode<LatentBlend_input> {
    nameInComfy: "LatentBlend"
    LATENT: Slot<'LATENT', 0>,
}
export interface LatentBlend_input {
    samples1: _LATENT
    samples2: _LATENT
    /** default=0.5 min=1 max=1 step=0.01 */
    blend_factor?: _FLOAT
}

// LatentRotate [latent_transform]
export interface LatentRotate extends HasSingle_LATENT, ComfyNode<LatentRotate_input> {
    nameInComfy: "LatentRotate"
    LATENT: Slot<'LATENT', 0>,
}
export interface LatentRotate_input {
    samples: _LATENT
    rotation: Enum_LatentRotate_Rotation
}

// LatentFlip [latent_transform]
export interface LatentFlip extends HasSingle_LATENT, ComfyNode<LatentFlip_input> {
    nameInComfy: "LatentFlip"
    LATENT: Slot<'LATENT', 0>,
}
export interface LatentFlip_input {
    samples: _LATENT
    flip_method: Enum_LatentFlip_Flip_method
}

// LatentCrop [latent_transform]
export interface LatentCrop extends HasSingle_LATENT, ComfyNode<LatentCrop_input> {
    nameInComfy: "LatentCrop"
    LATENT: Slot<'LATENT', 0>,
}
export interface LatentCrop_input {
    samples: _LATENT
    /** default=512 min=8192 max=8192 step=8 */
    width?: _INT
    /** default=512 min=8192 max=8192 step=8 */
    height?: _INT
    /** default=0 min=8192 max=8192 step=8 */
    x?: _INT
    /** default=0 min=8192 max=8192 step=8 */
    y?: _INT
}

// LoraLoader [loaders]
export interface LoraLoader extends HasSingle_MODEL, HasSingle_CLIP, ComfyNode<LoraLoader_input> {
    nameInComfy: "LoraLoader"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
}
export interface LoraLoader_input {
    model: _MODEL
    clip: _CLIP
    lora_name: Enum_LoraLoader_Lora_name
    /** default=1 min=20 max=20 step=0.01 */
    strength_model?: _FLOAT
    /** default=1 min=20 max=20 step=0.01 */
    strength_clip?: _FLOAT
}

// CLIPLoader [advanced_loaders]
export interface CLIPLoader extends HasSingle_CLIP, ComfyNode<CLIPLoader_input> {
    nameInComfy: "CLIPLoader"
    CLIP: Slot<'CLIP', 0>,
}
export interface CLIPLoader_input {
    clip_name: Enum_CLIPLoader_Clip_name
}

// UNETLoader [advanced_loaders]
export interface UNETLoader extends HasSingle_MODEL, ComfyNode<UNETLoader_input> {
    nameInComfy: "UNETLoader"
    MODEL: Slot<'MODEL', 0>,
}
export interface UNETLoader_input {
    unet_name: Enum_UNETLoader_Unet_name
}

// DualCLIPLoader [advanced_loaders]
export interface DualCLIPLoader extends HasSingle_CLIP, ComfyNode<DualCLIPLoader_input> {
    nameInComfy: "DualCLIPLoader"
    CLIP: Slot<'CLIP', 0>,
}
export interface DualCLIPLoader_input {
    clip_name1: Enum_CLIPLoader_Clip_name
    clip_name2: Enum_CLIPLoader_Clip_name
}

// CLIPVisionEncode [conditioning]
export interface CLIPVisionEncode extends HasSingle_CLIP_VISION_OUTPUT, ComfyNode<CLIPVisionEncode_input> {
    nameInComfy: "CLIPVisionEncode"
    CLIP_VISION_OUTPUT: Slot<'CLIP_VISION_OUTPUT', 0>,
}
export interface CLIPVisionEncode_input {
    clip_vision: _CLIP_VISION
    image: _IMAGE
}

// StyleModelApply [conditioning_style_model]
export interface StyleModelApply extends HasSingle_CONDITIONING, ComfyNode<StyleModelApply_input> {
    nameInComfy: "StyleModelApply"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface StyleModelApply_input {
    conditioning: _CONDITIONING
    style_model: _STYLE_MODEL
    clip_vision_output: _CLIP_VISION_OUTPUT
}

// unCLIPConditioning [conditioning]
export interface UnCLIPConditioning extends HasSingle_CONDITIONING, ComfyNode<UnCLIPConditioning_input> {
    nameInComfy: "unCLIPConditioning"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface UnCLIPConditioning_input {
    conditioning: _CONDITIONING
    clip_vision_output: _CLIP_VISION_OUTPUT
    /** default=1 min=10 max=10 step=0.01 */
    strength?: _FLOAT
    /** default=0 min=1 max=1 step=0.01 */
    noise_augmentation?: _FLOAT
}

// ControlNetApply [conditioning]
export interface ControlNetApply extends HasSingle_CONDITIONING, ComfyNode<ControlNetApply_input> {
    nameInComfy: "ControlNetApply"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface ControlNetApply_input {
    conditioning: _CONDITIONING
    control_net: _CONTROL_NET
    image: _IMAGE
    /** default=1 min=10 max=10 step=0.01 */
    strength?: _FLOAT
}

// ControlNetApplyAdvanced [conditioning]
export interface ControlNetApplyAdvanced extends ComfyNode<ControlNetApplyAdvanced_input> {
    nameInComfy: "ControlNetApplyAdvanced"
    CONDITIONING: Slot<'CONDITIONING', 0>,
    CONDITIONING_1: Slot<'CONDITIONING', 1>,
}
export interface ControlNetApplyAdvanced_input {
    positive: _CONDITIONING
    negative: _CONDITIONING
    control_net: _CONTROL_NET
    image: _IMAGE
    /** default=1 min=10 max=10 step=0.01 */
    strength?: _FLOAT
    /** default=0 min=1 max=1 step=0.001 */
    start_percent?: _FLOAT
    /** default=1 min=1 max=1 step=0.001 */
    end_percent?: _FLOAT
}

// ControlNetLoader [loaders]
export interface ControlNetLoader extends HasSingle_CONTROL_NET, ComfyNode<ControlNetLoader_input> {
    nameInComfy: "ControlNetLoader"
    CONTROL_NET: Slot<'CONTROL_NET', 0>,
}
export interface ControlNetLoader_input {
    control_net_name: Enum_ControlNetLoader_Control_net_name
}

// DiffControlNetLoader [loaders]
export interface DiffControlNetLoader extends HasSingle_CONTROL_NET, ComfyNode<DiffControlNetLoader_input> {
    nameInComfy: "DiffControlNetLoader"
    CONTROL_NET: Slot<'CONTROL_NET', 0>,
}
export interface DiffControlNetLoader_input {
    model: _MODEL
    control_net_name: Enum_ControlNetLoader_Control_net_name
}

// StyleModelLoader [loaders]
export interface StyleModelLoader extends HasSingle_STYLE_MODEL, ComfyNode<StyleModelLoader_input> {
    nameInComfy: "StyleModelLoader"
    STYLE_MODEL: Slot<'STYLE_MODEL', 0>,
}
export interface StyleModelLoader_input {
    style_model_name: Enum_CLIPLoader_Clip_name
}

// CLIPVisionLoader [loaders]
export interface CLIPVisionLoader extends HasSingle_CLIP_VISION, ComfyNode<CLIPVisionLoader_input> {
    nameInComfy: "CLIPVisionLoader"
    CLIP_VISION: Slot<'CLIP_VISION', 0>,
}
export interface CLIPVisionLoader_input {
    clip_name: Enum_CLIPVisionLoader_Clip_name
}

// VAEDecodeTiled [_for_testing]
export interface VAEDecodeTiled extends HasSingle_IMAGE, ComfyNode<VAEDecodeTiled_input> {
    nameInComfy: "VAEDecodeTiled"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface VAEDecodeTiled_input {
    samples: _LATENT
    vae: _VAE
    /** default=512 min=4096 max=4096 step=64 */
    tile_size?: _INT
}

// VAEEncodeTiled [_for_testing]
export interface VAEEncodeTiled extends HasSingle_LATENT, ComfyNode<VAEEncodeTiled_input> {
    nameInComfy: "VAEEncodeTiled"
    LATENT: Slot<'LATENT', 0>,
}
export interface VAEEncodeTiled_input {
    pixels: _IMAGE
    vae: _VAE
    /** default=512 min=4096 max=4096 step=64 */
    tile_size?: _INT
}

// unCLIPCheckpointLoader [loaders]
export interface UnCLIPCheckpointLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, HasSingle_CLIP_VISION, ComfyNode<UnCLIPCheckpointLoader_input> {
    nameInComfy: "unCLIPCheckpointLoader"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    VAE: Slot<'VAE', 2>,
    CLIP_VISION: Slot<'CLIP_VISION', 3>,
}
export interface UnCLIPCheckpointLoader_input {
    ckpt_name: Enum_CheckpointLoaderSimple_Ckpt_name
}

// GLIGENLoader [loaders]
export interface GLIGENLoader extends HasSingle_GLIGEN, ComfyNode<GLIGENLoader_input> {
    nameInComfy: "GLIGENLoader"
    GLIGEN: Slot<'GLIGEN', 0>,
}
export interface GLIGENLoader_input {
    gligen_name: Enum_CLIPLoader_Clip_name
}

// GLIGENTextBoxApply [conditioning_gligen]
export interface GLIGENTextBoxApply extends HasSingle_CONDITIONING, ComfyNode<GLIGENTextBoxApply_input> {
    nameInComfy: "GLIGENTextBoxApply"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface GLIGENTextBoxApply_input {
    conditioning_to: _CONDITIONING
    clip: _CLIP
    gligen_textbox_model: _GLIGEN
    /** */
    text: _STRING
    /** default=64 min=8192 max=8192 step=8 */
    width?: _INT
    /** default=64 min=8192 max=8192 step=8 */
    height?: _INT
    /** default=0 min=8192 max=8192 step=8 */
    x?: _INT
    /** default=0 min=8192 max=8192 step=8 */
    y?: _INT
}

// CheckpointLoader [advanced_loaders]
export interface CheckpointLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<CheckpointLoader_input> {
    nameInComfy: "CheckpointLoader"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    VAE: Slot<'VAE', 2>,
}
export interface CheckpointLoader_input {
    config_name: Enum_CheckpointLoader_Config_name
    ckpt_name: Enum_CheckpointLoaderSimple_Ckpt_name
}

// DiffusersLoader [advanced_loaders_deprecated]
export interface DiffusersLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<DiffusersLoader_input> {
    nameInComfy: "DiffusersLoader"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    VAE: Slot<'VAE', 2>,
}
export interface DiffusersLoader_input {
    model_path: Enum_CLIPLoader_Clip_name
}

// LoadLatent [_for_testing]
export interface LoadLatent extends HasSingle_LATENT, ComfyNode<LoadLatent_input> {
    nameInComfy: "LoadLatent"
    LATENT: Slot<'LATENT', 0>,
}
export interface LoadLatent_input {
    latent: Enum_CLIPLoader_Clip_name
}

// SaveLatent [_for_testing]
export interface SaveLatent extends ComfyNode<SaveLatent_input> {
    nameInComfy: "SaveLatent"
}
export interface SaveLatent_input {
    samples: _LATENT
    /** default="latents/ComfyUI" */
    filename_prefix?: _STRING
}

// ConditioningZeroOut [advanced_conditioning]
export interface ConditioningZeroOut extends HasSingle_CONDITIONING, ComfyNode<ConditioningZeroOut_input> {
    nameInComfy: "ConditioningZeroOut"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface ConditioningZeroOut_input {
    conditioning: _CONDITIONING
}

// ConditioningSetTimestepRange [advanced_conditioning]
export interface ConditioningSetTimestepRange extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetTimestepRange_input> {
    nameInComfy: "ConditioningSetTimestepRange"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface ConditioningSetTimestepRange_input {
    conditioning: _CONDITIONING
    /** default=0 min=1 max=1 step=0.001 */
    start?: _FLOAT
    /** default=1 min=1 max=1 step=0.001 */
    end?: _FLOAT
}

// LatentAdd [latent_advanced]
export interface LatentAdd extends HasSingle_LATENT, ComfyNode<LatentAdd_input> {
    nameInComfy: "LatentAdd"
    LATENT: Slot<'LATENT', 0>,
}
export interface LatentAdd_input {
    samples1: _LATENT
    samples2: _LATENT
}

// LatentSubtract [latent_advanced]
export interface LatentSubtract extends HasSingle_LATENT, ComfyNode<LatentSubtract_input> {
    nameInComfy: "LatentSubtract"
    LATENT: Slot<'LATENT', 0>,
}
export interface LatentSubtract_input {
    samples1: _LATENT
    samples2: _LATENT
}

// LatentMultiply [latent_advanced]
export interface LatentMultiply extends HasSingle_LATENT, ComfyNode<LatentMultiply_input> {
    nameInComfy: "LatentMultiply"
    LATENT: Slot<'LATENT', 0>,
}
export interface LatentMultiply_input {
    samples: _LATENT
    /** default=1 min=10 max=10 step=0.01 */
    multiplier?: _FLOAT
}

// HypernetworkLoader [loaders]
export interface HypernetworkLoader extends HasSingle_MODEL, ComfyNode<HypernetworkLoader_input> {
    nameInComfy: "HypernetworkLoader"
    MODEL: Slot<'MODEL', 0>,
}
export interface HypernetworkLoader_input {
    model: _MODEL
    hypernetwork_name: Enum_CLIPLoader_Clip_name
    /** default=1 min=10 max=10 step=0.01 */
    strength?: _FLOAT
}

// UpscaleModelLoader [loaders]
export interface UpscaleModelLoader extends HasSingle_UPSCALE_MODEL, ComfyNode<UpscaleModelLoader_input> {
    nameInComfy: "UpscaleModelLoader"
    UPSCALE_MODEL: Slot<'UPSCALE_MODEL', 0>,
}
export interface UpscaleModelLoader_input {
    model_name: Enum_CLIPLoader_Clip_name
}

// ImageUpscaleWithModel [image_upscaling]
export interface ImageUpscaleWithModel extends HasSingle_IMAGE, ComfyNode<ImageUpscaleWithModel_input> {
    nameInComfy: "ImageUpscaleWithModel"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImageUpscaleWithModel_input {
    upscale_model: _UPSCALE_MODEL
    image: _IMAGE
}

// ImageBlend [image_postprocessing]
export interface ImageBlend extends HasSingle_IMAGE, ComfyNode<ImageBlend_input> {
    nameInComfy: "ImageBlend"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImageBlend_input {
    image1: _IMAGE
    image2: _IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    blend_factor?: _FLOAT
    blend_mode: Enum_ImageBlend_Blend_mode
}

// ImageBlur [image_postprocessing]
export interface ImageBlur extends HasSingle_IMAGE, ComfyNode<ImageBlur_input> {
    nameInComfy: "ImageBlur"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImageBlur_input {
    image: _IMAGE
    /** default=1 min=31 max=31 step=1 */
    blur_radius?: _INT
    /** default=1 min=10 max=10 step=0.1 */
    sigma?: _FLOAT
}

// ImageQuantize [image_postprocessing]
export interface ImageQuantize extends HasSingle_IMAGE, ComfyNode<ImageQuantize_input> {
    nameInComfy: "ImageQuantize"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImageQuantize_input {
    image: _IMAGE
    /** default=256 min=256 max=256 step=1 */
    colors?: _INT
    dither: Enum_ImageQuantize_Dither
}

// ImageSharpen [image_postprocessing]
export interface ImageSharpen extends HasSingle_IMAGE, ComfyNode<ImageSharpen_input> {
    nameInComfy: "ImageSharpen"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImageSharpen_input {
    image: _IMAGE
    /** default=1 min=31 max=31 step=1 */
    sharpen_radius?: _INT
    /** default=1 min=10 max=10 step=0.1 */
    sigma?: _FLOAT
    /** default=1 min=5 max=5 step=0.1 */
    alpha?: _FLOAT
}

// ImageScaleToTotalPixels [image_upscaling]
export interface ImageScaleToTotalPixels extends HasSingle_IMAGE, ComfyNode<ImageScaleToTotalPixels_input> {
    nameInComfy: "ImageScaleToTotalPixels"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImageScaleToTotalPixels_input {
    image: _IMAGE
    upscale_method: Enum_ImageScale_Upscale_method
    /** default=1 min=16 max=16 step=0.01 */
    megapixels?: _FLOAT
}

// LatentCompositeMasked [latent]
export interface LatentCompositeMasked extends HasSingle_LATENT, ComfyNode<LatentCompositeMasked_input> {
    nameInComfy: "LatentCompositeMasked"
    LATENT: Slot<'LATENT', 0>,
}
export interface LatentCompositeMasked_input {
    destination: _LATENT
    source: _LATENT
    /** default=0 min=8192 max=8192 step=8 */
    x?: _INT
    /** default=0 min=8192 max=8192 step=8 */
    y?: _INT
    /** default=false */
    resize_source?: _BOOLEAN
    mask?: _MASK
}

// ImageCompositeMasked [image]
export interface ImageCompositeMasked extends HasSingle_IMAGE, ComfyNode<ImageCompositeMasked_input> {
    nameInComfy: "ImageCompositeMasked"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImageCompositeMasked_input {
    destination: _IMAGE
    source: _IMAGE
    /** default=0 min=8192 max=8192 step=1 */
    x?: _INT
    /** default=0 min=8192 max=8192 step=1 */
    y?: _INT
    /** default=false */
    resize_source?: _BOOLEAN
    mask?: _MASK
}

// MaskToImage [mask]
export interface MaskToImage extends HasSingle_IMAGE, ComfyNode<MaskToImage_input> {
    nameInComfy: "MaskToImage"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MaskToImage_input {
    mask: _MASK
}

// ImageToMask [mask]
export interface ImageToMask extends HasSingle_MASK, ComfyNode<ImageToMask_input> {
    nameInComfy: "ImageToMask"
    MASK: Slot<'MASK', 0>,
}
export interface ImageToMask_input {
    image: _IMAGE
    channel: Enum_ImageToMask_Channel
}

// ImageColorToMask [mask]
export interface ImageColorToMask extends HasSingle_MASK, ComfyNode<ImageColorToMask_input> {
    nameInComfy: "ImageColorToMask"
    MASK: Slot<'MASK', 0>,
}
export interface ImageColorToMask_input {
    image: _IMAGE
    /** default=0 min=16777215 max=16777215 step=1 */
    color?: _INT
}

// SolidMask [mask]
export interface SolidMask extends HasSingle_MASK, ComfyNode<SolidMask_input> {
    nameInComfy: "SolidMask"
    MASK: Slot<'MASK', 0>,
}
export interface SolidMask_input {
    /** default=1 min=1 max=1 step=0.01 */
    value?: _FLOAT
    /** default=512 min=8192 max=8192 step=1 */
    width?: _INT
    /** default=512 min=8192 max=8192 step=1 */
    height?: _INT
}

// InvertMask [mask]
export interface InvertMask extends HasSingle_MASK, ComfyNode<InvertMask_input> {
    nameInComfy: "InvertMask"
    MASK: Slot<'MASK', 0>,
}
export interface InvertMask_input {
    mask: _MASK
}

// CropMask [mask]
export interface CropMask extends HasSingle_MASK, ComfyNode<CropMask_input> {
    nameInComfy: "CropMask"
    MASK: Slot<'MASK', 0>,
}
export interface CropMask_input {
    mask: _MASK
    /** default=0 min=8192 max=8192 step=1 */
    x?: _INT
    /** default=0 min=8192 max=8192 step=1 */
    y?: _INT
    /** default=512 min=8192 max=8192 step=1 */
    width?: _INT
    /** default=512 min=8192 max=8192 step=1 */
    height?: _INT
}

// MaskComposite [mask]
export interface MaskComposite extends HasSingle_MASK, ComfyNode<MaskComposite_input> {
    nameInComfy: "MaskComposite"
    MASK: Slot<'MASK', 0>,
}
export interface MaskComposite_input {
    destination: _MASK
    source: _MASK
    /** default=0 min=8192 max=8192 step=1 */
    x?: _INT
    /** default=0 min=8192 max=8192 step=1 */
    y?: _INT
    operation: Enum_MaskComposite_Operation
}

// FeatherMask [mask]
export interface FeatherMask extends HasSingle_MASK, ComfyNode<FeatherMask_input> {
    nameInComfy: "FeatherMask"
    MASK: Slot<'MASK', 0>,
}
export interface FeatherMask_input {
    mask: _MASK
    /** default=0 min=8192 max=8192 step=1 */
    left?: _INT
    /** default=0 min=8192 max=8192 step=1 */
    top?: _INT
    /** default=0 min=8192 max=8192 step=1 */
    right?: _INT
    /** default=0 min=8192 max=8192 step=1 */
    bottom?: _INT
}

// GrowMask [mask]
export interface GrowMask extends HasSingle_MASK, ComfyNode<GrowMask_input> {
    nameInComfy: "GrowMask"
    MASK: Slot<'MASK', 0>,
}
export interface GrowMask_input {
    mask: _MASK
    /** default=0 min=8192 max=8192 step=1 */
    expand?: _INT
    /** default=true */
    tapered_corners?: _BOOLEAN
}

// RebatchLatents [latent_batch]
export interface RebatchLatents extends HasSingle_LATENT, ComfyNode<RebatchLatents_input> {
    nameInComfy: "RebatchLatents"
    LATENT: Slot<'LATENT', 0>,
}
export interface RebatchLatents_input {
    latents: _LATENT
    /** default=1 min=64 max=64 */
    batch_size?: _INT
}

// ModelMergeSimple [advanced_model_merging]
export interface ModelMergeSimple extends HasSingle_MODEL, ComfyNode<ModelMergeSimple_input> {
    nameInComfy: "ModelMergeSimple"
    MODEL: Slot<'MODEL', 0>,
}
export interface ModelMergeSimple_input {
    model1: _MODEL
    model2: _MODEL
    /** default=1 min=1 max=1 step=0.01 */
    ratio?: _FLOAT
}

// ModelMergeBlocks [advanced_model_merging]
export interface ModelMergeBlocks extends HasSingle_MODEL, ComfyNode<ModelMergeBlocks_input> {
    nameInComfy: "ModelMergeBlocks"
    MODEL: Slot<'MODEL', 0>,
}
export interface ModelMergeBlocks_input {
    model1: _MODEL
    model2: _MODEL
    /** default=1 min=1 max=1 step=0.01 */
    input?: _FLOAT
    /** default=1 min=1 max=1 step=0.01 */
    middle?: _FLOAT
    /** default=1 min=1 max=1 step=0.01 */
    out?: _FLOAT
}

// ModelMergeSubtract [advanced_model_merging]
export interface ModelMergeSubtract extends HasSingle_MODEL, ComfyNode<ModelMergeSubtract_input> {
    nameInComfy: "ModelMergeSubtract"
    MODEL: Slot<'MODEL', 0>,
}
export interface ModelMergeSubtract_input {
    model1: _MODEL
    model2: _MODEL
    /** default=1 min=10 max=10 step=0.01 */
    multiplier?: _FLOAT
}

// ModelMergeAdd [advanced_model_merging]
export interface ModelMergeAdd extends HasSingle_MODEL, ComfyNode<ModelMergeAdd_input> {
    nameInComfy: "ModelMergeAdd"
    MODEL: Slot<'MODEL', 0>,
}
export interface ModelMergeAdd_input {
    model1: _MODEL
    model2: _MODEL
}

// CheckpointSave [advanced_model_merging]
export interface CheckpointSave extends ComfyNode<CheckpointSave_input> {
    nameInComfy: "CheckpointSave"
}
export interface CheckpointSave_input {
    model: _MODEL
    clip: _CLIP
    vae: _VAE
    /** default="checkpoints/ComfyUI" */
    filename_prefix?: _STRING
}

// CLIPMergeSimple [advanced_model_merging]
export interface CLIPMergeSimple extends HasSingle_CLIP, ComfyNode<CLIPMergeSimple_input> {
    nameInComfy: "CLIPMergeSimple"
    CLIP: Slot<'CLIP', 0>,
}
export interface CLIPMergeSimple_input {
    clip1: _CLIP
    clip2: _CLIP
    /** default=1 min=1 max=1 step=0.01 */
    ratio?: _FLOAT
}

// TomePatchModel [_for_testing]
export interface TomePatchModel extends HasSingle_MODEL, ComfyNode<TomePatchModel_input> {
    nameInComfy: "TomePatchModel"
    MODEL: Slot<'MODEL', 0>,
}
export interface TomePatchModel_input {
    model: _MODEL
    /** default=0.3 min=1 max=1 step=0.01 */
    ratio?: _FLOAT
}

// CLIPTextEncodeSDXLRefiner [advanced_conditioning]
export interface CLIPTextEncodeSDXLRefiner extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncodeSDXLRefiner_input> {
    nameInComfy: "CLIPTextEncodeSDXLRefiner"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface CLIPTextEncodeSDXLRefiner_input {
    /** default=6 min=1000 max=1000 step=0.01 */
    ascore?: _FLOAT
    /** default=1024 min=8192 max=8192 */
    width?: _INT
    /** default=1024 min=8192 max=8192 */
    height?: _INT
    /** */
    text: _STRING
    clip: _CLIP
}

// CLIPTextEncodeSDXL [advanced_conditioning]
export interface CLIPTextEncodeSDXL extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncodeSDXL_input> {
    nameInComfy: "CLIPTextEncodeSDXL"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface CLIPTextEncodeSDXL_input {
    /** default=1024 min=8192 max=8192 */
    width?: _INT
    /** default=1024 min=8192 max=8192 */
    height?: _INT
    /** default=0 min=8192 max=8192 */
    crop_w?: _INT
    /** default=0 min=8192 max=8192 */
    crop_h?: _INT
    /** default=1024 min=8192 max=8192 */
    target_width?: _INT
    /** default=1024 min=8192 max=8192 */
    target_height?: _INT
    /** default="CLIP_G" */
    text_g?: _STRING
    clip: _CLIP
    /** default="CLIP_L" */
    text_l?: _STRING
}

// Canny [image_preprocessors]
export interface Canny extends HasSingle_IMAGE, ComfyNode<Canny_input> {
    nameInComfy: "Canny"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface Canny_input {
    image: _IMAGE
    /** default=0.4 min=0.99 max=0.99 step=0.01 */
    low_threshold?: _FLOAT
    /** default=0.8 min=0.99 max=0.99 step=0.01 */
    high_threshold?: _FLOAT
}

// FreeU [_for_testing]
export interface FreeU extends HasSingle_MODEL, ComfyNode<FreeU_input> {
    nameInComfy: "FreeU"
    MODEL: Slot<'MODEL', 0>,
}
export interface FreeU_input {
    model: _MODEL
    /** default=1.1 min=10 max=10 step=0.01 */
    b1?: _FLOAT
    /** default=1.2 min=10 max=10 step=0.01 */
    b2?: _FLOAT
    /** default=0.9 min=10 max=10 step=0.01 */
    s1?: _FLOAT
    /** default=0.2 min=10 max=10 step=0.01 */
    s2?: _FLOAT
}

// Remove Image Background (abg) [image]
export interface RemoveImageBackgroundAbg extends HasSingle_IMAGE, ComfyNode<RemoveImageBackgroundAbg_input> {
    nameInComfy: "Remove Image Background (abg)"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface RemoveImageBackgroundAbg_input {
    image: _IMAGE
}

// CivitAI_Lora_Loader [CivitAI_Loaders]
export interface CivitAI_Lora_Loader extends HasSingle_MODEL, HasSingle_CLIP, ComfyNode<CivitAI_Lora_Loader_input> {
    nameInComfy: "CivitAI_Lora_Loader"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
}
export interface CivitAI_Lora_Loader_input {
    model: _MODEL
    clip: _CLIP
    /** default="{model_id}@{model_version}" */
    lora_air?: _STRING
    lora_name: Enum_CivitAI_Lora_Loader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    strength_model?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    strength_clip?: _FLOAT
    /** default=4 min=12 max=12 step=1 */
    download_chunks?: _INT
    download_path?: Enum_CivitAI_Lora_Loader_Download_path
}

// CivitAI_Checkpoint_Loader [CivitAI_Loaders]
export interface CivitAI_Checkpoint_Loader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<CivitAI_Checkpoint_Loader_input> {
    nameInComfy: "CivitAI_Checkpoint_Loader"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    VAE: Slot<'VAE', 2>,
}
export interface CivitAI_Checkpoint_Loader_input {
    /** default="{model_id}@{model_version}" */
    ckpt_air?: _STRING
    ckpt_name: Enum_CivitAI_Checkpoint_Loader_Ckpt_name
    /** default=4 min=12 max=12 step=1 */
    download_chunks?: _INT
    download_path?: Enum_CivitAI_Checkpoint_Loader_Download_path
}

// SAMLoader [ImpactPack]
export interface ImpactSAMLoader extends HasSingle_SAM_MODEL, ComfyNode<ImpactSAMLoader_input> {
    nameInComfy: "SAMLoader"
    SAM_MODEL: Slot<'SAM_MODEL', 0>,
}
export interface ImpactSAMLoader_input {
    model_name: Enum_ImpactSAMLoader_Model_name
    device_mode: Enum_ImpactSAMLoader_Device_mode
}

// CLIPSegDetectorProvider [ImpactPack_Util]
export interface ImpactCLIPSegDetectorProvider extends HasSingle_BBOX_DETECTOR, ComfyNode<ImpactCLIPSegDetectorProvider_input> {
    nameInComfy: "CLIPSegDetectorProvider"
    BBOX_DETECTOR: Slot<'BBOX_DETECTOR', 0>,
}
export interface ImpactCLIPSegDetectorProvider_input {
    /** */
    text: _STRING
    /** default=7 min=15 max=15 step=0.1 */
    blur?: _FLOAT
    /** default=0.4 min=1 max=1 step=0.05 */
    threshold?: _FLOAT
    /** default=4 min=10 max=10 step=1 */
    dilation_factor?: _INT
}

// ONNXDetectorProvider [ImpactPack]
export interface ImpactONNXDetectorProvider extends HasSingle_ONNX_DETECTOR, ComfyNode<ImpactONNXDetectorProvider_input> {
    nameInComfy: "ONNXDetectorProvider"
    ONNX_DETECTOR: Slot<'ONNX_DETECTOR', 0>,
}
export interface ImpactONNXDetectorProvider_input {
    model_name: Enum_CLIPLoader_Clip_name
}

// BitwiseAndMaskForEach [ImpactPack_Operation]
export interface ImpactBitwiseAndMaskForEach extends HasSingle_SEGS, ComfyNode<ImpactBitwiseAndMaskForEach_input> {
    nameInComfy: "BitwiseAndMaskForEach"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactBitwiseAndMaskForEach_input {
    base_segs: _SEGS
    mask_segs: _SEGS
}

// SubtractMaskForEach [ImpactPack_Operation]
export interface ImpactSubtractMaskForEach extends HasSingle_SEGS, ComfyNode<ImpactSubtractMaskForEach_input> {
    nameInComfy: "SubtractMaskForEach"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactSubtractMaskForEach_input {
    base_segs: _SEGS
    mask_segs: _SEGS
}

// DetailerForEach [ImpactPack_Detailer]
export interface ImpactDetailerForEach extends HasSingle_IMAGE, ComfyNode<ImpactDetailerForEach_input> {
    nameInComfy: "DetailerForEach"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImpactDetailerForEach_input {
    image: _IMAGE
    segs: _SEGS
    model: _MODEL
    clip: _CLIP
    vae: _VAE
    /** default=256 min=8192 max=8192 step=8 */
    guide_size?: _FLOAT
    /** default=true */
    guide_size_for?: _BOOLEAN
    /** default=768 min=8192 max=8192 step=8 */
    max_size?: _FLOAT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: _INT
    /** default=true */
    noise_mask?: _BOOLEAN
    /** default=true */
    force_inpaint?: _BOOLEAN
    /** */
    wildcard: _STRING
    detailer_hook?: _DETAILER_HOOK
}

// DetailerForEachDebug [ImpactPack_Detailer]
export interface ImpactDetailerForEachDebug extends ComfyNode<ImpactDetailerForEachDebug_input> {
    nameInComfy: "DetailerForEachDebug"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_1: Slot<'IMAGE', 1>,
    IMAGE_2: Slot<'IMAGE', 2>,
    IMAGE_3: Slot<'IMAGE', 3>,
    IMAGE_4: Slot<'IMAGE', 4>,
}
export interface ImpactDetailerForEachDebug_input {
    image: _IMAGE
    segs: _SEGS
    model: _MODEL
    clip: _CLIP
    vae: _VAE
    /** default=256 min=8192 max=8192 step=8 */
    guide_size?: _FLOAT
    /** default=true */
    guide_size_for?: _BOOLEAN
    /** default=768 min=8192 max=8192 step=8 */
    max_size?: _FLOAT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: _INT
    /** default=true */
    noise_mask?: _BOOLEAN
    /** default=true */
    force_inpaint?: _BOOLEAN
    /** */
    wildcard: _STRING
    detailer_hook?: _DETAILER_HOOK
}

// DetailerForEachPipe [ImpactPack_Detailer]
export interface ImpactDetailerForEachPipe extends HasSingle_SEGS, HasSingle_BASIC_PIPE, ComfyNode<ImpactDetailerForEachPipe_input> {
    nameInComfy: "DetailerForEachPipe"
    IMAGE: Slot<'IMAGE', 0>,
    SEGS: Slot<'SEGS', 1>,
    BASIC_PIPE: Slot<'BASIC_PIPE', 2>,
    IMAGE_1: Slot<'IMAGE', 3>,
}
export interface ImpactDetailerForEachPipe_input {
    image: _IMAGE
    segs: _SEGS
    /** default=256 min=8192 max=8192 step=8 */
    guide_size?: _FLOAT
    /** default=true */
    guide_size_for?: _BOOLEAN
    /** default=768 min=8192 max=8192 step=8 */
    max_size?: _FLOAT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: _INT
    /** default=true */
    noise_mask?: _BOOLEAN
    /** default=true */
    force_inpaint?: _BOOLEAN
    basic_pipe: _BASIC_PIPE
    /** */
    wildcard: _STRING
    /** default=0.2 min=1 max=1 */
    refiner_ratio?: _FLOAT
    detailer_hook?: _DETAILER_HOOK
    refiner_basic_pipe_opt?: _BASIC_PIPE
}

// DetailerForEachDebugPipe [ImpactPack_Detailer]
export interface ImpactDetailerForEachDebugPipe extends HasSingle_SEGS, HasSingle_BASIC_PIPE, ComfyNode<ImpactDetailerForEachDebugPipe_input> {
    nameInComfy: "DetailerForEachDebugPipe"
    IMAGE: Slot<'IMAGE', 0>,
    SEGS: Slot<'SEGS', 1>,
    BASIC_PIPE: Slot<'BASIC_PIPE', 2>,
    IMAGE_1: Slot<'IMAGE', 3>,
    IMAGE_2: Slot<'IMAGE', 4>,
    IMAGE_3: Slot<'IMAGE', 5>,
    IMAGE_4: Slot<'IMAGE', 6>,
}
export interface ImpactDetailerForEachDebugPipe_input {
    image: _IMAGE
    segs: _SEGS
    /** default=256 min=8192 max=8192 step=8 */
    guide_size?: _FLOAT
    /** default=true */
    guide_size_for?: _BOOLEAN
    /** default=768 min=8192 max=8192 step=8 */
    max_size?: _FLOAT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: _INT
    /** default=true */
    noise_mask?: _BOOLEAN
    /** default=true */
    force_inpaint?: _BOOLEAN
    basic_pipe: _BASIC_PIPE
    /** */
    wildcard: _STRING
    /** default=0.2 min=1 max=1 */
    refiner_ratio?: _FLOAT
    detailer_hook?: _DETAILER_HOOK
    refiner_basic_pipe_opt?: _BASIC_PIPE
}

// SAMDetectorCombined [ImpactPack_Detector]
export interface ImpactSAMDetectorCombined extends HasSingle_MASK, ComfyNode<ImpactSAMDetectorCombined_input> {
    nameInComfy: "SAMDetectorCombined"
    MASK: Slot<'MASK', 0>,
}
export interface ImpactSAMDetectorCombined_input {
    sam_model: _SAM_MODEL
    segs: _SEGS
    image: _IMAGE
    detection_hint: Enum_ImpactSAMDetectorCombined_Detection_hint
    /** default=0 min=512 max=512 step=1 */
    dilation?: _INT
    /** default=0.93 min=1 max=1 step=0.01 */
    threshold?: _FLOAT
    /** default=0 min=1000 max=1000 step=1 */
    bbox_expansion?: _INT
    /** default=0.7 min=1 max=1 step=0.01 */
    mask_hint_threshold?: _FLOAT
    mask_hint_use_negative: Enum_ImpactSAMDetectorCombined_Mask_hint_use_negative
}

// SAMDetectorSegmented [ImpactPack_Detector]
export interface ImpactSAMDetectorSegmented extends HasSingle_MASK, HasSingle_MASKS, ComfyNode<ImpactSAMDetectorSegmented_input> {
    nameInComfy: "SAMDetectorSegmented"
    MASK: Slot<'MASK', 0>,
    MASKS: Slot<'MASKS', 1>,
}
export interface ImpactSAMDetectorSegmented_input {
    sam_model: _SAM_MODEL
    segs: _SEGS
    image: _IMAGE
    detection_hint: Enum_ImpactSAMDetectorCombined_Detection_hint
    /** default=0 min=512 max=512 step=1 */
    dilation?: _INT
    /** default=0.93 min=1 max=1 step=0.01 */
    threshold?: _FLOAT
    /** default=0 min=1000 max=1000 step=1 */
    bbox_expansion?: _INT
    /** default=0.7 min=1 max=1 step=0.01 */
    mask_hint_threshold?: _FLOAT
    mask_hint_use_negative: Enum_ImpactSAMDetectorCombined_Mask_hint_use_negative
}

// FaceDetailer [ImpactPack_Simple]
export interface ImpactFaceDetailer extends HasSingle_MASK, HasSingle_DETAILER_PIPE, ComfyNode<ImpactFaceDetailer_input> {
    nameInComfy: "FaceDetailer"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_1: Slot<'IMAGE', 1>,
    IMAGE_2: Slot<'IMAGE', 2>,
    MASK: Slot<'MASK', 3>,
    DETAILER_PIPE: Slot<'DETAILER_PIPE', 4>,
    IMAGE_3: Slot<'IMAGE', 5>,
}
export interface ImpactFaceDetailer_input {
    image: _IMAGE
    model: _MODEL
    clip: _CLIP
    vae: _VAE
    /** default=256 min=8192 max=8192 step=8 */
    guide_size?: _FLOAT
    /** default=true */
    guide_size_for?: _BOOLEAN
    /** default=768 min=8192 max=8192 step=8 */
    max_size?: _FLOAT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: _INT
    /** default=true */
    noise_mask?: _BOOLEAN
    /** default=true */
    force_inpaint?: _BOOLEAN
    /** default=0.5 min=1 max=1 step=0.01 */
    bbox_threshold?: _FLOAT
    /** default=10 min=512 max=512 step=1 */
    bbox_dilation?: _INT
    /** default=3 min=10 max=10 step=0.1 */
    bbox_crop_factor?: _FLOAT
    sam_detection_hint: Enum_ImpactSAMDetectorCombined_Detection_hint
    /** default=0 min=512 max=512 step=1 */
    sam_dilation?: _INT
    /** default=0.93 min=1 max=1 step=0.01 */
    sam_threshold?: _FLOAT
    /** default=0 min=1000 max=1000 step=1 */
    sam_bbox_expansion?: _INT
    /** default=0.7 min=1 max=1 step=0.01 */
    sam_mask_hint_threshold?: _FLOAT
    sam_mask_hint_use_negative: Enum_ImpactSAMDetectorCombined_Mask_hint_use_negative
    /** default=10 min=8192 max=8192 step=1 */
    drop_size?: _INT
    bbox_detector: _BBOX_DETECTOR
    /** */
    wildcard: _STRING
    sam_model_opt?: _SAM_MODEL
    segm_detector_opt?: _SEGM_DETECTOR
    detailer_hook?: _DETAILER_HOOK
}

// FaceDetailerPipe [ImpactPack_Simple]
export interface ImpactFaceDetailerPipe extends HasSingle_MASK, HasSingle_DETAILER_PIPE, ComfyNode<ImpactFaceDetailerPipe_input> {
    nameInComfy: "FaceDetailerPipe"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_1: Slot<'IMAGE', 1>,
    IMAGE_2: Slot<'IMAGE', 2>,
    MASK: Slot<'MASK', 3>,
    DETAILER_PIPE: Slot<'DETAILER_PIPE', 4>,
    IMAGE_3: Slot<'IMAGE', 5>,
}
export interface ImpactFaceDetailerPipe_input {
    image: _IMAGE
    detailer_pipe: _DETAILER_PIPE
    /** default=256 min=8192 max=8192 step=8 */
    guide_size?: _FLOAT
    /** default=true */
    guide_size_for?: _BOOLEAN
    /** default=768 min=8192 max=8192 step=8 */
    max_size?: _FLOAT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: _INT
    /** default=true */
    noise_mask?: _BOOLEAN
    /** default=false */
    force_inpaint?: _BOOLEAN
    /** default=0.5 min=1 max=1 step=0.01 */
    bbox_threshold?: _FLOAT
    /** default=10 min=255 max=255 step=1 */
    bbox_dilation?: _INT
    /** default=3 min=10 max=10 step=0.1 */
    bbox_crop_factor?: _FLOAT
    sam_detection_hint: Enum_ImpactSAMDetectorCombined_Detection_hint
    /** default=0 min=255 max=255 step=1 */
    sam_dilation?: _INT
    /** default=0.93 min=1 max=1 step=0.01 */
    sam_threshold?: _FLOAT
    /** default=0 min=1000 max=1000 step=1 */
    sam_bbox_expansion?: _INT
    /** default=0.7 min=1 max=1 step=0.01 */
    sam_mask_hint_threshold?: _FLOAT
    sam_mask_hint_use_negative: Enum_ImpactSAMDetectorCombined_Mask_hint_use_negative
    /** default=10 min=8192 max=8192 step=1 */
    drop_size?: _INT
    /** default=0.2 min=1 max=1 */
    refiner_ratio?: _FLOAT
}

// ToDetailerPipe [ImpactPack_Pipe]
export interface ImpactToDetailerPipe extends HasSingle_DETAILER_PIPE, ComfyNode<ImpactToDetailerPipe_input> {
    nameInComfy: "ToDetailerPipe"
    DETAILER_PIPE: Slot<'DETAILER_PIPE', 0>,
}
export interface ImpactToDetailerPipe_input {
    model: _MODEL
    clip: _CLIP
    vae: _VAE
    positive: _CONDITIONING
    negative: _CONDITIONING
    bbox_detector: _BBOX_DETECTOR
    /** */
    wildcard: _STRING
    "Select to add LoRA": Enum_ImpactToDetailerPipe_SelectToAddLoRA
    sam_model_opt?: _SAM_MODEL
    segm_detector_opt?: _SEGM_DETECTOR
    detailer_hook?: _DETAILER_HOOK
}

// ToDetailerPipeSDXL [ImpactPack_Pipe]
export interface ImpactToDetailerPipeSDXL extends HasSingle_DETAILER_PIPE, ComfyNode<ImpactToDetailerPipeSDXL_input> {
    nameInComfy: "ToDetailerPipeSDXL"
    DETAILER_PIPE: Slot<'DETAILER_PIPE', 0>,
}
export interface ImpactToDetailerPipeSDXL_input {
    model: _MODEL
    clip: _CLIP
    vae: _VAE
    positive: _CONDITIONING
    negative: _CONDITIONING
    refiner_model: _MODEL
    refiner_clip: _CLIP
    refiner_positive: _CONDITIONING
    refiner_negative: _CONDITIONING
    bbox_detector: _BBOX_DETECTOR
    /** */
    wildcard: _STRING
    "Select to add LoRA": Enum_ImpactToDetailerPipe_SelectToAddLoRA
    sam_model_opt?: _SAM_MODEL
    segm_detector_opt?: _SEGM_DETECTOR
    detailer_hook?: _DETAILER_HOOK
}

// FromDetailerPipe [ImpactPack_Pipe]
export interface ImpactFromDetailerPipe extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, HasSingle_BBOX_DETECTOR, HasSingle_SAM_MODEL, HasSingle_SEGM_DETECTOR, HasSingle_DETAILER_HOOK, ComfyNode<ImpactFromDetailerPipe_input> {
    nameInComfy: "FromDetailerPipe"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    VAE: Slot<'VAE', 2>,
    CONDITIONING: Slot<'CONDITIONING', 3>,
    CONDITIONING_1: Slot<'CONDITIONING', 4>,
    BBOX_DETECTOR: Slot<'BBOX_DETECTOR', 5>,
    SAM_MODEL: Slot<'SAM_MODEL', 6>,
    SEGM_DETECTOR: Slot<'SEGM_DETECTOR', 7>,
    DETAILER_HOOK: Slot<'DETAILER_HOOK', 8>,
}
export interface ImpactFromDetailerPipe_input {
    detailer_pipe: _DETAILER_PIPE
}

// FromDetailerPipe_v2 [ImpactPack_Pipe]
export interface ImpactFromDetailerPipe_v2 extends HasSingle_DETAILER_PIPE, HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, HasSingle_BBOX_DETECTOR, HasSingle_SAM_MODEL, HasSingle_SEGM_DETECTOR, HasSingle_DETAILER_HOOK, ComfyNode<ImpactFromDetailerPipe_v2_input> {
    nameInComfy: "FromDetailerPipe_v2"
    DETAILER_PIPE: Slot<'DETAILER_PIPE', 0>,
    MODEL: Slot<'MODEL', 1>,
    CLIP: Slot<'CLIP', 2>,
    VAE: Slot<'VAE', 3>,
    CONDITIONING: Slot<'CONDITIONING', 4>,
    CONDITIONING_1: Slot<'CONDITIONING', 5>,
    BBOX_DETECTOR: Slot<'BBOX_DETECTOR', 6>,
    SAM_MODEL: Slot<'SAM_MODEL', 7>,
    SEGM_DETECTOR: Slot<'SEGM_DETECTOR', 8>,
    DETAILER_HOOK: Slot<'DETAILER_HOOK', 9>,
}
export interface ImpactFromDetailerPipe_v2_input {
    detailer_pipe: _DETAILER_PIPE
}

// FromDetailerPipeSDXL [ImpactPack_Pipe]
export interface ImpactFromDetailerPipeSDXL extends HasSingle_DETAILER_PIPE, HasSingle_VAE, HasSingle_BBOX_DETECTOR, HasSingle_SAM_MODEL, HasSingle_SEGM_DETECTOR, HasSingle_DETAILER_HOOK, ComfyNode<ImpactFromDetailerPipeSDXL_input> {
    nameInComfy: "FromDetailerPipeSDXL"
    DETAILER_PIPE: Slot<'DETAILER_PIPE', 0>,
    MODEL: Slot<'MODEL', 1>,
    CLIP: Slot<'CLIP', 2>,
    VAE: Slot<'VAE', 3>,
    CONDITIONING: Slot<'CONDITIONING', 4>,
    CONDITIONING_1: Slot<'CONDITIONING', 5>,
    BBOX_DETECTOR: Slot<'BBOX_DETECTOR', 6>,
    SAM_MODEL: Slot<'SAM_MODEL', 7>,
    SEGM_DETECTOR: Slot<'SEGM_DETECTOR', 8>,
    DETAILER_HOOK: Slot<'DETAILER_HOOK', 9>,
    MODEL_1: Slot<'MODEL', 10>,
    CLIP_1: Slot<'CLIP', 11>,
    CONDITIONING_2: Slot<'CONDITIONING', 12>,
    CONDITIONING_3: Slot<'CONDITIONING', 13>,
}
export interface ImpactFromDetailerPipeSDXL_input {
    detailer_pipe: _DETAILER_PIPE
}

// ToBasicPipe [ImpactPack_Pipe]
export interface ImpactToBasicPipe extends HasSingle_BASIC_PIPE, ComfyNode<ImpactToBasicPipe_input> {
    nameInComfy: "ToBasicPipe"
    BASIC_PIPE: Slot<'BASIC_PIPE', 0>,
}
export interface ImpactToBasicPipe_input {
    model: _MODEL
    clip: _CLIP
    vae: _VAE
    positive: _CONDITIONING
    negative: _CONDITIONING
}

// FromBasicPipe [ImpactPack_Pipe]
export interface ImpactFromBasicPipe extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<ImpactFromBasicPipe_input> {
    nameInComfy: "FromBasicPipe"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    VAE: Slot<'VAE', 2>,
    CONDITIONING: Slot<'CONDITIONING', 3>,
    CONDITIONING_1: Slot<'CONDITIONING', 4>,
}
export interface ImpactFromBasicPipe_input {
    basic_pipe: _BASIC_PIPE
}

// FromBasicPipe_v2 [ImpactPack_Pipe]
export interface ImpactFromBasicPipe_v2 extends HasSingle_BASIC_PIPE, HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<ImpactFromBasicPipe_v2_input> {
    nameInComfy: "FromBasicPipe_v2"
    BASIC_PIPE: Slot<'BASIC_PIPE', 0>,
    MODEL: Slot<'MODEL', 1>,
    CLIP: Slot<'CLIP', 2>,
    VAE: Slot<'VAE', 3>,
    CONDITIONING: Slot<'CONDITIONING', 4>,
    CONDITIONING_1: Slot<'CONDITIONING', 5>,
}
export interface ImpactFromBasicPipe_v2_input {
    basic_pipe: _BASIC_PIPE
}

// BasicPipeToDetailerPipe [ImpactPack_Pipe]
export interface ImpactBasicPipeToDetailerPipe extends HasSingle_DETAILER_PIPE, ComfyNode<ImpactBasicPipeToDetailerPipe_input> {
    nameInComfy: "BasicPipeToDetailerPipe"
    DETAILER_PIPE: Slot<'DETAILER_PIPE', 0>,
}
export interface ImpactBasicPipeToDetailerPipe_input {
    basic_pipe: _BASIC_PIPE
    bbox_detector: _BBOX_DETECTOR
    /** */
    wildcard: _STRING
    "Select to add LoRA": Enum_ImpactToDetailerPipe_SelectToAddLoRA
    sam_model_opt?: _SAM_MODEL
    segm_detector_opt?: _SEGM_DETECTOR
    detailer_hook?: _DETAILER_HOOK
}

// BasicPipeToDetailerPipeSDXL [ImpactPack_Pipe]
export interface ImpactBasicPipeToDetailerPipeSDXL extends HasSingle_DETAILER_PIPE, ComfyNode<ImpactBasicPipeToDetailerPipeSDXL_input> {
    nameInComfy: "BasicPipeToDetailerPipeSDXL"
    DETAILER_PIPE: Slot<'DETAILER_PIPE', 0>,
}
export interface ImpactBasicPipeToDetailerPipeSDXL_input {
    base_basic_pipe: _BASIC_PIPE
    refiner_basic_pipe: _BASIC_PIPE
    bbox_detector: _BBOX_DETECTOR
    /** */
    wildcard: _STRING
    "Select to add LoRA": Enum_ImpactToDetailerPipe_SelectToAddLoRA
    sam_model_opt?: _SAM_MODEL
    segm_detector_opt?: _SEGM_DETECTOR
    detailer_hook?: _DETAILER_HOOK
}

// DetailerPipeToBasicPipe [ImpactPack_Pipe]
export interface ImpactDetailerPipeToBasicPipe extends ComfyNode<ImpactDetailerPipeToBasicPipe_input> {
    nameInComfy: "DetailerPipeToBasicPipe"
    BASIC_PIPE: Slot<'BASIC_PIPE', 0>,
    BASIC_PIPE_1: Slot<'BASIC_PIPE', 1>,
}
export interface ImpactDetailerPipeToBasicPipe_input {
    detailer_pipe: _DETAILER_PIPE
}

// EditBasicPipe [ImpactPack_Pipe]
export interface ImpactEditBasicPipe extends HasSingle_BASIC_PIPE, ComfyNode<ImpactEditBasicPipe_input> {
    nameInComfy: "EditBasicPipe"
    BASIC_PIPE: Slot<'BASIC_PIPE', 0>,
}
export interface ImpactEditBasicPipe_input {
    basic_pipe: _BASIC_PIPE
    model?: _MODEL
    clip?: _CLIP
    vae?: _VAE
    positive?: _CONDITIONING
    negative?: _CONDITIONING
}

// EditDetailerPipe [ImpactPack_Pipe]
export interface ImpactEditDetailerPipe extends HasSingle_DETAILER_PIPE, ComfyNode<ImpactEditDetailerPipe_input> {
    nameInComfy: "EditDetailerPipe"
    DETAILER_PIPE: Slot<'DETAILER_PIPE', 0>,
}
export interface ImpactEditDetailerPipe_input {
    detailer_pipe: _DETAILER_PIPE
    /** */
    wildcard: _STRING
    "Select to add LoRA": Enum_ImpactToDetailerPipe_SelectToAddLoRA
    model?: _MODEL
    clip?: _CLIP
    vae?: _VAE
    positive?: _CONDITIONING
    negative?: _CONDITIONING
    bbox_detector?: _BBOX_DETECTOR
    sam_model?: _SAM_MODEL
    segm_detector?: _SEGM_DETECTOR
    detailer_hook?: _DETAILER_HOOK
}

// EditDetailerPipeSDXL [ImpactPack_Pipe]
export interface ImpactEditDetailerPipeSDXL extends HasSingle_DETAILER_PIPE, ComfyNode<ImpactEditDetailerPipeSDXL_input> {
    nameInComfy: "EditDetailerPipeSDXL"
    DETAILER_PIPE: Slot<'DETAILER_PIPE', 0>,
}
export interface ImpactEditDetailerPipeSDXL_input {
    detailer_pipe: _DETAILER_PIPE
    /** */
    wildcard: _STRING
    "Select to add LoRA": Enum_ImpactToDetailerPipe_SelectToAddLoRA
    model?: _MODEL
    clip?: _CLIP
    vae?: _VAE
    positive?: _CONDITIONING
    negative?: _CONDITIONING
    refiner_model?: _MODEL
    refiner_clip?: _CLIP
    refiner_positive?: _CONDITIONING
    refiner_negative?: _CONDITIONING
    bbox_detector?: _BBOX_DETECTOR
    sam_model?: _SAM_MODEL
    segm_detector?: _SEGM_DETECTOR
    detailer_hook?: _DETAILER_HOOK
}

// LatentPixelScale [ImpactPack_Upscale]
export interface ImpactLatentPixelScale extends HasSingle_LATENT, ComfyNode<ImpactLatentPixelScale_input> {
    nameInComfy: "LatentPixelScale"
    LATENT: Slot<'LATENT', 0>,
}
export interface ImpactLatentPixelScale_input {
    samples: _LATENT
    scale_method: Enum_ImpactLatentPixelScale_Scale_method
    /** default=1.5 min=10000 max=10000 step=0.1 */
    scale_factor?: _FLOAT
    vae: _VAE
    /** default=false */
    use_tiled_vae?: _BOOLEAN
    upscale_model_opt?: _UPSCALE_MODEL
}

// PixelKSampleUpscalerProvider [ImpactPack_Upscale]
export interface ImpactPixelKSampleUpscalerProvider extends HasSingle_UPSCALER, ComfyNode<ImpactPixelKSampleUpscalerProvider_input> {
    nameInComfy: "PixelKSampleUpscalerProvider"
    UPSCALER: Slot<'UPSCALER', 0>,
}
export interface ImpactPixelKSampleUpscalerProvider_input {
    scale_method: Enum_ImpactLatentPixelScale_Scale_method
    model: _MODEL
    vae: _VAE
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    /** default=false */
    use_tiled_vae?: _BOOLEAN
    /** default=512 min=4096 max=4096 step=64 */
    tile_size?: _INT
    upscale_model_opt?: _UPSCALE_MODEL
    pk_hook_opt?: _PK_HOOK
}

// PixelKSampleUpscalerProviderPipe [ImpactPack_Upscale]
export interface ImpactPixelKSampleUpscalerProviderPipe extends HasSingle_UPSCALER, ComfyNode<ImpactPixelKSampleUpscalerProviderPipe_input> {
    nameInComfy: "PixelKSampleUpscalerProviderPipe"
    UPSCALER: Slot<'UPSCALER', 0>,
}
export interface ImpactPixelKSampleUpscalerProviderPipe_input {
    scale_method: Enum_ImpactLatentPixelScale_Scale_method
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    /** default=false */
    use_tiled_vae?: _BOOLEAN
    basic_pipe: _BASIC_PIPE
    /** default=512 min=4096 max=4096 step=64 */
    tile_size?: _INT
    upscale_model_opt?: _UPSCALE_MODEL
    pk_hook_opt?: _PK_HOOK
}

// IterativeLatentUpscale [ImpactPack_Upscale]
export interface ImpactIterativeLatentUpscale extends HasSingle_LATENT, ComfyNode<ImpactIterativeLatentUpscale_input> {
    nameInComfy: "IterativeLatentUpscale"
    LATENT: Slot<'LATENT', 0>,
}
export interface ImpactIterativeLatentUpscale_input {
    samples: _LATENT
    /** default=1.5 min=10000 max=10000 step=0.1 */
    upscale_factor?: _FLOAT
    /** default=3 min=10000 max=10000 step=1 */
    steps?: _INT
    /** default="" */
    temp_prefix?: _STRING
    upscaler: _UPSCALER
}

// IterativeImageUpscale [ImpactPack_Upscale]
export interface ImpactIterativeImageUpscale extends HasSingle_IMAGE, ComfyNode<ImpactIterativeImageUpscale_input> {
    nameInComfy: "IterativeImageUpscale"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImpactIterativeImageUpscale_input {
    pixels: _IMAGE
    /** default=1.5 min=10000 max=10000 step=0.1 */
    upscale_factor?: _FLOAT
    /** default=3 min=10000 max=10000 step=1 */
    steps?: _INT
    /** default="" */
    temp_prefix?: _STRING
    upscaler: _UPSCALER
    vae: _VAE
}

// PixelTiledKSampleUpscalerProvider [ImpactPack_Upscale]
export interface ImpactPixelTiledKSampleUpscalerProvider extends HasSingle_UPSCALER, ComfyNode<ImpactPixelTiledKSampleUpscalerProvider_input> {
    nameInComfy: "PixelTiledKSampleUpscalerProvider"
    UPSCALER: Slot<'UPSCALER', 0>,
}
export interface ImpactPixelTiledKSampleUpscalerProvider_input {
    scale_method: Enum_ImpactLatentPixelScale_Scale_method
    model: _MODEL
    vae: _VAE
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    /** default=512 min=8192 max=8192 step=64 */
    tile_width?: _INT
    /** default=512 min=8192 max=8192 step=64 */
    tile_height?: _INT
    tiling_strategy: Enum_ImpactPixelTiledKSampleUpscalerProvider_Tiling_strategy
    upscale_model_opt?: _UPSCALE_MODEL
    pk_hook_opt?: _PK_HOOK
}

// PixelTiledKSampleUpscalerProviderPipe [ImpactPack_Upscale]
export interface ImpactPixelTiledKSampleUpscalerProviderPipe extends HasSingle_UPSCALER, ComfyNode<ImpactPixelTiledKSampleUpscalerProviderPipe_input> {
    nameInComfy: "PixelTiledKSampleUpscalerProviderPipe"
    UPSCALER: Slot<'UPSCALER', 0>,
}
export interface ImpactPixelTiledKSampleUpscalerProviderPipe_input {
    scale_method: Enum_ImpactLatentPixelScale_Scale_method
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    /** default=512 min=8192 max=8192 step=64 */
    tile_width?: _INT
    /** default=512 min=8192 max=8192 step=64 */
    tile_height?: _INT
    tiling_strategy: Enum_ImpactPixelTiledKSampleUpscalerProvider_Tiling_strategy
    basic_pipe: _BASIC_PIPE
    upscale_model_opt?: _UPSCALE_MODEL
    pk_hook_opt?: _PK_HOOK
}

// TwoSamplersForMaskUpscalerProvider [ImpactPack_Upscale]
export interface ImpactTwoSamplersForMaskUpscalerProvider extends HasSingle_UPSCALER, ComfyNode<ImpactTwoSamplersForMaskUpscalerProvider_input> {
    nameInComfy: "TwoSamplersForMaskUpscalerProvider"
    UPSCALER: Slot<'UPSCALER', 0>,
}
export interface ImpactTwoSamplersForMaskUpscalerProvider_input {
    scale_method: Enum_ImpactLatentPixelScale_Scale_method
    full_sample_schedule: Enum_ImpactTwoSamplersForMaskUpscalerProvider_Full_sample_schedule
    /** default=false */
    use_tiled_vae?: _BOOLEAN
    base_sampler: _KSAMPLER
    mask_sampler: _KSAMPLER
    mask: _MASK
    vae: _VAE
    /** default=512 min=4096 max=4096 step=64 */
    tile_size?: _INT
    full_sampler_opt?: _KSAMPLER
    upscale_model_opt?: _UPSCALE_MODEL
    pk_hook_base_opt?: _PK_HOOK
    pk_hook_mask_opt?: _PK_HOOK
    pk_hook_full_opt?: _PK_HOOK
}

// TwoSamplersForMaskUpscalerProviderPipe [ImpactPack_Upscale]
export interface ImpactTwoSamplersForMaskUpscalerProviderPipe extends HasSingle_UPSCALER, ComfyNode<ImpactTwoSamplersForMaskUpscalerProviderPipe_input> {
    nameInComfy: "TwoSamplersForMaskUpscalerProviderPipe"
    UPSCALER: Slot<'UPSCALER', 0>,
}
export interface ImpactTwoSamplersForMaskUpscalerProviderPipe_input {
    scale_method: Enum_ImpactLatentPixelScale_Scale_method
    full_sample_schedule: Enum_ImpactTwoSamplersForMaskUpscalerProvider_Full_sample_schedule
    /** default=false */
    use_tiled_vae?: _BOOLEAN
    base_sampler: _KSAMPLER
    mask_sampler: _KSAMPLER
    mask: _MASK
    basic_pipe: _BASIC_PIPE
    /** default=512 min=4096 max=4096 step=64 */
    tile_size?: _INT
    full_sampler_opt?: _KSAMPLER
    upscale_model_opt?: _UPSCALE_MODEL
    pk_hook_base_opt?: _PK_HOOK
    pk_hook_mask_opt?: _PK_HOOK
    pk_hook_full_opt?: _PK_HOOK
}

// PixelKSampleHookCombine [ImpactPack_Upscale]
export interface ImpactPixelKSampleHookCombine extends HasSingle_PK_HOOK, ComfyNode<ImpactPixelKSampleHookCombine_input> {
    nameInComfy: "PixelKSampleHookCombine"
    PK_HOOK: Slot<'PK_HOOK', 0>,
}
export interface ImpactPixelKSampleHookCombine_input {
    hook1: _PK_HOOK
    hook2: _PK_HOOK
}

// DenoiseScheduleHookProvider [ImpactPack_Upscale]
export interface ImpactDenoiseScheduleHookProvider extends HasSingle_PK_HOOK, ComfyNode<ImpactDenoiseScheduleHookProvider_input> {
    nameInComfy: "DenoiseScheduleHookProvider"
    PK_HOOK: Slot<'PK_HOOK', 0>,
}
export interface ImpactDenoiseScheduleHookProvider_input {
    schedule_for_iteration: Enum_ImpactDenoiseScheduleHookProvider_Schedule_for_iteration
    /** default=0.2 min=100 max=100 */
    target_denoise?: _FLOAT
}

// CfgScheduleHookProvider [ImpactPack_Upscale]
export interface ImpactCfgScheduleHookProvider extends HasSingle_PK_HOOK, ComfyNode<ImpactCfgScheduleHookProvider_input> {
    nameInComfy: "CfgScheduleHookProvider"
    PK_HOOK: Slot<'PK_HOOK', 0>,
}
export interface ImpactCfgScheduleHookProvider_input {
    schedule_for_iteration: Enum_ImpactDenoiseScheduleHookProvider_Schedule_for_iteration
    /** default=3 min=100 max=100 */
    target_cfg?: _FLOAT
}

// NoiseInjectionHookProvider [ImpactPack_Upscale]
export interface ImpactNoiseInjectionHookProvider extends HasSingle_PK_HOOK, ComfyNode<ImpactNoiseInjectionHookProvider_input> {
    nameInComfy: "NoiseInjectionHookProvider"
    PK_HOOK: Slot<'PK_HOOK', 0>,
}
export interface ImpactNoiseInjectionHookProvider_input {
    schedule_for_iteration: Enum_ImpactDenoiseScheduleHookProvider_Schedule_for_iteration
    source: Enum_ImpactNoiseInjectionHookProvider_Source
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=1 min=200 max=200 step=0.01 */
    start_strength?: _FLOAT
    /** default=1 min=200 max=200 step=0.01 */
    end_strength?: _FLOAT
}

// NoiseInjectionDetailerHookProvider [ImpactPack_Detailer]
export interface ImpactNoiseInjectionDetailerHookProvider extends HasSingle_DETAILER_HOOK, ComfyNode<ImpactNoiseInjectionDetailerHookProvider_input> {
    nameInComfy: "NoiseInjectionDetailerHookProvider"
    DETAILER_HOOK: Slot<'DETAILER_HOOK', 0>,
}
export interface ImpactNoiseInjectionDetailerHookProvider_input {
    source: Enum_ImpactNoiseInjectionHookProvider_Source
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=1 min=200 max=200 step=0.01 */
    strength?: _FLOAT
}

// BitwiseAndMask [ImpactPack_Operation]
export interface ImpactBitwiseAndMask extends HasSingle_MASK, ComfyNode<ImpactBitwiseAndMask_input> {
    nameInComfy: "BitwiseAndMask"
    MASK: Slot<'MASK', 0>,
}
export interface ImpactBitwiseAndMask_input {
    mask1: _MASK
    mask2: _MASK
}

// SubtractMask [ImpactPack_Operation]
export interface ImpactSubtractMask extends HasSingle_MASK, ComfyNode<ImpactSubtractMask_input> {
    nameInComfy: "SubtractMask"
    MASK: Slot<'MASK', 0>,
}
export interface ImpactSubtractMask_input {
    mask1: _MASK
    mask2: _MASK
}

// AddMask [ImpactPack_Operation]
export interface ImpactAddMask extends HasSingle_MASK, ComfyNode<ImpactAddMask_input> {
    nameInComfy: "AddMask"
    MASK: Slot<'MASK', 0>,
}
export interface ImpactAddMask_input {
    mask1: _MASK
    mask2: _MASK
}

// Segs & Mask [ImpactPack_Operation]
export interface ImpactSegsMask extends HasSingle_SEGS, ComfyNode<ImpactSegsMask_input> {
    nameInComfy: "Segs & Mask"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactSegsMask_input {
    segs: _SEGS
    mask: _MASK
}

// Segs & Mask ForEach [ImpactPack_Operation]
export interface ImpactSegsMaskForEach extends HasSingle_SEGS, ComfyNode<ImpactSegsMaskForEach_input> {
    nameInComfy: "Segs & Mask ForEach"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactSegsMaskForEach_input {
    segs: _SEGS
    masks: _MASKS
}

// EmptySegs [ImpactPack_Util]
export interface ImpactEmptySegs extends HasSingle_SEGS, ComfyNode<ImpactEmptySegs_input> {
    nameInComfy: "EmptySegs"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactEmptySegs_input {
}

// MediaPipeFaceMeshToSEGS [ImpactPack_Operation]
export interface ImpactMediaPipeFaceMeshToSEGS extends HasSingle_SEGS, ComfyNode<ImpactMediaPipeFaceMeshToSEGS_input> {
    nameInComfy: "MediaPipeFaceMeshToSEGS"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactMediaPipeFaceMeshToSEGS_input {
    image: _IMAGE
    /** default=3 min=10 max=10 step=0.1 */
    crop_factor?: _FLOAT
    /** default=false */
    bbox_fill?: _BOOLEAN
    /** default=50 min=8192 max=8192 step=1 */
    crop_min_size?: _INT
    /** default=1 min=8192 max=8192 step=1 */
    drop_size?: _INT
    /** default=0 min=512 max=512 step=1 */
    dilation?: _INT
    /** default=true */
    face?: _BOOLEAN
    /** default=false */
    mouth?: _BOOLEAN
    /** default=false */
    left_eyebrow?: _BOOLEAN
    /** default=false */
    left_eye?: _BOOLEAN
    /** default=false */
    left_pupil?: _BOOLEAN
    /** default=false */
    right_eyebrow?: _BOOLEAN
    /** default=false */
    right_eye?: _BOOLEAN
    /** default=false */
    right_pupil?: _BOOLEAN
}

// MaskToSEGS [ImpactPack_Operation]
export interface ImpactMaskToSEGS extends HasSingle_SEGS, ComfyNode<ImpactMaskToSEGS_input> {
    nameInComfy: "MaskToSEGS"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactMaskToSEGS_input {
    mask: _MASK
    /** default=false */
    combined?: _BOOLEAN
    /** default=3 min=10 max=10 step=0.1 */
    crop_factor?: _FLOAT
    /** default=false */
    bbox_fill?: _BOOLEAN
    /** default=10 min=8192 max=8192 step=1 */
    drop_size?: _INT
}

// ToBinaryMask [ImpactPack_Operation]
export interface ImpactToBinaryMask extends HasSingle_MASK, ComfyNode<ImpactToBinaryMask_input> {
    nameInComfy: "ToBinaryMask"
    MASK: Slot<'MASK', 0>,
}
export interface ImpactToBinaryMask_input {
    mask: _MASK
    /** default=20 min=255 max=255 */
    threshold?: _INT
}

// MasksToMaskList [ImpactPack_Operation]
export interface ImpactMasksToMaskList extends HasSingle_MASK, ComfyNode<ImpactMasksToMaskList_input> {
    nameInComfy: "MasksToMaskList"
    MASK: Slot<'MASK', 0>,
}
export interface ImpactMasksToMaskList_input {
    masks: _MASKS
}

// MaskListToMaskBatch [ImpactPack_Operation]
export interface ImpactMaskListToMaskBatch extends HasSingle_MASKS, ComfyNode<ImpactMaskListToMaskBatch_input> {
    nameInComfy: "MaskListToMaskBatch"
    MASKS: Slot<'MASKS', 0>,
}
export interface ImpactMaskListToMaskBatch_input {
    mask: _MASK
}

// BboxDetectorSEGS [ImpactPack_Detector]
export interface ImpactBboxDetectorSEGS extends HasSingle_SEGS, ComfyNode<ImpactBboxDetectorSEGS_input> {
    nameInComfy: "BboxDetectorSEGS"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactBboxDetectorSEGS_input {
    bbox_detector: _BBOX_DETECTOR
    image: _IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    threshold?: _FLOAT
    /** default=10 min=512 max=512 step=1 */
    dilation?: _INT
    /** default=3 min=10 max=10 step=0.1 */
    crop_factor?: _FLOAT
    /** default=10 min=8192 max=8192 step=1 */
    drop_size?: _INT
}

// SegmDetectorSEGS [ImpactPack_Detector]
export interface ImpactSegmDetectorSEGS extends HasSingle_SEGS, ComfyNode<ImpactSegmDetectorSEGS_input> {
    nameInComfy: "SegmDetectorSEGS"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactSegmDetectorSEGS_input {
    segm_detector: _SEGM_DETECTOR
    image: _IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    threshold?: _FLOAT
    /** default=10 min=512 max=512 step=1 */
    dilation?: _INT
    /** default=3 min=10 max=10 step=0.1 */
    crop_factor?: _FLOAT
    /** default=10 min=8192 max=8192 step=1 */
    drop_size?: _INT
}

// ONNXDetectorSEGS [ImpactPack_Detector]
export interface ImpactONNXDetectorSEGS extends HasSingle_SEGS, ComfyNode<ImpactONNXDetectorSEGS_input> {
    nameInComfy: "ONNXDetectorSEGS"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactONNXDetectorSEGS_input {
    onnx_detector: _ONNX_DETECTOR
    image: _IMAGE
    /** default=0.8 min=1 max=1 step=0.01 */
    threshold?: _FLOAT
    /** default=10 min=512 max=512 step=1 */
    dilation?: _INT
    /** default=1 min=10 max=10 step=0.1 */
    crop_factor?: _FLOAT
    /** default=10 min=8192 max=8192 step=1 */
    drop_size?: _INT
}

// ImpactSimpleDetectorSEGS [ImpactPack_Detector]
export interface ImpactImpactSimpleDetectorSEGS extends HasSingle_SEGS, ComfyNode<ImpactImpactSimpleDetectorSEGS_input> {
    nameInComfy: "ImpactSimpleDetectorSEGS"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactImpactSimpleDetectorSEGS_input {
    bbox_detector: _BBOX_DETECTOR
    image: _IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    bbox_threshold?: _FLOAT
    /** default=0 min=255 max=255 step=1 */
    bbox_dilation?: _INT
    /** default=3 min=10 max=10 step=0.1 */
    crop_factor?: _FLOAT
    /** default=10 min=8192 max=8192 step=1 */
    drop_size?: _INT
    /** default=0.5 min=1 max=1 step=0.01 */
    sub_threshold?: _FLOAT
    /** default=0 min=255 max=255 step=1 */
    sub_dilation?: _INT
    /** default=0 min=1000 max=1000 step=1 */
    sub_bbox_expansion?: _INT
    /** default=0.7 min=1 max=1 step=0.01 */
    sam_mask_hint_threshold?: _FLOAT
    sam_model_opt?: _SAM_MODEL
    segm_detector_opt?: _SEGM_DETECTOR
}

// ImpactSimpleDetectorSEGSPipe [ImpactPack_Detector]
export interface ImpactImpactSimpleDetectorSEGSPipe extends HasSingle_SEGS, ComfyNode<ImpactImpactSimpleDetectorSEGSPipe_input> {
    nameInComfy: "ImpactSimpleDetectorSEGSPipe"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactImpactSimpleDetectorSEGSPipe_input {
    detailer_pipe: _DETAILER_PIPE
    image: _IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    bbox_threshold?: _FLOAT
    /** default=0 min=255 max=255 step=1 */
    bbox_dilation?: _INT
    /** default=3 min=10 max=10 step=0.1 */
    crop_factor?: _FLOAT
    /** default=10 min=8192 max=8192 step=1 */
    drop_size?: _INT
    /** default=0.5 min=1 max=1 step=0.01 */
    sub_threshold?: _FLOAT
    /** default=0 min=255 max=255 step=1 */
    sub_dilation?: _INT
    /** default=0 min=1000 max=1000 step=1 */
    sub_bbox_expansion?: _INT
    /** default=0.7 min=1 max=1 step=0.01 */
    sam_mask_hint_threshold?: _FLOAT
}

// ImpactControlNetApplySEGS [ImpactPack_Util]
export interface ImpactImpactControlNetApplySEGS extends HasSingle_SEGS, ComfyNode<ImpactImpactControlNetApplySEGS_input> {
    nameInComfy: "ImpactControlNetApplySEGS"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactImpactControlNetApplySEGS_input {
    segs: _SEGS
    control_net: _CONTROL_NET
    /** default=1 min=10 max=10 step=0.01 */
    strength?: _FLOAT
    segs_preprocessor?: _SEGS_PREPROCESSOR
}

// ImpactDecomposeSEGS [ImpactPack_Util]
export interface ImpactImpactDecomposeSEGS extends HasSingle_SEGS_HEADER, HasSingle_SEG_ELT, ComfyNode<ImpactImpactDecomposeSEGS_input> {
    nameInComfy: "ImpactDecomposeSEGS"
    SEGS_HEADER: Slot<'SEGS_HEADER', 0>,
    SEG_ELT: Slot<'SEG_ELT', 1>,
}
export interface ImpactImpactDecomposeSEGS_input {
    segs: _SEGS
}

// ImpactAssembleSEGS [ImpactPack_Util]
export interface ImpactImpactAssembleSEGS extends HasSingle_SEGS, ComfyNode<ImpactImpactAssembleSEGS_input> {
    nameInComfy: "ImpactAssembleSEGS"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactImpactAssembleSEGS_input {
    seg_header: _SEGS_HEADER
    seg_elt: _SEG_ELT
}

// ImpactFrom_SEG_ELT [ImpactPack_Util]
export interface ImpactImpactFrom_SEG_ELT extends HasSingle_SEG_ELT, HasSingle_IMAGE, HasSingle_MASK, HasSingle_SEG_ELT_crop_region, HasSingle_SEG_ELT_bbox, HasSingle_SEG_ELT_control_net_wrapper, HasSingle_FLOAT, HasSingle_STRING, ComfyNode<ImpactImpactFrom_SEG_ELT_input> {
    nameInComfy: "ImpactFrom_SEG_ELT"
    SEG_ELT: Slot<'SEG_ELT', 0>,
    IMAGE: Slot<'IMAGE', 1>,
    MASK: Slot<'MASK', 2>,
    SEG_ELT_crop_region: Slot<'SEG_ELT_crop_region', 3>,
    SEG_ELT_bbox: Slot<'SEG_ELT_bbox', 4>,
    SEG_ELT_control_net_wrapper: Slot<'SEG_ELT_control_net_wrapper', 5>,
    FLOAT: Slot<'FLOAT', 6>,
    STRING: Slot<'STRING', 7>,
}
export interface ImpactImpactFrom_SEG_ELT_input {
    seg_elt: _SEG_ELT
}

// ImpactEdit_SEG_ELT [ImpactPack_Util]
export interface ImpactImpactEdit_SEG_ELT extends HasSingle_SEG_ELT, ComfyNode<ImpactImpactEdit_SEG_ELT_input> {
    nameInComfy: "ImpactEdit_SEG_ELT"
    SEG_ELT: Slot<'SEG_ELT', 0>,
}
export interface ImpactImpactEdit_SEG_ELT_input {
    seg_elt: _SEG_ELT
    cropped_image_opt?: _IMAGE
    cropped_mask_opt?: _MASK
    crop_region_opt?: _SEG_ELT_crop_region
    bbox_opt?: _SEG_ELT_bbox
    control_net_wrapper_opt?: _SEG_ELT_control_net_wrapper
    /** min=1 max=1 step=0.1 */
    confidence_opt?: _FLOAT
    /** */
    label_opt?: _STRING
}

// ImpactDilate_Mask_SEG_ELT [ImpactPack_Util]
export interface ImpactImpactDilate_Mask_SEG_ELT extends HasSingle_SEG_ELT, ComfyNode<ImpactImpactDilate_Mask_SEG_ELT_input> {
    nameInComfy: "ImpactDilate_Mask_SEG_ELT"
    SEG_ELT: Slot<'SEG_ELT', 0>,
}
export interface ImpactImpactDilate_Mask_SEG_ELT_input {
    seg_elt: _SEG_ELT
    /** default=10 min=512 max=512 step=1 */
    dilation?: _INT
}

// ImpactDilateMask [ImpactPack_Util]
export interface ImpactImpactDilateMask extends HasSingle_MASK, ComfyNode<ImpactImpactDilateMask_input> {
    nameInComfy: "ImpactDilateMask"
    MASK: Slot<'MASK', 0>,
}
export interface ImpactImpactDilateMask_input {
    mask: _MASK
    /** default=10 min=512 max=512 step=1 */
    dilation?: _INT
}

// ImpactScaleBy_BBOX_SEG_ELT [ImpactPack_Util]
export interface ImpactImpactScaleBy_BBOX_SEG_ELT extends HasSingle_SEG_ELT, ComfyNode<ImpactImpactScaleBy_BBOX_SEG_ELT_input> {
    nameInComfy: "ImpactScaleBy_BBOX_SEG_ELT"
    SEG_ELT: Slot<'SEG_ELT', 0>,
}
export interface ImpactImpactScaleBy_BBOX_SEG_ELT_input {
    seg: _SEG_ELT
    /** default=1 min=8 max=8 step=0.01 */
    scale_by?: _FLOAT
}

// BboxDetectorCombined_v2 [ImpactPack_Detector]
export interface ImpactBboxDetectorCombined_v2 extends HasSingle_MASK, ComfyNode<ImpactBboxDetectorCombined_v2_input> {
    nameInComfy: "BboxDetectorCombined_v2"
    MASK: Slot<'MASK', 0>,
}
export interface ImpactBboxDetectorCombined_v2_input {
    bbox_detector: _BBOX_DETECTOR
    image: _IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    threshold?: _FLOAT
    /** default=4 min=512 max=512 step=1 */
    dilation?: _INT
}

// SegmDetectorCombined_v2 [ImpactPack_Detector]
export interface ImpactSegmDetectorCombined_v2 extends HasSingle_MASK, ComfyNode<ImpactSegmDetectorCombined_v2_input> {
    nameInComfy: "SegmDetectorCombined_v2"
    MASK: Slot<'MASK', 0>,
}
export interface ImpactSegmDetectorCombined_v2_input {
    segm_detector: _SEGM_DETECTOR
    image: _IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    threshold?: _FLOAT
    /** default=0 min=512 max=512 step=1 */
    dilation?: _INT
}

// SegsToCombinedMask [ImpactPack_Operation]
export interface ImpactSegsToCombinedMask extends HasSingle_MASK, ComfyNode<ImpactSegsToCombinedMask_input> {
    nameInComfy: "SegsToCombinedMask"
    MASK: Slot<'MASK', 0>,
}
export interface ImpactSegsToCombinedMask_input {
    segs: _SEGS
}

// KSamplerProvider [ImpactPack_Sampler]
export interface ImpactKSamplerProvider extends HasSingle_KSAMPLER, ComfyNode<ImpactKSamplerProvider_input> {
    nameInComfy: "KSamplerProvider"
    KSAMPLER: Slot<'KSAMPLER', 0>,
}
export interface ImpactKSamplerProvider_input {
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    basic_pipe: _BASIC_PIPE
}

// TwoSamplersForMask [ImpactPack_Sampler]
export interface ImpactTwoSamplersForMask extends HasSingle_LATENT, ComfyNode<ImpactTwoSamplersForMask_input> {
    nameInComfy: "TwoSamplersForMask"
    LATENT: Slot<'LATENT', 0>,
}
export interface ImpactTwoSamplersForMask_input {
    latent_image: _LATENT
    base_sampler: _KSAMPLER
    mask_sampler: _KSAMPLER
    mask: _MASK
}

// TiledKSamplerProvider [ImpactPack_Sampler]
export interface ImpactTiledKSamplerProvider extends HasSingle_KSAMPLER, ComfyNode<ImpactTiledKSamplerProvider_input> {
    nameInComfy: "TiledKSamplerProvider"
    KSAMPLER: Slot<'KSAMPLER', 0>,
}
export interface ImpactTiledKSamplerProvider_input {
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    /** default=512 min=8192 max=8192 step=64 */
    tile_width?: _INT
    /** default=512 min=8192 max=8192 step=64 */
    tile_height?: _INT
    tiling_strategy: Enum_ImpactPixelTiledKSampleUpscalerProvider_Tiling_strategy
    basic_pipe: _BASIC_PIPE
}

// KSamplerAdvancedProvider [ImpactPack_Sampler]
export interface ImpactKSamplerAdvancedProvider extends HasSingle_KSAMPLER_ADVANCED, ComfyNode<ImpactKSamplerAdvancedProvider_input> {
    nameInComfy: "KSamplerAdvancedProvider"
    KSAMPLER_ADVANCED: Slot<'KSAMPLER_ADVANCED', 0>,
}
export interface ImpactKSamplerAdvancedProvider_input {
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    basic_pipe: _BASIC_PIPE
}

// TwoAdvancedSamplersForMask [ImpactPack_Sampler]
export interface ImpactTwoAdvancedSamplersForMask extends HasSingle_LATENT, ComfyNode<ImpactTwoAdvancedSamplersForMask_input> {
    nameInComfy: "TwoAdvancedSamplersForMask"
    LATENT: Slot<'LATENT', 0>,
}
export interface ImpactTwoAdvancedSamplersForMask_input {
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    samples: _LATENT
    base_sampler: _KSAMPLER_ADVANCED
    mask_sampler: _KSAMPLER_ADVANCED
    mask: _MASK
    /** default=10 min=10000 max=10000 */
    overlap_factor?: _INT
}

// PreviewBridge [ImpactPack_Util]
export interface ImpactPreviewBridge extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImpactPreviewBridge_input> {
    nameInComfy: "PreviewBridge"
    IMAGE: Slot<'IMAGE', 0>,
    MASK: Slot<'MASK', 1>,
}
export interface ImpactPreviewBridge_input {
    images: _IMAGE
    image?: Enum_ImpactPreviewBridge_Image
}

// ImageSender [ImpactPack_Util]
export interface ImpactImageSender extends ComfyNode<ImpactImageSender_input> {
    nameInComfy: "ImageSender"
}
export interface ImpactImageSender_input {
    images: _IMAGE
    /** default="ImgSender" */
    filename_prefix?: _STRING
    /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
    link_id?: _INT
}

// ImageReceiver [ImpactPack_Util]
export interface ImpactImageReceiver extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImpactImageReceiver_input> {
    nameInComfy: "ImageReceiver"
    IMAGE: Slot<'IMAGE', 0>,
    MASK: Slot<'MASK', 1>,
}
export interface ImpactImageReceiver_input {
    image: Enum_LoadImage_Image
    /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
    link_id?: _INT
}

// LatentSender [ImpactPack_Util]
export interface ImpactLatentSender extends ComfyNode<ImpactLatentSender_input> {
    nameInComfy: "LatentSender"
}
export interface ImpactLatentSender_input {
    samples: _LATENT
    /** default="latents/LatentSender" */
    filename_prefix?: _STRING
    /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
    link_id?: _INT
    preview_method: Enum_ImpactLatentSender_Preview_method
}

// LatentReceiver [ImpactPack_Util]
export interface ImpactLatentReceiver extends HasSingle_LATENT, ComfyNode<ImpactLatentReceiver_input> {
    nameInComfy: "LatentReceiver"
    LATENT: Slot<'LATENT', 0>,
}
export interface ImpactLatentReceiver_input {
    latent: Enum_CLIPLoader_Clip_name
    /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
    link_id?: _INT
}

// ImageMaskSwitch [ImpactPack_Util]
export interface ImpactImageMaskSwitch extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImpactImageMaskSwitch_input> {
    nameInComfy: "ImageMaskSwitch"
    IMAGE: Slot<'IMAGE', 0>,
    MASK: Slot<'MASK', 1>,
}
export interface ImpactImageMaskSwitch_input {
    /** default=1 min=4 max=4 step=1 */
    select?: _INT
    images1: _IMAGE
    mask1_opt?: _MASK
    images2_opt?: _IMAGE
    mask2_opt?: _MASK
    images3_opt?: _IMAGE
    mask3_opt?: _MASK
    images4_opt?: _IMAGE
    mask4_opt?: _MASK
}

// LatentSwitch [ImpactPack_Util]
export interface ImpactLatentSwitch extends HasSingle_STAR, HasSingle_STRING, ComfyNode<ImpactLatentSwitch_input> {
    nameInComfy: "LatentSwitch"
    "*": Slot<'*', 0>,
    STRING: Slot<'STRING', 1>,
}
export interface ImpactLatentSwitch_input {
    /** default=1 min=999999 max=999999 step=1 */
    select?: _INT
    /** default=true */
    sel_mode?: _BOOLEAN
    input1?: _STAR
}

// SEGSSwitch [ImpactPack_Util]
export interface ImpactSEGSSwitch extends HasSingle_STAR, HasSingle_STRING, ComfyNode<ImpactSEGSSwitch_input> {
    nameInComfy: "SEGSSwitch"
    "*": Slot<'*', 0>,
    STRING: Slot<'STRING', 1>,
}
export interface ImpactSEGSSwitch_input {
    /** default=1 min=999999 max=999999 step=1 */
    select?: _INT
    /** default=true */
    sel_mode?: _BOOLEAN
    input1?: _STAR
}

// ImpactSwitch [ImpactPack_Util]
export interface ImpactImpactSwitch extends HasSingle_STAR, HasSingle_STRING, ComfyNode<ImpactImpactSwitch_input> {
    nameInComfy: "ImpactSwitch"
    "*": Slot<'*', 0>,
    STRING: Slot<'STRING', 1>,
}
export interface ImpactImpactSwitch_input {
    /** default=1 min=999999 max=999999 step=1 */
    select?: _INT
    /** default=true */
    sel_mode?: _BOOLEAN
    input1?: _STAR
}

// ImpactInversedSwitch [ImpactPack_Util]
export interface ImpactImpactInversedSwitch extends ComfyNode<ImpactImpactInversedSwitch_input> {
    nameInComfy: "ImpactInversedSwitch"
    "*": Slot<'*', 0>,
    "*_1": Slot<'*', 1>,
    "*_2": Slot<'*', 2>,
    "*_3": Slot<'*', 3>,
    "*_4": Slot<'*', 4>,
    "*_5": Slot<'*', 5>,
    "*_6": Slot<'*', 6>,
    "*_7": Slot<'*', 7>,
    "*_8": Slot<'*', 8>,
    "*_9": Slot<'*', 9>,
    "*_10": Slot<'*', 10>,
    "*_11": Slot<'*', 11>,
    "*_12": Slot<'*', 12>,
    "*_13": Slot<'*', 13>,
    "*_14": Slot<'*', 14>,
    "*_15": Slot<'*', 15>,
    "*_16": Slot<'*', 16>,
    "*_17": Slot<'*', 17>,
    "*_18": Slot<'*', 18>,
    "*_19": Slot<'*', 19>,
    "*_20": Slot<'*', 20>,
    "*_21": Slot<'*', 21>,
    "*_22": Slot<'*', 22>,
    "*_23": Slot<'*', 23>,
    "*_24": Slot<'*', 24>,
    "*_25": Slot<'*', 25>,
    "*_26": Slot<'*', 26>,
    "*_27": Slot<'*', 27>,
    "*_28": Slot<'*', 28>,
    "*_29": Slot<'*', 29>,
    "*_30": Slot<'*', 30>,
    "*_31": Slot<'*', 31>,
    "*_32": Slot<'*', 32>,
    "*_33": Slot<'*', 33>,
    "*_34": Slot<'*', 34>,
    "*_35": Slot<'*', 35>,
    "*_36": Slot<'*', 36>,
    "*_37": Slot<'*', 37>,
    "*_38": Slot<'*', 38>,
    "*_39": Slot<'*', 39>,
    "*_40": Slot<'*', 40>,
    "*_41": Slot<'*', 41>,
    "*_42": Slot<'*', 42>,
    "*_43": Slot<'*', 43>,
    "*_44": Slot<'*', 44>,
    "*_45": Slot<'*', 45>,
    "*_46": Slot<'*', 46>,
    "*_47": Slot<'*', 47>,
    "*_48": Slot<'*', 48>,
    "*_49": Slot<'*', 49>,
    "*_50": Slot<'*', 50>,
    "*_51": Slot<'*', 51>,
    "*_52": Slot<'*', 52>,
    "*_53": Slot<'*', 53>,
    "*_54": Slot<'*', 54>,
    "*_55": Slot<'*', 55>,
    "*_56": Slot<'*', 56>,
    "*_57": Slot<'*', 57>,
    "*_58": Slot<'*', 58>,
    "*_59": Slot<'*', 59>,
    "*_60": Slot<'*', 60>,
    "*_61": Slot<'*', 61>,
    "*_62": Slot<'*', 62>,
    "*_63": Slot<'*', 63>,
    "*_64": Slot<'*', 64>,
    "*_65": Slot<'*', 65>,
    "*_66": Slot<'*', 66>,
    "*_67": Slot<'*', 67>,
    "*_68": Slot<'*', 68>,
    "*_69": Slot<'*', 69>,
    "*_70": Slot<'*', 70>,
    "*_71": Slot<'*', 71>,
    "*_72": Slot<'*', 72>,
    "*_73": Slot<'*', 73>,
    "*_74": Slot<'*', 74>,
    "*_75": Slot<'*', 75>,
    "*_76": Slot<'*', 76>,
    "*_77": Slot<'*', 77>,
    "*_78": Slot<'*', 78>,
    "*_79": Slot<'*', 79>,
    "*_80": Slot<'*', 80>,
    "*_81": Slot<'*', 81>,
    "*_82": Slot<'*', 82>,
    "*_83": Slot<'*', 83>,
    "*_84": Slot<'*', 84>,
    "*_85": Slot<'*', 85>,
    "*_86": Slot<'*', 86>,
    "*_87": Slot<'*', 87>,
    "*_88": Slot<'*', 88>,
    "*_89": Slot<'*', 89>,
    "*_90": Slot<'*', 90>,
    "*_91": Slot<'*', 91>,
    "*_92": Slot<'*', 92>,
    "*_93": Slot<'*', 93>,
    "*_94": Slot<'*', 94>,
    "*_95": Slot<'*', 95>,
    "*_96": Slot<'*', 96>,
    "*_97": Slot<'*', 97>,
    "*_98": Slot<'*', 98>,
    "*_99": Slot<'*', 99>,
}
export interface ImpactImpactInversedSwitch_input {
    /** default=1 min=999999 max=999999 step=1 */
    select?: _INT
    input: _STAR
}

// ImpactWildcardProcessor [ImpactPack_Prompt]
export interface ImpactImpactWildcardProcessor extends HasSingle_STRING, ComfyNode<ImpactImpactWildcardProcessor_input> {
    nameInComfy: "ImpactWildcardProcessor"
    STRING: Slot<'STRING', 0>,
}
export interface ImpactImpactWildcardProcessor_input {
    /** */
    wildcard_text: _STRING
    /** */
    populated_text: _STRING
    /** default=true */
    mode?: _BOOLEAN
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
}

// ImpactWildcardEncode [ImpactPack_Prompt]
export interface ImpactImpactWildcardEncode extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_CONDITIONING, HasSingle_STRING, ComfyNode<ImpactImpactWildcardEncode_input> {
    nameInComfy: "ImpactWildcardEncode"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    CONDITIONING: Slot<'CONDITIONING', 2>,
    STRING: Slot<'STRING', 3>,
}
export interface ImpactImpactWildcardEncode_input {
    model: _MODEL
    clip: _CLIP
    /** */
    wildcard_text: _STRING
    /** */
    populated_text: _STRING
    /** default=true */
    mode?: _BOOLEAN
    "Select to add LoRA": Enum_ImpactToDetailerPipe_SelectToAddLoRA
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
}

// SEGSDetailer [ImpactPack_Detailer]
export interface ImpactSEGSDetailer extends HasSingle_SEGS, HasSingle_IMAGE, ComfyNode<ImpactSEGSDetailer_input> {
    nameInComfy: "SEGSDetailer"
    SEGS: Slot<'SEGS', 0>,
    IMAGE: Slot<'IMAGE', 1>,
}
export interface ImpactSEGSDetailer_input {
    image: _IMAGE
    segs: _SEGS
    /** default=256 min=8192 max=8192 step=8 */
    guide_size?: _FLOAT
    /** default=true */
    guide_size_for?: _BOOLEAN
    /** default=768 min=8192 max=8192 step=8 */
    max_size?: _FLOAT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    /** default=true */
    noise_mask?: _BOOLEAN
    /** default=false */
    force_inpaint?: _BOOLEAN
    basic_pipe: _BASIC_PIPE
    /** default=0.2 min=1 max=1 */
    refiner_ratio?: _FLOAT
    refiner_basic_pipe_opt?: _BASIC_PIPE
}

// SEGSPaste [ImpactPack_Detailer]
export interface ImpactSEGSPaste extends HasSingle_IMAGE, ComfyNode<ImpactSEGSPaste_input> {
    nameInComfy: "SEGSPaste"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImpactSEGSPaste_input {
    image: _IMAGE
    segs: _SEGS
    /** default=5 min=100 max=100 step=1 */
    feather?: _INT
    ref_image_opt?: _IMAGE
}

// SEGSPreview [ImpactPack_Util]
export interface ImpactSEGSPreview extends ComfyNode<ImpactSEGSPreview_input> {
    nameInComfy: "SEGSPreview"
}
export interface ImpactSEGSPreview_input {
    segs: _SEGS
    fallback_image_opt?: _IMAGE
}

// SEGSToImageList [ImpactPack_Util]
export interface ImpactSEGSToImageList extends HasSingle_IMAGE, ComfyNode<ImpactSEGSToImageList_input> {
    nameInComfy: "SEGSToImageList"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImpactSEGSToImageList_input {
    segs: _SEGS
    fallback_image_opt?: _IMAGE
}

// ImpactSEGSToMaskList [ImpactPack_Util]
export interface ImpactImpactSEGSToMaskList extends HasSingle_MASK, ComfyNode<ImpactImpactSEGSToMaskList_input> {
    nameInComfy: "ImpactSEGSToMaskList"
    MASK: Slot<'MASK', 0>,
}
export interface ImpactImpactSEGSToMaskList_input {
    segs: _SEGS
}

// ImpactSEGSToMaskBatch [ImpactPack_Util]
export interface ImpactImpactSEGSToMaskBatch extends HasSingle_MASKS, ComfyNode<ImpactImpactSEGSToMaskBatch_input> {
    nameInComfy: "ImpactSEGSToMaskBatch"
    MASKS: Slot<'MASKS', 0>,
}
export interface ImpactImpactSEGSToMaskBatch_input {
    segs: _SEGS
}

// ImpactSEGSConcat [ImpactPack_Util]
export interface ImpactImpactSEGSConcat extends HasSingle_SEGS, ComfyNode<ImpactImpactSEGSConcat_input> {
    nameInComfy: "ImpactSEGSConcat"
    SEGS: Slot<'SEGS', 0>,
}
export interface ImpactImpactSEGSConcat_input {
    segs1: _SEGS
    segs2: _SEGS
}

// ImpactKSamplerBasicPipe [sampling]
export interface ImpactKSamplerBasicPipe extends HasSingle_BASIC_PIPE, HasSingle_LATENT, HasSingle_VAE, ComfyNode<ImpactKSamplerBasicPipe_input> {
    nameInComfy: "ImpactKSamplerBasicPipe"
    BASIC_PIPE: Slot<'BASIC_PIPE', 0>,
    LATENT: Slot<'LATENT', 1>,
    VAE: Slot<'VAE', 2>,
}
export interface ImpactKSamplerBasicPipe_input {
    basic_pipe: _BASIC_PIPE
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    latent_image: _LATENT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
}

// ImpactKSamplerAdvancedBasicPipe [sampling]
export interface ImpactKSamplerAdvancedBasicPipe extends HasSingle_BASIC_PIPE, HasSingle_LATENT, HasSingle_VAE, ComfyNode<ImpactKSamplerAdvancedBasicPipe_input> {
    nameInComfy: "ImpactKSamplerAdvancedBasicPipe"
    BASIC_PIPE: Slot<'BASIC_PIPE', 0>,
    LATENT: Slot<'LATENT', 1>,
    VAE: Slot<'VAE', 2>,
}
export interface ImpactKSamplerAdvancedBasicPipe_input {
    basic_pipe: _BASIC_PIPE
    /** default=true */
    add_noise?: _BOOLEAN
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    noise_seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    latent_image: _LATENT
    /** default=0 min=10000 max=10000 */
    start_at_step?: _INT
    /** default=10000 min=10000 max=10000 */
    end_at_step?: _INT
    /** default=false */
    return_with_leftover_noise?: _BOOLEAN
}

// ReencodeLatent [ImpactPack_Util]
export interface ImpactReencodeLatent extends HasSingle_LATENT, ComfyNode<ImpactReencodeLatent_input> {
    nameInComfy: "ReencodeLatent"
    LATENT: Slot<'LATENT', 0>,
}
export interface ImpactReencodeLatent_input {
    samples: _LATENT
    tile_mode: Enum_ImpactReencodeLatent_Tile_mode
    input_vae: _VAE
    output_vae: _VAE
    /** default=512 min=4096 max=4096 step=64 */
    tile_size?: _INT
}

// ReencodeLatentPipe [ImpactPack_Util]
export interface ImpactReencodeLatentPipe extends HasSingle_LATENT, ComfyNode<ImpactReencodeLatentPipe_input> {
    nameInComfy: "ReencodeLatentPipe"
    LATENT: Slot<'LATENT', 0>,
}
export interface ImpactReencodeLatentPipe_input {
    samples: _LATENT
    tile_mode: Enum_ImpactReencodeLatent_Tile_mode
    input_basic_pipe: _BASIC_PIPE
    output_basic_pipe: _BASIC_PIPE
}

// ImpactImageBatchToImageList [ImpactPack_Util]
export interface ImpactImpactImageBatchToImageList extends HasSingle_IMAGE, ComfyNode<ImpactImpactImageBatchToImageList_input> {
    nameInComfy: "ImpactImageBatchToImageList"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImpactImpactImageBatchToImageList_input {
    image: _IMAGE
}

// ImpactMakeImageList [ImpactPack_Util]
export interface ImpactImpactMakeImageList extends HasSingle_IMAGE, ComfyNode<ImpactImpactMakeImageList_input> {
    nameInComfy: "ImpactMakeImageList"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImpactImpactMakeImageList_input {
    image1: _IMAGE
}

// RegionalSampler [ImpactPack_Regional]
export interface ImpactRegionalSampler extends HasSingle_LATENT, ComfyNode<ImpactRegionalSampler_input> {
    nameInComfy: "RegionalSampler"
    LATENT: Slot<'LATENT', 0>,
}
export interface ImpactRegionalSampler_input {
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    samples: _LATENT
    base_sampler: _KSAMPLER_ADVANCED
    regional_prompts: _REGIONAL_PROMPTS
    /** default=10 min=10000 max=10000 */
    overlap_factor?: _INT
}

// CombineRegionalPrompts [ImpactPack_Regional]
export interface ImpactCombineRegionalPrompts extends HasSingle_REGIONAL_PROMPTS, ComfyNode<ImpactCombineRegionalPrompts_input> {
    nameInComfy: "CombineRegionalPrompts"
    REGIONAL_PROMPTS: Slot<'REGIONAL_PROMPTS', 0>,
}
export interface ImpactCombineRegionalPrompts_input {
    regional_prompts1: _REGIONAL_PROMPTS
}

// RegionalPrompt [ImpactPack_Regional]
export interface ImpactRegionalPrompt extends HasSingle_REGIONAL_PROMPTS, ComfyNode<ImpactRegionalPrompt_input> {
    nameInComfy: "RegionalPrompt"
    REGIONAL_PROMPTS: Slot<'REGIONAL_PROMPTS', 0>,
}
export interface ImpactRegionalPrompt_input {
    mask: _MASK
    advanced_sampler: _KSAMPLER_ADVANCED
}

// ImpactSEGSLabelFilter [ImpactPack_Util]
export interface ImpactImpactSEGSLabelFilter extends ComfyNode<ImpactImpactSEGSLabelFilter_input> {
    nameInComfy: "ImpactSEGSLabelFilter"
    SEGS: Slot<'SEGS', 0>,
    SEGS_1: Slot<'SEGS', 1>,
}
export interface ImpactImpactSEGSLabelFilter_input {
    segs: _SEGS
    preset: Enum_ImpactImpactSEGSLabelFilter_Preset
    /** */
    labels: _STRING
}

// ImpactSEGSRangeFilter [ImpactPack_Util]
export interface ImpactImpactSEGSRangeFilter extends ComfyNode<ImpactImpactSEGSRangeFilter_input> {
    nameInComfy: "ImpactSEGSRangeFilter"
    SEGS: Slot<'SEGS', 0>,
    SEGS_1: Slot<'SEGS', 1>,
}
export interface ImpactImpactSEGSRangeFilter_input {
    segs: _SEGS
    target: Enum_ImpactImpactSEGSRangeFilter_Target
    /** default=true */
    mode?: _BOOLEAN
    /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
    min_value?: _INT
    /** default=67108864 min=9223372036854776000 max=9223372036854776000 step=1 */
    max_value?: _INT
}

// ImpactSEGSOrderedFilter [ImpactPack_Util]
export interface ImpactImpactSEGSOrderedFilter extends ComfyNode<ImpactImpactSEGSOrderedFilter_input> {
    nameInComfy: "ImpactSEGSOrderedFilter"
    SEGS: Slot<'SEGS', 0>,
    SEGS_1: Slot<'SEGS', 1>,
}
export interface ImpactImpactSEGSOrderedFilter_input {
    segs: _SEGS
    target: Enum_ImpactImpactSEGSOrderedFilter_Target
    /** default=true */
    order?: _BOOLEAN
    /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
    take_start?: _INT
    /** default=1 min=9223372036854776000 max=9223372036854776000 step=1 */
    take_count?: _INT
}

// ImpactCompare [ImpactPack_Logic]
export interface ImpactImpactCompare extends HasSingle_BOOLEAN, ComfyNode<ImpactImpactCompare_input> {
    nameInComfy: "ImpactCompare"
    BOOLEAN: Slot<'BOOLEAN', 0>,
}
export interface ImpactImpactCompare_input {
    cmp: Enum_ImpactImpactCompare_Cmp
    a: _STAR
    b: _STAR
}

// ImpactConditionalBranch [ImpactPack_Logic]
export interface ImpactImpactConditionalBranch extends HasSingle_STAR, ComfyNode<ImpactImpactConditionalBranch_input> {
    nameInComfy: "ImpactConditionalBranch"
    "*": Slot<'*', 0>,
}
export interface ImpactImpactConditionalBranch_input {
    /** */
    cond: _BOOLEAN
    tt_value: _STAR
    ff_value: _STAR
}

// ImpactInt [ImpactPack_Logic]
export interface ImpactImpactInt extends HasSingle_INT, ComfyNode<ImpactImpactInt_input> {
    nameInComfy: "ImpactInt"
    INT: Slot<'INT', 0>,
}
export interface ImpactImpactInt_input {
    /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
    value?: _INT
}

// ImpactValueSender [ImpactPack_Logic]
export interface ImpactImpactValueSender extends ComfyNode<ImpactImpactValueSender_input> {
    nameInComfy: "ImpactValueSender"
}
export interface ImpactImpactValueSender_input {
    value: _STAR
    /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
    link_id?: _INT
}

// ImpactValueReceiver [ImpactPack_Logic]
export interface ImpactImpactValueReceiver extends HasSingle_STAR, ComfyNode<ImpactImpactValueReceiver_input> {
    nameInComfy: "ImpactValueReceiver"
    "*": Slot<'*', 0>,
}
export interface ImpactImpactValueReceiver_input {
    typ: Enum_ImpactImpactValueReceiver_Typ
    /** default="" */
    value?: _STRING
    /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
    link_id?: _INT
}

// ImpactImageInfo [ImpactPack_Logic__for_test]
export interface ImpactImpactImageInfo extends ComfyNode<ImpactImpactImageInfo_input> {
    nameInComfy: "ImpactImageInfo"
    INT: Slot<'INT', 0>,
    INT_1: Slot<'INT', 1>,
    INT_2: Slot<'INT', 2>,
    INT_3: Slot<'INT', 3>,
}
export interface ImpactImpactImageInfo_input {
    value: _IMAGE
}

// ImpactMinMax [ImpactPack_Logic__for_test]
export interface ImpactImpactMinMax extends HasSingle_INT, ComfyNode<ImpactImpactMinMax_input> {
    nameInComfy: "ImpactMinMax"
    INT: Slot<'INT', 0>,
}
export interface ImpactImpactMinMax_input {
    /** default=true */
    mode?: _BOOLEAN
    a: _STAR
    b: _STAR
}

// ImpactNeg [ImpactPack_Logic]
export interface ImpactImpactNeg extends HasSingle_BOOLEAN, ComfyNode<ImpactImpactNeg_input> {
    nameInComfy: "ImpactNeg"
    BOOLEAN: Slot<'BOOLEAN', 0>,
}
export interface ImpactImpactNeg_input {
    /** */
    value: _BOOLEAN
}

// ImpactConditionalStopIteration [ImpactPack_Logic]
export interface ImpactImpactConditionalStopIteration extends ComfyNode<ImpactImpactConditionalStopIteration_input> {
    nameInComfy: "ImpactConditionalStopIteration"
}
export interface ImpactImpactConditionalStopIteration_input {
    /** */
    cond: _BOOLEAN
}

// ImpactStringSelector [ImpactPack_Util]
export interface ImpactImpactStringSelector extends HasSingle_STRING, ComfyNode<ImpactImpactStringSelector_input> {
    nameInComfy: "ImpactStringSelector"
    STRING: Slot<'STRING', 0>,
}
export interface ImpactImpactStringSelector_input {
    /** */
    strings: _STRING
    /** default=false */
    multiline?: _BOOLEAN
    /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
    select?: _INT
}

// RemoveNoiseMask [ImpactPack_Util]
export interface ImpactRemoveNoiseMask extends HasSingle_LATENT, ComfyNode<ImpactRemoveNoiseMask_input> {
    nameInComfy: "RemoveNoiseMask"
    LATENT: Slot<'LATENT', 0>,
}
export interface ImpactRemoveNoiseMask_input {
    samples: _LATENT
}

// ImpactLogger [ImpactPack_Debug]
export interface ImpactImpactLogger extends ComfyNode<ImpactImpactLogger_input> {
    nameInComfy: "ImpactLogger"
}
export interface ImpactImpactLogger_input {
    data: _STAR
}

// ImpactDummyInput [ImpactPack_Debug]
export interface ImpactImpactDummyInput extends HasSingle_STAR, ComfyNode<ImpactImpactDummyInput_input> {
    nameInComfy: "ImpactDummyInput"
    "*": Slot<'*', 0>,
}
export interface ImpactImpactDummyInput_input {
}

// UltralyticsDetectorProvider [ImpactPack]
export interface ImpactUltralyticsDetectorProvider extends HasSingle_BBOX_DETECTOR, HasSingle_SEGM_DETECTOR, ComfyNode<ImpactUltralyticsDetectorProvider_input> {
    nameInComfy: "UltralyticsDetectorProvider"
    BBOX_DETECTOR: Slot<'BBOX_DETECTOR', 0>,
    SEGM_DETECTOR: Slot<'SEGM_DETECTOR', 1>,
}
export interface ImpactUltralyticsDetectorProvider_input {
    model_name: Enum_ImpactUltralyticsDetectorProvider_Model_name
}

// XY Input: Lora Block Weight //Inspire [InspirePack_LoraBlockWeight]
export interface XYInputLoraBlockWeightInspire extends ComfyNode<XYInputLoraBlockWeightInspire_input> {
    nameInComfy: "XY Input: Lora Block Weight //Inspire"
    XY: Slot<'XY', 0>,
    XY_1: Slot<'XY', 1>,
}
export interface XYInputLoraBlockWeightInspire_input {
    lora_name: Enum_LoraLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    strength_model?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    strength_clip?: _FLOAT
    /** default=false */
    inverse?: _BOOLEAN
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=1 min=10 max=10 step=0.01 */
    A?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    B?: _FLOAT
    preset: Enum_XYInputLoraBlockWeightInspire_Preset
    /** default="SD-NONE/SD-ALL\nSD-ALL/SD-ALL\nSD-INS/SD-ALL\nSD-IND/SD-ALL\nSD-INALL/SD-ALL\nSD-MIDD/SD-ALL\nSD-MIDD0.2/SD-ALL\nSD-MIDD0.8/SD-ALL\nSD-MOUT/SD-ALL\nSD-OUTD/SD-ALL\nSD-OUTS/SD-ALL\nSD-OUTALL/SD-ALL" */
    block_vectors?: _STRING
    heatmap_palette: Enum_XYInputLoraBlockWeightInspire_Heatmap_palette
    /** default=0.8 min=1 max=1 step=0.01 */
    heatmap_alpha?: _FLOAT
    /** default=1.5 min=10 max=10 step=0.01 */
    heatmap_strength?: _FLOAT
    xyplot_mode: Enum_XYInputLoraBlockWeightInspire_Xyplot_mode
}

// LoraLoaderBlockWeight //Inspire [InspirePack_LoraBlockWeight]
export interface LoraLoaderBlockWeightInspire extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_STRING, ComfyNode<LoraLoaderBlockWeightInspire_input> {
    nameInComfy: "LoraLoaderBlockWeight //Inspire"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    STRING: Slot<'STRING', 2>,
}
export interface LoraLoaderBlockWeightInspire_input {
    model: _MODEL
    clip: _CLIP
    lora_name: Enum_LoraLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    strength_model?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    strength_clip?: _FLOAT
    /** default=false */
    inverse?: _BOOLEAN
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=4 min=10 max=10 step=0.01 */
    A?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    B?: _FLOAT
    preset: Enum_XYInputLoraBlockWeightInspire_Preset
    /** default="1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1" */
    block_vector?: _STRING
}

// LoraBlockInfo //Inspire [InspirePack_LoraBlockWeight]
export interface LoraBlockInfoInspire extends ComfyNode<LoraBlockInfoInspire_input> {
    nameInComfy: "LoraBlockInfo //Inspire"
}
export interface LoraBlockInfoInspire_input {
    model: _MODEL
    clip: _CLIP
    lora_name: Enum_LoraLoader_Lora_name
    /** */
    block_info: _STRING
}

// OpenPose_Preprocessor_Provider_for_SEGS //Inspire [InspirePack_SEGS_ControlNet]
export interface OpenPose_Preprocessor_Provider_for_SEGSInspire extends HasSingle_SEGS_PREPROCESSOR, ComfyNode<OpenPose_Preprocessor_Provider_for_SEGSInspire_input> {
    nameInComfy: "OpenPose_Preprocessor_Provider_for_SEGS //Inspire"
    SEGS_PREPROCESSOR: Slot<'SEGS_PREPROCESSOR', 0>,
}
export interface OpenPose_Preprocessor_Provider_for_SEGSInspire_input {
    /** default=true */
    detect_hand?: _BOOLEAN
    /** default=true */
    detect_body?: _BOOLEAN
    /** default=true */
    detect_face?: _BOOLEAN
}

// DWPreprocessor_Provider_for_SEGS //Inspire [InspirePack_SEGS_ControlNet]
export interface DWPreprocessor_Provider_for_SEGSInspire extends HasSingle_SEGS_PREPROCESSOR, ComfyNode<DWPreprocessor_Provider_for_SEGSInspire_input> {
    nameInComfy: "DWPreprocessor_Provider_for_SEGS //Inspire"
    SEGS_PREPROCESSOR: Slot<'SEGS_PREPROCESSOR', 0>,
}
export interface DWPreprocessor_Provider_for_SEGSInspire_input {
    /** default=true */
    detect_hand?: _BOOLEAN
    /** default=true */
    detect_body?: _BOOLEAN
    /** default=true */
    detect_face?: _BOOLEAN
}

// MiDaS_DepthMap_Preprocessor_Provider_for_SEGS //Inspire [InspirePack_SEGS_ControlNet]
export interface MiDaS_DepthMap_Preprocessor_Provider_for_SEGSInspire extends HasSingle_SEGS_PREPROCESSOR, ComfyNode<MiDaS_DepthMap_Preprocessor_Provider_for_SEGSInspire_input> {
    nameInComfy: "MiDaS_DepthMap_Preprocessor_Provider_for_SEGS //Inspire"
    SEGS_PREPROCESSOR: Slot<'SEGS_PREPROCESSOR', 0>,
}
export interface MiDaS_DepthMap_Preprocessor_Provider_for_SEGSInspire_input {
    /** default=6.283185307179586 min=15.707963267948966 max=15.707963267948966 step=0.05 */
    a?: _FLOAT
    /** default=0.1 min=1 max=1 step=0.05 */
    bg_threshold?: _FLOAT
}

// LeRes_DepthMap_Preprocessor_Provider_for_SEGS //Inspire [InspirePack_SEGS_ControlNet]
export interface LeRes_DepthMap_Preprocessor_Provider_for_SEGSInspire extends HasSingle_SEGS_PREPROCESSOR, ComfyNode<LeRes_DepthMap_Preprocessor_Provider_for_SEGSInspire_input> {
    nameInComfy: "LeRes_DepthMap_Preprocessor_Provider_for_SEGS //Inspire"
    SEGS_PREPROCESSOR: Slot<'SEGS_PREPROCESSOR', 0>,
}
export interface LeRes_DepthMap_Preprocessor_Provider_for_SEGSInspire_input {
    /** default=0 min=100 max=100 step=0.1 */
    rm_nearest?: _FLOAT
    /** default=0 min=100 max=100 step=0.1 */
    rm_background?: _FLOAT
    /** default=false */
    boost?: _BOOLEAN
}

// Canny_Preprocessor_Provider_for_SEGS //Inspire [InspirePack_SEGS_ControlNet]
export interface Canny_Preprocessor_Provider_for_SEGSInspire extends HasSingle_SEGS_PREPROCESSOR, ComfyNode<Canny_Preprocessor_Provider_for_SEGSInspire_input> {
    nameInComfy: "Canny_Preprocessor_Provider_for_SEGS //Inspire"
    SEGS_PREPROCESSOR: Slot<'SEGS_PREPROCESSOR', 0>,
}
export interface Canny_Preprocessor_Provider_for_SEGSInspire_input {
    /** default=0.4 min=0.99 max=0.99 step=0.01 */
    low_threshold?: _FLOAT
    /** default=0.8 min=0.99 max=0.99 step=0.01 */
    high_threshold?: _FLOAT
}

// MediaPipe_FaceMesh_Preprocessor_Provider_for_SEGS //Inspire [InspirePack_SEGS_ControlNet]
export interface MediaPipe_FaceMesh_Preprocessor_Provider_for_SEGSInspire extends HasSingle_SEGS_PREPROCESSOR, ComfyNode<MediaPipe_FaceMesh_Preprocessor_Provider_for_SEGSInspire_input> {
    nameInComfy: "MediaPipe_FaceMesh_Preprocessor_Provider_for_SEGS //Inspire"
    SEGS_PREPROCESSOR: Slot<'SEGS_PREPROCESSOR', 0>,
}
export interface MediaPipe_FaceMesh_Preprocessor_Provider_for_SEGSInspire_input {
    /** default=10 min=50 max=50 step=1 */
    max_faces?: _INT
    /** default=0.5 min=1 max=1 step=0.01 */
    min_confidence?: _FLOAT
}

// MediaPipeFaceMeshDetectorProvider //Inspire [InspirePack_Detector]
export interface MediaPipeFaceMeshDetectorProviderInspire extends HasSingle_BBOX_DETECTOR, HasSingle_SEGM_DETECTOR, ComfyNode<MediaPipeFaceMeshDetectorProviderInspire_input> {
    nameInComfy: "MediaPipeFaceMeshDetectorProvider //Inspire"
    BBOX_DETECTOR: Slot<'BBOX_DETECTOR', 0>,
    SEGM_DETECTOR: Slot<'SEGM_DETECTOR', 1>,
}
export interface MediaPipeFaceMeshDetectorProviderInspire_input {
    /** default=10 min=50 max=50 step=1 */
    max_faces?: _INT
    /** default=true */
    face?: _BOOLEAN
    /** default=false */
    mouth?: _BOOLEAN
    /** default=false */
    left_eyebrow?: _BOOLEAN
    /** default=false */
    left_eye?: _BOOLEAN
    /** default=false */
    left_pupil?: _BOOLEAN
    /** default=false */
    right_eyebrow?: _BOOLEAN
    /** default=false */
    right_eye?: _BOOLEAN
    /** default=false */
    right_pupil?: _BOOLEAN
}

// HEDPreprocessor_Provider_for_SEGS //Inspire [InspirePack_SEGS_ControlNet]
export interface HEDPreprocessor_Provider_for_SEGSInspire extends HasSingle_SEGS_PREPROCESSOR, ComfyNode<HEDPreprocessor_Provider_for_SEGSInspire_input> {
    nameInComfy: "HEDPreprocessor_Provider_for_SEGS //Inspire"
    SEGS_PREPROCESSOR: Slot<'SEGS_PREPROCESSOR', 0>,
}
export interface HEDPreprocessor_Provider_for_SEGSInspire_input {
    /** default=true */
    safe?: _BOOLEAN
}

// FakeScribblePreprocessor_Provider_for_SEGS //Inspire [InspirePack_SEGS_ControlNet]
export interface FakeScribblePreprocessor_Provider_for_SEGSInspire extends HasSingle_SEGS_PREPROCESSOR, ComfyNode<FakeScribblePreprocessor_Provider_for_SEGSInspire_input> {
    nameInComfy: "FakeScribblePreprocessor_Provider_for_SEGS //Inspire"
    SEGS_PREPROCESSOR: Slot<'SEGS_PREPROCESSOR', 0>,
}
export interface FakeScribblePreprocessor_Provider_for_SEGSInspire_input {
    /** default=true */
    safe?: _BOOLEAN
}

// KSampler //Inspire [InspirePack_a1111_compat]
export interface KSamplerInspire extends HasSingle_LATENT, ComfyNode<KSamplerInspire_input> {
    nameInComfy: "KSampler //Inspire"
    LATENT: Slot<'LATENT', 0>,
}
export interface KSamplerInspire_input {
    model: _MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    noise_mode: Enum_KSamplerInspire_Noise_mode
}

// LoadPromptsFromDir //Inspire [InspirePack_prompt]
export interface LoadPromptsFromDirInspire extends HasSingle_ZIPPED_PROMPT, ComfyNode<LoadPromptsFromDirInspire_input> {
    nameInComfy: "LoadPromptsFromDir //Inspire"
    ZIPPED_PROMPT: Slot<'ZIPPED_PROMPT', 0>,
}
export interface LoadPromptsFromDirInspire_input {
    prompt_dir: Enum_LoadPromptsFromDirInspire_Prompt_dir
}

// UnzipPrompt //Inspire [InspirePack_prompt]
export interface UnzipPromptInspire extends ComfyNode<UnzipPromptInspire_input> {
    nameInComfy: "UnzipPrompt //Inspire"
    STRING: Slot<'STRING', 0>,
    STRING_1: Slot<'STRING', 1>,
    STRING_2: Slot<'STRING', 2>,
}
export interface UnzipPromptInspire_input {
    zipped_prompt: _ZIPPED_PROMPT
}

// ZipPrompt //Inspire [InspirePack_prompt]
export interface ZipPromptInspire extends HasSingle_ZIPPED_PROMPT, ComfyNode<ZipPromptInspire_input> {
    nameInComfy: "ZipPrompt //Inspire"
    ZIPPED_PROMPT: Slot<'ZIPPED_PROMPT', 0>,
}
export interface ZipPromptInspire_input {
    /** */
    positive: _STRING
    /** */
    negative: _STRING
    /** */
    name_opt?: _STRING
}

// PromptExtractor //Inspire [InspirePack_prompt]
export interface PromptExtractorInspire extends ComfyNode<PromptExtractorInspire_input> {
    nameInComfy: "PromptExtractor //Inspire"
    STRING: Slot<'STRING', 0>,
    STRING_1: Slot<'STRING', 1>,
}
export interface PromptExtractorInspire_input {
    /** */
    image: Enum_LoadImage_Image
    /** */
    positive_id: _STRING
    /** */
    negative_id: _STRING
    /** */
    info: _STRING
}

// GlobalSeed //Inspire [InspirePack]
export interface GlobalSeedInspire extends ComfyNode<GlobalSeedInspire_input> {
    nameInComfy: "GlobalSeed //Inspire"
}
export interface GlobalSeedInspire_input {
    /** default=0 min=1125899906842624 max=1125899906842624 */
    value?: _INT
    /** default=true */
    mode?: _BOOLEAN
    action: Enum_GlobalSeedInspire_Action
}

// BNK_TiledKSamplerAdvanced [sampling]
export interface BNK_TiledKSamplerAdvanced extends HasSingle_LATENT, ComfyNode<BNK_TiledKSamplerAdvanced_input> {
    nameInComfy: "BNK_TiledKSamplerAdvanced"
    LATENT: Slot<'LATENT', 0>,
}
export interface BNK_TiledKSamplerAdvanced_input {
    model: _MODEL
    add_noise: Enum_KSamplerAdvanced_Add_noise
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    noise_seed?: _INT
    /** default=512 min=8192 max=8192 step=64 */
    tile_width?: _INT
    /** default=512 min=8192 max=8192 step=64 */
    tile_height?: _INT
    tiling_strategy: Enum_BNK_TiledKSamplerAdvanced_Tiling_strategy
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
    /** default=0 min=10000 max=10000 */
    start_at_step?: _INT
    /** default=10000 min=10000 max=10000 */
    end_at_step?: _INT
    return_with_leftover_noise: Enum_KSamplerAdvanced_Add_noise
    preview: Enum_KSamplerAdvanced_Add_noise
}

// BNK_TiledKSampler [sampling]
export interface BNK_TiledKSampler extends HasSingle_LATENT, ComfyNode<BNK_TiledKSampler_input> {
    nameInComfy: "BNK_TiledKSampler"
    LATENT: Slot<'LATENT', 0>,
}
export interface BNK_TiledKSampler_input {
    model: _MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=512 min=8192 max=8192 step=64 */
    tile_width?: _INT
    /** default=512 min=8192 max=8192 step=64 */
    tile_height?: _INT
    tiling_strategy: Enum_BNK_TiledKSamplerAdvanced_Tiling_strategy
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
}

// KSampler (Efficient) [Efficiency Nodes_Sampling]
export interface KSamplerEfficient extends HasSingle_MODEL, HasSingle_LATENT, HasSingle_VAE, HasSingle_IMAGE, ComfyNode<KSamplerEfficient_input> {
    nameInComfy: "KSampler (Efficient)"
    MODEL: Slot<'MODEL', 0>,
    CONDITIONING: Slot<'CONDITIONING', 1>,
    CONDITIONING_1: Slot<'CONDITIONING', 2>,
    LATENT: Slot<'LATENT', 3>,
    VAE: Slot<'VAE', 4>,
    IMAGE: Slot<'IMAGE', 5>,
}
export interface KSamplerEfficient_input {
    sampler_state: Enum_KSamplerEfficient_Sampler_state
    model: _MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=7 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    preview_method: Enum_KSamplerEfficient_Preview_method
    vae_decode: Enum_KSamplerEfficient_Vae_decode
    optional_vae?: _VAE
    script?: _SCRIPT
}

// KSampler Adv. (Efficient) [Efficiency Nodes_Sampling]
export interface KSamplerAdvEfficient extends HasSingle_MODEL, HasSingle_LATENT, HasSingle_VAE, HasSingle_IMAGE, ComfyNode<KSamplerAdvEfficient_input> {
    nameInComfy: "KSampler Adv. (Efficient)"
    MODEL: Slot<'MODEL', 0>,
    CONDITIONING: Slot<'CONDITIONING', 1>,
    CONDITIONING_1: Slot<'CONDITIONING', 2>,
    LATENT: Slot<'LATENT', 3>,
    VAE: Slot<'VAE', 4>,
    IMAGE: Slot<'IMAGE', 5>,
}
export interface KSamplerAdvEfficient_input {
    sampler_state: Enum_KSamplerEfficient_Sampler_state
    model: _MODEL
    add_noise: Enum_KSamplerAdvanced_Add_noise
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    noise_seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=7 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
    /** default=0 min=10000 max=10000 */
    start_at_step?: _INT
    /** default=10000 min=10000 max=10000 */
    end_at_step?: _INT
    return_with_leftover_noise: Enum_KSamplerAdvanced_Add_noise
    preview_method: Enum_KSamplerEfficient_Preview_method
    vae_decode: Enum_KSamplerEfficient_Vae_decode
    optional_vae?: _VAE
    script?: _SCRIPT
}

// KSampler SDXL (Eff.) [Efficiency Nodes_Sampling]
export interface KSamplerSDXLEff extends HasSingle_SDXL_TUPLE, HasSingle_LATENT, HasSingle_VAE, HasSingle_IMAGE, ComfyNode<KSamplerSDXLEff_input> {
    nameInComfy: "KSampler SDXL (Eff.)"
    SDXL_TUPLE: Slot<'SDXL_TUPLE', 0>,
    LATENT: Slot<'LATENT', 1>,
    VAE: Slot<'VAE', 2>,
    IMAGE: Slot<'IMAGE', 3>,
}
export interface KSamplerSDXLEff_input {
    sampler_state: Enum_KSamplerEfficient_Sampler_state
    sdxl_tuple: _SDXL_TUPLE
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    noise_seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=7 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    latent_image: _LATENT
    /** default=0 min=10000 max=10000 */
    start_at_step?: _INT
    /** default=-1 min=10000 max=10000 */
    refine_at_step?: _INT
    preview_method: Enum_KSamplerEfficient_Preview_method
    vae_decode: Enum_KSamplerEfficient_Vae_decode
    optional_vae?: _VAE
    script?: _SCRIPT
}

// Efficient Loader [Efficiency Nodes_Loaders]
export interface EfficientLoader extends HasSingle_MODEL, HasSingle_LATENT, HasSingle_VAE, HasSingle_CLIP, HasSingle_DEPENDENCIES, ComfyNode<EfficientLoader_input> {
    nameInComfy: "Efficient Loader"
    MODEL: Slot<'MODEL', 0>,
    CONDITIONING: Slot<'CONDITIONING', 1>,
    CONDITIONING_1: Slot<'CONDITIONING', 2>,
    LATENT: Slot<'LATENT', 3>,
    VAE: Slot<'VAE', 4>,
    CLIP: Slot<'CLIP', 5>,
    DEPENDENCIES: Slot<'DEPENDENCIES', 6>,
}
export interface EfficientLoader_input {
    ckpt_name: Enum_CheckpointLoaderSimple_Ckpt_name
    vae_name: Enum_EfficientLoader_Vae_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip?: _INT
    lora_name: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_model_strength?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    lora_clip_strength?: _FLOAT
    /** default="Positive" */
    positive?: _STRING
    /** default="Negative" */
    negative?: _STRING
    /** default=512 min=8192 max=8192 step=64 */
    empty_latent_width?: _INT
    /** default=512 min=8192 max=8192 step=64 */
    empty_latent_height?: _INT
    /** default=1 min=64 max=64 */
    batch_size?: _INT
    lora_stack?: _LORA_STACK
    cnet_stack?: _CONTROL_NET_STACK
}

// Eff. Loader SDXL [Efficiency Nodes_Loaders]
export interface EffLoaderSDXL extends HasSingle_SDXL_TUPLE, HasSingle_LATENT, HasSingle_VAE, HasSingle_DEPENDENCIES, ComfyNode<EffLoaderSDXL_input> {
    nameInComfy: "Eff. Loader SDXL"
    SDXL_TUPLE: Slot<'SDXL_TUPLE', 0>,
    LATENT: Slot<'LATENT', 1>,
    VAE: Slot<'VAE', 2>,
    DEPENDENCIES: Slot<'DEPENDENCIES', 3>,
}
export interface EffLoaderSDXL_input {
    base_ckpt_name: Enum_CheckpointLoaderSimple_Ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    base_clip_skip?: _INT
    refiner_ckpt_name: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    refiner_clip_skip?: _INT
    /** default=6 min=1000 max=1000 step=0.01 */
    positive_ascore?: _FLOAT
    /** default=2 min=1000 max=1000 step=0.01 */
    negative_ascore?: _FLOAT
    vae_name: Enum_EfficientLoader_Vae_name
    /** default="Positive" */
    positive?: _STRING
    /** default="Negative" */
    negative?: _STRING
    /** default=1024 min=8192 max=8192 step=128 */
    empty_latent_width?: _INT
    /** default=1024 min=8192 max=8192 step=128 */
    empty_latent_height?: _INT
    /** default=1 min=64 max=64 */
    batch_size?: _INT
    lora_stack?: _LORA_STACK
    cnet_stack?: _CONTROL_NET_STACK
}

// LoRA Stacker [Efficiency Nodes_Stackers]
export interface LoRAStacker extends HasSingle_LORA_STACK, ComfyNode<LoRAStacker_input> {
    nameInComfy: "LoRA Stacker"
    LORA_STACK: Slot<'LORA_STACK', 0>,
}
export interface LoRAStacker_input {
    input_mode: Enum_LoRAStacker_Input_mode
    /** default=3 min=50 max=50 step=1 */
    lora_count?: _INT
    lora_name_1: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_1?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_1?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_1?: _FLOAT
    lora_name_2: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_2?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_2?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_2?: _FLOAT
    lora_name_3: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_3?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_3?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_3?: _FLOAT
    lora_name_4: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_4?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_4?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_4?: _FLOAT
    lora_name_5: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_5?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_5?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_5?: _FLOAT
    lora_name_6: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_6?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_6?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_6?: _FLOAT
    lora_name_7: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_7?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_7?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_7?: _FLOAT
    lora_name_8: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_8?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_8?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_8?: _FLOAT
    lora_name_9: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_9?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_9?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_9?: _FLOAT
    lora_name_10: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_10?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_10?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_10?: _FLOAT
    lora_name_11: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_11?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_11?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_11?: _FLOAT
    lora_name_12: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_12?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_12?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_12?: _FLOAT
    lora_name_13: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_13?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_13?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_13?: _FLOAT
    lora_name_14: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_14?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_14?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_14?: _FLOAT
    lora_name_15: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_15?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_15?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_15?: _FLOAT
    lora_name_16: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_16?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_16?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_16?: _FLOAT
    lora_name_17: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_17?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_17?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_17?: _FLOAT
    lora_name_18: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_18?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_18?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_18?: _FLOAT
    lora_name_19: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_19?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_19?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_19?: _FLOAT
    lora_name_20: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_20?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_20?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_20?: _FLOAT
    lora_name_21: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_21?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_21?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_21?: _FLOAT
    lora_name_22: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_22?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_22?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_22?: _FLOAT
    lora_name_23: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_23?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_23?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_23?: _FLOAT
    lora_name_24: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_24?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_24?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_24?: _FLOAT
    lora_name_25: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_25?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_25?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_25?: _FLOAT
    lora_name_26: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_26?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_26?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_26?: _FLOAT
    lora_name_27: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_27?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_27?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_27?: _FLOAT
    lora_name_28: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_28?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_28?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_28?: _FLOAT
    lora_name_29: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_29?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_29?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_29?: _FLOAT
    lora_name_30: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_30?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_30?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_30?: _FLOAT
    lora_name_31: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_31?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_31?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_31?: _FLOAT
    lora_name_32: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_32?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_32?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_32?: _FLOAT
    lora_name_33: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_33?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_33?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_33?: _FLOAT
    lora_name_34: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_34?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_34?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_34?: _FLOAT
    lora_name_35: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_35?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_35?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_35?: _FLOAT
    lora_name_36: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_36?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_36?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_36?: _FLOAT
    lora_name_37: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_37?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_37?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_37?: _FLOAT
    lora_name_38: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_38?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_38?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_38?: _FLOAT
    lora_name_39: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_39?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_39?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_39?: _FLOAT
    lora_name_40: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_40?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_40?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_40?: _FLOAT
    lora_name_41: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_41?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_41?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_41?: _FLOAT
    lora_name_42: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_42?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_42?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_42?: _FLOAT
    lora_name_43: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_43?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_43?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_43?: _FLOAT
    lora_name_44: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_44?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_44?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_44?: _FLOAT
    lora_name_45: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_45?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_45?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_45?: _FLOAT
    lora_name_46: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_46?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_46?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_46?: _FLOAT
    lora_name_47: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_47?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_47?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_47?: _FLOAT
    lora_name_48: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_48?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_48?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_48?: _FLOAT
    lora_name_49: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_wt_49?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    model_str_49?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_49?: _FLOAT
    lora_stack?: _LORA_STACK
}

// Control Net Stacker [Efficiency Nodes_Stackers]
export interface ControlNetStacker extends HasSingle_CONTROL_NET_STACK, ComfyNode<ControlNetStacker_input> {
    nameInComfy: "Control Net Stacker"
    CONTROL_NET_STACK: Slot<'CONTROL_NET_STACK', 0>,
}
export interface ControlNetStacker_input {
    control_net: _CONTROL_NET
    image: _IMAGE
    /** default=1 min=10 max=10 step=0.01 */
    strength?: _FLOAT
    /** default=0 min=1 max=1 step=0.001 */
    start_percent?: _FLOAT
    /** default=1 min=1 max=1 step=0.001 */
    end_percent?: _FLOAT
    cnet_stack?: _CONTROL_NET_STACK
}

// Apply ControlNet Stack [Efficiency Nodes_Stackers]
export interface ApplyControlNetStack extends ComfyNode<ApplyControlNetStack_input> {
    nameInComfy: "Apply ControlNet Stack"
    CONDITIONING: Slot<'CONDITIONING', 0>,
    CONDITIONING_1: Slot<'CONDITIONING', 1>,
}
export interface ApplyControlNetStack_input {
    positive: _CONDITIONING
    negative: _CONDITIONING
    cnet_stack: _CONTROL_NET_STACK
}

// Unpack SDXL Tuple [Efficiency Nodes_Misc]
export interface UnpackSDXLTuple extends ComfyNode<UnpackSDXLTuple_input> {
    nameInComfy: "Unpack SDXL Tuple"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    CONDITIONING: Slot<'CONDITIONING', 2>,
    CONDITIONING_1: Slot<'CONDITIONING', 3>,
    MODEL_1: Slot<'MODEL', 4>,
    CLIP_1: Slot<'CLIP', 5>,
    CONDITIONING_2: Slot<'CONDITIONING', 6>,
    CONDITIONING_3: Slot<'CONDITIONING', 7>,
}
export interface UnpackSDXLTuple_input {
    sdxl_tuple: _SDXL_TUPLE
}

// Pack SDXL Tuple [Efficiency Nodes_Misc]
export interface PackSDXLTuple extends HasSingle_SDXL_TUPLE, ComfyNode<PackSDXLTuple_input> {
    nameInComfy: "Pack SDXL Tuple"
    SDXL_TUPLE: Slot<'SDXL_TUPLE', 0>,
}
export interface PackSDXLTuple_input {
    base_model: _MODEL
    base_clip: _CLIP
    base_positive: _CONDITIONING
    base_negative: _CONDITIONING
    refiner_model: _MODEL
    refiner_clip: _CLIP
    refiner_positive: _CONDITIONING
    refiner_negative: _CONDITIONING
}

// XY Plot [Efficiency Nodes_Scripts]
export interface XYPlot extends HasSingle_SCRIPT, ComfyNode<XYPlot_input> {
    nameInComfy: "XY Plot"
    SCRIPT: Slot<'SCRIPT', 0>,
}
export interface XYPlot_input {
    /** default=0 min=500 max=500 step=5 */
    grid_spacing?: _INT
    XY_flip: Enum_XYPlot_XY_flip
    Y_label_orientation: Enum_XYPlot_Y_label_orientation
    cache_models: Enum_XYPlot_XY_flip
    ksampler_output_image: Enum_XYPlot_Ksampler_output_image
    dependencies?: _DEPENDENCIES
    X?: _XY
    Y?: _XY
}

// XY Input: Seeds++ Batch [Efficiency Nodes_XY Inputs]
export interface XYInputSeedsBatch extends HasSingle_XY, ComfyNode<XYInputSeedsBatch_input> {
    nameInComfy: "XY Input: Seeds++ Batch"
    XY: Slot<'XY', 0>,
}
export interface XYInputSeedsBatch_input {
    /** default=3 min=50 max=50 */
    batch_count?: _INT
}

// XY Input: Add/Return Noise [Efficiency Nodes_XY Inputs]
export interface XYInputAddReturnNoise extends HasSingle_XY, ComfyNode<XYInputAddReturnNoise_input> {
    nameInComfy: "XY Input: Add/Return Noise"
    XY: Slot<'XY', 0>,
}
export interface XYInputAddReturnNoise_input {
    XY_type: Enum_XYInputAddReturnNoise_XY_type
}

// XY Input: Steps [Efficiency Nodes_XY Inputs]
export interface XYInputSteps extends HasSingle_XY, ComfyNode<XYInputSteps_input> {
    nameInComfy: "XY Input: Steps"
    XY: Slot<'XY', 0>,
}
export interface XYInputSteps_input {
    target_parameter: Enum_XYInputSteps_Target_parameter
    /** default=3 min=50 max=50 */
    batch_count?: _INT
    /** default=10 min=10000 max=10000 */
    first_step?: _INT
    /** default=20 min=10000 max=10000 */
    last_step?: _INT
    /** default=0 min=10000 max=10000 */
    first_start_step?: _INT
    /** default=10 min=10000 max=10000 */
    last_start_step?: _INT
    /** default=10 min=10000 max=10000 */
    first_end_step?: _INT
    /** default=20 min=10000 max=10000 */
    last_end_step?: _INT
    /** default=10 min=10000 max=10000 */
    first_refine_step?: _INT
    /** default=20 min=10000 max=10000 */
    last_refine_step?: _INT
}

// XY Input: CFG Scale [Efficiency Nodes_XY Inputs]
export interface XYInputCFGScale extends HasSingle_XY, ComfyNode<XYInputCFGScale_input> {
    nameInComfy: "XY Input: CFG Scale"
    XY: Slot<'XY', 0>,
}
export interface XYInputCFGScale_input {
    /** default=3 min=50 max=50 */
    batch_count?: _INT
    /** default=7 min=100 max=100 */
    first_cfg?: _FLOAT
    /** default=9 min=100 max=100 */
    last_cfg?: _FLOAT
}

// XY Input: Sampler/Scheduler [Efficiency Nodes_XY Inputs]
export interface XYInputSamplerScheduler extends HasSingle_XY, ComfyNode<XYInputSamplerScheduler_input> {
    nameInComfy: "XY Input: Sampler/Scheduler"
    XY: Slot<'XY', 0>,
}
export interface XYInputSamplerScheduler_input {
    target_parameter: Enum_XYInputSamplerScheduler_Target_parameter
    /** default=3 min=50 max=50 step=1 */
    input_count?: _INT
    sampler_1: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_1: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_2: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_2: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_3: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_3: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_4: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_4: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_5: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_5: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_6: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_6: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_7: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_7: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_8: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_8: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_9: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_9: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_10: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_10: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_11: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_11: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_12: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_12: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_13: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_13: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_14: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_14: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_15: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_15: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_16: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_16: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_17: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_17: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_18: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_18: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_19: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_19: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_20: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_20: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_21: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_21: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_22: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_22: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_23: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_23: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_24: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_24: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_25: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_25: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_26: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_26: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_27: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_27: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_28: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_28: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_29: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_29: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_30: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_30: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_31: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_31: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_32: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_32: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_33: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_33: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_34: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_34: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_35: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_35: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_36: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_36: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_37: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_37: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_38: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_38: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_39: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_39: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_40: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_40: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_41: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_41: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_42: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_42: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_43: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_43: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_44: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_44: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_45: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_45: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_46: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_46: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_47: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_47: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_48: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_48: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_49: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_49: Enum_XYInputSamplerScheduler_Scheduler_1
    sampler_50: Enum_XYInputSamplerScheduler_Sampler_1
    scheduler_50: Enum_XYInputSamplerScheduler_Scheduler_1
}

// XY Input: Denoise [Efficiency Nodes_XY Inputs]
export interface XYInputDenoise extends HasSingle_XY, ComfyNode<XYInputDenoise_input> {
    nameInComfy: "XY Input: Denoise"
    XY: Slot<'XY', 0>,
}
export interface XYInputDenoise_input {
    /** default=3 min=50 max=50 */
    batch_count?: _INT
    /** default=0 min=1 max=1 step=0.01 */
    first_denoise?: _FLOAT
    /** default=1 min=1 max=1 step=0.01 */
    last_denoise?: _FLOAT
}

// XY Input: VAE [Efficiency Nodes_XY Inputs]
export interface XYInputVAE extends HasSingle_XY, ComfyNode<XYInputVAE_input> {
    nameInComfy: "XY Input: VAE"
    XY: Slot<'XY', 0>,
}
export interface XYInputVAE_input {
    input_mode: Enum_XYInputVAE_Input_mode
    /** default="C:\\example_folder" */
    batch_path?: _STRING
    /** default=false */
    subdirectories?: _BOOLEAN
    batch_sort: Enum_XYInputVAE_Batch_sort
    /** default=-1 min=50 max=50 step=1 */
    batch_max?: _INT
    /** default=3 min=50 max=50 step=1 */
    vae_count?: _INT
    vae_name_1: Enum_XYInputVAE_Vae_name_1
    vae_name_2: Enum_XYInputVAE_Vae_name_1
    vae_name_3: Enum_XYInputVAE_Vae_name_1
    vae_name_4: Enum_XYInputVAE_Vae_name_1
    vae_name_5: Enum_XYInputVAE_Vae_name_1
    vae_name_6: Enum_XYInputVAE_Vae_name_1
    vae_name_7: Enum_XYInputVAE_Vae_name_1
    vae_name_8: Enum_XYInputVAE_Vae_name_1
    vae_name_9: Enum_XYInputVAE_Vae_name_1
    vae_name_10: Enum_XYInputVAE_Vae_name_1
    vae_name_11: Enum_XYInputVAE_Vae_name_1
    vae_name_12: Enum_XYInputVAE_Vae_name_1
    vae_name_13: Enum_XYInputVAE_Vae_name_1
    vae_name_14: Enum_XYInputVAE_Vae_name_1
    vae_name_15: Enum_XYInputVAE_Vae_name_1
    vae_name_16: Enum_XYInputVAE_Vae_name_1
    vae_name_17: Enum_XYInputVAE_Vae_name_1
    vae_name_18: Enum_XYInputVAE_Vae_name_1
    vae_name_19: Enum_XYInputVAE_Vae_name_1
    vae_name_20: Enum_XYInputVAE_Vae_name_1
    vae_name_21: Enum_XYInputVAE_Vae_name_1
    vae_name_22: Enum_XYInputVAE_Vae_name_1
    vae_name_23: Enum_XYInputVAE_Vae_name_1
    vae_name_24: Enum_XYInputVAE_Vae_name_1
    vae_name_25: Enum_XYInputVAE_Vae_name_1
    vae_name_26: Enum_XYInputVAE_Vae_name_1
    vae_name_27: Enum_XYInputVAE_Vae_name_1
    vae_name_28: Enum_XYInputVAE_Vae_name_1
    vae_name_29: Enum_XYInputVAE_Vae_name_1
    vae_name_30: Enum_XYInputVAE_Vae_name_1
    vae_name_31: Enum_XYInputVAE_Vae_name_1
    vae_name_32: Enum_XYInputVAE_Vae_name_1
    vae_name_33: Enum_XYInputVAE_Vae_name_1
    vae_name_34: Enum_XYInputVAE_Vae_name_1
    vae_name_35: Enum_XYInputVAE_Vae_name_1
    vae_name_36: Enum_XYInputVAE_Vae_name_1
    vae_name_37: Enum_XYInputVAE_Vae_name_1
    vae_name_38: Enum_XYInputVAE_Vae_name_1
    vae_name_39: Enum_XYInputVAE_Vae_name_1
    vae_name_40: Enum_XYInputVAE_Vae_name_1
    vae_name_41: Enum_XYInputVAE_Vae_name_1
    vae_name_42: Enum_XYInputVAE_Vae_name_1
    vae_name_43: Enum_XYInputVAE_Vae_name_1
    vae_name_44: Enum_XYInputVAE_Vae_name_1
    vae_name_45: Enum_XYInputVAE_Vae_name_1
    vae_name_46: Enum_XYInputVAE_Vae_name_1
    vae_name_47: Enum_XYInputVAE_Vae_name_1
    vae_name_48: Enum_XYInputVAE_Vae_name_1
    vae_name_49: Enum_XYInputVAE_Vae_name_1
    vae_name_50: Enum_XYInputVAE_Vae_name_1
}

// XY Input: Prompt S/R [Efficiency Nodes_XY Inputs]
export interface XYInputPromptSR extends HasSingle_XY, ComfyNode<XYInputPromptSR_input> {
    nameInComfy: "XY Input: Prompt S/R"
    XY: Slot<'XY', 0>,
}
export interface XYInputPromptSR_input {
    target_prompt: Enum_XYInputPromptSR_Target_prompt
    /** default="" */
    search_txt?: _STRING
    /** default=3 min=49 max=49 */
    replace_count?: _INT
    /** default="" */
    replace_1?: _STRING
    /** default="" */
    replace_2?: _STRING
    /** default="" */
    replace_3?: _STRING
    /** default="" */
    replace_4?: _STRING
    /** default="" */
    replace_5?: _STRING
    /** default="" */
    replace_6?: _STRING
    /** default="" */
    replace_7?: _STRING
    /** default="" */
    replace_8?: _STRING
    /** default="" */
    replace_9?: _STRING
    /** default="" */
    replace_10?: _STRING
    /** default="" */
    replace_11?: _STRING
    /** default="" */
    replace_12?: _STRING
    /** default="" */
    replace_13?: _STRING
    /** default="" */
    replace_14?: _STRING
    /** default="" */
    replace_15?: _STRING
    /** default="" */
    replace_16?: _STRING
    /** default="" */
    replace_17?: _STRING
    /** default="" */
    replace_18?: _STRING
    /** default="" */
    replace_19?: _STRING
    /** default="" */
    replace_20?: _STRING
    /** default="" */
    replace_21?: _STRING
    /** default="" */
    replace_22?: _STRING
    /** default="" */
    replace_23?: _STRING
    /** default="" */
    replace_24?: _STRING
    /** default="" */
    replace_25?: _STRING
    /** default="" */
    replace_26?: _STRING
    /** default="" */
    replace_27?: _STRING
    /** default="" */
    replace_28?: _STRING
    /** default="" */
    replace_29?: _STRING
    /** default="" */
    replace_30?: _STRING
    /** default="" */
    replace_31?: _STRING
    /** default="" */
    replace_32?: _STRING
    /** default="" */
    replace_33?: _STRING
    /** default="" */
    replace_34?: _STRING
    /** default="" */
    replace_35?: _STRING
    /** default="" */
    replace_36?: _STRING
    /** default="" */
    replace_37?: _STRING
    /** default="" */
    replace_38?: _STRING
    /** default="" */
    replace_39?: _STRING
    /** default="" */
    replace_40?: _STRING
    /** default="" */
    replace_41?: _STRING
    /** default="" */
    replace_42?: _STRING
    /** default="" */
    replace_43?: _STRING
    /** default="" */
    replace_44?: _STRING
    /** default="" */
    replace_45?: _STRING
    /** default="" */
    replace_46?: _STRING
    /** default="" */
    replace_47?: _STRING
    /** default="" */
    replace_48?: _STRING
    /** default="" */
    replace_49?: _STRING
}

// XY Input: Aesthetic Score [Efficiency Nodes_XY Inputs]
export interface XYInputAestheticScore extends HasSingle_XY, ComfyNode<XYInputAestheticScore_input> {
    nameInComfy: "XY Input: Aesthetic Score"
    XY: Slot<'XY', 0>,
}
export interface XYInputAestheticScore_input {
    target_ascore: Enum_XYInputPromptSR_Target_prompt
    /** default=3 min=50 max=50 */
    batch_count?: _INT
    /** default=0 min=1000 max=1000 step=0.01 */
    first_ascore?: _FLOAT
    /** default=10 min=1000 max=1000 step=0.01 */
    last_ascore?: _FLOAT
}

// XY Input: Refiner On/Off [Efficiency Nodes_XY Inputs]
export interface XYInputRefinerOnOff extends HasSingle_XY, ComfyNode<XYInputRefinerOnOff_input> {
    nameInComfy: "XY Input: Refiner On/Off"
    XY: Slot<'XY', 0>,
}
export interface XYInputRefinerOnOff_input {
    /** default=0.8 min=1 max=1 step=0.01 */
    refine_at_percent?: _FLOAT
}

// XY Input: Checkpoint [Efficiency Nodes_XY Inputs]
export interface XYInputCheckpoint extends HasSingle_XY, ComfyNode<XYInputCheckpoint_input> {
    nameInComfy: "XY Input: Checkpoint"
    XY: Slot<'XY', 0>,
}
export interface XYInputCheckpoint_input {
    target_ckpt: Enum_XYInputCheckpoint_Target_ckpt
    input_mode: Enum_XYInputCheckpoint_Input_mode
    /** default="C:\\example_folder" */
    batch_path?: _STRING
    /** default=false */
    subdirectories?: _BOOLEAN
    batch_sort: Enum_XYInputVAE_Batch_sort
    /** default=-1 min=50 max=50 step=1 */
    batch_max?: _INT
    /** default=3 min=50 max=50 step=1 */
    ckpt_count?: _INT
    ckpt_name_1: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_1?: _INT
    vae_name_1: Enum_EfficientLoader_Vae_name
    ckpt_name_2: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_2?: _INT
    vae_name_2: Enum_EfficientLoader_Vae_name
    ckpt_name_3: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_3?: _INT
    vae_name_3: Enum_EfficientLoader_Vae_name
    ckpt_name_4: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_4?: _INT
    vae_name_4: Enum_EfficientLoader_Vae_name
    ckpt_name_5: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_5?: _INT
    vae_name_5: Enum_EfficientLoader_Vae_name
    ckpt_name_6: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_6?: _INT
    vae_name_6: Enum_EfficientLoader_Vae_name
    ckpt_name_7: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_7?: _INT
    vae_name_7: Enum_EfficientLoader_Vae_name
    ckpt_name_8: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_8?: _INT
    vae_name_8: Enum_EfficientLoader_Vae_name
    ckpt_name_9: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_9?: _INT
    vae_name_9: Enum_EfficientLoader_Vae_name
    ckpt_name_10: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_10?: _INT
    vae_name_10: Enum_EfficientLoader_Vae_name
    ckpt_name_11: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_11?: _INT
    vae_name_11: Enum_EfficientLoader_Vae_name
    ckpt_name_12: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_12?: _INT
    vae_name_12: Enum_EfficientLoader_Vae_name
    ckpt_name_13: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_13?: _INT
    vae_name_13: Enum_EfficientLoader_Vae_name
    ckpt_name_14: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_14?: _INT
    vae_name_14: Enum_EfficientLoader_Vae_name
    ckpt_name_15: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_15?: _INT
    vae_name_15: Enum_EfficientLoader_Vae_name
    ckpt_name_16: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_16?: _INT
    vae_name_16: Enum_EfficientLoader_Vae_name
    ckpt_name_17: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_17?: _INT
    vae_name_17: Enum_EfficientLoader_Vae_name
    ckpt_name_18: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_18?: _INT
    vae_name_18: Enum_EfficientLoader_Vae_name
    ckpt_name_19: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_19?: _INT
    vae_name_19: Enum_EfficientLoader_Vae_name
    ckpt_name_20: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_20?: _INT
    vae_name_20: Enum_EfficientLoader_Vae_name
    ckpt_name_21: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_21?: _INT
    vae_name_21: Enum_EfficientLoader_Vae_name
    ckpt_name_22: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_22?: _INT
    vae_name_22: Enum_EfficientLoader_Vae_name
    ckpt_name_23: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_23?: _INT
    vae_name_23: Enum_EfficientLoader_Vae_name
    ckpt_name_24: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_24?: _INT
    vae_name_24: Enum_EfficientLoader_Vae_name
    ckpt_name_25: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_25?: _INT
    vae_name_25: Enum_EfficientLoader_Vae_name
    ckpt_name_26: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_26?: _INT
    vae_name_26: Enum_EfficientLoader_Vae_name
    ckpt_name_27: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_27?: _INT
    vae_name_27: Enum_EfficientLoader_Vae_name
    ckpt_name_28: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_28?: _INT
    vae_name_28: Enum_EfficientLoader_Vae_name
    ckpt_name_29: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_29?: _INT
    vae_name_29: Enum_EfficientLoader_Vae_name
    ckpt_name_30: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_30?: _INT
    vae_name_30: Enum_EfficientLoader_Vae_name
    ckpt_name_31: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_31?: _INT
    vae_name_31: Enum_EfficientLoader_Vae_name
    ckpt_name_32: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_32?: _INT
    vae_name_32: Enum_EfficientLoader_Vae_name
    ckpt_name_33: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_33?: _INT
    vae_name_33: Enum_EfficientLoader_Vae_name
    ckpt_name_34: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_34?: _INT
    vae_name_34: Enum_EfficientLoader_Vae_name
    ckpt_name_35: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_35?: _INT
    vae_name_35: Enum_EfficientLoader_Vae_name
    ckpt_name_36: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_36?: _INT
    vae_name_36: Enum_EfficientLoader_Vae_name
    ckpt_name_37: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_37?: _INT
    vae_name_37: Enum_EfficientLoader_Vae_name
    ckpt_name_38: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_38?: _INT
    vae_name_38: Enum_EfficientLoader_Vae_name
    ckpt_name_39: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_39?: _INT
    vae_name_39: Enum_EfficientLoader_Vae_name
    ckpt_name_40: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_40?: _INT
    vae_name_40: Enum_EfficientLoader_Vae_name
    ckpt_name_41: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_41?: _INT
    vae_name_41: Enum_EfficientLoader_Vae_name
    ckpt_name_42: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_42?: _INT
    vae_name_42: Enum_EfficientLoader_Vae_name
    ckpt_name_43: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_43?: _INT
    vae_name_43: Enum_EfficientLoader_Vae_name
    ckpt_name_44: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_44?: _INT
    vae_name_44: Enum_EfficientLoader_Vae_name
    ckpt_name_45: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_45?: _INT
    vae_name_45: Enum_EfficientLoader_Vae_name
    ckpt_name_46: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_46?: _INT
    vae_name_46: Enum_EfficientLoader_Vae_name
    ckpt_name_47: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_47?: _INT
    vae_name_47: Enum_EfficientLoader_Vae_name
    ckpt_name_48: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_48?: _INT
    vae_name_48: Enum_EfficientLoader_Vae_name
    ckpt_name_49: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_49?: _INT
    vae_name_49: Enum_EfficientLoader_Vae_name
    ckpt_name_50: Enum_EffLoaderSDXL_Refiner_ckpt_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip_50?: _INT
    vae_name_50: Enum_EfficientLoader_Vae_name
}

// XY Input: Clip Skip [Efficiency Nodes_XY Inputs]
export interface XYInputClipSkip extends HasSingle_XY, ComfyNode<XYInputClipSkip_input> {
    nameInComfy: "XY Input: Clip Skip"
    XY: Slot<'XY', 0>,
}
export interface XYInputClipSkip_input {
    target_ckpt: Enum_XYInputCheckpoint_Target_ckpt
    /** default=3 min=50 max=50 */
    batch_count?: _INT
    /** default=-1 min=-1 max=-1 step=1 */
    first_clip_skip?: _INT
    /** default=-3 min=-1 max=-1 step=1 */
    last_clip_skip?: _INT
}

// XY Input: LoRA [Efficiency Nodes_XY Inputs]
export interface XYInputLoRA extends HasSingle_XY, ComfyNode<XYInputLoRA_input> {
    nameInComfy: "XY Input: LoRA"
    XY: Slot<'XY', 0>,
}
export interface XYInputLoRA_input {
    input_mode: Enum_XYInputLoRA_Input_mode
    /** default="C:\\example_folder" */
    batch_path?: _STRING
    /** default=false */
    subdirectories?: _BOOLEAN
    batch_sort: Enum_XYInputVAE_Batch_sort
    /** default=-1 min=50 max=50 step=1 */
    batch_max?: _INT
    /** default=3 min=50 max=50 step=1 */
    lora_count?: _INT
    /** default=1 min=10 max=10 step=0.01 */
    model_strength?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_strength?: _FLOAT
    lora_name_1: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_1?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_1?: _FLOAT
    lora_name_2: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_2?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_2?: _FLOAT
    lora_name_3: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_3?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_3?: _FLOAT
    lora_name_4: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_4?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_4?: _FLOAT
    lora_name_5: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_5?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_5?: _FLOAT
    lora_name_6: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_6?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_6?: _FLOAT
    lora_name_7: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_7?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_7?: _FLOAT
    lora_name_8: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_8?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_8?: _FLOAT
    lora_name_9: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_9?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_9?: _FLOAT
    lora_name_10: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_10?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_10?: _FLOAT
    lora_name_11: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_11?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_11?: _FLOAT
    lora_name_12: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_12?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_12?: _FLOAT
    lora_name_13: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_13?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_13?: _FLOAT
    lora_name_14: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_14?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_14?: _FLOAT
    lora_name_15: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_15?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_15?: _FLOAT
    lora_name_16: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_16?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_16?: _FLOAT
    lora_name_17: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_17?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_17?: _FLOAT
    lora_name_18: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_18?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_18?: _FLOAT
    lora_name_19: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_19?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_19?: _FLOAT
    lora_name_20: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_20?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_20?: _FLOAT
    lora_name_21: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_21?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_21?: _FLOAT
    lora_name_22: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_22?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_22?: _FLOAT
    lora_name_23: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_23?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_23?: _FLOAT
    lora_name_24: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_24?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_24?: _FLOAT
    lora_name_25: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_25?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_25?: _FLOAT
    lora_name_26: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_26?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_26?: _FLOAT
    lora_name_27: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_27?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_27?: _FLOAT
    lora_name_28: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_28?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_28?: _FLOAT
    lora_name_29: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_29?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_29?: _FLOAT
    lora_name_30: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_30?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_30?: _FLOAT
    lora_name_31: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_31?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_31?: _FLOAT
    lora_name_32: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_32?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_32?: _FLOAT
    lora_name_33: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_33?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_33?: _FLOAT
    lora_name_34: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_34?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_34?: _FLOAT
    lora_name_35: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_35?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_35?: _FLOAT
    lora_name_36: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_36?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_36?: _FLOAT
    lora_name_37: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_37?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_37?: _FLOAT
    lora_name_38: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_38?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_38?: _FLOAT
    lora_name_39: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_39?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_39?: _FLOAT
    lora_name_40: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_40?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_40?: _FLOAT
    lora_name_41: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_41?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_41?: _FLOAT
    lora_name_42: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_42?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_42?: _FLOAT
    lora_name_43: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_43?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_43?: _FLOAT
    lora_name_44: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_44?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_44?: _FLOAT
    lora_name_45: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_45?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_45?: _FLOAT
    lora_name_46: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_46?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_46?: _FLOAT
    lora_name_47: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_47?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_47?: _FLOAT
    lora_name_48: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_48?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_48?: _FLOAT
    lora_name_49: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_49?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_49?: _FLOAT
    lora_name_50: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_str_50?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_str_50?: _FLOAT
    lora_stack?: _LORA_STACK
}

// XY Input: LoRA Plot [Efficiency Nodes_XY Inputs]
export interface XYInputLoRAPlot extends ComfyNode<XYInputLoRAPlot_input> {
    nameInComfy: "XY Input: LoRA Plot"
    XY: Slot<'XY', 0>,
    XY_1: Slot<'XY', 1>,
}
export interface XYInputLoRAPlot_input {
    input_mode: Enum_XYInputLoRAPlot_Input_mode
    lora_name: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    model_strength?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    clip_strength?: _FLOAT
    /** default=3 min=50 max=50 */
    X_batch_count?: _INT
    /** default="C:\\example_folder" */
    X_batch_path?: _STRING
    /** default=false */
    X_subdirectories?: _BOOLEAN
    X_batch_sort: Enum_XYInputVAE_Batch_sort
    /** default=0 min=10 max=10 step=0.01 */
    X_first_value?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    X_last_value?: _FLOAT
    /** default=3 min=50 max=50 */
    Y_batch_count?: _INT
    /** default=0 min=10 max=10 step=0.01 */
    Y_first_value?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    Y_last_value?: _FLOAT
    lora_stack?: _LORA_STACK
}

// XY Input: LoRA Stacks [Efficiency Nodes_XY Inputs]
export interface XYInputLoRAStacks extends HasSingle_XY, ComfyNode<XYInputLoRAStacks_input> {
    nameInComfy: "XY Input: LoRA Stacks"
    XY: Slot<'XY', 0>,
}
export interface XYInputLoRAStacks_input {
    node_state: Enum_XYInputLoRAStacks_Node_state
    lora_stack_1?: _LORA_STACK
    lora_stack_2?: _LORA_STACK
    lora_stack_3?: _LORA_STACK
    lora_stack_4?: _LORA_STACK
    lora_stack_5?: _LORA_STACK
}

// XY Input: Control Net [Efficiency Nodes_XY Inputs]
export interface XYInputControlNet extends HasSingle_XY, ComfyNode<XYInputControlNet_input> {
    nameInComfy: "XY Input: Control Net"
    XY: Slot<'XY', 0>,
}
export interface XYInputControlNet_input {
    control_net: _CONTROL_NET
    image: _IMAGE
    target_parameter: Enum_XYInputControlNet_Target_parameter
    /** default=3 min=50 max=50 */
    batch_count?: _INT
    /** default=0 min=10 max=10 step=0.01 */
    first_strength?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    last_strength?: _FLOAT
    /** default=0 min=1 max=1 step=0.01 */
    first_start_percent?: _FLOAT
    /** default=1 min=1 max=1 step=0.01 */
    last_start_percent?: _FLOAT
    /** default=0 min=1 max=1 step=0.01 */
    first_end_percent?: _FLOAT
    /** default=1 min=1 max=1 step=0.01 */
    last_end_percent?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    strength?: _FLOAT
    /** default=0 min=1 max=1 step=0.01 */
    start_percent?: _FLOAT
    /** default=1 min=1 max=1 step=0.01 */
    end_percent?: _FLOAT
    cnet_stack?: _CONTROL_NET_STACK
}

// XY Input: Control Net Plot [Efficiency Nodes_XY Inputs]
export interface XYInputControlNetPlot extends ComfyNode<XYInputControlNetPlot_input> {
    nameInComfy: "XY Input: Control Net Plot"
    XY: Slot<'XY', 0>,
    XY_1: Slot<'XY', 1>,
}
export interface XYInputControlNetPlot_input {
    control_net: _CONTROL_NET
    image: _IMAGE
    plot_type: Enum_XYInputControlNetPlot_Plot_type
    /** default=1 min=1 max=1 step=0.01 */
    strength?: _FLOAT
    /** default=0 min=1 max=1 step=0.01 */
    start_percent?: _FLOAT
    /** default=1 min=1 max=1 step=0.01 */
    end_percent?: _FLOAT
    /** default=3 min=50 max=50 */
    X_batch_count?: _INT
    /** default=0 min=10 max=10 step=0.01 */
    X_first_value?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    X_last_value?: _FLOAT
    /** default=3 min=50 max=50 */
    Y_batch_count?: _INT
    /** default=0 min=10 max=10 step=0.01 */
    Y_first_value?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    Y_last_value?: _FLOAT
    cnet_stack?: _CONTROL_NET_STACK
}

// XY Input: Manual XY Entry [Efficiency Nodes_XY Inputs]
export interface XYInputManualXYEntry extends HasSingle_XY, ComfyNode<XYInputManualXYEntry_input> {
    nameInComfy: "XY Input: Manual XY Entry"
    XY: Slot<'XY', 0>,
}
export interface XYInputManualXYEntry_input {
    plot_type: Enum_XYInputManualXYEntry_Plot_type
    /** default="" */
    plot_value?: _STRING
}

// Manual XY Entry Info [Efficiency Nodes_XY Inputs]
export interface ManualXYEntryInfo extends ComfyNode<ManualXYEntryInfo_input> {
    nameInComfy: "Manual XY Entry Info"
}
export interface ManualXYEntryInfo_input {
    /** default="_____________SYNTAX_____________\n(X/Y_types)     (X/Y_values)\nSeeds++ Batch   batch_count\nSteps           steps_1;steps_2;...\nStartStep       start_step_1;start_step_2;...\nEndStep         end_step_1;end_step_2;...\nCFG Scale       cfg_1;cfg_2;...\nSampler(1)      sampler_1;sampler_2;...\nSampler(2)      sampler_1,scheduler_1;...\nSampler(3)      sampler_1;...;,default_scheduler\nScheduler       scheduler_1;scheduler_2;...\nDenoise         denoise_1;denoise_2;...\nVAE             vae_1;vae_2;vae_3;...\n+Prompt S/R     search_txt;replace_1;replace_2;...\n-Prompt S/R     search_txt;replace_1;replace_2;...\nCheckpoint(1)   ckpt_1;ckpt_2;ckpt_3;...\nCheckpoint(2)   ckpt_1,clip_skip_1;...\nCheckpoint(3)   ckpt_1;ckpt_2;...;,default_clip_skip\nClip Skip       clip_skip_1;clip_skip_2;...\nLoRA(1)         lora_1;lora_2;lora_3;...\nLoRA(2)         lora_1;...;,default_model_str,default_clip_str\nLoRA(3)         lora_1,model_str_1,clip_str_1;...\n\n____________SAMPLERS____________\neuler;\neuler_ancestral;\nheun;\ndpm_2;\ndpm_2_ancestral;\nlms;\ndpm_fast;\ndpm_adaptive;\ndpmpp_2s_ancestral;\ndpmpp_sde;\ndpmpp_sde_gpu;\ndpmpp_2m;\ndpmpp_2m_sde;\ndpmpp_2m_sde_gpu;\ndpmpp_3m_sde;\ndpmpp_3m_sde_gpu;\nddpm;\nddim;\nuni_pc;\nuni_pc_bh2\n\n___________SCHEDULERS___________\nnormal;\nkarras;\nexponential;\nsgm_uniform;\nsimple;\nddim_uniform\n\n_____________VAES_______________\nblessed2.vae.pt;\nkl-f8-anime2.ckpt;\norangemix.vae.pt;\nvae-ft-mse-840000-ema-pruned.safetensors\n\n___________CHECKPOINTS__________\nAOM3A1_orangemixs.safetensors;\nAOM3A3_orangemixs.safetensors;\nAbyssOrangeMix2_hard.safetensors;\nDeliberate-inpainting.safetensors;\nSevenof9V3.safetensors;\nalbedobaseXL_v02.safetensors;\nangel1_36224.safetensors;\nanything-v3-fp16-pruned.safetensors;\ndeliberate_v2.safetensors;\ndreamshaperXL10_alpha2Xl10.safetensors;\ndynavisionXLAllInOneStylized_beta0411Bakedvae.safetensors;\nghostmix_v12.safetensors;\njuggernautXL_version3.safetensors;\nlyriel_v15.safetensors;\nmistoonAnime_v10.safetensors;\nmistoonAnime_v10Inpainting.safetensors;\nrealisticVisionV20_v20.safetensors;\nrevAnimated_v121.safetensors;\nrevAnimated_v121Inp-inpainting.safetensors;\nrevAnimated_v122.safetensors;\nsd_xl_base_1.0.safetensors;\nsd_xl_refiner_1.0.safetensors;\ntoonyou_beta1.safetensors;\nv1-5-pruned-emaonly.ckpt;\nv1-5-pruned-emaonly.safetensors;\nv2-1_512-ema-pruned.safetensors;\nv2-1_768-ema-pruned.safetensors;\nwd-1-5-beta2-aesthetic-unclip-h-fp16.safetensors;\nwd-1-5-beta2-fp16.safetensors\n\n_____________LORAS______________\nCharacter Design.safetensors;\nIsometric Cutaway.safetensors;\nStained Glass Portrait.safetensors;\npxll.safetensors;\nsd15\\animemix_16.safetensors;\nsd15\\animemix_v3_offset.safetensors;\nsd15\\chars\\dark_magician_girl.safetensors;\nsd15\\chars\\yorha_noDOT_2_type_b.safetensors;\nsd15\\colors\\LowRa.safetensors;\nsd15\\colors\\theovercomer8sContrastFix_sd15.safetensors;\nsd15\\colors\\theovercomer8sContrastFix_sd21768.safetensors;\nsd15\\styles\\ConstructionyardAIV3.safetensors;\nsd15\\styles\\StonepunkAI-000011.safetensors;\nsd15\\styles\\ToonYou_Style.safetensors;\nsd15\\styles\\baroqueAI.safetensors;\nsd15\\styles\\pixel_f2.safetensors;\nsd15\\test\\Moxin_10.safetensors;\nsd15\\test\\animeLineartMangaLike_v30MangaLike.safetensors;\nsd15\\utils\\charTurnBetaLora.safetensors;\nsdxl-baton-v02-e93.safetensors\n" */
    notes?: _STRING
}

// Join XY Inputs of Same Type [Efficiency Nodes_XY Inputs]
export interface JoinXYInputsOfSameType extends HasSingle_XY, ComfyNode<JoinXYInputsOfSameType_input> {
    nameInComfy: "Join XY Inputs of Same Type"
    XY: Slot<'XY', 0>,
}
export interface JoinXYInputsOfSameType_input {
    XY_1: _XY
    XY_2: _XY
}

// Image Overlay [Efficiency Nodes_Image]
export interface ImageOverlay extends HasSingle_IMAGE, ComfyNode<ImageOverlay_input> {
    nameInComfy: "Image Overlay"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImageOverlay_input {
    base_image: _IMAGE
    overlay_image: _IMAGE
    overlay_resize: Enum_ImageOverlay_Overlay_resize
    resize_method: Enum_ImpactLatentPixelScale_Scale_method
    /** default=1 min=16 max=16 step=0.1 */
    rescale_factor?: _FLOAT
    /** default=512 min=8192 max=8192 step=64 */
    width?: _INT
    /** default=512 min=8192 max=8192 step=64 */
    height?: _INT
    /** default=0 min=48000 max=48000 step=10 */
    x_offset?: _INT
    /** default=0 min=48000 max=48000 step=10 */
    y_offset?: _INT
    /** default=0 min=180 max=180 step=5 */
    rotation?: _INT
    /** default=0 min=100 max=100 step=5 */
    opacity?: _FLOAT
    optional_mask?: _MASK
}

// HighRes-Fix Script [Efficiency Nodes_Scripts]
export interface HighResFixScript extends HasSingle_SCRIPT, ComfyNode<HighResFixScript_input> {
    nameInComfy: "HighRes-Fix Script"
    SCRIPT: Slot<'SCRIPT', 0>,
}
export interface HighResFixScript_input {
    latent_upscale_method: Enum_LatentUpscale_Upscale_method
    /** default=1.25 min=8 max=8 step=0.25 */
    upscale_by?: _FLOAT
    /** default=12 min=10000 max=10000 */
    hires_steps?: _INT
    /** default=0.56 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
    /** default=1 min=5 max=5 step=1 */
    iterations?: _INT
    script?: _SCRIPT
}

// Evaluate Integers [Efficiency Nodes_Simple Eval]
export interface EvaluateIntegers extends HasSingle_INT, HasSingle_FLOAT, HasSingle_STRING, ComfyNode<EvaluateIntegers_input> {
    nameInComfy: "Evaluate Integers"
    INT: Slot<'INT', 0>,
    FLOAT: Slot<'FLOAT', 1>,
    STRING: Slot<'STRING', 2>,
}
export interface EvaluateIntegers_input {
    /** default="((a + b) - c) / 2" */
    python_expression?: _STRING
    print_to_console: Enum_XYPlot_XY_flip
    /** default=0 min=48000 max=48000 step=1 */
    a?: _INT
    /** default=0 min=48000 max=48000 step=1 */
    b?: _INT
    /** default=0 min=48000 max=48000 step=1 */
    c?: _INT
}

// Evaluate Floats [Efficiency Nodes_Simple Eval]
export interface EvaluateFloats extends HasSingle_INT, HasSingle_FLOAT, HasSingle_STRING, ComfyNode<EvaluateFloats_input> {
    nameInComfy: "Evaluate Floats"
    INT: Slot<'INT', 0>,
    FLOAT: Slot<'FLOAT', 1>,
    STRING: Slot<'STRING', 2>,
}
export interface EvaluateFloats_input {
    /** default="((a + b) - c) / 2" */
    python_expression?: _STRING
    print_to_console: Enum_XYPlot_XY_flip
    /** default=0 min=1.7976931348623157e+308 max=1.7976931348623157e+308 step=1 */
    a?: _FLOAT
    /** default=0 min=1.7976931348623157e+308 max=1.7976931348623157e+308 step=1 */
    b?: _FLOAT
    /** default=0 min=1.7976931348623157e+308 max=1.7976931348623157e+308 step=1 */
    c?: _FLOAT
}

// Evaluate Strings [Efficiency Nodes_Simple Eval]
export interface EvaluateStrings extends HasSingle_STRING, ComfyNode<EvaluateStrings_input> {
    nameInComfy: "Evaluate Strings"
    STRING: Slot<'STRING', 0>,
}
export interface EvaluateStrings_input {
    /** default="a + b + c" */
    python_expression?: _STRING
    print_to_console: Enum_XYPlot_XY_flip
    /** default="Hello" */
    a?: _STRING
    /** default=" World" */
    b?: _STRING
    /** default="!" */
    c?: _STRING
}

// Simple Eval Examples [Efficiency Nodes_Simple Eval]
export interface SimpleEvalExamples extends ComfyNode<SimpleEvalExamples_input> {
    nameInComfy: "Simple Eval Examples"
}
export interface SimpleEvalExamples_input {
    /** default="The Evaluate Integers, Floats, and Strings nodes \nnow employ the SimpleEval library, enabling secure \ncreation and execution of custom Python expressions.\n\n(https://github.com/danthedeckie/simpleeval)\n\nBelow is a short list of what is possible.\n______________________________________________\n\n\"EVALUATE INTEGERS/FLOATS\" NODE EXPRESSION EXAMPLES:\n\nAddition: a + b + c\nSubtraction: a - b - c\nMultiplication: a * b * c\nDivision: a / b / c\nModulo: a % b % c\nExponentiation: a ** b ** c\nFloor Division: a // b // c\nAbsolute Value: abs(a) + abs(b) + abs(c)\nMaximum: max(a, b, c)\nMinimum: min(a, b, c)\nSum of Squares: a**2 + b**2 + c**2\nBitwise And: a & b & c\nBitwise Or: a | b | c\nBitwise Xor: a ^ b ^ c\nLeft Shift: a << 1 + b << 1 + c << 1\nRight Shift: a >> 1 + b >> 1 + c >> 1\nGreater Than Comparison: a > b > c\nLess Than Comparison: a < b < c\nEqual To Comparison: a == b == c\nNot Equal To Comparison: a != b != c\n______________________________________________\n\n\"EVALUATE STRINGS\" NODE EXPRESSION EXAMPLES:\n\nConcatenate: a + b + c\nFormat: f'{a} {b} {c}'\nLength: len(a) + len(b) + len(c)\nUppercase: a.upper() + b.upper() + c.upper()\nLowercase: a.lower() + b.lower() + c.lower()\nCapitalize: a.capitalize() + b.capitalize() + c.capitalize()\nTitle Case: a.title() + b.title() + c.title()\nStrip: a.strip() + b.strip() + c.strip()\nFind Substring: a.find('sub') + b.find('sub') + c.find('sub')\nReplace Substring: a.replace('old', 'new') + b.replace('old', 'new') + c.replace('old', 'new')\nCount Substring: a.count('sub') + b.count('sub') + c.count('sub')\nCheck Numeric: a.isnumeric() + b.isnumeric() + c.isnumeric()\nCheck Alphabetic: a.isalpha() + b.isalpha() + c.isalpha()\nCheck Alphanumeric: a.isalnum() + b.isalnum() + c.isalnum()\nCheck Start: a.startswith('prefix') + b.startswith('prefix') + c.startswith('prefix')\nCheck End: a.endswith('suffix') + b.endswith('suffix') + c.endswith('suffix')\nSplit: a.split(' ') + b.split(' ') + c.split(' ')\nZero Fill: a.zfill(5) + b.zfill(5) + c.zfill(5)\nSlice: a[:5] + b[:5] + c[:5]\nReverse: a[::-1] + b[::-1] + c[::-1]\n______________________________________________" */
    models_text?: _STRING
}

// LatentByRatio [JNode]
export interface LatentByRatio extends HasSingle_LATENT, ComfyNode<LatentByRatio_input> {
    nameInComfy: "LatentByRatio"
    LATENT: Slot<'LATENT', 0>,
}
export interface LatentByRatio_input {
    model: Enum_LatentByRatio_Model
    ratio: Enum_LatentByRatio_Ratio
    /** default=1 min=64 max=64 */
    batch_size?: _INT
}

// Mask By Text [Masquerade Nodes]
export interface MasqueradeMaskByText extends ComfyNode<MasqueradeMaskByText_input> {
    nameInComfy: "Mask By Text"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_1: Slot<'IMAGE', 1>,
}
export interface MasqueradeMaskByText_input {
    image: _IMAGE
    /** */
    prompt: _STRING
    /** */
    negative_prompt: _STRING
    /** default=0.5 min=1 max=1 step=0.01 */
    precision?: _FLOAT
    normalize: Enum_MasqueradeMaskByText_Normalize
}

// Mask Morphology [Masquerade Nodes]
export interface MasqueradeMaskMorphology extends HasSingle_IMAGE, ComfyNode<MasqueradeMaskMorphology_input> {
    nameInComfy: "Mask Morphology"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeMaskMorphology_input {
    image: _IMAGE
    /** default=5 min=128 max=128 step=1 */
    distance?: _INT
    op: Enum_MasqueradeMaskMorphology_Op
}

// Combine Masks [Masquerade Nodes]
export interface MasqueradeCombineMasks extends HasSingle_IMAGE, ComfyNode<MasqueradeCombineMasks_input> {
    nameInComfy: "Combine Masks"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeCombineMasks_input {
    image1: _IMAGE
    image2: _IMAGE
    op: Enum_MasqueradeCombineMasks_Op
    clamp_result: Enum_MasqueradeMaskByText_Normalize
    round_result: Enum_MasqueradeMaskByText_Normalize
}

// Unary Mask Op [Masquerade Nodes]
export interface MasqueradeUnaryMaskOp extends HasSingle_IMAGE, ComfyNode<MasqueradeUnaryMaskOp_input> {
    nameInComfy: "Unary Mask Op"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeUnaryMaskOp_input {
    image: _IMAGE
    op: Enum_MasqueradeUnaryMaskOp_Op
}

// Unary Image Op [Masquerade Nodes]
export interface MasqueradeUnaryImageOp extends HasSingle_IMAGE, ComfyNode<MasqueradeUnaryImageOp_input> {
    nameInComfy: "Unary Image Op"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeUnaryImageOp_input {
    image: _IMAGE
    op: Enum_MasqueradeUnaryMaskOp_Op
}

// Blur [Masquerade Nodes]
export interface MasqueradeBlur extends HasSingle_IMAGE, ComfyNode<MasqueradeBlur_input> {
    nameInComfy: "Blur"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeBlur_input {
    image: _IMAGE
    /** default=10 min=48 max=48 step=1 */
    radius?: _INT
    /** default=1 min=3 max=3 step=0.01 */
    sigma_factor?: _FLOAT
}

// Image To Mask [Masquerade Nodes]
export interface MasqueradeImageToMask extends HasSingle_MASK, ComfyNode<MasqueradeImageToMask_input> {
    nameInComfy: "Image To Mask"
    MASK: Slot<'MASK', 0>,
}
export interface MasqueradeImageToMask_input {
    image: _IMAGE
    method: Enum_MasqueradeImageToMask_Method
}

// Mix Images By Mask [Masquerade Nodes]
export interface MasqueradeMixImagesByMask extends HasSingle_IMAGE, ComfyNode<MasqueradeMixImagesByMask_input> {
    nameInComfy: "Mix Images By Mask"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeMixImagesByMask_input {
    image1: _IMAGE
    image2: _IMAGE
    mask: _IMAGE
}

// Mix Color By Mask [Masquerade Nodes]
export interface MasqueradeMixColorByMask extends HasSingle_IMAGE, ComfyNode<MasqueradeMixColorByMask_input> {
    nameInComfy: "Mix Color By Mask"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeMixColorByMask_input {
    image: _IMAGE
    /** default=0 min=255 max=255 step=1 */
    r?: _INT
    /** default=0 min=255 max=255 step=1 */
    g?: _INT
    /** default=0 min=255 max=255 step=1 */
    b?: _INT
    mask: _IMAGE
}

// Mask To Region [Masquerade Nodes]
export interface MasqueradeMaskToRegion extends HasSingle_IMAGE, ComfyNode<MasqueradeMaskToRegion_input> {
    nameInComfy: "Mask To Region"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeMaskToRegion_input {
    mask: _IMAGE
    /** default=0 min=1048576 max=1048576 step=1 */
    padding?: _INT
    constraints: Enum_MasqueradeMaskToRegion_Constraints
    /** default=64 min=1048576 max=1048576 step=1 */
    constraint_x?: _INT
    /** default=64 min=1048576 max=1048576 step=1 */
    constraint_y?: _INT
    /** default=0 min=1048576 max=1048576 step=1 */
    min_width?: _INT
    /** default=0 min=1048576 max=1048576 step=1 */
    min_height?: _INT
    batch_behavior: Enum_MasqueradeMaskToRegion_Batch_behavior
}

// Cut By Mask [Masquerade Nodes]
export interface MasqueradeCutByMask extends HasSingle_IMAGE, ComfyNode<MasqueradeCutByMask_input> {
    nameInComfy: "Cut By Mask"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeCutByMask_input {
    image: _IMAGE
    mask: _IMAGE
    /** default=0 min=1048576 max=1048576 step=1 */
    force_resize_width?: _INT
    /** default=0 min=1048576 max=1048576 step=1 */
    force_resize_height?: _INT
    mask_mapping_optional?: _MASK_MAPPING
}

// Paste By Mask [Masquerade Nodes]
export interface MasqueradePasteByMask extends HasSingle_IMAGE, ComfyNode<MasqueradePasteByMask_input> {
    nameInComfy: "Paste By Mask"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradePasteByMask_input {
    image_base: _IMAGE
    image_to_paste: _IMAGE
    mask: _IMAGE
    resize_behavior: Enum_MasqueradePasteByMask_Resize_behavior
    mask_mapping_optional?: _MASK_MAPPING
}

// Get Image Size [Masquerade Nodes]
export interface MasqueradeGetImageSize extends ComfyNode<MasqueradeGetImageSize_input> {
    nameInComfy: "Get Image Size"
    INT: Slot<'INT', 0>,
    INT_1: Slot<'INT', 1>,
}
export interface MasqueradeGetImageSize_input {
    image: _IMAGE
}

// Change Channel Count [Masquerade Nodes]
export interface MasqueradeChangeChannelCount extends HasSingle_IMAGE, ComfyNode<MasqueradeChangeChannelCount_input> {
    nameInComfy: "Change Channel Count"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeChangeChannelCount_input {
    image: _IMAGE
    kind: Enum_MasqueradeChangeChannelCount_Kind
}

// Constant Mask [Masquerade Nodes]
export interface MasqueradeConstantMask extends HasSingle_IMAGE, ComfyNode<MasqueradeConstantMask_input> {
    nameInComfy: "Constant Mask"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeConstantMask_input {
    /** default=0 min=8 max=8 step=0.01 */
    value?: _FLOAT
    /** default=0 min=1048576 max=1048576 step=1 */
    explicit_height?: _INT
    /** default=0 min=1048576 max=1048576 step=1 */
    explicit_width?: _INT
    copy_image_size?: _IMAGE
}

// Prune By Mask [Masquerade Nodes]
export interface MasqueradePruneByMask extends HasSingle_IMAGE, ComfyNode<MasqueradePruneByMask_input> {
    nameInComfy: "Prune By Mask"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradePruneByMask_input {
    image: _IMAGE
    mask: _IMAGE
}

// Separate Mask Components [Masquerade Nodes]
export interface MasqueradeSeparateMaskComponents extends HasSingle_IMAGE, HasSingle_MASK_MAPPING, ComfyNode<MasqueradeSeparateMaskComponents_input> {
    nameInComfy: "Separate Mask Components"
    IMAGE: Slot<'IMAGE', 0>,
    MASK_MAPPING: Slot<'MASK_MAPPING', 1>,
}
export interface MasqueradeSeparateMaskComponents_input {
    mask: _IMAGE
}

// Create Rect Mask [Masquerade Nodes]
export interface MasqueradeCreateRectMask extends HasSingle_IMAGE, ComfyNode<MasqueradeCreateRectMask_input> {
    nameInComfy: "Create Rect Mask"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeCreateRectMask_input {
    mode: Enum_MasqueradeCreateRectMask_Mode
    origin: Enum_MasqueradeCreateRectMask_Origin
    /** default=0 min=1048576 max=1048576 step=1 */
    x?: _FLOAT
    /** default=0 min=1048576 max=1048576 step=1 */
    y?: _FLOAT
    /** default=50 min=1048576 max=1048576 step=1 */
    width?: _FLOAT
    /** default=50 min=1048576 max=1048576 step=1 */
    height?: _FLOAT
    /** default=512 min=1048576 max=1048576 step=64 */
    image_width?: _INT
    /** default=512 min=1048576 max=1048576 step=64 */
    image_height?: _INT
    copy_image_size?: _IMAGE
}

// Make Image Batch [Masquerade Nodes]
export interface MasqueradeMakeImageBatch extends HasSingle_IMAGE, ComfyNode<MasqueradeMakeImageBatch_input> {
    nameInComfy: "Make Image Batch"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeMakeImageBatch_input {
    image1: _IMAGE
    image2?: _IMAGE
    image3?: _IMAGE
    image4?: _IMAGE
    image5?: _IMAGE
    image6?: _IMAGE
}

// Create QR Code [Masquerade Nodes]
export interface MasqueradeCreateQRCode extends HasSingle_IMAGE, ComfyNode<MasqueradeCreateQRCode_input> {
    nameInComfy: "Create QR Code"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeCreateQRCode_input {
    /** */
    text: _STRING
    /** default=512 min=4096 max=4096 step=64 */
    size?: _INT
    /** default=1 min=40 max=40 step=1 */
    qr_version?: _INT
    /** default="H" */
    error_correction?: Enum_MasqueradeCreateQRCode_Error_correction
    /** default=10 min=100 max=100 step=1 */
    box_size?: _INT
    /** default=4 min=100 max=100 step=1 */
    border?: _INT
}

// Convert Color Space [Masquerade Nodes]
export interface MasqueradeConvertColorSpace extends HasSingle_IMAGE, ComfyNode<MasqueradeConvertColorSpace_input> {
    nameInComfy: "Convert Color Space"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface MasqueradeConvertColorSpace_input {
    in_space: Enum_MasqueradeConvertColorSpace_In_space
    out_space: Enum_MasqueradeConvertColorSpace_In_space
    image: _IMAGE
}

// MasqueradeIncrementer [Masquerade Nodes]
export interface MasqueradeMasqueradeIncrementer extends HasSingle_INT, ComfyNode<MasqueradeMasqueradeIncrementer_input> {
    nameInComfy: "MasqueradeIncrementer"
    INT: Slot<'INT', 0>,
}
export interface MasqueradeMasqueradeIncrementer_input {
    /** default=0 min=18446744073709552000 max=18446744073709552000 step=1 */
    seed?: _INT
    /** default=1 min=18446744073709552000 max=18446744073709552000 step=1 */
    max_value?: _INT
}

// Image Remove Background (rembg) [image]
export interface ImageRemoveBackgroundRembg extends HasSingle_IMAGE, ComfyNode<ImageRemoveBackgroundRembg_input> {
    nameInComfy: "Image Remove Background (rembg)"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface ImageRemoveBackgroundRembg_input {
    image: _IMAGE
}

// SDXLMixSampler [JNode]
export interface SDXLMixSampler extends HasSingle_LATENT, ComfyNode<SDXLMixSampler_input> {
    nameInComfy: "SDXLMixSampler"
    LATENT: Slot<'LATENT', 0>,
}
export interface SDXLMixSampler_input {
    base_model: _MODEL
    ref_model: _MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    noise_seed?: _INT
    /** default=1 min=200 max=200 step=1 */
    total_loop?: _INT
    /** default=65 min=100 max=100 step=1 */
    base_steps_percentage?: _FLOAT
    /** default=20 min=undefined step=1 */
    mixing_steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    base_positive: _CONDITIONING
    base_negative: _CONDITIONING
    refiner_positive: _CONDITIONING
    refiner_negative: _CONDITIONING
    latent_image: _LATENT
    /** default=1 min=1 max=1 step=0.1 */
    denoise?: _FLOAT
    /** default="yes" */
    final_only?: Enum_MasqueradeMaskByText_Normalize
}

// BLIP Model Loader [WAS Suite_Loaders]
export interface WASBLIPModelLoader extends HasSingle_BLIP_MODEL, ComfyNode<WASBLIPModelLoader_input> {
    nameInComfy: "BLIP Model Loader"
    BLIP_MODEL: Slot<'BLIP_MODEL', 0>,
}
export interface WASBLIPModelLoader_input {
    blip_model: Enum_WASBLIPModelLoader_Blip_model
}

// Blend Latents [WAS Suite_Latent]
export interface WASBlendLatents extends HasSingle_LATENT, ComfyNode<WASBlendLatents_input> {
    nameInComfy: "Blend Latents"
    LATENT: Slot<'LATENT', 0>,
}
export interface WASBlendLatents_input {
    latent_a: _LATENT
    latent_b: _LATENT
    operation: Enum_WASBlendLatents_Operation
    /** default=0.5 min=1 max=1 step=0.01 */
    blend?: _FLOAT
}

// Cache Node [WAS Suite_IO]
export interface WASCacheNode extends ComfyNode<WASCacheNode_input> {
    nameInComfy: "Cache Node"
    STRING: Slot<'STRING', 0>,
    STRING_1: Slot<'STRING', 1>,
    STRING_2: Slot<'STRING', 2>,
}
export interface WASCacheNode_input {
    /** default='<redacted>' */
    latent_suffix?: _STRING
    /** default='<redacted>' */
    image_suffix?: _STRING
    /** default='<redacted>' */
    conditioning_suffix?: _STRING
    /** default='<redacted>' */
    output_path?: _STRING
    latent?: _LATENT
    image?: _IMAGE
    conditioning?: _CONDITIONING
}

// Checkpoint Loader [WAS Suite_Loaders_Advanced]
export interface WASCheckpointLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, HasSingle_STRING, ComfyNode<WASCheckpointLoader_input> {
    nameInComfy: "Checkpoint Loader"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    VAE: Slot<'VAE', 2>,
    STRING: Slot<'STRING', 3>,
}
export interface WASCheckpointLoader_input {
    config_name: Enum_CheckpointLoader_Config_name
    ckpt_name: Enum_CheckpointLoaderSimple_Ckpt_name
}

// Checkpoint Loader (Simple) [WAS Suite_Loaders]
export interface WASCheckpointLoaderSimple extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, HasSingle_STRING, ComfyNode<WASCheckpointLoaderSimple_input> {
    nameInComfy: "Checkpoint Loader (Simple)"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    VAE: Slot<'VAE', 2>,
    STRING: Slot<'STRING', 3>,
}
export interface WASCheckpointLoaderSimple_input {
    ckpt_name: Enum_CheckpointLoaderSimple_Ckpt_name
}

// CLIPTextEncode (NSP) [WAS Suite_Conditioning]
export interface WASCLIPTextEncodeNSP extends HasSingle_CONDITIONING, ComfyNode<WASCLIPTextEncodeNSP_input> {
    nameInComfy: "CLIPTextEncode (NSP)"
    CONDITIONING: Slot<'CONDITIONING', 0>,
    STRING: Slot<'STRING', 1>,
    STRING_1: Slot<'STRING', 2>,
}
export interface WASCLIPTextEncodeNSP_input {
    mode: Enum_WASCLIPTextEncodeNSP_Mode
    /** default="__" */
    noodle_key?: _STRING
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** */
    text: _STRING
    clip: _CLIP
}

// CLIP Input Switch [WAS Suite_Logic]
export interface WASCLIPInputSwitch extends HasSingle_CLIP, ComfyNode<WASCLIPInputSwitch_input> {
    nameInComfy: "CLIP Input Switch"
    CLIP: Slot<'CLIP', 0>,
}
export interface WASCLIPInputSwitch_input {
    clip_a: _CLIP
    clip_b: _CLIP
    boolean_number: _NUMBER
}

// CLIP Vision Input Switch [WAS Suite_Logic]
export interface WASCLIPVisionInputSwitch extends HasSingle_CLIP_VISION, ComfyNode<WASCLIPVisionInputSwitch_input> {
    nameInComfy: "CLIP Vision Input Switch"
    CLIP_VISION: Slot<'CLIP_VISION', 0>,
}
export interface WASCLIPVisionInputSwitch_input {
    clip_vision_a: _CLIP_VISION
    clip_vision_b: _CLIP_VISION
    boolean_number: _NUMBER
}

// Conditioning Input Switch [WAS Suite_Logic]
export interface WASConditioningInputSwitch extends HasSingle_CONDITIONING, ComfyNode<WASConditioningInputSwitch_input> {
    nameInComfy: "Conditioning Input Switch"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface WASConditioningInputSwitch_input {
    conditioning_a: _CONDITIONING
    conditioning_b: _CONDITIONING
    boolean_number: _NUMBER
}

// Constant Number [WAS Suite_Number]
export interface WASConstantNumber extends HasSingle_NUMBER, HasSingle_FLOAT, HasSingle_INT, ComfyNode<WASConstantNumber_input> {
    nameInComfy: "Constant Number"
    NUMBER: Slot<'NUMBER', 0>,
    FLOAT: Slot<'FLOAT', 1>,
    INT: Slot<'INT', 2>,
}
export interface WASConstantNumber_input {
    number_type: Enum_WASConstantNumber_Number_type
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    number?: _FLOAT
    /** */
    number_as_text?: _STRING
}

// Create Grid Image [WAS Suite_Image_Process]
export interface WASCreateGridImage extends HasSingle_IMAGE, ComfyNode<WASCreateGridImage_input> {
    nameInComfy: "Create Grid Image"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASCreateGridImage_input {
    /** default="./ComfyUI/input/" */
    images_path?: _STRING
    /** default="*" */
    pattern_glob?: _STRING
    include_subfolders: Enum_WASCreateGridImage_Include_subfolders
    /** default=3 min=100 max=100 step=1 */
    border_width?: _INT
    /** default=6 min=24 max=24 step=1 */
    number_of_columns?: _INT
    /** default=256 min=1280 max=1280 step=1 */
    max_cell_size?: _INT
    /** default=0 min=255 max=255 step=1 */
    border_red?: _INT
    /** default=0 min=255 max=255 step=1 */
    border_green?: _INT
    /** default=0 min=255 max=255 step=1 */
    border_blue?: _INT
}

// Create Morph Image [WAS Suite_Animation]
export interface WASCreateMorphImage extends ComfyNode<WASCreateMorphImage_input> {
    nameInComfy: "Create Morph Image"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_1: Slot<'IMAGE', 1>,
    STRING: Slot<'STRING', 2>,
    STRING_1: Slot<'STRING', 3>,
}
export interface WASCreateMorphImage_input {
    image_a: _IMAGE
    image_b: _IMAGE
    /** default=30 min=60 max=60 step=1 */
    transition_frames?: _INT
    /** default=2500 min=60000 max=60000 step=0.1 */
    still_image_delay_ms?: _FLOAT
    /** default=0.1 min=60000 max=60000 step=0.1 */
    duration_ms?: _FLOAT
    /** default=0 min=100 max=100 step=1 */
    loops?: _INT
    /** default=512 min=1280 max=1280 step=1 */
    max_size?: _INT
    /** default="./ComfyUI/output" */
    output_path?: _STRING
    /** default="morph" */
    filename?: _STRING
    filetype: Enum_WASCreateMorphImage_Filetype
}

// Create Morph Image from Path [WAS Suite_Animation]
export interface WASCreateMorphImageFromPath extends ComfyNode<WASCreateMorphImageFromPath_input> {
    nameInComfy: "Create Morph Image from Path"
    STRING: Slot<'STRING', 0>,
    STRING_1: Slot<'STRING', 1>,
}
export interface WASCreateMorphImageFromPath_input {
    /** default=30 min=60 max=60 step=1 */
    transition_frames?: _INT
    /** default=2500 min=60000 max=60000 step=0.1 */
    still_image_delay_ms?: _FLOAT
    /** default=0.1 min=60000 max=60000 step=0.1 */
    duration_ms?: _FLOAT
    /** default=0 min=100 max=100 step=1 */
    loops?: _INT
    /** default=512 min=1280 max=1280 step=1 */
    max_size?: _INT
    /** default="./ComfyUI" */
    input_path?: _STRING
    /** default="*" */
    input_pattern?: _STRING
    /** default="./ComfyUI/output" */
    output_path?: _STRING
    /** default="morph" */
    filename?: _STRING
    filetype: Enum_WASCreateMorphImage_Filetype
}

// Create Video from Path [WAS Suite_Animation]
export interface WASCreateVideoFromPath extends ComfyNode<WASCreateVideoFromPath_input> {
    nameInComfy: "Create Video from Path"
    STRING: Slot<'STRING', 0>,
    STRING_1: Slot<'STRING', 1>,
}
export interface WASCreateVideoFromPath_input {
    /** default=30 min=120 max=120 step=1 */
    transition_frames?: _INT
    /** default=2.5 min=60000 max=60000 step=0.01 */
    image_delay_sec?: _FLOAT
    /** default=30 min=60 max=60 step=1 */
    fps?: _INT
    /** default=512 min=1920 max=1920 step=1 */
    max_size?: _INT
    /** default="./ComfyUI/input" */
    input_path?: _STRING
    /** default="./ComfyUI/output" */
    output_path?: _STRING
    /** default="comfy_video" */
    filename?: _STRING
    codec: Enum_WASCreateVideoFromPath_Codec
}

// CLIPSeg Masking [WAS Suite_Image_Masking]
export interface WASCLIPSegMasking extends HasSingle_MASK, HasSingle_IMAGE, ComfyNode<WASCLIPSegMasking_input> {
    nameInComfy: "CLIPSeg Masking"
    MASK: Slot<'MASK', 0>,
    IMAGE: Slot<'IMAGE', 1>,
}
export interface WASCLIPSegMasking_input {
    image: _IMAGE
    /** default="" */
    text?: _STRING
    clipseg_model?: _CLIPSEG_MODEL
}

// CLIPSeg Model Loader [WAS Suite_Loaders]
export interface WASCLIPSegModelLoader extends HasSingle_CLIPSEG_MODEL, ComfyNode<WASCLIPSegModelLoader_input> {
    nameInComfy: "CLIPSeg Model Loader"
    CLIPSEG_MODEL: Slot<'CLIPSEG_MODEL', 0>,
}
export interface WASCLIPSegModelLoader_input {
    /** default="CIDAS/clipseg-rd64-refined" */
    model?: _STRING
}

// CLIPSeg Batch Masking [WAS Suite_Image_Masking]
export interface WASCLIPSegBatchMasking extends HasSingle_MASK, ComfyNode<WASCLIPSegBatchMasking_input> {
    nameInComfy: "CLIPSeg Batch Masking"
    IMAGE: Slot<'IMAGE', 0>,
    MASK: Slot<'MASK', 1>,
    IMAGE_1: Slot<'IMAGE', 2>,
}
export interface WASCLIPSegBatchMasking_input {
    image_a: _IMAGE
    image_b: _IMAGE
    /** default="" */
    text_a?: _STRING
    /** default="" */
    text_b?: _STRING
    image_c?: _IMAGE
    image_d?: _IMAGE
    image_e?: _IMAGE
    image_f?: _IMAGE
    /** default="" */
    text_c?: _STRING
    /** default="" */
    text_d?: _STRING
    /** default="" */
    text_e?: _STRING
    /** default="" */
    text_f?: _STRING
}

// Convert Masks to Images [WAS Suite_Image_Masking]
export interface WASConvertMasksToImages extends HasSingle_IMAGE, ComfyNode<WASConvertMasksToImages_input> {
    nameInComfy: "Convert Masks to Images"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASConvertMasksToImages_input {
    masks: _MASK
}

// Control Net Model Input Switch [WAS Suite_Logic]
export interface WASControlNetModelInputSwitch extends HasSingle_CONTROL_NET, ComfyNode<WASControlNetModelInputSwitch_input> {
    nameInComfy: "Control Net Model Input Switch"
    CONTROL_NET: Slot<'CONTROL_NET', 0>,
}
export interface WASControlNetModelInputSwitch_input {
    control_net_a: _CONTROL_NET
    control_net_b: _CONTROL_NET
    boolean_number: _NUMBER
}

// Debug Number to Console [WAS Suite_Debug]
export interface WASDebugNumberToConsole extends HasSingle_NUMBER, ComfyNode<WASDebugNumberToConsole_input> {
    nameInComfy: "Debug Number to Console"
    NUMBER: Slot<'NUMBER', 0>,
}
export interface WASDebugNumberToConsole_input {
    number: _NUMBER
    /** default="Debug to Console" */
    label?: _STRING
}

// Dictionary to Console [WAS Suite_Debug]
export interface WASDictionaryToConsole extends HasSingle_DICT, ComfyNode<WASDictionaryToConsole_input> {
    nameInComfy: "Dictionary to Console"
    DICT: Slot<'DICT', 0>,
}
export interface WASDictionaryToConsole_input {
    dictionary: _DICT
    /** default="Dictionary Output" */
    label?: _STRING
}

// Diffusers Model Loader [WAS Suite_Loaders_Advanced]
export interface WASDiffusersModelLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, HasSingle_STRING, ComfyNode<WASDiffusersModelLoader_input> {
    nameInComfy: "Diffusers Model Loader"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    VAE: Slot<'VAE', 2>,
    STRING: Slot<'STRING', 3>,
}
export interface WASDiffusersModelLoader_input {
    model_path: Enum_CLIPLoader_Clip_name
}

// Diffusers Hub Model Down-Loader [WAS Suite_Loaders_Advanced]
export interface WASDiffusersHubModelDownLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, HasSingle_STRING, ComfyNode<WASDiffusersHubModelDownLoader_input> {
    nameInComfy: "Diffusers Hub Model Down-Loader"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    VAE: Slot<'VAE', 2>,
    STRING: Slot<'STRING', 3>,
}
export interface WASDiffusersHubModelDownLoader_input {
    /** */
    repo_id: _STRING
    /** default="None" */
    revision?: _STRING
}

// Export API [WAS Suite_Debug]
export interface WASExportAPI extends ComfyNode<WASExportAPI_input> {
    nameInComfy: "Export API"
}
export interface WASExportAPI_input {
    save_prompt_api: Enum_WASExportAPI_Save_prompt_api
    /** default="./ComfyUI/output/" */
    output_path?: _STRING
    /** default="ComfyUI_Prompt" */
    filename_prefix?: _STRING
    /** default="_" */
    filename_delimiter?: _STRING
    /** default=4 min=9 max=9 step=1 */
    filename_number_padding?: _INT
}

// Latent Input Switch [WAS Suite_Logic]
export interface WASLatentInputSwitch extends HasSingle_LATENT, ComfyNode<WASLatentInputSwitch_input> {
    nameInComfy: "Latent Input Switch"
    LATENT: Slot<'LATENT', 0>,
}
export interface WASLatentInputSwitch_input {
    latent_a: _LATENT
    latent_b: _LATENT
    boolean_number: _NUMBER
}

// Load Cache [WAS Suite_IO]
export interface WASLoadCache extends HasSingle_LATENT, HasSingle_IMAGE, HasSingle_CONDITIONING, ComfyNode<WASLoadCache_input> {
    nameInComfy: "Load Cache"
    LATENT: Slot<'LATENT', 0>,
    IMAGE: Slot<'IMAGE', 1>,
    CONDITIONING: Slot<'CONDITIONING', 2>,
}
export interface WASLoadCache_input {
    /** default="" */
    latent_path?: _STRING
    /** default="" */
    image_path?: _STRING
    /** default="" */
    conditioning_path?: _STRING
}

// Logic Boolean [WAS Suite_Logic]
export interface WASLogicBoolean extends HasSingle_NUMBER, HasSingle_INT, ComfyNode<WASLogicBoolean_input> {
    nameInComfy: "Logic Boolean"
    NUMBER: Slot<'NUMBER', 0>,
    INT: Slot<'INT', 1>,
}
export interface WASLogicBoolean_input {
    /** default=1 min=1 max=1 step=1 */
    boolean_number?: _INT
}

// Lora Loader [WAS Suite_Loaders]
export interface WASLoraLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_STRING, ComfyNode<WASLoraLoader_input> {
    nameInComfy: "Lora Loader"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    STRING: Slot<'STRING', 2>,
}
export interface WASLoraLoader_input {
    model: _MODEL
    clip: _CLIP
    lora_name: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    strength_model?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    strength_clip?: _FLOAT
}

// Image SSAO (Ambient Occlusion) [WAS Suite_Image_Filter]
export interface WASImageSSAOAmbientOcclusion extends ComfyNode<WASImageSSAOAmbientOcclusion_input> {
    nameInComfy: "Image SSAO (Ambient Occlusion)"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_1: Slot<'IMAGE', 1>,
    IMAGE_2: Slot<'IMAGE', 2>,
}
export interface WASImageSSAOAmbientOcclusion_input {
    images: _IMAGE
    depth_images: _IMAGE
    /** default=1 min=5 max=5 step=0.01 */
    strength?: _FLOAT
    /** default=30 min=1024 max=1024 step=0.01 */
    radius?: _FLOAT
    /** default=2.5 min=1024 max=1024 step=0.01 */
    ao_blur?: _FLOAT
    /** default=25 min=255 max=255 step=1 */
    specular_threshold?: _INT
    enable_specular_masking: Enum_XYPlot_XY_flip
    /** default=1 min=512 max=512 step=1 */
    tile_size?: _INT
}

// Image SSDO (Direct Occlusion) [WAS Suite_Image_Filter]
export interface WASImageSSDODirectOcclusion extends ComfyNode<WASImageSSDODirectOcclusion_input> {
    nameInComfy: "Image SSDO (Direct Occlusion)"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_1: Slot<'IMAGE', 1>,
    IMAGE_2: Slot<'IMAGE', 2>,
    IMAGE_3: Slot<'IMAGE', 3>,
}
export interface WASImageSSDODirectOcclusion_input {
    images: _IMAGE
    depth_images: _IMAGE
    /** default=1 min=5 max=5 step=0.01 */
    strength?: _FLOAT
    /** default=30 min=1024 max=1024 step=0.01 */
    radius?: _FLOAT
    /** default=128 min=255 max=255 step=1 */
    specular_threshold?: _INT
    colored_occlusion: Enum_XYPlot_XY_flip
}

// Image Analyze [WAS Suite_Image_Analyze]
export interface WASImageAnalyze extends HasSingle_IMAGE, ComfyNode<WASImageAnalyze_input> {
    nameInComfy: "Image Analyze"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageAnalyze_input {
    image: _IMAGE
    mode: Enum_WASImageAnalyze_Mode
}

// Image Aspect Ratio [WAS Suite_Logic]
export interface WASImageAspectRatio extends HasSingle_FLOAT, ComfyNode<WASImageAspectRatio_input> {
    nameInComfy: "Image Aspect Ratio"
    NUMBER: Slot<'NUMBER', 0>,
    FLOAT: Slot<'FLOAT', 1>,
    NUMBER_1: Slot<'NUMBER', 2>,
    STRING: Slot<'STRING', 3>,
    STRING_1: Slot<'STRING', 4>,
}
export interface WASImageAspectRatio_input {
    image?: _IMAGE
    width?: _NUMBER
    height?: _NUMBER
}

// Image Batch [WAS Suite_Image]
export interface WASImageBatch extends HasSingle_IMAGE, ComfyNode<WASImageBatch_input> {
    nameInComfy: "Image Batch"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageBatch_input {
    images_a?: _IMAGE
    images_b?: _IMAGE
    images_c?: _IMAGE
    images_d?: _IMAGE
}

// Image Blank [WAS Suite_Image]
export interface WASImageBlank extends HasSingle_IMAGE, ComfyNode<WASImageBlank_input> {
    nameInComfy: "Image Blank"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageBlank_input {
    /** default=512 min=4096 max=4096 step=1 */
    width?: _INT
    /** default=512 min=4096 max=4096 step=1 */
    height?: _INT
    /** default=255 min=255 max=255 step=1 */
    red?: _INT
    /** default=255 min=255 max=255 step=1 */
    green?: _INT
    /** default=255 min=255 max=255 step=1 */
    blue?: _INT
}

// Image Blend by Mask [WAS Suite_Image]
export interface WASImageBlendByMask extends HasSingle_IMAGE, ComfyNode<WASImageBlendByMask_input> {
    nameInComfy: "Image Blend by Mask"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageBlendByMask_input {
    image_a: _IMAGE
    image_b: _IMAGE
    mask: _IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    blend_percentage?: _FLOAT
}

// Image Blend [WAS Suite_Image]
export interface WASImageBlend extends HasSingle_IMAGE, ComfyNode<WASImageBlend_input> {
    nameInComfy: "Image Blend"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageBlend_input {
    image_a: _IMAGE
    image_b: _IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    blend_percentage?: _FLOAT
}

// Image Blending Mode [WAS Suite_Image]
export interface WASImageBlendingMode extends HasSingle_IMAGE, ComfyNode<WASImageBlendingMode_input> {
    nameInComfy: "Image Blending Mode"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageBlendingMode_input {
    image_a: _IMAGE
    image_b: _IMAGE
    mode: Enum_WASImageBlendingMode_Mode
    /** default=1 min=1 max=1 step=0.01 */
    blend_percentage?: _FLOAT
}

// Image Bloom Filter [WAS Suite_Image_Filter]
export interface WASImageBloomFilter extends HasSingle_IMAGE, ComfyNode<WASImageBloomFilter_input> {
    nameInComfy: "Image Bloom Filter"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageBloomFilter_input {
    image: _IMAGE
    /** default=10 min=1024 max=1024 step=0.1 */
    radius?: _FLOAT
    /** default=1 min=1 max=1 step=0.1 */
    intensity?: _FLOAT
}

// Image Canny Filter [WAS Suite_Image_Filter]
export interface WASImageCannyFilter extends HasSingle_IMAGE, ComfyNode<WASImageCannyFilter_input> {
    nameInComfy: "Image Canny Filter"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageCannyFilter_input {
    images: _IMAGE
    enable_threshold: Enum_WASCreateGridImage_Include_subfolders
    /** default=0 min=1 max=1 step=0.01 */
    threshold_low?: _FLOAT
    /** default=1 min=1 max=1 step=0.01 */
    threshold_high?: _FLOAT
}

// Image Chromatic Aberration [WAS Suite_Image_Filter]
export interface WASImageChromaticAberration extends HasSingle_IMAGE, ComfyNode<WASImageChromaticAberration_input> {
    nameInComfy: "Image Chromatic Aberration"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageChromaticAberration_input {
    image: _IMAGE
    /** default=2 min=255 max=255 step=1 */
    red_offset?: _INT
    /** default=-1 min=255 max=255 step=1 */
    green_offset?: _INT
    /** default=1 min=255 max=255 step=1 */
    blue_offset?: _INT
    /** default=0.5 min=1 max=1 step=0.01 */
    intensity?: _FLOAT
    /** default=12 min=1024 max=1024 step=1 */
    fade_radius?: _INT
}

// Image Color Palette [WAS Suite_Image_Analyze]
export interface WASImageColorPalette extends HasSingle_IMAGE, HasSingle_LIST, ComfyNode<WASImageColorPalette_input> {
    nameInComfy: "Image Color Palette"
    IMAGE: Slot<'IMAGE', 0>,
    LIST: Slot<'LIST', 1>,
}
export interface WASImageColorPalette_input {
    image: _IMAGE
    /** default=16 min=256 max=256 step=1 */
    colors?: _INT
    mode: Enum_WASImageColorPalette_Mode
}

// Image Crop Face [WAS Suite_Image_Process]
export interface WASImageCropFace extends HasSingle_IMAGE, HasSingle_CROP_DATA, ComfyNode<WASImageCropFace_input> {
    nameInComfy: "Image Crop Face"
    IMAGE: Slot<'IMAGE', 0>,
    CROP_DATA: Slot<'CROP_DATA', 1>,
}
export interface WASImageCropFace_input {
    image: _IMAGE
    /** default=0.25 min=2 max=2 step=0.01 */
    crop_padding_factor?: _FLOAT
    cascade_xml: Enum_WASImageCropFace_Cascade_xml
}

// Image Crop Location [WAS Suite_Image_Process]
export interface WASImageCropLocation extends HasSingle_IMAGE, HasSingle_CROP_DATA, ComfyNode<WASImageCropLocation_input> {
    nameInComfy: "Image Crop Location"
    IMAGE: Slot<'IMAGE', 0>,
    CROP_DATA: Slot<'CROP_DATA', 1>,
}
export interface WASImageCropLocation_input {
    image: _IMAGE
    /** default=0 min=10000000 max=10000000 step=1 */
    top?: _INT
    /** default=0 min=10000000 max=10000000 step=1 */
    left?: _INT
    /** default=256 min=10000000 max=10000000 step=1 */
    right?: _INT
    /** default=256 min=10000000 max=10000000 step=1 */
    bottom?: _INT
}

// Image Crop Square Location [WAS Suite_Image_Process]
export interface WASImageCropSquareLocation extends HasSingle_IMAGE, HasSingle_CROP_DATA, ComfyNode<WASImageCropSquareLocation_input> {
    nameInComfy: "Image Crop Square Location"
    IMAGE: Slot<'IMAGE', 0>,
    CROP_DATA: Slot<'CROP_DATA', 1>,
}
export interface WASImageCropSquareLocation_input {
    image: _IMAGE
    /** default=0 min=24576 max=24576 step=1 */
    x?: _INT
    /** default=0 min=24576 max=24576 step=1 */
    y?: _INT
    /** default=256 min=4096 max=4096 step=1 */
    size?: _INT
}

// Image Displacement Warp [WAS Suite_Image_Transform]
export interface WASImageDisplacementWarp extends HasSingle_IMAGE, ComfyNode<WASImageDisplacementWarp_input> {
    nameInComfy: "Image Displacement Warp"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageDisplacementWarp_input {
    images: _IMAGE
    displacement_maps: _IMAGE
    /** default=25 min=4096 max=4096 step=0.1 */
    amplitude?: _FLOAT
}

// Image Lucy Sharpen [WAS Suite_Image_Filter]
export interface WASImageLucySharpen extends HasSingle_IMAGE, ComfyNode<WASImageLucySharpen_input> {
    nameInComfy: "Image Lucy Sharpen"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageLucySharpen_input {
    images: _IMAGE
    /** default=2 min=12 max=12 step=1 */
    iterations?: _INT
    /** default=3 min=16 max=16 step=1 */
    kernel_size?: _INT
}

// Image Paste Face [WAS Suite_Image_Process]
export interface WASImagePasteFace extends ComfyNode<WASImagePasteFace_input> {
    nameInComfy: "Image Paste Face"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_1: Slot<'IMAGE', 1>,
}
export interface WASImagePasteFace_input {
    image: _IMAGE
    crop_image: _IMAGE
    crop_data: _CROP_DATA
    /** default=0.25 min=1 max=1 step=0.01 */
    crop_blending?: _FLOAT
    /** default=0 min=3 max=3 step=1 */
    crop_sharpening?: _INT
}

// Image Paste Crop [WAS Suite_Image_Process]
export interface WASImagePasteCrop extends ComfyNode<WASImagePasteCrop_input> {
    nameInComfy: "Image Paste Crop"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_1: Slot<'IMAGE', 1>,
}
export interface WASImagePasteCrop_input {
    image: _IMAGE
    crop_image: _IMAGE
    crop_data: _CROP_DATA
    /** default=0.25 min=1 max=1 step=0.01 */
    crop_blending?: _FLOAT
    /** default=0 min=3 max=3 step=1 */
    crop_sharpening?: _INT
}

// Image Paste Crop by Location [WAS Suite_Image_Process]
export interface WASImagePasteCropByLocation extends ComfyNode<WASImagePasteCropByLocation_input> {
    nameInComfy: "Image Paste Crop by Location"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_1: Slot<'IMAGE', 1>,
}
export interface WASImagePasteCropByLocation_input {
    image: _IMAGE
    crop_image: _IMAGE
    /** default=0 min=10000000 max=10000000 step=1 */
    top?: _INT
    /** default=0 min=10000000 max=10000000 step=1 */
    left?: _INT
    /** default=256 min=10000000 max=10000000 step=1 */
    right?: _INT
    /** default=256 min=10000000 max=10000000 step=1 */
    bottom?: _INT
    /** default=0.25 min=1 max=1 step=0.01 */
    crop_blending?: _FLOAT
    /** default=0 min=3 max=3 step=1 */
    crop_sharpening?: _INT
}

// Image Pixelate [WAS Suite_Image_Process]
export interface WASImagePixelate extends HasSingle_IMAGE, ComfyNode<WASImagePixelate_input> {
    nameInComfy: "Image Pixelate"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImagePixelate_input {
    images: _IMAGE
    /** default=164 min=480 max=480 step=1 */
    pixelation_size?: _FLOAT
    /** default=16 min=256 max=256 step=1 */
    num_colors?: _FLOAT
    init_mode: Enum_WASImagePixelate_Init_mode
    /** default=100 min=256 max=256 step=1 */
    max_iterations?: _FLOAT
    dither: Enum_XYPlot_XY_flip
    dither_mode: Enum_WASImagePixelate_Dither_mode
    /** */
    color_palettes?: _LIST
    color_palette_mode?: Enum_WASImagePixelate_Color_palette_mode
    reverse_palette?: Enum_XYPlot_XY_flip
}

// Image Power Noise [WAS Suite_Image_Generate_Noise]
export interface WASImagePowerNoise extends HasSingle_IMAGE, ComfyNode<WASImagePowerNoise_input> {
    nameInComfy: "Image Power Noise"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImagePowerNoise_input {
    /** default=512 min=4096 max=4096 step=1 */
    width?: _INT
    /** default=512 min=4096 max=4096 step=1 */
    height?: _INT
    /** default=0.5 min=10 max=10 step=0.01 */
    frequency?: _FLOAT
    /** default=0.5 min=10 max=10 step=0.01 */
    attenuation?: _FLOAT
    noise_type: Enum_WASImagePowerNoise_Noise_type
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
}

// Image Dragan Photography Filter [WAS Suite_Image_Filter]
export interface WASImageDraganPhotographyFilter extends HasSingle_IMAGE, ComfyNode<WASImageDraganPhotographyFilter_input> {
    nameInComfy: "Image Dragan Photography Filter"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageDraganPhotographyFilter_input {
    image: _IMAGE
    /** default=1 min=16 max=16 step=0.01 */
    saturation?: _FLOAT
    /** default=1 min=16 max=16 step=0.01 */
    contrast?: _FLOAT
    /** default=1 min=16 max=16 step=0.01 */
    brightness?: _FLOAT
    /** default=1 min=6 max=6 step=0.01 */
    sharpness?: _FLOAT
    /** default=6 min=255 max=255 step=0.01 */
    highpass_radius?: _FLOAT
    /** default=1 min=6 max=6 step=1 */
    highpass_samples?: _INT
    /** default=1 min=3 max=3 step=0.01 */
    highpass_strength?: _FLOAT
    colorize: Enum_WASCreateGridImage_Include_subfolders
}

// Image Edge Detection Filter [WAS Suite_Image_Filter]
export interface WASImageEdgeDetectionFilter extends HasSingle_IMAGE, ComfyNode<WASImageEdgeDetectionFilter_input> {
    nameInComfy: "Image Edge Detection Filter"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageEdgeDetectionFilter_input {
    image: _IMAGE
    mode: Enum_WASImageEdgeDetectionFilter_Mode
}

// Image Film Grain [WAS Suite_Image_Filter]
export interface WASImageFilmGrain extends HasSingle_IMAGE, ComfyNode<WASImageFilmGrain_input> {
    nameInComfy: "Image Film Grain"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageFilmGrain_input {
    image: _IMAGE
    /** default=1 min=1 max=1 step=0.01 */
    density?: _FLOAT
    /** default=1 min=1 max=1 step=0.01 */
    intensity?: _FLOAT
    /** default=1 min=255 max=255 step=0.01 */
    highlights?: _FLOAT
    /** default=4 min=8 max=8 step=1 */
    supersample_factor?: _INT
}

// Image Filter Adjustments [WAS Suite_Image_Filter]
export interface WASImageFilterAdjustments extends HasSingle_IMAGE, ComfyNode<WASImageFilterAdjustments_input> {
    nameInComfy: "Image Filter Adjustments"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageFilterAdjustments_input {
    image: _IMAGE
    /** default=0 min=1 max=1 step=0.01 */
    brightness?: _FLOAT
    /** default=1 min=2 max=2 step=0.01 */
    contrast?: _FLOAT
    /** default=1 min=5 max=5 step=0.01 */
    saturation?: _FLOAT
    /** default=1 min=5 max=5 step=0.01 */
    sharpness?: _FLOAT
    /** default=0 min=16 max=16 step=1 */
    blur?: _INT
    /** default=0 min=1024 max=1024 step=0.1 */
    gaussian_blur?: _FLOAT
    /** default=0 min=1 max=1 step=0.01 */
    edge_enhance?: _FLOAT
    detail_enhance: Enum_WASCreateGridImage_Include_subfolders
}

// Image Flip [WAS Suite_Image_Transform]
export interface WASImageFlip extends HasSingle_IMAGE, ComfyNode<WASImageFlip_input> {
    nameInComfy: "Image Flip"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageFlip_input {
    images: _IMAGE
    mode: Enum_WASImageFlip_Mode
}

// Image Gradient Map [WAS Suite_Image_Filter]
export interface WASImageGradientMap extends HasSingle_IMAGE, ComfyNode<WASImageGradientMap_input> {
    nameInComfy: "Image Gradient Map"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageGradientMap_input {
    image: _IMAGE
    gradient_image: _IMAGE
    flip_left_right: Enum_WASCreateGridImage_Include_subfolders
}

// Image Generate Gradient [WAS Suite_Image_Generate]
export interface WASImageGenerateGradient extends HasSingle_IMAGE, ComfyNode<WASImageGenerateGradient_input> {
    nameInComfy: "Image Generate Gradient"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageGenerateGradient_input {
    /** default=512 min=4096 max=4096 step=1 */
    width?: _INT
    /** default=512 min=4096 max=4096 step=1 */
    height?: _INT
    direction: Enum_WASImageFlip_Mode
    /** default=0 min=255 max=255 step=1 */
    tolerance?: _INT
    /** default="0:255,0,0\n25:255,255,255\n50:0,255,0\n75:0,0,255" */
    gradient_stops?: _STRING
}

// Image High Pass Filter [WAS Suite_Image_Filter]
export interface WASImageHighPassFilter extends HasSingle_IMAGE, ComfyNode<WASImageHighPassFilter_input> {
    nameInComfy: "Image High Pass Filter"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageHighPassFilter_input {
    images: _IMAGE
    /** default=10 min=500 max=500 step=1 */
    radius?: _INT
    /** default=1.5 min=255 max=255 step=0.1 */
    strength?: _FLOAT
    color_output: Enum_WASCreateGridImage_Include_subfolders
    neutral_background: Enum_WASCreateGridImage_Include_subfolders
}

// Image History Loader [WAS Suite_History]
export interface WASImageHistoryLoader extends HasSingle_IMAGE, HasSingle_STRING, ComfyNode<WASImageHistoryLoader_input> {
    nameInComfy: "Image History Loader"
    IMAGE: Slot<'IMAGE', 0>,
    STRING: Slot<'STRING', 1>,
}
export interface WASImageHistoryLoader_input {
    image: Enum_WASImageHistoryLoader_Image
}

// Image Input Switch [WAS Suite_Logic]
export interface WASImageInputSwitch extends HasSingle_IMAGE, ComfyNode<WASImageInputSwitch_input> {
    nameInComfy: "Image Input Switch"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageInputSwitch_input {
    image_a: _IMAGE
    image_b: _IMAGE
    boolean_number: _NUMBER
}

// Image Levels Adjustment [WAS Suite_Image_Adjustment]
export interface WASImageLevelsAdjustment extends HasSingle_IMAGE, ComfyNode<WASImageLevelsAdjustment_input> {
    nameInComfy: "Image Levels Adjustment"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageLevelsAdjustment_input {
    image: _IMAGE
    /** default=0 min=255 max=255 step=0.1 */
    black_level?: _FLOAT
    /** default=127.5 min=255 max=255 step=0.1 */
    mid_level?: _FLOAT
    /** default=255 min=255 max=255 step=0.1 */
    white_level?: _FLOAT
}

// Image Load [WAS Suite_IO]
export interface WASImageLoad extends HasSingle_IMAGE, HasSingle_MASK, HasSingle_STRING, ComfyNode<WASImageLoad_input> {
    nameInComfy: "Image Load"
    IMAGE: Slot<'IMAGE', 0>,
    MASK: Slot<'MASK', 1>,
    STRING: Slot<'STRING', 2>,
}
export interface WASImageLoad_input {
    /** default="./ComfyUI/input/example.png" */
    image_path?: _STRING
    RGBA: Enum_WASCreateGridImage_Include_subfolders
    filename_text_extension?: Enum_WASCreateGridImage_Include_subfolders
}

// Image Median Filter [WAS Suite_Image_Filter]
export interface WASImageMedianFilter extends HasSingle_IMAGE, ComfyNode<WASImageMedianFilter_input> {
    nameInComfy: "Image Median Filter"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageMedianFilter_input {
    image: _IMAGE
    /** default=2 min=255 max=255 step=1 */
    diameter?: _INT
    /** default=10 min=255 max=255 step=0.1 */
    sigma_color?: _FLOAT
    /** default=10 min=255 max=255 step=0.1 */
    sigma_space?: _FLOAT
}

// Image Mix RGB Channels [WAS Suite_Image_Process]
export interface WASImageMixRGBChannels extends HasSingle_IMAGE, ComfyNode<WASImageMixRGBChannels_input> {
    nameInComfy: "Image Mix RGB Channels"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageMixRGBChannels_input {
    red_channel: _IMAGE
    green_channel: _IMAGE
    blue_channel: _IMAGE
}

// Image Monitor Effects Filter [WAS Suite_Image_Filter]
export interface WASImageMonitorEffectsFilter extends HasSingle_IMAGE, ComfyNode<WASImageMonitorEffectsFilter_input> {
    nameInComfy: "Image Monitor Effects Filter"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageMonitorEffectsFilter_input {
    image: _IMAGE
    mode: Enum_WASImageMonitorEffectsFilter_Mode
    /** default=5 min=255 max=255 step=1 */
    amplitude?: _INT
    /** default=10 min=255 max=255 step=1 */
    offset?: _INT
}

// Image Nova Filter [WAS Suite_Image_Filter]
export interface WASImageNovaFilter extends HasSingle_IMAGE, ComfyNode<WASImageNovaFilter_input> {
    nameInComfy: "Image Nova Filter"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageNovaFilter_input {
    image: _IMAGE
    /** default=0.1 min=1 max=1 step=0.001 */
    amplitude?: _FLOAT
    /** default=3.14 min=100 max=100 step=0.001 */
    frequency?: _FLOAT
}

// Image Padding [WAS Suite_Image_Transform]
export interface WASImagePadding extends ComfyNode<WASImagePadding_input> {
    nameInComfy: "Image Padding"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_1: Slot<'IMAGE', 1>,
}
export interface WASImagePadding_input {
    image: _IMAGE
    /** default=120 min=2048 max=2048 step=1 */
    feathering?: _INT
    feather_second_pass: Enum_WASCreateGridImage_Include_subfolders
    /** default=512 min=48000 max=48000 step=1 */
    left_padding?: _INT
    /** default=512 min=48000 max=48000 step=1 */
    right_padding?: _INT
    /** default=512 min=48000 max=48000 step=1 */
    top_padding?: _INT
    /** default=512 min=48000 max=48000 step=1 */
    bottom_padding?: _INT
}

// Image Perlin Noise [WAS Suite_Image_Generate_Noise]
export interface WASImagePerlinNoise extends HasSingle_IMAGE, ComfyNode<WASImagePerlinNoise_input> {
    nameInComfy: "Image Perlin Noise"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImagePerlinNoise_input {
    /** default=512 min=2048 max=2048 step=1 */
    width?: _INT
    /** default=512 min=2048 max=2048 step=1 */
    height?: _INT
    /** default=100 min=2048 max=2048 step=1 */
    scale?: _INT
    /** default=4 min=8 max=8 step=1 */
    octaves?: _INT
    /** default=0.5 min=100 max=100 step=0.01 */
    persistence?: _FLOAT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
}

// Image Rembg (Remove Background) [WAS Suite_Image_AI]
export interface WASImageRembgRemoveBackground extends HasSingle_IMAGE, ComfyNode<WASImageRembgRemoveBackground_input> {
    nameInComfy: "Image Rembg (Remove Background)"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageRembgRemoveBackground_input {
    images: _IMAGE
    /** default=true */
    transparency?: _BOOLEAN
    model: Enum_WASImageRembgRemoveBackground_Model
    /** default=false */
    post_processing?: _BOOLEAN
    /** default=false */
    only_mask?: _BOOLEAN
    /** default=false */
    alpha_matting?: _BOOLEAN
    /** default=240 min=255 max=255 */
    alpha_matting_foreground_threshold?: _INT
    /** default=10 min=255 max=255 */
    alpha_matting_background_threshold?: _INT
    /** default=10 min=255 max=255 */
    alpha_matting_erode_size?: _INT
    background_color: Enum_WASImageRembgRemoveBackground_Background_color
}

// Image Perlin Power Fractal [WAS Suite_Image_Generate_Noise]
export interface WASImagePerlinPowerFractal extends HasSingle_IMAGE, ComfyNode<WASImagePerlinPowerFractal_input> {
    nameInComfy: "Image Perlin Power Fractal"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImagePerlinPowerFractal_input {
    /** default=512 min=8192 max=8192 step=1 */
    width?: _INT
    /** default=512 min=8192 max=8192 step=1 */
    height?: _INT
    /** default=100 min=2048 max=2048 step=1 */
    scale?: _INT
    /** default=4 min=8 max=8 step=1 */
    octaves?: _INT
    /** default=0.5 min=100 max=100 step=0.01 */
    persistence?: _FLOAT
    /** default=2 min=100 max=100 step=0.01 */
    lacunarity?: _FLOAT
    /** default=2 min=100 max=100 step=0.01 */
    exponent?: _FLOAT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
}

// Image Remove Background (Alpha) [WAS Suite_Image_Process]
export interface WASImageRemoveBackgroundAlpha extends HasSingle_IMAGE, ComfyNode<WASImageRemoveBackgroundAlpha_input> {
    nameInComfy: "Image Remove Background (Alpha)"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageRemoveBackgroundAlpha_input {
    images: _IMAGE
    mode: Enum_WASImageRemoveBackgroundAlpha_Mode
    /** default=127 min=255 max=255 step=1 */
    threshold?: _INT
    /** default=2 min=24 max=24 step=1 */
    threshold_tolerance?: _INT
}

// Image Remove Color [WAS Suite_Image_Process]
export interface WASImageRemoveColor extends HasSingle_IMAGE, ComfyNode<WASImageRemoveColor_input> {
    nameInComfy: "Image Remove Color"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageRemoveColor_input {
    image: _IMAGE
    /** default=255 min=255 max=255 step=1 */
    target_red?: _INT
    /** default=255 min=255 max=255 step=1 */
    target_green?: _INT
    /** default=255 min=255 max=255 step=1 */
    target_blue?: _INT
    /** default=255 min=255 max=255 step=1 */
    replace_red?: _INT
    /** default=255 min=255 max=255 step=1 */
    replace_green?: _INT
    /** default=255 min=255 max=255 step=1 */
    replace_blue?: _INT
    /** default=10 min=255 max=255 step=1 */
    clip_threshold?: _INT
}

// Image Resize [WAS Suite_Image_Transform]
export interface WASImageResize extends HasSingle_IMAGE, ComfyNode<WASImageResize_input> {
    nameInComfy: "Image Resize"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageResize_input {
    image: _IMAGE
    mode: Enum_WASImageResize_Mode
    supersample: Enum_WASCreateGridImage_Include_subfolders
    resampling: Enum_WASImageResize_Resampling
    /** default=2 min=16 max=16 step=0.01 */
    rescale_factor?: _FLOAT
    /** default=1024 min=48000 max=48000 step=1 */
    resize_width?: _INT
    /** default=1536 min=48000 max=48000 step=1 */
    resize_height?: _INT
}

// Image Rotate [WAS Suite_Image_Transform]
export interface WASImageRotate extends HasSingle_IMAGE, ComfyNode<WASImageRotate_input> {
    nameInComfy: "Image Rotate"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageRotate_input {
    images: _IMAGE
    mode: Enum_WASImageRotate_Mode
    /** default=0 min=360 max=360 step=90 */
    rotation?: _INT
    sampler: Enum_WASImageRotate_Sampler
}

// Image Rotate Hue [WAS Suite_Image_Adjustment]
export interface WASImageRotateHue extends HasSingle_IMAGE, ComfyNode<WASImageRotateHue_input> {
    nameInComfy: "Image Rotate Hue"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageRotateHue_input {
    image: _IMAGE
    /** default=0 min=1 max=1 step=0.001 */
    hue_shift?: _FLOAT
}

// Image Save [WAS Suite_IO]
export interface WASImageSave extends ComfyNode<WASImageSave_input> {
    nameInComfy: "Image Save"
}
export interface WASImageSave_input {
    images: _IMAGE
    /** default="[time(%Y-%m-%d)]" */
    output_path?: _STRING
    /** default="ComfyUI" */
    filename_prefix?: _STRING
    /** default="_" */
    filename_delimiter?: _STRING
    /** default=4 min=9 max=9 step=1 */
    filename_number_padding?: _INT
    filename_number_start: Enum_WASCreateGridImage_Include_subfolders
    extension: Enum_WASImageSave_Extension
    /** default=100 min=100 max=100 step=1 */
    quality?: _INT
    lossless_webp: Enum_WASCreateGridImage_Include_subfolders
    overwrite_mode: Enum_WASImageSave_Overwrite_mode
    show_history: Enum_WASCreateGridImage_Include_subfolders
    show_history_by_prefix: Enum_WASCreateGridImage_Include_subfolders
    embed_workflow: Enum_WASCreateGridImage_Include_subfolders
    show_previews: Enum_WASCreateGridImage_Include_subfolders
}

// Image Seamless Texture [WAS Suite_Image_Process]
export interface WASImageSeamlessTexture extends HasSingle_IMAGE, ComfyNode<WASImageSeamlessTexture_input> {
    nameInComfy: "Image Seamless Texture"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageSeamlessTexture_input {
    images: _IMAGE
    /** default=0.4 min=1 max=1 step=0.01 */
    blending?: _FLOAT
    tiled: Enum_WASCreateGridImage_Include_subfolders
    /** default=2 min=6 max=6 step=2 */
    tiles?: _INT
}

// Image Select Channel [WAS Suite_Image_Process]
export interface WASImageSelectChannel extends HasSingle_IMAGE, ComfyNode<WASImageSelectChannel_input> {
    nameInComfy: "Image Select Channel"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageSelectChannel_input {
    image: _IMAGE
    channel: Enum_ImageToMask_Channel
}

// Image Select Color [WAS Suite_Image_Process]
export interface WASImageSelectColor extends HasSingle_IMAGE, ComfyNode<WASImageSelectColor_input> {
    nameInComfy: "Image Select Color"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageSelectColor_input {
    image: _IMAGE
    /** default=255 min=255 max=255 step=0.1 */
    red?: _INT
    /** default=255 min=255 max=255 step=0.1 */
    green?: _INT
    /** default=255 min=255 max=255 step=0.1 */
    blue?: _INT
    /** default=10 min=255 max=255 step=1 */
    variance?: _INT
}

// Image Shadows and Highlights [WAS Suite_Image_Adjustment]
export interface WASImageShadowsAndHighlights extends ComfyNode<WASImageShadowsAndHighlights_input> {
    nameInComfy: "Image Shadows and Highlights"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_1: Slot<'IMAGE', 1>,
    IMAGE_2: Slot<'IMAGE', 2>,
}
export interface WASImageShadowsAndHighlights_input {
    image: _IMAGE
    /** default=75 min=255 max=255 step=0.1 */
    shadow_threshold?: _FLOAT
    /** default=1.5 min=12 max=12 step=0.1 */
    shadow_factor?: _FLOAT
    /** default=0.25 min=255 max=255 step=0.1 */
    shadow_smoothing?: _FLOAT
    /** default=175 min=255 max=255 step=0.1 */
    highlight_threshold?: _FLOAT
    /** default=0.5 min=12 max=12 step=0.1 */
    highlight_factor?: _FLOAT
    /** default=0.25 min=255 max=255 step=0.1 */
    highlight_smoothing?: _FLOAT
    /** default=0 min=255 max=255 step=0.1 */
    simplify_isolation?: _FLOAT
}

// Image Size to Number [WAS Suite_Number_Operations]
export interface WASImageSizeToNumber extends ComfyNode<WASImageSizeToNumber_input> {
    nameInComfy: "Image Size to Number"
    NUMBER: Slot<'NUMBER', 0>,
    NUMBER_1: Slot<'NUMBER', 1>,
    FLOAT: Slot<'FLOAT', 2>,
    FLOAT_1: Slot<'FLOAT', 3>,
    INT: Slot<'INT', 4>,
    INT_1: Slot<'INT', 5>,
}
export interface WASImageSizeToNumber_input {
    image: _IMAGE
}

// Image Stitch [WAS Suite_Image_Transform]
export interface WASImageStitch extends HasSingle_IMAGE, ComfyNode<WASImageStitch_input> {
    nameInComfy: "Image Stitch"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageStitch_input {
    image_a: _IMAGE
    image_b: _IMAGE
    stitch: Enum_WASImageStitch_Stitch
    /** default=50 min=2048 max=2048 step=1 */
    feathering?: _INT
}

// Image Style Filter [WAS Suite_Image_Filter]
export interface WASImageStyleFilter extends HasSingle_IMAGE, ComfyNode<WASImageStyleFilter_input> {
    nameInComfy: "Image Style Filter"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageStyleFilter_input {
    image: _IMAGE
    style: Enum_WASImageStyleFilter_Style
}

// Image Threshold [WAS Suite_Image_Process]
export interface WASImageThreshold extends HasSingle_IMAGE, ComfyNode<WASImageThreshold_input> {
    nameInComfy: "Image Threshold"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageThreshold_input {
    image: _IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    threshold?: _FLOAT
}

// Image Tiled [WAS Suite_Image_Process]
export interface WASImageTiled extends HasSingle_IMAGE, ComfyNode<WASImageTiled_input> {
    nameInComfy: "Image Tiled"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageTiled_input {
    image: _IMAGE
    /** default=4 min=64 max=64 step=1 */
    num_tiles?: _INT
}

// Image Transpose [WAS Suite_Image_Transform]
export interface WASImageTranspose extends HasSingle_IMAGE, ComfyNode<WASImageTranspose_input> {
    nameInComfy: "Image Transpose"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageTranspose_input {
    image: _IMAGE
    image_overlay: _IMAGE
    /** default=512 min=48000 max=48000 step=1 */
    width?: _INT
    /** default=512 min=48000 max=48000 step=1 */
    height?: _INT
    /** default=0 min=48000 max=48000 step=1 */
    X?: _INT
    /** default=0 min=48000 max=48000 step=1 */
    Y?: _INT
    /** default=0 min=360 max=360 step=1 */
    rotation?: _INT
    /** default=0 min=4096 max=4096 step=1 */
    feathering?: _INT
}

// Image fDOF Filter [WAS Suite_Image_Filter]
export interface WASImageFDOFFilter extends HasSingle_IMAGE, ComfyNode<WASImageFDOFFilter_input> {
    nameInComfy: "Image fDOF Filter"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageFDOFFilter_input {
    image: _IMAGE
    depth: _IMAGE
    mode: Enum_WASImageFDOFFilter_Mode
    /** default=8 min=128 max=128 step=1 */
    radius?: _INT
    /** default=1 min=3 max=3 step=1 */
    samples?: _INT
}

// Image to Latent Mask [WAS Suite_Image_Masking]
export interface WASImageToLatentMask extends HasSingle_MASK, ComfyNode<WASImageToLatentMask_input> {
    nameInComfy: "Image to Latent Mask"
    MASK: Slot<'MASK', 0>,
}
export interface WASImageToLatentMask_input {
    images: _IMAGE
    channel: Enum_LoadImageMask_Channel
}

// Image to Noise [WAS Suite_Image_Generate_Noise]
export interface WASImageToNoise extends HasSingle_IMAGE, ComfyNode<WASImageToNoise_input> {
    nameInComfy: "Image to Noise"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageToNoise_input {
    images: _IMAGE
    /** default=16 min=256 max=256 step=2 */
    num_colors?: _INT
    /** default=0 min=20 max=20 step=1 */
    black_mix?: _INT
    /** default=0 min=1024 max=1024 step=0.1 */
    gaussian_mix?: _FLOAT
    /** default=1 min=2 max=2 step=0.01 */
    brightness?: _FLOAT
    output_mode: Enum_WASImageToNoise_Output_mode
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
}

// Image to Seed [WAS Suite_Image_Analyze]
export interface WASImageToSeed extends HasSingle_INT, ComfyNode<WASImageToSeed_input> {
    nameInComfy: "Image to Seed"
    INT: Slot<'INT', 0>,
}
export interface WASImageToSeed_input {
    images: _IMAGE
}

// Images to RGB [WAS Suite_Image]
export interface WASImagesToRGB extends HasSingle_IMAGE, ComfyNode<WASImagesToRGB_input> {
    nameInComfy: "Images to RGB"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImagesToRGB_input {
    images: _IMAGE
}

// Images to Linear [WAS Suite_Image]
export interface WASImagesToLinear extends HasSingle_IMAGE, ComfyNode<WASImagesToLinear_input> {
    nameInComfy: "Images to Linear"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImagesToLinear_input {
    images: _IMAGE
}

// Integer place counter [WAS Suite_Integer]
export interface WASIntegerPlaceCounter extends HasSingle_INT, ComfyNode<WASIntegerPlaceCounter_input> {
    nameInComfy: "Integer place counter"
    INT: Slot<'INT', 0>,
}
export interface WASIntegerPlaceCounter_input {
    /** default=0 min=10000000 max=10000000 step=1 */
    int_input?: _INT
}

// Image Voronoi Noise Filter [WAS Suite_Image_Generate_Noise]
export interface WASImageVoronoiNoiseFilter extends HasSingle_IMAGE, ComfyNode<WASImageVoronoiNoiseFilter_input> {
    nameInComfy: "Image Voronoi Noise Filter"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASImageVoronoiNoiseFilter_input {
    /** default=512 min=4096 max=4096 step=1 */
    width?: _INT
    /** default=512 min=4096 max=4096 step=1 */
    height?: _INT
    /** default=50 min=256 max=256 step=2 */
    density?: _INT
    /** default=0 min=8 max=8 step=1 */
    modulator?: _INT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    flat?: Enum_XYPlot_XY_flip
    RGB_output?: Enum_XYPlot_XY_flip
}

// KSampler (WAS) [WAS Suite_Sampling]
export interface WASKSamplerWAS extends HasSingle_LATENT, ComfyNode<WASKSamplerWAS_input> {
    nameInComfy: "KSampler (WAS)"
    LATENT: Slot<'LATENT', 0>,
}
export interface WASKSamplerWAS_input {
    model: _MODEL
    seed: _SEED
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: _FLOAT
}

// KSampler Cycle [WAS Suite_Sampling]
export interface WASKSamplerCycle extends HasSingle_LATENT, ComfyNode<WASKSamplerCycle_input> {
    nameInComfy: "KSampler Cycle"
    LATENT: Slot<'LATENT', 0>,
}
export interface WASKSamplerCycle_input {
    model: _MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** default=20 min=10000 max=10000 */
    steps?: _INT
    /** default=8 min=100 max=100 */
    cfg?: _FLOAT
    sampler_name: Enum_KSampler_Sampler_name
    scheduler: Enum_KSampler_Scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
    tiled_vae: Enum_KSamplerAdvanced_Add_noise
    latent_upscale: Enum_WASKSamplerCycle_Latent_upscale
    /** default=2 min=8 max=8 step=0.1 */
    upscale_factor?: _FLOAT
    /** default=2 min=12 max=12 step=1 */
    upscale_cycles?: _INT
    /** default=1 min=1 max=1 step=0.01 */
    starting_denoise?: _FLOAT
    /** default=0.5 min=1 max=1 step=0.01 */
    cycle_denoise?: _FLOAT
    scale_denoise: Enum_KSamplerAdvanced_Add_noise
    scale_sampling: Enum_WASImageResize_Resampling
    vae: _VAE
    secondary_model?: _MODEL
    /** default=2 min=16 max=16 step=1 */
    secondary_start_cycle?: _INT
    upscale_model?: _UPSCALE_MODEL
    processor_model?: _UPSCALE_MODEL
    pos_additive?: _CONDITIONING
    neg_additive?: _CONDITIONING
    pos_add_mode?: Enum_WASKSamplerCycle_Pos_add_mode
    /** default=0.25 min=1 max=1 step=0.01 */
    pos_add_strength?: _FLOAT
    pos_add_strength_scaling?: Enum_KSamplerAdvanced_Add_noise
    /** default=2 min=10 max=10 step=0.01 */
    pos_add_strength_cutoff?: _FLOAT
    neg_add_mode?: Enum_WASKSamplerCycle_Pos_add_mode
    /** default=0.25 min=1 max=1 step=0.01 */
    neg_add_strength?: _FLOAT
    neg_add_strength_scaling?: Enum_KSamplerAdvanced_Add_noise
    /** default=2 min=10 max=10 step=0.01 */
    neg_add_strength_cutoff?: _FLOAT
    /** default=0 min=10 max=10 step=0.01 */
    sharpen_strength?: _FLOAT
    /** default=2 min=12 max=12 step=1 */
    sharpen_radius?: _INT
    steps_scaling?: Enum_KSamplerAdvanced_Add_noise
    steps_control?: Enum_WASKSamplerCycle_Pos_add_mode
    /** default=10 min=20 max=20 step=1 */
    steps_scaling_value?: _INT
    /** default=20 min=1000 max=1000 step=1 */
    steps_cutoff?: _INT
    /** default=0.25 min=1 max=1 step=0.01 */
    denoise_cutoff?: _FLOAT
}

// Latent Noise Injection [WAS Suite_Latent_Generate]
export interface WASLatentNoiseInjection extends HasSingle_LATENT, ComfyNode<WASLatentNoiseInjection_input> {
    nameInComfy: "Latent Noise Injection"
    LATENT: Slot<'LATENT', 0>,
}
export interface WASLatentNoiseInjection_input {
    samples: _LATENT
    /** default=0.1 min=1 max=1 step=0.01 */
    noise_std?: _FLOAT
}

// Latent Size to Number [WAS Suite_Number_Operations]
export interface WASLatentSizeToNumber extends ComfyNode<WASLatentSizeToNumber_input> {
    nameInComfy: "Latent Size to Number"
    NUMBER: Slot<'NUMBER', 0>,
    NUMBER_1: Slot<'NUMBER', 1>,
    FLOAT: Slot<'FLOAT', 2>,
    FLOAT_1: Slot<'FLOAT', 3>,
    INT: Slot<'INT', 4>,
    INT_1: Slot<'INT', 5>,
}
export interface WASLatentSizeToNumber_input {
    samples: _LATENT
}

// Latent Upscale by Factor (WAS) [WAS Suite_Latent_Transform]
export interface WASLatentUpscaleByFactorWAS extends HasSingle_LATENT, ComfyNode<WASLatentUpscaleByFactorWAS_input> {
    nameInComfy: "Latent Upscale by Factor (WAS)"
    LATENT: Slot<'LATENT', 0>,
}
export interface WASLatentUpscaleByFactorWAS_input {
    samples: _LATENT
    mode: Enum_WASLatentUpscaleByFactorWAS_Mode
    /** default=2 min=8 max=8 step=0.01 */
    factor?: _FLOAT
    align: Enum_WASCreateGridImage_Include_subfolders
}

// Load Image Batch [WAS Suite_IO]
export interface WASLoadImageBatch extends HasSingle_IMAGE, HasSingle_STRING, ComfyNode<WASLoadImageBatch_input> {
    nameInComfy: "Load Image Batch"
    IMAGE: Slot<'IMAGE', 0>,
    STRING: Slot<'STRING', 1>,
}
export interface WASLoadImageBatch_input {
    mode: Enum_WASLoadImageBatch_Mode
    /** default=0 min=150000 max=150000 step=1 */
    index?: _INT
    /** default="Batch 001" */
    label?: _STRING
    /** default="" */
    path?: _STRING
    /** default="*" */
    pattern?: _STRING
    allow_RGBA_output: Enum_WASCreateGridImage_Include_subfolders
    filename_text_extension?: Enum_WASCreateGridImage_Include_subfolders
}

// Load Text File [WAS Suite_IO]
export interface WASLoadTextFile extends HasSingle_STRING, HasSingle_DICT, ComfyNode<WASLoadTextFile_input> {
    nameInComfy: "Load Text File"
    STRING: Slot<'STRING', 0>,
    DICT: Slot<'DICT', 1>,
}
export interface WASLoadTextFile_input {
    /** default="" */
    file_path?: _STRING
    /** default="[filename]" */
    dictionary_name?: _STRING
}

// Load Lora [WAS Suite_Loaders]
export interface WASLoadLora extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_STRING, ComfyNode<WASLoadLora_input> {
    nameInComfy: "Load Lora"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    STRING: Slot<'STRING', 2>,
}
export interface WASLoadLora_input {
    model: _MODEL
    clip: _CLIP
    lora_name: Enum_EfficientLoader_Lora_name
    /** default=1 min=10 max=10 step=0.01 */
    strength_model?: _FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    strength_clip?: _FLOAT
}

// Masks Add [WAS Suite_Image_Masking]
export interface WASMasksAdd extends HasSingle_MASK, ComfyNode<WASMasksAdd_input> {
    nameInComfy: "Masks Add"
    MASK: Slot<'MASK', 0>,
}
export interface WASMasksAdd_input {
    masks_a: _MASK
    masks_b: _MASK
}

// Masks Subtract [WAS Suite_Image_Masking]
export interface WASMasksSubtract extends HasSingle_MASK, ComfyNode<WASMasksSubtract_input> {
    nameInComfy: "Masks Subtract"
    MASK: Slot<'MASK', 0>,
}
export interface WASMasksSubtract_input {
    masks_a: _MASK
    masks_b: _MASK
}

// Mask Arbitrary Region [WAS Suite_Image_Masking]
export interface WASMaskArbitraryRegion extends HasSingle_MASK, ComfyNode<WASMaskArbitraryRegion_input> {
    nameInComfy: "Mask Arbitrary Region"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskArbitraryRegion_input {
    masks: _MASK
    /** default=256 min=4096 max=4096 step=1 */
    size?: _INT
    /** default=128 min=255 max=255 step=1 */
    threshold?: _INT
}

// Mask Batch to Mask [WAS Suite_Image_Masking]
export interface WASMaskBatchToMask extends HasSingle_MASK, ComfyNode<WASMaskBatchToMask_input> {
    nameInComfy: "Mask Batch to Mask"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskBatchToMask_input {
    masks: _MASK
    /** default=0 min=64 max=64 step=1 */
    batch_number?: _INT
}

// Mask Batch [WAS Suite_Image_Masking]
export interface WASMaskBatch extends HasSingle_MASK, ComfyNode<WASMaskBatch_input> {
    nameInComfy: "Mask Batch"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskBatch_input {
    masks_a?: _MASK
    masks_b?: _MASK
    masks_c?: _MASK
    masks_d?: _MASK
}

// Mask Ceiling Region [WAS Suite_Image_Masking]
export interface WASMaskCeilingRegion extends HasSingle_MASK, ComfyNode<WASMaskCeilingRegion_input> {
    nameInComfy: "Mask Ceiling Region"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskCeilingRegion_input {
    masks: _MASK
}

// Mask Crop Dominant Region [WAS Suite_Image_Masking]
export interface WASMaskCropDominantRegion extends HasSingle_MASK, ComfyNode<WASMaskCropDominantRegion_input> {
    nameInComfy: "Mask Crop Dominant Region"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskCropDominantRegion_input {
    masks: _MASK
    /** default=24 min=4096 max=4096 step=1 */
    padding?: _INT
}

// Mask Crop Minority Region [WAS Suite_Image_Masking]
export interface WASMaskCropMinorityRegion extends HasSingle_MASK, ComfyNode<WASMaskCropMinorityRegion_input> {
    nameInComfy: "Mask Crop Minority Region"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskCropMinorityRegion_input {
    masks: _MASK
    /** default=24 min=4096 max=4096 step=1 */
    padding?: _INT
}

// Mask Crop Region [WAS Suite_Image_Masking]
export interface WASMaskCropRegion extends HasSingle_MASK, HasSingle_CROP_DATA, ComfyNode<WASMaskCropRegion_input> {
    nameInComfy: "Mask Crop Region"
    MASK: Slot<'MASK', 0>,
    CROP_DATA: Slot<'CROP_DATA', 1>,
    INT: Slot<'INT', 2>,
    INT_1: Slot<'INT', 3>,
    INT_2: Slot<'INT', 4>,
    INT_3: Slot<'INT', 5>,
    INT_4: Slot<'INT', 6>,
    INT_5: Slot<'INT', 7>,
}
export interface WASMaskCropRegion_input {
    mask: _MASK
    /** default=24 min=4096 max=4096 step=1 */
    padding?: _INT
    region_type: Enum_WASMaskCropRegion_Region_type
}

// Mask Paste Region [WAS Suite_Image_Masking]
export interface WASMaskPasteRegion extends ComfyNode<WASMaskPasteRegion_input> {
    nameInComfy: "Mask Paste Region"
    MASK: Slot<'MASK', 0>,
    MASK_1: Slot<'MASK', 1>,
}
export interface WASMaskPasteRegion_input {
    mask: _MASK
    crop_mask: _MASK
    crop_data: _CROP_DATA
    /** default=0.25 min=1 max=1 step=0.01 */
    crop_blending?: _FLOAT
    /** default=0 min=3 max=3 step=1 */
    crop_sharpening?: _INT
}

// Mask Dilate Region [WAS Suite_Image_Masking]
export interface WASMaskDilateRegion extends HasSingle_MASK, ComfyNode<WASMaskDilateRegion_input> {
    nameInComfy: "Mask Dilate Region"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskDilateRegion_input {
    masks: _MASK
    /** default=5 min=64 max=64 step=1 */
    iterations?: _INT
}

// Mask Dominant Region [WAS Suite_Image_Masking]
export interface WASMaskDominantRegion extends HasSingle_MASK, ComfyNode<WASMaskDominantRegion_input> {
    nameInComfy: "Mask Dominant Region"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskDominantRegion_input {
    masks: _MASK
    /** default=128 min=255 max=255 step=1 */
    threshold?: _INT
}

// Mask Erode Region [WAS Suite_Image_Masking]
export interface WASMaskErodeRegion extends HasSingle_MASK, ComfyNode<WASMaskErodeRegion_input> {
    nameInComfy: "Mask Erode Region"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskErodeRegion_input {
    masks: _MASK
    /** default=5 min=64 max=64 step=1 */
    iterations?: _INT
}

// Mask Fill Holes [WAS Suite_Image_Masking]
export interface WASMaskFillHoles extends HasSingle_MASK, ComfyNode<WASMaskFillHoles_input> {
    nameInComfy: "Mask Fill Holes"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskFillHoles_input {
    masks: _MASK
}

// Mask Floor Region [WAS Suite_Image_Masking]
export interface WASMaskFloorRegion extends HasSingle_MASK, ComfyNode<WASMaskFloorRegion_input> {
    nameInComfy: "Mask Floor Region"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskFloorRegion_input {
    masks: _MASK
}

// Mask Gaussian Region [WAS Suite_Image_Masking]
export interface WASMaskGaussianRegion extends HasSingle_MASK, ComfyNode<WASMaskGaussianRegion_input> {
    nameInComfy: "Mask Gaussian Region"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskGaussianRegion_input {
    masks: _MASK
    /** default=5 min=1024 max=1024 step=0.1 */
    radius?: _FLOAT
}

// Mask Invert [WAS Suite_Image_Masking]
export interface WASMaskInvert extends HasSingle_MASK, ComfyNode<WASMaskInvert_input> {
    nameInComfy: "Mask Invert"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskInvert_input {
    masks: _MASK
}

// Mask Minority Region [WAS Suite_Image_Masking]
export interface WASMaskMinorityRegion extends HasSingle_MASK, ComfyNode<WASMaskMinorityRegion_input> {
    nameInComfy: "Mask Minority Region"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskMinorityRegion_input {
    masks: _MASK
    /** default=128 min=255 max=255 step=1 */
    threshold?: _INT
}

// Mask Smooth Region [WAS Suite_Image_Masking]
export interface WASMaskSmoothRegion extends HasSingle_MASK, ComfyNode<WASMaskSmoothRegion_input> {
    nameInComfy: "Mask Smooth Region"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskSmoothRegion_input {
    masks: _MASK
    /** default=5 min=128 max=128 step=0.1 */
    sigma?: _FLOAT
}

// Mask Threshold Region [WAS Suite_Image_Masking]
export interface WASMaskThresholdRegion extends HasSingle_MASK, ComfyNode<WASMaskThresholdRegion_input> {
    nameInComfy: "Mask Threshold Region"
    MASK: Slot<'MASK', 0>,
}
export interface WASMaskThresholdRegion_input {
    masks: _MASK
    /** default=75 min=255 max=255 step=1 */
    black_threshold?: _INT
    /** default=175 min=255 max=255 step=1 */
    white_threshold?: _INT
}

// Masks Combine Regions [WAS Suite_Image_Masking]
export interface WASMasksCombineRegions extends HasSingle_MASK, ComfyNode<WASMasksCombineRegions_input> {
    nameInComfy: "Masks Combine Regions"
    MASK: Slot<'MASK', 0>,
}
export interface WASMasksCombineRegions_input {
    mask_a: _MASK
    mask_b: _MASK
    mask_c?: _MASK
    mask_d?: _MASK
    mask_e?: _MASK
    mask_f?: _MASK
}

// Masks Combine Batch [WAS Suite_Image_Masking]
export interface WASMasksCombineBatch extends HasSingle_MASK, ComfyNode<WASMasksCombineBatch_input> {
    nameInComfy: "Masks Combine Batch"
    MASK: Slot<'MASK', 0>,
}
export interface WASMasksCombineBatch_input {
    masks: _MASK
}

// MiDaS Model Loader [WAS Suite_Loaders]
export interface WASMiDaSModelLoader extends HasSingle_MIDAS_MODEL, ComfyNode<WASMiDaSModelLoader_input> {
    nameInComfy: "MiDaS Model Loader"
    MIDAS_MODEL: Slot<'MIDAS_MODEL', 0>,
}
export interface WASMiDaSModelLoader_input {
    midas_model: Enum_WASMiDaSModelLoader_Midas_model
}

// MiDaS Depth Approximation [WAS Suite_Image_AI]
export interface WASMiDaSDepthApproximation extends HasSingle_IMAGE, ComfyNode<WASMiDaSDepthApproximation_input> {
    nameInComfy: "MiDaS Depth Approximation"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASMiDaSDepthApproximation_input {
    image: _IMAGE
    use_cpu: Enum_WASCreateGridImage_Include_subfolders
    midas_type: Enum_WASMiDaSModelLoader_Midas_model
    invert_depth: Enum_WASCreateGridImage_Include_subfolders
    midas_model?: _MIDAS_MODEL
}

// MiDaS Mask Image [WAS Suite_Image_AI]
export interface WASMiDaSMaskImage extends ComfyNode<WASMiDaSMaskImage_input> {
    nameInComfy: "MiDaS Mask Image"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_1: Slot<'IMAGE', 1>,
}
export interface WASMiDaSMaskImage_input {
    image: _IMAGE
    use_cpu: Enum_WASCreateGridImage_Include_subfolders
    midas_model: Enum_WASMiDaSMaskImage_Midas_model
    remove: Enum_WASMiDaSMaskImage_Remove
    threshold: Enum_WASCreateGridImage_Include_subfolders
    /** default=10 min=255 max=255 step=1 */
    threshold_low?: _FLOAT
    /** default=200 min=255 max=255 step=1 */
    threshold_mid?: _FLOAT
    /** default=210 min=255 max=255 step=1 */
    threshold_high?: _FLOAT
    /** default=0.25 min=16 max=16 step=0.01 */
    smoothing?: _FLOAT
    /** default=0 min=255 max=255 step=1 */
    background_red?: _INT
    /** default=0 min=255 max=255 step=1 */
    background_green?: _INT
    /** default=0 min=255 max=255 step=1 */
    background_blue?: _INT
}

// Model Input Switch [WAS Suite_Logic]
export interface WASModelInputSwitch extends HasSingle_MODEL, ComfyNode<WASModelInputSwitch_input> {
    nameInComfy: "Model Input Switch"
    MODEL: Slot<'MODEL', 0>,
}
export interface WASModelInputSwitch_input {
    model_a: _MODEL
    model_b: _MODEL
    boolean_number: _NUMBER
}

// Number Counter [WAS Suite_Number]
export interface WASNumberCounter extends HasSingle_NUMBER, HasSingle_FLOAT, HasSingle_INT, ComfyNode<WASNumberCounter_input> {
    nameInComfy: "Number Counter"
    NUMBER: Slot<'NUMBER', 0>,
    FLOAT: Slot<'FLOAT', 1>,
    INT: Slot<'INT', 2>,
}
export interface WASNumberCounter_input {
    number_type: Enum_WASNumberCounter_Number_type
    mode: Enum_WASKSamplerCycle_Pos_add_mode
    /** default=0 min=18446744073709552000 max=18446744073709552000 step=0.01 */
    start?: _FLOAT
    /** default=1 min=99999 max=99999 step=0.01 */
    step?: _FLOAT
    reset_bool?: _NUMBER
}

// Number Operation [WAS Suite_Number_Operations]
export interface WASNumberOperation extends HasSingle_NUMBER, HasSingle_FLOAT, HasSingle_INT, ComfyNode<WASNumberOperation_input> {
    nameInComfy: "Number Operation"
    NUMBER: Slot<'NUMBER', 0>,
    FLOAT: Slot<'FLOAT', 1>,
    INT: Slot<'INT', 2>,
}
export interface WASNumberOperation_input {
    number_a: _NUMBER
    number_b: _NUMBER
    operation: Enum_WASNumberOperation_Operation
}

// Number to Float [WAS Suite_Number_Operations]
export interface WASNumberToFloat extends HasSingle_FLOAT, ComfyNode<WASNumberToFloat_input> {
    nameInComfy: "Number to Float"
    FLOAT: Slot<'FLOAT', 0>,
}
export interface WASNumberToFloat_input {
    number: _NUMBER
}

// Number Input Switch [WAS Suite_Logic]
export interface WASNumberInputSwitch extends HasSingle_NUMBER, HasSingle_FLOAT, HasSingle_INT, ComfyNode<WASNumberInputSwitch_input> {
    nameInComfy: "Number Input Switch"
    NUMBER: Slot<'NUMBER', 0>,
    FLOAT: Slot<'FLOAT', 1>,
    INT: Slot<'INT', 2>,
}
export interface WASNumberInputSwitch_input {
    number_a: _NUMBER
    number_b: _NUMBER
    boolean_number: _NUMBER
}

// Number Input Condition [WAS Suite_Logic]
export interface WASNumberInputCondition extends HasSingle_NUMBER, HasSingle_FLOAT, HasSingle_INT, ComfyNode<WASNumberInputCondition_input> {
    nameInComfy: "Number Input Condition"
    NUMBER: Slot<'NUMBER', 0>,
    FLOAT: Slot<'FLOAT', 1>,
    INT: Slot<'INT', 2>,
}
export interface WASNumberInputCondition_input {
    number_a: _NUMBER
    number_b: _NUMBER
    return_boolean: Enum_WASCreateGridImage_Include_subfolders
    comparison: Enum_WASNumberInputCondition_Comparison
}

// Number Multiple Of [WAS Suite_Number_Functions]
export interface WASNumberMultipleOf extends HasSingle_NUMBER, HasSingle_FLOAT, HasSingle_INT, ComfyNode<WASNumberMultipleOf_input> {
    nameInComfy: "Number Multiple Of"
    NUMBER: Slot<'NUMBER', 0>,
    FLOAT: Slot<'FLOAT', 1>,
    INT: Slot<'INT', 2>,
}
export interface WASNumberMultipleOf_input {
    number: _NUMBER
    /** default=8 min=18446744073709552000 max=18446744073709552000 */
    multiple?: _INT
}

// Number PI [WAS Suite_Number]
export interface WASNumberPI extends HasSingle_NUMBER, HasSingle_FLOAT, ComfyNode<WASNumberPI_input> {
    nameInComfy: "Number PI"
    NUMBER: Slot<'NUMBER', 0>,
    FLOAT: Slot<'FLOAT', 1>,
}
export interface WASNumberPI_input {
}

// Number to Int [WAS Suite_Number_Operations]
export interface WASNumberToInt extends HasSingle_INT, ComfyNode<WASNumberToInt_input> {
    nameInComfy: "Number to Int"
    INT: Slot<'INT', 0>,
}
export interface WASNumberToInt_input {
    number: _NUMBER
}

// Number to Seed [WAS Suite_Number_Operations]
export interface WASNumberToSeed extends HasSingle_SEED, ComfyNode<WASNumberToSeed_input> {
    nameInComfy: "Number to Seed"
    SEED: Slot<'SEED', 0>,
}
export interface WASNumberToSeed_input {
    number: _NUMBER
}

// Number to String [WAS Suite_Number_Operations]
export interface WASNumberToString extends HasSingle_STRING, ComfyNode<WASNumberToString_input> {
    nameInComfy: "Number to String"
    STRING: Slot<'STRING', 0>,
}
export interface WASNumberToString_input {
    number: _NUMBER
}

// Number to Text [WAS Suite_Number_Operations]
export interface WASNumberToText extends HasSingle_STRING, ComfyNode<WASNumberToText_input> {
    nameInComfy: "Number to Text"
    STRING: Slot<'STRING', 0>,
}
export interface WASNumberToText_input {
    number: _NUMBER
}

// Prompt Styles Selector [WAS Suite_Text]
export interface WASPromptStylesSelector extends ComfyNode<WASPromptStylesSelector_input> {
    nameInComfy: "Prompt Styles Selector"
    STRING: Slot<'STRING', 0>,
    STRING_1: Slot<'STRING', 1>,
}
export interface WASPromptStylesSelector_input {
    style: Enum_WASPromptStylesSelector_Style
}

// Prompt Multiple Styles Selector [WAS Suite_Text]
export interface WASPromptMultipleStylesSelector extends ComfyNode<WASPromptMultipleStylesSelector_input> {
    nameInComfy: "Prompt Multiple Styles Selector"
    STRING: Slot<'STRING', 0>,
    STRING_1: Slot<'STRING', 1>,
}
export interface WASPromptMultipleStylesSelector_input {
    style1: Enum_WASPromptStylesSelector_Style
    style2: Enum_WASPromptStylesSelector_Style
    style3: Enum_WASPromptStylesSelector_Style
    style4: Enum_WASPromptStylesSelector_Style
}

// Random Number [WAS Suite_Number]
export interface WASRandomNumber extends HasSingle_NUMBER, HasSingle_FLOAT, HasSingle_INT, ComfyNode<WASRandomNumber_input> {
    nameInComfy: "Random Number"
    NUMBER: Slot<'NUMBER', 0>,
    FLOAT: Slot<'FLOAT', 1>,
    INT: Slot<'INT', 2>,
}
export interface WASRandomNumber_input {
    number_type: Enum_WASConstantNumber_Number_type
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    minimum?: _FLOAT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    maximum?: _FLOAT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
}

// Save Text File [WAS Suite_IO]
export interface WASSaveTextFile extends ComfyNode<WASSaveTextFile_input> {
    nameInComfy: "Save Text File"
}
export interface WASSaveTextFile_input {
    /** */
    text: _STRING
    /** default="./ComfyUI/output/[time(%Y-%m-%d)]" */
    path?: _STRING
    /** default="ComfyUI" */
    filename_prefix?: _STRING
    /** default="_" */
    filename_delimiter?: _STRING
    /** default=4 min=9 max=9 step=1 */
    filename_number_padding?: _INT
}

// Seed [WAS Suite_Number]
export interface WASSeed extends HasSingle_SEED, HasSingle_NUMBER, HasSingle_FLOAT, HasSingle_INT, ComfyNode<WASSeed_input> {
    nameInComfy: "Seed"
    SEED: Slot<'SEED', 0>,
    NUMBER: Slot<'NUMBER', 1>,
    FLOAT: Slot<'FLOAT', 2>,
    INT: Slot<'INT', 3>,
}
export interface WASSeed_input {
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
}

// Tensor Batch to Image [WAS Suite_Latent_Transform]
export interface WASTensorBatchToImage extends HasSingle_IMAGE, ComfyNode<WASTensorBatchToImage_input> {
    nameInComfy: "Tensor Batch to Image"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASTensorBatchToImage_input {
    images_batch: _IMAGE
    /** default=0 min=64 max=64 step=1 */
    batch_image_number?: _INT
}

// BLIP Analyze Image [WAS Suite_Text_AI]
export interface WASBLIPAnalyzeImage extends HasSingle_STRING, ComfyNode<WASBLIPAnalyzeImage_input> {
    nameInComfy: "BLIP Analyze Image"
    STRING: Slot<'STRING', 0>,
}
export interface WASBLIPAnalyzeImage_input {
    image: _IMAGE
    mode: Enum_WASBLIPModelLoader_Blip_model
    /** default="What does the background consist of?" */
    question?: _STRING
    blip_model?: _BLIP_MODEL
}

// SAM Model Loader [WAS Suite_Image_Masking]
export interface WASSAMModelLoader extends HasSingle_SAM_MODEL, ComfyNode<WASSAMModelLoader_input> {
    nameInComfy: "SAM Model Loader"
    SAM_MODEL: Slot<'SAM_MODEL', 0>,
}
export interface WASSAMModelLoader_input {
    model_size: Enum_WASSAMModelLoader_Model_size
}

// SAM Parameters [WAS Suite_Image_Masking]
export interface WASSAMParameters extends HasSingle_SAM_PARAMETERS, ComfyNode<WASSAMParameters_input> {
    nameInComfy: "SAM Parameters"
    SAM_PARAMETERS: Slot<'SAM_PARAMETERS', 0>,
}
export interface WASSAMParameters_input {
    /** default="[128, 128]; [0, 0]" */
    points?: _STRING
    /** default="[1, 0]" */
    labels?: _STRING
}

// SAM Parameters Combine [WAS Suite_Image_Masking]
export interface WASSAMParametersCombine extends HasSingle_SAM_PARAMETERS, ComfyNode<WASSAMParametersCombine_input> {
    nameInComfy: "SAM Parameters Combine"
    SAM_PARAMETERS: Slot<'SAM_PARAMETERS', 0>,
}
export interface WASSAMParametersCombine_input {
    sam_parameters_a: _SAM_PARAMETERS
    sam_parameters_b: _SAM_PARAMETERS
}

// SAM Image Mask [WAS Suite_Image_Masking]
export interface WASSAMImageMask extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<WASSAMImageMask_input> {
    nameInComfy: "SAM Image Mask"
    IMAGE: Slot<'IMAGE', 0>,
    MASK: Slot<'MASK', 1>,
}
export interface WASSAMImageMask_input {
    sam_model: _SAM_MODEL
    sam_parameters: _SAM_PARAMETERS
    image: _IMAGE
}

// Samples Passthrough (Stat System) [WAS Suite_Debug]
export interface WASSamplesPassthroughStatSystem extends HasSingle_LATENT, ComfyNode<WASSamplesPassthroughStatSystem_input> {
    nameInComfy: "Samples Passthrough (Stat System)"
    LATENT: Slot<'LATENT', 0>,
}
export interface WASSamplesPassthroughStatSystem_input {
    samples: _LATENT
}

// String to Text [WAS Suite_Text_Operations]
export interface WASStringToText extends HasSingle_STRING, ComfyNode<WASStringToText_input> {
    nameInComfy: "String to Text"
    STRING: Slot<'STRING', 0>,
}
export interface WASStringToText_input {
    /** */
    string: _STRING
}

// Image Bounds [WAS Suite_Image_Bound]
export interface WASImageBounds extends HasSingle_IMAGE_BOUNDS, ComfyNode<WASImageBounds_input> {
    nameInComfy: "Image Bounds"
    IMAGE_BOUNDS: Slot<'IMAGE_BOUNDS', 0>,
}
export interface WASImageBounds_input {
    image: _IMAGE
}

// Inset Image Bounds [WAS Suite_Image_Bound]
export interface WASInsetImageBounds extends HasSingle_IMAGE_BOUNDS, ComfyNode<WASInsetImageBounds_input> {
    nameInComfy: "Inset Image Bounds"
    IMAGE_BOUNDS: Slot<'IMAGE_BOUNDS', 0>,
}
export interface WASInsetImageBounds_input {
    image_bounds: _IMAGE_BOUNDS
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    inset_left?: _INT
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    inset_right?: _INT
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    inset_top?: _INT
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    inset_bottom?: _INT
}

// Bounded Image Blend [WAS Suite_Image_Bound]
export interface WASBoundedImageBlend extends HasSingle_IMAGE, ComfyNode<WASBoundedImageBlend_input> {
    nameInComfy: "Bounded Image Blend"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASBoundedImageBlend_input {
    target: _IMAGE
    target_bounds: _IMAGE_BOUNDS
    source: _IMAGE
    /** default=1 min=1 max=1 */
    blend_factor?: _FLOAT
    /** default=16 min=18446744073709552000 max=18446744073709552000 */
    feathering?: _INT
}

// Bounded Image Blend with Mask [WAS Suite_Image_Bound]
export interface WASBoundedImageBlendWithMask extends HasSingle_IMAGE, ComfyNode<WASBoundedImageBlendWithMask_input> {
    nameInComfy: "Bounded Image Blend with Mask"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASBoundedImageBlendWithMask_input {
    target: _IMAGE
    target_mask: _MASK
    target_bounds: _IMAGE_BOUNDS
    source: _IMAGE
    /** default=1 min=1 max=1 */
    blend_factor?: _FLOAT
    /** default=16 min=18446744073709552000 max=18446744073709552000 */
    feathering?: _INT
}

// Bounded Image Crop [WAS Suite_Image_Bound]
export interface WASBoundedImageCrop extends HasSingle_IMAGE, ComfyNode<WASBoundedImageCrop_input> {
    nameInComfy: "Bounded Image Crop"
    IMAGE: Slot<'IMAGE', 0>,
}
export interface WASBoundedImageCrop_input {
    image: _IMAGE
    image_bounds: _IMAGE_BOUNDS
}

// Bounded Image Crop with Mask [WAS Suite_Image_Bound]
export interface WASBoundedImageCropWithMask extends HasSingle_IMAGE, HasSingle_IMAGE_BOUNDS, ComfyNode<WASBoundedImageCropWithMask_input> {
    nameInComfy: "Bounded Image Crop with Mask"
    IMAGE: Slot<'IMAGE', 0>,
    IMAGE_BOUNDS: Slot<'IMAGE_BOUNDS', 1>,
}
export interface WASBoundedImageCropWithMask_input {
    image: _IMAGE
    mask: _MASK
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    padding_left?: _INT
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    padding_right?: _INT
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    padding_top?: _INT
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    padding_bottom?: _INT
}

// Text Dictionary Update [WAS Suite_Text]
export interface WASTextDictionaryUpdate extends HasSingle_DICT, ComfyNode<WASTextDictionaryUpdate_input> {
    nameInComfy: "Text Dictionary Update"
    DICT: Slot<'DICT', 0>,
}
export interface WASTextDictionaryUpdate_input {
    dictionary_a: _DICT
    dictionary_b: _DICT
    dictionary_c?: _DICT
    dictionary_d?: _DICT
}

// Text Add Tokens [WAS Suite_Text_Tokens]
export interface WASTextAddTokens extends ComfyNode<WASTextAddTokens_input> {
    nameInComfy: "Text Add Tokens"
}
export interface WASTextAddTokens_input {
    /** default="[hello]: world" */
    tokens?: _STRING
    print_current_tokens: Enum_WASCreateGridImage_Include_subfolders
}

// Text Add Token by Input [WAS Suite_Text_Tokens]
export interface WASTextAddTokenByInput extends ComfyNode<WASTextAddTokenByInput_input> {
    nameInComfy: "Text Add Token by Input"
}
export interface WASTextAddTokenByInput_input {
    /** */
    token_name: _STRING
    /** */
    token_value: _STRING
    print_current_tokens: Enum_WASCreateGridImage_Include_subfolders
}

// Text Compare [WAS Suite_Text_Search]
export interface WASTextCompare extends ComfyNode<WASTextCompare_input> {
    nameInComfy: "Text Compare"
    STRING: Slot<'STRING', 0>,
    STRING_1: Slot<'STRING', 1>,
    NUMBER: Slot<'NUMBER', 2>,
    NUMBER_1: Slot<'NUMBER', 3>,
    STRING_2: Slot<'STRING', 4>,
}
export interface WASTextCompare_input {
    /** */
    text_a: _STRING
    /** */
    text_b: _STRING
    mode: Enum_WASTextCompare_Mode
    /** default=0 min=1 max=1 step=0.01 */
    tolerance?: _FLOAT
}

// Text Concatenate [WAS Suite_Text]
export interface WASTextConcatenate extends HasSingle_STRING, ComfyNode<WASTextConcatenate_input> {
    nameInComfy: "Text Concatenate"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextConcatenate_input {
    /** */
    text_a: _STRING
    /** */
    text_b: _STRING
    linebreak_addition: Enum_WASCreateGridImage_Include_subfolders
    /** */
    text_c?: _STRING
    /** */
    text_d?: _STRING
}

// Text File History Loader [WAS Suite_History]
export interface WASTextFileHistoryLoader extends HasSingle_STRING, HasSingle_DICT, ComfyNode<WASTextFileHistoryLoader_input> {
    nameInComfy: "Text File History Loader"
    STRING: Slot<'STRING', 0>,
    DICT: Slot<'DICT', 1>,
}
export interface WASTextFileHistoryLoader_input {
    file: Enum_WASTextFileHistoryLoader_File
    /** default="[filename]" */
    dictionary_name?: _STRING
}

// Text Find and Replace by Dictionary [WAS Suite_Text_Search]
export interface WASTextFindAndReplaceByDictionary extends HasSingle_STRING, ComfyNode<WASTextFindAndReplaceByDictionary_input> {
    nameInComfy: "Text Find and Replace by Dictionary"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextFindAndReplaceByDictionary_input {
    /** */
    text: _STRING
    dictionary: _DICT
    /** default="__" */
    replacement_key?: _STRING
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
}

// Text Find and Replace Input [WAS Suite_Text_Search]
export interface WASTextFindAndReplaceInput extends HasSingle_STRING, ComfyNode<WASTextFindAndReplaceInput_input> {
    nameInComfy: "Text Find and Replace Input"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextFindAndReplaceInput_input {
    /** */
    text: _STRING
    /** */
    find: _STRING
    /** */
    replace: _STRING
}

// Text Find and Replace [WAS Suite_Text_Search]
export interface WASTextFindAndReplace extends HasSingle_STRING, ComfyNode<WASTextFindAndReplace_input> {
    nameInComfy: "Text Find and Replace"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextFindAndReplace_input {
    /** */
    text: _STRING
    /** default="" */
    find?: _STRING
    /** default="" */
    replace?: _STRING
}

// Text Input Switch [WAS Suite_Logic]
export interface WASTextInputSwitch extends HasSingle_STRING, ComfyNode<WASTextInputSwitch_input> {
    nameInComfy: "Text Input Switch"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextInputSwitch_input {
    /** */
    text_a: _STRING
    /** */
    text_b: _STRING
    boolean_number: _NUMBER
}

// Text List [WAS Suite_Text]
export interface WASTextList extends HasSingle_LIST, ComfyNode<WASTextList_input> {
    nameInComfy: "Text List"
    LIST: Slot<'LIST', 0>,
}
export interface WASTextList_input {
    /** */
    text_a: _STRING
    /** */
    text_b?: _STRING
    /** */
    text_c?: _STRING
    /** */
    text_d?: _STRING
    /** */
    text_e?: _STRING
    /** */
    text_f?: _STRING
    /** */
    text_g?: _STRING
}

// Text List Concatenate [WAS Suite_Text]
export interface WASTextListConcatenate extends HasSingle_LIST, ComfyNode<WASTextListConcatenate_input> {
    nameInComfy: "Text List Concatenate"
    LIST: Slot<'LIST', 0>,
}
export interface WASTextListConcatenate_input {
    /** */
    list_a: _LIST
    /** */
    list_b: _LIST
    /** */
    list_c?: _LIST
    /** */
    list_d?: _LIST
}

// Text Load Line From File [WAS Suite_Text]
export interface WASTextLoadLineFromFile extends HasSingle_STRING, HasSingle_DICT, ComfyNode<WASTextLoadLineFromFile_input> {
    nameInComfy: "Text Load Line From File"
    STRING: Slot<'STRING', 0>,
    DICT: Slot<'DICT', 1>,
}
export interface WASTextLoadLineFromFile_input {
    /** default="" */
    file_path?: _STRING
    /** default="[filename]" */
    dictionary_name?: _STRING
    /** default="TextBatch" */
    label?: _STRING
    mode: Enum_WASTextLoadLineFromFile_Mode
    /** default=0 min=undefined step=1 */
    index?: _INT
    /** */
    multiline_text?: _STRING
}

// Text Multiline [WAS Suite_Text]
export interface WASTextMultiline extends HasSingle_STRING, ComfyNode<WASTextMultiline_input> {
    nameInComfy: "Text Multiline"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextMultiline_input {
    /** default="" */
    text?: _STRING
}

// Text Parse A1111 Embeddings [WAS Suite_Text_Parse]
export interface WASTextParseA1111Embeddings extends HasSingle_STRING, ComfyNode<WASTextParseA1111Embeddings_input> {
    nameInComfy: "Text Parse A1111 Embeddings"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextParseA1111Embeddings_input {
    /** */
    text: _STRING
}

// Text Parse Noodle Soup Prompts [WAS Suite_Text_Parse]
export interface WASTextParseNoodleSoupPrompts extends HasSingle_STRING, ComfyNode<WASTextParseNoodleSoupPrompts_input> {
    nameInComfy: "Text Parse Noodle Soup Prompts"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextParseNoodleSoupPrompts_input {
    mode: Enum_WASCLIPTextEncodeNSP_Mode
    /** default="__" */
    noodle_key?: _STRING
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
    /** */
    text: _STRING
}

// Text Parse Tokens [WAS Suite_Text_Tokens]
export interface WASTextParseTokens extends HasSingle_STRING, ComfyNode<WASTextParseTokens_input> {
    nameInComfy: "Text Parse Tokens"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextParseTokens_input {
    /** */
    text: _STRING
}

// Text Random Line [WAS Suite_Text]
export interface WASTextRandomLine extends HasSingle_STRING, ComfyNode<WASTextRandomLine_input> {
    nameInComfy: "Text Random Line"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextRandomLine_input {
    /** */
    text: _STRING
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
}

// Text Random Prompt [WAS Suite_Text]
export interface WASTextRandomPrompt extends HasSingle_STRING, ComfyNode<WASTextRandomPrompt_input> {
    nameInComfy: "Text Random Prompt"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextRandomPrompt_input {
    /** */
    search_seed: _STRING
}

// Text String [WAS Suite_Text]
export interface WASTextString extends ComfyNode<WASTextString_input> {
    nameInComfy: "Text String"
    STRING: Slot<'STRING', 0>,
    STRING_1: Slot<'STRING', 1>,
    STRING_2: Slot<'STRING', 2>,
    STRING_3: Slot<'STRING', 3>,
}
export interface WASTextString_input {
    /** default="" */
    text?: _STRING
    /** default="" */
    text_b?: _STRING
    /** default="" */
    text_c?: _STRING
    /** default="" */
    text_d?: _STRING
}

// Text Shuffle [WAS Suite_Text_Operations]
export interface WASTextShuffle extends HasSingle_STRING, ComfyNode<WASTextShuffle_input> {
    nameInComfy: "Text Shuffle"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextShuffle_input {
    /** */
    text: _STRING
    /** default="," */
    separator?: _STRING
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: _INT
}

// Text to Conditioning [WAS Suite_Text_Operations]
export interface WASTextToConditioning extends HasSingle_CONDITIONING, ComfyNode<WASTextToConditioning_input> {
    nameInComfy: "Text to Conditioning"
    CONDITIONING: Slot<'CONDITIONING', 0>,
}
export interface WASTextToConditioning_input {
    clip: _CLIP
    /** */
    text: _STRING
}

// Text to Console [WAS Suite_Debug]
export interface WASTextToConsole extends HasSingle_STRING, ComfyNode<WASTextToConsole_input> {
    nameInComfy: "Text to Console"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextToConsole_input {
    /** */
    text: _STRING
    /** default="Text Output" */
    label?: _STRING
}

// Text to Number [WAS Suite_Text_Operations]
export interface WASTextToNumber extends HasSingle_NUMBER, ComfyNode<WASTextToNumber_input> {
    nameInComfy: "Text to Number"
    NUMBER: Slot<'NUMBER', 0>,
}
export interface WASTextToNumber_input {
    /** */
    text: _STRING
}

// Text to String [WAS Suite_Text_Operations]
export interface WASTextToString extends HasSingle_STRING, ComfyNode<WASTextToString_input> {
    nameInComfy: "Text to String"
    STRING: Slot<'STRING', 0>,
}
export interface WASTextToString_input {
    /** */
    text: _STRING
}

// Text String Truncate [WAS Suite_Text_Operations]
export interface WASTextStringTruncate extends ComfyNode<WASTextStringTruncate_input> {
    nameInComfy: "Text String Truncate"
    STRING: Slot<'STRING', 0>,
    STRING_1: Slot<'STRING', 1>,
    STRING_2: Slot<'STRING', 2>,
    STRING_3: Slot<'STRING', 3>,
}
export interface WASTextStringTruncate_input {
    /** */
    text: _STRING
    truncate_by: Enum_WASTextStringTruncate_Truncate_by
    truncate_from: Enum_WASTextStringTruncate_Truncate_from
    /** default=10 min=99999999 max=99999999 step=1 */
    truncate_to?: _INT
    /** */
    text_b?: _STRING
    /** */
    text_c?: _STRING
    /** */
    text_d?: _STRING
}

// True Random.org Number Generator [WAS Suite_Number]
export interface WASTrueRandomOrgNumberGenerator extends HasSingle_NUMBER, HasSingle_FLOAT, HasSingle_INT, ComfyNode<WASTrueRandomOrgNumberGenerator_input> {
    nameInComfy: "True Random.org Number Generator"
    NUMBER: Slot<'NUMBER', 0>,
    FLOAT: Slot<'FLOAT', 1>,
    INT: Slot<'INT', 2>,
}
export interface WASTrueRandomOrgNumberGenerator_input {
    /** default="00000000-0000-0000-0000-000000000000" */
    api_key?: _STRING
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    minimum?: _FLOAT
    /** default=10000000 min=18446744073709552000 max=18446744073709552000 */
    maximum?: _FLOAT
    mode: Enum_WASTrueRandomOrgNumberGenerator_Mode
}

// unCLIP Checkpoint Loader [WAS Suite_Loaders]
export interface WASUnCLIPCheckpointLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, HasSingle_CLIP_VISION, HasSingle_STRING, ComfyNode<WASUnCLIPCheckpointLoader_input> {
    nameInComfy: "unCLIP Checkpoint Loader"
    MODEL: Slot<'MODEL', 0>,
    CLIP: Slot<'CLIP', 1>,
    VAE: Slot<'VAE', 2>,
    CLIP_VISION: Slot<'CLIP_VISION', 3>,
    STRING: Slot<'STRING', 4>,
}
export interface WASUnCLIPCheckpointLoader_input {
    ckpt_name: Enum_CheckpointLoaderSimple_Ckpt_name
}

// Upscale Model Loader [WAS Suite_Loaders]
export interface WASUpscaleModelLoader extends HasSingle_UPSCALE_MODEL, HasSingle_STRING, ComfyNode<WASUpscaleModelLoader_input> {
    nameInComfy: "Upscale Model Loader"
    UPSCALE_MODEL: Slot<'UPSCALE_MODEL', 0>,
    STRING: Slot<'STRING', 1>,
}
export interface WASUpscaleModelLoader_input {
    model_name: Enum_CLIPLoader_Clip_name
}

// Upscale Model Switch [WAS Suite_Logic]
export interface WASUpscaleModelSwitch extends HasSingle_UPSCALE_MODEL, ComfyNode<WASUpscaleModelSwitch_input> {
    nameInComfy: "Upscale Model Switch"
    UPSCALE_MODEL: Slot<'UPSCALE_MODEL', 0>,
}
export interface WASUpscaleModelSwitch_input {
    upscale_model_a: _UPSCALE_MODEL
    upscale_model_b: _UPSCALE_MODEL
    boolean_number: _NUMBER
}

// Write to GIF [WAS Suite_Animation_Writer]
export interface WASWriteToGIF extends HasSingle_IMAGE, ComfyNode<WASWriteToGIF_input> {
    nameInComfy: "Write to GIF"
    IMAGE: Slot<'IMAGE', 0>,
    STRING: Slot<'STRING', 1>,
    STRING_1: Slot<'STRING', 2>,
}
export interface WASWriteToGIF_input {
    image: _IMAGE
    /** default=30 min=60 max=60 step=1 */
    transition_frames?: _INT
    /** default=2500 min=60000 max=60000 step=0.1 */
    image_delay_ms?: _FLOAT
    /** default=0.1 min=60000 max=60000 step=0.1 */
    duration_ms?: _FLOAT
    /** default=0 min=100 max=100 step=1 */
    loops?: _INT
    /** default=512 min=1280 max=1280 step=1 */
    max_size?: _INT
    /** default="./ComfyUI/output" */
    output_path?: _STRING
    /** default="morph_writer" */
    filename?: _STRING
}

// Write to Video [WAS Suite_Animation_Writer]
export interface WASWriteToVideo extends HasSingle_IMAGE, ComfyNode<WASWriteToVideo_input> {
    nameInComfy: "Write to Video"
    IMAGE: Slot<'IMAGE', 0>,
    STRING: Slot<'STRING', 1>,
    STRING_1: Slot<'STRING', 2>,
}
export interface WASWriteToVideo_input {
    image: _IMAGE
    /** default=30 min=120 max=120 step=1 */
    transition_frames?: _INT
    /** default=2.5 min=60000 max=60000 step=0.1 */
    image_delay_sec?: _FLOAT
    /** default=30 min=60 max=60 step=1 */
    fps?: _INT
    /** default=512 min=1920 max=1920 step=1 */
    max_size?: _INT
    /** default="./ComfyUI/output" */
    output_path?: _STRING
    /** default="comfy_writer" */
    filename?: _STRING
    codec: Enum_WASCreateVideoFromPath_Codec
}

// VAE Input Switch [WAS Suite_Logic]
export interface WASVAEInputSwitch extends HasSingle_VAE, ComfyNode<WASVAEInputSwitch_input> {
    nameInComfy: "VAE Input Switch"
    VAE: Slot<'VAE', 0>,
}
export interface WASVAEInputSwitch_input {
    vae_a: _VAE
    vae_b: _VAE
    boolean_number: _NUMBER
}

// Video Dump Frames [WAS Suite_Animation]
export interface WASVideoDumpFrames extends HasSingle_STRING, HasSingle_NUMBER, ComfyNode<WASVideoDumpFrames_input> {
    nameInComfy: "Video Dump Frames"
    STRING: Slot<'STRING', 0>,
    NUMBER: Slot<'NUMBER', 1>,
}
export interface WASVideoDumpFrames_input {
    /** default="./ComfyUI/input/MyVideo.mp4" */
    video_path?: _STRING
    /** default="./ComfyUI/input/MyVideo" */
    output_path?: _STRING
    /** default="frame_" */
    prefix?: _STRING
    /** default=4 min=8 max=8 step=1 */
    filenumber_digits?: _INT
    extension: Enum_WASVideoDumpFrames_Extension
}


// 9. INDEX -------------------------------
export type Schemas = {
    KSampler: ComfyNodeSchemaJSON,
    CheckpointLoaderSimple: ComfyNodeSchemaJSON,
    CLIPTextEncode: ComfyNodeSchemaJSON,
    CLIPSetLastLayer: ComfyNodeSchemaJSON,
    VAEDecode: ComfyNodeSchemaJSON,
    VAEEncode: ComfyNodeSchemaJSON,
    VAEEncodeForInpaint: ComfyNodeSchemaJSON,
    VAELoader: ComfyNodeSchemaJSON,
    EmptyLatentImage: ComfyNodeSchemaJSON,
    LatentUpscale: ComfyNodeSchemaJSON,
    LatentUpscaleBy: ComfyNodeSchemaJSON,
    LatentFromBatch: ComfyNodeSchemaJSON,
    RepeatLatentBatch: ComfyNodeSchemaJSON,
    SaveImage: ComfyNodeSchemaJSON,
    PreviewImage: ComfyNodeSchemaJSON,
    LoadImage: ComfyNodeSchemaJSON,
    LoadImageMask: ComfyNodeSchemaJSON,
    ImageScale: ComfyNodeSchemaJSON,
    ImageScaleBy: ComfyNodeSchemaJSON,
    ImageInvert: ComfyNodeSchemaJSON,
    ImageBatch: ComfyNodeSchemaJSON,
    ImagePadForOutpaint: ComfyNodeSchemaJSON,
    EmptyImage: ComfyNodeSchemaJSON,
    ConditioningAverage: ComfyNodeSchemaJSON,
    ConditioningCombine: ComfyNodeSchemaJSON,
    ConditioningConcat: ComfyNodeSchemaJSON,
    ConditioningSetArea: ComfyNodeSchemaJSON,
    ConditioningSetAreaPercentage: ComfyNodeSchemaJSON,
    ConditioningSetMask: ComfyNodeSchemaJSON,
    KSamplerAdvanced: ComfyNodeSchemaJSON,
    SetLatentNoiseMask: ComfyNodeSchemaJSON,
    LatentComposite: ComfyNodeSchemaJSON,
    LatentBlend: ComfyNodeSchemaJSON,
    LatentRotate: ComfyNodeSchemaJSON,
    LatentFlip: ComfyNodeSchemaJSON,
    LatentCrop: ComfyNodeSchemaJSON,
    LoraLoader: ComfyNodeSchemaJSON,
    CLIPLoader: ComfyNodeSchemaJSON,
    UNETLoader: ComfyNodeSchemaJSON,
    DualCLIPLoader: ComfyNodeSchemaJSON,
    CLIPVisionEncode: ComfyNodeSchemaJSON,
    StyleModelApply: ComfyNodeSchemaJSON,
    UnCLIPConditioning: ComfyNodeSchemaJSON,
    ControlNetApply: ComfyNodeSchemaJSON,
    ControlNetApplyAdvanced: ComfyNodeSchemaJSON,
    ControlNetLoader: ComfyNodeSchemaJSON,
    DiffControlNetLoader: ComfyNodeSchemaJSON,
    StyleModelLoader: ComfyNodeSchemaJSON,
    CLIPVisionLoader: ComfyNodeSchemaJSON,
    VAEDecodeTiled: ComfyNodeSchemaJSON,
    VAEEncodeTiled: ComfyNodeSchemaJSON,
    UnCLIPCheckpointLoader: ComfyNodeSchemaJSON,
    GLIGENLoader: ComfyNodeSchemaJSON,
    GLIGENTextBoxApply: ComfyNodeSchemaJSON,
    CheckpointLoader: ComfyNodeSchemaJSON,
    DiffusersLoader: ComfyNodeSchemaJSON,
    LoadLatent: ComfyNodeSchemaJSON,
    SaveLatent: ComfyNodeSchemaJSON,
    ConditioningZeroOut: ComfyNodeSchemaJSON,
    ConditioningSetTimestepRange: ComfyNodeSchemaJSON,
    LatentAdd: ComfyNodeSchemaJSON,
    LatentSubtract: ComfyNodeSchemaJSON,
    LatentMultiply: ComfyNodeSchemaJSON,
    HypernetworkLoader: ComfyNodeSchemaJSON,
    UpscaleModelLoader: ComfyNodeSchemaJSON,
    ImageUpscaleWithModel: ComfyNodeSchemaJSON,
    ImageBlend: ComfyNodeSchemaJSON,
    ImageBlur: ComfyNodeSchemaJSON,
    ImageQuantize: ComfyNodeSchemaJSON,
    ImageSharpen: ComfyNodeSchemaJSON,
    ImageScaleToTotalPixels: ComfyNodeSchemaJSON,
    LatentCompositeMasked: ComfyNodeSchemaJSON,
    ImageCompositeMasked: ComfyNodeSchemaJSON,
    MaskToImage: ComfyNodeSchemaJSON,
    ImageToMask: ComfyNodeSchemaJSON,
    ImageColorToMask: ComfyNodeSchemaJSON,
    SolidMask: ComfyNodeSchemaJSON,
    InvertMask: ComfyNodeSchemaJSON,
    CropMask: ComfyNodeSchemaJSON,
    MaskComposite: ComfyNodeSchemaJSON,
    FeatherMask: ComfyNodeSchemaJSON,
    GrowMask: ComfyNodeSchemaJSON,
    RebatchLatents: ComfyNodeSchemaJSON,
    ModelMergeSimple: ComfyNodeSchemaJSON,
    ModelMergeBlocks: ComfyNodeSchemaJSON,
    ModelMergeSubtract: ComfyNodeSchemaJSON,
    ModelMergeAdd: ComfyNodeSchemaJSON,
    CheckpointSave: ComfyNodeSchemaJSON,
    CLIPMergeSimple: ComfyNodeSchemaJSON,
    TomePatchModel: ComfyNodeSchemaJSON,
    CLIPTextEncodeSDXLRefiner: ComfyNodeSchemaJSON,
    CLIPTextEncodeSDXL: ComfyNodeSchemaJSON,
    Canny: ComfyNodeSchemaJSON,
    FreeU: ComfyNodeSchemaJSON,
    RemoveImageBackgroundAbg: ComfyNodeSchemaJSON,
    CivitAI_Lora_Loader: ComfyNodeSchemaJSON,
    CivitAI_Checkpoint_Loader: ComfyNodeSchemaJSON,
    ImpactSAMLoader: ComfyNodeSchemaJSON,
    ImpactCLIPSegDetectorProvider: ComfyNodeSchemaJSON,
    ImpactONNXDetectorProvider: ComfyNodeSchemaJSON,
    ImpactBitwiseAndMaskForEach: ComfyNodeSchemaJSON,
    ImpactSubtractMaskForEach: ComfyNodeSchemaJSON,
    ImpactDetailerForEach: ComfyNodeSchemaJSON,
    ImpactDetailerForEachDebug: ComfyNodeSchemaJSON,
    ImpactDetailerForEachPipe: ComfyNodeSchemaJSON,
    ImpactDetailerForEachDebugPipe: ComfyNodeSchemaJSON,
    ImpactSAMDetectorCombined: ComfyNodeSchemaJSON,
    ImpactSAMDetectorSegmented: ComfyNodeSchemaJSON,
    ImpactFaceDetailer: ComfyNodeSchemaJSON,
    ImpactFaceDetailerPipe: ComfyNodeSchemaJSON,
    ImpactToDetailerPipe: ComfyNodeSchemaJSON,
    ImpactToDetailerPipeSDXL: ComfyNodeSchemaJSON,
    ImpactFromDetailerPipe: ComfyNodeSchemaJSON,
    ImpactFromDetailerPipe_v2: ComfyNodeSchemaJSON,
    ImpactFromDetailerPipeSDXL: ComfyNodeSchemaJSON,
    ImpactToBasicPipe: ComfyNodeSchemaJSON,
    ImpactFromBasicPipe: ComfyNodeSchemaJSON,
    ImpactFromBasicPipe_v2: ComfyNodeSchemaJSON,
    ImpactBasicPipeToDetailerPipe: ComfyNodeSchemaJSON,
    ImpactBasicPipeToDetailerPipeSDXL: ComfyNodeSchemaJSON,
    ImpactDetailerPipeToBasicPipe: ComfyNodeSchemaJSON,
    ImpactEditBasicPipe: ComfyNodeSchemaJSON,
    ImpactEditDetailerPipe: ComfyNodeSchemaJSON,
    ImpactEditDetailerPipeSDXL: ComfyNodeSchemaJSON,
    ImpactLatentPixelScale: ComfyNodeSchemaJSON,
    ImpactPixelKSampleUpscalerProvider: ComfyNodeSchemaJSON,
    ImpactPixelKSampleUpscalerProviderPipe: ComfyNodeSchemaJSON,
    ImpactIterativeLatentUpscale: ComfyNodeSchemaJSON,
    ImpactIterativeImageUpscale: ComfyNodeSchemaJSON,
    ImpactPixelTiledKSampleUpscalerProvider: ComfyNodeSchemaJSON,
    ImpactPixelTiledKSampleUpscalerProviderPipe: ComfyNodeSchemaJSON,
    ImpactTwoSamplersForMaskUpscalerProvider: ComfyNodeSchemaJSON,
    ImpactTwoSamplersForMaskUpscalerProviderPipe: ComfyNodeSchemaJSON,
    ImpactPixelKSampleHookCombine: ComfyNodeSchemaJSON,
    ImpactDenoiseScheduleHookProvider: ComfyNodeSchemaJSON,
    ImpactCfgScheduleHookProvider: ComfyNodeSchemaJSON,
    ImpactNoiseInjectionHookProvider: ComfyNodeSchemaJSON,
    ImpactNoiseInjectionDetailerHookProvider: ComfyNodeSchemaJSON,
    ImpactBitwiseAndMask: ComfyNodeSchemaJSON,
    ImpactSubtractMask: ComfyNodeSchemaJSON,
    ImpactAddMask: ComfyNodeSchemaJSON,
    ImpactSegsMask: ComfyNodeSchemaJSON,
    ImpactSegsMaskForEach: ComfyNodeSchemaJSON,
    ImpactEmptySegs: ComfyNodeSchemaJSON,
    ImpactMediaPipeFaceMeshToSEGS: ComfyNodeSchemaJSON,
    ImpactMaskToSEGS: ComfyNodeSchemaJSON,
    ImpactToBinaryMask: ComfyNodeSchemaJSON,
    ImpactMasksToMaskList: ComfyNodeSchemaJSON,
    ImpactMaskListToMaskBatch: ComfyNodeSchemaJSON,
    ImpactBboxDetectorSEGS: ComfyNodeSchemaJSON,
    ImpactSegmDetectorSEGS: ComfyNodeSchemaJSON,
    ImpactONNXDetectorSEGS: ComfyNodeSchemaJSON,
    ImpactImpactSimpleDetectorSEGS: ComfyNodeSchemaJSON,
    ImpactImpactSimpleDetectorSEGSPipe: ComfyNodeSchemaJSON,
    ImpactImpactControlNetApplySEGS: ComfyNodeSchemaJSON,
    ImpactImpactDecomposeSEGS: ComfyNodeSchemaJSON,
    ImpactImpactAssembleSEGS: ComfyNodeSchemaJSON,
    ImpactImpactFrom_SEG_ELT: ComfyNodeSchemaJSON,
    ImpactImpactEdit_SEG_ELT: ComfyNodeSchemaJSON,
    ImpactImpactDilate_Mask_SEG_ELT: ComfyNodeSchemaJSON,
    ImpactImpactDilateMask: ComfyNodeSchemaJSON,
    ImpactImpactScaleBy_BBOX_SEG_ELT: ComfyNodeSchemaJSON,
    ImpactBboxDetectorCombined_v2: ComfyNodeSchemaJSON,
    ImpactSegmDetectorCombined_v2: ComfyNodeSchemaJSON,
    ImpactSegsToCombinedMask: ComfyNodeSchemaJSON,
    ImpactKSamplerProvider: ComfyNodeSchemaJSON,
    ImpactTwoSamplersForMask: ComfyNodeSchemaJSON,
    ImpactTiledKSamplerProvider: ComfyNodeSchemaJSON,
    ImpactKSamplerAdvancedProvider: ComfyNodeSchemaJSON,
    ImpactTwoAdvancedSamplersForMask: ComfyNodeSchemaJSON,
    ImpactPreviewBridge: ComfyNodeSchemaJSON,
    ImpactImageSender: ComfyNodeSchemaJSON,
    ImpactImageReceiver: ComfyNodeSchemaJSON,
    ImpactLatentSender: ComfyNodeSchemaJSON,
    ImpactLatentReceiver: ComfyNodeSchemaJSON,
    ImpactImageMaskSwitch: ComfyNodeSchemaJSON,
    ImpactLatentSwitch: ComfyNodeSchemaJSON,
    ImpactSEGSSwitch: ComfyNodeSchemaJSON,
    ImpactImpactSwitch: ComfyNodeSchemaJSON,
    ImpactImpactInversedSwitch: ComfyNodeSchemaJSON,
    ImpactImpactWildcardProcessor: ComfyNodeSchemaJSON,
    ImpactImpactWildcardEncode: ComfyNodeSchemaJSON,
    ImpactSEGSDetailer: ComfyNodeSchemaJSON,
    ImpactSEGSPaste: ComfyNodeSchemaJSON,
    ImpactSEGSPreview: ComfyNodeSchemaJSON,
    ImpactSEGSToImageList: ComfyNodeSchemaJSON,
    ImpactImpactSEGSToMaskList: ComfyNodeSchemaJSON,
    ImpactImpactSEGSToMaskBatch: ComfyNodeSchemaJSON,
    ImpactImpactSEGSConcat: ComfyNodeSchemaJSON,
    ImpactKSamplerBasicPipe: ComfyNodeSchemaJSON,
    ImpactKSamplerAdvancedBasicPipe: ComfyNodeSchemaJSON,
    ImpactReencodeLatent: ComfyNodeSchemaJSON,
    ImpactReencodeLatentPipe: ComfyNodeSchemaJSON,
    ImpactImpactImageBatchToImageList: ComfyNodeSchemaJSON,
    ImpactImpactMakeImageList: ComfyNodeSchemaJSON,
    ImpactRegionalSampler: ComfyNodeSchemaJSON,
    ImpactCombineRegionalPrompts: ComfyNodeSchemaJSON,
    ImpactRegionalPrompt: ComfyNodeSchemaJSON,
    ImpactImpactSEGSLabelFilter: ComfyNodeSchemaJSON,
    ImpactImpactSEGSRangeFilter: ComfyNodeSchemaJSON,
    ImpactImpactSEGSOrderedFilter: ComfyNodeSchemaJSON,
    ImpactImpactCompare: ComfyNodeSchemaJSON,
    ImpactImpactConditionalBranch: ComfyNodeSchemaJSON,
    ImpactImpactInt: ComfyNodeSchemaJSON,
    ImpactImpactValueSender: ComfyNodeSchemaJSON,
    ImpactImpactValueReceiver: ComfyNodeSchemaJSON,
    ImpactImpactImageInfo: ComfyNodeSchemaJSON,
    ImpactImpactMinMax: ComfyNodeSchemaJSON,
    ImpactImpactNeg: ComfyNodeSchemaJSON,
    ImpactImpactConditionalStopIteration: ComfyNodeSchemaJSON,
    ImpactImpactStringSelector: ComfyNodeSchemaJSON,
    ImpactRemoveNoiseMask: ComfyNodeSchemaJSON,
    ImpactImpactLogger: ComfyNodeSchemaJSON,
    ImpactImpactDummyInput: ComfyNodeSchemaJSON,
    ImpactUltralyticsDetectorProvider: ComfyNodeSchemaJSON,
    XYInputLoraBlockWeightInspire: ComfyNodeSchemaJSON,
    LoraLoaderBlockWeightInspire: ComfyNodeSchemaJSON,
    LoraBlockInfoInspire: ComfyNodeSchemaJSON,
    OpenPose_Preprocessor_Provider_for_SEGSInspire: ComfyNodeSchemaJSON,
    DWPreprocessor_Provider_for_SEGSInspire: ComfyNodeSchemaJSON,
    MiDaS_DepthMap_Preprocessor_Provider_for_SEGSInspire: ComfyNodeSchemaJSON,
    LeRes_DepthMap_Preprocessor_Provider_for_SEGSInspire: ComfyNodeSchemaJSON,
    Canny_Preprocessor_Provider_for_SEGSInspire: ComfyNodeSchemaJSON,
    MediaPipe_FaceMesh_Preprocessor_Provider_for_SEGSInspire: ComfyNodeSchemaJSON,
    MediaPipeFaceMeshDetectorProviderInspire: ComfyNodeSchemaJSON,
    HEDPreprocessor_Provider_for_SEGSInspire: ComfyNodeSchemaJSON,
    FakeScribblePreprocessor_Provider_for_SEGSInspire: ComfyNodeSchemaJSON,
    KSamplerInspire: ComfyNodeSchemaJSON,
    LoadPromptsFromDirInspire: ComfyNodeSchemaJSON,
    UnzipPromptInspire: ComfyNodeSchemaJSON,
    ZipPromptInspire: ComfyNodeSchemaJSON,
    PromptExtractorInspire: ComfyNodeSchemaJSON,
    GlobalSeedInspire: ComfyNodeSchemaJSON,
    BNK_TiledKSamplerAdvanced: ComfyNodeSchemaJSON,
    BNK_TiledKSampler: ComfyNodeSchemaJSON,
    KSamplerEfficient: ComfyNodeSchemaJSON,
    KSamplerAdvEfficient: ComfyNodeSchemaJSON,
    KSamplerSDXLEff: ComfyNodeSchemaJSON,
    EfficientLoader: ComfyNodeSchemaJSON,
    EffLoaderSDXL: ComfyNodeSchemaJSON,
    LoRAStacker: ComfyNodeSchemaJSON,
    ControlNetStacker: ComfyNodeSchemaJSON,
    ApplyControlNetStack: ComfyNodeSchemaJSON,
    UnpackSDXLTuple: ComfyNodeSchemaJSON,
    PackSDXLTuple: ComfyNodeSchemaJSON,
    XYPlot: ComfyNodeSchemaJSON,
    XYInputSeedsBatch: ComfyNodeSchemaJSON,
    XYInputAddReturnNoise: ComfyNodeSchemaJSON,
    XYInputSteps: ComfyNodeSchemaJSON,
    XYInputCFGScale: ComfyNodeSchemaJSON,
    XYInputSamplerScheduler: ComfyNodeSchemaJSON,
    XYInputDenoise: ComfyNodeSchemaJSON,
    XYInputVAE: ComfyNodeSchemaJSON,
    XYInputPromptSR: ComfyNodeSchemaJSON,
    XYInputAestheticScore: ComfyNodeSchemaJSON,
    XYInputRefinerOnOff: ComfyNodeSchemaJSON,
    XYInputCheckpoint: ComfyNodeSchemaJSON,
    XYInputClipSkip: ComfyNodeSchemaJSON,
    XYInputLoRA: ComfyNodeSchemaJSON,
    XYInputLoRAPlot: ComfyNodeSchemaJSON,
    XYInputLoRAStacks: ComfyNodeSchemaJSON,
    XYInputControlNet: ComfyNodeSchemaJSON,
    XYInputControlNetPlot: ComfyNodeSchemaJSON,
    XYInputManualXYEntry: ComfyNodeSchemaJSON,
    ManualXYEntryInfo: ComfyNodeSchemaJSON,
    JoinXYInputsOfSameType: ComfyNodeSchemaJSON,
    ImageOverlay: ComfyNodeSchemaJSON,
    HighResFixScript: ComfyNodeSchemaJSON,
    EvaluateIntegers: ComfyNodeSchemaJSON,
    EvaluateFloats: ComfyNodeSchemaJSON,
    EvaluateStrings: ComfyNodeSchemaJSON,
    SimpleEvalExamples: ComfyNodeSchemaJSON,
    LatentByRatio: ComfyNodeSchemaJSON,
    MasqueradeMaskByText: ComfyNodeSchemaJSON,
    MasqueradeMaskMorphology: ComfyNodeSchemaJSON,
    MasqueradeCombineMasks: ComfyNodeSchemaJSON,
    MasqueradeUnaryMaskOp: ComfyNodeSchemaJSON,
    MasqueradeUnaryImageOp: ComfyNodeSchemaJSON,
    MasqueradeBlur: ComfyNodeSchemaJSON,
    MasqueradeImageToMask: ComfyNodeSchemaJSON,
    MasqueradeMixImagesByMask: ComfyNodeSchemaJSON,
    MasqueradeMixColorByMask: ComfyNodeSchemaJSON,
    MasqueradeMaskToRegion: ComfyNodeSchemaJSON,
    MasqueradeCutByMask: ComfyNodeSchemaJSON,
    MasqueradePasteByMask: ComfyNodeSchemaJSON,
    MasqueradeGetImageSize: ComfyNodeSchemaJSON,
    MasqueradeChangeChannelCount: ComfyNodeSchemaJSON,
    MasqueradeConstantMask: ComfyNodeSchemaJSON,
    MasqueradePruneByMask: ComfyNodeSchemaJSON,
    MasqueradeSeparateMaskComponents: ComfyNodeSchemaJSON,
    MasqueradeCreateRectMask: ComfyNodeSchemaJSON,
    MasqueradeMakeImageBatch: ComfyNodeSchemaJSON,
    MasqueradeCreateQRCode: ComfyNodeSchemaJSON,
    MasqueradeConvertColorSpace: ComfyNodeSchemaJSON,
    MasqueradeMasqueradeIncrementer: ComfyNodeSchemaJSON,
    ImageRemoveBackgroundRembg: ComfyNodeSchemaJSON,
    SDXLMixSampler: ComfyNodeSchemaJSON,
    WASBLIPModelLoader: ComfyNodeSchemaJSON,
    WASBlendLatents: ComfyNodeSchemaJSON,
    WASCacheNode: ComfyNodeSchemaJSON,
    WASCheckpointLoader: ComfyNodeSchemaJSON,
    WASCheckpointLoaderSimple: ComfyNodeSchemaJSON,
    WASCLIPTextEncodeNSP: ComfyNodeSchemaJSON,
    WASCLIPInputSwitch: ComfyNodeSchemaJSON,
    WASCLIPVisionInputSwitch: ComfyNodeSchemaJSON,
    WASConditioningInputSwitch: ComfyNodeSchemaJSON,
    WASConstantNumber: ComfyNodeSchemaJSON,
    WASCreateGridImage: ComfyNodeSchemaJSON,
    WASCreateMorphImage: ComfyNodeSchemaJSON,
    WASCreateMorphImageFromPath: ComfyNodeSchemaJSON,
    WASCreateVideoFromPath: ComfyNodeSchemaJSON,
    WASCLIPSegMasking: ComfyNodeSchemaJSON,
    WASCLIPSegModelLoader: ComfyNodeSchemaJSON,
    WASCLIPSegBatchMasking: ComfyNodeSchemaJSON,
    WASConvertMasksToImages: ComfyNodeSchemaJSON,
    WASControlNetModelInputSwitch: ComfyNodeSchemaJSON,
    WASDebugNumberToConsole: ComfyNodeSchemaJSON,
    WASDictionaryToConsole: ComfyNodeSchemaJSON,
    WASDiffusersModelLoader: ComfyNodeSchemaJSON,
    WASDiffusersHubModelDownLoader: ComfyNodeSchemaJSON,
    WASExportAPI: ComfyNodeSchemaJSON,
    WASLatentInputSwitch: ComfyNodeSchemaJSON,
    WASLoadCache: ComfyNodeSchemaJSON,
    WASLogicBoolean: ComfyNodeSchemaJSON,
    WASLoraLoader: ComfyNodeSchemaJSON,
    WASImageSSAOAmbientOcclusion: ComfyNodeSchemaJSON,
    WASImageSSDODirectOcclusion: ComfyNodeSchemaJSON,
    WASImageAnalyze: ComfyNodeSchemaJSON,
    WASImageAspectRatio: ComfyNodeSchemaJSON,
    WASImageBatch: ComfyNodeSchemaJSON,
    WASImageBlank: ComfyNodeSchemaJSON,
    WASImageBlendByMask: ComfyNodeSchemaJSON,
    WASImageBlend: ComfyNodeSchemaJSON,
    WASImageBlendingMode: ComfyNodeSchemaJSON,
    WASImageBloomFilter: ComfyNodeSchemaJSON,
    WASImageCannyFilter: ComfyNodeSchemaJSON,
    WASImageChromaticAberration: ComfyNodeSchemaJSON,
    WASImageColorPalette: ComfyNodeSchemaJSON,
    WASImageCropFace: ComfyNodeSchemaJSON,
    WASImageCropLocation: ComfyNodeSchemaJSON,
    WASImageCropSquareLocation: ComfyNodeSchemaJSON,
    WASImageDisplacementWarp: ComfyNodeSchemaJSON,
    WASImageLucySharpen: ComfyNodeSchemaJSON,
    WASImagePasteFace: ComfyNodeSchemaJSON,
    WASImagePasteCrop: ComfyNodeSchemaJSON,
    WASImagePasteCropByLocation: ComfyNodeSchemaJSON,
    WASImagePixelate: ComfyNodeSchemaJSON,
    WASImagePowerNoise: ComfyNodeSchemaJSON,
    WASImageDraganPhotographyFilter: ComfyNodeSchemaJSON,
    WASImageEdgeDetectionFilter: ComfyNodeSchemaJSON,
    WASImageFilmGrain: ComfyNodeSchemaJSON,
    WASImageFilterAdjustments: ComfyNodeSchemaJSON,
    WASImageFlip: ComfyNodeSchemaJSON,
    WASImageGradientMap: ComfyNodeSchemaJSON,
    WASImageGenerateGradient: ComfyNodeSchemaJSON,
    WASImageHighPassFilter: ComfyNodeSchemaJSON,
    WASImageHistoryLoader: ComfyNodeSchemaJSON,
    WASImageInputSwitch: ComfyNodeSchemaJSON,
    WASImageLevelsAdjustment: ComfyNodeSchemaJSON,
    WASImageLoad: ComfyNodeSchemaJSON,
    WASImageMedianFilter: ComfyNodeSchemaJSON,
    WASImageMixRGBChannels: ComfyNodeSchemaJSON,
    WASImageMonitorEffectsFilter: ComfyNodeSchemaJSON,
    WASImageNovaFilter: ComfyNodeSchemaJSON,
    WASImagePadding: ComfyNodeSchemaJSON,
    WASImagePerlinNoise: ComfyNodeSchemaJSON,
    WASImageRembgRemoveBackground: ComfyNodeSchemaJSON,
    WASImagePerlinPowerFractal: ComfyNodeSchemaJSON,
    WASImageRemoveBackgroundAlpha: ComfyNodeSchemaJSON,
    WASImageRemoveColor: ComfyNodeSchemaJSON,
    WASImageResize: ComfyNodeSchemaJSON,
    WASImageRotate: ComfyNodeSchemaJSON,
    WASImageRotateHue: ComfyNodeSchemaJSON,
    WASImageSave: ComfyNodeSchemaJSON,
    WASImageSeamlessTexture: ComfyNodeSchemaJSON,
    WASImageSelectChannel: ComfyNodeSchemaJSON,
    WASImageSelectColor: ComfyNodeSchemaJSON,
    WASImageShadowsAndHighlights: ComfyNodeSchemaJSON,
    WASImageSizeToNumber: ComfyNodeSchemaJSON,
    WASImageStitch: ComfyNodeSchemaJSON,
    WASImageStyleFilter: ComfyNodeSchemaJSON,
    WASImageThreshold: ComfyNodeSchemaJSON,
    WASImageTiled: ComfyNodeSchemaJSON,
    WASImageTranspose: ComfyNodeSchemaJSON,
    WASImageFDOFFilter: ComfyNodeSchemaJSON,
    WASImageToLatentMask: ComfyNodeSchemaJSON,
    WASImageToNoise: ComfyNodeSchemaJSON,
    WASImageToSeed: ComfyNodeSchemaJSON,
    WASImagesToRGB: ComfyNodeSchemaJSON,
    WASImagesToLinear: ComfyNodeSchemaJSON,
    WASIntegerPlaceCounter: ComfyNodeSchemaJSON,
    WASImageVoronoiNoiseFilter: ComfyNodeSchemaJSON,
    WASKSamplerWAS: ComfyNodeSchemaJSON,
    WASKSamplerCycle: ComfyNodeSchemaJSON,
    WASLatentNoiseInjection: ComfyNodeSchemaJSON,
    WASLatentSizeToNumber: ComfyNodeSchemaJSON,
    WASLatentUpscaleByFactorWAS: ComfyNodeSchemaJSON,
    WASLoadImageBatch: ComfyNodeSchemaJSON,
    WASLoadTextFile: ComfyNodeSchemaJSON,
    WASLoadLora: ComfyNodeSchemaJSON,
    WASMasksAdd: ComfyNodeSchemaJSON,
    WASMasksSubtract: ComfyNodeSchemaJSON,
    WASMaskArbitraryRegion: ComfyNodeSchemaJSON,
    WASMaskBatchToMask: ComfyNodeSchemaJSON,
    WASMaskBatch: ComfyNodeSchemaJSON,
    WASMaskCeilingRegion: ComfyNodeSchemaJSON,
    WASMaskCropDominantRegion: ComfyNodeSchemaJSON,
    WASMaskCropMinorityRegion: ComfyNodeSchemaJSON,
    WASMaskCropRegion: ComfyNodeSchemaJSON,
    WASMaskPasteRegion: ComfyNodeSchemaJSON,
    WASMaskDilateRegion: ComfyNodeSchemaJSON,
    WASMaskDominantRegion: ComfyNodeSchemaJSON,
    WASMaskErodeRegion: ComfyNodeSchemaJSON,
    WASMaskFillHoles: ComfyNodeSchemaJSON,
    WASMaskFloorRegion: ComfyNodeSchemaJSON,
    WASMaskGaussianRegion: ComfyNodeSchemaJSON,
    WASMaskInvert: ComfyNodeSchemaJSON,
    WASMaskMinorityRegion: ComfyNodeSchemaJSON,
    WASMaskSmoothRegion: ComfyNodeSchemaJSON,
    WASMaskThresholdRegion: ComfyNodeSchemaJSON,
    WASMasksCombineRegions: ComfyNodeSchemaJSON,
    WASMasksCombineBatch: ComfyNodeSchemaJSON,
    WASMiDaSModelLoader: ComfyNodeSchemaJSON,
    WASMiDaSDepthApproximation: ComfyNodeSchemaJSON,
    WASMiDaSMaskImage: ComfyNodeSchemaJSON,
    WASModelInputSwitch: ComfyNodeSchemaJSON,
    WASNumberCounter: ComfyNodeSchemaJSON,
    WASNumberOperation: ComfyNodeSchemaJSON,
    WASNumberToFloat: ComfyNodeSchemaJSON,
    WASNumberInputSwitch: ComfyNodeSchemaJSON,
    WASNumberInputCondition: ComfyNodeSchemaJSON,
    WASNumberMultipleOf: ComfyNodeSchemaJSON,
    WASNumberPI: ComfyNodeSchemaJSON,
    WASNumberToInt: ComfyNodeSchemaJSON,
    WASNumberToSeed: ComfyNodeSchemaJSON,
    WASNumberToString: ComfyNodeSchemaJSON,
    WASNumberToText: ComfyNodeSchemaJSON,
    WASPromptStylesSelector: ComfyNodeSchemaJSON,
    WASPromptMultipleStylesSelector: ComfyNodeSchemaJSON,
    WASRandomNumber: ComfyNodeSchemaJSON,
    WASSaveTextFile: ComfyNodeSchemaJSON,
    WASSeed: ComfyNodeSchemaJSON,
    WASTensorBatchToImage: ComfyNodeSchemaJSON,
    WASBLIPAnalyzeImage: ComfyNodeSchemaJSON,
    WASSAMModelLoader: ComfyNodeSchemaJSON,
    WASSAMParameters: ComfyNodeSchemaJSON,
    WASSAMParametersCombine: ComfyNodeSchemaJSON,
    WASSAMImageMask: ComfyNodeSchemaJSON,
    WASSamplesPassthroughStatSystem: ComfyNodeSchemaJSON,
    WASStringToText: ComfyNodeSchemaJSON,
    WASImageBounds: ComfyNodeSchemaJSON,
    WASInsetImageBounds: ComfyNodeSchemaJSON,
    WASBoundedImageBlend: ComfyNodeSchemaJSON,
    WASBoundedImageBlendWithMask: ComfyNodeSchemaJSON,
    WASBoundedImageCrop: ComfyNodeSchemaJSON,
    WASBoundedImageCropWithMask: ComfyNodeSchemaJSON,
    WASTextDictionaryUpdate: ComfyNodeSchemaJSON,
    WASTextAddTokens: ComfyNodeSchemaJSON,
    WASTextAddTokenByInput: ComfyNodeSchemaJSON,
    WASTextCompare: ComfyNodeSchemaJSON,
    WASTextConcatenate: ComfyNodeSchemaJSON,
    WASTextFileHistoryLoader: ComfyNodeSchemaJSON,
    WASTextFindAndReplaceByDictionary: ComfyNodeSchemaJSON,
    WASTextFindAndReplaceInput: ComfyNodeSchemaJSON,
    WASTextFindAndReplace: ComfyNodeSchemaJSON,
    WASTextInputSwitch: ComfyNodeSchemaJSON,
    WASTextList: ComfyNodeSchemaJSON,
    WASTextListConcatenate: ComfyNodeSchemaJSON,
    WASTextLoadLineFromFile: ComfyNodeSchemaJSON,
    WASTextMultiline: ComfyNodeSchemaJSON,
    WASTextParseA1111Embeddings: ComfyNodeSchemaJSON,
    WASTextParseNoodleSoupPrompts: ComfyNodeSchemaJSON,
    WASTextParseTokens: ComfyNodeSchemaJSON,
    WASTextRandomLine: ComfyNodeSchemaJSON,
    WASTextRandomPrompt: ComfyNodeSchemaJSON,
    WASTextString: ComfyNodeSchemaJSON,
    WASTextShuffle: ComfyNodeSchemaJSON,
    WASTextToConditioning: ComfyNodeSchemaJSON,
    WASTextToConsole: ComfyNodeSchemaJSON,
    WASTextToNumber: ComfyNodeSchemaJSON,
    WASTextToString: ComfyNodeSchemaJSON,
    WASTextStringTruncate: ComfyNodeSchemaJSON,
    WASTrueRandomOrgNumberGenerator: ComfyNodeSchemaJSON,
    WASUnCLIPCheckpointLoader: ComfyNodeSchemaJSON,
    WASUpscaleModelLoader: ComfyNodeSchemaJSON,
    WASUpscaleModelSwitch: ComfyNodeSchemaJSON,
    WASWriteToGIF: ComfyNodeSchemaJSON,
    WASWriteToVideo: ComfyNodeSchemaJSON,
    WASVAEInputSwitch: ComfyNodeSchemaJSON,
    WASVideoDumpFrames: ComfyNodeSchemaJSON,
}
export type ComfyNodeType = keyof Schemas
}
