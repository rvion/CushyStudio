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
    LatentFromBatch(args: LatentFromBatch_input, uid?: ComfyNodeUID): LatentFromBatch
    /* category=image output= */
    SaveImage(args: SaveImage_input, uid?: ComfyNodeUID): SaveImage
    /* category=image output= */
    PreviewImage(args: PreviewImage_input, uid?: ComfyNodeUID): PreviewImage
    /* category=image output=IMAGE, MASK */
    LoadImage(args: LoadImage_input, uid?: ComfyNodeUID): LoadImage
    /* category=mask output=MASK */
    LoadImageMask(args: LoadImageMask_input, uid?: ComfyNodeUID): LoadImageMask
    /* category=image_upscaling output=IMAGE */
    ImageScale(args: ImageScale_input, uid?: ComfyNodeUID): ImageScale
    /* category=image output=IMAGE */
    ImageInvert(args: ImageInvert_input, uid?: ComfyNodeUID): ImageInvert
    /* category=image output=IMAGE, MASK */
    ImagePadForOutpaint(args: ImagePadForOutpaint_input, uid?: ComfyNodeUID): ImagePadForOutpaint
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
    /* category=loaders output=CLIP */
    CLIPLoader(args: CLIPLoader_input, uid?: ComfyNodeUID): CLIPLoader
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
    /* category=_for_testing output=IMAGE */
    VAEDecodeTiled(args: VAEDecodeTiled_input, uid?: ComfyNodeUID): VAEDecodeTiled
    /* category=_for_testing output=LATENT */
    VAEEncodeTiled(args: VAEEncodeTiled_input, uid?: ComfyNodeUID): VAEEncodeTiled
    /* category=_for_testing output=MODEL */
    TomePatchModel(args: TomePatchModel_input, uid?: ComfyNodeUID): TomePatchModel
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
    /* category=Image Processing output=IMAGE */
    BrightnessContrast(args: BrightnessContrast_input, uid?: ComfyNodeUID): BrightnessContrast
    /* category=ImpactPack output=BBOX_MODEL, SEGM_MODEL */
    ImpactMMDetLoader(args: ImpactMMDetLoader_input, uid?: ComfyNodeUID): ImpactMMDetLoader
    /* category=ImpactPack output=SAM_MODEL */
    ImpactSAMLoader(args: ImpactSAMLoader_input, uid?: ComfyNodeUID): ImpactSAMLoader
    /* category=ImpactPack output=ONNX_MODEL */
    ImpactONNXLoader(args: ImpactONNXLoader_input, uid?: ComfyNodeUID): ImpactONNXLoader
    /* category=ImpactPack_Detector output=SEGS */
    ImpactBboxDetectorForEach(args: ImpactBboxDetectorForEach_input, uid?: ComfyNodeUID): ImpactBboxDetectorForEach
    /* category=ImpactPack_Detector output=SEGS */
    ImpactSegmDetectorForEach(args: ImpactSegmDetectorForEach_input, uid?: ComfyNodeUID): ImpactSegmDetectorForEach
    /* category=ImpactPack_Detector output=SEGS */
    ImpactONNXDetectorForEach(args: ImpactONNXDetectorForEach_input, uid?: ComfyNodeUID): ImpactONNXDetectorForEach
    /* category=ImpactPack_Operation output=SEGS */
    ImpactBitwiseAndMaskForEach(args: ImpactBitwiseAndMaskForEach_input, uid?: ComfyNodeUID): ImpactBitwiseAndMaskForEach
    /* category=ImpactPack_Detailer output=IMAGE */
    ImpactDetailerForEach(args: ImpactDetailerForEach_input, uid?: ComfyNodeUID): ImpactDetailerForEach
    /* category=ImpactPack_Detailer output=IMAGE, IMAGE_1, IMAGE_2 */
    ImpactDetailerForEachDebug(args: ImpactDetailerForEachDebug_input, uid?: ComfyNodeUID): ImpactDetailerForEachDebug
    /* category=ImpactPack_Detector output=MASK */
    ImpactBboxDetectorCombined(args: ImpactBboxDetectorCombined_input, uid?: ComfyNodeUID): ImpactBboxDetectorCombined
    /* category=ImpactPack_Detector output=MASK */
    ImpactSegmDetectorCombined(args: ImpactSegmDetectorCombined_input, uid?: ComfyNodeUID): ImpactSegmDetectorCombined
    /* category=ImpactPack_Detector output=MASK */
    ImpactSAMDetectorCombined(args: ImpactSAMDetectorCombined_input, uid?: ComfyNodeUID): ImpactSAMDetectorCombined
    /* category=ImpactPack_Simple output=IMAGE, MASK, DETAILER_PIPE */
    ImpactFaceDetailer(args: ImpactFaceDetailer_input, uid?: ComfyNodeUID): ImpactFaceDetailer
    /* category=ImpactPack_Simple output=IMAGE, MASK, DETAILER_PIPE */
    ImpactFaceDetailerPipe(args: ImpactFaceDetailerPipe_input, uid?: ComfyNodeUID): ImpactFaceDetailerPipe
    /* category=ImpactPack_Operation output=MASK */
    ImpactBitwiseAndMask(args: ImpactBitwiseAndMask_input, uid?: ComfyNodeUID): ImpactBitwiseAndMask
    /* category=ImpactPack_Operation output=MASK */
    ImpactSubtractMask(args: ImpactSubtractMask_input, uid?: ComfyNodeUID): ImpactSubtractMask
    /* category=ImpactPack_Operation output=SEGS */
    ImpactSegsMask(args: ImpactSegsMask_input, uid?: ComfyNodeUID): ImpactSegsMask
    /* category=ImpactPack_Operation output=MASK */
    ImpactSegsMaskCombine(args: ImpactSegsMaskCombine_input, uid?: ComfyNodeUID): ImpactSegsMaskCombine
    /* category=ImpactPack_Util output=SEGS */
    ImpactEmptySegs(args: ImpactEmptySegs_input, uid?: ComfyNodeUID): ImpactEmptySegs
    /* category=ImpactPack_Operation output=SEGS */
    ImpactMaskToSEGS(args: ImpactMaskToSEGS_input, uid?: ComfyNodeUID): ImpactMaskToSEGS
    /* category=ImpactPack_Operation output=MASK */
    ImpactToBinaryMask(args: ImpactToBinaryMask_input, uid?: ComfyNodeUID): ImpactToBinaryMask
    /* category=ImpactPack_Util output=MASK */
    ImpactMaskPainter(args: ImpactMaskPainter_input, uid?: ComfyNodeUID): ImpactMaskPainter
    /* category=latent output=LATENT */
    RandomLatentImage(args: RandomLatentImage_input, uid?: ComfyNodeUID): RandomLatentImage
    /* category=latent output=IMAGE */
    VAEDecodeBatched(args: VAEDecodeBatched_input, uid?: ComfyNodeUID): VAEDecodeBatched
    /* category=latent output=LATENT */
    VAEEncodeBatched(args: VAEEncodeBatched_input, uid?: ComfyNodeUID): VAEEncodeBatched
    /* category=latent output=IMAGE */
    LatentToImage(args: LatentToImage_input, uid?: ComfyNodeUID): LatentToImage
    /* category=latent output=IMAGE, STRING */
    LatentToHist(args: LatentToHist_input, uid?: ComfyNodeUID): LatentToHist
    /* category=sampling output=DICT */
    KSamplerSetting(args: KSamplerSetting_input, uid?: ComfyNodeUID): KSamplerSetting
    /* category=sampling output=LATENT */
    KSamplerOverrided(args: KSamplerOverrided_input, uid?: ComfyNodeUID): KSamplerOverrided
    /* category=sampling output=LATENT */
    KSamplerXYZ(args: KSamplerXYZ_input, uid?: ComfyNodeUID): KSamplerXYZ
    /* category=loaders output=DICT */
    StateDictLoader(args: StateDictLoader_input, uid?: ComfyNodeUID): StateDictLoader
    /* category=model output=MODEL, CLIP, VAE */
    Dict2Model(args: Dict2Model_input, uid?: ComfyNodeUID): Dict2Model
    /* category=model output=MODEL */
    ModelIter(args: ModelIter_input, uid?: ComfyNodeUID): ModelIter
    /* category=model output=CLIP */
    CLIPIter(args: CLIPIter_input, uid?: ComfyNodeUID): CLIPIter
    /* category=model output=VAE */
    VAEIter(args: VAEIter_input, uid?: ComfyNodeUID): VAEIter
    /* category=model output=DICT */
    StateDictMerger(args: StateDictMerger_input, uid?: ComfyNodeUID): StateDictMerger
    /* category=model output=DICT */
    StateDictMergerBlockWeighted(args: StateDictMergerBlockWeighted_input, uid?: ComfyNodeUID): StateDictMergerBlockWeighted
    /* category=model output=MODEL, CLIP, VAE */
    StateDictMergerBlockWeightedMulti(
        args: StateDictMergerBlockWeightedMulti_input,
        uid?: ComfyNodeUID,
    ): StateDictMergerBlockWeightedMulti
    /* category=image_postprocessing output=IMAGE */
    ImageBlend2(args: ImageBlend2_input, uid?: ComfyNodeUID): ImageBlend2
    /* category=image output= */
    GridImage(args: GridImage_input, uid?: ComfyNodeUID): GridImage
    /* category=utils output= */
    SaveText(args: SaveText_input, uid?: ComfyNodeUID): SaveText
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
    /* category=image output=IMAGE, MASK */
    ClipSeg(args: ClipSeg_input, uid?: ComfyNodeUID): ClipSeg
    /* category=preprocessors_edge_line output=IMAGE */
    CannyEdgePreprocessor(args: CannyEdgePreprocessor_input, uid?: ComfyNodeUID): CannyEdgePreprocessor
    /* category=preprocessors_edge_line output=IMAGE */
    MLSDPreprocessor(args: MLSDPreprocessor_input, uid?: ComfyNodeUID): MLSDPreprocessor
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
    Manga2AnimeLineArtPreprocessor(args: Manga2AnimeLineArtPreprocessor_input, uid?: ComfyNodeUID): Manga2AnimeLineArtPreprocessor
    /* category=preprocessors_normal_depth_map output=IMAGE */
    MiDaSDepthMapPreprocessor(args: MiDaSDepthMapPreprocessor_input, uid?: ComfyNodeUID): MiDaSDepthMapPreprocessor
    /* category=preprocessors_normal_depth_map output=IMAGE */
    MiDaSNormalMapPreprocessor(args: MiDaSNormalMapPreprocessor_input, uid?: ComfyNodeUID): MiDaSNormalMapPreprocessor
    /* category=preprocessors_normal_depth_map output=IMAGE */
    LeReSDepthMapPreprocessor(args: LeReSDepthMapPreprocessor_input, uid?: ComfyNodeUID): LeReSDepthMapPreprocessor
    /* category=preprocessors_normal_depth_map output=IMAGE */
    ZoeDepthMapPreprocessor(args: ZoeDepthMapPreprocessor_input, uid?: ComfyNodeUID): ZoeDepthMapPreprocessor
    /* category=preprocessors_normal_depth_map output=IMAGE */
    BAENormalMapPreprocessor(args: BAENormalMapPreprocessor_input, uid?: ComfyNodeUID): BAENormalMapPreprocessor
    /* category=preprocessors_pose output=IMAGE */
    OpenposePreprocessor(args: OpenposePreprocessor_input, uid?: ComfyNodeUID): OpenposePreprocessor
    /* category=preprocessors_pose output=IMAGE */
    MediaPipeHandPosePreprocessor(args: MediaPipeHandPosePreprocessor_input, uid?: ComfyNodeUID): MediaPipeHandPosePreprocessor
    /* category=preprocessors_semseg output=IMAGE */
    SemSegPreprocessor(args: SemSegPreprocessor_input, uid?: ComfyNodeUID): SemSegPreprocessor
    /* category=preprocessors_semseg output=IMAGE */
    UniFormerSemSegPreprocessor(args: UniFormerSemSegPreprocessor_input, uid?: ComfyNodeUID): UniFormerSemSegPreprocessor
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
    MediaPipeFaceMeshPreprocessor(args: MediaPipeFaceMeshPreprocessor_input, uid?: ComfyNodeUID): MediaPipeFaceMeshPreprocessor
    /* category=preprocessors_color_style output=IMAGE */
    ColorPreprocessor(args: ColorPreprocessor_input, uid?: ComfyNodeUID): ColorPreprocessor
    /* category=preprocessors_tile output=IMAGE */
    TilePreprocessor(args: TilePreprocessor_input, uid?: ComfyNodeUID): TilePreprocessor
    /* category=conditioning_cutoff output=CLIPREGION */
    CLIPRegionsBasePrompt(args: CLIPRegionsBasePrompt_input, uid?: ComfyNodeUID): CLIPRegionsBasePrompt
    /* category=conditioning_cutoff output=CLIPREGION */
    CLIPSetRegion(args: CLIPSetRegion_input, uid?: ComfyNodeUID): CLIPSetRegion
    /* category=conditioning_cutoff output=CONDITIONING */
    CLIPRegionsToConditioning(args: CLIPRegionsToConditioning_input, uid?: ComfyNodeUID): CLIPRegionsToConditioning
    /* category=Efficiency Nodes_Sampling output=MODEL, CONDITIONING, CONDITIONING_1, LATENT, VAE, IMAGE */
    KSamplerEfficient(args: KSamplerEfficient_input, uid?: ComfyNodeUID): KSamplerEfficient
    /* category=Efficiency Nodes_Loaders output=MODEL, CONDITIONING, CONDITIONING_1, LATENT, VAE, CLIP */
    EfficientLoader(args: EfficientLoader_input, uid?: ComfyNodeUID): EfficientLoader
    /* category=Efficiency Nodes_Scripts output=SCRIPT */
    XYPlot(args: XYPlot_input, uid?: ComfyNodeUID): XYPlot
    /* category=Efficiency Nodes_Image output=IMAGE */
    ImageOverlay(args: ImageOverlay_input, uid?: ComfyNodeUID): ImageOverlay
    /* category=Efficiency Nodes_Math output=INT, FLOAT */
    EvaluateIntegers(args: EvaluateIntegers_input, uid?: ComfyNodeUID): EvaluateIntegers
    /* category=Efficiency Nodes_Math output=STRING */
    EvaluateStrings(args: EvaluateStrings_input, uid?: ComfyNodeUID): EvaluateStrings
    /* category=Image Processing output=IMAGE */
    GaussianBlur(args: GaussianBlur_input, uid?: ComfyNodeUID): GaussianBlur
    /* category=Image Processing output=IMAGE */
    HistogramEqualization(args: HistogramEqualization_input, uid?: ComfyNodeUID): HistogramEqualization
    /* category=WAS Suite_Image_Transform output=IMAGE */
    WASImageFlip(args: WASImageFlip_input, uid?: ComfyNodeUID): WASImageFlip
    /* category=O_latent output=LATENT */
    LatentUpscaleMultiply(args: LatentUpscaleMultiply_input, uid?: ComfyNodeUID): LatentUpscaleMultiply
    /* category=Image Processing output=IMAGE */
    PseudoHDRStyle(args: PseudoHDRStyle_input, uid?: ComfyNodeUID): PseudoHDRStyle
    /* category=Image Processing output=IMAGE */
    Saturation(args: Saturation_input, uid?: ComfyNodeUID): Saturation
    /* category=Image Processing output=IMAGE */
    ImageSharpening(args: ImageSharpening_input, uid?: ComfyNodeUID): ImageSharpening
    /* category=WAS Suite_Loaders_Advanced output=MODEL, CLIP, VAE, STRING */
    WASCheckpointLoader(args: WASCheckpointLoader_input, uid?: ComfyNodeUID): WASCheckpointLoader
    /* category=WAS Suite_Loaders output=MODEL, CLIP, VAE, STRING */
    WASCheckpointLoaderSimple(args: WASCheckpointLoaderSimple_input, uid?: ComfyNodeUID): WASCheckpointLoaderSimple
    /* category=WAS Suite_Conditioning output=CONDITIONING */
    WASCLIPTextEncodeNSP(args: WASCLIPTextEncodeNSP_input, uid?: ComfyNodeUID): WASCLIPTextEncodeNSP
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
    /* category=WAS Suite_Debug output=NUMBER */
    WASDebugNumberToConsole(args: WASDebugNumberToConsole_input, uid?: ComfyNodeUID): WASDebugNumberToConsole
    /* category=WAS Suite_Debug output=DICT */
    WASDictionaryToConsole(args: WASDictionaryToConsole_input, uid?: ComfyNodeUID): WASDictionaryToConsole
    /* category=WAS Suite_Loaders_Advanced output=MODEL, CLIP, VAE, STRING */
    WASDiffusersModelLoader(args: WASDiffusersModelLoader_input, uid?: ComfyNodeUID): WASDiffusersModelLoader
    /* category=WAS Suite_Logic output=LATENT */
    WASLatentInputSwitch(args: WASLatentInputSwitch_input, uid?: ComfyNodeUID): WASLatentInputSwitch
    /* category=WAS Suite_Logic output=NUMBER */
    WASLogicBoolean(args: WASLogicBoolean_input, uid?: ComfyNodeUID): WASLogicBoolean
    /* category=WAS Suite_Loaders output=MODEL, CLIP, STRING */
    WASLoraLoader(args: WASLoraLoader_input, uid?: ComfyNodeUID): WASLoraLoader
    /* category=WAS Suite_Image_Analyze output=IMAGE */
    WASImageAnalyze(args: WASImageAnalyze_input, uid?: ComfyNodeUID): WASImageAnalyze
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
    /* category=WAS Suite_Image_Analyze output=IMAGE */
    WASImageColorPalette(args: WASImageColorPalette_input, uid?: ComfyNodeUID): WASImageColorPalette
    /* category=WAS Suite_Image_Process output=IMAGE, CROP_DATA */
    WASImageCropFace(args: WASImageCropFace_input, uid?: ComfyNodeUID): WASImageCropFace
    /* category=WAS Suite_Image_Process output=IMAGE, CROP_DATA */
    WASImageCropLocation(args: WASImageCropLocation_input, uid?: ComfyNodeUID): WASImageCropLocation
    /* category=WAS Suite_Image_Process output=IMAGE, IMAGE_1 */
    WASImagePasteFace(args: WASImagePasteFace_input, uid?: ComfyNodeUID): WASImagePasteFace
    /* category=WAS Suite_Image_Process output=IMAGE, IMAGE_1 */
    WASImagePasteCrop(args: WASImagePasteCrop_input, uid?: ComfyNodeUID): WASImagePasteCrop
    /* category=WAS Suite_Image_Process output=IMAGE, IMAGE_1 */
    WASImagePasteCropByLocation(args: WASImagePasteCropByLocation_input, uid?: ComfyNodeUID): WASImagePasteCropByLocation
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
    WASImagePerlinNoiseFilter(args: WASImagePerlinNoiseFilter_input, uid?: ComfyNodeUID): WASImagePerlinNoiseFilter
    /* category=WAS Suite_Image_Process output=IMAGE */
    WASImageRemoveBackgroundAlpha(args: WASImageRemoveBackgroundAlpha_input, uid?: ComfyNodeUID): WASImageRemoveBackgroundAlpha
    /* category=WAS Suite_Image_Process output=IMAGE */
    WASImageRemoveColor(args: WASImageRemoveColor_input, uid?: ComfyNodeUID): WASImageRemoveColor
    /* category=WAS Suite_Image_Transform output=IMAGE */
    WASImageResize(args: WASImageResize_input, uid?: ComfyNodeUID): WASImageResize
    /* category=WAS Suite_Image_Transform output=IMAGE */
    WASImageRotate(args: WASImageRotate_input, uid?: ComfyNodeUID): WASImageRotate
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
    /* category=WAS Suite_Image_Transform output=IMAGE */
    WASImageTranspose(args: WASImageTranspose_input, uid?: ComfyNodeUID): WASImageTranspose
    /* category=WAS Suite_Image_Filter output=IMAGE */
    WASImageFDOFFilter(args: WASImageFDOFFilter_input, uid?: ComfyNodeUID): WASImageFDOFFilter
    /* category=WAS Suite_Image_Transform output=MASK */
    WASImageToLatentMask(args: WASImageToLatentMask_input, uid?: ComfyNodeUID): WASImageToLatentMask
    /* category=WAS Suite_Image_Generate_Noise output=IMAGE */
    WASImageVoronoiNoiseFilter(args: WASImageVoronoiNoiseFilter_input, uid?: ComfyNodeUID): WASImageVoronoiNoiseFilter
    /* category=WAS Suite_Sampling output=LATENT */
    WASKSamplerWAS(args: WASKSamplerWAS_input, uid?: ComfyNodeUID): WASKSamplerWAS
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
    /* category=WAS Suite_Image_AI output=IMAGE */
    WASMiDaSDepthApproximation(args: WASMiDaSDepthApproximation_input, uid?: ComfyNodeUID): WASMiDaSDepthApproximation
    /* category=WAS Suite_Image_AI output=IMAGE, IMAGE_1 */
    WASMiDaSMaskImage(args: WASMiDaSMaskImage_input, uid?: ComfyNodeUID): WASMiDaSMaskImage
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
    /* category=WAS Suite_Image_AI_SAM output=SAM_MODEL */
    WASSAMModelLoader(args: WASSAMModelLoader_input, uid?: ComfyNodeUID): WASSAMModelLoader
    /* category=WAS Suite_Image_AI_SAM output=SAM_PARAMETERS */
    WASSAMParameters(args: WASSAMParameters_input, uid?: ComfyNodeUID): WASSAMParameters
    /* category=WAS Suite_Image_AI_SAM output=SAM_PARAMETERS */
    WASSAMParametersCombine(args: WASSAMParametersCombine_input, uid?: ComfyNodeUID): WASSAMParametersCombine
    /* category=WAS Suite_Image_AI_SAM output=IMAGE, MASK */
    WASSAMImageMask(args: WASSAMImageMask_input, uid?: ComfyNodeUID): WASSAMImageMask
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
    /* category=WAS Suite_Text output=ASCII */
    WASTextMultiline(args: WASTextMultiline_input, uid?: ComfyNodeUID): WASTextMultiline
    /* category=WAS Suite_Text_Parse output=ASCII */
    WASTextParseA1111Embeddings(args: WASTextParseA1111Embeddings_input, uid?: ComfyNodeUID): WASTextParseA1111Embeddings
    /* category=WAS Suite_Text_Parse output=ASCII */
    WASTextParseNoodleSoupPrompts(args: WASTextParseNoodleSoupPrompts_input, uid?: ComfyNodeUID): WASTextParseNoodleSoupPrompts
    /* category=WAS Suite_Text_Tokens output=ASCII */
    WASTextParseTokens(args: WASTextParseTokens_input, uid?: ComfyNodeUID): WASTextParseTokens
    /* category=WAS Suite_Text output=ASCII */
    WASTextRandomLine(args: WASTextRandomLine_input, uid?: ComfyNodeUID): WASTextRandomLine
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
    /* category=WAS Suite_Animation_Writer output=IMAGE, ASCII, ASCII_1 */
    WASWriteToGIF(args: WASWriteToGIF_input, uid?: ComfyNodeUID): WASWriteToGIF
    /* category=WAS Suite_Animation_Writer output=IMAGE, ASCII, ASCII_1 */
    WASWriteToVideo(args: WASWriteToVideo_input, uid?: ComfyNodeUID): WASWriteToVideo
    /* category=image output=IMAGE, MASK */
    YKImagePadForOutpaint(args: YKImagePadForOutpaint_input, uid?: ComfyNodeUID): YKImagePadForOutpaint
    /* category=mask output=IMAGE */
    YKMaskToImage(args: YKMaskToImage_input, uid?: ComfyNodeUID): YKMaskToImage
    /* category=loaders output=MODEL */
    HypernetworkLoader(args: HypernetworkLoader_input, uid?: ComfyNodeUID): HypernetworkLoader
    /* category=loaders output=UPSCALE_MODEL */
    UpscaleModelLoader(args: UpscaleModelLoader_input, uid?: ComfyNodeUID): UpscaleModelLoader
    /* category=image_upscaling output=IMAGE */
    ImageUpscaleWithModel(args: ImageUpscaleWithModel_input, uid?: ComfyNodeUID): ImageUpscaleWithModel
    /* category=image_postprocessing output=IMAGE */
    ImageBlend(args: ImageBlend_input, uid?: ComfyNodeUID): ImageBlend
    /* category=image_postprocessing output=IMAGE */
    ImageBlur(args: ImageBlur_input, uid?: ComfyNodeUID): ImageBlur
    /* category=image_postprocessing output=IMAGE */
    ImageQuantize(args: ImageQuantize_input, uid?: ComfyNodeUID): ImageQuantize
    /* category=image_postprocessing output=IMAGE */
    ImageSharpen(args: ImageSharpen_input, uid?: ComfyNodeUID): ImageSharpen
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
}

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
        | 'LatentFromBatch'
        | 'KSamplerAdvanced'
        | 'SetLatentNoiseMask'
        | 'LatentComposite'
        | 'LatentRotate'
        | 'LatentFlip'
        | 'LatentCrop'
        | 'VAEEncodeTiled'
        | 'RandomLatentImage'
        | 'VAEEncodeBatched'
        | 'KSamplerOverrided'
        | 'KSamplerXYZ'
        | 'MultiLatentComposite'
        | 'KSamplerEfficient'
        | 'EfficientLoader'
        | 'LatentUpscaleMultiply'
        | 'WASLatentInputSwitch'
        | 'WASKSamplerWAS'
        | 'WASLatentNoiseInjection'
        | 'WASLatentUpscaleByFactorWAS'
        | 'LatentCompositeMasked'
    > {}
export interface CanProduce_MODEL
    extends Pick<
        ComfySetup,
        | 'CheckpointLoaderSimple'
        | 'LoraLoader'
        | 'TomePatchModel'
        | 'UnCLIPCheckpointLoader'
        | 'CheckpointLoader'
        | 'DiffusersLoader'
        | 'Dict2Model'
        | 'ModelIter'
        | 'StateDictMergerBlockWeightedMulti'
        | 'KSamplerEfficient'
        | 'EfficientLoader'
        | 'WASCheckpointLoader'
        | 'WASCheckpointLoaderSimple'
        | 'WASDiffusersModelLoader'
        | 'WASLoraLoader'
        | 'WASUnCLIPCheckpointLoader'
        | 'HypernetworkLoader'
    > {}
export interface CanProduce_CLIP
    extends Pick<
        ComfySetup,
        | 'CheckpointLoaderSimple'
        | 'CLIPSetLastLayer'
        | 'LoraLoader'
        | 'CLIPLoader'
        | 'UnCLIPCheckpointLoader'
        | 'CheckpointLoader'
        | 'DiffusersLoader'
        | 'Dict2Model'
        | 'CLIPIter'
        | 'StateDictMergerBlockWeightedMulti'
        | 'EfficientLoader'
        | 'WASCheckpointLoader'
        | 'WASCheckpointLoaderSimple'
        | 'WASDiffusersModelLoader'
        | 'WASLoraLoader'
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
        | 'Dict2Model'
        | 'VAEIter'
        | 'StateDictMergerBlockWeightedMulti'
        | 'KSamplerEfficient'
        | 'EfficientLoader'
        | 'WASCheckpointLoader'
        | 'WASCheckpointLoaderSimple'
        | 'WASDiffusersModelLoader'
        | 'WASUnCLIPCheckpointLoader'
    > {}
export interface CanProduce_CONDITIONING
    extends Pick<
        ComfySetup,
        | 'CLIPTextEncode'
        | 'ConditioningCombine'
        | 'ConditioningSetArea'
        | 'ConditioningSetMask'
        | 'StyleModelApply'
        | 'UnCLIPConditioning'
        | 'ControlNetApply'
        | 'GLIGENTextBoxApply'
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
        | 'WASTextToConditioning'
    > {}
export interface CanProduce_IMAGE
    extends Pick<
        ComfySetup,
        | 'VAEDecode'
        | 'LoadImage'
        | 'ImageScale'
        | 'ImageInvert'
        | 'ImagePadForOutpaint'
        | 'VAEDecodeTiled'
        | 'BrightnessContrast'
        | 'ImpactDetailerForEach'
        | 'ImpactDetailerForEachDebug'
        | 'ImpactDetailerForEachDebug'
        | 'ImpactDetailerForEachDebug'
        | 'ImpactFaceDetailer'
        | 'ImpactFaceDetailerPipe'
        | 'VAEDecodeBatched'
        | 'LatentToImage'
        | 'LatentToHist'
        | 'ImageBlend2'
        | 'ClipSeg'
        | 'CannyEdgePreprocessor'
        | 'MLSDPreprocessor'
        | 'HEDPreprocessor'
        | 'ScribblePreprocessor'
        | 'FakeScribblePreprocessor'
        | 'BinaryPreprocessor'
        | 'PiDiNetPreprocessor'
        | 'LineArtPreprocessor'
        | 'AnimeLineArtPreprocessor'
        | 'Manga2AnimeLineArtPreprocessor'
        | 'MiDaSDepthMapPreprocessor'
        | 'MiDaSNormalMapPreprocessor'
        | 'LeReSDepthMapPreprocessor'
        | 'ZoeDepthMapPreprocessor'
        | 'BAENormalMapPreprocessor'
        | 'OpenposePreprocessor'
        | 'MediaPipeHandPosePreprocessor'
        | 'SemSegPreprocessor'
        | 'UniFormerSemSegPreprocessor'
        | 'OneFormerCOCOSemSegPreprocessor'
        | 'OneFormerADE20KSemSegPreprocessor'
        | 'MediaPipeFaceMeshPreprocessor'
        | 'ColorPreprocessor'
        | 'TilePreprocessor'
        | 'KSamplerEfficient'
        | 'ImageOverlay'
        | 'GaussianBlur'
        | 'HistogramEqualization'
        | 'WASImageFlip'
        | 'PseudoHDRStyle'
        | 'Saturation'
        | 'ImageSharpening'
        | 'WASCreateGridImage'
        | 'WASCreateMorphImage'
        | 'WASCreateMorphImage'
        | 'WASImageAnalyze'
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
        | 'WASImagePasteFace'
        | 'WASImagePasteFace'
        | 'WASImagePasteCrop'
        | 'WASImagePasteCrop'
        | 'WASImagePasteCropByLocation'
        | 'WASImagePasteCropByLocation'
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
        | 'WASImagePerlinNoiseFilter'
        | 'WASImageRemoveBackgroundAlpha'
        | 'WASImageRemoveColor'
        | 'WASImageResize'
        | 'WASImageRotate'
        | 'WASImageSeamlessTexture'
        | 'WASImageSelectChannel'
        | 'WASImageSelectColor'
        | 'WASImageShadowsAndHighlights'
        | 'WASImageShadowsAndHighlights'
        | 'WASImageShadowsAndHighlights'
        | 'WASImageStitch'
        | 'WASImageStyleFilter'
        | 'WASImageThreshold'
        | 'WASImageTranspose'
        | 'WASImageFDOFFilter'
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
        | 'ImageUpscaleWithModel'
        | 'ImageBlend'
        | 'ImageBlur'
        | 'ImageQuantize'
        | 'ImageSharpen'
        | 'MaskToImage'
    > {}
export interface CanProduce_MASK
    extends Pick<
        ComfySetup,
        | 'LoadImage'
        | 'LoadImageMask'
        | 'ImagePadForOutpaint'
        | 'ImpactBboxDetectorCombined'
        | 'ImpactSegmDetectorCombined'
        | 'ImpactSAMDetectorCombined'
        | 'ImpactFaceDetailer'
        | 'ImpactFaceDetailerPipe'
        | 'ImpactBitwiseAndMask'
        | 'ImpactSubtractMask'
        | 'ImpactSegsMaskCombine'
        | 'ImpactToBinaryMask'
        | 'ImpactMaskPainter'
        | 'ClipSeg'
        | 'WASImageLoad'
        | 'WASImageToLatentMask'
        | 'WASSAMImageMask'
        | 'YKImagePadForOutpaint'
        | 'ImageToMask'
        | 'SolidMask'
        | 'InvertMask'
        | 'CropMask'
        | 'MaskComposite'
        | 'FeatherMask'
    > {}
export interface CanProduce_CLIP_VISION_OUTPUT extends Pick<ComfySetup, 'CLIPVisionEncode'> {}
export interface CanProduce_CONTROL_NET extends Pick<ComfySetup, 'ControlNetLoader' | 'DiffControlNetLoader'> {}
export interface CanProduce_STYLE_MODEL extends Pick<ComfySetup, 'StyleModelLoader'> {}
export interface CanProduce_CLIP_VISION
    extends Pick<ComfySetup, 'CLIPVisionLoader' | 'UnCLIPCheckpointLoader' | 'WASUnCLIPCheckpointLoader'> {}
export interface CanProduce_GLIGEN extends Pick<ComfySetup, 'GLIGENLoader'> {}
export interface CanProduce_BBOX_MODEL extends Pick<ComfySetup, 'ImpactMMDetLoader'> {}
export interface CanProduce_SEGM_MODEL extends Pick<ComfySetup, 'ImpactMMDetLoader'> {}
export interface CanProduce_SAM_MODEL extends Pick<ComfySetup, 'ImpactSAMLoader' | 'WASSAMModelLoader'> {}
export interface CanProduce_ONNX_MODEL extends Pick<ComfySetup, 'ImpactONNXLoader'> {}
export interface CanProduce_SEGS
    extends Pick<
        ComfySetup,
        | 'ImpactBboxDetectorForEach'
        | 'ImpactSegmDetectorForEach'
        | 'ImpactONNXDetectorForEach'
        | 'ImpactBitwiseAndMaskForEach'
        | 'ImpactSegsMask'
        | 'ImpactEmptySegs'
        | 'ImpactMaskToSEGS'
    > {}
export interface CanProduce_DETAILER_PIPE extends Pick<ComfySetup, 'ImpactFaceDetailer' | 'ImpactFaceDetailerPipe'> {}
export interface CanProduce_STRING
    extends Pick<
        ComfySetup,
        | 'LatentToHist'
        | 'EvaluateStrings'
        | 'WASCheckpointLoader'
        | 'WASCheckpointLoaderSimple'
        | 'WASDiffusersModelLoader'
        | 'WASLoraLoader'
        | 'WASNumberToString'
        | 'WASTextToString'
        | 'WASUnCLIPCheckpointLoader'
    > {}
export interface CanProduce_DICT
    extends Pick<
        ComfySetup,
        | 'KSamplerSetting'
        | 'StateDictLoader'
        | 'StateDictMerger'
        | 'StateDictMergerBlockWeighted'
        | 'WASDictionaryToConsole'
        | 'WASLoadTextFile'
        | 'WASTextDictionaryUpdate'
        | 'WASTextFileHistoryLoader'
    > {}
export interface CanProduce_CLIPREGION
    extends Pick<ComfySetup, 'BNK_CutoffBasePrompt' | 'BNK_CutoffSetRegions' | 'CLIPRegionsBasePrompt' | 'CLIPSetRegion'> {}
export interface CanProduce_INT
    extends Pick<ComfySetup, 'MultiAreaConditioning' | 'MultiAreaConditioning' | 'EvaluateIntegers' | 'WASNumberToInt'> {}
export interface CanProduce_SCRIPT extends Pick<ComfySetup, 'XYPlot'> {}
export interface CanProduce_FLOAT extends Pick<ComfySetup, 'EvaluateIntegers' | 'WASNumberToFloat'> {}
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
        | 'WASTextToNumber'
        | 'WASTrueRandomOrgNumberGenerator'
    > {}
export interface CanProduce_ASCII
    extends Pick<
        ComfySetup,
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
        | 'WASTextConcatenate'
        | 'WASTextFileHistoryLoader'
        | 'WASTextFindAndReplaceByDictionary'
        | 'WASTextFindAndReplaceInput'
        | 'WASTextFindAndReplace'
        | 'WASTextInputSwitch'
        | 'WASTextMultiline'
        | 'WASTextParseA1111Embeddings'
        | 'WASTextParseNoodleSoupPrompts'
        | 'WASTextParseTokens'
        | 'WASTextRandomLine'
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
    > {}
export interface CanProduce_CROP_DATA extends Pick<ComfySetup, 'WASImageCropFace' | 'WASImageCropLocation'> {}
export interface CanProduce_SEED extends Pick<ComfySetup, 'WASNumberToSeed' | 'WASSeed'> {}
export interface CanProduce_SAM_PARAMETERS extends Pick<ComfySetup, 'WASSAMParameters' | 'WASSAMParametersCombine'> {}
export interface CanProduce_IMAGE_BOUNDS
    extends Pick<ComfySetup, 'WASImageBounds' | 'WASInsetImageBounds' | 'WASBoundedImageCropWithMask'> {}
export interface CanProduce_UPSCALE_MODEL extends Pick<ComfySetup, 'WASUpscaleModelLoader' | 'UpscaleModelLoader'> {}

// TYPES -------------------------------
export type SchedulerName = string | Slot<'SchedulerName'>
export type SamplerName = string | Slot<'SamplerName'>
export type IMAGE_PATH = string | Slot<'IMAGE_PATH'>
export type CLIP_VISION_OUTPUT = Slot<'CLIP_VISION_OUTPUT'>
export type Integer = number | Slot<'Integer'>
export type STRING = string | Slot<'STRING'>
export type FLOAT = number | Slot<'FLOAT'>
export type Float = number | Slot<'Float'>
export type SAM_PARAMETERS = Slot<'SAM_PARAMETERS'>
export type DETAILER_PIPE = Slot<'DETAILER_PIPE'>
export type UPSCALE_MODEL = Slot<'UPSCALE_MODEL'>
export type INT = number | Slot<'INT'>
export type CONDITIONING = Slot<'CONDITIONING'>
export type IMAGE_BOUNDS = Slot<'IMAGE_BOUNDS'>
export type CLIP_VISION = Slot<'CLIP_VISION'>
export type STYLE_MODEL = Slot<'STYLE_MODEL'>
export type CONTROL_NET = Slot<'CONTROL_NET'>
export type BBOX_MODEL = Slot<'BBOX_MODEL'>
export type SEGM_MODEL = Slot<'SEGM_MODEL'>
export type ONNX_MODEL = Slot<'ONNX_MODEL'>
export type CLIPREGION = Slot<'CLIPREGION'>
export type SAM_MODEL = Slot<'SAM_MODEL'>
export type CROP_DATA = Slot<'CROP_DATA'>
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
export type SEED = Slot<'SEED'>
export type VAE = Slot<'VAE'>

// ACCEPTABLE INPUTS -------------------------------
export type _SchedulerName =
    | string
    | Slot<'SchedulerName'>
    | HasSingle_SchedulerName
    | ((x: CanProduce_SchedulerName) => string | Slot<'SchedulerName'>)
export type _SamplerName =
    | string
    | Slot<'SamplerName'>
    | HasSingle_SamplerName
    | ((x: CanProduce_SamplerName) => string | Slot<'SamplerName'>)
export type _IMAGE_PATH =
    | string
    | Slot<'IMAGE_PATH'>
    | HasSingle_IMAGE_PATH
    | ((x: CanProduce_IMAGE_PATH) => string | Slot<'IMAGE_PATH'>)
export type _CLIP_VISION_OUTPUT =
    | Slot<'CLIP_VISION_OUTPUT'>
    | HasSingle_CLIP_VISION_OUTPUT
    | ((x: CanProduce_CLIP_VISION_OUTPUT) => Slot<'CLIP_VISION_OUTPUT'>)
export type _Integer = number | Slot<'Integer'> | HasSingle_Integer | ((x: CanProduce_Integer) => number | Slot<'Integer'>)
export type _STRING = string | Slot<'STRING'> | HasSingle_STRING | ((x: CanProduce_STRING) => string | Slot<'STRING'>)
export type _FLOAT = number | Slot<'FLOAT'> | HasSingle_FLOAT | ((x: CanProduce_FLOAT) => number | Slot<'FLOAT'>)
export type _Float = number | Slot<'Float'> | HasSingle_Float | ((x: CanProduce_Float) => number | Slot<'Float'>)
export type _SAM_PARAMETERS =
    | Slot<'SAM_PARAMETERS'>
    | HasSingle_SAM_PARAMETERS
    | ((x: CanProduce_SAM_PARAMETERS) => Slot<'SAM_PARAMETERS'>)
export type _DETAILER_PIPE =
    | Slot<'DETAILER_PIPE'>
    | HasSingle_DETAILER_PIPE
    | ((x: CanProduce_DETAILER_PIPE) => Slot<'DETAILER_PIPE'>)
export type _UPSCALE_MODEL =
    | Slot<'UPSCALE_MODEL'>
    | HasSingle_UPSCALE_MODEL
    | ((x: CanProduce_UPSCALE_MODEL) => Slot<'UPSCALE_MODEL'>)
export type _INT = number | Slot<'INT'> | HasSingle_INT | ((x: CanProduce_INT) => number | Slot<'INT'>)
export type _CONDITIONING = Slot<'CONDITIONING'> | HasSingle_CONDITIONING | ((x: CanProduce_CONDITIONING) => Slot<'CONDITIONING'>)
export type _IMAGE_BOUNDS = Slot<'IMAGE_BOUNDS'> | HasSingle_IMAGE_BOUNDS | ((x: CanProduce_IMAGE_BOUNDS) => Slot<'IMAGE_BOUNDS'>)
export type _CLIP_VISION = Slot<'CLIP_VISION'> | HasSingle_CLIP_VISION | ((x: CanProduce_CLIP_VISION) => Slot<'CLIP_VISION'>)
export type _STYLE_MODEL = Slot<'STYLE_MODEL'> | HasSingle_STYLE_MODEL | ((x: CanProduce_STYLE_MODEL) => Slot<'STYLE_MODEL'>)
export type _CONTROL_NET = Slot<'CONTROL_NET'> | HasSingle_CONTROL_NET | ((x: CanProduce_CONTROL_NET) => Slot<'CONTROL_NET'>)
export type _BBOX_MODEL = Slot<'BBOX_MODEL'> | HasSingle_BBOX_MODEL | ((x: CanProduce_BBOX_MODEL) => Slot<'BBOX_MODEL'>)
export type _SEGM_MODEL = Slot<'SEGM_MODEL'> | HasSingle_SEGM_MODEL | ((x: CanProduce_SEGM_MODEL) => Slot<'SEGM_MODEL'>)
export type _ONNX_MODEL = Slot<'ONNX_MODEL'> | HasSingle_ONNX_MODEL | ((x: CanProduce_ONNX_MODEL) => Slot<'ONNX_MODEL'>)
export type _CLIPREGION = Slot<'CLIPREGION'> | HasSingle_CLIPREGION | ((x: CanProduce_CLIPREGION) => Slot<'CLIPREGION'>)
export type _SAM_MODEL = Slot<'SAM_MODEL'> | HasSingle_SAM_MODEL | ((x: CanProduce_SAM_MODEL) => Slot<'SAM_MODEL'>)
export type _CROP_DATA = Slot<'CROP_DATA'> | HasSingle_CROP_DATA | ((x: CanProduce_CROP_DATA) => Slot<'CROP_DATA'>)
export type _LATENT = Slot<'LATENT'> | HasSingle_LATENT | ((x: CanProduce_LATENT) => Slot<'LATENT'>)
export type _GLIGEN = Slot<'GLIGEN'> | HasSingle_GLIGEN | ((x: CanProduce_GLIGEN) => Slot<'GLIGEN'>)
export type _SCRIPT = Slot<'SCRIPT'> | HasSingle_SCRIPT | ((x: CanProduce_SCRIPT) => Slot<'SCRIPT'>)
export type _NUMBER = Slot<'NUMBER'> | HasSingle_NUMBER | ((x: CanProduce_NUMBER) => Slot<'NUMBER'>)
export type _MODEL = Slot<'MODEL'> | HasSingle_MODEL | ((x: CanProduce_MODEL) => Slot<'MODEL'>)
export type _IMAGE = Slot<'IMAGE'> | HasSingle_IMAGE | ((x: CanProduce_IMAGE) => Slot<'IMAGE'>)
export type _ASCII = Slot<'ASCII'> | HasSingle_ASCII | ((x: CanProduce_ASCII) => Slot<'ASCII'>)
export type _CLIP = Slot<'CLIP'> | HasSingle_CLIP | ((x: CanProduce_CLIP) => Slot<'CLIP'>)
export type _MASK = Slot<'MASK'> | HasSingle_MASK | ((x: CanProduce_MASK) => Slot<'MASK'>)
export type _SEGS = Slot<'SEGS'> | HasSingle_SEGS | ((x: CanProduce_SEGS) => Slot<'SEGS'>)
export type _DICT = Slot<'DICT'> | HasSingle_DICT | ((x: CanProduce_DICT) => Slot<'DICT'>)
export type _SEED = Slot<'SEED'> | HasSingle_SEED | ((x: CanProduce_SEED) => Slot<'SEED'>)
export type _VAE = Slot<'VAE'> | HasSingle_VAE | ((x: CanProduce_VAE) => Slot<'VAE'>)

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

// NODES -------------------------------
// |=============================================================================|
// | KSampler                                                                    |
// |=============================================================================|
export interface KSampler extends HasSingle_LATENT, ComfyNode<KSampler_input> {
    LATENT: Slot<'LATENT', 0>
}
export type KSampler_input = {
    model: _MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
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
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
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
    clip: _CLIP
}

// |=============================================================================|
// | CLIPSetLastLayer                                                            |
// |=============================================================================|
export interface CLIPSetLastLayer extends HasSingle_CLIP, ComfyNode<CLIPSetLastLayer_input> {
    CLIP: Slot<'CLIP', 0>
}
export type CLIPSetLastLayer_input = {
    clip: _CLIP
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
    samples: _LATENT
    vae: _VAE
}

// |=============================================================================|
// | VAEEncode                                                                   |
// |=============================================================================|
export interface VAEEncode extends HasSingle_LATENT, ComfyNode<VAEEncode_input> {
    LATENT: Slot<'LATENT', 0>
}
export type VAEEncode_input = {
    pixels: _IMAGE
    vae: _VAE
}

// |=============================================================================|
// | VAEEncodeForInpaint                                                         |
// |=============================================================================|
export interface VAEEncodeForInpaint extends HasSingle_LATENT, ComfyNode<VAEEncodeForInpaint_input> {
    LATENT: Slot<'LATENT', 0>
}
export type VAEEncodeForInpaint_input = {
    pixels: _IMAGE
    vae: _VAE
    mask: _MASK
}

// |=============================================================================|
// | VAELoader                                                                   |
// |=============================================================================|
export interface VAELoader extends HasSingle_VAE, ComfyNode<VAELoader_input> {
    VAE: Slot<'VAE', 0>
}
export type VAELoader_input = {
    vae_name: Enum_VAELoader_vae_name
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
    samples: _LATENT
    upscale_method: Enum_LatentUpscale_upscale_method
    /** default=512 min=8192 max=8192 step=64 */
    width?: INT
    /** default=512 min=8192 max=8192 step=64 */
    height?: INT
    crop: Enum_LatentUpscale_crop
}

// |=============================================================================|
// | LatentFromBatch                                                             |
// |=============================================================================|
export interface LatentFromBatch extends HasSingle_LATENT, ComfyNode<LatentFromBatch_input> {
    LATENT: Slot<'LATENT', 0>
}
export type LatentFromBatch_input = {
    samples: _LATENT
    /** default=0 min=63 max=63 */
    batch_index?: INT
}

// |=============================================================================|
// | SaveImage                                                                   |
// |=============================================================================|
export interface SaveImage extends ComfyNode<SaveImage_input> {}
export type SaveImage_input = {
    images: _IMAGE
    /** default="ComfyUI" */
    filename_prefix?: STRING
}

// |=============================================================================|
// | PreviewImage                                                                |
// |=============================================================================|
export interface PreviewImage extends ComfyNode<PreviewImage_input> {}
export type PreviewImage_input = {
    images: _IMAGE
}

// |=============================================================================|
// | LoadImage                                                                   |
// |=============================================================================|
export interface LoadImage extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<LoadImage_input> {
    IMAGE: Slot<'IMAGE', 0>
    MASK: Slot<'MASK', 1>
}
export type LoadImage_input = {
    image: Enum_LoadImage_image
}

// |=============================================================================|
// | LoadImageMask                                                               |
// |=============================================================================|
export interface LoadImageMask extends HasSingle_MASK, ComfyNode<LoadImageMask_input> {
    MASK: Slot<'MASK', 0>
}
export type LoadImageMask_input = {
    image: Enum_LoadImage_image
    channel: Enum_LoadImageMask_channel
}

// |=============================================================================|
// | ImageScale                                                                  |
// |=============================================================================|
export interface ImageScale extends HasSingle_IMAGE, ComfyNode<ImageScale_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageScale_input = {
    image: _IMAGE
    upscale_method: Enum_LatentUpscale_upscale_method
    /** default=512 min=8192 max=8192 step=1 */
    width?: INT
    /** default=512 min=8192 max=8192 step=1 */
    height?: INT
    crop: Enum_LatentUpscale_crop
}

// |=============================================================================|
// | ImageInvert                                                                 |
// |=============================================================================|
export interface ImageInvert extends HasSingle_IMAGE, ComfyNode<ImageInvert_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageInvert_input = {
    image: _IMAGE
}

// |=============================================================================|
// | ImagePadForOutpaint                                                         |
// |=============================================================================|
export interface ImagePadForOutpaint extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<ImagePadForOutpaint_input> {
    IMAGE: Slot<'IMAGE', 0>
    MASK: Slot<'MASK', 1>
}
export type ImagePadForOutpaint_input = {
    image: _IMAGE
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
    conditioning_1: _CONDITIONING
    conditioning_2: _CONDITIONING
}

// |=============================================================================|
// | ConditioningSetArea                                                         |
// |=============================================================================|
export interface ConditioningSetArea extends HasSingle_CONDITIONING, ComfyNode<ConditioningSetArea_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type ConditioningSetArea_input = {
    conditioning: _CONDITIONING
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
    conditioning: _CONDITIONING
    mask: _MASK
    /** default=1 min=10 max=10 step=0.01 */
    strength?: FLOAT
    set_cond_area: Enum_ConditioningSetMask_set_cond_area
}

// |=============================================================================|
// | KSamplerAdvanced                                                            |
// |=============================================================================|
export interface KSamplerAdvanced extends HasSingle_LATENT, ComfyNode<KSamplerAdvanced_input> {
    LATENT: Slot<'LATENT', 0>
}
export type KSamplerAdvanced_input = {
    model: _MODEL
    add_noise: Enum_KSamplerAdvanced_add_noise
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    noise_seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
    /** default=0 min=10000 max=10000 */
    start_at_step?: INT
    /** default=10000 min=10000 max=10000 */
    end_at_step?: INT
    return_with_leftover_noise: Enum_KSamplerAdvanced_add_noise
}

// |=============================================================================|
// | SetLatentNoiseMask                                                          |
// |=============================================================================|
export interface SetLatentNoiseMask extends HasSingle_LATENT, ComfyNode<SetLatentNoiseMask_input> {
    LATENT: Slot<'LATENT', 0>
}
export type SetLatentNoiseMask_input = {
    samples: _LATENT
    mask: _MASK
}

// |=============================================================================|
// | LatentComposite                                                             |
// |=============================================================================|
export interface LatentComposite extends HasSingle_LATENT, ComfyNode<LatentComposite_input> {
    LATENT: Slot<'LATENT', 0>
}
export type LatentComposite_input = {
    samples_to: _LATENT
    samples_from: _LATENT
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
    samples: _LATENT
    rotation: Enum_LatentRotate_rotation
}

// |=============================================================================|
// | LatentFlip                                                                  |
// |=============================================================================|
export interface LatentFlip extends HasSingle_LATENT, ComfyNode<LatentFlip_input> {
    LATENT: Slot<'LATENT', 0>
}
export type LatentFlip_input = {
    samples: _LATENT
    flip_method: Enum_LatentFlip_flip_method
}

// |=============================================================================|
// | LatentCrop                                                                  |
// |=============================================================================|
export interface LatentCrop extends HasSingle_LATENT, ComfyNode<LatentCrop_input> {
    LATENT: Slot<'LATENT', 0>
}
export type LatentCrop_input = {
    samples: _LATENT
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
    model: _MODEL
    clip: _CLIP
    lora_name: Enum_LoraLoader_lora_name
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
    clip_name: Enum_CLIPLoader_clip_name
}

// |=============================================================================|
// | CLIPVisionEncode                                                            |
// |=============================================================================|
export interface CLIPVisionEncode extends HasSingle_CLIP_VISION_OUTPUT, ComfyNode<CLIPVisionEncode_input> {
    CLIP_VISION_OUTPUT: Slot<'CLIP_VISION_OUTPUT', 0>
}
export type CLIPVisionEncode_input = {
    clip_vision: _CLIP_VISION
    image: _IMAGE
}

// |=============================================================================|
// | StyleModelApply                                                             |
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
// | UnCLIPConditioning                                                          |
// |=============================================================================|
export interface UnCLIPConditioning extends HasSingle_CONDITIONING, ComfyNode<UnCLIPConditioning_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type UnCLIPConditioning_input = {
    conditioning: _CONDITIONING
    clip_vision_output: _CLIP_VISION_OUTPUT
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
    conditioning: _CONDITIONING
    control_net: _CONTROL_NET
    image: _IMAGE
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
    control_net_name: Enum_ControlNetLoader_control_net_name
}

// |=============================================================================|
// | DiffControlNetLoader                                                        |
// |=============================================================================|
export interface DiffControlNetLoader extends HasSingle_CONTROL_NET, ComfyNode<DiffControlNetLoader_input> {
    CONTROL_NET: Slot<'CONTROL_NET', 0>
}
export type DiffControlNetLoader_input = {
    model: _MODEL
    control_net_name: Enum_ControlNetLoader_control_net_name
}

// |=============================================================================|
// | StyleModelLoader                                                            |
// |=============================================================================|
export interface StyleModelLoader extends HasSingle_STYLE_MODEL, ComfyNode<StyleModelLoader_input> {
    STYLE_MODEL: Slot<'STYLE_MODEL', 0>
}
export type StyleModelLoader_input = {
    style_model_name: Enum_StyleModelLoader_style_model_name
}

// |=============================================================================|
// | CLIPVisionLoader                                                            |
// |=============================================================================|
export interface CLIPVisionLoader extends HasSingle_CLIP_VISION, ComfyNode<CLIPVisionLoader_input> {
    CLIP_VISION: Slot<'CLIP_VISION', 0>
}
export type CLIPVisionLoader_input = {
    clip_name: Enum_CLIPVisionLoader_clip_name
}

// |=============================================================================|
// | VAEDecodeTiled                                                              |
// |=============================================================================|
export interface VAEDecodeTiled extends HasSingle_IMAGE, ComfyNode<VAEDecodeTiled_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type VAEDecodeTiled_input = {
    samples: _LATENT
    vae: _VAE
}

// |=============================================================================|
// | VAEEncodeTiled                                                              |
// |=============================================================================|
export interface VAEEncodeTiled extends HasSingle_LATENT, ComfyNode<VAEEncodeTiled_input> {
    LATENT: Slot<'LATENT', 0>
}
export type VAEEncodeTiled_input = {
    pixels: _IMAGE
    vae: _VAE
}

// |=============================================================================|
// | TomePatchModel                                                              |
// |=============================================================================|
export interface TomePatchModel extends HasSingle_MODEL, ComfyNode<TomePatchModel_input> {
    MODEL: Slot<'MODEL', 0>
}
export type TomePatchModel_input = {
    model: _MODEL
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
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
}

// |=============================================================================|
// | GLIGENLoader                                                                |
// |=============================================================================|
export interface GLIGENLoader extends HasSingle_GLIGEN, ComfyNode<GLIGENLoader_input> {
    GLIGEN: Slot<'GLIGEN', 0>
}
export type GLIGENLoader_input = {
    gligen_name: Enum_CLIPLoader_clip_name
}

// |=============================================================================|
// | GLIGENTextBoxApply                                                          |
// |=============================================================================|
export interface GLIGENTextBoxApply extends HasSingle_CONDITIONING, ComfyNode<GLIGENTextBoxApply_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type GLIGENTextBoxApply_input = {
    conditioning_to: _CONDITIONING
    clip: _CLIP
    gligen_textbox_model: _GLIGEN
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
    config_name: Enum_CheckpointLoader_config_name
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
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
    model_path: Enum_CLIPLoader_clip_name
}

// |=============================================================================|
// | BrightnessContrast                                                          |
// |=============================================================================|
export interface BrightnessContrast extends HasSingle_IMAGE, ComfyNode<BrightnessContrast_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type BrightnessContrast_input = {
    image: _IMAGE
    mode: Enum_BrightnessContrast_mode
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
    model_name: Enum_ImpactMMDetLoader_model_name
}

// |=============================================================================|
// | ImpactSAMLoader                                                             |
// |=============================================================================|
export interface ImpactSAMLoader extends HasSingle_SAM_MODEL, ComfyNode<ImpactSAMLoader_input> {
    SAM_MODEL: Slot<'SAM_MODEL', 0>
}
export type ImpactSAMLoader_input = {
    model_name: Enum_ImpactSAMLoader_model_name
}

// |=============================================================================|
// | ImpactONNXLoader                                                            |
// |=============================================================================|
export interface ImpactONNXLoader extends HasSingle_ONNX_MODEL, ComfyNode<ImpactONNXLoader_input> {
    ONNX_MODEL: Slot<'ONNX_MODEL', 0>
}
export type ImpactONNXLoader_input = {
    model_name: Enum_CLIPLoader_clip_name
}

// |=============================================================================|
// | ImpactBboxDetectorForEach                                                   |
// |=============================================================================|
export interface ImpactBboxDetectorForEach extends HasSingle_SEGS, ComfyNode<ImpactBboxDetectorForEach_input> {
    SEGS: Slot<'SEGS', 0>
}
export type ImpactBboxDetectorForEach_input = {
    bbox_model: _BBOX_MODEL
    image: _IMAGE
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
    segm_model: _SEGM_MODEL
    image: _IMAGE
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
    onnx_model: _ONNX_MODEL
    image: _IMAGE
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
    base_segs: _SEGS
    mask_segs: _SEGS
}

// |=============================================================================|
// | ImpactDetailerForEach                                                       |
// |=============================================================================|
export interface ImpactDetailerForEach extends HasSingle_IMAGE, ComfyNode<ImpactDetailerForEach_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImpactDetailerForEach_input = {
    image: _IMAGE
    segs: _SEGS
    model: _MODEL
    vae: _VAE
    /** default=256 min=8192 max=8192 step=64 */
    guide_size?: FLOAT
    guide_size_for: Enum_ImpactDetailerForEach_guide_size_for
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: INT
    noise_mask: Enum_ImpactDetailerForEach_noise_mask
    force_inpaint: Enum_ImpactDetailerForEach_noise_mask
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
    image: _IMAGE
    segs: _SEGS
    model: _MODEL
    vae: _VAE
    /** default=256 min=8192 max=8192 step=64 */
    guide_size?: FLOAT
    guide_size_for: Enum_ImpactDetailerForEach_guide_size_for
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: INT
    noise_mask: Enum_ImpactDetailerForEach_noise_mask
    force_inpaint: Enum_ImpactDetailerForEach_noise_mask
}

// |=============================================================================|
// | ImpactBboxDetectorCombined                                                  |
// |=============================================================================|
export interface ImpactBboxDetectorCombined extends HasSingle_MASK, ComfyNode<ImpactBboxDetectorCombined_input> {
    MASK: Slot<'MASK', 0>
}
export type ImpactBboxDetectorCombined_input = {
    bbox_model: _BBOX_MODEL
    image: _IMAGE
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
    segm_model: _SEGM_MODEL
    image: _IMAGE
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
    sam_model: _SAM_MODEL
    segs: _SEGS
    image: _IMAGE
    detection_hint: Enum_ImpactSAMDetectorCombined_detection_hint
    /** default=0 min=255 max=255 step=1 */
    dilation?: INT
    /** default=0.93 min=1 max=1 step=0.01 */
    threshold?: FLOAT
    /** default=0 min=1000 max=1000 step=1 */
    bbox_expansion?: INT
    /** default=0.7 min=1 max=1 step=0.01 */
    mask_hint_threshold?: FLOAT
    mask_hint_use_negative: Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
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
    image: _IMAGE
    model: _MODEL
    vae: _VAE
    /** default=256 min=8192 max=8192 step=64 */
    guide_size?: FLOAT
    guide_size_for: Enum_ImpactDetailerForEach_guide_size_for
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: INT
    noise_mask: Enum_ImpactDetailerForEach_noise_mask
    force_inpaint: Enum_ImpactDetailerForEach_noise_mask
    /** default=0.5 min=1 max=1 step=0.01 */
    bbox_threshold?: FLOAT
    /** default=10 min=255 max=255 step=1 */
    bbox_dilation?: INT
    /** default=3 min=10 max=10 step=0.1 */
    bbox_crop_factor?: FLOAT
    sam_detection_hint: Enum_ImpactSAMDetectorCombined_detection_hint
    /** default=0 min=255 max=255 step=1 */
    sam_dilation?: INT
    /** default=0.93 min=1 max=1 step=0.01 */
    sam_threshold?: FLOAT
    /** default=0 min=1000 max=1000 step=1 */
    sam_bbox_expansion?: INT
    /** default=0.7 min=1 max=1 step=0.01 */
    sam_mask_hint_threshold?: FLOAT
    sam_mask_hint_use_negative: Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
    bbox_model: _BBOX_MODEL
    sam_model_opt?: _SAM_MODEL
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
    image: _IMAGE
    detailer_pipe: _DETAILER_PIPE
    /** default=256 min=8192 max=8192 step=64 */
    guide_size?: FLOAT
    guide_size_for: Enum_ImpactDetailerForEach_guide_size_for
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler
    /** default=0.5 min=1 max=1 step=0.01 */
    denoise?: FLOAT
    /** default=5 min=100 max=100 step=1 */
    feather?: INT
    noise_mask: Enum_ImpactDetailerForEach_noise_mask
    force_inpaint: Enum_ImpactDetailerForEach_noise_mask
    /** default=0.5 min=1 max=1 step=0.01 */
    bbox_threshold?: FLOAT
    /** default=10 min=255 max=255 step=1 */
    bbox_dilation?: INT
    /** default=3 min=10 max=10 step=0.1 */
    bbox_crop_factor?: FLOAT
    sam_detection_hint: Enum_ImpactSAMDetectorCombined_detection_hint
    /** default=0 min=255 max=255 step=1 */
    sam_dilation?: INT
    /** default=0.93 min=1 max=1 step=0.01 */
    sam_threshold?: FLOAT
    /** default=0 min=1000 max=1000 step=1 */
    sam_bbox_expansion?: INT
    /** default=0.7 min=1 max=1 step=0.01 */
    sam_mask_hint_threshold?: FLOAT
    sam_mask_hint_use_negative: Enum_ImpactSAMDetectorCombined_mask_hint_use_negative
}

// |=============================================================================|
// | ImpactBitwiseAndMask                                                        |
// |=============================================================================|
export interface ImpactBitwiseAndMask extends HasSingle_MASK, ComfyNode<ImpactBitwiseAndMask_input> {
    MASK: Slot<'MASK', 0>
}
export type ImpactBitwiseAndMask_input = {
    mask1: _MASK
    mask2: _MASK
}

// |=============================================================================|
// | ImpactSubtractMask                                                          |
// |=============================================================================|
export interface ImpactSubtractMask extends HasSingle_MASK, ComfyNode<ImpactSubtractMask_input> {
    MASK: Slot<'MASK', 0>
}
export type ImpactSubtractMask_input = {
    mask1: _MASK
    mask2: _MASK
}

// |=============================================================================|
// | ImpactSegsMask                                                              |
// |=============================================================================|
export interface ImpactSegsMask extends HasSingle_SEGS, ComfyNode<ImpactSegsMask_input> {
    SEGS: Slot<'SEGS', 0>
}
export type ImpactSegsMask_input = {
    segs: _SEGS
    mask: _MASK
}

// |=============================================================================|
// | ImpactSegsMaskCombine                                                       |
// |=============================================================================|
export interface ImpactSegsMaskCombine extends HasSingle_MASK, ComfyNode<ImpactSegsMaskCombine_input> {
    MASK: Slot<'MASK', 0>
}
export type ImpactSegsMaskCombine_input = {
    segs: _SEGS
    image: _IMAGE
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
    mask: _MASK
    combined: Enum_ImpactMaskToSEGS_combined
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
    mask: _MASK
}

// |=============================================================================|
// | ImpactMaskPainter                                                           |
// |=============================================================================|
export interface ImpactMaskPainter extends HasSingle_MASK, ComfyNode<ImpactMaskPainter_input> {
    MASK: Slot<'MASK', 0>
}
export type ImpactMaskPainter_input = {
    images: _IMAGE
    mask_image?: IMAGE_PATH
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
    samples: _LATENT
    vae: _VAE
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
    pixels: _IMAGE
    vae: _VAE
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
    samples: _LATENT
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
    samples: _LATENT
    min_auto: Enum_LatentToHist_min_auto
    /** default=-5 min=0 max=0 step=0.01 */
    min_value?: FLOAT
    max_auto: Enum_LatentToHist_min_auto
    /** default=5 min=100 max=100 step=0.01 */
    max_value?: FLOAT
    bin_auto: Enum_LatentToHist_min_auto
    /** default=10 min=1000 max=1000 step=1 */
    bin_count?: INT
    ymax_auto: Enum_LatentToHist_min_auto
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
    model: _MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
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
    setting: _DICT
    model?: _MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: Integer
    /** default=20 min=10000 max=10000 */
    steps?: Integer
    /** default=8 min=100 max=100 */
    cfg?: Float
    sampler_name?: SamplerName
    scheduler?: SchedulerName
    positive?: _CONDITIONING
    negative?: _CONDITIONING
    latent_image?: _LATENT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: Float
}

// |=============================================================================|
// | KSamplerXYZ                                                                 |
// |=============================================================================|
export interface KSamplerXYZ extends HasSingle_LATENT, ComfyNode<KSamplerXYZ_input> {
    LATENT: Slot<'LATENT', 0>
}
export type KSamplerXYZ_input = {
    setting: _DICT
    model?: _MODEL
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
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
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
    weights: _DICT
    config_name: Enum_CheckpointLoader_config_name
}

// |=============================================================================|
// | ModelIter                                                                   |
// |=============================================================================|
export interface ModelIter extends HasSingle_MODEL, ComfyNode<ModelIter_input> {
    MODEL: Slot<'MODEL', 0>
}
export type ModelIter_input = {
    model1: _MODEL
    model2: _MODEL
}

// |=============================================================================|
// | CLIPIter                                                                    |
// |=============================================================================|
export interface CLIPIter extends HasSingle_CLIP, ComfyNode<CLIPIter_input> {
    CLIP: Slot<'CLIP', 0>
}
export type CLIPIter_input = {
    clip1: _CLIP
    clip2: _CLIP
}

// |=============================================================================|
// | VAEIter                                                                     |
// |=============================================================================|
export interface VAEIter extends HasSingle_VAE, ComfyNode<VAEIter_input> {
    VAE: Slot<'VAE', 0>
}
export type VAEIter_input = {
    vae1: _VAE
    vae2: _VAE
}

// |=============================================================================|
// | StateDictMerger                                                             |
// |=============================================================================|
export interface StateDictMerger extends HasSingle_DICT, ComfyNode<StateDictMerger_input> {
    DICT: Slot<'DICT', 0>
}
export type StateDictMerger_input = {
    model_A: _DICT
    model_B: _DICT
    /** default=0 min=2 max=2 step=0.001 */
    alpha?: FLOAT
    position_ids: Enum_StateDictMerger_position_ids
    half: Enum_ImpactMaskToSEGS_combined
    model_C?: _DICT
}

// |=============================================================================|
// | StateDictMergerBlockWeighted                                                |
// |=============================================================================|
export interface StateDictMergerBlockWeighted extends HasSingle_DICT, ComfyNode<StateDictMergerBlockWeighted_input> {
    DICT: Slot<'DICT', 0>
}
export type StateDictMergerBlockWeighted_input = {
    model_A: _DICT
    model_B: _DICT
    position_ids: Enum_StateDictMerger_position_ids
    half: Enum_ImpactMaskToSEGS_combined
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
    model_A: _DICT
    model_B: _DICT
    position_ids: Enum_StateDictMerger_position_ids
    half: Enum_ImpactMaskToSEGS_combined
    /** default=0 min=2 max=2 step=0.001 */
    base_alpha?: FLOAT
    /** default="" */
    alphas?: STRING
    config_name: Enum_CheckpointLoader_config_name
}

// |=============================================================================|
// | ImageBlend2                                                                 |
// |=============================================================================|
export interface ImageBlend2 extends HasSingle_IMAGE, ComfyNode<ImageBlend2_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageBlend2_input = {
    image1: _IMAGE
    image2: _IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    blend_factor?: FLOAT
    blend_mode: Enum_ImageBlend2_blend_mode
}

// |=============================================================================|
// | GridImage                                                                   |
// |=============================================================================|
export interface GridImage extends ComfyNode<GridImage_input> {}
export type GridImage_input = {
    images: _IMAGE
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
    clip: _CLIP
}

// |=============================================================================|
// | BNK_CutoffSetRegions                                                        |
// |=============================================================================|
export interface BNK_CutoffSetRegions extends HasSingle_CLIPREGION, ComfyNode<BNK_CutoffSetRegions_input> {
    CLIPREGION: Slot<'CLIPREGION', 0>
}
export type BNK_CutoffSetRegions_input = {
    clip_regions: _CLIPREGION
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
    clip_regions: _CLIPREGION
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
    clip_regions: _CLIPREGION
    /** default="" */
    mask_token?: STRING
    /** default=1 min=1 max=1 step=0.05 */
    strict_mask?: FLOAT
    /** default=1 min=1 max=1 step=0.05 */
    start_from_masked?: FLOAT
    token_normalization: Enum_BNK_CutoffRegionsToConditioning_ADV_token_normalization
    weight_interpretation: Enum_BNK_CutoffRegionsToConditioning_ADV_weight_interpretation
}

// |=============================================================================|
// | MultiLatentComposite                                                        |
// |=============================================================================|
export interface MultiLatentComposite extends HasSingle_LATENT, ComfyNode<MultiLatentComposite_input> {
    LATENT: Slot<'LATENT', 0>
}
export type MultiLatentComposite_input = {
    samples_to: _LATENT
    samples_from0: _LATENT
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
    conditioning0: _CONDITIONING
    conditioning1: _CONDITIONING
}

// |=============================================================================|
// | ConditioningUpscale                                                         |
// |=============================================================================|
export interface ConditioningUpscale extends HasSingle_CONDITIONING, ComfyNode<ConditioningUpscale_input> {
    CONDITIONING: Slot<'CONDITIONING', 0>
}
export type ConditioningUpscale_input = {
    conditioning: _CONDITIONING
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
    conditioning: _CONDITIONING
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
    image: _IMAGE
    /** default="hand, foot, face" */
    clip?: STRING
    /** default="cuda" */
    device?: Enum_ClipSeg_device
    /** default=352 min=2048 max=2048 step=8 */
    width?: INT
    /** default=352 min=2048 max=2048 step=8 */
    height?: INT
    /** default=-1 min=255 max=255 step=1 */
    threshold?: INT
    /** default="sum" */
    mode?: Enum_ClipSeg_mode
}

// |=============================================================================|
// | CannyEdgePreprocessor                                                       |
// |=============================================================================|
export interface CannyEdgePreprocessor extends HasSingle_IMAGE, ComfyNode<CannyEdgePreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type CannyEdgePreprocessor_input = {
    image: _IMAGE
    /** default=100 min=255 max=255 step=1 */
    low_threshold?: INT
    /** default=200 min=255 max=255 step=1 */
    high_threshold?: INT
    /** default="disable" */
    l2gradient?: Enum_KSamplerAdvanced_add_noise
}

// |=============================================================================|
// | MLSDPreprocessor                                                            |
// |=============================================================================|
export interface MLSDPreprocessor extends HasSingle_IMAGE, ComfyNode<MLSDPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type MLSDPreprocessor_input = {
    image: _IMAGE
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
    image: _IMAGE
    /** default="v1.1" */
    version?: Enum_HEDPreprocessor_version
    /** default="enable" */
    safe?: Enum_KSamplerAdvanced_add_noise
}

// |=============================================================================|
// | ScribblePreprocessor                                                        |
// |=============================================================================|
export interface ScribblePreprocessor extends HasSingle_IMAGE, ComfyNode<ScribblePreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ScribblePreprocessor_input = {
    image: _IMAGE
}

// |=============================================================================|
// | FakeScribblePreprocessor                                                    |
// |=============================================================================|
export interface FakeScribblePreprocessor extends HasSingle_IMAGE, ComfyNode<FakeScribblePreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type FakeScribblePreprocessor_input = {
    image: _IMAGE
}

// |=============================================================================|
// | BinaryPreprocessor                                                          |
// |=============================================================================|
export interface BinaryPreprocessor extends HasSingle_IMAGE, ComfyNode<BinaryPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type BinaryPreprocessor_input = {
    image: _IMAGE
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
    image: _IMAGE
    /** default="enable" */
    safe?: Enum_KSamplerAdvanced_add_noise
}

// |=============================================================================|
// | LineArtPreprocessor                                                         |
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
// | AnimeLineArtPreprocessor                                                    |
// |=============================================================================|
export interface AnimeLineArtPreprocessor extends HasSingle_IMAGE, ComfyNode<AnimeLineArtPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type AnimeLineArtPreprocessor_input = {
    image: _IMAGE
}

// |=============================================================================|
// | Manga2AnimeLineArtPreprocessor                                              |
// |=============================================================================|
export interface Manga2AnimeLineArtPreprocessor extends HasSingle_IMAGE, ComfyNode<Manga2AnimeLineArtPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type Manga2AnimeLineArtPreprocessor_input = {
    image: _IMAGE
}

// |=============================================================================|
// | MiDaSDepthMapPreprocessor                                                   |
// |=============================================================================|
export interface MiDaSDepthMapPreprocessor extends HasSingle_IMAGE, ComfyNode<MiDaSDepthMapPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type MiDaSDepthMapPreprocessor_input = {
    image: _IMAGE
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
    image: _IMAGE
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
    image: _IMAGE
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
    image: _IMAGE
}

// |=============================================================================|
// | BAENormalMapPreprocessor                                                    |
// |=============================================================================|
export interface BAENormalMapPreprocessor extends HasSingle_IMAGE, ComfyNode<BAENormalMapPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type BAENormalMapPreprocessor_input = {
    image: _IMAGE
}

// |=============================================================================|
// | OpenposePreprocessor                                                        |
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
// | MediaPipeHandPosePreprocessor                                               |
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
// | SemSegPreprocessor                                                          |
// |=============================================================================|
export interface SemSegPreprocessor extends HasSingle_IMAGE, ComfyNode<SemSegPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type SemSegPreprocessor_input = {
    image: _IMAGE
}

// |=============================================================================|
// | UniFormerSemSegPreprocessor                                                 |
// |=============================================================================|
export interface UniFormerSemSegPreprocessor extends HasSingle_IMAGE, ComfyNode<UniFormerSemSegPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type UniFormerSemSegPreprocessor_input = {
    image: _IMAGE
}

// |=============================================================================|
// | OneFormerCOCOSemSegPreprocessor                                             |
// |=============================================================================|
export interface OneFormerCOCOSemSegPreprocessor extends HasSingle_IMAGE, ComfyNode<OneFormerCOCOSemSegPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type OneFormerCOCOSemSegPreprocessor_input = {
    image: _IMAGE
}

// |=============================================================================|
// | OneFormerADE20KSemSegPreprocessor                                           |
// |=============================================================================|
export interface OneFormerADE20KSemSegPreprocessor extends HasSingle_IMAGE, ComfyNode<OneFormerADE20KSemSegPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type OneFormerADE20KSemSegPreprocessor_input = {
    image: _IMAGE
}

// |=============================================================================|
// | MediaPipeFaceMeshPreprocessor                                               |
// |=============================================================================|
export interface MediaPipeFaceMeshPreprocessor extends HasSingle_IMAGE, ComfyNode<MediaPipeFaceMeshPreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type MediaPipeFaceMeshPreprocessor_input = {
    image: _IMAGE
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
    image: _IMAGE
}

// |=============================================================================|
// | TilePreprocessor                                                            |
// |=============================================================================|
export interface TilePreprocessor extends HasSingle_IMAGE, ComfyNode<TilePreprocessor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type TilePreprocessor_input = {
    image: _IMAGE
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
    clip: _CLIP
}

// |=============================================================================|
// | CLIPSetRegion                                                               |
// |=============================================================================|
export interface CLIPSetRegion extends HasSingle_CLIPREGION, ComfyNode<CLIPSetRegion_input> {
    CLIPREGION: Slot<'CLIPREGION', 0>
}
export type CLIPSetRegion_input = {
    clip_regions: _CLIPREGION
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
    clip_regions: _CLIPREGION
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
    sampler_state: Enum_KSamplerEfficient_sampler_state
    model: _MODEL
    /** default=0 min=18446744073709552000 max=18446744073709552000 */
    seed?: INT
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
    /** default=1 min=1 max=1 step=0.01 */
    denoise?: FLOAT
    preview_image: Enum_KSamplerEfficient_preview_image
    optional_vae?: _VAE
    script?: _SCRIPT
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
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
    vae_name: Enum_EfficientLoader_vae_name
    /** default=-1 min=-1 max=-1 step=1 */
    clip_skip?: INT
    lora_name: Enum_EfficientLoader_lora_name
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
    X_type: Enum_XYPlot_X_type
    /** default="" */
    X_value?: STRING
    Y_type: Enum_XYPlot_X_type
    /** default="" */
    Y_value?: STRING
    /** default=0 min=500 max=500 step=5 */
    grid_spacing?: INT
    XY_flip: Enum_ImpactMaskToSEGS_combined
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
    base_image: _IMAGE
    overlay_image: _IMAGE
    overlay_resize: Enum_ImageOverlay_overlay_resize
    resize_method: Enum_LatentUpscale_upscale_method
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
    optional_mask?: _MASK
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
    print_to_console: Enum_ImpactMaskToSEGS_combined
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
    print_to_console: Enum_ImpactMaskToSEGS_combined
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
    image: _IMAGE
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
    image: _IMAGE
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
    image: _IMAGE
    mode: Enum_WASImageFlip_mode
}

// |=============================================================================|
// | LatentUpscaleMultiply                                                       |
// |=============================================================================|
export interface LatentUpscaleMultiply extends HasSingle_LATENT, ComfyNode<LatentUpscaleMultiply_input> {
    LATENT: Slot<'LATENT', 0>
}
export type LatentUpscaleMultiply_input = {
    samples: _LATENT
    upscale_method: Enum_LatentUpscale_upscale_method
    /** default=1.25 min=10 max=10 step=0.1 */
    WidthMul?: FLOAT
    /** default=1.25 min=10 max=10 step=0.1 */
    HeightMul?: FLOAT
    crop: Enum_LatentUpscale_crop
}

// |=============================================================================|
// | PseudoHDRStyle                                                              |
// |=============================================================================|
export interface PseudoHDRStyle extends HasSingle_IMAGE, ComfyNode<PseudoHDRStyle_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type PseudoHDRStyle_input = {
    image: _IMAGE
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
    image: _IMAGE
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
    image: _IMAGE
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
    config_name: Enum_CheckpointLoader_config_name
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
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
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
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
    clip: _CLIP
}

// |=============================================================================|
// | WASConditioningInputSwitch                                                  |
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
// | WASConstantNumber                                                           |
// |=============================================================================|
export interface WASConstantNumber extends HasSingle_NUMBER, ComfyNode<WASConstantNumber_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASConstantNumber_input = {
    number_type: Enum_WASConstantNumber_number_type
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
    include_subfolders: Enum_WASCreateGridImage_include_subfolders
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
    image_a: _IMAGE
    image_b: _IMAGE
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
    filetype: Enum_WASCreateMorphImage_filetype
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
    filetype: Enum_WASCreateMorphImage_filetype
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
    codec: Enum_WASCreateVideoFromPath_codec
}

// |=============================================================================|
// | WASDebugNumberToConsole                                                     |
// |=============================================================================|
export interface WASDebugNumberToConsole extends HasSingle_NUMBER, ComfyNode<WASDebugNumberToConsole_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASDebugNumberToConsole_input = {
    number: _NUMBER
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
    dictionary: _DICT
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
    model_path: Enum_CLIPLoader_clip_name
}

// |=============================================================================|
// | WASLatentInputSwitch                                                        |
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
    model: _MODEL
    clip: _CLIP
    lora_name: Enum_LoraLoader_lora_name
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
    image: _IMAGE
    mode: Enum_WASImageAnalyze_mode
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
    image_a: _IMAGE
    image_b: _IMAGE
    mask: _IMAGE
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
    image_a: _IMAGE
    image_b: _IMAGE
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
    image_a: _IMAGE
    image_b: _IMAGE
    mode: Enum_WASImageBlendingMode_mode
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
    image: _IMAGE
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
    image: _IMAGE
    enable_threshold: Enum_WASCreateGridImage_include_subfolders
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
    image: _IMAGE
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
    image: _IMAGE
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
    image: _IMAGE
    /** default=0.25 min=2 max=2 step=0.01 */
    crop_padding_factor?: FLOAT
    cascade_xml: Enum_WASImageCropFace_cascade_xml
    use_face_recognition_gpu: Enum_WASCreateGridImage_include_subfolders
}

// |=============================================================================|
// | WASImageCropLocation                                                        |
// |=============================================================================|
export interface WASImageCropLocation extends HasSingle_IMAGE, HasSingle_CROP_DATA, ComfyNode<WASImageCropLocation_input> {
    IMAGE: Slot<'IMAGE', 0>
    CROP_DATA: Slot<'CROP_DATA', 1>
}
export type WASImageCropLocation_input = {
    image: _IMAGE
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
    image: _IMAGE
    crop_image: _IMAGE
    crop_data: _CROP_DATA
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
    image: _IMAGE
    crop_image: _IMAGE
    crop_data: _CROP_DATA
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
    image: _IMAGE
    crop_image: _IMAGE
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
    image: _IMAGE
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
    colorize: Enum_WASCreateGridImage_include_subfolders
}

// |=============================================================================|
// | WASImageEdgeDetectionFilter                                                 |
// |=============================================================================|
export interface WASImageEdgeDetectionFilter extends HasSingle_IMAGE, ComfyNode<WASImageEdgeDetectionFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageEdgeDetectionFilter_input = {
    image: _IMAGE
    mode: Enum_WASImageEdgeDetectionFilter_mode
}

// |=============================================================================|
// | WASImageFilmGrain                                                           |
// |=============================================================================|
export interface WASImageFilmGrain extends HasSingle_IMAGE, ComfyNode<WASImageFilmGrain_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageFilmGrain_input = {
    image: _IMAGE
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
    image: _IMAGE
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
    image: _IMAGE
    gradient_image: _IMAGE
    flip_left_right: Enum_WASCreateGridImage_include_subfolders
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
    direction: Enum_WASImageFlip_mode
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
    image: _IMAGE
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
    image: Enum_WASImageHistoryLoader_image
}

// |=============================================================================|
// | WASImageInputSwitch                                                         |
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
// | WASImageLevelsAdjustment                                                    |
// |=============================================================================|
export interface WASImageLevelsAdjustment extends HasSingle_IMAGE, ComfyNode<WASImageLevelsAdjustment_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageLevelsAdjustment_input = {
    image: _IMAGE
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
    image: _IMAGE
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
    red_channel: _IMAGE
    green_channel: _IMAGE
    blue_channel: _IMAGE
}

// |=============================================================================|
// | WASImageMonitorEffectsFilter                                                |
// |=============================================================================|
export interface WASImageMonitorEffectsFilter extends HasSingle_IMAGE, ComfyNode<WASImageMonitorEffectsFilter_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageMonitorEffectsFilter_input = {
    image: _IMAGE
    mode: Enum_WASImageMonitorEffectsFilter_mode
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
    image: _IMAGE
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
    image: _IMAGE
    /** default=120 min=2048 max=2048 step=1 */
    feathering?: INT
    feather_second_pass: Enum_WASCreateGridImage_include_subfolders
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
    image: _IMAGE
    mode: Enum_WASImageRemoveBackgroundAlpha_mode
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
    image: _IMAGE
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
    image: _IMAGE
    mode: Enum_WASImageResize_mode
    supersample: Enum_WASCreateGridImage_include_subfolders
    resampling: Enum_WASImageResize_resampling
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
    image: _IMAGE
    mode: Enum_WASImageRotate_mode
    /** default=0 min=360 max=360 step=90 */
    rotation?: INT
    sampler: Enum_WASImageRotate_sampler
}

// |=============================================================================|
// | WASImageSave                                                                |
// |=============================================================================|
export interface WASImageSave extends ComfyNode<WASImageSave_input> {}
export type WASImageSave_input = {
    images: _IMAGE
    /** default="./ComfyUI/output" */
    output_path?: STRING
    /** default="ComfyUI" */
    filename_prefix?: STRING
    extension: Enum_WASImageSave_extension
    /** default=100 min=100 max=100 step=1 */
    quality?: INT
    overwrite_mode: Enum_WASImageSave_overwrite_mode
}

// |=============================================================================|
// | WASImageSeamlessTexture                                                     |
// |=============================================================================|
export interface WASImageSeamlessTexture extends HasSingle_IMAGE, ComfyNode<WASImageSeamlessTexture_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageSeamlessTexture_input = {
    image: _IMAGE
    /** default=0.4 min=1 max=1 step=0.01 */
    blending?: FLOAT
    tiled: Enum_WASCreateGridImage_include_subfolders
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
    image: _IMAGE
    channel: Enum_WASImageSelectChannel_channel
}

// |=============================================================================|
// | WASImageSelectColor                                                         |
// |=============================================================================|
export interface WASImageSelectColor extends HasSingle_IMAGE, ComfyNode<WASImageSelectColor_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageSelectColor_input = {
    image: _IMAGE
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
    image: _IMAGE
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
    image: _IMAGE
}

// |=============================================================================|
// | WASImageStitch                                                              |
// |=============================================================================|
export interface WASImageStitch extends HasSingle_IMAGE, ComfyNode<WASImageStitch_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageStitch_input = {
    image_a: _IMAGE
    image_b: _IMAGE
    stitch: Enum_WASImageStitch_stitch
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
    image: _IMAGE
    style: Enum_WASImageStyleFilter_style
}

// |=============================================================================|
// | WASImageThreshold                                                           |
// |=============================================================================|
export interface WASImageThreshold extends HasSingle_IMAGE, ComfyNode<WASImageThreshold_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type WASImageThreshold_input = {
    image: _IMAGE
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
    image: _IMAGE
    image_overlay: _IMAGE
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
    image: _IMAGE
    depth: _IMAGE
    mode: Enum_WASImageFDOFFilter_mode
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
    image: _IMAGE
    channel: Enum_LoadImageMask_channel
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
    model: _MODEL
    seed: _SEED
    /** default=20 min=10000 max=10000 */
    steps?: INT
    /** default=8 min=100 max=100 */
    cfg?: FLOAT
    sampler_name: Enum_KSampler_sampler_name
    scheduler: Enum_KSampler_scheduler
    positive: _CONDITIONING
    negative: _CONDITIONING
    latent_image: _LATENT
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
    samples: _LATENT
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
    samples: _LATENT
}

// |=============================================================================|
// | WASLatentUpscaleByFactorWAS                                                 |
// |=============================================================================|
export interface WASLatentUpscaleByFactorWAS extends HasSingle_LATENT, ComfyNode<WASLatentUpscaleByFactorWAS_input> {
    LATENT: Slot<'LATENT', 0>
}
export type WASLatentUpscaleByFactorWAS_input = {
    samples: _LATENT
    mode: Enum_WASLatentUpscaleByFactorWAS_mode
    /** default=2 min=8 max=8 step=0.01 */
    factor?: FLOAT
    align: Enum_WASCreateGridImage_include_subfolders
}

// |=============================================================================|
// | WASLoadImageBatch                                                           |
// |=============================================================================|
export interface WASLoadImageBatch extends HasSingle_IMAGE, HasSingle_ASCII, ComfyNode<WASLoadImageBatch_input> {
    IMAGE: Slot<'IMAGE', 0>
    ASCII: Slot<'ASCII', 1>
}
export type WASLoadImageBatch_input = {
    mode: Enum_WASLoadImageBatch_mode
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
    image: _IMAGE
    use_cpu: Enum_WASCreateGridImage_include_subfolders
    midas_model: Enum_WASMiDaSDepthApproximation_midas_model
    invert_depth: Enum_WASCreateGridImage_include_subfolders
}

// |=============================================================================|
// | WASMiDaSMaskImage                                                           |
// |=============================================================================|
export interface WASMiDaSMaskImage extends ComfyNode<WASMiDaSMaskImage_input> {
    IMAGE: Slot<'IMAGE', 0>
    IMAGE_1: Slot<'IMAGE', 1>
}
export type WASMiDaSMaskImage_input = {
    image: _IMAGE
    use_cpu: Enum_WASCreateGridImage_include_subfolders
    midas_model: Enum_WASMiDaSDepthApproximation_midas_model
    remove: Enum_WASMiDaSMaskImage_remove
    threshold: Enum_WASCreateGridImage_include_subfolders
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
    number_a: _NUMBER
    number_b: _NUMBER
    operation: Enum_WASNumberOperation_operation
}

// |=============================================================================|
// | WASNumberToFloat                                                            |
// |=============================================================================|
export interface WASNumberToFloat extends HasSingle_FLOAT, ComfyNode<WASNumberToFloat_input> {
    FLOAT: Slot<'FLOAT', 0>
}
export type WASNumberToFloat_input = {
    number: _NUMBER
}

// |=============================================================================|
// | WASNumberInputSwitch                                                        |
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
// | WASNumberInputCondition                                                     |
// |=============================================================================|
export interface WASNumberInputCondition extends HasSingle_NUMBER, ComfyNode<WASNumberInputCondition_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASNumberInputCondition_input = {
    number_a: _NUMBER
    number_b: _NUMBER
    comparison: Enum_WASNumberInputCondition_comparison
}

// |=============================================================================|
// | WASNumberMultipleOf                                                         |
// |=============================================================================|
export interface WASNumberMultipleOf extends HasSingle_NUMBER, ComfyNode<WASNumberMultipleOf_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASNumberMultipleOf_input = {
    number: _NUMBER
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
    number: _NUMBER
}

// |=============================================================================|
// | WASNumberToSeed                                                             |
// |=============================================================================|
export interface WASNumberToSeed extends HasSingle_SEED, ComfyNode<WASNumberToSeed_input> {
    SEED: Slot<'SEED', 0>
}
export type WASNumberToSeed_input = {
    number: _NUMBER
}

// |=============================================================================|
// | WASNumberToString                                                           |
// |=============================================================================|
export interface WASNumberToString extends HasSingle_STRING, ComfyNode<WASNumberToString_input> {
    STRING: Slot<'STRING', 0>
}
export type WASNumberToString_input = {
    number: _NUMBER
}

// |=============================================================================|
// | WASNumberToText                                                             |
// |=============================================================================|
export interface WASNumberToText extends HasSingle_ASCII, ComfyNode<WASNumberToText_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASNumberToText_input = {
    number: _NUMBER
}

// |=============================================================================|
// | WASPromptStylesSelector                                                     |
// |=============================================================================|
export interface WASPromptStylesSelector extends ComfyNode<WASPromptStylesSelector_input> {
    ASCII: Slot<'ASCII', 0>
    ASCII_1: Slot<'ASCII', 1>
}
export type WASPromptStylesSelector_input = {
    style: Enum_WASPromptStylesSelector_style
}

// |=============================================================================|
// | WASRandomNumber                                                             |
// |=============================================================================|
export interface WASRandomNumber extends HasSingle_NUMBER, ComfyNode<WASRandomNumber_input> {
    NUMBER: Slot<'NUMBER', 0>
}
export type WASRandomNumber_input = {
    number_type: Enum_WASConstantNumber_number_type
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
    text: _ASCII
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
    images_batch: _IMAGE
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
    image: _IMAGE
    mode: Enum_WASBLIPAnalyzeImage_mode
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
    model_size: Enum_WASSAMModelLoader_model_size
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
    sam_parameters_a: _SAM_PARAMETERS
    sam_parameters_b: _SAM_PARAMETERS
}

// |=============================================================================|
// | WASSAMImageMask                                                             |
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
    image: _IMAGE
}

// |=============================================================================|
// | WASInsetImageBounds                                                         |
// |=============================================================================|
export interface WASInsetImageBounds extends HasSingle_IMAGE_BOUNDS, ComfyNode<WASInsetImageBounds_input> {
    IMAGE_BOUNDS: Slot<'IMAGE_BOUNDS', 0>
}
export type WASInsetImageBounds_input = {
    image_bounds: _IMAGE_BOUNDS
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
    target: _IMAGE
    target_bounds: _IMAGE_BOUNDS
    source: _IMAGE
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
    target: _IMAGE
    target_mask: _MASK
    target_bounds: _IMAGE_BOUNDS
    source: _IMAGE
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
    image: _IMAGE
    image_bounds: _IMAGE_BOUNDS
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
    image: _IMAGE
    mask: _MASK
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
    dictionary_a: _DICT
    dictionary_b: _DICT
    dictionary_c?: _DICT
    dictionary_d?: _DICT
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
    token_name: _ASCII
    token_value: _ASCII
}

// |=============================================================================|
// | WASTextConcatenate                                                          |
// |=============================================================================|
export interface WASTextConcatenate extends HasSingle_ASCII, ComfyNode<WASTextConcatenate_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextConcatenate_input = {
    text_a: _ASCII
    text_b: _ASCII
    linebreak_addition: Enum_WASCreateGridImage_include_subfolders
    text_c?: _ASCII
    text_d?: _ASCII
}

// |=============================================================================|
// | WASTextFileHistoryLoader                                                    |
// |=============================================================================|
export interface WASTextFileHistoryLoader extends HasSingle_ASCII, HasSingle_DICT, ComfyNode<WASTextFileHistoryLoader_input> {
    ASCII: Slot<'ASCII', 0>
    DICT: Slot<'DICT', 1>
}
export type WASTextFileHistoryLoader_input = {
    file: Enum_WASTextFileHistoryLoader_file
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
    text: _ASCII
    dictionary: _DICT
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
    text: _ASCII
    find: _ASCII
    replace: _ASCII
}

// |=============================================================================|
// | WASTextFindAndReplace                                                       |
// |=============================================================================|
export interface WASTextFindAndReplace extends HasSingle_ASCII, ComfyNode<WASTextFindAndReplace_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextFindAndReplace_input = {
    text: _ASCII
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
    text_a: _ASCII
    text_b: _ASCII
    boolean_number: _NUMBER
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
    text: _ASCII
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
    text: _ASCII
}

// |=============================================================================|
// | WASTextParseTokens                                                          |
// |=============================================================================|
export interface WASTextParseTokens extends HasSingle_ASCII, ComfyNode<WASTextParseTokens_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextParseTokens_input = {
    text: _ASCII
}

// |=============================================================================|
// | WASTextRandomLine                                                           |
// |=============================================================================|
export interface WASTextRandomLine extends HasSingle_ASCII, ComfyNode<WASTextRandomLine_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextRandomLine_input = {
    text: _ASCII
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
    clip: _CLIP
    text: _ASCII
}

// |=============================================================================|
// | WASTextToConsole                                                            |
// |=============================================================================|
export interface WASTextToConsole extends HasSingle_ASCII, ComfyNode<WASTextToConsole_input> {
    ASCII: Slot<'ASCII', 0>
}
export type WASTextToConsole_input = {
    text: _ASCII
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
    text: _ASCII
}

// |=============================================================================|
// | WASTextToString                                                             |
// |=============================================================================|
export interface WASTextToString extends HasSingle_STRING, ComfyNode<WASTextToString_input> {
    STRING: Slot<'STRING', 0>
}
export type WASTextToString_input = {
    text: _ASCII
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
    ckpt_name: Enum_CheckpointLoaderSimple_ckpt_name
}

// |=============================================================================|
// | WASUpscaleModelLoader                                                       |
// |=============================================================================|
export interface WASUpscaleModelLoader extends HasSingle_UPSCALE_MODEL, HasSingle_ASCII, ComfyNode<WASUpscaleModelLoader_input> {
    UPSCALE_MODEL: Slot<'UPSCALE_MODEL', 0>
    ASCII: Slot<'ASCII', 1>
}
export type WASUpscaleModelLoader_input = {
    model_name: Enum_WASUpscaleModelLoader_model_name
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
    image: _IMAGE
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
    image: _IMAGE
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
    codec: Enum_WASCreateVideoFromPath_codec
}

// |=============================================================================|
// | YKImagePadForOutpaint                                                       |
// |=============================================================================|
export interface YKImagePadForOutpaint extends HasSingle_IMAGE, HasSingle_MASK, ComfyNode<YKImagePadForOutpaint_input> {
    IMAGE: Slot<'IMAGE', 0>
    MASK: Slot<'MASK', 1>
}
export type YKImagePadForOutpaint_input = {
    image: _IMAGE
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
    mask: _MASK
}

// |=============================================================================|
// | HypernetworkLoader                                                          |
// |=============================================================================|
export interface HypernetworkLoader extends HasSingle_MODEL, ComfyNode<HypernetworkLoader_input> {
    MODEL: Slot<'MODEL', 0>
}
export type HypernetworkLoader_input = {
    model: _MODEL
    hypernetwork_name: Enum_CLIPLoader_clip_name
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
    model_name: Enum_WASUpscaleModelLoader_model_name
}

// |=============================================================================|
// | ImageUpscaleWithModel                                                       |
// |=============================================================================|
export interface ImageUpscaleWithModel extends HasSingle_IMAGE, ComfyNode<ImageUpscaleWithModel_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageUpscaleWithModel_input = {
    upscale_model: _UPSCALE_MODEL
    image: _IMAGE
}

// |=============================================================================|
// | ImageBlend                                                                  |
// |=============================================================================|
export interface ImageBlend extends HasSingle_IMAGE, ComfyNode<ImageBlend_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageBlend_input = {
    image1: _IMAGE
    image2: _IMAGE
    /** default=0.5 min=1 max=1 step=0.01 */
    blend_factor?: FLOAT
    blend_mode: Enum_ImageBlend_blend_mode
}

// |=============================================================================|
// | ImageBlur                                                                   |
// |=============================================================================|
export interface ImageBlur extends HasSingle_IMAGE, ComfyNode<ImageBlur_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageBlur_input = {
    image: _IMAGE
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
    image: _IMAGE
    /** default=256 min=256 max=256 step=1 */
    colors?: INT
    dither: Enum_ImageQuantize_dither
}

// |=============================================================================|
// | ImageSharpen                                                                |
// |=============================================================================|
export interface ImageSharpen extends HasSingle_IMAGE, ComfyNode<ImageSharpen_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type ImageSharpen_input = {
    image: _IMAGE
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
    destination: _LATENT
    source: _LATENT
    /** default=0 min=8192 max=8192 step=8 */
    x?: INT
    /** default=0 min=8192 max=8192 step=8 */
    y?: INT
    mask?: _MASK
}

// |=============================================================================|
// | MaskToImage                                                                 |
// |=============================================================================|
export interface MaskToImage extends HasSingle_IMAGE, ComfyNode<MaskToImage_input> {
    IMAGE: Slot<'IMAGE', 0>
}
export type MaskToImage_input = {
    mask: _MASK
}

// |=============================================================================|
// | ImageToMask                                                                 |
// |=============================================================================|
export interface ImageToMask extends HasSingle_MASK, ComfyNode<ImageToMask_input> {
    MASK: Slot<'MASK', 0>
}
export type ImageToMask_input = {
    image: _IMAGE
    channel: Enum_WASImageSelectChannel_channel
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
    mask: _MASK
}

// |=============================================================================|
// | CropMask                                                                    |
// |=============================================================================|
export interface CropMask extends HasSingle_MASK, ComfyNode<CropMask_input> {
    MASK: Slot<'MASK', 0>
}
export type CropMask_input = {
    mask: _MASK
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
    destination: _MASK
    source: _MASK
    /** default=0 min=8192 max=8192 step=1 */
    x?: INT
    /** default=0 min=8192 max=8192 step=1 */
    y?: INT
    operation: Enum_MaskComposite_operation
}

// |=============================================================================|
// | FeatherMask                                                                 |
// |=============================================================================|
export interface FeatherMask extends HasSingle_MASK, ComfyNode<FeatherMask_input> {
    MASK: Slot<'MASK', 0>
}
export type FeatherMask_input = {
    mask: _MASK
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
