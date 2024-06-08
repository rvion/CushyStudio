import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'

export const BadgeUI = observer(function BadgeUI_(p: { children?: ReactNode }) {
    return (
        <Frame tw='rounded-full px-2 [line-height:1rem]' base={10}>
            {p.children}
        </Frame>
    )
})
