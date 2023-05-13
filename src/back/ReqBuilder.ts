import type { ReqBuilder } from 'src/core/Requirement'
import type { Workflow } from './Workflow'

export interface RequirementBuilder extends ReqBuilder {}
export class RequirementBuilder {
    constructor(public workflow: Workflow) {}
}
