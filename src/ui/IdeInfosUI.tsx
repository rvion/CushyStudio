import { observer } from 'mobx-react-lite'
import { useSt } from './stContext'
import { LabelUI } from './LabelUI'

export const IdeInfosUI = observer(function IdeInfosUI_(p: {}) {
    const st = useSt()
    return (
        <div className='col gap'>
            <button>Open project</button>
            <LabelUI title='server IP'>
                <input type='text' value={st.serverIP} />
            </LabelUI>
            <LabelUI title='port'>
                <input type='number' value={st.serverPort} />
            </LabelUI>
        </div>
    )
})
