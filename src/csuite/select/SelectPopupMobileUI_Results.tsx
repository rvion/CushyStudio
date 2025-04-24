import type { RevealState } from '../reveal/RevealState'
import type { SelectPopupProps } from './SelectPopupUI'
import type { AutoCompleteSelectState } from './SelectState'

import { runInAction } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import { FixedSizeList } from 'react-window'
import { useDebounced } from '../handle/VarHandleDebounced'
import { SelectAllNoneUI, SelectOptionUI_FixedList } from './SelectOptionUI'

export const SelectPopupMobileUI_Results = obs(function SelectPopupMobileUI_Results_<OPTION>(
   p: SelectPopupProps<OPTION> & { className?: string },
): React.ReactNode {
   const select = p.selectState
   const itemSize = typeof select.p.virtualized === 'number' ? select.p.virtualized : 28 // should probably match input height or cell height
   const showSelectAll =
      select.filteredOptions.length > 1 && select.p.showSelectAllNone !== false && select.isMultiSelect
   const uiSt = useLocalObservable(() => ({
      height: Math.min(
         400,
         itemSize /* temp hack to leave place for soon-to-be input */ * select.filteredOptions.length,
      ),
   }))
   const debouncedHeight = useDebounced(
      {
         get: () => uiSt.height,
         set: (v) => {
            uiSt.height = v
         },
      },
      { delay: 200, deps: [] },
   )

   if (select.p.slotResultsListUI != null) return <select.p.slotResultsListUI select={select} />
   if (select.filteredOptions.length === 0) return null

   return (
      <div tw={[p.className, 'flex h-full shrink grow flex-col overflow-hidden']}>
         {showSelectAll && <SelectAllNoneUI tw='mt-2 shrink-0 grow-0' state={select} />}
         <div
            tw={['h-full shrink grow', `mb-1 ${showSelectAll ? 'mt-1' : 'mt-2'}`]}
            ref={(element: HTMLDivElement | null) => {
               if (element == null) return
               const observer = new ResizeObserver(() => {
                  debouncedHeight.set(element.clientHeight)
               })
               observer.observe(element)
               runInAction(() => {
                  uiSt.height = element.clientHeight
               })

               return () => {
                  observer.disconnect()
               }
            }}
         >
            <FixedSizeList<{
               s: AutoCompleteSelectState<OPTION>
               reveal: RevealState
            }>
               useIsScrolling={false}
               height={uiSt.height}
               itemCount={select.filteredOptions.length}
               itemSize={itemSize}
               width='100%'
               children={SelectOptionUI_FixedList}
               itemData={{ s: select, reveal: p.reveal }}
            />
         </div>
      </div>
   )
})
