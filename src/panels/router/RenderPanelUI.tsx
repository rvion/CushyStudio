import type * as FL from 'flexlayout-react'

import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { ErrorBoundaryUI } from '../../rsuite/errors/ErrorBoundaryUI'
import { Frame } from '../../rsuite/frame/Frame'
import { Message } from '../../rsuite/shims'
import { PanelNames, panels } from './PANELS'
import { panelContext } from './usePanel'

export const RenderPanelUI = observer(function RenderPanelUI_(p: {
    //
    node?: FL.TabNode
    panel: PanelNames
    panelProps: any
}) {
    const { panel, panelProps, node } = p

    // -----------------------
    // Those 3 lines allow to unmount the component when it's not visible
    const [visible, setVisible] = useState(() => node?.isVisible() ?? true)
    p.node?.setEventListener('visibility', (e: { visible: boolean }) => setVisible(e.visible))
    if (!visible) return null
    // -----------------------

    // 3. get panel definition
    const panelDef = (panels as any)[panel]
    if (panelDef == null)
        return (
            <Message type='error' showIcon>
                no panel definition for {panel}
            </Message>
        )

    const Component = panelDef.widget
    const panelID = p.node?.getId()

    // 2024-06-03 not sure if that case can happen
    if (panelID == null)
        return (
            <Message type='error' showIcon>
                Panel have no ID
            </Message>
        )

    return (
        <ErrorBoundaryUI>
            <panelContext.Provider value={{ id: panelID }}>
                <Frame
                    //
                    tw='flex-1 h-full w-full overflow-scroll' // overflow-auto to only show scrollbar when needed
                    className={`Region-${panel}`}
                    data-panel-id={panelID}
                    id={panelID}
                >
                    <Component {...panelProps} className='w-full h-full border-none' />
                </Frame>
            </panelContext.Provider>
        </ErrorBoundaryUI>
    )
})
