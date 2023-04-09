import type { WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus } from '../core-types/ComfyWsPayloads'
import type { ComfyPromptJSON } from '../core/ComfyPrompt'
import type { ComfySchemaJSON } from '../core-types/ComfySchemaJSON'
import type { Maybe } from '../core/ComfyUtils'

// prettier-ignore
export type MessageFromExtensionToWebview =
    // user interractions
    | { type: 'ask-string'; message: string; default?: Maybe<string>; }
    | { type: 'ask-boolean'; message: string; default?: Maybe<boolean>; }

    // schema & prompt (needs to be sent so webview can draw the graph)
    | { type: 'schema'; schema: ComfySchemaJSON; }
    | { type: 'prompt'; graph: ComfyPromptJSON; }

    // websocket updates
    | /* type 'status'   */ WsMsgStatus
    | /* type 'progress' */ WsMsgProgress
    | /* type 'executing'*/ WsMsgExecuting
    | /* type 'executed' */ WsMsgExecuted

    // generated images as transformed uri by vscode extension so they can be displayed in the webview
    | { type: 'images'; uris: string[]; }
