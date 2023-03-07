import { ComfyNodeJSON, ComfyProjectJSON } from '../core/ComfyNodeJSON'
import { useSt } from './EditorState'
import { Comfy, schemas } from '../core/Comfy'
import { observer } from 'mobx-react-lite'
import { comfyColors } from '../core/ComfyColors'
import { ComfyNodeUID } from '../core/ComfyNodeUID'
import { ComfyNodeSchema } from '../core/ComfyNodeSchema'

export const NodeListUI = observer(function NodeListUI_(p: {}) {
    const st = useSt()
    const project: Comfy | null = st.project
    const VERSIONS: ComfyProjectJSON[] = project?.VERSIONS ?? []
    const NODES: [uid: ComfyNodeUID, json: ComfyNodeJSON][] =
        st.focus in VERSIONS //
            ? Object.entries(VERSIONS[st.focus])
            : []
    return (
        <div>
            {NODES.map(([uid, node]) => {
                const name = node.class_type
                const schema: ComfyNodeSchema = schemas[name]
                const curr = project?.nodes.get(uid)
                return (
                    <div key={uid} className='node' style={{ backgroundColor: comfyColors[schema.category] }}>
                        <div>{name}</div>
                        <div>
                            {schema.input.map((input) => (
                                <div key={input.name} className='prop row'>
                                    <div className='propName'>{input.name}</div>
                                    <div className='propValue'>{node.inputs[input.name]}</div>
                                </div>
                            ))}
                        </div>
                        <div className='row wrap'>
                            {curr?.allArtifactsImgs.map((url) => (
                                <div key={url}>
                                    <img
                                        style={{
                                            width: '5rem',
                                            height: '5rem',
                                        }}
                                        key={url}
                                        src={url}
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
