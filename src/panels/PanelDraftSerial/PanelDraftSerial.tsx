import { observer } from 'mobx-react-lite'

import { JsonViewUI } from '../../csuite/json/JsonViewUI'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'

export const PanelDraftSerial = new Panel({
   name: 'DraftJsonSerial',
   widget: (): React.FC<PanelDraftSerialProps> => Panel_DraftJsonSerial,
   header: (p): PanelHeader => ({ title: 'DraftJsonSerial' }),
   def: (): PanelDraftSerialProps => ({ draftID: cushy.db.draft.lastOrCrash().id }),
   icon: 'mdiCodeBlockBraces',
   category: 'developper',
})

export type PanelDraftSerialProps = {
   draftID: DraftID
}

export const Panel_DraftJsonSerial = observer(function Panel_DraftJsonSerial_(p: PanelDraftSerialProps) {
   const st = useSt()
   const draft = typeof p.draftID === 'string' ? st.db.draft.get(p.draftID) : p.draftID
   if (draft == null) return <>❌ draft with id "{p.draftID}" not found</>
   return <JsonViewUI value={draft.data.formSerial} />
})
