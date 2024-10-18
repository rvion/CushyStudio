import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { SpacerUI } from '../../csuite/components/SpacerUI'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'
import { assets } from '../../utils/assets/assets'
import { SectionTitleUI } from '../../widgets/workspace/SectionTitle'
import { CivitaiUI } from './CivitaiBrowserUI'
import { Civitai } from './CivitaiSpec'

export const PanelModels = new Panel({
    name: 'Models',
    widget: (): React.FC<NO_PROPS> => PanelModelsUI,
    header: (p): PanelHeader => ({ title: 'Models' }),
    def: (): NO_PROPS => ({}),
    category: 'models',
    icon: 'mdiGlobeModel',
})

export const PanelModelsUI = observer(function PanelModelsUI_(p: NO_PROPS) {
    const st = useSt()
    const civitai = useMemo(() => new Civitai(), [])
    return (
        <div className='flex size-full flex-col gap-2'>
            <PanelHeaderUI>
                <SectionTitleUI
                    label={
                        <div tw='flex gap-1'>
                            <img tw='h-input' src={assets.CivitaiLogo_png} alt='Civitai logo' />
                            CIVITAI
                        </div>
                    }
                    className='block'
                />
                <SpacerUI />
                {st.civitaiConf.renderAsConfigBtn({ title: 'CIVITAI Options' })}
            </PanelHeaderUI>
            <CivitaiUI tw='flex-1' civitai={civitai} />
        </div>
    )
})

export const FieldUI = observer(function FieldUI_(p: {
    required?: boolean
    label?: string
    help?: string
    className?: string
    children: React.ReactNode
}) {
    return (
        <div className={p.className} tw='flex items-center gap-2'>
            <label tw='whitespace-nowrap'>{p.label}</label>
            {p.children}
            {p.required && <div tw='join-item'>Required</div>}
        </div>
    )
})
