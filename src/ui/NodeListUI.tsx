import { observer } from 'mobx-react-lite'
import { comfyColors } from '../core/ComfyColors'
import { ComfyGraph } from '../core/ComfyGraph'
import { ComfyNode } from '../core/ComfyNode'
import { ComfyNodeSchema } from '../core/ComfySchema'
import { NodeRefUI } from './NodeRefUI'
import { useSt } from './stContext'
import * as I from '@fluentui/react-icons'
import { Fragment, useState } from 'react'
import { Link } from '@fluentui/react-components'

export const NodeListUI = observer(function NodeListUI_(p: { graph: ComfyGraph }) {
    const graph = p.graph
    if (graph == null) return <>no execution yet</>
    const nodes = graph.nodesArray
    return (
        <div>
            <Link>Download Prompt</Link>
            <div className='row gap'>
                <div className='col '>
                    {nodes.map((node) => (
                        <ComfyNodeUI key={node.uid} node={node} />
                    ))}
                </div>
                <div className='col'>
                    {graph.allArtifactsImgs.map((url) => (
                        <img key={url} style={{ width: '5rem', height: '5rem' }} src={url} />
                    ))}
                </div>
            </div>
        </div>
    )
})

export const ComfyNodeUI = observer(function ComfyNodeUI_(p: { node: ComfyNode<any>; showArtifacts?: boolean }) {
    const node = p.node
    const uid = node.uid
    const graph: ComfyGraph | undefined = node.graph
    if (graph == null) return <>no execution yet</>

    const curr: ComfyNode<any> = graph.nodes.get(uid)!
    const name = curr.$schema.name
    const schema: ComfyNodeSchema = curr.$schema
    const color = comfyColors[schema.category]
    const [folded, setFolded] = useState(false)
    return (
        <div key={uid} className='node'>
            {node.progress || node.status === 'done' ? (
                <div
                    style={{
                        background: '#339433',
                        height: '0.4rem',
                        width:
                            node.status === 'done' //
                                ? '100%'
                                : `${(node.progress!.value / (node.progress!.max || 1)) * 100}%`,
                    }}
                >
                    {/* {node.progress.value}/{node.progress.max} */}
                </div>
            ) : null}
            <div
                onClick={() => setFolded(!folded)}
                className='row gap darker pointer'
                style={{ backgroundColor: color, padding: '0.2rem' }}
            >
                <NodeRefUI nodeUID={uid} />
                <div>{name}</div>
                <div className='grow'></div>
                {node.statusEmoji}
                {folded ? <I.ChevronDown24Filled /> : <I.ChevronRight24Filled />}
            </div>
            {folded && (
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
            )}
            {p.showArtifacts ? (
                <div className='row wrap'>
                    {curr.allArtifactsImgs.map((url) => (
                        <img key={url} style={{ width: '5rem', height: '5rem' }} src={url} />
                    ))}
                    {/* {curr?.allArtifactsImgs.map((url) => (
                    <div key={url}>
                        <img style={{ width: '5rem', height: '5rem' }} key={url} src={url} />
                    </div>
                ))} */}
                </div>
            ) : null}
        </div>
    )
})
