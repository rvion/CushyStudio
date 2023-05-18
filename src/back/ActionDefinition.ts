import type { Branded, Maybe } from '../utils/types'
import type { CushyFile } from './CushyFile'
import type { ActionRef } from '../core/KnownWorkflow'

import { FormBuilder } from '../controls/askv2'
import { Action, FormDefinition } from '../core/Requirement'

export type ActionDefinitionID = Branded<string, 'FlowDefinitionID'>
export const asFlowDefinitionID = (s: string): ActionDefinitionID => s as any

export type ExecutionID = Branded<string, 'ExecutionID'>
export const asExecutionID = (s: string): ExecutionID => s as any

/**
 * a thin wrapper around a single action somewhere in a .cushy.ts file
 * */
export class ActionDefinition {
    static formBuilder = new FormBuilder()

    // uid: ActionDefinitionID
    // ref: ActionRef
    form: Maybe<FormDefinition> = null

    constructor(
        public file: CushyFile,
        public name: string,
        public action: Action<any>, // public range: CodeRange,
    ) {
        // unique uid

        // cache the form for this action
        if (action.ui) this.form = action.ui(ActionDefinition.formBuilder)

        // cache the json representation of this action for quick transmission to front
        // this.ref = {
        //     name: this.name,
        //     form: this.form ?? {},
        // }
    }

    // toJSON() {
    //     return this.ref
    // }
}
