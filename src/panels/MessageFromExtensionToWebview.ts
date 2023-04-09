import type { Maybe } from '../core/ComfyUtils'

// prettier-ignore
export type MessageFromExtensionToWebview =
    | { type: 'ask-string'; message: string; default?: Maybe<string>; }
    | { type: 'ask-boolean'; message: string; default?: Maybe<boolean>; }
