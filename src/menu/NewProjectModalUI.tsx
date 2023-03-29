import * as path from '@tauri-apps/api/path'

import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Input,
} from '@fluentui/react-components'
import { Field } from '@fluentui/react-components/unstable'
import * as I from '@fluentui/react-icons'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import type { Maybe } from '../core/ComfyUtils'
import type { Workspace } from '../core/Workspace'
import { useWorkspace } from '../ui/WorkspaceContext'

class ProjectCreationWizard {
    name = 'New project'
    constructor(public workspace: Workspace) {
        makeAutoObservable(this)
        this.checkNameAvailability()
    }
    setName(name: string) {
        this.name = name
        this.checkNameAvailability()
    }
    get pathCandidate(): string {
        return this.workspace.folder + path.sep + this.name
    }
    checkNameAvailability = () => {}
    pathAvailable: Maybe<boolean> = null
}

export const NewProjectModalUI = observer(function NewProjectModalUI_(p: { children: React.ReactElement }) {
    const workspace = useWorkspace()
    const wizard = useMemo(() => new ProjectCreationWizard(workspace), [])

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                {p.children}
                {/* <Button icon={<I.Add24Regular />}>Create project</Button> */}
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Create new project</DialogTitle>
                    <DialogContent>
                        <div>
                            <Field label='name'>
                                <Input autoFocus value={wizard.name} onChange={(ev) => (wizard.name = ev.target.value)} />
                            </Field>
                            Project will be created in <span className='highlighted'>{wizard.pathCandidate}</span>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance='secondary'>Cancel</Button>
                        </DialogTrigger>
                        <DialogTrigger disableButtonEnhancement>
                            <Button
                                onClick={() => {
                                    workspace.createProject(wizard.name)
                                }}
                                appearance='primary'
                            >
                                Create
                            </Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    )
})
