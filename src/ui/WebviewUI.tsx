import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Button, IconButton, Nav } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { PGalleryUI } from '../panels/pGallery'
import { PreviewListUI } from './PreviewListUI'
import { FlowLogUI } from './FlowLogUI'
import { ScrollablePaneUI } from './scrollableArea'
import * as I from '@rsuite/icons'
export const WebviewUI = observer(function WebviewUI_() {
    const st = useSt()

    return (
        <div className='col grow h100'>
            {/* HEADER */}
            <div style={{ background: '#ebebeb' }}>
                <Nav activeKey={st.activeTab} onSelect={st.setActiveTab}>
                    <Nav.Item eventKey='home'>Run</Nav.Item>
                    <Nav.Item eventKey='news'>Gallery</Nav.Item>
                    <Nav.Item disabled eventKey='import'>
                        Import
                    </Nav.Item>
                    <Nav.Item disabled eventKey='about'>
                        About
                    </Nav.Item>
                    <Nav.Item disabled eventKey='about'>
                        About
                    </Nav.Item>
                    {st.activeTab === 'home' ? (
                        <IconButton
                            icon={st.flowDirection === 'down' ? <I.SortDown /> : <I.SortUp />}
                            onClick={() => (st.flowDirection = st.flowDirection === 'down' ? 'up' : 'down')}
                            //
                        />
                    ) : null}
                </Nav>
                <PreviewListUI />
            </div>
            {/* BODY */}
            <ScrollablePaneUI>
                {st.activeTab === 'home' ? ( //
                    <FlowLogUI />
                ) : (
                    <PGalleryUI />
                )}
            </ScrollablePaneUI>
            {/* FOOTER */}
            <div>
                <Button
                    onClick={() => {
                        st.sendMessageToExtension({ type: 'say-hello', message: 'Hey there partner! 🤠' })
                    }}
                >
                    test!
                </Button>
            </div>
        </div>
    )
})
