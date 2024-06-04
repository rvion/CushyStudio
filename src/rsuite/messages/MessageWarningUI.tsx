import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'
import { MarkdownUI } from '../MarkdownUI'
import { knownOKLCHHues } from '../tinyCSS/knownHues'

export const MessageWarningUI = observer(function MessageWarningUI_(p: {
    title?: string
    children?: React.ReactNode
    markdown?: string
    className?: string
}) {
    return (
        <Frame
            //
            base={{ contrast: 0.05, hue: knownOKLCHHues.warning, chroma: 0.04 }}
            border={10}
            className={p.className}
            tw='p-1 rounded flex items-center gap-2 bg-warning-2'
            icon='mdiAlert'
        >
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
