import { observer } from 'mobx-react-lite'
import type { ReactNode } from 'react'

export const LabelUI = observer(function LabelUI_(p: { title: ReactNode; children: ReactNode }) {
    return (
        <div className='label row gap1 items-baseline'>
            <span>{p.title}</span>
            {p.children}
        </div>
    )
})
