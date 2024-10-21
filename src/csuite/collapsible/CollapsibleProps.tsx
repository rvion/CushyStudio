import type { CollapsibleState } from './CollapsibleState'
import type React from 'react'

export type CollapsibleProps = {
    startCollapsed?: boolean

    // components
    content: (state: CollapsibleState) => React.ReactNode
    children?: React.ReactNode
    titleCollapsed?: React.ReactNode
    titleExpanded?: React.ReactNode

    hideAnchorWhenExpanded?: boolean

    onToggle?: (state: CollapsibleState) => void

    className?: string
    style?: React.CSSProperties
}
