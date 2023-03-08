import { observer } from 'mobx-react-lite'
import { useSt } from './EditorState'
import { MainActionsUI } from './MainActionsUI'

export const StepListUI = observer(function StepListUI_(p: {}) {
    const st = useSt()
    return (
        <div className='col gap px'>
            <div className='row gap items-baseline'>
                {/* <div>Steps</div> */}
                {/* <div className='grow'></div> */}
                <MainActionsUI />
            </div>
            <div className='row wrap gap'>
                {st.project.VERSIONS.map((v, ix) => (
                    <button
                        //
                        onClick={() => (st.focus = ix)}
                        className={st.focus === ix ? 'active' : undefined}
                    >
                        Prompt {ix + 1}
                    </button>
                ))}
            </div>
        </div>
    )
})
