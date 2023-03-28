import { Button, Card } from '@fluentui/react-components'
import { animated, useSpring } from '@react-spring/web'
import { observer } from 'mobx-react-lite'
import { Fragment, ReactNode, useEffect, useRef } from 'react'
import { exhaust, Maybe } from '../core/ComfyUtils'
import { Run } from '../core/Run'
import { ScriptStep } from '../core/ScriptStep'
import { ScriptStep_askBoolean, ScriptStep_askString } from '../core/ScriptStep_ask'
import { ScriptStep_Init } from '../core/ScriptStep_Init'
import { ScriptStep_prompt } from '../core/ScriptStep_prompt'
import { Execution_askBooleanUI } from './Execution_askBooleanUI'
import { Execution_askStringUI } from './Execution_askStringUI'
import { NodeListUI } from './NodeListUI'
import { useWorkspace } from './WorkspaceContext'

export const ExecutionUI = observer(function ExecutionUI_() {
    const st = useWorkspace()
    const project = st.focusedProject
    const run: Maybe<Run> = project?.currentRun

    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const elem = ref.current
        if (elem == null) return
        if (run == null) return console.log('❌ run is null')
        if (!(elem instanceof HTMLElement)) return console.log('❌ elem is not an HTMLElement')
        console.log('🔥 mounting cyto', elem)

        run.cyto.mount(elem)
    }, [run, ref.current])

    if (run == null)
        return (
            <div style={{ justifyContent: 'center', height: '100%', display: 'flex', overflow: 'auto' }}>
                <div className='light'>No execution yet </div>
            </div>
        )
    return (
        <div className='col gap' style={{ overflow: 'auto' }}>
            <h3>{run.name}</h3>
            <div className='row'>
                <Button onClick={() => run.cyto.animate()}>fix layout</Button>
                <div
                    ref={ref}
                    style={{
                        backgroundColor: '#fafafa',
                        width: '300px',
                        height: '100px',
                    }}
                    id='dynamicgraph'
                ></div>
            </div>
            {run.steps.map((step) => (
                <StepWrapperUI key={step.uid} step={step} />
            ))}
        </div>
    )
})

export const StepWrapperUI = observer(function StepWrapperUI_(p: { step: ScriptStep }) {
    const props = useSpring({
        from: { opacity: 0, transform: 'translate3d(0,-20px,0)' },
        to: { opacity: 1, transform: `translate3d(0,0px,0)` },
    })

    return (
        <animated.div style={props}>
            <div className='row'>{renderStep(p.step)}</div>
        </animated.div>
    )
})

const renderStep = (step: ScriptStep) => {
    if (step instanceof ScriptStep_Init) return <Fragment key={step.uid}>Init</Fragment>
    // if (step instanceof ScriptStep_Output) return <Fragment key={step.uid}>Output</Fragment>
    if (step instanceof ScriptStep_prompt)
        return (
            <Fragment key={step.uid}>
                {/* <CardHeader description={'Prompt'}></CardHeader> */}
                <NodeListUI graph={step._graph} />
            </Fragment>
        )
    if (step instanceof ScriptStep_askBoolean) return <Execution_askBooleanUI key={step.uid} step={step} />
    if (step instanceof ScriptStep_askString) return <Execution_askStringUI key={step.uid} step={step} />

    return exhaust(step)
}

export const ExecutionWrapperUI = observer(function ExecutionWrapperUI_(p: { children: ReactNode }) {
    return <Card>{p.children}</Card>
})
