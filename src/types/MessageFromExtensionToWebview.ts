import type { FormResult } from 'src/core/Requirement'
import type { ImageID, ImageT } from 'src/models/Image'
import type { ToolID } from 'src/models/Tool'
import type { FlowID } from 'src/front/FlowID'
import type { PromptID, WsMsgExecuted, WsMsgExecuting, WsMsgExecutionCached, WsMsgProgress, WsMsgStatus } from './ComfyWsApi'
import type { GraphID } from 'src/models/Graph'
import type { StepID } from 'src/models/Step'
import { Requestable } from 'src/controls/InfoRequest'

// =============================================================================================
// | FRONT => BACK                                                                             |
// =============================================================================================
// sent when the webpage is loaded
// request to run a flow
export type FromWebview_runAction = {
    type: 'run-action'
    flowID: FlowID
    actionID: ToolID
    /** the execution ID to use (defined client-side, see ActionFront) */
    stepID: StepID
    data: FormResult<any>
}
// request to open an external URL
export type FromWebview_openExternal = { type: 'open-external'; uriString: string }
// answer a data request in the middle of a flow
export type FromWebview_Answer = { type: 'answer'; value: any }
// upload an image
export type FromWebview_Image = { type: 'image'; base64: string; imageID: ImageID }
// reset the workspace
export type FromWebview_reset = { type: 'reset' }
// re-build the action form and check if action is valid in current flow context
// export type FomrWebview_ProbeAction = { type: 'probe-action'; flowID: FlowID; actionID: ActionDefinitionID }

// export type MessageFromWebviewToExtension =
//     | FromWebview_runAction // run
//     | FromWebview_openExternal
//     | FromWebview_Answer // user interractions
//     | FromWebview_Image
//     | FromWebview_reset
// | FomrWebview_ProbeAction

// =============================================================================================
// | BACK => FRONT                                                                             |
// =============================================================================================
// export type MessageFromExtensionToWebview = { uid: PayloadID } & MessageFromExtensionToWebview_

export type FromExtension_CushyStatus = { type: 'cushy_status'; connected: boolean }

// // non flow-related ------------------------------------------------------
// export type FromExtension_Schema = { type: 'schema'; schema: ComfySchemaJSON; embeddings: EmbeddingName[] }
// // export type FromExtension_SyncHistory = { type: 'sync-history'; history: CushyDBData }
// export type FromExtension_Ls = { type: 'ls'; actions: ToolT[] }

// // actions payloads ------------------------------------------------------
// export type FromExtension_ActionStart = {
//     type: 'action-start'
//     flowID: FlowID
//     actionID: ToolID
//     executionID: StepID
//     data: FormResult<any>
// }
// export type FromExtension_ActionCode = {
//     type: 'action-code'
//     flowID: FlowID
//     actionID: ToolID
//     executionID: StepID
//     code: string
// }
// export type ActionEndStatus = 'success' | 'failure'
// export type FromExtension_ActionEnd = {
//     type: 'action-end'
//     flowID: FlowID
//     actionID: ToolID
//     executionID: StepID
//     status: ActionEndStatus
// }

export type FromExtension_Print = { type: 'print'; message: string }
export type FromExtension_Prompt = { type: 'prompt'; promptID: PromptID }
export type FromExtension_Images = { type: 'images'; flowID?: Maybe<FlowID>; images: ImageT[] }
export type FromExtension_ShowHtml = { type: 'show-html'; flowID?: FlowID; content: string; title: string }
export type FromExtension_ask = { type: 'ask'; flowID: FlowID; form: Requestable; result: FormResult<any> }
export type FromExtension_RuntimeError = {
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

export type MessageFromExtensionToWebview_ =
    /** wether or not cushy server is connected to at least on ComfyUI server */
    // | FromExtension_CushyStatus
    // | FromExtension_SyncHistory
    // flow start stop
    // | FromExtension_ActionStart
    // | FromExtension_ActionCode
    // | FromExtension_ActionEnd
    // user interractions
    | FromExtension_ask
    | FromExtension_Print
    // schema & prompt (needs to be sent so webview can draw the graph)
    // | FromExtension_Schema
    | FromExtension_Prompt
    // | FromExtension_Ls
    // websocket updates
    | WsMsgStatus /* type 'status' */
    | WsMsgProgress /* type 'progress' */
    | WsMsgExecuting /* type 'executing'*/
    | WsMsgExecutionCached /* cached node running */
    | WsMsgExecuted /* type 'executed' */
    // generated images as transformed uri by vscode extension so they can be displayed in the webview
    | FromExtension_Images
    | FromExtension_ShowHtml
