import type { Slot } from './core-shared/Slot'
import type { ComfyNodeUID } from './core-types/NodeUID'
import type { ComfyNode } from './core-shared/Node'
import type { ComfyNodeSchemaJSON } from './core-types/ComfySchemaJSON'
import type { Graph } from './core-shared/Graph'
import type { Workflow } from './core-shared/Workflow'
import type { FlowRun } from './core-back/FlowRun'
import type { WorkflowType } from './core-shared/WorkflowFn'

// Entrypoint --------------------------
export interface ComfySetup {
    KSampler(args: KSampler_input, uid?: ComfyNodeUID): KSampler
    CheckpointLoaderSimple(args: CheckpointLoaderSimple_input, uid?: ComfyNodeUID): CheckpointLoaderSimple
    CLIPTextEncode(args: CLIPTextEncode_input, uid?: ComfyNodeUID): CLIPTextEncode
    CLIPSetLastLayer(args: CLIPSetLastLayer_input, uid?: ComfyNodeUID): CLIPSetLastLayer
    VAEDecode(args: VAEDecode_input, uid?: ComfyNodeUID): VAEDecode
    VAEEncode(args: VAEEncode_input, uid?: ComfyNodeUID): VAEEncode
    VAEEncodeForInpaint(args: VAEEncodeForInpaint_input, uid?: ComfyNodeUID): VAEEncodeForInpaint
    VAELoader(args: VAELoader_input, uid?: ComfyNodeUID): VAELoader
    EmptyLatentImage(args: EmptyLatentImage_input, uid?: ComfyNodeUID): EmptyLatentImage
    LatentUpscale(args: LatentUpscale_input, uid?: ComfyNodeUID): LatentUpscale
    LatentFromBatch(args: LatentFromBatch_input, uid?: ComfyNodeUID): LatentFromBatch
    SaveImage(args: SaveImage_input, uid?: ComfyNodeUID): SaveImage
    PreviewImage(args: PreviewImage_input, uid?: ComfyNodeUID): PreviewImage
    LoadImage(args: LoadImage_input, uid?: ComfyNodeUID): LoadImage
    LoadImageMask(args: LoadImageMask_input, uid?: ComfyNodeUID): LoadImageMask
    ImageScale(args: ImageScale_input, uid?: ComfyNodeUID): ImageScale
    ImageInvert(args: ImageInvert_input, uid?: ComfyNodeUID): ImageInvert
    ImagePadForOutpaint(args: ImagePadForOutpaint_input, uid?: ComfyNodeUID): ImagePadForOutpaint
    ConditioningCombine(args: ConditioningCombine_input, uid?: ComfyNodeUID): ConditioningCombine
    ConditioningSetArea(args: ConditioningSetArea_input, uid?: ComfyNodeUID): ConditioningSetArea
    ConditioningSetMask(args: ConditioningSetMask_input, uid?: ComfyNodeUID): ConditioningSetMask
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
    UnCLIPConditioning(args: UnCLIPConditioning_input, uid?: ComfyNodeUID): UnCLIPConditioning
    ControlNetApply(args: ControlNetApply_input, uid?: ComfyNodeUID): ControlNetApply
    ControlNetLoader(args: ControlNetLoader_input, uid?: ComfyNodeUID): ControlNetLoader
    DiffControlNetLoader(args: DiffControlNetLoader_input, uid?: ComfyNodeUID): DiffControlNetLoader
    StyleModelLoader(args: StyleModelLoader_input, uid?: ComfyNodeUID): StyleModelLoader
    CLIPVisionLoader(args: CLIPVisionLoader_input, uid?: ComfyNodeUID): CLIPVisionLoader
    VAEDecodeTiled(args: VAEDecodeTiled_input, uid?: ComfyNodeUID): VAEDecodeTiled
    VAEEncodeTiled(args: VAEEncodeTiled_input, uid?: ComfyNodeUID): VAEEncodeTiled
    TomePatchModel(args: TomePatchModel_input, uid?: ComfyNodeUID): TomePatchModel
    UnCLIPCheckpointLoader(args: UnCLIPCheckpointLoader_input, uid?: ComfyNodeUID): UnCLIPCheckpointLoader
    GLIGENLoader(args: GLIGENLoader_input, uid?: ComfyNodeUID): GLIGENLoader
    GLIGENTextBoxApply(args: GLIGENTextBoxApply_input, uid?: ComfyNodeUID): GLIGENTextBoxApply
    CheckpointLoader(args: CheckpointLoader_input, uid?: ComfyNodeUID): CheckpointLoader
    DiffusersLoader(args: DiffusersLoader_input, uid?: ComfyNodeUID): DiffusersLoader
    BrightnessContrast(args: BrightnessContrast_input, uid?: ComfyNodeUID): BrightnessContrast
    ImpactMMDetLoader(args: ImpactMMDetLoader_input, uid?: ComfyNodeUID): ImpactMMDetLoader
    ImpactSAMLoader(args: ImpactSAMLoader_input, uid?: ComfyNodeUID): ImpactSAMLoader
    ImpactONNXLoader(args: ImpactONNXLoader_input, uid?: ComfyNodeUID): ImpactONNXLoader
    ImpactBboxDetectorForEach(args: ImpactBboxDetectorForEach_input, uid?: ComfyNodeUID): ImpactBboxDetectorForEach
    ImpactSegmDetectorForEach(args: ImpactSegmDetectorForEach_input, uid?: ComfyNodeUID): ImpactSegmDetectorForEach
    ImpactONNXDetectorForEach(args: ImpactONNXDetectorForEach_input, uid?: ComfyNodeUID): ImpactONNXDetectorForEach
    ImpactBitwiseAndMaskForEach(args: ImpactBitwiseAndMaskForEach_input, uid?: ComfyNodeUID): ImpactBitwiseAndMaskForEach
    ImpactDetailerForEach(args: ImpactDetailerForEach_input, uid?: ComfyNodeUID): ImpactDetailerForEach
    ImpactDetailerForEachDebug(args: ImpactDetailerForEachDebug_input, uid?: ComfyNodeUID): ImpactDetailerForEachDebug
    ImpactBboxDetectorCombined(args: ImpactBboxDetectorCombined_input, uid?: ComfyNodeUID): ImpactBboxDetectorCombined
    ImpactSegmDetectorCombined(args: ImpactSegmDetectorCombined_input, uid?: ComfyNodeUID): ImpactSegmDetectorCombined
    ImpactSAMDetectorCombined(args: ImpactSAMDetectorCombined_input, uid?: ComfyNodeUID): ImpactSAMDetectorCombined
    ImpactFaceDetailer(args: ImpactFaceDetailer_input, uid?: ComfyNodeUID): ImpactFaceDetailer
    ImpactFaceDetailerPipe(args: ImpactFaceDetailerPipe_input, uid?: ComfyNodeUID): ImpactFaceDetailerPipe
    ImpactBitwiseAndMask(args: ImpactBitwiseAndMask_input, uid?: ComfyNodeUID): ImpactBitwiseAndMask
    ImpactSubtractMask(args: ImpactSubtractMask_input, uid?: ComfyNodeUID): ImpactSubtractMask
    ImpactSegsMask(args: ImpactSegsMask_input, uid?: ComfyNodeUID): ImpactSegsMask
    ImpactSegsMaskCombine(args: ImpactSegsMaskCombine_input, uid?: ComfyNodeUID): ImpactSegsMaskCombine
    ImpactEmptySegs(args: ImpactEmptySegs_input, uid?: ComfyNodeUID): ImpactEmptySegs
    ImpactMaskToSEGS(args: ImpactMaskToSEGS_input, uid?: ComfyNodeUID): ImpactMaskToSEGS
    ImpactToBinaryMask(args: ImpactToBinaryMask_input, uid?: ComfyNodeUID): ImpactToBinaryMask
    ImpactMaskPainter(args: ImpactMaskPainter_input, uid?: ComfyNodeUID): ImpactMaskPainter
    RandomLatentImage(args: RandomLatentImage_input, uid?: ComfyNodeUID): RandomLatentImage
    VAEDecodeBatched(args: VAEDecodeBatched_input, uid?: ComfyNodeUID): VAEDecodeBatched
    VAEEncodeBatched(args: VAEEncodeBatched_input, uid?: ComfyNodeUID): VAEEncodeBatched
    LatentToImage(args: LatentToImage_input, uid?: ComfyNodeUID): LatentToImage
    LatentToHist(args: LatentToHist_input, uid?: ComfyNodeUID): LatentToHist
    KSamplerSetting(args: KSamplerSetting_input, uid?: ComfyNodeUID): KSamplerSetting
    KSamplerOverrided(args: KSamplerOverrided_input, uid?: ComfyNodeUID): KSamplerOverrided
    KSamplerXYZ(args: KSamplerXYZ_input, uid?: ComfyNodeUID): KSamplerXYZ
    StateDictLoader(args: StateDictLoader_input, uid?: ComfyNodeUID): StateDictLoader
    Dict2Model(args: Dict2Model_input, uid?: ComfyNodeUID): Dict2Model
    ModelIter(args: ModelIter_input, uid?: ComfyNodeUID): ModelIter
    CLIPIter(args: CLIPIter_input, uid?: ComfyNodeUID): CLIPIter
    VAEIter(args: VAEIter_input, uid?: ComfyNodeUID): VAEIter
    StateDictMerger(args: StateDictMerger_input, uid?: ComfyNodeUID): StateDictMerger
    StateDictMergerBlockWeighted(args: StateDictMergerBlockWeighted_input, uid?: ComfyNodeUID): StateDictMergerBlockWeighted
    StateDictMergerBlockWeightedMulti(
        args: StateDictMergerBlockWeightedMulti_input,
        uid?: ComfyNodeUID,
    ): StateDictMergerBlockWeightedMulti
    ImageBlend2(args: ImageBlend2_input, uid?: ComfyNodeUID): ImageBlend2
    GridImage(args: GridImage_input, uid?: ComfyNodeUID): GridImage
    SaveText(args: SaveText_input, uid?: ComfyNodeUID): SaveText
    BNK_CutoffBasePrompt(args: BNK_CutoffBasePrompt_input, uid?: ComfyNodeUID): BNK_CutoffBasePrompt
    BNK_CutoffSetRegions(args: BNK_CutoffSetRegions_input, uid?: ComfyNodeUID): BNK_CutoffSetRegions
    BNK_CutoffRegionsToConditioning(
        args: BNK_CutoffRegionsToConditioning_input,
        uid?: ComfyNodeUID,
    ): BNK_CutoffRegionsToConditioning
    BNK_CutoffRegionsToConditioning_ADV(
        args: BNK_CutoffRegionsToConditioning_ADV_input,
        uid?: ComfyNodeUID,
    ): BNK_CutoffRegionsToConditioning_ADV
    MultiLatentComposite(args: MultiLatentComposite_input, uid?: ComfyNodeUID): MultiLatentComposite
    MultiAreaConditioning(args: MultiAreaConditioning_input, uid?: ComfyNodeUID): MultiAreaConditioning
    ConditioningUpscale(args: ConditioningUpscale_input, uid?: ComfyNodeUID): ConditioningUpscale
    ConditioningStretch(args: ConditioningStretch_input, uid?: ComfyNodeUID): ConditioningStretch
    ClipSeg(args: ClipSeg_input, uid?: ComfyNodeUID): ClipSeg
    CannyEdgePreprocessor(args: CannyEdgePreprocessor_input, uid?: ComfyNodeUID): CannyEdgePreprocessor
    MLSDPreprocessor(args: MLSDPreprocessor_input, uid?: ComfyNodeUID): MLSDPreprocessor
    HEDPreprocessor(args: HEDPreprocessor_input, uid?: ComfyNodeUID): HEDPreprocessor
    ScribblePreprocessor(args: ScribblePreprocessor_input, uid?: ComfyNodeUID): ScribblePreprocessor
    FakeScribblePreprocessor(args: FakeScribblePreprocessor_input, uid?: ComfyNodeUID): FakeScribblePreprocessor
    BinaryPreprocessor(args: BinaryPreprocessor_input, uid?: ComfyNodeUID): BinaryPreprocessor
    PiDiNetPreprocessor(args: PiDiNetPreprocessor_input, uid?: ComfyNodeUID): PiDiNetPreprocessor
    LineArtPreprocessor(args: LineArtPreprocessor_input, uid?: ComfyNodeUID): LineArtPreprocessor
    AnimeLineArtPreprocessor(args: AnimeLineArtPreprocessor_input, uid?: ComfyNodeUID): AnimeLineArtPreprocessor
    Manga2AnimeLineArtPreprocessor(args: Manga2AnimeLineArtPreprocessor_input, uid?: ComfyNodeUID): Manga2AnimeLineArtPreprocessor
    MiDaSDepthMapPreprocessor(args: MiDaSDepthMapPreprocessor_input, uid?: ComfyNodeUID): MiDaSDepthMapPreprocessor
    MiDaSNormalMapPreprocessor(args: MiDaSNormalMapPreprocessor_input, uid?: ComfyNodeUID): MiDaSNormalMapPreprocessor
    LeReSDepthMapPreprocessor(args: LeReSDepthMapPreprocessor_input, uid?: ComfyNodeUID): LeReSDepthMapPreprocessor
    ZoeDepthMapPreprocessor(args: ZoeDepthMapPreprocessor_input, uid?: ComfyNodeUID): ZoeDepthMapPreprocessor
    BAENormalMapPreprocessor(args: BAENormalMapPreprocessor_input, uid?: ComfyNodeUID): BAENormalMapPreprocessor
    OpenposePreprocessor(args: OpenposePreprocessor_input, uid?: ComfyNodeUID): OpenposePreprocessor
    MediaPipeHandPosePreprocessor(args: MediaPipeHandPosePreprocessor_input, uid?: ComfyNodeUID): MediaPipeHandPosePreprocessor
    SemSegPreprocessor(args: SemSegPreprocessor_input, uid?: ComfyNodeUID): SemSegPreprocessor
    UniFormerSemSegPreprocessor(args: UniFormerSemSegPreprocessor_input, uid?: ComfyNodeUID): UniFormerSemSegPreprocessor
    OneFormerCOCOSemSegPreprocessor(
        args: OneFormerCOCOSemSegPreprocessor_input,
        uid?: ComfyNodeUID,
    ): OneFormerCOCOSemSegPreprocessor
    OneFormerADE20KSemSegPreprocessor(
        args: OneFormerADE20KSemSegPreprocessor_input,
        uid?: ComfyNodeUID,
    ): OneFormerADE20KSemSegPreprocessor
    MediaPipeFaceMeshPreprocessor(args: MediaPipeFaceMeshPreprocessor_input, uid?: ComfyNodeUID): MediaPipeFaceMeshPreprocessor
    ColorPreprocessor(args: ColorPreprocessor_input, uid?: ComfyNodeUID): ColorPreprocessor
    TilePreprocessor(args: TilePreprocessor_input, uid?: ComfyNodeUID): TilePreprocessor
    CLIPRegionsBasePrompt(args: CLIPRegionsBasePrompt_input, uid?: ComfyNodeUID): CLIPRegionsBasePrompt
    CLIPSetRegion(args: CLIPSetRegion_input, uid?: ComfyNodeUID): CLIPSetRegion
    CLIPRegionsToConditioning(args: CLIPRegionsToConditioning_input, uid?: ComfyNodeUID): CLIPRegionsToConditioning
    KSamplerEfficient(args: KSamplerEfficient_input, uid?: ComfyNodeUID): KSamplerEfficient
    EfficientLoader(args: EfficientLoader_input, uid?: ComfyNodeUID): EfficientLoader
    XYPlot(args: XYPlot_input, uid?: ComfyNodeUID): XYPlot
    ImageOverlay(args: ImageOverlay_input, uid?: ComfyNodeUID): ImageOverlay
    EvaluateIntegers(args: EvaluateIntegers_input, uid?: ComfyNodeUID): EvaluateIntegers
    EvaluateStrings(args: EvaluateStrings_input, uid?: ComfyNodeUID): EvaluateStrings
    GaussianBlur(args: GaussianBlur_input, uid?: ComfyNodeUID): GaussianBlur
    HistogramEqualization(args: HistogramEqualization_input, uid?: ComfyNodeUID): HistogramEqualization
    WASImageFlip(args: WASImageFlip_input, uid?: ComfyNodeUID): WASImageFlip
    LatentUpscaleMultiply(args: LatentUpscaleMultiply_input, uid?: ComfyNodeUID): LatentUpscaleMultiply
    PseudoHDRStyle(args: PseudoHDRStyle_input, uid?: ComfyNodeUID): PseudoHDRStyle
    Saturation(args: Saturation_input, uid?: ComfyNodeUID): Saturation
    ImageSharpening(args: ImageSharpening_input, uid?: ComfyNodeUID): ImageSharpening
    WASCheckpointLoader(args: WASCheckpointLoader_input, uid?: ComfyNodeUID): WASCheckpointLoader
    WASCheckpointLoaderSimple(args: WASCheckpointLoaderSimple_input, uid?: ComfyNodeUID): WASCheckpointLoaderSimple
    WASCLIPTextEncodeNSP(args: WASCLIPTextEncodeNSP_input, uid?: ComfyNodeUID): WASCLIPTextEncodeNSP
    WASConditioningInputSwitch(args: WASConditioningInputSwitch_input, uid?: ComfyNodeUID): WASConditioningInputSwitch
    WASConstantNumber(args: WASConstantNumber_input, uid?: ComfyNodeUID): WASConstantNumber
    WASCreateGridImage(args: WASCreateGridImage_input, uid?: ComfyNodeUID): WASCreateGridImage
    WASCreateMorphImage(args: WASCreateMorphImage_input, uid?: ComfyNodeUID): WASCreateMorphImage
    WASCreateMorphImageFromPath(args: WASCreateMorphImageFromPath_input, uid?: ComfyNodeUID): WASCreateMorphImageFromPath
    WASCreateVideoFromPath(args: WASCreateVideoFromPath_input, uid?: ComfyNodeUID): WASCreateVideoFromPath
    WASDebugNumberToConsole(args: WASDebugNumberToConsole_input, uid?: ComfyNodeUID): WASDebugNumberToConsole
    WASDictionaryToConsole(args: WASDictionaryToConsole_input, uid?: ComfyNodeUID): WASDictionaryToConsole
    WASDiffusersModelLoader(args: WASDiffusersModelLoader_input, uid?: ComfyNodeUID): WASDiffusersModelLoader
    WASLatentInputSwitch(args: WASLatentInputSwitch_input, uid?: ComfyNodeUID): WASLatentInputSwitch
    WASLogicBoolean(args: WASLogicBoolean_input, uid?: ComfyNodeUID): WASLogicBoolean
    WASLoraLoader(args: WASLoraLoader_input, uid?: ComfyNodeUID): WASLoraLoader
    WASImageAnalyze(args: WASImageAnalyze_input, uid?: ComfyNodeUID): WASImageAnalyze
    WASImageBlank(args: WASImageBlank_input, uid?: ComfyNodeUID): WASImageBlank
    WASImageBlendByMask(args: WASImageBlendByMask_input, uid?: ComfyNodeUID): WASImageBlendByMask
    WASImageBlend(args: WASImageBlend_input, uid?: ComfyNodeUID): WASImageBlend
    WASImageBlendingMode(args: WASImageBlendingMode_input, uid?: ComfyNodeUID): WASImageBlendingMode
    WASImageBloomFilter(args: WASImageBloomFilter_input, uid?: ComfyNodeUID): WASImageBloomFilter
    WASImageCannyFilter(args: WASImageCannyFilter_input, uid?: ComfyNodeUID): WASImageCannyFilter
    WASImageChromaticAberration(args: WASImageChromaticAberration_input, uid?: ComfyNodeUID): WASImageChromaticAberration
    WASImageColorPalette(args: WASImageColorPalette_input, uid?: ComfyNodeUID): WASImageColorPalette
    WASImageCropFace(args: WASImageCropFace_input, uid?: ComfyNodeUID): WASImageCropFace
    WASImageCropLocation(args: WASImageCropLocation_input, uid?: ComfyNodeUID): WASImageCropLocation
    WASImagePasteFace(args: WASImagePasteFace_input, uid?: ComfyNodeUID): WASImagePasteFace
    WASImagePasteCrop(args: WASImagePasteCrop_input, uid?: ComfyNodeUID): WASImagePasteCrop
    WASImagePasteCropByLocation(args: WASImagePasteCropByLocation_input, uid?: ComfyNodeUID): WASImagePasteCropByLocation
    WASImageDraganPhotographyFilter(
        args: WASImageDraganPhotographyFilter_input,
        uid?: ComfyNodeUID,
    ): WASImageDraganPhotographyFilter
    WASImageEdgeDetectionFilter(args: WASImageEdgeDetectionFilter_input, uid?: ComfyNodeUID): WASImageEdgeDetectionFilter
    WASImageFilmGrain(args: WASImageFilmGrain_input, uid?: ComfyNodeUID): WASImageFilmGrain
    WASImageFilterAdjustments(args: WASImageFilterAdjustments_input, uid?: ComfyNodeUID): WASImageFilterAdjustments
    WASImageGradientMap(args: WASImageGradientMap_input, uid?: ComfyNodeUID): WASImageGradientMap
    WASImageGenerateGradient(args: WASImageGenerateGradient_input, uid?: ComfyNodeUID): WASImageGenerateGradient
    WASImageHighPassFilter(args: WASImageHighPassFilter_input, uid?: ComfyNodeUID): WASImageHighPassFilter
    WASImageHistoryLoader(args: WASImageHistoryLoader_input, uid?: ComfyNodeUID): WASImageHistoryLoader
    WASImageInputSwitch(args: WASImageInputSwitch_input, uid?: ComfyNodeUID): WASImageInputSwitch
    WASImageLevelsAdjustment(args: WASImageLevelsAdjustment_input, uid?: ComfyNodeUID): WASImageLevelsAdjustment
    WASImageLoad(args: WASImageLoad_input, uid?: ComfyNodeUID): WASImageLoad
    WASImageMedianFilter(args: WASImageMedianFilter_input, uid?: ComfyNodeUID): WASImageMedianFilter
    WASImageMixRGBChannels(args: WASImageMixRGBChannels_input, uid?: ComfyNodeUID): WASImageMixRGBChannels
    WASImageMonitorEffectsFilter(args: WASImageMonitorEffectsFilter_input, uid?: ComfyNodeUID): WASImageMonitorEffectsFilter
    WASImageNovaFilter(args: WASImageNovaFilter_input, uid?: ComfyNodeUID): WASImageNovaFilter
    WASImagePadding(args: WASImagePadding_input, uid?: ComfyNodeUID): WASImagePadding
    WASImagePerlinNoiseFilter(args: WASImagePerlinNoiseFilter_input, uid?: ComfyNodeUID): WASImagePerlinNoiseFilter
    WASImageRemoveBackgroundAlpha(args: WASImageRemoveBackgroundAlpha_input, uid?: ComfyNodeUID): WASImageRemoveBackgroundAlpha
    WASImageRemoveColor(args: WASImageRemoveColor_input, uid?: ComfyNodeUID): WASImageRemoveColor
    WASImageResize(args: WASImageResize_input, uid?: ComfyNodeUID): WASImageResize
    WASImageRotate(args: WASImageRotate_input, uid?: ComfyNodeUID): WASImageRotate
    WASImageSave(args: WASImageSave_input, uid?: ComfyNodeUID): WASImageSave
    WASImageSeamlessTexture(args: WASImageSeamlessTexture_input, uid?: ComfyNodeUID): WASImageSeamlessTexture
    WASImageSelectChannel(args: WASImageSelectChannel_input, uid?: ComfyNodeUID): WASImageSelectChannel
    WASImageSelectColor(args: WASImageSelectColor_input, uid?: ComfyNodeUID): WASImageSelectColor
    WASImageShadowsAndHighlights(args: WASImageShadowsAndHighlights_input, uid?: ComfyNodeUID): WASImageShadowsAndHighlights
    WASImageSizeToNumber(args: WASImageSizeToNumber_input, uid?: ComfyNodeUID): WASImageSizeToNumber
    WASImageStitch(args: WASImageStitch_input, uid?: ComfyNodeUID): WASImageStitch
    WASImageStyleFilter(args: WASImageStyleFilter_input, uid?: ComfyNodeUID): WASImageStyleFilter
    WASImageThreshold(args: WASImageThreshold_input, uid?: ComfyNodeUID): WASImageThreshold
    WASImageTranspose(args: WASImageTranspose_input, uid?: ComfyNodeUID): WASImageTranspose
    WASImageFDOFFilter(args: WASImageFDOFFilter_input, uid?: ComfyNodeUID): WASImageFDOFFilter
    WASImageToLatentMask(args: WASImageToLatentMask_input, uid?: ComfyNodeUID): WASImageToLatentMask
    WASImageVoronoiNoiseFilter(args: WASImageVoronoiNoiseFilter_input, uid?: ComfyNodeUID): WASImageVoronoiNoiseFilter
    WASKSamplerWAS(args: WASKSamplerWAS_input, uid?: ComfyNodeUID): WASKSamplerWAS
    WASLatentNoiseInjection(args: WASLatentNoiseInjection_input, uid?: ComfyNodeUID): WASLatentNoiseInjection
    WASLatentSizeToNumber(args: WASLatentSizeToNumber_input, uid?: ComfyNodeUID): WASLatentSizeToNumber
    WASLatentUpscaleByFactorWAS(args: WASLatentUpscaleByFactorWAS_input, uid?: ComfyNodeUID): WASLatentUpscaleByFactorWAS
    WASLoadImageBatch(args: WASLoadImageBatch_input, uid?: ComfyNodeUID): WASLoadImageBatch
    WASLoadTextFile(args: WASLoadTextFile_input, uid?: ComfyNodeUID): WASLoadTextFile
    WASMiDaSDepthApproximation(args: WASMiDaSDepthApproximation_input, uid?: ComfyNodeUID): WASMiDaSDepthApproximation
    WASMiDaSMaskImage(args: WASMiDaSMaskImage_input, uid?: ComfyNodeUID): WASMiDaSMaskImage
    WASNumberOperation(args: WASNumberOperation_input, uid?: ComfyNodeUID): WASNumberOperation
    WASNumberToFloat(args: WASNumberToFloat_input, uid?: ComfyNodeUID): WASNumberToFloat
    WASNumberInputSwitch(args: WASNumberInputSwitch_input, uid?: ComfyNodeUID): WASNumberInputSwitch
    WASNumberInputCondition(args: WASNumberInputCondition_input, uid?: ComfyNodeUID): WASNumberInputCondition
    WASNumberMultipleOf(args: WASNumberMultipleOf_input, uid?: ComfyNodeUID): WASNumberMultipleOf
    WASNumberPI(args: WASNumberPI_input, uid?: ComfyNodeUID): WASNumberPI
    WASNumberToInt(args: WASNumberToInt_input, uid?: ComfyNodeUID): WASNumberToInt
    WASNumberToSeed(args: WASNumberToSeed_input, uid?: ComfyNodeUID): WASNumberToSeed
    WASNumberToString(args: WASNumberToString_input, uid?: ComfyNodeUID): WASNumberToString
    WASNumberToText(args: WASNumberToText_input, uid?: ComfyNodeUID): WASNumberToText
    WASPromptStylesSelector(args: WASPromptStylesSelector_input, uid?: ComfyNodeUID): WASPromptStylesSelector
    WASRandomNumber(args: WASRandomNumber_input, uid?: ComfyNodeUID): WASRandomNumber
    WASSaveTextFile(args: WASSaveTextFile_input, uid?: ComfyNodeUID): WASSaveTextFile
    WASSeed(args: WASSeed_input, uid?: ComfyNodeUID): WASSeed
    WASTensorBatchToImage(args: WASTensorBatchToImage_input, uid?: ComfyNodeUID): WASTensorBatchToImage
    WASBLIPAnalyzeImage(args: WASBLIPAnalyzeImage_input, uid?: ComfyNodeUID): WASBLIPAnalyzeImage
    WASSAMModelLoader(args: WASSAMModelLoader_input, uid?: ComfyNodeUID): WASSAMModelLoader
    WASSAMParameters(args: WASSAMParameters_input, uid?: ComfyNodeUID): WASSAMParameters
    WASSAMParametersCombine(args: WASSAMParametersCombine_input, uid?: ComfyNodeUID): WASSAMParametersCombine
    WASSAMImageMask(args: WASSAMImageMask_input, uid?: ComfyNodeUID): WASSAMImageMask
    WASStringToText(args: WASStringToText_input, uid?: ComfyNodeUID): WASStringToText
    WASImageBounds(args: WASImageBounds_input, uid?: ComfyNodeUID): WASImageBounds
    WASInsetImageBounds(args: WASInsetImageBounds_input, uid?: ComfyNodeUID): WASInsetImageBounds
    WASBoundedImageBlend(args: WASBoundedImageBlend_input, uid?: ComfyNodeUID): WASBoundedImageBlend
    WASBoundedImageBlendWithMask(args: WASBoundedImageBlendWithMask_input, uid?: ComfyNodeUID): WASBoundedImageBlendWithMask
    WASBoundedImageCrop(args: WASBoundedImageCrop_input, uid?: ComfyNodeUID): WASBoundedImageCrop
    WASBoundedImageCropWithMask(args: WASBoundedImageCropWithMask_input, uid?: ComfyNodeUID): WASBoundedImageCropWithMask
    WASTextDictionaryUpdate(args: WASTextDictionaryUpdate_input, uid?: ComfyNodeUID): WASTextDictionaryUpdate
    WASTextAddTokens(args: WASTextAddTokens_input, uid?: ComfyNodeUID): WASTextAddTokens
    WASTextAddTokenByInput(args: WASTextAddTokenByInput_input, uid?: ComfyNodeUID): WASTextAddTokenByInput
    WASTextConcatenate(args: WASTextConcatenate_input, uid?: ComfyNodeUID): WASTextConcatenate
    WASTextFileHistoryLoader(args: WASTextFileHistoryLoader_input, uid?: ComfyNodeUID): WASTextFileHistoryLoader
    WASTextFindAndReplaceByDictionary(
        args: WASTextFindAndReplaceByDictionary_input,
        uid?: ComfyNodeUID,
    ): WASTextFindAndReplaceByDictionary
    WASTextFindAndReplaceInput(args: WASTextFindAndReplaceInput_input, uid?: ComfyNodeUID): WASTextFindAndReplaceInput
    WASTextFindAndReplace(args: WASTextFindAndReplace_input, uid?: ComfyNodeUID): WASTextFindAndReplace
    WASTextInputSwitch(args: WASTextInputSwitch_input, uid?: ComfyNodeUID): WASTextInputSwitch
    WASTextMultiline(args: WASTextMultiline_input, uid?: ComfyNodeUID): WASTextMultiline
    WASTextParseA1111Embeddings(args: WASTextParseA1111Embeddings_input, uid?: ComfyNodeUID): WASTextParseA1111Embeddings
    WASTextParseNoodleSoupPrompts(args: WASTextParseNoodleSoupPrompts_input, uid?: ComfyNodeUID): WASTextParseNoodleSoupPrompts
    WASTextParseTokens(args: WASTextParseTokens_input, uid?: ComfyNodeUID): WASTextParseTokens
    WASTextRandomLine(args: WASTextRandomLine_input, uid?: ComfyNodeUID): WASTextRandomLine
    WASTextString(args: WASTextString_input, uid?: ComfyNodeUID): WASTextString
    WASTextToConditioning(args: WASTextToConditioning_input, uid?: ComfyNodeUID): WASTextToConditioning
    WASTextToConsole(args: WASTextToConsole_input, uid?: ComfyNodeUID): WASTextToConsole
    WASTextToNumber(args: WASTextToNumber_input, uid?: ComfyNodeUID): WASTextToNumber
    WASTextToString(args: WASTextToString_input, uid?: ComfyNodeUID): WASTextToString
    WASTrueRandomOrgNumberGenerator(
        args: WASTrueRandomOrgNumberGenerator_input,
        uid?: ComfyNodeUID,
    ): WASTrueRandomOrgNumberGenerator
    WASUnCLIPCheckpointLoader(args: WASUnCLIPCheckpointLoader_input, uid?: ComfyNodeUID): WASUnCLIPCheckpointLoader
    WASUpscaleModelLoader(args: WASUpscaleModelLoader_input, uid?: ComfyNodeUID): WASUpscaleModelLoader
    WASWriteToGIF(args: WASWriteToGIF_input, uid?: ComfyNodeUID): WASWriteToGIF
    WASWriteToVideo(args: WASWriteToVideo_input, uid?: ComfyNodeUID): WASWriteToVideo
    YKImagePadForOutpaint(args: YKImagePadForOutpaint_input, uid?: ComfyNodeUID): YKImagePadForOutpaint
    YKMaskToImage(args: YKMaskToImage_input, uid?: ComfyNodeUID): YKMaskToImage
    HypernetworkLoader(args: HypernetworkLoader_input, uid?: ComfyNodeUID): HypernetworkLoader
    UpscaleModelLoader(args: UpscaleModelLoader_input, uid?: ComfyNodeUID): UpscaleModelLoader
    ImageUpscaleWithModel(args: ImageUpscaleWithModel_input, uid?: ComfyNodeUID): ImageUpscaleWithModel
    ImageBlend(args: ImageBlend_input, uid?: ComfyNodeUID): ImageBlend
    ImageBlur(args: ImageBlur_input, uid?: ComfyNodeUID): ImageBlur
    ImageQuantize(args: ImageQuantize_input, uid?: ComfyNodeUID): ImageQuantize
    ImageSharpen(args: ImageSharpen_input, uid?: ComfyNodeUID): ImageSharpen
    LatentCompositeMasked(args: LatentCompositeMasked_input, uid?: ComfyNodeUID): LatentCompositeMasked
    MaskToImage(args: MaskToImage_input, uid?: ComfyNodeUID): MaskToImage
    ImageToMask(args: ImageToMask_input, uid?: ComfyNodeUID): ImageToMask
    SolidMask(args: SolidMask_input, uid?: ComfyNodeUID): SolidMask
    InvertMask(args: InvertMask_input, uid?: ComfyNodeUID): InvertMask
    CropMask(args: CropMask_input, uid?: ComfyNodeUID): CropMask
    MaskComposite(args: MaskComposite_input, uid?: ComfyNodeUID): MaskComposite
    FeatherMask(args: FeatherMask_input, uid?: ComfyNodeUID): FeatherMask
}

// TYPES -------------------------------
export type CLIP_VISION_OUTPUT = Slot<'CLIP_VISION_OUTPUT'>
export type SAM_PARAMETERS = Slot<'SAM_PARAMETERS'>
export type DETAILER_PIPE = Slot<'DETAILER_PIPE'>
export type SchedulerName = Slot<'SchedulerName'>
export type UPSCALE_MODEL = Slot<'UPSCALE_MODEL'>
export type CONDITIONING = Slot<'CONDITIONING'>
export type IMAGE_BOUNDS = Slot<'IMAGE_BOUNDS'>
export type CLIP_VISION = Slot<'CLIP_VISION'>
export type STYLE_MODEL = Slot<'STYLE_MODEL'>
export type CONTROL_NET = Slot<'CONTROL_NET'>
export type SamplerName = Slot<'SamplerName'>
export type BBOX_MODEL = Slot<'BBOX_MODEL'>
export type SEGM_MODEL = Slot<'SEGM_MODEL'>
export type ONNX_MODEL = Slot<'ONNX_MODEL'>
export type IMAGE_PATH = Slot<'IMAGE_PATH'>
export type CLIPREGION = Slot<'CLIPREGION'>
export type SAM_MODEL = Slot<'SAM_MODEL'>
export type CROP_DATA = Slot<'CROP_DATA'>
export type Integer = Slot<'Integer'>
export type LATENT = Slot<'LATENT'>
export type GLIGEN = Slot<'GLIGEN'>
export type SCRIPT = Slot<'SCRIPT'>
export type NUMBER = Slot<'NUMBER'>
export type MODEL = Slot<'MODEL'>
export type IMAGE = Slot<'IMAGE'>
export type Float = Slot<'Float'>
export type ASCII = Slot<'ASCII'>
export type CLIP = Slot<'CLIP'>
export type MASK = Slot<'MASK'>
export type SEGS = Slot<'SEGS'>
export type DICT = Slot<'DICT'>
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
export type Enum_KSamplerAdvanced_sampler_name = Enum_KSampler_sampler_name
export type Enum_ImpactDetailerForEach_sampler_name = Enum_KSampler_sampler_name
export type Enum_ImpactDetailerForEachDebug_sampler_name = Enum_KSampler_sampler_name
export type Enum_ImpactFaceDetailer_sampler_name = Enum_KSampler_sampler_name
export type Enum_ImpactFaceDetailerPipe_sampler_name = Enum_KSampler_sampler_name
export type Enum_KSamplerSetting_sampler_name = Enum_KSampler_sampler_name
export type Enum_KSamplerEfficient_sampler_name = Enum_KSampler_sampler_name
export type Enum_WASKSamplerWAS_sampler_name = Enum_KSampler_sampler_name
export type Enum_KSampler_scheduler = 'ddim_uniform' | 'karras' | 'normal' | 'simple'
export type Enum_KSamplerAdvanced_scheduler = Enum_KSampler_scheduler
export type Enum_ImpactDetailerForEach_scheduler = Enum_KSampler_scheduler
export type Enum_ImpactDetailerForEachDebug_scheduler = Enum_KSampler_scheduler
export type Enum_ImpactFaceDetailer_scheduler = Enum_KSampler_scheduler
export type Enum_ImpactFaceDetailerPipe_scheduler = Enum_KSampler_scheduler
export type Enum_KSamplerSetting_scheduler = Enum_KSampler_scheduler
export type Enum_KSamplerEfficient_scheduler = Enum_KSampler_scheduler
export type Enum_WASKSamplerWAS_scheduler = Enum_KSampler_scheduler
export type Enum_CheckpointLoaderSimple_ckpt_name =
    | 'AOM3A1_orangemixs.safetensors'
    | 'AOM3A3_orangemixs.safetensors'
    | 'AbyssOrangeMix2_hard.safetensors'
    | 'Deliberate-inpainting.safetensors'
    | 'angel1_36224.safetensors'
    | 'anything-v3-fp16-pruned.safetensors'
    | 'deliberate_v2.safetensors'
    | 'realisticVisionV20_v20.safetensors'
    | 'revAnimated_v122.safetensors'
    | 'v1-5-pruned-emaonly.ckpt'
    | 'v2-1_512-ema-pruned.safetensors'
    | 'v2-1_768-ema-pruned.safetensors'
    | 'wd-1-5-beta2-fp16.safetensors'
export type Enum_UnCLIPCheckpointLoader_ckpt_name = Enum_CheckpointLoaderSimple_ckpt_name
export type Enum_CheckpointLoader_ckpt_name = Enum_CheckpointLoaderSimple_ckpt_name
export type Enum_StateDictLoader_ckpt_name = Enum_CheckpointLoaderSimple_ckpt_name
export type Enum_EfficientLoader_ckpt_name = Enum_CheckpointLoaderSimple_ckpt_name
export type Enum_WASCheckpointLoader_ckpt_name = Enum_CheckpointLoaderSimple_ckpt_name
export type Enum_WASCheckpointLoaderSimple_ckpt_name = Enum_CheckpointLoaderSimple_ckpt_name
export type Enum_WASUnCLIPCheckpointLoader_ckpt_name = Enum_CheckpointLoaderSimple_ckpt_name
export type Enum_VAELoader_vae_name =
    | 'blessed2.vae.pt'
    | 'kl-f8-anime2.ckpt'
    | 'orangemix.vae.pt'
    | 'vae-ft-mse-840000-ema-pruned.safetensors'
export type Enum_LatentUpscale_upscale_method = 'area' | 'bilinear' | 'nearest-exact'
export type Enum_ImageScale_upscale_method = Enum_LatentUpscale_upscale_method
export type Enum_ImageOverlay_resize_method = Enum_LatentUpscale_upscale_method
export type Enum_LatentUpscaleMultiply_upscale_method = Enum_LatentUpscale_upscale_method
export type Enum_LatentUpscale_crop = 'center' | 'disabled'
export type Enum_ImageScale_crop = Enum_LatentUpscale_crop
export type Enum_LatentUpscaleMultiply_crop = Enum_LatentUpscale_crop
export type Enum_LoadImage_image =
    | '2023-03-19_22-20-04.png'
    | 'ComfyUI_00498_.png'
    | 'ComfyUI_01790_.png'
    | 'decihub-logo-126.png'
    | 'esrgan_example (1).png'
    | 'esrgan_example.png'
    | 'example.png'
    | 'upload (1).png'
    | 'upload (10).png'
    | 'upload (11).png'
    | 'upload (12).png'
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
    | 'upload (8).png'
    | 'upload (9).png'
    | 'upload.png'
export type Enum_LoadImageMask_image = Enum_LoadImage_image
export type Enum_LoadImageMask_channel = 'alpha' | 'blue' | 'green' | 'red'
export type Enum_WASImageToLatentMask_channel = Enum_LoadImageMask_channel
export type Enum_ConditioningSetMask_set_cond_area = 'default' | 'mask bounds'
export type Enum_KSamplerAdvanced_add_noise = 'disable' | 'enable'
export type Enum_KSamplerAdvanced_return_with_leftover_noise = Enum_KSamplerAdvanced_add_noise
export type Enum_CannyEdgePreprocessor_l2gradient = Enum_KSamplerAdvanced_add_noise
export type Enum_HEDPreprocessor_safe = Enum_KSamplerAdvanced_add_noise
export type Enum_PiDiNetPreprocessor_safe = Enum_KSamplerAdvanced_add_noise
export type Enum_LineArtPreprocessor_coarse = Enum_KSamplerAdvanced_add_noise
export type Enum_OpenposePreprocessor_detect_hand = Enum_KSamplerAdvanced_add_noise
export type Enum_OpenposePreprocessor_detect_body = Enum_KSamplerAdvanced_add_noise
export type Enum_OpenposePreprocessor_detect_face = Enum_KSamplerAdvanced_add_noise
export type Enum_MediaPipeHandPosePreprocessor_detect_pose = Enum_KSamplerAdvanced_add_noise
export type Enum_MediaPipeHandPosePreprocessor_detect_hands = Enum_KSamplerAdvanced_add_noise
export type Enum_LatentRotate_rotation = '180 degrees' | '270 degrees' | '90 degrees' | 'none'
export type Enum_LatentFlip_flip_method = 'x-axis: vertically' | 'y-axis: horizontally'
export type Enum_LoraLoader_lora_name =
    | 'LowRa.safetensors'
    | 'pixel_f2.safetensors'
    | 'test\\Moxin_10.safetensors'
    | 'test\\animeLineartMangaLike_v30MangaLike.safetensors'
    | 'theovercomer8sContrastFix_sd15.safetensors'
    | 'theovercomer8sContrastFix_sd21768.safetensors'
export type Enum_WASLoraLoader_lora_name = Enum_LoraLoader_lora_name
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
export type Enum_Dict2Model_config_name = Enum_CheckpointLoader_config_name
export type Enum_StateDictMergerBlockWeightedMulti_config_name = Enum_CheckpointLoader_config_name
export type Enum_WASCheckpointLoader_config_name = Enum_CheckpointLoader_config_name
export type Enum_BrightnessContrast_mode = 'brightness' | 'contrast'
export type Enum_ImpactMMDetLoader_model_name = 'bbox/mmdet_anime-face_yolov3.pth'
export type Enum_ImpactSAMLoader_model_name = 'sam_vit_b_01ec64.pth' | 'sam_vit_h_4b8939.pth'
export type Enum_ImpactDetailerForEach_guide_size_for = 'bbox' | 'crop_region'
export type Enum_ImpactDetailerForEachDebug_guide_size_for = Enum_ImpactDetailerForEach_guide_size_for
export type Enum_ImpactFaceDetailer_guide_size_for = Enum_ImpactDetailerForEach_guide_size_for
export type Enum_ImpactFaceDetailerPipe_guide_size_for = Enum_ImpactDetailerForEach_guide_size_for
export type Enum_ImpactDetailerForEach_noise_mask = 'disabled' | 'enabled'
export type Enum_ImpactDetailerForEach_force_inpaint = Enum_ImpactDetailerForEach_noise_mask
export type Enum_ImpactDetailerForEachDebug_noise_mask = Enum_ImpactDetailerForEach_noise_mask
export type Enum_ImpactDetailerForEachDebug_force_inpaint = Enum_ImpactDetailerForEach_noise_mask
export type Enum_ImpactFaceDetailer_noise_mask = Enum_ImpactDetailerForEach_noise_mask
export type Enum_ImpactFaceDetailer_force_inpaint = Enum_ImpactDetailerForEach_noise_mask
export type Enum_ImpactFaceDetailerPipe_noise_mask = Enum_ImpactDetailerForEach_noise_mask
export type Enum_ImpactFaceDetailerPipe_force_inpaint = Enum_ImpactDetailerForEach_noise_mask
export type Enum_ImpactSAMDetectorCombined_detection_hint =
    | 'center-1'
    | 'diamond-4'
    | 'horizontal-2'
    | 'mask-area'
    | 'mask-points'
    | 'none'
    | 'rect-4'
    | 'vertical-2'
export type Enum_ImpactFaceDetailer_sam_detection_hint = Enum_ImpactSAMDetectorCombined_detection_hint
export type Enum_ImpactFaceDetailerPipe_sam_detection_hint = Enum_ImpactSAMDetectorCombined_detection_hint
export type Enum_ImpactSAMDetectorCombined_mask_hint_use_negative = 'False' | 'Outter' | 'Small'
export type Enum_ImpactFaceDetailer_sam_mask_hint_use_negative = Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
export type Enum_ImpactFaceDetailerPipe_sam_mask_hint_use_negative = Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
export type Enum_ImpactMaskToSEGS_combined = 'False' | 'True'
export type Enum_StateDictMerger_half = Enum_ImpactMaskToSEGS_combined
export type Enum_StateDictMergerBlockWeighted_half = Enum_ImpactMaskToSEGS_combined
export type Enum_StateDictMergerBlockWeightedMulti_half = Enum_ImpactMaskToSEGS_combined
export type Enum_XYPlot_XY_flip = Enum_ImpactMaskToSEGS_combined
export type Enum_EvaluateIntegers_print_to_console = Enum_ImpactMaskToSEGS_combined
export type Enum_EvaluateStrings_print_to_console = Enum_ImpactMaskToSEGS_combined
export type Enum_LatentToHist_min_auto = 'Auto' | 'Specified'
export type Enum_LatentToHist_max_auto = Enum_LatentToHist_min_auto
export type Enum_LatentToHist_bin_auto = Enum_LatentToHist_min_auto
export type Enum_LatentToHist_ymax_auto = Enum_LatentToHist_min_auto
export type Enum_StateDictMerger_position_ids = 'A' | 'B' | 'Reset'
export type Enum_StateDictMergerBlockWeighted_position_ids = Enum_StateDictMerger_position_ids
export type Enum_StateDictMergerBlockWeightedMulti_position_ids = Enum_StateDictMerger_position_ids
export type Enum_ImageBlend2_blend_mode =
    | 'abs_diff'
    | 'compare_color_dark'
    | 'compare_color_light'
    | 'compare_dark'
    | 'compare_light'
    | 'multiply'
    | 'normal'
    | 'overlay'
    | 'screen'
    | 'soft_light'
export type Enum_BNK_CutoffRegionsToConditioning_ADV_token_normalization = 'length' | 'length+mean' | 'mean' | 'none'
export type Enum_BNK_CutoffRegionsToConditioning_ADV_weight_interpretation = 'A1111' | 'comfy' | 'comfy++' | 'compel'
export type Enum_ClipSeg_device = 'cpu' | 'cuda' | 'mps' | 'xpu'
export type Enum_ClipSeg_mode = 'average' | 'sum'
export type Enum_HEDPreprocessor_version = 'v1' | 'v1.1'
export type Enum_OpenposePreprocessor_version = Enum_HEDPreprocessor_version
export type Enum_KSamplerEfficient_sampler_state = 'Hold' | 'Sample' | 'Script'
export type Enum_KSamplerEfficient_preview_image = 'Disabled' | 'Enabled'
export type Enum_EfficientLoader_vae_name =
    | 'Baked VAE'
    | 'blessed2.vae.pt'
    | 'kl-f8-anime2.ckpt'
    | 'orangemix.vae.pt'
    | 'vae-ft-mse-840000-ema-pruned.safetensors'
export type Enum_EfficientLoader_lora_name =
    | 'LowRa.safetensors'
    | 'None'
    | 'pixel_f2.safetensors'
    | 'test\\Moxin_10.safetensors'
    | 'test\\animeLineartMangaLike_v30MangaLike.safetensors'
    | 'theovercomer8sContrastFix_sd15.safetensors'
    | 'theovercomer8sContrastFix_sd21768.safetensors'
export type Enum_XYPlot_X_type =
    | 'CFG Scale'
    | 'Denoise'
    | 'Latent Batch'
    | 'Nothing'
    | 'Sampler'
    | 'Scheduler'
    | 'Seeds++ Batch'
    | 'Steps'
    | 'VAE'
export type Enum_XYPlot_Y_type = Enum_XYPlot_X_type
export type Enum_ImageOverlay_overlay_resize = 'Fit' | 'None' | 'Resize by rescale_factor' | 'Resize to width & heigth'
export type Enum_WASImageFlip_mode = 'horizontal' | 'vertical'
export type Enum_WASImageGenerateGradient_direction = Enum_WASImageFlip_mode
export type Enum_WASConstantNumber_number_type = 'bool' | 'float' | 'integer'
export type Enum_WASRandomNumber_number_type = Enum_WASConstantNumber_number_type
export type Enum_WASCreateGridImage_include_subfolders = 'false' | 'true'
export type Enum_WASImageCannyFilter_enable_threshold = Enum_WASCreateGridImage_include_subfolders
export type Enum_WASImageCropFace_use_face_recognition_gpu = Enum_WASCreateGridImage_include_subfolders
export type Enum_WASImageDraganPhotographyFilter_colorize = Enum_WASCreateGridImage_include_subfolders
export type Enum_WASImageGradientMap_flip_left_right = Enum_WASCreateGridImage_include_subfolders
export type Enum_WASImagePadding_feather_second_pass = Enum_WASCreateGridImage_include_subfolders
export type Enum_WASImageResize_supersample = Enum_WASCreateGridImage_include_subfolders
export type Enum_WASImageSeamlessTexture_tiled = Enum_WASCreateGridImage_include_subfolders
export type Enum_WASLatentUpscaleByFactorWAS_align = Enum_WASCreateGridImage_include_subfolders
export type Enum_WASMiDaSDepthApproximation_use_cpu = Enum_WASCreateGridImage_include_subfolders
export type Enum_WASMiDaSDepthApproximation_invert_depth = Enum_WASCreateGridImage_include_subfolders
export type Enum_WASMiDaSMaskImage_use_cpu = Enum_WASCreateGridImage_include_subfolders
export type Enum_WASMiDaSMaskImage_threshold = Enum_WASCreateGridImage_include_subfolders
export type Enum_WASTextConcatenate_linebreak_addition = Enum_WASCreateGridImage_include_subfolders
export type Enum_WASCreateMorphImage_filetype = 'APNG' | 'GIF'
export type Enum_WASCreateMorphImageFromPath_filetype = Enum_WASCreateMorphImage_filetype
export type Enum_WASCreateVideoFromPath_codec = 'AVC1' | 'FFV1' | 'H264' | 'MP4V'
export type Enum_WASWriteToVideo_codec = Enum_WASCreateVideoFromPath_codec
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
export type Enum_WASImageCropFace_cascade_xml =
    | 'haarcascade_frontalface_alt.xml'
    | 'haarcascade_frontalface_alt2.xml'
    | 'haarcascade_frontalface_alt_tree.xml'
    | 'haarcascade_frontalface_default.xml'
    | 'haarcascade_profileface.xml'
    | 'haarcascade_upperbody.xml'
    | 'lbpcascade_animeface.xml'
export type Enum_WASImageEdgeDetectionFilter_mode = 'laplacian' | 'normal'
export type Enum_WASImageHistoryLoader_image =
    | '...\\output\\ComfyUI_03513_.png'
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
export type Enum_WASImageRotate_mode = 'internal' | 'transpose'
export type Enum_WASImageRotate_sampler = 'bicubic' | 'bilinear' | 'nearest'
export type Enum_WASImageSave_extension = 'gif' | 'jpeg' | 'png' | 'tiff'
export type Enum_WASImageSave_overwrite_mode = 'false' | 'prefix_as_filename'
export type Enum_WASImageSelectChannel_channel = 'blue' | 'green' | 'red'
export type Enum_ImageToMask_channel = Enum_WASImageSelectChannel_channel
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
export type Enum_WASLatentUpscaleByFactorWAS_mode = 'area' | 'bicubic' | 'bilinear' | 'nearest'
export type Enum_WASLoadImageBatch_mode = 'incremental_image' | 'single_image'
export type Enum_WASMiDaSDepthApproximation_midas_model = 'DPT_Hybrid' | 'DPT_Large' | 'DPT_Small'
export type Enum_WASMiDaSMaskImage_midas_model = Enum_WASMiDaSDepthApproximation_midas_model
export type Enum_WASMiDaSMaskImage_remove = 'background' | 'foregroud'
export type Enum_WASNumberOperation_operation =
    | 'addition'
    | 'division'
    | 'does not equal'
    | 'equals'
    | 'exponentiation'
    | 'floor division'
    | 'greater-than'
    | 'greater-than or equels'
    | 'less-than'
    | 'less-than or equals'
    | 'modulus'
    | 'multiplication'
    | 'subtraction'
export type Enum_WASNumberInputCondition_comparison =
    | 'divisible by'
    | 'does not equal'
    | 'equals'
    | 'factor of'
    | 'greater-than'
    | 'greater-than or equels'
    | 'if A even'
    | 'if A odd'
    | 'if A prime'
    | 'less-than'
    | 'less-than or equals'
export type Enum_WASPromptStylesSelector_style = 'None'
export type Enum_WASBLIPAnalyzeImage_mode = 'caption' | 'interrogate'
export type Enum_WASSAMModelLoader_model_size = 'ViT-B (636M)' | 'ViT-H (91M)' | 'ViT-L (308M)'
export type Enum_WASTextFileHistoryLoader_file = 'No History'
export type Enum_WASUpscaleModelLoader_model_name =
    | '2x_Waifaux-NL3-SuperLite_latest_G.pth'
    | 'RealESRGAN_x2.pth'
    | 'RealESRGAN_x4.pth'
export type Enum_UpscaleModelLoader_model_name = Enum_WASUpscaleModelLoader_model_name
export type Enum_ImageBlend_blend_mode = 'multiply' | 'normal' | 'overlay' | 'screen' | 'soft_light'
export type Enum_ImageQuantize_dither = 'floyd-steinberg' | 'none'
export type Enum_MaskComposite_operation = 'add' | 'multiply' | 'subtract'

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
export interface HasSingle_BBOX_MODEL { _BBOX_MODEL: BBOX_MODEL } // prettier-ignore
export interface HasSingle_SEGM_MODEL { _SEGM_MODEL: SEGM_MODEL } // prettier-ignore
export interface HasSingle_SAM_MODEL { _SAM_MODEL: SAM_MODEL } // prettier-ignore
export interface HasSingle_ONNX_MODEL { _ONNX_MODEL: ONNX_MODEL } // prettier-ignore
export interface HasSingle_SEGS { _SEGS: SEGS } // prettier-ignore
export interface HasSingle_DETAILER_PIPE { _DETAILER_PIPE: DETAILER_PIPE } // prettier-ignore
export interface HasSingle_IMAGE_PATH { _IMAGE_PATH: IMAGE_PATH } // prettier-ignore
export interface HasSingle_DICT { _DICT: DICT } // prettier-ignore
export interface HasSingle_Integer { _Integer: Integer } // prettier-ignore
export interface HasSingle_Float { _Float: Float } // prettier-ignore
export interface HasSingle_SamplerName { _SamplerName: SamplerName } // prettier-ignore
export interface HasSingle_SchedulerName { _SchedulerName: SchedulerName } // prettier-ignore
export interface HasSingle_CLIPREGION { _CLIPREGION: CLIPREGION } // prettier-ignore
export interface HasSingle_SCRIPT { _SCRIPT: SCRIPT } // prettier-ignore
export interface HasSingle_NUMBER { _NUMBER: NUMBER } // prettier-ignore
export interface HasSingle_ASCII { _ASCII: ASCII } // prettier-ignore
export interface HasSingle_CROP_DATA { _CROP_DATA: CROP_DATA } // prettier-ignore
export interface HasSingle_SEED { _SEED: SEED } // prettier-ignore
export interface HasSingle_SAM_PARAMETERS { _SAM_PARAMETERS: SAM_PARAMETERS } // prettier-ignore
export interface HasSingle_IMAGE_BOUNDS { _IMAGE_BOUNDS: IMAGE_BOUNDS } // prettier-ignore
export interface HasSingle_UPSCALE_MODEL { _UPSCALE_MODEL: UPSCALE_MODEL } // prettier-ignore
export interface HasSingle_Enum_KSampler_sampler_name { _Enum_KSampler_sampler_name: Enum_KSampler_sampler_name } // prettier-ignore
export interface HasSingle_Enum_KSampler_scheduler { _Enum_KSampler_scheduler: Enum_KSampler_scheduler } // prettier-ignore
export interface HasSingle_Enum_CheckpointLoaderSimple_ckpt_name { _Enum_CheckpointLoaderSimple_ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name } // prettier-ignore
export interface HasSingle_Enum_VAELoader_vae_name { _Enum_VAELoader_vae_name: Enum_VAELoader_vae_name } // prettier-ignore
export interface HasSingle_Enum_LatentUpscale_upscale_method { _Enum_LatentUpscale_upscale_method: Enum_LatentUpscale_upscale_method } // prettier-ignore
export interface HasSingle_Enum_LatentUpscale_crop { _Enum_LatentUpscale_crop: Enum_LatentUpscale_crop } // prettier-ignore
export interface HasSingle_Enum_LoadImage_image { _Enum_LoadImage_image: Enum_LoadImage_image } // prettier-ignore
export interface HasSingle_Enum_LoadImageMask_channel { _Enum_LoadImageMask_channel: Enum_LoadImageMask_channel } // prettier-ignore
export interface HasSingle_Enum_ConditioningSetMask_set_cond_area { _Enum_ConditioningSetMask_set_cond_area: Enum_ConditioningSetMask_set_cond_area } // prettier-ignore
export interface HasSingle_Enum_KSamplerAdvanced_add_noise { _Enum_KSamplerAdvanced_add_noise: Enum_KSamplerAdvanced_add_noise } // prettier-ignore
export interface HasSingle_Enum_LatentRotate_rotation { _Enum_LatentRotate_rotation: Enum_LatentRotate_rotation } // prettier-ignore
export interface HasSingle_Enum_LatentFlip_flip_method { _Enum_LatentFlip_flip_method: Enum_LatentFlip_flip_method } // prettier-ignore
export interface HasSingle_Enum_LoraLoader_lora_name { _Enum_LoraLoader_lora_name: Enum_LoraLoader_lora_name } // prettier-ignore
export interface HasSingle_Enum_CLIPLoader_clip_name { _Enum_CLIPLoader_clip_name: Enum_CLIPLoader_clip_name } // prettier-ignore
export interface HasSingle_Enum_ControlNetLoader_control_net_name { _Enum_ControlNetLoader_control_net_name: Enum_ControlNetLoader_control_net_name } // prettier-ignore
export interface HasSingle_Enum_StyleModelLoader_style_model_name { _Enum_StyleModelLoader_style_model_name: Enum_StyleModelLoader_style_model_name } // prettier-ignore
export interface HasSingle_Enum_CLIPVisionLoader_clip_name { _Enum_CLIPVisionLoader_clip_name: Enum_CLIPVisionLoader_clip_name } // prettier-ignore
export interface HasSingle_Enum_CheckpointLoader_config_name { _Enum_CheckpointLoader_config_name: Enum_CheckpointLoader_config_name } // prettier-ignore
export interface HasSingle_Enum_BrightnessContrast_mode { _Enum_BrightnessContrast_mode: Enum_BrightnessContrast_mode } // prettier-ignore
export interface HasSingle_Enum_ImpactMMDetLoader_model_name { _Enum_ImpactMMDetLoader_model_name: Enum_ImpactMMDetLoader_model_name } // prettier-ignore
export interface HasSingle_Enum_ImpactSAMLoader_model_name { _Enum_ImpactSAMLoader_model_name: Enum_ImpactSAMLoader_model_name } // prettier-ignore
export interface HasSingle_Enum_ImpactDetailerForEach_guide_size_for { _Enum_ImpactDetailerForEach_guide_size_for: Enum_ImpactDetailerForEach_guide_size_for } // prettier-ignore
export interface HasSingle_Enum_ImpactDetailerForEach_noise_mask { _Enum_ImpactDetailerForEach_noise_mask: Enum_ImpactDetailerForEach_noise_mask } // prettier-ignore
export interface HasSingle_Enum_ImpactSAMDetectorCombined_detection_hint { _Enum_ImpactSAMDetectorCombined_detection_hint: Enum_ImpactSAMDetectorCombined_detection_hint } // prettier-ignore
export interface HasSingle_Enum_ImpactSAMDetectorCombined_mask_hint_use_negative { _Enum_ImpactSAMDetectorCombined_mask_hint_use_negative: Enum_ImpactSAMDetectorCombined_mask_hint_use_negative } // prettier-ignore
export interface HasSingle_Enum_ImpactMaskToSEGS_combined { _Enum_ImpactMaskToSEGS_combined: Enum_ImpactMaskToSEGS_combined } // prettier-ignore
export interface HasSingle_Enum_LatentToHist_min_auto { _Enum_LatentToHist_min_auto: Enum_LatentToHist_min_auto } // prettier-ignore
export interface HasSingle_Enum_StateDictMerger_position_ids { _Enum_StateDictMerger_position_ids: Enum_StateDictMerger_position_ids } // prettier-ignore
export interface HasSingle_Enum_ImageBlend2_blend_mode { _Enum_ImageBlend2_blend_mode: Enum_ImageBlend2_blend_mode } // prettier-ignore
export interface HasSingle_Enum_BNK_CutoffRegionsToConditioning_ADV_token_normalization { _Enum_BNK_CutoffRegionsToConditioning_ADV_token_normalization: Enum_BNK_CutoffRegionsToConditioning_ADV_token_normalization } // prettier-ignore
export interface HasSingle_Enum_BNK_CutoffRegionsToConditioning_ADV_weight_interpretation { _Enum_BNK_CutoffRegionsToConditioning_ADV_weight_interpretation: Enum_BNK_CutoffRegionsToConditioning_ADV_weight_interpretation } // prettier-ignore
export interface HasSingle_Enum_ClipSeg_device { _Enum_ClipSeg_device: Enum_ClipSeg_device } // prettier-ignore
export interface HasSingle_Enum_ClipSeg_mode { _Enum_ClipSeg_mode: Enum_ClipSeg_mode } // prettier-ignore
export interface HasSingle_Enum_HEDPreprocessor_version { _Enum_HEDPreprocessor_version: Enum_HEDPreprocessor_version } // prettier-ignore
export interface HasSingle_Enum_KSamplerEfficient_sampler_state { _Enum_KSamplerEfficient_sampler_state: Enum_KSamplerEfficient_sampler_state } // prettier-ignore
export interface HasSingle_Enum_KSamplerEfficient_preview_image { _Enum_KSamplerEfficient_preview_image: Enum_KSamplerEfficient_preview_image } // prettier-ignore
export interface HasSingle_Enum_EfficientLoader_vae_name { _Enum_EfficientLoader_vae_name: Enum_EfficientLoader_vae_name } // prettier-ignore
export interface HasSingle_Enum_EfficientLoader_lora_name { _Enum_EfficientLoader_lora_name: Enum_EfficientLoader_lora_name } // prettier-ignore
export interface HasSingle_Enum_XYPlot_X_type { _Enum_XYPlot_X_type: Enum_XYPlot_X_type } // prettier-ignore
export interface HasSingle_Enum_ImageOverlay_overlay_resize { _Enum_ImageOverlay_overlay_resize: Enum_ImageOverlay_overlay_resize } // prettier-ignore
export interface HasSingle_Enum_WASImageFlip_mode { _Enum_WASImageFlip_mode: Enum_WASImageFlip_mode } // prettier-ignore
export interface HasSingle_Enum_WASConstantNumber_number_type { _Enum_WASConstantNumber_number_type: Enum_WASConstantNumber_number_type } // prettier-ignore
export interface HasSingle_Enum_WASCreateGridImage_include_subfolders { _Enum_WASCreateGridImage_include_subfolders: Enum_WASCreateGridImage_include_subfolders } // prettier-ignore
export interface HasSingle_Enum_WASCreateMorphImage_filetype { _Enum_WASCreateMorphImage_filetype: Enum_WASCreateMorphImage_filetype } // prettier-ignore
export interface HasSingle_Enum_WASCreateVideoFromPath_codec { _Enum_WASCreateVideoFromPath_codec: Enum_WASCreateVideoFromPath_codec } // prettier-ignore
export interface HasSingle_Enum_WASImageAnalyze_mode { _Enum_WASImageAnalyze_mode: Enum_WASImageAnalyze_mode } // prettier-ignore
export interface HasSingle_Enum_WASImageBlendingMode_mode { _Enum_WASImageBlendingMode_mode: Enum_WASImageBlendingMode_mode } // prettier-ignore
export interface HasSingle_Enum_WASImageCropFace_cascade_xml { _Enum_WASImageCropFace_cascade_xml: Enum_WASImageCropFace_cascade_xml } // prettier-ignore
export interface HasSingle_Enum_WASImageEdgeDetectionFilter_mode { _Enum_WASImageEdgeDetectionFilter_mode: Enum_WASImageEdgeDetectionFilter_mode } // prettier-ignore
export interface HasSingle_Enum_WASImageHistoryLoader_image { _Enum_WASImageHistoryLoader_image: Enum_WASImageHistoryLoader_image } // prettier-ignore
export interface HasSingle_Enum_WASImageMonitorEffectsFilter_mode { _Enum_WASImageMonitorEffectsFilter_mode: Enum_WASImageMonitorEffectsFilter_mode } // prettier-ignore
export interface HasSingle_Enum_WASImageRemoveBackgroundAlpha_mode { _Enum_WASImageRemoveBackgroundAlpha_mode: Enum_WASImageRemoveBackgroundAlpha_mode } // prettier-ignore
export interface HasSingle_Enum_WASImageResize_mode { _Enum_WASImageResize_mode: Enum_WASImageResize_mode } // prettier-ignore
export interface HasSingle_Enum_WASImageResize_resampling { _Enum_WASImageResize_resampling: Enum_WASImageResize_resampling } // prettier-ignore
export interface HasSingle_Enum_WASImageRotate_mode { _Enum_WASImageRotate_mode: Enum_WASImageRotate_mode } // prettier-ignore
export interface HasSingle_Enum_WASImageRotate_sampler { _Enum_WASImageRotate_sampler: Enum_WASImageRotate_sampler } // prettier-ignore
export interface HasSingle_Enum_WASImageSave_extension { _Enum_WASImageSave_extension: Enum_WASImageSave_extension } // prettier-ignore
export interface HasSingle_Enum_WASImageSave_overwrite_mode { _Enum_WASImageSave_overwrite_mode: Enum_WASImageSave_overwrite_mode } // prettier-ignore
export interface HasSingle_Enum_WASImageSelectChannel_channel { _Enum_WASImageSelectChannel_channel: Enum_WASImageSelectChannel_channel } // prettier-ignore
export interface HasSingle_Enum_WASImageStitch_stitch { _Enum_WASImageStitch_stitch: Enum_WASImageStitch_stitch } // prettier-ignore
export interface HasSingle_Enum_WASImageStyleFilter_style { _Enum_WASImageStyleFilter_style: Enum_WASImageStyleFilter_style } // prettier-ignore
export interface HasSingle_Enum_WASImageFDOFFilter_mode { _Enum_WASImageFDOFFilter_mode: Enum_WASImageFDOFFilter_mode } // prettier-ignore
export interface HasSingle_Enum_WASLatentUpscaleByFactorWAS_mode { _Enum_WASLatentUpscaleByFactorWAS_mode: Enum_WASLatentUpscaleByFactorWAS_mode } // prettier-ignore
export interface HasSingle_Enum_WASLoadImageBatch_mode { _Enum_WASLoadImageBatch_mode: Enum_WASLoadImageBatch_mode } // prettier-ignore
export interface HasSingle_Enum_WASMiDaSDepthApproximation_midas_model { _Enum_WASMiDaSDepthApproximation_midas_model: Enum_WASMiDaSDepthApproximation_midas_model } // prettier-ignore
export interface HasSingle_Enum_WASMiDaSMaskImage_remove { _Enum_WASMiDaSMaskImage_remove: Enum_WASMiDaSMaskImage_remove } // prettier-ignore
export interface HasSingle_Enum_WASNumberOperation_operation { _Enum_WASNumberOperation_operation: Enum_WASNumberOperation_operation } // prettier-ignore
export interface HasSingle_Enum_WASNumberInputCondition_comparison { _Enum_WASNumberInputCondition_comparison: Enum_WASNumberInputCondition_comparison } // prettier-ignore
export interface HasSingle_Enum_WASPromptStylesSelector_style { _Enum_WASPromptStylesSelector_style: Enum_WASPromptStylesSelector_style } // prettier-ignore
export interface HasSingle_Enum_WASBLIPAnalyzeImage_mode { _Enum_WASBLIPAnalyzeImage_mode: Enum_WASBLIPAnalyzeImage_mode } // prettier-ignore
export interface HasSingle_Enum_WASSAMModelLoader_model_size { _Enum_WASSAMModelLoader_model_size: Enum_WASSAMModelLoader_model_size } // prettier-ignore
export interface HasSingle_Enum_WASTextFileHistoryLoader_file { _Enum_WASTextFileHistoryLoader_file: Enum_WASTextFileHistoryLoader_file } // prettier-ignore
export interface HasSingle_Enum_WASUpscaleModelLoader_model_name { _Enum_WASUpscaleModelLoader_model_name: Enum_WASUpscaleModelLoader_model_name } // prettier-ignore
export interface HasSingle_Enum_ImageBlend_blend_mode { _Enum_ImageBlend_blend_mode: Enum_ImageBlend_blend_mode } // prettier-ignore
export interface HasSingle_Enum_ImageQuantize_dither { _Enum_ImageQuantize_dither: Enum_ImageQuantize_dither } // prettier-ignore
export interface HasSingle_Enum_MaskComposite_operation { _Enum_MaskComposite_operation: Enum_MaskComposite_operation } // prettier-ignore

// NODES -------------------------------
// |=============================================================================|
// | KSampler                                                                    |
// |=============================================================================|
export interface KSampler extends HasSingle_LATENT, ComfyNode<KSampler_input> {
    LATENT: Slot<'LATENT', 0>
}
export type KSampler_input = {
    model: MODEL | HasSingle_MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name | HasSingle_Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler | HasSingle_Enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    latent_image: LATENT | HasSingle_LATENT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: FLOAT
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
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name | HasSingle_Enum_CheckpointLoaderSimple_ckpt_name
}

// |=============================================================================|
// | CLIPTextEncode                                                              |
// |=============================================================================|
export interface CLIPTextEncode extends HasSingle_CONDITIONING, ComfyNode<CLIPTextEncode_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type CLIPTextEncode_input = {
    /** */
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
    /** default=-1 min=-1 max=-1 step=1 */
    stop_at_clip_layer?: INT
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
    /** default=512 min=8192 max=8192 step=64 */
    width?: INT
    /** default=512 min=8192 max=8192 step=64 */
    height?: INT
    /** default=1 min=64 max=64 */
    batch_size?: INT
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
    /** default=512 min=8192 max=8192 step=64 */
    width?: INT
    /** default=512 min=8192 max=8192 step=64 */
    height?: INT
    crop: Enum_LatentUpscale_crop | HasSingle_Enum_LatentUpscale_crop
}

// |=============================================================================|
// | LatentFromBatch                                                             |
// |=============================================================================|
export interface LatentFromBatch extends HasSingle_LATENT, ComfyNode<LatentFromBatch_input> {
    LATENT: Slot<'LATENT', 0>
}
export type LatentFromBatch_input = {
    samples: LATENT | HasSingle_LATENT
    /** default=0 min=63 max=63 */
    batch_index?: INT
}

// |=============================================================================|
// | SaveImage                                                                   |
// |=============================================================================|
export interface SaveImage extends ComfyNode<SaveImage_input> {}
export type SaveImage_input = {
    images: IMAGE | HasSingle_IMAGE
    /** default="ComfyUI" */
    filename_prefix?: STRING
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
    /** default=512 min=8192 max=8192 step=1 */
    width?: INT
    /** default=512 min=8192 max=8192 step=1 */
    height?: INT
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
    /** default=0 min=8192 max=8192 step=64 */
    left?: INT
    /** default=0 min=8192 max=8192 step=64 */
    top?: INT
    /** default=0 min=8192 max=8192 step=64 */
    right?: INT
    /** default=0 min=8192 max=8192 step=64 */
    bottom?: INT
    /** default=40 min=8192 max=8192 step=1 */
    feathering?: INT
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
    /** default=64 min=8192 max=8192 step=64 */
    width?: INT
    /** default=64 min=8192 max=8192 step=64 */
    height?: INT
    /** default=0 min=8192 max=8192 step=64 */
    x?: INT
    /** default=0 min=8192 max=8192 step=64 */
    y?: INT
    /** default=1 min=10 max=10 step=0.01 */
    strength?: FLOAT
}

// |=============================================================================|
// | ConditioningSetMask                                                         |
// |=============================================================================|
export interface ConditioningSetMask extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetMask_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type ConditioningSetMask_input = {
    conditioning: CONDITIONING | HasSingle_CONDITIONING
    mask: MASK | HasSingle_MASK
    /** default=1 min=10 max=10 step=0.01 */
    strength?: FLOAT
    set_cond_area: Enum_ConditioningSetMask_set_cond_area | HasSingle_Enum_ConditioningSetMask_set_cond_area
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
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    noise_seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name | HasSingle_Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler | HasSingle_Enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    latent_image: LATENT | HasSingle_LATENT
    /** default=0 min=10000 max=10000 */
    start_at_step?: INT
    /** default=10000 min=10000 max=10000 */
    end_at_step?: INT
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
    /** default=0 min=8192 max=8192 step=8 */
    x?: INT
    /** default=0 min=8192 max=8192 step=8 */
    y?: INT
    /** default=0 min=8192 max=8192 step=8 */
    feather?: INT
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
    /** default=512 min=8192 max=8192 step=64 */
    width?: INT
    /** default=512 min=8192 max=8192 step=64 */
    height?: INT
    /** default=0 min=8192 max=8192 step=8 */
    x?: INT
    /** default=0 min=8192 max=8192 step=8 */
    y?: INT
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
    /** default=1 min=10 max=10 step=0.01 */
    strength_model?: FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    strength_clip?: FLOAT
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
// | UnCLIPConditioning                                                          |
// |=============================================================================|
export interface UnCLIPConditioning extends HasSingle_CONDITIONING, ComfyNode<UnCLIPConditioning_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type UnCLIPConditioning_input = {
    conditioning: CONDITIONING | HasSingle_CONDITIONING
    clip_vision_output: CLIP_VISION_OUTPUT | HasSingle_CLIP_VISION_OUTPUT
    /** default=1 min=10 max=10 step=0.01 */
    strength?: FLOAT
    /** default=0 min=1 max=1 step=0.01 */
    noise_augmentation?: FLOAT
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
    /** default=1 min=10 max=10 step=0.01 */
    strength?: FLOAT
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
    /** default=0.3 min=1 max=1 step=0.01 */
    ratio?: FLOAT
}

// |=============================================================================|
// | UnCLIPCheckpointLoader                                                      |
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
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name | HasSingle_Enum_CheckpointLoaderSimple_ckpt_name
}

// |=============================================================================|
// | GLIGENLoader                                                                |
// |=============================================================================|
export interface GLIGENLoader extends HasSingle_GLIGEN, ComfyNode<GLIGENLoader_input> {
    GLIGEN: Slot<'GLIGEN', 0>
}
export type GLIGENLoader_input = {
    gligen_name: Enum_CLIPLoader_clip_name | HasSingle_Enum_CLIPLoader_clip_name
}

// |=============================================================================|
// | GLIGENTextBoxApply                                                          |
// |=============================================================================|
export interface GLIGENTextBoxApply extends HasSingle_CONDITIONING, ComfyNode<GLIGENTextBoxApply_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type GLIGENTextBoxApply_input = {
    conditioning_to: CONDITIONING | HasSingle_CONDITIONING
    clip: CLIP | HasSingle_CLIP
    gligen_textbox_model: GLIGEN | HasSingle_GLIGEN
    /** */
    text: STRING
    /** default=64 min=8192 max=8192 step=8 */
    width?: INT
    /** default=64 min=8192 max=8192 step=8 */
    height?: INT
    /** default=0 min=8192 max=8192 step=8 */
    x?: INT
    /** default=0 min=8192 max=8192 step=8 */
    y?: INT
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
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name | HasSingle_Enum_CheckpointLoaderSimple_ckpt_name
}

// |=============================================================================|
// | DiffusersLoader                                                             |
// |=============================================================================|
export interface DiffusersLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<DiffusersLoader_input> {
    MODEL: Slot<'MODEL', 0>
    CLIP: Slot<'CLIP', 1>
    VAE: Slot<'VAE', 2>
}
export type DiffusersLoader_input = {
    model_path: Enum_CLIPLoader_clip_name | HasSingle_Enum_CLIPLoader_clip_name
}

// |=============================================================================|
// | BrightnessContrast                                                          |
// |=============================================================================|
export interface BrightnessContrast extends HasSingle_IMAGE, ComfyNode<BrightnessContrast_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type BrightnessContrast_input = {
    image: IMAGE | HasSingle_IMAGE
    mode: Enum_BrightnessContrast_mode | HasSingle_Enum_BrightnessContrast_mode
    /** default=0.5 min=1 max=1 step=0.01 */
    strength?: FLOAT
}

// |=============================================================================|
// | ImpactMMDetLoader                                                           |
// |=============================================================================|
export interface ImpactMMDetLoader extends HasSingle_BBOX_MODEL, HasSingle_SEGM_MODEL, ComfyNode<ImpactMMDetLoader_input> {
    BBOX_MODEL: Slot<'BBOX_MODEL', 0>
    SEGM_MODEL: Slot<'SEGM_MODEL', 1>
}
export type ImpactMMDetLoader_input = {
    model_name: Enum_ImpactMMDetLoader_model_name | HasSingle_Enum_ImpactMMDetLoader_model_name
}

// |=============================================================================|
// | ImpactSAMLoader                                                             |
// |=============================================================================|
export interface ImpactSAMLoader extends HasSingle_SAM_MODEL, ComfyNode<ImpactSAMLoader_input> {
    SAM_MODEL: Slot<'SAM_MODEL', 0>
}
export type ImpactSAMLoader_input = {
    model_name: Enum_ImpactSAMLoader_model_name | HasSingle_Enum_ImpactSAMLoader_model_name
}

// |=============================================================================|
// | ImpactONNXLoader                                                            |
// |=============================================================================|
export interface ImpactONNXLoader extends HasSingle_ONNX_MODEL, ComfyNode<ImpactONNXLoader_input> {
    ONNX_MODEL: Slot<'ONNX_MODEL', 0>
}
export type ImpactONNXLoader_input = {
    model_name: Enum_CLIPLoader_clip_name | HasSingle_Enum_CLIPLoader_clip_name
}

// |=============================================================================|
// | ImpactBboxDetectorForEach                                                   |
// |=============================================================================|
export interface ImpactBboxDetectorForEach extends HasSingle_SEGS, ComfyNode<ImpactBboxDetectorForEach_input> {
    SEGS: Slot<'SEGS', 0>
}
export type ImpactBboxDetectorForEach_input = {
    bbox_model: BBOX_MODEL | HasSingle_BBOX_MODEL
    image: IMAGE | HasSingle_IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    threshold?: FLOAT
    /** default=10 min=255 max=255 step=1 */
    dilation?: INT
    /** default=3 min=10 max=10 step=0.1 */
    crop_factor?: FLOAT
}

// |=============================================================================|
// | ImpactSegmDetectorForEach                                                   |
// |=============================================================================|
export interface ImpactSegmDetectorForEach extends HasSingle_SEGS, ComfyNode<ImpactSegmDetectorForEach_input> {
    SEGS: Slot<'SEGS', 0>
}
export type ImpactSegmDetectorForEach_input = {
    segm_model: SEGM_MODEL | HasSingle_SEGM_MODEL
    image: IMAGE | HasSingle_IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    threshold?: FLOAT
    /** default=10 min=255 max=255 step=1 */
    dilation?: INT
    /** default=3 min=10 max=10 step=0.1 */
    crop_factor?: FLOAT
}

// |=============================================================================|
// | ImpactONNXDetectorForEach                                                   |
// |=============================================================================|
export interface ImpactONNXDetectorForEach extends HasSingle_SEGS, ComfyNode<ImpactONNXDetectorForEach_input> {
    SEGS: Slot<'SEGS', 0>
}
export type ImpactONNXDetectorForEach_input = {
    onnx_model: ONNX_MODEL | HasSingle_ONNX_MODEL
    image: IMAGE | HasSingle_IMAGE
    /** default=0.8 min=1 max=1 step=0.01 */
    threshold?: FLOAT
    /** default=1 min=10 max=10 step=0.1 */
    crop_factor?: FLOAT
}

// |=============================================================================|
// | ImpactBitwiseAndMaskForEach                                                 |
// |=============================================================================|
export interface ImpactBitwiseAndMaskForEach extends HasSingle_SEGS, ComfyNode<ImpactBitwiseAndMaskForEach_input> {
    SEGS: Slot<'SEGS', 0>
}
export type ImpactBitwiseAndMaskForEach_input = {
    base_segs: SEGS | HasSingle_SEGS
    mask_segs: SEGS | HasSingle_SEGS
}

// |=============================================================================|
// | ImpactDetailerForEach                                                       |
// |=============================================================================|
export interface ImpactDetailerForEach extends HasSingle_IMAGE, ComfyNode<ImpactDetailerForEach_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImpactDetailerForEach_input = {
    image: IMAGE | HasSingle_IMAGE
    segs: SEGS | HasSingle_SEGS
    model: MODEL | HasSingle_MODEL
    vae: VAE | HasSingle_VAE
    /** default=256 min=8192 max=8192 step=64 */
    guide_size?: FLOAT
    guide_size_for: Enum_ImpactDetailerForEach_guide_size_for | HasSingle_Enum_ImpactDetailerForEach_guide_size_for
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name | HasSingle_Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler | HasSingle_Enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: INT
    noise_mask: Enum_ImpactDetailerForEach_noise_mask | HasSingle_Enum_ImpactDetailerForEach_noise_mask
    force_inpaint: Enum_ImpactDetailerForEach_noise_mask | HasSingle_Enum_ImpactDetailerForEach_noise_mask
}

// |=============================================================================|
// | ImpactDetailerForEachDebug                                                  |
// |=============================================================================|
export interface ImpactDetailerForEachDebug extends ComfyNode<ImpactDetailerForEachDebug_input> {
    IMAGE: Slot<'IMAGE', 0>
    IMAGE_1: Slot<'IMAGE', 1>
    IMAGE_2: Slot<'IMAGE', 2>
}
export type ImpactDetailerForEachDebug_input = {
    image: IMAGE | HasSingle_IMAGE
    segs: SEGS | HasSingle_SEGS
    model: MODEL | HasSingle_MODEL
    vae: VAE | HasSingle_VAE
    /** default=256 min=8192 max=8192 step=64 */
    guide_size?: FLOAT
    guide_size_for: Enum_ImpactDetailerForEach_guide_size_for | HasSingle_Enum_ImpactDetailerForEach_guide_size_for
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name | HasSingle_Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler | HasSingle_Enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: INT
    noise_mask: Enum_ImpactDetailerForEach_noise_mask | HasSingle_Enum_ImpactDetailerForEach_noise_mask
    force_inpaint: Enum_ImpactDetailerForEach_noise_mask | HasSingle_Enum_ImpactDetailerForEach_noise_mask
}

// |=============================================================================|
// | ImpactBboxDetectorCombined                                                  |
// |=============================================================================|
export interface ImpactBboxDetectorCombined extends HasSingle_MASK, ComfyNode<ImpactBboxDetectorCombined_input> {
    MASK: Slot<'MASK', 0>
}
export type ImpactBboxDetectorCombined_input = {
    bbox_model: BBOX_MODEL | HasSingle_BBOX_MODEL
    image: IMAGE | HasSingle_IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    threshold?: FLOAT
    /** default=4 min=255 max=255 step=1 */
    dilation?: INT
}

// |=============================================================================|
// | ImpactSegmDetectorCombined                                                  |
// |=============================================================================|
export interface ImpactSegmDetectorCombined extends HasSingle_MASK, ComfyNode<ImpactSegmDetectorCombined_input> {
    MASK: Slot<'MASK', 0>
}
export type ImpactSegmDetectorCombined_input = {
    segm_model: SEGM_MODEL | HasSingle_SEGM_MODEL
    image: IMAGE | HasSingle_IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    threshold?: FLOAT
    /** default=0 min=255 max=255 step=1 */
    dilation?: INT
}

// |=============================================================================|
// | ImpactSAMDetectorCombined                                                   |
// |=============================================================================|
export interface ImpactSAMDetectorCombined extends HasSingle_MASK, ComfyNode<ImpactSAMDetectorCombined_input> {
    MASK: Slot<'MASK', 0>
}
export type ImpactSAMDetectorCombined_input = {
    sam_model: SAM_MODEL | HasSingle_SAM_MODEL
    segs: SEGS | HasSingle_SEGS
    image: IMAGE | HasSingle_IMAGE
    detection_hint: Enum_ImpactSAMDetectorCombined_detection_hint | HasSingle_Enum_ImpactSAMDetectorCombined_detection_hint
    /** default=0 min=255 max=255 step=1 */
    dilation?: INT
    /** default=0.93 min=1 max=1 step=0.01 */
    threshold?: FLOAT
    /** default=0 min=1000 max=1000 step=1 */
    bbox_expansion?: INT
    /** default=0.7 min=1 max=1 step=0.01 */
    mask_hint_threshold?: FLOAT
    mask_hint_use_negative:
        | Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
        | HasSingle_Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
}

// |=============================================================================|
// | ImpactFaceDetailer                                                          |
// |=============================================================================|
export interface ImpactFaceDetailer
    extends HasSingle_IMAGE,
        HasSingle_MASK,
        HasSingle_DETAILER_PIPE,
        ComfyNode<ImpactFaceDetailer_input> {
    IMAGE: Slot<'IMAGE', 0>
    MASK: Slot<'MASK', 1>
    DETAILER_PIPE: Slot<'DETAILER_PIPE', 2>
}
export type ImpactFaceDetailer_input = {
    image: IMAGE | HasSingle_IMAGE
    model: MODEL | HasSingle_MODEL
    vae: VAE | HasSingle_VAE
    /** default=256 min=8192 max=8192 step=64 */
    guide_size?: FLOAT
    guide_size_for: Enum_ImpactDetailerForEach_guide_size_for | HasSingle_Enum_ImpactDetailerForEach_guide_size_for
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name | HasSingle_Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler | HasSingle_Enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: INT
    noise_mask: Enum_ImpactDetailerForEach_noise_mask | HasSingle_Enum_ImpactDetailerForEach_noise_mask
    force_inpaint: Enum_ImpactDetailerForEach_noise_mask | HasSingle_Enum_ImpactDetailerForEach_noise_mask
    /** default=0.5 min=1 max=1 step=0.01 */
    bbox_threshold?: FLOAT
    /** default=10 min=255 max=255 step=1 */
    bbox_dilation?: INT
    /** default=3 min=10 max=10 step=0.1 */
    bbox_crop_factor?: FLOAT
    sam_detection_hint: Enum_ImpactSAMDetectorCombined_detection_hint | HasSingle_Enum_ImpactSAMDetectorCombined_detection_hint
    /** default=0 min=255 max=255 step=1 */
    sam_dilation?: INT
    /** default=0.93 min=1 max=1 step=0.01 */
    sam_threshold?: FLOAT
    /** default=0 min=1000 max=1000 step=1 */
    sam_bbox_expansion?: INT
    /** default=0.7 min=1 max=1 step=0.01 */
    sam_mask_hint_threshold?: FLOAT
    sam_mask_hint_use_negative:
        | Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
        | HasSingle_Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
    bbox_model: BBOX_MODEL | HasSingle_BBOX_MODEL
    sam_model_opt?: SAM_MODEL | HasSingle_SAM_MODEL
}

// |=============================================================================|
// | ImpactFaceDetailerPipe                                                      |
// |=============================================================================|
export interface ImpactFaceDetailerPipe
    extends HasSingle_IMAGE,
        HasSingle_MASK,
        HasSingle_DETAILER_PIPE,
        ComfyNode<ImpactFaceDetailerPipe_input> {
    IMAGE: Slot<'IMAGE', 0>
    MASK: Slot<'MASK', 1>
    DETAILER_PIPE: Slot<'DETAILER_PIPE', 2>
}
export type ImpactFaceDetailerPipe_input = {
    image: IMAGE | HasSingle_IMAGE
    detailer_pipe: DETAILER_PIPE | HasSingle_DETAILER_PIPE
    /** default=256 min=8192 max=8192 step=64 */
    guide_size?: FLOAT
    guide_size_for: Enum_ImpactDetailerForEach_guide_size_for | HasSingle_Enum_ImpactDetailerForEach_guide_size_for
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name | HasSingle_Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler | HasSingle_Enum_KSampler_scheduler
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: INT
    noise_mask: Enum_ImpactDetailerForEach_noise_mask | HasSingle_Enum_ImpactDetailerForEach_noise_mask
    force_inpaint: Enum_ImpactDetailerForEach_noise_mask | HasSingle_Enum_ImpactDetailerForEach_noise_mask
    /** default=0.5 min=1 max=1 step=0.01 */
    bbox_threshold?: FLOAT
    /** default=10 min=255 max=255 step=1 */
    bbox_dilation?: INT
    /** default=3 min=10 max=10 step=0.1 */
    bbox_crop_factor?: FLOAT
    sam_detection_hint: Enum_ImpactSAMDetectorCombined_detection_hint | HasSingle_Enum_ImpactSAMDetectorCombined_detection_hint
    /** default=0 min=255 max=255 step=1 */
    sam_dilation?: INT
    /** default=0.93 min=1 max=1 step=0.01 */
    sam_threshold?: FLOAT
    /** default=0 min=1000 max=1000 step=1 */
    sam_bbox_expansion?: INT
    /** default=0.7 min=1 max=1 step=0.01 */
    sam_mask_hint_threshold?: FLOAT
    sam_mask_hint_use_negative:
        | Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
        | HasSingle_Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
}

// |=============================================================================|
// | ImpactBitwiseAndMask                                                        |
// |=============================================================================|
export interface ImpactBitwiseAndMask extends HasSingle_MASK, ComfyNode<ImpactBitwiseAndMask_input> {
    MASK: Slot<'MASK', 0>
}
export type ImpactBitwiseAndMask_input = {
    mask1: MASK | HasSingle_MASK
    mask2: MASK | HasSingle_MASK
}

// |=============================================================================|
// | ImpactSubtractMask                                                          |
// |=============================================================================|
export interface ImpactSubtractMask extends HasSingle_MASK, ComfyNode<ImpactSubtractMask_input> {
    MASK: Slot<'MASK', 0>
}
export type ImpactSubtractMask_input = {
    mask1: MASK | HasSingle_MASK
    mask2: MASK | HasSingle_MASK
}

// |=============================================================================|
// | ImpactSegsMask                                                              |
// |=============================================================================|
export interface ImpactSegsMask extends HasSingle_SEGS, ComfyNode<ImpactSegsMask_input> {
    SEGS: Slot<'SEGS', 0>
}
export type ImpactSegsMask_input = {
    segs: SEGS | HasSingle_SEGS
    mask: MASK | HasSingle_MASK
}

// |=============================================================================|
// | ImpactSegsMaskCombine                                                       |
// |=============================================================================|
export interface ImpactSegsMaskCombine extends HasSingle_MASK, ComfyNode<ImpactSegsMaskCombine_input> {
    MASK: Slot<'MASK', 0>
}
export type ImpactSegsMaskCombine_input = {
    segs: SEGS | HasSingle_SEGS
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | ImpactEmptySegs                                                             |
// |=============================================================================|
export interface ImpactEmptySegs extends HasSingle_SEGS, ComfyNode<ImpactEmptySegs_input> {
    SEGS: Slot<'SEGS', 0>
}
export type ImpactEmptySegs_input = {}

// |=============================================================================|
// | ImpactMaskToSEGS                                                            |
// |=============================================================================|
export interface ImpactMaskToSEGS extends HasSingle_SEGS, ComfyNode<ImpactMaskToSEGS_input> {
    SEGS: Slot<'SEGS', 0>
}
export type ImpactMaskToSEGS_input = {
    mask: MASK | HasSingle_MASK
    combined: Enum_ImpactMaskToSEGS_combined | HasSingle_Enum_ImpactMaskToSEGS_combined
    /** default=3 min=10 max=10 step=0.1 */
    crop_factor?: FLOAT
}

// |=============================================================================|
// | ImpactToBinaryMask                                                          |
// |=============================================================================|
export interface ImpactToBinaryMask extends HasSingle_MASK, ComfyNode<ImpactToBinaryMask_input> {
    MASK: Slot<'MASK', 0>
}
export type ImpactToBinaryMask_input = {
    mask: MASK | HasSingle_MASK
}

// |=============================================================================|
// | ImpactMaskPainter                                                           |
// |=============================================================================|
export interface ImpactMaskPainter extends HasSingle_MASK, ComfyNode<ImpactMaskPainter_input> {
    MASK: Slot<'MASK', 0>
}
export type ImpactMaskPainter_input = {
    images: IMAGE | HasSingle_IMAGE
    mask_image?: IMAGE_PATH | HasSingle_IMAGE_PATH
}

// |=============================================================================|
// | RandomLatentImage                                                           |
// |=============================================================================|
export interface RandomLatentImage extends HasSingle_LATENT, ComfyNode<RandomLatentImage_input> {
    LATENT: Slot<'LATENT', 0>
}
export type RandomLatentImage_input = {
    /** default=512 min=4096 max=4096 step=64 */
    width?: INT
    /** default=512 min=4096 max=4096 step=64 */
    height?: INT
    /** default=1 min=64 max=64 */
    batch_size?: INT
}

// |=============================================================================|
// | VAEDecodeBatched                                                            |
// |=============================================================================|
export interface VAEDecodeBatched extends HasSingle_IMAGE, ComfyNode<VAEDecodeBatched_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type VAEDecodeBatched_input = {
    samples: LATENT | HasSingle_LATENT
    vae: VAE | HasSingle_VAE
    /** default=1 min=32 max=32 step=1 */
    batch_size?: INT
}

// |=============================================================================|
// | VAEEncodeBatched                                                            |
// |=============================================================================|
export interface VAEEncodeBatched extends HasSingle_LATENT, ComfyNode<VAEEncodeBatched_input> {
    LATENT: Slot<'LATENT', 0>
}
export type VAEEncodeBatched_input = {
    pixels: IMAGE | HasSingle_IMAGE
    vae: VAE | HasSingle_VAE
    /** default=1 min=32 max=32 step=1 */
    batch_size?: INT
}

// |=============================================================================|
// | LatentToImage                                                               |
// |=============================================================================|
export interface LatentToImage extends HasSingle_IMAGE, ComfyNode<LatentToImage_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type LatentToImage_input = {
    samples: LATENT | HasSingle_LATENT
    /** default=5 min=100 max=100 step=0.01 */
    clamp?: FLOAT
}

// |=============================================================================|
// | LatentToHist                                                                |
// |=============================================================================|
export interface LatentToHist extends HasSingle_IMAGE, HasSingle_STRING, ComfyNode<LatentToHist_input> {
    IMAGE: Slot<'IMAGE', 0>
    STRING: Slot<'STRING', 1>
}
export type LatentToHist_input = {
    samples: LATENT | HasSingle_LATENT
    min_auto: Enum_LatentToHist_min_auto | HasSingle_Enum_LatentToHist_min_auto
    /** default=-5 min=0 max=0 step=0.01 */
    min_value?: FLOAT
    max_auto: Enum_LatentToHist_min_auto | HasSingle_Enum_LatentToHist_min_auto
    /** default=5 min=100 max=100 step=0.01 */
    max_value?: FLOAT
    bin_auto: Enum_LatentToHist_min_auto | HasSingle_Enum_LatentToHist_min_auto
    /** default=10 min=1000 max=1000 step=1 */
    bin_count?: INT
    ymax_auto: Enum_LatentToHist_min_auto | HasSingle_Enum_LatentToHist_min_auto
    /** default=1 min=1 max=1 step=0.01 */
    ymax?: FLOAT
}

// |=============================================================================|
// | KSamplerSetting                                                             |
// |=============================================================================|
export interface KSamplerSetting extends HasSingle_DICT, ComfyNode<KSamplerSetting_input> {
    DICT: Slot<'DICT', 0>
}
export type KSamplerSetting_input = {
    model: MODEL | HasSingle_MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name | HasSingle_Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler | HasSingle_Enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    latent_image: LATENT | HasSingle_LATENT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: FLOAT
}

// |=============================================================================|
// | KSamplerOverrided                                                           |
// |=============================================================================|
export interface KSamplerOverrided extends HasSingle_LATENT, ComfyNode<KSamplerOverrided_input> {
    LATENT: Slot<'LATENT', 0>
}
export type KSamplerOverrided_input = {
    setting: DICT | HasSingle_DICT
    model?: MODEL | HasSingle_MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: Integer | HasSingle_Integer
    /** default=20 min=10000 max=10000 */
    steps?: Integer | HasSingle_Integer
    /** default=8 min=100 max=100 */
    cfg?: Float | HasSingle_Float
    sampler_name?: SamplerName | HasSingle_SamplerName
    scheduler?: SchedulerName | HasSingle_SchedulerName
    positive?: CONDITIONING | HasSingle_CONDITIONING
    negative?: CONDITIONING | HasSingle_CONDITIONING
    latent_image?: LATENT | HasSingle_LATENT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: Float | HasSingle_Float
}

// |=============================================================================|
// | KSamplerXYZ                                                                 |
// |=============================================================================|
export interface KSamplerXYZ extends HasSingle_LATENT, ComfyNode<KSamplerXYZ_input> {
    LATENT: Slot<'LATENT', 0>
}
export type KSamplerXYZ_input = {
    setting: DICT | HasSingle_DICT
    model?: MODEL | HasSingle_MODEL
    /** default="" */
    seed?: STRING
    /** default="" */
    steps?: STRING
    /** default="" */
    cfg?: STRING
    /** default="" */
    sampler_name?: STRING
    /** default="" */
    scheduler?: STRING
}

// |=============================================================================|
// | StateDictLoader                                                             |
// |=============================================================================|
export interface StateDictLoader extends HasSingle_DICT, ComfyNode<StateDictLoader_input> {
    DICT: Slot<'DICT', 0>
}
export type StateDictLoader_input = {
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name | HasSingle_Enum_CheckpointLoaderSimple_ckpt_name
}

// |=============================================================================|
// | Dict2Model                                                                  |
// |=============================================================================|
export interface Dict2Model extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_VAE, ComfyNode<Dict2Model_input> {
    MODEL: Slot<'MODEL', 0>
    CLIP: Slot<'CLIP', 1>
    VAE: Slot<'VAE', 2>
}
export type Dict2Model_input = {
    weights: DICT | HasSingle_DICT
    config_name: Enum_CheckpointLoader_config_name | HasSingle_Enum_CheckpointLoader_config_name
}

// |=============================================================================|
// | ModelIter                                                                   |
// |=============================================================================|
export interface ModelIter extends HasSingle_MODEL, ComfyNode<ModelIter_input> {
    MODEL: Slot<'MODEL', 0>
}
export type ModelIter_input = {
    model1: MODEL | HasSingle_MODEL
    model2: MODEL | HasSingle_MODEL
}

// |=============================================================================|
// | CLIPIter                                                                    |
// |=============================================================================|
export interface CLIPIter extends HasSingle_CLIP, ComfyNode<CLIPIter_input> {
    CLIP: Slot<'CLIP', 0>
}
export type CLIPIter_input = {
    clip1: CLIP | HasSingle_CLIP
    clip2: CLIP | HasSingle_CLIP
}

// |=============================================================================|
// | VAEIter                                                                     |
// |=============================================================================|
export interface VAEIter extends HasSingle_VAE, ComfyNode<VAEIter_input> {
    VAE: Slot<'VAE', 0>
}
export type VAEIter_input = {
    vae1: VAE | HasSingle_VAE
    vae2: VAE | HasSingle_VAE
}

// |=============================================================================|
// | StateDictMerger                                                             |
// |=============================================================================|
export interface StateDictMerger extends HasSingle_DICT, ComfyNode<StateDictMerger_input> {
    DICT: Slot<'DICT', 0>
}
export type StateDictMerger_input = {
    model_A: DICT | HasSingle_DICT
    model_B: DICT | HasSingle_DICT
    /** default=0 min=2 max=2 step=0.001 */
    alpha?: FLOAT
    position_ids: Enum_StateDictMerger_position_ids | HasSingle_Enum_StateDictMerger_position_ids
    half: Enum_ImpactMaskToSEGS_combined | HasSingle_Enum_ImpactMaskToSEGS_combined
    model_C?: DICT | HasSingle_DICT
}

// |=============================================================================|
// | StateDictMergerBlockWeighted                                                |
// |=============================================================================|
export interface StateDictMergerBlockWeighted extends HasSingle_DICT, ComfyNode<StateDictMergerBlockWeighted_input> {
    DICT: Slot<'DICT', 0>
}
export type StateDictMergerBlockWeighted_input = {
    model_A: DICT | HasSingle_DICT
    model_B: DICT | HasSingle_DICT
    position_ids: Enum_StateDictMerger_position_ids | HasSingle_Enum_StateDictMerger_position_ids
    half: Enum_ImpactMaskToSEGS_combined | HasSingle_Enum_ImpactMaskToSEGS_combined
    /** default=0 min=2 max=2 step=0.001 */
    base_alpha?: FLOAT
    /** default="" */
    alphas?: STRING
}

// |=============================================================================|
// | StateDictMergerBlockWeightedMulti                                           |
// |=============================================================================|
export interface StateDictMergerBlockWeightedMulti
    extends HasSingle_MODEL,
        HasSingle_CLIP,
        HasSingle_VAE,
        ComfyNode<StateDictMergerBlockWeightedMulti_input> {
    MODEL: Slot<'MODEL', 0>
    CLIP: Slot<'CLIP', 1>
    VAE: Slot<'VAE', 2>
}
export type StateDictMergerBlockWeightedMulti_input = {
    model_A: DICT | HasSingle_DICT
    model_B: DICT | HasSingle_DICT
    position_ids: Enum_StateDictMerger_position_ids | HasSingle_Enum_StateDictMerger_position_ids
    half: Enum_ImpactMaskToSEGS_combined | HasSingle_Enum_ImpactMaskToSEGS_combined
    /** default=0 min=2 max=2 step=0.001 */
    base_alpha?: FLOAT
    /** default="" */
    alphas?: STRING
    config_name: Enum_CheckpointLoader_config_name | HasSingle_Enum_CheckpointLoader_config_name
}

// |=============================================================================|
// | ImageBlend2                                                                 |
// |=============================================================================|
export interface ImageBlend2 extends HasSingle_IMAGE, ComfyNode<ImageBlend2_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageBlend2_input = {
    image1: IMAGE | HasSingle_IMAGE
    image2: IMAGE | HasSingle_IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    blend_factor?: FLOAT
    blend_mode: Enum_ImageBlend2_blend_mode | HasSingle_Enum_ImageBlend2_blend_mode
}

// |=============================================================================|
// | GridImage                                                                   |
// |=============================================================================|
export interface GridImage extends ComfyNode<GridImage_input> {}
export type GridImage_input = {
    images: IMAGE | HasSingle_IMAGE
    /** default="ComfyUI-Grid" */
    filename_prefix?: STRING
    /** default=1 min=64 max=64 step=1 */
    x?: INT
    /** default=0 min=32 max=32 step=1 */
    gap?: INT
}

// |=============================================================================|
// | SaveText                                                                    |
// |=============================================================================|
export interface SaveText extends ComfyNode<SaveText_input> {}
export type SaveText_input = {
    /** default="ComfyUI" */
    filename_prefix?: STRING
    /** default="txt" */
    ext?: STRING
    /** default="" */
    text?: STRING
}

// |=============================================================================|
// | BNK_CutoffBasePrompt                                                        |
// |=============================================================================|
export interface BNK_CutoffBasePrompt extends HasSingle_CLIPREGION, ComfyNode<BNK_CutoffBasePrompt_input> {
    CLIPREGION: Slot<'CLIPREGION', 0>
}
export type BNK_CutoffBasePrompt_input = {
    /** */
    text: STRING
    clip: CLIP | HasSingle_CLIP
}

// |=============================================================================|
// | BNK_CutoffSetRegions                                                        |
// |=============================================================================|
export interface BNK_CutoffSetRegions extends HasSingle_CLIPREGION, ComfyNode<BNK_CutoffSetRegions_input> {
    CLIPREGION: Slot<'CLIPREGION', 0>
}
export type BNK_CutoffSetRegions_input = {
    clip_regions: CLIPREGION | HasSingle_CLIPREGION
    /** */
    region_text: STRING
    /** */
    target_text: STRING
    /** default=1 min=10 max=10 step=0.05 */
    weight?: FLOAT
}

// |=============================================================================|
// | BNK_CutoffRegionsToConditioning                                             |
// |=============================================================================|
export interface BNK_CutoffRegionsToConditioning
    extends HasSingle_CONDITIONING,
        ComfyNode<BNK_CutoffRegionsToConditioning_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type BNK_CutoffRegionsToConditioning_input = {
    clip_regions: CLIPREGION | HasSingle_CLIPREGION
    /** default="" */
    mask_token?: STRING
    /** default=1 min=1 max=1 step=0.05 */
    strict_mask?: FLOAT
    /** default=1 min=1 max=1 step=0.05 */
    start_from_masked?: FLOAT
}

// |=============================================================================|
// | BNK_CutoffRegionsToConditioning_ADV                                         |
// |=============================================================================|
export interface BNK_CutoffRegionsToConditioning_ADV
    extends HasSingle_CONDITIONING,
        ComfyNode<BNK_CutoffRegionsToConditioning_ADV_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type BNK_CutoffRegionsToConditioning_ADV_input = {
    clip_regions: CLIPREGION | HasSingle_CLIPREGION
    /** default="" */
    mask_token?: STRING
    /** default=1 min=1 max=1 step=0.05 */
    strict_mask?: FLOAT
    /** default=1 min=1 max=1 step=0.05 */
    start_from_masked?: FLOAT
    token_normalization:
        | Enum_BNK_CutoffRegionsToConditioning_ADV_token_normalization
        | HasSingle_Enum_BNK_CutoffRegionsToConditioning_ADV_token_normalization
    weight_interpretation:
        | Enum_BNK_CutoffRegionsToConditioning_ADV_weight_interpretation
        | HasSingle_Enum_BNK_CutoffRegionsToConditioning_ADV_weight_interpretation
}

// |=============================================================================|
// | MultiLatentComposite                                                        |
// |=============================================================================|
export interface MultiLatentComposite extends HasSingle_LATENT, ComfyNode<MultiLatentComposite_input> {
    LATENT: Slot<'LATENT', 0>
}
export type MultiLatentComposite_input = {
    samples_to: LATENT | HasSingle_LATENT
    samples_from0: LATENT | HasSingle_LATENT
}

// |=============================================================================|
// | MultiAreaConditioning                                                       |
// |=============================================================================|
export interface MultiAreaConditioning extends HasSingle_CONDITIONING, ComfyNode<MultiAreaConditioning_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
    INT: Slot<'INT', 1>
    INT_1: Slot<'INT', 2>
}
export type MultiAreaConditioning_input = {
    conditioning0: CONDITIONING | HasSingle_CONDITIONING
    conditioning1: CONDITIONING | HasSingle_CONDITIONING
}

// |=============================================================================|
// | ConditioningUpscale                                                         |
// |=============================================================================|
export interface ConditioningUpscale extends HasSingle_CONDITIONING, ComfyNode<ConditioningUpscale_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type ConditioningUpscale_input = {
    conditioning: CONDITIONING | HasSingle_CONDITIONING
    /** default=2 min=100 max=100 step=0.5 */
    scalar?: INT
}

// |=============================================================================|
// | ConditioningStretch                                                         |
// |=============================================================================|
export interface ConditioningStretch extends HasSingle_CONDITIONING, ComfyNode<ConditioningStretch_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type ConditioningStretch_input = {
    conditioning: CONDITIONING | HasSingle_CONDITIONING
    /** default=512 min=8192 max=8192 step=64 */
    resolutionX?: INT
    /** default=512 min=8192 max=8192 step=64 */
    resolutionY?: INT
    /** default=512 min=8192 max=8192 step=64 */
    newWidth?: INT
    /** default=512 min=8192 max=8192 step=64 */
    newHeight?: INT
}

// |=============================================================================|
// | ClipSeg                                                                     |
// |=============================================================================|
export interface ClipSeg extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ClipSeg_input> {
    IMAGE: Slot<'IMAGE', 0>
    MASK: Slot<'MASK', 1>
}
export type ClipSeg_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default="hand, foot, face" */
    clip?: STRING
    /** default="cuda" */
    device?: Enum_ClipSeg_device | HasSingle_Enum_ClipSeg_device
    /** default=352 min=2048 max=2048 step=8 */
    width?: INT
    /** default=352 min=2048 max=2048 step=8 */
    height?: INT
    /** default=-1 min=255 max=255 step=1 */
    threshold?: INT
    /** default="sum" */
    mode?: Enum_ClipSeg_mode | HasSingle_Enum_ClipSeg_mode
}

// |=============================================================================|
// | CannyEdgePreprocessor                                                       |
// |=============================================================================|
export interface CannyEdgePreprocessor extends HasSingle_IMAGE, ComfyNode<CannyEdgePreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type CannyEdgePreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=100 min=255 max=255 step=1 */
    low_threshold?: INT
    /** default=200 min=255 max=255 step=1 */
    high_threshold?: INT
    /** default="disable" */
    l2gradient?: Enum_KSamplerAdvanced_add_noise | HasSingle_Enum_KSamplerAdvanced_add_noise
}

// |=============================================================================|
// | MLSDPreprocessor                                                            |
// |=============================================================================|
export interface MLSDPreprocessor extends HasSingle_IMAGE, ComfyNode<MLSDPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type MLSDPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=6.283185307179586 min=6.283185307179586 max=6.283185307179586 step=0.05 */
    score_threshold?: FLOAT
    /** default=0.05 min=1 max=1 step=0.05 */
    dist_threshold?: FLOAT
}

// |=============================================================================|
// | HEDPreprocessor                                                             |
// |=============================================================================|
export interface HEDPreprocessor extends HasSingle_IMAGE, ComfyNode<HEDPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type HEDPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default="v1.1" */
    version?: Enum_HEDPreprocessor_version | HasSingle_Enum_HEDPreprocessor_version
    /** default="enable" */
    safe?: Enum_KSamplerAdvanced_add_noise | HasSingle_Enum_KSamplerAdvanced_add_noise
}

// |=============================================================================|
// | ScribblePreprocessor                                                        |
// |=============================================================================|
export interface ScribblePreprocessor extends HasSingle_IMAGE, ComfyNode<ScribblePreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ScribblePreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | FakeScribblePreprocessor                                                    |
// |=============================================================================|
export interface FakeScribblePreprocessor extends HasSingle_IMAGE, ComfyNode<FakeScribblePreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type FakeScribblePreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | BinaryPreprocessor                                                          |
// |=============================================================================|
export interface BinaryPreprocessor extends HasSingle_IMAGE, ComfyNode<BinaryPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type BinaryPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=0 min=255 max=255 step=1 */
    threshold?: INT
}

// |=============================================================================|
// | PiDiNetPreprocessor                                                         |
// |=============================================================================|
export interface PiDiNetPreprocessor extends HasSingle_IMAGE, ComfyNode<PiDiNetPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type PiDiNetPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default="enable" */
    safe?: Enum_KSamplerAdvanced_add_noise | HasSingle_Enum_KSamplerAdvanced_add_noise
}

// |=============================================================================|
// | LineArtPreprocessor                                                         |
// |=============================================================================|
export interface LineArtPreprocessor extends HasSingle_IMAGE, ComfyNode<LineArtPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type LineArtPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default="disable" */
    coarse?: Enum_KSamplerAdvanced_add_noise | HasSingle_Enum_KSamplerAdvanced_add_noise
}

// |=============================================================================|
// | AnimeLineArtPreprocessor                                                    |
// |=============================================================================|
export interface AnimeLineArtPreprocessor extends HasSingle_IMAGE, ComfyNode<AnimeLineArtPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type AnimeLineArtPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | Manga2AnimeLineArtPreprocessor                                              |
// |=============================================================================|
export interface Manga2AnimeLineArtPreprocessor extends HasSingle_IMAGE, ComfyNode<Manga2AnimeLineArtPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type Manga2AnimeLineArtPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | MiDaSDepthMapPreprocessor                                                   |
// |=============================================================================|
export interface MiDaSDepthMapPreprocessor extends HasSingle_IMAGE, ComfyNode<MiDaSDepthMapPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type MiDaSDepthMapPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=6.283185307179586 min=15.707963267948966 max=15.707963267948966 step=0.05 */
    a?: FLOAT
    /** default=0.05 min=1 max=1 step=0.05 */
    bg_threshold?: FLOAT
}

// |=============================================================================|
// | MiDaSNormalMapPreprocessor                                                  |
// |=============================================================================|
export interface MiDaSNormalMapPreprocessor extends HasSingle_IMAGE, ComfyNode<MiDaSNormalMapPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type MiDaSNormalMapPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=6.283185307179586 min=15.707963267948966 max=15.707963267948966 step=0.05 */
    a?: FLOAT
    /** default=0.05 min=1 max=1 step=0.05 */
    bg_threshold?: FLOAT
}

// |=============================================================================|
// | LeReSDepthMapPreprocessor                                                   |
// |=============================================================================|
export interface LeReSDepthMapPreprocessor extends HasSingle_IMAGE, ComfyNode<LeReSDepthMapPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type LeReSDepthMapPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=0 min=1 max=1 step=0.05 */
    rm_nearest?: FLOAT
    /** default=0 min=1 max=1 step=0.05 */
    rm_background?: FLOAT
}

// |=============================================================================|
// | ZoeDepthMapPreprocessor                                                     |
// |=============================================================================|
export interface ZoeDepthMapPreprocessor extends HasSingle_IMAGE, ComfyNode<ZoeDepthMapPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ZoeDepthMapPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | BAENormalMapPreprocessor                                                    |
// |=============================================================================|
export interface BAENormalMapPreprocessor extends HasSingle_IMAGE, ComfyNode<BAENormalMapPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type BAENormalMapPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | OpenposePreprocessor                                                        |
// |=============================================================================|
export interface OpenposePreprocessor extends HasSingle_IMAGE, ComfyNode<OpenposePreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type OpenposePreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default="enable" */
    detect_hand?: Enum_KSamplerAdvanced_add_noise | HasSingle_Enum_KSamplerAdvanced_add_noise
    /** default="enable" */
    detect_body?: Enum_KSamplerAdvanced_add_noise | HasSingle_Enum_KSamplerAdvanced_add_noise
    /** default="enable" */
    detect_face?: Enum_KSamplerAdvanced_add_noise | HasSingle_Enum_KSamplerAdvanced_add_noise
    /** default="v1.1" */
    version?: Enum_HEDPreprocessor_version | HasSingle_Enum_HEDPreprocessor_version
}

// |=============================================================================|
// | MediaPipeHandPosePreprocessor                                               |
// |=============================================================================|
export interface MediaPipeHandPosePreprocessor extends HasSingle_IMAGE, ComfyNode<MediaPipeHandPosePreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type MediaPipeHandPosePreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default="enable" */
    detect_pose?: Enum_KSamplerAdvanced_add_noise | HasSingle_Enum_KSamplerAdvanced_add_noise
    /** default="enable" */
    detect_hands?: Enum_KSamplerAdvanced_add_noise | HasSingle_Enum_KSamplerAdvanced_add_noise
}

// |=============================================================================|
// | SemSegPreprocessor                                                          |
// |=============================================================================|
export interface SemSegPreprocessor extends HasSingle_IMAGE, ComfyNode<SemSegPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type SemSegPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | UniFormerSemSegPreprocessor                                                 |
// |=============================================================================|
export interface UniFormerSemSegPreprocessor extends HasSingle_IMAGE, ComfyNode<UniFormerSemSegPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type UniFormerSemSegPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | OneFormerCOCOSemSegPreprocessor                                             |
// |=============================================================================|
export interface OneFormerCOCOSemSegPreprocessor extends HasSingle_IMAGE, ComfyNode<OneFormerCOCOSemSegPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type OneFormerCOCOSemSegPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | OneFormerADE20KSemSegPreprocessor                                           |
// |=============================================================================|
export interface OneFormerADE20KSemSegPreprocessor extends HasSingle_IMAGE, ComfyNode<OneFormerADE20KSemSegPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type OneFormerADE20KSemSegPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | MediaPipeFaceMeshPreprocessor                                               |
// |=============================================================================|
export interface MediaPipeFaceMeshPreprocessor extends HasSingle_IMAGE, ComfyNode<MediaPipeFaceMeshPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type MediaPipeFaceMeshPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=10 min=50 max=50 step=1 */
    max_faces?: INT
    /** default=0.5 min=1 max=1 step=0.1 */
    min_confidence?: FLOAT
}

// |=============================================================================|
// | ColorPreprocessor                                                           |
// |=============================================================================|
export interface ColorPreprocessor extends HasSingle_IMAGE, ComfyNode<ColorPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ColorPreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | TilePreprocessor                                                            |
// |=============================================================================|
export interface TilePreprocessor extends HasSingle_IMAGE, ComfyNode<TilePreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type TilePreprocessor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=3 min=10 max=10 step=1 */
    pyrUp_iters?: INT
}

// |=============================================================================|
// | CLIPRegionsBasePrompt                                                       |
// |=============================================================================|
export interface CLIPRegionsBasePrompt extends HasSingle_CLIPREGION, ComfyNode<CLIPRegionsBasePrompt_input> {
    CLIPREGION: Slot<'CLIPREGION', 0>
}
export type CLIPRegionsBasePrompt_input = {
    /** */
    text: STRING
    clip: CLIP | HasSingle_CLIP
}

// |=============================================================================|
// | CLIPSetRegion                                                               |
// |=============================================================================|
export interface CLIPSetRegion extends HasSingle_CLIPREGION, ComfyNode<CLIPSetRegion_input> {
    CLIPREGION: Slot<'CLIPREGION', 0>
}
export type CLIPSetRegion_input = {
    clip_regions: CLIPREGION | HasSingle_CLIPREGION
    /** */
    region_text: STRING
    /** */
    target_text: STRING
    /** default=1 min=10 max=10 step=0.05 */
    weight?: FLOAT
}

// |=============================================================================|
// | CLIPRegionsToConditioning                                                   |
// |=============================================================================|
export interface CLIPRegionsToConditioning extends HasSingle_CONDITIONING, ComfyNode<CLIPRegionsToConditioning_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type CLIPRegionsToConditioning_input = {
    clip_regions: CLIPREGION | HasSingle_CLIPREGION
    /** default="" */
    mask_token?: STRING
    /** default=1 min=1 max=1 step=0.05 */
    strict_mask?: FLOAT
    /** default=1 min=1 max=1 step=0.05 */
    start_from_masked?: FLOAT
}

// |=============================================================================|
// | KSamplerEfficient                                                           |
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
    sampler_state: Enum_KSamplerEfficient_sampler_state | HasSingle_Enum_KSamplerEfficient_sampler_state
    model: MODEL | HasSingle_MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name | HasSingle_Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler | HasSingle_Enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    latent_image: LATENT | HasSingle_LATENT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: FLOAT
    preview_image: Enum_KSamplerEfficient_preview_image | HasSingle_Enum_KSamplerEfficient_preview_image
    optional_vae?: VAE | HasSingle_VAE
    script?: SCRIPT | HasSingle_SCRIPT
}

// |=============================================================================|
// | EfficientLoader                                                             |
// |=============================================================================|
export interface EfficientLoader
    extends HasSingle_MODEL,
        HasSingle_LATENT,
        HasSingle_VAE,
        HasSingle_CLIP,
        ComfyNode<EfficientLoader_input> {
    MODEL: Slot<'MODEL', 0>
    CONDITIONING: Slot<'CONDITIONING', 1>
    CONDITIONING_1: Slot<'CONDITIONING', 2>
    LATENT: Slot<'LATENT', 3>
    VAE: Slot<'VAE', 4>
    CLIP: Slot<'CLIP', 5>
}
export type EfficientLoader_input = {
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name | HasSingle_Enum_CheckpointLoaderSimple_ckpt_name
    vae_name: Enum_EfficientLoader_vae_name | HasSingle_Enum_EfficientLoader_vae_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip?: INT
    lora_name: Enum_EfficientLoader_lora_name | HasSingle_Enum_EfficientLoader_lora_name
    /** default=1 min=10 max=10 step=0.01 */
    lora_model_strength?: FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    lora_clip_strength?: FLOAT
    /** default="Positive" */
    positive?: STRING
    /** default="Negative" */
    negative?: STRING
    /** default=512 min=8192 max=8192 step=64 */
    empty_latent_width?: INT
    /** default=512 min=8192 max=8192 step=64 */
    empty_latent_height?: INT
    /** default=1 min=64 max=64 */
    batch_size?: INT
}

// |=============================================================================|
// | XYPlot                                                                      |
// |=============================================================================|
export interface XYPlot extends HasSingle_SCRIPT, ComfyNode<XYPlot_input> {
    SCRIPT: Slot<'SCRIPT', 0>
}
export type XYPlot_input = {
    X_type: Enum_XYPlot_X_type | HasSingle_Enum_XYPlot_X_type
    /** default="" */
    X_value?: STRING
    Y_type: Enum_XYPlot_X_type | HasSingle_Enum_XYPlot_X_type
    /** default="" */
    Y_value?: STRING
    /** default=0 min=500 max=500 step=5 */
    grid_spacing?: INT
    XY_flip: Enum_ImpactMaskToSEGS_combined | HasSingle_Enum_ImpactMaskToSEGS_combined
    /** default=0 min=100 max=100 */
    latent_id?: INT
    /** default="____________EXAMPLES____________\n(X/Y_types)     (X/Y_values)\nLatent Batch    n/a\nSeeds++ Batch   3\nSteps           15;20;25\nCFG Scale       5;10;15;20\nSampler(1)      dpmpp_2s_ancestral;euler;ddim\nSampler(2)      dpmpp_2m,karras;heun,normal\nScheduler       normal;simple;karras\nDenoise         .3;.4;.5;.6;.7\nVAE             vae_1; vae_2; vae_3\n\n____________SAMPLERS____________\neuler;\neuler_ancestral;\nheun;\ndpm_2;\ndpm_2_ancestral;\nlms;\ndpm_fast;\ndpm_adaptive;\ndpmpp_2s_ancestral;\ndpmpp_sde;\ndpmpp_2m;\nddim;\nuni_pc;\nuni_pc_bh2\n\n___________SCHEDULERS___________\nkarras;\nnormal;\nsimple;\nddim_uniform\n\n______________VAE_______________\nblessed2.vae.pt;\nkl-f8-anime2.ckpt;\norangemix.vae.pt;\nvae-ft-mse-840000-ema-pruned.safetensors\n\n_____________NOTES______________\n- During a 'Latent Batch', the corresponding X/Y_value is ignored.\n- During a 'Latent Batch', the latent_id is ignored.\n- For a 'Seeds++ Batch', starting seed is defined by the KSampler.\n- Trailing semicolons are ignored in the X/Y_values.\n- Parameter types not set by this node are defined in the KSampler." */
    help?: STRING
}

// |=============================================================================|
// | ImageOverlay                                                                |
// |=============================================================================|
export interface ImageOverlay extends HasSingle_IMAGE, ComfyNode<ImageOverlay_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageOverlay_input = {
    base_image: IMAGE | HasSingle_IMAGE
    overlay_image: IMAGE | HasSingle_IMAGE
    overlay_resize: Enum_ImageOverlay_overlay_resize | HasSingle_Enum_ImageOverlay_overlay_resize
    resize_method: Enum_LatentUpscale_upscale_method | HasSingle_Enum_LatentUpscale_upscale_method
    /** default=1 min=16 max=16 step=0.1 */
    rescale_factor?: FLOAT
    /** default=512 min=8192 max=8192 step=64 */
    width?: INT
    /** default=512 min=8192 max=8192 step=64 */
    height?: INT
    /** default=0 min=48000 max=48000 step=10 */
    x_offset?: INT
    /** default=0 min=48000 max=48000 step=10 */
    y_offset?: INT
    /** default=0 min=180 max=180 step=5 */
    rotation?: INT
    /** default=0 min=100 max=100 step=5 */
    opacity?: FLOAT
    optional_mask?: MASK | HasSingle_MASK
}

// |=============================================================================|
// | EvaluateIntegers                                                            |
// |=============================================================================|
export interface EvaluateIntegers extends HasSingle_INT, HasSingle_FLOAT, ComfyNode<EvaluateIntegers_input> {
    INT: Slot<'INT', 0>
    FLOAT: Slot<'FLOAT', 1>
}
export type EvaluateIntegers_input = {
    /** default="((a + b) - c) / 2" */
    python_expression?: STRING
    print_to_console: Enum_ImpactMaskToSEGS_combined | HasSingle_Enum_ImpactMaskToSEGS_combined
    /** default=0 min=48000 max=48000 step=1 */
    a?: INT
    /** default=0 min=48000 max=48000 step=1 */
    b?: INT
    /** default=0 min=48000 max=48000 step=1 */
    c?: INT
}

// |=============================================================================|
// | EvaluateStrings                                                             |
// |=============================================================================|
export interface EvaluateStrings extends HasSingle_STRING, ComfyNode<EvaluateStrings_input> {
    STRING: Slot<'STRING', 0>
}
export type EvaluateStrings_input = {
    /** default="a + b + c" */
    python_expression?: STRING
    print_to_console: Enum_ImpactMaskToSEGS_combined | HasSingle_Enum_ImpactMaskToSEGS_combined
    /** default="Hello" */
    a?: STRING
    /** default=" World" */
    b?: STRING
    /** default="!" */
    c?: STRING
}

// |=============================================================================|
// | GaussianBlur                                                                |
// |=============================================================================|
export interface GaussianBlur extends HasSingle_IMAGE, ComfyNode<GaussianBlur_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type GaussianBlur_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=1 min=10 max=10 step=0.01 */
    strength?: FLOAT
}

// |=============================================================================|
// | HistogramEqualization                                                       |
// |=============================================================================|
export interface HistogramEqualization extends HasSingle_IMAGE, ComfyNode<HistogramEqualization_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type HistogramEqualization_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=1 min=1 max=1 step=0.01 */
    strength?: FLOAT
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
// | LatentUpscaleMultiply                                                       |
// |=============================================================================|
export interface LatentUpscaleMultiply extends HasSingle_LATENT, ComfyNode<LatentUpscaleMultiply_input> {
    LATENT: Slot<'LATENT', 0>
}
export type LatentUpscaleMultiply_input = {
    samples: LATENT | HasSingle_LATENT
    upscale_method: Enum_LatentUpscale_upscale_method | HasSingle_Enum_LatentUpscale_upscale_method
    /** default=1.25 min=10 max=10 step=0.1 */
    WidthMul?: FLOAT
    /** default=1.25 min=10 max=10 step=0.1 */
    HeightMul?: FLOAT
    crop: Enum_LatentUpscale_crop | HasSingle_Enum_LatentUpscale_crop
}

// |=============================================================================|
// | PseudoHDRStyle                                                              |
// |=============================================================================|
export interface PseudoHDRStyle extends HasSingle_IMAGE, ComfyNode<PseudoHDRStyle_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type PseudoHDRStyle_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    intensity?: FLOAT
}

// |=============================================================================|
// | Saturation                                                                  |
// |=============================================================================|
export interface Saturation extends HasSingle_IMAGE, ComfyNode<Saturation_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type Saturation_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=1 min=3 max=3 step=0.01 */
    strength?: FLOAT
}

// |=============================================================================|
// | ImageSharpening                                                             |
// |=============================================================================|
export interface ImageSharpening extends HasSingle_IMAGE, ComfyNode<ImageSharpening_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageSharpening_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=1 min=6 max=6 step=0.01 */
    strength?: FLOAT
}

// |=============================================================================|
// | WASCheckpointLoader                                                         |
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
    config_name: Enum_CheckpointLoader_config_name | HasSingle_Enum_CheckpointLoader_config_name
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name | HasSingle_Enum_CheckpointLoaderSimple_ckpt_name
}

// |=============================================================================|
// | WASCheckpointLoaderSimple                                                   |
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
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name | HasSingle_Enum_CheckpointLoaderSimple_ckpt_name
}

// |=============================================================================|
// | WASCLIPTextEncodeNSP                                                        |
// |=============================================================================|
export interface WASCLIPTextEncodeNSP extends HasSingle_CONDITIONING, ComfyNode<WASCLIPTextEncodeNSP_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type WASCLIPTextEncodeNSP_input = {
    /** default="__" */
    noodle_key?: STRING
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** */
    text: STRING
    clip: CLIP | HasSingle_CLIP
}

// |=============================================================================|
// | WASConditioningInputSwitch                                                  |
// |=============================================================================|
export interface WASConditioningInputSwitch extends HasSingle_CONDITIONING, ComfyNode<WASConditioningInputSwitch_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type WASConditioningInputSwitch_input = {
    conditioning_a: CONDITIONING | HasSingle_CONDITIONING
    conditioning_b: CONDITIONING | HasSingle_CONDITIONING
    boolean_number: NUMBER | HasSingle_NUMBER
}

// |=============================================================================|
// | WASConstantNumber                                                           |
// |=============================================================================|
export interface WASConstantNumber extends HasSingle_NUMBER, ComfyNode<WASConstantNumber_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASConstantNumber_input = {
    number_type: Enum_WASConstantNumber_number_type | HasSingle_Enum_WASConstantNumber_number_type
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    number?: FLOAT
}

// |=============================================================================|
// | WASCreateGridImage                                                          |
// |=============================================================================|
export interface WASCreateGridImage extends HasSingle_IMAGE, ComfyNode<WASCreateGridImage_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASCreateGridImage_input = {
    /** default="./ComfyUI/input/" */
    images_path?: STRING
    /** default="*" */
    pattern_glob?: STRING
    include_subfolders: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
    /** default=3 min=100 max=100 step=1 */
    border_width?: INT
    /** default=6 min=24 max=24 step=1 */
    number_of_columns?: INT
    /** default=256 min=1280 max=1280 step=1 */
    max_cell_size?: INT
    /** default=0 min=255 max=255 step=1 */
    border_red?: INT
    /** default=0 min=255 max=255 step=1 */
    border_green?: INT
    /** default=0 min=255 max=255 step=1 */
    border_blue?: INT
}

// |=============================================================================|
// | WASCreateMorphImage                                                         |
// |=============================================================================|
export interface WASCreateMorphImage extends ComfyNode<WASCreateMorphImage_input> {
    IMAGE: Slot<'IMAGE', 0>
    IMAGE_1: Slot<'IMAGE', 1>
    ASCII: Slot<'ASCII', 2>
    ASCII_1: Slot<'ASCII', 3>
}
export type WASCreateMorphImage_input = {
    image_a: IMAGE | HasSingle_IMAGE
    image_b: IMAGE | HasSingle_IMAGE
    /** default=30 min=60 max=60 step=1 */
    transition_frames?: INT
    /** default=2500 min=60000 max=60000 step=0.1 */
    still_image_delay_ms?: FLOAT
    /** default=0.1 min=60000 max=60000 step=0.1 */
    duration_ms?: FLOAT
    /** default=0 min=100 max=100 step=1 */
    loops?: INT
    /** default=512 min=1280 max=1280 step=1 */
    max_size?: INT
    /** default="./ComfyUI/output" */
    output_path?: STRING
    /** default="morph" */
    filename?: STRING
    filetype: Enum_WASCreateMorphImage_filetype | HasSingle_Enum_WASCreateMorphImage_filetype
}

// |=============================================================================|
// | WASCreateMorphImageFromPath                                                 |
// |=============================================================================|
export interface WASCreateMorphImageFromPath extends ComfyNode<WASCreateMorphImageFromPath_input> {
    ASCII: Slot<'ASCII', 0>
    ASCII_1: Slot<'ASCII', 1>
}
export type WASCreateMorphImageFromPath_input = {
    /** default=30 min=60 max=60 step=1 */
    transition_frames?: INT
    /** default=2500 min=60000 max=60000 step=0.1 */
    still_image_delay_ms?: FLOAT
    /** default=0.1 min=60000 max=60000 step=0.1 */
    duration_ms?: FLOAT
    /** default=0 min=100 max=100 step=1 */
    loops?: INT
    /** default=512 min=1280 max=1280 step=1 */
    max_size?: INT
    /** default="./ComfyUI" */
    input_path?: STRING
    /** default="*" */
    input_pattern?: STRING
    /** default="./ComfyUI/output" */
    output_path?: STRING
    /** default="morph" */
    filename?: STRING
    filetype: Enum_WASCreateMorphImage_filetype | HasSingle_Enum_WASCreateMorphImage_filetype
}

// |=============================================================================|
// | WASCreateVideoFromPath                                                      |
// |=============================================================================|
export interface WASCreateVideoFromPath extends ComfyNode<WASCreateVideoFromPath_input> {
    ASCII: Slot<'ASCII', 0>
    ASCII_1: Slot<'ASCII', 1>
}
export type WASCreateVideoFromPath_input = {
    /** default=30 min=120 max=120 step=1 */
    transition_frames?: INT
    /** default=2.5 min=60000 max=60000 step=0.01 */
    image_delay_sec?: FLOAT
    /** default=30 min=60 max=60 step=1 */
    fps?: INT
    /** default=512 min=1920 max=1920 step=1 */
    max_size?: INT
    /** default="./ComfyUI/input" */
    input_path?: STRING
    /** default="./ComfyUI/output" */
    output_path?: STRING
    /** default="comfy_video" */
    filename?: STRING
    codec: Enum_WASCreateVideoFromPath_codec | HasSingle_Enum_WASCreateVideoFromPath_codec
}

// |=============================================================================|
// | WASDebugNumberToConsole                                                     |
// |=============================================================================|
export interface WASDebugNumberToConsole extends HasSingle_NUMBER, ComfyNode<WASDebugNumberToConsole_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASDebugNumberToConsole_input = {
    number: NUMBER | HasSingle_NUMBER
    /** default="Debug to Console" */
    label?: STRING
}

// |=============================================================================|
// | WASDictionaryToConsole                                                      |
// |=============================================================================|
export interface WASDictionaryToConsole extends HasSingle_DICT, ComfyNode<WASDictionaryToConsole_input> {
    DICT: Slot<'DICT', 0>
}
export type WASDictionaryToConsole_input = {
    dictionary: DICT | HasSingle_DICT
    /** default="Dictionary Output" */
    label?: STRING
}

// |=============================================================================|
// | WASDiffusersModelLoader                                                     |
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
    model_path: Enum_CLIPLoader_clip_name | HasSingle_Enum_CLIPLoader_clip_name
}

// |=============================================================================|
// | WASLatentInputSwitch                                                        |
// |=============================================================================|
export interface WASLatentInputSwitch extends HasSingle_LATENT, ComfyNode<WASLatentInputSwitch_input> {
    LATENT: Slot<'LATENT', 0>
}
export type WASLatentInputSwitch_input = {
    latent_a: LATENT | HasSingle_LATENT
    latent_b: LATENT | HasSingle_LATENT
    boolean_number: NUMBER | HasSingle_NUMBER
}

// |=============================================================================|
// | WASLogicBoolean                                                             |
// |=============================================================================|
export interface WASLogicBoolean extends HasSingle_NUMBER, ComfyNode<WASLogicBoolean_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASLogicBoolean_input = {
    /** default=1 min=1 max=1 step=1 */
    boolean_number?: INT
}

// |=============================================================================|
// | WASLoraLoader                                                               |
// |=============================================================================|
export interface WASLoraLoader extends HasSingle_MODEL, HasSingle_CLIP, HasSingle_STRING, ComfyNode<WASLoraLoader_input> {
    MODEL: Slot<'MODEL', 0>
    CLIP: Slot<'CLIP', 1>
    STRING: Slot<'STRING', 2>
}
export type WASLoraLoader_input = {
    model: MODEL | HasSingle_MODEL
    clip: CLIP | HasSingle_CLIP
    lora_name: Enum_LoraLoader_lora_name | HasSingle_Enum_LoraLoader_lora_name
    /** default=1 min=10 max=10 step=0.01 */
    strength_model?: FLOAT
    /** default=1 min=10 max=10 step=0.01 */
    strength_clip?: FLOAT
}

// |=============================================================================|
// | WASImageAnalyze                                                             |
// |=============================================================================|
export interface WASImageAnalyze extends HasSingle_IMAGE, ComfyNode<WASImageAnalyze_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageAnalyze_input = {
    image: IMAGE | HasSingle_IMAGE
    mode: Enum_WASImageAnalyze_mode | HasSingle_Enum_WASImageAnalyze_mode
}

// |=============================================================================|
// | WASImageBlank                                                               |
// |=============================================================================|
export interface WASImageBlank extends HasSingle_IMAGE, ComfyNode<WASImageBlank_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageBlank_input = {
    /** default=512 min=4096 max=4096 step=1 */
    width?: INT
    /** default=512 min=4096 max=4096 step=1 */
    height?: INT
    /** default=255 min=255 max=255 step=1 */
    red?: INT
    /** default=255 min=255 max=255 step=1 */
    green?: INT
    /** default=255 min=255 max=255 step=1 */
    blue?: INT
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
    /** default=0.5 min=1 max=1 step=0.01 */
    blend_percentage?: FLOAT
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
    /** default=0.5 min=1 max=1 step=0.01 */
    blend_percentage?: FLOAT
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
    /** default=1 min=1 max=1 step=0.01 */
    blend_percentage?: FLOAT
}

// |=============================================================================|
// | WASImageBloomFilter                                                         |
// |=============================================================================|
export interface WASImageBloomFilter extends HasSingle_IMAGE, ComfyNode<WASImageBloomFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageBloomFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=10 min=1024 max=1024 step=0.1 */
    radius?: FLOAT
    /** default=1 min=1 max=1 step=0.1 */
    intensity?: FLOAT
}

// |=============================================================================|
// | WASImageCannyFilter                                                         |
// |=============================================================================|
export interface WASImageCannyFilter extends HasSingle_IMAGE, ComfyNode<WASImageCannyFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageCannyFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    enable_threshold: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
    /** default=0 min=1 max=1 step=0.01 */
    threshold_low?: FLOAT
    /** default=1 min=1 max=1 step=0.01 */
    threshold_high?: FLOAT
}

// |=============================================================================|
// | WASImageChromaticAberration                                                 |
// |=============================================================================|
export interface WASImageChromaticAberration extends HasSingle_IMAGE, ComfyNode<WASImageChromaticAberration_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageChromaticAberration_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=2 min=255 max=255 step=1 */
    red_offset?: INT
    /** default=-1 min=255 max=255 step=1 */
    green_offset?: INT
    /** default=1 min=255 max=255 step=1 */
    blue_offset?: INT
    /** default=0.5 min=1 max=1 step=0.01 */
    intensity?: FLOAT
}

// |=============================================================================|
// | WASImageColorPalette                                                        |
// |=============================================================================|
export interface WASImageColorPalette extends HasSingle_IMAGE, ComfyNode<WASImageColorPalette_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageColorPalette_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=16 min=256 max=256 step=1 */
    colors?: INT
}

// |=============================================================================|
// | WASImageCropFace                                                            |
// |=============================================================================|
export interface WASImageCropFace extends HasSingle_IMAGE, HasSingle_CROP_DATA, ComfyNode<WASImageCropFace_input> {
    IMAGE: Slot<'IMAGE', 0>
    CROP_DATA: Slot<'CROP_DATA', 1>
}
export type WASImageCropFace_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=0.25 min=2 max=2 step=0.01 */
    crop_padding_factor?: FLOAT
    cascade_xml: Enum_WASImageCropFace_cascade_xml | HasSingle_Enum_WASImageCropFace_cascade_xml
    use_face_recognition_gpu: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
}

// |=============================================================================|
// | WASImageCropLocation                                                        |
// |=============================================================================|
export interface WASImageCropLocation extends HasSingle_IMAGE, HasSingle_CROP_DATA, ComfyNode<WASImageCropLocation_input> {
    IMAGE: Slot<'IMAGE', 0>
    CROP_DATA: Slot<'CROP_DATA', 1>
}
export type WASImageCropLocation_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=0 min=10000000 max=10000000 step=1 */
    top?: INT
    /** default=0 min=10000000 max=10000000 step=1 */
    left?: INT
    /** default=256 min=10000000 max=10000000 step=1 */
    right?: INT
    /** default=256 min=10000000 max=10000000 step=1 */
    bottom?: INT
}

// |=============================================================================|
// | WASImagePasteFace                                                           |
// |=============================================================================|
export interface WASImagePasteFace extends ComfyNode<WASImagePasteFace_input> {
    IMAGE: Slot<'IMAGE', 0>
    IMAGE_1: Slot<'IMAGE', 1>
}
export type WASImagePasteFace_input = {
    image: IMAGE | HasSingle_IMAGE
    crop_image: IMAGE | HasSingle_IMAGE
    crop_data: CROP_DATA | HasSingle_CROP_DATA
    /** default=0.25 min=1 max=1 step=0.01 */
    crop_blending?: FLOAT
    /** default=0 min=3 max=3 step=1 */
    crop_sharpening?: INT
}

// |=============================================================================|
// | WASImagePasteCrop                                                           |
// |=============================================================================|
export interface WASImagePasteCrop extends ComfyNode<WASImagePasteCrop_input> {
    IMAGE: Slot<'IMAGE', 0>
    IMAGE_1: Slot<'IMAGE', 1>
}
export type WASImagePasteCrop_input = {
    image: IMAGE | HasSingle_IMAGE
    crop_image: IMAGE | HasSingle_IMAGE
    crop_data: CROP_DATA | HasSingle_CROP_DATA
    /** default=0.25 min=1 max=1 step=0.01 */
    crop_blending?: FLOAT
    /** default=0 min=3 max=3 step=1 */
    crop_sharpening?: INT
}

// |=============================================================================|
// | WASImagePasteCropByLocation                                                 |
// |=============================================================================|
export interface WASImagePasteCropByLocation extends ComfyNode<WASImagePasteCropByLocation_input> {
    IMAGE: Slot<'IMAGE', 0>
    IMAGE_1: Slot<'IMAGE', 1>
}
export type WASImagePasteCropByLocation_input = {
    image: IMAGE | HasSingle_IMAGE
    crop_image: IMAGE | HasSingle_IMAGE
    /** default=0 min=10000000 max=10000000 step=1 */
    top?: INT
    /** default=0 min=10000000 max=10000000 step=1 */
    left?: INT
    /** default=256 min=10000000 max=10000000 step=1 */
    right?: INT
    /** default=256 min=10000000 max=10000000 step=1 */
    bottom?: INT
    /** default=0.25 min=1 max=1 step=0.01 */
    crop_blending?: FLOAT
    /** default=0 min=3 max=3 step=1 */
    crop_sharpening?: INT
}

// |=============================================================================|
// | WASImageDraganPhotographyFilter                                             |
// |=============================================================================|
export interface WASImageDraganPhotographyFilter extends HasSingle_IMAGE, ComfyNode<WASImageDraganPhotographyFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageDraganPhotographyFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=1 min=16 max=16 step=0.01 */
    saturation?: FLOAT
    /** default=1 min=16 max=16 step=0.01 */
    contrast?: FLOAT
    /** default=1 min=16 max=16 step=0.01 */
    brightness?: FLOAT
    /** default=1 min=6 max=6 step=0.01 */
    sharpness?: FLOAT
    /** default=6 min=255 max=255 step=0.01 */
    highpass_radius?: FLOAT
    /** default=1 min=6 max=6 step=1 */
    highpass_samples?: INT
    /** default=1 min=1 max=1 step=0.01 */
    highpass_strength?: FLOAT
    colorize: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
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
// | WASImageFilmGrain                                                           |
// |=============================================================================|
export interface WASImageFilmGrain extends HasSingle_IMAGE, ComfyNode<WASImageFilmGrain_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageFilmGrain_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=1 min=1 max=1 step=0.01 */
    density?: FLOAT
    /** default=1 min=1 max=1 step=0.01 */
    intensity?: FLOAT
    /** default=1 min=255 max=255 step=0.01 */
    highlights?: FLOAT
    /** default=4 min=8 max=8 step=1 */
    supersample_factor?: INT
}

// |=============================================================================|
// | WASImageFilterAdjustments                                                   |
// |=============================================================================|
export interface WASImageFilterAdjustments extends HasSingle_IMAGE, ComfyNode<WASImageFilterAdjustments_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageFilterAdjustments_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=0 min=1 max=1 step=0.01 */
    brightness?: FLOAT
    /** default=1 min=2 max=2 step=0.01 */
    contrast?: FLOAT
    /** default=1 min=5 max=5 step=0.01 */
    saturation?: FLOAT
    /** default=1 min=5 max=5 step=0.01 */
    sharpness?: FLOAT
    /** default=0 min=16 max=16 step=1 */
    blur?: INT
    /** default=0 min=1024 max=1024 step=0.1 */
    gaussian_blur?: FLOAT
    /** default=0 min=1 max=1 step=0.01 */
    edge_enhance?: FLOAT
}

// |=============================================================================|
// | WASImageGradientMap                                                         |
// |=============================================================================|
export interface WASImageGradientMap extends HasSingle_IMAGE, ComfyNode<WASImageGradientMap_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageGradientMap_input = {
    image: IMAGE | HasSingle_IMAGE
    gradient_image: IMAGE | HasSingle_IMAGE
    flip_left_right: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
}

// |=============================================================================|
// | WASImageGenerateGradient                                                    |
// |=============================================================================|
export interface WASImageGenerateGradient extends HasSingle_IMAGE, ComfyNode<WASImageGenerateGradient_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageGenerateGradient_input = {
    /** default=512 min=4096 max=4096 step=1 */
    width?: INT
    /** default=512 min=4096 max=4096 step=1 */
    height?: INT
    direction: Enum_WASImageFlip_mode | HasSingle_Enum_WASImageFlip_mode
    /** default=0 min=255 max=255 step=1 */
    tolerance?: INT
    /** default="0:255,0,0\n25:255,255,255\n50:0,255,0\n75:0,0,255" */
    gradient_stops?: STRING
}

// |=============================================================================|
// | WASImageHighPassFilter                                                      |
// |=============================================================================|
export interface WASImageHighPassFilter extends HasSingle_IMAGE, ComfyNode<WASImageHighPassFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageHighPassFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=10 min=500 max=500 step=1 */
    radius?: INT
    /** default=1.5 min=255 max=255 step=0.1 */
    strength?: FLOAT
}

// |=============================================================================|
// | WASImageHistoryLoader                                                       |
// |=============================================================================|
export interface WASImageHistoryLoader extends HasSingle_IMAGE, HasSingle_ASCII, ComfyNode<WASImageHistoryLoader_input> {
    IMAGE: Slot<'IMAGE', 0>
    ASCII: Slot<'ASCII', 1>
}
export type WASImageHistoryLoader_input = {
    image: Enum_WASImageHistoryLoader_image | HasSingle_Enum_WASImageHistoryLoader_image
}

// |=============================================================================|
// | WASImageInputSwitch                                                         |
// |=============================================================================|
export interface WASImageInputSwitch extends HasSingle_IMAGE, ComfyNode<WASImageInputSwitch_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageInputSwitch_input = {
    image_a: IMAGE | HasSingle_IMAGE
    image_b: IMAGE | HasSingle_IMAGE
    boolean_number: NUMBER | HasSingle_NUMBER
}

// |=============================================================================|
// | WASImageLevelsAdjustment                                                    |
// |=============================================================================|
export interface WASImageLevelsAdjustment extends HasSingle_IMAGE, ComfyNode<WASImageLevelsAdjustment_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageLevelsAdjustment_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=0 min=255 max=255 step=0.1 */
    black_level?: FLOAT
    /** default=127.5 min=255 max=255 step=0.1 */
    mid_level?: FLOAT
    /** default=255 min=255 max=255 step=0.1 */
    white_level?: FLOAT
}

// |=============================================================================|
// | WASImageLoad                                                                |
// |=============================================================================|
export interface WASImageLoad extends HasSingle_IMAGE, HasSingle_MASK, HasSingle_ASCII, ComfyNode<WASImageLoad_input> {
    IMAGE: Slot<'IMAGE', 0>
    MASK: Slot<'MASK', 1>
    ASCII: Slot<'ASCII', 2>
}
export type WASImageLoad_input = {
    /** default="./ComfyUI/input/example.png" */
    image_path?: STRING
}

// |=============================================================================|
// | WASImageMedianFilter                                                        |
// |=============================================================================|
export interface WASImageMedianFilter extends HasSingle_IMAGE, ComfyNode<WASImageMedianFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageMedianFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=2 min=255 max=255 step=1 */
    diameter?: INT
    /** default=10 min=255 max=255 step=0.1 */
    sigma_color?: FLOAT
    /** default=10 min=255 max=255 step=0.1 */
    sigma_space?: FLOAT
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
// | WASImageMonitorEffectsFilter                                                |
// |=============================================================================|
export interface WASImageMonitorEffectsFilter extends HasSingle_IMAGE, ComfyNode<WASImageMonitorEffectsFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageMonitorEffectsFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    mode: Enum_WASImageMonitorEffectsFilter_mode | HasSingle_Enum_WASImageMonitorEffectsFilter_mode
    /** default=5 min=255 max=255 step=1 */
    amplitude?: INT
    /** default=10 min=255 max=255 step=1 */
    offset?: INT
}

// |=============================================================================|
// | WASImageNovaFilter                                                          |
// |=============================================================================|
export interface WASImageNovaFilter extends HasSingle_IMAGE, ComfyNode<WASImageNovaFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageNovaFilter_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=0.1 min=1 max=1 step=0.001 */
    amplitude?: FLOAT
    /** default=3.14 min=100 max=100 step=0.001 */
    frequency?: FLOAT
}

// |=============================================================================|
// | WASImagePadding                                                             |
// |=============================================================================|
export interface WASImagePadding extends ComfyNode<WASImagePadding_input> {
    IMAGE: Slot<'IMAGE', 0>
    IMAGE_1: Slot<'IMAGE', 1>
}
export type WASImagePadding_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=120 min=2048 max=2048 step=1 */
    feathering?: INT
    feather_second_pass: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
    /** default=512 min=48000 max=48000 step=1 */
    left_padding?: INT
    /** default=512 min=48000 max=48000 step=1 */
    right_padding?: INT
    /** default=512 min=48000 max=48000 step=1 */
    top_padding?: INT
    /** default=512 min=48000 max=48000 step=1 */
    bottom_padding?: INT
}

// |=============================================================================|
// | WASImagePerlinNoiseFilter                                                   |
// |=============================================================================|
export interface WASImagePerlinNoiseFilter extends HasSingle_IMAGE, ComfyNode<WASImagePerlinNoiseFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImagePerlinNoiseFilter_input = {
    /** default=512 min=2048 max=2048 step=1 */
    width?: INT
    /** default=512 min=2048 max=2048 step=1 */
    height?: INT
    /** default=4 min=8 max=8 step=2 */
    shape?: INT
    /** default=0.25 min=1 max=1 step=0.01 */
    density?: FLOAT
    /** default=4 min=8 max=8 step=1 */
    octaves?: INT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
}

// |=============================================================================|
// | WASImageRemoveBackgroundAlpha                                               |
// |=============================================================================|
export interface WASImageRemoveBackgroundAlpha extends HasSingle_IMAGE, ComfyNode<WASImageRemoveBackgroundAlpha_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageRemoveBackgroundAlpha_input = {
    image: IMAGE | HasSingle_IMAGE
    mode: Enum_WASImageRemoveBackgroundAlpha_mode | HasSingle_Enum_WASImageRemoveBackgroundAlpha_mode
    /** default=127 min=255 max=255 step=1 */
    threshold?: INT
    /** default=2 min=24 max=24 step=1 */
    threshold_tolerance?: INT
}

// |=============================================================================|
// | WASImageRemoveColor                                                         |
// |=============================================================================|
export interface WASImageRemoveColor extends HasSingle_IMAGE, ComfyNode<WASImageRemoveColor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageRemoveColor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=255 min=255 max=255 step=1 */
    target_red?: INT
    /** default=255 min=255 max=255 step=1 */
    target_green?: INT
    /** default=255 min=255 max=255 step=1 */
    target_blue?: INT
    /** default=255 min=255 max=255 step=1 */
    replace_red?: INT
    /** default=255 min=255 max=255 step=1 */
    replace_green?: INT
    /** default=255 min=255 max=255 step=1 */
    replace_blue?: INT
    /** default=10 min=255 max=255 step=1 */
    clip_threshold?: INT
}

// |=============================================================================|
// | WASImageResize                                                              |
// |=============================================================================|
export interface WASImageResize extends HasSingle_IMAGE, ComfyNode<WASImageResize_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageResize_input = {
    image: IMAGE | HasSingle_IMAGE
    mode: Enum_WASImageResize_mode | HasSingle_Enum_WASImageResize_mode
    supersample: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
    resampling: Enum_WASImageResize_resampling | HasSingle_Enum_WASImageResize_resampling
    /** default=2 min=16 max=16 step=0.01 */
    rescale_factor?: FLOAT
    /** default=1024 min=48000 max=48000 step=1 */
    resize_width?: INT
    /** default=1536 min=48000 max=48000 step=1 */
    resize_height?: INT
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
    /** default=0 min=360 max=360 step=90 */
    rotation?: INT
    sampler: Enum_WASImageRotate_sampler | HasSingle_Enum_WASImageRotate_sampler
}

// |=============================================================================|
// | WASImageSave                                                                |
// |=============================================================================|
export interface WASImageSave extends ComfyNode<WASImageSave_input> {}
export type WASImageSave_input = {
    images: IMAGE | HasSingle_IMAGE
    /** default="./ComfyUI/output" */
    output_path?: STRING
    /** default="ComfyUI" */
    filename_prefix?: STRING
    extension: Enum_WASImageSave_extension | HasSingle_Enum_WASImageSave_extension
    /** default=100 min=100 max=100 step=1 */
    quality?: INT
    overwrite_mode: Enum_WASImageSave_overwrite_mode | HasSingle_Enum_WASImageSave_overwrite_mode
}

// |=============================================================================|
// | WASImageSeamlessTexture                                                     |
// |=============================================================================|
export interface WASImageSeamlessTexture extends HasSingle_IMAGE, ComfyNode<WASImageSeamlessTexture_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageSeamlessTexture_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=0.4 min=1 max=1 step=0.01 */
    blending?: FLOAT
    tiled: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
    /** default=2 min=6 max=6 step=2 */
    tiles?: INT
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
// | WASImageSelectColor                                                         |
// |=============================================================================|
export interface WASImageSelectColor extends HasSingle_IMAGE, ComfyNode<WASImageSelectColor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageSelectColor_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=255 min=255 max=255 step=0.1 */
    red?: INT
    /** default=255 min=255 max=255 step=0.1 */
    green?: INT
    /** default=255 min=255 max=255 step=0.1 */
    blue?: INT
    /** default=10 min=255 max=255 step=1 */
    variance?: INT
}

// |=============================================================================|
// | WASImageShadowsAndHighlights                                                |
// |=============================================================================|
export interface WASImageShadowsAndHighlights extends ComfyNode<WASImageShadowsAndHighlights_input> {
    IMAGE: Slot<'IMAGE', 0>
    IMAGE_1: Slot<'IMAGE', 1>
    IMAGE_2: Slot<'IMAGE', 2>
}
export type WASImageShadowsAndHighlights_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=75 min=255 max=255 step=0.1 */
    shadow_threshold?: FLOAT
    /** default=1.5 min=12 max=12 step=0.1 */
    shadow_factor?: FLOAT
    /** default=0.25 min=255 max=255 step=0.1 */
    shadow_smoothing?: FLOAT
    /** default=175 min=255 max=255 step=0.1 */
    highlight_threshold?: FLOAT
    /** default=0.5 min=12 max=12 step=0.1 */
    highlight_factor?: FLOAT
    /** default=0.25 min=255 max=255 step=0.1 */
    highlight_smoothing?: FLOAT
    /** default=0 min=255 max=255 step=0.1 */
    simplify_isolation?: FLOAT
}

// |=============================================================================|
// | WASImageSizeToNumber                                                        |
// |=============================================================================|
export interface WASImageSizeToNumber extends ComfyNode<WASImageSizeToNumber_input> {
    NUMBER: Slot<'NUMBER', 0>
    NUMBER_1: Slot<'NUMBER', 1>
}
export type WASImageSizeToNumber_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | WASImageStitch                                                              |
// |=============================================================================|
export interface WASImageStitch extends HasSingle_IMAGE, ComfyNode<WASImageStitch_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageStitch_input = {
    image_a: IMAGE | HasSingle_IMAGE
    image_b: IMAGE | HasSingle_IMAGE
    stitch: Enum_WASImageStitch_stitch | HasSingle_Enum_WASImageStitch_stitch
    /** default=50 min=2048 max=2048 step=1 */
    feathering?: INT
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
// | WASImageThreshold                                                           |
// |=============================================================================|
export interface WASImageThreshold extends HasSingle_IMAGE, ComfyNode<WASImageThreshold_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageThreshold_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    threshold?: FLOAT
}

// |=============================================================================|
// | WASImageTranspose                                                           |
// |=============================================================================|
export interface WASImageTranspose extends HasSingle_IMAGE, ComfyNode<WASImageTranspose_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageTranspose_input = {
    image: IMAGE | HasSingle_IMAGE
    image_overlay: IMAGE | HasSingle_IMAGE
    /** default=512 min=48000 max=48000 step=1 */
    width?: INT
    /** default=512 min=48000 max=48000 step=1 */
    height?: INT
    /** default=0 min=48000 max=48000 step=1 */
    X?: INT
    /** default=0 min=48000 max=48000 step=1 */
    Y?: INT
    /** default=0 min=360 max=360 step=1 */
    rotation?: INT
    /** default=0 min=4096 max=4096 step=1 */
    feathering?: INT
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
    /** default=8 min=128 max=128 step=1 */
    radius?: INT
    /** default=1 min=3 max=3 step=1 */
    samples?: INT
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
// | WASImageVoronoiNoiseFilter                                                  |
// |=============================================================================|
export interface WASImageVoronoiNoiseFilter extends HasSingle_IMAGE, ComfyNode<WASImageVoronoiNoiseFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageVoronoiNoiseFilter_input = {
    /** default=512 min=4096 max=4096 step=1 */
    width?: INT
    /** default=512 min=4096 max=4096 step=1 */
    height?: INT
    /** default=50 min=256 max=256 step=2 */
    density?: INT
    /** default=0 min=8 max=8 step=1 */
    modulator?: INT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
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
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name | HasSingle_Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler | HasSingle_Enum_KSampler_scheduler
    positive: CONDITIONING | HasSingle_CONDITIONING
    negative: CONDITIONING | HasSingle_CONDITIONING
    latent_image: LATENT | HasSingle_LATENT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: FLOAT
}

// |=============================================================================|
// | WASLatentNoiseInjection                                                     |
// |=============================================================================|
export interface WASLatentNoiseInjection extends HasSingle_LATENT, ComfyNode<WASLatentNoiseInjection_input> {
    LATENT: Slot<'LATENT', 0>
}
export type WASLatentNoiseInjection_input = {
    samples: LATENT | HasSingle_LATENT
    /** default=0.1 min=1 max=1 step=0.01 */
    noise_std?: FLOAT
}

// |=============================================================================|
// | WASLatentSizeToNumber                                                       |
// |=============================================================================|
export interface WASLatentSizeToNumber extends ComfyNode<WASLatentSizeToNumber_input> {
    NUMBER: Slot<'NUMBER', 0>
    NUMBER_1: Slot<'NUMBER', 1>
}
export type WASLatentSizeToNumber_input = {
    samples: LATENT | HasSingle_LATENT
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
    /** default=2 min=8 max=8 step=0.01 */
    factor?: FLOAT
    align: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
}

// |=============================================================================|
// | WASLoadImageBatch                                                           |
// |=============================================================================|
export interface WASLoadImageBatch extends HasSingle_IMAGE, HasSingle_ASCII, ComfyNode<WASLoadImageBatch_input> {
    IMAGE: Slot<'IMAGE', 0>
    ASCII: Slot<'ASCII', 1>
}
export type WASLoadImageBatch_input = {
    mode: Enum_WASLoadImageBatch_mode | HasSingle_Enum_WASLoadImageBatch_mode
    /** default=0 min=150000 max=150000 step=1 */
    index?: INT
    /** default="Batch 001" */
    label?: STRING
    /** default="./ComfyUI/input/" */
    path?: STRING
    /** default="*" */
    pattern?: STRING
}

// |=============================================================================|
// | WASLoadTextFile                                                             |
// |=============================================================================|
export interface WASLoadTextFile extends HasSingle_ASCII, HasSingle_DICT, ComfyNode<WASLoadTextFile_input> {
    ASCII: Slot<'ASCII', 0>
    DICT: Slot<'DICT', 1>
}
export type WASLoadTextFile_input = {
    /** default="" */
    file_path?: STRING
    /** default="[filename]" */
    dictionary_name?: STRING
}

// |=============================================================================|
// | WASMiDaSDepthApproximation                                                  |
// |=============================================================================|
export interface WASMiDaSDepthApproximation extends HasSingle_IMAGE, ComfyNode<WASMiDaSDepthApproximation_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASMiDaSDepthApproximation_input = {
    image: IMAGE | HasSingle_IMAGE
    use_cpu: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
    midas_model: Enum_WASMiDaSDepthApproximation_midas_model | HasSingle_Enum_WASMiDaSDepthApproximation_midas_model
    invert_depth: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
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
    use_cpu: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
    midas_model: Enum_WASMiDaSDepthApproximation_midas_model | HasSingle_Enum_WASMiDaSDepthApproximation_midas_model
    remove: Enum_WASMiDaSMaskImage_remove | HasSingle_Enum_WASMiDaSMaskImage_remove
    threshold: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
    /** default=10 min=255 max=255 step=1 */
    threshold_low?: FLOAT
    /** default=200 min=255 max=255 step=1 */
    threshold_mid?: FLOAT
    /** default=210 min=255 max=255 step=1 */
    threshold_high?: FLOAT
    /** default=0.25 min=16 max=16 step=0.01 */
    smoothing?: FLOAT
    /** default=0 min=255 max=255 step=1 */
    background_red?: INT
    /** default=0 min=255 max=255 step=1 */
    background_green?: INT
    /** default=0 min=255 max=255 step=1 */
    background_blue?: INT
}

// |=============================================================================|
// | WASNumberOperation                                                          |
// |=============================================================================|
export interface WASNumberOperation extends HasSingle_NUMBER, ComfyNode<WASNumberOperation_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASNumberOperation_input = {
    number_a: NUMBER | HasSingle_NUMBER
    number_b: NUMBER | HasSingle_NUMBER
    operation: Enum_WASNumberOperation_operation | HasSingle_Enum_WASNumberOperation_operation
}

// |=============================================================================|
// | WASNumberToFloat                                                            |
// |=============================================================================|
export interface WASNumberToFloat extends HasSingle_FLOAT, ComfyNode<WASNumberToFloat_input> {
    FLOAT: Slot<'FLOAT', 0>
}
export type WASNumberToFloat_input = {
    number: NUMBER | HasSingle_NUMBER
}

// |=============================================================================|
// | WASNumberInputSwitch                                                        |
// |=============================================================================|
export interface WASNumberInputSwitch extends HasSingle_NUMBER, ComfyNode<WASNumberInputSwitch_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASNumberInputSwitch_input = {
    number_a: NUMBER | HasSingle_NUMBER
    number_b: NUMBER | HasSingle_NUMBER
    boolean_number: NUMBER | HasSingle_NUMBER
}

// |=============================================================================|
// | WASNumberInputCondition                                                     |
// |=============================================================================|
export interface WASNumberInputCondition extends HasSingle_NUMBER, ComfyNode<WASNumberInputCondition_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASNumberInputCondition_input = {
    number_a: NUMBER | HasSingle_NUMBER
    number_b: NUMBER | HasSingle_NUMBER
    comparison: Enum_WASNumberInputCondition_comparison | HasSingle_Enum_WASNumberInputCondition_comparison
}

// |=============================================================================|
// | WASNumberMultipleOf                                                         |
// |=============================================================================|
export interface WASNumberMultipleOf extends HasSingle_NUMBER, ComfyNode<WASNumberMultipleOf_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASNumberMultipleOf_input = {
    number: NUMBER | HasSingle_NUMBER
    /** default=8 min=18446744073709552000 max=18446744073709552000 */
    multiple?: INT
}

// |=============================================================================|
// | WASNumberPI                                                                 |
// |=============================================================================|
export interface WASNumberPI extends HasSingle_NUMBER, ComfyNode<WASNumberPI_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASNumberPI_input = {}

// |=============================================================================|
// | WASNumberToInt                                                              |
// |=============================================================================|
export interface WASNumberToInt extends HasSingle_INT, ComfyNode<WASNumberToInt_input> {
    INT: Slot<'INT', 0>
}
export type WASNumberToInt_input = {
    number: NUMBER | HasSingle_NUMBER
}

// |=============================================================================|
// | WASNumberToSeed                                                             |
// |=============================================================================|
export interface WASNumberToSeed extends HasSingle_SEED, ComfyNode<WASNumberToSeed_input> {
    SEED: Slot<'SEED', 0>
}
export type WASNumberToSeed_input = {
    number: NUMBER | HasSingle_NUMBER
}

// |=============================================================================|
// | WASNumberToString                                                           |
// |=============================================================================|
export interface WASNumberToString extends HasSingle_STRING, ComfyNode<WASNumberToString_input> {
    STRING: Slot<'STRING', 0>
}
export type WASNumberToString_input = {
    number: NUMBER | HasSingle_NUMBER
}

// |=============================================================================|
// | WASNumberToText                                                             |
// |=============================================================================|
export interface WASNumberToText extends HasSingle_ASCII, ComfyNode<WASNumberToText_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASNumberToText_input = {
    number: NUMBER | HasSingle_NUMBER
}

// |=============================================================================|
// | WASPromptStylesSelector                                                     |
// |=============================================================================|
export interface WASPromptStylesSelector extends ComfyNode<WASPromptStylesSelector_input> {
    ASCII: Slot<'ASCII', 0>
    ASCII_1: Slot<'ASCII', 1>
}
export type WASPromptStylesSelector_input = {
    style: Enum_WASPromptStylesSelector_style | HasSingle_Enum_WASPromptStylesSelector_style
}

// |=============================================================================|
// | WASRandomNumber                                                             |
// |=============================================================================|
export interface WASRandomNumber extends HasSingle_NUMBER, ComfyNode<WASRandomNumber_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASRandomNumber_input = {
    number_type: Enum_WASConstantNumber_number_type | HasSingle_Enum_WASConstantNumber_number_type
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    minimum?: FLOAT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    maximum?: FLOAT
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
}

// |=============================================================================|
// | WASSaveTextFile                                                             |
// |=============================================================================|
export interface WASSaveTextFile extends ComfyNode<WASSaveTextFile_input> {}
export type WASSaveTextFile_input = {
    text: ASCII | HasSingle_ASCII
    /** default="" */
    path?: STRING
    /** default="text_[time]" */
    filename?: STRING
}

// |=============================================================================|
// | WASSeed                                                                     |
// |=============================================================================|
export interface WASSeed extends HasSingle_SEED, ComfyNode<WASSeed_input> {
    SEED: Slot<'SEED', 0>
}
export type WASSeed_input = {
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
}

// |=============================================================================|
// | WASTensorBatchToImage                                                       |
// |=============================================================================|
export interface WASTensorBatchToImage extends HasSingle_IMAGE, ComfyNode<WASTensorBatchToImage_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASTensorBatchToImage_input = {
    images_batch: IMAGE | HasSingle_IMAGE
    /** default=0 min=64 max=64 step=1 */
    batch_image_number?: INT
}

// |=============================================================================|
// | WASBLIPAnalyzeImage                                                         |
// |=============================================================================|
export interface WASBLIPAnalyzeImage extends HasSingle_ASCII, ComfyNode<WASBLIPAnalyzeImage_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASBLIPAnalyzeImage_input = {
    image: IMAGE | HasSingle_IMAGE
    mode: Enum_WASBLIPAnalyzeImage_mode | HasSingle_Enum_WASBLIPAnalyzeImage_mode
    /** default="What does the background consist of?" */
    question?: STRING
}

// |=============================================================================|
// | WASSAMModelLoader                                                           |
// |=============================================================================|
export interface WASSAMModelLoader extends HasSingle_SAM_MODEL, ComfyNode<WASSAMModelLoader_input> {
    SAM_MODEL: Slot<'SAM_MODEL', 0>
}
export type WASSAMModelLoader_input = {
    model_size: Enum_WASSAMModelLoader_model_size | HasSingle_Enum_WASSAMModelLoader_model_size
}

// |=============================================================================|
// | WASSAMParameters                                                            |
// |=============================================================================|
export interface WASSAMParameters extends HasSingle_SAM_PARAMETERS, ComfyNode<WASSAMParameters_input> {
    SAM_PARAMETERS: Slot<'SAM_PARAMETERS', 0>
}
export type WASSAMParameters_input = {
    /** default="[128, 128]; [0, 0]" */
    points?: STRING
    /** default="[1, 0]" */
    labels?: STRING
}

// |=============================================================================|
// | WASSAMParametersCombine                                                     |
// |=============================================================================|
export interface WASSAMParametersCombine extends HasSingle_SAM_PARAMETERS, ComfyNode<WASSAMParametersCombine_input> {
    SAM_PARAMETERS: Slot<'SAM_PARAMETERS', 0>
}
export type WASSAMParametersCombine_input = {
    sam_parameters_a: SAM_PARAMETERS | HasSingle_SAM_PARAMETERS
    sam_parameters_b: SAM_PARAMETERS | HasSingle_SAM_PARAMETERS
}

// |=============================================================================|
// | WASSAMImageMask                                                             |
// |=============================================================================|
export interface WASSAMImageMask extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<WASSAMImageMask_input> {
    IMAGE: Slot<'IMAGE', 0>
    MASK: Slot<'MASK', 1>
}
export type WASSAMImageMask_input = {
    sam_model: SAM_MODEL | HasSingle_SAM_MODEL
    sam_parameters: SAM_PARAMETERS | HasSingle_SAM_PARAMETERS
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | WASStringToText                                                             |
// |=============================================================================|
export interface WASStringToText extends HasSingle_ASCII, ComfyNode<WASStringToText_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASStringToText_input = {
    /** */
    string: STRING
}

// |=============================================================================|
// | WASImageBounds                                                              |
// |=============================================================================|
export interface WASImageBounds extends HasSingle_IMAGE_BOUNDS, ComfyNode<WASImageBounds_input> {
    IMAGE_BOUNDS: Slot<'IMAGE_BOUNDS', 0>
}
export type WASImageBounds_input = {
    image: IMAGE | HasSingle_IMAGE
}

// |=============================================================================|
// | WASInsetImageBounds                                                         |
// |=============================================================================|
export interface WASInsetImageBounds extends HasSingle_IMAGE_BOUNDS, ComfyNode<WASInsetImageBounds_input> {
    IMAGE_BOUNDS: Slot<'IMAGE_BOUNDS', 0>
}
export type WASInsetImageBounds_input = {
    image_bounds: IMAGE_BOUNDS | HasSingle_IMAGE_BOUNDS
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    inset_left?: INT
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    inset_right?: INT
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    inset_top?: INT
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    inset_bottom?: INT
}

// |=============================================================================|
// | WASBoundedImageBlend                                                        |
// |=============================================================================|
export interface WASBoundedImageBlend extends HasSingle_IMAGE, ComfyNode<WASBoundedImageBlend_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASBoundedImageBlend_input = {
    target: IMAGE | HasSingle_IMAGE
    target_bounds: IMAGE_BOUNDS | HasSingle_IMAGE_BOUNDS
    source: IMAGE | HasSingle_IMAGE
    /** default=1 min=1 max=1 */
    blend_factor?: FLOAT
    /** default=16 min=18446744073709552000 max=18446744073709552000 */
    feathering?: INT
}

// |=============================================================================|
// | WASBoundedImageBlendWithMask                                                |
// |=============================================================================|
export interface WASBoundedImageBlendWithMask extends HasSingle_IMAGE, ComfyNode<WASBoundedImageBlendWithMask_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASBoundedImageBlendWithMask_input = {
    target: IMAGE | HasSingle_IMAGE
    target_mask: MASK | HasSingle_MASK
    target_bounds: IMAGE_BOUNDS | HasSingle_IMAGE_BOUNDS
    source: IMAGE | HasSingle_IMAGE
    /** default=1 min=1 max=1 */
    blend_factor?: FLOAT
    /** default=16 min=18446744073709552000 max=18446744073709552000 */
    feathering?: INT
}

// |=============================================================================|
// | WASBoundedImageCrop                                                         |
// |=============================================================================|
export interface WASBoundedImageCrop extends HasSingle_IMAGE, ComfyNode<WASBoundedImageCrop_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASBoundedImageCrop_input = {
    image: IMAGE | HasSingle_IMAGE
    image_bounds: IMAGE_BOUNDS | HasSingle_IMAGE_BOUNDS
}

// |=============================================================================|
// | WASBoundedImageCropWithMask                                                 |
// |=============================================================================|
export interface WASBoundedImageCropWithMask
    extends HasSingle_IMAGE,
        HasSingle_IMAGE_BOUNDS,
        ComfyNode<WASBoundedImageCropWithMask_input> {
    IMAGE: Slot<'IMAGE', 0>
    IMAGE_BOUNDS: Slot<'IMAGE_BOUNDS', 1>
}
export type WASBoundedImageCropWithMask_input = {
    image: IMAGE | HasSingle_IMAGE
    mask: MASK | HasSingle_MASK
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    padding_left?: INT
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    padding_right?: INT
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    padding_top?: INT
    /** default=64 min=18446744073709552000 max=18446744073709552000 */
    padding_bottom?: INT
}

// |=============================================================================|
// | WASTextDictionaryUpdate                                                     |
// |=============================================================================|
export interface WASTextDictionaryUpdate extends HasSingle_DICT, ComfyNode<WASTextDictionaryUpdate_input> {
    DICT: Slot<'DICT', 0>
}
export type WASTextDictionaryUpdate_input = {
    dictionary_a: DICT | HasSingle_DICT
    dictionary_b: DICT | HasSingle_DICT
    dictionary_c?: DICT | HasSingle_DICT
    dictionary_d?: DICT | HasSingle_DICT
}

// |=============================================================================|
// | WASTextAddTokens                                                            |
// |=============================================================================|
export interface WASTextAddTokens extends ComfyNode<WASTextAddTokens_input> {}
export type WASTextAddTokens_input = {
    /** default="[hello]: world" */
    tokens?: STRING
}

// |=============================================================================|
// | WASTextAddTokenByInput                                                      |
// |=============================================================================|
export interface WASTextAddTokenByInput extends ComfyNode<WASTextAddTokenByInput_input> {}
export type WASTextAddTokenByInput_input = {
    token_name: ASCII | HasSingle_ASCII
    token_value: ASCII | HasSingle_ASCII
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
    linebreak_addition: Enum_WASCreateGridImage_include_subfolders | HasSingle_Enum_WASCreateGridImage_include_subfolders
    text_c?: ASCII | HasSingle_ASCII
    text_d?: ASCII | HasSingle_ASCII
}

// |=============================================================================|
// | WASTextFileHistoryLoader                                                    |
// |=============================================================================|
export interface WASTextFileHistoryLoader extends HasSingle_ASCII, HasSingle_DICT, ComfyNode<WASTextFileHistoryLoader_input> {
    ASCII: Slot<'ASCII', 0>
    DICT: Slot<'DICT', 1>
}
export type WASTextFileHistoryLoader_input = {
    file: Enum_WASTextFileHistoryLoader_file | HasSingle_Enum_WASTextFileHistoryLoader_file
    /** default="[filename]" */
    dictionary_name?: STRING
}

// |=============================================================================|
// | WASTextFindAndReplaceByDictionary                                           |
// |=============================================================================|
export interface WASTextFindAndReplaceByDictionary extends HasSingle_ASCII, ComfyNode<WASTextFindAndReplaceByDictionary_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextFindAndReplaceByDictionary_input = {
    text: ASCII | HasSingle_ASCII
    dictionary: DICT | HasSingle_DICT
    /** default="__" */
    replacement_key?: STRING
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
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
// | WASTextFindAndReplace                                                       |
// |=============================================================================|
export interface WASTextFindAndReplace extends HasSingle_ASCII, ComfyNode<WASTextFindAndReplace_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextFindAndReplace_input = {
    text: ASCII | HasSingle_ASCII
    /** default="" */
    find?: STRING
    /** default="" */
    replace?: STRING
}

// |=============================================================================|
// | WASTextInputSwitch                                                          |
// |=============================================================================|
export interface WASTextInputSwitch extends HasSingle_ASCII, ComfyNode<WASTextInputSwitch_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextInputSwitch_input = {
    text_a: ASCII | HasSingle_ASCII
    text_b: ASCII | HasSingle_ASCII
    boolean_number: NUMBER | HasSingle_NUMBER
}

// |=============================================================================|
// | WASTextMultiline                                                            |
// |=============================================================================|
export interface WASTextMultiline extends HasSingle_ASCII, ComfyNode<WASTextMultiline_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextMultiline_input = {
    /** default="" */
    text?: STRING
}

// |=============================================================================|
// | WASTextParseA1111Embeddings                                                 |
// |=============================================================================|
export interface WASTextParseA1111Embeddings extends HasSingle_ASCII, ComfyNode<WASTextParseA1111Embeddings_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextParseA1111Embeddings_input = {
    text: ASCII | HasSingle_ASCII
}

// |=============================================================================|
// | WASTextParseNoodleSoupPrompts                                               |
// |=============================================================================|
export interface WASTextParseNoodleSoupPrompts extends HasSingle_ASCII, ComfyNode<WASTextParseNoodleSoupPrompts_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextParseNoodleSoupPrompts_input = {
    /** default="__" */
    noodle_key?: STRING
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    text: ASCII | HasSingle_ASCII
}

// |=============================================================================|
// | WASTextParseTokens                                                          |
// |=============================================================================|
export interface WASTextParseTokens extends HasSingle_ASCII, ComfyNode<WASTextParseTokens_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextParseTokens_input = {
    text: ASCII | HasSingle_ASCII
}

// |=============================================================================|
// | WASTextRandomLine                                                           |
// |=============================================================================|
export interface WASTextRandomLine extends HasSingle_ASCII, ComfyNode<WASTextRandomLine_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextRandomLine_input = {
    text: ASCII | HasSingle_ASCII
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
}

// |=============================================================================|
// | WASTextString                                                               |
// |=============================================================================|
export interface WASTextString extends ComfyNode<WASTextString_input> {
    ASCII: Slot<'ASCII', 0>
    ASCII_1: Slot<'ASCII', 1>
    ASCII_2: Slot<'ASCII', 2>
    ASCII_3: Slot<'ASCII', 3>
}
export type WASTextString_input = {
    /** default="" */
    text?: STRING
    /** default="" */
    text_b?: STRING
    /** default="" */
    text_c?: STRING
    /** default="" */
    text_d?: STRING
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
// | WASTextToConsole                                                            |
// |=============================================================================|
export interface WASTextToConsole extends HasSingle_ASCII, ComfyNode<WASTextToConsole_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextToConsole_input = {
    text: ASCII | HasSingle_ASCII
    /** default="Text Output" */
    label?: STRING
}

// |=============================================================================|
// | WASTextToNumber                                                             |
// |=============================================================================|
export interface WASTextToNumber extends HasSingle_NUMBER, ComfyNode<WASTextToNumber_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASTextToNumber_input = {
    text: ASCII | HasSingle_ASCII
}

// |=============================================================================|
// | WASTextToString                                                             |
// |=============================================================================|
export interface WASTextToString extends HasSingle_STRING, ComfyNode<WASTextToString_input> {
    STRING: Slot<'STRING', 0>
}
export type WASTextToString_input = {
    text: ASCII | HasSingle_ASCII
}

// |=============================================================================|
// | WASTrueRandomOrgNumberGenerator                                             |
// |=============================================================================|
export interface WASTrueRandomOrgNumberGenerator extends HasSingle_NUMBER, ComfyNode<WASTrueRandomOrgNumberGenerator_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASTrueRandomOrgNumberGenerator_input = {
    /** default="00000000-0000-0000-0000-000000000000" */
    api_key?: STRING
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    minimum?: FLOAT
    /** default=10000000 min=18446744073709552000 max=18446744073709552000 */
    maximum?: FLOAT
}

// |=============================================================================|
// | WASUnCLIPCheckpointLoader                                                   |
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
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name | HasSingle_Enum_CheckpointLoaderSimple_ckpt_name
}

// |=============================================================================|
// | WASUpscaleModelLoader                                                       |
// |=============================================================================|
export interface WASUpscaleModelLoader extends HasSingle_UPSCALE_MODEL, HasSingle_ASCII, ComfyNode<WASUpscaleModelLoader_input> {
    UPSCALE_MODEL: Slot<'UPSCALE_MODEL', 0>
    ASCII: Slot<'ASCII', 1>
}
export type WASUpscaleModelLoader_input = {
    model_name: Enum_WASUpscaleModelLoader_model_name | HasSingle_Enum_WASUpscaleModelLoader_model_name
}

// |=============================================================================|
// | WASWriteToGIF                                                               |
// |=============================================================================|
export interface WASWriteToGIF extends HasSingle_IMAGE, ComfyNode<WASWriteToGIF_input> {
    IMAGE: Slot<'IMAGE', 0>
    ASCII: Slot<'ASCII', 1>
    ASCII_1: Slot<'ASCII', 2>
}
export type WASWriteToGIF_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=30 min=60 max=60 step=1 */
    transition_frames?: INT
    /** default=2500 min=60000 max=60000 step=0.1 */
    image_delay_ms?: FLOAT
    /** default=0.1 min=60000 max=60000 step=0.1 */
    duration_ms?: FLOAT
    /** default=0 min=100 max=100 step=1 */
    loops?: INT
    /** default=512 min=1280 max=1280 step=1 */
    max_size?: INT
    /** default="./ComfyUI/output" */
    output_path?: STRING
    /** default="morph_writer" */
    filename?: STRING
}

// |=============================================================================|
// | WASWriteToVideo                                                             |
// |=============================================================================|
export interface WASWriteToVideo extends HasSingle_IMAGE, ComfyNode<WASWriteToVideo_input> {
    IMAGE: Slot<'IMAGE', 0>
    ASCII: Slot<'ASCII', 1>
    ASCII_1: Slot<'ASCII', 2>
}
export type WASWriteToVideo_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=30 min=120 max=120 step=1 */
    transition_frames?: INT
    /** default=2.5 min=60000 max=60000 step=0.1 */
    image_delay_sec?: FLOAT
    /** default=30 min=60 max=60 step=1 */
    fps?: INT
    /** default=512 min=1920 max=1920 step=1 */
    max_size?: INT
    /** default="./ComfyUI/output" */
    output_path?: STRING
    /** default="comfy_writer" */
    filename?: STRING
    codec: Enum_WASCreateVideoFromPath_codec | HasSingle_Enum_WASCreateVideoFromPath_codec
}

// |=============================================================================|
// | YKImagePadForOutpaint                                                       |
// |=============================================================================|
export interface YKImagePadForOutpaint extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<YKImagePadForOutpaint_input> {
    IMAGE: Slot<'IMAGE', 0>
    MASK: Slot<'MASK', 1>
}
export type YKImagePadForOutpaint_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=0 min=4096 max=4096 step=64 */
    left?: INT
    /** default=0 min=4096 max=4096 step=64 */
    top?: INT
    /** default=0 min=4096 max=4096 step=64 */
    right?: INT
    /** default=0 min=4096 max=4096 step=64 */
    bottom?: INT
    /** default=0 min=4096 max=4096 step=1 */
    feathering?: INT
}

// |=============================================================================|
// | YKMaskToImage                                                               |
// |=============================================================================|
export interface YKMaskToImage extends HasSingle_IMAGE, ComfyNode<YKMaskToImage_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type YKMaskToImage_input = {
    mask: MASK | HasSingle_MASK
}

// |=============================================================================|
// | HypernetworkLoader                                                          |
// |=============================================================================|
export interface HypernetworkLoader extends HasSingle_MODEL, ComfyNode<HypernetworkLoader_input> {
    MODEL: Slot<'MODEL', 0>
}
export type HypernetworkLoader_input = {
    model: MODEL | HasSingle_MODEL
    hypernetwork_name: Enum_CLIPLoader_clip_name | HasSingle_Enum_CLIPLoader_clip_name
    /** default=1 min=10 max=10 step=0.01 */
    strength?: FLOAT
}

// |=============================================================================|
// | UpscaleModelLoader                                                          |
// |=============================================================================|
export interface UpscaleModelLoader extends HasSingle_UPSCALE_MODEL, ComfyNode<UpscaleModelLoader_input> {
    UPSCALE_MODEL: Slot<'UPSCALE_MODEL', 0>
}
export type UpscaleModelLoader_input = {
    model_name: Enum_WASUpscaleModelLoader_model_name | HasSingle_Enum_WASUpscaleModelLoader_model_name
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

// |=============================================================================|
// | ImageBlend                                                                  |
// |=============================================================================|
export interface ImageBlend extends HasSingle_IMAGE, ComfyNode<ImageBlend_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageBlend_input = {
    image1: IMAGE | HasSingle_IMAGE
    image2: IMAGE | HasSingle_IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    blend_factor?: FLOAT
    blend_mode: Enum_ImageBlend_blend_mode | HasSingle_Enum_ImageBlend_blend_mode
}

// |=============================================================================|
// | ImageBlur                                                                   |
// |=============================================================================|
export interface ImageBlur extends HasSingle_IMAGE, ComfyNode<ImageBlur_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageBlur_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=1 min=31 max=31 step=1 */
    blur_radius?: INT
    /** default=1 min=10 max=10 step=0.1 */
    sigma?: FLOAT
}

// |=============================================================================|
// | ImageQuantize                                                               |
// |=============================================================================|
export interface ImageQuantize extends HasSingle_IMAGE, ComfyNode<ImageQuantize_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageQuantize_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=256 min=256 max=256 step=1 */
    colors?: INT
    dither: Enum_ImageQuantize_dither | HasSingle_Enum_ImageQuantize_dither
}

// |=============================================================================|
// | ImageSharpen                                                                |
// |=============================================================================|
export interface ImageSharpen extends HasSingle_IMAGE, ComfyNode<ImageSharpen_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageSharpen_input = {
    image: IMAGE | HasSingle_IMAGE
    /** default=1 min=31 max=31 step=1 */
    sharpen_radius?: INT
    /** default=1 min=5 max=5 step=0.1 */
    alpha?: FLOAT
}

// |=============================================================================|
// | LatentCompositeMasked                                                       |
// |=============================================================================|
export interface LatentCompositeMasked extends HasSingle_LATENT, ComfyNode<LatentCompositeMasked_input> {
    LATENT: Slot<'LATENT', 0>
}
export type LatentCompositeMasked_input = {
    destination: LATENT | HasSingle_LATENT
    source: LATENT | HasSingle_LATENT
    /** default=0 min=8192 max=8192 step=8 */
    x?: INT
    /** default=0 min=8192 max=8192 step=8 */
    y?: INT
    mask?: MASK | HasSingle_MASK
}

// |=============================================================================|
// | MaskToImage                                                                 |
// |=============================================================================|
export interface MaskToImage extends HasSingle_IMAGE, ComfyNode<MaskToImage_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type MaskToImage_input = {
    mask: MASK | HasSingle_MASK
}

// |=============================================================================|
// | ImageToMask                                                                 |
// |=============================================================================|
export interface ImageToMask extends HasSingle_MASK, ComfyNode<ImageToMask_input> {
    MASK: Slot<'MASK', 0>
}
export type ImageToMask_input = {
    image: IMAGE | HasSingle_IMAGE
    channel: Enum_WASImageSelectChannel_channel | HasSingle_Enum_WASImageSelectChannel_channel
}

// |=============================================================================|
// | SolidMask                                                                   |
// |=============================================================================|
export interface SolidMask extends HasSingle_MASK, ComfyNode<SolidMask_input> {
    MASK: Slot<'MASK', 0>
}
export type SolidMask_input = {
    /** default=1 min=1 max=1 step=0.01 */
    value?: FLOAT
    /** default=512 min=8192 max=8192 step=1 */
    width?: INT
    /** default=512 min=8192 max=8192 step=1 */
    height?: INT
}

// |=============================================================================|
// | InvertMask                                                                  |
// |=============================================================================|
export interface InvertMask extends HasSingle_MASK, ComfyNode<InvertMask_input> {
    MASK: Slot<'MASK', 0>
}
export type InvertMask_input = {
    mask: MASK | HasSingle_MASK
}

// |=============================================================================|
// | CropMask                                                                    |
// |=============================================================================|
export interface CropMask extends HasSingle_MASK, ComfyNode<CropMask_input> {
    MASK: Slot<'MASK', 0>
}
export type CropMask_input = {
    mask: MASK | HasSingle_MASK
    /** default=0 min=8192 max=8192 step=1 */
    x?: INT
    /** default=0 min=8192 max=8192 step=1 */
    y?: INT
    /** default=512 min=8192 max=8192 step=1 */
    width?: INT
    /** default=512 min=8192 max=8192 step=1 */
    height?: INT
}

// |=============================================================================|
// | MaskComposite                                                               |
// |=============================================================================|
export interface MaskComposite extends HasSingle_MASK, ComfyNode<MaskComposite_input> {
    MASK: Slot<'MASK', 0>
}
export type MaskComposite_input = {
    destination: MASK | HasSingle_MASK
    source: MASK | HasSingle_MASK
    /** default=0 min=8192 max=8192 step=1 */
    x?: INT
    /** default=0 min=8192 max=8192 step=1 */
    y?: INT
    operation: Enum_MaskComposite_operation | HasSingle_Enum_MaskComposite_operation
}

// |=============================================================================|
// | FeatherMask                                                                 |
// |=============================================================================|
export interface FeatherMask extends HasSingle_MASK, ComfyNode<FeatherMask_input> {
    MASK: Slot<'MASK', 0>
}
export type FeatherMask_input = {
    mask: MASK | HasSingle_MASK
    /** default=0 min=8192 max=8192 step=1 */
    left?: INT
    /** default=0 min=8192 max=8192 step=1 */
    top?: INT
    /** default=0 min=8192 max=8192 step=1 */
    right?: INT
    /** default=0 min=8192 max=8192 step=1 */
    bottom?: INT
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
    LatentFromBatch: ComfyNodeSchemaJSON
    SaveImage: ComfyNodeSchemaJSON
    PreviewImage: ComfyNodeSchemaJSON
    LoadImage: ComfyNodeSchemaJSON
    LoadImageMask: ComfyNodeSchemaJSON
    ImageScale: ComfyNodeSchemaJSON
    ImageInvert: ComfyNodeSchemaJSON
    ImagePadForOutpaint: ComfyNodeSchemaJSON
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
    TomePatchModel: ComfyNodeSchemaJSON
    UnCLIPCheckpointLoader: ComfyNodeSchemaJSON
    GLIGENLoader: ComfyNodeSchemaJSON
    GLIGENTextBoxApply: ComfyNodeSchemaJSON
    CheckpointLoader: ComfyNodeSchemaJSON
    DiffusersLoader: ComfyNodeSchemaJSON
    BrightnessContrast: ComfyNodeSchemaJSON
    ImpactMMDetLoader: ComfyNodeSchemaJSON
    ImpactSAMLoader: ComfyNodeSchemaJSON
    ImpactONNXLoader: ComfyNodeSchemaJSON
    ImpactBboxDetectorForEach: ComfyNodeSchemaJSON
    ImpactSegmDetectorForEach: ComfyNodeSchemaJSON
    ImpactONNXDetectorForEach: ComfyNodeSchemaJSON
    ImpactBitwiseAndMaskForEach: ComfyNodeSchemaJSON
    ImpactDetailerForEach: ComfyNodeSchemaJSON
    ImpactDetailerForEachDebug: ComfyNodeSchemaJSON
    ImpactBboxDetectorCombined: ComfyNodeSchemaJSON
    ImpactSegmDetectorCombined: ComfyNodeSchemaJSON
    ImpactSAMDetectorCombined: ComfyNodeSchemaJSON
    ImpactFaceDetailer: ComfyNodeSchemaJSON
    ImpactFaceDetailerPipe: ComfyNodeSchemaJSON
    ImpactBitwiseAndMask: ComfyNodeSchemaJSON
    ImpactSubtractMask: ComfyNodeSchemaJSON
    ImpactSegsMask: ComfyNodeSchemaJSON
    ImpactSegsMaskCombine: ComfyNodeSchemaJSON
    ImpactEmptySegs: ComfyNodeSchemaJSON
    ImpactMaskToSEGS: ComfyNodeSchemaJSON
    ImpactToBinaryMask: ComfyNodeSchemaJSON
    ImpactMaskPainter: ComfyNodeSchemaJSON
    RandomLatentImage: ComfyNodeSchemaJSON
    VAEDecodeBatched: ComfyNodeSchemaJSON
    VAEEncodeBatched: ComfyNodeSchemaJSON
    LatentToImage: ComfyNodeSchemaJSON
    LatentToHist: ComfyNodeSchemaJSON
    KSamplerSetting: ComfyNodeSchemaJSON
    KSamplerOverrided: ComfyNodeSchemaJSON
    KSamplerXYZ: ComfyNodeSchemaJSON
    StateDictLoader: ComfyNodeSchemaJSON
    Dict2Model: ComfyNodeSchemaJSON
    ModelIter: ComfyNodeSchemaJSON
    CLIPIter: ComfyNodeSchemaJSON
    VAEIter: ComfyNodeSchemaJSON
    StateDictMerger: ComfyNodeSchemaJSON
    StateDictMergerBlockWeighted: ComfyNodeSchemaJSON
    StateDictMergerBlockWeightedMulti: ComfyNodeSchemaJSON
    ImageBlend2: ComfyNodeSchemaJSON
    GridImage: ComfyNodeSchemaJSON
    SaveText: ComfyNodeSchemaJSON
    BNK_CutoffBasePrompt: ComfyNodeSchemaJSON
    BNK_CutoffSetRegions: ComfyNodeSchemaJSON
    BNK_CutoffRegionsToConditioning: ComfyNodeSchemaJSON
    BNK_CutoffRegionsToConditioning_ADV: ComfyNodeSchemaJSON
    MultiLatentComposite: ComfyNodeSchemaJSON
    MultiAreaConditioning: ComfyNodeSchemaJSON
    ConditioningUpscale: ComfyNodeSchemaJSON
    ConditioningStretch: ComfyNodeSchemaJSON
    ClipSeg: ComfyNodeSchemaJSON
    CannyEdgePreprocessor: ComfyNodeSchemaJSON
    MLSDPreprocessor: ComfyNodeSchemaJSON
    HEDPreprocessor: ComfyNodeSchemaJSON
    ScribblePreprocessor: ComfyNodeSchemaJSON
    FakeScribblePreprocessor: ComfyNodeSchemaJSON
    BinaryPreprocessor: ComfyNodeSchemaJSON
    PiDiNetPreprocessor: ComfyNodeSchemaJSON
    LineArtPreprocessor: ComfyNodeSchemaJSON
    AnimeLineArtPreprocessor: ComfyNodeSchemaJSON
    Manga2AnimeLineArtPreprocessor: ComfyNodeSchemaJSON
    MiDaSDepthMapPreprocessor: ComfyNodeSchemaJSON
    MiDaSNormalMapPreprocessor: ComfyNodeSchemaJSON
    LeReSDepthMapPreprocessor: ComfyNodeSchemaJSON
    ZoeDepthMapPreprocessor: ComfyNodeSchemaJSON
    BAENormalMapPreprocessor: ComfyNodeSchemaJSON
    OpenposePreprocessor: ComfyNodeSchemaJSON
    MediaPipeHandPosePreprocessor: ComfyNodeSchemaJSON
    SemSegPreprocessor: ComfyNodeSchemaJSON
    UniFormerSemSegPreprocessor: ComfyNodeSchemaJSON
    OneFormerCOCOSemSegPreprocessor: ComfyNodeSchemaJSON
    OneFormerADE20KSemSegPreprocessor: ComfyNodeSchemaJSON
    MediaPipeFaceMeshPreprocessor: ComfyNodeSchemaJSON
    ColorPreprocessor: ComfyNodeSchemaJSON
    TilePreprocessor: ComfyNodeSchemaJSON
    CLIPRegionsBasePrompt: ComfyNodeSchemaJSON
    CLIPSetRegion: ComfyNodeSchemaJSON
    CLIPRegionsToConditioning: ComfyNodeSchemaJSON
    KSamplerEfficient: ComfyNodeSchemaJSON
    EfficientLoader: ComfyNodeSchemaJSON
    XYPlot: ComfyNodeSchemaJSON
    ImageOverlay: ComfyNodeSchemaJSON
    EvaluateIntegers: ComfyNodeSchemaJSON
    EvaluateStrings: ComfyNodeSchemaJSON
    GaussianBlur: ComfyNodeSchemaJSON
    HistogramEqualization: ComfyNodeSchemaJSON
    WASImageFlip: ComfyNodeSchemaJSON
    LatentUpscaleMultiply: ComfyNodeSchemaJSON
    PseudoHDRStyle: ComfyNodeSchemaJSON
    Saturation: ComfyNodeSchemaJSON
    ImageSharpening: ComfyNodeSchemaJSON
    WASCheckpointLoader: ComfyNodeSchemaJSON
    WASCheckpointLoaderSimple: ComfyNodeSchemaJSON
    WASCLIPTextEncodeNSP: ComfyNodeSchemaJSON
    WASConditioningInputSwitch: ComfyNodeSchemaJSON
    WASConstantNumber: ComfyNodeSchemaJSON
    WASCreateGridImage: ComfyNodeSchemaJSON
    WASCreateMorphImage: ComfyNodeSchemaJSON
    WASCreateMorphImageFromPath: ComfyNodeSchemaJSON
    WASCreateVideoFromPath: ComfyNodeSchemaJSON
    WASDebugNumberToConsole: ComfyNodeSchemaJSON
    WASDictionaryToConsole: ComfyNodeSchemaJSON
    WASDiffusersModelLoader: ComfyNodeSchemaJSON
    WASLatentInputSwitch: ComfyNodeSchemaJSON
    WASLogicBoolean: ComfyNodeSchemaJSON
    WASLoraLoader: ComfyNodeSchemaJSON
    WASImageAnalyze: ComfyNodeSchemaJSON
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
    WASImagePasteFace: ComfyNodeSchemaJSON
    WASImagePasteCrop: ComfyNodeSchemaJSON
    WASImagePasteCropByLocation: ComfyNodeSchemaJSON
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
    WASImagePerlinNoiseFilter: ComfyNodeSchemaJSON
    WASImageRemoveBackgroundAlpha: ComfyNodeSchemaJSON
    WASImageRemoveColor: ComfyNodeSchemaJSON
    WASImageResize: ComfyNodeSchemaJSON
    WASImageRotate: ComfyNodeSchemaJSON
    WASImageSave: ComfyNodeSchemaJSON
    WASImageSeamlessTexture: ComfyNodeSchemaJSON
    WASImageSelectChannel: ComfyNodeSchemaJSON
    WASImageSelectColor: ComfyNodeSchemaJSON
    WASImageShadowsAndHighlights: ComfyNodeSchemaJSON
    WASImageSizeToNumber: ComfyNodeSchemaJSON
    WASImageStitch: ComfyNodeSchemaJSON
    WASImageStyleFilter: ComfyNodeSchemaJSON
    WASImageThreshold: ComfyNodeSchemaJSON
    WASImageTranspose: ComfyNodeSchemaJSON
    WASImageFDOFFilter: ComfyNodeSchemaJSON
    WASImageToLatentMask: ComfyNodeSchemaJSON
    WASImageVoronoiNoiseFilter: ComfyNodeSchemaJSON
    WASKSamplerWAS: ComfyNodeSchemaJSON
    WASLatentNoiseInjection: ComfyNodeSchemaJSON
    WASLatentSizeToNumber: ComfyNodeSchemaJSON
    WASLatentUpscaleByFactorWAS: ComfyNodeSchemaJSON
    WASLoadImageBatch: ComfyNodeSchemaJSON
    WASLoadTextFile: ComfyNodeSchemaJSON
    WASMiDaSDepthApproximation: ComfyNodeSchemaJSON
    WASMiDaSMaskImage: ComfyNodeSchemaJSON
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
    WASTextConcatenate: ComfyNodeSchemaJSON
    WASTextFileHistoryLoader: ComfyNodeSchemaJSON
    WASTextFindAndReplaceByDictionary: ComfyNodeSchemaJSON
    WASTextFindAndReplaceInput: ComfyNodeSchemaJSON
    WASTextFindAndReplace: ComfyNodeSchemaJSON
    WASTextInputSwitch: ComfyNodeSchemaJSON
    WASTextMultiline: ComfyNodeSchemaJSON
    WASTextParseA1111Embeddings: ComfyNodeSchemaJSON
    WASTextParseNoodleSoupPrompts: ComfyNodeSchemaJSON
    WASTextParseTokens: ComfyNodeSchemaJSON
    WASTextRandomLine: ComfyNodeSchemaJSON
    WASTextString: ComfyNodeSchemaJSON
    WASTextToConditioning: ComfyNodeSchemaJSON
    WASTextToConsole: ComfyNodeSchemaJSON
    WASTextToNumber: ComfyNodeSchemaJSON
    WASTextToString: ComfyNodeSchemaJSON
    WASTrueRandomOrgNumberGenerator: ComfyNodeSchemaJSON
    WASUnCLIPCheckpointLoader: ComfyNodeSchemaJSON
    WASUpscaleModelLoader: ComfyNodeSchemaJSON
    WASWriteToGIF: ComfyNodeSchemaJSON
    WASWriteToVideo: ComfyNodeSchemaJSON
    YKImagePadForOutpaint: ComfyNodeSchemaJSON
    YKMaskToImage: ComfyNodeSchemaJSON
    HypernetworkLoader: ComfyNodeSchemaJSON
    UpscaleModelLoader: ComfyNodeSchemaJSON
    ImageUpscaleWithModel: ComfyNodeSchemaJSON
    ImageBlend: ComfyNodeSchemaJSON
    ImageBlur: ComfyNodeSchemaJSON
    ImageQuantize: ComfyNodeSchemaJSON
    ImageSharpen: ComfyNodeSchemaJSON
    LatentCompositeMasked: ComfyNodeSchemaJSON
    MaskToImage: ComfyNodeSchemaJSON
    ImageToMask: ComfyNodeSchemaJSON
    SolidMask: ComfyNodeSchemaJSON
    InvertMask: ComfyNodeSchemaJSON
    CropMask: ComfyNodeSchemaJSON
    MaskComposite: ComfyNodeSchemaJSON
    FeatherMask: ComfyNodeSchemaJSON
}

export type ComfyNodeType = keyof Schemas

declare global {
    declare const WORKFLOW: WorkflowType
}
