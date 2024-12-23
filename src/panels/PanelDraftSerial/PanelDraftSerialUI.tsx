import { observer } from 'mobx-react-lite'

import { JsonViewUI } from '../../csuite/json/JsonViewUI'

export type PanelDraftSerialProps = {
   draftID: DraftID
}

export const PanelDraftSerialUI = observer(function PanelDraftSerialUI_(p: PanelDraftSerialProps) {
   const draft = typeof p.draftID === 'string' ? cushy.db.draft.get(p.draftID) : p.draftID
   if (draft == null) return <>❌ draft with id "{p.draftID}" not found</>
   return <JsonViewUI value={draft.data.formSerial} />
})
