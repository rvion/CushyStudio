import type { SelectPopupProps } from './SelectPopupUI'

import { Button } from '../button/Button'
import { Frame } from '../frame/Frame'

export const SelectPopupMobileUI_Header = obs(function SelectPopupMobileUI_Header<OPTION>(
   p: SelectPopupProps<OPTION>,
): React.ReactNode {
   const label = p.selectState.p.label
   return (
      <div tw='flex flex-row gap-2 px-2'>
         <div tw='flex-1'></div>
         {Boolean(label) && (
            <Frame size='widget' tw='flex-0 text-lg font-semibold align-center'>
               {label}
            </Frame>
         )}
         <div tw='flex flex-1 flex-row justify-end'>
            <Button size='widget' onClick={() => p.reveal.close('closeButton')}>
               Fermer
            </Button>
         </div>
      </div>
   )
})
