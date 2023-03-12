import { observer } from 'mobx-react-lite'
import { useSt } from './stContext'
import { TreeValue } from './LabelUI'
import { MainActionsUI } from './MainActionsUI'

export const ProjectInfosUI = observer(function ProjectInfosUI_(p: {}) {
    const client = useSt()
    const project = client.project
    return (
        <div className='col gap1'>
            <div className='row gap items-baseline'>
                <MainActionsUI />
            </div>
            <TreeValue title='Name'>
                <input //
                    type='text'
                    value={project.name}
                    onChange={(ev) => (project.name = ev.target.value)}
                />
            </TreeValue>
            <TreeValue onClick={() => client.editor.openCODE()} title='code'>
                ...
            </TreeValue>
            <TreeValue title='Prompts'>
                <div className='row wrap gap'>
                    {client.project.graphs.map((v, ix) => (
                        <button
                            key={ix}
                            onClick={() => (project.focus = ix)}
                            className={project.focus === ix ? 'active' : undefined}
                        >
                            {ix + 1}
                        </button>
                    ))}
                </div>
            </TreeValue>
        </div>
    )
})
