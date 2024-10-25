import type { MediaImageL } from '../../models/MediaImage'

import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'

import { Button } from '../../csuite/button/Button'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { UI } from '../../csuite/components/UI'
import { usePanel } from '../../router/usePanel'
import { type GalleryConf, useGalleryConf } from './galleryConf'
import { GalleryImageGridUI } from './GalleryImageGridUI'
import { GalleryPreferencesUI } from './GalleryPreferencesUI'
import { GallerySearchControlsUI } from './GallerySearchControlsUI'

export type PanelGalleryProps = {
   uid?: number | string
   className?: string
   /** when not specified, it will just open the default image menu */
   onClick?: (img: MediaImageL) => void
}

export const PanelGalleryUI = observer(function PanelGalleryUI_(p: PanelGalleryProps) {
   const conf: GalleryConf = useGalleryConf()
   const panel = usePanel<PanelGalleryProps>()
   return (
      <UI.Panel //
         tw='!overflow-clip'
         className={p.className}
         style={{ background: conf.value.galleryBgColor ?? undefined }}
      >
         <UI.Panel.Header>
            <Button //
               square
               icon='mdiContentDuplicate'
               tooltip='Duplicate Panel'
               onClick={() => panel.clone({ uid: nanoid() })}
            />
            <SpacerUI />
            <GallerySearchControlsUI />
            <SpacerUI />
            <GalleryPreferencesUI />
         </UI.Panel.Header>
         <GalleryImageGridUI onClick={p.onClick} />
      </UI.Panel>
   )
})