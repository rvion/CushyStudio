import type { MediaImageL } from 'src/models/MediaImage'
import { observer } from 'mobx-react-lite'
import { RevealUI } from 'src/rsuite/RevealUI'
import { Button } from 'src/rsuite/shims'
import { useSt } from '../../state/stateContext'
import { useImageDrag } from './dnd'

export const ImageUI = observer(function ImageUI_(p: { size?: string; img: MediaImageL | MediaImageID }) {
    const st = useSt()
    const image = typeof p.img === 'string' ? st.db.media_images.get(p.img) : p.img

    const ImageWidth = p.size ?? st.gallerySizeStr
    const [{ opacity }, dragRef] = useImageDrag(image! /* 🔴 */)

    if (image == null) return <div style={{ width: ImageWidth, height: ImageWidth }}>❌</div>

    // const IMG =
    //     image.data.infos?.type === 'video-local-ffmpeg' ? (
    //         <video
    //             //
    //             onMouseEnter={(ev) => (st.hovered = { type: 'video', url: image.url })}
    //             onMouseLeave={() => {
    //                 if (st.hovered?.url === image.url) st.hovered = null
    //             }}
    //             style={{ width: ImageWidth, height: ImageWidth }}
    //             src={image.url}
    //         ></video>
    //     ) : (
    const IMG = (
        <img
            src={image.url}
            ref={dragRef}
            loading='lazy'
            // onMouseEnter={(ev) => (st.hovered = { type: 'image', url: image.url })}
            // onMouseLeave={() => {
            //     if (st.hovered?.url === image.url) st.hovered = null
            // }}
            style={{
                objectFit: 'contain',
                width: ImageWidth,
                height: ImageWidth,
                opacity,
                padding: '0.2rem',
                borderRadius: '.5rem',
            }}
            onClick={() => st.layout.FOCUS_OR_CREATE('Image', { imageID: image.id })}
        />
    )
    // )
    return (
        <RevealUI enableRightClick>
            <div>{IMG}</div>
            <div>
                <Button
                    icon={<span className='material-symbols-outlined'>edit</span>}
                    onClick={() => st.layout.FOCUS_OR_CREATE('Paint', { imgID: image.id })}
                >
                    Paint
                </Button>
            </div>
        </RevealUI>
    )
})

export const PlaceholderImageUI = observer(function PlaceholderImageUI_(p: {}) {
    const st = useSt()
    const GalleryImageWidth = st.configFile.value.galleryImageSize ?? 48
    return (
        <div
            className='scale-in-center'
            style={{
                objectFit: 'contain',
                width: GalleryImageWidth,
                height: GalleryImageWidth,
                padding: '0.2rem',
                borderRadius: '.5rem',
            }}
        />
    )
})
