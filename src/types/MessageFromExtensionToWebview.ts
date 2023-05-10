import type { WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus } from './ComfyWsPayloads'
import type { PayloadID } from '../core/PayloadID'
import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { ComfyPromptJSON } from './ComfyPrompt'
import type { EmbeddingName } from 'src/core/Schema'
import type { ImageInfos } from 'src/core/GeneratedImageSummary'
import type { Requestable } from 'src/controls/Requestable'
import type { AbsolutePath } from 'src/utils/fs/BrandedPaths'
import type { FlowDefinitionID, FlowRunID } from 'src/back/FlowDefinition'

import { exhaust } from '../utils/ComfyUtils'

// =============================================================================================
// | Webview => Extension                                                                      |
// =============================================================================================
export type FromWebview_SayReady = { type: 'say-ready'; frontID: string }
export type FromWebview_runFlow = { type: 'run-flow'; flowID: FlowDefinitionID; img?: AbsolutePath }
export type FromWebview_openExternal = { type: 'open-external'; uriString: string }
export type FromWebview_sayHello = { type: 'say-hello'; message: string }
export type FromWebview_Answer = { type: 'answer'; value: any }
export type MessageFromWebviewToExtension =
    | FromWebview_SayReady // report ready
    | FromWebview_runFlow // run
    | FromWebview_openExternal
    | FromWebview_sayHello // test messages
    | FromWebview_Answer // user interractions

// =============================================================================================
// | Extension => Webview                                                                      |
// =============================================================================================
export type MessageFromExtensionToWebview = { uid: PayloadID } & MessageFromExtensionToWebview_

export type FromExtension_CushyStatus = { type: 'cushy_status'; connected: boolean }
export type FromExtension_FlowStart = { type: 'flow-start'; flowRunID: FlowRunID }
export type FromExtension_FlowCode = { type: 'flow-code'; flowRunID: FlowRunID; code: string }
export type FromExtension_FlowEnd = {
    type: 'flow-end'
    flowRunID: FlowRunID
    status: 'success' | 'failure'
    flowID: FlowDefinitionID
}
export type FromExtension_Print = { type: 'print'; message: string }
export type FromExtension_Schema = { type: 'schema'; schema: ComfySchemaJSON; embeddings: EmbeddingName[] }
export type FromExtension_Prompt = { type: 'prompt'; graph: ComfyPromptJSON }
export type FromExtension_Ls = { type: 'ls'; knownFlows: { name: string; id: FlowDefinitionID }[] }
export type FromExtension_Images = { type: 'images'; images: ImageInfos[] }
export type FromExtension_ShowHtml = { type: 'show-html'; content: string; title: string }
export type FromExtension_ask = { type: 'ask'; request: { [key: string]: Requestable } }

export type MessageFromExtensionToWebview_ =
    /** wether or not cushy server is connected to at least on ComfyUI server */
    | FromExtension_CushyStatus
    // flow start stop
    | FromExtension_FlowStart
    | FromExtension_FlowCode
    | FromExtension_FlowEnd
    // user interractions
    | FromExtension_ask
    | FromExtension_Print
    // schema & prompt (needs to be sent so webview can draw the graph)
    | FromExtension_Schema
    | FromExtension_Prompt
    | FromExtension_Ls
    // websocket updates
    | WsMsgStatus /* type 'status'   */
    | WsMsgProgress /* type 'progress' */
    | WsMsgExecuting /* type 'executing'*/
    | WsMsgExecuted /* type 'executed' */
    // generated images as transformed uri by vscode extension so they can be displayed in the webview
    | FromExtension_Images
    | FromExtension_ShowHtml

export const renderMessageFromExtensionAsEmoji = (msg: MessageFromExtensionToWebview) => {
    if (msg.type === 'cushy_status') return 'ℹ️'
    if (msg.type === 'flow-start') return '🎬'
    if (msg.type === 'flow-code') return '📝'
    if (msg.type === 'flow-end') return '🏁'
    if (msg.type === 'schema') return '📄'
    if (msg.type === 'prompt') return '📝'
    if (msg.type === 'status') return '📡'
    if (msg.type === 'progress') return '📊'
    if (msg.type === 'executing') return '📈'
    if (msg.type === 'executed') return '✅'
    if (msg.type === 'images') return '🖼️'
    if (msg.type === 'print') return '💬'
    if (msg.type === 'show-html') return '🥶'
    if (msg.type === 'ask') return '👋'
    if (msg.type === 'ls') return '📂'
    exhaust(msg)
    return '❓'
}
