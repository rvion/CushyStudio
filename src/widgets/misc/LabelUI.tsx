import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

export const TreeValue = observer(function TreeValue_(p: {
    //
    onClick?: () => void
    title: ReactNode
    children: ReactNode
}) {
    return (
        <div
            style={{
                textDecoration: p.onClick ? 'underline' : undefined,
                cursor: p.onClick ? 'pointer' : undefined,
            }}
            className='TreeValue label row gap1 items-baseline'
            onClick={p.onClick}
        >
            <span style={{ width: '6rem' }}>{p.title}:</span>
            {p.children}
        </div>
    )
})
