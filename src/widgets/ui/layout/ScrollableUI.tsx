import { observer } from 'mobx-react-lite'

export const ScrollableUI = observer(function ScrollableUI_(p: { children: React.ReactNode }) {
    return (
        <div className='relative flex-1 '>
            <div className='inset-0 scrollable'>{p.children}</div>
        </div>
    )
})
