import type { ReqBuilder, Requirement } from '../cards/Card'
import type { Runtime } from './Runtime'

export interface RequirementBuilder extends ReqBuilder {}
export class RequirementBuilder {
    // can't make workflow public here, because it would clash
    // with the index type in the ReqBuilder interface
    constructor(workflow: Runtime) {
        const schema = workflow.st.schema
        const requirables = schema.requirables
        for (const r of requirables) {
            Object.defineProperty(this, r.name, {
                value: (p: any): Requirement => ({ type: r.name, ...p }),
            })
        }
    }
}
