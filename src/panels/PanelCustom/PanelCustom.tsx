import { observer } from 'mobx-react-lite'

import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'
import { Panel, type PanelHeader } from '../../router/Panel'
import { CustomPanels } from './CustomPanels'

export const PanelCustom = new Panel({
    name: 'Temporary',
    widget: (): React.FC<PanelCustomProps> => PanelCustomUI,
    header: (p: PanelCustomProps): PanelHeader => ({ title: 'Temporary' }),
    def: (): PanelCustomProps => ({ uid: '___', props: {} }),
    icon: 'mdiSourceRepositoryMultiple',
    category: 'misc',
})

export type PanelCustomProps = {
    uid: string
    props: any
}

export const PanelCustomUI = observer(function PanelCustomUI_(p: PanelCustomProps) {
    const Widget = CustomPanels.get(p.uid)
    if (Widget == null) return <MessageErrorUI>no widget for uid #{p.uid}</MessageErrorUI>

    return <Widget {...p.props} />
})
