import type { ScriptStep_prompt } from '../controls/ScriptStep_prompt'
import type { ScriptStep_Init } from '../controls/ScriptStep_Init'
import type { ScriptStep_askBoolean, ScriptStep_askString } from '../controls/ScriptStep_ask'

// prettier-ignore
export type ScriptStep =
    | ScriptStep_Init
    | ScriptStep_prompt
    | ScriptStep_askBoolean
    | ScriptStep_askString
// | ScriptStep_Output
