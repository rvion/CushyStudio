import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

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
    return (
        <div // Container
            // This may be good to pass in the future? I don't think this really needs to/should be modifiable though.
            // className={p.className}
            tw={['CSHY-panel-header', 'flex select-none w-full', 'items-center p-1', 'bg-base-300']}
            onWheel={(event) => {
                event.currentTarget.scrollLeft += event.deltaY

                event.stopPropagation()
            }}
        >
            {p.children}
        </div>
    )
})
