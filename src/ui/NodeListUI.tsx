import { observer } from 'mobx-react-lite'
import { Form, Input, Panel, Progress } from 'rsuite'
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
    const percent = node.status === 'done' ? 100 : ((node.progress?.value ?? 0) / (node.progress?.max || 1)) * 100
    const isDone = node.status === 'done'
    return (
        <>
            <Panel
                // style={
                //     isDone
                //         ? {}
                //         : {
                //               borderImageSource: `linear-gradient(180deg, #184593 0%, #${percent} 100%, transparent 100%)`,
                //               borderImageSlice: '1',
                //               borderWidth: '5px',
                //               borderLeft: '5px solid #ddd',
                //               borderTop: 'none',
                //               borderRight: 'none',
                //               borderBottom: 'none',
                //           }
                // }
                header={
                    <h4 className='row items-center gap'>
                        <NodeRefUI nodeUID={uid} graph={graph} />
                        <Progress.Line
                            style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                            // vertical
                            showInfo={false}
                            strokeWidth={2}
                            // style={{ height: '3rem' }}
                            status={isDone ? 'success' : 'active'}
                            percent={percent}
                            // showInfo={false}
                        />
                        {name}
                    </h4>
                }
                collapsible
                // defaultExpanded
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
                    {/* {folded ? null : ( */}
                    <div>
                        {/* show all */}
                        {/* <div>
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
                    </div> */}
                        <div className='flex gap-2 wrap'>
                            {/* show values */}
                            <Form layout='horizontal'>
                                {schema.inputs.map((input) => {
                                    let val = node.json.inputs[input.name]
                                    if (Array.isArray(val)) return null
                                    return (
                                        <Form.Group key={input.name}>
                                            <Form.ControlLabel>{input.name}</Form.ControlLabel>
                                            <Form.Control name={input.name} value={val}></Form.Control>
                                        </Form.Group>
                                    )
                                })}
                            </Form>
                            {/* show refs */}
                            <div>
                                {schema.inputs.map((input) => {
                                    let val = node.json.inputs[input.name]
                                    if (!Array.isArray(val)) return null
                                    return (
                                        <div key={input.name} className='row gap-2'>
                                            <Form.ControlLabel>{<NodeRefUI nodeUID={val[0]} graph={graph} />}</Form.ControlLabel>
                                            <Form.ControlLabel>{input.name}</Form.ControlLabel>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
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
        </>
    )
})
