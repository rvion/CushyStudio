import type { RevealPlacement } from './RevealPlacement'

import React from 'react'

export type RevealProps = {
    /**
     * @deprecated
     * unused for now, backword compatibility with rsuite
     */
    enterable?: boolean
    // components
    content: () => React.ReactNode
    children: React.ReactNode //, React.ReactNode]
    title?: React.ReactNode // only for popup

    // placement
    placement?: RevealPlacement

    onClick?: (ev: React.MouseEvent) => void

    // triggers
    showDelay?: number /** only for hover */
    hideDelay?: number /** only for hover */
    trigger?: Maybe<'hover' | 'click' | 'clickAndHover'>

    // look and feel
    tooltipWrapperClassName?: string
    className?: string
    style?: React.CSSProperties
}
