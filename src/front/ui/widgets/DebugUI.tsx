import { observer } from 'mobx-react-lite'
import { Popover, Whisper } from 'rsuite'

export const DebugUI = observer(function DebugUI_(p: { title: string; children: React.ReactNode }) {
    return (
        <Whisper placement='autoVerticalEnd' enterable speaker={<Popover>{p.children}</Popover>}>
            <div className='text-gray-500'>{p.title}</div>
        </Whisper>
    )
})
