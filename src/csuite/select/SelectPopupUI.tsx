import type { RevealState } from '../reveal/RevealState'
import type { SelectProps } from './SelectProps'
import type { AutoCompleteSelectState } from './SelectState'

import { csuiteConfig } from '../config/configureCsuite'
import { SelectPopupUI_Create } from './SelectPopupUI_Create'
import { SelectPopupUI_Input } from './SelectPopupUI_Input'
import { SelectPopupUI_NoResults } from './SelectPopupUI_NoResults'
import { SelectPopupUI_Results } from './SelectPopupUI_Results'

const trueMinWidth: '2rem' = '2rem'

export type SelectPopupProps<OPTION> = {
   reveal: RevealState
   selectState: AutoCompleteSelectState<OPTION>
   createOption: SelectProps<OPTION>['createOption']
}

export const SelectPopupUI = obs(function SelectPopupUI_<OPTION>(p: SelectPopupProps<OPTION>) {
   const select = p.selectState
   const minWidth =
      select.anchorRef.current?.clientWidth != null //
         ? `max(${select.anchorRef.current.offsetWidth /* take into account border width */}px, ${trueMinWidth})`
         : trueMinWidth

   return (
      <div
         tw={[
            //
            'flex flex-col',
            'max-w-xl',
            'overflow-hidden',
         ]}
         {...p.selectState.p.popupWrapperProps}
         style={{ minWidth, ...p.selectState.p.popupWrapperProps?.style }}
         data-testid='SelectPopupUI'
      >
         {p.reveal.pos.finalPlacementLogic === 'cover' ? (
            <>
               <SelectPopupUI_Input {...p} />
               <SelectPopupUI_NoResults {...p} />
               <SelectPopupUI_Results {...p} />
               <SelectPopupUI_Create {...p} />
            </>
         ) : (
            <>
               <SelectPopupUI_NoResults {...p} />
               <SelectPopupUI_Results {...p} />
               <SelectPopupUI_Create {...p} />
               <SelectPopupUI_Input {...p} />
            </>
         )}
      </div>
   )
})

export const FixedSlot = obs(function CreateSlot<OPTION>(p: { children?: React.ReactNode }) {
   return (
      <div
         tw={[
            // 🚂 ?
            'minh-input p-input',
            'flex shrink-0 flex-wrap items-start gap-2 overflow-auto rounded-t-md',
         ]}
         // 🛋️
         // className='h-input gap-1 px-2 text-base'
      >
         {p.children}
      </div>
   )
})

export const CreateButton = obs(function CreateButton<OPTION>(p: {
   select: AutoCompleteSelectState<OPTION>
}) {
   return (
      <button
         tw='inline border-none bg-transparent text-base text-sky-700 hover:text-sky-700 hover:underline'
         onClick={() => p.select.createOption()}
      >
         {p.select.p.createOption?.label?.() ?? csuiteConfig.i18n.ui.select.create}
      </button>
   )
})
