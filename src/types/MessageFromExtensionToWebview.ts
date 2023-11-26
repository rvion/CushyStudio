import type { FormResult } from 'src/cards/Card'
import type { Widget } from 'src/controls/Widget'
import type { FlowID } from 'src/types/FlowID'
import type { GraphID } from 'src/models/Graph'
import type { ImageT } from 'src/models/Image'
import type { PromptID } from './ComfyWsApi'

export type FromExtension_CushyStatus = { type: 'cushy_status'; connected: boolean }

export type StepOutput_Text = { type: 'print'; message: string }
export type StepOutput_Prompt = { type: 'prompt'; promptID: PromptID }
export type StepOutput_Images = { type: 'images'; flowID?: Maybe<FlowID>; images: ImageT[] }
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

export type FromExtension_ask = { type: 'ask'; flowID: FlowID; form: Widget; result: FormResult<any> }
