import type { Placement } from './RevealState'

import React from 'react'

export type RevealProps = {
    // components
    children: [React.ReactNode, React.ReactNode]
    title?: React.ReactNode // only for popup

    // placement
    placement?: Placement

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
