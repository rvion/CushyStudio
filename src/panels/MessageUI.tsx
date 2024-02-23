import { observer } from 'mobx-react-lite'

import { MarkdownUI } from 'src/rsuite/MarkdownUI'

export const MessageInfoUI = observer(function MessageInfoUI_(p: {
    title?: string
    children?: React.ReactNode
    markdown?: string
}) {
    return (
        <div tw='virtualBorder p-2 rounded flex items-center gap-2 bg-info-2'>
            <span className='material-symbols-outlined'>info</span>
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

export const MessageErrorUI = observer(function MessageErrorUI_(p: {
    title?: string
    children?: React.ReactNode
    markdown?: string
}) {
    return (
        <div tw='virtualBorder p-2 rounded flex items-center gap-2 bg-error-2'>
            <span className='material-symbols-outlined'>error</span>
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

export const MessageWarningUI = observer(function MessageWarningUI_(p: {
    title?: string
    children?: React.ReactNode
    markdown?: string
}) {
    return (
        <div tw='virtualBorder p-2 rounded flex items-center gap-2 bg-warning-2'>
            <span className='material-symbols-outlined'>warning</span>
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
