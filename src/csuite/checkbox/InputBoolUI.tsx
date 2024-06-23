import type { Box } from '../box/Box'
import type { IconName } from '../icons/icons'
import type { RevealPlacement } from '../reveal/RevealPlacement'

import { observer } from 'mobx-react-lite'
import { createElement, type CSSProperties, type ReactNode } from 'react'

import { InputBoolCheckboxUI } from './InputBoolCheckboxUI'
import { InputBoolToggleButtonUI } from './InputBoolToggleButtonUI'

export type BoolButtonMode = 'radio' | 'checkbox' | false

export class BoolButtonProps {
    /** true when active, false when inactive, undefined when unset */
    value?: Maybe<boolean>

    /** @default 'check' */
    display?: 'check' | 'button'

    /** @default 'checkbox' */
    mode?: BoolButtonMode

    expand?: boolean
    icon?: Maybe<IconName>
    tooltip?: string
    tooltipPlacement?: RevealPlacement
    // 2024-06-12 rvion: I think I'd like having this in addition to the single icon prop
    // iconOn?: Maybe<IconName | false>
    // iconOff?: Maybe<IconName | false>

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
