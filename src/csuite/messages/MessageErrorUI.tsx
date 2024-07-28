import { observer } from 'mobx-react-lite'

import { MessageUI } from './MessageUI'

export const MessageErrorUI = observer(function MessageErrorUI_(p: {
    title?: string
    children?: React.ReactNode
    markdown?: string
    className?: string
    closable?: boolean
}) {
    return (
        <MessageUI //
            type='error'
            icon='mdiAlertCircle'
            hue={0}
            {...p}
        />
    )
})
