import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { useSt } from '../../state/stateContext'
import { PanelHeaderUI } from '../PanelHeader'
import { CivitaiUI } from './CivitaiBrowserUI'
import { Civitai } from './CivitaiSpec'
import { FormUI } from 'src/controls/FormUI'
import { FormHelpText } from 'src/rsuite/shims'
import { SectionTitleUI } from 'src/widgets/workspace/SectionTitle'

export const Panel_Models = observer(function Panel_Models_() {
    const st = useSt()
    const civitai = useMemo(() => new Civitai(), [])
    return (
        <div className='flex flex-col gap-2 h-full w-full'>
            <SectionTitleUI label='CIVITAI' className='block'>
                <PanelHeaderUI>
                    <FormUI form={st.civitaiConf} />
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
            {p.required && <FormHelpText tw='join-item'>Required</FormHelpText>}
        </div>
    )
})
