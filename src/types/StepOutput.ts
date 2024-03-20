import type { ComfyPromptL } from '../models/ComfyPrompt'
import type { ComfyWorkflowL } from '../models/ComfyWorkflow'
import type { Media3dDisplacementL } from '../models/Media3dDisplacement'
import type { MediaImageL } from '../models/MediaImage'
import type { MediaTextL } from '../models/MediaText'
import type { MediaVideoL } from '../models/MediaVideo'
import type { RuntimeErrorL } from '../models/RuntimeError'
import type { StepL } from '../models/Step'

import { MediaSplatL } from '../models/MediaSplat'

// prettier-ignore
export type StepOutput =
    // media
    | MediaTextL           // StepOutput_Text
    | MediaImageL          // StepOutput_Image
    | MediaVideoL          // StepOutput_Video
    | MediaSplatL          // StepOutput_Video
    | Media3dDisplacementL // StepOutput_DisplacedImage
    // core objects
    | ComfyPromptL         // ComfyPromptL
    | ComfyWorkflowL               // StepOutput_ComfyWorkflow // graph
    | StepL                // StepOutput_Step // graph
    // CushyError
    | RuntimeErrorL // StepOutput_RuntimeError

export type StepOutput_Video = MediaVideoL //{ type: 'video'; url: string } // prettier-ignore
export type StepOutput_Text = MediaTextL // { type: 'print'; message: string } // prettier-ignore
export type StepOutput_Image = MediaImageL // { type: 'image'; imgID: MediaImageID } // prettier-ignore
export type StepOutput_Step = StepL // { type: 'step'; StepID: StepID } // prettier-ignore
