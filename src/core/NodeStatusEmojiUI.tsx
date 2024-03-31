import type { ComfyNode } from './ComfyNode'

import { observer } from 'mobx-react-lite'

import { Loader } from '../rsuite/shims'
import { exhaust } from '../utils/misc/exhaust'

export const NodeStatusEmojiUI = observer(function NodeStatusEmojiUI_(p: { node: ComfyNode<any, any> }) {
    const s = p.node.status
    if (s === 'executing') return <Loader />
    if (s === 'cached') return <span className='material-symbols-outlined text-green-600'>bookmark</span>
    if (s === 'done') return <span className='material-symbols-outlined text-green-600'>done</span>
    if (s === 'error') return <span className='material-symbols-outlined text-red-600'>error</span>
    if (s === 'waiting') return <span className='material-symbols-outlined text-blue-600'>next_plan</span>
    if (s == null) return <span className='material-symbols-outlined text-gray-600'>contact_support</span>
    return exhaust(s)
})
