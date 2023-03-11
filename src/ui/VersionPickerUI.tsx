import { ComfyPromptJSON } from '../core/ComfyPrompt'
import { useSt } from './stContext'
import { observer } from 'mobx-react-lite'
import { ComfyProject } from '../core/ComfyProject'
import { ComfyGraph } from '../core/ComfyGraph'

export const VersionPickerUI = observer(function VersionPickerUI_() {
    const st = useSt()
    const project: ComfyProject = st.project
    const VERSIONS: ComfyGraph[] = project.graphs
    if (VERSIONS.length === 0) return null
    return (
        <div className='row gap content-center' style={{ padding: '10px', margin: 'auto' }}>
            Version
            <div className='row'>
                <input
                    min={0}
                    max={VERSIONS.length - 1}
                    type='number'
                    value={project.focus}
                    onChange={(ev) => (project.focus = parseInt(ev.target.value, 10))}
                />{' '}
                / {VERSIONS.length}
            </div>
        </div>
    )
})
