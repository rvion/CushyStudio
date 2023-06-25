import type { ToolID, ToolT } from 'src/models/Tool'
import type { ImageT, ImageID } from 'src/models/Image'
import type { FormDefinition, FormResult } from 'src/core/Requirement'
import type { EmbeddingName } from 'src/models/Schema'
// import type { CushyDBData } from 'src/core/storeSchema'
import type { FlowID } from 'src/front/FlowID'
import type { Maybe } from 'src/utils/types'
import type { PayloadID } from '../core/PayloadID'
import type { ComfyPromptJSON } from './ComfyPrompt'
import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { WsMsgExecutionCached, WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus, PromptID } from './ComfyWsApi'

import { exhaust } from '../utils/ComfyUtils'
import { StepID } from 'src/models/Step'

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
export type FromExtension_ask = { type: 'ask'; flowID: FlowID; form: FormDefinition; result: FormResult<any> }

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

// export const renderMessageFromExtensionAsEmoji = (msg: MessageFromExtensionToWebview) => {
//     if (msg.type === 'cushy_status') return 'ℹ️'
//     if (msg.type === 'action-start') return '🎬'
//     if (msg.type === 'action-code') return '📝'
//     if (msg.type === 'action-end') return '🏁'
//     if (msg.type === 'schema') return '📄'
//     if (msg.type === 'prompt') return '📝'
//     if (msg.type === 'status') return '📡'
//     if (msg.type === 'progress') return '📊'
//     if (msg.type === 'executing') return '📈'
//     if (msg.type === 'execution_cached') return '💾'
//     if (msg.type === 'executed') return '✅'
//     if (msg.type === 'images') return '🖼️'
//     if (msg.type === 'print') return '💬'
//     if (msg.type === 'show-html') return '🥶'
//     if (msg.type === 'ask') return '👋'
//     if (msg.type === 'ls') return '📂'
//     // if (msg.type === 'sync-history') return '⏱️'
//     exhaust(msg)
//     return '❓'
// }
