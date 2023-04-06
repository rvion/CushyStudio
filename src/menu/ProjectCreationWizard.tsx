// import { makeAutoObservable } from 'mobx'
// import type { Maybe } from '../core/ComfyUtils'
// import type { Workspace } from '../core/Workspace'

// export class ProjectCreationWizard {
//     name = 'New project'
//     open: boolean = true
//     handleOpen = () => (this.open = true)
//     handleClose = () => (this.open = false)
//     constructor(public workspace: Workspace) {
//         makeAutoObservable(this)
//         this.checkNameAvailability()
//     }
//     setName(name: string) {
//         this.name = name
//         this.checkNameAvailability()
//     }
//     get pathCandidate(): string {
//         return this.name.endsWith('.ts') //
//             ? this.name
//             : this.name + '.ts'
//     }

//     get workspaceRelativePath() {
//         return this.workspace.resolveToRelativePath(this.pathCandidate)
//     }
//     checkNameAvailability = () => {}
//     pathAvailable: Maybe<boolean> = null

//     create = () => {
//         this.workspace.createProjectAndFocustIt(this.workspaceRelativePath)
//     }
// }
