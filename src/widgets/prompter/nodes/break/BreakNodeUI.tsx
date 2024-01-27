import type { BreakNode } from './BreakNode'

import { observer } from 'mobx-react-lite'
import { Tooltip, Whisper } from 'src/rsuite/shims'

export const BreakNodeUI = observer(function BreakNodeUI_(p: { node: BreakNode }) {
    const node = p.node as BreakNode
    return (
        <span
            //
            style={{ border: '1px solid #747474' }}
            className='text-violet-400 rv-tooltip-container p-1'
        >
            <Whisper placement='bottomStart' speaker={<Tooltip>break</Tooltip>}>
                <span>⭕️</span>
            </Whisper>
        </span>
    )
})
