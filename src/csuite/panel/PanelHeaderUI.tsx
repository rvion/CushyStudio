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
export const PanelHeaderUI = observer(function PanelHeader(p: {
    //
    className?: string
    title?: string
    icon?: IconName
    children?: ReactNode
}) {
    return (
        <Frame // Container
            className={p.className}
            base={{ contrast: 0.08 /* hueShift: 100 */ /* chromaBlend: 2 */ }}
            tw={[
                //
                'sticky top-0 [z-index:999]',
                'h-widget px-0.5',
                'UI-PanelHeader',
                'CSHY-panel-header',
                'flex gap-1 select-none',
                'overflow-auto',
                'items-center',
                // 'flex-wrap',
            ]}
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
