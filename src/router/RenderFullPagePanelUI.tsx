import { observer } from 'mobx-react-lite'

import { Button } from '../rsuite/button/Button'
import { Frame } from '../rsuite/frame/Frame'
import { knownOKLCHHues } from '../rsuite/tinyCSS/knownHues'
import { useSt } from '../state/stateContext'
import { RenderPanelUI } from './RenderPanelUI'

export const RenderFullPagePanelUI = observer(function RenderFullPagePanelUI_(p: {}) {
    const st = useSt()
    const fpc = st.layout.fullPageComp
    if (fpc == null) return null
    return (
        <>
            <Button // generic close button in calse esc does not wrk
                tw='absolute top-1 right-1'
                look='primary'
                onClick={() => (st.layout.fullPageComp = null)}
                style={{ zIndex: 101 }}
                base={{ hue: knownOKLCHHues.success }}
                icon='mdiClose'
            ></Button>
            <div // full screen panel wrapper
                onKeyUp={(ev) => {
                    if (ev.key === 'Escape') {
                        st.layout.fullPageComp = null
                    }
                }}
                tw='absolute fade-in'
                style={{
                    top: 0,
                    left: '0',
                    height: '100%',
                    width: '100%',
                    zIndex: 100,
                }}
            >
                <Frame tw='h-full'>
                    {/* full screen panel content */}
                    <RenderPanelUI panel={fpc.panel} panelProps={fpc.props} />
                </Frame>
            </div>
        </>
    )
})
