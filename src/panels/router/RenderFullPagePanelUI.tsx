import { observer } from 'mobx-react-lite'

import { BoxUI } from '../../rsuite/box/BoxUI'
import { useSt } from '../../state/stateContext'
import { RenderPanelUI } from './RenderPanelUI'

export const RenderFullPagePanelUI = observer(function RenderFullPagePanelUI_(p: {}) {
    const st = useSt()
    const fpc = st.layout.fullPageComp
    if (fpc == null) return null
    return (
        <>
            {/* generic close button in calse esc does not wrk */}
            <div
                //
                tw='absolute top-1 right-1'
                onClick={() => {
                    st.layout.fullPageComp = null
                }}
                style={{ zIndex: 101 }}
            >
                <div tw='btn btn-subtle'>
                    <span className='material-symbols-outlined'>close</span>
                </div>
            </div>
            {/* full screen panel wrapper */}
            <div
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
                <BoxUI base={5} tw='h-full'>
                    {/* full screen panel content */}
                    <RenderPanelUI panel={fpc.panel} panelProps={fpc.props} />
                </BoxUI>
            </div>
        </>
    )
})
