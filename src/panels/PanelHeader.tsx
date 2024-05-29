import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { Box } from '../theme/colorEngine/Box'

/** Re-usable Dock-Panel Header, gives a full width bar and a horizontal flex to put widgets in.
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
    children?: ReactNode
}) {
    return (
        <Box // Container
            base={8}
            tw={['CSHY-panel-header w-full', 'flex gap-1 select-none', 'items-center p-1']}
            onWheel={(event) => {
                event.currentTarget.scrollLeft += event.deltaY
                event.stopPropagation()
            }}
        >
            {p.children}
        </Box>
    )
})
