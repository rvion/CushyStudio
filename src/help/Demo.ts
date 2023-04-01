import type { Workflow } from '../core/Workflow'
import type { Workspace } from '../core/Workspace'
import { getYYYYMMDDHHMMSS } from '../utils/timestamps'

export class Demo {
    constructor(
        //
        public workspace: Workspace,
        public name: string,
        public workflow: Workflow,
    ) {}

    createProjectCopy() {
        // console.log('0', this.workflow)
        // console.log('1', this.workflow.builder)
        // console.log('2', this.workflow.builder.toString)
        const code = this.workflow.builder.toString()
        // console.log({ code })
        const projectName = `${this.name}_${getYYYYMMDDHHMMSS()}.ts`
        const workspaceRelativePath = this.workspace.resolveToRelativePath(projectName)
        console.log('🚀 ~ file: Demo.ts:21 ~ Demo ~ createProjectCopy ~ workspaceRelativePath:', workspaceRelativePath)
        this.workspace.createProjectAndFocustIt(workspaceRelativePath, `export default WORKFLOW(${code})`)
        // const project
    }
}
