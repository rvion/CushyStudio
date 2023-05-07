import type { WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus } from './ComfyWsPayloads'
import type { PayloadID } from '../core-shared/PayloadID'
import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { ComfyPromptJSON } from './ComfyPrompt'
import type { Maybe } from '../utils/types'
import type { EmbeddingName } from 'src/core-shared/Schema'
import type { GeneratedImageSummary } from 'src/core-back/GeneratedImage'

import { exhaust } from '../utils/ComfyUtils'
import { Requestable } from 'src/controls/askv2'

// =============================================================================================
// | Webview => Extension                                                                      |
// =============================================================================================
export type MessageFromWebviewToExtension =
    // report ready
    | { type: 'say-ready'; frontID: string }

    // run
    | { type: 'run-flow'; flowID: string }
    | { type: 'open-external'; uriString: string }

    // test messages
    | { type: 'say-hello'; message: string }

    // user interractions
    | { type: 'answer'; value: any }

// =============================================================================================
// | Extension => Webview                                                                      |
// =============================================================================================
export type MessageFromExtensionToWebview = { uid: PayloadID } & MessageFromExtensionToWebview_
export type MessageFromExtensionToWebview_ =
    // flow start stop
    | { type: 'flow-start'; flowRunID: string }
    | { type: 'flow-code'; flowRunID: string; code: string }
    | { type: 'flow-end'; flowRunID: string; status: 'success' | 'failure'; flowID: string }

    // user interractions
    | MessageFromExtensionToWebview_ask
    | { type: 'print'; message: string }

    // schema & prompt (needs to be sent so webview can draw the graph)
    | { type: 'schema'; schema: ComfySchemaJSON; embeddings: EmbeddingName[] }
    | { type: 'prompt'; graph: ComfyPromptJSON }
    | { type: 'ls'; workflowNames: { name: string; id: string }[] }

    // websocket updates
    | WsMsgStatus /* type 'status'   */
    | WsMsgProgress /* type 'progress' */
    | WsMsgExecuting /* type 'executing'*/
    | WsMsgExecuted /* type 'executed' */

    // generated images as transformed uri by vscode extension so they can be displayed in the webview
    | { type: 'images'; images: GeneratedImageSummary[] }
    | { type: 'show-html'; content: string }

export type MessageFromExtensionToWebview_ask = { type: 'ask'; request: { [key: string]: Requestable } }

export const renderMessageFromExtensionAsEmoji = (msg: MessageFromExtensionToWebview) => {
    if (msg.type === 'flow-start') return '🎬'
    if (msg.type === 'flow-code') return '📝'
    if (msg.type === 'flow-end') return '🏁'
    // if (msg.type === 'ask-string') return '🔤'
    // if (msg.type === 'ask-boolean') return '🔘'
    // if (msg.type === 'ask-paint') return '🎨'
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
