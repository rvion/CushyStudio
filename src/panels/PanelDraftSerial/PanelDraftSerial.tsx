import { Panel, type PanelHeader } from '../../router/Panel'
import { type PanelDraftSerialProps, PanelDraftSerialUI } from './PanelDraftSerialUI'

export const PanelDraftSerial = new Panel({
   name: 'DraftJsonSerial',
   widget: (): React.FC<PanelDraftSerialProps> => PanelDraftSerialUI,
   header: (p): PanelHeader => ({ title: 'DraftJsonSerial' }),
   def: (): PanelDraftSerialProps => ({ draftID: cushy.db.draft.lastOrCrash().id }),
   icon: 'mdiCodeBlockBraces',
   category: 'developper',
})
