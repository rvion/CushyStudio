import { observer } from 'mobx-react-lite'
import { useWorkspace } from './WorkspaceContext'

export const ArtifactsUI = observer(function ArtifactsUI_() {
    const st = useWorkspace()
    const script = st.script
    if (script == null) return <>no script openeed</>

    return (
        <div>
            <h3>Project {script.folderName}</h3>
            {script.runs.map((run, ix) => {
                return (
                    <div key={run.uid}>
                        <h3>Run {ix + 1} </h3>
                        {run.gallery.map((img) => {
                            return (
                                <img //
                                    style={{ width: '5rem', height: '5rem' }}
                                    key={img.uid}
                                    src={img.comfyURL}
                                />
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
})
