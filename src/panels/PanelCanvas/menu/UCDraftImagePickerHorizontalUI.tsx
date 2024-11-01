import type { MediaImageL } from '../../../models/MediaImage'

import { observer } from 'mobx-react-lite'

import { ImageUI } from '../../../widgets/galleries/ImageUI'

type UCDraftImagePickerHorizontalUIProps = {
   size?: number
   onCLick?: (img: MediaImageL) => void
   draftID: DraftID
}

export const UCDraftImagePickerHorizontalUI: React.FC<UCDraftImagePickerHorizontalUIProps> = observer(
   function UCDraftImagePickerHorizontalUI_({ draftID, size = 64, onCLick }) {
      const draft = cushy.db.draft.get(draftID)
      if (!draft) return `❌ draft not found: ${draftID}`
      const images = draft.images
      return (
         <div tw='min-w flex flex-1 overflow-auto'>
            {images.map((image) => {
               return (
                  <ImageUI //
                     onClick={() => onCLick?.(image)}
                     style={{ flexShrink: '0' }}
                     key={image.id}
                     img={image}
                     size={size}
                  />
               )
            })}
         </div>
      )
   },
)
