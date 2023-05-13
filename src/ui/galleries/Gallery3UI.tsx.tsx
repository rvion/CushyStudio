import { observer, useLocalObservable } from 'mobx-react-lite'
import { Maybe } from 'src/utils/types'
import { useSt } from '../../front/FrontStateCtx'
import { useMemo } from 'react'
import { LightBoxState, LightBoxUI } from '../LightBox'
import { Button, Nav } from 'rsuite'
import * as I from '@rsuite/icons'

export const ProjectGalleryUI = observer(function PreviewListUI_(p: {}) {
    const st = useSt()
    const uiSt = useLocalObservable(() => ({ hovered: null as Maybe<string> }))
    const lbs = useMemo(() => new LightBoxState(() => st.images, true), [])
    return (
        <>
            <div style={{ display: 'flex', overflowX: 'auto' }}>
                {/* request to focus next  */}
                <Button>next</Button>
                {st.images.map((img, ix) => (
                    <img
                        // onMouseEnter={() => (uiSt.hovered = i)}
                        // onMouseLeave={() => {
                        //     if (uiSt.hovered === i) uiSt.hovered = null
                        // }}
                        style={{ objectFit: 'contain', width: '64px', height: '64px' }}
                        // key={i}
                        onClick={() => (lbs.opened = true)}
                        src={img.comfyURL}
                    />
                ))}
                {/* {uiSt.hovered && (
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
                )} */}
            </div>
            <LightBoxUI lbs={lbs} inline />
        </>
    )
})
