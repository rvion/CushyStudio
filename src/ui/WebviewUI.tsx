import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { IconButton, Nav } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { FlowLogUI } from './FlowLogUI'
import { PreviewListUI } from './PreviewListUI'
import { WorkflowPickerUI } from './WorkflowPickerUI'
import { ScrollablePaneUI } from './scrollableArea'

export const WebviewUI = observer(function WebviewUI_() {
    const st = useSt()

    return (
        <div className='col grow h100'>
            <div>
                <Nav appearance='subtle' activeKey={st.activeTab} onSelect={st.setActiveTab}>
                    <Nav.Item eventKey='home'>🛋️</Nav.Item>
                    <WorkflowPickerUI />
                    <IconButton
                        icon={st.flowDirection === 'down' ? <I.SortDown /> : <I.SortUp />}
                        onClick={() => (st.flowDirection = st.flowDirection === 'down' ? 'up' : 'down')}
                    />
                    <IconButton
                        icon={st.showAllMessageReceived ? <I.InfoOutline /> : <I.EyeClose />}
                        onClick={() => (st.showAllMessageReceived = !st.showAllMessageReceived)}
                    />
                    <IconButton icon={<I.Reload />} onClick={() => window.location.reload()} />
                </Nav>
            </div>
            <PreviewListUI />

            {/* BODY */}
            <ScrollablePaneUI items={st.received}>
                <FlowLogUI />
            </ScrollablePaneUI>
        </div>
    )
})
