import { observer } from 'mobx-react-lite'

import { useSt } from '../state/stateContext'
import { JsonViewUI } from '../widgets/workspace/JsonViewUI'

export const Panel_DraftJsonResult = observer(function Panel_DraftJsonResult_(p: { draftID: DraftID }) {
    const st = useSt()
    const draft = typeof p.draftID === 'string' ? st.db.draft.get(p.draftID) : p.draftID
    if (draft == null) return <>🔴 draft with id "{p.draftID}" not found</>
    return <JsonViewUI value={draft.form?.value} />
})
