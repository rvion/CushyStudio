import type { MediaImageL } from 'src/models/MediaImage'
import { observer } from 'mobx-react-lite'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { Button } from 'src/rsuite/shims'
import { useSt } from '../../state/stateContext'
import { useImageDrag } from './dnd'
import { ImageDropdownMenuUI } from 'src/panels/ImageDropdownUI'

export const ImageUI = observer(function ImageUI_(p: {
    //
    size?: string
    img: MediaImageL | MediaImageID | null
    className?: string
}) {
    const st = useSt()
    const image = typeof p.img === 'string' ? st.db.media_images.get(p.img) : p.img

    const ImageWidth = p.size ?? st.gallerySizeStr
    const [{ opacity }, dragRef] = useImageDrag(image! /* 🔴 */)

    if (image == null) return <div style={{ width: ImageWidth, height: ImageWidth }}>❌</div>

    const IMG = (
        <img
            className={p.className}
            src={image.url}
            ref={dragRef}
            loading='lazy'
            style={{
                objectFit: 'contain',
                width: ImageWidth,
                height: ImageWidth,
                opacity,
                // padding: '0.2rem',
                borderRadius: '.5rem',
            }}
            onClick={() => st.layout.FOCUS_OR_CREATE('Image', { imageID: image.id })}
        />
    )
    // )
    return (
        <RevealUI disableHover>
            <div>{IMG}</div>
            <ul tabIndex={0} tw='shadow menu dropdown-content z-[1] bg-base-100 rounded-box'>
                <ImageDropdownMenuUI img={image} />
            </ul>
            {/* <ul tw='shadow menu dropdown-content z-[1] bg-base-100 rounded-box'>
                <li className='_MenuItem' onClick={() => image.useAsDraftIllustration()}>
                    <div className='flex items-center gap-2'>
                        <span className='material-symbols-outlined'>image</span>
                        Use as draft illustration
                    </div>
                </li>
                <li className='_MenuItem' onClick={() => st.layout.FOCUS_OR_CREATE('Paint', { imgID: image.id })}>
                    <div className='flex items-center gap-2'>
                        <span className='material-symbols-outlined'>edit</span>
                        Paint
                    </div>
                </li>
            </ul> */}
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
                padding: 0,
                borderRadius: '.5rem',
            }}
        />
    )
})
