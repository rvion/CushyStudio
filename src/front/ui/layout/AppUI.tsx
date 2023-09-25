import type { UIAction } from 'src/front/UIAction'

import { observer } from 'mobx-react-lite'
import * as I from '@rsuite/icons'
import { useSt } from '../../FrontStateCtx'
import { GalleryHoveredPreviewUI } from '../galleries/GalleryHoveredPreviewUI'
import { VerticalGalleryUI } from '../galleries/VerticalGalleryUI'
import { ScrollablePaneUI } from '../scrollableArea'
import { WorkspaceUI } from '../workspace/WorkspaceUI'
import { AppBarUI } from './AppBarUI'
import { WidgetPaintUI } from '../widgets/WidgetPaintUI'
import { Nav } from 'rsuite'
import { ComfyUIUI } from '../workspace/ComfyUIUI'

export const CushyUI = observer(function CushyUI_() {
    const st = useSt()
    const action = st.action
    return (
        <div className='col grow h100'>
            <AppBarUI />
            <div className='flex flex-grow p-1'>
                <Nav
                    //
                    activeKey={st.action.type}
                    onSelect={(k: UIAction['type']) => {
                        if (k === 'comfy') return st.setAction({ type: 'comfy' })
                        if (k === 'form') return st.setAction({ type: 'form' })
                        if (k === 'paint') return st.setAction({ type: 'paint' })
                    }}
                    className='text-xl'
                    appearance='tabs'
                    vertical
                >
                    {/* FORM */}
                    <Nav.Item eventKey='form'>
                        <div>1 🛋️</div>
                    </Nav.Item>
                    {/* PAINT */}
                    <Nav.Item eventKey='paint'>
                        2 <I.Image />
                    </Nav.Item>
                    {/* COMFY */}
                    <Nav.Item eventKey='comfy'>
                        3 <I.Branch />
                    </Nav.Item>
                    {/* CONFIG */}
                    <Nav.Item eventKey='config'>
                        4 <I.Gear />
                    </Nav.Item>
                </Nav>
                <VerticalGalleryUI />
                <ScrollablePaneUI
                    //
                    // style={{ borderLeft: '2px solid #383854' }}
                    className='shrink-0 flex-grow'
                >
                    <GalleryHoveredPreviewUI />
                    {action == null ? ( //
                        <WorkspaceUI />
                    ) : action.type === 'paint' ? (
                        <WidgetPaintUI action={action} />
                    ) : action.type === 'comfy' ? (
                        <ComfyUIUI action={action} />
                    ) : (
                        <WorkspaceUI />
                    )}
                </ScrollablePaneUI>
            </div>
            {/* {st.showAllMessageReceived ? <DebugMessagesUI /> : null} */}
            {/* <pre>{JSON.stringify(st.db.store)}</pre> */}
        </div>
    )
})
export const ScrollableUI = observer(function ScrollableUI_(p: { children: React.ReactNode }) {
    return (
        <div className='relative flex-1 '>
            <div className='inset-0 scrollable'>{p.children}</div>
        </div>
    )
})
// export const DebugMessagesUI = observer(function DebugMessagesUI_(p: {}) {
//     const st = useSt()
//     return (
//         <div className='shadow-xl' style={{ height: '10rem', resize: 'horizontal', overflow: 'auto' }}>
//             {st.msgGroupper.itemsToShow.map((msg, ix) => (
//                 <div key={msg.uid} className='w-full flex gap-2' id={msg.uid.toString()}>
//                     <div style={{ width: '1rem' }}>{renderMessageFromExtensionAsEmoji(msg)}</div>
//                     <div className='shrink-0' style={{ width: '5rem' }}>
//                         {msg.type}
//                     </div>
//                     <div style={{ color: 'gray', textOverflow: 'ellipsis' }}>
//                         {/*  */}
//                         {JSON.stringify(msg)}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     )
// })
