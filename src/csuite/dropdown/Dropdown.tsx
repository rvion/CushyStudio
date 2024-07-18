import type { IconName } from '../icons/icons'
import type { Tint } from '../kolor/Tint'

import { ReactNode } from 'react'

import { Button } from '../button/Button'
import { Frame } from '../frame/Frame'
import { RevealUI } from '../reveal/RevealUI'

export const Dropdown = (p: {
    //
    className?: string
    startIcon?: Maybe<IconName>
    title: ReactNode
    theme?: Tint
    content?: () => ReactNode
    button?: ReactNode
    expand?: boolean
}) => (
    <RevealUI
        tw={[p.className]}
        content={() => (
            <Frame tabIndex={0} tw='flex flex-col z-[1]'>
                {p.content?.()}
            </Frame>
        )}
    >
        {p.button ?? (
            <Button
                //
                look='ghost'
                borderless
                subtle
                icon={p.startIcon}
                tabIndex={0}
                expand={p.expand}
            >
                {p.title}
            </Button>
        )}
    </RevealUI>
)
