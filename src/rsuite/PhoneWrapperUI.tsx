import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

export const PhoneWrapperUI = observer(function PhoneWrapperUI_(p: { children: ReactNode }) {
    return (
        <div className='mockup-phone border-primary'>
            <div className='camera'></div>
            <div className='display'>
                <div className='artboard artboard-demo phone-1 overflow-auto'>{p.children}</div>
            </div>
        </div>
    )
})
