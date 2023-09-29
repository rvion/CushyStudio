import { observer } from 'mobx-react-lite'
import { useSt } from '../../FrontStateCtx'
import { AppBarUI } from './AppBarUI'
import { MainNavBarUI } from './MainNavBarUI'
import { ProjectUI } from './ProjectUI'

export const CushyUI = observer(function CushyUI_() {
    const st = useSt()
    return (
        <div className='col grow h100'>
            <AppBarUI />
            <div className='flex flex-grow'>
                <MainNavBarUI />
                <ProjectUI />
            </div>
            {/* {st.showAllMessageReceived ? <DebugMessagesUI /> : null} */}
            {/* <pre>{JSON.stringify(st.db.store)}</pre> */}
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
