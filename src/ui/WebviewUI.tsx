import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { ButtonGroup, IconButton, Nav, Navbar } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { PGalleryUI } from '../panels/pGallery'
import { FlowLogUI } from './FlowLogUI'
import { PreviewListUI } from './PreviewListUI'
import { WorkflowPickerUI } from './WorkflowPickerUI'
import { ScrollablePaneUI } from './scrollableArea'

export const WebviewUI = observer(function WebviewUI_() {
    const st = useSt()

    return (
        <div className='col grow h100'>
            {/* HEADER */}
            <div>
                <Nav appearance='subtle' activeKey={st.activeTab} onSelect={st.setActiveTab}>
                    <Nav.Item eventKey='home'>Run</Nav.Item>
                    <Nav.Item eventKey='news'>Gallery</Nav.Item>
                    {/* <Nav.Item disabled eventKey='import'>
                        Import
                    </Nav.Item> */}
                    {/* <Nav.Item disabled eventKey='about'>
                        About
                        </Nav.Item>
                    <Nav.Item disabled eventKey='about'>
                    About
                </Nav.Item> */}
                    <WorkflowPickerUI />
                    <IconButton
                        icon={st.flowDirection === 'down' ? <I.SortDown /> : <I.SortUp />}
                        onClick={() => (st.flowDirection = st.flowDirection === 'down' ? 'up' : 'down')}
                    />
                    <IconButton
                        icon={st.showAllMessageReceived ? <I.InfoOutline /> : <I.EyeClose />}
                        onClick={() => (st.showAllMessageReceived = !st.showAllMessageReceived)}
                    />
                </Nav>
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
            <div style={{ background: 'black' }}>
                <PreviewListUI />
                {/* <Button
                    onClick={() => {
                        st.sendMessageToExtension({ type: 'say-hello', message: 'Hey there partner! 🤠' })
                    }}
                >
                    test!
                </Button> */}
            </div>
        </div>
    )
})
