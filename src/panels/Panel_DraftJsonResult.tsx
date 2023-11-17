import { observer } from 'mobx-react-lite'
import { DraftID } from 'src/models/Draft'
import { useSt } from 'src/state/stateContext'
import { JsonViewUI } from 'src/widgets/workspace/JsonViewUI'

export const Panel_DraftJsonResult = observer(function Panel_DraftJsonResult_(p: { draftID: DraftID }) {
    const st = useSt()
    const draft = typeof p.draftID === 'string' ? st.db.drafts.get(p.draftID) : p.draftID
    if (draft == null) return null
    return <JsonViewUI value={draft.form.value?.result} />
})
