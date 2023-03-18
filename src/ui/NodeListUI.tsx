import { observer } from 'mobx-react-lite'
import { comfyColors } from '../core/ComfyColors'
import { ComfyGraph } from '../core/ComfyGraph'
import { ComfyNode } from '../core/ComfyNode'
import { ComfyNodeSchema } from '../core/ComfySchema'
import { NodeRefUI } from './NodeRefUI'
import { useSt } from './stContext'

export const NodeListUI = observer(function NodeListUI_(p: {}) {
    const st = useSt()
    const project = st.project
    const graph: ComfyGraph | undefined = project.currentRun?.graph
    if (graph == null) return <>no execution yet</>
    const nodes = graph.nodesArray
    return (
        <div className='col gap'>
            <div>Prompt {project.focus + 1}</div>
            {nodes.map((node) => (
                <ComfyNodeUI key={node.uid} node={node} />
            ))}
        </div>
    )
})

export const ComfyNodeUI = observer(function ComfyNodeUI_(p: { node: ComfyNode<any> }) {
    const st = useSt()
    const project = st.project
    const node = p.node
    const uid = node.uid
    const graph: ComfyGraph | undefined = project.currentRun?.graph
    if (graph == null) return <>no execution yet</>

    const curr: ComfyNode<any> = graph.nodes.get(uid)!
    const name = curr.$schema.name
    const schema: ComfyNodeSchema = curr.$schema
    const color = comfyColors[schema.category]
    return (
        <div key={uid} className='node'>
            <div className='row gap darker' style={{ backgroundColor: color, padding: '0.5rem' }}>
                <NodeRefUI nodeUID={uid} />
                <div>{name}</div>
            </div>
            <div>
                {schema.inputs.map((input) => {
                    let val = node.json.inputs[input.name]
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
                {curr.artifactsForStep(project.focus).map((url) => (
                    <div key={url}>
                        <img style={{ width: '5rem', height: '5rem' }} key={url} src={url} />
                    </div>
                ))}
                {/* {curr?.allArtifactsImgs.map((url) => (
                    <div key={url}>
                        <img style={{ width: '5rem', height: '5rem' }} key={url} src={url} />
                    </div>
                ))} */}
            </div>
        </div>
    )
})
