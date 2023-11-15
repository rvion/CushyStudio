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
            <div
                style={{
                    height: '100%', //'calc(100% - 4rem)',
                    boxShadow: '0 0 1rem black',
                    padding: '1rem',
                    background: '#1e1e1e',
                }}
            >
                <RenderPanelUI widget={fpc.widget} widgetProps={fpc.extra} />
            </div>
        </div>
    )
})
