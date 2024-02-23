import type * as FL from 'flexlayout-react'

import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { PanelNames, panels } from './PANELS'
import { Message } from 'src/rsuite/shims'
import { ErrorBoundaryFallback } from 'src/widgets/misc/ErrorBoundary'

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
    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
            <Component {...panelProps} className='w-full h-full border-none' />
        </ErrorBoundary>
    )
})
