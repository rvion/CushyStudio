import type { SelectPopupProps } from './SelectPopupUI'

import { SelectPopupUI_Create } from './SelectPopupUI_Create'
import { SelectPopupUI_Input } from './SelectPopupUI_Input'
import { SelectPopupUI_NoResults } from './SelectPopupUI_NoResults'
import { SelectPopupMobileUI_Header } from './SelectPopupMobileUI_Header'
import { SelectPopupMobileUI_Results } from './SelectPopupMobileUI_Results'

export const SelectPopupMobileUI = obs(function SelectPopupUI_<OPTION>(p: SelectPopupProps<OPTION>) {
   return (
      <div
         tw={[
            //
            'flex flex-col gap-2 py-2',
            'h-full',
            'overflow-hidden',
         ]}
         {...p.selectState.p.popupWrapperProps}
         style={{ ...p.selectState.p.popupWrapperProps?.style }}
         data-testid='SelectPopupMobileUI'
      >
         <div // Avoid colliding with the notch on iPhones
            style={{ height: 'env(safe-area-inset-top)' }}
         />
         <SelectPopupMobileUI_Header {...p} />
         <SelectPopupUI_Input {...p} />
         <SelectPopupUI_NoResults {...p} />
         <SelectPopupMobileUI_Results {...p} tw='grow px-2' />
         <SelectPopupUI_Create {...p} />
      </div>
   )
})
