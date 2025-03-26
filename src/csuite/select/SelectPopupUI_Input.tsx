import type { SelectPopupProps } from './SelectPopupUI'

import { InputStringUI } from '../input-string/InputStringUI'

export const SelectPopupUI_Input = obs(function SelectPopupUI_Input<OPTION>(p: SelectPopupProps<OPTION>) {
   const select = p.selectState
   return (
      <div
         tw={[
            //
            'minh-input p-input', // padding should simulate the difference between input size and inside size
            'flex flex-wrap items-start gap-2 overflow-auto rounded-t-md',
            // 'border-b border-gray-200',
            // 'bg-gray-100',
         ]}
      >
         {select.p.SlotDisplayValueInPopupUI != null ? (
            <select.p.SlotDisplayValueInPopupUI select={select} />
         ) : (
            p.selectState.displayValueInPopup
         )}

         {select.p.slotTextInputUI != null ? (
            <select.p.slotTextInputUI select={select} />
         ) : (
            <InputStringUI
               noColorStuff
               autoFocus
               onKeyDown={(ev) => {
                  if (ev.key === 'Backspace' && select.searchQuery === '' && select.lastValue != null) {
                     select.toggleOption(select.lastValue)
                     ev.stopPropagation()
                     ev.preventDefault()
                     return
                  }

                  // s.handleTooltipKeyDown(ev) // 🔶 already caught by the anchor!
               }}
               placeholder={select.firstValue == null ? 'Rechercher une valeur...' : undefined} // 🚂 we need a second placeholder prop
               ref={select.inputRef_real}
               type='text'
               getValue={() => select.searchQuery}
               setValue={(next) => select.filterOptions(next)}
               tw={[
                  //
                  'h-inside absolute left-0 right-0 top-0 z-50',
                  'min-w-24 flex-1',
                  // 'bg-gray-200 !rounded-none',
               ]}
               // TODO: better props passing...
               {...p.selectState.p.textInputProps}
            />
         )}
      </div>
   )
})
