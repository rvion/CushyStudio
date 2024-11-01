import { observer } from 'mobx-react-lite'

import { Frame, type FrameProps } from '../../../csuite/frame/Frame'

export const UCMenuEntryContainerUI = observer(function UCMenuEntryContainerUI_(p: FrameProps) {
   return (
      <Frame //
         tw={['flex flex-col gap-0.5 rounded-md p-1']}
         base={{ contrast: 0.1, chroma: 0.077 }}
         hover
         {...p}
      />
   )
})
