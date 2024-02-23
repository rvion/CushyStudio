import { observer } from 'mobx-react-lite'

import { useSt } from '../../state/stateContext'

// import { NodeListUI } from './NodeListUI'

export const ExecutionUI = observer(function ExecutionUI_() {
    const st = useSt()
    return <>OK</>
    // const project = st.focusedProject
    // const run: Maybe<Run> = project?.currentRun

    // const ref = useRef<HTMLDivElement>(null)
    // useEffect(() => {
    //     const elem = ref.current
    //     if (elem == null) return
    //     if (run == null) return console.log('❌ run is null')
    //     if (!(elem instanceof HTMLElement)) return console.log('❌ elem is not an HTMLElement')
    //     console.log('🔥 mounting cyto', elem)

    //     run.cyto.mount(elem)
    // }, [run, ref.current])

    // if (run == null)
    //     return (
    //         <div style={{ justifyContent: 'center', height: '100%', display: 'flex', overflow: 'auto' }}>
    //             <div className='light'>No execution yet </div>
    //         </div>
    //     )
    // return (
    //     <div className='col gap' style={{ overflow: 'auto' }}>
    //         <h3>{run.name}</h3>
    //         <div className='row'>
    //             <Button onClick={() => run.cyto.animate()}>fix layout</Button>
    //             <div
    //                 ref={ref}
    //                 style={{
    //                     backgroundColor: '#fafafa',
    //                     width: '300px',
    //                     height: '100px',
    //                 }}
    //                 id='dynamicgraph'
    //             ></div>
    //         </div>
    //         {run.steps.map((step) => (
    //             <StepWrapperUI key={step.uid} step={step} />
    //         ))}
    //     </div>
    // )
})

// export const StepWrapperUI = observer(function StepWrapperUI_(p: { step: FlowExecutionStep }) {
//     // const props = useSpring({
//     //     from: { opacity: 0, transform: 'translate3d(0,-20px,0)' },
//     //     to: { opacity: 1, transform: `translate3d(0,0px,0)` },
//     // })

//     return <div className='row'>{renderStep(p.step)}</div>
// })

// const renderStep = (step: FlowExecutionStep) => {
//     if (step instanceof ScriptStep_Init) return <Fragment key={step.uid}>Init</Fragment>
//     // if (step instanceof ScriptStep_Output) return <Fragment key={step.uid}>Output</Fragment>
//     if (step instanceof PromptExecution)
//         return (
//             <Fragment key={step.uid}>
//                 {/* <CardHeader description={'Prompt'}></CardHeader> */}
//                 <NodeListUI graph={step._graph} />
//             </Fragment>
//         )
//     if (step instanceof ScriptStep_askBoolean) return <Execution_askBooleanUI key={step.uid} step={step} />
//     if (step instanceof ScriptStep_askString) return <Execution_askStringUI key={step.uid} step={step} />

//     return exhaust(step)
// }

// export const ExecutionWrapperUI = observer(function ExecutionWrapperUI_(p: { children: ReactNode }) {
//     return <Panel>{p.children}</Panel>
// })
