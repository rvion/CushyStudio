import { observer } from 'mobx-react-lite'
import { Panel, Progress } from 'rsuite'
import { Graph } from '../core-shared/Graph'
import { ComfyNode } from '../core-shared/Node'
import { ComfyNodeSchema } from '../core-shared/Schema'
import { NodeRefUI } from './NodeRefUI'

export const ComfyNodeUI = observer(function ComfyNodeUI_(p: {
    //
    node: ComfyNode<any>
    showArtifacts?: boolean
}) {
    const node = p.node
    const uid = node.uid
    const graph: Graph | undefined = node.graph
    if (graph == null) return <>no execution yet</>

    const curr: ComfyNode<any> = graph.nodesIndex.get(uid)!
    const name = curr.$schema.nameInComfy
    const schema: ComfyNodeSchema = curr.$schema
    return (
        <Panel
            style={{ position: 'relative' }}
            bordered
            shaded
            key={uid}
            className='node'
            // style={{ width: 'fit-content', border: '1px solid lightgray' }}
        >
            {/* {node.progress || node.status === 'done' ? (
                <div
                    style={{
                        background: '#339433',
                        height: '0.4rem',
                        width:
                            node.status === 'done' //
                                ? '100%'
                                : `${(node.progress!.value / (node.progress!.max || 1)) * 100}%`,
                    }}
                ></div>
            ) : null} */}
            <div className='row'>
                <Progress.Line
                    vertical
                    className='p-0 m-0'
                    showInfo={false}
                    strokeWidth={4}
                    status={node.status === 'done' ? 'success' : 'active'}
                    percent={node.status === 'done' ? 100 : ((node.progress?.value ?? 0) / (node.progress?.max || 1)) * 100}
                    // showInfo={false}
                />
                {/* {folded ? null : ( */}
                <div>
                    <div className='row gap darker pointer' style={{ padding: '0.2rem' }}>
                        <h4 className='row items-center gap'>
                            <NodeRefUI nodeUID={uid} graph={graph} />
                            {name}
                        </h4>
                    </div>
                    {schema.inputs.map((input) => {
                        let val = node.json.inputs[input.name]
                        if (Array.isArray(val)) val = <NodeRefUI nodeUID={val[0]} graph={graph} />
                        return (
                            <div key={input.name} className='prop row'>
                                <div className='propName'>{input.name}</div>
                                <div className='propValue'>{val}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {/* )} */}
            {p.showArtifacts ? (
                <div className='row wrap'>
                    {/* {curr.images.map((img) => (
                        <img //
                            key={img.uid}
                            style={{ width: '5rem', height: '5rem' }}
                            src={img.comfyURL}
                        />
                    ))} */}
                    {/* {curr?.allArtifactsImgs.map((url) => (
                    <div key={url}>
                        <img style={{ width: '5rem', height: '5rem' }} key={url} src={url} />
                    </div>
                ))} */}
                </div>
            ) : null}
        </Panel>
    )
})
