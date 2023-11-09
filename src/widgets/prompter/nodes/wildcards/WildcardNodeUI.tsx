import { wildcards } from './wildcards'
import { WildcardNode } from './WildcardNode'
import { observer } from 'mobx-react-lite'
import { Tooltip, Whisper } from 'rsuite'

export const WildcardNodeUI = observer(function WildcardNodeUI_(p: { node: WildcardNode }) {
    const node = p.node
    return (
        <span
            //
            style={{ border: '1px solid #747474' }}
            className='text-yellow-700 rv-tooltip-container p-0.5'
        >
            <Whisper
                placement='bottomStart'
                speaker={<Tooltip>{((wildcards as any)[node.wildcardName] ?? []).slice(0, 20).join(', ') + '...'}</Tooltip>}
            >
                <span>{node.wildcardName} 🎲</span>
            </Whisper>
        </span>
    )
})
