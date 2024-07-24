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

    /** @since 2024-07-23 */
    shell?: FC<RevealShellProps> | KnownShells

    /**
     * @deprecated
     * unused for now, backword compatibility with rsuite
     */
    enterable?: boolean
    // components
    content: FC<RevealContentProps>
    children: React.ReactNode //, React.ReactNode]
    title?: React.ReactNode // only for popup

    onClick?: (ev: React.MouseEvent) => void

    // triggers
    showDelay?: number /** only for hover */
    hideDelay?: number /** only for hover */
    trigger?: Maybe<'hover' | 'click' | 'clickAndHover'>
    defaultVisible?: boolean

    // look and feel
    tooltipWrapperClassName?: string
    className?: string
    style?: React.CSSProperties

    // avoid extra div
    UNSAFE_cloned?: boolean
}
export const DEBUG_REVEAL = false
