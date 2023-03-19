// import type { ScriptStep_Output } from './ScriptStep_Output'
import type { ScriptStep_prompt } from './ScriptStep_prompt'
import type { ScriptStep_Init } from './ScriptStep_Init'
import type { ScriptStep_askBoolean, ScriptStep_askString } from './ScriptStep_ask'

// prettier-ignore
export type ScriptStep =
    | ScriptStep_Init
    | ScriptStep_prompt
    | ScriptStep_askBoolean
    | ScriptStep_askString
// | ScriptStep_Output
