import type { ComfyNode } from './ComfyNode'

import { observer } from 'mobx-react-lite'

import { Ikon } from '../csuite/icons/iconHelpers'
import { Loader } from '../csuite/inputs/shims'
import { exhaust } from '../csuite/utils/exhaust'

export const NodeStatusEmojiUI = observer(function NodeStatusEmojiUI_(p: { node: ComfyNode<any, any> }) {
    const s = p.node.status
    if (s === 'executing') return <Loader />
    if (s === 'cached') return <Ikon.mdiBookmark tw='text-green-600' />
    if (s === 'done') return <Ikon.mdiCheck tw='text-green-600' />
    if (s === 'error') return <Ikon.mdiAlert tw='text-red-600' />
    if (s === 'waiting') return <Ikon.mdiClockOutline tw='text-blue-600' />
    if (s == null) return <Ikon.mdiCrosshairsQuestion tw='text-gray-600' />
    return exhaust(s)
})
