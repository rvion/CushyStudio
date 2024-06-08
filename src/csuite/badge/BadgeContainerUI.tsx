import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

export const BadgeContainerUI = observer(function BadgeGroupUI_(p: { children?: ReactNode }) {
    return <div tw='flex flex-wrap gap-1'>{p.children}</div>
})
