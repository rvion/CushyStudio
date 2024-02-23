import type { ComfyPromptL } from 'src/models/ComfyPrompt'
import type { ComfyWorkflowL } from 'src/models/ComfyWorkflow'
import type { Media3dDisplacementL } from 'src/models/Media3dDisplacement'
import type { MediaImageL } from 'src/models/MediaImage'
import type { MediaTextL } from 'src/models/MediaText'
import type { MediaVideoL } from 'src/models/MediaVideo'
import type { RuntimeErrorL } from 'src/models/RuntimeError'
import type { StepL } from 'src/models/Step'

import { MediaSplatL } from 'src/models/MediaSplat'

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
