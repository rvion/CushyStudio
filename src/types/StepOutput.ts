import type { FormResult } from 'src/cards/Card'
import type { Widget } from 'src/controls/Widget'
import type { FlowID } from 'src/types/FlowID'
import type { PromptID } from './ComfyWsApi'

// prettier-ignore
export type StepOutput =
    // media
    | StepOutput_Text
    | StepOutput_Image
    | StepOutput_Video
    | StepOutput_DisplacedImage
    // core objects
    | StepOutput_Prompt
    | StepOutput_ComfyWorkflow // graph
    | StepOutput_Step // graph
    // CushyError
    | StepOutput_RuntimeError
// | StepOutput_Html
// | StepOutput_ExecutionError
// | StepOutput_GUI

export type StepOutput_DisplacedImage = {
    type: 'displaced-image'
    width: number
    height: number
    image: string
    depthMap: string
    normalMap: string
}

export type StepOutput_Video         = { type: 'video'; url: string } // prettier-ignore
export type StepOutput_Text          = { type: 'print'; message: string } // prettier-ignore
export type StepOutput_Image         = { type: 'image'; imgID: MediaImageID } // prettier-ignore
export type StepOutput_ComfyWorkflow = { type: 'comfy-workflow'; graphID: GraphID } // prettier-ignore
export type StepOutput_Prompt        = { type: 'prompt'; promptID: PromptID } // prettier-ignore
export type StepOutput_Step          = { type: 'step'; StepID: StepID } // prettier-ignore

// export type StepOutput_ExecutionError = {
//     type: 'executionError'
//     payloadFromComfy: WsMsgExecutionError
// }

export type StepOutput_Html = { type: 'show-html'; flowID?: FlowID; content: string; title: string }
export type StepOutput_RuntimeError = {
    type: 'runtimeError'
    message: string
    infos: { [key: string]: any }
    promptID?: PromptID

    /** sometimes, we don't have a prompt ID,
     * because comfy crash trying to assign one
     * this field is here to allow the UI to offer to
     * show the offending graph anyway */
    graphID?: GraphID
}

export type StepOutput_GUI = {
    type: 'ask'
    flowID: FlowID
    form: Widget
    result: FormResult<any>
}
