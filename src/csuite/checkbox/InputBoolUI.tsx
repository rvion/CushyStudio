import type { Box } from '../box/Box'
import type { SharedClickAndSlideKey } from '../button/usePressLogic'
import type { FrameProps } from '../frame/Frame'
import type { IconName } from '../icons/icons'

import { observer } from 'mobx-react-lite'
import { createElement } from 'react'

import { InputBoolCheckboxUI } from './InputBoolCheckboxUI'
import { ToggleButtonUI } from './InputBoolToggleButtonUI'

export type BoolButtonMode = 'radio' | 'checkbox' | false

// TODO: switch to frame
export type BoolButtonProps = {
    /** true when active, false when inactive, undefined when unset */
    value?: Maybe<boolean>

    /** @default 'check' */
    display?: 'check' | 'button'

    /** @default 'checkbox' */
    mode?: BoolButtonMode

    // iconOn?: Maybe<IconName | false>
    iconOff?: Maybe<IconName | boolean>

    /** alternative way to specify children */
    text?: string

    // border?: TintExt

    box?: Box
    onValueChange?: (next: boolean) => void

    toggleGroup: SharedClickAndSlideKey
} & FrameProps

export const InputBoolUI = observer(function InputBool(p: BoolButtonProps) {
    const display = p.display ?? 'check'
    if (display === 'check') return createElement(InputBoolCheckboxUI, p)
    return createElement(ToggleButtonUI, p)
})
