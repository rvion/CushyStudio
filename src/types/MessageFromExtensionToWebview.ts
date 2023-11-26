import type { FormResult } from 'src/cards/Card'
import type { Widget } from 'src/controls/Widget'
import type { GraphID } from 'src/models/Graph'
import type { ImageID } from 'src/models/Image'
import type { FlowID } from 'src/types/FlowID'
import type { PromptID, WsMsgExecutionError } from './ComfyWsApi'

// prettier-ignore
export type StepOutput =
    | StepOutput_Text
    | StepOutput_Image
    | StepOutput_ComfyWorkflow
    | StepOutput_Prompt
    | StepOutput_Html
    | StepOutput_DisplacedImage
    | StepOutput_RuntimeError
    | StepOutput_ExecutionError
    | StepOutput_GUI

export type StepOutput_DisplacedImage = {
    type: 'displaced-image'
    width: number
    height: number
    image: string
    depthMap: string
    normalMap: string
}
export type StepOutput_Text = { type: 'print'; message: string }
export type StepOutput_Image = { type: 'image'; imgID: ImageID }
export type StepOutput_ComfyWorkflow = { type: 'comfy-workflow'; graphID: GraphID }
export type StepOutput_Prompt = { type: 'prompt'; promptID: PromptID }
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

export type StepOutput_ExecutionError = {
    type: 'executionError'
    payloadFromComfy: WsMsgExecutionError
}

export type StepOutput_GUI = {
    type: 'ask'
    flowID: FlowID
    form: Widget
    result: FormResult<any>
}
