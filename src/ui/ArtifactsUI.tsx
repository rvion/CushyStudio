import { observer } from 'mobx-react-lite'
import { ComfyImageInfo } from '../core/ComfyAPI'
import { CushyImage } from '../core/CushyImage'
import { useSt } from './stContext'

export const ArtifactsUI = observer(function ArtifactsUI_() {
    const st = useSt()
    return (
        <div>
            <h3>Project {st.project.name}</h3>
            {st.project.runs.map((run, ix) => {
                return (
                    <div key={run.uid}>
                        <h3>Run {ix + 1} </h3>
                        {run.gallery.map((img) => {
                            return (
                                <img //
                                    style={{ width: '5rem', height: '5rem' }}
                                    key={img.uid}
                                    src={img.url}
                                />
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
})
