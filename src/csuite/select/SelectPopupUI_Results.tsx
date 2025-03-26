import type { RevealState } from '../reveal/RevealState'
import type { SelectPopupProps } from './SelectPopupUI'
import type { AutoCompleteSelectState } from './SelectState'

import { FixedSizeList } from 'react-window'

import { Frame } from '../frame/Frame'
import { SelectAllNoneUI, SelectOptionUI, SelectOptionUI_FixedList } from './SelectOptionUI'

export const SelectPopupUI_Results = obs(function SelectPopupUI_Results<OPTION>(
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
                     <SelectOptionUI<OPTION>
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
