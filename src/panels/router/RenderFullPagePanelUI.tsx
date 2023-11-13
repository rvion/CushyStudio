import { observer } from 'mobx-react-lite'
import { useSt } from 'src/state/stateContext'
import { RenderPanelUI } from './RenderPanelUI'
import { Animation } from 'rsuite'

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
            tw='absolute'
            style={{
                top: 0,
                padding: '1rem',
                left: '0',
                height: '100%',
                width: '100%',
                backgroundColor: '#000000aa',
                // backgroundColor: '#4158D0',
                // backgroundImage: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
                zIndex: 100,
            }}
        >
            <div
                // className='fade-in'
                style={{
                    height: '100%', //'calc(100% - 4rem)',
                    boxShadow: '0 0 1rem black',
                    padding: '1rem',
                    borderRadius: '.5rem',
                    background: '#1e1e1e',
                }}
            >
                <RenderPanelUI widget={fpc.widget} widgetProps={fpc.extra} />
            </div>
        </div>
    )
})
