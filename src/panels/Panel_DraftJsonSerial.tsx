import { observer } from 'mobx-react-lite'
import { useSt } from 'src/state/stateContext'
import { JsonViewUI } from 'src/widgets/workspace/JsonViewUI'

export const Panel_DraftJsonSerial = observer(function Panel_DraftJsonSerial_(p: { draftID: DraftID }) {
    const st = useSt()
    const draft = typeof p.draftID === 'string' ? st.db.drafts.get(p.draftID) : p.draftID
    if (draft == null) return null
    return (
        <div>
            <JsonViewUI value={draft.data.formSerial} />
        </div>
    )
})
