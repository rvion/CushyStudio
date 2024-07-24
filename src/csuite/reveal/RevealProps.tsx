import type { RevealPlacement } from './RevealPlacement'
import type { RevealContentProps, RevealShellProps } from './shells/ShellProps'
import type { FC } from 'react'

import React from 'react'

// prettier-ignore
export type KnownShells =
    | 'focus'
    | 'none'
    | 'popover'
    | 'popup'
    | 'popup-xs'
    | 'popup-sm'
    | 'popup-lg'
    | 'popup-xl'

export type RevealProps = {
    /** @since 2024-07-23 */
    relativeTo?: `#${string}`

    // placement
    placement?: RevealPlacement

    /**
     * @deprecated
     * unused for now, backword compatibility with rsuite
     */
    enterable?: boolean

    // components / slots -------------------------------------------------------------
    /** @since 2024-07-23 */
    shell?: FC<RevealShellProps> | KnownShells
    content: FC<RevealContentProps>
    children: React.ReactNode //, React.ReactNode]
    title?: React.ReactNode // only for popup

    // callbacks if we need to add side effects after reveal/hide
    onRevealed?: () => void
    onHidden?: () => void

    // SHOW triggers ------------------------------------------------------------------
    showDelay?: number /** only for hover */
    // prettier-ignore
    trigger?: Maybe<
        /** will open on hover after the showDelay */
        | 'hover'

        // if focused from anywhere outside of the revealed content => open
        // if we type any letter or number or space or enter when anchor is focused => open
        | 'pseudofocus' // 🔴 TODO

        /** will open on click */
        | 'click'

        // weird mix of both click and hover; will probably be either
        // renamed or replaced by the trigger dict (object) notation.
        | 'clickAndHover'

        | 'none'  // 🔴 TODO
        // ❓ |  () => ...
        // ❓ |  { chick: ..., hover: ..., focus: ... }
    >

    // HIDE TRIGGER ------------------------------------------------------------------
    hideDelay?: number /** only for hover */
    hideTrigger?: Maybe<never>

    // HIDE TRIGGER ------------------------------------------------------------------
    defaultVisible?: boolean

    // look and feel ------------------------------------------------------------------
    tooltipWrapperClassName?: string
    className?: string
    style?: React.CSSProperties

    // avoid extra div ------------------------------------------------------------------
    UNSAFE_cloned?: boolean
}
export const DEBUG_REVEAL = false
