import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { Popover, Whisper } from 'rsuite'

export const TooltipUI = observer(function TooltipUI_(p: {
    //
    children: [ReactNode, ReactNode]
}) {
    return (
        <Whisper placement='auto' enterable speaker={<Popover>{p.children[1]!}</Popover>}>
            <div>{p.children[0]!}</div>
        </Whisper>
    )
})
