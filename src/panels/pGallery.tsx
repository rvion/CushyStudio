import { observer } from 'mobx-react-lite'
import { Slider } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { Image } from '../ui/Image'

export const PGalleryUI = observer(function PGalleryUI_(p: {}) {
    const st = useSt()

    return (
        <div>
            <h1>Hello</h1>
            <div className='row'>
                <label>Size</label>
                <div style={{ width: '10rem' }}>
                    <Slider
                        className='relative'
                        onChange={(next) => (st.gallerySize = next)}
                        value={st.gallerySize}
                        max={1000}
                        min={32}
                        step={1}
                    />
                </div>
                <div>{st.gallerySize}px</div>
            </div>
            <div className='row wrap gap'>
                {/* {images.length === 0 ? <>No image yet; start generating !</> : null} */}
                {st.imageURLs.map((url) => (
                    <Image
                        //
                        // onClick={() => (st.galleryFocus = i)}
                        key={url}
                        src={url}
                        width={st.gallerySize}
                        height={st.gallerySize}
                    />
                ))}
            </div>
        </div>
    )
})
