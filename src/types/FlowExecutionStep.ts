import type { ScriptStep_Init } from '../controls/ScriptStep_Init'
import type { ScriptStep_ask } from '../controls/ScriptStep_ask'
import type { PromptExecution } from '../controls/ScriptStep_prompt'

// prettier-ignore
export type FlowExecutionStep =
    | ScriptStep_Init
    | PromptExecution
    | ScriptStep_ask<any>
