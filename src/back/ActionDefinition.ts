import type { Branded, Maybe } from '../utils/types'
import type { CushyFile } from './CushyFile'
import type { ActionRef } from '../core/KnownWorkflow'

import { FormBuilder } from '../controls/askv2'
import { Action, ActionForm } from '../core/Requirement'

export type ActionDefinitionID = Branded<string, 'FlowDefinitionID'>
export const asFlowDefinitionID = (s: string): ActionDefinitionID => s as any

export type ExecutionID = Branded<string, 'ExecutionID'>
export const asExecutionID = (s: string): ExecutionID => s as any

/**
 * a thin wrapper around a single (work)flow somewhere in a .cushy.ts file
 * flow = the 'WORFLOW(...)' part of a file
 * */
export class ActionDefinition {
    static formBuilder = new FormBuilder()

    uid: ActionDefinitionID
    ref: ActionRef
    form: Maybe<ActionForm> = null

    constructor(
        public file: CushyFile,
        public name: string,
        public action: Action<any>, // public range: CodeRange,
    ) {
        // unique uid
        this.uid = asFlowDefinitionID(`${file.absPath}#${name}`)

        // cache the form for this action
        if (action.ui) this.form = action.ui(ActionDefinition.formBuilder)

        // cache the json representation of this action for quick transmission to front
        this.ref = {
            name: this.name,
            id: this.uid,
            form: this.form ?? {},
        }
    }

    toJSON() {
        return this.ref
    }
}

// | probe = (flow: Workflow): ActionForm => {
// |     if (this.action.ui == null) return {}
// |     return this.action.ui(ActionDefinition.formBuilder, flow)
// | }

// | get form(): ActionForm {
// |     const fn = new Function('action', this.getCodeJS())

//  | getCodeJS = async (): Promise<string> => {
//  |     const codeTS = this.file.CONTENT
//  |     const codeJS = await transpileCode(codeTS)
//  |     if (codeJS == null) logger().info('❌ no code to run')
//  |
//  |     // logger().info(`\`\`\`ts\n${codeJS}\n\`\`\``)
//  |     // logger().debug('🔥', codeJS + '...')
//  |     return codeJS
//  | }
