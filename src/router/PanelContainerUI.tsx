import type * as FL from 'flexlayout-react'

import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'

import { ErrorBoundaryUI } from '../csuite/errors/ErrorBoundaryUI'
import { Frame } from '../csuite/frame/Frame'
import { Message } from '../csuite/inputs/shims'
import { PanelName, panels } from './PANELS'
import { PanelState } from './PanelState'
import { PanelStateByNode } from './PanelStateByNode'
import { panelContext } from './usePanel'

/** internal component; do not use yourself */
export const PanelContainerUI = observer(function PanelContainer(p: {
    //
    node: FL.TabNode
    panel: PanelName
    panelProps: any
}) {
    const { panel, panelProps, node } = p

    const panelID = p.node.getId()
    const panelState = useMemo(() => {
        const ps = new PanelState(node, panelID)
        // PanelStateById.set(panelID, ps)
        PanelStateByNode.set(panelID, ps)
        return ps
    }, [node, panelID])

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
    return (
        <ErrorBoundaryUI>
            <panelContext.Provider value={panelState}>
                <Frame
                    //
                    col
                    tw={[
                        //
                        'flex-1 h-full w-full',
                        'overflow-auto', // overflow-auto to only show scrollbar when needed
                        // 'overflow-scroll',
                    ]}
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
