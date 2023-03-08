import { ComfyNodeJSON, ComfyProjectJSON } from '../core/ComfyNodeJSON'
import { useSt } from './EditorState'
import { Comfy, schemas } from '../core/Comfy'
import { observer } from 'mobx-react-lite'
import { comfyColors } from '../core/ComfyColors'
import { ComfyNodeUID } from '../core/ComfyNodeUID'
import { ComfyNodeSchema } from '../core/ComfyNodeSchema'
import { NodeRefUI } from './NodeRefUI'

export const NodeListUI = observer(function NodeListUI_(p: {}) {
    const st = useSt()
    const project: Comfy | null = st.project
    if (project == null) return null
    const VERSIONS: ComfyProjectJSON[] = project.VERSIONS
    const NODES: [uid: ComfyNodeUID, json: ComfyNodeJSON][] =
        st.focus in VERSIONS //
            ? Object.entries(VERSIONS[st.focus])
            : []
    return (
        <div className='col gap px'>
            {NODES.map(([uid, node]) => (
                <NodeUI key={uid} uid={uid} node={node} />
            ))}
        </div>
    )
})

export const NodeUI = observer(function NodeUI_(p: {
    //
    uid: ComfyNodeUID
    node: ComfyNodeJSON
}) {
    const { uid, node } = p
    const curr = useSt().project.nodes.get(uid)!
    const name = curr.$schema.type
    const schema: ComfyNodeSchema = curr.$schema
    const color = comfyColors[schema.category]
    // const curr = project?.nodes.get(uid)
    return (
        <div key={uid} className='node'>
            <div className='row gap darker' style={{ backgroundColor: color, padding: '0.5rem' }}>
                <NodeRefUI nodeUID={uid} />
                <div>{name}</div>
            </div>
            <div>
                {schema.input.map((input) => {
                    let val = node.inputs[input.name]
                    if (Array.isArray(val)) val = <NodeRefUI nodeUID={val[0]} />
                    return (
                        <div key={input.name} className='prop row'>
                            <div className='propName'>{input.name}</div>
                            <div className='propValue'>{val}</div>
                        </div>
                    )
                })}
            </div>
            <div className='row wrap'>
                {curr?.allArtifactsImgs.map((url) => (
                    <div key={url}>
                        <img style={{ width: '5rem', height: '5rem' }} key={url} src={url} />
                    </div>
                ))}
            </div>
        </div>
    )
})
