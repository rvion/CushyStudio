import { observer } from 'mobx-react-lite'
import { EmbeddingNode } from './EmbeddingNode'
import { Tooltip, Whisper } from 'rsuite'

export const EmbeddingNodeUI = observer(function EmbeddingNodeUI_(p: { node: EmbeddingNode }) {
    const node = p.node as EmbeddingNode
    return (
        <span
            //
            style={{ border: '1px solid #747474' }}
            className='text-red-400 rv-tooltip-container p-1'
        >
            <Whisper placement='bottomStart' speaker={<Tooltip>embedding</Tooltip>}>
                <span>{node.embeddingName} ☎️</span>
            </Whisper>
        </span>
    )
})
