import { observer } from 'mobx-react-lite'
import { useDragLayer } from 'react-dnd'
import { OutputUI } from 'src/outputs/OutputUI'
import { useSt } from '../../state/stateContext'

export const GalleryHoveredPreviewUI = observer(function GalleryHoveredPreviewUI_(p: {}) {
    const st = useSt()
    const cccP = useDragLayer((monitor) => {
        if (monitor.isDragging()) return true
        return false
    })
    if (cccP) return null
    const hovered = st.hovered
    if (hovered == null) return null
    if (st.showPreviewInPanel) return null

    return (
        <div>
            {/* OVERLAY CONTAINER */}
            <div
                tw='ml-auto inset-0 text-center'
                style={{
                    opacity: st.galleryConf.get('galleryHoverOpacity') ?? 0.9, //.galleryHoverOpacity,
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
                <OutputUI output={hovered} />
            </div>
        </div>
    )
})
