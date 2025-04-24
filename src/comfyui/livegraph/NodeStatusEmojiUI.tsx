import type { ComfyNode } from './ComfyNode'

import { Ikon } from '../../csuite/icons/iconHelpers'
import { Loader } from '../../csuite/inputs/Loader'
import { exhaust } from '../../csuite/utils/exhaust'

export const NodeStatusEmojiUI = obs(function NodeStatusEmojiUI_(p: { node: ComfyNode<any, any> }) {
   const s = p.node.status
   if (s === 'executing') return <Loader />
   if (s === 'cached') return <Ikon.mdiBookmark tw='text-green-600' />
   if (s === 'done') return <Ikon.mdiCheck tw='text-green-600' />
   if (s === 'error') return <Ikon.mdiAlert tw='text-red-600' />
   if (s === 'waiting') return <Ikon.mdiClockOutline tw='text-blue-600' />
   if (s == null) return <Ikon.mdiCrosshairsQuestion tw='text-gray-600' />
   return exhaust(s)
})
