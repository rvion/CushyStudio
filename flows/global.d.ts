import type { ComfyNode } from '../src/core/Node'
import type { Slot } from '../src/core/Slot'
import type { ComfyNodeSchemaJSON } from '../src/types/ComfySchemaJSON'
import type { ComfyNodeUID } from '../src/types/NodeUID'
import type { ActionType } from '../src/core/Requirement'
declare global {
    const action: ActionType

    // Entrypoint --------------------------
    export interface ComfySetup {
        /* category=sampling output=LATENT */
        KSampler(args: KSampler_input, uid?: ComfyNodeUID): KSampler
        /* category=loaders output=MODEL, CLIP, VAE */
        CheckpointLoaderSimple(args: CheckpointLoaderSimple_input, uid?: ComfyNodeUID): CheckpointLoaderSimple
        /* category=conditioning output=CONDITIONING */
        CLIPTextEncode(args: CLIPTextEncode_input, uid?: ComfyNodeUID): CLIPTextEncode
        /* category=conditioning output=CLIP */
        CLIPSetLastLayer(args: CLIPSetLastLayer_input, uid?: ComfyNodeUID): CLIPSetLastLayer
        /* category=latent output=IMAGE */
        VAEDecode(args: VAEDecode_input, uid?: ComfyNodeUID): VAEDecode
        /* category=latent output=LATENT */
        VAEEncode(args: VAEEncode_input, uid?: ComfyNodeUID): VAEEncode
        /* category=latent_inpaint output=LATENT */
        VAEEncodeForInpaint(args: VAEEncodeForInpaint_input, uid?: ComfyNodeUID): VAEEncodeForInpaint
        /* category=loaders output=VAE */
        VAELoader(args: VAELoader_input, uid?: ComfyNodeUID): VAELoader
        /* category=latent output=LATENT */
        EmptyLatentImage(args: EmptyLatentImage_input, uid?: ComfyNodeUID): EmptyLatentImage
        /* category=latent output=LATENT */
        LatentUpscale(args: LatentUpscale_input, uid?: ComfyNodeUID): LatentUpscale
        /* category=latent output=LATENT */
        LatentUpscaleBy(args: LatentUpscaleBy_input, uid?: ComfyNodeUID): LatentUpscaleBy
        /* category=latent_batch output=LATENT */
        LatentFromBatch(args: LatentFromBatch_input, uid?: ComfyNodeUID): LatentFromBatch
        /* category=latent_batch output=LATENT */
        RepeatLatentBatch(args: RepeatLatentBatch_input, uid?: ComfyNodeUID): RepeatLatentBatch
        /* category=image output= */
        SaveImage(args: SaveImage_input, uid?: ComfyNodeUID): SaveImage
        /* category=image output= */
        PreviewImage(args: PreviewImage_input, uid?: ComfyNodeUID): PreviewImage
        /* category=image output=IMAGE, MASK */
        LoadImage(args: LoadImage_input, uid?: ComfyNodeUID): LoadImage
        /* category=mask output=MASK */
        LoadImageMask(args: LoadImageMask_input, uid?: ComfyNodeUID): LoadImageMask
        /* category=image output=IMAGE, MASK */
        ImagePadForOutpaint(args: ImagePadForOutpaint_input, uid?: ComfyNodeUID): ImagePadForOutpaint
        /* category=conditioning output=CONDITIONING */
        ConditioningAverage(args: ConditioningAverage_input, uid?: ComfyNodeUID): ConditioningAverage
        /* category=conditioning output=CONDITIONING */
        ConditioningCombine(args: ConditioningCombine_input, uid?: ComfyNodeUID): ConditioningCombine
        /* category=conditioning output=CONDITIONING */
        ConditioningSetArea(args: ConditioningSetArea_input, uid?: ComfyNodeUID): ConditioningSetArea
        /* category=conditioning output=CONDITIONING */
        ConditioningSetMask(args: ConditioningSetMask_input, uid?: ComfyNodeUID): ConditioningSetMask
        /* category=sampling output=LATENT */
        KSamplerAdvanced(args: KSamplerAdvanced_input, uid?: ComfyNodeUID): KSamplerAdvanced
        /* category=latent_inpaint output=LATENT */
        SetLatentNoiseMask(args: SetLatentNoiseMask_input, uid?: ComfyNodeUID): SetLatentNoiseMask
        /* category=latent output=LATENT */
        LatentComposite(args: LatentComposite_input, uid?: ComfyNodeUID): LatentComposite
        /* category=latent_transform output=LATENT */
        LatentRotate(args: LatentRotate_input, uid?: ComfyNodeUID): LatentRotate
        /* category=latent_transform output=LATENT */
        LatentFlip(args: LatentFlip_input, uid?: ComfyNodeUID): LatentFlip
        /* category=latent_transform output=LATENT */
        LatentCrop(args: LatentCrop_input, uid?: ComfyNodeUID): LatentCrop
        /* category=loaders output=MODEL, CLIP */
        LoraLoader(args: LoraLoader_input, uid?: ComfyNodeUID): LoraLoader
        /* category=advanced_loaders output=CLIP */
        CLIPLoader(args: CLIPLoader_input, uid?: ComfyNodeUID): CLIPLoader
        /* category=advanced_loaders output=CLIP */
        DualCLIPLoader(args: DualCLIPLoader_input, uid?: ComfyNodeUID): DualCLIPLoader
        /* category=conditioning output=CLIP_VISION_OUTPUT */
        CLIPVisionEncode(args: CLIPVisionEncode_input, uid?: ComfyNodeUID): CLIPVisionEncode
        /* category=conditioning_style_model output=CONDITIONING */
        StyleModelApply(args: StyleModelApply_input, uid?: ComfyNodeUID): StyleModelApply
        /* category=conditioning output=CONDITIONING */
        UnCLIPConditioning(args: UnCLIPConditioning_input, uid?: ComfyNodeUID): UnCLIPConditioning
        /* category=conditioning output=CONDITIONING */
        ControlNetApply(args: ControlNetApply_input, uid?: ComfyNodeUID): ControlNetApply
        /* category=loaders output=CONTROL_NET */
        ControlNetLoader(args: ControlNetLoader_input, uid?: ComfyNodeUID): ControlNetLoader
        /* category=loaders output=CONTROL_NET */
        DiffControlNetLoader(args: DiffControlNetLoader_input, uid?: ComfyNodeUID): DiffControlNetLoader
        /* category=loaders output=STYLE_MODEL */
        StyleModelLoader(args: StyleModelLoader_input, uid?: ComfyNodeUID): StyleModelLoader
        /* category=loaders output=CLIP_VISION */
        CLIPVisionLoader(args: CLIPVisionLoader_input, uid?: ComfyNodeUID): CLIPVisionLoader
        /* category=latent output=IMAGE */
        VAEDecodeTiled(args: VAEDecodeTiled_input, uid?: ComfyNodeUID): VAEDecodeTiled
        /* category=latent output=LATENT */
        VAEEncodeTiled(args: VAEEncodeTiled_input, uid?: ComfyNodeUID): VAEEncodeTiled
        /* category=loaders output=MODEL, CLIP, VAE, CLIP_VISION */
        UnCLIPCheckpointLoader(args: UnCLIPCheckpointLoader_input, uid?: ComfyNodeUID): UnCLIPCheckpointLoader
        /* category=loaders output=GLIGEN */
        GLIGENLoader(args: GLIGENLoader_input, uid?: ComfyNodeUID): GLIGENLoader
        /* category=conditioning_gligen output=CONDITIONING */
        GLIGENTextBoxApply(args: GLIGENTextBoxApply_input, uid?: ComfyNodeUID): GLIGENTextBoxApply
        /* category=advanced_loaders output=MODEL, CLIP, VAE */
        CheckpointLoader(args: CheckpointLoader_input, uid?: ComfyNodeUID): CheckpointLoader
        /* category=advanced_loaders output=MODEL, CLIP, VAE */
        DiffusersLoader(args: DiffusersLoader_input, uid?: ComfyNodeUID): DiffusersLoader
        /* category=loaders output=MODEL */
        HypernetworkLoader(args: HypernetworkLoader_input, uid?: ComfyNodeUID): HypernetworkLoader
        /* category=loaders output=UPSCALE_MODEL */
        UpscaleModelLoader(args: UpscaleModelLoader_input, uid?: ComfyNodeUID): UpscaleModelLoader
        /* category=image_upscaling output=IMAGE */
        ImageUpscaleWithModel(args: ImageUpscaleWithModel_input, uid?: ComfyNodeUID): ImageUpscaleWithModel
        /* category=latent output=LATENT */
        LatentCompositeMasked(args: LatentCompositeMasked_input, uid?: ComfyNodeUID): LatentCompositeMasked
        /* category=mask output=IMAGE */
        MaskToImage(args: MaskToImage_input, uid?: ComfyNodeUID): MaskToImage
        /* category=mask output=MASK */
        ImageToMask(args: ImageToMask_input, uid?: ComfyNodeUID): ImageToMask
        /* category=mask output=MASK */
        SolidMask(args: SolidMask_input, uid?: ComfyNodeUID): SolidMask
        /* category=mask output=MASK */
        InvertMask(args: InvertMask_input, uid?: ComfyNodeUID): InvertMask
        /* category=mask output=MASK */
        CropMask(args: CropMask_input, uid?: ComfyNodeUID): CropMask
        /* category=mask output=MASK */
        MaskComposite(args: MaskComposite_input, uid?: ComfyNodeUID): MaskComposite
        /* category=mask output=MASK */
        FeatherMask(args: FeatherMask_input, uid?: ComfyNodeUID): FeatherMask
        /* category=latent_batch output=LATENT */
        RebatchLatents(args: RebatchLatents_input, uid?: ComfyNodeUID): RebatchLatents
        /* category=Image Processing output=IMAGE */
        BrightnessContrast(args: BrightnessContrast_input, uid?: ComfyNodeUID): BrightnessContrast
        /* category=image output=MASK, IMAGE, IMAGE_1 */
        CLIPSeg(args: CLIPSeg_input, uid?: ComfyNodeUID): CLIPSeg
        /* category=image output=MASK, IMAGE, IMAGE_1 */
        CombineSegMasks(args: CombineSegMasks_input, uid?: ComfyNodeUID): CombineSegMasks
        /* category=image_alpha output=IMAGE */
        AlphaChanelAdd(args: AlphaChanelAdd_input, uid?: ComfyNodeUID): AlphaChanelAdd
        /* category=image_alpha output=IMAGE */
        AlphaChanelAddByMask(args: AlphaChanelAddByMask_input, uid?: ComfyNodeUID): AlphaChanelAddByMask
        /* category=image_alpha output=MASK */
        AlphaChanelAsMask(args: AlphaChanelAsMask_input, uid?: ComfyNodeUID): AlphaChanelAsMask
        /* category=image_alpha output=IMAGE */
        AlphaChanelRestore(args: AlphaChanelRestore_input, uid?: ComfyNodeUID): AlphaChanelRestore
        /* category=image_alpha output=IMAGE */
        AlphaChanelRemove(args: AlphaChanelRemove_input, uid?: ComfyNodeUID): AlphaChanelRemove
        /* category=clamp output=CLIP */
        ClipClamp(args: ClipClamp_input, uid?: ComfyNodeUID): ClipClamp
        /* category=clamp output=CLIP_VISION */
        ClipVisionClamp(args: ClipVisionClamp_input, uid?: ComfyNodeUID): ClipVisionClamp
        /* category=clamp output=CLIP_VISION_OUTPUT */
        ClipVisionOutputClamp(args: ClipVisionOutputClamp_input, uid?: ComfyNodeUID): ClipVisionOutputClamp
        /* category=clamp output=CONDITIONING */
        ConditioningClamp(args: ConditioningClamp_input, uid?: ComfyNodeUID): ConditioningClamp
        /* category=clamp output=CONTROL_NET */
        ControlNetClamp(args: ControlNetClamp_input, uid?: ComfyNodeUID): ControlNetClamp
        /* category=clamp output=GLIGEN */
        GligenClamp(args: GligenClamp_input, uid?: ComfyNodeUID): GligenClamp
        /* category=clamp output=IMAGE */
        ImageClamp(args: ImageClamp_input, uid?: ComfyNodeUID): ImageClamp
        /* category=clamp output=LATENT */
        LatentClamp(args: LatentClamp_input, uid?: ComfyNodeUID): LatentClamp
        /* category=clamp output=MASK */
        MaskClamp(args: MaskClamp_input, uid?: ComfyNodeUID): MaskClamp
        /* category=clamp output=MODEL */
        ModelClamp(args: ModelClamp_input, uid?: ComfyNodeUID): ModelClamp
        /* category=clamp output=STYLE_MODEL */
        StyleModelClamp(args: StyleModelClamp_input, uid?: ComfyNodeUID): StyleModelClamp
        /* category=clamp output=UPSCALE_MODEL */
        UpscaleModelClamp(args: UpscaleModelClamp_input, uid?: ComfyNodeUID): UpscaleModelClamp
        /* category=clamp output=VAE */
        VaeClamp(args: VaeClamp_input, uid?: ComfyNodeUID): VaeClamp
        /* category=image_batch output=IMAGE */
        ImageBatchGet(args: ImageBatchGet_input, uid?: ComfyNodeUID): ImageBatchGet
        /* category=image_batch output=IMAGE */
        ImageBatchRemove(args: ImageBatchRemove_input, uid?: ComfyNodeUID): ImageBatchRemove
        /* category=image_batch output=IMAGE, IMAGE_1 */
        ImageBatchFork(args: ImageBatchFork_input, uid?: ComfyNodeUID): ImageBatchFork
        /* category=image_batch output=IMAGE */
        ImageBatchJoin(args: ImageBatchJoin_input, uid?: ComfyNodeUID): ImageBatchJoin
        /* category=image_composite output=IMAGE */
        ImageCompositeAbsolute(args: ImageCompositeAbsolute_input, uid?: ComfyNodeUID): ImageCompositeAbsolute
        /* category=image_composite output=IMAGE */
        ImageCompositeAbsoluteByContainer(
            args: ImageCompositeAbsoluteByContainer_input,
            uid?: ComfyNodeUID,
        ): ImageCompositeAbsoluteByContainer
        /* category=image_composite output=IMAGE */
        ImageCompositeRelative(args: ImageCompositeRelative_input, uid?: ComfyNodeUID): ImageCompositeRelative
        /* category=image_composite output=IMAGE */
        ImageCompositeRelativeByContainer(
            args: ImageCompositeRelativeByContainer_input,
            uid?: ComfyNodeUID,
        ): ImageCompositeRelativeByContainer
        /* category=image_container output=IMAGE */
        ImageContainer(args: ImageContainer_input, uid?: ComfyNodeUID): ImageContainer
        /* category=image_container output=IMAGE */
        ImageContainerInheritanceAdd(args: ImageContainerInheritanceAdd_input, uid?: ComfyNodeUID): ImageContainerInheritanceAdd
        /* category=image_container output=IMAGE */
        ImageContainerInheritanceScale(
            args: ImageContainerInheritanceScale_input,
            uid?: ComfyNodeUID,
        ): ImageContainerInheritanceScale
        /* category=image_container output=IMAGE */
        ImageContainerInheritanceMax(args: ImageContainerInheritanceMax_input, uid?: ComfyNodeUID): ImageContainerInheritanceMax
        /* category=image_container output=IMAGE */
        ImageContainerInheritanceSum(args: ImageContainerInheritanceSum_input, uid?: ComfyNodeUID): ImageContainerInheritanceSum
        /* category=image_draw output=IMAGE */
        ImageDrawArc(args: ImageDrawArc_input, uid?: ComfyNodeUID): ImageDrawArc
        /* category=image_draw output=IMAGE */
        ImageDrawArcByContainer(args: ImageDrawArcByContainer_input, uid?: ComfyNodeUID): ImageDrawArcByContainer
        /* category=image_draw output=IMAGE */
        ImageDrawChord(args: ImageDrawChord_input, uid?: ComfyNodeUID): ImageDrawChord
        /* category=image_draw output=IMAGE */
        ImageDrawChordByContainer(args: ImageDrawChordByContainer_input, uid?: ComfyNodeUID): ImageDrawChordByContainer
        /* category=image_draw output=IMAGE */
        ImageDrawEllipse(args: ImageDrawEllipse_input, uid?: ComfyNodeUID): ImageDrawEllipse
        /* category=image_draw output=IMAGE */
        ImageDrawEllipseByContainer(args: ImageDrawEllipseByContainer_input, uid?: ComfyNodeUID): ImageDrawEllipseByContainer
        /* category=image_draw output=IMAGE */
        ImageDrawLine(args: ImageDrawLine_input, uid?: ComfyNodeUID): ImageDrawLine
        /* category=image_draw output=IMAGE */
        ImageDrawLineByContainer(args: ImageDrawLineByContainer_input, uid?: ComfyNodeUID): ImageDrawLineByContainer
        /* category=image_draw output=IMAGE */
        ImageDrawPieslice(args: ImageDrawPieslice_input, uid?: ComfyNodeUID): ImageDrawPieslice
        /* category=image_draw output=IMAGE */
        ImageDrawPiesliceByContainer(args: ImageDrawPiesliceByContainer_input, uid?: ComfyNodeUID): ImageDrawPiesliceByContainer
        /* category=image_draw output=IMAGE */
        ImageDrawRectangle(args: ImageDrawRectangle_input, uid?: ComfyNodeUID): ImageDrawRectangle
        /* category=image_draw output=IMAGE */
        ImageDrawRectangleByContainer(
            args: ImageDrawRectangleByContainer_input,
            uid?: ComfyNodeUID,
        ): ImageDrawRectangleByContainer
        /* category=image_draw output=IMAGE */
        ImageDrawRectangleRounded(args: ImageDrawRectangleRounded_input, uid?: ComfyNodeUID): ImageDrawRectangleRounded
        /* category=image_draw output=IMAGE */
        ImageDrawRectangleRoundedByContainer(
            args: ImageDrawRectangleRoundedByContainer_input,
            uid?: ComfyNodeUID,
        ): ImageDrawRectangleRoundedByContainer
        /* category=image_draw output=IMAGE */
        ImageDrawPolygon(args: ImageDrawPolygon_input, uid?: ComfyNodeUID): ImageDrawPolygon
        /* category=image_effects output=IMAGE */
        ImageEffectsAdjustment(args: ImageEffectsAdjustment_input, uid?: ComfyNodeUID): ImageEffectsAdjustment
        /* category=image_effects output=IMAGE */
        ImageEffectsGrayscale(args: ImageEffectsGrayscale_input, uid?: ComfyNodeUID): ImageEffectsGrayscale
        /* category=image_effects output=IMAGE */
        ImageEffectsNegative(args: ImageEffectsNegative_input, uid?: ComfyNodeUID): ImageEffectsNegative
        /* category=image_effects output=IMAGE */
        ImageEffectsSepia(args: ImageEffectsSepia_input, uid?: ComfyNodeUID): ImageEffectsSepia
        /* category=image_effects_lens output=IMAGE */
        ImageEffectsLensZoomBurst(args: ImageEffectsLensZoomBurst_input, uid?: ComfyNodeUID): ImageEffectsLensZoomBurst
        /* category=image_effects_lens output=IMAGE */
        ImageEffectsLensChromaticAberration(
            args: ImageEffectsLensChromaticAberration_input,
            uid?: ComfyNodeUID,
        ): ImageEffectsLensChromaticAberration
        /* category=image_effects_lens output=IMAGE */
        ImageEffectsLensBokeh(args: ImageEffectsLensBokeh_input, uid?: ComfyNodeUID): ImageEffectsLensBokeh
        /* category=image_effects_lens output=IMAGE, MASK */
        ImageEffectsLensOpticAxis(args: ImageEffectsLensOpticAxis_input, uid?: ComfyNodeUID): ImageEffectsLensOpticAxis
        /* category=image_effects_lens output=IMAGE, MASK */
        ImageEffectsLensVignette(args: ImageEffectsLensVignette_input, uid?: ComfyNodeUID): ImageEffectsLensVignette
        /* category=image_filter output=IMAGE */
        ImageFilterSmooth(args: ImageFilterSmooth_input, uid?: ComfyNodeUID): ImageFilterSmooth
        /* category=image_filter output=IMAGE */
        ImageFilterSmoothMore(args: ImageFilterSmoothMore_input, uid?: ComfyNodeUID): ImageFilterSmoothMore
        /* category=image_filter output=IMAGE */
        ImageFilterBlur(args: ImageFilterBlur_input, uid?: ComfyNodeUID): ImageFilterBlur
        /* category=image_filter output=IMAGE */
        ImageFilterBoxBlur(args: ImageFilterBoxBlur_input, uid?: ComfyNodeUID): ImageFilterBoxBlur
        /* category=image_filter output=IMAGE */
        ImageFilterGaussianBlur(args: ImageFilterGaussianBlur_input, uid?: ComfyNodeUID): ImageFilterGaussianBlur
        /* category=image_filter output=IMAGE */
        ImageFilterGaussianBlurAdvanced(
            args: ImageFilterGaussianBlurAdvanced_input,
            uid?: ComfyNodeUID,
        ): ImageFilterGaussianBlurAdvanced
        /* category=image_filter output=IMAGE */
        ImageFilterStackBlur(args: ImageFilterStackBlur_input, uid?: ComfyNodeUID): ImageFilterStackBlur
        /* category=image_filter output=IMAGE */
        ImageFilterMedianBlur(args: ImageFilterMedianBlur_input, uid?: ComfyNodeUID): ImageFilterMedianBlur
        /* category=image_filter output=IMAGE */
        ImageFilterBilateralBlur(args: ImageFilterBilateralBlur_input, uid?: ComfyNodeUID): ImageFilterBilateralBlur
        /* category=image_filter output=IMAGE */
        ImageFilterContour(args: ImageFilterContour_input, uid?: ComfyNodeUID): ImageFilterContour
        /* category=image_filter output=IMAGE */
        ImageFilterDetail(args: ImageFilterDetail_input, uid?: ComfyNodeUID): ImageFilterDetail
        /* category=image_filter output=IMAGE */
        ImageFilterEdgeEnhance(args: ImageFilterEdgeEnhance_input, uid?: ComfyNodeUID): ImageFilterEdgeEnhance
        /* category=image_filter output=IMAGE */
        ImageFilterEdgeEnhanceMore(args: ImageFilterEdgeEnhanceMore_input, uid?: ComfyNodeUID): ImageFilterEdgeEnhanceMore
        /* category=image_filter output=IMAGE */
        ImageFilterEmboss(args: ImageFilterEmboss_input, uid?: ComfyNodeUID): ImageFilterEmboss
        /* category=image_filter output=IMAGE */
        ImageFilterFindEdges(args: ImageFilterFindEdges_input, uid?: ComfyNodeUID): ImageFilterFindEdges
        /* category=image_filter output=IMAGE */
        ImageFilterSharpen(args: ImageFilterSharpen_input, uid?: ComfyNodeUID): ImageFilterSharpen
        /* category=image_filter output=IMAGE */
        ImageFilterRank(args: ImageFilterRank_input, uid?: ComfyNodeUID): ImageFilterRank
        /* category=image_filter output=IMAGE */
        ImageFilterMin(args: ImageFilterMin_input, uid?: ComfyNodeUID): ImageFilterMin
        /* category=image_filter output=IMAGE */
        ImageFilterMax(args: ImageFilterMax_input, uid?: ComfyNodeUID): ImageFilterMax
        /* category=image_filter output=IMAGE */
        ImageFilterMode(args: ImageFilterMode_input, uid?: ComfyNodeUID): ImageFilterMode
        /* category=image_segmentation output=IMAGE */
        ImageSegmentation(args: ImageSegmentation_input, uid?: ComfyNodeUID): ImageSegmentation
        /* category=image_segmentation output=IMAGE */
        ImageSegmentationCustom(args: ImageSegmentationCustom_input, uid?: ComfyNodeUID): ImageSegmentationCustom
        /* category=image_segmentation output=IMAGE */
        ImageSegmentationCustomAdvanced(
            args: ImageSegmentationCustomAdvanced_input,
            uid?: ComfyNodeUID,
        ): ImageSegmentationCustomAdvanced
        /* category=image_draw output=IMAGE */
        ImageText(args: ImageText_input, uid?: ComfyNodeUID): ImageText
        /* category=image_draw output=IMAGE */
        ImageTextOutlined(args: ImageTextOutlined_input, uid?: ComfyNodeUID): ImageTextOutlined
        /* category=image_draw output=IMAGE */
        ImageTextMultiline(args: ImageTextMultiline_input, uid?: ComfyNodeUID): ImageTextMultiline
        /* category=image_draw output=IMAGE */
        ImageTextMultilineOutlined(args: ImageTextMultilineOutlined_input, uid?: ComfyNodeUID): ImageTextMultilineOutlined
        /* category=image_transform output=IMAGE */
        ImageTransformResizeAbsolute(args: ImageTransformResizeAbsolute_input, uid?: ComfyNodeUID): ImageTransformResizeAbsolute
        /* category=image_transform output=IMAGE */
        ImageTransformResizeRelative(args: ImageTransformResizeRelative_input, uid?: ComfyNodeUID): ImageTransformResizeRelative
        /* category=image_transform output=IMAGE */
        ImageTransformCropAbsolute(args: ImageTransformCropAbsolute_input, uid?: ComfyNodeUID): ImageTransformCropAbsolute
        /* category=image_transform output=IMAGE */
        ImageTransformCropRelative(args: ImageTransformCropRelative_input, uid?: ComfyNodeUID): ImageTransformCropRelative
        /* category=image_transform output=IMAGE */
        ImageTransformCropCorners(args: ImageTransformCropCorners_input, uid?: ComfyNodeUID): ImageTransformCropCorners
        /* category=image_transform output=IMAGE */
        ImageTransformPaddingAbsolute(
            args: ImageTransformPaddingAbsolute_input,
            uid?: ComfyNodeUID,
        ): ImageTransformPaddingAbsolute
        /* category=image_transform output=IMAGE */
        ImageTransformPaddingRelative(
            args: ImageTransformPaddingRelative_input,
            uid?: ComfyNodeUID,
        ): ImageTransformPaddingRelative
        /* category=image_transform output=IMAGE */
        ImageTransformRotate(args: ImageTransformRotate_input, uid?: ComfyNodeUID): ImageTransformRotate
        /* category=image_transform output=IMAGE */
        ImageTransformTranspose(args: ImageTransformTranspose_input, uid?: ComfyNodeUID): ImageTransformTranspose
        /* category=ImpactPack output=SAM_MODEL */
        ImpactSAMLoader(args: ImpactSAMLoader_input, uid?: ComfyNodeUID): ImpactSAMLoader
        /* category=ImpactPack output=BBOX_DETECTOR, SEGM_DETECTOR */
        ImpactMMDetDetectorProvider(args: ImpactMMDetDetectorProvider_input, uid?: ComfyNodeUID): ImpactMMDetDetectorProvider
        /* category=ImpactPack_Util output=BBOX_DETECTOR */
        ImpactCLIPSegDetectorProvider(
            args: ImpactCLIPSegDetectorProvider_input,
            uid?: ComfyNodeUID,
        ): ImpactCLIPSegDetectorProvider
        /* category=ImpactPack output=ONNX_DETECTOR */
        ImpactONNXDetectorProvider(args: ImpactONNXDetectorProvider_input, uid?: ComfyNodeUID): ImpactONNXDetectorProvider
        /* category=ImpactPack_Operation output=SEGS */
        ImpactBitwiseAndMaskForEach(args: ImpactBitwiseAndMaskForEach_input, uid?: ComfyNodeUID): ImpactBitwiseAndMaskForEach
        /* category=ImpactPack_Operation output=SEGS */
        ImpactSubtractMaskForEach(args: ImpactSubtractMaskForEach_input, uid?: ComfyNodeUID): ImpactSubtractMaskForEach
        /* category=ImpactPack_Detailer output=IMAGE */
        ImpactDetailerForEach(args: ImpactDetailerForEach_input, uid?: ComfyNodeUID): ImpactDetailerForEach
        /* category=ImpactPack_Detailer output=IMAGE, IMAGE_1, IMAGE_2 */
        ImpactDetailerForEachDebug(args: ImpactDetailerForEachDebug_input, uid?: ComfyNodeUID): ImpactDetailerForEachDebug
        /* category=ImpactPack_Detailer output=IMAGE */
        ImpactDetailerForEachPipe(args: ImpactDetailerForEachPipe_input, uid?: ComfyNodeUID): ImpactDetailerForEachPipe
        /* category=ImpactPack_Detailer output=IMAGE, IMAGE_1, IMAGE_2 */
        ImpactDetailerForEachDebugPipe(
            args: ImpactDetailerForEachDebugPipe_input,
            uid?: ComfyNodeUID,
        ): ImpactDetailerForEachDebugPipe
        /* category=ImpactPack_Detector output=MASK */
        ImpactSAMDetectorCombined(args: ImpactSAMDetectorCombined_input, uid?: ComfyNodeUID): ImpactSAMDetectorCombined
        /* category=ImpactPack_Simple output=IMAGE, IMAGE_1, MASK, DETAILER_PIPE */
        ImpactFaceDetailer(args: ImpactFaceDetailer_input, uid?: ComfyNodeUID): ImpactFaceDetailer
        /* category=ImpactPack_Simple output=IMAGE, IMAGE_1, MASK, DETAILER_PIPE */
        ImpactFaceDetailerPipe(args: ImpactFaceDetailerPipe_input, uid?: ComfyNodeUID): ImpactFaceDetailerPipe
        /* category=ImpactPack_Pipe output=DETAILER_PIPE */
        ImpactToDetailerPipe(args: ImpactToDetailerPipe_input, uid?: ComfyNodeUID): ImpactToDetailerPipe
        /* category=ImpactPack_Pipe output=MODEL, VAE, CONDITIONING, CONDITIONING_1, BBOX_DETECTOR, SAM_MODEL */
        ImpactFromDetailerPipe(args: ImpactFromDetailerPipe_input, uid?: ComfyNodeUID): ImpactFromDetailerPipe
        /* category=ImpactPack_Pipe output=BASIC_PIPE */
        ImpactToBasicPipe(args: ImpactToBasicPipe_input, uid?: ComfyNodeUID): ImpactToBasicPipe
        /* category=ImpactPack_Pipe output=MODEL, CLIP, VAE, CONDITIONING, CONDITIONING_1 */
        ImpactFromBasicPipe(args: ImpactFromBasicPipe_input, uid?: ComfyNodeUID): ImpactFromBasicPipe
        /* category=ImpactPack_Pipe output=DETAILER_PIPE */
        ImpactBasicPipeToDetailerPipe(
            args: ImpactBasicPipeToDetailerPipe_input,
            uid?: ComfyNodeUID,
        ): ImpactBasicPipeToDetailerPipe
        /* category=ImpactPack_Pipe output=BASIC_PIPE */
        ImpactDetailerPipeToBasicPipe(
            args: ImpactDetailerPipeToBasicPipe_input,
            uid?: ComfyNodeUID,
        ): ImpactDetailerPipeToBasicPipe
        /* category=ImpactPack_Pipe output=BASIC_PIPE */
        ImpactEditBasicPipe(args: ImpactEditBasicPipe_input, uid?: ComfyNodeUID): ImpactEditBasicPipe
        /* category=ImpactPack_Pipe output=DETAILER_PIPE */
        ImpactEditDetailerPipe(args: ImpactEditDetailerPipe_input, uid?: ComfyNodeUID): ImpactEditDetailerPipe
        /* category=ImpactPack_Upscale output=LATENT */
        ImpactLatentPixelScale(args: ImpactLatentPixelScale_input, uid?: ComfyNodeUID): ImpactLatentPixelScale
        /* category=ImpactPack_Upscale output=UPSCALER */
        ImpactPixelKSampleUpscalerProvider(
            args: ImpactPixelKSampleUpscalerProvider_input,
            uid?: ComfyNodeUID,
        ): ImpactPixelKSampleUpscalerProvider
        /* category=ImpactPack_Upscale output=UPSCALER */
        ImpactPixelKSampleUpscalerProviderPipe(
            args: ImpactPixelKSampleUpscalerProviderPipe_input,
            uid?: ComfyNodeUID,
        ): ImpactPixelKSampleUpscalerProviderPipe
        /* category=ImpactPack_Upscale output=LATENT */
        ImpactIterativeLatentUpscale(args: ImpactIterativeLatentUpscale_input, uid?: ComfyNodeUID): ImpactIterativeLatentUpscale
        /* category=ImpactPack_Upscale output=IMAGE */
        ImpactIterativeImageUpscale(args: ImpactIterativeImageUpscale_input, uid?: ComfyNodeUID): ImpactIterativeImageUpscale
        /* category=ImpactPack_Upscale output=UPSCALER */
        ImpactPixelTiledKSampleUpscalerProvider(
            args: ImpactPixelTiledKSampleUpscalerProvider_input,
            uid?: ComfyNodeUID,
        ): ImpactPixelTiledKSampleUpscalerProvider
        /* category=ImpactPack_Upscale output=UPSCALER */
        ImpactPixelTiledKSampleUpscalerProviderPipe(
            args: ImpactPixelTiledKSampleUpscalerProviderPipe_input,
            uid?: ComfyNodeUID,
        ): ImpactPixelTiledKSampleUpscalerProviderPipe
        /* category=ImpactPack_Upscale output=UPSCALER */
        ImpactTwoSamplersForMaskUpscalerProvider(
            args: ImpactTwoSamplersForMaskUpscalerProvider_input,
            uid?: ComfyNodeUID,
        ): ImpactTwoSamplersForMaskUpscalerProvider
        /* category=ImpactPack_Upscale output=UPSCALER */
        ImpactTwoSamplersForMaskUpscalerProviderPipe(
            args: ImpactTwoSamplersForMaskUpscalerProviderPipe_input,
            uid?: ComfyNodeUID,
        ): ImpactTwoSamplersForMaskUpscalerProviderPipe
        /* category=ImpactPack_Upscale output=PK_HOOK */
        ImpactPixelKSampleHookCombine(
            args: ImpactPixelKSampleHookCombine_input,
            uid?: ComfyNodeUID,
        ): ImpactPixelKSampleHookCombine
        /* category=ImpactPack_Upscale output=PK_HOOK */
        ImpactDenoiseScheduleHookProvider(
            args: ImpactDenoiseScheduleHookProvider_input,
            uid?: ComfyNodeUID,
        ): ImpactDenoiseScheduleHookProvider
        /* category=ImpactPack_Upscale output=PK_HOOK */
        ImpactCfgScheduleHookProvider(
            args: ImpactCfgScheduleHookProvider_input,
            uid?: ComfyNodeUID,
        ): ImpactCfgScheduleHookProvider
        /* category=ImpactPack_Operation output=MASK */
        ImpactBitwiseAndMask(args: ImpactBitwiseAndMask_input, uid?: ComfyNodeUID): ImpactBitwiseAndMask
        /* category=ImpactPack_Operation output=MASK */
        ImpactSubtractMask(args: ImpactSubtractMask_input, uid?: ComfyNodeUID): ImpactSubtractMask
        /* category=ImpactPack_Operation output=SEGS */
        ImpactSegsMask(args: ImpactSegsMask_input, uid?: ComfyNodeUID): ImpactSegsMask
        /* category=ImpactPack_Util output=SEGS */
        ImpactEmptySegs(args: ImpactEmptySegs_input, uid?: ComfyNodeUID): ImpactEmptySegs
        /* category=ImpactPack_Operation output=SEGS */
        ImpactMaskToSEGS(args: ImpactMaskToSEGS_input, uid?: ComfyNodeUID): ImpactMaskToSEGS
        /* category=ImpactPack_Operation output=MASK */
        ImpactToBinaryMask(args: ImpactToBinaryMask_input, uid?: ComfyNodeUID): ImpactToBinaryMask
        /* category=ImpactPack_Detector output=SEGS */
        ImpactBboxDetectorSEGS(args: ImpactBboxDetectorSEGS_input, uid?: ComfyNodeUID): ImpactBboxDetectorSEGS
        /* category=ImpactPack_Detector output=SEGS */
        ImpactSegmDetectorSEGS(args: ImpactSegmDetectorSEGS_input, uid?: ComfyNodeUID): ImpactSegmDetectorSEGS
        /* category=ImpactPack_Detector output=SEGS */
        ImpactONNXDetectorSEGS(args: ImpactONNXDetectorSEGS_input, uid?: ComfyNodeUID): ImpactONNXDetectorSEGS
        /* category=ImpactPack_Detector output=MASK */
        ImpactBboxDetectorCombined_v2(
            args: ImpactBboxDetectorCombined_v2_input,
            uid?: ComfyNodeUID,
        ): ImpactBboxDetectorCombined_v2
        /* category=ImpactPack_Detector output=MASK */
        ImpactSegmDetectorCombined_v2(
            args: ImpactSegmDetectorCombined_v2_input,
            uid?: ComfyNodeUID,
        ): ImpactSegmDetectorCombined_v2
        /* category=ImpactPack_Operation output=MASK */
        ImpactSegsToCombinedMask(args: ImpactSegsToCombinedMask_input, uid?: ComfyNodeUID): ImpactSegsToCombinedMask
        /* category=ImpactPack_Sampler output=KSAMPLER */
        ImpactKSamplerProvider(args: ImpactKSamplerProvider_input, uid?: ComfyNodeUID): ImpactKSamplerProvider
        /* category=ImpactPack_Sampler output=LATENT */
        ImpactTwoSamplersForMask(args: ImpactTwoSamplersForMask_input, uid?: ComfyNodeUID): ImpactTwoSamplersForMask
        /* category=ImpactPack_Sampler output=KSAMPLER */
        ImpactTiledKSamplerProvider(args: ImpactTiledKSamplerProvider_input, uid?: ComfyNodeUID): ImpactTiledKSamplerProvider
        /* category=ImpactPack_Util output=IMAGE, MASK */
        ImpactPreviewBridge(args: ImpactPreviewBridge_input, uid?: ComfyNodeUID): ImpactPreviewBridge
        /* category=ImpactPack_Util output= */
        ImpactImageSender(args: ImpactImageSender_input, uid?: ComfyNodeUID): ImpactImageSender
        /* category=ImpactPack_Util output=IMAGE, MASK */
        ImpactImageReceiver(args: ImpactImageReceiver_input, uid?: ComfyNodeUID): ImpactImageReceiver
        /* category=ImpactPack_Util output=IMAGE, MASK */
        ImpactImageMaskSwitch(args: ImpactImageMaskSwitch_input, uid?: ComfyNodeUID): ImpactImageMaskSwitch
        /* category=ImpactPack_Util output=LATENT */
        ImpactLatentSwitch(args: ImpactLatentSwitch_input, uid?: ComfyNodeUID): ImpactLatentSwitch
        /* category=ImpactPack_Util output=SEGS */
        ImpactSEGSSwitch(args: ImpactSEGSSwitch_input, uid?: ComfyNodeUID): ImpactSEGSSwitch
        /* category=ImpactPack_Prompt output=STRING */
        ImpactImpactWildcardProcessor(
            args: ImpactImpactWildcardProcessor_input,
            uid?: ComfyNodeUID,
        ): ImpactImpactWildcardProcessor
        /* category=ImpactPack_Debug output= */
        ImpactImpactLogger(args: ImpactImpactLogger_input, uid?: ComfyNodeUID): ImpactImpactLogger
        /* category=ImpactPack_Detailer output=SEGS */
        ImpactSEGSDetailer(args: ImpactSEGSDetailer_input, uid?: ComfyNodeUID): ImpactSEGSDetailer
        /* category=ImpactPack_Detailer output=IMAGE */
        ImpactSEGSPaste(args: ImpactSEGSPaste_input, uid?: ComfyNodeUID): ImpactSEGSPaste
        /* category=ImpactPack_Detailer output= */
        ImpactSEGSPreview(args: ImpactSEGSPreview_input, uid?: ComfyNodeUID): ImpactSEGSPreview
        /* category=ImpactPack_Legacy output=MASK */
        ImpactMaskPainter(args: ImpactMaskPainter_input, uid?: ComfyNodeUID): ImpactMaskPainter
        /* category=ImpactPack_Legacy output=BBOX_MODEL, SEGM_MODEL */
        ImpactMMDetLoader(args: ImpactMMDetLoader_input, uid?: ComfyNodeUID): ImpactMMDetLoader
        /* category=ImpactPack_Legacy output=MASK */
        ImpactSegsMaskCombine(args: ImpactSegsMaskCombine_input, uid?: ComfyNodeUID): ImpactSegsMaskCombine
        /* category=ImpactPack_Legacy output=SEGS */
        ImpactBboxDetectorForEach(args: ImpactBboxDetectorForEach_input, uid?: ComfyNodeUID): ImpactBboxDetectorForEach
        /* category=ImpactPack_Legacy output=SEGS */
        ImpactSegmDetectorForEach(args: ImpactSegmDetectorForEach_input, uid?: ComfyNodeUID): ImpactSegmDetectorForEach
        /* category=ImpactPack_Legacy output=MASK */
        ImpactBboxDetectorCombined(args: ImpactBboxDetectorCombined_input, uid?: ComfyNodeUID): ImpactBboxDetectorCombined
        /* category=ImpactPack_Legacy output=MASK */
        ImpactSegmDetectorCombined(args: ImpactSegmDetectorCombined_input, uid?: ComfyNodeUID): ImpactSegmDetectorCombined
        /* category=image output= */
        Save_as_webp(args: Save_as_webp_input, uid?: ComfyNodeUID): Save_as_webp
        /* category=conditioning_cutoff output=CLIPREGION */
        BNK_CutoffBasePrompt(args: BNK_CutoffBasePrompt_input, uid?: ComfyNodeUID): BNK_CutoffBasePrompt
        /* category=conditioning_cutoff output=CLIPREGION */
        BNK_CutoffSetRegions(args: BNK_CutoffSetRegions_input, uid?: ComfyNodeUID): BNK_CutoffSetRegions
        /* category=conditioning_cutoff output=CONDITIONING */
        BNK_CutoffRegionsToConditioning(
            args: BNK_CutoffRegionsToConditioning_input,
            uid?: ComfyNodeUID,
        ): BNK_CutoffRegionsToConditioning
        /* category=conditioning_cutoff output=CONDITIONING */
        BNK_CutoffRegionsToConditioning_ADV(
            args: BNK_CutoffRegionsToConditioning_ADV_input,
            uid?: ComfyNodeUID,
        ): BNK_CutoffRegionsToConditioning_ADV
        /* category=Davemane42 output=LATENT */
        MultiLatentComposite(args: MultiLatentComposite_input, uid?: ComfyNodeUID): MultiLatentComposite
        /* category=Davemane42 output=CONDITIONING, INT, INT_1 */
        MultiAreaConditioning(args: MultiAreaConditioning_input, uid?: ComfyNodeUID): MultiAreaConditioning
        /* category=Davemane42 output=CONDITIONING */
        ConditioningUpscale(args: ConditioningUpscale_input, uid?: ComfyNodeUID): ConditioningUpscale
        /* category=Davemane42 output=CONDITIONING */
        ConditioningStretch(args: ConditioningStretch_input, uid?: ComfyNodeUID): ConditioningStretch
        /* category=latent_noise output=LATENT */
        BNK_NoisyLatentImage(args: BNK_NoisyLatentImage_input, uid?: ComfyNodeUID): BNK_NoisyLatentImage
        /* category=latent output=LATENT */
        BNK_DuplicateBatchIndex(args: BNK_DuplicateBatchIndex_input, uid?: ComfyNodeUID): BNK_DuplicateBatchIndex
        /* category=latent output=LATENT */
        BNK_SlerpLatent(args: BNK_SlerpLatent_input, uid?: ComfyNodeUID): BNK_SlerpLatent
        /* category=latent_noise output=FLOAT */
        BNK_GetSigma(args: BNK_GetSigma_input, uid?: ComfyNodeUID): BNK_GetSigma
        /* category=latent_noise output=LATENT */
        BNK_InjectNoise(args: BNK_InjectNoise_input, uid?: ComfyNodeUID): BNK_InjectNoise
        /* category=sampling output=LATENT */
        BNK_Unsampler(args: BNK_Unsampler_input, uid?: ComfyNodeUID): BNK_Unsampler
        /* category=sampling output=LATENT */
        BNK_TiledKSamplerAdvanced(args: BNK_TiledKSamplerAdvanced_input, uid?: ComfyNodeUID): BNK_TiledKSamplerAdvanced
        /* category=sampling output=LATENT */
        BNK_TiledKSampler(args: BNK_TiledKSampler_input, uid?: ComfyNodeUID): BNK_TiledKSampler
        /* category=image output=IMAGE, MASK */
        ClipSeg(args: ClipSeg_input, uid?: ComfyNodeUID): ClipSeg
        /* category=preprocessors_edge_line output=IMAGE */
        HEDPreprocessor(args: HEDPreprocessor_input, uid?: ComfyNodeUID): HEDPreprocessor
        /* category=preprocessors_edge_line output=IMAGE */
        ScribblePreprocessor(args: ScribblePreprocessor_input, uid?: ComfyNodeUID): ScribblePreprocessor
        /* category=preprocessors_edge_line output=IMAGE */
        FakeScribblePreprocessor(args: FakeScribblePreprocessor_input, uid?: ComfyNodeUID): FakeScribblePreprocessor
        /* category=preprocessors_edge_line output=IMAGE */
        BinaryPreprocessor(args: BinaryPreprocessor_input, uid?: ComfyNodeUID): BinaryPreprocessor
        /* category=preprocessors_edge_line output=IMAGE */
        PiDiNetPreprocessor(args: PiDiNetPreprocessor_input, uid?: ComfyNodeUID): PiDiNetPreprocessor
        /* category=preprocessors_edge_line output=IMAGE */
        LineArtPreprocessor(args: LineArtPreprocessor_input, uid?: ComfyNodeUID): LineArtPreprocessor
        /* category=preprocessors_edge_line output=IMAGE */
        AnimeLineArtPreprocessor(args: AnimeLineArtPreprocessor_input, uid?: ComfyNodeUID): AnimeLineArtPreprocessor
        /* category=preprocessors_edge_line output=IMAGE */
        Manga2AnimeLineArtPreprocessor(
            args: Manga2AnimeLineArtPreprocessor_input,
            uid?: ComfyNodeUID,
        ): Manga2AnimeLineArtPreprocessor
        /* category=preprocessors_normal_depth_map output=IMAGE */
        MiDaSNormalMapPreprocessor(args: MiDaSNormalMapPreprocessor_input, uid?: ComfyNodeUID): MiDaSNormalMapPreprocessor
        /* category=preprocessors_normal_depth_map output=IMAGE */
        ZoeDepthMapPreprocessor(args: ZoeDepthMapPreprocessor_input, uid?: ComfyNodeUID): ZoeDepthMapPreprocessor
        /* category=preprocessors_normal_depth_map output=IMAGE */
        BAENormalMapPreprocessor(args: BAENormalMapPreprocessor_input, uid?: ComfyNodeUID): BAENormalMapPreprocessor
        /* category=preprocessors_pose output=IMAGE */
        OpenposePreprocessor(args: OpenposePreprocessor_input, uid?: ComfyNodeUID): OpenposePreprocessor
        /* category=preprocessors_pose output=IMAGE */
        MediaPipeHandPosePreprocessor(
            args: MediaPipeHandPosePreprocessor_input,
            uid?: ComfyNodeUID,
        ): MediaPipeHandPosePreprocessor
        /* category=preprocessors_semseg output=IMAGE */
        OneFormerCOCOSemSegPreprocessor(
            args: OneFormerCOCOSemSegPreprocessor_input,
            uid?: ComfyNodeUID,
        ): OneFormerCOCOSemSegPreprocessor
        /* category=preprocessors_semseg output=IMAGE */
        OneFormerADE20KSemSegPreprocessor(
            args: OneFormerADE20KSemSegPreprocessor_input,
            uid?: ComfyNodeUID,
        ): OneFormerADE20KSemSegPreprocessor
        /* category=preprocessors_face_mesh output=IMAGE */
        MediaPipeFaceMeshPreprocessor(
            args: MediaPipeFaceMeshPreprocessor_input,
            uid?: ComfyNodeUID,
        ): MediaPipeFaceMeshPreprocessor
        /* category=preprocessors_color_style output=IMAGE */
        ColorPreprocessor(args: ColorPreprocessor_input, uid?: ComfyNodeUID): ColorPreprocessor
        /* category=preprocessors_tile output=IMAGE */
        TilePreprocessor(args: TilePreprocessor_input, uid?: ComfyNodeUID): TilePreprocessor
        /* category=preprocessors_inpaint output=IMAGE */
        InpaintPreprocessor(args: InpaintPreprocessor_input, uid?: ComfyNodeUID): InpaintPreprocessor
        /* category=conditioning_cutoff output=CLIPREGION */
        CLIPRegionsBasePrompt(args: CLIPRegionsBasePrompt_input, uid?: ComfyNodeUID): CLIPRegionsBasePrompt
        /* category=conditioning_cutoff output=CLIPREGION */
        CLIPSetRegion(args: CLIPSetRegion_input, uid?: ComfyNodeUID): CLIPSetRegion
        /* category=conditioning_cutoff output=CONDITIONING */
        CLIPRegionsToConditioning(args: CLIPRegionsToConditioning_input, uid?: ComfyNodeUID): CLIPRegionsToConditioning
        /* category=Efficiency Nodes_Sampling output=MODEL, CONDITIONING, CONDITIONING_1, LATENT, VAE, IMAGE */
        KSamplerEfficient(args: KSamplerEfficient_input, uid?: ComfyNodeUID): KSamplerEfficient
        /* category=Efficiency Nodes_Loaders output=MODEL, CONDITIONING, CONDITIONING_1, LATENT, VAE, DEPENDENCIES */
        EfficientLoader(args: EfficientLoader_input, uid?: ComfyNodeUID): EfficientLoader
        /* category=Efficiency Nodes_XY Plot output=SCRIPT */
        XYPlot(args: XYPlot_input, uid?: ComfyNodeUID): XYPlot
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        XYInputSeedsBatch(args: XYInputSeedsBatch_input, uid?: ComfyNodeUID): XYInputSeedsBatch
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        XYInputSteps(args: XYInputSteps_input, uid?: ComfyNodeUID): XYInputSteps
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        XYInputCFGScale(args: XYInputCFGScale_input, uid?: ComfyNodeUID): XYInputCFGScale
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        XYInputSampler(args: XYInputSampler_input, uid?: ComfyNodeUID): XYInputSampler
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        XYInputScheduler(args: XYInputScheduler_input, uid?: ComfyNodeUID): XYInputScheduler
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        XYInputDenoise(args: XYInputDenoise_input, uid?: ComfyNodeUID): XYInputDenoise
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        XYInputVAE(args: XYInputVAE_input, uid?: ComfyNodeUID): XYInputVAE
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        XYInputPositivePromptSR(args: XYInputPositivePromptSR_input, uid?: ComfyNodeUID): XYInputPositivePromptSR
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        XYInputNegativePromptSR(args: XYInputNegativePromptSR_input, uid?: ComfyNodeUID): XYInputNegativePromptSR
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        XYInputCheckpoint(args: XYInputCheckpoint_input, uid?: ComfyNodeUID): XYInputCheckpoint
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        XYInputClipSkip(args: XYInputClipSkip_input, uid?: ComfyNodeUID): XYInputClipSkip
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        XYInputLoRA(args: XYInputLoRA_input, uid?: ComfyNodeUID): XYInputLoRA
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        XYInputLoRAAdvanced(args: XYInputLoRAAdvanced_input, uid?: ComfyNodeUID): XYInputLoRAAdvanced
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY, XY_1 */
        XYInputManualXYEntry(args: XYInputManualXYEntry_input, uid?: ComfyNodeUID): XYInputManualXYEntry
        /* category=Efficiency Nodes_XY Plot_XY Inputs output= */
        ManualXYEntryInfo(args: ManualXYEntryInfo_input, uid?: ComfyNodeUID): ManualXYEntryInfo
        /* category=Efficiency Nodes_XY Plot_XY Inputs output=XY */
        JoinXYInputsOfSameType(args: JoinXYInputsOfSameType_input, uid?: ComfyNodeUID): JoinXYInputsOfSameType
        /* category=Efficiency Nodes_Image output=IMAGE */
        ImageOverlay(args: ImageOverlay_input, uid?: ComfyNodeUID): ImageOverlay
        /* category=Efficiency Nodes_Simple Eval output=INT, FLOAT, STRING */
        EvaluateIntegers(args: EvaluateIntegers_input, uid?: ComfyNodeUID): EvaluateIntegers
        /* category=Efficiency Nodes_Simple Eval output=INT, FLOAT, STRING */
        EvaluateFloats(args: EvaluateFloats_input, uid?: ComfyNodeUID): EvaluateFloats
        /* category=Efficiency Nodes_Simple Eval output=STRING */
        EvaluateStrings(args: EvaluateStrings_input, uid?: ComfyNodeUID): EvaluateStrings
        /* category=Efficiency Nodes_Simple Eval output= */
        SimpleEvalExamples(args: SimpleEvalExamples_input, uid?: ComfyNodeUID): SimpleEvalExamples
        /* category=Image Processing output=IMAGE */
        GaussianBlur(args: GaussianBlur_input, uid?: ComfyNodeUID): GaussianBlur
        /* category=Image Processing output=IMAGE */
        HistogramEqualization(args: HistogramEqualization_input, uid?: ComfyNodeUID): HistogramEqualization
        /* category=WAS Suite_Image_Transform output=IMAGE */
        WASImageFlip(args: WASImageFlip_input, uid?: ComfyNodeUID): WASImageFlip
        /* category=O_latent output=LATENT */
        LatentUpscaleMultiply(args: LatentUpscaleMultiply_input, uid?: ComfyNodeUID): LatentUpscaleMultiply
        /* category=Masquerade Nodes output=IMAGE, IMAGE_1 */
        MasqueradeMaskByText(args: MasqueradeMaskByText_input, uid?: ComfyNodeUID): MasqueradeMaskByText
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradeMaskMorphology(args: MasqueradeMaskMorphology_input, uid?: ComfyNodeUID): MasqueradeMaskMorphology
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradeCombineMasks(args: MasqueradeCombineMasks_input, uid?: ComfyNodeUID): MasqueradeCombineMasks
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradeUnaryMaskOp(args: MasqueradeUnaryMaskOp_input, uid?: ComfyNodeUID): MasqueradeUnaryMaskOp
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradeBlur(args: MasqueradeBlur_input, uid?: ComfyNodeUID): MasqueradeBlur
        /* category=Masquerade Nodes output=MASK */
        MasqueradeImageToMask(args: MasqueradeImageToMask_input, uid?: ComfyNodeUID): MasqueradeImageToMask
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradeMixImagesByMask(args: MasqueradeMixImagesByMask_input, uid?: ComfyNodeUID): MasqueradeMixImagesByMask
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradeMixColorByMask(args: MasqueradeMixColorByMask_input, uid?: ComfyNodeUID): MasqueradeMixColorByMask
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradeMaskToRegion(args: MasqueradeMaskToRegion_input, uid?: ComfyNodeUID): MasqueradeMaskToRegion
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradeCutByMask(args: MasqueradeCutByMask_input, uid?: ComfyNodeUID): MasqueradeCutByMask
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradePasteByMask(args: MasqueradePasteByMask_input, uid?: ComfyNodeUID): MasqueradePasteByMask
        /* category=Masquerade Nodes output=INT, INT_1 */
        MasqueradeGetImageSize(args: MasqueradeGetImageSize_input, uid?: ComfyNodeUID): MasqueradeGetImageSize
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradeChangeChannelCount(args: MasqueradeChangeChannelCount_input, uid?: ComfyNodeUID): MasqueradeChangeChannelCount
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradeConstantMask(args: MasqueradeConstantMask_input, uid?: ComfyNodeUID): MasqueradeConstantMask
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradePruneByMask(args: MasqueradePruneByMask_input, uid?: ComfyNodeUID): MasqueradePruneByMask
        /* category=Masquerade Nodes output=IMAGE, MASK_MAPPING */
        MasqueradeSeparateMaskComponents(
            args: MasqueradeSeparateMaskComponents_input,
            uid?: ComfyNodeUID,
        ): MasqueradeSeparateMaskComponents
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradeCreateRectMask(args: MasqueradeCreateRectMask_input, uid?: ComfyNodeUID): MasqueradeCreateRectMask
        /* category=Masquerade Nodes output=IMAGE */
        MasqueradeMakeImageBatch(args: MasqueradeMakeImageBatch_input, uid?: ComfyNodeUID): MasqueradeMakeImageBatch
        /* category=Image Processing output=IMAGE */
        PseudoHDRStyle(args: PseudoHDRStyle_input, uid?: ComfyNodeUID): PseudoHDRStyle
        /* category=Image Processing output=IMAGE */
        Saturation(args: Saturation_input, uid?: ComfyNodeUID): Saturation
        /* category=Image Processing output=IMAGE */
        ImageSharpening(args: ImageSharpening_input, uid?: ComfyNodeUID): ImageSharpening
        /* category=WAS Suite_Loaders output=BLIP_MODEL */
        WASBLIPModelLoader(args: WASBLIPModelLoader_input, uid?: ComfyNodeUID): WASBLIPModelLoader
        /* category=WAS Suite_IO output=ASCII, ASCII_1, ASCII_2 */
        WASCacheNode(args: WASCacheNode_input, uid?: ComfyNodeUID): WASCacheNode
        /* category=WAS Suite_Loaders_Advanced output=MODEL, CLIP, VAE, STRING */
        WASCheckpointLoader(args: WASCheckpointLoader_input, uid?: ComfyNodeUID): WASCheckpointLoader
        /* category=WAS Suite_Loaders output=MODEL, CLIP, VAE, STRING */
        WASCheckpointLoaderSimple(args: WASCheckpointLoaderSimple_input, uid?: ComfyNodeUID): WASCheckpointLoaderSimple
        /* category=WAS Suite_Conditioning output=CONDITIONING, ASCII, ASCII_1 */
        WASCLIPTextEncodeNSP(args: WASCLIPTextEncodeNSP_input, uid?: ComfyNodeUID): WASCLIPTextEncodeNSP
        /* category=WAS Suite_Logic output=CLIP */
        WASCLIPInputSwitch(args: WASCLIPInputSwitch_input, uid?: ComfyNodeUID): WASCLIPInputSwitch
        /* category=WAS Suite_Logic output=CLIP_VISION */
        WASCLIPVisionInputSwitch(args: WASCLIPVisionInputSwitch_input, uid?: ComfyNodeUID): WASCLIPVisionInputSwitch
        /* category=WAS Suite_Logic output=CONDITIONING */
        WASConditioningInputSwitch(args: WASConditioningInputSwitch_input, uid?: ComfyNodeUID): WASConditioningInputSwitch
        /* category=WAS Suite_Number output=NUMBER */
        WASConstantNumber(args: WASConstantNumber_input, uid?: ComfyNodeUID): WASConstantNumber
        /* category=WAS Suite_Image_Process output=IMAGE */
        WASCreateGridImage(args: WASCreateGridImage_input, uid?: ComfyNodeUID): WASCreateGridImage
        /* category=WAS Suite_Animation output=IMAGE, IMAGE_1, ASCII, ASCII_1 */
        WASCreateMorphImage(args: WASCreateMorphImage_input, uid?: ComfyNodeUID): WASCreateMorphImage
        /* category=WAS Suite_Animation output=ASCII, ASCII_1 */
        WASCreateMorphImageFromPath(args: WASCreateMorphImageFromPath_input, uid?: ComfyNodeUID): WASCreateMorphImageFromPath
        /* category=WAS Suite_Animation output=ASCII, ASCII_1 */
        WASCreateVideoFromPath(args: WASCreateVideoFromPath_input, uid?: ComfyNodeUID): WASCreateVideoFromPath
        /* category=WAS Suite_Image_Masking output=MASK, IMAGE */
        WASCLIPSegMasking(args: WASCLIPSegMasking_input, uid?: ComfyNodeUID): WASCLIPSegMasking
        /* category=WAS Suite_Loaders output=CLIPSEG_MODEL */
        WASCLIPSegModelLoader(args: WASCLIPSegModelLoader_input, uid?: ComfyNodeUID): WASCLIPSegModelLoader
        /* category=WAS Suite_Image_Masking output=IMAGE, MASK, IMAGE_1 */
        WASCLIPSegBatchMasking(args: WASCLIPSegBatchMasking_input, uid?: ComfyNodeUID): WASCLIPSegBatchMasking
        /* category=WAS Suite_Image_Masking output=IMAGE */
        WASConvertMasksToImages(args: WASConvertMasksToImages_input, uid?: ComfyNodeUID): WASConvertMasksToImages
        /* category=WAS Suite_Logic output=CONTROL_NET */
        WASControlNetModelInputSwitch(
            args: WASControlNetModelInputSwitch_input,
            uid?: ComfyNodeUID,
        ): WASControlNetModelInputSwitch
        /* category=WAS Suite_Debug output=NUMBER */
        WASDebugNumberToConsole(args: WASDebugNumberToConsole_input, uid?: ComfyNodeUID): WASDebugNumberToConsole
        /* category=WAS Suite_Debug output=DICT */
        WASDictionaryToConsole(args: WASDictionaryToConsole_input, uid?: ComfyNodeUID): WASDictionaryToConsole
        /* category=WAS Suite_Loaders_Advanced output=MODEL, CLIP, VAE, STRING */
        WASDiffusersModelLoader(args: WASDiffusersModelLoader_input, uid?: ComfyNodeUID): WASDiffusersModelLoader
        /* category=WAS Suite_Loaders_Advanced output=MODEL, CLIP, VAE, STRING */
        WASDiffusersHubModelDownLoader(
            args: WASDiffusersHubModelDownLoader_input,
            uid?: ComfyNodeUID,
        ): WASDiffusersHubModelDownLoader
        /* category=WAS Suite_Debug output= */
        WASExportAPI(args: WASExportAPI_input, uid?: ComfyNodeUID): WASExportAPI
        /* category=WAS Suite_Logic output=LATENT */
        WASLatentInputSwitch(args: WASLatentInputSwitch_input, uid?: ComfyNodeUID): WASLatentInputSwitch
        /* category=WAS Suite_IO output=LATENT, IMAGE, CONDITIONING */
        WASLoadCache(args: WASLoadCache_input, uid?: ComfyNodeUID): WASLoadCache
        /* category=WAS Suite_Logic output=NUMBER */
        WASLogicBoolean(args: WASLogicBoolean_input, uid?: ComfyNodeUID): WASLogicBoolean
        /* category=WAS Suite_Loaders output=MODEL, CLIP, STRING */
        WASLoraLoader(args: WASLoraLoader_input, uid?: ComfyNodeUID): WASLoraLoader
        /* category=WAS Suite_Image_Filter output=IMAGE, IMAGE_1, IMAGE_2 */
        WASImageSSAOAmbientOcclusion(args: WASImageSSAOAmbientOcclusion_input, uid?: ComfyNodeUID): WASImageSSAOAmbientOcclusion
        /* category=WAS Suite_Image_Filter output=IMAGE, IMAGE_1, IMAGE_2, IMAGE_3 */
        WASImageSSDODirectOcclusion(args: WASImageSSDODirectOcclusion_input, uid?: ComfyNodeUID): WASImageSSDODirectOcclusion
        /* category=WAS Suite_Image_Analyze output=IMAGE */
        WASImageAnalyze(args: WASImageAnalyze_input, uid?: ComfyNodeUID): WASImageAnalyze
        /* category=WAS Suite_Image output=IMAGE */
        WASImageBatch(args: WASImageBatch_input, uid?: ComfyNodeUID): WASImageBatch
        /* category=WAS Suite_Image output=IMAGE */
        WASImageBlank(args: WASImageBlank_input, uid?: ComfyNodeUID): WASImageBlank
        /* category=WAS Suite_Image output=IMAGE */
        WASImageBlendByMask(args: WASImageBlendByMask_input, uid?: ComfyNodeUID): WASImageBlendByMask
        /* category=WAS Suite_Image output=IMAGE */
        WASImageBlend(args: WASImageBlend_input, uid?: ComfyNodeUID): WASImageBlend
        /* category=WAS Suite_Image output=IMAGE */
        WASImageBlendingMode(args: WASImageBlendingMode_input, uid?: ComfyNodeUID): WASImageBlendingMode
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageBloomFilter(args: WASImageBloomFilter_input, uid?: ComfyNodeUID): WASImageBloomFilter
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageCannyFilter(args: WASImageCannyFilter_input, uid?: ComfyNodeUID): WASImageCannyFilter
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageChromaticAberration(args: WASImageChromaticAberration_input, uid?: ComfyNodeUID): WASImageChromaticAberration
        /* category=WAS Suite_Image_Analyze output=IMAGE, LIST */
        WASImageColorPalette(args: WASImageColorPalette_input, uid?: ComfyNodeUID): WASImageColorPalette
        /* category=WAS Suite_Image_Process output=IMAGE, CROP_DATA */
        WASImageCropFace(args: WASImageCropFace_input, uid?: ComfyNodeUID): WASImageCropFace
        /* category=WAS Suite_Image_Process output=IMAGE, CROP_DATA */
        WASImageCropLocation(args: WASImageCropLocation_input, uid?: ComfyNodeUID): WASImageCropLocation
        /* category=WAS Suite_Image_Process output=IMAGE, CROP_DATA */
        WASImageCropSquareLocation(args: WASImageCropSquareLocation_input, uid?: ComfyNodeUID): WASImageCropSquareLocation
        /* category=WAS Suite_Image_Transform output=IMAGE */
        WASImageDisplacementWarp(args: WASImageDisplacementWarp_input, uid?: ComfyNodeUID): WASImageDisplacementWarp
        /* category=WAS Suite_Image_Process output=IMAGE, IMAGE_1 */
        WASImagePasteFace(args: WASImagePasteFace_input, uid?: ComfyNodeUID): WASImagePasteFace
        /* category=WAS Suite_Image_Process output=IMAGE, IMAGE_1 */
        WASImagePasteCrop(args: WASImagePasteCrop_input, uid?: ComfyNodeUID): WASImagePasteCrop
        /* category=WAS Suite_Image_Process output=IMAGE, IMAGE_1 */
        WASImagePasteCropByLocation(args: WASImagePasteCropByLocation_input, uid?: ComfyNodeUID): WASImagePasteCropByLocation
        /* category=WAS Suite_Image_Process output=IMAGE */
        WASImagePixelate(args: WASImagePixelate_input, uid?: ComfyNodeUID): WASImagePixelate
        /* category=WAS Suite_Image_Generate_Noise output=IMAGE */
        WASImagePowerNoise(args: WASImagePowerNoise_input, uid?: ComfyNodeUID): WASImagePowerNoise
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageDraganPhotographyFilter(
            args: WASImageDraganPhotographyFilter_input,
            uid?: ComfyNodeUID,
        ): WASImageDraganPhotographyFilter
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageEdgeDetectionFilter(args: WASImageEdgeDetectionFilter_input, uid?: ComfyNodeUID): WASImageEdgeDetectionFilter
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageFilmGrain(args: WASImageFilmGrain_input, uid?: ComfyNodeUID): WASImageFilmGrain
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageFilterAdjustments(args: WASImageFilterAdjustments_input, uid?: ComfyNodeUID): WASImageFilterAdjustments
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageGradientMap(args: WASImageGradientMap_input, uid?: ComfyNodeUID): WASImageGradientMap
        /* category=WAS Suite_Image_Generate output=IMAGE */
        WASImageGenerateGradient(args: WASImageGenerateGradient_input, uid?: ComfyNodeUID): WASImageGenerateGradient
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageHighPassFilter(args: WASImageHighPassFilter_input, uid?: ComfyNodeUID): WASImageHighPassFilter
        /* category=WAS Suite_History output=IMAGE, ASCII */
        WASImageHistoryLoader(args: WASImageHistoryLoader_input, uid?: ComfyNodeUID): WASImageHistoryLoader
        /* category=WAS Suite_Logic output=IMAGE */
        WASImageInputSwitch(args: WASImageInputSwitch_input, uid?: ComfyNodeUID): WASImageInputSwitch
        /* category=WAS Suite_Image_Adjustment output=IMAGE */
        WASImageLevelsAdjustment(args: WASImageLevelsAdjustment_input, uid?: ComfyNodeUID): WASImageLevelsAdjustment
        /* category=WAS Suite_IO output=IMAGE, MASK, ASCII */
        WASImageLoad(args: WASImageLoad_input, uid?: ComfyNodeUID): WASImageLoad
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageMedianFilter(args: WASImageMedianFilter_input, uid?: ComfyNodeUID): WASImageMedianFilter
        /* category=WAS Suite_Image_Process output=IMAGE */
        WASImageMixRGBChannels(args: WASImageMixRGBChannels_input, uid?: ComfyNodeUID): WASImageMixRGBChannels
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageMonitorEffectsFilter(args: WASImageMonitorEffectsFilter_input, uid?: ComfyNodeUID): WASImageMonitorEffectsFilter
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageNovaFilter(args: WASImageNovaFilter_input, uid?: ComfyNodeUID): WASImageNovaFilter
        /* category=WAS Suite_Image_Transform output=IMAGE, IMAGE_1 */
        WASImagePadding(args: WASImagePadding_input, uid?: ComfyNodeUID): WASImagePadding
        /* category=WAS Suite_Image_Generate_Noise output=IMAGE */
        WASImagePerlinNoise(args: WASImagePerlinNoise_input, uid?: ComfyNodeUID): WASImagePerlinNoise
        /* category=WAS Suite_Image_AI output=IMAGE */
        WASImageRembgRemoveBackground(
            args: WASImageRembgRemoveBackground_input,
            uid?: ComfyNodeUID,
        ): WASImageRembgRemoveBackground
        /* category=WAS Suite_Image_Generate_Noise output=IMAGE */
        WASImagePerlinPowerFractal(args: WASImagePerlinPowerFractal_input, uid?: ComfyNodeUID): WASImagePerlinPowerFractal
        /* category=WAS Suite_Image_Process output=IMAGE */
        WASImageRemoveBackgroundAlpha(
            args: WASImageRemoveBackgroundAlpha_input,
            uid?: ComfyNodeUID,
        ): WASImageRemoveBackgroundAlpha
        /* category=WAS Suite_Image_Process output=IMAGE */
        WASImageRemoveColor(args: WASImageRemoveColor_input, uid?: ComfyNodeUID): WASImageRemoveColor
        /* category=WAS Suite_Image_Transform output=IMAGE */
        WASImageResize(args: WASImageResize_input, uid?: ComfyNodeUID): WASImageResize
        /* category=WAS Suite_Image_Transform output=IMAGE */
        WASImageRotate(args: WASImageRotate_input, uid?: ComfyNodeUID): WASImageRotate
        /* category=WAS Suite_Image_Adjustment output=IMAGE */
        WASImageRotateHue(args: WASImageRotateHue_input, uid?: ComfyNodeUID): WASImageRotateHue
        /* category=WAS Suite_IO output= */
        WASImageSave(args: WASImageSave_input, uid?: ComfyNodeUID): WASImageSave
        /* category=WAS Suite_Image_Process output=IMAGE */
        WASImageSeamlessTexture(args: WASImageSeamlessTexture_input, uid?: ComfyNodeUID): WASImageSeamlessTexture
        /* category=WAS Suite_Image_Process output=IMAGE */
        WASImageSelectChannel(args: WASImageSelectChannel_input, uid?: ComfyNodeUID): WASImageSelectChannel
        /* category=WAS Suite_Image_Process output=IMAGE */
        WASImageSelectColor(args: WASImageSelectColor_input, uid?: ComfyNodeUID): WASImageSelectColor
        /* category=WAS Suite_Image_Adjustment output=IMAGE, IMAGE_1, IMAGE_2 */
        WASImageShadowsAndHighlights(args: WASImageShadowsAndHighlights_input, uid?: ComfyNodeUID): WASImageShadowsAndHighlights
        /* category=WAS Suite_Number_Operations output=NUMBER, NUMBER_1 */
        WASImageSizeToNumber(args: WASImageSizeToNumber_input, uid?: ComfyNodeUID): WASImageSizeToNumber
        /* category=WAS Suite_Image_Transform output=IMAGE */
        WASImageStitch(args: WASImageStitch_input, uid?: ComfyNodeUID): WASImageStitch
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageStyleFilter(args: WASImageStyleFilter_input, uid?: ComfyNodeUID): WASImageStyleFilter
        /* category=WAS Suite_Image_Process output=IMAGE */
        WASImageThreshold(args: WASImageThreshold_input, uid?: ComfyNodeUID): WASImageThreshold
        /* category=WAS Suite_Image_Process output=IMAGE */
        WASImageTiled(args: WASImageTiled_input, uid?: ComfyNodeUID): WASImageTiled
        /* category=WAS Suite_Image_Transform output=IMAGE */
        WASImageTranspose(args: WASImageTranspose_input, uid?: ComfyNodeUID): WASImageTranspose
        /* category=WAS Suite_Image_Filter output=IMAGE */
        WASImageFDOFFilter(args: WASImageFDOFFilter_input, uid?: ComfyNodeUID): WASImageFDOFFilter
        /* category=WAS Suite_Image_Masking output=MASK */
        WASImageToLatentMask(args: WASImageToLatentMask_input, uid?: ComfyNodeUID): WASImageToLatentMask
        /* category=WAS Suite_Image_Generate_Noise output=IMAGE */
        WASImageToNoise(args: WASImageToNoise_input, uid?: ComfyNodeUID): WASImageToNoise
        /* category=WAS Suite_Image_Analyze output=INT */
        WASImageToSeed(args: WASImageToSeed_input, uid?: ComfyNodeUID): WASImageToSeed
        /* category=WAS Suite_Image_Generate_Noise output=IMAGE */
        WASImageVoronoiNoiseFilter(args: WASImageVoronoiNoiseFilter_input, uid?: ComfyNodeUID): WASImageVoronoiNoiseFilter
        /* category=WAS Suite_Sampling output=LATENT */
        WASKSamplerWAS(args: WASKSamplerWAS_input, uid?: ComfyNodeUID): WASKSamplerWAS
        /* category=WAS Suite_Sampling output=LATENT */
        WASKSamplerCycle(args: WASKSamplerCycle_input, uid?: ComfyNodeUID): WASKSamplerCycle
        /* category=WAS Suite_Latent_Generate output=LATENT */
        WASLatentNoiseInjection(args: WASLatentNoiseInjection_input, uid?: ComfyNodeUID): WASLatentNoiseInjection
        /* category=WAS Suite_Number_Operations output=NUMBER, NUMBER_1 */
        WASLatentSizeToNumber(args: WASLatentSizeToNumber_input, uid?: ComfyNodeUID): WASLatentSizeToNumber
        /* category=WAS Suite_Latent_Transform output=LATENT */
        WASLatentUpscaleByFactorWAS(args: WASLatentUpscaleByFactorWAS_input, uid?: ComfyNodeUID): WASLatentUpscaleByFactorWAS
        /* category=WAS Suite_IO output=IMAGE, ASCII */
        WASLoadImageBatch(args: WASLoadImageBatch_input, uid?: ComfyNodeUID): WASLoadImageBatch
        /* category=WAS Suite_IO output=ASCII, DICT */
        WASLoadTextFile(args: WASLoadTextFile_input, uid?: ComfyNodeUID): WASLoadTextFile
        /* category=WAS Suite_Loaders output=MODEL, CLIP, STRING */
        WASLoadLora(args: WASLoadLora_input, uid?: ComfyNodeUID): WASLoadLora
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMasksAdd(args: WASMasksAdd_input, uid?: ComfyNodeUID): WASMasksAdd
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMasksSubtract(args: WASMasksSubtract_input, uid?: ComfyNodeUID): WASMasksSubtract
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskArbitraryRegion(args: WASMaskArbitraryRegion_input, uid?: ComfyNodeUID): WASMaskArbitraryRegion
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskBatchToMask(args: WASMaskBatchToMask_input, uid?: ComfyNodeUID): WASMaskBatchToMask
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskCeilingRegion(args: WASMaskCeilingRegion_input, uid?: ComfyNodeUID): WASMaskCeilingRegion
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskCropDominantRegion(args: WASMaskCropDominantRegion_input, uid?: ComfyNodeUID): WASMaskCropDominantRegion
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskCropMinorityRegion(args: WASMaskCropMinorityRegion_input, uid?: ComfyNodeUID): WASMaskCropMinorityRegion
        /* category=WAS Suite_Image_Masking output=MASK, CROP_DATA, INT, INT_1, INT_2, INT_3, INT_4, INT_5 */
        WASMaskCropRegion(args: WASMaskCropRegion_input, uid?: ComfyNodeUID): WASMaskCropRegion
        /* category=WAS Suite_Image_Masking output=MASK, MASK_1 */
        WASMaskPasteRegion(args: WASMaskPasteRegion_input, uid?: ComfyNodeUID): WASMaskPasteRegion
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskDilateRegion(args: WASMaskDilateRegion_input, uid?: ComfyNodeUID): WASMaskDilateRegion
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskDominantRegion(args: WASMaskDominantRegion_input, uid?: ComfyNodeUID): WASMaskDominantRegion
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskErodeRegion(args: WASMaskErodeRegion_input, uid?: ComfyNodeUID): WASMaskErodeRegion
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskFillHoles(args: WASMaskFillHoles_input, uid?: ComfyNodeUID): WASMaskFillHoles
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskFloorRegion(args: WASMaskFloorRegion_input, uid?: ComfyNodeUID): WASMaskFloorRegion
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskGaussianRegion(args: WASMaskGaussianRegion_input, uid?: ComfyNodeUID): WASMaskGaussianRegion
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskInvert(args: WASMaskInvert_input, uid?: ComfyNodeUID): WASMaskInvert
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskMinorityRegion(args: WASMaskMinorityRegion_input, uid?: ComfyNodeUID): WASMaskMinorityRegion
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskSmoothRegion(args: WASMaskSmoothRegion_input, uid?: ComfyNodeUID): WASMaskSmoothRegion
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMaskThresholdRegion(args: WASMaskThresholdRegion_input, uid?: ComfyNodeUID): WASMaskThresholdRegion
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMasksCombineRegions(args: WASMasksCombineRegions_input, uid?: ComfyNodeUID): WASMasksCombineRegions
        /* category=WAS Suite_Image_Masking output=MASK */
        WASMasksCombineBatch(args: WASMasksCombineBatch_input, uid?: ComfyNodeUID): WASMasksCombineBatch
        /* category=WAS Suite_Loaders output=MIDAS_MODEL */
        WASMiDaSModelLoader(args: WASMiDaSModelLoader_input, uid?: ComfyNodeUID): WASMiDaSModelLoader
        /* category=WAS Suite_Image_AI output=IMAGE */
        WASMiDaSDepthApproximation(args: WASMiDaSDepthApproximation_input, uid?: ComfyNodeUID): WASMiDaSDepthApproximation
        /* category=WAS Suite_Image_AI output=IMAGE, IMAGE_1 */
        WASMiDaSMaskImage(args: WASMiDaSMaskImage_input, uid?: ComfyNodeUID): WASMiDaSMaskImage
        /* category=WAS Suite_Logic output=MODEL */
        WASModelInputSwitch(args: WASModelInputSwitch_input, uid?: ComfyNodeUID): WASModelInputSwitch
        /* category=WAS Suite_Number_Operations output=NUMBER */
        WASNumberOperation(args: WASNumberOperation_input, uid?: ComfyNodeUID): WASNumberOperation
        /* category=WAS Suite_Number_Operations output=FLOAT */
        WASNumberToFloat(args: WASNumberToFloat_input, uid?: ComfyNodeUID): WASNumberToFloat
        /* category=WAS Suite_Logic output=NUMBER */
        WASNumberInputSwitch(args: WASNumberInputSwitch_input, uid?: ComfyNodeUID): WASNumberInputSwitch
        /* category=WAS Suite_Logic output=NUMBER */
        WASNumberInputCondition(args: WASNumberInputCondition_input, uid?: ComfyNodeUID): WASNumberInputCondition
        /* category=WAS Suite_Number_Functions output=NUMBER */
        WASNumberMultipleOf(args: WASNumberMultipleOf_input, uid?: ComfyNodeUID): WASNumberMultipleOf
        /* category=WAS Suite_Number output=NUMBER */
        WASNumberPI(args: WASNumberPI_input, uid?: ComfyNodeUID): WASNumberPI
        /* category=WAS Suite_Number_Operations output=INT */
        WASNumberToInt(args: WASNumberToInt_input, uid?: ComfyNodeUID): WASNumberToInt
        /* category=WAS Suite_Number_Operations output=SEED */
        WASNumberToSeed(args: WASNumberToSeed_input, uid?: ComfyNodeUID): WASNumberToSeed
        /* category=WAS Suite_Number_Operations output=STRING */
        WASNumberToString(args: WASNumberToString_input, uid?: ComfyNodeUID): WASNumberToString
        /* category=WAS Suite_Number_Operations output=ASCII */
        WASNumberToText(args: WASNumberToText_input, uid?: ComfyNodeUID): WASNumberToText
        /* category=WAS Suite_Text output=ASCII, ASCII_1 */
        WASPromptStylesSelector(args: WASPromptStylesSelector_input, uid?: ComfyNodeUID): WASPromptStylesSelector
        /* category=WAS Suite_Number output=NUMBER */
        WASRandomNumber(args: WASRandomNumber_input, uid?: ComfyNodeUID): WASRandomNumber
        /* category=WAS Suite_IO output= */
        WASSaveTextFile(args: WASSaveTextFile_input, uid?: ComfyNodeUID): WASSaveTextFile
        /* category=WAS Suite_Number output=SEED */
        WASSeed(args: WASSeed_input, uid?: ComfyNodeUID): WASSeed
        /* category=WAS Suite_Latent_Transform output=IMAGE */
        WASTensorBatchToImage(args: WASTensorBatchToImage_input, uid?: ComfyNodeUID): WASTensorBatchToImage
        /* category=WAS Suite_Text_AI output=ASCII */
        WASBLIPAnalyzeImage(args: WASBLIPAnalyzeImage_input, uid?: ComfyNodeUID): WASBLIPAnalyzeImage
        /* category=WAS Suite_Image_Masking output=SAM_MODEL */
        WASSAMModelLoader(args: WASSAMModelLoader_input, uid?: ComfyNodeUID): WASSAMModelLoader
        /* category=WAS Suite_Image_Masking output=SAM_PARAMETERS */
        WASSAMParameters(args: WASSAMParameters_input, uid?: ComfyNodeUID): WASSAMParameters
        /* category=WAS Suite_Image_Masking output=SAM_PARAMETERS */
        WASSAMParametersCombine(args: WASSAMParametersCombine_input, uid?: ComfyNodeUID): WASSAMParametersCombine
        /* category=WAS Suite_Image_Masking output=IMAGE, MASK */
        WASSAMImageMask(args: WASSAMImageMask_input, uid?: ComfyNodeUID): WASSAMImageMask
        /* category=WAS Suite_Debug output=LATENT */
        WASSamplesPassthroughStatSystem(
            args: WASSamplesPassthroughStatSystem_input,
            uid?: ComfyNodeUID,
        ): WASSamplesPassthroughStatSystem
        /* category=WAS Suite_Text_Operations output=ASCII */
        WASStringToText(args: WASStringToText_input, uid?: ComfyNodeUID): WASStringToText
        /* category=WAS Suite_Image_Bound output=IMAGE_BOUNDS */
        WASImageBounds(args: WASImageBounds_input, uid?: ComfyNodeUID): WASImageBounds
        /* category=WAS Suite_Image_Bound output=IMAGE_BOUNDS */
        WASInsetImageBounds(args: WASInsetImageBounds_input, uid?: ComfyNodeUID): WASInsetImageBounds
        /* category=WAS Suite_Image_Bound output=IMAGE */
        WASBoundedImageBlend(args: WASBoundedImageBlend_input, uid?: ComfyNodeUID): WASBoundedImageBlend
        /* category=WAS Suite_Image_Bound output=IMAGE */
        WASBoundedImageBlendWithMask(args: WASBoundedImageBlendWithMask_input, uid?: ComfyNodeUID): WASBoundedImageBlendWithMask
        /* category=WAS Suite_Image_Bound output=IMAGE */
        WASBoundedImageCrop(args: WASBoundedImageCrop_input, uid?: ComfyNodeUID): WASBoundedImageCrop
        /* category=WAS Suite_Image_Bound output=IMAGE, IMAGE_BOUNDS */
        WASBoundedImageCropWithMask(args: WASBoundedImageCropWithMask_input, uid?: ComfyNodeUID): WASBoundedImageCropWithMask
        /* category=WAS Suite_Text output=DICT */
        WASTextDictionaryUpdate(args: WASTextDictionaryUpdate_input, uid?: ComfyNodeUID): WASTextDictionaryUpdate
        /* category=WAS Suite_Text_Tokens output= */
        WASTextAddTokens(args: WASTextAddTokens_input, uid?: ComfyNodeUID): WASTextAddTokens
        /* category=WAS Suite_Text_Tokens output= */
        WASTextAddTokenByInput(args: WASTextAddTokenByInput_input, uid?: ComfyNodeUID): WASTextAddTokenByInput
        /* category=WAS Suite_Text_Search output=ASCII, ASCII_1, NUMBER, NUMBER_1, ASCII_2 */
        WASTextCompare(args: WASTextCompare_input, uid?: ComfyNodeUID): WASTextCompare
        /* category=WAS Suite_Text output=ASCII */
        WASTextConcatenate(args: WASTextConcatenate_input, uid?: ComfyNodeUID): WASTextConcatenate
        /* category=WAS Suite_History output=ASCII, DICT */
        WASTextFileHistoryLoader(args: WASTextFileHistoryLoader_input, uid?: ComfyNodeUID): WASTextFileHistoryLoader
        /* category=WAS Suite_Text_Search output=ASCII */
        WASTextFindAndReplaceByDictionary(
            args: WASTextFindAndReplaceByDictionary_input,
            uid?: ComfyNodeUID,
        ): WASTextFindAndReplaceByDictionary
        /* category=WAS Suite_Text_Search output=ASCII */
        WASTextFindAndReplaceInput(args: WASTextFindAndReplaceInput_input, uid?: ComfyNodeUID): WASTextFindAndReplaceInput
        /* category=WAS Suite_Text_Search output=ASCII */
        WASTextFindAndReplace(args: WASTextFindAndReplace_input, uid?: ComfyNodeUID): WASTextFindAndReplace
        /* category=WAS Suite_Logic output=ASCII */
        WASTextInputSwitch(args: WASTextInputSwitch_input, uid?: ComfyNodeUID): WASTextInputSwitch
        /* category=WAS Suite_Text output=LIST */
        WASTextList(args: WASTextList_input, uid?: ComfyNodeUID): WASTextList
        /* category=WAS Suite_Text output=LIST */
        WASTextListConcatenate(args: WASTextListConcatenate_input, uid?: ComfyNodeUID): WASTextListConcatenate
        /* category=WAS Suite_Text output=ASCII, DICT */
        WASTextLoadLineFromFile(args: WASTextLoadLineFromFile_input, uid?: ComfyNodeUID): WASTextLoadLineFromFile
        /* category=WAS Suite_Text output=ASCII */
        WASTextMultiline(args: WASTextMultiline_input, uid?: ComfyNodeUID): WASTextMultiline
        /* category=WAS Suite_Text_Parse output=ASCII */
        WASTextParseA1111Embeddings(args: WASTextParseA1111Embeddings_input, uid?: ComfyNodeUID): WASTextParseA1111Embeddings
        /* category=WAS Suite_Text_Parse output=ASCII */
        WASTextParseNoodleSoupPrompts(
            args: WASTextParseNoodleSoupPrompts_input,
            uid?: ComfyNodeUID,
        ): WASTextParseNoodleSoupPrompts
        /* category=WAS Suite_Text_Tokens output=ASCII */
        WASTextParseTokens(args: WASTextParseTokens_input, uid?: ComfyNodeUID): WASTextParseTokens
        /* category=WAS Suite_Text output=ASCII */
        WASTextRandomLine(args: WASTextRandomLine_input, uid?: ComfyNodeUID): WASTextRandomLine
        /* category=WAS Suite_Text output=ASCII */
        WASTextRandomPrompt(args: WASTextRandomPrompt_input, uid?: ComfyNodeUID): WASTextRandomPrompt
        /* category=WAS Suite_Text output=ASCII, ASCII_1, ASCII_2, ASCII_3 */
        WASTextString(args: WASTextString_input, uid?: ComfyNodeUID): WASTextString
        /* category=WAS Suite_Text_Operations output=CONDITIONING */
        WASTextToConditioning(args: WASTextToConditioning_input, uid?: ComfyNodeUID): WASTextToConditioning
        /* category=WAS Suite_Debug output=ASCII */
        WASTextToConsole(args: WASTextToConsole_input, uid?: ComfyNodeUID): WASTextToConsole
        /* category=WAS Suite_Text_Operations output=NUMBER */
        WASTextToNumber(args: WASTextToNumber_input, uid?: ComfyNodeUID): WASTextToNumber
        /* category=WAS Suite_Text_Operations output=STRING */
        WASTextToString(args: WASTextToString_input, uid?: ComfyNodeUID): WASTextToString
        /* category=WAS Suite_Number output=NUMBER */
        WASTrueRandomOrgNumberGenerator(
            args: WASTrueRandomOrgNumberGenerator_input,
            uid?: ComfyNodeUID,
        ): WASTrueRandomOrgNumberGenerator
        /* category=WAS Suite_Loaders output=MODEL, CLIP, VAE, CLIP_VISION, STRING */
        WASUnCLIPCheckpointLoader(args: WASUnCLIPCheckpointLoader_input, uid?: ComfyNodeUID): WASUnCLIPCheckpointLoader
        /* category=WAS Suite_Loaders output=UPSCALE_MODEL, ASCII */
        WASUpscaleModelLoader(args: WASUpscaleModelLoader_input, uid?: ComfyNodeUID): WASUpscaleModelLoader
        /* category=WAS Suite_Logic output=UPSCALE_MODEL */
        WASUpscaleModelSwitch(args: WASUpscaleModelSwitch_input, uid?: ComfyNodeUID): WASUpscaleModelSwitch
        /* category=WAS Suite_Animation_Writer output=IMAGE, ASCII, ASCII_1 */
        WASWriteToGIF(args: WASWriteToGIF_input, uid?: ComfyNodeUID): WASWriteToGIF
        /* category=WAS Suite_Animation_Writer output=IMAGE, ASCII, ASCII_1 */
        WASWriteToVideo(args: WASWriteToVideo_input, uid?: ComfyNodeUID): WASWriteToVideo
        /* category=WAS Suite_Logic output=VAE */
        WASVAEInputSwitch(args: WASVAEInputSwitch_input, uid?: ComfyNodeUID): WASVAEInputSwitch
        /* category=WAS Suite_Animation output=ASCII, NUMBER */
        WASVideoDumpFrames(args: WASVideoDumpFrames_input, uid?: ComfyNodeUID): WASVideoDumpFrames
        /* category=image output=IMAGE, MASK */
        YKImagePadForOutpaint(args: YKImagePadForOutpaint_input, uid?: ComfyNodeUID): YKImagePadForOutpaint
        /* category=mask output=IMAGE */
        YKMaskToImage(args: YKMaskToImage_input, uid?: ComfyNodeUID): YKMaskToImage
    }

    // Requirable --------------------------
    export interface Requirable {
        LATENT: LATENT
        MODEL: MODEL
        INT: INT
        FLOAT: FLOAT
        CONDITIONING: CONDITIONING
        CLIP: CLIP
        VAE: VAE
        STRING: STRING
        IMAGE: IMAGE
        MASK: MASK
        CLIP_VISION_OUTPUT: CLIP_VISION_OUTPUT
        CLIP_VISION: CLIP_VISION
        STYLE_MODEL: STYLE_MODEL
        CONTROL_NET: CONTROL_NET
        GLIGEN: GLIGEN
        UPSCALE_MODEL: UPSCALE_MODEL
        SAM_MODEL: SAM_MODEL
        BBOX_DETECTOR: BBOX_DETECTOR
        SEGM_DETECTOR: SEGM_DETECTOR
        ONNX_DETECTOR: ONNX_DETECTOR
        SEGS: SEGS
        BASIC_PIPE: BASIC_PIPE
        DETAILER_PIPE: DETAILER_PIPE
        UPSCALER: UPSCALER
        PK_HOOK: PK_HOOK
        KSAMPLER: KSAMPLER
        BBOX_MODEL: BBOX_MODEL
        SEGM_MODEL: SEGM_MODEL
        CLIPREGION: CLIPREGION
        SCRIPT: SCRIPT
        DEPENDENCIES: DEPENDENCIES
        XY: XY
        MASK_MAPPING: MASK_MAPPING
        BLIP_MODEL: BLIP_MODEL
        ASCII: ASCII
        NUMBER: NUMBER
        CLIPSEG_MODEL: CLIPSEG_MODEL
        DICT: DICT
        LIST: LIST
        CROP_DATA: CROP_DATA
        SEED: SEED
        MIDAS_MODEL: MIDAS_MODEL
        SAM_PARAMETERS: SAM_PARAMETERS
        IMAGE_BOUNDS: IMAGE_BOUNDS
        Enum_KSampler_sampler_name: Enum_KSampler_sampler_name
        Enum_KSampler_scheduler: Enum_KSampler_scheduler
        Enum_CheckpointLoaderSimple_ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
        Enum_VAELoader_vae_name: Enum_VAELoader_vae_name
        Enum_LatentUpscale_upscale_method: Enum_LatentUpscale_upscale_method
        Enum_LatentUpscale_crop: Enum_LatentUpscale_crop
        Enum_LatentUpscaleBy_upscale_method: Enum_LatentUpscaleBy_upscale_method
        Enum_LoadImage_image: Enum_LoadImage_image
        Enum_LoadImageMask_image: Enum_LoadImageMask_image
        Enum_LoadImageMask_channel: Enum_LoadImageMask_channel
        Enum_ConditioningSetMask_set_cond_area: Enum_ConditioningSetMask_set_cond_area
        Enum_KSamplerAdvanced_add_noise: Enum_KSamplerAdvanced_add_noise
        Enum_KSamplerAdvanced_sampler_name: Enum_KSamplerAdvanced_sampler_name
        Enum_KSamplerAdvanced_scheduler: Enum_KSamplerAdvanced_scheduler
        Enum_KSamplerAdvanced_return_with_leftover_noise: Enum_KSamplerAdvanced_return_with_leftover_noise
        Enum_LatentRotate_rotation: Enum_LatentRotate_rotation
        Enum_LatentFlip_flip_method: Enum_LatentFlip_flip_method
        Enum_LoraLoader_lora_name: Enum_LoraLoader_lora_name
        Enum_CLIPLoader_clip_name: Enum_CLIPLoader_clip_name
        Enum_DualCLIPLoader_clip_name1: Enum_DualCLIPLoader_clip_name1
        Enum_DualCLIPLoader_clip_name2: Enum_DualCLIPLoader_clip_name2
        Enum_ControlNetLoader_control_net_name: Enum_ControlNetLoader_control_net_name
        Enum_DiffControlNetLoader_control_net_name: Enum_DiffControlNetLoader_control_net_name
        Enum_StyleModelLoader_style_model_name: Enum_StyleModelLoader_style_model_name
        Enum_CLIPVisionLoader_clip_name: Enum_CLIPVisionLoader_clip_name
        Enum_UnCLIPCheckpointLoader_ckpt_name: Enum_UnCLIPCheckpointLoader_ckpt_name
        Enum_GLIGENLoader_gligen_name: Enum_GLIGENLoader_gligen_name
        Enum_CheckpointLoader_config_name: Enum_CheckpointLoader_config_name
        Enum_CheckpointLoader_ckpt_name: Enum_CheckpointLoader_ckpt_name
        Enum_DiffusersLoader_model_path: Enum_DiffusersLoader_model_path
        Enum_HypernetworkLoader_hypernetwork_name: Enum_HypernetworkLoader_hypernetwork_name
        Enum_UpscaleModelLoader_model_name: Enum_UpscaleModelLoader_model_name
        Enum_ImageToMask_channel: Enum_ImageToMask_channel
        Enum_MaskComposite_operation: Enum_MaskComposite_operation
        Enum_BrightnessContrast_mode: Enum_BrightnessContrast_mode
        Enum_AlphaChanelAddByMask_method: Enum_AlphaChanelAddByMask_method
        Enum_AlphaChanelAsMask_method: Enum_AlphaChanelAsMask_method
        Enum_ImageBatchFork_priority: Enum_ImageBatchFork_priority
        Enum_ImageCompositeAbsolute_background: Enum_ImageCompositeAbsolute_background
        Enum_ImageCompositeAbsolute_method: Enum_ImageCompositeAbsolute_method
        Enum_ImageCompositeAbsoluteByContainer_background: Enum_ImageCompositeAbsoluteByContainer_background
        Enum_ImageCompositeAbsoluteByContainer_method: Enum_ImageCompositeAbsoluteByContainer_method
        Enum_ImageCompositeRelative_background: Enum_ImageCompositeRelative_background
        Enum_ImageCompositeRelative_container_size_type: Enum_ImageCompositeRelative_container_size_type
        Enum_ImageCompositeRelative_method: Enum_ImageCompositeRelative_method
        Enum_ImageCompositeRelativeByContainer_background: Enum_ImageCompositeRelativeByContainer_background
        Enum_ImageCompositeRelativeByContainer_method: Enum_ImageCompositeRelativeByContainer_method
        Enum_ImageContainerInheritanceAdd_method: Enum_ImageContainerInheritanceAdd_method
        Enum_ImageContainerInheritanceScale_method: Enum_ImageContainerInheritanceScale_method
        Enum_ImageContainerInheritanceMax_method: Enum_ImageContainerInheritanceMax_method
        Enum_ImageContainerInheritanceSum_container_size_type: Enum_ImageContainerInheritanceSum_container_size_type
        Enum_ImageContainerInheritanceSum_method: Enum_ImageContainerInheritanceSum_method
        Enum_ImageDrawArc_method: Enum_ImageDrawArc_method
        Enum_ImageDrawArcByContainer_method: Enum_ImageDrawArcByContainer_method
        Enum_ImageDrawChord_method: Enum_ImageDrawChord_method
        Enum_ImageDrawChordByContainer_method: Enum_ImageDrawChordByContainer_method
        Enum_ImageDrawEllipse_method: Enum_ImageDrawEllipse_method
        Enum_ImageDrawEllipseByContainer_method: Enum_ImageDrawEllipseByContainer_method
        Enum_ImageDrawLine_method: Enum_ImageDrawLine_method
        Enum_ImageDrawLineByContainer_method: Enum_ImageDrawLineByContainer_method
        Enum_ImageDrawPieslice_method: Enum_ImageDrawPieslice_method
        Enum_ImageDrawPiesliceByContainer_method: Enum_ImageDrawPiesliceByContainer_method
        Enum_ImageDrawRectangle_method: Enum_ImageDrawRectangle_method
        Enum_ImageDrawRectangleByContainer_method: Enum_ImageDrawRectangleByContainer_method
        Enum_ImageDrawRectangleRounded_top_left_corner: Enum_ImageDrawRectangleRounded_top_left_corner
        Enum_ImageDrawRectangleRounded_top_right_corner: Enum_ImageDrawRectangleRounded_top_right_corner
        Enum_ImageDrawRectangleRounded_bottom_right_corner: Enum_ImageDrawRectangleRounded_bottom_right_corner
        Enum_ImageDrawRectangleRounded_bottom_left_corner: Enum_ImageDrawRectangleRounded_bottom_left_corner
        Enum_ImageDrawRectangleRounded_method: Enum_ImageDrawRectangleRounded_method
        Enum_ImageDrawRectangleRoundedByContainer_top_left_corner: Enum_ImageDrawRectangleRoundedByContainer_top_left_corner
        Enum_ImageDrawRectangleRoundedByContainer_top_right_corner: Enum_ImageDrawRectangleRoundedByContainer_top_right_corner
        Enum_ImageDrawRectangleRoundedByContainer_bottom_right_corner: Enum_ImageDrawRectangleRoundedByContainer_bottom_right_corner
        Enum_ImageDrawRectangleRoundedByContainer_bottom_left_corner: Enum_ImageDrawRectangleRoundedByContainer_bottom_left_corner
        Enum_ImageDrawRectangleRoundedByContainer_method: Enum_ImageDrawRectangleRoundedByContainer_method
        Enum_ImageDrawPolygon_method: Enum_ImageDrawPolygon_method
        Enum_ImageEffectsLensZoomBurst_method: Enum_ImageEffectsLensZoomBurst_method
        Enum_ImageEffectsLensZoomBurst_stabilization: Enum_ImageEffectsLensZoomBurst_stabilization
        Enum_ImageEffectsLensChromaticAberration_method: Enum_ImageEffectsLensChromaticAberration_method
        Enum_ImageEffectsLensChromaticAberration_transpose: Enum_ImageEffectsLensChromaticAberration_transpose
        Enum_ImageEffectsLensChromaticAberration_colors: Enum_ImageEffectsLensChromaticAberration_colors
        Enum_ImageEffectsLensBokeh_blur_type: Enum_ImageEffectsLensBokeh_blur_type
        Enum_ImageEffectsLensBokeh_method: Enum_ImageEffectsLensBokeh_method
        Enum_ImageEffectsLensOpticAxis_lens_shape: Enum_ImageEffectsLensOpticAxis_lens_shape
        Enum_ImageEffectsLensOpticAxis_lens_edge: Enum_ImageEffectsLensOpticAxis_lens_edge
        Enum_ImageEffectsLensVignette_lens_shape: Enum_ImageEffectsLensVignette_lens_shape
        Enum_ImageEffectsLensVignette_lens_edge: Enum_ImageEffectsLensVignette_lens_edge
        Enum_ImageSegmentation_model: Enum_ImageSegmentation_model
        Enum_ImageSegmentation_alpha_matting: Enum_ImageSegmentation_alpha_matting
        Enum_ImageSegmentation_post_process_mask: Enum_ImageSegmentation_post_process_mask
        Enum_ImageSegmentationCustom_model: Enum_ImageSegmentationCustom_model
        Enum_ImageSegmentationCustom_alpha_matting: Enum_ImageSegmentationCustom_alpha_matting
        Enum_ImageSegmentationCustom_post_process_mask: Enum_ImageSegmentationCustom_post_process_mask
        Enum_ImageSegmentationCustomAdvanced_model: Enum_ImageSegmentationCustomAdvanced_model
        Enum_ImageSegmentationCustomAdvanced_alpha_matting: Enum_ImageSegmentationCustomAdvanced_alpha_matting
        Enum_ImageSegmentationCustomAdvanced_post_process_mask: Enum_ImageSegmentationCustomAdvanced_post_process_mask
        Enum_ImageText_font: Enum_ImageText_font
        Enum_ImageTextOutlined_font: Enum_ImageTextOutlined_font
        Enum_ImageTextMultiline_font: Enum_ImageTextMultiline_font
        Enum_ImageTextMultiline_align: Enum_ImageTextMultiline_align
        Enum_ImageTextMultilineOutlined_font: Enum_ImageTextMultilineOutlined_font
        Enum_ImageTextMultilineOutlined_align: Enum_ImageTextMultilineOutlined_align
        Enum_ImageTransformResizeAbsolute_method: Enum_ImageTransformResizeAbsolute_method
        Enum_ImageTransformResizeRelative_method: Enum_ImageTransformResizeRelative_method
        Enum_ImageTransformCropCorners_top_left_corner: Enum_ImageTransformCropCorners_top_left_corner
        Enum_ImageTransformCropCorners_top_right_corner: Enum_ImageTransformCropCorners_top_right_corner
        Enum_ImageTransformCropCorners_bottom_right_corner: Enum_ImageTransformCropCorners_bottom_right_corner
        Enum_ImageTransformCropCorners_bottom_left_corner: Enum_ImageTransformCropCorners_bottom_left_corner
        Enum_ImageTransformCropCorners_method: Enum_ImageTransformCropCorners_method
        Enum_ImageTransformPaddingAbsolute_method: Enum_ImageTransformPaddingAbsolute_method
        Enum_ImageTransformPaddingRelative_method: Enum_ImageTransformPaddingRelative_method
        Enum_ImageTransformRotate_expand: Enum_ImageTransformRotate_expand
        Enum_ImageTransformRotate_method: Enum_ImageTransformRotate_method
        Enum_ImageTransformTranspose_method: Enum_ImageTransformTranspose_method
        Enum_ImpactSAMLoader_model_name: Enum_ImpactSAMLoader_model_name
        Enum_ImpactMMDetDetectorProvider_model_name: Enum_ImpactMMDetDetectorProvider_model_name
        Enum_ImpactONNXDetectorProvider_model_name: Enum_ImpactONNXDetectorProvider_model_name
        Enum_ImpactDetailerForEach_guide_size_for: Enum_ImpactDetailerForEach_guide_size_for
        Enum_ImpactDetailerForEach_sampler_name: Enum_ImpactDetailerForEach_sampler_name
        Enum_ImpactDetailerForEach_scheduler: Enum_ImpactDetailerForEach_scheduler
        Enum_ImpactDetailerForEach_noise_mask: Enum_ImpactDetailerForEach_noise_mask
        Enum_ImpactDetailerForEach_force_inpaint: Enum_ImpactDetailerForEach_force_inpaint
        Enum_ImpactDetailerForEachDebug_guide_size_for: Enum_ImpactDetailerForEachDebug_guide_size_for
        Enum_ImpactDetailerForEachDebug_sampler_name: Enum_ImpactDetailerForEachDebug_sampler_name
        Enum_ImpactDetailerForEachDebug_scheduler: Enum_ImpactDetailerForEachDebug_scheduler
        Enum_ImpactDetailerForEachDebug_noise_mask: Enum_ImpactDetailerForEachDebug_noise_mask
        Enum_ImpactDetailerForEachDebug_force_inpaint: Enum_ImpactDetailerForEachDebug_force_inpaint
        Enum_ImpactDetailerForEachPipe_guide_size_for: Enum_ImpactDetailerForEachPipe_guide_size_for
        Enum_ImpactDetailerForEachPipe_sampler_name: Enum_ImpactDetailerForEachPipe_sampler_name
        Enum_ImpactDetailerForEachPipe_scheduler: Enum_ImpactDetailerForEachPipe_scheduler
        Enum_ImpactDetailerForEachPipe_noise_mask: Enum_ImpactDetailerForEachPipe_noise_mask
        Enum_ImpactDetailerForEachPipe_force_inpaint: Enum_ImpactDetailerForEachPipe_force_inpaint
        Enum_ImpactDetailerForEachDebugPipe_guide_size_for: Enum_ImpactDetailerForEachDebugPipe_guide_size_for
        Enum_ImpactDetailerForEachDebugPipe_sampler_name: Enum_ImpactDetailerForEachDebugPipe_sampler_name
        Enum_ImpactDetailerForEachDebugPipe_scheduler: Enum_ImpactDetailerForEachDebugPipe_scheduler
        Enum_ImpactDetailerForEachDebugPipe_noise_mask: Enum_ImpactDetailerForEachDebugPipe_noise_mask
        Enum_ImpactDetailerForEachDebugPipe_force_inpaint: Enum_ImpactDetailerForEachDebugPipe_force_inpaint
        Enum_ImpactSAMDetectorCombined_detection_hint: Enum_ImpactSAMDetectorCombined_detection_hint
        Enum_ImpactSAMDetectorCombined_mask_hint_use_negative: Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
        Enum_ImpactFaceDetailer_guide_size_for: Enum_ImpactFaceDetailer_guide_size_for
        Enum_ImpactFaceDetailer_sampler_name: Enum_ImpactFaceDetailer_sampler_name
        Enum_ImpactFaceDetailer_scheduler: Enum_ImpactFaceDetailer_scheduler
        Enum_ImpactFaceDetailer_noise_mask: Enum_ImpactFaceDetailer_noise_mask
        Enum_ImpactFaceDetailer_force_inpaint: Enum_ImpactFaceDetailer_force_inpaint
        Enum_ImpactFaceDetailer_sam_detection_hint: Enum_ImpactFaceDetailer_sam_detection_hint
        Enum_ImpactFaceDetailer_sam_mask_hint_use_negative: Enum_ImpactFaceDetailer_sam_mask_hint_use_negative
        Enum_ImpactFaceDetailerPipe_guide_size_for: Enum_ImpactFaceDetailerPipe_guide_size_for
        Enum_ImpactFaceDetailerPipe_sampler_name: Enum_ImpactFaceDetailerPipe_sampler_name
        Enum_ImpactFaceDetailerPipe_scheduler: Enum_ImpactFaceDetailerPipe_scheduler
        Enum_ImpactFaceDetailerPipe_noise_mask: Enum_ImpactFaceDetailerPipe_noise_mask
        Enum_ImpactFaceDetailerPipe_force_inpaint: Enum_ImpactFaceDetailerPipe_force_inpaint
        Enum_ImpactFaceDetailerPipe_sam_detection_hint: Enum_ImpactFaceDetailerPipe_sam_detection_hint
        Enum_ImpactFaceDetailerPipe_sam_mask_hint_use_negative: Enum_ImpactFaceDetailerPipe_sam_mask_hint_use_negative
        Enum_ImpactLatentPixelScale_scale_method: Enum_ImpactLatentPixelScale_scale_method
        Enum_ImpactLatentPixelScale_use_tiled_vae: Enum_ImpactLatentPixelScale_use_tiled_vae
        Enum_ImpactPixelKSampleUpscalerProvider_scale_method: Enum_ImpactPixelKSampleUpscalerProvider_scale_method
        Enum_ImpactPixelKSampleUpscalerProvider_sampler_name: Enum_ImpactPixelKSampleUpscalerProvider_sampler_name
        Enum_ImpactPixelKSampleUpscalerProvider_scheduler: Enum_ImpactPixelKSampleUpscalerProvider_scheduler
        Enum_ImpactPixelKSampleUpscalerProvider_use_tiled_vae: Enum_ImpactPixelKSampleUpscalerProvider_use_tiled_vae
        Enum_ImpactPixelKSampleUpscalerProviderPipe_scale_method: Enum_ImpactPixelKSampleUpscalerProviderPipe_scale_method
        Enum_ImpactPixelKSampleUpscalerProviderPipe_sampler_name: Enum_ImpactPixelKSampleUpscalerProviderPipe_sampler_name
        Enum_ImpactPixelKSampleUpscalerProviderPipe_scheduler: Enum_ImpactPixelKSampleUpscalerProviderPipe_scheduler
        Enum_ImpactPixelKSampleUpscalerProviderPipe_use_tiled_vae: Enum_ImpactPixelKSampleUpscalerProviderPipe_use_tiled_vae
        Enum_ImpactPixelTiledKSampleUpscalerProvider_scale_method: Enum_ImpactPixelTiledKSampleUpscalerProvider_scale_method
        Enum_ImpactPixelTiledKSampleUpscalerProvider_sampler_name: Enum_ImpactPixelTiledKSampleUpscalerProvider_sampler_name
        Enum_ImpactPixelTiledKSampleUpscalerProvider_scheduler: Enum_ImpactPixelTiledKSampleUpscalerProvider_scheduler
        Enum_ImpactPixelTiledKSampleUpscalerProvider_tiling_strategy: Enum_ImpactPixelTiledKSampleUpscalerProvider_tiling_strategy
        Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_scale_method: Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_scale_method
        Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_sampler_name: Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_sampler_name
        Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_scheduler: Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_scheduler
        Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_tiling_strategy: Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_tiling_strategy
        Enum_ImpactTwoSamplersForMaskUpscalerProvider_scale_method: Enum_ImpactTwoSamplersForMaskUpscalerProvider_scale_method
        Enum_ImpactTwoSamplersForMaskUpscalerProvider_full_sample_schedule: Enum_ImpactTwoSamplersForMaskUpscalerProvider_full_sample_schedule
        Enum_ImpactTwoSamplersForMaskUpscalerProvider_use_tiled_vae: Enum_ImpactTwoSamplersForMaskUpscalerProvider_use_tiled_vae
        Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_scale_method: Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_scale_method
        Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_full_sample_schedule: Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_full_sample_schedule
        Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_use_tiled_vae: Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_use_tiled_vae
        Enum_ImpactDenoiseScheduleHookProvider_schedule_for_iteration: Enum_ImpactDenoiseScheduleHookProvider_schedule_for_iteration
        Enum_ImpactCfgScheduleHookProvider_schedule_for_iteration: Enum_ImpactCfgScheduleHookProvider_schedule_for_iteration
        Enum_ImpactMaskToSEGS_combined: Enum_ImpactMaskToSEGS_combined
        Enum_ImpactMaskToSEGS_bbox_fill: Enum_ImpactMaskToSEGS_bbox_fill
        Enum_ImpactKSamplerProvider_sampler_name: Enum_ImpactKSamplerProvider_sampler_name
        Enum_ImpactKSamplerProvider_scheduler: Enum_ImpactKSamplerProvider_scheduler
        Enum_ImpactTiledKSamplerProvider_sampler_name: Enum_ImpactTiledKSamplerProvider_sampler_name
        Enum_ImpactTiledKSamplerProvider_scheduler: Enum_ImpactTiledKSamplerProvider_scheduler
        Enum_ImpactTiledKSamplerProvider_tiling_strategy: Enum_ImpactTiledKSamplerProvider_tiling_strategy
        Enum_ImpactPreviewBridge_image: Enum_ImpactPreviewBridge_image
        Enum_ImpactImageReceiver_image: Enum_ImpactImageReceiver_image
        Enum_ImpactImpactWildcardProcessor_mode: Enum_ImpactImpactWildcardProcessor_mode
        Enum_ImpactSEGSDetailer_guide_size_for: Enum_ImpactSEGSDetailer_guide_size_for
        Enum_ImpactSEGSDetailer_sampler_name: Enum_ImpactSEGSDetailer_sampler_name
        Enum_ImpactSEGSDetailer_scheduler: Enum_ImpactSEGSDetailer_scheduler
        Enum_ImpactSEGSDetailer_noise_mask: Enum_ImpactSEGSDetailer_noise_mask
        Enum_ImpactSEGSDetailer_force_inpaint: Enum_ImpactSEGSDetailer_force_inpaint
        Enum_ImpactMaskPainter_image: Enum_ImpactMaskPainter_image
        Enum_ImpactMMDetLoader_model_name: Enum_ImpactMMDetLoader_model_name
        Enum_Save_as_webp_mode: Enum_Save_as_webp_mode
        Enum_BNK_CutoffRegionsToConditioning_ADV_token_normalization: Enum_BNK_CutoffRegionsToConditioning_ADV_token_normalization
        Enum_BNK_CutoffRegionsToConditioning_ADV_weight_interpretation: Enum_BNK_CutoffRegionsToConditioning_ADV_weight_interpretation
        Enum_BNK_NoisyLatentImage_source: Enum_BNK_NoisyLatentImage_source
        Enum_BNK_GetSigma_sampler_name: Enum_BNK_GetSigma_sampler_name
        Enum_BNK_GetSigma_scheduler: Enum_BNK_GetSigma_scheduler
        Enum_BNK_Unsampler_sampler_name: Enum_BNK_Unsampler_sampler_name
        Enum_BNK_Unsampler_scheduler: Enum_BNK_Unsampler_scheduler
        Enum_BNK_Unsampler_normalize: Enum_BNK_Unsampler_normalize
        Enum_BNK_TiledKSamplerAdvanced_add_noise: Enum_BNK_TiledKSamplerAdvanced_add_noise
        Enum_BNK_TiledKSamplerAdvanced_tiling_strategy: Enum_BNK_TiledKSamplerAdvanced_tiling_strategy
        Enum_BNK_TiledKSamplerAdvanced_sampler_name: Enum_BNK_TiledKSamplerAdvanced_sampler_name
        Enum_BNK_TiledKSamplerAdvanced_scheduler: Enum_BNK_TiledKSamplerAdvanced_scheduler
        Enum_BNK_TiledKSamplerAdvanced_return_with_leftover_noise: Enum_BNK_TiledKSamplerAdvanced_return_with_leftover_noise
        Enum_BNK_TiledKSampler_tiling_strategy: Enum_BNK_TiledKSampler_tiling_strategy
        Enum_BNK_TiledKSampler_sampler_name: Enum_BNK_TiledKSampler_sampler_name
        Enum_BNK_TiledKSampler_scheduler: Enum_BNK_TiledKSampler_scheduler
        Enum_ClipSeg_device: Enum_ClipSeg_device
        Enum_ClipSeg_mode: Enum_ClipSeg_mode
        Enum_HEDPreprocessor_version: Enum_HEDPreprocessor_version
        Enum_HEDPreprocessor_safe: Enum_HEDPreprocessor_safe
        Enum_PiDiNetPreprocessor_safe: Enum_PiDiNetPreprocessor_safe
        Enum_LineArtPreprocessor_coarse: Enum_LineArtPreprocessor_coarse
        Enum_OpenposePreprocessor_detect_hand: Enum_OpenposePreprocessor_detect_hand
        Enum_OpenposePreprocessor_detect_body: Enum_OpenposePreprocessor_detect_body
        Enum_OpenposePreprocessor_detect_face: Enum_OpenposePreprocessor_detect_face
        Enum_OpenposePreprocessor_version: Enum_OpenposePreprocessor_version
        Enum_MediaPipeHandPosePreprocessor_detect_pose: Enum_MediaPipeHandPosePreprocessor_detect_pose
        Enum_MediaPipeHandPosePreprocessor_detect_hands: Enum_MediaPipeHandPosePreprocessor_detect_hands
        Enum_KSamplerEfficient_sampler_state: Enum_KSamplerEfficient_sampler_state
        Enum_KSamplerEfficient_sampler_name: Enum_KSamplerEfficient_sampler_name
        Enum_KSamplerEfficient_scheduler: Enum_KSamplerEfficient_scheduler
        Enum_KSamplerEfficient_preview_image: Enum_KSamplerEfficient_preview_image
        Enum_EfficientLoader_ckpt_name: Enum_EfficientLoader_ckpt_name
        Enum_EfficientLoader_vae_name: Enum_EfficientLoader_vae_name
        Enum_EfficientLoader_lora_name: Enum_EfficientLoader_lora_name
        Enum_XYPlot_XY_flip: Enum_XYPlot_XY_flip
        Enum_XYPlot_Y_label_orientation: Enum_XYPlot_Y_label_orientation
        Enum_XYPlot_cache_models: Enum_XYPlot_cache_models
        Enum_XYPlot_ksampler_output_image: Enum_XYPlot_ksampler_output_image
        Enum_XYInputSampler_sampler_1: Enum_XYInputSampler_sampler_1
        Enum_XYInputSampler_scheduler_1: Enum_XYInputSampler_scheduler_1
        Enum_XYInputSampler_sampler_2: Enum_XYInputSampler_sampler_2
        Enum_XYInputSampler_scheduler_2: Enum_XYInputSampler_scheduler_2
        Enum_XYInputSampler_sampler_3: Enum_XYInputSampler_sampler_3
        Enum_XYInputSampler_scheduler_3: Enum_XYInputSampler_scheduler_3
        Enum_XYInputSampler_sampler_4: Enum_XYInputSampler_sampler_4
        Enum_XYInputSampler_scheduler_4: Enum_XYInputSampler_scheduler_4
        Enum_XYInputSampler_sampler_5: Enum_XYInputSampler_sampler_5
        Enum_XYInputSampler_scheduler_5: Enum_XYInputSampler_scheduler_5
        Enum_XYInputScheduler_scheduler_1: Enum_XYInputScheduler_scheduler_1
        Enum_XYInputScheduler_scheduler_2: Enum_XYInputScheduler_scheduler_2
        Enum_XYInputScheduler_scheduler_3: Enum_XYInputScheduler_scheduler_3
        Enum_XYInputScheduler_scheduler_4: Enum_XYInputScheduler_scheduler_4
        Enum_XYInputScheduler_scheduler_5: Enum_XYInputScheduler_scheduler_5
        Enum_XYInputVAE_vae_name_1: Enum_XYInputVAE_vae_name_1
        Enum_XYInputVAE_vae_name_2: Enum_XYInputVAE_vae_name_2
        Enum_XYInputVAE_vae_name_3: Enum_XYInputVAE_vae_name_3
        Enum_XYInputVAE_vae_name_4: Enum_XYInputVAE_vae_name_4
        Enum_XYInputVAE_vae_name_5: Enum_XYInputVAE_vae_name_5
        Enum_XYInputCheckpoint_ckpt_name_1: Enum_XYInputCheckpoint_ckpt_name_1
        Enum_XYInputCheckpoint_ckpt_name_2: Enum_XYInputCheckpoint_ckpt_name_2
        Enum_XYInputCheckpoint_ckpt_name_3: Enum_XYInputCheckpoint_ckpt_name_3
        Enum_XYInputCheckpoint_ckpt_name_4: Enum_XYInputCheckpoint_ckpt_name_4
        Enum_XYInputCheckpoint_ckpt_name_5: Enum_XYInputCheckpoint_ckpt_name_5
        Enum_XYInputLoRA_lora_name_1: Enum_XYInputLoRA_lora_name_1
        Enum_XYInputLoRA_lora_name_2: Enum_XYInputLoRA_lora_name_2
        Enum_XYInputLoRA_lora_name_3: Enum_XYInputLoRA_lora_name_3
        Enum_XYInputLoRA_lora_name_4: Enum_XYInputLoRA_lora_name_4
        Enum_XYInputLoRA_lora_name_5: Enum_XYInputLoRA_lora_name_5
        Enum_XYInputLoRAAdvanced_lora_name_1: Enum_XYInputLoRAAdvanced_lora_name_1
        Enum_XYInputLoRAAdvanced_lora_name_2: Enum_XYInputLoRAAdvanced_lora_name_2
        Enum_XYInputLoRAAdvanced_lora_name_3: Enum_XYInputLoRAAdvanced_lora_name_3
        Enum_XYInputLoRAAdvanced_lora_name_4: Enum_XYInputLoRAAdvanced_lora_name_4
        Enum_XYInputLoRAAdvanced_lora_name_5: Enum_XYInputLoRAAdvanced_lora_name_5
        Enum_XYInputManualXYEntry_X_type: Enum_XYInputManualXYEntry_X_type
        Enum_XYInputManualXYEntry_Y_type: Enum_XYInputManualXYEntry_Y_type
        Enum_ImageOverlay_overlay_resize: Enum_ImageOverlay_overlay_resize
        Enum_ImageOverlay_resize_method: Enum_ImageOverlay_resize_method
        Enum_EvaluateIntegers_print_to_console: Enum_EvaluateIntegers_print_to_console
        Enum_EvaluateFloats_print_to_console: Enum_EvaluateFloats_print_to_console
        Enum_EvaluateStrings_print_to_console: Enum_EvaluateStrings_print_to_console
        Enum_WASImageFlip_mode: Enum_WASImageFlip_mode
        Enum_LatentUpscaleMultiply_upscale_method: Enum_LatentUpscaleMultiply_upscale_method
        Enum_LatentUpscaleMultiply_crop: Enum_LatentUpscaleMultiply_crop
        Enum_MasqueradeMaskByText_normalize: Enum_MasqueradeMaskByText_normalize
        Enum_MasqueradeMaskMorphology_op: Enum_MasqueradeMaskMorphology_op
        Enum_MasqueradeCombineMasks_op: Enum_MasqueradeCombineMasks_op
        Enum_MasqueradeCombineMasks_clamp_result: Enum_MasqueradeCombineMasks_clamp_result
        Enum_MasqueradeCombineMasks_round_result: Enum_MasqueradeCombineMasks_round_result
        Enum_MasqueradeUnaryMaskOp_op: Enum_MasqueradeUnaryMaskOp_op
        Enum_MasqueradeImageToMask_method: Enum_MasqueradeImageToMask_method
        Enum_MasqueradeMaskToRegion_constraints: Enum_MasqueradeMaskToRegion_constraints
        Enum_MasqueradeMaskToRegion_batch_behavior: Enum_MasqueradeMaskToRegion_batch_behavior
        Enum_MasqueradePasteByMask_resize_behavior: Enum_MasqueradePasteByMask_resize_behavior
        Enum_MasqueradeChangeChannelCount_kind: Enum_MasqueradeChangeChannelCount_kind
        Enum_MasqueradeCreateRectMask_mode: Enum_MasqueradeCreateRectMask_mode
        Enum_MasqueradeCreateRectMask_origin: Enum_MasqueradeCreateRectMask_origin
        Enum_WASBLIPModelLoader_blip_model: Enum_WASBLIPModelLoader_blip_model
        Enum_WASCheckpointLoader_config_name: Enum_WASCheckpointLoader_config_name
        Enum_WASCheckpointLoader_ckpt_name: Enum_WASCheckpointLoader_ckpt_name
        Enum_WASCheckpointLoaderSimple_ckpt_name: Enum_WASCheckpointLoaderSimple_ckpt_name
        Enum_WASCLIPTextEncodeNSP_mode: Enum_WASCLIPTextEncodeNSP_mode
        Enum_WASConstantNumber_number_type: Enum_WASConstantNumber_number_type
        Enum_WASCreateGridImage_include_subfolders: Enum_WASCreateGridImage_include_subfolders
        Enum_WASCreateMorphImage_filetype: Enum_WASCreateMorphImage_filetype
        Enum_WASCreateMorphImageFromPath_filetype: Enum_WASCreateMorphImageFromPath_filetype
        Enum_WASCreateVideoFromPath_codec: Enum_WASCreateVideoFromPath_codec
        Enum_WASDiffusersModelLoader_model_path: Enum_WASDiffusersModelLoader_model_path
        Enum_WASExportAPI_save_prompt_api: Enum_WASExportAPI_save_prompt_api
        Enum_WASLoraLoader_lora_name: Enum_WASLoraLoader_lora_name
        Enum_WASImageSSAOAmbientOcclusion_enable_specular_masking: Enum_WASImageSSAOAmbientOcclusion_enable_specular_masking
        Enum_WASImageSSDODirectOcclusion_colored_occlusion: Enum_WASImageSSDODirectOcclusion_colored_occlusion
        Enum_WASImageAnalyze_mode: Enum_WASImageAnalyze_mode
        Enum_WASImageBlendingMode_mode: Enum_WASImageBlendingMode_mode
        Enum_WASImageCannyFilter_enable_threshold: Enum_WASImageCannyFilter_enable_threshold
        Enum_WASImageColorPalette_mode: Enum_WASImageColorPalette_mode
        Enum_WASImageCropFace_cascade_xml: Enum_WASImageCropFace_cascade_xml
        Enum_WASImagePixelate_init_mode: Enum_WASImagePixelate_init_mode
        Enum_WASImagePixelate_dither: Enum_WASImagePixelate_dither
        Enum_WASImagePixelate_dither_mode: Enum_WASImagePixelate_dither_mode
        Enum_WASImagePixelate_color_palette_mode: Enum_WASImagePixelate_color_palette_mode
        Enum_WASImagePixelate_reverse_palette: Enum_WASImagePixelate_reverse_palette
        Enum_WASImagePowerNoise_noise_type: Enum_WASImagePowerNoise_noise_type
        Enum_WASImageDraganPhotographyFilter_colorize: Enum_WASImageDraganPhotographyFilter_colorize
        Enum_WASImageEdgeDetectionFilter_mode: Enum_WASImageEdgeDetectionFilter_mode
        Enum_WASImageGradientMap_flip_left_right: Enum_WASImageGradientMap_flip_left_right
        Enum_WASImageGenerateGradient_direction: Enum_WASImageGenerateGradient_direction
        Enum_WASImageHighPassFilter_color_output: Enum_WASImageHighPassFilter_color_output
        Enum_WASImageHighPassFilter_neutral_background: Enum_WASImageHighPassFilter_neutral_background
        Enum_WASImageHistoryLoader_image: Enum_WASImageHistoryLoader_image
        Enum_WASImageMonitorEffectsFilter_mode: Enum_WASImageMonitorEffectsFilter_mode
        Enum_WASImagePadding_feather_second_pass: Enum_WASImagePadding_feather_second_pass
        Enum_WASImageRembgRemoveBackground_transparency: Enum_WASImageRembgRemoveBackground_transparency
        Enum_WASImageRemoveBackgroundAlpha_mode: Enum_WASImageRemoveBackgroundAlpha_mode
        Enum_WASImageResize_mode: Enum_WASImageResize_mode
        Enum_WASImageResize_supersample: Enum_WASImageResize_supersample
        Enum_WASImageResize_resampling: Enum_WASImageResize_resampling
        Enum_WASImageRotate_mode: Enum_WASImageRotate_mode
        Enum_WASImageRotate_sampler: Enum_WASImageRotate_sampler
        Enum_WASImageSave_extension: Enum_WASImageSave_extension
        Enum_WASImageSave_lossless_webp: Enum_WASImageSave_lossless_webp
        Enum_WASImageSave_overwrite_mode: Enum_WASImageSave_overwrite_mode
        Enum_WASImageSave_show_history: Enum_WASImageSave_show_history
        Enum_WASImageSave_show_history_by_prefix: Enum_WASImageSave_show_history_by_prefix
        Enum_WASImageSave_embed_workflow: Enum_WASImageSave_embed_workflow
        Enum_WASImageSeamlessTexture_tiled: Enum_WASImageSeamlessTexture_tiled
        Enum_WASImageSelectChannel_channel: Enum_WASImageSelectChannel_channel
        Enum_WASImageStitch_stitch: Enum_WASImageStitch_stitch
        Enum_WASImageStyleFilter_style: Enum_WASImageStyleFilter_style
        Enum_WASImageFDOFFilter_mode: Enum_WASImageFDOFFilter_mode
        Enum_WASImageToLatentMask_channel: Enum_WASImageToLatentMask_channel
        Enum_WASImageToNoise_output_mode: Enum_WASImageToNoise_output_mode
        Enum_WASKSamplerWAS_sampler_name: Enum_WASKSamplerWAS_sampler_name
        Enum_WASKSamplerWAS_scheduler: Enum_WASKSamplerWAS_scheduler
        Enum_WASKSamplerCycle_sampler_name: Enum_WASKSamplerCycle_sampler_name
        Enum_WASKSamplerCycle_scheduler: Enum_WASKSamplerCycle_scheduler
        Enum_WASKSamplerCycle_tiled_vae: Enum_WASKSamplerCycle_tiled_vae
        Enum_WASKSamplerCycle_scale_denoise: Enum_WASKSamplerCycle_scale_denoise
        Enum_WASKSamplerCycle_scale_sampling: Enum_WASKSamplerCycle_scale_sampling
        Enum_WASKSamplerCycle_pos_add_strength_scaling: Enum_WASKSamplerCycle_pos_add_strength_scaling
        Enum_WASKSamplerCycle_neg_add_strength_scaling: Enum_WASKSamplerCycle_neg_add_strength_scaling
        Enum_WASLatentUpscaleByFactorWAS_mode: Enum_WASLatentUpscaleByFactorWAS_mode
        Enum_WASLatentUpscaleByFactorWAS_align: Enum_WASLatentUpscaleByFactorWAS_align
        Enum_WASLoadImageBatch_mode: Enum_WASLoadImageBatch_mode
        Enum_WASLoadLora_lora_name: Enum_WASLoadLora_lora_name
        Enum_WASMaskCropRegion_region_type: Enum_WASMaskCropRegion_region_type
        Enum_WASMiDaSModelLoader_midas_model: Enum_WASMiDaSModelLoader_midas_model
        Enum_WASMiDaSDepthApproximation_use_cpu: Enum_WASMiDaSDepthApproximation_use_cpu
        Enum_WASMiDaSDepthApproximation_midas_type: Enum_WASMiDaSDepthApproximation_midas_type
        Enum_WASMiDaSDepthApproximation_invert_depth: Enum_WASMiDaSDepthApproximation_invert_depth
        Enum_WASMiDaSMaskImage_use_cpu: Enum_WASMiDaSMaskImage_use_cpu
        Enum_WASMiDaSMaskImage_midas_model: Enum_WASMiDaSMaskImage_midas_model
        Enum_WASMiDaSMaskImage_remove: Enum_WASMiDaSMaskImage_remove
        Enum_WASMiDaSMaskImage_threshold: Enum_WASMiDaSMaskImage_threshold
        Enum_WASNumberOperation_operation: Enum_WASNumberOperation_operation
        Enum_WASNumberInputCondition_return_boolean: Enum_WASNumberInputCondition_return_boolean
        Enum_WASNumberInputCondition_comparison: Enum_WASNumberInputCondition_comparison
        Enum_WASPromptStylesSelector_style: Enum_WASPromptStylesSelector_style
        Enum_WASRandomNumber_number_type: Enum_WASRandomNumber_number_type
        Enum_WASBLIPAnalyzeImage_mode: Enum_WASBLIPAnalyzeImage_mode
        Enum_WASSAMModelLoader_model_size: Enum_WASSAMModelLoader_model_size
        Enum_WASTextAddTokens_print_current_tokens: Enum_WASTextAddTokens_print_current_tokens
        Enum_WASTextAddTokenByInput_print_current_tokens: Enum_WASTextAddTokenByInput_print_current_tokens
        Enum_WASTextCompare_mode: Enum_WASTextCompare_mode
        Enum_WASTextConcatenate_linebreak_addition: Enum_WASTextConcatenate_linebreak_addition
        Enum_WASTextFileHistoryLoader_file: Enum_WASTextFileHistoryLoader_file
        Enum_WASTextLoadLineFromFile_mode: Enum_WASTextLoadLineFromFile_mode
        Enum_WASTextParseNoodleSoupPrompts_mode: Enum_WASTextParseNoodleSoupPrompts_mode
        Enum_WASUnCLIPCheckpointLoader_ckpt_name: Enum_WASUnCLIPCheckpointLoader_ckpt_name
        Enum_WASUpscaleModelLoader_model_name: Enum_WASUpscaleModelLoader_model_name
        Enum_WASWriteToVideo_codec: Enum_WASWriteToVideo_codec
        Enum_WASVideoDumpFrames_extension: Enum_WASVideoDumpFrames_extension
        KSampler: KSampler
        CheckpointLoaderSimple: CheckpointLoaderSimple
        CLIPTextEncode: CLIPTextEncode
        CLIPSetLastLayer: CLIPSetLastLayer
        VAEDecode: VAEDecode
        VAEEncode: VAEEncode
        VAEEncodeForInpaint: VAEEncodeForInpaint
        VAELoader: VAELoader
        EmptyLatentImage: EmptyLatentImage
        LatentUpscale: LatentUpscale
        LatentUpscaleBy: LatentUpscaleBy
        LatentFromBatch: LatentFromBatch
        RepeatLatentBatch: RepeatLatentBatch
        SaveImage: SaveImage
        PreviewImage: PreviewImage
        LoadImage: LoadImage
        LoadImageMask: LoadImageMask
        ImagePadForOutpaint: ImagePadForOutpaint
        ConditioningAverage: ConditioningAverage
        ConditioningCombine: ConditioningCombine
        ConditioningSetArea: ConditioningSetArea
        ConditioningSetMask: ConditioningSetMask
        KSamplerAdvanced: KSamplerAdvanced
        SetLatentNoiseMask: SetLatentNoiseMask
        LatentComposite: LatentComposite
        LatentRotate: LatentRotate
        LatentFlip: LatentFlip
        LatentCrop: LatentCrop
        LoraLoader: LoraLoader
        CLIPLoader: CLIPLoader
        DualCLIPLoader: DualCLIPLoader
        CLIPVisionEncode: CLIPVisionEncode
        StyleModelApply: StyleModelApply
        UnCLIPConditioning: UnCLIPConditioning
        ControlNetApply: ControlNetApply
        ControlNetLoader: ControlNetLoader
        DiffControlNetLoader: DiffControlNetLoader
        StyleModelLoader: StyleModelLoader
        CLIPVisionLoader: CLIPVisionLoader
        VAEDecodeTiled: VAEDecodeTiled
        VAEEncodeTiled: VAEEncodeTiled
        UnCLIPCheckpointLoader: UnCLIPCheckpointLoader
        GLIGENLoader: GLIGENLoader
        GLIGENTextBoxApply: GLIGENTextBoxApply
        CheckpointLoader: CheckpointLoader
        DiffusersLoader: DiffusersLoader
        HypernetworkLoader: HypernetworkLoader
        UpscaleModelLoader: UpscaleModelLoader
        ImageUpscaleWithModel: ImageUpscaleWithModel
        LatentCompositeMasked: LatentCompositeMasked
        MaskToImage: MaskToImage
        ImageToMask: ImageToMask
        SolidMask: SolidMask
        InvertMask: InvertMask
        CropMask: CropMask
        MaskComposite: MaskComposite
        FeatherMask: FeatherMask
        RebatchLatents: RebatchLatents
        BrightnessContrast: BrightnessContrast
        CLIPSeg: CLIPSeg
        CombineSegMasks: CombineSegMasks
        AlphaChanelAdd: AlphaChanelAdd
        AlphaChanelAddByMask: AlphaChanelAddByMask
        AlphaChanelAsMask: AlphaChanelAsMask
        AlphaChanelRestore: AlphaChanelRestore
        AlphaChanelRemove: AlphaChanelRemove
        ClipClamp: ClipClamp
        ClipVisionClamp: ClipVisionClamp
        ClipVisionOutputClamp: ClipVisionOutputClamp
        ConditioningClamp: ConditioningClamp
        ControlNetClamp: ControlNetClamp
        GligenClamp: GligenClamp
        ImageClamp: ImageClamp
        LatentClamp: LatentClamp
        MaskClamp: MaskClamp
        ModelClamp: ModelClamp
        StyleModelClamp: StyleModelClamp
        UpscaleModelClamp: UpscaleModelClamp
        VaeClamp: VaeClamp
        ImageBatchGet: ImageBatchGet
        ImageBatchRemove: ImageBatchRemove
        ImageBatchFork: ImageBatchFork
        ImageBatchJoin: ImageBatchJoin
        ImageCompositeAbsolute: ImageCompositeAbsolute
        ImageCompositeAbsoluteByContainer: ImageCompositeAbsoluteByContainer
        ImageCompositeRelative: ImageCompositeRelative
        ImageCompositeRelativeByContainer: ImageCompositeRelativeByContainer
        ImageContainer: ImageContainer
        ImageContainerInheritanceAdd: ImageContainerInheritanceAdd
        ImageContainerInheritanceScale: ImageContainerInheritanceScale
        ImageContainerInheritanceMax: ImageContainerInheritanceMax
        ImageContainerInheritanceSum: ImageContainerInheritanceSum
        ImageDrawArc: ImageDrawArc
        ImageDrawArcByContainer: ImageDrawArcByContainer
        ImageDrawChord: ImageDrawChord
        ImageDrawChordByContainer: ImageDrawChordByContainer
        ImageDrawEllipse: ImageDrawEllipse
        ImageDrawEllipseByContainer: ImageDrawEllipseByContainer
        ImageDrawLine: ImageDrawLine
        ImageDrawLineByContainer: ImageDrawLineByContainer
        ImageDrawPieslice: ImageDrawPieslice
        ImageDrawPiesliceByContainer: ImageDrawPiesliceByContainer
        ImageDrawRectangle: ImageDrawRectangle
        ImageDrawRectangleByContainer: ImageDrawRectangleByContainer
        ImageDrawRectangleRounded: ImageDrawRectangleRounded
        ImageDrawRectangleRoundedByContainer: ImageDrawRectangleRoundedByContainer
        ImageDrawPolygon: ImageDrawPolygon
        ImageEffectsAdjustment: ImageEffectsAdjustment
        ImageEffectsGrayscale: ImageEffectsGrayscale
        ImageEffectsNegative: ImageEffectsNegative
        ImageEffectsSepia: ImageEffectsSepia
        ImageEffectsLensZoomBurst: ImageEffectsLensZoomBurst
        ImageEffectsLensChromaticAberration: ImageEffectsLensChromaticAberration
        ImageEffectsLensBokeh: ImageEffectsLensBokeh
        ImageEffectsLensOpticAxis: ImageEffectsLensOpticAxis
        ImageEffectsLensVignette: ImageEffectsLensVignette
        ImageFilterSmooth: ImageFilterSmooth
        ImageFilterSmoothMore: ImageFilterSmoothMore
        ImageFilterBlur: ImageFilterBlur
        ImageFilterBoxBlur: ImageFilterBoxBlur
        ImageFilterGaussianBlur: ImageFilterGaussianBlur
        ImageFilterGaussianBlurAdvanced: ImageFilterGaussianBlurAdvanced
        ImageFilterStackBlur: ImageFilterStackBlur
        ImageFilterMedianBlur: ImageFilterMedianBlur
        ImageFilterBilateralBlur: ImageFilterBilateralBlur
        ImageFilterContour: ImageFilterContour
        ImageFilterDetail: ImageFilterDetail
        ImageFilterEdgeEnhance: ImageFilterEdgeEnhance
        ImageFilterEdgeEnhanceMore: ImageFilterEdgeEnhanceMore
        ImageFilterEmboss: ImageFilterEmboss
        ImageFilterFindEdges: ImageFilterFindEdges
        ImageFilterSharpen: ImageFilterSharpen
        ImageFilterRank: ImageFilterRank
        ImageFilterMin: ImageFilterMin
        ImageFilterMax: ImageFilterMax
        ImageFilterMode: ImageFilterMode
        ImageSegmentation: ImageSegmentation
        ImageSegmentationCustom: ImageSegmentationCustom
        ImageSegmentationCustomAdvanced: ImageSegmentationCustomAdvanced
        ImageText: ImageText
        ImageTextOutlined: ImageTextOutlined
        ImageTextMultiline: ImageTextMultiline
        ImageTextMultilineOutlined: ImageTextMultilineOutlined
        ImageTransformResizeAbsolute: ImageTransformResizeAbsolute
        ImageTransformResizeRelative: ImageTransformResizeRelative
        ImageTransformCropAbsolute: ImageTransformCropAbsolute
        ImageTransformCropRelative: ImageTransformCropRelative
        ImageTransformCropCorners: ImageTransformCropCorners
        ImageTransformPaddingAbsolute: ImageTransformPaddingAbsolute
        ImageTransformPaddingRelative: ImageTransformPaddingRelative
        ImageTransformRotate: ImageTransformRotate
        ImageTransformTranspose: ImageTransformTranspose
        ImpactSAMLoader: ImpactSAMLoader
        ImpactMMDetDetectorProvider: ImpactMMDetDetectorProvider
        ImpactCLIPSegDetectorProvider: ImpactCLIPSegDetectorProvider
        ImpactONNXDetectorProvider: ImpactONNXDetectorProvider
        ImpactBitwiseAndMaskForEach: ImpactBitwiseAndMaskForEach
        ImpactSubtractMaskForEach: ImpactSubtractMaskForEach
        ImpactDetailerForEach: ImpactDetailerForEach
        ImpactDetailerForEachDebug: ImpactDetailerForEachDebug
        ImpactDetailerForEachPipe: ImpactDetailerForEachPipe
        ImpactDetailerForEachDebugPipe: ImpactDetailerForEachDebugPipe
        ImpactSAMDetectorCombined: ImpactSAMDetectorCombined
        ImpactFaceDetailer: ImpactFaceDetailer
        ImpactFaceDetailerPipe: ImpactFaceDetailerPipe
        ImpactToDetailerPipe: ImpactToDetailerPipe
        ImpactFromDetailerPipe: ImpactFromDetailerPipe
        ImpactToBasicPipe: ImpactToBasicPipe
        ImpactFromBasicPipe: ImpactFromBasicPipe
        ImpactBasicPipeToDetailerPipe: ImpactBasicPipeToDetailerPipe
        ImpactDetailerPipeToBasicPipe: ImpactDetailerPipeToBasicPipe
        ImpactEditBasicPipe: ImpactEditBasicPipe
        ImpactEditDetailerPipe: ImpactEditDetailerPipe
        ImpactLatentPixelScale: ImpactLatentPixelScale
        ImpactPixelKSampleUpscalerProvider: ImpactPixelKSampleUpscalerProvider
        ImpactPixelKSampleUpscalerProviderPipe: ImpactPixelKSampleUpscalerProviderPipe
        ImpactIterativeLatentUpscale: ImpactIterativeLatentUpscale
        ImpactIterativeImageUpscale: ImpactIterativeImageUpscale
        ImpactPixelTiledKSampleUpscalerProvider: ImpactPixelTiledKSampleUpscalerProvider
        ImpactPixelTiledKSampleUpscalerProviderPipe: ImpactPixelTiledKSampleUpscalerProviderPipe
        ImpactTwoSamplersForMaskUpscalerProvider: ImpactTwoSamplersForMaskUpscalerProvider
        ImpactTwoSamplersForMaskUpscalerProviderPipe: ImpactTwoSamplersForMaskUpscalerProviderPipe
        ImpactPixelKSampleHookCombine: ImpactPixelKSampleHookCombine
        ImpactDenoiseScheduleHookProvider: ImpactDenoiseScheduleHookProvider
        ImpactCfgScheduleHookProvider: ImpactCfgScheduleHookProvider
        ImpactBitwiseAndMask: ImpactBitwiseAndMask
        ImpactSubtractMask: ImpactSubtractMask
        ImpactSegsMask: ImpactSegsMask
        ImpactEmptySegs: ImpactEmptySegs
        ImpactMaskToSEGS: ImpactMaskToSEGS
        ImpactToBinaryMask: ImpactToBinaryMask
        ImpactBboxDetectorSEGS: ImpactBboxDetectorSEGS
        ImpactSegmDetectorSEGS: ImpactSegmDetectorSEGS
        ImpactONNXDetectorSEGS: ImpactONNXDetectorSEGS
        ImpactBboxDetectorCombined_v2: ImpactBboxDetectorCombined_v2
        ImpactSegmDetectorCombined_v2: ImpactSegmDetectorCombined_v2
        ImpactSegsToCombinedMask: ImpactSegsToCombinedMask
        ImpactKSamplerProvider: ImpactKSamplerProvider
        ImpactTwoSamplersForMask: ImpactTwoSamplersForMask
        ImpactTiledKSamplerProvider: ImpactTiledKSamplerProvider
        ImpactPreviewBridge: ImpactPreviewBridge
        ImpactImageSender: ImpactImageSender
        ImpactImageReceiver: ImpactImageReceiver
        ImpactImageMaskSwitch: ImpactImageMaskSwitch
        ImpactLatentSwitch: ImpactLatentSwitch
        ImpactSEGSSwitch: ImpactSEGSSwitch
        ImpactImpactWildcardProcessor: ImpactImpactWildcardProcessor
        ImpactImpactLogger: ImpactImpactLogger
        ImpactSEGSDetailer: ImpactSEGSDetailer
        ImpactSEGSPaste: ImpactSEGSPaste
        ImpactSEGSPreview: ImpactSEGSPreview
        ImpactMaskPainter: ImpactMaskPainter
        ImpactMMDetLoader: ImpactMMDetLoader
        ImpactSegsMaskCombine: ImpactSegsMaskCombine
        ImpactBboxDetectorForEach: ImpactBboxDetectorForEach
        ImpactSegmDetectorForEach: ImpactSegmDetectorForEach
        ImpactBboxDetectorCombined: ImpactBboxDetectorCombined
        ImpactSegmDetectorCombined: ImpactSegmDetectorCombined
        Save_as_webp: Save_as_webp
        BNK_CutoffBasePrompt: BNK_CutoffBasePrompt
        BNK_CutoffSetRegions: BNK_CutoffSetRegions
        BNK_CutoffRegionsToConditioning: BNK_CutoffRegionsToConditioning
        BNK_CutoffRegionsToConditioning_ADV: BNK_CutoffRegionsToConditioning_ADV
        MultiLatentComposite: MultiLatentComposite
        MultiAreaConditioning: MultiAreaConditioning
        ConditioningUpscale: ConditioningUpscale
        ConditioningStretch: ConditioningStretch
        BNK_NoisyLatentImage: BNK_NoisyLatentImage
        BNK_DuplicateBatchIndex: BNK_DuplicateBatchIndex
        BNK_SlerpLatent: BNK_SlerpLatent
        BNK_GetSigma: BNK_GetSigma
        BNK_InjectNoise: BNK_InjectNoise
        BNK_Unsampler: BNK_Unsampler
        BNK_TiledKSamplerAdvanced: BNK_TiledKSamplerAdvanced
        BNK_TiledKSampler: BNK_TiledKSampler
        ClipSeg: ClipSeg
        HEDPreprocessor: HEDPreprocessor
        ScribblePreprocessor: ScribblePreprocessor
        FakeScribblePreprocessor: FakeScribblePreprocessor
        BinaryPreprocessor: BinaryPreprocessor
        PiDiNetPreprocessor: PiDiNetPreprocessor
        LineArtPreprocessor: LineArtPreprocessor
        AnimeLineArtPreprocessor: AnimeLineArtPreprocessor
        Manga2AnimeLineArtPreprocessor: Manga2AnimeLineArtPreprocessor
        MiDaSNormalMapPreprocessor: MiDaSNormalMapPreprocessor
        ZoeDepthMapPreprocessor: ZoeDepthMapPreprocessor
        BAENormalMapPreprocessor: BAENormalMapPreprocessor
        OpenposePreprocessor: OpenposePreprocessor
        MediaPipeHandPosePreprocessor: MediaPipeHandPosePreprocessor
        OneFormerCOCOSemSegPreprocessor: OneFormerCOCOSemSegPreprocessor
        OneFormerADE20KSemSegPreprocessor: OneFormerADE20KSemSegPreprocessor
        MediaPipeFaceMeshPreprocessor: MediaPipeFaceMeshPreprocessor
        ColorPreprocessor: ColorPreprocessor
        TilePreprocessor: TilePreprocessor
        InpaintPreprocessor: InpaintPreprocessor
        CLIPRegionsBasePrompt: CLIPRegionsBasePrompt
        CLIPSetRegion: CLIPSetRegion
        CLIPRegionsToConditioning: CLIPRegionsToConditioning
        KSamplerEfficient: KSamplerEfficient
        EfficientLoader: EfficientLoader
        XYPlot: XYPlot
        XYInputSeedsBatch: XYInputSeedsBatch
        XYInputSteps: XYInputSteps
        XYInputCFGScale: XYInputCFGScale
        XYInputSampler: XYInputSampler
        XYInputScheduler: XYInputScheduler
        XYInputDenoise: XYInputDenoise
        XYInputVAE: XYInputVAE
        XYInputPositivePromptSR: XYInputPositivePromptSR
        XYInputNegativePromptSR: XYInputNegativePromptSR
        XYInputCheckpoint: XYInputCheckpoint
        XYInputClipSkip: XYInputClipSkip
        XYInputLoRA: XYInputLoRA
        XYInputLoRAAdvanced: XYInputLoRAAdvanced
        XYInputManualXYEntry: XYInputManualXYEntry
        ManualXYEntryInfo: ManualXYEntryInfo
        JoinXYInputsOfSameType: JoinXYInputsOfSameType
        ImageOverlay: ImageOverlay
        EvaluateIntegers: EvaluateIntegers
        EvaluateFloats: EvaluateFloats
        EvaluateStrings: EvaluateStrings
        SimpleEvalExamples: SimpleEvalExamples
        GaussianBlur: GaussianBlur
        HistogramEqualization: HistogramEqualization
        WASImageFlip: WASImageFlip
        LatentUpscaleMultiply: LatentUpscaleMultiply
        MasqueradeMaskByText: MasqueradeMaskByText
        MasqueradeMaskMorphology: MasqueradeMaskMorphology
        MasqueradeCombineMasks: MasqueradeCombineMasks
        MasqueradeUnaryMaskOp: MasqueradeUnaryMaskOp
        MasqueradeBlur: MasqueradeBlur
        MasqueradeImageToMask: MasqueradeImageToMask
        MasqueradeMixImagesByMask: MasqueradeMixImagesByMask
        MasqueradeMixColorByMask: MasqueradeMixColorByMask
        MasqueradeMaskToRegion: MasqueradeMaskToRegion
        MasqueradeCutByMask: MasqueradeCutByMask
        MasqueradePasteByMask: MasqueradePasteByMask
        MasqueradeGetImageSize: MasqueradeGetImageSize
        MasqueradeChangeChannelCount: MasqueradeChangeChannelCount
        MasqueradeConstantMask: MasqueradeConstantMask
        MasqueradePruneByMask: MasqueradePruneByMask
        MasqueradeSeparateMaskComponents: MasqueradeSeparateMaskComponents
        MasqueradeCreateRectMask: MasqueradeCreateRectMask
        MasqueradeMakeImageBatch: MasqueradeMakeImageBatch
        PseudoHDRStyle: PseudoHDRStyle
        Saturation: Saturation
        ImageSharpening: ImageSharpening
        WASBLIPModelLoader: WASBLIPModelLoader
        WASCacheNode: WASCacheNode
        WASCheckpointLoader: WASCheckpointLoader
        WASCheckpointLoaderSimple: WASCheckpointLoaderSimple
        WASCLIPTextEncodeNSP: WASCLIPTextEncodeNSP
        WASCLIPInputSwitch: WASCLIPInputSwitch
        WASCLIPVisionInputSwitch: WASCLIPVisionInputSwitch
        WASConditioningInputSwitch: WASConditioningInputSwitch
        WASConstantNumber: WASConstantNumber
        WASCreateGridImage: WASCreateGridImage
        WASCreateMorphImage: WASCreateMorphImage
        WASCreateMorphImageFromPath: WASCreateMorphImageFromPath
        WASCreateVideoFromPath: WASCreateVideoFromPath
        WASCLIPSegMasking: WASCLIPSegMasking
        WASCLIPSegModelLoader: WASCLIPSegModelLoader
        WASCLIPSegBatchMasking: WASCLIPSegBatchMasking
        WASConvertMasksToImages: WASConvertMasksToImages
        WASControlNetModelInputSwitch: WASControlNetModelInputSwitch
        WASDebugNumberToConsole: WASDebugNumberToConsole
        WASDictionaryToConsole: WASDictionaryToConsole
        WASDiffusersModelLoader: WASDiffusersModelLoader
        WASDiffusersHubModelDownLoader: WASDiffusersHubModelDownLoader
        WASExportAPI: WASExportAPI
        WASLatentInputSwitch: WASLatentInputSwitch
        WASLoadCache: WASLoadCache
        WASLogicBoolean: WASLogicBoolean
        WASLoraLoader: WASLoraLoader
        WASImageSSAOAmbientOcclusion: WASImageSSAOAmbientOcclusion
        WASImageSSDODirectOcclusion: WASImageSSDODirectOcclusion
        WASImageAnalyze: WASImageAnalyze
        WASImageBatch: WASImageBatch
        WASImageBlank: WASImageBlank
        WASImageBlendByMask: WASImageBlendByMask
        WASImageBlend: WASImageBlend
        WASImageBlendingMode: WASImageBlendingMode
        WASImageBloomFilter: WASImageBloomFilter
        WASImageCannyFilter: WASImageCannyFilter
        WASImageChromaticAberration: WASImageChromaticAberration
        WASImageColorPalette: WASImageColorPalette
        WASImageCropFace: WASImageCropFace
        WASImageCropLocation: WASImageCropLocation
        WASImageCropSquareLocation: WASImageCropSquareLocation
        WASImageDisplacementWarp: WASImageDisplacementWarp
        WASImagePasteFace: WASImagePasteFace
        WASImagePasteCrop: WASImagePasteCrop
        WASImagePasteCropByLocation: WASImagePasteCropByLocation
        WASImagePixelate: WASImagePixelate
        WASImagePowerNoise: WASImagePowerNoise
        WASImageDraganPhotographyFilter: WASImageDraganPhotographyFilter
        WASImageEdgeDetectionFilter: WASImageEdgeDetectionFilter
        WASImageFilmGrain: WASImageFilmGrain
        WASImageFilterAdjustments: WASImageFilterAdjustments
        WASImageGradientMap: WASImageGradientMap
        WASImageGenerateGradient: WASImageGenerateGradient
        WASImageHighPassFilter: WASImageHighPassFilter
        WASImageHistoryLoader: WASImageHistoryLoader
        WASImageInputSwitch: WASImageInputSwitch
        WASImageLevelsAdjustment: WASImageLevelsAdjustment
        WASImageLoad: WASImageLoad
        WASImageMedianFilter: WASImageMedianFilter
        WASImageMixRGBChannels: WASImageMixRGBChannels
        WASImageMonitorEffectsFilter: WASImageMonitorEffectsFilter
        WASImageNovaFilter: WASImageNovaFilter
        WASImagePadding: WASImagePadding
        WASImagePerlinNoise: WASImagePerlinNoise
        WASImageRembgRemoveBackground: WASImageRembgRemoveBackground
        WASImagePerlinPowerFractal: WASImagePerlinPowerFractal
        WASImageRemoveBackgroundAlpha: WASImageRemoveBackgroundAlpha
        WASImageRemoveColor: WASImageRemoveColor
        WASImageResize: WASImageResize
        WASImageRotate: WASImageRotate
        WASImageRotateHue: WASImageRotateHue
        WASImageSave: WASImageSave
        WASImageSeamlessTexture: WASImageSeamlessTexture
        WASImageSelectChannel: WASImageSelectChannel
        WASImageSelectColor: WASImageSelectColor
        WASImageShadowsAndHighlights: WASImageShadowsAndHighlights
        WASImageSizeToNumber: WASImageSizeToNumber
        WASImageStitch: WASImageStitch
        WASImageStyleFilter: WASImageStyleFilter
        WASImageThreshold: WASImageThreshold
        WASImageTiled: WASImageTiled
        WASImageTranspose: WASImageTranspose
        WASImageFDOFFilter: WASImageFDOFFilter
        WASImageToLatentMask: WASImageToLatentMask
        WASImageToNoise: WASImageToNoise
        WASImageToSeed: WASImageToSeed
        WASImageVoronoiNoiseFilter: WASImageVoronoiNoiseFilter
        WASKSamplerWAS: WASKSamplerWAS
        WASKSamplerCycle: WASKSamplerCycle
        WASLatentNoiseInjection: WASLatentNoiseInjection
        WASLatentSizeToNumber: WASLatentSizeToNumber
        WASLatentUpscaleByFactorWAS: WASLatentUpscaleByFactorWAS
        WASLoadImageBatch: WASLoadImageBatch
        WASLoadTextFile: WASLoadTextFile
        WASLoadLora: WASLoadLora
        WASMasksAdd: WASMasksAdd
        WASMasksSubtract: WASMasksSubtract
        WASMaskArbitraryRegion: WASMaskArbitraryRegion
        WASMaskBatchToMask: WASMaskBatchToMask
        WASMaskCeilingRegion: WASMaskCeilingRegion
        WASMaskCropDominantRegion: WASMaskCropDominantRegion
        WASMaskCropMinorityRegion: WASMaskCropMinorityRegion
        WASMaskCropRegion: WASMaskCropRegion
        WASMaskPasteRegion: WASMaskPasteRegion
        WASMaskDilateRegion: WASMaskDilateRegion
        WASMaskDominantRegion: WASMaskDominantRegion
        WASMaskErodeRegion: WASMaskErodeRegion
        WASMaskFillHoles: WASMaskFillHoles
        WASMaskFloorRegion: WASMaskFloorRegion
        WASMaskGaussianRegion: WASMaskGaussianRegion
        WASMaskInvert: WASMaskInvert
        WASMaskMinorityRegion: WASMaskMinorityRegion
        WASMaskSmoothRegion: WASMaskSmoothRegion
        WASMaskThresholdRegion: WASMaskThresholdRegion
        WASMasksCombineRegions: WASMasksCombineRegions
        WASMasksCombineBatch: WASMasksCombineBatch
        WASMiDaSModelLoader: WASMiDaSModelLoader
        WASMiDaSDepthApproximation: WASMiDaSDepthApproximation
        WASMiDaSMaskImage: WASMiDaSMaskImage
        WASModelInputSwitch: WASModelInputSwitch
        WASNumberOperation: WASNumberOperation
        WASNumberToFloat: WASNumberToFloat
        WASNumberInputSwitch: WASNumberInputSwitch
        WASNumberInputCondition: WASNumberInputCondition
        WASNumberMultipleOf: WASNumberMultipleOf
        WASNumberPI: WASNumberPI
        WASNumberToInt: WASNumberToInt
        WASNumberToSeed: WASNumberToSeed
        WASNumberToString: WASNumberToString
        WASNumberToText: WASNumberToText
        WASPromptStylesSelector: WASPromptStylesSelector
        WASRandomNumber: WASRandomNumber
        WASSaveTextFile: WASSaveTextFile
        WASSeed: WASSeed
        WASTensorBatchToImage: WASTensorBatchToImage
        WASBLIPAnalyzeImage: WASBLIPAnalyzeImage
        WASSAMModelLoader: WASSAMModelLoader
        WASSAMParameters: WASSAMParameters
        WASSAMParametersCombine: WASSAMParametersCombine
        WASSAMImageMask: WASSAMImageMask
        WASSamplesPassthroughStatSystem: WASSamplesPassthroughStatSystem
        WASStringToText: WASStringToText
        WASImageBounds: WASImageBounds
        WASInsetImageBounds: WASInsetImageBounds
        WASBoundedImageBlend: WASBoundedImageBlend
        WASBoundedImageBlendWithMask: WASBoundedImageBlendWithMask
        WASBoundedImageCrop: WASBoundedImageCrop
        WASBoundedImageCropWithMask: WASBoundedImageCropWithMask
        WASTextDictionaryUpdate: WASTextDictionaryUpdate
        WASTextAddTokens: WASTextAddTokens
        WASTextAddTokenByInput: WASTextAddTokenByInput
        WASTextCompare: WASTextCompare
        WASTextConcatenate: WASTextConcatenate
        WASTextFileHistoryLoader: WASTextFileHistoryLoader
        WASTextFindAndReplaceByDictionary: WASTextFindAndReplaceByDictionary
        WASTextFindAndReplaceInput: WASTextFindAndReplaceInput
        WASTextFindAndReplace: WASTextFindAndReplace
        WASTextInputSwitch: WASTextInputSwitch
        WASTextList: WASTextList
        WASTextListConcatenate: WASTextListConcatenate
        WASTextLoadLineFromFile: WASTextLoadLineFromFile
        WASTextMultiline: WASTextMultiline
        WASTextParseA1111Embeddings: WASTextParseA1111Embeddings
        WASTextParseNoodleSoupPrompts: WASTextParseNoodleSoupPrompts
        WASTextParseTokens: WASTextParseTokens
        WASTextRandomLine: WASTextRandomLine
        WASTextRandomPrompt: WASTextRandomPrompt
        WASTextString: WASTextString
        WASTextToConditioning: WASTextToConditioning
        WASTextToConsole: WASTextToConsole
        WASTextToNumber: WASTextToNumber
        WASTextToString: WASTextToString
        WASTrueRandomOrgNumberGenerator: WASTrueRandomOrgNumberGenerator
        WASUnCLIPCheckpointLoader: WASUnCLIPCheckpointLoader
        WASUpscaleModelLoader: WASUpscaleModelLoader
        WASUpscaleModelSwitch: WASUpscaleModelSwitch
        WASWriteToGIF: WASWriteToGIF
        WASWriteToVideo: WASWriteToVideo
        WASVAEInputSwitch: WASVAEInputSwitch
        WASVideoDumpFrames: WASVideoDumpFrames
        YKImagePadForOutpaint: YKImagePadForOutpaint
        YKMaskToImage: YKMaskToImage
    }

    // Embeddings -------------------------------
    export type Embeddings =
        | 'easynegative'
        | 'bad-artist-anime'
        | 'bad-artist'
        | 'bad_prompt_version2'
        | 'badquality'
        | 'charturnerv2'
        | 'ng_deepnegative_v1_75t'

    // Suggestions -------------------------------
    export interface CanProduce_FLOAT {}
    export interface CanProduce_Float {}
    export interface CanProduce_INT {}
    export interface CanProduce_Integer {}
    export interface CanProduce_STRING {}
    export interface CanProduce_SchedulerName {}
    export interface CanProduce_SamplerName {}
    export interface CanProduce_IMAGE_PATH {}
    export interface CanProduce_LATENT
        extends Pick<
            ComfySetup,
            | 'KSampler'
            | 'VAEEncode'
            | 'VAEEncodeForInpaint'
            | 'EmptyLatentImage'
            | 'LatentUpscale'
            | 'LatentUpscaleBy'
            | 'LatentFromBatch'
            | 'RepeatLatentBatch'
            | 'KSamplerAdvanced'
            | 'SetLatentNoiseMask'
            | 'LatentComposite'
            | 'LatentRotate'
            | 'LatentFlip'
            | 'LatentCrop'
            | 'VAEEncodeTiled'
            | 'LatentCompositeMasked'
            | 'RebatchLatents'
            | 'LatentClamp'
            | 'ImpactLatentPixelScale'
            | 'ImpactIterativeLatentUpscale'
            | 'ImpactTwoSamplersForMask'
            | 'ImpactLatentSwitch'
            | 'MultiLatentComposite'
            | 'BNK_NoisyLatentImage'
            | 'BNK_DuplicateBatchIndex'
            | 'BNK_SlerpLatent'
            | 'BNK_InjectNoise'
            | 'BNK_Unsampler'
            | 'BNK_TiledKSamplerAdvanced'
            | 'BNK_TiledKSampler'
            | 'KSamplerEfficient'
            | 'EfficientLoader'
            | 'LatentUpscaleMultiply'
            | 'WASLatentInputSwitch'
            | 'WASLoadCache'
            | 'WASKSamplerWAS'
            | 'WASKSamplerCycle'
            | 'WASLatentNoiseInjection'
            | 'WASLatentUpscaleByFactorWAS'
            | 'WASSamplesPassthroughStatSystem'
        > {}
    export interface CanProduce_MODEL
        extends Pick<
            ComfySetup,
            | 'CheckpointLoaderSimple'
            | 'LoraLoader'
            | 'UnCLIPCheckpointLoader'
            | 'CheckpointLoader'
            | 'DiffusersLoader'
            | 'HypernetworkLoader'
            | 'ModelClamp'
            | 'ImpactFromDetailerPipe'
            | 'ImpactFromBasicPipe'
            | 'KSamplerEfficient'
            | 'EfficientLoader'
            | 'WASCheckpointLoader'
            | 'WASCheckpointLoaderSimple'
            | 'WASDiffusersModelLoader'
            | 'WASDiffusersHubModelDownLoader'
            | 'WASLoraLoader'
            | 'WASLoadLora'
            | 'WASModelInputSwitch'
            | 'WASUnCLIPCheckpointLoader'
        > {}
    export interface CanProduce_CLIP
        extends Pick<
            ComfySetup,
            | 'CheckpointLoaderSimple'
            | 'CLIPSetLastLayer'
            | 'LoraLoader'
            | 'CLIPLoader'
            | 'DualCLIPLoader'
            | 'UnCLIPCheckpointLoader'
            | 'CheckpointLoader'
            | 'DiffusersLoader'
            | 'ClipClamp'
            | 'ImpactFromBasicPipe'
            | 'WASCheckpointLoader'
            | 'WASCheckpointLoaderSimple'
            | 'WASCLIPInputSwitch'
            | 'WASDiffusersModelLoader'
            | 'WASDiffusersHubModelDownLoader'
            | 'WASLoraLoader'
            | 'WASLoadLora'
            | 'WASUnCLIPCheckpointLoader'
        > {}
    export interface CanProduce_VAE
        extends Pick<
            ComfySetup,
            | 'CheckpointLoaderSimple'
            | 'VAELoader'
            | 'UnCLIPCheckpointLoader'
            | 'CheckpointLoader'
            | 'DiffusersLoader'
            | 'VaeClamp'
            | 'ImpactFromDetailerPipe'
            | 'ImpactFromBasicPipe'
            | 'KSamplerEfficient'
            | 'EfficientLoader'
            | 'WASCheckpointLoader'
            | 'WASCheckpointLoaderSimple'
            | 'WASDiffusersModelLoader'
            | 'WASDiffusersHubModelDownLoader'
            | 'WASUnCLIPCheckpointLoader'
            | 'WASVAEInputSwitch'
        > {}
    export interface CanProduce_CONDITIONING
        extends Pick<
            ComfySetup,
            | 'CLIPTextEncode'
            | 'ConditioningAverage'
            | 'ConditioningCombine'
            | 'ConditioningSetArea'
            | 'ConditioningSetMask'
            | 'StyleModelApply'
            | 'UnCLIPConditioning'
            | 'ControlNetApply'
            | 'GLIGENTextBoxApply'
            | 'ConditioningClamp'
            | 'ImpactFromDetailerPipe'
            | 'ImpactFromDetailerPipe'
            | 'ImpactFromBasicPipe'
            | 'ImpactFromBasicPipe'
            | 'BNK_CutoffRegionsToConditioning'
            | 'BNK_CutoffRegionsToConditioning_ADV'
            | 'MultiAreaConditioning'
            | 'ConditioningUpscale'
            | 'ConditioningStretch'
            | 'CLIPRegionsToConditioning'
            | 'KSamplerEfficient'
            | 'KSamplerEfficient'
            | 'EfficientLoader'
            | 'EfficientLoader'
            | 'WASCLIPTextEncodeNSP'
            | 'WASConditioningInputSwitch'
            | 'WASLoadCache'
            | 'WASTextToConditioning'
        > {}
    export interface CanProduce_IMAGE
        extends Pick<
            ComfySetup,
            | 'VAEDecode'
            | 'LoadImage'
            | 'ImagePadForOutpaint'
            | 'VAEDecodeTiled'
            | 'ImageUpscaleWithModel'
            | 'MaskToImage'
            | 'BrightnessContrast'
            | 'CLIPSeg'
            | 'CLIPSeg'
            | 'CombineSegMasks'
            | 'CombineSegMasks'
            | 'AlphaChanelAdd'
            | 'AlphaChanelAddByMask'
            | 'AlphaChanelRestore'
            | 'AlphaChanelRemove'
            | 'ImageClamp'
            | 'ImageBatchGet'
            | 'ImageBatchRemove'
            | 'ImageBatchFork'
            | 'ImageBatchFork'
            | 'ImageBatchJoin'
            | 'ImageCompositeAbsolute'
            | 'ImageCompositeAbsoluteByContainer'
            | 'ImageCompositeRelative'
            | 'ImageCompositeRelativeByContainer'
            | 'ImageContainer'
            | 'ImageContainerInheritanceAdd'
            | 'ImageContainerInheritanceScale'
            | 'ImageContainerInheritanceMax'
            | 'ImageContainerInheritanceSum'
            | 'ImageDrawArc'
            | 'ImageDrawArcByContainer'
            | 'ImageDrawChord'
            | 'ImageDrawChordByContainer'
            | 'ImageDrawEllipse'
            | 'ImageDrawEllipseByContainer'
            | 'ImageDrawLine'
            | 'ImageDrawLineByContainer'
            | 'ImageDrawPieslice'
            | 'ImageDrawPiesliceByContainer'
            | 'ImageDrawRectangle'
            | 'ImageDrawRectangleByContainer'
            | 'ImageDrawRectangleRounded'
            | 'ImageDrawRectangleRoundedByContainer'
            | 'ImageDrawPolygon'
            | 'ImageEffectsAdjustment'
            | 'ImageEffectsGrayscale'
            | 'ImageEffectsNegative'
            | 'ImageEffectsSepia'
            | 'ImageEffectsLensZoomBurst'
            | 'ImageEffectsLensChromaticAberration'
            | 'ImageEffectsLensBokeh'
            | 'ImageEffectsLensOpticAxis'
            | 'ImageEffectsLensVignette'
            | 'ImageFilterSmooth'
            | 'ImageFilterSmoothMore'
            | 'ImageFilterBlur'
            | 'ImageFilterBoxBlur'
            | 'ImageFilterGaussianBlur'
            | 'ImageFilterGaussianBlurAdvanced'
            | 'ImageFilterStackBlur'
            | 'ImageFilterMedianBlur'
            | 'ImageFilterBilateralBlur'
            | 'ImageFilterContour'
            | 'ImageFilterDetail'
            | 'ImageFilterEdgeEnhance'
            | 'ImageFilterEdgeEnhanceMore'
            | 'ImageFilterEmboss'
            | 'ImageFilterFindEdges'
            | 'ImageFilterSharpen'
            | 'ImageFilterRank'
            | 'ImageFilterMin'
            | 'ImageFilterMax'
            | 'ImageFilterMode'
            | 'ImageSegmentation'
            | 'ImageSegmentationCustom'
            | 'ImageSegmentationCustomAdvanced'
            | 'ImageText'
            | 'ImageTextOutlined'
            | 'ImageTextMultiline'
            | 'ImageTextMultilineOutlined'
            | 'ImageTransformResizeAbsolute'
            | 'ImageTransformResizeRelative'
            | 'ImageTransformCropAbsolute'
            | 'ImageTransformCropRelative'
            | 'ImageTransformCropCorners'
            | 'ImageTransformPaddingAbsolute'
            | 'ImageTransformPaddingRelative'
            | 'ImageTransformRotate'
            | 'ImageTransformTranspose'
            | 'ImpactDetailerForEach'
            | 'ImpactDetailerForEachDebug'
            | 'ImpactDetailerForEachDebug'
            | 'ImpactDetailerForEachDebug'
            | 'ImpactDetailerForEachPipe'
            | 'ImpactDetailerForEachDebugPipe'
            | 'ImpactDetailerForEachDebugPipe'
            | 'ImpactDetailerForEachDebugPipe'
            | 'ImpactFaceDetailer'
            | 'ImpactFaceDetailer'
            | 'ImpactFaceDetailerPipe'
            | 'ImpactFaceDetailerPipe'
            | 'ImpactIterativeImageUpscale'
            | 'ImpactPreviewBridge'
            | 'ImpactImageReceiver'
            | 'ImpactImageMaskSwitch'
            | 'ImpactSEGSPaste'
            | 'ClipSeg'
            | 'HEDPreprocessor'
            | 'ScribblePreprocessor'
            | 'FakeScribblePreprocessor'
            | 'BinaryPreprocessor'
            | 'PiDiNetPreprocessor'
            | 'LineArtPreprocessor'
            | 'AnimeLineArtPreprocessor'
            | 'Manga2AnimeLineArtPreprocessor'
            | 'MiDaSNormalMapPreprocessor'
            | 'ZoeDepthMapPreprocessor'
            | 'BAENormalMapPreprocessor'
            | 'OpenposePreprocessor'
            | 'MediaPipeHandPosePreprocessor'
            | 'OneFormerCOCOSemSegPreprocessor'
            | 'OneFormerADE20KSemSegPreprocessor'
            | 'MediaPipeFaceMeshPreprocessor'
            | 'ColorPreprocessor'
            | 'TilePreprocessor'
            | 'InpaintPreprocessor'
            | 'KSamplerEfficient'
            | 'ImageOverlay'
            | 'GaussianBlur'
            | 'HistogramEqualization'
            | 'WASImageFlip'
            | 'MasqueradeMaskByText'
            | 'MasqueradeMaskByText'
            | 'MasqueradeMaskMorphology'
            | 'MasqueradeCombineMasks'
            | 'MasqueradeUnaryMaskOp'
            | 'MasqueradeBlur'
            | 'MasqueradeMixImagesByMask'
            | 'MasqueradeMixColorByMask'
            | 'MasqueradeMaskToRegion'
            | 'MasqueradeCutByMask'
            | 'MasqueradePasteByMask'
            | 'MasqueradeChangeChannelCount'
            | 'MasqueradeConstantMask'
            | 'MasqueradePruneByMask'
            | 'MasqueradeSeparateMaskComponents'
            | 'MasqueradeCreateRectMask'
            | 'MasqueradeMakeImageBatch'
            | 'PseudoHDRStyle'
            | 'Saturation'
            | 'ImageSharpening'
            | 'WASCreateGridImage'
            | 'WASCreateMorphImage'
            | 'WASCreateMorphImage'
            | 'WASCLIPSegMasking'
            | 'WASCLIPSegBatchMasking'
            | 'WASCLIPSegBatchMasking'
            | 'WASConvertMasksToImages'
            | 'WASLoadCache'
            | 'WASImageSSAOAmbientOcclusion'
            | 'WASImageSSAOAmbientOcclusion'
            | 'WASImageSSAOAmbientOcclusion'
            | 'WASImageSSDODirectOcclusion'
            | 'WASImageSSDODirectOcclusion'
            | 'WASImageSSDODirectOcclusion'
            | 'WASImageSSDODirectOcclusion'
            | 'WASImageAnalyze'
            | 'WASImageBatch'
            | 'WASImageBlank'
            | 'WASImageBlendByMask'
            | 'WASImageBlend'
            | 'WASImageBlendingMode'
            | 'WASImageBloomFilter'
            | 'WASImageCannyFilter'
            | 'WASImageChromaticAberration'
            | 'WASImageColorPalette'
            | 'WASImageCropFace'
            | 'WASImageCropLocation'
            | 'WASImageCropSquareLocation'
            | 'WASImageDisplacementWarp'
            | 'WASImagePasteFace'
            | 'WASImagePasteFace'
            | 'WASImagePasteCrop'
            | 'WASImagePasteCrop'
            | 'WASImagePasteCropByLocation'
            | 'WASImagePasteCropByLocation'
            | 'WASImagePixelate'
            | 'WASImagePowerNoise'
            | 'WASImageDraganPhotographyFilter'
            | 'WASImageEdgeDetectionFilter'
            | 'WASImageFilmGrain'
            | 'WASImageFilterAdjustments'
            | 'WASImageGradientMap'
            | 'WASImageGenerateGradient'
            | 'WASImageHighPassFilter'
            | 'WASImageHistoryLoader'
            | 'WASImageInputSwitch'
            | 'WASImageLevelsAdjustment'
            | 'WASImageLoad'
            | 'WASImageMedianFilter'
            | 'WASImageMixRGBChannels'
            | 'WASImageMonitorEffectsFilter'
            | 'WASImageNovaFilter'
            | 'WASImagePadding'
            | 'WASImagePadding'
            | 'WASImagePerlinNoise'
            | 'WASImageRembgRemoveBackground'
            | 'WASImagePerlinPowerFractal'
            | 'WASImageRemoveBackgroundAlpha'
            | 'WASImageRemoveColor'
            | 'WASImageResize'
            | 'WASImageRotate'
            | 'WASImageRotateHue'
            | 'WASImageSeamlessTexture'
            | 'WASImageSelectChannel'
            | 'WASImageSelectColor'
            | 'WASImageShadowsAndHighlights'
            | 'WASImageShadowsAndHighlights'
            | 'WASImageShadowsAndHighlights'
            | 'WASImageStitch'
            | 'WASImageStyleFilter'
            | 'WASImageThreshold'
            | 'WASImageTiled'
            | 'WASImageTranspose'
            | 'WASImageFDOFFilter'
            | 'WASImageToNoise'
            | 'WASImageVoronoiNoiseFilter'
            | 'WASLoadImageBatch'
            | 'WASMiDaSDepthApproximation'
            | 'WASMiDaSMaskImage'
            | 'WASMiDaSMaskImage'
            | 'WASTensorBatchToImage'
            | 'WASSAMImageMask'
            | 'WASBoundedImageBlend'
            | 'WASBoundedImageBlendWithMask'
            | 'WASBoundedImageCrop'
            | 'WASBoundedImageCropWithMask'
            | 'WASWriteToGIF'
            | 'WASWriteToVideo'
            | 'YKImagePadForOutpaint'
            | 'YKMaskToImage'
        > {}
    export interface CanProduce_MASK
        extends Pick<
            ComfySetup,
            | 'LoadImage'
            | 'LoadImageMask'
            | 'ImagePadForOutpaint'
            | 'ImageToMask'
            | 'SolidMask'
            | 'InvertMask'
            | 'CropMask'
            | 'MaskComposite'
            | 'FeatherMask'
            | 'CLIPSeg'
            | 'CombineSegMasks'
            | 'AlphaChanelAsMask'
            | 'MaskClamp'
            | 'ImageEffectsLensOpticAxis'
            | 'ImageEffectsLensVignette'
            | 'ImpactSAMDetectorCombined'
            | 'ImpactFaceDetailer'
            | 'ImpactFaceDetailerPipe'
            | 'ImpactBitwiseAndMask'
            | 'ImpactSubtractMask'
            | 'ImpactToBinaryMask'
            | 'ImpactBboxDetectorCombined_v2'
            | 'ImpactSegmDetectorCombined_v2'
            | 'ImpactSegsToCombinedMask'
            | 'ImpactPreviewBridge'
            | 'ImpactImageReceiver'
            | 'ImpactImageMaskSwitch'
            | 'ImpactMaskPainter'
            | 'ImpactSegsMaskCombine'
            | 'ImpactBboxDetectorCombined'
            | 'ImpactSegmDetectorCombined'
            | 'ClipSeg'
            | 'MasqueradeImageToMask'
            | 'WASCLIPSegMasking'
            | 'WASCLIPSegBatchMasking'
            | 'WASImageLoad'
            | 'WASImageToLatentMask'
            | 'WASMasksAdd'
            | 'WASMasksSubtract'
            | 'WASMaskArbitraryRegion'
            | 'WASMaskBatchToMask'
            | 'WASMaskCeilingRegion'
            | 'WASMaskCropDominantRegion'
            | 'WASMaskCropMinorityRegion'
            | 'WASMaskCropRegion'
            | 'WASMaskPasteRegion'
            | 'WASMaskPasteRegion'
            | 'WASMaskDilateRegion'
            | 'WASMaskDominantRegion'
            | 'WASMaskErodeRegion'
            | 'WASMaskFillHoles'
            | 'WASMaskFloorRegion'
            | 'WASMaskGaussianRegion'
            | 'WASMaskInvert'
            | 'WASMaskMinorityRegion'
            | 'WASMaskSmoothRegion'
            | 'WASMaskThresholdRegion'
            | 'WASMasksCombineRegions'
            | 'WASMasksCombineBatch'
            | 'WASSAMImageMask'
            | 'YKImagePadForOutpaint'
        > {}
    export interface CanProduce_CLIP_VISION_OUTPUT extends Pick<ComfySetup, 'CLIPVisionEncode' | 'ClipVisionOutputClamp'> {}
    export interface CanProduce_CONTROL_NET
        extends Pick<
            ComfySetup,
            'ControlNetLoader' | 'DiffControlNetLoader' | 'ControlNetClamp' | 'WASControlNetModelInputSwitch'
        > {}
    export interface CanProduce_STYLE_MODEL extends Pick<ComfySetup, 'StyleModelLoader' | 'StyleModelClamp'> {}
    export interface CanProduce_CLIP_VISION
        extends Pick<
            ComfySetup,
            | 'CLIPVisionLoader'
            | 'UnCLIPCheckpointLoader'
            | 'ClipVisionClamp'
            | 'WASCLIPVisionInputSwitch'
            | 'WASUnCLIPCheckpointLoader'
        > {}
    export interface CanProduce_GLIGEN extends Pick<ComfySetup, 'GLIGENLoader' | 'GligenClamp'> {}
    export interface CanProduce_UPSCALE_MODEL
        extends Pick<
            ComfySetup,
            'UpscaleModelLoader' | 'UpscaleModelClamp' | 'WASUpscaleModelLoader' | 'WASUpscaleModelSwitch'
        > {}
    export interface CanProduce_SAM_MODEL
        extends Pick<ComfySetup, 'ImpactSAMLoader' | 'ImpactFromDetailerPipe' | 'WASSAMModelLoader'> {}
    export interface CanProduce_BBOX_DETECTOR
        extends Pick<ComfySetup, 'ImpactMMDetDetectorProvider' | 'ImpactCLIPSegDetectorProvider' | 'ImpactFromDetailerPipe'> {}
    export interface CanProduce_SEGM_DETECTOR extends Pick<ComfySetup, 'ImpactMMDetDetectorProvider'> {}
    export interface CanProduce_ONNX_DETECTOR extends Pick<ComfySetup, 'ImpactONNXDetectorProvider'> {}
    export interface CanProduce_SEGS
        extends Pick<
            ComfySetup,
            | 'ImpactBitwiseAndMaskForEach'
            | 'ImpactSubtractMaskForEach'
            | 'ImpactSegsMask'
            | 'ImpactEmptySegs'
            | 'ImpactMaskToSEGS'
            | 'ImpactBboxDetectorSEGS'
            | 'ImpactSegmDetectorSEGS'
            | 'ImpactONNXDetectorSEGS'
            | 'ImpactSEGSSwitch'
            | 'ImpactSEGSDetailer'
            | 'ImpactBboxDetectorForEach'
            | 'ImpactSegmDetectorForEach'
        > {}
    export interface CanProduce_DETAILER_PIPE
        extends Pick<
            ComfySetup,
            | 'ImpactFaceDetailer'
            | 'ImpactFaceDetailerPipe'
            | 'ImpactToDetailerPipe'
            | 'ImpactBasicPipeToDetailerPipe'
            | 'ImpactEditDetailerPipe'
        > {}
    export interface CanProduce_BASIC_PIPE
        extends Pick<ComfySetup, 'ImpactToBasicPipe' | 'ImpactDetailerPipeToBasicPipe' | 'ImpactEditBasicPipe'> {}
    export interface CanProduce_UPSCALER
        extends Pick<
            ComfySetup,
            | 'ImpactPixelKSampleUpscalerProvider'
            | 'ImpactPixelKSampleUpscalerProviderPipe'
            | 'ImpactPixelTiledKSampleUpscalerProvider'
            | 'ImpactPixelTiledKSampleUpscalerProviderPipe'
            | 'ImpactTwoSamplersForMaskUpscalerProvider'
            | 'ImpactTwoSamplersForMaskUpscalerProviderPipe'
        > {}
    export interface CanProduce_PK_HOOK
        extends Pick<
            ComfySetup,
            'ImpactPixelKSampleHookCombine' | 'ImpactDenoiseScheduleHookProvider' | 'ImpactCfgScheduleHookProvider'
        > {}
    export interface CanProduce_KSAMPLER extends Pick<ComfySetup, 'ImpactKSamplerProvider' | 'ImpactTiledKSamplerProvider'> {}
    export interface CanProduce_STRING
        extends Pick<
            ComfySetup,
            | 'ImpactImpactWildcardProcessor'
            | 'EvaluateIntegers'
            | 'EvaluateFloats'
            | 'EvaluateStrings'
            | 'WASCheckpointLoader'
            | 'WASCheckpointLoaderSimple'
            | 'WASDiffusersModelLoader'
            | 'WASDiffusersHubModelDownLoader'
            | 'WASLoraLoader'
            | 'WASLoadLora'
            | 'WASNumberToString'
            | 'WASTextToString'
            | 'WASUnCLIPCheckpointLoader'
        > {}
    export interface CanProduce_BBOX_MODEL extends Pick<ComfySetup, 'ImpactMMDetLoader'> {}
    export interface CanProduce_SEGM_MODEL extends Pick<ComfySetup, 'ImpactMMDetLoader'> {}
    export interface CanProduce_CLIPREGION
        extends Pick<ComfySetup, 'BNK_CutoffBasePrompt' | 'BNK_CutoffSetRegions' | 'CLIPRegionsBasePrompt' | 'CLIPSetRegion'> {}
    export interface CanProduce_INT
        extends Pick<
            ComfySetup,
            | 'MultiAreaConditioning'
            | 'MultiAreaConditioning'
            | 'EvaluateIntegers'
            | 'EvaluateFloats'
            | 'MasqueradeGetImageSize'
            | 'MasqueradeGetImageSize'
            | 'WASImageToSeed'
            | 'WASMaskCropRegion'
            | 'WASMaskCropRegion'
            | 'WASMaskCropRegion'
            | 'WASMaskCropRegion'
            | 'WASMaskCropRegion'
            | 'WASMaskCropRegion'
            | 'WASNumberToInt'
        > {}
    export interface CanProduce_FLOAT
        extends Pick<ComfySetup, 'BNK_GetSigma' | 'EvaluateIntegers' | 'EvaluateFloats' | 'WASNumberToFloat'> {}
    export interface CanProduce_DEPENDENCIES extends Pick<ComfySetup, 'EfficientLoader'> {}
    export interface CanProduce_SCRIPT extends Pick<ComfySetup, 'XYPlot'> {}
    export interface CanProduce_XY
        extends Pick<
            ComfySetup,
            | 'XYInputSeedsBatch'
            | 'XYInputSteps'
            | 'XYInputCFGScale'
            | 'XYInputSampler'
            | 'XYInputScheduler'
            | 'XYInputDenoise'
            | 'XYInputVAE'
            | 'XYInputPositivePromptSR'
            | 'XYInputNegativePromptSR'
            | 'XYInputCheckpoint'
            | 'XYInputClipSkip'
            | 'XYInputLoRA'
            | 'XYInputLoRAAdvanced'
            | 'XYInputManualXYEntry'
            | 'XYInputManualXYEntry'
            | 'JoinXYInputsOfSameType'
        > {}
    export interface CanProduce_MASK_MAPPING extends Pick<ComfySetup, 'MasqueradeSeparateMaskComponents'> {}
    export interface CanProduce_BLIP_MODEL extends Pick<ComfySetup, 'WASBLIPModelLoader'> {}
    export interface CanProduce_ASCII
        extends Pick<
            ComfySetup,
            | 'WASCacheNode'
            | 'WASCacheNode'
            | 'WASCacheNode'
            | 'WASCLIPTextEncodeNSP'
            | 'WASCLIPTextEncodeNSP'
            | 'WASCreateMorphImage'
            | 'WASCreateMorphImage'
            | 'WASCreateMorphImageFromPath'
            | 'WASCreateMorphImageFromPath'
            | 'WASCreateVideoFromPath'
            | 'WASCreateVideoFromPath'
            | 'WASImageHistoryLoader'
            | 'WASImageLoad'
            | 'WASLoadImageBatch'
            | 'WASLoadTextFile'
            | 'WASNumberToText'
            | 'WASPromptStylesSelector'
            | 'WASPromptStylesSelector'
            | 'WASBLIPAnalyzeImage'
            | 'WASStringToText'
            | 'WASTextCompare'
            | 'WASTextCompare'
            | 'WASTextCompare'
            | 'WASTextConcatenate'
            | 'WASTextFileHistoryLoader'
            | 'WASTextFindAndReplaceByDictionary'
            | 'WASTextFindAndReplaceInput'
            | 'WASTextFindAndReplace'
            | 'WASTextInputSwitch'
            | 'WASTextLoadLineFromFile'
            | 'WASTextMultiline'
            | 'WASTextParseA1111Embeddings'
            | 'WASTextParseNoodleSoupPrompts'
            | 'WASTextParseTokens'
            | 'WASTextRandomLine'
            | 'WASTextRandomPrompt'
            | 'WASTextString'
            | 'WASTextString'
            | 'WASTextString'
            | 'WASTextString'
            | 'WASTextToConsole'
            | 'WASUpscaleModelLoader'
            | 'WASWriteToGIF'
            | 'WASWriteToGIF'
            | 'WASWriteToVideo'
            | 'WASWriteToVideo'
            | 'WASVideoDumpFrames'
        > {}
    export interface CanProduce_NUMBER
        extends Pick<
            ComfySetup,
            | 'WASConstantNumber'
            | 'WASDebugNumberToConsole'
            | 'WASLogicBoolean'
            | 'WASImageSizeToNumber'
            | 'WASImageSizeToNumber'
            | 'WASLatentSizeToNumber'
            | 'WASLatentSizeToNumber'
            | 'WASNumberOperation'
            | 'WASNumberInputSwitch'
            | 'WASNumberInputCondition'
            | 'WASNumberMultipleOf'
            | 'WASNumberPI'
            | 'WASRandomNumber'
            | 'WASTextCompare'
            | 'WASTextCompare'
            | 'WASTextToNumber'
            | 'WASTrueRandomOrgNumberGenerator'
            | 'WASVideoDumpFrames'
        > {}
    export interface CanProduce_CLIPSEG_MODEL extends Pick<ComfySetup, 'WASCLIPSegModelLoader'> {}
    export interface CanProduce_DICT
        extends Pick<
            ComfySetup,
            | 'WASDictionaryToConsole'
            | 'WASLoadTextFile'
            | 'WASTextDictionaryUpdate'
            | 'WASTextFileHistoryLoader'
            | 'WASTextLoadLineFromFile'
        > {}
    export interface CanProduce_LIST
        extends Pick<ComfySetup, 'WASImageColorPalette' | 'WASTextList' | 'WASTextListConcatenate'> {}
    export interface CanProduce_CROP_DATA
        extends Pick<
            ComfySetup,
            'WASImageCropFace' | 'WASImageCropLocation' | 'WASImageCropSquareLocation' | 'WASMaskCropRegion'
        > {}
    export interface CanProduce_MIDAS_MODEL extends Pick<ComfySetup, 'WASMiDaSModelLoader'> {}
    export interface CanProduce_SEED extends Pick<ComfySetup, 'WASNumberToSeed' | 'WASSeed'> {}
    export interface CanProduce_SAM_PARAMETERS extends Pick<ComfySetup, 'WASSAMParameters' | 'WASSAMParametersCombine'> {}
    export interface CanProduce_IMAGE_BOUNDS
        extends Pick<ComfySetup, 'WASImageBounds' | 'WASInsetImageBounds' | 'WASBoundedImageCropWithMask'> {}

    // TYPES -------------------------------
    export type CLIP_VISION_OUTPUT = Slot<'CLIP_VISION_OUTPUT'>
    export type STRING = string | Slot<'STRING'>
    export type FLOAT = number | Slot<'FLOAT'>
    export type SAM_PARAMETERS = Slot<'SAM_PARAMETERS'>
    export type UPSCALE_MODEL = Slot<'UPSCALE_MODEL'>
    export type BBOX_DETECTOR = Slot<'BBOX_DETECTOR'>
    export type SEGM_DETECTOR = Slot<'SEGM_DETECTOR'>
    export type ONNX_DETECTOR = Slot<'ONNX_DETECTOR'>
    export type DETAILER_PIPE = Slot<'DETAILER_PIPE'>
    export type CLIPSEG_MODEL = Slot<'CLIPSEG_MODEL'>
    export type INT = number | Slot<'INT'>
    export type CONDITIONING = Slot<'CONDITIONING'>
    export type DEPENDENCIES = Slot<'DEPENDENCIES'>
    export type MASK_MAPPING = Slot<'MASK_MAPPING'>
    export type IMAGE_BOUNDS = Slot<'IMAGE_BOUNDS'>
    export type CLIP_VISION = Slot<'CLIP_VISION'>
    export type STYLE_MODEL = Slot<'STYLE_MODEL'>
    export type CONTROL_NET = Slot<'CONTROL_NET'>
    export type MIDAS_MODEL = Slot<'MIDAS_MODEL'>
    export type BASIC_PIPE = Slot<'BASIC_PIPE'>
    export type BBOX_MODEL = Slot<'BBOX_MODEL'>
    export type SEGM_MODEL = Slot<'SEGM_MODEL'>
    export type CLIPREGION = Slot<'CLIPREGION'>
    export type BLIP_MODEL = Slot<'BLIP_MODEL'>
    export type SAM_MODEL = Slot<'SAM_MODEL'>
    export type CROP_DATA = Slot<'CROP_DATA'>
    export type UPSCALER = Slot<'UPSCALER'>
    export type KSAMPLER = Slot<'KSAMPLER'>
    export type PK_HOOK = Slot<'PK_HOOK'>
    export type LATENT = Slot<'LATENT'>
    export type GLIGEN = Slot<'GLIGEN'>
    export type SCRIPT = Slot<'SCRIPT'>
    export type NUMBER = Slot<'NUMBER'>
    export type MODEL = Slot<'MODEL'>
    export type IMAGE = Slot<'IMAGE'>
    export type ASCII = Slot<'ASCII'>
    export type CLIP = Slot<'CLIP'>
    export type MASK = Slot<'MASK'>
    export type SEGS = Slot<'SEGS'>
    export type DICT = Slot<'DICT'>
    export type LIST = Slot<'LIST'>
    export type SEED = Slot<'SEED'>
    export type VAE = Slot<'VAE'>
    export type XY = Slot<'XY'>

    // ACCEPTABLE INPUTS -------------------------------
    export type _CLIP_VISION_OUTPUT =
        | Slot<'CLIP_VISION_OUTPUT'>
        | HasSingle_CLIP_VISION_OUTPUT
        | ((x: CanProduce_CLIP_VISION_OUTPUT) => _CLIP_VISION_OUTPUT)
    export type _STRING = string | Slot<'STRING'> | HasSingle_STRING | ((x: CanProduce_STRING) => _STRING)
    export type _FLOAT = number | Slot<'FLOAT'> | HasSingle_FLOAT | ((x: CanProduce_FLOAT) => _FLOAT)
    export type _SAM_PARAMETERS =
        | Slot<'SAM_PARAMETERS'>
        | HasSingle_SAM_PARAMETERS
        | ((x: CanProduce_SAM_PARAMETERS) => _SAM_PARAMETERS)
    export type _UPSCALE_MODEL =
        | Slot<'UPSCALE_MODEL'>
        | HasSingle_UPSCALE_MODEL
        | ((x: CanProduce_UPSCALE_MODEL) => _UPSCALE_MODEL)
    export type _BBOX_DETECTOR =
        | Slot<'BBOX_DETECTOR'>
        | HasSingle_BBOX_DETECTOR
        | ((x: CanProduce_BBOX_DETECTOR) => _BBOX_DETECTOR)
    export type _SEGM_DETECTOR =
        | Slot<'SEGM_DETECTOR'>
        | HasSingle_SEGM_DETECTOR
        | ((x: CanProduce_SEGM_DETECTOR) => _SEGM_DETECTOR)
    export type _ONNX_DETECTOR =
        | Slot<'ONNX_DETECTOR'>
        | HasSingle_ONNX_DETECTOR
        | ((x: CanProduce_ONNX_DETECTOR) => _ONNX_DETECTOR)
    export type _DETAILER_PIPE =
        | Slot<'DETAILER_PIPE'>
        | HasSingle_DETAILER_PIPE
        | ((x: CanProduce_DETAILER_PIPE) => _DETAILER_PIPE)
    export type _CLIPSEG_MODEL =
        | Slot<'CLIPSEG_MODEL'>
        | HasSingle_CLIPSEG_MODEL
        | ((x: CanProduce_CLIPSEG_MODEL) => _CLIPSEG_MODEL)
    export type _INT = number | Slot<'INT'> | HasSingle_INT | ((x: CanProduce_INT) => _INT)
    export type _CONDITIONING = Slot<'CONDITIONING'> | HasSingle_CONDITIONING | ((x: CanProduce_CONDITIONING) => _CONDITIONING)
    export type _DEPENDENCIES = Slot<'DEPENDENCIES'> | HasSingle_DEPENDENCIES | ((x: CanProduce_DEPENDENCIES) => _DEPENDENCIES)
    export type _MASK_MAPPING = Slot<'MASK_MAPPING'> | HasSingle_MASK_MAPPING | ((x: CanProduce_MASK_MAPPING) => _MASK_MAPPING)
    export type _IMAGE_BOUNDS = Slot<'IMAGE_BOUNDS'> | HasSingle_IMAGE_BOUNDS | ((x: CanProduce_IMAGE_BOUNDS) => _IMAGE_BOUNDS)
    export type _CLIP_VISION = Slot<'CLIP_VISION'> | HasSingle_CLIP_VISION | ((x: CanProduce_CLIP_VISION) => _CLIP_VISION)
    export type _STYLE_MODEL = Slot<'STYLE_MODEL'> | HasSingle_STYLE_MODEL | ((x: CanProduce_STYLE_MODEL) => _STYLE_MODEL)
    export type _CONTROL_NET = Slot<'CONTROL_NET'> | HasSingle_CONTROL_NET | ((x: CanProduce_CONTROL_NET) => _CONTROL_NET)
    export type _MIDAS_MODEL = Slot<'MIDAS_MODEL'> | HasSingle_MIDAS_MODEL | ((x: CanProduce_MIDAS_MODEL) => _MIDAS_MODEL)
    export type _BASIC_PIPE = Slot<'BASIC_PIPE'> | HasSingle_BASIC_PIPE | ((x: CanProduce_BASIC_PIPE) => _BASIC_PIPE)
    export type _BBOX_MODEL = Slot<'BBOX_MODEL'> | HasSingle_BBOX_MODEL | ((x: CanProduce_BBOX_MODEL) => _BBOX_MODEL)
    export type _SEGM_MODEL = Slot<'SEGM_MODEL'> | HasSingle_SEGM_MODEL | ((x: CanProduce_SEGM_MODEL) => _SEGM_MODEL)
    export type _CLIPREGION = Slot<'CLIPREGION'> | HasSingle_CLIPREGION | ((x: CanProduce_CLIPREGION) => _CLIPREGION)
    export type _BLIP_MODEL = Slot<'BLIP_MODEL'> | HasSingle_BLIP_MODEL | ((x: CanProduce_BLIP_MODEL) => _BLIP_MODEL)
    export type _SAM_MODEL = Slot<'SAM_MODEL'> | HasSingle_SAM_MODEL | ((x: CanProduce_SAM_MODEL) => _SAM_MODEL)
    export type _CROP_DATA = Slot<'CROP_DATA'> | HasSingle_CROP_DATA | ((x: CanProduce_CROP_DATA) => _CROP_DATA)
    export type _UPSCALER = Slot<'UPSCALER'> | HasSingle_UPSCALER | ((x: CanProduce_UPSCALER) => _UPSCALER)
    export type _KSAMPLER = Slot<'KSAMPLER'> | HasSingle_KSAMPLER | ((x: CanProduce_KSAMPLER) => _KSAMPLER)
    export type _PK_HOOK = Slot<'PK_HOOK'> | HasSingle_PK_HOOK | ((x: CanProduce_PK_HOOK) => _PK_HOOK)
    export type _LATENT = Slot<'LATENT'> | HasSingle_LATENT | ((x: CanProduce_LATENT) => _LATENT)
    export type _GLIGEN = Slot<'GLIGEN'> | HasSingle_GLIGEN | ((x: CanProduce_GLIGEN) => _GLIGEN)
    export type _SCRIPT = Slot<'SCRIPT'> | HasSingle_SCRIPT | ((x: CanProduce_SCRIPT) => _SCRIPT)
    export type _NUMBER = Slot<'NUMBER'> | HasSingle_NUMBER | ((x: CanProduce_NUMBER) => _NUMBER)
    export type _MODEL = Slot<'MODEL'> | HasSingle_MODEL | ((x: CanProduce_MODEL) => _MODEL)
    export type _IMAGE = Slot<'IMAGE'> | HasSingle_IMAGE | ((x: CanProduce_IMAGE) => _IMAGE)
    export type _ASCII = Slot<'ASCII'> | HasSingle_ASCII | ((x: CanProduce_ASCII) => _ASCII)
    export type _CLIP = Slot<'CLIP'> | HasSingle_CLIP | ((x: CanProduce_CLIP) => _CLIP)
    export type _MASK = Slot<'MASK'> | HasSingle_MASK | ((x: CanProduce_MASK) => _MASK)
    export type _SEGS = Slot<'SEGS'> | HasSingle_SEGS | ((x: CanProduce_SEGS) => _SEGS)
    export type _DICT = Slot<'DICT'> | HasSingle_DICT | ((x: CanProduce_DICT) => _DICT)
    export type _LIST = Slot<'LIST'> | HasSingle_LIST | ((x: CanProduce_LIST) => _LIST)
    export type _SEED = Slot<'SEED'> | HasSingle_SEED | ((x: CanProduce_SEED) => _SEED)
    export type _VAE = Slot<'VAE'> | HasSingle_VAE | ((x: CanProduce_VAE) => _VAE)
    export type _XY = Slot<'XY'> | HasSingle_XY | ((x: CanProduce_XY) => _XY)

    // ENUMS -------------------------------
    export type Enum_KSampler_sampler_name =
        | 'ddim'
        | 'dpm_2'
        | 'dpm_2_ancestral'
        | 'dpm_adaptive'
        | 'dpm_fast'
        | 'dpmpp_2m'
        | 'dpmpp_2m_sde'
        | 'dpmpp_2s_ancestral'
        | 'dpmpp_sde'
        | 'euler'
        | 'euler_ancestral'
        | 'heun'
        | 'lms'
        | 'uni_pc'
        | 'uni_pc_bh2'
    export type Enum_KSamplerAdvanced_sampler_name = Enum_KSampler_sampler_name
    export type Enum_ImpactDetailerForEach_sampler_name = Enum_KSampler_sampler_name
    export type Enum_ImpactDetailerForEachDebug_sampler_name = Enum_KSampler_sampler_name
    export type Enum_ImpactDetailerForEachPipe_sampler_name = Enum_KSampler_sampler_name
    export type Enum_ImpactDetailerForEachDebugPipe_sampler_name = Enum_KSampler_sampler_name
    export type Enum_ImpactFaceDetailer_sampler_name = Enum_KSampler_sampler_name
    export type Enum_ImpactFaceDetailerPipe_sampler_name = Enum_KSampler_sampler_name
    export type Enum_ImpactPixelKSampleUpscalerProvider_sampler_name = Enum_KSampler_sampler_name
    export type Enum_ImpactPixelKSampleUpscalerProviderPipe_sampler_name = Enum_KSampler_sampler_name
    export type Enum_ImpactPixelTiledKSampleUpscalerProvider_sampler_name = Enum_KSampler_sampler_name
    export type Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_sampler_name = Enum_KSampler_sampler_name
    export type Enum_ImpactKSamplerProvider_sampler_name = Enum_KSampler_sampler_name
    export type Enum_ImpactTiledKSamplerProvider_sampler_name = Enum_KSampler_sampler_name
    export type Enum_ImpactSEGSDetailer_sampler_name = Enum_KSampler_sampler_name
    export type Enum_BNK_GetSigma_sampler_name = Enum_KSampler_sampler_name
    export type Enum_BNK_Unsampler_sampler_name = Enum_KSampler_sampler_name
    export type Enum_BNK_TiledKSamplerAdvanced_sampler_name = Enum_KSampler_sampler_name
    export type Enum_BNK_TiledKSampler_sampler_name = Enum_KSampler_sampler_name
    export type Enum_KSamplerEfficient_sampler_name = Enum_KSampler_sampler_name
    export type Enum_WASKSamplerWAS_sampler_name = Enum_KSampler_sampler_name
    export type Enum_WASKSamplerCycle_sampler_name = Enum_KSampler_sampler_name
    export type Enum_KSampler_scheduler = 'ddim_uniform' | 'exponential' | 'karras' | 'normal' | 'simple'
    export type Enum_KSamplerAdvanced_scheduler = Enum_KSampler_scheduler
    export type Enum_ImpactDetailerForEach_scheduler = Enum_KSampler_scheduler
    export type Enum_ImpactDetailerForEachDebug_scheduler = Enum_KSampler_scheduler
    export type Enum_ImpactDetailerForEachPipe_scheduler = Enum_KSampler_scheduler
    export type Enum_ImpactDetailerForEachDebugPipe_scheduler = Enum_KSampler_scheduler
    export type Enum_ImpactFaceDetailer_scheduler = Enum_KSampler_scheduler
    export type Enum_ImpactFaceDetailerPipe_scheduler = Enum_KSampler_scheduler
    export type Enum_ImpactPixelKSampleUpscalerProvider_scheduler = Enum_KSampler_scheduler
    export type Enum_ImpactPixelKSampleUpscalerProviderPipe_scheduler = Enum_KSampler_scheduler
    export type Enum_ImpactPixelTiledKSampleUpscalerProvider_scheduler = Enum_KSampler_scheduler
    export type Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_scheduler = Enum_KSampler_scheduler
    export type Enum_ImpactKSamplerProvider_scheduler = Enum_KSampler_scheduler
    export type Enum_ImpactTiledKSamplerProvider_scheduler = Enum_KSampler_scheduler
    export type Enum_ImpactSEGSDetailer_scheduler = Enum_KSampler_scheduler
    export type Enum_BNK_GetSigma_scheduler = Enum_KSampler_scheduler
    export type Enum_BNK_Unsampler_scheduler = Enum_KSampler_scheduler
    export type Enum_BNK_TiledKSamplerAdvanced_scheduler = Enum_KSampler_scheduler
    export type Enum_BNK_TiledKSampler_scheduler = Enum_KSampler_scheduler
    export type Enum_KSamplerEfficient_scheduler = Enum_KSampler_scheduler
    export type Enum_WASKSamplerWAS_scheduler = Enum_KSampler_scheduler
    export type Enum_WASKSamplerCycle_scheduler = Enum_KSampler_scheduler
    export type Enum_CheckpointLoaderSimple_ckpt_name =
        | 'AOM3A1_orangemixs.safetensors'
        | 'AOM3A3_orangemixs.safetensors'
        | 'AbyssOrangeMix2_hard.safetensors'
        | 'Deliberate-inpainting.safetensors'
        | 'angel1_36224.safetensors'
        | 'anything-v3-fp16-pruned.safetensors'
        | 'deliberate_v2.safetensors'
        | 'ghostmix_v12.safetensors'
        | 'lyriel_v15.safetensors'
        | 'mistoonAnime_v10.safetensors'
        | 'mistoonAnime_v10Inpainting.safetensors'
        | 'realisticVisionV20_v20.safetensors'
        | 'revAnimated_v121.safetensors'
        | 'revAnimated_v121Inp-inpainting.safetensors'
        | 'revAnimated_v122.safetensors'
        | 'toonyou_beta1.safetensors'
        | 'v1-5-pruned-emaonly.ckpt'
        | 'v2-1_512-ema-pruned.safetensors'
        | 'v2-1_768-ema-pruned.safetensors'
        | 'wd-1-5-beta2-fp16.safetensors'
    export type Enum_UnCLIPCheckpointLoader_ckpt_name = Enum_CheckpointLoaderSimple_ckpt_name
    export type Enum_CheckpointLoader_ckpt_name = Enum_CheckpointLoaderSimple_ckpt_name
    export type Enum_EfficientLoader_ckpt_name = Enum_CheckpointLoaderSimple_ckpt_name
    export type Enum_WASCheckpointLoader_ckpt_name = Enum_CheckpointLoaderSimple_ckpt_name
    export type Enum_WASCheckpointLoaderSimple_ckpt_name = Enum_CheckpointLoaderSimple_ckpt_name
    export type Enum_WASUnCLIPCheckpointLoader_ckpt_name = Enum_CheckpointLoaderSimple_ckpt_name
    export type Enum_VAELoader_vae_name =
        | 'blessed2.vae.pt'
        | 'kl-f8-anime2.ckpt'
        | 'orangemix.vae.pt'
        | 'vae-ft-mse-840000-ema-pruned.safetensors'
    export type Enum_LatentUpscale_upscale_method = 'area' | 'bicubic' | 'bilinear' | 'bislerp' | 'nearest-exact'
    export type Enum_LatentUpscaleBy_upscale_method = Enum_LatentUpscale_upscale_method
    export type Enum_LatentUpscale_crop = 'center' | 'disabled'
    export type Enum_LatentUpscaleMultiply_crop = Enum_LatentUpscale_crop
    export type Enum_LoadImage_image =
        | '00366-3086397572-spinkledustfairywarrior_1.png'
        | '2023-03-19_22-20-04.png'
        | 'ComfyUI_00498_.png'
        | 'ComfyUI_01790_.png'
        | 'abcd.png'
        | 'decihub-logo-126.png'
        | 'esrgan_example (1).png'
        | 'esrgan_example.png'
        | 'example.png'
        | 'kkl_tpose_uniform.png'
        | 'upload (1).png'
        | 'upload (10).png'
        | 'upload (100).png'
        | 'upload (101).png'
        | 'upload (102).png'
        | 'upload (103).png'
        | 'upload (104).png'
        | 'upload (105).png'
        | 'upload (106).png'
        | 'upload (107).png'
        | 'upload (108).png'
        | 'upload (109).png'
        | 'upload (11).png'
        | 'upload (110).png'
        | 'upload (111).png'
        | 'upload (112).png'
        | 'upload (113).png'
        | 'upload (114).png'
        | 'upload (115).png'
        | 'upload (116).png'
        | 'upload (117).png'
        | 'upload (118).png'
        | 'upload (119).png'
        | 'upload (12).png'
        | 'upload (120).png'
        | 'upload (13).png'
        | 'upload (14).png'
        | 'upload (15).png'
        | 'upload (16).png'
        | 'upload (17).png'
        | 'upload (18).png'
        | 'upload (19).png'
        | 'upload (2).png'
        | 'upload (20).png'
        | 'upload (21).png'
        | 'upload (22).png'
        | 'upload (23).png'
        | 'upload (24).png'
        | 'upload (25).png'
        | 'upload (26).png'
        | 'upload (27).png'
        | 'upload (28).png'
        | 'upload (29).png'
        | 'upload (3).png'
        | 'upload (30).png'
        | 'upload (31).png'
        | 'upload (32).png'
        | 'upload (33).png'
        | 'upload (34).png'
        | 'upload (35).png'
        | 'upload (36).png'
        | 'upload (37).png'
        | 'upload (38).png'
        | 'upload (39).png'
        | 'upload (4).png'
        | 'upload (40).png'
        | 'upload (41).png'
        | 'upload (42).png'
        | 'upload (43).png'
        | 'upload (44).png'
        | 'upload (45).png'
        | 'upload (46).png'
        | 'upload (47).png'
        | 'upload (48).png'
        | 'upload (49).png'
        | 'upload (5).png'
        | 'upload (50).png'
        | 'upload (51).png'
        | 'upload (52).png'
        | 'upload (53).png'
        | 'upload (54).png'
        | 'upload (55).png'
        | 'upload (56).png'
        | 'upload (57).png'
        | 'upload (58).png'
        | 'upload (59).png'
        | 'upload (6).png'
        | 'upload (60).png'
        | 'upload (61).png'
        | 'upload (62).png'
        | 'upload (63).png'
        | 'upload (64).png'
        | 'upload (65).png'
        | 'upload (66).png'
        | 'upload (67).png'
        | 'upload (68).png'
        | 'upload (69).png'
        | 'upload (7).png'
        | 'upload (70).png'
        | 'upload (71).png'
        | 'upload (72).png'
        | 'upload (73).png'
        | 'upload (74).png'
        | 'upload (75).png'
        | 'upload (76).png'
        | 'upload (77).png'
        | 'upload (78).png'
        | 'upload (79).png'
        | 'upload (8).png'
        | 'upload (80).png'
        | 'upload (81).png'
        | 'upload (82).png'
        | 'upload (83).png'
        | 'upload (84).png'
        | 'upload (85).png'
        | 'upload (86).png'
        | 'upload (87).png'
        | 'upload (88).png'
        | 'upload (89).png'
        | 'upload (9).png'
        | 'upload (90).png'
        | 'upload (91).png'
        | 'upload (92).png'
        | 'upload (93).png'
        | 'upload (94).png'
        | 'upload (95).png'
        | 'upload (96).png'
        | 'upload (97).png'
        | 'upload (98).png'
        | 'upload (99).png'
        | 'upload.png'
    export type Enum_LoadImageMask_image = Enum_LoadImage_image
    export type Enum_ImpactImageReceiver_image = Enum_LoadImage_image
    export type Enum_LoadImageMask_channel = 'alpha' | 'blue' | 'green' | 'red'
    export type Enum_WASImageToLatentMask_channel = Enum_LoadImageMask_channel
    export type Enum_ConditioningSetMask_set_cond_area = 'default' | 'mask bounds'
    export type Enum_KSamplerAdvanced_add_noise = 'disable' | 'enable'
    export type Enum_KSamplerAdvanced_return_with_leftover_noise = Enum_KSamplerAdvanced_add_noise
    export type Enum_BNK_Unsampler_normalize = Enum_KSamplerAdvanced_add_noise
    export type Enum_BNK_TiledKSamplerAdvanced_add_noise = Enum_KSamplerAdvanced_add_noise
    export type Enum_BNK_TiledKSamplerAdvanced_return_with_leftover_noise = Enum_KSamplerAdvanced_add_noise
    export type Enum_HEDPreprocessor_safe = Enum_KSamplerAdvanced_add_noise
    export type Enum_PiDiNetPreprocessor_safe = Enum_KSamplerAdvanced_add_noise
    export type Enum_LineArtPreprocessor_coarse = Enum_KSamplerAdvanced_add_noise
    export type Enum_OpenposePreprocessor_detect_hand = Enum_KSamplerAdvanced_add_noise
    export type Enum_OpenposePreprocessor_detect_body = Enum_KSamplerAdvanced_add_noise
    export type Enum_OpenposePreprocessor_detect_face = Enum_KSamplerAdvanced_add_noise
    export type Enum_MediaPipeHandPosePreprocessor_detect_pose = Enum_KSamplerAdvanced_add_noise
    export type Enum_MediaPipeHandPosePreprocessor_detect_hands = Enum_KSamplerAdvanced_add_noise
    export type Enum_WASKSamplerCycle_tiled_vae = Enum_KSamplerAdvanced_add_noise
    export type Enum_WASKSamplerCycle_scale_denoise = Enum_KSamplerAdvanced_add_noise
    export type Enum_WASKSamplerCycle_pos_add_strength_scaling = Enum_KSamplerAdvanced_add_noise
    export type Enum_WASKSamplerCycle_neg_add_strength_scaling = Enum_KSamplerAdvanced_add_noise
    export type Enum_LatentRotate_rotation = '180 degrees' | '270 degrees' | '90 degrees' | 'none'
    export type Enum_LatentFlip_flip_method = 'x-axis: vertically' | 'y-axis: horizontally'
    export type Enum_LoraLoader_lora_name =
        | 'animemix_16.safetensors'
        | 'animemix_v3_offset.safetensors'
        | 'chars\\dark_magician_girl.safetensors'
        | 'chars\\yorha_noDOT_2_type_b.safetensors'
        | 'colors\\LowRa.safetensors'
        | 'colors\\theovercomer8sContrastFix_sd15.safetensors'
        | 'colors\\theovercomer8sContrastFix_sd21768.safetensors'
        | 'styles\\ConstructionyardAIV3.safetensors'
        | 'styles\\StonepunkAI-000011.safetensors'
        | 'styles\\ToonYou_Style.safetensors'
        | 'styles\\baroqueAI.safetensors'
        | 'styles\\pixel_f2.safetensors'
        | 'test\\Moxin_10.safetensors'
        | 'test\\animeLineartMangaLike_v30MangaLike.safetensors'
        | 'utils\\charTurnBetaLora.safetensors'
    export type Enum_CLIPLoader_clip_name = never
    export type Enum_ControlNetLoader_control_net_name =
        | 'control_depth-fp16.safetensors'
        | 'control_openpose-fp16.safetensors'
        | 'control_scribble-fp16.safetensors'
        | 'control_v11u_sd15_tile.pth'
        | 't2iadapter_canny_sd14v1.pth'
        | 't2iadapter_color_sd14v1.pth'
        | 't2iadapter_depth_sd14v1.pth'
        | 't2iadapter_keypose_sd14v1.pth'
        | 't2iadapter_openpose_sd14v1.pth'
        | 't2iadapter_seg_sd14v1.pth'
        | 't2iadapter_sketch_sd14v1.pth'
    export type Enum_DiffControlNetLoader_control_net_name = Enum_ControlNetLoader_control_net_name
    export type Enum_StyleModelLoader_style_model_name = 't2iadapter_style_sd14v1.pth'
    export type Enum_CLIPVisionLoader_clip_name = 'clip_vit14.bin'
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
    export type Enum_WASCheckpointLoader_config_name = Enum_CheckpointLoader_config_name
    export type Enum_UpscaleModelLoader_model_name =
        | '2x_Waifaux-NL3-SuperLite_latest_G.pth'
        | 'RealESRGAN_x2.pth'
        | 'RealESRGAN_x4.pth'
    export type Enum_WASUpscaleModelLoader_model_name = Enum_UpscaleModelLoader_model_name
    export type Enum_ImageToMask_channel = 'blue' | 'green' | 'red'
    export type Enum_WASImageSelectChannel_channel = Enum_ImageToMask_channel
    export type Enum_MaskComposite_operation = 'add' | 'and' | 'multiply' | 'or' | 'subtract' | 'xor'
    export type Enum_BrightnessContrast_mode = 'brightness' | 'contrast'
    export type Enum_AlphaChanelAddByMask_method = 'default' | 'invert'
    export type Enum_AlphaChanelAsMask_method = Enum_AlphaChanelAddByMask_method
    export type Enum_ImageBatchFork_priority = 'first' | 'second'
    export type Enum_ImageCompositeAbsolute_background = 'images_a' | 'images_b'
    export type Enum_ImageCompositeAbsoluteByContainer_background = Enum_ImageCompositeAbsolute_background
    export type Enum_ImageCompositeRelative_background = Enum_ImageCompositeAbsolute_background
    export type Enum_ImageCompositeRelativeByContainer_background = Enum_ImageCompositeAbsolute_background
    export type Enum_ImageCompositeAbsolute_method = 'matrix' | 'pair'
    export type Enum_ImageCompositeAbsoluteByContainer_method = Enum_ImageCompositeAbsolute_method
    export type Enum_ImageCompositeRelative_method = Enum_ImageCompositeAbsolute_method
    export type Enum_ImageCompositeRelativeByContainer_method = Enum_ImageCompositeAbsolute_method
    export type Enum_ImageCompositeRelative_container_size_type = 'max' | 'sum' | 'sum_height' | 'sum_width'
    export type Enum_ImageContainerInheritanceAdd_method = 'for_each' | 'single'
    export type Enum_ImageContainerInheritanceScale_method = Enum_ImageContainerInheritanceAdd_method
    export type Enum_ImageContainerInheritanceMax_method = 'for_each_matrix' | 'for_each_pair' | 'single'
    export type Enum_ImageContainerInheritanceSum_method = Enum_ImageContainerInheritanceMax_method
    export type Enum_ImageContainerInheritanceSum_container_size_type = 'sum' | 'sum_height' | 'sum_width'
    export type Enum_ImageDrawArc_method = 'bicubic' | 'bilinear' | 'box' | 'hamming' | 'lanczos' | 'nearest'
    export type Enum_ImageDrawArcByContainer_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawChord_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawChordByContainer_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawEllipse_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawEllipseByContainer_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawLine_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawLineByContainer_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawPieslice_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawPiesliceByContainer_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawRectangle_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawRectangleByContainer_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawRectangleRounded_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawRectangleRoundedByContainer_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawPolygon_method = Enum_ImageDrawArc_method
    export type Enum_ImageTransformResizeAbsolute_method = Enum_ImageDrawArc_method
    export type Enum_ImageTransformResizeRelative_method = Enum_ImageDrawArc_method
    export type Enum_ImageTransformCropCorners_method = Enum_ImageDrawArc_method
    export type Enum_ImageTransformRotate_method = Enum_ImageDrawArc_method
    export type Enum_ImageDrawRectangleRounded_top_left_corner = 'false' | 'true'
    export type Enum_ImageDrawRectangleRounded_top_right_corner = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageDrawRectangleRounded_bottom_right_corner = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageDrawRectangleRounded_bottom_left_corner = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageDrawRectangleRoundedByContainer_top_left_corner = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageDrawRectangleRoundedByContainer_top_right_corner = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageDrawRectangleRoundedByContainer_bottom_right_corner = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageDrawRectangleRoundedByContainer_bottom_left_corner = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageEffectsLensZoomBurst_stabilization = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageSegmentation_alpha_matting = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageSegmentation_post_process_mask = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageSegmentationCustom_alpha_matting = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageSegmentationCustom_post_process_mask = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageSegmentationCustomAdvanced_alpha_matting = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageSegmentationCustomAdvanced_post_process_mask = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageTransformCropCorners_top_left_corner = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageTransformCropCorners_top_right_corner = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageTransformCropCorners_bottom_right_corner = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageTransformCropCorners_bottom_left_corner = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageTransformRotate_expand = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASCreateGridImage_include_subfolders = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASImageCannyFilter_enable_threshold = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASImageDraganPhotographyFilter_colorize = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASImageGradientMap_flip_left_right = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASImageHighPassFilter_color_output = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASImageHighPassFilter_neutral_background = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASImagePadding_feather_second_pass = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASImageRembgRemoveBackground_transparency = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASImageResize_supersample = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASImageSave_lossless_webp = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASImageSave_show_history = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASImageSave_show_history_by_prefix = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASImageSave_embed_workflow = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASImageSeamlessTexture_tiled = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASLatentUpscaleByFactorWAS_align = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASMiDaSDepthApproximation_use_cpu = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASMiDaSDepthApproximation_invert_depth = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASMiDaSMaskImage_use_cpu = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASMiDaSMaskImage_threshold = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASNumberInputCondition_return_boolean = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASTextAddTokens_print_current_tokens = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASTextAddTokenByInput_print_current_tokens = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_WASTextConcatenate_linebreak_addition = Enum_ImageDrawRectangleRounded_top_left_corner
    export type Enum_ImageEffectsLensZoomBurst_method = 'circle' | 'point'
    export type Enum_ImageEffectsLensChromaticAberration_method = 'constant' | 'edge' | 'reflect'
    export type Enum_ImageTransformPaddingAbsolute_method = Enum_ImageEffectsLensChromaticAberration_method
    export type Enum_ImageTransformPaddingRelative_method = Enum_ImageEffectsLensChromaticAberration_method
    export type Enum_ImageEffectsLensChromaticAberration_transpose = 'none' | 'reflect' | 'rotate'
    export type Enum_ImageEffectsLensChromaticAberration_colors = 'gb' | 'rb' | 'rg'
    export type Enum_ImageEffectsLensBokeh_blur_type = 'bilateral' | 'none' | 'stack'
    export type Enum_ImageEffectsLensBokeh_method = 'dilate' | 'filter'
    export type Enum_ImageEffectsLensOpticAxis_lens_shape = 'circle' | 'corners' | 'rectangle' | 'square'
    export type Enum_ImageEffectsLensOpticAxis_lens_edge = 'around' | 'symmetric'
    export type Enum_ImageEffectsLensVignette_lens_edge = Enum_ImageEffectsLensOpticAxis_lens_edge
    export type Enum_ImageEffectsLensVignette_lens_shape = 'circle' | 'rectangle'
    export type Enum_ImageSegmentation_model =
        | 'isnet-general-use'
        | 'isnetis'
        | 'modnet-p'
        | 'modnet-w'
        | 'silueta'
        | 'u2net'
        | 'u2net_cloth_seg'
        | 'u2net_human_seg'
        | 'u2netp'
    export type Enum_ImageTextMultiline_align = 'center' | 'left' | 'right'
    export type Enum_ImageTextMultilineOutlined_align = Enum_ImageTextMultiline_align
    export type Enum_ImageTransformTranspose_method =
        | 'flip_horizontally'
        | 'flip_vertically'
        | 'rotate_180'
        | 'rotate_270'
        | 'rotate_90'
        | 'transpose'
        | 'transverse'
    export type Enum_ImpactSAMLoader_model_name = 'sam_vit_b_01ec64.pth' | 'sam_vit_h_4b8939.pth'
    export type Enum_ImpactMMDetDetectorProvider_model_name = 'bbox/mmdet_anime-face_yolov3.pth'
    export type Enum_ImpactMMDetLoader_model_name = Enum_ImpactMMDetDetectorProvider_model_name
    export type Enum_ImpactDetailerForEach_guide_size_for = 'bbox' | 'crop_region'
    export type Enum_ImpactDetailerForEachDebug_guide_size_for = Enum_ImpactDetailerForEach_guide_size_for
    export type Enum_ImpactDetailerForEachPipe_guide_size_for = Enum_ImpactDetailerForEach_guide_size_for
    export type Enum_ImpactDetailerForEachDebugPipe_guide_size_for = Enum_ImpactDetailerForEach_guide_size_for
    export type Enum_ImpactFaceDetailer_guide_size_for = Enum_ImpactDetailerForEach_guide_size_for
    export type Enum_ImpactFaceDetailerPipe_guide_size_for = Enum_ImpactDetailerForEach_guide_size_for
    export type Enum_ImpactSEGSDetailer_guide_size_for = Enum_ImpactDetailerForEach_guide_size_for
    export type Enum_ImpactDetailerForEach_noise_mask = 'disabled' | 'enabled'
    export type Enum_ImpactDetailerForEach_force_inpaint = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactDetailerForEachDebug_noise_mask = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactDetailerForEachDebug_force_inpaint = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactDetailerForEachPipe_noise_mask = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactDetailerForEachPipe_force_inpaint = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactDetailerForEachDebugPipe_noise_mask = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactDetailerForEachDebugPipe_force_inpaint = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactFaceDetailer_noise_mask = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactFaceDetailer_force_inpaint = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactFaceDetailerPipe_noise_mask = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactFaceDetailerPipe_force_inpaint = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactLatentPixelScale_use_tiled_vae = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactPixelKSampleUpscalerProvider_use_tiled_vae = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactPixelKSampleUpscalerProviderPipe_use_tiled_vae = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactTwoSamplersForMaskUpscalerProvider_use_tiled_vae = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_use_tiled_vae = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactMaskToSEGS_bbox_fill = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactSEGSDetailer_noise_mask = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactSEGSDetailer_force_inpaint = Enum_ImpactDetailerForEach_noise_mask
    export type Enum_ImpactSAMDetectorCombined_detection_hint =
        | 'center-1'
        | 'diamond-4'
        | 'horizontal-2'
        | 'mask-area'
        | 'mask-point-bbox'
        | 'mask-points'
        | 'none'
        | 'rect-4'
        | 'vertical-2'
    export type Enum_ImpactFaceDetailer_sam_detection_hint = Enum_ImpactSAMDetectorCombined_detection_hint
    export type Enum_ImpactFaceDetailerPipe_sam_detection_hint = Enum_ImpactSAMDetectorCombined_detection_hint
    export type Enum_ImpactSAMDetectorCombined_mask_hint_use_negative = 'False' | 'Outter' | 'Small'
    export type Enum_ImpactFaceDetailer_sam_mask_hint_use_negative = Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
    export type Enum_ImpactFaceDetailerPipe_sam_mask_hint_use_negative = Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
    export type Enum_ImpactLatentPixelScale_scale_method = 'area' | 'bilinear' | 'nearest-exact'
    export type Enum_ImpactPixelKSampleUpscalerProvider_scale_method = Enum_ImpactLatentPixelScale_scale_method
    export type Enum_ImpactPixelKSampleUpscalerProviderPipe_scale_method = Enum_ImpactLatentPixelScale_scale_method
    export type Enum_ImpactPixelTiledKSampleUpscalerProvider_scale_method = Enum_ImpactLatentPixelScale_scale_method
    export type Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_scale_method = Enum_ImpactLatentPixelScale_scale_method
    export type Enum_ImpactTwoSamplersForMaskUpscalerProvider_scale_method = Enum_ImpactLatentPixelScale_scale_method
    export type Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_scale_method = Enum_ImpactLatentPixelScale_scale_method
    export type Enum_ImageOverlay_resize_method = Enum_ImpactLatentPixelScale_scale_method
    export type Enum_LatentUpscaleMultiply_upscale_method = Enum_ImpactLatentPixelScale_scale_method
    export type Enum_ImpactPixelTiledKSampleUpscalerProvider_tiling_strategy = 'padded' | 'random' | 'simple'
    export type Enum_ImpactPixelTiledKSampleUpscalerProviderPipe_tiling_strategy =
        Enum_ImpactPixelTiledKSampleUpscalerProvider_tiling_strategy
    export type Enum_ImpactTiledKSamplerProvider_tiling_strategy = Enum_ImpactPixelTiledKSampleUpscalerProvider_tiling_strategy
    export type Enum_BNK_TiledKSamplerAdvanced_tiling_strategy = Enum_ImpactPixelTiledKSampleUpscalerProvider_tiling_strategy
    export type Enum_BNK_TiledKSampler_tiling_strategy = Enum_ImpactPixelTiledKSampleUpscalerProvider_tiling_strategy
    export type Enum_ImpactTwoSamplersForMaskUpscalerProvider_full_sample_schedule =
        | 'interleave1'
        | 'interleave1+last1'
        | 'interleave2'
        | 'interleave2+last1'
        | 'interleave3'
        | 'interleave3+last1'
        | 'last1'
        | 'last2'
        | 'none'
    export type Enum_ImpactTwoSamplersForMaskUpscalerProviderPipe_full_sample_schedule =
        Enum_ImpactTwoSamplersForMaskUpscalerProvider_full_sample_schedule
    export type Enum_ImpactDenoiseScheduleHookProvider_schedule_for_iteration = 'simple'
    export type Enum_ImpactCfgScheduleHookProvider_schedule_for_iteration =
        Enum_ImpactDenoiseScheduleHookProvider_schedule_for_iteration
    export type Enum_ImpactMaskToSEGS_combined = 'False' | 'True'
    export type Enum_XYPlot_XY_flip = Enum_ImpactMaskToSEGS_combined
    export type Enum_XYPlot_cache_models = Enum_ImpactMaskToSEGS_combined
    export type Enum_EvaluateIntegers_print_to_console = Enum_ImpactMaskToSEGS_combined
    export type Enum_EvaluateFloats_print_to_console = Enum_ImpactMaskToSEGS_combined
    export type Enum_EvaluateStrings_print_to_console = Enum_ImpactMaskToSEGS_combined
    export type Enum_WASImageSSAOAmbientOcclusion_enable_specular_masking = Enum_ImpactMaskToSEGS_combined
    export type Enum_WASImageSSDODirectOcclusion_colored_occlusion = Enum_ImpactMaskToSEGS_combined
    export type Enum_WASImagePixelate_dither = Enum_ImpactMaskToSEGS_combined
    export type Enum_WASImagePixelate_reverse_palette = Enum_ImpactMaskToSEGS_combined
    export type Enum_ImpactPreviewBridge_image = '#placeholder'
    export type Enum_ImpactMaskPainter_image = Enum_ImpactPreviewBridge_image
    export type Enum_ImpactImpactWildcardProcessor_mode = 'Fixed' | 'Populate'
    export type Enum_Save_as_webp_mode = 'lossless' | 'lossy'
    export type Enum_BNK_CutoffRegionsToConditioning_ADV_token_normalization = 'length' | 'length+mean' | 'mean' | 'none'
    export type Enum_BNK_CutoffRegionsToConditioning_ADV_weight_interpretation = 'A1111' | 'comfy' | 'comfy++' | 'compel'
    export type Enum_BNK_NoisyLatentImage_source = 'CPU' | 'GPU'
    export type Enum_ClipSeg_device = 'cpu' | 'cuda' | 'mps' | 'xpu'
    export type Enum_ClipSeg_mode = 'average' | 'sum'
    export type Enum_HEDPreprocessor_version = 'v1' | 'v1.1'
    export type Enum_OpenposePreprocessor_version = Enum_HEDPreprocessor_version
    export type Enum_KSamplerEfficient_sampler_state = 'Hold' | 'Sample' | 'Script'
    export type Enum_KSamplerEfficient_preview_image = 'Disabled' | 'Enabled' | 'Output Only'
    export type Enum_EfficientLoader_vae_name =
        | 'Baked VAE'
        | 'blessed2.vae.pt'
        | 'kl-f8-anime2.ckpt'
        | 'orangemix.vae.pt'
        | 'vae-ft-mse-840000-ema-pruned.safetensors'
    export type Enum_EfficientLoader_lora_name =
        | 'None'
        | 'animemix_16.safetensors'
        | 'animemix_v3_offset.safetensors'
        | 'chars\\dark_magician_girl.safetensors'
        | 'chars\\yorha_noDOT_2_type_b.safetensors'
        | 'colors\\LowRa.safetensors'
        | 'colors\\theovercomer8sContrastFix_sd15.safetensors'
        | 'colors\\theovercomer8sContrastFix_sd21768.safetensors'
        | 'styles\\ConstructionyardAIV3.safetensors'
        | 'styles\\StonepunkAI-000011.safetensors'
        | 'styles\\ToonYou_Style.safetensors'
        | 'styles\\baroqueAI.safetensors'
        | 'styles\\pixel_f2.safetensors'
        | 'test\\Moxin_10.safetensors'
        | 'test\\animeLineartMangaLike_v30MangaLike.safetensors'
        | 'utils\\charTurnBetaLora.safetensors'
    export type Enum_XYInputLoRA_lora_name_1 = Enum_EfficientLoader_lora_name
    export type Enum_XYInputLoRA_lora_name_2 = Enum_EfficientLoader_lora_name
    export type Enum_XYInputLoRA_lora_name_3 = Enum_EfficientLoader_lora_name
    export type Enum_XYInputLoRA_lora_name_4 = Enum_EfficientLoader_lora_name
    export type Enum_XYInputLoRA_lora_name_5 = Enum_EfficientLoader_lora_name
    export type Enum_XYInputLoRAAdvanced_lora_name_1 = Enum_EfficientLoader_lora_name
    export type Enum_XYInputLoRAAdvanced_lora_name_2 = Enum_EfficientLoader_lora_name
    export type Enum_XYInputLoRAAdvanced_lora_name_3 = Enum_EfficientLoader_lora_name
    export type Enum_XYInputLoRAAdvanced_lora_name_4 = Enum_EfficientLoader_lora_name
    export type Enum_XYInputLoRAAdvanced_lora_name_5 = Enum_EfficientLoader_lora_name
    export type Enum_WASLoraLoader_lora_name = Enum_EfficientLoader_lora_name
    export type Enum_WASLoadLora_lora_name = Enum_EfficientLoader_lora_name
    export type Enum_XYPlot_Y_label_orientation = 'Horizontal' | 'Vertical'
    export type Enum_XYPlot_ksampler_output_image = 'Images' | 'Plot'
    export type Enum_XYInputSampler_sampler_1 =
        | 'None'
        | 'ddim'
        | 'dpm_2'
        | 'dpm_2_ancestral'
        | 'dpm_adaptive'
        | 'dpm_fast'
        | 'dpmpp_2m'
        | 'dpmpp_2m_sde'
        | 'dpmpp_2s_ancestral'
        | 'dpmpp_sde'
        | 'euler'
        | 'euler_ancestral'
        | 'heun'
        | 'lms'
        | 'uni_pc'
        | 'uni_pc_bh2'
    export type Enum_XYInputSampler_sampler_2 = Enum_XYInputSampler_sampler_1
    export type Enum_XYInputSampler_sampler_3 = Enum_XYInputSampler_sampler_1
    export type Enum_XYInputSampler_sampler_4 = Enum_XYInputSampler_sampler_1
    export type Enum_XYInputSampler_sampler_5 = Enum_XYInputSampler_sampler_1
    export type Enum_XYInputSampler_scheduler_1 = 'None' | 'ddim_uniform' | 'exponential' | 'karras' | 'normal' | 'simple'
    export type Enum_XYInputSampler_scheduler_2 = Enum_XYInputSampler_scheduler_1
    export type Enum_XYInputSampler_scheduler_3 = Enum_XYInputSampler_scheduler_1
    export type Enum_XYInputSampler_scheduler_4 = Enum_XYInputSampler_scheduler_1
    export type Enum_XYInputSampler_scheduler_5 = Enum_XYInputSampler_scheduler_1
    export type Enum_XYInputScheduler_scheduler_1 = Enum_XYInputSampler_scheduler_1
    export type Enum_XYInputScheduler_scheduler_2 = Enum_XYInputSampler_scheduler_1
    export type Enum_XYInputScheduler_scheduler_3 = Enum_XYInputSampler_scheduler_1
    export type Enum_XYInputScheduler_scheduler_4 = Enum_XYInputSampler_scheduler_1
    export type Enum_XYInputScheduler_scheduler_5 = Enum_XYInputSampler_scheduler_1
    export type Enum_XYInputVAE_vae_name_1 =
        | 'None'
        | 'blessed2.vae.pt'
        | 'kl-f8-anime2.ckpt'
        | 'orangemix.vae.pt'
        | 'vae-ft-mse-840000-ema-pruned.safetensors'
    export type Enum_XYInputVAE_vae_name_2 = Enum_XYInputVAE_vae_name_1
    export type Enum_XYInputVAE_vae_name_3 = Enum_XYInputVAE_vae_name_1
    export type Enum_XYInputVAE_vae_name_4 = Enum_XYInputVAE_vae_name_1
    export type Enum_XYInputVAE_vae_name_5 = Enum_XYInputVAE_vae_name_1
    export type Enum_XYInputCheckpoint_ckpt_name_1 =
        | 'AOM3A1_orangemixs.safetensors'
        | 'AOM3A3_orangemixs.safetensors'
        | 'AbyssOrangeMix2_hard.safetensors'
        | 'Deliberate-inpainting.safetensors'
        | 'None'
        | 'angel1_36224.safetensors'
        | 'anything-v3-fp16-pruned.safetensors'
        | 'deliberate_v2.safetensors'
        | 'ghostmix_v12.safetensors'
        | 'lyriel_v15.safetensors'
        | 'mistoonAnime_v10.safetensors'
        | 'mistoonAnime_v10Inpainting.safetensors'
        | 'realisticVisionV20_v20.safetensors'
        | 'revAnimated_v121.safetensors'
        | 'revAnimated_v121Inp-inpainting.safetensors'
        | 'revAnimated_v122.safetensors'
        | 'toonyou_beta1.safetensors'
        | 'v1-5-pruned-emaonly.ckpt'
        | 'v2-1_512-ema-pruned.safetensors'
        | 'v2-1_768-ema-pruned.safetensors'
        | 'wd-1-5-beta2-fp16.safetensors'
    export type Enum_XYInputCheckpoint_ckpt_name_2 = Enum_XYInputCheckpoint_ckpt_name_1
    export type Enum_XYInputCheckpoint_ckpt_name_3 = Enum_XYInputCheckpoint_ckpt_name_1
    export type Enum_XYInputCheckpoint_ckpt_name_4 = Enum_XYInputCheckpoint_ckpt_name_1
    export type Enum_XYInputCheckpoint_ckpt_name_5 = Enum_XYInputCheckpoint_ckpt_name_1
    export type Enum_XYInputManualXYEntry_X_type =
        | 'CFG Scale'
        | 'Checkpoint'
        | 'Clip Skip'
        | 'Denoise'
        | 'LoRA'
        | 'Negative Prompt S/R'
        | 'Nothing'
        | 'Positive Prompt S/R'
        | 'Sampler'
        | 'Scheduler'
        | 'Seeds++ Batch'
        | 'Steps'
        | 'VAE'
    export type Enum_XYInputManualXYEntry_Y_type = Enum_XYInputManualXYEntry_X_type
    export type Enum_ImageOverlay_overlay_resize = 'Fit' | 'None' | 'Resize by rescale_factor' | 'Resize to width & heigth'
    export type Enum_WASImageFlip_mode = 'horizontal' | 'vertical'
    export type Enum_WASImageGenerateGradient_direction = Enum_WASImageFlip_mode
    export type Enum_MasqueradeMaskByText_normalize = 'no' | 'yes'
    export type Enum_MasqueradeCombineMasks_clamp_result = Enum_MasqueradeMaskByText_normalize
    export type Enum_MasqueradeCombineMasks_round_result = Enum_MasqueradeMaskByText_normalize
    export type Enum_MasqueradeMaskMorphology_op = 'close' | 'dilate' | 'erode' | 'open'
    export type Enum_MasqueradeCombineMasks_op =
        | 'add'
        | 'difference'
        | 'greater'
        | 'greater_or_equal'
        | 'intersection (min)'
        | 'multiply'
        | 'multiply_alpha'
        | 'union (max)'
    export type Enum_MasqueradeUnaryMaskOp_op = 'average' | 'clamp' | 'invert' | 'round'
    export type Enum_MasqueradeImageToMask_method = 'alpha' | 'intensity'
    export type Enum_MasqueradeMaskToRegion_constraints = 'ignore' | 'keep_ratio' | 'keep_ratio_divisible' | 'multiple_of'
    export type Enum_MasqueradeMaskToRegion_batch_behavior = 'match_ratio' | 'match_size'
    export type Enum_MasqueradePasteByMask_resize_behavior =
        | 'keep_ratio_fill'
        | 'keep_ratio_fit'
        | 'resize'
        | 'source_size'
        | 'source_size_unmasked'
    export type Enum_MasqueradeChangeChannelCount_kind = 'RGB' | 'RGBA' | 'mask'
    export type Enum_MasqueradeCreateRectMask_mode = 'percent' | 'pixels'
    export type Enum_MasqueradeCreateRectMask_origin = 'bottomleft' | 'bottomright' | 'topleft' | 'topright'
    export type Enum_WASBLIPModelLoader_blip_model = 'caption' | 'interrogate'
    export type Enum_WASBLIPAnalyzeImage_mode = Enum_WASBLIPModelLoader_blip_model
    export type Enum_WASCLIPTextEncodeNSP_mode = 'Noodle Soup Prompts' | 'Wildcards'
    export type Enum_WASTextParseNoodleSoupPrompts_mode = Enum_WASCLIPTextEncodeNSP_mode
    export type Enum_WASConstantNumber_number_type = 'bool' | 'float' | 'integer'
    export type Enum_WASRandomNumber_number_type = Enum_WASConstantNumber_number_type
    export type Enum_WASCreateMorphImage_filetype = 'APNG' | 'GIF'
    export type Enum_WASCreateMorphImageFromPath_filetype = Enum_WASCreateMorphImage_filetype
    export type Enum_WASCreateVideoFromPath_codec = 'AVC1' | 'FFV1' | 'H264' | 'MP4V'
    export type Enum_WASWriteToVideo_codec = Enum_WASCreateVideoFromPath_codec
    export type Enum_WASExportAPI_save_prompt_api = 'true' | 'true'
    export type Enum_WASImageAnalyze_mode = 'Black White Levels' | 'RGB Levels'
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
    export type Enum_WASImageColorPalette_mode = 'Chart' | 'back_to_back'
    export type Enum_WASImageCropFace_cascade_xml =
        | 'haarcascade_frontalface_alt.xml'
        | 'haarcascade_frontalface_alt2.xml'
        | 'haarcascade_frontalface_alt_tree.xml'
        | 'haarcascade_frontalface_default.xml'
        | 'haarcascade_profileface.xml'
        | 'haarcascade_upperbody.xml'
        | 'lbpcascade_animeface.xml'
    export type Enum_WASImagePixelate_init_mode = 'k-means++' | 'none' | 'random'
    export type Enum_WASImagePixelate_dither_mode = 'FloydSteinberg' | 'Ordered'
    export type Enum_WASImagePixelate_color_palette_mode = 'Brightness' | 'BrightnessAndTonal' | 'Linear' | 'Tonal'
    export type Enum_WASImagePowerNoise_noise_type = 'blue' | 'green' | 'grey' | 'mix' | 'pink' | 'white'
    export type Enum_WASImageEdgeDetectionFilter_mode = 'laplacian' | 'normal'
    export type Enum_WASImageHistoryLoader_image =
        | '...\\cache\\outputs'
        | '...\\output\\ComfyUI_03515_.png'
        | '...\\output\\ComfyUI_03518_.png'
        | '...\\output\\ComfyUI_03522_.png'
        | '...\\output\\ComfyUI_03524_.png'
        | '...\\output\\ComfyUI_03527_.png'
        | '...\\output\\ComfyUI_03530_.png'
        | '...\\output\\ComfyUI_03533_.png'
        | '...\\output\\ComfyUI_03536_.png'
        | '...\\output\\ComfyUI_03539_.png'
        | '...\\output\\ComfyUI_03542_.png'
        | '...\\output\\ComfyUI_03547_.png'
        | '...\\output\\ComfyUI_03550_.png'
        | '...\\output\\ComfyUI_03553_.png'
        | '...\\output\\ComfyUI_03556_.png'
        | '...\\output\\ComfyUI_03559_.png'
        | '...\\output\\ComfyUI_03564_.png'
        | '...\\output\\ComfyUI_03569_.png'
        | '...\\output\\ComfyUI_03580_.png'
        | '...\\output\\ComfyUI_03591_.png'
        | '...\\output\\ComfyUI_03602_.png'
        | '...\\output\\ComfyUI_03613_.png'
        | '...\\output\\ComfyUI_03624_.png'
        | '...\\output\\ComfyUI_03635_.png'
        | '...\\output\\ComfyUI_03643_.png'
        | '...\\output\\ComfyUI_03651_.png'
        | '...\\output\\ComfyUI_03659_.png'
        | '...\\output\\ComfyUI_03668_.png'
        | '...\\output\\ComfyUI_03676_.png'
        | '...\\output\\ComfyUI_03684_.png'
        | '...\\output\\ComfyUI_03715_.png'
        | '...\\output\\ComfyUI_03792_.png'
    export type Enum_WASImageMonitorEffectsFilter_mode = 'Digital Distortion' | 'Signal Distortion' | 'TV Distortion'
    export type Enum_WASImageRemoveBackgroundAlpha_mode = 'background' | 'foreground'
    export type Enum_WASImageResize_mode = 'rescale' | 'resize'
    export type Enum_WASImageResize_resampling = 'bicubic' | 'bilinear' | 'lanczos' | 'nearest'
    export type Enum_WASKSamplerCycle_scale_sampling = Enum_WASImageResize_resampling
    export type Enum_WASImageRotate_mode = 'internal' | 'transpose'
    export type Enum_WASImageRotate_sampler = 'bicubic' | 'bilinear' | 'nearest'
    export type Enum_WASImageSave_extension = 'gif' | 'jpeg' | 'png' | 'tiff' | 'webp'
    export type Enum_WASImageSave_overwrite_mode = 'false' | 'prefix_as_filename'
    export type Enum_WASImageStitch_stitch = 'bottom' | 'left' | 'right' | 'top'
    export type Enum_WASImageStyleFilter_style =
        | '1977'
        | 'aden'
        | 'brannan'
        | 'brooklyn'
        | 'clarendon'
        | 'earlybird'
        | 'fairy tale'
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
        | 'sci-fi'
        | 'slumber'
        | 'stinson'
        | 'toaster'
        | 'valencia'
        | 'walden'
        | 'willow'
        | 'xpro2'
    export type Enum_WASImageFDOFFilter_mode = 'box' | 'gaussian' | 'mock'
    export type Enum_WASImageToNoise_output_mode = 'batch' | 'list'
    export type Enum_WASLatentUpscaleByFactorWAS_mode = 'area' | 'bicubic' | 'bilinear' | 'nearest'
    export type Enum_WASLoadImageBatch_mode = 'incremental_image' | 'single_image'
    export type Enum_WASMaskCropRegion_region_type = 'dominant' | 'minority'
    export type Enum_WASMiDaSModelLoader_midas_model = 'DPT_Hybrid' | 'DPT_Large'
    export type Enum_WASMiDaSDepthApproximation_midas_type = Enum_WASMiDaSModelLoader_midas_model
    export type Enum_WASMiDaSMaskImage_midas_model = 'DPT_Hybrid' | 'DPT_Large' | 'DPT_Small'
    export type Enum_WASMiDaSMaskImage_remove = 'background' | 'foregroud'
    export type Enum_WASNumberOperation_operation =
        | 'addition'
        | 'division'
        | 'does not equal'
        | 'equals'
        | 'exponentiation'
        | 'floor division'
        | 'greater-than'
        | 'greater-than or equals'
        | 'less-than'
        | 'less-than or equals'
        | 'modulus'
        | 'multiplication'
        | 'subtraction'
    export type Enum_WASNumberInputCondition_comparison =
        | 'and'
        | 'divisible by'
        | 'does not equal'
        | 'equals'
        | 'factor of'
        | 'greater-than'
        | 'greater-than or equals'
        | 'if A even'
        | 'if A odd'
        | 'if A prime'
        | 'less-than'
        | 'less-than or equals'
        | 'or'
    export type Enum_WASPromptStylesSelector_style = 'None'
    export type Enum_WASSAMModelLoader_model_size = 'ViT-B (636M)' | 'ViT-H (91M)' | 'ViT-L (308M)'
    export type Enum_WASTextCompare_mode = 'difference' | 'similarity'
    export type Enum_WASTextFileHistoryLoader_file = 'No History'
    export type Enum_WASTextLoadLineFromFile_mode = 'automatic' | 'index'
    export type Enum_WASVideoDumpFrames_extension = 'gif' | 'jpg' | 'png' | 'tiff'

    // INTERFACES --------------------------
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
    export interface HasSingle_SAM_MODEL { _SAM_MODEL: SAM_MODEL } // prettier-ignore
    export interface HasSingle_BBOX_DETECTOR { _BBOX_DETECTOR: BBOX_DETECTOR } // prettier-ignore
    export interface HasSingle_SEGM_DETECTOR { _SEGM_DETECTOR: SEGM_DETECTOR } // prettier-ignore
    export interface HasSingle_ONNX_DETECTOR { _ONNX_DETECTOR: ONNX_DETECTOR } // prettier-ignore
    export interface HasSingle_SEGS { _SEGS: SEGS } // prettier-ignore
    export interface HasSingle_BASIC_PIPE { _BASIC_PIPE: BASIC_PIPE } // prettier-ignore
    export interface HasSingle_DETAILER_PIPE { _DETAILER_PIPE: DETAILER_PIPE } // prettier-ignore
    export interface HasSingle_UPSCALER { _UPSCALER: UPSCALER } // prettier-ignore
    export interface HasSingle_PK_HOOK { _PK_HOOK: PK_HOOK } // prettier-ignore
    export interface HasSingle_KSAMPLER { _KSAMPLER: KSAMPLER } // prettier-ignore
    export interface HasSingle_BBOX_MODEL { _BBOX_MODEL: BBOX_MODEL } // prettier-ignore
    export interface HasSingle_SEGM_MODEL { _SEGM_MODEL: SEGM_MODEL } // prettier-ignore
    export interface HasSingle_CLIPREGION { _CLIPREGION: CLIPREGION } // prettier-ignore
    export interface HasSingle_SCRIPT { _SCRIPT: SCRIPT } // prettier-ignore
    export interface HasSingle_DEPENDENCIES { _DEPENDENCIES: DEPENDENCIES } // prettier-ignore
    export interface HasSingle_XY { _XY: XY } // prettier-ignore
    export interface HasSingle_MASK_MAPPING { _MASK_MAPPING: MASK_MAPPING } // prettier-ignore
    export interface HasSingle_BLIP_MODEL { _BLIP_MODEL: BLIP_MODEL } // prettier-ignore
    export interface HasSingle_ASCII { _ASCII: ASCII } // prettier-ignore
    export interface HasSingle_NUMBER { _NUMBER: NUMBER } // prettier-ignore
    export interface HasSingle_CLIPSEG_MODEL { _CLIPSEG_MODEL: CLIPSEG_MODEL } // prettier-ignore
    export interface HasSingle_DICT { _DICT: DICT } // prettier-ignore
    export interface HasSingle_LIST { _LIST: LIST } // prettier-ignore
    export interface HasSingle_CROP_DATA { _CROP_DATA: CROP_DATA } // prettier-ignore
    export interface HasSingle_SEED { _SEED: SEED } // prettier-ignore
    export interface HasSingle_MIDAS_MODEL { _MIDAS_MODEL: MIDAS_MODEL } // prettier-ignore
    export interface HasSingle_SAM_PARAMETERS { _SAM_PARAMETERS: SAM_PARAMETERS } // prettier-ignore
    export interface HasSingle_IMAGE_BOUNDS { _IMAGE_BOUNDS: IMAGE_BOUNDS } // prettier-ignore

    // NODES -------------------------------
    // |=============================================================================|
    // | KSampler [sampling]                                                         |
    // |=============================================================================|
    export interface KSampler extends HasSingle_LATENT, ComfyNode<KSampler_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type KSampler_input = {
        model: _MODEL
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        positive: _CONDITIONING
        negative: _CONDITIONING
        latent_image: _LATENT
        /** default=1 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
    }

    // |=============================================================================|
    // | CheckpointLoaderSimple [loaders]                                            |
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
        ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
    }

    // |=============================================================================|
    // | CLIPTextEncode [conditioning]                                               |
    // |=============================================================================|
    export interface CLIPTextEncode extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncode_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type CLIPTextEncode_input = {
        /** */
        text: _STRING
        clip: _CLIP
    }

    // |=============================================================================|
    // | CLIPSetLastLayer [conditioning]                                             |
    // |=============================================================================|
    export interface CLIPSetLastLayer extends HasSingle_CLIP, ComfyNode<CLIPSetLastLayer_input> {
        CLIP: Slot<'CLIP', 0>
    }
    export type CLIPSetLastLayer_input = {
        clip: _CLIP
        /** default=-1 min=-1 max=-1 step=1 */
        stop_at_clip_layer?: _INT
    }

    // |=============================================================================|
    // | VAEDecode [latent]                                                          |
    // |=============================================================================|
    export interface VAEDecode extends HasSingle_IMAGE, ComfyNode<VAEDecode_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type VAEDecode_input = {
        samples: _LATENT
        vae: _VAE
    }

    // |=============================================================================|
    // | VAEEncode [latent]                                                          |
    // |=============================================================================|
    export interface VAEEncode extends HasSingle_LATENT, ComfyNode<VAEEncode_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type VAEEncode_input = {
        pixels: _IMAGE
        vae: _VAE
    }

    // |=============================================================================|
    // | VAEEncodeForInpaint [latent_inpaint]                                        |
    // |=============================================================================|
    export interface VAEEncodeForInpaint extends HasSingle_LATENT, ComfyNode<VAEEncodeForInpaint_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type VAEEncodeForInpaint_input = {
        pixels: _IMAGE
        vae: _VAE
        mask: _MASK
        /** default=6 min=64 max=64 step=1 */
        grow_mask_by?: _INT
    }

    // |=============================================================================|
    // | VAELoader [loaders]                                                         |
    // |=============================================================================|
    export interface VAELoader extends HasSingle_VAE, ComfyNode<VAELoader_input> {
        VAE: Slot<'VAE', 0>
    }
    export type VAELoader_input = {
        vae_name: Enum_VAELoader_vae_name
    }

    // |=============================================================================|
    // | EmptyLatentImage [latent]                                                   |
    // |=============================================================================|
    export interface EmptyLatentImage extends HasSingle_LATENT, ComfyNode<EmptyLatentImage_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type EmptyLatentImage_input = {
        /** default=512 min=8192 max=8192 step=8 */
        width?: _INT
        /** default=512 min=8192 max=8192 step=8 */
        height?: _INT
        /** default=1 min=64 max=64 */
        batch_size?: _INT
    }

    // |=============================================================================|
    // | LatentUpscale [latent]                                                      |
    // |=============================================================================|
    export interface LatentUpscale extends HasSingle_LATENT, ComfyNode<LatentUpscale_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type LatentUpscale_input = {
        samples: _LATENT
        upscale_method: Enum_LatentUpscale_upscale_method
        /** default=512 min=8192 max=8192 step=8 */
        width?: _INT
        /** default=512 min=8192 max=8192 step=8 */
        height?: _INT
        crop: Enum_LatentUpscale_crop
    }

    // |=============================================================================|
    // | LatentUpscaleBy [latent]                                                    |
    // |=============================================================================|
    export interface LatentUpscaleBy extends HasSingle_LATENT, ComfyNode<LatentUpscaleBy_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type LatentUpscaleBy_input = {
        samples: _LATENT
        upscale_method: Enum_LatentUpscale_upscale_method
        /** default=1.5 min=8 max=8 step=0.01 */
        scale_by?: _FLOAT
    }

    // |=============================================================================|
    // | LatentFromBatch [latent_batch]                                              |
    // |=============================================================================|
    export interface LatentFromBatch extends HasSingle_LATENT, ComfyNode<LatentFromBatch_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type LatentFromBatch_input = {
        samples: _LATENT
        /** default=0 min=63 max=63 */
        batch_index?: _INT
        /** default=1 min=64 max=64 */
        length?: _INT
    }

    // |=============================================================================|
    // | RepeatLatentBatch [latent_batch]                                            |
    // |=============================================================================|
    export interface RepeatLatentBatch extends HasSingle_LATENT, ComfyNode<RepeatLatentBatch_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type RepeatLatentBatch_input = {
        samples: _LATENT
        /** default=1 min=64 max=64 */
        amount?: _INT
    }

    // |=============================================================================|
    // | SaveImage [image]                                                           |
    // |=============================================================================|
    export interface SaveImage extends ComfyNode<SaveImage_input> {}
    export type SaveImage_input = {
        images: _IMAGE
        /** default="ComfyUI" */
        filename_prefix?: _STRING
    }

    // |=============================================================================|
    // | PreviewImage [image]                                                        |
    // |=============================================================================|
    export interface PreviewImage extends ComfyNode<PreviewImage_input> {}
    export type PreviewImage_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | LoadImage [image]                                                           |
    // |=============================================================================|
    export interface LoadImage extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<LoadImage_input> {
        IMAGE: Slot<'IMAGE', 0>
        MASK: Slot<'MASK', 1>
    }
    export type LoadImage_input = {
        image: Enum_LoadImage_image
    }

    // |=============================================================================|
    // | LoadImageMask [mask]                                                        |
    // |=============================================================================|
    export interface LoadImageMask extends HasSingle_MASK, ComfyNode<LoadImageMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type LoadImageMask_input = {
        image: Enum_LoadImage_image
        channel: Enum_LoadImageMask_channel
    }

    // |=============================================================================|
    // | ImagePadForOutpaint [image]                                                 |
    // |=============================================================================|
    export interface ImagePadForOutpaint extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImagePadForOutpaint_input> {
        IMAGE: Slot<'IMAGE', 0>
        MASK: Slot<'MASK', 1>
    }
    export type ImagePadForOutpaint_input = {
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

    // |=============================================================================|
    // | ConditioningAverage ("ConditioningAverage " in ComfyUI) [conditioning]      |
    // |=============================================================================|
    export interface ConditioningAverage extends HasSingle_CONDITIONING, ComfyNode<ConditioningAverage_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type ConditioningAverage_input = {
        conditioning_to: _CONDITIONING
        conditioning_from: _CONDITIONING
        /** default=1 min=1 max=1 step=0.01 */
        conditioning_to_strength?: _FLOAT
    }

    // |=============================================================================|
    // | ConditioningCombine [conditioning]                                          |
    // |=============================================================================|
    export interface ConditioningCombine extends HasSingle_CONDITIONING, ComfyNode<ConditioningCombine_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type ConditioningCombine_input = {
        conditioning_1: _CONDITIONING
        conditioning_2: _CONDITIONING
    }

    // |=============================================================================|
    // | ConditioningSetArea [conditioning]                                          |
    // |=============================================================================|
    export interface ConditioningSetArea extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetArea_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type ConditioningSetArea_input = {
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

    // |=============================================================================|
    // | ConditioningSetMask [conditioning]                                          |
    // |=============================================================================|
    export interface ConditioningSetMask extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetMask_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type ConditioningSetMask_input = {
        conditioning: _CONDITIONING
        mask: _MASK
        /** default=1 min=10 max=10 step=0.01 */
        strength?: _FLOAT
        set_cond_area: Enum_ConditioningSetMask_set_cond_area
    }

    // |=============================================================================|
    // | KSamplerAdvanced [sampling]                                                 |
    // |=============================================================================|
    export interface KSamplerAdvanced extends HasSingle_LATENT, ComfyNode<KSamplerAdvanced_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type KSamplerAdvanced_input = {
        model: _MODEL
        add_noise: Enum_KSamplerAdvanced_add_noise
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        noise_seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        positive: _CONDITIONING
        negative: _CONDITIONING
        latent_image: _LATENT
        /** default=0 min=10000 max=10000 */
        start_at_step?: _INT
        /** default=10000 min=10000 max=10000 */
        end_at_step?: _INT
        return_with_leftover_noise: Enum_KSamplerAdvanced_add_noise
    }

    // |=============================================================================|
    // | SetLatentNoiseMask [latent_inpaint]                                         |
    // |=============================================================================|
    export interface SetLatentNoiseMask extends HasSingle_LATENT, ComfyNode<SetLatentNoiseMask_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type SetLatentNoiseMask_input = {
        samples: _LATENT
        mask: _MASK
    }

    // |=============================================================================|
    // | LatentComposite [latent]                                                    |
    // |=============================================================================|
    export interface LatentComposite extends HasSingle_LATENT, ComfyNode<LatentComposite_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type LatentComposite_input = {
        samples_to: _LATENT
        samples_from: _LATENT
        /** default=0 min=8192 max=8192 step=8 */
        x?: _INT
        /** default=0 min=8192 max=8192 step=8 */
        y?: _INT
        /** default=0 min=8192 max=8192 step=8 */
        feather?: _INT
    }

    // |=============================================================================|
    // | LatentRotate [latent_transform]                                             |
    // |=============================================================================|
    export interface LatentRotate extends HasSingle_LATENT, ComfyNode<LatentRotate_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type LatentRotate_input = {
        samples: _LATENT
        rotation: Enum_LatentRotate_rotation
    }

    // |=============================================================================|
    // | LatentFlip [latent_transform]                                               |
    // |=============================================================================|
    export interface LatentFlip extends HasSingle_LATENT, ComfyNode<LatentFlip_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type LatentFlip_input = {
        samples: _LATENT
        flip_method: Enum_LatentFlip_flip_method
    }

    // |=============================================================================|
    // | LatentCrop [latent_transform]                                               |
    // |=============================================================================|
    export interface LatentCrop extends HasSingle_LATENT, ComfyNode<LatentCrop_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type LatentCrop_input = {
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

    // |=============================================================================|
    // | LoraLoader [loaders]                                                        |
    // |=============================================================================|
    export interface LoraLoader extends HasSingle_MODEL, HasSingle_CLIP, ComfyNode<LoraLoader_input> {
        MODEL: Slot<'MODEL', 0>
        CLIP: Slot<'CLIP', 1>
    }
    export type LoraLoader_input = {
        model: _MODEL
        clip: _CLIP
        lora_name: Enum_LoraLoader_lora_name
        /** default=1 min=10 max=10 step=0.01 */
        strength_model?: _FLOAT
        /** default=1 min=10 max=10 step=0.01 */
        strength_clip?: _FLOAT
    }

    // |=============================================================================|
    // | CLIPLoader [advanced_loaders]                                               |
    // |=============================================================================|
    export interface CLIPLoader extends HasSingle_CLIP, ComfyNode<CLIPLoader_input> {
        CLIP: Slot<'CLIP', 0>
    }
    export type CLIPLoader_input = {
        clip_name: Enum_CLIPLoader_clip_name
    }

    // |=============================================================================|
    // | DualCLIPLoader [advanced_loaders]                                           |
    // |=============================================================================|
    export interface DualCLIPLoader extends HasSingle_CLIP, ComfyNode<DualCLIPLoader_input> {
        CLIP: Slot<'CLIP', 0>
    }
    export type DualCLIPLoader_input = {
        clip_name1: Enum_CLIPLoader_clip_name
        clip_name2: Enum_CLIPLoader_clip_name
    }

    // |=============================================================================|
    // | CLIPVisionEncode [conditioning]                                             |
    // |=============================================================================|
    export interface CLIPVisionEncode extends HasSingle_CLIP_VISION_OUTPUT, ComfyNode<CLIPVisionEncode_input> {
        CLIP_VISION_OUTPUT: Slot<'CLIP_VISION_OUTPUT', 0>
    }
    export type CLIPVisionEncode_input = {
        clip_vision: _CLIP_VISION
        image: _IMAGE
    }

    // |=============================================================================|
    // | StyleModelApply [conditioning_style_model]                                  |
    // |=============================================================================|
    export interface StyleModelApply extends HasSingle_CONDITIONING, ComfyNode<StyleModelApply_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type StyleModelApply_input = {
        conditioning: _CONDITIONING
        style_model: _STYLE_MODEL
        clip_vision_output: _CLIP_VISION_OUTPUT
    }

    // |=============================================================================|
    // | UnCLIPConditioning ("unCLIPConditioning" in ComfyUI) [conditioning]         |
    // |=============================================================================|
    export interface UnCLIPConditioning extends HasSingle_CONDITIONING, ComfyNode<UnCLIPConditioning_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type UnCLIPConditioning_input = {
        conditioning: _CONDITIONING
        clip_vision_output: _CLIP_VISION_OUTPUT
        /** default=1 min=10 max=10 step=0.01 */
        strength?: _FLOAT
        /** default=0 min=1 max=1 step=0.01 */
        noise_augmentation?: _FLOAT
    }

    // |=============================================================================|
    // | ControlNetApply [conditioning]                                              |
    // |=============================================================================|
    export interface ControlNetApply extends HasSingle_CONDITIONING, ComfyNode<ControlNetApply_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type ControlNetApply_input = {
        conditioning: _CONDITIONING
        control_net: _CONTROL_NET
        image: _IMAGE
        /** default=1 min=10 max=10 step=0.01 */
        strength?: _FLOAT
    }

    // |=============================================================================|
    // | ControlNetLoader [loaders]                                                  |
    // |=============================================================================|
    export interface ControlNetLoader extends HasSingle_CONTROL_NET, ComfyNode<ControlNetLoader_input> {
        CONTROL_NET: Slot<'CONTROL_NET', 0>
    }
    export type ControlNetLoader_input = {
        control_net_name: Enum_ControlNetLoader_control_net_name
    }

    // |=============================================================================|
    // | DiffControlNetLoader [loaders]                                              |
    // |=============================================================================|
    export interface DiffControlNetLoader extends HasSingle_CONTROL_NET, ComfyNode<DiffControlNetLoader_input> {
        CONTROL_NET: Slot<'CONTROL_NET', 0>
    }
    export type DiffControlNetLoader_input = {
        model: _MODEL
        control_net_name: Enum_ControlNetLoader_control_net_name
    }

    // |=============================================================================|
    // | StyleModelLoader [loaders]                                                  |
    // |=============================================================================|
    export interface StyleModelLoader extends HasSingle_STYLE_MODEL, ComfyNode<StyleModelLoader_input> {
        STYLE_MODEL: Slot<'STYLE_MODEL', 0>
    }
    export type StyleModelLoader_input = {
        style_model_name: Enum_StyleModelLoader_style_model_name
    }

    // |=============================================================================|
    // | CLIPVisionLoader [loaders]                                                  |
    // |=============================================================================|
    export interface CLIPVisionLoader extends HasSingle_CLIP_VISION, ComfyNode<CLIPVisionLoader_input> {
        CLIP_VISION: Slot<'CLIP_VISION', 0>
    }
    export type CLIPVisionLoader_input = {
        clip_name: Enum_CLIPVisionLoader_clip_name
    }

    // |=============================================================================|
    // | VAEDecodeTiled [latent]                                                     |
    // |=============================================================================|
    export interface VAEDecodeTiled extends HasSingle_IMAGE, ComfyNode<VAEDecodeTiled_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type VAEDecodeTiled_input = {
        samples: _LATENT
        vae: _VAE
    }

    // |=============================================================================|
    // | VAEEncodeTiled [latent]                                                     |
    // |=============================================================================|
    export interface VAEEncodeTiled extends HasSingle_LATENT, ComfyNode<VAEEncodeTiled_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type VAEEncodeTiled_input = {
        pixels: _IMAGE
        vae: _VAE
    }

    // |=============================================================================|
    // | UnCLIPCheckpointLoader ("unCLIPCheckpointLoader" in ComfyUI) [loaders]      |
    // |=============================================================================|
    export interface UnCLIPCheckpointLoader
        extends HasSingle_MODEL,
            HasSingle_CLIP,
            HasSingle_VAE,
            HasSingle_CLIP_VISION,
            ComfyNode<UnCLIPCheckpointLoader_input> {
        MODEL: Slot<'MODEL', 0>
        CLIP: Slot<'CLIP', 1>
        VAE: Slot<'VAE', 2>
        CLIP_VISION: Slot<'CLIP_VISION', 3>
    }
    export type UnCLIPCheckpointLoader_input = {
        ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
    }

    // |=============================================================================|
    // | GLIGENLoader [loaders]                                                      |
    // |=============================================================================|
    export interface GLIGENLoader extends HasSingle_GLIGEN, ComfyNode<GLIGENLoader_input> {
        GLIGEN: Slot<'GLIGEN', 0>
    }
    export type GLIGENLoader_input = {
        gligen_name: Enum_CLIPLoader_clip_name
    }

    // |=============================================================================|
    // | GLIGENTextBoxApply [conditioning_gligen]                                    |
    // |=============================================================================|
    export interface GLIGENTextBoxApply extends HasSingle_CONDITIONING, ComfyNode<GLIGENTextBoxApply_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type GLIGENTextBoxApply_input = {
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

    // |=============================================================================|
    // | CheckpointLoader [advanced_loaders]                                         |
    // |=============================================================================|
    export interface CheckpointLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<CheckpointLoader_input> {
        MODEL: Slot<'MODEL', 0>
        CLIP: Slot<'CLIP', 1>
        VAE: Slot<'VAE', 2>
    }
    export type CheckpointLoader_input = {
        config_name: Enum_CheckpointLoader_config_name
        ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
    }

    // |=============================================================================|
    // | DiffusersLoader [advanced_loaders]                                          |
    // |=============================================================================|
    export interface DiffusersLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<DiffusersLoader_input> {
        MODEL: Slot<'MODEL', 0>
        CLIP: Slot<'CLIP', 1>
        VAE: Slot<'VAE', 2>
    }
    export type DiffusersLoader_input = {
        model_path: Enum_CLIPLoader_clip_name
    }

    // |=============================================================================|
    // | HypernetworkLoader [loaders]                                                |
    // |=============================================================================|
    export interface HypernetworkLoader extends HasSingle_MODEL, ComfyNode<HypernetworkLoader_input> {
        MODEL: Slot<'MODEL', 0>
    }
    export type HypernetworkLoader_input = {
        model: _MODEL
        hypernetwork_name: Enum_CLIPLoader_clip_name
        /** default=1 min=10 max=10 step=0.01 */
        strength?: _FLOAT
    }

    // |=============================================================================|
    // | UpscaleModelLoader [loaders]                                                |
    // |=============================================================================|
    export interface UpscaleModelLoader extends HasSingle_UPSCALE_MODEL, ComfyNode<UpscaleModelLoader_input> {
        UPSCALE_MODEL: Slot<'UPSCALE_MODEL', 0>
    }
    export type UpscaleModelLoader_input = {
        model_name: Enum_UpscaleModelLoader_model_name
    }

    // |=============================================================================|
    // | ImageUpscaleWithModel [image_upscaling]                                     |
    // |=============================================================================|
    export interface ImageUpscaleWithModel extends HasSingle_IMAGE, ComfyNode<ImageUpscaleWithModel_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageUpscaleWithModel_input = {
        upscale_model: _UPSCALE_MODEL
        image: _IMAGE
    }

    // |=============================================================================|
    // | LatentCompositeMasked [latent]                                              |
    // |=============================================================================|
    export interface LatentCompositeMasked extends HasSingle_LATENT, ComfyNode<LatentCompositeMasked_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type LatentCompositeMasked_input = {
        destination: _LATENT
        source: _LATENT
        /** default=0 min=8192 max=8192 step=8 */
        x?: _INT
        /** default=0 min=8192 max=8192 step=8 */
        y?: _INT
        mask?: _MASK
    }

    // |=============================================================================|
    // | MaskToImage [mask]                                                          |
    // |=============================================================================|
    export interface MaskToImage extends HasSingle_IMAGE, ComfyNode<MaskToImage_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MaskToImage_input = {
        mask: _MASK
    }

    // |=============================================================================|
    // | ImageToMask [mask]                                                          |
    // |=============================================================================|
    export interface ImageToMask extends HasSingle_MASK, ComfyNode<ImageToMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type ImageToMask_input = {
        image: _IMAGE
        channel: Enum_ImageToMask_channel
    }

    // |=============================================================================|
    // | SolidMask [mask]                                                            |
    // |=============================================================================|
    export interface SolidMask extends HasSingle_MASK, ComfyNode<SolidMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type SolidMask_input = {
        /** default=1 min=1 max=1 step=0.01 */
        value?: _FLOAT
        /** default=512 min=8192 max=8192 step=1 */
        width?: _INT
        /** default=512 min=8192 max=8192 step=1 */
        height?: _INT
    }

    // |=============================================================================|
    // | InvertMask [mask]                                                           |
    // |=============================================================================|
    export interface InvertMask extends HasSingle_MASK, ComfyNode<InvertMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type InvertMask_input = {
        mask: _MASK
    }

    // |=============================================================================|
    // | CropMask [mask]                                                             |
    // |=============================================================================|
    export interface CropMask extends HasSingle_MASK, ComfyNode<CropMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type CropMask_input = {
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

    // |=============================================================================|
    // | MaskComposite [mask]                                                        |
    // |=============================================================================|
    export interface MaskComposite extends HasSingle_MASK, ComfyNode<MaskComposite_input> {
        MASK: Slot<'MASK', 0>
    }
    export type MaskComposite_input = {
        destination: _MASK
        source: _MASK
        /** default=0 min=8192 max=8192 step=1 */
        x?: _INT
        /** default=0 min=8192 max=8192 step=1 */
        y?: _INT
        operation: Enum_MaskComposite_operation
    }

    // |=============================================================================|
    // | FeatherMask [mask]                                                          |
    // |=============================================================================|
    export interface FeatherMask extends HasSingle_MASK, ComfyNode<FeatherMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type FeatherMask_input = {
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

    // |=============================================================================|
    // | RebatchLatents [latent_batch]                                               |
    // |=============================================================================|
    export interface RebatchLatents extends HasSingle_LATENT, ComfyNode<RebatchLatents_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type RebatchLatents_input = {
        latents: _LATENT
        /** default=1 min=64 max=64 */
        batch_size?: _INT
    }

    // |=============================================================================|
    // | BrightnessContrast ("Brightness & Contrast" in ComfyUI) [Image Processing]   |
    // |=============================================================================|
    export interface BrightnessContrast extends HasSingle_IMAGE, ComfyNode<BrightnessContrast_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type BrightnessContrast_input = {
        image: _IMAGE
        mode: Enum_BrightnessContrast_mode
        /** default=0.5 min=1 max=1 step=0.01 */
        strength?: _FLOAT
    }

    // |=============================================================================|
    // | CLIPSeg [image]                                                             |
    // |=============================================================================|
    export interface CLIPSeg extends HasSingle_MASK, ComfyNode<CLIPSeg_input> {
        MASK: Slot<'MASK', 0>
        IMAGE: Slot<'IMAGE', 1>
        IMAGE_1: Slot<'IMAGE', 2>
    }
    export type CLIPSeg_input = {
        image: _IMAGE
        /** */
        text: _STRING
        /** default=7 min=15 max=15 step=0.1 */
        blur?: _FLOAT
        /** default=0.4 min=1 max=1 step=0.05 */
        threshold?: _FLOAT
        /** default=4 min=10 max=10 step=1 */
        dilation_factor?: _INT
    }

    // |=============================================================================|
    // | CombineSegMasks [image]                                                     |
    // |=============================================================================|
    export interface CombineSegMasks extends HasSingle_MASK, ComfyNode<CombineSegMasks_input> {
        MASK: Slot<'MASK', 0>
        IMAGE: Slot<'IMAGE', 1>
        IMAGE_1: Slot<'IMAGE', 2>
    }
    export type CombineSegMasks_input = {
        input_image: _IMAGE
        mask_1: _MASK
        mask_2: _MASK
        mask_3?: _MASK
    }

    // |=============================================================================|
    // | AlphaChanelAdd [image_alpha]                                                |
    // |=============================================================================|
    export interface AlphaChanelAdd extends HasSingle_IMAGE, ComfyNode<AlphaChanelAdd_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type AlphaChanelAdd_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | AlphaChanelAddByMask [image_alpha]                                          |
    // |=============================================================================|
    export interface AlphaChanelAddByMask extends HasSingle_IMAGE, ComfyNode<AlphaChanelAddByMask_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type AlphaChanelAddByMask_input = {
        images: _IMAGE
        mask: _MASK
        method: Enum_AlphaChanelAddByMask_method
    }

    // |=============================================================================|
    // | AlphaChanelAsMask [image_alpha]                                             |
    // |=============================================================================|
    export interface AlphaChanelAsMask extends HasSingle_MASK, ComfyNode<AlphaChanelAsMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type AlphaChanelAsMask_input = {
        images: _IMAGE
        method: Enum_AlphaChanelAddByMask_method
    }

    // |=============================================================================|
    // | AlphaChanelRestore [image_alpha]                                            |
    // |=============================================================================|
    export interface AlphaChanelRestore extends HasSingle_IMAGE, ComfyNode<AlphaChanelRestore_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type AlphaChanelRestore_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | AlphaChanelRemove [image_alpha]                                             |
    // |=============================================================================|
    export interface AlphaChanelRemove extends HasSingle_IMAGE, ComfyNode<AlphaChanelRemove_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type AlphaChanelRemove_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | ClipClamp [clamp]                                                           |
    // |=============================================================================|
    export interface ClipClamp extends HasSingle_CLIP, ComfyNode<ClipClamp_input> {
        CLIP: Slot<'CLIP', 0>
    }
    export type ClipClamp_input = {
        clip: _CLIP
    }

    // |=============================================================================|
    // | ClipVisionClamp [clamp]                                                     |
    // |=============================================================================|
    export interface ClipVisionClamp extends HasSingle_CLIP_VISION, ComfyNode<ClipVisionClamp_input> {
        CLIP_VISION: Slot<'CLIP_VISION', 0>
    }
    export type ClipVisionClamp_input = {
        clip_vision: _CLIP_VISION
    }

    // |=============================================================================|
    // | ClipVisionOutputClamp [clamp]                                               |
    // |=============================================================================|
    export interface ClipVisionOutputClamp extends HasSingle_CLIP_VISION_OUTPUT, ComfyNode<ClipVisionOutputClamp_input> {
        CLIP_VISION_OUTPUT: Slot<'CLIP_VISION_OUTPUT', 0>
    }
    export type ClipVisionOutputClamp_input = {
        clip_vision_output: _CLIP_VISION_OUTPUT
    }

    // |=============================================================================|
    // | ConditioningClamp [clamp]                                                   |
    // |=============================================================================|
    export interface ConditioningClamp extends HasSingle_CONDITIONING, ComfyNode<ConditioningClamp_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type ConditioningClamp_input = {
        conditioning: _CONDITIONING
    }

    // |=============================================================================|
    // | ControlNetClamp [clamp]                                                     |
    // |=============================================================================|
    export interface ControlNetClamp extends HasSingle_CONTROL_NET, ComfyNode<ControlNetClamp_input> {
        CONTROL_NET: Slot<'CONTROL_NET', 0>
    }
    export type ControlNetClamp_input = {
        control_net_clamp: _CONTROL_NET
    }

    // |=============================================================================|
    // | GligenClamp [clamp]                                                         |
    // |=============================================================================|
    export interface GligenClamp extends HasSingle_GLIGEN, ComfyNode<GligenClamp_input> {
        GLIGEN: Slot<'GLIGEN', 0>
    }
    export type GligenClamp_input = {
        gligen: _GLIGEN
    }

    // |=============================================================================|
    // | ImageClamp [clamp]                                                          |
    // |=============================================================================|
    export interface ImageClamp extends HasSingle_IMAGE, ComfyNode<ImageClamp_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageClamp_input = {
        image: _IMAGE
    }

    // |=============================================================================|
    // | LatentClamp [clamp]                                                         |
    // |=============================================================================|
    export interface LatentClamp extends HasSingle_LATENT, ComfyNode<LatentClamp_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type LatentClamp_input = {
        latent: _LATENT
    }

    // |=============================================================================|
    // | MaskClamp [clamp]                                                           |
    // |=============================================================================|
    export interface MaskClamp extends HasSingle_MASK, ComfyNode<MaskClamp_input> {
        MASK: Slot<'MASK', 0>
    }
    export type MaskClamp_input = {
        mask: _MASK
    }

    // |=============================================================================|
    // | ModelClamp [clamp]                                                          |
    // |=============================================================================|
    export interface ModelClamp extends HasSingle_MODEL, ComfyNode<ModelClamp_input> {
        MODEL: Slot<'MODEL', 0>
    }
    export type ModelClamp_input = {
        model: _MODEL
    }

    // |=============================================================================|
    // | StyleModelClamp [clamp]                                                     |
    // |=============================================================================|
    export interface StyleModelClamp extends HasSingle_STYLE_MODEL, ComfyNode<StyleModelClamp_input> {
        STYLE_MODEL: Slot<'STYLE_MODEL', 0>
    }
    export type StyleModelClamp_input = {
        style_model: _STYLE_MODEL
    }

    // |=============================================================================|
    // | UpscaleModelClamp [clamp]                                                   |
    // |=============================================================================|
    export interface UpscaleModelClamp extends HasSingle_UPSCALE_MODEL, ComfyNode<UpscaleModelClamp_input> {
        UPSCALE_MODEL: Slot<'UPSCALE_MODEL', 0>
    }
    export type UpscaleModelClamp_input = {
        upscale_model: _UPSCALE_MODEL
    }

    // |=============================================================================|
    // | VaeClamp [clamp]                                                            |
    // |=============================================================================|
    export interface VaeClamp extends HasSingle_VAE, ComfyNode<VaeClamp_input> {
        VAE: Slot<'VAE', 0>
    }
    export type VaeClamp_input = {
        vae: _VAE
    }

    // |=============================================================================|
    // | ImageBatchGet [image_batch]                                                 |
    // |=============================================================================|
    export interface ImageBatchGet extends HasSingle_IMAGE, ComfyNode<ImageBatchGet_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageBatchGet_input = {
        images: _IMAGE
        /** default=1 min=undefined step=1 */
        index?: _INT
    }

    // |=============================================================================|
    // | ImageBatchRemove [image_batch]                                              |
    // |=============================================================================|
    export interface ImageBatchRemove extends HasSingle_IMAGE, ComfyNode<ImageBatchRemove_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageBatchRemove_input = {
        images: _IMAGE
        /** default=1 min=undefined step=1 */
        index?: _INT
    }

    // |=============================================================================|
    // | ImageBatchFork [image_batch]                                                |
    // |=============================================================================|
    export interface ImageBatchFork extends ComfyNode<ImageBatchFork_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
    }
    export type ImageBatchFork_input = {
        images: _IMAGE
        priority: Enum_ImageBatchFork_priority
    }

    // |=============================================================================|
    // | ImageBatchJoin [image_batch]                                                |
    // |=============================================================================|
    export interface ImageBatchJoin extends HasSingle_IMAGE, ComfyNode<ImageBatchJoin_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageBatchJoin_input = {
        images_a: _IMAGE
        images_b: _IMAGE
    }

    // |=============================================================================|
    // | ImageCompositeAbsolute [image_composite]                                    |
    // |=============================================================================|
    export interface ImageCompositeAbsolute extends HasSingle_IMAGE, ComfyNode<ImageCompositeAbsolute_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageCompositeAbsolute_input = {
        images_a: _IMAGE
        images_b: _IMAGE
        /** default=0 step=1 */
        images_a_x?: _INT
        /** default=0 step=1 */
        images_a_y?: _INT
        /** default=0 step=1 */
        images_b_x?: _INT
        /** default=0 step=1 */
        images_b_y?: _INT
        /** default=0 step=1 */
        container_width?: _INT
        /** default=0 step=1 */
        container_height?: _INT
        background: Enum_ImageCompositeAbsolute_background
        method: Enum_ImageCompositeAbsolute_method
    }

    // |=============================================================================|
    // | ImageCompositeAbsoluteByContainer [image_composite]                         |
    // |=============================================================================|
    export interface ImageCompositeAbsoluteByContainer
        extends HasSingle_IMAGE,
            ComfyNode<ImageCompositeAbsoluteByContainer_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageCompositeAbsoluteByContainer_input = {
        container: _IMAGE
        images_a: _IMAGE
        images_b: _IMAGE
        /** default=0 step=1 */
        images_a_x?: _INT
        /** default=0 step=1 */
        images_a_y?: _INT
        /** default=0 step=1 */
        images_b_x?: _INT
        /** default=0 step=1 */
        images_b_y?: _INT
        background: Enum_ImageCompositeAbsolute_background
        method: Enum_ImageCompositeAbsolute_method
    }

    // |=============================================================================|
    // | ImageCompositeRelative [image_composite]                                    |
    // |=============================================================================|
    export interface ImageCompositeRelative extends HasSingle_IMAGE, ComfyNode<ImageCompositeRelative_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageCompositeRelative_input = {
        images_a: _IMAGE
        images_b: _IMAGE
        /** default=0 max=1 step=0.01 */
        images_a_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        images_a_y?: _FLOAT
        /** default=0 max=1 step=0.01 */
        images_b_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        images_b_y?: _FLOAT
        background: Enum_ImageCompositeAbsolute_background
        container_size_type: Enum_ImageCompositeRelative_container_size_type
        method: Enum_ImageCompositeAbsolute_method
    }

    // |=============================================================================|
    // | ImageCompositeRelativeByContainer [image_composite]                         |
    // |=============================================================================|
    export interface ImageCompositeRelativeByContainer
        extends HasSingle_IMAGE,
            ComfyNode<ImageCompositeRelativeByContainer_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageCompositeRelativeByContainer_input = {
        container: _IMAGE
        images_a: _IMAGE
        images_b: _IMAGE
        /** default=0 max=1 step=0.01 */
        images_a_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        images_a_y?: _FLOAT
        /** default=0 max=1 step=0.01 */
        images_b_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        images_b_y?: _FLOAT
        background: Enum_ImageCompositeAbsolute_background
        method: Enum_ImageCompositeAbsolute_method
    }

    // |=============================================================================|
    // | ImageContainer [image_container]                                            |
    // |=============================================================================|
    export interface ImageContainer extends HasSingle_IMAGE, ComfyNode<ImageContainer_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageContainer_input = {
        /** default=512 min=undefined step=1 */
        width?: _INT
        /** default=512 min=undefined step=1 */
        height?: _INT
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=0 max=1 step=0.01 */
        alpha?: _FLOAT
    }

    // |=============================================================================|
    // | ImageContainerInheritanceAdd [image_container]                              |
    // |=============================================================================|
    export interface ImageContainerInheritanceAdd extends HasSingle_IMAGE, ComfyNode<ImageContainerInheritanceAdd_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageContainerInheritanceAdd_input = {
        images: _IMAGE
        /** default=0 step=1 */
        add_width?: _INT
        /** default=0 step=1 */
        add_height?: _INT
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=0 max=1 step=0.01 */
        alpha?: _FLOAT
        method: Enum_ImageContainerInheritanceAdd_method
    }

    // |=============================================================================|
    // | ImageContainerInheritanceScale [image_container]                            |
    // |=============================================================================|
    export interface ImageContainerInheritanceScale extends HasSingle_IMAGE, ComfyNode<ImageContainerInheritanceScale_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageContainerInheritanceScale_input = {
        images: _IMAGE
        /** default=1 step=0.1 */
        scale_width?: _FLOAT
        /** default=1 step=0.1 */
        scale_height?: _FLOAT
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=0 max=1 step=0.01 */
        alpha?: _FLOAT
        method: Enum_ImageContainerInheritanceAdd_method
    }

    // |=============================================================================|
    // | ImageContainerInheritanceMax [image_container]                              |
    // |=============================================================================|
    export interface ImageContainerInheritanceMax extends HasSingle_IMAGE, ComfyNode<ImageContainerInheritanceMax_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageContainerInheritanceMax_input = {
        images_a: _IMAGE
        images_b: _IMAGE
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=0 max=1 step=0.01 */
        alpha?: _FLOAT
        method: Enum_ImageContainerInheritanceMax_method
    }

    // |=============================================================================|
    // | ImageContainerInheritanceSum [image_container]                              |
    // |=============================================================================|
    export interface ImageContainerInheritanceSum extends HasSingle_IMAGE, ComfyNode<ImageContainerInheritanceSum_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageContainerInheritanceSum_input = {
        images_a: _IMAGE
        images_b: _IMAGE
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=0 max=1 step=0.01 */
        alpha?: _FLOAT
        container_size_type: Enum_ImageContainerInheritanceSum_container_size_type
        method: Enum_ImageContainerInheritanceMax_method
    }

    // |=============================================================================|
    // | ImageDrawArc [image_draw]                                                   |
    // |=============================================================================|
    export interface ImageDrawArc extends HasSingle_IMAGE, ComfyNode<ImageDrawArc_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawArc_input = {
        /** default=256 min=undefined step=1 */
        width?: _INT
        /** default=256 min=undefined step=1 */
        height?: _INT
        /** default=1 min=undefined step=1 */
        size?: _INT
        /** default=0 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=0 max=360 step=1 */
        start?: _INT
        /** default=180 max=360 step=1 */
        end?: _INT
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=1 max=1 step=0.01 */
        alpha?: _FLOAT
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawArcByContainer [image_draw]                                        |
    // |=============================================================================|
    export interface ImageDrawArcByContainer extends HasSingle_IMAGE, ComfyNode<ImageDrawArcByContainer_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawArcByContainer_input = {
        container: _IMAGE
        /** default=1 min=undefined step=1 */
        size?: _INT
        /** default=0 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=0 max=360 step=1 */
        start?: _INT
        /** default=180 max=360 step=1 */
        end?: _INT
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=1 max=1 step=0.01 */
        alpha?: _FLOAT
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawChord [image_draw]                                                 |
    // |=============================================================================|
    export interface ImageDrawChord extends HasSingle_IMAGE, ComfyNode<ImageDrawChord_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawChord_input = {
        /** default=256 min=undefined step=1 */
        width?: _INT
        /** default=256 min=undefined step=1 */
        height?: _INT
        /** default=1 min=undefined step=1 */
        size?: _INT
        /** default=0 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=0 max=360 step=1 */
        start?: _INT
        /** default=180 max=360 step=1 */
        end?: _INT
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=1 max=1 step=0.01 */
        alpha?: _FLOAT
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawChordByContainer [image_draw]                                      |
    // |=============================================================================|
    export interface ImageDrawChordByContainer extends HasSingle_IMAGE, ComfyNode<ImageDrawChordByContainer_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawChordByContainer_input = {
        container: _IMAGE
        /** default=1 min=undefined step=1 */
        size?: _INT
        /** default=0 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=0 max=360 step=1 */
        start?: _INT
        /** default=180 max=360 step=1 */
        end?: _INT
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=1 max=1 step=0.01 */
        alpha?: _FLOAT
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawEllipse [image_draw]                                               |
    // |=============================================================================|
    export interface ImageDrawEllipse extends HasSingle_IMAGE, ComfyNode<ImageDrawEllipse_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawEllipse_input = {
        /** default=256 min=undefined step=1 */
        width?: _INT
        /** default=256 min=undefined step=1 */
        height?: _INT
        /** default=0 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=1 step=1 */
        outline_size?: _INT
        /** default=0 max=255 step=1 */
        outline_red?: _INT
        /** default=0 max=255 step=1 */
        outline_green?: _INT
        /** default=0 max=255 step=1 */
        outline_blue?: _INT
        /** default=1 max=1 step=0.01 */
        outline_alpha?: _FLOAT
        /** default=255 max=255 step=1 */
        fill_red?: _INT
        /** default=255 max=255 step=1 */
        fill_green?: _INT
        /** default=255 max=255 step=1 */
        fill_blue?: _INT
        /** default=1 max=1 step=0.01 */
        fill_alpha?: _FLOAT
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawEllipseByContainer [image_draw]                                    |
    // |=============================================================================|
    export interface ImageDrawEllipseByContainer extends HasSingle_IMAGE, ComfyNode<ImageDrawEllipseByContainer_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawEllipseByContainer_input = {
        container: _IMAGE
        /** default=0 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=1 step=1 */
        outline_size?: _INT
        /** default=0 max=255 step=1 */
        outline_red?: _INT
        /** default=0 max=255 step=1 */
        outline_green?: _INT
        /** default=0 max=255 step=1 */
        outline_blue?: _INT
        /** default=1 max=1 step=0.01 */
        outline_alpha?: _FLOAT
        /** default=255 max=255 step=1 */
        fill_red?: _INT
        /** default=255 max=255 step=1 */
        fill_green?: _INT
        /** default=255 max=255 step=1 */
        fill_blue?: _INT
        /** default=1 max=1 step=0.01 */
        fill_alpha?: _FLOAT
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawLine [image_draw]                                                  |
    // |=============================================================================|
    export interface ImageDrawLine extends HasSingle_IMAGE, ComfyNode<ImageDrawLine_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawLine_input = {
        /** default=256 min=undefined step=1 */
        width?: _INT
        /** default=256 min=undefined step=1 */
        height?: _INT
        /** default=1 min=undefined step=1 */
        size?: _INT
        /** default=0 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=1 max=1 step=0.01 */
        alpha?: _FLOAT
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawLineByContainer [image_draw]                                       |
    // |=============================================================================|
    export interface ImageDrawLineByContainer extends HasSingle_IMAGE, ComfyNode<ImageDrawLineByContainer_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawLineByContainer_input = {
        container: _IMAGE
        /** default=1 min=undefined step=1 */
        size?: _INT
        /** default=0 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=1 max=1 step=0.01 */
        alpha?: _FLOAT
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawPieslice [image_draw]                                              |
    // |=============================================================================|
    export interface ImageDrawPieslice extends HasSingle_IMAGE, ComfyNode<ImageDrawPieslice_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawPieslice_input = {
        /** default=256 min=undefined step=1 */
        width?: _INT
        /** default=256 min=undefined step=1 */
        height?: _INT
        /** default=0 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=0 max=360 step=1 */
        start?: _INT
        /** default=240 max=360 step=1 */
        end?: _INT
        /** default=1 step=1 */
        outline_size?: _INT
        /** default=0 max=255 step=1 */
        outline_red?: _INT
        /** default=0 max=255 step=1 */
        outline_green?: _INT
        /** default=0 max=255 step=1 */
        outline_blue?: _INT
        /** default=1 max=1 step=0.01 */
        outline_alpha?: _FLOAT
        /** default=255 max=255 step=1 */
        fill_red?: _INT
        /** default=255 max=255 step=1 */
        fill_green?: _INT
        /** default=255 max=255 step=1 */
        fill_blue?: _INT
        /** default=1 max=1 step=0.01 */
        fill_alpha?: _FLOAT
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawPiesliceByContainer [image_draw]                                   |
    // |=============================================================================|
    export interface ImageDrawPiesliceByContainer extends HasSingle_IMAGE, ComfyNode<ImageDrawPiesliceByContainer_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawPiesliceByContainer_input = {
        container: _IMAGE
        /** default=0 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=1 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=0 max=360 step=1 */
        start?: _INT
        /** default=240 max=360 step=1 */
        end?: _INT
        /** default=1 step=1 */
        outline_size?: _INT
        /** default=0 max=255 step=1 */
        outline_red?: _INT
        /** default=0 max=255 step=1 */
        outline_green?: _INT
        /** default=0 max=255 step=1 */
        outline_blue?: _INT
        /** default=1 max=1 step=0.01 */
        outline_alpha?: _FLOAT
        /** default=255 max=255 step=1 */
        fill_red?: _INT
        /** default=255 max=255 step=1 */
        fill_green?: _INT
        /** default=255 max=255 step=1 */
        fill_blue?: _INT
        /** default=1 max=1 step=0.01 */
        fill_alpha?: _FLOAT
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawRectangle [image_draw]                                             |
    // |=============================================================================|
    export interface ImageDrawRectangle extends HasSingle_IMAGE, ComfyNode<ImageDrawRectangle_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawRectangle_input = {
        /** default=256 min=undefined step=1 */
        width?: _INT
        /** default=256 min=undefined step=1 */
        height?: _INT
        /** default=0.1 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0.2 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=0.9 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=0.8 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=1 step=1 */
        outline_size?: _INT
        /** default=0 max=255 step=1 */
        outline_red?: _INT
        /** default=0 max=255 step=1 */
        outline_green?: _INT
        /** default=0 max=255 step=1 */
        outline_blue?: _INT
        /** default=1 max=1 step=0.01 */
        outline_alpha?: _FLOAT
        /** default=255 max=255 step=1 */
        fill_red?: _INT
        /** default=255 max=255 step=1 */
        fill_green?: _INT
        /** default=255 max=255 step=1 */
        fill_blue?: _INT
        /** default=1 max=1 step=0.01 */
        fill_alpha?: _FLOAT
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawRectangleByContainer [image_draw]                                  |
    // |=============================================================================|
    export interface ImageDrawRectangleByContainer extends HasSingle_IMAGE, ComfyNode<ImageDrawRectangleByContainer_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawRectangleByContainer_input = {
        container: _IMAGE
        /** default=0.1 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0.2 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=0.9 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=0.8 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=1 step=1 */
        outline_size?: _INT
        /** default=0 max=255 step=1 */
        outline_red?: _INT
        /** default=0 max=255 step=1 */
        outline_green?: _INT
        /** default=0 max=255 step=1 */
        outline_blue?: _INT
        /** default=1 max=1 step=0.01 */
        outline_alpha?: _FLOAT
        /** default=255 max=255 step=1 */
        fill_red?: _INT
        /** default=255 max=255 step=1 */
        fill_green?: _INT
        /** default=255 max=255 step=1 */
        fill_blue?: _INT
        /** default=1 max=1 step=0.01 */
        fill_alpha?: _FLOAT
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawRectangleRounded [image_draw]                                      |
    // |=============================================================================|
    export interface ImageDrawRectangleRounded extends HasSingle_IMAGE, ComfyNode<ImageDrawRectangleRounded_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawRectangleRounded_input = {
        /** default=256 min=undefined step=1 */
        width?: _INT
        /** default=256 min=undefined step=1 */
        height?: _INT
        /** default=0.1 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0.2 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=0.9 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=0.8 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=180 max=360 step=1 */
        radius?: _INT
        /** default=1 step=1 */
        outline_size?: _INT
        /** default=0 max=255 step=1 */
        outline_red?: _INT
        /** default=0 max=255 step=1 */
        outline_green?: _INT
        /** default=0 max=255 step=1 */
        outline_blue?: _INT
        /** default=1 max=1 step=0.01 */
        outline_alpha?: _FLOAT
        /** default=255 max=255 step=1 */
        fill_red?: _INT
        /** default=255 max=255 step=1 */
        fill_green?: _INT
        /** default=255 max=255 step=1 */
        fill_blue?: _INT
        /** default=1 max=1 step=0.01 */
        fill_alpha?: _FLOAT
        top_left_corner: Enum_ImageDrawRectangleRounded_top_left_corner
        top_right_corner: Enum_ImageDrawRectangleRounded_top_left_corner
        bottom_right_corner: Enum_ImageDrawRectangleRounded_top_left_corner
        bottom_left_corner: Enum_ImageDrawRectangleRounded_top_left_corner
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawRectangleRoundedByContainer [image_draw]                           |
    // |=============================================================================|
    export interface ImageDrawRectangleRoundedByContainer
        extends HasSingle_IMAGE,
            ComfyNode<ImageDrawRectangleRoundedByContainer_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawRectangleRoundedByContainer_input = {
        container: _IMAGE
        /** default=0.1 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0.2 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=0.9 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=0.8 max=1 step=0.01 */
        end_y?: _FLOAT
        /** default=180 max=360 step=1 */
        radius?: _INT
        /** default=1 step=1 */
        outline_size?: _INT
        /** default=0 max=255 step=1 */
        outline_red?: _INT
        /** default=0 max=255 step=1 */
        outline_green?: _INT
        /** default=0 max=255 step=1 */
        outline_blue?: _INT
        /** default=1 max=1 step=0.01 */
        outline_alpha?: _FLOAT
        /** default=255 max=255 step=1 */
        fill_red?: _INT
        /** default=255 max=255 step=1 */
        fill_green?: _INT
        /** default=255 max=255 step=1 */
        fill_blue?: _INT
        /** default=1 max=1 step=0.01 */
        fill_alpha?: _FLOAT
        top_left_corner: Enum_ImageDrawRectangleRounded_top_left_corner
        top_right_corner: Enum_ImageDrawRectangleRounded_top_left_corner
        bottom_right_corner: Enum_ImageDrawRectangleRounded_top_left_corner
        bottom_left_corner: Enum_ImageDrawRectangleRounded_top_left_corner
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageDrawPolygon [image_draw]                                               |
    // |=============================================================================|
    export interface ImageDrawPolygon extends HasSingle_IMAGE, ComfyNode<ImageDrawPolygon_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageDrawPolygon_input = {
        /** default=256 min=undefined step=1 */
        size?: _INT
        /** default=5 min=undefined step=1 */
        sides?: _INT
        /** default=0 max=360 step=1 */
        rotation?: _INT
        /** default=1 step=1 */
        outline_size?: _INT
        /** default=0 max=255 step=1 */
        outline_red?: _INT
        /** default=0 max=255 step=1 */
        outline_green?: _INT
        /** default=0 max=255 step=1 */
        outline_blue?: _INT
        /** default=1 max=1 step=0.01 */
        outline_alpha?: _FLOAT
        /** default=255 max=255 step=1 */
        fill_red?: _INT
        /** default=255 max=255 step=1 */
        fill_green?: _INT
        /** default=255 max=255 step=1 */
        fill_blue?: _INT
        /** default=1 max=1 step=0.01 */
        fill_alpha?: _FLOAT
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageEffectsAdjustment [image_effects]                                      |
    // |=============================================================================|
    export interface ImageEffectsAdjustment extends HasSingle_IMAGE, ComfyNode<ImageEffectsAdjustment_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageEffectsAdjustment_input = {
        images: _IMAGE
        /** default=1 step=0.01 */
        brightness?: _FLOAT
        /** default=1 step=0.01 */
        contrast?: _FLOAT
        /** default=1 step=0.01 */
        saturation?: _FLOAT
        /** default=0.5 max=1 step=0.01 */
        hue?: _FLOAT
        /** default=1 step=0.01 */
        gamma?: _FLOAT
        /** default=1 step=0.01 */
        sharpness?: _FLOAT
        /** default=1 step=0.01 */
        red?: _FLOAT
        /** default=1 step=0.01 */
        green?: _FLOAT
        /** default=1 step=0.01 */
        blue?: _FLOAT
    }

    // |=============================================================================|
    // | ImageEffectsGrayscale [image_effects]                                       |
    // |=============================================================================|
    export interface ImageEffectsGrayscale extends HasSingle_IMAGE, ComfyNode<ImageEffectsGrayscale_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageEffectsGrayscale_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | ImageEffectsNegative [image_effects]                                        |
    // |=============================================================================|
    export interface ImageEffectsNegative extends HasSingle_IMAGE, ComfyNode<ImageEffectsNegative_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageEffectsNegative_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | ImageEffectsSepia [image_effects]                                           |
    // |=============================================================================|
    export interface ImageEffectsSepia extends HasSingle_IMAGE, ComfyNode<ImageEffectsSepia_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageEffectsSepia_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | ImageEffectsLensZoomBurst [image_effects_lens]                              |
    // |=============================================================================|
    export interface ImageEffectsLensZoomBurst extends HasSingle_IMAGE, ComfyNode<ImageEffectsLensZoomBurst_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageEffectsLensZoomBurst_input = {
        images: _IMAGE
        /** default=1.5 min=undefined step=0.01 */
        scale?: _FLOAT
        /** default=100 min=undefined */
        samples?: _INT
        /** default=0.5 max=1 step=0.01 */
        position_x?: _FLOAT
        /** default=0.5 max=1 step=0.01 */
        position_y?: _FLOAT
        /** default=0 min=360 max=360 */
        rotation?: _FLOAT
        method: Enum_ImageEffectsLensZoomBurst_method
        stabilization: Enum_ImageDrawRectangleRounded_top_left_corner
    }

    // |=============================================================================|
    // | ImageEffectsLensChromaticAberration [image_effects_lens]                    |
    // |=============================================================================|
    export interface ImageEffectsLensChromaticAberration
        extends HasSingle_IMAGE,
            ComfyNode<ImageEffectsLensChromaticAberration_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageEffectsLensChromaticAberration_input = {
        images: _IMAGE
        /** default=10 step=1 */
        shift?: _INT
        method: Enum_ImageEffectsLensChromaticAberration_method
        /** default=1 min=4 max=4 step=1 */
        shift_type?: _INT
        /** default=1 min=4 max=4 step=1 */
        mixing_type?: _INT
        transpose: Enum_ImageEffectsLensChromaticAberration_transpose
        colors: Enum_ImageEffectsLensChromaticAberration_colors
        /** default=1 max=15 step=0.1 */
        lens_curvy?: _FLOAT
    }

    // |=============================================================================|
    // | ImageEffectsLensBokeh [image_effects_lens]                                  |
    // |=============================================================================|
    export interface ImageEffectsLensBokeh extends HasSingle_IMAGE, ComfyNode<ImageEffectsLensBokeh_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageEffectsLensBokeh_input = {
        images: _IMAGE
        /** default=5 min=undefined */
        blades_shape?: _INT
        /** default=10 min=undefined */
        blades_radius?: _INT
        /** default=0 min=360 max=360 */
        blades_rotation?: _FLOAT
        /** default=10 min=undefined step=2 */
        blur_size?: _INT
        blur_type: Enum_ImageEffectsLensBokeh_blur_type
        method: Enum_ImageEffectsLensBokeh_method
    }

    // |=============================================================================|
    // | ImageEffectsLensOpticAxis [image_effects_lens]                              |
    // |=============================================================================|
    export interface ImageEffectsLensOpticAxis
        extends HasSingle_IMAGE,
            HasSingle_MASK,
            ComfyNode<ImageEffectsLensOpticAxis_input> {
        IMAGE: Slot<'IMAGE', 0>
        MASK: Slot<'MASK', 1>
    }
    export type ImageEffectsLensOpticAxis_input = {
        images: _IMAGE
        lens_shape: Enum_ImageEffectsLensOpticAxis_lens_shape
        lens_edge: Enum_ImageEffectsLensOpticAxis_lens_edge
        /** default=4 max=15 step=0.1 */
        lens_curvy?: _FLOAT
        /** default=2 step=0.1 */
        lens_zoom?: _FLOAT
        /** default=0.5 max=10 step=0.1 */
        lens_aperture?: _FLOAT
        /** default=30 min=undefined step=2 */
        blur_intensity?: _INT
    }

    // |=============================================================================|
    // | ImageEffectsLensVignette [image_effects_lens]                               |
    // |=============================================================================|
    export interface ImageEffectsLensVignette extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImageEffectsLensVignette_input> {
        IMAGE: Slot<'IMAGE', 0>
        MASK: Slot<'MASK', 1>
    }
    export type ImageEffectsLensVignette_input = {
        images: _IMAGE
        lens_shape: Enum_ImageEffectsLensVignette_lens_shape
        lens_edge: Enum_ImageEffectsLensOpticAxis_lens_edge
        /** default=3 max=15 step=0.1 */
        lens_curvy?: _FLOAT
        /** default=0 step=0.1 */
        lens_zoom?: _FLOAT
        /** default=0.25 max=1 step=0.01 */
        brightness?: _FLOAT
        /** default=0.5 max=1 step=0.01 */
        saturation?: _FLOAT
    }

    // |=============================================================================|
    // | ImageFilterSmooth [image_filter]                                            |
    // |=============================================================================|
    export interface ImageFilterSmooth extends HasSingle_IMAGE, ComfyNode<ImageFilterSmooth_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterSmooth_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | ImageFilterSmoothMore [image_filter]                                        |
    // |=============================================================================|
    export interface ImageFilterSmoothMore extends HasSingle_IMAGE, ComfyNode<ImageFilterSmoothMore_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterSmoothMore_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | ImageFilterBlur [image_filter]                                              |
    // |=============================================================================|
    export interface ImageFilterBlur extends HasSingle_IMAGE, ComfyNode<ImageFilterBlur_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterBlur_input = {
        images: _IMAGE
        /** default=10 min=undefined */
        size_x?: _INT
        /** default=10 min=undefined */
        size_y?: _INT
    }

    // |=============================================================================|
    // | ImageFilterBoxBlur [image_filter]                                           |
    // |=============================================================================|
    export interface ImageFilterBoxBlur extends HasSingle_IMAGE, ComfyNode<ImageFilterBoxBlur_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterBoxBlur_input = {
        images: _IMAGE
        /** default=10 min=undefined */
        size_x?: _INT
        /** default=10 min=undefined */
        size_y?: _INT
    }

    // |=============================================================================|
    // | ImageFilterGaussianBlur [image_filter]                                      |
    // |=============================================================================|
    export interface ImageFilterGaussianBlur extends HasSingle_IMAGE, ComfyNode<ImageFilterGaussianBlur_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterGaussianBlur_input = {
        images: _IMAGE
        /** default=10 min=undefined step=2 */
        size_x?: _INT
        /** default=10 min=undefined step=2 */
        size_y?: _INT
    }

    // |=============================================================================|
    // | ImageFilterGaussianBlurAdvanced [image_filter]                              |
    // |=============================================================================|
    export interface ImageFilterGaussianBlurAdvanced extends HasSingle_IMAGE, ComfyNode<ImageFilterGaussianBlurAdvanced_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterGaussianBlurAdvanced_input = {
        images: _IMAGE
        /** default=10 min=undefined step=2 */
        size_x?: _INT
        /** default=10 min=undefined step=2 */
        size_y?: _INT
        /** default=0 */
        sigma_x?: _INT
        /** default=0 */
        sigma_y?: _INT
    }

    // |=============================================================================|
    // | ImageFilterStackBlur [image_filter]                                         |
    // |=============================================================================|
    export interface ImageFilterStackBlur extends HasSingle_IMAGE, ComfyNode<ImageFilterStackBlur_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterStackBlur_input = {
        images: _IMAGE
        /** default=10 min=undefined step=2 */
        size_x?: _INT
        /** default=10 min=undefined step=2 */
        size_y?: _INT
    }

    // |=============================================================================|
    // | ImageFilterMedianBlur [image_filter]                                        |
    // |=============================================================================|
    export interface ImageFilterMedianBlur extends HasSingle_IMAGE, ComfyNode<ImageFilterMedianBlur_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterMedianBlur_input = {
        images: _IMAGE
        /** default=10 min=undefined step=2 */
        size?: _INT
    }

    // |=============================================================================|
    // | ImageFilterBilateralBlur [image_filter]                                     |
    // |=============================================================================|
    export interface ImageFilterBilateralBlur extends HasSingle_IMAGE, ComfyNode<ImageFilterBilateralBlur_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterBilateralBlur_input = {
        images: _IMAGE
        /** default=10 min=undefined step=2 */
        size?: _INT
        /** default=1 max=1 step=0.01 */
        sigma_color?: _FLOAT
        /** default=1 max=1 step=0.01 */
        sigma_intensity?: _FLOAT
    }

    // |=============================================================================|
    // | ImageFilterContour [image_filter]                                           |
    // |=============================================================================|
    export interface ImageFilterContour extends HasSingle_IMAGE, ComfyNode<ImageFilterContour_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterContour_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | ImageFilterDetail [image_filter]                                            |
    // |=============================================================================|
    export interface ImageFilterDetail extends HasSingle_IMAGE, ComfyNode<ImageFilterDetail_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterDetail_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | ImageFilterEdgeEnhance [image_filter]                                       |
    // |=============================================================================|
    export interface ImageFilterEdgeEnhance extends HasSingle_IMAGE, ComfyNode<ImageFilterEdgeEnhance_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterEdgeEnhance_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | ImageFilterEdgeEnhanceMore [image_filter]                                   |
    // |=============================================================================|
    export interface ImageFilterEdgeEnhanceMore extends HasSingle_IMAGE, ComfyNode<ImageFilterEdgeEnhanceMore_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterEdgeEnhanceMore_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | ImageFilterEmboss [image_filter]                                            |
    // |=============================================================================|
    export interface ImageFilterEmboss extends HasSingle_IMAGE, ComfyNode<ImageFilterEmboss_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterEmboss_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | ImageFilterFindEdges [image_filter]                                         |
    // |=============================================================================|
    export interface ImageFilterFindEdges extends HasSingle_IMAGE, ComfyNode<ImageFilterFindEdges_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterFindEdges_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | ImageFilterSharpen [image_filter]                                           |
    // |=============================================================================|
    export interface ImageFilterSharpen extends HasSingle_IMAGE, ComfyNode<ImageFilterSharpen_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterSharpen_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | ImageFilterRank [image_filter]                                              |
    // |=============================================================================|
    export interface ImageFilterRank extends HasSingle_IMAGE, ComfyNode<ImageFilterRank_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterRank_input = {
        images: _IMAGE
        /** default=2 min=undefined step=2 */
        size?: _INT
        /** default=1 step=1 */
        rank?: _INT
    }

    // |=============================================================================|
    // | ImageFilterMin [image_filter]                                               |
    // |=============================================================================|
    export interface ImageFilterMin extends HasSingle_IMAGE, ComfyNode<ImageFilterMin_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterMin_input = {
        images: _IMAGE
        /** default=2 min=undefined step=2 */
        size?: _INT
    }

    // |=============================================================================|
    // | ImageFilterMax [image_filter]                                               |
    // |=============================================================================|
    export interface ImageFilterMax extends HasSingle_IMAGE, ComfyNode<ImageFilterMax_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterMax_input = {
        images: _IMAGE
        /** default=2 min=undefined step=2 */
        size?: _INT
    }

    // |=============================================================================|
    // | ImageFilterMode [image_filter]                                              |
    // |=============================================================================|
    export interface ImageFilterMode extends HasSingle_IMAGE, ComfyNode<ImageFilterMode_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageFilterMode_input = {
        images: _IMAGE
        /** default=2 min=undefined step=2 */
        size?: _INT
    }

    // |=============================================================================|
    // | ImageSegmentation [image_segmentation]                                      |
    // |=============================================================================|
    export interface ImageSegmentation extends HasSingle_IMAGE, ComfyNode<ImageSegmentation_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageSegmentation_input = {
        images: _IMAGE
        model: Enum_ImageSegmentation_model
        alpha_matting: Enum_ImageDrawRectangleRounded_top_left_corner
        /** default=240 max=250 step=5 */
        alpha_matting_foreground_threshold?: _INT
        /** default=20 max=250 step=5 */
        alpha_matting_background_threshold?: _INT
        /** default=10 step=1 */
        alpha_matting_erode_size?: _INT
        post_process_mask: Enum_ImageDrawRectangleRounded_top_left_corner
    }

    // |=============================================================================|
    // | ImageSegmentationCustom [image_segmentation]                                |
    // |=============================================================================|
    export interface ImageSegmentationCustom extends HasSingle_IMAGE, ComfyNode<ImageSegmentationCustom_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageSegmentationCustom_input = {
        images: _IMAGE
        model: Enum_CLIPLoader_clip_name
        alpha_matting: Enum_ImageDrawRectangleRounded_top_left_corner
        /** default=240 max=250 step=5 */
        alpha_matting_foreground_threshold?: _INT
        /** default=20 max=250 step=5 */
        alpha_matting_background_threshold?: _INT
        /** default=10 step=1 */
        alpha_matting_erode_size?: _INT
        post_process_mask: Enum_ImageDrawRectangleRounded_top_left_corner
        /** default=0.485 max=1 step=0.01 */
        mean?: _FLOAT
        /** default=1 max=1 step=0.01 */
        std?: _FLOAT
        /** default=1024 step=8 */
        size?: _INT
    }

    // |=============================================================================|
    // | ImageSegmentationCustomAdvanced [image_segmentation]                        |
    // |=============================================================================|
    export interface ImageSegmentationCustomAdvanced extends HasSingle_IMAGE, ComfyNode<ImageSegmentationCustomAdvanced_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageSegmentationCustomAdvanced_input = {
        images: _IMAGE
        model: Enum_CLIPLoader_clip_name
        alpha_matting: Enum_ImageDrawRectangleRounded_top_left_corner
        /** default=240 max=250 step=5 */
        alpha_matting_foreground_threshold?: _INT
        /** default=20 max=250 step=5 */
        alpha_matting_background_threshold?: _INT
        /** default=10 step=1 */
        alpha_matting_erode_size?: _INT
        post_process_mask: Enum_ImageDrawRectangleRounded_top_left_corner
        /** default=0.485 max=1 step=0.01 */
        mean_r?: _FLOAT
        /** default=0.456 max=1 step=0.01 */
        mean_g?: _FLOAT
        /** default=0.406 max=1 step=0.01 */
        mean_b?: _FLOAT
        /** default=1 max=1 step=0.01 */
        std_r?: _FLOAT
        /** default=1 max=1 step=0.01 */
        std_g?: _FLOAT
        /** default=1 max=1 step=0.01 */
        std_b?: _FLOAT
        /** default=1024 step=8 */
        width?: _INT
        /** default=1024 step=8 */
        height?: _INT
    }

    // |=============================================================================|
    // | ImageText [image_draw]                                                      |
    // |=============================================================================|
    export interface ImageText extends HasSingle_IMAGE, ComfyNode<ImageText_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageText_input = {
        /** */
        text: _STRING
        font: Enum_CLIPLoader_clip_name
        /** default=28 min=undefined step=1 */
        size?: _INT
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=1 max=1 step=0.01 */
        alpha?: _FLOAT
        /** default=0 step=1 */
        margin_x?: _INT
        /** default=0 step=1 */
        margin_y?: _INT
    }

    // |=============================================================================|
    // | ImageTextOutlined [image_draw]                                              |
    // |=============================================================================|
    export interface ImageTextOutlined extends HasSingle_IMAGE, ComfyNode<ImageTextOutlined_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageTextOutlined_input = {
        /** */
        text: _STRING
        font: Enum_CLIPLoader_clip_name
        /** default=28 min=undefined step=1 */
        size?: _INT
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=1 step=1 */
        outline_size?: _INT
        /** default=0 max=255 step=1 */
        outline_red?: _INT
        /** default=0 max=255 step=1 */
        outline_green?: _INT
        /** default=0 max=255 step=1 */
        outline_blue?: _INT
        /** default=1 max=1 step=0.01 */
        alpha?: _FLOAT
        /** default=0 step=1 */
        margin_x?: _INT
        /** default=0 step=1 */
        margin_y?: _INT
    }

    // |=============================================================================|
    // | ImageTextMultiline [image_draw]                                             |
    // |=============================================================================|
    export interface ImageTextMultiline extends HasSingle_IMAGE, ComfyNode<ImageTextMultiline_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageTextMultiline_input = {
        /** */
        text: _STRING
        font: Enum_CLIPLoader_clip_name
        align: Enum_ImageTextMultiline_align
        /** default=28 min=undefined step=1 */
        size?: _INT
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=1 max=1 step=0.01 */
        alpha?: _FLOAT
        /** default=0 step=1 */
        margin_x?: _INT
        /** default=0 step=1 */
        margin_y?: _INT
    }

    // |=============================================================================|
    // | ImageTextMultilineOutlined [image_draw]                                     |
    // |=============================================================================|
    export interface ImageTextMultilineOutlined extends HasSingle_IMAGE, ComfyNode<ImageTextMultilineOutlined_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageTextMultilineOutlined_input = {
        /** */
        text: _STRING
        font: Enum_CLIPLoader_clip_name
        align: Enum_ImageTextMultiline_align
        /** default=28 min=undefined step=1 */
        size?: _INT
        /** default=255 max=255 step=1 */
        red?: _INT
        /** default=255 max=255 step=1 */
        green?: _INT
        /** default=255 max=255 step=1 */
        blue?: _INT
        /** default=1 step=1 */
        outline_size?: _INT
        /** default=0 max=255 step=1 */
        outline_red?: _INT
        /** default=0 max=255 step=1 */
        outline_green?: _INT
        /** default=0 max=255 step=1 */
        outline_blue?: _INT
        /** default=1 max=1 step=0.01 */
        alpha?: _FLOAT
        /** default=0 step=1 */
        margin_x?: _INT
        /** default=0 step=1 */
        margin_y?: _INT
    }

    // |=============================================================================|
    // | ImageTransformResizeAbsolute [image_transform]                              |
    // |=============================================================================|
    export interface ImageTransformResizeAbsolute extends HasSingle_IMAGE, ComfyNode<ImageTransformResizeAbsolute_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageTransformResizeAbsolute_input = {
        images: _IMAGE
        /** default=256 min=undefined step=1 */
        width?: _INT
        /** default=256 min=undefined step=1 */
        height?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageTransformResizeRelative [image_transform]                              |
    // |=============================================================================|
    export interface ImageTransformResizeRelative extends HasSingle_IMAGE, ComfyNode<ImageTransformResizeRelative_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageTransformResizeRelative_input = {
        images: _IMAGE
        /** default=1 step=0.1 */
        scale_width?: _FLOAT
        /** default=1 step=0.1 */
        scale_height?: _FLOAT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageTransformCropAbsolute [image_transform]                                |
    // |=============================================================================|
    export interface ImageTransformCropAbsolute extends HasSingle_IMAGE, ComfyNode<ImageTransformCropAbsolute_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageTransformCropAbsolute_input = {
        images: _IMAGE
        /** default=0 step=1 */
        start_x?: _INT
        /** default=0 step=1 */
        start_y?: _INT
        /** default=128 step=1 */
        end_x?: _INT
        /** default=128 step=1 */
        end_y?: _INT
    }

    // |=============================================================================|
    // | ImageTransformCropRelative [image_transform]                                |
    // |=============================================================================|
    export interface ImageTransformCropRelative extends HasSingle_IMAGE, ComfyNode<ImageTransformCropRelative_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageTransformCropRelative_input = {
        images: _IMAGE
        /** default=0.25 max=1 step=0.01 */
        start_x?: _FLOAT
        /** default=0.25 max=1 step=0.01 */
        start_y?: _FLOAT
        /** default=0.75 max=1 step=0.01 */
        end_x?: _FLOAT
        /** default=0.75 max=1 step=0.01 */
        end_y?: _FLOAT
    }

    // |=============================================================================|
    // | ImageTransformCropCorners [image_transform]                                 |
    // |=============================================================================|
    export interface ImageTransformCropCorners extends HasSingle_IMAGE, ComfyNode<ImageTransformCropCorners_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageTransformCropCorners_input = {
        images: _IMAGE
        /** default=180 max=360 step=1 */
        radius?: _INT
        top_left_corner: Enum_ImageDrawRectangleRounded_top_left_corner
        top_right_corner: Enum_ImageDrawRectangleRounded_top_left_corner
        bottom_right_corner: Enum_ImageDrawRectangleRounded_top_left_corner
        bottom_left_corner: Enum_ImageDrawRectangleRounded_top_left_corner
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageTransformPaddingAbsolute [image_transform]                             |
    // |=============================================================================|
    export interface ImageTransformPaddingAbsolute extends HasSingle_IMAGE, ComfyNode<ImageTransformPaddingAbsolute_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageTransformPaddingAbsolute_input = {
        images: _IMAGE
        /** default=64 min=undefined */
        add_width?: _INT
        /** default=64 min=undefined */
        add_height?: _INT
        method: Enum_ImageEffectsLensChromaticAberration_method
    }

    // |=============================================================================|
    // | ImageTransformPaddingRelative [image_transform]                             |
    // |=============================================================================|
    export interface ImageTransformPaddingRelative extends HasSingle_IMAGE, ComfyNode<ImageTransformPaddingRelative_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageTransformPaddingRelative_input = {
        images: _IMAGE
        /** default=0.25 step=0.1 */
        scale_width?: _FLOAT
        /** default=0.25 step=0.1 */
        scale_height?: _FLOAT
        method: Enum_ImageEffectsLensChromaticAberration_method
    }

    // |=============================================================================|
    // | ImageTransformRotate [image_transform]                                      |
    // |=============================================================================|
    export interface ImageTransformRotate extends HasSingle_IMAGE, ComfyNode<ImageTransformRotate_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageTransformRotate_input = {
        images: _IMAGE
        /** default=35 max=360 step=0.1 */
        angle?: _FLOAT
        expand: Enum_ImageDrawRectangleRounded_top_left_corner
        /** default=4 min=16 max=16 step=1 */
        SSAA?: _INT
        method: Enum_ImageDrawArc_method
    }

    // |=============================================================================|
    // | ImageTransformTranspose [image_transform]                                   |
    // |=============================================================================|
    export interface ImageTransformTranspose extends HasSingle_IMAGE, ComfyNode<ImageTransformTranspose_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageTransformTranspose_input = {
        images: _IMAGE
        method: Enum_ImageTransformTranspose_method
    }

    // |=============================================================================|
    // | ImpactSAMLoader ("SAMLoader" in ComfyUI) [ImpactPack]                       |
    // |=============================================================================|
    export interface ImpactSAMLoader extends HasSingle_SAM_MODEL, ComfyNode<ImpactSAMLoader_input> {
        SAM_MODEL: Slot<'SAM_MODEL', 0>
    }
    export type ImpactSAMLoader_input = {
        model_name: Enum_ImpactSAMLoader_model_name
    }

    // |=============================================================================|
    // | ImpactMMDetDetectorProvider ("MMDetDetectorProvider" in ComfyUI) [ImpactPack]   |
    // |=============================================================================|
    export interface ImpactMMDetDetectorProvider
        extends HasSingle_BBOX_DETECTOR,
            HasSingle_SEGM_DETECTOR,
            ComfyNode<ImpactMMDetDetectorProvider_input> {
        BBOX_DETECTOR: Slot<'BBOX_DETECTOR', 0>
        SEGM_DETECTOR: Slot<'SEGM_DETECTOR', 1>
    }
    export type ImpactMMDetDetectorProvider_input = {
        model_name: Enum_ImpactMMDetDetectorProvider_model_name
    }

    // |=============================================================================|
    // | ImpactCLIPSegDetectorProvider ("CLIPSegDetectorProvider" in ComfyUI) [ImpactPack_Util]   |
    // |=============================================================================|
    export interface ImpactCLIPSegDetectorProvider
        extends HasSingle_BBOX_DETECTOR,
            ComfyNode<ImpactCLIPSegDetectorProvider_input> {
        BBOX_DETECTOR: Slot<'BBOX_DETECTOR', 0>
    }
    export type ImpactCLIPSegDetectorProvider_input = {
        /** */
        text: _STRING
        /** default=7 min=15 max=15 step=0.1 */
        blur?: _FLOAT
        /** default=0.4 min=1 max=1 step=0.05 */
        threshold?: _FLOAT
        /** default=4 min=10 max=10 step=1 */
        dilation_factor?: _INT
    }

    // |=============================================================================|
    // | ImpactONNXDetectorProvider ("ONNXDetectorProvider" in ComfyUI) [ImpactPack]   |
    // |=============================================================================|
    export interface ImpactONNXDetectorProvider extends HasSingle_ONNX_DETECTOR, ComfyNode<ImpactONNXDetectorProvider_input> {
        ONNX_DETECTOR: Slot<'ONNX_DETECTOR', 0>
    }
    export type ImpactONNXDetectorProvider_input = {
        model_name: Enum_CLIPLoader_clip_name
    }

    // |=============================================================================|
    // | ImpactBitwiseAndMaskForEach ("BitwiseAndMaskForEach" in ComfyUI) [ImpactPack_Operation]   |
    // |=============================================================================|
    export interface ImpactBitwiseAndMaskForEach extends HasSingle_SEGS, ComfyNode<ImpactBitwiseAndMaskForEach_input> {
        SEGS: Slot<'SEGS', 0>
    }
    export type ImpactBitwiseAndMaskForEach_input = {
        base_segs: _SEGS
        mask_segs: _SEGS
    }

    // |=============================================================================|
    // | ImpactSubtractMaskForEach ("SubtractMaskForEach" in ComfyUI) [ImpactPack_Operation]   |
    // |=============================================================================|
    export interface ImpactSubtractMaskForEach extends HasSingle_SEGS, ComfyNode<ImpactSubtractMaskForEach_input> {
        SEGS: Slot<'SEGS', 0>
    }
    export type ImpactSubtractMaskForEach_input = {
        base_segs: _SEGS
        mask_segs: _SEGS
    }

    // |=============================================================================|
    // | ImpactDetailerForEach ("DetailerForEach" in ComfyUI) [ImpactPack_Detailer]   |
    // |=============================================================================|
    export interface ImpactDetailerForEach extends HasSingle_IMAGE, ComfyNode<ImpactDetailerForEach_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImpactDetailerForEach_input = {
        image: _IMAGE
        segs: _SEGS
        model: _MODEL
        vae: _VAE
        /** default=256 min=8192 max=8192 step=8 */
        guide_size?: _FLOAT
        guide_size_for: Enum_ImpactDetailerForEach_guide_size_for
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        positive: _CONDITIONING
        negative: _CONDITIONING
        /** default=0.5 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        /** default=5 min=100 max=100 step=1 */
        feather?: _INT
        noise_mask: Enum_ImpactDetailerForEach_noise_mask
        force_inpaint: Enum_ImpactDetailerForEach_noise_mask
    }

    // |=============================================================================|
    // | ImpactDetailerForEachDebug ("DetailerForEachDebug" in ComfyUI) [ImpactPack_Detailer]   |
    // |=============================================================================|
    export interface ImpactDetailerForEachDebug extends ComfyNode<ImpactDetailerForEachDebug_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
        IMAGE_2: Slot<'IMAGE', 2>
    }
    export type ImpactDetailerForEachDebug_input = {
        image: _IMAGE
        segs: _SEGS
        model: _MODEL
        vae: _VAE
        /** default=256 min=8192 max=8192 step=8 */
        guide_size?: _FLOAT
        guide_size_for: Enum_ImpactDetailerForEach_guide_size_for
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        positive: _CONDITIONING
        negative: _CONDITIONING
        /** default=0.5 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        /** default=5 min=100 max=100 step=1 */
        feather?: _INT
        noise_mask: Enum_ImpactDetailerForEach_noise_mask
        force_inpaint: Enum_ImpactDetailerForEach_noise_mask
    }

    // |=============================================================================|
    // | ImpactDetailerForEachPipe ("DetailerForEachPipe" in ComfyUI) [ImpactPack_Detailer]   |
    // |=============================================================================|
    export interface ImpactDetailerForEachPipe extends HasSingle_IMAGE, ComfyNode<ImpactDetailerForEachPipe_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImpactDetailerForEachPipe_input = {
        image: _IMAGE
        segs: _SEGS
        /** default=256 min=8192 max=8192 step=8 */
        guide_size?: _FLOAT
        guide_size_for: Enum_ImpactDetailerForEach_guide_size_for
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        /** default=0.5 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        /** default=5 min=100 max=100 step=1 */
        feather?: _INT
        noise_mask: Enum_ImpactDetailerForEach_noise_mask
        force_inpaint: Enum_ImpactDetailerForEach_noise_mask
        basic_pipe: _BASIC_PIPE
    }

    // |=============================================================================|
    // | ImpactDetailerForEachDebugPipe ("DetailerForEachDebugPipe" in ComfyUI) [ImpactPack_Detailer]   |
    // |=============================================================================|
    export interface ImpactDetailerForEachDebugPipe extends ComfyNode<ImpactDetailerForEachDebugPipe_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
        IMAGE_2: Slot<'IMAGE', 2>
    }
    export type ImpactDetailerForEachDebugPipe_input = {
        image: _IMAGE
        segs: _SEGS
        /** default=256 min=8192 max=8192 step=8 */
        guide_size?: _FLOAT
        guide_size_for: Enum_ImpactDetailerForEach_guide_size_for
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        /** default=0.5 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        /** default=5 min=100 max=100 step=1 */
        feather?: _INT
        noise_mask: Enum_ImpactDetailerForEach_noise_mask
        force_inpaint: Enum_ImpactDetailerForEach_noise_mask
        basic_pipe: _BASIC_PIPE
    }

    // |=============================================================================|
    // | ImpactSAMDetectorCombined ("SAMDetectorCombined" in ComfyUI) [ImpactPack_Detector]   |
    // |=============================================================================|
    export interface ImpactSAMDetectorCombined extends HasSingle_MASK, ComfyNode<ImpactSAMDetectorCombined_input> {
        MASK: Slot<'MASK', 0>
    }
    export type ImpactSAMDetectorCombined_input = {
        sam_model: _SAM_MODEL
        segs: _SEGS
        image: _IMAGE
        detection_hint: Enum_ImpactSAMDetectorCombined_detection_hint
        /** default=0 min=255 max=255 step=1 */
        dilation?: _INT
        /** default=0.93 min=1 max=1 step=0.01 */
        threshold?: _FLOAT
        /** default=0 min=1000 max=1000 step=1 */
        bbox_expansion?: _INT
        /** default=0.7 min=1 max=1 step=0.01 */
        mask_hint_threshold?: _FLOAT
        mask_hint_use_negative: Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
    }

    // |=============================================================================|
    // | ImpactFaceDetailer ("FaceDetailer" in ComfyUI) [ImpactPack_Simple]          |
    // |=============================================================================|
    export interface ImpactFaceDetailer extends HasSingle_MASK, HasSingle_DETAILER_PIPE, ComfyNode<ImpactFaceDetailer_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
        MASK: Slot<'MASK', 2>
        DETAILER_PIPE: Slot<'DETAILER_PIPE', 3>
    }
    export type ImpactFaceDetailer_input = {
        image: _IMAGE
        model: _MODEL
        vae: _VAE
        /** default=256 min=8192 max=8192 step=8 */
        guide_size?: _FLOAT
        guide_size_for: Enum_ImpactDetailerForEach_guide_size_for
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        positive: _CONDITIONING
        negative: _CONDITIONING
        /** default=0.5 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        /** default=5 min=100 max=100 step=1 */
        feather?: _INT
        noise_mask: Enum_ImpactDetailerForEach_noise_mask
        force_inpaint: Enum_ImpactDetailerForEach_noise_mask
        /** default=0.5 min=1 max=1 step=0.01 */
        bbox_threshold?: _FLOAT
        /** default=10 min=255 max=255 step=1 */
        bbox_dilation?: _INT
        /** default=3 min=10 max=10 step=0.1 */
        bbox_crop_factor?: _FLOAT
        sam_detection_hint: Enum_ImpactSAMDetectorCombined_detection_hint
        /** default=0 min=255 max=255 step=1 */
        sam_dilation?: _INT
        /** default=0.93 min=1 max=1 step=0.01 */
        sam_threshold?: _FLOAT
        /** default=0 min=1000 max=1000 step=1 */
        sam_bbox_expansion?: _INT
        /** default=0.7 min=1 max=1 step=0.01 */
        sam_mask_hint_threshold?: _FLOAT
        sam_mask_hint_use_negative: Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
        /** default=10 min=8192 max=8192 step=1 */
        drop_size?: _INT
        bbox_detector: _BBOX_DETECTOR
        sam_model_opt?: _SAM_MODEL
    }

    // |=============================================================================|
    // | ImpactFaceDetailerPipe ("FaceDetailerPipe" in ComfyUI) [ImpactPack_Simple]   |
    // |=============================================================================|
    export interface ImpactFaceDetailerPipe
        extends HasSingle_MASK,
            HasSingle_DETAILER_PIPE,
            ComfyNode<ImpactFaceDetailerPipe_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
        MASK: Slot<'MASK', 2>
        DETAILER_PIPE: Slot<'DETAILER_PIPE', 3>
    }
    export type ImpactFaceDetailerPipe_input = {
        image: _IMAGE
        detailer_pipe: _DETAILER_PIPE
        /** default=256 min=8192 max=8192 step=8 */
        guide_size?: _FLOAT
        guide_size_for: Enum_ImpactDetailerForEach_guide_size_for
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        /** default=0.5 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        /** default=5 min=100 max=100 step=1 */
        feather?: _INT
        noise_mask: Enum_ImpactDetailerForEach_noise_mask
        force_inpaint: Enum_ImpactDetailerForEach_noise_mask
        /** default=0.5 min=1 max=1 step=0.01 */
        bbox_threshold?: _FLOAT
        /** default=10 min=255 max=255 step=1 */
        bbox_dilation?: _INT
        /** default=3 min=10 max=10 step=0.1 */
        bbox_crop_factor?: _FLOAT
        sam_detection_hint: Enum_ImpactSAMDetectorCombined_detection_hint
        /** default=0 min=255 max=255 step=1 */
        sam_dilation?: _INT
        /** default=0.93 min=1 max=1 step=0.01 */
        sam_threshold?: _FLOAT
        /** default=0 min=1000 max=1000 step=1 */
        sam_bbox_expansion?: _INT
        /** default=0.7 min=1 max=1 step=0.01 */
        sam_mask_hint_threshold?: _FLOAT
        sam_mask_hint_use_negative: Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
        /** default=10 min=8192 max=8192 step=1 */
        drop_size?: _INT
    }

    // |=============================================================================|
    // | ImpactToDetailerPipe ("ToDetailerPipe" in ComfyUI) [ImpactPack_Pipe]        |
    // |=============================================================================|
    export interface ImpactToDetailerPipe extends HasSingle_DETAILER_PIPE, ComfyNode<ImpactToDetailerPipe_input> {
        DETAILER_PIPE: Slot<'DETAILER_PIPE', 0>
    }
    export type ImpactToDetailerPipe_input = {
        model: _MODEL
        vae: _VAE
        positive: _CONDITIONING
        negative: _CONDITIONING
        bbox_detector: _BBOX_DETECTOR
        sam_model_opt?: _SAM_MODEL
    }

    // |=============================================================================|
    // | ImpactFromDetailerPipe ("FromDetailerPipe" in ComfyUI) [ImpactPack_Pipe]    |
    // |=============================================================================|
    export interface ImpactFromDetailerPipe
        extends HasSingle_MODEL,
            HasSingle_VAE,
            HasSingle_BBOX_DETECTOR,
            HasSingle_SAM_MODEL,
            ComfyNode<ImpactFromDetailerPipe_input> {
        MODEL: Slot<'MODEL', 0>
        VAE: Slot<'VAE', 1>
        CONDITIONING: Slot<'CONDITIONING', 2>
        CONDITIONING_1: Slot<'CONDITIONING', 3>
        BBOX_DETECTOR: Slot<'BBOX_DETECTOR', 4>
        SAM_MODEL: Slot<'SAM_MODEL', 5>
    }
    export type ImpactFromDetailerPipe_input = {
        detailer_pipe: _DETAILER_PIPE
    }

    // |=============================================================================|
    // | ImpactToBasicPipe ("ToBasicPipe" in ComfyUI) [ImpactPack_Pipe]              |
    // |=============================================================================|
    export interface ImpactToBasicPipe extends HasSingle_BASIC_PIPE, ComfyNode<ImpactToBasicPipe_input> {
        BASIC_PIPE: Slot<'BASIC_PIPE', 0>
    }
    export type ImpactToBasicPipe_input = {
        model: _MODEL
        clip: _CLIP
        vae: _VAE
        positive: _CONDITIONING
        negative: _CONDITIONING
    }

    // |=============================================================================|
    // | ImpactFromBasicPipe ("FromBasicPipe" in ComfyUI) [ImpactPack_Pipe]          |
    // |=============================================================================|
    export interface ImpactFromBasicPipe
        extends HasSingle_MODEL,
            HasSingle_CLIP,
            HasSingle_VAE,
            ComfyNode<ImpactFromBasicPipe_input> {
        MODEL: Slot<'MODEL', 0>
        CLIP: Slot<'CLIP', 1>
        VAE: Slot<'VAE', 2>
        CONDITIONING: Slot<'CONDITIONING', 3>
        CONDITIONING_1: Slot<'CONDITIONING', 4>
    }
    export type ImpactFromBasicPipe_input = {
        basic_pipe: _BASIC_PIPE
    }

    // |=============================================================================|
    // | ImpactBasicPipeToDetailerPipe ("BasicPipeToDetailerPipe" in ComfyUI) [ImpactPack_Pipe]   |
    // |=============================================================================|
    export interface ImpactBasicPipeToDetailerPipe
        extends HasSingle_DETAILER_PIPE,
            ComfyNode<ImpactBasicPipeToDetailerPipe_input> {
        DETAILER_PIPE: Slot<'DETAILER_PIPE', 0>
    }
    export type ImpactBasicPipeToDetailerPipe_input = {
        basic_pipe: _BASIC_PIPE
        bbox_detector: _BBOX_DETECTOR
        sam_model_opt?: _SAM_MODEL
    }

    // |=============================================================================|
    // | ImpactDetailerPipeToBasicPipe ("DetailerPipeToBasicPipe" in ComfyUI) [ImpactPack_Pipe]   |
    // |=============================================================================|
    export interface ImpactDetailerPipeToBasicPipe extends HasSingle_BASIC_PIPE, ComfyNode<ImpactDetailerPipeToBasicPipe_input> {
        BASIC_PIPE: Slot<'BASIC_PIPE', 0>
    }
    export type ImpactDetailerPipeToBasicPipe_input = {
        detailer_pipe: _DETAILER_PIPE
        clip: _CLIP
    }

    // |=============================================================================|
    // | ImpactEditBasicPipe ("EditBasicPipe" in ComfyUI) [ImpactPack_Pipe]          |
    // |=============================================================================|
    export interface ImpactEditBasicPipe extends HasSingle_BASIC_PIPE, ComfyNode<ImpactEditBasicPipe_input> {
        BASIC_PIPE: Slot<'BASIC_PIPE', 0>
    }
    export type ImpactEditBasicPipe_input = {
        basic_pipe: _BASIC_PIPE
        model?: _MODEL
        clip?: _CLIP
        vae?: _VAE
        positive?: _CONDITIONING
        negative?: _CONDITIONING
    }

    // |=============================================================================|
    // | ImpactEditDetailerPipe ("EditDetailerPipe" in ComfyUI) [ImpactPack_Pipe]    |
    // |=============================================================================|
    export interface ImpactEditDetailerPipe extends HasSingle_DETAILER_PIPE, ComfyNode<ImpactEditDetailerPipe_input> {
        DETAILER_PIPE: Slot<'DETAILER_PIPE', 0>
    }
    export type ImpactEditDetailerPipe_input = {
        detailer_pipe: _DETAILER_PIPE
        model?: _MODEL
        vae?: _VAE
        positive?: _CONDITIONING
        negative?: _CONDITIONING
        bbox_detector?: _BBOX_DETECTOR
        sam_model?: _SAM_MODEL
    }

    // |=============================================================================|
    // | ImpactLatentPixelScale ("LatentPixelScale" in ComfyUI) [ImpactPack_Upscale]   |
    // |=============================================================================|
    export interface ImpactLatentPixelScale extends HasSingle_LATENT, ComfyNode<ImpactLatentPixelScale_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type ImpactLatentPixelScale_input = {
        samples: _LATENT
        scale_method: Enum_ImpactLatentPixelScale_scale_method
        /** default=1.5 min=10000 max=10000 step=0.1 */
        scale_factor?: _FLOAT
        vae: _VAE
        use_tiled_vae: Enum_ImpactDetailerForEach_noise_mask
        upscale_model_opt?: _UPSCALE_MODEL
    }

    // |=============================================================================|
    // | ImpactPixelKSampleUpscalerProvider ("PixelKSampleUpscalerProvider" in ComfyUI) [ImpactPack_Upscale]   |
    // |=============================================================================|
    export interface ImpactPixelKSampleUpscalerProvider
        extends HasSingle_UPSCALER,
            ComfyNode<ImpactPixelKSampleUpscalerProvider_input> {
        UPSCALER: Slot<'UPSCALER', 0>
    }
    export type ImpactPixelKSampleUpscalerProvider_input = {
        scale_method: Enum_ImpactLatentPixelScale_scale_method
        model: _MODEL
        vae: _VAE
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        positive: _CONDITIONING
        negative: _CONDITIONING
        /** default=1 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        use_tiled_vae: Enum_ImpactDetailerForEach_noise_mask
        upscale_model_opt?: _UPSCALE_MODEL
        pk_hook_opt?: _PK_HOOK
    }

    // |=============================================================================|
    // | ImpactPixelKSampleUpscalerProviderPipe ("PixelKSampleUpscalerProviderPipe" in ComfyUI) [ImpactPack_Upscale]   |
    // |=============================================================================|
    export interface ImpactPixelKSampleUpscalerProviderPipe
        extends HasSingle_UPSCALER,
            ComfyNode<ImpactPixelKSampleUpscalerProviderPipe_input> {
        UPSCALER: Slot<'UPSCALER', 0>
    }
    export type ImpactPixelKSampleUpscalerProviderPipe_input = {
        scale_method: Enum_ImpactLatentPixelScale_scale_method
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        /** default=1 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        use_tiled_vae: Enum_ImpactDetailerForEach_noise_mask
        basic_pipe: _BASIC_PIPE
        upscale_model_opt?: _UPSCALE_MODEL
        pk_hook_opt?: _PK_HOOK
    }

    // |=============================================================================|
    // | ImpactIterativeLatentUpscale ("IterativeLatentUpscale" in ComfyUI) [ImpactPack_Upscale]   |
    // |=============================================================================|
    export interface ImpactIterativeLatentUpscale extends HasSingle_LATENT, ComfyNode<ImpactIterativeLatentUpscale_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type ImpactIterativeLatentUpscale_input = {
        samples: _LATENT
        /** default=1.5 min=10000 max=10000 step=0.1 */
        upscale_factor?: _FLOAT
        /** default=3 min=10000 max=10000 step=1 */
        steps?: _INT
        /** default="" */
        temp_prefix?: _STRING
        upscaler: _UPSCALER
    }

    // |=============================================================================|
    // | ImpactIterativeImageUpscale ("IterativeImageUpscale" in ComfyUI) [ImpactPack_Upscale]   |
    // |=============================================================================|
    export interface ImpactIterativeImageUpscale extends HasSingle_IMAGE, ComfyNode<ImpactIterativeImageUpscale_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImpactIterativeImageUpscale_input = {
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

    // |=============================================================================|
    // | ImpactPixelTiledKSampleUpscalerProvider ("PixelTiledKSampleUpscalerProvider" in ComfyUI) [ImpactPack_Upscale]   |
    // |=============================================================================|
    export interface ImpactPixelTiledKSampleUpscalerProvider
        extends HasSingle_UPSCALER,
            ComfyNode<ImpactPixelTiledKSampleUpscalerProvider_input> {
        UPSCALER: Slot<'UPSCALER', 0>
    }
    export type ImpactPixelTiledKSampleUpscalerProvider_input = {
        scale_method: Enum_ImpactLatentPixelScale_scale_method
        model: _MODEL
        vae: _VAE
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        positive: _CONDITIONING
        negative: _CONDITIONING
        /** default=1 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        /** default=512 min=8192 max=8192 step=64 */
        tile_width?: _INT
        /** default=512 min=8192 max=8192 step=64 */
        tile_height?: _INT
        tiling_strategy: Enum_ImpactPixelTiledKSampleUpscalerProvider_tiling_strategy
        upscale_model_opt?: _UPSCALE_MODEL
        pk_hook_opt?: _PK_HOOK
    }

    // |=============================================================================|
    // | ImpactPixelTiledKSampleUpscalerProviderPipe ("PixelTiledKSampleUpscalerProviderPipe" in ComfyUI) [ImpactPack_Upscale]   |
    // |=============================================================================|
    export interface ImpactPixelTiledKSampleUpscalerProviderPipe
        extends HasSingle_UPSCALER,
            ComfyNode<ImpactPixelTiledKSampleUpscalerProviderPipe_input> {
        UPSCALER: Slot<'UPSCALER', 0>
    }
    export type ImpactPixelTiledKSampleUpscalerProviderPipe_input = {
        scale_method: Enum_ImpactLatentPixelScale_scale_method
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        /** default=1 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        /** default=512 min=8192 max=8192 step=64 */
        tile_width?: _INT
        /** default=512 min=8192 max=8192 step=64 */
        tile_height?: _INT
        tiling_strategy: Enum_ImpactPixelTiledKSampleUpscalerProvider_tiling_strategy
        basic_pipe: _BASIC_PIPE
        upscale_model_opt?: _UPSCALE_MODEL
        pk_hook_opt?: _PK_HOOK
    }

    // |=============================================================================|
    // | ImpactTwoSamplersForMaskUpscalerProvider ("TwoSamplersForMaskUpscalerProvider" in ComfyUI) [ImpactPack_Upscale]   |
    // |=============================================================================|
    export interface ImpactTwoSamplersForMaskUpscalerProvider
        extends HasSingle_UPSCALER,
            ComfyNode<ImpactTwoSamplersForMaskUpscalerProvider_input> {
        UPSCALER: Slot<'UPSCALER', 0>
    }
    export type ImpactTwoSamplersForMaskUpscalerProvider_input = {
        scale_method: Enum_ImpactLatentPixelScale_scale_method
        full_sample_schedule: Enum_ImpactTwoSamplersForMaskUpscalerProvider_full_sample_schedule
        use_tiled_vae: Enum_ImpactDetailerForEach_noise_mask
        base_sampler: _KSAMPLER
        mask_sampler: _KSAMPLER
        mask: _MASK
        vae: _VAE
        full_sampler_opt?: _KSAMPLER
        upscale_model_opt?: _UPSCALE_MODEL
        pk_hook_base_opt?: _PK_HOOK
        pk_hook_mask_opt?: _PK_HOOK
        pk_hook_full_opt?: _PK_HOOK
    }

    // |=============================================================================|
    // | ImpactTwoSamplersForMaskUpscalerProviderPipe ("TwoSamplersForMaskUpscalerProviderPipe" in ComfyUI) [ImpactPack_Upscale]   |
    // |=============================================================================|
    export interface ImpactTwoSamplersForMaskUpscalerProviderPipe
        extends HasSingle_UPSCALER,
            ComfyNode<ImpactTwoSamplersForMaskUpscalerProviderPipe_input> {
        UPSCALER: Slot<'UPSCALER', 0>
    }
    export type ImpactTwoSamplersForMaskUpscalerProviderPipe_input = {
        scale_method: Enum_ImpactLatentPixelScale_scale_method
        full_sample_schedule: Enum_ImpactTwoSamplersForMaskUpscalerProvider_full_sample_schedule
        use_tiled_vae: Enum_ImpactDetailerForEach_noise_mask
        base_sampler: _KSAMPLER
        mask_sampler: _KSAMPLER
        mask: _MASK
        basic_pipe: _BASIC_PIPE
        full_sampler_opt?: _KSAMPLER
        upscale_model_opt?: _UPSCALE_MODEL
        pk_hook_base_opt?: _PK_HOOK
        pk_hook_mask_opt?: _PK_HOOK
        pk_hook_full_opt?: _PK_HOOK
    }

    // |=============================================================================|
    // | ImpactPixelKSampleHookCombine ("PixelKSampleHookCombine" in ComfyUI) [ImpactPack_Upscale]   |
    // |=============================================================================|
    export interface ImpactPixelKSampleHookCombine extends HasSingle_PK_HOOK, ComfyNode<ImpactPixelKSampleHookCombine_input> {
        PK_HOOK: Slot<'PK_HOOK', 0>
    }
    export type ImpactPixelKSampleHookCombine_input = {
        hook1: _PK_HOOK
        hook2: _PK_HOOK
    }

    // |=============================================================================|
    // | ImpactDenoiseScheduleHookProvider ("DenoiseScheduleHookProvider" in ComfyUI) [ImpactPack_Upscale]   |
    // |=============================================================================|
    export interface ImpactDenoiseScheduleHookProvider
        extends HasSingle_PK_HOOK,
            ComfyNode<ImpactDenoiseScheduleHookProvider_input> {
        PK_HOOK: Slot<'PK_HOOK', 0>
    }
    export type ImpactDenoiseScheduleHookProvider_input = {
        schedule_for_iteration: Enum_ImpactDenoiseScheduleHookProvider_schedule_for_iteration
        /** default=0.2 min=100 max=100 */
        target_denoise?: _FLOAT
    }

    // |=============================================================================|
    // | ImpactCfgScheduleHookProvider ("CfgScheduleHookProvider" in ComfyUI) [ImpactPack_Upscale]   |
    // |=============================================================================|
    export interface ImpactCfgScheduleHookProvider extends HasSingle_PK_HOOK, ComfyNode<ImpactCfgScheduleHookProvider_input> {
        PK_HOOK: Slot<'PK_HOOK', 0>
    }
    export type ImpactCfgScheduleHookProvider_input = {
        schedule_for_iteration: Enum_ImpactDenoiseScheduleHookProvider_schedule_for_iteration
        /** default=3 min=100 max=100 */
        target_cfg?: _FLOAT
    }

    // |=============================================================================|
    // | ImpactBitwiseAndMask ("BitwiseAndMask" in ComfyUI) [ImpactPack_Operation]   |
    // |=============================================================================|
    export interface ImpactBitwiseAndMask extends HasSingle_MASK, ComfyNode<ImpactBitwiseAndMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type ImpactBitwiseAndMask_input = {
        mask1: _MASK
        mask2: _MASK
    }

    // |=============================================================================|
    // | ImpactSubtractMask ("SubtractMask" in ComfyUI) [ImpactPack_Operation]       |
    // |=============================================================================|
    export interface ImpactSubtractMask extends HasSingle_MASK, ComfyNode<ImpactSubtractMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type ImpactSubtractMask_input = {
        mask1: _MASK
        mask2: _MASK
    }

    // |=============================================================================|
    // | ImpactSegsMask ("Segs & Mask" in ComfyUI) [ImpactPack_Operation]            |
    // |=============================================================================|
    export interface ImpactSegsMask extends HasSingle_SEGS, ComfyNode<ImpactSegsMask_input> {
        SEGS: Slot<'SEGS', 0>
    }
    export type ImpactSegsMask_input = {
        segs: _SEGS
        mask: _MASK
    }

    // |=============================================================================|
    // | ImpactEmptySegs ("EmptySegs" in ComfyUI) [ImpactPack_Util]                  |
    // |=============================================================================|
    export interface ImpactEmptySegs extends HasSingle_SEGS, ComfyNode<ImpactEmptySegs_input> {
        SEGS: Slot<'SEGS', 0>
    }
    export type ImpactEmptySegs_input = {}

    // |=============================================================================|
    // | ImpactMaskToSEGS ("MaskToSEGS" in ComfyUI) [ImpactPack_Operation]           |
    // |=============================================================================|
    export interface ImpactMaskToSEGS extends HasSingle_SEGS, ComfyNode<ImpactMaskToSEGS_input> {
        SEGS: Slot<'SEGS', 0>
    }
    export type ImpactMaskToSEGS_input = {
        mask: _MASK
        combined: Enum_ImpactMaskToSEGS_combined
        /** default=3 min=10 max=10 step=0.1 */
        crop_factor?: _FLOAT
        bbox_fill: Enum_ImpactDetailerForEach_noise_mask
        /** default=10 min=8192 max=8192 step=1 */
        drop_size?: _INT
    }

    // |=============================================================================|
    // | ImpactToBinaryMask ("ToBinaryMask" in ComfyUI) [ImpactPack_Operation]       |
    // |=============================================================================|
    export interface ImpactToBinaryMask extends HasSingle_MASK, ComfyNode<ImpactToBinaryMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type ImpactToBinaryMask_input = {
        mask: _MASK
    }

    // |=============================================================================|
    // | ImpactBboxDetectorSEGS ("BboxDetectorSEGS" in ComfyUI) [ImpactPack_Detector]   |
    // |=============================================================================|
    export interface ImpactBboxDetectorSEGS extends HasSingle_SEGS, ComfyNode<ImpactBboxDetectorSEGS_input> {
        SEGS: Slot<'SEGS', 0>
    }
    export type ImpactBboxDetectorSEGS_input = {
        bbox_detector: _BBOX_DETECTOR
        image: _IMAGE
        /** default=0.5 min=1 max=1 step=0.01 */
        threshold?: _FLOAT
        /** default=10 min=255 max=255 step=1 */
        dilation?: _INT
        /** default=3 min=10 max=10 step=0.1 */
        crop_factor?: _FLOAT
        /** default=10 min=8192 max=8192 step=1 */
        drop_size?: _INT
    }

    // |=============================================================================|
    // | ImpactSegmDetectorSEGS ("SegmDetectorSEGS" in ComfyUI) [ImpactPack_Detector]   |
    // |=============================================================================|
    export interface ImpactSegmDetectorSEGS extends HasSingle_SEGS, ComfyNode<ImpactSegmDetectorSEGS_input> {
        SEGS: Slot<'SEGS', 0>
    }
    export type ImpactSegmDetectorSEGS_input = {
        segm_detector: _SEGM_DETECTOR
        image: _IMAGE
        /** default=0.5 min=1 max=1 step=0.01 */
        threshold?: _FLOAT
        /** default=10 min=255 max=255 step=1 */
        dilation?: _INT
        /** default=3 min=10 max=10 step=0.1 */
        crop_factor?: _FLOAT
        /** default=10 min=8192 max=8192 step=1 */
        drop_size?: _INT
    }

    // |=============================================================================|
    // | ImpactONNXDetectorSEGS ("ONNXDetectorSEGS" in ComfyUI) [ImpactPack_Detector]   |
    // |=============================================================================|
    export interface ImpactONNXDetectorSEGS extends HasSingle_SEGS, ComfyNode<ImpactONNXDetectorSEGS_input> {
        SEGS: Slot<'SEGS', 0>
    }
    export type ImpactONNXDetectorSEGS_input = {
        onnx_detector: _ONNX_DETECTOR
        image: _IMAGE
        /** default=0.8 min=1 max=1 step=0.01 */
        threshold?: _FLOAT
        /** default=10 min=255 max=255 step=1 */
        dilation?: _INT
        /** default=1 min=10 max=10 step=0.1 */
        crop_factor?: _FLOAT
        /** default=10 min=8192 max=8192 step=1 */
        drop_size?: _INT
    }

    // |=============================================================================|
    // | ImpactBboxDetectorCombined_v2 ("BboxDetectorCombined_v2" in ComfyUI) [ImpactPack_Detector]   |
    // |=============================================================================|
    export interface ImpactBboxDetectorCombined_v2 extends HasSingle_MASK, ComfyNode<ImpactBboxDetectorCombined_v2_input> {
        MASK: Slot<'MASK', 0>
    }
    export type ImpactBboxDetectorCombined_v2_input = {
        bbox_detector: _BBOX_DETECTOR
        image: _IMAGE
        /** default=0.5 min=1 max=1 step=0.01 */
        threshold?: _FLOAT
        /** default=4 min=255 max=255 step=1 */
        dilation?: _INT
    }

    // |=============================================================================|
    // | ImpactSegmDetectorCombined_v2 ("SegmDetectorCombined_v2" in ComfyUI) [ImpactPack_Detector]   |
    // |=============================================================================|
    export interface ImpactSegmDetectorCombined_v2 extends HasSingle_MASK, ComfyNode<ImpactSegmDetectorCombined_v2_input> {
        MASK: Slot<'MASK', 0>
    }
    export type ImpactSegmDetectorCombined_v2_input = {
        segm_detector: _SEGM_DETECTOR
        image: _IMAGE
        /** default=0.5 min=1 max=1 step=0.01 */
        threshold?: _FLOAT
        /** default=0 min=255 max=255 step=1 */
        dilation?: _INT
    }

    // |=============================================================================|
    // | ImpactSegsToCombinedMask ("SegsToCombinedMask" in ComfyUI) [ImpactPack_Operation]   |
    // |=============================================================================|
    export interface ImpactSegsToCombinedMask extends HasSingle_MASK, ComfyNode<ImpactSegsToCombinedMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type ImpactSegsToCombinedMask_input = {
        segs: _SEGS
    }

    // |=============================================================================|
    // | ImpactKSamplerProvider ("KSamplerProvider" in ComfyUI) [ImpactPack_Sampler]   |
    // |=============================================================================|
    export interface ImpactKSamplerProvider extends HasSingle_KSAMPLER, ComfyNode<ImpactKSamplerProvider_input> {
        KSAMPLER: Slot<'KSAMPLER', 0>
    }
    export type ImpactKSamplerProvider_input = {
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        /** default=1 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        basic_pipe: _BASIC_PIPE
    }

    // |=============================================================================|
    // | ImpactTwoSamplersForMask ("TwoSamplersForMask" in ComfyUI) [ImpactPack_Sampler]   |
    // |=============================================================================|
    export interface ImpactTwoSamplersForMask extends HasSingle_LATENT, ComfyNode<ImpactTwoSamplersForMask_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type ImpactTwoSamplersForMask_input = {
        latent_image: _LATENT
        base_sampler: _KSAMPLER
        mask_sampler: _KSAMPLER
        mask: _MASK
    }

    // |=============================================================================|
    // | ImpactTiledKSamplerProvider ("TiledKSamplerProvider" in ComfyUI) [ImpactPack_Sampler]   |
    // |=============================================================================|
    export interface ImpactTiledKSamplerProvider extends HasSingle_KSAMPLER, ComfyNode<ImpactTiledKSamplerProvider_input> {
        KSAMPLER: Slot<'KSAMPLER', 0>
    }
    export type ImpactTiledKSamplerProvider_input = {
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        /** default=1 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        /** default=512 min=8192 max=8192 step=64 */
        tile_width?: _INT
        /** default=512 min=8192 max=8192 step=64 */
        tile_height?: _INT
        tiling_strategy: Enum_ImpactPixelTiledKSampleUpscalerProvider_tiling_strategy
        basic_pipe: _BASIC_PIPE
    }

    // |=============================================================================|
    // | ImpactPreviewBridge ("PreviewBridge" in ComfyUI) [ImpactPack_Util]          |
    // |=============================================================================|
    export interface ImpactPreviewBridge extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImpactPreviewBridge_input> {
        IMAGE: Slot<'IMAGE', 0>
        MASK: Slot<'MASK', 1>
    }
    export type ImpactPreviewBridge_input = {
        images: _IMAGE
        image?: Enum_ImpactPreviewBridge_image
    }

    // |=============================================================================|
    // | ImpactImageSender ("ImageSender" in ComfyUI) [ImpactPack_Util]              |
    // |=============================================================================|
    export interface ImpactImageSender extends ComfyNode<ImpactImageSender_input> {}
    export type ImpactImageSender_input = {
        images: _IMAGE
        /** default="ImgSender" */
        filename_prefix?: _STRING
        /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
        link_id?: _INT
    }

    // |=============================================================================|
    // | ImpactImageReceiver ("ImageReceiver" in ComfyUI) [ImpactPack_Util]          |
    // |=============================================================================|
    export interface ImpactImageReceiver extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImpactImageReceiver_input> {
        IMAGE: Slot<'IMAGE', 0>
        MASK: Slot<'MASK', 1>
    }
    export type ImpactImageReceiver_input = {
        image: Enum_LoadImage_image
        /** default=0 min=9223372036854776000 max=9223372036854776000 step=1 */
        link_id?: _INT
    }

    // |=============================================================================|
    // | ImpactImageMaskSwitch ("ImageMaskSwitch" in ComfyUI) [ImpactPack_Util]      |
    // |=============================================================================|
    export interface ImpactImageMaskSwitch extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImpactImageMaskSwitch_input> {
        IMAGE: Slot<'IMAGE', 0>
        MASK: Slot<'MASK', 1>
    }
    export type ImpactImageMaskSwitch_input = {
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

    // |=============================================================================|
    // | ImpactLatentSwitch ("LatentSwitch" in ComfyUI) [ImpactPack_Util]            |
    // |=============================================================================|
    export interface ImpactLatentSwitch extends HasSingle_LATENT, ComfyNode<ImpactLatentSwitch_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type ImpactLatentSwitch_input = {
        /** default=1 min=4 max=4 step=1 */
        select?: _INT
        latent1: _IMAGE
        latent2_opt?: _IMAGE
        latent3_opt?: _IMAGE
        latent4_opt?: _IMAGE
    }

    // |=============================================================================|
    // | ImpactSEGSSwitch ("SEGSSwitch" in ComfyUI) [ImpactPack_Util]                |
    // |=============================================================================|
    export interface ImpactSEGSSwitch extends HasSingle_SEGS, ComfyNode<ImpactSEGSSwitch_input> {
        SEGS: Slot<'SEGS', 0>
    }
    export type ImpactSEGSSwitch_input = {
        /** default=1 min=4 max=4 step=1 */
        select?: _INT
        segs: _SEGS
        segs2_opt?: _SEGS
        segs3_opt?: _SEGS
        segs4_opt?: _SEGS
    }

    // |=============================================================================|
    // | ImpactImpactWildcardProcessor ("ImpactWildcardProcessor" in ComfyUI) [ImpactPack_Prompt]   |
    // |=============================================================================|
    export interface ImpactImpactWildcardProcessor extends HasSingle_STRING, ComfyNode<ImpactImpactWildcardProcessor_input> {
        STRING: Slot<'STRING', 0>
    }
    export type ImpactImpactWildcardProcessor_input = {
        /** */
        wildcard_text: _STRING
        /** */
        populated_text: _STRING
        mode: Enum_ImpactImpactWildcardProcessor_mode
    }

    // |=============================================================================|
    // | ImpactImpactLogger ("ImpactLogger" in ComfyUI) [ImpactPack_Debug]           |
    // |=============================================================================|
    export interface ImpactImpactLogger extends ComfyNode<ImpactImpactLogger_input> {}
    export type ImpactImpactLogger_input = {
        /** default="" */
        text?: _STRING
    }

    // |=============================================================================|
    // | ImpactSEGSDetailer ("SEGSDetailer" in ComfyUI) [ImpactPack_Detailer]        |
    // |=============================================================================|
    export interface ImpactSEGSDetailer extends HasSingle_SEGS, ComfyNode<ImpactSEGSDetailer_input> {
        SEGS: Slot<'SEGS', 0>
    }
    export type ImpactSEGSDetailer_input = {
        image: _IMAGE
        segs: _SEGS
        /** default=256 min=8192 max=8192 step=8 */
        guide_size?: _FLOAT
        guide_size_for: Enum_ImpactDetailerForEach_guide_size_for
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        /** default=0.5 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        noise_mask: Enum_ImpactDetailerForEach_noise_mask
        force_inpaint: Enum_ImpactDetailerForEach_noise_mask
        basic_pipe: _BASIC_PIPE
    }

    // |=============================================================================|
    // | ImpactSEGSPaste ("SEGSPaste" in ComfyUI) [ImpactPack_Detailer]              |
    // |=============================================================================|
    export interface ImpactSEGSPaste extends HasSingle_IMAGE, ComfyNode<ImpactSEGSPaste_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImpactSEGSPaste_input = {
        image: _IMAGE
        segs: _SEGS
        /** default=5 min=100 max=100 step=1 */
        feather?: _INT
    }

    // |=============================================================================|
    // | ImpactSEGSPreview ("SEGSPreview" in ComfyUI) [ImpactPack_Detailer]          |
    // |=============================================================================|
    export interface ImpactSEGSPreview extends ComfyNode<ImpactSEGSPreview_input> {}
    export type ImpactSEGSPreview_input = {
        segs: _SEGS
        fallback_image_opt?: _IMAGE
    }

    // |=============================================================================|
    // | ImpactMaskPainter ("MaskPainter" in ComfyUI) [ImpactPack_Legacy]            |
    // |=============================================================================|
    export interface ImpactMaskPainter extends HasSingle_MASK, ComfyNode<ImpactMaskPainter_input> {
        MASK: Slot<'MASK', 0>
    }
    export type ImpactMaskPainter_input = {
        images: _IMAGE
        image?: Enum_ImpactPreviewBridge_image
    }

    // |=============================================================================|
    // | ImpactMMDetLoader ("MMDetLoader" in ComfyUI) [ImpactPack_Legacy]            |
    // |=============================================================================|
    export interface ImpactMMDetLoader extends HasSingle_BBOX_MODEL, HasSingle_SEGM_MODEL, ComfyNode<ImpactMMDetLoader_input> {
        BBOX_MODEL: Slot<'BBOX_MODEL', 0>
        SEGM_MODEL: Slot<'SEGM_MODEL', 1>
    }
    export type ImpactMMDetLoader_input = {
        model_name: Enum_ImpactMMDetDetectorProvider_model_name
    }

    // |=============================================================================|
    // | ImpactSegsMaskCombine ("SegsMaskCombine" in ComfyUI) [ImpactPack_Legacy]    |
    // |=============================================================================|
    export interface ImpactSegsMaskCombine extends HasSingle_MASK, ComfyNode<ImpactSegsMaskCombine_input> {
        MASK: Slot<'MASK', 0>
    }
    export type ImpactSegsMaskCombine_input = {
        segs: _SEGS
        image: _IMAGE
    }

    // |=============================================================================|
    // | ImpactBboxDetectorForEach ("BboxDetectorForEach" in ComfyUI) [ImpactPack_Legacy]   |
    // |=============================================================================|
    export interface ImpactBboxDetectorForEach extends HasSingle_SEGS, ComfyNode<ImpactBboxDetectorForEach_input> {
        SEGS: Slot<'SEGS', 0>
    }
    export type ImpactBboxDetectorForEach_input = {
        bbox_model: _BBOX_MODEL
        image: _IMAGE
        /** default=0.5 min=1 max=1 step=0.01 */
        threshold?: _FLOAT
        /** default=10 min=255 max=255 step=1 */
        dilation?: _INT
        /** default=3 min=10 max=10 step=0.1 */
        crop_factor?: _FLOAT
    }

    // |=============================================================================|
    // | ImpactSegmDetectorForEach ("SegmDetectorForEach" in ComfyUI) [ImpactPack_Legacy]   |
    // |=============================================================================|
    export interface ImpactSegmDetectorForEach extends HasSingle_SEGS, ComfyNode<ImpactSegmDetectorForEach_input> {
        SEGS: Slot<'SEGS', 0>
    }
    export type ImpactSegmDetectorForEach_input = {
        segm_model: _SEGM_MODEL
        image: _IMAGE
        /** default=0.5 min=1 max=1 step=0.01 */
        threshold?: _FLOAT
        /** default=10 min=255 max=255 step=1 */
        dilation?: _INT
        /** default=3 min=10 max=10 step=0.1 */
        crop_factor?: _FLOAT
    }

    // |=============================================================================|
    // | ImpactBboxDetectorCombined ("BboxDetectorCombined" in ComfyUI) [ImpactPack_Legacy]   |
    // |=============================================================================|
    export interface ImpactBboxDetectorCombined extends HasSingle_MASK, ComfyNode<ImpactBboxDetectorCombined_input> {
        MASK: Slot<'MASK', 0>
    }
    export type ImpactBboxDetectorCombined_input = {
        bbox_model: _BBOX_MODEL
        image: _IMAGE
        /** default=0.5 min=1 max=1 step=0.01 */
        threshold?: _FLOAT
        /** default=4 min=255 max=255 step=1 */
        dilation?: _INT
    }

    // |=============================================================================|
    // | ImpactSegmDetectorCombined ("SegmDetectorCombined" in ComfyUI) [ImpactPack_Legacy]   |
    // |=============================================================================|
    export interface ImpactSegmDetectorCombined extends HasSingle_MASK, ComfyNode<ImpactSegmDetectorCombined_input> {
        MASK: Slot<'MASK', 0>
    }
    export type ImpactSegmDetectorCombined_input = {
        segm_model: _SEGM_MODEL
        image: _IMAGE
        /** default=0.5 min=1 max=1 step=0.01 */
        threshold?: _FLOAT
        /** default=0 min=255 max=255 step=1 */
        dilation?: _INT
    }

    // |=============================================================================|
    // | Save_as_webp [image]                                                        |
    // |=============================================================================|
    export interface Save_as_webp extends ComfyNode<Save_as_webp_input> {}
    export type Save_as_webp_input = {
        images: _IMAGE
        /** default="ComfyUI" */
        filename_prefix?: _STRING
        mode: Enum_Save_as_webp_mode
        /** default=80 min=100 max=100 step=1 */
        compression?: _INT
    }

    // |=============================================================================|
    // | BNK_CutoffBasePrompt [conditioning_cutoff]                                  |
    // |=============================================================================|
    export interface BNK_CutoffBasePrompt extends HasSingle_CLIPREGION, ComfyNode<BNK_CutoffBasePrompt_input> {
        CLIPREGION: Slot<'CLIPREGION', 0>
    }
    export type BNK_CutoffBasePrompt_input = {
        /** */
        text: _STRING
        clip: _CLIP
    }

    // |=============================================================================|
    // | BNK_CutoffSetRegions [conditioning_cutoff]                                  |
    // |=============================================================================|
    export interface BNK_CutoffSetRegions extends HasSingle_CLIPREGION, ComfyNode<BNK_CutoffSetRegions_input> {
        CLIPREGION: Slot<'CLIPREGION', 0>
    }
    export type BNK_CutoffSetRegions_input = {
        clip_regions: _CLIPREGION
        /** */
        region_text: _STRING
        /** */
        target_text: _STRING
        /** default=1 min=10 max=10 step=0.05 */
        weight?: _FLOAT
    }

    // |=============================================================================|
    // | BNK_CutoffRegionsToConditioning [conditioning_cutoff]                       |
    // |=============================================================================|
    export interface BNK_CutoffRegionsToConditioning
        extends HasSingle_CONDITIONING,
            ComfyNode<BNK_CutoffRegionsToConditioning_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type BNK_CutoffRegionsToConditioning_input = {
        clip_regions: _CLIPREGION
        /** default="" */
        mask_token?: _STRING
        /** default=1 min=1 max=1 step=0.05 */
        strict_mask?: _FLOAT
        /** default=1 min=1 max=1 step=0.05 */
        start_from_masked?: _FLOAT
    }

    // |=============================================================================|
    // | BNK_CutoffRegionsToConditioning_ADV [conditioning_cutoff]                   |
    // |=============================================================================|
    export interface BNK_CutoffRegionsToConditioning_ADV
        extends HasSingle_CONDITIONING,
            ComfyNode<BNK_CutoffRegionsToConditioning_ADV_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type BNK_CutoffRegionsToConditioning_ADV_input = {
        clip_regions: _CLIPREGION
        /** default="" */
        mask_token?: _STRING
        /** default=1 min=1 max=1 step=0.05 */
        strict_mask?: _FLOAT
        /** default=1 min=1 max=1 step=0.05 */
        start_from_masked?: _FLOAT
        token_normalization: Enum_BNK_CutoffRegionsToConditioning_ADV_token_normalization
        weight_interpretation: Enum_BNK_CutoffRegionsToConditioning_ADV_weight_interpretation
    }

    // |=============================================================================|
    // | MultiLatentComposite [Davemane42]                                           |
    // |=============================================================================|
    export interface MultiLatentComposite extends HasSingle_LATENT, ComfyNode<MultiLatentComposite_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type MultiLatentComposite_input = {
        samples_to: _LATENT
        samples_from0: _LATENT
    }

    // |=============================================================================|
    // | MultiAreaConditioning [Davemane42]                                          |
    // |=============================================================================|
    export interface MultiAreaConditioning extends HasSingle_CONDITIONING, ComfyNode<MultiAreaConditioning_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
        INT: Slot<'INT', 1>
        INT_1: Slot<'INT', 2>
    }
    export type MultiAreaConditioning_input = {
        conditioning0: _CONDITIONING
        conditioning1: _CONDITIONING
    }

    // |=============================================================================|
    // | ConditioningUpscale [Davemane42]                                            |
    // |=============================================================================|
    export interface ConditioningUpscale extends HasSingle_CONDITIONING, ComfyNode<ConditioningUpscale_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type ConditioningUpscale_input = {
        conditioning: _CONDITIONING
        /** default=2 min=100 max=100 step=0.5 */
        scalar?: _INT
    }

    // |=============================================================================|
    // | ConditioningStretch [Davemane42]                                            |
    // |=============================================================================|
    export interface ConditioningStretch extends HasSingle_CONDITIONING, ComfyNode<ConditioningStretch_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type ConditioningStretch_input = {
        conditioning: _CONDITIONING
        /** default=512 min=8192 max=8192 step=64 */
        resolutionX?: _INT
        /** default=512 min=8192 max=8192 step=64 */
        resolutionY?: _INT
        /** default=512 min=8192 max=8192 step=64 */
        newWidth?: _INT
        /** default=512 min=8192 max=8192 step=64 */
        newHeight?: _INT
    }

    // |=============================================================================|
    // | BNK_NoisyLatentImage [latent_noise]                                         |
    // |=============================================================================|
    export interface BNK_NoisyLatentImage extends HasSingle_LATENT, ComfyNode<BNK_NoisyLatentImage_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type BNK_NoisyLatentImage_input = {
        source: Enum_BNK_NoisyLatentImage_source
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=512 min=8192 max=8192 step=8 */
        width?: _INT
        /** default=512 min=8192 max=8192 step=8 */
        height?: _INT
        /** default=1 min=64 max=64 */
        batch_size?: _INT
    }

    // |=============================================================================|
    // | BNK_DuplicateBatchIndex [latent]                                            |
    // |=============================================================================|
    export interface BNK_DuplicateBatchIndex extends HasSingle_LATENT, ComfyNode<BNK_DuplicateBatchIndex_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type BNK_DuplicateBatchIndex_input = {
        latents: _LATENT
        /** default=0 min=63 max=63 */
        batch_index?: _INT
        /** default=1 min=64 max=64 */
        batch_size?: _INT
    }

    // |=============================================================================|
    // | BNK_SlerpLatent [latent]                                                    |
    // |=============================================================================|
    export interface BNK_SlerpLatent extends HasSingle_LATENT, ComfyNode<BNK_SlerpLatent_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type BNK_SlerpLatent_input = {
        latents1: _LATENT
        /** default=0.5 min=1 max=1 step=0.01 */
        factor?: _FLOAT
        latents2?: _LATENT
        mask?: _MASK
    }

    // |=============================================================================|
    // | BNK_GetSigma [latent_noise]                                                 |
    // |=============================================================================|
    export interface BNK_GetSigma extends HasSingle_FLOAT, ComfyNode<BNK_GetSigma_input> {
        FLOAT: Slot<'FLOAT', 0>
    }
    export type BNK_GetSigma_input = {
        model: _MODEL
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        /** default=10000 min=10000 max=10000 */
        steps?: _INT
        /** default=0 min=10000 max=10000 */
        start_at_step?: _INT
        /** default=10000 min=10000 max=10000 */
        end_at_step?: _INT
    }

    // |=============================================================================|
    // | BNK_InjectNoise [latent_noise]                                              |
    // |=============================================================================|
    export interface BNK_InjectNoise extends HasSingle_LATENT, ComfyNode<BNK_InjectNoise_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type BNK_InjectNoise_input = {
        latents: _LATENT
        /** default=1 min=20 max=20 step=0.01 */
        strength?: _FLOAT
        noise?: _LATENT
        mask?: _MASK
    }

    // |=============================================================================|
    // | BNK_Unsampler [sampling]                                                    |
    // |=============================================================================|
    export interface BNK_Unsampler extends HasSingle_LATENT, ComfyNode<BNK_Unsampler_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type BNK_Unsampler_input = {
        model: _MODEL
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=0 min=10000 max=10000 */
        end_at_step?: _INT
        /** default=1 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        normalize: Enum_KSamplerAdvanced_add_noise
        positive: _CONDITIONING
        negative: _CONDITIONING
        latent_image: _LATENT
    }

    // |=============================================================================|
    // | BNK_TiledKSamplerAdvanced [sampling]                                        |
    // |=============================================================================|
    export interface BNK_TiledKSamplerAdvanced extends HasSingle_LATENT, ComfyNode<BNK_TiledKSamplerAdvanced_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type BNK_TiledKSamplerAdvanced_input = {
        model: _MODEL
        add_noise: Enum_KSamplerAdvanced_add_noise
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        noise_seed?: _INT
        /** default=512 min=8192 max=8192 step=64 */
        tile_width?: _INT
        /** default=512 min=8192 max=8192 step=64 */
        tile_height?: _INT
        tiling_strategy: Enum_ImpactPixelTiledKSampleUpscalerProvider_tiling_strategy
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        positive: _CONDITIONING
        negative: _CONDITIONING
        latent_image: _LATENT
        /** default=0 min=10000 max=10000 */
        start_at_step?: _INT
        /** default=10000 min=10000 max=10000 */
        end_at_step?: _INT
        return_with_leftover_noise: Enum_KSamplerAdvanced_add_noise
    }

    // |=============================================================================|
    // | BNK_TiledKSampler [sampling]                                                |
    // |=============================================================================|
    export interface BNK_TiledKSampler extends HasSingle_LATENT, ComfyNode<BNK_TiledKSampler_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type BNK_TiledKSampler_input = {
        model: _MODEL
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=512 min=8192 max=8192 step=64 */
        tile_width?: _INT
        /** default=512 min=8192 max=8192 step=64 */
        tile_height?: _INT
        tiling_strategy: Enum_ImpactPixelTiledKSampleUpscalerProvider_tiling_strategy
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        positive: _CONDITIONING
        negative: _CONDITIONING
        latent_image: _LATENT
        /** default=1 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
    }

    // |=============================================================================|
    // | ClipSeg [image]                                                             |
    // |=============================================================================|
    export interface ClipSeg extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ClipSeg_input> {
        IMAGE: Slot<'IMAGE', 0>
        MASK: Slot<'MASK', 1>
    }
    export type ClipSeg_input = {
        image: _IMAGE
        /** default="hand, foot, face" */
        clip?: _STRING
        /** default="cuda" */
        device?: Enum_ClipSeg_device
        /** default=352 min=2048 max=2048 step=8 */
        width?: _INT
        /** default=352 min=2048 max=2048 step=8 */
        height?: _INT
        /** default=-1 min=255 max=255 step=1 */
        threshold?: _INT
        /** default="sum" */
        mode?: Enum_ClipSeg_mode
    }

    // |=============================================================================|
    // | HEDPreprocessor [preprocessors_edge_line]                                   |
    // |=============================================================================|
    export interface HEDPreprocessor extends HasSingle_IMAGE, ComfyNode<HEDPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type HEDPreprocessor_input = {
        image: _IMAGE
        /** default="v1.1" */
        version?: Enum_HEDPreprocessor_version
        /** default="enable" */
        safe?: Enum_KSamplerAdvanced_add_noise
    }

    // |=============================================================================|
    // | ScribblePreprocessor [preprocessors_edge_line]                              |
    // |=============================================================================|
    export interface ScribblePreprocessor extends HasSingle_IMAGE, ComfyNode<ScribblePreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ScribblePreprocessor_input = {
        image: _IMAGE
    }

    // |=============================================================================|
    // | FakeScribblePreprocessor [preprocessors_edge_line]                          |
    // |=============================================================================|
    export interface FakeScribblePreprocessor extends HasSingle_IMAGE, ComfyNode<FakeScribblePreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type FakeScribblePreprocessor_input = {
        image: _IMAGE
    }

    // |=============================================================================|
    // | BinaryPreprocessor [preprocessors_edge_line]                                |
    // |=============================================================================|
    export interface BinaryPreprocessor extends HasSingle_IMAGE, ComfyNode<BinaryPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type BinaryPreprocessor_input = {
        image: _IMAGE
        /** default=0 min=255 max=255 step=1 */
        threshold?: _INT
    }

    // |=============================================================================|
    // | PiDiNetPreprocessor [preprocessors_edge_line]                               |
    // |=============================================================================|
    export interface PiDiNetPreprocessor extends HasSingle_IMAGE, ComfyNode<PiDiNetPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type PiDiNetPreprocessor_input = {
        image: _IMAGE
        /** default="enable" */
        safe?: Enum_KSamplerAdvanced_add_noise
    }

    // |=============================================================================|
    // | LineArtPreprocessor [preprocessors_edge_line]                               |
    // |=============================================================================|
    export interface LineArtPreprocessor extends HasSingle_IMAGE, ComfyNode<LineArtPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type LineArtPreprocessor_input = {
        image: _IMAGE
        /** default="disable" */
        coarse?: Enum_KSamplerAdvanced_add_noise
    }

    // |=============================================================================|
    // | AnimeLineArtPreprocessor [preprocessors_edge_line]                          |
    // |=============================================================================|
    export interface AnimeLineArtPreprocessor extends HasSingle_IMAGE, ComfyNode<AnimeLineArtPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type AnimeLineArtPreprocessor_input = {
        image: _IMAGE
    }

    // |=============================================================================|
    // | Manga2AnimeLineArtPreprocessor ("Manga2Anime-LineArtPreprocessor" in ComfyUI) [preprocessors_edge_line]   |
    // |=============================================================================|
    export interface Manga2AnimeLineArtPreprocessor extends HasSingle_IMAGE, ComfyNode<Manga2AnimeLineArtPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type Manga2AnimeLineArtPreprocessor_input = {
        image: _IMAGE
    }

    // |=============================================================================|
    // | MiDaSNormalMapPreprocessor ("MiDaS-NormalMapPreprocessor" in ComfyUI) [preprocessors_normal_depth_map]   |
    // |=============================================================================|
    export interface MiDaSNormalMapPreprocessor extends HasSingle_IMAGE, ComfyNode<MiDaSNormalMapPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MiDaSNormalMapPreprocessor_input = {
        image: _IMAGE
        /** default=6.283185307179586 min=15.707963267948966 max=15.707963267948966 step=0.05 */
        a?: _FLOAT
        /** default=0.05 min=1 max=1 step=0.05 */
        bg_threshold?: _FLOAT
    }

    // |=============================================================================|
    // | ZoeDepthMapPreprocessor ("Zoe-DepthMapPreprocessor" in ComfyUI) [preprocessors_normal_depth_map]   |
    // |=============================================================================|
    export interface ZoeDepthMapPreprocessor extends HasSingle_IMAGE, ComfyNode<ZoeDepthMapPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ZoeDepthMapPreprocessor_input = {
        image: _IMAGE
    }

    // |=============================================================================|
    // | BAENormalMapPreprocessor ("BAE-NormalMapPreprocessor" in ComfyUI) [preprocessors_normal_depth_map]   |
    // |=============================================================================|
    export interface BAENormalMapPreprocessor extends HasSingle_IMAGE, ComfyNode<BAENormalMapPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type BAENormalMapPreprocessor_input = {
        image: _IMAGE
    }

    // |=============================================================================|
    // | OpenposePreprocessor [preprocessors_pose]                                   |
    // |=============================================================================|
    export interface OpenposePreprocessor extends HasSingle_IMAGE, ComfyNode<OpenposePreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type OpenposePreprocessor_input = {
        image: _IMAGE
        /** default="enable" */
        detect_hand?: Enum_KSamplerAdvanced_add_noise
        /** default="enable" */
        detect_body?: Enum_KSamplerAdvanced_add_noise
        /** default="enable" */
        detect_face?: Enum_KSamplerAdvanced_add_noise
        /** default="v1.1" */
        version?: Enum_HEDPreprocessor_version
    }

    // |=============================================================================|
    // | MediaPipeHandPosePreprocessor ("MediaPipe-HandPosePreprocessor" in ComfyUI) [preprocessors_pose]   |
    // |=============================================================================|
    export interface MediaPipeHandPosePreprocessor extends HasSingle_IMAGE, ComfyNode<MediaPipeHandPosePreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MediaPipeHandPosePreprocessor_input = {
        image: _IMAGE
        /** default="enable" */
        detect_pose?: Enum_KSamplerAdvanced_add_noise
        /** default="enable" */
        detect_hands?: Enum_KSamplerAdvanced_add_noise
    }

    // |=============================================================================|
    // | OneFormerCOCOSemSegPreprocessor ("OneFormer-COCO-SemSegPreprocessor" in ComfyUI) [preprocessors_semseg]   |
    // |=============================================================================|
    export interface OneFormerCOCOSemSegPreprocessor extends HasSingle_IMAGE, ComfyNode<OneFormerCOCOSemSegPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type OneFormerCOCOSemSegPreprocessor_input = {
        image: _IMAGE
    }

    // |=============================================================================|
    // | OneFormerADE20KSemSegPreprocessor ("OneFormer-ADE20K-SemSegPreprocessor" in ComfyUI) [preprocessors_semseg]   |
    // |=============================================================================|
    export interface OneFormerADE20KSemSegPreprocessor
        extends HasSingle_IMAGE,
            ComfyNode<OneFormerADE20KSemSegPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type OneFormerADE20KSemSegPreprocessor_input = {
        image: _IMAGE
    }

    // |=============================================================================|
    // | MediaPipeFaceMeshPreprocessor ("MediaPipe-FaceMeshPreprocessor" in ComfyUI) [preprocessors_face_mesh]   |
    // |=============================================================================|
    export interface MediaPipeFaceMeshPreprocessor extends HasSingle_IMAGE, ComfyNode<MediaPipeFaceMeshPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MediaPipeFaceMeshPreprocessor_input = {
        image: _IMAGE
        /** default=10 min=50 max=50 step=1 */
        max_faces?: _INT
        /** default=0.5 min=1 max=1 step=0.1 */
        min_confidence?: _FLOAT
    }

    // |=============================================================================|
    // | ColorPreprocessor [preprocessors_color_style]                               |
    // |=============================================================================|
    export interface ColorPreprocessor extends HasSingle_IMAGE, ComfyNode<ColorPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ColorPreprocessor_input = {
        image: _IMAGE
    }

    // |=============================================================================|
    // | TilePreprocessor [preprocessors_tile]                                       |
    // |=============================================================================|
    export interface TilePreprocessor extends HasSingle_IMAGE, ComfyNode<TilePreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type TilePreprocessor_input = {
        image: _IMAGE
        /** default=3 min=10 max=10 step=1 */
        pyrUp_iters?: _INT
    }

    // |=============================================================================|
    // | InpaintPreprocessor [preprocessors_inpaint]                                 |
    // |=============================================================================|
    export interface InpaintPreprocessor extends HasSingle_IMAGE, ComfyNode<InpaintPreprocessor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type InpaintPreprocessor_input = {
        image: _IMAGE
        mask: _MASK
    }

    // |=============================================================================|
    // | CLIPRegionsBasePrompt [conditioning_cutoff]                                 |
    // |=============================================================================|
    export interface CLIPRegionsBasePrompt extends HasSingle_CLIPREGION, ComfyNode<CLIPRegionsBasePrompt_input> {
        CLIPREGION: Slot<'CLIPREGION', 0>
    }
    export type CLIPRegionsBasePrompt_input = {
        /** */
        text: _STRING
        clip: _CLIP
    }

    // |=============================================================================|
    // | CLIPSetRegion [conditioning_cutoff]                                         |
    // |=============================================================================|
    export interface CLIPSetRegion extends HasSingle_CLIPREGION, ComfyNode<CLIPSetRegion_input> {
        CLIPREGION: Slot<'CLIPREGION', 0>
    }
    export type CLIPSetRegion_input = {
        clip_regions: _CLIPREGION
        /** */
        region_text: _STRING
        /** */
        target_text: _STRING
        /** default=1 min=10 max=10 step=0.05 */
        weight?: _FLOAT
    }

    // |=============================================================================|
    // | CLIPRegionsToConditioning [conditioning_cutoff]                             |
    // |=============================================================================|
    export interface CLIPRegionsToConditioning extends HasSingle_CONDITIONING, ComfyNode<CLIPRegionsToConditioning_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type CLIPRegionsToConditioning_input = {
        clip_regions: _CLIPREGION
        /** default="" */
        mask_token?: _STRING
        /** default=1 min=1 max=1 step=0.05 */
        strict_mask?: _FLOAT
        /** default=1 min=1 max=1 step=0.05 */
        start_from_masked?: _FLOAT
    }

    // |=============================================================================|
    // | KSamplerEfficient ("KSampler (Efficient)" in ComfyUI) [Efficiency Nodes_Sampling]   |
    // |=============================================================================|
    export interface KSamplerEfficient
        extends HasSingle_MODEL,
            HasSingle_LATENT,
            HasSingle_VAE,
            HasSingle_IMAGE,
            ComfyNode<KSamplerEfficient_input> {
        MODEL: Slot<'MODEL', 0>
        CONDITIONING: Slot<'CONDITIONING', 1>
        CONDITIONING_1: Slot<'CONDITIONING', 2>
        LATENT: Slot<'LATENT', 3>
        VAE: Slot<'VAE', 4>
        IMAGE: Slot<'IMAGE', 5>
    }
    export type KSamplerEfficient_input = {
        sampler_state: Enum_KSamplerEfficient_sampler_state
        model: _MODEL
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=7 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        positive: _CONDITIONING
        negative: _CONDITIONING
        latent_image: _LATENT
        /** default=1 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
        preview_image: Enum_KSamplerEfficient_preview_image
        optional_vae?: _VAE
        script?: _SCRIPT
    }

    // |=============================================================================|
    // | EfficientLoader ("Efficient Loader" in ComfyUI) [Efficiency Nodes_Loaders]   |
    // |=============================================================================|
    export interface EfficientLoader
        extends HasSingle_MODEL,
            HasSingle_LATENT,
            HasSingle_VAE,
            HasSingle_DEPENDENCIES,
            ComfyNode<EfficientLoader_input> {
        MODEL: Slot<'MODEL', 0>
        CONDITIONING: Slot<'CONDITIONING', 1>
        CONDITIONING_1: Slot<'CONDITIONING', 2>
        LATENT: Slot<'LATENT', 3>
        VAE: Slot<'VAE', 4>
        DEPENDENCIES: Slot<'DEPENDENCIES', 5>
    }
    export type EfficientLoader_input = {
        ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
        vae_name: Enum_EfficientLoader_vae_name
        /** default=-1 min=-1 max=-1 step=1 */
        clip_skip?: _INT
        lora_name: Enum_EfficientLoader_lora_name
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
    }

    // |=============================================================================|
    // | XYPlot ("XY Plot" in ComfyUI) [Efficiency Nodes_XY Plot]                    |
    // |=============================================================================|
    export interface XYPlot extends HasSingle_SCRIPT, ComfyNode<XYPlot_input> {
        SCRIPT: Slot<'SCRIPT', 0>
    }
    export type XYPlot_input = {
        /** default=0 min=500 max=500 step=5 */
        grid_spacing?: _INT
        XY_flip: Enum_ImpactMaskToSEGS_combined
        Y_label_orientation: Enum_XYPlot_Y_label_orientation
        cache_models: Enum_ImpactMaskToSEGS_combined
        ksampler_output_image: Enum_XYPlot_ksampler_output_image
        dependencies?: _DEPENDENCIES
        X?: _XY
        Y?: _XY
    }

    // |=============================================================================|
    // | XYInputSeedsBatch ("XY Input: Seeds++ Batch" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputSeedsBatch extends HasSingle_XY, ComfyNode<XYInputSeedsBatch_input> {
        XY: Slot<'XY', 0>
    }
    export type XYInputSeedsBatch_input = {
        /** default=1 min=50 max=50 */
        batch_count?: _INT
    }

    // |=============================================================================|
    // | XYInputSteps ("XY Input: Steps" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputSteps extends HasSingle_XY, ComfyNode<XYInputSteps_input> {
        XY: Slot<'XY', 0>
    }
    export type XYInputSteps_input = {
        /** default=0 min=5 max=5 */
        selection_count?: _INT
        /** default=20 min=10000 max=10000 */
        steps_1?: _INT
        /** default=20 min=10000 max=10000 */
        steps_2?: _INT
        /** default=20 min=10000 max=10000 */
        steps_3?: _INT
        /** default=20 min=10000 max=10000 */
        steps_4?: _INT
        /** default=20 min=10000 max=10000 */
        steps_5?: _INT
    }

    // |=============================================================================|
    // | XYInputCFGScale ("XY Input: CFG Scale" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputCFGScale extends HasSingle_XY, ComfyNode<XYInputCFGScale_input> {
        XY: Slot<'XY', 0>
    }
    export type XYInputCFGScale_input = {
        /** default=0 min=5 max=5 */
        selection_count?: _INT
        /** default=7 min=100 max=100 */
        cfg_1?: _FLOAT
        /** default=7 min=100 max=100 */
        cfg_2?: _FLOAT
        /** default=7 min=100 max=100 */
        cfg_3?: _FLOAT
        /** default=7 min=100 max=100 */
        cfg_4?: _FLOAT
        /** default=7 min=100 max=100 */
        cfg_5?: _FLOAT
    }

    // |=============================================================================|
    // | XYInputSampler ("XY Input: Sampler" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputSampler extends HasSingle_XY, ComfyNode<XYInputSampler_input> {
        XY: Slot<'XY', 0>
    }
    export type XYInputSampler_input = {
        sampler_1: Enum_XYInputSampler_sampler_1
        scheduler_1: Enum_XYInputSampler_scheduler_1
        sampler_2: Enum_XYInputSampler_sampler_1
        scheduler_2: Enum_XYInputSampler_scheduler_1
        sampler_3: Enum_XYInputSampler_sampler_1
        scheduler_3: Enum_XYInputSampler_scheduler_1
        sampler_4: Enum_XYInputSampler_sampler_1
        scheduler_4: Enum_XYInputSampler_scheduler_1
        sampler_5: Enum_XYInputSampler_sampler_1
        scheduler_5: Enum_XYInputSampler_scheduler_1
    }

    // |=============================================================================|
    // | XYInputScheduler ("XY Input: Scheduler" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputScheduler extends HasSingle_XY, ComfyNode<XYInputScheduler_input> {
        XY: Slot<'XY', 0>
    }
    export type XYInputScheduler_input = {
        scheduler_1: Enum_XYInputSampler_scheduler_1
        scheduler_2: Enum_XYInputSampler_scheduler_1
        scheduler_3: Enum_XYInputSampler_scheduler_1
        scheduler_4: Enum_XYInputSampler_scheduler_1
        scheduler_5: Enum_XYInputSampler_scheduler_1
    }

    // |=============================================================================|
    // | XYInputDenoise ("XY Input: Denoise" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputDenoise extends HasSingle_XY, ComfyNode<XYInputDenoise_input> {
        XY: Slot<'XY', 0>
    }
    export type XYInputDenoise_input = {
        /** default=0 min=5 max=5 */
        select_count?: _INT
        /** default=1 min=1 max=1 step=0.01 */
        denoise_1?: _FLOAT
        /** default=1 min=1 max=1 step=0.01 */
        denoise_2?: _FLOAT
        /** default=1 min=1 max=1 step=0.01 */
        denoise_3?: _FLOAT
        /** default=1 min=1 max=1 step=0.01 */
        denoise_4?: _FLOAT
        /** default=1 min=1 max=1 step=0.01 */
        denoise_5?: _FLOAT
    }

    // |=============================================================================|
    // | XYInputVAE ("XY Input: VAE" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputVAE extends HasSingle_XY, ComfyNode<XYInputVAE_input> {
        XY: Slot<'XY', 0>
    }
    export type XYInputVAE_input = {
        vae_name_1: Enum_XYInputVAE_vae_name_1
        vae_name_2: Enum_XYInputVAE_vae_name_1
        vae_name_3: Enum_XYInputVAE_vae_name_1
        vae_name_4: Enum_XYInputVAE_vae_name_1
        vae_name_5: Enum_XYInputVAE_vae_name_1
    }

    // |=============================================================================|
    // | XYInputPositivePromptSR ("XY Input: Positive Prompt S/R" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputPositivePromptSR extends HasSingle_XY, ComfyNode<XYInputPositivePromptSR_input> {
        XY: Slot<'XY', 0>
    }
    export type XYInputPositivePromptSR_input = {
        /** default="" */
        search_txt?: _STRING
        /** default=0 min=4 max=4 */
        replace_count?: _INT
        /** default="" */
        replace_1?: _STRING
        /** default="" */
        replace_2?: _STRING
        /** default="" */
        replace_3?: _STRING
        /** default="" */
        replace_4?: _STRING
    }

    // |=============================================================================|
    // | XYInputNegativePromptSR ("XY Input: Negative Prompt S/R" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputNegativePromptSR extends HasSingle_XY, ComfyNode<XYInputNegativePromptSR_input> {
        XY: Slot<'XY', 0>
    }
    export type XYInputNegativePromptSR_input = {
        /** default="" */
        search_txt?: _STRING
        /** default=0 min=4 max=4 */
        replace_count?: _INT
        /** default="" */
        replace_1?: _STRING
        /** default="" */
        replace_2?: _STRING
        /** default="" */
        replace_3?: _STRING
        /** default="" */
        replace_4?: _STRING
    }

    // |=============================================================================|
    // | XYInputCheckpoint ("XY Input: Checkpoint" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputCheckpoint extends HasSingle_XY, ComfyNode<XYInputCheckpoint_input> {
        XY: Slot<'XY', 0>
    }
    export type XYInputCheckpoint_input = {
        ckpt_name_1: Enum_XYInputCheckpoint_ckpt_name_1
        /** default=-1 min=-1 max=-1 step=1 */
        clip_skip1?: _INT
        ckpt_name_2: Enum_XYInputCheckpoint_ckpt_name_1
        /** default=-1 min=-1 max=-1 step=1 */
        clip_skip2?: _INT
        ckpt_name_3: Enum_XYInputCheckpoint_ckpt_name_1
        /** default=-1 min=-1 max=-1 step=1 */
        clip_skip3?: _INT
        ckpt_name_4: Enum_XYInputCheckpoint_ckpt_name_1
        /** default=-1 min=-1 max=-1 step=1 */
        clip_skip4?: _INT
        ckpt_name_5: Enum_XYInputCheckpoint_ckpt_name_1
        /** default=-1 min=-1 max=-1 step=1 */
        clip_skip5?: _INT
    }

    // |=============================================================================|
    // | XYInputClipSkip ("XY Input: Clip Skip" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputClipSkip extends HasSingle_XY, ComfyNode<XYInputClipSkip_input> {
        XY: Slot<'XY', 0>
    }
    export type XYInputClipSkip_input = {
        /** default=0 min=5 max=5 */
        select_count?: _INT
        /** default=-1 min=-1 max=-1 step=1 */
        clip_skip_1?: _INT
        /** default=-2 min=-1 max=-1 step=1 */
        clip_skip_2?: _INT
        /** default=-3 min=-1 max=-1 step=1 */
        clip_skip_3?: _INT
        /** default=-4 min=-1 max=-1 step=1 */
        clip_skip_4?: _INT
        /** default=-5 min=-1 max=-1 step=1 */
        clip_skip_5?: _INT
    }

    // |=============================================================================|
    // | XYInputLoRA ("XY Input: LoRA" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputLoRA extends HasSingle_XY, ComfyNode<XYInputLoRA_input> {
        XY: Slot<'XY', 0>
    }
    export type XYInputLoRA_input = {
        /** default=1 min=10 max=10 step=0.01 */
        model_strengths?: _FLOAT
        /** default=1 min=10 max=10 step=0.01 */
        clip_strengths?: _FLOAT
        lora_name_1: Enum_EfficientLoader_lora_name
        lora_name_2: Enum_EfficientLoader_lora_name
        lora_name_3: Enum_EfficientLoader_lora_name
        lora_name_4: Enum_EfficientLoader_lora_name
        lora_name_5: Enum_EfficientLoader_lora_name
    }

    // |=============================================================================|
    // | XYInputLoRAAdvanced ("XY Input: LoRA (Advanced)" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputLoRAAdvanced extends HasSingle_XY, ComfyNode<XYInputLoRAAdvanced_input> {
        XY: Slot<'XY', 0>
    }
    export type XYInputLoRAAdvanced_input = {
        lora_name_1: Enum_EfficientLoader_lora_name
        /** default=1 min=10 max=10 step=0.01 */
        model_str_1?: _FLOAT
        /** default=1 min=10 max=10 step=0.01 */
        clip_str_1?: _FLOAT
        lora_name_2: Enum_EfficientLoader_lora_name
        /** default=1 min=10 max=10 step=0.01 */
        model_str_2?: _FLOAT
        /** default=1 min=10 max=10 step=0.01 */
        clip_str_2?: _FLOAT
        lora_name_3: Enum_EfficientLoader_lora_name
        /** default=1 min=10 max=10 step=0.01 */
        model_str_3?: _FLOAT
        /** default=1 min=10 max=10 step=0.01 */
        clip_str_3?: _FLOAT
        lora_name_4: Enum_EfficientLoader_lora_name
        /** default=1 min=10 max=10 step=0.01 */
        model_str_4?: _FLOAT
        /** default=1 min=10 max=10 step=0.01 */
        clip_str_4?: _FLOAT
        lora_name_5: Enum_EfficientLoader_lora_name
        /** default=1 min=10 max=10 step=0.01 */
        model_str_5?: _FLOAT
        /** default=1 min=10 max=10 step=0.01 */
        clip_str_5?: _FLOAT
    }

    // |=============================================================================|
    // | XYInputManualXYEntry ("XY Input: Manual XY Entry" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface XYInputManualXYEntry extends ComfyNode<XYInputManualXYEntry_input> {
        XY: Slot<'XY', 0>
        XY_1: Slot<'XY', 1>
    }
    export type XYInputManualXYEntry_input = {
        X_type: Enum_XYInputManualXYEntry_X_type
        /** default="" */
        X_value?: _STRING
        Y_type: Enum_XYInputManualXYEntry_X_type
        /** default="" */
        Y_value?: _STRING
    }

    // |=============================================================================|
    // | ManualXYEntryInfo ("Manual XY Entry Info" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface ManualXYEntryInfo extends ComfyNode<ManualXYEntryInfo_input> {}
    export type ManualXYEntryInfo_input = {
        /** default="_____________SYNTAX_____________\n(X/Y_types)     (X/Y_values)\nSeeds++ Batch   batch_count\nSteps           steps_1;steps_2;...\nCFG Scale       cfg_1;cfg_2;...\nSampler(1)      sampler_1;sampler_2;...\nSampler(2)      sampler_1,scheduler_1;...\nSampler(3)      sampler_1;...;,default_scheduler\nScheduler       scheduler_1;scheduler_2;...\nDenoise         denoise_1;denoise_2;...\nVAE             vae_1;vae_2;vae_3;...\n+Prompt S/R     search_txt;replace_1;replace_2;...\n-Prompt S/R     search_txt;replace_1;replace_2;...\nCheckpoint(1)   ckpt_1;ckpt_2;ckpt_3;...\nCheckpoint(2)   ckpt_1,clip_skip_1;...\nCheckpoint(3)   ckpt_1;ckpt_2;...;,default_clip_skip\nClip Skip       clip_skip_1;clip_skip_2;...\nLoRA(1)         lora_1;lora_2;lora_3;...\nLoRA(2)         lora_1;...;,default_model_str,default_clip_str\nLoRA(3)         lora_1,model_str_1,clip_str_1;...\n\n____________SAMPLERS____________\neuler;\neuler_ancestral;\nheun;\ndpm_2;\ndpm_2_ancestral;\nlms;\ndpm_fast;\ndpm_adaptive;\ndpmpp_2s_ancestral;\ndpmpp_sde;\ndpmpp_2m;\ndpmpp_2m_sde;\nddim;\nuni_pc;\nuni_pc_bh2\n\n___________SCHEDULERS___________\nnormal;\nkarras;\nexponential;\nsimple;\nddim_uniform\n\n_____________VAES_______________\nblessed2.vae.pt;\nkl-f8-anime2.ckpt;\norangemix.vae.pt;\nvae-ft-mse-840000-ema-pruned.safetensors\n\n___________CHECKPOINTS__________\nAOM3A1_orangemixs.safetensors;\nAOM3A3_orangemixs.safetensors;\nAbyssOrangeMix2_hard.safetensors;\nDeliberate-inpainting.safetensors;\nangel1_36224.safetensors;\nanything-v3-fp16-pruned.safetensors;\ndeliberate_v2.safetensors;\nghostmix_v12.safetensors;\nlyriel_v15.safetensors;\nmistoonAnime_v10.safetensors;\nmistoonAnime_v10Inpainting.safetensors;\nrealisticVisionV20_v20.safetensors;\nrevAnimated_v121.safetensors;\nrevAnimated_v121Inp-inpainting.safetensors;\nrevAnimated_v122.safetensors;\ntoonyou_beta1.safetensors;\nv1-5-pruned-emaonly.ckpt;\nv2-1_512-ema-pruned.safetensors;\nv2-1_768-ema-pruned.safetensors;\nwd-1-5-beta2-fp16.safetensors\n\n_____________LORAS______________\nanimemix_16.safetensors;\nanimemix_v3_offset.safetensors;\nchars\\dark_magician_girl.safetensors;\nchars\\yorha_noDOT_2_type_b.safetensors;\ncolors\\LowRa.safetensors;\ncolors\\theovercomer8sContrastFix_sd15.safetensors;\ncolors\\theovercomer8sContrastFix_sd21768.safetensors;\nstyles\\ConstructionyardAIV3.safetensors;\nstyles\\StonepunkAI-000011.safetensors;\nstyles\\ToonYou_Style.safetensors;\nstyles\\baroqueAI.safetensors;\nstyles\\pixel_f2.safetensors;\ntest\\Moxin_10.safetensors;\ntest\\animeLineartMangaLike_v30MangaLike.safetensors;\nutils\\charTurnBetaLora.safetensors\n" */
        notes?: _STRING
    }

    // |=============================================================================|
    // | JoinXYInputsOfSameType ("Join XY Inputs of Same Type" in ComfyUI) [Efficiency Nodes_XY Plot_XY Inputs]   |
    // |=============================================================================|
    export interface JoinXYInputsOfSameType extends HasSingle_XY, ComfyNode<JoinXYInputsOfSameType_input> {
        XY: Slot<'XY', 0>
    }
    export type JoinXYInputsOfSameType_input = {
        XY_1: _XY
        XY_2: _XY
    }

    // |=============================================================================|
    // | ImageOverlay ("Image Overlay" in ComfyUI) [Efficiency Nodes_Image]          |
    // |=============================================================================|
    export interface ImageOverlay extends HasSingle_IMAGE, ComfyNode<ImageOverlay_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageOverlay_input = {
        base_image: _IMAGE
        overlay_image: _IMAGE
        overlay_resize: Enum_ImageOverlay_overlay_resize
        resize_method: Enum_ImpactLatentPixelScale_scale_method
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

    // |=============================================================================|
    // | EvaluateIntegers ("Evaluate Integers" in ComfyUI) [Efficiency Nodes_Simple Eval]   |
    // |=============================================================================|
    export interface EvaluateIntegers
        extends HasSingle_INT,
            HasSingle_FLOAT,
            HasSingle_STRING,
            ComfyNode<EvaluateIntegers_input> {
        INT: Slot<'INT', 0>
        FLOAT: Slot<'FLOAT', 1>
        STRING: Slot<'STRING', 2>
    }
    export type EvaluateIntegers_input = {
        /** default="((a + b) - c) / 2" */
        python_expression?: _STRING
        print_to_console: Enum_ImpactMaskToSEGS_combined
        /** default=0 min=48000 max=48000 step=1 */
        a?: _INT
        /** default=0 min=48000 max=48000 step=1 */
        b?: _INT
        /** default=0 min=48000 max=48000 step=1 */
        c?: _INT
    }

    // |=============================================================================|
    // | EvaluateFloats ("Evaluate Floats" in ComfyUI) [Efficiency Nodes_Simple Eval]   |
    // |=============================================================================|
    export interface EvaluateFloats extends HasSingle_INT, HasSingle_FLOAT, HasSingle_STRING, ComfyNode<EvaluateFloats_input> {
        INT: Slot<'INT', 0>
        FLOAT: Slot<'FLOAT', 1>
        STRING: Slot<'STRING', 2>
    }
    export type EvaluateFloats_input = {
        /** default="((a + b) - c) / 2" */
        python_expression?: _STRING
        print_to_console: Enum_ImpactMaskToSEGS_combined
        /** default=0 min=1.7976931348623157e+308 max=1.7976931348623157e+308 step=1 */
        a?: _FLOAT
        /** default=0 min=1.7976931348623157e+308 max=1.7976931348623157e+308 step=1 */
        b?: _FLOAT
        /** default=0 min=1.7976931348623157e+308 max=1.7976931348623157e+308 step=1 */
        c?: _FLOAT
    }

    // |=============================================================================|
    // | EvaluateStrings ("Evaluate Strings" in ComfyUI) [Efficiency Nodes_Simple Eval]   |
    // |=============================================================================|
    export interface EvaluateStrings extends HasSingle_STRING, ComfyNode<EvaluateStrings_input> {
        STRING: Slot<'STRING', 0>
    }
    export type EvaluateStrings_input = {
        /** default="a + b + c" */
        python_expression?: _STRING
        print_to_console: Enum_ImpactMaskToSEGS_combined
        /** default="Hello" */
        a?: _STRING
        /** default=" World" */
        b?: _STRING
        /** default="!" */
        c?: _STRING
    }

    // |=============================================================================|
    // | SimpleEvalExamples ("Simple Eval Examples" in ComfyUI) [Efficiency Nodes_Simple Eval]   |
    // |=============================================================================|
    export interface SimpleEvalExamples extends ComfyNode<SimpleEvalExamples_input> {}
    export type SimpleEvalExamples_input = {
        /** default="The Evaluate Integers, Floats, and Strings nodes \nnow employ the SimpleEval library, enabling secure \ncreation and execution of custom Python expressions.\n\n(https://github.com/danthedeckie/simpleeval)\n\nBelow is a short list of what is possible.\n______________________________________________\n\n\"EVALUATE INTEGERS/FLOATS\" NODE EXPRESSION EXAMPLES:\n\nAddition: a + b + c\nSubtraction: a - b - c\nMultiplication: a * b * c\nDivision: a / b / c\nModulo: a % b % c\nExponentiation: a ** b ** c\nFloor Division: a // b // c\nAbsolute Value: abs(a) + abs(b) + abs(c)\nMaximum: max(a, b, c)\nMinimum: min(a, b, c)\nSum of Squares: a**2 + b**2 + c**2\nBitwise And: a & b & c\nBitwise Or: a | b | c\nBitwise Xor: a ^ b ^ c\nLeft Shift: a << 1 + b << 1 + c << 1\nRight Shift: a >> 1 + b >> 1 + c >> 1\nGreater Than Comparison: a > b > c\nLess Than Comparison: a < b < c\nEqual To Comparison: a == b == c\nNot Equal To Comparison: a != b != c\n______________________________________________\n\n\"EVALUATE STRINGS\" NODE EXPRESSION EXAMPLES:\n\nConcatenate: a + b + c\nFormat: f'{a} {b} {c}'\nLength: len(a) + len(b) + len(c)\nUppercase: a.upper() + b.upper() + c.upper()\nLowercase: a.lower() + b.lower() + c.lower()\nCapitalize: a.capitalize() + b.capitalize() + c.capitalize()\nTitle Case: a.title() + b.title() + c.title()\nStrip: a.strip() + b.strip() + c.strip()\nFind Substring: a.find('sub') + b.find('sub') + c.find('sub')\nReplace Substring: a.replace('old', 'new') + b.replace('old', 'new') + c.replace('old', 'new')\nCount Substring: a.count('sub') + b.count('sub') + c.count('sub')\nCheck Numeric: a.isnumeric() + b.isnumeric() + c.isnumeric()\nCheck Alphabetic: a.isalpha() + b.isalpha() + c.isalpha()\nCheck Alphanumeric: a.isalnum() + b.isalnum() + c.isalnum()\nCheck Start: a.startswith('prefix') + b.startswith('prefix') + c.startswith('prefix')\nCheck End: a.endswith('suffix') + b.endswith('suffix') + c.endswith('suffix')\nSplit: a.split(' ') + b.split(' ') + c.split(' ')\nZero Fill: a.zfill(5) + b.zfill(5) + c.zfill(5)\nSlice: a[:5] + b[:5] + c[:5]\nReverse: a[::-1] + b[::-1] + c[::-1]\n______________________________________________" */
        models_text?: _STRING
    }

    // |=============================================================================|
    // | GaussianBlur ("Gaussian Blur" in ComfyUI) [Image Processing]                |
    // |=============================================================================|
    export interface GaussianBlur extends HasSingle_IMAGE, ComfyNode<GaussianBlur_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type GaussianBlur_input = {
        image: _IMAGE
        /** default=1 min=10 max=10 step=0.01 */
        strength?: _FLOAT
    }

    // |=============================================================================|
    // | HistogramEqualization ("Histogram Equalization" in ComfyUI) [Image Processing]   |
    // |=============================================================================|
    export interface HistogramEqualization extends HasSingle_IMAGE, ComfyNode<HistogramEqualization_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type HistogramEqualization_input = {
        image: _IMAGE
        /** default=1 min=1 max=1 step=0.01 */
        strength?: _FLOAT
    }

    // |=============================================================================|
    // | WASImageFlip ("Image Flip" in ComfyUI) [WAS Suite_Image_Transform]          |
    // |=============================================================================|
    export interface WASImageFlip extends HasSingle_IMAGE, ComfyNode<WASImageFlip_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageFlip_input = {
        images: _IMAGE
        mode: Enum_WASImageFlip_mode
    }

    // |=============================================================================|
    // | LatentUpscaleMultiply [O_latent]                                            |
    // |=============================================================================|
    export interface LatentUpscaleMultiply extends HasSingle_LATENT, ComfyNode<LatentUpscaleMultiply_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type LatentUpscaleMultiply_input = {
        samples: _LATENT
        upscale_method: Enum_ImpactLatentPixelScale_scale_method
        /** default=1.25 min=10 max=10 step=0.1 */
        WidthMul?: _FLOAT
        /** default=1.25 min=10 max=10 step=0.1 */
        HeightMul?: _FLOAT
        crop: Enum_LatentUpscale_crop
    }

    // |=============================================================================|
    // | MasqueradeMaskByText ("Mask By Text" in ComfyUI) [Masquerade Nodes]         |
    // |=============================================================================|
    export interface MasqueradeMaskByText extends ComfyNode<MasqueradeMaskByText_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
    }
    export type MasqueradeMaskByText_input = {
        image: _IMAGE
        /** */
        prompt: _STRING
        /** */
        negative_prompt: _STRING
        /** default=0.5 min=1 max=1 step=0.01 */
        precision?: _FLOAT
        normalize: Enum_MasqueradeMaskByText_normalize
    }

    // |=============================================================================|
    // | MasqueradeMaskMorphology ("Mask Morphology" in ComfyUI) [Masquerade Nodes]   |
    // |=============================================================================|
    export interface MasqueradeMaskMorphology extends HasSingle_IMAGE, ComfyNode<MasqueradeMaskMorphology_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradeMaskMorphology_input = {
        image: _IMAGE
        /** default=5 min=128 max=128 step=1 */
        distance?: _INT
        op: Enum_MasqueradeMaskMorphology_op
    }

    // |=============================================================================|
    // | MasqueradeCombineMasks ("Combine Masks" in ComfyUI) [Masquerade Nodes]      |
    // |=============================================================================|
    export interface MasqueradeCombineMasks extends HasSingle_IMAGE, ComfyNode<MasqueradeCombineMasks_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradeCombineMasks_input = {
        image1: _IMAGE
        image2: _IMAGE
        op: Enum_MasqueradeCombineMasks_op
        clamp_result: Enum_MasqueradeMaskByText_normalize
        round_result: Enum_MasqueradeMaskByText_normalize
    }

    // |=============================================================================|
    // | MasqueradeUnaryMaskOp ("Unary Mask Op" in ComfyUI) [Masquerade Nodes]       |
    // |=============================================================================|
    export interface MasqueradeUnaryMaskOp extends HasSingle_IMAGE, ComfyNode<MasqueradeUnaryMaskOp_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradeUnaryMaskOp_input = {
        image: _IMAGE
        op: Enum_MasqueradeUnaryMaskOp_op
    }

    // |=============================================================================|
    // | MasqueradeBlur ("Blur" in ComfyUI) [Masquerade Nodes]                       |
    // |=============================================================================|
    export interface MasqueradeBlur extends HasSingle_IMAGE, ComfyNode<MasqueradeBlur_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradeBlur_input = {
        image: _IMAGE
        /** default=10 min=48 max=48 step=1 */
        radius?: _INT
        /** default=1 min=3 max=3 step=0.01 */
        sigma_factor?: _FLOAT
    }

    // |=============================================================================|
    // | MasqueradeImageToMask ("Image To Mask" in ComfyUI) [Masquerade Nodes]       |
    // |=============================================================================|
    export interface MasqueradeImageToMask extends HasSingle_MASK, ComfyNode<MasqueradeImageToMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type MasqueradeImageToMask_input = {
        image: _IMAGE
        method: Enum_MasqueradeImageToMask_method
    }

    // |=============================================================================|
    // | MasqueradeMixImagesByMask ("Mix Images By Mask" in ComfyUI) [Masquerade Nodes]   |
    // |=============================================================================|
    export interface MasqueradeMixImagesByMask extends HasSingle_IMAGE, ComfyNode<MasqueradeMixImagesByMask_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradeMixImagesByMask_input = {
        image1: _IMAGE
        image2: _IMAGE
        mask: _IMAGE
    }

    // |=============================================================================|
    // | MasqueradeMixColorByMask ("Mix Color By Mask" in ComfyUI) [Masquerade Nodes]   |
    // |=============================================================================|
    export interface MasqueradeMixColorByMask extends HasSingle_IMAGE, ComfyNode<MasqueradeMixColorByMask_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradeMixColorByMask_input = {
        image: _IMAGE
        /** default=0 min=255 max=255 step=1 */
        r?: _INT
        /** default=0 min=255 max=255 step=1 */
        g?: _INT
        /** default=0 min=255 max=255 step=1 */
        b?: _INT
        mask: _IMAGE
    }

    // |=============================================================================|
    // | MasqueradeMaskToRegion ("Mask To Region" in ComfyUI) [Masquerade Nodes]     |
    // |=============================================================================|
    export interface MasqueradeMaskToRegion extends HasSingle_IMAGE, ComfyNode<MasqueradeMaskToRegion_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradeMaskToRegion_input = {
        mask: _IMAGE
        /** default=0 min=1048576 max=1048576 step=1 */
        padding?: _INT
        constraints: Enum_MasqueradeMaskToRegion_constraints
        /** default=64 min=1048576 max=1048576 step=1 */
        constraint_x?: _INT
        /** default=64 min=1048576 max=1048576 step=1 */
        constraint_y?: _INT
        /** default=0 min=1048576 max=1048576 step=1 */
        min_width?: _INT
        /** default=0 min=1048576 max=1048576 step=1 */
        min_height?: _INT
        batch_behavior: Enum_MasqueradeMaskToRegion_batch_behavior
    }

    // |=============================================================================|
    // | MasqueradeCutByMask ("Cut By Mask" in ComfyUI) [Masquerade Nodes]           |
    // |=============================================================================|
    export interface MasqueradeCutByMask extends HasSingle_IMAGE, ComfyNode<MasqueradeCutByMask_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradeCutByMask_input = {
        image: _IMAGE
        mask: _IMAGE
        /** default=0 min=1048576 max=1048576 step=1 */
        force_resize_width?: _INT
        /** default=0 min=1048576 max=1048576 step=1 */
        force_resize_height?: _INT
        mask_mapping_optional?: _MASK_MAPPING
    }

    // |=============================================================================|
    // | MasqueradePasteByMask ("Paste By Mask" in ComfyUI) [Masquerade Nodes]       |
    // |=============================================================================|
    export interface MasqueradePasteByMask extends HasSingle_IMAGE, ComfyNode<MasqueradePasteByMask_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradePasteByMask_input = {
        image_base: _IMAGE
        image_to_paste: _IMAGE
        mask: _IMAGE
        resize_behavior: Enum_MasqueradePasteByMask_resize_behavior
        mask_mapping_optional?: _MASK_MAPPING
    }

    // |=============================================================================|
    // | MasqueradeGetImageSize ("Get Image Size" in ComfyUI) [Masquerade Nodes]     |
    // |=============================================================================|
    export interface MasqueradeGetImageSize extends ComfyNode<MasqueradeGetImageSize_input> {
        INT: Slot<'INT', 0>
        INT_1: Slot<'INT', 1>
    }
    export type MasqueradeGetImageSize_input = {
        image: _IMAGE
    }

    // |=============================================================================|
    // | MasqueradeChangeChannelCount ("Change Channel Count" in ComfyUI) [Masquerade Nodes]   |
    // |=============================================================================|
    export interface MasqueradeChangeChannelCount extends HasSingle_IMAGE, ComfyNode<MasqueradeChangeChannelCount_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradeChangeChannelCount_input = {
        image: _IMAGE
        kind: Enum_MasqueradeChangeChannelCount_kind
    }

    // |=============================================================================|
    // | MasqueradeConstantMask ("Constant Mask" in ComfyUI) [Masquerade Nodes]      |
    // |=============================================================================|
    export interface MasqueradeConstantMask extends HasSingle_IMAGE, ComfyNode<MasqueradeConstantMask_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradeConstantMask_input = {
        /** default=0 min=8 max=8 step=0.01 */
        value?: _FLOAT
        /** default=0 min=1048576 max=1048576 step=1 */
        explicit_height?: _INT
        /** default=0 min=1048576 max=1048576 step=1 */
        explicit_width?: _INT
        copy_image_size?: _IMAGE
    }

    // |=============================================================================|
    // | MasqueradePruneByMask ("Prune By Mask" in ComfyUI) [Masquerade Nodes]       |
    // |=============================================================================|
    export interface MasqueradePruneByMask extends HasSingle_IMAGE, ComfyNode<MasqueradePruneByMask_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradePruneByMask_input = {
        image: _IMAGE
        mask: _IMAGE
    }

    // |=============================================================================|
    // | MasqueradeSeparateMaskComponents ("Separate Mask Components" in ComfyUI) [Masquerade Nodes]   |
    // |=============================================================================|
    export interface MasqueradeSeparateMaskComponents
        extends HasSingle_IMAGE,
            HasSingle_MASK_MAPPING,
            ComfyNode<MasqueradeSeparateMaskComponents_input> {
        IMAGE: Slot<'IMAGE', 0>
        MASK_MAPPING: Slot<'MASK_MAPPING', 1>
    }
    export type MasqueradeSeparateMaskComponents_input = {
        mask: _IMAGE
    }

    // |=============================================================================|
    // | MasqueradeCreateRectMask ("Create Rect Mask" in ComfyUI) [Masquerade Nodes]   |
    // |=============================================================================|
    export interface MasqueradeCreateRectMask extends HasSingle_IMAGE, ComfyNode<MasqueradeCreateRectMask_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradeCreateRectMask_input = {
        mode: Enum_MasqueradeCreateRectMask_mode
        origin: Enum_MasqueradeCreateRectMask_origin
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

    // |=============================================================================|
    // | MasqueradeMakeImageBatch ("Make Image Batch" in ComfyUI) [Masquerade Nodes]   |
    // |=============================================================================|
    export interface MasqueradeMakeImageBatch extends HasSingle_IMAGE, ComfyNode<MasqueradeMakeImageBatch_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type MasqueradeMakeImageBatch_input = {
        image1: _IMAGE
        image2?: _IMAGE
        image3?: _IMAGE
        image4?: _IMAGE
        image5?: _IMAGE
        image6?: _IMAGE
    }

    // |=============================================================================|
    // | PseudoHDRStyle ("Pseudo HDR Style" in ComfyUI) [Image Processing]           |
    // |=============================================================================|
    export interface PseudoHDRStyle extends HasSingle_IMAGE, ComfyNode<PseudoHDRStyle_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type PseudoHDRStyle_input = {
        image: _IMAGE
        /** default=0.5 min=1 max=1 step=0.01 */
        intensity?: _FLOAT
    }

    // |=============================================================================|
    // | Saturation [Image Processing]                                               |
    // |=============================================================================|
    export interface Saturation extends HasSingle_IMAGE, ComfyNode<Saturation_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type Saturation_input = {
        image: _IMAGE
        /** default=1 min=3 max=3 step=0.01 */
        strength?: _FLOAT
    }

    // |=============================================================================|
    // | ImageSharpening ("Image Sharpening" in ComfyUI) [Image Processing]          |
    // |=============================================================================|
    export interface ImageSharpening extends HasSingle_IMAGE, ComfyNode<ImageSharpening_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type ImageSharpening_input = {
        image: _IMAGE
        /** default=1 min=6 max=6 step=0.01 */
        strength?: _FLOAT
    }

    // |=============================================================================|
    // | WASBLIPModelLoader ("BLIP Model Loader" in ComfyUI) [WAS Suite_Loaders]     |
    // |=============================================================================|
    export interface WASBLIPModelLoader extends HasSingle_BLIP_MODEL, ComfyNode<WASBLIPModelLoader_input> {
        BLIP_MODEL: Slot<'BLIP_MODEL', 0>
    }
    export type WASBLIPModelLoader_input = {
        blip_model: Enum_WASBLIPModelLoader_blip_model
    }

    // |=============================================================================|
    // | WASCacheNode ("Cache Node" in ComfyUI) [WAS Suite_IO]                       |
    // |=============================================================================|
    export interface WASCacheNode extends ComfyNode<WASCacheNode_input> {
        ASCII: Slot<'ASCII', 0>
        ASCII_1: Slot<'ASCII', 1>
        ASCII_2: Slot<'ASCII', 2>
    }
    export type WASCacheNode_input = {
        /** default="57448161_cache" */
        latent_suffix?: _STRING
        /** default="6433720_cache" */
        image_suffix?: _STRING
        /** default="35751216_cache" */
        conditioning_suffix?: _STRING
        latent?: _LATENT
        image?: _IMAGE
        conditioning?: _CONDITIONING
    }

    // |=============================================================================|
    // | WASCheckpointLoader ("Checkpoint Loader" in ComfyUI) [WAS Suite_Loaders_Advanced]   |
    // |=============================================================================|
    export interface WASCheckpointLoader
        extends HasSingle_MODEL,
            HasSingle_CLIP,
            HasSingle_VAE,
            HasSingle_STRING,
            ComfyNode<WASCheckpointLoader_input> {
        MODEL: Slot<'MODEL', 0>
        CLIP: Slot<'CLIP', 1>
        VAE: Slot<'VAE', 2>
        STRING: Slot<'STRING', 3>
    }
    export type WASCheckpointLoader_input = {
        config_name: Enum_CheckpointLoader_config_name
        ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
    }

    // |=============================================================================|
    // | WASCheckpointLoaderSimple ("Checkpoint Loader (Simple)" in ComfyUI) [WAS Suite_Loaders]   |
    // |=============================================================================|
    export interface WASCheckpointLoaderSimple
        extends HasSingle_MODEL,
            HasSingle_CLIP,
            HasSingle_VAE,
            HasSingle_STRING,
            ComfyNode<WASCheckpointLoaderSimple_input> {
        MODEL: Slot<'MODEL', 0>
        CLIP: Slot<'CLIP', 1>
        VAE: Slot<'VAE', 2>
        STRING: Slot<'STRING', 3>
    }
    export type WASCheckpointLoaderSimple_input = {
        ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
    }

    // |=============================================================================|
    // | WASCLIPTextEncodeNSP ("CLIPTextEncode (NSP)" in ComfyUI) [WAS Suite_Conditioning]   |
    // |=============================================================================|
    export interface WASCLIPTextEncodeNSP extends HasSingle_CONDITIONING, ComfyNode<WASCLIPTextEncodeNSP_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
        ASCII: Slot<'ASCII', 1>
        ASCII_1: Slot<'ASCII', 2>
    }
    export type WASCLIPTextEncodeNSP_input = {
        mode: Enum_WASCLIPTextEncodeNSP_mode
        /** default="__" */
        noodle_key?: _STRING
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** */
        text: _STRING
        clip: _CLIP
    }

    // |=============================================================================|
    // | WASCLIPInputSwitch ("CLIP Input Switch" in ComfyUI) [WAS Suite_Logic]       |
    // |=============================================================================|
    export interface WASCLIPInputSwitch extends HasSingle_CLIP, ComfyNode<WASCLIPInputSwitch_input> {
        CLIP: Slot<'CLIP', 0>
    }
    export type WASCLIPInputSwitch_input = {
        clip_a: _CLIP
        clip_b: _CLIP
        boolean_number: _NUMBER
    }

    // |=============================================================================|
    // | WASCLIPVisionInputSwitch ("CLIP Vision Input Switch" in ComfyUI) [WAS Suite_Logic]   |
    // |=============================================================================|
    export interface WASCLIPVisionInputSwitch extends HasSingle_CLIP_VISION, ComfyNode<WASCLIPVisionInputSwitch_input> {
        CLIP_VISION: Slot<'CLIP_VISION', 0>
    }
    export type WASCLIPVisionInputSwitch_input = {
        clip_vision_a: _CLIP_VISION
        clip_vision_b: _CLIP_VISION
        boolean_number: _NUMBER
    }

    // |=============================================================================|
    // | WASConditioningInputSwitch ("Conditioning Input Switch" in ComfyUI) [WAS Suite_Logic]   |
    // |=============================================================================|
    export interface WASConditioningInputSwitch extends HasSingle_CONDITIONING, ComfyNode<WASConditioningInputSwitch_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type WASConditioningInputSwitch_input = {
        conditioning_a: _CONDITIONING
        conditioning_b: _CONDITIONING
        boolean_number: _NUMBER
    }

    // |=============================================================================|
    // | WASConstantNumber ("Constant Number" in ComfyUI) [WAS Suite_Number]         |
    // |=============================================================================|
    export interface WASConstantNumber extends HasSingle_NUMBER, ComfyNode<WASConstantNumber_input> {
        NUMBER: Slot<'NUMBER', 0>
    }
    export type WASConstantNumber_input = {
        number_type: Enum_WASConstantNumber_number_type
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        number?: _FLOAT
    }

    // |=============================================================================|
    // | WASCreateGridImage ("Create Grid Image" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASCreateGridImage extends HasSingle_IMAGE, ComfyNode<WASCreateGridImage_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASCreateGridImage_input = {
        /** default="./ComfyUI/input/" */
        images_path?: _STRING
        /** default="*" */
        pattern_glob?: _STRING
        include_subfolders: Enum_ImageDrawRectangleRounded_top_left_corner
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

    // |=============================================================================|
    // | WASCreateMorphImage ("Create Morph Image" in ComfyUI) [WAS Suite_Animation]   |
    // |=============================================================================|
    export interface WASCreateMorphImage extends ComfyNode<WASCreateMorphImage_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
        ASCII: Slot<'ASCII', 2>
        ASCII_1: Slot<'ASCII', 3>
    }
    export type WASCreateMorphImage_input = {
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
        filetype: Enum_WASCreateMorphImage_filetype
    }

    // |=============================================================================|
    // | WASCreateMorphImageFromPath ("Create Morph Image from Path" in ComfyUI) [WAS Suite_Animation]   |
    // |=============================================================================|
    export interface WASCreateMorphImageFromPath extends ComfyNode<WASCreateMorphImageFromPath_input> {
        ASCII: Slot<'ASCII', 0>
        ASCII_1: Slot<'ASCII', 1>
    }
    export type WASCreateMorphImageFromPath_input = {
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
        filetype: Enum_WASCreateMorphImage_filetype
    }

    // |=============================================================================|
    // | WASCreateVideoFromPath ("Create Video from Path" in ComfyUI) [WAS Suite_Animation]   |
    // |=============================================================================|
    export interface WASCreateVideoFromPath extends ComfyNode<WASCreateVideoFromPath_input> {
        ASCII: Slot<'ASCII', 0>
        ASCII_1: Slot<'ASCII', 1>
    }
    export type WASCreateVideoFromPath_input = {
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
        codec: Enum_WASCreateVideoFromPath_codec
    }

    // |=============================================================================|
    // | WASCLIPSegMasking ("CLIPSeg Masking" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASCLIPSegMasking extends HasSingle_MASK, HasSingle_IMAGE, ComfyNode<WASCLIPSegMasking_input> {
        MASK: Slot<'MASK', 0>
        IMAGE: Slot<'IMAGE', 1>
    }
    export type WASCLIPSegMasking_input = {
        image: _IMAGE
        /** default="" */
        text?: _STRING
        clipseg_model?: _CLIPSEG_MODEL
    }

    // |=============================================================================|
    // | WASCLIPSegModelLoader ("CLIPSeg Model Loader" in ComfyUI) [WAS Suite_Loaders]   |
    // |=============================================================================|
    export interface WASCLIPSegModelLoader extends HasSingle_CLIPSEG_MODEL, ComfyNode<WASCLIPSegModelLoader_input> {
        CLIPSEG_MODEL: Slot<'CLIPSEG_MODEL', 0>
    }
    export type WASCLIPSegModelLoader_input = {
        /** default="CIDAS/clipseg-rd64-refined" */
        model?: _STRING
    }

    // |=============================================================================|
    // | WASCLIPSegBatchMasking ("CLIPSeg Batch Masking" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASCLIPSegBatchMasking extends HasSingle_MASK, ComfyNode<WASCLIPSegBatchMasking_input> {
        IMAGE: Slot<'IMAGE', 0>
        MASK: Slot<'MASK', 1>
        IMAGE_1: Slot<'IMAGE', 2>
    }
    export type WASCLIPSegBatchMasking_input = {
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

    // |=============================================================================|
    // | WASConvertMasksToImages ("Convert Masks to Images" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASConvertMasksToImages extends HasSingle_IMAGE, ComfyNode<WASConvertMasksToImages_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASConvertMasksToImages_input = {
        masks: _MASK
    }

    // |=============================================================================|
    // | WASControlNetModelInputSwitch ("Control Net Model Input Switch" in ComfyUI) [WAS Suite_Logic]   |
    // |=============================================================================|
    export interface WASControlNetModelInputSwitch extends HasSingle_CONTROL_NET, ComfyNode<WASControlNetModelInputSwitch_input> {
        CONTROL_NET: Slot<'CONTROL_NET', 0>
    }
    export type WASControlNetModelInputSwitch_input = {
        control_net_a: _CONTROL_NET
        control_net_b: _CONTROL_NET
        boolean_number: _NUMBER
    }

    // |=============================================================================|
    // | WASDebugNumberToConsole ("Debug Number to Console" in ComfyUI) [WAS Suite_Debug]   |
    // |=============================================================================|
    export interface WASDebugNumberToConsole extends HasSingle_NUMBER, ComfyNode<WASDebugNumberToConsole_input> {
        NUMBER: Slot<'NUMBER', 0>
    }
    export type WASDebugNumberToConsole_input = {
        number: _NUMBER
        /** default="Debug to Console" */
        label?: _STRING
    }

    // |=============================================================================|
    // | WASDictionaryToConsole ("Dictionary to Console" in ComfyUI) [WAS Suite_Debug]   |
    // |=============================================================================|
    export interface WASDictionaryToConsole extends HasSingle_DICT, ComfyNode<WASDictionaryToConsole_input> {
        DICT: Slot<'DICT', 0>
    }
    export type WASDictionaryToConsole_input = {
        dictionary: _DICT
        /** default="Dictionary Output" */
        label?: _STRING
    }

    // |=============================================================================|
    // | WASDiffusersModelLoader ("Diffusers Model Loader" in ComfyUI) [WAS Suite_Loaders_Advanced]   |
    // |=============================================================================|
    export interface WASDiffusersModelLoader
        extends HasSingle_MODEL,
            HasSingle_CLIP,
            HasSingle_VAE,
            HasSingle_STRING,
            ComfyNode<WASDiffusersModelLoader_input> {
        MODEL: Slot<'MODEL', 0>
        CLIP: Slot<'CLIP', 1>
        VAE: Slot<'VAE', 2>
        STRING: Slot<'STRING', 3>
    }
    export type WASDiffusersModelLoader_input = {
        model_path: Enum_CLIPLoader_clip_name
    }

    // |=============================================================================|
    // | WASDiffusersHubModelDownLoader ("Diffusers Hub Model Down-Loader" in ComfyUI) [WAS Suite_Loaders_Advanced]   |
    // |=============================================================================|
    export interface WASDiffusersHubModelDownLoader
        extends HasSingle_MODEL,
            HasSingle_CLIP,
            HasSingle_VAE,
            HasSingle_STRING,
            ComfyNode<WASDiffusersHubModelDownLoader_input> {
        MODEL: Slot<'MODEL', 0>
        CLIP: Slot<'CLIP', 1>
        VAE: Slot<'VAE', 2>
        STRING: Slot<'STRING', 3>
    }
    export type WASDiffusersHubModelDownLoader_input = {
        /** */
        repo_id: _STRING
        /** default="None" */
        revision?: _STRING
    }

    // |=============================================================================|
    // | WASExportAPI ("Export API" in ComfyUI) [WAS Suite_Debug]                    |
    // |=============================================================================|
    export interface WASExportAPI extends ComfyNode<WASExportAPI_input> {}
    export type WASExportAPI_input = {
        save_prompt_api: Enum_WASExportAPI_save_prompt_api
        /** default="./ComfyUI/output/" */
        output_path?: _STRING
        /** default="ComfyUI_Prompt" */
        filename_prefix?: _STRING
        /** default="_" */
        filename_delimiter?: _STRING
        /** default=4 min=9 max=9 step=1 */
        filename_number_padding?: _INT
    }

    // |=============================================================================|
    // | WASLatentInputSwitch ("Latent Input Switch" in ComfyUI) [WAS Suite_Logic]   |
    // |=============================================================================|
    export interface WASLatentInputSwitch extends HasSingle_LATENT, ComfyNode<WASLatentInputSwitch_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type WASLatentInputSwitch_input = {
        latent_a: _LATENT
        latent_b: _LATENT
        boolean_number: _NUMBER
    }

    // |=============================================================================|
    // | WASLoadCache ("Load Cache" in ComfyUI) [WAS Suite_IO]                       |
    // |=============================================================================|
    export interface WASLoadCache
        extends HasSingle_LATENT,
            HasSingle_IMAGE,
            HasSingle_CONDITIONING,
            ComfyNode<WASLoadCache_input> {
        LATENT: Slot<'LATENT', 0>
        IMAGE: Slot<'IMAGE', 1>
        CONDITIONING: Slot<'CONDITIONING', 2>
    }
    export type WASLoadCache_input = {
        /** default="" */
        latent_filename?: _STRING
        /** default="" */
        image_filename?: _STRING
        /** default="" */
        conditioning_filename?: _STRING
    }

    // |=============================================================================|
    // | WASLogicBoolean ("Logic Boolean" in ComfyUI) [WAS Suite_Logic]              |
    // |=============================================================================|
    export interface WASLogicBoolean extends HasSingle_NUMBER, ComfyNode<WASLogicBoolean_input> {
        NUMBER: Slot<'NUMBER', 0>
    }
    export type WASLogicBoolean_input = {
        /** default=1 min=1 max=1 step=1 */
        boolean_number?: _INT
    }

    // |=============================================================================|
    // | WASLoraLoader ("Lora Loader" in ComfyUI) [WAS Suite_Loaders]                |
    // |=============================================================================|
    export interface WASLoraLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_STRING, ComfyNode<WASLoraLoader_input> {
        MODEL: Slot<'MODEL', 0>
        CLIP: Slot<'CLIP', 1>
        STRING: Slot<'STRING', 2>
    }
    export type WASLoraLoader_input = {
        model: _MODEL
        clip: _CLIP
        lora_name: Enum_EfficientLoader_lora_name
        /** default=1 min=10 max=10 step=0.01 */
        strength_model?: _FLOAT
        /** default=1 min=10 max=10 step=0.01 */
        strength_clip?: _FLOAT
    }

    // |=============================================================================|
    // | WASImageSSAOAmbientOcclusion ("Image SSAO (Ambient Occlusion)" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageSSAOAmbientOcclusion extends ComfyNode<WASImageSSAOAmbientOcclusion_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
        IMAGE_2: Slot<'IMAGE', 2>
    }
    export type WASImageSSAOAmbientOcclusion_input = {
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
        enable_specular_masking: Enum_ImpactMaskToSEGS_combined
        /** default=1 min=512 max=512 step=1 */
        tile_size?: _INT
    }

    // |=============================================================================|
    // | WASImageSSDODirectOcclusion ("Image SSDO (Direct Occlusion)" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageSSDODirectOcclusion extends ComfyNode<WASImageSSDODirectOcclusion_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
        IMAGE_2: Slot<'IMAGE', 2>
        IMAGE_3: Slot<'IMAGE', 3>
    }
    export type WASImageSSDODirectOcclusion_input = {
        images: _IMAGE
        depth_images: _IMAGE
        /** default=1 min=5 max=5 step=0.01 */
        strength?: _FLOAT
        /** default=30 min=1024 max=1024 step=0.01 */
        radius?: _FLOAT
        /** default=128 min=255 max=255 step=1 */
        specular_threshold?: _INT
        colored_occlusion: Enum_ImpactMaskToSEGS_combined
    }

    // |=============================================================================|
    // | WASImageAnalyze ("Image Analyze" in ComfyUI) [WAS Suite_Image_Analyze]      |
    // |=============================================================================|
    export interface WASImageAnalyze extends HasSingle_IMAGE, ComfyNode<WASImageAnalyze_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageAnalyze_input = {
        image: _IMAGE
        mode: Enum_WASImageAnalyze_mode
    }

    // |=============================================================================|
    // | WASImageBatch ("Image Batch" in ComfyUI) [WAS Suite_Image]                  |
    // |=============================================================================|
    export interface WASImageBatch extends HasSingle_IMAGE, ComfyNode<WASImageBatch_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageBatch_input = {
        images_a: _IMAGE
        images_b: _IMAGE
        images_c?: _IMAGE
        images_d?: _IMAGE
    }

    // |=============================================================================|
    // | WASImageBlank ("Image Blank" in ComfyUI) [WAS Suite_Image]                  |
    // |=============================================================================|
    export interface WASImageBlank extends HasSingle_IMAGE, ComfyNode<WASImageBlank_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageBlank_input = {
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

    // |=============================================================================|
    // | WASImageBlendByMask ("Image Blend by Mask" in ComfyUI) [WAS Suite_Image]    |
    // |=============================================================================|
    export interface WASImageBlendByMask extends HasSingle_IMAGE, ComfyNode<WASImageBlendByMask_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageBlendByMask_input = {
        image_a: _IMAGE
        image_b: _IMAGE
        mask: _IMAGE
        /** default=0.5 min=1 max=1 step=0.01 */
        blend_percentage?: _FLOAT
    }

    // |=============================================================================|
    // | WASImageBlend ("Image Blend" in ComfyUI) [WAS Suite_Image]                  |
    // |=============================================================================|
    export interface WASImageBlend extends HasSingle_IMAGE, ComfyNode<WASImageBlend_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageBlend_input = {
        image_a: _IMAGE
        image_b: _IMAGE
        /** default=0.5 min=1 max=1 step=0.01 */
        blend_percentage?: _FLOAT
    }

    // |=============================================================================|
    // | WASImageBlendingMode ("Image Blending Mode" in ComfyUI) [WAS Suite_Image]   |
    // |=============================================================================|
    export interface WASImageBlendingMode extends HasSingle_IMAGE, ComfyNode<WASImageBlendingMode_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageBlendingMode_input = {
        image_a: _IMAGE
        image_b: _IMAGE
        mode: Enum_WASImageBlendingMode_mode
        /** default=1 min=1 max=1 step=0.01 */
        blend_percentage?: _FLOAT
    }

    // |=============================================================================|
    // | WASImageBloomFilter ("Image Bloom Filter" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageBloomFilter extends HasSingle_IMAGE, ComfyNode<WASImageBloomFilter_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageBloomFilter_input = {
        image: _IMAGE
        /** default=10 min=1024 max=1024 step=0.1 */
        radius?: _FLOAT
        /** default=1 min=1 max=1 step=0.1 */
        intensity?: _FLOAT
    }

    // |=============================================================================|
    // | WASImageCannyFilter ("Image Canny Filter" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageCannyFilter extends HasSingle_IMAGE, ComfyNode<WASImageCannyFilter_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageCannyFilter_input = {
        images: _IMAGE
        enable_threshold: Enum_ImageDrawRectangleRounded_top_left_corner
        /** default=0 min=1 max=1 step=0.01 */
        threshold_low?: _FLOAT
        /** default=1 min=1 max=1 step=0.01 */
        threshold_high?: _FLOAT
    }

    // |=============================================================================|
    // | WASImageChromaticAberration ("Image Chromatic Aberration" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageChromaticAberration extends HasSingle_IMAGE, ComfyNode<WASImageChromaticAberration_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageChromaticAberration_input = {
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

    // |=============================================================================|
    // | WASImageColorPalette ("Image Color Palette" in ComfyUI) [WAS Suite_Image_Analyze]   |
    // |=============================================================================|
    export interface WASImageColorPalette extends HasSingle_IMAGE, HasSingle_LIST, ComfyNode<WASImageColorPalette_input> {
        IMAGE: Slot<'IMAGE', 0>
        LIST: Slot<'LIST', 1>
    }
    export type WASImageColorPalette_input = {
        image: _IMAGE
        /** default=16 min=256 max=256 step=1 */
        colors?: _INT
        mode: Enum_WASImageColorPalette_mode
    }

    // |=============================================================================|
    // | WASImageCropFace ("Image Crop Face" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASImageCropFace extends HasSingle_IMAGE, HasSingle_CROP_DATA, ComfyNode<WASImageCropFace_input> {
        IMAGE: Slot<'IMAGE', 0>
        CROP_DATA: Slot<'CROP_DATA', 1>
    }
    export type WASImageCropFace_input = {
        image: _IMAGE
        /** default=0.25 min=2 max=2 step=0.01 */
        crop_padding_factor?: _FLOAT
        cascade_xml: Enum_WASImageCropFace_cascade_xml
    }

    // |=============================================================================|
    // | WASImageCropLocation ("Image Crop Location" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASImageCropLocation extends HasSingle_IMAGE, HasSingle_CROP_DATA, ComfyNode<WASImageCropLocation_input> {
        IMAGE: Slot<'IMAGE', 0>
        CROP_DATA: Slot<'CROP_DATA', 1>
    }
    export type WASImageCropLocation_input = {
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

    // |=============================================================================|
    // | WASImageCropSquareLocation ("Image Crop Square Location" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASImageCropSquareLocation
        extends HasSingle_IMAGE,
            HasSingle_CROP_DATA,
            ComfyNode<WASImageCropSquareLocation_input> {
        IMAGE: Slot<'IMAGE', 0>
        CROP_DATA: Slot<'CROP_DATA', 1>
    }
    export type WASImageCropSquareLocation_input = {
        image: _IMAGE
        /** default=0 min=24576 max=24576 step=1 */
        x?: _INT
        /** default=0 min=24576 max=24576 step=1 */
        y?: _INT
        /** default=256 min=4096 max=4096 step=1 */
        size?: _INT
    }

    // |=============================================================================|
    // | WASImageDisplacementWarp ("Image Displacement Warp" in ComfyUI) [WAS Suite_Image_Transform]   |
    // |=============================================================================|
    export interface WASImageDisplacementWarp extends HasSingle_IMAGE, ComfyNode<WASImageDisplacementWarp_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageDisplacementWarp_input = {
        images: _IMAGE
        displacement_maps: _IMAGE
        /** default=25 min=4096 max=4096 step=0.1 */
        amplitude?: _FLOAT
    }

    // |=============================================================================|
    // | WASImagePasteFace ("Image Paste Face" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASImagePasteFace extends ComfyNode<WASImagePasteFace_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
    }
    export type WASImagePasteFace_input = {
        image: _IMAGE
        crop_image: _IMAGE
        crop_data: _CROP_DATA
        /** default=0.25 min=1 max=1 step=0.01 */
        crop_blending?: _FLOAT
        /** default=0 min=3 max=3 step=1 */
        crop_sharpening?: _INT
    }

    // |=============================================================================|
    // | WASImagePasteCrop ("Image Paste Crop" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASImagePasteCrop extends ComfyNode<WASImagePasteCrop_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
    }
    export type WASImagePasteCrop_input = {
        image: _IMAGE
        crop_image: _IMAGE
        crop_data: _CROP_DATA
        /** default=0.25 min=1 max=1 step=0.01 */
        crop_blending?: _FLOAT
        /** default=0 min=3 max=3 step=1 */
        crop_sharpening?: _INT
    }

    // |=============================================================================|
    // | WASImagePasteCropByLocation ("Image Paste Crop by Location" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASImagePasteCropByLocation extends ComfyNode<WASImagePasteCropByLocation_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
    }
    export type WASImagePasteCropByLocation_input = {
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

    // |=============================================================================|
    // | WASImagePixelate ("Image Pixelate" in ComfyUI) [WAS Suite_Image_Process]    |
    // |=============================================================================|
    export interface WASImagePixelate extends HasSingle_IMAGE, ComfyNode<WASImagePixelate_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImagePixelate_input = {
        images: _IMAGE
        /** default=164 min=480 max=480 step=1 */
        pixelation_size?: _FLOAT
        /** default=16 min=256 max=256 step=1 */
        num_colors?: _FLOAT
        init_mode: Enum_WASImagePixelate_init_mode
        /** default=100 min=256 max=256 step=1 */
        max_iterations?: _FLOAT
        dither: Enum_ImpactMaskToSEGS_combined
        dither_mode: Enum_WASImagePixelate_dither_mode
        /** */
        color_palettes?: _LIST
        color_palette_mode?: Enum_WASImagePixelate_color_palette_mode
        reverse_palette?: Enum_ImpactMaskToSEGS_combined
    }

    // |=============================================================================|
    // | WASImagePowerNoise ("Image Power Noise" in ComfyUI) [WAS Suite_Image_Generate_Noise]   |
    // |=============================================================================|
    export interface WASImagePowerNoise extends HasSingle_IMAGE, ComfyNode<WASImagePowerNoise_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImagePowerNoise_input = {
        /** default=512 min=4096 max=4096 step=1 */
        width?: _INT
        /** default=512 min=4096 max=4096 step=1 */
        height?: _INT
        /** default=0.5 min=10 max=10 step=0.01 */
        frequency?: _FLOAT
        /** default=0.5 min=10 max=10 step=0.01 */
        attenuation?: _FLOAT
        noise_type: Enum_WASImagePowerNoise_noise_type
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
    }

    // |=============================================================================|
    // | WASImageDraganPhotographyFilter ("Image Dragan Photography Filter" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageDraganPhotographyFilter extends HasSingle_IMAGE, ComfyNode<WASImageDraganPhotographyFilter_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageDraganPhotographyFilter_input = {
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
        /** default=1 min=1 max=1 step=0.01 */
        highpass_strength?: _FLOAT
        colorize: Enum_ImageDrawRectangleRounded_top_left_corner
    }

    // |=============================================================================|
    // | WASImageEdgeDetectionFilter ("Image Edge Detection Filter" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageEdgeDetectionFilter extends HasSingle_IMAGE, ComfyNode<WASImageEdgeDetectionFilter_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageEdgeDetectionFilter_input = {
        image: _IMAGE
        mode: Enum_WASImageEdgeDetectionFilter_mode
    }

    // |=============================================================================|
    // | WASImageFilmGrain ("Image Film Grain" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageFilmGrain extends HasSingle_IMAGE, ComfyNode<WASImageFilmGrain_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageFilmGrain_input = {
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

    // |=============================================================================|
    // | WASImageFilterAdjustments ("Image Filter Adjustments" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageFilterAdjustments extends HasSingle_IMAGE, ComfyNode<WASImageFilterAdjustments_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageFilterAdjustments_input = {
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
    }

    // |=============================================================================|
    // | WASImageGradientMap ("Image Gradient Map" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageGradientMap extends HasSingle_IMAGE, ComfyNode<WASImageGradientMap_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageGradientMap_input = {
        image: _IMAGE
        gradient_image: _IMAGE
        flip_left_right: Enum_ImageDrawRectangleRounded_top_left_corner
    }

    // |=============================================================================|
    // | WASImageGenerateGradient ("Image Generate Gradient" in ComfyUI) [WAS Suite_Image_Generate]   |
    // |=============================================================================|
    export interface WASImageGenerateGradient extends HasSingle_IMAGE, ComfyNode<WASImageGenerateGradient_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageGenerateGradient_input = {
        /** default=512 min=4096 max=4096 step=1 */
        width?: _INT
        /** default=512 min=4096 max=4096 step=1 */
        height?: _INT
        direction: Enum_WASImageFlip_mode
        /** default=0 min=255 max=255 step=1 */
        tolerance?: _INT
        /** default="0:255,0,0\n25:255,255,255\n50:0,255,0\n75:0,0,255" */
        gradient_stops?: _STRING
    }

    // |=============================================================================|
    // | WASImageHighPassFilter ("Image High Pass Filter" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageHighPassFilter extends HasSingle_IMAGE, ComfyNode<WASImageHighPassFilter_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageHighPassFilter_input = {
        images: _IMAGE
        /** default=10 min=500 max=500 step=1 */
        radius?: _INT
        /** default=1.5 min=255 max=255 step=0.1 */
        strength?: _FLOAT
        color_output: Enum_ImageDrawRectangleRounded_top_left_corner
        neutral_background: Enum_ImageDrawRectangleRounded_top_left_corner
    }

    // |=============================================================================|
    // | WASImageHistoryLoader ("Image History Loader" in ComfyUI) [WAS Suite_History]   |
    // |=============================================================================|
    export interface WASImageHistoryLoader extends HasSingle_IMAGE, HasSingle_ASCII, ComfyNode<WASImageHistoryLoader_input> {
        IMAGE: Slot<'IMAGE', 0>
        ASCII: Slot<'ASCII', 1>
    }
    export type WASImageHistoryLoader_input = {
        image: Enum_WASImageHistoryLoader_image
    }

    // |=============================================================================|
    // | WASImageInputSwitch ("Image Input Switch" in ComfyUI) [WAS Suite_Logic]     |
    // |=============================================================================|
    export interface WASImageInputSwitch extends HasSingle_IMAGE, ComfyNode<WASImageInputSwitch_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageInputSwitch_input = {
        image_a: _IMAGE
        image_b: _IMAGE
        boolean_number: _NUMBER
    }

    // |=============================================================================|
    // | WASImageLevelsAdjustment ("Image Levels Adjustment" in ComfyUI) [WAS Suite_Image_Adjustment]   |
    // |=============================================================================|
    export interface WASImageLevelsAdjustment extends HasSingle_IMAGE, ComfyNode<WASImageLevelsAdjustment_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageLevelsAdjustment_input = {
        image: _IMAGE
        /** default=0 min=255 max=255 step=0.1 */
        black_level?: _FLOAT
        /** default=127.5 min=255 max=255 step=0.1 */
        mid_level?: _FLOAT
        /** default=255 min=255 max=255 step=0.1 */
        white_level?: _FLOAT
    }

    // |=============================================================================|
    // | WASImageLoad ("Image Load" in ComfyUI) [WAS Suite_IO]                       |
    // |=============================================================================|
    export interface WASImageLoad extends HasSingle_IMAGE, HasSingle_MASK, HasSingle_ASCII, ComfyNode<WASImageLoad_input> {
        IMAGE: Slot<'IMAGE', 0>
        MASK: Slot<'MASK', 1>
        ASCII: Slot<'ASCII', 2>
    }
    export type WASImageLoad_input = {
        /** default="./ComfyUI/input/example.png" */
        image_path?: _STRING
    }

    // |=============================================================================|
    // | WASImageMedianFilter ("Image Median Filter" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageMedianFilter extends HasSingle_IMAGE, ComfyNode<WASImageMedianFilter_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageMedianFilter_input = {
        image: _IMAGE
        /** default=2 min=255 max=255 step=1 */
        diameter?: _INT
        /** default=10 min=255 max=255 step=0.1 */
        sigma_color?: _FLOAT
        /** default=10 min=255 max=255 step=0.1 */
        sigma_space?: _FLOAT
    }

    // |=============================================================================|
    // | WASImageMixRGBChannels ("Image Mix RGB Channels" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASImageMixRGBChannels extends HasSingle_IMAGE, ComfyNode<WASImageMixRGBChannels_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageMixRGBChannels_input = {
        red_channel: _IMAGE
        green_channel: _IMAGE
        blue_channel: _IMAGE
    }

    // |=============================================================================|
    // | WASImageMonitorEffectsFilter ("Image Monitor Effects Filter" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageMonitorEffectsFilter extends HasSingle_IMAGE, ComfyNode<WASImageMonitorEffectsFilter_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageMonitorEffectsFilter_input = {
        image: _IMAGE
        mode: Enum_WASImageMonitorEffectsFilter_mode
        /** default=5 min=255 max=255 step=1 */
        amplitude?: _INT
        /** default=10 min=255 max=255 step=1 */
        offset?: _INT
    }

    // |=============================================================================|
    // | WASImageNovaFilter ("Image Nova Filter" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageNovaFilter extends HasSingle_IMAGE, ComfyNode<WASImageNovaFilter_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageNovaFilter_input = {
        image: _IMAGE
        /** default=0.1 min=1 max=1 step=0.001 */
        amplitude?: _FLOAT
        /** default=3.14 min=100 max=100 step=0.001 */
        frequency?: _FLOAT
    }

    // |=============================================================================|
    // | WASImagePadding ("Image Padding" in ComfyUI) [WAS Suite_Image_Transform]    |
    // |=============================================================================|
    export interface WASImagePadding extends ComfyNode<WASImagePadding_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
    }
    export type WASImagePadding_input = {
        image: _IMAGE
        /** default=120 min=2048 max=2048 step=1 */
        feathering?: _INT
        feather_second_pass: Enum_ImageDrawRectangleRounded_top_left_corner
        /** default=512 min=48000 max=48000 step=1 */
        left_padding?: _INT
        /** default=512 min=48000 max=48000 step=1 */
        right_padding?: _INT
        /** default=512 min=48000 max=48000 step=1 */
        top_padding?: _INT
        /** default=512 min=48000 max=48000 step=1 */
        bottom_padding?: _INT
    }

    // |=============================================================================|
    // | WASImagePerlinNoise ("Image Perlin Noise" in ComfyUI) [WAS Suite_Image_Generate_Noise]   |
    // |=============================================================================|
    export interface WASImagePerlinNoise extends HasSingle_IMAGE, ComfyNode<WASImagePerlinNoise_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImagePerlinNoise_input = {
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

    // |=============================================================================|
    // | WASImageRembgRemoveBackground ("Image Rembg (Remove Background)" in ComfyUI) [WAS Suite_Image_AI]   |
    // |=============================================================================|
    export interface WASImageRembgRemoveBackground extends HasSingle_IMAGE, ComfyNode<WASImageRembgRemoveBackground_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageRembgRemoveBackground_input = {
        images: _IMAGE
        transparency: Enum_ImageDrawRectangleRounded_top_left_corner
    }

    // |=============================================================================|
    // | WASImagePerlinPowerFractal ("Image Perlin Power Fractal" in ComfyUI) [WAS Suite_Image_Generate_Noise]   |
    // |=============================================================================|
    export interface WASImagePerlinPowerFractal extends HasSingle_IMAGE, ComfyNode<WASImagePerlinPowerFractal_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImagePerlinPowerFractal_input = {
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
        /** default=2 min=100 max=100 step=0.01 */
        lacunarity?: _FLOAT
        /** default=2 min=100 max=100 step=0.01 */
        exponent?: _FLOAT
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
    }

    // |=============================================================================|
    // | WASImageRemoveBackgroundAlpha ("Image Remove Background (Alpha)" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASImageRemoveBackgroundAlpha extends HasSingle_IMAGE, ComfyNode<WASImageRemoveBackgroundAlpha_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageRemoveBackgroundAlpha_input = {
        images: _IMAGE
        mode: Enum_WASImageRemoveBackgroundAlpha_mode
        /** default=127 min=255 max=255 step=1 */
        threshold?: _INT
        /** default=2 min=24 max=24 step=1 */
        threshold_tolerance?: _INT
    }

    // |=============================================================================|
    // | WASImageRemoveColor ("Image Remove Color" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASImageRemoveColor extends HasSingle_IMAGE, ComfyNode<WASImageRemoveColor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageRemoveColor_input = {
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

    // |=============================================================================|
    // | WASImageResize ("Image Resize" in ComfyUI) [WAS Suite_Image_Transform]      |
    // |=============================================================================|
    export interface WASImageResize extends HasSingle_IMAGE, ComfyNode<WASImageResize_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageResize_input = {
        image: _IMAGE
        mode: Enum_WASImageResize_mode
        supersample: Enum_ImageDrawRectangleRounded_top_left_corner
        resampling: Enum_WASImageResize_resampling
        /** default=2 min=16 max=16 step=0.01 */
        rescale_factor?: _FLOAT
        /** default=1024 min=48000 max=48000 step=1 */
        resize_width?: _INT
        /** default=1536 min=48000 max=48000 step=1 */
        resize_height?: _INT
    }

    // |=============================================================================|
    // | WASImageRotate ("Image Rotate" in ComfyUI) [WAS Suite_Image_Transform]      |
    // |=============================================================================|
    export interface WASImageRotate extends HasSingle_IMAGE, ComfyNode<WASImageRotate_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageRotate_input = {
        images: _IMAGE
        mode: Enum_WASImageRotate_mode
        /** default=0 min=360 max=360 step=90 */
        rotation?: _INT
        sampler: Enum_WASImageRotate_sampler
    }

    // |=============================================================================|
    // | WASImageRotateHue ("Image Rotate Hue" in ComfyUI) [WAS Suite_Image_Adjustment]   |
    // |=============================================================================|
    export interface WASImageRotateHue extends HasSingle_IMAGE, ComfyNode<WASImageRotateHue_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageRotateHue_input = {
        image: _IMAGE
        /** default=0 min=1 max=1 step=0.001 */
        hue_shift?: _FLOAT
    }

    // |=============================================================================|
    // | WASImageSave ("Image Save" in ComfyUI) [WAS Suite_IO]                       |
    // |=============================================================================|
    export interface WASImageSave extends ComfyNode<WASImageSave_input> {}
    export type WASImageSave_input = {
        images: _IMAGE
        /** default="./ComfyUI/output/[time(%Y-%m-%d)]" */
        output_path?: _STRING
        /** default="ComfyUI" */
        filename_prefix?: _STRING
        /** default="_" */
        filename_delimiter?: _STRING
        /** default=4 min=9 max=9 step=1 */
        filename_number_padding?: _INT
        extension: Enum_WASImageSave_extension
        /** default=100 min=100 max=100 step=1 */
        quality?: _INT
        lossless_webp: Enum_ImageDrawRectangleRounded_top_left_corner
        overwrite_mode: Enum_WASImageSave_overwrite_mode
        show_history: Enum_ImageDrawRectangleRounded_top_left_corner
        show_history_by_prefix: Enum_ImageDrawRectangleRounded_top_left_corner
        embed_workflow: Enum_ImageDrawRectangleRounded_top_left_corner
    }

    // |=============================================================================|
    // | WASImageSeamlessTexture ("Image Seamless Texture" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASImageSeamlessTexture extends HasSingle_IMAGE, ComfyNode<WASImageSeamlessTexture_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageSeamlessTexture_input = {
        images: _IMAGE
        /** default=0.4 min=1 max=1 step=0.01 */
        blending?: _FLOAT
        tiled: Enum_ImageDrawRectangleRounded_top_left_corner
        /** default=2 min=6 max=6 step=2 */
        tiles?: _INT
    }

    // |=============================================================================|
    // | WASImageSelectChannel ("Image Select Channel" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASImageSelectChannel extends HasSingle_IMAGE, ComfyNode<WASImageSelectChannel_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageSelectChannel_input = {
        image: _IMAGE
        channel: Enum_ImageToMask_channel
    }

    // |=============================================================================|
    // | WASImageSelectColor ("Image Select Color" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASImageSelectColor extends HasSingle_IMAGE, ComfyNode<WASImageSelectColor_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageSelectColor_input = {
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

    // |=============================================================================|
    // | WASImageShadowsAndHighlights ("Image Shadows and Highlights" in ComfyUI) [WAS Suite_Image_Adjustment]   |
    // |=============================================================================|
    export interface WASImageShadowsAndHighlights extends ComfyNode<WASImageShadowsAndHighlights_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
        IMAGE_2: Slot<'IMAGE', 2>
    }
    export type WASImageShadowsAndHighlights_input = {
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

    // |=============================================================================|
    // | WASImageSizeToNumber ("Image Size to Number" in ComfyUI) [WAS Suite_Number_Operations]   |
    // |=============================================================================|
    export interface WASImageSizeToNumber extends ComfyNode<WASImageSizeToNumber_input> {
        NUMBER: Slot<'NUMBER', 0>
        NUMBER_1: Slot<'NUMBER', 1>
    }
    export type WASImageSizeToNumber_input = {
        image: _IMAGE
    }

    // |=============================================================================|
    // | WASImageStitch ("Image Stitch" in ComfyUI) [WAS Suite_Image_Transform]      |
    // |=============================================================================|
    export interface WASImageStitch extends HasSingle_IMAGE, ComfyNode<WASImageStitch_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageStitch_input = {
        image_a: _IMAGE
        image_b: _IMAGE
        stitch: Enum_WASImageStitch_stitch
        /** default=50 min=2048 max=2048 step=1 */
        feathering?: _INT
    }

    // |=============================================================================|
    // | WASImageStyleFilter ("Image Style Filter" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageStyleFilter extends HasSingle_IMAGE, ComfyNode<WASImageStyleFilter_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageStyleFilter_input = {
        image: _IMAGE
        style: Enum_WASImageStyleFilter_style
    }

    // |=============================================================================|
    // | WASImageThreshold ("Image Threshold" in ComfyUI) [WAS Suite_Image_Process]   |
    // |=============================================================================|
    export interface WASImageThreshold extends HasSingle_IMAGE, ComfyNode<WASImageThreshold_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageThreshold_input = {
        image: _IMAGE
        /** default=0.5 min=1 max=1 step=0.01 */
        threshold?: _FLOAT
    }

    // |=============================================================================|
    // | WASImageTiled ("Image Tiled" in ComfyUI) [WAS Suite_Image_Process]          |
    // |=============================================================================|
    export interface WASImageTiled extends HasSingle_IMAGE, ComfyNode<WASImageTiled_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageTiled_input = {
        image: _IMAGE
        /** default=4 min=64 max=64 step=1 */
        num_tiles?: _INT
    }

    // |=============================================================================|
    // | WASImageTranspose ("Image Transpose" in ComfyUI) [WAS Suite_Image_Transform]   |
    // |=============================================================================|
    export interface WASImageTranspose extends HasSingle_IMAGE, ComfyNode<WASImageTranspose_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageTranspose_input = {
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

    // |=============================================================================|
    // | WASImageFDOFFilter ("Image fDOF Filter" in ComfyUI) [WAS Suite_Image_Filter]   |
    // |=============================================================================|
    export interface WASImageFDOFFilter extends HasSingle_IMAGE, ComfyNode<WASImageFDOFFilter_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageFDOFFilter_input = {
        image: _IMAGE
        depth: _IMAGE
        mode: Enum_WASImageFDOFFilter_mode
        /** default=8 min=128 max=128 step=1 */
        radius?: _INT
        /** default=1 min=3 max=3 step=1 */
        samples?: _INT
    }

    // |=============================================================================|
    // | WASImageToLatentMask ("Image to Latent Mask" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASImageToLatentMask extends HasSingle_MASK, ComfyNode<WASImageToLatentMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASImageToLatentMask_input = {
        images: _IMAGE
        channel: Enum_LoadImageMask_channel
    }

    // |=============================================================================|
    // | WASImageToNoise ("Image to Noise" in ComfyUI) [WAS Suite_Image_Generate_Noise]   |
    // |=============================================================================|
    export interface WASImageToNoise extends HasSingle_IMAGE, ComfyNode<WASImageToNoise_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageToNoise_input = {
        images: _IMAGE
        /** default=16 min=256 max=256 step=2 */
        num_colors?: _INT
        /** default=0 min=20 max=20 step=1 */
        black_mix?: _INT
        /** default=0 min=1024 max=1024 step=0.1 */
        gaussian_mix?: _FLOAT
        /** default=1 min=2 max=2 step=0.01 */
        brightness?: _FLOAT
        output_mode: Enum_WASImageToNoise_output_mode
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
    }

    // |=============================================================================|
    // | WASImageToSeed ("Image to Seed" in ComfyUI) [WAS Suite_Image_Analyze]       |
    // |=============================================================================|
    export interface WASImageToSeed extends HasSingle_INT, ComfyNode<WASImageToSeed_input> {
        INT: Slot<'INT', 0>
    }
    export type WASImageToSeed_input = {
        images: _IMAGE
    }

    // |=============================================================================|
    // | WASImageVoronoiNoiseFilter ("Image Voronoi Noise Filter" in ComfyUI) [WAS Suite_Image_Generate_Noise]   |
    // |=============================================================================|
    export interface WASImageVoronoiNoiseFilter extends HasSingle_IMAGE, ComfyNode<WASImageVoronoiNoiseFilter_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASImageVoronoiNoiseFilter_input = {
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
    }

    // |=============================================================================|
    // | WASKSamplerWAS ("KSampler (WAS)" in ComfyUI) [WAS Suite_Sampling]           |
    // |=============================================================================|
    export interface WASKSamplerWAS extends HasSingle_LATENT, ComfyNode<WASKSamplerWAS_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type WASKSamplerWAS_input = {
        model: _MODEL
        seed: _SEED
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        positive: _CONDITIONING
        negative: _CONDITIONING
        latent_image: _LATENT
        /** default=1 min=1 max=1 step=0.01 */
        denoise?: _FLOAT
    }

    // |=============================================================================|
    // | WASKSamplerCycle ("KSampler Cycle" in ComfyUI) [WAS Suite_Sampling]         |
    // |=============================================================================|
    export interface WASKSamplerCycle extends HasSingle_LATENT, ComfyNode<WASKSamplerCycle_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type WASKSamplerCycle_input = {
        model: _MODEL
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** default=20 min=10000 max=10000 */
        steps?: _INT
        /** default=8 min=100 max=100 */
        cfg?: _FLOAT
        sampler_name: Enum_KSampler_sampler_name
        scheduler: Enum_KSampler_scheduler
        positive: _CONDITIONING
        negative: _CONDITIONING
        latent_image: _LATENT
        tiled_vae: Enum_KSamplerAdvanced_add_noise
        /** default=2 min=8 max=8 step=0.1 */
        upscale_factor?: _FLOAT
        /** default=2 min=12 max=12 step=1 */
        upscale_steps?: _INT
        /** default=1 min=1 max=1 step=0.01 */
        starting_denoise?: _FLOAT
        /** default=0.5 min=1 max=1 step=0.01 */
        cycle_denoise?: _FLOAT
        scale_denoise: Enum_KSamplerAdvanced_add_noise
        scale_sampling: Enum_WASImageResize_resampling
        vae: _VAE
        upscale_model?: _UPSCALE_MODEL
        pos_additive?: _CONDITIONING
        neg_additive?: _CONDITIONING
        /** default=0.25 min=1 max=1 step=0.01 */
        pos_add_strength?: _FLOAT
        pos_add_strength_scaling?: Enum_KSamplerAdvanced_add_noise
        /** default=2 min=10 max=10 step=0.01 */
        pos_add_strength_cutoff?: _FLOAT
        /** default=0.25 min=1 max=1 step=0.01 */
        neg_add_strength?: _FLOAT
        neg_add_strength_scaling?: Enum_KSamplerAdvanced_add_noise
        /** default=2 min=10 max=10 step=0.01 */
        neg_add_strength_cutoff?: _FLOAT
        /** default=0 min=10 max=10 step=0.01 */
        sharpen_strength?: _FLOAT
        /** default=2 min=12 max=12 step=1 */
        sharpen_radius?: _INT
    }

    // |=============================================================================|
    // | WASLatentNoiseInjection ("Latent Noise Injection" in ComfyUI) [WAS Suite_Latent_Generate]   |
    // |=============================================================================|
    export interface WASLatentNoiseInjection extends HasSingle_LATENT, ComfyNode<WASLatentNoiseInjection_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type WASLatentNoiseInjection_input = {
        samples: _LATENT
        /** default=0.1 min=1 max=1 step=0.01 */
        noise_std?: _FLOAT
    }

    // |=============================================================================|
    // | WASLatentSizeToNumber ("Latent Size to Number" in ComfyUI) [WAS Suite_Number_Operations]   |
    // |=============================================================================|
    export interface WASLatentSizeToNumber extends ComfyNode<WASLatentSizeToNumber_input> {
        NUMBER: Slot<'NUMBER', 0>
        NUMBER_1: Slot<'NUMBER', 1>
    }
    export type WASLatentSizeToNumber_input = {
        samples: _LATENT
    }

    // |=============================================================================|
    // | WASLatentUpscaleByFactorWAS ("Latent Upscale by Factor (WAS)" in ComfyUI) [WAS Suite_Latent_Transform]   |
    // |=============================================================================|
    export interface WASLatentUpscaleByFactorWAS extends HasSingle_LATENT, ComfyNode<WASLatentUpscaleByFactorWAS_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type WASLatentUpscaleByFactorWAS_input = {
        samples: _LATENT
        mode: Enum_WASLatentUpscaleByFactorWAS_mode
        /** default=2 min=8 max=8 step=0.01 */
        factor?: _FLOAT
        align: Enum_ImageDrawRectangleRounded_top_left_corner
    }

    // |=============================================================================|
    // | WASLoadImageBatch ("Load Image Batch" in ComfyUI) [WAS Suite_IO]            |
    // |=============================================================================|
    export interface WASLoadImageBatch extends HasSingle_IMAGE, HasSingle_ASCII, ComfyNode<WASLoadImageBatch_input> {
        IMAGE: Slot<'IMAGE', 0>
        ASCII: Slot<'ASCII', 1>
    }
    export type WASLoadImageBatch_input = {
        mode: Enum_WASLoadImageBatch_mode
        /** default=0 min=150000 max=150000 step=1 */
        index?: _INT
        /** default="Batch 001" */
        label?: _STRING
        /** default="" */
        path?: _STRING
        /** default="*" */
        pattern?: _STRING
    }

    // |=============================================================================|
    // | WASLoadTextFile ("Load Text File" in ComfyUI) [WAS Suite_IO]                |
    // |=============================================================================|
    export interface WASLoadTextFile extends HasSingle_ASCII, HasSingle_DICT, ComfyNode<WASLoadTextFile_input> {
        ASCII: Slot<'ASCII', 0>
        DICT: Slot<'DICT', 1>
    }
    export type WASLoadTextFile_input = {
        /** default="" */
        file_path?: _STRING
        /** default="[filename]" */
        dictionary_name?: _STRING
    }

    // |=============================================================================|
    // | WASLoadLora ("Load Lora" in ComfyUI) [WAS Suite_Loaders]                    |
    // |=============================================================================|
    export interface WASLoadLora extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_STRING, ComfyNode<WASLoadLora_input> {
        MODEL: Slot<'MODEL', 0>
        CLIP: Slot<'CLIP', 1>
        STRING: Slot<'STRING', 2>
    }
    export type WASLoadLora_input = {
        model: _MODEL
        clip: _CLIP
        lora_name: Enum_EfficientLoader_lora_name
        /** default=1 min=10 max=10 step=0.01 */
        strength_model?: _FLOAT
        /** default=1 min=10 max=10 step=0.01 */
        strength_clip?: _FLOAT
    }

    // |=============================================================================|
    // | WASMasksAdd ("Masks Add" in ComfyUI) [WAS Suite_Image_Masking]              |
    // |=============================================================================|
    export interface WASMasksAdd extends HasSingle_MASK, ComfyNode<WASMasksAdd_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMasksAdd_input = {
        masks_a: _MASK
        masks_b: _MASK
    }

    // |=============================================================================|
    // | WASMasksSubtract ("Masks Subtract" in ComfyUI) [WAS Suite_Image_Masking]    |
    // |=============================================================================|
    export interface WASMasksSubtract extends HasSingle_MASK, ComfyNode<WASMasksSubtract_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMasksSubtract_input = {
        masks_a: _MASK
        masks_b: _MASK
    }

    // |=============================================================================|
    // | WASMaskArbitraryRegion ("Mask Arbitrary Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskArbitraryRegion extends HasSingle_MASK, ComfyNode<WASMaskArbitraryRegion_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskArbitraryRegion_input = {
        masks: _MASK
        /** default=256 min=4096 max=4096 step=1 */
        size?: _INT
        /** default=128 min=255 max=255 step=1 */
        threshold?: _INT
    }

    // |=============================================================================|
    // | WASMaskBatchToMask ("Mask Batch to Mask" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskBatchToMask extends HasSingle_MASK, ComfyNode<WASMaskBatchToMask_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskBatchToMask_input = {
        masks: _MASK
        /** default=0 min=64 max=64 step=1 */
        batch_number?: _INT
    }

    // |=============================================================================|
    // | WASMaskCeilingRegion ("Mask Ceiling Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskCeilingRegion extends HasSingle_MASK, ComfyNode<WASMaskCeilingRegion_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskCeilingRegion_input = {
        masks: _MASK
    }

    // |=============================================================================|
    // | WASMaskCropDominantRegion ("Mask Crop Dominant Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskCropDominantRegion extends HasSingle_MASK, ComfyNode<WASMaskCropDominantRegion_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskCropDominantRegion_input = {
        masks: _MASK
        /** default=24 min=4096 max=4096 step=1 */
        padding?: _INT
    }

    // |=============================================================================|
    // | WASMaskCropMinorityRegion ("Mask Crop Minority Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskCropMinorityRegion extends HasSingle_MASK, ComfyNode<WASMaskCropMinorityRegion_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskCropMinorityRegion_input = {
        masks: _MASK
        /** default=24 min=4096 max=4096 step=1 */
        padding?: _INT
    }

    // |=============================================================================|
    // | WASMaskCropRegion ("Mask Crop Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskCropRegion extends HasSingle_MASK, HasSingle_CROP_DATA, ComfyNode<WASMaskCropRegion_input> {
        MASK: Slot<'MASK', 0>
        CROP_DATA: Slot<'CROP_DATA', 1>
        INT: Slot<'INT', 2>
        INT_1: Slot<'INT', 3>
        INT_2: Slot<'INT', 4>
        INT_3: Slot<'INT', 5>
        INT_4: Slot<'INT', 6>
        INT_5: Slot<'INT', 7>
    }
    export type WASMaskCropRegion_input = {
        mask: _MASK
        /** default=24 min=4096 max=4096 step=1 */
        padding?: _INT
        region_type: Enum_WASMaskCropRegion_region_type
    }

    // |=============================================================================|
    // | WASMaskPasteRegion ("Mask Paste Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskPasteRegion extends ComfyNode<WASMaskPasteRegion_input> {
        MASK: Slot<'MASK', 0>
        MASK_1: Slot<'MASK', 1>
    }
    export type WASMaskPasteRegion_input = {
        mask: _MASK
        crop_mask: _MASK
        crop_data: _CROP_DATA
        /** default=0.25 min=1 max=1 step=0.01 */
        crop_blending?: _FLOAT
        /** default=0 min=3 max=3 step=1 */
        crop_sharpening?: _INT
    }

    // |=============================================================================|
    // | WASMaskDilateRegion ("Mask Dilate Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskDilateRegion extends HasSingle_MASK, ComfyNode<WASMaskDilateRegion_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskDilateRegion_input = {
        masks: _MASK
        /** default=5 min=64 max=64 step=1 */
        iterations?: _INT
    }

    // |=============================================================================|
    // | WASMaskDominantRegion ("Mask Dominant Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskDominantRegion extends HasSingle_MASK, ComfyNode<WASMaskDominantRegion_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskDominantRegion_input = {
        masks: _MASK
        /** default=128 min=255 max=255 step=1 */
        threshold?: _INT
    }

    // |=============================================================================|
    // | WASMaskErodeRegion ("Mask Erode Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskErodeRegion extends HasSingle_MASK, ComfyNode<WASMaskErodeRegion_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskErodeRegion_input = {
        masks: _MASK
        /** default=5 min=64 max=64 step=1 */
        iterations?: _INT
    }

    // |=============================================================================|
    // | WASMaskFillHoles ("Mask Fill Holes" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskFillHoles extends HasSingle_MASK, ComfyNode<WASMaskFillHoles_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskFillHoles_input = {
        masks: _MASK
    }

    // |=============================================================================|
    // | WASMaskFloorRegion ("Mask Floor Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskFloorRegion extends HasSingle_MASK, ComfyNode<WASMaskFloorRegion_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskFloorRegion_input = {
        masks: _MASK
    }

    // |=============================================================================|
    // | WASMaskGaussianRegion ("Mask Gaussian Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskGaussianRegion extends HasSingle_MASK, ComfyNode<WASMaskGaussianRegion_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskGaussianRegion_input = {
        masks: _MASK
        /** default=5 min=1024 max=1024 step=0.1 */
        radius?: _FLOAT
    }

    // |=============================================================================|
    // | WASMaskInvert ("Mask Invert" in ComfyUI) [WAS Suite_Image_Masking]          |
    // |=============================================================================|
    export interface WASMaskInvert extends HasSingle_MASK, ComfyNode<WASMaskInvert_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskInvert_input = {
        masks: _MASK
    }

    // |=============================================================================|
    // | WASMaskMinorityRegion ("Mask Minority Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskMinorityRegion extends HasSingle_MASK, ComfyNode<WASMaskMinorityRegion_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskMinorityRegion_input = {
        masks: _MASK
        /** default=128 min=255 max=255 step=1 */
        threshold?: _INT
    }

    // |=============================================================================|
    // | WASMaskSmoothRegion ("Mask Smooth Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskSmoothRegion extends HasSingle_MASK, ComfyNode<WASMaskSmoothRegion_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskSmoothRegion_input = {
        masks: _MASK
        /** default=5 min=128 max=128 step=0.1 */
        sigma?: _FLOAT
    }

    // |=============================================================================|
    // | WASMaskThresholdRegion ("Mask Threshold Region" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMaskThresholdRegion extends HasSingle_MASK, ComfyNode<WASMaskThresholdRegion_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMaskThresholdRegion_input = {
        masks: _MASK
        /** default=75 min=255 max=255 step=1 */
        black_threshold?: _INT
        /** default=175 min=255 max=255 step=1 */
        white_threshold?: _INT
    }

    // |=============================================================================|
    // | WASMasksCombineRegions ("Masks Combine Regions" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMasksCombineRegions extends HasSingle_MASK, ComfyNode<WASMasksCombineRegions_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMasksCombineRegions_input = {
        mask_a: _MASK
        mask_b: _MASK
        mask_c?: _MASK
        mask_d?: _MASK
        mask_e?: _MASK
        mask_f?: _MASK
    }

    // |=============================================================================|
    // | WASMasksCombineBatch ("Masks Combine Batch" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASMasksCombineBatch extends HasSingle_MASK, ComfyNode<WASMasksCombineBatch_input> {
        MASK: Slot<'MASK', 0>
    }
    export type WASMasksCombineBatch_input = {
        masks: _MASK
    }

    // |=============================================================================|
    // | WASMiDaSModelLoader ("MiDaS Model Loader" in ComfyUI) [WAS Suite_Loaders]   |
    // |=============================================================================|
    export interface WASMiDaSModelLoader extends HasSingle_MIDAS_MODEL, ComfyNode<WASMiDaSModelLoader_input> {
        MIDAS_MODEL: Slot<'MIDAS_MODEL', 0>
    }
    export type WASMiDaSModelLoader_input = {
        midas_model: Enum_WASMiDaSModelLoader_midas_model
    }

    // |=============================================================================|
    // | WASMiDaSDepthApproximation ("MiDaS Depth Approximation" in ComfyUI) [WAS Suite_Image_AI]   |
    // |=============================================================================|
    export interface WASMiDaSDepthApproximation extends HasSingle_IMAGE, ComfyNode<WASMiDaSDepthApproximation_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASMiDaSDepthApproximation_input = {
        image: _IMAGE
        use_cpu: Enum_ImageDrawRectangleRounded_top_left_corner
        midas_type: Enum_WASMiDaSModelLoader_midas_model
        invert_depth: Enum_ImageDrawRectangleRounded_top_left_corner
        midas_model?: _MIDAS_MODEL
    }

    // |=============================================================================|
    // | WASMiDaSMaskImage ("MiDaS Mask Image" in ComfyUI) [WAS Suite_Image_AI]      |
    // |=============================================================================|
    export interface WASMiDaSMaskImage extends ComfyNode<WASMiDaSMaskImage_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_1: Slot<'IMAGE', 1>
    }
    export type WASMiDaSMaskImage_input = {
        image: _IMAGE
        use_cpu: Enum_ImageDrawRectangleRounded_top_left_corner
        midas_model: Enum_WASMiDaSMaskImage_midas_model
        remove: Enum_WASMiDaSMaskImage_remove
        threshold: Enum_ImageDrawRectangleRounded_top_left_corner
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

    // |=============================================================================|
    // | WASModelInputSwitch ("Model Input Switch" in ComfyUI) [WAS Suite_Logic]     |
    // |=============================================================================|
    export interface WASModelInputSwitch extends HasSingle_MODEL, ComfyNode<WASModelInputSwitch_input> {
        MODEL: Slot<'MODEL', 0>
    }
    export type WASModelInputSwitch_input = {
        model_a: _MODEL
        model_b: _MODEL
        boolean_number: _NUMBER
    }

    // |=============================================================================|
    // | WASNumberOperation ("Number Operation" in ComfyUI) [WAS Suite_Number_Operations]   |
    // |=============================================================================|
    export interface WASNumberOperation extends HasSingle_NUMBER, ComfyNode<WASNumberOperation_input> {
        NUMBER: Slot<'NUMBER', 0>
    }
    export type WASNumberOperation_input = {
        number_a: _NUMBER
        number_b: _NUMBER
        operation: Enum_WASNumberOperation_operation
    }

    // |=============================================================================|
    // | WASNumberToFloat ("Number to Float" in ComfyUI) [WAS Suite_Number_Operations]   |
    // |=============================================================================|
    export interface WASNumberToFloat extends HasSingle_FLOAT, ComfyNode<WASNumberToFloat_input> {
        FLOAT: Slot<'FLOAT', 0>
    }
    export type WASNumberToFloat_input = {
        number: _NUMBER
    }

    // |=============================================================================|
    // | WASNumberInputSwitch ("Number Input Switch" in ComfyUI) [WAS Suite_Logic]   |
    // |=============================================================================|
    export interface WASNumberInputSwitch extends HasSingle_NUMBER, ComfyNode<WASNumberInputSwitch_input> {
        NUMBER: Slot<'NUMBER', 0>
    }
    export type WASNumberInputSwitch_input = {
        number_a: _NUMBER
        number_b: _NUMBER
        boolean_number: _NUMBER
    }

    // |=============================================================================|
    // | WASNumberInputCondition ("Number Input Condition" in ComfyUI) [WAS Suite_Logic]   |
    // |=============================================================================|
    export interface WASNumberInputCondition extends HasSingle_NUMBER, ComfyNode<WASNumberInputCondition_input> {
        NUMBER: Slot<'NUMBER', 0>
    }
    export type WASNumberInputCondition_input = {
        number_a: _NUMBER
        number_b: _NUMBER
        return_boolean: Enum_ImageDrawRectangleRounded_top_left_corner
        comparison: Enum_WASNumberInputCondition_comparison
    }

    // |=============================================================================|
    // | WASNumberMultipleOf ("Number Multiple Of" in ComfyUI) [WAS Suite_Number_Functions]   |
    // |=============================================================================|
    export interface WASNumberMultipleOf extends HasSingle_NUMBER, ComfyNode<WASNumberMultipleOf_input> {
        NUMBER: Slot<'NUMBER', 0>
    }
    export type WASNumberMultipleOf_input = {
        number: _NUMBER
        /** default=8 min=18446744073709552000 max=18446744073709552000 */
        multiple?: _INT
    }

    // |=============================================================================|
    // | WASNumberPI ("Number PI" in ComfyUI) [WAS Suite_Number]                     |
    // |=============================================================================|
    export interface WASNumberPI extends HasSingle_NUMBER, ComfyNode<WASNumberPI_input> {
        NUMBER: Slot<'NUMBER', 0>
    }
    export type WASNumberPI_input = {}

    // |=============================================================================|
    // | WASNumberToInt ("Number to Int" in ComfyUI) [WAS Suite_Number_Operations]   |
    // |=============================================================================|
    export interface WASNumberToInt extends HasSingle_INT, ComfyNode<WASNumberToInt_input> {
        INT: Slot<'INT', 0>
    }
    export type WASNumberToInt_input = {
        number: _NUMBER
    }

    // |=============================================================================|
    // | WASNumberToSeed ("Number to Seed" in ComfyUI) [WAS Suite_Number_Operations]   |
    // |=============================================================================|
    export interface WASNumberToSeed extends HasSingle_SEED, ComfyNode<WASNumberToSeed_input> {
        SEED: Slot<'SEED', 0>
    }
    export type WASNumberToSeed_input = {
        number: _NUMBER
    }

    // |=============================================================================|
    // | WASNumberToString ("Number to String" in ComfyUI) [WAS Suite_Number_Operations]   |
    // |=============================================================================|
    export interface WASNumberToString extends HasSingle_STRING, ComfyNode<WASNumberToString_input> {
        STRING: Slot<'STRING', 0>
    }
    export type WASNumberToString_input = {
        number: _NUMBER
    }

    // |=============================================================================|
    // | WASNumberToText ("Number to Text" in ComfyUI) [WAS Suite_Number_Operations]   |
    // |=============================================================================|
    export interface WASNumberToText extends HasSingle_ASCII, ComfyNode<WASNumberToText_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASNumberToText_input = {
        number: _NUMBER
    }

    // |=============================================================================|
    // | WASPromptStylesSelector ("Prompt Styles Selector" in ComfyUI) [WAS Suite_Text]   |
    // |=============================================================================|
    export interface WASPromptStylesSelector extends ComfyNode<WASPromptStylesSelector_input> {
        ASCII: Slot<'ASCII', 0>
        ASCII_1: Slot<'ASCII', 1>
    }
    export type WASPromptStylesSelector_input = {
        style: Enum_WASPromptStylesSelector_style
    }

    // |=============================================================================|
    // | WASRandomNumber ("Random Number" in ComfyUI) [WAS Suite_Number]             |
    // |=============================================================================|
    export interface WASRandomNumber extends HasSingle_NUMBER, ComfyNode<WASRandomNumber_input> {
        NUMBER: Slot<'NUMBER', 0>
    }
    export type WASRandomNumber_input = {
        number_type: Enum_WASConstantNumber_number_type
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        minimum?: _FLOAT
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        maximum?: _FLOAT
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
    }

    // |=============================================================================|
    // | WASSaveTextFile ("Save Text File" in ComfyUI) [WAS Suite_IO]                |
    // |=============================================================================|
    export interface WASSaveTextFile extends ComfyNode<WASSaveTextFile_input> {}
    export type WASSaveTextFile_input = {
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

    // |=============================================================================|
    // | WASSeed ("Seed" in ComfyUI) [WAS Suite_Number]                              |
    // |=============================================================================|
    export interface WASSeed extends HasSingle_SEED, ComfyNode<WASSeed_input> {
        SEED: Slot<'SEED', 0>
    }
    export type WASSeed_input = {
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
    }

    // |=============================================================================|
    // | WASTensorBatchToImage ("Tensor Batch to Image" in ComfyUI) [WAS Suite_Latent_Transform]   |
    // |=============================================================================|
    export interface WASTensorBatchToImage extends HasSingle_IMAGE, ComfyNode<WASTensorBatchToImage_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASTensorBatchToImage_input = {
        images_batch: _IMAGE
        /** default=0 min=64 max=64 step=1 */
        batch_image_number?: _INT
    }

    // |=============================================================================|
    // | WASBLIPAnalyzeImage ("BLIP Analyze Image" in ComfyUI) [WAS Suite_Text_AI]   |
    // |=============================================================================|
    export interface WASBLIPAnalyzeImage extends HasSingle_ASCII, ComfyNode<WASBLIPAnalyzeImage_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASBLIPAnalyzeImage_input = {
        image: _IMAGE
        mode: Enum_WASBLIPModelLoader_blip_model
        /** default="What does the background consist of?" */
        question?: _STRING
        blip_model?: _BLIP_MODEL
    }

    // |=============================================================================|
    // | WASSAMModelLoader ("SAM Model Loader" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASSAMModelLoader extends HasSingle_SAM_MODEL, ComfyNode<WASSAMModelLoader_input> {
        SAM_MODEL: Slot<'SAM_MODEL', 0>
    }
    export type WASSAMModelLoader_input = {
        model_size: Enum_WASSAMModelLoader_model_size
    }

    // |=============================================================================|
    // | WASSAMParameters ("SAM Parameters" in ComfyUI) [WAS Suite_Image_Masking]    |
    // |=============================================================================|
    export interface WASSAMParameters extends HasSingle_SAM_PARAMETERS, ComfyNode<WASSAMParameters_input> {
        SAM_PARAMETERS: Slot<'SAM_PARAMETERS', 0>
    }
    export type WASSAMParameters_input = {
        /** default="[128, 128]; [0, 0]" */
        points?: _STRING
        /** default="[1, 0]" */
        labels?: _STRING
    }

    // |=============================================================================|
    // | WASSAMParametersCombine ("SAM Parameters Combine" in ComfyUI) [WAS Suite_Image_Masking]   |
    // |=============================================================================|
    export interface WASSAMParametersCombine extends HasSingle_SAM_PARAMETERS, ComfyNode<WASSAMParametersCombine_input> {
        SAM_PARAMETERS: Slot<'SAM_PARAMETERS', 0>
    }
    export type WASSAMParametersCombine_input = {
        sam_parameters_a: _SAM_PARAMETERS
        sam_parameters_b: _SAM_PARAMETERS
    }

    // |=============================================================================|
    // | WASSAMImageMask ("SAM Image Mask" in ComfyUI) [WAS Suite_Image_Masking]     |
    // |=============================================================================|
    export interface WASSAMImageMask extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<WASSAMImageMask_input> {
        IMAGE: Slot<'IMAGE', 0>
        MASK: Slot<'MASK', 1>
    }
    export type WASSAMImageMask_input = {
        sam_model: _SAM_MODEL
        sam_parameters: _SAM_PARAMETERS
        image: _IMAGE
    }

    // |=============================================================================|
    // | WASSamplesPassthroughStatSystem ("Samples Passthrough (Stat System)" in ComfyUI) [WAS Suite_Debug]   |
    // |=============================================================================|
    export interface WASSamplesPassthroughStatSystem extends HasSingle_LATENT, ComfyNode<WASSamplesPassthroughStatSystem_input> {
        LATENT: Slot<'LATENT', 0>
    }
    export type WASSamplesPassthroughStatSystem_input = {
        samples: _LATENT
    }

    // |=============================================================================|
    // | WASStringToText ("String to Text" in ComfyUI) [WAS Suite_Text_Operations]   |
    // |=============================================================================|
    export interface WASStringToText extends HasSingle_ASCII, ComfyNode<WASStringToText_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASStringToText_input = {
        /** */
        string: _STRING
    }

    // |=============================================================================|
    // | WASImageBounds ("Image Bounds" in ComfyUI) [WAS Suite_Image_Bound]          |
    // |=============================================================================|
    export interface WASImageBounds extends HasSingle_IMAGE_BOUNDS, ComfyNode<WASImageBounds_input> {
        IMAGE_BOUNDS: Slot<'IMAGE_BOUNDS', 0>
    }
    export type WASImageBounds_input = {
        image: _IMAGE
    }

    // |=============================================================================|
    // | WASInsetImageBounds ("Inset Image Bounds" in ComfyUI) [WAS Suite_Image_Bound]   |
    // |=============================================================================|
    export interface WASInsetImageBounds extends HasSingle_IMAGE_BOUNDS, ComfyNode<WASInsetImageBounds_input> {
        IMAGE_BOUNDS: Slot<'IMAGE_BOUNDS', 0>
    }
    export type WASInsetImageBounds_input = {
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

    // |=============================================================================|
    // | WASBoundedImageBlend ("Bounded Image Blend" in ComfyUI) [WAS Suite_Image_Bound]   |
    // |=============================================================================|
    export interface WASBoundedImageBlend extends HasSingle_IMAGE, ComfyNode<WASBoundedImageBlend_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASBoundedImageBlend_input = {
        target: _IMAGE
        target_bounds: _IMAGE_BOUNDS
        source: _IMAGE
        /** default=1 min=1 max=1 */
        blend_factor?: _FLOAT
        /** default=16 min=18446744073709552000 max=18446744073709552000 */
        feathering?: _INT
    }

    // |=============================================================================|
    // | WASBoundedImageBlendWithMask ("Bounded Image Blend with Mask" in ComfyUI) [WAS Suite_Image_Bound]   |
    // |=============================================================================|
    export interface WASBoundedImageBlendWithMask extends HasSingle_IMAGE, ComfyNode<WASBoundedImageBlendWithMask_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASBoundedImageBlendWithMask_input = {
        target: _IMAGE
        target_mask: _MASK
        target_bounds: _IMAGE_BOUNDS
        source: _IMAGE
        /** default=1 min=1 max=1 */
        blend_factor?: _FLOAT
        /** default=16 min=18446744073709552000 max=18446744073709552000 */
        feathering?: _INT
    }

    // |=============================================================================|
    // | WASBoundedImageCrop ("Bounded Image Crop" in ComfyUI) [WAS Suite_Image_Bound]   |
    // |=============================================================================|
    export interface WASBoundedImageCrop extends HasSingle_IMAGE, ComfyNode<WASBoundedImageCrop_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type WASBoundedImageCrop_input = {
        image: _IMAGE
        image_bounds: _IMAGE_BOUNDS
    }

    // |=============================================================================|
    // | WASBoundedImageCropWithMask ("Bounded Image Crop with Mask" in ComfyUI) [WAS Suite_Image_Bound]   |
    // |=============================================================================|
    export interface WASBoundedImageCropWithMask
        extends HasSingle_IMAGE,
            HasSingle_IMAGE_BOUNDS,
            ComfyNode<WASBoundedImageCropWithMask_input> {
        IMAGE: Slot<'IMAGE', 0>
        IMAGE_BOUNDS: Slot<'IMAGE_BOUNDS', 1>
    }
    export type WASBoundedImageCropWithMask_input = {
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

    // |=============================================================================|
    // | WASTextDictionaryUpdate ("Text Dictionary Update" in ComfyUI) [WAS Suite_Text]   |
    // |=============================================================================|
    export interface WASTextDictionaryUpdate extends HasSingle_DICT, ComfyNode<WASTextDictionaryUpdate_input> {
        DICT: Slot<'DICT', 0>
    }
    export type WASTextDictionaryUpdate_input = {
        dictionary_a: _DICT
        dictionary_b: _DICT
        dictionary_c?: _DICT
        dictionary_d?: _DICT
    }

    // |=============================================================================|
    // | WASTextAddTokens ("Text Add Tokens" in ComfyUI) [WAS Suite_Text_Tokens]     |
    // |=============================================================================|
    export interface WASTextAddTokens extends ComfyNode<WASTextAddTokens_input> {}
    export type WASTextAddTokens_input = {
        /** default="[hello]: world" */
        tokens?: _STRING
        print_current_tokens: Enum_ImageDrawRectangleRounded_top_left_corner
    }

    // |=============================================================================|
    // | WASTextAddTokenByInput ("Text Add Token by Input" in ComfyUI) [WAS Suite_Text_Tokens]   |
    // |=============================================================================|
    export interface WASTextAddTokenByInput extends ComfyNode<WASTextAddTokenByInput_input> {}
    export type WASTextAddTokenByInput_input = {
        /** */
        token_name: _ASCII
        /** */
        token_value: _ASCII
        print_current_tokens: Enum_ImageDrawRectangleRounded_top_left_corner
    }

    // |=============================================================================|
    // | WASTextCompare ("Text Compare" in ComfyUI) [WAS Suite_Text_Search]          |
    // |=============================================================================|
    export interface WASTextCompare extends ComfyNode<WASTextCompare_input> {
        ASCII: Slot<'ASCII', 0>
        ASCII_1: Slot<'ASCII', 1>
        NUMBER: Slot<'NUMBER', 2>
        NUMBER_1: Slot<'NUMBER', 3>
        ASCII_2: Slot<'ASCII', 4>
    }
    export type WASTextCompare_input = {
        /** */
        text_a: _ASCII
        /** */
        text_b: _ASCII
        mode: Enum_WASTextCompare_mode
        /** default=0 min=1 max=1 step=0.01 */
        tolerance?: _FLOAT
    }

    // |=============================================================================|
    // | WASTextConcatenate ("Text Concatenate" in ComfyUI) [WAS Suite_Text]         |
    // |=============================================================================|
    export interface WASTextConcatenate extends HasSingle_ASCII, ComfyNode<WASTextConcatenate_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASTextConcatenate_input = {
        /** */
        text_a: _ASCII
        /** */
        text_b: _ASCII
        linebreak_addition: Enum_ImageDrawRectangleRounded_top_left_corner
        /** */
        text_c?: _ASCII
        /** */
        text_d?: _ASCII
    }

    // |=============================================================================|
    // | WASTextFileHistoryLoader ("Text File History Loader" in ComfyUI) [WAS Suite_History]   |
    // |=============================================================================|
    export interface WASTextFileHistoryLoader extends HasSingle_ASCII, HasSingle_DICT, ComfyNode<WASTextFileHistoryLoader_input> {
        ASCII: Slot<'ASCII', 0>
        DICT: Slot<'DICT', 1>
    }
    export type WASTextFileHistoryLoader_input = {
        file: Enum_WASTextFileHistoryLoader_file
        /** default="[filename]" */
        dictionary_name?: _STRING
    }

    // |=============================================================================|
    // | WASTextFindAndReplaceByDictionary ("Text Find and Replace by Dictionary" in ComfyUI) [WAS Suite_Text_Search]   |
    // |=============================================================================|
    export interface WASTextFindAndReplaceByDictionary
        extends HasSingle_ASCII,
            ComfyNode<WASTextFindAndReplaceByDictionary_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASTextFindAndReplaceByDictionary_input = {
        /** */
        text: _ASCII
        dictionary: _DICT
        /** default="__" */
        replacement_key?: _STRING
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
    }

    // |=============================================================================|
    // | WASTextFindAndReplaceInput ("Text Find and Replace Input" in ComfyUI) [WAS Suite_Text_Search]   |
    // |=============================================================================|
    export interface WASTextFindAndReplaceInput extends HasSingle_ASCII, ComfyNode<WASTextFindAndReplaceInput_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASTextFindAndReplaceInput_input = {
        /** */
        text: _ASCII
        /** */
        find: _ASCII
        /** */
        replace: _ASCII
    }

    // |=============================================================================|
    // | WASTextFindAndReplace ("Text Find and Replace" in ComfyUI) [WAS Suite_Text_Search]   |
    // |=============================================================================|
    export interface WASTextFindAndReplace extends HasSingle_ASCII, ComfyNode<WASTextFindAndReplace_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASTextFindAndReplace_input = {
        /** */
        text: _ASCII
        /** default="" */
        find?: _STRING
        /** default="" */
        replace?: _STRING
    }

    // |=============================================================================|
    // | WASTextInputSwitch ("Text Input Switch" in ComfyUI) [WAS Suite_Logic]       |
    // |=============================================================================|
    export interface WASTextInputSwitch extends HasSingle_ASCII, ComfyNode<WASTextInputSwitch_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASTextInputSwitch_input = {
        /** */
        text_a: _ASCII
        /** */
        text_b: _ASCII
        boolean_number: _NUMBER
    }

    // |=============================================================================|
    // | WASTextList ("Text List" in ComfyUI) [WAS Suite_Text]                       |
    // |=============================================================================|
    export interface WASTextList extends HasSingle_LIST, ComfyNode<WASTextList_input> {
        LIST: Slot<'LIST', 0>
    }
    export type WASTextList_input = {
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

    // |=============================================================================|
    // | WASTextListConcatenate ("Text List Concatenate" in ComfyUI) [WAS Suite_Text]   |
    // |=============================================================================|
    export interface WASTextListConcatenate extends HasSingle_LIST, ComfyNode<WASTextListConcatenate_input> {
        LIST: Slot<'LIST', 0>
    }
    export type WASTextListConcatenate_input = {
        /** */
        list_a: _LIST
        /** */
        list_b: _LIST
        /** */
        list_c?: _LIST
        /** */
        list_d?: _LIST
    }

    // |=============================================================================|
    // | WASTextLoadLineFromFile ("Text Load Line From File" in ComfyUI) [WAS Suite_Text]   |
    // |=============================================================================|
    export interface WASTextLoadLineFromFile extends HasSingle_ASCII, HasSingle_DICT, ComfyNode<WASTextLoadLineFromFile_input> {
        ASCII: Slot<'ASCII', 0>
        DICT: Slot<'DICT', 1>
    }
    export type WASTextLoadLineFromFile_input = {
        /** default="" */
        file_path?: _STRING
        /** default="[filename]" */
        dictionary_name?: _STRING
        /** default="TextBatch" */
        label?: _STRING
        mode: Enum_WASTextLoadLineFromFile_mode
        /** default=0 min=undefined step=1 */
        index?: _INT
        /** */
        multiline_text?: _ASCII
    }

    // |=============================================================================|
    // | WASTextMultiline ("Text Multiline" in ComfyUI) [WAS Suite_Text]             |
    // |=============================================================================|
    export interface WASTextMultiline extends HasSingle_ASCII, ComfyNode<WASTextMultiline_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASTextMultiline_input = {
        /** default="" */
        text?: _STRING
    }

    // |=============================================================================|
    // | WASTextParseA1111Embeddings ("Text Parse A1111 Embeddings" in ComfyUI) [WAS Suite_Text_Parse]   |
    // |=============================================================================|
    export interface WASTextParseA1111Embeddings extends HasSingle_ASCII, ComfyNode<WASTextParseA1111Embeddings_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASTextParseA1111Embeddings_input = {
        /** */
        text: _ASCII
    }

    // |=============================================================================|
    // | WASTextParseNoodleSoupPrompts ("Text Parse Noodle Soup Prompts" in ComfyUI) [WAS Suite_Text_Parse]   |
    // |=============================================================================|
    export interface WASTextParseNoodleSoupPrompts extends HasSingle_ASCII, ComfyNode<WASTextParseNoodleSoupPrompts_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASTextParseNoodleSoupPrompts_input = {
        mode: Enum_WASCLIPTextEncodeNSP_mode
        /** default="__" */
        noodle_key?: _STRING
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
        /** */
        text: _ASCII
    }

    // |=============================================================================|
    // | WASTextParseTokens ("Text Parse Tokens" in ComfyUI) [WAS Suite_Text_Tokens]   |
    // |=============================================================================|
    export interface WASTextParseTokens extends HasSingle_ASCII, ComfyNode<WASTextParseTokens_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASTextParseTokens_input = {
        /** */
        text: _ASCII
    }

    // |=============================================================================|
    // | WASTextRandomLine ("Text Random Line" in ComfyUI) [WAS Suite_Text]          |
    // |=============================================================================|
    export interface WASTextRandomLine extends HasSingle_ASCII, ComfyNode<WASTextRandomLine_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASTextRandomLine_input = {
        /** */
        text: _ASCII
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        seed?: _INT
    }

    // |=============================================================================|
    // | WASTextRandomPrompt ("Text Random Prompt" in ComfyUI) [WAS Suite_Text]      |
    // |=============================================================================|
    export interface WASTextRandomPrompt extends HasSingle_ASCII, ComfyNode<WASTextRandomPrompt_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASTextRandomPrompt_input = {
        /** */
        search_seed: _STRING
    }

    // |=============================================================================|
    // | WASTextString ("Text String" in ComfyUI) [WAS Suite_Text]                   |
    // |=============================================================================|
    export interface WASTextString extends ComfyNode<WASTextString_input> {
        ASCII: Slot<'ASCII', 0>
        ASCII_1: Slot<'ASCII', 1>
        ASCII_2: Slot<'ASCII', 2>
        ASCII_3: Slot<'ASCII', 3>
    }
    export type WASTextString_input = {
        /** default="" */
        text?: _STRING
        /** default="" */
        text_b?: _STRING
        /** default="" */
        text_c?: _STRING
        /** default="" */
        text_d?: _STRING
    }

    // |=============================================================================|
    // | WASTextToConditioning ("Text to Conditioning" in ComfyUI) [WAS Suite_Text_Operations]   |
    // |=============================================================================|
    export interface WASTextToConditioning extends HasSingle_CONDITIONING, ComfyNode<WASTextToConditioning_input> {
        CONDITIONING: Slot<'CONDITIONING', 0>
    }
    export type WASTextToConditioning_input = {
        clip: _CLIP
        /** */
        text: _ASCII
    }

    // |=============================================================================|
    // | WASTextToConsole ("Text to Console" in ComfyUI) [WAS Suite_Debug]           |
    // |=============================================================================|
    export interface WASTextToConsole extends HasSingle_ASCII, ComfyNode<WASTextToConsole_input> {
        ASCII: Slot<'ASCII', 0>
    }
    export type WASTextToConsole_input = {
        /** */
        text: _ASCII
        /** default="Text Output" */
        label?: _STRING
    }

    // |=============================================================================|
    // | WASTextToNumber ("Text to Number" in ComfyUI) [WAS Suite_Text_Operations]   |
    // |=============================================================================|
    export interface WASTextToNumber extends HasSingle_NUMBER, ComfyNode<WASTextToNumber_input> {
        NUMBER: Slot<'NUMBER', 0>
    }
    export type WASTextToNumber_input = {
        /** */
        text: _ASCII
    }

    // |=============================================================================|
    // | WASTextToString ("Text to String" in ComfyUI) [WAS Suite_Text_Operations]   |
    // |=============================================================================|
    export interface WASTextToString extends HasSingle_STRING, ComfyNode<WASTextToString_input> {
        STRING: Slot<'STRING', 0>
    }
    export type WASTextToString_input = {
        /** */
        text: _ASCII
    }

    // |=============================================================================|
    // | WASTrueRandomOrgNumberGenerator ("True Random.org Number Generator" in ComfyUI) [WAS Suite_Number]   |
    // |=============================================================================|
    export interface WASTrueRandomOrgNumberGenerator extends HasSingle_NUMBER, ComfyNode<WASTrueRandomOrgNumberGenerator_input> {
        NUMBER: Slot<'NUMBER', 0>
    }
    export type WASTrueRandomOrgNumberGenerator_input = {
        /** default="00000000-0000-0000-0000-000000000000" */
        api_key?: _STRING
        /** default=0 min=18446744073709552000 max=18446744073709552000 */
        minimum?: _FLOAT
        /** default=10000000 min=18446744073709552000 max=18446744073709552000 */
        maximum?: _FLOAT
    }

    // |=============================================================================|
    // | WASUnCLIPCheckpointLoader ("unCLIP Checkpoint Loader" in ComfyUI) [WAS Suite_Loaders]   |
    // |=============================================================================|
    export interface WASUnCLIPCheckpointLoader
        extends HasSingle_MODEL,
            HasSingle_CLIP,
            HasSingle_VAE,
            HasSingle_CLIP_VISION,
            HasSingle_STRING,
            ComfyNode<WASUnCLIPCheckpointLoader_input> {
        MODEL: Slot<'MODEL', 0>
        CLIP: Slot<'CLIP', 1>
        VAE: Slot<'VAE', 2>
        CLIP_VISION: Slot<'CLIP_VISION', 3>
        STRING: Slot<'STRING', 4>
    }
    export type WASUnCLIPCheckpointLoader_input = {
        ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
    }

    // |=============================================================================|
    // | WASUpscaleModelLoader ("Upscale Model Loader" in ComfyUI) [WAS Suite_Loaders]   |
    // |=============================================================================|
    export interface WASUpscaleModelLoader
        extends HasSingle_UPSCALE_MODEL,
            HasSingle_ASCII,
            ComfyNode<WASUpscaleModelLoader_input> {
        UPSCALE_MODEL: Slot<'UPSCALE_MODEL', 0>
        ASCII: Slot<'ASCII', 1>
    }
    export type WASUpscaleModelLoader_input = {
        model_name: Enum_UpscaleModelLoader_model_name
    }

    // |=============================================================================|
    // | WASUpscaleModelSwitch ("Upscale Model Switch" in ComfyUI) [WAS Suite_Logic]   |
    // |=============================================================================|
    export interface WASUpscaleModelSwitch extends HasSingle_UPSCALE_MODEL, ComfyNode<WASUpscaleModelSwitch_input> {
        UPSCALE_MODEL: Slot<'UPSCALE_MODEL', 0>
    }
    export type WASUpscaleModelSwitch_input = {
        upscale_model_a: _UPSCALE_MODEL
        upscale_model_b: _UPSCALE_MODEL
        boolean_number: _NUMBER
    }

    // |=============================================================================|
    // | WASWriteToGIF ("Write to GIF" in ComfyUI) [WAS Suite_Animation_Writer]      |
    // |=============================================================================|
    export interface WASWriteToGIF extends HasSingle_IMAGE, ComfyNode<WASWriteToGIF_input> {
        IMAGE: Slot<'IMAGE', 0>
        ASCII: Slot<'ASCII', 1>
        ASCII_1: Slot<'ASCII', 2>
    }
    export type WASWriteToGIF_input = {
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

    // |=============================================================================|
    // | WASWriteToVideo ("Write to Video" in ComfyUI) [WAS Suite_Animation_Writer]   |
    // |=============================================================================|
    export interface WASWriteToVideo extends HasSingle_IMAGE, ComfyNode<WASWriteToVideo_input> {
        IMAGE: Slot<'IMAGE', 0>
        ASCII: Slot<'ASCII', 1>
        ASCII_1: Slot<'ASCII', 2>
    }
    export type WASWriteToVideo_input = {
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
        codec: Enum_WASCreateVideoFromPath_codec
    }

    // |=============================================================================|
    // | WASVAEInputSwitch ("VAE Input Switch" in ComfyUI) [WAS Suite_Logic]         |
    // |=============================================================================|
    export interface WASVAEInputSwitch extends HasSingle_VAE, ComfyNode<WASVAEInputSwitch_input> {
        VAE: Slot<'VAE', 0>
    }
    export type WASVAEInputSwitch_input = {
        vae_a: _VAE
        vae_b: _VAE
        boolean_number: _NUMBER
    }

    // |=============================================================================|
    // | WASVideoDumpFrames ("Video Dump Frames" in ComfyUI) [WAS Suite_Animation]   |
    // |=============================================================================|
    export interface WASVideoDumpFrames extends HasSingle_ASCII, HasSingle_NUMBER, ComfyNode<WASVideoDumpFrames_input> {
        ASCII: Slot<'ASCII', 0>
        NUMBER: Slot<'NUMBER', 1>
    }
    export type WASVideoDumpFrames_input = {
        /** default="./ComfyUI/input/MyVideo.mp4" */
        video_path?: _STRING
        /** default="./ComfyUI/input/MyVideo" */
        output_path?: _STRING
        /** default="frame_" */
        prefix?: _STRING
        /** default=4 min=8 max=8 step=1 */
        filenumber_digits?: _INT
        extension: Enum_WASVideoDumpFrames_extension
    }

    // |=============================================================================|
    // | YKImagePadForOutpaint [image]                                               |
    // |=============================================================================|
    export interface YKImagePadForOutpaint extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<YKImagePadForOutpaint_input> {
        IMAGE: Slot<'IMAGE', 0>
        MASK: Slot<'MASK', 1>
    }
    export type YKImagePadForOutpaint_input = {
        image: _IMAGE
        /** default=0 min=4096 max=4096 step=64 */
        left?: _INT
        /** default=0 min=4096 max=4096 step=64 */
        top?: _INT
        /** default=0 min=4096 max=4096 step=64 */
        right?: _INT
        /** default=0 min=4096 max=4096 step=64 */
        bottom?: _INT
        /** default=0 min=4096 max=4096 step=1 */
        feathering?: _INT
    }

    // |=============================================================================|
    // | YKMaskToImage [mask]                                                        |
    // |=============================================================================|
    export interface YKMaskToImage extends HasSingle_IMAGE, ComfyNode<YKMaskToImage_input> {
        IMAGE: Slot<'IMAGE', 0>
    }
    export type YKMaskToImage_input = {
        mask: _MASK
    }

    // INDEX -------------------------------
    export type Schemas = {
        KSampler: ComfyNodeSchemaJSON
        CheckpointLoaderSimple: ComfyNodeSchemaJSON
        CLIPTextEncode: ComfyNodeSchemaJSON
        CLIPSetLastLayer: ComfyNodeSchemaJSON
        VAEDecode: ComfyNodeSchemaJSON
        VAEEncode: ComfyNodeSchemaJSON
        VAEEncodeForInpaint: ComfyNodeSchemaJSON
        VAELoader: ComfyNodeSchemaJSON
        EmptyLatentImage: ComfyNodeSchemaJSON
        LatentUpscale: ComfyNodeSchemaJSON
        LatentUpscaleBy: ComfyNodeSchemaJSON
        LatentFromBatch: ComfyNodeSchemaJSON
        RepeatLatentBatch: ComfyNodeSchemaJSON
        SaveImage: ComfyNodeSchemaJSON
        PreviewImage: ComfyNodeSchemaJSON
        LoadImage: ComfyNodeSchemaJSON
        LoadImageMask: ComfyNodeSchemaJSON
        ImagePadForOutpaint: ComfyNodeSchemaJSON
        ConditioningAverage: ComfyNodeSchemaJSON
        ConditioningCombine: ComfyNodeSchemaJSON
        ConditioningSetArea: ComfyNodeSchemaJSON
        ConditioningSetMask: ComfyNodeSchemaJSON
        KSamplerAdvanced: ComfyNodeSchemaJSON
        SetLatentNoiseMask: ComfyNodeSchemaJSON
        LatentComposite: ComfyNodeSchemaJSON
        LatentRotate: ComfyNodeSchemaJSON
        LatentFlip: ComfyNodeSchemaJSON
        LatentCrop: ComfyNodeSchemaJSON
        LoraLoader: ComfyNodeSchemaJSON
        CLIPLoader: ComfyNodeSchemaJSON
        DualCLIPLoader: ComfyNodeSchemaJSON
        CLIPVisionEncode: ComfyNodeSchemaJSON
        StyleModelApply: ComfyNodeSchemaJSON
        UnCLIPConditioning: ComfyNodeSchemaJSON
        ControlNetApply: ComfyNodeSchemaJSON
        ControlNetLoader: ComfyNodeSchemaJSON
        DiffControlNetLoader: ComfyNodeSchemaJSON
        StyleModelLoader: ComfyNodeSchemaJSON
        CLIPVisionLoader: ComfyNodeSchemaJSON
        VAEDecodeTiled: ComfyNodeSchemaJSON
        VAEEncodeTiled: ComfyNodeSchemaJSON
        UnCLIPCheckpointLoader: ComfyNodeSchemaJSON
        GLIGENLoader: ComfyNodeSchemaJSON
        GLIGENTextBoxApply: ComfyNodeSchemaJSON
        CheckpointLoader: ComfyNodeSchemaJSON
        DiffusersLoader: ComfyNodeSchemaJSON
        HypernetworkLoader: ComfyNodeSchemaJSON
        UpscaleModelLoader: ComfyNodeSchemaJSON
        ImageUpscaleWithModel: ComfyNodeSchemaJSON
        LatentCompositeMasked: ComfyNodeSchemaJSON
        MaskToImage: ComfyNodeSchemaJSON
        ImageToMask: ComfyNodeSchemaJSON
        SolidMask: ComfyNodeSchemaJSON
        InvertMask: ComfyNodeSchemaJSON
        CropMask: ComfyNodeSchemaJSON
        MaskComposite: ComfyNodeSchemaJSON
        FeatherMask: ComfyNodeSchemaJSON
        RebatchLatents: ComfyNodeSchemaJSON
        BrightnessContrast: ComfyNodeSchemaJSON
        CLIPSeg: ComfyNodeSchemaJSON
        CombineSegMasks: ComfyNodeSchemaJSON
        AlphaChanelAdd: ComfyNodeSchemaJSON
        AlphaChanelAddByMask: ComfyNodeSchemaJSON
        AlphaChanelAsMask: ComfyNodeSchemaJSON
        AlphaChanelRestore: ComfyNodeSchemaJSON
        AlphaChanelRemove: ComfyNodeSchemaJSON
        ClipClamp: ComfyNodeSchemaJSON
        ClipVisionClamp: ComfyNodeSchemaJSON
        ClipVisionOutputClamp: ComfyNodeSchemaJSON
        ConditioningClamp: ComfyNodeSchemaJSON
        ControlNetClamp: ComfyNodeSchemaJSON
        GligenClamp: ComfyNodeSchemaJSON
        ImageClamp: ComfyNodeSchemaJSON
        LatentClamp: ComfyNodeSchemaJSON
        MaskClamp: ComfyNodeSchemaJSON
        ModelClamp: ComfyNodeSchemaJSON
        StyleModelClamp: ComfyNodeSchemaJSON
        UpscaleModelClamp: ComfyNodeSchemaJSON
        VaeClamp: ComfyNodeSchemaJSON
        ImageBatchGet: ComfyNodeSchemaJSON
        ImageBatchRemove: ComfyNodeSchemaJSON
        ImageBatchFork: ComfyNodeSchemaJSON
        ImageBatchJoin: ComfyNodeSchemaJSON
        ImageCompositeAbsolute: ComfyNodeSchemaJSON
        ImageCompositeAbsoluteByContainer: ComfyNodeSchemaJSON
        ImageCompositeRelative: ComfyNodeSchemaJSON
        ImageCompositeRelativeByContainer: ComfyNodeSchemaJSON
        ImageContainer: ComfyNodeSchemaJSON
        ImageContainerInheritanceAdd: ComfyNodeSchemaJSON
        ImageContainerInheritanceScale: ComfyNodeSchemaJSON
        ImageContainerInheritanceMax: ComfyNodeSchemaJSON
        ImageContainerInheritanceSum: ComfyNodeSchemaJSON
        ImageDrawArc: ComfyNodeSchemaJSON
        ImageDrawArcByContainer: ComfyNodeSchemaJSON
        ImageDrawChord: ComfyNodeSchemaJSON
        ImageDrawChordByContainer: ComfyNodeSchemaJSON
        ImageDrawEllipse: ComfyNodeSchemaJSON
        ImageDrawEllipseByContainer: ComfyNodeSchemaJSON
        ImageDrawLine: ComfyNodeSchemaJSON
        ImageDrawLineByContainer: ComfyNodeSchemaJSON
        ImageDrawPieslice: ComfyNodeSchemaJSON
        ImageDrawPiesliceByContainer: ComfyNodeSchemaJSON
        ImageDrawRectangle: ComfyNodeSchemaJSON
        ImageDrawRectangleByContainer: ComfyNodeSchemaJSON
        ImageDrawRectangleRounded: ComfyNodeSchemaJSON
        ImageDrawRectangleRoundedByContainer: ComfyNodeSchemaJSON
        ImageDrawPolygon: ComfyNodeSchemaJSON
        ImageEffectsAdjustment: ComfyNodeSchemaJSON
        ImageEffectsGrayscale: ComfyNodeSchemaJSON
        ImageEffectsNegative: ComfyNodeSchemaJSON
        ImageEffectsSepia: ComfyNodeSchemaJSON
        ImageEffectsLensZoomBurst: ComfyNodeSchemaJSON
        ImageEffectsLensChromaticAberration: ComfyNodeSchemaJSON
        ImageEffectsLensBokeh: ComfyNodeSchemaJSON
        ImageEffectsLensOpticAxis: ComfyNodeSchemaJSON
        ImageEffectsLensVignette: ComfyNodeSchemaJSON
        ImageFilterSmooth: ComfyNodeSchemaJSON
        ImageFilterSmoothMore: ComfyNodeSchemaJSON
        ImageFilterBlur: ComfyNodeSchemaJSON
        ImageFilterBoxBlur: ComfyNodeSchemaJSON
        ImageFilterGaussianBlur: ComfyNodeSchemaJSON
        ImageFilterGaussianBlurAdvanced: ComfyNodeSchemaJSON
        ImageFilterStackBlur: ComfyNodeSchemaJSON
        ImageFilterMedianBlur: ComfyNodeSchemaJSON
        ImageFilterBilateralBlur: ComfyNodeSchemaJSON
        ImageFilterContour: ComfyNodeSchemaJSON
        ImageFilterDetail: ComfyNodeSchemaJSON
        ImageFilterEdgeEnhance: ComfyNodeSchemaJSON
        ImageFilterEdgeEnhanceMore: ComfyNodeSchemaJSON
        ImageFilterEmboss: ComfyNodeSchemaJSON
        ImageFilterFindEdges: ComfyNodeSchemaJSON
        ImageFilterSharpen: ComfyNodeSchemaJSON
        ImageFilterRank: ComfyNodeSchemaJSON
        ImageFilterMin: ComfyNodeSchemaJSON
        ImageFilterMax: ComfyNodeSchemaJSON
        ImageFilterMode: ComfyNodeSchemaJSON
        ImageSegmentation: ComfyNodeSchemaJSON
        ImageSegmentationCustom: ComfyNodeSchemaJSON
        ImageSegmentationCustomAdvanced: ComfyNodeSchemaJSON
        ImageText: ComfyNodeSchemaJSON
        ImageTextOutlined: ComfyNodeSchemaJSON
        ImageTextMultiline: ComfyNodeSchemaJSON
        ImageTextMultilineOutlined: ComfyNodeSchemaJSON
        ImageTransformResizeAbsolute: ComfyNodeSchemaJSON
        ImageTransformResizeRelative: ComfyNodeSchemaJSON
        ImageTransformCropAbsolute: ComfyNodeSchemaJSON
        ImageTransformCropRelative: ComfyNodeSchemaJSON
        ImageTransformCropCorners: ComfyNodeSchemaJSON
        ImageTransformPaddingAbsolute: ComfyNodeSchemaJSON
        ImageTransformPaddingRelative: ComfyNodeSchemaJSON
        ImageTransformRotate: ComfyNodeSchemaJSON
        ImageTransformTranspose: ComfyNodeSchemaJSON
        ImpactSAMLoader: ComfyNodeSchemaJSON
        ImpactMMDetDetectorProvider: ComfyNodeSchemaJSON
        ImpactCLIPSegDetectorProvider: ComfyNodeSchemaJSON
        ImpactONNXDetectorProvider: ComfyNodeSchemaJSON
        ImpactBitwiseAndMaskForEach: ComfyNodeSchemaJSON
        ImpactSubtractMaskForEach: ComfyNodeSchemaJSON
        ImpactDetailerForEach: ComfyNodeSchemaJSON
        ImpactDetailerForEachDebug: ComfyNodeSchemaJSON
        ImpactDetailerForEachPipe: ComfyNodeSchemaJSON
        ImpactDetailerForEachDebugPipe: ComfyNodeSchemaJSON
        ImpactSAMDetectorCombined: ComfyNodeSchemaJSON
        ImpactFaceDetailer: ComfyNodeSchemaJSON
        ImpactFaceDetailerPipe: ComfyNodeSchemaJSON
        ImpactToDetailerPipe: ComfyNodeSchemaJSON
        ImpactFromDetailerPipe: ComfyNodeSchemaJSON
        ImpactToBasicPipe: ComfyNodeSchemaJSON
        ImpactFromBasicPipe: ComfyNodeSchemaJSON
        ImpactBasicPipeToDetailerPipe: ComfyNodeSchemaJSON
        ImpactDetailerPipeToBasicPipe: ComfyNodeSchemaJSON
        ImpactEditBasicPipe: ComfyNodeSchemaJSON
        ImpactEditDetailerPipe: ComfyNodeSchemaJSON
        ImpactLatentPixelScale: ComfyNodeSchemaJSON
        ImpactPixelKSampleUpscalerProvider: ComfyNodeSchemaJSON
        ImpactPixelKSampleUpscalerProviderPipe: ComfyNodeSchemaJSON
        ImpactIterativeLatentUpscale: ComfyNodeSchemaJSON
        ImpactIterativeImageUpscale: ComfyNodeSchemaJSON
        ImpactPixelTiledKSampleUpscalerProvider: ComfyNodeSchemaJSON
        ImpactPixelTiledKSampleUpscalerProviderPipe: ComfyNodeSchemaJSON
        ImpactTwoSamplersForMaskUpscalerProvider: ComfyNodeSchemaJSON
        ImpactTwoSamplersForMaskUpscalerProviderPipe: ComfyNodeSchemaJSON
        ImpactPixelKSampleHookCombine: ComfyNodeSchemaJSON
        ImpactDenoiseScheduleHookProvider: ComfyNodeSchemaJSON
        ImpactCfgScheduleHookProvider: ComfyNodeSchemaJSON
        ImpactBitwiseAndMask: ComfyNodeSchemaJSON
        ImpactSubtractMask: ComfyNodeSchemaJSON
        ImpactSegsMask: ComfyNodeSchemaJSON
        ImpactEmptySegs: ComfyNodeSchemaJSON
        ImpactMaskToSEGS: ComfyNodeSchemaJSON
        ImpactToBinaryMask: ComfyNodeSchemaJSON
        ImpactBboxDetectorSEGS: ComfyNodeSchemaJSON
        ImpactSegmDetectorSEGS: ComfyNodeSchemaJSON
        ImpactONNXDetectorSEGS: ComfyNodeSchemaJSON
        ImpactBboxDetectorCombined_v2: ComfyNodeSchemaJSON
        ImpactSegmDetectorCombined_v2: ComfyNodeSchemaJSON
        ImpactSegsToCombinedMask: ComfyNodeSchemaJSON
        ImpactKSamplerProvider: ComfyNodeSchemaJSON
        ImpactTwoSamplersForMask: ComfyNodeSchemaJSON
        ImpactTiledKSamplerProvider: ComfyNodeSchemaJSON
        ImpactPreviewBridge: ComfyNodeSchemaJSON
        ImpactImageSender: ComfyNodeSchemaJSON
        ImpactImageReceiver: ComfyNodeSchemaJSON
        ImpactImageMaskSwitch: ComfyNodeSchemaJSON
        ImpactLatentSwitch: ComfyNodeSchemaJSON
        ImpactSEGSSwitch: ComfyNodeSchemaJSON
        ImpactImpactWildcardProcessor: ComfyNodeSchemaJSON
        ImpactImpactLogger: ComfyNodeSchemaJSON
        ImpactSEGSDetailer: ComfyNodeSchemaJSON
        ImpactSEGSPaste: ComfyNodeSchemaJSON
        ImpactSEGSPreview: ComfyNodeSchemaJSON
        ImpactMaskPainter: ComfyNodeSchemaJSON
        ImpactMMDetLoader: ComfyNodeSchemaJSON
        ImpactSegsMaskCombine: ComfyNodeSchemaJSON
        ImpactBboxDetectorForEach: ComfyNodeSchemaJSON
        ImpactSegmDetectorForEach: ComfyNodeSchemaJSON
        ImpactBboxDetectorCombined: ComfyNodeSchemaJSON
        ImpactSegmDetectorCombined: ComfyNodeSchemaJSON
        Save_as_webp: ComfyNodeSchemaJSON
        BNK_CutoffBasePrompt: ComfyNodeSchemaJSON
        BNK_CutoffSetRegions: ComfyNodeSchemaJSON
        BNK_CutoffRegionsToConditioning: ComfyNodeSchemaJSON
        BNK_CutoffRegionsToConditioning_ADV: ComfyNodeSchemaJSON
        MultiLatentComposite: ComfyNodeSchemaJSON
        MultiAreaConditioning: ComfyNodeSchemaJSON
        ConditioningUpscale: ComfyNodeSchemaJSON
        ConditioningStretch: ComfyNodeSchemaJSON
        BNK_NoisyLatentImage: ComfyNodeSchemaJSON
        BNK_DuplicateBatchIndex: ComfyNodeSchemaJSON
        BNK_SlerpLatent: ComfyNodeSchemaJSON
        BNK_GetSigma: ComfyNodeSchemaJSON
        BNK_InjectNoise: ComfyNodeSchemaJSON
        BNK_Unsampler: ComfyNodeSchemaJSON
        BNK_TiledKSamplerAdvanced: ComfyNodeSchemaJSON
        BNK_TiledKSampler: ComfyNodeSchemaJSON
        ClipSeg: ComfyNodeSchemaJSON
        HEDPreprocessor: ComfyNodeSchemaJSON
        ScribblePreprocessor: ComfyNodeSchemaJSON
        FakeScribblePreprocessor: ComfyNodeSchemaJSON
        BinaryPreprocessor: ComfyNodeSchemaJSON
        PiDiNetPreprocessor: ComfyNodeSchemaJSON
        LineArtPreprocessor: ComfyNodeSchemaJSON
        AnimeLineArtPreprocessor: ComfyNodeSchemaJSON
        Manga2AnimeLineArtPreprocessor: ComfyNodeSchemaJSON
        MiDaSNormalMapPreprocessor: ComfyNodeSchemaJSON
        ZoeDepthMapPreprocessor: ComfyNodeSchemaJSON
        BAENormalMapPreprocessor: ComfyNodeSchemaJSON
        OpenposePreprocessor: ComfyNodeSchemaJSON
        MediaPipeHandPosePreprocessor: ComfyNodeSchemaJSON
        OneFormerCOCOSemSegPreprocessor: ComfyNodeSchemaJSON
        OneFormerADE20KSemSegPreprocessor: ComfyNodeSchemaJSON
        MediaPipeFaceMeshPreprocessor: ComfyNodeSchemaJSON
        ColorPreprocessor: ComfyNodeSchemaJSON
        TilePreprocessor: ComfyNodeSchemaJSON
        InpaintPreprocessor: ComfyNodeSchemaJSON
        CLIPRegionsBasePrompt: ComfyNodeSchemaJSON
        CLIPSetRegion: ComfyNodeSchemaJSON
        CLIPRegionsToConditioning: ComfyNodeSchemaJSON
        KSamplerEfficient: ComfyNodeSchemaJSON
        EfficientLoader: ComfyNodeSchemaJSON
        XYPlot: ComfyNodeSchemaJSON
        XYInputSeedsBatch: ComfyNodeSchemaJSON
        XYInputSteps: ComfyNodeSchemaJSON
        XYInputCFGScale: ComfyNodeSchemaJSON
        XYInputSampler: ComfyNodeSchemaJSON
        XYInputScheduler: ComfyNodeSchemaJSON
        XYInputDenoise: ComfyNodeSchemaJSON
        XYInputVAE: ComfyNodeSchemaJSON
        XYInputPositivePromptSR: ComfyNodeSchemaJSON
        XYInputNegativePromptSR: ComfyNodeSchemaJSON
        XYInputCheckpoint: ComfyNodeSchemaJSON
        XYInputClipSkip: ComfyNodeSchemaJSON
        XYInputLoRA: ComfyNodeSchemaJSON
        XYInputLoRAAdvanced: ComfyNodeSchemaJSON
        XYInputManualXYEntry: ComfyNodeSchemaJSON
        ManualXYEntryInfo: ComfyNodeSchemaJSON
        JoinXYInputsOfSameType: ComfyNodeSchemaJSON
        ImageOverlay: ComfyNodeSchemaJSON
        EvaluateIntegers: ComfyNodeSchemaJSON
        EvaluateFloats: ComfyNodeSchemaJSON
        EvaluateStrings: ComfyNodeSchemaJSON
        SimpleEvalExamples: ComfyNodeSchemaJSON
        GaussianBlur: ComfyNodeSchemaJSON
        HistogramEqualization: ComfyNodeSchemaJSON
        WASImageFlip: ComfyNodeSchemaJSON
        LatentUpscaleMultiply: ComfyNodeSchemaJSON
        MasqueradeMaskByText: ComfyNodeSchemaJSON
        MasqueradeMaskMorphology: ComfyNodeSchemaJSON
        MasqueradeCombineMasks: ComfyNodeSchemaJSON
        MasqueradeUnaryMaskOp: ComfyNodeSchemaJSON
        MasqueradeBlur: ComfyNodeSchemaJSON
        MasqueradeImageToMask: ComfyNodeSchemaJSON
        MasqueradeMixImagesByMask: ComfyNodeSchemaJSON
        MasqueradeMixColorByMask: ComfyNodeSchemaJSON
        MasqueradeMaskToRegion: ComfyNodeSchemaJSON
        MasqueradeCutByMask: ComfyNodeSchemaJSON
        MasqueradePasteByMask: ComfyNodeSchemaJSON
        MasqueradeGetImageSize: ComfyNodeSchemaJSON
        MasqueradeChangeChannelCount: ComfyNodeSchemaJSON
        MasqueradeConstantMask: ComfyNodeSchemaJSON
        MasqueradePruneByMask: ComfyNodeSchemaJSON
        MasqueradeSeparateMaskComponents: ComfyNodeSchemaJSON
        MasqueradeCreateRectMask: ComfyNodeSchemaJSON
        MasqueradeMakeImageBatch: ComfyNodeSchemaJSON
        PseudoHDRStyle: ComfyNodeSchemaJSON
        Saturation: ComfyNodeSchemaJSON
        ImageSharpening: ComfyNodeSchemaJSON
        WASBLIPModelLoader: ComfyNodeSchemaJSON
        WASCacheNode: ComfyNodeSchemaJSON
        WASCheckpointLoader: ComfyNodeSchemaJSON
        WASCheckpointLoaderSimple: ComfyNodeSchemaJSON
        WASCLIPTextEncodeNSP: ComfyNodeSchemaJSON
        WASCLIPInputSwitch: ComfyNodeSchemaJSON
        WASCLIPVisionInputSwitch: ComfyNodeSchemaJSON
        WASConditioningInputSwitch: ComfyNodeSchemaJSON
        WASConstantNumber: ComfyNodeSchemaJSON
        WASCreateGridImage: ComfyNodeSchemaJSON
        WASCreateMorphImage: ComfyNodeSchemaJSON
        WASCreateMorphImageFromPath: ComfyNodeSchemaJSON
        WASCreateVideoFromPath: ComfyNodeSchemaJSON
        WASCLIPSegMasking: ComfyNodeSchemaJSON
        WASCLIPSegModelLoader: ComfyNodeSchemaJSON
        WASCLIPSegBatchMasking: ComfyNodeSchemaJSON
        WASConvertMasksToImages: ComfyNodeSchemaJSON
        WASControlNetModelInputSwitch: ComfyNodeSchemaJSON
        WASDebugNumberToConsole: ComfyNodeSchemaJSON
        WASDictionaryToConsole: ComfyNodeSchemaJSON
        WASDiffusersModelLoader: ComfyNodeSchemaJSON
        WASDiffusersHubModelDownLoader: ComfyNodeSchemaJSON
        WASExportAPI: ComfyNodeSchemaJSON
        WASLatentInputSwitch: ComfyNodeSchemaJSON
        WASLoadCache: ComfyNodeSchemaJSON
        WASLogicBoolean: ComfyNodeSchemaJSON
        WASLoraLoader: ComfyNodeSchemaJSON
        WASImageSSAOAmbientOcclusion: ComfyNodeSchemaJSON
        WASImageSSDODirectOcclusion: ComfyNodeSchemaJSON
        WASImageAnalyze: ComfyNodeSchemaJSON
        WASImageBatch: ComfyNodeSchemaJSON
        WASImageBlank: ComfyNodeSchemaJSON
        WASImageBlendByMask: ComfyNodeSchemaJSON
        WASImageBlend: ComfyNodeSchemaJSON
        WASImageBlendingMode: ComfyNodeSchemaJSON
        WASImageBloomFilter: ComfyNodeSchemaJSON
        WASImageCannyFilter: ComfyNodeSchemaJSON
        WASImageChromaticAberration: ComfyNodeSchemaJSON
        WASImageColorPalette: ComfyNodeSchemaJSON
        WASImageCropFace: ComfyNodeSchemaJSON
        WASImageCropLocation: ComfyNodeSchemaJSON
        WASImageCropSquareLocation: ComfyNodeSchemaJSON
        WASImageDisplacementWarp: ComfyNodeSchemaJSON
        WASImagePasteFace: ComfyNodeSchemaJSON
        WASImagePasteCrop: ComfyNodeSchemaJSON
        WASImagePasteCropByLocation: ComfyNodeSchemaJSON
        WASImagePixelate: ComfyNodeSchemaJSON
        WASImagePowerNoise: ComfyNodeSchemaJSON
        WASImageDraganPhotographyFilter: ComfyNodeSchemaJSON
        WASImageEdgeDetectionFilter: ComfyNodeSchemaJSON
        WASImageFilmGrain: ComfyNodeSchemaJSON
        WASImageFilterAdjustments: ComfyNodeSchemaJSON
        WASImageGradientMap: ComfyNodeSchemaJSON
        WASImageGenerateGradient: ComfyNodeSchemaJSON
        WASImageHighPassFilter: ComfyNodeSchemaJSON
        WASImageHistoryLoader: ComfyNodeSchemaJSON
        WASImageInputSwitch: ComfyNodeSchemaJSON
        WASImageLevelsAdjustment: ComfyNodeSchemaJSON
        WASImageLoad: ComfyNodeSchemaJSON
        WASImageMedianFilter: ComfyNodeSchemaJSON
        WASImageMixRGBChannels: ComfyNodeSchemaJSON
        WASImageMonitorEffectsFilter: ComfyNodeSchemaJSON
        WASImageNovaFilter: ComfyNodeSchemaJSON
        WASImagePadding: ComfyNodeSchemaJSON
        WASImagePerlinNoise: ComfyNodeSchemaJSON
        WASImageRembgRemoveBackground: ComfyNodeSchemaJSON
        WASImagePerlinPowerFractal: ComfyNodeSchemaJSON
        WASImageRemoveBackgroundAlpha: ComfyNodeSchemaJSON
        WASImageRemoveColor: ComfyNodeSchemaJSON
        WASImageResize: ComfyNodeSchemaJSON
        WASImageRotate: ComfyNodeSchemaJSON
        WASImageRotateHue: ComfyNodeSchemaJSON
        WASImageSave: ComfyNodeSchemaJSON
        WASImageSeamlessTexture: ComfyNodeSchemaJSON
        WASImageSelectChannel: ComfyNodeSchemaJSON
        WASImageSelectColor: ComfyNodeSchemaJSON
        WASImageShadowsAndHighlights: ComfyNodeSchemaJSON
        WASImageSizeToNumber: ComfyNodeSchemaJSON
        WASImageStitch: ComfyNodeSchemaJSON
        WASImageStyleFilter: ComfyNodeSchemaJSON
        WASImageThreshold: ComfyNodeSchemaJSON
        WASImageTiled: ComfyNodeSchemaJSON
        WASImageTranspose: ComfyNodeSchemaJSON
        WASImageFDOFFilter: ComfyNodeSchemaJSON
        WASImageToLatentMask: ComfyNodeSchemaJSON
        WASImageToNoise: ComfyNodeSchemaJSON
        WASImageToSeed: ComfyNodeSchemaJSON
        WASImageVoronoiNoiseFilter: ComfyNodeSchemaJSON
        WASKSamplerWAS: ComfyNodeSchemaJSON
        WASKSamplerCycle: ComfyNodeSchemaJSON
        WASLatentNoiseInjection: ComfyNodeSchemaJSON
        WASLatentSizeToNumber: ComfyNodeSchemaJSON
        WASLatentUpscaleByFactorWAS: ComfyNodeSchemaJSON
        WASLoadImageBatch: ComfyNodeSchemaJSON
        WASLoadTextFile: ComfyNodeSchemaJSON
        WASLoadLora: ComfyNodeSchemaJSON
        WASMasksAdd: ComfyNodeSchemaJSON
        WASMasksSubtract: ComfyNodeSchemaJSON
        WASMaskArbitraryRegion: ComfyNodeSchemaJSON
        WASMaskBatchToMask: ComfyNodeSchemaJSON
        WASMaskCeilingRegion: ComfyNodeSchemaJSON
        WASMaskCropDominantRegion: ComfyNodeSchemaJSON
        WASMaskCropMinorityRegion: ComfyNodeSchemaJSON
        WASMaskCropRegion: ComfyNodeSchemaJSON
        WASMaskPasteRegion: ComfyNodeSchemaJSON
        WASMaskDilateRegion: ComfyNodeSchemaJSON
        WASMaskDominantRegion: ComfyNodeSchemaJSON
        WASMaskErodeRegion: ComfyNodeSchemaJSON
        WASMaskFillHoles: ComfyNodeSchemaJSON
        WASMaskFloorRegion: ComfyNodeSchemaJSON
        WASMaskGaussianRegion: ComfyNodeSchemaJSON
        WASMaskInvert: ComfyNodeSchemaJSON
        WASMaskMinorityRegion: ComfyNodeSchemaJSON
        WASMaskSmoothRegion: ComfyNodeSchemaJSON
        WASMaskThresholdRegion: ComfyNodeSchemaJSON
        WASMasksCombineRegions: ComfyNodeSchemaJSON
        WASMasksCombineBatch: ComfyNodeSchemaJSON
        WASMiDaSModelLoader: ComfyNodeSchemaJSON
        WASMiDaSDepthApproximation: ComfyNodeSchemaJSON
        WASMiDaSMaskImage: ComfyNodeSchemaJSON
        WASModelInputSwitch: ComfyNodeSchemaJSON
        WASNumberOperation: ComfyNodeSchemaJSON
        WASNumberToFloat: ComfyNodeSchemaJSON
        WASNumberInputSwitch: ComfyNodeSchemaJSON
        WASNumberInputCondition: ComfyNodeSchemaJSON
        WASNumberMultipleOf: ComfyNodeSchemaJSON
        WASNumberPI: ComfyNodeSchemaJSON
        WASNumberToInt: ComfyNodeSchemaJSON
        WASNumberToSeed: ComfyNodeSchemaJSON
        WASNumberToString: ComfyNodeSchemaJSON
        WASNumberToText: ComfyNodeSchemaJSON
        WASPromptStylesSelector: ComfyNodeSchemaJSON
        WASRandomNumber: ComfyNodeSchemaJSON
        WASSaveTextFile: ComfyNodeSchemaJSON
        WASSeed: ComfyNodeSchemaJSON
        WASTensorBatchToImage: ComfyNodeSchemaJSON
        WASBLIPAnalyzeImage: ComfyNodeSchemaJSON
        WASSAMModelLoader: ComfyNodeSchemaJSON
        WASSAMParameters: ComfyNodeSchemaJSON
        WASSAMParametersCombine: ComfyNodeSchemaJSON
        WASSAMImageMask: ComfyNodeSchemaJSON
        WASSamplesPassthroughStatSystem: ComfyNodeSchemaJSON
        WASStringToText: ComfyNodeSchemaJSON
        WASImageBounds: ComfyNodeSchemaJSON
        WASInsetImageBounds: ComfyNodeSchemaJSON
        WASBoundedImageBlend: ComfyNodeSchemaJSON
        WASBoundedImageBlendWithMask: ComfyNodeSchemaJSON
        WASBoundedImageCrop: ComfyNodeSchemaJSON
        WASBoundedImageCropWithMask: ComfyNodeSchemaJSON
        WASTextDictionaryUpdate: ComfyNodeSchemaJSON
        WASTextAddTokens: ComfyNodeSchemaJSON
        WASTextAddTokenByInput: ComfyNodeSchemaJSON
        WASTextCompare: ComfyNodeSchemaJSON
        WASTextConcatenate: ComfyNodeSchemaJSON
        WASTextFileHistoryLoader: ComfyNodeSchemaJSON
        WASTextFindAndReplaceByDictionary: ComfyNodeSchemaJSON
        WASTextFindAndReplaceInput: ComfyNodeSchemaJSON
        WASTextFindAndReplace: ComfyNodeSchemaJSON
        WASTextInputSwitch: ComfyNodeSchemaJSON
        WASTextList: ComfyNodeSchemaJSON
        WASTextListConcatenate: ComfyNodeSchemaJSON
        WASTextLoadLineFromFile: ComfyNodeSchemaJSON
        WASTextMultiline: ComfyNodeSchemaJSON
        WASTextParseA1111Embeddings: ComfyNodeSchemaJSON
        WASTextParseNoodleSoupPrompts: ComfyNodeSchemaJSON
        WASTextParseTokens: ComfyNodeSchemaJSON
        WASTextRandomLine: ComfyNodeSchemaJSON
        WASTextRandomPrompt: ComfyNodeSchemaJSON
        WASTextString: ComfyNodeSchemaJSON
        WASTextToConditioning: ComfyNodeSchemaJSON
        WASTextToConsole: ComfyNodeSchemaJSON
        WASTextToNumber: ComfyNodeSchemaJSON
        WASTextToString: ComfyNodeSchemaJSON
        WASTrueRandomOrgNumberGenerator: ComfyNodeSchemaJSON
        WASUnCLIPCheckpointLoader: ComfyNodeSchemaJSON
        WASUpscaleModelLoader: ComfyNodeSchemaJSON
        WASUpscaleModelSwitch: ComfyNodeSchemaJSON
        WASWriteToGIF: ComfyNodeSchemaJSON
        WASWriteToVideo: ComfyNodeSchemaJSON
        WASVAEInputSwitch: ComfyNodeSchemaJSON
        WASVideoDumpFrames: ComfyNodeSchemaJSON
        YKImagePadForOutpaint: ComfyNodeSchemaJSON
        YKMaskToImage: ComfyNodeSchemaJSON
    }
    export type ComfyNodeType = keyof Schemas
}
