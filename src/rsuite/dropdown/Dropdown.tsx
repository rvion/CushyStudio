import type { IconName } from '../../icons/icons'
import type { Kolor } from '../kolor/Kolor'

import { ReactNode } from 'react'

import { Button } from '../button/Button'
import { Frame } from '../frame/Frame'
import { RevealUI } from '../reveal/RevealUI'

export const Dropdown = (p: {
    //
    className?: string
    startIcon?: Maybe<IconName>
    title: ReactNode
    theme?: Kolor
    content?: () => ReactNode
}) => (
    <RevealUI
        tw={[p.className]}
        content={() => (
            <Frame tabIndex={0} tw='z-[1]'>
                {p.content?.()}
            </Frame>
        )}
    >
        <Button
            //
            look='ghost'
            border={false}
            icon={p.startIcon}
            tabIndex={0}
            base={0}
        >
            {p.title}
        </Button>
    </RevealUI>
)
