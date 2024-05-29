import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { BoxUI } from '../rsuite/box/BoxUI'

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
export const PanelHeaderUI = observer(function PanelHeaderUI_(p: {
    //
    children?: ReactNode
}) {
    return (
        <BoxUI // Container
            base={8}
            tw={['CSHY-panel-header', 'flex gap-1 select-none', 'items-center p-1']}
            onWheel={(event) => {
                event.currentTarget.scrollLeft += event.deltaY
                event.stopPropagation()
            }}
        >
            {p.children}
        </BoxUI>
    )
})
