import type { RevealState } from '../reveal/RevealState'
import type { SelectProps } from './SelectProps'
import type { AutoCompleteSelectState } from './SelectState'

import { observer } from 'mobx-react-lite'
import { FixedSizeList } from 'react-window'

import { csuiteConfig } from '../config/configureCsuite'
import { Frame } from '../frame/Frame'
import { InputStringUI } from '../input-string/InputStringUI'
import { SelectAllNoneUI, SelectOptionUI, SelectOptionUI_FixedList } from './SelectOptionUI'

const trueMinWidth: '2rem' = '2rem'

export type SelectPopupProps<OPTION> = {
   reveal: RevealState
   selectState: AutoCompleteSelectState<OPTION>
   createOption: SelectProps<OPTION>['createOption']
}

export const SelectPopupUI = observer(function SelectPopupUI_<OPTION>(p: SelectPopupProps<OPTION>) {
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

export const FixedSlot = observer(function CreateSlot<OPTION>(p: { children?: React.ReactNode }) {
   return <div className='h-input gap-1 px-2 text-base'>{p.children}</div>
})

export const CreateButton = observer(function CreateButton<OPTION>(p: {
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

export const SelectPopupUI_Input = observer(function SelectPopupUI_Input<OPTION>(
   p: SelectPopupProps<OPTION>,
) {
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

export const SelectPopupUI_NoResults = observer(function SelectPopupUI_NoResults<OPTION>(
   p: SelectPopupProps<OPTION>,
): React.ReactNode {
   const select = p.selectState

   return select.filteredOptions.length === 0 //
      ? (select.p.slotPlaceholderWhenNoResults ?? (
           <FixedSlot>
              {csuiteConfig.i18n.ui.select.noResults}
              {p.createOption != null && p.createOption.isActive?.() !== false && (
                 <>
                    {' '}
                    - <CreateButton select={select} />
                 </>
              )}
           </FixedSlot>
        ))
      : null
})

export const SelectPopupUI_Results = observer(function SelectPopupUI_Results<OPTION>(
   p: SelectPopupProps<OPTION>,
): React.ReactNode {
   const select = p.selectState
   const itemSize = typeof select.p.virtualized === 'number' ? select.p.virtualized : 28 // should probably match input height or cell height
   const showSelectAll =
      select.filteredOptions.length > 1 && select.p.showSelectAllNone !== false && select.isMultiSelect

   return select.p.slotResultsListUI != null ? (
      <select.p.slotResultsListUI select={select} />
   ) : select.p.virtualized !== false ? (
      select.filteredOptions.length !== 0 && (
         <>
            {showSelectAll && <SelectAllNoneUI tw='mt-2' state={select} />}
            <FixedSizeList<{
               s: AutoCompleteSelectState<OPTION>
               reveal: RevealState
            }>
               className={`mb-1 ${showSelectAll ? 'mt-1' : 'mt-2'}`}
               useIsScrolling={false}
               height={Math.min(
                  400,
                  itemSize /* temp hack to leave place for soon-to-be input */ *
                     select.filteredOptions.length,
               )}
               itemCount={select.filteredOptions.length}
               itemSize={itemSize}
               width='100%'
               children={SelectOptionUI_FixedList}
               itemData={{ s: select, reveal: p.reveal }}
            />
         </>
      )
   ) : (
      select.filteredOptions.length !== 0 && (
         <>
            {showSelectAll && <SelectAllNoneUI tw='mt-2' state={select} />}
            <Frame col tw='max-h-96 pb-1 pt-2'>
               {select.filteredOptions.map((option, index) =>
                  select.p.slotOptionUI != null ? (
                     <select.p.slotOptionUI //
                        key={select.getKey(option)}
                        index={index}
                        option={option}
                        state={select}
                        reveal={p.reveal}
                     />
                  ) : (
                     <SelectOptionUI<OPTION> //
                        key={select.getKey(option)}
                        index={index}
                        reveal={p.reveal}
                        option={option}
                        state={select}
                     />
                  ),
               )}
            </Frame>
         </>
      )
   )
})

export const SelectPopupUI_Create = observer(function SelectPopupUI_Create<OPTION>(
   p: SelectPopupProps<OPTION>,
): React.ReactNode {
   const select = p.selectState

   return (
      select.filteredOptions.length > 0 &&
      p.createOption != null &&
      p.createOption.isActive?.() !== false && (
         <FixedSlot>
            <CreateButton select={select} />
         </FixedSlot>
      )
   )
})
