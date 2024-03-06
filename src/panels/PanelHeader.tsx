import { observer } from 'mobx-react-lite'
import React from 'react'
import { ReactNode } from 'react'

function correctChildrenHeight(elements: [ReactNode] | ReactNode) {
    if (Array.isArray(elements)) {
        return React.Children.map(elements, (child, index) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                    className: `${child.props.className ? child.props.className + ' ' : ''}CSHY-panel-header-item`,
                } as React.HTMLAttributes<HTMLElement>)
            } else {
                return child
            }
        })
    } else if (React.isValidElement(elements)) {
        return React.cloneElement(elements, {
            className: `${elements.props.className ? elements.props.className + ' ' : ''}CSHY-panel-header-item`,
        } as React.HTMLAttributes<HTMLElement>)
    }
}

/** Re-usable Dock-Panel Header, gives a `bg-base-300` bar with a horizontal flex to put widgets in.
 *
 * `NOTE`: It will automatically set the height of any child widgets.
 *
 * Example:
 *
 * ```
 * <PanelHeaderUI>
 *      <div tw='btn btn-sm'>Hello World!<div>
 * </PanelHeaderUI>
 * ```
 */
export const PanelHeaderUI = observer(function PanelHeaderUI_(p: { children?: ReactNode }) {
    let children = p.children
    if (p.children) {
        children = correctChildrenHeight(p.children)
    }
    return (
        <div // Container
            // This may be good to pass in the future? I don't think this really needs to/should be modifiable though.
            // className={p.className}
            tw={['CSHY-panel-header', 'flex select-none w-full', 'items-center p-1', 'bg-base-300']}
        >
            {children ?? <></>}
        </div>
    )
})
