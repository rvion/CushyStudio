import type { ActionDefinitionID, ActionRunID } from 'src/back/ActionDefinition'
import type { Requestable } from 'src/controls/Requestable'
import type { ImageInfos, ImageUID } from 'src/core/GeneratedImageSummary'
import type { ActionRef } from 'src/core/KnownWorkflow'
import type { EmbeddingName } from 'src/core/Schema'
import type { CushyDBData } from 'src/core/WorkspaceHistoryJSON'
import type { FlowID } from 'src/front/FrontFlow'
import type { PayloadID } from '../core/PayloadID'
import type { ComfyPromptJSON } from './ComfyPrompt'
import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { WsMsgCached, WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus } from './ComfyWsApi'

import { exhaust } from '../utils/ComfyUtils'

// =============================================================================================
// | FRONT => BACK                                                                             |
// =============================================================================================
// sent when the webpage is loaded
export type FromWebview_SayReady = { type: 'say-ready'; frontID: string }
// request to run a flow
export type FromWebview_runAction = { type: 'run-action'; flowID: FlowID; actionID: ActionDefinitionID }
// request to open an external URL
export type FromWebview_openExternal = { type: 'open-external'; uriString: string }
// answer a data request in the middle of a flow
export type FromWebview_Answer = { type: 'answer'; value: any }
// upload an image
export type FromWebview_Image = { type: 'image'; base64: string; imageID: ImageUID }
// reset the workspace
export type FromWebview_reset = { type: 'reset' }

export type MessageFromWebviewToExtension =
    | FromWebview_SayReady // report ready
    | FromWebview_runAction // run
    | FromWebview_openExternal
    | FromWebview_Answer // user interractions
    | FromWebview_Image
    | FromWebview_reset

// =============================================================================================
// | BACK => FRONT                                                                             |
// =============================================================================================
export type MessageFromExtensionToWebview = { uid: PayloadID } & MessageFromExtensionToWebview_

export type FromExtension_CushyStatus = { type: 'cushy_status'; connected: boolean }

export type FromExtension_ActionStart = { type: 'action-start'; flowRunID: ActionRunID }
export type FromExtension_ActionCode = { type: 'action-code'; flowRunID: ActionRunID; code: string }
export type FromExtension_ActionEnd = {
    type: 'action-end'
    status: 'success' | 'failure'
    flowID: FlowID
    actionID: ActionDefinitionID
    executionID: ActionRunID
}

export type FromExtension_Print = { type: 'print'; message: string }
export type FromExtension_Schema = { type: 'schema'; schema: ComfySchemaJSON; embeddings: EmbeddingName[] }
export type FromExtension_Prompt = { type: 'prompt'; graph: ComfyPromptJSON }
export type FromExtension_Ls = { type: 'ls'; actions: ActionRef[] }
export type FromExtension_Images = { type: 'images'; images: ImageInfos[] }
export type FromExtension_ShowHtml = { type: 'show-html'; content: string; title: string }
export type FromExtension_ask = { type: 'ask'; request: { [key: string]: Requestable } }
export type FromExtension_SyncHistory = { type: 'sync-history'; history: CushyDBData }

export type MessageFromExtensionToWebview_ =
    /** wether or not cushy server is connected to at least on ComfyUI server */
    | FromExtension_CushyStatus
    | FromExtension_SyncHistory
    // flow start stop
    | FromExtension_ActionStart
    | FromExtension_ActionCode
    | FromExtension_ActionEnd
    // user interractions
    | FromExtension_ask
    | FromExtension_Print
    // schema & prompt (needs to be sent so webview can draw the graph)
    | FromExtension_Schema
    | FromExtension_Prompt
    | FromExtension_Ls
    // websocket updates
    | WsMsgStatus /* type 'status' */
    | WsMsgProgress /* type 'progress' */
    | WsMsgExecuting /* type 'executing'*/
    | WsMsgCached /* cached node running */
    | WsMsgExecuted /* type 'executed' */
    // generated images as transformed uri by vscode extension so they can be displayed in the webview
    | FromExtension_Images
    | FromExtension_ShowHtml

export const renderMessageFromExtensionAsEmoji = (msg: MessageFromExtensionToWebview) => {
    if (msg.type === 'cushy_status') return 'ℹ️'
    if (msg.type === 'action-start') return '🎬'
    if (msg.type === 'action-code') return '📝'
    if (msg.type === 'action-end') return '🏁'
    if (msg.type === 'schema') return '📄'
    if (msg.type === 'prompt') return '📝'
    if (msg.type === 'status') return '📡'
    if (msg.type === 'progress') return '📊'
    if (msg.type === 'executing') return '📈'
    if (msg.type === 'execution_cached') return '💾'
    if (msg.type === 'executed') return '✅'
    if (msg.type === 'images') return '🖼️'
    if (msg.type === 'print') return '💬'
    if (msg.type === 'show-html') return '🥶'
    if (msg.type === 'ask') return '👋'
    if (msg.type === 'ls') return '📂'
    if (msg.type === 'sync-history') return '⏱️'
    exhaust(msg)
    return '❓'
}
