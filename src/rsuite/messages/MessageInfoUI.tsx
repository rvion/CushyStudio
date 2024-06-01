import { observer } from 'mobx-react-lite'

import { Ikon } from '../../icons/iconHelpers'
import { Frame } from '../frame/Frame'
import { MarkdownUI } from '../MarkdownUI'

export const MessageInfoUI = observer(function MessageInfoUI_(p: {
    title?: string
    children?: React.ReactNode
    markdown?: string
    className?: string
}) {
    return (
        <Frame
            base={{ contrast: 0.05, hue: 220, chroma: 0.04 }}
            className={p.className}
            tw='virtualBorder p-1 rounded flex items-center gap-2'
        >
            <Ikon.mdiInformation />
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
        </Frame>
    )
})
