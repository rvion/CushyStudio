import type { IconName } from '../../icons/icons'
import type { Box } from '../box/Box'
import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'

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
                className={p.className}
                disabled={p.disabled}
                hover
                triggerOnPress
                expand={p.expand}
                tw={['flex flex-row !select-none cursor-pointer']}
                onClick={(ev) => {
                    wasEnabled = !isActive
                    ev.stopPropagation()
                    if (!p.onValueChange) return
                    p.onValueChange(!isActive)
                }}
            >
                <Frame // Checkbox
                    icon={p.icon ?? (isActive ? 'mdiCheckBold' : null)}
                    tw='!select-none rounded-sm object-contain WIDGET-FIELD'
                    border={20}
                    style={{ width: 'var(--input-height)' }}
                    base={{ contrast: isActive ? 0.09 : 0.0, chroma: isActive ? 0.08 : 0.01 }}
                    size='sm'
                    {...p.box}
                />
                {label ? label : null}
            </Frame>
        )
    }

    return (
        <Frame
            tw='WIDGET-FIELD !select-none cursor-pointer justify-center px-1 py-1 text-sm'
            className={p.className}
            triggerOnPress
            look='default'
            base={{ contrast: isActive ? 0.09 : 0.05, chroma: isActive ? 0.08 : 0.02 }}
            border={isActive ? 20 : 0}
            expand={expand}
            style={p.style}
            icon={p.icon}
            {...p.box}
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
