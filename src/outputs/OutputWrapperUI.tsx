import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

export const OutputWrapperUI = observer(function OutputWrapperUI_(p: { label: string; children: ReactNode }) {
    return (
        <div style={{ background: '#3d5282' }} className='flex flex-row virtualBorder'>
            {p.label ? (
                <div className='flex items-baseline'>
                    <div className='font-bold'>{p.label}</div>
                    <div>{p.children}</div>
                </div>
            ) : (
                p.children
            )}
        </div>
    )
})
