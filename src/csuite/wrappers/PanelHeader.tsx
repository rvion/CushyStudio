import type { IconName } from '../icons/icons'

import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { Frame } from '../frame/Frame'

/**
 * Re-usable Dock-Panel Header, gives a full width bar and a horizontal flex to put widgets in.
 *
 * `NOTE`: It will automatically set the height of any child widgets.
 *
 * Example:
 *
 * ```
 * <PanelHeaderUI>
 *      <Button>Hello World!<Button>
 * </PanelHeaderUI>
 * ```
 */
export const PanelHeaderUI = observer(function PanelHeaderUI_(p: {
    //
    className?: string
    title?: string
    icon?: IconName
    children?: ReactNode
}) {
    return (
        <Frame // Container
            className={p.className}
            base={8}
            tw={['CSHY-panel-header w-full', 'flex gap-1 select-none', 'items-center p-1']}
            onWheel={(event) => {
                event.currentTarget.scrollLeft += event.deltaY
                event.stopPropagation()
            }}
        >
            {p.title && <div>{p.title}</div>}
            {p.children}
        </Frame>
    )
})
