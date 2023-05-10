import { observer, useLocalObservable } from 'mobx-react-lite'
import { Maybe } from 'src/utils/types'
import { useSt } from '../front/stContext'
import { useMemo } from 'react'
import { LightBoxState, LightBoxUI } from './LightBox'
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
            <div className='flex gap-2 items-baseline'>
                Actions:
                {/* {st.pendingAsk} */}
                <Button>script 1</Button>
                <Button>script 2</Button>
                <Button>script 3</Button>
            </div>
            <Nav activeKey={'view'} onSelect={st.setActiveTab}>
                <Nav.Item eventKey='view' icon={<I.ViewsAuthorize />}>
                    Home
                </Nav.Item>
                <Nav.Item eventKey='paint'>Paint</Nav.Item>
                <Nav.Item eventKey='layer'>Layer</Nav.Item>
                <Nav.Item eventKey='SAM'>SAM</Nav.Item>
                {/* <Nav.Item eventKey='about'>About</Nav.Item> */}
            </Nav>
            <LightBoxUI lbs={lbs} inline />
        </>
    )
})
