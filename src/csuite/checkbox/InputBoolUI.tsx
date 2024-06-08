import type { Box } from '../box/Box'
import type { IconName } from '../icons/icons'

import { observer } from 'mobx-react-lite'
import { createElement, type CSSProperties, type ReactNode } from 'react'

import { InputBoolCheckboxUI } from './InputBoolCheckboxUI'
import { InputBoolToggleButtonUI } from './InputBoolToggleButtonUI'

export class BoolButtonProps {
    /** true when active, false when inactive, undefined when unset */
    value?: Maybe<boolean>

    /** @default 'check' */
    display?: 'check' | 'button'

    /** @default 'checkbox' */
    mode?: 'radio' | 'checkbox' | false

    expand?: boolean
    icon?: Maybe<IconName>

    children?: ReactNode
    /** alternative way to specify children */
    text?: string

    className?: string
    style?: CSSProperties
    box?: Box
    disabled?: boolean
    onValueChange?: (next: boolean) => void
}

export const InputBoolUI = observer(function InputBoolUI_(p: BoolButtonProps) {
    const display = p.display ?? 'check'
    if (display === 'check') return createElement(InputBoolCheckboxUI, p)
    return createElement(InputBoolToggleButtonUI, p)
})
