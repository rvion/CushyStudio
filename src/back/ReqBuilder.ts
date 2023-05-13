import type { ReqBuilder, Requirement } from '../core/Requirement'
import type { Workflow } from './Workflow'

export interface RequirementBuilder extends ReqBuilder {}
export class RequirementBuilder {
    // can't make workflow public here, because it would clash
    // with the index type in the ReqBuilder interface
    constructor(workflow: Workflow) {
        const schema = workflow.workspace.schema
        const requirables = schema.requirables
        for (const r of requirables) {
            Object.defineProperty(this, r.name, {
                value: (p: any): Requirement => ({ type: r.name, ...p }),
            })
        }
    }
}
