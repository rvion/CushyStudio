import { observer } from 'mobx-react-lite'
import { useId } from 'react'

import { FormAsDropdownConfigUI } from '../../csuite/form/FormAsDropdownConfigUI'
import { ProvenanceCtx } from '../../csuite/provenance/Provenance'
import { useGalleryConf } from './galleryConf'

export const GalleryPreferencesUI = observer(function GalleryPreferencesUI_(p: {}) {
   const conf = useGalleryConf()
   return (
      <ProvenanceCtx.Provider
         value={{ open: () => cushy.openInVSCode('src/panels/PanelGallery/galleryConf.tsx' as RelativePath) }}
      >
         <FormAsDropdownConfigUI //
            title='Gallery Options'
            form={conf}
         />
      </ProvenanceCtx.Provider>
   )
})
