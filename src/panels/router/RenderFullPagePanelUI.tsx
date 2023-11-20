import { observer } from 'mobx-react-lite'
import { useSt } from 'src/state/stateContext'
import { RenderPanelUI } from './RenderPanelUI'

export const RenderFullPagePanelUI = observer(function RenderFullPagePanelUI_(p: {}) {
    const st = useSt()
    const fpc = st.layout.fullPageComp
    if (fpc == null) return null
    return (
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
            <div tw='bg-base-100 h-full'>
                <RenderPanelUI panel={fpc.panel} panelProps={fpc.props} />
            </div>
        </div>
    )
})
