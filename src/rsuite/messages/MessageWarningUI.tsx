import { observer } from 'mobx-react-lite'

import { Ikon } from '../../icons/iconHelpers'
import { MarkdownUI } from '../MarkdownUI'

export const MessageWarningUI = observer(function MessageWarningUI_(p: {
    title?: string
    children?: React.ReactNode
    markdown?: string
}) {
    return (
        <div tw='virtualBorder p-1 rounded flex items-center gap-2 bg-warning-2'>
            <Ikon.mdiAlert />
            {p.title ? (
                <div>
                    <div tw='text-xl w-full font-bold'>{p.title}</div>
                    {p.children}
                    <MarkdownUI markdown={p.markdown} />
                </div>
            ) : (
                <>
                    {p.children}
                    <MarkdownUI markdown={p.markdown} />
                </>
            )}
        </div>
    )
})
