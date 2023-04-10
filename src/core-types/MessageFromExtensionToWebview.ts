import type { WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus } from './ComfyWsPayloads'
import type { ComfyPromptJSON } from './ComfyPrompt'
import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { Maybe } from '../utils/ComfyUtils'

export type MessageFromExtensionToWebview =
    // user interractions
    | { type: 'ask-string'; message: string; default?: Maybe<string> }
    | { type: 'ask-boolean'; message: string; default?: Maybe<boolean> }

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

export type MessageFromWebviewToExtension =
    // report ready
    | { type: 'say-ready' }

    // test messages
    | { type: 'say-hello'; message: string }

    // user interractions
    | { type: 'answer-string'; value: string }
    | { type: 'answer-boolean'; value: boolean }
