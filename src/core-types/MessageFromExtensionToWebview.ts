import type { WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus } from './ComfyWsPayloads'
import type { PayloadID } from '../core-shared/PayloadID'
import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { ComfyPromptJSON } from './ComfyPrompt'
import type { Maybe } from '../utils/types'

import { exhaust } from '../utils/ComfyUtils'

export type MessageFromExtensionToWebview = { uid: PayloadID } & MessageFromExtensionToWebview_
export type MessageFromExtensionToWebview_ =
    // user interractions
    | MessageFromExtensionToWebview_askString
    | MessageFromExtensionToWebview_askBoolean
    | MessageFromExtensionToWebview_askPaint
    | { type: 'print'; message: string }

    // schema & prompt (needs to be sent so webview can draw the graph)
    | { type: 'schema'; schema: ComfySchemaJSON }
    | { type: 'prompt'; graph: ComfyPromptJSON }

    // websocket updates
    | /* type 'status'   */ WsMsgStatus
    | /* type 'progress' */ WsMsgProgress
    | /* type 'executing'*/ WsMsgExecuting
    | /* type 'executed' */ WsMsgExecuted

    // generated images as transformed uri by vscode extension so they can be displayed in the webview
    | { type: 'images'; uris: string[] }
export type MessageFromExtensionToWebview_askString = { type: 'ask-string'; message: string; default?: Maybe<string> }
export type MessageFromExtensionToWebview_askBoolean = { type: 'ask-boolean'; message: string; default?: Maybe<boolean> }
export type MessageFromExtensionToWebview_askPaint = { type: 'ask-paint'; message: string; relPath: string }

// ------------------------------------------------------------------------------------------------------------

export const renderMessageFromExtensionAsEmoji = (msg: MessageFromExtensionToWebview) => {
    if (msg.type === 'ask-string') return '🔤'
    if (msg.type === 'ask-boolean') return '🔘'
    if (msg.type === 'ask-paint') return '🎨'
    if (msg.type === 'schema') return '📄'
    if (msg.type === 'prompt') return '📝'
    if (msg.type === 'status') return '📡'
    if (msg.type === 'progress') return '📊'
    if (msg.type === 'executing') return '📈'
    if (msg.type === 'executed') return '📉'
    if (msg.type === 'images') return '🖼️'
    if (msg.type === 'print') return '💬'
    exhaust(msg)
    return '❓'
}

export type MessageFromWebviewToExtension =
    // report ready
    | { type: 'say-ready' }

    // test messages
    | { type: 'say-hello'; message: string }

    // user interractions
    | { type: 'answer-string'; value: string }
    | { type: 'answer-boolean'; value: boolean }
    | { type: 'answer-paint'; value: string /** base64 encoded image */ }
