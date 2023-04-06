import { Slider } from 'rsuite'
import { observer } from 'mobx-react-lite'
import { PromptOutputImage } from '../core/PromptOutputImage'
import { useLayout } from '../layout/LayoutCtx'
import { useWorkspace } from '../ui/WorkspaceContext'
import { Image } from '../ui/Image'

export const PGalleryUI = observer(function PGalleryUI_(p: {}) {
    const client = useWorkspace()
    const layout = useLayout()
    const images: PromptOutputImage[] = client.projects.flatMap((p) => p.runs).flatMap((r) => r.gallery)

    return (
        <div>
            <div className='row'>
                <label>Size</label>
                <Slider
                    onChange={(next) => (layout.gallerySize = next)}
                    value={layout.gallerySize}
                    max={1000}
                    min={32}
                    step={1}
                />
                <div>{layout.gallerySize}px</div>
            </div>
            <div className='row wrap gap'>
                {/* {images.length === 0 ? <>No image yet; start generating !</> : null} */}
                {images.map((i) => (
                    <Image
                        //
                        onClick={() => (layout.galleryFocus = i)}
                        key={i.uid}
                        src={i.comfyURL}
                        width={layout.gallerySize}
                        height={layout.gallerySize}
                    />
                ))}
            </div>
        </div>
    )
})
