import { observer } from 'mobx-react-lite'
import { Button, Popover, Whisper } from 'rsuite'

export const DebugUI = observer(function DebugUI_(p: { title: string; children: React.ReactNode }) {
    return (
        <Whisper enterable speaker={<Popover>{p.children}</Popover>}>
            <Button size='xs'>{p.title}</Button>
        </Whisper>
    )
})
