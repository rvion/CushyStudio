import type { Box } from '../box/Box'
import type { IconName } from '../icons/icons'
import type { TintExt } from '../kolor/Tint'
import type { RevealPlacement } from '../reveal/RevealPlacement'
import type { DovProps } from 'src/front/lsuite/Dov/Dov'

import { observer } from 'mobx-react-lite'
import { createElement, type CSSProperties, type ReactNode } from 'react'

import { InputBoolCheckboxUI } from './InputBoolCheckboxUI'
import { InputBoolToggleButtonUI } from './InputBoolToggleButtonUI'

export type BoolButtonMode = 'radio' | 'checkbox' | false

export type BoolButtonProps = {
    /** true when active, false when inactive, undefined when unset */
    value?: Maybe<boolean>

    /** @default 'check' */
    display?: 'check' | 'button'

    /** @default 'checkbox' */
    mode?: BoolButtonMode

    // expand?: boolean
    // icon?: Maybe<IconName>
    // tooltip?: string
    // tooltipPlacement?: RevealPlacement
    // 2024-06-12 rvion: I think I'd like having this in addition to the single icon prop
    // iconOn?: Maybe<IconName | false>
    iconOff?: Maybe<IconName | boolean>

    /** alternative way to specify children */
    text?: string
    // border?: TintExt

    box?: Box
    onValueChange?: (next: boolean) => void
} & DovProps

export const InputBoolUI = observer(function InputBoolUI_(p: BoolButtonProps) {
    const display = p.display ?? 'check'
    if (display === 'check') return createElement(InputBoolCheckboxUI, p)
    return createElement(InputBoolToggleButtonUI, p)
})
