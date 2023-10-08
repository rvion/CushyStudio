/**
 * this module must not import anything from src/core-back
 * the LATER type is used to reference types that may or may not be available on users machines, depending
 * on the node suite they have setup
 */

// import { Workflow } from 'src/back/Workflow'
import type { LATER } from 'LATER'
// import type { WorkflowBuilder } from 'src/core/WorkflowFn'

export type SimplifiedLoraDef = {
    name: LATER<'Enum_LoraLoader_lora_name'>
    /** defaults to 1 */
    strength_clip?: number
    /** defaults to 1 */
    strength_model?: number
}
