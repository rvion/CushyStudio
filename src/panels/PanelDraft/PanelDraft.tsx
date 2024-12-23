import { Panel, type PanelHeader } from '../../router/Panel'
import { type PanelDraftProps, PanelDraftUI } from './PanelDraftUI'

export const PanelDraft = new Panel({
   name: 'Draft',
   widget: (): React.FC<PanelDraftProps> => PanelDraftUI,
   header: (p): PanelHeader => ({ title: 'Draft' }),
   def: (): PanelDraftProps => ({ draftID: cushy.db.draft.lastOrCrash().id }),
   icon: 'cdiDraft',
   category: 'app',
})
