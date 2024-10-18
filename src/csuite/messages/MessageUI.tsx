import type { IconName } from '../icons/icons'

import { observer, useLocalObservable } from 'mobx-react-lite'

import { Button } from '../button/Button'
import { Frame } from '../frame/Frame'
import { IkonOf } from '../icons/iconHelpers'
import { MarkdownUI } from '../markdown/MarkdownUI'
import { knownOKLCHHues } from '../tinyCSS/knownHues'

export const MessageUI = observer(function MessageInfoUI_(p: {
    title?: string
    type: 'info' | 'error' | 'warning'
    icon?: IconName
    hue?: number
    children?: React.ReactNode
    markdown?: string
    className?: string
    closable?: boolean
}) {
    const uist = useLocalObservable(() => ({ closed: false }))
    if (uist.closed) return null
    return (
        <Frame
            base={{ contrast: 0.05, hue: p.hue ?? knownOKLCHHues.info, chroma: 0.04 }}
            border={10}
            className={p.className}
            tw='flex items-start gap-1 rounded p-0.5'
        >
            {p.icon && (
                <Frame text={{ chroma: 0.1, contrast: 0.2 }}>
                    <IkonOf name={p.icon} tw='h-input flex-none text-lg' />
                </Frame>
            )}
            <div>
                {p.title && <div tw='w-full font-bold'>{p.title}</div>}
                {p.children}
                <MarkdownUI markdown={p.markdown} />
            </div>
            {(p.closable ?? true) && (
                <Button
                    onClick={() => (uist.closed = true)}
                    tw='ml-auto'
                    size='input'
                    text={{ contrast: 0.3 }}
                    border={0}
                    subtle
                    square
                    icon='mdiClose'
                ></Button>
            )}
        </Frame>
    )
})
