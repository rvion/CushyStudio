import type { PromptExecution } from '../controls/ScriptStep_prompt'
import type { ScriptStep_Init } from '../controls/ScriptStep_Init'
import type { ScriptStep_ask, ScriptStep_askBoolean, ScriptStep_askPaint, ScriptStep_askString } from '../controls/ScriptStep_ask'

// prettier-ignore
export type FlowExecutionStep =
    | ScriptStep_Init
    | PromptExecution
    | ScriptStep_askBoolean
    | ScriptStep_askString
    | ScriptStep_askPaint
    | ScriptStep_ask<any>

// | ScriptStep_Output
