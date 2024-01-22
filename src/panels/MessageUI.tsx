import { observer } from 'mobx-react-lite'

export const MessageInfoUI = observer(function MessageInfoUI_(p: { children: React.ReactNode }) {
    return (
        <div tw='virtualBorder p-2 rounded flex items-center gap-2 bg-info-2'>
            <span className='material-symbols-outlined'>info</span>
            {p.children}
        </div>
    )
})
