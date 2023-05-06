import { observer, useLocalObservable } from 'mobx-react-lite'
import { Maybe } from 'src/utils/types'
import { useSt } from '../core-front/stContext'

export const PreviewListUI = observer(function PreviewListUI_(p: {}) {
    const st = useSt()
    const uiSt = useLocalObservable(() => ({ hovered: null as Maybe<string> }))
    return (
        <div style={{ display: 'flex', overflowX: 'auto', width: '100%' }}>
            {st.imageURLs.map((i, ix) => (
                <img
                    onMouseEnter={() => (uiSt.hovered = i)}
                    onMouseLeave={() => {
                        if (uiSt.hovered === i) uiSt.hovered = null
                    }}
                    style={{ objectFit: 'contain', width: '32px', height: '32px' }}
                    key={i}
                    src={i}
                />
            ))}
            {uiSt.hovered && (
                <>
                    <div
                        style={{
                            pointerEvents: 'none',
                            zIndex: 999998,
                            position: 'absolute',
                            inset: 0,
                            bottom: 0,
                            top: '5rem',
                            left: 0,
                            right: 0,
                            background: '#272727aa',
                        }}
                    ></div>
                    <img
                        src={uiSt.hovered}
                        style={{
                            //
                            top: '5rem',
                            left: 0,
                            position: 'absolute',
                            zIndex: 999999,
                            objectFit: 'contain',
                            maxHeight: '100vh',
                            maxWidth: '100vw',
                        }}
                    />
                </>
            )}
        </div>
    )
})
