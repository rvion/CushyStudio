import type { Workspace } from '../core-back/Workspace'
import { asRelativePath } from '../utils/fs/pathUtils'
import { getYYYYMMDDHHMMSS } from '../utils/timestamps'

export class Template {
    constructor(public name: string, public code: string) {}

    createProjectCopy(workspace: Workspace) {
        const projectName = `${this.name}_${getYYYYMMDDHHMMSS()}.ts`
        const relPath = asRelativePath(projectName)
        const workspaceRelativePath = workspace.resolve(relPath)
        workspace.createProjectAndFocustIt(workspaceRelativePath, this.code)
    }
}
