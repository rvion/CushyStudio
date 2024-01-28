import React from 'react'
import { Placement } from './RevealState'

export type RevealProps = {
    // components
    children: [React.ReactNode, React.ReactNode]
    title?: React.ReactNode // only for popup

    // placement
    placement?: Placement

    // triggers
    showDelay?: number /** only for hover */
    hideDelay?: number /** only for hover */
    trigger?: Maybe<'hover' | 'click' | 'clickAndHover'>

    // look and feel
    tooltipWrapperClassName?: string
    className?: string
    style?: React.CSSProperties
}
