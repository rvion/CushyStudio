import type { MediaImageL } from '../../models/MediaImage'

import { existsSync, type PathLike } from 'fs'
import { observer } from 'mobx-react-lite'

import { ImageDropdownMenuUI } from '../../panels/ImageDropdownUI'
import { RevealUI } from '../../rsuite/reveal/RevealUI'
import { useSt } from '../../state/stateContext'
import { useImageDrag } from './dnd'

type NumberStr = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type NumberStrExcept0 = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type SmolNum = NumberStr | `${NumberStrExcept0}${NumberStr}`
type SmolSize = `${SmolNum}rem` | `${SmolNum}em` | `${SmolNum}px`
// =======
// import { hasMod } from 'src/app/shortcuts/META_NAME'
// import { ImageDropdownMenuUI } from 'src/panels/ImageDropdownUI'
// import { RevealUI } from 'src/rsuite/reveal/RevealUI'
// import { PathLike, existsSync } from 'fs'
// >>>>>>> form-cleanup

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
        <RevealUI
            tw='flex w-full h-full items-center'
            content={() => (
                <ul tabIndex={0} tw='shadow menu dropdown-content z-[1] bg-base-100 rounded-box'>
                    <ImageDropdownMenuUI img={image} />
                </ul>
            )}
        >
            {!image ? (
                <ImageErrorDisplayUI className='hover:border-transparent' icon={'database'} />
            ) : image.existsLocally && !existsSync(image?.absPath as PathLike) ? (
                <ImageErrorDisplayUI className='hover:border-transparent' icon={'folder'} />
            ) : (
                <div>{IMG}</div>
            )}

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

// onMouseDown={(ev) => {
//     // Middle Mouse
//     if (ev.button == 1) {
//         ev.stopPropagation()
//         ev.preventDefault()
//         return st.layout.FOCUS_OR_CREATE('Image', { imageID: image.id })
//     }
// }}

export const ImageErrorDisplayUI = observer(function ImageErrorDisplayUI_(p: {
    className?: string
    icon: string
    size?: string
}) {
    return (
        <div
            className={p.className}
            tw='relative rounded flex flex-col w-full h-full border border-error border-dotted items-center justify-center bg-error/5 text-error select-none pointer-events-none'
        >
            <div tw='flex relative text-sm' style={{ fontSize: p.size ?? 'inherit' }}>
                <span className='material-symbols-outlined'>scan_delete</span>
            </div>
            <div tw='absolute top-0 right-0 -translate-x-0.5 translate-y-0.5' style={{ fontSize: '0px' }}>
                {p.icon && (
                    <span className='material-symbols-outlined' style={{ fontSize: '12px' }}>
                        {p.icon}
                    </span>
                )}
            </div>
        </div>
    )
})

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
