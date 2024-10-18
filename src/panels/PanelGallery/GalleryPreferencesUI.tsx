import { observer } from 'mobx-react-lite'
import { useId } from 'react'

import { FormAsDropdownConfigUI } from '../../csuite/form/FormAsDropdownConfigUI'
import { useGalleryConf } from './galleryConf'

export const GalleryPreferencesUI = observer(function GalleryPreferencesUI_(p: {}) {
    const conf = useGalleryConf()
    return (
        <FormAsDropdownConfigUI //
            title='Gallery Options'
            form={conf}
        />
    )
})
