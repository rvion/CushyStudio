import * as I from '@fluentui/react-icons'
import { exhaust } from '../core/ComfyUtils'
import { ScriptStep } from '../core/ScriptStep'
import { ScriptStep_askBoolean, ScriptStep_askString } from '../controls/ScriptStep_ask'
import { ScriptStep_Init } from '../controls/ScriptStep_Init'
import { ScriptStep_prompt } from '../controls/ScriptStep_prompt'

export const ControlIconUI = (step: ScriptStep) => {
    if (step instanceof ScriptStep_Init) return <I.BookQuestionMark24Filled />
    if (step instanceof ScriptStep_prompt) return <I.CubeTree24Filled />
    if (step instanceof ScriptStep_askBoolean) return <I.BookQuestionMark24Filled />
    if (step instanceof ScriptStep_askString) return <I.BookQuestionMark24Filled />

    return exhaust(step)
}
