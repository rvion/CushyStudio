import { ComfyProjectJSON } from '../core/ComfyNodeJSON'
import { useSt } from './EditorState'
import { observer } from 'mobx-react-lite'
import { Comfy } from '../core/Comfy'

export const VersionPickerUI = observer(function VersionPickerUI_() {
    const st = useSt()
    const project: Comfy | null = st.project
    const VERSIONS: ComfyProjectJSON[] = project?.VERSIONS ?? []
    if (VERSIONS.length === 0) return null
    return (
        <div className='row gap'>
            Version
            <div className='row'>
                <input
                    min={0}
                    max={VERSIONS.length - 1}
                    type='number'
                    value={st.focus}
                    onChange={(ev) => (st.focus = parseInt(ev.target.value, 10))}
                />{' '}
                / {VERSIONS.length}
            </div>
        </div>
    )
})
