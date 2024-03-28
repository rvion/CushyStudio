import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { FormUI } from '../../controls/FormUI'
import { SpacerUI } from '../../controls/widgets/spacer/SpacerUI'
import { RevealUI } from '../../rsuite/reveal/RevealUI'
import { FormHelpTextUI } from '../../rsuite/shims'
import { useSt } from '../../state/stateContext'
import { assets } from '../../utils/assets/assets'
import { SectionTitleUI } from '../../widgets/workspace/SectionTitle'
import { PanelHeaderUI } from '../PanelHeader'
import { CivitaiUI } from './CivitaiBrowserUI'
import { Civitai } from './CivitaiSpec'

export const Panel_Models = observer(function Panel_Models_() {
    const st = useSt()
    const civitai = useMemo(() => new Civitai(), [])
    return (
        <div className='flex flex-col gap-2 h-full w-full'>
            <SectionTitleUI
                label={
                    <div tw='flex'>
                        <img tw='h-8 w-8' src={assets.CivitaiLogo_png} alt='Civitai logo' />
                        CIVITAI
                    </div>
                }
                className='block'
            >
                <PanelHeaderUI>
                    <SpacerUI />
                    <RevealUI
                        tw='WIDGET-FIELD'
                        title='CIVITAI Options'
                        content={() => (
                            <div tw='p-1'>
                                <FormUI form={st.civitaiConf} />
                            </div>
                        )}
                    >
                        <div tw='flex px-1 cursor-default bg-base-200 rounded w-full h-full items-center justify-center hover:brightness-125 border border-base-100'>
                            <span className='material-symbols-outlined'>settings</span>
                            <span className='material-symbols-outlined'>expand_more</span>
                        </div>
                    </RevealUI>
                </PanelHeaderUI>
            </SectionTitleUI>
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
        <div className={p.className} tw='flex gap-2 items-center'>
            <label tw='whitespace-nowrap'>{p.label}</label>
            {p.children}
            {p.required && <FormHelpTextUI tw='join-item'>Required</FormHelpTextUI>}
        </div>
    )
})
