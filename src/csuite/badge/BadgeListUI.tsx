import type { FrameProps } from '../frame/Frame'

import { observer } from 'mobx-react-lite'

import { RevealUI } from '../reveal/RevealUI'
import { BadgeContainerUI } from './BadgeContainerUI'
import { BadgeUI } from './BadgeUI'

export const BadgeListUI = observer(function BadgeListUI_({
    autoHue,
    badges,
    wrap = true,
    onClick,
}: {
    autoHue?: string | boolean
    badges?: string[]
    /** @default true */
    wrap?: boolean
    className?: string
    onClick?: (tag: string) => void
} & FrameProps) {
    const items = badges
    if (items == null) return null
    if (items.length === 0) return null
    return (
        <BadgeContainerUI wrap={wrap}>
            {items.slice(0, 10).map((tag) => (
                <BadgeUI autoHue={autoHue} key={tag} onClick={() => onClick && onClick(tag)}>
                    {tag}
                </BadgeUI>
            ))}
            {items.length > 10 ? (
                <RevealUI
                    trigger='hover'
                    content={() => (
                        <div>
                            {items.slice(10).map((tag) => (
                                <BadgeUI autoHue={autoHue} key={tag} onClick={() => onClick && onClick(tag)}>
                                    {tag}
                                </BadgeUI>
                            ))}
                        </div>
                    )}
                >
                    <BadgeUI tw='font-bold'>+{items.length - 10} more</BadgeUI>
                </RevealUI>
            ) : null}
        </BadgeContainerUI>
    )
})
