import { observer } from 'mobx-react-lite'
import { comfyColors } from '../core/ComfyColors'
import { ComfyGraph } from '../core/ComfyGraph'
import { ComfyNode } from '../core/ComfyNode'
import { ComfyNodeSchema } from '../core/ComfySchema'
import { NodeRefUI } from './NodeRefUI'
import { useSt } from './stContext'
import * as I from '@fluentui/react-icons'
import { useState } from 'react'
import { ScriptStep_Init } from '../core/ScriptStep_Init'
import { exhaust } from '../core/ComfyUtils'
import { ScriptStep_Output } from '../core/ScriptStep_Output'
import { ScriptStep_askBoolean, ScriptStep_askString } from '../core/ScriptStep_ask'
import { Button, Input, Label } from '@fluentui/react-components'
import { ScriptStep_prompt } from '../core/ScriptStep_prompt'

export const ExecutionUI = observer(function NodeListUI_(p: {}) {
    const st = useSt()
    const project = st.project
    const run = project.currentRun
    if (run == null) return <>no execution yet</>

    return (
        <div className='col gap'>
            {/* <h1>Run {}</h1> */}
            {run.steps.map((step) => {
                if (step instanceof ScriptStep_Init) return <div>Init</div>
                if (step instanceof ScriptStep_Output) return <div>Output</div>
                if (step instanceof ScriptStep_prompt) return <NodeListUI graph={step._graph} />
                if (step instanceof ScriptStep_askBoolean)
                    return (
                        <div>
                            <Button appearance='primary' icon={<I.CalendarMonthRegular />}>
                                Yes
                            </Button>
                            <Button appearance='primary' icon={<I.CalendarMonthRegular />}>
                                No
                            </Button>
                        </div>
                    )
                if (step instanceof ScriptStep_askString)
                    return (
                        <div>
                            <Label>test</Label>
                            <Input onChange={() => {}} />
                            <Button appearance='primary' icon={<I.CalendarMonthRegular />}>
                                No
                            </Button>
                        </div>
                    )

                return exhaust(step)
            })}
        </div>
    )
})

export const NodeListUI = observer(function NodeListUI_(p: { graph: ComfyGraph }) {
    const graph = p.graph
    if (graph == null) return <>no execution yet</>
    const nodes = graph.nodesArray
    return (
        <div className='col gap'>
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
    const [folded, setFolded] = useState(false)
    return (
        <div key={uid} className='node'>
            <div
                onClick={() => setFolded(!folded)}
                className='row gap darker pointer'
                style={{ backgroundColor: color, padding: '0.2rem' }}
            >
                <NodeRefUI nodeUID={uid} />
                <div>{name}</div>
                <div className='grow'></div>
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
