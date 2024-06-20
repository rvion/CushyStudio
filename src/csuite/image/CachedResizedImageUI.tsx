import { observer } from 'mobx-react-lite'
import { CSSProperties, useState } from 'react'
import sharp from 'sharp'

import { ClassLike } from '../../utils/custom-jsx/global'
import { ImageErrorDisplayUI } from '../../widgets/galleries/ImageErrorDisplayUI'

/* XXX: Should only be temporary until a better system is made. */

/** Caches a resized version of an image, only updates if the size value has changed
 *
 * Example:
 *
 * ```
 *  <div><CachedResizedImage filePath={"/path/to/file"} size={48} /></div>
 * ```
 */
export const CachedResizedImage = observer(function CachedResizedImage_(p: {
    tw?: string | ClassLike[]
    className?: string
    filePath: string
    size: number
    style?: CSSProperties
}) {
    const [lastSize, setLastSize] = useState<number>(-1)
    const [cached, setCached] = useState<string>('')

    if (lastSize != p.size) {
        const image = sharp(p.filePath).resize(p.size, p.size, { fit: 'inside' })
        image
            .ensureAlpha()
            .png()
            .toBuffer((err, buffer, info) => {
                if (err) {
                    console.error(err)
                    return <ImageErrorDisplayUI icon='cached' />
                }

                setCached(`data:image/png;base64,${buffer.toString('base64')}`)
            })
        setLastSize(p.size)
    }

    return <img className={p.className} loading='lazy' tw={p.tw} style={p.style} src={cached} />
})
