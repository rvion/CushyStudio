import { observer } from 'mobx-react-lite'
import { useLayout } from '../layout/LayoutCtx'
import { Image } from '../ui/Image'

export const PGalleryFocusUI = observer(function PGalleryFocusUI_(p: {}) {
    const layout = useLayout()
    const i = layout.galleryFocus
    // if (i == null) return <div>No Gallery Focus</div>
    return (
        <div style={{ height: '100%' }}>
            <Image
                //
                fit='contain'
                alt='prompt output'
                src={i?.comfyURL}
                key={i?.uid ?? 'none'}
            />
            ,
        </div>
    )
})
