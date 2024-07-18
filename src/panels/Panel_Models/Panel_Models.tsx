import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { SpacerUI } from '../../csuite/components/SpacerUI'
import { FormUI } from '../../csuite/form/FormUI'
import { FormHelpTextUI } from '../../csuite/inputs/shims'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { useSt } from '../../state/stateContext'
import { assets } from '../../utils/assets/assets'
import { SectionTitleUI } from '../../widgets/workspace/SectionTitle'
import { CivitaiUI } from './CivitaiBrowserUI'
import { Civitai } from './CivitaiSpec'

export const Panel_Models = observer(function Panel_Models_() {
    const st = useSt()
    const civitai = useMemo(() => new Civitai(), [])
    return (
        <div className='flex flex-col gap-2 h-full w-full'>
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
        <div className={p.className} tw='flex gap-2 items-center'>
            <label tw='whitespace-nowrap'>{p.label}</label>
            {p.children}
            {p.required && <FormHelpTextUI tw='join-item'>Required</FormHelpTextUI>}
        </div>
    )
})
