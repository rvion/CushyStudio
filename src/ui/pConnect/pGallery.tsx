import { Image, Slider } from '@fluentui/react-components'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useLayout } from '../layout/CushyLayoutCtx'
import { useSt } from '../stContext'

export const PGalleryUI = observer(function PGalleryUI_(p: {}) {
    const client = useSt()
    const layout = useLayout()
    const images: string[] = client.projects
        .flatMap((p) => p.runs)
        .flatMap((r) => r.allOutputs)
        .flatMap((o) => o.images)
    // if (run == null) return null
    // const images = run.allOutputs[0]
    return (
        <div>
            <Slider
                onChange={(e) => (layout.gallerySize = parseInt(e.target.value, 10))}
                value={layout.gallerySize}
                max={1000}
                min={32}
            ></Slider>
            <div className='row wrap'>
                {images.map((i) => (
                    <Image
                        //
                        key={i}
                        width={layout.gallerySize}
                        height={layout.gallerySize}
                        src={`${client.serverHostHTTP}/view/${i}`}
                    />
                ))}
            </div>
        </div>
    )
})
