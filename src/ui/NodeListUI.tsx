import { Button, Image } from '@fluentui/react-components'
import * as I from '@fluentui/react-icons'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useState } from 'react'
import { comfyColors } from '../core/ComfyColors'
import { ComfyGraph } from '../core/ComfyGraph'
import { ComfyNode } from '../core/CSNode'
import { ComfyNodeSchema } from '../core/ComfySchema'
import { useLayout } from './layout/LayoutCtx'
import { NodeRefUI } from './NodeRefUI'

export const NodeListUI = observer(function NodeListUI_(p: { graph: ComfyGraph }) {
    const graph = p.graph
    if (graph == null) return <>no execution yet</>
    const uiSt = useLocalObservable(() => ({ seeAll: false }))
    const nodes = uiSt.seeAll ? graph.nodes : graph.nodes.filter((f) => f.isExecuting)
    const layout = useLayout()
    return (
        <div className='col gap'>
            <div className='row space-between'>
                <div className='col gap'>
                    {nodes.map((node) => (
                        <ComfyNodeUI key={node.uid} node={node} />
                    ))}
                </div>
                <div className='row gap'>
                    <Button onClick={() => (uiSt.seeAll = !uiSt.seeAll)} size='small' className='self-start'>
                        {uiSt.seeAll ? 'hide' : `+ ${graph.nodes.length} nodes`}
                    </Button>
                    <Button size='small' icon={<I.ArrowDownload16Filled />} />
                </div>
            </div>
            <div className='row wrap'>
                {graph.allImages.map((img) => (
                    <Image
                        // onClick={() => layout.addImagePopup(img.url)}
                        onClick={() => (layout.galleryFocus = img)}
                        alt='prompt output'
                        src={img.comfyURL}
                        key={img.uid}
                        height={100}
                        width={100}
                    />
                    // <img key={url} style={{ width: '5rem', height: '5rem' }} src={url} />
                ))}
            </div>
        </div>
    )
})

export const ComfyNodeUI = observer(function ComfyNodeUI_(p: {
    //
    node: ComfyNode<any>
    showArtifacts?: boolean
    folded?: boolean
}) {
    const node = p.node
    const uid = node.uid
    const graph: ComfyGraph | undefined = node.graph
    if (graph == null) return <>no execution yet</>

    const curr: ComfyNode<any> = graph.nodesIndex.get(uid)!
    const name = curr.$schema.name
    const schema: ComfyNodeSchema = curr.$schema
    const [folded, setFolded] = useState(p.folded ?? false)
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
                style={{ backgroundColor: node.color, padding: '0.2rem' }}
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
                    {curr.images.map((img) => (
                        <img //
                            key={img.uid}
                            style={{ width: '5rem', height: '5rem' }}
                            src={img.comfyURL}
                        />
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
