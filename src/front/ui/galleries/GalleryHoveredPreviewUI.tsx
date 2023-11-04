import { observer } from 'mobx-react-lite'
import { CSSProperties } from 'react'
import { useDragLayer } from 'react-dnd'
import { useSt } from '../../FrontStateCtx'

export const GalleryHoveredPreviewUI = observer(function GalleryHoveredPreviewUI_(p: {}) {
    const st = useSt()
    const cccP = useDragLayer((monitor) => {
        if (monitor.isDragging()) return true
        return false
    })
    if (cccP) return null
    const hovered = st.hovered
    if (hovered == null) return null

    const extraProps: CSSProperties = st.showPreviewInFullScreen
        ? {
              maxHeight: st.showPreviewInFullScreen ? '100vh' : undefined,
              maxWidth: st.showPreviewInFullScreen ? '100vw' : undefined,
              width: '100%',
          }
        : {}

    return (
        <div>
            {/* BACKDROP */}
            {/* <div
                style={{
                    pointerEvents: 'none',
                    zIndex: 999998,
                    position: 'absolute',
                    inset: 0,
                    bottom: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    background: '#272727aa',
                }}
            ></div> */}
            {/* OVERLAY CONTAINER */}
            <div
                tw='ml-auto inset-0 text-center'
                style={{
                    opacity: 0.9,
                    boxShadow: '0 0 1rem 0 #ebebebe0',
                    pointerEvents: 'none',
                    position: 'absolute',
                    zIndex: 1050,
                    objectFit: 'contain',
                    maxHeight: '100vh',
                    maxWidth: '100vw',
                    // top: '5rem',
                    // left: '5rem',
                    // background: 'red',
                }}
            >
                {/* METADATA */}
                {/* <div className='absolute bottom-0 [background:#00000033] text-xs'>
                    <div className='flex whitespace-nowrap'>URL = {hovered.url}</div>
                    <div className='flex whitespace-nowrap'>downloaded = {hovered.data.downloaded ? '✅' : '❌'}</div>
                    <div className='flex whitespace-nowrap'>filename = {hovered.data.imageInfos?.filename ?? 'error'}</div>
                    <div className='flex whitespace-nowrap'>fpath = {hovered.localAbsolutePath}</div>
                    <div className='flex whitespace-nowrap'>promptID = {hovered.prompt.id}</div>
                </div> */}
                {/* IMAGE */}
                {hovered.type === 'video' ? (
                    <video
                        style={{
                            objectFit: 'contain',
                            ...extraProps,
                        }}
                        src={hovered.url}
                        controls
                        autoPlay
                        loop
                    />
                ) : (
                    <img
                        src={hovered.url}
                        style={{
                            objectFit: 'contain',
                            ...extraProps,
                        }}
                    />
                )}
                )
            </div>
        </div>
    )
})
