import { observer } from 'mobx-react-lite'

import { Panel } from '../../router/Panel'

export const PanelCivitai = new Panel({
    name: 'Civitai',
    widget: () => PanelCivitaiUI,
    header: (p) => ({ title: 'Civitai' }),
    def: () => ({}),
    icon: 'mdiAccountStarOutline',
})

const PanelCivitaiUI = observer(function PanelCivitaiUI_(p: {}) {
    return <iframe className='w-full h-full' src={'https://civitai.com'} frameBorder='0' />
})
