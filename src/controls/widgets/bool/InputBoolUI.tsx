import type { IconName } from '../../../icons/icons'
import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'

import { Button } from '../../../rsuite/Button'

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
                appearance='none'
                // active={isActive}
                icon={p.icon}
                style={p.style}
                tw={[
                    'WIDGET-FIELD select-none cursor-pointer w-full flex',
                    // Make the click-able area take up the entire width when as a checkmark and haven't explicitly set expand to false.
                    expand && 'w-full',
                ]}
                onClick={(ev) => {
                    wasEnabled = !isActive
                    ev.stopPropagation()
                    if (!p.onValueChange) return
                    p.onValueChange(!isActive)
                }}
            >
                <input
                    type='checkbox'
                    checked={isActive}
                    tw={['checkbox checkbox-primary h-5 w-5 rounded-sm !outline-none cursor-default']}
                    tabIndex={-1}
                    readOnly
                />
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
            tw={[
                'WIDGET-FIELD ',
                // Make the click-able area take up the entire width when as a checkmark and haven't explicitly set expand to false.
                expand && 'w-full',
            ]}
            onClick={(ev) => {
                wasEnabled = !isActive
                ev.stopPropagation()
                if (!p.onValueChange) return
                p.onValueChange(!isActive)
            }}
        >
            <p tw='w-full text-center line-clamp-1'>{label ? label : <></>}</p>
        </Button>
    )
})
