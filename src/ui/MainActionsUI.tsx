import { useSt } from './EditorState'
import { observer } from 'mobx-react-lite'

export const MainActionsUI = observer(function MainActionsUI_() {
    const st = useSt()
    return (
        <div className='row gap'>
            <button className='success' onClick={() => st.eval_real()}>
                Eval
            </button>
            <button onClick={() => st.eval_real()}>Preview</button>
        </div>
    )
})
