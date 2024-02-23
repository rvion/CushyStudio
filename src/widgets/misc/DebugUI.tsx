import { observer } from 'mobx-react-lite'

import { Popover, Whisper } from 'src/rsuite/shims'

export const DebugUI = observer(function DebugUI_(p: { title: string; children: React.ReactNode }) {
    return (
        <Whisper
            //
            placement='auto'
            enterable
            speaker={<Popover>{p.children}</Popover>}
        >
            <div className='text-neutral-content'>{p.title}</div>
        </Whisper>
    )
})
