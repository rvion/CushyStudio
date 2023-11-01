import type { Widget } from 'src/controls/Widget'
import type { FormResult } from 'src/library/Card'
import type { FlowID } from 'src/front/FlowID'
import type { GraphID } from 'src/models/Graph'
import type { ImageT } from 'src/models/Image'
import type { PromptID, WsMsgExecuted, WsMsgExecuting, WsMsgExecutionCached, WsMsgProgress, WsMsgStatus } from './ComfyWsApi'

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

export type FromExtension_Print = { type: 'print'; message: string }
export type FromExtension_Prompt = { type: 'prompt'; promptID: PromptID }
export type FromExtension_Images = { type: 'images'; flowID?: Maybe<FlowID>; images: ImageT[] }
export type FromExtension_ShowHtml = { type: 'show-html'; flowID?: FlowID; content: string; title: string }
export type FromExtension_ask = { type: 'ask'; flowID: FlowID; form: Widget; result: FormResult<any> }
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
