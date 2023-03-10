import { observer } from 'mobx-react-lite'
import { useSt } from './stContext'
import { NodeRefUI } from './NodeRefUI'

export const ArtifactsUI = observer(function ArtifactsUI_(p: {}) {
    const st = useSt()
    return (
        <div className='row gap'>
            {st.project.outputs.map((o, ix) => {
                return (
                    <div key={ix}>
                        <h3>Prompt {ix + 1}</h3>
                        <div className='col wrap'>
                            <NodeRefUI nodeUID={o.data.node} />
                            {o.data.output.images.map((url) => (
                                <div key={url}>
                                    <img
                                        style={{ width: '5rem', height: '5rem' }}
                                        key={url}
                                        src={`http://${st.project.serverHost}/view/${url}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
})
