import type { IconName } from '../../icons/icons'
import type { Kolor } from '../kolor/Kolor'

import { ReactNode } from 'react'

import { BoxUI } from '../box/BoxUI'
import { Button } from '../button/Button'
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
            <BoxUI base={-5} tabIndex={0} tw='shadow z-[1]'>
                {p.content?.()}
            </BoxUI>
        )}
    >
        <Button border={false} icon={p.startIcon} tabIndex={0}>
            {p.title}
        </Button>
    </RevealUI>
)
