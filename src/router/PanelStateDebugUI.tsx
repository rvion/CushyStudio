import type { PanelState } from './PanelState'

import { observer } from 'mobx-react-lite'

import { Frame } from '../csuite/frame/Frame'

export const PanelStateDebugUI = observer(function PanelStateDebugUI_(p: { panel: PanelState }) {
    const panel = p.panel
    return (
        <div>
            {/* <Frame as='pre' border base>
                json: {JSON.stringify(panel.node.toJson(), null, 2)}
            </Frame> */}
            <Frame as='pre' border base>
                config: {JSON.stringify(panel.getConfig(), null, 2)}
            </Frame>
            {/* <Frame as='pre' border base>
                extra: {JSON.stringify(panel.getExtraData(), null, 2)}
            </Frame> */}
        </div>
    )
})
