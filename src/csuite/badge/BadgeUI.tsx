import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'
import { hashStringToNumber } from '../hashUtils/hash'

export const BadgeUI = observer(function BadgeUI_(p: {
    /** oklch hue */
    hue?: number
    /**
     * practical way to enforce consistent hue for a given string
     * pass anything you want to this prop, it will be hashed to a hue
     */
    autoHue?: string | boolean
    children?: ReactNode
}) {
    return (
        <Frame
            base={{
                //
                hue:
                    p.hue ??
                    (p.autoHue
                        ? typeof p.autoHue === 'boolean'
                            ? typeof p.children === 'string'
                                ? hashStringToNumber(p.children)
                                : undefined
                            : hashStringToNumber(p.autoHue)
                        : undefined),
                contrast: 0.1,
                chroma: 0.05,
            }}
            tw='rounded-full px-2 py-0.5 [line-height:1rem]'
        >
            {p.children}
        </Frame>
    )
})
