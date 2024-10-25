import { observer } from 'mobx-react-lite'

import { JsonViewUI } from '../../csuite/json/JsonViewUI'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'

export const PanelDraftValue = new Panel({
   name: 'DraftJsonResult',
   widget: (): React.FC<PanelDraftValueProps> => PanelDraftValueUI,
   header: (p): PanelHeader => ({ title: 'DraftJsonResult' }),
   def: (): PanelDraftValueProps => ({ draftID: cushy.db.draft.lastOrCrash().id }),
   category: 'developper',
   icon: 'mdiDevTo',
})

export type PanelDraftValueProps = {
   draftID: DraftID
}

export const PanelDraftValueUI = observer(function PanelDraftValueUI_(p: PanelDraftValueProps) {
   const st = useSt()
   const draft = typeof p.draftID === 'string' ? st.db.draft.get(p.draftID) : p.draftID
   if (draft == null) return <>❌ draft with id "{p.draftID}" not found</>
   return <JsonViewUI value={draft.form?.value} />
})
