import { observer } from 'mobx-react-lite'
import { ImageInfos } from 'src/core/GeneratedImageSummary'
import { useSt } from '../../front/FrontStateCtx'
import { ItemTypes } from './ItemTypes'
import { useDrag } from 'react-dnd'

export const GalleryImageUI = observer(function ImageUI_(p: { img: ImageInfos }) {
    const img = p.img
    const st = useSt()
    const [{ opacity }, dragRef] = useDrag(
        () => ({
            type: ItemTypes.Image,
            item: { img },
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.5 : 1,
            }),
        }),
        [],
    )
    return (
        <>
            <img
                ref={dragRef}
                loading='lazy'
                onMouseEnter={() => (st.hovered = img)}
                onMouseLeave={() => {
                    if (st.hovered === img) st.hovered = null
                }}
                style={{ objectFit: 'contain', width: '64px', height: '64px', opacity, padding: '0.1rem' }}
                onClick={() => (st.lightBox.opened = true)}
                src={img.localURL ?? img.comfyURL}
            />
        </>
    )
})
