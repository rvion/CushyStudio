import { observer } from 'mobx-react-lite'
import type { ReactNode } from 'react'

export const TrieEntry = observer(function LabelUI_(p: {
    //
    onClick?: () => void
    title: ReactNode
    children: ReactNode
}) {
    return (
        <div className='label row gap1 items-baseline' onClick={p.onClick}>
            <span>{p.title}:</span>
            {p.children}
        </div>
    )
})
