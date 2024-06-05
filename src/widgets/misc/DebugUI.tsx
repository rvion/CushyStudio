import { observer } from 'mobx-react-lite'

import { RevealUI } from '../../csuite/reveal/RevealUI'

export const DebugUI = observer(function DebugUI_(p: { title: string; children: React.ReactNode }) {
    return (
        <RevealUI placement='auto' enterable content={() => <div>{p.children}</div>}>
            <div className='text-neutral-content'>{p.title}</div>
        </RevealUI>
    )
})
