import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { IconButton, Nav } from 'rsuite'
import { useSt } from '../front/stContext'
import { renderMessageFromExtensionAsEmoji } from '../types/MessageFromExtensionToWebview'
import { WorkflowPickerUI } from './WorkflowPickerUI'
import { FooUI } from './actions/x'
import { FlowLogUI } from './flow/FlowLogUI'
import { Gallery2UI } from './galleries/Gallery2UI'
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
                    <IconButton
                        icon={st.cushyStatus?.connected ? <I.CheckRound color='green' /> : <I.ExpiredRound color='red' />}
                    />
                </Nav>
            </div>

            <Gallery2UI />

            {/* BODY */}
            <div className='flex flex-row flex-grow '>
                <ScrollablePaneUI style={{ width: '30rem' }} items={st.received} className='shrink-0'>
                    <FlowLogUI />
                </ScrollablePaneUI>
                <div className='flex-grow basis-1 flex flex-col'>
                    {/* <ProjectGalleryUI /> */}
                    <FooUI />
                </div>
                {/* <div className='flex-grow'>bar</div> */}
            </div>
            {st.showAllMessageReceived ? (
                <div className='shadow-xl' style={{ height: '10rem', resize: 'horizontal', overflow: 'auto' }}>
                    {st.itemsToShow.map((msg, ix) => (
                        <div key={msg.uid} className='w-full flex gap-2' id={msg.uid.toString()}>
                            <div style={{ width: '1rem' }}>{renderMessageFromExtensionAsEmoji(msg)}</div>
                            <div className='shrink-0' style={{ width: '5rem' }}>
                                {msg.type}
                            </div>
                            <div style={{ color: 'gray', textOverflow: 'ellipsis' }}>
                                {/*  */}
                                {JSON.stringify(msg)}
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    )
})
