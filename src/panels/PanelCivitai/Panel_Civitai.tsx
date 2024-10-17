import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { Panel, type PanelHeader } from '../../router/Panel'

export const PanelCivitai = new Panel({
    name: 'Civitai',
    category: 'models',
    widget: (): React.FC<NO_PROPS> => PanelCivitaiUI,
    header: (p): PanelHeader => ({ title: 'Civitai' }),
    def: (): NO_PROPS => ({}),
    icon: 'mdiAccountStarOutline',
})

const PanelCivitaiUI = observer(function PanelCivitaiUI_(p: NO_PROPS) {
    return <iframe className='h-full w-full' src={'https://civitai.com'} frameBorder='0' />
})
