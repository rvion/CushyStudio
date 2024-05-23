import type { IconName } from '../../../icons/icons'
import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'

import { Button } from '../../../rsuite/button/Button'

let wasEnabled = false

export const InputBoolUI = observer(function InputBoolUI_(p: {
    active?: Maybe<boolean>
    display?: 'check' | 'button'
    expand?: boolean
    icon?: Maybe<IconName>
    text?: string
    className?: string
    style?: CSSProperties
    onValueChange?: (next: boolean) => void
}) {
    const isActive = p.active ?? false
    const display = p.display ?? 'check'
    const expand = p.expand
    const label = p.text

    if (display === 'check') {
        return (
            <Button // Container
                className={p.className}
                headless
                // active={isActive}
                icon={p.icon}
                expand={p.expand}
                style={p.style}
                tw={['WIDGET-FIELD select-none cursor-pointer']}
                onClick={(ev) => {
                    wasEnabled = !isActive
                    ev.stopPropagation()
                    if (!p.onValueChange) return
                    p.onValueChange(!isActive)
                }}
            >
                <input type='checkbox' tw='checkbox checkbox-primary' checked={isActive} tabIndex={-1} readOnly />
                {label ? label : null}
            </Button>
        )
    }

    return (
        <Button // Container
            className={p.className}
            active={isActive}
            style={p.style}
            icon={p.icon}
            expand={expand}
            tw='WIDGET-FIELD'
            onClick={(ev) => {
                wasEnabled = !isActive
                ev.stopPropagation()
                if (!p.onValueChange) return
                p.onValueChange(!isActive)
            }}
        >
            <p tw='w-full text-center line-clamp-1'>{label}</p>
        </Button>
    )
})
