import type { MediaImageL } from 'src/models/MediaImage'

import { observer } from 'mobx-react-lite'

import { useSt } from '../../state/stateContext'
import { useImageDrag } from './dnd'
import { ImageDropdownMenuUI } from 'src/panels/ImageDropdownUI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'

type NumberStr = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0'
type SmolNum = NumberStr | `${NumberStr}${NumberStr}`
type SmolSize = `${SmolNum}rem` | `${SmolNum}em` | `${SmolNum}px`

export const ImageUI = observer(function ImageUI_(p: {
    size?: SmolSize | '100%' | number /* px */
    img: MediaImageL | MediaImageID
    className?: string
}) {
    const st = useSt()
    const ImageWidth =
        typeof p.size === 'number' //
            ? `${p.size}px`
            : p.size ?? st.gallerySizeStr

    // get image
    const image = typeof p.img === 'string' ? st.db.media_image.get(p.img) : p.img

    // abort if image missing
    if (image == null) return <div style={{ width: ImageWidth, height: ImageWidth }}>❌</div>

    // ugly code; very wtf
    const ImageWidthPx = ((x: string | number) => {
        if (typeof x === 'number') return x
        if (x === '100%') return 1000
        if (x.endsWith('px')) return parseInt(x.slice(0, -2), 10)
        if (x.endsWith('rem')) return parseInt(x.slice(0, -3), 10) * 16
        if (x.endsWith('em')) return parseInt(x.slice(0, -2), 10) * 16
        return 50
    })(p.size ?? st.gallerySizeStr)

    const [{ opacity }, dragRef] = useImageDrag(image! /* 🔴 */)

    const IMG = (
        <img
            className={p.className}
            tw='object-contain bg-contain bg-no-repeat bg-center'
            src={image.urlForSize(ImageWidthPx)}
            onMouseEnter={image.onMouseEnter}
            onMouseLeave={image.onMouseLeave}
            onClick={image.onClick}
            // onAuxClick={image.onAuxClick}
            ref={dragRef}
            loading='lazy'
            style={{ backgroundImage: `url(${image.thumbhashURL})`, width: ImageWidth, height: ImageWidth, opacity }}
        />
    )
    return (
        <RevealUI>
            {IMG}
            <ul tabIndex={0} tw='shadow menu dropdown-content z-[1] bg-base-100 rounded-box'>
                <ImageDropdownMenuUI img={image} />
            </ul>
        </RevealUI>
    )
})

// onMouseDown={(ev) => {
//     // Middle Mouse
//     if (ev.button == 1) {
//         ev.stopPropagation()
//         ev.preventDefault()
//         return st.layout.FOCUS_OR_CREATE('Image', { imageID: image.id })
//     }
// }}

export const PlaceholderImageUI = observer(function PlaceholderImageUI_(p: {}) {
    const st = useSt()
    const GalleryImageWidth = st.galleryConf.value.gallerySize
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
