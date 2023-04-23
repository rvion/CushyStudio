import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Button, Nav } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { PGalleryUI } from '../panels/pGallery'
import { PreviewListUI } from './PreviewListUI'
import { FlowLogUI } from './FlowLogUI'
import { ScrollablePaneUI } from './scrollableArea'

export const WebviewUI = observer(function WebviewUI_() {
    const st = useSt()

    const [activeTab, setActiveTab] = useState('home')

    return (
        <div className='col grow h100'>
            {/* // background: 'linear-gradient(45deg, #181b47, #494577)', */}
            {/* HEADER */}
            <div style={{ background: '#ebebeb' }}>
                <Nav activeKey={activeTab} onSelect={setActiveTab}>
                    <Nav.Item eventKey='home'>Run</Nav.Item>
                    <Nav.Item eventKey='news'>Gallery</Nav.Item>
                    <Nav.Item disabled eventKey='import'>
                        Import
                    </Nav.Item>
                    <Nav.Item disabled eventKey='about'>
                        About
                    </Nav.Item>
                </Nav>
                <PreviewListUI />
            </div>
            {/* BODY */}
            <ScrollablePaneUI>
                {activeTab === 'home' ? ( //
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
