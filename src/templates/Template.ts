import type { Workspace } from '../core/Workspace'
import { getYYYYMMDDHHMMSS } from '../utils/timestamps'

export class Template {
    constructor(public name: string, public code: string) {}

    createProjectCopy(workspace: Workspace) {
        const projectName = `${this.name}_${getYYYYMMDDHHMMSS()}.ts`
        const workspaceRelativePath = workspace.resolveToRelativePath(projectName)
        workspace.createProjectAndFocustIt(workspaceRelativePath, this.code)
    }
}
