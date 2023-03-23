import { Image } from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'
import { useLayout } from '../layout/LayoutCtx'

export const PGalleryFocusUI = observer(function PGalleryFocusUI_(p: {}) {
    const layout = useLayout()
    const i = layout.galleryFocus
    if (i == null) return <div>No Gallery Focus</div>
    return (
        <div>
            <Image
                //
                fit='contain'
                height={'100%'}
                alt='prompt output'
                src={i.url}
                key={i.uid}
            />
            ,
        </div>
    )
})
