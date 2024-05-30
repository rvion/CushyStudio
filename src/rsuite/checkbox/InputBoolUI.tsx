import type { IconName } from '../../icons/icons'
import type { Box } from '../box/Box'
import type { FrameAppearance } from '../frame/FrameAppearance'

import { observer } from 'mobx-react-lite'
import { type CSSProperties } from 'react'

import { BoxUI } from '../box/BoxUI'
import { Frame } from '../frame/Frame'

let wasEnabled = false

class BoolButtonProps {
    value?: Maybe<boolean>
    display?: 'check' | 'button'
    expand?: boolean
    icon?: Maybe<IconName>
    text?: string
    className?: string
    style?: CSSProperties
    box?: Box
    disabled?: boolean
    onValueChange?: (next: boolean) => void
}

export const InputBoolUI = observer(function InputBoolUI_(p: BoolButtonProps) {
    const isActive = p.value ?? false
    const display = p.display ?? 'check'
    const expand = p.expand
    const label = p.text

    if (display === 'check') {
        return (
            <Frame //Container (Makes it so we follow Fitt's law and neatly contains everything)
                style={p.style}
                look='headless'
                className={p.className}
                disabled={p.disabled}
                hover
                triggerOnPress
                tw={[
                    //
                    'flex flex-row !select-none',
                    p.expand && 'flex-grow',
                ]}
                onClick={(ev) => {
                    wasEnabled = !isActive
                    ev.stopPropagation()
                    if (!p.onValueChange) return
                    p.onValueChange(!isActive)
                }}
            >
                <Frame // Checkbox
                    look='default'
                    active={isActive}
                    icon={isActive ? 'mdiCheckBold' : null}
                    square
                    size={'xs'}
                    {...p.box}
                    tw='!select-none justify-center'
                />
                {label ? label : null}
            </Frame>
        )
    }

    return (
        <Frame // Container
            sm
            look='default'
            className={p.className}
            triggerOnPress
            disabled={p.disabled}
            active={isActive}
            style={p.style}
            icon={p.icon}
            expand={expand}
            {...p.box}
            tw='WIDGET-FIELD !select-none cursor-pointer justify-center'
            onClick={(ev) => {
                wasEnabled = !isActive
                ev.stopPropagation()
                p.onValueChange?.(!isActive)
            }}
        >
            <p tw='w-full text-center line-clamp-1'>{label}</p>
        </Frame>
    )
})
