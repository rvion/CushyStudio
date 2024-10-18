import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { Frame, type FrameProps } from '../frame/Frame'
import { hashStringToNumber } from '../hashUtils/hash'

export const BadgeUI = observer(function BadgeUI_({
    hue,
    autoHue,
    chroma,
    contrast,
    children,
    ...rest
}: {
    /** oklch hue */
    chroma?: number
    contrast?: number
    hue?: Maybe<number>
    /**
     * practical way to enforce consistent hue for a given string
     * pass anything you want to this prop, it will be hashed to a hue
     */
    autoHue?: string | boolean
    children?: ReactNode
    className?: string
} & FrameProps) {
    const hasAction = Boolean(rest.onClick)
    return (
        <Frame
            noColorStuff={rest.noColorStuff ?? false} // because we likely want autoHue to work even in parent components with noColorStuff
            // [line-height:1.1rem]
            row
            tw={[
                //
                'leading-normal',
                'whitespace-nowrap rounded px-1',
                hasAction && 'cursor-pointer',
                'w-fit',
                // 'lh-inside h-inside',
                // 'h-1/2',
                'items-center',
                'select-none',
            ]}
            hover={hasAction}
            base={{
                contrast: contrast ?? 0.1,
                chroma: chroma ?? 0.05,
                hue:
                    hue ??
                    (autoHue != null
                        ? typeof autoHue === 'boolean'
                            ? typeof children === 'string'
                                ? hashStringToNumber(children)
                                : undefined
                            : hashStringToNumber(autoHue)
                        : undefined),
            }}
            {...rest}
        >
            {children}
        </Frame>
    )
})
