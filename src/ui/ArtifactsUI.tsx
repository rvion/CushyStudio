import { observer } from 'mobx-react-lite'
import { useSt } from './stContext'
import { NodeRefUI } from './NodeRefUI'

export const ArtifactsUI = observer(function ArtifactsUI_(p: {}) {
    const st = useSt()
    return (
        <div>
            <h3>Project {st.project.name}</h3>
            {st.project.runs.map((run, ix) => {
                return (
                    <div key={run.uid}>
                        <h3>Run {ix + 1} </h3>
                        {run.allOutputs.map((o, ix) => {
                            return (
                                <div key={ix}>
                                    {/* <h3>Prompt {ix + 1}</h3> */}
                                    <div className='row wrap'>
                                        {/* <NodeRefUI nodeUID={o.data.node} /> */}
                                        {o.images.map((url) => (
                                            <div key={url}>
                                                <img
                                                    style={{ width: '5rem', height: '5rem' }}
                                                    key={url}
                                                    src={`http://${st.serverHost}/view/${url}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
})
