import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

export const BadgeContainerUI = observer(function BadgeGroupUI_(p: {
    /** @default true */
    wrap?: boolean
    children?: ReactNode
}) {
    return (
        <div
            tw={[
                //
                'UI-BadgeContainer flex gap-0.5',
                (p.wrap ?? true) && 'flex-wrap',
            ]}
        >
            {p.children}
        </div>
    )
})
