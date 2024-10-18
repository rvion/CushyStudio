import type { MediaImageL } from '../../models/MediaImage'

import { existsSync, type PathLike } from 'fs'
import { observer } from 'mobx-react-lite'

import { RevealUI } from '../../csuite/reveal/RevealUI'
import { ImageDropdownMenuUI } from '../../panels/ImageDropdownUI'
import { useImageDrag } from './dnd'
import { ImageErrorDisplayUI } from './ImageErrorDisplayUI'

export const ImageUI = observer(function ImageUI_({
    size,
    img,
    onClick,
    className,
    style,
    // blurred,
    ...rest
}: {
    size: number /* px */
    img: MediaImageL | MediaImageID
    onClick?: (img: MediaImageL) => void
    className?: string
    // blurred?: boolean
    style?: React.CSSProperties
}) {
    const image = typeof img === 'string' ? cushy.db.media_image.get(img) : img
    const ImageWidth = `${size}px`

    if (image == null) {
        return <div style={{ width: ImageWidth, height: ImageWidth }}>❌</div>
    }

    const [{ opacity }, dragRef] = useImageDrag(image! /* 🔴 */)
    const IMG = (
        <img
            className={className}
            tw='object-contain bg-contain bg-no-repeat bg-center'
            // src={image.url}
            src={image.urlForSize(size)}
            onMouseEnter={image.onMouseEnter}
            onMouseLeave={image.onMouseLeave}
            onClick={onClick ? (): void => void onClick(image) : image.onClick}
            onAuxClick={(ev) => {
                if (ev.button === 1) return image.onMiddleClick()
                if (ev.button === 2) return image.onRightClick()
            }}
            ref={dragRef}
            style={{
                // not really necessary; let's just keep the bare minimum to make things faster
                // backgroundImage: `url(${image.thumbhashURL})`,
                width: ImageWidth,
                height: ImageWidth,
                // filter: blurred ? 'blur(10px)' : undefined,
                opacity,
                ...style,
            }}
            {...rest}
        />
    )

    if (image.existsLocally && !existsSync(image?.absPath as PathLike))
        return (
            <ImageErrorDisplayUI //
                className='hover:border-transparent'
                icon={'folder'}
            />
        )

    return (
        <RevealUI //
            trigger='rightClick'
            relativeTo='mouse'
            content={() => <ImageDropdownMenuUI img={image} />}
            children={IMG}
        />
    )
})
