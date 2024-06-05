import type { IconName } from '../../icons/icons'

import { observer, useLocalObservable } from 'mobx-react-lite'

import { IkonOf } from '../../icons/iconHelpers'
import { Button } from '../button/Button'
import { Frame } from '../frame/Frame'
import { MarkdownUI } from '../MarkdownUI'
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
            tw='p-0.5 rounded flex items-start gap-1'
        >
            {p.icon && <IkonOf name={p.icon} tw='flex-none text-lg h-input' />}
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
