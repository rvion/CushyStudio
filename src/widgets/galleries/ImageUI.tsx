import type { MediaImageL } from 'src/models/MediaImage'

import { observer } from 'mobx-react-lite'

import { useSt } from '../../state/stateContext'
import { useImageDrag } from './dnd'
import { hasMod } from 'src/app/shortcuts/META_NAME'
import { ImageDropdownMenuUI } from 'src/panels/ImageDropdownUI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { PathLike, existsSync } from 'fs'

export const ImageUI = observer(function ImageUI_(p: {
    //
    size?: string
    img: MediaImageL | MediaImageID
    className?: string
}) {
    const st = useSt()
    const image = typeof p.img === 'string' ? st.db.media_image.get(p.img) : p.img

    const ImageWidth = p.size ?? st.gallerySizeStr
    const [{ opacity }, dragRef] = useImageDrag(image! /* 🔴 */)

    if (image == null) return <div style={{ width: ImageWidth, height: ImageWidth }}>❌</div>

    const IMG = (
        <img
            className={p.className}
            src={
                st.galleryConf.fields.onlyShowBlurryThumbnails.value //
                    ? image.thumbnail
                    : image.url
            }
            ref={dragRef}
            loading='lazy'
            style={{
                objectFit: 'contain',
                width: ImageWidth,
                height: ImageWidth,
                opacity,
                borderRadius: '.5rem',
            }}
            onMouseDown={(ev) => {
                // Middle Mouse
                if (ev.button == 1) {
                    ev.stopPropagation()
                    ev.preventDefault()
                    return st.layout.FOCUS_OR_CREATE('Image', { imageID: image.id })
                }
            }}
            onClick={(ev) => {
                if (hasMod(ev)) {
                    ev.stopPropagation()
                    ev.preventDefault()
                    return st.layout.FOCUS_OR_CREATE('Image', { imageID: image.id })
                }
                if (ev.shiftKey) {
                    ev.stopPropagation()
                    ev.preventDefault()
                    return st.layout.FOCUS_OR_CREATE('Canvas', { imgID: image.id })
                }
                if (ev.altKey) {
                    ev.stopPropagation()
                    ev.preventDefault()
                    return st.layout.FOCUS_OR_CREATE('Paint', { imgID: image.id })
                }

                return
            }}
        />
    )
    // )
    return (
        <RevealUI tw='flex w-full h-full items-center'>
            {!image ? (
                <ImageErrorDisplayUI className='hover:border-transparent' icon={'database'} />
            ) : image.existsLocally && !existsSync(image?.absPath as PathLike) ? (
                <ImageErrorDisplayUI className='hover:border-transparent' icon={'folder'} />
            ) : (
                <div>{IMG}</div>
            )}
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
