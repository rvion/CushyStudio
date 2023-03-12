import { observer } from 'mobx-react-lite'
import type { ReactNode } from 'react'

export const TrieEntry = observer(function LabelUI_(p: {
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
            className='label row gap1 items-baseline'
            onClick={p.onClick}
        >
            <span style={{ width: '6rem' }}>{p.title}:</span>
            {p.children}
        </div>
    )
})
