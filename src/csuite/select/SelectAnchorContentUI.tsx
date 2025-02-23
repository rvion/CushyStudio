import type { AutoCompleteSelectState } from './SelectState'

import { observer } from 'mobx-react-lite'

import { SelectValueContainerUI } from './SelectValueContainerUI'

export const SelectAnchorContentUI = observer(function SelectAnchorContentUI_<OPTION>(p: {
   /** since 2024-12-10 */
   fullyShrinkable?: boolean
   select: AutoCompleteSelectState<OPTION>
}) {
   if (p.select.p.slotDisplayValueUI != null) return <p.select.p.slotDisplayValueUI select={p.select} />
   const displayValue = p.select.displayValueInAnchor

   const meaningfullContent = (
      <SelectValueContainerUI valuesCount={p.select.values.length} wrap={p.select.p.wrap ?? false}>
         {displayValue}
      </SelectValueContainerUI>
   )

   if (p.fullyShrinkable) {
      return (
         <div tw={['w-full', 'grid', 'p-input-2']} style={{ gridTemplateColumns: '1fr' }}>
            {meaningfullContent}
         </div>
      )
   } else {
      return meaningfullContent
   }
})
