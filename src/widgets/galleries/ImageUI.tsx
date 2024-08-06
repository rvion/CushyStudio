import type { MediaImageL } from '../../models/MediaImage'

import { existsSync, type PathLike } from 'fs'
import { observer } from 'mobx-react-lite'

import { RevealUI } from '../../csuite/reveal/RevealUI'
import { ImageDropdownMenuUI } from '../../panels/ImageDropdownUI'
import { useSt } from '../../state/stateContext'
import { useImageDrag } from './dnd'
import { ImageErrorDisplayUI } from './ImageErrorDisplayUI'

type SmolSize = `${'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'}rem`

export const ImageUI = observer(function ImageUI_(p: {
    size?: SmolSize | '100%' | number /* px */
    img: MediaImageL | MediaImageID
    className?: string
}) {
    const LEGACY_ST_gallerySizeStr = '100px'
    const st = useSt()
    const ImageWidth =
        typeof p.size === 'number' //
            ? `${p.size}px`
            : p.size ?? LEGACY_ST_gallerySizeStr

    // get image
    const image = typeof p.img === 'string' ? st.db.media_image.get(p.img) : p.img

    // abort if image missing
    if (image == null) return <div style={{ width: ImageWidth, height: ImageWidth }}>❌</div>

    // ugly code; very wtf
    const ImageWidthPx = ((x: string | number): number => {
        if (typeof x === 'number') return x
        if (x === '100%') return 1000
        if (x.endsWith('px')) return parseInt(x.slice(0, -2), 10)
        if (x.endsWith('rem')) return parseInt(x.slice(0, -3), 10) * 16
        if (x.endsWith('em')) return parseInt(x.slice(0, -2), 10) * 16
        return 50
    })(p.size ?? LEGACY_ST_gallerySizeStr)

    const [{ opacity }, dragRef] = useImageDrag(image! /* 🔴 */)

    const IMG = (
        <img
            className={p.className}
            tw='object-contain bg-contain bg-no-repeat bg-center'
            src={image.urlForSize(ImageWidthPx)}
            onMouseEnter={image.onMouseEnter}
            onMouseLeave={image.onMouseLeave}
            onClick={image.onClick}
            onAuxClick={(ev) => {
                if (ev.button === 1) return image.onMiddleClick()
                if (ev.button === 2) return image.onRightClick()
            }}
            ref={dragRef}
            loading='lazy'
            style={{ backgroundImage: `url(${image.thumbhashURL})`, width: ImageWidth, height: ImageWidth, opacity }}
        />
    )
    return (
        <RevealUI
            tw='flex w-full h-full items-center'
            content={() => (
                <ul tabIndex={0} tw='shadow menu dropdown-content z-[1]  rounded-box'>
                    <ImageDropdownMenuUI img={image} />
                </ul>
            )}
        >
            {!image ? (
                <ImageErrorDisplayUI className='hover:border-transparent' icon={'database'} />
            ) : image.existsLocally && !existsSync(image?.absPath as PathLike) ? (
                <ImageErrorDisplayUI className='hover:border-transparent' icon={'folder'} />
            ) : (
                <div tw='flex w-full justify-center items-center'>{IMG}</div>
            )}
        </RevealUI>
    )
})
