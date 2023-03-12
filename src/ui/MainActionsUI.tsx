import { useSt } from './stContext'
import { observer } from 'mobx-react-lite'

export const MainActionsUI = observer(function MainActionsUI_() {
    const client = useSt()
    const project = client.project
    const graph = project.currentGraph
    // console.log('🟢 graph', project, graph)
    return (
        <div className='col gap grow'>
            {/* <div>Step: {st.project.currentStep}</div> */}
            <button className='success' onClick={() => project.run()}>
                Eval
            </button>
            <button className='success' onClick={() => project.run('real')}>
                RUN
            </button>
            {graph.isRunning ? (
                <button className='success' onClick={() => (graph.isRunning = false)}>
                    Abort
                </button>
            ) : null}
            {/* <button onClick={() => st.udpateCode()}>Preview</button> */}
        </div>
    )
})
