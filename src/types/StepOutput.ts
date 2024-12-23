import type { ComfyPromptL } from '../models/ComfyPrompt'
import type { ComfyWorkflowL } from '../models/ComfyWorkflow'
import type { Media3dDisplacementL } from '../models/Media3dDisplacement'
import type { MediaCustomL } from '../models/MediaCustom'
import type { MediaImageL } from '../models/MediaImage'
import type { MediaSplatL } from '../models/MediaSplat'
import type { MediaTextL } from '../models/MediaText'
import type { MediaVideoL } from '../models/MediaVideo'
import type { RuntimeErrorL } from '../models/RuntimeError'
import type { StepL } from '../models/Step'

// prettier-ignore
export type StepOutput =
    // media
    | MediaTextL           // StepOutput_Text
    | MediaImageL          // StepOutput_Image
    | MediaVideoL          // StepOutput_Video
    | MediaSplatL          // StepOutput_Video
    | Media3dDisplacementL // StepOutput_DisplacedImage
    | MediaCustomL        // StepOutput_DisplacedImage
    // core objects
    | ComfyPromptL         // ComfyPromptL
    | ComfyWorkflowL       // StepOutput_ComfyWorkflow // graph
    | StepL                // StepOutput_Step // graph
    // CushyError
    | RuntimeErrorL // StepOutput_RuntimeError
