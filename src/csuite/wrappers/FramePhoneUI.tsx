import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

export const FramePhoneUI = observer(function FramePhoneUI_(p: {
    //
    className?: string
    size: 0 | 1 | 2 | 3 | 4 | 5 | 6
    children: ReactNode
}) {
    return (
        <div tw={p.className} className='mockup-phone border-primary'>
            <div className='camera'></div>
            <div className='display'>
                <div
                    tw={[
                        {
                            'phone-1': p.size === 1,
                            'phone-2': p.size === 2,
                            'phone-3': p.size === 3,
                            'phone-4': p.size === 4,
                            'phone-5': p.size === 5,
                            'phone-6': p.size === 6,
                        },
                    ]}
                    className='artboard artboard-demo overflow-auto'
                >
                    {p.children}
                </div>
            </div>
        </div>
    )
})
