import type { MediaImageL } from '../../models/MediaImage'

import { existsSync, type PathLike } from 'fs'
import { observer } from 'mobx-react-lite'

import { RevealUI } from '../../csuite/reveal/RevealUI'
import { ImageDropdownMenuUI } from '../../panels/ImageDropdownUI'
import { useSt } from '../../state/stateContext'
import { useImageDrag } from './dnd'
import { ImageErrorDisplayUI } from './ImageErrorDisplayUI'

type SmolSize = `${'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'}rem`

export const ImageSimpleUI = observer(function ImageSimple({
    size,
    img,
    onClick,
    className,
    ...rest
}: {
    size: SmolSize | '100%' | number /* px */
    img: MediaImageL | MediaImageID
    onClick?: (img: MediaImageL) => void
    className?: string
}) {
    // const LEGACY_ST_gallerySizeStr = '100px'
    // const st = useSt()
    const ImageWidth =
        typeof size === 'number' //
            ? `${size}px`
            : size // ?? LEGACY_ST_gallerySizeStr

    // get image
    const image = typeof img === 'string' ? cushy.db.media_image.get(img) : img

    // // abort if image missing
    if (image == null) return <div style={{ width: ImageWidth, height: ImageWidth }}>❌</div>

    // // ugly code; very wtf
    const ImageWidthPx = ((x: string | number): number => {
        if (typeof x === 'number') return x
        if (x === '100%') return 1000
        if (x.endsWith('px')) return parseInt(x.slice(0, -2), 10)
        if (x.endsWith('rem')) return parseInt(x.slice(0, -3), 10) * 16
        if (x.endsWith('em')) return parseInt(x.slice(0, -2), 10) * 16
        return 50
    })(size /* ?? LEGACY_ST_gallerySizeStr */)

    // const [{ opacity }, dragRef] = useImageDrag(image! /* 🔴 */)

    const IMG = (
        <img
            className={className}
            tw='object-contain bg-contain bg-no-repeat bg-center'
            // src={image.urlForSize(ImageWidthPx)}
            src={image.urlForSize(ImageWidthPx)}
            onMouseEnter={image.onMouseEnter}
            onMouseLeave={image.onMouseLeave}
            onClick={onClick ? (): void => void onClick(image) : image.onClick}
            onAuxClick={(ev) => {
                if (ev.button === 1) return image.onMiddleClick()
                if (ev.button === 2) return image.onRightClick()
            }}
            // ref={dragRef}
            style={{
                // backgroundImage: `url(${image.thumbhashURL})`,
                width: ImageWidth,
                height: ImageWidth,
                // opacity,
            }}
            {...rest}
        />
    )
    return IMG
})
