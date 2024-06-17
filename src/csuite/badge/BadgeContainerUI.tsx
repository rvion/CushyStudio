import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

export const BadgeContainerUI = observer(function BadgeGroupUI_(p: {
    /** @default true */
    wrap?: boolean
    children?: ReactNode
}) {
    if (p.wrap ?? true) return <div tw='flex flex-wrap gap-1'>{p.children}</div>
    return <div tw='flex'>{p.children}</div>
})
