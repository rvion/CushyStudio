import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { IconButton, Nav } from 'rsuite'
import { useSt } from '../front/FrontStateCtx'
import { renderMessageFromExtensionAsEmoji } from '../types/MessageFromExtensionToWebview'
import { WorkspaceUI } from './workspace/FlowLogUI'
import { VerticalGalleryUI } from './galleries/Gallery2UI'
import { GalleryHoveredPreviewUI } from './galleries/GalleryHoveredPreviewUI'
import { ScrollablePaneUI } from './scrollableArea'
import { PaintUI } from './widgets/PaintUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    return (
        <Nav appearance='subtle' activeKey={st.activeTab} onSelect={st.setActiveTab}>
            <Nav.Item eventKey='home'>🛋️</Nav.Item>
            <IconButton
                icon={st.flowDirection === 'down' ? <I.SortDown /> : <I.SortUp />}
                onClick={() => (st.flowDirection = st.flowDirection === 'down' ? 'up' : 'down')}
            />
            <IconButton
                icon={st.showAllMessageReceived ? <I.InfoOutline /> : <I.EyeClose />}
                onClick={() => (st.showAllMessageReceived = !st.showAllMessageReceived)}
            />
            <IconButton icon={<I.Reload />} onClick={() => window.location.reload()} />
            <IconButton icon={st.cushyStatus?.connected ? <I.CheckRound color='green' /> : <I.ExpiredRound color='red' />} />
            <IconButton onClick={() => st.db.reset()} icon={<I.Trash color='orange' />} />
        </Nav>
    )
})
export const WebviewUI = observer(function WebviewUI_() {
    const st = useSt()

    const action = st.currentAction
    return (
        <div className='col grow h100'>
            <AppBarUI />
            <div className='flex flex-grow'>
                <VerticalGalleryUI />
                {/* BODY */}
                {/* {st.currentAction === 'home' ? <FooUI /> : null} */}
                {/* <ProjectGalleryUI /> */}
                {/* <div className='flex-grow basis-1 flex flex-col'>
                        <FooUI />
                    </div> */}
                {/* <div className='flex-grow'>bar</div> */}
                {/* <div className='flex flex-row flex-grow '> */}
                <ScrollablePaneUI items={st.received} className='shrink-0 flex-grow'>
                    <GalleryHoveredPreviewUI />
                    {action == null ? ( //
                        <WorkspaceUI />
                    ) : action.type === 'paint' ? (
                        <PaintUI uri={action.img.localURL ?? action.img.comfyURL ?? '🔴'} />
                    ) : (
                        <WorkspaceUI />
                    )}
                </ScrollablePaneUI>
            </div>

            {st.showAllMessageReceived ? <DebugMessagesUI /> : null}
        </div>
    )
})

export const DebugMessagesUI = observer(function DebugMessagesUI_(p: {}) {
    const st = useSt()
    return (
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
    )
})
