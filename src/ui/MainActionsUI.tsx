import { useSt } from './stContext'
import { observer } from 'mobx-react-lite'

export const MainActionsUI = observer(function MainActionsUI_() {
    const client = useSt()
    const project = client.script
    const run = project.currentRun
    return (
        <div className='col gap grow'>
            {/* <div>Step: {st.project.currentStep}</div> */}
            <button className='success' onClick={() => project.RUN()}>
                Eval
            </button>
            <button className='success' onClick={() => project.RUN('real')}>
                RUN
            </button>
            {run ? (
                <button
                    className='success'
                    onClick={() => {
                        console.log('🔴 TODO: implement prompt cancellation')
                    }}
                >
                    Abort
                </button>
            ) : null}
        </div>
    )
})
