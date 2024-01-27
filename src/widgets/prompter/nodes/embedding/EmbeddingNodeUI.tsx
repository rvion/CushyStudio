import type { EmbeddingNode } from './EmbeddingNode'

import { observer } from 'mobx-react-lite'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'

export const EmbeddingNodeUI = observer(function EmbeddingNodeUI_(p: { node: EmbeddingNode }) {
    const node = p.node as EmbeddingNode
    return (
        <span
            //
            style={{ border: '1px solid #747474' }}
            className='text-red-400 rv-tooltip-container p-1'
        >
            <RevealUI>
                <span>{node.embeddingName} ☎️</span>
                <span>embedding</span>
            </RevealUI>
        </span>
    )
})
