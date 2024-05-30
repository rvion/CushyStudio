import type * as FL from 'flexlayout-react'

import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { BoxUI } from '../../rsuite/box/BoxUI'
import { ErrorBoundaryUI } from '../../rsuite/errors/ErrorBoundaryUI'
import { Message } from '../../rsuite/shims'
import { PanelNames, panels } from './PANELS'

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
    return (
        <ErrorBoundaryUI>
            <BoxUI
                //
                tw='flex-1 h-full w-full overflow-auto'
                className={`Region-${panel}`}
                data-panel-id={panelID}
                id={panelID}
            >
                <Component {...panelProps} className='w-full h-full border-none' />
            </BoxUI>
        </ErrorBoundaryUI>
    )
})
