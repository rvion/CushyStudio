import { Image, Label, Slider } from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'
import { CushyImage } from '../../core/CushyImage'
import { useLayout } from '../layout/LayoutCtx'
import { useSt } from '../stContext'

export const PGalleryUI = observer(function PGalleryUI_(p: {}) {
    const client = useSt()
    const layout = useLayout()
    const images: CushyImage[] = client.scripts.flatMap((p) => p.runs).flatMap((r) => r.gallery)

    return (
        <div>
            <div className='row'>
                <Label>Size</Label>
                <Slider
                    onChange={(e) => (layout.gallerySize = parseInt(e.target.value, 10))}
                    value={layout.gallerySize}
                    max={1000}
                    min={32}
                />
                <div>{layout.gallerySize}px</div>
            </div>
            <div className='row wrap gap'>
                {images.length === 0 ? <>No image yet; start generating !</> : null}
                {images.map((i) => (
                    <Image
                        //
                        onClick={() => (layout.galleryFocus = i)}
                        key={i.uid}
                        src={i.url}
                        width={layout.gallerySize}
                        height={layout.gallerySize}
                    />
                ))}
            </div>
        </div>
    )
})
