import type { DovProps } from '../frame/Dov/Dov'
import type { RevealPlacement } from './RevealPlacement'
import type { RevealContentProps, RevealShellProps } from './shells/ShellProps'
import type React from 'react'
import type { FC } from 'react'

// prettier-ignore
export type KnownShells =
    | 'none'
    | 'popover'
    | 'popup'
    | 'popup-xs'
    | 'popup-sm'
    | 'popup-lg'
    | 'popup-xl'

export type RevealShowTrigger =
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
    | 'none' // 🔴 TODO
// ❓ |  () => ...
// ❓ |  { chick: ..., hover: ..., focus: ... }

export type RevealHideTrigger =
    | 'mouseOutside' //
    | 'escapeKey'
    | 'blurAnchor'
    // | 'blurTooltip' // not sure we need this one
    | 'clickAnchor'
    | 'backdropClick' // via shell backdrop
    | 'shellClick' // via shell (not backdrop)
    | 'none'

export type RevealHideTriggers = { [key in RevealHideTrigger]?: boolean }

export type RevealHideReason =
    | 'clickAnchor' //
    | 'backdropClick'
    | 'shellClick' // via shell (not backdrop)
    | 'mouseOutside'
    | 'tabKey'
    | 'shiftTabKey'
    | 'escapeKey'
    | 'pickOption'
    | 'blurAnchor'
    | 'closeButton' // ex: in modals
    | 'cascade' // another reveal appearing caused the closure
    | 'programmatic'
    | 'unknown'

export type RevealProps = {
    /** @since 2024-07-23 */
    relativeTo?: `#${string}` | 'mouse' | 'anchor'

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
    onHidden?: (reason: RevealHideReason) => void

    // SHOW triggers ------------------------------------------------------------------
    showDelay?: number /** only for hover */
    trigger?: Maybe<RevealShowTrigger>

    // HIDE TRIGGER ------------------------------------------------------------------
    hideDelay?: number /** only for hover */
    // prettier-ignore
    hideTriggers?: RevealHideTriggers

    // HIDE TRIGGER ------------------------------------------------------------------
    defaultVisible?: boolean

    // look and feel ------------------------------------------------------------------
    shellClassName?: string
    className?: string
    style?: React.CSSProperties

    // avoid extra div ------------------------------------------------------------------
    UNSAFE_cloned?: boolean

    sharedAnchorRef?: React.RefObject<HTMLDivElement>
    backdropColor?: string
    hasBackdrop?: boolean
    showBackdrop?: boolean

    /**
     * when we have nested Reveals but they actually are independent
     */
    useSeparateTower?: boolean

    // 🔴 actually the child may not accept DovProps...
    anchorProps?: DovProps
}
