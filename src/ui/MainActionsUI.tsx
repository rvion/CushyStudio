import { useSt } from './stContext'
import { observer } from 'mobx-react-lite'

export const MainActionsUI = observer(function MainActionsUI_() {
    const st = useSt()
    const project = st.project
    const script = project.script
    return (
        <div className='col gap grow'>
            {/* <div>Step: {st.project.currentStep}</div> */}
            <button className='success' onClick={() => project.run()}>
                Eval
            </button>
            {st.project.script.isRunning ? (
                <button className='success' onClick={() => (script.isRunning = false)}>
                    Abort
                </button>
            ) : null}
            {/* <button onClick={() => st.udpateCode()}>Preview</button> */}
        </div>
    )
})
